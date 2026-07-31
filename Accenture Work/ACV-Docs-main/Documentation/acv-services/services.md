# ACV Services - REST API Contracts

**Purpose:** Document all REST API endpoints, request/response schemas, authentication, and error codes.

**Scope:** Account Creation Validations (`AccountCreationValidationsController`, `ConfigurationController`, `AuthTokenController`)

---

## 1. API Overview

### Base URL

```
http://localhost:8080                    # Local development
https://acv-services-dev.example.com     # Development environment
https://acv-services-test.example.com    # Test environment
https://acv-services.example.com         # Production
```

### API Versioning

Endpoints are versioned with `/v1/` prefix to support future backward-compatible updates without breaking existing clients.

```
Current: /v1/
Future:  /v2/  (if breaking changes introduced)
```

### Authentication

All endpoints require **OAuth2 Bearer Token** from Okta:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Acquisition:**
1. Call `GET /oktaToken/{service}` to obtain token
2. Include token in `Authorization` header of all subsequent requests
3. Token expires after 1 hour; refresh by calling endpoint again

---

## 2. Endpoint Inventory

### Summary Table

| Method | Endpoint | Purpose | Auth | Async? |
|--------|----------|---------|------|--------|
| POST | `/v1/identity/request-otp` | Request OTP for identity verification | Required | No |
| POST | `/v1/identity/verify-otp` | Verify OTP code | Required | No |
| POST | `/v1/records` | Submit documents for compliance validation | Required | Yes |
| GET | `/v1/transaction/{transactionId}` | Query transaction state | Required | No |
| GET | `/config/v1/countries` | List supported countries | Required | No |
| GET | `/config/v1/country/{countryCode}/documents` | Get document requirements for country | Required | No |
| GET | `/config/v1/validation-types` | List available validation types | Required | No |
| GET | `/oktaToken/{service}` | Generate OAuth2 token for service | Optional | No |

---

## 3. Identity Verification Endpoints

### 3.1 Request OTP

Initiate identity verification by requesting One-Time Password (OTP).

```
POST /v1/identity/request-otp
```

**Authentication:** Required (Okta Bearer Token)

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <okta-jwt-token>
```

**Request Body Schema:**

```json
{
  "firstName": "string",                    // Customer first name [Required]
  "lastName": "string",                     // Customer last name [Required]
  "emailAddress": "string",                 // Email for OTP delivery [Required]
  "countryCode": "string",                  // ISO 3166-1 alpha-2 code [Required]
  "documentType": "string",                 // PASSPORT, NATIONAL_ID, DRIVER_LICENSE [Required]
  "documentId": "string",                   // Document ID number [Required]
  "dateOfBirth": "2000-01-15",             // ISO 8601 date format [Optional]
  "phoneNumber": "string"                   // For SMS delivery [Optional]
}
```

**Example Request:**

```bash
curl -X POST http://localhost:8080/v1/identity/request-otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "emailAddress": "john.doe@example.com",
    "countryCode": "US",
    "documentType": "PASSPORT",
    "documentId": "A12345678",
    "dateOfBirth": "1990-05-15"
  }'
```

**Response Schema (200 OK):**

```json
{
  "transactionId": "UUID",                 // Unique transaction identifier
  "status": "OTP_SENT",                    // Current validation stage status
  "executionTime": "ms",                   // Request processing time
  "message": "string",                     // Status description
  "validationDetails": {
    "otpDeliveryChannel": "EMAIL",         // EMAIL or SMS
    "otpExpiryMinutes": 10
  }
}
```

**Status Codes:**

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | OTP successfully sent |
| 400 | Bad Request | Missing/invalid required properties |
| 401 | Unauthorized | Invalid or expired JWT token |
| 403 | Forbidden | User not authorized for this country |
| 409 | Conflict | Transaction already in progress for applicant |
| 500 | Internal Server Error | Server-side processing error |

**Error Response Example (400):**

```json
{
  "transactionId": null,
  "status": "VALIDATION_FAILED",
  "executionTime": "5ms",
  "message": "Validation failed",
  "errors": [
    {
      "field": "emailAddress",
      "message": "Invalid email format"
    },
    {
      "field": "countryCode",
      "message": "Unsupported country"
    }
  ]
}
```

---

### 3.2 Verify OTP

Verify OTP code and complete identity verification stage.

```
POST /v1/identity/verify-otp
```

**Authentication:** Required (Okta Bearer Token)

**Request Body Schema:**

```json
{
  "transactionId": "UUID",                 // From request-otp response [Required]
  "otp": "string",                         // 6-digit OTP code [Required]
  "mfaMethod": "string"                    // EMAIL or SMS [Optional]
}
```

**Example Request:**

```bash
curl -X POST http://localhost:8080/v1/identity/verify-otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "transactionId": "550e8400-e29b-41d4-a716-446655440000",
    "otp": "123456"
  }'
