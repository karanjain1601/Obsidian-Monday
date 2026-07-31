# ACV Services - Core Compliance Validation Platform

**Project:** Account Creation Validations (ACV) - Core Services  
**Version:** 1.1.6  
**Ownership:** ACV Platform Team  
**Purpose:** Orchestrate multi-stage compliance validation for account creation workflows

---

## Quick Overview

**ACV Services** is the central hub of the Account Creation Validations platform. It orchestrates a multi-stage validation pipeline that validates applicants for account opening, integrating with external identity verification providers, government agencies, credit bureaus, and document processing systems.

**Key Responsibility:**
- Receive account opening validation requests from client applications
- Route requests to appropriate validation gate (identity verification, document validation, credit checks, etc.)
- Orchestrate asynchronous validation workflows across multiple external providers
- Manage transaction state and validation history
- Generate compliance documentation
- Trigger batch processing jobs
- Publish events for downstream systems

**Business Context:**
Financial institutions use ACV Services to automate account opening by validating customer identity, verifying compliance documents, checking credit history, and generating required compliance certificates — all through standardized REST APIs.

---

## Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Language** | Java LTS | 21+ | Async virtual threads for parallel validation |
| **Framework** | Spring Boot | 3.3.1 | Microservice orchestration, REST APIs, dependency injection |
| **Build Tool** | Maven | 3.9+ | Dependency management and build lifecycle |
| **Persistence** | PostgreSQL | Latest | Transaction storage, validation history, configuration |
| **Caching** | Redis | Latest | Session tokens, configuration caching, validation state |
| **Authentication** | Okta OAuth2 | 3.0.6 | Bearer token authentication via Okta OIDC |
| **Security** | Spring Security | Spring Boot 3.3.1 | Request authorization, role-based access |
| **Data ORM** | Spring Data JPA | Spring Boot 3.3.1 | Object-relational mapping to PostgreSQL |
| **Event Streaming** | Azure Event Hubs | (via acv-commons) | Async event publishing for job triggers and completion |
| **Documentation** | OpenAPI/Swagger | 2.6.0 | Interactive API documentation (/swagger-ui.html) |
| **Utilities** | Lombok | Latest | Reduce boilerplate (getters, setters, constructors) |
| **Testing** | JUnit 5, Mockito | Spring Boot 3.3.1 | Unit and integration testing |

---

## Project Structure

