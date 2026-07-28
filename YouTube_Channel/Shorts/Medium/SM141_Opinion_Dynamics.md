---
title: "Opinion Dynamics — Voter Model"
id: SM141
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, statistical-mechanics, opinion-dynamics, voter-model, consensus, phase-transition]
---

> **What it is:** A ~45-second simulation short where a 2D grid of agents copy a random neighbour's binary opinion, with red and blue domains coarsening over time until one colour takes over the entire lattice, demonstrating the voter model and social consensus through random drift. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Opinion Dynamics — Voter Model

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 2D grid of people — half red (opinion A), half blue (opinion B). At each step, one person copies their neighbour's opinion. The red and blue regions coarsen, then eventually one colour takes over the entire grid. Consensus — reached by copying alone, with no leaders or incentives.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Voter model rules: at each step, pick a random agent i; pick a random neighbour j; agent i copies j's opinion. Simple as it gets — no fitness, no payoff, just copying. Caption: "Voter model: copy a random neighbour — zero strategy." This is the simplest model of social influence.

**0:10–0:18** — 2D coarsening: the density of interfaces (A-B boundaries) decreases as 1/t. Domains coarsen algebraically. In 2D, consensus time T_c ∝ N·ln(N). In 1D, T_c ∝ N². In high dimensions: persistence of both opinions (interface density → constant). Caption: "2D: T_c ∝ N·ln N; interfaces thin as 1/t." Show interface density vs time.

**0:18–0:27** — Conservation law: in the voter model, the fraction of opinion A is a martingale (conserved in expectation). Consensus is reached when one opinion fixates by random drift. Probability of A-consensus = initial fraction of A. Caption: "Fixation probability = initial fraction of A — random drift decides."

**0:27–0:36** — Extensions: (1) Noisy voter model: add spontaneous opinion flips at rate ε → coexistence state at ε. (2) Zealots: a fixed fraction never changes opinion → minority zealots can dominate. (3) Bounded confidence (Hegselmann-Krause): agents only copy neighbours within an opinion distance δ. Caption: "Zealots: fixed-opinion minority can flip the majority." Show zealot simulation.

**0:36–0:45** — Political applications: echo chambers, polarisation, social media. Filter bubbles limit whom you "hear" (restrict graph to similar-opinion neighbours) → consensus within a bubble but persistent division across. Caption: "Filter bubble = restricted voter model graph → polarisation." Bold text: "Voter model — the physics of social consensus." Fade to black.

## Physics Concept Teased
Voter model: agents on a lattice copy a random neighbour's binary opinion. The model is exactly solvable — it is equivalent to annihilating random walks at interfaces. The fraction of A opinions is conserved in expectation. Consensus time scales as N·ln N in 2D. Extensions with zealots or bounded confidence show rich coexistence and polarisation behaviour.

## On-Screen Text / Captions
- **0:00** — "Copy your neighbour — can consensus emerge?"
- **0:05** — "Voter model: pick random agent; copy random neighbour"
- **0:12** — "2D: T_c ∝ N·ln N; interfaces thin as 1/t"
- **0:20** — "Fixation prob = initial fraction of A — random drift"
- **0:28** — "Zealots: stubborn minority can flip the crowd"
- **0:35** — "Filter bubble: restricted graph → polarisation"
- **0:43** — "Voter model — physics of social consensus."

## End Card
Final 3 seconds: the grid at late time — almost entirely red with a few last blue patches. Text: "The voter model is exactly equivalent to annihilating random walks — it has been solved exactly in all dimensions." CodedLaws logo.

## Audio
Gentle crowd murmur. Voiceover at 0:00: "If everyone simply copies a random neighbour, opinions coarsen and consensus eventually emerges — not by logic or leadership, but by chance." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: voter model on N×N grid (toroidal BCs). At each step: pick i randomly; pick neighbour j randomly (4 directions); set opinion[i] = opinion[j]. Track density of A-opinion ρ(t) and interface density ρ_interface(t). Run until consensus. Measure T_c for various N; plot T_c vs N·ln N. Colouring: A=red, B=blue. For zealots: mark 2-5% of nodes as fixed-A or fixed-B (never updated). For bounded confidence: only copy j if |opinion_i - opinion_j| < δ (requires continuous opinions 0 to 1). Runtime: real-time Canvas 2D for N=100.
