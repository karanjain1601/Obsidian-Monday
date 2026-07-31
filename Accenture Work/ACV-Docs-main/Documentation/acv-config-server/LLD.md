# ACV Configuration Server - Low-Level Design & Implementation

**Purpose:** Document code structure, implementation details, and technical specifics.

**Scope:** Project organization, class inventory, configuration properties, startup flow.

---

## 1. Source Code Organization

### 1.1 Directory Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/fedex/acv/config/
│   │       └── AcvConfigServerApplication.java    (1 file)
│   │
│   └── resources/
│       ├── application.yml                 (Main configuration)
│       └── application-prod.yml            (Production overrides)
│
└── test/
    └── java/
        └── com/fedex/acv/config/
            └── AcvConfigServerApplicationTests.java (1 file)
```

### 1.2 Minimalist Architecture

**Key Insight:** This is a **minimal Spring Cloud Config Server** with only 1 custom Java class + configuration!

**Why so simple?**
- Most functionality provided by `@EnableConfigServer` annotation
- Spring Cloud Config Server handles all REST endpoints automatically
- Configuration comes from YAML (application.yml)
- No custom repositories, services, or controllers needed

---

## 2. Core Classes

### 2.1 AcvConfigServerApplication

**Location:** `src/main/java/com/fedex/acv/config/AcvConfigServerApplication.java`

**Purpose:** Main Spring Boot application class enabling Config Server functionality.

**Code:**
```java
package com.fedex.acv.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@EnableConfigServer                    // Enables Config Server endpoints
@SpringBootApplication                 // Standard Spring Boot app
public class AcvConfigServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(AcvConfigServerApplication.class, args);
        // Starts embedded Tomcat, initializes Spring context, enables endpoints
    }
}
```

**Annotations:**

| Annotation | Purpose |
|-----------|---------|
| `@EnableConfigServer` | Enables Spring Cloud Config Server functionality; provides REST endpoints |
| `@SpringBootApplication` | Composite of @Configuration, @EnableAutoConfiguration, @ComponentScan |

**Responsibilities:**
- Application entry point
- Enables Config Server auto-configuration
- Starts Spring Boot application

### 2.2 AcvConfigServerApplicationTests

**Location:** `src/test/java/com/fedex/acv/config/AcvConfigServerApplicationTests.java`

**Purpose:** Basic integration test verifying application context loads.

**Code Structure:**
```java
@SpringBootTest
public class AcvConfigServerApplicationTests {
    
    @Test
    public void contextLoads() {
        // Verifies Spring context initializes without errors
    }
}
```

**Test Scope:**
- Verifies Spring context loads
- Confirms all beans created successfully
- Basic smoke test

---

## 3. Dependencies & Libraries

### 3.1 Core Dependencies (pom.xml)

```xml
<!-- Spring Boot Parent -->
<parent>
    <version>3.3.2</version>
    <artifactId>spring-boot-starter-parent</artifactId>
</parent>

<!-- Web Framework -->
<dependency>
    <artifactId>spring-boot-starter-web</artifactId>
    <!-- Includes: Tomcat, Spring MVC, Jackson JSON -->
</dependency>

<!-- Config Server Core -->
<dependency>
    <artifactId>spring-cloud-config-server</artifactId>
    <version>2023.0.3</version>
    <!-- Provides:
        - REST endpoints for config distribution
        - Git backend integration
        - Property source management
        - JSON/YAML serialization
    -->
</dependency>

<!-- Monitoring & Management -->
<dependency>
    <artifactId>spring-boot-starter-actuator</artifactId>
    <!-- Provides: /actuator/health, /actuator/metrics, /actuator/prometheus -->
</dependency>

<!-- Metrics Export -->
<dependency>
    <artifactId>micrometer-registry-prometheus</artifactId>
    <!-- Prometheus metrics format export -->
</dependency>

<!-- Testing -->
<dependency>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
<dependency>
    <artifactId>junit-jupiter-engine</artifactId>
    <!-- JUnit 5 test runner -->
