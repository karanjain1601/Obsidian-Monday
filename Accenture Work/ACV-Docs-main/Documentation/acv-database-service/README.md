# ACV Database Service - Project Overview & Quick Start

**Purpose:** Centralized database operations and schema management for ACV microservices.

**Scope:** Project overview, setup, build, deployment, and key documentation links.

---

## 1. Project Overview

### 1.1 What is the ACV Database Service?

The **Database Service** provides:

- **Database Operations** — Centralized database connectivity for ACV platform services
- **Schema Management** — Automated database migrations via Flyway
- **Data Persistence** — Spring Data JPA for object-relational mapping
- **Multi-Environment Support** — H2 (development), PostgreSQL (production)
- **Connection Pooling** — Efficient database connection management via HikariCP

### 1.2 Why a Dedicated Database Service?

**Benefits:**

✅ **Centralized Schema Management** — All migrations in single source  
✅ **Version Control** — Database schema tracked with code  
✅ **Automated Migrations** — Flyway runs migrations on startup  
✅ **Development-Ready** — H2 in-memory for local testing  
✅ **Production-Grade** — PostgreSQL with connection pooling  
✅ **No Manual SQL** — Schema changes integrated with deployment  

### 1.3 Quick Architecture

```
┌─────────────────────────────────────────────┐
│     ACV Microservices                      │
│  (Validation, API Connector, etc.)         │
└────────────────────┬────────────────────────┘
                     │ Database Operations
                     │ (Spring Data JPA)
                     │
        ┌────────────↓─────────────┐
        │ Database Service         │
        │                          │
        │ ░░ Spring Boot App    ░░  │
        │ ░░ Flyway Migrations  ░░  │
        │ ░░ Connection Pool    ░░  │
        └────────────┬────────────┘
                     │
        ┌────────────↓─────────────┐
        │                          │
    ┌───↓─────┐          ┌────────↓──────┐
    │   H2    │          │  PostgreSQL   │
    │ (Dev)   │          │  (Production) │
    │         │          │               │
    └─────────┘          └───────────────┘
```

---

## 2. Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Language** | Java | 21 LTS | Application runtime |
| **Framework** | Spring Boot | 3.3.3 | Application framework |
| **JPA/ORM** | Spring Data JPA | Latest | Object-relational mapping |
| **Migrations** | Flyway | 10.18.0 | Database schema versioning |
| **Dev Database** | H2 | Latest | In-memory (development) |
| **Prod Database** | PostgreSQL | Latest | Relational database |
| **Build Tool** | Maven | 3.8.1+ | Dependency management |
| **Monitoring** | Micrometer | Latest | Distributed tracing |
| **Utilities** | Lombok | Latest | Boilerplate reduction |

---

## 3. Repository Structure

```
eai-3540813-database-service/
│
├── src/
│   ├── main/
│   │   ├── java/com/fedex/acv/database/
│   │   │   ├── DatabaseServiceApplication.java    (Main app)
│   │   │   ├── AcvDBConfiguration.java             (Data source config)
│   │   │   └── FlywayDBInitializer.java            (Migration init)
│   │   │
│   │   └── resources/
│   │       ├── application-local.properties     (Local dev config)
│   │       ├── application-prod.properties      (Production config)
│   │       └── acv-configuration/
│   │           ├── local/
│   │           │   └── V1_0__ACV_CONFIG_CREATE_TABLE.sql
│   │           ├── dev/
│   │           ├── test/
│   │           └── prod/
│   │
│   └── test/
│       └── java/com/fedex/acv/database/
│
├── helm-releases/
│   ├── nonprod-dev.yaml                 (Development deployment)
│   ├── nonprod-test.yaml                (Test deployment)
│   └── prod.yaml                        (Production deployment)
│
├── pom.xml                              (Maven configuration)
├── mvnw, mvnw.cmd                       (Maven wrapper)
└── README.md
```

---

## 4. Key Features

