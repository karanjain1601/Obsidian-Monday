---
title: pgvector
aliases:
  - pgvector extension
  - PostgreSQL Vector Search
  - Supabase Vector
tags:
  - vector-database
  - pgvector
  - postgresql
  - sql
  - open-source
  - rag
domain: AI-ML
difficulty: Intermediate
created: 2026-07-26
related:
  - Vector_Databases_Overview
  - Chroma
  - ANN_Algorithms
  - Embedding_Models
  - RAG_Overview
status: complete
---

# 🐘 pgvector

> [!abstract] TL;DR
> pgvector is a PostgreSQL extension that adds a native `vector` data type with HNSW and IVFFlat indexes. It lets you store embeddings alongside your relational data — no separate vector DB service needed. If you're already on PostgreSQL, pgvector gives you vector search for free. It's the right choice when you need SQL + vectors in one place, and Supabase has made it the default for many RAG applications.

## Intuition — Analogy First

You've built a house (PostgreSQL) and you need to add a workshop (vector search). You have two choices:

**Option A**: Build a separate workshop building in the backyard (dedicated vector DB like Pinecone). Now you have two buildings to maintain, two doors to lock, two roofs that might leak, two power bills. Data has to travel between buildings.

**Option B**: Extend the house — knock through the wall and add a workshop room (pgvector). Same foundation, same plumbing, same electricity. Your tools (vectors) live right next to everything else.

pgvector is Option B — a vector superpower bolted directly onto your existing PostgreSQL database. Your users table, orders table, and embeddings table all live together, joinable with a single SQL query.

## How It Works — Mechanics

### Installation and Setup

pgvector is a standard PostgreSQL extension installed via:
```sql
CREATE EXTENSION vector;
```

Once installed, you get:
- `vector(n)` data type for n-dimensional vectors
- Distance operators: `<->` (L2), `<=>` (cosine), `<#>` (negative inner product)
- `CREATE INDEX USING hnsw` and `CREATE INDEX USING ivfflat`
- Distance functions: `l2_distance()`, `cosine_distance()`, `inner_product()`

### Index Types

| Index | Algorithm | Best for |
|-------|-----------|---------|
| **HNSW** | Graph-based ANN | High recall, low latency (default choice) |
| **IVFFlat** | Cluster-based ANN | Lower memory, accepts slightly lower recall |
| **None** (exact) | Sequential scan | Small tables (<100K rows) |

### Architecture

```mermaid
graph TD
    App[Application] --> PG[PostgreSQL_with_pgvector]

    PG --> VT[vector_column_in_table]
    PG --> RT[Regular_relational_columns]

    VT --> HNSW[HNSW_Index_on_vector_col]
    RT --> BTREE[B-Tree_Index_on_regular_cols]

    Query[SQL_Query] --> JOIN[JOIN_vector_and_relational]
    JOIN --> HNSW
    JOIN --> BTREE
    JOIN --> Results[Combined_Results]
```

**Key advantage over dedicated vector DBs**: you can JOIN vector similarity results directly with relational data:

```sql
-- Find similar documents written by the same author
SELECT d.title, d.author, e.embedding <=> query_embedding AS distance
FROM documents d
JOIN embeddings e ON d.id = e.doc_id
WHERE d.author = 'Jane Smith'
ORDER BY distance
LIMIT 5;
```

This query is impossible in Pinecone — you'd need two round trips (filter by author, then query vector DB). In pgvector, it's one query.

## The Math

**Cosine distance** (pgvector `<=>` operator):
$$d_{\cos}(a, b) = 1 - \frac{a \cdot b}{\|a\| \cdot \|b\|}$$

**L2 distance** (`<->` operator):
$$d_{L2}(a, b) = \sqrt{\sum_i (a_i - b_i)^2}$$

**Negative inner product** (`<#>` operator — returns negative dot product for compatibility with `ORDER BY`):
$$d_{IP}(a, b) = -(a \cdot b)$$

**HNSW memory** (per vector):
$$\text{memory per vector} \approx d \times 4 + M \times L_{\text{avg}} \times 4 \text{ bytes}$$

Where $M$ is `m` parameter (default 16), $L_{\text{avg}} \approx 1.33$ average layers.

**IVFFlat memory**: same as flat (stores full vectors), but splits into `lists` clusters for faster search.

