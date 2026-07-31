# ACV Configuration Repository - Low-Level Design & YAML Structure

**Purpose:** Document configuration file structure, properties details, and implementation patterns.

**Scope:** YAML file organization, property definitions, real configuration examples.

---

## 1. Repository Structure Details

### 1.1 Directory Organization

```
eai-3540813-config-repo/
│
├── acv-validation-services/
│   ├── acv-validation-services-local.yml        (0.5 KB)
│   ├── acv-validation-services-dev.yml          (2.1 KB)
│   ├── acv-validation-services-test.yml         (2.3 KB)
│   └── acv-validation-services-prod.yml         (2.5 KB)
│
├── api-connector-service/
│   ├── api-connector-service-dev.yml            (1.8 KB)
│   ├── api-connector-service-test.yml           (2.0 KB)
│   └── api-connector-service-prod.yml           (2.2 KB)
│
├── database-service/
│   ├── database-service-dev.yml                 (1.5 KB)
│   ├── database-service-test.yml                (1.7 KB)
│   └── database-service-prod.yml                (1.9 KB)
│
├── config-server/
│   ├── config-server-dev.yml                    (1.2 KB)
│   ├── config-server-test.yml                   (1.4 KB)
│   └── config-server-prod.yml                   (1.6 KB)
│
├── README.md
└── .gitignore
```

---

## 2. Configuration File Templates

### 2.1 Validation Services Configuration

**File:** `acv-validation-services/acv-validation-services-dev.yml`

```yaml
# ============================================================================
# ACV Validation Services - Development Configuration
# ============================================================================

spring:
  application:
    name: account-creation-validation-services
    
  profiles:
    active: dev,discovery
    
  # Database Configuration
  datasource:
    # Development: H2 in-memory database
    url: jdbc:h2:mem:testdb
    driverClassName: org.h2.Driver
    username: sa
    password: password
    hikari:
      # Connection pool settings
      connection-timeout: 20000        # 20 seconds
      minimum-idle: 5                  # Min idle connections
      maximum-pool-size: 20            # Max connections
      idle-timeout: 10000              # 10 seconds
      max-lifetime: 1800000            # 30 minutes
      auto-commit: true
  
  # H2 Console (development only)
  h2:
    console:
      enabled: true
      path: /h2-console
  
  # SQL Initialization
  sql:
    init:
      platform: h2
  
  # JPA/Hibernate Configuration
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update                 # Auto-create/update schema
    show-sql: true
    properties:
      hibernate.format_sql: true
      hibernate.use_sql_comments: true
  
  # Spring Cloud Config
  cloud:
    config:
      server:
        git:
          uri: https://github.com/FedEx/eai-3540813-config-repo
          default-label: main
          search-paths: acv-validation-services
          force-pull: true

# ============================================================================
# ACV Service Configuration
# ============================================================================

acv:
  validation:
    # Fuzzy matching configuration
    fuzzyMatchThreshold: 0.85          # 85% similarity threshold
    levenshteinDistance: 2              # Max character distance
    cacheEnabled: true
    cacheTtlMinutes: 60
    
  api:
    connector:
      url: http://localhost:7008       # Local connector for dev
      timeout: 30                      # 30 seconds
      retryAttempts: 3
      retryDelayMs: 1000              # 1 second initial delay
      
  database:
    migrations:
      enabled: true
      location: classpath:db/migration

# ============================================================================
# Actuator & Management Configuration
# ============================================================================

management:
  # Security for management endpoints (disabled for dev)
  security:
    enabled: false
  
  # Endpoint exposure
  endpoint:
    health:
      enabled: true
      show-details: always            # Show full health details for dev
    info:
      enabled: true
    metrics:
      enabled: true
    prometheus:
      enabled: true
    shutdown:
      enabled: true
  
  # Management server
  server:
    ssl:
      enabled: false
    port: 8081
  
  # Health check settings
  health:
    jms:
      enabled: false
    defaults:
      enabled: true
  
  # Metrics export
  metrics:
    export:
      prometheus:
        enabled: true
        step: 1m
    distribution:
      percentiles-histogram:
        http.server.requests: true

# ============================================================================
# Logging Configuration
# ============================================================================

logging:
  level:
    root: INFO
    com.fedex.acv: DEBUG               # Debug for ACV code
    org.springframework: INFO
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG
  
  pattern:
    console: "%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d %p %c{1.} [%t] %m%n"
  
  file:
    name: logs/application.log
    max-size: 10MB
    max-history: 10

# ============================================================================
# Server Configuration
# ============================================================================

server:
  port: 8080
  servlet:
    context-path: /api
  error:
    include-message: always
    include-binding-errors: always
```

