---
title: External Configuration Store Pattern
aliases: [External Config Store, Centralized Configuration, Config Externalization, Feature Flags Config]
tags: [SystemDesign, CloudDesignPatterns, DesignAndImplementation, ExternalConfigStore]
domain: SystemDesign
difficulty: Intermediate
created: 2026-07-26
related: [Secret_Management, Kubernetes_for_SD, Serverless_Architecture, Feature_Flags]
status: complete
---

# 🗃️ External Configuration Store Pattern

> [!abstract] TL;DR
> Move all configuration (environment variables, feature flags, tuning parameters, connection strings) out of application deployment packages into a centralized, externally managed store. Change config without redeploying. All instances of all services read from one source of truth.

## Intent

Externalize application configuration into a dedicated configuration store that is independently versioned, access-controlled, and updatable at runtime without requiring application redeployment.

---

## Problem It Solves

Configuration hardcoded in applications or bundled in deployment artifacts creates a tight coupling between configuration changes and code deployments:

- **Redeployment required for any config change** — changing a feature flag, timeout value, or connection string requires a full build-test-deploy cycle (potentially 30–60 minutes)
- **Config-in-code security risk** — database passwords, API keys, and secrets end up in version control or container images
- **No environment isolation** — dev/staging/prod differences require different build artifacts or fragile environment variable injection at deploy time
- **Inconsistency across instances** — multiple running instances may have different configs if they were deployed at different times
- **No audit trail** — who changed what config value, when, and why?
- **No dynamic runtime behavior** — enabling a feature requires a new deployment; disabling a runaway feature requires a rollback

---

## Solution / How It Works

Applications fetch configuration from a centralized external store at startup (and optionally at runtime via dynamic refresh). The store is managed independently of the application lifecycle.

```mermaid
flowchart TD
    subgraph Operators["Ops / DevOps Team"]
        DEV["Developer / SRE\nUpdates config value"]
    end

    subgraph ConfigStore["External Config Store\n(etcd / Consul / Parameter Store / App Configuration)"]
        CFG["Configuration:\nDB_HOST: prod-db.internal\nFEATURE_X: true\nMAX_CONNECTIONS: 100\nAPI_TIMEOUT_MS: 5000"]
    end

    subgraph AppInstances["Application Instances"]
        A1["App Instance 1"]
        A2["App Instance 2"]
        A3["App Instance 3"]
    end

    DEV -->|write config| CFG
    CFG -->|read on startup| A1
    CFG -->|read on startup| A2
    CFG -->|read on startup| A3
    CFG -.->|push notification\n(watch/subscribe)| A1
    CFG -.->|push notification\n(watch/subscribe)| A2
```

**Configuration store technologies:**

| Technology | Best For | Dynamic Refresh | Secret Storage |
|-----------|---------|----------------|----------------|
| etcd | Kubernetes-native config; service discovery | YES (watch) | Limited |
| Consul (HashiCorp) | Multi-datacenter; service mesh config | YES (watch) | Via Vault integration |
| AWS SSM Parameter Store | AWS workloads; standard config + secrets | Polling or EventBridge | YES (SecureString with KMS) |
| AWS AppConfig | Feature flags; deployment-gated config changes | YES (hosted agents) | No (use Parameter Store) |
| Azure App Configuration | Azure workloads; feature management | YES (Event Grid) | Key Vault references |
| [[Kubernetes_for_SD|Kubernetes]] ConfigMap | Container config; file-mounted or env-var | Limited (pod restart) | No (use Secret) |
| Kubernetes Secret | Sensitive config; K8s-native | Limited (pod restart) | YES (encrypted at rest in etcd) |
| HashiCorp Vault | Secrets, dynamic credentials, PKI | YES (lease renewal) | YES (primary use case) |
| LaunchDarkly | Feature flags with targeting rules | Real-time streaming | No |

**Configuration types and their homes:**

