---
title: Core Concepts
aliases: [Elasticsearch Index, Shard, Node, Cluster, ILM, Inverted Index]
tags: [Elasticsearch, Search, ELK, CoreConcepts]
domain: Elasticsearch
difficulty: Beginner
created: 2026-07-29
related: [Elasticsearch_Overview, Indexing_Documents, Cluster_Architecture, _MOC_Elasticsearch_Master]
status: complete
---

# Core Concepts

> [!abstract] TL;DR
> Elasticsearch organizes data into **indices** of **documents** (JSON objects) stored in **shards** distributed across **nodes** in a **cluster**. The inverted index is the core data structure enabling sub-second full-text search.

## Logical Data Model

### Analogy: ES vs RDBMS vs MongoDB

| Elasticsearch | RDBMS | MongoDB |
|---|---|---|
| Index | Database | Collection |
| Mapping | Table Schema | Schema (optional) |
| Document | Row | Document |
| Field | Column | Field |
| Shard | Partition | Chunk |

> Note: In older ES versions (pre-7.0), there was also a **Type** level inside an index (like a table). Types were deprecated in 7.0 and removed in 8.0. All documents in an index now share a single flat mapping.

### Index

An index is a logical namespace that maps to one or more physical **shards**. It has a **mapping** (schema) and **settings** (shard count, analyzers, ILM policy).

```bash
# Create an index with explicit settings
PUT /logs-app-2026.07.29
{
  "settings": {
    "number_of_shards": 2,
    "number_of_replicas": 1,
    "index.refresh_interval": "1s"
  },
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" },
      "level":     { "type": "keyword" },
      "message":   { "type": "text" }
    }
  }
}
```

### Document

A document is a JSON object — the basic unit of data. Every document has:
- `_index` — which index it belongs to
- `_id` — unique identifier (string; auto-generated UUID if not provided)
- `_source` — the original JSON
- `_version` — optimistic concurrency version counter
- `_seq_no` / `_primary_term` — for concurrency control (preferred over `_version`)

```json
{
  "_index": "products",
  "_id": "abc123",
  "_version": 3,
  "_source": {
    "name": "Laptop Pro 15",
    "price": 1299.99,
    "tags": ["electronics", "portable"]
  }
}
```

### Field and Mapping

A **mapping** defines field names and their data types. Key field types:

| Type | Description |
|------|-------------|
| `text` | Analyzed for full-text search; not usable for aggregations |
| `keyword` | Exact match, aggregations, sorting; not analyzed |
| `integer`/`long`/`float`/`double` | Numeric |
| `date` | ISO 8601, epoch ms, custom format |
| `boolean` | true/false |
| `geo_point` | Lat/lon coordinates |
| `dense_vector` | Fixed-length float array for kNN search |
| `object` | Nested JSON object (fields flattened) |
| `nested` | Array of objects preserving identity |

## Physical Layout: Shards and Nodes

### Shard

A shard is a self-contained **Lucene index**. It is the unit of distribution.

