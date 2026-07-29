---
title: Staff Plus Engineering
aliases: [Staff Engineer, Principal Engineer, Will Larson, Staff Archetypes, Glue Work]
tags: [Engineering, Leadership, Management, StaffEngineer, PrincipalEngineer, StaffPlus]
domain: Engineering Leadership
difficulty: Advanced
created: 2026-07-29
related: [Technical_Leadership, Engineering_Organization_Design, Communication_and_Influence, People_Management]
status: complete
---

# Staff Plus Engineering

> [!abstract] TL;DR
> Staff+ engineers are senior ICs whose scope extends beyond the team to the organization and company. Will Larson's framework identifies four archetypes: Tech Lead, Architect, Solver, Right Hand. The defining characteristic is operating at organizational scope — setting technical strategy, navigating politics, and unblocking whole teams — not just being the best coder on the team.

## Senior vs. Staff: The Scope Shift

The most important thing to understand about the Staff+ transition is that it is not about being a "better senior engineer." It is about a fundamental change in scope:

| Level | Scope | Primary Leverage |
|---|---|---|
| Senior Engineer (E5) | Team | Deep technical execution; mentors E3/E4 |
| Staff Engineer (E6) | Multiple teams / org | Technical strategy; unblocks teams; cross-team influence |
| Principal Engineer (E7) | Company | Shapes major technical investments; org-wide direction |
| Distinguished / Fellow | Business unit / industry | Defines category-level technical direction |

The "scope" is not just how many people you talk to — it is the time horizon and organizational reach of the problems you work on. Staff engineers think in quarters and organization-wide impact; seniors think in sprints and team-level impact.

## The Four Staff Engineer Archetypes (Will Larson)

From Larson's "Staff Engineer: Leadership Beyond the Management Track" (2021):

### 1. Tech Lead
- **Focus:** Aligning the technical direction of one large team or a group of teams
- **Typical activities:** Design reviews, setting technical standards, guiding the team's approach to large projects
- **Relationship to EM:** Closest partnership; often co-leads with the EM (EM owns people; TL owns technical direction)
- **Example:** Staff engineer on the Payments team who owns all technical decisions for the team's distributed transaction system

### 2. Architect
- **Focus:** Responsibility for a specific technical domain across the entire organization
- **Typical activities:** Cross-team architecture alignment, writing strategy documents, API contracts between services, technology selection for a class of problems
- **Organizational presence:** Often works across many teams; does not "belong" to one product team
- **Example:** Staff architect who owns the event-driven messaging architecture standards used by all 12 product teams

### 3. Solver
- **Focus:** Fixing the hardest, most ambiguous technical problems wherever they exist in the organization
- **Typical activities:** Deep-dive investigations, performance crises, security vulnerabilities, technical debt that no team wants to own
- **Organizational model:** "Dropped into" problems; does not have a permanent team; high autonomy
- **Example:** Staff engineer who spent Q2 resolving a cross-team database contention issue causing SLA breaches across four services

### 4. Right Hand
- **Focus:** Extending the leadership reach of a senior engineering executive (VP, SVP)
- **Typical activities:** Representing the exec in technical forums, identifying cross-org problems, driving initiatives that span many teams
- **Organizational model:** Close to executive leadership; often unofficial chief of staff for technical matters
- **Example:** Staff engineer who operates as a technical extension of the VP of Engineering, owning the engineering health initiative across six teams

## Operating as a Staff+ Engineer

### Writing Technical Strategy Documents

A technical strategy document is not a design doc. It operates at a higher level of abstraction:

| Document Type | Scope | Horizon |
|---|---|---|
| Design Doc / RFC | One system or feature | Weeks to months |
| ADR | One decision | Months to years |
| **Technical Strategy** | Domain or org-wide direction | 1–3 years |
| Engineering Principles | All engineering decisions | Indefinite |

**Technical Strategy Document Structure:**
```
1. Context (why this domain matters now)
2. Current State (honest assessment of where we are)
3. Target State (where we want to be in 18–36 months)
4. Key Bets (3–5 specific investments that move from current to target)
5. Risks and Dependencies (what could go wrong; what we need from other teams)
6. Non-Goals (what this strategy explicitly does not address)
```

### Navigating Organizational Politics

"Politics" in engineering organizations is often shorthand for "navigating situations where reasonable people disagree and organizational dynamics determine outcomes." Refusing to engage with this is not idealism — it is ineffectiveness.

