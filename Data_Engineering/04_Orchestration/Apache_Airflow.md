---
title: Apache Airflow
aliases: [Airflow, Airflow DAGs, Workflow Orchestration Airflow]
tags: [DataEngineering, Orchestration, Airflow, DAG, Pipelines]
domain: Data Engineering
difficulty: Intermediate
created: 2026-07-29
related: [dbt_Advanced, Pipeline_Design_Patterns, Prefect_and_Modern_Orchestration]
status: complete
---

# Apache Airflow

> [!abstract] TL;DR
> Apache Airflow is the industry-standard workflow orchestration platform where pipelines are defined as Directed Acyclic Graphs (DAGs) in Python. It schedules, monitors, and manages the execution of complex data pipelines across distributed infrastructure. Its rich operator ecosystem and UI make it the default choice in large enterprise data teams.

## Architecture Overview

Airflow follows a multi-component architecture. Each component has a distinct role, and their interaction determines how DAG runs are scheduled and executed.

```
┌──────────────┐     parses DAGs     ┌──────────────────┐
│   DAG Files  │ ─────────────────▶  │    Scheduler     │
│  (Python)    │                     │  (heart of AF)   │
└──────────────┘                     └────────┬─────────┘
                                              │ submits tasks
                                     ┌────────▼─────────┐
                                     │  Message Broker   │
                                     │ (Redis/RabbitMQ)  │
                                     │ (CeleryExecutor   │
                                     │  only)            │
                                     └────────┬─────────┘
                                              │ picks up tasks
                          ┌───────────────────┼──────────────────┐
                          │                   │                  │
                   ┌──────▼──────┐   ┌────────▼──────┐  ┌───────▼──────┐
                   │   Worker 1  │   │   Worker 2    │  │   Worker N   │
                   └─────────────┘   └───────────────┘  └──────────────┘
                          │
                   ┌──────▼──────────────────────────────────────────────┐
                   │              Metadata Database                       │
                   │        (PostgreSQL / MySQL)                          │
                   │  DAG state, task instances, XCom, connections,       │
                   │  variables, SLA misses                               │
                   └──────────────────────────────────────────────────────┘
                          │
                   ┌──────▼──────┐
                   │  Web Server  │
                   │ (Flask/UI)   │
                   └─────────────┘
```

### Component Breakdown

| Component | Role | Notes |
|---|---|---|
| **Scheduler** | Parses DAG files, creates DagRuns, schedules TaskInstances into the queue | Multi-scheduler supported (2.x), HA deployment |
| **Worker** | Executes tasks assigned by the queue | LocalExecutor (single node), CeleryExecutor (distributed) |
| **Metadata DB** | Stores all state: DAG definitions, runs, task instances, XCom, connections | PostgreSQL recommended for production |
| **Web Server** | Flask app — UI for monitoring, triggering, viewing logs | Does NOT execute tasks |
| **Message Broker** | Queue between Scheduler and Workers | Only needed for CeleryExecutor (Redis or RabbitMQ) |
| **Triggerer** | Async task triggering for deferrable operators (Airflow 2.2+) | Enables efficient sensor polling without blocking a worker slot |

### Executor Types

- **SequentialExecutor**: one task at a time, SQLite — development only
- **LocalExecutor**: parallel tasks via subprocess on a single machine — small-scale production
- **CeleryExecutor**: distributed workers via message broker — large-scale production
- **KubernetesExecutor**: each task spun up as a K8s pod — elastic, best isolation
- **CeleryKubernetesExecutor**: hybrid — route some tasks to Celery, others to K8s

## DAG Definition

A DAG (Directed Acyclic Graph) is a Python file that defines the workflow. Airflow scans the `dags/` folder and imports every Python file.

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,           # don't wait for yesterday's run
    'email_on_failure': True,
    'email_on_retry': False,
    'email': ['data-team@company.com'],
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
    'execution_timeout': timedelta(hours=2),
}

