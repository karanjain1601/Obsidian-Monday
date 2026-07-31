# ACV Configuration Portal UI - Glossary & Terminology

**Last Updated:** April 3, 2026

---

## Business Domain Terminology

### Compliance & Validation

| Term | Definition |
|------|-----------|
| **Automated Compliance Validation (ACV)** | Platform for automated validation, monitoring, and reporting of compliance requirements across multiple countries and business entities |
| **Compliance Validation** | Process of detecting whether business data meets predefined compliance rules and regulations |
| **Validation Rule** | A specific  business or regulatory requirement that must be verified (e.g., "Customer ID must match CustXXXXXX format") |
| **Validation Type** | Classification of validation rules (DATA_FORMAT_VALIDATION, MANDATORY_FIELD_CHECK, BUSINESS_RULE_CHECK) |
| **Validation Severity** | Impact level of a validation failure (ERROR=blocks compliance, WARNING=advisory) |
| **Validation Mapping** | Association between a specific document type and applicable validation rules in a given country |

### Documents & Configuration

| Term | Definition |
|------|-----------|
| **Document** | Business artifact that requires compliance verification (Customer Profile, Compliance Report) |
| **Document Code** | Unique identifier for a document type (e.g., CUST_PROFILE_SHEET) |
| **Document Type** | Classification of documents (CONTRACT, REPORT, CERTIFICATE, PROFILE) |
| **Document Template** | Reusable schema/format for generating documents with consistent structure |
| **Category / Category Set** | Hierarchical grouping of validation types or business rules |
| **Configuration** | Settings and rule mappings that define ACV behavior for a specific country/region |

### Geographic & Organizational

| Term | Definition |
|------|-----------|
| **Country Code** | ISO 3166-1 alpha-2 country identifier (e.g., IN=India, US=United States) |
| **Locale Code** | Language/region combination (e.g., en_US=English-United States, hi_IN=Hindi-India) |
| **Region** | Geographic area governed by common regulations (EMEA, APAC, Americas) |

### Users & Access

| Term | Definition |
|------|-----------|
| **End User** | System administrator or compliance officer who uses the configuration portal |
| **Role** | Set of permissions assigned to users (Admin, Compliance Officer, Operator) |
| **OAuth / Okta** | Third-party identity provider for secure user authentication |
| **Authentication** | Verification of user identity via credentials or SSO |
| **Authorization** | Verification that authenticated user has permission to access resources |
| **JWT Token** | JSON Web Token containing user identity used for API authentication |

---

## Technical Terminology

### Angular & Web Framework

| Term | Definition |
|------|-----------|
| **Angular** | Modern JavaScript framework for building single-page applications (SPAs) |
| **Component** | Reusable UI building block (class + template + styles) in Angular |
| **Module** | Container for related components, services, and directives |
| **Service** | Singleton class that encapsulates reusable business logic |
| **Dependency Injection (DI)** | Angular pattern for providing service instances to components |
| **Observable** | RxJS pattern for handling async operations (events, HTTP requests) |
| **Pipe** | Angular feature for transforming component data in templates (`| async`, `| translate`) |
| **Guard** | Protection mechanism for routes (e.g., `OktaAuthGuard` ensures user is authenticated) |
| **Interceptor** | Middleware that intercepts and modifies HTTP requests/responses |
| **Directive** | Instruction to DOM on how to render (e.g., `*ngIf`, `*ngFor`) |
| **Template** | HTML file containing dynamic expressions and Angular syntax |

### APIs & Communication

| Term | Definition |
|------|-----------|
| **API (Application Programming Interface)** | Contract for communication between frontend and backend |
| **REST (Representational State Transfer)** | Architectural style using HTTP methods (GET, POST, PUT, DELETE) |
| **HTTP Request** | Message from client (frontend) to server requesting action |
| **HTTP Response** | Message from server back to client with result data |
| **JSON (JavaScript Object Notation)** | Lightweight data format for API request/response bodies |
| **HTTP Status Code** | Numeric response code (200=success, 400=client error, 500=server error) |
| **Query Parameter** | Key-value pair in URL after `?` (e.g., `?countryCode=IN&isActive=true`) |
| **Request Body** | Payload containing data sent with POST/PUT requests |
| **Response Body** | Payload containing result data returned by server |
| **Rate Limiting** | Restriction on number of API requests per time period |

### Frontend Technologies

| Term | Definition |
|------|-----------|
| **TypeScript** | Superset of JavaScript with static type checking |
| **Single Page Application (SPA)** | Web app that dynamically updates content without full page reload |
| **Reactive Programming** | Programming paradigm based on asynchronous data streams (RxJS) |
| **Material Design** | Google design system for consistent, accessible UI |
| **AG Grid** | Enterprise-grade data grid component with sorting, filtering, pagination |
| **i18n (Internationalization)** | Support for multiple languages and locales |
| **ngx-translate** | Angular library for managing translations |
| **Lazy Loading** | Technique to load modules only when needed (reduces initial bundle size) |
| **Change Detection** | Angular mechanism to detect component state changes and update UI |
| **Zone.js** | Library managing Angular change detection zones |

