# ACV Configuration Server - Code Mapping & Navigation

**Purpose:** Navigate the codebase, understand file organization, and locate components.

**Scope:** Project structure, class inventory, configuration mapping, file references.

---

## 1. Project Structure Overview

### 1.1 Complete Directory Organization

```
eai-3540813-config-server/                (Repository root)
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/fedex/acv/config/
│   │   │       └── AcvConfigServerApplication.java    (16 lines)
│   │   │           └── Responsibility: Main app, @EnableConfigServer
│   │   │           └── Dependencies: Spring Boot, Spring Cloud Config
│   │   │
│   │   └── resources/
│   │       ├── application.yml                        (55 lines)
│   │       │   └── Spring Boot + config server properties
│   │       └── (no application-prod.yml in src/)
│   │
│   └── test/
│       └── java/com/fedex/acv/config/
│           └── AcvConfigServerApplicationTests.java   (12 lines)
│               └── contextLoads() test
│
├── helm-releases/
│   ├── nonprod-dev.yaml                  (50 lines)
│   │   └── Development Kubernetes deployment values
│   ├── nonprod-test.yaml                 (50 lines)
│   │   └── Test Kubernetes deployment values
│   └── prod.yaml                         (85 lines)
│       └── Production Kubernetes deployment values
│
├── .github/
│   └── workflows/                        (GitHub Actions CI/CD)
│
├── .mvn/
│   └── wrapper/                          (Maven wrapper)
│
├── pom.xml                               (102 lines)
│   └── Maven dependencies and build config
│
├── cicd-maven-settings.xml               (CICD-specific Maven config)
├── mvnw, mvnw.cmd                        (Maven CLI wrapper)
└── README.md
```

---

## 2. Java Classes Inventory

### 2.1 Application Class

| Class | File | Responsibility | Key Methods |
|-------|------|-----------------|-------------|
| **AcvConfigServerApplication** | src/main/java/com/fedex/acv/config/ | Main application class; enables Config Server | `main(String[] args)` |

**Annotations:**
- `@EnableConfigServer` — Enables Spring Cloud Config Server
- `@SpringBootApplication` — Composite: @Configuration, @EnableAutoConfiguration, @ComponentScan

**Code:**
```java
@EnableConfigServer
@SpringBootApplication
public class AcvConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(AcvConfigServerApplication.class, args);
    }
}
```

**Auto-Generated / Spring-Provided Classes (Not Visible in Source):**

| Class | Package | Responsibility |
|-------|---------|-----------------|
| **ConfigController** | org.springframework.cloud.config.server | REST endpoints for configuration distribution |
| **ConfigServerConfiguration** | org.springframework.cloud.config.server.config | Auto-configuration class |
| **MultipleJGitEnvironmentRepository** | org.springframework.cloud.config.server.environment | Git backend implementation |
| **PropertySourceBuilder** | org.springframework.cloud.config.server.config | Builds property sources from YAML |
| **EnvironmentController** | org.springframework.cloud.config.server | Handles /config-repo requests |

**Why No Custom Controllers/Services?**
- Spring Cloud Config Server provides all functionality via auto-configuration
- Annotation `@EnableConfigServer` enables 80+ components automatically
- Config Server is essentially a "working out of the box" application
- Only need to provide YAML configuration

---

## 3. Configuration File Organization

### 3.1 application.yml Property Mapping

| Section | Property | File Line | Purpose |
|---------|----------|-----------|---------|
| **Server** | server.port | 2 (commented) | Application port (default 8080) |
| **Server** | server.servlet.context-path | 3 (commented) | URL context path |
| **Spring Config** | spring.application.name | 6 | Service identifier |
| **Spring Config** | spring.cloud.config.name | 8 | Default service name |
| **Git Backend** | spring.cloud.config.server.git.uri | 13 | GitHub repository URL |
| **Git Backend** | spring.cloud.config.server.git.defaultLabel | 14 | Default Git branch |
| **Git Backend** | spring.cloud.config.server.git.search-paths | 17 | Directories to search |
| **Git Backend** | spring.cloud.config.server.git.cloneOnStart | 20 | Clone strategy |
| **Git Backend** | spring.cloud.config.server.git.ignoreLocalSshSettings | 21 | SSH config handling |
| **Git Backend** | spring.cloud.config.server.git.privateKey | 22 | SSH private key |
| **Management** | management.server.port | 26 | Management endpoint port |
| **Management** | management.endpoints.web.exposure.include | 37 | Exposed endpoints |
| **Management** | management.metrics.export.prometheus.enabled | 42 | Prometheus metrics |
| **Security** | security.basic.enabled | 44 | Basic auth enabled |

