---
title: Streamlit Dashboards
aliases:
  - Streamlit
  - Streamlit Data App
  - Python Dashboard
tags: [DataAnalytics, Python, Streamlit, Dashboard, DataApp]
domain: Data Analytics
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Data_Analytics_Overview]]"
  - "[[Data_Visualization_Python]]"
  - "[[Pandas_Advanced_Analytics]]"
  - "[[Analytics_Engineering_Python]]"
  - "[[Power_BI_Fundamentals]]"
status: complete
---

# Streamlit Dashboards

> [!abstract] TL;DR
> Streamlit turns Python data scripts into interactive web apps with minimal boilerplate — no HTML, CSS, or JavaScript required. A data analyst can build a production-quality dashboard with filters, charts, and SQL query results in under 100 lines of Python. It is the fastest path from a Jupyter notebook to a shareable data product, especially for internal tooling and analytics apps that need more interactivity than a BI tool allows.

---

## Core Rendering Functions

```python
import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(
    page_title="Revenue Dashboard",
    page_icon="📊",
    layout="wide",       # "centered" or "wide"
    initial_sidebar_state="expanded"
)

# ── Text and layout ────────────────────────────────────────
st.title("Q2 Revenue Dashboard")
st.header("Executive Summary")
st.subheader("Regional Breakdown")
st.markdown("**Key insight:** West region is underperforming vs target by **12%**.")
st.divider()

# ── Data display ───────────────────────────────────────────
df = pd.read_csv("revenue.csv")
st.dataframe(df, use_container_width=True, height=300)
st.table(df.head(5))                    # static table (no scroll)

# ── Metrics (KPI tiles) ───────────────────────────────────
col1, col2, col3 = st.columns(3)
col1.metric("Total Revenue", "$2.1M",  "+8.3% vs LY")
col2.metric("Active Users",  "14,230", "+1,204 MoM")
col3.metric("Churn Rate",    "3.2%",   "-0.4pp", delta_color="inverse")
```

---

## Input Widgets

```python
# ── Sidebar for filters ────────────────────────────────────
with st.sidebar:
    st.header("Filters")

    region = st.selectbox(
        "Region",
        options=["All"] + sorted(df["region"].unique().tolist()),
        index=0
    )

    date_range = st.date_input(
        "Date Range",
        value=(df["date"].min(), df["date"].max()),
        min_value=df["date"].min(),
        max_value=df["date"].max()
    )

    tiers = st.multiselect(
        "Customer Tier",
        options=df["tier"].unique().tolist(),
        default=df["tier"].unique().tolist()
    )

    min_rev = st.slider(
        "Minimum Revenue",
        min_value=0,
        max_value=int(df["revenue"].max()),
        value=0,
        step=100
    )

# ── Apply filters ──────────────────────────────────────────
filtered = df.copy()
if region != "All":
    filtered = filtered[filtered["region"] == region]
if tiers:
    filtered = filtered[filtered["tier"].isin(tiers)]
filtered = filtered[filtered["revenue"] >= min_rev]
filtered = filtered[
    (filtered["date"] >= str(date_range[0])) &
    (filtered["date"] <= str(date_range[1]))
]

# ── File upload ────────────────────────────────────────────
uploaded = st.file_uploader("Upload CSV", type=["csv"])
if uploaded:
    custom_df = pd.read_csv(uploaded)
    st.dataframe(custom_df)
```

---

## Caching Expensive Computations

```python
# @st.cache_data: cache function return values by arguments
# Re-runs only when arguments change or TTL expires
@st.cache_data(ttl=600)   # cache for 10 minutes
def load_data(file_path: str) -> pd.DataFrame:
    df = pd.read_parquet(file_path)
    df["date"] = pd.to_datetime(df["date"])
    return df

# @st.cache_resource: singleton resources (DB connections, ML models)
# Created once, shared across all users and sessions
@st.cache_resource
def get_db_engine():
    from sqlalchemy import create_engine
    return create_engine("postgresql://user:pass@host/db")

@st.cache_data
def run_query(sql: str) -> pd.DataFrame:
    engine = get_db_engine()
    return pd.read_sql(sql, engine)

# Usage
df = load_data("data/revenue.parquet")
summary = run_query("SELECT region, SUM(revenue) FROM orders GROUP BY 1")
```

---

## Session State and Interactivity

```python
# st.session_state persists across reruns (like React state)
if "page_num" not in st.session_state:
    st.session_state.page_num = 1

col1, col2, col3 = st.columns([1, 3, 1])
with col1:
    if st.button("← Prev") and st.session_state.page_num > 1:
        st.session_state.page_num -= 1
with col3:
    if st.button("Next →"):
        st.session_state.page_num += 1

page_size = 20
start = (st.session_state.page_num - 1) * page_size
st.dataframe(df.iloc[start:start + page_size])

# Forms — batch inputs, avoid rerun on every keystroke
with st.form("filter_form"):
    name_filter = st.text_input("Customer name contains")
    min_rev = st.number_input("Min revenue", min_value=0)
    submitted = st.form_submit_button("Apply Filters")

if submitted:
    results = df[
        df["name"].str.contains(name_filter, case=False, na=False) &
        (df["revenue"] >= min_rev)
    ]
    st.dataframe(results)
```

