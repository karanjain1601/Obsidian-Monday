# ACV Database Service - API & Service Contracts

**Purpose:** Document data operations, configuration contracts, and external interfaces.

**Scope:** DataSource configuration, Flyway contracts, connection pool settings.

---

## 1. Service Overview

### 1.1 Service Type

**Type:** Data Access / Schema Management Service

**Not an HTTP API service** — Database Service does NOT expose REST endpoints.

**What it provides:**
- DataSource bean for JDBC operations
- Automated schema migrations via Flyway
- Connection pooling via HikariCP
- Spring Data JPA support

---

## 2. DataSource Configuration Contract

### 2.1 Configuration Properties Interface

**Purpose:** Define all configuration properties that control database behavior

**Property Namespace:** `spring.datasource.acv.*`

#### 2.1.1 Connection Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `spring.datasource.acv.url` | String | _(required)_ | JDBC connection URL |
| `spring.datasource.acv.username` | String | _(required)_ | Database username |
| `spring.datasource.acv.password` | String | _(required)_ | Database password |
| `spring.datasource.acv.driver-class-name` | String | Auto-detected | JDBC driver class |

**Example - Local Development:**
```properties
spring.datasource.acv.url=jdbc:h2:mem:acv-db
spring.datasource.acv.username=sa
spring.datasource.acv.password=password
spring.datasource.acv.driver-class-name=org.h2.Driver
```

**Example - Production:**
```properties
spring.datasource.acv.url=jdbc:postgresql://db-server.postgres.database.azure.com:5432/acvdb
spring.datasource.acv.username=${POSTGRES_USER}
spring.datasource.acv.password=${POSTGRES_PASS}
spring.datasource.acv.driver-class-name=org.postgresql.Driver
```

#### 2.1.2 Connection Pool Properties (HikariCP)

| Property | Type | Default | Description | Range |
|----------|------|---------|-------------|-------|
| `spring.datasource.acv.hikari.maximum-pool-size` | int | 10 | Max connections | 1-100 |
| `spring.datasource.acv.hikari.minimum-idle` | int | 10 | Min idle connections | 0-max |
| `spring.datasource.acv.hikari.connection-timeout` | long | 30000 | Connection timeout (ms) | 1000-60000 |
| `spring.datasource.acv.hikari.idle-timeout` | long | 600000 | Idle timeout (ms) | 0 (disabled) or 10000+ |
| `spring.datasource.acv.hikari.max-lifetime` | long | 1800000 | Max connection lifetime (ms) | 0 (disabled) or 30000+ |
| `spring.datasource.acv.hikari.auto-commit` | boolean | true | Auto-commit by default | true/false |
| `spring.datasource.acv.hikari.connection-test-query` | String | (none) | Connection validation query | SELECT 1 |

**Recommended Settings:**

Development (Local):
```properties
spring.datasource.acv.hikari.maximum-pool-size=5
spring.datasource.acv.hikari.minimum-idle=2
spring.datasource.acv.hikari.connection-timeout=10000
```

Production:
```properties
spring.datasource.acv.hikari.maximum-pool-size=20
spring.datasource.acv.hikari.minimum-idle=5
spring.datasource.acv.hikari.connection-timeout=30000
spring.datasource.acv.hikari.idle-timeout=600000
spring.datasource.acv.hikari.max-lifetime=1800000
```

#### 2.1.3 Flyway Migration Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `spring.datasource.acv.flyway.scripts` | String | _(required)_ | Migration scripts location |
| `spring.datasource.acv.flyway.baseline-on-migrate` | boolean | true | Create baseline on first migrate |
| `spring.datasource.acv.flyway.baseline-version` | String | 0 | Baseline version number |

**Examples:**
```properties
# Local development
spring.datasource.acv.flyway.scripts=acv-configuration/local

# Production
spring.datasource.acv.flyway.scripts=acv-configuration/prod

# Baseline on first migration
spring.datasource.acv.flyway.baseline-on-migrate=true
```

#### 2.1.4 SSL/TLS Properties (Production)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `spring.datasource.acv.hikari.data-source-properties.ssl` | boolean | false | Enable SSL |
| `spring.datasource.acv.hikari.data-source-properties.sslmode` | String | prefer | SSL mode (require/prefer) |

