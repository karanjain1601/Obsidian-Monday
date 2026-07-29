---
title: Prefect and Modern Orchestration
aliases: [Prefect, Dagster, Modern Orchestration, Python Orchestration]
tags: [DataEngineering, Orchestration, Prefect, Dagster, Pipelines]
domain: Data Engineering
difficulty: Intermediate
created: 2026-07-29
related: [Apache_Airflow, dbt_Advanced, Pipeline_Design_Patterns]
status: complete
---

# Prefect and Modern Orchestration

> [!abstract] TL;DR
> Prefect and Dagster represent the next generation of data orchestration, addressing Airflow's pain points around developer experience and observability. Prefect treats pipelines as native Python with minimal boilerplate; Dagster takes an assets-first approach where the data itself (not the tasks) is the primary abstraction. Both are easier to test and debug than Airflow.

## Part 1: Prefect

### Overview

Prefect 2.x/3.x is a Python-native orchestration framework. Where Airflow requires DAG definitions with specific operators, Prefect turns any Python function into an observable, retriable, schedulable unit of work via decorators. It separates the **orchestration layer** (Prefect server) from **execution** (workers running on any infrastructure).

Key design philosophy:
- Negative engineering (retries, timeouts, alerting) handled by the framework
- Pure Python — no special operators or configuration classes needed
- The orchestration server is optional for local development

### Core Concepts: Flows and Tasks

```python
from prefect import flow, task
from prefect.tasks import task_input_hash
from prefect.logging import get_run_logger
from datetime import timedelta
import pandas as pd

@task(
    name="Extract Orders",
    retries=3,
    retry_delay_seconds=exponential(base=60, multiplier=2, max=600),
    cache_key_fn=task_input_hash,       # cache by inputs — same args = same result
    cache_expiration=timedelta(hours=1),
    timeout_seconds=300,
    log_prints=True,                    # capture print() statements in Prefect logs
    tags=["extract", "database"],
)
def extract_orders(start_date: str, end_date: str) -> pd.DataFrame:
    logger = get_run_logger()
    logger.info(f"Extracting orders from {start_date} to {end_date}")

    df = pd.read_sql(
        f"SELECT * FROM orders WHERE created_at BETWEEN '{start_date}' AND '{end_date}'",
        con=get_connection()
    )
    logger.info(f"Extracted {len(df)} rows")
    return df


@task(retries=2, retry_delay_seconds=30)
def transform_orders(df: pd.DataFrame) -> pd.DataFrame:
    df = df.dropna(subset=["order_id", "customer_id"])
    df["amount_usd"] = df["amount"] * df["fx_rate"]
    df["created_date"] = pd.to_datetime(df["created_at"]).dt.date
    return df


@task
def load_orders(df: pd.DataFrame, target_table: str = "fct_orders"):
    df.to_sql(
        target_table,
        con=get_warehouse_connection(),
        if_exists='append',
        index=False,
        method='multi',
        chunksize=10_000,
    )
    return len(df)


@flow(
    name="daily-orders-pipeline",
    description="Extract, transform and load daily orders",
    log_prints=True,
    timeout_seconds=3600,
)
def daily_orders_pipeline(start_date: str, end_date: str) -> dict:
    raw = extract_orders(start_date, end_date)
    cleaned = transform_orders(raw)
    rows_loaded = load_orders(cleaned)
    return {"rows_loaded": rows_loaded, "start_date": start_date, "end_date": end_date}


# Local execution — no server needed
if __name__ == "__main__":
    result = daily_orders_pipeline(
        start_date="2024-01-15",
        end_date="2024-01-15"
    )
    print(result)
```

### Subflows

Subflows create a parent-child relationship visible in the Prefect UI. Use them to modularize complex pipelines or share common logic.

```python
@flow(name="validate-data")
def validate_data(df: pd.DataFrame) -> bool:
    assert len(df) > 0, "Empty DataFrame"
    assert df["order_id"].is_unique, "Duplicate order IDs"
    assert (df["amount"] >= 0).all(), "Negative amounts found"
    return True

@flow(name="orchestration-pipeline")
def orchestration_pipeline(date: str):
    # Subflow call — creates a child flow run in the UI
    for source in ["orders", "customers", "products"]:
        df = extract_data(source, date)
        is_valid = validate_data(df)      # subflow
        if is_valid:
            load_data(df, target=source)
```

### Retry with Exponential Backoff

