---
title: SQL for Analytics
aliases:
  - Analytical SQL
  - SQL Window Functions
  - SQL Analytics
tags: [DataAnalytics, SQL, WindowFunctions, CTE, Cohort]
domain: Data Analytics
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Data_Analytics_Overview]]"
  - "[[Data_Warehouse_Concepts]]"
  - "[[Snowflake_and_BigQuery]]"
  - "[[dbt_Analytics_Engineering]]"
  - "[[Analytics_Metrics_and_KPIs]]"
  - "[[Data_Cleaning_and_EDA]]"
status: complete
---

# SQL for Analytics

> [!abstract] TL;DR
> Analytical SQL extends basic CRUD with window functions, CTEs, and multi-level aggregations that let a single query answer questions like "what is each user's rank within their cohort" or "what percentage of users who started a funnel step completed the next one." Master these patterns and you can answer most business questions without Python.

---

## Window Functions — The Core Pattern

Window functions compute a value for each row using a sliding "window" of related rows, without collapsing the result set like `GROUP BY` does.

```sql
function_name(column)
OVER (
    PARTITION BY partition_column   -- reset window per group (optional)
    ORDER BY order_column           -- ordering within window (optional)
    ROWS BETWEEN ... AND ...        -- frame clause (optional)
)
```

### Ranking Functions

```sql
SELECT
    user_id,
    revenue,
    region,
    -- ROW_NUMBER: unique sequential rank (no ties)
    ROW_NUMBER() OVER (PARTITION BY region ORDER BY revenue DESC) AS row_num,
    -- RANK: same rank for ties, skips next number (1,1,3)
    RANK()       OVER (PARTITION BY region ORDER BY revenue DESC) AS rank_pos,
    -- DENSE_RANK: same rank for ties, no skip (1,1,2)
    DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS dense_rank,
    -- NTILE(4): divide into 4 equal buckets (quartiles)
    NTILE(4)     OVER (ORDER BY revenue DESC) AS quartile
FROM orders;

-- Get top 3 customers per region
SELECT * FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY region ORDER BY revenue DESC) AS rn
    FROM orders
) ranked
WHERE rn <= 3;
```

### LAG and LEAD (Time-Based Comparisons)

```sql
SELECT
    date_trunc('month', order_date) AS month,
    SUM(revenue) AS monthly_revenue,
    LAG(SUM(revenue)) OVER (ORDER BY date_trunc('month', order_date)) AS prev_month,
    -- Month-over-month growth rate
    ROUND(
        (SUM(revenue) - LAG(SUM(revenue)) OVER (ORDER BY date_trunc('month', order_date)))
        / NULLIF(LAG(SUM(revenue)) OVER (ORDER BY date_trunc('month', order_date)), 0) * 100,
        2
    ) AS mom_growth_pct
FROM orders
GROUP BY 1
ORDER BY 1;
```

### Running Aggregations

```sql
SELECT
    order_date,
    daily_revenue,
    -- Running total
    SUM(daily_revenue) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
    -- 7-day moving average
    AVG(daily_revenue) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma_7d,
    -- FIRST_VALUE and LAST_VALUE in the partition
    FIRST_VALUE(daily_revenue) OVER (PARTITION BY EXTRACT(MONTH FROM order_date) ORDER BY order_date) AS month_start_rev
FROM daily_metrics;
```

---

## CTEs — Readable Multi-Step Queries

Common Table Expressions (CTEs) let you name intermediate results. Always prefer CTEs over nested subqueries — they read top-to-bottom, are reusable within the query, and are easy to debug by running each CTE block independently.

