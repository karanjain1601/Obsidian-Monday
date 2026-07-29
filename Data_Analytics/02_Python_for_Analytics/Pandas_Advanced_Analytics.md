---
title: Pandas Advanced Analytics
aliases:
  - Pandas Advanced
  - Pandas Analytics Patterns
  - pandas groupby agg
tags: [DataAnalytics, Python, Pandas, Analytics, DataManipulation]
domain: Data Analytics
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Data_Analytics_Overview]]"
  - "[[Data_Cleaning_and_EDA]]"
  - "[[Data_Visualization_Python]]"
  - "[[Analytics_Engineering_Python]]"
  - "[[SQL_for_Analytics]]"
status: complete
---

# Pandas Advanced Analytics

> [!abstract] TL;DR
> Advanced pandas analytics centers on four capabilities that power real analytics work: multi-index structures for hierarchical data, sophisticated groupby patterns for complex aggregations, reshape operations (pivot/melt/stack/unstack) for format transformations, and time-series windowing for rolling metrics. These patterns let you replicate SQL window functions, build cohort retention tables, and create rolling KPIs entirely in Python.

---

## Multi-Index DataFrames

A MultiIndex assigns two or more levels to rows or columns, enabling hierarchical grouping.

```python
import pandas as pd
import numpy as np

# Create multi-index from groupby
df = pd.DataFrame({
    "region": ["East","East","West","West","East","West"],
    "product": ["A","B","A","B","A","A"],
    "revenue": [100, 200, 150, 120, 130, 160],
    "units": [10, 20, 15, 12, 13, 16]
})

# groupby creates MultiIndex by default with as_index=True
multi = df.groupby(["region","product"]).agg(
    total_revenue=("revenue", "sum"),
    avg_revenue=("revenue", "mean"),
    total_units=("units", "sum")
)
print(multi)
# region  product
# East    A          230     115.0     23
#         B          200     200.0     20
# West    A          310     155.0     31
#         B          120     120.0     12

# Access a specific level with xs (cross-section)
east_data = multi.xs("East", level="region")
product_a = multi.xs("A",    level="product")

# Reset to flat DataFrame
flat = multi.reset_index()

# Set multi-index manually
flat = flat.set_index(["region", "product"])
```

---

## Groupby — Advanced Patterns

### Multiple Aggregations with Named Outputs

```python
# Clean named-output syntax (pandas 0.25+)
summary = df.groupby("region").agg(
    total_rev   = ("revenue", "sum"),
    avg_rev     = ("revenue", "mean"),
    max_rev     = ("revenue", "max"),
    p90_rev     = ("revenue", lambda x: x.quantile(0.9)),
    n_products  = ("product", "nunique"),
    total_units = ("units", "sum")
)
```

### transform vs apply vs agg

| Method | Output Shape | Use Case |
|---|---|---|
| `.agg()` | Smaller (one row per group) | Summary statistics |
| `.transform()` | Same shape as input | Add group-level feature back to rows |
| `.apply()` | Flexible | Custom function returning any shape |

```python
# transform — add group metric as a column WITHOUT collapsing rows
df["region_avg_rev"] = df.groupby("region")["revenue"].transform("mean")
df["rev_vs_region_avg"] = df["revenue"] / df["region_avg_rev"]

# apply — custom logic returning arbitrary shape (slower but flexible)
def top_n(group, n=2):
    return group.nlargest(n, "revenue")

top2_per_region = df.groupby("region").apply(top_n, n=2).reset_index(drop=True)
```

---

## Reshaping: Pivot, Melt, Stack, Unstack

### pivot_table

```python
# SQL equivalent: SELECT region, product, SUM(revenue) GROUP BY region, product
pivot = pd.pivot_table(
    df,
    values="revenue",
    index="region",       # rows
    columns="product",    # columns
    aggfunc="sum",        # aggregation
    fill_value=0          # replace NaN with 0
)
# result: region as rows, product A/B as columns, revenue as values
```

### crosstab (Frequency Version)

```python
# Frequency count — e.g., how many orders per region per product?
ct = pd.crosstab(df["region"], df["product"])
# Normalize to proportions
ct_pct = pd.crosstab(df["region"], df["product"], normalize="index")
```

### melt (Wide → Long)

```python
# From: date | product_A_rev | product_B_rev
# To:   date | product | revenue

wide = pd.DataFrame({
    "date": ["2025-01", "2025-02"],
    "product_A_rev": [100, 120],
    "product_B_rev": [200, 210]
})

long = wide.melt(
    id_vars=["date"],
    value_vars=["product_A_rev", "product_B_rev"],
    var_name="product",
    value_name="revenue"
)
# Tidy format — one observation per row
```

### stack / unstack

```python
# stack: column level → row level (wide → long)
stacked = pivot.stack()   # product becomes innermost row index

# unstack: row level → column level (long → wide)
unstacked = stacked.unstack(level="product")  # back to wide
```

---

## Rolling and Expanding Windows

