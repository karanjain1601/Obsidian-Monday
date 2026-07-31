# Glossary & Terminology — ACV Commons Library

## Business Domain Terms

### Automated Compliance Validation (ACV)
The overarching platform for automating compliance checks and validation workflows across multiple business domains (credit validation, identity verification, etc.).

### Compliance Check  
An automated validation process that verifies whether data, transactions, or entities meet specific regulatory or business requirements.

### Validation Rule
A codified business rule that determines pass/fail criteria for compliance checks. Examples: "SSN must match identity records", "Account age > 30 days".

### Country Code  
ISO 3166-1 alpha-2 code representing geographic jurisdiction (US, UK, IN, CA, etc.). Used to route compliance rules by geography.

### Data Type
Classification of data being validated: `AADHAAR-OTP` (identity verification), `CREDIT_PROFILE` (credit data), `DOCUMENT` (scanned documents), `OCR_DATA` (optical character recognition output).

### Transaction ID / Correlation ID
Unique identifier (UUID) that tracks a single business transaction across multiple services and log aggregation systems. Propagated via `x-transaction-id` header.

### Pipeline / Workflow  
Sequential or parallel series of compliance checks executed against an entity. Example: "Identity Verification Pipeline" → OSV check → Address match → KYC validation.

---

## Technical Acronyms

### ACV  
Automated Compliance Validation (platform name)

### JWT  
JSON Web Token — a cryptographically signed token containing claims (identity, permissions, expiry). Used for authentication between services.

### OAuth2  
Industry standard authorization protocol. ACV uses Okta as OAuth2 provider for token issuance.

### RBAC  
Role-Based Access Control — authorization model where permissions are grouped into roles (ADMIN, SERVICE, USER).

### PII  
Personally Identifiable Information — sensitive data (SSN, credit card, address) that must be masked in logs and encrypted in transit.

### WREG  
Custom request signing protocol used between ACV services. Signs requests with EC (Elliptic Curve) private keys to verify service identity.

### ECDSA  
Elliptic Curve Digital Signature Algorithm — cryptographic signing algorithm used for WREG request signing.

### mTLS  
Mutual TLS — bidirectional certificate-based authentication. Both client and server present certificates.

### TLS  
Transport Layer Security — encryption protocol protecting data in transit. Current: TLS 1.2+.

### REST  
Representational State Transfer — HTTP-based API architecture style using GET, POST, PUT, DELETE verbs on resource endpoints.

### AMQP  
Advanced Message Queuing Protocol — protocol used by Azure Event Hub for message publishing and consumption.

### HPA  
Horizontal Pod Autoscaler — Kubernetes component that automatically scales pod replicas based on metrics (CPU, memory).

### PDB  
Pod Disruption Budget — Kubernetes policy ensuring minimum pod availability during voluntary disruptions (maintenance).

### AKS  
Azure Kubernetes Service — Managed Kubernetes platform on Microsoft Azure.

### ACR  
Azure Container Registry — Managed Docker image registry on Azure.

### MDC  
Mapped Diagnostic Context — SLF4J feature for storing request context (transaction ID, user ID) in thread-local storage for log correlation.

### SLA  
Service Level Agreement — commitment (uptime, latency, availability) between service provider and consumer.

### RTO  
Recovery Time Objective — target time to restore service after failure.

### RPO  
Recovery Point Objective — acceptable data loss window (e.g., "restore from backup < 1 hour old").

### CI/CD  
Continuous Integration / Continuous Deployment — automated pipeline for building, testing, and deploying code.

### IaC  
Infrastructure as Code — defining infrastructure (networks, servers, storage) in code (Terraform, Helm) for reproducible provisioning.

---

## Service Names

| Service | Purpose | Technology |
|---------|---------|-----------|
| `acv-services` | Core ACV business logic | Java Spring Boot |
| `acv-validation-engine` | Rules engine for compliance validation | Java Spring Boot |
| `acv-scheduler-service` | Job scheduling and orchestration | Java Spring Boot |
| `api-connector-service` | Integration with external APIs | Java Spring Boot |
| `database-service` | Database operations and ORM | Java Spring Boot |
| `data-services` | Data layer services | Java Spring Boot |
| `acv-document-service` | Document storage, retrieval, OCR | Java Spring Boot |
| `acv-commons` | Shared utilities library | Java library (Maven) |
| `config-server` | Centralized configuration management | Spring Cloud Config Server |
| `configuration-portal-ui` | Admin UI for configuration | Angular TypeScript |

