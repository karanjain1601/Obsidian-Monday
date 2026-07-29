---
title: dbt for Data Engineers
aliases: [dbt Advanced, dbt Engineering, dbt Incremental, dbt Snapshots]
tags: [DataEngineering, dbt, Transformation, Analytics, DataModeling]
domain: Data Engineering
difficulty: Advanced
created: 2026-07-29
related: [Apache_Airflow, Pipeline_Design_Patterns, Prefect_and_Modern_Orchestration]
status: complete
---

# dbt for Data Engineers

> [!abstract] TL;DR
> dbt (data build tool) is the standard SQL-first transformation layer in the modern data stack. It compiles Jinja-templated SQL into warehouse-native DDL/DML and manages the entire transformation lifecycle — incremental loads, snapshots, testing, documentation, and CI/CD. This note covers the advanced engineering patterns beyond basic model authoring.

> [!note] Prerequisites
> This note assumes familiarity with dbt fundamentals: models, `ref()` and `source()`, basic schema tests, and materializations. For those topics, see [[dbt_Analytics_Engineering]] in the Data Analytics vault. This note focuses on production-grade engineering patterns.

## Incremental Models Deep Dive

Incremental models are the core of efficient ELT pipelines. They process only new or changed rows rather than reprocessing the entire table.

### Full Syntax and Strategy Options

```sql
-- models/facts/fct_events.sql
{{
  config(
    materialized='incremental',
    unique_key='event_id',
    incremental_strategy='merge',       -- strategy depends on warehouse
    on_schema_change='sync_all_columns',
    cluster_by=['user_id'],             -- BigQuery / Snowflake clustering
    partition_by={                      -- BigQuery partitioning
      'field': 'created_at',
      'data_type': 'timestamp',
      'granularity': 'day'
    }
  )
}}

WITH source AS (
    SELECT
        event_id,
        user_id,
        session_id,
        event_type,
        properties,
        created_at
    FROM {{ source('app', 'events') }}
),

renamed AS (
    SELECT
        event_id,
        user_id,
        session_id,
        event_type,
        JSON_EXTRACT_SCALAR(properties, '$.page') AS page,
        created_at
    FROM source
)

SELECT * FROM renamed

{% if is_incremental() %}
  -- Only process rows newer than the latest record in this table
  -- The buffer (1 hour) handles late-arriving events
  WHERE created_at > (
      SELECT DATEADD(hour, -1, MAX(created_at))
      FROM {{ this }}
  )
{% endif %}
```

### Incremental Strategies by Warehouse

| Strategy | Warehouse Support | Behavior |
|---|---|---|
| `append` | All | INSERT new rows only — no deduplication |
| `merge` | Snowflake, BigQuery, Spark, Databricks | UPSERT — update existing + insert new by `unique_key` |
| `delete+insert` | Snowflake, BigQuery, Spark | Delete matching rows, then re-insert |
| `insert_overwrite` | BigQuery, Spark | Replace entire partition(s) |
| `microbatch` | dbt 1.9+ | Process data in micro-batches by time window |

```sql
-- insert_overwrite: best for BigQuery partitioned tables
{{
  config(
    materialized='incremental',
    incremental_strategy='insert_overwrite',
    partition_by={'field': 'date', 'data_type': 'date'}
  )
}}

SELECT
    DATE(created_at) AS date,
    COUNT(*) AS event_count
FROM {{ source('app', 'events') }}

{% if is_incremental() %}
  WHERE DATE(created_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)
{% endif %}

GROUP BY 1
```

### `on_schema_change` Options

```yaml
# What to do when the SELECT columns change vs. what's in the target table
on_schema_change: 'fail'              # default: raise an error (safe)
on_schema_change: 'ignore'            # silently skip new/removed columns
on_schema_change: 'append_new_columns' # add new columns, keep old ones
on_schema_change: 'sync_all_columns'  # add new + drop removed columns
```

### Full Refresh vs Incremental

```bash
# Run incrementally (process only new data)
dbt run --select fct_events

# Rebuild from scratch (ignores is_incremental() filter)
dbt run --select fct_events --full-refresh

# Full refresh all models in a path
dbt run --select path:models/facts/ --full-refresh
```

> [!warning] Late-Arriving Data
> A common bug: using `WHERE created_at > MAX(created_at)` misses records that arrive out of order. Always add a buffer:
> ```sql
> WHERE created_at > (SELECT MAX(created_at) FROM {{ this }}) - INTERVAL '2 hours'
> ```
> Or re-process the last N days:
> ```sql
> WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '3 days'
> ```

## Snapshots (Slowly Changing Dimensions, Type 2)

dbt snapshots implement SCD Type 2: they track the full history of changes to a row, adding validity timestamps.

