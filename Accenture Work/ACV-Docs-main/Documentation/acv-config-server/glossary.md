# ACV Configuration Server - Glossary & Terminology

**Purpose:** Define key terminology, concepts, and acronyms.

**Scope:** 60+ terms covering configuration management, Spring Boot, Kubernetes, and AWS/Azure services.

---

## Configuration Management

### Configuration Server
Service that centralizes configuration management for microservices. Provides REST endpoints serving configuration to client services. Uses Git as backend for version control and audit trail.

**Related:** Config Client, Spring Cloud Config Server, Git Backend

### Config Client
Microservice application that consumes configuration from a Config Server. Fetches configuration at startup; can refresh properties at runtime without restart.

**Related:** Configuration Server, bootstrap.yml, @RefreshScope

### Git Backend
Strategy storing configuration files in Git repository. Config Server clones repository and reads YAML files on demand. Enables version control, branching, and rollback.

**Related:** Git Repository, Version Control, Rollback

### Property Source
Single origin of configuration (e.g., YAML file, environment variable, system property). Spring merges multiple sources with defined precedence order.

**Related:** Configuration Precedence, Environment Variable, Spring Environment

### Property Resolution
Process of merging multiple property sources in priority order to produce final configuration. Spring resolves each property name through sources until finding a match.

**Precedence:**
1. System Properties (`-Dkey=value`)
2. Environment Variables
3. Config Server (Git YAML)
4. application.yml locally
5. application-{profile}.yml

---

## Spring Cloud Config

### Spring Cloud Config Server
Spring framework pattern for externalized configuration management. Provides client-server architecture for configuration distribution. Supports Git backend, profiles, and encryption.

**Related:** Spring Cloud, Microservices, Configuration Externalization

### Spring Cloud Config Client
Client-side library enabling microservices to connect to Config Server on startup. Responsible for fetching and binding configuration properties.

**Related:** Config Client, bootstrap.yml, Property Binding

### bootstrap.yml
Special Spring Boot configuration file loaded FIRST (before application.yml). Contains Config Server connection details (URI, service name, profiles).

**Location:** `src/main/resources/bootstrap.yml`

**Related:** application.yml, Spring Cloud Config Client, Configuration Load Order

### @EnableConfigServer
Annotation enabling Spring Cloud Config Server functionality. Auto-configures 80+ components including REST endpoints, Git backend, property sources.

**Usage:**
```java
@EnableConfigServer
@SpringBootApplication
public class ConfigServerApplication { }
```

**Related:** Spring Cloud Config Server, Auto-Configuration, Annotations

---

## Git & Version Control

### Git Repository
Distributed version control system storing configuration files. Config Server fetches and caches files from repository. All configuration changes tracked with author, timestamp, commit message.

**Related:** Version Control, Commit, Branch, Tag

### Git Branch
Named version of repository tracking independent development. Config Server typically fetches from "main" branch. Can fetch from feature branches or tags via `{label}` parameter.

**Default:** main (previously master)

**Related:** Git Repository, Git Tag, Merge

### Git SSH Key
Private SSH key used for authenticating to Git repository. Stored in Azure Key Vault; injected into Config Server pod at runtime as ${DEPLOY_KEY} environment variable.

**Security:** Private key never exposed in logs or configuration files

**Related:** Key Vault, SSH Authentication, Secret Management

### Git Webhook
HTTP callback triggered when code is pushed to repository. Can notify Config Server to refresh; enables automatic configuration propagation.

**Use:** Optional; Config Server can also poll Git for changes

**Related:** Git Repository, Automatic Refresh, Event-Driven

### Commit
Single atomic change captured in Git history. Each commit includes author, timestamp, message, and changed files. enables rollback and audit trail.

**Related:** Git Repository, Version Control, Message

### Rollback
Reverting configuration to previous state via Git. Executed with `git revert` to create new commit undoing changes. Services refresh with old configuration values.

**Related:** Git Repository, Configuration History

