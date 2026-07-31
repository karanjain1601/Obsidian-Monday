# ACV Configuration Repository - Developer Onboarding & Setup Guide

**Purpose:** Help new developers set up local environment, manage configurations, and troubleshoot common issues.

**Scope:** Prerequisites, step-by-step setup, workflows, troubleshooting, FAQ.

---

## 1. Prerequisites

### 1.1 Required Tools

| Tool | Version | Purpose | Install |
|------|---------|---------|---------|
| Git | 2.36+ | Version control | [git-scm.com](https://git-scm.com) |
| Java | 21 LTS | Runtime | [openjdk.java.net](https://openjdk.java.net) or [adoptium.net](https://adoptium.net) |
| Maven | 3.8.1+ | Build tool | `brew install maven` or [maven.apache.org](https://maven.apache.org) |
| Docker | 24.0+ | Containerization | [docker.com](https://docker.com) |
| kubectl | 1.26+ | Kubernetes CLI | [kubernetes.io/docs/tasks/tools](https://kubernetes.io/docs/tasks/tools) |
| yamllint | 1.26+ | YAML validation | `pip install yamllint` or `brew install yamllint` |
| curl | Latest | HTTP requests | Pre-installed on Mac/Linux; [curl.se](https://curl.se) for Windows |
| PostgreSQL Client | 14+ | Database (optional for dev) | `brew install postgresql` |

### 1.2 Required Access

**GitHub Repository Access:**
```bash
# Clone access to config-repo
https://github.com/FedEx/eai-3540813-config-repo.git
```

**Credentials Needed:**
- GitHub SSH key or HTTPS credentials
- Azure Key Vault access (for secrets in production)
- Config Server username/password (for production environment)

### 1.3 Knowledge Prerequisites

**Fundamental Understanding:**
- YAML file syntax (indentation, nesting)
- Git basics (clone, commit, push, branch)
- Spring Boot configuration
- Basic Docker/Kubernetes concepts
- Your service architecture (which service consumes which configs)

**Recommended Reading:**
- [Spring Cloud Config Reference](https://cloud.spring.io/spring-cloud-config/reference/html/)
- [YAML Specification](https://yaml.org/)
- [Kubernetes Configuration Management](https://kubernetes.io/docs/concepts/configuration/)

---

## 2. Local Environment Setup

### 2.1 Clone Configuration Repository

```bash
# 1. Navigate to workspace
cd ~/Code/ACV

# 2. Clone repository
git clone https://github.com/FedEx/eai-3540813-config-repo.git
cd eai-3540813-config-repo

# 3. Verify structure
ls -la
# Output should show:
#   acv-validation-services/
#   api-connector-service/
#   database-service/
#   config-server/
#   README.md

# 4. Check current branch
git branch
# Should output: * main (or master in older repos)
```

### 2.2 Install YAML Validation Tool

**macOS:**
```bash
# Using Homebrew
brew install yamllint

# Verify installation
yamllint --version
# Output: yamllint 1.26.3
```

**Windows (PowerShell):**
```powershell
# Using pip
pip install yamllint

# Verify installation
yamllint --version
```

**Linux (Ubuntu/Debian):**
```bash
# Using apt
sudo apt-get install yamllint

# Verify installation
yamllint --version
```

### 2.3 Configure Git (One-time)

```bash
# Set your identity globally (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@fedex.com"

# Verify configuration
git config --global --list

# Configure Git to handle line endings
git config --global core.autocrlf true  # Windows
# or
git config --global core.autocrlf input # Mac/Linux
```

### 2.4 Set Up SSH Key (Recommended)

**If using SSH for Git:**

```bash
# Generate SSH key (if not exists)
ssh-keygen -t ed25519 -C "your.email@fedex.com"

# Follow prompts, accept default locations
# Output: Your identification has been saved in /home/user/.ssh/id_ed25519

# Add key to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub
cat ~/.ssh/id_ed25519.pub  # Copy output
# → GitHub Settings → SSH and GPG keys → New SSH key → Paste

# Test connection
ssh -T git@github.com
# Output: Hi username! You've successfully authenticated...
```

---

## 3. First-Time Configuration Update Workflow

### 3.1 Modify Development Configuration

**Scenario: Update database URL for development environment**

```bash
# 1. Navigate to config repo
cd ~/Code/ACV/eai-3540813-config-repo

# 2. Edit the file (use your preferred editor)
nano acv-validation-services/acv-validation-services-dev.yml

# Or use VS Code
code acv-validation-services/acv-validation-services-dev.yml
```

**File content (before change):**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/acv_dev  # Old URL
```

**File content (after change):**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://dev-postgres-1.internal:5432/acv_dev  # New URL
```

### 3.2 Validate YAML Syntax

```bash
# Validate the file you modified
yamllint acv-validation-services/acv-validation-services-dev.yml

# If valid: No output
# If invalid: Shows errors with line numbers
# Example error:
# acv-validation-services/acv-validation-services-dev.yml:5:3: error: wrong indentation (expected 2 but found 4)
```

### 3.3 Commit Changes

```bash
# 1. Check Git status
git status

# Output:
# On branch main
# Changes not staged for commit:
#   modified:   acv-validation-services/acv-validation-services-dev.yml

# 2. Stage the file
git add acv-validation-services/acv-validation-services-dev.yml

# Or stage all changes
git add .

# 3. Verify staging
git status
# Output: Changes to be committed

# 4. Commit with descriptive message
git commit -m "chore: Update PostgreSQL host for dev environment"

# Message format: <type>: <description>
# Types: feat (feature), fix (bug fix), chore (maintenance), docs (documentation), refactor, test

# 5. Verify commit
git log --oneline -1
# Output: abc1234 chore: Update PostgreSQL host for dev environment
```

### 3.4 Push to Repository

```bash
# 1. Push to remote (GitHub)
git push origin main

# If first time pushing to repo:
git push --set-upstream origin main

# 2. Verify push
git log --oneline origin/main -1
# Should show your commit

# 3. Verify on GitHub
# Go to: https://github.com/FedEx/eai-3540813-config-repo/commits/main
# You should see your commit in the list
```

### 3.5 Verify Configuration in Running Service

```bash
# 1. If Config Server auto-refresh enabled (via Git webhook)
# Wait ~30 seconds for services to auto-refresh

# 2. Manually trigger refresh on service instance
curl -X POST \
  -H "Authorization: Basic Y29uZmlndXNlcjpwYXNzd29yZA==" \
  http://localhost:8080/actuator/refresh

# 3. Check updated properties
curl http://localhost:8080/actuator/env | grep datasource

# 4. Verify in application logs
# Should see: "Refreshing org.springframework.cloud.context.scope.GenericScope"
```

---

## 4. Common Configuration Change Scenarios

### 4.1 Scenario: Update API Connector URL

**File:** `acv-validation-services/acv-validation-services-dev.yml`

```bash
# 1. Edit file
nano acv-validation-services/acv-validation-services-dev.yml

# 2. Find and update
acv:
  api:
    connector:
      url: http://new-connector-dev:7008  # Changed from old URL

# 3. Validate
yamllint acv-validation-services/*.yml

# 4. Commit
git add acv-validation-services/
git commit -m "chore: Update API connector URL for dev"

# 5. Push
git push origin main

# 6. Refresh services
curl -X POST http://validation-service:8080/actuator/refresh
```

### 4.2 Scenario: Add New Property

**Example: Add cache timeout property**

```bash
# 1. Edit configuration file
code acv-validation-services/acv-validation-services-dev.yml

# 2. Add new property under service configuration
acv:
  validation:
    cacheTtlMinutes: 120            # NEW property added

# 3. Validate
yamllint acv-validation-services/acv-validation-services-dev.yml

# 4. Commit
git commit -am "feat: Add cache TTL configuration for validation service"

# 5. Push
git push

# 6. Update service code to read this property (if needed)
# See: code-mapping.md for finding property classes
```

### 4.3 Scenario: Update Multiple Environments

**Example: Change security setting across all environments**

```bash
# 1. Edit all environment files
nano acv-validation-services/acv-validation-services-dev.yml
nano acv-validation-services/acv-validation-services-test.yml
nano acv-validation-services/acv-validation-services-prod.yml

# 2. Update property in each (with environment-appropriate values)
management:
  endpoints:
    web:
      exposure:
        include: health,metrics  # Changed from '*'

# 3. Validate all files
yamllint acv-validation-services/*.yml

# 4. Commit all changes
git add acv-validation-services/
git commit -m "chore: Restrict actuator endpoints exposure across all environments"

# 5. Push
git push origin main
```

### 4.4 Scenario: Fix Production Configuration

**Requires extra care — use branch and PR:**

```bash
# 1. Create feature branch (NEVER commit directly to main in prod)
git checkout -b bugfix/prod-database-timeout

# 2. Edit production file
nano acv-validation-services/acv-validation-services-prod.yml

# 3. Fix the issue
spring:
  datasource:
    hikari:
      connection-timeout: 60000  # Increased from 30000

# 4. Validate
yamllint acv-validation-services/acv-validation-services-prod.yml

# 5. Commit
git commit -m "fix: Increase database connection timeout for production stability"

# 6. Push feature branch
git push origin bugfix/prod-database-timeout

# 7. Create Pull Request (GitHub UI)
# → Pull Requests → New Pull Request
# → Select base: main, compare: bugfix/prod-database-timeout
# → Add description, request reviewers
# → Merge only after approval

# 8. Delete feature branch (after merge)
git branch -d bugfix/prod-database-timeout
git push origin --delete bugfix/prod-database-timeout
```

---

## 5. Troubleshooting Common Issues

### 5.1 Issue: "YAML Indentation Error"

**Symptom:**
```
yamllint error: wrong indentation (expected 2 but found 4)
```

**Cause:** Inconsistent spacing. YAML requires exactly 2-space indentation.

**Solution:**
```bash
# 1. Open file and check indentation
cat -A acv-validation-services/acv-validation-services-dev.yml
# Shows tabs as ^I and spaces as visible

# 2. Fix indentation (use editor with YAML support)
# Enable spaces-only in VS Code: Settings → indent using spaces
# Unindent and re-indent the problematic section

# 3. Verify
yamllint acv-validation-services/acv-validation-services-dev.yml
# No output = success
```

### 5.2 Issue: "Cannot Connect to Config Server"

**Symptom:**
```
Failed to fetch config from ConfigServer: Connection refused
```

**Diagnostic Steps:**
```bash
# 1. Verify Config Server is running
curl http://config-server:8888/actuator/health

# Expected: {"status":"UP"}
# If failed: Config Server is down

# 2. Check if it's a network issue
ping config-server

# 3. Verify firewall/networking
telnet config-server 8888

# 4. Check bootstrap.yml configuration
cat src/main/resources/bootstrap.yml | grep config.uri

# 5. Verify credentials
curl -u configuser:password http://config-server:8888/config-repo/acv-validation-services/dev

# 6. Check application.log for detailed error
tail -f logs/application.log | grep -i config
```

### 5.3 Issue: "Configuration Not Refreshing"

**Symptom:** Changed configuration file but service still using old value.

**Diagnosis:**
```bash
# 1. Verify file was committed and pushed
git log --oneline acv-validation-services/acv-validation-services-dev.yml | head -1
# Should show your recent commit

# 2. Verify Config Server pulled latest
curl http://config-server:8888/config-repo/acv-validation-services/dev | jq .version
# Compare with git commit SHA

# 3. Check if property has @RefreshScope annotation
grep -r "@RefreshScope" src/main/java/

# If property not @RefreshScope:
# - Property won't refresh without restart
# - Only @RefreshScope annotated beans refresh

# 4. Manually trigger refresh
curl -X POST http://service:8080/actuator/refresh

# 5. Verify refresh happened
curl http://service:8080/actuator/env | grep "property.you.changed"
```

### 5.4 Issue: "Merge Conflicts in Git"

**Symptom:**
```
CONFLICT (content): Merge conflict in acv-validation-services-dev.yml
```

**Resolution:**
```bash
# 1. Check conflict status
git status
# Shows files with conflicts

# 2. View conflicting file
cat acv-validation-services/acv-validation-services-dev.yml
# Shows: <<<<<<< HEAD ... ======= ... >>>>>>> branch-name

# 3. Open in editor and manually resolve
# Keep one version or combine both
# Remove conflict markers: <<<<<<, ======, >>>>>>

# 4. After resolving all conflicts
git add .

# 5. Complete merge
git commit -m "chore: Resolve merge conflict"

# 6. Push
git push origin main
```

### 5.5 Issue: "Secret Values Accidentally Committed"

**Symptom:** Hardcoded password pushed to GitHub.

**Remediation (IMMEDIATE):**
```bash
# 1. IMMEDIATELY rotate the secret in Key Vault
# Contact platform team to regenerate API keys

# 2. Remove from Git history (irreversible action)
# WARNING: This rewrites Git history; all team members must pull after

git filter-branch --tree-filter 'rm -f path/to/secret-file' HEAD

# 3. Force push (with caution)
git push --force-with-lease origin main

# 4. Create new issue documenting incident
```

**Prevention:**
- Update .gitignore to exclude secret files
- Use yamllint to catch hardcoded secrets before commit
- Never commit actual secrets; use ${PLACEHOLDER_NAME} instead

---

## 6. Adding Your Service to Config Repository

### 6.1 Create New Service Configuration

**Example: Adding "new-scheduler-service"**

```bash
# 1. Navigate to repo
cd ~/Code/ACV/eai-3540813-config-repo

# 2. Create service directory
mkdir new-scheduler-service

# 3. Create environment-specific files
cd new-scheduler-service
cat > new-scheduler-service-dev.yml << 'EOF'
# ============================================================================
# New Scheduler Service - Development Configuration
# ============================================================================

spring:
  application:
    name: new-scheduler-service
  
  datasource:
    url: jdbc:h2:mem:schedulerdb
    username: sa
    password: password
  
  jpa:
    hibernate:
      ddl-auto: update

acv:
  scheduler:
    cron: "*/5 * * * * *"             # Every 5 seconds in dev
    enabled: true
    maxConcurrentJobs: 1
    
logging:
  level:
    root: INFO
    com.fedex.acv: DEBUG

management:
  endpoints:
    web:
      exposure:
        include: '*'
EOF

# 4. Create test configuration
cat > new-scheduler-service-test.yml << 'EOF'
spring:
  application:
    name: new-scheduler-service
  datasource:
    url: jdbc:postgresql://test-db:5432/scheduler_test
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate

acv:
  scheduler:
    cron: "0 */15 * * * *"            # Every 15 minutes in test
    enabled: true

logging:
  level:
    root: INFO
EOF

# 5. Create prod configuration
cat > new-scheduler-service-prod.yml << 'EOF'
spring:
  application:
    name: new-scheduler-service
  datasource:
    url: jdbc:postgresql://prod-db-cluster:5432/scheduler_prod
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate

acv:
  scheduler:
    cron: "0 0 * * * *"               # Every hour in production
    enabled: true
    maxConcurrentJobs: 10

logging:
  level:
    root: WARN

management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
EOF
```

### 6.2 Validate and Commit

```bash
# 1. Navigate back to repo root
cd ..

# 2. Validate all new files
yamllint new-scheduler-service/*.yml

# 3. Check file structure
ls -la new-scheduler-service/
# Should show: new-scheduler-service-dev.yml, -test.yml, -prod.yml

# 4. Stage files
git add new-scheduler-service/

# 5. Commit
git commit -m "feat: Add new-scheduler-service configuration (dev, test, prod)"

# 6. Push
git push origin main

# 7. Update service bootstrap.yml to reference config-repo
# In service code: src/main/resources/bootstrap.yml
cat > bootstrap.yml << 'EOF'
spring:
  application:
    name: new-scheduler-service      # MUST match folder name
  cloud:
    config:
      uri: https://config-server:8888
      fail-fast: true
EOF
```

---

## 7. Working with Branches & Pull Requests

### 7.1 Feature Branch Workflow

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/add-caching-config

# 2. Make changes
nano acv-validation-services/acv-validation-services-dev.yml
# Add caching configuration

# 3. Validate changes
yamllint acv-validation-services/*.yml

# 4. Commit
git commit -m "feat: Add distributed caching configuration"

# 5. Push feature branch
git push origin feature/add-caching-config

# 6. Create Pull Request via GitHub UI
# → Pull Requests → New Pull Request
# → Select: base: main, compare: feature/add-caching-config
# → Add description, request 2 reviewers

# 7. Address review comments
# → Make changes locally
# → Commit and push to same branch
# → Comments automatically updated

# 8. Merge (after approval)
# → GitHub UI → Merge Pull Request
# Or command line: git merge --squash feature/add-caching-config

# 9. Delete branch
git branch -d feature/add-caching-config
git push origin --delete feature/add-caching-config
```

### 7.2 Production Hotfix Workflow

**For urgent production fixes (bypass standard process):**

```bash
# 1. Create hotfix branch from main
git checkout main
git pull
git checkout -b hotfix/prod-db-connection

# 2. Make minimal fix
nano acv-validation-services/acv-validation-services-prod.yml
# Fix: Reduce connection timeout to recover faster

# 3. Validate
yamllint acv-validation-services/acv-validation-services-prod.yml

# 4. Commit
git commit -m "fix: Reduce DB connection timeout for prod recovery"

# 5. Push and create PR with urgent label
git push origin hotfix/prod-db-connection

# 6. Fast-track merge (GitHub UI)
# → Mark as urgent
# → Get 1 manager approval
# → Merge immediately

# 7. Merge back to development if needed
git checkout main && git pull
git checkout -b merge-hotfix-to-main
git merge hotfix/prod-db-connection
git push origin merge-hotfix-to-main
# Create PR to sync back
```

---

## 8. Testing Your Configuration Locally

### 8.1 Run Config Server Locally

```bash
# 1. Start Config Server (from config-server service)
cd ~/Code/ACV/eai-3540813-config-server

# 2. Update bootstrap.yml to local Git path
cat > src/main/resources/bootstrap.yml << 'EOF'
spring:
  cloud:
    config:
      server:
        git:
          uri: file:///Users/username/Code/ACV/eai-3540813-config-repo  # Local Git repo
          default-label: main
EOF

# 3. Run service
mvn spring-boot:run

# 4. Test endpoint
curl http://localhost:8888/config-repo/acv-validation-services/dev

# 5. Should return your local configuration
```

### 8.2 Verify Configuration Properties

```bash
# 1. Connect to local service
curl http://localhost:8080/actuator/configprops

# 2. Check specific property
curl http://localhost:8080/actuator/env | jq '.propertySources[] | select(.name | contains("configServer"))'

# 3. Verify property value
curl http://localhost:8080/actuator/env | jq '.propertySources[].source."acv.validation.fuzzyMatchThreshold"'
```

---

## 9. FAQ & Troubleshooting

### Q: How long does configuration change take to propagate?

**A:** 
- **With Git webhook:** <30 seconds (auto-refresh triggered)
- **Without webhook:** Need to manually call `/actuator/refresh` endpoint
- **For non-@RefreshScope properties:** Requires full service restart

### Q: Can I update production config directly?

**A:**
- **Policy:** NO. All prod changes must go through:
  1. Feature branch created
  2. Pull request reviewed by 2+ managers
  3. Merged to main after approval
  4. Production safe guards: read-only in some clusters until scheduled rollout

### Q: What if I pushed wrong config?

**A:**
```bash
# 1. Revert commit
git revert <commit-hash>
git push origin main

# 2. Services auto-refresh with old values
# 3. Or manually trigger quick rollback
git reset --hard HEAD~1
git push --force-with-lease origin main
```

### Q: How do I access Config Server in production?

**A:** 
- Production Config Server is restricted to service-to-service communication
- Contact platform team for access
- Use kubectl to port-forward:
  ```bash
  kubectl port-forward -n production svc/config-server 8888:8888
  curl -u configuser:PROD_PASSWORD http://localhost:8888/...
  ```

### Q: Config Server says "Connection refused"

**A:**
1. Verify bootstrap.yml has correct URL
2. Check if Config Server pod is running: `kubectl get pods -n default`
3. Check firewall/network policies
4. Review Config Server logs: `kubectl logs deploy/config-server`

### Q: I made indentation mistake in YAML

**A:**
```bash
# Quick fix in VS Code:
# 1. Select problematic lines
# 2. Press Ctrl+Shift+P → "Indent Using Spaces"
# 3. Reindent selection (Cmd+] to indent, Cmd+[ to unindent)
# 4. Save and validate with yamllint
```

---

## 10. Next Steps

After completing onboarding:

1. **Create your first configuration change**
   - Pick one property to update
   - Follow workflow in section 3
   - Get peer review before merge

2. **Set up local development environment**
   - Clone config-repo and your service
   - Run Config Server locally
   - Test configuration refresh

3. **Familiarize with other docs**
   - Read [HLD.md](HLD.md) for architecture
   - Review [code-mapping.md](code-mapping.md) for property locations
   - Study [services.md](services.md) for API integration

4. **Join #config-management Slack channel**
   - Ask questions
   - Share learnings
   - Get help from platform team

---

## Cross-References

- [README.md](README.md) — Project overview
- [HLD.md](HLD.md) — Architecture design
- [LLD.md](LLD.md) — Technical details
- [code-mapping.md](code-mapping.md) — Property locations
- [glossary.md](glossary.md) — Terminology
- [services.md](services.md) — API reference

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** New team members, Developers, DevOps Engineers