with DAG(
    dag_id='my_pipeline',
    default_args=default_args,
    description='Daily data pipeline',
    schedule_interval='0 6 * * *',  # 6am daily — cron syntax
    start_date=datetime(2024, 1, 1),
    catchup=False,              # don't backfill missed runs on startup
    tags=['production', 'finance'],
    max_active_runs=1,          # prevent concurrent DAG runs
    max_active_tasks=10,        # max concurrent tasks across this DAG
) as dag:

    extract = PythonOperator(
        task_id='extract_data',
        python_callable=extract_fn,
        op_kwargs={'table': 'orders'},  # pass arguments to the callable
    )

    transform = PythonOperator(
        task_id='transform_data',
        python_callable=transform_fn,
    )

    load = BashOperator(
        task_id='load_to_warehouse',
        bash_command='python /scripts/load.py --date {{ ds }}',  # Jinja template
    )

    # Define dependencies — left to right
    extract >> transform >> load
```

### Schedule Interval Options

```python
schedule_interval='@daily'          # midnight every day
schedule_interval='@hourly'         # top of every hour
schedule_interval='0 6 * * 1-5'    # 6am weekdays
schedule_interval=timedelta(hours=6) # every 6 hours
schedule_interval=None              # manual trigger only
```

> [!important] `execution_date` vs `logical_date`
> In Airflow, a DAG run with `schedule_interval='@daily'` and `start_date=2024-01-01` will have its first run at `2024-01-02 00:00:00` with `execution_date=2024-01-01`. The execution date represents the **start of the data interval**, not when the job runs. This confuses newcomers constantly. In Airflow 2.2+, it's called `logical_date`.

## Common Operators

### Built-in Operators

```python
from airflow.operators.python import PythonOperator, BranchPythonOperator
from airflow.operators.bash import BashOperator
from airflow.operators.empty import EmptyOperator  # formerly DummyOperator
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
from airflow.sensors.filesystem import FileSensor
from airflow.sensors.http import HttpSensor
from airflow.sensors.time_delta import TimeDeltaSensor

# BranchPythonOperator: return task_id to execute next
def decide_branch(**context):
    if context['execution_date'].month == 1:
        return 'monthly_report'
    return 'skip_monthly'

branch = BranchPythonOperator(
    task_id='branch_logic',
    python_callable=decide_branch,
    provide_context=True,
)

# FileSensor: wait for a file to appear
wait_for_file = FileSensor(
    task_id='wait_for_data_file',
    filepath='/data/input/{{ ds }}/orders.csv',
    poke_interval=60,       # check every 60 seconds
    timeout=3600,           # fail after 1 hour
    mode='reschedule',      # release worker slot while waiting (preferred)
)
```

### Provider Operators (installed via pip)

```bash
pip install apache-airflow-providers-google        # BigQuery, GCS, Dataflow
pip install apache-airflow-providers-amazon        # S3, Redshift, Glue, EMR
pip install apache-airflow-providers-apache-spark  # SparkSubmitOperator
pip install apache-airflow-providers-snowflake     # Snowflake
pip install apache-airflow-providers-dbt-cloud     # dbt Cloud
```

```python
from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator
from airflow.providers.amazon.aws.transfers.s3_to_redshift import S3ToRedshiftOperator
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator
from airflow.providers.snowflake.operators.snowflake import SnowflakeOperator

# Spark Submit
spark_job = SparkSubmitOperator(
    task_id='run_spark_etl',
    application='/jobs/etl_job.py',
    conn_id='spark_default',
    executor_cores=4,
    executor_memory='8g',
    num_executors=10,
    conf={'spark.sql.shuffle.partitions': '200'},
)

# BigQuery
bq_query = BigQueryInsertJobOperator(
    task_id='run_bq_transform',
    configuration={
        'query': {
            'query': '{% include "sql/transform.sql" %}',
            'useLegacySql': False,
        }
    },
    gcp_conn_id='google_cloud_default',
)
```

## TaskFlow API (Airflow 2.0+)

The TaskFlow API replaces boilerplate `PythonOperator` definitions with clean Python decorators. XCom passing is handled automatically.

```python
from airflow.decorators import dag, task
from datetime import datetime
import pandas as pd

