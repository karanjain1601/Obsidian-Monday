# ACV Configuration Repository - Code Mapping & Navigation

**Purpose:** Navigate configuration files, understand directory structure, and locate specific properties.

**Scope:** File organization, directory tree, property locations, quick reference guides.

---

## 1. Repository File Structure

### 1.1 Complete Directory Tree

```
eai-3540813-config-repo/
│
├── .git/                              # Git repository metadata
├── .gitignore                         # Ignore patterns (secrets, .swp, etc.)
├── README.md                          # Repository overview
│
├── acv-validation-services/
│   ├── acv-validation-services-local.yml      (Dev local - H2, localhost)
│   ├── acv-validation-services-dev.yml        (Dev environment - H2, dev URLs)
│   ├── acv-validation-services-test.yml       (Test environment - PostgreSQL)
│   └── acv-validation-services-prod.yml       (Production - PostgreSQL, optimized)
│
├── api-connector-service/
│   ├── api-connector-service-dev.yml          (Dev - mock providers)
│   ├── api-connector-service-test.yml         (Test - test provider endpoints)
│   └── api-connector-service-prod.yml         (Prod - real provider endpoints)
│
├── database-service/
│   ├── database-service-dev.yml               (Dev - H2 in-memory)
│   ├── database-service-test.yml              (Test - PostgreSQL test instance)
│   └── database-service-prod.yml              (Prod - PostgreSQL managed)
│
├── config-server/
│   ├── config-server-dev.yml                  (Dev - Git local)
│   ├── config-server-test.yml                 (Test - Git test)
│   └── config-server-prod.yml                 (Prod - Git prod with auth)
│
└── [future] scheduler-service/               # Will be added
```

### 1.2 File Size Reference

| File | Size | Properties | Config Items |
|------|------|-----------|--------------|
| acv-validation-services-local.yml | 0.8 KB | ~12 | Spring + ACV |
| acv-validation-services-dev.yml | 2.1 KB | ~28 | Spring + ACV + Management |
| acv-validation-services-test.yml | 2.3 KB | ~30 | Spring + ACV + Metrics |
| acv-validation-services-prod.yml | 2.5 KB | ~32 | Spring + ACV + Security |
| api-connector-service-dev.yml | 1.8 KB | ~22 | Providers + Polling |
| database-service-prod.yml | 1.9 KB | ~18 | DB + Migration |

---

## 2. Property Organization by Section

### 2.1 Spring Framework Properties (Common)

**Location:** All services, all configurations  
**Purpose:** Core Spring Boot and Spring Cloud framework settings

```
spring:
  ├── application.name              # Service identifier
  │   └── In: All files (e.g., "acv-validation-services")
  │
  ├── profiles.active               # Active profiles (dev/test/prod)
  │   └── In: All files
  │
  ├── datasource                    # Database connection
  │   ├── url                       # JDBC URL (H2 dev, PostgreSQL prod)
  │   ├── username                  # DB user
  │   ├── password                  # DB password (from Key Vault)
  │   └── hikari                    # Connection pool settings
  │
  └── jpa                           # Hibernate/JPA configuration
      ├── database-platform         # Dialect (H2, PostgreSQL)
      ├── hibernate.ddl-auto        # Schema generation (update/validate)
      └── show-sql                  # Log SQL queries (dev only)
```

**File Locations:**
- Local: `acv-validation-services/acv-validation-services-local.yml`
- Dev: `acv-validation-services/acv-validation-services-dev.yml`
- Test: `acv-validation-services/acv-validation-services-test.yml`
- Prod: `acv-validation-services/acv-validation-services-prod.yml`

### 2.2 Management/Actuator Properties

**Location:** All services (most comprehensive in dev/test)  
**Purpose:** Health checks, metrics, monitoring endpoints

```
management:
  ├── endpoint
  │   ├── health                    # /actuator/health endpoint
  │   ├── metrics                   # /actuator/metrics endpoint
  │   ├── prometheus                # /actuator/prometheus endpoint
  │   └── shutdown                  # /actuator/shutdown endpoint (disabled prod)
  │
  └── endpoints
      └── web.exposure.include      # Which endpoints exposed (dev: *, prod: select)
```

