---
title: Data Storage Formats
aliases: [Storage Formats, Parquet, Avro, Delta Lake, Iceberg, Columnar Storage]
tags: [DataEngineering, Parquet, Avro, DeltaLake, Iceberg, StorageFormats]
domain: Data Engineering
difficulty: Intermediate
created: 2026-07-29
related: [Data_Engineering_Overview, Data_Modeling_for_Engineering, Distributed_Computing]
status: complete
---

# Data Storage Formats

> [!abstract] TL;DR
> Storage format choice is one of the highest-leverage decisions in data engineering — it directly determines query speed, storage cost, schema evolution capability, and streaming compatibility. Columnar formats (Parquet, ORC) dominate analytics due to column pruning, predicate pushdown, and compression benefits. Row formats (Avro, JSON) dominate event streaming. Open table formats (Delta Lake, Iceberg) add ACID transactions, time travel, and upsert/delete support to both, turning a raw object store into a full lakehouse.

## Row vs. Columnar Storage: The Fundamental Trade-off

Understanding why columnar storage dominates analytics requires understanding how data is physically laid out on disk and how query engines read it.

### Row Storage (OLTP-optimised)

In row storage, all columns of a single row are stored contiguously.

```
Row store layout on disk:
[order_id=1, customer="Alice", product="Widget", revenue=19.99, date=2024-01-01]
[order_id=2, customer="Bob",   product="Gadget", revenue=49.99, date=2024-01-01]
[order_id=3, customer="Alice", product="Widget", revenue=19.99, date=2024-01-02]
```

**To answer** `SELECT SUM(revenue) FROM orders WHERE date = '2024-01-01'`:
- Row store must read ALL bytes of every row (including customer, product, etc.)
- Then extract only the `revenue` column value
- For 1 billion rows, this means reading TBs of irrelevant data

**Where row stores win:**
- Point lookups: `SELECT * FROM orders WHERE order_id = 12345` — reads exactly one row
- High-concurrency writes: append, update, delete individual records efficiently
- OLTP patterns: banking transactions, application databases (PostgreSQL, MySQL)

### Columnar Storage (OLAP-optimised)

In columnar storage, all values for a single column are stored contiguously.

```
Columnar layout on disk:
[order_id column]: [1, 2, 3, 4, 5, ...]
[customer column]: ["Alice", "Bob", "Alice", "Charlie", "Bob", ...]
[revenue column]:  [19.99, 49.99, 19.99, 29.99, 49.99, ...]
[date column]:     [2024-01-01, 2024-01-01, 2024-01-02, 2024-01-01, 2024-01-02, ...]
```

**To answer** `SELECT SUM(revenue) FROM orders WHERE date = '2024-01-01'`:
1. **Column pruning** — Read only `revenue` and `date` columns; skip `order_id`, `customer`, `product` entirely.
2. **Predicate pushdown** — Check the `date` column's min/max statistics. If a row group has `min=2024-01-03`, skip the entire row group without reading it.
3. **Better compression** — Same data type per column → same-domain values compress much better.

**Where columnar stores win:**
- Aggregations over a subset of columns: `SUM`, `AVG`, `COUNT`, `GROUP BY`
- Queries with selective filters on indexed columns
- Analytics and reporting (virtually all data engineering use cases)

### Compression Comparison

Because columnar formats store values of the same type together, the data is highly compressible:

```
revenue column: [19.99, 19.99, 19.99, 49.99, 49.99, 29.99, ...]
→ Run-length encoding: [(19.99 × 3), (49.99 × 2), (29.99 × 1)]
→ Dictionary encoding: {0: 19.99, 1: 49.99, 2: 29.99} then [0,0,0,1,1,2]
```

| Format | Typical compression ratio | vs. raw CSV |
|---|---|---|
| CSV (uncompressed) | 1× | baseline |
| Parquet (Snappy) | 4–7× | 4–7× smaller |
| Parquet (ZSTD) | 6–10× | 6–10× smaller |
| ORC (ZLIB) | 5–8× | 5–8× smaller |

---

## Parquet Deep Dive

Apache Parquet is the dominant columnar format for data lakes and warehouses. Almost every data engineering tool can read and write Parquet.

### File Structure

