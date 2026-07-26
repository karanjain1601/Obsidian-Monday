---
title: Polyglot Persistence
aliases: [Polyglot Persistence, Multi-model Storage, Foreign Data Wrapper, CDC]
tags: [Database, DistributedDatabases, PolyglotPersistence]
domain: Database
difficulty: Intermediate
created: 2026-07-26
related: []
status: complete
---

# 🗂️ Polyglot Persistence

> [!abstract] TL;DR
> **Polyglot persistence** is the practice of using *several different kinds* of data store in one system, each chosen for the job it does best: a **relational** DB for transactional source-of-truth data, **Redis** for caching and sessions, **Elasticsearch** for full-text search, a **graph** DB for relationship queries, and a **columnar warehouse** for analytics. No single database is great at everything, so you stop pretending and fan out. The engineering challenge is no longer *querying* — it's **keeping the copies in sync** (via **CDC**, the **outbox pattern**, or — riskily — **dual writes**) and **querying across** them (via **federation** and **foreign data wrappers** like Postgres FDW or MySQL's FEDERATED engine). See [[Database_Federation]] for cross-server querying and [[SQL_vs_NoSQL]] for choosing among store types; this note is the DB-engineering angle on running many stores together.

## Intuition — analogy FIRST

Think of how a serious cook equips a kitchen. You *could* try to do everything with one big chef's knife — but you don't. You keep a **chef's knife** for general chopping, a **bread knife** for crusty loaves, a **paring knife** for delicate work, and a **cleaver** for bone. Each tool is shaped for its job; forcing the bread knife to do paring work is clumsy and dangerous.

**Polyglot persistence** is stocking your data kitchen the same way. Your **relational database** is the chef's knife — the reliable, transactional workhorse and source of truth. **Redis** is the paring knife — tiny, blazing fast, perfect for the small precise job of caching a value or holding a session. **Elasticsearch** is the bread knife — purpose-built to slice through mountains of text and rank the results. A **graph database** is the specialized boning knife for "friends of friends of friends." The **data warehouse** is the cleaver for heavy analytical chopping over years of history.

The twist a home cook doesn't face: your ingredients (data) must appear on *several* cutting boards at once and **stay consistent** as you edit them. Change a customer's name in the relational board, and the search board and cache board still show the old name until you *propagate* the change. Managing that propagation — reliably, without losing edits — is the real work of polyglot persistence.

---

## How It Works

One application writes to a **system-of-record** database, and changes fan out to specialized derived stores, each serving the query shape it excels at.

```mermaid
graph TD
    App["Application"] -->|"writes (source of truth)\ntransactional"| PG["Relational DB\nPostgres / MySQL\norders, users, payments"]

    PG -->|"CDC / outbox\n(change stream)"| Sync["Sync layer\n(Debezium · Kafka · outbox relay)"]

    Sync -->|"index documents"| ES["Elasticsearch\nfull-text search"]
    Sync -->|"invalidate / warm"| Redis["Redis\ncache · sessions · rate limits"]
    Sync -->|"edges & nodes"| Graph["Graph DB\nNeo4j — relationships"]
    Sync -->|"ETL / stream"| DW["Warehouse\nSnowflake / BigQuery\nOLAP analytics"]

    App -.->|"search reads"| ES
    App -.->|"cache reads"| Redis
    App -.->|"recommendation reads"| Graph

    style PG fill:#2b8a3e,color:#fff
    style Sync fill:#e8590c,color:#fff
    style ES fill:#1971c2,color:#fff
    style DW fill:#862e9c,color:#fff
```

### Right tool for the job

| Store type | Best at | Example | Weak at |
|---|---|---|---|
| **Relational** (Postgres/MySQL) | ACID transactions, joins, integrity — the **source of truth** | Orders, payments, users | Full-text ranking, huge fan-out graph traversal |
| **Key-value / cache** (Redis) | Sub-ms reads, sessions, counters, rate limits | Session store, hot-object cache | Durability, complex queries |
| **Search** (Elasticsearch) | Full-text, relevance ranking, faceting | Product/site search | Being a source of truth (no strong txns) |
| **Graph** (Neo4j) | Multi-hop relationship traversal | Social graph, fraud rings, recommendations | Bulk scans, high write throughput |
| **Columnar warehouse** (Snowflake/BigQuery/Redshift) | Big aggregations over history (**OLAP**) | Revenue by region over 3 years | Low-latency single-row OLTP |
| **Document** (MongoDB) | Flexible nested schemas, aggregates by document | Product catalog, CMS | Cross-document transactions/joins |
| **Time-series** (Timescale/Influx) | High-ingest metrics + time-window queries | Sensor/IoT, monitoring | General-purpose relational work |

