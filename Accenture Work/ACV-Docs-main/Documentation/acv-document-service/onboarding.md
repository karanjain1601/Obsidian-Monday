# Developer Onboarding Guide — ACV Document Service

## Prerequisites

Before setting up the ACV Document Service locally, install the following tools:

| Tool | Version | Purpose |
|------|---------|---------|
| **Java Development Kit (JDK)** | 21 or higher | Compile and run Java code |
| **Apache Maven** | 3.9+ | Build and dependency management |
| **Git** | 2.30+ | Version control |
| **Docker** (optional) | 24+ | Run Azure Storage emulator or services locally |
| **IDE** | IntelliJ IDEA / VS Code | Code editing and debugging |
| **Azure CLI** (optional) | Latest | Manage Azure resources |
| **Postman** (optional) | Latest | Test REST endpoints |

---

## Environment Setup

### Step 1: Clone Repository

```bash
cd c:\Users\6687869\Code\ACV
git clone <repo-url> eai-3540813-acv-document-service
cd eai-3540813-acv-document-service
```

### Step 2: Verify Java & Maven Installation

```bash
java -version          # Should output Java 21+
mvn -version           # Should output Maven 3.9+
```

### Step 3: Configure Local Properties

Create or update `src/main/resources/application-local.yml`:

```yaml
spring:
  application:
    name: acv-document-service
  profiles:
    active: local
  thymeleaf:
    prefix: classpath:/templates/
    suffix: .html
    mode: HTML
    cache: false

document:
  service:
    azure:
      storage:
        connectionString: "DefaultEndpointsProtocol=https;AccountName=devstorageaccount;AccountKey=xxx;EndpointSuffix=core.windows.net"
        containerName: documents
    data-api-url: "http://localhost:8181"
    scheduler-url: "http://localhost:8182"

oauth2:
  okta:
    tenant-url: "https://dev-xxx.okta.com"
    client-id: "${OKTA_CLIENT_ID}"
    client-secret: "${OKTA_CLIENT_SECRET}"

logging:
  level:
    com.acv: DEBUG
    org.springframework: INFO
```

### Step 4: Set Environment Variables

```bash
# Okta OAuth2 credentials (from Azure Key Vault or local Okta tenant)
set OKTA_CLIENT_ID=<your-client-id>
set OKTA_CLIENT_SECRET=<your-client-secret>

# Azure Storage (use local emulator or dev account)
set AZURE_STORAGE_CONNECTION_STRING=<connection-string>
```

---

## Build & Run Locally

### Build the Service

```bash
# Full build with tests
mvn clean package

# Build skipping tests (faster)
mvn clean package -DskipTests

# Build with specific profile
mvn clean package -Dspring.profiles.active=local
```

### Run the Service

#### Option 1: Maven Spring Boot Plugin

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
```

#### Option 2: Run JAR Directly

```bash
java -jar target/acv-document-service-1.1.4.jar --spring.profiles.active=local
```

#### Option 3: Docker

```bash
# Build Docker image
docker build -t acv-document-service:local .

# Run container
docker run -e OKTA_CLIENT_ID=$OKTA_CLIENT_ID \
           -e OKTA_CLIENT_SECRET=$OKTA_CLIENT_SECRET \
           -e AZURE_STORAGE_CONNECTION_STRING=$AZURE_STORAGE_CONNECTION_STRING \
           -p 8080:8080 \
           acv-document-service:local
```

**Expected Output:**
```
2024-04-02 10:30:00.123  INFO 12345 --- [main] c.acv.document.Application : Started Application in 5.234 seconds
```

Service is now available at `http://localhost:8080`

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

### All Tests with Coverage Report

```bash
mvn clean verify jacoco:report
# Open target/site/jacoco/index.html in browser
```

### Run Specific Test Class

```bash
mvn test -Dtest=DocumentManagementServiceTest
```

### Run Specific Test Method

```bash
mvn test -Dtest=DocumentManagementServiceTest#testGenerateDocument
```

---

## Debugging Tips

### Attach Remote Debugger

1. Start service with debug flag:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
   ```

2. In IDE, set breakpoint and attach debugger:
   - **IntelliJ IDEA:** Run → Edit Configurations → + Remote JVM Debug → connect to localhost:5005
   - **VS Code:** Install Debugger for Java, create launch config with port 5005

### Check Application Logs

```bash
# View logs in real-time (if running via Maven)
tail -f target/logs/application.log

# Search for errors
grep ERROR target/logs/application.log

# Track request flow
grep "documentId\|transactionId" target/logs/application.log
```

### Validate Service Health

```bash
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP",...}

curl http://localhost:8080/actuator/metrics
# Lists available metrics
```

### Test API Endpoint

```bash
# Generate document (requires valid JWT token)
curl -X POST http://localhost:8080/api/v1/US/documents/generate \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "documentCode": "COMPLIANCE_REPORT",
    "localeCode": "en_US",
    "transactionId": "550e8400-e29b-41d4-a716-446655440000",
    "data": {"applicantName": "John Doe", "complianceStatus": "PASSED"}
  }'
