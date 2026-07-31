# ACV Configuration Server - Project Overview & Quick Start

**Purpose:** Centralized configuration management for all ACV microservices using Spring Cloud Config Server.

**Scope:** Project overview, setup, build, deployment, and key documentation links.

---

## 1. Project Overview

### 1.1 What is the ACV Configuration Server?

The **configuration server** is a Spring Cloud Config Server that:

- **Centralizes configuration** for all ACV microservices (validation engine, API connector, database service, etc.)
- **Fetches from Git** — Reads configuration files from the `eai-3540813-config-repo` repository
- **Serves via REST API** — Exposes configuration to client services on demand
- **Supports multiple environments** — Manages dev, test, and production configurations separately
- **Enables dynamic refresh** — Client services can update properties without restart using `/actuator/refresh`

### 1.2 Why Use a Config Server?

**Benefits:**
✅ **Centralized Management** — All service configurations in one Git repository  
✅ **Version Control** — Configuration changes tracked and auditable  
✅ **Environment Separation** — Different configs for dev/test/prod without code changes  
✅ **No Hardcoding** — Secrets and URLs managed externally  
✅ **Dynamic Updates** — Refresh properties without restarting services  
✅ **Reduced Deployment Complexity** — Single artifact deployed to all environments  

### 1.3 Quick Architecture

```
┌─────────────────────┐
│   Git Repository    │
│  (config-repo)      │
│                     │
│ acv-validation-*    │
│ api-connector-*     │
│ database-service-*  │
└──────────┬──────────┘
           │ Pull configuration
           │
       ┌───↓────────────────────────────┐
       │ Config Server (THIS SERVICE)    │
       │                                 │
       │ ░░ Spring Cloud Config Server░░ │
       │ ░░ REST API endpoints        ░░ │
       │ ░░ Git backend               ░░ │
       └────────┬──────────────────────┘
                │ Configuration API
        ┌───────┼───────┬──────────┐
        │       │       │          │
    ┌───↓──┐ ┌──↓──┐ ┌──↓──┐ ┌────↓────┐
    │Valid │ │ API │ │ DB  │ │Database │
    │Serv  │ │Conn │ │ Svc │ │Service  │
    │      │ │     │ │     │ │         │
    └──────┘ └─────┘ └─────┘ └─────────┘
    
All services fetch config from central server on startup
```

---

## 2. Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Language** | Java | 21 LTS | Application runtime |
| **Framework** | Spring Boot | 3.3.2 | Application framework |
| **Config Server** | Spring Cloud Config | 2023.0.3 | Configuration management |
| **Build Tool** | Maven | 3.8.1+ | Dependency management & build |
| **Container** | Docker | Latest | Containerization |
| **Orchestration** | Kubernetes | 1.26+ | Container deployment |
| **Configuration Storage** | Git | 2.36+ | Version-controlled config repository |
| **Monitoring** | Prometheus | Latest | Metrics collection |
| **Network** | Traefik Ingress | Latest | Kubernetes ingress controller |
| **Secret Management** | Azure Key Vault | N/A | Store deploy keys, passwords |

---

## 3. Repository Structure

```
eai-3540813-config-server/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/fedex/acv/config/
│   │   │       └── AcvConfigServerApplication.java    (Main app, @EnableConfigServer)
│   │   │
│   │   └── resources/
│   │       └── application.yml                         (Config server configuration)
│   │
│   └── test/
│       └── java/
│           └── com/fedex/acv/config/
│               └── AcvConfigServerApplicationTests.java
│
├── helm-releases/
│   ├── nonprod-dev.yaml                 (Development Helm values)
│   ├── nonprod-test.yaml                (Test Helm values)
│   └── prod.yaml                        (Production Helm values)
│
├── .github/
│   └── workflows/                       (GitHub Actions CI/CD)
│
├── pom.xml                              (Maven dependencies)
├── mvnw, mvnw.cmd                       (Maven wrapper)
├── cicd-maven-settings.xml              (CI/CD Maven configuration)
└── README.md
```

