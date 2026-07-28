---
title: "Pareto Distribution — 80/20 Rule Animation"
id: SM148
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, complexity, pareto, 80-20-rule, power-law, lorenz-curve]
---

> **What it is:** A ~45-second simulation short where a Lorenz curve animates into existence showing the bottom 80% of a population owning only 20% of wealth, with nested self-similar levels revealing the fractal structure of Pareto inequality, demonstrating that the 80/20 rule is an exact consequence of a power law with exponent α ≈ 1.16. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Pareto Distribution — 80/20 Rule Animation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A Lorenz curve animates into existence: the x-axis is the cumulative fraction of the population (poorest to richest), the y-axis is the cumulative fraction of wealth owned. The curve bows severely downward — the bottom 80% own only 20% of the wealth. The area between the curve and the diagonal is the Gini coefficient.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Pareto distribution: P(x) = (α/x_min)·(x_min/x)^(α+1) for x ≥ x_min. The 80/20 rule: for α = log(5)/log(4) ≈ 1.16, 20% of the population own 80% of the wealth. Caption: "α = log5/log4 ≈ 1.16 → 80/20 Pareto rule." Show the derivation: bottom 80% own 20% → (0.8)^α / (0.2)^(1-α).

**0:10–0:18** — Lorenz curve for Pareto: L(p) = 1 - (1-p)^(1-1/α). For the 80/20 rule (α=1.16): L(0.8) = 0.2. Gini coefficient: G = 1/(2α-1) for α>1. For α=1.16: G = 1/(2·1.16-1) = 1/1.32 ≈ 0.76. Caption: "Gini = 1/(2α-1) — for α=1.16: G≈0.76." Show Gini vs α.

**0:18–0:27** — Self-similar: the Pareto distribution is scale-free — among the top 20%, the richest 20% own 80% of that group's wealth. Among the top 4%, the richest 4% own 80% of that. Ad infinitum. Caption: "Self-similar: among the top 20%, again 80/20 — fractal inequality." Animate nested Pareto levels.

**0:27–0:36** — Other 80/20 phenomena: 80% of bugs come from 20% of code; 80% of sales from 20% of customers; 80% of health costs from 20% of patients; 80% of citations to 20% of papers. Show all as Lorenz curves on one plot — all bow similarly. Caption: "Code bugs, sales, health costs, citations — all 80/20." The 80/20 rule is the same Pareto exponent α≈1.16.

**0:36–0:45** — The Pareto principle in management: focus 80% of effort on the 20% of issues that drive 80% of the outcome (the "vital few vs trivial many"). Caption: "Vital few vs trivial many — Pareto principle in management." Bold text: "Pareto — the 80/20 rule is always a power law." Fade to black.

## Physics Concept Teased
Pareto distribution: P(x)∝x^(-α-1) for x≥x_min. The 80/20 rule corresponds to α=log(5)/log(4)≈1.16. The Lorenz curve L(p) = 1-(1-p)^(1-1/α) and Gini coefficient G=1/(2α-1) are exact. The distribution is self-similar: within the top 20%, the 80/20 rule applies again. The Pareto principle appears in wealth, bugs, sales, citations, and health costs.

## On-Screen Text / Captions
- **0:00** — "Bottom 80% own 20% of wealth — the 80/20 rule."
- **0:05** — "Pareto: P(x) ∝ x^(-α-1), α=log5/log4 ≈ 1.16"
- **0:12** — "Lorenz: L(p) = 1-(1-p)^(1-1/α); Gini = 1/(2α-1)"
- **0:20** — "Self-similar: among top 20%, again 80/20 — fractal"
- **0:28** — "Bugs, sales, health costs, citations — all 80/20"
- **0:35** — "Vital few vs trivial many — Pareto management principle"
- **0:43** — "Pareto — 80/20 is always a power law."

## End Card
Final 3 seconds: the Lorenz curve, Gini=0.76, nested 80/20 levels marked. Text: "Pareto originally measured land distribution in Italy in 1897 — 80% of land was owned by 20% of people." CodedLaws logo.

## Audio
Quiet, reflective piano. Voiceover at 0:00: "The 80/20 rule is not a management cliche — it's a mathematical consequence of the Pareto power law, and it applies everywhere inequality accumulates." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D (animated Lorenz curve). Key algorithm: draw the Lorenz curve L(p) = 1-(1-p)^(1-1/α) analytically, sweeping α from 1.01 to 3. At α=1.16: 80/20 rule (verify L(0.8)=0.2). Animate Gini=1/(2α-1) as α changes. Show nested self-similarity: overlay L(p) for the top 20% — same curve. For the 80/20 in other domains: generate synthetic data from Pareto distribution and compute Lorenz curves. Runtime: fast, Canvas 2D analytical computation.
