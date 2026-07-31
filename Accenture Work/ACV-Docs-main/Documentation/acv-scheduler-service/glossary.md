# Glossary & Terminology — ACV Scheduler Service

## Business Domain Terms

| Term | Definition |
|------|---|
| **Job** | A unit of work to be executed (document generation, credit report, transaction closure) |
| **Job Definition** | Configuration specifying how to execute a job (name, action, retries, timeout) |
| **Trigger** | Specification of when a job should run (cron schedule or one-time) |
| **Cron Expression** | Time-based schedule in Quartz format (e.g., "0 2 * * * ?" = 2 AM daily) |
| **Job Execution** | Single instance of a job running (has start time, end time, status) |
| **Job Status** | State of a job (SCHEDULED, RUNNING, SUCCESS, FAILED, PAUSED) |
| **Retry** | Automatic re-execution of a failed job with delay |
| **Backoff** | Increasing delay between retries (exponential: 1s, 2s, 4s, 8s, ...) |
| **Checkpoint** | Durability marker in Event Hubs for processed messages |
| **Consumer Group** | Named group of message consumers sharing state (checkpoints) |
| **Job Action** | Implementation of a specific job type (DocumentGenerationAction, CreditReportAction) |
| **Country Code** | ISO 3166 code (US, DE, IN, GB) for regional job configuration |
| **Max Retries** | Maximum attempt count before marking job as failed |
| **Job Timeout** | Maximum duration allowed for job execution (e.g., 30 minutes) |

---

## Technical Acronyms

| Acronym | Meaning |
|---------|---------|
| **Quartz** | Open-source job scheduling library (not NASA) |
| **JDBC** | Java Database Connectivity (database driver protocol) |
| **AMQP** | Advanced Message Queuing Protocol (messaging standard) |
| **JWT** | JSON Web Token (OAuth2 bearer token) |
| **OAuth2** | Open Authorization 2.0 (authentication framework) |
| **REST** | Representational State Transfer (API architecture pattern) |
| **CRUD** | Create, Read, Update, Delete (database operations) |
| **ORM** | Object-Relational Mapping (JPA/Hibernate) |
| **JPA** | Java Persistence API (database abstraction) |
| **JTA** | Java Transaction API (distributed transactions) |
| **TLS** | Transport Layer Security (HTTPS encryption) |
| **UUID** | Universally Unique Identifier |
| **TTL** | Time-to-Live (cache expiration) |
| **SLA** | Service Level Agreement (availability, latency targets) |
| **RTO** | Recovery Time Objective (downtime tolerance) |
| **RPO** | Recovery Point Objective (data loss tolerance) |

---

## Quartz-Specific Terms

| Term | Definition |
|------|---|
| **Scheduler** | Quartz component that manages jobs and triggers |
| **Job** | Quartz interface for work to execute |
| **JobDetail** | Metadata about a Quartz job (name, group, class, data) |
| **Trigger** | Quartz component specifying when a job runs |
| **CronTrigger** | Trigger based on cron expression |
| **SimpleTrigger** | Trigger for one-time or interval-based execution |
| **JobStore** | Quartz persistence layer (RAMJobStore, JDBCJobStore) |
| **Listener** | Observer pattern hook into Quartz job lifecycle |
| **Misfire** | Job missed its fire time (handled via misfire policy) |
| **Clustered** | Multiple Scheduler instances coordinating via database |
| **Standby** | Scheduler paused but ready to resume |

---

## Event Hub & Messaging Terms

| Term | Definition |
|---|---|
| **Event Hub** | Azure cloud service for event streaming |
| **Partition** | Parallel stream within Event Hub (scaling unit) |
| **Producer** | Client publishing events to Event Hub |
| **Consumer** | Client receiving events from Event Hub |
| **Consumer Group** | Named set of consumers sharing consumption state |
| **Offset** | Position within a partition (for resuming) |
| **Checkpoint** | Saved offset persisted to blob storage |
| **Event** | Single message payload (JSON) |
| **Event Type** | Classification of event (JOB_STARTED, JOB_SUCCESS, etc.) |
| **Retention** | How long Event Hub keeps events (e.g., 24 hours) |

---

## Service Integration Terms

| Term | Definition | Related Service |
|------|---|---|
| **Job Orchestration** | Scheduling and execution of workflows | Scheduler Service |
| **Document Generation** | Creating documents from templates | document-service |
| **Data Retrieval** | Fetching business data | data-services |
| **Core ACV Services** | Main business logic | acv-services |
| **Event Producer** | Publishing job results | Scheduler Service |
| **Event Subscriber** | Consuming job events | acv-services, document-service |
| **Distributed Tracing** | End-to-end request tracking | Micrometer + acv-commons |
| **Shared Library** | Common utilities (HTTP, OAuth2, logging) | acv-commons |

---

## Infrastructure & Deployment Terms

| Term | Definition |
|---|---|
| **Pod** | Kubernetes smallest deployable unit (typically 1 container) |
| **Container** | Docker image instance |
| **Cluster** | Multiple Kubernetes nodes running pods |
| **Namespace** | Kubernetes logical isolation (dev, test, prod) |
| **Service** | Kubernetes abstraction for stable pod network address |
| **Ingress** | Kubernetes entry point for external traffic |
| **ConfigMap** | Kubernetes config data storage (non-secret) |
| **Secret** | Kubernetes sensitive data storage (passwords, keys) |
| **HPA** | Horizontal Pod Autoscaler (scale based on metrics) |
| **Replica** | Copy of a pod (for redundancy/scale) |
| **Health Probe** | Liveness/Readiness check for pod status |
| **Helm** | Kubernetes package manager |
| **Helm Chart** | Template for Kubernetes deployment |
| **Database Failover** | Automatic switch to standby database on primary failure |

---

## Configuration & Monitoring Terms

| Term | Definition |
|---|---|
| **Application Profile** | Spring Boot active profile (dev, test, prod, local) |
| **Properties File** | application.yml or application.properties config |
| **Environment Variable** | OS-level config (e.g., $OKTA_CLIENT_ID) |
| **Actuator** | Spring endpoint for metrics and health checks |
| **Prometheus** | Time-series metrics database |
| **Micrometer** | Metrics abstraction library (works with Prometheus) |
| **Distributed Trace** | Request flow across multiple services |
| **Span** | Single operation within a distributed trace |
| **Trace ID** | Unique identifier for full request flow |
| **Alert Rule** | Condition triggering notification (e.g., error rate > 5%) |

---

## Retry & Resilience Terms

| Term | Definition |
|---|---|
| **Exponential Backoff** | Retry delay grows: 1s, 2s, 4s, 8s, ... |
| **Linear Backoff** | Retry delay constant: 5s, 5s, 5s, ... |
| **Max Retries** | Total attempt limit (e.g., 3 tries) |
| **Circuit Breaker** | Pattern to stop retrying after threshold exceeded |
| **Jitter** | Random variance added to backoff (prevents thundering herd) |
| **Idempotency** | Safe to retry without side effects |
| **Transient Failure** | Temporary error expected to resolve (e.g., timeout) |
| **Permanent Failure** | Error unlikely to resolve via retry (e.g., bad input) |

---

## Related Documentation

- [README.md](README.md) — Project overview and quick start
- [HLD.md](HLD.md) — Architecture and system design
- [services.md](services.md) — REST API contracts
- [code-mapping.md](code-mapping.md) — Class structure
- [onboarding.md](onboarding.md) — Developer setup guide

---

**Last Updated:** April 2, 2026  
**Version:** 1.0
