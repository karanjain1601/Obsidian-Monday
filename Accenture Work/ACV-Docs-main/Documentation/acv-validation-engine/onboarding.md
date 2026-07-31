# ACV Validation Engine - Developer Onboarding Guide

**Purpose:** Step-by-step guide for new developers to set up local environment, build, run, test, and understand the ACV Validation Engine codebase.

**Target Audience:** Junior engineers, interns, developers new to the project.

---

## 1. Prerequisites & Setup

### 1.1 Required Software

Install these tools on your machine:

| Tool | Version | Download | Purpose |
|------|---------|----------|---------|
| **Java JDK** | 21 LTS+ | [oracle.java.com](https://oracle.java.com) or [openjdk.org](https://openjdk.org) | Compile and run Java code |
| **Maven** | 3.9+ | [maven.apache.org](https://maven.apache.org) | Dependency management and build |
| **Git** | 2.40+ | [git-scm.com](https://git-scm.com) | Version control |
| **VS Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com) | Code editor |
| **Docker** | 20.10+ | [docker.com](https://docker.com) | Container runtime (optional, for running services) |
| **Postman** | Latest | [postman.com](https://postman.com) | API testing (optional) |

### 1.2 Java Setup Verification

```bash
# Check Java installation
java -version
# Expected: openjdk version "21.x.x" ...

# Check Maven installation
mvn -version
# Expected: Apache Maven 3.9.x ...
```

### 1.3 IDE Setup (VS Code)

**Install Extensions:**
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X on Windows, Cmd+Shift+X on Mac)
3. Search and install:
   - **Extension Pack for Java** (Microsoft)
   - **REST Client** (Huachao Mao)
   - **Spring Boot Extension Pack** (Pivotal)
   - **GitLens** (Eric Amodio)

**Configure Java in VS Code:**
```
Ctrl+Shift+P → Java: Configure Runtime
Select JDK 21
```

---

## 2. Repository Access & Cloning

### 2.1 SSH Key Setup (if not already done)

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""

# Display public key (add to GitHub/GitLab)
cat ~/.ssh/id_rsa.pub
```

### 2.2 Clone the Repository

```bash
# Navigate to your workspace
cd ~/Code/ACV

# Clone the validation engine repo
git clone git@github.com:FedEx/<your-org>/eai-3540813-acv-validation-engine.git
cd eai-3540813-acv-validation-engine

# Configure local git (if not already done)
git config user.name "Your Name"
git config user.email "your.email@fedex.com"

# Verify remote
git remote -v
# Expected: origin git@github.com:FedEx/<org>/eai-3540813-acv-validation-engine.git
```

---

## 3. Project Structure Overview

```
eai-3540813-acv-validation-engine/
├── pom.xml                          # Maven configuration
├── mvnw                             # Maven wrapper (Linux/Mac)
├── mvnw.cmd                         # Maven wrapper (Windows)
├── src/
│   ├── main/
│   │   ├── java/com/fedex/acv/validation/engine/
│   │   │   ├── controller/          # HTTP endpoints
│   │   │   ├── service/             # Business logic
│   │   │   ├── dto/                 # Data models
│   │   │   ├── factory/             # Validator factory
│   │   │   ├── sanitization/        # Data cleaning
│   │   │   ├── constants/           # Static constants
│   │   │   └── enums/               # Enum definitions
│   │   │
│   │   └── resources/
│   │       ├── application.yml      # Default config
│   │       └── application-dev.yml  # Dev profile
│   │
│   └── test/
│       └── java/.../                # Unit tests
│
├── helm-releases/
│   └── nonprod-dev.yaml             # Kubernetes config
│
├── Documentation/
│   └── acv-validation-engine/       # Doc files (HLD, LLD, etc.)
│       ├── README.md
│       ├── HLD.md
│       ├── LLD.md
│       ├── services.md
│       └── glossary.md
│
└── README.md                        # Quick start
```

**Key Directories:**
- `src/main/...` — Production code
- `src/test/...` — Unit/integration tests
- `helm-releases/` — Kubernetes deployment config
- `Documentation/` — Detailed technical docs

---

## 4. Build & Compile

### 4.1 Clean Build

```bash
# From repo root
./mvnw clean package -DskipTests

# Expected output:
# ... [INFO] BUILD SUCCESS
# ... Total time: XX.XXXs
```

**What this command does:**
1. `clean` — Removes previous build artifacts (target/)
2. `package` — Compiles source, runs tests, creates JAR
3. `-DskipTests` — Skips test execution (add tests later)

### 4.2 Build with Tests

```bash
./mvnw clean package

# Runs tests; shows results like:
# [INFO] Tests run: 45, Failures: 0, Errors: 0, Skipped: 0
```

### 4.3 Compile Only (No Tests, No Package)

```bash
./mvnw clean compile
```

### 4.4 Troubleshoot Build Failures

**Issue: "Java version mismatch"**
```bash
# Check your Java version
java -version

# Must be 21+. If not, update JAVA_HOME
export JAVA_HOME=/path/to/jdk-21
```

**Issue: "Maven not found"**
```bash
# Install Maven or use Maven wrapper
./mvnw -v  # Uses bundled Maven
```

**Issue: "Dependency download errors"**
```bash
# Maven might be downloading dependencies (first build takes longer)
# Check internet connectivity
# Try: ./mvnw -U (force update all dependencies)
```

---

## 5. Run Application Locally

### 5.1 Start the Service

**Option 1: Using Maven**
```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

**Option 2: Using Java directly (after build)**
```bash
java -jar target/eai-3540813-acv-validation-engine-1.1.4.jar \
  --spring.profiles.active=dev
```

**Option 3: Using VS Code (after Rest Client extension installed)**
1. Open command palette: Ctrl+Shift+P
2. Search: "Spring Boot: Run"
3. Select the option

**Expected startup log output:**
```
... [main] o.s.b.w.embedded.tomcat.TomcatWebServer
... Tomcat initialized with port(s): 8081 (http)
... Started AcvValidationEngineApplication in X.XXX seconds
```

### 5.2 Verify Service is Running

**Using curl:**
```bash
curl -X POST http://localhost:8081/validate \
  -H "Content-Type: application/json" \
  -d '{
    "transId": "test-123",
    "validationType": "ID_VALIDATION",
    "validationData": {
      "source": "JOHN DOE",
      "destination": "JOHN DOE"
    },
    "config": {
      "threshold": 0.95
    }
  }'
```

**Expected response:**
```json
{
  "transId": "test-123",
  "validationResult": true,
  "confidence": 1.0,
  "message": "ID documents match with high confidence"
}
```

**Using Postman:**
1. Create new POST request
2. URL: `http://localhost:8081/validate`
3. Headers: `Content-Type: application/json`
4. Body: (paste JSON from curl example above)
5. Click Send

### 5.3 Stopping the Service

```bash
# In terminal where service is running:
Ctrl+C (Windows, Mac, Linux)
```

---

## 6. Code Structure Walkthrough

### 6.1 Following a Request Through the Code

**Scenario:** User sends `/validate` request with `ID_VALIDATION` type

**Step-by-step code tracer:**

1. **Entry Point:** `ValidationEngineController.java`
   - Receives HTTP POST /validate
   - Deserializes JSON to `ValidationDto`
   - Calls `validationService.validate(dto)`

   ```java
   @PostMapping
   public ResponseEntity<ValidationResponse> validate(@RequestBody ValidationDto dto) {
       // Line 20: service.validate() called here
       ValidationResponse response = validationService.validate(dto);
       return ResponseEntity.ok(response);
   }
   ```

2. **Factory & Orchestration:** `GenericValidationServiceImpl.java`
   - Sanitizes input data
   - Looks up validator by type: `validationFactory.getValidator(ID_VALIDATION)`
   - Routes to appropriate validator

   ```java
   @Override
   public ValidationResponse validate(ValidationDto dto) {
       // Line 40: Factory lookup
       ValidationTypeInterface validator = validationFactory.getValidator(dto.getValidationType());
       // Line 50: Execute validator
       ValidationResponse response = validator.validate(dto);
       return response;
   }
   ```

3. **Specific Validator:** `IdValidationServiceImpl.java`
   - Gets source and destination IDs from request
   - Calls fuzzy matching: `fuzzyValidator.calculateSimilarity(source, dest)`
   - Returns result with confidence

   ```java
   @Override
   public ValidationResponse validate(ValidationDto dto) {
       String source = dto.getValidationData().getSanitizedSource();
       String dest = dto.getValidationData().getSanitizedDestination();
       
       // Line 35: Fuzzy matching
       double confidence = fuzzyValidator.calculateSimilarity(source, dest);
       
       // Line 40: Build response
       return ValidationResponse.builder()
           .validationResult(confidence >= 0.95)
           .confidence(confidence)
           .build();
   }
   ```

4. **Primitive Validation:** `FuzzyStringValidation.java`
   - Calculates Levenshtein distance between strings
   - Converts distance to similarity score
   - Returns confidence (0.0-1.0)

5. **Response:** Back through the call stack to `ValidationEngineController`
   - Serializes `ValidationResponse` to JSON
   - Returns HTTP 200 OK

### 6.2 Key Files to Read First

**Recommended reading order for new developers:**

1. **[README.md](README.md)** (this repo)
   - Project overview
   - Quick start commands
   - High-level purpose

2. **[HLD.md](HLD.md)**
   - Architecture overview
   - 12 validators explained
   - System context diagram

3. **`ValidationEngineController.java`**
   - Entry point
   - Single REST endpoint
   - ~50 lines, easy to understand

4. **`GenericValidationServiceImpl.java`**
   - Factory pattern in action
   - Sanitization pipeline
   - Orchestration flow

5. **`IdValidationServiceImpl.java`**
   - Example validator implementation
   - Shows how to use primitives
   - Mimics all other validators

6. **`FuzzyStringValidation.java`**
   - Most complex algorithm
   - Levenshtein distance
   - Core validation logic

---

## 7. Testing

### 7.1 Run All Tests

```bash
./mvnw test
```

**Output shows test results:**
```
[INFO] Tests run: 45, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: X.XXXs
[INFO] BUILD SUCCESS
```

### 7.2 Run Specific Test Class

```bash
./mvnw test -Dtest=IdValidationServiceImplTest
```

### 7.3 Run with Coverage Report

```bash
./mvnw clean test jacoco:report
# Open report: target/site/jacoco/index.html
```

### 7.4 Example Unit Test Structure

```java
@ExtendWith(MockitoExtension.class)
class IdValidationServiceImplTest {
    
    @Mock
    private FuzzyStringValidation fuzzyValidator;
    
    @InjectMocks
    private IdValidationServiceImpl service;
    
    @Test
    void testIdValidation_ExactMatch() {
        // Arrange (setup)
        when(fuzzyValidator.calculateSimilarity("JOHN", "JOHN"))
            .thenReturn(1.0);
        
        ValidationDto dto = ValidationDto.builder()
            .validationType(ValidationType.ID_VALIDATION)
            .validationData(DataObject.builder()
                .sanitizedSource("john")
                .sanitizedDestination("john")
                .build())
            .config(ValidationConfig.builder().threshold(0.95).build())
            .build();
        
        // Act (execute)
        ValidationResponse response = service.validate(dto);
        
        // Assert (verify)
        assertThat(response.getValidationResult()).isTrue();
        assertThat(response.getConfidence()).isEqualTo(1.0);
    }
}
```

---

## 8. Debugging

### 8.1 Debug in VS Code

1. **Set Breakpoint:**
   - Open `IdValidationServiceImpl.java`
   - Click line number to set breakpoint (red dot appears)

2. **Start Debugging:**
   - Press F5 or Debug → Start Debugging
   - Select "Java" when prompted

3. **Debug Controls:**
   - **Step Over (F10)** — Execute current line
   - **Step Into (F11)** — Enter function
   - **Step Out (Shift+F11)** — Exit function
   - **Continue (F5)** — Resume execution
   - **Stop (Shift+F5)** — Stop debugging

4. **Inspect Variables:**
   - Hover over variable to see value
   - Right-click variable → "Evaluate Expression"

### 8.2 Debug via HTTP Request

**Using REST Client extension in VS Code:**

Create file `test.http`:

```http
### Test ID Validation
POST http://localhost:8081/validate
Content-Type: application/json

{
  "transId": "debug-test-001",
  "validationType": "ID_VALIDATION",
  "validationData": {
    "source": "JOHN DOE",
    "destination": "JOHN DOE"
  },
  "config": {
    "comparisonType": "EXACT_MATCH",
    "threshold": 0.95
  }
}
```

Then click "Send Request" link above the POST line. Response appears in panel below.

### 8.3 Common Issues & Debugging

**Issue: Service won't start**
```
Check logs for error message
Look for "java.net.BindException: Port 8081 already in use"
→ Kill other process on port 8081 or change port in application-dev.yml
```

**Issue: Validation returns FAIL unexpectedly**
```
Add debug log: System.out.println("source: " + source + ", dest: " + dest);
Check if data is being sanitized correctly
Verify config threshold makes sense
```

**Issue: Test failing**
```
Run: ./mvnw test -X (verbose/debug output)
Check mock setup is correct
Verify test data matches expected input format
```

---

## 9. Code Conventions

### 9.1 Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Class** | PascalCase | `IdValidationServiceImpl` |
| **Method** | camelCase, verbs | `validate()`, `calculateSimilarity()` |
| **Variable** | camelCase | `fuzzyDistance`, `minThreshold` |
| **Constant** | UPPER_SNAKE_CASE | `DEFAULT_ID_THRESHOLD`, `MAX_FUZZY_DISTANCE` |
| **Interface** | PascalCase, often suffixed with "Interface" | `ValidationTypeInterface` |
| **Enum** | UPPER_SNAKE_CASE values | `ID_VALIDATION`, `FUZZY_MATCH` |

### 9.2 Code Style

**Use constructor injection over field injection:**

```java
// ✅ GOOD
@Component
public class IdValidationServiceImpl {
    private final FuzzyStringValidation fuzzyValidator;
    
    public IdValidationServiceImpl(FuzzyStringValidation fuzzyValidator) {
        this.fuzzyValidator = fuzzyValidator;
    }
}

// ❌ AVOID
@Component
public class IdValidationServiceImpl {
    @Autowired
    private FuzzyStringValidation fuzzyValidator;
}
```

**Use try-catch for external operations:**

```java
try {
    double score = Double.parseDouble(sourceId);
} catch (NumberFormatException e) {
    LOG.error("Invalid credit score format", e);
    return ValidationResponse.builder()
        .validationResult(false)
        .message("Invalid format")
        .build();
}
```

**Use Lombok to reduce boilerplate:**

```java
@Data  // Generates getters, setters, equals(), hashCode(), toString()
@Builder  // Generates builder pattern
@NoArgsConstructor
@AllArgsConstructor
public class ValidationDto {
    private String transId;
    private ValidationType validationType;
}
```

### 9.3 Logging Standards

```java
@Slf4j  // Lombok annotation: adds LOG field
@Component
public class IdValidationServiceImpl {
    
    @Override
    public ValidationResponse validate(ValidationDto dto) {
        // Log INFO when entering
        LOG.info("ID Validation started: transId={}, source={}, dest={}",
            dto.getTransId(), 
            dto.getValidationData().getSource(),
            dto.getValidationData().getDestination());
        
        try {
            // ... validation logic ...
            
            // Log DEBUG for intermediate results
            LOG.debug("Fuzzy match score: {}", confidence);
            
            // Log INFO when exiting
            LOG.info("ID Validation completed: transId={}, result={}, confidence={}",
                dto.getTransId(),
                response.getValidationResult(),
                response.getConfidence());
            
            return response;
            
        } catch (Exception e) {
            // Log ERROR with stack trace
            LOG.error("ID validation error: transId={}, error={}",
                dto.getTransId(),
                e.getMessage(), e);
            throw new ValidationEngineException("ID validation failed", e);
        }
    }
}
```

---

## 10. Git Workflow

### 10.1 Create Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch (naming convention: feature/brief-description)
git checkout -b feature/add-phone-validation

# Verify branch
git branch -v
```

### 10.2 Make Changes

```bash
# Edit files
vim src/main/java/...

# Check status
git status
# Expected: modified: src/main/java/...

# Stage changes
git add src/main/java/...

# Or stage all changes
git add .

# Commit with descriptive message
git commit -m "Add phone validation validator

- Implement PhoneValidationImpl extending ValidationTypeInterface
- Support multiple phone formats (US, international)
- Add unit tests for phone validator
- Register validator in ValidationFactory"
```

### 10.3 Push & Create Pull Request

```bash
# Push branch to remote
git push origin feature/add-phone-validation

# Go to GitHub/GitLab and create Pull Request (PR)
# - Base branch: main
# - Compare branch: feature/add-phone-validation
# - Add description and request reviewers
```

### 10.4 Code Review & Merge

```bash
# After PR approval:
git checkout main
git pull origin main

# Merge into main
git merge feature/add-phone-validation

# Push to remote
git push origin main

# Delete feature branch
git branch -d feature/add-phone-validation
git push origin --delete feature/add-phone-validation
```

---

## 11. Adding a New Validator

### 11.1 Create New Validator Class

**File:** `src/main/java/com/fedex/acv/validation/engine/service/impl/PhoneValidationImpl.java`

```java
@Component
@Slf4j
public class PhoneValidationImpl implements ValidationTypeInterface {
    
    private final PredefinedRuleValidation ruleValidator;
    
    @Override
    public ValidationResponse validate(ValidationDto dto) {
        try {
            String phoneNumber = dto.getValidationData().getSanitizedSource();
            
            LOG.debug("Phone validation: checking {}", phoneNumber);
            
            // Validate phone format (simple example)
            boolean isValidFormat = phoneNumber.matches("\\d{10}");
            
            return ValidationResponse.builder()
                .validationResult(isValidFormat)
                .confidence(isValidFormat ? 1.0 : 0.0)
                .message(isValidFormat ? "Valid phone format" : "Invalid phone format")
                .build();
                
        } catch (Exception e) {
            LOG.error("Phone validation error", e);
            return ValidationResponse.builder()
                .validationResult(false)
                .message("Internal error: " + e.getMessage())
                .build();
        }
    }
    
    @Override
    public ValidationType getValidationType() {
        return ValidationType.PHONE_VALIDATION;
    }
}
```

### 11.2 Add Enum Value

**File:** `src/main/java/com/fedex/acv/validation/engine/enums/ValidationType.java`

```java
public enum ValidationType {
    ID_VALIDATION,
    // ... existing validators ...
    PHONE_VALIDATION  // ← Add this
}
```

### 11.3 Register in Factory

**File:** `src/main/java/com/fedex/acv/validation/engine/factory/ValidationFactory.java`

```java
@Component
@Slf4j
public class ValidationFactory {
    
    public ValidationFactory(
        IdValidationServiceImpl idValidator,
        // ... existing validators ...
        PhoneValidationImpl phoneValidator  // ← Add this
    ) {
        validators.put(ValidationType.PHONE_VALIDATION, phoneValidator);  // ← Add this
    }
}
```

### 11.4 Write Unit Test

**File:** `src/test/java/com/fedex/acv/validation/engine/service/impl/PhoneValidationImplTest.java`

```java
@ExtendWith(MockitoExtension.class)
class PhoneValidationImplTest {
    
    @InjectMocks
    private PhoneValidationImpl service;
    
    @Test
    void testValidPhone() {
        ValidationDto dto = ValidationDto.builder()
            .validationType(ValidationType.PHONE_VALIDATION)
            .validationData(DataObject.builder()
                .sanitizedSource("5551234567")
                .build())
            .build();
        
        ValidationResponse response = service.validate(dto);
        
        assertThat(response.getValidationResult()).isTrue();
        assertThat(response.getConfidence()).isEqualTo(1.0);
    }
    
    @Test
    void testInvalidPhone() {
        ValidationDto dto = ValidationDto.builder()
            .validationType(ValidationType.PHONE_VALIDATION)
            .validationData(DataObject.builder()
                .sanitizedSource("invalid")
                .build())
            .build();
        
        ValidationResponse response = service.validate(dto);
        
        assertThat(response.getValidationResult()).isFalse();
    }
}
```

### 11.5 Test Your Validator

```bash
# Run the new test
./mvnw test -Dtest=PhoneValidationImplTest

# Run all tests
./mvnw test
```

---

## 12. Documentation

### 12.1 Add Javadoc to New Classes

```java
/**
 * Validates phone numbers against expected format and carrier rules.
 * 
 * Implements fuzzy phone matching for different international formats.
 * Currently supports US 10-digit format and E.164 international format.
 * 
 * @see ValidationTypeInterface
 * @author Your Name
 * @version 1.1.4
 */
@Component
@Slf4j
public class PhoneValidationImpl implements ValidationTypeInterface {
    
    /**
     * Execute phone number validation.
     * 
     * Checks if provided phone number matches expected format and is
     * associated with active carrier.
     * 
     * @param validationDto request with source (provided) and destination (reference)
     * @return response with validation result and confidence score
     * @throws ValidationEngineException if validation fails unexpectedly
     */
    @Override
    public ValidationResponse validate(ValidationDto validationDto) {
        // ...
    }
}
```

### 12.2 Update Documentation Files

**When adding new validator, update:**

1. **[HLD.md](HLD.md#3-major-components)** — Add to validator list
2. **[LLD.md](LLD.md#2-comprehensive-class-inventory)** — Add to class table  
3. **[services.md](services.md#2-validation-type-reference)** — Add API contract
4. **[glossary.md](glossary.md)** — Add terminology if needed

---

## 13. Frequently Asked Questions

**Q: I get "Port 8081 already in use" error**  
A: Another service is using port 8081. Either:
- Kill the process: `lsof -i :8081` → `kill -9 <PID>`
- Or change port in `application-dev.yml`: `spring.server.port: 8082`

**Q: Tests pass locally but fail in CI/CD**  
A: Common causes:
- Different Java versions (ensure CI uses Java 21)
- Missing environment variables
- Tests dependent on external services (mock them in tests)
- File encoding issues (ensure UTF-8)

**Q: How do I add a new field to ValidationConfig?**  
A: 
1. Add field to `ValidationConfig.java` DTO
2. Update `ValidationDto` if needed
3. Update [services.md](services.md) API documentation
4. Update validators that use the new config field
5. Add unit tests for new config field handling

**Q: Can I run multiple validation engines in parallel?**  
A: Yes! The design is stateless:
- No in-memory state shared between requests
- Each validation is independent
- Deploy multiple replicas via Kubernetes
- Load balancer routes requests to available instances

**Q: How do I troubleshoot a validation that returns wrong result?**  
A:
1. Add debug logging to the validator
2. Run with `./mvnw spring-boot:run` to see logs
3. Check sanitization is correct (add log before/after sanitization)
4. Verify config thresholds in request
5. Add breakpoint in validator and debug

**Q: Who do I ask for questions?**  
A: See [README.md](README.md) for team contacts and Slack channels.

---

## 14. Useful Commands Cheat Sheet

```bash
# Build & Run
./mvnw clean package                    # Full build with tests
./mvnw spring-boot:run                  # Start service locally
./mvnw test                             # Run all tests
./mvnw test -Dtest=MyTest              # Run specific test

# Git
git checkout -b feature/description     # Create branch
git add .                               # Stage changes
git commit -m "message"                 # Commit changes
git push origin branch-name             # Push to remote
git pull origin main                    # Fetch latest

# Debugging
java -jar target/*.jar                  # Run built JAR
curl -X POST http://localhost:8081/validate -H "Content-Type: application/json" -d '{...}'
# Or use REST Client extension in VS Code

# Docker (optional)
docker build -t acv-validation-engine:1.1.4 .
docker run -p 8081:8081 acv-validation-engine:1.1.4

# Code Quality
./mvnw clean test jacoco:report        # Generate coverage

# View Logs
tail -f target/logs/*                  # Follow logs if enabled
```

---

## 15. Getting Help

| Question | Where to Ask |
|----------|------------|
| Code review needed | Create PR on GitHub/GitLab |
| Design/architecture question | Slack #acv-platform-dev or email architecture-team |
| Bug report | GitHub Issues or Jira |
| Deployment/ops question | Slack #acv-ops-oncall |
| Business logic question | Product manager or business analyst |
| Documentation improvement | Submit PR or comment in GitHub |

---

## Next Steps

1. ✅ Complete sections 1-5 (setup and first run)
2. 📚 Read the architecture documents:
   - [HLD.md](HLD.md) — System architecture
   - [LLD.md](LLD.md) — Code deep dive
3. 🧪 Run tests and debug a failing test
4. 🏗️ Follow section 11 to implement a new validator
5. 💬 Join team Slack and introduce yourself

---

## Troubleshooting Checklist

Before asking for help, verify:

- [ ] Java 21+ installed and JAVA_HOME set correctly
- [ ] Maven 3.9+ installed and working
- [ ] Repository cloned and main branch up to date
- [ ] `./mvnw clean compile` succeeds
- [ ] Service starts without errors on port 8081
- [ ] `/validate` endpoint responds to test request
- [ ] All tests pass with `./mvnw test`
- [ ] No uncommitted changes in git (`git status` = clean)
- [ ] Latest code pulled from remote

If all checks pass and issue persists, proceed to "Getting Help" section above.

---

**Last Updated:** 2025-01-30  
**Version:** 1.1.4  
**Audience:** New developers, interns, junior engineers