```
Parquet File
├── Header (4-byte magic number: PAR1)
│
├── Row Group 1 (default 128 MB)
│   ├── Column Chunk: order_id
│   │   ├── Page 1 (default 1 MB)
│   │   │   ├── Page Header (encoding, num values, statistics)
│   │   │   └── Data Pages (encoded values)
│   │   └── Page 2 ...
│   ├── Column Chunk: revenue_usd
│   │   └── Pages ...
│   └── Column Chunk: date ...
│
├── Row Group 2 ...
│
└── File Footer
    ├── Row Group metadata (byte offsets to each column chunk)
    ├── Column statistics per row group (min, max, null_count, distinct_count)
    └── Schema (column names, types, nullability)
```

**Row Group** — The top-level horizontal slice. Default 128 MB. Increasing to 256–512 MB improves compression and scan throughput but increases memory requirements for writes.

**Column Chunk** — All values for one column within a row group. The unit of I/O — reading a column reads its full column chunk.

**Page** — The smallest unit of encoding/compression within a column chunk. Default 1 MB. Also the unit for dictionary encoding — each page can have its own dictionary.

### Column Statistics and Predicate Pushdown

Parquet stores per-row-group statistics in the footer:

```
Row Group 1:  date min=2024-01-01, date max=2024-01-07
Row Group 2:  date min=2024-01-08, date max=2024-01-14
Row Group 3:  date min=2024-01-15, date max=2024-01-21

Query: WHERE date = '2024-01-10'
→ Skip Row Group 1 entirely (max=2024-01-07 < 2024-01-10)
→ Skip Row Group 3 entirely (min=2024-01-15 > 2024-01-10)
→ Read only Row Group 2
```

This is **predicate pushdown** — the query engine pushes filter conditions into the file reader, skipping large portions of data without ever loading them.

> [!tip] Partition vs. Row Group filtering
> Hive-style partitioning (`/date=2024-01-10/`) skips entire files. Row group statistics skip within a file. Both are complementary — use partitioning for coarse filtering and good row group statistics for fine filtering.

### Encoding Schemes

**Dictionary Encoding** — Replace repeated values with integer codes. Highly effective for low-cardinality columns.

```
customer_segment: ["Enterprise", "SMB", "Enterprise", "SMB", "Enterprise", "Consumer"]
Dictionary: {0: "Enterprise", 1: "SMB", 2: "Consumer"}
Encoded:    [0, 1, 0, 1, 0, 2]  ← 4 bytes vs. 10+ bytes per string
```

**Run-Length Encoding (RLE)** — Compress runs of repeated values. Used for repetitive data and boolean columns.

```
is_active: [true, true, true, true, false, false, true, true]
RLE:       [(true × 4), (false × 2), (true × 2)]
```

**Bit Packing** — Encode small integers using fewer bits. An integer in range [0,15] only needs 4 bits, not 32.

**Delta Encoding** — Store deltas between consecutive values. Good for monotonically increasing IDs.

```
order_id: [10000, 10001, 10002, 10005, 10010]
Delta:    [10000, +1, +1, +3, +5]  ← smaller values compress better
```

### Compression Codecs

| Codec | Speed | Compression Ratio | CPU Cost | Best For |
|---|---|---|---|---|
| **Snappy** | Fastest | Moderate (4–5×) | Very low | Default for most pipelines; good balance |
| **LZ4** | Fastest | Moderate (3–4×) | Lowest | Real-time workloads, very CPU-constrained |
| **ZSTD** | Fast | Best (6–10×) | Medium | Storage-cost-sensitive; recommended for cold data |
| **Gzip** | Slow | Very high | High | Maximum compression; archived data |
| **Brotli** | Slow | Very high | High | Web transfers; rarely used in data engineering |

```python
# PySpark: write Parquet with ZSTD compression (recommended for production)
df.write \
    .option("compression", "zstd") \
    .option("parquet.block.size", str(256 * 1024 * 1024))  # 256 MB row groups \
    .parquet("s3://datalake/silver/orders/")

# Read with column pruning and predicate pushdown (automatic)
from pyspark.sql.functions import col
orders = spark.read.parquet("s3://datalake/silver/orders/")
revenue = orders.filter(col("date") == "2024-01-10").select("order_id", "revenue_usd")
# Spark will automatically skip row groups where date statistics don't match
```

### Nested Data: Dremel Encoding

Parquet handles nested structs and arrays using Dremel encoding (definition levels + repetition levels). This allows efficient storage of JSON-like nested data in columnar format.

