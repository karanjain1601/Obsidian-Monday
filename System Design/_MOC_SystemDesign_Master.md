---
title: "System Design — Master Map of Content"
tags: [MOC, SystemDesign, MasterMOC]
domain: SystemDesign
created: 2026-07-26
---

# 🏛️ System Design — Master Map of Content

> [!abstract] About This Vault
> Comprehensive system design knowledge base: ~140 notes across 28 sections covering fundamentals, distributed systems primitives, databases, caching, messaging, APIs, security, storage systems, data architecture, cloud design patterns, reliability patterns, and end-to-end case studies. Built for system design interviews and production architecture decisions.

## Vault Architecture

```mermaid
graph TD
    Master["🏛️ System Design Master"]

    %% Fundamentals — Blue
    Master --> S01["01 Introduction"]
    Master --> S02["02 Performance vs Scalability"]
    Master --> S03["03 Latency vs Throughput"]
    Master --> S04["04 Availability vs Consistency"]
    Master --> S05["05 Consistency Patterns"]

    %% Infrastructure — Green
    Master --> S06["06 Availability Patterns"]
    Master --> S07["07 Background Jobs"]
    Master --> S08["08 DNS"]
    Master --> S09["09 CDNs"]
    Master --> S10["10 Load Balancers"]
    Master --> S11["11 Application Layer"]
    Master --> S12["12 Databases"]
    Master --> S13["13 Caching"]

    %% Patterns and APIs — Orange
    Master --> S14["14 Asynchronism"]
    Master --> S15["15 Idempotent Operations"]
    Master --> S16["16 Communication"]
    Master --> S17["17 Performance Antipatterns"]
    Master --> S18["18 Monitoring"]
    Master --> S19["19 API Gateway"]

    %% Advanced — Red
    Master --> S20["20 Event-Driven Architecture"]
    Master --> S21["21 Search and Algorithms"]
    Master --> S22["22 Security"]
    Master --> S23["23 Case Studies"]

    %% Storage & Data — Purple
    Master --> S24["24 Distributed Systems Primitives"]
    Master --> S25["25 Storage Systems"]
    Master --> S26["26 Data Architecture"]

    %% Cloud Native Patterns — Teal
    Master --> S27["27 Cloud Design Patterns"]
    Master --> S28["28 Reliability Patterns"]

    style Master fill:#7c3aed,color:#fff
    style S01 fill:#2563eb,color:#fff
    style S02 fill:#2563eb,color:#fff
    style S03 fill:#2563eb,color:#fff
    style S04 fill:#2563eb,color:#fff
    style S05 fill:#2563eb,color:#fff
    style S06 fill:#059669,color:#fff
    style S07 fill:#059669,color:#fff
    style S08 fill:#059669,color:#fff
    style S09 fill:#059669,color:#fff
    style S10 fill:#059669,color:#fff
    style S11 fill:#059669,color:#fff
    style S12 fill:#059669,color:#fff
    style S13 fill:#059669,color:#fff
    style S14 fill:#d97706,color:#fff
    style S15 fill:#d97706,color:#fff
    style S16 fill:#d97706,color:#fff
    style S17 fill:#d97706,color:#fff
    style S18 fill:#d97706,color:#fff
    style S19 fill:#d97706,color:#fff
    style S20 fill:#dc2626,color:#fff
    style S21 fill:#dc2626,color:#fff
    style S22 fill:#dc2626,color:#fff
    style S23 fill:#dc2626,color:#fff
    style S24 fill:#7c3aed,color:#fff
    style S25 fill:#7c3aed,color:#fff
    style S26 fill:#7c3aed,color:#fff
    style S27 fill:#0891b2,color:#fff
    style S28 fill:#0891b2,color:#fff
```

## Sections at a Glance

