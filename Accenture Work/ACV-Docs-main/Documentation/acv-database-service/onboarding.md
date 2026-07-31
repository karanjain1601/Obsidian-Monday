# ACV Database Service - Developer Onboarding Guide

**Purpose:** Enable new developers to set up, build, run, and debug the Database Service locally.

**Scope:** Environment setup, build process, local execution, testing, common issues, workflows.

---

## 1. Prerequisites

### 1.1 Required Software

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| **Java** | 21 LTS | Language runtime | [openjdk.java.net](https://openjdk.java.net/) |
| **Git** | 2.40+ | Version control | [git-scm.com](https://git-scm.com/) |
| **Maven** | 3.8.1+ | Build tool | [maven.apache.org](https://maven.apache.org/) |
| **PostgreSQL Client** | 14+ | Database CLI (optional) | [postgresql.org](https://www.postgresql.org/download/) |
| **Docker** | 20.10+ | Containerization (optional) | [docker.com](https://www.docker.com/products/docker-desktop) |
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
```

### 1.3 IDE Setup

**VS Code Extensions:**
- Extension Pack for Java (Microsoft)
- Spring Boot Extension Pack (VMware)
- Database Client (Database ML)
- REST Client (Humao)

**IntelliJ IDEA:**
- Built-in Spring Boot and database tools
- No additional plugins needed

---

## 2. Local Environment Setup

### 2.1 Clone Repository

```bash
# Navigate to your projects directory
cd ~/projects

# Clone the repository
git clone https://github.com/FedEx/eai-3540813-database-service.git
cd eai-3540813-database-service

# Verify you're on main branch
git checkout main
git branch -a

# Output: * main (local), origin/main (remote)
```

### 2.2 Configure Git (First Time)

```bash
# Set identity (used for commits)
git config --global user.name "Your Full Name"
git config --global user.email "your.email@fedex.com"

# Verify
git config --global --list | grep user
```

### 2.3 Create Local Environment

**Option A: Using Maven Wrapper (Recommended)**
```bash
# Maven wrapper automatically downloads correct Maven version
# No manual Maven installation needed

# Verify wrapper
ls -la mvnw
# Output: -rwxr-xr-x maven wrapper script
```

**Option B: Manual Maven Setup**
```bash
# If Maven not installed globally
export MAVEN_HOME=/path/to/maven
export PATH=$MAVEN_HOME/bin:$PATH

mvn -version
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
# [INFO] Downloaded: ... (1.2 MB)
# [INFO] BUILD SUCCESS
```

**What happens:**
- Maven downloads all dependencies from Maven Central
- Dependencies cached locally in `~/.m2/repository/`
- Subsequent builds much faster (uses cache)
- First build typically takes 2-5 minutes

### 3.2 Build for Development

```bash
# Quick build (compile + package, no tests)
mvn package -DskipTests

# Or use wrapper
./mvnw package -DskipTests

# Output:
# [INFO] --- maven-jar-plugin:3.2.0:jar ...
# [INFO] Building jar: target/eai-3540813-database-service-1.1.2.jar
# [INFO] BUILD SUCCESS

# JAR created at: target/eai-3540813-database-service-1.1.2.jar
```

### 3.3 Run Application Locally (H2 Development)

**Option A: Maven Spring Boot Plugin (Recommended for development)**

```bash
# Run with Maven (uses spring.profiles.active=local)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"

# Output:
# [INFO] Attaching agents: []
#  .   ____          _            __ _ _
# /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
# ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
# /  ___/| | | | | || || (_) | | | | | |
# /  ____/| |_| |_| |_| | | / __|\/ _ \/ _ \_/ _|
# |_|____| \ / \ /
# 
# :: Spring Boot :: (3.3.3)
# 
# Tomcat started on port(s): 8080 (http)
# Started DatabaseServiceApplication in 2.345 seconds (JVM running for 2.891)
```

**Application Now Running:**
- URL: `http://localhost:8080`
- Management: `http://localhost:8081`

**Option B: Run JAR Directly**

```bash
# 1. Build JAR
mvn clean package -DskipTests

# 2. Run JAR
java -Dspring.profiles.active=local \
  -jar target/eai-3540813-database-service-1.1.2.jar

# Output: Same as Maven plugin above
```

**Option C: Run in IDE**

```
VS Code:
1. Open DatabaseServiceApplication.java
2. Click "Run" (or press F5)
3. Spring Boot plugin auto-detects and runs

IntelliJ:
1. Open DatabaseServiceApplication.java
2. Click green play icon
3. Edit Run Configuration:
   - Program arguments: --spring.profiles.active=local
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
    "db": {
      "status": "UP",
      "details": {
        "database": "H2",
        "validationQuery": "Connection successful"
      }
    }
  }
}
```

**Check Application Logs:**
```bash
# Logs printed to console by default
# Look for:
# - "Flyway migration completed successfully"
# - "Started DatabaseServiceApplication in X seconds"

# Once running, access:
# - http://localhost:8080                      (App)
# - http://localhost:8081/actuator/health      (Health)
# - http://localhost:8081/actuator/metrics     (Metrics)
# - http://localhost:8080/h2-console           (H2 Console)
```

---

## 4. Testing

### 4.1 Unit Tests

```bash
# Run all unit tests
mvn test

# Run specific test class
mvn test -Dtest=AcvDBConfigurationTest

# Run specific test method
mvn test -Dtest=AcvDBConfigurationTest#testDataSourceBeanCreated

# Output:
# -------------------------------------------------------
#  T E S T S
# -------------------------------------------------------
# Running com.fedex.acv.database.AcvDBConfigurationTest
# Tests run: 2, Failures: 0, Skipped: 0
# -------------------------------------------------------
```

### 4.2 Integration Tests

```bash
# Run integration tests (includes database)
# Profile: test uses test PostgreSQL or test H2 config

mvn verify -DskipUnitTests

# Or run specific integration test
mvn verify -Dit.test=FlywayDBInitializerIT
```

### 4.3 Test Coverage Report

```bash
# Generate coverage report via JaCoCo
mvn clean test jacoco:report

# View report
open target/site/jacoco/index.html

# Note: Adjust "open" to "start" (Windows) or "xdg-open" (Linux)
```

---

## 5. Debugging

### 5.1 Enable Debug Mode

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
  -jar target/eai-3540813-database-service-1.1.2.jar
```

### 5.2 Attach IDE Debugger

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

### 5.3 Common Debugging Breakpoints

| Breakpoint | Reason |
|-----------|--------|
| `DatabaseServiceApplication.main()` | Verify app starts |
| `AcvDBConfiguration.acvConfigDataSource()` | Debug DataSource creation |
| `FlywayDBInitializer.migrateFlyway()` | Debug migrations |
| Inside migration execution | Trace schema changes |

### 5.4 Logging

**Increase Log Level:**
```properties
# application-local.properties
logging.level.root=INFO
logging.level.com.fedex.acv=DEBUG
logging.level.org.springframework.boot=DEBUG
logging.level.org.hibernate=DEBUG
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

## 6. H2 Console (Local Development)

### 6.1 Access H2 Web Console

```
URL: http://localhost:8080/h2-console

Settings:
- Saved Settings: Generic H2
- Driver Class: org.h2.Driver
- JDBC URL: jdbc:h2:mem:acv-db
- User Name: sa
- Password: password
```

### 6.2 Common H2 Queries

```sql
-- List all tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;

-- Query ACV config table
SELECT * FROM acv_config;

-- Check migration history
SELECT * FROM flyway_schema_history;

-- Count records
SELECT COUNT(*) FROM acv_config;

-- Drop table (testing)
DROP TABLE acv_config;
```

---

## 7. Development Workflows

### 7.1 Adding a New Database Migration

**Step 1: Create Migration File**
```bash
# Create new migration script
cat > src/main/resources/acv-configuration/local/V1_1__Add_audit_table.sql << 'EOF'
-- Add audit logging table
CREATE TABLE acv_audit_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    operation VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test data
INSERT INTO acv_audit_log (entity_type, entity_id, operation)
VALUES ('acv_config', 1, 'CREATED');
EOF
```

**Step 2: Run Application (Migration Auto-Executes)**
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"

# In console:
# Flyway migration completed successfully. Applied 1 migrations.
```

**Step 3: Verify Migration**
```bash
# Check H2 console
SELECT * FROM acv_audit_log;
```

**Step 4: Commit to Git**
```bash
git add src/main/resources/acv-configuration/local/V1_1__*.sql
git commit -m "feat(db): add audit logging table"
```

### 7.2 Modifying Connection Configuration

**Change Pool Size:**
```bash
# Edit application-local.properties
spring.datasource.acv.hikari.maximum-pool-size=10
spring.datasource.acv.hikari.minimum-idle=3

# Restart application
# Changes take effect immediately
```

**Use Different Database:**
```bash
# Option 1: Use PostgreSQL locally
# 1. Install PostgreSQL
# 2. Create database: createdb acvdb
# 3. Edit application-local.properties:

spring.datasource.acv.url=jdbc:postgresql://localhost:5432/acvdb
spring.datasource.acv.username=postgres
spring.datasource.acv.password=yourpassword
spring.datasource.acv.driver-class-name=org.postgresql.Driver

# 4. Update flyway scripts: Use PostgreSQL syntax
# 5. Restart application
```

### 7.3 Code Changes Workflow

**Step 1: Create Feature Branch**
```bash
git checkout -b feature/update-datasource-config
```

**Step 2: Make Changes**
```bash
# Edit file e.g., AcvDBConfiguration.java
vim src/main/java/com/fedex/acv/database/AcvDBConfiguration.java
```

**Step 3: Build & Test**
```bash
mvn clean test
# All tests must pass
```

**Step 4: Run Locally**
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
# Verify behavior manually
```

**Step 5: Commit**
```bash
git add .
git commit -m "refactor(config): improve datasource configuration"
```

**Step 6: Push & Create PR**
```bash
git push origin feature/update-datasource-config
# Create pull request on GitHub
# Request review from team
```

---

## 8. Troubleshooting

### Issue: "Failed to Bind Properties"

**Symptom:**
```
ERROR: Could not bind properties to DataSourceProperties [spring.datasource.acv.url, spring.datasource.acv.username]
```

**Cause:** Properties missing in application-{env}.properties

**Solution:**
```bash
# Check application-local.properties has:
# spring.datasource.acv.url
# spring.datasource.acv.username
# spring.datasource.acv.password

# Add missing properties or use correct profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
```

---

### Issue: "Port Already in Use"

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
java -Dserver.port=8082 -jar target/eai-3540813-database-service-1.1.2.jar
```

---

### Issue: "Connection Pool Timeout"

**Symptom:**
```
java.sql.SQLException: HikariPool-1 - Connection is not available
```

**Cause:** Connection pool exhausted (all connections in use)

**Solution:**
```bash
# Increase pool size in application-prod.properties:
spring.datasource.acv.hikari.maximum-pool-size=30

# Or reduce application load/concurrent requests

# Monitor pool usage:
curl http://localhost:8081/actuator/metrics/hikaricp.connections.active
```

---

### Issue: "Flyway Migration Failed"

**Symptom:**
```
ERROR: Flyway migration failed: Syntax error in migration V1_1__Add_tables.sql
```

**Cause:** Invalid SQL in migration script

**Solution:**
```bash
# 1. Review migration file for SQL errors
# 2. Test SQL in H2 console first
# 3. Fix SQL syntax
# 4. Rename migration file to force re-execution (V1_1 → V1_1_FIXED)
# 5. Restart application

# For production: Use baseline to mark as applied anyway (dangerous!)
spring.datasource.acv.flyway.baseline-on-migrate=true
```

---

### Issue: "H2 Console Not Accessible"

**Symptom:**
```
Cannot access http://localhost:8080/h2-console
```

**Cause:** H2 console disabled in properties

**Solution:**
```bash
# Check application-local.properties:
spring.h2.console.enabled=true

# Restart application with correct profile:
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
```

---

## 9. Code Conventions

### 9.1 Java Style

```java
// ✅ Correct
@Configuration
public class DatabaseConfiguration {
    @Bean
    public DataSource configDataSource() {
        return new HikariDataSource(...);
    }
}

// ❌ Avoid
public class DataBase_Config {
    public staticDataSource configDataSource() {
        return ...
    }
}
```

**Rules:**
- Class names: PascalCase (DatabaseConfiguration)
- Method names: camelCase (migrateFlyway)
- Constants: UPPER_CASE (MAX_POOL_SIZE)
- Packages: lowercase (com.fedex.acv.database)

### 9.2 Configuration Properties

```properties
# ✅ Correct
spring.datasource.acv.url=jdbc:h2:mem:acv-db
spring.datasource.acv.hikari.maximum-pool-size=20

# ❌ Avoid
spring.datasource.url=...  (missing acv namespace)
SPRING_DATASOURCE_ACV_URL=...  (wrong format, use lowercase with dots)
```

### 9.3 Git Commit Messages

```bash
# ✅ Good
git commit -m "feat(db): add Flyway database migrations"
git commit -m "fix(config): increase connection pool timeout"
git commit -m "docs(readme): update setup instructions"

# ❌ Avoid
git commit -m "fix bug"
git commit -m "updated files"
git commit -m "WIP"
```

---

## 10. FAQ - Frequently Asked Questions

### Q: Where are database files stored locally?

**A:** H2 in-memory database lives in RAM; lost on application restart. For persistent local testing, use PostgreSQL locally.

---

### Q: How do I switch between local and prod configurations?

**A:** Use Spring profiles:
```bash
# Local (H2)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"

# Production (PostgreSQL via env vars)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

---

### Q: Can I run multiple instances on same machine?

**A:** Yes, each needs different port:
```bash
java -Dserver.port=8082 -Dmanagement.server.port=8083 -jar app.jar
```

---

### Q: How do I add a test?

**A:** Create test class in `src/test/java/`:
```java
@SpringBootTest
public class MyTest {
    @Autowired
    private DataSource dataSource;
    
    @Test
    public void testDataSourceExists() {
        assertNotNull(dataSource);
    }
}
```

---

### Q: What if migration applied but has error?

**A:** Manual intervention required:

```sql
-- 1. Check schema version
SELECT * FROM flyway_schema_history;

-- 2. Remove failed migration from history
DELETE FROM flyway_schema_history WHERE version = '1_1';

-- 3. Fix migration SQL script
-- 4. Restart application
```

---

### Q: How do I check my changes before committing?

**A:** Review changes and run tests:
```bash
git status               # See changes
git diff                # See actual changes
git diff --staged       # See staged changes

mvn clean test          # Run all tests
mvn spring-boot:run ... # Run locally
```

---

### Q: Can I work offline?

**A:** After first build (which downloads dependencies), Maven caches everything locally. Subsequent builds work offline:
```bash
mvn -o clean test  # -o = offline mode
```

---

## 11. Team Communication

### 11.1 Getting Help

**Slack:** `#database-engineering` channel
**Email:** database-team@fedex.com
**Office Hours:** Thursdays 10-11am (Zoom link in channel)

### 11.2 Reporting Issues

**Problem Found?**
1. Create GitHub issue with:
   - Environment (local/dev/prod)
   - Java version
   - Exact error message
   - Steps to reproduce
   - Expected vs actual behavior

2. Example:
```
Title: Flyway migration timeout in prod

Environment: Production
Java Version: 21.0.2 LTS
Error: java.sql.SQLException: Timeout connecting to database

Steps:
1. Deploy version 1.1.2 to prod
2. Migrations hang after 5 minutes

Expected: Migrate within 2 minutes
Actual: Timeout after 5 minutes, application fails to start
```

---

## 12. Quick Reference Commands

| Task | Command |
|------|---------|
| **Build** | `mvn clean package -DskipTests` |
| **Run locally** | `mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"` |
| **Run tests** | `mvn test` |
| **Run single test** | `mvn test -Dtest=AcvDBConfigurationTest` |
| **Debug** | Enable debug port, attach IDE debugger |
| **Check health** | `curl http://localhost:8081/actuator/health` |
| **View metrics** | `curl http://localhost:8081/actuator/metrics` |
| **Git status** | `git status` |
| **Create branch** | `git checkout -b feature/name` |
| **Commit** | `git commit -m "type(scope): message"` |
| **Push** | `git push origin feature/name` |
| **Kill port** | `lsof -i :8080 && kill -9 <PID>` |

---

## Cross-References

- [README.md](README.md) — Project overview
- [HLD.md](HLD.md) — Architecture
- [LLD.md](LLD.md) — Code deep-dive
- [services.md](services.md) — Configuration reference
- [code-mapping.md](code-mapping.md) — File navigation
- [glossary.md](glossary.md) — Terminology

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** New Developers, Team Members, Onboarding Engineers