---

## Role / Team Abbreviations

| Abbreviation | Full Name | Responsibility |
|---|---|---|
| `ACV Team` | Automated Compliance Validation Team | Owns ACV platform and all microservices |
| `Platform Team` | Platform Engineering | Owns Kubernetes clusters, networking, monitoring |
| `SecOps` | Security Operations | Owns secrets management, compliance, penetration testing |
| `DataOps` | Data Operations | Owns database provisioning, backups, performance tuning |
| `DevOps` | Development Operations | Owns CI/CD pipelines, artifact repositories |

---

## Configuration & Environment Terms

### Profile / Environment
- **local** — Developer's machine (disables security, uses mock services)
- **dev** — Development environment (Azure, shared by team)
- **test** — Testing environment (Azure, higher security)
- **staging** — Pre-production environment (mirrors prod)
- **prod** — Production environment (customers/users accessing)

### Configuration Server
Centralized Spring Cloud Config Server pulling YAML properties from Git repository (`config-repo`) and distributing to all services at startup.

### Spring Boot Profile
Mechanism for loading environment-specific configuration. Example: `application-dev.yml` loaded when `spring.profiles.active=dev`.

### Secrets
Sensitive values (database passwords, API keys, connection strings) stored in Azure Key Vault and injected as Kubernetes Secrets.

### ConfigMap
Kubernetes resource storing non-sensitive configuration (environment variables, property files) mounted as volumes or injected as env vars.

---

## Deployment & Infrastructure Terms

### Namespace
Kubernetes logical isolation unit. ACV uses: `dev`, `test`, `prod` namespaces within single AKS cluster.

### Pod  
Smallest deployable unit in Kubernetes. Contains one or more containers (in ACV, typically one application container).

### Deployment
Kubernetes workload controller managing pod replicas, rollouts, rollbacks.

### Service  
Kubernetes abstraction providing stable DNS name and load balancing for pod access. Example: `data-service.default.svc.cluster.local`.

### Ingress  
Kubernetes resource defining external HTTP/HTTPS routes to services (DNS → pod).

### Helm Chart
Templated Kubernetes manifests organized as packages. ACV services include `helm-releases/nonprod-dev.yaml` with environment-specific values.

### Container Image  
Docker image containing application code, dependencies, runtime. Tagged with service name and version (e.g., `acv-services:1.0.0`).

---

## Data & Cache Terms

### Cache
In-memory data store for frequently accessed data (tokens, user profiles). ACV uses Redis backed by Spring Cache abstraction.

### Cache Entry
Key-value pair in cache. Example: `cache-name: "token-cache"`, `key: "acv-service"`, `value: "{JWT token}"`.

### Cache Eviction  
Process of removing entries from cache to make room for new data. Policies: `LRU` (least recently used), `TTL` (time-to-live), `FIFO` (first-in-first-out).

### Cache Hit  
Cache lookup succeeds and returns value. Indicator of cache effectiveness.

### Cache Miss  
Cache lookup fails, requiring fetch from original source (database, auth provider). Should be minimized.

### TTL (Time-To-Live)  
Duration an entry remains valid in cache before automatic expiration. Example: JWT tokens cached with TTL matching token expiry.

### Redis  
Open-source in-memory data structure store used by ACV as cache backend. Supports clustering, replication, persistence.

### Connection Pool  
Reusable pool of database/HTTP connections to avoid expensive connect/disconnect overhead. ACV configures pools for DB (20 connections), HTTP (50 connections), cache (20 connections).

---

## Messaging & Event Terms

### Event Hub / Message Broker
Azure Event Hub provides publish-subscribe messaging at scale. ACV services publish and consume compliance events.

### Producer / Publisher  
Service or component that sends/publishes messages to Event Hub. Example: `acv-services` publishes "COMPLIANCE_CHECK_COMPLETED" events.

### Consumer / Subscriber  
Service or component that receives and processes messages from Event Hub. Example: `acv-scheduler` consumes messages to trigger follow-up actions.

### Event  
A message representing something that happened. Example: `{"eventType": "COMPLIANCE_CHECK_STARTED", "transactionID": "...", "countryCode": "US"}`.

