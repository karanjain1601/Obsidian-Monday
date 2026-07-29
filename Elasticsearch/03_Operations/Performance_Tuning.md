---
title: Performance Tuning
aliases: [Elasticsearch Performance, Heap Sizing, Bulk Indexing Performance, Query Optimization, JVM Tuning]
tags: [Elasticsearch, Search, ELK, PerformanceTuning, Operations]
domain: Elasticsearch
difficulty: Advanced
created: 2026-07-29
related: [Cluster_Architecture, Indexing_Strategies, Security_and_Monitoring, _MOC_Elasticsearch_Master]
status: complete
---

# Performance Tuning

> [!abstract] TL;DR
> Elasticsearch performance comes from correct heap sizing (50% RAM, max 31 GB), bulk indexing optimizations (size not count, refresh disabled), query design (filter context, avoid leading wildcards), and observing slow logs and circuit breakers. Most performance issues trace back to shard sizing or query design.

## Heap Sizing

### Rules

| Rule | Value |
|------|-------|
| Set heap to 50% of available RAM | Leave other 50% for OS filesystem cache (Lucene uses it heavily) |
| Hard maximum | 31 GB (boundary for JVM compressed object pointers — "compressed oops") |
| Minimum production heap | 4 GB |

```bash
# JVM options — /etc/elasticsearch/jvm.options.d/heap.options
-Xms16g
-Xmx16g   # always set Xms = Xmx to prevent heap resizing GC pauses
```

> If you set 32 GB, JVM disables compressed oops and effectively addresses less memory than 31 GB with compressed oops enabled. **Stay at or below 30–31 GB**.

### Why 50% for OS cache?

Lucene reads index segments from disk via the OS filesystem cache (memory-mapped files). If ES heap consumes all RAM, OS cache thrashes on every segment read → extremely slow search.

## JVM and GC Tuning

Elasticsearch 7.0+ uses **G1GC** by default (replaces CMS):

```bash
# Default G1GC settings in jvm.options
-XX:+UseG1GC
-XX:G1HeapRegionSize=4m
-XX:InitiatingHeapOccupancyPercent=30   # start GC when heap is 30% full
-XX:G1ReservePercent=25
```

### GC alert thresholds

| Metric | Warning | Critical |
|--------|---------|---------|
| Heap usage | > 75% | > 85% |
| GC time (% of wall time) | > 5% | > 10% |
| Full GC pauses | Any | Frequent |

```bash
# Check JVM heap from API
GET /_nodes/stats/jvm

# Key fields
.jvm.mem.heap_used_percent
.jvm.gc.collectors.old.collection_time_in_millis
.jvm.gc.collectors.young.collection_count
```

## Bulk Indexing Performance

### Optimal bulk request size

```
Target: 5–15 MB per bulk request (not doc count)
- Too small: HTTP overhead dominates
- Too large: GC pressure, timeouts
```

### Bulk load checklist

```bash
# 1. Disable refresh (docs not searchable during load)
PUT /my-index/_settings
{ "settings": { "index.refresh_interval": "-1" } }

# 2. Set replicas to 0 (only replicate once after load completes)
PUT /my-index/_settings
{ "settings": { "number_of_replicas": 0 } }

# 3. Load data with concurrent bulk threads (~= number of primary shards)

# 4. Restore settings
PUT /my-index/_settings
{
  "settings": {
    "index.refresh_interval": "1s",
    "number_of_replicas": 1
  }
}

# 5. Force merge (optional, for read-only archives)
POST /my-index/_forcemerge?max_num_segments=1
```

### Parallelism

```python
# Python example: parallel bulk with elasticsearch-py
from elasticsearch import Elasticsearch
from elasticsearch.helpers import parallel_bulk

es = Elasticsearch(["http://localhost:9200"])

actions = [
    { "_index": "products", "_id": str(i), "_source": { "name": f"Product {i}", "price": i * 9.99 } }
    for i in range(1_000_000)
]

for success, info in parallel_bulk(es, actions, thread_count=4, chunk_size=500):
    if not success:
        print(f"Failed: {info}")
```

## Thread Pools

Elasticsearch uses thread pools for different operations:

| Thread pool | Type | Default size | Controls |
|-------------|------|-------------|---------|
| `search` | fixed | `(CPU*3/2)+1` | Search request processing |
| `write` | fixed | CPU count | Indexing, update, delete |
| `get` | fixed | CPU count | Get by ID |
| `bulk` | fixed | CPU count | Bulk indexing |
| `analyze` | fixed | 1 | `_analyze` API |

```bash
# Check thread pool stats (queuedepth and rejected = pressure indicators)
GET /_cat/thread_pool?v&h=node_name,name,active,queue,rejected,completed

# Increase write queue (adjust cautiously)
# elasticsearch.yml
thread_pool.write.queue_size: 1000
```

> Rejected tasks = thread pool queue full = backpressure. Fix by reducing bulk size, increasing hardware, or adding nodes — not increasing queue size indefinitely.

## Circuit Breakers

Circuit breakers prevent OOM errors by aborting requests that would exceed memory limits:

