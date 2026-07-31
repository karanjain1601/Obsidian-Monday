# ACV Document Service Documentation

## Project Overview

**ACV Document Service** is a Spring Boot microservice responsible for **document generation, template management, and document storage** for the Automated Compliance Validation (ACV) platform. It enables dynamic creation of documents (compliance reports, certificates, forms) from reusable templates with multi-language and multi-country support.

**Version:** 1.1.4  
**Technology Stack:** Java 21, Spring Boot 3.3.5, Maven, Thymeleaf, Azure Storage  
**Purpose:** Generate, manage, store, and retrieve compliance documents with version history

---

## Quick Start

### Build the Service

```bash
./mvnw clean package
```

### Run Locally

```bash
export SPRING_PROFILES_ACTIVE=local
./mvnw spring-boot:run
```

### Access APIs

- **Document API**: http://localhost:8080/api/v1/{countryCode}/documents/...
- **Template API**: http://localhost:8080/template/api/v1/{countryCode}/templates/...
- **Blob Storage API**: http://localhost:8080/blob/api/v1/storage/...
- **Swagger UI**: http://localhost:8080/swagger-ui.html

---

## Repository Structure

```
eai-3540813-acv-document-service/
├── README.md
├── pom.xml                              # Maven build configuration (Java 21, Spring Boot 3.3.5)
├── mvnw / mvnw.cmd                      # Maven wrapper scripts
├── cicd-maven-settings.xml              # CI/CD Maven configuration
├── helm-releases/
│   ├── nonprod-dev.yaml                 # Dev environment Helm values
│   ├── nonprod-test.yaml                # Test environment values
│   └── prod.yaml                        # Production Helm values
├── src/
│   ├── main/java/com/fedex/acv/document/
│   │   ├── AcvDocumentServiceApplication.java  # Main entry point
│   │   ├── config/                      # Spring configuration
│   │   │   ├── ApplicationConfiguration.java
│   │   │   ├── BlobStorageConfiguration.java
│   │   │   └── ...
│   │   ├── controllers/                 # REST endpoints
│   │   │   ├── DocumentManagementController.java
│   │   │   ├── TemplateManagementController.java
│   │   │   ├── BlobStorageController.java
│   │   │   └── ...
│   │   ├── services/                    # Business logic
│   │   │   ├── DocumentManagementService.java (interface)
│   │   │   ├── TemplateManagementService.java (interface)
│   │   │   ├── BlobStorageService.java (interface)
│   │   │   ├── DataApiService.java (interface)
│   │   │   └── impl/
│   │   │       ├── DocumentManagementServiceImpl.java
│   │   │       ├── TemplateManagementServiceImpl.java
│   │   │       ├── BlobStorageServiceImpl.java
│   │   │       └── DataApiServiceImpl.java
│   │   ├── domain/                      # Domain models & DTOs
│   │   │   ├── Document.java
│   │   │   ├── GenerateDocumentRequest.java
│   │   │   ├── DocumentPreviewResponse.java
│   │   │   ├── SectionConfig.java
│   │   │   └── ...
│   │   ├── exceptions/                  # Custom exceptions
│   │   │   └── DocumentServiceExceptionHandler.java
│   │   └── ...
│   └── test/java/                       # Unit and integration tests
└── target/                              # Maven build output
```

---

## Key Features

### 1. **Document Generation**
- Generate documents from reusable Thymeleaf templates
- Support for multiple document types (reports, certificates, forms)
- Multi-language template support (locales: en_US, de_DE, etc.)
- Multi-country support (country-specific document rules)
- Dynamic data binding from compliance checks

### 2. **Template Management**
- Create and manage document templates with sections
- Template versioning and rollback
- Section-based template composition (header, body, footer, etc.)
- Template search and discovery
- Locale-specific template overrides

### 3. **Blob Storage Integration**
- Upload documents to Azure Blob Storage
- Download documents with streaming support
- Delete documents with cleanup
- Document metadata tracking
- Automatic expiration and archival

### 4. **Document Lifecycle**
- **Generate**: Create document from template + data
- **Preview**: Generate preview before final storage
- **Download**: Retrieve generated documents
- **Archive**: Move old documents to cold storage
- **Cleanup**: Automatic document expiration

---

## Core Components

### Controllers (REST Endpoints)

| Controller | Endpoints | Purpose |
|-----------|-----------|---------|
| **DocumentManagementController** | POST `/api/v1/{countryCode}/documents/generate` | Generate document from template |
| | POST `/api/v1/{countryCode}/documents/generateAdhoc` | Generate ad-hoc document |
| | POST `/api/v1/{countryCode}/documents/download` | Download generated document |
| | POST `/api/v1/{countryCode}/documents/preview` | Preview document (PDF) |
| | GET `/api/v1/{countryCode}/{transactionId}/{uploadPath}/{fileName}` | Download by path |
| **TemplateManagementController** | GET `/template/api/v1/sections/_search` | Search templates |
| | POST `/template/api/v1/sections` | Create section |
| | POST `/template/api/v1/{countryCode}/templates` | Create template |
| | GET `/template/api/v1/{countryCode}/templates` | Get template details |
| | POST `/template/api/v1/{countryCode}/template_mappings` | Create template mapping |
| **BlobStorageController** | POST `/blob/api/v1/storage/upload` | Upload file |
| | GET `/blob/api/v1/storage/download/{fileName}` | Download file |
| | DELETE `/blob/api/v1/storage/delete/{fileName}` | Delete file |