@dag(
    schedule_interval='@daily',
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['production'],
)
def sales_pipeline():

    @task(retries=3, retry_delay_seconds=300)
    def extract(execution_date=None) -> dict:
        """Pull raw sales data for the execution date."""
        records = db.query(
            "SELECT * FROM sales WHERE date = %s",
            execution_date.date()
        )
        # Return data — automatically pushed to XCom
        return {"rows": records, "count": len(records)}

    @task
    def validate(data: dict) -> dict:
        """Assert row counts are within expected range."""
        assert data["count"] > 0, "No records extracted!"
        assert data["count"] < 10_000_000, "Suspiciously large extract"
        return data

    @task
    def transform(data: dict) -> pd.DataFrame:
        df = pd.DataFrame(data["rows"])
        df["amount_usd"] = df["amount"] * df["fx_rate"]
        return df

    @task
    def load(df: pd.DataFrame, target_table: str = "sales_fact"):
        df.to_sql(target_table, con=warehouse_conn, if_exists='append', index=False)

    # Wire up the pipeline — dependencies inferred from data flow
    raw = extract()
    valid = validate(raw)
    processed = transform(valid)
    load(processed)

dag = sales_pipeline()
```

### TaskGroup for Visual Organization

```python
from airflow.utils.task_group import TaskGroup

with DAG('grouped_pipeline', ...) as dag:

    with TaskGroup('extract_group', tooltip='Data extraction tasks') as extract_group:
        extract_orders = PythonOperator(task_id='extract_orders', ...)
        extract_customers = PythonOperator(task_id='extract_customers', ...)
        extract_products = PythonOperator(task_id='extract_products', ...)

    with TaskGroup('load_group') as load_group:
        load_to_staging = PythonOperator(task_id='load_staging', ...)
        load_to_warehouse = PythonOperator(task_id='load_warehouse', ...)

    extract_group >> load_group
```

## XCom (Cross-Communication)

XCom lets tasks pass small values to downstream tasks. All XCom data is stored in the metadata database.

```python
# Method 1: explicit push/pull
def push_data(**context):
    context['task_instance'].xcom_push(key='row_count', value=42_000)

def pull_data(**context):
    count = context['task_instance'].xcom_pull(
        task_ids='extract_data',
        key='row_count'
    )
    print(f"Processing {count} rows")

# Method 2: PythonOperator return value is automatically pushed as 'return_value'
def extract():
    return {"count": 42_000}  # pushed automatically

def transform(**context):
    data = context['ti'].xcom_pull(task_ids='extract', key='return_value')
```

> [!warning] XCom Size Limit
> XCom is stored in the metadata DB. Keep values small (< 48KB). For large data (DataFrames, files), store in S3/GCS and pass the path via XCom. Never push a full DataFrame through XCom.

## Connections and Variables

### Connections — Store Credentials

```python
from airflow.hooks.base import BaseHook

# Access a connection by conn_id (configured in Airflow UI or env var)
conn = BaseHook.get_connection('my_postgres')
print(conn.host, conn.port, conn.schema, conn.login)

# Environment variable format: AIRFLOW_CONN_<CONN_ID_UPPERCASE>
# AIRFLOW_CONN_MY_POSTGRES=postgresql://user:pass@host:5432/db
```

### Variables — Store Config

```python
from airflow.models import Variable

# Simple get
env = Variable.get("ENVIRONMENT")                          # returns string

# With default
batch_size = Variable.get("BATCH_SIZE", default_var="1000")

# JSON deserialization
config = Variable.get("PIPELINE_CONFIG", deserialize_json=True)
# config is now a Python dict

