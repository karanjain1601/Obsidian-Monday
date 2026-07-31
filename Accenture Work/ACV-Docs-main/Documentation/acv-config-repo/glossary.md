# ACV Configuration Repository - Glossary & Terminology

**Purpose:** Define domain terminology, Spring Cloud Config concepts, and acronyms.

**Scope:** 70+ terms, configuration concepts, Azure services, Spring framework terminology.

---

## Configuration Management Concepts

### Configuration Repository (Config Repo)
A Git repository that stores external configuration as YAML files. Services fetch their properties from this centralized source instead of embedding configuration in the application. Enables configuration changes without redeployment.

**Related:** Config Server, Spring Cloud Config Client, GitOps

### Configuration Server (Config Server)
A microservice that reads configuration from a Git repository and serves it to client services via REST API. Acts as middleware between Git and application services. Supports dynamic refresh without service restart.

**Related:** Config Repository, Config Client, Spring Cloud Config

### Config Client
An application service that connects to Config Server on startup to fetch configuration properties. Can refresh properties at runtime if they're marked with `@RefreshScope`. Uses bootstrap.yml for connectivity settings.

**Related:** Config Server, @RefreshScope, bootstrap.yml

### Spring Cloud Config
Framework that provides client-server approach to externalized configuration. Config Server fetches from Git, Config Clients connect to server. Supports multiple Git repositories, multiple profiles, and encryption.

**Related:** Spring Cloud Bus, @ConfigurationProperties, Environment

### Profile (Configuration Profile)
A named configuration variant (e.g., "dev", "test", "prod"). Services load profile-specific configurations at startup. Enables same codebase to run with different settings per environment.

**Example:** `spring.profiles.active=dev` loads `app-dev.yml`

**Related:** Active Profile, Environment, Configuration Variant

---

## Property Management

### Property
A key-value pair representing a configuration setting. Properties are organized hierarchically in YAML. Each service reads dozens to hundreds of properties at startup.

**Format:** `spring.datasource.url=jdbc:postgresql://localhost:5432/db`

**Related:** YAML, Environment Variable, Configuration File

### Property Source
An origin of configuration values (e.g., YAML file, environment variable, system property). Spring merges multiple sources with specific precedence order. Git YAML files are primary source in Config Server pattern.

**Sources in Priority Order:**
1. System Properties (-Dkey=value)
2. Environment Variables
3. Config Server (Git YAML)
4. application.yml
5. application-{profile}.yml

**Related:** Configuration Precedence, Environment

### PropertySource (Spring Class)
Spring Framework class representing a source of properties. Config Server returns multiple PropertySources for each service. Applications iterate through sources to resolve property values.

**Related:** Spring Environment, @ConfigurationProperties

### Nested Properties
Hierarchical property organization in YAML. Parent keys contain child keys, creating tree structure. Enables logical organization and reduces repetition.

**Example:**
```yaml
spring:
  datasource:
    url: jdbc:...        # spring.datasource.url
    username: user       # spring.datasource.username
```

**Related:** YAML, Flattening

### Property Flattening
Conversion of nested YAML to flat key-value format. Spring flattens hierarchical YAML into dot-notation properties for environment variable compatibility.

**Example:**
```yaml
acv:
  validation:
    fuzzyMatchThreshold: 0.85
```
Flattens to: `acv.validation.fuzzyMatchThreshold=0.85`

**Related:** Nested Properties, Environment Variables

---

## Dynamic Configuration

### @RefreshScope
Spring annotation marking beans for property refresh without restart. When `/actuator/refresh` called, Spring destroys old bean and creates new one with updated properties. Only works on beans with this annotation.

**Usage:**
```java
@RefreshScope
@Component
@ConfigurationProperties(prefix = "acv.validation")
public class ValidationProperties { }
```

**Related:** Dynamic Configuration, refresh Endpoint, RefreshScopeRefreshedEvent

### Refresh Endpoint (`/actuator/refresh`)
HTTP POST endpoint triggering property reloading for @RefreshScope beans. Config Client fetches latest from Config Server, destroys old beans, recreates with new properties. Takes ~1 second.

**Request:**
```bash
curl -X POST http://service:8080/actuator/refresh
```

**Response:**
```json
["property.that.changed", "another.changed.property"]
```

**Related:** @RefreshScope, Dynamic Configuration, Manual Refresh