```python
from prefect.tasks import exponential, jitter

@task(
    retries=5,
    # Exponential backoff: 60s, 120s, 240s, 480s, 960s — with ±20% jitter
    retry_delay_seconds=jitter(exponential(base=60, multiplier=2, max=960), 0.2),
    retry_jitter_factor=0.1,
)
def call_external_api(endpoint: str) -> dict:
    response = requests.get(endpoint, timeout=30)
    response.raise_for_status()
    return response.json()
```

### Prefect Cloud vs Self-Hosted

```bash
# Self-hosted: spin up server + UI on port 4200
prefect server start
# Starts: API server, UI, metadata DB (SQLite default, PostgreSQL for production)

# Configure backend:
# PREFECT_API_URL=http://localhost:4200/api
# PREFECT_API_DATABASE_CONNECTION_URL=postgresql+asyncpg://user:pass@localhost/prefect

# Prefect Cloud (managed): authenticate and point to cloud
prefect cloud login --key pnu_your_api_key
```

| Feature | Self-Hosted | Prefect Cloud |
|---|---|---|
| Infrastructure | You manage (Docker, K8s) | Managed by Prefect |
| Free tier | Fully free | 400 flow runs/month free |
| UI | Local (port 4200) | Hosted at app.prefect.cloud |
| Automations | Available | Available with more templates |
| SLA / alerts | Manual setup | Built-in notifications |
| Multi-workspace | No | Yes (per team/env isolation) |

### Work Pools and Workers

Work pools define the infrastructure where flow runs execute. Workers are long-running processes that poll a work pool and execute flow runs.

```bash
# Create a work pool
prefect work-pool create --type process my-process-pool
prefect work-pool create --type docker my-docker-pool
prefect work-pool create --type kubernetes my-k8s-pool
prefect work-pool create --type ecs:push my-ecs-pool

# Start a worker (runs continuously, polls for work)
prefect worker start --pool my-process-pool

# For Docker worker
prefect worker start --pool my-docker-pool
```

```yaml
# Work pool infrastructure config (Docker example)
# Set via CLI or UI
work_pool:
  name: my-docker-pool
  type: docker
  base_job_template:
    variables:
      image: my-org/prefect-flows:latest
      cpu: 2
      memory: 4096
      env:
        DATABASE_URL: "{{ $DATABASE_URL }}"
```

### Deployments

A deployment packages a flow with its schedule, parameters, and work pool assignment.

```python
# Method 1: Python deployment
from prefect import flow
from prefect.deployments import Deployment
from prefect.server.schemas.schedules import CronSchedule

deployment = Deployment.build_from_flow(
    flow=daily_orders_pipeline,
    name="daily-orders-prod",
    schedule=CronSchedule(cron="0 6 * * *", timezone="America/New_York"),
    work_pool_name="my-process-pool",
    parameters={"start_date": "{{ ds }}", "end_date": "{{ ds }}"},
    tags=["production", "orders"],
    description="Production daily orders load",
)
deployment.apply()
```

```yaml
# Method 2: prefect.yaml (preferred for git-based workflows)
name: orders-pipeline
prefect-version: 3.0.0

build: []

push: []

pull:
  - prefect.deployments.steps.git_clone:
      repository: https://github.com/my-org/data-pipelines.git
      branch: main

deployments:
  - name: daily-orders-prod
    entrypoint: flows/orders.py:daily_orders_pipeline
    work_pool:
      name: my-process-pool
    schedule:
      cron: "0 6 * * *"
      timezone: "America/New_York"
    parameters:
      start_date: "2024-01-01"
      end_date: "2024-01-01"
    tags:
      - production

  - name: daily-orders-dev
    entrypoint: flows/orders.py:daily_orders_pipeline
    work_pool:
      name: my-process-pool
    schedule: null  # manual trigger only
    tags:
      - development
```

```bash
prefect deploy --all            # deploy all deployments in prefect.yaml
prefect deploy --name daily-orders-prod
prefect deployment run 'daily-orders-pipeline/daily-orders-prod'  # trigger manually
```

### Prefect Blocks — Typed Credentials

Blocks are versioned, typed storage for credentials and configuration. They can be shared across flows.