---

## 3. Flyway Migration Contract

### 3.1 Migration Versioning Standard

**Format:** `V{major}.{minor}__{description}.sql`

**Naming Examples:**
```
V1_0__ACV_CONFIG_CREATE_TABLE.sql        (Major version 1, minor 0)
V1_1__Add_user_roles_table.sql           (Major version 1, minor 1)
V2_0__PostgreSQL_schema_update.sql       (Major version 2, minor 0)
V2_1__Add_audit_timestamp.sql            (Major version 2, minor 1)
```

**Rules:**
- Version must START with `V` (uppercase)
- Major/minor separated by `.` (dot)
- Underscore `_` between version and description
- Description uses `_` to separate words (spaces NOT allowed)
- Must end with `.sql`
- File names MUST be unique

### 3.2 Migration Execution Contract

**Execution Guarantee:**
- Migrations execute in version order (V1_0 → V1_1 → V1_2)
- Each migration runs ONLY ONCE (tracked in flyway_schema_history)
- On startup: Only unapplied migrations execute
- Idempotent behavior: Safe to restart application

**Error Handling:**
- If migration fails: Application startup FAILS
- Database left in PARTIAL state (manual rollback needed)
- Error logged with full stack trace
- Recommendation: Test migrations in lower environments first

### 3.3 Migration Script Template

```sql
-- ========================================
-- Migration Version: V1_1
-- Description: Add audit logging tables
-- Author: Database Team
-- Date: 2026-04-02
-- ========================================

BEGIN TRANSACTION;

-- Create new table
CREATE TABLE acv_audit_log (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    operation VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity_id (entity_id)
);

-- Add column to existing table
ALTER TABLE acv_config ADD COLUMN last_audit_id BIGINT;

-- Insert default values
INSERT INTO acv_audit_log (entity_type, entity_id, operation)
VALUES ('acv_config', 1, 'CREATED');

-- Create indexes for performance
CREATE INDEX idx_audit_changed_at ON acv_audit_log(changed_at);

COMMIT;
```

### 3.4 Flyway Schema History Table

**Auto-Created Table:** `flyway_schema_history`

**Table Structure:**
```sql
CREATE TABLE flyway_schema_history (
    installed_rank INT PRIMARY KEY,        -- Execution order
    version VARCHAR(50),                   -- V1_0, V1_1, etc.
    description VARCHAR(255) NOT NULL,    -- Migration description
    type VARCHAR(20) NOT NULL,             -- SQL or JAVA
    script VARCHAR(1000) NOT NULL,         -- Script file name
    checksum INT,                          -- File integrity check
    installed_by VARCHAR(100) NOT NULL,    -- User who applied
    installed_on TIMESTAMP NOT NULL,       -- When applied
    execution_time INT NOT NULL,           -- Milliseconds taken
    success BOOLEAN NOT NULL               -- true = success, false = failed
);
```

**Example Entries:**
```
| rank | version | description              | installed_on         | execution_time | success |
|------|---------|--------------------------|----------------------|----------------|---------|
| 1    | 1.0     | ACV_CONFIG_CREATE_TABLE  | 2026-04-02 10:30:00  | 245            | true    |
| 2    | 1.1     | Add_user_roles_table     | 2026-04-02 10:30:01  | 312            | true    |
| 3    | 1.2     | Add_audit_logging_table  | 2026-04-02 10:30:02  | 456            | true    |
```

---

## 4. Connection Pool Interface

### 4.1 HikariCP Connection Pool Behavior

**Standard Pool Lifecycle:**

