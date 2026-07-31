# ACV API Connector Service - Glossary & Terminology

**Purpose:** Define domain-specific terms, acronyms, and concepts.

**Scope:** All terminology used in API Connector documentation and codebase.

---

## A

**Adapter Pattern**
A design pattern that allows incompatible interfaces to work together. In ACV Connector, `ProviderAPIEndpointDetailsMapper` adapts provider-specific API contracts to the internal `ConnectionRequest` format. See [LLD.md](LLD.md#design-patterns).

**Async ID** (asynchronous identifier)
A unique identifier returned when an asynchronous operation is initiated. Example: `async-550e8400-e29b-41d4-a716`. Used to track polling state. See [services.md](services.md#3-3-post-fetchocrdata).

**Asynchronous Operation** (Async)
A non-blocking operation where the caller receives an `asyncId` and must poll later for results. Used for OCR document processing (>30 second processing time). Opposite: [Synchronous Operation](#synchronous-operation-sync).

**Async Expiry**
The time limit for polling an async operation before results are discarded. Default: 24 hours. Error code: `ASYNC_EXPIRED`. See [Error Response Format](services.md#5-error-response-format).

---

## B

**Backoff Strategy** (Exponential Backoff)
A retry mechanism that increases wait time between attempts: `delay = min(300s, 1s * 2^attempt)`. Example: 1st retry after 1s, 2nd after 2s, 3rd after 4s, etc. See [LLD.md](LLD.md#retry-mechanism).

**Background Check**
Data type for employment/criminal history verification. Enum: `DataTypeConstants.BACKGROUND_CHECK`. See [LLD.md](LLD.md#data-types).

**Bean (Spring Bean)**
A managed object in the Spring application context. Example: `@Bean public RestTemplate restTemplate()`. See [code-mapping.md](code-mapping.md#4-spring-bean-wiring).

**Bridge Pattern**
A design pattern separating abstraction from implementation. In ACV Connector, `ConnectionsManagerService` abstracts how different providers are called; implementations vary by provider. See [LLD.md](LLD.md#design-patterns).

---

## C

**Cache Manager**
Spring component managing cache regions (Redis). Configured in `CacheConfig.java`. Stores polling state with TTL of 30 minutes. See [code-mapping.md](code-mapping.md#8-cache-configuration).

**CircuitBreaker**
A resilience pattern that fails fast when a service is unavailable. Example: After 5 consecutive provider timeouts, reject new requests for 60 seconds. Implemented via Spring Resilience4j. See [HLD.md](HLD.md#non-functional-requirements).

**Connection** (ACV Connection)
An active link between ACV Connector and an external data provider (SIGNZY, CreditBureau, etc.). Established via OAuth2 or API Key authentication.

**ConnectionRequest**
DTO encapsulating a single API request. Fields: `transactionUUID`, `countryCode`, `dataType`, `requestBody`. See [code-mapping.md](code-mapping.md#2-4-model-package-9-dtos--6-entities--15-classes).

**ConnectionsManagerService**
Core business logic interface defining all operations (fetchData, processOcrDocument, etc.). See [code-mapping.md](code-mapping.md#2-2-service-package-2-interfaces--2-implementations--4-classes).

**Config Server**
Spring Cloud Config Server serving environment-specific configurations (dev, test, prod) from `eai-3540813-config-repo/`. See [HLD.md](HLD.md#configuration-and-externalization).

**CORS** (Cross-Origin Resource Sharing)
Mechanism allowing API Connector to accept requests from different domains. Configured in `SecurityConfig.java`. See [HLD.md](HLD.md#security-model).

**Country Code**
ISO 3166-1 two-letter country identifier. Example: `US`, `CA`, `MX`, `UK`. Used for document/provider mapping. See [constants/DataTypeConstants.java](code-mapping.md#2-6-constants-package-5-classes).

**Credit Bureau**
Third-party service providing credit reports and financial history. Example provider integrated in ACV Connector. See [HLD.md](HLD.md#external-providers).

**Credit Report**
Document containing credit score, tradelines, payment history, and public records. Data type: `CREDIT_REPORT`. See [services.md](services.md#3-5-post-processcreditreport).

---

## D

**Data Type**
Classification of the data being requested. Enum: `OCR`, `CREDIT_REPORT`, `ID_VERIFICATION`, `BACKGROUND_CHECK`, etc. Determines which provider and mapper are used. See [constants/DataTypeConstants.java](code-mapping.md#2-6-constants-package-5-classes).

**DTO** (Data Transfer Object)
Immutable data structure for transferring data between layers. Example: `ConnectionRequest`, `AcvApiInterfaceDTO`. See [code-mapping.md](code-mapping.md#2-4-model-package-9-dtos--6-entities--15-classes).

**Document Type**
Specific type of document being processed. Example: `DRIVERS_LICENSE`, `PASSPORT`, `NATIONAL_ID`, `BANK_STATEMENT`. Used for provider-specific extraction. See [services.md](services.md#3-2-post-processocrdocument).

**Document Upload**
Process of sending a document (as Base64-encoded PDF or image) to a provider for analysis. Endpoint: `POST /processOcrDocument`. See [services.md](services.md#3-2-post-processocrdocument).

**Dynamic Response Variables**
Provider-specific fields that must be mapped to standardized ACV response format. Handled by `DynamicResponseVariablesMapper`. See [LLD.md](LLD.md#request-response-transformation).

---

## E

**Error Code**
Standardized error identifier. Examples: `INVALID_REQUEST`, `PROVIDER_ERROR`, `PROVIDER_TIMEOUT`, `MAX_RETRIES_EXCEEDED`. See [services.md](services.md#5-error-response-format).

**Event Hub**
Message broker (RabbitMQ or Kafka) for publishing async events. Example: `DOCUMENT_PROCESSED`, `OCR_COMPLETED`. See [HLD.md](HLD.md#event-hub-integration) and [services.md](services.md#3-12-post-publishmsg).

**EventHubService**
Spring service managing message publishing to RabbitMQ/Kafka. Handles retry and batch operations. See [code-mapping.md](code-mapping.md#2-2-service-package).

**Exponential Backoff**
See [Backoff Strategy](#backoff-strategy-exponential-backoff).

**Extraction** (Document Extraction)
Process of pulling structured data (name, address, ID number) from unstructured document images. Handled by Signzy OCR or AI-powered extraction. See [services.md](services.md#3-10-post-structuredoutput).

---

## F

**Factory Pattern**
Design pattern for creating objects without specifying exact classes. In ACV Connector, `ConnectionsManagerServiceImpl` uses a factory to instantiate provider clients based on `Providers` enum. See [LLD.md](LLD.md#design-patterns).

**Fetch** (Data Fetch)
Retrieve data from an external provider. Endpoint: `POST /fetchData`. See [services.md](services.md#3-1-post-fetchdata).

**Fuzzy Matching**
Algorithm comparing strings with tolerance for minor differences. Used in ACV Validation Engine. References: [acv-validation-engine documentation](../acv-validation-engine/HLD.md).

---

## G

**GenAI** (Generative AI)
Artificial intelligence for content generation, document analysis, and field extraction. Used in `processOcrDocumentByGenAi` endpoint for enhanced validation. See [services.md](services.md#3-11-post-processocrdocumentbygenai).

**Global Exception Handler**
Spring `@RestControllerAdvice` that intercepts exceptions and converts them to standardized error responses. File: `exception/GlobalExceptionHandler.java`. See [code-mapping.md](code-mapping.md#2-7-exception-package-4-classes).

**GlobalCustomErrorResponse**
Standard error response format returned by all error scenarios. Fields: `status`, `errorCode`, `message`, `details`. See [services.md](services.md#5-error-response-format).

---

## H

**HTTP Client**
Library for making HTTP requests to external providers. Implementation: Apache HttpComponents (RestTemplate wrapper). Configured with connection pooling and timeouts. See [code-mapping.md](code-mapping.md#7-http-client-configuration).

---

## I

**ID Verification**
Process of validating government-issued identification. Data type: `ID_VERIFICATION`. Example: Driver's License verification. See [services.md](services.md#3-1-post-fetchdata).

**InvalidRequestException**
Custom exception thrown when request validation fails (missing fields, invalid format). Caught by `GlobalExceptionHandler`. See [code-mapping.md](code-mapping.md#2-7-exception-package-4-classes).

**Internal Processing Exception**
Custom exception thrown when provider API fails or returns error. Caught by `GlobalExceptionHandler` and mapped to `PROVIDER_ERROR`. See [code-mapping.md](code-mapping.md#2-7-exception-package-4-classes).

---

## J

**JWT** (JSON Web Token)
OAuth2 token used for API authentication. Format: `Bearer eyJhbGc...`. Validated by API Gateway before reaching ACV Connector. See [HLD.md](HLD.md#security-model).

---

## K

**KYC** (Know Your Customer)
Regulatory process requiring verification of customer identity. Handled by providers like Signzy. Data types: `ID_VERIFICATION`, `BACKGROUND_CHECK`. See [HLD.md](HLD.md#external-providers).

---

## L

**Layout Extraction**
AI-powered process of identifying document regions (photo, text, signatures). Endpoint: `POST /analyzeDocumentLayout`. See [services.md](services.md#3-9-post-analyzedocumentlayout).

---

## M

**Mapper** (DTO Mapper)
Component transforming data between formats. Examples: `ProviderAPIEndpointDetailsMapper`, `DynamicResponseVariablesMapper`. See [LLD.md](LLD.md#mapper-implementations).

**Max Retries Exceeded**
Error code when retry attempts exceed configured limit (default: 3). Error code: `MAX_RETRIES_EXCEEDED`. See [services.md](services.md#5-error-response-format).

**Message Queue**
Asynchronous message broker (RabbitMQ or Kafka) for event publishing. Configured via Config Server. See [HLD.md](HLD.md#event-hub-integration).

**Mime Type**
Data format type. Examples: `application/pdf`, `image/jpeg`, `image/png`. Required in document upload requests. See [services.md](services.md#3-2-post-processocrdocument).

**Multipart Form Data**
HTTP request format for sending binary files. Used in `/processOcrDocument` endpoint. See [services.md](services.md#3-2-post-processocrdocument).

---

## N

**Non-Functional Requirements**
System constraints beyond business logic. Examples: latency <2s, throughput 500 req/s, 99.9% availability. See [HLD.md](HLD.md#non-functional-requirements).

---

## O

**OAuth2**
Authorization protocol for secure API access. Flow: Client → API Gateway → Okta → ACV Connector. See [HLD.md](HLD.md#security-model).

**OCR** (Optical Character Recognition)
Process of extracting text from images/documents. Provider: Signzy. Data type: `OCR`. See [services.md](services.md#3-2-post-processocrdocument).

**Okta**
OAuth2 provider managing authentication and authorization for ACV platform. Integrated at API Gateway level. See [HLD.md](HLD.md#security-model).

---

## P

**Polling**
Technique for checking async operation status periodically. Endpoint: `POST /fetchOcrData`. Default interval: 5 seconds. Timeout: 5 minutes. See [services.md](services.md#3-3-post-fetchocrdata).

**Polling Transaction**
DTO tracking state of an async operation. Fields: `asyncId`, `status`, `result`, `expiryTime`. See [code-mapping.md](code-mapping.md#2-4-model-package-9-dtos--6-entities--15-classes).

**Polling Transaction Cache**
In-memory cache + Redis hybrid for storing polling states. TTL: 30 minutes. Implemented in `PollingTransactionCache.java`. See [code-mapping.md](code-mapping.md#8-cache-configuration).

**Process** (Data Processing)
Transform and validate data through provider APIs. Example: `/processCreditReport`. See [services.md](services.md#3-5-post-processcreditreport).

**Provider**
External third-party service providing verification/data services. Examples: Signzy (OCR/KYC), CreditBureau (credit reports). Enum: `Providers.java`. See [HLD.md](HLD.md#external-providers).

**Provider API Endpoint**
HTTP endpoint of an external provider. Example: `https://api.signzy.com/v1/process`. Configured in `application.yml`. See [HLD.md](HLD.md#external-providers).

**ProviderAPIEndpointDetailsMapper**
Adapter component transforming `ConnectionRequest` to provider-specific request format. See [LLD.md](LLD.md#mapper-implementations).

**ProviderConfigService**
Spring service loading provider configurations from Config Server. Instantiates provider clients. See [code-mapping.md](code-mapping.md#2-5-config-package-4-classes).

**ProviderConfiguration**
Entity storing provider-specific settings: API endpoint, API key, timeout, max retries. See [code-mapping.md](code-mapping.md#2-4-model-package-9-dtos--6-entities--15-classes).

---

## R

**Rate Limiting**
Mechanism restricting API call frequency. Configured: 500 req/second, 30,000 req/minute. See [services.md](services.md#9-rate-limiting).

**Redis**
In-memory cache store for polling states and response caching. Configured via Spring Data Redis. See [code-mapping.md](code-mapping.md#8-cache-configuration).

**Retry**
Automatic re-attempt of a failed operation. Strategy: exponential backoff with max 5 retries. See [LLD.md](LLD.md#retry-mechanism).

**REST** (Representational State Transfer)
Architectural style using HTTP methods (POST, GET) on resource URLs. ACV Connector exposes 12+ REST endpoints. See [services.md](services.md#2-endpoint-details).

---

## S

**Security Config**
Spring configuration class for OAuth2, API key validation, and rate limiting. File: `config/SecurityConfig.java`. See [code-mapping.md](code-mapping.md#2-5-config-package-4-classes).

**Signzy**
OCR and KYC provider integrated in ACV Connector. Handles document extraction and ID verification. See [HLD.md](HLD.md#external-providers).

**Structured Output**
Process of extracting key-value pairs from documents. Endpoint: `POST /structuredOutput`. See [services.md](services.md#3-10-post-structuredoutput).

**Synchronous Operation** (Sync)
Blocking operation where caller waits for result (timeout: 30s). Default mode. Opposite: [Asynchronous Operation](#asynchronous-operation-async).

---

## T

**Timeout**
Maximum time to wait for provider response. Standard: 30 seconds (60 seconds for OCR). Error code: `PROVIDER_TIMEOUT`. See [HLD.md](HLD.md#non-functional-requirements).

**Transaction UUID**
Unique identifier for an API request. Format: UUID v4. Used for request tracing and audit logging. See [services.md](services.md#2-request-specification).

**Transformer** (Exception Transformer)
Component converting provider exceptions to standardized ACV error codes. Class: `ThrowExceptionTransformer`. See [code-mapping.md](code-mapping.md#2-3-mapper-package-5-classes).

---

## U

**UUID** (Universally Unique Identifier)
128-bit identifier used for transaction tracking. Format: `550e8400-e29b-41d4-a716-446655440000`. See [services.md](services.md#2-request-specification).

---

## V

**Validation**
Process of checking request data against rules before processing. Triggered by `validationType` field in request. See [services.md](services.md#2-request-specification).

**Validation Engine**
Separate ACV service performing business rule validation. ACV Connector integrates with it for comprehensive checks. See [../acv-validation-engine documentation](../acv-validation-engine).

---

## W

**WebClient**
Reactive HTTP client alternative to RestTemplate. Optional future migration. Currently uses RestTemplate. See [code-mapping.md](code-mapping.md#7-http-client-configuration).

---

## Provider & Integration Terms

| Term | Meaning | Usage |
|------|---------|-------|
| **Provider Abstraction** | Pattern allowing multiple providers via single interface | `ConnectionsManagerService` abstracts SIGNZY, CreditBureau, etc. |
| **Provider Adapter** | Adapter pattern implementation for provider-specific transforms | `ProviderAPIEndpointDetailsMapper` adapts each provider's format |
| **Provider Status Mapping** | Mapping provider-specific status codes to ACV codes | `RecordCodeMapping.java` converts "VERIFIED" → "SUCCESS" |
| **Multi-Provider Architecture** | Support for multiple providers with extensible design | Add new provider via Providers enum + mapper extensions |

---

## Async Operation States

| State | Meaning | Next Action |
|-------|---------|------------|
| **PENDING** | Request submitted, waiting to start | poll for update |
| **PROCESSING** | Provider processing document | poll for update |
| **COMPLETED** | Result ready for retrieval | fetch result |
| **FAILED** | Provider error occurred | handle error or retry |
| **EXPIRED** | Polling timeout exceeded (24h) | retry from scratch |

---

## HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| **POST** | Create/Process (non-idempotent) | `/fetchData`, `/processOcrDocument` |
| **GET** | Retrieve (idempotent) | `/fetchProductIds/{description}/{provider}` |
| **PUT** | Update (idempotent) | Not used in ACV Connector |
| **DELETE** | Delete (idempotent) | Not used in ACV Connector |

---

## Error Codes Reference

| Code | HTTP Status | Meaning | Retry? |
|------|------------|---------|--------|
| `INVALID_REQUEST` | 400 | Missing/invalid request fields | No |
| `UNAUTHORIZED` | 401 | Invalid or missing OAuth token | No |
| `FORBIDDEN` | 403 | Insufficient permissions | No |
| `PROVIDER_ERROR` | 422 | External provider API error | Yes |
| `PROVIDER_TIMEOUT` | 503 | Provider API timeout | Yes |
| `MAX_RETRIES_EXCEEDED` | 500 | Retry limit reached | No |
| `INVALID_COUNTRY` | 400 | Unsupported country code | No |
| `INVALID_DATA_TYPE` | 400 | Unknown data type | No |
| `INVALID_DOCUMENT` | 422 | Document validation failed | No |
| `ASYNC_EXPIRED` | 408 | Polling timeout exceeded | No |
| `INTERNAL_ERROR` | 500 | Unexpected system error | Maybe |

---

## Configuration Properties

| Property | Default | Description |
|----------|---------|------------|
| `connections.provider.timeout` | 30 | Provider API timeout (seconds) |
| `connections.provider.maxRetries` | 3 | Max retry attempts |
| `connections.provider.retryDelayMs` | 1000 | Initial retry delay (ms) |
| `connections.polling.maxWaitMinutes` | 1440 | Max polling duration (minutes) |
| `connections.polling.intervalSeconds` | 5 | Polling check interval (seconds) |
| `connections.cache.expireMinutes` | 30 | Async result cache TTL (minutes) |
| `connections.rateLimit.requestsPerSecond` | 500 | Rate limit (requests/second) |

---

## Cross-References

- [README.md](README.md) — Quick start and overview
- [HLD.md](HLD.md) — Architecture and design decisions
- [LLD.md](LLD.md) — Code implementation details
- [services.md](services.md) — REST API contracts
- [code-mapping.md](code-mapping.md) — Class inventory and navigation
- [onboarding.md](onboarding.md) — Developer setup

---

**Last Updated:** 2026-04-02  
**Version:** 1.1.8  
**Audience:** All stakeholders (developers, architects, product managers)