Rule of thumb: **one system of record (usually relational), many derived read stores.** The relational DB owns the truth; everything else is a specialized, rebuildable projection of it.

### The two hard problems

**Problem 1 — querying *across* stores: federation & foreign data wrappers.**
Sometimes you need one query to reach data physically living in another engine. Instead of ETL-ing it over, you *federate*:

- **PostgreSQL FDW (Foreign Data Wrapper)** — declare a foreign server + foreign table; Postgres queries it live as if local. `postgres_fdw` (another Postgres), `mysql_fdw`, `file_fdw`, plus community FDWs for MongoDB, Redis, etc. Postgres can even **push down** filters/joins to the remote.
- **MySQL FEDERATED engine** — a table whose storage is actually a table on a *remote* MySQL server; local queries transparently proxy over.

This is the DB-native side of [[Database_Federation]] — cross-server querying without moving the data.

**Problem 2 — keeping copies in sync.** When the source of truth changes, the derived stores must follow. Three patterns, worst to best:

| Pattern | How | Risk |
|---|---|---|
| **Dual writes** | App writes to DB *and* to Elasticsearch/cache in app code | ❌ **Not atomic** — one write succeeds, the other fails → permanent drift. Avoid for anything important. |
| **Change Data Capture (CDC)** | Tail the DB's replication log (Postgres logical decoding / MySQL binlog) with **Debezium** → stream changes to consumers | ✅ Reliable, decoupled, no app changes; eventual consistency; needs a pipeline (Kafka) |
| **Transactional outbox** | In the *same* local DB transaction, write the business row **and** an `outbox` event row; a relay reads the outbox (often via CDC) and publishes | ✅ Atomic with the write, exactly-once-ish delivery; the robust default (see [[Outbox_Pattern]]) |

CDC and the outbox both exploit the fact that the **source DB's own log is already a perfect, ordered change stream** — reuse it instead of racing two writes.

> [!warning] Everything downstream of the source of truth is **eventually consistent**. Search results and caches lag the relational truth by the pipeline delay. Design UX and correctness checks around that lag (see [[Consistency_Models]]).

---

## SQL / Config Examples

**PostgreSQL — federate a remote store with a Foreign Data Wrapper:**

```sql
-- Query a table that physically lives in ANOTHER Postgres server, live
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

CREATE SERVER analytics_srv FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (host 'warehouse.internal', dbname 'analytics', port '5432');

CREATE USER MAPPING FOR CURRENT_USER SERVER analytics_srv
    OPTIONS (user 'reader', password '***');

CREATE FOREIGN TABLE remote_events (id bigint, ts timestamptz, kind text)
    SERVER analytics_srv OPTIONS (schema_name 'public', table_name 'events');

-- Join LOCAL orders against REMOTE events in one query (filters pushed down)
SELECT o.id, e.kind
FROM orders o JOIN remote_events e ON e.id = o.event_id
WHERE e.ts > now() - interval '1 day';
```

**PostgreSQL — the transactional outbox (atomic with the business write):**

```sql
BEGIN;
  INSERT INTO orders (id, customer_id, total) VALUES (101, 42, 250);
  -- Same transaction: record the event for downstream stores
  INSERT INTO outbox (aggregate, payload, created_at)
    VALUES ('order.created', '{"id":101,"total":250}', now());
COMMIT;   -- both commit or neither; a relay (Debezium) ships the outbox row
```

**MySQL — FEDERATED engine table proxying a remote table:**

```sql
-- config: server must be started with --federated enabled
CREATE TABLE remote_users (
    id INT PRIMARY KEY,
    name VARCHAR(100)
) ENGINE=FEDERATED
  CONNECTION='mysql://reader:pass@warehouse.internal:3306/app/users';

SELECT * FROM remote_users WHERE id = 7;   -- transparently runs on the remote
```