---

## 4. Dependency Mapping

### 4.1 Maven Dependencies in pom.xml

```
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.3.2</version>
  ├─ Provides: Spring Boot 3.3.2 base
  └─ Transitively includes: logging, tomcat, spring-core, spring-beans
</dependency>

<dependency>
  <artifactId>spring-boot-starter-web</artifactId>
  ├─ spring-webmvc (REST, MVC framework)
  ├─ spring-web (web utilities)
  ├─ spring-beans (dependency injection)
  ├─ org.apache.tomcat:tomcat-embed-core (embedded servlet container)
  └─ jackson-databind (JSON serialization)
</dependency>

<dependency>
  <artifactId>spring-cloud-config-server</artifactId>
  <version>2023.0.3</version>
  ├─ spring-cloud-config-server-core
  ├─ jgit (Git client library)
  ├─ org.yaml.snakeyaml (YAML parsing)
  ├─ spring-security (authentication/authorization)
  └─ spring-web, spring-core (transitive)
</dependency>

<dependency>
  <artifactId>spring-boot-starter-actuator</artifactId>
  ├─ spring-boot-actuator (endpoints framework)
  ├─ micrometer-core (metrics)
  └─ spring-web (REST binding)
</dependency>

<dependency>
  <artifactId>micrometer-registry-prometheus</artifactId>
  ├─ micrometer-core (metrics bridge)
  └─ prometheus-metrics-core (Prometheus format)
</dependency>
```

---

## 5. Kubernetes Configuration Mapping

### 5.1 Helm Values by Environment

| Property | Dev Value | Test Value | Prod Value |
|----------|-----------|------------|------------|
| **replicaCount** | 1 | 1 | 1 |
| **resources.request.cpu** | 0.5 | 0.5 | 0.5 |
| **resources.request.memory** | 2Gi | 2Gi | 2Gi |
| **resources.limit.cpu** | 1 | 1 | 1 |
| **resources.limit.memory** | 4Gi | 4Gi | 4Gi |
| **container.ports[0].containerPort** | 8080 | 8080 | 8080 |
| **container.ports[1].containerPort** | 8081 | 8081 | 8081 |
| **ingress.enabled** | true | true | true |
| **ingress.hosts[0].host** | ... dev fqdn | ... test fqdn | ... prod fqdn |
| **serviceMonitor.enabled** | false | false | true |
| **annotations.deployment.oneagent** | false | false | true |

### 5.2 Environment Variables Set by Helm

```yaml
extraVars:
  - name: SPRING_CLOUD_CONFIG_SERVER_GIT_DEFAULTLABEL
    value: main                                  # Dev/Test/Prod same
  
  - name: SPRING_APPLICATION_NAME
    value: config-server                        # All environments
  
  - name: SPRING_PROFILES_ACTIVE
    value: prod                                 # Dev uses dev, Prod uses prod
  
  # Key Vault secrets injected as env vars
  - name: DEPLOY_KEY
    source: akv2k8s                            # From Key Vault
```

---

## 6. REST Endpoints Mapping

### 6.1 Auto-Generated Endpoints

| Endpoint Pattern | Source | Auto-Registered | Handler |
|-----------------|--------|-----------------|---------|
| `/config-repo/{service}/{profile}` | Spring Cloud Config | Yes | ConfigController |
| `/config-repo/{service}/{profile}.yml` | Spring Cloud Config | Yes | ConfigController |
| `/config-repo/{service}/{profile}.properties` | Spring Cloud Config | Yes | ConfigController |
| `/actuator/health` | Spring Boot Actuator | Yes | HealthEndpoint |
| `/actuator/health/liveness` | Spring Boot Actuator | Yes | HealthEndpoint |
| `/actuator/health/readiness` | Spring Boot Actuator | Yes | HealthEndpoint |
| `/actuator/metrics` | Spring Boot Actuator | Yes | MetricsEndpoint |
| `/actuator/env` | Spring Boot Actuator | Yes | EnvironmentEndpoint |
| `/actuator/prometheus` | Micrometer Prometheus | Yes | MeterRegistry |
| `/actuator/shutdown` | Spring Boot Actuator | Yes (if enabled) | ShutdownEndpoint |

**All endpoints automatically registered by Spring Cloud Config Server and Spring Boot Actuator frameworks.**

---

## 7. Build Artifacts

### 7.1 Maven Build Output

