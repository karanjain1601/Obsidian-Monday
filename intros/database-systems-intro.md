# Database Systems: Introduction to All Topics

This document is a guided tour of the 6 sections in the Database Systems knowledge base — a production-focused reference for engineers designing schemas, writing queries, optimizing performance, and reasoning about distributed data. The content targets staff-level engineers and covers relational databases, NoSQL systems, distributed theory, and the modern analytics stack.

---

## 01. Relational & SQL

The foundation of every data-intensive role. Start here to build deep fluency in SQL and a precise mental model of how relational databases actually work under the hood.

**What's covered:**
- **SQL Fundamentals** — The four sublanguage families (DDL, DML, DCL, TCL); PostgreSQL data types and constraints; UPSERT via `ON CONFLICT DO UPDATE`; the SELECT logical processing order (FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT); NULL three-valued logic and COALESCE/NULLIF; conditional aggregates with FILTER.
- **Joins & Subqueries** — All five join types as controlled Cartesian products; physical join algorithms (nested-loop O(N×M), hash join O(N+M), sort-merge O(N log N + M log M)); correlated vs uncorrelated subqueries; the O(N²) danger of correlated subqueries; the NOT IN NULL trap; LATERAL joins for top-N per group.
- **Transactions & ACID** — ACID properties mapped to PostgreSQL mechanisms (WAL, MVCC, constraints); the four isolation anomalies (dirty read, non-repeatable read, phantom read, write skew); PostgreSQL MVCC internals (xmin/xmax hidden fields, snapshot visibility); SSI for write-skew prevention; deadlock detection.
- **Window Functions** — OVER clause anatomy (PARTITION BY, ORDER BY, frame spec); ranking functions (ROW_NUMBER, RANK, DENSE_RANK, NTILE); offset functions (LAG, LEAD, FIRST_VALUE, LAST_VALUE); frame modes ROWS vs RANGE vs GROUPS; the LAST_VALUE gotcha; running totals and YoY growth patterns.
- **Advanced SQL** — CTEs and the PostgreSQL 12+ inlining vs MATERIALIZED distinction; recursive CTEs for tree/graph traversal; MERGE (PostgreSQL 15+) and upsert patterns; PIVOT/UNPIVOT via conditional aggregation and LATERAL(VALUES); JSONB operators and GIN indexing; full-text search with tsvector/tsquery and ts_rank; expression indexes for sargable predicates.

**Key mental models:** The SELECT logical processing order; NULL propagation rules; isolation anomaly → isolation level mapping; window function frame behavior.

---

## 02. Database Design

Schema design is the discipline that determines whether a system stays maintainable at scale. Get this right before worrying about query performance.

**What's covered:**
- **ER Modeling** — Entities (strong vs weak), attributes, and relationship cardinality (1:1, 1:N, M:N); participation constraints (total → NOT NULL FK, partial → nullable FK); Chen vs Crow's Foot notation; ER-to-relational mapping rules; three inheritance strategies (single-table STI, class-table CTI, concrete-table) with trade-off comparison; surrogate vs natural key choice; the EAV anti-pattern and JSONB as the alternative.
- **Normalization** — Functional dependency algebra and Armstrong's axioms; attribute closure algorithm for candidate key detection; 1NF through 5NF ladder (atomic → no partial deps → no transitive deps → every determinant is a superkey → no MVDs → no join dependencies); why BCNF decomposition can lose dependency preservation and why 3NF is the common production stopping point; when and how to denormalize deliberately.
- **Schema Patterns** — Hierarchy storage encodings (adjacency list, materialized path, nested sets, closure table) with read/write trade-offs; audit logging levels (shadow table, system-versioned temporal, bitemporal); soft deletes with partial unique indexes; three multi-tenancy architectures (shared-schema + Row-Level Security, schema-per-tenant, database-per-tenant); polymorphic FK anti-pattern and cleaner alternatives.
- **Partitioning** — Horizontal vs vertical partitioning; declarative partitioning strategies (RANGE, LIST, HASH) with DDL examples; partition pruning (plan-time vs run-time) and the critical rule that partition key must appear in WHERE; local vs global indexes; metadata-only lifecycle operations (DETACH/ATTACH); TimescaleDB hypertables for automatic chunk management.
- **Indexing Design** — B-tree mechanics (balanced, high fanout, linked leaves) and the tree height formula; selectivity crossover (when a sequential scan wins); composite index leftmost-prefix rule; covering indexes with INCLUDE for index-only scans; partial indexes for subset filtering and partial unique constraints; expression indexes; bloat management via VACUUM and REINDEX CONCURRENTLY; FK column indexing rule.

