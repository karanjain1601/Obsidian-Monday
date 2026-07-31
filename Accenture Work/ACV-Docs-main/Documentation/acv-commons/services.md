# REST API & Service Contracts — ACV Commons Library

## API Overview

ACV Commons exposes debug/admin REST endpoints for cache management, token inspection, and event hub diagnostics. These endpoints are **only available in non-production profiles** (dev, local, test).

---

## Endpoint Inventory

| HTTP Method | Endpoint | Profile | Purpose | Auth Required |
|-------------|----------|---------|---------|---|
| `GET` | `/commons/v1/http-clients` | dev, local | List available HTTP clients | No |
| `GET` | `/commons/v1/token/{client}` | dev, local | Get cached token for client | No |
| `POST` | `/commons/v1/token/refresh/{client}` | dev, local | Force refresh token | No |
| `GET` | `/commons/v1/cache/cache-names` | All | List cache names | No |
| `DELETE` | `/commons/v1/cache/clear-all` | All | Clear all caches | No |
| `DELETE` | `/commons/v1/cache/clear-all-tokens` | All | Clear all cached tokens | No |
| `DELETE` | `/commons/v1/cache/clear-token/{service-name}` | All | Clear token for service | No |
| `DELETE` | `/commons/v1/cache/clear/{cache-name}` | All | Clear specific cache | No |
| `GET` | `/commons/v1/eventHub/events` | dev, local | List recent event hub events | No |
| `POST` | `/commons/v1/eventHub/publish` | dev, local | Publish message to event hub | No |
| `GET` | `/commons/v1/logging/level` | dev, local | Get current log level | No |
| `POST` | `/commons/v1/logging/level` | dev, local | Set log level dynamically | No |

---

## Endpoint Details

### 1. HTTP Clients Management

#### List Available HTTP Clients
```http
GET /commons/v1/http-clients
Authorization: (not required)
```

**Response:**
```json
[
    "acv-service",
    "data-service",
    "document-service",
    "api-connector",
    "multi:scheduler-service"
]
```

**Status Codes:**
- `200 OK` — List returned

---

#### Get Cached Token
```http
GET /commons/v1/token/{client}
Authorization: (not required)
```

**Path Parameters:**
- `client` (String, required) — Client name (e.g., "acv-service") or "multi:scheduler-service"

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "issuedAt": "2024-04-02T10:30:00Z",
    "expiresAt": "2024-04-02T11:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request` — Client not found
- `401 Unauthorized` — Token retrieval failed

---

#### Refresh Token
```http
POST /commons/v1/token/refresh/{client}
Authorization: (not required)
Content-Type: application/json
```

**Path Parameters:**
- `client` (String, required) — Client name

**Response:**
```json
{
    "status": "success",
    "message": "Token refreshed",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
}
```

**Status Codes:**
- `200 OK` — Token refreshed
- `400 Bad Request` — Invalid client
- `500 Internal Server Error` — Token refresh failed

---

### 2. Cache Management

#### List Cache Names
```http
GET /commons/v1/cache/cache-names
Authorization: (not required)
```

**Response:**
```json
[
    "token-cache",
    "user-cache",
    "config-cache"
]
```

---

#### Clear All Caches
```http
DELETE /commons/v1/cache/clear-all
Authorization: (not required)
```

**Response:**
```
202 Accepted
```

**Headers:**
```
Location: /commons/v1/cache/cache-names
```

---

#### Clear All Cached Tokens
```http
DELETE /commons/v1/cache/clear-all-tokens
Authorization: (not required)
```

**Response:**
```
202 Accepted
```

---

#### Clear Token for Specific Service
```http
DELETE /commons/v1/cache/clear-token/{service-name}
Authorization: (not required)
```

**Path Parameters:**
- `service-name` (String, required) — Service name (e.g., "acv-service")

**Response:**
```
202 Accepted
```

**Error Responses:**
- `400 Bad Request` — Service not found

---

#### Clear Specific Cache
```http
DELETE /commons/v1/cache/clear/{cache-name}
Authorization: (not required)
```

