# ACV Configuration Server - Services & API Reference

**Purpose:** Document REST endpoints, contracts, and integration patterns.

**Scope:** API endpoints, request/response formats, authentication, error handling.

---

## 1. Configuration Server API Overview

### 1.1 Base URL & Authentication

```
Development:
  Base URL: http://localhost:8080
  Authentication: None (open access)

Production:
  Base URL: https://acv-config-server.fxi-prod.com/acv/config
  Authentication: Basic Auth (configuser:password)
```

---

## 2. Core Configuration Endpoints

### 2.1 GET /config-repo/{service}/{profile}

**Fetch configuration as JSON**

**Request:**
```
GET /config-repo/acv-validation-services/dev
Accept: application/json
Authorization: Basic (if production)
```

**Response (200 OK):**
```json
{
  "name": "acv-validation-services",
  "profiles": ["dev"],
  "label": "main",
  "version": "abc123def456789",
  "state": null,
  "propertySources": [
    {
      "name": "file:///git/repo/acv-validation-services/acv-validation-services-dev.yml",
      "source": {
        "spring.application.name": "account-creation-validation-services",
        "spring.datasource.url": "jdbc:h2:mem:testdb",
        "spring.datasource.username": "sa",
        "spring.datasource.password": "password",
        "spring.datasource.hikari.maximum-pool-size": 20,
        "spring.jpa.hibernate.ddl-auto": "update",
        "acv.validation.fuzzyMatchThreshold": 0.85,
        "acv.validation.cacheEnabled": true,
        "acv.validation.cacheTtlMinutes": 60,
        "logging.level.root": "INFO",
        "logging.level.com.fedex.acv": "DEBUG"
      }
    }
  ]
}
```

**Response Fields:**
- `name` — Service identifier (matches config filename)
- `profiles` — Active profiles requested
- `label` — Git branch/tag used
- `version` — Git commit SHA
- `propertySources[]` — Configuration sources (usually 1 per file)
  - `name` — Source descriptor (file path in Git)
  - `source` — Flat map of all properties

### 2.2 GET /config-repo/{service}/{profile}.yml

**Fetch configuration as YAML**

**Request:**
```
GET /config-repo/acv-validation-services/dev.yml
Accept: application/x-yaml
```

**Response (200 OK):**
```yaml
spring:
  application:
    name: account-creation-validation-services
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
    password: password
    hikari:
      maximum-pool-size: 20
  jpa:
    hibernate:
      ddl-auto: update

acv:
  validation:
    fuzzyMatchThreshold: 0.85
    cacheEnabled: true
    cacheTtlMinutes: 60

logging:
  level:
    root: INFO
    com.fedex.acv: DEBUG
```

### 2.3 GET /config-repo/{service}/{profile}.properties

**Fetch configuration as properties file**

**Request:**
```
GET /config-repo/acv-validation-services/dev.properties
Accept: text/plain
```

**Response (200 OK):**
```properties
spring.application.name=account-creation-validation-services
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=password
spring.datasource.hikari.maximum-pool-size=20
spring.jpa.hibernate.ddl-auto=update
acv.validation.fuzzyMatchThreshold=0.85
acv.validation.cacheEnabled=true
acv.validation.cacheTtlMinutes=60
logging.level.root=INFO
logging.level.com.fedex.acv=DEBUG
```

### 2.4 GET /config-repo/{service}/{profile}/{label}

**Fetch configuration from specific Git branch/tag**

**Request:**
```
GET /config-repo/acv-validation-services/dev/release-1.0.0
Accept: application/json
```

**Usage:**
- `{label}` = Git branch name (e.g., "main", "dev", "hotfix/issue-123")
- `{label}` = Git tag (e.g., "v1.0.0", "config-prod-2024-04-02")
- If not specified: uses defaultLabel from application.yml (usually "main")

---

## 3. Health Check Endpoints

### 3.1 GET /actuator/health

**Overall service health**

