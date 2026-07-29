---
title: Indexing Strategies
aliases: [ILM Policy, Data Streams, Index Templates, Rollover, Reindex, Force Merge]
tags: [Elasticsearch, Search, ELK, IndexingStrategies, ILM, Operations]
domain: Elasticsearch
difficulty: Advanced
created: 2026-07-29
related: [Cluster_Architecture, Performance_Tuning, Core_Concepts, _MOC_Elasticsearch_Master]
status: complete
---

# Indexing Strategies

> [!abstract] TL;DR
> Production Elasticsearch uses ILM policies, data streams, and index templates to automate the full index lifecycle from creation to deletion. Rollover, shrink, force merge, and reindex are the core operational tools. Daily indices vs. rollover-by-size is the key design trade-off.

## ILM Policy — Full Lifecycle Configuration

```bash
PUT _ilm/policy/production-logs
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": {
          "rollover": {
            "max_primary_shard_size": "50gb",
            "max_age": "1d",
            "max_docs": 100000000
          },
          "set_priority": { "priority": 100 }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "shrink": { "number_of_shards": 1 },
          "forcemerge": { "max_num_segments": 1 },
          "allocate": {
            "number_of_replicas": 0,
            "require": { "data": "warm" }
          },
          "set_priority": { "priority": 50 }
        }
      },
      "cold": {
        "min_age": "30d",
        "actions": {
          "allocate": {
            "number_of_replicas": 0,
            "require": { "data": "cold" }
          },
          "freeze": {},
          "set_priority": { "priority": 0 }
        }
      },
      "delete": {
        "min_age": "90d",
        "actions": { "delete": {} }
      }
    }
  }
}
```

## Index Templates

Index templates define settings and mappings applied automatically when a new index is created whose name matches the pattern.

### Component templates + index template (modern approach)

```bash
# 1. Component template for shared mappings
PUT _component_template/logs-mappings
{
  "template": {
    "mappings": {
      "properties": {
        "@timestamp": { "type": "date" },
        "level":      { "type": "keyword" },
        "service":    { "type": "keyword" },
        "message":    { "type": "text" },
        "trace_id":   { "type": "keyword" }
      }
    }
  }
}

# 2. Component template for shared settings
PUT _component_template/logs-settings
{
  "template": {
    "settings": {
      "number_of_shards": 2,
      "number_of_replicas": 1,
      "index.lifecycle.name": "production-logs",
      "index.lifecycle.rollover_alias": "logs-app"
    }
  }
}

# 3. Compose into an index template
PUT _index_template/logs-app-template
{
  "index_patterns": ["logs-app-*"],
  "data_stream": {},                          # mark as data stream
  "composed_of": ["logs-mappings", "logs-settings"],
  "priority": 200,                            # higher = takes precedence
  "template": {
    "settings": {
      "index.refresh_interval": "5s"         # template-specific override
    }
  }
}
```

## Data Streams — Time-Series Indices

A data stream automatically manages backing indices and rollovers:

```bash
# Create a data stream (index template with data_stream: {} must exist first)
PUT _data_stream/logs-app

# Write to data stream (always appends to current write index)
POST logs-app/_doc
{
  "@timestamp": "2026-07-29T10:30:00Z",
  "level": "ERROR",
  "service": "payments",
  "message": "Connection timeout"
}

# View backing indices
GET _data_stream/logs-app

# Manually trigger rollover
POST logs-app/_rollover

# Search across all backing indices transparently
GET logs-app/_search
{ "query": { "term": { "level": "ERROR" } } }
```

### Data stream vs regular index

| | Data Stream | Regular Index |
|---|---|---|
| Write target | Always current write index | The index itself |
| Rollover | Automatic via ILM | Manual |
| Update/Delete | Requires `_seq_no`; delete by query | Standard |
| `@timestamp` required | Yes | No |
| Best for | Logs, metrics, traces | Product catalogs, user profiles |

## Rollover API

Create a new index when an alias/data stream hits a threshold:

```bash
# Rollover an alias (traditional approach)
POST logs-app/_rollover
{
  "conditions": {
    "max_age": "1d",
    "max_size": "50gb",
    "max_docs": 10000000
  }
}
# Creates: logs-app-000002 (if current was logs-app-000001)

# Force rollover (unconditional)
POST logs-app/_rollover
{}
```

### Manual alias-based rollover setup