**Path Parameters:**
- `cache-name` (String, required) — Cache name

**Response:**
```
202 Accepted
```

---

### 3. Event Hub Diagnostics

#### List Recent Events
```http
GET /commons/v1/eventHub/events
Authorization: (not required)
Content-Type: application/json
```

**Query Parameters:**
- `limit` (Integer, optional) — Number of recent events (default: 10)
- `eventType` (String, optional) — Filter by event type

**Response:**
```json
{
    "events": [
        {
            "transactionID": "550e8400-e29b-41d4-a716-446655440000",
            "countryCode": "US",
            "eventType": "COMPLIANCE_CHECK",
            "serviceType": "ACV_SERVICE",
            "messageType": "EVENT_HUB_MSG",
            "message": "Compliance validation started",
            "timestamp": "2024-04-02T10:30:00Z"
        }
    ],
    "total": 1,
    "limit": 10
}
```

---

#### Publish Message to Event Hub
```http
POST /commons/v1/eventHub/publish
Authorization: (not required)
Content-Type: application/json
```

**Request Body:**
```json
{
    "topic": "acv-events",
    "message": "Custom event message",
    "eventType": "CUSTOM_EVENT"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Event published",
    "messageId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 4. Logging Configuration

#### Get Current Log Level
```http
GET /commons/v1/logging/level
Authorization: (not required)
```

**Response:**
```json
{
    "packageName": "com.fedex.acv.commons",
    "logLevel": "INFO"
}
```

---

#### Set Log Level Dynamically
```http
POST /commons/v1/logging/level
Authorization: (not required)
Content-Type: application/json
```

**Request Body:**
```json
{
    "packageName": "com.fedex.acv.commons.http.clients",
    "logLevel": "DEBUG"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Log level updated",
    "packageName": "com.fedex.acv.commons.http.clients",
    "logLevel": "DEBUG"
}
```

---

## Authentication & Authorization

### Current Implementation

All `/commons/v1` endpoints **do not require authentication** in the current implementation. This is intentional for local development and testing.

### Security Configuration

**In Production:** These endpoints should be protected via:

1. **Network Policy:** Restrict access to internal network only
2. **Firewall Rules:** Deny external ingress on port 8080
3. **Service Mesh:** Enforce mTLS for pod-to-pod communication
4. **API Gateway:** Add OAuth2 token requirement for external access

**Configuration:**
```yaml
# application.yml
security:
  endpoints:
    commons:
      allow-public: true  # Development only
      require-role: ADMIN # Production setting
```

---

## Rate Limiting & Throttling

Currently **no rate limiting** implemented for commons endpoints.

### Recommended for Production

```yaml
rate-limiting:
  enabled: true
  token-cache-clear: 1 request per 5 seconds per client IP
  logging-level-change: 1 request per 10 seconds per client IP
  cache-clear-all: 1 request per minute per client IP
```

---

## API Versioning Strategy

**Current Version:** `v1`

**Versioning Pattern:**
- URL path: `/commons/{major-version}/{endpoint}`
- Example: `/commons/v1/cache/cache-names`

**Backward Compatibility:**
- Endpoints remain stable within major version
- New endpoints added as additions only
- Removed endpoints deprecated via warnings before removal

---

## Error Handling

### Standard Error Response Format

```json
{
    "status": "error",
    "code": "INVALID_REQUEST",
    "message": "Client name not found: unknown-client",
    "timestamp": "2024-04-02T10:30:00Z",
    "path": "/commons/v1/token/unknown-client",
    "details": {
        "availableClients": ["acv-service", "data-service"]
    }
}
```

### Common Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `INVALID_REQUEST` | 400 | Malformed request or invalid parameters |
| `NOT_FOUND` | 404 | Resource (cache, client, service) not found |
| `UNAUTHORIZED` | 401 | Operation failed due to auth error |
| `FORBIDDEN` | 403 | Insufficient permissions for operation |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

## Health Check Endpoints

### Spring Boot Actuator (Production Ready)

```http
GET /actuator/health
```

**Response:**
```json
{
    "status": "UP",
    "components": {
        "cacheManager": {
            "status": "UP"
        },
        "db": {
            "status": "UP",
            "details": {
                "database": "SQL Server",
                "validationQuery": "isValid()"
            }
        },
        "diskSpace": {
            "status": "UP",
            "details": {
                "total": 209715200000,
                "free": 104857600000,
                "threshold": 10485760
            }
        }
    }
}
```

### Liveness Probe

```http
GET /actuator/health/liveness
```

Checks if the application is alive (pod restart eligible if fails).

### Readiness Probe

```http
GET /actuator/health/readiness
```

Checks if the application is ready to serve traffic (includes dependent service checks).

---

## OpenAPI/Swagger Documentation

### Endpoint

```http
GET /v3/api-docs
GET /swagger-ui.html
```

### Configuration

**swagger-config.yaml:**
```yaml
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
    filter-by-tags: true
