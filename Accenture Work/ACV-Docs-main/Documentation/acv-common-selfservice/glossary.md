# Common Self Service - Glossary & CI/CD Terminology

**Purpose:** Define terms, concepts, and acronyms used throughout the framework.

**Scope:** CI/CD terminology, Kubernetes concepts, AWS/Azure terminology.

---

## A

**ACR** (Azure Container Registry)
Managed Docker registry in Azure for storing container images. ACV uses ACR instances per environment (dev, test, prod). Images pushed by CI pipeline and pulled by AKS clusters.

**ACS** (Azure Container Service)
Legacy service (deprecated). Replaced by AKS (Azure Kubernetes Service).

**AKS** (Azure Kubernetes Service)
Managed Kubernetes cluster hosted on Azure. Runs containerized ACV services. Three clusters: aks-dev, aks-test, aks-prod.

**Approval Gate (Deployment Gate)**
Manual approval checkpoint in CI/CD pipeline before production deployment. Requires authorization from team leads or platform engineers. Prevents accidental production releases.

**Artifacts**
Build outputs (JAR files, Docker images, reports) produced by CI pipeline and stored in registries or repositories.

**Authentication**
Process of verifying identity. In ACV framework: GitHub (source control), OAuth2 (application), Azure AD (infrastructure).

**Autoscaling** (HPA - Horizontal Pod Autoscaler)
Kubernetes feature automatically increasing/decreasing pod replicas based on CPU/memory usage. Configured in `helm/values.yaml`.

---

## B

**Base Image**
Starting image for multi-stage Docker builds. Example: `eclipse-temurin:21-jre-alpine` for Java runtime.

**Bicep**
Infrastructure as Code language for Azure (alternative to Terraform). Used for declaring Azure resources declaratively.

**Buildx**
Docker build extension enabling multi-platform and caching features. Used in GitHub Actions for efficient container builds.

**Build Time**
Duration of CI pipeline execution. Target: <10 minutes for ACV services. Includes checkout, build, test, quality scan.

---

## C

**CI** (Continuous Integration)
Automated practice of building and testing code on every commit. `.github/workflows/ci.yml` implements ACV CI pipeline.

**CD** (Continuous Deployment/Delivery)
Automated practice of deploying tested code to production. Implemented via deploy workflows with approval gates.

**Cluster**
Kubernetes cluster (aks-dev, aks-test, aks-prod). Collection of worker nodes running containerized services.

**ConfigMap**
Kubernetes resource storing non-sensitive configuration data (application settings, feature flags). Referenced by pods via environment variables or volume mounts.

**Container**
Lightweight, isolated environment running application code. Built from Docker image.

**Container Registry**
Repository storing Docker images. ACV uses Azure Container Registry (ACR) per environment.

**CODEOWNERS**
GitHub file (`.github/CODEOWNERS`) specifying which teams must review changes to specific files. Enforces code review standards.

---

## D

**Deployment**
Kubernetes resource defining how to run containerized applications. Manages replicas, updates, rollbacks. Template: `helm/templates/deployment.yaml`.

**Docker**
Container platform for packaging applications with dependencies. Multi-stage Dockerfile reduces final image size (1.2 GB → 250 MB).

**Dry Run**
Executing deployment simulation without actual changes. Validates Helm manifests and RBAC permissions without affecting live systems.

---

## E

**Environment**
Target deployment destination: development (dev), testing (test), production (prod). Each has separate cluster, image registry, configuration.

**Environment Variable**
Runtime configuration passed to containers. Examples: `LOG_LEVEL`, `SPRING_PROFILES_ACTIVE`, `DATABASE_URL`.

---

## F

**Flux**
GitOps tool for declarative continuous deployment to Kubernetes. Alternative to Helm; under consideration for future ACV adoption.

---

## G

**Git**
Version control system. GitHub hosts ACV repositories.

**GitHub Actions**
CI/CD platform integrated into GitHub. Executes workflows (.github/workflows/) on repository events (push, PR, tag).

**Git Commit**
Snapshot of code changes. Unique SHA identifier. TriggerCI pipeline.

**Git Tag**
Named reference to specific commit. Example: `v1.2.3`. Triggers release build and deployment workflow.

**GitOps**
Practice of using Git as source of truth for infrastructure and application configuration. Enables declarative, version-controlled deployments.

**Grafana**
Metrics visualization and alerting platform. Displays Kubernetes/application metrics collected by Prometheus.

---

## H

**Helm**
Package manager for Kubernetes. Templating engine for generating Kubernetes manifests from values files. ACV uses Helm for all deployments.

**Helm Chart**
Package containing Kubernetes manifests, templates, and default values. ACV framework provides standard chart template in `helm/` directory.