```
Schema:
message order {
  required string order_id;
  repeated group line_items {
    required string product_id;
    required double price;
  }
}

Dremel definition level (how deep the path is defined):
line_items.price: [2, 2, 2, 0, 2]   # 0 = null at this level, 2 = fully defined

Dremel repetition level (at what level a value repeats):
line_items.price: [0, 1, 1, 0, 0]   # 0 = new record, 1 = repeated in same array
```

---

## Avro Deep Dive

Apache Avro is a row-oriented binary serialisation format. It is the dominant choice for **event streaming** (Kafka) due to its compact encoding, embedded schema, and excellent schema evolution support.

### File Structure

```
Avro File
├── Header
│   ├── Magic bytes (Obj\x01)
│   ├── Schema (JSON, stored in metadata)
│   └── Codec (snappy/deflate/null)
│
├── Data Block 1
│   ├── Object count
│   ├── Block byte length
│   └── Binary-encoded rows (compact, schema-guided)
│
├── Data Block 2 ...
│
└── Sync marker (16 bytes, marks block boundaries for splittability)
```

**Key property:** Schema is embedded in the file header. Readers can always decode the file because the schema is right there — no external schema registry needed for standalone files.

### Schema Evolution

Avro's schema evolution is its killer feature for streaming. A producer can change its schema and consumers can still read old messages — as long as the evolution is compatible.

```json
// Version 1 schema (original)
{
  "type": "record",
  "name": "OrderEvent",
  "namespace": "com.company.events",
  "fields": [
    {"name": "order_id",    "type": "string"},
    {"name": "customer_id", "type": "string"},
    {"name": "revenue",     "type": "double"}
  ]
}

// Version 2 schema (adds field with default → BACKWARD compatible)
{
  "type": "record",
  "name": "OrderEvent",
  "namespace": "com.company.events",
  "fields": [
    {"name": "order_id",    "type": "string"},
    {"name": "customer_id", "type": "string"},
    {"name": "revenue",     "type": "double"},
    {"name": "currency",    "type": "string", "default": "USD"}
  ]
}
```

**Compatibility rules:**
- **BACKWARD compatible** — New schema can read old data. Add fields with defaults, delete fields without defaults.
- **FORWARD compatible** — Old schema can read new data. Delete fields with defaults, add fields without defaults.
- **FULL compatible** — Both directions. Add/delete fields with defaults only.
- **BREAKING changes** — Rename a field, change a field's type, remove a field without a default.

### Kafka + Schema Registry

```python
# Producer: register schema and send Avro-encoded messages
from confluent_kafka import Producer
from confluent_kafka.schema_registry import SchemaRegistryClient
from confluent_kafka.schema_registry.avro import AvroSerializer
from confluent_kafka.serialization import SerializationContext, MessageField

schema_registry_client = SchemaRegistryClient({"url": "http://schema-registry:8081"})

order_schema_str = """
{
  "type": "record",
  "name": "OrderEvent",
  "fields": [
    {"name": "order_id", "type": "string"},
    {"name": "customer_id", "type": "string"},
    {"name": "revenue", "type": "double"}
  ]
}
"""

avro_serializer = AvroSerializer(schema_registry_client, order_schema_str)
producer = Producer({"bootstrap.servers": "kafka:9092"})

order_event = {"order_id": "ord_001", "customer_id": "cust_123", "revenue": 99.99}
producer.produce(
    topic="orders",
    value=avro_serializer(order_event, SerializationContext("orders", MessageField.VALUE))
)
```

---

## Delta Lake Table Format

Delta Lake, originally from Databricks and now open-source (Linux Foundation), is the most widely adopted open table format. It wraps Parquet files with a transaction log to provide ACID semantics on object stores.

### Architecture: Parquet + Transaction Log

```
s3://datalake/silver/orders/
├── _delta_log/                          ← transaction log directory
│   ├── 00000000000000000000.json        ← commit 0: initial CREATE TABLE
│   ├── 00000000000000000001.json        ← commit 1: first INSERT
│   ├── 00000000000000000002.json        ← commit 2: UPDATE (rewrites affected files)
│   ├── 00000000000000000010.checkpoint.parquet  ← checkpoint: snapshot of state
│   └── _last_checkpoint                 ← pointer to latest checkpoint
│
├── date=2024-01-01/
│   ├── part-00000-abc123.snappy.parquet
│   └── part-00001-def456.snappy.parquet
└── date=2024-01-02/
    └── part-00000-ghi789.snappy.parquet
```

