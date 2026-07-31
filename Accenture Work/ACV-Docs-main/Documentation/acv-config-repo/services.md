# ACV Configuration Repository - Services & API Reference

**Purpose:** Document configuration API contracts, endpoints, and service integration patterns.

**Scope:** Config Server endpoints, configuration fetching, refresh operations, and schemas.

---

## 1. Configuration Server API Overview

### 1.1 API Base & Authentication

```
Base URL: https://config-server.company.com:8888
or (Development): http://localhost:8888

Authentication: Basic Auth
  Username: configuser
  Password: ${CONFIG_SERVER_PASSWORD}  # From Key Vault
```

### 1.2 API Documentation Matrix

| Endpoint | Method | Purpose | Auth | Response |
|----------|--------|---------|------|----------|
| `/config-repo/{service}/{profile}` | GET | Fetch properties | Basic | JSON properties |
| `/config-repo/{service}/{profile}.yml` | GET | Fetch as YAML | Basic | YAML configuration |
| `/config-repo/{service}/{profile}.properties` | GET | Fetch as properties | Basic | Properties format |
| `/actuator/health` | GET | Health check | None | Health status |
| `/actuator/metrics` | GET | Metrics list | Basic | Metric names |
| `/actuator/env` | GET | Environment vars | Basic | All env properties |

---

## 2. Property Fetching API

### 2.1 Endpoint: Get JSON Properties

**Request:**
```
GET /config-repo/acv-validation-services/dev
Authorization: Basic Y29uZmlndXNlcjpwYXNzd29yZA==
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "name": "acv-validation-services",
  "profiles": ["dev"],
  "label": "main",
  "version": "abc123def456",
  "state": null,
  "propertySources": [
    {
      "name": "file:///config-repo/acv-validation-services/acv-validation-services-dev.yml",
      "source": {
        "spring.application.name": "account-creation-validation-services",
        "spring.datasource.url": "jdbc:h2:mem:testdb",
        "spring.datasource.username": "sa",
        "spring.datasource.password": "password",
        "spring.datasource.hikari.maximum-pool-size": 20,
        "spring.datasource.hikari.connection-timeout": 20000,
        "spring.jpa.database-platform": "org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto": "update",
        "acv.validation.fuzzyMatchThreshold": 0.85,
        "acv.validation.cacheEnabled": true,
        "acv.validation.cacheTtlMinutes": 60,
        "acv.api.connector.url": "http://localhost:7008",
        "acv.api.connector.timeout": 30,
        "management.endpoints.web.exposure.include": "*",
        "logging.level.root": "INFO",
        "logging.level.com.fedex.acv": "DEBUG"
      }
    }
  ]
}
```

**Response Breakdown:**
- `name` — Service identifier
- `profiles` — Active profiles (e.g., "dev", "prod")
- `label` — Git branch/tag used
- `version` — Git commit SHA
- `propertySources[]` — Array of configuration sources
  - `name` — File path or source identifier
  - `source` — Flat map of all properties

### 2.2 Endpoint: Get YAML Configuration

**Request:**
```
GET /config-repo/acv-validation-services/dev.yml
Authorization: Basic Y29uZmlndXNlcjpwYXNzd29yZA==
Content-Type: application/x-yaml
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
      connection-timeout: 20000
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update

acv:
  validation:
    fuzzyMatchThreshold: 0.85
    cacheEnabled: true
    cacheTtlMinutes: 60
  api:
    connector:
      url: http://localhost:7008
      timeout: 30

management:
  endpoints:
    web:
      exposure:
        include: '*'

logging:
  level:
    root: INFO
    com.fedex.acv: DEBUG
```

### 2.3 Endpoint: Get Properties Format

**Request:**
```
GET /config-repo/acv-validation-services/dev.properties
Authorization: Basic Y29uZmlndXNlcjpwYXNzd29yZA==
Accept: text/plain
```

**Response (200 OK):**
```properties
spring.application.name=account-creation-validation-services
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=password
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.connection-timeout=20000
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
acv.validation.fuzzyMatchThreshold=0.85
acv.validation.cacheEnabled=true
acv.validation.cacheTtlMinutes=60
acv.api.connector.url=http://localhost:7008
acv.api.connector.timeout=30
management.endpoints.web.exposure.include=*
logging.level.root=INFO
logging.level.com.fedex.acv=DEBUG
```

---

## 3. Configuration Refresh API

### 3.1 Manual Property Refresh

**Purpose:** Trigger property reload without service restart.

**Request:**
```
POST /actuator/refresh
Authorization: Basic Y29uZmlndXNlcjpwYXNzd29yZA==
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  "acv.api.connector.url",
  "acv.validation.cacheTtlMinutes",
  "logging.level.com.fedex.acv"
]
```

**Explanation:**
- Returns list of properties that changed
- Only properties marked with `@RefreshScope` are updated
- Other properties require full restart

**Example: Updating API Connector URL**

1. Edit configuration file:
   ```bash
   # acv-validation-services/acv-validation-services-dev.yml
   acv:
     api:
       connector:
         url: http://new-connector-url:7008  # Changed
   ```

