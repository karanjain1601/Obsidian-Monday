# ACV Data Services - REST API Contracts & Specifications

**Purpose:** Document all REST API endpoints, request/response formats, and data contracts.

**Scope:** v1 and v2 endpoint specifications, authentication, error handling, examples.

---

## 1. API Overview

### 1.1 Base Information

| Property | Value |
|----------|-------|
| **Base URL (Prod)** | `https://data-services.prod.acv.com` |
| **Base URL (Dev)** | `https://data-services-dev.prod.acv.com` |
| **Default Port** | 8080 |
| **API Version** | v1 (stable), v2 (enhanced) |
| **Response Format** | JSON |
| **Authentication** | OAuth2 JWT (Okta) |

### 1.2 Authentication

**All endpoints require Bearer token:**

```http
POST /api/v1/{entity}
Authorization: Bearer {jwt-token}
Content-Type: application/json
```

**Obtaining Token:**
```
1. Authenticate with Okta
2. Okta issues JWT token
3. Include in Authorization header
4. Spring Security validates token
```

---

## 2. v1 API Endpoints

### 2.1 Generic Data Access (v1)

#### POST /api/v1/{entity}

**Purpose:** Generic CRUD endpoint for any entity type

**Path Parameters:**
```
{entity} - Entity type identifier (string)
  Examples: config, user, role, policy
```

**Request Body (JSON):**
```json
{
  "type": "GET|ADD|ALL",      // Operation type
  "entity": "config",         // Redundant with path param
  "filters": {                // Query filters (for GET/ALL operations)
    "id": 1,
    "status": "ACTIVE"
  },
  "data": {                   // Data payload (for ADD operations)
    "name": "new-config",
    "value": "value123",
    "description": "Test config"
  },
  "offset": 0,                // Pagination: starting index
  "limit": 100                // Pagination: max records
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "config-1",
      "value": "value123",
      "created_at": "2026-04-02T10:30:00Z"
    }
  ],
  "count": 1,
  "total": 42
}
```

**Error Response (400/500):**
```json
{
  "status": "error",
  "errorCode": "ERR_INVALID_ENTITY",
  "message": "Entity type 'invalid' not configured",
  "timestamp": "2026-04-02T10:30:00Z"
}
```

**Operation Details:**

**GET Operation:**
```json
{
  "type": "GET",
  "entity": "config",
  "filters": {"id": 1}
}
```
- Returns single entity matching filters
- Uses cache if available
- Response: Single object or empty if not found

**ALL Operation:**
```json
{
  "type": "ALL",
  "entity": "config",
  "offset": 0,
  "limit": 50
}
```
- Returns paginated list of all entities
- Respects pagination parameters
- Response: Array of objects

**ADD Operation:**
```json
{
  "type": "ADD",
  "entity": "config",
  "data": {
    "name": "new-config",
    "value": "test-value"
  }
}
```
- Inserts new entity
- Returns saved object with ID
- Invalidates cache
- Response: Inserted object with generated ID

**HTTP Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (invalid JSON, missing required) |
| 401 | Unauthorized (invalid JWT) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not found (entity type not configured) |
| 500 | Server error |

---

#### POST /api/v1/{entity}/{ctryCd}

**Purpose:** Country-specific data access

**Path Parameters:**
```
{entity} - Entity type (e.g., "config")
{ctryCd} - Country code (e.g., "US", "CA", "MX")
```

**Request Body:** Same as `/api/v1/{entity}`

**Behavior:**
- Automatically filters by country code
- Cache keys include country code
- Multi-tenant isolation enforced
- Same operations as parent endpoint

**Example:**
```http
POST /api/v1/policy/US
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "GET",
  "filters": {"policy_id": 123}
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "policy_id": 123,
    "country": "US",
    "effective_date": "2026-01-01",
    "coverage": "FULL"
  }
}
```

---

### 2.2 Error Responses (v1)

**Common Error Codes:**

| Code | Status | Cause | Resolution |
|------|--------|-------|-----------|
| `ERR_INVALID_ENTITY` | 404 | Entity not configured in ACV_CRUD_CONFIG_INFO | Configure entity in database |
| `ERR_INVALID_OPERATION` | 400 | Unknown operation type (not GET/ADD/ALL) | Use valid operation |
| `ERR_UNAUTHORIZED` | 401 | Missing/invalid JWT token | Authenticate with Okta first |
| `ERR_FORBIDDEN` | 403 | User lacks permission for entity/operation | Request access from admin |
| `ERR_INVALID_JSON` | 400 | Malformed JSON in request body | Fix JSON syntax |
| `ERR_DATABASE_ERROR` | 500 | Query execution failed | Check logs; contact DBA |
| `ERR_CACHE_ERROR` | 500 | Redis cache failed | Check Redis connectivity |

**Error Response Format:**
```json
{
  "status": "error",
  "errorCode": "ERR_INVALID_ENTITY",
  "message": "Entity 'unknown' not found in configuration",
  "details": "No rows in ACV_CRUD_CONFIG_INFO for entity=unknown, type=GET",
  "timestamp": "2026-04-02T10:30:45Z",
  "path": "/api/v1/unknown"
}
```

---

## 3. v2 API Endpoints (Enhanced)

### 3.1 Improved Generic Endpoint

#### POST /api/v2/{entity}

**Purpose:** Enhanced version of v1 with better structure and features

**Key Differences from v1:**
- Structured request envelope
- Pagination object (instead of offset/limit)
- Response metadata
- Field selection support
- Sorting support