```

**Response Schema (200 OK):**

```json
{
  "transactionId": "UUID",
  "status": "IDENTITY_VERIFIED",
  "executionTime": "150ms",
  "message": "Identity verification successful",
  "nextStage": "RECORD_VALIDATION",
  "validationDetails": {
    "identityDocumentMatched": true,
    "confidence": 0.98
  }
}
```

**Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | OK — OTP verified, identity confirmed |
| 400 | Bad Request — Invalid OTP format or missing fields |
| 401 | Unauthorized — JWT token invalid/expired |
| 404 | Not Found — Transaction ID not found |
| 429 | Too Many Requests — OTP retry limit exceeded |
| 500 | Internal Server Error |

---

## 4. Record Validation Endpoints

### 4.1 Validate Documents (Multi-Record Submission)

Submit compliance documents for validation. This is typically called after identity verification completes.

```
POST /v1/records
```

**Authentication:** Required (Okta Bearer Token)

**Request Body Schema:**

```json
{
  "transactionId": "UUID",                 // From request-otp response [Required]
  "records": [
    {
      "recordCode": "string",              // Business code (BRN001, TAX001, etc.) [Required]
      "documentType": "string",            // Document type [Required]
      "documentURL": "string",             // Azure Blob Storage URL or provided [Required]
      "metadata": {
        "issueDate": "2020-01-01",         // ISO 8601 [Optional]
        "expiryDate": "2025-12-31",        // ISO 8601 [Optional]
        "documentLanguage": "EN"           // ISO 639-1 code [Optional]
      }
    }
  ],
  "validationOptions": {
    "includeOCR": true,                    // Enable OCR processing [Default: true]
    "validateSignature": true,             // Validate digital signature [Default: false]
    "matchWithGovernmentRecords": true     // Cross-reference with govt [Default: false]
  }
}
```

**Example Request:**

```bash
curl -X POST http://localhost:8080/v1/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "transactionId": "550e8400-e29b-41d4-a716-446655440000",
    "records": [
      {
        "recordCode": "BRN001",
        "documentType": "BUSINESS_REGISTRATION",
        "documentURL": "https://blob.azure.com/documents/brn-cert.pdf",
        "metadata": {
          "issueDate": "2020-06-15",
          "expiryDate": "2025-06-15"
        }
      },
      {
        "recordCode": "TAX001",
        "documentType": "TAX_CERTIFICATE",
        "documentURL": "https://blob.azure.com/documents/tax-reg.pdf"
      }
    ],
    "validationOptions": {
      "includeOCR": true,
      "matchWithGovernmentRecords": true
    }
  }'
