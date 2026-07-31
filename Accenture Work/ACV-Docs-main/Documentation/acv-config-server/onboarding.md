# ACV Configuration Server - Developer Onboarding & Setup Guide

**Purpose:** Help new developers set up local environment, run the application, and understand the architecture.

**Scope:** Prerequisites, local setup, build/run, deployment, troubleshooting, FAQ.

---

## 1. Prerequisites

### 1.1 Required Tools

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| **Java** | 21 LTS | Application runtime | [adoptium.net](https://adoptium.net) or [openjdk.java.net](https://openjdk.java.net) |
| **Maven** | 3.8.1+ | Build tool | `brew install maven` or [maven.apache.org](https://maven.apache.org) |
| **Git** | 2.36+ | Version control | `brew install git` or [git-scm.com](https://git-scm.com) |
| **SSH Client** | Latest | GitHub authentication | Built-in on Mac/Linux; Git Bash on Windows |
| **Docker** | 24.0+ | Containerization | [docker.com](https://docker.com) |
| **kubectl** | 1.26+ | Kubernetes CLI | [kubernetes.io/docs/tasks/tools](https://kubernetes.io/docs/tasks/tools) |
| **Helm** | 3.12+ | Kubernetes package manager | `brew install helm` |
| **curl** | Latest | HTTP requests | Pre-installed; [curl.se](https://curl.se) for Windows |

### 1.2 Required Access

**GitHub Repository:**
- SSH access to: `git@github.com:FedEx/eai-3540813-config-server.git`
- SSH key configured (`~/.ssh/id_rsa` or similar)

**Configuration Repository Access:**
- Read access to: `git@github.com:FedEx/eai-3540813-config-repo.git`

**Azure Resources (Production Only):**
- Key Vault access (for deploy key retrieval)
- ACR access (for pushing images)
- AKS access (for deployment)

### 1.3 Knowledge Prerequisites

- Basic Java/Spring Boot concepts
- Maven project structure
- Git branching and commit workflows
- Docker and Kubernetes fundamentals
- REST API understanding

---

## 2. Local Development Setup

### 2.1 Clone Repository

```bash
# 1. Navigate to workspace
cd ~/Code/ACV

# 2. Clone config-server repository
git clone git@github.com:FedEx/eai-3540813-config-server.git
cd eai-3540813-config-server

# 3. Verify directory structure
ls -la
# Shows: src/, pom.xml, helm-releases/, .github/, etc.

# 4. Check branch
git branch
# Should output: * main
```

### 2.2 Install Java 21

**macOS (using Homebrew):**
```bash
brew install openjdk@21
export JAVA_HOME=/opt/homebrew/opt/openjdk@21
export PATH=$JAVA_HOME/bin:$PATH

# Verify
java -version
# Output: openjdk version "21.0.x"
```

**Windows (using Choco or manual):**
```powershell
choco install openjdk21

# Verify
java -version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install openjdk-21-jdk

# Verify
java -version
```

### 2.3 Install Maven

**macOS:**
```bash
brew install maven

# Verify
mvn --version
# Output: Apache Maven 3.8.7 or later
```

**Verify Maven Works:**
```bash
# From inside config-server directory
mvn --version
mvn help:describe -Dplugin=org.springframework.boot:spring-boot-maven-plugin
```

### 2.4 Configure Git SSH Key

**If not already configured:**

```bash
# 1. Generate SSH key
ssh-keygen -t ed25519 -C "your.email@fedex.com"

# 2. Follow prompts (accept defaults)
# Creates: ~/.ssh/id_ed25519 and ~/.ssh/id_ed25519.pub

# 3. Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 4. Copy public key to GitHub
cat ~/.ssh/id_ed25519.pub  # Copy output

# 5. GitHub Settings → SSH and GPG keys → New SSH key → Paste

# 6. Test connection
ssh -T git@github.com
# Output: Hi username! You've successfully authenticated
```

---

## 3. Build & Run Locally

### 3.1 Build with Maven

```bash
# 1. Navigate to project root
cd ~/Code/ACV/eai-3540813-config-server

# 2. Clean build
mvn clean package

# Output:
# → Compiles: src/main/java/
# → Runs tests: src/test/java/
# → Packages: target/libs/eai-3540813-config-server-1.1.2.jar

# 3. Verify build success
ls -lah target/libs/eai-3540813-config-server-1.1.2.jar
# Should show JAR file, ~50MB
```

### 3.2 Run Application Locally

**Option 1: Via Maven**

```bash
# 1. Run Spring Boot application
mvn spring-boot:run

# Output:
# 2026-04-02 14:32:15 INFO ConfigServerApplication : Started on port 8080
# 2026-04-02 14:32:15 INFO ConfigServerApplication : Management port 8081

# 2. Application runs on: http://localhost:8080
# 3. Management endpoints on: http://localhost:8081

# 4. Press Ctrl+C to stop
```

**Option 2: Direct JAR Execution**

```bash
# 1. Run built JAR
java -jar target/libs/eai-3540813-config-server-1.1.2.jar

# 2. Same output and behavior as Option 1
```

### 3.3 Test Application is Running

```bash
# 1. Health check
curl http://localhost:8081/actuator/health
# Output: {"status":"UP"}

# 2. Fetch configuration (from local Git config repo)
curl http://localhost:8080/config-repo/acv-validation-services/dev

# 3. View metrics
curl http://localhost:8081/actuator/metrics

# 4. Expected: JSON responses show application is serving requests
```

---

## 4. Understanding Local Configuration

### 4.1 Default Configuration (application.yml)

The application starts with `src/main/resources/application.yml`:

```yaml
spring.application.name: config-server
spring.cloud.config.server.git.uri: git@github.com:FedEx/eai-3540813-config-repo.git
spring.cloud.config.server.git.privateKey: ${DEPLOY_KEY}  # From environment
management.server.port: 8081
management.endpoints.web.exposure.include: '*'  # All endpoints exposed (dev)
```

### 4.2 Setting Up Git Repo Connection (Local)

**For local development, you can test with a local Git repo:**

```bash
# 1. Create a test config repo locally (optional)
mkdir -p ~/.test-config-repo
cd ~/.test-config-repo
git init

# 2. Create test config file
mkdir acv-test-service
cat > acv-test-service/acv-test-service-dev.yml << 'EOF'
spring:
  datasource:
    url: jdbc:h2:mem:testdb
acv:
  test:
    property: "local test value"
EOF

# 3. Commit it
git add .
git commit -m "Initial test configuration"

# 4. Update Config Server to use local repo
# Edit: src/main/resources/application.yml
spring.cloud.config.server.git.uri: file:///Users/username/.test-config-repo
# (Use absolute path)

# 5. Restart config server
# mvn spring-boot:run

# 6. Test fetch
curl http://localhost:8080/config-repo/acv-test-service/dev
```

---

## 5. Development Workflow

### 5.1 Making Changes to Source Code

**Example: Add custom health indicator**

```bash
# 1. Create new Java class
cat > src/main/java/com/fedex/acv/config/CustomHealthIndicator.java << 'EOF'
package com.fedex.acv.config;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class CustomHealthIndicator implements HealthIndicator {
    @Override
    public Health health() {
        // Custom health check logic
        return Health.up().withDetail("status", "Config server healthy").build();
    }
}
EOF

# 2. Build
mvn clean package

# 3. Run
mvn spring-boot:run

# 4. Test
curl http://localhost:8081/actuator/health
# Response includes: "customHealthIndicator":{"status":"UP",...}
```

### 5.2 Running Tests

```bash
# Run all tests
mvn test

# Output:
# [INFO] Running com.fedex.acv.config.AcvConfigServerApplicationTests
# [INFO] Tests run: 1, Failures: 0, Skipped: 0
# [INFO] BUILD SUCCESS

# Run specific test
mvn test -Dtest=AcvConfigServerApplicationTests#contextLoads

# Run with coverage
mvn test jacoco:report
# Coverage report: target/site/jacoco/index.html
```

---

## 6. Docker Build & Test

### 6.1 Build Docker Image Locally

```bash
# 1. Build Maven package
mvn clean package -DskipTests

# 2. Build Docker image
docker build -t acv-config-server:local .

# Output: Successfully tagged acv-config-server:local

# 3. Verify image
docker images | grep acv-config-server
```

### 6.2 Run Container Locally

```bash
# 1. Run Docker container
docker run -p 8080:8080 -p 8081:8081 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e SPRING_CLOUD_CONFIG_SERVER_GIT_URI="file:///config-repo" \
  acv-config-server:local

# 2. Container starts; logs show startup sequence

# 3. Test endpoints
curl http://localhost:8080/config-repo/...
curl http://localhost:8081/actuator/health

# 4. Stop container
# Ctrl+C
```

---

## 7. Common Development Tasks

### 7.1 Task: Update Git Connection in Development

```bash
# 1. Edit application.yml
vim src/main/resources/application.yml

# 2. Update Git URI
spring.cloud.config.server.git.uri: file:///Users/username/local-config-repo

# 3. Rebuild and run
mvn clean spring-boot:run
```

### 7.2 Task: Add New Management Endpoint

**Enable new actuator endpoint:**

```bash
# 1. Edit application.yml
management.endpoints.web.exposure.include: health,metrics,prometheus,env

# Or add to include list if only some are exposed

# 2. Rebuild
mvn clean package

# 3. Verify endpoint available
curl http://localhost:8081/actuator/env
```

### 7.3 Task: Debug Application

**Using IDE debugger (VS Code, IntelliJ):**

```bash
# 1. Run with debug port exposed
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"

# 2. In IDE, set Remote Debugger to attach to localhost:5005

# 3. Set breakpoints in code

# 4. Application execution pauses at breakpoints

# 5. Inspect variables, step through code
```

---

## 8. Deployment

### 8.1 Build & Push to Production

```bash
# 1. Build JAR with tests
mvn clean package

# 2. Build Docker image
docker build -t acv-config-server:1.1.2 .

# 3. Tag for ACR
docker tag acv-config-server:1.1.2 \
  acrname.azurecr.io/acv-config-server:1.1.2

# 4. Login to ACR
az acr login --name acrname

# 5. Push image
docker push acrname.azurecr.io/acv-config-server:1.1.2

# 6. Deploy to AKS (using Helm)
helm install config-server ./helm-chart \
  -f helm-releases/prod.yaml \
  -n config-server \
  --set image.repository=acrname.azurecr.io/acv-config-server \
  --set image.tag=1.1.2
```

### 8.2 Verify Deployment

```bash
# 1. Check pod status
kubectl get pods -n config-server

# Output: config-server-xxx-xxxx   1/1   Running   0   2m

# 2. Check logs
kubectl logs -f deployment/config-server -n config-server

# 3. Check ingress
kubectl get ingress -n config-server

# 4. Test endpoint
curl https://acv-config-server.fxi-prod.com/acv/config/actuator/health
```

---

## 9. Troubleshooting

### 9.1 Issue: "Maven not found"

**Symptom:** `Command 'mvn' not found`

**Solution:**
```bash
# 1. Install Maven via Homebrew (Mac)
brew install maven

# 2. Verify installation
mvn --version

# 3. Or add to PATH manually
export PATH="/usr/local/Cellar/maven/3.8.7/bin:$PATH"
```

### 9.2 Issue: "Git SSH key not found"

**Symptom:** Application fails to clone Git repo; "Permission denied (publickey)"

**Solution:**
```bash
# 1. Generate SSH key
ssh-keygen -t ed25519 -C "your@email.com"

# 2. Add to ssh-agent
ssh-add ~/.ssh/id_ed25519

# 3. Add public key to GitHub
# GitHub Settings → SSH and GPG keys → New SSH key

# 4. Test SSH connection
ssh -T git@github.com
# Should output: Hi username!...

# 5. Restart application
mvn spring-boot:run
```

### 9.3 Issue: "Port 8080 already in use"

**Symptom:** 
```
Address already in use: bind
```

**Solution:**
```bash
# 1. Find process using port 8080
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# 2. Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# 3. Run application again
mvn spring-boot:run

# Or use different port
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=9090"
```

### 9.4 Issue: "Out of memory during build"

**Symptom:** Build fails with OutOfMemoryException

**Solution:**
```bash
# 1. Increase heap size for Maven
export MAVEN_OPTS="-Xmx2g"

# 2. Rebuild
mvn clean package

# 3. Or set permanently in ~/.mavenrc
echo 'MAVEN_OPTS="-Xmx2g"' >> ~/.mavenrc
```

### 9.5 Issue: "Application won't connect to Git"

**Symptom:** 
```
Failed to clone repository: Unable to reach GitHub
```

**Diagnosis:**
```bash
# 1. Test SSH connection
ssh -T git@github.com

# 2. Test Git clone manually
git clone git@github.com:FedEx/eai-3540813-config-repo.git /tmp/test

# 3. Check DEPLOY_KEY environment variable
echo $DEPLOY_KEY
# If empty, SSH key not loaded

# 4. Verify Git URL in application.yml
grep "git.uri" src/main/resources/application.yml
```

---

## 10. FAQ

### Q: How do I run both Config Server and a client service locally?

**A:**

1. Terminal 1: Start Config Server
   ```bash
   cd eai-3540813-config-server
   mvn spring-boot:run
   # Runs on port 8080
   ```

2. Terminal 2: Start client service (e.g., validation-services)
   ```bash
   cd eai-3540813-acv-services
   mvn spring-boot:run
   # Connects to Config Server on port 8080
   # Runs on port 9000
   ```

3. Both services running locally; client fetches config from server

### Q: Can I test configuration without Git?

**A:** Yes! Use local file system:

```bash
# 1. Edit application.yml
spring.cloud.config.server.git.uri: file:///tmp/config-repo

# 2. Create local repo
mkdir -p /tmp/config-repo/service-name
echo "property: value" > /tmp/config-repo/service-name/service-name-dev.yml

# 3. Run Config Server
mvn spring-boot:run

# 4. Test
curl http://localhost:8080/config-repo/service-name/dev
```

### Q: How do I view Config Server logs?

**A:**

```bash
# 1. Logs printed to console during mvn spring-boot:run
# Look for: log level [WARN, INFO, DEBUG, ERROR]

# 2. To save logs to file
mvn spring-boot:run > logs/server.log 2>&1

# 3. In Kubernetes, view pod logs
kubectl logs -f deployment/config-server -n config-server

# 4. Tail last 100 lines
kubectl logs --tail=100 deployment/config-server -n config-server
```

### Q: How do I change log level?

**A:**

```bash
# 1. Edit application.yml
logging:
  level:
    root: DEBUG
    org.springframework.cloud.config: DEBUG
    com.jcraft.jsch: DEBUG  # Git/SSH debug

# 2. Rebuild and restart
mvn spring-boot:run

# Or override via environment variable
export LOGGING_LEVEL_ROOT=DEBUG
mvn spring-boot:run
```

### Q: Can I run tests before committing?

**A:**

```bash
# 1. Run all tests
mvn test

# 2. Generate coverage report
mvn test jacoco:report

# 3. View report
open target/site/jacoco/index.html

# 4. Pre-commit hook (optional)
# Create .git/hooks/pre-commit with: mvn test
```

---

## 11. Next Steps

**After completing setup:**

1. **Read Documentation:**
   - [HLD.md](HLD.md) — Understand architecture
   - [LLD.md](LLD.md) — Code structure
   - [services.md](services.md) — API endpoints

2. **Explore Codebase:**
   - Read `AcvConfigServerApplication.java` (1 file!)
   - Review `application.yml` configuration
   - Check `pom.xml` dependencies

3. **Run Integration Tests:**
   ```bash
   mvn test -Dtest=AcvConfigServerApplicationTests
   ```

4. **Test Real Scenarios:**
   - Run Config Server + client service together
   - Modify configuration and refresh
   - Test health and metrics endpoints

5. **Explore Kubernetes:**
   - Review Helm values in `helm-releases/`
   - Deploy locally to Minikube
   - Test ingress routing

---

## Cross-References

- [README.md](README.md) — Project overview
- [HLD.md](HLD.md) — Architecture & design
- [LLD.md](LLD.md) — Implementation details
- [services.md](services.md) — API reference
- [code-mapping.md](code-mapping.md) — Code navigation
- [glossary.md](glossary.md) — Terminology

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** New developers, DevOps engineers, technical leads
