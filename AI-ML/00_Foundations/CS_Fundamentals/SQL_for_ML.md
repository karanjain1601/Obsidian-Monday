---
title: SQL for ML
aliases: [SQL Machine Learning, SQL Feature Engineering, SQL Data Pipeline, SQL for Data Scientists]
tags: [sql, data-engineering, feature-engineering, ml-data, databases]
domain: AI-ML
difficulty: Intermediate
created: 2026-07-26
related:
  - "[[Pandas]]"
  - "[[Python_for_ML]]"
  - "[[Feature_Engineering]]"
  - "[[ETL_ELT_for_ML]]"
  - "[[Data_Warehouses_for_ML]]"
  - "[[Feature_Stores]]"
  - "[[Data_Quality_and_Validation]]"
  - "[[Apache_Spark_for_ML]]"
  - "[[Handling_Imbalanced_Data]]"
  - "[[Data_Drift]]"
status: complete
---

# 🗄️ SQL for ML

> [!abstract] TL;DR
> SQL is the lingua franca of structured data — ML practitioners who master window functions, CTEs, and feature engineering patterns can extract, transform, and validate training datasets directly inside the database, at a scale pandas cannot match and with zero data movement overhead.

---

## Intuition

**Analogy:** A sushi chef does not carry raw fish out of the walk-in freezer, drive it to a separate kitchen across town, and then slice it there. The prep happens on-premises, with the best tools available, right where the fish already lives.

SQL is that on-premises prep. Your data lives in a warehouse. Instead of exporting gigabytes to a pandas DataFrame, you push the transformation logic to where the data already lives — the database's massively parallel engine runs the work. The output is a clean, compact feature table that Python pulls down in a single `SELECT * FROM features WHERE split = 'train'` call.

---

## How It Works

### Core Mechanics

SQL for ML is not just basic SELECTs. The ML-relevant subset operates in four layers:

1. **Shape the data** — JOINs, GROUP BY, CASE WHEN, DISTINCT, deduplication
2. **Engineer features** — Window functions (LAG, LEAD, rolling aggregates), date arithmetic, string extraction, pivot patterns
3. **Create ML-ready splits** — Temporal train/test splits, stratified sampling with NTILE, label generation from event logs
4. **Validate data** — NULL audits, duplicate detection, distribution drift queries, row count monitoring

### Flow / Architecture

```mermaid
graph LR
    RawDB[(Raw_DB)] --> DW[(DW_BigQuery_Snowflake)]
    DW --> SQL[SQL_Feature_Engineering]
    SQL -->|window_fns_LAG_LEAD| FT[(Feature_Table)]
    SQL -->|aggregations_GROUP_BY| FT
    SQL -->|joins_and_CTEs| FT
    FT --> FS[(Feature_Store_Feast)]
    FT --> ML[Model_Training]
    FS --> ML
```

---

## Core SELECT Essentials

### JOINs

| Join Type | Returns | ML Use Case |
|---|---|---|
| `INNER JOIN` | Rows matching in both tables | Join events to user profiles — only users with both |
| `LEFT JOIN` | All left rows; NULL when no right match | Keep all users even if they have no purchase event |
| `SELF JOIN` | Table joined to itself | Compare a row to the previous row for the same entity |
| `CROSS JOIN` | Cartesian product of both tables | Generate all (user, item) candidate pairs for a recommender |

> **Fan-out warning:** A `LEFT JOIN` onto a one-to-many relationship silently multiplies row counts. Always `SELECT COUNT(*)` before and after any join, and pre-aggregate on the join key when needed.

### GROUP BY + HAVING

```sql
-- HAVING filters AFTER aggregation; WHERE cannot reference aggregate results
SELECT
    user_id,
    COUNT(*)        AS total_purchases,
    AVG(amount)     AS avg_spend,
    SUM(amount)     AS lifetime_value
FROM purchases
GROUP BY user_id
HAVING COUNT(*) >= 5   -- only users with at least 5 purchases
ORDER BY lifetime_value DESC;
```

### CASE WHEN

