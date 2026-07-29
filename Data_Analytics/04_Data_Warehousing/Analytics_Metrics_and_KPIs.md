---
title: Analytics Metrics and KPIs
aliases:
  - Metrics Framework
  - KPIs
  - Business Metrics
  - North Star Metric
  - Cohort Analysis
  - Attribution
tags: [DataAnalytics, Metrics, KPIs, CohortAnalysis, Attribution, ABTesting]
domain: Data Analytics
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Data_Analytics_Overview]]"
  - "[[Statistics_for_Analytics]]"
  - "[[SQL_for_Analytics]]"
  - "[[Data_Warehouse_Concepts]]"
  - "[[Looker_and_LookML]]"
status: complete
---

# Analytics Metrics and KPIs

> [!abstract] TL;DR
> Metrics are the language of business analytics. The analyst's job is not to report every number available but to identify the right metrics — the ones that predict outcomes, drive decisions, and align the team. The North Star metric, input vs output metrics, cohort retention, LTV/CAC, and attribution models are the building blocks of every serious product and marketing analytics function.

---

## Metric Frameworks

### North Star Metric

The North Star Metric (NSM) is the single metric that best captures the core value your product delivers to customers. It aligns the entire company.

| Company | North Star Metric |
|---|---|
| Airbnb | Nights booked |
| Spotify | Daily listening time |
| Facebook | Daily Active Users |
| Duolingo | Daily Active Learners |
| Slack | Messages sent per workspace |
| Amazon | Units purchased |

**Properties of a good NSM:**
- Measurable with available data
- Directly tied to customer value (not business value — revenue is an *output*)
- Sensitive to your product decisions
- Understood by non-technical stakeholders

### Input vs Output Metrics

```
Output metrics (lag indicators): tell you what happened
  → Revenue, Profit, Churn Rate, NPS

Input metrics (lead indicators): predict what will happen
  → Feature adoption rate, onboarding completion %, support ticket backlog

Always instrument both: output metrics tell you how you're doing,
input metrics tell you how to improve
```

### Guardrail Metrics

When running an experiment, guardrail metrics prevent optimizing one metric at the expense of another:
- **Primary metric:** Conversion rate (optimize this)
- **Guardrails:** Page load time must not increase > 10%, support ticket rate must not increase > 5%

If a guardrail breaches, do not ship even if the primary metric improved.

---

## Common Business Metrics

### User Engagement

```sql
-- Daily Active Users (DAU): unique users with at least one event today
SELECT event_date, COUNT(DISTINCT user_id) AS dau
FROM events
GROUP BY 1;

-- Monthly Active Users (MAU)
SELECT DATE_TRUNC('month', event_date) AS month,
       COUNT(DISTINCT user_id) AS mau
FROM events
GROUP BY 1;

-- DAU/MAU ratio = "stickiness" (target: > 20% for consumer, > 40% for social)
WITH dau AS (
    SELECT event_date, COUNT(DISTINCT user_id) AS dau FROM events GROUP BY 1
),
mau AS (
    SELECT DATE_TRUNC('month', event_date) AS month,
           COUNT(DISTINCT user_id) AS mau FROM events GROUP BY 1
)
SELECT d.event_date,
       d.dau,
       m.mau,
       ROUND(d.dau * 100.0 / m.mau, 1) AS stickiness_pct
FROM dau d
JOIN mau m ON DATE_TRUNC('month', d.event_date) = m.month;
```

### Retention and Churn

```sql
-- N-day retention: % of Day 0 users still active on Day N
WITH first_day AS (
    SELECT user_id, MIN(event_date) AS day_0
    FROM events
    GROUP BY 1
),
cohort AS (
    SELECT
        f.user_id,
        f.day_0,
        e.event_date,
        DATEDIFF('day', f.day_0, e.event_date) AS days_since_install
    FROM first_day f
    JOIN events e ON f.user_id = e.user_id
)
SELECT
    days_since_install,
    COUNT(DISTINCT user_id) AS retained_users,
    COUNT(DISTINCT CASE WHEN days_since_install = 0 THEN user_id END) OVER ()
        AS day_0_users,
    ROUND(COUNT(DISTINCT user_id) * 100.0 /
          MAX(COUNT(DISTINCT user_id)) OVER (PARTITION BY day_0), 1) AS retention_pct
FROM cohort
WHERE days_since_install <= 30
GROUP BY 1;

-- Monthly churn rate (subscription SaaS)
-- Churn rate = customers lost this month / customers at start of month
SELECT
    month,
    customers_start,
    customers_lost,
    ROUND(customers_lost * 100.0 / customers_start, 2) AS churn_rate_pct,
    ROUND((1 - customers_lost * 1.0 / customers_start) * 100, 2) AS retention_rate_pct
FROM monthly_subscription_metrics;
```

