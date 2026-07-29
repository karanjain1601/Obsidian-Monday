---
title: Relevance and Scoring
aliases: [BM25, Elasticsearch Scoring, Function Score, explain API]
tags: [Elasticsearch, Search, ELK, Relevance, Scoring]
domain: Elasticsearch
difficulty: Intermediate
created: 2026-07-29
related: [Search_Fundamentals, Text_Analysis, _MOC_Elasticsearch_Master]
status: complete
---

# Relevance and Scoring

> [!abstract] TL;DR
> Elasticsearch ranks documents using BM25 (term frequency × inverse document frequency × field-length norm). Use `explain: true` to debug scores, `function_score` to inject business logic, and field boosting in `multi_match` to tune precision.

## BM25 Scoring Algorithm

Elasticsearch 5+ uses **BM25** (Best Match 25) as its default similarity model (replacing TF-IDF).

### BM25 Formula (simplified)

```
score(D, Q) = Σ IDF(qi) × TF(qi, D) × field_length_norm
```

| Component | What it measures | Effect on score |
|-----------|-----------------|-----------------|
| **TF** (Term Frequency) | How often query term appears in doc | More = higher score (with diminishing returns via k1 parameter) |
| **IDF** (Inverse Document Freq) | How rare the term is across all docs | Rarer = higher score |
| **Field length norm** | Length of the field | Shorter field with match = higher score |

BM25 adds saturation to TF (unlike raw TF-IDF): doubling term count doesn't double score.

### BM25 Parameters

```bash
PUT /products
{
  "settings": {
    "similarity": {
      "custom_bm25": {
        "type": "BM25",
        "k1": 1.2,   # TF saturation (default 1.2; lower = faster saturation)
        "b": 0.75    # field-length normalization (0 = off, 1 = full norm)
      }
    }
  },
  "mappings": {
    "properties": {
      "description": { "type": "text", "similarity": "custom_bm25" }
    }
  }
}
```

## Debugging with `explain: true`

```bash
GET /products/_search
{
  "explain": true,
  "query": { "match": { "name": "laptop" } }
}
```

Response includes a nested `_explanation` tree:

```json
{
  "_id": "1",
  "_score": 1.8473,
  "_explanation": {
    "value": 1.8473,
    "description": "weight(name:laptop in 0) [PerFieldSimilarity]",
    "details": [
      { "value": 0.4700, "description": "idf, computed as log(1 + (N - n + 0.5) / (n + 0.5))" },
      { "value": 3.9305, "description": "tf, computed as freq / (freq + k1 * (1 - b + b * dl/avgdl))" }
    ]
  }
}
```

For a single document, use the Explain API:

```bash
GET /products/_explain/1
{
  "query": { "match": { "name": "laptop" } }
}
```

## Boosting Fields

### In `multi_match`

```bash
{
  "query": {
    "multi_match": {
      "query": "fast laptop",
      "fields": ["title^5", "name^3", "description^1", "tags^2"]
    }
  }
}
# title matches count 5x more than description matches
```

### `boost` parameter on any query

```bash
{
  "query": {
    "bool": {
      "should": [
        { "match": { "name":        { "query": "laptop", "boost": 3 } } },
        { "match": { "description": { "query": "laptop", "boost": 1 } } }
      ]
    }
  }
}
```

## `function_score` — Custom Boosting

`function_score` wraps a query and modifies scores with custom functions:

### `field_value_factor` — Boost by a numeric field

```bash
{
  "query": {
    "function_score": {
      "query": { "match": { "name": "laptop" } },
      "field_value_factor": {
        "field": "popularity_score",
        "factor": 1.2,
        "modifier": "log1p",  # sqrt, log, log1p, log2p, ln, square, reciprocal
        "missing": 1           # default value if field is null
      },
      "boost_mode": "multiply"  # multiply, replace, sum, avg, min, max
    }
  }
}
# Final score = BM25_score × log1p(popularity_score × 1.2)
```

### Decay functions — Boost by proximity to a point