# Mask sensitive values in UI: prefix with SECRET_ or configure as Hidden
db_password = Variable.get("SECRET_DB_PASSWORD")
```

> [!tip] Secrets Backend
> For production, use a secrets backend instead of storing credentials in Airflow Variables. Supported backends:
> - **AWS Secrets Manager**: set `backend = airflow.providers.amazon.aws.secrets.secrets_manager.SecretsManagerBackend`
> - **HashiCorp Vault**: `airflow.providers.hashicorp.secrets.vault.VaultBackend`
> - **Google Secret Manager**: `airflow.providers.google.cloud.secrets.secret_manager.CloudSecretManagerBackend`

## Dynamic DAG Generation

Generate multiple DAGs programmatically from a config file or database table.

```python
# dags/dynamic_dags.py
import yaml
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

with open("/opt/airflow/dags/config/pipelines.yml") as f:
    config = yaml.safe_load(f)

def make_dag(pipeline_config: dict) -> DAG:
    with DAG(
        dag_id=f"pipeline_{pipeline_config['name']}",
        schedule_interval=pipeline_config.get('schedule', '@daily'),
        start_date=datetime(2024, 1, 1),
        catchup=False,
        tags=pipeline_config.get('tags', []),
    ) as dag:
        extract = PythonOperator(
            task_id='extract',
            python_callable=run_extract,
            op_kwargs={'source': pipeline_config['source']},
        )
        load = PythonOperator(
            task_id='load',
            python_callable=run_load,
            op_kwargs={'target': pipeline_config['target']},
        )
        extract >> load
    return dag

# Register each DAG in global scope — Airflow scans globals()
for pipeline in config['pipelines']:
    dag_id = f"pipeline_{pipeline['name']}"
    globals()[dag_id] = make_dag(pipeline)
```

```yaml
# config/pipelines.yml
pipelines:
  - name: orders
    source: postgres://prod/orders
    target: snowflake://warehouse/orders
    schedule: "0 2 * * *"
    tags: [production, finance]
  - name: events
    source: s3://events-bucket/
    target: snowflake://warehouse/events
    schedule: "*/30 * * * *"
    tags: [production, analytics]
```

## Airflow 2.x Improvements over 1.x

| Feature | Airflow 1.x | Airflow 2.x |
|---|---|---|
| DAG authoring | PythonOperator only | TaskFlow API with `@task` decorators |
| Scheduler | Single instance | Multiple schedulers (HA) |
| Performance | Slow scheduler loop | Significantly faster scheduling |
| Task grouping | No grouping | TaskGroup for visual organization |
| Deferrable tasks | Not supported | Triggerer + deferrable operators (2.2+) |
| DAG versioning | None | DAG version tracking (2.8+) |
| UI | Dated Flask UI | Modernized React UI |
| API | Limited | Full REST API |

## Managed Airflow Options

### AWS MWAA (Managed Workflows for Apache Airflow)

- Fully managed, integrated with IAM, S3 for DAG storage, VPC support
- Limited Airflow version support, can lag behind upstream releases
- Good choice if already deep in AWS ecosystem

### Google Cloud Composer

- Managed Airflow on GKE, tight integration with BigQuery/GCS/Dataproc
- Can be expensive; each environment is a full GKE cluster

### Astronomer

- Most feature-complete managed Airflow (Astro Cloud or self-hosted)
- Astro CLI: `astro dev start` for local development with Docker
- Adds: deployment management, CI/CD integration, Astro Runtime (enhanced Airflow image), lineage via OpenLineage

```bash
# Astro CLI workflow
brew install astro
astro dev init                 # create project scaffold
astro dev start                # spin up local Airflow (Docker)
astro dev run dags test my_dag # test a DAG locally
astro deploy                   # deploy to Astro Cloud
```

## Testing DAGs

### DAG Integrity Tests

```python
# tests/test_dag_integrity.py
import pytest
from airflow.models import DagBag

@pytest.fixture()
def dagbag():
    return DagBag(dag_folder="dags/", include_examples=False)

def test_no_import_errors(dagbag):
    """Fail if any DAG has import errors."""
    assert not dagbag.import_errors, (
        f"DAG import failures: {dagbag.import_errors}"
    )

def test_dag_count(dagbag):
    """Ensure expected number of DAGs were loaded."""
    assert len(dagbag.dags) >= 5