**File Locations by Exposure Level:**
| File | Health Details | Endpoints Exposed |
|------|----------------|-------------------|
| local.yml | Always | * (all) |
| dev.yml | Always | * (all) |
| test.yml | When authorized | health, metrics, prometheus |
| prod.yml | When authorized | health, metrics, prometheus |

### 2.3 Service-Specific Properties (ACV Namespace)

**Location:** Services folders  
**Naming Pattern:** `acv.{service}.{property}`

#### Validation Services: `acv.validation.*`

```
acv.validation (in: acv-validation-services/*.yml)
├── fuzzyMatchThreshold         # [0.80-0.95] String similarity
├── levenshteinDistance        # [1-3] Character distance
├── cacheEnabled               # [true/false] Cache fuzzy matches
├── cacheTtlMinutes           # [30-120] Cache duration
│
└── rules                      # Validation rules configuration
    ├── maxRuleSize           # [500-2000] Bytes per rule
    └── maxRulesPerService    # [100-500] Rules per service
```

**File Locations:**
- Dev: `acv-validation-services/acv-validation-services-dev.yml`
- Prod: `acv-validation-services/acv-validation-services-prod.yml`

#### API Connector Service: `acv.connector.*`

```
acv.connector (in: api-connector-service/*.yml)
├── providers
│   ├── signzy
│   │   ├── endpoint          # API URL to SIGNZY
│   │   ├── apiKey            # From Key Vault
│   │   ├── timeout           # [30-60] seconds
│   │   └── maxRetries        # [1-5] attempts
│   │
│   └── creditbureau
│       ├── endpoint          # API URL to Credit Bureau
│       ├── apiKey            # From Key Vault
│       ├── timeout           # [30-60] seconds
│       └── maxRetries        # [1-5] attempts
│
└── polling
    ├── maxWaitMinutes        # [5-15] max wait for async
    ├── checkIntervalSeconds  # [2-10] poll frequency
    └── timeoutSeconds        # [20-60] request timeout
```

**File Locations:**
- Dev: `api-connector-service/api-connector-service-dev.yml`
- Prod: `api-connector-service/api-connector-service-prod.yml`

#### Database Service: `acv.database.*`

```
acv.database (in: database-service/*.yml)
├── pool
│   ├── size                  # [20-100] connection pool
│   └── timeout               # [15000-60000] ms
│
├── migrations
│   ├── enabled               # [true] always enabled
│   └── location              # classpath:db/migration
│
└── caching
    ├── enabled               # [true]
    └── ttlMinutes           # [30-120]
```

**File Locations:**
- Dev: `database-service/database-service-dev.yml`
- Prod: `database-service/database-service-prod.yml`

---

## 3. Quick Reference: Find Property Location

### 3.1 Property Lookup Table

| Property | Service | Dev File | Test File | Prod File | Type |
|----------|---------|----------|-----------|-----------|------|
| `spring.datasource.url` | Validation | validation-dev.yml | validation-test.yml | validation-prod.yml | String (JDBC) |
| `spring.datasource.hikari.maximum-pool-size` | Validation | validation-dev.yml | validation-test.yml | validation-prod.yml | Integer |
| `acv.validation.fuzzyMatchThreshold` | Validation | validation-dev.yml | validation-dev.yml | validation-prod.yml | Double |
| `acv.api.connector.url` | Validation | validation-dev.yml | validation-test.yml | validation-prod.yml | String (URL) |
| `acv.connector.providers.signzy.endpoint` | Connector | connector-dev.yml | connector-test.yml | connector-prod.yml | String (URL) |
| `acv.connector.providers.signzy.apiKey` | Connector | connector-dev.yml | connector-test.yml | connector-prod.yml | String (secret) |
| `acv.connector.polling.maxWaitMinutes` | Connector | connector-dev.yml | connector-test.yml | connector-prod.yml | Integer |
| `acv.database.pool.size` | Database | database-dev.yml | database-test.yml | database-prod.yml | Integer |
| `management.endpoints.web.exposure.include` | All | * | (select) | (select) | String |

### 3.2 How to Find a Property

**Example: "Where is fuzzyMatchThreshold configured?"**

