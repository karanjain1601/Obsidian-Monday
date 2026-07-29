---
title: Cluster Architecture
aliases: [ES Cluster, Node Roles, Hot Warm Cold Architecture, Shard Sizing, Split Brain]
tags: [Elasticsearch, Search, ELK, ClusterArchitecture, Operations]
domain: Elasticsearch
difficulty: Advanced
created: 2026-07-29
related: [Core_Concepts, Indexing_Strategies, Performance_Tuning, Security_and_Monitoring, _MOC_Elasticsearch_Master, _MOC_SystemDesign_Master]
status: complete
---

# Cluster Architecture

> [!abstract] TL;DR
> Elasticsearch clusters scale horizontally by adding nodes with specific roles. Hot-warm-cold tiering balances query performance vs. storage cost. Shard sizing (20–40 GB) and avoiding shard sprawl are the most impactful operational decisions. Dedicated master nodes prevent split-brain in large clusters.

## Node Roles

Each node can have one or more roles, configured in `elasticsearch.yml`:

```yaml
# elasticsearch.yml
node.roles: [ data_hot, ingest ]
```

| Role | Config value | Responsibility |
|------|-------------|---------------|
| **Master-eligible** | `master` | Can be elected master; manages cluster state (no data) |
| **Data** | `data` | Stores shards, executes search/indexing |
| **Data (tiered)** | `data_hot` / `data_warm` / `data_cold` / `data_frozen` | Tiered storage role |
| **Ingest** | `ingest` | Runs ingest pipelines (transform docs before indexing) |
| **Coordinating** | _(no role)_ | Routes requests, merges results; all nodes are coordinating by default |
| **ML** | `ml` | Runs anomaly detection and NLP models |
| **Remote cluster client** | `remote_cluster_client` | For cross-cluster search/replication |
| **Voting-only** | `voting_only` | Participates in master election but can't be elected |

### Small cluster (dev / small prod)

```
All 3 nodes: master + data + ingest (any node does everything)
```

### Large cluster (production)

```
3 dedicated master nodes (no data)  ← prevent master instability
2-3 coordinating nodes              ← handle client load
N data_hot nodes (SSD)
M data_warm nodes (HDD)
K data_cold nodes (HDD, fewer)
```

## Hot-Warm-Cold Architecture

Data tiers align hardware cost with data access patterns:

```
Write → Hot tier → Warm tier → Cold tier → Frozen tier → Delete
         (SSD)       (HDD)       (HDD)      (Object store)
```

| Tier | Hardware | Replicas | Search speed | Indexing? | Typical age |
|------|----------|----------|-------------|-----------|-------------|
| Hot | NVMe SSD | 1+ | Fastest | Yes | 0–7 days |
| Warm | HDD | 1 (or 0) | Good | No | 7–30 days |
| Cold | HDD | 0 | Acceptable | No | 30–90 days |
| Frozen | S3/GCS/Azure | 0 | Slow (fetch from store) | No | 90d+ |

Configure via ILM policy + node tier attributes:

```yaml
# hot node
node.roles: [ data_hot ]
node.attr.data: hot

# warm node
node.roles: [ data_warm ]
node.attr.data: warm
```

```json
PUT _ilm/policy/logs-tiering
{
  "policy": {
    "phases": {
      "hot":    { "actions": { "rollover": { "max_size": "50gb", "max_age": "1d" },
                              "set_priority": { "priority": 100 } } },
      "warm":   { "min_age": "7d",  "actions": { "allocate": { "require": { "data": "warm" } },
                                                  "shrink": { "number_of_shards": 1 } } },
      "cold":   { "min_age": "30d", "actions": { "allocate": { "require": { "data": "cold" } },
                                                  "freeze": {} } },
      "frozen": { "min_age": "90d", "actions": { "searchable_snapshot": { "snapshot_repository": "s3-repo" } } },
      "delete": { "min_age": "365d","actions": { "delete": {} } }
    }
  }
}
```

## Shard Sizing

### Rules of thumb

| Rule | Target |
|------|--------|
| Shard size | 20–40 GB per shard |
| Shard count | ≤ 20 shards per GB of heap |
| Total shards per node | < 1,000 (keep closer to 200–500) |
| Max index size | ≈ shards × 40 GB |

### Shard sprawl — the biggest Elasticsearch anti-pattern

Shard sprawl = too many small shards. Each shard is a Lucene index with overhead:
- 1–2 MB heap per shard
- File descriptors, CPU for background merges
- Slows cluster state updates (every shard tracked in cluster state)