```
eai-3540813-acv-services/
├── pom.xml                           # Maven build configuration
├── helm-releases/                    # Kubernetes Helm charts per environment
│   ├── nonprod-dev.yaml             # Development environment config
│   ├── nonprod-test.yaml            # Test environment config
│   └── prod.yaml                    # Production environment config
└── src/
    ├── main/
    │   ├── java/com/fedex/acv/
    │   │   ├── config/
    │   │   │   ├── CacheConfiguration.java                    # Redis cache setup
    │   │   │   ├── ApplicationSecurityConfiguration.java      # OAuth2 / Spring Security
    │   │   │   ├── ExecutorServiceConfiguration.java          # Virtual thread pools
    │   │   │   └── JpaAuditingConfiguration.java             # JPA audit fields
    │   │   ├── controller/                                   # REST API endpoints
    │   │   │   ├── AccountCreationValidationsController.java
    │   │   │   ├── ConfigurationController.java
    │   │   │   └── AuthTokenController.java
    │   │   ├── service/                                      # Business logic orchestration
    │   │   │   ├── validation/
    │   │   │   │   ├── ValidationTriggerServiceImpl.java      # Entry point for bulk validation
    │   │   │   │   ├── StageValidationServiceImpl.java        # Multi-stage orchestration
    │   │   │   │   ├── RecordValidationServiceImpl.java       # Individual record validation
    │   │   │   │   ├── CompleteTransactionServiceImpl.java    # Transaction completion
    │   │   │   │   ├── OCRValidationServiceImpl.java          # Document OCR submission
    │   │   │   │   ├── RetryServiceImpl.java                  # Retry logic with polling
    │   │   │   │   └── GenericValidationServiceImpl.java      # Validator dispatch
    │   │   │   ├── external/
    │   │   │   │   ├── ApiServiceClientImpl.java              # External provider HTTP calls
    │   │   │   │   └── ConnectionsManagerServiceImpl.java     # Provider routing & integration
    │   │   │   ├── configuration/
    │   │   │   │   └── ConfigurationServiceImpl.java          # Country/document config lookup
    │   │   │   └── event/
    │   │   │       └── EventHubServiceImpl.java               # Event publishing
    │   │   ├── repository/                                   # Data access layer
    │   │   │   ├── ValidationRequestRepository.java
    │   │   │   ├── TransactionTrackerRepository.java
    │   │   │   ├── ProviderRequestResponseRepository.java
    │   │   │   ├── CountryRepository.java
    │   │   │   ├── CountryConfigRepository.java
    │   │   │   └── AcvCrudConfigInfoRepository.java
    │   │   ├── domain/                                       # JPA entities
    │   │   │   ├── ValidationRequestEntity.java
    │   │   │   ├── TransactionTrackerEntity.java
    │   │   │   ├── ProviderRequestResponseEntity.java
    │   │   │   ├── CountryEntity.java
    │   │   │   ├── ValidationTypeEntity.java
    │   │   │   ├── RecordDetailsEntity.java
    │   │   │   └── (5+ more entities)
    │   │   ├── dto/                                          # Request/response DTOs
    │   │   │   ├── ValidationRequest.java
    │   │   │   ├── ValidationResponse.java
    │   │   │   ├── WregRequest.java
    │   │   │   ├── CompleteTransactionRequest.java
    │   │   │   ├── ConnectionRequest.java
    │   │   │   └── (10+ more DTOs)
    │   │   ├── exception/
    │   │   │   ├── ValidationException.java
    │   │   │   ├── ProviderIntegrationException.java
    │   │   │   └── ConfigurationNotFoundException.java
    │   │   ├── util/
    │   │   │   ├── ValidationResponseBuilder.java
    │   │   │   ├── TransactionUUIDGenerator.java
    │   │   │   └── ResponseTransformer.java
    │   │   └── AcvServicesApplication.java
    │   └── resources/
    │       ├── application.yml                               # Default config profile
    │       ├── application-dev.yml                           # Development overrides
    │       └── application-test.yml                          # Integration test overrides
    └── test/
        ├── java/                                             # Unit and integration tests
        │   └── com/fedex/acv/
        │       ├── controller/
        │       ├── service/
        │       └── integration/
        └── resources/
            ├── testdata/                                     # Test fixtures
            └── test-application.yml
```

---

## Quick Start

### Prerequisites

```bash
# Required
- Java 21 LTS or later
- Maven 3.9+
- PostgreSQL 14+
- Redis (local or Docker)
- Okta OAuth2 tenant (for authentication)

# Optional
- Docker Desktop (for containerized PostgreSQL/Redis)
- Postman (for API testing)
- IntelliJ IDEA or VS Code (IDE)
```

### Setup Development Environment

#### 1. Clone and Navigate

```bash
cd /path/to/eai-3540813-acv-services
```

#### 2. Start PostgreSQL and Redis (Docker)

```bash
# PostgreSQL
docker run -d \
  --name acv-postgres \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=acv_validation \
  -p 5432:5432 \
  postgres:latest

# Redis
docker run -d \
  --name acv-redis \
  -p 6379:6379 \
  redis:latest
```

#### 3. Configure Environment Variables

Create `.env` file in project root:

```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/acv_validation
DB_USER=postgres
DB_PASSWORD=admin

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Okta OAuth2
OKTA_CLIENT_ID=<your-okta-client-id>
OKTA_CLIENT_SECRET=<your-okta-client-secret>
OKTA_ISSUER_URI=https://<your-okta-domain>/oauth2/default

# Event Hub (Azure)
EVENT_HUB_NAMESPACE=<namespace>
EVENT_HUB_CONNECTION_STRING=<connection-string>

# Logging
LOG_LEVEL=INFO
```

