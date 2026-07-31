# ACV Data Services - Terminology & Concepts Glossary

**Purpose:** Define domain-specific terms, acronyms, and concepts used throughout the service.

**Scope:** Data, Spring Framework, REST API, caching, authentication, and operations terminology.

---

## A

**Actuator** — Spring Boot feature providing management endpoints for monitoring and managing applications. Examples: /actuator/health, /actuator/metrics.

**Async** — Asynchronous; non-blocking operation. CompletableFuture enables async data processing.

**Authorization** — Process of determining what an authenticated user can access. Uses roles/scopes.

**Authentication** — Process of verifying user identity. Okta OAuth2 handles authentication.

---

## B

**Bean** — Spring Framework object instantiated, assembled, and managed by Spring container. Example: DataSource, CacheManager.

**Baseline** — Base version or starting point. Required when establishing baseline performance metrics.

**Bearer Token** — OAuth2 token format for API authentication. Format: `Authorization: Bearer {jwt-token}`.

**Batch Operations** — Processing multiple requests together in single API call.

---

## C

**Cache** — High-speed data storage reducing database queries. Redis used in ACV Data Services.

**Cache-Aside Pattern** — Check cache first; if miss, query DB and populate cache.

**Cacheable** — Spring annotation (@Cacheable) marking method results for caching.

**CompletableFuture** — Java class for asynchronous programming; enables parallel processing.

**Configuration-Driven Query** — SQL stored in database (ACV_CRUD_CONFIG_INFO), not in code.

**Controller** — Spring component handling HTTP requests and routing to services.

**Country Code** — Multi-tenant identifier (e.g., "US", "CA", "MX") for regional data isolation.

**CRUD** — Create, Read, Update, Delete; basic data operations.

**Composite Key** — Primary key using multiple fields. AcvCrudConfigInfo uses entity + operation type.

---

## D

**DAO** — Data Access Object; design pattern abstracting database access logic.

**DataSource** — JDBC interface providing database connections via HikariCP pool.

**Dependency Injection** — Design pattern providing dependencies at runtime rather than creating them.

**DTO** — Data Transfer Object; object for API transfer between services.

**Distributed Cache** — Cache across multiple instances (Redis) vs single-instance (in-memory).

---

## E

**Entity** — JPA-annotated class representing database table. AcvCrudConfigInfo stores configurations.

**Entity Manager** — JPA interface managing entity persistence operations.

**Endpoint** — HTTP URL + method combination. Example: `POST /api/v1/config`.

**Enricher** — Component transforming/enhancing data (add calculated fields, format values).

**Eviction** — Removing stale data from cache based on TTL or LRU policy.

---

## F

**Fallback** — Backup action when primary operation fails.

**Field Selection** — v2 feature allowing clients to specify which entity fields to return.

**Filter** — Criteria narrowing query results. Example: `{"id": 1, "status": "ACTIVE"}`.

**Fluent API** — Method chaining for readable code. Spring builders support fluent API.

---

## G

**GET** — HTTP method retrieving data; corresponds to "READ" in CRUD.

**Grafana** — Metrics visualization tool; displays Prometheus data as dashboards.

---

## H

**Health Check** — Endpoint reporting service health (database, cache, disk availability).

**Heap** — Java memory where objects are stored; managed by garbage collection.

**HikariCP** — High-performance JDBC connection pool; default in Spring Boot.

**Horizon** — Time boundary for metrics (e.g., 24-hour window, 7-day window).

---

## I

**Idempotent** — Operation producing same result regardless of repetition count. Safe to retry.

**Injection** — See Dependency Injection.

**Interface** — Java contract defining method signatures; classes implement interfaces.

**Integration Test** — Test covering multiple components end-to-end with database/cache.

---

## J

**JPA** — Java Persistence API; specification for ORM frameworks (Hibernate implements JPA).

**JSON** — JavaScript Object Notation; data format for APIs and configuration.

**JWT** — JSON Web Token; OAuth2 token format; contains claims (user, permissions).

---

## K

**Key** — Cache or database identifier. Example: "config-{entity}-{id}".

**Kubernetes** — Container orchestration; ACV deployments run in AKS (Azure Kubernetes Service).

---

## L

**Lazy Loading** — Deferring resource loading until needed; improves startup performance.

**Liveness Probe** — Kubernetes health check verifying process is running and responsive.

**Load Balancing** — Distributing requests across multiple instances (4 replicas in prod).

---

## M

**Mapping** — Relationship between entity and database columns; Hibernate handles ORM mapping.

**Metadata** — Data about data. Response metadata includes pagination, timestamps, etc.

**Microservice** — Small, focused service; ACV Data Services is microservice handling data access.

**Micrometer** — Metrics abstraction supporting Prometheus, Grafana, etc.

**Multi-Tenancy** — Single application serving multiple tenants (countries) with isolation.

---

## N

**Named Query** — Predefined database query given explicit name for reuse.

**Namespace** — Kubernetes concept isolating resources; data-services runs in its own namespace.

**Non-Blocking** — Operation not blocking other work; async/CompletableFuture enable non-blocking.

---

## O

**OAuth2** — Token-based authentication protocol; Okta implements OAuth2 for ACV.

**Operation Type** — CRUD operation classification: GET (read single), ALL (read all), ADD (create).

**ORM** — Object-Relational Mapping; technique mapping Java objects to database tables.

---

## P

**Pagination** — Limiting result sets to pages (offset/limit in v1, pageNumber/pageSize in v2).

**Parameterization** — Using placeholders in SQL preventing SQL injection. Example: WHERE id = ?

**Performance Budget** — Target metrics for latency, throughput, error rate.

**Pod** — Kubernetes smallest deployable unit; contains application container(s).

**Polling** — Repeatedly checking status; compared to event-driven alternatives.