### 2.2 Production Configuration Example

**File:** `acv-validation-services/acv-validation-services-prod.yml`

```yaml
spring:
  application:
    name: account-creation-validation-services
  
  profiles:
    active: prod,discovery
  
  # Database Configuration - Production PostgreSQL
  datasource:
    url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
    username: ${DB_USER}               # From Key Vault
    password: ${DB_PASSWORD}           # From Key Vault
    driverClassName: org.postgresql.Driver
    hikari:
      connection-timeout: 30000        # 30 seconds
      minimum-idle: 20                 # Higher for prod
      maximum-pool-size: 100           # Larger pool for prod
      idle-timeout: 600000             # 10 minutes
      max-lifetime: 1800000            # 30 minutes
      auto-commit: true
      leak-detection-threshold: 60000  # 60 seconds
  
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: validate               # Don't auto-update in prod
    show-sql: false                    # Disable in prod
  
  cloud:
    config:
      server:
        git:
          uri: https://github.com/FedEx/eai-3540813-config-repo
          default-label: main

acv:
  validation:
    fuzzyMatchThreshold: 0.90          # Higher threshold for production
    cacheEnabled: true
    cacheTtlMinutes: 120               # Longer TTL in prod
  
  api:
    connector:
      url: https://api-connector-prod.company.com:8082
      timeout: 60                      # Longer timeout for prod
      retryAttempts: 5                 # More retries for reliability
      retryDelayMs: 5000              # 5 second backoff

management:
  security:
    enabled: true                      # Enable security in prod
  
  endpoint:
    health:
      show-details: when-authorized   # Only show to authorized users
    shutdown:
      enabled: false                   # Disable shutdown in prod
  
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus  # Only necessary endpoints
  
  metrics:
    export:
      prometheus:
        enabled: true

logging:
  level:
    root: WARN                         # Warn level in production
    com.fedex.acv: INFO
  
  pattern:
    console: "%d{ISO8601} %p %t [%c] - %m%n"
  
  file:
    name: /var/log/acv-validation/app.log
    max-size: 100MB                    # Larger files in prod
    max-history: 30                    # Keep 30 days of logs

server:
  port: 8080
  shutdown: graceful                   # Graceful shutdown in prod
  shutdown-wait-time: 30s             # Wait 30 seconds for graceful shutdown
```

### 2.3 API Connector Service Configuration

**File:** `api-connector-service/api-connector-service-dev.yml`

```yaml
spring:
  application:
    name: api-connector-service
  
  datasource:
    url: jdbc:h2:mem:connectordb
    driverClassName: org.h2.Driver
    username: sa
    password: password
  
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update

acv:
  connector:
    providers:
      # Signzy OCR Provider
      signzy:
        endpoint: https://api.signzy.com/v1/process
        apiKey: ${SIGNZY_API_KEY}
        timeout: 60
        maxRetries: 3
      
      # Credit Bureau Provider
      creditbureau:
        endpoint: https://api.creditbureau.com/v1/report
        apiKey: ${CREDITBUREAU_API_KEY}
        timeout: 45
        maxRetries: 2
    
    # Polling configuration for async operations
    polling:
      maxWaitMinutes: 10
      checkIntervalSeconds: 5
      timeoutSeconds: 30
    
    # Retry configuration with exponential backoff
    retry:
      maxAttempts: 3
      initialDelayMs: 1000
      maxDelayMs: 30000
      multiplier: 2

management:
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true

logging:
  level:
    root: INFO
    com.fedex.acv: DEBUG
    org.springframework.web: DEBUG
```

---