| # | Section | Notes | Entry Point | Focus |
|---|---------|-------|-------------|-------|
| 01 | Introduction | 1 | [[_MOC_Introduction]] | The system design process and vocabulary |
| 02 | Performance vs Scalability | 1 | [[_MOC_PerformanceVsScalability]] | Vertical vs horizontal scaling trade-offs |
| 03 | Latency vs Throughput | 1 | [[_MOC_LatencyVsThroughput]] | Optimizing for speed vs volume |
| 04 | Availability vs Consistency | 2 | [[_MOC_AvailabilityVsConsistency]] | CAP theorem and its practical implications |
| 05 | Consistency Patterns | 1 | [[_MOC_ConsistencyPatterns]] | Strong, eventual, and weak consistency |
| 06 | Availability Patterns | 4 | [[_MOC_AvailabilityPatterns]] | Failover, replication, and nines of availability |
| 07 | Background Jobs | 3 | [[_MOC_BackgroundJobs]] | Async invocation strategies for background work |
| 08 | DNS | 1 | [[_MOC_DNS]] | Domain resolution and traffic routing via DNS |
| 09 | CDNs | 2 | [[_MOC_CDNs]] | Edge caching and push vs pull CDN strategies |
| 10 | Load Balancers | 5 | [[_MOC_LoadBalancers]] | Layer 4/7 balancing, algorithms, and reverse proxies |
| 11 | Application Layer | 3 | [[_MOC_ApplicationLayer]] | Microservices, service discovery, and the app tier |
| 12 | Databases | 11 | [[_MOC_Databases]] | SQL vs NoSQL, sharding, replication, federation |
| 13 | Caching | 10 | [[_MOC_Caching]] | Cache strategies, eviction, and all cache layers |
| 14 | Asynchronism | 4 | [[_MOC_Asynchronism]] | Message queues, task queues, and back pressure |
| 15 | Idempotent Operations | 1 | [[_MOC_IdempotentOperations]] | Retry-safe design for distributed systems |
| 16 | Communication | 10 | [[_MOC_Communication]] | HTTP, TCP/UDP, REST, gRPC, GraphQL, WebSockets |
| 17 | Performance Antipatterns | 9 | [[_MOC_PerformanceAntipatterns]] | Nine patterns that silently kill production performance |
| 18 | Monitoring | 6 | [[_MOC_Monitoring]] | Instrumentation, health/perf/usage metrics, alerts |
| 19 | API Gateway | 3 | [[_MOC_API_Gateway]] | Gateway routing, rate limiting, circuit breakers |
| 20 | Event-Driven Architecture | 5 | [[_MOC_EventDriven]] | Kafka, RabbitMQ, CQRS, Event Sourcing |
| 21 | Search and Algorithms | 5 | [[_MOC_SearchAlgorithms]] | Consistent hashing, Bloom filters, search indexes |
| 22 | Security | 4 | [[_MOC_Security]] | TLS, auth/authz, OAuth/JWT, API security |
| 23 | Case Studies | 5 | [[_MOC_CaseStudies]] | End-to-end interview-style design walkthroughs |
| 24 | Distributed Systems Primitives | 7 | [[_MOC_Distributed_Systems]] | 2PC, Saga, Outbox, Distributed Locks, Raft, Vector Clocks, Bulkhead |
| 25 | Storage Systems | 5 | [[_MOC_Storage]] | Block, object, file storage; GFS/HDFS; data warehouse; lakehouse |
| 26 | Data Architecture | 5 | [[_MOC_Data_Architecture]] | PACELC, Lambda/Kappa architecture, stream processing, ETL vs ELT |
| 27 | Cloud Design Patterns | 19 | [[_MOC_Cloud_Design_Patterns]] | Messaging, data management, and service-composition patterns for cloud-native systems |
| 28 | Reliability Patterns | 7 | [[_MOC_Reliability_Patterns]] | Availability (Stamps, Geodes), resiliency (Retry, Compensating Tx), and security (Federated Identity, Gatekeeper) |

---

## Three Learning Paths

### Path 1: System Design Interview Prep (4 weeks)

> Best for: Engineers preparing for senior/staff system design rounds at FAANG/top-tier companies.

**Week 1 — Fundamentals (Sections 01–05)**
- [[System_Design_Intro]] → [[Performance_vs_Scalability]] → [[Latency_vs_Throughput]] → [[CAP_Theorem]] → [[Consistency_Patterns]]

**Week 2 — Infrastructure (Sections 08–13)**
- [[Domain_Name_System]] → [[Content_Delivery_Network]] → [[Load_Balancers]] → [[Application_Layer]] → [[Databases]] → [[Caching]]

**Week 3 — Patterns and APIs (Sections 14–16, 19)**
- [[Asynchronism]] → [[Message_Queues]] → [[Communication]] → [[REST]] → [[gRPC]] → [[API_Gateway]] → [[Circuit_Breaker]]

**Week 4 — Case Studies (Section 23)**
- [[Design_URL_Shortener]] → [[Design_Rate_Limiter]] → [[Design_Notification_System]] → [[Design_Twitter_Feed]] → [[Design_Distributed_Cache]]

---

### Path 2: Production Architecture (Ongoing)

> Best for: Engineers building or reviewing production systems who need targeted depth.

