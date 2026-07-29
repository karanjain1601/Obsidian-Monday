---
title: Text Analysis
aliases: [ES Analyzers, Tokenizer, Token Filters, Analysis Pipeline, _analyze API]
tags: [Elasticsearch, Search, ELK, TextAnalysis, NLP]
domain: Elasticsearch
difficulty: Intermediate
created: 2026-07-29
related: [Search_Fundamentals, Relevance_and_Scoring, Aggregations, _MOC_Elasticsearch_Master]
status: complete
---

# Text Analysis

> [!abstract] TL;DR
> Analysis converts raw text into tokens (terms) for the inverted index. The pipeline is: character filters → tokenizer → token filters. Custom analyzers control tokenization for full-text search quality — autocomplete, multilingual, synonyms, edge cases.

## The Analysis Pipeline

```
Raw text → [Character Filters] → [Tokenizer] → [Token Filters] → Terms (stored in inverted index)
```

| Stage | Purpose | Examples |
|-------|---------|---------|
| **Character filters** | Pre-process raw text (before tokenizing) | Strip HTML, map `&` → `and`, normalize Unicode |
| **Tokenizer** | Split text into tokens | Split on whitespace, standard (punctuation-aware), n-gram |
| **Token filters** | Transform/add/remove tokens | Lowercase, stop words, synonyms, stemming, ASCII folding |

Analysis happens **at index time** (when storing) and **at query time** (when searching). Both should use the same analyzer for consistent matching — by default, the same analyzer is used for both unless you configure `search_analyzer` separately.

## Built-in Analyzers

### Testing with `_analyze` API

```bash
GET /_analyze
{
  "analyzer": "english",
  "text": "The quick Brown Foxes are RUNNING fast"
}
# Tokens: ["quick", "brown", "fox", "run", "fast"]  (stops removed, stemmed, lowercased)
```

### Analyzer Comparison

| Analyzer | Tokenizes on | Lowercases | Stop words | Stemming |
|----------|-------------|------------|------------|---------|
| `standard` | Unicode word boundaries | Yes | No | No |
| `simple` | Non-letter chars | Yes | No | No |
| `whitespace` | Whitespace only | No | No | No |
| `stop` | Unicode boundaries | Yes | Yes (English) | No |
| `english` | Unicode boundaries | Yes | Yes (English) | Yes (Snowball) |
| `keyword` | No tokenization | No | No | No |
| `fingerprint` | Sorts + deduplicates tokens | Yes | Configurable | No |

```bash
# standard: good default — handles most European languages
GET /_analyze
{
  "analyzer": "standard",
  "text": "Hello World! It's 2026."
}
# Tokens: ["hello", "world", "it's", "2026"]

# keyword: treats entire field as one token (same as keyword field type)
GET /_analyze
{
  "analyzer": "keyword",
  "text": "New York City"
}
# Tokens: ["New York City"]
```

## Custom Analyzer Definition

Define a custom analyzer in the index `settings` block:

```bash
PUT /products
{
  "settings": {
    "analysis": {
      "char_filter": {
        "html_remover": { "type": "html_strip" },
        "amp_to_and":   { "type": "mapping", "mappings": ["& => and"] }
      },
      "tokenizer": {
        "edge_ngram_tokenizer": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 10,
          "token_chars": ["letter", "digit"]
        }
      },
      "filter": {
        "english_stop":   { "type": "stop",     "stopwords": "_english_" },
        "english_stemmer":{ "type": "stemmer",   "language": "english" },
        "synonym_filter": {
          "type": "synonym_graph",
          "synonyms": ["laptop, notebook, portable computer", "tv, television"]
        },
        "ascii_fold":     { "type": "asciifolding" }
      },
      "analyzer": {
        "product_search": {
          "type":         "custom",
          "char_filter":  ["html_remover", "amp_to_and"],
          "tokenizer":    "standard",
          "filter":       ["lowercase", "english_stop", "ascii_fold", "english_stemmer", "synonym_filter"]
        },
        "autocomplete": {
          "type":      "custom",
          "tokenizer": "edge_ngram_tokenizer",
          "filter":    ["lowercase"]
        },
        "autocomplete_search": {
          "type":      "custom",
          "tokenizer": "standard",
          "filter":    ["lowercase"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "name": {
        "type":            "text",
        "analyzer":        "product_search",
        "fields": {
          "autocomplete": {
            "type":            "text",
            "analyzer":        "autocomplete",
            "search_analyzer": "autocomplete_search"  # different search vs index analyzer!
          }
        }
      }
    }
  }
}
```

