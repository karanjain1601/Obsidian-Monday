---
title: "dplyr Data Manipulation"
aliases: ["dplyr", "tidyverse manipulation", "dplyr verbs"]
tags: [r-programming, tidyverse, intermediate]
domain: R Programming
difficulty: intermediate
created: 2026-07-26
related: ["[[tidyr_Data_Tidying]]", "[[purrr_Functional_Programming]]", "[[readr_tibble]]"]
status: complete
---

# 🔧 dplyr Data Manipulation

> [!abstract] TL;DR
> dplyr provides five core verbs (`filter`, `select`, `mutate`, `summarise`, `arrange`) composable via the pipe, plus `group_by` for grouped operations, six join types, and tidy evaluation (`{{ }}`) for writing reusable functions. It is the standard grammar for data manipulation in R — readable, expressive, and backed by database engines via dbplyr.

## Intuition — analogy FIRST

Think of dplyr as a **SQL query builder in R syntax**. Just as SQL lets you `WHERE`, `SELECT`, `JOIN`, and `GROUP BY` on a table, dplyr lets you `filter`, `select`, `mutate`, and `summarise` on a data frame — but in left-to-right pipe syntax instead of inside-out function calls. The pipe (`|>`) is dplyr's semicolon: each verb hands its result to the next, like an assembly line.

---

## How It Works

```mermaid
graph LR
    Raw["Raw Data Frame"] --> filter["filter()\nkeep rows"]
    filter --> select["select()\nkeep columns"]
    select --> mutate["mutate()\nadd/modify columns"]
    mutate --> group["group_by()\ndefine groups"]
    group --> summarise["summarise()\nreduce groups"]
    summarise --> arrange["arrange()\nsort rows"]
    arrange --> Out["Result Data Frame"]

    style Raw fill:#4a9eff,color:#fff
    style Out fill:#059669,color:#fff
    style group fill:#7c3aed,color:#fff
```

---

## Key Concepts / Details

### The Five Core Verbs

| Verb | What it does | Equivalent SQL |
|------|-------------|----------------|
| `filter()` | Keep rows matching a condition | `WHERE` |
| `select()` | Keep/drop/rename columns | `SELECT` |
| `mutate()` | Add or modify columns | Computed columns |
| `summarise()` | Reduce rows to summary stats | Aggregate functions |
| `arrange()` | Sort rows by column values | `ORDER BY` |

```r
library(dplyr)

# Chaining verbs with the native pipe
mtcars |>
  filter(cyl == 6, mpg > 18) |>
  select(mpg, cyl, hp, gear) |>
  mutate(
    efficiency = mpg / hp,
    gear_type  = if_else(gear == 4, "four-speed", "other")
  ) |>
  arrange(desc(efficiency))
```

### group_by + summarise with across()

`group_by()` partitions the data frame; every subsequent verb operates per-group. `across()` applies the same transformation to multiple columns selected by tidy-select helpers.

```r
library(dplyr)

mtcars |>
  group_by(cyl, gear) |>
  summarise(
    across(c(mpg, hp, wt), list(mean = mean, sd = sd), .names = "{.col}_{.fn}"),
    n = n(),
    .groups = "drop"
  )

# Tidy-select helpers in across():
# starts_with("x"), ends_with("_id"), contains("score"),
# matches("^val_\\d+$"), where(is.numeric), all_of(col_vec)
```

### Window Functions

Window functions compute a value for each row using data from multiple rows, without collapsing the group.

```r
flights |>
  group_by(carrier) |>
  mutate(
    dep_delay_rank   = row_number(desc(dep_delay)),   # rank within group
    dep_delay_pctile = percent_rank(dep_delay),        # 0–1 percentile
    delay_ntile      = ntile(dep_delay, 4),            # quartile bucket
    prev_delay       = lag(dep_delay, 1),              # previous row
    cum_delay        = cumsum(replace_na(dep_delay,0)) # running total
  ) |>
  ungroup()
```

### Joins

dplyr offers six join types. The two most commonly confused are `left_join` (keep all left rows) and `inner_join` (keep only matching rows in both).

```r
# Mutating joins — add columns from right to left
left_join(orders, customers, by = "customer_id")   # all orders, NA if no customer
inner_join(orders, customers, by = "customer_id")  # only matched orders
right_join(orders, customers, by = "customer_id")  # all customers
full_join(orders,  customers, by = "customer_id")  # all rows from both

# Filtering joins — filter left based on right, no new columns added
semi_join(orders, vip_customers, by = "customer_id")  # orders WITH a VIP customer
anti_join(orders, vip_customers, by = "customer_id")  # orders WITHOUT a VIP customer
```

