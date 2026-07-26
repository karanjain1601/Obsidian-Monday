---
title: Secret Management
aliases: [Secrets Management, Vault, KMS, Credential Management]
tags: [SystemDesign, Security, Secrets, Vault, KMS, Encryption]
domain: SystemDesign
difficulty: Intermediate
created: 2026-07-26
related: [Authentication_and_Authorization, TLS_and_HTTPS, API_Security, Zero_Trust_Architecture]
status: complete
---

# Lock Secret Management

> [!abstract] TL;DR
> Secrets (API keys, DB passwords, TLS certs) are the keys to your kingdom — their exposure is the most common root cause of breaches. The solution: centralized secret stores (HashiCorp Vault, AWS Secrets Manager) with dynamic short-lived credentials, envelope encryption, and automated rotation. Never hardcode; never commit to git; never store in plaintext env vars.

---

## Intuition — analogy FIRST

Imagine a hotel. Every guest gets a room key — but it's a plastic keycard, not a master key. It only opens their specific room, only during their stay, and it auto-deactivates at checkout. The housekeeping staff gets a different keycard: opens all rooms, but only between 8am and 4pm, and every use is logged. Nobody walks around with the master key — it's locked in a safe.

Secrets management applies the same philosophy to software: short-lived credentials scoped to exactly what's needed, auto-expiring, and every access logged. **Static secrets are like giving everyone a copy of the master key and never changing the lock.**

---

## How It Works + mermaid

### Dynamic Secrets Flow (HashiCorp Vault + Database)

```mermaid
sequenceDiagram
    participant App as Application Pod
    participant V as HashiCorp Vault
    participant DB as Database

    App->>V: Authenticate (K8s ServiceAccount JWT)
    V->>V: Verify JWT against K8s API
    V-->>App: Vault token (TTL: 1 hour)
    App->>V: Request DB credentials (POST /v1/db/creds/my-role)
    V->>DB: CREATE USER app_abc123 WITH PASSWORD 'xyz...'
    V->>DB: GRANT SELECT, INSERT ON orders TO app_abc123
    V-->>App: {username: app_abc123, password: xyz..., lease_ttl: 3600s}
    App->>DB: Connect with dynamic credentials
    Note over App,DB: App uses credentials for up to 1 hour
    V->>DB: DROP USER app_abc123 (on lease expiry / revocation)
```

### Envelope Encryption (KMS)

```mermaid
flowchart LR
    Data["Plaintext Data\n(e.g. user PII)"]
    DEK["Data Encryption Key\n(DEK) — random 256-bit key"]
    EncData["Encrypted Data\n(AES-256-GCM)"]
    EncDEK["Encrypted DEK\n(wrapped by KEK)"]
    KMS["KMS / HSM\n(holds Key Encryption Key — KEK)\nKEK never leaves KMS"]
    Store["Storage\n(EncData + EncDEK stored together)"]

    Data -->|"Encrypt with DEK"| EncData
    DEK -->|"Encrypt DEK with KEK"| EncDEK
    KMS -->|"Wraps/unwraps DEK"| EncDEK
    EncData --> Store
    EncDEK --> Store
```

---

## What NOT To Do

> [!danger] Secret anti-patterns — these cause breaches

```bash
# BAD: Hardcoded secret in source code
DB_PASSWORD = "super_secret_123"  # Committed to git — permanently compromised

# BAD: .env file committed to git
# .env
DATABASE_URL=postgresql://user:password@prod-db:5432/mydb
AWS_SECRET_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE

# BAD: Secret visible in process listing
docker run -e DB_PASSWORD=secret myapp
# ps aux shows: docker run -e DB_PASSWORD=secret myapp — readable by any user on the host

# BAD: Logging secrets accidentally
logger.info(f"Connecting to DB with credentials: {db_url}")
# Secrets end up in log aggregators, visible to anyone with log access
```

**Why git history leaks are so dangerous:**
Even if you delete the file and push a new commit, the secret exists in git history forever. Tools like `truffleHog`, `gitleaks`, and GitHub's secret scanning find these automatically.

---

## HashiCorp Vault

**Core concepts:**