**How staff+ engineers navigate politics:**
- **Build coalitions early** — bring people into design decisions before announcing them. Consensus-building is not weakness; it is strategy.
- **Understand the other team's constraints** — an opposing stance from another team often reflects real constraints, not bad faith. Ask before assuming.
- **Separate the decision from the relationship** — "I disagree with this architectural direction" and "I respect you as an engineer" can coexist.
- **Disagree and commit publicly** — once a decision is made through a legitimate process, advocate for it even if you preferred a different outcome.

### Sponsoring Junior Engineers

One of the most important leverage points for staff+ engineers: actively sponsoring E3/E4 engineers.

Sponsorship looks like:
- Recommending a junior engineer for a high-visibility project
- Saying their name in promotion calibrations ("Her impact on the search reliability work was as important as anyone's")
- Inviting them to design reviews so they can learn by observing, then contributing
- Reviewing their work publicly in a way that elevates their standing

## The Glue Work Problem

"Glue work" (Tanya Reilly, 2019) is the non-technical work that holds teams together: writing documentation, onboarding new engineers, coordinating cross-team alignment, organizing knowledge-sharing sessions.

**The problem:** Glue work is essential and undervalued. It is performed disproportionately by women and underrepresented engineers. It does not map to technical career ladders that reward code output. Engineers who do disproportionate glue work get stuck at their level despite outsized organizational impact.

**How EMs and Staff Engineers should address it:**
1. **Recognize glue work explicitly** in performance reviews — name it, value it, include it in promotion narratives
2. **Distribute it deliberately** — glue work should be shared, not defaulted to whoever most readily says yes
3. **For the engineer doing it:** Pair glue work with technical work that is visible to the promotion committee. Glue work alone rarely leads to promotion; technical depth + glue work does.

## Technical Program Manager (TPM) Role

The TPM sits between staff engineering and program management. Where a Staff Engineer owns the technical direction of a problem, a TPM owns the cross-team execution of a large technical program.

| | Staff Engineer | TPM |
|---|---|---|
| Primary skill | Technical judgment | Program execution and cross-team coordination |
| Output | Technical decisions, strategy docs | Program milestones, dependency management, risk mitigation |
| Closest analog | Architect | Senior Project Manager (technical domain) |

Large organizations (FAANG, enterprise tech) have both. Small organizations often expect staff engineers to carry TPM responsibilities.

## Making the Case for Long-Term Technical Investments

Staff engineers are often the only people who can make the case for investments that pay off in years, not quarters. The challenge: the cost is immediate; the benefit is future and often counterfactual ("disasters that did not happen").

### The Long-Term Investment Pitch Framework

1. **Current state (cost of inaction):** Quantify the ongoing pain — developer hours, incident frequency, deployment risk
2. **Risk projection:** If we do nothing for 12 months, what does the situation look like?
3. **Proposed investment:** Scope, timeline, team cost
4. **Expected return:** What becomes possible that is currently impossible? What cost does it eliminate?
5. **Analogies:** "When [other company] made this investment, they saw [result]"

The key insight: position the investment not as "paying down debt" (engineering-centric framing) but as "enabling the next product phase" (business-centric framing).

## Common Pitfalls

- Staff engineers who become "glue generalists" — doing all the coordination work but no technical work. They lose technical credibility fast.
- Architects who design in isolation and drop designs on teams without building consensus — the design gets ignored or worked around
- Conflating "influence" with "getting your own way" — influence is the ability to shape outcomes; sometimes that means your second-best option wins through consensus
- Spending all time in meetings and none writing — at staff+, writing strategy docs IS the job; meeting attendance without written output is invisible impact
- Not making the invisible work visible — staff+ impact is often counterfactual ("the disaster that didn't happen") and must be named in writing to be credited at promotion time

## Review Questions

1. An E5 engineer is being considered for E6 promotion. Their manager says "they're technically excellent but their scope is still team-level." Using the Staff Engineer archetypes, what behaviors would you look for to confirm or deny that they're operating at E6?
2. A Staff Architect proposes a new event-driven architecture for the organization. Three of the five affected teams push back. Using the political navigation framework, what should the architect do before their next presentation?
3. An engineer who has been performing glue work for 18 months was passed over for promotion. What systemic failure occurred, and what should the EM and the engineer do differently?
4. Describe the difference between a design doc and a technical strategy document. When would you write each?

#Engineering #Leadership