```sql
-- snapshots/snap_customers.sql
{% snapshot snap_customers %}
{{
  config(
    target_schema='snapshots',
    target_database='analytics',
    unique_key='customer_id',
    strategy='timestamp',           -- track changes via updated_at column
    updated_at='updated_at',
    invalidate_hard_deletes=True    -- mark deleted rows as expired
  )
}}

SELECT
    customer_id,
    email,
    plan_type,
    mrr,
    updated_at
FROM {{ source('app', 'customers') }}

{% endsnapshot %}
```

### Snapshot Columns Added by dbt

After `dbt snapshot`, the table gains:

| Column | Description |
|---|---|
| `dbt_scd_id` | Hash of `unique_key` + `dbt_updated_at` — row identifier |
| `dbt_updated_at` | Timestamp when dbt last processed this row |
| `dbt_valid_from` | When this version of the row became valid |
| `dbt_valid_to` | When this version expired (NULL = current) |
| `dbt_is_current` | Boolean shortcut — TRUE for the current version (some setups) |

### Check Strategy (No `updated_at` Column)

```sql
{% snapshot snap_product_prices %}
{{
  config(
    target_schema='snapshots',
    unique_key='product_id',
    strategy='check',               -- compare column values directly
    check_cols=['price', 'discount_rate', 'is_active'],  -- or 'all'
    invalidate_hard_deletes=True
  )
}}

SELECT product_id, price, discount_rate, is_active
FROM {{ source('app', 'products') }}

{% endsnapshot %}
```

### Querying Snapshot History

```sql
-- Current state
SELECT * FROM analytics.snapshots.snap_customers
WHERE dbt_valid_to IS NULL;

-- State at a point in time
SELECT * FROM analytics.snapshots.snap_customers
WHERE dbt_valid_from <= '2024-06-01'
  AND (dbt_valid_to > '2024-06-01' OR dbt_valid_to IS NULL);

-- Full change history for a customer
SELECT *
FROM analytics.snapshots.snap_customers
WHERE customer_id = 12345
ORDER BY dbt_valid_from;
```

## dbt Selectors and Node Selection

The `--select` flag is the most powerful dbt CLI feature for running subsets of the DAG.

```bash
# === Basic selection ===
dbt run --select my_model                     # exact model name
dbt run --select my_schema.my_model           # schema-qualified

# === Graph operators ===
dbt run --select +my_model                    # my_model + all ancestors (upstream)
dbt run --select my_model+                    # my_model + all descendants (downstream)
dbt run --select +my_model+                   # full lineage (ancestors + descendants)
dbt run --select my_model+2                   # model + 2 levels downstream

# === Exclusion ===
dbt run --select models/marts/ --exclude my_model

# === Tags ===
dbt run --select tag:daily                    # all models tagged 'daily'
dbt run --select tag:finance,tag:daily        # intersection

# === Path-based ===
dbt run --select path:models/marts/           # all models in directory
dbt run --select models/marts/fct_*           # glob pattern

# === Config-based ===
dbt run --select config.materialized:incremental  # all incremental models

# === State-based (for CI/CD) ===
dbt run --select state:modified               # only changed models
dbt run --select state:modified+              # changed models + their dependents

# === Combined commands ===
dbt build --select +my_model                  # run + test + snapshot + seed, upstream-first
dbt test --select my_model --store-failures   # store failed rows in DB as a table
```

## Hooks — Run SQL Before/After Models

```yaml
# dbt_project.yml
models:
  my_project:
    +pre-hook:
      - "{{ logging.log_model_start(this) }}"  # custom macro

    marts:
      finance:
        +post-hook:
          - "GRANT SELECT ON {{ this }} TO ROLE REPORTER"
          - "COMMENT ON TABLE {{ this }} IS 'Updated: {{ run_started_at }}'"
          - "ANALYZE {{ this }}"                # Redshift/Postgres stats

    staging:
      +materialized: view
      +post-hook: []                            # override: no hooks in staging
```

```yaml
# Operation hooks (run once per dbt run, not per model)
# dbt_project.yml
on-run-start:
  - "CREATE TABLE IF NOT EXISTS audit_log (run_id TEXT, started_at TIMESTAMP)"
  - "INSERT INTO audit_log VALUES ('{{ invocation_id }}', CURRENT_TIMESTAMP)"

on-run-end:
  - "UPDATE audit_log SET finished_at = CURRENT_TIMESTAMP WHERE run_id = '{{ invocation_id }}'"
```

## dbt Packages

Packages extend dbt with reusable macros, generic tests, and pre-built models.

