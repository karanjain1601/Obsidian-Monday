---
title: Excel and Google Sheets for Analytics
aliases:
  - Excel Analytics
  - Google Sheets Analytics
  - Power Query
  - Pivot Tables
tags: [DataAnalytics, Excel, GoogleSheets, PowerQuery, PivotTables, DAX]
domain: Data Analytics
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Data_Analytics_Overview]]"
  - "[[SQL_for_Analytics]]"
  - "[[Power_BI_Fundamentals]]"
  - "[[Data_Cleaning_and_EDA]]"
status: complete
---

# Excel and Google Sheets for Analytics

> [!abstract] TL;DR
> Excel remains the most widely used data analysis tool in the world — not because it is the best, but because it is universal, visual, and trusted by business stakeholders. The modern analyst's Excel skills center on Power Query (for ETL), pivot tables (for aggregation), advanced lookups (XLOOKUP), dynamic arrays (FILTER/SORT/UNIQUE), and Power Pivot with DAX for in-memory data modeling. Google Sheets has near-parity for small datasets and adds real-time collaboration.

---

## Power Query — The ETL Layer

Power Query (Get & Transform) is Excel's built-in ETL tool. It connects to data sources, transforms data with a point-and-click UI that records each step as M code, and loads clean data into a table or data model.

### Core Workflow

```
Data Tab → Get Data → From File/Database/Web
→ Power Query Editor opens
→ Apply transformations (each step recorded)
→ Close & Load → data lands in worksheet or Data Model
```

### Key Transformations

| Operation | Power Query Step | When to Use |
|---|---|---|
| Remove columns | Remove Columns | Drop irrelevant fields |
| Filter rows | Filter Rows | Remove header rows, filter dates |
| Change type | Change Type | Fix string → number/date |
| Split column | Split Column by Delimiter | "First Last" → First, Last |
| Merge queries | Merge Queries (SQL join) | Join two data sources |
| Append queries | Append Queries (UNION ALL) | Stack monthly files |
| Group by | Group By | Aggregate before loading |
| Unpivot | Unpivot Columns | Wide → Long (tidy format) |

### M Language Example

```m
// Power Query M formula — transforming a revenue table
let
    Source = Csv.Document(File.Contents("C:\data\sales.csv"),
                         [Delimiter=",", Encoding=1252]),
    PromotedHeaders = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    ChangedTypes = Table.TransformColumnTypes(PromotedHeaders, {
        {"date", type date},
        {"revenue", type number},
        {"units", Int64.Type}
    }),
    FilteredRows = Table.SelectRows(ChangedTypes,
                                   each [revenue] > 0),
    AddedMonth = Table.AddColumn(FilteredRows, "month",
                                 each Date.ToText([date], "yyyy-MM"), type text)
in
    AddedMonth
```

> [!tip] Refresh All
> Once set up, Power Query refreshes with one click (Data → Refresh All), re-running all steps on updated source data. This turns monthly reporting from hours of copy-paste to seconds.

---

## Pivot Tables

Pivot tables aggregate and cross-tabulate data interactively.

### Anatomy

```
Rows: dimension being sliced vertically    (e.g., Region)
Columns: dimension being sliced across     (e.g., Product)
Values: metric being aggregated            (e.g., SUM of Revenue)
Filters: global filter applied to pivot    (e.g., Year = 2025)
```

### Calculated Fields

Right-click in Values area → Calculated Field:
```
= Revenue / Units            // average price per unit
= Profit / Revenue           // profit margin
```

### Slicers and Timelines

Insert → Slicer: click to filter the pivot table visually.
Insert → Timeline: date-range filter on date columns.
Multiple pivot tables can share a single slicer via Report Connections.

---

## Lookup Functions

### VLOOKUP (Legacy — Avoid)

```excel
=VLOOKUP(lookup_value, table_array, col_index, [range_lookup])
=VLOOKUP(A2, Products!$A:$D, 3, FALSE)   // exact match, 3rd column
```

Problems: breaks when columns are inserted; can only look right; case-insensitive.

### INDEX + MATCH (Robust, Still Common)

```excel
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
=INDEX(Products!$C:$C, MATCH(A2, Products!$A:$A, 0))
```

Benefits: looks left or right; dynamic column reference; faster on large datasets.

### XLOOKUP (Excel 365 — Best)

```excel
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])
=XLOOKUP(A2, Products[ID], Products[Price], "Not Found", 0)
```

Benefits: returns multiple columns, handles not-found gracefully, supports wildcards, no column index numbers.

---

## Dynamic Array Functions (Excel 365)

These functions spill results into adjacent cells automatically:

```excel
// FILTER — return rows matching condition
=FILTER(A2:C100, C2:C100="Active", "No results")

// SORT and SORTBY
=SORT(A2:C100, 3, -1)                // sort by column 3, descending
=SORTBY(A2:C100, C2:C100, -1)        // sort A:C by column C descending

// UNIQUE — deduplicate a list
=UNIQUE(B2:B100)

// SEQUENCE — generate number sequence
=SEQUENCE(12, 1, 1, 1)               // months 1-12

// Combine: Top 5 active customers by revenue
=TAKE(SORT(FILTER(A2:C100, D2:D100="Active"), 3, -1), 5)
```

