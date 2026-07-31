# ACV API Connector Service - Business Context & Quick Start

**Project:** Account Creation Validations - API Connector Service  
**Version:** 1.1.8  
**Ownership:** ACV Platform - Connector Services Team  
**Purpose:** Bridge external third-party data provider APIs (OCR, credit reports, verification services) with the ACV platform, providing a unified interface for fetching, processing, and polling data across multiple providers and countries.

---

## Quick Overview

**ACV API Connector Service** is the integration layer for the Account Creation Validations platform — responsible for communicating with external APIs (SIGNZY for OCR, credit bureaus, verification providers) and surfacing their data/capabilities to internal ACV services.

**Key Responsibility:**
- Abstract external API complexity behind unified REST endpoints
- Support multiple data providers (OCR, credit reports, document processing)
- Handle country/region-specific configurations and data mappings
- Execute async requests with polling and retry logic
- Transform provider-specific responses to ACV-compatible formats
- Integrate with ACV Event Hub for asynchronous workflows

**Business Context:**
When ACV Services needs to fetch applicant data (identity verification, credit scores, document analysis), the Connector Service acts as the gateway. It handles all provider-specific authentication, request/response transformation, error handling, and retry logic — freeing ACV Services from knowing the details of each provider.

---

## Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Language** | Java LTS | 21+ | Type safety; concurrent processing |
| **Framework** | Spring Boot | 3.3.1 | Microservice; REST endpoints; auto-configuration |
| **Build Tool** | Maven | 3.9+ | Dependency management and build lifecycle |
| **REST API** | Spring Web | 3.3.1 | RESTful endpoints for data fetching |
| **Configuration** | YAML + Spring Cloud Config | Custom | External configuration, environment-specific settings |
| **HTTP Client** | RestTemplate / WebClient | Spring | Call external APIs with retry/timeout |
| **Security** | Spring Security + Okta | 3.0.6 | OAuth2 authentication (Okta integration) |
| **Data Processing** | Jackson, Apache Tika | Latest | JSON/XML parsing, file type detection |
| **Async Messaging** | Event Hub (RabbitMQ/Kafka) | Custom | Async polling, event publishing |
| **Testing** | JUnit 5 + Mockito | Spring Boot 3.3.1 | Unit and integration testing |
| **Monitoring** | Micrometer + Prometheus | Latest | Metrics, distributed tracing, observability |

---

## Project Structure

```
eai-3540813-api-connector-service/
├── pom.xml                                      # Maven configuration
├── mvnw / mvnw.cmd                             # Maven wrapper
├── helm-releases/
│   ├── nonprod-dev.yaml                        # Dev Kubernetes config
│   ├── nonprod-test.yaml                       # Test config
│   └── prod.yaml                               # Production config
│
└── src/
    ├── main/
    │   ├── java/com/fedex/acv/connections/
    │   │   ├── controller/
    │   │   │   ├── ConnectionsController.java      # Primary REST endpoints
    │   │   │   └── ConfigPortalProxyController.java # Config portal proxy
    │   │   │
    │   │   ├── service/
    │   │   │   ├── ConnectionsManagerService.java  # Service interface
    │   │   │   ├── EventHubService.java            # Event hub integration
    │   │   │   └── impl/
    │   │   │       ├── ConnectionsManagerServiceImpl.java  # Main implementation
    │   │   │       └── EventHubServiceImpl.java             # Event handling
    │   │   │
    │   │   ├── model/
    │   │   │   ├── ConnectionRequest.java          # API request payload
    │   │   │   ├── PollingRequest.java             # Async polling request
    │   │   │   ├── PollingTransaction.java         # Polling state tracking
    │   │   │   ├── Records.java                    # Data record wrapper
    │   │   │   ├── RetryableRecordDetails.java     # Retry tracking
    │   │   │   ├── AdhocDocumentRequest.java       # Document generation
    │   │   │   └── (more DTOs...)
    │   │   │
    │   │   ├── mapper/
    │   │   │   └── config/
    │   │   │       ├── ProviderAPIEndpointDetailsMapper.java
    │   │   │       ├── DynamicResponseVariablesMapper.java
    │   │   │       ├── CountryDocumentMappingConfiguration.java
    │   │   │       ├── ACVStubConfiguration.java
    │   │   │       └── ThrowExceptionTransformer.java
    │   │   │
    │   │   ├── config/
    │   │   │   └── ConnectionsConfig.java          # Spring @Configuration
    │   │   │
    │   │   ├── constants/
    │   │   │   ├── Providers.java                  # Provider enum (SIGNZY)
    │   │   │   ├── APIInterfaceConstants.java      # API constants
    │   │   │   ├── CustomErrorCodes.java           # Error code mappings
    │   │   │   └── RecordCodeMapping.java          # Record type mappings
    │   │   │
    │   │   ├── exception/
    │   │   │   ├── InvalidRequestException.java
    │   │   │   ├── InternalProcessingException.java
    │   │   │   ├── GlobalExceptionHandler.java     # Global error handler
    │   │   │   └── GlobalCustomErrorResponse.java
    │   │   │
    │   │   ├── analyzeDocument/
    │   │   │   └── dto/
    │   │   │       ├── AnalyzeDocumentLayoutResponse.java
    │   │   │       └── (document analysis DTOs)
    │   │   │
    │   │   └── AcvApiConnectorServiceApplication.java
    │   │
    │   └── resources/
    │       ├── application.yml                     # Default profile
    │       ├── application-local.yml               # Local dev profile
    │       ├── application-prod.yml                # Production profile
    │       ├── logback-spring.xml                  # Logging config
    │       ├── config/
    │       │   └── (configuration files)
    │       └── __files/
    │           └── (mock/test data)
    │
    └── test/
        └── java/
            └── com/fedex/acv/connections/
                └── (unit and integration tests)
```