</dependency>
```

### 3.2 Dependency Tree (Simplified)

```
spring-boot-starter-parent 3.3.2
├── spring-boot 3.3.2
│   └── spring-core (logging, classpath, resource management)
│
├── spring-boot-starter-web
│   ├── spring-webmvc (MVC framework)
│   ├── spring-web (web utilities)
│   ├── spring-beans (dependency injection)
│   ├── org.apache.tomcat (embedded server)
│   └── jackson-databind (JSON serialization)
│
├── spring-cloud-config-server 2023.0.3
│   ├── spring-cloud-config-server-core
│   ├── spring-web
│   ├── jgit (Git client library - Java implementation of Git)
│   ├── commons-io
│   ├── org.yaml.snakeyaml (YAML parser)
│   └── spring-security (for config server security)
│
├── spring-boot-starter-actuator
│   ├── micrometer-core (metrics)
│   ├── spring-boot-actuator (endpoint framework)
│   └── spring-web (REST binding)
│
└── micrometer-registry-prometheus
    └── micrometer-core (metrics bridge)
```

**Key External Libraries:**

| Library | Version | Purpose |
|---------|---------|---------|
| **JGit** | Latest | Pure Java Git client; loads Git repositories locally |
| **SnakeYAML** | Latest | YAML → Java object parsing |
| **Jackson** | 2.17+ | JSON serialization/deserialization |
| **Log4j** | 2.x | Logging framework |
| **Spring Security** | 6.x | Authentication/authorization (if using BasicAuth) |

---

## 4. Application Configuration (application.yml)

### 4.1 Complete Configuration File

**Location:** `src/main/resources/application.yml`

```yaml
# ============================================================================
# ACV Configuration Server - Main Configuration
# ============================================================================

server:
  # Commented out - using defaults during development
  # port: 7010
  # servlet:
  #   context-path: /acv/config

spring:
  application:
    name: config-server                           # Service identifier
  
  cloud:
    config:
      name: eai-3540813-acv-services             # Default service name
      server:
        enabled: true                             # Enable config server
        
        ## Git Backend Configuration
        ## Reference: https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_git_backend
        git:
          uri: git@github.com:FedEx/eai-3540813-config-repo.git  # SSH URL to config repo
          defaultLabel: main                      # Default Git branch
          
          # The branch/tag to fetch configuration from
          # If main doesn't exist, falls back to master
          # Can be overridden per request: GET /config-repo/service/profile/label
          
          search-paths: '*'                       # Search all directories in repo
          # Alternatives:
          #   'acv-*'       - directories starting with acv-
          #   '*/config'    - config subdirectories
          #   '*'           - all directories
          
          cloneOnStart: false                     # Don't clone at startup
          # false = lazy clone on first request (faster startup)
          # true = clone at startup (detect Git problems immediately)
          
          ignoreLocalSshSettings: true            # Ignore ~/.ssh/config
          
          privateKey: ${DEPLOY_KEY}               # SSH private key from environment
          # Value comes from:
          #   1. Environment variable: DEPLOY_KEY
          #   2. Azure Key Vault (injected by deployment)
          #   3. Used for SSH authentication to GitHub private repo

# ============================================================================
# Management & Monitoring Configuration
# ============================================================================

management:
  # Separate port for management endpoints (health, metrics)
  # Isolates operational concerns from application logic
  server:
    port: 8081                                    # Management port
  
  # Individual endpoint configuration
  endpoint:
    health:
      enabled: true                               # Enable health check
      show-details: always                        # Show full details (dev/test)
    info:
      enabled: true                               # Enable /actuator/info
    shutdown:
      enabled: true                               # Enable graceful shutdown
    metrics:
      enabled: true                               # Enable metrics endpoint
    prometheus:
      enabled: true                               # Enable Prometheus export
  
  # Global endpoint settings
  endpoints:
    web:
      exposure:
        include: '*'                              # Expose all endpoints
        # Production: 'health,metrics,prometheus' (restrict access)
      base-path: /actuator                        # Prefix for all endpoints
      path-mapping:
        health: /health                           # Custom path mapping
  
  # Metrics collection & export
  prometheus:
    metrics:
      export:
        enabled: true                             # Export to Prometheus format

# ============================================================================
# Security Configuration
# ============================================================================

