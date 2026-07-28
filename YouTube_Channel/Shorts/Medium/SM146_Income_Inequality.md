---
title: "Income Inequality — Power Law Tail"
id: SM146
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, econophysics, income-inequality, pareto, power-law, gini-coefficient]
---

> **What it is:** A ~45-second simulation short where multiplicative Kesten wealth dynamics generate a dramatic power-law Pareto tail in the upper distribution, with the Lorenz curve bowing sharply and the Gini coefficient reaching 0.85, demonstrating the physics of wealth concentration and how redistribution truncates the tail. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Income Inequality — Power Law Tail

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A wealth histogram on a linear scale — exponential bulk at low wealth (SM145), then a dramatic power-law tail at the top. The top 1% own more than the bottom 50%. The Lorenz curve — how much wealth the bottom X% own — bows sharply downward. Gini coefficient: 0.85. Pure mathematical inequality.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Pareto distribution: the Italian economist Vilfredo Pareto (1897) observed that 20% of the Italian population owned 80% of the land — P(w > W) ∝ W^(-α) with α ≈ 1.5 for historical data. This is a power law: no characteristic wealth. Caption: "Pareto 1897: 80/20 rule — P(w>W) ∝ W^(-α), α≈1.5."

**0:10–0:18** — Model: the Kesten process. Wealth evolves multiplicatively: w_{n+1} = a_n · w_n + b_n (multiplicative shocks a_n with occasional additive shocks b_n). For ⟨ln a⟩ < 0 and E[a^α] = 1 (Kesten 1973): stationary distribution has power-law tail P(w) ∝ w^(-1-α). Caption: "Kesten process: multiplicative noise → power law P(w) ∝ w^(-1-α)."

**0:18–0:27** — Gini coefficient: G = (area between Lorenz curve and equality line)/(total area). G=0: perfect equality (L=diagonal). G=1: one person owns everything. In the simulation: show G growing as the power-law tail develops. Real data: USA G≈0.45 (income), G≈0.85 (wealth). Caption: "Gini: USA income ≈0.45, wealth ≈0.85 — very unequal."

**0:27–0:36** — Why power laws persist: (1) Returns on capital > economic growth rate (Piketty: r>g). (2) Preferential attachment in investment. (3) Multiplicative noise with a reflecting barrier at zero (the Kesten mechanism). Caption: "r > g (Piketty): capital grows faster than wages → power law persists." Show r vs g time series.

**0:36–0:45** — Redistribution: a wealth tax (or inheritance tax) cuts off the power-law tail — truncated Pareto distribution. Shows that the tail is not "natural" — it is maintained by specific economic dynamics. Caption: "Wealth tax: truncates power-law tail — smaller Gini." Bold text: "Power law inequality — a physics of wealth accumulation." Fade to black.

## Physics Concept Teased
Income/wealth inequality: the upper tail of the wealth distribution follows a power law P(w)∝w^(-1-α) (Pareto distribution), arising from multiplicative wealth dynamics (Kesten process): w_{n+1} = a_n·w_n + b_n. The Pareto exponent α is determined by E[a^α]=1. The Lorenz curve and Gini coefficient quantify inequality. Redistribution changes α and truncates the tail.

## On-Screen Text / Captions
- **0:00** — "80% of wealth — owned by 20%. Power law."
- **0:05** — "Pareto: P(w>W) ∝ W^(-α), α≈1.5 — no characteristic scale"
- **0:12** — "Kesten: w_{n+1} = a_n·w_n + b_n → power law tail"
- **0:20** — "USA wealth Gini ≈ 0.85 — one of the highest"
- **0:28** — "Piketty: r > g → wealth concentrates indefinitely"
- **0:35** — "Wealth tax: truncates power law, reduces Gini"
- **0:43** — "Power law — physics of accumulated wealth."

## End Card
Final 3 seconds: the log-log plot of wealth distribution — straight line (power law) in the upper tail. Text: "The Pareto distribution has infinite variance for α<2 — standard economic models that assume finite variance are invalid." CodedLaws logo.

## Audio
Quiet piano — contrast between the struggling many and the few. Voiceover at 0:00: "The power law tail of wealth is not a coincidence — it follows inevitably from multiplicative dynamics, the same mechanism as a chain reaction." No other voiceover.

## Production Notes
Code complexity: low-moderate. Renderer: Canvas 2D (log-log histogram + Lorenz curve + Gini animation). Key algorithm: Kesten process. N=1000 agents. w_i(0) = 1 for all. Each step: for each agent, w_i(t+1) = max(a_i·w_i(t) + b_i, w_min) where a_i ~ LogNormal(μ_a, σ_a) with ⟨ln a⟩<0, b_i ~ Exponential(λ). Tune parameters to get α≈1.5. Track Gini(t). Also run 2-regime model: random exchange (exponential bulk) + Kesten (power-law tail) for the top 10%. Lorenz curve: sort by wealth, plot cumulative wealth fraction vs cumulative agent fraction. Runtime: fast, Canvas 2D.