```yaml
# packages.yml — run 'dbt deps' to install
packages:
  - package: dbt-labs/dbt_utils
    version: 1.1.1
  - package: dbt-labs/audit_helper      # compare query results between envs
    version: 0.9.0
  - package: calogica/dbt_date          # date spine, fiscal calendars
    version: 0.10.1
  - package: calogica/dbt_expectations  # Great Expectations-style tests
    version: 0.10.1
  - package: dbt-labs/dbt_project_evaluator  # lint your dbt project
    version: 0.8.0
  - git: "https://github.com/your-org/internal-dbt-package.git"
    revision: v1.2.0
```

```sql
-- Using dbt_utils macros in models
SELECT
    {{ dbt_utils.generate_surrogate_key(['order_id', 'product_id']) }} AS sk,
    {{ dbt_utils.safe_divide('revenue', 'order_count') }} AS avg_order_value,
    {{ dbt_utils.datediff('day', 'created_at', 'closed_at') }} AS days_to_close
FROM orders

-- Using dbt_expectations for advanced tests
-- schema.yml
tests:
  - dbt_expectations.expect_column_values_to_be_between:
      column_name: amount
      min_value: 0
      max_value: 1000000
  - dbt_expectations.expect_table_row_count_to_be_between:
      min_value: 1000
      max_value: 10000000
```

## Macros with Jinja2

Macros are reusable SQL snippets with logic, parameterized via Jinja2.

```sql
-- macros/safe_divide.sql
{% macro safe_divide(numerator, denominator) %}
  CASE
    WHEN {{ denominator }} = 0 OR {{ denominator }} IS NULL THEN NULL
    ELSE CAST({{ numerator }} AS FLOAT) / {{ denominator }}
  END
{% endmacro %}

-- Usage in models:
SELECT {{ safe_divide('revenue', 'session_count') }} AS revenue_per_session
```

```sql
-- macros/generate_date_series.sql — cross-database date spine
{% macro date_spine(start_date, end_date, datepart='day') %}
  {{ dbt_utils.date_spine(
      datepart=datepart,
      start_date="CAST('" ~ start_date ~ "' AS DATE)",
      end_date="CAST('" ~ end_date ~ "' AS DATE)"
  ) }}
{% endmacro %}

-- macros/pivot.sql — dynamic pivot from a list of values
{% macro pivot(column, values, agg='SUM', then_value=1, else_value=0) %}
  {% for val in values %}
    {{ agg }}(CASE WHEN {{ column }} = '{{ val }}' THEN {{ then_value }} ELSE {{ else_value }} END) AS {{ val | replace(' ', '_') | lower }}
    {% if not loop.last %},{% endif %}
  {% endfor %}
{% endmacro %}
```

### `generate_schema_name` Override

The default behavior concatenates the target schema with the custom schema, which can produce schemas like `dev_karan_finance`. Override this to control naming per environment.

```sql
-- macros/generate_schema_name.sql
{% macro generate_schema_name(custom_schema_name, node) -%}
  {%- set default_schema = target.schema -%}

  {%- if target.name == 'prod' -%}
    -- In production: use the custom_schema_name directly (no prefix)
    {%- if custom_schema_name is none -%}
      {{ default_schema }}
    {%- else -%}
      {{ custom_schema_name | trim }}
    {%- endif -%}

  {%- else -%}
    -- In dev/staging: prefix with developer schema to isolate
    {%- if custom_schema_name is none -%}
      {{ default_schema }}
    {%- else -%}
      {{ default_schema }}_{{ custom_schema_name | trim }}
    {%- endif -%}

  {%- endif -%}
{%- endmacro %}
```

## CI/CD for dbt

### Slim CI with State Comparison

The key technique: compare the current branch's `manifest.json` against the production manifest to run **only changed models and their descendants**.

```bash
# Step 1: Download the production manifest (artifact from last prod run)
# In dbt Cloud: use the job artifact API
# In dbt Core: store manifest.json in S3/GCS after each prod run

# Step 2: Run only modified models + their downstream dependents
dbt run \
  --select state:modified+ \
  --defer \                          # use prod relations for unmodified upstream models
  --state ./prod-artifacts/          # directory containing production manifest.json

# Step 3: Test only modified models
dbt test \
  --select state:modified+ \
  --defer \
  --state ./prod-artifacts/
```

### GitHub Actions Workflow