**Key mental models:** Normalize to 3NF as source of truth, then denormalize specific hot read paths; "indexes are a write tax"; partition key must appear in WHERE for pruning to work; pick the hierarchy storage encoding from your read/write ratio.

---

## 03. Query Optimization

Declarative SQL hides execution. This section teaches you to read what the planner decided, diagnose why it went wrong, and fix it at the right layer.

**What's covered:**
- **Execution Plans** — PostgreSQL query pipeline (Parse → Analyze → Rewrite → Plan → Execute); cost model GUC constants (seq_page_cost, random_page_cost, cpu_*_cost); cost formulas for Seq Scan and Index Scan with the selectivity-driven crossover; node taxonomy: scans (Seq Scan, Index Scan, Index Only Scan, Bitmap Heap Scan), joins (Nested Loop, Hash Join, Merge Join), aggregates (HashAgg, SortAgg); EXPLAIN (ANALYZE, BUFFERS) output anatomy; auto_explain and pg_hint_plan.
- **Statistics & Cardinality** — pg_statistic / pg_stats columns (null_frac, n_distinct, most_common_vals, histogram_bounds, correlation); estimation pipeline from reltuples to estimated rows; equality estimation via MCV lookup; range estimation via equi-depth histogram with linear interpolation; the independence assumption error for multiple predicates; extended statistics (CREATE STATISTICS) for multi-column MCVs, dependencies, and ndistinct; how to diagnose and fix bad estimates.
- **Index Types** — B-tree (default, ranges, ORDER BY, LIKE prefix); Hash (equality-only, O(1) expected, niche); GIN (inverted index for JSONB, arrays, full-text — fastupdate pending list, jsonb_path_ops for smaller @> index); GiST (spatial/overlap data, PostGIS geometry, nearest-neighbor ORDER BY <->); BRIN (Block Range min/max, O(N/128) size, requires high physical correlation); decision chart for choosing the right type.
- **Query Rewriting** — Automatic planner transformations (predicate pushdown, subquery flattening to semi-join, join reordering via dynamic programming up to join_collapse_limit=8); CTE inlining vs MATERIALIZED fence; EXISTS vs COUNT(*) > 0 for presence checks; the big rewrite: correlated SELECT-list subquery → LATERAL join → window function (O(N²) → O(N log N)); sort elimination via covering index ORDER BY; planner GUC overrides (enable_seqscan=off) vs MySQL hints.
- **Connection Pooling** — PostgreSQL process-per-connection model and its memory scaling (~5MB × N); PgBouncer's three modes (session/transaction/statement) with the transaction-mode leverage point; pool sizing via Little's Law (N = λ × W); prepared statement plan caching; saturation condition; diagnostics with pg_stat_activity and pg_locks.

**Key mental models:** Run EXPLAIN ANALYZE, not plain EXPLAIN; bad estimates are the root cause of bad plans; fix cardinality first (statistics), then rewrite the query, then add or remove indexes; connection pools reduce overhead but require stateless query execution.

---

## 04. NoSQL Databases

Each NoSQL system optimizes for a specific data model and access pattern. Pick based on what you're storing and how you'll query it — not on hype.

**What's covered:**
- **MongoDB** — BSON document model (typed fields, 16MB limit, ObjectId structure); embedding vs referencing decision framework; aggregation pipeline stages ($match, $group, $lookup, $unwind, $graphLookup, $setWindowFields); WiredTiger MVCC engine; index types (compound, multikey, text, 2dsphere, wildcard, TTL); replica set topology (PSS, oplog, majority election quorum); sharded cluster (mongos → CSRS → shard replica sets, hashed vs ranged shard keys, jumbo chunk problem).
- **Redis** — All 8 data structures with backing implementation, commands, and use case; RDB vs AOF persistence trade-offs; Redis Cluster (16384 hash slots via CRC16, MOVED/ASK redirects, hash tags for multi-key atomicity); key patterns: cache-aside, write-through, distributed lock (SET NX PX + Lua CAS delete), sliding-window rate limiting (ZSet or INCR+EXPIRE), pub/sub, Lua scripting for atomicity; HyperLogLog error formula (≈0.81% at m=16384).
- **Cassandra** — Data model (keyspace → table → partition key + clustering columns); Murmur3 hashing to token ring with RF=3 replication; virtual nodes for even distribution; CQL restrictions (no joins, full partition key in WHERE, ALLOW FILTERING is dangerous); consistency levels and the strong consistency formula (W + R > N); compaction strategies (STCS for write-heavy, LCS for read-heavy, TWCS for time-series); tombstones and gc_grace_seconds.
- **DynamoDB** — Simple vs composite primary key designs; capacity units (WCU = 1KB/s, RCU = 4KB strongly-consistent or 0.5 RCU eventually); single-table design with entity-type-prefixed PK/SK overloading; GSI vs LSI trade-offs (consistency, throughput, 10GB LSI limit); DynamoDB Streams for CDC and Lambda triggers; TransactWriteItems/TransactGetItems for multi-item atomicity at 2× WCU cost; ExclusiveStartKey pagination and parallel scan.
- **Neo4j** — Property graph model (nodes, typed directed relationships, index-free adjacency for O(1)/hop pointer-following vs O(N log N)/join in RDBMS); Cypher pattern matching syntax; MATCH/MERGE/OPTIONAL MATCH/WITH/UNWIND; variable-length paths and shortestPath(); Graph Data Science library algorithms (PageRank with d=0.85 damping, Louvain community detection, betweenness centrality, link prediction); use cases: fraud ring detection, recommendation, knowledge graph, social network.

