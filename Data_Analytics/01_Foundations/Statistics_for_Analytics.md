---
title: Statistics for Analytics
aliases:
  - Stats for Analysts
  - Statistical Analysis
  - Hypothesis Testing Analytics
tags: [DataAnalytics, Statistics, HypothesisTesting, ABTesting, Probability]
domain: Data Analytics
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Data_Analytics_Overview]]"
  - "[[Data_Cleaning_and_EDA]]"
  - "[[Analytics_Metrics_and_KPIs]]"
  - "[[SQL_for_Analytics]]"
status: complete
---

# Statistics for Analytics

> [!abstract] TL;DR
> Statistics gives analysts the vocabulary to describe data (descriptive stats), quantify uncertainty (probability distributions), and make defensible decisions from samples (hypothesis testing). A/B testing is the applied crown jewel: it turns "I think this change helped" into "we can say with 95% confidence that this change increased conversion by 2.3 percentage points."

---

## Descriptive Statistics

### Measures of Central Tendency

| Measure | Formula | When to Use |
|---|---|---|
| **Mean** | `sum(x) / n` | Symmetric distributions, no extreme outliers |
| **Median** | Middle value (or avg of two middle) | Skewed data — revenue, page load times |
| **Mode** | Most frequent value | Categorical data, multi-modal distributions |

```python
import pandas as pd
import numpy as np

revenue = pd.Series([100, 120, 115, 130, 5000])  # one high-value customer

print(f"Mean:   {revenue.mean():.1f}")    # 1093.0 — misleading!
print(f"Median: {revenue.median():.1f}")  # 120.0  — representative
print(f"Mode:   {revenue.mode()[0]}")     # 100    (first mode)
```

### Measures of Spread

```python
print(f"Variance:    {revenue.var():.1f}")   # average squared deviation
print(f"Std Dev:     {revenue.std():.1f}")   # same units as original
print(f"Range:       {revenue.max() - revenue.min()}")
print(f"IQR:         {revenue.quantile(0.75) - revenue.quantile(0.25):.1f}")
print(f"Skewness:    {revenue.skew():.2f}")  # >0 = right tail; <0 = left tail
print(f"Kurtosis:    {revenue.kurtosis():.2f}")  # >3 = heavy tails vs normal
```

**Percentiles** are underused in analytics dashboards:
- P50 (median) — typical user experience
- P90 — what 90% of users experience or better
- P99 — worst 1% of cases (SLA breaches, fraud outliers)

```python
# Percentile distribution — more informative than mean alone
revenue.describe(percentiles=[.25, .50, .75, .90, .95, .99])
```

---

## Probability Distributions in Practice

### Normal Distribution
- **When you see it:** heights, measurement errors, aggregated averages (CLT)
- **Key parameters:** μ (mean), σ (std dev)
- **Rule of thumb:** 68% of data within 1σ, 95% within 2σ, 99.7% within 3σ
- **Analytics use:** z-scores for anomaly detection, confidence intervals

### Binomial Distribution
- **When you see it:** conversion rates (converted or not), click-through, pass/fail
- **Key parameters:** n (trials), p (probability of success)
- **Analytics use:** A/B testing with binary outcomes (did user convert?)

### Poisson Distribution
- **When you see it:** count of events in fixed time — support tickets per hour, orders per day
- **Key parameter:** λ (average rate)
- **Analytics use:** capacity planning, anomaly detection for event counts

```python
from scipy import stats

# Is this day's order count (150 orders) anomalous given avg=120?
lambda_avg = 120
prob_150_or_more = 1 - stats.poisson.cdf(149, lambda_avg)
print(f"P(orders >= 150 | avg=120) = {prob_150_or_more:.4f}")
# If < 0.05, statistically unusual
```

---

## Hypothesis Testing

**The framework:**

```
1. H₀ (Null): no effect / no difference (default assumption)
2. H₁ (Alt):  there IS an effect / difference (what you're testing for)
3. Choose α = 0.05 (risk of false positive you'll tolerate)
4. Collect data, compute test statistic
5. Compute p-value = P(data this extreme | H₀ is true)
6. If p-value < α → reject H₀; otherwise fail to reject H₀
```

> [!warning] p-value ≠ probability H₁ is true
> p-value is the probability of observing data this extreme *if* the null hypothesis were true. It does NOT tell you the probability your hypothesis is correct. A p-value of 0.03 means: "if nothing changed, there's only a 3% chance we'd see a difference this large by random chance."

### Type I and Type II Errors

| | H₀ actually True | H₀ actually False |
|---|---|---|
| Reject H₀ | **Type I Error** (false positive, rate = α) | Correct (power = 1-β) |
| Fail to reject H₀ | Correct | **Type II Error** (false negative, rate = β) |

- **Type I (α = 0.05):** You declare a winner, but the difference was random. Cost: ship a bad change.
- **Type II (β):** Real effect exists but you missed it. Cost: miss a winning feature. Common remedy: increase sample size.

---

## A/B Testing

A/B testing is a controlled experiment: randomly assign users to Control (A) or Treatment (B) and measure a primary metric.

### Two-Sample t-Test (Continuous Metrics)

