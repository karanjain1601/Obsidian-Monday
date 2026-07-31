# ACV Data Services - Project Overview & Quick Start

**Purpose:** Generic data access service providing polymorphic REST APIs for multi-entity CRUD operations across the ACV platform.

**Scope:** Project overview, setup, build, deployment, and documentation links.

---

## 1. Project Overview

### 1.1 What is the ACV Data Services?

The **Data Services** provides:

- **Generic Data Access API** — Single-endpoint REST service handling CRUD for any entity
- **Configuration-Driven Queries** — SQL configurations stored in database, not embedded in code
- **Multi-Tenant Support** — Country-code aware, supporting regional data variants
- **Caching Layer** — Redis caching for high-performance data retrieval
- **Authentication & Security** — Okta-based authentication with Spring Security
- **Parallel Processing** — Async/concurrent operations for batch data retrieval
- **Multiple API Versions** — v1 and v2 endpoints with backward compatibility

### 1.2 Why a Dedicated Data Service?

**Benefits:**

✅ **Centralized Data Access** — Single source for all CRUD operations  
✅ **Pre-Configured Queries** — Business logic in database, not code  
✅ **No Code Deployment for Queries** — Add entities/queries without redeployment  
✅ **Scalable Multi-Tenancy** — Handle regional/country variants dynamically  
✅ **High Performance** — Redis caching, connection pooling, async processing  
✅ **Decoupled Services** — Other services depend on Data Service, not database  

### 1.3 Quick Architecture

```
┌─────────────────────────────────┐
│  ACV Microservices              │
│  (Validation, Connector, etc.)  │
└────────────┬─────────────────────┘
             │ HTTP REST
             │ POST /api/v1/{entity}
             │
┌────────────↓──────────────────────────┐
│  Data Services                         │
│                                        │
│  ░░ REST Controller                ░░  │
│  ░░ Generic CRUD Logic             ░░  │
│  ░░ Query Builder                  ░░  │
│  ░░ Redis Cache Layer              ░░  │
└────────────┬──────────┬─────────────────┘
             │          │
        ┌────↓──┐  ┌────↓──────┐
        │ Redis │  │ PostgreSQL │
        │ Cache │  │ Database   │
        │       │  │            │
        └───────┘  └────────────┘
```

---

## 2. Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Language** | Java | 21 LTS | Application runtime |
| **Framework** | Spring Boot | 3.3.1 | Application framework |
| **REST API** | Spring Web | Latest | HTTP REST endpoints |
| **Security** | Spring Security + Okta | 3.0.6 | Authentication/authorization |
| **Database** | Spring Data JPA | Latest | ORM for data persistence |
| **Database Engine** | PostgreSQL | Latest | Relational database |
| **Cache** | Redis + Spring Cache | Latest | Distributed caching |
| **Config** | Spring Cloud Config | Latest | Centralized configuration |
| **Monitoring** | Prometheus + Micrometer | Latest | Metrics and tracing |
| **Build Tool** | Maven | 3.8.1+ | Dependency management |
| **Async** | CompletableFuture | Built-in | Parallel processing |

---

## 3. Repository Structure

```
eai-3540813-data-services/
│
├── src/
│   ├── main/
│   │   ├── java/com/fedex/acv/data/
│   │   │   ├── AcvDataAccessServiceApplication.java  (Main app)
│   │   │   ├── controller/
│   │   │   │   ├── DataController.java                (v1 REST API)
│   │   │   │   └── DataControllerV2.java              (v2 REST API)
│   │   │   ├── services/
│   │   │   │   ├── DataService.java                   (Service interface)
│   │   │   │   ├── DataServiceV2.java                 (v2 Service interface)
│   │   │   │   └── impl/
│   │   │   │       ├── DataServiceImpl.java            (v1 Implementation)
│   │   │   │       └── DataServiceV2Impl.java         (v2 Implementation)
│   │   │   ├── repository/
│   │   │   │   └── AcvCrudConfigInfoRepo.java         (JPA repository)
│   │   │   ├── entity/
│   │   │   │   ├── AcvCrudConfigInfo.java             (JPA entity)
│   │   │   │   └── AcvCrudConfigInfoId.java           (Composite key)
│   │   │   ├── dao/                                   (Data access objects)
│   │   │   ├── converters/                            (Entity converters)
│   │   │   ├── enrichers/                             (Data enrichers)
│   │   │   ├── constant/                              (Constants)
│   │   │   ├── exception/                             (Custom exceptions)
│   │   │   └── utils/                                 (Utilities)
│   │   │
│   │   └── resources/
│   │       ├── application-local.yml                  (Local dev config)
│   │       ├── logback-spring.xml                     (Logging config)
│   │       └── banner.txt
│   │
│   └── test/
│       └── java/com/fedex/acv/data/
│
├── helm-releases/
│   ├── nonprod-dev.yaml                (Development deployment)
│   ├── nonprod-test.yaml               (Test deployment)
│   └── prod.yaml                       (Production deployment)
│
├── pom.xml                             (Maven configuration)
├── mvnw, mvnw.cmd                      (Maven wrapper)
└── README.md
```