- Observability: [[_MOC_Monitoring]] → [[Instrumentation]] → [[Visualization_and_Alerts]]
- Resilience: [[_MOC_PerformanceAntipatterns]] → [[Circuit_Breaker]] → [[Back_Pressure]] → [[Retry_Storm]]
- Security: [[_MOC_Security]] → [[TLS_and_HTTPS]] → [[OAuth_and_JWT]] → [[API_Security]]
- Async systems: [[_MOC_EventDriven]] → [[Kafka]] → [[CQRS]] → [[Event_Sourcing]]
- API design: [[_MOC_API_Gateway]] → [[Rate_Limiting]] → [[_MOC_Communication]]

---

### Path 3: Quick Reference (1 day)

> Best for: A fast refresher before an interview or architecture review.

[[System_Design_Intro]] → [[CAP_Theorem]] → [[Database_Sharding]] → [[Caching]] → [[Message_Queues]] → [[Design_URL_Shortener]]

---

## Must-Know Concepts

Every senior engineer should be able to explain these without hesitation:

1. [[CAP_Theorem]] — Why you can only guarantee two of Consistency, Availability, Partition Tolerance
2. [[Consistency_Patterns]] — Strong vs eventual vs weak consistency and when each is safe
3. [[Database_Sharding]] — Horizontal partitioning to scale writes beyond a single node
4. [[Database_Replication]] — Leader-follower replication for read scaling and durability
5. [[Caching]] — Where to cache, when not to, and the cache invalidation problem
6. [[Cache_Aside]] — The most common read-aside pattern every engineer should know
7. [[Load_Balancers]] — Layer 4 vs Layer 7, algorithms, and sticky sessions
8. [[Consistent_Hashing]] — Ring-based partitioning that minimizes reshuffling when nodes change
9. [[Asynchronism]] — Offloading work from the request path to queues and workers
10. [[Message_Queues]] — Producer-consumer decoupling via Kafka, RabbitMQ, or SQS
11. [[Idempotent_Operations]] — Why at-least-once delivery requires idempotent consumers
12. [[Circuit_Breaker]] — Open/closed/half-open state machine preventing cascading failures
13. [[Rate_Limiting]] — Token bucket vs sliding window enforcement strategies
14. [[TLS_and_HTTPS]] — How TLS handshakes and certificates protect data in transit
15. [[OAuth_and_JWT]] — Stateless identity tokens and delegated authorization flows
16. [[Event_Driven_Architecture]] — Loose coupling via event emission and broker-mediated delivery
17. [[CQRS]] — Separating read and write models for independent optimization
18. [[Bloom_Filter]] — Probabilistic membership tests that eliminate unnecessary I/O
19. [[Retry_Storm]] — How uncoordinated retries amplify failures into total outages
20. [[Availability_in_Numbers]] — What 99.9%, 99.99%, and 99.999% uptime mean in minutes per year

---

## Reference Quick Links

Key reference notes for interview prep:

- Capacity estimation baseline: [[Availability_in_Numbers]], [[Latency_vs_Throughput]]
- CAP and consistency trade-offs: [[CAP_Theorem]], [[Consistency_Patterns]], [[Availability_vs_Consistency]]
- Database scaling options: [[Database_Sharding]], [[Database_Replication]], [[Database_Federation]], [[SQL_vs_NoSQL]]
- Caching patterns: [[Cache_Aside]], [[Write_Through_Cache]], [[Write_Behind_Cache]]
- Communication cheat-sheet: [[REST]], [[gRPC]], [[WebSockets]], [[Long_Polling_and_SSE]]
- Resilience patterns: [[Circuit_Breaker]], [[Rate_Limiting]], [[Back_Pressure]], [[Idempotent_Operations]]
- Storage systems: [[_MOC_Storage]] → [[Block_vs_Object_vs_File_Storage]], [[Object_Storage]], [[Distributed_File_Systems]], [[Data_Warehouse]], [[Data_Lake_and_Lakehouse]]
- Distributed systems primitives: [[_MOC_Distributed_Systems]] → [[Distributed_Transactions]], [[Saga_Pattern]], [[Outbox_Pattern]], [[Consensus_and_Raft]], [[Distributed_Locks]]
- Data architecture patterns: [[_MOC_Data_Architecture]] → [[PACELC_Theorem]], [[Lambda_Architecture]], [[Kappa_Architecture]], [[Stream_Processing]], [[ETL_vs_ELT]]

#MOC #SystemDesign #MasterMOC