---

## 4. Key Features

### 4.1 Git Backend Integration

- **Repository URL:** `git@github.com:FedEx/eai-3540813-config-repo.git`
- **Default Branch:** `main`
- **Authentication:** SSH key stored in Azure Key Vault (accessed via `${DEPLOY_KEY}`)
- **Search Paths:** `*` (searches all directories in repo)
- **Cloning:** On-demand (not on startup)

### 4.2 REST API Endpoints

Config Server exposes these endpoints:

```
GET  /config-repo/{service}/{profile}              # Get JSON properties
GET  /config-repo/{service}/{profile}.yml          # Get YAML
GET  /config-repo/{service}/{profile}.properties   # Get properties file
POST /actuator/refresh                             # Trigger refresh
GET  /actuator/health                              # Health check
GET  /actuator/metrics                             # Metrics
GET  /actuator/prometheus                          # Prometheus export
```

### 4.3 Management & Monitoring

- **Management Port:** 8081 (separate from application)
- **Health Endpoint:** Available at all profiles
- **Metrics:** Prometheus format for Grafana visualization
- **Authentication:** Basic Auth for production, open for dev/test

---

## 5. Quick Start

### 5.1 Build Locally

```bash
# 1. Clone repository
git clone https://github.com/FedEx/eai-3540813-config-server.git
cd eai-3540813-config-server

# 2. Build with Maven
mvn clean package

# Output appears in: target/libs/eai-3540813-config-server-1.1.2.jar
```

### 5.2 Run Locally

```bash
# 1. Set Git private key (for SSH authentication)
export DEPLOY_KEY=$(cat ~/.ssh/id_rsa)

# 2. Run Spring Boot application
mvn spring-boot:run

# 3. Application starts on http://localhost:8080
#    Management on http://localhost:8081

# 4. Test endpoint
curl http://localhost:8080/config-repo/acv-validation-services/dev
```

### 5.3 Docker Build & Run

```bash
# 1. Build Docker image
docker build -t acv-config-server:1.1.2 .

# 2. Run container with environment variable
docker run -e DEPLOY_KEY="$(cat ~/.ssh/id_rsa)" \
  -p 8080:8080 \
  -p 8081:8081 \
  acv-config-server:1.1.2

# 3. Test
curl http://localhost:8080/config-repo/acv-validation-services/dev
```

### 5.4 Deploy to Kubernetes

```bash
# 1. Create namespace (if needed)
kubectl create namespace config-server

# 2. Deploy using Helm
helm install config-server ./helm-chart \
  -f helm-releases/prod.yaml \
  -n config-server

# 3. Verify deployment
kubectl get pods -n config-server
kubectl logs -f deployment/config-server -n config-server

# 4. Access via ingress
curl https://acv-config-server.fxi-prod.com/acv/config/config-repo/...
```

---

## 6. Configuration Files

### 6.1 application.yml (Main Configuration)

**Location:** `src/main/resources/application.yml`

**Key Settings:**
```yaml
spring:
  application.name: config-server           # Service ID
  
  cloud.config.server.git:
    uri: git@github.com:FedEx/...config-repo.git  # Git repository
    defaultLabel: main                       # Git branch
    privateKey: ${DEPLOY_KEY}               # SSH key from Key Vault

management:
  server.port: 8081                         # Management endpoint port
  endpoints.web.exposure.include: '*'       # Expose all endpoints
  metrics.export.prometheus.enabled: true   # Enable Prometheus metrics
```

### 6.2 Helm Values (Environment Configurations)

#### Development: `helm-releases/nonprod-dev.yaml`
- **Replicas:** 1
- **Resources:** 0.5 CPU, 2Gi memory (request), 1 CPU, 4Gi (limit)
- **Management Port:** 8081
- **Actuator:** All endpoints exposed
- **Git Branch:** main (development)

