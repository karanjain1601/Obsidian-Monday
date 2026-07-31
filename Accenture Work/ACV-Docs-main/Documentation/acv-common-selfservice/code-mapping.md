# Common Self Service - Repository Structure & Navigation

**Purpose:** Map template repository structure and locations of key files.

**Scope:** Directory organization, file inventory, navigation guide.

---

## 1. Repository Navigation Map

### 1.1 Complete Directory Structure

```
eai-3540813-common-selfservice/
│
├── .github/                           # GitHub-specific configuration
│   ├── workflows/                     # CI/CD pipeline definitions
│   │   ├── ci.yml                    # Main CI pipeline (build, test, quality)
│   │   ├── build-and-push.yml        # Docker build and registry push
│   │   ├── deploy-dev.yml            # Deploy to development environment
│   │   ├── deploy-test.yml           # Deploy to test environment
│   │   ├── deploy-prod.yml           # Deploy to production (approval gate)
│   │   ├── security-scan.yml         # SAST, dependency, image scans
│   │   ├── rollback.yml              # Emergency rollback procedure
│   │   └── health-check.yml          # Automated health verification
│   │
│   └── CODEOWNERS                    # Code review requirements per file
│
├── helm/                              # Kubernetes Helm chart templates
│   ├── Chart.yaml                    # Chart metadata and version
│   ├── values.yaml                   # Default configuration values
│   ├── values-schema.json            # Value schema validation
│   │
│   └── templates/
│       ├── deployment.yaml           # Kubernetes Deployment specification
│       ├── service.yaml              # Kubernetes Service (exposed ports)
│       ├── ingress.yaml              # Ingress controller rules
│       ├── configmap.yaml            # Application configuration storage
│       ├── secret.yaml               # Secret reference template
│       ├── hpa.yaml                  # Horizontal Pod Autoscaler config
│       ├── pdb.yaml                  # Pod Disruption Budget
│       ├── networkpolicy.yaml        # Network security policies
│       ├── serviceaccount.yaml       # Kubernetes service account
│       ├── role.yaml                 # RBAC role definition
│       ├── rolebinding.yaml          # RBAC role binding
│       └── _helpers.tpl              # Template helper functions
│
├── helm-releases/                     # Environment-specific Helm values
│   ├── nonprod-dev.yaml              # Development environment overrides
│   ├── nonprod-test.yaml             # Test environment overrides
│   └── prod.yaml                     # Production environment overrides
│
├── scripts/                           # Utility shell scripts
│   ├── deploy.sh                     # Deployment helper (Helm + kubectl)
│   ├── rollback.sh                   # Rollback to previous deployment
│   ├── health-check.sh               # Service health verification
│   ├── backup-config.sh              # Configuration backup
│   ├── cleanup-stale-images.sh       # ACR image cleanup
│   └── validate-helm.sh              # Helm chart validation
│
├── terraform/ (optional)              # Infrastructure as Code (optional)
│   ├── main.tf                       # Terraform main configuration
│   ├── variables.tf                  # Variable definitions
│   ├── outputs.tf                    # Output values
│   ├── providers.tf                  # Provider configuration
│   └── environments/
│       ├── dev.tfvars
│       ├── test.tfvars
│       └── prod.tfvars
│
├── src/                              # Application source code
│   ├── main/
│   │   ├── java/ (Java projects)
│   │   │   └── com/fedex/acv/
│   │   ├── typescript/ (TypeScript projects)
│   │   │   └── src/
│   │   ├── python/ (Python projects)
│   │   │   └── acv/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-test.yml
│   │       └── application-prod.yml
│   │
│   └── test/
│       ├── java/ (Unit tests)
│       │   └── com/fedex/acv/
│       ├── integration/ (Integration tests)
│       └── resources/ (Test data)
│
├── docker/                           # Docker build artifacts
│   ├── Dockerfile                   # Multi-stage container definition
│   ├── Dockerfile.dev               # Development-specific Dockerfile
│   ├── .dockerignore                # Docker build ignore patterns
│   └── entrypoint.sh                # Container entry script
│
├── config/                          # Configuration templates
│   ├── application-template.yml    # Spring Boot config template
│   ├── logging-config.xml          # Logback configuration
│   └── security-config.yaml        # Security settings template
│
├── tests/                           # Test artifacts
│   ├── unit/                        # Unit test data
│   ├── integration/                 # Integration test fixtures
│   ├── e2e/                         # End-to-end test scenarios
│   └── performance/                 # Load test configurations
│
├── docs/                            # Additional documentation
│   ├── CONTRIBUTING.md              # Contribution guidelines
│   ├── DEPLOYMENT.md                # Deployment procedures
│   ├── TROUBLESHOOTING.md           # Common issues and solutions
│   └── SECURITY.md                  # Security best practices
│
├── examples/                        # Example implementations
│   ├── minimal-service/             # Minimal example microservice
│   ├── spring-boot-service/         # Full Spring Boot example
│   ├── angular-ui/                  # Angular UI example
│   └── job-service/                 # Background job example
│
├── .gitignore                       # Git ignore patterns
├── .gitattributes                   # Git attributes (line endings, etc)
├── Dockerfile                       # Container definition (root level)
├── docker-compose.yml               # Local dev environment
├── pom.xml                          # Maven build configuration (Java)
├── package.json                     # npm dependencies (Node)
├── angular.json                     # Angular configuration (if applicable)
├── tsconfig.json                    # TypeScript configuration
├── README.md                        # Project overview and quick start
├── VERSION                          # Version number file
└── LICENSE                          # License information
```

