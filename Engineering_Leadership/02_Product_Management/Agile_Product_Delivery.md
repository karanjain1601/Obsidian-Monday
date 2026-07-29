---
title: Agile Product Delivery
aliases: [Backlog Management, WSJF, RICE Scoring, User Stories, MVP, Sprint Ceremonies]
tags: [Engineering, Leadership, Management, Agile, Backlog, WSJF, RICE, UserStories, MVP]
domain: Engineering Leadership
difficulty: Intermediate
created: 2026-07-29
related: [Product_Manager_Overview, Product_Discovery, Product_Strategy, Delivery_and_Execution]
status: complete
---

# Agile Product Delivery

> [!abstract] TL;DR
> Agile delivery for PMs is about continuously shipping the highest-value work in the smallest batches, measuring the result, and adjusting. The key tools: WSJF and RICE for prioritization, INVEST criteria for story quality, Given/When/Then for acceptance criteria, and MVP thinking to test assumptions before full investment.

## Agile Manifesto Principles for PMs

The manifesto's 12 principles distill to four PM-relevant imperatives:

1. **Deliver working software frequently** — a two-week feedback loop is infinitely more valuable than a quarterly one
2. **Welcome changing requirements** — requirements discovered late are not a failure; they are the system working
3. **Business people and developers must work together daily** — the PM/EM relationship is the center of gravity for delivery
4. **Simplicity — the art of maximizing the work NOT done** — PMs add value by removing scope, not adding it

## Backlog Management

A healthy backlog has:
- The top 1–2 sprints' worth of work in **sprint-ready** state (acceptance criteria written, dependencies cleared)
- The next 1–2 quarters of themes and epics in **groomed** state (sized, sequenced, dependencies visible)
- A long tail of ideas in **raw** state — unvetted, unsized, not committed

### Story Mapping (Jeff Patton)
Story mapping organizes work along two axes:
- **Horizontal axis:** The user's journey through the product, left to right
- **Vertical axis:** Priority within each step, top to bottom

This prevents the flat backlog problem — where high and low priority items live at the same indentation level and the team loses sight of the user's full experience.

### Story Map Structure
```
[User Activity 1] → [User Activity 2] → [User Activity 3]
  Task A              Task D              Task G         ← Backbone
  Task B              Task E              Task H         ← MVP slice
  Task C              Task F              Task I         ← Future slice
```

## Prioritization Frameworks

### WSJF — Weighted Shortest Job First (SAFe)

```
WSJF = Cost of Delay / Job Duration
Cost of Delay = User-Business Value + Time Criticality + Risk Reduction / Opportunity Enablement
```

WSJF forces teams to think about both the value of a feature AND how long it will take. A high-value feature with a 10-sprint implementation may be outranked by a medium-value feature with a 1-sprint implementation.

**Scoring:** Rate each factor 1, 2, 3, 5, 8, 13 (Fibonacci). Calculate ratio. Work highest-ratio items first.

### RICE Scoring (Intercom)

| Factor | Definition | Score Range |
|---|---|---|
| **Reach** | How many users will this affect per quarter? | Raw number |
| **Impact** | How much does it improve the experience for those users? | 0.25 / 0.5 / 1 / 2 / 3 |
| **Confidence** | How sure are we about the above estimates? | 50% / 80% / 100% |
| **Effort** | How many person-months will this take? | Months |

```
RICE Score = (Reach × Impact × Confidence) / Effort
```

Higher score = higher priority. RICE is especially useful when comparing features with very different user reach.

### ICE Scoring (Sean Ellis)

A simpler version for early-stage teams: **Impact × Confidence × Ease** (each scored 1–10). Useful when you lack the data for RICE and need a quick gut-check framework with some structure.

### Prioritization Framework Comparison

| Framework | Best For | Requires |
|---|---|---|
| WSJF | Cost-of-delay-aware sequencing | Effort estimate + value estimate |
| RICE | Comparing features with different user reach | Usage data + confidence level |
| ICE | Quick triage with minimal data | Team judgment only |
| MoSCoW | Stakeholder alignment on what's in scope | Stakeholder negotiation |

## Writing Good User Stories: INVEST Criteria

| Letter | Criterion | Meaning |
|---|---|---|
| **I** | Independent | Can be developed and deployed without depending on another story |
| **N** | Negotiable | Not a contract; the implementation approach is open to discussion |
| **V** | Valuable | Delivers value to an end user or the business (not a technical sub-task) |
| **E** | Estimable | Small enough and clear enough that the team can size it |
| **S** | Small | Completable within a single sprint |
| **T** | Testable | Has acceptance criteria that define done unambiguously |

