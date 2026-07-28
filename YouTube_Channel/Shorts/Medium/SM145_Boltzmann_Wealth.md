---
title: "Boltzmann Wealth Distribution — Random Exchange"
id: SM145
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, econophysics, wealth-distribution, boltzmann, exponential, random-exchange]
---

> **What it is:** A ~45-second simulation short where 500 agents starting with equal wealth exchange money in random pairwise collisions, and the wealth histogram spontaneously broadens from a spike at $100 into an exponential Boltzmann distribution, demonstrating that inequality emerges inevitably from random exchange just as energy distributes in a gas. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Boltzmann Wealth Distribution — Random Exchange

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
500 agents, each starting with exactly $100. Random pairs meet and one gives a fixed amount to the other (like a gas molecule collision). After thousands of exchanges, the wealth distribution — initially a spike at $100 — broadens into an exponential (Boltzmann) distribution: most people are poor, a few are rich, purely by chance.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The yard-sale model: at each step, pick two random agents i and j. Transfer Δw from i to j (fixed or random fraction). The key constraint: no negative wealth (no debt). This is identical to elastic scattering in a gas — conserved total "energy" (wealth). Caption: "Random exchange = elastic collision — wealth is conserved."

**0:10–0:18** — Boltzmann distribution emerges: the steady-state wealth distribution is P(w) ∝ exp(-w/⟨w⟩). This is the Boltzmann (Maxwell-Boltzmann analogue) distribution. The most probable wealth is 0! Mean is ⟨w⟩ = W/N (total wealth/N agents). Caption: "Steady state: P(w) = (1/⟨w⟩)·exp(-w/⟨w⟩) — Boltzmann." Show histogram vs theoretical curve.

**0:18–0:27** — Why exponential: the wealth distribution is the Gibbs distribution of statistical mechanics. Wealth acts like energy; each transaction is a collision. The system maximises entropy subject to constant mean wealth — giving the exponential (Gibbs) distribution. Caption: "Maximum entropy + conserved mean → exponential distribution."

**0:27–0:36** — Comparison to real data: real income data (lower 90% of population) is well-fitted by an exponential. The top 1–10% show a power-law tail (Pareto distribution, next short SM146). The Drăgulescu-Yakovenko model (2001) compared to US income data. Caption: "Real data: lower 90% exponential, top 10% Pareto." Show data fit.

**0:36–0:45** — Savings propensity: if agents save a fraction λ of their wealth before each transaction, the distribution shifts from exponential to a Gamma distribution with a peak — more realistic. Caption: "With savings λ: Gamma distribution — peak at wealthier mean." Bold text: "Wealth = statistical mechanics — Boltzmann decides inequality." Fade to black.

## Physics Concept Teased
Random exchange model (econophysics): N agents exchange wealth in random pairwise transactions conserving total wealth. The steady-state distribution is the Boltzmann (exponential) distribution P(w) ∝ exp(-w/⟨w⟩), identical to the energy distribution in a gas at temperature T. Maximum entropy with conserved mean uniquely determines this distribution. Real lower-income data matches the exponential distribution.

## On-Screen Text / Captions
- **0:00** — "Random trading — Boltzmann wealth distribution."
- **0:05** — "Random exchange: wealth = energy, conservation holds"
- **0:12** — "P(w) = exp(-w/⟨w⟩) — Boltzmann, most probable w=0"
- **0:20** — "Max entropy + conserved mean → exponential"
- **0:28** — "Real data: lower 90% exponential, top 10% Pareto"
- **0:35** — "Savings λ: Gamma distribution — peak appears"
- **0:43** — "Boltzmann's gas → inequality explained."

## End Card
Final 3 seconds: histogram of 500 agents' wealth — smooth exponential curve, most agents near zero, a long tail. Text: "In a random-exchange economy, the most likely outcome for any individual is to be poor — even starting equal." CodedLaws logo.

## Audio
Busy trading floor sounds — exchanges, transactions. Voiceover at 0:00: "If people trade randomly — no skill, no strategy — wealth still concentrates exponentially, just like energy in a gas. Inequality emerges from entropy." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D (histogram + time series). Key algorithm: Drăgulescu-Yakovenko model. N=500 agents, initial wealth w_i=100. At each step: pick random i, j (i≠j). Transfer Δw = ε·min(w_i, w_j) where ε is uniform [0,1] (yard-sale model). Or fixed Δw=1. Constraint: w_i ≥ Δw (no debt). Run for 10⁶ transactions. Plot histogram P(w) in log-linear scale — should be linear (exponential). Fit: slope = -1/⟨w⟩. For savings: each agent saves λ fraction, only (1-λ)w_i available for exchange. Gamma distribution fit. Runtime: fast, Canvas 2D histogram.