| Join Type | Rows Kept | Columns Added |
|-----------|-----------|---------------|
| `left_join` | All from left | From right (NA if no match) |
| `inner_join` | Only matched | From right |
| `right_join` | All from right | From left (NA if no match) |
| `full_join` | All from both | From both (NA where missing) |
| `semi_join` | Left rows that match | None |
| `anti_join` | Left rows that don't match | None |

### Tidy Evaluation — Writing Reusable Functions

Normal dplyr uses **data masking** (column names look like variables). Inside your own functions, use `{{ }}` (embracing) for column arguments passed as bare names, and `.data[[col]]` for column names passed as strings.

```r
# {{ }} embracing — for bare column arguments (most common)
my_summary <- function(df, group_col, val_col) {
  df |>
    group_by({{ group_col }}) |>
    summarise(
      mean_val = mean({{ val_col }}, na.rm = TRUE),
      n        = n(),
      .groups  = "drop"
    )
}
my_summary(mtcars, cyl, mpg)

# .data[[ ]] — for string column arguments
my_filter <- function(df, col_name, threshold) {
  df |> filter(.data[[col_name]] > threshold)
}
my_filter(mtcars, "mpg", 20)
```

### case_when and case_match

```r
mtcars |>
  mutate(
    size_class = case_when(
      cyl <= 4          ~ "small",
      cyl == 6          ~ "medium",
      cyl >= 8          ~ "large",
      .default          = "unknown"
    ),
    # case_match — exact value matching (cleaner than case_when for this)
    cyl_label = case_match(
      cyl,
      4 ~ "four",
      6 ~ "six",
      8 ~ "eight"
    )
  )
```

### slice_* for Row Selection

```r
mtcars |> slice_max(mpg, n = 5)          # top 5 by mpg
mtcars |> slice_min(wt, n = 3)           # 3 lightest cars
mtcars |> slice_sample(n = 10)           # random 10 rows
mtcars |> slice_sample(prop = 0.2)       # random 20% of rows
mtcars |> group_by(cyl) |> slice_max(mpg, n = 1)  # best mpg per cylinder group
```

---

## Real-World Notes

- **dbplyr** translates dplyr verbs to SQL automatically — the same `filter/mutate/group_by/summarise` chain runs against a database backend with `collect()` pulling results into R only at the end.
- **Arrow** backend lets you run dplyr on Parquet files larger than RAM via `arrow::open_dataset()`.
- For tables over ~10M rows, consider **data.table** which has 2–5× better performance for aggregations, though dplyr is usually fast enough for interactive analysis.

---

## Common Pitfalls

1. **Forgetting `ungroup()`** — `group_by()` persists until removed. A grouped data frame returned from a function can cause confusing behavior downstream. Use `.groups = "drop"` inside `summarise()` or call `ungroup()` explicitly.
2. **`summarise()` drops all columns** except group columns and the new computed ones. If you want to add a summary column while keeping all rows, use `mutate()` not `summarise()`.
3. **`n()` inside `mutate` on a grouped df counts group size** — that's intentional, but beginners expect `nrow()`.
4. **Using `filter(x == NA)`** — always use `is.na(x)`, never `x == NA` (which returns `NA` for every row).
5. **Tidy eval with `!!sym(col_string)`** — the older pattern still works but `{{ }}` for bare names and `.data[[]]` for strings are the modern replacements.

---

## Related Concepts

- [[_MOC_Tidyverse|↑ Section MOC]]
- [[tidyr_Data_Tidying]] — Reshape the tidy data frames that dplyr produces
- [[purrr_Functional_Programming]] — Iterate over data frames with `map` and `group_modify`
- [[readr_tibble]] — Load data into the tibbles that dplyr operates on
- [[stringr_forcats]] — String and factor manipulation inside `mutate()`
- [[Regression_Analysis_R]] — Statistical modelling on data frames prepared with dplyr

---

## Review Questions

1. What is the difference between `semi_join` and `left_join`? When would you choose each?
2. Why does `mutate()` keep all rows while `summarise()` does not?
3. How do you write a function that accepts a column name as a bare (unquoted) argument?
4. What does `across(where(is.numeric), mean)` do inside `summarise()`?
5. Explain the difference between `lag()` in a window function context vs outside `group_by()`.

---

## Sources

- Wickham H. et al., *R for Data Science* (2e), Ch. 3–5 — https://r4ds.hadley.nz
- dplyr reference documentation — https://dplyr.tidyverse.org/reference/
- *Advanced R* by Hadley Wickham — Metaprogramming chapter on tidy evaluation

#r-programming #tidyverse #dplyr