Each commit JSON file records `add` and `remove` actions:

```json
// commit 2: UPDATE 3 rows in partition date=2024-01-01
{
  "commitInfo": {"timestamp": 1706054400000, "operation": "UPDATE"},
  "remove": {"path": "date=2024-01-01/part-00000-abc123.snappy.parquet", "deletionTimestamp": 1706054400000},
  "add":    {"path": "date=2024-01-01/part-00000-xyz999.snappy.parquet", "stats": {...}}
}
```

### Delta Lake Features

**ACID Transactions** — Serialisable isolation. Concurrent readers never see partial writes.

```python
from delta.tables import DeltaTable
from pyspark.sql.functions import col

# MERGE INTO (upsert) — atomic operation
delta_table = DeltaTable.forPath(spark, "s3://datalake/silver/orders")

delta_table.alias("target").merge(
    updates_df.alias("source"),
    "target.order_id = source.order_id"
).whenMatchedUpdateAll() \
 .whenNotMatchedInsertAll() \
 .execute()
```

**Time Travel** — Query any historical version of the table.

```python
# Read table as it was 24 hours ago
df_yesterday = spark.read \
    .format("delta") \
    .option("timestampAsOf", "2024-01-09 00:00:00") \
    .load("s3://datalake/silver/orders")

# Read a specific version
df_v5 = spark.read \
    .format("delta") \
    .option("versionAsOf", 5) \
    .load("s3://datalake/silver/orders")

# SQL time travel
spark.sql("""
    SELECT * FROM silver.orders VERSION AS OF 5
""")
```

**Schema Enforcement and Evolution**

```python
# Schema enforcement: default behaviour — reject writes with mismatched schema
df_with_new_col.write.format("delta").mode("append").save("s3://datalake/silver/orders")
# → AnalysisException: A schema mismatch detected when writing to the Delta table

# Schema evolution: allow adding new columns
df_with_new_col.write \
    .format("delta") \
    .mode("append") \
    .option("mergeSchema", "true") \
    .save("s3://datalake/silver/orders")
```

**Change Data Feed (CDF)** — Expose row-level changes (insert/update/delete) for CDC downstream consumers.

```python
# Enable CDF when creating or altering a table
spark.sql("""
    ALTER TABLE silver.orders
    SET TBLPROPERTIES (delta.enableChangeDataFeed = true)
""")

# Read changes since version 5
changes_df = spark.read.format("delta") \
    .option("readChangeData", "true") \
    .option("startingVersion", 5) \
    .load("s3://datalake/silver/orders")

# changes_df has extra columns: _change_type, _commit_version, _commit_timestamp
# _change_type: "insert", "update_preimage", "update_postimage", "delete"
```

**OPTIMIZE and Z-Ordering** — Compact small files and co-locate related data.

```python
# Compact small files and Z-order by frequently filtered columns
spark.sql("""
    OPTIMIZE silver.orders
    ZORDER BY (customer_id, order_date)
""")
```

**VACUUM** — Delete old Parquet files that are no longer referenced by the transaction log.

```python
# Retain 7 days of history (files older than 7 days are deleted)
spark.sql("VACUUM silver.orders RETAIN 168 HOURS")
```

---

## Apache Iceberg

Apache Iceberg (Netflix, now Apache top-level) is the other dominant open table format, particularly strong in multi-engine environments (Spark + Flink + Trino simultaneously on the same table).

### Iceberg's Standout Features

**Hidden Partitioning** — In Hive-style partitioning, users must know partition columns and include them in queries. Iceberg hides this — the engine applies partition transforms automatically.

```python
# Iceberg partition spec: partition by month(order_date) and bucket(customer_id, 10)
spark.sql("""
    CREATE TABLE catalog.silver.orders (
        order_id     STRING,
        customer_id  STRING,
        revenue_usd  DECIMAL(10,4),
        order_date   TIMESTAMP
    ) USING iceberg
    PARTITIONED BY (months(order_date), bucket(10, customer_id))
""")

# User query — no need to know the partition transforms:
spark.sql("SELECT * FROM catalog.silver.orders WHERE order_date = '2024-01-10'")
# Iceberg applies months(order_date) = '2024-01' automatically
```

**Partition Evolution** — Change the partitioning scheme without rewriting existing data.

