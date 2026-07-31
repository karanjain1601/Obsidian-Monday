# ACV Infrastructure — Glossary & Terminology

**Purpose:** Define technical terms, acronyms, and concepts used in ACV infrastructure documentation.

**Scope:** Infrastructure, Terraform, Azure, Kubernetes, networking, security terminology.

---

## Terminology (A-Z)

### A

**ACR** — Azure Container Registry  
Repository for storing Docker container images for ACV microservices.

**Active Directory** — Azure AD, Microsoft Entra ID  
FedEx cloud identity provider for authentication and authorization (RBAC).

**AED** — Azure Event Hub Deployment  
Deployment of Event Hubs namespace and consumer groups.

**Affinity** — Pod affinity, node affinity  
Kubernetes scheduling rules to co-locate or separate pods based on labels or node constraints.

**AMQP** — Advanced Message Queuing Protocol  
Protocol supported by Event Hubs for message streaming (alternative to Kafka).

**ANI** — Azure Network Interface  
Virtual network adapter for Azure resources (auto-created by Terraform).

**AKS** — Azure Kubernetes Service  
Managed Kubernetes cluster (control plane managed by Microsoft).

**Azure CLI** — Command-line interface for Azure  
Tool for managing Azure resources via terminal (alternative to portal).

---

### B

**Backend** — Terraform backend  
Storage location for Terraform state files (Azure Storage in this project).

**Bastion** — Azure Bastion, Jump Box  
Secure host for accessing private resources via VPN or SSH.

**Blob Storage** — Azure Blob Storage  
Object storage for unstructured data (logs, backups, files).

**Bicep** — Infrastructure as Code language  
Azure-native IaC abstraction (alternative to ARM templates; not used in this project).

---

### C

**CDN** — Content Delivery Network  
Distributed network for caching static content (not used for data services).

**CloudPosse** — Infrastructure automation framework  
Terraform modules and utilities for standardized cloud deployments (source of utils provider).

**CNI** — Container Networking Interface  
Plugin for Kubernetes networking (Azure CNI used in AKS).

**Compliance** — Regulatory adherence  
Meeting standards like SOC 2, PCI-DSS, GDPR, HIPAA.

**Connection Pool** — pgBouncer, connection pooling  
Connection pooler for PostgreSQL to limit and reuse database connections.

**CRUD** — Create, Read, Update, Delete  
Basic data operations supported by relational databases.

**CSI** — Container Storage Interface  
Plugin for Kubernetes persistent volume provisioning.

---

### D

**DCT** — Delphix Data Control Tower  
Central management hub for Delphix data virtualization platform.

**DRI** — Directly Responsible Individual  
Person accountable for a specific area (e.g., Terraform DRI).

**dSource** — Delphix dSource  
Source database or backup linked to Delphix for virtualization.

**Dynatrace** — Application Performance Monitoring (APM)  
Tool for collecting metrics, logs, traces from applications (OneAgent).

---

### E

**EAI** — Enterprise Application ID  
Unique identifier for FedEx applications (3540813 for ACV).

**ECS** — Elastic Container Service  
AWS equivalent to AKS (not used in ACV).

**Event Hub** — Azure Event Hubs  
Fully managed event ingestion service (Kafka-compatible).

**Eviction** — Pod eviction, memory eviction  
Removal of pod/data when resource constraints force cleanup.

---

### F

**Firewall** — Azure Firewall, NSG  
Network security layer filtering ingress/egress traffic.

**FXI** — FedEx Integrated network  
Customer-facing Azure network segment.

---

### G

**Grafana** — Visualization and dashboarding tool  
UI for creating dashboards from Prometheus metrics.

**GHA** — GitHub Actions  
CI/CD platform used for Terraform plan/apply.

**Gatekeeper** — OPA (Open Policy Agent)  
Policy enforcement engine for Kubernetes (optional, not yet deployed).

---

### H

**HA** — High Availability  
System designed to continue operating  despite component failures.

**HPA** — Horizontal Pod Autoscaler  
Kubernetes controller that adjusts pod replicas based on metrics.

**Helm** — Package manager for Kubernetes  
Tool for deploying Helm charts (pre-configured Kubernetes applications).

---

### I

**IAM** — Identity and Access Management  
Azure AD + RBAC for controlling who can access what resources.