def test_my_pipeline_structure(dagbag):
    dag = dagbag.get_dag('my_pipeline')
    assert dag is not None
    task_ids = [t.task_id for t in dag.tasks]
    assert 'extract_data' in task_ids
    assert 'transform_data' in task_ids
    assert 'load_to_warehouse' in task_ids
    # Check dependency
    extract_task = dag.get_task('extract_data')
    assert 'transform_data' in [t.task_id for t in extract_task.downstream_list]
```

### Local DAG Testing

```bash
# Test a DAG run locally (Airflow 2.x)
airflow dags test my_pipeline 2024-01-15

# Test a single task
airflow tasks test my_pipeline extract_data 2024-01-15

# With TaskFlow API
python dags/my_pipeline.py  # runs dag.test() if __main__
```

```python
# Inline test support
if __name__ == "__main__":
    dag.test()
```

## Production Best Practices

```python
# 1. Always set max_active_runs to prevent DAG pile-up
max_active_runs=1

# 2. Use catchup=False unless you specifically need backfill
catchup=False

# 3. Set execution_timeout to prevent hung tasks
execution_timeout=timedelta(hours=4)

# 4. Use mode='reschedule' for sensors — frees worker slot
wait = FileSensor(
    task_id='wait',
    filepath='...',
    mode='reschedule',          # vs 'poke' which blocks a worker
    poke_interval=300,
    timeout=86400,
)

# 5. Avoid top-level code in DAG files — runs on every scheduler parse
# BAD:
connection = create_db_connection()   # runs on every parse!
# GOOD: create connections inside task callables

# 6. Use templates for date-parameterized queries
bash_command='psql -c "SELECT * FROM orders WHERE dt = \'{{ ds }}\'"'
```

### Airflow Jinja Template Variables

| Variable | Description |
|---|---|
| `{{ ds }}` | execution date as `YYYY-MM-DD` |
| `{{ ds_nodash }}` | execution date as `YYYYMMDD` |
| `{{ ts }}` | execution date as ISO 8601 timestamp |
| `{{ prev_ds }}` | previous execution date |
| `{{ next_ds }}` | next execution date |
| `{{ run_id }}` | unique run identifier |
| `{{ dag.dag_id }}` | current DAG ID |
| `{{ task.task_id }}` | current task ID |

## Common Pitfalls

- **DAG file import errors silently fail**: Airflow will not alert you if a DAG fails to import — check the "Import Errors" page in the UI regularly or add import error tests
- **catchup=True by default**: On first deploy, Airflow will try to backfill from `start_date` — always set `catchup=False` unless you want this
- **XCom with large data crashes the metadata DB**: Never push DataFrames or large objects through XCom — use S3/GCS paths
- **Top-level DB calls in DAG files**: Any code at module level runs every scheduler heartbeat (every 30s by default) — keep DAG files lightweight
- **Timezone confusion with `execution_date`**: Airflow stores dates in UTC; the execution date is the start of the interval, not the run time — always document which timezone your `start_date` uses
- **`depends_on_past=True` can deadlock**: If set on all tasks and a run fails, future runs queue forever — use sparingly
- **Using `mode='poke'` for long-wait sensors**: Poke sensors hold a worker slot for their entire wait time — always use `mode='reschedule'` for waits > 5 minutes
- **Not setting `max_active_runs`**: Slow pipelines can stack up if they take longer than the schedule interval — set `max_active_runs=1` for sequential guarantees

## Review Questions

1. What is the difference between `LocalExecutor` and `CeleryExecutor`, and when would you choose each?
2. Why should you use `mode='reschedule'` instead of `mode='poke'` for sensors in a production environment?
3. Explain the relationship between `start_date`, `schedule_interval`, and `execution_date`. When does the first DAG run actually execute?
4. What are the risks of using XCom to pass large DataFrames between tasks, and what is the correct pattern?
5. How does the TaskFlow API improve on the traditional `PythonOperator` approach, and what are its limitations?

#DataEngineering #Orchestration #Airflow