### Services

| Service | Responsibility |
|---------|---|
| **DocumentManagementService** | Generate, preview, download documents; manage document lifecycle |
| **TemplateManagementService** | Create, update, search templates; manage template sections and mappings |
| **BlobStorageService** | Upload, download, delete documents from Azure Blob Storage |
| **DataApiService** | Fetch transactional data from Data Service for document generation |

---

## Technology Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| Java | 21 | Language |
| Spring Boot | 3.3.5 | Framework |
| Thymeleaf | Latest | Template engine for document generation |
| Azure Storage Blob | Latest | Document persistence |
| Spring Cloud Azure | 5.18.0 | Azure integration |
| Micrometer | Latest | Metrics and observability |
| Logstash Logback | Latest | Structured logging |

---

## Configuration Properties

```yaml
# Document Service Configuration
document:
  template:
    basePath: templates/                    # Template file path
    defaultLocale: en_US                    # Default locale
  storage:
    container: documents                    # Blob container name
    connectionString: ${AZURE_STORAGE_CONNECTION_STRING}
  cache:
    ttl: 3600                              # Cache TTL in seconds

# Azure Storage
azure:
  storage:
    blob:
      connection-string: ${AZURE_STORAGE_CONNECTION_STRING}
      container-name: documents

# Redis Caching
spring:
  redis:
    host: localhost
    port: 6379
    timeout: 60000

# Thymeleaf
spring:
  thymeleaf:
    enabled: false                         # Manually managed for document generation
    cache: true
    check-template: true
```

---

## Usage Examples

### 1. Generate a Document

```bash
curl -X POST http://localhost:8080/api/v1/US/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "documentCode": "COMPLIANCE_REPORT",
    "localeCode": "en_US",
    "transactionId": "550e8400-e29b-41d4-a716-446655440000",
    "data": {
      "applicantName": "John Doe",
      "complianceStatus": "PASSED",
      "checkDate": "2024-04-02"
    }
  }'
```

Response:
```json
{
  "documentId": "doc-uuid",
  "fileName": "compliance_report_550e8400.pdf",
  "uploadPath": "documents/2024/04",
  "generatedAt": "2024-04-02T10:30:00Z"
}
```

### 2. Preview Document

```bash
curl -X POST http://localhost:8080/api/v1/US/documents/preview \
  -H "Content-Type: application/json" \
  -d '{
    "documentCode": "COMPLIANCE_REPORT",
    "localeCode": "en_US",
    "data": {...}
  }' \
  -o preview.pdf
```

### 3. Download Document

```bash
curl -X POST http://localhost:8080/api/v1/US/documents/download \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "doc-uuid"
  }' \
  -o document.pdf
```

### 4. Upload File to Blob Storage

```bash
curl -X POST http://localhost:8080/blob/api/v1/storage/upload \
  -F "file=@/path/to/file.pdf" 
```

---

## Documentation Files

- [HLD.md](HLD.md) — High-level architecture, design decisions, business context
- [LLD.md](LLD.md) — Low-level code organization, class responsibilities, design patterns
- [architecture.md](architecture.md) — Deployment topology, Kubernetes config, scaling
- [services.md](services.md) — REST endpoint contracts, authentication flows
- [code-mapping.md](code-mapping.md) — Complete class-to-responsibility mapping
- [glossary.md](glossary.md) — Business terminology and technical acronyms
- [onboarding.md](onboarding.md) — Developer setup guide

---

## Integration with Other Services

Document Service integrates with:

| Service | Integration | Data Flow |
|---------|---|---|
| **acv-commons** | Shared utility library | HTTP clients, caching, security |
| **acv-services** | Core ACV service | Request document generation |
| **data-services** | Data layer | Fetch transactional data for documents |
| **acv-scheduler** | Job orchestration | Scheduled document batch generation |
| **Azure Storage** | Cloud storage | Persist generated documents |

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Thymeleaf Templates** | Industry-standard Java templating; supports complex logic; excellent Spring integration |
| **Locale-Aware Templates** | Enable multi-language support; comply with local regulations |
| **Section-Based Composition** | Reusable sections reduce template duplication; enable A/B testing |
| **Azure Blob Storage** | Scalable, cost-effective storage; built-in versioning and archival |
| **Caching Generated Documents** | Reduce template rendering latency; improve user experience |
| **Separate Preview & Generate** | Preview validates template before storage; generates draft before commit |

---

**Last Updated:** April 2, 2026  
**Documentation Version:** 1.0
