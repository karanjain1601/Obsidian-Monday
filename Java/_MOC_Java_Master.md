---
title: "Java Knowledge Vault — Master MOC"
tags: [Java, MOC, MasterIndex, Backend, Enterprise]
domain: Java
created: 2026-07-26
status: active
type: MOC
---

# ☕ Java Knowledge Vault — Master MOC

> A comprehensive 50-section, 5-part Java engineering vault spanning fundamentals through enterprise architecture. Cross-linked with [[_MOC_SystemDesign_Master]], [[_MOC_Database_Master]], and [[_MOC_DSA_Master]].

---

## Vault Architecture

```mermaid
graph TD
    MASTER["☕ Java Master MOC"]:::master

    MASTER --> P1["Part I\nCore Java\nSections 01–10"]:::part
    MASTER --> P2["Part II\nSpring & Enterprise\nSections 11–22"]:::part
    MASTER --> P3["Part III\nPlatform Engineering\nSections 23–32"]:::part
    MASTER --> P4["Part IV\nAdvanced Internals\nSections 33–40"]:::part
    MASTER --> P5["Part V\nArchitecture Leadership\nSections 41–50"]:::part

    P1 --> F1["01 Fundamentals"]:::node
    P1 --> F2["02 OOP"]:::node
    P1 --> F3["03 Collections"]:::node
    P1 --> F4["04 Generics"]:::node
    P1 --> F5["05 Exceptions"]:::node
    P1 --> F6["06 Streams & Functional"]:::node
    P1 --> F7["07 Concurrency"]:::node
    P1 --> F8["08 JVM Memory"]:::node
    P1 --> F9["09 I/O and NIO"]:::node
    P1 --> F10["10 Modern Java"]:::node

    P2 --> F11["11 Design Patterns"]:::node
    P2 --> F12["12 Testing"]:::node
    P2 --> F13["13 Spring Core"]:::node
    P2 --> F14["14 Spring Boot"]:::node
    P2 --> F15["15 Spring MVC/REST"]:::node
    P2 --> F16["16 Spring Persistence"]:::node
    P2 --> F17["17 Spring Security"]:::node
    P2 --> F18["18 Scheduling/Async/Messaging"]:::node
    P2 --> F19["19 Architecture/Microservices"]:::node
    P2 --> F20["20 System Design"]:::node
    P2 --> F21["21 Ecosystem Libraries"]:::node
    P2 --> F22["22 Engineering Leadership"]:::node

    P3 --> F23["23 Databases/SQL"]:::node
    P3 --> F24["24 DSA in Java"]:::node
    P3 --> F25["25 Caching"]:::node
    P3 --> F26["26 Reactive/WebFlux"]:::node
    P3 --> F27["27 Networking/APIs"]:::node
    P3 --> F28["28 App Security"]:::node
    P3 --> F29["29 Cloud/DevOps"]:::node
    P3 --> F30["30 Performance Engineering"]:::node
    P3 --> F31["31 Jakarta EE"]:::node
    P3 --> F32["32 Behavioral Interview"]:::node

    P4 --> F33["33 Kafka/Streaming"]:::node
    P4 --> F34["34 Distributed Systems"]:::node
    P4 --> F35["35 Advanced JVM"]:::node
    P4 --> F36["36 Advanced Concurrency"]:::node
    P4 --> F37["37 GraalVM/Native"]:::node
    P4 --> F38["38 Advanced Spring"]:::node
    P4 --> F39["39 Observability/SRE"]:::node
    P4 --> F40["40 Data-Intensive Apps"]:::node

    P5 --> F41["41 Architecture Fundamentals"]:::node
    P5 --> F42["42 Architecture Documentation"]:::node
    P5 --> F43["43 Team Topologies"]:::node
    P5 --> F44["44 Legacy Modernization"]:::node
    P5 --> F45["45 Multi-Tenancy/SaaS"]:::node
    P5 --> F46["46 Disaster Recovery/BC"]:::node
    P5 --> F47["47 Security Architecture"]:::node
    P5 --> F48["48 Compliance/Governance"]:::node
    P5 --> F49["49 FinOps/Cost Engineering"]:::node
    P5 --> F50["50 Enterprise Integration"]:::node

    classDef master fill:#FF6B35,stroke:#CC4400,color:#fff,font-weight:bold
    classDef part fill:#2D6A4F,stroke:#1B4332,color:#fff
    classDef node fill:#52B788,stroke:#2D6A4F,color:#fff
```

---

## All 50 Sections