**Request:**
```
GET /actuator/health
```

**Response (200 OK):**
```json
{
  "status": "UP",
  "components": {
    "livenessState": {
      "status": "UP"
    },
    "readinessState": {
      "status": "UP"
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 1099511627776,
        "free": 549755813888,
        "threshold": 10485760,
        "exists": true
      }
    }
  }
}
```

### 3.2 GET /actuator/health/liveness

**Kubernetes liveness probe**

**Request:**
```
GET /actuator/health/liveness
```

**Response (200 OK):**
```json
{"status": "UP"}
```

**Purpose:** Kubernetes checks if process is alive (not hung/deadlocked)

### 3.3 GET /actuator/health/readiness

**Kubernetes readiness probe**

**Request:**
```
GET /actuator/health/readiness
```

**Response (200 OK):**
```json
{"status": "UP"}
```

**Purpose:** Kubernetes checks if pod ready to accept traffic

---

## 4. Metrics Endpoints

### 4.1 GET /actuator/metrics

**Available metrics list**

**Request:**
```
GET /actuator/metrics
```

**Response (200 OK):**
```json
{
  "names": [
    "http.server.requests",
    "jvm.memory.used",
    "jvm.memory.max",
    "jvm.threads.active",
    "process.cpu.usage",
    "process.uptime",
    "spring.config.service.requests"
  ]
}
```

### 4.2 GET /actuator/metrics/{metric}

**Specific metric details**

**Request:**
```
GET /actuator/metrics/http.server.requests
```

**Response (200 OK):**
```json
{
  "name": "http.server.requests",
  "description": "HTTP server requests",
  "baseUnit": "seconds",
  "measurements": [
    {
      "statistic": "COUNT",
      "value": 1543
    },
    {
      "statistic": "TOTAL_TIME",
      "value": 127.895
    },
    {
      "statistic": "MAX",
      "value": 0.785
    }
  ],
  "availableTags": [
    {
      "tag": "method",
      "values": ["GET", "POST"]
    },
    {
      "tag": "uri",
      "values": ["/config-repo/...", "/actuator/health"]
    },
    {
      "tag": "status",
      "values": ["200", "404"]
    }
  ]
}
```

### 4.3 GET /actuator/prometheus

**Prometheus metrics format**

**Request:**
```
GET /actuator/prometheus
Accept: text/plain
```

**Response (200 OK):**
```prometheus
# HELP http_server_requests_seconds HTTP server requests
# TYPE http_server_requests_seconds summary
http_server_requests_seconds_count{method="GET",status="200",uri="/config-repo/acv-validation-services/dev",} 850.0
http_server_requests_seconds_sum{method="GET",status="200",uri="/config-repo/acv-validation-services/dev",} 45.321
http_server_requests_seconds_max{method="GET",status="200",uri="/config-repo/acv-validation-services/dev",} 0.512

# HELP jvm_memory_used_bytes JVM memory used bytes
# TYPE jvm_memory_used_bytes gauge
jvm_memory_used_bytes{area="heap",id="G1 Eden Space",} 5.24288E8
jvm_memory_used_bytes{area="heap",id="G1 Old Generation",} 1.2288E8

# HELP process_cpu_usage Process CPU usage
# TYPE process_cpu_usage gauge
process_cpu_usage 0.0125
```

**Used by Grafana/monitoring systems for dashboards and alerting**

---

## 5. Management Endpoints

### 5.1 GET /actuator/env

**Environment properties & property sources**

**Request:**
```
GET /actuator/env
```

**Response (200 OK - excerpt):**
```json
{
  "propertySources": [
    {
      "name": "systemProperties",
      "properties": {
        "java.version": {"value": "21"}
      }
    },
    {
      "name": "systemEnvironment",
      "properties": {
        "DEPLOY_KEY": {"value": "****"},
        "SPRING_PROFILES_ACTIVE": {"value": "prod"}
      }
    }
  ]
}
```

