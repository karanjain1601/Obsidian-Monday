# ACV Infrastructure as Code (IaC)

**Project:** Account Creation Validations (ACV) — Infrastructure as Code  
**Purpose:** Terraform-based infrastructure provisioning for ACV microservices on Azure  
**Environment:** Multi-environment (Dev, Test, Production) in eastus2 region  
**Status:** Production-Ready

---

## 1. Quick Overview

This repository contains the Infrastructure as Code (IaC) for the ACV (Account Creation Validations) platform using **Terraform 1.5+** and **Azure Resource Manager (ARM)** providers. It provisions all cloud infrastructure components including databases, caches, Key Vaults, Event Hubs, Kubernetes integration, and monitoring stacks across Azure environments.

### Key Features

- **Multi-Environment Support** — Dev, Test, Prod with environment-specific configurations
- **Infrastructure Modularity** — Reusable Terraform modules from FedEx repositories
- **Kubernetes Integration** — Full integration with AKS (Azure Kubernetes Service)
- **Security-First** — Azure Key Vault, managed identities, RBAC, private endpoints
- **Monitoring Ready** — Prometheus, Dynatrace, and custom monitoring integration
- **Automated Secrets Management** — Kubernetes secrets auto-synced from Key Vault (akv2k8s)
- **Database Flexibility** — PostgreSQL Flexible Server with optional Delphix virtual databases
- **Event-Driven** — Azure Event Hubs for async message processing

---

## 2. Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **IaC Tool** | Terraform | ~> 1.5.0 | Infrastructure provisioning |
| **Cloud Provider** | Azure Resource Manager | Azure Stack | Multi-tenant cloud infrastructure |
| **Container Orchestration** | Kubernetes (AKS) | 1.28+ | Container management |
| **Database** | PostgreSQL Flexible Server | 14+ | Relational data storage |
| **Cache** | Azure Cache for Redis | 6.0+ | Distributed caching |
| **Secrets Management** | Azure Key Vault | v1 | Secrets and certificates |
| **Event Streaming** | Azure Event Hubs | Standard | Asynchronous messaging |
| **Monitoring** | Prometheus + Dynatrace | Latest | Application performance monitoring |
| **Configuration Mgmt** | CloudPosse Utils | ~> 1 | YAML deep-merge for configs |
| **DNS Integration** | Azure Private DNS | Zone v1 | Private DNS resolution |
| **VPN/Networking** | Azure Virtual Networks | Standard | Network infrastructure |

---

## 3. Repository Structure

```
eai-3540813-infra/
├── backend.tf                      # Terraform state management (Azure Storage)
├── main.tf                         # Main module invocation
├── data.tf                         # Data sources (Key Vault, Delphix API keys)
├── locals.tf                       # Local values and YAML configuration merging
├── provider.tf                     # Azure providers (4x AzureRM, AzureAD, Kubernetes, Helm, Delphix)
├── versions.tf                     # Terraform and provider version constraints
│
├── modules/
│   └── infra/                      # Core infrastructure module
│       ├── postgres.tf             # PostgreSQL Flexible Server (SQL version 14+)
│       ├── redis.tf                # Azure Cache for Redis (Standard/Premium)
│       ├── kv.tf                   # Azure Key Vault & access policies
│       ├── secrets.tf              # Kubernetes secrets & secret injection
│       ├── event-hub.tf            # Azure Event Hubs namespace & hubs
│       ├── storage-account.tf      # Azure Blob Storage account & containers
│       ├── delphix.tf              # Delphix DCT integration (optional)
│       ├── delphix_k8s_vdbs.tf     # Kubernetes-based VDB deployment
│       ├── rg.tf                   # Resource group reference
│       ├── labels.tf               # Resource naming & labeling (CloudPosse)
│       ├── data.tf                 # Local data sources & lookups
│       ├── locals.tf               # Local configuration (namespaces, endpoints, etc.)
│       ├── variables.tf            # Input variables (app_name, environment, etc.)
│       ├── versions.tf             # Module-level version constraints
│       │
│       ├── dsource-env/            # Delphix dSource environment configs
│       │   └── *.tf
│       ├── vdb-env/                # Delphix virtual database environments
│       │   └── *.tf
│       └── vdb-k8s-env/            # Kubernetes-deployed VDB configurations
│           └── *.tf
│
├── conf.d/
│   ├── default.yaml                # Default configuration (app_name, EAI, onboarding)
│   ├── dev_fxi-001-eastus2.yaml   # Dev environment configuration
│   ├── test_fxi-001-eastus2.yaml  # Test environment configuration
│   └── prod_fxi-001-eastus2.yaml  # Prod environment configuration
│
└── Documentation/
    └── (existing docs)
```

---

## 4. Key Resources Provisioned

### Azure Compute
- **AKS Cluster** — Kubernetes container orchestration with monitoring
- **Container Images** — Pre-built for all ACV microservices
- **Pod Deployments** — Via Helm charts (stored in `helm-releases/` per service)