```python
from prefect_aws import S3Bucket, AwsCredentials
from prefect_snowflake import SnowflakeConnector
from prefect.blocks.system import Secret, JSON

# Load a pre-configured block (set up via UI or CLI)
s3_bucket = S3Bucket.load("prod-data-bucket")
snowflake_conn = SnowflakeConnector.load("prod-snowflake")
db_password = Secret.load("postgres-password")
pipeline_config = JSON.load("pipeline-config")

# Use in tasks
@task
def upload_to_s3(df: pd.DataFrame, key: str):
    s3 = S3Bucket.load("prod-data-bucket")
    with io.BytesIO() as buffer:
        df.to_parquet(buffer)
        s3.upload_from_file_object(buffer, to_path=key)

# Create a block programmatically
from prefect_aws import AwsCredentials
AwsCredentials(
    aws_access_key_id="AKIA...",
    aws_secret_access_key=SecretStr("..."),
    region_name="us-east-1"
).save("prod-aws-creds", overwrite=True)
```

### Artifacts — Structured Task Outputs

```python
from prefect.artifacts import create_table_artifact, create_markdown_artifact, create_link_artifact

@task
def generate_report(df: pd.DataFrame) -> None:
    # Store a table in the Prefect UI for auditability
    create_table_artifact(
        key="daily-summary",
        table=df.groupby("status")["amount"].sum().reset_index().to_dict("records"),
        description="Daily order amounts by status",
    )

    create_markdown_artifact(
        key="pipeline-summary",
        markdown=f"""
## Pipeline Run Summary
- **Rows Processed**: {len(df):,}
- **Total Revenue**: ${df['amount'].sum():,.2f}
- **Date Range**: {df['created_date'].min()} to {df['created_date'].max()}
        """,
    )

    create_link_artifact(
        key="dashboard",
        link="https://metabase.company.com/dashboard/42",
        description="Updated Metabase dashboard",
    )
```

---

## Part 2: Dagster

### Overview

Dagster takes an **assets-first** approach to orchestration. Rather than defining tasks (actions), you define **software-defined assets** (data outputs) — tables, files, ML models. Dagster infers the execution order from asset dependencies and tracks asset materialization history.

Key design principles:
- The unit of work is a **data asset**, not a task
- Assets have lineage, metadata, and freshness policies
- Separation between **logical assets** and **physical execution**
- Strong typing with Python type annotations

### Software-Defined Assets

```python
from dagster import asset, AssetIn, Output, MetadataValue
import pandas as pd

@asset(
    group_name="raw",
    description="Raw orders from the production transactional database",
    compute_kind="python",
    tags={"layer": "raw", "source": "postgres"},
)
def raw_orders() -> pd.DataFrame:
    """Extract all orders from the production DB."""
    df = pd.read_sql("SELECT * FROM orders WHERE created_at >= NOW() - INTERVAL '1 day'", con=conn)
    return df


@asset(
    group_name="staging",
    ins={"raw_orders": AssetIn()},            # explicit upstream dependency
    description="Orders with nulls removed and types cast",
    compute_kind="python",
)
def stg_orders(raw_orders: pd.DataFrame) -> Output[pd.DataFrame]:
    """Clean and cast raw orders."""
    df = (
        raw_orders
        .dropna(subset=["order_id", "customer_id", "amount"])
        .assign(
            amount=lambda x: x["amount"].astype(float),
            created_at=lambda x: pd.to_datetime(x["created_at"]),
        )
    )

    # Attach metadata visible in the Dagster UI
    return Output(
        value=df,
        metadata={
            "row_count": MetadataValue.int(len(df)),
            "columns": MetadataValue.text(", ".join(df.columns)),
            "null_rows_dropped": MetadataValue.int(len(raw_orders) - len(df)),
        },
    )


@asset(
    group_name="marts",
    ins={"stg_orders": AssetIn()},
    description="Daily revenue aggregated from cleaned orders",
    compute_kind="python",
)
def fct_daily_revenue(stg_orders: pd.DataFrame) -> pd.DataFrame:
    """Aggregate orders to daily revenue metrics."""
    return (
        stg_orders
        .groupby(stg_orders["created_at"].dt.date)
        .agg(
            order_count=("order_id", "count"),
            total_revenue=("amount", "sum"),
            avg_order_value=("amount", "mean"),
        )
        .reset_index()
        .rename(columns={"created_at": "date"})
    )
```

### Asset Lineage

Dagster automatically builds the asset dependency graph from `AssetIn()` declarations. The UI shows a full lineage graph — which assets depend on which, when each was last materialized, and what metadata was recorded.

