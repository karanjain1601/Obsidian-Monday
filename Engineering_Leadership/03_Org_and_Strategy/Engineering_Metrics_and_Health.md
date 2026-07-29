---
title: Engineering Metrics and Health
aliases: [DORA Metrics, SPACE Framework, Developer Experience, Error Budget, Goodhart's Law]
tags: [Engineering, Leadership, Management, Metrics, DORA, SPACE, DeveloperExperience, ErrorBudget]
domain: Engineering Leadership
difficulty: Advanced
created: 2026-07-29
related: [Delivery_and_Execution, Engineering_Manager_Overview, Engineering_Organization_Design, Product_Analytics_and_Metrics]
status: complete
---

# Engineering Metrics and Health

> [!abstract] TL;DR
> Measuring engineering team health requires multiple dimensions: delivery speed (DORA), developer experience (SPACE), and reliability (SLOs). The central danger is Goodhart's Law: any metric that becomes a performance target gets gamed. Use metrics to diagnose and improve systems — never as individual performance metrics or compensation levers.

## DORA Metrics

The DORA (DevOps Research and Assessment) program, run by Google Cloud, identified four metrics that consistently differentiate high-performing engineering teams from low-performing ones across thousands of organizations.

### The Four DORA Metrics

| Metric | Definition | Elite | High | Medium | Low |
|---|---|---|---|---|---|
| **Deployment Frequency** | How often you ship to production | Multiple times/day | 1/day–1/week | 1/week–1/month | < 1/month |
| **Lead Time for Changes** | Time from commit merged to running in production | < 1 hour | 1 day–1 week | 1 week–1 month | > 1 month |
| **Mean Time to Restore (MTTR)** | Time from incident detection to service recovery | < 1 hour | < 1 day | 1 day–1 week | > 1 week |
| **Change Failure Rate** | % of deployments causing a production incident | 0–15% | 16–30% | 16–30% | 46–60% |

### Why DORA Metrics Matter
These four metrics are **outcome metrics**: they measure the effectiveness of the entire software delivery system (people + process + tooling + culture), not any individual's performance. The correlation with business performance is empirically established: elite DORA performers have 2× the organizational performance of low performers on profitability, customer satisfaction, and employee satisfaction.

### DORA Diagnostics

| Problem Signal | Likely Root Cause |
|---|---|
| Low deployment frequency + high lead time | Large batch sizes; too many manual gates; fear of deploying |
| High lead time with normal deployment frequency | Slow CI/CD pipeline; large PR sizes; slow code review |
| High MTTR | Poor observability; unclear runbooks; no deployment rollback |
| High change failure rate | Insufficient test coverage; no staging environment; poor code review |

### Using DORA as an EM
- Measure all four monthly — track trend, not absolute level
- Do not compare teams using DORA — compare a team to its own past performance
- Surface bottlenecks using the diagnostics above; fix the system, not the person
- Treat deployment frequency improvements as a proxy for reducing fear and batch size

## SPACE Framework (Forsgren, Storey, et al.)

SPACE (2021) extends beyond DORA to capture the multidimensional nature of developer productivity. The key insight: no single metric captures productivity; you need coverage across all five dimensions.

| Dimension | What It Measures | Example Metrics |
|---|---|---|
| **Satisfaction** | Developer well-being and fulfillment | Employee NPS (eNPS), survey scores, attrition rate |
| **Performance** | Quality and reliability of output | Change failure rate, production bug rate, SLA attainment |
| **Activity** | Volume of relevant actions | PRs opened/merged, deployments, incidents resolved |
| **Communication** | Collaboration effectiveness | PR review turnaround time, design doc feedback rate |
| **Efficiency** | Flow and uninterrupted work | CI build time, onboarding time, toil hours per week |

**SPACE's key warning:** Activity metrics (Lines of Code, ticket count, PR volume) are the most visible and the most gameable. They are the last dimension you should optimize for, and the first one bad incentives will cause teams to inflate.

## Developer Experience Metrics

Developer experience (DevEx) focuses on removing friction from engineering workflows. Poor DevEx = engineers spend more time waiting and fighting tools than building.

### Key DevEx Metrics

| Metric | Target | What Causes Problems |
|---|---|---|
| **CI build time (p50/p95)** | < 10 min p50 | Slow tests, no parallelism, large monorepo |
| **CI flakiness rate** | < 2% | Timing-sensitive tests, environment instability |
| **Onboarding time to first PR** | < 3 days | Undocumented setup, broken local dev environment |
| **PR cycle time** (open to merge) | < 1 business day | Bottlenecked reviewers, large PR sizes, unclear ownership |
| **Toil hours per engineer per week** | < 4 hours | Manual deployments, manual monitoring, legacy processes |

### DevEx Survey (Quarterly)
Run a short quarterly survey (5–8 questions) covering:
- Tooling satisfaction (1–10)
- "What is the single biggest workflow friction you face?"
- Developer onboarding experience
- Documentation quality
- On-call burden

## Velocity: Relative, Not Absolute

**Velocity** (story points or tickets per sprint) is the most commonly abused engineering metric.

### What Velocity Can Tell You
- Whether a single team's capacity is changing over time (trend, same team, same practices)
- Whether a process change (e.g., switching from 2-week to 1-week sprints) affected throughput

### What Velocity Cannot Tell You
- Whether one team is "more productive" than another (they use different point scales)
- Whether engineers are working efficiently (teams inflate points to look good under pressure)
- Whether the work done was the right work (output, not outcome)

**Safe velocity use:** "Our team's velocity has dropped from 42 to 28 points over the past 6 sprints. What changed?" (diagnostic, internal trend)

**Dangerous velocity use:** "Team B has velocity 65. Why is Team A at 42?" (cross-team comparison that drives inflation)

## Measuring Toil

Toil (Google SRE definition) is work that is:
- **Manual** — done by a human that could be automated
- **Repetitive** — done again and again with no lasting value
- **Automatable** — could be scripted or tooled away
- **Tactical** — reactive, not strategic
- **Scaling with the system** — grows as usage grows, not as the team grows

**Target:** < 50% of an engineer's time on toil. In most teams, this is aspirational.

**Measuring toil:** Ask engineers to track one week of work in a simple log: "Feature work / Toil / Meetings / Other." Aggregate anonymously. The percentage in "Toil" is your baseline.

## Error Budgets and SLOs/SLAs/SLIs

### Definitions

| Term | Definition | Example |
|---|---|---|
| **SLI** (Service Level Indicator) | A quantitative measure of service behavior | Request success rate; p99 latency |
| **SLO** (Service Level Objective) | The target value for an SLI | Success rate ≥ 99.9% over 28-day rolling window |
| **SLA** (Service Level Agreement) | A contractual commitment (often to customers) with consequences for breach | "99.9% uptime; if not, credit applied" |
| **Error Budget** | The allowable amount of unavailability implied by the SLO | 99.9% SLO = 0.1% budget = 43.2 min/month |

### Error Budget Policy

An error budget converts a reliability target into a deployment decision framework:

```
If error budget remaining > 50%: 
  → Ship freely; prioritize new features

If error budget remaining = 10–50%:
  → Slow down; ensure changes have robust testing and rollback

If error budget exhausted (0%):
  → Feature freeze; focus only on reliability improvements until budget recovers
```

The error budget is owned jointly by engineering (operations) and product (feature delivery). When it runs out, product and engineering align on reducing risk — not by assigning blame, but by treating it as a shared budget constraint.

## Engineering All-Hands Health Surveys

Quarterly all-hands health checks should cover:

| Category | Sample Questions |
|---|---|
| Psychological Safety | "I feel comfortable raising concerns to my EM without fear of negative consequences." |
| Career Growth | "I have clarity on what I need to do to reach the next level." |
| Tooling / DevEx | "I can do my best work with the tools available to me." |
| Team Collaboration | "Cross-team dependencies are well-managed and predictable." |
| Process | "Our sprint ceremonies are valuable uses of my time." |

Score on a 1–5 Likert scale. Track trend quarterly. Break down by team, level, and tenure. A team-level aggregate hides individual signals.

## Goodhart's Law: The Central Danger

> "When a measure becomes a target, it ceases to be a good measure." — Charles Goodhart

### Engineering Examples of Goodhart's Law in Action

| Original Metric | What Happens When It Becomes a Target |
|---|---|
| Lines of code | Engineers write verbose, un-refactored code; delete efforts stop |
| Ticket velocity | Points inflated; small tasks broken up artificially |
| PR count | Tiny, low-impact PRs swamp the review queue |
| Test coverage % | Trivial tests added to hit threshold; hard-to-test code avoided |
| Deployment frequency | Trivial "deployments" added to pad the number |

### Goodhart-Resistant Metric Design
- Use **outcome metrics** (user retention, incident MTTR) alongside **activity metrics** — harder to game the combination
- **Never attach compensation or performance ratings directly to a single metric** — this is the most reliable way to destroy its signal quality
- **Rotate the metrics you track** — teams game what is monitored; rotating creates less opportunity for optimization-toward-the-metric
- **Use metrics to diagnose, not judge** — make clear that data is for team improvement discussions, not individual performance evaluations

## Common Pitfalls

- Tracking DORA metrics but not acting on the diagnostics — measurement without improvement is theater
- Using deployment frequency as a happiness metric — teams can deploy trivial changes constantly while important features stagnate
- Running quarterly surveys but never sharing results or taking action — destroys survey participation in subsequent cycles
- Setting an SLO so aggressive that the error budget is consumed in the first week every quarter — SLOs should be achievable; set them from historical data, then tighten gradually
- Measuring velocity without measuring value — a team with high velocity shipping things nobody uses is running fast in the wrong direction

## Review Questions

1. Your team has a deployment frequency of 1 per month and a lead time of 3 weeks. Using DORA diagnostics, identify three root causes to investigate and one action for each.
2. Your VP wants to use story point velocity to compare Team A (fintech backend, 6 engineers) to Team B (mobile app, 4 engineers). Explain why this is invalid and propose an alternative comparison framework.
3. Your SLO is 99.9% availability. In a 30-day month, you have had 55 minutes of downtime. Are you within your error budget? What deployment policy does this imply for the remaining month?
4. A PM proposes giving bonuses to the team based on deployment frequency this quarter. Using Goodhart's Law, predict what will happen and recommend an alternative incentive design.

#Engineering #Leadership
