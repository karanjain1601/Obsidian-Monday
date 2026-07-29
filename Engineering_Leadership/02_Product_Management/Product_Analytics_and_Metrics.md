---
title: Product Analytics and Metrics
aliases: [AARRR Funnel, North Star Metric, Cohort Analysis, A/B Testing, Product Metrics]
tags: [Engineering, Leadership, Management, ProductAnalytics, Metrics, AARRR, NorthStar, ABTesting]
domain: Engineering Leadership
difficulty: Advanced
created: 2026-07-29
related: [Product_Manager_Overview, Product_Strategy, Product_Discovery, Engineering_Metrics_and_Health]
status: complete
---

# Product Analytics and Metrics

> [!abstract] TL;DR
> Product metrics tell you whether you are building the right things and whether they are working. The AARRR funnel maps the customer journey; the North Star Metric is the single number that predicts long-term retention; cohort analysis reveals retention dynamics that aggregate metrics obscure; A/B testing provides causal evidence that correlation cannot.

## Product Metrics Framework: AARRR Funnel (Dave McClure)

The AARRR framework (Pirate Metrics) maps the five stages of the customer lifecycle:

| Stage | Question | Example Metric |
|---|---|---|
| **Acquisition** | How do users find us? | Organic traffic, CAC (Customer Acquisition Cost), sign-up conversion rate |
| **Activation** | Do new users have a good first experience? | % users who complete onboarding, time-to-first-value |
| **Retention** | Do users come back? | D7/D30/D90 retention, churn rate, DAU/MAU ratio |
| **Revenue** | Do users pay? | MRR, ARPU, LTV, conversion from free to paid |
| **Referral** | Do users tell others? | NPS, viral coefficient (K-factor), referral conversion rate |

### AARRR as a Diagnostic Tool
Identify which stage is the biggest drag on growth:
- High acquisition, low activation → onboarding problem
- High activation, low retention → core value is not sticky; or wrong users acquired
- High retention, low revenue → pricing or conversion problem
- High revenue, low referral → product is good but not shareable; NPS < 40

## North Star Metric

The North Star Metric (NSM) is the single metric that best captures the core value your product delivers to customers. It must:
- **Predict long-term retention** (not just engagement)
- **Reflect actual value delivered** (not a vanity metric like page views)
- **Be actionable** — the team can influence it directly

### North Star Examples by Company Type

| Company / Type | North Star Metric |
|---|---|
| Spotify | Time spent listening per user per month |
| Airbnb | Nights booked |
| Slack | Messages sent per organization per day |
| LinkedIn (Talent) | Qualified applications submitted |
| E-commerce | Number of purchases per active user per month |

### NSM Anti-Patterns
- **Revenue as NSM:** Revenue is a lagging output; it cannot tell you where to invest
- **Vanity metrics:** Page views, registered users, app downloads — easy to inflate, disconnected from value
- **Multiple North Stars:** Defeats the purpose; creates organizational confusion about priorities

### The NSM Tree
The NSM is the trunk. Below it are the **input metrics** (drivers) that move the NSM:

```
North Star: Nights Booked
├── Input: Number of listings that match search queries
├── Input: Listing quality (photos, reviews, response rate)
├── Input: Booking conversion rate
└── Input: Repeat booking rate (returning guests)
```

Work on input metrics; watch the NSM move.

## Input vs. Output Metrics

| Type | Description | Example | Actionability |
|---|---|---|---|
| **Output (Lagging)** | The outcome you want | Revenue, retention, NPS | Cannot be directly influenced; confirms the outcome |
| **Input (Leading)** | Drivers that predict the output | Activation rate, feature adoption | Directly actionable; measure weekly |
| **Guardrail** | What you must not harm while improving inputs | Latency, error rate, email unsubscribe rate | Alert-based; monitored passively |

## Funnel Analysis

A funnel maps the sequential steps users take toward a conversion goal. Drop-off at each step reveals friction.

### Funnel Template

| Step | Users Entering | Users Completing | Conversion Rate | Benchmark |
|---|---|---|---|---|
| Visited pricing page | 10,000 | — | 100% | — |
| Started free trial | 3,200 | — | 32% | Industry: 20–40% |
| Completed onboarding | 1,100 | — | 34% | Target: 50%+ |
| Used core feature (Day 1) | 480 | — | 44% | Target: 60%+ |
| Converted to paid (Day 14) | 96 | — | 20% | Target: 25%+ |

### Diagnosing Funnel Drop-off
- Quantitative: Where is the biggest absolute and relative drop?
- Qualitative: Session recordings (FullStory, Hotjar) at the drop-off step reveal specific friction
- Survey: "Why did you not complete X?" with a single-question in-product prompt

## Cohort Analysis for Retention

Cohort analysis groups users by the time they joined and tracks their behavior over time. It reveals whether retention is improving or deteriorating — something aggregate retention rates hide.

