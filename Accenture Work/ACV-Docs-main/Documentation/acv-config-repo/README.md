# ACV Configuration Repository - Overview & Quick Start

**Purpose:** Centralized configuration management for all ACV services via Spring Cloud Config.

**Version:** 1.0.0  
**Last Updated:** April 2, 2026

---

## 1. Project Overview

### What is the Config Repository?

The **ACV Configuration Repository** (`eai-3540813-config-repo`) is a centralized Git repository serving application configurations to all ACV microservices via the Spring Cloud Config Server.

### Business Context

ACV platform consists of 8+ deployed microservices across 3 environments (dev, test, prod). This repository provides:

- **Centralized Configuration Management** — Single source of truth for all service configs
- **Environment-Specific Overrides** — Different configs per environment without code changes
- **Dynamic Property Reload** — Services pick up config changes without restart
- **Version Control** — All configuration changes tracked and auditable
- **Credential Management** — Sensitive values encrypted and stored securely

### Key Benefits

✅ **No Config in Code** — Separation of configuration from application code  
✅ **Environment Parity** — Consistent configuration approach across all environments  
✅ **Quick Rollback** — Git history enables instant rollback of config changes  
✅ **Audit Trail** — Every config change tracked with commit history  
✅ **Dynamic Updates** — Services refresh config without downtime  
✅ **Secret Rotation** — Credentials updated centrally without redeployment  

---

## 2. Repository Structure

### Directory Organization

```
eai-3540813-config-repo/
├── acv-validation-services/
│   ├── acv-validation-services-dev.yml        # Dev environment config
│   ├── acv-validation-services-test.yml       # Test environment config
│   ├── acv-validation-services-prod.yml       # Production environment config
│   └── acv-validation-services-local.yml      # Local development config
│
├── api-connector-service/
│   ├── api-connector-service-dev.yml
│   ├── api-connector-service-test.yml
│   └── api-connector-service-prod.yml
│
├── database-service/
│   ├── database-service-dev.yml
│   ├── database-service-test.yml
│   └── database-service-prod.yml
│
├── config-server/
│   ├── config-server-dev.yml
│   ├── config-server-test.yml
│   └── config-server-prod.yml
│
└── README.md                                  # This file
```

### File Naming Convention

```
{service-name}-{environment}.yml

where:
  {service-name} = Spring Boot application.name (e.g., api-connector-service)
  {environment} = Profile (local, dev, test, prod)

Examples:
  api-connector-service-dev.yml
  acv-validation-services-prod.yml
  config-server-local.yml
```

---

## 3. Quick Start

### 3.1 Accessing Configuration

**Via Config Server:**
```bash
# Query configuration from config server
curl http://config-server:8888/api-connector-service/dev

# Expected response (JSON):
# {
#   "name": "api-connector-service",
#   "profiles": ["dev"],
#   "label": "main",
#   "version": "abc1234",
#   "propertySources": [...]
# }
```

**In Application:**
```java
@ConfigurationProperties(prefix = "acv.api.connector")
public class ApiConnectorProperties {
    @Value("${acv.api.connector.url}")
    private String url;
}
```

### 3.2 Update Configuration

```bash
# 1. Clone repository
git clone https://github.com/FedEx/eai-3540813-config-repo.git
cd eai-3540813-config-repo

# 2. Edit configuration file
# Example: Update dev database URL
vim acv-validation-services/acv-validation-services-dev.yml

# 3. Commit and push
git add .
git commit -m "chore: Update database URL for dev environment"
git push origin main

# 4. Services auto-refresh configuration (within 60 seconds)
# Or manually trigger refresh:
curl -X POST http://service:8080/actuator/refresh
```

### 3.3 Service Configuration Hierarchy

```
Configuration Resolution Order (highest to lowest priority):

1. Environment Variable
   └─ e.g., ${SPRING_DATASOURCE_URL}

2. Command-Line Parameter
   └─ e.g., --spring.datasource.url=...

3. application-{profile}.yml in Git Config Repo
   └─ e.g., api-connector-service-dev.yml

4. application.properties bundled in JAR
   └─ Default values shipped with code

5. Spring Boot defaults
   └─ Framework defaults
```

---

## 4. Service Configuration Files

### 4.1 Validation Services Configuration

**File:** `acv-validation-services/acv-validation-services-dev.yml`

**Key Sections:**

| Section | Purpose | Example |
|---------|---------|---------|
| `spring.application.name` | Service identity in Discovery | account-creation-validation-services |
| `spring.datasource` | Database connection | H2 for dev, PostgreSQL for prod |
| `spring.jpa` | Hibernate ORM configuration | DDL auto-update, dialect |
| `acv.api.connector` | API Connector endpoint | Base URL for making API calls |
| `management` | Actuator/metrics exposure | Health checks, Prometheus |

### 4.2 Configuration Properties by Environment

| Property | Dev | Test | Prod |
|----------|-----|------|------|
| **Database** | H2 (in-memory) | PostgreSQL (test DB) | PostgreSQL (prod DB) |
| **Log Level** | DEBUG | INFO | WARN |
| **API Connector URL** | http://localhost:7008 | https://connector-test.company.com | https://connector-prod.company.com |
| **Metrics Export** | Enabled (local) | Enabled (Prometheus) | Enabled (Prometheus) |
| **Security** | Disabled | Enabled (OAuth2) | Enabled (OAuth2) |

---

## 5. Key Configuration Sections

