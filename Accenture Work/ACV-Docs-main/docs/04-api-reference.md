# 04 — API Reference

> Consolidated catalog of HTTP endpoints exposed across ACV services, generated from the
> controllers in each repository. Request/response schemas are referenced to source where the
> full DTO was not inlined.
>
> **Last reviewed:** 2026-06-08 · See also [LLD](03-lld.md) · [Security](07-security.md)

## Conventions

- **Auth:** Most endpoints require an Okta OAuth2 bearer token. The following path patterns are
  **public** (no auth) per [`application.yml`](../eai-3540813-config-repo/application.yml):
  `/actuator/**`, `/swagger-ui/**`, `/v3/api-docs/**`, `/oktaToken/**`, `/commons/**`,
  `/config-portal/**`.
- **Interactive docs:** Each Java service exposes Swagger UI at `/swagger-ui.html` and the
  OpenAPI document at `/v3/api-docs` (springdoc).
- **Management:** Actuator endpoints are served on port **8081** (`/actuator/**`).

> TODO: confirm — exact request/response JSON schemas should be taken from each service's live
> `/v3/api-docs`; below lists verified method + path + intent from controller annotations.

---

## acv-services

Base controllers under `com.fedex.acv.validations.controller`.

### AccountCreationValidationsController
| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/identity/request-otp` | Trigger OTP generation |
| POST | `/v1/identity/verify-otp` | Verify submitted OTP |
| POST | `/v1/records` | Create validation record(s) |
| GET | `/v1/asyncRetry` | Retry an async validation |
| GET | `/v1/retryWithPollOcr` | Retry with OCR polling |
| POST | `/v1/validation` | Run a validation stage |
| POST | `/v1/creditValidation` | Run credit validation |
| POST | `/v1/completeTransaction` | Finalize a transaction |
| POST | `/v1/processCreditData` | Process credit data callback |
| POST | `/v1/publishMsg` | Publish a message to Event Hub |
| POST | `/v1/generateDocuments` | Trigger document generation |
| POST | `/v1/creditReport` | Fetch/process a credit report |

### ConfigurationController — base `/config/v1`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/config/v1/countries` | List configured countries |
| GET | `/config/v1/country/{countryCode}/documents` | List documents for a country |

### AuthTokenController
| Method | Path | Description |
|--------|------|-------------|
| GET | `/oktaToken/{service}` | Obtain an Okta token for a downstream service (text/plain) |

> Source: [controller package](../eai-3540813-acv-services/src/main/java/com/fedex/acv/validations/controller).

---

## api-connector-service

Under `com.fedex.acv.connections.controller`.

### ConnectionsController
| Method | Path | Description |
|--------|------|-------------|
| POST | `fetchData` | Generic external data fetch |
| POST | `processOcrDocument` | Submit document for OCR |
| POST | `fetchOcrData` | Fetch OCR result |
| POST | `pollOcrData` | Poll for OCR completion |
| POST | `processCreditReport` | Request a credit report |
| POST | `fetchCreditReportData` | Fetch credit report data |
| POST | `pollCreditData` | Poll for credit data |
| GET | `fetchProductIds/{description}/{provider}` | Resolve product IDs for a provider |
| POST | `publishMsg` | Publish a message |
| POST | `analyzeDocumentLayout` | Analyze document layout |
| POST | `structuredOutput` | Get structured output |
| POST | `processOcrDocumentByGenAi` | OCR via GenAI |

### ConfigPortalProxyController — base `/config-portal`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/config-portal/data-service/{endPoint}` | Proxy to data-services |
| GET | `/config-portal/scheduler-service/{*endPoint}` | Proxy to scheduler-service |
| POST | `/config-portal/document-service/{countryCode}/generateDocument` | Proxy to document-service |

> Source: [ConnectionsController.java](../eai-3540813-api-connector-service/src/main/java/com/fedex/acv/connections/controller/ConnectionsController.java),
> [ConfigPortalProxyController.java](../eai-3540813-api-connector-service/src/main/java/com/fedex/acv/connections/controller/ConfigPortalProxyController.java).

