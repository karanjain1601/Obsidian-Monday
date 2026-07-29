---
title: Data Visualization with Python
aliases:
  - Python Visualization
  - Matplotlib Seaborn Plotly
  - Data Viz Python
tags: [DataAnalytics, Python, Visualization, Matplotlib, Seaborn, Plotly]
domain: Data Analytics
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Data_Analytics_Overview]]"
  - "[[Pandas_Advanced_Analytics]]"
  - "[[Streamlit_Dashboards]]"
  - "[[Data_Cleaning_and_EDA]]"
  - "[[Statistics_for_Analytics]]"
status: complete
---

# Data Visualization with Python

> [!abstract] TL;DR
> Python has four mature visualization libraries targeting different needs: Matplotlib (full control, publication-quality), Seaborn (statistical charts with beautiful defaults), Plotly (interactive charts for the web), and Altair (declarative grammar-of-graphics). The chart type you choose signals what story you're telling — comparison, distribution, composition, relationship, or change over time. Pick the right chart first, then pick the library.

---

## Chart Selection Guide

| Purpose | Best Charts | Avoid |
|---|---|---|
| **Comparison** (A vs B) | Bar, Grouped bar, Dot plot | 3D bar, Pie |
| **Distribution** | Histogram, KDE, Box, Violin | Line chart |
| **Composition** (parts of whole) | Stacked bar (%), Treemap, Pie (< 5 categories) | Pie with many slices |
| **Relationship** (correlation) | Scatter, Bubble, Heatmap | Pie |
| **Change over time** | Line, Area, Connected scatter | Bar (for many time points) |
| **Ranked list** | Horizontal bar | Vertical bar (long labels) |

---

## Matplotlib — Architecture and Control

Matplotlib uses a two-level API: the Figure (canvas) and Axes (individual plot area).

```python
import matplotlib.pyplot as plt
import numpy as np

# ── Preferred: explicit figure/axes object API ─────────────
fig, axes = plt.subplots(nrows=2, ncols=2, figsize=(12, 8))
fig.suptitle("Analytics Dashboard", fontsize=16, fontweight="bold")

# axes[0,0] — line chart
x = pd.date_range("2025-01-01", periods=12, freq="ME")
axes[0,0].plot(x, monthly_revenue, color="#4a9eff", linewidth=2, marker="o")
axes[0,0].set_title("Monthly Revenue")
axes[0,0].set_ylabel("Revenue ($)")
axes[0,0].tick_params(axis="x", rotation=45)

# axes[0,1] — bar chart
categories = ["Q1", "Q2", "Q3", "Q4"]
values = [120, 145, 132, 168]
axes[0,1].bar(categories, values, color="#51cf66", edgecolor="white")
axes[0,1].set_title("Quarterly Revenue")
axes[0,1].bar_label(axes[0,1].containers[0], fmt="$%.0fk")

# axes[1,0] — histogram
axes[1,0].hist(df["revenue"], bins=30, color="#fd7e14", edgecolor="white", alpha=0.8)
axes[1,0].axvline(df["revenue"].median(), color="red", linestyle="--", label="Median")
axes[1,0].legend()
axes[1,0].set_title("Revenue Distribution")

# axes[1,1] — scatter
axes[1,1].scatter(df["tenure"], df["revenue"], alpha=0.4, c="#6f42c1", s=20)
axes[1,1].set_xlabel("Tenure (months)")
axes[1,1].set_ylabel("Revenue")
axes[1,1].set_title("Tenure vs Revenue")

plt.tight_layout()
plt.savefig("dashboard.png", dpi=150, bbox_inches="tight")
plt.show()
```

---

## Seaborn — Statistical Plots

Seaborn builds on Matplotlib with a high-level API for statistical visualization. It integrates directly with DataFrames.

```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid", palette="muted")  # global theme

# ── Distribution plots ─────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Histogram with KDE overlay
sns.histplot(df["revenue"], kde=True, bins=30, ax=axes[0], color="#4a9eff")

# Box plot — median + IQR + whiskers + outliers
sns.boxplot(x="region", y="revenue", data=df, ax=axes[1], palette="Set2")

# Violin plot — full distribution shape per group
sns.violinplot(x="tier", y="revenue", data=df, ax=axes[2], inner="quartile")

# ── Relationship plots ─────────────────────────────────────
# Scatter with hue and size encoding
sns.scatterplot(
    data=df, x="tenure", y="revenue",
    hue="tier", size="units",          # encode 4 dimensions
    sizes=(20, 200), alpha=0.7
)

# ── Heatmap (correlation matrix) ──────────────────────────
corr_matrix = df[["revenue","tenure","units","age"]].corr()
sns.heatmap(
    corr_matrix,
    annot=True,        # show numbers
    fmt=".2f",
    cmap="coolwarm",   # diverging: blue=negative, red=positive
    center=0,
    square=True,
    linewidths=0.5
)

# ── Pair plot (all pairwise relationships) ─────────────────
sns.pairplot(df[["revenue","tenure","units","age","tier"]],
             hue="tier", diag_kind="kde", plot_kws={"alpha": 0.5})

# ── FacetGrid (small multiples) ───────────────────────────
g = sns.FacetGrid(df, col="region", row="tier", height=3)
g.map(sns.histplot, "revenue", bins=20)
g.add_legend()
```