**Key mental models:** MongoDB: embed when bounded + read together, reference when unbounded or shared; Cassandra: design tables for your queries, not your data; DynamoDB: single-table design with entity-prefixed keys; Redis: TTL everything, use Lua for atomicity; Neo4j: graph queries outperform recursive SQL joins at depth > 3.

---

## 05. Distributed Databases

Distributing data across nodes unlocks horizontal scale and geo-redundancy but introduces partial failures, partitions, replication lag, and consensus complexity. This section builds the theory and the practical playbook.

**What's covered:**
- **CAP & PACELC** — CAP theorem precisely stated (C = linearizability, A = every non-failing node responds, P = survives dropped messages); Gilbert-Lynch proof by contradiction; CP vs AP system classification; PACELC framework (Partition → A vs C; Else → Latency vs Consistency); system classification (DynamoDB=PA/EL, HBase=PC/EC, Cassandra=PA or PC/EL); CRDTs (state-based convergent vs op-based commutative/idempotent) with G-Counter, PN-Counter, LWW-Register, OR-Set examples.
- **Sharding** — Four strategies: range (ordered scans, hotspot on sequential keys), hash (uniform, no range queries), directory (flexible, bottleneck risk), geographic (locality, skew risk); the naive modulo resize problem ((N-1)/N keys remapped); consistent hashing (ring of 2^32 positions, add/remove moves K/N keys); virtual nodes (150/physical, std-dev ∝ 1/√m) for load balance; hot-shard solutions (random suffix, shard splitting, dedicated handling); scatter-gather cross-shard queries.
- **Replication** — Three topologies (single-leader, multi-leader, leaderless); replication log formats (statement-based, WAL shipping, logical/row-based) with non-determinism and version-coupling trade-offs; sync vs async vs semi-synchronous; multi-leader conflict resolution (last-write-wins, CRDT, custom application logic); Dynamo-style leaderless quorum (W+R>N), read repair, anti-entropy, sloppy quorum, hinted handoff; read-your-writes and monotonic read consistency guarantees.
- **Consensus (Raft & Paxos)** — Replicated state machine model; quorum math (Q = ⌈(N+1)/2⌉, tolerates f = ⌊(N-1)/2⌋ failures); Raft leader election (term-based logical clocks, randomized 150-300ms timeout, log-up-to-date requirement); log replication (AppendEntries RPC, commitIndex vs lastApplied distinction, majority ack before commit); Log Matching Property; failure scenarios (leader crash mid-commit, split-brain prevention); log compaction via snapshots; Paxos vs Raft comparison; etcd, CockroachDB, TiKV as real implementations.
- **NewSQL** — NewSQL definition: ACID + horizontal scale + SQL on a distributed KV engine (Raft/MVCC); CockroachDB (Pebble LSM → Raft-replicated 64MB ranges → MVCC serializable transactions → stateless SQL layer; geo-partitioning; follower reads via AS OF SYSTEM TIME); TiDB (stateless TiDB SQL + TiKV + PD + TiFlash for HTAP; MySQL protocol compatible); Spanner (TrueTime GPS+atomic clocks with ±7ms uncertainty, external consistency via commit-wait adding 2ε≈14ms, INTERLEAVE IN PARENT colocation).

**Key mental models:** CAP C is linearizability, not ACID C — don't conflate them; W=R=1 in Dynamo quorum is not strong consistency; Raft quorums guarantee safety even when leaders crash mid-commit; NewSQL systems pay latency (commit-wait, quorum RTT) to give you ACID at scale.

---

## 06. Data Warehousing & Analytics

The modern analytics stack has fundamentally different physics from OLTP. Columnar storage, MPP query engines, and open table formats replace the row-store mental model entirely.