```python
from scipy import stats

control = [10.2, 9.8, 11.1, 10.5, 9.6]   # avg session duration (seconds)
treatment = [11.4, 12.0, 10.9, 11.8, 12.5]

t_stat, p_value = stats.ttest_ind(control, treatment)
print(f"t-statistic: {t_stat:.3f}")
print(f"p-value:     {p_value:.4f}")
print(f"Reject H₀:  {p_value < 0.05}")
```

### Chi-Square Test (Conversion Rates)

```python
# Control: 1000 visitors, 120 conversions (12%)
# Treatment: 1000 visitors, 145 conversions (14.5%)
observed = [[120, 880],   # control: converted, not converted
            [145, 855]]   # treatment: converted, not converted

chi2, p_value, dof, expected = stats.chi2_contingency(observed)
print(f"Chi2: {chi2:.3f}, p-value: {p_value:.4f}")
```

### Sample Size Calculation

Before running the test, calculate how many users you need:

```python
from statsmodels.stats.power import TTestIndPower

# Detect a lift from 12% → 14% conversion (MDE = 2pp)
# with 80% power and α = 0.05
baseline = 0.12
mde = 0.02          # minimum detectable effect (absolute)
alpha = 0.05
power = 0.80

# Effect size (Cohen's h for proportions)
p1 = baseline
p2 = baseline + mde
effect_size = 2 * (np.arcsin(np.sqrt(p2)) - np.arcsin(np.sqrt(p1)))

analysis = TTestIndPower()
n = analysis.solve_power(effect_size=effect_size, alpha=alpha, power=power)
print(f"Required sample per variant: {int(np.ceil(n)):,}")
```

---

## Correlation vs Causation

```python
import matplotlib.pyplot as plt

# Pearson correlation — linear relationship strength (-1 to 1)
corr = df[["feature_a", "feature_b"]].corr()

# Spearman correlation — monotonic relationship (rank-based, handles outliers)
spearman_corr = df[["feature_a", "feature_b"]].corr(method="spearman")
```

| Correlation | Meaning |
|---|---|
| 0.9–1.0 | Very strong positive |
| 0.5–0.9 | Moderate positive |
| 0.0–0.5 | Weak positive |
| Negative | Inverse relationship |

**Correlation ≠ Causation.** Ice cream sales correlate with drownings (both driven by summer heat). Always ask: "Is there a lurking confounding variable?"

---

## Simpson's Paradox

A trend present in each subgroup can *reverse* when groups are combined. Classic example: a drug appears more effective overall, but when you break down by disease severity, it's less effective for every subgroup (the groups have different sizes).

```
                  Overall    Mild cases    Severe cases
Treatment group:   73%         93%            73%
Control group:     83%         87%            69%

Overall rate is misleading! Treatment had proportionally more severe cases.
→ Always break analysis by key segments before reporting overall numbers.
```

---

## Central Limit Theorem (Practical Implications)

The CLT states that the sampling distribution of the sample mean approaches normal as n → ∞, regardless of the population distribution. In practice with n ≥ 30:

- You can use t-tests even when the underlying metric (revenue per user) is not normally distributed
- Confidence intervals for means are valid
- This is why A/B tests on mean revenue work even though individual revenue is highly skewed

```python
# 95% confidence interval for the mean
import scipy.stats as stats
n = len(sample_data)
mean = np.mean(sample_data)
se = stats.sem(sample_data)  # standard error of the mean

ci_lower, ci_upper = stats.t.interval(0.95, df=n-1, loc=mean, scale=se)
print(f"95% CI: ({ci_lower:.2f}, {ci_upper:.2f})")
```

---

## Common Pitfalls

- **Peeking at results too early** — checking significance repeatedly as data comes in inflates Type I error rate (p-hacking). Commit to a fixed sample size before starting.
- **Multiple comparisons** — testing 20 variants gives you a ~64% chance of one false positive at α=0.05. Apply Bonferroni correction (`α/n_tests`) or use False Discovery Rate (FDR).
- **Underpowered tests** — small samples declare "no effect" when the effect is real. Calculate power before the experiment, not after.
- **Heterogeneous variance** — `ttest_ind` with `equal_var=True` (Student's t) assumes same variance. Use Welch's t-test (`equal_var=False`) — it works in both cases.
- **Survivorship bias** — analyzing only retained/converted users excludes dropped users, biasing distributions upward.

---

## Review Questions

1. **Conceptual:** Your data has 1 million user sessions and the average session duration is 4.2 minutes with std dev = 8.1 minutes. The distribution is heavily right-skewed. A product manager asks "what is the typical session length?" What number do you report and why? Is it safe to use a t-test to compare means between two groups here?

2. **Scenario:** You ran an A/B test for 2 weeks. The treatment shows +3% conversion vs control, with p-value = 0.08. Your manager says "it's close enough, ship it." Walk through the statistical reasoning for why you should or should not ship, and what you would propose next.

3. **Trade-off:** You observe that users who use Feature X have 40% higher LTV. Should you make Feature X more prominent? What analysis would you run to determine whether this is a causal relationship or selection bias? What would an A/B test design look like?

---

#DataAnalytics #Statistics #HypothesisTesting #ABTesting #Probability #intermediate
