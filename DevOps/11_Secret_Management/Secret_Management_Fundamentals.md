---
title: Secret Management Fundamentals
aliases: [Secrets Management, Credential Management, Secrets Sprawl, Secret Rotation]
tags: [DevOps, Security, SecretsManagement, LeastPrivilege]
domain: DevOps
difficulty: Intermediate
created: 2026-07-28
related: [HashiCorp_Vault, Kubernetes_Secrets, SOPS_and_Git_Secret_Management, AWS_Azure_Secret_Services]
status: complete
---

# 🔐 Secret Management Fundamentals

> [!abstract] TL;DR
> A **secret** is any credential that grants access — API keys, database passwords, TLS certs, SSH keys, OAuth tokens. The core problem is **secrets sprawl**: they end up hardcoded in source code, baked into container images, emailed around, and duplicated across environments. Good secrets management means centralised storage with encryption-at-rest, fine-grained RBAC, automatic rotation, and a full audit trail for every access event. The anti-pattern is any secret committed to Git — even once, it lives in history forever.

---

## Intuition — analogy FIRST

Think of secrets like hotel master keys. A single master key can open every room — so you don't hand it to every cleaner. Instead, you issue **scoped key cards** per cleaner per floor, with an expiry time, logged every time they're used. If a card is cloned, you rotate only that card's access pattern. Secrets management applies the same logic: issue scoped, short-lived credentials, revoke immediately on compromise, and record every use.

---

## How It Works

```mermaid
graph TD
    subgraph "Secrets Sprawl — Anti-Pattern"
        DEV["Developer"]:::bad
        REPO["Git Repository\n(hardcoded creds)"]:::bad
        CI["CI Pipeline\n(env vars in logs)"]:::bad
        SLACK["Slack/Email\n(shared credentials)"]:::bad
        DEV --> REPO & CI & SLACK
    end

    subgraph "Centralised Secrets Management"
        APP["Application / Workload"]:::good
        SM["Secrets Manager\n(Vault / AWS SM / Azure KV)"]:::good
        KMS["KMS / HSM\n(encryption key)"]:::good
        AUDIT["Audit Log\n(who accessed what, when)"]:::good
        ROTATE["Auto-Rotation\n(DB creds, API keys)"]:::good
        APP -->|"authenticate (identity)"| SM
        SM -->|"issues short-lived secret"| APP
        SM --> KMS
        SM --> AUDIT
        SM --> ROTATE
    end

    classDef bad fill:#4a0000,stroke:#e74c3c,color:#ffcccc
    classDef good fill:#0a2e1a,stroke:#2ecc71,color:#90ee90
```

---

## Key Concepts / Details

### What Counts as a Secret

| Category | Examples |
|----------|---------|
| **Database credentials** | DB_PASSWORD, connection strings |
| **API keys** | Stripe keys, Twilio tokens, OpenAI keys |
| **Cryptographic material** | TLS private keys, SSH private keys, JWT signing keys |
| **Cloud credentials** | AWS Access Key ID + Secret, GCP service account JSON |
| **OAuth / SSO** | Client secrets, refresh tokens |
| **Encryption keys** | AES master keys, KMS key aliases |

### The Hardcoded Secret Anti-Pattern

```bash
# WRONG — never do this
DATABASE_URL="postgresql://admin:SuperSecret123@prod-db:5432/myapp"

# Worse — committed to Git — lives in history FOREVER
git log --all -p -- .env | grep PASSWORD   # Attackers run this exact command
```

**Why Git history is permanent:** even after `git rm`, the secret exists in every clone, fork, and cached ref. Mitigation: rotate immediately, use `git-filter-repo` to rewrite history, force-push, and invalidate all forks.

### Least-Privilege Principle

```yaml
# Bad: application gets root DB access
DB_USER: admin
DB_PASS: rootpassword

# Good: application gets a scoped, time-limited credential
# Vault dynamic secret — expires in 1 hour, can INSERT/SELECT only
DB_USER: v-appserver-readonly-hTz3k
DB_PASS: <generated, unique per instance>
```

Rules of thumb:
- Applications should not share credentials
- Each microservice gets its own secret path and identity
- Prefer **dynamic secrets** (generated per-request, auto-expire) over static credentials
- Use **workload identity** (IAM role, K8s ServiceAccount) over long-lived API keys

### Secret Rotation

```
Static credential lifecycle:
  Issue → Use → [Never rotate] → Breach → Panic

Dynamic credential lifecycle:
  Issue (TTL=1h) → Use → Expire → Issue new → ...
  Breach impact: credential already expired
```

**Rotation strategies:**

