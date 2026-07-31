# Developer Onboarding Guide — ACV Scheduler Service

## Prerequisites

Before working on the ACV Scheduler Service, ensure you have:

| Tool | Version | Purpose |
|------|---------|---------|
| **Java Development Kit (JDK)** | 21+ | Compile and run Java code |
| **Apache Maven** | 3.9+ | Build and dependency management |
| **Git** | 2.30+ | Version control |
| **PostgreSQL** | 14+ | Job metadata database (local or managed) |
| **Redis** (optional) | 6+ | Caching (or use managed Redis) |
| **Docker** (optional) | 24+ | Run services locally (Postgres, Redis) |
| **IDE** | IntelliJ IDEA / VS Code | Code editing and debugging |
| **Azure CLI** (optional) | Latest | Interact with Event Hubs |
| **Postman** (optional) | Latest | Test REST endpoints |

---

## Environment Setup

### Step 1: Clone Repository

```bash
cd c:\Users\6687869\Code\ACV
git clone <repo-url> eai-3540813-acv-scheduler-service
cd eai-3540813-acv-scheduler-service
```

### Step 2: Verify Prerequisites

```bash
java -version          # Should output Java 21+
mvn -version           # Should output Maven 3.9+
git --version          # Should output Git 2.30+
```

### Step 3: Configure Local Environment

Create `src/main/resources/application-local.yml`:

```yaml
spring:
  application:
    name: acv-scheduler-service
  profiles:
    active: local
  datasource:
    url: jdbc:postgresql://localhost:5432/acv_scheduler
    username: postgres
    password: ${POSTGRESQL_PASSWORD}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate.ddl-auto: validate
    show-sql: false
    properties:
      hibernate.dialect: org.hibernate.dialect.PostgreSQL10Dialect

quartz:
  job:
    enabled: true
    store-type: jdbc
  datasource:
    url: jdbc:postgresql://localhost:5432/acv_scheduler_quartz
    username: postgres
    password: ${POSTGRESQL_PASSWORD}
    driver-class-name: org.postgresql.Driver

azure:
  eventhubs:
    connection-string: ${AZURE_EVENTHUBS_CONNECTION_STRING}
    checkpoint-storage:
      account-name: ${AZURE_STORAGE_ACCOUNT}
      container-name: scheduler-checkpoints

spring.cache:
  type: redis
  redis:
    host: localhost
    port: 6379

oauth2:
  okta:
    tenant-url: https://dev-xxx.okta.com
    client-id: ${OKTA_CLIENT_ID}
    client-secret: ${OKTA_CLIENT_SECRET}

logging:
  level:
    com.fedex.acv: DEBUG
    org.springframework: INFO
```

### Step 4: Set Environment Variables

```bash
# Okta OAuth2 (get from https://dev-xxx.okta.com)
set OKTA_CLIENT_ID=0ax1234567890
set OKTA_CLIENT_SECRET=your-secret-here

# PostgreSQL
set POSTGRESQL_PASSWORD=mypassword

# Azure Event Hubs
set AZURE_EVENTHUBS_CONNECTION_STRING=Endpoint=sb://...core.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=...

# Azure Storage (for Event Hubs checkpoints)
set AZURE_STORAGE_ACCOUNT=devstorageaccount
set AZURE_STORAGE_KEY=...
```

### Step 5: Start PostgreSQL Locally (Docker)

```bash
docker run --name postgres-acv \
  -e POSTGRES_PASSWORD=mypassword \
  -p 5432:5432 \
  -d postgres:14
```

Create databases:
```bash
psql -U postgres -h localhost -c "CREATE DATABASE acv_scheduler;"
psql -U postgres -h localhost -c "CREATE DATABASE acv_scheduler_quartz;"
```

### Step 6: Start Redis Locally (Docker)

```bash
docker run --name redis-acv \
  -p 6379:6379 \
  -d redis:latest
```

---

## Build & Run Locally

### Build

```bash
# Full build with tests
mvn clean package

# Build skipping tests (faster)
mvn clean package -DskipTests

# Build with specific profile
mvn clean package -Dspring.profiles.active=local
```

### Run

#### Option 1: Maven Spring Boot Plugin

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
```

#### Option 2: Run JAR

```bash
java -jar target/eai-3540813-acv-scheduler-service-1.1.4.jar \
  --spring.profiles.active=local
