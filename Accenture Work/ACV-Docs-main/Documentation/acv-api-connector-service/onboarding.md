# ACV API Connector Service - Developer Onboarding Guide

**Purpose:** Enable new developers to set up, build, run, and contribute to the API Connector Service.

**Scope:** Local development environment setup through first contribution.

---

## 1. Prerequisites

### Required Software

| Tool | Version | Purpose | Download |
|------|---------|---------|----------|
| **Java Development Kit (JDK)** | 21 LTS | Application runtime | [oracle.com/java](https://www.oracle.com/java) |
| **Maven** | 3.9.0+ | Build and dependency management | [maven.apache.org](https://maven.apache.org) |
| **Git** | 2.40+ | Version control | [git-scm.com](https://git-scm.com) |
| **Docker** | 24.0+ | Container runtime (for local testing) | [docker.com](https://www.docker.com) |
| **Docker Compose** | 2.20+ | Multi-container orchestration | Included with Docker Desktop |
| **VS Code or IntelliJ IDEA** | Latest | IDE | [code.visualstudio.com](https://code.visualstudio.com) / [jetbrains.com/idea](https://www.jetbrains.com/idea) |

### IDE Extensions

**IntelliJ IDEA:**
- Spring Boot (built-in)
- Kotlin (built-in)
- REST Client (built-in)

**VS Code:**
- Java Extension Pack
- Spring Boot Extension Pack
- REST Client

### External Accounts

- **Okta Developer Account** — OAuth2 authentication (request from team)
- **GitHub Account** — Git repository access (company GitHub Enterprise)
- **Signzy Account** — OCR provider test credentials (request from team)

---

## 2. Repository Setup

### 2.1 Clone Repository

```bash
# Navigate to workspace
cd ~/Code/ACV

# Clone API Connector Service
git clone https://github.company.com/acv/eai-3540813-api-connector-service.git
cd eai-3540813-api-connector-service

# Verify branch
git branch -a
# Output: main, develop, feature/*, etc.
```

### 2.2 Set Up Git Configuration

```bash
# Configure email and name
git config user.email "your.email@company.com"
git config user.name "Your Name"

# Create/checkout development branch
git checkout develop

# Optional: Set up Git hooks for pre-commit checks
cp .git-hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### 2.3 Verify Maven Installation

```bash
# Check Maven version
mvn --version
# Output: Apache Maven 3.9.x
# Java version: 21.x.x

# Update Maven settings (optional)
cp cicd-maven-settings.xml ~/.m2/settings.xml
```

---

## 3. Environment Setup

### 3.1 Set Environment Variables

Create `.env` file in project root:

```bash
# OAuth2
OKTA_DOMAIN=company.okta.com
OKTA_CLIENT_ID=your_client_id
OKTA_CLIENT_SECRET=your_client_secret

# External Providers
SIGNZY_API_KEY=your_signzy_api_key
SIGNZY_ENDPOINT=https://api.signzy.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=acv_connector_dev
DB_USER=postgres
DB_PASSWORD=your_password

# Cache (Redis)
REDIS_HOST=localhost
REDIS_PORT=6379

# Event Hub (RabbitMQ)
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Config Server
CONFIG_SERVER_URI=http://localhost:8888
CONFIG_SERVER_USER=configuser
CONFIG_SERVER_PASSWORD=configpass

# Logging
LOG_LEVEL=INFO
```

### 3.2 Start Docker Containers

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: acv_connector_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
```

Start services:

```bash
# Start all services in background
docker-compose up -d

# Verify services are running
docker-compose ps
# Output: postgres, redis, rabbitmq (all UP)

# View RabbitMQ Management UI
# http://localhost:15672 (user: guest, pass: guest)
```

---

## 4. Build & Compile

### 4.1 Clean Build

```bash
# Full clean build (downloads dependencies)
mvn clean install -DskipTests

# Output should end with: BUILD SUCCESS

# Verify artifacts
ls target/eai-3540813-api-connector-service-1.1.8.jar
```

### 4.2 Build Profiles

```bash
# Development profile (includes test utils)
mvn clean package -Pdev -DskipTests

# Production profile (excludes test utils)
mvn clean package -Pprod -DskipTests

# Skip long-running tests
mvn clean install -DskipLongRunningTests
```

---

## 5. Running Locally

### 5.1 Start Spring Boot Application

```bash
# Option 1: Using Maven
mvn spring-boot:run

# Option 2: Using compiled JAR
java -jar target/eai-3540813-api-connector-service-1.1.8.jar

# Option 3: Using IDE (IntelliJ: Run Button or Shift+F10)
# VS Code: Debug → Run and Debug → Java (Spring Boot)
```

### 5.2 Verify Application is Running

```bash
# Check health endpoint
curl http://localhost:8082/actuator/health

# Expected response:
# {
#   "status": "UP",
#   "components": {
#     "db": { "status": "UP" },
#     "redis": { "status": "UP" }
#   }
# }

# Check service is discoverable
curl http://localhost:8082/actuator/env | grep spring.application.name
```

### 5.3 Application Logs

```bash
# View logs in real-time
tail -f logs/app.log

# Search for errors
grep ERROR logs/app.log

# Increase log verbosity
export LOG_LEVEL=DEBUG
mvn spring-boot:run
```

---

## 6. Running Tests

### 6.1 Unit Tests

```bash
# Run all unit tests
mvn test

# Run specific test class
mvn test -Dtest=ConnectionsControllerTest

# Run with coverage report
mvn test jacoco:report
# Coverage report: target/site/jacoco/index.html
```

### 6.2 Integration Tests

```bash
# Run integration tests (requires Docker containers)
mvn verify -Pintegration

# Run specific integration test
mvn verify -Dtest=OcrProcessingIntegrationTest

# Integration test markers
# @IntegrationTest annotation marks integration tests
# @DocumentedTestFixture for maintaining test data
```

### 6.3 Contract Tests

```bash
# Run consumer-driven contract tests
mvn test -Pcontract-test

# Verify provider contracts
mvn verify -Dtest=ProviderContractTest

# Contract files location: src/test/resources/contracts/
```

### 6.4 Load Testing

```bash
# Run load tests (30-minute run via Gatling)
mvn gatling:test -Pload-test

# Report: target/gatling/simulation-results/index.html
```

### 6.5 Test Coverage Target

| Layer | Target | Command |
|-------|--------|---------|
| Unit | >80% | `mvn test jacoco:report` |
| Integration | >60% | `mvn verify -Pintegration` |
| Overall | >75% | `mvn verify jacoco:report` |

---

## 7. Debugging

### 7.1 Enable Debug Mode

**Option 1: Maven**
```bash
mvn -Dorg.slf4j.simpleLogger.defaultLogLevel=debug spring-boot:run
```

**Option 2: Environment Variable**
```bash
export DEBUG=true
mvn spring-boot:run
```

**Option 3: application.yml**
```yaml
logging:
  level:
    root: INFO
    com.fedex.acv: DEBUG
    org.springframework.security: DEBUG
```

### 7.2 Attach Debugger

**IntelliJ IDEA:**
1. Set breakpoint (Ctrl+Shift+F8)
2. Edit Configurations → Add New → Spring Boot
3. Click Debug (Shift+F9)

**VS Code:**
1. Install Debugger for Java
2. Create .vscode/launch.json:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Debug",
      "request": "launch",
      "mainClass": "com.fedex.acv.AcvConnectorApplication",
      "projectName": "eai-3540813-api-connector-service"
    }
  ]
}
```
3. Press F5 to start debugging

### 7.3 Common Breakpoints

```java
// Controller entry point (all requests)
// File: com/fedex/acv/connections/controller/ConnectionsController.java
@PostMapping("/fetchData")
public ResponseEntity<AcvApiInterfaceDTO> fetchData(@RequestBody ConnectionRequest req) {
    // BREAKPOINT HERE
    return service.fetchData(req);
}

// Provider API call (test provider integration)
// File: com/fedex/acv/connections/service/impl/ConnectionsManagerServiceImpl.java
private ProviderResponse callProvider(String providerId, Object transformedRequest) {
    // BREAKPOINT HERE - examine transformedRequest
    RestTemplate rt = getRestTemplate(providerId);
    return rt.postForObject(...);
}

// Response transformation (test mapper logic)
// File: com/fedex/acv/connections/mapper/DynamicResponseVariablesMapper.java
public AcvApiInterfaceDTO toAcvResponse(ProviderResponse providerResp) {
    // BREAKPOINT HERE - examine raw provider response
    AcvApiInterfaceDTO dto = new AcvApiInterfaceDTO();
    return dto;
}

// Exception handler (catch errors)
// File: com/fedex/acv/connections/exception/GlobalExceptionHandler.java
@ExceptionHandler(InternalProcessingException.class)
public ResponseEntity<GlobalCustomErrorResponse> handleProviderError() {
    // BREAKPOINT HERE
    return ResponseEntity.status(422).body(...);
}
```

### 7.4 Logging to Debug

```java
// Add LOG statements at key points
private static final Logger LOG = LoggerFactory.getLogger(ConnectionsManagerServiceImpl.class);

public AcvApiInterfaceDTO fetchData(ConnectionRequest req) {
    LOG.debug("Received request: transactionUUID={}, dataType={}", 
        req.getTransactionUUID(), req.getDataType());
    
    ProviderConfiguration config = getProviderConfig(req.getCountryCode());
    LOG.debug("Using provider: {}, endpoint: {}", config.getProviderId(), config.getEndpoint());
    
    Object transformedReq = mapper.toProviderRequest(req, config);
    LOG.debug("Transformed request: {}", transformedReq);
    
    ProviderResponse resp = callProvider(config, transformedReq);
    LOG.debug("Provider response status: {}", resp.getStatus());
    
    return responseMapper.toAcvResponse(resp);
}
```

---

## 8. Testing Async Polling

### 8.1 Local Testing with Stub Provider

Use `ACVStubConfiguration` for mock responses without real provider:

```bash
# Start with stub provider enabled
export PROVIDER_STUB_ENABLED=true
export SIGNZY_STUB_RESPONSE_DELAY_MS=5000
mvn spring-boot:run
```

### 8.2 Test OCR Polling Manually

**Step 1: Start document processing**

```bash
curl -X POST http://localhost:8082/processOcrDocument \
  -H "Content-Type: application/json" \
  -d '{
    "transactionUUID": "test-txn-001",
    "countryCode": "US",
    "dataType": "OCR",
    "opsType": "ASYNC",
    "requestBody": {
      "document": "<BASE64_ENCODED_PDF>",
      "documentType": "DRIVERS_LICENSE"
    }
  }'

# Response (save asyncId):
# { "data": { "asyncId": "async-550e8400" }, "status": "IN_PROGRESS" }
```

**Step 2: Poll for results**

```bash
# Poll every 2 seconds for 30 seconds
for i in {1..15}; do
  echo "Poll attempt $i:"
  curl -X POST http://localhost:8082/fetchOcrData \
    -H "Content-Type: application/json" \
    -d '{
      "transactionUUID": "test-txn-001",
      "countryCode": "US",
      "dataType": "OCR",
      "requestBody": { "asyncId": "async-550e8400" }
    }'
  
  sleep 2
