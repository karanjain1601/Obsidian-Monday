# ACV Validation Engine - Service Contracts & API Reference

**Purpose:** Document all REST endpoints, request/response schemas, authentication, error codes, and data contracts for consuming services.

**Scope:** API contracts only — specification of what the service exposes, not the internal implementation details.

---

## 1. API Overview

### Service Endpoint

| Property | Value |
|----------|-------|
| **Base URL** | http://validation-engine:8081 (in-cluster) or http://localhost:8081 (dev) |
| **Version** | 1.1.4 |
| **Protocol** | HTTP/1.1 (REST) |
| **Content-Type** | application/json |
| **Authentication** | Delegated to API Gateway (mTLS service-to-service) |

### Single Endpoint

```
POST /validate
```

The validation engine exposes a **single pluggable REST endpoint** that routes requests to appropriate validators based on the `validationType` field.

---

## 2. Request Specification

### Endpoint

```
POST /validate
Content-Type: application/json
```

### Request Body Schema

```json
{
  "transId": "550e8400-e29b-41d4-a716-446655440000",
  "validationType": "ID_VALIDATION",
  "validationData": {
    "source": "JOHN DOE",
    "destination": "JOHN DOE"
  },
  "config": {
    "comparisonType": "FUZZY_MATCH",
    "threshold": 0.95,
    "maxFuzzyDistance": 2,
    "dataType": "STRING",
    "predefinedValue": null
  },
  "additionalData": {
    "customField": "customValue"
  }
}
```

### Field Definitions

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|------------|
| **transId** | UUID String | Yes | 36 | Unique transaction/request identifier. Used for tracing and idempotency. Must be UUID v4 format. |
| **validationType** | Enum | Yes | — | Validator type to execute. One of: ID_VALIDATION, LEGAL_NAME_VALIDATION, ENTITY_NAME_VALIDATION, ENTITY_NATURE_VALIDATION, DATE_VALIDATION, KEY_PERSON_VALIDATION, CREDIT_VALIDATION, ADDRESS_VALIDATION, TYPE_REG_VALIDATION, REC_STATUS_VALIDATION, NAME_VALIDATION, OTHER_VALIDATION |
| **validationData.source** | String | Yes | 1000 | Applicant-provided data (the data being validated). |
| **validationData.destination** | String | Yes | 1000 | Reference/government-provided data (the truth source). |
| **config.comparisonType** | Enum | Yes | — | Algorithm for comparison: EXACT_MATCH, FUZZY_MATCH, NUMERIC_COMPARE, PREDEFINED_RULE, DATE_RANGE |
| **config.threshold** | Double | No | — | Confidence threshold (0.0-1.0) for PASS decision. Default: validator-specific (e.g., 0.95 for ID). |
| **config.maxFuzzyDistance** | Integer | No | — | Max Levenshtein distance for fuzzy matching. Default: 2 |
| **config.dataType** | Enum | No | — | Data type: STRING, NUMERIC, DATE, COLLECTION. Used for validation preprocessing. |
| **config.minValue, maxValue** | Double | No | — | Min/max for numeric range validation. |
| **config.minDate, maxDate** | String (ISO-8601) | No | — | Min/max date for date range validation. Format: YYYY-MM-DD |
| **config.minCreditScore** | Double | No | — | Minimum credit score threshold. Default: 700.0 |
| **config.predefinedValue** | String | No | — | Whitelist/predefined rule reference for predefined rule validation. |
| **additionalData** | Object | No | — | Custom metadata. Passed to validator for additional context. |

### Validation Type Reference