---

## 4. Key Features

### 4.1 Generic Data Access API

- **Single Endpoint Pattern:**
  - `POST /api/v1/{entity}` — Generic endpoint for any entity type
  - `POST /api/v1/{entity}/{ctryCd}` — Country-specific variant
  - Same endpoint handles ADD, GET, ALL operations

- **JSON Request Format:**
  ```json
  {
    "type": "ADD",  // or "GET", "ALL"
    "entity": "config",
    "data": { ... },
    "filters": [ ... ]
  }
  ```

### 4.2 Configuration-Driven Queries

- **Database-Stored Configurations:**
  - SQL queries stored in `ACV_CRUD_CONFIG_INFO` table
  - No hardcoded SQL in code
  - Queries parameterized and injectable
  - Supporting 6 SQL query variants per entity

- **Dynamic Query Execution:**
  - Parser reads JSON request
  - Loads SQL from configuration
  - Executes with request parameters
  - Caches results

### 4.3 Caching Strategy

- **Redis Distributed Cache:**
  - Multi-instance cache layer
  - TTL-based expiration
  - Cache-aside pattern
  - Country-aware cache keys

### 4.4 Multi-Tenancy Support

- **Country-Code Differentiation:**
  - Same entity, different data per country
  - Regional compliance and data isolation
  - Query parameterization by country code

### 4.5 Parallel Async Processing

- **Concurrent Operations:**
  - ExecutorService for thread management
  - CompletableFuture for async composition
  - Batch operations processed in parallel

### 4.6 Multiple API Versions

- **v1: Original API** (DataController, DataService)
- **v2: Enhanced API** (DataControllerV2, DataServiceV2)
  - Improved error handling
  - Better response format
  - Additional endpoints

---

## 5. Quick Start

### 5.1 Build Locally

```bash
# 1. Clone repository
git clone https://github.com/FedEx/eai-3540813-data-services.git
cd eai-3540813-data-services

# 2. Build with Maven
mvn clean package

# Output: target/eai-3540813-data-services-1.1.4.jar
```

### 5.2 Run Locally

```bash
# 1. Run with Maven (Spring Cloud Config disabled for local)
mvn spring-boot:run \
  -Dspring-boot.run.arguments="--spring.profiles.active=local --spring.cloud.config.enabled=false"

# Or with environment variable to point to local config server
export SPRING_CLOUD_CONFIG_URI=http://localhost:8888

# 2. Application starts on http://localhost:8080
#    Management on http://localhost:8081

# 3. Test the API
curl -X POST http://localhost:8080/api/v1/config \
  -H "Content-Type: application/json" \
  -d '{"type":"GET","entity":"config","filters":{"id":1}}'
```

### 5.3 Docker Build & Run

```bash
# 1. Build Docker image
docker build -t acv-data-services:1.1.4 .

# 2. Run container with environment variables
docker run \
  -e SPRING_PROFILES_ACTIVE=local \
  -e SPRING_CLOUD_CONFIG_ENABLED=false \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/acvdb \
  -p 8080:8080 \
  -p 8081:8081 \
  acv-data-services:1.1.4
```

### 5.4 Deploy to Kubernetes

```bash
# 1. Deploy using Helm
helm install data-services ./helm-chart \
  -f helm-releases/prod.yaml \
  -n data-services

# 2. Verify deployment
kubectl get pods -n data-services
kubectl logs -f deployment/data-services -n data-services

# 3. Check service is healthy
kubectl exec -it pod/data-services-xxx -- \
  curl localhost:8081/actuator/health
```

---

## 6. Configuration

### 6.1 application-local.yml (Development)

```yaml
spring:
  application:
    name: eai-3540813-data-services
  cloud:
    config:
      enabled: false  # Disable remote config for local dev
  datasource:
    url: jdbc:postgresql://localhost:5432/acvdb
    username: postgres
    password: password
  jpa:
    hibernate:
      ddl-auto: validate
  redis:
    host: localhost
    port: 6379
  cache:
    type: redis
    
server:
  port: 8080
  
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info
```

### 6.2 Production Configuration (via Spring Cloud Config)

```yaml
spring:
  cloud:
    config:
      enabled: true
      name: eai-3540813-data-services
      import: configserver:https://config-server.prod/acv/config
  datasource:
    url: ${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB_NAME}
    username: ${POSTGRES_USER}
    password: ${POSTGRES_DB_PASSWORD}
  redis:
    host: ${REDIS_HOST}
    port: ${REDIS_PORT}
    password: ${REDIS_PASSWORD}
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://okta.com/oauth2/v1
          
server:
  port: 8080
management:
  server:
    port: 8081
```