done
```

### 8.3 Test Retry Logic

**Enable artificially failing provider:**

```bash
export PROVIDER_FAIL_COUNT=3
export PROVIDER_FAIL_UNTIL_ATTEMPT=2
mvn spring-boot:run

# First 2 calls fail (should retry), 3rd succeeds
# Expected: Exponential backoff: 1s, 2s, then success
```

---

## 9. Code Conventions

### 9.1 Java Naming

```java
// Classes: PascalCase (nouns)
public class ConnectionsManagerServiceImpl { }

// Methods: camelCase (verbs)
public AcvApiInterfaceDTO fetchData(ConnectionRequest req) { }

// Constants: UPPER_SNAKE_CASE
private static final long POLLING_TIMEOUT_MS = 300000;

// Variables: camelCase (nouns)
String transactionUUID;
int retryCount;
```

### 9.2 Package Structure

```
com.fedex.acv.connections
├── controller.*           — REST endpoints (@RestController)
├── service.*              — Business logic (@Service)
├── service.impl.*         — Implementations
├── mapper.*               — DTO transformations
├── model.*                — DTOs and entities
├── config.*               — Spring configuration (@Configuration)
├── constants.*            — Constants and enums
├── exception.*            — Exceptions and handlers
└── analyzeDocument.*      — Document analysis services
```

### 9.3 Code Style

```java
// Formatting: 4-space indentation
public class Example {
    private String field;
    
