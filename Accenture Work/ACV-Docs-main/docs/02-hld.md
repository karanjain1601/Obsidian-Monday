# 02 — High-Level Design (HLD)

> Functional capabilities, logical components, external integrations, non-functional
> requirements, and key end-to-end flows for the ACV platform.
>
> **Last reviewed:** 2026-06-08 · See also [Architecture](01-architecture.md) · [LLD](03-lld.md)

## Table of Contents
- [Functional Overview](#functional-overview)
- [Capability Map](#capability-map)
- [Logical Components](#logical-components)
- [External Integrations](#external-integrations)
- [Non-Functional Requirements](#non-functional-requirements)
- [Key End-to-End Flows](#key-end-to-end-flows)

---

## Functional Overview

The ACV platform validates applicants during **account opening**. Its major capabilities:

1. **Identity verification** — OTP request/verify (`/v1/identity/request-otp`, `/verify-otp`).
2. **Record management** — Create and track validation records/transactions (`/v1/records`).
3. **Field validation** — Rule-based checks via the validation engine (`/validate`).
4. **Document processing** — OCR extraction & GenAI processing via the connector.
5. **Credit checks** — Credit report retrieval & validation (`/v1/creditValidation`, `/v1/creditReport`).
6. **Compliance document generation** — Template-driven PDF generation & blob storage.
7. **Asynchronous orchestration** — Scheduled jobs and Event Hub messaging.
8. **Configuration administration** — Countries, validation sets, templates via the portal UI.

---

## Capability Map

```mermaid
flowchart LR
    subgraph Intake
        A1["OTP / Identity"]
        A2["Create Record"]
    end
    subgraph Validation
        B1["Field Validation<br/>(validation-engine)"]
        B2["Document OCR<br/>(connector)"]
        B3["Credit Check<br/>(connector)"]
    end
    subgraph Output
        C1["Generate Documents<br/>(document-service)"]
        C2["Publish Events<br/>(scheduler)"]
        C3["Complete Transaction"]
    end
    A1 --> A2 --> B1
    A2 --> B2
    A2 --> B3
    B1 --> C1
    B2 --> C1
    B3 --> C1
    C1 --> C3
    C2 --> C3
```

---

## Logical Components

```mermaid
flowchart TB
    UI["Configuration Portal UI"] --> PROXY["Connector: Config-Portal Proxy"]
    Client["Client App"] --> ORCH["acv-services (Orchestrator)"]

    ORCH --> VE["Validation Engine"]
    ORCH --> CONN["API Connector"]
    ORCH --> DOC["Document Service"]
    ORCH --> SCH["Scheduler Service"]
    ORCH --> DATA["Data Services"]

    PROXY --> DATA
    PROXY --> SCH
    PROXY --> DOC

    CONN --> EXT["External: OCR / Credit / GenAI"]
    DATA --> PG[("PostgreSQL")]
    DOC --> BLOB["Blob Storage"]
    SCH --> EH["Event Hub"]
    ORCH --> REDIS[("Redis")]
```

The **config-portal proxy** in `api-connector-service` routes admin UI traffic to the
data-service, scheduler-service, and document-service (see
[`ConfigPortalProxyController.java`](../eai-3540813-api-connector-service/src/main/java/com/fedex/acv/connections/controller/ConfigPortalProxyController.java)).

---

## External Integrations

| Integration | Direction | Via | Purpose | Evidence |
|-------------|-----------|-----|---------|----------|
| Okta OIDC | Outbound | acv-services | Token issuance/validation | `/oktaToken/{service}` in [AuthTokenController](../eai-3540813-acv-services/src/main/java/com/fedex/acv/validations/controller/AuthTokenController.java) |
| OCR / Document Intelligence | Outbound | connector | Extract document data | `processOcrDocument`, `analyzeDocumentLayout` in connector |
| GenAI | Outbound | connector | AI-assisted OCR / structured output | `processOcrDocumentByGenAi`, `structuredOutput` |
| Credit bureau | Outbound | connector | Credit reports | `processCreditReport`, `fetchCreditReportData` |
| Event Hub | Bi-directional | scheduler / commons | Async events & jobs | [event-hub.tf](../eai-3540813-infra/modules/infra/event-hub.tf) |
| Blob Storage | Outbound | document-service | Store generated PDFs | [BlobStorageController](../eai-3540813-acv-document-service/src/main/java/com/fedex/acv/document/controllers/BlobStorageController.java) |

> Secret names for these integrations (e.g. `GENAI_CLIENT_ID`, `RUBIX_API_KEY`,
> `WREG_EVENTHUB_*`) are mounted from Key Vault — see
> [`acv-services/helm-releases/nonprod-dev.yaml`](../eai-3540813-acv-services/helm-releases/nonprod-dev.yaml).

---

## Non-Functional Requirements

| Attribute | Design | Evidence / Notes |
|-----------|--------|------------------|
| **Scalability** | Stateless services + Redis-externalized state; HPA-ready | `replicaCount`, stateless validation engine |
| **Performance** | Java 21 virtual threads; Redis caching (TTL 86,400,000 ms); connection pooling (pgbouncer) | [application.yml](../eai-3540813-config-repo/application.yml), [postgres.tf](../eai-3540813-infra/modules/infra/postgres.tf) |
| **Availability** | Liveness/readiness probes; multi-replica; PostgreSQL zone config | actuator health groups in `application.yml` |
| **Security** | OAuth2, Key Vault CSI, private endpoints, TLS 1.2 (Redis) | [Security](07-security.md) |
| **Observability** | Actuator, Prometheus, Micrometer tracing, Dynatrace | `management.*` in config; Helm annotation |
| **Resilience** | Async retry + OCR polling; Quartz misfire handling | retry endpoints in acv-services |
| **Configurability** | Centralized config + cache refresh (4h fixedDelay) | `cache.refresh.fixedDelay.in.milliseconds: 14400000` |

> Resource sizing (dev): requests 0.5 CPU / 1Gi, limits 1 CPU / 2Gi — see
> [helm-releases/nonprod-dev.yaml](../eai-3540813-acv-services/helm-releases/nonprod-dev.yaml).

---

## Key End-to-End Flows

### Flow 1 — Identity verification (OTP)

```mermaid
sequenceDiagram
    participant C as Client
    participant S as acv-services
    participant K as Redis
    participant O as Okta/SMS provider
    C->>S: POST /v1/identity/request-otp
    S->>O: trigger OTP delivery
    S->>K: store OTP state
    S-->>C: 200 (OTP sent)
    C->>S: POST /v1/identity/verify-otp
    S->>K: validate OTP
    S-->>C: 200 (verified) / 400 (invalid)
```

### Flow 2 — Document validation with OCR + retry

```mermaid
sequenceDiagram
    participant C as Client
    participant S as acv-services
    participant CN as api-connector-service
    participant X as OCR/GenAI provider
    participant VE as validation-engine
    C->>S: POST /v1/validation (with document)
    S->>CN: processOcrDocument / processOcrDocumentByGenAi
    CN->>X: submit document
    X-->>CN: job accepted (async)
    CN-->>S: pending
    S->>CN: pollOcrData (retry)
    CN->>X: fetchOcrData
    X-->>CN: extracted fields
    CN-->>S: OCR result
    S->>VE: POST /validate (fields + rules)
    VE-->>S: validation results
    S-->>C: validation outcome
    Note over S: On failure, /v1/asyncRetry or /v1/retryWithPollOcr
```

### Flow 3 — Credit validation & document generation

```mermaid
sequenceDiagram
    participant C as Client
    participant S as acv-services
    participant CN as api-connector-service
    participant CB as Credit Bureau
    participant D as document-service
    participant B as Blob Storage
    C->>S: POST /v1/creditValidation
    S->>CN: processCreditReport
    CN->>CB: request report
    CB-->>CN: credit report
    CN-->>S: report data
    S->>D: POST /{countryCode}/documents/generate
    D->>B: store generated PDF
    D-->>S: document reference
    S-->>C: POST /v1/completeTransaction result
```

### Flow 4 — Scheduled job + Event Hub

```mermaid
sequenceDiagram
    participant A as Admin/Trigger
    participant SC as scheduler-service
    participant Q as Quartz (qrtz_* tables)
    participant EH as Event Hub
    participant CM as acv-commons consumer
    A->>SC: GET /job/{country}/{job}
    SC->>Q: schedule job
    Q-->>SC: fired trigger
    SC->>EH: publish message
    EH-->>CM: consume event
    CM->>CM: process & persist
```

> Continue to the [Low-Level Design »](03-lld.md)
