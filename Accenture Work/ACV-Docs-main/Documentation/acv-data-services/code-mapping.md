# ACV Data Services - Code Navigation & File Mapping

**Purpose:** Provide rapid navigation and reference for source code and configuration files.

**Scope:** File inventory, class locations, configuration structure, quick lookup.

---

## 1. Source Code File Mapping

### 1.1 Java Classes - Complete Inventory

| Class Name | File Path | Purpose | Layer |
|-----------|-----------|---------|-------|
| `AcvDataAccessServiceApplication` | `src/main/java/com/fedex/acv/data/AcvDataAccessServiceApplication.java` | Spring Boot entry point | Main |
| `DataController` | `src/main/java/com/fedex/acv/data/controller/DataController.java` | v1 REST API endpoints | Controller |
| `DataControllerV2` | `src/main/java/com/fedex/acv/data/controller/DataControllerV2.java` | v2 REST API endpoints | Controller |
| `DataService` | `src/main/java/com/fedex/acv/data/services/DataService.java` | v1 Service interface | Service |
| `DataServiceV2` | `src/main/java/com/fedex/acv/data/services/DataServiceV2.java` | v2 Service interface | Service |
| `DataServiceImpl` | `src/main/java/com/fedex/acv/data/services/impl/DataServiceImpl.java` | v1 Service implementation | Service |
| `DataServiceV2Impl` | `src/main/java/com/fedex/acv/data/services/impl/DataServiceV2Impl.java` | v2 Service implementation | Service |
| `AcvCrudConfigInfo` | `src/main/java/com/fedex/acv/data/entity/AcvCrudConfigInfo.java` | JPA entity for config storage | Entity |
| `AcvCrudConfigInfoId` | `src/main/java/com/fedex/acv/data/entity/AcvCrudConfigInfoId.java` | Composite primary key | Entity |
| `AcvCrudConfigInfoRepo` | `src/main/java/com/fedex/acv/data/repository/AcvCrudConfigInfoRepo.java` | Spring Data JPA repository | Repository |

**Total Java Code:** Multiple files, ~40-50 main classes

### 1.2 Quick Class Reference

| Looking For | File | Key Methods |
|-------------|------|------------|
| REST endpoints | DataController.java | genericResponse(), genericResponseForCtry() |
| Business logic | DataServiceImpl.java | getDetails(), saveDetails(), getCrudConfig() |
| Entity (config storage) | AcvCrudConfigInfo.java | Stores SQL configurations |
| Data access | AcvCrudConfigInfoRepo.java | JPA repository methods |
| Authentication setup | AcvDataAccessServiceApplication.java | @EnableWebSecurity, OAuth2 config |
| Caching setup | AcvDataAccessServiceApplication.java | @EnableCaching, Redis config |

---

## 2. Configuration File Mapping

### 2.1 Properties Files

| File | Location | Environment | Purpose |
|------|----------|-------------|---------|
| `application-local.yml` | `src/main/resources/` | Development (Local) | PostgreSQL, Redis local, Okta disabled |
| `logback-spring.xml` | `src/main/resources/` | All | Logging configuration |
| `banner.txt` | `src/main/resources/` | All | Spring Boot startup banner |

### 2.2 Helm Configuration Files

| File | Location | Environment | Purpose |
|------|----------|-------------|---------|
| `nonprod-dev.yaml` | `helm-releases/` | Development | Dev deployment settings |
| `nonprod-test.yaml` | `helm-releases/` | Test/QA | Test deployment settings |
| `prod.yaml` | `helm-releases/` | Production | Prod deployment (4 replicas, 8GB memory) |

### 2.3 Configuration Property Lookup

**To find specific configuration:**

```
Spring Application Main Properties:
├─ spring.application.name = eai-3540813-data-services
├─ server.port = 8080
└─ management.server.port = 8081

Database Connection Properties:
├─ spring.datasource.url = jdbc:postgresql://...
├─ spring.datasource.username = ${POSTGRES_USER}
├─ spring.datasource.password = ${POSTGRES_DB_PASSWORD}
└─ spring.datasource.driver-class-name = org.postgresql.Driver

Cache Properties:
├─ spring.cache.type = redis
├─ spring.redis.host = ${REDIS_HOST}
├─ spring.redis.port = ${REDIS_PORT}
└─ spring.redis.password = ${REDIS_PASSWORD}

Security Properties:
├─ spring.security.oauth2.resourceserver.jwt.enabled = true
└─ spring.security.oauth2.resourceserver.jwt.issuer-uri = https://okta.fedex.com

Actuator Properties:
├─ management.endpoints.web.exposure.include = health,metrics,prometheus
└─ management.server.port = 8081
```