```python
# Original: partitioned by days(order_date)
# Traffic grew 10×, now need hours(order_date) — change partition spec:
spark.sql("""
    ALTER TABLE catalog.silver.orders
    REPLACE PARTITION FIELD days(order_date) WITH hours(order_date)
""")
# Old data stays as-is (day partitions). New data goes into hour partitions.
# Query engine handles both transparently.
```

**Snapshot-Based Time Travel**

```python
# List all snapshots
spark.sql("SELECT * FROM catalog.silver.orders.snapshots").show()

# Read a specific snapshot
df = spark.read \
    .option("snapshot-id", "8170984473567086822") \
    .table("catalog.silver.orders")

# Rollback to a previous snapshot
spark.sql("CALL catalog.system.rollback_to_snapshot('silver.orders', 8170984473567086822)")
```

---

## Format Comparison: When to Use What

| Scenario | Recommended Format | Reason |
|---|---|---|
| Kafka message serialisation | **Avro** | Schema evolution, compact binary, native schema registry integration |
| REST API request/response | **JSON** | Human-readable, universally supported |
| Analytics query layer (static) | **Parquet** | Columnar, predicate pushdown, universal support |
| Databricks-centric lakehouse | **Delta Lake** | Native Databricks integration, mature tooling |
| Multi-engine lakehouse (Spark+Flink+Trino) | **Iceberg** | Best multi-engine support, hidden partitioning |
| Streaming upsert pipelines (CDC) | **Hudi** or **Iceberg** | Native record-level upsert optimised for write-heavy workloads |
| ML feature materialisation | **Parquet** or **Delta** | Fast column reads; Delta for time travel in feature versioning |
| Config files / schema definitions | **JSON** / **YAML** | Human-readable, tooling support |

### Quick Decision Flowchart

```
Is this event streaming (Kafka)?
  → YES: Avro (with schema registry)
  → NO: Is this for analytics queries?
    → YES: Does it need ACID / upsert / time travel?
      → YES: Is your primary engine Databricks?
        → YES: Delta Lake
        → NO (multi-engine): Apache Iceberg
      → NO (static data only): Parquet
    → NO: Is it a config/schema file?
      → YES: JSON / YAML
      → NO: Evaluate use case
```

---

## Python Code Reference

### Reading and Writing Parquet

```python
# Pandas: read/write Parquet
import pandas as pd

# Read
df = pd.read_parquet(
    "s3://datalake/silver/orders/",
    engine="pyarrow",
    columns=["order_id", "revenue_usd", "order_date"],   # column pruning
    filters=[("order_date", ">=", "2024-01-01")]          # row group filtering
)

# Write
df.to_parquet(
    "s3://datalake/gold/daily_revenue.parquet",
    engine="pyarrow",
    compression="zstd",
    index=False
)
```

```python
# PySpark: read/write Parquet with options
# Read
orders_df = (
    spark.read
    .option("mergeSchema", "false")     # fail on schema mismatch
    .parquet("s3://datalake/silver/orders/")
)

# Write with partitioning and compression
(
    orders_df
    .write
    .mode("overwrite")
    .option("compression", "zstd")
    .option("parquet.block.size", str(256 * 1024 * 1024))  # 256 MB row groups
    .partitionBy("order_date")
    .parquet("s3://datalake/gold/orders/")
)
```

### Reading and Writing Delta Lake

```python
# PySpark: read/write Delta Lake
# Read
df = spark.read.format("delta").load("s3://datalake/silver/orders/")

# Or with catalog (preferred)
df = spark.table("silver.orders")

# Write (append)
(
    new_orders_df
    .write
    .format("delta")
    .mode("append")
    .save("s3://datalake/silver/orders/")
)

# Write with schema evolution
(
    new_orders_df
    .write
    .format("delta")
    .mode("append")
    .option("mergeSchema", "true")
    .save("s3://datalake/silver/orders/")
)

# Create managed Delta table
spark.sql("""
    CREATE TABLE IF NOT EXISTS silver.orders
    USING delta
    LOCATION 's3://datalake/silver/orders/'
    TBLPROPERTIES (
      'delta.enableChangeDataFeed' = 'true',
      'delta.logRetentionDuration' = 'interval 30 days'
    )
""")
```

### Reading and Writing Iceberg