- **Primary shard** — owns the canonical copy of data; handles writes
- **Replica shard** — copy of a primary; handles reads (HA + load balancing)
- Shard count is **fixed at index creation** (can't change without reindexing)
- Replica count is adjustable at runtime

```bash
# Check shard allocation
GET /_cat/shards/my-index?v&h=index,shard,prirep,state,node
```

```
index      shard prirep state   node
my-index   0     p      STARTED node-1
my-index   0     r      STARTED node-2
my-index   1     p      STARTED node-2
my-index   1     r      STARTED node-1
```

### Node

A single running Elasticsearch instance. Node roles:

| Role | Function |
|------|----------|
| `master` | Manages cluster state (index creation, shard assignment) |
| `data` | Stores shards, executes queries |
| `ingest` | Pre-processes documents via pipelines |
| `coordinating` | Routes requests, merges shard results (all nodes by default) |
| `ml` | Runs machine learning jobs |
| `remote_cluster_client` | Cross-cluster search |

### Cluster

A cluster is a collection of nodes sharing the same `cluster.name`. One elected **master node** manages cluster state. The cluster has a health color:

| Color | Meaning |
|-------|---------|
| Green | All primary and replica shards assigned |
| Yellow | All primaries assigned; some replicas unassigned |
| Red | Some primary shards unassigned (data unavailable) |

```bash
GET /_cluster/health?pretty
GET /_cat/nodes?v
```

## Data Streams

A **data stream** is a high-level abstraction for time-series data (logs, metrics, traces). It consists of multiple backing indices and exposes a single alias.

```
data-stream: logs-app
  ↳ .ds-logs-app-2026.07.01-000001 (write index)
  ↳ .ds-logs-app-2026.06.01-000002 (read-only, rolled over)
```

- Writes always go to the current write index
- Rollover creates a new backing index when size/age/doc count threshold is met
- Older indices can transition through ILM phases

## ILM: Index Lifecycle Management

ILM automates moving indices through phases to manage cost vs. performance:

```
Hot → Warm → Cold → Frozen → Delete
```

| Phase | Storage | Query speed | Use |
|-------|---------|-------------|-----|
| Hot | SSD, all replicas | Fastest | Active indexing + search |
| Warm | HDD, fewer replicas | Fast | Recent history |
| Cold | HDD or S3, 0 replicas | Slower | Infrequent access |
| Frozen | Searchable snapshot | Slow | Compliance archive |
| Delete | — | — | Data expiry |

```json
PUT _ilm/policy/logs-policy
{
  "policy": {
    "phases": {
      "hot":    { "actions": { "rollover": { "max_size": "50gb", "max_age": "1d" } } },
      "warm":   { "min_age": "7d",  "actions": { "shrink": { "number_of_shards": 1 } } },
      "cold":   { "min_age": "30d", "actions": { "freeze": {} } },
      "delete": { "min_age": "90d", "actions": { "delete": {} } }
    }
  }
}
```

## The Inverted Index

The inverted index is why full-text search is fast. Instead of scanning documents for words, it stores a map from **term → list of documents** containing that term.

```
Documents:
  Doc 1: "the quick brown fox"
  Doc 2: "quick brown dog"
  Doc 3: "the lazy fox"

Inverted Index:
  "brown" → [Doc1, Doc2]
  "dog"   → [Doc2]
  "fox"   → [Doc1, Doc3]
  "lazy"  → [Doc3]
  "quick" → [Doc1, Doc2]
  "the"   → [Doc1, Doc3]
```

Each entry also stores positional data (for phrase queries) and term frequency (for BM25 scoring). This structure is built during **indexing** (analysis pipeline) and stored as immutable **Lucene segments**.

## Index Patterns vs Data Views

- **Index pattern / Data view** — a Kibana construct that matches one or more index names using wildcards (e.g., `logs-*`) for use in Discover and Lens.
- **Index alias** — an ES construct; a single virtual name pointing to one or more real indices. Used for zero-downtime reindexing and rollover.

## Common Pitfalls

- **Mapping explosion** — dynamic mapping on unpredictable JSON keys can create tens of thousands of fields; set `dynamic: strict` and define mappings explicitly.
- **Wrong field type** — using `text` instead of `keyword` for IDs/status values breaks aggregations; mapping can't be changed after creation (must reindex).
- **Single-node cluster = yellow health** — replicas have nowhere to go on a single node; expected in dev, fix in prod with more nodes or `number_of_replicas: 0`.
- **ILM phase transition delay** — ILM checks policies every 10 minutes by default; `indices.lifecycle.poll_interval` controls this.

## Review Questions

1. What is the difference between `text` and `keyword` field types? When would you use each?
2. Why can't you change the number of primary shards after index creation?
3. What does cluster health `yellow` indicate — is data loss occurring?
4. Explain how the inverted index enables fast full-text search.
5. What is the difference between a data stream and a regular index?
6. What are the phases in an ILM policy, and what triggers a transition?

#Elasticsearch #Search #ELK #CoreConcepts
