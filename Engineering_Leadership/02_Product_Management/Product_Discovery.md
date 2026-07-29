---
title: Product Discovery
aliases: [JTBD, Jobs to Be Done, Double Diamond, Opportunity Solution Tree, User Research]
tags: [Engineering, Leadership, Management, ProductDiscovery, JTBD, UserResearch]
domain: Engineering Leadership
difficulty: Intermediate
created: 2026-07-29
related: [Product_Manager_Overview, Product_Strategy, Agile_Product_Delivery, Product_Analytics_and_Metrics]
status: complete
---

# Product Discovery

> [!abstract] TL;DR
> Discovery is the PM's process for understanding customer problems deeply enough to build solutions that actually work. It uses the Double Diamond (diverge then converge), Jobs-to-Be-Done (why customers hire products), and the Opportunity Solution Tree (mapping from outcomes to experiments). The goal: validate the problem before building the solution.

## The Double Diamond Model (UK Design Council)

```
  Discover      Define        Develop       Deliver
 (Diverge)    (Converge)    (Diverge)     (Converge)
─────────────────────────────────────────────────────
    ◇◇◇◇         ◇          ◇◇◇◇◇          ◇
   Broad         Right       Multiple      Right
   research      problem     solutions     solution
```

**Phase 1 — Discover:** Open-ended exploration of the problem space. User interviews, field research, data analysis. Resist the temptation to define the problem until you have explored broadly.

**Phase 2 — Define:** Synthesize research into a clear problem statement. "We are solving for [person] who needs to [job] but currently [obstacle]."

**Phase 3 — Develop:** Generate multiple solution ideas without committing. Sketches, prototypes, experiments.

**Phase 4 — Deliver:** Converge on one approach; build, test, and ship incrementally.

The most common mistake: skipping Discover and going straight to Develop. Teams that do this build solutions to problems they invented.

## Jobs-to-Be-Done (JTBD) Framework

**Core idea (Clayton Christensen):** Customers do not buy products — they "hire" them to do a job. Understanding the job better than competitors is the source of product advantage.

### The Job Structure
```
When I am [situation],
I want to [motivation / job to be done],
So I can [expected outcome].
```

### JTBD vs. User Stories

| | User Story | Job Story |
|---|---|---|
| Focus | User type + feature | Situation + motivation + outcome |
| Example | "As a commuter, I want to save favorite routes so I can find them quickly." | "When I'm running late in the morning, I want to launch my regular commute without thinking, so I can focus on not missing my train." |
| Usefulness | Sprint-level execution | Strategic design and discovery |

JTBD is a discovery tool; user stories are a delivery tool. They serve different phases.

### Functional, Social, and Emotional Jobs

Every job has three layers:
- **Functional:** The practical task the customer needs to complete ("file my taxes")
- **Social:** How completing it makes them appear to others ("be seen as a responsible adult")
- **Emotional:** How they want to feel while doing it ("confident that I'm not missing anything")

Products that serve only the functional job are easily commoditized. Products that serve all three layers create deep loyalty.

## User Research Methods

### Research Method Selection Matrix

| Method | Best For | Time Investment | Generalizability |
|---|---|---|---|
| **User Interviews** | Understanding motivations, mental models, workflows | Medium (1h/participant) | Low (qualitative) |
| **Surveys** | Quantifying attitudes; validating qualitative hypotheses | Low per respondent | High (with large N) |
| **Usability Testing** | Finding friction in existing or prototype flows | Medium | Medium |
| **Diary Studies** | Longitudinal behavior in natural context | High | Medium |
| **Contextual Inquiry** | Observing work as it actually happens | High | Medium |
| **Session Recording** (FullStory, Hotjar) | Identifying UX friction at scale | Low (automated) | High |

### How to Run a User Interview

**Before:**
- Write a discussion guide (not a script) — open-ended questions only
- Recruit participants who actually have the problem (not just users of your product)
- Time-box to 45–60 minutes

**Opening:** "We're here to learn from you, not to test you. There are no right or wrong answers. We'll spend most of the time hearing about your experience."