```python
# Configure Iceberg catalog (REST catalog example)
spark = SparkSession.builder \
    .config("spark.sql.extensions", "org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions") \
    .config("spark.sql.catalog.glue_catalog", "org.apache.iceberg.spark.SparkCatalog") \
    .config("spark.sql.catalog.glue_catalog.warehouse", "s3://datalake/") \
    .config("spark.sql.catalog.glue_catalog.catalog-impl", "org.apache.iceberg.aws.glue.GlueCatalog") \
    .getOrCreate()

# Create Iceberg table
spark.sql("""
    CREATE TABLE glue_catalog.silver.orders (
        order_id    STRING NOT NULL,
        customer_id STRING,
        revenue_usd DECIMAL(10,4),
        order_date  DATE
    ) USING iceberg
    PARTITIONED BY (months(order_date))
    TBLPROPERTIES (
        'write.target-file-size-bytes' = '268435456',
        'history.expire.max-snapshot-age-ms' = '2592000000'
    )
""")

# Read
df = spark.table("glue_catalog.silver.orders")

# Upsert with MERGE
spark.sql("""
    MERGE INTO glue_catalog.silver.orders AS target
    USING updates AS source
    ON target.order_id = source.order_id
    WHEN MATCHED THEN UPDATE SET *
    WHEN NOT MATCHED THEN INSERT *
""")
```

---

## Common Pitfalls

- **Too many small Parquet files** — Thousands of tiny files (the "small files problem") hurt query performance because each file requires a separate S3 API call. Target 128–512 MB per file. Use Delta `OPTIMIZE` or Iceberg's compaction procedure regularly.
- **Wrong row group size** — Default row groups of 128 MB are fine for most cases, but if your queries filter on a column with high cardinality within a row group, increase to 256–512 MB for better column statistics coverage.
- **Forgetting to VACUUM** — Delta Lake accumulates old Parquet versions indefinitely. Without regular `VACUUM`, storage costs balloon and listing overhead slows queries. Run `VACUUM` weekly with a 7-day retention.
- **Using Parquet for event streaming** — Parquet is a bad choice for Kafka because it's designed for bulk reads, not single-record appends. Use Avro or JSON for Kafka, then convert to Parquet/Delta in the Bronze-to-Silver step.
- **Schema evolution without defaults** — Adding a non-nullable column without a default to an existing Parquet/Avro dataset breaks all older files. Always provide defaults when adding columns.
- **Not enabling predicate pushdown** — Some Spark configurations or UDF usage disable predicate pushdown. Verify with `df.explain(True)` that `PushedFilters` appear in the plan.
- **Ignoring Z-order for Delta Lake** — Partitioning helps at the file level, but Z-ordering co-locates related rows within files. Without Z-ordering on `customer_id` and `order_date`, every query still scans most of each partition file.
- **Avro without schema registry in Kafka** — Embedding the full schema in every Kafka message wastes 200+ bytes per message. Always use a schema registry — it stores schemas by ID and messages carry only a 4-byte schema ID prefix.

---

## Review Questions

1. Explain column pruning and predicate pushdown. How does Parquet's file structure (row groups, column chunks, page statistics) enable these optimisations?
2. You have a 500 MB Parquet file with 5 row groups and ZSTD compression. A query filters `WHERE customer_segment = 'Enterprise'`. What must be true about the row group statistics for predicate pushdown to skip a row group?
3. Compare Avro and Parquet for Kafka message serialisation. Why is Avro preferred over Parquet for this use case?
4. What is a Delta Lake transaction log, and how does it enable time travel? Walk through what happens when you read `VERSION AS OF 3`.
5. How does Iceberg hidden partitioning differ from Hive-style partitioning? Why does this benefit end users?
6. Your Delta Lake table has grown to 2 TB but 80% of it is redundant old versions. What commands do you run to reclaim the storage?
7. A Parquet file has the following row group statistics for a `revenue_usd` column: Row Group 1: min=0, max=50. Row Group 2: min=51, max=200. For `WHERE revenue_usd > 100`, which row groups are read, and why?

---

## See Also

- [[Data_Modeling_for_Engineering]] — Medallion architecture and when each format fits each layer
- [[Distributed_Computing]] — How Spark reads Parquet (column pruning, predicate pushdown execution)
- [[Data_Engineering_Overview]] — Storage layer in the modern data stack
- [[Data_Quality_and_Observability]] — Schema enforcement and evolution as a quality concern

#DataEngineering
