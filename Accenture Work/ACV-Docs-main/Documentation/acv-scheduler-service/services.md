# REST API & Service Contracts — ACV Scheduler Service

## Endpoint Inventory

| HTTP Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/job/{country}/{job}` | Execute job immediately | Yes |
| `GET` | `/job/newJob` | Schedule new cron job | Yes |
| `GET` | `/job/unschedule` | Stop scheduled job | Yes |
| `GET` | `/job/action/pause` | Pause job (keep definition) | Yes |
| `GET` | `/job/action/resume` | Resume paused job | Yes |
| `POST` | `/messages/send` | Publish event to Event Hub | Yes |
| `GET` | `/messages/consume` | Poll and process events | Yes |
| `GET` | `/ping` | Health check | No |
| `GET` | `/actuator/health` | Kubernetes liveness probe | No |
| `GET` | `/actuator/health/ready` | Kubernetes readiness probe | No |

---

## Job Execution Endpoints

### Execute Job Immediately

```http
GET /job/{country}/{job}
Authorization: Bearer {token}
```

**Path Parameters:**
- `country` (String) — Country code (US, DE, IN, GB)
- `job` (String) — Job name (CREDIT_REPORT_JOB, DOC_GEN_DAILY, etc.)

**Response:** `200 OK`
```json
{
  "status": "success",
  "jobId": "job-uuid-12345",
  "jobName": "DOC_GEN_DAILY",
  "country": "US",
  "executedAt": "2024-04-02T10:30:00Z",
  "message": "Job triggered successfully"
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "status": "failure",
  "jobName": "DOC_GEN_DAILY",
  "country": "US",
  "message": "Job execution failed: Timeout after 30 minutes",
  "timestamp": "2024-04-02T10:30:00Z"
}
```

---

## Job Scheduling Endpoints

### Schedule New Cron Job

```http
GET /job/newJob?jobName=DOC_GEN_DAILY&cronExpression=0%202%20*%20*%20*%20%3F&jobScheduleTime=2024-04-02
Authorization: Bearer {token}
```

**Query Parameters:**
- `jobName` (String, required) — Unique job identifier
- `cronExpression` (String, required) — Quartz cron expression
  - Example: `0 2 * * * ?` = 2 AM every day
  - Example: `0 3 ? * MON` = 3 AM every Monday
- `jobScheduleTime` (Date, required) — Start date (format: yyyy-MM-dd)

**Response:** `200 OK`
```json
{
  "status": "success",
  "jobName": "DOC_GEN_DAILY",
  "cronExpression": "0 2 * * * ?",
  "startDate": "2024-04-02",
  "nextFireTime": "2024-04-03T02:00:00Z",
  "message": "Job scheduled successfully"
}
```

**Cron Expression Format (Quartz):**
```
┌───────────── second (0-59)
│ ┌───────────── minute (0-59)
│ │ ┌───────────── hour (0-23)
│ │ │ ┌───────────── day of month (1-31)
│ │ │ │ ┌───────────── month (1-12)
│ │ │ │ │ ┌───────────── day of week (0-7, SUN-SAT)
│ │ │ │ │ │ └───────────── year (optional)
│ │ │ │ │ │ │
0 2 * * * ?     # 2 AM every day
0 0 12 * * ?    # Noon every day
0 0 0 1 * ?     # Every month first day
0 0 0 ? * MON   # Every Monday
0 0 0 * * 0,6   # Weekend days (Sat & Sun)
0 */30 * * * ?  # Every 30 minutes
```

---

### Unschedule Job

```http
GET /job/unschedule?jobName=DOC_GEN_DAILY
Authorization: Bearer {token}
```

**Query Parameters:**
- `jobName` (String, required) — Job identifier to stop

**Response:** `200 OK`
```json
{
  "status": "success",
  "jobName": "DOC_GEN_DAILY",
  "message": "Job unscheduled successfully"
}
```

---

### Pause Job

```http
GET /job/action/pause?jobName=DOC_GEN_DAILY
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "jobName": "DOC_GEN_DAILY",
  "message": "Job paused successfully",
  "pausedAt": "2024-04-02T10:30:00Z"
}
```

---

### Resume Job

```http
GET /job/action/resume?jobName=DOC_GEN_DAILY
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "jobName": "DOC_GEN_DAILY",
  "message": "Job resumed successfully",
  "resumedAt": "2024-04-02T11:00:00Z",
  "nextFireTime": "2024-04-03T02:00:00Z"
}
```

---

## Event Hub Endpoints

### Publish Event

```http
POST /messages/send
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "eventType": "DOCUMENT_GENERATED",
  "jobId": "job-uuid-12345",
  "transactionId": "txn-550e8400",
  "status": "SUCCESS",
  "payload": {
    "documentId": "doc-file-001",
    "blobUrl": "https://storage.blob.core.windows.net/documents/...",
    "fileSize": 250000,
    "generatedAt": "2024-04-02T10:30:00Z"
  }
}
```

**Response:** `202 Accepted`
```json
{
  "status": "accepted",
  "eventId": "evt-uuid-67890",
  "eventType": "DOCUMENT_GENERATED",
  "publishedAt": "2024-04-02T10:30:01Z",
  "message": "Event published to Event Hubs"
}
```

---

### Consume Events

```http
GET /messages/consume?consumerGroup=scheduler-processor&maxMessages=10
Authorization: Bearer {token}
```

**Query Parameters:**
- `consumerGroup` (String, optional) — Event Hub consumer group
- `maxMessages` (Integer, optional) — Max events to retrieve (default: 10)

**Response:** `200 OK`
```json
{
  "status": "success",
  "messagesReceived": 3,
  "messages": [
    {
      "eventId": "evt-1",
      "eventType": "DOCUMENT_GENERATED",
      "jobId": "job-1",
      "status": "SUCCESS",
      "receivedAt": "2024-04-02T10:30:00Z"
    },
    {
      "eventId": "evt-2",
      "eventType": "JOB_EXECUTION_FAILURE",
      "jobId": "job-2",
      "status": "FAILED",
      "error": "Timeout",
      "receivedAt": "2024-04-02T10:31:00Z"
    }
  ]
}
```

---

## Health & Monitoring Endpoints

### Health Check

```http
GET /ping
```

**Response:** `200 OK`
```json
{
  "status": "UP",
  "timestamp": "2024-04-02T10:30:00Z"
}
```

---

### Liveness Probe (Kubernetes)

```http
GET /actuator/health/live
```

**Response:** `200 OK`
```json
{
  "status": "UP"
}
```

---

### Readiness Probe (Kubernetes)

```http
GET /actuator/health/ready
```

**Response:** `200 OK`
```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "redis": { "status": "UP" },
    "eventHub": { "status": "UP" }
  }
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "status": "error",
  "code": "INVALID_CRON_EXPRESSION",
  "message": "Invalid cron expression: 0 2 * * * * extra",
  "timestamp": "2024-04-02T10:30:00Z",
  "path": "/job/newJob"
}
```

### Common Error Codes

| Code | HTTP Status | Meaning |
|------|---|---|
| `INVALID_CRON_EXPRESSION` | 400 | Malformed cron expression |
| `JOB_NOT_FOUND` | 404 | Job not found in Quartz |
| `JOB_ALREADY_EXISTS` | 409 | Job with same name already scheduled |
| `JOB_EXECUTION_TIMEOUT` | 504 | Job exceeded 30-minute limit |
| `EVENTBUB_CONNECTION_ERROR` | 503 | Event Hubs unreachable |
| `DATABASE_ERROR` | 500 | PostgreSQL query failed |
| `UNAUTHORIZED` | 401 | Invalid or missing JWT token |
| `FORBIDDEN` | 403 | Insufficient permissions |

---

## Authentication & Authorization

All `/job` and `/messages` endpoints require **OAuth2 JWT Bearer token** (from Okta).

Token must include claims:
- `sub` — Service principal
- `scope` — "job:execute", "job:schedule", "messages:publish"
- `aud` — "scheduler-service"

Example Header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Rate Limiting

- **Max jobs scheduled per hour:** 1000
- **Max concurrent executions:** 100 per instance
- **Event publishing rate:** 10,000 events/sec (Event Hubs tier limit)

---

**Last Updated:** April 2, 2026  
**Version:** 1.0
