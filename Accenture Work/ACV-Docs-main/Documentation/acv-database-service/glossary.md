# ACV Database Service - Terminology & Concepts Glossary

**Purpose:** Define domain-specific terms, acronyms, and concepts used throughout the platform.

**Scope:** Database, Spring Framework, Flyway, infrastructure, and operations terminology.

---

## A

**Alternative Key** — Database column marked UNIQUE but not the primary key. Example: `config_key` in `acv_config` table.

**Auto-Commit** — JDBC setting where each SQL statement automatically commits without explicit `COMMIT` call. Default: true in HikariCP.

**Auto-Configuration** — Spring Boot feature automatically configuring beans based on classpath and properties. Enabled via `@EnableAutoConfiguration` or `@SpringBootApplication`.

**Azure Cosmos DB** — Microsoft's globally-distributed NoSQL database. Not used in ACV Database Service (PostgreSQL used instead).

---

## B

**Baseline** — Flyway concept representing manually-created schema that predates Flyway migrations. Baseline version (default 0) marks the starting point; all migrations after baseline are applied automatically.

**Baselineadds** — Setting `baselineOnMigrate=true` instructs Flyway to create `flyway_schema_history` table and baseline version if missing.

**Bean** — Spring Framework object instantiated, assembled, and managed by Spring container. Example: DataSource bean.

**Bean Lifecycle** — Sequence of Spring container actions: instantiation → dependency injection → @PostConstruct → use → @PreDestroy.

**BLOB** — Binary Large Object; database column type for storing large binary data (images, files, etc.).

**Boolean** — Data type representing true/false value. SQL: `BOOLEAN`. Java: `boolean` or `Boolean`.

---

## C

**Cascade** — JPA setting controlling behavior when parent entity is deleted (cascade delete, cascade persist, etc.).

**Column** — Vertical division in database table; represents a single attribute/field. Example: `id`, `config_key`, `created_at`.

**Component Scan** — Spring feature scanning classpath for @Component, @Service, @Repository, @Configuration annotated classes. Auto-configured via @SpringBootApplication.

**Configuration Class** — Java class annotated @Configuration providing Spring beans via @Bean methods.

**Configuration Properties** — Key-value pairs defining application behavior. Source: application.properties, environment variables, or command-line arguments.

**ConfigurationProperties** — Spring annotation (@ConfigurationProperties) binding configuration file properties to Java class fields. Example: `@ConfigurationProperties("spring.datasource.acv")`.

**Connection** — Active JDBC connection to database; obtained from connection pool.

**Connection Pool** — Cache of reusable database connections. HikariCP maintains pool in ACV Database Service.

**Connection Pooling** — Technique of reusing existing connections instead of creating new ones per request. Dramatically improves performance.

**Connection String** — JDBC URL specifying database location and connection details. Example: `jdbc:h2:mem:acv-db` or `jdbc:postgresql://host:5432/db`.

**Connection Timeout** — Maximum time application waits for idle connection from pool before raising exception. Default: 30 seconds.

**Constraint** — Database rule enforcing data integrity. Types: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK.

**CRUD** — Create, Read, Update, Delete. Basic data operations.

**Cursor** — Database concept representing result set iteration; allows fetching rows one at a time.

---

## D

**DAO** — Data Access Object. Design pattern abstracting database access logic. Spring Data JPA repositories implement DAO pattern.

**Database Migration** — Versioned script (SQL or Java) applying schema changes to database. Flyway executes migrations automatically.

**DataSource** — JDBC interface representing connection factory. Implemented by HikariCP; provides pooled connections.

**DataSourceBuilder** — Spring utility class building DataSource instances from DataSourceProperties.

**DataSourceProperties** — Spring class binding `spring.datasource.*` configuration to Java fields.

**DDL** — Data Definition Language. SQL commands: CREATE TABLE, ALTER TABLE, DROP TABLE, etc.

**Dependency Injection** — Design pattern where dependencies provided to class at runtime (via constructor, setter, or field injection) rather than class creating them.

**Dependency Graph** — Visualization showing relationships between classes/modules. Example: A depends-on B, B depends-on C.