---

## Spring Boot Concepts

### Spring Boot
Opinionated framework simplifying Spring application development. Provides auto-configuration, embedded servers, production-ready features out of the box.

**Version in ACV:** 3.3.2

**Related:** Spring Framework, Auto-Configuration, Starter Dependencies

### @SpringBootApplication
Composite annotation combining @Configuration, @EnableAutoConfiguration, @ComponentScan. Enables Spring component scanning and auto-configuration.

**Related:** Spring Boot, Annotations

### Auto-Configuration
Spring Boot feature automatically configuring Spring application based on classpath dependencies. Enables applications to work with minimal configuration.

**Example:** Presence of spring-cloud-config-server JAR triggers Config Server auto-configuration

**Related:** Spring Boot, @EnableConfigServer

### Actuator
Spring Boot component providing operational endpoints for monitoring: health checks, metrics, environment inspection, graceful shutdown.

**Endpoints:** /actuator/health, /actuator/metrics, /actuator/prometheus, /actuator/env

**Related:** Management Endpoints, Micrometer, Monitoring

### Management Endpoints
Actuator endpoints providing operational visibility and control. Can be selectively exposed based on security requirements.

**Examples:**
- Health: /actuator/health (readiness/liveness)
- Metrics: /actuator/metrics, /actuator/prometheus
- Environment: /actuator/env
- Shutdown: /actuator/shutdown

**Related:** Actuator, Monitoring, Operational Concerns

### Embedded Server
Web server (Tomcat by default) packaged inside JAR. No separate server installation needed; application runs standalone.

**Related:** Tomcat, Spring Boot, Deployment

---

## HTTP & REST

### REST (Representational State Transfer)
Architectural style for distributed systems using HTTP methods (GET, POST, PUT, DELETE) operating on resources identified by URLs.

**Benefits:** Standard, scalable, language-independent, cacheable

**Related:** HTTP, API Design, Microservices

### HTTP Methods (for Config Server)
| Method | Purpose | Usage |
|--------|---------|-------|
| GET | Retrieve resource | Fetch configuration |
| POST | Create resource | Trigger refresh endpoint |

**Related:** REST, HTTP Protocol

### HTTP Status Codes (Config Server)
| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Configuration fetched successfully |
| 404 | Not Found | Configuration file not found |
| 500 | Server Error | Git/SSH connection failure |
| 503 | Service Unavailable | Config Server unreachable |

---

## Monitoring & Observability

### Metrics
Quantitative measurements of system behavior: request counts, latency, CPU usage, memory consumption. Collected by micrometer; exported to monitoring systems.

**Examples:**
- http.server.requests (endpoint metrics)
- jvm.memory.used (memory consumption)
- process.cpu.usage (CPU percentage)

**Related:** Micrometer, Prometheus, Observability

### Micrometer
Metrics collection facade abstracting monitoring system implementations. Collects metrics; sends to backends (Prometheus, InfluxDB, CloudWatch, etc.).

**Related:** Metrics, Prometheus, Observability

### Prometheus
Time-series metrics database and monitoring system. Scrapes /actuator/prometheus endpoint; stores metrics; enables dashboards and alerting.

**Related:** Metrics, Micrometer, Grafana, Observability

### Health Check
Endpoint verifying service is running and dependencies accessible. Includes: livenessProbe (process alive), readinessProbe (ready for traffic).

**Endpoints:**
- /actuator/health (overall)
- /actuator/health/liveness (Kubernetes liveness)
- /actuator/health/readiness (Kubernetes readiness)

**Related:** Liveness Probe, Readiness Probe, Kubernetes

### Liveness Probe
Kubernetes probe checking if process is alive. If fails repeatedly, Kubernetes restarts pod. Recovers from deadlocks/hangs.

**Endpoint:** /actuator/health/liveness

**Related:** Health Check, Readiness Probe

### Readiness Probe  
Kubernetes probe checking if pod ready to accept traffic. If fails, Kubernetes removes pod from load balancer. Prevents traffic to unhealthy instances.