    public void method() {
        // Code here
    }
}

// Imports: Group java, javax, org, com packages
import java.util.*;
import javax.inject.*;
import org.springframework.stereotype.*;
import com.fedex.acv.*;

// Annotation style
@RestController
@RequestMapping("/api/v1/connections")
@RequiredArgsConstructor
public class ConnectionsController {
    // ...
}
```

### 9.4 Documentation

```java
/**
 * Fetches data from external provider with automatic retry.
 * 
 * @param request the connection request (required)
 * @return API response with data or error
 * @throws InvalidRequestException if request is invalid
 * @throws InternalProcessingException if provider fails
 */
public AcvApiInterfaceDTO fetchData(ConnectionRequest request) {
    // Implementation
}
```

---

## 10. Adding a New Provider

### Step 1: Define Provider Enum

**File:** `src/main/java/com/fedex/acv/connections/constants/Providers.java`

```java
public enum Providers {
    SIGNZY("signzy", "https://api.signzy.com"),
    CREDIT_BUREAU("creditbureau", "https://api.creditbureau.com"),
    NEW_PROVIDER("newprovider", "https://api.newprovider.com");  // ADD
    
    private final String id;
    private final String endpoint;
    
    Providers(String id, String endpoint) {
        this.id = id;
        this.endpoint = endpoint;
    }
}
```

### Step 2: Add Provider Configuration

**File:** `src/main/resources/application.yml` (or Config Server)

```yaml
connections:
  providers:
    newprovider:
      endpoint: https://api.newprovider.com/v1
      apiKey: ${NEW_PROVIDER_API_KEY}
      timeout: 45
      maxRetries: 3
      requestFormat: JSON
      responseFormat: JSON
