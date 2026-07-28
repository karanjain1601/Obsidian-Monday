---
title: "Small World Network — Rewiring Watts-Strogatz"
id: SM139
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, network-science, small-world, watts-strogatz, six-degrees, clustering]
---

> **What it is:** A ~45-second simulation short where a ring lattice of 100 nodes sees its average shortest path collapse from 25 hops to just 3 after only a handful of edges are randomly rewired to distant nodes, reproducing the six-degrees-of-separation phenomenon while maintaining high local clustering. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Small World Network — Rewiring Watts-Strogatz

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A ring of 100 nodes, each connected to its 4 nearest neighbours — a regular lattice. Then, one by one, some edges are randomly rewired to distant nodes. Within seconds, the average shortest path collapses from 25 hops to 3 hops — six degrees of separation emerge.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The Watts-Strogatz (WS) model: start with a ring lattice (N nodes, each connected to k nearest neighbours). With probability p, each edge is rewired to a uniformly random node. At p=0: regular lattice (high clustering, high path length). At p=1: random graph (low clustering, low path length). Caption: "WS model: p = rewiring probability — interpolates lattice ↔ random."

**0:10–0:18** — The sweet spot (p≈0.01): the average shortest path L drops dramatically (nearly random-graph value) while clustering coefficient C remains high (nearly lattice value). Show normalised L/L₀ and C/C₀ vs p. The "small world" regime: L≈L_random, C≈C_lattice. Caption: "Small world: low path length AND high clustering — best of both."

**0:18–0:27** — Six degrees of separation: Stanley Milgram 1967 — letters sent via acquaintances took on average 5.5 hops to reach a target. Facebook 2012: mean separation 4.74. LinkedIn 2012: 4.7. The WS model explains this from local clustering + rare long-range ties (the rewired shortcuts). Caption: "Facebook (2012): 4.74 degrees separation — small world."

**0:27–0:36** — Brain connectivity: the human connectome (white matter fibre tracts between brain regions) is a small-world network. High local clustering (modules/regions) + a few long-range "shortcut" fibres. Enables both specialised processing and integration. Caption: "Human connectome: small-world network — specialised yet integrated."

**0:36–0:45** — Biological and social networks: C. elegans nervous system (279 neurons), power grids, coauthorship networks — all small world. Disease spreading: on small-world networks, epidemics spread much faster than on regular lattices (because of the shortcuts). Caption: "C. elegans: 279 neurons, all small-world wired." Bold text: "Small world — 6 degrees of separation explained." Fade to black.

## Physics Concept Teased
Watts-Strogatz small-world model: rewiring even a tiny fraction (p≈0.01) of a regular ring lattice's edges creates a network with low average path length (close to a random graph) while maintaining high clustering (close to a regular lattice). This captures the "six degrees of separation" phenomenon and is found in biological, social, and technological networks.

## On-Screen Text / Captions
- **0:00** — "Six degrees — explained by just a few rewired edges."
- **0:05** — "WS model: p = rewiring prob; p=0 lattice, p=1 random"
- **0:12** — "Small world: L ≈ L_random, C ≈ C_lattice — p ≈ 0.01"
- **0:20** — "Facebook 2012: 4.74 degrees separation"
- **0:28** — "Connectome: small-world brain — specialised + integrated"
- **0:35** — "C. elegans, power grids — all small-world"
- **0:43** — "Small world — 6 degrees in one rewiring."

## End Card
Final 3 seconds: the WS network at p=0.05 — ring structure visible but with several long-range shortcuts highlighted. Text: "Watts and Strogatz published this in Nature in 1998 — sparked the modern science of complex networks." CodedLaws logo.

## Audio
Pop sounds as edges are rewired. Voiceover at 0:00: "A regular ring lattice has high clustering but long paths. Rewire even 1% of the edges randomly — and paths collapse to 6 degrees while clustering stays high." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: WS model on N=100 nodes, k=4 (each node connected to 4 nearest neighbours on each side). Rewire each edge with probability p: keep one endpoint, rewire other to random node (no self-loops, no duplicate edges). Compute: average shortest path L (BFS for each node) and clustering coefficient C = fraction of node's neighbours that are also connected. Plot L/L₀(p) and C/C₀(p) as p sweeps from 0 to 1. Layout: circular for low p, spring for high p. Runtime: real-time Canvas 2D.