```sql
-- Step 1: Get monthly revenue per customer
WITH monthly_revenue AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', order_date) AS month,
        SUM(amount) AS revenue
    FROM orders
    WHERE order_date >= '2025-01-01'
    GROUP BY 1, 2
),

-- Step 2: Rank customers by revenue within each month
ranked AS (
    SELECT *,
           RANK() OVER (PARTITION BY month ORDER BY revenue DESC) AS rank_in_month
    FROM monthly_revenue
),

-- Step 3: Customers who were top-10 for at least 3 months
consistent_top_10 AS (
    SELECT customer_id, COUNT(*) AS months_in_top_10
    FROM ranked
    WHERE rank_in_month <= 10
    GROUP BY 1
    HAVING COUNT(*) >= 3
)

SELECT c.customer_id, c.months_in_top_10, u.email, u.segment
FROM consistent_top_10 c
JOIN users u ON c.customer_id = u.id
ORDER BY c.months_in_top_10 DESC;
```

---

## Pivoting Data

### Manual Pivot with CASE WHEN (Works Everywhere)

```sql
SELECT
    user_id,
    SUM(CASE WHEN product = 'Basic'    THEN revenue ELSE 0 END) AS basic_revenue,
    SUM(CASE WHEN product = 'Pro'      THEN revenue ELSE 0 END) AS pro_revenue,
    SUM(CASE WHEN product = 'Enterprise' THEN revenue ELSE 0 END) AS enterprise_revenue
FROM orders
GROUP BY user_id;
```

### Snowflake/BigQuery Native PIVOT

```sql
-- Snowflake
SELECT * FROM (
    SELECT product, revenue, month FROM orders
)
PIVOT (SUM(revenue) FOR product IN ('Basic', 'Pro', 'Enterprise'))
AS p;
```

---

## Multi-Level Aggregation: GROUPING SETS, ROLLUP, CUBE

```sql
-- ROLLUP: hierarchical subtotals (region → country → city)
SELECT region, country, city, SUM(sales) AS total_sales
FROM sales_data
GROUP BY ROLLUP(region, country, city);

-- GROUPING SETS: explicit combinations
SELECT region, product, SUM(sales) AS total_sales
FROM sales_data
GROUP BY GROUPING SETS (
    (region, product),  -- by region and product
    (region),           -- by region only
    (product),          -- by product only
    ()                  -- grand total
);

-- CUBE: all possible combinations of dimensions
SELECT region, product, channel, SUM(sales)
FROM sales_data
GROUP BY CUBE(region, product, channel);
-- Use GROUPING() to detect which rows are subtotals
```

---

## Date Arithmetic

```sql
-- Date truncation (BigQuery / Snowflake)
DATE_TRUNC('week', event_date)    -- start of the week containing the date
DATE_TRUNC('month', event_date)   -- first day of month
DATE_TRUNC('quarter', event_date) -- first day of quarter

-- Date differences
DATEDIFF('day', start_date, end_date)         -- Snowflake
DATE_DIFF(end_date, start_date, DAY)          -- BigQuery
EXTRACT(EPOCH FROM (end_ts - start_ts))/86400 -- PostgreSQL → days as decimal

-- Date parts
EXTRACT(DOW FROM event_date)   -- day of week (0=Sun, 6=Sat)
EXTRACT(HOUR FROM event_ts)    -- hour of day
FORMAT_DATE('%Y-%W', event_date)  -- BigQuery: year-week string

-- Last N days (BigQuery)
WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
```

---

## Cohort Analysis SQL

Cohort analysis tracks behavior of users grouped by a shared start date (signup, first purchase).

```sql
-- Cohort retention: what % of each signup cohort is still active N months later?
WITH cohorts AS (
    SELECT
        user_id,
        DATE_TRUNC('month', signup_date) AS cohort_month
    FROM users
),
activity AS (
    SELECT
        user_id,
        DATE_TRUNC('month', event_date) AS activity_month
    FROM events
    GROUP BY 1, 2
),
cohort_activity AS (
    SELECT
        c.cohort_month,
        DATEDIFF('month', c.cohort_month, a.activity_month) AS months_since_signup,
        COUNT(DISTINCT a.user_id) AS active_users
    FROM cohorts c
    JOIN activity a ON c.user_id = a.user_id
    GROUP BY 1, 2
),
cohort_sizes AS (
    SELECT cohort_month, COUNT(*) AS cohort_size
    FROM cohorts
    GROUP BY 1
)
SELECT
    ca.cohort_month,
    ca.months_since_signup,
    ca.active_users,
    cs.cohort_size,
    ROUND(ca.active_users * 100.0 / cs.cohort_size, 1) AS retention_pct
FROM cohort_activity ca
JOIN cohort_sizes cs ON ca.cohort_month = cs.cohort_month
ORDER BY 1, 2;
```