```
1. INITIALIZATION
   ├─ Spring creates DataSource bean
   ├─ HikariCP pool created
   └─ minimumIdle connections established

2. OPERATION
   ├─ Application requests connection: dataSource.getConnection()
   ├─ HikariCP returns idle connection if available
   ├─ If all busy: Queue request (wait)
   ├─ On timeout: Throw SQLException
   └─ Application uses connection
   ├─ Application returns connection: connection.close()
   ├─ HikariCP returns connection to pool
   └─ Back to step 2

3. IDLE TIMEOUT
   ├─ Connection idle for > idleTimeout
   ├─ HikariCP closes connection
   ├─ Connection count drops
   ├─ New connections added to maintain minimumIdle
   └─ Continue operation

4. MAX LIFETIME
   ├─ Connection open for > maxLifetime
   ├─ HikariCP closes connection (regardless of idle state)
   ├─ Protects against long-lived leaked connections
   ├─ New connections created as needed
   └─ Continue operation

5. SHUTDOWN
   ├─ Application stops / Spring context closes
   ├─ HikariCP closes all pool connections
   ├─ Notifies database of disconnections
   └─ Pool destroyed
```

### 4.2 Connection Pool Metrics

**Available Metrics (via Micrometer):**

```
hikaricp.connections.active           # Connections currently in use
hikaricp.connections.idle             # Connections available for reuse
hikaricp.connections.pending           # Threads waiting for connection
hikaricp.connections.creation.seconds  # Time to create new connection
hikaricp.connections.total             # Total pool size
hikaricp.connections.max               # Maximum pool size
hikaricp.connections.min               # Minimum pool size
```

**Example Prometheus Query:**
```
# Current active connections
hikaricp.connections.active{service="database-service"}

# Connection wait time (percentile)
hikaricp.connections.wait_seconds_bucket{quantile="0.95"}
```

---

## 5. JPA Repository Interface

### 5.1 Spring Data JPA Auto-Configuration

**DataSource Bean Exposure:**
```java
@Bean(name="acvConfigDataSource")
public DataSource acvConfigDataSource(...) {
    return datasourceBuilder.build();
}
```

**Available for Injection:**
```java
// In other services:
@Autowired
private DataSource dataSource;  // HikariCP pool

// Or use repositories:
@Autowired
private UserRepository userRepository;  // Spring Data JPA

// Or use JdbcTemplate:
@Autowired
private JdbcTemplate jdbcTemplate;
```

### 5.2 Entity Mapping Contract

**Example Entity (Consumer Service):**
```java
@Entity
@Table(name = "acv_config")
public class ConfigEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "config_key", nullable = false, unique = true)
    private String configKey;
    
    @Column(name = "config_value", columnDefinition = "TEXT")
    private String configValue;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
    
    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
}
```

**Repository Interface:**
```java
public interface ConfigRepository extends JpaRepository<ConfigEntity, Long> {
    Optional<ConfigEntity> findByConfigKey(String configKey);
    List<ConfigEntity> findByIsActive(Boolean isActive);
}
```

---

## 6. Error Codes & Exceptions

| Scenario | Exception | Cause | Resolution |
|----------|-----------|-------|-----------|
| **Connection Timeout** | `SQLException: Connect timeout` | Pool exhausted or DB unreachable | Increase pool size or check DB connectivity |
| **Authentication Failed** | `SQLException: Authentication failed` | Wrong username/password | Verify credentials in properties/secrets |
| **Migration Failure** | `RuntimeException: Database migration failed` | Invalid SQL in migration script | Review migration file syntax; test in dev first |
| **Table Not Found** | `SQLException: Table not found` | Migration not applied | Run migrations; check environment |
| **Connection Closed** | `SQLException: Connection is closed` | Pool recycled connection or network issue | Increase maxLifetime or check network |

---

## 7. Monitoring & Observability Contract

### 7.1 Health Check Endpoint

**Endpoint:** `/actuator/health` (port 8081 in production)

**Response Structure:**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "Connection successful"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 1000000000,
        "free": 500000000
      }
    }
  }
}
```

### 7.2 Readiness & Liveness Probes

**Kubernetes Probes:**

```yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8081
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8081
  initialDelaySeconds: 20
  periodSeconds: 5
```

**What They Check:**
- **Liveness:** Process running and responding
- **Readiness:** Database connections available and migrations complete

---

## Cross-References

- [HLD.md](HLD.md) — Architecture & patterns
- [LLD.md](LLD.md) — Implementation details
- [code-mapping.md](code-mapping.md) — Class navigation
- Spring Data JPA [Reference](https://spring.io/projects/spring-data-jpa)
- Flyway [Documentation](https://flywaydb.org/)

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** Developers Integration Teams, DevOps Engineers