### Automatic Refresh
Config Server pushes updates to clients via Spring Cloud Bus when configuration changes. Requires message broker (RabbitMQ, Kafka). Service receives message and triggers refresh automatically.

**Requires:** Spring Cloud Bus, Message Broker

**Related:** Manual Refresh, Spring Cloud Bus, Git Webhook

### Manual Refresh
Developer explicitly calls `/actuator/refresh` endpoint instead of automatic refresh. Used when Spring Cloud Bus not available or manual control preferred.

**Related:** Automatic Refresh, Refresh Endpoint

### RefreshScopeRefreshedEvent
Spring event published when @RefreshScope beans are refreshed. Components can listen to this event to perform custom actions after property reload (e.g., log changes, reconnect resources).

**Related:** @RefreshScope, Spring Events, Event Listener

---

## Version Control & Git

### Git Repository
Distributed version control system storing configuration files. Config Server clones repository and tracks changes. Enables configuration history, branching, and rollback.

**Concepts:** Commit, Branch, Tag, Push, Pull, Merge

**Related:** Configuration History, Git Webhook, Rollback

### Git Webhook
HTTP callback triggered when repository receives push. Config Server receives webhook notification from Git, pulls latest changes, invalidates cache. Enables automatic propagation without polling.

**Trigger:** Repository → Git Webhook → Config Server → Refresh Clients

**Related:** Automatic Refresh, Git Integration, Event-Driven

### Configuration History
Git commit log showing all configuration changes over time. Each commit has author, timestamp, message, and changed files. Enables auditing and reverting unintended changes.

**Command:** `git log --oneline -- acv-validation-services/`

**Related:** Git Repository, Rollback, Audit Trail

### Branch
Named version of repository code/configuration. Config Server fetches from specific branch (usually "main"). Teams can use feature branches for configuration changes before merging.

**Default:** `main` (previously `master`)

**Related:** Git Repository, Merge, Release Management

### Tag
Named snapshot of repository at specific point in time. Often used for version releases. Example: `config-prod-v2024-01-15`.

**Related:** Version Control, Release Management

### Rollback
Reverting configuration to previous version by resetting Git commit. Restores service behavior to earlier state.

**Process:**
```bash
git revert <commit-hash>          # Create new commit undoing changes
git push origin main              # Push changes
# Services refresh with old values
```

**Related:** Configuration History, Git Repository, Manual Refresh

---

## Spring Boot Configuration

### bootstrap.yml
Configuration file loaded FIRST (before application.yml) that contains Config Server connection details. Spring Cloud Config Client uses bootstrap.yml to connect to Config Server.

**Location:** `src/main/resources/bootstrap.yml`

**Contents:**
```yaml
spring:
  application:
    name: service-name              # Must match config filename
  cloud:
    config:
      uri: https://config-server    # Config Server URL
```

**Related:** application.yml, Spring Cloud Config Client, Configuration Load Order

### application.yml
Service's own configuration file (optional). Properties here are merged with Config Server properties. System properties and env vars override both.

**Location:** `src/main/resources/application.yml`

**Related:** bootstrap.yml, External Configuration, Property Precedence

### @ConfigurationProperties
Spring annotation binding external properties to Java bean fields. Config Server properties automatically bound to annotated class.

**Example:**
```java
@ConfigurationProperties(prefix = "acv.validation")
public class ValidationProperties {
    private double fuzzyMatchThreshold = 0.85;  // Bound from config
    public double getFuzzyMatchThreshold() { return fuzzyMatchThreshold; }
    public void setFuzzyMatchThreshold(double v) { this.fuzzyMatchThreshold = v; }
}
```

**Related:** @RefreshScope, Spring Environment, Property Binding

### @Component
Spring annotation marking class as component to be managed by Spring Container. Used with @ConfigurationProperties to enable automatic dependency injection.

**Related:** Spring Bean, Dependency Injection, Spring Container

### Environment
Spring interface providing access to all resolved properties. Services inject Environment to read properties programmatically at runtime.

**Example:**
```java
@Autowired
private Environment environment;

String value = environment.getProperty("acv.validation.fuzzyMatchThreshold");
```

**Related:** Properties, PropertyResolver, @Value

### @Value
Spring annotation injecting individual property into bean field. Alternative to @ConfigurationProperties when only one or few properties needed.