| # | Section Name | Key Topics |
|---|---|---|
| 01 | Fundamentals | JVM, Types, Primitives, Strings, Equality, Operators |
| 02 | OOP | Classes, Inheritance, Polymorphism, Encapsulation, Abstraction, Interfaces |
| 03 | Collections | List, Set, Map, Queue, Iterator, Complexity, Thread-safe |
| 04 | Generics | Type params, Wildcards, Bounds, Type erasure, PECS |
| 05 | Exceptions | Checked/Unchecked, Try-with-resources, Custom exceptions, Best practices |
| 06 | Streams & Functional | Lambda, Method refs, Stream pipeline, Optional, Collectors |
| 07 | Concurrency | Threads, Synchronization, Locks, Executors, CompletableFuture |
| 08 | JVM Memory | GC algorithms, Heap structure, Metaspace, Profiling, Tuning flags |
| 09 | I/O and NIO | InputStream/OutputStream, Reader/Writer, NIO Channels, Buffers, Selectors |
| 10 | Modern Java | Records, Sealed classes, Pattern matching, Text blocks, Switch expressions |
| 11 | Design Patterns | Creational, Structural, Behavioral, Java idiomatic implementations |
| 12 | Testing | JUnit 5, Mockito, AssertJ, TestContainers, TDD, BDD |
| 13 | Spring Core | IoC, DI, Bean lifecycle, AOP, ApplicationContext, Profiles |
| 14 | Spring Boot | Auto-configuration, Starters, Actuator, Properties, Externalized config |
| 15 | Spring MVC/REST | Controllers, Request mapping, REST best practices, OpenAPI, Error handling |
| 16 | Spring Persistence | JPA, Hibernate, Spring Data, JPQL, N+1, Transactions |
| 17 | Spring Security | Authentication, Authorization, OAuth2, JWT, CSRF, Method security |
| 18 | Scheduling/Async/Messaging | @Scheduled, @Async, RabbitMQ, Kafka integration, Spring Events |
| 19 | Architecture/Microservices | Service decomposition, API gateway, Service mesh, Saga, CQRS |
| 20 | System Design | Scalability, Load balancing, CDN, Distributed caching, CAP theorem |
| 21 | Ecosystem Libraries | Lombok, MapStruct, Jackson, Guava, Apache Commons, Resilience4j |
| 22 | Engineering Leadership | Code review, Architecture decision records, Mentoring, Tech debt |
| 23 | Databases/SQL | Postgres, MySQL, Indexing, Query optimization, Transactions, ACID |
| 24 | DSA in Java | Arrays, Linked lists, Trees, Graphs, Dynamic programming, Sorting |
| 25 | Caching | Redis, Caffeine, Cache patterns, Eviction, Cache-aside, Write-through |
| 26 | Reactive/WebFlux | Project Reactor, Mono/Flux, Backpressure, R2DBC, Reactive streams |
| 27 | Networking/APIs | HTTP/2, REST vs gRPC, GraphQL, WebSockets, API versioning |
| 28 | App Security | OWASP Top 10, Input validation, SQL injection, XSS, SSRF, Secrets mgmt |
| 29 | Cloud/DevOps | Docker, Kubernetes, Helm, CI/CD, GitHub Actions, Cloud providers |
| 30 | Performance Engineering | Profiling, Benchmarking (JMH), Async I/O, Connection pooling, GC tuning |
| 31 | Jakarta EE | Servlets, CDI, JPA, EJB, JAX-RS, Application servers |
| 32 | Behavioral Interview | STAR method, Leadership principles, Conflict resolution, System stories |
| 33 | Kafka/Streaming | Producers, Consumers, Topics, Partitions, Exactly-once, Kafka Streams |
| 34 | Distributed Systems | Consensus, Raft, Paxos, Distributed transactions, Eventual consistency |
| 35 | Advanced JVM | Bytecode engineering, Class file structure, JVM flags, JVMTI |
| 36 | Advanced Concurrency | Phaser, StampedLock, VarHandle, Lock-free, Memory model, Happens-before |
| 37 | GraalVM/Native | AOT compilation, Native image, Substrate VM, Micronaut, Quarkus |
| 38 | Advanced Spring | Custom starters, BeanFactoryPostProcessor, AOP internals, Spring internals |
| 39 | Observability/SRE | Micrometer, Prometheus, Grafana, Distributed tracing, OpenTelemetry, SLOs |
| 40 | Data-Intensive Apps | Batch processing, ETL, Spring Batch, Big data integration, Data pipelines |
| 41 | Architecture Fundamentals | SOLID, DDD, Hexagonal, Clean architecture, Architecture styles |
| 42 | Architecture Documentation | ADRs, C4 model, Arc42, Decision logs, Architecture fitness functions |
| 43 | Team Topologies | Platform teams, Stream-aligned teams, Conway's law, Cognitive load |
| 44 | Legacy Modernization | Strangler fig, Anti-corruption layer, Decomposition, Technical debt mgmt |
| 45 | Multi-Tenancy/SaaS | Tenant isolation, Schema-per-tenant, Row-level security, Feature flags |
| 46 | Disaster Recovery/BC | RTO/RPO, Backup strategies, Failover, Chaos engineering, Game days |
| 47 | Security Architecture | Zero trust, Defense in depth, Threat modeling, STRIDE, Security by design |
| 48 | Compliance/Governance | GDPR, SOC2, HIPAA, Audit logging, Data classification, Privacy by design |
| 49 | FinOps/Cost Engineering | Cloud cost optimization, Right-sizing, Spot instances, Cost attribution |
| 50 | Enterprise Integration | EIP patterns, ESB, Event-driven architecture, Integration testing, MuleSoft |