### 2.4 Finding Configuration by Use Case

**"I need to change database connection"**
→ Edit: `application-local.yml` or remote config server
→ Property: `spring.datasource.url`
→ Format: `jdbc:postgresql://host:port/dbname`

**"I need to configure Redis cache"**
→ Edit: `application-local.yml`
→ Properties: `spring.redis.host`, `spring.redis.port`
→ TTL: `spring.cache.redis.time-to-live`

**"I need to enable/disable caching"**
→ Edit: `application-local.yml`
→ Property: `spring.cache.type` (redis, jcache, caffeine, or none)

**"I need to change logging level"**
→ Edit: `logback-spring.xml`
→ Or application properties: `logging.level.com.fedex.acv.data`

---

## 3. Package Structure Overview

### 3.1 Package Hierarchy

```
com.fedex.acv.data
├── AcvDataAccessServiceApplication (entry point)
├── controller/
│   ├── DataController (v1 API)
│   ├── DataControllerV2 (v2 API)
│   └── ... (other controllers)
├── services/
│   ├── DataService (v1 interface)
│   ├── DataServiceV2 (v2 interface)
│   └── impl/
│       ├── DataServiceImpl (v1 impl)
│       └── DataServiceV2Impl (v2 impl)
├── repository/
│   └── AcvCrudConfigInfoRepo (JPA repo)
├── entity/
│   ├── AcvCrudConfigInfo (JPA entity)
│   └── AcvCrudConfigInfoId (composite key)
├── dao/ (data access objects)
├── converters/ (entity converters)
├── enrichers/ (data enrichers)
├── exception/ (custom exceptions)
├── constant/ (constants/enums)
└── utils/ (utilities)
```

### 3.2 Dependency Flow

```
HTTP Request
    ↓
DataController (v1/v2)
    ↓
DataService (interface)
    ↓
DataServiceImpl (implementation)
    ├→ Caching Layer (@Cacheable)
    ├→ AcvCrudConfigInfoRepo (JPA)
    │   ├→ AcvCrudConfigInfo (entity)
    │   └→ PostgreSQL Database
    ├→ Redis Cache (if not cached)
    └→ Enrichers/Converters
    ↓
JSON Response
```

---

## 4. Startup Flow & Initialization Order

```
1. AcvDataAccessServiceApplication.main()
   └─ SpringApplication.run()

2. Load Configuration
   └─ application-local.yml / remote config

3. Create Spring Context
   ├─ Auto-discover @Configuration classes
   ├─ Create DataSource bean (PostgreSQL)
   ├─ Create CacheManager bean (Redis)
   ├─ Create SecurityFilterChain (Okta OAuth2)
   └─ Initialize @ComponentScan packages

4. Initialize Beans
   ├─ DataController (@RestController)
   ├─ DataServiceImpl (@Service)
   ├─ DataServiceV2Impl (@Service)
   ├─ AcvCrudConfigInfoRepo (@Repository)
   └─ Other components

5. Start Tomcat Server
   ├─ Port 8080 (app)
   ├─ Port 8081 (management)
   └─ Ready for requests

6. Application Ready
   └─ Return Spring context
```

---

## 5. File Quick Search Guide

### "I need to find ..."

| Looking For | File Location | Line Hint |
|-------------|---------------|-----------|
| **REST v1 endpoints** | DataController.java | @PostMapping("/api/v1/{entity}") |
| **REST v2 endpoints** | DataControllerV2.java | @PostMapping("/api/v2/{entity}") |
| **GET operation logic** | DataServiceImpl.java | @Cacheable method getDetails() |
| **ADD operation logic** | DataServiceImpl.java | Method saveDetails() |
| **Query configuration** | AcvCrudConfigInfo.java | Entity mapping to ACV_CRUD_CONFIG_INFO |
| **Cache configuration** | AcvDataAccessServiceApplication.java | @EnableCaching annotation |
| **Security configuration** | AcvDataAccessServiceApplication.java | @EnableWebSecurity or in separate config |
| **Local database config** | application-local.yml | spring.datasource.url |
| **Redis config** | application-local.yml | spring.redis.* properties |
| **Okta OAuth2 config** | Remote config server or application-prod.yml | spring.security.oauth2.resourceserver.jwt |
| **Deployment config** | helm-releases/prod.yaml | replicaCount, resources.limits, annotations |

