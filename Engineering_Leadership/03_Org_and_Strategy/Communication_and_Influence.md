---
title: Communication and Influence
aliases: [BLUF, Amazon 6-Pager, Executive Communication, Influencing Without Authority, Engineering Communication]
tags: [Engineering, Leadership, Management, Communication, Influence, ExecutiveCommunication]
domain: Engineering Leadership
difficulty: Intermediate
created: 2026-07-29
related: [Engineering_Manager_Overview, Engineering_Organization_Design, Staff_Plus_Engineering, Team_Building_and_Culture]
status: complete
---

# Communication and Influence

> [!abstract] TL;DR
> Engineering leadership is an influence sport. Most of the decisions that matter — headcount, roadmap priority, technical strategy, reorgs — require persuading people who do not report to you. This note covers the key communication formats (Amazon 6-pager, BLUF, status updates), how to present to executives, and how to build cross-functional influence that lasts.

## Engineering Communication Modes

| Mode | Audience | Format | Cadence |
|---|---|---|---|
| **Status Update** | Manager, stakeholders | Written; bulleted | Weekly |
| **Design Review** | Engineering peers, EM, architects | Written doc + Q&A | Per project |
| **Post-Mortem** | Engineering team, stakeholders | Written document | Within 48h of P1/P2 |
| **Incident Report** | Leadership, customers, CS | Written; executive-friendly | Within 24h of resolution |
| **All-Hands / Town Hall** | Full engineering org | Slide deck + live Q&A | Quarterly |
| **ADR (Architecture Decision Record)** | Engineering team, future readers | Structured document | Per significant decision |
| **Strategy Document** | Leadership, cross-functional peers | Long-form narrative | Annually or per initiative |

## Writing Well: The Foundation of Engineering Leadership

At senior levels, writing IS the job. Decisions made in Amazon, Google, and other high-scale organizations are made through documents, not in real-time verbal debates. Clear writing reveals clear thinking.

### Three Principles of Engineering Writing
1. **Lead with the conclusion** — do not make the reader work to find what you are asking for or recommending
2. **Separate facts from interpretations from recommendations** — clearly labeled; never blended
3. **Write for the reader who will skim** — use headers, bullets, and bold to make the structure navigable

### Common Writing Failures
- Burying the recommendation on page 4 after 3 pages of background
- Using passive voice to obscure responsibility: "It was decided..." → who decided?
- Writing for your own thought process rather than the reader's understanding
- Including everything you researched rather than everything the reader needs

## The Amazon 6-Pager Format

Amazon's famous ban on slide decks in favor of written memos (6-page maximum narrative). The format forces writers to think through their arguments and prevents the "impressive-looking slides hiding weak thinking" failure mode.

### 6-Pager Structure

| Section | Content | Length |
|---|---|---|
| **Heading** | Title, date, author, status | 1–2 lines |
| **Executive Summary** | What we recommend and why — the entire doc in 3–5 sentences | Half page |
| **Background** | Context the reader needs to evaluate the proposal | 1 page |
| **Problem/Opportunity** | Clear statement of what we are solving for | Half page |
| **Proposal** | The recommendation in detail | 2 pages |
| **Alternatives Considered** | What else we evaluated and why we rejected it | 1 page |
| **FAQs / Open Questions** | Anticipated objections and honest unknowns | Half page |

**Meeting format:** Attendees read the memo silently for the first 15–20 minutes, then discuss. This ensures everyone has the same level of understanding before the conversation begins.

### When to Use a 6-Pager
- Requesting significant headcount or budget
- Proposing a major architectural change
- Recommending a strategic direction change
- Making a build/buy/partner decision

## BLUF: Bottom Line Up Front

**BLUF** = state your conclusion, recommendation, or ask in the first sentence. Everything that follows is supporting evidence for readers who want more depth.

### BLUF Template
```
[Recommendation / Request / Conclusion in 1–2 sentences]

[Why: key reasoning — 2–3 bullets]

[What I need from you: specific ask or decision required]

[Timeline: by when]
```

### BLUF Examples

Without BLUF (common EM mistake):
> "We've been looking at our CI pipeline and noticed some patterns. After digging into the data, we found that build times have increased. We talked to the team and there are several factors at play. One of the things we've been considering is..."

With BLUF:
> "I'm requesting one sprint of platform team support to reduce our CI build time from 22 minutes to under 8 minutes — this will save the team ~15 hours/week and reduce deployment cycle time by 60%. The root cause is parallel test execution is disabled. I need a go/no-go decision by Friday so I can schedule it for next sprint."

## Presenting to Executives

### What Executives Want
- **Time-efficient:** They have 12 other things after this meeting
- **Decision-oriented:** What do you need from them — a decision, approval, or awareness?
- **Risk-explicit:** What could go wrong, and what is the plan?
- **Business-contexted:** How does this connect to company goals or financials?