---

## Layout: Columns, Tabs, Expanders

```python
# ── Columns ────────────────────────────────────────────────
col1, col2 = st.columns([2, 1])  # 2:1 width ratio
with col1:
    fig = px.line(filtered, x="date", y="revenue", color="region")
    st.plotly_chart(fig, use_container_width=True)
with col2:
    st.dataframe(filtered.groupby("region")["revenue"].sum().reset_index())

# ── Tabs ───────────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs(["Overview", "By Region", "Raw Data"])
with tab1:
    st.plotly_chart(px.bar(monthly, x="month", y="revenue"))
with tab2:
    st.plotly_chart(px.bar(regional, x="region", y="revenue", color="tier"))
with tab3:
    st.dataframe(df)

# ── Expander ───────────────────────────────────────────────
with st.expander("Show SQL Query"):
    st.code("""
    SELECT region, SUM(revenue) AS total
    FROM orders
    WHERE order_date >= '2025-01-01'
    GROUP BY 1
    ORDER BY 2 DESC
    """, language="sql")
```

---

## Integrating with SQL Databases

```python
from sqlalchemy import create_engine, text

@st.cache_resource
def get_engine():
    conn_str = st.secrets["database"]["url"]  # from .streamlit/secrets.toml
    return create_engine(conn_str)

@st.cache_data(ttl=300)
def get_revenue_data(start_date: str, end_date: str) -> pd.DataFrame:
    engine = get_engine()
    query = text("""
        SELECT
            DATE_TRUNC('month', order_date) AS month,
            region,
            SUM(revenue) AS total_revenue,
            COUNT(DISTINCT customer_id) AS customers
        FROM orders
        WHERE order_date BETWEEN :start AND :end
        GROUP BY 1, 2
    """)
    with engine.connect() as conn:
        return pd.read_sql(query, conn, params={"start": start_date, "end": end_date})
```

Credentials stored in `.streamlit/secrets.toml`:
```toml
[database]
url = "postgresql://user:password@host:5432/mydb"
```

---

## Multi-Page Apps

```
app/
├── app.py              ← entry point (st.navigation)
├── pages/
│   ├── 1_Overview.py
│   ├── 2_Regional.py
│   └── 3_Customer.py
└── utils/
    ├── data.py
    └── charts.py
```

```python
# app.py
import streamlit as st

overview = st.Page("pages/1_Overview.py", title="Overview", icon="🏠")
regional = st.Page("pages/2_Regional.py", title="Regional", icon="🗺️")
customer = st.Page("pages/3_Customer.py", title="Customer", icon="👥")

pg = st.navigation([overview, regional, customer])
pg.run()
```

---

## Deploying to Streamlit Community Cloud

1. Push app to public GitHub repo
2. Go to share.streamlit.io → New app
3. Connect GitHub repo, select `app.py`, choose Python version
4. Add secrets in the Streamlit dashboard UI (not in the repo)
5. App is live at `https://username-reponame-appname.streamlit.app`

---

## Common Pitfalls

- **Rerunning on every widget interaction** — Streamlit reruns the entire script on every widget change. Expensive operations without `@st.cache_data` re-execute constantly. Cache anything that doesn't depend on widget state.
- **Session state missing after page change** — in multi-page apps, `st.session_state` persists across pages only if the key was set before navigation. Initialize keys in a shared `utils.py` imported by all pages.
- **Blocking operations** — long-running SQL queries block the app. Use `st.spinner()` for UX feedback, and consider `st.status()` for multi-step operations with progress.
- **Secrets in code** — never hardcode database passwords. Always use `st.secrets` or environment variables.

---

## Review Questions

1. **Architecture:** You're building a Streamlit dashboard that queries a PostgreSQL database. The query takes 8 seconds. Describe how you'd use `@st.cache_data` and `@st.cache_resource` to make the app responsive, and what TTL value you'd set for a near-real-time revenue dashboard.

2. **Feature:** Add a "Download as CSV" button to a filtered DataFrame in Streamlit. What built-in component handles this, and how do you encode the DataFrame for download?

3. **Design:** Your Streamlit app has a date range filter and a region multiselect. When a user changes either filter, you want to update 3 charts AND a summary table simultaneously. Walk through how Streamlit's execution model handles this automatically, and what you need to do to ensure all 4 outputs always reflect the same filter state.

---

#DataAnalytics #Python #Streamlit #Dashboard #DataApp #intermediate