```
raw_orders  ──▶  stg_orders  ──▶  fct_daily_revenue  ──▶  revenue_dashboard
                     │
                     └──▶  stg_returns  ──▶  fct_refund_rate
```

### Defining Jobs and Schedules

```python
from dagster import define_asset_job, ScheduleDefinition, Definitions

# Job: a subset of assets to materialize together
daily_pipeline_job = define_asset_job(
    name="daily_pipeline",
    selection=["raw_orders", "stg_orders", "fct_daily_revenue"],
    tags={"team": "data-engineering"},
)

# Schedule: run the job on a cron
daily_schedule = ScheduleDefinition(
    name="daily_6am",
    job=daily_pipeline_job,
    cron_schedule="0 6 * * *",
    execution_timezone="America/New_York",
)

# Definitions: the top-level registry of everything in the project
defs = Definitions(
    assets=[raw_orders, stg_orders, fct_daily_revenue],
    jobs=[daily_pipeline_job],
    schedules=[daily_schedule],
)
```

### Partitioning and Backfills

Partitioning is a first-class feature in Dagster — define assets with daily/monthly/custom partitions and backfills are orchestrated automatically.

```python
from dagster import asset, DailyPartitionsDefinition, AssetIn

daily_partitions = DailyPartitionsDefinition(start_date="2024-01-01")

@asset(
    partitions_def=daily_partitions,
    group_name="raw",
)
def raw_orders_partitioned(context) -> pd.DataFrame:
    # Dagster provides the partition key automatically
    partition_date = context.partition_key     # e.g., "2024-01-15"
    df = pd.read_sql(
        f"SELECT * FROM orders WHERE DATE(created_at) = '{partition_date}'",
        con=conn
    )
    context.log.info(f"Loaded {len(df)} rows for {partition_date}")
    return df

@asset(
    partitions_def=daily_partitions,
    ins={"raw_orders_partitioned": AssetIn()},
)
def stg_orders_partitioned(raw_orders_partitioned: pd.DataFrame) -> pd.DataFrame:
    return raw_orders_partitioned.dropna()
```

```bash
# Trigger a backfill via CLI
dagster asset backfill \
  --asset raw_orders_partitioned \
  --partition-range "2024-01-01,2024-06-30"
```

### Sensors — Event-Driven Triggering

```python
from dagster import sensor, RunRequest, SensorEvaluationContext, SkipReason
import boto3

@sensor(
    job=process_file_job,
    minimum_interval_seconds=30,
    description="Trigger pipeline when new files land in S3",
)
def s3_new_file_sensor(context: SensorEvaluationContext):
    s3 = boto3.client("s3")
    cursor = context.cursor or "0"  # last processed timestamp

    response = s3.list_objects_v2(
        Bucket="my-data-bucket",
        Prefix="incoming/orders/",
    )

    new_files = [
        obj for obj in response.get("Contents", [])
        if str(obj["LastModified"].timestamp()) > cursor
    ]

    if not new_files:
        yield SkipReason("No new files in S3")
        return

    for file in new_files:
        yield RunRequest(
            run_key=file["Key"],            # prevents re-processing same file
            run_config={"ops": {"process_file": {"config": {"s3_key": file["Key"]}}}},
            tags={"source_file": file["Key"]},
        )

    # Update cursor to latest file's timestamp
    context.update_cursor(str(max(f["LastModified"].timestamp() for f in new_files)))
```

### Resources — Typed I/O Managers

Resources are reusable, configurable I/O and infrastructure objects injected into assets at runtime. This makes assets trivially testable — swap the real DB resource for an in-memory mock.

```python
from dagster import resource, ConfigurableResource
from sqlalchemy import create_engine

class PostgresResource(ConfigurableResource):
    connection_string: str

    def get_connection(self):
        return create_engine(self.connection_string).connect()

    def execute(self, query: str) -> pd.DataFrame:
        with self.get_connection() as conn:
            return pd.read_sql(query, conn)


@asset
def raw_orders(postgres: PostgresResource) -> pd.DataFrame:
    return postgres.execute("SELECT * FROM orders")


# Production definitions
defs = Definitions(
    assets=[raw_orders],
    resources={
        "postgres": PostgresResource(
            connection_string=EnvVar("POSTGRES_CONNECTION_STRING")
        )
    },
)

# Test definitions — inject mock
class MockPostgres(PostgresResource):
    def execute(self, query: str) -> pd.DataFrame:
        return pd.DataFrame({"order_id": [1, 2], "amount": [100.0, 200.0]})

def test_raw_orders():
    result = raw_orders(postgres=MockPostgres(connection_string=""))
    assert len(result) == 2
```

