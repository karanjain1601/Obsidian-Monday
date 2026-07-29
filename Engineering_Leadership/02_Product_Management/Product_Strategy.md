---
title: Product Strategy
aliases: [Product Vision, OKRs, Roadmap Formats, Product-Market Fit, Crossing the Chasm]
tags: [Engineering, Leadership, Management, ProductStrategy, ProductVision, OKR, Roadmap]
domain: Engineering Leadership
difficulty: Advanced
created: 2026-07-29
related: [Product_Manager_Overview, Product_Discovery, Agile_Product_Delivery, Engineering_Metrics_and_Health]
status: complete
---

# Product Strategy

> [!abstract] TL;DR
> Product strategy is the through-line from vision ("where we're going in 3–5 years") to roadmap ("what we build next quarter") to metrics ("how we know it's working"). Without strategy, roadmaps become wish lists. Without a roadmap, strategy stays abstract. The OKR framework bridges them. Product-market fit signals — NPS, the "40% rule," retention curves — tell you whether the strategy is connecting with the market.

## Product Vision

A product vision is an inspiring, aspirational description of the future the product is trying to create. It operates on a 3–5 year horizon and should be company-product aligned: the product vision must be a credible piece of the company's overall mission.

### Characteristics of a Good Product Vision
- **Inspiring:** Motivates the team to solve hard problems
- **Specific enough to guide:** Not "help people work better" (too vague) but "give every small business owner the financial clarity of a Fortune 500 CFO"
- **Stable over time:** Vision should not change every quarter; strategy and roadmap change; vision is the north star
- **Customer-centric:** Describes the world for the customer, not for the company

### Vision Statement Formula
"For [target customer], who struggles with [problem], our product is [category] that [key benefit]. Unlike [alternative], we [differentiator]."

## Product Strategy

Product strategy is the set of choices that make the vision concrete: which markets to focus on, how to differentiate, and what capabilities create a defensible moat.

### The Three Strategic Questions
1. **Where to play:** Which customer segment, geography, or use case to focus on
2. **How to win:** What differentiation makes customers choose you over alternatives
3. **What moat:** Why winning compounds — network effects, data advantages, switching costs, brand

### Porter's Five Forces (Competitive Strategy)

| Force | Key Question | High Force = Bad For Incumbents |
|---|---|---|
| **Threat of new entrants** | How easy is it to enter this market? | Low barriers → constant new competition |
| **Threat of substitutes** | Can customers solve the problem another way? | Good substitutes cap pricing power |
| **Bargaining power of buyers** | How much leverage do customers have? | Large, concentrated buyers extract concessions |
| **Bargaining power of suppliers** | How much leverage do inputs have? | Concentrated suppliers squeeze margins |
| **Competitive rivalry** | How intensely do competitors fight for share? | High rivalry erodes margins across all players |

### Blue Ocean Strategy (Kim & Mauborgne)
Instead of competing in existing market space ("red ocean"), create new market space ("blue ocean") by simultaneously reducing factors the industry over-invests in and raising factors customers want but don't get.

**Tool: The Strategy Canvas** — Plot your offering and competitors on key competitive factors. Blue Ocean is found by dramatically altering the shape of the canvas.

## OKRs for Product

### Outcome-Based OKRs vs. Output-Based OKRs

| Type | Example | Problem |
|---|---|---|
| **Output (avoid)** | KR: Ship the onboarding redesign by Q3 | Shipping says nothing about whether it worked |
| **Outcome (target)** | KR: Increase D7 retention from 34% to 50% | Forces the team to measure impact, not just delivery |

### Product OKR Template

```
Objective: Make it effortless for new users to experience core value.

Key Results:
  KR1: Increase activation rate (users who complete setup) from 42% to 65%
  KR2: Reduce time-to-first-value from 8 minutes to < 3 minutes
  KR3: Increase D30 retention for new cohorts from 28% to 40%
  KR4: Reduce onboarding support tickets by 60%
```

### Leading vs. Lagging Metrics in OKRs
- **Lagging metrics** (revenue, retention) confirm the outcome was achieved — but they tell you too late to course-correct
- **Leading metrics** (activation rate, feature adoption in first week) predict future lagging metrics — track these weekly