## 3. YAML Structure & Conventions

### 3.1 Indentation Rules

```yaml
# YAML uses 2-space indentation (MANDATORY)
spring:
  application:                        # 2 spaces
    name: service-name                # 4 spaces
  datasource:                         # 2 spaces
    url: jdbc:mysql://localhost       # 4 spaces
    hikari:                           # 4 spaces
      maximum-pool-size: 20           # 6 spaces
```

### 3.2 Property Naming Convention

```yaml
# Use kebab-case (lowercase-with-dashes) for property names
spring:
  datasource:
    connection-timeout: 20000     # NOT connectionTimeout
    maximum-pool-size: 20         # NOT maximumPoolSize

# Enum examples
spring:
  jpa:
    hibernate:
      ddl-auto: update            # NOT ddlAuto (allowed in some cases)
```

### 3.3 Comments & Documentation

```yaml
# Section headers for organization
# ============================================================================
# Database Configuration
# ============================================================================

spring:
  datasource:
    # Inline comments for important settings
    url: jdbc:h2:mem:testdb            # In-memory H2 for development
    hikari:
      maximum-pool-size: 20            # Max concurrent connections
      connection-timeout: 20000        # 20 seconds in milliseconds
```

---

## 4. Common Configuration Properties

### 4.1 Spring Framework Properties

| Property | Description | Dev | Test | Prod |
|----------|-------------|-----|------|------|
| **spring.datasource.url** | Database JDBC URL | jdbc:h2:mem:db | jdbc:postgresql://... | jdbc:postgresql://prod... |
| **spring.jpa.hibernate.ddl-auto** | Schema generation | update | validate | validate |
| **spring.jpa.show-sql** | Log SQL queries | true | false | false |
| **logging.level.root** | Root log level | INFO | INFO | WARN |
| **server.port** | Server port | 8080 | 8080 | 8080 |

### 4.2 Management (Actuator) Properties

| Property | Purpose | Value |
|----------|---------|-------|
| **management.endpoints.web.exposure.include** | Expose endpoints | health,metrics,prometheus |
| **management.endpoint.health.show-details** | Health detail level | always (dev), when-authorized (prod) |
| **management.metrics.export.prometheus.enabled** | Enable metrics | true |

### 4.3 ACV Custom Properties

| Property | Service | Purpose | Dev | Prod |
|----------|---------|---------|-----|------|
| **acv.api.connector.url** | Validation | API endpoint | http://localhost:7008 | https://connector-prod... |
| **acv.validation.fuzzyMatchThreshold** | Validation | Match tolerance | 0.85 | 0.90 |
| **acv.validation.cacheTtlMinutes** | Validation | Cache duration | 60 | 120 |
| **acv.connector.providers.signzy.timeout** | Connector | Provider timeout | 30 | 60 |

---

## 5. Environment Variables in Configuration

### 5.1 Variable Placeholder Syntax

```yaml
# Use ${VAR_NAME} for environment variable substitution
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  
  # Default values with : syntax
  jpa:
    hibernate:
      ddl-auto: ${DDL_AUTO:validate}   # Use DDL_AUTO env var, default to validate
```

### 5.2 Key Vault Integration Pattern

```yaml
# Secrets retrieved from Azure Key Vault at runtime
acv:
  api:
    connector:
      apiKey: ${SIGNZY_API_KEY}       # From Key Vault
      secretKey: ${SIGNZY_SECRET}     # From Key Vault
```

---

## 6. Configuration Validation

### 6.1 YAML Syntax Validation

```bash
# Validate YAML syntax (yamllint)
yamllint acv-validation-services/*.yml

# Expected: No errors for valid files
# Example error:
# acv-validation-services-dev.yml:5:1: error: wrong indentation (expected 2 but found 4)
```

### 6.2 Spring Configuration Validation

```bash
# Validate at startup (Spring auto-validates @ConfigurationProperties)
mvn spring-boot:run

# Validation happens in bootstrap phase:
# 1. YAML parsed and validated
# 2. Properties bound to @ConfigurationProperties classes
# 3. @Validated annotations trigger validation
# 4. Service starts if all valid
```

---