| Validation Type | Primary Use | Comparison Type | Example Input |
|-----------------|------------|-----------------|---------------|
| `ID_VALIDATION` | Validate ID documents (license, passport) match gov records | FUZZY_MATCH | { "source": "AB123456", "destination": "AB123456" } |
| `LEGAL_NAME_VALIDATION` | Validate business legal name matches company registry | FUZZY_MATCH | { "source": "Acme Inc", "destination": "Acme Incorporated" } |
| `ENTITY_NAME_VALIDATION` | Validate entity name fields (DBA, trade name) | FUZZY_MATCH | { "source": "John's Auto", "destination": "Johns Auto" } |
| `ENTITY_NATURE_VALIDATION` | Validate entity type (LLC, Corp, etc.) is allowed | PREDEFINED_RULE | { "source": "LLC", "destination": null } |
| `DATE_VALIDATION` | Validate date within range (incorporation, birth, expiry) | DATE_RANGE | { "source": "1990-01-15", "destination": null } |
| `KEY_PERSON_VALIDATION` | Validate key person/officer matches UCC filings | FUZZY_MATCH | { "source": "John Smith", "destination": "JOHN SMITH" } |
| `CREDIT_VALIDATION` | Validate credit score meets minimum threshold | NUMERIC_COMPARE | { "source": "750", "destination": null } |
| `ADDRESS_VALIDATION` | Validate address format and postal code validity | PREDEFINED_RULE | { "source": "123 Main St, NY 10001", "destination": null } |
| `TYPE_REG_VALIDATION` | Validate registration type is allowed | PREDEFINED_RULE | { "source": "LLC", "destination": null } |
| `REC_STATUS_VALIDATION` | Validate record status is active/valid | PREDEFINED_RULE | { "source": "ACTIVE", "destination": null } |
| `NAME_VALIDATION` | Generic name validation fallback | FUZZY_MATCH | { "source": "Name1", "destination": "Name2" } |
| `OTHER_VALIDATION` | Catch-all for custom/unknown validation types | Mixed | Varies |

---

## 3. Response Specification

### Response Body Schema (200 OK)

```json
{
  "transId": "550e8400-e29b-41d4-a716-446655440000",
  "validationResult": true,
  "confidence": 0.95,
  "message": "ID documents match with high confidence",
  "details": {
    "fuzzyDistance": 0,
    "appliedRule": "EXACT_MATCH",
    "sourceId": "JOHN DOE",
    "destId": "JOHN DOE"
  }
}
```

### Response Field Definitions

| Field | Type | Description |
|-------|------|------------|
| **transId** | UUID String | Echo of request transId for request/response correlation |
| **validationResult** | Boolean | `true` = validation PASSED, `false` = validation FAILED |
| **confidence** | Double (0.0-1.0) | Confidence score. 1.0 = high confidence, 0.0 = low confidence. Allows ACV Services to apply nuanced business logic (e.g., manual review for 0.7-0.85 confidence). |
| **message** | String | Human-readable outcome message describing the validation result |
| **details** | Object | Validator-specific details for debugging, tracing, and audit. Contents vary by validator. |

### Typical Response Messages

| Validator | Result | Message |
|-----------|--------|---------|
| ID_VALIDATION | true | "ID documents match with high confidence" |
| ID_VALIDATION | false | "ID documents do not match - manual review required" |
| LEGAL_NAME_VALIDATION | true | "Company name matches registry records" |
| LEGAL_NAME_VALIDATION | false | "Company name mismatch with registry" |
| DATE_VALIDATION | true | "Date within valid range" |
| DATE_VALIDATION | false | "Date outside valid range or invalid format" |
| CREDIT_VALIDATION | true | "Credit score meets minimum threshold" |
| CREDIT_VALIDATION | false | "Credit score below minimum threshold" |
| ENTITY_NATURE_VALIDATION | true | "Entity type is valid and allowed" |
| ENTITY_NATURE_VALIDATION | false | "Entity type not recognized or not allowed" |
| ADDRESS_VALIDATION | true | "Address format is valid" |
| ADDRESS_VALIDATION | false | "Address format invalid or postal code not found" |

---

## 4. HTTP Status Codes

| Code | Meaning | When Returned | Example Response |
|------|---------|---------------|------------------|
| **200** | OK - Validation completed | Always (validation result true or false) | `{"validationResult": true, ...}` or `{"validationResult": false, ...}` |
| **400** | Bad Request - Invalid input | Missing required fields, malformed JSON, invalid enum values | `{"message": "validationType is required"}` |
| **422** | Unprocessable Entity | Request valid JSON but semantic error (e.g., invalid date format) | `{"message": "Invalid date format: ABC"}` |
| **500** | Internal Server Error | Unexpected exception in validation engine | `{"message": "Internal validation error: NullPointerException"}` |
| **503** | Service Unavailable | Engine is down or restarting | Connection refused |

---

## 5. Error Response Format

### 4xx Error Response (Bad Request)

```json
{
  "transId": "550e8400-e29b-41d4-a716-446655440000",
  "validationResult": false,
  "message": "Missing required field: validationType",
  "details": {
    "fieldName": "validationType",
    "constraint": "NotNull",
    "timestamp": "2025-01-30T10:15:22Z"
  }
}
```