| Config Type | Example | Recommended Store |
|------------|---------|------------------|
| Non-sensitive tuning | `MAX_POOL_SIZE=20` | ConfigMap / Parameter Store (Standard) |
| Feature flags | `ENABLE_NEW_CHECKOUT=true` | AppConfig / LaunchDarkly |
| Connection strings | `DB_HOST=db.internal` | Parameter Store / Consul |
| Secrets / credentials | `DB_PASSWORD=...` | Vault / Parameter Store SecureString / K8s Secret |
| Dynamic runtime config | `RATE_LIMIT_PER_USER=100` | AppConfig / Consul with watch |

---

## When to Use

- Multiple service instances that must share identical configuration without per-instance drift
- Need to change configuration without triggering a new deployment cycle
- Feature flags that enable/disable functionality for specific user cohorts without redeploying
- Secrets that must be rotated regularly (database passwords, API keys) without downtime
- Multi-environment setups (dev/staging/prod) where the same application code runs with different config
- Audit requirements — regulatory compliance demanding a log of who changed what configuration value

---

## When NOT to Use

- Simple single-instance applications with infrequent config changes — the operational overhead of an external store isn't justified
- Configurations that are truly static and never change (mathematical constants, schema version identifiers baked into code)
- Ultra-low-latency paths where even a cached config lookup adds unacceptable overhead — embed those constants in code
- When the config store itself becomes a single point of failure and no fallback is designed — always plan for config store unavailability

---

## Real-World Example

**Kubernetes ConfigMaps and Secrets:**
A Spring Boot microservice running in Kubernetes mounts its `application.properties` from a ConfigMap and its database credentials from a Secret. Changing `MAX_THREADS=10` to `MAX_THREADS=20` requires only updating the ConfigMap and triggering a rolling restart — no new Docker image needed. The Secret value for `DB_PASSWORD` is stored encrypted in etcd and injected as an environment variable at runtime.

**AWS Systems Manager Parameter Store + Spring Cloud AWS:**
A Java service fetches all its `/prod/myapp/*` parameters from SSM Parameter Store on startup using Spring Cloud AWS Config. Parameters are versioned in SSM (full history). The DevOps team updates `/prod/myapp/feature.new_checkout=true` via the AWS Console or Terraform. At next startup (or on demand via actuator refresh), instances pick up the new value. SecureString parameters (passwords) are encrypted with KMS — the service's IAM role grants `ssm:GetParameter` and `kms:Decrypt` permissions.

**LaunchDarkly Feature Flags:**
LaunchDarkly streams flag state to the SDK embedded in each service. Changing a flag value in the LaunchDarkly UI propagates to all SDK instances within ~200ms via Server-Sent Events — no deployment, no restart. Flags can target specific user IDs, percentages of traffic, or attribute-based rules. Emergency "kill switch" flags disable problematic features instantly without a rollback.

---

## Trade-offs

| Benefit | Drawback |
|---------|----------|
| Config changes without redeployment — faster iteration | Config store is now a dependency; if it's down, apps may fail to start or lose config |
| Single source of truth — all instances read same values | Application must handle config store unavailability gracefully (cache last-known values) |
| Audit trail — every config change logged with timestamp and author | Added operational complexity — another system to run, monitor, and secure |
| Secret rotation without downtime | Dynamic refresh requires careful app design to avoid partial-refresh states |
| Environment isolation (dev/staging/prod use different paths) | Config store must be highly available (3-node etcd cluster, multi-AZ Parameter Store) |
| Feature flags enable trunk-based development | Secrets in config store still need strong access control and encryption at rest |
| Centralized access control — one IAM policy per service | Config sprawl — without discipline, hundreds of config values become unmanageable |

---

## Implementation Considerations

