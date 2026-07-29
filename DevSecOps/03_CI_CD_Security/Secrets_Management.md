---
title: Secrets Management
aliases: [Secret Management, HashiCorp Vault, Sealed Secrets, SOPS]
tags: [DevSecOps, Security, SecretsManagement, HashiCorpVault, SealedSecrets, SOPS, AWS]
domain: DevSecOps
difficulty: Intermediate
created: 2026-07-29
related: [Security_in_CICD_Pipeline, Supply_Chain_Security, Container_and_IaC_Security, Secure_Coding_Practices]
status: complete
---

# Secrets Management

> [!abstract] TL;DR
> Secrets (API keys, database passwords, TLS certificates) must never appear in source code, Dockerfiles, or git history. The correct pattern is runtime injection from a dedicated secrets manager: HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, or Kubernetes Sealed Secrets. Pre-commit gitleaks scanning is the last line of defense before a secret escapes to a git remote.

---

## Why Secrets in Code Are Catastrophic

```bash
# This looks like it's deleted, but it's in git history forever
git rm --cached .env
git commit -m "remove .env"

# Anyone who cloned before the deletion still has it
# Anyone with git access can recover it:
git log --all --full-history -- .env
git show <commit-hash>:.env
```

**Real incidents**:
- Samsung (2023): internal source code including AWS keys leaked on GitHub
- Toyota (2022): production server access key exposed in public GitHub repository for ~5 years (affecting 290,000 customers' data)
- Uber (2022): engineer's AWS credentials in code repository

**Rule**: **Git history is permanent and public (in public repos) or accessible to all repo collaborators. There is no "oops, I'll just delete it."**

---

## gitleaks — Pre-Commit Secrets Scanning

```bash
# Install gitleaks
brew install gitleaks   # macOS
# or: go install github.com/gitleaks/gitleaks/v8@latest

# Scan entire repository history
gitleaks detect --source . --verbose

# Scan only staged files (for pre-commit hook)
gitleaks protect --staged

# Custom rules (.gitleaks.toml)
[[rules]]
  id = "custom-internal-api-key"
  description = "Internal API key format"
  regex = '''INTERNAL-[0-9A-F]{32}'''
  severity = "HIGH"
  tags = ["api", "internal"]
```

```yaml
# .pre-commit-config.yaml — gitleaks hook
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
```

---

## HashiCorp Vault — Enterprise Secrets Manager

Vault is the most feature-rich open-source secrets manager. Key concepts:

- **Secret engines**: store and generate secrets (KV, PKI, AWS, database)
- **Auth methods**: AppRole, Kubernetes, AWS IAM, LDAP, GitHub
- **Dynamic secrets**: Vault generates short-lived credentials on-demand (no static passwords)
- **Leases**: every secret has a TTL; Vault auto-revokes after expiry

### Vault Setup and Basic Operations

```bash
# Start Vault in development mode (for local testing)
vault server -dev
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='<root-token-from-output>'

# Enable KV v2 secrets engine
vault secrets enable -path=secret kv-v2

# Store a secret
vault kv put secret/myapp/database \
  username=myapp_user \
  password=SuperSecretPassword

# Read a secret
vault kv get secret/myapp/database
vault kv get -field=password secret/myapp/database

# List secrets
vault kv list secret/myapp/
```

### Dynamic Database Credentials

```bash
# Enable database secret engine
vault secrets enable database

# Configure PostgreSQL connection
vault write database/config/mydb \
  plugin_name=postgresql-database-plugin \
  allowed_roles="myapp-role" \
  connection_url="postgresql://vault:vaultpassword@postgres:5432/mydb?sslmode=disable"

# Create a role with a TTL
vault write database/roles/myapp-role \
  db_name=mydb \
  creation_statements="CREATE ROLE '{{name}}' WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}' IN ROLE myapp_reader;" \
  default_ttl="1h" \
  max_ttl="24h"

# Generate credentials (app calls this on startup)
vault read database/creds/myapp-role
# Returns: username=v-myapp-role-abc123, password=A1B2C3D4... (expires in 1h)
```

### Kubernetes Auth for Vault

```bash
# Enable Kubernetes auth
vault auth enable kubernetes

# Configure (run inside Kubernetes cluster)
vault write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc:443" \
  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
  token_reviewer_jwt=@/var/run/secrets/kubernetes.io/serviceaccount/token

# Create policy
vault policy write myapp-policy - <<EOF
path "secret/data/myapp/*" {
  capabilities = ["read"]
}
path "database/creds/myapp-role" {
  capabilities = ["read"]
}
EOF

# Bind service account to policy
vault write auth/kubernetes/role/myapp-role \
  bound_service_account_names=myapp \
  bound_service_account_namespaces=production \
  policies=myapp-policy \
  ttl=1h
```

### Vault Agent Sidecar (K8s)

```yaml
# Vault Agent Injector — injects secrets as files into pods
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        vault.hashicorp.com/agent-inject: "true"
        vault.hashicorp.com/role: "myapp-role"
        vault.hashicorp.com/agent-inject-secret-database.txt: "database/creds/myapp-role"
        vault.hashicorp.com/agent-inject-template-database.txt: |
          {{- with secret "database/creds/myapp-role" -}}
          export DB_USER="{{ .Data.username }}"
          export DB_PASSWORD="{{ .Data.password }}"
          {{- end }}
```

---

## AWS Secrets Manager

```python
import boto3
import json

def get_secret(secret_name: str, region: str = "us-east-1") -> dict:
    client = boto3.client('secretsmanager', region_name=region)
    response = client.get_secret_value(SecretId=secret_name)
    return json.loads(response['SecretString'])

# Usage
db_creds = get_secret("prod/myapp/database")
conn_string = f"postgresql://{db_creds['username']}:{db_creds['password']}@{db_creds['host']}/mydb"
```

**AWS Secrets Manager vs Parameter Store**:

| Feature | Secrets Manager | Parameter Store (SecureString) |
|---------|-----------------|-------------------------------|
| Cost | ~$0.40/secret/month + API calls | Free (standard), $0.05/parameter/month (advanced) |
| Auto-rotation | Built-in Lambda rotation | Manual |
| Cross-account | Native | Via IAM |
| Best for | Secrets needing rotation | Configuration + secrets |

---

## Azure Key Vault

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()  # uses Managed Identity in Azure
client = SecretClient(
    vault_url="https://mykeyvault.vault.azure.net/",
    credential=credential
)

secret = client.get_secret("database-password")
print(secret.value)
```

---

## Sealed Secrets for Kubernetes (Bitnami)

Sealed Secrets solves the GitOps problem: how to store K8s Secrets in git (encrypted) while keeping them decryptable only inside the cluster.

```bash
# Install kubeseal CLI
brew install kubeseal

# Fetch the public key from the cluster
kubeseal --fetch-cert \
  --controller-namespace kube-system \
  --controller-name sealed-secrets-controller > sealed-secrets-public-key.pem

# Create a regular K8s Secret
kubectl create secret generic database-credentials \
  --from-literal=username=myapp_user \
  --from-literal=password=SuperSecretPassword \
  --dry-run=client -o yaml > database-secret.yaml

# Encrypt it into a SealedSecret (safe to commit to git)
kubeseal --format yaml \
  --cert sealed-secrets-public-key.pem \
  < database-secret.yaml > database-sealed-secret.yaml

# Commit database-sealed-secret.yaml to git (safe!)
# The controller in the cluster decrypts it to a real Secret
```

---

## SOPS — Secrets OPerationS

SOPS encrypts specific values in YAML/JSON files (not the whole file), making diffs readable while keeping secrets encrypted:

```bash
# Encrypt a file using AWS KMS
sops --encrypt --kms arn:aws:kms:us-east-1:123456789:key/abc123 \
  secrets.yaml > secrets.enc.yaml

# Encrypt using age (simpler, no cloud dependency)
sops --encrypt --age age1abc...publickey secrets.yaml > secrets.enc.yaml

# Decrypt and edit (opens in $EDITOR)
sops secrets.enc.yaml

# Decrypt to stdout (for scripts)
sops --decrypt secrets.enc.yaml
```

```yaml
# secrets.enc.yaml — encrypted values, readable structure
database:
  host: prod-db.example.com  # not encrypted (not sensitive)
  username: myapp_user        # not encrypted
  password: ENC[AES256_GCM,data:abc123...,iv:xyz...,tag:...,type:str]
sops:
  kms:
  - arn: arn:aws:kms:us-east-1:123456789:key/abc123
```

---

## Rotating Leaked Secrets

If a secret is leaked (found in git history, logs, or by a security scanner):

1. **Immediately revoke the leaked secret** at the source (AWS Console → IAM → Delete Access Key; rotate database password; invalidate OAuth token)
2. **Generate a new secret**
3. **Update all services** that use the secret (rolling restart)
4. **Audit the exposure window** — when was it first committed? Who had access?
5. **Report if required** — PCI-DSS requires incident reporting for compromised credentials

```bash
# Purge secret from git history (BFG Repo Cleaner)
bfg --replace-text passwords.txt my-repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# WARNING: This rewrites git history — requires force-push + all collaborators must re-clone
```

---

## Common Pitfalls

- **Environment variables as a "safe" alternative**: env vars are visible to all processes on the host, in `docker inspect`, in K8s pod spec, and in CI logs if echoed
- **Vault in "dev" mode in production**: dev mode stores secrets in memory only — all secrets lost on restart. Always use production storage backend (Consul, DynamoDB)
- **Committing `.env` files even once**: even with a later `.gitignore`, the file is in git history
- **Not rotating secrets regularly**: even unexposed secrets should rotate to reduce blast radius if they were silently exfiltrated

---

## Review Questions

1. Why is deleting a secret from a git repository not sufficient to prevent exposure?
2. Explain what Vault "dynamic secrets" are and why they are more secure than static credentials.
3. What problem does Bitnami Sealed Secrets solve in a GitOps workflow?
4. What is SOPS and how does it differ from Sealed Secrets?
5. A developer's AWS key is found in a public GitHub repository. List the immediate response steps.

---

#DevSecOps #SecretsManagement #HashiCorpVault #SealedSecrets #SOPS #gitleaks #Security