```

---

## Common Development Tasks

### Add a New Template

1. **Create template HTML file:**
   ```bash
   # Go to src/main/resources/templates/
   cd src/main/resources/templates
   mkdir -p compliance
   touch compliance/compliance_report.html
   ```

2. **Write template (Thymeleaf syntax):**
   ```html
   <html>
     <head><title>Compliance Report</title></head>
     <body>
       <h1 th:text="${applicantName}"></h1>
       <p>Status: <span th:text="${complianceStatus}"></span></p>
     </body>
   </html>
   ```

3. **Register in `TemplateRegistry` or load via database:**
   ```java
   @Bean
   public TemplateRegistry templateRegistry() {
       return new TemplateRegistry()
           .register("COMPLIANCE_REPORT", "compliance/compliance_report.html");
   }
   ```

4. **Test endpoint:**
   ```bash
   curl -X POST http://localhost:8080/api/v1/US/documents/generate -H ...
   ```

### Add a New Locale

1. **Create locale variant of template:**
   ```bash
   cp src/main/resources/templates/compliance/compliance_report.html \
      src/main/resources/templates/compliance/compliance_report_de_DE.html
   ```

2. **Translate content in template:**
   ```html
   <h1 th:text="${applicantName}"></h1>
   <p>Status (German): <span th:text="${complianceStatus}"></span></p>
   ```

3. **Update `LocaleResolver` logic in `TemplateManagementService`:**
   ```java
   private String resolveTemplatePath(String documentCode, String locale) {
       // Checks: locale_specific → country_default → en_US
       if (templateExists(documentCode + "_" + locale)) return ...;
       if (templateExists(documentCode + "_" + locale.split("_")[0])) return ...;
       return documentCode; // default
   }
   ```

### Add Logging to Service

Use SLF4J (already integrated):

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class MyService {
    private static final Logger log = LoggerFactory.getLogger(MyService.class);
    
    public void myMethod() {
        log.debug("Processing document: {}", documentId);
        log.info("Document generated successfully");
        log.warn("Template version outdated for locale: {}", locale);
        log.error("Failed to upload to Blob Storage", exception);
    }
}
```

### Debug Template Rendering Issue

1. **Enable Thymeleaf debug:**
   ```yaml
   # application-local.yml
   spring:
     thymeleaf:
       mode: HTML
       cache: false  # Disable for quick reload
   ```

2. **Add debug logging in TemplateContextBuilder:**
   ```java
   log.debug("Template context: {}", context.getVariables());
   ```

3. **Inspect generated HTML before PDF conversion:**
   ```java
   String html = thymeleafEngine.process(template, context);
   log.debug("Generated HTML:\n{}", html);
   ```

---

## Code Conventions

### Naming Standards

- **Classes:** PascalCase (e.g., `DocumentManagementService`)
- **Methods:** camelCase (e.g., `generateDocument()`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `DEFAULT_LOCALE = "en_US"`)
- **Variables:** camelCase (e.g., `documentId`)
- **Packages:** lowercase, reverse domain (e.g., `com.acv.document.service`)

### Code Style

- **Indentation:** 4 spaces (configured in pom.xml via `google-java-format`)
- **Line Length:** 120 characters max
- **Imports:** No wildcard imports `import com.acv.*`; explicit only
- **Comments:** Javadoc for public methods, inline comments for complex logic

### Logging

- **INFO:** High-level flow events (service startup, document generated)
- **DEBUG:** Low-level tracing (entering method, variable values)
- **WARN:** Recoverable issues (missing template fallback to default)
- **ERROR:** Unrecoverable issues with exception stack trace

---

## Architecture Walkthrough for Newcomers

### Request Flow Path (5 min)

1. Start: `DocumentManagementController.generateDocument(request)`
2. Business Logic: `DocumentManagementService.generateDocument(request)`
3. Fetch Data: `DataApiService.fetchTransactionData(transactionId)`
4. Build Context: `TemplateContextBuilder.buildContext(template, data)`
5. Render: Thymeleaf processes template with context → HTML
6. Convert: `PdfConverter.convertHtmlToPdf(html)` → PDF bytes
7. Store: `BlobStorageService.uploadFile(fileName, pdf)`
8. Return: `DocumentResponseDto` with blob URL

### Key Packages (Learning Path)

Start with:
- `dto/` — Understand request/response shapes
- `controller/` — See how REST endpoints call services
- `service/` — Core business logic
- `model/` — Domain entities
- `util/` — Helper functions
- `config/` — Bean wiring and external service configs

---

## FAQ

**Q: How do I test document generation locally without real Azure storage?**  
A: Use Azure Storage Emulator or configure a local dev storage account. Set `AZURE_STORAGE_CONNECTION_STRING` to use emulator: `UseDevelopmentStorage=true`

**Q: How do I add a new endpoint?**  
A: Create a method in a controller with `@PostMapping` or `@GetMapping`, wire service beans via constructor injection, call service logic, return DTO.

**Q: How do I integrate with a new external API?**  
A: Extend `AbstractHttpClient` (from acv-commons), add method for new endpoint, wire in service via `@Autowired`, call from service logic.

**Q: Thymeleaf template not rendering correctly. What do I check?**  
A: (1) Template file path correct? (2) Locale resolved correctly? (3) Context has required variables? (4) HTML syntax valid? Enable debug logging.

**Q: How do I run all services locally for full integration testing?**  
A: Start config-server → data-services → scheduler → document-service in separate terminals. All depend on config-server first.

---

## Key Contacts

- **Lead Developer:** [Name] — Architecture, design decisions
- **DevOps:** [Name] — Deployment, infrastructure, secrets management
- **QA Lead:** [Name] — Testing strategy, automation
- **Product Owner:** [Name] — Features, priorities

---

**Last Updated:** April 2, 2026  
**Version:** 1.0