---

## 7. Key REST Endpoints

### 7.1 v1 Endpoints

```
POST /api/v1/{entity}
  - Add:    {"type":"ADD", "data":{...}}
  - Get:    {"type":"GET", "filters":{...}}
  - All:    {"type":"ALL", "offset":0, "limit":100}

POST /api/v1/{entity}/{ctryCd}
  - Country-specific variant of above
```

### 7.2 v2 Endpoints (Enhanced)

```
POST /api/v2/{entity}
  - Improved response format
  - Better error handling
  - Additional metadata

POST /api/v2/{entity}/{ctryCd}
  - Country-specific variant
```

### 7.3 Actuator Endpoints

```
GET /actuator/health              → Health check
GET /actuator/metrics             → Metrics data
GET /actuator/prometheus          → Prometheus format
GET /actuator/info                → Application info
```

---

## 8. Key Dependencies

| Dependency | Version | Purpose |
|-----------|---------|---------|
| spring-boot-starter-web | 3.3.2 | REST endpoints, HTTP handling |
| spring-boot-starter-data-jpa | Latest | ORM, entity management |
| spring-boot-starter-security | Latest | Authentication, authorization |
| okta-spring-boot-starter | 3.0.6 | Okta OAuth2 integration |
| spring-boot-starter-cache | Latest | Caching support |
| spring-data-redis | Latest | Redis operations |
| postgresql | Latest | Database driver |
| spring-cloud-starter-config | Latest | Remote configuration |
| micrometer-tracing-bridge-brave | Latest | Distributed tracing |
| micrometer-registry-prometheus | Latest | Prometheus metrics |
| Lombok | Latest | Boilerplate reduction |

---

## 9. Documentation Map

```
README.md (YOU ARE HERE)
├── HLD.md ........................... Architecture & design patterns
├── LLD.md ........................... Implementation details & code structure
├── services.md ...................... API endpoints & contracts
├── code-mapping.md .................. File navigation & class inventory
├── glossary.md ...................... Terminology & concepts
└── onboarding.md .................... Developer setup & workflows
```

---

## 10. Key Concepts

### Data Service
Microservice providing generic, configuration-driven data access. Supports polymorphic REST endpoints for any entity type without code changes.

### Configuration-Driven Query
SQL stored in database (ACV_CRUD_CONFIG_INFO table), not in code. Enables adding new entities/queries without redeployment.

### Multi-Tenancy
Supporting multiple countries/regions with same data model but different data. Country code (ctryCd) differentiates queries and caching.

### Redis Caching
Distributed cache layer improving performance. Cache-aside pattern: check cache first, load from DB if miss, populate cache.

### Okta Authentication
OAuth2-based identity management. Okta handles user authentication; Spring Security validates JWT tokens.

### Composite Key
Entity using multiple columns as primary key. AcvCrudConfigInfo uses entity type + operation type as composite ID.

---

## 11. Common URLs & Paths

### Local Development
```
Application:       http://localhost:8080
Management:        http://localhost:8081
Health Check:      http://localhost:8081/actuator/health
Metrics:           http://localhost:8081/actuator/metrics
Redis:             localhost:6379
PostgreSQL:        localhost:5432
```

### Production (Kubernetes)
```
Service DNS:       data-services.data-services.svc.cluster.local
Health:            http://data-services:8081/actuator/health
Metrics:           http://data-services:8081/actuator/metrics
```

---

## 12. Getting Started

**New to this project?** Start here:

1. **Read [onboarding.md](onboarding.md)** — Local setup & first steps
2. **Read [HLD.md](HLD.md)** — Understanding the architecture
3. **Read [LLD.md](LLD.md)** — Code structure exploration
4. **Read [services.md](services.md)** — Available REST endpoints
5. **Check [glossary.md](glossary.md)** — Definitions & concepts

**Quick Links:**
- [Spring Data JPA Reference](https://spring.io/projects/spring-data-jpa)
- [Spring Cache Reference](https://spring.io/projects/spring-data-redis)
- [Okta Spring Boot Reference](https://developer.okta.com/blog/2021/05/11/spring-security-oauth2)

---

## 13. Support & Contacts

**For Help:**
- Slack: `#data-services-team` channel
- Documentation: See [onboarding.md](onboarding.md) FAQ
- Issues: Create GitHub issue in this repository

**Escalations:**
- Database performance: Contact DBA team
- Redis issues: Contact infrastructure team
- Authentication issues: Contact security team

---

## Cross-References

- [Configuration Repository](../acv-config-repo/README.md) — Configuration files
- [Database Service](../acv-database-service/README.md) — Database layer
- [Validation Engine](../acv-validation-engine/README.md) — Data consumer

---

**Last Updated:** 2026-04-02  
**Version:** 1.1.4  
**Audience:** Developers, DevOps Engineers, Data Architects, API Consumers