```sql
-- Categorical feature: activity segment from recency
SELECT
    user_id,
    days_since_last_purchase,
    CASE
        WHEN days_since_last_purchase <= 7  THEN 'active'
        WHEN days_since_last_purchase <= 30 THEN 'recent'
        WHEN days_since_last_purchase <= 90 THEN 'at_risk'
        ELSE                                     'churned'
    END AS activity_segment
FROM user_recency;
```

### CTEs (WITH clause) vs Subqueries

CTEs break a complex query into named, readable steps. Most query planners inline CTEs (treat them like subqueries) so they do not automatically improve performance — their value is readability and reuse within the same query.

```sql
-- CTE: each step is named and easy to inspect
WITH active_users AS (
    SELECT user_id
    FROM users
    WHERE last_login_date >= CURRENT_DATE - INTERVAL '30 days'
),
user_spend AS (
    SELECT o.user_id, SUM(o.amount) AS total_spend
    FROM orders o
    INNER JOIN active_users a USING (user_id)
    GROUP BY o.user_id
)
SELECT user_id, total_spend
FROM user_spend
WHERE total_spend > 100
ORDER BY total_spend DESC;
```

> PostgreSQL 12+ supports `WITH cte AS MATERIALIZED (...)` to force the planner to persist the intermediate result — useful when the CTE is referenced multiple times in the outer query.

---

## Window Functions

Window functions compute a value for each row relative to a surrounding "window" of rows — without collapsing them into a group. This makes them the single most powerful SQL construct for time-series and sequential feature engineering.

### Syntax Pattern

```sql
FUNCTION() OVER (
    PARTITION BY <group_col>   -- reset the window for each group
    ORDER BY <order_col>       -- defines row sequence within the window
    ROWS BETWEEN <start> AND <end>  -- optional frame clause
)
```

### Key Window Functions for ML

| Function | What It Returns | ML Use Case |
|---|---|---|
| `ROW_NUMBER()` | Unique sequential integer per partition | Deduplication — keep the most recent record per user |
| `RANK()` | Rank with gaps on ties | Feature: rank of current purchase by amount |
| `DENSE_RANK()` | Rank without gaps on ties | Same, no skipped numbers |
| `LAG(col, n)` | Value n rows before the current row | Previous purchase amount; yesterday's price |
| `LEAD(col, n)` | Value n rows after the current row | Next event label for sequence model targets |
| `FIRST_VALUE(col)` | First value in the window frame | User's first-ever purchase amount |
| `LAST_VALUE(col)` | Last value in the window frame | User's most recent status (needs `ROWS BETWEEN ... CURRENT ROW`) |
| `SUM/AVG OVER` | Running or rolling aggregate | 7-day rolling spend; cumulative transaction count |

### Frame Clause — the Data Leakage Tripwire

```sql
-- WRONG for training features: UNBOUNDED FOLLOWING includes future rows
AVG(amount) OVER (PARTITION BY user_id ORDER BY txn_date
    ROWS BETWEEN 6 PRECEDING AND UNBOUNDED FOLLOWING)

-- CORRECT: only look back, never forward
AVG(amount) OVER (PARTITION BY user_id ORDER BY txn_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
```

---

## Feature Engineering in SQL

### Date and Time Features

```sql
SELECT
    event_id,
    user_id,
    event_ts,
    EXTRACT(HOUR  FROM event_ts)        AS hour_of_day,
    EXTRACT(DOW   FROM event_ts)        AS day_of_week,   -- 0=Sunday (PostgreSQL)
    EXTRACT(MONTH FROM event_ts)        AS month,
    DATE_TRUNC('week', event_ts)        AS week_start,
    -- Days since event (PostgreSQL syntax)
    CURRENT_DATE - DATE(event_ts)       AS days_since_event
FROM events;
-- BigQuery: DATE_DIFF(CURRENT_DATE, DATE(event_ts), DAY)
-- Snowflake: DATEDIFF('day', DATE(event_ts), CURRENT_DATE)
```

### String and Regex Features

```sql
SELECT
    product_id,
    product_description,
    -- Extract category from a URL path segment (PostgreSQL REGEXP)
    REGEXP_REPLACE(url_path, '^/cat/([^/]+)/.*$', '\1')         AS url_category,
    -- Email domain
    SPLIT_PART(email, '@', 2)                                    AS email_domain,
    -- Text length signals
    LENGTH(product_description)                                  AS desc_char_count,
    ARRAY_LENGTH(STRING_TO_ARRAY(product_description, ' '), 1)  AS word_count
FROM products;
```