### 5.1 Spring Configuration

```yaml
spring:
  application:
    name: service-name                    # Service identifier
  datasource:                             # Database connection
    url: jdbc:h2:mem:testdb
    username: sa
    password: password
  jpa:                                    # ORM configuration
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update
  cloud:                                  # Spring Cloud Config
    config:
      server:
        git:
          uri: https://github.com/FedEx/eai-3540813-config-repo
```

### 5.2 Application-Specific Configuration

```yaml
acv:
  api:
    connector:
      url: http://api-connector:8082   # External service endpoint
      timeout: 30                       # Request timeout (seconds)
      retryAttempts: 3                  # Retry count

  validation:
    fuzzyMatchThreshold: 0.85            # Fuzzy matching tolerance
    cacheEnabled: true                   # Result caching
    cacheTtlMinutes: 60                  # Cache TTL
```

### 5.3 Management & Monitoring

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true
```

---

## 6. Environment Targets

| Environment | Purpose | Database | Config Profile |
|-------------|---------|----------|---|
| **local** | Developer machine | H2 (in-memory) | local |
| **dev** | Development cluster | H2 or test DB | dev |
| **test** | QA testing | PostgreSQL (test) | test |
| **prod** | Production (customer traffic) | PostgreSQL (prod) | prod |

---

## 7. File Locations Quick Reference

| What | File Location |
|-----|---|
| **Validation Services Config (Dev)** | `acv-validation-services/acv-validation-services-dev.yml` |
| **API Connector Config (All)** | `api-connector-service/api-connector-service-*.yml` |
| **Database Service Config (All)** | `database-service/database-service-*.yml` |
| **Spring Cloud Config Server** | `config-server/config-server-*.yml` |

---

## 8. Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Repository** | Git | Version control |
| **Config Server** | Spring Cloud Config | Serving configurations |
| **Data Format** | YAML | Configuration format |
| **Authentication** | OAuth2/Basic Auth | Access control |
| **Transport** | HTTPS | Secure transmission |
| **Refresh Strategy** | Spring Cloud Bus, Manual | Configuration propagation |

---

## 9. Related Services

| Service | Connection | Purpose |
|---------|-----------|---------|
| **config-server** | Reads this repo | Serves configs to services |
| **acv-validation-services** | Consumes config | Uses validation-services-*.yml |
| **api-connector-service** | Consumes config | Uses api-connector-service-*.yml |
| **database-service** | Consumes config | Uses database-service-*.yml |

---

## 10. Security Considerations

| Aspect | Implementation |
|--------|---|
| **Credential Storage** | Encrypted in Key Vault, placeholders in repo |
| **Access Control** | GitHub RBAC, branch protection |
| **Audit Logging** | Git commit history |
| **Encryption in Transit** | HTTPS-only |
| **Version Control** | Git tags for releases |

---

## 11. Common Tasks

### Update Dev Configuration

```bash
git clone https://github.com/FedEx/eai-3540813-config-repo.git
cd eai-3540813-config-repo

# Edit dev config
vim acv-validation-services/acv-validation-services-dev.yml

# Commit and push
git add .
git commit -m "chore: Update API connector URL for dev"
git push origin main
```

### Add New Service Configuration

```bash
# Create new service config file
mkdir -p my-new-service
touch my-new-service/my-new-service-dev.yml
touch my-new-service/my-new-service-test.yml
touch my-new-service/my-new-service-prod.yml

# Add content (see template in HLD.md)
# Commit and push
git add my-new-service/
git commit -m "feat: Add configuration for my-new-service"
git push origin main
```

### Rotate Credentials

```bash
# 1. Update Key Vault with new credentials
# 2. Update config file placeholders (if needed)
# 3. Commit and push
# 4. Trigger service refresh (manual or automatic)

git add acv-validation-services/acv-validation-services-prod.yml
git commit -m "chore: Rotate database credentials - PROD"
git push origin main
```

---

## 12. Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **Service using stale config** | Refresh not triggered | POST /actuator/refresh or restart service |
| **Config not found** | File naming mismatch | Verify file matches `{service-name}-{profile}.yml` |
| **Invalid YAML** | Syntax error | Run `yamllint acv-validation-services/*.yml` |
| **Permission denied** | GitHub access issue | Verify SSH key or personal access token |

---

## 13. Reference Documentation

| Document | Purpose |
|----------|---------|
| [HLD.md](HLD.md) | Architecture and configuration patterns |
| [LLD.md](LLD.md) | Implementation details and YAML structure |
| [services.md](services.md) | Configuration API reference |
| [code-mapping.md](code-mapping.md) | File structure and organization |
| [glossary.md](glossary.md) | Terminology |
| [onboarding.md](onboarding.md) | Setup and first-time configuration |

---

## 14. Links & Resources

- [Repository](https://github.com/FedEx/eai-3540813-config-repo)
- [Spring Cloud Config Documentation](https://spring.io/projects/spring-cloud-config)
- [Config Server Service](../config-server)
- [ACV Validation Services](../acv-validation-services)
- [ACV API Connector Service](../api-connector-service)

---

**Next Steps:**
1. Read [HLD.md](HLD.md) for architecture details
2. Review [LLD.md](LLD.md) for configuration structure
3. Follow [onboarding.md](onboarding.md) to set up locally
4. Check [services.md](services.md) for API reference

---

**Version:** 1.0.0 | **Maintainer:** Platform Team  
**License:** FedEx Internal
