# ACV Validation Engine - Business Rules & Data Validation

**Project:** Account Creation Validations - Validation Engine  
**Version:** 1.1.4  
**Ownership:** ACV Platform - Validation Engine Team  
**Purpose:** Execute business logic validation rules against applicant data, government records, and compliance documents

---

## Quick Overview

**ACV Validation Engine** is a specialized, pluggable validation rules engine that evaluates compliance data against configurable business rules. It's the execution layer for all validation logic in the ACV platform — responsible for determining whether applicant data, documents, and credit information meet regulatory and business requirements.

**Key Responsibility:**
- Accept validation requests with source data (applicant-provided) and destination data (government/reference records)
- Route requests to appropriate validators based on validation type (ID matching, legal name validation, entity nature validation, etc.)
- Execute business rule evaluation using fuzzy matching, predefined rules, exact comparison, and range validation
- Return boolean result (PASS/FAIL) with confidence scores
- Support sanitization and normalization of input data before validation

**Business Context:**
When ACV Services processes account opening requests, each compliance document and data field needs validation. Rather than embedding validation logic everywhere, the engine centralizes all business rule implementations, making them configurable and reusable across the platform.

---

## Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Language** | Java LTS | 21+ | Type safety; concurrent processing |
| **Framework** | Spring Boot | 3.3.x | Microservice; dependency injection; REST endpoints |
| **Build Tool** | Maven | 3.9+ | Dependency management and build lifecycle |
| **REST API** | Spring Web | 3.3.x | RESTful endpoint for validation requests |
| **Configuration** | YAML | Custom | Validation type registry and rule definitions |
| **Data Types** | DTOs | Custom | ValidationDto, ValidationConfig, DataObject |
| **Design Pattern** | Factory + Strategy | N/A | Validator selection and pluggable validation logic |
| **Testing** | JUnit 5 + Mockito | Spring Boot 3.3.x | Unit and integration testing |

---

## Project Structure

```
eai-3540813-acv-validation-engine/
├── pom.xml                                      # Maven configuration
├── helm-releases/
│   └── nonprod-dev.yaml                        # Kubernetes Helm chart (dev)
└── src/
    ├── main/
    │   ├── java/com/fedex/acv/validation/engine/
    │   │   ├── controller/
    │   │   │   └── ValidationEngineController.java      # REST API single endpoint
    │   │   │
    │   │   ├── service/
    │   │   │   ├── GenericValidationService.java        # Service interface
    │   │   │   ├── ValidationTypeInterface.java         # Validator interface
    │   │   │   ├── impl/
    │   │   │   │   ├── GenericValidationServiceImpl.java # Validator factory
    │   │   │   │   ├── IdValidationServiceImpl.java
    │   │   │   │   ├── LegalNameValidationServiceImpl.java
    │   │   │   │   ├── EntityNameValidationImpl.java
    │   │   │   │   ├── EntityNatureValidationImpl.java
    │   │   │   │   ├── DateValidationImpl.java
    │   │   │   │   ├── KeyPersonValidationImpl.java
    │   │   │   │   ├── CreditReportValidationImpl.java
    │   │   │   │   ├── AddressValidationImpl.java
    │   │   │   │   ├── TypeRegValidationImpl.java
    │   │   │   │   ├── RecStatusValidationImpl.java
    │   │   │   │   ├── NameValidationImpl.java
    │   │   │   │   ├── OtherValidationImpl.java
    │   │   │   │   └── (more validators...)
    │   │   │   │
    │   │   │   └── impl/primitives/  (or /primitive/validation/)
    │   │   │       ├── StringPrimitiveOperations.java
    │   │   │       ├── NumericPrimitiveValidation.java
    │   │   │       ├── DatePrimitiveValidation.java
    │   │   │       ├── FuzzyStringValidation.java
    │   │   │       ├── PredefinedRuleValidation.java
    │   │   │       ├── ComparisonType.java
    │   │   │       ├── ComparisonTypeFactory.java
    │   │   │       └── (more primitive validators...)
    │   │   │
    │   │   ├── sanitization/
    │   │   │   ├── EntityNatureSanitization.java
    │   │   │   ├── EntityNameSanitization.java
    │   │   │   ├── NameSanitization.java
    │   │   │   ├── DateSanitization.java
    │   │   │   ├── AddressSanitization.java
    │   │   │   ├── CharPositionSanitization.java
    │   │   │   └── (more sanitizers...)
    │   │   │
    │   │   ├── dto/
    │   │   │   ├── ValidationDto.java              # Request payload
    │   │   │   ├── ValidationConfig.java           # Validation rules config
    │   │   │   ├── DataObject.java                 # Source/destination data
    │   │   │   └── AdditionalDataDTO.java
    │   │   │
    │   │   ├── factory/
    │   │   │   ├── ValidationFactory.java
    │   │   │   └── ComparisonTypeFactory.java
    │   │   │
    │   │   ├── config/
    │   │   │   ├── CompanyConfigurations.java
    │   │   │   └── AddressConfiguration.java
    │   │   │
    │   │   ├── constants/
    │   │   │   ├── ValidationConstants.java
    │   │   │   └── EntityNames.java
    │   │   │
    │   │   ├── enums/
    │   │   │   ├── StringOperator.java
    │   │   │   ├── NumericOperators.java
    │   │   │   ├── DateOperators.java
    │   │   │   └── CollectionOperators.java
    │   │   │
    │   │   ├── utils/
    │   │   │   └── ValidationEngineUtils.java
    │   │   │
    │   │   └── AcvValidationEngineApplication.java
    │   │
    │   └── resources/
    │       ├── application.yml                     # Default profile
    │       ├── application-dev.yml                 # Development overrides
    │       └── validation-rules.yml                # Validation type registry
    │
    └── test/
        └── java/
            └── com/fedex/acv/validation/engine/
                ├── service/
                │   └── (validator unit tests)
                └── integration/
                    └── (end-to-end validation tests)
```

