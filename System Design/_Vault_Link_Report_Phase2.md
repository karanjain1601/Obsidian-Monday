---
title: Vault Link Report — Phase 2
tags: [SystemDesign, Meta, Report]
created: 2026-07-26
status: complete
---

# Vault Link Report — Phase 2

> Generated after the Phase 2 vault-linker pass on the System Design vault.
> Covers newly added notes in sections 01, 11, 13, 14, 16, 18, 19, 20, 22, 24, 25, 26, and the 12_Databases additions.

---

## Summary

| Metric | Count |
|--------|-------|
| Files with MOC backlink added (first bullet) | 43 |
| Files already had MOC as first bullet (no edit needed) | 9 |
| Body-text wikilinks added | 8 |
| Files receiving body-text wikilink edits | 7 |

---

## A. MOC Backlinks — Files Edited

### 24_Distributed_Systems → `[[_MOC_Distributed_Systems|↑ Section MOC]]`

| File | Action |
|------|--------|
| `Distributed_Transactions.md` | MOC added as first bullet |
| `Saga_Pattern.md` | MOC added as first bullet |
| `Outbox_Pattern.md` | MOC added as first bullet |
| `Distributed_Locks.md` | MOC added as first bullet |
| `Consensus_and_Raft.md` | MOC added as first bullet |
| `Vector_Clocks.md` | MOC added as first bullet |
| `Bulkhead_Pattern.md` | MOC added as first bullet |

### 25_Storage → `[[_MOC_Storage|↑ Section MOC]]`

| File | Action |
|------|--------|
| `Block_vs_Object_vs_File_Storage.md` | MOC added as first bullet |
| `Object_Storage.md` | MOC added as first bullet |
| `Distributed_File_Systems.md` | MOC added as first bullet |
| `Data_Warehouse.md` | MOC added as first bullet |
| `Data_Lake_and_Lakehouse.md` | MOC added as first bullet |

### 26_Data_Architecture → `[[_MOC_Data_Architecture|↑ Section MOC]]`

| File | Action |
|------|--------|
| `PACELC_Theorem.md` | MOC added as first bullet |
| `Lambda_Architecture.md` | MOC added as first bullet |
| `Kappa_Architecture.md` | MOC added as first bullet |
| `Stream_Processing.md` | MOC added as first bullet |
| `ETL_vs_ELT.md` | MOC added as first bullet |

### 11_ApplicationLayer → `[[_MOC_Application_Layer|↑ Section MOC]]`

| File | Action |
|------|--------|
| `Service_Mesh.md` | MOC added as first bullet |
| `Kubernetes_for_SD.md` | MOC added as first bullet |
| `Serverless_Architecture.md` | MOC added as first bullet |
| `Monolith_vs_Microservices.md` | MOC added as first bullet |
| `BFF_Pattern.md` | MOC added as first bullet |
| `Sidecar_Pattern.md` | MOC added as first bullet |
| `Strangler_Fig_Pattern.md` | MOC added as first bullet |

### 19_API_Gateway → `[[_MOC_API_Gateway|↑ Section MOC]]`

| File | Action |
|------|--------|
| `API_Versioning.md` | MOC added as first bullet |
| `Pagination_Patterns.md` | MOC added as first bullet |

### 16_Communication → `[[_MOC_Communication|↑ Section MOC]]`

| File | Action |
|------|--------|
| `Webhooks.md` | MOC added as first bullet |

### 13_Caching → `[[_MOC_Caching|↑ Section MOC]]`

| File | Action |
|------|--------|
| `Redis_vs_Memcached.md` | MOC added as first bullet |
| `Cache_Eviction_Policies.md` | MOC added as first bullet |
| `Cache_Stampede.md` | MOC added as first bullet |

### 14_Asynchronism → `[[_MOC_Asynchronism|↑ Section MOC]]`

| File | Action |
|------|--------|
| `Dead_Letter_Queue.md` | MOC added as first bullet |

### 20_Event_Driven → `[[_MOC_Event_Driven|↑ Section MOC]]`

| File | Action |
|------|--------|
| `PubSub_Pattern.md` | MOC added as first bullet |

### 22_Security → `[[_MOC_Security|↑ Section MOC]]`

| File | Action |
|------|--------|
| `Zero_Trust_Architecture.md` | MOC added as first bullet |
| `Secret_Management.md` | MOC added as first bullet |

### 18_Monitoring → `[[_MOC_Monitoring|↑ Section MOC]]`

