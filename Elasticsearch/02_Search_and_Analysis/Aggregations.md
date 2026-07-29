---
title: Aggregations
aliases: [ES Aggregations, Terms Aggregation, Date Histogram, Bucket Aggregation, Metric Aggregation]
tags: [Elasticsearch, Search, ELK, Aggregations, Analytics]
domain: Elasticsearch
difficulty: Intermediate
created: 2026-07-29
related: [Search_Fundamentals, Advanced_Search, Kibana_and_Visualization, _MOC_Elasticsearch_Master]
status: complete
---

# Aggregations

> [!abstract] TL;DR
> Aggregations turn Elasticsearch into an analytics engine. Metric aggregations compute statistics (avg, sum, percentiles). Bucket aggregations group documents (terms, date_histogram, range). Pipeline aggregations compute across buckets. Sub-aggregations nest inside buckets for multi-level analysis.

## Aggregation Structure

```bash
GET /orders/_search
{
  "size": 0,               # don't return hits — aggregations only
  "query": {               # filter the documents being aggregated
    "range": { "placed_at": { "gte": "now-30d" } }
  },
  "aggs": {
    "my_agg_name": {        # user-defined name
      "terms": {            # aggregation type
        "field": "status"   # aggregation configuration
      },
      "aggs": {             # sub-aggregation (nested inside each bucket)
        "avg_total": {
          "avg": { "field": "total_amount" }
        }
      }
    }
  }
}
```

## Metric Aggregations

Compute a single value (or small set) from a set of documents.

### Basic statistics

```bash
{
  "aggs": {
    "avg_price":      { "avg":   { "field": "price" } },
    "sum_revenue":    { "sum":   { "field": "revenue" } },
    "min_price":      { "min":   { "field": "price" } },
    "max_price":      { "max":   { "field": "price" } },
    "doc_count_non_null": { "value_count": { "field": "price" } },
    "unique_users":   { "cardinality": { "field": "user_id" } }  # HyperLogLog approximation
  }
}
```

### `stats` and `extended_stats`

```bash
{
  "aggs": {
    "price_stats": {
      "stats": { "field": "price" }
      # Returns: count, min, max, avg, sum
    },
    "price_extended": {
      "extended_stats": { "field": "price" }
      # Additionally: sum_of_squares, variance, std_deviation, std_deviation_bounds
    }
  }
}
```

### Percentiles

```bash
{
  "aggs": {
    "load_time_percentiles": {
      "percentiles": {
        "field": "response_ms",
        "percents": [50, 90, 95, 99, 99.9]   # p50, p90, p95, p99
      }
    },
    "is_slow_95th": {
      "percentile_ranks": {
        "field": "response_ms",
        "values": [200, 500]   # what % of requests finish within 200ms? 500ms?
      }
    }
  }
}
```

## Bucket Aggregations

Group documents into buckets; each bucket can contain sub-aggregations.

### `terms` — Top-N values

```bash
{
  "aggs": {
    "top_categories": {
      "terms": {
        "field": "category",
        "size": 10,              # return top 10 buckets
        "order": { "_count": "desc" },   # or { "_key": "asc" } or { "avg_price": "desc" }
        "min_doc_count": 5,      # skip buckets with < 5 docs
        "missing": "unknown"     # bucket for docs where field is null
      },
      "aggs": {
        "avg_price": { "avg": { "field": "price" } }
      }
    }
  }
}
```