### 5xx Error Response (Server Error)

```json
{
  "transId": "550e8400-e29b-41d4-a716-446655440000",
  "validationResult": false,
  "message": "Internal validation error: NullPointerException in IdValidationServiceImpl",
  "details": {
    "errorType": "NullPointerException",
    "errorMessage": "Cannot invoke method on null object",
    "timestamp": "2025-01-30T10:15:30Z"
  }
}
```

---

## 6. Example Request/Response Pairs

### Example 1: ID Validation — PASS

**Request:**
```bash
curl -X POST http://localhost:8081/validate \
  -H "Content-Type: application/json" \
  -d '{
    "transId": "550e8400-e29b-41d4-a716-446655440001",
    "validationType": "ID_VALIDATION",
    "validationData": {
      "source": "DL123456AB",
      "destination": "DL123456AB"
    },
    "config": {
      "comparisonType": "EXACT_MATCH",
      "threshold": 0.95
    }
  }'
```

**Response (200 OK):**
```json
{
  "transId": "550e8400-e29b-41d4-a716-446655440001",
  "validationResult": true,
  "confidence": 1.0,
  "message": "ID documents match with high confidence",
  "details": {
    "fuzzyDistance": 0,
    "appliedRule": "EXACT_MATCH"
  }
}
```

---

### Example 2: Legal Name Validation — FAIL

**Request:**
```bash
curl -X POST http://localhost:8081/validate \
  -H "Content-Type: application/json" \
  -d '{
    "transId": "550e8400-e29b-41d4-a716-446655440002",
    "validationType": "LEGAL_NAME_VALIDATION",
    "validationData": {
      "source": "Acme Corporation",
      "destination": "Beta Industries Inc"
    },
    "config": {
      "comparisonType": "FUZZY_MATCH",
      "threshold": 0.90
    }
  }'
```

**Response (200 OK):**
```json
{
  "transId": "550e8400-e29b-41d4-a716-446655440002",
  "validationResult": false,
  "confidence": 0.25,
  "message": "Company names do not match - manual review required",
  "details": {
    "sourceClean": "acme corporation",
    "destClean": "beta industries",
    "fuzzyDistance": 18,
    "similarity": 0.25,
    "threshold": 0.90
  }
}
```

---

### Example 3: Date Validation — PASS

**Request:**
```bash
curl -X POST http://localhost:8081/validate \
  -H "Content-Type: application/json" \
  -d '{
    "transId": "550e8400-e29b-41d4-a716-446655440003",
    "validationType": "DATE_VALIDATION",
    "validationData": {
      "source": "1990-01-15",
      "destination": null
    },
    "config": {
      "comparisonType": "DATE_RANGE",
      "minDate": "1980-01-01",
      "maxDate": "2005-12-31",
      "dataType": "DATE"
    }
  }'
```

**Response (200 OK):**
```json
{
  "transId": "550e8400-e29b-41d4-a716-446655440003",
  "validationResult": true,
  "confidence": 1.0,
  "message": "Date within valid range",
  "details": {
    "date": "1990-01-15",
    "minDate": "1980-01-01",
    "maxDate": "2005-12-31"
  }
}
```

---

### Example 4: Credit Validation — FAIL

**Request:**
```bash
curl -X POST http://localhost:8081/validate \
  -H "Content-Type: application/json" \
  -d '{
    "transId": "550e8400-e29b-41d4-a716-446655440004",
    "validationType": "CREDIT_VALIDATION",
    "validationData": {
      "source": "650",
      "destination": null
    },
    "config": {
      "comparisonType": "NUMERIC_COMPARE",
      "minCreditScore": 700.0,
      "dataType": "NUMERIC"
    }
  }'
```

**Response (200 OK):**
```json
{
  "transId": "550e8400-e29b-41d4-a716-446655440004",
  "validationResult": false,
  "confidence": 0.0,
  "message": "Credit score below minimum threshold",
  "details": {
    "creditScore": 650,
    "minThreshold": 700,
    "gap": 50
  }
}
```

---

### Example 5: Entity Nature Validation — PASS

**Request:**
```bash
curl -X POST http://localhost:8081/validate \
  -H "Content-Type: application/json" \
  -d '{
    "transId": "550e8400-e29b-41d4-a716-446655440005",
    "validationType": "ENTITY_NATURE_VALIDATION",
    "validationData": {
      "source": "LLC",
      "destination": null
    },
    "config": {
      "comparisonType": "PREDEFINED_RULE",
      "predefinedValue": "ALLOWED_ENTITY_TYPES"
    }
  }'
```