| Circuit breaker | Protects against | Default limit |
|-----------------|-----------------|---------------|
| `indices.breaker.total.limit` | Total heap usage | 95% of heap |
| `indices.breaker.fielddata.limit` | Field data cache | 40% of heap |
| `indices.breaker.request.limit` | Per-request data structures | 60% of heap |
| `network.breaker.inflight_requests.limit` | Incoming request bytes | 100% of heap |

```bash
# Check circuit breaker stats
GET /_nodes/stats/breaker

# Check fielddata cache size
GET /_cat/fielddata?v&fields=*&h=node,field,size

# Clear fielddata cache (emergency — evicts cache for all fields)
POST /_cache/clear?fielddata=true
```

## Slow Log

Identifies slow queries and slow indexing operations:

```bash
# Set slow log thresholds (index settings)
PUT /my-index/_settings
{
  "settings": {
    "index.search.slowlog.threshold.query.warn":  "10s",
    "index.search.slowlog.threshold.query.info":  "5s",
    "index.search.slowlog.threshold.fetch.warn":  "1s",
    "index.indexing.slowlog.threshold.index.warn":"10s",
    "index.indexing.slowlog.threshold.index.info": "5s"
  }
}
```

Slow log entries appear in `logs/elasticsearch_index_search_slowlog.log` (or via Kibana Stack Monitoring).

## Query Optimization

### Use filter context for non-scoring queries

```bash
# BAD: must computes BM25 score for a boolean field
{ "query": { "bool": { "must": [ { "term": { "in_stock": true } } ] } } }

# GOOD: filter skips scoring, is cached
{ "query": { "bool": { "filter": [ { "term": { "in_stock": true } } ] } } }
```

### Avoid leading wildcards

```bash
# BAD: scans every term in the index
{ "wildcard": { "title.keyword": "*laptop*" } }

# GOOD: use match (full-text) or prefix
{ "match":  { "title": "laptop" } }          # analyzed, fast
{ "prefix": { "title.keyword": "lapt" } }    # prefix only, uses index
```

### Prefer `keyword` over `text` for sorting/aggregations

```bash
# BAD: aggregating on text field requires fielddata (heap-hungry)
{ "aggs": { "by_status": { "terms": { "field": "status" } } } }  # if status is text

# GOOD: use keyword sub-field
"status": {
  "type": "text",
  "fields": { "keyword": { "type": "keyword" } }
}
{ "aggs": { "by_status": { "terms": { "field": "status.keyword" } } } }
```

### Avoid scripts in hot paths

```bash
# BAD: Painless script calculated per-document at query time
{ "sort": { "_script": { "script": "doc['price'].value * 0.9", "type": "number" } } }

# GOOD: Pre-compute the discounted price at index time and store in a field
```

### `doc_values` vs `fielddata`

| | `doc_values` | `fielddata` |
|---|---|---|
| Stored | On disk, column-oriented | In heap memory (loaded lazily) |
| Field types | All except `text` | `text` only |
| Use case | Sorting, aggregations, scripting | Aggregations on text (avoid) |
| Performance | Fast (OS cache) | Slow (heap) |

Enable `fielddata: true` on `text` only if absolutely necessary and the cardinality is low.

## Segment Merging

Lucene continuously merges small segments into larger ones in the background:

```bash
# Check segment count per index
GET /_cat/segments?v&h=index,shard,segment,size,docs.count

# Check merge stats
GET /_nodes/stats/indices/segments

# Configure merge throttle (default: 20 MB/s — increase during off-hours)
PUT /_cluster/settings
{
  "transient": {
    "indices.store.throttle.max_bytes_per_sec": "100mb"
  }
}
```

## Key Performance Metrics

```bash
# One-shot snapshot of critical metrics
GET /_nodes/stats/indices,jvm,os,process,thread_pool

# Top metrics to watch:
# indices.search.query_time_in_millis / query_total  → avg query latency
# indices.indexing.index_time_in_millis / index_total → avg index latency
# jvm.mem.heap_used_percent                           → heap pressure
# jvm.gc.collectors.old.collection_time_in_millis    → GC time
# process.cpu.percent                                 → CPU
# os.mem.used_percent                                 → RAM (incl. OS cache)
# thread_pool.search.rejected                         → search backpressure
# thread_pool.write.rejected                          → write backpressure
```

## Common Pitfalls

- **Heap > 31 GB** — JVM switches off compressed oops; counter-intuitively slower than 30 GB.
- **Heap < 50% RAM** — Lucene's OS cache gets starved; segment reads go to disk every time.
- **Script-based sort on large result sets** — Painless scripts are slower than doc_values; pre-compute fields.
- **`fielddata: true` on high-cardinality text** — can fill heap with millions of unique strings; use aggregations on keyword sub-fields.
- **Not monitoring rejected thread pool tasks** — first sign of write/search backpressure; indicates the cluster is saturated.

## Review Questions

1. Why is 31 GB the recommended maximum heap size? What happens at 32 GB?
2. What is the OS filesystem cache, and why does it need 50% of available RAM?
3. What are the three steps to optimize bulk indexing performance before, during, and after loading?
4. What is a circuit breaker, and how does it differ from hitting OOM?
5. Why should you use `filter` context instead of `must` for non-text exact-match conditions?

#Elasticsearch #Search #ELK #PerformanceTuning #Operations