| Concept | Description |
|---------|-------------|
| Secret Engine | Plugin that generates/stores secrets (KV, Database, PKI, AWS, SSH) |
| Auth Method | How clients authenticate to Vault (K8s SA, AWS IAM, LDAP, AppRole) |
| Policy | What paths a token can access and with what operations |
| Lease | Every secret has a TTL; Vault auto-revokes on expiry |
| Token | Short-lived credential returned after successful auth |
| Audit Device | Logs every request/response to file, syslog, or socket |

**Key secret engines:**

**1. KV (Key-Value) — static secrets:**
```bash
vault kv put secret/myapp/config api_key=abc123 db_url=postgres://...
vault kv get secret/myapp/config
```

**2. Database — dynamic secrets:**
- Vault connects to your DB with a management credential
- When app requests credentials, Vault creates a temporary DB user
- User is automatically dropped when the lease expires (1 hour, 15 min, etc.)
- **Result:** your app never has a long-lived DB password. Each pod gets unique creds.

**3. PKI — TLS certificate issuing:**
- Vault acts as an internal Certificate Authority (CA)
- Services request short-lived certs (24h TTL) on startup
- Supports mTLS between services — powers [[Zero_Trust_Architecture]] east-west traffic

**4. AWS / GCP / Azure — cloud credential generation:**
- Vault generates temporary IAM credentials (STS AssumeRole) on demand
- No long-lived `AWS_ACCESS_KEY_ID` ever lives in your environment

---

## Cloud-Native Secret Stores

| Product | Strengths | Use when |
|---------|-----------|----------|
| AWS Secrets Manager | Native AWS integration, auto-rotation built-in | All-in on AWS |
| AWS KMS | Envelope encryption, HSM backing, IAM integrated | Encrypting data at rest on AWS |
| GCP Secret Manager | Simple, versioned, IAM-controlled | GCP workloads |
| Azure Key Vault | HSM backing, Azure AD integrated | Azure workloads |
| HashiCorp Vault | Cloud-agnostic, dynamic secrets, richest feature set | Multi-cloud or on-prem |

---

## Envelope Encryption — Deep Dive

The problem with encrypting data directly with a KMS key: you'd have to send every byte of data to KMS, which is slow and expensive.

**Envelope encryption solution:**
1. Generate a random **Data Encryption Key (DEK)** locally (AES-256)
2. Encrypt your data with the DEK (fast, local operation)
3. Send only the DEK to KMS to be wrapped (encrypted) with the **Key Encryption Key (KEK)**
4. Store: `{encrypted_data, encrypted_DEK}` together
5. On decrypt: send encrypted_DEK to KMS → get back plaintext DEK → decrypt data locally

**Result:** KMS only ever sees the small DEK, not your data. Only the KEK ever lives in KMS (usually backed by an HSM). If an attacker steals your database, they get `{encrypted_data, encrypted_DEK}` — useless without access to KMS to unwrap the DEK.

---

## Secret Rotation

**Why rotation matters:** if a secret is compromised, rotation limits the exposure window. A secret rotated every 24 hours that was stolen is useful for at most 24 hours.

**Strategies:**

| Approach | How | Downtime? |
|----------|-----|-----------|
| Vault dynamic secrets | Vault generates new creds per request, auto-expires | Zero |
| AWS Secrets Manager auto-rotation | Lambda rotates the secret on a schedule, handles dual-credential window | Zero (overlap window) |
| Manual rotation with dual-write | Write new secret, update all services, delete old | Zero (if done carefully) |
| Blue/green credential rotation | Run two valid credentials simultaneously during transition | Zero |

**The dual-credential rotation pattern:**
1. Generate new secret (e.g., new DB password)
2. Configure the DB to accept BOTH old and new password temporarily
3. Update all services to use the new secret
4. Remove the old secret from the DB

---

## Kubernetes Integration

```yaml
# Vault Agent Injector — auto-inject secrets as files into pods
annotations:
  vault.hashicorp.com/agent-inject: "true"
  vault.hashicorp.com/agent-inject-secret-db-creds: "database/creds/my-role"
  vault.hashicorp.com/role: "my-k8s-role"
```

Vault Agent runs as a sidecar, authenticates using the pod's K8s ServiceAccount JWT, fetches secrets from Vault, writes them to a shared tmpfs volume (`/vault/secrets/`), and keeps them refreshed before TTL expires. The app reads from the file — it never talks to Vault directly.

---

## Real-World Systems