**Helm Release**
Deployed instance of a Helm chart. Example: "myservice-deployment" is a release of the service chart in dev cluster.

**Helm Repository**
Remote registry storing Helm charts. ACV charts stored in company Helm repository.

**Health Check** (Liveness Probe, Readiness Probe)
Kubernetes mechanism verifying pod health. Liveness: is pod alive? Readiness: can pod handle traffic? Defined in Deployment spec.

**HPA** (Horizontal Pod Autoscaler)
Kubernetes controller automatically scaling number of pod replicas. Scales based on CPU/memory metrics. Configured in `helm/templates/hpa.yaml`.

---

## I

**Idempotency**
Property where repeated executions produce same result. Important for deployment workflows (helmupgrade --install).

**Image Scanning**
Security practice examining container images for vulnerabilities. ACV uses Trivy scanner in CI pipeline.

**Ingress**
Kubernetes resource exposing services outside cluster. Routes HTTP/HTTPS traffic to backend services. Managed via `helm/templates/ingress.yaml`.

---

## J

**JAR** (Java Archive)
Compiled Java application package. Built by Maven, executed by JRE in container.

**JDK** (Java Development Kit)
Java development tools (compiler, libraries, debugger). ACV uses JDK 21.

**JRE** (Java Runtime Environment)
Runtime for executing Java applications. Lightweight alternative to JDK (used in production containers).

---

## K

**Key Vault**
Azure service storing secrets (credentials, API keys, certificates). Referenced by deployment pipelines. Rotated every 90 days.

**Kubernetes (K8s)**
Container orchestration platform deploying and managing containerized workloads. ACV runs on Azure Kubernetes Service (AKS).

**kubectl**
Command-line tool for interacting with Kubernetes clusters. Used in deployment workflows.

---

## L

**Liveness Probe**
Kubernetes health check determining if pod is alive. If failing, Kubernetes restarts the pod. Example: HTTP GET /actuator/health/liveness.

**Log Level**
Severity threshold for logging (TRACE, DEBUG, INFO, WARN, ERROR, FATAL). Environment-specific (DEBUG in dev, ERROR in prod).

---

## M

**Maven**
Build automation tool for Java projects. Executes in CI pipeline (mvn clean install, mvn test, mvn sonar:sonar).

**Multi-Stage Build**
Docker build technique using multiple FROM statements. Stage 1 compiles (with full JDK), Stage 2 runs (slim JRE). Reduces image size.

---

## N

**Namespace**
Kubernetes logical isolation within cluster. ACV uses namespaces: dev, test, production.

**Node**
Worker machine in Kubernetes cluster. Runs pods. Managed by AKS.

**NP** (Network Policy)
Kubernetes security policy controlling traffic between pods. Enforces network segmentation per environment.

---

## O

**OWASP**
Open Web Application Security Project. Provides security best practices and scanning tools (OWASP Dependency Check).

**On-Call**
Engineer responsible for production monitoring and incident response. Receives alerts via PagerDuty.

---

## P

**PDB** (Pod Disruption Budget)
Kubernetes policy ensuring minimum pod availability during disruptions (node drain, updates). Prevents cascading service outages.

**Pod**
Smallest deployable unit in Kubernetes. Contains one or more containers. ACV typically runs one container per pod.

**Prometheus**
Metrics collection and timeseries database. Scrapes: /actuator/prometheus endpoints from services. Data consumed by Grafana.

**Provider**
Cloud infrastructure provider (Azure, AWS). ACV deployed on Azure.

---

## Q

**Quality Gate**
Automated checkpoint verifying code quality before merge. SonarQube analyses code; if quality gate fails, PR blocked.

---

## R

**RBAC** (Role-Based Access Control)
Kubernetes authorization system. Defines permissions (roles) for users/service accounts. Implemented via Roles and RoleBindings.

**Readiness Probe**
Kubernetes health check determining if pod ready to handle traffic. If failing, pod removed from service load balancing. Example: HTTP GET /actuator/health/readiness.

**Redis**
In-memory data store used for caching, session storage. Optional service in deployment.

**Registry** (Container Registry)
Repository storing Docker images. ACV uses Azure Container Registry (ACR).

**Release**
Software version shipped to production. Tagged (e.g., v1.2.3) and tracked in release notes.

**RBAC** (Role-Based Access Control)
Authorization system controlling who can perform what actions on Kubernetes resources.

**Replica**
Copy of a pod. High-availability deployments run multiple replicas. Configured in `helm/values.yaml` replicaCount.

**Resource**
Kubernetes computational unit (CPU, memory) allocated to pods. Configured in `helm/values.yaml` resources section.