| File | Action |
|------|--------|
| `Distributed_Tracing.md` | MOC added as first bullet |

### 01_Introduction → `[[_MOC_Introduction|↑ Section MOC]]`

| File | Action |
|------|--------|
| `System_Design_Interview_Framework.md` | MOC added as first bullet |
| `Capacity_Estimation_Reference.md` | MOC added as first bullet |

### 12_Databases (RDBMS + root) → `[[_MOC_Databases|↑ Section MOC]]`

| File | Action |
|------|--------|
| `RDBMS/ACID_and_Transactions.md` | MOC moved from last → first position |
| `RDBMS/Database_Indexes.md` | MOC moved from last → first position |
| `RDBMS/MVCC.md` | MOC moved from last → first position |
| `RDBMS/Write_Ahead_Log.md` | MOC moved from last → first position |
| `RDBMS/Connection_Pooling.md` | MOC moved from last → first position |
| `OLTP_vs_OLAP.md` | MOC moved from last → first position |

---

## B. MOC Already Correct — No Edit Needed

### 23_Case_Studies (all 5 files already had MOC as first bullet)

- `Design_YouTube.md` ✓
- `Design_WhatsApp.md` ✓
- `Design_Uber.md` ✓
- `Design_Google_Drive.md` ✓
- `Design_Web_Crawler.md` ✓

### 22_Security (4 files already had MOC as first bullet)

- `API_Security.md` ✓
- `Authentication_and_Authorization.md` ✓
- `OAuth_and_JWT.md` ✓
- `TLS_and_HTTPS.md` ✓

---

## C. Body-Text Wikilinks Added

| File | Original Text | Wikilink Added |
|------|--------------|----------------|
| `24_Distributed_Systems/Distributed_Transactions.md` | "via its WAL and lock manager" | `[[Write_Ahead_Log\|WAL]]` |
| `24_Distributed_Systems/Distributed_Locks.md` | "cache stampede prevention" | `[[Cache_Stampede\|cache stampede prevention]]` |
| `24_Distributed_Systems/Outbox_Pattern.md` | "Write-Ahead Log (WAL)" | `[[Write_Ahead_Log\|Write-Ahead Log (WAL)]]` |
| `25_Storage/Distributed_File_Systems.md` | "(MapReduce reads the whole file…)" | `[[MapReduce]]` |
| `19_API_Gateway/Pagination_Patterns.md` | "composite index on (created_at…)" | `[[Database_Indexes\|composite index]]` |
| `12_Databases/OLTP_vs_OLAP.md` | "connected by an ETL or CDC…" | `[[ETL_vs_ELT\|ETL]]` |
| `12_Databases/OLTP_vs_OLAP.md` | "Use OLAP (data warehouse) when" | `[[Data_Warehouse\|data warehouse]]` |
| `12_Databases/RDBMS/ACID_and_Transactions.md` | "Distributed transactions across shards…" | `[[Distributed_Transactions\|Distributed transactions]]` |

---

## D. Orphan Note Assessment

The following known notes from the target list were **not found linked from any other note** at the start of this pass (potential orphans before this pass). The MOC and body-text wikilinks added in this pass significantly improve their connectivity:

- `MapReduce` — now linked from `Distributed_File_Systems.md` (body text)
- `Cache_Stampede` — now linked from `Distributed_Locks.md` (body text)
- `ETL_vs_ELT` — now linked from `OLTP_vs_OLAP.md` (body text) + its own MOC
- `Data_Warehouse` — now linked from `OLTP_vs_OLAP.md` (body text) + its own MOC
- `Distributed_Transactions` — now linked from `ACID_and_Transactions.md` (body text)

Notes whose connectivity depends primarily on MOC links and should be reviewed for additional cross-linking in a future pass:
- `PACELC_Theorem` — linked only via MOC and `CAP_Theorem` note
- `Kappa_Architecture` — linked only via MOC and `Lambda_Architecture` note
- `Bulkhead_Pattern` — linked only via MOC and `Circuit_Breaker` note
- `BFF_Pattern` — linked only via MOC and `API_Gateway` note
- `Sidecar_Pattern` — linked only via MOC and `Service_Mesh` note
- `Strangler_Fig_Pattern` — linked only via MOC and `Monolith_vs_Microservices` note
- `Vector_Clocks` — linked only via MOC

---

## E. Notes on Idempotent_Operations