### Pivot: CASE WHEN Aggregation Pattern

```sql
-- One row per user; one column per product category
SELECT
    user_id,
    SUM(CASE WHEN category = 'electronics' THEN amount ELSE 0 END) AS electronics_spend,
    SUM(CASE WHEN category = 'clothing'    THEN amount ELSE 0 END) AS clothing_spend,
    SUM(CASE WHEN category = 'food'        THEN amount ELSE 0 END) AS food_spend,
    COUNT(CASE WHEN category = 'electronics' THEN 1 END)           AS electronics_orders
FROM orders
GROUP BY user_id;
```

---

## ML-Specific SQL Patterns

### Deduplication with ROW_NUMBER

```sql
-- Keep the most recent profile record per user_id
WITH deduped AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY updated_at DESC
        ) AS rn
    FROM user_profiles
)
SELECT * EXCEPT (rn) FROM deduped WHERE rn = 1;
```

### Label Generation from Event Logs

```sql
-- Binary churn label: 1 if the user made NO purchase in the 30 days after their last login
WITH last_login AS (
    SELECT user_id, MAX(login_ts) AS last_login_ts
    FROM logins
    GROUP BY user_id
),
post_login_purchases AS (
    SELECT DISTINCT p.user_id
    FROM purchases p
    INNER JOIN last_login l ON p.user_id = l.user_id
    WHERE p.purchase_ts > l.last_login_ts
      AND p.purchase_ts <= l.last_login_ts + INTERVAL '30 days'
)
SELECT
    l.user_id,
    CASE WHEN plp.user_id IS NULL THEN 1 ELSE 0 END AS churned
FROM last_login l
LEFT JOIN post_login_purchases plp USING (user_id);
```

### Computing Class Weights

```sql
-- Mirrors sklearn's compute_class_weight('balanced') formula:
-- weight = n_samples / (n_classes * n_samples_in_class)
WITH counts AS (
    SELECT
        label,
        COUNT(*) AS class_count,
        SUM(COUNT(*)) OVER ()          AS total_rows,
        COUNT(DISTINCT label) OVER ()  AS n_classes
    FROM training_data
    GROUP BY label
)
SELECT
    label,
    class_count,
    ROUND(total_rows::NUMERIC / (n_classes * class_count), 4) AS class_weight
FROM counts
ORDER BY label;
```

---

## Analytical Functions for ML

### Percentiles and Distribution Inspection

```sql
-- PERCENTILE_CONT: continuous interpolation (standard for numeric features)
SELECT
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY amount) AS p25,
    PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY amount) AS median,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY amount) AS p75,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY amount) AS p95,
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY amount) AS p99
FROM transactions;
```

### Histogram Buckets

```sql
-- 20 equal-width buckets between 0 and 1000 (PostgreSQL WIDTH_BUCKET)
SELECT
    WIDTH_BUCKET(amount, 0, 1000, 20) AS bucket,
    COUNT(*)                           AS frequency,
    MIN(amount)                        AS bucket_min,
    MAX(amount)                        AS bucket_max
FROM transactions
GROUP BY bucket
ORDER BY bucket;
```

### Pearson Correlation and Z-Score

```sql
-- Pearson correlation between two candidate features
SELECT CORR(feature_a, feature_b) AS pearson_corr
FROM feature_table;

-- Z-score normalization inline (useful for pre-inspecting skew before modeling)
SELECT
    user_id,
    amount,
    (amount - AVG(amount) OVER ()) /
        NULLIF(STDDEV(amount) OVER (), 0) AS amount_zscore
FROM transactions;
```

---

## Data Quality Checks in SQL

