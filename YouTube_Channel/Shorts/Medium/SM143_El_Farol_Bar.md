---
title: "El Farol Bar Problem — Inductive Reasoning"
id: SM143
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, complexity, el-farol, bounded-rationality, inductive-reasoning, emergent-coordination]
---

> **What it is:** A ~45-second simulation short where 100 agents independently decide each week whether to attend a 60-seat bar using heterogeneous predictors, and the attendance time series self-organises around exactly 60 without any coordination, demonstrating why deductive reasoning fails and inductive bounded rationality succeeds. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: El Farol Bar Problem — Inductive Reasoning

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A bar with capacity 60. Every Thursday, 100 people independently decide whether to go. The rule: if you expect more than 60 people, stay home; if fewer, go. But everyone knows everyone else is applying the same rule. No equilibrium — except the bar is crowded exactly 60% of the time, on average.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Arthur (1994): the El Farol bar problem in Santa Fe, New Mexico. 100 agents, bar capacity 60. Each week: if you think attendance < 60, go; else stay. The problem: any common prediction is self-defeating. If all predict < 60 → all go → overcrowded (prediction wrong). If all predict > 60 → none goes → empty (prediction wrong). Caption: "Deductive logic fails — any common prediction is wrong."

**0:10–0:18** — Inductive solution: agents maintain a set of predictors (rules like "last week's attendance," "2-week average," "odd/even oscillation"). Each week, each agent uses their currently best predictor. Caption: "Agents use multiple predictors — switch to the best-performing one." No agent uses the same rule — heterogeneous strategies coexist.

**0:18–0:27** — Emergent coordination: the attendance oscillates around the capacity 60, never settling. But the time-average is exactly 60 (self-organisation). No agent coordinates with any other. No central planner. The system self-organises into an efficient ecology of strategies. Caption: "Self-organising: attendance oscillates around 60 — average exactly 60."

**0:27–0:36** — Minority game connection (next short): the El Farol problem is the progenitor of the minority game. In both, agents prefer to be in the minority. The minority game has an exact solution (with random strategy assignment). Caption: "Minority game: El Farol with exactly 2 choices — solvable." Connect to SM144.

**0:36–0:45** — Real analogies: (1) Trading in financial markets — too many buyers → price rises → buyers become sellers. (2) Peak-hour traffic — too many drivers → avoid peak. (3) Vaccine adoption — too many vaccinated → free riders appear. All are El Farol in disguise. Caption: "Markets, traffic, vaccines — all El Farol problems." Bold text: "El Farol — bounded rationality defeats logic." Fade to black.

## Physics Concept Teased
El Farol bar problem: 100 bounded-rational agents decide whether to attend a crowded bar using heterogeneous predictors (past attendance patterns). Deductive reasoning fails (any common predictor is self-defeating). Inductive reasoning — using a portfolio of simple predictors and switching to the best-performing — leads to self-organised attendance around the capacity, with no coordination and no central planner.

## On-Screen Text / Captions
- **0:00** — "60 seats, 100 people — no one can reason deductively."
- **0:05** — "Any common prediction is self-defeating"
- **0:12** — "Inductive: each agent uses a portfolio of predictors"
- **0:20** — "Self-organising: attendance oscillates around 60"
- **0:28** — "Minority game: El Farol with 2 choices — solvable"
- **0:35** — "Markets, traffic, vaccines — all El Farol"
- **0:43** — "El Farol — bounded rationality defeats pure logic."

## End Card
Final 3 seconds: attendance time series — jagged oscillations around the horizontal line at 60. Text: "Brian Arthur's 1994 paper launched the field of agent-based economics and complexity in finance." CodedLaws logo.

## Audio
Bar noise — chatter and glass clinking. Voiceover at 0:00: "If you try to reason about what everyone else will do, you create a loop with no solution. The only way out is trial-and-error — which the market, surprisingly, solves." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D (attendance time series plot + bar visualisation). Key algorithm: Arthur (1994) inductive model. Each agent has S=2–5 predictors drawn randomly from a pool of k historical attendance values (e.g., "last week," "2-week avg," "same week last year," "odd/even"). Each week: agent uses their currently best predictor (highest accuracy in recent M weeks). They go if prediction < 60, else stay. After each week: update predictor accuracies. Run 500 weeks. Plot attendance(t) and show average = 60. Runtime: fast, Canvas 2D.
