---
title: Engineering Manager Overview
aliases: [EM Overview, IC to EM Transition, Engineering Management Fundamentals]
tags: [Engineering, Leadership, Management, EngineeringManager]
domain: Engineering Leadership
difficulty: Intermediate
created: 2026-07-29
related: [People_Management, Technical_Leadership, Delivery_and_Execution, Team_Building_and_Culture]
status: complete
---

# Engineering Manager Overview

> [!abstract] TL;DR
> Engineering management is the practice of enabling a team of engineers to do their best work. The EM's primary output is team output — not personal code. The IC-to-EM transition is a fundamental identity shift: your leverage comes from multiplying others, not from your own technical contributions.

## The IC to EM Transition

The most dangerous assumption a new EM makes: "I'll keep coding and also manage." In practice the two roles compete for the same cognitive bandwidth. The shift requires accepting that your success metric is now your team's success metric.

| Dimension | Individual Contributor | Engineering Manager |
|---|---|---|
| Primary output | Code, designs, PRs | Team velocity, delivery, morale |
| Success metric | Personal impact | Team impact |
| Time horizon | Sprint / week | Quarter / year |
| Feedback loop | CI/CD, code review | 1:1s, retros, metrics |
| Leverage | Technical depth | People, process, culture |

### The "Manager Guilt" Trap
Many new EMs feel guilty for not coding. This is a calibration failure. An EM who spends the majority of time writing production code is not managing — they are an IC with a job description mismatch. The guilt is a signal to redirect energy into multiplying the team, not to go back to shipping features personally.

## Core EM Responsibilities: The Four Pillars

1. **People Management** — Hiring, developing, retaining, and exiting engineers. Running 1:1s, performance conversations, career development planning, and building individual trust.
2. **Technical Direction** — Owning the team's technical roadmap, guiding architectural decisions, managing tech debt, and setting engineering standards.
3. **Delivery** — Planning, estimating, tracking milestones, managing cross-team dependencies, and ensuring the team ships reliably and predictably.
4. **Culture** — Building psychological safety, defining team norms, fostering continuous learning, and driving blameless retrospectives.

## The Three EM Models

| Model | Description | When It Works |
|---|---|---|
| **Tech Lead Manager (TLM)** | EM who codes ~30–40% of the time; carries technical weight and manages | Small teams (3–5 engineers), early-stage companies, highly technical domains |
| **People Manager** | EM who does not write production code; full focus on people, process, and strategy | Large teams (8+), mature organizations, cross-functional leadership roles |
| **Hybrid Manager** | Adjusts the coding/managing ratio based on current team needs | Default state for most mid-career EMs during steady-state operations |

The TLM model is unstable at scale. As team size grows past ~6, the coding time must shrink or the management suffers.

## Situational Leadership Model (Blanchard & Hersey)

Leadership style must match the development level of the individual. Applying the wrong style is worse than applying no style.

| Development Level | Employee State | Appropriate EM Style |
|---|---|---|
| **D1** | Low competence, high commitment (new hire enthusiasm) | **Directing** — tell them what and how; close oversight |
| **D2** | Growing competence, declining confidence (reality sets in) | **Coaching** — explain rationale, solicit input, build confidence |
| **D3** | High competence, variable commitment (experienced but disengaged) | **Supporting** — ask questions, collaborate on decisions, boost motivation |
| **D4** | High competence, high commitment (mastery) | **Delegating** — define outcome, step back entirely |

Common error: treating every D4 engineer as D1 because you are new to the role and anxious. Match style to the individual, not your own comfort level.

## What EMs Should Delegate vs. Retain

| Retain (EM Owns) | Delegate (Team Owns) |
|---|---|
| Performance reviews, comp decisions, leveling | Day-to-day technical implementation decisions |
| Hiring and firing decisions | Feature design and architecture within agreed constraints |
| Team-level strategy and annual roadmap | Sprint task prioritization within a sprint |
| Escalations to senior leadership | On-call rotations, runbooks, incident response |
| Defining culture norms and values | Knowledge-sharing sessions and tech talks |
| Cross-team dependency negotiations | Code review approvals for most PRs |

## Management Anti-Patterns

**Seagull Management** — Fly in, make noise, dump criticism without context, fly out. Absent during the build; present only to blame. Destroys trust in weeks.

**Hero Culture** — Rewarding firefighting over fire prevention. Engineers get praise for fixing outages they caused, creating a perverse incentive to break things. Eliminate by celebrating prevention and blameless post-mortems.

**Micromanagement** — Daily status check-ins on tasks, rewriting engineers' code, requesting updates before a reasonable turnaround window. The implicit message: "I don't trust you." Kills autonomy and initiative.

**Over-Abstracting Up** — Presenting only rosy summaries to leadership; hiding real team pain, risks, or blockers. Prevents leadership from helping and creates a credibility cliff when reality surfaces.

**The Brilliant Jerk** — Tolerating poor behavior from a high-output individual. Research consistently shows this tanks psychological safety and overall team performance. Kim Scott's "Radical Candor" frames this as "ruinous empathy" — avoiding hard conversations that must happen.

## Measuring EM Effectiveness

| Category | What to Measure | How to Measure |
|---|---|---|
| Delivery | Sprint velocity trend, milestone hit rate, P0 count | Jira/Linear dashboards |
| Quality | DORA: deployment frequency, lead time, MTTR, change failure rate | CI/CD + incident tracker |
| People | Attrition rate, eNPS, 1:1 completion rate | HR system, pulse surveys |
| Growth | Promotions granted, skill development goals completed | Performance system |
| Culture | Retro action item completion, psychological safety survey | Retro notes, quarterly survey |

## Common Pitfalls

- Confusing "being liked" with "being effective" — great managers make hard calls that may be unpopular short-term
- Skipping 1:1s during crunch periods — exactly when they are most needed
- Measuring team health only via output metrics; velocity can stay high while morale is collapsing
- Not building peer relationships before needing them during a cross-team dependency or escalation
- Waiting for the right moment to give feedback — deliver it within 24–48 hours while context is fresh

## Review Questions

1. A senior engineer is struggling to meet deadlines. Using the Situational Leadership model, how would you diagnose their development level and select an appropriate style?
2. You inherit a team with a visible "hero culture" where outages are celebrated as war stories. What three concrete actions would you take in the first 90 days?
3. What is the fundamental difference between a Tech Lead Manager and a People Manager, and how do you decide which model is appropriate for your current situation?
4. A new EM asks: "I feel guilty for not coding anymore. Is that normal?" How would you respond?

#Engineering #Leadership
