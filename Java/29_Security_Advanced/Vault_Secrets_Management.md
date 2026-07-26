---
title: "Vault Secrets Management"
aliases: ["HashiCorp Vault", "Spring Cloud Vault", "Secrets Management Java"]
tags: [java, spring, security, vault, secrets, advanced]
domain: Java
difficulty: advanced
created: 2026-07-26
related: ["[[OWASP_Top_10_Java]]", "[[Cryptography_Java]]", "[[Spring_Cloud_Config]]", "[[_MOC_Security_Advanced]]"]
status: complete
---

# 🔐 Vault Secrets Management

> [!abstract] TL;DR
> **HashiCorp Vault** is a secrets management platform that stores, rotates, and audits access to sensitive credentials. Instead of hard-coding database passwords in `application.yml` or environment variables, Java applications authenticate to Vault and retrieve credentials at startup (static secrets) or on-demand (dynamic secrets — Vault creates ephemeral database users that expire after a TTL). Spring Cloud Vault provides first-class Spring Boot integration.

## Intuition — analogy FIRST

Traditional secrets management is like giving every employee a master key (database password) written on a sticky note — everyone has a copy, it never changes, and when an employee leaves you must hope they lost the note. HashiCorp Vault is like a **high-security key locker with an audit log**. Each application authenticates to the locker (AppRole), receives a time-limited key (dynamic secret), uses it, and the key self-destructs when the TTL expires. Every access is logged: who got which key, when, and for how long.

**Dynamic secrets** are Vault's most powerful feature. Instead of a static `DB_PASSWORD=abc123`, Vault connects to PostgreSQL and creates a unique user `v-app-xyz-123` with a 24-hour TTL. Your application uses that user; after 24 hours Vault revokes it. If the credential leaks, it's useless the next day.

---

## How It Works

```mermaid
graph TD
    App["Spring Boot App\n(startup)"] -->|"1. AppRole authenticate"| Vault["HashiCorp Vault\n(secrets engine)"]
    Vault -->|"2. Vault Token (TTL)"| App
    App -->|"3. Read secret path"| KV["KV Secrets Engine\n(static key-value)"]
    App -->|"3. Request DB creds"| DB_Eng["DB Secrets Engine\n(dynamic credentials)"]
    DB_Eng -->|"4. CREATE USER"| Postgres["PostgreSQL\n(real DB)"]
    Postgres -->|"ephemeral user+pass"| DB_Eng
    DB_Eng -->|"5. Temporary creds (TTL=24h)"| App
    App -->|"connect with temp creds"| Postgres

    Vault -->|"auto-revoke after TTL"| Postgres

    style App fill:#4a9eff,color:#fff
    style Vault fill:#7c3aed,color:#fff
    style KV fill:#7ed321,color:#fff
    style DB_Eng fill:#e64980,color:#fff
    style Postgres fill:#f5a623,color:#fff
```

## Key Concepts / Details

### Vault Architecture

| Concept | Description |
|---------|-------------|
| **Secrets Engine** | Plugin that stores/generates/encrypts secrets (KV, Database, PKI, Transit) |
| **Auth Method** | How applications authenticate to Vault (AppRole, Kubernetes, AWS IAM, Token) |
| **Policy** | ACL defining what paths an authenticated entity can read/write |
| **Lease/TTL** | Secrets have a time-to-live; Vault auto-revokes expired credentials |
| **Audit Log** | Immutable log of every secret access — who, what, when |

### Spring Cloud Vault — Dependency

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-vault-config</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-vault-config-databases</artifactId>
</dependency>
```

### application.yml — Vault Configuration

```yaml
spring:
  config:
    import: "vault://"
  cloud:
    vault:
      uri: https://vault.mycompany.com:8200
      authentication: APPROLE
      app-role:
        role-id: ${VAULT_ROLE_ID}
        secret-id: ${VAULT_SECRET_ID}
      kv:
        enabled: true
        backend: secret
        default-context: order-service  # reads secret/order-service/*
      database:
        enabled: true
        role: order-service-role        # Vault DB role for dynamic creds
        backend: database
```

### Reading Static Secrets (KV Engine)

```bash
# Store a secret in Vault KV v2
vault kv put secret/order-service \
  stripe_api_key=sk_live_abc123 \
  sendgrid_api_key=SG.xyz456
```

```java
// Spring auto-injects Vault KV secrets as regular properties
@ConfigurationProperties(prefix = "stripe")
public class StripeConfig {
    private String apiKey;  // bound to stripe.api-key from Vault path

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }
}
```

### Dynamic Database Credentials

```bash
# Vault setup — configure database engine
vault secrets enable database

vault write database/config/my-postgresql-database \
  plugin_name=postgresql-database-plugin \
  allowed_roles="order-service-role" \
  connection_url="postgresql://{{username}}:{{password}}@postgres:5432/appdb" \
  username="vault-admin" \
  password="vault-admin-password"

