---
title: Analytics Engineering with Python
aliases:
  - Python Database Connections
  - Python Warehouse Integration
  - Analytics Engineering Python
tags: [DataAnalytics, Python, Snowflake, BigQuery, Airflow, DuckDB, Polars]
domain: Data Analytics
difficulty: Advanced
created: 2026-07-29
related:
  - "[[Pandas_Advanced_Analytics]]"
  - "[[Data_Pipeline_ETL_ELT]]"
  - "[[Snowflake_and_BigQuery]]"
  - "[[dbt_Analytics_Engineering]]"
  - "[[Data_Warehouse_Concepts]]"
  - "[[Streamlit_Dashboards]]"
status: complete
---

# Analytics Engineering with Python

> [!abstract] TL;DR
> Analytics engineering sits at the intersection of data engineering and data analysis — writing Python that connects to cloud warehouses, reads from APIs, handles large datasets efficiently, and orchestrates scheduled pipelines. The modern stack: SQLAlchemy/cloud connectors for database I/O, Polars or DuckDB for fast in-process computation on large files, and Airflow or Prefect for scheduling. This note covers the plumbing that makes analytics pipelines production-ready.

---

## Connecting to Databases

### PostgreSQL / MySQL (psycopg2 + SQLAlchemy)

```python
from sqlalchemy import create_engine, text
import pandas as pd

# SQLAlchemy engine — connection pool, ORM, or raw SQL
engine = create_engine(
    "postgresql+psycopg2://user:password@host:5432/dbname",
    pool_size=5,
    max_overflow=10,
    pool_timeout=30
)

# Read with pandas
df = pd.read_sql("SELECT * FROM orders WHERE date >= '2025-01-01'", engine)

# Parameterized query (safe from SQL injection)
query = text("SELECT * FROM orders WHERE region = :region AND date >= :start")
with engine.connect() as conn:
    df = pd.read_sql(query, conn, params={"region": "East", "start": "2025-01-01"})

# Write back to database
df_results.to_sql("analytics_output", engine, if_exists="replace",
                  index=False, method="multi", chunksize=1000)
```

---

### Snowflake

```python
import snowflake.connector
from snowflake.connector.pandas_tools import write_pandas

conn = snowflake.connector.connect(
    user="analyst@company.com",
    authenticator="externalbrowser",  # SSO
    account="abc12345.us-east-1",
    warehouse="ANALYTICS_WH",
    database="PROD",
    schema="PUBLIC"
)

# Read
cursor = conn.cursor()
cursor.execute("SELECT * FROM orders LIMIT 1000")
df = cursor.fetch_pandas_all()

# Or via SQLAlchemy (preferred)
from sqlalchemy import create_engine
from snowflake.sqlalchemy import URL

engine = create_engine(URL(
    account="abc12345.us-east-1",
    user="service_account",
    password="secret",
    database="PROD",
    schema="PUBLIC",
    warehouse="ANALYTICS_WH"
))
df = pd.read_sql("SELECT * FROM orders", engine)

# Write: fast Snowflake-native bulk load
write_pandas(conn, df, table_name="ANALYTICS_OUTPUT", auto_create_table=True)
```

---

### Google BigQuery

```python
from google.cloud import bigquery
import pandas as pd

# Authenticated via Application Default Credentials (gcloud auth)
client = bigquery.Client(project="my-project")

# Read as DataFrame (uses Arrow internally — fast)
query = """
    SELECT DATE_TRUNC(order_date, MONTH) AS month,
           SUM(revenue) AS total
    FROM `myproject.prod.orders`
    WHERE order_date >= '2025-01-01'
    GROUP BY 1
"""
df = client.query(query).to_dataframe()

# Via pandas-gbq (simpler API)
import pandas_gbq
df = pandas_gbq.read_gbq(query, project_id="my-project")

# Write to BigQuery
pandas_gbq.to_gbq(
    df_results,
    "myproject.analytics.output_table",
    project_id="my-project",
    if_exists="replace"  # or "append", "fail"
)
```

---

## Reading from APIs

```python
import requests
import pandas as pd

# REST API → DataFrame
def get_api_data(endpoint: str, api_key: str, params: dict) -> pd.DataFrame:
    headers = {"Authorization": f"Bearer {api_key}"}
    all_records = []

    while endpoint:
        resp = requests.get(endpoint, headers=headers, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        all_records.extend(data["results"])
        endpoint = data.get("next")  # pagination: follow next URL
        params = {}                  # params only on first request

    return pd.json_normalize(all_records)  # flatten nested JSON

# Handling nested JSON
import json
raw_json = [
    {"id": 1, "user": {"name": "Alice", "tier": "gold"}, "amount": 100},
    {"id": 2, "user": {"name": "Bob",   "tier": "silver"}, "amount": 50}
]
df = pd.json_normalize(raw_json, sep="_")
# Columns: id, user_name, user_tier, amount
```

---

## Large Dataset Patterns

### Chunked Reading (When RAM is Limited)

```python
# Process 10GB CSV in chunks without loading entirely
results = []
for chunk in pd.read_csv("huge_file.csv", chunksize=100_000,
                          dtype={"user_id": "int32", "amount": "float32"}):
    # Apply transformations per chunk
    chunk_summary = (
        chunk[chunk["amount"] > 0]
        .groupby("region")["amount"]
        .sum()
        .reset_index()
    )
    results.append(chunk_summary)

# Combine all chunk summaries
final = pd.concat(results).groupby("region")["amount"].sum().reset_index()
```