### Build & Deployment

| Term | Definition |
|------|-----------|
| **Build** | Compilation process converting TypeScript/SCSS to optimized JavaScript/CSS |
| **Bundle** | Combined output file(s) from the build process |
| **Bundling** | Process of combining multiple files into fewer, optimized bundles |
| **Tree Shaking** | Removing unused code during build process |
| **Minification** | Process of removing unnecessary characters from code (whitespace, comments) |
| **Source Map** | Debug file mapping minified code back to original TypeScript source |
| **Output Hashing** | Appending content hash to filenames for cache busting |
| **Webpack** | Module bundler used by Angular CLI under the hood |
| **ng build** | Angular CLI command to compile application for deployment |
| **npm** | Node Package Manager for JavaScript dependency management |
| **Node.js** | JavaScript runtime environment for running JavaScript outside browser |

### DevOps & Infrastructure

| Term | Definition |
|------|-----------|
| **Docker** | Containerization technology for packaging applications |
| **Kubernetes (K8s)** | Container orchestration platform for managing deployed containers |
| **Helm** | Package manager for Kubernetes |
| **Azure** | Microsoft cloud platform providing compute, storage, database services |
| **Azure Kubernetes Service (AKS)** | Managed Kubernetes service on Azure |
| **Ingress** | Kubernetes object that manages HTTP/HTTPS routing into cluster |
| **Pod** | Smallest deployable unit in Kubernetes (contains one/more containers) |
| **Service** | Kubernetes abstraction for exposing pods within cluster |
| **StatefulSet** | Kubernetes resource for deploying stateful applications |
| **ConfigMap** | Kubernetes object for storing non-sensitive configuration |
| **Secret** | Kubernetes object for storing sensitive data (passwords, tokens) |
| **CI/CD** | Continuous Integration/Continuous Deployment automation pipeline |
| **GitHub Actions** | GitHub's workflow automation platform for CI/CD |

### Testing

| Term | Definition |
|------|-----------|
| **Unit Test** | Test that verifies individual component/service works correctly |
| **Integration Test** | Test that verifies multiple components work together |
| **End-to-End (E2E) Test** | Test simulating real user interactions |
| **Test Coverage** | Percentage of code lines executed during testing |
| **Jasmine** | JavaScript testing framework used by Angular |
| **Karma** | Test runner for executing tests in real browsers |
| **Mock** | Object that simulates real dependency for testing |
| **Stub** | Simplified version of function/service for testing |
| **Spy** | Wrapper around function to track calls and return values |

---

## ACV Platform Services

| Service | Purpose | Port |
|---------|---------|------|
| **Configuration Portal UI** | Web interface for managing ACV configurations | 4200 (dev) |
| **Data Service** | API for configuration, document, and validation data | 8095 |
| **Document Service** | API for document upload, download, generation | 8096 |
| **Scheduler Service** | API for scheduling batch validation jobs | 8097 |
| **Validation Engine** | Core validation rules processing | 8098 |
| **API Connector Service** | External API integration for data enrichment | 8099 |
| **Config Server** | Centralized configuration management | 8100 |
| **Database Service** | Data access layer and ORM | 8101 |
| **Okta Identity Provider** | Third-party authentication and authorization | Cloud |

---

## Data Model Terminology

### Entities

| Entity | Purpose |
|--------|---------|
| **CategorySet** | Grouping of related validation or business categories |
| **CategoryItem** | Individual category option |
| **DocumentRecord** | Document type and its metadata |
| **LocaleConfig** | Language/region configuration for a document |
| **ValidationTypeConfig** | Definition of a validation rule |
| **ValidationConfigMapping** | Link between document and validation rule for specific country |
| **DashboardMetrics** | Aggregated compliance and performance metrics |

---

## HTTP Status Codes & Error Handling

| Code | Name | Meaning |
|------|------|---------|
| **200** | OK | Request succeeded |
| **201** | Created | Resource successfully created |
| **202** | Accepted | Request accepted for async processing |
| **400** | Bad Request | Invalid request parameters or body |
| **401** | Unauthorized | Missing or invalid authentication token |
| **403** | Forbidden | Authenticated user lacks permission |
| **404** | Not Found | Requested resource does not exist |
| **409** | Conflict | Resource state conflicts (duplicate, etc.) |
| **413** | Payload Too Large | Uploaded file exceeds size limit |
| **500** | Internal Server Error | Unexpected server error |
| **503** | Service Unavailable | Server temporarily unavailable |

---

## Feature Flags & Configuration Keys

| Key | Purpose | Values |
|-----|---------|--------|
| `enableMultiLanguage` | Support multiple languages | true/false |
| `enableDocumentUpload` | Allow document uploads | true/false |
| `maxUploadSizeGB` | Maximum file upload size | 1-50 |
| `apiTimeout` | HTTP request timeout in ms | 5000-30000 |
| `cacheTTL` | Cache time-to-live in seconds | 300-3600 |
| `pageSize` | Dashboard table rows per page | 10/25/50/100 |

