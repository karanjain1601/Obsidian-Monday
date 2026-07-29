---
title: HashiCorp Vault
aliases: [Vault, HashiCorp Vault, Vault Dynamic Secrets, Vault Agent, Vault Injector]
tags: [DevOps, Security, Vault, HashiCorp, DynamicSecrets, TransitEncryption]
domain: DevOps
difficulty: Advanced
created: 2026-07-28
related: [Secret_Management_Fundamentals, Kubernetes_Secrets, AWS_Azure_Secret_Services]
status: complete
---

# 🏛️ HashiCorp Vault

> [!abstract] TL;DR
> Vault is a centralised secrets management platform. Its **storage backend** (Consul, DynamoDB, etcd, Raft) persists encrypted blobs; the **barrier** wraps all storage with AES-256-GCM using a master key derived from **unseal keys**. **Auth methods** verify identity (AppRole, Kubernetes, AWS IAM). **Secret engines** generate or store secrets: KV (static), Database (dynamic DB creds), PKI (TLS certs), AWS (IAM creds). **Dynamic secrets** have a lease TTL and are auto-revoked. **Transit engine** is encryption-as-a-service — apps send plaintext, get ciphertext back, never handle keys. **Vault Agent** (sidecar or daemon) handles auth and secret caching so apps stay credential-free.

---

## Intuition — analogy FIRST

Vault is a **nuclear launch bunker for credentials**. The bunker (storage backend) is hardened but sealed. Only specific **key holders** (unseal keys in Shamir shares) can open it at startup — any n-of-m combination works. Once open, the **guard desk** (auth method) verifies your identity before you pass. Inside, each **vault room** (secret engine) serves a different type of asset — the KV room stores static notes, the DB room dynamically issues access badges with expiry, the PKI room prints signed certificates. The **Transit room** will encrypt your document on your behalf — you never touch the encryption key yourself.

---

## How It Works

```mermaid
graph TD
    subgraph "Vault Architecture"
        CLIENT["Client\n(App / Vault Agent / CLI)"]:::client

        subgraph "Auth Methods"
            AM_K8S["Kubernetes Auth\n(ServiceAccount JWT)"]:::auth
            AM_APPROLE["AppRole Auth\n(RoleID + SecretID)"]:::auth
            AM_AWS["AWS IAM Auth\n(signed STS request)"]:::auth
        end

        VAULT_CORE["Vault Core\n(Barrier — AES-256-GCM)"]:::core

        subgraph "Secret Engines"
            SE_KV["KV v2 Engine\n(versioned static secrets)"]:::engine
            SE_DB["Database Engine\n(dynamic DB creds)"]:::engine
            SE_PKI["PKI Engine\n(TLS cert issuance)"]:::engine
            SE_AWS["AWS Engine\n(dynamic IAM creds)"]:::engine
            SE_TRANSIT["Transit Engine\n(encrypt/decrypt/sign)"]:::engine
        end

        STORAGE["Storage Backend\n(Raft / Consul / DynamoDB)"]:::storage

        CLIENT -->|"1. Authenticate"| AM_K8S & AM_APPROLE & AM_AWS
        AM_K8S & AM_APPROLE & AM_AWS -->|"2. Token"| VAULT_CORE
        VAULT_CORE -->|"3. Read/Write/Generate"| SE_KV & SE_DB & SE_PKI & SE_AWS & SE_TRANSIT
        VAULT_CORE --> STORAGE
    end

    classDef client fill:#4a3000,stroke:#f39c12,color:#ffc
    classDef auth fill:#16213e,stroke:#0f3460,color:#a8d8ea
    classDef core fill:#1a1a2e,stroke:#e94560,color:#ffffff
    classDef engine fill:#0f3460,stroke:#533483,color:#e8e8e8
    classDef storage fill:#0a2e1a,stroke:#2ecc71,color:#90ee90
```

---

## Key Concepts / Details

### Seal / Unseal and Storage Backend

```bash
# Vault is SEALED on startup — all storage is encrypted
# No secrets are accessible until unsealed

# Traditional unseal (Shamir secret sharing: 3-of-5)
vault operator init -key-shares=5 -key-threshold=3
# Produces 5 unseal keys + 1 initial root token

vault operator unseal <unseal_key_1>
vault operator unseal <unseal_key_2>
vault operator unseal <unseal_key_3>  # now unsealed

# Auto-unseal with AWS KMS (production recommended)
# vault.hcl
seal "awskms" {
  region     = "us-east-1"
  kms_key_id = "arn:aws:kms:us-east-1:123456789:key/mrk-abc123"
}
```

**Integrated Raft Storage** (recommended since Vault 1.4):
```hcl
storage "raft" {
  path    = "/vault/data"
  node_id = "vault-0"
  retry_join {
    leader_api_addr = "https://vault-1:8200"
  }
  retry_join {
    leader_api_addr = "https://vault-2:8200"
  }
}
```

