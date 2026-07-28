---
title: "Peridynamics: Crack Branching in Brittle Fracture"
id: SA035
type: youtube-short
duration: "~45 seconds"
feeds_video: "Peridynamics: Fracture Mechanics Without Crack-Tip Singularities"
difficulty: advanced
tags: [physics, simulation, short, advanced, peridynamics, fracture, crack-branching, brittle, meshfree]
---

> **What it is:** A ~45-second simulation of a brittle plate struck by an impactor in peridynamics, showing spontaneous crack branching and fragmentation without any predefined crack path or tip singularity. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Peridynamics: Fracture Mechanics Without Crack-Tip Singularities

# Short: Peridynamics — Crack Branching in Brittle Fracture

**Feeds full video:** Peridynamics: Fracture Mechanics Without Crack-Tip Singularities

## Visual Hook (First 3 Seconds)
A brittle glass plate (grey, 0.1 m × 0.1 m) is loaded in tension at 50 m/s. A single crack nucleates from a central notch (black line, 5 mm) — then branches into two (split screen: Y-shaped crack), then branches again into four. Crack velocity counter: 1,850 m/s. "No singular stress. Cracks emerge naturally."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Classical FEM limitation: crack-tip stress σ ∝ 1/√r → singularity (red infinity symbol at crack tip). "FEM needs special elements and remeshing." IGA: same problem.
- **0:10** — Peridynamic equation of motion: ρü(x,t) = ∫_{H_x} f(u(x')-u(x), x'-x) dV_x' + b(x,t). Bond force f (gold arrows) replaces spatial derivative. No ∇ — the equation works at cracks. "H_x: horizon sphere radius δ = 0.003 m."
- **0:18** — Bond breaking criterion: each bond (x, x') breaks permanently when bond stretch s = |η+ξ|/|ξ| − 1 exceeds critical stretch s₀ = √(5Gc/9Kδ) = 0.004. Broken bonds shown turning red then disappearing. Damage field D(x) = 1 − (unbroken bonds)/(initial bonds) shown as red heatmap.
- **0:27** — Crack branching: at loading velocity v = 50 m/s, crack speed reaches 0.6 × C_R (Rayleigh wave speed). Branch criterion: when local damage rate > 10⁷ s⁻¹, two crack tips emerge. Branching shown in slow-motion (0.05× speed) — original tip splits, each child tip races outward at ±15°.
- **0:35** — Energy release rate: J-integral (classical, red path-integral) can't cross a crack. Peridynamic energy release rate computed from bond-breaking energy: G = 2 × π δ³/V₀ × Σ_broken (0.5 k s²/l). Matches Griffith G_c = 5.0 J/m² (error < 3%).
- **0:43** — Kalthoff-Winkler experiment comparison: peridynamic simulation (gold crack path, branching angle 67°) vs experimental photo (white crack path on grey). "Kalthoff angle: experiment 68° — PD 67°. Match within 1°."

## Physics Concept Teased
Peridynamics replaces the classical PDE of elasticity (which requires spatial derivatives undefined at cracks) with an integral equation over a finite horizon δ, where bonds between material points break irreversibly when stretched beyond a critical value — allowing cracks to nucleate, propagate, branch, and merge without any special treatment or remeshing.

## On-Screen Text / Captions
- **0:00** — "Cracks branch naturally. No singularity." (white, top)
- **0:10** — "ρü = ∫ f dV — no gradient, no infinity" (gold, equation label)
- **0:18** — "Bond breaks at s₀ = 0.004 — permanently" (red, annotation)
- **0:27** — "Branching at 0.6 × C_R — instability threshold" (white, bottom bar)
- **0:35** — "G_c = 5.0 J/m² — Griffith energy matches" (white, annotation)
- **0:43** — "Kalthoff angle: PD 67°, experiment 68°" (gold, comparison label)

## End Card
Final 3 seconds: the branched crack pattern glows red on grey. "CODED LAWS" in crimson. Subscribe. "Next: Lattice Boltzmann MHD →" teaser.

## Audio
Glass shattering sfx on crack initiation (0:00); deep "crack" sound for each branch event; eerie silence after fracture. 70 BPM tension ambient. No voiceover.

## Production Notes
Peridynamics code: Peridigm (Sandia National Laboratories). Material: borosilicate glass E = 70 GPa, ν = 0.22, G_c = 5 J/m², ρ = 2,200 kg/m³. Discretisation: 100×100×1 grid, δ = 0.003 m (3 horizon nodes). Bond type: prototype microelastic brittle (PMB). Loading: velocity BC top/bottom ±25 m/s. Time step: Δt = 50 ns. Visualization: ParaView with damage field coloring.