---

## 6. Code Walkthrough Path (New Developer)

**Recommended learning sequence:**

1. **[AcvDataAccessServiceApplication.java](src/main/java/com/fedex/acv/data/AcvDataAccessServiceApplication.java)**
   - Understand entry point
   - Key annotations (@EnableCaching, @EnableRedisRepositories)
   - Component scanning

2. **[application-local.yml](src/main/resources/application-local.yml)**
   - Understand configuration
   - Database, cache, security setup
   - How properties are bound to beans

3. **[DataController.java](src/main/java/com/fedex/acv/data/controller/DataController.java)**
   - Understand REST endpoints
   - How requests are routed
   - JSON parsing and response formatting

4. **[DataServiceImpl.java](src/main/java/com/fedex/acv/data/services/impl/DataServiceImpl.java)**
   - Understand business logic
   - Caching strategy (@Cacheable)
   - Database query execution

5. **[AcvCrudConfigInfo.java](src/main/java/com/fedex/acv/data/entity/AcvCrudConfigInfo.java)**
   - Understand configuration storage
   - How SQL queries are stored
   - Composite key structure

6. **[DataServiceV2Impl.java](src/main/java/com/fedex/acv/data/services/impl/DataServiceV2Impl.java)**
   - Understand v2 enhancements
   - Field selection, sorting, pagination
   - Differences from v1

---

## 7. Test File Mapping

### 7.1 Unit Tests

| Test Class | Location | Tests |
|-----------|----------|-------|
| DataControllerTest | `src/test/java/.../controller/` | REST endpoint behavior |
| DataServiceImplTest | `src/test/java/.../services/impl/` | Business logic |
| AcvCrudConfigInfoRepoTest | `src/test/java/.../repository/` | Query methods |

### 7.2 Integration Tests

| Test Class | Tests |
|-----------|-------|
| DataServiceIntegrationTest | End-to-end with database |
| CacheIntegrationTest | Redis caching behavior |
| SecurityIntegrationTest | OAuth2 authentication |

---

## 8. Extension Points - Adding to Codebase

### "I want to add a new REST endpoint"

1. Add method to `DataController.java`:
```java
@PostMapping(value = "/{entity}/custom", produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<?> customEndpoint(@PathVariable String entity, @RequestBody String request) {
    // Implementation
}
```

2. Document in [services.md](services.md)

### "I want to add a new operation type (ADD/GET/ALL)"

1. Add case to switch statement in `DataController.java`:
```java
case AcvConstant.CUSTOM_OP:
    result = dataSvc.customOperation(sqlMapper, entity);
    break;
```

2. Add method to `DataService` interface
3. Implement in `DataServiceImpl.java`
4. Add constant to `AcvConstant.java`

### "I want to add caching for new entity"

1. Add `@Cacheable` annotation to method:
```java
@Cacheable(value = "newEntityCache", key = "#entity + '-' + #id")
public String getDetails(String entity, String id) { ... }
```

2. Update `application-local.yml` with TTL if needed

### "I want to add a new Maven dependency"

1. Edit `pom.xml`
2. Add `<dependency>` section
3. Run `mvn clean install`
4. Restart application

---

## 9. Performance Optimization Points

| Area | Location | Optimization |
|------|----------|-------------|
| **Query Performance** | AcvCrudConfigInfo.sqlQuery* | Use appropriate SQL indexes |
| **Caching** | DataServiceImpl | Adjust TTL, cache key strategy |
| **Connection Pool** | application-local.yml | Tune hikari.maximum-pool-size |
| **Batch Operations** | DataControllerV2 | Use batch endpoint for multiple ops |

---

## 10. Troubleshooting Locations

| Issue | Location | Check |
|-------|----------|-------|
| **Endpoint not found** | DataController.java, DataControllerV2.java | @PostMapping URL mapping |
| **Cache not working** | DataServiceImpl.java | @Cacheable annotation present? |
| **Database connection failed** | application-local.yml | spring.datasource.url correct? |
| **Authentication failed** | AcvDataAccessServiceApplication.java | Okta config correct? |
| **Redis not connecting** | application-local.yml | spring.redis.host, port correct? |

---

## Cross-References

- [README.md](README.md) — Project overview
- [HLD.md](HLD.md) — Architecture explanations
- [LLD.md](LLD.md) — Implementation details
- [services.md](services.md) — API specifications

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** Developers, Code Reviewers, New Team Members, Technical Leads