### KV Secrets Engine (v2)

```bash
# Enable KV v2
vault secrets enable -path=secret kv-v2

# Write a secret (creates version 1)
vault kv put secret/payments/stripe api_key=sk_live_abc123 webhook_secret=whsec_xyz

# Read latest
vault kv get secret/payments/stripe

# Read specific version
vault kv get -version=2 secret/payments/stripe

# List secrets at a path
vault kv list secret/payments/

# Delete (soft delete — versioned, recoverable)
vault kv delete secret/payments/stripe

# Permanent destroy
vault kv destroy -versions=1,2 secret/payments/stripe

# Metadata (all versions)
vault kv metadata get secret/payments/stripe
```

### Dynamic Secrets — Database Engine

```bash
# Enable database engine
vault secrets enable database

# Configure Postgres connection (Vault holds the admin cred)
vault write database/config/my-postgres \
  plugin_name=postgresql-database-plugin \
  allowed_roles="readonly,readwrite" \
  connection_url="postgresql://{{username}}:{{password}}@postgres:5432/myapp" \
  username="vault-admin" \
  password="VaultAdminPass"

# Define a role (SQL template for credential creation)
vault write database/roles/readonly \
  db_name=my-postgres \
  creation_statements="CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT ON ALL TABLES IN SCHEMA public TO \"{{name}}\";" \
  default_ttl="1h" \
  max_ttl="24h"

# Request a credential (new unique user per request)
vault read database/creds/readonly
# Key                Value
# username           v-appserver-readonly-hTz3k
# password           A1a-xyz987abcdef
# lease_duration     1h
# lease_id           database/creds/readonly/abc123
```

### AppRole Auth Method

```bash
# Enable AppRole
vault auth enable approle

# Create a role for the payments service
vault write auth/approle/role/payments-svc \
  secret_id_ttl=10m \
  token_num_uses=10 \
  token_ttl=20m \
  token_max_ttl=30m \
  secret_id_num_uses=40 \
  policies="payments-readonly"

# Fetch RoleID (not secret — stored in config management)
vault read auth/approle/role/payments-svc/role-id
# role_id: 675a50e7-cfe0-be6a-4f6b-8f1cfe0ba69f

# Fetch SecretID (secret — delivered via CI/CD or Vault Agent)
vault write -f auth/approle/role/payments-svc/secret-id
# secret_id: ed0a642f-2acf-c2da-232f-1b21300d5f29

# Login (app exchanges RoleID+SecretID for Vault token)
vault write auth/approle/login \
  role_id="675a50e7-..." \
  secret_id="ed0a642f-..."
```

### Kubernetes Auth Method

```bash
# Enable Kubernetes auth
vault auth enable kubernetes

# Configure (Vault reaches K8s API to validate ServiceAccount JWTs)
vault write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc" \
  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
  token_reviewer_jwt=@/var/run/secrets/kubernetes.io/serviceaccount/token

# Create a role binding K8s SA → Vault policies
vault write auth/kubernetes/role/payments-app \
  bound_service_account_names=payments-svc \
  bound_service_account_namespaces=production \
  policies=payments-readonly \
  ttl=1h
```

Pod login (Vault Agent handles this automatically):
```bash
vault write auth/kubernetes/login \
  role=payments-app \
  jwt=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
```

### Transit Engine — Encryption-as-a-Service

```bash
# Enable transit engine
vault secrets enable transit

# Create an encryption key (app never sees the key)
vault write -f transit/keys/payments-pii type=aes256-gcm96

# Encrypt data
vault write transit/encrypt/payments-pii \
  plaintext=$(echo -n "4111111111111111" | base64)
# ciphertext: vault:v1:8SDd3WHDOjf7mq69CyCqYjBk5NyMvCW

# Decrypt (only authorized entities can call this)
vault write transit/decrypt/payments-pii \
  ciphertext="vault:v1:8SDd3WHDOjf7mq69CyCqYjBk5NyMvCW"
# plaintext: NDExMTExMTExMTExMTExMQ== (base64 of original)

# Rotate the encryption key (re-encrypt data at next write cycle)
vault write -f transit/keys/payments-pii/rotate
# Old versions still decrypt; new writes use new key version
```

### Vault Agent and Vault Injector (K8s)

**Vault Agent** (daemon/sidecar) handles:
1. Authentication to Vault (renewals, re-auth on token expiry)
2. Template rendering (writes secrets to files)
3. Caching (reduces load on Vault)

```hcl
# vault-agent-config.hcl
vault {
  address = "https://vault.vault.svc.cluster.local:8200"
}

auto_auth {
  method "kubernetes" {
    mount_path = "auth/kubernetes"
    config = { role = "payments-app" }
  }
  sink "file" {
    config = { path = "/home/vault/.vault-token" }
  }
}

template {
  source      = "/vault/templates/db-config.tpl"
  destination = "/vault/secrets/db-config.txt"
}
```