---

## Learning Paths

### 1. Backend Developer (6–8 weeks)
```
01 Fundamentals → 02 OOP → 03 Collections → 06 Streams → 07 Concurrency
→ 13 Spring Core → 14 Spring Boot → 15 Spring MVC → 16 Spring Persistence
→ 12 Testing → 21 Ecosystem Libraries → 05 Exceptions
```

### 2. Spring / Microservices Engineer (8–10 weeks)
```
13 Spring Core → 14 Spring Boot → 15 Spring MVC → 16 Persistence → 17 Security
→ 18 Scheduling/Messaging → 19 Microservices → 26 Reactive/WebFlux
→ 39 Observability → 29 Cloud/DevOps → 25 Caching
```

### 3. Enterprise Architect (10–12 weeks)
```
41 Architecture Fundamentals → 42 Documentation → 19 Microservices
→ 34 Distributed Systems → 43 Team Topologies → 44 Legacy Modernization
→ 45 Multi-Tenancy → 47 Security Architecture → 48 Compliance → 50 Enterprise Integration
```

### 4. Interview Preparation (4–6 weeks)
```
01 Fundamentals → 02 OOP → 03 Collections → 04 Generics → 07 Concurrency
→ 24 DSA in Java → 20 System Design → 11 Design Patterns → 32 Behavioral Interview
```

### 5. Performance / JVM Expert (8–10 weeks)
```
08 JVM Memory → 01 Fundamentals (JVM model) → 35 Advanced JVM
→ 36 Advanced Concurrency → 07 Concurrency → 30 Performance Engineering
→ 37 GraalVM/Native → 26 Reactive/WebFlux → 39 Observability
```

---

## Section MOC Index — Part I: Core Java

| MOC | Section | Status |
|-----|---------|--------|
| [[_MOC_Java_Fundamentals]] | 01 — Fundamentals | Active |
| [[_MOC_Java_OOP]] | 02 — OOP | Active |
| [[_MOC_Java_Collections]] | 03 — Collections | Active |
| [[_MOC_Java_Generics]] | 04 — Generics | Active |
| [[_MOC_Java_Exceptions]] | 05 — Exceptions | Active |
| [[_MOC_Streams_Functional]] | 06 — Streams & Functional | Active |
| [[_MOC_Java_Concurrency]] | 07 — Concurrency | Active |
| [[_MOC_JVM_Memory]] | 08 — JVM Memory | Active |
| [[_MOC_IO_NIO]] | 09 — I/O and NIO | Active |
| [[_MOC_Modern_Java]] | 10 — Modern Java | Active |
| [[_MOC_Design_Patterns]] | 11 — Design Patterns | Active |
| [[_MOC_Java_Testing]] | 12 — Testing | Active |

---

## Cross-Vault Links

| Vault | Relevance |
|-------|-----------|
| [[_MOC_SystemDesign_Master]] | Microservices, scalability patterns, distributed system design |
| [[_MOC_Database_Master]] | Postgres/MySQL deep dives, query optimization, transactions |
| [[_MOC_DSA_Master]] | Algorithm implementations in Java, complexity analysis |

---

## Quick Reference: Java Version Timeline

| Version | Year | Key Features |
|---------|------|-------------|
| Java 8 | 2014 | Lambdas, Streams, Optional, default methods, Date/Time API |
| Java 11 | 2018 | LTS; var in lambdas, HTTP Client, String methods |
| Java 17 | 2021 | LTS; Records, Sealed classes, Pattern matching instanceof |
| Java 21 | 2023 | LTS; Virtual threads (Loom), Record patterns, Sequenced collections |
| Java 25 | 2025 | LTS; Value objects (Valhalla preview), Primitive patterns |

---

*Created: 2026-07-26 | Domain: Java | Type: Master MOC*

#Java #MOC #MasterIndex #Backend #Enterprise