security.basic.enabled: false                     # Disable basic auth for dev
# Production: set to true and provide username/password
```

### 4.2 Environment-Specific Overrides

**Production Override:** `src/main/resources/application-prod.yml`

```yaml
# Production-specific settings applied when spring.profiles.active=prod

spring:
  cloud:
    config:
      server:
        git:
          defaultLabel: main                      # Production uses main branch
          cloneOnStart: true                      # Clone at startup (verify early)
          # Additional settings in Helm values

management:
  endpoint:
    health:
      show-details: when-authorized              # Only show details if authenticated
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus       # Restricted endpoints only

security.basic.enabled: true                      # Enable authentication
```

---

## 5. Spring Cloud Config Server Endpoints (Automatic)

**Provided by `@EnableConfigServer`:**

| Endpoint | Method | Response Format | Purpose |
|----------|--------|-----------------|---------|
| `/config-repo/{service}/{profile}` | GET | JSON | Fetch properties as JSON |
| `/config-repo/{service}/{profile}.yml` | GET | YAML | Fetch properties as YAML |
| `/config-repo/{service}/{profile}.properties` | GET | Properties | Fetch as .properties file |
| `/config-repo/{service}/{profile}/{label}` | GET | JSON | Fetch from specific Git label |
| `/actuator/health` | GET | JSON | Health status |
| `/actuator/metrics` | GET | JSON | Available metrics |
| `/actuator/prometheus` | GET | Plain text | Prometheus format metrics |
| `/actuator/env` | GET | JSON | Environment properties |
| `/actuator/shutdown` | POST | JSON | Graceful shutdown (dev only) |

**Endpoints provided automatically by Spring Cloud Config Server framework.**

---

## 6. Maven Build Configuration

### 6.1 Build Plugins (pom.xml)

```xml
<build>
  <plugins>
    <!-- Spring Boot Maven Plugin -->
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <configuration>
        <outputDirectory>${project.build.directory}/libs</outputDirectory>
        <!-- Build output: target/libs/eai-3540813-config-server-1.1.2.jar -->
      </configuration>
    </plugin>
    
    <!-- JaCoCo Code Coverage -->
    <plugin>
      <groupId>org.jacoco</groupId>
      <artifactId>jacoco-maven-plugin</artifactId>
      <version>0.8.12</version>
      <!-- Generates code coverage reports -->
    </plugin>
  </plugins>
</build>
```

### 6.2 Build Commands

```bash
# Clean build
mvn clean package

# Build with specific profile
mvn clean package -Dspring.profiles.active=prod

# Skip tests
mvn clean package -DskipTests

# Build and push to Docker registry
mvn clean package dockerfile:build dockerfile:push
```

---

## 7. Startup Flow & Initialization

### 7.1 Application Startup Sequence

```
1. JVM Starts
   ├─ Loads bootstrap classpath
   └─ Executes main method

2. Spring Boot Initialization (SpringApplication.run)
   ├─ Loads application.yml (Spring Cloud Config Client bootstrap)
   ├─ Initializes property sources
   ├─ Creates Spring ApplicationContext
   └─ Component scanning (@SpringBootApplication)

3. Spring Cloud Config Server Auto-Configuration
   ├─ @EnableConfigServer detected
   ├─ ConfigServerConfiguration auto-configured
   ├─ ConfigController registered as REST endpoint
   ├─ MultipleJGitEnvironmentRepository created (Git backend)
   └─ Git SSH key loaded from ${DEPLOY_KEY}

4. Git Backend Initialization
   ├─ SSH private key initialized
   ├─ Git repository URI configured
   ├─ Search paths configured
   └─ Repository ready for lazy cloning

5. Actuator Registration
   ├─ Management server started on separate port (8081)
   ├─ HealthIndicators registered
   ├─ MetricsRegistry initialized
   └─ Management endpoints enabled

6. Tomcat Embedded Server Starts
   ├─ HTTP listener on port 8080
   ├─ Accepts REST requests
   └─ Routes to ConfigController

7. Readiness Probe Success
   ├─ /actuator/health/readiness returns UP
   ├─ Kubernetes adds pod to load balancer
   └─ Application ready to serve requests

8. Ready for Configuration Requests
   └─ Waits for clients to request GET /config-repo/...