**Rollback**
Reverting to previous version after deployment failure. Helm rollback command reverts to previous chart revision.

**Rollout**
Progressive deployment of new version. Kubernetes manages rolling update (gradually replace old pods with new).

---

## S

**SAST** (Static Application Security Testing)
Code analysis without executing it. Identifies vulnerabilities, code smells, security issues. SonarQube provides SAST.

**Service**
1. Kubernetes service: Stable network endpoint exposing pods
2. ACV microservice: Deployed application (e.g., api-connector-service)

**Service Account**
Kubernetes identity for pods to authenticate with API server and other services. Each deployment gets service account.

**SHA** (Secure Hash Algorithm)
Cryptographic hash. Git commit SHA uniquely identifies commit. Docker image SHA uniquely identifies image version.

**SLA** (Service Level Agreement)
Commitment to maintain uptime/performance. ACV targets: 99.9% availability, <2 second latency.

**Slack**
Communication platform. ACV uses Slack for deployment notifications, alerts, team collaboration.

**SonarQube**
Code quality analysis platform. Scans code for bugs, vulnerabilities, code smells. Quality gate gates PR merges.

---

## T

**Terraform**
Infrastructure as Code tool for declaratively managing cloud resources (optional for ACV).

**Trivy**
Container image scanning tool finding vulnerabilities. Runs in CI pipeline before ACR push.

---

## U

**Upstream**
Original project or repository. "Upstream" changes not yet integrated locally.

---

## V

**Validation**
Checking that workflows/manifests are syntactically correct. Example: helm lint, kubectl --dry-run=client.

**Volume**
Storage attached to pod. Can be: ConfigMap, Secret, PersistentVolume, EmptyDir.

---

## W

**Webhook**
GitHub callback triggering workflow on repository event (push, PR, release).

**Workflow** (GitHub Actions)
YAML file (.github/workflows/*.yml) defining automated steps triggered by events. ACV workflow steps: build → test → scan → push → deploy.

---

## Z

**Zone** (Availability Zone)
Physical data center location. Azure clusters span multiple zones for high availability.

---

## Common Acronyms Reference

| Acronym | Full Name |
|---------|-----------|
| **ACR** | Azure Container Registry |
| **AKS** | Azure Kubernetes Service |
| **API** | Application Programming Interface |
| **AWS** | Amazon Web Services |
| **ACV** | Account Creation & Validation |
| **CD** | Continuous Deployment/Delivery |
| **CI** | Continuous Integration |
| **CPU** | Central Processing Unit |
| **CRUD** | Create, Read, Update, Delete |
| **DNS** | Domain Name System |
| **HPA** | Horizontal Pod Autoscaler |
| **HTTP** | HyperText Transfer Protocol |
| **IaC** | Infrastructure as Code |
| **JDK** | Java Development Kit |
| **JRE** | Java Runtime Environment |
| **K8s** | Kubernetes |
| **MCP** | Management Control Plane |
| **OWASP** | Open Web Application Security Project |
| **PDB** | Pod Disruption Budget |
| **PR** | Pull Request |
| **RBAC** | Role-Based Access Control |
| **SAST** | Static Application Security Testing |
| **SLA** | Service Level Agreement |
| **YAML** | YAML Ain't Markup Language |

---

## Environment Code Mappings

| Code | Full Name | Purpose |
|------|-----------|---------|
| **dev** | Development | Rapid iteration, debugging |
| **test** | Testing | QA, integration tests |
| **staging** | Staging | Pre-production validation |
| **prod** | Production | Customer-facing, live traffic |

---

## Status & State Values

### Deployment Status

| Status | Meaning | Action Required |
|--------|---------|---|
| **Pending** | Waiting for resources | Monitor availability |
| **Running** | Service operational | Normal operation |
| **CrashLoopBackOff** | Pod repeatedly crashes | Debug logs, fix code |
| **ImagePullBackOff** | Cannot pull image | Verify image exists, registry access |
| **Error** | Unrecoverable error | Investigate logs, rollback |

### Workflow Status

| Status | Meaning | Action |
|--------|---------|--------|
| **Queued** | Waiting to execute | Check runner availability |
| **In Progress** | Running | Monitor progress |
| **Completed** | Finished | Check success/failure |
| **Failed** | Execution failed | Review logs, fix issues |
| **Skipped** | Not executed | Review conditions |

---

## Cross-References

- [README.md](README.md) — Framework overview
- [HLD.md](HLD.md) — Architecture
- [LLD.md](LLD.md) — Implementation details
- [services.md](services.md) — API reference
- [code-mapping.md](code-mapping.md) — Repository structure
- [onboarding.md](onboarding.md) — Setup guide

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** All stakeholders (developers, ops, architects)