### Dagster Cloud — Branch Deployments

```yaml
# dagster_cloud.yaml
organization: my-org
deployment: production

# Branch deployments: each PR gets its own isolated Dagster environment
# Great for testing pipeline changes without affecting production assets
```

---

## Part 3: Airflow vs Prefect vs Dagster Comparison

| Dimension | Airflow | Prefect | Dagster |
|---|---|---|---|
| **Mental model** | Task DAGs (imperative) | Python functions (functional) | Data assets (declarative) |
| **Primary abstraction** | Operator / Task | Flow / Task | Asset |
| **Learning curve** | High (operators, XCom, hooks) | Low (pure Python) | Medium (assets, resources, partitions) |
| **Python experience** | Good (but config-heavy) | Excellent (native Python) | Excellent (typed Python) |
| **Asset lineage** | Not native (add OpenLineage) | Not native | First-class, built-in |
| **Local development** | Complex (docker-compose) | Simple (`python flow.py`) | Simple (`dagster dev`) |
| **Testing** | Hard (DagBag, mock operators) | Easy (unit test any function) | Easy (inject mock resources) |
| **Ecosystem / operators** | Largest (10+ years of providers) | Growing (Prefect integrations) | Growing (dbt, Spark, etc.) |
| **Scheduling** | Cron, timetables | Cron, interval, event | Cron, event, asset conditions |
| **Managed option** | MWAA / Cloud Composer / Astronomer | Prefect Cloud | Dagster Cloud |
| **Event-driven** | Sensors (polling) | Automations + Webhooks | Sensors (native) |
| **Best for** | Large enterprises, Hadoop-era pipelines, massive provider ecosystem | Python-first modern teams, ML pipelines | Data platform teams prioritizing observability, SRE-style data ops |

### Decision Guide

```
Starting a new data platform from scratch?
  └─ Small team, Python-first → Prefect
  └─ Data quality and observability paramount → Dagster
  └─ Many existing operators / Spark / legacy systems → Airflow

Already using Airflow?
  └─ Mostly satisfied, need managed → Astronomer
  └─ Want better DX without migration → Prefect alongside Airflow
  └─ Building a new service from scratch → consider Dagster

ML / data science heavy?
  └─ Prefect — easiest to use from notebooks/scripts
  └─ Dagster — best for ML artifact tracking

dbt-heavy shop?
  └─ All three have dbt integrations
  └─ Dagster has the deepest dbt integration (assets from dbt models)
```

## Common Pitfalls

### Prefect
- **Forgetting `if __name__ == "__main__"`**: calling `flow()` at module top-level will execute the flow on import — wrap execution in main guard
- **Caching with mutable inputs**: `task_input_hash` uses the hash of task arguments — if you pass a DataFrame, it won't cache correctly (DataFrames aren't hashable). Use custom `cache_key_fn` or avoid caching for large data tasks
- **Work pool not started**: a flow run can sit in "Scheduled" indefinitely if no worker is polling the work pool — always verify a worker is running
- **Subflow concurrency**: subflows run in the same worker by default — concurrent subflows don't automatically parallelize unless you use `.submit()` with a `TaskRunner`

### Dagster
- **Assets vs Ops confusion**: assets are for persistent data artifacts; ops are for tasks without a persistent output. Don't use ops when you mean assets
- **Partition explosion**: creating daily partitions from 2020 to today means 1800+ partition keys — Dagster handles this fine but backfilling all takes time and careful orchestration
- **Resource configuration in tests**: forgetting to configure resources in test `Definitions` causes `DagsterInvariantViolationError` — always create test-specific resource configs

## Review Questions

1. What is the fundamental difference between Prefect's task/flow model and Dagster's asset model? Give a concrete example of when you would choose one over the other.
2. In Prefect, what does `cache_key_fn=task_input_hash` do? What are its limitations?
3. Explain Dagster's partitioning feature. How does it differ from Airflow's `execution_date`-based partitioning?
4. What is a Prefect Work Pool, and why is it necessary? What happens if a flow is scheduled but no worker is running?
5. How does Dagster's resource injection model make assets more testable compared to Airflow's operator-based approach?

#DataEngineering #Orchestration #Prefect #Dagster