```

**Response Schema (202 Accepted - Asynchronous Processing):**

```json
{
  "transactionId": "UUID",
  "status": "VALIDATION_IN_PROGRESS",
  "executionTime": "280ms",
  "message": "Documents submitted for processing",
  "recordsSubmitted": 2,
  "recordDetails": [
    {
      "recordCode": "BRN001",
      "processingStatus": "SUBMITTED",
      "statusCheckUrl": "/v1/transaction/550e8400-e29b-41d4-a716-446655440000/records/BRN001",
      "estimatedCompletionTime": "300s"
    },
    {
      "recordCode": "TAX001",
      "processingStatus": "SUBMITTED",
      "statusCheckUrl": "/v1/transaction/550e8400-e29b-41d4-a716-446655440000/records/TAX001",
      "estimatedCompletionTime": "300s"
    }
  ],
  "webhookUrl": "https://client.example.com/webhook/acv-callback"  // If configured
}
```

**Status Codes:**

| Code | Meaning |
|------|---------|
| 202 | Accepted — Documents queued for async processing |
| 400 | Bad Request — Invalid document URL or format |
| 401 | Unauthorized — JWT invalid/expired |
| 404 | Not Found — Transaction ID not found |
| 413 | Payload Too Large — Document exceeds size limit |
| 500 | Internal Server Error |

**Polling for Results:**

Since the endpoint returns `202 Accepted`, clients must poll for completion using the transaction endpoint:

```bash
GET /v1/transaction/{transactionId}
```

Poll every 30 seconds until `status` changes to `RECORD_VALIDATED` or `VALIDATION_FAILED`.

---

## 5. Transaction Query Endpoint

### 5.1 Get Transaction State

Query current validation state for a transaction.

```
GET /v1/transaction/{transactionId}
```

**Authentication:** Required (Okta Bearer Token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `transactionId` | UUID | Transaction ID from initial request |

**Query Parameters:**

```
?includeHistory=true      # Include state history [Default: false]
?includeDetails=true      # Include validation details [Default: false]
```

**Example Request:**

```bash
curl -X GET "http://localhost:8080/v1/transaction/550e8400-e29b-41d4-a716-446655440000?includeDetails=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Schema (200 OK):**

```json
{
  "transactionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "RECORD_VALIDATED",
  "createdAt": "2025-01-30T10:15:00Z",
  "updatedAt": "2025-01-30T10:18:45Z",
  "executionTime": "225ms",
  "stageHistory": [
    {
      "stage": "IDENTITY_VERIFICATION",
      "status": "COMPLETED",
      "startTime": "2025-01-30T10:15:00Z",
      "endTime": "2025-01-30T10:15:30Z"
    },
    {
      "stage": "RECORD_VALIDATION",
      "status": "COMPLETED",
      "startTime": "2025-01-30T10:15:31Z",
      "endTime": "2025-01-30T10:18:45Z"
    }
  ],
  "validationSummary": {
    "totalRecords": 2,
    "recordsValidated": 2,
    "recordsPassed": 2,
    "recordsFailed": 0,
    "overallStatus": "PASS"
  },
  "recordResults": [
    {
      "recordCode": "BRN001",
      "status": "PASS",
      "confidence": 0.99,
      "details": {
        "documentScanQuality": "EXCELLENT",
        "dataExtractionMatched": true
      }
    },
    {
      "recordCode": "TAX001",
      "status": "PASS",
      "confidence": 0.97
    }
  ],
  "nextStage": "CREDIT_VALIDATION",
  "nextStageUrl": "POST /v1/credit-validation"
}
```

**Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | OK — Transaction state returned |
| 401 | Unauthorized — JWT invalid/expired |
| 404 | Not Found — Transaction ID not found or expired |
| 500 | Internal Server Error |

---

## 6. Configuration Endpoints

### 6.1 List Supported Countries

Retrieve list of countries supported by ACV system.

```
GET /config/v1/countries
```

**Authentication:** Required (Okta Bearer Token)

**Query Parameters:**

```
?includeRules=true    # Include validation rules [Default: false]
?region=EMEA          # Filter by region [Optional]
```

**Example Request:**