vault write database/roles/order-service-role \
  db_name=my-postgresql-database \
  creation_statements="CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT,INSERT,UPDATE ON ALL TABLES IN SCHEMA public TO \"{{name}}\";" \
  default_ttl="24h" \
  max_ttl="48h"
```

Spring Cloud Vault fetches these credentials at startup and Spring DataSource is configured with the temporary credentials.

### AppRole Authentication (Production)

```bash
# Create a policy for order-service
vault policy write order-service-policy - <<EOF
path "secret/data/order-service/*" {
  capabilities = ["read"]
}
path "database/creds/order-service-role" {
  capabilities = ["read"]
}
EOF

# Create an AppRole
vault auth enable approle
vault write auth/approle/role/order-service \
  token_policies="order-service-policy" \
  token_ttl=1h \
  token_max_ttl=4h

# Get credentials to inject into the application
vault read auth/approle/role/order-service/role-id
vault write -f auth/approle/role/order-service/secret-id
```

### Kubernetes Auth Method (Preferred in K8s)

```yaml
# In Kubernetes environments, use service account tokens instead of AppRole
spring:
  cloud:
    vault:
      authentication: KUBERNETES
      kubernetes:
        role: order-service
        kubernetes-path: kubernetes
        service-account-token-file: /var/run/secrets/kubernetes.io/serviceaccount/token
```

No VAULT_SECRET_ID needed — the pod's Kubernetes service account token authenticates.

### Vault Agent Sidecar (Alternative to Spring Cloud Vault)

```yaml
# Kubernetes deployment with Vault Agent injector
spec:
  template:
    metadata:
      annotations:
        vault.hashicorp.com/agent-inject: "true"
        vault.hashicorp.com/role: "order-service"
        vault.hashicorp.com/agent-inject-secret-db: "database/creds/order-service-role"
        vault.hashicorp.com/agent-inject-template-db: |
          {{- with secret "database/creds/order-service-role" -}}
          spring.datasource.username={{ .Data.username }}
          spring.datasource.password={{ .Data.password }}
          {{- end -}}
```

The Vault Agent sidecar writes the template as a file; Spring Boot reads it as a config file.

### Secrets Comparison

| Solution | Security | Rotation | Dynamic? | Audit log |
|----------|----------|----------|----------|-----------|
| **Env variable** | Low — visible in process list | Manual | No | No |
| **Kubernetes Secret** | Medium — base64, not encrypted by default | Manual | No | Limited |
| **AWS Secrets Manager** | High | Automatic | No (static) | CloudTrail |
| **AWS Parameter Store** | Medium | Manual | No | CloudTrail |
| **HashiCorp Vault** | High | Automatic | Yes | Yes (immutable) |

## Real-World Notes

- **Vault is complex to operate** — Vault is powerful but requires HA setup, unsealing, backup, and monitoring. Managed alternatives (HCP Vault, AWS Secrets Manager) reduce operational overhead.
- **Secret zero problem** — AppRole role-id and secret-id must still be injected into the application somehow. Use Kubernetes service account auth to eliminate this bootstrapping problem entirely.
- **Lease renewal** — dynamic secrets must be renewed before they expire or the application loses database access. Spring Cloud Vault handles renewal automatically.
- **Transit secrets engine as "crypto as a service"** — Vault's Transit engine can encrypt/decrypt data without your application ever seeing the encryption key, which never leaves Vault.

## Common Pitfalls

- **Running Vault in dev mode in production** — `vault server -dev` stores all secrets in memory, unencrypted. Never use dev mode outside local development.
- **Not configuring `fail-fast`** — if Vault is unavailable at startup and the application continues, it may run with no secrets configured. Set `spring.cloud.vault.fail-fast=true`.
- **Using root token for application authentication** — the root token has unrestricted access. Applications must use AppRole or Kubernetes auth with a narrowly-scoped policy.
- **Forgetting to renew leases** — dynamic secret leases expire; if not renewed, the database user is revoked and connections fail. Monitor lease expiry and configure auto-renewal.

## Related Concepts
- [[Spring_Cloud_Config]] — Vault can also be a backend for Spring Cloud Config Server
- [[OWASP_Top_10_Java]] — A02 (Cryptographic Failures) includes secrets in code/config
- [[Kubernetes_Java]] — Vault Agent Sidecar integrates directly with K8s Pods

## Review Questions
1. What is the difference between static secrets (KV engine) and dynamic secrets (Database engine) in Vault?
2. Why is AppRole the preferred authentication method for non-Kubernetes deployments?
3. What does a Vault lease TTL mean and what happens when a dynamic secret's TTL expires?

## Sources
- HashiCorp Vault Documentation — https://developer.hashicorp.com/vault/docs
- Spring Cloud Vault Reference — https://docs.spring.io/spring-cloud-vault/docs/current/reference/html/
- Vault Agent Injector — https://developer.hashicorp.com/vault/docs/platform/k8s/injector

#java #spring #security #vault #secrets #hashicorp #dynamic-secrets
