# ACV Data Services - Developer Onboarding Guide

**Purpose:** Enable new developers to set up, build, run, and debug the Data Services locally.

**Scope:** Environment setup, build process, local execution, testing, common issues, workflows.

---

## 1. Prerequisites

### 1.1 Required Software

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| **Java** | 21 LTS | Language runtime | [openjdk.java.net](https://openjdk.java.net/) |
| **Git** | 2.40+ | Version control | [git-scm.com](https://git-scm.com/) |
| **Maven** | 3.8.1+ | Build tool | [maven.apache.org](https://maven.apache.org/) |
| **PostgreSQL** | 14+ | Database | [postgresql.org](https://www.postgresql.org/download/) |
| **Redis** | 7.0+ | Cache server | [redis.io](https://redis.io/download) |
| **Docker** | 20.10+ | Containerization (optional) | [docker.com](https://www.docker.com/products/docker-desktop) |
| **Postman/REST Client** | Latest | API testing (optional) | [postman.com](https://www.postman.com/) or VS Code REST Client ext |
| **VS Code** | Latest | IDE (or IntelliJ) | [code.visualstudio.com](https://code.visualstudio.com/) |

### 1.2 Verify Installation

```bash
# Check Java
java -version
# Output: openjdk version "21.0.x" LTS

# Check Maven
mvn -version
# Output: Apache Maven 3.8.x

# Check Git
git --version
# Output: git version 2.40.x

# Check PostgreSQL
psql --version
# Output: psql (PostgreSQL) 14.x

# Check Redis
redis-cli --version
# Output: redis-cli x.x.x
```

### 1.3 IDE Setup

**VS Code Extensions:**
- Extension Pack for Java (Microsoft)
- Spring Boot Extension Pack (VMware)
- Postman (optional for API testing)
- REST Client (optional for API testing)

**IntelliJ IDEA:**
- Built-in Spring Boot and database tools
- No additional plugins needed for Java 21

---

## 2. Local Environment Setup

### 2.1 Clone Repository

```bash
# Navigate to your projects directory
cd ~/projects

# Clone the repository
git clone https://github.com/FedEx/eai-3540813-data-services.git
cd eai-3540813-data-services

# Verify you're on main branch
git checkout main
git branch -a

# Output: * main (local), origin/main (remote)
```

### 2.2 Configure Git (First Time)

```bash
# Set identity
git config --global user.name "Your Full Name"
git config --global user.email "your.email@fedex.com"

# Verify
git config --global --list | grep user
```

### 2.3 Set Up Local Database

**Option A: PostgreSQL Local Installation**

```bash
# 1. Create database and user
psql -U postgres

# In PostgreSQL shell:
CREATE DATABASE acvdb;
CREATE USER acv_user WITH PASSWORD 'acv_password';
GRANT ALL PRIVILEGES ON DATABASE acvdb TO acv_user;

# 2. Verify
psql -U acv_user -d acvdb -c "SELECT 1;"
# Output: 1
```

**Option B: Docker PostgreSQL**

```bash
# Run PostgreSQL in Docker
docker run -d \
  --name acv-postgres \
  -e POSTGRES_DB=acvdb \
  -e POSTGRES_USER=acv_user \
  -e POSTGRES_PASSWORD=acv_password \
  -p 5432:5432 \
  postgres:14

# Verify connection
docker exec acv-postgres psql -U acv_user -d acvdb -c "SELECT 1;"
```

### 2.4 Set Up Local Redis Cache

**Option A: Redis Local Installation**

```bash
# 1. Download and install Redis (macOS example)
brew install redis

# 2. Start Redis server
redis-server

# 3. Verify in another terminal
redis-cli ping
# Output: PONG
```

**Option B: Docker Redis**

```bash
# Run Redis in Docker
docker run -d \
  --name acv-redis \
  -p 6379:6379 \
  redis:7

# Verify connection
docker exec acv-redis redis-cli ping
# Output: PONG
```

### 2.5 Configure Maven Wrapper

```bash
# Verify Maven wrapper exists
ls -la mvnw

# Maven wrapper automatically downloads correct Maven version
# First build will take longer (downloading Maven + dependencies)
```

---

## 3. Build & Run Locally

### 3.1 First-Time Build

```bash
# 1. Clean any previous builds
mvn clean

# 2. Download dependencies (first time only, slower)
mvn install -DskipTests

# Output:
# [INFO] Downloading from central: ...
# [INFO] Downloaded: ... (xx MB)
# [INFO] BUILD SUCCESS
```

**What happens:**
- Maven downloads all dependencies from Maven Central
- Dependencies cached locally in `~/.m2/repository/`
- Subsequent builds much faster (uses cache)
- First build typically takes 3-5 minutes

### 3.2 Build for Development

```bash
# Quick build (compile + package, no tests)
mvn package -DskipTests

# Or use wrapper
./mvnw package -DskipTests

# Output:
# [INFO] --- maven-jar-plugin:3.2.0:jar ...
# [INFO] Building jar: target/eai-3540813-data-services-1.1.4.jar
# [INFO] BUILD SUCCESS

# JAR created at: target/eai-3540813-data-services-1.1.4.jar
```

### 3.3 Run Application Locally

**Option A: Maven Spring Boot Plugin (Recommended)**

```bash
# Run with local profile (disables Spring Cloud Config)
mvn spring-boot:run \
  -Dspring-boot.run.arguments="--spring.profiles.active=local --spring.cloud.config.enabled=false"

# Output:
# [INFO] Attaching agents: []
#  .   ____          _            __ _ _
# /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
# ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
# /  ___/| | | | | || | | | / __|\/ _ \/ _ \_/ _|
# |_|____| \ / \ /
# 
# :: Spring Boot :: (3.3.1)
# 
# Started AcvDataAccessServiceApplication in 5.234 seconds
# 
# Tomcat started on port(s): 8080 (http)
```

**Application Now Running:**
- URL: `http://localhost:8080`
- Management: `http://localhost:8081`
- REST API: `http://localhost:8080/api/v1/{entity}`

**Option B: Run JAR Directly**

```bash
# 1. Build JAR
mvn clean package -DskipTests

# 2. Run JAR
java -Dspring.profiles.active=local \
  -Dspring.cloud.config.enabled=false \
  -jar target/eai-3540813-data-services-1.1.4.jar

# Application starts
```

**Option C: Run from IDE**

```
VS Code:
1. Open AcvDataAccessServiceApplication.java
2. Click "Run" (or press F5)
3. Spring Boot plugin auto-detects and runs

IntelliJ:
1. Open AcvDataAccessServiceApplication.java
2. Click green play icon
3. Edit Run Configuration (if needed):
   - Program arguments: --spring.profiles.active=local --spring.cloud.config.enabled=false
   - Environment: Set any needed env vars
```

### 3.4 Verify Application is Running

**Get Health Status:**

```bash
# Health endpoint (application port 8080)
curl http://localhost:8080/actuator/health

# Response:
{
  "status": "UP",
  "components": {
    "db": {"status":"UP"},
    "redis": {"status":"UP"}
  }
}
```

**Test REST API:**

```bash
# GET configuration (requires ACV_CRUD_CONFIG_INFO entry)
curl -X POST http://localhost:8080/api/v1/config \
  -H "Content-Type: application/json" \
  -d '{"type":"GET","entity":"config","filters":{"id":1}}'

# Should return: 200 OK with data or empty if not found
```

**Check Application Logs:**

```bash
# Logs printed to console by default
# Look for:
# - "Started AcvDataAccessServiceApplication"
# - "Tomcat started on port"
# - "Initialized JPA EntityManagerFactory"

# For verbose logging, add to application-local.yml:
logging:
  level:
    com.fedex.acv.data: DEBUG
```

---

## 4. Testing

### 4.1 Unit Tests

```bash
# Run all unit tests
mvn test

# Run specific test class
mvn test -Dtest=DataControllerTest

# Run specific test method
mvn test -Dtest=DataServiceImplTest#testGetDetails

# Output:
# -------------------------------------------------------
#  T E S T S
# -------------------------------------------------------
# Running com.fedex.acv.data.controller.DataControllerTest
# Tests run: 5, Failures: 0, Skipped: 0
# -------------------------------------------------------
```

### 4.2 Integration Tests

```bash
# Run integration tests (includes database)
mvn verify -DskipUnitTests

# Or run specific integration test
mvn verify -Dit.test=DataServiceIntegrationTest
```

### 4.3 Test Coverage Report

```bash
# Generate coverage report via JaCoCo
mvn clean test jacoco:report

# View report
open target/site/jacoco/index.html

# Note: adjust "open" to "start" (Windows) or "xdg-open" (Linux)
```

---

## 5. API Testing

### 5.1 Using Postman

```
1. Import API collection
   - File → Import → Select collection JSON
   
2. Set environment variables
   - base_url: http://localhost:8080
   - auth_token: your_jwt_token (if required)
   
3. Test endpoints:
   - POST {{base_url}}/api/v1/config
   - Body: {"type":"GET","entity":"config"}
```

### 5.2 Using cURL

```bash
# GET example
curl -X POST http://localhost:8080/api/v1/config \
  -H "Content-Type: application/json" \
  -d '{"type":"GET","filters":{"id":1}}'

# ADD example
curl -X POST http://localhost:8080/api/v1/config \
  -H "Content-Type: application/json" \
  -d '{"type":"ADD","data":{"name":"test","value":"123"}}'

# With authorization (if needed)
curl -X POST http://localhost:8080/api/v1/config \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -d '{"type":"GET"}'
```

### 5.3 Using VS Code REST Client

```
Create file: requests.rest

### GET request
POST http://localhost:8080/api/v1/config
Content-Type: application/json

{
  "type": "GET",
  "filters": {"id": 1}
}

### ADD request
POST http://localhost:8080/api/v1/config
Content-Type: application/json

{
  "type": "ADD",
  "data": {"name": "test-config"}
}

# Click "Send Request" above each request
```

---

## 6. Debugging

### 6.1 Enable Debug Mode

**Option A: Maven**
```bash
# Run with debug port exposed
mvn spring-boot:run \
  -Dspring-boot.run.arguments="--spring.profiles.active=local" \
  -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,address=5005,suspend=n"

# Output: Listening for transport dt_socket at address: 5005
```

**Option B: JAR**
```bash
java -Xdebug \
  -Xrunjdwp:transport=dt_socket,server=y,address=5005,suspend=n \
  -Dspring.profiles.active=local \
  -jar target/eai-3540813-data-services-1.1.4.jar
```

### 6.2 Attach IDE Debugger

**VS Code:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Debug Spring Boot",
      "request": "attach",
      "hostName": "localhost",
      "port": 5005,
      "preLaunchTask": "maven: spring-boot:run"
    }
  ]
}
```
Then: Press F5 to attach debugger

**IntelliJ:**
1. Click Run → Edit Configurations
2. Add Remote Debug configuration
3. Host: localhost, Port: 5005
4. Click Debug (or Shift+F9)

### 6.3 Common Debugging Breakpoints

| Breakpoint | Reason |
|-----------|--------|
| `DataController.genericResponse()` | Trace REST request routing |
| `DataServiceImpl.getDetails()` | Debug query execution |
| `AcvCrudConfigInfoRepo.findBy...()` | Trace repository calls |
| Cache hit/miss point | Debug cache behavior |

### 6.4 Logging

**Increase Log Level:**
```properties
# application-local.yml
logging:
  level:
    root: INFO
    com.fedex.acv.data: DEBUG
    org.springframework.web: DEBUG
    org.hibernate: DEBUG
    org.springframework.data: DEBUG
```

**View Logs:**
```bash
# Live logs (while app running in terminal)
# Auto-displayed in console

# Save logs to file
mvn spring-boot:run > logs.txt 2>&1

# Tail logs in real-time
tail -f logs.txt
```

---

## 7. Development Workflows

### 7.1 Adding a New REST Endpoint

**Step 1: Add method to DataController (v1) or DataControllerV2 (v2)**

```java
@PostMapping(value = "/{entity}/custom")
public ResponseEntity<?> customEndpoint(
    @PathVariable String entity,
    @RequestBody String requestBody) throws AcvDataException {
    
    Map<String, Object> request = parseJson(requestBody);
    String result = dataSvc.customOperation(request, entity);
    return new ResponseEntity<>(result, HttpStatus.OK);
}
```

**Step 2: Add method to service interface and implementation**

```java
// DataService.java
String customOperation(Map<String, Object> request, String entity);

// DataServiceImpl.java
@Override
public String customOperation(Map<String, Object> request, String entity) {
    // Implementation
}
```

**Step 3: Test endpoint**

```bash
curl -X POST http://localhost:8080/api/v1/{entity}/custom \
  -H "Content-Type: application/json" \
  -d '{"type":"CUSTOM"}'
```

### 7.2 Adding Configuration-Driven Query

**Step 1: Insert configuration into database**

```sql
INSERT INTO ACV_CRUD_CONFIG_INFO (ENTITY_NM, OPRN_TYP_CD, SQL_CNFG_TXT, IS_CACHEABLE)
VALUES ('new_entity', 'GET', 'SELECT * FROM new_entity WHERE id = ?', 'Y');
```

**Step 2: Call endpoint**

```bash
curl -X POST http://localhost:8080/api/v1/new_entity \
  -H "Content-Type: application/json" \
  -d '{"type":"GET","filters":{"id":1}}'
```

**Step 3: Verify in cache**

```bash
# Check Redis cache
redis-cli
> KEYS "new_entity*"
> GET "new_entity-1"
```

### 7.3 Code Changes Workflow

**Step 1: Create Feature Branch**

```bash
git checkout -b feature/add-batch-endpoint
```

**Step 2: Make Changes**

```bash
# Edit files
vim src/main/java/com/fedex/acv/data/controller/DataControllerV2.java
```

**Step 3: Build & Test**

```bash
mvn clean test
# All tests must pass
```

**Step 4: Run Locally**

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
# Verify behavior with API calls
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat(api): add batch operations endpoint"
```

**Step 6: Push & Create PR**

```bash
git push origin feature/add-batch-endpoint
# Create pull request on GitHub
# Request review from team
```

---

## 8. Troubleshooting

### Issue: "Failed to connect to database"

**Symptom:**
```
ERROR: HikariPool - Failed to validate connection org.postgresql.util.PSQLException: 
Connection to localhost:5432 refused
```

**Cause:** PostgreSQL not running or port wrong

**Solution:**
```bash
# Check if PostgreSQL running
psql -U acv_user -d acvdb -c "SELECT 1;"

# If not running, start it:
postgres -D /usr/local/var/postgres  # macOS
sudo service postgresql start        # Linux
docker start acv-postgres            # Docker
```

---

### Issue: "Redis connection failed"

**Symptom:**
```
ERROR: Cannot get a resource (redis);
nested exception is io.lettuce.core.RedisConnectionException:
WRONGPASS invalid username-password pair
```

**Cause:** Redis not running or wrong credentials

**Solution:**
```bash
# Check if Redis running
redis-cli ping
# Output: PONG

# If not running, start it:
redis-server                 # Local
docker start acv-redis       # Docker

# Verify no authentication needed locally:
# Check application-local.yml:
# spring.redis.password: null  (should be null for local)
```

---

### Issue: "Port already in use"

**Symptom:**
```
Caused by: java.net.BindException: Address already in use (Bind failed)
```

**Cause:** Port 8080 or 8081 already in use

**Solution:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or use different port:
java -Dserver.port=8082 -jar target/eai-3540813-data-services-1.1.4.jar
```

---

### Issue: "Entity not configured"

**Symptom:**
```json
{
  "status": "error",
  "errorCode": "ERR_INVALID_ENTITY",
  "message": "Entity 'unknown' not found in configuration"
}
```

**Cause:** No configuration entry in ACV_CRUD_CONFIG_INFO table

**Solution:**
```sql
-- Add configuration
INSERT INTO ACV_CRUD_CONFIG_INFO 
(ENTITY_NM, OPRN_TYP_CD, SQL_CNFG_TXT, IS_CACHEABLE)
VALUES ('unknown', 'GET', 'SELECT * FROM unknown WHERE id = ?', 'Y');

-- Or check existing
SELECT * FROM ACV_CRUD_CONFIG_INFO WHERE ENTITY_NM = 'unknown';
```

---

### Issue: "Spring Cloud Config connection timeout"

**Symptom:**
```
ERROR: Could not fetch config from Spring Cloud Config server
java.net.ConnectException: Connection timed out
```

**Cause:** Trying to connect to remote config server in local development

**Solution:**
```bash
# Use local profile with config disabled:
mvn spring-boot:run \
  -Dspring-boot.run.arguments="--spring.profiles.active=local --spring.cloud.config.enabled=false"
```

---

## 9. Code Conventions

### 9.1 Java Style

```java
// ✅ Correct
@RestController
@RequestMapping("/api/v1")
public class DataController {
    @PostMapping(value = "/{entity}")
    public ResponseEntity<?> genericResponse(...) {
        // Implementation
    }
}

// ❌ Avoid
public class data_controller {
    public static ResponseEntity genericResponse(...) {
        // Implementation
    }
}
```

**Rules:**
- Class names: PascalCase (DataController)
- Method names: camelCase (genericResponse)
- Constants: UPPER_CASE (MAX_POOL_SIZE)
- Packages: lowercase (com.fedex.acv.data.controller)

### 9.2 Git Commit Messages

```bash
# ✅ Good
git commit -m "feat(api): add batch operations endpoint"
git commit -m "fix(cache): invalidate cache on update"
git commit -m "docs(readme): update setup instructions"

# ❌ Avoid
git commit -m "fix bug"
git commit -m "update files"
git commit -m "WIP"
```

**Format:** `type(scope): description`

Types: feat, fix, docs, style, refactor, test, chore

---

## 10. FAQ - Frequently Asked Questions

### Q: How do I reload config without restarting?

**A:** Spring Cloud Config can be reloaded:

```bash
# 1. Update configuration server
# 2. Call actuator refresh endpoint:

curl -X POST http://localhost:8081/actuator/refresh

# 3. Spring reloads beans with @RefreshScope
```

---

### Q: How do I add a new entity type?

**A:**
```sql
-- 1. Add configuration to database
INSERT INTO ACV_CRUD_CONFIG_INFO values('new_entity', 'GET', 'SELECT * FROM...', 'Y');

-- 2. Call API
curl -X POST http://localhost:8080/api/v1/new_entity \
  -d '{"type":"GET"}'
```

---

### Q: Can I run without Redis?

**A:** Yes, but cache disabled:

```yml
# application-local.yml
spring:
  cache:
    type: none  # Disable caching
```

---

### Q: How do I test with country codes?

**A:**
```bash
curl -X POST http://localhost:8080/api/v1/policy/US \
  -d '{"type":"GET","filters":{"id":1}}'

# Automatically filters by country code
```

---

### Q: How do I check what's cached?

**A:**
```bash
# Connect to Redis
redis-cli

# List all cache keys
KEYS "configCache*"

# Get cached value
GET "configCache-config-1"

# Clear cache
FLUSHDB
```

---

## 11. Quick Reference Commands

| Task | Command |
|------|---------|
| **Build** | `mvn clean package -DskipTests` |
| **Run** | `mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local --spring.cloud.config.enabled=false"` |
| **Test** | `mvn test` |
| **Test one class** | `mvn test -Dtest=DataServiceImplTest` |
| **Check health** | `curl http://localhost:8081/actuator/health` |
| **View metrics** | `curl http://localhost:8081/actuator/metrics` |
| **Git status** | `git status` |
| **Create branch** | `git checkout -b feature/name` |
| **Commit** | `git commit -m "type(scope): message"` |
| **Kill port** | `lsof -i :8080 && kill -9 <PID>` |
| **Check logs** | `tail -f logs.txt` |

---

## Cross-References

- [README.md](README.md) — Project overview
- [HLD.md](HLD.md) — Architecture
- [LLD.md](LLD.md) — Code deep-dive
- [services.md](services.md) — API specifications
- [code-mapping.md](code-mapping.md) — File navigation
- [glossary.md](glossary.md) — Terminology

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** New Developers, Team Members, Onboarding Engineers, Technical Leads