### Guardrail Metrics
Every OKR should have at least one guardrail: a metric you commit not to harm while pursuing the objective. "Increase sign-up conversion without degrading email deliverability rate."

## Roadmap Formats

| Format | Best For | Trade-off |
|---|---|---|
| **Now / Next / Later** | Communicating strategic intent without fixed dates | No accountability on timing; frustrates teams needing schedules |
| **Timeline Roadmap** | Stakeholders needing milestone dates; sales / marketing alignment | Creates false precision; brittle when priorities shift |
| **Kanban / Outcome Roadmap** | Agile teams focused on outcomes over features | Hard for external stakeholders who want to see features |
| **Narrative Roadmap** | Executive communication; board presentations | Rich context; hard to update; not a working document |

**Best practice:** Maintain separate roadmaps for different audiences. Internal teams use the kanban/outcome view; external stakeholders use the narrative or timeline view.

## Product Positioning: Crossing the Chasm (Geoffrey Moore)

### The Technology Adoption Lifecycle

```
[Innovators] [Early Adopters] | THE CHASM | [Early Majority] [Late Majority] [Laggards]
```

The "Chasm" is the gap between enthusiastic early adopters (who tolerate rough products for the innovation) and the pragmatic early majority (who demand complete, polished, reference-able solutions).

### Crossing the Chasm Strategy
1. **Pick a beachhead market:** A single, specific segment of the early majority that is well-defined and has an urgent need
2. **Dominate the beachhead first** before expanding — become the obvious choice in one niche
3. **Build a "whole product"** that solves the pragmatist's complete problem (integrations, services, support)
4. **Use the beachhead as reference** to expand into adjacent segments

### Jobs-Based Positioning (Against Alternatives)
Customers do not compare you to your competitors — they compare you to however they solved the problem before, including doing nothing. Position against the actual alternative: "Unlike Excel, which requires manual updating and breaks when shared, Notion gives your team a living document that updates automatically."

## Product-Market Fit Signals

Product-market fit (PMF) = the degree to which a product satisfies a strong market demand. Without PMF, growth is expensive and fragile.

### Sean Ellis's 40% Test
Survey active users: "How would you feel if you could no longer use [product]?"
- **"Very disappointed"** response > 40% = product-market fit signal
- < 40% → focus on discovery, not growth

### Net Promoter Score (NPS) Benchmark
- NPS > 50 = excellent; common in PMF-stage B2C products
- NPS > 30 = good for B2B
- NPS < 20 = PMF is questionable; growth spend is premature

### Retention Curve Shape
Plot cohort retention over time. PMF shows a retention curve that **flattens** — users who stay keep staying. No PMF shows a curve that **continues declining toward zero** — even your best users eventually leave.

### Leading PMF Signals
- Spontaneous word-of-mouth (users recruit other users without incentive)
- Customers resist churning even when pricing increases
- Sales cycle shortens — customers already understand the value before the demo

## Common Pitfalls

- Confusing a roadmap with a strategy — a list of features is not a strategy; a choice about where to compete and why is
- Building for the whole market at once instead of dominating a beachhead first
- Using NPS as the only PMF signal — NPS measures satisfaction, not indispensability
- Setting OKRs that are 100% achievable — OKRs should be stretch targets; 70% attainment is healthy
- Treating the roadmap as a promise — it is a prioritized plan that must be revisited as new information arrives

## Review Questions

1. A startup has strong early-adopter usage but is struggling to sell to "enterprise" customers. Using Crossing the Chasm, diagnose the problem and recommend a strategy.
2. Your product has an NPS of 35 and a D30 retention rate of 22%. The CEO wants to invest in growth marketing. Do you agree? Justify using PMF frameworks.
3. Convert this feature-based roadmap item into an outcome-based OKR: "Q3: Build advanced search filters."
4. Two product teams are competing for budget. Team A has strong output metrics (shipped 14 features last quarter). Team B has strong outcome metrics (D30 retention up 12%). Which case is stronger, and why?

#Engineering #Leadership