```
mvn clean package
└─ Target artifacts:

target/
├── classes/
│   ├── com/fedex/acv/config/AcvConfigServerApplication.class
│   └── application.yml (copied from src/main/resources)
│
├── libs/
│   └── eai-3540813-config-server-1.1.2.jar    (Executable JAR)
│       └── Contains: Spring Boot + all dependencies
│       └── Entry point: AcvConfigServerApplication.main()
│       └── Run: java -jar eai-3540813-config-server-1.1.2.jar
│
└── (other Maven artifacts: surefire reports, checksums, etc.)
```

### 7.2 Docker Image Layers

```
docker build -t acv-config-server:1.1.2
└─ Dockerfile layers:

Layer 1: Base Image
  FROM openjdk:21-slim
  
Layer 2: Application
  COPY target/libs/eai-3540813-config-server-1.1.2.jar app.jar
  
Layer 3: Entry Point
  ENTRYPOINT ["java", "-jar", "app.jar"]
  EXPOSE 8080 8081
```

---

## 8. Property Binding Flow

### 8.1 How Properties Reach Beans

```
1. application.yml (in src/main/resources)
   ├─ spring.cloud.config.server.git.uri
   ├─ spring.cloud.config.server.git.defaultLabel
   ├─ spring.cloud.config.server.git.privateKey: ${DEPLOY_KEY}
   └─ management.* properties

2. Environment Variables (injected by Kubernetes)
   ├─ SPRING_PROFILES_ACTIVE=prod
   ├─ SPRING_APPLICATION_NAME=config-server
   ├─ DEPLOY_KEY=(SSH private key from Key Vault)
   └─ SPRING_CLOUD_CONFIG_SERVER_GIT_DEFAULTLABEL=main

3. Property Resolution
   ├─ Spring PropertyResolver merges sources
   ├─ Environment variables override application.yml
   ├─ System properties override everything
   └─ Result: ConfigServerConfiguration receives resolved values

4. Spring Cloud Config Server Auto-Configuration
   ├─ git.uri is bound to: MultipleJGitEnvironmentRepository
   ├─ git.privateKey is bound to: SSH key configuration
   ├─ management.endpoints.* bound to: ActuatorEndpointRegistry
   └─ metrics.export.prometheus.enabled bound to: MeterRegistry

5. Application Ready
   └─ Config Server initialized with resolved properties
```

---

## 9. Quick Reference: Finding Code Components

### Q: Where are the REST endpoints defined?

**A:** Auto-generated by Spring Cloud Config Server
- Framework: `org.springframework.cloud.config.server`
- Class: `EnvironmentController`, `ConfigController`
- Not in source code; provided by spring-cloud-config-server dependency

### Q: Where is the Git integration code?

**A:** Spring Cloud Config Server Git backend
- Framework: `org.springframework.cloud.config.server.environment`
- Implementation: `MultipleJGitEnvironmentRepository`, `JGitEnvironmentRepository`
- Uses: JGit library (Java Git implementation)
- Configuration: `spring.cloud.config.server.git.*` properties

### Q: How does YAML get converted to properties?

**A:** Spring Cloud Config Server property source builder
- Parser: `org.yaml.snakeyaml.Yaml` (SnakeYAML library)
- Builder: `PropertySourceBuilder` in config server
- Output: Flat key-value map (spring.datasource.url = ...)

### Q: Where are metrics collected?

**A:** Micrometer framework
- Registry: `MeterRegistry` (in-memory metrics collection)
- Exporters: `PrometheusRegistry` (for /actuator/prometheus)
- Endpoints: Auto-registered by Spring Boot Actuator

---

## 10. Testing Model

### 10.1 Test Class Structure

| Class | File | Test Type | Purpose |
|-------|------|-----------|---------|
| **AcvConfigServerApplicationTests** | src/test/java/com/fedex/acv/config/ | Integration | Context load test |

**Test Code:**
```java
@SpringBootTest
public class AcvConfigServerApplicationTests {
    
    @Test
    public void contextLoads() {
        // Verifies Spring context initializes
        // Spring scans classpath, creates beans, wires dependencies
        // Test passes = no errors during initialization
    }
}
```

**Test Execution:**
```bash
mvn test                                    # Runs all tests
mvn test -Dtest=AcvConfigServerApplicationTests  # Specific test
```

---

## Cross-References

- [HLD.md](HLD.md) — Architecture design
- [LLD.md](LLD.md) — Implementation details
- [services.md](services.md) — API reference
- [glossary.md](glossary.md) — Terminology

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** Developers, Code Reviewers, Maintainers