```bash
curl -X GET "http://localhost:8080/config/v1/countries?includeRules=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Schema (200 OK):**

```json
{
  "countries": [
    {
      "countryCode": "US",
      "countryName": "United States",
      "region": "AMERICAS",
      "validationTypes": ["IDENTITY_VERIFICATION", "RECORD_VALIDATION", "CREDIT_VALIDATION"],
      "requiredDocuments": ["PASSPORT", "NATIONAL_ID"],
      "supportedLanguages": ["EN"],
      "timezone": "America/New_York"
    },
    {
      "countryCode": "CA",
      "countryName": "Canada",
      "region": "AMERICAS",
      "validationTypes": ["IDENTITY_VERIFICATION", "RECORD_VALIDATION"],
      "requiredDocuments": ["PASSPORT", "NATIONAL_ID", "DRIVER_LICENSE"],
      "supportedLanguages": ["EN", "FR"],
      "timezone": "America/Toronto"
    },
    {
      "countryCode": "GB",
      "countryName": "United Kingdom",
      "region": "EMEA",
      "validationTypes": ["IDENTITY_VERIFICATION", "RECORD_VALIDATION", "CREDIT_VALIDATION"],
      "requiredDocuments": ["PASSPORT", "NATIONAL_ID"],
      "supportedLanguages": ["EN"],
      "timezone": "Europe/London"
    }
  ],
  "totalCount": 45,
  "lastUpdated": "2025-01-30T00:00:00Z"
}
```

**Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | OK — Country list returned |
| 401 | Unauthorized — JWT invalid/expired |
| 500 | Internal Server Error |

---

### 6.2 Get Country Document Requirements

Retrieve required compliance documents for a specific country.

```
GET /config/v1/country/{countryCode}/documents
```

**Authentication:** Required (Okta Bearer Token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `countryCode` | String | ISO 3166-1 alpha-2 code (US, CA, GB, etc.) |

**Example Request:**

```bash
curl -X GET "http://localhost:8080/config/v1/country/US/documents" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Schema (200 OK):**

```json
{
  "countryCode": "US",
  "countryName": "United States",
  "documentRequirements": [
    {
      "recordCode": "IDENT001",
      "documentType": "IDENTITY_VERIFICATION",
      "required": true,
      "acceptedFormats": ["PASSPORT", "NATIONAL_ID", "DRIVER_LICENSE"],
      "maxAgeYears": null
    },
    {
      "recordCode": "BRN001",
      "documentType": "BUSINESS_REGISTRATION",
      "required": true,
      "acceptedFormats": ["CERTIFICATE_FROM_SECRETARY_OF_STATE"],
      "maxAgeYears": 3
    },
    {
      "recordCode": "TAX001",
      "documentType": "TAX_CERTIFICATE",
      "required": true,
      "acceptedFormats": ["IRS_TAX_CLEARANCE", "FORM_1120"],
      "maxAgeYears": 1
    }
  ],
  "validationRules": {
    "requireAllDocuments": true,
    "allowPartialValidation": false,
    "creditCheckRequired": true
  }
}
```

**Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | OK — Document requirements returned |
| 401 | Unauthorized — JWT invalid/expired |
| 404 | Not Found — Country code not supported |
| 500 | Internal Server Error |

---

### 6.3 List Validation Types

Retrieve available validation types in ACV system.

```
GET /config/v1/validation-types
```

**Authentication:** Required (Okta Bearer Token)

**Example Request:**

```bash
curl -X GET "http://localhost:8080/config/v1/validation-types" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Schema (200 OK):**

```json
{
  "validationTypes": [
    {
      "typeCode": "IDENTITY_VERIFICATION",
      "description": "OTP-based identity verification",
      "avgProcessingTimeSeconds": 30,
      "supportsAsync": true
    },
    {
      "typeCode": "RECORD_VALIDATION",
      "description": "Document compliance validation with OCR",
      "avgProcessingTimeSeconds": 300,
      "supportsAsync": true
    },
    {
      "typeCode": "CREDIT_VALIDATION",
      "description": "Credit bureau lookup and score retrieval",
      "avgProcessingTimeSeconds": 60,
      "supportsAsync": true
    }
  ]
}
```

**Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | OK — Validation types returned |
| 401 | Unauthorized — JWT invalid/expired |
| 500 | Internal Server Error |

---

## 7. Authentication Token Endpoint

### 7.1 Get OAuth2 Token

Generate or proxy OAuth2 token for inter-service communication.

```
GET /oktaToken/{service}
```

**Authentication:** Optional (basic auth or API key allowed for inter-service calls)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `service` | String | Target service name (document-service, scheduler-service, etc.) |

**Example Request (from another ACV service):**

```bash
curl -X GET "http://localhost:8080/oktaToken/document-service" \
  --basic -u "api-client:api-secret"
```

**Response Schema (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "refreshToken": "refresh_token_string",
  "scope": "openid profile email api"
}
```

**Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | OK — Token generated |
| 400 | Bad Request — Invalid service name |
| 401 | Unauthorized — Invalid credentials |
| 500 | Internal Server Error |

---

## 8. Error Handling

