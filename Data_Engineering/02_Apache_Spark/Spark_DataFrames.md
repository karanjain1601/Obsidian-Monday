---
title: Spark DataFrames and SQL
aliases: [Spark SQL, PySpark DataFrame API, Spark Transformations]
tags: [DataEngineering, Spark, SparkSQL, DataFrames]
domain: Data Engineering
difficulty: Intermediate
created: 2026-07-29
related: [Spark_Architecture, Spark_Performance, PySpark_Programming]
status: complete
---

# Spark DataFrames and SQL

> [!abstract] TL;DR
> Spark DataFrames are distributed tables with a named schema that get optimised by Catalyst before execution. You can manipulate them with a functional Python/Scala API, with SQL strings via `spark.sql()`, or mix both freely. Mastering the core transformation vocabulary — `select`, `filter`, `groupBy`, `join`, window functions — covers 95% of real pipeline work.

## SparkSession: Entry Point

`SparkSession` is the single entry point for all DataFrame/SQL operations. Create it once per application and reuse it everywhere.

```python
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import (
    StructType, StructField, StringType, LongType,
    DoubleType, TimestampType, ArrayType
)

spark = SparkSession.builder \
    .appName("DataPipeline") \
    .config("spark.sql.shuffle.partitions", "50") \        # tune for your data size
    .config("spark.sql.adaptive.enabled", "true") \        # AQE on (default in 3.x)
    .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \
    .getOrCreate()

spark.sparkContext.setLogLevel("WARN")   # reduce noise
```

> [!tip] In a notebook or interactive shell, `spark` is already available. Only call `builder` in standalone scripts or when you need non-default configs.

---

## Reading Data Sources

### Parquet (preferred columnar format)

```python
# Single file or directory — Spark auto-discovers partition directories
df = spark.read.parquet("s3://my-bucket/events/year=2024/month=01/")

# Read with schema merge (handles schema evolution across files)
df = spark.read \
    .option("mergeSchema", "true") \
    .parquet("s3://my-bucket/events/")

# Read specific partition using partition pruning (Spark pushes filter to file discovery)
df = spark.read.parquet("s3://my-bucket/events/") \
    .filter((F.col("year") == 2024) & (F.col("month") == 1))
```

### CSV

```python
df = spark.read \
    .option("header", True) \
    .option("inferSchema", True) \        # slow on large files — define schema explicitly in prod
    .option("delimiter", ",") \
    .option("quote", '"') \
    .option("escape", "\\") \
    .option("nullValue", "NA") \
    .csv("s3://my-bucket/data/file.csv")

# Explicit schema (faster, no scan for inference)
schema = StructType([
    StructField("user_id", LongType(), nullable=False),
    StructField("event_type", StringType(), nullable=True),
    StructField("amount", DoubleType(), nullable=True),
])
df = spark.read.schema(schema).option("header", True).csv("data.csv")
```

### JSON

```python
# Line-delimited JSON (NDJSON / JSON-L format)
df = spark.read.json("data.jsonl")

# Multiline JSON document per file
df = spark.read.option("multiline", True).json("data.json")

# Spark infers schema from a sample — provide explicit schema for reliability
df = spark.read.schema(schema).json("data.json")
```

### JDBC (Relational Databases)

```python
jdbc_url = "jdbc:postgresql://host:5432/mydb"
connection_props = {
    "user": "myuser",
    "password": "mypassword",
    "driver": "org.postgresql.Driver"
}

# Full table read
df = spark.read.jdbc(url=jdbc_url, table="orders", properties=connection_props)

# Parallel read with partitioning — critical for large tables
df = spark.read.jdbc(
    url=jdbc_url,
    table="orders",
    column="order_id",          # numeric column to split on
    lowerBound=1,
    upperBound=10_000_000,
    numPartitions=20,           # creates 20 parallel JDBC connections
    properties=connection_props
)

# With a subquery for filtering (wrap in parens, alias required)
df = spark.read.jdbc(
    url=jdbc_url,
    table="(SELECT * FROM orders WHERE status = 'PENDING') AS t",
    properties=connection_props
)
```

