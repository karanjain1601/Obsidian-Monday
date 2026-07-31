# ACV Services - Developer Onboarding Guide

**Purpose:** Enable new developers to set up local development environment, build/run the application, and navigate the codebase.

**Target Audience:** Software engineers joining the ACV Platform Team
**Estimated Time to Complete:** 30-45 minutes for experienced developer; 2-3 hours first time

---

## 1. Prerequisites

### 1.1 Required Software

```bash
# Check versions before proceeding
java -version              # Must be Java 21 LTS or later
mvn -version              # Maven 3.9+ required
git --version             # Git for code checkout
docker --version          # Docker Desktop for PostgreSQL/Redis
```

### 1.2 Required Versions

| Software | Version | Rationale |
|----------|---------|-----------|
| Java | 21 LTS+ | Virtual threads for async parallel validation |
| Maven | 3.9+ | Dependency management; Spring Boot integration |
| Docker | 20.10+ | Container runtime for PostgreSQL and Redis |
| Git | 2.30+ | Version control; branch management |
| PostgreSQL | 14+ | Database engine compatibility |

### 1.3 IDE Setup (Recommended)

**Option A: IntelliJ IDEA** (Preferred for Enterprise)
- Download: https://www.jetbrains.com/idea/
- Community edition sufficient for development
- Install plugins: Spring Boot, Lombok

**Option B: VS Code**
- Download: https://code.visualstudio.com/
- Install extensions: Extension Pack for Java, Spring Boot Dashboard, REST Client

---

## 2. Environment Setup Checklist

```
☐ Step 1: Install Java 21 LTS
☐ Step 2: Install Maven 3.9+
☐ Step 3: Install Docker Desktop
☐ Step 4: Clone Git repository
☐ Step 5: Create .env configuration file
☐ Step 6: Start PostgreSQL container
☐ Step 7: Start Redis container
☐ Step 8: Run Maven build
☐ Step 9: Start Spring Boot application
☐ Step 10: Verify Swagger UI access
```

---

## 3. Step-by-Step Setup Instructions

### Step 1: Install Java 21 LTS

**Windows (via Chocolatey):**

```bash
choco install openjdk21
```

**macOS (via Homebrew):**

```bash
brew install openjdk@21
# Link to system path
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
```

**Linux (Ubuntu):**

```bash
sudo apt update
sudo apt install openjdk-21-jdk
```

**Verify Installation:**

```bash
java -version
# Expected output:
# openjdk version "21.0.x" 2024-xx-xx
# OpenJDK Runtime Environment (build 21.0.x+xx)
```

### Step 2: Install Maven 3.9+

**Windows (via Chocolatey):**

```bash
choco install maven
```

**macOS (via Homebrew):**

```bash
brew install maven
```

**Linux (Ubuntu):**

```bash
sudo apt install maven
```

**Verify Installation:**

```bash
mvn -version
# Expected: Maven 3.9.x or later
```

### Step 3: Install Docker Desktop

Download and install from https://www.docker.com/products/docker-desktop

**Verify Installation:**

```bash
docker --version
docker run hello-world  # Test Docker functionality
```

### Step 4: Clone Git Repository

```bash
# Create workspace directory
mkdir ~/workspace/acv
cd ~/workspace/acv

# Clone the repository
git clone https://your-git-server/eai-3540813-acv-services.git
cd eai-3540813-acv-services

# Verify directory structure
ls -la
# Expected: pom.xml, src/, helm-releases/, etc.
```

### Step 5: Create Development Configuration

Create `.env` file in project root:

```bash
cd ~/workspace/acv/eai-3540813-acv-services

# Create .env file
cat > .env << 'EOF'
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/acv_validation
DB_USER=postgres
DB_PASSWORD=postgres123
DB_DRIVER=org.postgresql.Driver

# Redis Cache Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Okta OAuth2 Configuration (Get from Okta admin dashboard)
OKTA_DOMAIN=https://YOUR_OKTA_DOMAIN.okta.com
OKTA_CLIENT_ID=YOUR_CLIENT_ID
OKTA_CLIENT_SECRET=YOUR_CLIENT_SECRET
OKTA_ISSUER_URI=https://YOUR_OKTA_DOMAIN.okta.com/oauth2/default

# Azure Event Hubs (Get from Azure Portal)
AZURE_EVENT_HUBS_NAMESPACE=acv-events-dev
EVENT_HUB_CONNECTION_STRING=Endpoint=sb://acv-events-dev.servicebus.windows.net/...

# Application Configuration
APP_PORT=8080
LOG_LEVEL=DEBUG
EOF

# Secure the file
chmod 600 .env
```