#### 4. Build the Application

```bash
# Build with Maven
./mvnw clean package

# Or with dependencies download
mvn clean package
```

#### 5. Run Locally

```bash
# Run Spring Boot application
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Server starts on http://localhost:8080
```

### API Documentation

Once running, interactive Swagger UI available at:

```
http://localhost:8080/swagger-ui.html
```

---

## Key Features

### 1. **Multi-Stage Validation Pipeline**

Validate applicants through sequential stages:
- **Identity Validation** — OTP-based identity verification
- **Record Validation** — Document compliance verification  
- **Credit Validation** — Credit history and score checks
- **Credit Bureau Validation** — External credit bureau lookups
- **Result Validation** — Final compliance assessment

### 2. **External Provider Integration**

Unified API integration layer for:
- Government agencies (ID verification, records lookup)
- Credit bureaus (credit scores, payment history)
- OCR providers (document digitization)
- Third-party verification services

### 3. **Transaction State Management**

Track validation state across async processing:
- `ValidationRequestEntity` — Initial request capture
- `TransactionTrackerEntity` — Validation state tracking
- `ProviderRequestResponseEntity` — External API call logging

### 4. **Asynchronous Event-Driven Processing**

- Publish validation events to Azure Event Hubs
- Downstream systems (Job Scheduler, Document Service) consume and react
- Virtual threads for parallel record validation

### 5. **Country-Scoped Configuration**

- Multi-country support with localized validation rules
- Configuration repository managed by Config Server
- Redis-cached lookups for performance

### 6. **Document Generation Integration**

- Request compliance certificates via Document Service
- Thymeleaf template rendering for multi-language support
- Azure Blob Storage for document archival

---

## Integration Points

ACV Services integrates with these platform components:

| Service | Role | Data Flow |
|---------|------|-----------|
| **acv-commons** | Shared utilities | HTTP clients, OAuth2/JWT, caching, logging, Event Hub producer |
| **acv-document-service** | Document generation | Request certificates after validation completion |
| **acv-scheduler-service** | Job orchestration | Trigger batch validation jobs; consume completion events |
| **eai-3540813-api-connector-service** | Provider integration | Route external API calls; transform responses |
| **eai-3540813-data-services** | Data access | Query compliance data, transaction history, audit logs |
| **eai-3540813-validation-engine** | business rules | Service factory for specific validator implementations |
| **PostgreSQL** | Persistence | Transaction storage, validation history, configuration |
| **Redis** | Caching | Session tokens, configuration lookups, validation state |
| **Azure Event Hubs** | Event streaming | Publish validation events; subscribe to scheduler events |
| **Okta** | Authentication | OAuth2 OIDC bearer token validation |

---

## Common API Usage Examples

### Request OTP for Identity Validation

```bash
POST /v1/identity/request-otp
Content-Type: application/json
Authorization: Bearer <okta-jwt-token>

{
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "john@example.com",
  "countryCode": "US",
  "documentType": "PASSPORT",
  "documentId": "A12345678"
}

# Response 200 OK
{
  "transactionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "OTP_SENT",
  "message": "OTP sent to registered email"
}
```

### Verify OTP and Complete Identity Validation

```bash
POST /v1/identity/verify-otp
Content-Type: application/json
Authorization: Bearer <okta-jwt-token>

{
  "transactionId": "550e8400-e29b-41d4-a716-446655440000",
  "otp": "123456"
}

# Response 200 OK
{
  "transactionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "IDENTITY_VERIFIED",
  "message": "Identity verification successful"
}
```

### Validate Compliance Documents (Multi-Record)