```

### Step 3: Create Provider Client Interface

**File:** `src/main/java/com/fedex/acv/connections/service/provider/NewProviderClient.java`

```java
public interface NewProviderClient {
    /**
     * Sends request to new provider API.
     * 
     * @param request provider-specific request
     * @return provider response
     */
    NewProviderResponse sendRequest(NewProviderRequest request);
    
    /**
     * Checks status of async operation.
     * 
     * @param asyncId async operation ID from provider
     * @return current status
     */
    PollingStatus checkAsyncStatus(String asyncId);
}
```

### Step 4: Implement Provider Client

**File:** `src/main/java/com/fedex/acv/connections/service/provider/impl/NewProviderClientImpl.java`

```java
@Service
@RequiredArgsConstructor
public class NewProviderClientImpl implements NewProviderClient {
    private final RestTemplate restTemplate;
    private final ProviderConfigService configService;
    
    @Override
    public NewProviderResponse sendRequest(NewProviderRequest request) {
        ProviderConfiguration config = configService.getConfig(Providers.NEW_PROVIDER);
        String url = config.getEndpoint() + "/v1/process";
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + config.getApiKey());
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<NewProviderRequest> entity = new HttpEntity<>(request, headers);
        ResponseEntity<NewProviderResponse> response = 
            restTemplate.postForEntity(url, entity, NewProviderResponse.class);
        
        return response.getBody();
    }
}
```

### Step 5: Extend Mapper

**File:** `src/main/java/com/fedex/acv/connections/mapper/ProviderAPIEndpointDetailsMapper.java`

```java
@Service
public class ProviderAPIEndpointDetailsMapper {
    
    public Object toProviderRequest(ConnectionRequest acvReq, ProviderConfiguration config) {
        if (Providers.SIGNZY.equals(config.getProviderId())) {
            return toSignzyRequest(acvReq);
        } else if (Providers.NEW_PROVIDER.equals(config.getProviderId())) {
            return toNewProviderRequest(acvReq);  // ADD
        }
        throw new InvalidRequestException("Unknown provider");
    }
    
    private NewProviderRequest toNewProviderRequest(ConnectionRequest acvReq) {
        NewProviderRequest req = new NewProviderRequest();
        req.setDocumentNumber(acvReq.getRequestBody().get("documentNumber"));
        req.setDocumentType(acvReq.getRequestBody().get("documentType"));
        // Map all fields from acvReq to provider-specific format
        return req;
    }
}
```

### Step 6: Add Tests

**File:** `src/test/java/com/fedex/acv/connections/service/NewProviderClientTest.java`

```java
@ExtendWith(MockitoExtension.class)
class NewProviderClientTest {
    
    @Mock
    private RestTemplate restTemplate;
    
    @Mock
    private ProviderConfigService configService;
    
    @InjectMocks
    private NewProviderClientImpl client;
    
    @Test
    void testSendRequest_success() {
        // Setup
        NewProviderRequest req = new NewProviderRequest();
        req.setDocumentNumber("AB123456");
        
        NewProviderResponse response = new NewProviderResponse();
        response.setAsyncId("async-123");
        response.setStatus("PROCESSING");
        
        when(restTemplate.postForEntity(anyString(), any(), eq(NewProviderResponse.class)))
            .thenReturn(ResponseEntity.ok(response));
        
        // Execute
        NewProviderResponse result = client.sendRequest(req);
        
        // Assert
        assertThat(result.getAsyncId()).isEqualTo("async-123");
    }
}
```

---

## 11. Git Workflow & Pull Requests

### 11.1 Branch Naming Convention

```
feature/TASK-123-short-description
  ↓ New feature or enhancement
  