**IANA** — Internet Assigned Numbers Authority  
Authority managing IP addresses and port assignments.

**IaC** — Infrastructure as Code  
Defining infrastructure using Terraform, Bicep, or similar tools.

**Ingress** — Kubernetes Ingress  
L7 (HTTP/HTTPS) routing to Kubernetes services.

**Istio** — Service mesh  
Network layer abstraction for inter-pod communication with mTLS.

---

### K

**Kafka** — Event streaming protocol  
Protocol supported by Event Hubs (port 9093).

**Kubelet** — Kubernetes agent  
Daemon running on each node responsible for pod lifecycle.

**kubectl** — Kubernetes command-line tool  
CLI for interacting with Kubernetes clusters.

---

### L

**Label** — Kubernetes label, resource tag  
Key-value pairs for organizing and selecting resources.

**Liveness** — Liveness probe  
Kubernetes health check determining if pod should be restarted.

**Loki** — Log aggregation system  
Prometheus-compatible log ingestion (alternative to ELK).

---

### M

**Managed Identity** — Azure Managed Identity  
Azure-managed credentials for workload authentication (no key rotation needed).

**MaxMemory** — Redis memory limit policy  
Configuration controlling Redis memory usage and eviction.

**Metrics** — Prometheus metrics  
Time-series data points collected from applications and infrastructure.

**mTLS** — Mutual TLS  
Encryption where both client and server authenticate each other.

---

### N

**NSG** — Network Security Group  
Azure firewall rules for controlling traffic flow.

**Namespace** — Kubernetes namespace  
Virtual cluster partition for organizing workloads (acv-dev, acv-data, acv-monitoring).

**NAT** — Network Address Translation  
IP translation used for egress connectivity.

---

### O

**OPA** — Open Policy Agent  
Policy engine for Kubernetes governance (optional).

**OpenID Connect** — OIDC  
Protocol for workload authentication to Azure AD.

---

### P

**Partition** — Event Hubs partition  
Parallelism unit in Event Hubs (4 partitions default for ACV).

**PDB** — Pod Disruption Budget  
Policy ensuring minimum pods remain available during maintenance.

**PaaS** — Platform as a Service  
Managed services (PostgreSQL, Redis, Key Vault) vs. IaaS VMs.

**pgBouncer** — PostgreSQL connection pooler  
Connection pooling middleware reducing database load.

**Private Endpoint** — Azure Private Endpoint  
Private IP address for accessing PaaS services without internet.

**Private DNS Zone** — Private DNS  
DNS zone resolving to private IPs within VNet.

**Prometheus** — Metrics collection system  
Time-series database for infrastructure and application metrics.

**PITR** — Point-in-Time Recovery  
Ability to restore database to any point within retention window.

---

### Q

**Query Store** — PostgreSQL query monitoring  
Feature capturing query statistics for performance optimization.

---

### R

**RBAC** — Role-Based Access Control  
Azure AD-based access control using security groups and roles.

**Redis** — In-memory data store  
Distributed cache for session storage and performance optimization.

**RG** — Resource Group  
Azure container grouping resources for RBAC and lifecycle management.

**RPO** — Recovery Point Objective  
Maximum acceptable data loss (e.g., 1 hour).

**RTO** — Recovery Time Objective  
Maximum acceptable downtime (e.g., 5 minutes).

---

### S

**SAS** — Shared Access Signature  
Azure token providing limited access to storage resources.

**SLA** — Service Level Agreement  
Commitment to availability (e.g., 99.95%).

**SLO** — Service Level Objective  
Target metric (e.g., p99 latency < 100ms).

**SOC 2** — Service Organization Control 2  
Compliance framework for service providers.

**Service Principal** — Azure service account  
Non-human identity for applications/automations (used by Terraform, GitHub Actions).

**Soft Delete** — Recoverable deletion  
State where deleted resources can be recovered (Key Vault: 90 days).

**State** — Terraform state file  
JSON file tracking resource IDs and configurations.

**Subnet** — Virtual subnet  
IP address range within a Virtual Network.

---

### T

**TACOS** — Terraform, Azure, CI/CD, Observability, Security  
Stack used in ACV infrastructure (informal).

**Tenant** — Azure tenant  
FedEx AD organizational unit.