**Example:**
```java
@Value("${acv.validation.fuzzyMatchThreshold:0.85}")
private double threshold;
```

**Related:** @ConfigurationProperties, Environment, Property Injection

### Actuator
Spring Boot component exposing operational endpoints for monitoring and configuration inspection. Includes `/actuator/health`, `/actuator/metrics`, `/actuator/env`, `/actuator/configprops`.

**Related:** Management Endpoints, Metrics, Health Check

### Management Endpoints
Actuator endpoints exposed for monitoring (e.g., `/actuator/health`, `/actuator/metrics`, `/actuator/refresh`). Can be selectively exposed based on security requirements.

**Related:** Actuator, Health Check, Metrics

---

## Database Configuration

### Datasource
Connection to database. Spring creates datasource from `spring.datasource.*` properties (URL, username, password, driver). Multiple datasources possible for multi-database scenarios.

**Properties:**
```yaml
spring.datasource.url: jdbc:postgresql://host:5432/db
spring.datasource.username: user
spring.datasource.password: password
spring.datasource.driverClassName: org.postgresql.Driver
```

**Related:** Connection Pooling, HikariCP, JDBC

### HikariCP
High-performance JDBC connection pool. Spring Boot uses Hikari by default. Manages pool of database connections for efficient resource reuse.

**Configuration:**
```yaml
spring.datasource.hikari:
  maximum-pool-size: 20              # Max concurrent connections
  minimum-idle: 5                    # Min idle connections ready
  connection-timeout: 20000          # Wait time in ms
```

**Related:** Datasource, Connection Pooling

### Connection Pooling
Technique maintaining pool of database connections for reuse. Applications request connection from pool instead of creating new one each time. Dramatically improves performance.

**Benefits:** Reduced latency, lower database load, efficient resource usage

**Related:** HikariCP, Datasource, Database Performance

### JDBC (Java Database Connectivity)
Java API for database connectivity. Spring uses JDBC under the hood. JDBC URLs specify database type and location.

**Example URLs:**
- `jdbc:h2:mem:testdb` (H2 in-memory)
- `jdbc:postgresql://localhost:5432/mydb` (PostgreSQL)
- `jdbc:mysql://localhost:3306/mydb` (MySQL)

**Related:** Datasource, Database Connection

### JPA (Java Persistence API)
Standard interface for Object-Relational Mapping (ORM). Hibernate is JPA implementation used in ACV services. Enables database interaction through Java objects instead of SQL.

**Related:** Hibernate, ORM, @Entity, @EntityManager

### Hibernate
ORM framework implementing JPA. Automatically generates SQL from Java objects and annotations. Configured via `spring.jpa.hibernate.*` properties.

**Configuration:**
```yaml
spring.jpa.hibernate.ddl-auto: update  # Auto-create/update schema
```

**Related:** JPA, ORM, Object-Relational Mapping

### DDL-AUTO (Data Definition Language)
Hibernate property controlling schema generation behavior during startup.

**Values:**
- `create` — Drop existing schema, create new
- `update` — Create tables if missing, update existing columns
- `validate` — Verify schema matches entities (fail if mismatch)
- `none` — No schema generation (manual migrations)

**Recommendation:** Use `validate` in production, `update` in development

**Related:** Schema Management, Migrations

### Database Dialect
Hibernate property specifying SQL dialect for particular database. Each database has subtle SQL differences; dialect abstracts them.

**Examples:**
- `org.hibernate.dialect.H2Dialect` (H2)
- `org.hibernate.dialect.PostgreSQLDialect` (PostgreSQL)
- `org.hibernate.dialect.MySQL8Dialect` (MySQL 8)

**Related:** JPA, Hibernate, Database Portability

---

## Security & Secrets

### API Key
Secret token used to authenticate requests to external services (e.g., SIGNZY OCR, Credit Bureau API). Stored in Azure Key Vault, not in Git repository.

**Retrieved as:** Environment variable, then bound to configuration property

**Related:** Key Vault, Secret Management, Authentication

### Key Vault
Azure service for secure storage of secrets, API keys, certificates. ACV retrieves secrets at runtime, not hardcoded in configuration.

**Secrets stored:**
- `SIGNZY_API_KEY` — SIGNZY provider authentication
- `CREDITBUREAU_API_KEY` — Credit Bureau authentication
- `DB_PASSWORD` — Database credentials
- `SSL_KEYSTORE_PASSWORD` — Keystore for HTTPS

