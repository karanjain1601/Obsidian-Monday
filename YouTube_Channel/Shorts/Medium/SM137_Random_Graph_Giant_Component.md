---
title: "Random Graph Phase Transition — Giant Component"
id: SM137
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, network-science, random-graph, phase-transition, erdos-renyi, giant-component]
---

> **What it is:** A ~45-second simulation short where 100 isolated nodes receive random edges one by one until at exactly mean degree one, the many small clusters suddenly merge into a single giant connected component spanning most of the graph — a sharp network phase transition described by Erdos-Renyi theory. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Random Graph Phase Transition — Giant Component

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
100 isolated nodes, scattered randomly. Edges start appearing — random pairs connect. For a while, only small clusters. Then at exactly one edge per node on average, the clusters merge into one — a giant connected component spanning most of the graph emerges instantaneously. A phase transition in a network.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Erdos-Renyi G(N, p) model: N nodes, each pair connected independently with probability p. Mean degree: ⟨k⟩ = (N-1)p ≈ Np for large N. Giant component emerges at ⟨k⟩_c = 1. Caption: "Critical point: ⟨k⟩ = 1 — one edge per node on average." Erdos-Renyi 1960 (Hungarian combinatorics).

**0:10–0:18** — Below criticality (⟨k⟩ < 1): all components are small — tree-like (no cycles). Largest component size ~ O(ln N). Above criticality (⟨k⟩ > 1): giant component of size S ∝ N·(1 - Q) where Q satisfies Q = exp(-⟨k⟩(1-Q)) (self-consistency). Caption: "S/N ∝ (⟨k⟩ - 1) near threshold — linear onset." Giant component grows as (⟨k⟩ - 1) for ⟨k⟩ just above 1.

**0:18–0:27** — Critical exponents: size of giant component S ∝ N^(2/3) at the critical point (⟨k⟩=1). Diameter: at criticality, the graph has a "double-jump" — components of size O(N^(2/3)) coexist briefly. Caption: "At ⟨k⟩=1: S ~ N^(2/3) — fractal-like critical regime." Show the size distribution of components: power-law tail at criticality.

**0:27–0:36** — Comparison to percolation: random graph ≡ bond percolation on a complete graph K_N (all pairs). The Bethe lattice gives exact results for ER graphs because they are locally tree-like. Below threshold: tree components. Above: giant + tree components. Caption: "ER graph = percolation on K_N — Bethe lattice result exact." Connect to SM136.

**0:36–0:45** — Real networks: internet, social networks, power grids — all have phase transitions for connectivity. Robustness: removing random nodes is like decreasing p — the network loses connectivity at a threshold. Caption: "Internet: random failures → percolation threshold for connectivity." Bold text: "Giant component — the birth of connectivity." Fade to black.

## Physics Concept Teased
Erdos-Renyi random graph phase transition: at mean degree ⟨k⟩=1, a giant connected component of size O(N) suddenly emerges from a graph of O(ln N) components. This is a second-order phase transition described exactly by mean-field (Bethe lattice) theory. Critical exponents: S(⟨k⟩=1) ~ N^(2/3), S ∝ (⟨k⟩-1) for ⟨k⟩>1.

## On-Screen Text / Captions
- **0:00** — "Add one edge per node — and everything connects."
- **0:05** — "Critical: ⟨k⟩_c = 1 — Erdos-Renyi 1960"
- **0:12** — "S/N ∝ (⟨k⟩ - 1) above threshold — linear onset"
- **0:20** — "At ⟨k⟩=1: S ~ N^(2/3) — critical scaling"
- **0:28** — "ER graph = percolation on K_N — Bethe lattice exact"
- **0:35** — "Internet robustness: random failures → percolation"
- **0:43** — "Giant component — connectivity's birth."

## End Card
Final 3 seconds: the graph at ⟨k⟩=1.5 — one large blue component connected, smaller red components isolated. Text: "The percolation threshold of the internet is p_c ≈ 0.9997 — it's almost perfectly robust to random failures." CodedLaws logo.

## Audio
Ticking sound as edges are added. A resonant "boom" when the giant component emerges. Voiceover at 0:00: "Add random connections to isolated nodes — and at exactly one edge per node, the whole network suddenly connects. A phase transition in mathematics." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D (force-directed graph layout — D3.js or custom spring-embedder). Key algorithm: Erdos-Renyi G(N,M) — add edges one at a time randomly. Use union-find to track connected components. Track largest component size as edges are added. Critical point: M = N/2 (one edge per node average). Visualise component sizes as colour: largest = blue, rest = red/orange by size. Component size distribution at criticality: power law ∝ s^(-3/2) (as per SM011). Runtime: N=200 nodes, real-time Canvas 2D.