### Error Response Format

All error responses follow this schema:

```json
{
  "transactionId": "UUID or null",
  "status": "VALIDATION_FAILED",
  "executionTime": "duration_in_ms",
  "message": "Human-readable error description",
  "errorCode": "ERROR_CODE_CONSTANT",
  "errors": [
    {
      "field": "field_name",
      "message": "Field-specific error message",
      "rejectedValue": "value"
    }
  ],
  "timestamp": "2025-01-30T10:15:00Z"
}
```

### Common Error Codes

| Error Code | HTTP Status | Meaning |
|-----------|-------------|---------|
| `INVALID_INPUT` | 400 | Request validation failed |
| `MISSING_FIELD` | 400 | Required field missing |
| `INVALID_COUNTRY_CODE` | 400 | Unsupported country |
| `UNAUTHORIZED` | 401 | JWT token invalid/expired |
| `FORBIDDEN` | 403 | User not authorized for this operation |
| `TRANSACTION_NOT_FOUND` | 404 | Transaction ID doesn't exist |
| `TRANSACTION_EXPIRED` | 410 | Transaction data has been purged |
| `DUPLICATE_REQUEST` | 409 | Duplicate request in progress |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests; retry after delay |
| `PROVIDER_ERROR` | 502 | External provider API error |
| `INTERNAL_ERROR` | 500 | Server-side error |

---

## 9. Rate Limiting

ACV Services enforces rate limits per authenticated user/service:

```
Rate Limit: 100 requests per minute per authenticated client

Response Headers:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1701345600
```

When rate limit exceeded, API returns:

```
HTTP 429 Too Many Requests

{
  "status": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit of 100 requests per minute exceeded",
  "retryAfterSeconds": 45
}
```

---

## 10. Webhook Callbacks (Optional)

Clients can optionally configure webhooks for async operation completion notifications:

```
POST /config/v1/webhook-config
Content-Type: application/json
Authorization: Bearer <token>

{
  "webhookUrl": "https://client.example.com/webhook/acv-callback",
  "events": ["TRANSACTION_COMPLETED", "VALIDATION_FAILED"],
  "retryPolicy": {
    "maxRetries": 3,
    "backoffMultiplier": 2
  }
}
```

When configured, ACV Services will POST to the webhook URL:

```json
{
  "event": "TRANSACTION_COMPLETED",
  "transactionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "COMPLETED",
  "timestamp": "2025-01-30T10:20:00Z",
  "data": {
    // Full transaction result object
  }
}
```

---

## 11. Interactive API Documentation

Once the service is running, view interactive Swagger documentation:

```
http://localhost:8080/swagger-ui.html
```

This provides:
- Real-time API exploration
- Try-it-out request testing (requires valid JWT token)
- Schema visualization
- Error example responses

---

## 12. API Client Examples

### Using cURL

```bash
# Get token
TOKEN=$(curl -s -X GET "http://localhost:8080/oktaToken/client" \
  --basic -u "api-client:api-secret" | jq -r '.accessToken')

# Request OTP
curl -X POST http://localhost:8080/v1/identity/request-otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @request-otp.json
```

### Using Python

```python
import requests

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}

request_payload = {
    "firstName": "John",
    "lastName": "Doe",
    "emailAddress": "john@example.com",
    "countryCode": "US",
    "documentType": "PASSPORT",
    "documentId": "A123456"
}

response = requests.post(
    "http://localhost:8080/v1/identity/request-otp",
    json=request_payload,
    headers=headers
)

print(response.json())
```

### Using JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

const requestPayload = {
  firstName: "John",
  lastName: "Doe",
  emailAddress: "john@example.com",
  countryCode: "US",
  documentType: "PASSPORT",
  documentId: "A123456"
};

fetch('http://localhost:8080/v1/identity/request-otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(requestPayload)
})
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## 13. References

- [HLD.md](HLD.md) — Architecture and design decisions
- [code-mapping.md](code-mapping.md) — Controller and service implementations
- [README.md](README.md) — Quick start and configuration

---

**Last Updated:** 2025-01-30  
**API Version:** 1.1.6  
**Status:** Production  

For API support, contact: api-support@acv-platform.example.com