---

## Quick Start

### Prerequisites

```bash
# Required
- Java 21 LTS or later
- Maven 3.9+
- Access to ACV Commons library (shared library)
- Config Server access (for external configuration)

# Optional
- Docker (for running services)
- Postman (for API testing)
```

### Setup Development Environment

#### 1. Clone and Navigate

```bash
cd /path/to/eai-3540813-api-connector-service
```

#### 2. Build the Application

```bash
# Clean build without tests
./mvnw clean package -DskipTests

# Or with tests
./mvnw clean package
```

#### 3. Run Locally

```bash
# Development profile (connects to dev Config Server)
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"

# Server starts on http://localhost:8082 (or configured port)
```

#### 4. Test the API

```bash
# Fetch data from external provider
curl -X POST http://localhost:8082/fetchData \
  -H "Content-Type: application/json" \
  -d '{
    "transactionUUID": "550e8400-e29b-41d4-a716-446655440000",
    "countryCode": "US",
    "dataType": "ID_VERIFICATION",
    "requestBody": {
      "documentNumber": "AB123456",
      "documentType": "DRIVERS_LICENSE"
    }
  }'

# Expected Response: Provider data wrapped in ACV format
{
  "data": { ... },
  "status": "SUCCESS",
  "timestamp": "2026-04-02T10:15:00Z"
}
```

---

## Key Features

### 1. **Multi-Provider Integration**

Unified interface for multiple external data providers:

```
ACV Services
    ↓
API Connector Service
    ├→ SIGNZY (OCR, document analysis, KYC verification)
    ├→ Credit Bureau APIs (credit scores, reports)
    ├→ Identity Verification Services
    ├→ Background Check Providers
    └→ Document Generation Services
```

### 2. **Supported Operations**

| Endpoint | Purpose | Async | Provider |
|----------|---------|-------|----------|
| **POST /fetchData** | Query generic data | No | Any |
| **POST /processOcrDocument** | Upload & process document | Yes | SIGNZY |
| **POST /fetchOcrData** | Retrieve OCR results | No | SIGNZY |
| **POST /pollOcrData** | Poll async OCR results | Yes | SIGNZY |
| **POST /processCreditReport** | Fetch credit data | Yes | Credit Bureau |
| **POST /fetchCreditReportData** | Retrieve credit results | No | Credit Bureau |
| **POST /pollCreditData** | Poll credit report results | Yes | Credit Bureau |
| **GET /fetchProductIds/{desc}/{provider}** | Query available products | No | Provider |
| **POST /analyzeDocumentLayout** | AI document analysis | No | GenAI |
| **POST /structuredOutput** | Extract structured data | No | GenAI/OCR |
| **POST /processOcrDocumentByGenAi** | Process with AI | Yes | GenAI |

### 3. **Country/Region Support**

Configuration-driven country-specific mappings:

```
CountryDocumentMappingConfiguration
    ├─ US: Drivers License, Passport, ID Card
    ├─ CA: Canadian Drivers License, Passport
    ├─ MX: Mexican ID, Passport
    └─ (expandable to other countries)
```

### 4. **Async Polling & Retry**

Handle long-running operations:

```
POST /processOcrDocument
    ↓ (returns asyncId)
    ↓ (client polls)
POST /pollOcrData
    ↓ (check status)
    ├─ PENDING: Still processing
    ├─ COMPLETED: Results ready
    └─ FAILED: Error occurred
```

### 5. **Event Hub Integration**