#### Production: `helm-releases/prod.yaml`
- **Replicas:** 1
- **Resources:** 0.5 CPU, 2Gi memory (request), 1 CPU, 4Gi (limit)
- **Service Monitor:** Enabled (Prometheus scraping)
- **Ingress:** Internal (fxi-prod cluster)
- **Monitoring:** Dynatrace injection enabled
- **Authentication:** Basic Auth required

---

## 7. Key Dependencies

| Dependency | Version | Purpose |
|-----------|---------|---------|
| spring-cloud-config-server | 2023.0.3 | Core config server functionality |
| spring-boot-starter-actuator | 3.3.2 | Health checks, metrics, monitoring |
| spring-boot-starter-web | 3.3.2 | REST endpoints, HTTP handling |
| micrometer-registry-prometheus | Latest | Metrics export for Prometheus |
| junit-jupiter | Latest | Unit testing framework |

---

## 8. Documentation Map

```
README.md (YOU ARE HERE)
├── HLD.md ........................... Architecture & design patterns
├── LLD.md ........................... Implementation details & code structure
├── services.md ...................... API endpoints & contracts
├── code-mapping.md .................. File navigation & class inventory
├── glossary.md ...................... Terminology & concepts
└── onboarding.md .................... Developer setup & workflows
```

---

## 9. Key Concepts

### Configuration Server
Centralized service providing configuration to client applications via REST API. Fetches config files from Git repository.

### Git Backend
Strategy storing configuration as version-controlled YAML files in Git instead of database. Enables history and rollback.

### Config Client
Application service (e.g., validation-services) that retrieves its configuration from Config Server at startup.

### Property Source
Individual configuration source (Git YAML file, environment variable, system property). Multiple sources merged in priority order.

### Active Profile
Configuration variant (dev, test, prod) selected at runtime. Services load profile-specific configurations.

---

## 10. Common URLs & Paths

### Local Development
```
Application:    http://localhost:8080
Management:     http://localhost:8081
Health Check:   http://localhost:8081/actuator/health
Metrics:        http://localhost:8081/actuator/metrics
Prometheus:     http://localhost:8081/actuator/prometheus
Config Fetch:   http://localhost:8080/config-repo/acv-validation-services/dev
```

### Production (AKS)
```
Ingress:        https://acv-config-server.fxi-001-eastus2.fxi-prod.az.fxei.fedex.com/acv/config
Config Fetch:   https://acv-config-server.../acv/config/config-repo/acv-validation-services/prod
Health:         https://acv-config-server.../acv/config/actuator/health
Port (HTTP):    8080
Port (Mgmt):    8081
```

---

## 11. Getting Started

**New to this project?** Start here:

1. **Read [onboarding.md](onboarding.md)** — Local setup & first steps
2. **Read [HLD.md](HLD.md)** — Understanding the architecture
3. **Read [services.md](services.md)** — Available endpoints
4. **Read [code-mapping.md](code-mapping.md)** — Code navigation
5. **Check [glossary.md](glossary.md)** — Definitions & concepts

**Quick Links:**
- [Spring Cloud Config Reference](https://cloud.spring.io/spring-cloud-config/reference/html/)
- [Git Repository (config-repo)](https://github.com/FedEx/eai-3540813-config-repo)
- [Configuration Repository Documentation](../acv-config-repo/README.md)

---

## 12. Support & Contacts

**For Help:**
- Slack: `#config-management` channel
- Documentation: See [onboarding.md](onboarding.md) FAQ
- Issues: Create GitHub issue in this repository

**Escalations:**
- Production incidents: Contact platform engineering team
- Configuration issues: Ping config-management team

---

## Cross-References

- [Configuration Repository Documentation](../acv-config-repo/README.md) — Config files served by this server
- [ACV Validation Engine](../acv-validation-engine/README.md) — Consumer of configuration
- [API Connector Service](../acv-api-connector/README.md) — Consumer of configuration

---

**Last Updated:** 2026-04-02  
**Version:** 1.1.2  
**Audience:** Developers, DevOps Engineers, Platform Team