**TFE** — Terraform Enterprise  
Enterprise version of Terraform (FedEx uses for state management).

**TFVar** — Terraform variable file  
Files defining variable values (terraform.tfvars).

**TLS** — Transport Layer Security  
Encryption protocol (1.2+ required).

**TTL** — Time To Live  
Duration before data expires or requires refresh (Redis cache TTL).

---

### U

**UKSYY** — Unknown acronym  
(If encountered, check FedEx internal documentation).

---

### V

**VDB** — Virtual Database (Delphix)  
Thin-provisioned database copy from dSource.

**VNet** — Virtual Network  
Azure network infrastructure (eastus2 region for ACV).

**VPN** — Virtual Private Network  
Encrypted tunnel for secure on-premises connectivity.

---

### W

**Workspace** — Terraform workspace  
Named environment state (dev_fxi-001-eastus2, prod_fxi-001-eastus2).

---

## Acronyms Lookup Table

| Acronym | Full Form | Context |
|---------|-----------|---------|
| ACR | Azure Container Registry | Docker image repository |
| AED | Azure Event Deployment | Event Hubs deployment |
| AKS | Azure Kubernetes Service | Container orchestration |
| AMQP | Advanced Message Queue Protocol | Event Hubs protocol |
| API | Application Programming Interface | Service endpoints |
| APM | Application Performance Monitoring | Dynatrace |
| ARM | Azure Resource Manager | Azure API/provider |
| AZ | Availability Zone | Fault domain |
| CERT | Certificate | TLS certificates |
| CLI | Command Line Interface | Azure CLI, kubectl |
| CNI | Container Network Interface | Kubernetes networking |
| CPU | Central Processing Unit | Compute resource |
| CRUD | Create, Read, Update, Delete | Database operations |
| CSI | Container Storage Interface | Kubernetes storage |
| DCT | Data Control Tower | Delphix management |
| DMZ | Demilitarized Zone | Network segment |
| DNS | Domain Name System | Name resolution |
| DRI | Directly Responsible Individual | Accountability |
| EAI | Enterprise Application ID | App identifier (3540813) |
| ECS | Elastic Container Service | AWS service (not used) |
| ETCD | Distributed reliable key-value store | Kubernetes datastore |
| FXI | FedEx Integrated | Azure network segment |
| GHA | GitHub Actions | CI/CD platform |
| GX | (context-dependent) | Can mean different things |
| HA | High Availability | Fault tolerance |
| HPA | Horizontal Pod Autoscaler | Kubernetes scaling |
| HTTPS | HyperText Transfer Protocol Secure | Encrypted web protocol |
| IAM | Identity and Access Management | Azure AD + RBAC |
| IaC | Infrastructure as Code | Terraform, Bicep |
| IANA | Internet Assigned Numbers Authority | Standards body |
| IOPS | Input/Output Operations Per Second | Storage performance |
| IP | Internet Protocol | Network addressing |
| IPAM | IP Address Management | IP allocation tracking |
| JSON | JavaScript Object Notation | Data format |
| K8s | Kubernetes | Container orchestration |
| KPI | Key Performance Indicator | Metrics to track |
| KV | Key Vault | Azure secrets manager |
| LDAP | Lightweight Directory Access Protocol | Directory services |
| LRU | Least Recently Used | Cache eviction policy |
| LTR | Long-Term Retention | Backup retention |
| MEG | Megabyte | Data size unit |
| MFA | Multi-Factor Authentication | Security requirement |
| MIT | Massachusetts Institute Technology | Common license |
| mTLS | Mutual TLS | Bidirectional encryption |
| NAT | Network Address Translation | IP translation |
| NFS | Network File System | File sharing protocol |
| NIC | Network Interface Card | Virtual network adapter |
| NSG | Network Security Group | Azure firewall |
| OIDC | OpenID Connect | Authentication protocol |
| OPA | Open Policy Agent | Policy engine |
| OPS | Operations team | Infrastructure management |
| P95/P99 | 95th/99th percentile | Latency metrics |
| PAT | Personal Access Token | GitHub/Azure credential |
| PDB | Pod Disruption Budget | Kubernetes availability |
| PII | Personally Identifiable Information | Sensitive data |
| PITR | Point In Time Recovery | Database restoration |
| PKI | Public Key Infrastructure | Certificate management |
| PM | Project Manager | Project leadership |
| POD | Point Of Deployment | Kubernetes scheduling unit |
| PVC | Persistent Volume Claim | Kubernetes storage request |
| RBAC | Role-Based Access Control | Azure AD access model |
| RDS | Relational Database Service | AWS service (not used) |
| REST | Representational State Transfer | API style |
| RG | Resource Group | Azure container |
| RBAC | Role Based Access Control | Permissions model |
| RTO | Recovery Time Objective | Downtime tolerance |
| RPO | Recovery Point Objective | Data loss tolerance |
| SAP | Service Alert Policy | Alerting mechanism |
| SAS | Shared Access Signature | Azure token |
| SDK | Software Development Kit | Library for developers |
| SLA | Service Level Agreement | Availability commitment |
| SLO | Service Level Objective | Performance target |
| SOC2 | Service Organization Control | Compliance framework |
| SQL | Structured Query Language | Database query language |
| SSH | Secure Shell | Remote access protocol |
| SSO | Single Sign-On | Unified authentication |
| TFE | Terraform Enterprise | Enterprise Terraform |
| TLS | Transport Layer Security | Encryption standard |
| TNT | Tenant (Azure network) | Network abbreviation |
| TTL | Time To Live | Expiration timer |
| URL | Uniform Resource Locator | Web address |
| VDB | Virtual Database | Delphix thin copy |
| VNet | Virtual Network | Azure network |
| VPN | Virtual Private Network | Encrypted tunnel |
| VSTS | Visual Studio Team Services | Azure DevOps (legacy) |
| YAML | YAML Ain't Markup Language | Config file format |
| YAGNI | You Aren't Gonna Need It | Design principle |
| ZFS | Zettabyte File System | File system (not used) |
| ZIP | Compressing utility | Archive format |