---

## acv-validation-engine

| Method | Path | Request | Response | Description |
|--------|------|---------|----------|-------------|
| POST | `/validate` | `ValidationDto` | `Boolean` (200) | Evaluate validation rules |

> Source: [ValidationEngineController.java](../eai-3540813-acv-validation-engine/src/main/java/com/fedex/acv/validation/engine/controller/ValidationEngineController.java).

---

## acv-document-service

### TemplateManagementController — base `/template/api/v1`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/sections/_search` | Search template sections |
| POST | `/sections` | Create section |
| POST | `/sections/{sectionId}` | Update section |
| POST | `/{countryCode}/templates` | Create template |
| GET | `/{countryCode}/templates` | List templates |
| POST | `/{countryCode}/template_mappings` | Create template mapping |
| GET | `/data/{transactionId}` | Get template data for a transaction |
| POST | `/{countryCode}/document/preview` | Preview document (PDF/JSON) |

### DocumentManagementController — base `/api/v1`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/{countryCode}/documents/generate` | Generate compliance document |
| POST | `/{countryCode}/documents/generateAdhoc` | Generate ad-hoc document |
| POST | `/{countryCode}/documents/download` | Download document |
| POST | `/{countryCode}/documents/preview` | Preview document (PDF) |
| GET | `/{countryCode}/{transactionId}/{uploadPath}/{fileName}` | Retrieve a stored file |

### BlobStorageController — base `/blob/api/v1/storage`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/upload` | Upload a file (multipart/form-data) |
| GET | `/download/{fileName}` | Download a file (octet-stream) |
| DELETE | `/delete/{fileName}` | Delete a file |

> Source: [document controllers](../eai-3540813-acv-document-service/src/main/java/com/fedex/acv/document/controllers).

---

## acv-scheduler-service

### AcvQuartzController — base `/job`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/{country}/{job}` | Schedule/run a named job for a country |
| GET | `/newJob` | Create a new job |
| GET | `/unschedule` | Unschedule a job |
| GET | `/action/pause` | Pause a job |
| GET | `/action/resume/{jobName}` | Resume a job |
| GET | `/getAllJobs` | List all jobs |
| GET | `/checkJobName` | Check if a job name exists |
| GET | `/status/isJobRunning` | Is a job running |
| GET | `/status/jobState` | Get job state |
| GET | `/action/stop` | Stop a job |
| GET | `/action/start` | Start a job |

### MessagesController — base `/messages`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/random/{count}` | Produce N random messages |
| POST | `/send` | Send a message to Event Hub |
| GET | `/read` | Read messages |

### PingController
| Method | Path | Description |
|--------|------|-------------|
| GET | `/ping` | Liveness ping |

> Source: [scheduler controllers](../eai-3540813-acv-scheduler-service/src/main/java/com/fedex/acv/scheduler/controllers).

---

## data-services

### DataController — base `/api/v1`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/{entity}` | Generic create/read for an entity |
| POST | `/{entity}/{ctryCd}` | Entity operation scoped to a country |
| POST | `list/{entityList}` | Batch operation over multiple entities |

### DataControllerV2 — base `/api/v2`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/GET/{entity}` | Read an entity |
| POST | `/ADD/{entity}` | Add an entity |

> Source: [data-services controllers](../eai-3540813-data-services/src/main/java/com/fedex/acv/data/controller).

---

## Error & Response Conventions

Spring Boot default error structure (`timestamp`, `status`, `error`, `path`) applies unless a
service defines a `@ControllerAdvice`. Validation failures (Jakarta Bean Validation via
`spring-boot-starter-validation`) return `400 Bad Request`.

> TODO: confirm — per-service `@ControllerAdvice` / custom error models were not enumerated;
> verify against each service's exception-handling package.

> Continue to the [Data & Database Design »](05-data-design.md)