### Polars — Faster than Pandas for Large Data

```python
import polars as pl

# Lazy evaluation: build a query plan, execute only when needed
df = (
    pl.scan_csv("large_file.csv")           # lazy — doesn't load yet
    .filter(pl.col("amount") > 0)
    .filter(pl.col("date") >= "2025-01-01")
    .group_by("region")
    .agg([
        pl.col("amount").sum().alias("total_revenue"),
        pl.col("user_id").n_unique().alias("unique_users")
    ])
    .sort("total_revenue", descending=True)
    .collect()                               # execute the full plan
)

# Polars is 5-10x faster than pandas for many workloads
# Key features: lazy evaluation, multi-threaded, Arrow-native
```

### DuckDB — SQL on DataFrames and Files

```python
import duckdb
import pandas as pd

# Query a Parquet file directly with SQL — no loading needed
result = duckdb.query("""
    SELECT region,
           SUM(revenue) AS total_revenue,
           COUNT(DISTINCT user_id) AS customers,
           AVG(revenue) AS avg_order
    FROM 'data/orders_*.parquet'          -- glob pattern!
    WHERE order_date >= '2025-01-01'
    GROUP BY region
    ORDER BY total_revenue DESC
""").df()

# Query a pandas DataFrame with SQL
orders_df = pd.read_csv("orders.csv")
summary = duckdb.query("SELECT region, SUM(amount) FROM orders_df GROUP BY 1").df()

# DuckDB handles: CSV, Parquet, Arrow, Pandas DataFrames
# Excellent for: ad-hoc analysis on large files without a database server
```

---

## Orchestration: Airflow Concepts

Apache Airflow schedules and monitors data pipelines as directed acyclic graphs (DAGs).

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta

# DAG definition
with DAG(
    dag_id="daily_revenue_report",
    start_date=datetime(2025, 1, 1),
    schedule_interval="0 8 * * *",   # 8 AM daily (cron syntax)
    catchup=False,
    default_args={
        "retries": 2,
        "retry_delay": timedelta(minutes=5),
        "email_on_failure": True,
        "email": ["analytics@company.com"]
    }
) as dag:

    def extract_data(**context):
        # context["ds"] = execution date string (YYYY-MM-DD)
        run_date = context["ds"]
        df = pd.read_sql(f"SELECT * FROM orders WHERE date = '{run_date}'", engine)
        df.to_parquet(f"/tmp/orders_{run_date}.parquet")

    def transform_data(**context):
        run_date = context["ds"]
        df = pd.read_parquet(f"/tmp/orders_{run_date}.parquet")
        summary = df.groupby("region")["revenue"].sum().reset_index()
        summary.to_sql("daily_summary", engine, if_exists="append", index=False)

    extract = PythonOperator(task_id="extract", python_callable=extract_data)
    transform = PythonOperator(task_id="transform", python_callable=transform_data)
    dbt_run = BashOperator(task_id="dbt_run", bash_command="dbt run --select daily_report")

    extract >> transform >> dbt_run  # dependency chain
```

### Prefect (Modern Alternative)

```python
from prefect import flow, task
from prefect.schedules import CronSchedule

@task(retries=2, retry_delay_seconds=60)
def extract(run_date: str) -> pd.DataFrame:
    return pd.read_sql(f"SELECT * FROM orders WHERE date = '{run_date}'", engine)

@task
def transform(df: pd.DataFrame) -> pd.DataFrame:
    return df.groupby("region")["revenue"].sum().reset_index()

@task
def load(df: pd.DataFrame):
    df.to_sql("daily_summary", engine, if_exists="append", index=False)

@flow(name="daily-revenue", log_prints=True)
def daily_pipeline(run_date: str = None):
    if run_date is None:
        run_date = str(date.today())
    raw = extract(run_date)
    transformed = transform(raw)
    load(transformed)

# Deploy with: prefect deploy daily_pipeline --cron "0 8 * * *"
```

---

## Common Pitfalls

- **Connection pooling ignored** — creating a new SQLAlchemy engine inside a loop (e.g., inside a `for chunk` loop) opens new connections every iteration. Create the engine once outside the loop.
- **Sensitive credentials in code** — never hardcode passwords in Python scripts. Use environment variables (`os.environ["DB_PASSWORD"]`), `python-dotenv`, or secrets managers (AWS Secrets Manager, GCP Secret Manager).
- **DuckDB thread safety** — DuckDB connections are not thread-safe. Use one connection per thread, or use `duckdb.connect()` in `read_only=True` mode for concurrent reads.
- **Airflow XCom for large data** — Airflow's XCom mechanism (used to pass data between tasks) stores values in the metadata database. Never pass large DataFrames via XCom; write to S3/GCS and pass the file path.

---

## Review Questions

1. **Architecture:** You need to run a Python analytics job daily at 6 AM that: reads from Snowflake, applies transformations, and writes back. Walk through the choice between Airflow, Prefect, and a simple cron job + Python script. What factors determine which is appropriate?

2. **Performance:** A pandas pipeline reading a 4 GB Parquet file takes 3 minutes on a 16 GB machine. Describe three approaches to speed it up, and explain when you'd switch from pandas to Polars or DuckDB.

3. **Debugging:** Your SQLAlchemy query to PostgreSQL returns 0 rows, but running the same SQL in a database client returns 500 rows. What are the most likely causes and how do you diagnose each?

---

#DataAnalytics #Python #Snowflake #BigQuery #Airflow #DuckDB #Polars #advanced