2. Commit and push:
   ```bash
   git add acv-validation-services/acv-validation-services-dev.yml
   git commit -m "chore: Update connector URL for dev"
   git push origin main
   ```

3. Trigger refresh on service:
   ```bash
   curl -X POST \
     -H "Authorization: Basic Y29uZmlndXNlcjpwYXNzd29yZA==" \
     http://validation-service:8080/actuator/refresh
   ```

4. Property updated within 1 second

### 3.2 Configuration Changed Events

```java
// On /actuator/refresh POST:

1. Config Server fetches latest from Git (pull latest)
2. For each service instance:
   3. Spring Cloud Config Client receives new properties
   4. Spring Cloud Bus publishes RefreshScopeRefreshedEvent (if bus enabled)
   5. @RefreshScope beans are reconstructed with new properties
   6. Client logs "Refresh scope triggered"
   7. New property values available in application
```

---

## 4. Health Check Endpoints

### 4.1 Service Health Status

**Request:**
```
GET /actuator/health
Authorization: None (public)
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "H2",
        "hello": 1
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 1099511627776,
        "free": 549755813888,
        "threshold": 10485760,
        "exists": true
      }
    },
    "livenessState": {
      "status": "UP"
    },
    "readinessState": {
      "status": "UP"
    }
  }
}
```

### 4.2 Detailed Health Check

**Request:**
```
GET /actuator/health/liveness
Authorization: None
```

**Response (200 OK):**
```json
{
  "status": "UP"
}
```

**Health Check Endpoint Matrix:**
| Endpoint | Purpose | Returns |
|----------|---------|---------|
| `/actuator/health` | Overall health | UP/DOWN/UNKNOWN |
| `/actuator/health/liveness` | Process running | UP/DOWN |
| `/actuator/health/readiness` | Accept traffic | UP/DOWN |
| `/actuator/health/db` | Database connection | UP/DOWN |
| `/actuator/health/diskSpace` | Disk availability | UP/DOWN |

---

## 5. Metrics & Monitoring Endpoints

### 5.1 Metrics List

**Request:**
```
GET /actuator/metrics
Authorization: Basic (for prod)
```

**Response:**
```json
{
  "names": [
    "jvm.memory.used",
    "jvm.memory.max",
    "jvm.threads.active",
    "process.cpu.usage",
    "http.server.requests",
    "spring.config.service.requests"
  ]
}
```

### 5.2 Specific Metric Query

**Request:**
```
GET /actuator/metrics/process.cpu.usage
```

**Response:**
```json
{
  "name": "process.cpu.usage",
  "description": "The recent CPU usage for the Java Virtual Machine process",
  "baseUnit": null,
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 0.0012345
    }
  ],
  "availableTags": []
}
```

### 5.3 Prometheus Metrics Export

**Request:**
```
GET /actuator/prometheus
Accept: text/plain
```

**Response (excerpt):**
```prometheus
# HELP jvm_memory_used_bytes The amount of used memory
# TYPE jvm_memory_used_bytes gauge
jvm_memory_used_bytes{area="heap",id="Eden Space",} 5.24288E8

# HELP process_cpu_usage The recent CPU usage for the Java Virtual Machine process
# TYPE process_cpu_usage gauge
process_cpu_usage 0.0012345

# HELP http_server_requests_seconds HTTP server requests
# TYPE http_server_requests_seconds summary
http_server_requests_seconds_count{method="GET",status="200",uri="/actuator/health",} 1543.0
http_server_requests_seconds_sum{method="GET",status="200",uri="/actuator/health",} 127.895
```

---

## 6. Configuration Properties by Service

### 6.1 Validation Services Properties

**Core Properties:**
```yaml
acv.validation:
  fuzzyMatchThreshold: 0.85-0.90      # String similarity threshold
  levenshteinDistance: 2              # Character distance tolerance
  cacheEnabled: true                  # Enable fuzzy match cache
  cacheTtlMinutes: 60-120             # Cache TTL by environment
  
  rules:
    maxRuleSize: 1000                 # Max bytes per rule
    maxRulesPerService: 500           # Max rules loaded
```

### 6.2 API Connector Service Properties

**Provider Configuration:**
```yaml
acv.connector.providers:
  signzy:
    endpoint: https://api.signzy.com/v1/process
    apiKey: ${SIGNZY_API_KEY}         # From Key Vault
    timeout: 60                       # Seconds
    maxRetries: 3
    
  creditbureau:
    endpoint: https://api.creditbureau.com/v1/report
    apiKey: ${CREDITBUREAU_API_KEY}
    timeout: 45
    maxRetries: 2

acv.connector.polling:
  maxWaitMinutes: 10
  checkIntervalSeconds: 5
  timeoutSeconds: 30
```

### 6.3 Database Service Properties

**Connection & Migration:**
```yaml
acv.database:
  pool:
    size: 20-100                      # By environment
    timeout: 30000                    # 30 seconds
  
  migrations:
    enabled: true                     # Always enabled
    location: classpath:db/migration  # Flyway location
  
  caching:
    enabled: true
    ttlMinutes: 60
```