## Code Demo

```python
# ── Setup: pip install psycopg2-binary pgvector sentence-transformers ──────
import psycopg2
from pgvector.psycopg2 import register_vector
from sentence_transformers import SentenceTransformer
import numpy as np

# ── 1. Database setup ─────────────────────────────────────────────────────
conn = psycopg2.connect(
    dbname="mydb",
    user="postgres",
    password="password",
    host="localhost",
    port=5432,
)
register_vector(conn)  # register the vector type with psycopg2

with conn.cursor() as cur:
    # Enable extension
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # Create table with vector column
    cur.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id          SERIAL PRIMARY KEY,
            title       TEXT NOT NULL,
            content     TEXT NOT NULL,
            category    TEXT,
            embedding   vector(384),         -- dimension must match your model
            created_at  TIMESTAMPTZ DEFAULT NOW()
        )
    """)

    # Create HNSW index for fast ANN search (PostgreSQL 16+ / pgvector 0.5+)
    cur.execute("""
        CREATE INDEX IF NOT EXISTS documents_embedding_hnsw_idx
        ON documents
        USING hnsw (embedding vector_cosine_ops)
        WITH (m = 16, ef_construction = 64)
    """)

    # OR IVFFlat (older, more memory-efficient)
    # Must set lists = sqrt(row_count) after loading data
    # cur.execute("""
    #     CREATE INDEX IF NOT EXISTS documents_embedding_ivfflat_idx
    #     ON documents
    #     USING ivfflat (embedding vector_cosine_ops)
    #     WITH (lists = 100)
    # """)

    conn.commit()

# ── 2. Embed and insert documents ─────────────────────────────────────────
model = SentenceTransformer("all-MiniLM-L6-v2")

documents = [
    ("Introduction to pgvector", "pgvector adds vector search to PostgreSQL", "databases"),
    ("Machine Learning Basics", "ML models learn patterns from data", "ai"),
    ("PostgreSQL Performance", "Indexing and query optimization techniques", "databases"),
    ("RAG Architecture", "Retrieval-augmented generation combines retrieval with LLMs", "ai"),
]

with conn.cursor() as cur:
    for title, content, category in documents:
        embedding = model.encode(content).tolist()
        cur.execute(
            "INSERT INTO documents (title, content, category, embedding) VALUES (%s, %s, %s, %s)",
            (title, content, category, embedding),
        )
    conn.commit()

# ── 3. Vector similarity search ───────────────────────────────────────────
query = "how does semantic search work?"
query_embedding = model.encode(query).tolist()

with conn.cursor() as cur:
    # Cosine similarity search (lower distance = more similar)
    cur.execute("""
        SELECT title, content, category,
               1 - (embedding <=> %s::vector) AS cosine_similarity
        FROM documents
        ORDER BY embedding <=> %s::vector
        LIMIT 3
    """, (query_embedding, query_embedding))

    print(f"Query: {query}")
    for title, content, category, similarity in cur.fetchall():
        print(f"  Sim: {similarity:.4f} | {title} [{category}]")

# ── 4. Filtered search (SQL + vectors) ───────────────────────────────────
with conn.cursor() as cur:
    cur.execute("""
        SELECT title, content,
               1 - (embedding <=> %s::vector) AS similarity
        FROM documents
        WHERE category = 'ai'                   -- relational filter
        ORDER BY embedding <=> %s::vector       -- vector ordering
        LIMIT 2
    """, (query_embedding, query_embedding))

    print("\nFiltered (AI category only):")
    for title, content, similarity in cur.fetchall():
        print(f"  Sim: {similarity:.4f} | {title}")

# ── 5. Set ef_search for HNSW (tune recall vs speed) ─────────────────────
with conn.cursor() as cur:
    cur.execute("SET hnsw.ef_search = 100")   # default 40; higher = better recall
    cur.execute("""
        SELECT title, 1 - (embedding <=> %s::vector) AS sim
        FROM documents
        ORDER BY embedding <=> %s::vector
        LIMIT 3
    """, (query_embedding, query_embedding))
    results = cur.fetchall()

conn.close()


# ── 6. SQLAlchemy + pgvector (ORM approach) ───────────────────────────────
from sqlalchemy import create_engine, Column, Integer, String, text
from sqlalchemy.orm import declarative_base, Session
from pgvector.sqlalchemy import Vector

engine = create_engine("postgresql://postgres:password@localhost/mydb")
Base = declarative_base()

class Document(Base):
    __tablename__ = "documents_orm"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    content = Column(String)
    embedding = Column(Vector(384))

Base.metadata.create_all(engine)

with Session(engine) as session:
    doc = Document(
        title="Test",
        content="Test content",
        embedding=model.encode("Test content").tolist(),
    )
    session.add(doc)
    session.commit()
```