### Partition  
Event Hub parallelization unit. Messages in same partition maintain order; different partitions may be processed in parallel. ACV Event Hub configured with 32 partitions.

### Consumer Group  
Logical grouping of consumers for a topic. Each consumer group maintains independent offset (checkpoint) for message consumption.

### Checkpoint / Offset  
Position marker indicating which messages have been processed. Stored in Azure Blob Storage for durability. Allows resuming from where consumer left off after restart.

### Exactly-Once Semantics  
Message processing guarantee: each message processed exactly once, never duplicated or lost. Achieved via durable checkpointing.

---

## Logging & Observability Terms

### MDC (Mapped Diagnostic Context)
Thread-local storage for request context (transaction ID, country code) that appears in all logs for this request. Enables log correlation across services.

### Structured Logging
Logs formatted as JSON with key-value pairs, enabling automated parsing and analysis. Example: `{"timestamp": "...", "level": "INFO", "message": "...", "transactionID": "..."}`.

### Log Aggregation  
Centralized collection of logs from all pods/services into single repository (ELK, Splunk, Log Analytics) for analysis and searching.

### Observability
Ability to understand system behavior through logs, metrics, and traces. Key pillars: Logging, Metrics, Tracing.

### Distributed Tracing  
End-to-end tracking of request across multiple services. Uses Micrometer (OpenTelemetry standard) to capture and correlate spans.

### Span  
Unit of work within distributed trace. Example: HTTP request to acv-service is a span; calling data-service from within acv-service is a child span.

### Trace Context  
Set of metadata propagated across service calls: trace ID, span ID, parent span ID. Formats: W3C Trace Context, Jaeger, Zipkin.

### PII Masking  
Automatic redaction of sensitive fields in logs. Example: Credit card number logged as `****4567`, SSN as `***-**-1234`. Configured via `LogUtils.maskString()`.

### Health Check
Endpoint returning service health status (UP, DOWN, DEGRADED). Used by Kubernetes for liveness and readiness probes.

---

## Security Terms

### Authentication  
Verifying identity: "Are you who you claim to be?" ACV uses OAuth2/JWT with Okta.

### Authorization / Access Control  
Verifying permissions: "Are you allowed to do this?" ACV uses RBAC (roles mapped to JWT claims).

### Token  
Cryptographic proof of authentication. JWT tokens contain claims (identity, roles) signed by issuer (Okta).

### Bearer Token  
Authentication scheme where client includes token in `Authorization: Bearer {token}` header.

### Token Expiry  
Time limit on token validity. After expiry, new token must be requested from auth provider. ACV tokens typically expire after 1 hour.

### Refresh Token  
Long-lived token used to obtain new short-lived access tokens without re-authenticating. ACV uses service-level token refresh.

### Service Account  
Non-human identity (machine, service) with permissions for service-to-service communication. Example: acv-services service account.

### Credentials  
Secrets used to authenticate (password, API key, private key). ACV services use OAuth2 credentials to obtain JWT tokens.

### Secrets Management  
Secure storage and rotation of credentials. ACV uses Azure Key Vault.

### Certificate  
Digital document proving identity of server. Used for TLS/HTTPS and client mutual authentication (mTLS).

### Public Key Infrastructure (PKI)  
System for managing certificates and keys. Enables TLS and digital signatures.

---

## Reliability Terms

### Retry  
Automatic retry of failed operation with backoff strategy. ACV implements exponential backoff to handle transient failures gracefully.

### Backoff  
delay strategy between retries. Linear (fixed delay), Exponential (delay *= multiplier), Jittered (randomized).

### Circuit Breaker  
Pattern that fails fast when downstream service is unhealthy. Prevents cascading failures. Not currently implemented in acv-commons (future enhancement).

### Timeout  
Maximum time to wait for operation completion. ACV uses HTTP request timeout of 30 seconds, configurable per service.

### Fallback  
Alternative behavior when primary operation fails. Example: return stale cached data if service unavailable.

### Bulkhead Pattern  
Isolation pattern separating resources to prevent single failure from affecting entire system. Example: separate thread pools per service.

### Graceful Degradation  
Service continues operating with reduced functionality when some dependencies fail. Example: cache miss doesn't break request, just slower.

### SLA Compliance  
Meeting agreed-upon availability and latency targets. ACV target: 99.9% uptime, P95 latency < 200ms.

---

**Last Updated:** April 2, 2026  
**Version:** 1.0