### 4.1 Database Configuration

- **Multi-Database Support:**
  - **Development:** H2 in-memory (fast, lightweight, no external DB)
  - **Production:** PostgreSQL (persistent, production-grade)
  - Easy switching via Spring profiles (local/dev/test/prod)

- **Connection Pooling:**
  - HikariCP for efficient connection management
  - Configurable pool size, timeouts, idle settings
  - Automatic connection reuse and cleanup

### 4.2 Flyway Database Migrations

- **Versioned Schema Changes:**
  - SQL scripts organized by version (V1_0, V1_1, V1_2, etc.)
  - Automatically executed on application startup
  - Automatic schema versioning table creation

- **Environment-Specific Migrations:**
  - Local, dev, test, production variants
  - Each environment can have different schema script locations
  - Baseline support for manual schema initialization

### 4.3 Spring Data JPA Integration

- **Object-Relational Mapping:**
  - Entity classes mapped to database tables
  - Automatic CRUD operations
  - Query DSL and custom query support

- **Features:**
  - Transaction management (@Transactional)
  - Lazy loading, eager loading strategies
  - Cascade operations and relationships

---

## 5. Quick Start

### 5.1 Build Locally

```bash
# 1. Clone repository
git clone https://github.com/FedEx/eai-3540813-database-service.git
cd eai-3540813-database-service

# 2. Build with Maven
mvn clean package

# Output: target/eai-3540813-database-service-1.1.2.jar
```

### 5.2 Run Locally (H2 Development)

```bash
# 1. Run with Maven
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"

# Or directly run JAR
java -Dspring.profiles.active=local -jar target/eai-3540813-database-service-1.1.2.jar

# 2. Application starts on http://localhost:8080
#    Management on http://localhost:8081

# 3. H2 Console available at http://localhost:8080/h2-console
```

### 5.3 Docker Build & Run

```bash
# 1. Build Docker image
docker build -t acv-database-service:1.1.2 .

# 2. Run container
docker run -e SPRING_PROFILES_ACTIVE=local \
  -p 8080:8080 \
  -p 8081:8081 \
  acv-database-service:1.1.2

# 3. Test service
curl http://localhost:8080/actuator/health
```

### 5.4 Deploy to Kubernetes

```bash
# 1. Deploy using Helm
helm install db-service ./helm-chart \
  -f helm-releases/prod.yaml \
  -n database-service

# 2. Verify deployment
kubectl get pods -n database-service
kubectl logs -f deployment/database-service -n database-service

# 3. Check service is healthy
kubectl exec -it pod/database-service-xxx -- \
  curl localhost:8081/actuator/health
```

---

## 6. Configuration Files

### 6.1 application-local.properties (Development)

**Location:** `src/main/resources/application-local.properties`

**Key Settings:**
```properties
spring.application.name=eai-3540813-database-service

# H2 In-Memory Database (development)
spring.datasource.acv.url=jdbc:h2:mem:acv-db
spring.datasource.acv.username=sa
spring.datasource.acv.password=password

# H2 Console (development only)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Flyway Migrations
spring.flyway.enabled=false
spring.datasource.acv.flyway.scripts=acv-configuration/local
```

### 6.2 application-prod.properties (Production)

**Location:** `src/main/resources/application-prod.properties`

**Key Settings:**
```properties
spring.application.name=eai-3540813-database-service

# PostgreSQL Database (production)
spring.datasource.acv.url=${POSTGRES_URL}
spring.datasource.acv.username=${POSTGRES_USER}
spring.datasource.acv.password=${POSTGRES_PASS}
spring.datasource.acv.driverClassName=org.postgresql.Driver

# Flyway Migrations
spring.flyway.enabled=true
spring.datasource.acv.flyway.scripts=acv-configuration/prod

# Connection Pooling (production)
spring.datasource.acv.hikari.maximum-pool-size=20
spring.datasource.acv.hikari.connection-timeout=30000
spring.datasource.acv.hikari.idle-timeout=600000
```