### The Three-Option Frame
Never bring a recommendation without alternatives. "Here are three options. I recommend Option 2. Here is why Option 1 is cheaper but riskier, and why Option 3 is safest but too slow."

This frame:
- Demonstrates you did the analysis
- Respects executive agency (they do not feel rubber-stamping)
- Surfaces hidden constraints (executive may have context that eliminates one of your options)

### Executive Communication Checklist
- [ ] First slide/paragraph states the recommendation and the ask
- [ ] Business impact is quantified (revenue at risk, cost savings, user impact)
- [ ] Top 2–3 risks are named with mitigations
- [ ] Timeline is clear with key milestones
- [ ] The specific decision or approval required is stated explicitly

## Influencing Without Authority

Most engineering leadership impact happens across organizational lines — without org chart authority. This is the central skill of staff+ engineers and senior EMs.

### The Influence Stack (ranked by durability)

| Level | Mechanism | Example |
|---|---|---|
| 1. **Trust** | Credibility built over time through consistency and competence | "When Alice says something is risky, I listen — she's always right about these things" |
| 2. **Relationships** | Personal connection that makes friction lower | Peer EM calls Alice before the meeting to align |
| 3. **Evidence** | Data, case studies, analogies | "Here's what happened when Netflix made this choice" |
| 4. **Logic** | Sound reasoning and clear framing | The BLUF + 3-option framework |
| 5. **Position / Title** | "I'm a Director, so..." | Fragile; breeds resentment; last resort |

Influence built on trust and relationships is compounding. Influence built on position is brittle and often counterproductive.

### Building Cross-Functional Relationships
- Have 1:1s with peer EMs, PMs, designers, and key stakeholders before you need them for a decision
- Do what you say you will do — every dropped commitment erodes influence capital
- Acknowledge others' constraints in your proposals: "I know the CS team has bandwidth constraints — this is how I've sized the rollout to minimize their support volume"
- Give credit publicly; take responsibility for failures privately

## Managing Conflict with Peers

### The Conflict Escalation Ladder
1. **Direct conversation** — "I noticed we have different views on X. Can we talk?" Most conflicts resolve here.
2. **Structured alignment session** — Bring data; agree on the facts before arguing about conclusions
3. **Disagree and commit** — Jeff Bezos's principle: if we cannot reach consensus but must move, commit to a direction and execute fully
4. **Escalate** — Bring to shared manager only when the stakes are high and direct resolution has genuinely failed

### Giving Critical Feedback in Public vs. Private

**Rule:** Praise publicly, critique privately. There are very few exceptions.

Exceptions (critique may be appropriate in public):
- Safety/compliance violation observed in the moment
- Factual correction in a technical forum where silence would be misleading
- When the behavior affects the group and the group needs to hear the response

Even in these exceptions, the critique is of the idea or action — never of the person.

## Negotiating Resources and Headcount

### The Business Case Frame
Every headcount or budget request must answer:
- **What outcome is this investment buying?** (Not "what tasks will they do")
- **What is the cost of NOT making this investment?** (Opportunity cost, risk cost)
- **What is the ROI?** (Even a rough estimate is better than none)

### Headcount Request Template
```
Ask: 1 additional senior engineer (E5) for the platform team.

Business Case:
- Current CI build time: 22 min → target: 8 min
- Impact: 15 hours/week of engineer time recovered across team of 12
- Annualized: ~$180K of engineering capacity currently wasted
- Cost of hire: ~$220K total comp
- Payback period: 14 months; then pure leverage

Risk of not hiring:
- CI time will continue to grow as codebase scales
- Developer satisfaction scores (currently 6.2/10) likely to decline further
- Estimated attrition risk: 1 engineer in next 6 months if toil continues
```

## Common Pitfalls

- Sending a 6-pager to someone who needed a 3-bullet slack message — match communication format to audience and decision
- Presenting options to executives but making one option so obviously weak it is not real — executives notice and lose confidence in the analysis
- Influencing through authority ("I'm an EM, so this should happen") rather than logic and trust — it works once; it destroys relationships for months
- Running status meetings with no decisions made — every meeting should produce a decision or a named next step
- Over-communicating internally (endless status docs) while under-communicating to stakeholders — calibrate frequency to what the audience actually needs

## Review Questions

1. Rewrite this email in BLUF format: "I've been looking at our deploy process and there's been some discussion on the team about the number of steps involved. A few people have raised concerns and I wanted to bring it to your attention. There may be some opportunities to streamline things."
2. You are requesting two additional engineers from your VP. Write a three-bullet business case using the headcount request template.
3. A peer EM disagrees with your architectural decision and is escalating to leadership. Before escalation reaches your shared director, what steps would you take using the conflict escalation ladder?
4. You need to present a proposal to retire a legacy system to the CTO. The proposal is complex. Do you write a 6-pager or build slides? Justify your choice, and outline the structure.

#Engineering #Leadership