**Debezium — CDC config to stream MySQL binlog into the sync pipeline:**

```config
# Debezium MySQL connector — tails the binlog, no app changes
connector.class = io.debezium.connector.mysql.MySqlConnector
database.hostname = mysql-primary
database.server.id = 184054
database.include.list = shop
table.include.list = shop.orders,shop.users
# → emits per-row change events to Kafka → Elasticsearch / cache / warehouse sinks
```

---

## Trade-offs

| Decision | Gains | Costs |
|---|---|---|
| Polyglot (many stores) | Each query served by the best-fit engine; independent scaling | More systems to run, monitor, back up, secure, and staff |
| Single database for all | Operational simplicity, one transaction boundary | Forces a poor fit onto search/graph/analytics workloads |
| CDC sync | Reliable, decoupled, reuses the DB log | Eventual consistency, pipeline infra (Kafka/Debezium) |
| Transactional outbox | Atomic with the write, robust delivery | Extra table + relay; still eventually consistent downstream |
| Dual writes | Trivial to code | Not atomic → silent, permanent data drift; avoid |
| Federation / FDW | Query across engines without ETL | Remote latency; limited push-down; a slow remote drags queries |

## Common Pitfalls

1. **Dual writes for anything that matters.** Writing to the DB and Elasticsearch from app code is *not atomic*; a crash between them leaves them permanently inconsistent. Use CDC or the outbox instead.
2. **No single source of truth.** If two stores both claim to own the same fact and can each be written directly, you get conflicting truths with no arbiter. Designate one system of record; derive the rest.
3. **Treating a derived store as authoritative.** Elasticsearch and Redis are rebuildable projections — never the ledger. A balance check must read the relational source, not the search index.
4. **Underestimating operational cost.** Each store multiplies backups, upgrades, monitoring, security surface, and on-call load. "Right tool for the job" is not free; consolidate when a store isn't pulling its weight.
5. **Ignoring downstream lag in the UX.** A user searches immediately after saving and doesn't find their item because the index hasn't caught up. Communicate eventual consistency or read-through the source for just-written items.
6. **Overusing federation as a data pipeline.** FDW/FEDERATED are great for occasional cross-engine reads, but routing heavy or high-frequency traffic through them makes the remote engine a bottleneck and SPOF. For bulk movement, use ETL/CDC.

## Related Concepts

- [[_MOC_DB_Distributed|↑ Section MOC]]
- [[Database_Federation]] — the systems-design view of splitting data by feature across servers; FDW/FEDERATED are its DB-native form
- [[SQL_vs_NoSQL]] — how to choose among the store *types* you combine in a polyglot system
- [[Consistency_Models]] — every derived store is eventually consistent with the source of truth
- [[Replication_Strategies]] — CDC piggybacks on the same WAL/binlog stream that drives replication
- [[Outbox_Pattern]] — the reliable alternative to dual writes for propagating changes
- [[Partitioning_and_Sharding]] — polyglot spreads data by *purpose*; sharding spreads the *same* data by key

## Review Questions

1. Your team wants product search to be fast and typo-tolerant, so a dev proposes writing every product to both Postgres and Elasticsearch directly from the API handler. What is the specific failure mode of this "dual write" approach, and what two patterns fix it?
2. Name four different store types you might use in one e-commerce system, the job each is best at, and which one must be the single source of truth. Why can't the others hold that role?
3. Explain when you'd reach for a Postgres foreign data wrapper versus a CDC pipeline to get data from a warehouse into an application query. What are the failure/performance trade-offs of each?

## Sources

- Pramod Sadalage & Martin Fowler, *NoSQL Distilled* — "Polyglot Persistence"
- Martin Kleppmann, *Designing Data-Intensive Applications*, Ch. 11 — Stream Processing & CDC
- PostgreSQL Documentation: Foreign Data Wrappers (postgres_fdw) — https://www.postgresql.org/docs/current/postgres-fdw.html
- MySQL Documentation: The FEDERATED Storage Engine — https://dev.mysql.com/doc/refman/8.0/en/federated-storage-engine.html
- Debezium Documentation: Change Data Capture — https://debezium.io/documentation/

#Database #DistributedDatabases #PolyglotPersistence #CDC #Outbox #FDW #Federation #DataSync