```

### Access

- **Local:** http://localhost:8080/swagger-ui.html
- **Dev:** https://acv-services-dev.platform.io/swagger-ui.html
- **Production:** (disabled)

---

## Usage Examples

### Example 1: Inspect Cached Tokens

```bash
# List available clients
curl -X GET http://localhost:8080/commons/v1/http-clients

# Output:
# ["acv-service", "data-service", "document-service", "api-connector"]

# Get token for acv-service
curl -X GET http://localhost:8080/commons/v1/token/acv-service

# Output:
# {
#   "token": "eyJhbGciOiJIUzI1NiIs...",
#   "expiresIn": 3600,
#   "issuedAt": "2024-04-02T10:30:00Z",
#   "expiresAt": "2024-04-02T11:30:00Z"
# }
```

### Example 2: Clear Cache During Development

```bash
# See all caches
curl -X GET http://localhost:8080/commons/v1/cache/cache-names

# Clear specific cache
curl -X DELETE http://localhost:8080/commons/v1/cache/clear/user-cache

# Clear all caches
curl -X DELETE http://localhost:8080/commons/v1/cache/clear-all
```

### Example 3: Dynamic Logging

```bash
# Enable DEBUG logging for HTTP clients during troubleshooting
curl -X POST http://localhost:8080/commons/v1/logging/level \
  -H "Content-Type: application/json" \
  -d '{
    "packageName": "com.fedex.acv.commons.http.clients",
    "logLevel": "DEBUG"
  }'

# Reset to INFO
curl -X POST http://localhost:8080/commons/v1/logging/level \
  -H "Content-Type: application/json" \
  -d '{
    "packageName": "com.fedex.acv.commons.http.clients",
    "logLevel": "INFO"
  }'
```

---

## Data Models

### TokenData
```json
{
    "jti": "unique-token-id",
    "sub": "service-account",
    "iss": "https://okta-tenant.okta.com",
    "aud": "https://api.compliance.io",
    "iat": 1712055000,
    "exp": 1712058600,
    "scope": "service-to-service",
    "roles": ["SERVICE", "SYSTEM"]
}
```

### LogElements
```json
{
    "transactionID": "550e8400-e29b-41d4-a716-446655440000",
    "countryCode": "US",
    "requestMethod": "POST",
    "requestPath": "/api/v1/validate",
    "requestBody": "{...masked...}",
    "responseStatus": 200,
    "responseTime": 145,
    "timestamp": "2024-04-02T10:30:00Z"
}
```

---

## SDK / Client Libraries

### Java

```java
@Autowired
private AcvServiceClient acvServiceClient;

// Make request
List<?> entities = acvServiceClient.get("/entities", headers, 
    new ParameterizedTypeReference<>() {});
```

### cURL

```bash
curl -X GET http://localhost:8080/commons/v1/cache/cache-names \
  -H "Accept: application/json"
```

### Postman

[Import Postman Collection](#) (available in project documentation)

---

**Last Updated:** April 2, 2026  
**Version:** 1.0
