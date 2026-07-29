---
title: Technical Leadership
aliases: [Tech Leadership, ADR, Architecture Decision Records, Tech Debt, Build vs Buy]
tags: [Engineering, Leadership, Management, TechnicalLeadership, TechDebt, ADR]
domain: Engineering Leadership
difficulty: Advanced
created: 2026-07-29
related: [Engineering_Manager_Overview, Delivery_and_Execution, Staff_Plus_Engineering, Engineering_Metrics_and_Health]
status: complete
---

# Technical Leadership

> [!abstract] TL;DR
> The EM's technical role is to stay calibrated enough to evaluate proposals, set direction, and remove obstacles — not to implement. Technical leadership means owning the quarterly roadmap, capturing decisions in ADRs, managing debt systematically with a classification matrix, and building code review culture that scales without the EM as a bottleneck.

## The EM's Technical Role: Calibrated, Not Hands-On

### The Credibility Spectrum

| Level | Behaviors | Risk |
|---|---|---|
| **Too Detached** | Can't evaluate estimates; accepts every technical claim uncritically | Team loses respect; makes poor resourcing decisions |
| **Calibrated (Target)** | Reviews design docs critically; asks second-order questions; knows codebase pain points | None — this is the goal |
| **Too Hands-On** | In every PR; engineers wait for EM to unblock; building features solo | Bottleneck; not managing; reports feel disempowered |

### What Staying Calibrated Looks Like
- Read weekly architecture updates and design docs; ask "what did we consider and reject?"
- Attend incident post-mortems and read all action items
- Pair with engineers occasionally (not to ship, but to hear what is painful)
- Maintain awareness of build times, test flakiness, and deploy frequency from dashboards

## Technical Roadmap Ownership

### Quarterly/Annual Planning Inputs
Engineers should surface; EMs should synthesize:
- Tech debt backlog with severity and blast radius estimates
- Upcoming product roadmap from PM (which unlocks new technical requirements)
- Infrastructure capacity and cost projections
- Platform team dependencies and shared service timelines
- Skill gaps relative to upcoming work
- Security and compliance obligations

### Technical Roadmap Template

| Quarter | Initiative | Rationale | Owner | Success Metric |
|---|---|---|---|---|
| Q3 | Migrate auth service to JWT | Unblock SSO, reduce login latency p95 | Alice (E5) | Login latency < 100ms; zero downtime |
| Q3 | Eliminate direct DB calls in API layer | Reduce blast radius; enable query optimization | Bob (E4) | 0 direct DB calls in API handlers |
| Q4 | Decompose orders module from monolith | Independent deployability; reduce deploy risk | Carol (E6) | Orders deployable without monolith release |
| Q4 | Upgrade CI to parallel test execution | Reduce CI time from 18m to < 8m | Dave (E4) | CI p95 < 8 minutes |

## Architecture Decision Records (ADRs)

An ADR is a short, durable document that captures a significant technical decision and the context that made it the right choice at the time. The goal: prevent "why did we do it this way?" conversations two years later when everyone who made the decision has left.

### When to Write an ADR
- Any decision that is difficult or costly to reverse
- Any decision where reasonable engineers would disagree
- Any decision that constrains future work
- Any decision involving a new technology, library, or external dependency

### ADR Template

```markdown
# ADR-{number}: {Short Title}

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-{n}
**Date:** YYYY-MM-DD
**Deciders:** [List of engineers and stakeholders involved]

## Context
What is the situation, constraint, or opportunity that requires a decision?
What forces are at play? What would happen if we made no decision?

## Decision
What have we decided to do? State it clearly and without hedging.

## Consequences
**Positive:** What this enables or improves.
**Negative:** What this costs, constrains, or forecloses.
**Neutral:** What changes but is neither good nor bad.

## Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| Option A | ... |
| Option B | ... |
```

### ADR Lifecycle
ADRs are never deleted — they are deprecated or superseded. A deprecated ADR with a link to its successor is far more useful than a deleted one, because it explains *why* the change was made.

## Tech Debt Management

### The Cunningham / McConnell Classification Matrix

|  | **Deliberate** | **Inadvertent** |
|---|---|---|
| **Prudent** | "We know this is not ideal; we'll fix it after launch" — conscious shortcut with a plan | "Now we understand the domain better and see a cleaner design" — learned through iteration |
| **Reckless** | "We don't have time for proper design" — knowingly skipping good practice under pressure | "What's layering?" — poor technical judgment or skill gaps led to poor choices |

**Only Prudent-Deliberate debt is acceptable.** All other types erode system health and team morale.

### Managing the Debt Budget

- Reserve **15–20% of sprint capacity** for debt reduction (increase to 30% if system reliability is poor)
- Run **"debt sprints"** at end of quarter when product pressure is lower
- For each debt item, document: type (from matrix), blast radius, estimated remediation effort, owner, target quarter
- **Tech debt must have a named owner and a deadline** — otherwise it is wishes, not work

### Debt Triage Template