```yaml
# .github/workflows/dbt_ci.yml
name: dbt CI

on:
  pull_request:
    branches: [main]
    paths:
      - 'models/**'
      - 'tests/**'
      - 'macros/**'
      - 'snapshots/**'
      - 'packages.yml'
      - 'dbt_project.yml'

jobs:
  dbt-ci:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dbt
        run: pip install dbt-snowflake==1.7.0

      - name: Install packages
        run: dbt deps

      - name: Download production artifacts
        run: |
          aws s3 cp s3://my-dbt-artifacts/prod/manifest.json ./prod-artifacts/manifest.json
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Run modified models (Slim CI)
        run: |
          dbt run \
            --select state:modified+ \
            --defer \
            --state ./prod-artifacts/ \
            --target ci
        env:
          DBT_PROFILES_DIR: ./
          SNOWFLAKE_ACCOUNT: ${{ secrets.SNOWFLAKE_ACCOUNT }}
          SNOWFLAKE_USER: ${{ secrets.SNOWFLAKE_USER }}
          SNOWFLAKE_PASSWORD: ${{ secrets.SNOWFLAKE_PASSWORD }}

      - name: Test modified models
        run: |
          dbt test \
            --select state:modified+ \
            --defer \
            --state ./prod-artifacts/ \
            --target ci \
            --store-failures

      - name: Generate docs
        run: dbt docs generate --target ci

      - name: Upload CI artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dbt-artifacts
          path: target/
```

## Advanced Testing Patterns

```yaml
# models/schema.yml — comprehensive test suite
version: 2

models:
  - name: fct_orders
    description: "One row per order, fact table"
    columns:
      - name: order_id
        description: "Primary key"
        tests:
          - not_null
          - unique

      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('dim_customers')
              field: customer_id

      - name: status
        tests:
          - accepted_values:
              values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

      - name: amount
        tests:
          - not_null
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 500000
              strictly: false

    tests:
      # Table-level tests
      - dbt_utils.equal_rowcount:
          compare_model: ref('stg_orders')
      - dbt_utils.recency:
          datepart: hour
          field: created_at
          interval: 25        # fail if no data in last 25 hours
```

```python
# Custom singular test: tests/assert_orders_sum_equals_payments.sql
-- Singular test: a SELECT that returns rows = test failure
SELECT
    o.order_id,
    o.amount AS order_amount,
    SUM(p.amount) AS payment_amount
FROM {{ ref('fct_orders') }} o
JOIN {{ ref('fct_payments') }} p ON o.order_id = p.order_id
GROUP BY 1, 2
HAVING ABS(o.amount - SUM(p.amount)) > 0.01   -- floating point tolerance
```

## dbt Cloud vs dbt Core

| Feature | dbt Core (OSS) | dbt Cloud |
|---|---|---|
| Model execution | CLI only | CLI + IDE + Job scheduler |
| Scheduling | External (Airflow/Prefect) | Built-in job scheduler |
| IDE | VS Code / any editor | Browser-based IDE |
| CI/CD | DIY (GitHub Actions) | Native PR checks, slim CI built-in |
| Docs hosting | Self-host | Hosted docs site |
| Semantic layer | Not available | dbt Semantic Layer (MetricFlow) |
| Lineage UI | `dbt docs generate` only | Rich lineage explorer |
| Pricing | Free | Free tier + paid per seat |
| Best for | Teams with Airflow, full control | Teams wanting integrated experience |

## Common Pitfalls

- **Incremental models without `unique_key` use `append` strategy**: without `unique_key`, every incremental run appends rows — re-running will duplicate data. Always specify `unique_key` when you need idempotent incremental loads.
- **`is_incremental()` is only true during incremental runs**: writing `{% if is_incremental() %}` on a fresh table or after `--full-refresh` resolves to false — ensure your base query is complete without the filter
- **Snapshot `updated_at` column must be reliable**: if the source system doesn't reliably update `updated_at` on every change, use `strategy='check'` instead — snapshot will miss changes otherwise
- **Circular references are impossible**: dbt models form a DAG — you cannot have model A reference model B which references model A. Restructure using staging/intermediate layers
- **dbt tests don't block pipelines by default**: `dbt test` failure does not roll back the `dbt run`. Use `dbt build` to run models + tests atomically, stopping if a test fails
- **`ref()` vs `source()`**: use `source()` only for raw tables in the source schema; use `ref()` for all dbt-managed models. Mixing them incorrectly breaks lineage
- **Schema tests on incremental models run on full table**: `dbt test --select my_model` tests the entire table, not just the incremental batch — this is correct behavior but can be slow

## Review Questions

1. What is the difference between `incremental_strategy='merge'` and `incremental_strategy='insert_overwrite'`? When would you choose one over the other on BigQuery?
2. Explain the `is_incremental()` macro. When does it evaluate to `true` vs `false`? What happens if you run `dbt run --full-refresh`?
3. How does dbt snapshot SCD Type 2 differ from a regular incremental model? What columns does dbt add, and how would you query a point-in-time state?
4. Describe the Slim CI pattern. What is `manifest.json` used for, and why does `--defer` matter?
5. Why is `generate_schema_name` important for multi-developer or multi-environment dbt projects?

#DataEngineering #dbt #Transformation