**Causes:** Daily index rollover creating many small indices, too many primary shards at creation.

**Solutions:**
- Rollover on size (50 GB) rather than purely on time
- Shrink API after data moves to warm tier
- Merge small indices with `_reindex`
- Use ILM `shrink` action

```bash
# Check shard sizes
GET /_cat/shards?v&h=index,shard,prirep,store&s=store:desc

# Check shards per node
GET /_cat/nodes?v&h=name,shards,heap.percent,disk.used_percent
```

## Cluster State and Master Election

The **cluster state** includes all index metadata, shard locations, node membership. Only the **elected master** writes cluster state changes.

### Master election (Raft-based since ES 7.0)

- Requires a **quorum** of master-eligible nodes: `(N/2) + 1`
- 3 master nodes = quorum of 2 (can lose 1 and still elect)
- 2 master nodes = quorum of 2 (can't lose any — avoid 2-node clusters)
- Configuring `cluster.initial_master_nodes` bootstraps first election

```yaml
# elasticsearch.yml — 3-node master cluster
cluster.initial_master_nodes: ["master-1", "master-2", "master-3"]
```

### Split-brain (pre-7.0 problem)

Split-brain: two groups of nodes each elect their own master, causing data divergence. In older versions, prevented via `discovery.zen.minimum_master_nodes = (N/2)+1`. In ES 7.0+, the Raft-based consensus algorithm eliminates the `minimum_master_nodes` setting.

## Cluster Health and Monitoring Commands

```bash
# Cluster health
GET /_cluster/health?pretty
GET /_cluster/health?level=shards&pretty   # per-shard detail

# Node stats
GET /_cat/nodes?v&h=name,node.role,heap.percent,cpu,disk.used_percent
GET /_nodes/stats/jvm,indices,os

# Index stats
GET /_cat/indices?v&h=index,docs.count,store.size,pri,rep&s=store.size:desc
GET /_cat/shards?v&h=index,shard,prirep,state,store,node&s=store:desc

# Cluster-level stats
GET /_cluster/stats?pretty

# Pending tasks (should be near 0)
GET /_cluster/pending_tasks

# Allocation explanation (why is shard unassigned?)
GET /_cluster/allocation/explain
{
  "index": "my-index",
  "shard": 0,
  "primary": true
}
```

## Ingest Pipelines

Ingest nodes process documents before they reach data nodes:

```bash
PUT _ingest/pipeline/parse-logs
{
  "description": "Parse nginx access logs",
  "processors": [
    {
      "grok": {
        "field": "message",
        "patterns": ["%{IPORHOST:client_ip} - - \\[%{HTTPDATE:timestamp}\\] \"%{WORD:method} %{URIPATH:path} HTTP/%{NUMBER:http_version}\" %{NUMBER:status_code:int} %{NUMBER:bytes:int}"]
      }
    },
    { "date":   { "field": "timestamp", "formats": ["dd/MMM/yyyy:HH:mm:ss Z"] } },
    { "remove": { "field": "message" } },
    { "set":    { "field": "ingest_time", "value": "{{_ingest.timestamp}}" } }
  ]
}

# Use pipeline at index time
PUT /logs/_doc/1?pipeline=parse-logs
{ "message": "192.168.1.1 - - [29/Jul/2026:10:30:45 +0000] \"GET /api/v1/products HTTP/1.1\" 200 1234" }
```

## Common Pitfalls

- **Even number of master-eligible nodes** — 4 master nodes still need a quorum of 3; you need all 4 up to elect, so you gain no additional fault tolerance over 3. Use 3 or 5.
- **Dedicated master nodes with data role** — master nodes doing data work get overwhelmed, causing cluster instability; keep master nodes lean.
- **All nodes on same host/rack** — defeats the purpose of replicas; use shard allocation awareness (`cluster.routing.allocation.awareness.attributes: rack_id`).
- **Ignoring `_cat/shards` output** — UNASSIGNED shards need immediate investigation (`allocation/explain` API); yellow health can become red.
- **Frozen tier performance surprise** — frozen tier fetches data from object storage on every search; it's for compliance/audit, not interactive queries.

## Review Questions

1. What is split-brain, and how does Elasticsearch 7.0+ prevent it?
2. Why should you use an odd number (3 or 5) of master-eligible nodes?
3. What is the recommended shard size range, and what problems does shard sprawl cause?
4. What is the purpose of a coordinating-only node?
5. In a hot-warm-cold architecture, what triggers the transition between tiers?

#Elasticsearch #Search #ELK #ClusterArchitecture #Operations