## Tokenizers

| Tokenizer | Splits on | Best for |
|-----------|-----------|---------|
| `standard` | Unicode word boundaries + punctuation | General text |
| `whitespace` | Whitespace only | Code, product IDs |
| `keyword` | No split | Entire value as one token |
| `pattern` | Regex | Custom delimiters |
| `ngram` | Sliding window of n chars | Infix search (match anywhere in word) |
| `edge_ngram` | Prefix window of n chars | Autocomplete (prefix search) |
| `path_hierarchy` | `/` | File paths, URL segments |
| `uax_url_email` | Standard + preserves URLs/emails | Email/URL aware text |

### N-Gram vs Edge N-Gram

```
Input: "laptop"
ngram (min=2, max=3):       ["la", "ap", "pt", "to", "op", "lap", "apt", "pto", "top"]
edge_ngram (min=2, max=4):  ["la", "lap", "lapt"]   ← only prefix, for autocomplete
```

## Token Filters

### Lowercasing and ASCII folding

```bash
# asciifolding: café → cafe, naïve → naive, Ångström → Angstrom
{ "type": "asciifolding", "preserve_original": true }
```

### Stop words

```bash
{ "type": "stop", "stopwords": "_english_" }
# Built-in: _english_, _french_, _german_, _spanish_, _arabic_, etc.
# Custom:
{ "type": "stop", "stopwords": ["the", "a", "is", "are"] }
```

### Stemming

```bash
{ "type": "stemmer", "language": "english" }     # Algorithmic (Snowball)
{ "type": "hunspell", "locale": "en_US" }        # Dictionary-based (more accurate)
```

### Synonyms

```bash
# synonym: replaces at index time (can't update without reindex)
# synonym_graph: applied at search time (can update without reindex — preferred)
{
  "type": "synonym_graph",
  "synonyms_path": "analysis/synonyms.txt",   # external file
  "synonyms": [
    "laptop, notebook => laptop",              # explicit mapping
    "tv, television, telly"                    # equivalent synonyms
  ]
}
```

> Use `synonym_graph` as a **search-time** filter to avoid reindexing when synonym lists change.

## Per-Field Analyzer Configuration

```bash
"mappings": {
  "properties": {
    "title": {
      "type": "text",
      "analyzer": "english",          # used at index time
      "search_analyzer": "english",   # used at search time (default = same)
      "search_quote_analyzer": "standard"  # for match_phrase queries
    }
  }
}
```

### Multi-field pattern (common production pattern)

```bash
"name": {
  "type": "text",
  "analyzer": "english",
  "fields": {
    "keyword": { "type": "keyword" },                  # exact match + aggregations
    "autocomplete": { "type": "text", "analyzer": "autocomplete", "search_analyzer": "autocomplete_search" }
  }
}
```

## Analyzer Testing

```bash
# Test a specific analyzer
GET /products/_analyze
{
  "analyzer": "product_search",
  "text": "Running <b>laptops</b> & notebooks on sale!"
}

# Test a field's configured analyzer
GET /products/_analyze
{
  "field": "name",
  "text": "Quick Brown Fox"
}

# Test individual components
GET /_analyze
{
  "tokenizer": "standard",
  "filter": ["lowercase", "stop"],
  "text": "The Quick Brown Fox"
}
```

## Common Pitfalls

- **Using `synonym` (index-time) instead of `synonym_graph` (search-time)** — requires full reindex to update synonym list; use `synonym_graph` for flexibility.
- **Edge n-gram on search** — searching `"lapt"` through edge_ngram search analyzer generates `["la", "lap", "lapt"]` (too many tokens); always use a standard/simple analyzer for the `search_analyzer`.
- **Forgetting `search_analyzer`** — if your `analyzer` uses edge_ngram, searches also go through edge_ngram tokenization, creating false positives.
- **ASCII folding at index but not search** — inconsistent analysis means `"café"` at index vs `"cafe"` at search won't match; apply the same filters on both sides.
- **`keyword` field analyzed by accident** — defining `"type": "text"` for IDs means exact-match queries won't work; always use `keyword` for IDs, statuses, and categorical values.

## Review Questions

1. What are the three stages of an analysis pipeline, and what does each do?
2. Why should the `search_analyzer` differ from the index `analyzer` for autocomplete?
3. What is the difference between `synonym` and `synonym_graph` token filters?
4. When would you use `edge_ngram` vs `ngram` tokenization?
5. How would you verify what tokens are actually stored in the inverted index for a field?

#Elasticsearch #Search #ELK #TextAnalysis #NLP