```bash
# Bootstrap first index
PUT logs-app-000001
{
  "aliases": {
    "logs-app":        { "is_write_index": true },
    "logs-app-search": {}
  }
}
```

## Reindex API

Copy documents from one index to another (for mapping changes, cluster migration):

```bash
POST _reindex
{
  "source": {
    "index": "products-v1",
    "query": { "term": { "active": true } },   # optional filter
    "_source": ["id", "name", "price"]           # optional field selection
  },
  "dest": {
    "index": "products-v2",
    "op_type": "create"                          # skip if already exists (idempotent)
  },
  "script": {
    "source": "ctx._source.price_cents = (ctx._source.price * 100).intValue()"
  }
}

# Async reindex (for large indices)
POST _reindex?wait_for_completion=false
{ "source": { "index": "logs-old-*" }, "dest": { "index": "logs-new" } }
# Returns: { "task": "abc123" }

GET _tasks/abc123
```

### Zero-downtime reindex pattern

```
1. Create new index (products-v2) with updated mapping
2. Point alias "products" to both v1 (read) and v2 (write)
3. Reindex v1 → v2 in background
4. Swap alias: remove v1, point writes to v2
5. Delete v1
```

## Shrink API

Reduce the number of primary shards (must be in warm/cold tier, read-only):

```bash
# Prepare: set read-only, relocate to single node
PUT /logs-app-000001/_settings
{
  "settings": {
    "index.blocks.write": true,
    "index.routing.allocation.require._name": "warm-node-1"
  }
}

# Shrink to 1 shard
POST /logs-app-000001/_shrink/logs-app-000001-shrunk
{
  "settings": {
    "index.number_of_shards": 1,
    "index.number_of_replicas": 0,
    "index.blocks.write": null                   # re-enable writes on new index
  }
}
```

> Original shard count must be divisible by target count (e.g., 8 → 4 → 2 → 1).

## Force Merge

Merge Lucene segments to reduce segment count and reclaim disk space from deleted documents:

```bash
# Force merge warm/cold index to 1 segment (disables future updates efficiently)
POST /logs-app-000001/_forcemerge?max_num_segments=1

# Check segments
GET /logs-app-000001/_segments
```

> Force merge is I/O intensive. Run only on read-only (warm/cold) indices. The ILM `forcemerge` action handles this automatically.

## Refresh Interval Tuning

```bash
# Disable refresh during bulk indexing (documents not searchable until reset)
PUT /my-index/_settings
{ "settings": { "index.refresh_interval": "-1" } }

# Restore after bulk load
PUT /my-index/_settings
{ "settings": { "index.refresh_interval": "1s" } }

# Manually trigger refresh
POST /my-index/_refresh

# For near-real-time use (default: 1s)
# For analytics/log archives: "30s" or "60s" (reduce refresh overhead)
```

## Daily Indices vs Rollover-by-Size

| Strategy | Pros | Cons |
|----------|------|------|
| **Daily indices** (`logs-2026.07.29`) | Simple, predictable, easy time-range pruning | Shard count tied to days not volume; tiny shards for quiet periods |
| **Rollover by size** (50 GB) | Consistent shard size, fewer large shards | Requires alias/ILM setup; indices span days |
| **Combined** (max_size OR max_age) | Best of both | More ILM configuration |

**Recommendation:** Use data streams with ILM rollover on both `max_size: 50gb` AND `max_age: 1d`. This gives shard size consistency while capping lag.

## Common Pitfalls

- **Not setting `is_write_index: true`** — if an alias points to multiple indices without a write index, write operations fail.
- **Reindexing with `op_type: index`** — without `create`, reindex overwrites newer documents if the source has older versions; use `create` for idempotent reindex.
- **Force merging hot indices** — force merge creates very large segments; it's designed for read-only indices only.
- **ILM not progressing** — ILM polls every 10 minutes; if phases don't progress, check `GET /_ilm/explain/<index>` for error details.
- **`index.blocks.write` forgotten** — leaving `write: true` after shrink prep locks the index permanently from writes; always nullify it on the shrunk index.

## Review Questions

1. What is the difference between a component template and an index template?
2. What three conditions can trigger an ILM rollover?
3. Why must an index be made read-only before using the Shrink API?
4. What is the zero-downtime reindex pattern, and why does it use an alias?
5. Why should you set `refresh_interval: -1` during bulk loading?

#Elasticsearch #Search #ELK #IndexingStrategies #ILM #Operations