| Item | Type | Blast Radius | Effort | Owner | Target |
|---|---|---|---|---|---|
| No retry logic on payment webhook | Prudent-Deliberate | High (revenue risk) | M | Alice | Q3 |
| Legacy XML parser in reports service | Prudent-Inadvertent | Low | S | Bob | Q4 |
| Direct DB calls in 12 API handlers | Reckless-Deliberate | High | L | Carol | Q3 |

## Engineering Principles Document

A 1–2 page living document defining how the team makes technical decisions. Not rules — principles. Helps new engineers make consistent decisions without an EM or staff engineer in the room.

### Example Principles
- "Prefer boring technology. Reach for the innovative solution only when the boring one genuinely cannot serve our need."
- "Services fail gracefully or not at all. Silent corruption is worse than a loud outage."
- "We own our data contracts; we do not own our consumers."
- "Observability is not optional. Every service ships with structured logs, metrics, and distributed traces."
- "Complexity that cannot be explained in 10 minutes to a new engineer is a design smell."

## Build vs. Buy vs. Integrate Decision Framework

| Criteria | Build | Buy (SaaS/Commercial) | Integrate (Open Source) |
|---|---|---|---|
| Core competitive differentiator? | Yes | No | No |
| Customization required | High | Low | Medium |
| Time to value | Slow (months) | Fast (days-weeks) | Medium (weeks) |
| Long-term ownership cost | High | Predictable (licensing) | Moderate (support/upgrade burden) |
| Vendor lock-in risk | None | High | Low |
| Security / compliance control | Full | Shared responsibility | Full |

**Heuristic:** If it is not a competitive differentiator, default to buy or open source. If it is, build — but only after confirming that no existing solution can serve the need within an acceptable tradeoff envelope.

## Evaluating Technical Candidates

### Interview Competency Rubric

| Competency | Weak | Acceptable | Strong |
|---|---|---|---|
| Problem decomposition | Jumps to solution immediately | Breaks into parts with prompting | Naturally maps the problem space before picking an approach |
| Trade-off analysis | States one option only | Compares two options | Considers constraints; compares 3+ options; makes a recommendation with reasoning |
| Communication | Vague; cannot explain to non-technical audience | Understandable; stays at one level | Clear and precise; adjusts depth for audience |
| Debug mindset | Random guesses | Methodical with hints | Systematic hypothesis-based elimination from first principles |
| Collaboration signal | Talks over interviewer | Responds to questions | Actively checks understanding; builds on interviewer's input |

### Bar Raising
For every candidate, ask: "Would I be comfortable with this person as a peer on the hardest problem this team faces?" If the answer is "maybe, we're under hiring pressure," that is a no. A wrong hire costs 6–18 months of team time and morale.

### Calibration Sessions
After every debrief: compare scores across interviewers. Are there halo effects (liked the candidate personally → high scores on unrelated dimensions)? Grade inflation? Calibration sessions prevent these biases from accumulating into systematic hiring errors.

## Code Review Culture

### Code Review Norms to Establish

| Norm | Why It Matters |
|---|---|
| Turnaround within 1 business day | Blocked PRs kill flow; unlimited wait signals disrespect |
| Comment on code, not the author | "This loop is O(n²)" vs. "You wrote this inefficiently" |
| Distinguish blocking vs. non-blocking comments | `nit:` prefix for style; `blocking:` for correctness |
| No EM bottleneck on merges | Distribute review ownership via CODEOWNERS |
| Explain, don't just correct | "Prefer X because Y" teaches; "change this" just polices |

### EM's Role in Code Review
- **Set standards** via norms doc and example PRs — do not enforce personally on every PR
- **Monitor bottlenecks**: Flag PRs open > 2 business days as a team health metric
- **Use reviews as coaching** in 1:1s: "I saw your PR on the payment service — walk me through your design thinking on the retry logic"
- **Do not block deploys** waiting for EM approval on non-security-sensitive code

## Common Pitfalls

- Using ADRs only for "big" decisions — small recurring decisions shape architecture silently over time
- Tech debt budget disappearing under product pressure every single sprint — defend it explicitly with product partners
- Build vs. buy decisions made by whoever advocates loudest — use the framework; document the reasoning in an ADR
- Code review becoming a gatekeeping exercise rather than a knowledge-transfer mechanism
- ADRs stored somewhere nobody reads — keep them in the repo alongside the code they describe

## Review Questions

1. Using the Cunningham matrix, classify this debt: "We wrote a direct DB query in an API handler because we were under launch deadline pressure, knowing we needed a service layer later." Is this acceptable debt?
2. You need to decide whether to build your own search feature or integrate Elasticsearch. Walk through the build/buy/integrate framework with a concrete recommendation.
3. An ADR was written 18 months ago and the technical context has fundamentally changed. What is the correct action — delete, update, or deprecate? Why?
4. An engineer proposes a new distributed caching layer. What questions would a well-calibrated EM ask in the design review?

#Engineering #Leadership
