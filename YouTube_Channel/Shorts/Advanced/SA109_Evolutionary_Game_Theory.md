---
title: "Evolutionary Game Theory: Replicator Dynamics"
id: SA109
type: youtube-short
duration: "~45 seconds"
feeds_video: "Evolutionary Game Theory: Why Cooperation Exists"
difficulty: advanced
tags: [physics, simulation, short, advanced, game-theory, replicator-dynamics, evolution, cooperation, nash-equilibrium]
---

> **What it is:** A ~45-second simulation showing replicator dynamics on a population playing Hawk-Dove and iterated Prisoner's Dilemma strategies with evolutionarily stable equilibria emerging and cooperation invading defection through reciprocity. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Evolutionary Game Theory: Why Cooperation Exists

# Short: Evolutionary Game Theory — Replicator Dynamics

**Feeds full video:** Evolutionary Game Theory: Why Cooperation Exists

## Visual Hook (First 3 Seconds)
A simplex triangle on black: vertices labeled **"Hawks"** (red), **"Doves"** (blue), **"Bourgeois"** (green). A hundred white dots (populations) swirl and converge toward one vertex. Then the payoff matrix changes — dots reverse course. The simplex is alive.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Hawk-Dove-Bourgeois game: payoff matrix displayed (3×3 white grid on black). Values: H vs H: (−1,−1); H vs D: (2,0); D vs H: (0,2); D vs D: (1,1); Bourgeois: escalates when owner, retreats when intruder. V = 4, C = 6 in simulation.
- **0:10** — Replicator dynamics equations displayed: dx_i/dt = x_i·[(Ax)_i − x̄·Ax]. Each strategy frequency x_i changes in proportion to how much better it does than average fitness x̄·Ax. Three-variable ODE system animated solving.
- **0:18** — Simplex portrait: trajectories (white lines) from 50 random initial conditions all flow toward Bourgeois vertex (ESS). Hawk frequency: oscillates between 0.2 and 0.5 but never dominates. Dove frequency: always < 0.3. Label: **"Bourgeois ESS = 100%."**
- **0:27** — Game switch: V = C case (resource = cost). Pure ESS disappears; interior fixed point emerges (blue dot in simplex center). All trajectories now orbit the interior fixed point in closed loops — a Hamiltonian system! Label: **"V = C: frequency cycling forever."**
- **0:36** — Spatial game: 200×200 lattice where each cell plays its neighbors. Starting with random mix, cooperators (blue) cluster into stable islands surrounded by defectors (red) — spatial structure maintains cooperation despite defectors being locally fitter.
- **0:44** — Five-strategy tournament: cooperator, defector, tit-for-tat, generous tit-for-tat, pavlov. Population fractions over time shown as stacked area chart. Final equilibrium dominated by tit-for-tat (green, 62%) and pavlov (orange, 28%). Label: **"Reciprocity beats defection."**

## Physics Concept Teased
Replicator dynamics converts evolutionary biology into a dynamical system on the simplex: fitness differences drive frequency changes, and the long-run evolutionary stable strategy (ESS) corresponds to the attractor — which can be a fixed point, limit cycle, or chaotic orbit depending on the payoff structure.

## On-Screen Text / Captions
- **0:00** — "Can math explain why animals cooperate?"
- **0:10** — "Hawk-Dove: aggression has a Nash equilibrium"
- **0:20** — "Replicator equation: evolution as a flow on a simplex"
- **0:30** — "Bourgeois strategy: respect ownership, win forever"
- **0:38** — "Spatial structure saves cooperation from defectors"
- **0:45** — "Full evolutionary game theory → bio"

## End Card
Final 3 seconds: simplex with trajectories converging to Bourgeois vertex. **"CodedLaws — Complexity & Evolution"** text.

## Audio
Strategic, tense electronic beat at 75 BPM. Note accent at each ESS convergence. No voiceover.

## Production Notes
Renderer: replicator ODE (Python/SciPy). Payoff matrix: 3×3 float array. ODE solved with RK45, dt = 0.01. Simplex visualization via barycentric coordinates. Spatial game: synchronous update, Moore neighborhood (8 cells). Tournament: 1000 rounds per generation, 500 agents. Output 1080×1920, 60 fps.