---

## Conditional Logic and Aggregation Functions

```excel
// SUMIF / COUNTIF / AVERAGEIF — single condition
=SUMIF(A:A, "East", C:C)             // sum C where A = "East"
=COUNTIF(B:B, ">1000")

// SUMIFS / COUNTIFS — multiple conditions
=SUMIFS(C:C, A:A, "East", B:B, "Q1")

// IFS (multiple conditions, cleaner than nested IF)
=IFS(A2>90, "A", A2>80, "B", A2>70, "C", TRUE, "F")

// SWITCH (cleaner than nested IF for exact matches)
=SWITCH(A2, "US", "Americas", "UK", "EMEA", "JP", "APAC", "Other")
```

---

## Text and Date Functions

```excel
// Text
=TEXT(A2, "yyyy-MM-dd")              // format date as string
=VALUE("$1,234")                     // string → number: 1234
=TRIM(A2)                            // remove extra spaces
=PROPER(A2)                          // Title Case
=LEFT(A2, 3)                         // first 3 characters
=MID(A2, 5, 3)                       // 3 chars starting at position 5
=CONCATENATE(A2, " ", B2)            // or: =A2&" "&B2

// Dates
=TODAY()                             // today's date
=EOMONTH(A2, 0)                      // last day of month
=NETWORKDAYS(A2, B2)                 // working days between dates
=DATEDIF(A2, TODAY(), "M")           // months between date and today
=WEEKNUM(A2)                         // week number of year
```

---

## Power Pivot and DAX Basics

Power Pivot extends Excel with an in-memory columnstore engine. You can load multiple tables, define relationships, and write DAX measures.

```dax
// Total Revenue (measure)
Total Revenue = SUM(Sales[Revenue])

// YTD Revenue
Revenue YTD = CALCULATE(
    SUM(Sales[Revenue]),
    DATESYTD(Calendar[Date])
)

// Revenue vs Prior Year
Revenue PY = CALCULATE(
    [Total Revenue],
    SAMEPERIODLASTYEAR(Calendar[Date])
)

// YoY Growth %
Revenue YoY % = DIVIDE([Total Revenue] - [Revenue PY], [Revenue PY])

// Customer count (distinct)
Customer Count = DISTINCTCOUNT(Sales[CustomerID])
```

---

## Chart Best Practices

| Chart Type | Best For | Avoid When |
|---|---|---|
| Bar / Column | Comparing categories | More than ~10 categories |
| Line | Trends over time | Categorical comparisons |
| Scatter | Correlation between two variables | Showing composition |
| Pie / Donut | Part-to-whole (≤5 segments) | Many segments or similar values |
| Histogram | Distribution of a continuous variable | Categorical data |
| Box Plot | Distribution + outliers across groups | Simple before/after |
| Waterfall | Contribution to change | Cumulative totals |
| Heatmap | Two-dimensional patterns (e.g., day × hour) | Sparse data |

**Principles:**
- Start y-axis at zero for bar charts (truncating exaggerates differences)
- Use color to encode meaning, not decoration (red = bad, green = good)
- Label data points when fewer than 8; use interactive tooltips for more
- One chart = one message (write the title as the insight, not the description)

---

## Common Pitfalls

- **Volatile VLOOKUP** — recalculates on every worksheet change, slowing large workbooks. Use INDEX/MATCH or XLOOKUP with structured table references.
- **Hardcoded filter values** — building a report that works for "2025" by hardcoding the year. Use `=YEAR(TODAY())` and dynamic references so the report self-updates.
- **Pivot table not refreshing** — pivot tables don't auto-refresh when source data changes. Use `VBA: ActiveWorkbook.RefreshAll` on open, or remind stakeholders.
- **Broken Power Query on path change** — PQ stores the file path literally. Use parameters for file paths, or load from SharePoint/OneDrive URLs for portability.
- **Implicit data type in SUMIF** — `=SUMIF(A:A, 2025, C:C)` may not match dates stored as text "2025". Always ensure types match between lookup and data column.

---

## Review Questions

1. **Practical:** You receive a new CSV sales file every month with columns: Date, Region, Product, Units, Revenue. Design a Power Query setup so the monthly report auto-refreshes when you drop the new file in a folder. What M functions and folder connector features would you use?

2. **Scenario:** A stakeholder's pivot table shows total revenue by product but they want "revenue as % of total" next to each row. Walk through the exact steps — no formulas needed, this is configurable directly in the pivot table. What are the Show Values As options?

3. **DAX Challenge:** Write a DAX measure called "Rolling 3-Month Revenue" that calculates the sum of the current month plus the two preceding months, using the Calendar table relationship. Test your formula logic with DATESINPERIOD.

---

#DataAnalytics #Excel #GoogleSheets #PowerQuery #PivotTables #DAX #beginner