---

## Core DataFrame Transformations

All transformations are **lazy** — they build a query plan. Only an action triggers execution.

### Selection and Column Operations

```python
# Select specific columns
df2 = df.select("user_id", "event_type", "amount")

# Select with expressions
df2 = df.select(
    F.col("user_id"),
    F.col("amount") * 1.1,                     # expression
    F.upper(F.col("event_type")).alias("type"), # alias
    F.lit(42).alias("constant"),               # literal value
)

# Add or overwrite a column
df = df.withColumn("amount_usd", F.col("amount") / F.col("exchange_rate"))
df = df.withColumn("event_type", F.upper(F.col("event_type")))  # overwrite

# Drop columns
df = df.drop("tmp_col", "internal_flag")

# Rename
df = df.withColumnRenamed("ts", "event_timestamp")

# Cast type
df = df.withColumn("user_id", F.col("user_id").cast(LongType()))
df = df.withColumn("created_at", F.col("created_at").cast("timestamp"))
```

### Filtering

```python
# filter() and where() are aliases — use either
df_filtered = df.filter(F.col("amount") > 100.0)
df_filtered = df.where(F.col("status") == "ACTIVE")

# Compound conditions
df_filtered = df.filter(
    (F.col("amount") > 0) &
    (F.col("event_type").isin("purchase", "refund")) &
    (F.col("user_id").isNotNull())
)

# Negation
df_filtered = df.filter(~F.col("is_deleted").cast("boolean"))

# String patterns
df_filtered = df.filter(F.col("email").endswith("@acme.com"))
df_filtered = df.filter(F.col("name").like("%Smith%"))
df_filtered = df.filter(F.col("description").rlike(r"[0-9]{4}-[0-9]{2}"))
```

### Aggregations

```python
# groupBy + agg
summary = df.groupBy("user_id", "event_type").agg(
    F.count("*").alias("event_count"),
    F.sum("amount").alias("total_amount"),
    F.avg("amount").alias("avg_amount"),
    F.max("event_timestamp").alias("last_event"),
    F.countDistinct("session_id").alias("unique_sessions"),
    F.collect_list("item_id").alias("item_ids"),
    F.collect_set("category").alias("unique_categories"),
)

# Global aggregation (no groupBy)
totals = df.agg(
    F.sum("amount"),
    F.count("*"),
    F.approx_count_distinct("user_id"),  # faster than countDistinct at scale
)

# Sorting
df_sorted = df.orderBy(F.col("amount").desc(), F.col("event_timestamp").asc())
df_sorted = df.orderBy(F.desc_nulls_last("score"))
```

### Deduplication

```python
# Remove completely identical rows
df_dedup = df.distinct()

# Remove duplicates based on subset of columns (keeps first occurrence)
df_dedup = df.dropDuplicates(["user_id", "event_date"])
```

### Set Operations

```python
# UNION (all rows from both, keeps duplicates)
combined = df1.union(df2)                   # requires matching column order
combined = df1.unionByName(df2)             # matches by column name (safer)
combined = df1.unionByName(df2, allowMissingColumns=True)  # Spark 3.1+

# INTERSECT and EXCEPT
only_in_both = df1.intersect(df2)
only_in_df1 = df1.exceptAll(df2)           # exceptAll keeps duplicate rows
```

---

## `F.col()` and `expr()` Patterns

```python
# F.col() — programmatic column reference
df = df.withColumn("new_col", F.col("a") + F.col("b"))

# expr() — embed SQL string expressions (useful for complex logic)
df = df.withColumn("full_name", F.expr("concat(first_name, ' ', last_name)"))
df = df.withColumn("age_group", F.expr("""
    CASE
        WHEN age < 18 THEN 'minor'
        WHEN age < 65 THEN 'adult'
        ELSE 'senior'
    END
"""))

# selectExpr — combine select + expr for concise SQL-style transforms
df = df.selectExpr(
    "user_id",
    "amount * 1.1 AS amount_with_tax",
    "DATE_FORMAT(created_at, 'yyyy-MM') AS year_month",
    "UPPER(status) AS status",
)
```