`Idempotent_Operations` is referenced in related concepts of several notes (`Outbox_Pattern`, `Distributed_Locks`) but does not appear to have its own note file yet. This note should be created or the references should be updated if the file does not exist.

---

*Report generated by vault-linker pass — 2026-07-26*

---

# Phase 3 — Vault Link Pass: Sections 27 & 28

> Covers 26 newly added notes in `27_Cloud_Design_Patterns/` and `28_Reliability_Patterns/`.
> Completed: 2026-07-26

---

## Summary

| Metric | Count |
|--------|-------|
| Files with MOC backlink enforced (first bullet) | 26 |
| Body-text wikilinks added | 64 |
| Files receiving body-text wikilink edits | 26 |

---

## A. MOC Backlinks — All 26 Files

### 27_Cloud_Design_Patterns → `[[_MOC_Cloud_Design_Patterns|↑ Section MOC]]`

| File | Action |
|------|--------|
| `Messaging/Async_Request_Reply.md` | MOC added as first bullet |
| `Messaging/Scheduling_Agent_Supervisor.md` | MOC added as first bullet |
| `Messaging/Queue_Based_Load_Leveling.md` | MOC added as first bullet |
| `Messaging/Sequential_Convoy.md` | MOC added as first bullet |
| `Messaging/Priority_Queue_Pattern.md` | MOC added as first bullet |
| `Messaging/Pipes_and_Filters.md` | MOC added as first bullet |
| `Messaging/Competing_Consumers.md` | MOC added as first bullet |
| `Messaging/Claim_Check.md` | MOC added as first bullet |
| `Data_Management/Materialized_View.md` | MOC added as first bullet |
| `Data_Management/Index_Table.md` | MOC added as first bullet |
| `Data_Management/Valet_Key.md` | MOC added as first bullet |
| `Data_Management/Static_Content_Hosting.md` | MOC added as first bullet |
| `Design_and_Implementation/External_Config_Store.md` | MOC added as first bullet |
| `Design_and_Implementation/Gateway_Aggregation.md` | MOC added as first bullet |
| `Design_and_Implementation/Gateway_Routing.md` | MOC added as first bullet |
| `Design_and_Implementation/Gateway_Offloading.md` | MOC added as first bullet |
| `Design_and_Implementation/Ambassador_Pattern.md` | MOC added as first bullet |
| `Design_and_Implementation/Anti_Corruption_Layer.md` | MOC added as first bullet |
| `Design_and_Implementation/Compute_Resource_Consolidation.md` | MOC added as first bullet |

### 28_Reliability_Patterns → `[[_MOC_Reliability_Patterns|↑ Section MOC]]`

| File | Action |
|------|--------|
| `Deployment_Stamps.md` | MOC added as first bullet |
| `Geodes.md` | MOC added as first bullet |
| `Compensating_Transaction.md` | MOC added as first bullet |
| `Federated_Identity.md` | MOC added as first bullet |
| `Health_Endpoint_Monitoring.md` | MOC added as first bullet |
| `Retry_Pattern.md` | MOC added as first bullet |
| `Gatekeeper.md` | MOC added as first bullet |

---

## B. Body-Text Wikilinks Added

### 27_Cloud_Design_Patterns — Messaging

| File | Wikilinks Added |
|------|----------------|
| `Async_Request_Reply.md` | `[[Idempotent_Operations\|Idempotent]]` |
| `Scheduling_Agent_Supervisor.md` | `[[Distributed_Transactions\|distributed transactions]]`, `[[Idempotent_Operations\|idempotent]]` |
| `Queue_Based_Load_Leveling.md` | `[[Idempotent_Operations\|idempotent]]`, `[[Dead_Letter_Queue\|Dead Letter Queue]]` |
| `Sequential_Convoy.md` | `[[Kafka]]`, `[[Idempotent_Operations\|idempotent]]`, `[[Dead_Letter_Queue\|dead-letter]]` |
| `Priority_Queue_Pattern.md` | `[[RabbitMQ]]`, `[[Kafka]]`, `[[Rate_Limiting\|Rate limiting]]`, `[[Idempotent_Operations\|Idempotent]]` |
| `Pipes_and_Filters.md` | `[[Kafka]]`, `[[Back_Pressure\|Back-pressure]]`, `[[Idempotent_Operations\|idempotent]]`, `[[Dead_Letter_Queue\|DLQ]]` |
| `Competing_Consumers.md` | `[[Kafka]]`, `[[RabbitMQ]]`, `[[Idempotent_Operations\|idempotent]]` |
| `Claim_Check.md` | `[[Kafka]]`, `[[RabbitMQ]]`, `[[Dead_Letter_Queue\|DLQ]]` |

