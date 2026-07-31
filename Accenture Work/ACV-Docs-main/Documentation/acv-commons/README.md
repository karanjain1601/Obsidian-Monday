# ACV Commons Library Documentation

## Project Overview

**ACV Commons** is a shared utility library for the **Automated Compliance Validation (ACV)** platform. It provides reusable components for inter-service communication, caching, event handling, authentication, logging, and data validation that are leveraged across all ACV microservices.

**Version:** 1.1.5  
**Technology Stack:** Java 21, Spring Boot 3.3.4, Maven  
**Purpose:** Provide centralized, battle-tested utilities to reduce code duplication and enforce consistent patterns across the ACV ecosystem

---

## Quick Start

### Build the Library

```bash
./mvnw clean package
```

### Run Tests

```bash
./mvnw clean test
```

### Use in Another Service

Add to your `pom.xml`:

```xml
<dependency>
    <groupId>com.fedex.acv.commons</groupId>
    <artifactId>eai-3540813-acv-commons</artifactId>
    <version>1.1.5</version>
</dependency>
```

---

## Repository Structure

```
eai-3540813-acv-commons/
├── README.md
├── pom.xml                          # Maven build configuration (Java 21, Spring Boot 3.3.4)
├── mvnw / mvnw.cmd                  # Maven wrapper scripts
├── cicd-maven-settings.xml          # CI/CD Maven configuration
├── helm-releases/
│   └── nonprod-dev.yaml             # Helm values for dev environment
├── src/
│   ├── main/java/com/fedex/acv/commons/
│   │   ├── cache/                   # Caching utilities (Redis-backed)
│   │   ├── config/                  # Spring configuration classes
│   │   ├── constants/               # Application constants and enums
│   │   ├── context/                 # ThreadLocal context management
│   │   ├── controllers/             # REST endpoints for cache and token management
│   │   ├── dto/                     # Data Transfer Objects
│   │   ├── eventhub/                # Azure Event Hub integration
│   │   ├── exceptions/              # Custom exception classes
│   │   ├── filters/                 # Spring servlet filters
│   │   ├── http/                    # HTTP client utilities and retry logic
│   │   ├── models/                  # Domain models
│   │   ├── utils/                   # Utility functions
│   │   └── ...
│   └── test/java/                   # Unit and integration tests
└── target/                          # Maven build output
```

---

## Key Components

### 1. **HTTP Clients** (`http/clients/`)

Provides abstracted HTTP clients for inter-service communication:
- **AbstractHttpClient** — Base class handling JWT authentication, token caching, retry logic
- **AcvServiceClient** — Communicates with the core ACV service
- **AcvDataServiceClient** — Calls the Data Service API for CRUD operations
- **MultiHttpClientProvider** — Factory pattern for instantiating multiple service clients

**Key Feature:** Automatic token refresh with caching and exponential backoff retries

### 2. **Caching** (`cache/`)

Centralized cache abstraction:
- **CacheService** (interface) — Standardized cache operations
- **CacheServiceImpl** — Spring Cache Manager backed implementation
- **CacheConfig** — Auto-clears caches on application startup per configuration

### 3. **Event Hub** (`eventhub/`)

Azure Event Hub producers and consumers:
- **EventHubProducer** — Sends messages to Event Hub (supports internal and external Event Hubs)
- **EventHubConsumer** — Listens to Event Hub with checkpoint management via Azure Blob Storage
- **EventHubServices** — Persists event tracking to database
- **EventParser** — Deserializes Event Hub messages

### 4. **Configuration** (`config/`)

Spring Boot configuration classes:
- **ApplicationBasicConfiguration** — RestClient setup with request interceptors, tracing headers
- **ApplicationSecurityConfiguration** — OAuth2/JWT security, Role-Based Access Control via Okta
- **CacheConfig** — Cache initialization and eviction
- **LoggingConfig** — Request/response logging configuration
- **AuthConfig** — Token claim extraction

### 5. **Utilities** (`utils/`)

Common utility functions:
- **ApplicationUtilities** — YAML/JSON parsing, retry template building, document download helper
- **LogUtils** — Request masking (PII redaction), JSON path masking, log formatting
- **SerializationUtils** — Jackson ObjectMapper wrapper for JSON serialization
- **SanityUtils** — Input validation and anomaly detection

### 6. **Filters** (`filters/`)

Servlet filters applied to all incoming requests:
- **LoggingFilter** — Logs request/response with masked sensitive data, MDC context propagation

### 7. **Controllers** (`controllers/`)

Debug/admin REST endpoints (available in dev/local profiles):
- **TokenController** — Inspect and refresh cached tokens
- **CommonCacheController** — View cache keys, manually clear cache
- **CommonEHController** — Event Hub diagnostics
- **LoggingController** — Dynamic logging level configuration

---

## Technology Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| Java | 21 | Language |
| Spring Boot | 3.3.4 | Framework |
| Spring Cloud Config | Latest | Configuration management |
| Spring Security | 6.x | OAuth2/JWT authentication |
| Apache HttpComponents | 5.x | HTTP client |
| Azure Event Hubs | Latest | Message broker |
| Azure Storage Blobs | Latest | Checkpoint persistence |
| Lombok | Latest | Boilerplate reduction |
| Jackson | Latest | JSON processing |
| Nimbus JOSE+JWT | 0.12.6 | JWT signing with EC keys |
| Micrometer | Latest | Distributed tracing & metrics |
| Logstash Logback Encoder | 5.2 | JSON logging |

---

## Documentation Files