```bash
# 1. Identify service: Validation (acv.validation.*)
# 2. File name pattern: acv-validation-services-{environment}.yml
# 3. Standard locations:
#    - Development: acv-validation-services/acv-validation-services-dev.yml
#    - Production: acv-validation-services/acv-validation-services-prod.yml

# 4. Grep to verify
grep -r "fuzzyMatchThreshold" .
# Output: acv-validation-services/acv-validation-services-dev.yml:    fuzzyMatchThreshold: 0.85

# 5. Property path in YAML
# acv:
#   validation:
#     fuzzyMatchThreshold: 0.85
```

---

## 4. Configuration By Environment Profile

### 4.1 Local Development Profile (`-local`)

**Files:**
- `acv-validation-services/acv-validation-services-local.yml` (0.8 KB)

**Characteristics:**
- H2 in-memory database (no external DB needed)
- Localhost endpoints (127.0.0.1:port)
- All management endpoints exposed
- Debug logging enabled
- No authentication required
- Use case: Individual developer machine

**Properties:**
```yaml
spring.datasource.url: jdbc:h2:mem:testdb   # Not persisted
acv.api.connector.url: http://localhost:7008
logging.level.root: DEBUG                    # Verbose
management.endpoints.web.exposure.include: '*'
```

### 4.2 Development Profile (`-dev`)

**Files:**
- `acv-validation-services/acv-validation-services-dev.yml` (2.1 KB)
- `api-connector-service/api-connector-service-dev.yml` (1.8 KB)
- `database-service/database-service-dev.yml` (1.5 KB)

**Characteristics:**
- H2 in-memory database (shared in cluster)
- Development URLs (dev.company.com)
- All management endpoints exposed
- Info and Debug logging for ACV services
- Mock/test API providers (SIGNZY_TEST, CB_TEST keys)
- Use case: Integrated development environment

**Properties:**
```yaml
spring.datasource.url: jdbc:h2:mem:testdb   # Cluster-shared
acv.api.connector.url: https://dev-api-connector.company.com:8082
logging.level.com.fedex.acv: DEBUG          # ACV debug only
acv.connector.providers.signzy.apiKey: ${SIGNZY_TEST_KEY}
```

### 4.3 Test Profile (`-test`)

**Files:**
- `acv-validation-services/acv-validation-services-test.yml` (2.3 KB)
- `api-connector-service/api-connector-service-test.yml` (2.0 KB)
- `database-service/database-service-test.yml` (1.7 KB)

**Characteristics:**
- PostgreSQL test database (persistent)
- Test environment URLs (test.company.com)
- Selected management endpoints (auth required)
- Info logging (errors + important info only)
- Test API keys (providers in test mode)
- Use case: Pre-production testing

**Properties:**
```yaml
spring.datasource.url: jdbc:postgresql://test-db-host:5432/acv_test
spring.jpa.hibernate.ddl-auto: validate     # No auto-updates
acv.api.connector.url: https://test-api-connector.company.com:8082
logging.level.root: INFO
management.endpoint.health.show-details: when-authorized
acv.connector.providers.signzy.apiKey: ${SIGNZY_STAGE_KEY}
```

### 4.4 Production Profile (`-prod`)

**Files:**
- `acv-validation-services/acv-validation-services-prod.yml` (2.5 KB)
- `api-connector-service/api-connector-service-prod.yml` (2.2 KB)
- `database-service/database-service-prod.yml` (1.9 KB)

**Characteristics:**
- PostgreSQL production database (replicated, backed up)
- Production URLs (company.com)
- Minimal management endpoints (health, metrics only)
- Warn logging (errors + warnings only)
- Production API keys (real provider endpoints)
- Enhanced security, monitoring, caching
- Use case: Customer-facing production environment

**Properties:**
```yaml
spring.datasource.url: jdbc:postgresql://prod-db-host:5432/acv_prod
spring.jpa.hibernate.ddl-auto: validate     # Strict
acv.api.connector.url: https://api-connector.company.com:8082
logging.level.root: WARN                    # Minimal
management.endpoint.health.show-details: when-authorized
acv.connector.providers.signzy.apiKey: ${SIGNZY_PROD_KEY}
management.endpoints.web.exposure.include: health,metrics,prometheus
```

---

## 5. Service-to-File Mapping

### 5.1 Validation Services Configuration Files

| Service | Purpose | Dev File | Prod File |
|---------|---------|----------|-----------|
| account-creation-validation-services | Core validation engine | acv-validation-services-dev.yml | acv-validation-services-prod.yml |

