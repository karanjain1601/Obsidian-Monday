---
title: "Simulated Annealing — Finding the Global Minimum"
id: SM048
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, optimisation, simulated-annealing, metaheuristic, global-minimum]
---

> **What it is:** A ~45-second simulation short where a glowing ball leaps over peaks on a jagged 3D energy landscape — accepting uphill moves with decreasing probability as temperature cools — to escape local minima and settle in the global minimum, mirroring how molten metal crystallises during annealing. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Simulated Annealing — Finding the Global Minimum

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 3D energy landscape — a jagged mountain range of peaks and valleys lit in warm yellow and deep blue. A glowing ball bounces across the surface, occasionally leaping UP over a mountain to escape a valley, then finally settling deep in the lowest valley on the map.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The energy landscape: E(x,y) shown as a 3D surface (many local minima). Gradient descent shown in comparison: a ball rolling downhill — it falls into the first local minimum it finds and stops. Text: "Gradient descent: trapped." Ball stuck in a shallow local minimum.

**0:10–0:18** — Simulated annealing: a ball (solution state) starts at a random position. At high temperature T, it accepts random moves — including uphill moves with probability P = exp(-ΔE/kT). Shown: the ball bouncing wildly across the landscape at T=100. Caption: "High T: accept bad moves — escape local minima."

**0:18–0:27** — Temperature cools: T decreases exponentially (cooling schedule). Ball's jump height decreases. At T=10: occasional small uphill moves. At T=1: almost never accepts uphill moves. The ball converges to the global minimum. Caption: "Cooling schedule: T → 0 → converge."

**0:27–0:36** — TSP (Travelling Salesman Problem) demo: 30 cities on a map. SA optimises the route over 1000 iterations. The route starts tangled and crosses itself; after SA it becomes a clean loop. Distance shown: initial = 5,800 units → final = 2,100 units. Caption: "TSP: SA finds near-optimal tours."

**0:36–0:45** — Physics analogy: molten metal cooling — atoms explore high-energy configurations at high T, settle into the crystal structure (global energy minimum) at low T. "That's where the name comes from." Bold text: "Simulated annealing — physics as optimisation." Fade to black.

## Physics Concept Teased
Simulated annealing: a probabilistic optimisation algorithm inspired by annealing in metallurgy. At high temperature, random moves are accepted even if they increase energy (probability exp(-ΔE/kT)). Slow cooling drives the system to the global minimum. The Metropolis criterion ensures detailed balance.

## On-Screen Text / Captions
- **0:00** — "Find the lowest point in this landscape."
- **0:05** — "Gradient descent: trapped in local minimum"
- **0:12** — "High T: accept bad moves — P = exp(-ΔE/kT)"
- **0:20** — "Cooling: T → 0 → converge to global min"
- **0:28** — "TSP: 30 cities — SA finds near-optimal tour"
- **0:35** — "Metal cooling → crystal → same physics"
- **0:43** — "Simulated annealing — physics as optimisation."

## End Card
Final 3 seconds: TSP route before (tangled) and after (clean loop) SA. Text: "SA used in: circuit board layout, protein folding, airline scheduling." CodedLaws logo.

## Audio
Warm, exploratory electronic (80 BPM). Sound of metal glowing (crackling), gradually cooling and hardening during the temperature schedule. Voiceover at 0:00: "At high temperature an optimisation can jump over hills — cool it down slowly and it finds the bottom of the landscape." No other voiceover.

## Production Notes
Code complexity: low to moderate. Renderer: Canvas 2D (2D energy landscape as colour-map or simple height profile). Key algorithm: SA loop — at each step: propose new state x' = x + ε·random; ΔE = E(x') - E(x); if ΔE < 0 accept; else accept with probability exp(-ΔE/T). Cooling schedule: T = T₀ × α^step, α = 0.999, T₀ = 100. For TSP: state = permutation of cities; move = swap two random cities in the tour. Energy = total tour length. Runtime: real-time, trivially fast for 1D/2D energy landscapes and TSP with <100 cities.