```sql
-- 1. NULL AUDIT: proportion of nulls per critical column
SELECT
    COUNT(*)                                                          AS total_rows,
    ROUND(SUM(CASE WHEN user_id IS NULL THEN 1 ELSE 0 END)
          * 100.0 / COUNT(*), 2)                                      AS user_id_null_pct,
    ROUND(SUM(CASE WHEN amount  IS NULL THEN 1 ELSE 0 END)
          * 100.0 / COUNT(*), 2)                                      AS amount_null_pct
FROM transactions;

-- 2. DUPLICATE DETECTION
SELECT user_id, COUNT(*) AS duplicate_count
FROM users
GROUP BY user_id
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 20;

-- 3. DISTRIBUTION DRIFT: compare current vs historical mean (z-score of mean shift)
WITH historical AS (
    SELECT AVG(amount) AS hist_mean, STDDEV(amount) AS hist_std
    FROM transactions WHERE txn_date < '2024-01-01'
),
current AS (
    SELECT AVG(amount) AS curr_mean
    FROM transactions WHERE txn_date >= '2024-01-01'
)
SELECT
    hist_mean, curr_mean,
    ABS(curr_mean - hist_mean) / NULLIF(hist_std, 0) AS mean_shift_stddevs
FROM historical, current;

-- 4. ROW COUNT MONITORING: flag days where volume dropped >20%
SELECT
    txn_date,
    COUNT(*)                                                          AS daily_rows,
    LAG(COUNT(*), 1) OVER (ORDER BY txn_date)                        AS prev_day_rows,
    ROUND(COUNT(*) * 1.0 /
          NULLIF(LAG(COUNT(*), 1) OVER (ORDER BY txn_date), 0), 3)   AS row_ratio
FROM transactions
GROUP BY txn_date
ORDER BY txn_date DESC;
```

---

## Big Data SQL: BigQuery and Snowflake

### Syntax Reference

| Feature | BigQuery | Snowflake | PostgreSQL |
|---|---|---|---|
| Date diff | `DATE_DIFF(d1, d2, DAY)` | `DATEDIFF('day', d2, d1)` | `d1 - d2` (integer days) |
| Approx distinct | `APPROX_COUNT_DISTINCT(col)` | `APPROX_COUNT_DISTINCT(col)` | `COUNT(DISTINCT col)` (exact) |
| Array unnest | `CROSS JOIN UNNEST(arr_col) AS item` | `LATERAL FLATTEN(input => arr_col)` | `UNNEST(arr_col)` |
| Regex extract | `REGEXP_EXTRACT(col, pattern)` | `REGEXP_SUBSTR(col, pattern)` | `REGEXP_MATCH(col, pattern)` |
| String split | `SPLIT(col, delim)` → ARRAY | `SPLIT(col, delim)` → ARRAY | `STRING_TO_ARRAY(col, delim)` |
| Exclude columns | `SELECT * EXCEPT (col)` | `SELECT * EXCLUDE col` | Not natively supported |

### Cost Optimization Patterns

```sql
-- 1. PARTITION PRUNING: filter on the partition column directly
--    BAD  — wrapping in DATE() prevents partition elimination in BigQuery:
SELECT * FROM events WHERE DATE(event_ts) = '2024-01-15';
--    GOOD — filters on the native DATE partition column:
SELECT * FROM events WHERE event_date = '2024-01-15';

-- 2. APPROX_COUNT_DISTINCT: ~2% error, 10-100x cheaper than COUNT(DISTINCT) at scale
SELECT APPROX_COUNT_DISTINCT(user_id) AS approx_unique_users FROM events;

-- 3. Column projection — never SELECT * on wide tables in columnar warehouses
SELECT user_id, event_date, amount FROM events WHERE event_date = '2024-01-15';
```

---

## Code Demo

### 1. Time-Series Feature Engineering with Window Functions