### 5.2 POST /actuator/shutdown

**Graceful shutdown endpoint (dev only)**

**Request:**
```
POST /actuator/shutdown
```

**Response (200 OK):**
```json
{"message": "Shutting down, bye..."}
```

**Note:** Only available if `management.endpoint.shutdown.enabled=true` (disabled in production)

---

## 6. Error Responses

### 6.1 Service Not Found (404)

**Request:**
```
GET /config-repo/unknown-service/dev
```

**Response (404 Not Found):**
```json
{
  "name": "unknown-service",
  "profiles": ["dev"],
  "propertySources": []
}
```

**Note:** Returns 200 OK with empty propertySources instead of 404

### 6.2 Invalid Profile

**Request:**
```
GET /config-repo/acv-validation-services/invalid-profile
```

**Response:** Returns properties from default label/branch

### 6.3 Git Authentication Error

**Request:**
```
GET /config-repo/acv-validation-services/dev
```

**Response (503 Service Unavailable):**
```json
{
  "timestamp": "2026-04-02T14:32:15.287Z",
  "status": 503,
  "error": "Service Unavailable",
  "message": "Authentication failed for SSH key",
  "path": "/config-repo/acv-validation-services/dev"
}
```

**Cause:** Invalid DEPLOY_KEY or missing GitHub SSH key

### 6.4 Git Repository Unreachable

**Response (503 Service Unavailable):**
```json
{
  "timestamp": "2026-04-02T14:32:15.287Z",
  "status": 503,
  "error": "Service Unavailable",
  "message": "Failed to fetch from GitHub: Connection refused",
  "path": "/config-repo/acv-validation-services/dev"
}
```

### 6.5 Malformed YAML (Client Side Issue)

**Response:** Returns 200 OK with parsing error in logs
- Config Server doesn't validate YAML syntax
- Clients receive invalid properties
- Errors appear in client logs during property binding

---

## 7. API Request Examples

### 7.1 Using curl

```bash
# 1. Fetch dev configuration (JSON)
curl http://localhost:8080/config-repo/acv-validation-services/dev | jq

# 2. Fetch with authentication (production)
curl -u configuser:password \
  https://acv-config-server.com/acv/config/config-repo/acv-validation-services/prod

# 3. Fetch as YAML
curl http://localhost:8080/config-repo/acv-validation-services/dev.yml

# 4. Fetch from specific Git branch
curl http://localhost:8080/config-repo/acv-validation-services/dev/hotfix-issue-123

# 5. Check health
curl http://localhost:8081/actuator/health

# 6. Get metrics
curl http://localhost:8081/actuator/metrics/http.server.requests
```

### 7.2 Using Spring Cloud Config Client

```java
@RestController
@RequestMapping("/api")
public class AppController {
    
    @Autowired
    private ConfigClient configClient;
    
    @GetMapping("/config")
    public String getConfig() {
        // Alternatively, inject properties via @Value or @ConfigurationProperties
        // ConfigClient used for programmatic access if needed
        return "Configuration loaded";
    }
}
```

---

## 8. Configuration Properties for Clients

### 8.1 bootstrap.yml (Config Client)

**Required to connect to Config Server:**

```yaml
spring:
  application:
    name: acv-validation-services              # MUST match config filename
  
  cloud:
    config:
      uri: https://config-server:8888          # Config Server URL
      fail-fast: true                          # Fail startup if unreachable
      retry:
        initial-interval: 1000                 # 1 second
        max-interval: 10000                    # 10 seconds
        multiplier: 1.1
      username: configuser                     # Production auth
      password: ${CONFIG_PASSWORD}
      
  # Other profiles if needed
  profiles:
    include: discovery                         # Additional profiles
```

---

## Cross-References

- [HLD.md](HLD.md) — Architecture context
- [LLD.md](LLD.md) — Implementation details
- [code-mapping.md](code-mapping.md) — Code structure

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** Integration Engineers, API Consumers, Developers