```

### 7.2 First Request Configuration Fetch Flow

```
Request: GET /config-repo/acv-validation-services/dev

1. ConfigController.getEnvironment() invoked
2. Service resolves: acv-validation-services-dev.yml
3. Check in-memory cache
   ├─ Cache HIT: Return cached properties
   └─ Cache MISS: Continue to step 4
4. Git backend clones repository (first time only)
5. Git pulls main branch into local cache
6. Parse acv-validation-services-dev.yml to YAML object
7. Convert YAML to Property sources (flat key-value map)
8. Store in memory cache (TTL: ~5-10 minutes)
9. Serialize to JSON response
10. Return to client
```

---

## 8. Configuration Binding (Spring Cloud Config Client)

### 8.1 How Client Services Use Configuration

**In Client Application (e.g., validation-services):**

```java
// 1. bootstrap.yml (loaded FIRST)
spring:
  application.name: acv-validation-services
  cloud.config.uri: https://config-server:8888
  profiles.active: dev

// 2. Config Client connects to Config Server
GET http://config-server:8888/config-repo/acv-validation-services/dev

// 3. Config Server returns properties
{
  "propertySources": [{
    "source": {
      "spring.datasource.url": "jdbc:h2:mem:testdb",
      "acv.validation.fuzzyMatchThreshold": 0.85
    }
  }]
}

// 4. Properties automatically bound to Spring beans

@ConfigurationProperties(prefix = "spring.datasource")
public class DataSourceProperties {
    private String url;  // Gets "jdbc:h2:mem:testdb"
    public void setUrl(String url) { this.url = url; }
}

@Value("${acv.validation.fuzzyMatchThreshold}")
private double threshold;  // Gets 0.85
```

---

## 9. Kubernetes Integration

### 9.1 Helm Values Binding

**Helm Values File:** `helm-releases/prod.yaml`

```yaml
# Kubernetes resource requests/limits
resources:
  requests:
    cpu: '0.5'
    memory: '2Gi'
  limits:
    cpu: '1'
    memory: '4Gi'

# Environment variables injected into container
extraVars:
  - name: SPRING_CLOUD_CONFIG_SERVER_GIT_DEFAULTLABEL
    value: main                                # Git branch
  - name: SPRING_APPLICATION_NAME
    value: config-server                       # Service name
  - name: SPRING_PROFILES_ACTIVE
    value: prod                                # Active profile (applies prod overrides)
```

### 9.2 Azure Key Vault Integration (akv2k8s)

```yaml
akv2k8s:
  DEPLOY_KEY:
    vault: kv34176ec51cc0e8578acdcf           # Key Vault reference
    type: secret
    secretName: deploy-key-prod               # Secret name in Key Vault
    # At pod startup: fetches deploy-key-prod from Key Vault
    # Injects as DEPLOY_KEY environment variable
    # Config Server uses: privateKey: ${DEPLOY_KEY}
```

---

## 10. Dockerfile & Containerization

### 10.1 Dockerfile Template

**Pattern (typical Spring Boot Dockerfile):**

```dockerfile
# Multi-stage build
FROM maven:3.8.1-openjdk-21 as builder
WORKDIR /build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:21-slim
WORKDIR /app
COPY --from=builder /build/target/libs/eai-3540813-config-server-1.1.2.jar app.jar

# Environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xmx3280m -Xms1640m"

# Health check
HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8081/actuator/health || exit 1

EXPOSE 8080 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 11. Logging Configuration

### 11.1 Default Logging (from Spring Boot)

```yaml
logging:
  level:
    root: INFO                              # Root logger level
    org.springframework: DEBUG               # Spring framework debug
    org.springframework.cloud.config: DEBUG  # Config server debug
    com.jcraft.jsch: DEBUG                  # Git/SSH debug
  
  file:
    name: logs/config-server.log            # Log file path
    max-size: 10MB                          # Rotation size
    max-history: 10                         # Keep 10 files
```

---

## Cross-References

- [HLD.md](HLD.md) — Architecture patterns
- [services.md](services.md) — API contracts
- [code-mapping.md](code-mapping.md) — File navigation

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** Developers, Platform Engineers, DevOps Engineers
