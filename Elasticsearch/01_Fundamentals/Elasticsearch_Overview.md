---
title: Elasticsearch Overview
aliases: [Elasticsearch Intro, ELK Stack, Elastic Stack]
tags: [Elasticsearch, Search, ELK, Overview]
domain: Elasticsearch
difficulty: Beginner
created: 2026-07-29
related: [Core_Concepts, _MOC_Elasticsearch_Master, _MOC_Database_Master, _MOC_SystemDesign_Master]
status: complete
---

# Elasticsearch Overview

> [!abstract] TL;DR
> Elasticsearch is a distributed, RESTful search and analytics engine built on Apache Lucene. It powers full-text search, log analytics, APM, and vector/semantic search at scale — accessed entirely through a JSON HTTP API.

## What is Elasticsearch?

Elasticsearch is an open-source, distributed search and analytics engine written in Java, built on top of **Apache Lucene**. Originally released in 2010 by Shay Banon, it is now maintained by Elastic NV.

Key properties:
- **Schema-flexible** — dynamic mapping infers field types automatically
- **Horizontally scalable** — add nodes; data is sharded and replicated
- **Near-real-time (NRT)** — documents are searchable within ~1 second of indexing
- **REST-first** — every operation (indexing, search, cluster management) is a JSON HTTP request

```bash
# Health check — the simplest ES operation
curl -X GET "localhost:9200/_cluster/health?pretty"
```

## The Elastic (ELK) Stack

```
Beats / Agents   →   Logstash (transform)   →   Elasticsearch (store/index)   →   Kibana (visualize)
```

| Component | Role |
|-----------|------|
| **Elasticsearch** | Distributed search, storage, and analytics engine |
| **Logstash** | Server-side data processing pipeline (parse, transform, enrich) |
| **Kibana** | Web UI for visualization, dashboards, Dev Tools |
| **Beats** | Lightweight shippers (Filebeat, Metricbeat, Packetbeat…) |
| **Elastic Agent** | Unified agent replacing individual Beats, managed by Fleet |

## Use Cases

| Use Case | Why Elasticsearch |
|----------|-------------------|
| **Full-text search** | Inverted index, BM25 relevance, analyzers |
| **Log analytics** | Time-series ingest at millions of events/s; ILM for data lifecycle |
| **APM / distributed tracing** | Elastic APM stores spans/transactions; service map in Kibana |
| **Security analytics (SIEM)** | Elastic Security correlates events, detects threats with ML |
| **Geospatial search** | geo_point/geo_shape types, bounding box, distance queries |
| **Vector / semantic search** | dense_vector + kNN; ELSER (Elastic Learned Sparse Encoder) |
| **E-commerce catalog** | Faceted navigation via aggregations, boosting, synonyms |

## Elasticsearch vs Alternatives

| | Elasticsearch | Apache Solr | OpenSearch | PostgreSQL FTS |
|---|---|---|---|---|
| **Origin** | Elastic NV | Apache | AWS fork of ES 7.10 | Built-in extension |
| **Scalability** | Native distributed | Distributed (SolrCloud) | Same as ES | Vertical |
| **Ecosystem** | Elastic Stack | Own UI (Solr Admin) | OpenSearch Dashboards | psql |
| **Vector search** | kNN, ELSER | Limited | Yes (k-NN plugin) | pgvector |
| **License** | SSPL/Elastic | Apache 2 | Apache 2 | PostgreSQL |
| **Best for** | ELK, enterprise search | Complex schema + analytics | AWS-managed workloads | Existing PG apps |

## Near-Real-Time (NRT) Search

Documents are written to an **in-memory buffer**, then periodically **refreshed** (default every 1 second) into a new Lucene segment. Only after a refresh is a document searchable.

```
Write → In-memory buffer → refresh (1s) → Lucene segment → searchable
                          ↓ fsync (translog flush)
                          Disk (durable)
```

> The translog (write-ahead log) ensures durability before fsync. A refresh does NOT flush to disk.

## REST API as Primary Interface

```bash
# Index a document
PUT /products/_doc/1
{
  "name": "Laptop Pro 15",
  "price": 1299.99,
  "category": "electronics"
}

# Search
GET /products/_search
{
  "query": {
    "match": { "name": "laptop" }
  }
}

# Delete
DELETE /products/_doc/1
```

HTTP verbs map to CRUD: `PUT`/`POST` (create/update), `GET` (read), `DELETE` (delete).

## Elasticsearch 8.x Key Features

| Feature | Description |
|---------|-------------|
| **Security by default** | TLS + auth enabled out of the box (was opt-in before 8.0) |
| **ELSER** | Elastic Learned Sparse Encoder — semantic search without GPU |
| **kNN vector search** | Approximate nearest-neighbor with HNSW index |
| **Serverless** | Fully-managed Elasticsearch on Elastic Cloud (2024+) |
| **ES\|QL** | New pipe-based query language for analytics |
| **Synthetic source** | Reconstruct `_source` from doc values (saves disk) |

## Common Pitfalls

- **Mapping explosions** — dynamic mapping on high-cardinality fields (e.g., JSON keys as field names) can create thousands of mappings; use `dynamic: strict` or `flattened` type.
- **Too many shards** — every shard is a Lucene index with overhead; aim for 20–40 GB per shard.
- **Using ES as primary DB** — ES does not support full ACID transactions; treat it as a secondary read store.
- **Ignoring NRT lag** — writes are not immediately searchable; don't test with `refresh_interval: 1s` and expect instant consistency.

## Review Questions

1. What is the difference between a `refresh` and a `flush` in Elasticsearch?
2. Why was OpenSearch forked from Elasticsearch, and what are the key differences?
3. Name three use cases where Elasticsearch outperforms a relational database.
4. What does "near-real-time" mean in the context of ES indexing?
5. How does Elasticsearch handle durability before data reaches disk?

#Elasticsearch #Search #ELK #Overview
