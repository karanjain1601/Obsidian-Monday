# ACV API Connector Service - Service Contracts & API Reference

**Purpose:** Document all REST endpoints, request/response schemas, provider integrations, and data contracts.

**Scope:** API contracts only — specification of what the service exposes.

---

## 1. API Overview

### Service Endpoint

| Property | Value |
|----------|-------|
| **Base URL** | http://api-connector:8082 (in-cluster) or http://localhost:8082 (dev) |
| **Version** | 1.1.8 |
| **Protocol** | HTTP/1.1 (REST) |
| **Content-Type** | application/json, multipart/form-data |
| **Authentication** | Okta OAuth2 via API Gateway |

### Endpoints Summary

```
POST /fetchData
POST /processOcrDocument
POST /fetchOcrData
POST /pollOcrData
POST /processCreditReport
POST /fetchCreditReportData
POST /pollCreditData
GET /fetchProductIds/{description}/{provider}
POST /analyzeDocumentLayout
POST /structuredOutput
POST /processOcrDocumentByGenAi
POST /publishMsg
POST /generateDocument
GET /health
```

---

## 2. Request Specification

### Common Request Frame

```json
{
  "transactionUUID": "550e8400-e29b-41d4-a716-446655440000",
  "countryCode": "US",
  "dataType": "ID_VERIFICATION|OCR|CREDIT_REPORT|BACKGROUND_CHECK|ETC",
  "opsType": "SYNC|ASYNC",
  "requestBody": { /* provider-specific data */ },
  "retryCount": 0,
  "validationType": "optional",
  "validateFromGenAI": false
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|------------|
| **transactionUUID** | UUID | Yes | Unique transaction identifier for tracing |
| **countryCode** | String | Yes | Country code (US, CA, MX, UK, etc.) |
| **dataType** | String | Yes | Type of data: OCR, CREDIT_REPORT, ID_VERIFICATION, etc. |
| **requestBody** | Object | Yes | Provider-specific payload (varies by dataType) |
| **opsType** | String | No | SYNC (default) or ASYNC operation |
| **retryCount** | Integer | No | Number of retry attempts (0-5) |
| **validationType** | String | No | Validation rule to apply |
| **validateFromGenAI** | Boolean | No | Use GenAI for validation (default: false) |

---

## 3. Endpoint Details

### 3.1 POST /fetchData

**Purpose:** Fetch generic data from provider (synchronous).

**Request:**
```json
{
  "transactionUUID": "txn-001",
  "countryCode": "US",
  "dataType": "ID_VERIFICATION",
  "requestBody": {
    "documentNumber": "AB123456",
    "documentType": "DRIVERS_LICENSE",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Response (200 OK):**
```json
{
  "data": {
    "verified": true,
    "matchScore": 0.95,
    "expiryDate": "2028-12-31"
  },
  "status": "SUCCESS",
  "timestamp": "2026-04-02T10:15:00Z"
}
```

**Error Response (400/500):**
```json
{
  "status": "FAILURE",
  "errorCode": "INVALID_DOCUMENT",
  "message": "Document number format invalid",
  "timestamp": "2026-04-02T10:15:00Z"
}
```

---

### 3.2 POST /processOcrDocument

**Purpose:** Upload document for OCR processing (asynchronous).

**Request:**
```json
{
  "transactionUUID": "txn-002",
  "countryCode": "US",
  "dataType": "OCR",
  "opsType": "ASYNC",
  "requestBody": {
    "document": "BASE64_ENCODED_PDF_OR_IMAGE",
    "documentType": "DRIVERS_LICENSE",
    "mimeType": "application/pdf"
  }
}
```

**Response (200 OK):**
```json
{
  "data": {
    "asyncId": "async-550e8400-e29b-41d4-a716",
    "status": "PROCESSING",
    "estimatedWaitSeconds": 30
  },
  "status": "IN_PROGRESS",
  "timestamp": "2026-04-02T10:15:00Z"
}
```

---

### 3.3 POST /fetchOcrData

**Purpose:** Retrieve completed OCR results (requires asyncId from /processOcrDocument).

**Request:**
```json
{
  "transactionUUID": "txn-002",
  "countryCode": "US",
  "dataType": "OCR",
  "requestBody": {
    "asyncId": "async-550e8400-e29b-41d4-a716"
  }
}
```

**Response (200 OK - Still Processing):**
```json
{
  "data": {},
  "status": "IN_PROGRESS",
  "message": "Still processing, check again in 10 seconds"
}
```

**Response (200 OK - Completed):**
```json
{
  "data": {
    "extracted": {
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1985-05-15",
      "documentNumber": "AB123456",
      "expiryDate": "2028-12-31",
      "address": "123 Main St, City, ST 12345"
    },
    "confidence": 0.98,
    "processingTimeMs": 2500
  },
  "status": "SUCCESS"
}
```

---

### 3.4 POST /pollOcrData

**Purpose:** Poll for async OCR results (internal use).

**Request:**
```json
{
  "asyncId": "async-550e8400-e29b-41d4-a716",
  "checkCount": 3
}
```

**Response:** Same as /fetchOcrData

---

### 3.5 POST /processCreditReport

**Purpose:** Fetch credit report data (synchronous with retry).

**Request:**
```json
{
  "transactionUUID": "txn-003",
  "countryCode": "US",
  "dataType": "CREDIT_REPORT",
  "requestBody": {
    "firstName": "John",
    "lastName": "Doe",
    "ssn": "123-45-6789",
    "dateOfBirth": "1985-05-15"
  }
}
```

**Response (200 OK):**
```json
{
  "data": {
    "creditScore": 750,
    "reportDate": "2026-04-01",
    "tradelines": [
      {
        "accountName": "Chase Visa",
        "accountStatus": "OPEN",
        "balance": 5000,
        "limit": 10000,
        "paymentHistory": "CURRENT"
      }
    ],
    "publicRecords": null,
    "inquiries": 2
  },
  "status": "SUCCESS"
}
```

---

### 3.6 POST /fetchCreditReportData

**Purpose:** Retrieve credit report results (for async operations).

**Request:**
```json
{
  "transactionUUID": "txn-003",
  "countryCode": "US",
  "dataType": "CREDIT_REPORT",
  "requestBody": {
    "asyncId": "async-credit-001"
  }
}
```

**Response:** Same format as /processCreditReport

---

### 3.7 POST /pollCreditData

**Purpose:** Poll for async credit report results.

**Request:**
```json
{
  "asyncId": "async-credit-001"
}
```

**Response:** Same format as /processCreditReport

---

### 3.8 GET /fetchProductIds/{description}/{provider}

**Purpose:** Query available products from provider.

**Request:**
```
GET /fetchProductIds/verification/signzy
```

**Response (200 OK):**
```json
{
  "data": {
    "products": [
      {
        "productId": "prod-123",
        "name": "Government ID Verification",
        "cost": 0.50,
        "processingTime": "2-5 seconds"
      }
    ]
  },
  "status": "SUCCESS"
}
```

---

### 3.9 POST /analyzeDocumentLayout

**Purpose:** Analyze document structure using AI.

**Request:**
```json
{
  "transactionUUID": "txn-004",
  "countryCode": "US",
  "dataType": "DOCUMENT_ANALYSIS",
  "requestBody": {
    "document": "BASE64_ENCODED_IMAGE",
    "documentType": "DRIVERS_LICENSE"
  }
}
```

**Response (200 OK):**
```json
{
  "data": {
    "layout": {
      "pageCount": 1,
      "regions": [
        {
          "type": "PHOTO",
          "confidence": 0.99,
          "bounds": { "x": 10, "y": 20, "width": 45, "height": 55 }
        },
        {
          "type": "PERSONAL_DATA",
          "confidence": 0.95,
          "bounds": { "x": 60, "y": 20, "width": 40, "height": 60 }
        }
      ]
    }
  },
  "status": "SUCCESS"
}
```

---

### 3.10 POST /structuredOutput

**Purpose:** Extract structured data from document.

**Request:**
```json
{
  "transactionUUID": "txn-005",
  "countryCode": "US",
  "dataType": "STRUCTURED_EXTRACTION",
  "requestBody": {
    "document": "BASE64_ENCODED_IMAGE",
    "extractionSchema": {
      "fields": ["firstName", "lastName", "dateOfBirth", "address"]
    }
  }
}
```

**Response (200 OK):**
```json
{
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1985-05-15",
    "address": "123 Main St"
  },
  "confidence": 0.96
}
```

---

### 3.11 POST /processOcrDocumentByGenAi

**Purpose:** Process document using GenAI for enhanced extraction.

**Request:**
```json
{
  "transactionUUID": "txn-006",
  "countryCode": "US",
  "dataType": "OCR",
  "validateFromGenAI": true,
  "requestBody": {
    "document": "BASE64_ENCODED_IMAGE",
    "documentType": "DRIVERS_LICENSE",
    "extractionInstructions": "Extract all text and structure"
  }
}
```

**Response (200 OK):**
```json
{
  "data": {
    "extracted": { /* same as OCR */ },
    "genAiValidation": {
      "documentAuthentic": true,
      "confidence": 0.99,
      "notes": "Document appears authentic, no tampering detected"
    }
  }
}
```

---

### 3.12 POST /publishMsg

**Purpose:** Publish event to Event Hub.

**Request:**
```json
{
  "eventType": "DOCUMENT_PROCESSED",
  "transactionId": "txn-001",
  "payload": { "status": "COMPLETED" }
}
```

**Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Event published"
}
```

---

## 4. HTTP Status Codes

| Code | Meaning |
|------|---------|
| **200** | Success (sync or async started) |
| **202** | Accepted (async operation queued) |
| **400** | Bad Request (validation error) |
| **401** | Unauthorized (invalid token) |
| **403** | Forbidden (insufficient permissions) |
| **422** | Unprocessable Entity (provider error) |
| **500** | Internal Server Error |
| **503** | Service Unavailable (provider down) |

---

## 5. Error Response Format

```json
{
  "status": "FAILURE",
  "errorCode": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "field": "optional field that caused error",
    "provider": "which provider failed",
    "timestamp": "2026-04-02T10:15:00Z"
  }
}
```

### Common Error Codes

| Code | Meaning |
|------|---------|
| `INVALID_REQUEST` | Missing/invalid request fields |
| `PROVIDER_ERROR` | External provider error |
| `PROVIDER_TIMEOUT` | Provider API timeout |
| `MAX_RETRIES_EXCEEDED` | Retry limit reached |
| `INVALID_COUNTRY` | Unsupported country code |
| `INVALID_DATA_TYPE` | Unknown data type |
| `INVALID_DOCUMENT` | Document validation failed |
| `ASYNC_EXPIRED` | Async polling timeout exceeded |

---

## 6. Request/Response Examples

### Example 1: ID Verification (Sync)

**Request:**
```bash
curl -X POST http://localhost:8082/fetchData \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <oauth-token>" \
  -d '{
    "transactionUUID": "550e8400-e29b-41d4-a716-446655440000",
    "countryCode": "US",
    "dataType": "ID_VERIFICATION",
    "requestBody": {
      "documentNumber": "AB123456",
      "documentType": "DRIVERS_LICENSE"
    }
  }'
