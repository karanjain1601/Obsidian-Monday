---
title: Product Manager Overview
aliases: [PM Role, Product Management Fundamentals, PM Archetypes]
tags: [Engineering, Leadership, Management, ProductManagement, ProductManager]
domain: Engineering Leadership
difficulty: Intermediate
created: 2026-07-29
related: [Product_Discovery, Product_Strategy, Agile_Product_Delivery, Product_Analytics_and_Metrics, Engineering_Manager_Overview]
status: complete
---

# Product Manager Overview

> [!abstract] TL;DR
> The PM decides what to build and why — not how to build it. The PM's job is to represent the customer and the business inside the development process: running discovery, writing clear requirements, aligning stakeholders, and measuring outcomes. Great PMs ship products that customers actually want; poor PMs ship a roadmap of features that nobody uses.

## The PM Role: What to Build, Not How

The PM owns the **product definition problem**: understanding customer needs, translating them into prioritized requirements, and measuring whether the solution actually solved the problem. The engineering team owns the **execution problem**: figuring out how to build what was defined reliably and well.

### Product Management vs. Adjacent Roles

| Role | Primary Question | Output |
|---|---|---|
| **Product Manager** | What should we build and why? | PRD, roadmap, OKRs, prioritized backlog |
| **Project Manager** | How do we deliver this on time? | Project plan, timeline, risk register |
| **Engineering Manager** | How do we build this reliably? | Team delivery, quality, technical direction |
| **UX Designer** | How should it feel to use? | Wireframes, prototypes, design system |

The PM sits at the intersection of customer, business, and technology — they are the only role whose job requires fluency in all three.

## PM Archetypes

| Archetype | Context | Core Skills |
|---|---|---|
| **B2C PM** | Consumer-facing products; large, diverse user bases | Data-driven; growth mechanics; UX intuition |
| **B2B PM** | Enterprise products; specific buyer/user split | Sales partnership; deep domain expertise; procurement cycles |
| **Platform PM** | Internal developer tools; API products | Technical depth; developer experience; adoption metrics |
| **Growth PM** | Acquisition, activation, retention funnels | Experimentation; analytics; funnel optimization |
| **Technical PM** | ML, infrastructure, API-heavy products | Engineering fluency; system design awareness |

Most PMs operate as one primary archetype but need fluency in others as products evolve.

## PM's Core Activity Loop

```
Discover (understand the problem) 
  → Define (translate into requirements)
    → Deliver (guide team through execution)
      → Measure (quantify impact)
        → Discover (next cycle)
```

This is not a linear process. Discovery and delivery overlap; measuring informs the next discovery cycle.

## Stakeholder Map

Every PM must maintain a working model of their stakeholder landscape:

| Stakeholder | Their Interest | PM's Obligation |
|---|---|---|
| Engineering | Clarity of requirements; realistic commitments | Write crisp acceptance criteria; protect scope |
| Design | Enough discovery to design confidently | Share research early; involve in discovery |
| Sales | Features that close deals | Intake sales requests; explain prioritization decisions |
| Marketing | Roadmap visibility for campaign planning | Share roadmap 1+ quarter ahead; explain strategy |
| Customer Success | Answers for customers; early warning on issues | Include CS in beta programs; share release notes |
| Legal/Compliance | Risk exposure on data and privacy | Involve early on any data feature; never surprise legal |
| Executives | Business outcomes; strategic alignment | OKR alignment; quarterly business review updates |

## PM's Toolkit

| Tool | Purpose |
|---|---|
| **PRD (Product Requirements Document)** | Defines the problem, success metrics, requirements, and out-of-scope decisions |
| **User Stories** | Translates requirements into deliverable units for engineering |
| **Roadmap** | Communicates priorities over time to stakeholders |
| **OKRs** | Aligns team work to business outcomes |
| **Metrics Dashboard** | Makes product health visible and continuous |

### PRD Skeleton Template

```markdown
## Problem Statement
What customer problem are we solving? Who has this problem?

## Success Metrics
How will we know this worked? (Leading and lagging)

## Requirements
What must be true for this to be complete?

## Non-Goals (Out of Scope)
What are we explicitly NOT building in this version?

## Open Questions
What do we still need to resolve before or during development?
```

## What Makes a Great PM

**Customer obsession:** Knows customers by name; regularly in user interviews; can predict their reactions to features.

**Analytical rigor:** Derives insights from data, not just intuition. Can build and interpret a cohort analysis, A/B test, or funnel breakdown.

**Influence without authority:** Has no direct reports but must align engineering, design, legal, marketing, and sales around a shared direction. Accomplishes this through trust, clarity of reasoning, and consistent follow-through — not org chart power.

**Ruthless prioritization:** Can say no — including to executives — when a request does not serve the product strategy.

## Common PM Anti-Patterns

**Feature Factory** — The team ships feature after feature without measuring impact. Output is treated as success. The backlog grows; the product's coherence erodes. Fix: instrument every feature and measure adoption within 30 days of launch.

**HiPPO-Driven Decisions** — Highest-Paid Person's Opinion overrides customer research and data. The PM becomes an order-taker instead of a strategic partner. Fix: anchor every significant decision to a user research insight or a metric.

**Shipping Without Measuring** — Features launch and are never evaluated. Nobody knows if they worked. The PM has no evidence base for future decisions. Fix: define success metrics before development begins, not after.

**Unclear Requirements** — Engineering starts building before the "what" and "why" are clearly defined. Stories have no acceptance criteria. Rework is the result. Fix: no story enters a sprint without written, testable acceptance criteria.

**Roadmap as Contract** — Stakeholders treat the roadmap as a delivery commitment. When priorities shift (as they always do), the PM is blamed for "breaking promises." Fix: communicate roadmaps as current best thinking with explicit uncertainty at further time horizons.

## Common Pitfalls

- Confusing customer satisfaction with product-market fit — users can be satisfied with a product they would not miss if it disappeared
- Building for the most vocal customers instead of the most representative ones
- Treating sprint ceremonies as the job — the real job is discovery and strategy, not backlog management
- Writing requirements that specify implementation instead of outcomes — engineering needs the "what," not the "how"
- Skipping non-goals in PRDs — undefined scope always expands to fill available time

## Review Questions

1. A sales VP asks the PM to add a specific feature because "three enterprise customers asked for it." Using the stakeholder map and anti-pattern framework, how should the PM respond?
2. What distinguishes a B2B PM from a Growth PM? If you were moving between these archetypes, what skills would you need to build?
3. A new PM reports that they spend 90% of their time in meetings (standups, sprint planning, backlog grooming). What is wrong, and how would you fix it?
4. Write a Problem Statement section for a PRD for this scenario: "Users are abandoning the checkout flow at the payment step."

#Engineering #Leadership
