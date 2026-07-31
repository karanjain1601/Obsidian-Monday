# ACV Validation Engine - Glossary & Terminology

**Purpose:** Define all technical and business domain terms, acronyms, and concepts used in the ACV Validation Engine documentation and codebase.

---

## A

**Account Opening**  
The business process where a new customer/applicant applies to open an account with the organization. Requires multiple validations to ensure compliance and data accuracy.

**Additional Data (DTO)**  
Optional custom metadata passed in validation requests for contextual information. Allows validators to access supplementary data beyond source/destination.

**Address Validation**  
Business rule validation ensuring applicant-provided address matches expected format and postal code is valid.

**API Automation**  
Automated testing of REST API endpoints using frameworks like REST Assured or RestTemplate. The `eai-3540813-acv-api-automation` module.

**API Gateway**  
Entry point for all external requests to the microservice platform. Handles authentication, rate limiting, and request routing. Enforces mTLS for service-to-service calls.

**Authentication**  
Process of verifying the identity of a request caller. In Validation Engine: delegated to mTLS certificate validation at API Gateway level.

**Authorization**  
Process of determining what actions an authenticated caller is allowed to perform. In Validation Engine: all mTLS-validated requests are implicitly authorized.

---

## B

**Business Rule**  
A constraint or validation requirement defined by business stakeholders. Examples: credit score ≥ 700, entity type must be LLC/Corporation, date of birth before today.

**Batch Validation**  
Validating multiple records in a single request or asynchronously. Not currently supported; implemented as individual synchronous calls.

---

## C

**Confidence Score**  
Float value (0.0-1.0) indicating how confident the validation engine is in its result. Allows consumers (ACV Services) to make nuanced decisions (auto-approve if high, manual review if mid-range).

**Comparison Type**  
Algorithm used for validation: EXACT_MATCH, FUZZY_MATCH, NUMERIC_COMPARE, PREDEFINED_RULE, DATE_RANGE.

**Compliance**  
Adherence to regulatory requirements (PCI-DSS, SOC 2, etc.). Validation Engine ensures data accuracy per regulatory standards.

**Custom Metadata**  
Arbitrary key-value pairs passed in `additionalData` field for validator-specific context. Enables extensibility without API changes.

**Credit Bureau**  
Third-party service providing credit scores and financial history. Data assumed already fetched and provided in validation request.

---

## D

**Data Sanitization**  
Process of normalizing and cleaning input data before validation. Examples: lowercase, remove special characters, collapse spaces, parse date formats.

**Data Transfer Object (DTO)**  
Value object carrying data between layers (e.g., `ValidationDto` from controller → service).

**Destination Data**  
Reference/truth data for comparison. Usually from government records, company registry, or credit bureau. Provided in validation request.

**Domain**  
Business or technical subject matter. Examples: account opening domain, validation domain, compliance domain.

**Driver's License**  
Government-issued ID document. Used in ID_VALIDATION validator.

---

## E

**Enum**  
Java enumeration defining fixed set of values. Examples: `ValidationType`, `ComparisonType`, `StringOperator`.

**Entity**  
Business organization/entity being validated. Examples: Corporation, LLC, Partnership, Sole Proprietor.

**Entity Nature**  
Type/class of business entity (LLC, Corporation, S-Corporation, etc.). Validated via ENTITY_NATURE_VALIDATION validator.

**Enterprise Naming Convention**  
"eai-3540813-*" prefix used for all ACV services and repositories in the enterprise workspace.

**Exception Handling**  
Process of catching and handling errors gracefully. Validation Engine catches exceptions and returns appropriate error responses.

---

## F

**Factory Pattern**  
Design pattern for creating objects without specifying exact classes. Used in `ValidationFactory` to instantiate validators based on type.

**Fuzzy Matching**  
Approximate string matching allowing minor differences. Uses Levenshtein distance algorithm. Similarity = 1 - (distance / max_length).

**Fuzzy Distance (Levenshtein)**  
Edit distance between two strings (number of insertions, deletions, substitutions to transform one string to another). Example: distance("John", "Jon") = 1.

---

## G

**Glossary**  
List of terms with definitions. (This document!)

**Government Records**  
Reference data from government agencies (DMV, company registry, UCC filings). Assumed provided in validation request.

**Group Policy**  
Set of configuration rules applied to multiple instances or environments. Not directly used in Validation Engine.

---

## H

**Happy Path**  
Expected/success scenario in a validation workflow. Example: ID matches perfectly, confidence 1.0, validation passes.