---

## Plotly — Interactive Charts

Plotly Express (`px`) creates interactive charts in one line, ideal for exploratory analysis and sharing in Jupyter or Streamlit.

```python
import plotly.express as px
import plotly.graph_objects as go

# ── Scatter with rich interactivity ───────────────────────
fig = px.scatter(
    df,
    x="tenure", y="revenue",
    color="tier",
    size="units",
    hover_data=["customer_name", "region"],
    title="Revenue by Tenure and Tier",
    template="plotly_white"
)
fig.update_traces(marker=dict(opacity=0.7))
fig.show()

# ── Line chart with multiple series ───────────────────────
fig = px.line(
    monthly_df,
    x="month", y="revenue",
    color="region",           # one line per region
    title="Monthly Revenue by Region"
)
fig.update_layout(
    hovermode="x unified",    # single tooltip showing all series at x
    legend=dict(orientation="h", y=1.1)
)

# ── Animated bar chart ─────────────────────────────────────
fig = px.bar(
    df_monthly,
    x="product", y="revenue",
    animation_frame="month",  # creates play button
    color="product",
    range_y=[0, df_monthly["revenue"].max() * 1.1]
)

# ── Custom hover template ──────────────────────────────────
fig = go.Figure()
fig.add_trace(go.Scatter(
    x=df["date"], y=df["revenue"],
    mode="lines+markers",
    hovertemplate="<b>%{x|%b %Y}</b><br>Revenue: $%{y:,.0f}<extra></extra>"
))
```

---

## Altair — Grammar of Graphics

Altair uses a declarative JSON-based API (Vega-Lite under the hood) — excellent for producing publication-ready plots and linked/brushed interactive views.

```python
import altair as alt

# ── Basic bar chart ────────────────────────────────────────
chart = alt.Chart(df).mark_bar().encode(
    x=alt.X("region:N", sort="-y"),
    y=alt.Y("sum(revenue):Q"),
    color="tier:N",
    tooltip=["region", "sum(revenue)", "count()"]
).properties(title="Revenue by Region", width=400, height=300)

chart.save("chart.html")  # standalone interactive HTML

# ── Layered: bar + line ────────────────────────────────────
bars = alt.Chart(df_monthly).mark_bar().encode(
    x="month:T", y="revenue:Q"
)
line = alt.Chart(df_monthly).mark_line(color="red").encode(
    x="month:T", y="rolling_avg:Q"
)
(bars + line).properties(title="Revenue with 3-Month MA")

# ── Linked brush (interactive selection) ──────────────────
brush = alt.selection_interval()

scatter = alt.Chart(df).mark_point().encode(
    x="tenure:Q", y="revenue:Q",
    color=alt.condition(brush, "tier:N", alt.value("lightgray"))
).add_params(brush)

histogram = alt.Chart(df).mark_bar().encode(
    x=alt.X("revenue:Q", bin=True),
    y="count()"
).transform_filter(brush)

(scatter | histogram)  # side-by-side with linked brush
```

---

## Color Principles for Analytics

```python
# Sequential: for ordered/quantitative data (low → high)
cmap_sequential = "Blues"     # single hue, light → dark

# Diverging: for data with a meaningful center (e.g., correlation, growth vs decline)
cmap_diverging = "RdBu_r"    # red = negative, blue = positive

# Qualitative: for categorical labels (no order)
palette_categorical = "Set2"  # colorblind-safe, visually distinct

# Colorblind-safe sequential palette
import seaborn as sns
sns.set_palette("colorblind")  # applies globally

# Always test: tools like Viz Palette or Coblis simulate color blindness
```

---

## Common Pitfalls

- **Matplotlib pyplot vs axes** — `plt.title()` sets the title of the *current active* axes, which changes as you create more plots. Always use the explicit `ax.set_title()` form inside functions or loops.
- **Overplotting** — scatter plots with 100k+ points are just a blob. Use `alpha=0.1`, hexbin plots, or `sns.kdeplot(fill=True)` for density.
- **Seaborn figure-level vs axes-level** — `sns.histplot()` is axes-level (takes `ax=`); `sns.displot()` is figure-level (manages its own figure, no `ax=`). Mixing them causes layout issues.
- **Plotly in notebooks vs scripts** — `fig.show()` opens a browser in a script; in Jupyter it renders inline. Set `pio.renderers.default = "notebook"` for consistent behavior.
- **Rainbow colormap (jet)** — jet is misleading (falsely emphasizes yellow-green regions) and inaccessible to colorblind readers. Use `viridis`, `plasma`, or `cividis` for sequential.

---

## Review Questions

1. **Design:** You're presenting quarterly revenue by product and region to the CFO. The data has 4 quarters × 6 products × 4 regions = 96 data points. What chart type(s) would you choose and why? Sketch the chart logic in Plotly/Seaborn code.

2. **Debugging:** Your seaborn heatmap for a correlation matrix shows all cells as one color (no variation visible). What are the two most common causes and how do you fix each?

3. **Interactive:** Build an Altair chart that shows a histogram of daily revenue with a date-range brush selection — selecting a date range in a timeline chart at the bottom should filter the histogram. Describe the Altair selections and transforms needed.

---

#DataAnalytics #Python #Visualization #Matplotlib #Seaborn #Plotly #intermediate