**Pool** — Collection of reusable resources. Connection pool contains reusable DB connections.

**Prometheus** — Time-series metrics database; stores and queries application metrics.

---

## Q

**Query** — Database SELECT statement retrieving data.

**Query Plan** — Database execution strategy for query; optimized by indexes.

---

## R

**Readiness Probe** — Kubernetes health check verifying service ready for traffic.

**Redis** — In-memory data store used for distributed caching in ACV.

**Repository** — Spring Data interface abstracting data access operations.

**Repository Pattern** — DAO variant where repositories handle all DB operations per entity.

**Request** — HTTP message from client to server.

**Response** — HTTP message from server to client with data/status.

**REST** — Representational State Transfer; architectural style for web APIs.

**Retry** — Attempting failed operation again; important for transient failures.

---

## S

**Scope** — OAuth2 permission scope (e.g., "read:config", "write:config").

**Schema** — Database structure defining tables, columns, constraints.

**Serialization** — Converting objects to byte stream for storage/transmission.

**Service** — Spring component containing business logic; orchestrates controllers/database.

**Session** — Stateful connection between client/server; REST APIs typically stateless.

**Sorting** — Ordering results by field(s); v2 API supports sort parameter.

**Spring** — Popular Java framework; Spring Boot builds on Spring framework.

**SQL** — Structured Query Language; standard database query language.

**Stateless** — Each request contains all information needed; no server-side state stored.

---

## T

**Thread Pool** — Collection of reusable threads for concurrent processing.

**Throughput** — Requests processed per second; performance metric.

**Token** — OAuth2 credential proving user authentication; expires after TTL.

**Transaction** — Atomic database operation; either completely succeeds or fails.

**TTL** — Time-To-Live; duration before cached data expires (default 600s = 10 min).

---

## U

**Unit Test** — Test covering single code unit in isolation (mocked dependencies).

**URL** — Uniform Resource Locator; web address for REST endpoint.

---

## V

**Versioning** — API versions (v1 stable, v2 enhanced); enables gradual migration.

**Validation** — Checking request data correctness before processing.

---

## W

**Web Service** — Service providing functionality over HTTP(S).

**Webhook** — Callback endpoint triggered by external events.

---

## Y

**YAML** — Human-readable data format; used for configuration files.

---

## Z

**Zone** — Cloud availability zone; for disaster recovery across regions.

---

## Acronyms Reference

| Acronym | Meaning | Context |
|---------|---------|---------|
| **ACL** | Access Control List | Security/permissions |
| **API** | Application Programming Interface | Service contracts |
| **ACV** | Automated Compliance Validation | Platform domain |
| **AspectJ** | Aspect-oriented programming | Cross-cutting concerns |
| **AWS** | Amazon Web Services | Cloud provider |
| **AZF** | Azure Functions | Serverless computing |
| **AKS** | Azure Kubernetes Service | Cloud platform for ACV |
| **BI** | Business Intelligence | Data analytics |
| **CD** | Continuous Deployment | DevOps pipeline |
| **CI** | Continuous Integration | DevOps pipeline |
| **CRUD** | Create, Read, Update, Delete | Basic operations |
| **DAO** | Data Access Object | Design pattern |
| **DDL** | Data Definition Language | SQL commands |
| **DML** | Data Manipulation Language | SQL commands |
| **DNS** | Domain Name System | Network service |
| **DTO** | Data Transfer Object | API transfer object |
| **ETL** | Extract, Transform, Load | Data pipeline |
| **GC** | Garbage Collection | JVM memory management |
| **HPA** | Horizontal Pod Autoscaler | Kubernetes scaling |
| **HTTP** | Hypertext Transfer Protocol | Web protocol |
| **HTTPS** | HTTP Secure | Encrypted web protocol |
| **IdP** | Identity Provider | OAuth2 provider (Okta) |
| **JDBC** | Java Database Connectivity | Java DB API |
| **JPA** | Java Persistence API | ORM specification |
| **JSON** | JavaScript Object Notation | Data format |
| **JWT** | JSON Web Token | OAuth2 token |
| **JVM** | Java Virtual Machine | Java runtime |
| **K8s** | Kubernetes | Container orchestration |
| **LRU** | Least Recently Used | Cache eviction policy |
| **m-service** | Microservice | Small focused service |
| **mTLS** | mutual TLS | Certificate-based auth |
| **N/A** | Not Applicable | Not relevant |
| **OWASP** | Open Web Application Security | Security organization |
| **ORM** | Object-Relational Mapping | Persistence pattern |
| **P99** | 99th percentile | Performance metric |
| **RBAC** | Role-Based Access Control | Authorization model |
| **RCA** | Root Cause Analysis | Problem investigation |
| **REST** | Representational State Transfer | API architecture |
| **ROI** | Return on Investment | Business metric |
| **SLA** | Service Level Agreement | Availability commitment |
| **SQL** | Structured Query Language | Database language |
| **SRE** | Site Reliability Engineer | Operations specialist |
| **SSL** | Secure Sockets Layer | Encryption protocol |
| **TLS** | Transport Layer Security | Encryption protocol |
| **TTL** | Time To Live | Cache expiration |
| **URI** | Uniform Resource Identifier | Resource identifier |
| **URL** | Uniform Resource Locator | Web address |
| **UUID** | Universally Unique Identifier | Unique identifier |
| **YAML** | YAML Ain't Markup Language | Configuration format |

---

## Cross-References

- [README.md](README.md) — Project overview
- [HLD.md](HLD.md) — Architecture & concepts
- [LLD.md](LLD.md) — Implementation details
- [services.md](services.md) — API specifications
- [onboarding.md](onboarding.md) — Setup and first use

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** All Team Members, New Engineers, Stakeholders
