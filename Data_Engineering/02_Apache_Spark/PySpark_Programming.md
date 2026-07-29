---
title: PySpark Programming
aliases: [PySpark, PySpark UDFs, Pandas UDF, PySpark Delta Lake]
tags: [DataEngineering, Spark, PySpark, Python, PandasUDF]
domain: Data Engineering
difficulty: Intermediate
created: 2026-07-29
related: [Spark_DataFrames, Spark_Performance, Spark_Architecture]
status: complete
---

# PySpark Programming

> [!abstract] TL;DR
> PySpark is the Python API for Apache Spark. Python UDFs incur JVM↔Python serialization overhead, but Pandas UDFs (Arrow-based vectorized functions) close the performance gap dramatically. For most production pipelines, PySpark with Pandas UDFs and built-in DataFrame functions is the pragmatic choice — Delta Lake integration and cloud storage connectivity are first-class features.

## PySpark vs Scala Spark: Trade-offs

```mermaid
graph LR
    A[Your Python Code] -- "py4j / Py4J socket" --> B[PySpark JVM\nGateway Process]
    B --> C[Spark Core\nJVM]
    C -- "row-by-row\n(Python UDF)" --> D[Python Worker\nProcess]
    C -- "Arrow batch\n(Pandas UDF)" --> D
```

| Dimension | Python (PySpark) | Scala Spark |
|---|---|---|
| Developer speed | High — Python ecosystem, notebooks | Lower — JVM build tooling, stricter types |
| DataFrame/SQL performance | Identical to Scala — Catalyst/Tungsten used | Identical |
| Python UDF performance | Slow — row-by-row JVM↔Python serialization | N/A (native JVM) |
| Pandas UDF performance | Near-Scala — Arrow batch transfer | N/A |
| Complex business logic | Great with Pandas UDFs | Better raw performance |
| ML ecosystem (sklearn, etc.) | Native — best Python libraries | Requires JVM wrappers |
| Compile-time type safety | None | Full (with Dataset API) |
| Deployment | Easier (no JAR build) | Requires compiled JAR |
| Recommendation | **Use for 95% of pipelines** | Use for performance-critical library code |

---

## SparkSession Setup

```python
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import (
    StructType, StructField,
    StringType, LongType, IntegerType,
    DoubleType, FloatType,
    BooleanType, TimestampType, DateType,
    ArrayType, MapType
)

spark = SparkSession.builder \
    .appName("DataPipeline") \
    .config("spark.sql.shuffle.partitions", "50") \
    .config("spark.sql.adaptive.enabled", "true") \
    .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \
    .config("spark.sql.extensions",
            "io.delta.sql.DeltaSparkSessionExtension") \
    .config("spark.sql.catalog.spark_catalog",
            "org.apache.spark.sql.delta.catalog.DeltaCatalog") \
    .getOrCreate()

sc = spark.sparkContext
sc.setLogLevel("WARN")
```

### Local Development Mode

```python
# Use all available cores on your laptop (good for development/testing)
spark = SparkSession.builder \
    .appName("LocalDev") \
    .master("local[*]") \
    .config("spark.driver.memory", "4g") \
    .getOrCreate()

# local[4] = exactly 4 threads; local[*] = as many as CPU cores
```

---

## Python UDFs: The Slow Path

```python
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType, DoubleType

# Standard Python UDF — row by row, JVM→Python serialization each time
@udf(returnType=StringType())
def categorise_amount(amount):
    if amount is None:
        return None
    if amount > 1000:
        return "high"
    elif amount > 100:
        return "medium"
    return "low"

df = df.withColumn("category", categorise_amount(F.col("amount")))
```

> [!warning] Python UDFs bypass the Catalyst optimizer entirely. Spark cannot optimise inside a Python UDF — it becomes an opaque black box. Each row is serialized from JVM binary format, sent over a socket to a Python worker, processed, and the result is sent back. For high-volume columns this can be 10–100x slower than equivalent built-in functions.

**Always prefer built-in functions and `expr()` over Python UDFs.** Use UDFs only when no built-in equivalent exists.

---

## Pandas UDFs (Vectorized UDFs)

Pandas UDFs use **Apache Arrow** to transfer entire column batches as Pandas Series/DataFrames between JVM and Python — far more efficient than row-by-row.

### Series → Series (Column transform)

```python
from pyspark.sql.functions import pandas_udf
import pandas as pd
import numpy as np

# Normalise a column to z-score within each call batch
@pandas_udf("double")
def zscore(s: pd.Series) -> pd.Series:
    mean = s.mean()
    std  = s.std()
    return (s - mean) / std if std > 0 else s * 0.0

df = df.withColumn("score_normalised", zscore(F.col("score")))
```