```sql
-- Rolling and lag features for a transaction time series
-- Table: transactions(user_id TEXT, txn_date DATE, amount NUMERIC)
WITH ordered_txns AS (
    SELECT
        user_id,
        txn_date,
        amount,
        ROW_NUMBER() OVER (
            PARTITION BY user_id ORDER BY txn_date
        )                                                             AS txn_seq,
        LAG(amount,   1) OVER (PARTITION BY user_id ORDER BY txn_date) AS prev_amount,
        LAG(txn_date, 1) OVER (PARTITION BY user_id ORDER BY txn_date) AS prev_txn_date,
        -- 7-row rolling average (position-based; for true date-range window use RANGE)
        AVG(amount) OVER (
            PARTITION BY user_id
            ORDER BY txn_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        )                                                             AS rolling_7row_avg,
        -- Cumulative spend up to and including current row
        SUM(amount) OVER (
            PARTITION BY user_id
            ORDER BY txn_date
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        )                                                             AS cumulative_spend
    FROM transactions
)
SELECT
    user_id,
    txn_date,
    amount,
    txn_seq,
    COALESCE(prev_amount, amount)          AS prev_amount,
    amount - COALESCE(prev_amount, amount) AS amount_delta,
    txn_date - prev_txn_date               AS days_since_last_txn,  -- NULL for first txn
    ROUND(rolling_7row_avg::NUMERIC, 2)    AS rolling_7row_avg,
    cumulative_spend
FROM ordered_txns
ORDER BY user_id, txn_date;
```

### 2. Train/Val/Test Split with Stratified Sampling Verification

```sql
-- Temporal primary split + stratification check
-- Table: events(user_id TEXT, event_date DATE, label INT)
WITH split_assigned AS (
    SELECT
        user_id,
        event_date,
        label,
        CASE
            WHEN event_date <  '2024-09-01' THEN 'train'
            WHEN event_date <  '2024-11-01' THEN 'val'
            ELSE                                 'test'
        END AS split,
        -- Within each label, assign equal-sized buckets (used to verify balance)
        NTILE(10) OVER (
            PARTITION BY label
            ORDER BY RANDOM()
        ) AS label_bucket
    FROM events
    WHERE event_date >= '2023-01-01'
),
-- Audit: class distribution by split — both counts and percentages
split_audit AS (
    SELECT
        split,
        label,
        COUNT(*) AS n,
        ROUND(
            COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY split),
            2
        ) AS pct_within_split
    FROM split_assigned
    GROUP BY split, label
)
SELECT * FROM split_audit ORDER BY split, label;
-- Expected: pct_within_split should be similar across train/val/test for each label
```

### 3. DuckDB + Pandas for Local ML Feature Extraction

```python
import duckdb
import pandas as pd

# DuckDB runs in-process — no server, no cluster, no data movement.
# It can query parquet files and pandas DataFrames directly.
# Performance is comparable to Spark on a single machine up to ~50 GB.

conn = duckdb.connect()

# Option A: register a pandas DataFrame as a virtual SQL table
raw_df = pd.read_parquet("transactions.parquet")
conn.register("transactions", raw_df)

feature_sql = """
WITH base AS (
    SELECT
        user_id,
        CAST(txn_date AS DATE)                                         AS txn_date,
        amount,
        LAG(amount, 1) OVER (PARTITION BY user_id ORDER BY txn_date)   AS prev_amount,
        AVG(amount) OVER (
            PARTITION BY user_id
            ORDER BY txn_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        )                                                               AS rolling_7row_avg,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY txn_date DESC) AS rn
    FROM transactions
)
SELECT
    user_id,
    txn_date,
    amount,
    COALESCE(prev_amount, amount)              AS prev_amount,
    ROUND(rolling_7row_avg, 2)                 AS rolling_7row_avg,
    amount - COALESCE(prev_amount, amount)     AS amount_delta
FROM base
WHERE rn = 1   -- most recent transaction per user only
"""

# Result is a pandas DataFrame — zero extra copying
features_df = conn.execute(feature_sql).df()
print(f"Feature matrix shape: {features_df.shape}")
print(features_df.head())

# Option B: query parquet directly without ever loading into pandas
unique_users = conn.execute(
    "SELECT COUNT(DISTINCT user_id) FROM read_parquet('transactions.parquet')"
).fetchone()[0]
print(f"Unique users in parquet: {unique_users}")

conn.close()
```

---

## SQL + Python Integration

### pandas.read_sql / SQLAlchemy

```python
import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("postgresql+psycopg2://user:pass@host:5432/dbname")

# Pull a complete feature table into pandas for model training
train_df = pd.read_sql(
    sql="SELECT user_id, feature_a, feature_b, label FROM feature_table WHERE split = 'train'",
    con=engine
)
```