```

**Response:**
```json
{
  "data": {
    "verified": true,
    "matchScore": 0.98
  },
  "status": "SUCCESS"
}
```

---

### Example 2: OCR Processing (Async)

**Request 1 - Start Processing:**
```bash
curl -X POST http://localhost:8082/processOcrDocument \
  -H "Content-Type: application/json" \
  -d '{
    "transactionUUID": "txn-002",
    "countryCode": "US",
    "dataType": "OCR",
    "opsType": "ASYNC",
    "requestBody": {
      "document": "<BASE64_PDF>",
      "documentType": "DRIVERS_LICENSE"
    }
  }'
```

**Response 1:**
```json
{
  "data": { "asyncId": "async-550e8400" },
  "status": "IN_PROGRESS"
}
```

**Request 2 - Poll for Results:**
```bash
curl -X POST http://localhost:8082/fetchOcrData \
  -H "Content-Type: application/json" \
  -d '{
    "transactionUUID": "txn-002",
    "countryCode": "US",
    "dataType": "OCR",
    "requestBody": { "asyncId": "async-550e8400" }
  }'
```

**Response 2 (After ~30 seconds):**
```json
{
  "data": {
    "extracted": {
      "firstName": "John",
      "lastName": "Doe",
      "documentNumber": "AB123456"
    },
    "confidence": 0.97
  },
  "status": "SUCCESS"
}
```

---

### Example 3: Credit Report

**Request:**
```bash
curl -X POST http://localhost:8082/processCreditReport \
  -H "Content-Type: application/json" \
  -d '{
    "transactionUUID": "txn-003",
    "countryCode": "US",
    "dataType": "CREDIT_REPORT",
    "requestBody": {
      "firstName": "John",
      "lastName": "Doe",
      "ssn": "123-45-6789"
    }
  }'
