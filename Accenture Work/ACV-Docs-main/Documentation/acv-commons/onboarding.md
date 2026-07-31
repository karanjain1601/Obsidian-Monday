# Developer Onboarding Guide — ACV Commons Library

## Prerequisites

Before working with acv-commons, ensure you have:

### Required Software

| Software | Version | Purpose | Installation |
|----------|---------|---------|---|
| Java JDK | 21 (LTS) | Language runtime | [eclipse-temurin](https://adoptium.net/) or OpenJDK |
| Maven | 3.9.0+ | Build tool | `brew install maven` (Mac) or [Maven downloads](https://maven.apache.org/download.cgi) |
| Git | 2.35+ | Version control | `brew install git` (Mac) or [Git downloads](https://git-scm.com/) |
| Docker | 20.10+ | Container runtime (optional, for local testing) | [Docker Desktop](https://www.docker.com/products/docker-desktop) |
| VS Code or IDE | Latest | Code editor | [VS Code](https://code.visualstudio.com/) or IntelliJ IDEA |

### IDE Extensions (Recommended)

- **VS Code:**
  - Extension Pack for Java
  - Spring Boot Extension Pack
  - Maven for Java
  - GitLens
  - REST Client (for API testing)

- **IntelliJ IDEA:**
  - Spring Boot plugin (built-in)
  - Maven plugin (built-in)
  - REST Client Console

### Access & Credentials

1. **GitHub Access** — Clone the ACV repository
   ```
   git clone https://github.com/your-org/eai-3540813-acv-commons.git
   ```

2. **Maven Settings** — Copy `cicd-maven-settings.xml` to local Maven
   ```
   cp eai-3540813-acv-commons/cicd-maven-settings.xml ~/.m2/settings.xml
   ```

3. **Azure Credentials** (if running locally with Azure Event Hub)
   ```
   az login
   az account set --subscription <SUBSCRIPTION_ID>
   ```

---

## Local Environment Setup

### Step 1: Clone the Repository

```bash
# Clone acv-commons
git clone https://github.com/your-org/eai-3540813-acv-commons.git
cd eai-3540813-acv-commons

# Or clone the entire multi-service workspace
git clone https://github.com/your-org/eai-3540813.git
cd eai-3540813
```

### Step 2: Configure Maven

```bash
# Verify Maven is installed
mvn --version

# Output should show Maven 3.9.0+ and Java 21

# Update Maven settings to use correct artifact repository
mkdir -p ~/.m2
cp cicd-maven-settings.xml ~/.m2/settings.xml

# Edit ~/.m2/settings.xml with your artifact repository credentials
```

### Step 3: Verify Build Environment

```bash
# Navigate to acv-commons directory
cd eai-3540813-acv-commons

# Run Maven build without executing tests
mvn clean package -DskipTests

# This should complete successfully and create:
# target/eai-3540813-acv-commons-1.1.5.jar
```

### Step 4: Set Environment Variables

```bash
# For local development with mocked external services
export SPRING_PROFILES_ACTIVE=local
export OKTA_ENABLED=false
export EVENTHUB_CONNECTION_STRING=DefaultEndpointProtocol=sb://localhost:9092...
export CACHE_TYPE=in-memory

# Optional: Enable debug logging
export LOG_LEVEL=DEBUG
```

### Step 5: IDE Setup

**For IntelliJ IDEA:**
1. Open project: File → Open → select acv-commons directory
2. Maven should auto-detect pom.xml and download dependencies
3. Right-click project → Maven → Generate Sources and Update Folders

**For VS Code:**
1. Open workspace: File → Open Folder → select acv-commons directory
2. Install recommended extensions when prompted
3. Run command: `Java: Reload Window`

---

## Build & Run Locally

### Build the Library

```bash
# Clean build (removes previous artifacts)
mvn clean package

# Build with tests
mvn clean package

# Build and skip tests (faster)
mvn clean package -DskipTests

# Build specific module
mvn clean package -pl commons -DskipTests
```

### Run Tests

```bash
# Run all tests
mvn test

# Run tests with coverage
mvn clean test jacoco:report

# Coverage report: target/site/jacoco/index.html

# Run specific test class
mvn test -Dtest=CacheServiceImplTest

# Run specific test method
mvn test -Dtest=CacheServiceImplTest#testGetFromCache

# Run tests in debug mode (break at breakpoints)
mvn test -X
```

### Run with Maven Spring Boot Plugin

If acv-commons were a standalone service (currently it's a library):

```bash
# Start application locally
mvn spring-boot:run

# With custom profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"

# The service would be available at http://localhost:8080
```

---

## Common Development Tasks

### Task 1: Add New Utility Function

**Scenario:** Need a new serialization utility for XML

**Steps:**

1. Create new class in `src/main/java/com/fedex/acv/commons/utils/XmlUtils.java`:

```java
package com.fedex.acv.commons.utils;

import java.io.StringWriter;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamSource;
import javax.xml.transform.stream.StreamResult;

public class XmlUtils {
    public static String formatXml(String xml) {
        try {
            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            transformer.setOutputProperty("indent", "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
            
            Source source = new StreamSource(new java.io.StringReader(xml));
            StreamResult result = new StreamResult(new StringWriter());
            transformer.transform(source, result);
            return result.getWriter().toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
```

2. Add unit test in `src/test/java/.../utils/XmlUtilsTest.java`:

```java
@Test
public void testFormatXml() {
    String xml = "<root><child>value</child></root>";
    String formatted = XmlUtils.formatXml(xml);
    assertTrue(formatted.contains("<?xml"));
    assertTrue(formatted.contains("\n"));
}
```

3. Build and test:

```bash
mvn clean test -Dtest=XmlUtilsTest
```

### Task 2: Add Support for New Service Client

**Scenario:** Need HTTP client for new service "survey-service"

**Steps:**

1. Add service constant in `constants/Constants.java`:

```java
public interface ServiceProvider {
    String SURVEY_SERVICE = "survey-service";
    // ... existing constants
}
```

2. Create configuration in `application-dev.yml`:

```yaml
http:
  clients:
    survey-service:
      baseUrl: http://survey-service:8080
      credentialsType: OAUTH2
      retryTemplate: defaultRetryTemplate
      timeout: 30000
```

3. Create client class in `http/clients/SurveyServiceClient.java`:

```java
public class SurveyServiceClient extends AbstractHttpClient {
    public SurveyServiceClient(ServiceProvidersProperties httpClientsConfiguration,
                              CacheService cacheService,
                              RestClient restClient,
                              RetryTemplate defaultRetryTemplate) {
        super(Constants.ServiceProvider.SURVEY_SERVICE, 
              httpClientsConfiguration, 
              cacheService, 
              restClient, 
              defaultRetryTemplate);
    }
}
```

4. Register bean in `http/configurations/HttpServiceClientsBeanConfiguration.java`:

```java
@Bean
public SurveyServiceClient surveyServiceClient() {
    return new SurveyServiceClient(
        httpClientsConfiguration,
        cacheService,
        restClient,
        defaultRetryTemplate);
}
```

5. Add unit test and build:

```bash
mvn clean test
```

### Task 3: Debug HTTP Client Calls

**Scenario:** HTTP call to acv-service is failing

**Steps:**

1. Enable DEBUG logging:

```bash
# Via environment variable
export LOG_LEVEL=DEBUG

# Or via application.yml
logging:
  level:
    com.fedex.acv.commons.http.clients: DEBUG
    com.fedex.acv.commons.filters: DEBUG
```

2. Add breakpoint in `AbstractHttpClient.executeRequest()`:

```java
// Click line number to toggle breakpoint
URI uri = buildUri(getBaseUrl(), endPoint, uriVariables, queryParams);
log.info("Executing Http request  [{} : {} --> {}, Retries enabled: {}]", 
    this.serviceName, method, uri, effectiveRetry.isRetryEnabled());
// <- Breakpoint here
```

3. Run tests with debugging:

```bash
mvn test -Dtest=AcvServiceClientTest -X
```

4. Inspect variables in IDE debugger:
   - `uri` — Request URL
   - `headers` — HTTP headers
   - `responseEntity` — Response status/body

### Task 4: Test With Mock External Services

**Scenario:** Running locally without connecting to real Okta/Event Hub

**Steps:**

1. Create `application-mock.yml`:

```yaml
spring:
  profiles:
    active: mock

okta:
  enabled: false

mock:
  flag: true

cache:
  type: in-memory
```

2. Add mock service provider in test configuration:

```yaml
http:
  clients:
    mock-service:
      baseUrl: http://localhost:8090/mock
      credentialsType: NONE
```

3. Run tests with mock profile:

```bash
mvn test -Dspring.profiles.active=mock -DskipTests
```

---

## Code Conventions

### Naming Conventions

**Classes & Interfaces:**
```java
// Concrete implementations: ClassName
public class CacheServiceImpl implements CacheService {}
public class LoggingFilter extends OncePerRequestFilter {}

// Abstract classes: AbstractClassName
public abstract class AbstractHttpClient {}

// Configuration: ApplicationXxxConfiguration or XxxConfiguration
public class ApplicationBasicConfiguration {}
public class CacheConfig {}

// Utilities: XxxUtils or Xxx (static methods only)
public class LogUtils {}
public class SanityUtils {}
```

**Methods:**
```java
// Imperative verbs: get, set, create, build, update, delete, process
public void cacheToken(String serviceName, String token) {}
public String getCachedToken(String serviceName) {}
public void evictAll(String cacheName) {}
```

**Constants:**
```java
// UPPER_SNAKE_CASE for constants
public static final String DEFAULT_TIMEOUT = "30000";
public static final String TRANSACTION_ID_HEADER = "x-transaction-id";
```

### Import Organization

```java
// Order: Java, javax, org.springframework, com.fedex, everything else
import java.util.*;
import java.io.*;
import javax.servlet.*;
import org.springframework.stereotype.*;
import org.springframework.web.client.*;
import com.fedex.acv.commons.utils.*;
import lombok.extern.slf4j.*;
```

### Logging

```java
// Use SLF4J with Lombok
@Slf4j
public class MyClass {
    public void myMethod() {
        log.debug("Debug message with var: {}", value);
        log.info("Info message");
        log.warn("Warning: {}", warningReason);
        log.error("Error: {}", ex.getMessage(), ex);  // Always include exception
    }
}

// Never use System.out.println()
// Never use printStackTrace()
```

### Comments & Documentation

```java
/**
 * Fetch entity data from Data Service with retry and caching.
 *
 * @param endpointName  the target endpoint (e.g., "user-profile")
 * @param queryParams   the query parameters as key-value pairs
 * @return              list of entities matching the query
 * @throws AcvClientException if the service call fails after retries
 */
public <T> List<T> fetchEntityData(String endpointName, Map<String, Object> queryParams) {
    // Implementation
}

// Inline comments only for non-obvious logic
if (cacheService.get(key) != null) {
    // Check cache first to reduce API calls (tokens cached with TTL matching JWT expiry)
    return cacheService.get(key);
}
```

### Code Format

```java
// Use Lombok annotations to reduce boilerplate
@Slf4j
@Data  // Generates getters, setters, toString, equals, hashCode
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyDto {
    private String name;
    private Integer age;
}

// Records for immutable DTOs
public record Parameter(
    String name,
    Object value,
    Integer sqlType
) {}

// Use var for local type inference (Java 10+)
var cacheService = new CacheServiceImpl(cacheManager);
List<String> cacheNames = cacheService.getCacheKeys();
```

### Branch Strategy

```bash
# Main branch: main (production-ready)
# Feature branches: feature/JIRA-123-description
# Bugfix branches: bugfix/JIRA-456-description
# Release branches: release/1.2.0

# Example workflow:
git checkout -b feature/JIRA-789-add-xml-support
git add src/main/java/com/fedex/acv/commons/utils/XmlUtils.java
git commit -m "feat: add XML utility functions (JIRA-789)"
git push origin feature/JIRA-789-add-xml-support
# Create Pull Request on GitHub
```

### PR Checklist

Before creating a PR:

- [ ] Code follows naming conventions
- [ ] Added unit tests (test coverage > 80%)
- [ ] Added JavaDocs for public methods
- [ ] No debug `System.out.println()` statements
- [ ] Passes all tests locally: `mvn clean test`
- [ ] Builds successfully: `mvn clean package -DskipTests`
- [ ] Updated CHANGELOG.md if changing public API
- [ ] Added log masking for PII (if handling sensitive data)

---

## Architecture Walkthrough

### Request Flow: Step-by-Step

```
1. Consumer Service calls AcvServiceClient.get()
   ↓
2. AbstractHttpClient.executeRequest() intercepted
   ↓
3. Check cache for token → Hit / Miss?
   ├─ Hit: Use cached token
   └─ Miss: Fetch from Okta OAuth2
   ↓
4. Build HTTP request with headers and token
   ↓
5. RestClient sends request (with request interceptor)
   ↓
6. Response received
   ↓
7. LoggingFilter logs request/response (masked)
   ↓
8. Return response body to consumer
```

### Package Learning Path

**Beginner → Advanced:**

1. **Start with:** `constants/` (immutable definitions)
2. **Then:** `utils/` (utility functions)
3. **Then:** `cache/` (caching abstraction)
4. **Then:** `http/clients/AbstractHttpClient` (core HTTP logic)
5. **Then:** `config/` (Spring configuration)
6. **Then:** `eventhub/` (advanced messaging)
7. **Then:** `filters/` (cross-cutting concerns)

---

## FAQ & Common Issues

### Q1: Build fails with "Maven executable not found"

**Solution:**
```bash
# Install Maven
brew install maven

# Verify
mvn --version
```

### Q2: Tests fail with "No AADHAAR_OTP provider found"

**Solution:** This is expected when Okta is disabled. Add to test:
```yaml
okta:
  enabled: false
```

### Q3: "Project not found in Maven repository"

**Solution:** Ensure Maven settings.xml has correct artifact repository credentials
```bash
cat ~/.m2/settings.xml | grep -A 5 "<server>"
```

### Q4: Port 8080 already in use

**Solution:** Change port or kill existing process
```bash
lsof -i :8080
kill -9 <PID>
```

### Q5: Tests timeout on Event Hub operations

**Solution:** Event Hub integration requires Azure credentials or mock setup. Skip in local:
```bash
mvn test -DskipTests=*EventHub*
```

---

## Next Steps

After completing onboarding:

1. **Read HLD.md** — Understand high-level architecture
2. **Read LLD.md** — Deep dive into classes and design patterns
3. **Clone a consumer service** — See how acv-commons is imported and used
4. **Write a test** — Contribute a test for existing functionality
5. **Add a utility** — Create new utility function and test
6. **Review a PR** — Provide code review feedback to teammates

---

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Maven Documentation](https://maven.apache.org/guides/index.html)
- [Azure Event Hubs Documentation](https://docs.microsoft.com/en-us/azure/event-hubs/)
- [Okta OAuth2 Documentation](https://developer.okta.com/docs/guides/implement-oauth-for-okta/)
- [ACV Internal Wiki](https://wiki.acv.internal) (internal link)

---

**Last Updated:** April 2, 2026  
**Version:** 1.0