> [!tip] Use `expr()` when you have complex SQL logic that would be verbose with the function API. Use `F.col()` when you're building column names programmatically (e.g., in a loop over a list of columns).

---

## Spark SQL

Any DataFrame can be registered as a temporary view and queried with SQL:

```python
# Register view (session-scoped, disappears when session ends)
df.createOrReplaceTempView("events")
df_users.createOrReplaceTempView("users")

# Run SQL
result = spark.sql("""
    SELECT
        u.user_id,
        u.name,
        COUNT(e.event_id)  AS event_count,
        SUM(e.amount)      AS total_spend
    FROM users u
    LEFT JOIN events e ON u.user_id = e.user_id
    WHERE e.event_type = 'purchase'
      AND e.created_at >= DATE_SUB(CURRENT_DATE, 30)
    GROUP BY u.user_id, u.name
    HAVING total_spend > 100
    ORDER BY total_spend DESC
    LIMIT 100
""")

# Global temp views persist across sessions in the same application
df.createOrReplaceGlobalTempView("shared_events")
spark.sql("SELECT * FROM global_temp.shared_events")

# Register a Python function as a SQL UDF
from pyspark.sql.types import StringType
spark.udf.register("upper_trim", lambda s: s.strip().upper() if s else None, StringType())
spark.sql("SELECT upper_trim(name) FROM users").show()
```

---

## Window Functions

Window functions compute a value for each row **relative to a group of rows** without collapsing them (unlike `groupBy`).

```python
from pyspark.sql.window import Window

# Define a window: partition by user, order by time
w_user = Window.partitionBy("user_id").orderBy("event_time")

# Row numbering
df = df.withColumn("row_num", F.row_number().over(w_user))
df = df.withColumn("rank",    F.rank().over(w_user))          # ties get same rank, gaps after
df = df.withColumn("dense_rank", F.dense_rank().over(w_user)) # ties get same rank, no gaps

# Running aggregations (unbounded preceding to current row)
w_running = Window.partitionBy("user_id") \
    .orderBy("event_time") \
    .rowsBetween(Window.unboundedPreceding, Window.currentRow)

df = df.withColumn("running_total", F.sum("amount").over(w_running))
df = df.withColumn("running_avg",   F.avg("amount").over(w_running))

# Moving window (last 7 rows)
w_moving = Window.partitionBy("user_id") \
    .orderBy("event_time") \
    .rowsBetween(-6, 0)

df = df.withColumn("7day_moving_avg", F.avg("amount").over(w_moving))

# Lag and Lead (access previous/next row values)
df = df.withColumn("prev_amount", F.lag("amount", 1).over(w_user))
df = df.withColumn("next_amount", F.lead("amount", 1, 0.0).over(w_user))  # default = 0.0

# Percent rank / NTILE
df = df.withColumn("pct_rank",  F.percent_rank().over(w_user))
df = df.withColumn("quartile",  F.ntile(4).over(w_user))

# Partition-wide aggregation (no ordering needed)
w_partition = Window.partitionBy("user_id")
df = df.withColumn("user_total",     F.sum("amount").over(w_partition))
df = df.withColumn("pct_of_total",   F.col("amount") / F.sum("amount").over(w_partition))
```

### Common Pattern: Deduplicate keeping the latest row

```python
w_dedup = Window.partitionBy("user_id").orderBy(F.col("updated_at").desc())
latest = df \
    .withColumn("rn", F.row_number().over(w_dedup)) \
    .filter(F.col("rn") == 1) \
    .drop("rn")
```

---

## Joins