```

**Response:**
```json
{
  "data": {
    "creditScore": 750,
    "tradelines": [
      {
        "accountName": "Chase Visa",
        "balance": 5000,
        "limit": 10000
      }
    ]
  },
  "status": "SUCCESS"
}
```

---

## 7. Provider Integration Details

### SIGNZY OCR Integration

| Feature | Details |
|---------|---------|
| **Endpoint** | https://api.signzy.com/v1/process |
| **Auth** | API Key in header |
| **Request Type** | multipart/form-data |
| **Async** | Yes (polling required) |
| **Polling Endpoint** | /v1/status/{transactionId} |
| **Max File Size** | 10MB |
| **Supported Formats** | PDF, JPEG, PNG |

### Credit Bureau Integration

| Feature | Details |
|---------|---------|
| **Endpoint** | https://api.creditbureau.com/v1/report |
| **Auth** | OAuth2 token |
| **Request Type** | application/json |
| **Async** | Optional |
| **Response Format** | XML/JSON |
| **Timeout** | 60 seconds |

---

## 8. Authentication & Authorization

### OAuth2 Flow

1. ACV Portal → API Gateway (with OAuth credentials)
2. API Gateway → Okta (validate token)
3. Okta → API Gateway (return JWT)
4. API Gateway → API Connector Service (forward JWT)
5. API Connector Service → Validate JWT signature

**Bearer Token Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 9. Rate Limiting

| Aspect | Limit | Window |
|--------|-------|--------|
| **Requests per second** | 500 req/s | 1 second |
| **Requests per minute** | 30,000 req/min | 1 minute |
| **Max concurrent requests** | 1,000 | Simultaneous |
| **Provider call timeout** | 30s (OCR: 60s) | Per request |

---

## 10. OpenAPI/Swagger

Interactive API documentation available at: `http://localhost:8082/swagger-ui.html`

---

## Cross-References

- [HLD.md](HLD.md) — Architecture and business flows
- [LLD.md](LLD.md) — Code implementation details
- [code-mapping.md](code-mapping.md) — Class inventory

---

**Last Updated:** 2026-04-02  
**Version:** 1.1.8  
**Audience:** API Consumers, Integration Teams, QA
