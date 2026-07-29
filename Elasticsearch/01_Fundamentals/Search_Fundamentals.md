---
title: Search Fundamentals
aliases: [Query DSL, ES Search, Bool Query, Match Query, Term Query]
tags: [Elasticsearch, Search, ELK, QueryDSL]
domain: Elasticsearch
difficulty: Beginner
created: 2026-07-29
related: [Relevance_and_Scoring, Text_Analysis, Advanced_Search, Core_Concepts, _MOC_Elasticsearch_Master]
status: complete
---

# Search Fundamentals

> [!abstract] TL;DR
> Elasticsearch Query DSL is JSON-based. The key split is **query context** (computes relevance score) vs **filter context** (cached, binary yes/no). The `bool` query composes clauses. Pagination uses `from`/`size` for shallow results and `search_after` for deep iteration.

## Query DSL Structure

Every search request is a JSON body sent to `_search`:

```bash
GET /products/_search
{
  "query":   { ... },       # which documents to return
  "aggs":    { ... },       # aggregations (analytics)
  "sort":    [ ... ],       # ordering
  "_source": [ ... ],       # which fields to return
  "from":    0,             # pagination offset
  "size":    10             # number of results
}
```

## Query Context vs Filter Context

| | Query Context | Filter Context |
|---|---|---|
| Purpose | Relevance scoring | Binary match (yes/no) |
| Score computed? | Yes — `_score` | No — score = 0 |
| Cached? | No | Yes (bitset cache) |
| Performance | Slower (score computation) | Faster |
| Use for | Free-text search | Exact matches, ranges, flags |

```bash
GET /products/_search
{
  "query": {
    "bool": {
      "must":   [ { "match": { "name": "laptop" } } ],    # query context
      "filter": [ { "term": { "in_stock": true } },        # filter context
                  { "range": { "price": { "lte": 1500 } } } ]
    }
  }
}
```

## Leaf Queries

### `match` — Full-text search (analyzed)

```bash
GET /products/_search
{
  "query": {
    "match": {
      "name": {
        "query": "laptop computer",
        "operator": "or"    # default: or (any term); "and" = all terms required
      }
    }
  }
}
```

> `match` runs the query text through the field's analyzer (tokenize, lowercase, stem…).

### `term` — Exact match (not analyzed)

```bash
# Use for keyword, numeric, boolean, date fields
{
  "query": {
    "term": { "status": { "value": "published" } }
  }
}
```

> Never use `term` on a `text` field — the stored term after analysis is lowercase/stemmed, so `"Laptop"` won't match `"laptop"`.

### `terms` — Match any of a list

```bash
{
  "query": {
    "terms": { "category": ["electronics", "computers", "peripherals"] }
  }
}
```

### `range` — Numeric / date ranges

```bash
{
  "query": {
    "range": {
      "price": { "gte": 100, "lte": 500 },
      "created_at": { "gte": "now-7d/d", "lte": "now/d" }
    }
  }
}
```

### `exists` — Field is present

```bash
{ "query": { "exists": { "field": "discount_price" } } }
```

### `match_phrase` — Exact phrase with word order

```bash
{
  "query": {
    "match_phrase": { "description": "quick brown fox" }
  }
}
# Matches "the quick brown fox jumps" but NOT "fox brown quick"
```

### `multi_match` — Search multiple fields

```bash
{
  "query": {
    "multi_match": {
      "query": "laptop",
      "fields": ["name^3", "description", "tags"],  # ^3 = boost name field
      "type": "best_fields"   # or: most_fields, cross_fields, phrase
    }
  }
}
```

### `prefix` / `wildcard` / `fuzzy`

```bash
# Prefix (efficient — uses inverted index)
{ "query": { "prefix": { "name.keyword": "lapt" } } }

# Wildcard (avoid leading *, very slow)
{ "query": { "wildcard": { "name.keyword": "lapt*" } } }

# Fuzzy (edit distance — handles typos)
{ "query": { "fuzzy": { "name": { "value": "labtop", "fuzziness": "AUTO" } } } }
```

## Bool Query — Composing Clauses

