---
title: Atlas and Cloud
aliases: [MongoDB Atlas, Atlas Search, Atlas Vector Search, Atlas App Services]
tags: [MongoDB, NoSQL, Database, Atlas, Cloud, ManagedService]
domain: MongoDB
difficulty: Intermediate
created: 2026-07-29
related: [MongoDB_Overview, Replication, Sharding, Performance_and_Monitoring]
status: complete
---

# Atlas and Cloud

> [!abstract] TL;DR
> **MongoDB Atlas** is the fully-managed cloud database service — runs on AWS, GCP, and Azure. Beyond vanilla MongoDB, Atlas adds: **Atlas Search** (full-text with Lucene), **Atlas Vector Search** (ANN search for AI embeddings), **Atlas Stream Processing** (real-time pipeline), **Atlas App Services** (serverless triggers/functions), continuous backup, and the Performance Advisor. The `$search` and `$vectorSearch` aggregation stages bring Lucene and ANN queries into the MongoDB aggregation pipeline.

## Atlas Cluster Tiers

| Tier | vCPU | RAM | Storage | Use Case |
|---|---|---|---|---|
| **M0** (Free) | Shared | 512 MB | 512 MB | Dev/test only. No SLA, no backups |
| **M2** | Shared | 2 GB | 2 GB | Learning, small projects |
| **M5** | Shared | 5 GB | 5 GB | Small projects |
| **M10** | 2 vCPU | 2 GB | 10 GB | Development / low-traffic production |
| **M20** | 2 vCPU | 4 GB | 20 GB | Light production |
| **M30** | 2 vCPU | 8 GB | 40 GB | Production |
| **M50+** | 4-64 vCPU | 16-256 GB | 100 GB–4 TB | High-traffic production |
| **Serverless** | Auto-scale | Auto-scale | Auto-scale | Sporadic workloads, pay per operation |

> [!warning] M0 in Production
> The free tier is shared-tenant, resource-throttled, and has no SLA. Use M10+ for anything customer-facing.

---

## Connecting to Atlas

```javascript
// Atlas connection string format
const uri = "mongodb+srv://username:password@cluster0.abc12.mongodb.net/mydb?retryWrites=true&w=majority"

// mongodb+srv:// — SRV DNS record, automatically discovers replica set members
// retryWrites=true — automatically retry transient write failures
// w=majority — default write concern

const client = new MongoClient(uri)
await client.connect()
const db = client.db("mydb")
```

**Network security:**
```javascript
// Options for production network access:
// 1. IP Access List — whitelist specific IPs/CIDR ranges
// 2. VPC Peering — connect your AWS/GCP/Azure VPC directly to Atlas
// 3. Private Endpoints (AWS PrivateLink / Azure Private Link / GCP PSC)
//    — traffic stays on cloud provider network, never hits public internet
```

---

## Atlas Search (Full-Text with Lucene)

Atlas Search runs **Apache Lucene** alongside your MongoDB cluster. Index definitions are separate from MongoDB indexes. Queries use the `$search` aggregation stage.

### Creating an Atlas Search Index

```json
// Index definition (via Atlas UI, CLI, or API)
{
  "name": "default",
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "body": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "author": {
        "type": "string",
        "analyzer": "lucene.keyword"
      },
      "publishedAt": {
        "type": "date"
      },
      "price": {
        "type": "number"
      },
      "tags": {
        "type": "token"
      }
    }
  }
}
```

### Querying with `$search`

```javascript
// Full-text search
db.articles.aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: "mongodb performance tuning",
        path: ["title", "body"],
        fuzzy: { maxEdits: 1 }   // fuzzy matching — catches typos
      }
    }
  },
  // Score-based relevance is automatic
  // Project the search score
  {
    $project: {
      title: 1,
      score: { $meta: "searchScore" }
    }
  },
  { $sort: { score: { $meta: "searchScore" } } },
  { $limit: 10 }
])

// Compound query: text + filter on structured fields
db.products.aggregate([
  {
    $search: {
      index: "default",
      compound: {
        must: [
          { text: { query: "laptop", path: "name" } }
        ],
        filter: [
          { range: { path: "price", gte: 500, lte: 2000 } },
          { equals: { path: "available", value: true } }
        ],
        should: [
          { text: { query: "gaming", path: "description", score: { boost: { value: 2 } } } }
        ]
      }
    }
  },
  { $limit: 20 }
])

// Autocomplete
db.products.aggregate([
  {
    $search: {
      index: "autocomplete_index",   // requires an "autocomplete" field type in index def
      autocomplete: {
        query: "mongo",
        path: "name",
        tokenOrder: "sequential"
      }
    }
  },
  { $limit: 5 },
  { $project: { name: 1 } }
])
```