**Core question types:**

| Type | Example |
|---|---|
| Walk me through | "Walk me through the last time you [task]." |
| Tell me about a time | "Tell me about the most frustrating part of [workflow]." |
| Five Whys | "Why do you do it that way?" → "Why is that?" → (repeat) |
| Silent probe | Nod, pause. Let the silence invite elaboration. |
| Clarification | "Can you say more about what you meant by [phrase]?" |

**Avoid:** Hypotheticals ("Would you use a feature that..."), leading questions ("Do you find it frustrating when..."), feature requests ("What features would you want?").

**After:** Debrief within 30 minutes. Write up insights in three buckets: behaviors observed, quotes (exact words), and implications.

## Opportunity Solution Tree (Teresa Torres)

A visual framework for connecting a desired outcome to the opportunities discovered through research, the solutions proposed to address those opportunities, and the experiments designed to test those solutions.

```
Desired Outcome
└── Opportunity 1 (customer problem / unmet need)
│   ├── Solution A
│   │   └── Experiment A1
│   └── Solution B
│       └── Experiment B1
└── Opportunity 2
│   └── Solution C
│       └── Experiment C1
└── Opportunity 3
    └── ...
```

### How to Use the OST
1. **Define the desired outcome** (a product metric you are trying to move — not a feature)
2. **Populate opportunities** from user research — each is a customer need, pain, or desire
3. **Generate solutions** — multiple per opportunity; do not collapse immediately to one
4. **Design experiments** — smallest possible test to validate that the solution actually addresses the opportunity

## Continuous Discovery Habits (Teresa Torres)

Weekly touchpoints with real customers — not quarterly research sprints. The goal: discovery is a continuous background process, not a phase.

| Habit | Frequency | Activity |
|---|---|---|
| Customer interviews | Weekly (at least 1) | Identify new opportunities |
| Assumption mapping | Ongoing | Map what must be true for solution to work |
| OST updates | Bi-weekly | Add new opportunities; retire invalidated ones |
| Experiment review | Sprint-level | Review experiment results; update OST |

## Problem vs. Solution Framing

### The Golden Rule of Discovery
Always fall in love with the problem, not the solution. When a team is attached to a solution, they stop discovering and start confirming.

**Problem frame:** "Our users struggle to find items they've previously viewed. What is causing this?"
**Solution frame:** "We should build a recently-viewed shelf." (Often stated before the problem is understood.)

Signs you are in solution frame too early:
- User interviews become demos
- Research findings are used to confirm the solution, not challenge it
- The team is "doing discovery" on a solution the VP already decided to build

## Synthesizing Research into Insights

Raw observations are not insights. An insight is an interpretation of observations that implies a direction.

| Level | Example |
|---|---|
| **Observation** | "5 of 8 users said they use a spreadsheet alongside our product." |
| **Pattern** | "Users commonly augment our product with external tools." |
| **Insight** | "Our product doesn't give users enough control over their data, so they export it to tools where they feel in control." |
| **Implication** | "We need to either improve in-product data manipulation or build better export/integration capabilities." |

## Common Pitfalls

- Running user interviews as demos or sales pitches — you learn nothing from users who are being sold to
- Selecting research participants from happy-path users — the most important insights come from users who struggle
- Treating all user requests literally ("build this feature") instead of asking why they want it
- Stopping discovery once a solution enters development — assumptions discovered mid-build are far cheaper to address than post-launch
- Using surveys to understand why — surveys quantify what; interviews explain why

## Review Questions

1. A PM says: "We did the discovery. We interviewed 5 customers and they all said they wanted a dashboard." What is wrong with this discovery approach, and what would you ask next?
2. Convert this user story into a JTBD job story: "As a freelancer, I want to create invoices quickly so I can bill clients faster."
3. Build an Opportunity Solution Tree for this desired outcome: "Increase the percentage of new users who complete onboarding."
4. What is the difference between an observation, a pattern, and an insight? Give an example of each for a shopping app where users frequently abandon their cart.

#Engineering #Leadership