**Endpoint:** /actuator/health/readiness

**Related:** Health Check, Liveness Probe

---

## Kubernetes & Deployment

### Kubernetes (K8s)
Container orchestration platform managing containerized applications. Automates deployment, scaling, self-healing, and networking for containers.

**Related:** Container, Pod, Deployment, Service

### Pod
Smallest deployable unit in Kubernetes. Single or multiple containers running together. Config Server runs as container inside pod.

**Related:** Kubernetes, Container, Deployment

### Deployment
Kubernetes resource describing desired state for pods: image, replicas, environment variables, resource limits. Declaratively declares what should run.

**Related:** Kubernetes, Pod, StatefulSet

### Service
Kubernetes resource exposing pods internally/externally. Provides stable IP and DNS name; load balances traffic across pod replicas.

**Types:** ClusterIP (internal), NodePort (node-level), LoadBalancer (cloud), Ingress (HTTP routing)

**Related:** Kubernetes, Networking, Load Balancing

### Ingress
Kubernetes resource routing external HTTP/HTTPS traffic to services. Enables custom hostnames, paths, TLS termination, rate limiting.

**Related:** Kubernetes, Service, Networking

### Namespace
Kubernetes logical isolation boundary. Resources (pods, services, configs) scoped to namespaces. Multiple tenants can share cluster via namespaces.

**Related:** Kubernetes, RBAC, Multi-tenancy

### StatefulSet
Kubernetes resource for stateful applications requiring stable pod identities and persistent storage. Config Server typically uses Deployment (stateless).

**Related:** Kubernetes, Deployment, Stateful Applications

---

## Container & Docker

### Docker
Container platform packaging applications with dependencies into standardized images. Config Server runs as Docker container inside Kubernetes pod.

**Related:** Container, Image, Container Registry

### Container
Lightweight, isolated environment running application and dependencies. Includes: OS libraries, runtime, application code, configuration.

**Related:** Docker, Virtual Machine, Microservices

### Container Image
Standalone package containing application code, dependencies, runtime, and metadata. Docker image used to create running containers.

**Related:** Docker, Container, Registry

### Container Registry
Repository storing container images. Config Server image pushed to Azure Container Registry (ACR) during CI/CD build.

**Related:** Docker, Container Image, CI/CD

---

## Azure Services

### Azure Key Vault
Azure service for secure storage of secrets: API keys, passwords, SSH keys, certificates. Config Server retrieves deploy key from Key Vault.

**Usage:** Environment variables injected from Key Vault into Kubernetes pods

**Related:** Secret Management, Azure, Security

### Azure Kubernetes Service (AKS)
Managed Kubernetes cluster in Azure. Runs Config Server pods; manages scaling, networking, storage abstractions.

**Related:** Kubernetes, Azure, Container Orchestration

### Azure Container Registry (ACR)
Registry storing Docker images in Azure. Config Server image pushed via CI/CD pipeline; pods pull image from ACR at deployment.

**Related:** Container Registry, Docker, CI/CD, Azure

---

## CI/CD & Build

### CI/CD (Continuous Integration/Continuous Deployment)
Automated pipeline: code push → build → test → deploy. GitHub Actions runs workflows compiling, testing, and pushing Config Server to production.

**Related:** Automation, GitHub Actions, Deployment Pipeline

### GitHub Actions
GitHub's CI/CD platform running workflows on code events (push, pull request). Builds Config Server JAR; runs tests; pushes image to ACR; deploys to AKS.

**Related:** CI/CD, Automation, GitHub

### Helm
Kubernetes package manager for templating and deploying applications. Config Server deployed via Helm charts with environment-specific values files.

**Related:** Kubernetes, Deployment Template, Package Manager

### Helm Chart
Templated Kubernetes manifests with variables (values). Config Server chart deployed to dev/test/prod with different values files.

**Related:** Helm, Kubernetes, Deployment