- [HLD.md](HLD.md) — High-level architecture, design decisions, business context
- [LLD.md](LLD.md) — Low-level code organization, class responsibilities, design patterns
- [architecture.md](architecture.md) — Deployment topology, Kubernetes config, IaC (Helm/Terraform)
- [code-mapping.md](code-mapping.md) — Complete class-to-responsibility mapping with file paths
- [services.md](services.md) — REST endpoint contracts, authentication flows
- [security.md](security.md) — OAuth2/JWT implementation, token lifecycle, secrets management
- [devops.md](devops.md) — CI/CD pipeline, deployment steps, monitoring
- [glossary.md](glossary.md) — Business domain terminology and technical acronyms
- [onboarding.md](onboarding.md) — Developer setup guide, common tasks
- [Flows](flows.md) - Business flow diagrams and data transformations
- [Testing](testing.md) - Test strategy and coverage

---

## Usage Examples

### 1. Making Inter-Service HTTP Calls

```java
@RestController
@RequestMapping("/api")
public class MyController {
    
    @Autowired
    private AcvDataServiceClient dataServiceClient;
    
    @GetMapping("/entities")
    public List<?> fetchEntities() {
        List<Parameter> params = List.of(
            new Parameter("country", "US", Types.VARCHAR),
            new Parameter("status", "ACTIVE", Types.VARCHAR)
        );
        DataGetResult<?> result = dataServiceClient.fetchEntityDataV2("myEntity", params);
        return result.data();
    }
}
```

### 2. Using the Cache Service

```java
@Service
public class MyService {
    
    @Autowired
    private CacheService cacheService;
    
    public void storeData(String key, Object value) {
        cacheService.put("my-cache", key, value);
    }
    
    public Object retrieveData(String key) {
        return cacheService.get("my-cache", key, Object.class);
    }
}
```

### 3. Publishing to Event Hub

```java
@Service
public class EventPublisher {
    
    @Autowired
    private EventHubProducer producer;
    
    public void publishEvent(AcvEventMessage event) {
        String json = SerializationUtils.writeValueAsString(event);
        producer.sendMessage(json);
    }
}
```

### 4. Token Management (Debug Endpoint)

```
GET /commons/v1/http-clients              # List available HTTP clients
GET /commons/v1/token/{client}            # Get cached token for a client
POST /commons/v1/token/refresh/{client}   # Force refresh token
DELETE /commons/v1/cache/clear-all-tokens # Clear all cached tokens
```

---

## Configuration Properties

### Caching

```yaml
cache:
  cacheNames: "my-cache,token-cache"          # Comma-separated cache names to initialize

spring:
  cache:
    type: cache                                # Cache provider
```

### HTTP & Retry

```yaml
acv:
  http:
    retry:
      enabled: true
      maxAttempts: 3
      backoffMultiplier: 2.0
      initialDelayMs: 100
  
  tracing:
    header: "x-transaction-id"
    pattern:
      transaction: "transaction.id"
      country: "country"
```

### Security

```yaml
okta:
  enabled: true

url:
  patterns:
    allowed: "/health,/swagger-ui/**"         # Endpoints accessible without auth
    secured: "/api/**"                        # Endpoints requiring auth
```

### Event Hub

```yaml
eventhub:
  producer:
    connectionString: "${EVENTHUB_CONNECTION_STRING}"
    eventHubName: "acv-events"
    eventHubType: "internal"                  # "internal" or "external"

  consumer:
    connectionString: "${EVENTHUB_CONNECTION_STRING}"
    eventHubName: "acv-events"
    consumerGroup: "$Default"
    checkpoint:
      connectionString: "${BLOB_CONNECTION_STRING}"
      containerName: "event-checkpoints"
```

### Logging

```yaml
acv:
  logging:
    txn:
      enable: true                            # Enable transaction logging
  mask:
    request:
      attribute:
        visible:
          length: 4                           # Mask all but last 4 chars of secrets
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Shared Library Pattern** | Single source of truth reduces duplication; easier to maintain standards across services |
| **RestClient over RestTemplate** | Modern Spring abstraction with better observability and interceptor support |
| **Token Caching with Okta JWT** | Reduces authentication latency; EC signing for better performance |
| **Exponential Backoff Retries** | Handles transient failures gracefully; avoids thundering herd |
| **ThreadLocal Context** | Store request context (country, data type) without passing through all methods |
| **Event Hub Checkpoint via Blob** | Ensures exactly-once message processing with durability |
| **Spring Cache Abstraction** | Allows swapping cache implementations (Redis, Hazelcast, etc.) at runtime |

---

## Integration with Other Services

This library is consumed by:

- **eai-3540813-acv-services** — Core ACV business logic
- **eai-3540813-acv-validation-engine** — Validation rules execution
- **eai-3540813-acv-scheduler-service** — Job scheduling and orchestration
- **eai-3540813-api-connector-service** — External API integration
- **eai-3540813-database-service** — Database operations
- **eai-3540813-data-services** — Data layer services
- **eai-3540813-acv-document-service** — Document management

---

## Dependency Graph

```
acv-commons (shared library)
    ↓
├─ acv-services (core business)
├─ acv-validation-engine (rules)
├─ acv-scheduler-service (orchestration)
├─ api-connector-service (external APIs)
├─ database-service (persistence)
├─ data-services (data ops)
└─ acv-document-service (documents)
```

---

## Support & Contact

For questions or issues related to acv-commons:
1. Check the [onboarding guide](onboarding.md) for setup help
2. Review [security.md](security.md) for auth/token issues
3. Review [devops.md](devops.md) for deployment questions
4. Escalate to the ACV Platform team

---

**Last Updated:** April 2, 2026  
**Documentation Version:** 1.0