**Vault Injector** (K8s mutating webhook) uses annotations to inject Vault Agent automatically:

```yaml
# Pod annotation — Vault Injector adds init + sidecar containers
annotations:
  vault.hashicorp.com/agent-inject: "true"
  vault.hashicorp.com/role: "payments-app"
  vault.hashicorp.com/agent-inject-secret-db-creds: "database/creds/readonly"
  vault.hashicorp.com/agent-inject-template-db-creds: |
    {{- with secret "database/creds/readonly" -}}
    export DB_USER="{{ .Data.username }}"
    export DB_PASS="{{ .Data.password }}"
    {{- end }}
```

### HA Setup

```hcl
# 3-node Raft HA cluster
cluster_addr  = "https://{{ GetInterfaceIP \"eth0\" }}:8201"
api_addr      = "https://{{ GetInterfaceIP \"eth0\" }}:8200"

storage "raft" {
  path    = "/vault/data"
  node_id = "vault-0"
  performance_multiplier = 1
}

listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/vault/tls/tls.crt"
  tls_key_file  = "/vault/tls/tls.key"
}

ui            = true
disable_mlock = false   # always false in production
```

---

## Real-World Notes

- **Vault root token**: Revoke the root token after initial setup. Re-generate only when needed via `vault operator generate-root`. The root token is a nuclear key — it bypasses all policies.
- **Lease renewal**: Applications must renew leases before TTL expiry or request new credentials. Vault Agent handles this automatically.
- **Policy structure**: Use path-based policies. Prefer explicit `deny` for sensitive paths. Use `+` glob only at the segment boundary (e.g., `secret/data/+/config`).
- **Namespace vs. mount isolation**: Use Vault Namespaces (Enterprise) for multi-team isolation rather than path-based conventions alone.

```hcl
# policy: payments-readonly
path "secret/data/payments/*" {
  capabilities = ["read", "list"]
}
path "database/creds/readonly" {
  capabilities = ["read"]
}
path "transit/encrypt/payments-pii" {
  capabilities = ["update"]
}
path "transit/decrypt/payments-pii" {
  capabilities = ["update"]
}
```

---

## Common Pitfalls

1. **Not revoking root token** — leaving the initial root token active is a critical security risk; revoke it after configuring auth methods.
2. **TTL too long on dynamic secrets** — a 24-hour DB credential from a compromised pod is nearly as bad as a static one; keep default TTL at 1h or less.
3. **Vault Agent template not handling lease renewal** — if the template only runs at startup, the rendered file becomes stale; use `exec` in agent config to reload the process on secret change.
4. **Single Vault node in production** — without HA Raft, a Vault restart causes outage for all services that cannot re-authenticate; run minimum 3 nodes.
5. **Storing Vault unseal keys in the same system** — if Vault's storage is compromised and unseal keys are nearby, the encryption offers no protection; use HSM or cloud KMS auto-unseal.

---

## Related Concepts

- [[_MOC_Secret_Management|↑ Secret Management MOC]]
- [[Secret_Management_Fundamentals|← Fundamentals]] — why secrets management matters
- [[Kubernetes_Secrets|→ K8s Secrets]] — ESO pulling from Vault into K8s Secret objects
- [[AWS_Azure_Secret_Services|→ Cloud Secret Services]] — Vault vs AWS Secrets Manager positioning
- [[../04_Kubernetes/Operators_and_CRDs|← K8s Operators]] — Vault Injector as a mutating webhook
- [[../02_CICD_Pipelines/ArgoCD_and_GitOps|← ArgoCD]] — ArgoCD + Vault for GitOps secret injection

---

## Review Questions

1. Walk through what happens when a pod with the Vault Injector annotation is scheduled: which Kubernetes component intercepts the pod creation, what containers are added, and in what order do they run?
2. Explain the difference between the `transit` engine and the `database` engine. Give a use case for each.
3. A dynamic database credential expires after 1 hour. The application is a long-running process. Describe two mechanisms to ensure it doesn't lose database access.
4. How does Kubernetes auth in Vault eliminate the "secret zero problem" that AppRole has?

---

## Sources

- HashiCorp Vault Documentation — developer.hashicorp.com/vault
- Vault Architecture — developer.hashicorp.com/vault/docs/internals/architecture
- Vault Agent — developer.hashicorp.com/vault/docs/agent-and-proxy/agent
- Vault Injector for Kubernetes — developer.hashicorp.com/vault/docs/platform/k8s/injector

#DevOps #Security #Vault #HashiCorp #DynamicSecrets #TransitEncryption #KubernetesAuth #AppRole