```

#### Option 3: Docker

```bash
docker build -t acv-scheduler:local .

docker run -e OKTA_CLIENT_ID=$OKTA_CLIENT_ID \
           -e OKTA_CLIENT_SECRET=$OKTA_CLIENT_SECRET \
           -e AZURE_EVENTHUBS_CONNECTION_STRING=$AZURE_EVENTHUBS_CONNECTION_STRING \
           -e POSTGRESQL_PASSWORD=$POSTGRESQL_PASSWORD \
           -p 8080:8080 \
           acv-scheduler:local
```

**Expected Output:**
```
2024-04-02 10:30:00.123  INFO 12345 --- [main] c.fedex.acv.scheduler... : Started AcvSchedulerServiceApplication
```

Service available at `http://localhost:8080`

---

## Running Tests

### Unit Tests Only

```bash
mvn test
```

### Integration Tests

```bash
mvn verify -Pintegration
```

### All Tests with Coverage

```bash
mvn clean verify jacoco:report
# Open target/site/jacoco/index.html in browser
```

### Specific Test Class

```bash
mvn test -Dtest=JobExecutorServiceImplTest
```

### Specific Test Method

```bash
mvn test -Dtest=JobExecutorServiceImplTest#testExecuteJobWithRetry
```

---

## Debugging Tips

### Attach Remote Debugger

1. Start with debug flag:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
   ```

2. In IDE, create remote debug config:
   - **IntelliJ:** Run → Edit Configurations → + Remote JVM Debug → localhost:5005
   - **VS Code:** Install Debugger for Java, set port 5005

### Check Logs

```bash
# Real-time logs
tail -f target/logs/scheduler.log

# Search for errors
grep ERROR target/logs/scheduler.log

# Track job execution
grep "jobId\|jobName" target/logs/scheduler.log
```

### Validate Service Health

```bash
# Ping endpoint
curl http://localhost:8080/ping

# Health check
curl http://localhost:8080/actuator/health

# Metrics
curl http://localhost:8080/actuator/metrics
```

### Test Endpoints

```bash
# Execute a job immediately
curl -X GET "http://localhost:8080/job/US/DOC_GEN_DAILY" \
  -H "Authorization: Bearer <JWT_TOKEN>"

# Schedule a new job
curl -X GET "http://localhost:8080/job/newJob?jobName=TEST_JOB&cronExpression=0%202%20*%20*%20*%20%3F&jobScheduleTime=2024-04-02" \
  -H "Authorization: Bearer <JWT_TOKEN>"

# Pause a job
curl -X GET "http://localhost:8080/job/action/pause?jobName=TEST_JOB" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## Common Development Tasks

### Add a New Job Type

1. **Create Job Action Handler:**
   ```java
   // com/fedex/acv/scheduler/jobs/service/impl/MyJobAction.java
   @Component
   public class MyJobAction {
       public void execute(JobContext context) {
           // Your business logic here
       }
   }
   ```

2. **Register in Factory:**
   ```java
   // GenericMappingFactory.java
   private static final Map<String, JobAction> ACTIONS = Map.ofEntries(
       entry("MY_JOB_TYPE", myJobAction),
       ...
   );
   ```

3. **Add to Configuration:**
   ```yaml
   # application-local.yml
   jobs:
     US:
       - name: MY_NEW_JOB
         action: MY_JOB_TYPE
         cron: "0 2 * * * ?"
         maxRetries: 3
   ```

4. **Test:**
   ```bash
   curl http://localhost:8080/job/US/MY_NEW_JOB
   ```

---

### Add Country-Specific Job Config

1. **Create Config:**
   ```yaml
   # application-local.yml
   jobs:
     DE:                           # Add Germany jobs
       - name: COMPLIANCE_CHECK
         action: COMPLIANCE
         cron: "0 3 ? * MON"       # 3 AM Monday
         maxRetries: 2
         timeoutMinutes: 45
   ```

2. **Update CountryJobConfiguration to load:**
   ```java
   public JobConfiguration getJobConfig(String country, String jobName) {
       // Loads from "jobs.<country>.<jobName>" properties
   }
   ```

3. **Test:**
   ```bash
   curl http://localhost:8080/job/DE/COMPLIANCE_CHECK
   ```

---

### Add Logging