Publish/subscribe async events:

```
Connection Service
    ├→ Publish: OCR_PROCESSING_STARTED
    ├→ Publish: CREDIT_REPORT_RECEIVED
    ├→ Publish: RECORD_VALIDATION_COMPLETED
    └→ Subscribe: Config changes, external events
```

### 6. **Provider-Agnostic Request/Response**

Request format:

```json
{
  "transactionUUID": "unique-id",
  "countryCode": "US",
  "dataType": "ID_VERIFICATION|OCR|CREDIT_REPORT|BACKGROUND_CHECK",
  "opsType": "SYNC|ASYNC",
  "requestBody": { /* provider-specific payload */ }
}
```

Response format (standardized across all providers):

```json
{
  "data": { /* transformed provider response */ },
  "status": "SUCCESS|FAILURE|IN_PROGRESS",
  "errorCode": "optional-error-code",
  "message": "human-readable message",
  "timestamp": "ISO-8601 timestamp"
}
```

---

## Integration with ACV Services

The Connector Service is called from multiple ACV Services:

```
┌─────────────────────────────────────────────┐
│  ACV Services (Orchestrator)                │
│                                             │
│  StageValidationServiceImpl                 │
│    ├→ fetchData() → API Connector          │
│    ├→ processOcrDocument() → API Connector │
│    ├→ processCreditReport() → API Connector│
│    └→ analyzeDocumentLayout() → API Connec │
│                                             │
└─────────────────────────────────────────────┘
         ↓ HTTP REST calls
┌─────────────────────────────────────────────┐
│  API Connector Service (This Service)      │
│                                             │
│  Transforms requests/responses             │
│  Handles retries and polling               │
│  Integrates with external providers        │
│                                             │
└─────────────────────────────────────────────┘
         ↓ HTTP API calls
┌─────────────────────────────────────────────┐
│  External Providers                         │
│                                             │
│  ├─ SIGNZY (OCR, KYC)                     │
│  ├─ Credit Bureaus (Equifax, Experian)    │
│  ├─ Identity Services (IDology, etc.)     │
│  └─ Document Generation (iText, etc.)     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## API Reference Summary

### Primary Endpoints

```
POST /fetchData
POST /processOcrDocument
POST /fetchOcrData
POST /pollOcrData
POST /processCreditReport
POST /fetchCreditReportData
POST /pollCreditData
GET /fetchProductIds/{description}/{provider}
POST /analyzeDocumentLayout
POST /structuredOutput
POST /processOcrDocumentByGenAi
POST /publishMsg
```

**All endpoints require:**
- `Content-Type: application/json`
- Authentication via Okta OAuth2 (handled by API Gateway)

---

## Running Tests

```bash
# All tests
./mvnw test

# Specific test class
./mvnw test -Dtest=ConnectionsManagerServiceImplTest

# With coverage report
./mvnw clean test jacoco:report
# Open: target/site/jacoco/index.html
```

---

## Configuration Properties

### application-local.yml (Development)

```yaml
spring:
  application:
    name: eai-3540813-api-connector-service
    version: 1.1.8
  
  server:
    port: 8082
  
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://dev-okta.example.com

# Provider configurations
api-connector:
  providers:
    signzy:
      baseUrl: https://api-dev.signzy.com
      apiKey: ${SIGNZY_API_KEY}
      timeout: 30000
    
    credit-bureau:
      baseUrl: https://api-dev.creditbureau.com
      apiKey: ${CREDIT_API_KEY}
      timeout: 60000
  
  polling:
    max-retry-attempts: 5
    retry-delay-ms: 5000
    timeout-seconds: 300
```

---

## Deployment

### Docker Build

```bash
./mvnw clean package -DskipTests
docker build -t acv-api-connector:1.1.8 .
docker tag acv-api-connector:1.1.8 myregistry.azurecr.io/acv-api-connector:latest
docker push myregistry.azurecr.io/acv-api-connector:latest
```

### Kubernetes Deployment

```bash
# Deploy to dev environment
helm install acv-api-connector helm-releases/nonprod-dev.yaml

# Deploy to production
helm install acv-api-connector helm-releases/prod.yaml
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
├── HLD.md ——— Architecture, providers, integration flows
├── LLD.md ——— Code structure, class details, request lifecycle
├── services.md —— REST API contracts and schemas
├── code-mapping.md — Class inventory, dependencies
├── glossary.md ———— Terminology and acronyms
└── onboarding.md —— Developer setup guide
```

---

**Last Updated:** 2026-04-02  
**Version:** 1.1.8  
**Status:** Production

For questions or issues, contact the ACV API Connector Team.