---

## 7. Error Responses

### 7.1 Missing Configuration

**Request:**
```
GET /config-repo/unknown-service/dev
```

**Response (404 Not Found):**
```json
{
  "timestamp": "2026-04-02T14:32:15.287Z",
  "status": 404,
  "error": "Not Found",
  "message": "Configuration not found for service: unknown-service, profile: dev",
  "path": "/config-repo/unknown-service/dev"
}
```

### 7.2 Invalid Profile

**Request:**
```
GET /config-repo/acv-validation-services/invalid
```

**Response (404 Not Found):**
```json
{
  "name": "acv-validation-services",
  "profiles": ["invalid"],
  "label": "main",
  "propertySources": []  # Empty - no config found
}
```

### 7.3 Authentication Failure

**Request:**
```
GET /config-repo/acv-validation-services/dev
Authorization: Basic InvalidBase64
```

**Response (401 Unauthorized):**
```json
{
  "timestamp": "2026-04-02T14:32:15.287Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid basic credentials",
  "path": "/config-repo/acv-validation-services/dev"
}
```

### 7.4 Git Repository Inaccessible

**Response (503 Service Unavailable):**
```json
{
  "timestamp": "2026-04-02T14:32:15.287Z",
  "status": 503,
  "error": "Service Unavailable",
  "message": "Failed to fetch configuration from Git repository: Connection refused",
  "path": "/config-repo/acv-validation-services/dev"
}
```

---

## 8. Configuration Client Integration

### 8.1 Spring Cloud Config Client Bootstrap

**bootstrap.yml (loaded FIRST before application.yml):**
```yaml
spring:
  application:
    name: acv-validation-services      # Must match config file
  
  cloud:
    config:
      uri: https://config-server:8888
      fail-fast: true                  # Fail startup if config unavailable
      retry:
        initial-interval: 1000         # Start with 1 second
        max-interval: 10000            # Max 10 seconds
        multiplier: 1.1                # Increment by 10%
```

### 8.2 Configuration Load Order

```
1. bootstrap.yml (hardcoded in app)
   ↓
2. Connect to Config Server using spring.application.name & spring.profiles.active
   ↓
3. Config Server Git pull: acv-validation-services-dev.yml
   ↓
4. Properties loaded into Spring Environment
   ↓
5. application.yml merged (if exists)
   ↓
6. @ConfigurationProperties beans created
   ↓
7. @PostConstruct methods called
   ↓
8. Application ready
```

### 8.3 @RefreshScope Annotation

**Usage Example:**
```java
package com.fedex.acv.validation.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

@RefreshScope                          // Marks bean for refresh
@Component
@ConfigurationProperties(prefix = "acv.validation")
public class ValidationProperties {
    private double fuzzyMatchThreshold = 0.85;
    private boolean cacheEnabled = true;
    private int cacheTtlMinutes = 60;
    
    // Getters & setters with refresh annotations
    public double getFuzzyMatchThreshold() {
        return fuzzyMatchThreshold;
    }
    
    public void setFuzzyMatchThreshold(double threshold) {
        this.fuzzyMatchThreshold = threshold;
    }
}
```

**Refresh Behavior:**
- When `/actuator/refresh` called
- Spring Cloud Context destroys old bean instance
- Creates new instance with updated properties
- Beans depending on this component auto-inject new instance
- Zero downtime during refresh

---

## 9. Troubleshooting API Issues

### 9.1 Configuration Not Updating

**Symptoms:** Configuration change not reflected after commit.

**Diagnosis Steps:**
```bash
# 1. Verify file exists in Git
curl https://config-server:8888/config-repo/acv-validation-services/dev

# 2. Check Git branch
git remote -v
git branch

# 3. Verify commit was pushed
git log --oneline | head -5

# 4. Trigger manual refresh
curl -X POST http://service:8080/actuator/refresh

# 5. Check refresh response
# If property not listed, it may not have @RefreshScope

# 6. Verify @RefreshScope annotation on bean
grep -r "@RefreshScope" src/main/java/
```

### 9.2 Config Server Unreachable

**Symptoms:** Application fails to start with "Connection refused".

**Diagnosis:**
```bash
# 1. Check Config Server is running
curl http://config-server:8888/actuator/health

# 2. Verify network connectivity
ping config-server
telnet config-server 8888

# 3. Check credentials
curl -u configuser:password http://config-server:8888/config-repo/acv-validation-services/dev

# 4. Review Config Server logs
kubectl logs deploy/config-server -n default

# 5. Check bootstrap.yml path
ls -la src/main/resources/bootstrap.yml
```

---

## Cross-References

- [README.md](README.md) — Project overview
- [HLD.md](HLD.md) — Architecture and patterns
- [LLD.md](LLD.md) — YAML structure and examples
- [code-mapping.md](code-mapping.md) — File organization
- [glossary.md](glossary.md) — API terminology
- [onboarding.md](onboarding.md) — Integration setup

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** Developers, DevOps Engineers, Integration Teams