```python
# Sort is critical for time-based windows
df = df.sort_values("date")

# Rolling window: 7-day moving average
df["rev_7d_avg"] = df["revenue"].rolling(window=7, min_periods=1).mean()

# Rolling with groupby: per-customer rolling sum
df["cum_rev_7d"] = (
    df.groupby("customer_id")["revenue"]
    .transform(lambda x: x.rolling(7, min_periods=1).sum())
)

# Expanding window: cumulative sum from start
df["cumulative_rev"] = df.groupby("customer_id")["revenue"].transform("cumsum")

# Exponential weighted moving average (more weight to recent)
df["ewm_7d"] = df["revenue"].ewm(span=7, min_periods=1).mean()
```

---

## Time Series Resampling

```python
df["date"] = pd.to_datetime(df["date"])
df = df.set_index("date")

# Downsample: daily → monthly sum
monthly = df["revenue"].resample("ME").sum()   # ME = month end
weekly  = df["revenue"].resample("W").mean()   # W = week end Sunday

# Upsample: monthly → daily with forward-fill
daily = monthly.resample("D").ffill()

# Resample with multiple metrics
monthly_stats = df["revenue"].resample("ME").agg(
    total="sum", avg="mean", peak="max"
)

# Period comparison — growth calculation
monthly["prev_month"] = monthly.shift(1)
monthly["mom_growth"] = (monthly - monthly["prev_month"]) / monthly["prev_month"]
```

---

## Merge Types with Diagnostic indicator

```python
# Diagnosing join quality with indicator=True
merged = pd.merge(
    orders, customers,
    on="customer_id",
    how="outer",
    indicator=True   # adds _merge column: left_only/right_only/both
)

# Quality check
print(merged["_merge"].value_counts())
# both          45230    ← matched
# left_only      1204    ← orders with no customer record (data issue!)
# right_only      312    ← customers who never ordered (expected)

# Keep only matched rows
clean = merged[merged["_merge"] == "both"].drop(columns=["_merge"])
```

---

## Memory Optimization

```python
def optimize_dtypes(df):
    """Reduce DataFrame memory by downcasting numeric types."""
    for col in df.select_dtypes(include=["int64"]).columns:
        df[col] = pd.to_numeric(df[col], downcast="integer")
    for col in df.select_dtypes(include=["float64"]).columns:
        df[col] = pd.to_numeric(df[col], downcast="float")
    for col in df.select_dtypes(include=["object"]).columns:
        n_unique = df[col].nunique()
        if n_unique / len(df) < 0.5:  # low cardinality → category
            df[col] = df[col].astype("category")
    return df

before = df.memory_usage(deep=True).sum() / 1024**2
df = optimize_dtypes(df)
after = df.memory_usage(deep=True).sum() / 1024**2
print(f"Memory: {before:.1f} MB → {after:.1f} MB ({(1-after/before)*100:.0f}% reduction)")
```

---

## End-to-End Analytics Example: Monthly Cohort Retention

```python
# Build a cohort retention table from event data
events = pd.read_parquet("user_events.parquet", columns=["user_id", "event_date"])
events["event_date"] = pd.to_datetime(events["event_date"])
events["event_month"] = events["event_date"].dt.to_period("M")

# Get each user's first active month (cohort assignment)
cohort_map = events.groupby("user_id")["event_month"].min().rename("cohort_month")
events = events.join(cohort_map, on="user_id")

# Calculate months offset from cohort start
events["months_offset"] = (
    events["event_month"] - events["cohort_month"]
).apply(lambda x: x.n)

# Build retention table
retention = events.groupby(["cohort_month", "months_offset"])["user_id"].nunique()
cohort_sizes = events.groupby("cohort_month")["user_id"].nunique()
retention_pct = retention.div(cohort_sizes, level="cohort_month") * 100

# Pivot to wide format (cohorts as rows, months_offset as columns)
table = retention_pct.unstack("months_offset").round(1)
print(table)
```

---

## Common Pitfalls

- **Forgetting `min_periods` in rolling** — `rolling(7).mean()` returns NaN for the first 6 rows. Set `min_periods=1` to compute on available data, or document the null period.
- **groupby transform performance** — using `apply` inside `transform` is slow. Use built-in string aggregations (`"mean"`, `"sum"`) with `transform` when possible.
- **Period vs Timestamp** — `resample` requires a DatetimeIndex; `to_period("M")` converts to Period type, which is useful for cohort labeling but incompatible with datetime operations. Keep them separate.
- **Merge on mismatched types** — merging int64 `user_id` in one table with object `user_id` in another silently produces zero matches. Check dtypes before merging.

---

## Review Questions

1. **Coding:** You have a DataFrame with columns `user_id`, `date`, `revenue`. Write the pandas code to compute, for each row, the user's 7-day rolling revenue (excluding the current row to avoid leakage), and add it as a new column.

2. **Conceptual:** Explain the difference between `groupby().agg()`, `groupby().transform()`, and `groupby().apply()`. Give a concrete analytics use case where you would choose each one.

3. **Trade-off:** You need to build a monthly cohort retention table for 5 million user events. You wrote the pandas version but it runs out of memory. What are three approaches to solve this, in increasing order of infrastructure complexity?

---

#DataAnalytics #Python #Pandas #Analytics #DataManipulation #intermediate
