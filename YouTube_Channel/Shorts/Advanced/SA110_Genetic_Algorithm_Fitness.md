---
title: "Genetic Algorithm: Fitness Landscape Traversal"
id: SA110
type: youtube-short
duration: "~45 seconds"
feeds_video: "Genetic Algorithms: Climbing Fitness Landscapes"
difficulty: advanced
tags: [physics, simulation, short, advanced, genetic-algorithm, fitness-landscape, optimization, evolution, metaheuristic]
---

> **What it is:** A ~45-second simulation showing a genetic algorithm evolving a population across a multi-modal fitness landscape with crossover, mutation, and selection producing rapid adaptation toward the global optimum. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Genetic Algorithms: Climbing Fitness Landscapes

# Short: Genetic Algorithm — Fitness Landscape Traversal

**Feeds full video:** Genetic Algorithms: Climbing Fitness Landscapes

## Visual Hook (First 3 Seconds)
A rugged 3D fitness landscape (purple-to-yellow terrain, multiple peaks and valleys). Hundreds of tiny white dots (population) scatter across valleys. Over 3 seconds they migrate, cluster at local peaks, then a mutation event scatters some toward a higher peak. Text: **"Fitness: 0.23 → 0.94."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Fitness landscape: 3D surface plot. X and Y axes = two genome parameters (−5 to 5). Z = fitness f(x,y) = sum of Gaussians (3 local maxima, 1 global max at f=1.0). Color: purple (f=0) → yellow (f=1). Global maximum labeled at (3.2, −1.8, 1.0).
- **0:10** — Population initialization: 100 blue dots placed randomly. Mean fitness bar at bottom: **"Gen 0: f̄ = 0.15"**. Selection: dots sized by fitness (larger = higher fitness).
- **0:18** — Selection and crossover: top 20 dots (yellow, high fitness) selected. Crossover animation: two parent dot genomes shown as horizontal bit strings (red + blue stripes); single-point crossover produces orange offspring. Mutation: one bit flips (white flash on that position).
- **0:27** — Generation counter (top-left) spins: 0 → 50 → 100 → 200. Population centroid climbs toward local maximum at (−1.5, 2.0, 0.72). Mean fitness: **"Gen 50: f̄ = 0.58"**. Diversity metric (spread radius of dots) narrows from 4.2 to 1.8 units.
- **0:36** — Premature convergence: all 100 dots trapped at local max (f=0.72, not global f=1.0). Diversity = 0.2 (almost zero). Then: mutation rate increased from 0.01 to 0.05 — dots scatter. Exploration resumes. Some reach **"f=0.91"** on another peak.
- **0:44** — Final convergence (Gen 300): population clusters around global maximum at (3.2, −1.8). Best individual fitness: **"f = 0.97"**. Schema theorem overlay: short, high-fitness schemata highlighted. Label: **"Building blocks of good solutions survive."**

## Physics Concept Teased
Genetic algorithms navigate fitness landscapes through selection (exploiting fit regions), crossover (recombining building blocks), and mutation (exploring new territory) — the schema theorem guarantees exponential growth of above-average short schemata, explaining why GAs find good solutions without exhaustive search.

## On-Screen Text / Captions
- **0:00** — "Evolution finds solutions without understanding them"
- **0:10** — "100 random candidates on a rugged fitness landscape"
- **0:20** — "Select the fit, mix them, mutate occasionally"
- **0:30** — "Local maxima trap populations — diversity saves them"
- **0:38** — "Schema theorem: building blocks compound"
- **0:45** — "GA deep dive → full video in bio"

## End Card
Final 3 seconds: 3D landscape with population clustered at global maximum (yellow peak). **"CodedLaws — Optimization"** text.

## Audio
Energetic electronic beat at 90 BPM. Level-up chime at each fitness improvement. Warble tone at local maxima trap.

## Production Notes
Renderer: GA on 2D fitness landscape (Python/DEAP). Genome: 2 float parameters, precision 0.01. Fitness: sum of 3 Gaussians + global peak. Selection: tournament (k=3). Crossover: simulated binary crossover (SBX). Mutation: polynomial mutation, η=20. Population: 100, 300 generations. Landscape rendered via matplotlib 3D surface. Output 1080×1920, 60 fps.