### Data Storage
- **PostgreSQL Flexible Server** — Multi-database instances with:
  - Active Directory authentication
  - pgBouncer connection pooling
  - Query Store & performance monitoring
  - Custom PostgreSQL parameters (pg_stat_statements, pgcrypto, etc.)
  - Automatic backups & PITR (Point-in-Time Recovery)

### Caching & Session Management
- **Azure Cache for Redis** — In-memory data store with:
  - Distributed cache support (cache-aside pattern)
  - TLS 1.2+ encryption
  - Maxmemory policies (eviction strategies)
  - Pub/Sub messaging

### Secrets & Security
- **Azure Key Vault** — Centralized secrets management with:
  - Role-based access control (RBAC) via Azure AD groups
  - Delphix API keys
  - Database credentials
  - TLS certificates
  - akv2k8s agent for Kubernetes secret auto-injection

### Asynchronous Messaging
- **Azure Event Hubs** — High-throughput event streaming with:
  - Multiple partitions per hub (default: 4)
  - 7-day message retention
  - Kafka protocol support (port 9093)

### Storage
- **Azure Blob Storage** — Object storage for:
  - Application logs
  - Backup files
  - Configuration snapshots
  - Shared data between services

### Monitoring & Observability
- **Prometheus Operator** — Metrics collection & scraping
- **Grafana** — Metrics visualization
- **Dynatrace OneAgent** — Application performance monitoring (APM)
- **Azure Monitor** — Native Azure metrics & alerts

---

## 5. Environment Configuration

### Workspace Structure

Terraform workspaces follow naming convention: `<STAGE>_<CLUSTER>`

Examples:
- `dev_fxi-001-eastus2` — Development environment, FXI cluster in East US 2
- `test_fxi-001-eastus2` — Test environment, same cluster
- `prod_fxi-001-eastus2` — Production environment, same cluster

### Configuration Files (conf.d/)

#### default.yaml
```yaml
app_name: acv
eai: 3540813                    # Enterprise App ID
onboarding_state_id: eai-3540813_acv
```

#### dev_fxi-001-eastus2.yaml
```yaml
environment: nonprod
```

#### test_fxi-001-eastus2.yaml
```yaml
environment: nonprod
```

#### prod_fxi-001-eastus2.yaml
```yaml
environment: prod
```

### Configuration Merging

Configurations are deep-merged in order:
1. **app_info** — Parsed from workspace name (stage, cluster)
2. **default.yaml** — Application defaults
3. **Stage YAML** — Environment-specific overrides (e.g., dev_fxi-001-eastus2.yaml)
4. **Interpolations** — Dynamic values computed from workload details

This enables minimal config duplication and environment-specific overrides.

---

## 6. Prerequisites

### Tools Required