### Step 6: Start PostgreSQL Container

```bash
# Start PostgreSQL in background
docker run -d \
  --name acv-postgres \
  -e POSTGRES_DB=acv_validation \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -p 5432:5432 \
  postgres:15-alpine

# Wait for container to start (10 seconds)
sleep 10

# Verify PostgreSQL is reachable
docker exec acv-postgres pg_isready -U postgres
# Expected: accepting connections
```

**Troubleshooting:**

```bash
# If port 5432 already in use:
lsof -i :5432           # Find process using port
docker ps               # Find existing container
docker stop <container-id>

# Access PostgreSQL shell
docker exec -it acv-postgres psql -U postgres -d acv_validation
```

### Step 7: Start Redis Container

```bash
# Start Redis in background
docker run -d \
  --name acv-redis \
  -p 6379:6379 \
  redis:7-alpine

# Verify Redis is reachable
docker exec acv-redis redis-cli ping
# Expected: PONG
```

### Step 8: Run Maven Build

```bash
cd ~/workspace/acv/eai-3540813-acv-services

# Full clean build
./mvnw clean package -DskipTests

# Or on Windows
mvnw clean package -DskipTests

# Expected output:
# [INFO] BUILD SUCCESS
# [INFO] Time elapsed: 2 min 45 sec
```

**Troubleshooting:**

```bash
# Check for dependency issues
./mvnw dependency:tree

# Clear Maven cache and retry
rm -rf ~/.m2/repository
./mvnw clean package -DskipTests

# Check Java version mismatch
./mvnw verify | grep -i "java\|version"
```

### Step 9: Start Spring Boot Application

```bash
# Load environment variables
export $(cat .env | xargs)

# Start application in development profile
./mvnw spring-boot:run \
  -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Expected console output:
# ... [main] c.f.acv.AcvServicesApplication : Started AcvServicesApplication
# ... [main] o.s.b.w.e.t.TomcatWebServer : Tomcat started on port(s): 8080 (http)
```

**Alternative: Run JAR file directly**

```bash
java -jar target/eai-3540813-acv-services-1.1.6.jar \
  --spring.profiles.active=dev \
  --spring.datasource.url=${DB_URL} \
  --spring.datasource.username=${DB_USER} \
  --spring.datasource.password=${DB_PASSWORD}
```

### Step 10: Verify Application Health

Open in web browser:

```
http://localhost:8080/swagger-ui.html     # Swagger API docs
http://localhost:8080/actuator/health    # Health check endpoint
```

**Expected Swagger UI Response:**

```
GET /actuator/health
200 OK
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "redis": { "status": "UP" }
  }
}
```

---

## 4. Running Tests

### 4.1 Unit Tests

```bash
# All unit tests
./mvnw test

# Specific test class
./mvnw test -Dtest=StageValidationServiceImplTest

# With specific method
./mvnw test -Dtest=StageValidationServiceImplTest#testValidate_WithValidRequest_ReturnsSuccess

# Generate test report
./mvnw test jacoco:report
# Open: target/site/jacoco/index.html
```

### 4.2 Integration Tests

```bash
# Only integration tests (marked with @SpringBootTest)
./mvnw test -Dtest=*Integration*

# Skip integration tests (for quick feedback)
./mvnw test -DskipITs
```

### 4.3 Test Coverage

```bash
# Generate coverage report
./mvnw clean test jacoco:report

# Open HTML report
open target/site/jacoco/index.html        # macOS
xdg-open target/site/jacoco/index.html    # Linux
start target\site\jacoco\index.html       # Windows

# Expected: Aim for >80% line coverage
```

---

## 5. Common Development Tasks

### 5.1 Adding a New Validation Rule

**File:** `src/main/java/com/fedex/acv/service/validation/GenericValidationServiceImpl.java`

```java
// 1. Create new validator implementing ValidationService interface
public class MyNewValidatorServiceImpl implements ValidationService {
    @Override
    public ValidationResult validate(RecordDetailsEntity record, ValidationSetEntity set) {
        // Implementation
        return ValidationResult.pass();
    }
}

// 2. Register in factory
@Service
public class GenericValidationServiceImpl {
    
    private final Map<String, ValidationService> validators;
    
    @PostConstruct
    public void registerValidators() {
        validators.put("MY_NEW_TYPE", myNewValidator);
    }
    
    public ValidationService getValidator(String type) {
        return validators.get(type);
    }
}

// 3. Test the validator
@SpringBootTest
class MyNewValidatorServiceImplTest {
    // Write unit tests
}
```

### 5.2 Adding a New API Endpoint

**File:** `src/main/java/com/fedex/acv/controller/AccountCreationValidationsController.java`