### Series → Scalar (Aggregate UDF)

```python
from pyspark.sql.functions import pandas_udf, PandasUDFType

@pandas_udf("double")
def weighted_avg(values: pd.Series, weights: pd.Series) -> float:
    return float(np.average(values, weights=weights))

# Use inside agg() — one scalar per group
result = df.groupBy("category").agg(
    weighted_avg(F.col("score"), F.col("weight")).alias("wt_avg_score")
)
```

### Complex Return Type

```python
from pyspark.sql.types import StructType, StructField, DoubleType, StringType

output_schema = StructType([
    StructField("lower", DoubleType()),
    StructField("upper", DoubleType()),
    StructField("flag", StringType()),
])

@pandas_udf(output_schema)
def compute_bounds(values: pd.Series) -> pd.DataFrame:
    p05 = values.quantile(0.05)
    p95 = values.quantile(0.95)
    flag = pd.Series(["outlier" if v < p05 or v > p95 else "normal" for v in values])
    return pd.DataFrame({"lower": p05, "upper": p95, "flag": flag})

df = df.withColumn("bounds", compute_bounds(F.col("value")))
df = df.select("*", "bounds.lower", "bounds.upper", "bounds.flag").drop("bounds")
```

---

## `applyInPandas`: Group-level Processing

`applyInPandas` sends each group (all rows with the same key) as a full `pd.DataFrame` to a Python function. Essential for complex per-group logic.

```python
# Schema of the output DataFrame
output_schema = StructType([
    StructField("user_id",    LongType()),
    StructField("session_id", LongType()),
    StructField("event_time", TimestampType()),
    StructField("rank",       IntegerType()),
    StructField("delta_secs", DoubleType()),
])

def session_features(key: tuple, pdf: pd.DataFrame) -> pd.DataFrame:
    """Compute per-session features for a (user_id, session_id) group."""
    pdf = pdf.sort_values("event_time").reset_index(drop=True)
    pdf["rank"] = range(1, len(pdf) + 1)
    pdf["delta_secs"] = pdf["event_time"].diff().dt.total_seconds().fillna(0)
    return pdf[["user_id", "session_id", "event_time", "rank", "delta_secs"]]

result = df.groupBy("user_id", "session_id") \
           .applyInPandas(session_features, schema=output_schema)
```

> [!tip] `applyInPandas` requires that each group fits in memory on one executor. For datasets where single groups can be very large (millions of rows per user), consider salting or an alternative approach. See [[Spark_Performance]].

### `mapInPandas`: Iterator-based Processing (No groupBy)

```python
# Process the entire DataFrame partition-by-partition as Pandas DataFrames
# Good for stateful or complex row-level transforms that need pandas ecosystem

def apply_model(iterator):
    import joblib
    model = joblib.load("/dbfs/models/classifier.pkl")   # load once per partition
    for pdf in iterator:
        pdf["prediction"] = model.predict(pdf[["feature_a", "feature_b"]])
        yield pdf

result = df.mapInPandas(apply_model, schema=df.schema.add("prediction", StringType()))
```

---

## Reading from Cloud Storage

### Amazon S3

```python
# Using s3a:// protocol (Hadoop 3.x AWS connector)
spark.conf.set("fs.s3a.access.key", "AKIAIOSFODNN7EXAMPLE")
spark.conf.set("fs.s3a.secret.key", "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY")
spark.conf.set("fs.s3a.endpoint", "s3.amazonaws.com")
# On EMR/Databricks, credentials are typically injected via IAM role — no explicit keys needed

df = spark.read.parquet("s3a://my-data-bucket/events/year=2024/")
df.write.mode("overwrite").parquet("s3a://my-output-bucket/results/")

# For better performance on S3 — enable committer that avoids rename race conditions
spark.conf.set("spark.hadoop.fs.s3a.committer.name", "magic")
spark.conf.set("spark.sql.sources.commitProtocolClass",
               "org.apache.spark.internal.io.cloud.PathOutputCommitProtocol")
```

### Google Cloud Storage (GCS)

```python
spark.conf.set("google.cloud.auth.service.account.enable", "true")
spark.conf.set("google.cloud.auth.service.account.json.keyfile",
               "/path/to/service-account-key.json")

df = spark.read.parquet("gs://my-bucket/data/")
df.write.mode("overwrite").parquet("gs://my-bucket/output/")
```

### Azure Data Lake Storage Gen2 (ADLS)