**Hash**  
Irreversible transformation of data for integrity checking. Not used in Validation Engine.

**High-Level Design (HLD)**  
Architecture document describing major components, system context, business flows, and design decisions. See [HLD.md](HLD.md).

---

## I

**ID Validation**  
Validation type comparing applicant-provided ID (driver's license, passport) with government records ID.

**Idempotency**  
Property where repeated identical requests produce same result without side effects. `transId` serves as idempotency key.

**Idempotency Key**  
Unique identifier preventing duplicate processing. In Validation Engine: the `transId` field.

**Ingress Controller**  
Kubernetes component managing external access to services. Intercepts requests for routing and TLS termination.

**Integration Test**  
Test covering multiple components working together. Example: ValidationEngineController → GenericValidationServiceImpl → IdValidationServiceImpl.

**Interface**  
Java contract defining methods without implementation. Examples: `GenericValidationService`, `ValidationTypeInterface`, `SanitizationStrategy`.

**ISO-8601**  
Standard date format: YYYY-MM-DD. All dates normalized to this format by DateSanitization.

---

## J

**JSON**  
JavaScript Object Notation. Serialization format for HTTP request/response bodies.

**JSON Schema**  
Formal specification for JSON document structure. Defines what fields are required, their types, and constraints.

**JUnit**  
Java unit testing framework. Used for validator tests.

**JWT**  
JSON Web Token. Standard for representing claims as JSON. Not directly used in Validation Engine (auth delegated to API Gateway).

---

## K

**Key Person**  
Officer, director, or principal of a business organization. Validated via KEY_PERSON_VALIDATION validator.

---

## L

**Levenshtein Distance**  
Edit distance algorithm used for fuzzy string matching. See **Fuzzy Matching**.

**Legal Name**  
Officially registered business name. Validated via LEGAL_NAME_VALIDATION validator.

**Logging**  
Recording events (info, debug, error) to logs for debugging and auditing. Validation Engine logs all validation requests.

**Low-Level Design (LLD)**  
Detailed design document describing class structure, method signatures, data models, and execution flows. See [LLD.md](LLD.md).

---

## M

**Methodology**  
Systematic approach or process. Example: Factory pattern methodology for validator selection.

**Microservice**  
Small, independently deployable service. Validation Engine is a microservice in the ACV platform.

**Migration**  
Process of moving data or functionality. Example: migrating validation logic from embedded code to centralized engine.

**Mockito**  
Java mocking framework for unit testing. Creates mock objects for dependencies.

**mTLS (Mutual TLS)**  
Service-to-service authentication via mutual X.509 certificates. Enforced by Kubernetes service mesh.

---

## N

**Namespace**  
Kubernetes concept for virtual cluster isolation. Services deployed in namespaces (e.g., `acv-dev`, `acv-prod`).

**Non-Functional Requirement**  
Specification of how system should perform. Examples: latency < 500ms, 99.9% uptime, horizontal scalability.

---

## O

**Orchestration**  
Coordinating multiple services to achieve a business outcome. GenericValidationServiceImpl orchestrates sanitization → validation → response.

**Operator**  
Comparison operation. Examples: StringOperator (EQUALS, CONTAINS), NumericOperators (GT, LT, IN_RANGE).

---

## P

**Pattern**  
Reusable solution to common design problem. See [Design Patterns](LLD.md#3-design-patterns-used).

**Payload**  
Data transmitted in HTTP request or response body.

**Postal Code**  
ZIP code for address. Validated via ADDRESS_VALIDATION validator.

**Predefined Rule Validation**  
Validation comparing value against predefined whitelist/blacklist. Examples: entity type is in allowed list, status is ACTIVE.

**Primitive Validation**  
Core validation operation reused across multiple validators. Examples: FuzzyStringValidation, PredefinedRuleValidation.

**Principal**  
In security context: the authenticated entity making a request (e.g., user, service, certificate).

---

## Q

**Quarantine**  
Isolating suspicious or failed validation records for manual review.

---

## R

**Reference Data**  
Truth source data for comparison (government records, company registry). Provided in `destination` field of validation request.

**Regex (Regular Expression)**  
Pattern matching language. Used for validating email, phone, ZIP code formats.

**Repository**  
Git repository storing source code. Example: `eai-3540813-acv-validation-engine` repository.

**Request**  
HTTP POST message from client (ACV Services) to Validation Engine.

**Response**  
HTTP reply from Validation Engine back to client containing validation result.

**REST (Representational State Transfer)**  
Architectural style for building APIs using HTTP verbs (GET, POST, PUT, DELETE) and URIs.

**Rule Engine**  
Software component interpreting and executing business rules. Validation Engine is a specialized rule engine.

---

## S

**Sanitization**  
Data cleaning and normalization before processing. Examples: lowercase, remove special chars, parse dates.

**Schema**  
Structure defining format and constraints of structured data. JSON Schema defines request/response structure.

**Scope**  
Visibility and access of variables/objects. Example: `private` field has class scope.

**SLA (Service Level Agreement)**  
Contract specifying performance targets. Example: Validation Engine SLA: p99 latency < 500ms, 99.9% uptime.

**Source Data**  
Applicant-provided data being validated. Provided in `source` field of validation request.

**Spring Boot**  
Java framework for building standalone microservices. Validation Engine built on Spring Boot.

**Spring Component Scan**  
Mechanism where Spring automatically discovers @Component, @Service, @Controller classes and registers as beans.

**Sprint**  
Time-boxed development cycle (typically 2 weeks). Used for project planning and delivery tracking.

**State Machine**  
Model with states and transitions. Example: validation record states (PENDING → VALIDATED → APPROVED).

**Strategy Pattern**  
Design pattern encapsulating interchangeable algorithms. Each validator implements different strategy for validation.

**String Operator**  
Comparison operation on strings (EQUALS, CONTAINS, STARTSWITH, REGEX).

---

## T

**Thresholds**  
Cutoff values for validation decisions. Example: fuzzy match threshold 0.85 means similarity ≥ 0.85 passes.

**Trace/Tracing**  
Following request flow through system for debugging. `transId` enables end-to-end tracing.

**Transaction ID (transId)**  
Unique identifier for each validation request. Used for tracing and idempotency.

**Type Registration**  
Registration type of business (corporation, LLC, partnership). Validated via TYPE_REG_VALIDATION validator.

---

## U

**Unit Test**  
Test of single isolated component. Example: FuzzyStringValidationTest tests only FuzzyStringValidation class.

**Upstream**  
Service calling the Validation Engine. Example: ACV Services is upstream caller.

---

## V

**Validator**  
Component implementing specific validation logic. Examples: IdValidationServiceImpl, DateValidationImpl.

**Validation**  
Process of verifying data against business rules to determine if PASS or FAIL.

**Validation Config**  
Runtime configuration for validation (thresholds, comparison types, data types). Passed in request.

**Validation Factory**  
Component that instantiates appropriate validator based on validationType. See [Factory Pattern](LLD.md#pattern-1-factory-pattern).

**Validation Request**  
HTTP POST to /validate endpoint with source, destination, and configuration data.

**Validation Response**  
HTTP reply with boolean result, confidence score, and details.

**Validation Type**  
Category of validation (ID_VALIDATION, LEGAL_NAME_VALIDATION, DATE_VALIDATION, etc.).

**Validation TypeInterface**  
Java interface contract all validators implement.

---

## W

**Whitelist**  
List of allowed values. Example: allowed entity types (LLC, CORPORATION, S_CORP).

**Workflow**  
Sequence of steps to accomplish business process. Validation workflow: sanitize → validate → respond.

---

## X

**X.509**  
Standard for digital certificates used in mTLS authentication.

---

## Y

**YAML**  
Human-readable data serialization format. Used for application.yml configuration files and Kubernetes manifests.

---

## Z

**ZIP Code**  
Postal code (5 digits in US). Validated via ADDRESS_VALIDATION validator.

---

## Acronyms & Abbreviations

| Acronym | Expansion | Usage |
|---------|-----------|-------|
| **ACV** | Account Creation Validations | Platform name |
| **API** | Application Programming Interface | REST API |
| **CA** | Certificate Authority | Issues X.509 certificates  |
| **DAST** | Dynamic Application Security Testing | Security scanning |
| **DB** | Database | Data storage |
| **DTO** | Data Transfer Object | Request/response models |
| **ELK** | Elasticsearch, Logstash, Kibana | Log aggregation stack |
| **HLD** | High-Level Design | Architecture document |
| **HTTP** | HyperText Transfer Protocol | Communication protocol |
| **IaC** | Infrastructure as Code | Terraform, Helm, Bicep |
| **IDE** | Integrated Development Environment | VS Code, IntelliJ |
| **JWT** | JSON Web Token | Authentication token standard |
| **LLD** | Low-Level Design | Detailed design document |
| **mTLS** | Mutual Transport Layer Security | Service-to-service authentication |
| **OOP** | Object-Oriented Programming | Java programming paradigm |
| **P50/P99** | 50th/99th Percentile | Latency metrics |
| **PII** | Personally Identifiable Information | Sensitive personal data |
| **REST** | Representational State Transfer | API architectural style |
| **SLA** | Service Level Agreement | Performance contract |
| **SOLID** | Principles of OOP design | Single Responsibility, OpenClosed, Liskov, Interface, Dependency |
| **UUID** | Universally Unique Identifier | Format for transId |
| **VPN** | Virtual Private Network | Network encryption |
| **ZK** | Zero-Knowledge | Proof of knowledge without revealing secret |

---

## Validation Type Reference Matrix

| Type | Primary Field | Comparison | Confidence 1.0 | Confidence 0.0 |
|------|---------------|-----------|-----------------|-----------------|
| ID_VALIDATION | ID number | Exact/Fuzzy | Exact match | Complete mismatch |
| LEGAL_NAME_VALIDATION | Company name | Fuzzy | Identical after cleanup | Unrelated names |
| ENTITY_NAME_VALIDATION | Entity name | Fuzzy | Identical after cleanup | Unrelated names |
| ENTITY_NATURE_VALIDATION | Entity type | Predefined | In allowed list | Not in list |
| DATE_VALIDATION | Date | Range | Within range | Outside range |
| KEY_PERSON_VALIDATION | Person name | Fuzzy | Matches registry | No match in registry |
| CREDIT_VALIDATION | Credit score | Numeric | Score >> threshold | Score << threshold |
| ADDRESS_VALIDATION | Address | Format/Postal | Valid address | Invalid address |
| TYPE_REG_VALIDATION | Registration type | Predefined | In allowed list | Not in list |
| REC_STATUS_VALIDATION | Record status | Predefined | Status is ACTIVE | Status is INACTIVE |
| NAME_VALIDATION | Generic name | Fuzzy | Identical | Unrelated |
| OTHER_VALIDATION | Mixed | Mixed | Depends on logic | Depends on logic |

---

## Business Rules Summary

| Rule | Validator | Threshold | Action if FAIL |
|------|-----------|-----------|-----------------|
| ID must match govt records | ID_VALIDATION | 0.95 | Manual review |
| Company name must match registry | LEGAL_NAME_VALIDATION | 0.90 | Manual review |
| Entity type must be allowed | ENTITY_NATURE_VALIDATION | 1.0 (binary) | Reject |
| Birth/incorporation date in range | DATE_VALIDATION | 1.0 (binary) | Reject |
| Credit score ≥ 700 | CREDIT_VALIDATION | 700 | Manual review or reject |
| Address format valid | ADDRESS_VALIDATION | 1.0 (binary) | Request correction |
| Key person matches UCC filing | KEY_PERSON_VALIDATION | 0.85 | Manual review |
| Registration type allowed | TYPE_REG_VALIDATION | 1.0 (binary) | Reject |
| Record status is active | REC_STATUS_VALIDATION | 1.0 (binary) | Reject |

---

## Common Questions

**Q: What does "confidence" score mean?**  
A: A value 0.0-1.0 indicating how confident the validation engine is in its result. 1.0 = high confidence (pass), 0.0 = high confidence (fail), 0.5 = ambiguous (manual review). Consumed by ACV Services for nuanced decisions.

**Q: Why is sanitization needed?**  
A: Data sources format information differently (different cases, special characters, date formats). Sanitization normalizes all data to a common format before comparison, improving accuracy.

**Q: What is fuzzy matching?**  
A: Approximate string matching allowing minor differences (typos, abbreviations). Uses Levenshtein distance algorithm. Example: "John" fuzzy matches "Jon" if similarity ≥ threshold.

**Q: Can I add a new validation type?**  
A: Yes! Create new class implementing `ValidationTypeInterface`, implement `validate()` method, register in `ValidationFactory`, inject dependencies. No core engine changes needed.

**Q: Why is there a separate Config Server?**  
A: Externalizing configuration enables rule changes without redeploying the engine. Rules can be A/B tested or rolled back by changing config only.

---

## Related Documents

- [README.md](README.md) — Project overview and quick start
- [HLD.md](HLD.md) — Architecture and system design
- [LLD.md](LLD.md) — Code structure and implementations
- [services.md](services.md) — REST API contracts
- [code-mapping.md](code-mapping.md) — Class inventory

---

**Last Updated:** 2025-01-30  
**Version:** 1.1.4  
**Audience:** All stakeholders (developers, architects, product, operations)
