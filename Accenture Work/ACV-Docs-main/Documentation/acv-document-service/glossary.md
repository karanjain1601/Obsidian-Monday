# Glossary & Terminology — ACV Document Service

## Business Domain Terms

| Term | Definition |
|------|---|
| **Document** | A generated output artifact (PDF, HTML) created from a template and transactional data |
| **Template** | A reusable document structure with placeholders (Thymeleaf format) for dynamic content |
| **Section** | A reusable chunk of template HTML (header, body, footer) composed into full templates |
| **Locale** | Language and regional code (en_US, de_DE, fr_FR) affecting content and formatting |
| **Country Code** | ISO 3166-1 alpha-2 code (US, IN, DE, GB) routing to locale-specific templates |
| **Transaction ID** | Unique identifier linking document generation to a business transaction |
| **Document Code** | Named template identifier (e.g., COMPLIANCE_REPORT, AUDIT_CERTIFICATE) |
| **Blob** | Azure Blob Storage object (file) persisting generated documents |
| **Upload Path** | Hierarchical directory structure in Blob Storage (e.g., `/documents/2024/04/02/`) |
| **Template Rendering** | Process of substituting data into template placeholders (Thymeleaf engine) |
| **Ad-Hoc Document** | Document generated without persisting to storage (preview or one-time generation) |
| **Document Preview** | Draft view before commit; not persisted to Blob Storage |

---

## Technical Acronyms

| Acronym | Meaning |
|---------|---------|
| **PDF** | Portable Document Format |
| **HTML** | Hypertext Markup Language |
| **REST** | Representational State Transfer (API design pattern) |
| **JWT** | JSON Web Token (OAuth2 bearer token format) |
| **OAuth2** | Open Authorization 2.0 (authentication framework) |
| **TLS** | Transport Layer Security (HTTPS encryption) |
| **XML** | Extensible Markup Language |
| **JSON** | JavaScript Object Notation |
| **IaC** | Infrastructure as Code (Terraform, Helm) |
| **HPA** | Horizontal Pod Autoscaler (Kubernetes scaling) |
| **PII** | Personally Identifiable Information (masked in logs) |
| **WREG** | WREG signing algorithm (from acv-commons HTTP client) |
| **CORS** | Cross-Origin Resource Sharing |
| **mTLS** | mutual TLS (client and server certificates) |

---

## Service Integration Terms

| Term | Definition | Related Service |
|------|---|---|
| **Data Service** | Backend service providing transactional data (applicant, compliance info) | `data-services` |
| **Commons Library** | Shared utilities: HTTP client, caching, Event Hub, OAuth2 | `acv-commons` |
| **Config Server** | Centralized configuration management | `config-server` |
| **Scheduler Service** | Job orchestration for batch document generation | `scheduler-service` |
| **Event Hub** | Azure Event Hubs for async document generation events | Azure infrastructure |
| **Blob Storage** | Azure Storage Accounts for document persistence | Azure infrastructure |

---

## Configuration & Environment Terms

| Term | Definition | Example |
|---|---|---|
| **Application Profile** | Spring Boot active profile (dev, test, prod, local) | `spring.profiles.active=dev` |
| **Connection String** | Azure credential for Blob Storage access | `DefaultEndpointsProtocol=https;...` |
| **Container Name** | Blob Storage logical grouping | `documents` |
| **Template Repository** | URL or path for template source | `/config/templates/` |
| **Okta Tenant** | OAuth2 provider domain | `https://tenant.okta.com` |
| **Client ID / Secret** | OAuth2 application credentials | (stored in Azure Key Vault) |
| **Locale Cascade** | Fallback chain for missing locales | `en_IN` → `en_US` → error |

---

## Thymeleaf & Template Terms

| Term | Definition | Syntax Example |
|---|---|---|
| **Expression** | Dynamic placeholder for data substitution | `${applicantName}` |
| **Conditional** | Template logic for conditional rendering | `<div th:if="${status=='PASSED}">` |
| **Loop** | Iteration over collections | `<tr th:each="item : ${items}">` |
| **Natural Template** | HTML that works with and without Thymeleaf | `<p th:text="'Default'>` |
| **Fragment** | Reusable template piece | `<th:block th:fragment="header">` |
| **Dialect** | Thymeleaf extension (Standard Dialect adds `th:*` attributes) | `th:text`, `th:if`, `th:each` |

---

## Architecture & Deployment Terms

| Term | Definition |
|---|---|
| **Microservice** | Independently deployable service (this document service) |
| **Sidecar** | Companion container (logging, metrics) in pod |
| **Service Mesh** | Istio/Linkerd for inter-pod communication management |
| **Namespace** | Kubernetes logical isolation (dev, test, prod namespaces) |
| **ConfigMap** | Kubernetes object storing non-secret config data |
| **Secret** | Kubernetes object storing sensitive data (connection strings, API keys) |
| **Helm Chart** | Package for Kubernetes deployment (templates + values) |
| **Helm Release** | Deployed instance of a Helm chart in an environment |
| **Pod** | Smallest deployable Kubernetes unit (typically 1 container) |
| **Replicas** | Number of pod copies (for scale/redundancy) |
| **Health Probe** | Liveness/Readiness check (is service healthy?) |
| **Resource Quota** | CPU/memory limits per pod |
| **Ingress** | Kubernetes entry point for external traffic |
| **Load Balancer** | Distributes traffic across replicas |

---

## Acronyms by Team/Role

| Acronym | Meaning | Role |
|---------|---------|------|
| **DevOps** | Development Operations (infrastructure, CI/CD) | Platform team |
| **RBAC** | Role-Based Access Control (Kubernetes permissions) | Platform team |
| **QA** | Quality Assurance (testing, validation) | Test team |
| **SME** | Subject Matter Expert (domain specialist) | Business team |
| **SLA** | Service Level Agreement (uptime, latency targets) | Operations |
| **RTO** | Recovery Time Objective (downtime tolerance) | Disaster recovery |
| **RPO** | Recovery Point Objective (data loss tolerance) | Disaster recovery |

---

## Related Documentation

- [HLD.md](HLD.md) — Architecture and system design
- [LLD.md](LLD.md) — Code-level class and package structure
- [services.md](services.md) — REST API endpoint contracts
- [code-mapping.md](code-mapping.md) — Class inventory and dependency graph

---

**Last Updated:** April 2, 2026  
**Version:** 1.0