### User Story Template
```
As a [type of user],
I want to [accomplish something],
So that [I get this benefit / value].
```

### Job Story Alternative
```
When [situation],
I want to [motivation],
So I can [expected outcome].
```

## Acceptance Criteria: Given/When/Then (Gherkin Format)

Acceptance criteria written in Given/When/Then format:
- Are unambiguous — anyone reading them knows what "done" means
- Are testable — QA can write test cases directly from them
- Define edge cases — not just the happy path

### Template
```
Given [initial context / precondition],
When [action is taken],
Then [expected outcome / system response].
```

### Example: Password Reset Feature
```
Given a registered user who has forgotten their password,
When they enter their email address on the "Forgot Password" page,
Then they receive an email within 60 seconds with a reset link that expires in 24 hours.

Given the same user clicks an expired reset link,
When they attempt to set a new password,
Then they see an error message and a prompt to request a new reset link.
```

## Sprint Ceremonies from PM Perspective

| Ceremony | PM's Role | What Good Looks Like |
|---|---|---|
| **PI Planning** (SAFe) | Present product vision and top features for the next PI | Engineering understands the why; risks and dependencies are surfaced |
| **Sprint Planning** | Confirm stories are ready (INVEST + AC written); answer questions | Team commits to a sprint goal, not just a list of tickets |
| **Backlog Refinement** | Walk through upcoming stories; answer questions; update estimates | Top 2 sprints' worth of backlog is sprint-ready before planning |
| **Sprint Review** | Gather stakeholder feedback on what was built | Real users or stakeholders give input that affects the next sprint |
| **Retrospective** | Participate as a team member; share PM-specific process observations | Honest; leads to specific, owned action items |

## Release Planning

### Feature Flags and Phased Rollout
- **Feature flags:** Toggle a feature on/off without a code deploy. Enables gradual rollout, instant kill switch, and A/B testing infrastructure.
- **Phased rollout:** 1% → 5% → 20% → 100%. Monitor error rates and metrics at each step before expanding.
- **Dark launch:** Ship the feature to production but keep it invisible to users. Validates the infrastructure behaves correctly under real conditions before users see it.

### Release Checklist
- [ ] Acceptance criteria verified (QA sign-off)
- [ ] Metrics instrumented and dashboards live
- [ ] Runbook exists for rollback
- [ ] Customer-facing documentation updated
- [ ] CS team briefed on new behavior
- [ ] Feature flag configured for phased rollout if applicable

## MVP Thinking

### Minimum Viable Product vs. Minimum Viable Test
- **MVP (Build):** The smallest thing you can build that delivers value to a real user and tests a core assumption
- **Concierge MVP:** Do the job manually for a small number of users before building any software. Test the value proposition, not the technology.
- **Wizard of Oz MVP:** The user thinks they are using a real product; a human is actually performing the steps manually behind the scenes.
- **Landing Page Test:** Describe the product and measure sign-up intent before building anything.

### Riskiest Assumption Test
Before committing to an MVP build, identify the riskiest assumption: "This whole idea fails if [assumption] is false." Design the smallest experiment that tests that one assumption first.

| Assumption Type | Test Type |
|---|---|
| "Customers have this problem" | User interviews + problem survey |
| "Customers will pay for a solution" | Pre-sales / waitlist |
| "Our solution actually solves it" | Concierge / Wizard of Oz |
| "We can build it economically" | Technical spike / prototype |

## Common Pitfalls

- Writing user stories as task lists for engineering ("Add column to DB") — stories must be valuable to users
- Acceptance criteria that describe the implementation ("The component must use React state") instead of the outcome ("User sees updated count without page reload")
- RICE scoring from intuition instead of data — garbage in, garbage out
- Treating sprint reviews as stakeholder demos rather than feedback loops — if stakeholders are not changing things after a review, either they are rubber-stamping or the wrong people are in the room
- Building an MVP that is too large — if it takes more than one sprint to build the MVP, it is not minimum

## Review Questions

1. A team has a backlog of 200 stories, all rated "High Priority." Using WSJF, explain how you would create a defensible sequence — what inputs do you need and how does the math work?
2. Write three Given/When/Then acceptance criteria for a "login with Google" feature, covering the success case, the case where the user cancels OAuth, and the case where the user's Google account email does not match their existing account.
3. A startup wants to test whether enterprise customers would pay for a compliance dashboard. They want to build the full product first. Recommend a cheaper discovery approach using MVP thinking.
4. Which is more valuable: a sprint that shipped 12 stories with no acceptance criteria, or a sprint that shipped 4 stories with full INVEST compliance and verified acceptance criteria? Explain your reasoning.

#Engineering #Leadership