---

## 2. File Inventory by Purpose

### 2.1 CI/CD Workflow Files

| File | Purpose | Trigger | Key Actions |
|------|---------|---------|------------|
| **.github/workflows/ci.yml** | Build, test, quality | Push/PR | Maven build, JUnit, SonarQube scan |
| **.github/workflows/build-and-push.yml** | Container registry push | Tag creation | Docker build, Trivy scan, ACR push |
| **.github/workflows/deploy-dev.yml** | Deploy to dev | Manual | Helm upgrade (dev cluster) |
| **.github/workflows/deploy-test.yml** | Deploy to test | Manual | Helm upgrade (test cluster) |
| **.github/workflows/deploy-prod.yml** | Deploy to prod | Manual approval | Helm upgrade (prod cluster) |
| **.github/workflows/security-scan.yml** | Security scanning | Every push | SAST, OWASP, image scan |

### 2.2 Kubernetes Configuration Files

| File | Responsibility | Environment | Customization |
|------|-----------------|------------|---|
| **helm/Chart.yaml** | Chart metadata | All | Service name, version |
| **helm/values.yaml** | Default config | All | Resource limits, replicas |
| **helm-releases/nonprod-dev.yaml** | Dev overrides | Development | 1 replica, debug logging |
| **helm-releases/nonprod-test.yaml** | Test overrides | Testing | 2 replicas, info logging |
| **helm-releases/prod.yaml** | Prod overrides | Production | 3+ replicas, warn logging |
| **helm/templates/deployment.yaml** | Pod definition | All | Container, volumes, probes |
| **helm/templates/ingress.yaml** | External routing | All | DNS, TLS, path routing |

### 2.3 Application Configuration Files

| File | Purpose | Environment | Override |
|------|---------|------------|---|
| **src/main/resources/application.yml** | Default config | Development | Overridden by profiles |
| **src/main/resources/application-dev.yml** | Dev-specific | Development | Debug, local services |
| **src/main/resources/application-test.yml** | Test-specific | Testing | Test database, mocks |
| **src/main/resources/application-prod.yml** | Prod-specific | Production | Production database |

### 2.4 Docker & Build Files

| File | Purpose | Language | Customization |
|------|---------|----------|---|
| **Dockerfile** | Multi-stage build | All | Base image, dependencies |
| **docker-compose.yml** | Local environment | All | Services, ports, volumes |
| **pom.xml** | Maven build | Java | Dependencies, plugins, profiles |
| **package.json** | npm dependencies | Node.js | Scripts, dependencies |
| **angular.json** | Angular config | TypeScript | Build targets, optimization |

---

## 3. Key Locations Quick Reference

### Where to Find...

| What | File Location | Edit By |
|-----|--------------|---------|
| **Build commands** | `.github/workflows/ci.yml` (lines 30-50) | Release Engineer |
| **Container base image** | `Dockerfile` (line 3 Stage 1, line 12 Stage 2) | DevOps Engineer |
| **Pod replicas (dev)** | `helm-releases/nonprod-dev.yaml` line 1 | Developer |
| **Pod replicas (prod)** | `helm-releases/prod.yaml` line 1 | DevOps Engineer |
| **Health check endpoint** | `Dockerfile` (HEALTHCHECK) or `helm/templates/deployment.yaml` | Developer |
| **Environment variables** | `helm/templates/configmap.yaml` | Developer |
| **Database credentials** | Azure Key Vault (referenced in deploy workflow) | Platform Team |
| **Secrets rotation policy** | `docs/SECURITY.md` | Platform Team |
| **Test coverage threshold** | `.github/workflows/ci.yml` (SonarQube section) | QA Lead |
| **Deployment timeouts** | `helm/values.yaml` → `resources.limits` | DevOps Engineer |