| Tool | Version | Installation |
|------|---------|--------------|
| **Terraform** | ~> 1.5.0 | [terraform.io](https://www.terraform.io/downloads.html) |
| **Azure CLI** | 2.40+ | [microsoft.com/cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) |
| **Git** | 2.40+ | [git-scm.com](https://git-scm.com/) |
| **kubectl** | 1.28+ | [kubernetes.io](https://kubernetes.io/docs/tasks/tools/) |
| **jq** | Latest | [stedolan.github.io/jq](https://stedolan.github.io/jq/) |
| **Helm** | 3.10+ | [helm.sh](https://helm.sh/docs/intro/install/) (optional) |

### Azure Permissions

Required Azure roles:
- **Contributor** on the target subscription (for resource creation)
- **Key Vault Administrator** (for secrets management)
- **Active Directory Administrator** (for AD integration)

### Network Access

- Network connectivity to Azure cloud endpoints
- Access to GitHub repositories (FedEx internal modules)
- VPN access (if deploying from on-premises)

---

## 7. Quick Start

### Step 1: Clone Repository

```bash
cd ~/projects
git clone https://github.com/FedEx/eai-3540813-infra.git
cd eai-3540813-infra
```

### Step 2: Initialize Terraform

```bash
# Select workspace
terraform workspace select dev_fxi-001-eastus2

# Or create if new
terraform workspace new dev_fxi-001-eastus2

# Initialize Terraform (downloads providers & modules)
terraform init
```

### Step 3: Plan Deployment

```bash
# Dry-run to see what will be created
terraform plan -out=tfplan

# Output shows resources to be created, modified, or destroyed
# Example:
# Plan: 15 to add, 0 to change, 0 to destroy.
```

### Step 4: Apply Deployment

```bash
# Apply the plan
terraform apply tfplan

# Or directly apply (interactive)
terraform apply

# Output shows resource IDs, connection strings, etc.
```

### Step 5: Verify Deployment

```bash
# Get outputs
terraform output

# Connect to database
psql -h $(terraform output -raw db_host) \
  -U $(terraform output -raw db_username) \
  -d acvdb

# Check Kubernetes
kubectl get all -n acv-dev

# Verify Redis
redis-cli -h $(terraform output -raw redis_host) \
  -p $(terraform output -raw redis_port) \
  -a $(terraform output -raw redis_password) \
  ping
```

---

## 8. Key Azure Services

### PostgreSQL Flexible Server

- **Databases**: acv-db (with failover support in prod)
- **Server Parameters**: 20+ custom parameters (pgBouncer, Query Store, etc.)
- **Backups**: Automated daily with 7-day retention
- **Monitoring**: Query Store, slow query logs, connection monitoring
- **Connection String**: `postgresql://user:pass@host:5432/acvdb`

### Redis Cache

- **SKU**: Standard/Premium (capacity varies by stage)
- **Capacity**: 1-5 GB (configurable)
- **Eviction Policy**: Redis maxmemory policies
- **TLS Version**: 1.2+ (encrypted connections)
- **Connection String**: `redis://:password@host:6379`

### Event Hubs

- **Namespace SKU**: Standard (scalable to Premium)
- **Hubs**: acv (default)
- **Partitions**: 4 (for parallelism)
- **Retention**: 7 days
- **Protocol**: AMQP 1.0 + Kafka (port 9093)

### Key Vault

- **Access Policies**: Role-based (groups, managed identities)
- **Soft Delete**: 90-day retention
- **Network Access**: Private endpoints (no public internet exposure)
- **Secrets Stored**: DB credentials, API keys, certificates

---

## 9. Common Operations

### Deploy to New Environment

```bash
# Select new workspace
terraform workspace new test_fxi-001-eastus2

# Plan and apply
terraform plan
terraform apply
```

### Update Configuration

```bash
# Edit conf.d/dev_fxi-001-eastus2.yaml
# Then reapply
terraform plan
terraform apply
```

### Destroy Infrastructure

```bash
# DANGEROUS: Destroys all resources in the workspace
terraform destroy

# Approved for dev only; test/prod requires additional approvals
```

### Import Existing Resources

```bash
# If resources exist outside Terraform, import them:
terraform import azurerm_resource_group.this /subscriptions/SUB_ID/resourceGroups/RG_NAME
```

---

## 10. Deployment Pipelines

### GitHub Actions

Automated CI/CD via `.github/workflows/`:
1. **Plan** — terraform plan on PRs (validates syntax)
2. **Apply** — terraform apply on merge to main (creates/updates resources)
3. **Destroy** — terraform destroy (dev only, on-demand)

### Manual Deployment

Using Azure DevOps or Terraform Cloud (TFE):
1. Fork/clone this repository
2. Create feature branch
3. Make Terraform changes
4. Submit PR (triggers plan)
5. Merge PR (triggers apply)
6. Monitor Terraform logs

---

## 11. Monitoring & Troubleshooting

### Check Resource Status

```bash
# Azure CLI
az resource list --resource-group eastus2-fxi-dev-acv-rg

# Terraform
terraform state list

# Kubernetes
kubectl get all --all-namespaces
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "State lock" | Another action using state | Wait for other action to complete; see [State Locking](https://www.terraform.io/docs/state/locking.html) |
| "Authentication failed" | Wrong Azure credentials | Run `az login; az account set -s <SUBSCRIPTION_ID>` |
| "Module not found" | GitHub access issue | Verify SSH key or PAT token for GitHub |
| "Private endpoint failed" | Subnet IP depletion | Check subnet CIDR ranges in `conf.d/` |

---

## 12. Documentation Index

| Document | Purpose |
|----------|---------|
| [HLD.md](HLD.md) | High-level architecture and design patterns |
| [LLD.md](LLD.md) | Low-level Terraform code structure |
| [architecture.md](architecture.md) | Deployment topology and infrastructure diagrams |
| [code-mapping.md](code-mapping.md) | File navigation and quick reference |
| [glossary.md](glossary.md) | Terminology and acronyms |
| [onboarding.md](onboarding.md) | Developer setup and workflows |

---

## 13. Contacts & Support

| Role | Team | Contact |
|------|------|---------|
| **Infrastructure Lead** | Platform Engineering | @platform-eng-leads |
| **Terraform Module Owners** | Cloud Engineering | See modules in `modules/infra/` |
| **Azure Administration** | Cloud Operations | cloud-ops@fedex.com |
| **Kubernetes Operations** | DevOps | devops-team@fedex.com |
| **On-Call Support** | SRE | See on-call schedule |

---

## 14. Additional Resources

- [FedEx Terraform Guidelines](https://fedex-internal-docs.example.com/terraform-guidelines)
- [Azure Best Practices](https://docs.microsoft.com/en-us/azure/architecture/guide/)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/)
- [Delphix Data Virtualization](https://www.delphix.com/platform/data-virtualization)

---

## 15. License & Governance

- **Ownership**: Account Creation Validations (ACV) Team
- **Repository**: Private (FedEx GitHub Enterprise)
- **License**: FedEx Internal Use Only
- **Compliance**: SOC 2, PCI-DSS, GDPR (as applicable)

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** Infrastructure Engineers, DevOps, Cloud Architects, Platform Engineering