### LTV and CAC

```sql
-- Customer Lifetime Value (LTV)
-- LTV = Average Revenue Per User × Average Lifetime (months)
-- Or: LTV = ARPU / Churn Rate (for subscription)

-- Simple LTV from transaction data
SELECT
    customer_id,
    SUM(revenue) AS actual_ltv,
    MIN(order_date) AS first_order,
    MAX(order_date) AS last_order,
    DATEDIFF('month', MIN(order_date), MAX(order_date)) + 1 AS active_months,
    COUNT(DISTINCT order_id) AS total_orders
FROM orders
GROUP BY 1;

-- Customer Acquisition Cost (CAC)
-- CAC = Total Marketing + Sales Spend / New Customers Acquired
SELECT
    campaign_month,
    SUM(spend) AS total_spend,
    COUNT(DISTINCT new_customer_id) AS new_customers,
    ROUND(SUM(spend) / NULLIF(COUNT(DISTINCT new_customer_id), 0), 2) AS cac
FROM marketing_spend m
JOIN new_customers c ON DATE_TRUNC('month', c.signup_date) = m.campaign_month
GROUP BY 1;

-- LTV:CAC ratio (target: > 3:1)
-- If LTV = $600 and CAC = $150, ratio = 4:1 → healthy
```

### Funnel Metrics and Conversion

```sql
-- Conversion rate at each funnel step
-- (see full funnel SQL in SQL_for_Analytics.md)

-- Key SaaS funnel stages:
-- Visitor → Signup → Activated → Paying → Retained

SELECT
    '1. Visitor → Signup'    AS step,
    ROUND(signups / visitors * 100, 2) AS conversion_pct
UNION ALL
SELECT
    '2. Signup → Activated',
    ROUND(activated / signups * 100, 2)
UNION ALL
SELECT
    '3. Activated → Paying',
    ROUND(paying / activated * 100, 2)
FROM funnel_summary;
```

---

## Cohort Analysis

Cohort analysis groups users by a shared starting event (signup, first purchase) and tracks their behavior over time.

```python
import pandas as pd

# Prepare cohort retention heatmap
events = pd.read_sql(cohort_sql, engine)
events["cohort_month"] = pd.to_datetime(events["cohort_month"]).dt.to_period("M")

# Pivot to retention matrix
pivot = events.pivot_table(
    index="cohort_month",
    columns="months_since_signup",
    values="retention_pct",
    aggfunc="first"
)

# Visualize as heatmap
import seaborn as sns
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(14, 8))
sns.heatmap(
    pivot,
    annot=True, fmt=".0f",
    cmap="Blues",
    linewidths=0.5,
    ax=ax,
    cbar_kws={"label": "Retention %"}
)
ax.set_title("Monthly Cohort Retention (%)")
ax.set_xlabel("Months Since Signup")
ax.set_ylabel("Signup Cohort")
plt.tight_layout()
```

**What to look for in cohort charts:**
- Diagonal band: if the same month shows high across all cohorts → seasonality
- Step down at month 3: onboarding cliff — users who didn't find value by month 3 churn
- Improving bottom rows: new cohorts retaining better than old → product improvement

---

## Attribution Modeling

Attribution assigns credit for conversions to marketing touchpoints.

```
User journey: Search Ad → Email → Paid Social → Direct → Conversion ($100)

First-touch:    Search Ad = $100, all others = $0
Last-touch:     Direct = $100, all others = $0
Linear:         Each = $25
Time-decay:     More credit to recent touches (Direct > Paid Social > Email > Search Ad)
Data-driven:    ML model estimates counterfactual impact per touchpoint
```

```sql
-- Linear attribution SQL
WITH touches AS (
    SELECT
        user_id,
        channel,
        touch_date,
        conversion_value,
        COUNT(*) OVER (PARTITION BY user_id) AS n_touches
    FROM marketing_touches
    WHERE user_id IN (SELECT user_id FROM conversions)
)
SELECT
    channel,
    SUM(conversion_value / n_touches) AS attributed_revenue,
    COUNT(*) AS n_touches
FROM touches
GROUP BY 1
ORDER BY 2 DESC;
```

---

## A/B Test Analysis