The `bool` query is the primary way to compose multiple conditions:

| Clause | Behavior | Affects score? |
|--------|----------|----------------|
| `must` | Document MUST match; score computed | Yes |
| `should` | Document SHOULD match; boosts score | Yes |
| `must_not` | Document MUST NOT match; no score | No (filter context) |
| `filter` | Document MUST match; no score | No (cached) |

```bash
GET /products/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "name": "laptop" } }
      ],
      "should": [
        { "term": { "brand": "apple" } },
        { "range": { "rating": { "gte": 4.5 } } }
      ],
      "must_not": [
        { "term": { "status": "discontinued" } }
      ],
      "filter": [
        { "term": { "in_stock": true } },
        { "range": { "price": { "lte": 2000 } } }
      ],
      "minimum_should_match": 1   # at least 1 should clause must match
    }
  }
}
```

## Controlling Search Results

### `_source` filtering

```bash
{
  "_source": ["name", "price", "category"],  # include only these fields
  "query": { "match_all": {} }
}

# Or exclude sensitive fields
{
  "_source": { "excludes": ["internal_id", "cost_price"] },
  "query": { "match_all": {} }
}
```

### Pagination with `from` / `size`

```bash
{
  "from": 20,    # skip first 20
  "size": 10,    # return next 10 (i.e., page 3)
  "query": { "match_all": {} }
}
```

> Limit: `from + size` cannot exceed `index.max_result_window` (default 10,000). For deeper pagination, use `search_after`.

### `track_total_hits`

```bash
{
  "track_total_hits": true,   # exact count (may be slow for huge indices)
  "query": { "match": { "status": "active" } }
}
# Default: accurate up to 10,000, then shows "10000+"
```

### Sorting

```bash
{
  "sort": [
    { "price": "asc" },
    { "_score": "desc" },     # secondary sort by relevance
    { "created_at": { "order": "desc", "missing": "_last" } }
  ],
  "query": { "match": { "name": "laptop" } }
}
```

> To sort on a `text` field, use a `keyword` sub-field (`name.keyword`). Sorting on `text` fields directly requires `fielddata: true` — memory-intensive, not recommended.

### Highlighting

```bash
{
  "highlight": {
    "fields": {
      "description": { "fragment_size": 150, "number_of_fragments": 3 }
    }
  },
  "query": { "match": { "description": "distributed search" } }
}
# Response includes "highlight": { "description": ["...distributed <em>search</em>..."] }
```

## `search_after` — Deep Pagination

For scrolling past 10,000 hits, use `search_after` with a consistent sort:

```bash
# First request
GET /logs/_search
{
  "size": 100,
  "sort": [{ "timestamp": "desc" }, { "_id": "asc" }],
  "query": { "match_all": {} }
}

# Subsequent requests — pass the last hit's sort values
GET /logs/_search
{
  "size": 100,
  "sort": [{ "timestamp": "desc" }, { "_id": "asc" }],
  "search_after": ["2026-07-29T10:00:00Z", "abc123"],
  "query": { "match_all": {} }
}
```

## Common Pitfalls

- **`term` on `text` field** — fails to match because analyzed tokens don't match raw input; use `match` for text, `term` for keyword.
- **Leading wildcard `*foo`** — forces full index scan; extremely slow on large indices.
- **Deep `from`/`size` pagination** — each shard must sort and return `from + size` docs; use `search_after` instead.
- **Forgetting filter context** — repeated expensive queries (date ranges, status checks) should be in `filter`, not `must`, to benefit from caching.
- **`match_all` with large `size`** — fetching millions of documents via `_search` is not a scan; use `_scroll` or `search_after` for full data export.

## Review Questions

1. What is the difference between query context and filter context in a `bool` query? Which is cached?
2. Why should you never use a `term` query on a `text` field?
3. What is the maximum depth for `from`/`size` pagination, and what should you use beyond that?
4. In a `multi_match` query, what does `^3` after a field name mean?
5. What is `track_total_hits` and why might you set it to `false`?

#Elasticsearch #Search #ELK #QueryDSL