### 6.3 Helm Values (Environment Configurations)

#### Development: `helm-releases/nonprod-dev.yaml`
- **Replicas:** 1
- **Database:** H2 in-memory or dev PostgreSQL
- **Resources:** 256Mi memory, 0.25 CPU
- **Flyway:** Disabled or enabled for dev migrations

#### Production: `helm-releases/prod.yaml`
- **Replicas:** 1
- **Database:** PostgreSQL managed service
- **Resources:** 512Mi memory, 0.5 CPU request; 1Gi, 1 CPU limit
- **Monitoring:** Dynatrace injection enabled
- **Secrets:** From Kubernetes secrets (POSTGRES_USER, POSTGRES_PASS)

---

## 7. Key Dependencies

| Dependency | Version | Purpose |
|-----------|---------|---------|
| spring-boot-starter-web | 3.3.3 | REST endpoints, HTTP handling |
| spring-boot-starter-data-jpa | Latest | ORM, entity management |
| spring-boot-starter-jdbc | Latest | JDBC operations |
| flyway-core | 10.18.0 | Database migrations |
| postgres-driver | Latest | PostgreSQL connectivity |
| h2 | Latest | In-memory development database |
| Lombok | Latest | Boilerplate reduction |
| micrometer-tracing-bridge-brave | Latest | Distributed tracing |

---

## 8. Documentation Map

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

## 9. Key Concepts

### Database Service
Microservice managing all database operations for ACV platform. Handles schema initialization, connection pooling, and data access layer.

### Flyway
Database migration framework. Versioned SQL scripts (V1_0, V1_1, etc.) executed automatically on application startup. Maintains schema version history.

### Spring Data JPA
ORM framework abstracting SQL operations. Entity classes map to database tables; repository interfaces provide CRUD and custom query methods.

### Connection Pool
Cache of database connections reused by application. One-time setup costs (TCP connection, authentication); fast subsequent use.

### H2 Database
Lightweight, pure-Java relational database. Perfect for development; runs in-process or in-memory; no external server needed.

---

## 10. Common URLs & Paths

### Local Development
```
Application:    http://localhost:8080
Management:     http://localhost:8081
Health Check:   http://localhost:8081/actuator/health
Metrics:        http://localhost:8081/actuator/metrics
H2 Console:     http://localhost:8080/h2-console (local only)
```

### Production (Kubernetes)
```
Service DNS:    database-service.database-service.svc.cluster.local
Health:         http://database-service:8081/actuator/health
Metrics:        http://database-service:8081/actuator/metrics
```

---

## 11. Getting Started

**New to this project?** Start here:

1. **Read [onboarding.md](onboarding.md)** — Local setup & first steps
2. **Read [HLD.md](HLD.md)** — Understanding the architecture
3. **Read [LLD.md](LLD.md)** — Code structure exploration
4. **Read [services.md](services.md)** — Available operations
5. **Check [glossary.md](glossary.md)** — Definitions & concepts

**Quick Links:**
- [Spring Data JPA Reference](https://spring.io/projects/spring-data-jpa)
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Configuration Repository](../acv-config-repo/README.md)

---

## 12. Support & Contacts

**For Help:**
- Slack: `#database-engineering` channel
- Documentation: See [onboarding.md](onboarding.md) FAQ
- Issues: Create GitHub issue in this repository

**Escalations:**
- Database replication issues: Contact DBA team
- Performance concerns: Open platform engineering ticket

---

## Cross-References

- [Configuration Repository](../acv-config-repo/README.md) — Configuration files
- [ACV Validation Engine](../acv-validation-engine/README.md) — Uses database service
- [API Connector Service](../acv-api-connector/README.md) — Uses database service

---

**Last Updated:** 2026-04-02  
**Version:** 1.1.2  
**Audience:** Developers, DevOps Engineers, Platform Team, DBAs