---

## Common Concepts Explained

### Infrastructure as Code

Defining cloud infrastructure using version-controlled code (Terraform) rather than manual clicks in cloud portal. Benefits:
- Reproducibility (same code → same infrastructure)
- Version control (audit trail of changes)
- Automation (CI/CD deployment)
- Scalability (repeat for multiple environments)

### Multi-Tenancy

Serving multiple customers/departments from same infrastructure. In ACV:
- Country codes enable data isolation (data never crosses borders)
- Kubernetes namespaces isolate workloads (acv-dev vs. acv-prod)
- Database schemas separate tenant data (if needed)

### Private Endpoints

Azure mechanism for accessing PaaS services without public internet exposure:
- PostgreSQL, Redis, Key Vault get private IPs in VNet
- DNS privately resolves domain names to private IPs
- NSG rules restrict access to whitelisted subnets
- Zero inbound exposure from internet

### Workload Identity

Azure's modern, keyless authentication for pods:
- Pod assumes service account
- Service account linked to managed identity
- Managed identity has RBAC roles
- Pod automatically gets short-lived tokens from Azure AD
- No keys/passwords to rotate

### Cache-Aside Pattern

Common caching strategy:
```
1. App requests data
2. Check cache (Redis)
3. Cache hit → return
4. Cache miss → query database
5. Update cache
6. Return to app
```

### Service Mesh (Istio)

Network layer abstraction for pod communication:
- Intercepts pod traffic
- Enables mTLS encryption
- Provides traffic management (canary deploys, circuit breakers)
- Observability (service graph, traces)

---

## FedEx-Specific Terms

| Term | Meaning |
|------|---------|
| **EAI** | Enterprise Application ID (3540813 for ACV) |
| **FXI** | FedEx Integrated (Azure network segment, customer-facing) |
| **TNT** | Tenant network (internal Azure segment) |
| **FXEI** | FedEx Enterprise Infrastructure (cloud platform) |
| **DRI** | Directly Responsible Individual (ownership) |
| **Ops** | Operations team (infrastructure management) |
| **Platform Eng** | Platform Engineering (cloud infrastructure team) |

---

## Cross-References

- [README.md](README.md) — Quick start guide
- [HLD.md](HLD.md) — Architecture concepts
- [LLD.md](LLD.md) — Code implementation details
- [architecture.md](architecture.md) — Deployment model
- [code-mapping.md](code-mapping.md) — File locations
- [onboarding.md](onboarding.md) — Getting started

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** All infrastructure stakeholders