- **HashiCorp Vault at HomeAway (Vrbo):** 500+ services, dynamic DB credentials, eliminates static password rotation maintenance.
- **Stripe:** AWS KMS for envelope encryption of all cardholder data. PCI DSS compliance.
- **Netflix:** Metatron — internal PKI for service identity and mTLS, similar to BeyondCorp ALTS.
- **GitHub:** After the 2022 CircleCI breach, GitHub invalidated all tokens that could have been exposed — only possible because they tracked which tokens existed and could mass-rotate.

---

## Trade-offs (table)

| Dimension | Dynamic Secrets (Vault) | Static Secrets (env vars / KMS) |
|-----------|------------------------|----------------------------------|
| Security | Excellent — short-lived, auto-revoked | Good if rotated regularly |
| Complexity | High — Vault HA cluster, auth methods | Low |
| Blast radius | Minimal — compromised cred expires soon | Higher — until manually rotated |
| Audit trail | Per-request Vault audit log | AWS CloudTrail (less granular) |
| Dependency | Vault is now a critical dependency | KMS/Secrets Manager is managed |
| Developer experience | Requires Vault agent / SDK integration | Simple env var reads |

---

## When to Use vs Avoid

**Use HashiCorp Vault when:**
- Multi-cloud or hybrid environment
- Need dynamic secrets (database, cloud IAM)
- Compliance requires detailed audit logging (SOC2, PCI DSS, HIPAA)
- Need PKI / certificate management at scale

**Use cloud-native (AWS Secrets Manager / KMS) when:**
- Single-cloud deployment
- Want managed service, no ops burden for secret store HA
- Simpler needs (static API keys, connection strings)

**Use envelope encryption (KMS) when:**
- Encrypting large volumes of data at rest
- PCI DSS / HIPAA compliance for sensitive fields

**Always avoid:**
- Hardcoded secrets
- Secrets in git (use pre-commit hooks with gitleaks)
- Long-lived credentials without rotation

---

## Common Pitfalls

> [!danger] Secret management anti-patterns
> 1. **Vault as SPOF without HA** — if Vault is down and apps can't start (because they can't get DB creds), your entire platform is down. Run Vault in HA mode (Raft or Consul backend, 3+ nodes).
> 2. **Long lease TTLs** — setting a 30-day TTL on dynamic credentials defeats the purpose. Use 1-hour for DB credentials, 24-hour for TLS certs.
> 3. **Logging secret values** — Vault audit logs redact secret values by default. Make sure your application code doesn't log the secrets it retrieves.
> 4. **Baking secrets into container images** — `COPY .env /app/.env` in a Dockerfile bakes secrets into every image layer, which persists in your container registry.
> 5. **Not revoking on breach** — the power of dynamic secrets is that you can mass-revoke an entire secret engine's leases with one command. Have a runbook for this.
> 6. **Forgetting rotation for static secrets** — if you can't use dynamic secrets, at minimum automate quarterly rotation with Secrets Manager's built-in rotation.

---

## Related Concepts

- [[_MOC_Security|↑ Section MOC]]
- [[Authentication_and_Authorization]] — secrets are how services authenticate to each other
- [[TLS_and_HTTPS]] — Vault PKI engine issues the TLS certificates
- [[API_Security]] — API keys are a category of secrets requiring the same management
- [[Zero_Trust_Architecture]] — dynamic secrets are the credential backbone of ZTA
- [[Microservices]] — each service needs its own scoped credentials, not shared ones

---

## Review Questions

1. Explain envelope encryption. A database row contains a user's credit card number. Walk through the encryption/decryption flow using a DEK and a KEK stored in AWS KMS. Why is it more efficient than sending the data directly to KMS for encryption?

2. Your company stores DB passwords in environment variables injected at deploy time. The passwords are 6 months old and never rotated. Propose a migration path to HashiCorp Vault dynamic secrets — what's the architecture, what's the migration strategy, and how do you handle the zero-downtime rotation requirement?

3. A Vault audit log shows that a service account made 10,000 requests for database credentials in the past hour (normally it makes ~5). What does this likely indicate, and what immediate actions would you take?

---

## Sources

- [HashiCorp Vault Documentation](https://developer.hashicorp.com/vault/docs)
- [AWS Secrets Manager Best Practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)
- [NIST SP 800-57: Key Management Guidelines](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)
- [The 12-Factor App — Config](https://12factor.net/config) — foundational reading on externalizing config/secrets

#SystemDesign #Security #Secrets #Vault #KMS #Encryption #Intermediate
