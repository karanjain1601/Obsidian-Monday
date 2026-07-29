---
title: Advanced Search
aliases: [Nested Query, Geo Search, Vector Search, kNN, ELSER, Percolator, Cross-Cluster Search]
tags: [Elasticsearch, Search, ELK, AdvancedSearch, VectorSearch, GeoSearch]
domain: Elasticsearch
difficulty: Advanced
created: 2026-07-29
related: [Search_Fundamentals, Aggregations, Relevance_and_Scoring, _MOC_Elasticsearch_Master]
status: complete
---

# Advanced Search

> [!abstract] TL;DR
> Advanced ES search covers nested/parent-child relationships (objects that keep their identity), geo queries (location-aware search), vector/semantic search (kNN, ELSER), the percolator (reverse search for alerting), and deep pagination via `search_after`. These power production search apps at scale.

## Nested Objects and `nested` Query

### The problem with flat objects

ES flattens arrays of objects, losing the association between fields:

```json
// Document
{ "items": [
  { "product": "laptop", "color": "red" },
  { "product": "mouse",  "color": "blue" }
]}

// After flattening:
// items.product: ["laptop", "mouse"]
// items.color:   ["red", "blue"]

// This query INCORRECTLY matches (laptop + blue is a false cross-match):
{ "query": { "bool": { "must": [
  { "term": { "items.product": "laptop" } },
  { "term": { "items.color": "blue" } }    // wrong! laptop is red
]}}}
```

### Solution: `nested` type + `nested` query

```bash
PUT /orders
{
  "mappings": {
    "properties": {
      "items": {
        "type": "nested",            # stored as separate hidden documents
        "properties": {
          "product": { "type": "keyword" },
          "color":   { "type": "keyword" },
          "qty":     { "type": "integer" }
        }
      }
    }
  }
}

GET /orders/_search
{
  "query": {
    "nested": {
      "path": "items",
      "query": {
        "bool": {
          "must": [
            { "term": { "items.product": "laptop" } },
            { "term": { "items.color": "red" } }     # correctly scoped to same nested doc
          ]
        }
      },
      "score_mode": "avg"    # how to aggregate nested scores: avg, max, sum, min, none
    }
  }
}
```

> `nested` type stores each inner object as a separate Lucene document (hidden). Queries on nested fields must use `nested` query wrapper.

## Parent-Child Relationships

For dynamic parent-child where child count changes frequently (avoid nested reindexing cost):

```bash
PUT /blog
{
  "mappings": {
    "properties": {
      "join_field": {
        "type": "join",
        "relations": {
          "post": "comment"    # post is parent, comment is child
        }
      }
    }
  }
}

# Index parent
PUT /blog/_doc/1
{ "title": "ES Guide", "join_field": "post" }

# Index child (must be on same shard as parent — use routing)
PUT /blog/_doc/101?routing=1
{
  "body": "Great guide!",
  "join_field": { "name": "comment", "parent": "1" }
}

# has_child query
GET /blog/_search
{
  "query": {
    "has_child": {
      "type": "comment",
      "query": { "match": { "body": "great" } },
      "score_mode": "sum"
    }
  }
}

# has_parent query
GET /blog/_search
{
  "query": {
    "has_parent": {
      "parent_type": "post",
      "query": { "match": { "title": "elasticsearch" } }
    }
  }
}
```

> Parent-child is less efficient than nested (join at query time vs index time) but supports updates to child documents without reindexing the parent.

## Geo Queries

### geo_point — Lat/lon coordinates

```bash
PUT /places
{
  "mappings": {
    "properties": {
      "name":     { "type": "keyword" },
      "location": { "type": "geo_point" }
    }
  }
}

PUT /places/_doc/1
{
  "name": "Trafalgar Square",
  "location": { "lat": 51.5080, "lon": -0.1281 }
  // Also valid: "location": "51.5080,-0.1281"  or  [lon, lat]  (GeoJSON order)
}
```

### `geo_distance` — Within radius

```bash
GET /places/_search
{
  "query": {
    "geo_distance": {
      "distance": "5km",
      "location": { "lat": 51.5074, "lon": -0.1278 }   # center point
    }
  },
  "sort": [
    {
      "_geo_distance": {
        "location": { "lat": 51.5074, "lon": -0.1278 },
        "order": "asc",
        "unit": "km"
      }
    }
  ]
}
```

### `geo_bounding_box` — Rectangle

```bash
{
  "query": {
    "geo_bounding_box": {
      "location": {
        "top_left":     { "lat": 52.0, "lon": -1.0 },
        "bottom_right": { "lat": 51.0, "lon":  0.5 }
      }
    }
  }
}
```

### `geo_shape` — Polygons, lines, complex shapes

```bash
PUT /regions/_doc/1
{
  "name": "Greater London",
  "boundary": {
    "type": "polygon",
    "coordinates": [[[
      [-0.51, 51.28], [-0.51, 51.69],
      [0.33, 51.69],  [0.33, 51.28], [-0.51, 51.28]
    ]]]
  }
}

GET /places/_search
{
  "query": {
    "geo_shape": {
      "location": {
        "shape": {
          "type": "circle",
          "coordinates": [-0.1278, 51.5074],
          "radius": "10km"
        },
        "relation": "within"   # within, intersects, disjoint
      }
    }
  }
}
```

## Vector Search — kNN and ELSER