```java
@PostMapping("/v1/new-endpoint")
public ResponseEntity<ValidationResponse> newEndpoint(
    @Valid @RequestBody NewRequest request,
    @AuthenticationPrincipal OidcUser user
) {
    // Implementation
    ValidationResponse response = stageValidationService.validate(...);
    return ResponseEntity.ok(response);
}
```

Then test:

```bash
# Use REST Client extension in VS Code
# File: requests.http

### Test new endpoint
POST http://localhost:8080/v1/new-endpoint
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "field": "value"
}
```

### 5.3 Debugging a Failing Validation

```bash
# 1. Enable debug logging
export LOG_LEVEL=DEBUG

# 2. Restart application
./mvnw spring-boot:run -Dspring-boot.run.arguments="--logging.level.com.fedex.acv=DEBUG"

# 3. Make API call that fails
curl -X POST http://localhost:8080/v1/identity/request-otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d @request.json

# 4. Check logs for detailed stack trace
tail -100 logs/application.log

# 5. Or attach debugger in IDE
#    - Set breakpoint in StageValidationServiceImpl.validate()
#    - Run in debug mode: ./mvnw spring-boot:run -Ddebug
#    - Step through code execution
```

### 5.4 Working with Configuration

**Development Profile Configuration:**

**File:** `src/main/resources/application-dev.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/acv_validation_dev
    username: postgres
    password: postgres123
  
  cache:
    redis:
      time-to-live: 3600000  # 1 hour in dev (shorter than prod's 24h)
  
  jpa:
    show-sql: true  # Show SQL in dev logs
    properties:
      hibernate:
        format_sql: true

logging:
  level:
    com.fedex.acv: DEBUG
    org.hibernate.SQL: DEBUG
```

### 5.5 Database Schema Inspection

```bash
# Connect to PostgreSQL database
docker exec -it acv-postgres psql -U postgres -d acv_validation

# List tables
\dt                         # Shows all tables

# Inspect table schema
\d validation_requests      # Shows columns and constraints

# Run SQL query
SELECT * FROM validation_requests LIMIT 5;

# Exit
\q
```

### 5.6 Redis Cache Inspection

```bash
# Connect to Redis
docker exec -it acv-redis redis-cli

# View all keys
KEYS *

# Inspect cache entry
GET acv:config:country:US

# Clear all cache (development only!)
FLUSHALL

# Exit
EXIT
```

---

## 6. IDE-Specific Tips

### 6.1 IntelliJ IDEA Configuration

**Plugins to Install:**

1. Spring Boot (built-in)
2. Lombok (Settings → Plugins → Search "Lombok")
3. REST Client (built-in)

**Debugging:**

1. Set breakpoint in code (click line number)
2. Run → Debug (Shift+F9) or click green debug icon
3. Use Debug Console for conditional breakpoints
4. Variables panel shows local variables and instance fields

**Running Tests:**

1. Right-click test class → Run 'TestClassName'
2. Or click green marker next to test method name

### 6.2 VS Code Configuration

**Recommended Extensions:**

```
ms-java.vscode-java-pack
redhat.vscode-commons
Pivotal.vscode-spring-boot
REST Client
```

**Launch Configuration (`.vscode/launch.json`):**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "ACV Services - Debug",
      "request": "launch",
      "mainClass": "com.fedex.acv.AcvServicesApplication",
      "projectName": "eai-3540813-acv-services",
      "args": "--spring.profiles.active=dev",
      "console": "integrated",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

**Make REST API Calls (Create `requests.http`):**

```http
### Get Token
GET http://localhost:8080/oktaToken/client

### Request OTP
POST http://localhost:8080/v1/identity/request-otp
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "john@example.com",
  "countryCode": "US",
  "documentType": "PASSPORT",
  "documentId": "A123456"
}
```

---

## 7. Architecture Learning Path

**Recommended Reading Order:**

1. **README.md** (15 min) — High-level project overview
2. **HLD.md** (30 min) — Architecture and components
3. **services.md** (20 min) — REST API contracts
4. **code-mapping.md** (30 min) — Code structure and class inventory
5. **glossary.md** (15 min) — Business domain and technical terms

**Practical Exercises:**

| Step | Task | Time | Expected Outcome |
|------|------|------|------------------|
| 1 | Make test API call to request OTP endpoint | 5 min | 200 OK response with transactionId |
| 2 | Query transaction state at `/v1/transaction/{id}` | 5 min | See validation state progression |
| 3 | Write unit test for `RecordValidationServiceImpl` | 20 min | Test passes; understand validation logic |
| 4 | Add new field to `ValidationRequest` DTO | 15 min | Rebuild and redeploy locally |
| 5 | Add custom validation rule | 30 min | New rule executes in validation pipeline |