```python
# Account key authentication
account_name = "myadlsaccount"
spark.conf.set(
    f"fs.azure.account.key.{account_name}.dfs.core.windows.net",
    "base64encodedaccountkey=="
)

# Service principal authentication (preferred for production)
tenant_id    = "your-tenant-id"
client_id    = "your-client-id"
client_secret = "your-client-secret"

spark.conf.set(f"fs.azure.account.auth.type.{account_name}.dfs.core.windows.net",
               "OAuth")
spark.conf.set(f"fs.azure.account.oauth.provider.type.{account_name}.dfs.core.windows.net",
               "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider")
spark.conf.set(f"fs.azure.account.oauth2.client.id.{account_name}.dfs.core.windows.net",
               client_id)
spark.conf.set(f"fs.azure.account.oauth2.client.secret.{account_name}.dfs.core.windows.net",
               client_secret)
spark.conf.set(f"fs.azure.account.oauth2.client.endpoint.{account_name}.dfs.core.windows.net",
               f"https://login.microsoftonline.com/{tenant_id}/oauth2/token")

df = spark.read.parquet(f"abfss://container@{account_name}.dfs.core.windows.net/path/")
```

---

## Delta Lake with PySpark

Delta Lake adds ACID transactions, schema enforcement, time travel, and efficient upserts on top of Parquet files.

### Read / Write

```python
# Write as Delta
df.write.format("delta").mode("overwrite").save("s3a://bucket/delta/events/")

# Write with partition
df.write.format("delta") \
    .mode("overwrite") \
    .partitionBy("year", "month") \
    .option("overwriteSchema", "true") \
    .save("s3a://bucket/delta/events/")

# Read Delta table
df = spark.read.format("delta").load("s3a://bucket/delta/events/")

# Register as a SQL table
spark.sql("""
    CREATE TABLE IF NOT EXISTS events
    USING delta
    LOCATION 's3a://bucket/delta/events/'
""")
spark.sql("SELECT * FROM events WHERE year = 2024").show()
```

### Upsert (MERGE INTO)

```python
from delta.tables import DeltaTable

target = DeltaTable.forPath(spark, "s3a://bucket/delta/users/")

source = spark.read.parquet("s3a://bucket/staging/users_updates/")

target.alias("t").merge(
    source.alias("s"),
    condition="t.user_id = s.user_id"
).whenMatchedUpdate(set={
    "name":       "s.name",
    "email":      "s.email",
    "updated_at": "s.updated_at",
}).whenNotMatchedInsert(values={
    "user_id":    "s.user_id",
    "name":       "s.name",
    "email":      "s.email",
    "created_at": "s.created_at",
    "updated_at": "s.updated_at",
}).whenNotMatchedBySourceDelete().execute()  # delete rows not in source (full sync)
```

### Time Travel

```python
# Read a specific historical version
df_v5 = spark.read.format("delta") \
    .option("versionAsOf", 5) \
    .load("s3a://bucket/delta/events/")

# Read a snapshot as of a specific timestamp
df_yesterday = spark.read.format("delta") \
    .option("timestampAsOf", "2024-01-14 00:00:00") \
    .load("s3a://bucket/delta/events/")

# View full history of changes
target.history().select("version", "timestamp", "operation", "operationMetrics").show()
```

### Schema Evolution

```python
# Merge schema when new columns appear in the source
df_new.write.format("delta") \
    .mode("append") \
    .option("mergeSchema", "true") \
    .save("s3a://bucket/delta/events/")

# Overwrite and replace schema
df_new.write.format("delta") \
    .mode("overwrite") \
    .option("overwriteSchema", "true") \
    .save("s3a://bucket/delta/events/")
```

### Optimize and Z-ORDER

```python
# Compact small files into larger ones
spark.sql("OPTIMIZE delta.`s3a://bucket/delta/events/`")

# Z-ORDER: co-locate related data within files (improves range queries)
spark.sql("""
    OPTIMIZE delta.`s3a://bucket/delta/events/`
    ZORDER BY (user_id, event_date)
""")

# Vacuum: remove files older than retention period (default 7 days)
spark.sql("VACUUM delta.`s3a://bucket/delta/events/` RETAIN 168 HOURS")
# To vacuum more aggressively (CAUTION: breaks time travel):
spark.conf.set("spark.databricks.delta.retentionDurationCheck.enabled", "false")
spark.sql("VACUUM delta.`s3a://bucket/delta/events/` RETAIN 0 HOURS")
```

---

## PySpark Type System

```python
from pyspark.sql.types import *

# Primitive types
LongType()         # int64    — use for IDs, counts
IntegerType()      # int32
DoubleType()       # float64
FloatType()        # float32
StringType()       # UTF-8 string
BooleanType()      # true/false
TimestampType()    # datetime with timezone (microsecond precision)
DateType()         # date only (no time)
DecimalType(18, 4) # exact decimal — use for monetary values

