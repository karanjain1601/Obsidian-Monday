---
title: "Scale-Free Network Growth — Preferential Attachment"
id: SM138
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, network-science, scale-free, preferential-attachment, barabasi-albert, power-law]
---

> **What it is:** A ~45-second simulation short where new nodes arrive one at a time and attach preferentially to already well-connected nodes, growing a Barabasi-Albert scale-free network whose few massive hubs dominate while most nodes have only one or two connections — following a power-law degree distribution seen in the web, social networks, and biology. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Scale-Free Network Growth — Preferential Attachment

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A network grows in real time: each new node (glowing sphere) arrives and connects preferentially to already-well-connected nodes. Over time, a small number of massive "hubs" dominate — with thousands of connections — while most nodes have only 1 or 2. A network shaped like the internet, social media, and the brain.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Barabasi-Albert (BA) model: two ingredients — growth (add one node at a time) and preferential attachment (new node connects to existing nodes with probability ∝ degree kᵢ). Π(i) = kᵢ/Σⱼkⱼ. Caption: "PA rule: Π(i) ∝ k_i — rich-get-richer." Barabasi-Albert 1999, Science.

**0:10–0:18** — Power-law degree distribution: degree distribution P(k) ∝ k^(-γ) with γ=3 for BA model. A power law has no characteristic scale — hence "scale-free." Hubs exist with degrees 100× or 1000× the mean. Caption: "P(k) ∝ k^(-3) — scale-free, no characteristic degree." Compare to Poisson (Erdos-Renyi): no hubs.

**0:18–0:27** — Hub formation: the 10 largest hubs are plotted. Their degree grows as kᵢ(t) ∝ t^(1/2) (first-mover advantage). The oldest nodes always become hubs. Caption: "First-mover advantage: k ~ t^(1/2) — oldest = biggest hub." Show top 5 nodes' degree growth vs time.

**0:27–0:36** — Real examples: (1) World Wide Web — γ≈2.1. (2) Citation network — γ≈3. (3) Protein interaction network — γ≈2.4. (4) Airport network — γ≈2. All are scale-free. Caption: "Web, citations, proteins, airports — all scale-free." Show log-log plots of their degree distributions.

**0:36–0:45** — Robustness paradox: scale-free networks are robust to random failure (rare to hit a hub by chance) but fragile to targeted attack (remove the 5 largest hubs → network fragments). Caption: "Robust to random failure; fragile to targeted attack." Bold text: "Scale-free network — the rich-get-richer universe." Fade to black.

## Physics Concept Teased
Barabasi-Albert scale-free network: a growing network where new nodes attach preferentially to high-degree nodes (Π(i)∝kᵢ). The stationary degree distribution is a power law P(k)∝k^(-3), with no characteristic scale. Real-world networks (web, social, biological) often show γ between 2 and 3, arising from preferential-attachment-like dynamics.

## On-Screen Text / Captions
- **0:00** — "Rich-get-richer — power law network growth."
- **0:05** — "Π(i) ∝ k_i — preferential attachment"
- **0:12** — "P(k) ∝ k^(-3) — scale-free degree distribution"
- **0:20** — "k_hub(t) ∝ t^(1/2) — first-mover advantage"
- **0:28** — "Web γ=2.1, citations γ=3, airports γ=2 — all scale-free"
- **0:35** — "Robust to random; fragile to targeted attack"
- **0:43** — "Scale-free: rich-get-richer network."

## End Card
Final 3 seconds: the final BA network with 1000 nodes — a few giant hubs visible, connected to hundreds of small nodes. Text: "Google's PageRank exploits preferential attachment: the most-linked page is also the most authoritative." CodedLaws logo.

## Audio
Growing hum of connections being added. Voiceover at 0:00: "A network where popular nodes get more connections — rich get richer — naturally produces a power law. And almost every real network in the world follows this rule." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D (force-directed layout). Key algorithm: Barabasi-Albert model. Start with m₀=3 fully connected nodes. At each step: add one new node with m=2 edges. Choose endpoints by PA: pick random edge, select one endpoint uniformly (equivalent to Π∝k). Or: maintain cumulative degree list and binary search. Track degree of each node. After N=500 nodes: fit P(k) on log-log plot. Visualise hub sizes by node radius = √(k). Force-directed layout: Fruchterman-Reingold spring-embedder. Runtime: real-time Canvas 2D for N≤500.