## Real-World Example

**Supabase Vector** — Supabase (PostgreSQL-as-a-service) built their vector search product entirely on pgvector. They exposed it with a simple JavaScript/Python SDK and made it the default recommendation for RAG applications using Supabase. Thousands of applications use Supabase Vector for semantic search without running a separate vector database.

**Retool** uses pgvector internally for their AI assistant: user databases, schema metadata, and query history are all in PostgreSQL anyway. Adding pgvector meant semantic search over all of this with zero new infrastructure.

## Trade-offs

| Dimension | pgvector | Dedicated Vector DB (Pinecone) |
|-----------|---------|-------------------------------|
| Infrastructure | Reuse existing Postgres | New service to manage/pay for |
| Performance | Good (<10M vectors) | Optimized for billions |
| SQL joins | Native | Requires application-side joins |
| Features | Basic vector ops | Namespaces, hybrid, advanced filtering |
| Latency | Slightly higher | Optimized single-purpose |
| Cost | Free (PostgreSQL) | $$$ managed cloud |

## When to Use vs Avoid

**Use pgvector when:**
- Already running PostgreSQL (pgvector is free, zero new infra)
- Need SQL JOINs between relational and vector data
- <5-10M vectors (pgvector handles this easily)
- Data sovereignty / on-premises requirement
- Using Supabase (built-in)

**Avoid when:**
- >10M vectors (dedicated vector DBs scale better)
- Don't have PostgreSQL already (Chroma is simpler to set up from scratch)
- Need built-in embedding modules (Weaviate auto-embeds)
- Need enterprise SLA without DB admin expertise

## Common Pitfalls

1. **Creating IVFFlat index before loading data** — `lists` parameter should be `sqrt(row_count)`, but that's 0 when the table is empty. Fix: load all data first, then `CREATE INDEX`.
2. **Not casting query vector** — `embedding <=> [0.1, 0.2, ...]` fails without explicit cast. Fix: use `%s::vector` in parameterized queries or `CAST(... AS vector)`.
3. **Index not used** — PostgreSQL uses seq scan for small tables. Fix: `SET enable_seqscan = off` to test; in production, tables must be large enough for index to be chosen.
4. **Wrong distance operator** — using `<->` (L2) for unnormalized text embeddings. Fix: use `<=>` (cosine) for text embeddings, or normalize vectors before inserting.
5. **ef_search too low** — default `hnsw.ef_search=40` gives poor recall. Fix: `SET hnsw.ef_search = 100` at session level.

## Related Concepts

- [[_MOC_Generative_AI|↑ Section MOC]]

- [[Vector_Databases_Overview]] — comparison of all vector DB options
- [[Chroma]] — simpler alternative if you don't have PostgreSQL
- [[ANN_Algorithms]] — HNSW and IVFFlat internals
- [[Embedding_Models]] — vectors that pgvector stores and indexes

## Review Questions

1. Write a SQL query that finds the top 5 most semantically similar customer support tickets to a new ticket, where `similarity > 0.8`, created in the last 30 days, and not yet resolved. What columns and indexes would you need?
2. When would you choose IVFFlat over HNSW in pgvector, and what is the critical timing constraint for creating an IVFFlat index?
3. A colleague argues: "We should migrate from pgvector to Pinecone when we hit 1 million vectors." Do you agree? What factors should actually drive this decision?

## Sources

- pgvector GitHub. https://github.com/pgvector/pgvector
- Supabase Vector Docs. https://supabase.com/docs/guides/ai
- Supabase: Choosing Between pgvector and Dedicated Vector DBs. https://supabase.com/blog/pgvector-vs-dedicated-vectordb
- psycopg2 pgvector adapter. https://github.com/pgvector/pgvector-python

#pgvector #postgresql #vector-database #sql #open-source #rag #supabase #hnsw