### dbt for Feature Pipelines

dbt (data build tool) compiles SQL `SELECT` statements into scheduled, version-controlled warehouse tables. It is the standard tool for production SQL feature pipelines.

Key capabilities:
- **DAG execution** — model A runs before model B if B references A via `{{ ref('A') }}`
- **Incremental models** — only process rows newer than the last run, keeping warehouse costs low
- **Built-in tests** — `not_null`, `unique`, `accepted_values` assertions run before downstream models consume data
- **Lineage graph** — every feature table traces back to raw source tables

```sql
-- dbt model: models/features/user_rolling_spend.sql
{{ config(materialized='incremental', unique_key='user_id') }}

SELECT
    user_id,
    txn_date,
    SUM(amount) OVER (
        PARTITION BY user_id
        ORDER BY txn_date
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS rolling_30day_spend
FROM {{ ref('stg_transactions') }}
{% if is_incremental() %}
WHERE txn_date > (SELECT MAX(txn_date) FROM {{ this }})
{% endif %}
```

---

## Real-World Example

> **Example — Uber Eats Personalization:** Uber's ML platform computes driver and rider features — `avg_surge_multiplier_last_7_trips`, `days_since_last_cancellation`, `median_wait_time_last_30_days` — using window functions in BigQuery over hundreds of billions of event rows. SQL handles the scale (10 TB+ daily events) that would be impossible in pandas, while keeping feature definitions readable and auditable by data scientists. The SQL output is materialized into a feature store (Michelangelo) which then serves both offline training data and online inference. The only code that data scientists write for most features is SQL.

---

## Trade-offs

| Aspect | SQL | Pandas | Apache Spark |
|---|---|---|---|
| **Scale** | Terabytes (warehouse-native MPP) | ~10 GB practical RAM limit | Petabytes (distributed cluster) |
| **Expressiveness** | Excellent for set ops, joins, window fns; awkward for iteration | Maximum flexibility (arbitrary Python) | Strong; mirrors pandas API |
| **Performance — small data** | Round-trip and parse overhead | Fast, in-memory | Cluster startup overhead (minutes) |
| **Performance — large data** | Excellent — runs where data lives | Out-of-memory failure | Excellent |
| **Deployment complexity** | Runs in the warehouse — no infra | Needs a VM with enough RAM | Needs a Spark cluster |
| **Team accessibility** | Universal — analysts and engineers share one language | Python teams only | Requires Spark expertise |
| **Feature versioning** | Hard natively; solved by dbt | Hard (use DVC/MLflow) | Hard (use Delta Lake) |

---

## When to Use vs Avoid

**Use SQL when:**
- Features are aggregations, joins, or window functions over structured tables already in a warehouse.
- Data volume exceeds pandas memory but a full Spark cluster is not warranted.
- The team is cross-functional (analysts + engineers) — SQL lowers the collaboration barrier.
- You need reproducible, auditable feature definitions stored in version control (dbt models).
- You want to avoid data movement — compute runs where the data lives.

**Avoid SQL when:**
- Features require iterative Python logic (e.g., recursive algorithms, custom tokenizers, graph traversal).
- Data is unstructured — images, audio, raw text documents.
- Complex ML transforms (embeddings, custom preprocessing pipelines) require PyTorch or scikit-learn.
- The feature logic is already well-tested in pandas and the dataset comfortably fits in memory.

---

## Common Pitfalls

- **Data leakage from window frame errors** — Using `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` or omitting the frame clause includes future rows. Always use `ROWS BETWEEN N PRECEDING AND CURRENT ROW` for training features. Audit by checking whether `LEAD()` returns non-NULL values in your feature query — if it does, future data is in scope.

- **Fan-out in JOINs inflating row counts** — Joining on a non-unique key silently multiplies rows. A user with 5 orders joined to a table with 3 addresses yields 15 rows, not 5. Diagnose with `SELECT COUNT(*) BEFORE JOIN; SELECT COUNT(*) AFTER JOIN`. Fix by pre-aggregating the join-side table to one row per key before joining.

