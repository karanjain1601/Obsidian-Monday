---
title: Delivery and Execution
aliases: [Project Planning, DORA Metrics, Estimation, Sprint Rituals, OKRs for Engineering]
tags: [Engineering, Leadership, Management, Delivery, DORA, OKR, Estimation]
domain: Engineering Leadership
difficulty: Intermediate
created: 2026-07-29
related: [Engineering_Manager_Overview, Engineering_Metrics_and_Health, Technical_Leadership, Product_Analytics_and_Metrics]
status: complete
---

# Delivery and Execution

> [!abstract] TL;DR
> Delivery is the EM's accountability to the business: shipping reliably, estimating honestly, managing risks early, and leading through incidents without blame. The DORA metrics (deployment frequency, lead time, MTTR, change failure rate) provide objective benchmarks for engineering team health.

## Project Planning

### Milestones and Critical Path

A **milestone** is a binary checkpoint: done or not done. "50% complete" is not a milestone — it is a progress estimate. Milestones should represent observable, verifiable states of the system.

**Critical Path** = the longest chain of dependent tasks. Slippage on critical path tasks directly delays the project end date. Non-critical-path slippage does not.

### Project Planning Checklist
- [ ] Define milestones as binary deliverables
- [ ] Map dependencies between milestones (what must be done before what)
- [ ] Identify the critical path explicitly
- [ ] Assign a DRI (Directly Responsible Individual) to each milestone
- [ ] Create a risk register for top 3–5 risks
- [ ] Define escalation triggers ("if X is delayed by > 1 week, escalate to EM")
- [ ] Agree on status cadence with stakeholders

### Risk Register Template

| Risk | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation | Owner | Trigger Date |
|---|---|---|---|---|---|
| Third-party API rate limit hit in load test | M | H | Pre-negotiate limits with vendor | Alice | 2 weeks before load test |
| Auth service dependency not ready by M2 | H | H | Start with mock; build adapter layer | Bob | End of sprint 4 |
| Key engineer on leave during final sprint | L | M | Cross-train one engineer on critical path work | Carol | Before sprint 6 |

## Estimation Techniques

### T-Shirt Sizing
Quick relative sizing for roadmap planning. XS / S / M / L / XL. Useful for backlog grooming and capacity conversations — not for sprint commitment.

### Planning Poker
Structured consensus estimation using Fibonacci numbers (1, 2, 3, 5, 8, 13, 21). Each engineer votes simultaneously to avoid anchoring bias. Discuss outliers and re-vote. Produces better estimates than top-down or individual estimates.

### Three-Point Estimation (PERT-Style)

```
Expected = (Optimistic + 4 × Most Likely + Pessimistic) / 6
```

Useful when the work has uncertain scope. Forces engineers to articulate the range, not just the happy path.

### Reference Class Forecasting
Instead of asking "how long will this task take?", ask "how long did comparable past tasks take?" Look at actuals for the last 5–10 similar efforts. Use the historical median as the base estimate, then adjust for known differences.

**Why it works:** Estimation bias is systematic. Engineers consistently underestimate complexity. Historical data corrects for this bias more reliably than bottom-up re-estimation.

### Estimation Anti-Patterns
- "That's just a small change" — small changes often have large blast radii in complex systems
- Estimating only the coding time, not testing, code review, and deploy steps
- Padding estimates "just in case" without communicating the actual confidence interval
- Adjusting estimates under social pressure before the scope changes

## Sprint Rituals: EM's Role

| Ceremony | PM / EM's Role | Common Failure Mode |
|---|---|---|
| **Sprint Planning** | Confirm scope is ready (acceptance criteria written); remove blockers; ensure capacity is realistic | Overcommitting; accepting unclear stories |
| **Daily Standup** | Attend, listen for blockers; do not facilitate — let the team own it | EM dominates; becomes a status report to EM |
| **Sprint Review** | Invite stakeholders; ensure demos are against real functionality | Demo-ing from dev environment that will never be production |
| **Retrospective** | Create psychological safety for honest feedback; drive action items to completion | Retros become complaint sessions with no follow-through |

### The EM's Retro Responsibilities
1. **Before**: Create safety by modeling vulnerability — share what you personally could have done better
2. **During**: Protect quieter voices; challenge dominant narratives gently
3. **After**: Track every action item to completion — nothing kills retro credibility faster than repeated unfixed problems

## Handling Scope Creep

Scope creep = adding work to an in-flight project without removing an equivalent amount of existing scope.