**Response (200 OK):**
```json
{
  "transId": "550e8400-e29b-41d4-a716-446655440005",
  "validationResult": true,
  "confidence": 1.0,
  "message": "Entity type is valid and allowed",
  "details": {
    "entityType": "LLC",
    "allowedTypes": ["LLC", "CORPORATION", "S_CORP", "PARTNERSHIP", "SOLE_PROPRIETOR"]
  }
}
```

---

### Example 6: Invalid Request — Bad Request

**Request:**
```bash
curl -X POST http://localhost:8081/validate \
  -H "Content-Type: application/json" \
  -d '{
    "transId": "550e8400-e29b-41d4-a716-446655440006",
    "validationData": {
      "source": "data"
    }
  }'
```

**Response (400 Bad Request):**
```json
{
  "validationResult": false,
  "message": "Missing required field: validationType",
  "details": {
    "fieldName": "validationType",
    "constraint": "NotNull"
  }
}
```

---

## 7. Validation Type Deep Dives

### ID_VALIDATION

**Purpose:** Validate applicant-provided ID (driver's license, passport) against government records.

**Comparison Logic:** Fuzzy string matching with Levenshtein distance

**Request:**
```json
{
  "validationType": "ID_VALIDATION",
  "validationData": {
    "source": "DL123456AB",
    "destination": "DL123456AB"
  },
  "config": {
    "comparisonType": "FUZZY_MATCH",
    "threshold": 0.95,
    "maxFuzzyDistance": 2
  }
}
```

**Response Examples:**
- **PASS:** Exact match (confidence: 1.0)
- **PASS:** One character different, within fuzzy tolerance (confidence: 0.9)
- **FAIL:** Multiple character differences, exceeds threshold (confidence: 0.5)

---

### LEGAL_NAME_VALIDATION

**Purpose:** Validate business legal name matches company registration.

**Comparison Logic:** Fuzzy matching with company suffix removal (LLC, Inc, Corp, etc.)

**Request:**
```json
{
  "validationType": "LEGAL_NAME_VALIDATION",
  "validationData": {
    "source": "Acme Inc",
    "destination": "Acme Incorporated"
  },
  "config": {
    "comparisonType": "FUZZY_MATCH",
    "threshold": 0.90
  }
}
```

**Response:**
- Removes suffixes: "Acme Inc" → "Acme", "Acme Incorporated" → "Acme"
- Compares cleaned names: "Acme" vs "Acme"
- Result: PASS (confidence: 1.0)

---

### CREDIT_VALIDATION

**Purpose:** Validate credit score meets minimum threshold.

**Comparison Logic:** Numeric comparison (≥ min threshold)

**Request:**
```json
{
  "validationType": "CREDIT_VALIDATION",
  "validationData": {
    "source": "750"
  },
  "config": {
    "comparisonType": "NUMERIC_COMPARE",
    "minCreditScore": 700.0
  }
}
```

**Response:**
- Credit score: 750
- Min threshold: 700
- Result: PASS (confidence: (750-700)/100 = 0.5, capped at 1.0)

---

### DATE_VALIDATION

**Purpose:** Validate date is within acceptable range (incorporation date, birth date, expiry date).

**Comparison Logic:** Date range check (min ≤ date ≤ max)

**Request:**
```json
{
  "validationType": "DATE_VALIDATION",
  "validationData": {
    "source": "1990-01-15"
  },
  "config": {
    "comparisonType": "DATE_RANGE",
    "minDate": "1980-01-01",
    "maxDate": "2005-12-31",
    "dataType": "DATE"
  }
}
```

**Response:**
- Date: 1990-01-15
- Min: 1980-01-01, Max: 2005-12-31
- Result: PASS (date is between min and max)

---

### ENTITY_NATURE_VALIDATION

**Purpose:** Validate entity type/nature (LLC, Corporation, etc.) is in predefined whitelist.

**Comparison Logic:** Whitelist lookup (predefined rules)

**Request:**
```json
{
  "validationType": "ENTITY_NATURE_VALIDATION",
  "validationData": {
    "source": "LLC"
  },
  "config": {
    "comparisonType": "PREDEFINED_RULE",
    "predefinedValue": "ALLOWED_ENTITY_TYPES"
  }
}
```

**Allowed Values:** LLC, CORPORATION, S_CORP, PARTNERSHIP, SOLE_PROPRIETOR

**Response:**
- Result: PASS if source in allowed list, FAIL otherwise

---

### ADDRESS_VALIDATION

**Purpose:** Validate address format and postal code validity.

**Comparison Logic:** Format check + postal code lookup

**Request:**
```json
{
  "validationType": "ADDRESS_VALIDATION",
  "validationData": {
    "source": "123 Main St, New York, NY 10001"
  },
  "config": {
    "comparisonType": "PREDEFINED_RULE"
  }
}
```

**Validation Steps:**
1. Check address format (street, city, state, zip)
2. Validate postal code exists
3. Validate state code matches postal code range

**Response:**
- PASS: Valid address format and postal code exists
- FAIL: Invalid format or postal code not found

---

## 8. Idempotency & Error Retry

### Idempotency Key

The **transId** field serves as an **idempotency key** for request deduplication at the calling service (ACV Services).

**Behavior:**
- If same transId received twice, ACV Services can detect and use cached response
- Validation Engine does NOT maintain idempotency cache (stateless microservice design)
- Full responsibility for deduplication lies with ACV Services

**Example:**
```bash
# Request 1 (new transaction)
transId: "550e8400-e29b-41d4-a716-446655440001"
→ Response: validationResult = true

# Network timeout, ACV Services retries with same transId
transId: "550e8400-e29b-41d4-a716-446655440001"
→ Response: validationResult = true (again)

# ACV Services detects duplicate transId, uses cached response
```

---

## 9. Rate Limiting & Throttling

| Aspect | Limit | Note |
|--------|-------|------|
| **Requests per second** | 1,000 req/s (configurable) | Per instance; scales horizontally |
| **Request timeout** | 500ms (p99) | Requests taking longer logged as slow |
| **Request body size** | 1MB max | Enforced by API Gateway |
| **Response time** | p50 < 100ms, p99 < 500ms | SLA for normal conditions |

---

## 10. Authentication & Authorization

### Service-to-Service (mTLS)

- **Mechanism:** Mutual TLS certificate validation
- **Certificate:** Issued by internal CA, rotated by ServiceMeshController
- **Enforcer:** API Gateway / Service Mesh Ingress
- **Validation Engine:** Trusts all mTLS-validated requests (no additional auth)

### Example: Kubernetes ingress with mTLS

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: validation-engine-authz
spec:
  selector:
    matchLabels:
      app: acv-validation-engine
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/default/sa/acv-services"]
    to:
    - operation:
        methods: ["POST"]
        paths: ["/validate"]
```

**Authorization:** All requests that pass mTLS validation are authorized. Service assumes caller (ACV Services) is trusted.

---

## 11. API Versioning Strategy

### Current Version

- **Version:** 1.1.4
- **API Version:** v1 (implicit, no version prefix in URL)

### Future Versioning (v2, v3)

If major API changes required:

```
POST /v1/validate        (current version)
POST /v2/validate        (new version with breaking changes)
```

Both versions supported simultaneously during transition period (minimum 2 quarters).

---

## 12. OpenAPI/Swagger Specification

### Endpoint: /swagger-ui.html

Interactive API documentation available at: `http://localhost:8081/swagger-ui.html`

### OpenAPI YAML Export

```yaml
openapi: 3.0.1
info:
  title: ACV Validation Engine API
  version: 1.1.4
servers:
  - url: http://localhost:8081
paths:
  /validate:
    post:
      summary: Execute validation
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ValidationDto'
      responses:
        '200':
          description: Validation completed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationResponse'
        '400':
          description: Invalid request
        '500':
          description: Server error
components:
  schemas:
    ValidationDto:
      type: object
      properties:
        transId:
          type: string
          format: uuid
        validationType:
          type: string
          enum: [ID_VALIDATION, LEGAL_NAME_VALIDATION, ...]
        validationData:
          $ref: '#/components/schemas/DataObject'
        config:
          $ref: '#/components/schemas/ValidationConfig'
```

---

## Cross-References

- [HLD.md](HLD.md) — Architecture and business flows
- [LLD.md](LLD.md) — Class implementation details
- [code-mapping.md](code-mapping.md) — Class inventory

---

**Last Updated:** 2025-01-30  
**Version:** 1.1.4  
**Audience:** API Consumers, Integration Teams, QA