Use SLF4J (already integrated):

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class MyService {
    private static final Logger log = LoggerFactory.getLogger(MyService.class);
    
    public void myMethod() {
        log.debug("Starting job execution: {}", jobName);
        log.info("Job completed successfully");
        log.warn("Job timeout exceeded for country: {}", country);
        log.error("Job execution failed", exception);
    }
}
```

---

### Debug Quartz Job Execution

1. **Enable Quartz debug logging:**
   ```yaml
   logging:
     level:
       org.quartz: DEBUG
   ```

2. **Add logging in AcvCronJob:**
   ```java
   public void execute(JobExecutionContext context) {
       log.debug("Quartz job fired: {}", context.getJobDetail().getKey());
       // execution logic
       log.debug("Quartz job completed");
   }
   ```

3. **Check PostgreSQL Quartz tables:**
   ```sql
   SELECT * FROM QRTZ_JOB_DETAILS WHERE JOB_NAME = 'MY_JOB';
   SELECT * FROM QRTZ_CRON_TRIGGERS WHERE TRIGGER_NAME = 'MY_TRIGGER';
   ```

---

## Code Conventions

### Naming Standards

- **Classes:** PascalCase (e.g., `JobExecutorServiceImpl`)
- **Methods:** camelCase (e.g., `executeJobWithRetry()`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_RETRIES = 3`)
- **Variables:** camelCase (e.g., `jobId`)
- **Packages:** lowercase, reverse domain (e.g., `com.fedex.acv.scheduler.jobs`)

### Code Style

- **Indentation:** 4 spaces
- **Line Length:** 120 characters max
- **No Warnings:** Fix all warnings before commit
- **Comments:** Javadoc for public methods, inline for complex logic
- **Lombok:** Use `@Slf4j`, `@RequiredArgsConstructor`, `@Data`

### Logging Levels

- **INFO:** Flow events (job started, completed successfully)
- **DEBUG:** Detailed tracing (entering method, variable values)
- **WARN:** Recoverable issues (retry attempt, fallback behavior)
- **ERROR:** Unrecoverable issues with stack traces

---

## Architecture Walkthrough (5-Minute Overview)

### Request Flow: Execute Job

1. **Controller:** `AcvQuartzController.testWorkflow(country, job)`
2. **Service:** `JobExecutorService.executeJob(country, job)`
3. **Config:** Load job definition from `CountryJobConfiguration`
4. **Factory:** `GenericMappingFactory` maps job name → action handler
5. **Action:** Execute handler (e.g., `JobActionsImpl.executeDocumentGeneration()`)
6. **Event:** Publish result to `AcvEventHubProducer`
7. **Response:** Return `200 OK` with job result

### Flow: Schedule Job

1. **Controller:** `AcvQuartzController.schedule(jobName, cron, date)`
2. **Service:** `AcvQuartzService.schedule()` creates Quartz trigger
3. **Persistence:** Saves to PostgreSQL QRTZ_* tables
4. **Trigger:** At cron time, Quartz fires `AcvCronJob`
5. **Execution:** Job runs through normal execution flow (see above)

---

## FAQ

**Q: How do I disable a job without deleting it?**  
A: Use `/job/action/pause?jobName=MY_JOB`. Resume with `/job/action/resume`.

**Q: How do I test a job that's scheduled for 2 AM?**  
A: Call `/job/US/MY_JOB` to execute immediately. Or create test job with cron `0/1 * * * * ?` (every minute).

**Q: My PostgreSQL isn't running. What do I do?**  
A: Start it with Docker: `docker run -e POSTGRES_PASSWORD=pwd -p 5432:5432 -d postgres:14`

**Q: I'm getting JWT token errors. Where do I get a token?**  
A: For local testing, set `OKTA_CLIENT_ID/SECRET` and use Okta's token endpoint to get a JWT.

**Q: How do I handle a long-running job (> 30 minutes)?**  
A: Update `timeoutMinutes` in job config. Default is 30; increase if needed (but avoid very long jobs).

**Q: How do I debug Event Hubs messages?**  
A: Call `/messages/consume?consumerGroup=debug&maxMessages=10` to get recent events.

---

## Key Contacts

- **Lead Developer:** [Name] — Architecture, design decisions
- **DevOps:** [Name] — Database, Azure infrastructure, secrets
- **QA Lead:** [Name] — Testing strategies, automation
- **Product Owner:** [Name] — Features, job scheduling requirements

---

**Last Updated:** April 2, 2026  
**Version:** 1.0