**Digest** — Hash or checksum of data used for integrity verification. Flyway stores script checksum.

**Disconnection** — Closing existing database connection.

**DML** — Data Manipulation Language. SQL commands: INSERT, UPDATE, DELETE, SELECT.

**DSL** — Domain Specific Language. Example: Spring Data method names (findByConfigKey) form a DSL for queries.

**Dual-Datasource** — Application maintaining two DataSource beans for different databases. ACV uses H2 and PostgreSQL via dual datasources.

---

## E

**Entity** — JPA-annotated class representing database table row. Example: @Entity public class ConfigEntity.

**EntityManager** — JPA interface managing entity persistence operations (create, read, update, delete).

**ER Diagram** — Entity-Relationship Diagram; visual representation of database tables and relationships.

**Exception** — Error condition in code. Checked (must catch) or unchecked (optional to catch).

---

## F

**Field** — Java class variable/attribute. Mapped to database column via JPA annotations.

**Flyway** — Database migration tool automatically versioning and applying schema changes. Core tool in ACV Database Service.

**flyway_schema_history** — Table Flyway creates tracking applied migrations, versions, timestamps, execution status.

**Foreign Key** — Database constraint referencing primary key of another table; ensures referential integrity.

**Framework** — Software library providing architecture/structure for building applications. Example: Spring Boot.

---

## G

**Getter/Setter** — Java methods accessing/modifying object fields. Convention: getFieldName(), setFieldName().

**Groovy** — JVM language supporting both OO and functional programming. Optional for Flyway migrations.

**Gradle** — Build tool alternative to Maven. Not used in ACV (Maven used).

---

## H

**HikariCP** — High-performance JDBC connection pool. Default in Spring Boot 2.0+; used in ACV Database Service.

**Hibernate** — ORM framework for Java; underlying engine for Spring Data JPA.

**Host** — Server address/hostname where database runs. Example: `db.example.com` or `localhost`.

**Hostname** — DNS name or IP address of server machine.

---

## I

**Idle Connection** — Database connection not currently in use but held in pool for reuse.

**Idle Timeout** — Time after which HikariCP closes idle connections to recycle them. Default: 10 minutes.

**Index** — Database structure speeding up query lookups on specific columns. Example: INDEX idx_config_key ON acv_config(config_key).

**Injection** — See Dependency Injection.

**Interface** — Java contract defining method signatures; classes implement interfaces.

**Initialization** — Process of setting up object/system into ready state.

---

## J

**Java** — Programming language; version 21 LTS used in ACV Database Service.

**JDBC** — Java Database Connectivity; Java API for database access. Lower-level than JPA.

**JdbcTemplate** — Spring class simplifying JDBC operations; abstracting boilerplate code.

**JPA** — Java Persistence API; specification for ORM frameworks (Hibernate implements JPA).

**JSON** — JavaScript Object Notation; data format for APIs and configuration.

---

## K

**Kubernetes** — Container orchestration platform; ACV deployments run in Azure Kubernetes Service (AKS).

**Key** — Unique identifier for database record (Primary Key, or other unique column).

---

## L

**Lazy Loading** — JPA strategy deferring entity relationship loading until accessed.

**Liquibase** — Database migration tool alternative to Flyway. Not used in ACV (Flyway used).

**Liveness** — Kubernetes probe checking if pod process is running and responsive.

---

## M

**Maven** — Build tool managing dependencies, compilation, testing, packaging.

**Metadata** — Data about data. Example: table names, column types, constraints.

**Microservice** — Small, focused service handling one business capability; ACV platform consists of multiple microservices.

**Micrometer** — Metrics library; provides observability for Spring Boot applications.

**Migration** — See Database Migration.

**Mutable** — Object that can be changed after creation. Most Java objects are mutable.

---

## N

**Named Query** — Predefined SQL/JPQL query given explicit name for reuse.

**Namespace** — Kubernetes concept isolating resources; database-service runs in its own namespace.

**Non-Functional Requirement** — Requirement specifying system properties (performance, reliability) rather than specific features.

