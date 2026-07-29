---
title: "Season 1 — The Integrator Sessions"
season: 1
episodes: 10
theme: "Every simulation is secretly an integration problem"
tags: [youtube, physics-simulation, season-overview, numerical-integration]
type: season-overview
---

# Season 1 — The Integrator Sessions (E01–E10)

> **Season Thesis:** Every simulation is secretly an integration problem, and the naive approach always breaks first — in ways that are physically meaningful, not random.

## Episode List

| # | Episode | Core Concept |
|---|---------|-------------|
| E01 | [[S1E01_Cannon_Infinity\|Cannon to Infinity]] | Euler integration — the `dt` bug |
| E02 | [[S1E02_Bouncing_Ball\|Bouncing Ball Gains Energy]] | Coefficient of restitution; symplectic Euler |
| E03 | [[S1E03_Spring_Explosion\|Spring Explosion]] | SHM stability; semi-implicit Euler |
| E04 | [[S1E04_Pendulum_Lies\|Pendulum Lies at Large Angles]] | sin(θ) ≈ θ linearization failure |
| E05 | [[S1E05_Resonance\|Resonance Destroys the Bridge]] | Driven oscillator; resonance condition |
| E06 | [[S1E06_Orbital_Decay\|Orbital Decay — Planet Crashes]] | Gravity + energy drift; Verlet integration |
| E07 | [[S1E07_Integrator_Showdown\|Integrator Showdown]] | RK4 vs Euler vs Verlet comparison |
| E08 | [[S1E08_Double_Pendulum\|Double Pendulum — Chaos]] | Lagrangian mechanics; chaos and sensitivity |
| E09 | [[S1E09_Air_Drag\|Air Drag — Why Objects Fall Wrong]] | Quadratic drag; terminal velocity |
| E10 | [[S1E10_Normal_Modes\|Normal Modes — Eigenvalue Decomposition]] | Normal modes; eigenvalue decomposition |

## Key Concepts Introduced This Season

- **Euler method** and why `dt` matters (E01)
- **Symplectic / semi-implicit Euler** for energy conservation (E02–E03)
- **Linearization** and its domain of validity (E04)
- **Resonance** and the quality factor Q (E05)
- **Verlet / leapfrog** integration for conservative systems (E06)
- **Runge-Kutta 4** as the gold-standard integrator (E07)
- **Lagrangian mechanics** and generalized coordinates (E08)
- **Drag models** — linear vs quadratic (E09)
- **Normal mode analysis** via eigenvalues (E10)

## The Flagship Video

[[S1E06_Orbital_Decay]] — *"I Coded Gravity and My Planet Crashed Into the Sun"* — is the channel thesis video. Every subsequent season references back to energy drift as the original sin of naive simulation.

---

*Part of [[_MOC_YouTube_Channel|CodedLaws]]*