Bringing together [[Statistics_for_Analytics]] concepts into a reporting framework:

```python
import pandas as pd
from scipy import stats
import numpy as np

def analyze_ab_test(control: pd.Series, treatment: pd.Series,
                    metric_name: str = "conversion") -> dict:
    """Analyze a binary A/B test metric."""
    n_c = len(control)
    n_t = len(treatment)
    mean_c = control.mean()
    mean_t = treatment.mean()
    lift = (mean_t - mean_c) / mean_c

    # Two-sample t-test
    t_stat, p_value = stats.ttest_ind(control, treatment)

    # 95% confidence interval on the difference
    se_diff = np.sqrt(control.var()/n_c + treatment.var()/n_t)
    ci_lower = (mean_t - mean_c) - 1.96 * se_diff
    ci_upper = (mean_t - mean_c) + 1.96 * se_diff

    return {
        "metric": metric_name,
        "control_mean": round(mean_c, 4),
        "treatment_mean": round(mean_t, 4),
        "lift_pct": round(lift * 100, 2),
        "p_value": round(p_value, 4),
        "significant": p_value < 0.05,
        "ci_95": (round(ci_lower, 4), round(ci_upper, 4)),
        "n_control": n_c,
        "n_treatment": n_t,
        "recommendation": "Ship" if p_value < 0.05 and lift > 0 else "Don't ship"
    }

results = analyze_ab_test(
    df[df["variant"] == "control"]["converted"],
    df[df["variant"] == "treatment"]["converted"],
    "Conversion Rate"
)
print(results)
```

**Common A/B test pitfalls:**
- **Novelty effect** — users interact more with anything new. Run tests long enough to see steady-state behavior (usually 2+ weeks)
- **Network effects** — if users interact with each other, random assignment creates interference. Use cluster-based randomization (by company, city, etc.)
- **Multiple metrics** — testing 10 metrics at α=0.05 gives a 40% chance of one false positive. Pre-register your primary metric

---

## NPS and Qualitative Metrics

```sql
-- Net Promoter Score: (Promoters - Detractors) / Total × 100
-- Promoters: score 9-10; Passives: 7-8; Detractors: 0-6

SELECT
    survey_month,
    COUNT(*) AS total_responses,
    SUM(CASE WHEN score >= 9 THEN 1 ELSE 0 END) AS promoters,
    SUM(CASE WHEN score <= 6 THEN 1 ELSE 0 END) AS detractors,
    ROUND(
        (SUM(CASE WHEN score >= 9 THEN 1 ELSE 0 END) -
         SUM(CASE WHEN score <= 6 THEN 1 ELSE 0 END)) * 100.0 / COUNT(*),
        1
    ) AS nps
FROM survey_responses
GROUP BY 1
ORDER BY 1;
```

---

## Common Pitfalls

- **Vanity metrics in OKRs** — "page views" as an OKR key result sounds measurable but doesn't distinguish between real engagement and bot traffic. Choose metrics tied to customer actions.
- **Ignoring statistical significance for business decisions** — "revenue is up 5% this week!" — but is it statistically significant or random variation? Always report confidence intervals alongside point estimates.
- **Cohort analysis on incomplete cohorts** — if you analyze 3-month retention for a cohort that signed up 2 months ago, they *can't* have 3-month data yet. Filter cohort analysis to only include cohorts old enough to have the period you're measuring.
- **Attribution != causation** — last-touch attribution assigns all value to the final click; this would suggest you should spend all your budget on retargeting and nothing on awareness. Use attribution for budget allocation directionally, not definitively.

---

## Review Questions

1. **Framework:** Your company's North Star Metric is "weekly active teams." The Growth team wants to increase it. Propose three input metrics (leading indicators) the Growth team should track, explain why each is an input to WAT, and describe the SQL or Python code to compute each.

2. **Cohort Analysis:** Looking at your cohort retention table, you notice Month-0 cohorts (users signed up in January 2025) have 45% retention at Month-6, but Month-3 cohorts (March 2025) have only 28% retention at Month-3. What hypotheses would you test, and what analyses would you run to understand if this is a product change, seasonality, or data artifact?

3. **Attribution:** A CMO wants to cut the "organic search" budget because it shows low conversion in last-touch attribution. You believe organic search initiates most high-LTV customer journeys. Design an analysis that demonstrates the full-funnel role of organic search using your event data.

---

#DataAnalytics #Metrics #KPIs #CohortAnalysis #Attribution #ABTesting #intermediate