---

## Atlas Vector Search (AI Embeddings)

**Atlas Vector Search** stores and searches dense vector embeddings — used for semantic search, RAG (Retrieval-Augmented Generation), recommendation systems, and similarity matching.

### Creating a Vector Search Index

```json
{
  "name": "vector_index",
  "type": "vectorSearch",
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,       // OpenAI text-embedding-ada-002 = 1536 dimensions
      "similarity": "cosine"       // "cosine" | "euclidean" | "dotProduct"
    },
    {
      "type": "filter",
      "path": "category"           // pre-filter field for hybrid search
    }
  ]
}
```

### Querying with `$vectorSearch`

```javascript
// Generate an embedding from your ML model first
const embedding = await openai.embeddings.create({
  model: "text-embedding-ada-002",
  input: "How do I optimize MongoDB queries?"
})
const queryVector = embedding.data[0].embedding

// Search for semantically similar documents
db.articles.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: queryVector,
      numCandidates: 100,     // candidates to consider (higher = more accurate, slower)
      limit: 10,              // final results to return
      filter: { category: "database" }   // pre-filter (requires filter field in index)
    }
  },
  {
    $project: {
      title: 1,
      body: 1,
      score: { $meta: "vectorSearchScore" }
    }
  }
])

// Hybrid search: combine vector search + full-text ($search) with $scoreFusion
db.articles.aggregate([
  {
    $rankFusion: {                // MongoDB 8.0+ — combines results from multiple searches
      input: {
        pipelines: {
          vectorPipeline: [
            { $vectorSearch: { /* ... */ } }
          ],
          textPipeline: [
            { $search: { /* ... */ } }
          ]
        }
      }
    }
  }
])
```

---

## Atlas Stream Processing

Real-time event processing directly in Atlas — process data from Atlas clusters or Kafka:

```javascript
// Create a Stream Processor (Atlas UI or Atlas CLI)
// Sources: Atlas collection change stream, Kafka topic
// Sinks: Atlas collection, Kafka topic, $emit (dead letter)

// Example: filter high-value orders from a Kafka topic and write to Atlas
{
  "name": "high-value-orders-processor",
  "pipeline": [
    { "$source": { "connectionName": "kafka-prod", "topic": "orders" } },
    { "$match": { "total": { "$gt": 1000 } } },
    { "$addFields": { "processedAt": { "$now": {} } } },
    { "$emit": { "connectionName": "atlas-cluster", "db": "analytics", "coll": "high_value_orders" } }
  ]
}
```

---

## Atlas Backups and Point-in-Time Restore

```
M10+ clusters: Continuous Cloud Backup (default)
• Continuous oplog backup — point-in-time restore to any second
• Stored in Atlas-managed cloud storage (same region)

Snapshots:
• Hourly snapshots for 2 days
• Daily snapshots for 7 days
• Weekly snapshots for 4 weeks
• Monthly snapshots for 12 months
(All configurable)

Restore options:
• Restore to existing cluster (replaces data)
• Restore to new cluster
• Download snapshot as .tar.gz (mongodump format)
• Query on Snapshots (Atlas Data Federation) — query backup without restoring
```

```bash
# Trigger a manual backup snapshot via Atlas CLI
atlas clusters snapshots create myCluster --desc "Pre-migration snapshot"

# List snapshots
atlas clusters snapshots list myCluster

# Restore to a point in time
atlas clusters restore start myCluster --snapshotId <snapshotId> --pointInTimeUTCSeconds 1690000000
```

---

## Atlas Performance Advisor

The Performance Advisor automatically analyzes slow queries and suggests index improvements:

```
Slow query threshold: 100ms (configurable)

For each slow query, Performance Advisor shows:
• The query shape
• Number of times executed in the past 24h
• Average execution time
• Suggested index with estimated improvement

To act on a suggestion:
Atlas UI → Performance Advisor → Create Suggested Indexes
```

```javascript
// Equivalent to running this manually:
db.orders.explain("executionStats").find({ status: "pending", createdAt: { $lt: new Date() } })
// Performance Advisor automates this across all slow queries
```

---

## Atlas App Services

Serverless backend features built on top of Atlas:

### Database Triggers

```javascript
// Trigger fires on insert/update/delete
exports = async function(changeEvent) {
  const { operationType, fullDocument, documentKey } = changeEvent

  // Send email on new order
  if (operationType === "insert") {
    await context.services.get("email").send({
      to: fullDocument.customerEmail,
      subject: `Order Confirmation #${documentKey._id}`,
      body: `Your order of $${fullDocument.total} has been placed.`
    })
  }
}
```

### Scheduled Triggers

```javascript
// Run a function on a schedule (cron expression)
// "0 */6 * * *" = every 6 hours
exports = async function() {
  const db = context.services.get("mongodb-atlas").db("shop")

  // Cleanup expired sessions
  await db.collection("sessions").deleteMany({
    expiresAt: { $lt: new Date() }
  })
}
```

### Atlas Functions

```javascript
// HTTP endpoint backed by Atlas Function
exports = async function({ query, body }) {
  const db = context.services.get("mongodb-atlas").db("shop")

  const searchTerm = query.q
  const results = await db.collection("products").aggregate([
    { $search: { text: { query: searchTerm, path: "name" } } },
    { $limit: 10 },
    { $project: { name: 1, price: 1, score: { $meta: "searchScore" } } }
  ]).toArray()

  return { results }
}
```

---

## Atlas Data Federation

Query across multiple Atlas clusters, S3 buckets, and Atlas Data Lake with standard MongoDB query language:

```javascript
// Federated database instance — maps external data sources to virtual collections
// Configure in Atlas UI or via API

// Query S3 data as if it were a MongoDB collection
db.getSiblingDB("federation").getCollection("s3_orders_archive").find({
  createdAt: { $lt: ISODate("2025-01-01") }
})

// Union Atlas live data with S3 archive in one query (via $unionWith)
db.orders.aggregate([
  { $match: { createdAt: { $gte: ISODate("2026-01-01") } } },
  {
    $unionWith: {
      coll: "s3_orders_archive",  // S3-backed virtual collection
      pipeline: [
        { $match: { createdAt: { $lt: ISODate("2026-01-01"), $gte: ISODate("2025-01-01") } } }
      ]
    }
  }
])
```

---

## Common Pitfalls

1. **Using M0 or shared tiers for production.** Shared clusters have no performance guarantees, no private networking, and no SLAs. Any meaningful production workload needs M10+.
2. **Forgetting to configure Private Endpoints.** Public Atlas clusters are accessible from the internet. Always configure VPC Peering or Private Endpoints for production; use IP Access List as a minimum.
3. **Atlas Search index out of sync.** Atlas Search indexes are eventually consistent with the collection (seconds to minutes delay). For real-time requirements, use a MongoDB index (exact match) not `$search`.
4. **Building an Atlas Search index on every field.** Dynamic mappings index everything but are slow to build and large. Use explicit field mappings — only index what you search.
5. **Large vector dimensions.** Storing 1536-dimensional vectors per document at scale is expensive. Consider dimensionality reduction (e.g., 256 dimensions for many use cases) or quantization.
6. **Not enabling Continuous Backup.** Without backups, a bug, ransomware, or accidental deletion is unrecoverable. Enable continuous backup on M10+ from day one.

---

## Review Questions

1. What is the difference between a MongoDB text index and an Atlas Search index? When would you choose one over the other?
2. Describe the Atlas Vector Search workflow end-to-end: from storing documents to performing a semantic similarity query. What must be done before `$vectorSearch` can return results?
3. A startup uses MongoDB Atlas M0 and is moving to production. What cluster tier should they choose, what networking configuration should they add, and what backup policy should they enable?

#MongoDB #NoSQL #Atlas #AtlasSearch #VectorSearch #Cloud #ManagedDatabase