**NoSQL** — Non-relational database without fixed schema; not used in ACV Database Service (PostgreSQL is relational).

**NOT NULL** — Database constraint requiring column value always present (never null).

---

## O

**OWASP** — Open Web Application Security Project; security vulnerability top 10.

**ORM** — Object-Relational Mapping; technique mapping Java objects to database tables.

---

## P

**Parameter** — Input to function/method. Example: migrateFlyway(DataSource dataSource) takes DataSource parameter.

**Password** — Secret credential used for database authentication.

**Performance Budget** — Target metrics for system performance (latency, throughput, error rate).

**Pod** — Kubernetes smallest deployable unit; contains one or more containers.

**Port** — Network endpoint for communication. HTTP: 8080, Management: 8081 in ACV.

**Prepared Statement** — Pre-compiled SQL statement preventing SQL injection attacks.

**Primary Key** — Column(s) uniquely identifying each table row. Cannot be null or duplicate.

**Probe** — Kubernetes health check (liveness, readiness).

**Profile** — Spring concept activating specific configurations for environment (local, dev, test, prod).

**Property** — Configuration key-value pair. Example: spring.datasource.acv.url.

**Property Source** — Origin of configuration values: properties files, environment variables, command-line args.

---

## Q

**Query** — Database SELECT statement retrieving data.

**Queue** — Structure holding waiting requests. Connection pool queues requests when no idle connections available.

---

## R

**Readiness** — Kubernetes probe checking if service ready to accept traffic.

**Record** — Single row in database table.

**Referential Integrity** — Database constraint ensuring foreign key references valid primary key.

**Repository** — Pattern abstracting data access; Spring Data provides repository implementations.

**Repository Pattern** — DAO variant where repositories handle all database operations for specific entity.

**Retry** — Attempting operation multiple times on failure. Important for transient errors.

**Rollback** — Undoing database transaction on error; reverting to previous state.

**Row** — Single record/entry in database table.

---

## S

**Schema** — Database structure defining tables, columns, constraints, indexes.

**Schema Versioning** — Tracking database schema changes with version numbers (V1_0, V1_1).

**Script** — SQL file containing data definition or manipulation statements.

**SELECT** — SQL query retrieving data from table(s).

**SQL** — Structured Query Language; standard for database operations.

**SQLite3** — Lightweight relational database; not used in ACV (H2 and PostgreSQL used).

**SSL/TLS** — Encryption protocols for secure network communication.

**Statement** — Executable SQL command; prepared or unprepared.

**Statement Execution Time** — Duration taken to execute SQL statement; metric in Flyway schema history.

**String** — Text data type. SQL: VARCHAR. Java: String.

---

## T

**Table** — Database structure organized as rows and columns; fundamental storage unit.

**Timestamp** — Date and time value recorded with timezone. SQL: TIMESTAMP.

**Transaction** — Atomic database operation; either completely succeeds or completely fails (no partial updates).

**Transactional** — Spring annotation indicating method operates within database transaction.

**Type** — Data type. Primitive (int, boolean, float) or Object (String, LocalDateTime).

---

## U

**UNIQUE** — Database constraint ensuring no duplicate values in column(s).

**Username** — Account identifier for database authentication.

---

## V

**Validation** — Checking data correctness before database operations.

**VARCHAR** — Variable-length character (text) column type. Example: VARCHAR(255).

**Version** — Migration version number following format V{major}.{minor}.

**Version Control** — System (Git) tracking changes to source code including SQL migrations.

---

## W

**Web Service** — Service providing functionality over network (HTTP/REST).

---

## Y

**YAML** — Human-readable data format often used for configuration. Not used in ACV Database Service (properties files used).

---

## Z

**Zone** — Kubernetes availability zone or geographic region for deployment.

---

## Acronyms Reference