---

## 8. Troubleshooting Guide

### Problem: "Port 5432 already in use"

```bash
# Solution: Stop conflicting container
docker stop acv-postgres
docker rm acv-postgres
docker run -d --name acv-postgres -e POSTGRES_PASSWORD=postgres123 -p 5432:5432 postgres:15
```

### Problem: "Connection to database refused"

```bash
# Solution: Verify PostgreSQL container is running
docker ps | grep postgres        # Check if container running
docker logs acv-postgres         # Check error logs
docker exec acv-postgres pg_isready -U postgres
```

### Problem: "Redis connection error"

```bash
# Solution: Restart Redis
docker stop acv-redis
docker rm acv-redis
docker run -d --name acv-redis -p 6379:6379 redis:7-alpine
```

### Problem: "OAuth2 token invalid"

```bash
# Solution: Verify Okta configuration
# 1. Check .env file has correct OKTA_* values
# 2. Verify token issued by Okta (check JWT at https://jwt.io)
# 3. Check token expiration: exp claim should be in future
# 4. Ensure Authorization header format: "Bearer <token>"
```

### Problem: "Maven build fails with 'No compiler is provided'"

```bash
# Solution: Ensure JAVA_HOME is set correctly
echo $JAVA_HOME         # macOS/Linux
echo %JAVA_HOME%        # Windows

# If not set:
export JAVA_HOME=$(/usr/libexec/java_home -v 21)     # macOS
export JAVA_HOME=/usr/lib/jvm/openjdk-21-amd64       # Linux
```

### Problem: "Test failures with 'database connection refused'"

```bash
# Solution: Ensure test database is running
docker ps | grep postgres

# If not running, test profile should use H2 in-memory:
# application-test.yml:
# spring:
#   datasource:
#     url: jdbc:h2:mem:testdb
```

---

## 9. Git Workflow

### 9.1 Create Feature Branch

```bash
# Pull latest main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/MY_FEATURE_NAME
```

### 9.2 Commit and Push

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add new validation rule for tax certificates"

# Push to remote
git push origin feature/MY_FEATURE_NAME
```

### 9.3 Create Pull Request

1. Go to Git repository web UI (GitHub, GitLab, Azure Repos)
2. Click "Create Pull Request"
3. Describe changes and reference issue ID
4. Request code review from team members
5. Wait for CI/CD pipeline to pass
6. Merge via web UI

---

## 10. Getting Help

| Question | Contact |
|----------|---------|
| Architecture questions | Platform Architect @ team email |
| API contract questions | API Team @ team email |
| Database schema questions | Database Admin @ team email |
| Build/deployment issues | DevOps Team @ team email |
| General onboarding help | Team Lead @ team email |

**Slack Channels:**

- `#acv-platform` — General discussions
- `#acv-dev` — Development help
- `#acv-devops` — Deployment/infrastructure
- `#acv-bugs` — Bug reports and fixes

---

## 11. Next Steps

After completing this guide:

1. ✅ Read [HLD.md](HLD.md) to understand system architecture
2. ✅ Explore [code-mapping.md](code-mapping.md) to understand class structure
3. ✅ Study [services.md](services.md) for API contracts
4. ✅ Run all tests locally and verify they pass
5. ✅ Make a small code change and deploy to dev environment
6. ✅ Set up your development IDE (IntelliJ or VS Code)
7. ✅ Attend architecture walkthrough meeting with team

---

## 12. Quick Reference

### Essential Commands

```bash
# Build
./mvnw clean package -DskipTests

# Run locally
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Run tests
./mvnw test

# Check dependencies
./mvnw dependency:tree

# Generate API docs
./mvnw springdoc-openapi-maven-plugin:generate

# Format code
./mvnw fmt:format
```

### Environment Variables Quick Copy-Paste

```bash
export DB_URL="jdbc:postgresql://localhost:5432/acv_validation"
export DB_USER="postgres"
export DB_PASSWORD="postgres123"
export REDIS_HOST="localhost"
export REDIS_PORT="6379"
export LOG_LEVEL="DEBUG"
```

### Database Connection String

```
postgresql://postgres:postgres123@localhost:5432/acv_validation
```

### Default Credentials

| Service | User | Password |
|---------|------|----------|
| PostgreSQL | postgres | postgres123 |
| Redis | (none) | (none) |

---

**Last Updated:** 2025-01-30  
**Version:** 1.1.6  
**Status:** Production  

Welcome to the ACV Services team! 🚀