### Dense vector field (numeric embeddings)

```bash
PUT /articles
{
  "mappings": {
    "properties": {
      "title":     { "type": "text" },
      "embedding": {
        "type": "dense_vector",
        "dims": 768,            # match your model's output dimension
        "index": true,
        "similarity": "cosine"  # cosine, l2_norm, dot_product
      }
    }
  }
}

# Index with embedding
PUT /articles/_doc/1
{
  "title": "Elasticsearch vector search guide",
  "embedding": [0.12, -0.34, 0.89, ...]  # 768 floats
}
```

### kNN search

```bash
GET /articles/_search
{
  "knn": {
    "field": "embedding",
    "query_vector": [0.15, -0.30, 0.85, ...],   # from your model
    "k": 10,              # return top 10 nearest neighbors
    "num_candidates": 100  # HNSW candidates to consider (accuracy vs speed)
  },
  "fields": ["title"]
}
```

### Hybrid search (kNN + BM25)

```bash
GET /articles/_search
{
  "query": {
    "match": { "title": "elasticsearch vector" }   # lexical
  },
  "knn": {
    "field": "embedding",
    "query_vector": [...],
    "k": 10,
    "num_candidates": 100,
    "boost": 0.9           # relative weight vs BM25
  }
}
```

### ELSER — Semantic search without GPU

ELSER (Elastic Learned Sparse Encoder) generates sparse semantic vectors that work with the existing inverted index:

```bash
# Deploy ELSER model (via ML node)
PUT _ml/trained_models/.elser_model_2
{ "input": { "field_names": ["text_field"] } }

# Use text_expansion query with ELSER
GET /articles/_search
{
  "query": {
    "text_expansion": {
      "ml.tokens": {
        "model_id": ".elser_model_2",
        "model_text": "what is neural search"
      }
    }
  }
}
```

## Percolator — Reverse Search (Alerting)

Normal search: query against documents. Percolator: store queries, match documents against them.

Use case: alert when a news article matches a saved topic.

```bash
PUT /alerts
{
  "mappings": {
    "properties": {
      "query": { "type": "percolator" },
      "title": { "type": "text" }
    }
  }
}

# Store a query (the "alert")
PUT /alerts/_doc/breaking-news-alert
{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "earthquake" } },
        { "term": { "category": "news" } }
      ]
    }
  }
}

# Check if a new document matches any stored alerts
GET /alerts/_search
{
  "query": {
    "percolate": {
      "field": "query",
      "document": {
        "title": "7.5 magnitude earthquake strikes Tokyo",
        "category": "news"
      }
    }
  }
}
```

## Cross-Cluster Search (CCS)

Search across multiple ES clusters from one query:

```bash
GET /cluster-a:logs-*,cluster-b:logs-*/_search
{
  "query": { "match": { "level": "ERROR" } }
}
```

Configure remote clusters:

```bash
PUT _cluster/settings
{
  "persistent": {
    "cluster.remote.cluster-a.seeds": ["cluster-a-host:9300"],
    "cluster.remote.cluster-b.seeds": ["cluster-b-host:9300"]
  }
}
```

## Async Search — Long-Running Queries

```bash
POST /logs-*/_async_search
{
  "query": { "match_all": {} },
  "aggs": { "hourly": { "date_histogram": { "field": "@timestamp", "calendar_interval": "1h" } } }
}
# Returns: { "id": "abc123", "is_partial": true, "is_running": true }

# Poll for results
GET /_async_search/abc123

# Delete when done
DELETE /_async_search/abc123
```

## `search_after` — Cursor-Based Deep Pagination

```bash
# Always sort by a unique, tiebreaker field
GET /logs/_search
{
  "size": 1000,
  "sort": [
    { "@timestamp": "desc" },
    { "_id": "asc" }         # tiebreaker for deterministic ordering
  ],
  "query": { "term": { "level": "ERROR" } }
}

# Take last hit's sort values and pass as search_after
GET /logs/_search
{
  "size": 1000,
  "sort": [
    { "@timestamp": "desc" },
    { "_id": "asc" }
  ],
  "search_after": ["2026-07-29T10:00:00Z", "some-doc-id"],
  "query": { "term": { "level": "ERROR" } }
}
```

## Common Pitfalls

- **Forgetting `nested` query for nested fields** — queries on `nested` fields without the `nested` wrapper silently return no results.
- **GeoJSON coordinate order** — GeoJSON uses `[longitude, latitude]` (reversed from `{lat, lon}` object); mixing these up gives wrong results with no error.
- **kNN `num_candidates` too low** — low `num_candidates` makes HNSW faster but less accurate; increase for high-recall use cases.
- **Percolator and mapping** — the percolator field must reference the same mapping as the documents being percolated; use the same index or ensure mappings match.
- **Parent-child routing** — child documents must be routed to the same shard as their parent; forgetting `?routing={parent_id}` causes query failures.

## Review Questions

1. Why does Elasticsearch flatten arrays of objects, and how does the `nested` type solve this?
2. What is the difference between `nested` and `parent-child` relationships? When would you use each?
3. Explain how ELSER differs from dense vector kNN search.
4. What is the percolator used for, and name a real-world use case.
5. Why is `search_after` preferred over `from`/`size` for deep pagination?

#Elasticsearch #Search #ELK #AdvancedSearch #VectorSearch #GeoSearch
