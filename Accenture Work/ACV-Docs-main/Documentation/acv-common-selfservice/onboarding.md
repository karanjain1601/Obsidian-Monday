# Common Self Service - Developer Onboarding & Framework Guide

**Purpose:** Enable teams to quickly onboard new microservices using the self-service framework.

**Scope:** Framework setup, service creation, first deployment, troubleshooting.

---

## 1. Prerequisites

### 1.1 Required Access & Accounts

| Requirement | Purpose | How to Obtain |
|------------|---------|---|
| **GitHub Enterprise Account** | Source control, workflows | IT onboarding |
| **Azure Subscription Access** | AKS clusters, ACR, Key Vault | Azure AD admin |
| **SonarQube Account** | Code quality gates | Internal request |
| **Slack Access** | Notifications, team chat | IT onboarding |
| **On-Call Rotation** (prod only) | Production support | PagerDuty registration |

### 1.2 Local Development Tools

| Tool | Version | Purpose | Installation |
|------|---------|---------|---|
| **Git** | 2.40+ | Version control | [git-scm.com](https://git-scm.com) |
| **Docker Desktop** | 24.0+ | Container development | [docker.com](https://www.docker.com) |
| **Java Development Kit** | 21 LTS | Java runtime/compiler | [oracle.com/java](https://www.oracle.com/java) |
| **Maven** | 3.9.0+ | Java build tool | [maven.apache.org](https://maven.apache.org) |
| **Node.js** | 20 LTS | JavaScript runtime | [nodejs.org](https://nodejs.org) |
| **Helm** | 3.12+ | Kubernetes templating | [helm.sh](https://helm.sh) |
| **kubectl** | 1.28+ | Kubernetes CLI | Cloud provider CLI bundles |
| **Azure CLI** | 2.50+ | Azure management | [microsoft.com/cli](https://learn.microsoft.com/cli/azure) |
| **VS Code or IntelliJ IDEA** | Latest | IDE | [code.visualstudio.com](https://code.visualstudio.com) |

### 1.3 IDE Extensions

**VS Code:**
- GitHub Copilot
- GitHub Pull Requests and Issues
- Docker
- Kubernetes
- YAML
- Git Graph
- REST Client

**IntelliJ IDEA:**
- Kubernetes (built-in)
- Docker (built-in)
- GitHub Copilot
- YAML/Ansible Support
- SonarLint

---

## 2. Framework Overview

### 2.1 What is Common Self Service?

The Common Self Service framework is a **CI/CD template and automation platform** enabling ACV teams to:

✅ Create new microservices from boilerplate templates  
✅ Automate build, test, and deployment pipelines (GitHub Actions)  
✅ Deploy to Kubernetes using standardized Helm charts  
✅ Enforce security and quality gates at pipeline level  
✅ Monitor and observe services automatically  
✅ Scale services based on demand  

### 2.2 Service Creation Flow

```
1. Create Repository from Template
   ↓
2. Configure GitHub Secrets
   ↓
3. Implement Service Logic (src/)
   ↓
4. Customize Helm Values (helm-releases/)
   ↓
5. Push & Trigger CI Pipeline
   ↓
6. Deploy to Dev/Test/Prod
   ↓
7. Monitor & Observe
```

---

## 3. Step 1: Create Service Repository

### 3.1 From GitHub Template

```bash
# Option 1: GitHub Web UI
# 1. Navigate to: https://github.com/FedEx/eai-3540813-common-selfservice
# 2. Click "Use this template" button
# 3. Name: eai-3540813-my-new-service
# 4. Description: "My service description"
# 5. Click "Create repository from template"

# Option 2: Clone Existing Service
git clone https://github.com/FedEx/eai-3540813-api-connector-service.git \
  eai-3540813-my-new-service

cd eai-3540813-my-new-service

# Update identifiers
sed -i 's/api-connector-service/my-new-service/g' pom.xml
sed -i 's/api-connector-service/my-new-service/g' helm-releases/*.yaml
sed -i 's/api-connector-service/my-new-service/g' helm/Chart.yaml

# Initialize git
git remote set-url origin \
  https://github.com/FedEx/eai-3540813-my-new-service.git
git push origin main
```

### 3.2 Repository Initialization

```bash
# Clone your new repository
git clone https://github.com/FedEx/eai-3540813-my-new-service.git
cd eai-3540813-my-new-service

# Create development branch
git checkout -b develop
git push -u origin develop

# Verify GitHub branch protection
# Settings → Branches → Add Rule
# - Branch name pattern: main
# - Require pull request reviews: 1
# - Dismiss stale reviews: checked
# - Require status checks: selected (ci/test)
```

---

## 4. Step 2: Configure GitHub Secrets

### 4.1 Required Secrets

Navigate to: **Settings → Secrets and variables → Actions**

**Add Repository Secrets:**

| Secret | Value | Source | Rotation |
|--------|-------|--------|----------|
| **AZURE_CLIENT_ID** | Service principal ID | Azure AD admin | 90 days |
| **AZURE_CLIENT_SECRET** | Service principal secret | Azure AD admin | 90 days |
| **AZURE_TENANT_ID** | Tenant ID | Azure subscription details | Static |
| **AZURE_DEPLOY_CREDENTIALS** | Base64 kubeconfig | Provided by platform team | 90 days |
| **SONAR_TOKEN** | SonarQube API token | SonarQube admin | 180 days |
| **SLACK_WEBHOOK** | Slack incoming webhook | Slack workspace admin | Manual |
| **AZURE_RG_DEV** | Resource group name | Azure subscriber | Static |
| **AZURE_RG_TEST** | Resource group name | Azure subscriber | Static |
| **AZURE_RG_PROD** | Resource group name | Azure subscriber | Static |

### 4.2 Generate Service Principal

```bash
# Create Azure service principal for ACR push
az ad sp create-for-rbac \
  --name "eai-3540813-my-new-service" \
  --role acrpush \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.ContainerRegistry/registries/{acr-name}

# Output will show:
# {
#   "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
#   "displayName": "eai-3540813-my-new-service",
#   "password": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
#   "tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
# }

# Use appId as AZURE_CLIENT_ID, password as AZURE_CLIENT_SECRET, tenant as AZURE_TENANT_ID
```

### 4.3 Generate SonarQube Token

```bash
# 1. Log in to SonarQube: https://sonar.company.com
# 2. Profile → My Account → Security
# 3. Generate Tokens → Name: "GitHub Actions"
# 4. Copy token, paste into SONAR_TOKEN secret
```

---

## 5. Step 3: Implement Service

### 5.1 Project Structure

```
eai-3540813-my-new-service/
├── src/main/java/com/fedex/acv/
│   └── MyServiceApplication.java
├── src/test/java/com/fedex/acv/
│   └── MyServiceApplicationTest.java
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-test.yml
│   └── application-prod.yml
├── pom.xml                    # UPDATE: Change artifactId
├── Dockerfile                 # (ready to use)
├── docker-compose.yml         # (ready to use)
├── helm/
│   ├── Chart.yaml            # UPDATE: Change name
│   └── values.yaml           # (ready to use)
└── helm-releases/
    ├── nonprod-dev.yaml      # (customize if needed)
    ├── nonprod-test.yaml     # (customize if needed)
    └── prod.yaml             # (customize if needed)
```

### 5.2 Spring Boot Application Template

**src/main/java/com/fedex/acv/MyServiceApplication.java:**

```java
package com.fedex.acv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(MyServiceApplication.class, args);
    }
}
```

**src/main/resources/application.yml:**

```yaml
spring:
  application:
    name: my-new-service
  profiles:
    active: dev
  cloud:
    config:
      uri: http://config-server:8888
      profile: ${spring.profiles.active}

server:
  port: 8082

logging:
  level:
    root: INFO
    com.fedex.acv: DEBUG

management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
```

### 5.3 Build & Test Locally

```bash
# Build
mvn clean install

# Run locally
mvn spring-boot:run

# Run with Docker Compose
docker-compose up

# Test
curl http://localhost:8082/actuator/health

# Expected response:
# {"status":"UP","components":{"...":...}}
```

---

## 6. Step 4: Customize Helm Configuration

### 6.1 Update helm/Chart.yaml

```yaml
apiVersion: v2
name: my-new-service              # UPDATE: Service name
description: My new ACV service   # UPDATE: Description
type: application
version: 0.1.0                    # UPDATE: Start at 0.1.0
appVersion: "1.0.0"               # UPDATE: App version
```

### 6.2 Update helm-releases/nonprod-dev.yaml

```yaml
imageRepository: acr-dev.azurecr.io/acv/my-new-service
replicaCount: 1

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

environment: development
logLevel: DEBUG
```

### 6.3 Update helm-releases/prod.yaml

```yaml
image:
  repository: acr-prod.azurecr.io/acv/my-new-service
  tag: "1.0.0"  # Override on each deploy

replicaCount: 3

resources:
  limits:
    cpu: 2000m
    memory: 2Gi
  requests:
    cpu: 1000m
    memory: 1Gi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

environment: production
logLevel: WARN
```

---

## 7. Step 5: Push & Trigger Pipeline

### 7.1 First Commit & Push

```bash
# Create feature branch
git checkout -b feature/initial-setup

# Stage changes
git add .

# Commit (informative message)
git commit -m "feat: Add my-new-service implementation"

# Push to origin
git push -u origin feature/initial-setup

# Create Pull Request
# GitHub UI: Create PR from feature/initial-setup → develop
```

### 7.2 Monitor CI Pipeline

1. **Navigate:** Pull Request → "Checks" tab
2. **Watch:** GitHub Actions workflows execute
   - ✅ build-and-test (5 min)
   - ✅ sonarqube-scan (2 min)
   - ✅ docker-build (3 min)
3. **Check Results:**
   - All checks must pass before merge
   - Code coverage must be >75%
   - Quality gate must pass
   - No Trivy vulnerabilities

### 7.3 Merge & Release

```bash
# After approval, UI merge PR to develop

# Tag release
git tag v1.0.0
git push origin v1.0.0

# This triggers:
# - build-and-push.yml (Docker build + ACR push)
# - Creates GitHub Release with artifacts
```

---

## 8. Step 6: Deploy to Environments

### 8.1 Deploy to Dev

```bash
# GitHub Actions UI:
# 1. Actions tab
# 2. Select "Deploy to Dev"
# 3. "Run workflow"
# 4. Input image tag: v1.0.0
# 5. Click "Run workflow"

# Or via CLI:
gh workflow run deploy-dev.yml \
  -f image-tag=v1.0.0 \
  -f environment=dev
```

### 8.2 Deploy to Test

```bash
# Requires 1 approval from team lead

gh workflow run deploy-test.yml \
  -f image-tag=v1.0.0 \
  -f environment=test

# Navigate to Actions → workflow run → Approve
```

### 8.3 Deploy to Production

```bash
# Requires 2/3 approvals from platform team

gh workflow run deploy-prod.yml \
  -f image-tag=v1.0.0 \
  -f environment=prod-us-east

# Navigate to Actions → workflow run → Approve (wait for 2nd approval)
```

---

## 9. Step 7: Verify Deployment

### 9.1 Check Pod Status

```bash
# Get AKS credentials
az aks get-credentials \
  --resource-group acv-dev \
  --name aks-dev

# List pods
kubectl get pods -n dev

# Check logs
kubectl logs -n dev deployment/my-new-service

# Port forward (access locally)
kubectl port-forward -n dev svc/my-new-service 8082:80

# Test service
curl http://localhost:8082/actuator/health
```

### 9.2 Check Metrics

```bash
# Access Grafana dashboard
# https://grafana.company.com
# Navigate to: ACV → Service Monitoring → select my-new-service

# Check metrics:
# - Request rate (requests/sec)
# - Error rate (%)
# - P95 latency (ms)
# - Memory usage
```

### 9.3 Check Logs

```bash
# Via kubectl
kubectl logs -n dev deployment/my-new-service --tail=50

# Via ELK Stack
# https://kibana.company.com
# Index: acv-dev
# Filter: service_name: my-new-service
```

---

## 10. Troubleshooting

### Issue: "Pod CrashLoopBackOff"

```bash
# Check logs
kubectl logs -n dev pod/my-new-service-xxxxx

# Check events
kubectl describe pod -n dev my-new-service-xxxxx

# Common causes:
# - Configuration error (check application.yml)
# - Database connection failed (check DB credentials)
# - Port already in use (change port in values.yaml)
# - OOM (increase memory limits)
```

### Issue: "ImagePullBackOff"

```bash
# Verify image exists in ACR
az acr repository list --name acr-dev

# Verify credentials
az acr login --name acr-dev

# Check image pull secret
kubectl get secret -n dev
```

### Issue: "Quality Gate Failed"

```bash
# Check SonarQube results
# https://sonar.company.com → My Projects → my-new-service

# Common causes:
# - Code coverage <75%
# - Security vulnerabilities
# - Code debt threshold exceeded

# Fix: Address issues, push again
git add .
git commit -m "fix: Improve code quality"
git push
```

### Issue: "Helm Deployment Timeout"

```bash
# Check Helm release
helm list -n dev

# Check status of release
helm status my-new-service -n dev

# Rollback if needed
helm rollback my-new-service -n dev

# Debug deployment
kubectl describe deployment my-new-service -n dev
```

---

## 11. Git Workflow

### 11.1 Creating Feature Branches

```bash
# Create branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/TASK-123-description

# Make changes, commit frequently
git add .
git commit -m "feat: Implement feature TASK-123"

# Push and create PR
git push -u origin feature/TASK-123

# After PR approval and merge:
git checkout develop
git pull origin develop  # Updated with your changes
```

### 11.2 Hotfix Workflow (Production)

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# Make urgent fix, test thoroughly
git add .
git commit -m "fix: Critical production issue"

# Push and create PR (requires 2/3 approval)
git push -u origin hotfix/critical-fix

# After merge to main, backport to develop
git checkout develop
git pull origin main
# ... resolve conflicts if any
git push origin develop
```

---

## 12. Performance Tuning

### 12.1 JVM Options

**Add to deployment spec (helm/templates/deployment.yaml):**

```yaml
env:
- name: JAVA_OPTS
  value: "-XX:+UseG1GC -XX:MaxGCPauseMillis=200 -Xms256m -Xmx512m"
```

### 12.2 Caching Strategy

Enable Redis for caching (optional):

```yaml
# helm-releases/prod.yaml
redis:
  enabled: true
  url: redis://redis:6379

cache:
  ttlMinutes: 60
  maxSize: 1000
```

### 12.3 Database Connection Pooling

```yaml
# application-prod.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 20000
```

---

## 13. Security Checklist

- [ ] No hardcoded credentials in code
- [ ] All secrets in GitHub Secrets or Key Vault
- [ ] Container image scanned (Trivy - no high/critical)
- [ ] OWASP dependencies scanned
- [ ] SAST scan (SonarQube) passed
- [ ] RBAC configured (who can deploy)
- [ ] Network policies defined
- [ ] Secrets rotation scheduled (every 90 days)

---

## 14. Key Resources

### Documentation

- [README.md](README.md) — Framework overview
- [HLD.md](HLD.md) — Architecture
- [LLD.md](LLD.md) — Implementation details
- [services.md](services.md) — API contracts
- [code-mapping.md](code-mapping.md) — Repository structure
- [glossary.md](glossary.md) — Terminology

### External Links

- [GitHub Actions Docs](https://docs.github.com/actions)
- [Helm Docs](https://helm.sh/docs)
- [Kubernetes Docs](https://kubernetes.io/docs)
- [Azure AKS Docs](https://learn.microsoft.com/azure/aks)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)

### Contact & Support

| Topic | Contact | Slack |
|-------|---------|-------|
| **CI/CD Issues** | @platform-team | #acv-platform |
| **Kubernetes Questions** | @k8s-experts | #acv-deployments |
| **Code Quality** | @qa-leads | #acv-quality |
| **Incidents** | On-call engineer | #acv-incidents |

---

## 15. Success Criteria (First Week)

✅ Service repository created  
✅ GitHub secrets configured  
✅ First CI pipeline executed successfully  
✅ Docker image built and pushed to ACR  
✅ Service deployed to dev cluster  
✅ Service deployed to test cluster  
✅ Health check passing  
✅ Metrics visible in Grafana  
✅ Team trained on framework  

---

**Next Steps:**
1. Complete framework setup ← You are here
2. Read [HLD.md](HLD.md) for architecture
3. Review [LLD.md](LLD.md) for implementation details
4. Monitor [services.md](services.md) for API reference
5. Use [code-mapping.md](code-mapping.md) for navigation

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** New teams, developers onboarding new services