# Complex types
ArrayType(StringType())               # array of strings
MapType(StringType(), LongType())     # dict: string → long
StructType([                          # nested struct (sub-row)
    StructField("lat",  DoubleType()),
    StructField("lon",  DoubleType()),
    StructField("name", StringType(), nullable=True),
])

# Nested struct array (common for event payloads)
schema = StructType([
    StructField("user_id",   LongType(),   nullable=False),
    StructField("events",    ArrayType(
        StructType([
            StructField("event_type", StringType()),
            StructField("timestamp",  TimestampType()),
            StructField("metadata",   MapType(StringType(), StringType())),
        ])
    )),
])

# Working with nested types
df = df.withColumn("first_event", F.col("events")[0])              # array indexing
df = df.withColumn("event_count", F.size(F.col("events")))
df = df.withColumn("event_type", F.col("events.event_type"))        # field from struct
df_flat = df.withColumn("event", F.explode("events"))               # array → rows
df = df.withColumn("meta_val", F.col("metadata")["key"])           # map lookup
df = df.withColumn("map_keys", F.map_keys(F.col("metadata")))
```

---

## Distributing Python Files to Executors

```python
# Add a single Python file — available to all executor tasks
sc.addPyFile("s3a://bucket/lib/utils.py")
# Now in UDFs: from utils import my_function

# Add a ZIP of a package
sc.addPyFile("s3a://bucket/lib/mypackage.zip")

# In Databricks / EMR: use cluster init scripts or cluster libraries for pip packages
# In bare Spark: use --py-files flag at spark-submit time
# spark-submit --py-files utils.zip,helpers.py my_job.py
```

---

## Testing PySpark Code

```python
# Use pytest with a session-scoped fixture for efficiency
import pytest
from pyspark.sql import SparkSession

@pytest.fixture(scope="session")
def spark():
    return SparkSession.builder \
        .master("local[2]") \
        .appName("test") \
        .getOrCreate()

def test_zscore_udf(spark):
    data = [(1, 10.0), (2, 20.0), (3, 30.0)]
    df = spark.createDataFrame(data, ["id", "value"])
    result = df.withColumn("z", zscore(F.col("value")))
    rows = {r.id: r.z for r in result.collect()}
    assert abs(rows[2]) < 1e-9        # middle value → z-score ~ 0

def test_join_dedup(spark):
    orders = spark.createDataFrame([(1, 100), (1, 200), (2, 50)], ["user_id", "amount"])
    users  = spark.createDataFrame([(1, "Alice"), (2, "Bob")], ["user_id", "name"])
    result = orders.join(users, "user_id")
    assert result.count() == 3
    assert "name" in result.columns
```

---

## Common Pitfalls

- Writing Python UDFs for logic that could be expressed with `F.when()`, `F.expr()`, or built-in string/date functions — Catalyst cannot optimise inside UDFs.
- Using `pandas_udf` with `PandasUDFType.SCALAR` (deprecated style) instead of type hints — use the type-annotated style (`pd.Series -> pd.Series`) from Spark 3.0+.
- Forgetting to import `pandas` and `numpy` inside the UDF body when using `applyInPandas` in a cluster — the UDF runs on executors, which must have these packages installed.
- Not specifying the output schema for `applyInPandas` — the schema must exactly match what the function returns (column names, types, nullable flags).
- Using `sc.addPyFile()` after tasks have already been scheduled — call it before creating DataFrames or running transformations.
- Mutating the input `pd.DataFrame` inside a Pandas UDF — always work on a copy (`pdf = pdf.copy()`) to avoid unexpected side effects.
- Opening database connections in the driver and passing them to UDFs — connections cannot be serialized; open them inside the UDF function body (or use `mapPartitions`).
- Setting `master("local[*]")` in production — this runs everything in a single JVM with no cluster parallelism. Always use a proper cluster manager in production.

---

## Review Questions

1. What is the performance difference between a standard Python UDF and a Pandas UDF? What mechanism makes Pandas UDFs faster?
2. When would you use `applyInPandas` instead of `withColumn` + a Pandas UDF? What are the memory constraints to be aware of?
3. How does `mapInPandas` differ from `applyInPandas`? Give a use case where `mapInPandas` is the better choice.
4. Describe the Delta Lake MERGE operation. What are `whenMatchedUpdate`, `whenNotMatchedInsert`, and `whenNotMatchedBySourceDelete` used for?
5. What is the difference between `option("mergeSchema", "true")` and `option("overwriteSchema", "true")` when writing a Delta table?

#DataEngineering #Spark