```python
# Basic joins — specify join column(s) and type
result = orders.join(customers, on="customer_id", how="inner")
result = orders.join(customers, on=["customer_id", "region"], how="left")
result = orders.join(customers,
    on=orders["cust_id"] == customers["id"],   # when column names differ
    how="left"
)

# Join types
orders.join(customers, "customer_id", "inner")   # matching rows only
orders.join(customers, "customer_id", "left")    # all orders, null if no customer
orders.join(customers, "customer_id", "right")   # all customers
orders.join(customers, "customer_id", "full")    # all rows from both
orders.join(customers, "customer_id", "cross")   # cartesian product — dangerous!

# Semi-join: keep orders WHERE a matching customer EXISTS (don't add customer columns)
orders.join(customers, "customer_id", "left_semi")

# Anti-join: keep orders WHERE NO matching customer exists (orphaned orders)
orders.join(customers, "customer_id", "left_anti")

# Broadcast join: force small table to be sent to every executor (avoids shuffle)
from pyspark.sql.functions import broadcast
result = orders.join(broadcast(countries), "country_code", "left")
```

> [!warning] Column ambiguity after join: if both DataFrames have a column with the same name (e.g., `id`), use `df["id"]` syntax or alias the DataFrames before joining to avoid `AnalysisException`.

```python
# Resolve ambiguity by aliasing
o = orders.alias("o")
c = customers.alias("c")
result = o.join(c, F.col("o.customer_id") == F.col("c.id"), "left") \
    .select("o.*", F.col("c.name").alias("customer_name"))
```

---

## Caching and Persistence

```python
# cache() = persist at MEMORY_AND_DISK (default)
df_joined = orders.join(customers, "customer_id").cache()
df_joined.count()   # materialize the cache with an action

# persist() lets you specify the storage level
from pyspark import StorageLevel

df.persist(StorageLevel.MEMORY_ONLY)          # fastest, OOM if too large
df.persist(StorageLevel.MEMORY_AND_DISK)      # spills to disk if memory full
df.persist(StorageLevel.DISK_ONLY)            # when memory is very tight
df.persist(StorageLevel.MEMORY_ONLY_SER)      # serialised (smaller, slower to access)
df.persist(StorageLevel.OFF_HEAP)             # requires off-heap config

# IMPORTANT: always unpersist when done to free memory
df_joined.unpersist()
```

### When to cache

- A DataFrame is **used more than once** in your DAG (otherwise Spark recomputes it each time).
- After an **expensive join or aggregation** whose result feeds multiple downstream operations.
- An **iterative algorithm** (e.g., PageRank, k-means) that reads the same data each iteration.

> [!warning] Do NOT cache everything. Each cached DF occupies executor storage memory — caching too aggressively causes evictions and can hurt performance more than help.

---

## Writing Output

```python
# Write Parquet (default format, columnar, splittable)
df.write.mode("overwrite").parquet("s3://bucket/output/")

# Partition output by column values (creates subdirectories like year=2024/month=01/)
df.write \
    .mode("append") \
    .partitionBy("year", "month") \
    .parquet("s3://bucket/events/")

# Control output file count (coalesce avoids full shuffle, repartition does full shuffle)
df.coalesce(1).write.mode("overwrite").csv("output/single_file.csv", header=True)
df.repartition(10).write.mode("overwrite").parquet("output/")

# Write to Delta Lake (with schema evolution)
df.write \
    .mode("overwrite") \
    .option("mergeSchema", "true") \
    .format("delta") \
    .save("s3://bucket/delta/events/")

# Write to JDBC
df.write.jdbc(
    url="jdbc:postgresql://host:5432/mydb",
    table="output_table",
    mode="append",
    properties={"user": "myuser", "password": "mypassword", "driver": "org.postgresql.Driver"}
)
```

### Write Modes

| Mode | Behaviour |
|---|---|
| `overwrite` | Delete existing data, write new data |
| `append` | Add data to existing table/directory |
| `ignore` | Skip write if data already exists (no-op) |
| `error` / `errorifexists` | Raise exception if data already exists (default) |

---

## Schema Inspection and Plan Debugging

```python
# Print schema tree
df.printSchema()
# root
#  |-- user_id: long (nullable = true)
#  |-- event_type: string (nullable = true)
#  |-- amount: double (nullable = true)

# Check column types programmatically
df.dtypes                                     # list of (name, type_string) tuples
df.schema                                     # StructType object

# Quick data inspection
df.show(5, truncate=False)                    # show 5 rows, don't truncate strings
df.show(20, vertical=True)                    # one column per line (wide tables)
df.describe("amount", "user_id").show()       # count/mean/stddev/min/max stats

# Explain plan (crucial for debugging performance)
df.explain()          # physical plan only
df.explain(True)      # all four plans: parsed, analyzed, optimized, physical
df.explain("cost")    # with cost estimates (Spark 3.x)
df.explain("formatted")  # nicely formatted (Spark 3.x)
```