- **Timezone issues in date features** — Timestamps stored as UTC render differently depending on the client timezone. `DATE(event_ts)` in UTC shifts the day boundary, splitting the same calendar day's events across two dates for users in UTC-8. Always normalize to the user's local timezone before extracting date parts: `DATE(CONVERT_TZ(event_ts, 'UTC', user_tz))`.

- **NULL propagation silently skewing aggregates** — `AVG(amount)` ignores NULLs, which inflates the average if NULLs represent zero-value events. `SUM(col)` returns NULL if all inputs are NULL. Use `COALESCE` deliberately — `AVG(COALESCE(amount, 0))` — only when NULL genuinely means zero, not when it means "unknown."

- **Assuming CTEs always optimize performance** — CTEs are not materialized by default in BigQuery or PostgreSQL <12. The planner inlines them like subqueries. Wrapping a slow subquery in a CTE does not help. Use `EXPLAIN` to verify the execution plan, and in PostgreSQL 12+ use `WITH cte AS MATERIALIZED (...)` explicitly when you reference the CTE multiple times.

---

## Related Concepts

- [[Pandas]] — Python-side counterpart; `pd.read_sql()` bridges SQL query results directly into a DataFrame for model training and evaluation
- [[Python_for_ML]] — integrates with SQL via SQLAlchemy, psycopg2, and DuckDB; Python orchestrates when and how SQL queries are run
- [[Feature_Engineering]] — SQL implements the same transformations (binning, ratios, date decomposition, interaction features) as Python-based FE, but at warehouse scale
- [[ETL_ELT_for_ML]] — SQL-based ELT is the modern norm; dbt models are version-controlled SQL that compile into warehouse transformations
- [[Data_Warehouses_for_ML]] — BigQuery and Snowflake are the MPP execution engines that make the window function and aggregation patterns in this note fast at scale
- [[Feature_Stores]] — SQL feature pipelines produce the offline feature tables that feature stores version, serve to training jobs, and replicate to online stores
- [[Data_Quality_and_Validation]] — SQL data quality queries (NULL audits, distribution drift checks) complement programmatic tools like Great Expectations
- [[Apache_Spark_for_ML]] — the alternative when data exceeds warehouse capability or features require custom Python iteration unavailable in SQL
- [[Handling_Imbalanced_Data]] — SQL computes class weights and stratified samples that feed directly into imbalanced-data training strategies
- [[Data_Drift]] — distribution drift queries in SQL (comparing historical vs current feature statistics) are an early-warning mechanism for feature drift

---

## Review Questions

1. You are building a churn prediction model using `avg_spend_last_7_days` as a feature, computed with `AVG(amount) OVER (PARTITION BY user_id ORDER BY txn_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`. What must the `ORDER BY` column guarantee to prevent data leakage, and what goes wrong if you use `ORDER BY RANDOM()` instead?

2. After adding a `LEFT JOIN orders ON users.user_id = orders.user_id` to your feature query, the row count triples unexpectedly. Describe two distinct root causes and the exact SQL diagnostic query you would run to distinguish between them.

3. Walk through the full SQL pipeline to: (a) assign a stratified 70/15/15 train/val/test split preserving class balance for a binary label, (b) compute `class_weight` for each label class using the sklearn balanced formula, and (c) verify the class distribution is consistent across all three splits in a single audit query.

4. You have 800 GB of daily event data in Snowflake and need features for a new model experiment. Compare the practical trade-offs of (a) writing a dbt SQL model materialized as a table, (b) running a pandas script on a large VM after exporting a sample, and (c) running PySpark on a managed cluster. What is the deciding factor for each approach?

---

## Sources

- [BigQuery — Window Function Calls](https://cloud.google.com/bigquery/docs/reference/standard-sql/window_function_calls)
- [Snowflake — Window Functions](https://docs.snowflake.com/en/sql-reference/functions-analytic)
- [dbt Labs — What is dbt?](https://docs.getdbt.com/docs/introduction)
- [DuckDB Python API](https://duckdb.org/docs/api/python/overview.html)
- [PostgreSQL 14 — Window Functions](https://www.postgresql.org/docs/14/functions-window.html)

---

#sql #data-engineering #feature-engineering #ml-data #databases