**Request Body (JSON):**
```json
{
  "operation": "GET",           // vs "type" in v1
  "filters": {
    "id": 1,
    "status": "ACTIVE"
  },
  "fields": ["id", "name"],     // New: select specific fields
  "sort": {                      // New: sorting
    "created_at": "DESC"
  },
  "pagination": {               // New: structured pagination
    "pageNumber": 1,
    "pageSize": 20
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "config-1"
    }
  ],
  "metadata": {
    "total": 100,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2026-04-02T10:30:00Z",
  "correlationId": "req-12345-67890"
}
```

**New Features:**

**Field Selection:**
```json
{
  "operation": "GET",
  "filters": {"id": 1},
  "fields": ["id", "name", "created_at"]  // Only these columns
}
```

**Sorting:**
```json
{
  "operation": "ALL",
  "sort": {
    "created_at": "DESC",
    "name": "ASC"
  }
}
```

**Advanced Filtering:**
```json
{
  "operation": "ALL",
  "filters": {
    "id": {"$gte": 100, "$lte": 200},
    "status": {"$in": ["ACTIVE", "PENDING"]},
    "name": {"$contains": "config"}
  }
}
```

---

#### POST /api/v2/{entity}/{ctryCd}

**Purpose:** Country-specific v2 API

**Same as v1 variant but with v2 enhancements**

---

### 3.2 Batch Operations (v2)

#### POST /api/v2/{entity}/batch

**Purpose:** Process multiple operations in single request

**Request Body:**
```json
{
  "operations": [
    {
      "id": "op-1",
      "operation": "GET",
      "filters": {"id": 1}
    },
    {
      "id": "op-2",
      "operation": "GET",
      "filters": {"id": 2}
    },
    {
      "id": "op-3",
      "operation": "ADD",
      "data": {"name": "new-item"}
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "op-1",
      "success": true,
      "data": { ... }
    },
    {
      "id": "op-2",
      "success": true,
      "data": { ... }
    },
    {
      "id": "op-3",
      "success": true,
      "data": { ... }
    }
  ],
  "timestamp": "2026-04-02T10:30:00Z"
}
```

**Processing:**
- Requests processed in parallel (CompletableFuture)
- Individual operation failures don't block others
- Each operation has its own success flag

---

## 4. Health & Actuator Endpoints

### 4.1 Health Check

#### GET /actuator/health

**Purpose:** Service health status

**Response (200 OK):**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "result": 1
      }
    },
    "redis": {
      "status": "UP",
      "details": {
        "version": "7.0.0"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 1073741824,
        "free": 536870912,
        "threshold": 10485760,
        "status": "UP"
      }
    }
  }
}
```

---

### 4.2 Metrics

#### GET /actuator/metrics

**Purpose:** Application metrics

**Available Metrics:**
```
hikaricp.connections.active
hikaricp.connections.idle
http.server.requests
spring.cache.gets
redis.commands.duration.seconds
process.cpu.usage
jvm.memory.used
```

---

### 4.3 Readiness & Liveness (Kubernetes)

#### GET /actuator/health/liveness

Process alive check

#### GET /actuator/health/readiness

Ready to serve traffic check

---

## 5. Request/Response Examples

### Example 1: GET Single Config

**Request:**
```http
POST /api/v1/config
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "type": "GET",
  "entity": "config",
  "filters": {"id": 1}
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "success",
  "data": {
    "id": 1,
    "config_key": "MAX_RETRIES",
    "config_value": "3",
    "is_active": true,
    "created_at": "2026-01-15T08:00:00Z"
  }
}
```

---

### Example 2: Add New Entity

**Request:**
```http
POST /api/v1/policy
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "type": "ADD",
  "entity": "policy",
  "data": {
    "policy_name": "COMPLIANCE_CHECK",
    "description": "Automated compliance validation",
    "is_active": true
  }
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "status": "success",
  "data": {
    "id": 1001,
    "policy_name": "COMPLIANCE_CHECK",
    "description": "Automated compliance validation",
    "is_active": true,
    "created_at": "2026-04-02T10:30:00Z"
  }
}
```

---

### Example 3: Country-Specific Data

**Request:**
```http
POST /api/v1/policy/CA
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "type": "GET",
  "filters": {"policy_name": "COMPLIANCE_CHECK"}
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "success",
  "data": {
    "id": 1001,
    "policy_name": "COMPLIANCE_CHECK",
    "country_code": "CA",
    "description": "Automated compliance validation (CA Version)",
    "is_active": true
  }
}
```

---

## 6. Rate Limiting & Throttling

| Limit | Threshold |
|-------|-----------|
| **Requests per minute** | 1000 |
| **Requests per user** | 10000/day |
| **Concurrent connections** | 100 |
| **Request timeout** | 30 seconds |
| **Response size** | 50 MB max |

---

## 7. API Versioning Strategy

**v1 Indefinite Support:**
- Backward compatible
- May be deprecated in future

**v2 Current:**
- Recommended for new integrations
- Enhanced features and better error handling
- Gradual migration path from v1

**Deprecation Notice:**
- v1 will be supported for at least 2 years
- Clients notified 6 months before removal
- v2 endpoints recommended for new development

---

## Cross-References

- [HLD.md](HLD.md) — Architecture & design patterns
- [LLD.md](LLD.md) — Implementation details
- [code-mapping.md](code-mapping.md) — Class navigation

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** API Consumers, Developers, Integration Teams, DevOps Engineers
