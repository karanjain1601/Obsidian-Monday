# ACV Infrastructure — Developer Onboarding

**Purpose:** Enable infrastructure engineers to set up, build, and manage ACV infrastructure locally and in production.

**Scope:** Prerequisites, local setup, Terraform commands, common workflows, troubleshooting.

---

## 1. Prerequisites

### 1.1 Required Tools

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| **Terraform** | 1.5.0+ | IaC provisioning | [terraform.io/downloads](https://www.terraform.io/downloads.html) |
| **Azure CLI** | 2.40+ | Azure resource management | [docs.microsoft.com](https://docs.microsoft.com/cli/azure/install-azure-cli) |
| **Git** | 2.40+ | Version control | [git-scm.com](https://git-scm.com/) |
| **kubectl** | 1.28+ | Kubernetes management | [kubernetes.io/docs/tasks/tools](https://kubernetes.io/docs/tasks/tools/) |
| **jq** | Latest | JSON query tool | [stedolan.github.io/jq](https://stedolan.github.io/jq/) |
| **Helm** | 3.10+ | Kubernetes package manager | [helm.sh](https://helm.sh/docs/intro/install/) (optional) |
| **VS Code** | Latest | Editor | [code.visualstudio.com](https://code.visualstudio.com/) |

### 1.2 Verify Installation

```bash
# Terraform version
terraform version
# Output: Terraform v1.5.x

# Azure CLI version
az version
# Output: {"azure-cli": "2.40.x", ...}

# Kubernetes
kubectl version --client
# Output: Client Version: v1.28.x

# Git
git --version
# Output: git version 2.40.x
```

### 1.3 Azure Permissions

Required Azure roles:
- **Contributor** on target subscription (for resource creation)
- **Key Vault Administrator** (for secrets management)
- **Azure AD Administrator** (for AD group integration)

### 1.4 Network Requirements

- Network connectivity to Azure cloud endpoints
- Access to GitHub repositories (FedEx modules)
- VPN access (if deploying from on-premises)

---

## 2. Local Environment Setup

### 2.1 Clone Repository

```bash
# Navigate to projects directory
cd ~/projects

# Clone the repository
git clone https://github.com/FedEx/eai-3540813-infra.git
cd eai-3540813-infra

# Verify clone
git branch -a
# Output: * main (local), remotes/origin/main
```

### 2.2 Configure Git

```bash
# Set your identity (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@fedex.com"

# Verify
git config --global --get user.name
git config --global --get user.email
```

### 2.3 Install Terraform Extensions (VS Code)

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search and install:
   - "Terraform" (by HashiCorp)
   - "Azure Terraform" (by Microsoft)
   - "Azure CLI Tools" (optional)

### 2.4 Configure Azure CLI Authentication

```bash
# Login to Azure
az login

# Output:
# You have logged in. Now let me get the subscription list.
# [
#   {
#     "cloudName": "AzureCloud",
#     "id": "...",
#     "name": "fxi-nonprod1"
#   }
# ]

# Set default subscription (if multiple)
az account set --subscription "fxi-nonprod1"

# Verify
az account show
```

### 2.5 Generate GitHub Personal Access Token (PAT)

For accessing FedEx GitHub modules:

```bash
# On GitHub (github.fedex.com):
# 1. Settings → Developer settings → Personal access tokens
# 2. Generate new token with "repo" scope
# 3. Save token (will only show once)

# Configure Git to use token
git config --global credential.helper store
# Next push will prompt for token (use token as password)
```

---

## 3. Terraform Commands

### 3.1 Initialize Terraform

```bash
# Select or create workspace
terraform workspace list
# Output:
# default
# * dev_fxi-001-eastus2
# test_fxi-001-eastus2
# prod_fxi-001-eastus2

# Switch workspace
terraform workspace select dev_fxi-001-eastus2

# Or create new workspace
terraform workspace new staging_fxi-001-eastus2

# Initialize (downloads providers & modules)
terraform init

# Output:
# Initializing the backend...
# Downloading modules...
# Initializing modules...
# [OK]
```

### 3.2 Validate Configuration

```bash
# Validate syntax & logic
terraform validate

# Output: Success! The configuration is valid.
```

### 3.3 Format Code

```bash
# Auto-format Terraform files
terraform fmt -recursive

# Check formatting without changing
terraform fmt -recursive -check
```

### 3.4 Plan Deployment

```bash
# Generate execution plan (no changes made)
terraform plan -out=tfplan

# Output:
# Plan: 15 to add, 2 to change, 0 to destroy.
# ---------
# Note: You didn't use the -chdir flag to specify a working directory, so ...

# Save plan to file (recommended)
terraform plan -out=dev_plan.tfplan

# Review before apply
cat dev_plan.tfplan | grep -i "resource\|change"
```

### 3.5 Apply Deployment

```bash
# Apply using saved plan (safest method)
terraform apply dev_plan.tfplan

# Or apply directly (interactive)
terraform apply

# Output:
# Do you want to perform these actions?
# Terraform will perform the actions described above.
# Only 'yes' will be accepted to approve.
# 
# Enter a value: yes
# 
# Apply complete! Resources: 15 added, 0 changed, 0 destroyed.
# Outputs:
# database_host = "acv-db.postgres.database.azure.com"
# redis_host = "acv-redis.redis.cache.windows.net"
```

### 3.6 View Outputs

```bash
# Show all outputs
terraform output

# Get specific output
terraform output database_host
# Output: acv-db.postgres.database.azure.com

# Get as JSON (for parsing)
terraform output -json
terraform output -json | jq '.database_host.value'
```

### 3.7 Destroy Infrastructure

```bash
# DANGEROUS: Destroys all resources
terraform destroy

# Safer: Plan destroy first
terraform plan -destroy -out=destroy_plan.tfplan
terraform apply destroy_plan.tfplan

# Do not run in prod without approval
```

---

## 4. Development Workflows

### 4.1 Update PostgreSQL Configuration

**Scenario**: Increase max connections from 100 to 200

**Steps**:

```bash
# 1. Edit configuration
vim modules/infra/postgres.tf
# Change: pg_qs.query_capture_mode = "top" to "all", etc.

# 2. Plan changes (dry-run)
terraform plan -target="module.main.module.postgres_flexible_dbserver"

# 3. Review plan
# Data objects:
# - module.main.module.postgres_flexible_dbserver will be updated

# 4. Apply changes
terraform apply -target="module.main.module.postgres_flexible_dbserver"

# 5. Verify
terraform output postgres_server_id
# Confirm in Azure portal or psql
psql -h $(terraform output -raw database_host) -U postgres -c "SHOW max_connections"
```

---

### 4.2 Scale Redis Capacity

**Scenario**: Upgrade Redis from 1GB to 2GB

**Steps**:

```bash
# 1. Edit redis configuration
vim modules/infra/redis.tf
# Change: capacity = 1 to capacity = 2

# 2. Plan the change
terraform plan -target="module.main.module.redis_cache"

# 3. Review plan (likely minor changes to memory policies)
# 4. Apply
terraform apply -target="module.main.module.redis_cache"

# 5. Verify
redis-cli -h $(terraform output -raw redis_host) -p 6380 -a $(terraform output -raw redis_password) INFO memory
# Verify: used_memory_peak, maxmemory
```

---

### 4.3 Add a New Environment

**Scenario**: Create staging environment

**Steps**:

```bash
# 1. Create config file
cat > conf.d/staging_fxi-001-eastus2.yaml << EOF
---
environment: nonprod
EOF

# 2. Create workspace
terraform workspace new staging_fxi-001-eastus2

# 3. Initialize
terraform init

# 4. Plan
terraform plan

# 5. Apply
terraform apply

# 6. Verify
terraform output resource_group_name
# Output: eastus2-fxi-staging-acv-rg
```

---

### 4.4 Create a New Secret in Key Vault

**Scenario**: Add API key for third-party service

**Steps**:

```bash
# 1. Edit secrets configuration
vim modules/infra/secrets.tf
# Add new secret under k8s_secrets locals:
# my_api_secret = {
#   value = {
#     metadata = { namespace = local.ns }
#     data = { MY_API_KEY = "secret-value" }
#   }
# }

# 2. Plan
terraform plan -target="module.main.module.keyvault"

# 3. Apply
terraform apply -target="module.main.module.keyvault"

# 4. Verify in Key Vault
az keyvault secret list --vault-name $(terraform output -raw keyvault_name)
```

---

### 4.5 Git Workflow for Infrastructure Changes

```bash
# 1. Create feature branch
git checkout -b feature/increase-postgres-connections

# 2. Make changes
vim modules/infra/postgres.tf

# 3. Validate syntax
terraform validate

# 4. Format code
terraform fmt -recursive

# 5. Plan and save
terraform plan -out=feature_plan.tfplan

# 6. Commit
git add -A
git commit -m "feat(postgres): increase max connections to 200"

# 7. Push to GitHub
git push origin feature/increase-postgres-connections

# 8. Create Pull Request
# - GitHub Actions runs `terraform plan`
# - Reviewers approved
# 9. Merge to main
# - GitHub Actions runs `terraform apply`

# 10. Verify deployment
terraform show | grep postgres
```

---

## 5. Testing & Validation

### 5.1 Syntax Check

```bash
# Validate all Terraform files
terraform validate

# Check formatting
terraform fmt -recursive -check
```

### 5.2 Test Connectivity

```bash
# Test PostgreSQL connection
psql -h $(terraform output -raw database_host) \
  -U postgres \
  -d postgres \
  -c "SELECT version();"

# Test Redis connection
redis-cli -h $(terraform output -raw redis_host) \
  -p 6380 \
  -a $(terraform output -raw redis_password) \
  ping
# Output: PONG

# Test Key Vault access
az keyvault secret list \
  --vault-name $(terraform output -raw keyvault_name)
```

### 5.3 Dry-Run & Review

```bash
# Always plan before apply
terraform plan -out=test.tfplan

# View plan in human-readable format
terraform show test.tfplan | less

# Check for any warnings or errors
terraform plan 2>&1 | grep -i "warning\|error"
```

---

## 6. Troubleshooting

### Issue: "Backend lock" Error

**Symptom**:
```
Error: Error acquiring the state lock

Error message includes:
"resource already exists"
```

**Cause**: Another Terraform action is using state file

**Solution**:
```bash
# Check who has lock
az storage blob list \
  --account-name stfedexterraformstate \
  --container-name terraform-state

# Wait for other action to complete (CI/CD, colleague's apply)
# Or force unlock (last resort):
terraform force-unlock <LOCK_ID>
```

---

### Issue: "Module not found" Error

**Symptom**:
```
Error: Failed to fetch module

module source: github.com/FedEx/eai-3538871-azurerm-postgres-flexible.git
error: could not read User: no such file or directory
```

**Cause**: GitHub module access denied (PAT token missing/expired)

**Solution**:
```bash
# Re-generate PAT token
# 1. GitHub (github.fedex.com) → Settings → Developer settings
# 2. Generate new token with "repo" scope
# 3. Save token

# Configure Git
git config --global credential.helper store
# Next git operation will prompt for token
echo "https://YOUR_USERNAME:YOUR_TOKEN@github.fedex.com" >> ~/.git-credentials

# Retry Terraform init
terraform init
```

---

### Issue: "Insufficient Permissions" Error

**Symptom**:
```
Error: Insufficient permissions to complete the operation

Error details:
Error creating resource group:
Wrapped error: AuthorizationFailed: ...
```

**Cause**: Azure CLI user doesn't have required role

**Solution**:
```bash
# Check current user
az account show

# Check roles
az role assignment list --assignee $(az account show --query user.name -o tsv)

# Request required role from cloud ops
# - Contributor (for resource creation)
# - Key Vault Administrator
# - Azure AD Administrator (if needed)
```

---

### Issue: "State File Mismatch" Error

**Symptom**:
```
Error: resource already exists in Azure

azurerm_resource_group.main:
resource group 'eastus2-fxi-dev-acv-rg' already exists
```

**Cause**: Resource exists but Terraform state doesn't know about it

**Solution**:
```bash
# Import existing resource into Terraform state
terraform import module.main.azurerm_resource_group.this \
  /subscriptions/SUB_ID/resourceGroups/eastus2-fxi-dev-acv-rg

# Or refresh state
terraform refresh
```

---

### Issue: "Subnet IP Depletion" Error

**Symptom**:
```
Error: Could not allocate IP range for subnet

Details: ...private endpoint subnet exhausted...
```

**Cause**: Private endpoint subnet ran out of IP addresses

**Solution**:

```bash
# Check subnet usage
az network vnet subnet show \
  --name general \
  --vnet-name eastus2-fxi-nonprod-vnet \
  --resource-group eastus2-fxi-nonprod-network-rg

# Expand subnet CIDR range (if possible)
# Edit modules/infra/locals.tf → private_endpoints configuration
# Or request larger subnet from network ops

# Delete unused private endpoints
az network private-endpoint delete \
  --name old-endpoint \
  --resource-group eastus2-fxi-dev-acv-rg
```

---

## 7. Code Conventions

### 7.1 Terraform Style

```hcl
# ✅ Correct
module "postgres_flexible_dbserver" {
  for_each = contains(["prod", "test"], var.stage) ? local.postgres_dbservers : {}
  source   = "github.com/FedEx/eai-3538871-azurerm-postgres-flexible.git?ref=v4"
  
  server_config = each.value.server_config
}

# ❌ Avoid
module "postgres" {
  source="github.com/.../ref=v4"
  serverConfig=each.value.server_config
}
```

**Rules**:
- Resource/variable names: snake_case
- Module names: snake_case
- Local values: snake_case
- Comments above resources for clarity
- Format: 2-space indentation

---

### 7.2 Git Commit Messages

```bash
# ✅ Good
git commit -m "feat(postgres): increase max connections to 200"
git commit -m "fix(redis): adjust maxmemory-reserved for stability"
git commit -m "docs(infra): update README with cost optimization"
git commit -m "refactor(locals): simplify namespace mapping"

# ❌ Avoid
git commit -m "fix"
git commit -m "update files"
git commit -m "WIP: stuff"
```

**Format**: `<type>(<scope>): <description>`

Types: feat, fix, docs, style, refactor, test, chore

---

## 8. Quick Reference

| Task | Command |
|------|---------|
| **Initialize** | `terraform init` |
| **Validate** | `terraform validate` |
| **Format** | `terraform fmt -recursive` |
| **Plan** | `terraform plan -out=tfplan` |
| **Apply** | `terraform apply tfplan` |
| **Destroy** | `terraform destroy` |
| **Show state** | `terraform show` |
| **List workspaces** | `terraform workspace list` |
| **Switch workspace** | `terraform workspace select <name>` |
| **Get outputs** | `terraform output` |
| **Target resource** | `terraform plan -target='module.main.module.postgres...'` |
| **Refresh state** | `terraform refresh` |
| **Import resource** | `terraform import <resource> <id>` |

---

## 9. FAQ

### Q: How often is state backed up?

**A**: Azure Storage has versioning enabled (snapshots). State is never lost. Contact cloud-ops for point-in-time recovery.

---

### Q: Can I manually create resources in Azure Portal instead of Terraform?

**A**: Not recommended. Terraform won't know about manual resources, leading to conflicts. Always use Terraform for changes.

---

### Q: How do I sync a colleague's infrastructure changes?

**A**: Pull latest code and reapply:
```bash
git pull origin main
terraform apply
```

---

### Q: Can I run Terraform from my laptop or must it be CI/CD?

**A**: Both options work, but CI/CD is safer (audit trail, requires reviews). Local development OK for testing in dev environment.

---

### Q: How long does a typical apply take?

**A**: 10-15 minutes for full infrastructure (databases, networks, etc.). Individual resource changes typically 2-5 minutes.

---

## 10. Getting Help

| Resource | Use Case |
|----------|----------|
| **Terraform Docs** | [terraform.io/docs](https://www.terraform.io/docs) | Language reference |
| **Azure Provider** | [registry.terraform.io/providers/hashicorp/azurerm](https://registry.terraform.io/providers/hashicorp/azurerm) | Azure-specific resources |
| **FedEx Wiki** | Internal docs | Company-specific patterns |
| **Slack: #infra** | Quick questions | Infrastructure team chat |
| **GitHub Issues** | Bugs, feature requests | Track in repository |

---

## Cross-References

- [README.md](README.md) — Quick start overview
- [HLD.md](HLD.md) — Architecture design
- [LLD.md](LLD.md) — Code structure
- [architecture.md](architecture.md) — Deployment model
- [code-mapping.md](code-mapping.md) — File navigation
- [glossary.md](glossary.md) — Terminology

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** Infrastructure Engineers, DevOps, Cloud Architects, Terraform Developers