```bash
{
  "query": {
    "function_score": {
      "query": { "match_all": {} },
      "functions": [
        {
          "gauss": {                   # gauss, linear, exp
            "price": {
              "origin": "500",         # ideal price
              "scale":  "200",         # half-score at 200 from origin
              "offset": "50",          # no decay within offset
              "decay":  0.5
            }
          }
        },
        {
          "gauss": {
            "location": {
              "origin": "51.5074,-0.1278",  # London lat/lon
              "scale": "10km"
            }
          }
        }
      ],
      "score_mode": "multiply"    # how to combine multiple functions
    }
  }
}
```

### `weight` — Apply a flat multiplier per condition

```bash
{
  "query": {
    "function_score": {
      "query": { "match": { "name": "laptop" } },
      "functions": [
        { "filter": { "term": { "is_featured": true } }, "weight": 2 },
        { "filter": { "term": { "on_sale": true } },     "weight": 1.5 }
      ],
      "score_mode": "sum",
      "boost_mode": "multiply"
    }
  }
}
```

## `dis_max` — Best-Field Strategy

`dis_max` takes the maximum score from multiple queries (plus a `tie_breaker`):

```bash
{
  "query": {
    "dis_max": {
      "queries": [
        { "match": { "title":       "brown fox" } },
        { "match": { "description": "brown fox" } }
      ],
      "tie_breaker": 0.3   # add 30% of other matches (0 = pure best-field)
    }
  }
}
```

> `multi_match` with `type: best_fields` is equivalent to `dis_max`.

## `rescore` — Two-Phase Ranking

Run an expensive re-ranker on only the top-N results:

```bash
{
  "query": {
    "match": { "name": "laptop" }   # fast first-pass retrieval
  },
  "rescore": {
    "window_size": 100,             # re-rank top 100
    "query": {
      "rescore_query": {
        "function_score": {
          "script_score": {
            "script": {
              "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
              "params": { "query_vector": [0.1, 0.2, ...] }
            }
          }
        }
      },
      "query_weight": 0.7,          # blend of original + rescore
      "rescore_query_weight": 0.3
    }
  }
}
```

## Negative Boosting

```bash
{
  "query": {
    "boosting": {
      "positive": { "match": { "name": "laptop" } },
      "negative": { "term": { "condition": "refurbished" } },
      "negative_boost": 0.2   # multiply score by 0.2 for refurbished
    }
  }
}
```

## Analyzer Impact on Scoring

The analyzer affects what tokens are indexed, directly changing BM25 stats:

- **Stemming** — `"running"`, `"runs"`, `"ran"` → `"run"` (same token, higher TF across fields)
- **Stop words** — removing "the", "is" means they don't contribute IDF/TF noise
- **Synonyms** — `"laptop"`, `"notebook"`, `"portable computer"` share tokens

```bash
# Test what tokens are stored for scoring
GET /products/_analyze
{
  "analyzer": "english",
  "text": "The laptops are running hot"
}
# Tokens: ["laptop", "run", "hot"]  (stop words removed, stems applied)
```

## Common Pitfalls

- **Using `function_score` with `replace` boost_mode** — completely discards BM25; documents are ranked only by function, ignoring text relevance.
- **Large `window_size` in `rescore`** — re-scoring 10,000 documents with a vector script is very slow; keep it 100–500.
- **Boosting without `explain`** — blindly adding boosts without checking scores leads to unexpected ranking; always validate with `explain: true`.
- **Field-length norm surprise** — a short title field will always outscore a long description for the same term; this is by design, but adjust `b` parameter if unwanted.

## Review Questions

1. What are the three components of BM25 and how does each affect the score?
2. How does BM25 differ from raw TF-IDF in handling high-frequency terms?
3. When would you use `function_score` instead of just adding `boost` to queries?
4. What is the purpose of `tie_breaker` in `dis_max`?
5. What does `explain: true` return, and how would you use it to debug unexpectedly low scores?

#Elasticsearch #Search #ELK #Relevance #Scoring