---

## Funnel Analysis SQL

```sql
-- Count users completing each step of an onboarding funnel
WITH funnel AS (
    SELECT
        user_id,
        MAX(CASE WHEN event = 'signup'          THEN 1 ELSE 0 END) AS step_1_signup,
        MAX(CASE WHEN event = 'email_verified'  THEN 1 ELSE 0 END) AS step_2_verified,
        MAX(CASE WHEN event = 'profile_created' THEN 1 ELSE 0 END) AS step_3_profile,
        MAX(CASE WHEN event = 'first_purchase'  THEN 1 ELSE 0 END) AS step_4_purchase
    FROM events
    WHERE event_date >= '2025-01-01'
    GROUP BY user_id
)
SELECT
    SUM(step_1_signup)    AS step_1_n,
    SUM(step_2_verified)  AS step_2_n,
    SUM(step_3_profile)   AS step_3_n,
    SUM(step_4_purchase)  AS step_4_n,
    -- Drop-off between steps
    ROUND(SUM(step_2_verified) * 100.0 / NULLIF(SUM(step_1_signup), 0), 1)    AS s1_s2_pct,
    ROUND(SUM(step_3_profile)  * 100.0 / NULLIF(SUM(step_2_verified), 0), 1)  AS s2_s3_pct,
    ROUND(SUM(step_4_purchase) * 100.0 / NULLIF(SUM(step_3_profile), 0), 1)   AS s3_s4_pct
FROM funnel;
```

---

## Subqueries vs CTEs vs Views

| Pattern | Syntax | Best For |
|---|---|---|
| Subquery | `SELECT ... FROM (SELECT ...) alias` | One-time, simple intermediate result |
| CTE | `WITH cte AS (SELECT ...)` | Multi-step queries; readable; reusable within query |
| View | `CREATE VIEW v AS SELECT ...` | Saved query you reuse across multiple queries |
| Materialized View | `CREATE MATERIALIZED VIEW ...` | Expensive computation run once and stored |

---

## Common Pitfalls

- **NULLIF in denominators** — dividing by zero crashes or silently produces NULL. Always wrap denominators: `NULLIF(denominator, 0)`.
- **LAG without ORDER BY** — window functions without ORDER BY produce non-deterministic results. Always specify ORDER BY.
- **Counting NULLs** — `COUNT(column)` excludes NULLs; `COUNT(*)` includes all rows. Know which you need.
- **HAVING vs WHERE** — WHERE filters before aggregation; HAVING filters after. `HAVING COUNT(*) > 5` works; `WHERE COUNT(*) > 5` errors.
- **Funnel step ordering** — CASE WHEN with MAX only checks if an event *ever* happened, not if it happened *before* the next step. Add timestamp ordering for strict funnel analysis.

---

## Review Questions

1. **Coding:** Write a SQL query to find the top-spending customer in each product category, returning only one row per category. Use both ROW_NUMBER and an approach with a self-join, and explain when each is preferable.

2. **Scenario:** A manager asks: "Show me how many users we signed up each month over the last year, their revenue in the first 30 days, and how that compares to the prior month's cohort." Write the CTE-based SQL query to answer this.

3. **Debugging:** A funnel query shows 120% of users completing step 2 vs step 1. What went wrong, and how do you fix it? (Hint: think about how users can re-trigger events.)

---

#DataAnalytics #SQL #WindowFunctions #CTE #Cohort #intermediate