### Reading a Cohort Retention Table

```
         W0    W1    W2    W4    W8    W12
Jan cohort 100%  62%   45%   38%   35%   34% ← Flattened: good PMF signal
Feb cohort 100%  58%   40%   30%   22%   15% ← Still declining: PMF problem
Mar cohort 100%  70%   55%   50%   48%   47% ← Improving: recent product changes working
```

### What Cohort Analysis Reveals
- Whether retention improvements from new features are durable
- Whether newer cohorts are better or worse than older ones (product quality trend)
- The "natural retention floor" — the level at which churn stabilizes for engaged users

## A/B Testing for PMs

### A/B Testing Mental Model
An A/B test is a randomized controlled experiment. Group A gets the control (current state). Group B gets the treatment (new variant). Statistical comparison tells us whether the difference is real or noise.

### Hypothesis Template
```
We believe that [change]
Will cause [metric] to [increase/decrease] by [target %]
Because [reasoning based on discovery/data].
We will know this when we see [specific measurement] 
after running the test for [minimum duration].
```

### Minimum Detectable Effect (MDE)
Before running a test, decide the smallest change worth detecting. A 0.1% conversion improvement on a trillion-dollar business matters. On a product with 1,000 MAU, you likely cannot detect it with statistical rigor and should use qualitative methods instead.

### Test Duration Calculation
```
Required Sample Size = f(baseline rate, MDE, significance level, statistical power)
Test Duration = Required Sample Size / Daily Traffic
```

Rule of thumb: run tests for at least 1–2 full business cycles (avoid Monday-heavy bias). Stop tests early only under pre-defined stopping rules, never because the numbers "look good enough."

### Results Interpretation

| Result | What It Means |
|---|---|
| p < 0.05, positive effect | Variant wins — with 95% confidence, the result is not noise. Consider rollout. |
| p < 0.05, negative effect | Variant hurts — ship nothing; investigate why |
| p ≥ 0.05 | No statistically significant result — variant is not clearly better or worse |
| Guardrail metric degraded | Do not ship even if primary metric improved |

### A/B Testing Anti-Patterns
- **Peeking early:** Checking results before the minimum duration and stopping when "significant" — inflates false positive rate dramatically
- **Running too many tests simultaneously** without segmentation — creates interaction effects
- **Testing the wrong thing:** A/B testing solutions before discovering the problem
- **Ignoring segment analysis:** Overall result may hide that the test harmed one user segment while helping another

## Qualitative + Quantitative Triangulation

Neither data alone nor user interviews alone are sufficient. Effective PMs triangulate:

| Signal | Source | Tells You |
|---|---|---|
| Drop-off in funnel | Amplitude/Mixpanel | Where the problem is |
| Session recording | FullStory/Hotjar | What users do at the problem step |
| User interview | Direct conversation | Why they behave that way |
| Survey | In-product or email | How widespread the problem is |

The quantitative data tells you where and how much. The qualitative data tells you why. You need both to design a good solution.

## Analytics Tools Reference

| Tool | Category | Best For |
|---|---|---|
| **Amplitude** | Product analytics | Behavioral analysis, cohort analysis, funnel analysis, retention |
| **Mixpanel** | Product analytics | Event-based tracking, A/B testing, user segmentation |
| **Heap** | Product analytics | Auto-capture events (no pre-instrumentation required) |
| **Looker** | BI / data exploration | SQL-based custom queries, dashboards from data warehouse |
| **FullStory** | Session recording | Qualitative UX analysis, rage clicks, session replays |
| **Hotjar** | Session recording | Heatmaps, scroll maps, lightweight session replays |
| **Optimizely** | A/B testing | Full-featured experimentation platform, feature flags |

## Common Pitfalls

- Tracking many metrics without a North Star — the team optimizes for local maxima with no strategic alignment
- Reporting on DAU/MAU as "engagement" when it is actually just traffic — engagement requires taking an action that reflects value
- Calling an A/B test after seeing a positive result, before the minimum duration — this is p-hacking with extra steps
- Using cohort analysis but not reading the long tail — week 12 and week 24 tell you whether PMF is real or temporary
- Measuring only the North Star and ignoring guardrail metrics — you can grow the NSM by degrading user experience in ways that hurt you six months later

## Review Questions

1. Your product's DAU has been flat for three months, but MRR is growing. What does this tell you, and what would you investigate next using the AARRR framework?
2. A PM proposes using "number of sign-ups" as the North Star Metric. What is wrong with this, and how would you help them find a better NSM?
3. Your A/B test shows variant B has a 12% improvement in checkout conversion at p = 0.03 after 5 days. The plan was to run for 14 days. Should you ship now? Explain.
4. Design a full measurement plan for a new "Saved Searches" feature: identify the activation metric, the retention metric, the guardrail metric, and one A/B test hypothesis.

#Engineering #Leadership