**Contains:** Fuzzy matching config, validation rules, API connector URLs, database settings

### 5.2 API Connector Service Configuration Files

| Service | Purpose | Dev File | Prod File |
|---------|---------|----------|-----------|
| api-connector-service | Multi-provider integration (SIGNZY, CreditBureau) | api-connector-service-dev.yml | api-connector-service-prod.yml |

**Contains:** Provider endpoints, API keys, polling strategy, retry configuration

### 5.3 Database Service Configuration Files

| Service | Purpose | Dev File | Prod File |
|---------|---------|----------|-----------|
| database-service | Database operations & migrations | database-service-dev.yml | database-service-prod.yml |

**Contains:** Connection pooling, migration settings, caching policy

### 5.4 Config Server Configuration Files

| Service | Purpose | Dev File | Prod File |
|---------|---------|----------|-----------|
| config-server | Central configuration management | config-server-dev.yml | config-server-prod.yml |

**Contains:** Git repository settings, authentication, cache configuration

---

## 6. Property Override Precedence

**Order (Highest Priority First):**

1. **Java System Properties** (`-Dkey=value`)
   ```bash
   java -Dspring.datasource.url=jdbc:... -jar app.jar
   ```

2. **Environment Variables** (`export KEY=value`)
   ```bash
   export SPRING_DATASOURCE_URL=jdbc:...
   ```

3. **Spring Cloud Config** (from config-repo Git)
   ```yaml
   # acv-validation-services-dev.yml
   spring:
     datasource:
       url: jdbc:h2:mem:db
   ```

4. **application.yml** (in app classpath)
   ```yaml
   spring:
     datasource:
       url: jdbc:default  # Only if not in config-server
   ```

5. **application-{profile}.yml** (environment-specific in app)

**Example Resolution:**
```
Service starts with profile: dev
1. Reads: bootstrap.yml (Config Server URI)
2. Fetches: acv-validation-services-dev.yml from Git
3. Values from Git take precedence over app properties
4. If env var SPRING_DATASOURCE_URL set, it overrides Git value
5. If Java property -Dspring.datasource.url set, it overrides everything
```

---

## 7. Adding New Services to Config Repository

### 7.1 Steps to Add New Service

**Example: Adding "scheduler-service"**

```bash
# 1. Create service directory
mkdir scheduler-service

# 2. Create environment-specific files
touch scheduler-service/scheduler-service-dev.yml
touch scheduler-service/scheduler-service-test.yml
touch scheduler-service/scheduler-service-prod.yml

# 3. Edit files with service configuration
cat > scheduler-service/scheduler-service-dev.yml << 'EOF'
spring:
  application:
    name: scheduler-service
  datasource:
    url: jdbc:h2:mem:schedulerdb
    
acv:
  scheduler:
    cronExpression: "*/5 * * * * *"  # Every 5 seconds in dev
    enabled: true
    
logging:
  level:
    root: INFO
EOF

# 4. Add to Git
git add scheduler-service/

# 5. Commit with message
git commit -m "feat: Add scheduler-service configuration"

# 6. Push to repository
git push origin main
```

### 7.2 File Template for New Service

**File: `new-service/new-service-{environment}.yml`**

```yaml
# ============================================================================
# {Service Name} - {Environment} Configuration
# ============================================================================

spring:
  application:
    name: {service-name}              # Must match Git folder
  
  profiles:
    active: {environment}             # dev, test, or prod
  
  datasource:
    url: jdbc:...
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  
  jpa:
    hibernate:
      ddl-auto: update                # or validate for prod

acv:
  {service}:                          # Service-specific namespace
    property: value

management:
  endpoint:
    health:
      show-details: always            # Adjust per environment
  
  endpoints:
    web:
      exposure:
        include: '*'                  # Adjust per environment

logging:
  level:
    root: INFO                        # DEBUG/INFO/WARN per env
    com.fedex.acv: DEBUG
```

---

## Cross-References

- [README.md](README.md) — Repository overview
- [HLD.md](HLD.md) — Architecture and patterns
- [LLD.md](LLD.md) — YAML structure details
- [services.md](services.md) — Configuration API reference
- [glossary.md](glossary.md) — Terminology
- [onboarding.md](onboarding.md) — Setup and workflows

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** Developers, DevOps Engineers, System Administrators