| Acronym | Meaning | Context |
|---------|---------|---------|
| **ACL** | Access Control List | Security/permissions |
| **ACV** | Automated Compliance Validation | ACV platform domain |
| **API** | Application Programming Interface | Service contracts |
| **ASCII** | American Standard Code for Information Interchange | Character encoding |
| **AZF** | Azure Functions | Serverless computing |
| **AKS** | Azure Kubernetes Service | Cloud platform for ACV |
| **BLOB** | Binary Large Object | Database column type |
| **BSON** | Binary JSON | Data format (not used in ACV) |
| **CD** | Continuous Deployment | DevOps pipeline |
| **CI** | Continuous Integration | DevOps pipeline |
| **CLOB** | Character Large Object | Database column type (text) |
| **CPU** | Central Processing Unit | Compute resource |
| **CRUD** | Create, Read, Update, Delete | Basic operations |
| **DAO** | Data Access Object | Design pattern |
| **DDL** | Data Definition Language | SQL commands |
| **DML** | Data Manipulation Language | SQL commands |
| **DNS** | Domain Name System | Network service |
| **DSL** | Domain Specific Language | Language for specific domain |
| **DTO** | Data Transfer Object | Object for API transfer |
| **EL** | Expression Language | Template language |
| **ER** | Entity Relationship | Database diagram type |
| **ETL** | Extract, Transform, Load | Data pipeline |
| **GC** | Garbage Collection | JVM memory management |
| **GUI** | Graphical User Interface | UI type |
| **HPA** | Horizontal Pod Autoscaler | Kubernetes scaling |
| **HTTP** | Hypertext Transfer Protocol | Web protocol |
| **HTTPS** | HTTP Secure | Encrypted web protocol |
| **JDBC** | Java Database Connectivity | Java DB API |
| **JDK** | Java Developer Kit | Java runtime environment |
| **JPA** | Java Persistence API | ORM specification |
| **JSON** | JavaScript Object Notation | Data format |
| **JWT** | JSON Web Token | Authentication token |
| **JVM** | Java Virtual Machine | Java runtime |
| **K8s** | Kubernetes | Container orchestration |
| **LB** | Load Balancer | Network component |
| **LDAP** | Lightweight Directory Access Protocol | Identity service |
| **LTS** | Long-Term Support | Software version |
| **m-service** | Microservice | Small focused service |
| **MQ** | Message Queue | Async messaging |
| **mTLS** | mutual TLS | Certificate-based auth |
| **MVP** | Minimum Viable Product | Initial release |
| **N/A** | Not Applicable | Not relevant |
| **NoSQL** | Non-SQL Database | Non-relational DB |
| **OWASP** | Open Web Application Security | Security organization |
| **P2P** | Peer-to-Peer | Distributed networking |
| **RBAC** | Role-Based Access Control | Authorization model |
| **RCA** | Root Cause Analysis | Problem investigation |
| **REST** | Representational State Transfer | API architecture |
| **ROI** | Return on Investment | Business metric |
| **RTO** | Recovery Time Objective | Disaster recovery target |
| **SAAS** | Software as a Service | Cloud delivery model |
| **SLA** | Service Level Agreement | Availability commitment |
| **SQL** | Structured Query Language | Database language |
| **SRE** | Site Reliability Engineer | Operations specialist |
| **SSL** | Secure Sockets Layer | Encryption protocol |
| **SVM** | Support Vector Machine | ML algorithm |
| **TCP** | Transmission Control Protocol | Network protocol |
| **TLS** | Transport Layer Security | Encryption protocol |
| **TTL** | Time To Live | Cache expiration |
| **UDP** | User Datagram Protocol | Network protocol |
| **UI** | User Interface | Presentation layer |
| **URL** | Uniform Resource Locator | Web address |
| **UUID** | Universally Unique Identifier | Unique identifier |
| **YAML** | YAML Ain't Markup Language | Configuration format |
| **XSD** | XML Schema Definition | Schema language |

---

## Cross-References

- [README.md](README.md) — Project overview
- [HLD.md](HLD.md) — Architecture & concepts
- [LLD.md](LLD.md) — Implementation details
- [onboarding.md](onboarding.md) — Terminology in practice

---

**Last Updated:** 2026-04-02  
**Version:** 1.0.0  
**Audience:** All Team Members, New Engineers, Stakeholders