---

## Common Acronyms

| Acronym | Expansion |
|---------|-----------|
| **ACV** | Automated Compliance Validation |
| **SSO** | Single Sign-On |
| **OAuth** | Open Authorization |
| **JWT** | JSON Web Token |
| **REST** | Representational State Transfer |
| **API** | Application Programming Interface |
| **CRUD** | Create, Read, Update, Delete |
| **HTTP** | Hypertext Transfer Protocol |
| **HTTPS** | HTTP Secure |
| **URL** | Uniform Resource Locator |
| **SPA** | Single Page Application |
| **DOM** | Document Object Model |
| **CDN** | Content Delivery Network |
| **HTTP** | HyperText Transfer Protocol |
| **TLS** | Transport Layer Security |
| **CORS** | Cross-Origin Resource Sharing |
| **CSP** | Content Security Policy |
| **HTML** | HyperText Markup Language |
| **CSS** | Cascading Style Sheets |
| **ES6/ES2015** | ECMAScript 2015 (JavaScript standard) |
| **NPM** | Node Package Manager |
| **LOC** | Lines of Code |
| **TTL** | Time To Live |
| **RTO** | Recovery Time Objective |
| **RPO** | Recovery Point Objective |
| **SLA** | Service Level Agreement |
| **KPI** | Key Performance Indicator |
| **RBAC** | Role-Based Access Control |
| **GDPR** | General Data Protection Regulation |
| **SOC 2** | System and Organization Controls 2 |
| **PII** | Personally Identifiable Information |
| **ISO** | International Organization for Standardization |
| **UUID** | Universally Unique Identifier |
| **ISO 8601** | Date/time format standard (e.g., 2026-04-03T10:30:00Z) |
| **AG Grid** | Advanced Grid library |
| **CDK** | Component Dev Kit (Angular) |
| **RxJS** | Reactive Extensions for JavaScript |
| **DI** | Dependency Injection |
| **E2E** | End-to-End testing |
| **MFA** | Multi-Factor Authentication |
| **IdP** | Identity Provider |

---

## Performance & Scalability Terminology

| Term | Definition |
|------|-----------|
| **Latency** | Time delay between sending request and receiving response |
| **Throughput** | Number of requests successfully processed per unit time |
| **Concurrency** | Number of simultaneous active connections/users |
| **Load** | Current system utilization (CPU, memory, network) |
| **Scaling** | Increasing system capacity to handle more load |
| **Horizontal Scaling** | Adding more servers/pods to distribute load |
| **Vertical Scaling** | Increasing CPU/memory of existing servers |
| **Auto-Scaling** | Automatically adding/removing servers based on metrics |
| **Performance Budget** | Upper limit on acceptable load/latency |
| **Cache Hit Ratio** | Percentage of requests served from cache |
| **Connection Pool** | Reusable set of database/HTTP connections |
| **Circuit Breaker** | Pattern to prevent cascading failures |

---

## Security Terminology

| Term | Definition |
|------|-----------|
| **Authentication** | Verifying user identity (who you are) |
| **Authorization** | Verifying user permissions (what you can do) |
| **Encryption** | Converting data to unreadable form using cryptographic key |
| **Decryption** | Converting encrypted data back to readable form |
| **Hashing** | One-way function producing fixed-size fingerprint |
| **Token** | Proof of authentication/authorization |
| **Token Expiry** | Time limit after which token becomes invalid |
| **Token Refresh** | Process of obtaining new token before expiry |
| **Rate Limiting** | Restricting number of requests to prevent abuse |
| **DDoS** | Distributed Denial of Service attack |
| **SQL Injection** | Attack exploiting database input validation |
| **XSS** | Cross-Site Scripting attack via malicious scripts |
| **CORS** | Cross-Origin Resource Sharing security policy |

---

## Development Lifecycle

| Term | Definition |
|------|-----------|
| **Requirements** | Specification of what system must do |
| **Design** | Architectural and implementation planning |
| **Development** | Writing code to implement design |
| **Testing** | Verifying code works per requirements |
| **Deployment** | Releasing code to production environment |
| **Maintenance** | Ongoing updates, bug fixes, support |
| **Sprint** | Time-boxed iteration in Agile development (typically 2 weeks) |
| **Release** | Version of software made available to users |
| **Patch** | Small release fixing specific issues |
| **Hot Fix** | Urgent patch deployed outside normal release cycle |

---

## References

- [Readme](README.md) — Project overview
- [HLD](HLD.md) — System architecture and design  
- [LLD](LLD.md) — Implementation and code structure
- [Services](services.md) — API specifications
- [Code Mapping](code-mapping.md) — Source code reference
- [Onboarding](onboarding.md) — Getting started guide

---

**Document Version:** 1.0  
**Total Entries:** 150+ terms and acronyms  
**Last Updated:** April 3, 2026