## 7. Configuration Examples by Service

### 7.1 Database Service Configuration

```yaml
# database-service-prod.yml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:5432/acv_prod
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 100
      minimum-idle: 20

acv:
  database:
    # Connection pooling
    pool:
      size: 100
      timeout: 30000
    
    # Migration
    migrations:
      enabled: true
      location: classpath:db/migration
    
    # Query optimization
    caching:
      enabled: true
      ttlMinutes: 60
```

### 7.2 Config Server Configuration

```yaml
# config-server-prod.yml
spring:
  application:
    name: config-server
  
  cloud:
    config:
      server:
        git:
          uri: https://github.com/FedEx/eai-3540813-config-repo
          default-label: main
          force-pull: true
          search-paths: '{service}' # Search by directory

security:
  user:
    name: configuser
    password: ${CONFIG_SERVER_PASSWORD}  # From Key Vault

server:
  port: 8888
  ssl:
    enabled: true
    key-store: ${SSL_KEYSTORE}
    key-store-password: ${SSL_KEYSTORE_PASSWORD}
```

---

## 8. Configuration Update Procedures

### 8.1 Update Development Configuration

```bash
# 1. Clone repository
git clone https://github.com/FedEx/eai-3540813-config-repo.git
cd eai-3540813-config-repo

# 2. Edit configuration
vim acv-validation-services/acv-validation-services-dev.yml

# 3. Validate YAML
yamllint acv-validation-services/acv-validation-services-dev.yml

# 4. Commit with descriptive message
git add acv-validation-services/acv-validation-services-dev.yml
git commit -m "chore: Update API connector URL for dev environment"

# 5. Push to repository
git push origin main

# 6. Services auto-refresh within 60 seconds
```

### 8.2 Update Production Configuration

```bash
# 1-4. Same as dev

# 5. Push with tag for tracking
git push origin main
git tag config-prod-v$(date +%Y%m%d-%H%M%S)
git push origin --tags

# 6. Manual refresh (no auto-refresh for prod)
kubectl rollout restart deployment/validation-services -n production

# 7. Verify configuration applied
curl http://validation-service:8080/actuator/configprops
```

---

## 9. File Editing Guidelines

### Do's ✅

- Use 2-space indentation exclusively
- Add comments for non-obvious properties
- Use kebab-case for property names
- Use STRONG> environment variables for secrets
- Validate YAML before commit
- Use meaningful commit messages
- Document configuration changes in PR description

### Don'ts ❌

- Mix tab and space indentation
- Use 4-space indentation
- Hardcode passwords or API keys
- Use camelCase for property names (usually)
- Commit without YAML validation
- Make unrelated changes in single commit
- Update production config without PR review

---

## 10. Common Configuration Patterns

### Pattern 1: Database Connection Pooling

```yaml
spring:
  datasource:
    hikari:
      connection-timeout: 30000      # Wait 30s for connection
      maximum-pool-size: 100         # Up to 100 connections
      minimum-idle: 10               # Keep 10 idle ready
      idle-timeout: 600000           # Recycle after 10 min idle
      max-lifetime: 1800000          # Force close after 30 min
      auto-commit: true              # Commit auto
```

### Pattern 2: Retry with Exponential Backoff

```yaml
acv:
  api:
    retry:
      maxAttempts: 5
      initialDelayMs: 1000           # 1 second
      maxDelayMs: 32000              # 32 seconds max
      multiplier: 2                  # Double each time
      # Results in: 1s, 2s, 4s, 8s, 16s, 32s
```

### Pattern 3: Caching Strategy

```yaml
acv:
  validation:
    cache:
      enabled: true
      ttlMinutes: 60                 # Expire after 60 min
      maxSize: 10000                 # Max 10k cached items
      evictionPolicy: LRU            # Least Recently Used
```

---

## Cross-References

- [HLD.md](HLD.md) — Architecture and design patterns
- [services.md](services.md) — Configuration API reference
- [code-mapping.md](code-mapping.md) — File organization
- [glossary.md](glossary.md) — Terminology
- [onboarding.md](onboarding.md) — Setup guide

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** Developers, DevOps Engineers, Platform Team