```bash
POST /v1/records
Content-Type: application/json
Authorization: Bearer <okta-jwt-token>

{
  "transactionId": "550e8400-e29b-41d4-a716-446655440000",
  "records": [
    {
      "recordCode": "BRN001",
      "documentType": "BUSINESS_REGISTRATION",
      "documentURL": "https://blob.azure.com/documents/brn.pdf"
    },
    {
      "recordCode": "TAX001",
      "documentType": "TAX_CERTIFICATE",
      "documentURL": "https://blob.azure.com/documents/tax.pdf"
    }
  ]
}

# Response 200 OK
{
  "transactionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "VALIDATION_IN_PROGRESS",
  "message": "Documents submitted for OCR validation"
}
```

### Fetch Country Configuration

```bash
GET /config/v1/countries
Authorization: Bearer <okta-jwt-token>

# Response 200 OK
{
  "countries": [
    {
      "countryCode": "US",
      "countryName": "United States",
      "validationTypes": ["IDENTITY", "RECORD", "CREDIT"]
    },
    {
      "countryCode": "CA",
      "countryName": "Canada",
      "validationTypes": ["IDENTITY", "RECORD"]
    }
  ]
}
```

---

## Running Tests

```bash
# All tests
./mvnw test

# Specific test class
./mvnw test -Dtest=ValidationTriggerServiceImplTest

# Integration tests
./mvnw test -Dtest=*Integration*

# Test coverage report
./mvnw clean test jacoco:report
# Report: target/site/jacoco/index.html
```

---

## Configuration Reference

### Key Application Properties

**application.yml** (default profile):

```yaml
spring:
  application:
    name: acv-services
  
  # Database Configuration
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/acv_validation}
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:admin}
    hikari:
      maximum-pool-size: 20
  
  # JPA/Hibernate
  jpa:
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  # Redis Cache
  cache:
    type: redis
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
  
  # Security / OAuth2
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${OKTA_ISSUER_URI}
  
  # Async Configuration
  threads:
    virtual:
      enabled: true

# Logging
logging:
  level:
    ROOT: ${LOG_LEVEL:INFO}
    com.fedex.acv: DEBUG
```

---

## Deployment

### Docker Build

```bash
./mvnw clean package -DskipTests
docker build -t acv-services:1.1.6 .
docker tag acv-services:1.1.6 myregistry.azurecr.io/acv-services:latest
docker push myregistry.azurecr.io/acv-services:latest
```

### Kubernetes Deployment

```bash
# Development
helm install acv-services helm-releases/nonprod-dev.yaml

# Test
helm install acv-services helm-releases/nonprod-test.yaml

# Production
helm install acv-services helm-releases/prod.yaml
```

---

## Debugging Tips

### Enable Debug Logging

```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments="--logging.level.com.fedex.acv=DEBUG"
```

### Database Connection Issues

```bash
# Test connection
psql -h localhost -U postgres -d acv_validation

# Check spring logs for connection string
tail -100 logs/application.log | grep -i "connected\|connection pool"
```

### Redis Cache Debugging

```bash
# Connect to Redis CLI
redis-cli

# Check keys
KEYS *
GET acv:country:US
```

---

## Get Help

| Question | Resource |
|----------|----------|
| API endpoint reference | [services.md](services.md) in this directory |
| Architecture & design decisions | [HLD.md](HLD.md) in this directory |
| Code structure & class mapping | [code-mapping.md](code-mapping.md) in this directory |
| Terminology & acronyms | [glossary.md](glossary.md) in this directory |
| Developer onboarding | [onboarding.md](onboarding.md) in this directory |
| Multi-service flows | [flows.md](flows.md) in this directory |

---

## Documentation Map

```
README.md (you are here)
├── HLD.md ——— Architecture, system design, components
├── services.md ——— REST API contracts, endpoints, schemas
├── code-mapping.md ——— Class inventory, dependency graph
├── glossary.md ——— Business & technical terminology
├── onboarding.md ——— Developer setup & quick reference
└── Master Index → Links to all ACV services (acv-commons, acv-document-service, acv-scheduler-service)
```

---

**Last Updated:** 2025-01-30  
**Version:** 1.1.6  
**Status:** Production  

For issues or questions, contact the ACV Platform Team.