1. **Separate config categories by sensitivity** — use different stores or paths for non-sensitive config (ConfigMap) vs. sensitive secrets (Vault/K8s Secret/Parameter Store SecureString). Never mix plaintext and secret in the same store entry.
2. **Design for config store unavailability** — cache the last successfully fetched config in memory. If the config store is unreachable at startup, fail fast with a clear error. If it goes down at runtime, use the cached values.
3. **Dynamic refresh with care** — when refreshing config at runtime (not on restart), be wary of partial state: if half the app instances have the new value and half have the old, you may have inconsistent behavior. Use feature flag systems designed for this (they handle gradual rollout).
4. **Config versioning and rollback** — Parameter Store and App Configuration keep version history. Document rollback procedures: if a bad config value causes incidents, the team should be able to revert in < 2 minutes.
5. **Naming conventions** — adopt a hierarchy: `/{environment}/{service}/{config-key}` (e.g., `/prod/user-service/max-connections`). Consistent namespacing prevents collisions and simplifies IAM policies (grant access to `/prod/user-service/*`).
6. **Bootstrap config** — the application needs to know how to reach the config store before it can fetch config from it. This "bootstrap config" (config store URL, credentials) must still be injected via environment variable or a minimal local file.

---

## Common Pitfalls

- **Config store as single point of failure** — application fails to start if config store is unreachable, with no fallback. Always implement retry with backoff and a startup timeout, plus a local cache of last-known-good values.
- **Secrets in plaintext config** — putting database passwords in an unencrypted ConfigMap or a plain-text Parameter Store entry. Always use encrypted secret stores for credentials.
- **No config change review process** — unrestricted ability to change production config values leads to accidental configuration incidents. Require PR review for critical config changes; use approval workflows in AppConfig.
- **Config explosion** — hundreds of fine-grained config values that nobody remembers the purpose of. Document every config value with description, valid range, and default. Periodically purge unused values.
- **Dynamic refresh causing thundering herd** — if all instances simultaneously detect a config change and reload, they all hit the config store at once. Use jitter in the refresh polling interval.
- **Missing config in new environments** — deploying to a new environment and forgetting to create the config store entries for that environment. Use infrastructure-as-code (Terraform) to create all required config entries alongside service deployment.

---

## Related Concepts

- [[_MOC_Cloud_Design_Patterns|↑ Section MOC]]
- [[Secret_Management]] — the security-focused specialization: Vault, KMS, secret rotation; External Config Store is the broader pattern
- [[Kubernetes_for_SD]] — ConfigMaps and Secrets are Kubernetes' built-in implementations of this pattern
- [[Serverless_Architecture]] — Lambda functions fetch config from Parameter Store or AppConfig; external config is especially important when code packages are immutable
- [[Feature_Flags]] — a specialized use case of the External Config Store pattern; feature flags are config values that toggle behavior at runtime
- [[External_Config_Store]] — this note; related to 12-Factor App methodology ("store config in the environment")
- [[Sidecar_Pattern]] — config sidecars (like Dapr's config building block) can handle config fetching and caching on behalf of application containers

---

## Review Questions

1. **A production incident is caused by a misconfigured timeout value hardcoded in a service's Docker image. The fix requires building a new image, pushing it, and triggering a rolling deployment — 45 minutes total. Redesign the configuration strategy using the External Config Store pattern. What changes at the infrastructure level, and how does the time-to-fix change?**

2. **You need to gradually roll out a new payment flow feature to 10% of users, increasing to 50%, then 100% over 3 days — with the ability to immediately kill the feature if error rates spike. Which external config store technology is best suited for this, and why is a simple environment variable or ConfigMap insufficient?**

3. **What is the "bootstrap problem" in the External Config Store pattern, and how do you solve it? Give a concrete example where the solution breaks down and how you handle that edge case.**

---

## Sources

- [Microsoft Azure: External Configuration Store Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/external-configuration-store)
- [The Twelve-Factor App: Config](https://12factor.net/config)
- [HashiCorp Vault Documentation](https://developer.hashicorp.com/vault/docs)
- [AWS AppConfig Documentation](https://docs.aws.amazon.com/appconfig/latest/userguide/)

#SystemDesign #CloudDesignPatterns #DesignAndImplementation #ExternalConfigStore #FeatureFlags #SecretManagement #12FactorApp