---

## Common Patterns

### Null Handling

```python
# Fill nulls
df = df.fillna(0, subset=["amount"])
df = df.fillna({"amount": 0.0, "status": "UNKNOWN"})

# Drop rows with any null
df = df.dropna()
df = df.dropna(subset=["user_id", "event_type"])  # only required columns

# Null-safe comparisons
df = df.filter(F.col("value").isNull())
df = df.filter(F.col("value").isNotNull())
df = df.withColumn("val", F.coalesce(F.col("primary"), F.col("fallback"), F.lit(0)))
```

### Date and Timestamp Operations

```python
from pyspark.sql import functions as F

df = df.withColumn("date", F.to_date("ts_string", "yyyy-MM-dd"))
df = df.withColumn("ts", F.to_timestamp("ts_string", "yyyy-MM-dd HH:mm:ss"))
df = df.withColumn("year",  F.year("event_date"))
df = df.withColumn("month", F.month("event_date"))
df = df.withColumn("day",   F.dayofmonth("event_date"))
df = df.withColumn("hour",  F.hour("event_ts"))

# Date arithmetic
df = df.withColumn("days_ago", F.datediff(F.current_date(), F.col("event_date")))
df = df.withColumn("next_week", F.date_add(F.col("event_date"), 7))
df = df.withColumn("month_start", F.trunc("event_date", "MM"))

# Truncate timestamp to hour
df = df.withColumn("event_hour", F.date_trunc("hour", F.col("event_ts")))
```

### String Operations

```python
df = df.withColumn("name", F.trim(F.col("name")))
df = df.withColumn("name", F.lower(F.col("name")))
df = df.withColumn("parts", F.split(F.col("csv_col"), ","))       # ArrayType
df = df.withColumn("joined", F.concat_ws("-", "a", "b", "c"))
df = df.withColumn("substr", F.substring(F.col("code"), 1, 3))    # 1-indexed

# Explode array column to rows
df_exploded = df.withColumn("item", F.explode(F.col("items")))    # drops nulls
df_exploded = df.withColumn("item", F.explode_outer(F.col("items")))  # keeps nulls as null row
```

---

## Common Pitfalls

- Using `inferSchema=True` for CSV in production — it scans the entire file once to infer types, doubling read time. Define the schema explicitly.
- Not aliasing columns after a join when both tables share column names — leads to `AnalysisException: Ambiguous reference`.
- Calling `cache()` without a subsequent action — the cache is only materialised on first use, so the "cache" call alone does nothing until you trigger an action.
- Using `collect()` inside a UDF or transformation — UDFs run on executors, which cannot contact the driver to call `collect()`.
- Calling `orderBy()` without a subsequent `limit()` on large data — a global sort requires a full shuffle and is rarely needed; window functions or partition-local sorts are usually sufficient.
- Using `count()` to check if a DataFrame is empty — it scans all data. Use `df.isEmpty` (Spark 3.3+) or `df.limit(1).count() == 0` instead.
- Mixing Python native types in expressions where `F.lit()` is needed — `F.col("a") + 5` works because Spark auto-promotes, but complex cases may require explicit `F.lit(5)`.

---

## Review Questions

1. What is the difference between `repartition(n)` and `coalesce(n)`? When would you prefer each when writing output files?
2. Explain the difference between `semi-join` and `anti-join`. Give a real-world use case for each.
3. What is the difference between `cache()` and `persist(StorageLevel.MEMORY_AND_DISK)`? When should you use `persist(StorageLevel.DISK_ONLY)`?
4. Write a DataFrame transformation that keeps only the most recent row per `user_id` using a window function.
5. What does `df.explain(True)` output, and which section is most useful for diagnosing a slow query?

#DataEngineering #Spark