**What's covered:**
- **OLAP & Columnar Storage** — OLTP vs OLAP workload comparison (access pattern, rows/columns per query, write pattern, compression); row-store vs column-store I/O advantage (40-column table: ~40× I/O reduction for single-column queries); compression techniques with formulas (RLE ratio ≈ L/2 for sorted runs, dictionary encoding ratio ≈ 32/log₂(D), delta encoding, bit-packing); Parquet format (128MB row groups, column chunks, 1MB pages, Dremel repetition/definition levels, column min/max stats for predicate pushdown); Apache Arrow in-memory columnar (zero-copy IPC, SIMD-friendly, Flight protocol); vectorized execution (column-at-a-time in CPU-cache-sized batches of 1024-8192 rows vs Volcano single-row model).
- **Star & Snowflake Schema** — Fact table design (grain declaration, additive/semi-additive/non-additive measures, degenerate dimensions, factless fact tables); dimension tables (wide denormalized attributes, surrogate keys); SCD Type 1/2/3 with history and cost comparison — Type 2 as the workhorse (new row per change, effective_date/expiry_date/is_current, surrogate key pointing historical facts to period-correct dimension version); star schema (one hop, fewer joins, query simplicity) vs snowflake schema (normalized hierarchies, less storage, more joins); Kimball bus matrix and conformed dimensions vs Inmon 3NF EDW.
- **dbt** — dbt philosophy: T in ELT, SQL-first, analysts write SELECT, dbt generates DDL/DML, Git-versioned, testable; four materializations (view, table, incremental with IS_INCREMENTAL() MERGE, ephemeral CTE injection); sources and seeds with freshness checks; testing framework (not_null, unique, accepted_values, relationships in YAML; custom SQL data tests; dbt-expectations package); Jinja templating (ref(), source(), config(), macros for DRY SQL); DAG dependency resolution and lineage; dbt docs generate/serve; packages (dbt_utils, dbt_audit_helper).
- **BigQuery & Redshift** — BigQuery: Dremel-descended architecture, Capacitor columnar storage on Colossus, slot-based execution (CPU+RAM units), storage/compute separation, on-demand (per byte scanned) vs capacity/slots pricing; partitioning for date-range pruning (require_partition_filter); clustering for block pruning in up to 4 columns; materialized views with transparent query rerouting; INFORMATION_SCHEMA.JOBS for cost governance. Redshift: MPP cluster, distribution styles (KEY/EVEN/ALL), sort keys (compound vs interleaved), VACUUM ANALYZE for space reclaim and stats freshness.
- **Data Lakehouse** — Lakehouse formula (object storage + Parquet + transaction log + any query engine); Delta Lake (_delta_log JSON commits with add/remove/metaData actions, Parquet checkpoint every 10 commits, optimistic concurrency, time travel via VERSION/TIMESTAMP AS OF, OPTIMIZE with Z-order clustering); Apache Iceberg (snapshot-based catalog → manifest list → manifest files → data files, hidden partitioning without partition columns in queries, partition evolution without rewrite, row-level deletes); Apache Hudi (CoW full rewrite vs MoR log-file merge at read, timeline of instants, incremental queries); table format selection: Delta for Spark-native, Iceberg for engine-agnostic (Flink/Trino), Hudi for CDC streaming upserts.

**Key mental models:** Bytes scanned = cost in BigQuery — partition and cluster every table; fact-to-fact joins produce Cartesian products; SCD Type 2 is the default for slowly-changing dimensions; small files in object storage kill query performance (OPTIMIZE/COMPACT regularly); Parquet column stats enable predicate pushdown even before data is read.

---

## Cross-Cutting Mental Models

These four principles are explicitly threaded through every section and are the most likely interview discussion points:

1. **ACID vs BASE** — ACID (Atomicity, Consistency, Isolation, Durability) is the contract relational databases and NewSQL systems offer. BASE (Basically Available, Soft state, Eventually consistent) is what most distributed NoSQL systems actually provide. Understanding when you need each is more important than memorizing definitions.

2. **CAP Theorem** — Under a network partition, you must choose between consistency (linearizability) and availability. Most systems let you tune this per operation (quorum reads/writes). Do not confuse CAP-C (linearizability) with ACID-C (domain integrity) — they are completely different properties.

3. **Access patterns drive design** — For relational systems: normalize first, then denormalize hot read paths. For NoSQL systems: design your tables and keys around your queries before you write a single row. Cassandra and DynamoDB punish schema-first thinking severely.

4. **Indexes are a write tax** — Every index you add speeds up reads and slows down writes. The right number of indexes is not "as many as possible" — it's the minimum set that satisfies your query SLOs, verified by checking pg_stat_user_indexes.idx_scan = 0 for candidates to drop.
