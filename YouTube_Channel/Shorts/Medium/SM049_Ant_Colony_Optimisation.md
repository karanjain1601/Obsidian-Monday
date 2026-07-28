---
title: "Ant Colony Optimisation — Shortest Path"
id: SM049
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, swarm-intelligence, ACO, optimisation, emergence]
---

> **What it is:** A ~45-second simulation short where hundreds of virtual ants scatter across a 20-city graph and pheromone trails concentrate — through deposition on short routes and evaporation on long ones — until a gold shortest-path blazes into view by emergent swarm intelligence. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Ant Colony Optimisation — Shortest Path

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A graph with 20 city nodes connected by edges. Hundreds of tiny ant icons scatter across all possible routes. Within 3 seconds glowing gold trails begin to concentrate on a few paths — then one path blazes bright gold as the ants converge on the shortest route.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Pheromone mechanics: each ant walks a complete tour, choosing edges probabilistically — edges with more pheromone are preferred (τ_ij^α · η_ij^β, η = 1/distance). At the end of each tour, successful ants deposit pheromone: Δτ = Q/L (Q = constant, L = tour length). Shorter tours deposit more. Caption: "Short tour → more pheromone."

**0:10–0:18** — Evaporation: pheromone fades over time (τ → (1-ρ)τ). This prevents premature convergence — all paths dried up except the best ones. Shown: long paths' pheromone fades quickly while the short path's trail remains bright gold. Caption: "Evaporation rate ρ = 0.1."

**0:18–0:27** — 100 iterations shown in time-lapse: the pheromone heatmap evolves. Initially all edges glow faintly. By iteration 30: a clear preferred tour emerges. By iteration 60: the shortest tour found so far is highlighted. Tour length graph below: drops from 5000 to 2100 units.

**0:27–0:36** — Comparison: random tour (red) vs. ACO tour (gold). The ACO tour has far fewer crossings — it's nearly optimal. Path length labeled: "ACO: 2,100 units | Random: 5,800 units | Optimal: 1,950 units." Gap to optimal: 7.7%.

**0:36–0:45** — Connection to real ants: real Argentine ants find the shorter of two bridge paths to food in exactly this way — pheromone concentration. Caption: "Real ants: same algorithm." Bold text: "Emergent intelligence from simple rules." Fade to black.

## Physics Concept Teased
Ant Colony Optimisation (ACO): ants probabilistically choose paths weighted by pheromone strength and inverse distance. Shorter paths accumulate more pheromone per unit time (more trips possible). Evaporation prevents stagnation. The positive feedback between pheromone and ant preference drives convergence to near-optimal solutions.

## On-Screen Text / Captions
- **0:00** — "100 ants. 20 cities. Find the shortest tour."
- **0:05** — "Short tour → more pheromone deposited"
- **0:12** — "Evaporation: τ → (1-ρ)τ, ρ = 0.1"
- **0:20** — "60 iterations → near-optimal tour"
- **0:28** — "ACO: 2,100 | Random: 5,800 | Optimal: 1,950"
- **0:35** — "Real ants use the same algorithm"
- **0:43** — "Emergent intelligence — no central control."

## End Card
Final 3 seconds: the final ACO tour — a clean path connecting all 20 cities with a bright gold line. Text: "ACO is used in: logistics routing, chip design, protein folding." CodedLaws logo.

## Audio
Light, scurrying electronic (100 BPM, staccato notes). Sound of many ants moving. As the optimal path emerges, a clear harmonic tone builds. Voiceover at 0:00: "Real ants find the shortest path without a map — by following each other's scent trails." No other voiceover.

## Production Notes
Code complexity: low to moderate. Renderer: Canvas 2D. Key algorithm: ACO (Dorigo 1992). Cities: N=20 random points. Pheromone matrix τ[i,j] initialised uniformly. Each iteration: M=50 ants each construct a complete tour by probabilistic edge selection (P[i,j] ∝ τ[i,j]^α · (1/d[i,j])^β, α=1, β=2). Update: τ[i,j] = (1-ρ)τ[i,j] + Σ Q/L_k (if edge used by ant k). Visualise: edge opacity proportional to τ[i,j]. Best tour highlighted. Runtime: real-time, fast in JavaScript for N=20.