bugfix/BUG-456-short-description
  ↓ Bug fix
  
refactor/REF-789-short-description
  ↓ Code refactoring (no logic change)
  
docs/short-description
  ↓ Documentation updates
```

### 11.2 Creating a Feature Branch

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/TASK-123-add-new-provider

# Make changes
# ...
# Commit frequently
git add .
git commit -m "TASK-123: Add NewProvider client implementation"

# Push to remote
git push origin feature/TASK-123-add-new-provider
```

### 11.3 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Branch name follows convention
- [ ] All unit tests pass (`mvn test`)
- [ ] Integration tests pass (`mvn verify -Pintegration`)
- [ ] Code coverage maintained (>75%)
- [ ] Code style consistent (`mvn checkstyle:check`)
- [ ] No SonarQube violations (`mvn sonar:sonar`)
- [ ] Documentation updated (README, javadoc)
- [ ] Commit messages are clear and atomic
- [ ] No unrelated changes included

### 11.4 PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## Related Issue
Fixes #TASK-123

## How to Test
Steps to verify the changes work correctly.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
```

---

## 12. Troubleshooting

### Issue: "Cannot connect to database"

```bash
# Check if PostgreSQL is running
docker-compose ps | grep postgres
# Expected: postgres UP

# If not running:
docker-compose up -d postgres

# Check database credentials in .env
# Default: DB_HOST=localhost, DB_USER=postgres, DB_PASSWORD=dev_password

# Verify connection
psql -h localhost -U postgres -d acv_connector_dev
```

### Issue: "ClassNotFoundException: RestTemplate"

```bash
# Spring dependencies not loaded - rebuild
mvn clean install

# If still failing, check pom.xml has spring-boot-starter-web dependency
grep -A 2 "spring-boot-starter-web" pom.xml
```

### Issue: "OAuth2 token invalid"

```bash
# Check Okta credentials in .env
echo $OKTA_CLIENT_ID
echo $OKTA_CLIENT_SECRET

# Regenerate token:
# 1. Visit https://company.okta.com/
# 2. Admin → API → Create Token
# 3. Update .env with new credentials
```

### Issue: "Async polling timeout"

```bash
# Check Redis is running
docker-compose ps | grep redis

# If timeout too short, increase in application.yml:
connections:
  polling:
    maxWaitMinutes: 30  # Increase from default 10

# Check provider response time
export LOG_LEVEL=DEBUG
mvn spring-boot:run
# Look for "Provider response time" in logs
```

### Issue: "Provider API returns 401 Unauthorized"

```bash
# Check API key in configuration
cat .env | grep PROVIDER_API_KEY

# Verify provider credentials with team
# Request new API key if expired

# Test provider endpoint manually
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.provider.com/v1/health
```

---

## 13. Key Resources

### Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview, quick start |
| [HLD.md](HLD.md) | Architecture, design decisions, system flows |
| [LLD.md](LLD.md) | Code organization, class details, design patterns |
| [services.md](services.md) | REST API contracts, examples, error codes |
| [code-mapping.md](code-mapping.md) | Class inventory, dependency graphs |
| [glossary.md](glossary.md) | Terminology, acronyms, configurations |

### External Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security OAuth2](https://spring.io/projects/spring-security/oauth2)
- [Maven Documentation](https://maven.apache.org/guides/)
- [Docker Documentation](https://docs.docker.com)
- [Okta Developer Documentation](https://developer.okta.com)

### Internal Resources

- **Team Slack:** #acv-platform
- **Wiki:** https://confluence.company.com/acv
- **Issue Tracker:** https://jira.company.com/acv
- **CI/CD Pipeline:** https://jenkins.company.com/acv

---

## 14. First Contribution Checklist

Complete these steps to make your first contribution:

1. ✅ Set up environment (Java 21, Maven, Docker)
2. ✅ Clone repository and create branch
3. ✅ Run existing tests (`mvn test`)
4. ✅ Start application locally (`mvn spring-boot:run`)
5. ✅ Make a small documentation fix or typo correction
6. ✅ Commit, push, and create PR
7. ✅ Address review feedback
8. ✅ Merge to `develop` branch

---

## Cross-References

- [README.md](README.md) — Quick start
- [HLD.md](HLD.md) — System architecture
- [LLD.md](LLD.md) — Code implementation
- [services.md](services.md) — API contracts
- [code-mapping.md](code-mapping.md) — Class navigation
- [glossary.md](glossary.md) — Terminology

---

**Last Updated:** 2026-04-02  
**Version:** 1.1.8  
**Audience:** New developers, contributors