> `terms` returns an approximate top-N (each shard contributes its local top, then they're merged). For high-accuracy counts, increase `shard_size` (default = `size × 1.5`).

### `date_histogram` — Time bucketing

```bash
{
  "aggs": {
    "orders_over_time": {
      "date_histogram": {
        "field": "placed_at",
        "calendar_interval": "1d",   # or 1h, 1w, 1M, 1q, 1y
        "format": "yyyy-MM-dd",
        "min_doc_count": 0,          # include empty buckets
        "extended_bounds": {
          "min": "2026-07-01",
          "max": "2026-07-31"        # fill gaps in range
        },
        "time_zone": "Europe/London"
      },
      "aggs": {
        "daily_revenue": { "sum": { "field": "total_amount" } }
      }
    }
  }
}
```

### `range` and `date_range`

```bash
{
  "aggs": {
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 50,    "key": "budget" },
          { "from": 50,  "to": 200, "key": "mid-range" },
          { "from": 200, "key": "premium" }
        ]
      }
    }
  }
}
```

### `histogram` — Fixed-width numeric buckets

```bash
{
  "aggs": {
    "price_histogram": {
      "histogram": {
        "field": "price",
        "interval": 100,    # buckets: 0-100, 100-200, 200-300...
        "min_doc_count": 1
      }
    }
  }
}
```

### `filter` and `filters`

```bash
{
  "aggs": {
    "recent_orders": {
      "filter": {
        "range": { "placed_at": { "gte": "now-7d" } }
      },
      "aggs": {
        "avg_total": { "avg": { "field": "total_amount" } }
      }
    }
  }
}

# Multiple named filters
{
  "aggs": {
    "by_status": {
      "filters": {
        "filters": {
          "pending":   { "term": { "status": "pending" } },
          "shipped":   { "term": { "status": "shipped" } },
          "delivered": { "term": { "status": "delivered" } }
        }
      }
    }
  }
}
```

### `nested` — Aggregate over nested objects

```bash
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "items_nested": {
      "nested": { "path": "items" },
      "aggs": {
        "top_products": {
          "terms": { "field": "items.product_id" }
        }
      }
    }
  }
}
```

## Pipeline Aggregations

Compute across buckets produced by other aggregations (not across individual documents).

### `avg_bucket` — Average of bucket values

```bash
{
  "aggs": {
    "daily_sales": {
      "date_histogram": { "field": "placed_at", "calendar_interval": "1d" },
      "aggs": {
        "revenue": { "sum": { "field": "total_amount" } }
      }
    },
    "avg_daily_revenue": {
      "avg_bucket": { "buckets_path": "daily_sales>revenue" }
    }
  }
}
```

### `derivative` — Rate of change

```bash
{
  "aggs": {
    "hourly_errors": {
      "date_histogram": { "field": "timestamp", "calendar_interval": "1h" },
      "aggs": {
        "error_count": { "sum": { "field": "is_error" } },
        "error_rate_change": {
          "derivative": { "buckets_path": "error_count" }
        }
      }
    }
  }
}
```

### `cumulative_sum`

```bash
{
  "aggs": {
    "daily": {
      "date_histogram": { "field": "placed_at", "calendar_interval": "1d" },
      "aggs": {
        "revenue": { "sum": { "field": "total_amount" } },
        "cumulative_revenue": { "cumulative_sum": { "buckets_path": "revenue" } }
      }
    }
  }
}
```

### `moving_avg` (moving_fn in 7.x+)

```bash
{
  "aggs": {
    "hourly": {
      "date_histogram": { "field": "timestamp", "calendar_interval": "1h" },
      "aggs": {
        "count": { "value_count": { "field": "status" } },
        "smoothed": {
          "moving_fn": {
            "buckets_path": "count",
            "window": 5,
            "script": "MovingFunctions.ewma(values, 0.3)"   # exponential weighted
          }
        }
      }
    }
  }
}
```

## Aggregation Performance

| Tip | Reason |
|-----|--------|
| Use `size: 0` | Skip hit fetching when only aggregating |
| Filter first with `query` | Reduce document set before aggregating |
| Use `keyword` fields for `terms` | Cannot aggregate on `text` (use `fielddata: true` only if necessary) |
| Limit `terms` size | Large `size` on high-cardinality fields is memory-intensive |
| Use `date_histogram` over `range` for time | More efficient bucket generation |
| Circuit breakers | Aggregations can consume gigabytes of heap; monitor `fielddata` size |

## Common Pitfalls

- **Aggregating on `text` field** — fails by default; enable `fielddata: true` only for small, low-cardinality text fields (memory-intensive). Better: add a `keyword` sub-field.
- **`terms` accuracy** — top-N is approximate in a distributed cluster; add `shard_size: size × 10` for better accuracy at higher memory cost.
- **Forgetting `size: 0`** — if you only want aggregation results, include `"size": 0` to avoid fetching document hits.
- **`date_histogram` with `min_doc_count: 0`** — creates empty buckets for every interval; useful for charts but can create thousands of buckets for long time ranges.

## Review Questions

1. What is the difference between metric aggregations and bucket aggregations?
2. Why does `terms` aggregation return approximate results in a distributed cluster?
3. How would you count distinct users across a large dataset? What accuracy trade-off does this involve?
4. What are pipeline aggregations, and how do they differ from regular aggregations?
5. Why can't you aggregate directly on a `text` field, and what is the recommended solution?

#Elasticsearch #Search #ELK #Aggregations #Analytics