---

## Quick Start

### Prerequisites

```bash
# Required
- Java 21 LTS or later
- Maven 3.9+

# Optional
- Docker (for PostgreSQL/Redis if calling integration services)
- Postman (for API testing)
```

### Setup Development Environment

#### 1. Clone and Navigate

```bash
cd /path/to/eai-3540813-acv-validation-engine
```

#### 2. Build the Application

```bash
# Clean build
./mvnw clean package -DskipTests

# Or with tests
./mvnw clean package
```

#### 3. Run Locally

```bash
# Development profile
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Server starts on http://localhost:8081 (or configured port)
```

#### 4. Test the Validation Endpoint

```bash
# Single validation request
curl -X POST http://localhost:8081/validate \
  -H "Content-Type: application/json" \
  -d '{
    "transId": "550e8400-e29b-41d4-a716-446655440000",
    "validationType": "ID_VALIDATION",
    "validationData": {
      "source": "JOHN DOE",
      "destination": "JOHN DOE"
    },
    "config": {
      "comparisonType": "EXACT_MATCH",
      "threshold": 0.95
    }
  }'

# Expected Response
{
  "validationResult": true,
  "confidence": 0.99,
  "message": "Validation passed"
}
```

---

## Key Features

### 1. **Pluggable Validator Architecture**

Validation engine uses Factory + Strategy pattern to select and execute validators based on validation type:

```
Validation Request
    ↓
ValidationEngineController (/validate)
    ↓
GenericValidationServiceImpl (Factory)
    ↓
ValidationFactory (Lookup)
    ↓
Specific Validator (Strategy)
    ├── IdValidationServiceImpl
    ├── LegalNameValidationServiceImpl
    ├── EntityNameValidationImpl
    ├── AddressValidationImpl
    └── (11+ more...)
```

### 2. **12+ Built-in Validators**

| Validator | Purpose | Input | Output |
|-----------|---------|-------|--------|
| **IdValidationServiceImpl** | ID document matching | ID from source + ID from govt DB | PASS/FAIL |
| **LegalNameValidationServiceImpl** | Business legal name validation | Company name + govt registry name | PASS/FAIL |
| **EntityNameValidationImpl** | Entity name matching with sanitization | Name 1 + Name 2 | PASS/FAIL |
| **EntityNatureValidationImpl** | Business nature/type validation | Nature code + predefined rules | PASS/FAIL |
| **DateValidationImpl** | Date range and format validation | Date value + min/max range | PASS/FAIL |
| **KeyPersonValidationImpl** | Key personnel validation | Person name + govt records | PASS/FAIL |
| **CreditReportValidationImpl** | Credit bureau data validation | Credit score + thresholds | PASS/FAIL |
| **AddressValidationImpl** | Address format/postal validation | Address string + postal db | PASS/FAIL |
| **TypeRegValidationImpl** | Type registration validation | Registration type + rules | PASS/FAIL |
| **RecStatusValidationImpl** | Record status validation | Status code + allowed values | PASS/FAIL |
| **NameValidationImpl** | Generic name matching | Any name fields | PASS/FAIL |
| **OtherValidationImpl** | Catch-all for custom rules | Varies | PASS/FAIL |

### 3. **Primitive Validation Operations**

Core validation primitives used by all validators:

- **Fuzzy String Matching** — Levenshtein distance for approximate name matching
- **Predefined Rule Validation** — Evaluate against whitelist/blacklist rules
- **Exact Comparison** — Case-sensitive or case-insensitive exact match
- **Numeric Operators** — GT, LT, GTE, LTE, EQUALS, IN_RANGE
- **Date Validation** — Date range, expiration, format validation
- **Array Inclusion/Exclusion** — Check if value in list or not in list