**Related:** Secret Management, Azure, Secrets

### Secret Management
Secure handling of sensitive values (passwords, API keys, tokens). Secrets never stored in Git repository. Instead stored in Key Vault, retrieved as environment variables at runtime.

**Best Practice:** Placeholder in Git → Environment Variable → Key Vault

**Related:** Key Vault, Environment Variable, Secrets

### Basic Authentication (HTTP)
Simple authentication using username:password encoded in HTTP header. Used for Config Server access in production.

**Header Format:** `Authorization: Basic <base64(username:password)>`

**Example:**
```bash
# Credentials: configuser:password
curl -H "Authorization: Basic Y29uZmlndXNlcjpwYXNzd29yZA==" http://config-server/...
```

**Related:** Authorization, HTTP Security, Config Server

---

## Environment & Profiles

### Active Profile
Profile Spring Boot uses to select configuration variants. Specified via `spring.profiles.active` property. Services can activate multiple profiles simultaneously.

**Common Profiles:** dev, test, prod, local

**Set via:**
- Environment variable: `SPRING_PROFILES_ACTIVE=dev`
- Java property: `-Dspring.profiles.active=dev`
- application.properties: `spring.profiles.active=dev`

**Related:** Profile, Configuration Variant, Application Properties

### Environment Variable
Operating system variable accessible to applications. Spring can bind environment variables to properties using camel-case to kebab-case mapping.

**Example:**
```
Environment: SPRING_DATASOURCE_URL=jdbc:postgresql://...
Maps to: spring.datasource.url
```

**Advantage:** Secure (not in code), portable across platforms

**Related:** External Configuration, Secret Management

### Placeholder Syntax
Spring property syntax for resolving variable values at configuration load time. Enables value substitution and defaults.

**Formats:**
- `${VARIABLE_NAME}` — Required; fail if not set
- `${VARIABLE_NAME:default}` — Optional; use default if not set

**Example:**
```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:h2:mem:db}  # Use DB_URL env var, default to H2
```

**Related:** Property Resolution, Environment Variable

### Configuration Variant
Different configuration for same service in different environments (dev, test, prod). Each variant has own YAML file.

**Naming:** `{service}-{variant}.yml`

**Examples:**
- `acv-validation-services-dev.yml` (Development variant)
- `acv-validation-services-prod.yml` (Production variant)

**Related:** Profile, Environment, Configuration Management

---

## Monitoring & Observability

### Health Check
Endpoint verifying service is running and dependencies (database, etc.) are accessible. `/actuator/health` returns UP/DOWN/UNKNOWN status.

**Indicators:**
- Database connection status
- Disk space availability
- Memory usage
- Custom health indicators

**Related:** Actuator, Liveness, Readiness

### Liveness Probe
Kubelet probe checking if process is running. If liveness fails repeatedly, Kubernetes restarts pod. Used to recover from deadlocks.

**Endpoint:** `/actuator/health/liveness`

**Related:** Health Check, Readiness Probe, Kubernetes

### Readiness Probe
Kubelet probe checking if pod is ready to accept traffic. If readiness fails, Kubernetes removes pod from load balancer.

**Endpoint:** `/actuator/health/readiness`

**Related:** Health Check, Liveness Probe, Kubernetes

### Metrics
Quantitative measurements of system behavior (request count, latency, memory usage, etc.). Scrapped by Prometheus and visualized in Grafana.

**Common Metrics:**
- `http.server.requests` — HTTP endpoint metrics
- `jvm.memory.used` — Memory consumption
- `process.cpu.usage` — CPU percentage
- `spring.config.service.requests` — Config Server requests

**Related:** Prometheus, Grafana, Observability

### Prometheus
Metrics collection system scraping endpoint exposing metrics in text format. Stores time-series data for dashboards and alerting.

**Endpoint:** `/actuator/prometheus`

**Format:** Text-based, machine-readable metric export

**Related:** Metrics, Grafana, Observability

---

## Deployment & Operations

### Kubernetes (K8s)
Container orchestration platform deploying and managing containerized services. ACV services run in Kubernetes pods.

**Related:** Container, Pod, Deployment, Service