| Strategy | How | Tool |
|---------|-----|------|
| **Immediate rotation** | Revoke and reissue now | Vault, AWS Secrets Manager |
| **Scheduled rotation** | Lambda triggers on schedule | AWS Secrets Manager |
| **Dynamic secrets** | New credential per lease, no rotation needed | HashiCorp Vault |
| **Certificate rotation** | cert-manager renews TLS certs before expiry | cert-manager + Vault PKI |

### Audit Logging

Every secrets management system must answer:
- **Who** accessed a secret (identity: service account, human user)
- **What** secret was accessed (path, version)
- **When** (timestamp, request duration)
- **From where** (IP, pod name, namespace)
- **Why** (optional: request metadata)

```json
{
  "time": "2026-07-28T14:23:11Z",
  "type": "secret_access",
  "accessor": "vault:auth/kubernetes/login → sa=payments-svc",
  "path": "secret/data/payments/stripe-api-key",
  "operation": "read",
  "namespace": "production/payments",
  "remote_address": "10.0.1.45"
}
```

### Secrets Sprawl Problem

```
Signs of secrets sprawl:
  ✗ Secrets in .env files committed to Git
  ✗ Same DB password used by 10 different services
  ✗ Credentials in CI/CD env vars visible in build logs
  ✗ Slack channel with "shared infra passwords" pinned
  ✗ Credentials never rotated (because rotation requires finding all usages)
  ✗ No inventory of what secrets exist or who uses them
```

---

## Real-World Notes

- **Break-glass accounts**: Always maintain a documented emergency access path (e.g., Vault unseal keys in split custody, break-glass IAM user) for when your secrets manager is unavailable.
- **Secret zero problem**: The bootstrap secret (the credential to access the secrets manager) must itself be protected — solved via workload identity (IRSA, Kubernetes auth) which requires no static credentials.
- **Secrets in logs**: Structured loggers should scrub known patterns. Apply regex redaction for `[A-Za-z0-9+/]{40}` (AWS access key format) in your log pipeline.
- **Environment variable leakage**: env vars are readable by any process in the pod, visible in `kubectl describe pod`, and often printed in crash dumps. Prefer mounted file secrets in restrictive directories.

---

## Common Pitfalls

1. **Rotating without updating all consumers** — a secret rotation that misses one service causes an outage. Keep a dependency map (Vault's lease tracking helps).
2. **Treating secret manager access as coarse-grained** — giving one role access to all secrets defeats least-privilege; structure secret paths by service/environment.
3. **Short TTLs without refresh logic** — dynamic secrets expire; ensure your application renews the lease or re-authenticates before expiry.
4. **Putting secrets in ConfigMaps** — K8s ConfigMaps are not encrypted at rest by default; always use Secrets objects (and enable etcd encryption or use ESO to source from Vault).
5. **CI/CD masking is not deletion** — masked vars prevent display in logs, but the secret is still stored in the CI system's database; rotate if a pipeline run is compromised.

---

## Related Concepts

- [[_MOC_Secret_Management|↑ Secret Management MOC]]
- [[HashiCorp_Vault|→ HashiCorp Vault]] — enterprise-grade centralised secrets engine
- [[Kubernetes_Secrets|→ Kubernetes Secrets]] — K8s-native secret objects and ESO
- [[SOPS_and_Git_Secret_Management|→ SOPS]] — encrypting secrets in Git for GitOps
- [[AWS_Azure_Secret_Services|→ Cloud Secret Services]] — AWS SM, Azure KV, GCP Secret Manager
- [[../04_Kubernetes/Kubernetes_Core_Concepts|← K8s Core Concepts]] — RBAC and service accounts
- [[../02_CICD_Pipelines/GitHub_Actions|← GitHub Actions]] — CI/CD secret injection

---

## Review Questions

1. Why is a Git history rewrite insufficient to "remove" a leaked secret? What is the correct response to a leaked credential?
2. Explain the "secret zero problem." How does Kubernetes auth in HashiCorp Vault solve it?
3. Compare static credentials vs dynamic secrets on three dimensions: blast radius, rotation complexity, and audit granularity.
4. An engineer proposes storing service secrets as Kubernetes ConfigMaps to avoid Vault complexity. What are the specific security risks, and what is the minimum mitigation?

---

## Sources

- HashiCorp Vault documentation — developer.hashicorp.com/vault
- OWASP — Secrets Management Cheat Sheet
- NIST SP 800-57 — Key Management Recommendations
- AWS Security Best Practices — Secrets Management

#DevOps #Security #SecretsManagement #LeastPrivilege #AuditLogging #SecretRotation