---

## 4. Workflow File Details

### 4.1 CI Workflow Structure

```yaml
.github/workflows/ci.yml
├── Trigger: push/PR
├── Jobs: [build, security-scan, docker-build]
│   ├── checkout@v3
│   ├── setup-java@v3 (JDK 21)
│   ├── maven clean package
│   ├── maven test (coverage >75%)
│   ├── maven sonar:sonar
│   ├── docker-build-push@v4
│   ├── trivy-action@master
│   └── upload-sarif@v2
└── Artifacts: test results, coverage report
```

### 4.2 Deploy Workflow Structure

```yaml
.github/workflows/deploy-prod.yml
├── Trigger: manual workflow dispatch
├── Inputs: image-tag, environment
├── Jobs: [approval, deploy]
│   ├── Approval environment (requires team)
│   ├── Checkout code
│   ├── az aks get-credentials
│   ├── helm repo add/update
│   ├── helm upgrade --install
│   ├── kubectl rollout status
│   ├── health check (wget)
│   └── slack notification
└── Duration: ~10 minutes
```

---

## 5. Configuration Override Hierarchy

```
Application Configuration Resolution:
1. environment variable (highest priority)
2. application-{environment}.yml
   └─ e.g., application-prod.yml
3. helm configmap values
4. application.yml (default)
5. application defaults in code (lowest priority)

Example: LOG_LEVEL preference order
1. ${LOG_LEVEL} environment variable
2. logging.level.root in application-prod.yml
3. logLevel in helm configmap
4. logging.level.root in application.yml
5. Logger default (INFO)
```

---

## 6. Deployment File Locations

### 6.1 Image Registry Paths

| Environment | Registry | Image Path | Format |
|-------------|----------|-----------|--------|
| **dev** | acr-dev.azurecr.io | acv/myservice | myservice:git-sha |
| **test** | acr-test.azurecr.io | acv/myservice | myservice:git-sha |
| **prod** | acr-prod.azurecr.io | acv/myservice | myservice:v1.2.3 |

### 6.2 Namespace & Release Names

| Environment | Kubernetes Cluster | Namespace | Helm Release | DNS |
|-------------|-------------------|-----------|---|---|
| **dev** | aks-dev | dev | myservice | myservice.dev.company.com |
| **test** | aks-test | test | myservice | myservice.test.company.com |
| **prod-us-east** | aks-prod-useast | production | myservice | myservice.company.com |
| **prod-us-west** | aks-prod-uswest | production | myservice | myservice-west.company.com |

---

## 7. Code Navigation for Developers

### New Developer Starting Points

```
For understanding CI/CD:
1. Start: README.md (overview)
2. Read: HLD.md (architecture diagram)
3. Review: .github/workflows/ci.yml (build flow)
4. Try: Local build (docker-compose up)

For making code changes:
1. Edit: src/main/...
2. Test: mvn test (local)
3. Commit/Push: triggers .github/workflows/ci.yml
4. Monitor: GitHub Actions tab
5. Review: PR from feature branch

For deploying service:
1. Tag release: git tag v1.2.3
2. Trigger: .github/workflows/build-and-push.yml (automatic)
3. Verify: Image in ACR
4. Deploy: .github/workflows/deploy-dev.yml (manual trigger)
5. Check: kubectl get pods -n dev

For troubleshooting:
1. Check logs: kubectl logs -n {env} deployment/myservice
2. Check events: kubectl describe pod -n {env} <pod-name>
3. Review: GitHub Actions logs
4. Escalate: #acv-platform Slack channel
```

---

## 8. File Editing Guidelines

### 8.1 Don't Edit (Maintained by Build)

| File | Reason |
|------|--------|
| **target/** | Maven build artifacts (generated) |
| **.github/workflows/*.yml** | Versioned in template repo |
| **helm/Chart.yaml** (version) | Auto-incremented on release |
| **docker/app.jar** | Built by CI pipeline |

### 8.2 Do Edit (Required for New Services)

| File | When | Example |
|------|------|---------|
| **pom.xml** | Creating Java service | Update `<artifactId>` |
| **helm/values.yaml** | Service-specific setup | Set default `image.repository` |
| **helm-releases/prod.yaml** | Prod customization | Set `replicaCount: 3` |
| **src/main/resources/application.yml** | Service configuration | Add service-specific properties |

---

## Cross-References

- [HLD.md](HLD.md) — Architecture overview
- [LLD.md](LLD.md) — Workflow implementation details
- [services.md](services.md) — Template API reference
- [glossary.md](glossary.md) — Terminology
- [onboarding.md](onboarding.md) — Setup procedures

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** Developers, DevOps Engineers, New Contributors