### 4. **Data Sanitization Layer**

Before validation, data is normalized via sanitizers:

```
Raw Input Data
    ↓
EntityNameSanitization (remove special chars)
    ↓
CharPositionSanitization (normalize spaces)
    ↓
Trimmed, lowercased, normalized
    ↓
Validation Engine
```

### 5. **Configuration-Driven Validation Rules**

Validation thresholds and rules loaded from YAML configuration:

```yaml
validation-types:
  ID_VALIDATION:
    threshold: 0.95
    comparisonType: FUZZY_MATCH
    operators: [LEV_DISTANCE, PHONETIC_MATCH]
  
  LEGAL_NAME_VALIDATION:
    threshold: 0.90
    comparisonType: FUZZY_MATCH
    maxFuzzyDistance: 2
```

---

## Integration with ACV Services

The validation engine is called from **ACV Services** `RecordValidationServiceImpl`:

```
ACV Services Request
    ↓
StageValidationServiceImpl (multi-stage orchestration)
    ↓
RecordValidationServiceImpl (per-record validation)
    ↓
ValidationEngineClient (HTTP call or in-process)
    ↓
Validation Engine (/validate endpoint)
    ↓
Specific Validator executes
    ↓
boolean result + confidence
    ↓
RecordValidationResponse (saved to ACV Services DB)
```

**Request Flow:**
1. ACV Services submits `ValidationRequest` with source/destination data
2. Validation Engine looks up validator type from factory
3. Validator executes business rule comparison
4. Returns `boolean` result (PASS/FAIL) with confidence score
5. ACV Services persists result to `ValidationRequestEntity` and `RecordDetailsEntity`

---

## API Reference

### Single Endpoint

```
POST /validate
```

**Request Body:**

```json
{
  "transId": "UUID",                              // Transaction ID
  "validationType": "ID_VALIDATION",              // Validator type
  "validationData": {
    "source": "JOHN DOE",                         // Applicant data
    "destination": "JOHN DOE"                     // Reference data
  },
  "config": {
    "comparisonType": "FUZZY_MATCH",
    "threshold": 0.95,
    "maxFuzzyDistance": 2,
    "dataType": "STRING",
    "predefinedValue": null
  }
}
```

**Response (200 OK):**

```json
{
  "validationResult": true,
  "confidence": 0.99,
  "message": "Validation passed",
  "details": {
    "matchedFields": ["firstName", "lastName"],
    "fuzzyDistance": 0,
    "appliedRule": "EXACT_MATCH"
  }
}
```

**Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | Validation completed (result true or false) |
| 400 | Invalid request format or missing required fields |
| 500 | Validation engine error |

---

## Running Tests

```bash
# All tests
./mvnw test

# Specific validator test
./mvnw test -Dtest=IdValidationServiceImplTest

# Generate coverage report
./mvnw clean test jacoco:report
# Open: target/site/jacoco/index.html
```

---

## Configuration Properties Reference

### application-dev.yml

```yaml
spring:
  application:
    name: eai-3540813-acv-validation-engine
    version: 1.1.4
  
  server:
    port: 8081

logging:
  level:
    ROOT: INFO
    com.fedex.acv.validation.engine: DEBUG

# Validation engine specific
validation-engine:
  fuzzy-match:
    enabled: true
    threshold: 0.85
  
  predefined-rules:
    cache-rules: true
    rule-source: DATABASE
```

---

## Deployment

### Docker Build

```bash
./mvnw clean package -DskipTests
docker build -t acv-validation-engine:1.1.4 .
docker tag acv-validation-engine:1.1.4 myregistry.azurecr.io/acv-validation-engine:latest
docker push myregistry.azurecr.io/acv-validation-engine:latest
```

### Kubernetes Deployment

```bash
helm install acv-validation-engine helm-releases/nonprod-dev.yaml
```

---

## Get Help

| Question | Resource |
|----------|----------|
| API contract details | [services.md](services.md) |
| Architecture & design | [HLD.md](HLD.md) |
| Code structure | [code-mapping.md](code-mapping.md) |
| Class implementation | [LLD.md](LLD.md) |
| Terminology | [glossary.md](glossary.md) |
| Developer setup | [onboarding.md](onboarding.md) |

---

## Documentation Map

```
README.md (you are here)
├── HLD.md ————— Architecture, components, validator selection
├── LLD.md ————— Code structure, class details, validation flow
├── services.md ——— REST API contracts and schemas
├── code-mapping.md —— Class inventory, dependencies
├── glossary.md ————— Terminology and acronyms
└── onboarding.md ———— Developer setup guide
```

---

**Last Updated:** 2025-01-30  
**Version:** 1.1.4  
**Status:** Production

For questions or issues, contact the ACV Validation Engine Team.