### Helm Release
Deployed instance of Helm chart. "config-server-prod" is Helm release of Config Server chart in production namespace.

**Related:** Helm, Chart, Deployment

---

## Security

### SSH (Secure Shell)
Cryptographic network protocol for secure remote access and authentication. Config Server uses SSH to authenticate to GitHub private repository.

**Authentication:** SSH private key (stored in Key Vault)

**Related:** Security, Encryption, Git SSH Key

### SSL/TLS (Secure Sockets Layer/Transport Layer Security)
Encryption protocols for secure communication over networks. Config Server serves HTTPS (TLS 1.2+) in production.

**Related:** Encryption, Security, HTTPS

### HTTPS
HTTP over TLS encryption. Config Server ingress routes traffic via HTTPS; protects configuration in transit.

**Related:** HTTP, TLS, SSL, Security

### Authentication
Verifying identity (who are you?). Config Server uses Basic Auth (username:password) in production to authenticate clients.

**Related:** Authorization, Security, Basic Auth

### Authorization
Verifying permissions (what can you do?). Kubernetes RBAC controls which roles can access Config Server endpoints.

**Related:** Authentication, Security, RBAC

### Secret Management
Secure handling of sensitive values (passwords, API keys) not stored in code. Config Server deploy key stored in Key Vault; injected as environment variable.

**Best Practice:** Never hardcode secrets; store in external secret manager

**Related:** Key Vault, Environment Variable, Security

---

## Performance & Scalability

### Caching
Storing frequently accessed data in-memory for fast retrieval. Config Server caches Git YAML files to reduce repeated Git access; improves latency.

**TTL (Time-to-Live):** Usually 5-10 minutes; expires after this duration

**Related:** Performance, Memory, Git Access

### Latency
Time delay between request and response. Config Server aims for <100ms p50, <500ms p99 latencies for configuration distribution.

**Related:** Performance, Response Time

### Throughput
Number of requests handled per unit time. Config Server targets 1000 req/sec handling capability.

**Related:** Performance, Scalability

### Load Balancing
Distributing requests across multiple instances. Kubernetes Service distributes client requests across Config Server pod replicas (if >1).

**Related:** Scaling, High Availability, Kubernetes

---

## Acronyms & Abbreviations

| Acronym | Full Form | Context |
|---------|-----------|---------|
| **ACV** | Automated Compliance Validation | Platform name |
| **ACR** | Azure Container Registry | Azure service for images |
| **AKS** | Azure Kubernetes Service | Azure managed Kubernetes |
| **API** | Application Programming Interface | Service endpoints |
| **AVRO** | Apache Avro | Serialization (not used in config server) |
| **CI/CD** | Continuous Integration/Deployment | Automation |
| **DTL** | Destination Time Limit | (Not used in config server) |
| **GCR** | Google Container Registry | Alternative image registry |
| **Git** | Version control system | Git (not acronym) |
| **HTTP** | HyperText Transfer Protocol | Web protocol |
| **HTTPS** | HTTP Secure | Encrypted web protocol |
| **JVM** | Java Virtual Machine | Java runtime |
| **K8s** | Kubernetes | Container orchestration (8 letters = K8s) |
| **RBAC** | Role-Based Access Control | Authorization mechanism |
| **REST** | Representational State Transfer | API architecture |
| **SSH** | Secure Shell | Secure protocol, Git auth |
| **SSL** | Secure Sockets Layer | Encryption protocol (superseded by TLS) |
| **TLS** | Transport Layer Security | Encryption protocol |
| **YAML** | YAML Ain't Markup Language | Configuration format |
| **YML** | YAML (alternative extension) | .yml file extension |

---

## Cross-References

- [README.md](README.md) — Project overview
- [HLD.md](HLD.md) — Architecture context
- [LLD.md](LLD.md) — Implementation details
- [services.md](services.md) — API reference
- [code-mapping.md](code-mapping.md) — Code structure

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** All team members
