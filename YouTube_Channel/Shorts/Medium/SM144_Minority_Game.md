---
title: "Minority Game — Efficient Market Emergence"
id: SM144
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, complexity, minority-game, agent-based, efficient-market, phase-transition]
---

> **What it is:** A ~45-second simulation short where 101 agents simultaneously choose between two actions and the minority wins each round, with the volatility σ²/N vs α curve revealing a sharp phase transition at α_c ≈ 0.34 where market efficiency is maximised, demonstrating how an efficient market self-organises from competitive selfishness. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Minority Game — Efficient Market Emergence

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
N=101 agents each choose "buy" or "sell" simultaneously. The minority wins (like a bar that's only fun when not crowded, or a trade that's only profitable when fewer people make it). Agents update their strategy based on recent history. The market self-organises to reduce predictability — an efficient market from selfishness.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Rules: N agents (N odd). Each round: each agent chooses action 0 or 1. The minority group wins. Each agent has S=2 strategies (binary strings mapping recent history m to action). They use the strategy with the best recent record. Caption: "Minority game: minority wins every round — Challet-Zhang 1997." Based on El Farol (SM143).

**0:10–0:18** — Phase diagram: control parameter α = 2^m/N (ratio of strategy space to agents). For α < α_c ≈ 0.34 (crowded phase): agents use similar strategies → herding → large fluctuations in attendance. For α > α_c (uncrowded phase): agents diversify → small fluctuations. Caption: "Phase transition at α_c ≈ 0.34 — crowded vs uncrowded phase." Show σ²/N vs α.

**0:18–0:27** — Efficient market: at α = α_c, the market is least predictable — highest "market efficiency." No agent can improve their strategy. σ² is minimised. The market encodes all available information in prices (Fama's efficient market hypothesis). Caption: "At α_c: market most efficient — no predictable patterns." Show autocorrelation of signals → zero at α_c.

**0:27–0:36** — Exact solution: the minority game has an exact analytic solution using replica theory (from spin glass physics). The order parameter q (overlap between strategies) and the volatility σ² can be computed exactly. Caption: "Exact solution via spin glass replica theory — Coolen et al. 2005." This connects financial markets to statistical physics.

**0:36–0:45** — Real markets: stylised facts of financial markets match the minority game — volatility clustering, fat tails, and low autocorrelation of returns. The minority game is a minimal model for market microstructure. Caption: "Minority game reproduces fat tails, volatility clustering." Bold text: "Minority game — a physics model of an efficient market." Fade to black.

## Physics Concept Teased
Minority game: N agents compete to be in the minority by choosing between two actions based on recent shared history. The model has an exact solution via replica theory and shows a phase transition at α_c≈0.34 from a "crowded" (predictable) to an "uncrowded" (efficient) phase. At the transition, market efficiency is maximised — no agent can exploit regularities.

## On-Screen Text / Captions
- **0:00** — "Minority wins — physics of an efficient market."
- **0:05** — "N agents, 2 choices — minority wins every round"
- **0:12** — "Phase transition at α_c ≈ 0.34 — crowded vs efficient"
- **0:20** — "At α_c: market most efficient — zero predictable patterns"
- **0:28** — "Exact solution: spin glass replica theory"
- **0:35** — "Fat tails, volatility clustering — market stylised facts"
- **0:43** — "Minority game — physics of efficient markets."

## End Card
Final 3 seconds: σ²/N vs α plot — the characteristic U-shape with minimum at α_c. Text: "The minority game was solved exactly using the same replica method as the Sherrington-Kirkpatrick spin glass model." CodedLaws logo.

## Audio
Stock market noise — ticking prices, trading sounds. Voiceover at 0:00: "What if profitability required being in the minority? Then no strategy survives being widely adopted — markets self-organise to unpredictability." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: standard minority game. N=101 agents, S=2 strategies each. Memory m=3 (last 3 outcomes). Strategy space: 2^(2^m) possible strategies = 256. Each agent draws 2 strategies randomly. Track virtual scores for all strategies. At each step: compute last-m history bit string; agents choose based on their best-scoring strategy; determine minority; update real scores (for used strategies) and virtual scores (for all). Compute σ² = variance of attendance. Sweep α = 2^m/N by varying N or m. Plot σ²/N vs α. Runtime: fast, Canvas 2D.
