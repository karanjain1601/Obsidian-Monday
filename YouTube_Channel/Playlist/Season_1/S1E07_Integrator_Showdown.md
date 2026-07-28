---
title: "Four Ways to Simulate Physics. Three of Them Are Secretly Wrong."
season: 1
episode: 7
difficulty: 4/10
concept: "Integrator order, accuracy, and the symplectic structure trade-off"
prereq: "E06 (orbital energy drift as motivation)"
tags: [RK4, Verlet, euler-method, numerical-integration, integrator-comparison, physics-engine, javascript, ODE-solver, computational-physics]
type: playlist-video
---

## S1·E07 — "Four Ways to Simulate Physics. Three of Them Are Secretly Wrong."

- **Alt title:** "The Integrator Showdown: RK4 vs. Verlet vs. Euler (Only One Wins Every Time)"
- **Difficulty:** 4/10 · **Prereq:** E06 (orbital energy drift as motivation)
- **Hook:** Four identical pendulums initialized to the same angle, using four different integrators. After 2 minutes, they are pointing in four different directions. Which one is right?
- **The break (bug):** Each integrator has a different failure mode: Euler (1st order) gains energy, making orbits expand; implicit Euler (1st order) loses energy, making orbits contract; symplectic Euler conserves energy perfectly but accumulates phase error; RK4 (4th order) is accurate to machine precision but requires 4 force evaluations per step — 4× the cost. None is "correct" in all situations; the right choice depends on the physics.
- **Concept introduced:** Order of accuracy (how fast error shrinks as dt decreases), convergence rate, and the key insight: for Hamiltonian systems (orbits, oscillators), *symplectic* structure matters more than order. For general systems (drag, dissipation), RK4 is usually best. This is why the choice of integrator is an architectural decision in any physics engine.
- **Push it / wow moment:** A "shootout" mode — all four integrators try to hit the same ballistic target 1000 m away. Plot error versus compute time on a log-log scale. RK4 is orders of magnitude more accurate per unit of compute for smooth trajectories; but for a long orbit, Verlet beats it because RK4 still drifts energy slowly.
- **Demo:** Timestep slider from coarse to fine. Live global error (vs. high-precision reference) for each integrator. Toggle each on/off. The orbital energy plot from E06 updated to show all four.
- **Tags:** `RK4` `Verlet` `euler-method` `numerical-integration` `integrator-comparison` `physics-engine` `javascript` `ODE-solver` `computational-physics`
- **Thumbnail:** Four identical pendulums at t=0 all together; at t=120s all pointing in different directions. "WHICH IS CORRECT?" with one highlighted in gold.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_1/_Season_1_Overview|Season 1 Overview]]*