### 27_Cloud_Design_Patterns — Data Management

| File | Wikilinks Added |
|------|----------------|
| `Materialized_View.md` | `[[CQRS]]` |
| `Index_Table.md` | `[[Key_Value_Store\|key-value stores]]`, `[[Wide_Column_Store\|wide-column stores]]` |
| `Valet_Key.md` | `[[Authentication_and_Authorization\|authorization]]` |
| `Static_Content_Hosting.md` | `[[Object_Storage\|object storage]]`, `[[Content_Delivery_Network\|CDN]]` |

### 27_Cloud_Design_Patterns — Design and Implementation

| File | Wikilinks Added |
|------|----------------|
| `External_Config_Store.md` | `[[Kubernetes_for_SD\|Kubernetes]]` |
| `Gateway_Aggregation.md` | `[[Microservices\|microservices]]`, `[[BFF_Pattern\|Backend-for-Frontend (BFF)]]` |
| `Gateway_Routing.md` | `[[Microservices\|microservices]]`, `[[BFF_Pattern\|BFF]]`, `[[Circuit_Breaker\|circuit-break]]` |
| `Gateway_Offloading.md` | `[[Microservices\|microservice]]`, `[[API_Gateway\|API gateway]]`, `[[Rate_Limiting\|rate limiting]]`, `[[Authentication_and_Authorization\|Authentication]]`, `[[Service_Mesh\|service mesh]]` |
| `Ambassador_Pattern.md` | `[[Circuit_Breaker\|Circuit breaking]]`, `[[Sidecar_Pattern\|Sidecar Pattern]]`, `[[Service_Mesh\|service mesh]]` |
| `Anti_Corruption_Layer.md` | `[[Microservices\|microservices]]`, `[[Strangler_Fig_Pattern\|Strangler Fig]]` |
| `Compute_Resource_Consolidation.md` | `[[Microservices]]`, `[[Kubernetes_for_SD\|Kubernetes]]`, `[[Sidecar_Pattern\|sidecar]]` |

### 28_Reliability_Patterns

| File | Wikilinks Added |
|------|----------------|
| `Deployment_Stamps.md` | `[[Load_Balancers\|load balancer]]` |
| `Geodes.md` | `[[Replication\|replication]]`, `[[CAP_Theorem\|CAP theorem]]` |
| `Compensating_Transaction.md` | `[[Idempotent_Operations\|Idempotent]]`, `[[Saga_Pattern\|Saga Pattern]]` |
| `Federated_Identity.md` | `[[OAuth_and_JWT\|OAuth 2.0]]` |
| `Health_Endpoint_Monitoring.md` | `[[Load_Balancers\|load balancers]]`, `[[Kubernetes_for_SD\|Kubernetes]]`, `[[Microservices\|Microservices]]`, `[[Circuit_Breaker\|Circuit breaker]]` |
| `Retry_Pattern.md` | `[[Retry_Storm\|retry storms]]`, `[[Idempotent_Operations\|idempotent]]`, `[[Circuit_Breaker\|circuit breaker]]` |
| `Gatekeeper.md` | `[[Load_Balancers\|load balancers]]`, `[[API_Gateway\|API gateways]]`, `[[Authentication_and_Authorization\|Authenticates]]`, `[[Zero_Trust_Architecture\|Zero-trust architectures]]` |

---

## C. Connectivity Notes

Notes whose incoming links were significantly improved by this pass:

- `Idempotent_Operations` — now linked from 8 files (was linked from 2 prior to this pass)
- `Dead_Letter_Queue` — now linked from 4 files in the Messaging section alone
- `Kafka` — now linked from 4 Messaging pattern files
- `RabbitMQ` — now linked from 3 Messaging pattern files
- `Circuit_Breaker` — now linked from 4 files across sections 27 and 28
- `Sidecar_Pattern` — now linked from 2 additional files (Ambassador_Pattern, Compute_Resource_Consolidation)
- `Service_Mesh` — now linked from 2 additional files (Ambassador_Pattern, Gateway_Offloading)
- `Strangler_Fig_Pattern` — now linked from Anti_Corruption_Layer body text (was MOC-only)
- `BFF_Pattern` — now linked from 2 additional files (Gateway_Aggregation, Gateway_Routing)

---

*Phase 3 appended — 2026-07-26*