### Scope Change Response Framework
1. **Name it**: "This is a scope addition. Here is what it would cost in time."
2. **Offer a trade**: "We can add this if we move X to next sprint."
3. **Escalate if needed**: If PM insists on adding scope without a trade, escalate to shared manager.
4. **Never silently absorb it**: Silent absorption trains stakeholders to keep adding scope.

## Managing Dependencies Across Teams

### Dependency Management Checklist
- [ ] Identify all cross-team dependencies at kickoff (not mid-sprint)
- [ ] Establish an agreed interface/contract before coding begins (API contract, data schema)
- [ ] Set a bi-weekly sync with dependent team EM; do not rely on async only
- [ ] Build against mocks/stubs when the dependency is not ready
- [ ] Flag timeline risk to stakeholders at the first sign of delay — not the day before the deadline

## Incident Management

### War Room Leadership
During a P1/P2 incident, the EM's role is **incident commander** (or delegate), not lead responder. The EM:
- Assigns clear roles: incident commander, technical lead, communications lead
- Keeps the technical lead focused on resolution, not stakeholder communication
- Sends status updates every 30 minutes to stakeholders until resolution
- Calls the all-clear and schedules post-mortem within 48 hours

### Incident Command Structure
```
Incident Commander (EM or senior IC)
├── Technical Lead — diagnosis and fix
├── Communications Lead — stakeholder updates
└── Scribe — timeline log, decisions made
```

### Blameless Post-Mortem Structure

| Section | Content |
|---|---|
| **Summary** | What happened, customer impact, duration |
| **Timeline** | Chronological log of events and decisions |
| **Root Cause(s)** | Systems-level causes (not "human error") |
| **Contributing Factors** | What made the system vulnerable to this failure |
| **Action Items** | Specific, assigned, time-boxed improvements |
| **What Went Well** | Detection, response, communication wins |

**Blameless principle:** "Human error" is never the root cause — it is a symptom. The real cause is a system design that made human error easy and hard to detect. Fix the system.

## OKRs for Engineering Teams

### OKR Writing Principles
- **Objectives** are aspirational, qualitative, and inspiring
- **Key Results** are measurable, binary-ish, and define what "done" means

### Engineering OKR Template

```
Objective: Make our platform reliable enough that customers never worry about uptime.

Key Results:
  KR1: Reduce P1 incidents from 4/month to ≤ 1/month
  KR2: Achieve 99.95% uptime for core transaction flow (up from 99.7%)
  KR3: Reduce MTTR from 45 minutes to < 15 minutes
  KR4: Complete runbooks for top 5 incident types (currently 0 exist)
```

### OKR Anti-Patterns
- Tasks disguised as key results ("KR: Complete the migration" — this is an output, not an outcome)
- 100% achievement rate — OKRs should be stretch goals; 70% attainment is healthy
- OKRs set without PM/product alignment — engineering OKRs that no one cares about will be deprioritized immediately

## DORA Metrics

The DORA research (Google's DevOps Research and Assessment program) identified four metrics that consistently correlate with engineering team performance and organizational outcomes.

| Metric | What It Measures | Elite Benchmark |
|---|---|---|
| **Deployment Frequency** | How often code ships to production | Multiple times per day |
| **Lead Time for Changes** | Time from commit to production | < 1 hour |
| **Mean Time to Restore (MTTR)** | How quickly service is restored after an incident | < 1 hour |
| **Change Failure Rate** | % of deployments that cause a production issue | 0–15% |

### Using DORA as an EM
- Track all four metrics monthly; use them to identify bottlenecks (slow lead time → review/deploy process; high CFR → test coverage or review quality)
- Do not use DORA to compare teams — use it to track a single team's improvement trend over time
- A low deployment frequency combined with a high lead time signals: too many manual gates, large batch sizes, or insufficient CI/CD automation

## Common Pitfalls

- Running sprint planning without confirmed acceptance criteria — teams commit to ambiguous work and deliver the wrong thing
- Treating scope creep as a team problem to absorb rather than a stakeholder alignment problem to address
- Post-mortems that identify "human error" as root cause — this stops investigation prematurely
- OKRs written at the start of a quarter and never reviewed until the end
- Using DORA metrics as performance bonuses — any goodhart-vulnerable metric will be gamed when attached to compensation

## Review Questions

1. Your team has been missing sprint commitments for three consecutive sprints. Using the DORA framework and sprint ritual analysis, what are three diagnostic questions you would ask to find the root cause?
2. A PM wants to add a significant feature to an in-flight sprint. Walk through the scope change response framework.
3. Write one engineering OKR (objective + three key results) for a team working to reduce developer toil and improve deployment frequency.
4. Why is "human error" insufficient as a root cause in a blameless post-mortem? What deeper questions should the post-mortem ask instead?

#Engineering #Leadership