### Pod
Smallest deployable unit in Kubernetes. Single or multiple containers running together. Services deployed as pods in Kubernetes clusters.

**Related:** Kubernetes, Container, Deployment

### Deployment
Kubernetes resource describing desired state for pods. Specifies image, replicas, environment variables, resource limits.

**Related:** Kubernetes, Pod, ReplicaSet

### Helm
Kubernetes package manager for templating and deploying applications. ACV uses Helm charts for deployment to AKS.

**Related:** Kubernetes, Chart, Release

### Helm Chart
Templated Kubernetes manifests with variables. Charts can be reused across environments by changing values.

**Related:** Helm, Kubernetes, Deployment Template

### Helm Release
Deployed instance of Helm chart. Each release has unique name, namespace, and values.

**Example:** `helm install acv-validation-dev eai-3540813/acv-validation-services`

**Related:** Helm, Chart, Deployment

### Docker
Container platform packaging applications with dependencies into images. Services run as Docker containers in Kubernetes.

**Related:** Container, Image, Registry

### GitHub Actions
CI/CD platform running workflows on code events (push, pull request). Builds, tests, and deploys services to Kubernetes.

**Related:** CI/CD, Workflow, Automation

---

## Azure Services

### Azure Container Registry (ACR)
Registry storing Docker images. GitHub Actions builds images and pushes to ACR. Kubernetes pulls images from ACR to deploy.

**Related:** Docker, Image Registry, CI/CD

### Azure Key Vault
Secure storage for secrets, API keys, certificates. Applications retrieve secrets at runtime instead of storing in Git.

**Related:** Secret Management, Azure, Security

### Azure Kubernetes Service (AKS)
Managed Kubernetes cluster in Azure. Runs ACV services as pods, managed by configuration from Helm charts.

**Related:** Kubernetes, Azure, Container Orchestration

---

## Acronyms & Abbreviations

| Acronym | Full Form | Context |
|---------|-----------|---------|
| **ACV** | Automated Compliance Validation | Platform name |
| **API** | Application Programming Interface | Service endpoints |
| **RBAC** | Role-Based Access Control | Kubernetes/Azure authorization |
| **HTTPS** | HTTP Secure | Encrypted communication |
| **TLS** | Transport Layer Security | Encryption protocol |
| **YAML** | YAML Ain't Markup Language | Configuration file format |
| **JSON** | JavaScript Object Notation | Data format |
| **SQL** | Structured Query Language | Database query |
| **DDL** | Data Definition Language | Schema creation |
| **DML** | Data Manipulation Language | Data operations |
| **ORM** | Object-Relational Mapping | Database abstraction |
| **JDBC** | Java Database Connectivity | Java DB API |
| **JPA** | Java Persistence API | ORM standard |
| **HTTP** | HyperText Transfer Protocol | Web communication |
| **REST** | Representational State Transfer | API architectural style |
| **JSON-RPC** | JSON Remote Procedure Call | RPC protocol |
| **CI/CD** | Continuous Integration/Deployment | Automation pipeline |
| **ECR** | Elastic Container Registry | AWS image registry |
| **ACR** | Azure Container Registry | Azure image registry |
| **AKS** | Azure Kubernetes Service | Azure K8s service |
| **K8s** | Kubernetes | Container orchestration (abbreviated) |
| **K8s** | Kubernetes (using 8 for 8 letters) | Container orchestration |
| **YAML** | YAML Ain't Markup Language | Configuration format |
| **SSH** | Secure Shell | Remote access protocol |
| **HPA** | Horizontal Pod Autoscaler | Kubernetes auto-scaling |
| **PDB** | Pod Disruption Budget | Kubernetes availability |
| **mTLS** | Mutual TLS | Bidirectional encryption |
| **TTL** | Time-to-Live | Cache expiration |
| **ISO** | International Organization for Standardization | Standard |
| **UTC** | Coordinated Universal Time | Timezone standard |
| **Hz** | Hertz | Frequency unit |

---

## Cross-References

- [README.md](README.md) — Project overview
- [HLD.md](HLD.md) — Architecture patterns
- [LLD.md](LLD.md) — YAML structure
- [services.md](services.md) — API reference
- [code-mapping.md](code-mapping.md) — File navigation
- [onboarding.md](onboarding.md) — Developer setup

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** All team members (Developers, DevOps, Platform Engineers)
