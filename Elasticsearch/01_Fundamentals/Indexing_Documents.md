---
title: Indexing Documents
aliases: [ES CRUD, Bulk API, Index API, Update API]
tags: [Elasticsearch, Search, ELK, Indexing]
domain: Elasticsearch
difficulty: Beginner
created: 2026-07-29
related: [Core_Concepts, Search_Fundamentals, Indexing_Strategies, _MOC_Elasticsearch_Master]
status: complete
---

# Indexing Documents

> [!abstract] TL;DR
> Elasticsearch exposes CRUD via REST. Single-document operations use Index/Update/Delete APIs. High-throughput ingest uses the Bulk API with NDJSON. Optimistic concurrency control via `_seq_no` + `_primary_term` prevents lost updates.

## Index API — Creating Documents

### PUT with explicit ID

```bash
PUT /products/_doc/1
{
  "name": "Laptop Pro 15",
  "price": 1299.99,
  "in_stock": true,
  "tags": ["electronics", "portable"],
  "created_at": "2026-07-29T10:00:00Z"
}
```

### POST — auto-generate ID

```bash
POST /products/_doc
{
  "name": "Wireless Mouse",
  "price": 49.99
}
# Response _id: "a1b2c3d4..."  (UUID-like base64)
```

### `_create` endpoint — fail if already exists

```bash
PUT /products/_create/1
{ "name": "Already exists?" }
# Returns 409 Conflict if doc 1 exists
```

### Index API Response

```json
{
  "_index": "products",
  "_id": "1",
  "_version": 1,
  "result": "created",   // or "updated"
  "_shards": { "total": 2, "successful": 1, "failed": 0 },
  "_seq_no": 0,
  "_primary_term": 1
}
```

## Bulk API — High-Throughput Ingest

The Bulk API sends multiple operations in a single HTTP request using **NDJSON** (newline-delimited JSON): action line + optional source line per operation.

### Action types

| Action | Description |
|--------|-------------|
| `index` | Create or replace document |
| `create` | Create only; fail if exists |
| `update` | Partial update (merge fields) |
| `delete` | Delete document (no source line) |

```bash
POST /_bulk
{ "index": { "_index": "products", "_id": "1" } }
{ "name": "Laptop Pro 15", "price": 1299.99 }
{ "index": { "_index": "products", "_id": "2" } }
{ "name": "Wireless Mouse", "price": 49.99 }
{ "update": { "_index": "products", "_id": "1" } }
{ "doc": { "price": 1199.99 } }
{ "delete": { "_index": "products", "_id": "99" } }
```

> Bulk requests target a specific index: `POST /products/_bulk` — then you can omit `_index` in the action lines.

### Bulk performance tips

- Optimal bulk size: **5–15 MB** per request (not number of docs — size matters)
- Set `refresh_interval: -1` during bulk load, restore after
- Set `number_of_replicas: 0` during initial load, then increase
- Use multiple concurrent bulk threads (one per shard ~= good concurrency)

## Update API — Partial Updates

### Partial update (merge fields)

```bash
POST /products/_update/1
{
  "doc": {
    "price": 999.99,
    "on_sale": true
  }
}
# Only updates price and on_sale; other fields unchanged
```

### Upsert — create if not exists

```bash
POST /products/_update/99
{
  "doc": { "price": 29.99 },
  "upsert": { "name": "New Product", "price": 29.99 }
}
```

### Scripted update (Painless scripting language)

```bash
POST /products/_update/1
{
  "script": {
    "source": "ctx._source.price *= params.discount",
    "params": { "discount": 0.9 }
  }
}
```

> Scripted updates avoid race conditions on counters: increment `ctx._source.views += 1` is atomic within a shard.

## Delete API

```bash
DELETE /products/_doc/1

# Delete by query (matches documents)
POST /products/_delete_by_query
{
  "query": {
    "range": { "created_at": { "lte": "2020-01-01" } }
  }
}
```

## Optimistic Concurrency Control

Elasticsearch uses **sequence numbers** + **primary terms** to detect concurrent modifications.

```bash
# Read the current _seq_no and _primary_term
GET /products/_doc/1

# Update only if these values match (no one else modified it)
PUT /products/_doc/1?if_seq_no=10&if_primary_term=1
{
  "name": "Laptop Pro 15",
  "price": 1099.99
}
# Returns 409 Conflict if another write happened between your GET and PUT
```

> Prefer `_seq_no` + `_primary_term` over the older `_version` parameter.

## Dynamic Mapping — Auto-schema Detection

When a document with new fields is indexed, Elasticsearch auto-maps them:

| JSON value | ES type |
|------------|---------|
| `true`/`false` | `boolean` |
| `123` | `long` |
| `1.5` | `float` |
| `"2026-07-29"` | `date` (if matches date format) |
| `"hello"` | `text` + `keyword` sub-field |
| `{ }` | `object` |
| `[ ]` | Array of the element type |

```bash
# Check auto-generated mapping
GET /products/_mapping
```

### Dynamic mapping settings

```json
PUT /products
{
  "mappings": {
    "dynamic": "strict"  // Options: true (auto-map), false (ignore new fields), "strict" (reject)
  }
}
```

## Explicit Mapping Definition

```bash
PUT /orders
{
  "mappings": {
    "properties": {
      "order_id":   { "type": "keyword" },
      "customer":   { "type": "keyword" },
      "total":      { "type": "double" },
      "placed_at":  { "type": "date", "format": "strict_date_optional_time||epoch_millis" },
      "items": {
        "type": "nested",
        "properties": {
          "product_id": { "type": "keyword" },
          "qty":        { "type": "integer" },
          "price":      { "type": "double" }
        }
      },
      "notes": {
        "type": "text",
        "fields": {
          "raw": { "type": "keyword" }  // multi-field: search on notes, sort on notes.raw
        }
      }
    }
  }
}
```

> Mappings are **immutable** for existing fields. To change a field type, create a new index with the updated mapping and use `_reindex`.

## Get Document

```bash
GET /products/_doc/1

# Get only specific fields
GET /products/_doc/1?_source_includes=name,price

# Check existence without fetching body
HEAD /products/_doc/1   # 200 = exists, 404 = not found
```

## Common Pitfalls

- **Bulk with large JSON lines** — NDJSON means each action and source must be on a single line; pretty-printed JSON breaks the format.
- **`_update` vs `index`** — `_update` with `doc` does a partial merge; `PUT /_doc/{id}` is a full replace.
- **Mapping explosion from dynamic mapping** — use `dynamic: strict` in production with explicit mappings.
- **`delete_by_query` is not atomic** — it snapshots a query, then deletes in batches; new matching docs written during the operation may survive.
- **Forgetting to restore `refresh_interval`** — leaving `-1` means data never becomes searchable.

## Review Questions

1. What is the difference between `POST /index/_doc` and `PUT /index/_doc/{id}` with `_create`?
2. Why is `if_seq_no` + `if_primary_term` preferred over `_version` for concurrency control?
3. What NDJSON format does the Bulk API expect? Why can't the source JSON be pretty-printed?
4. What does `dynamic: strict` do, and why is it recommended for production?
5. How does a scripted update differ from a partial `doc` update in terms of concurrency?

#Elasticsearch #Search #ELK #Indexing
