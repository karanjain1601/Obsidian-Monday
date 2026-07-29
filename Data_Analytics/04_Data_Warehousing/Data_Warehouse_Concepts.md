---
title: Data Warehouse Concepts
aliases:
  - Data Warehouse
  - Dimensional Modeling
  - Star Schema
  - Kimball
  - OLAP vs OLTP
tags: [DataAnalytics, DataWarehouse, DimensionalModeling, StarSchema, OLAP]
domain: Data Analytics
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Data_Analytics_Overview]]"
  - "[[Snowflake_and_BigQuery]]"
  - "[[Data_Pipeline_ETL_ELT]]"
  - "[[dbt_Analytics_Engineering]]"
  - "[[Power_BI_Fundamentals]]"
  - "[[Analytics_Metrics_and_KPIs]]"
status: complete
---

# Data Warehouse Concepts

> [!abstract] TL;DR
> A data warehouse is an OLAP-optimized repository for analytical queries — columnar storage, denormalized schemas, and massively parallel execution make complex aggregations over billions of rows fast. The fundamental design pattern (Ralph Kimball's dimensional modeling) builds fact tables (what happened, with metrics) surrounded by dimension tables (who, what, when, where) in a star schema. Getting the grain of the fact table right is the most important design decision you'll make.

---

## OLTP vs OLAP

| Aspect | OLTP (Online Transaction Processing) | OLAP (Online Analytical Processing) |
|---|---|---|
| **Workload** | Many small read/write transactions | Few complex queries over large data |
| **Schema** | Normalized (3NF) — minimize redundancy | Denormalized — minimize JOINs for speed |
| **Storage** | Row-oriented (good for inserting/updating rows) | Column-oriented (good for aggregating columns) |
| **Query pattern** | `SELECT * FROM orders WHERE id = 42` | `SELECT region, SUM(revenue) FROM orders GROUP BY 1` |
| **Data volume** | Gigabytes (current data) | Terabytes/Petabytes (historical data) |
| **Optimization** | Index on primary/foreign keys | Partition by date, cluster by common filters |
| **Examples** | PostgreSQL, MySQL, Oracle | Snowflake, BigQuery, Redshift, Databricks |

**Why columnar storage is faster for analytics:**

```
Row store: [row1_all_cols][row2_all_cols]...[rowN_all_cols]
Column store: [col1_all_rows][col2_all_rows]...[colN_all_rows]

For: SELECT SUM(revenue) FROM orders WHERE region = 'East'
→ Column store: read only 'revenue' and 'region' columns
→ Row store: read every column of every row
→ 100x less I/O with column store on wide tables
```

---

## Dimensional Modeling — Ralph Kimball

Kimball's dimensional modeling organizes warehouse data into fact tables and dimension tables, designed for intuitive analysis and query performance.

### Fact Tables

Fact tables store **measurements** of business events. Each row is one event at a specific grain.

| Property | Description |
|---|---|
| **Grain** | The level of detail of one row — the most important design decision |
| **Metrics** | Numeric, additive measures (revenue, units, quantity) |
| **Foreign keys** | Keys to dimension tables |
| **Additive** | Can be summed across all dimensions (revenue) |
| **Semi-additive** | Can be summed across some dimensions (account balance: sum across accounts, NOT across time) |
| **Non-additive** | Cannot be summed at all (ratio, percentage) |

**Common fact table grains:**
- Order line item (most granular — most flexible)
- Daily snapshot (one row per entity per day)
- Accumulated snapshot (one row per process instance, updated over lifecycle)

### Dimension Tables

Dimension tables provide **context** for facts — the who, what, when, where.

```sql
-- Dim_Customer example
CREATE TABLE dim_customer AS
SELECT
    customer_id,          -- surrogate key (warehouse-generated, stable)
    source_customer_id,   -- natural key from source system
    full_name,
    email,
    city,
    state,
    country,
    customer_tier,        -- Gold, Silver, Bronze
    acquisition_channel,  -- Organic, Paid, Referral
    signup_date
FROM ...;
```

---

## Star Schema vs Snowflake Schema

```
Star Schema:
    Fact_Sales
    ├── Dim_Customer     (denormalized — customer + address in one table)
    ├── Dim_Product      (denormalized — product + category + brand in one table)
    ├── Dim_Date         (date + week + month + quarter in one table)
    └── Dim_Store        (store + region + district in one table)

Snowflake Schema:
    Fact_Sales
    ├── Dim_Customer
    │   └── Dim_Address  (normalized out)
    ├── Dim_Product
    │   ├── Dim_Category (normalized out)
    │   └── Dim_Brand    (normalized out)
    ...
```

| Aspect | Star Schema | Snowflake Schema |
|---|---|---|
| Query complexity | Simpler (fewer JOINs) | More complex (deeper JOIN chains) |
| Storage | Slightly more (denormalized) | Less (normalized) |
| Query performance | Faster (fewer JOINs) | Slower (more JOINs) |
| BI tool compatibility | Better (most BI tools prefer star) | Works but harder to model |
| **Recommendation** | Use in data warehouse | Acceptable for source OLTP |

**One Big Table (OBT):** denormalize everything into one wide fact table — very fast queries, easy for analysts, but:
- Massive redundancy (dimension attributes repeated per fact row)
- Hard to update dimension attributes
- Works well for DuckDB/MotherDuck analytical use cases

---

## Slowly Changing Dimensions (SCD)

How do you handle changes in dimension attributes? A customer moved cities, or changed tier.

| Type | Strategy | When to Use |
|---|---|---|
| **Type 0** | Don't update — original value only | Static attributes (date of birth) |
| **Type 1** | Overwrite — no history kept | Corrections to errors |
| **Type 2** | Add new row with effective date — full history | Most cases (customer tier, address) |
| **Type 3** | Add "previous value" column — only one prior value | When only last change matters |
| **Type 4** | Separate history table | When history queries are rare |
| **Type 6** | Type 1 + 2 + 3 combined | Current + historical + previous in one row |

```sql
-- SCD Type 2 structure
CREATE TABLE dim_customer (
    customer_surrogate_key  BIGINT PRIMARY KEY,  -- warehouse-generated
    customer_natural_key    VARCHAR,             -- source system ID
    customer_name           VARCHAR,
    customer_tier           VARCHAR,
    effective_date          DATE NOT NULL,
    expiry_date             DATE,                -- NULL = currently active
    is_current              BOOLEAN DEFAULT TRUE
);

-- Query: what was the customer's tier when they made an order?
SELECT o.order_id, o.revenue, c.customer_tier
FROM fact_orders o
JOIN dim_customer c
  ON o.customer_id = c.customer_natural_key
  AND o.order_date BETWEEN c.effective_date AND COALESCE(c.expiry_date, '9999-12-31')
```

---

## Data Vault 2.0

Data Vault is an alternative modeling approach for enterprise data warehouses requiring auditability, flexibility, and historical completeness. Less common than Kimball but used in finance, insurance, healthcare.

```
Hubs    — business keys (Customer_Hub: hashed customer_id)
Links   — relationships between hubs (Order_Link: connects Customer_Hub + Product_Hub)
Satellites — descriptive attributes (Customer_Sat: name, address, tier + load_ts, record_src)
```

**Pros:** Highly auditable, source-system-agnostic, easy to extend.
**Cons:** Very complex queries, many tables, requires deep DV expertise.

---

## Modern Data Stack

```
Source Systems
(CRM / ERP / Events / SaaS tools)
    ↓
Ingestion (EL)
Fivetran / Airbyte → loads raw data to warehouse
    ↓
Storage (Data Warehouse)
Snowflake / BigQuery / Redshift / Databricks
    ↓
Transformation (T)
dbt → clean, test, document models (star schema)
    ↓
Semantic Layer
dbt Semantic Layer / Looker LookML / Cube.dev
    ↓
Consumption
BI Tools (Looker, Tableau, Power BI)
Notebooks (Jupyter, Hex)
Reverse ETL (Census, Hightouch → back to CRM)
```

---

## Common Pitfalls

- **Wrong grain on the fact table** — putting multiple events at different grains in one fact table (one row is an order, another is an order line item) leads to double-counting and incorrect aggregations. One fact table = one grain.
- **Dimension with no surrogate key** — using the natural key from the source system as the primary key breaks SCD Type 2 (you can't have two rows with the same natural key without a surrogate). Always generate a warehouse surrogate key.
- **Fat dimensions vs skinny facts** — attributes that describe the measurement (e.g., discount percentage on an order) belong in the fact table, not the dimension. Attributes that describe the entity (customer's city) belong in the dimension.
- **Date dimension skipped** — analysts often start by joining the fact table to itself using date math. A dedicated Date dimension with pre-computed month, quarter, fiscal year, holiday flag columns makes this dramatically simpler and faster.

---

## Review Questions

1. **Design:** You're building a data warehouse for a SaaS company with these source tables: subscriptions (one row per customer subscription, changes over time), usage_events (one row per feature use), customers, and plans. Define the star schema: what is the fact table grain? What are the dimensions? How do you handle the changing subscription tier (SCD)?

2. **Modeling:** A fact table has a `discount_rate` column (non-additive). An analyst tries to do `SUM(discount_rate)` in their dashboard and gets a nonsensical number. What is the correct way to model and expose a non-additive metric in a dimensional model?

3. **Trade-off:** A startup analytics engineer proposes using One Big Table (OBT) instead of a star schema because "it's simpler." Evaluate the trade-offs: when does OBT make sense, and at what scale or complexity does it break down?

---

#DataAnalytics #DataWarehouse #DimensionalModeling #StarSchema #OLAP #intermediate
