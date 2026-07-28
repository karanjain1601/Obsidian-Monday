---
title: "Volume of Fluid — Droplet Merging and Splitting"
id: SM063
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, multiphase-flow, VOF, droplet, interface-tracking, CFD]
---

> **What it is:** A ~45-second simulation short where two water droplets coalesce into a single oscillating sphere and then split via Plateau-Rayleigh instability at a thin neck, demonstrating how the Volume of Fluid method handles fluid topology changes automatically using a single scalar volume fraction field. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Volume of Fluid — Droplet Merging and Splitting

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Two water droplets drift toward each other on a dark background. They touch — and instead of bouncing, they merge in a single smooth coalescence event: a brief neck forms, expands, and the two become one oscillating sphere. Then surface tension rings ripple across its surface.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — VOF method: each cell contains a volume fraction F ∈ [0,1]. F=0 = pure gas, F=1 = pure liquid, 0 < F < 1 = interface cell. The interface is reconstructed from F values (PLIC: Piecewise Linear Interface Calculation). Caption: "VOF: F is liquid volume fraction per cell."

**0:10–0:18** — Two droplets (F=1 spheres) approaching. Surface tension force computed via Continuum Surface Force (CSF): F_st = σ·κ·∇F where κ = surface curvature. When the droplets touch (F field merges), coalescence happens automatically. Caption: "Coalescence: F fields merge naturally."

**0:18–0:27** — Post-merger oscillation: the merged droplet oscillates between oblate and prolate shapes. The oscillation frequency: f_n = √(n(n-1)(n+2)σ/(ρR³)) / (2π) — Rayleigh modes. Mode n=2 is dominant (spheroid oscillation). Caption: "Mode-2 oscillation: f = √(σ/ρR³)."

**0:27–0:36** — Splitting: a droplet in an extensional flow (two opposing jets). The droplet elongates, forms a thin neck (ligament), and the neck breaks via the Plateau-Rayleigh instability. Two daughter droplets fly apart. Caption: "Splitting: Plateau-Rayleigh at the neck."

**0:36–0:45** — Topology change montage: three topological changes in sequence — merger, splitting, toroidal droplet formation and collapse. VOF handles all three automatically without any special topology tracking. Bold text: "VOF: topology changes for free." Fade to black.

## Physics Concept Teased
Volume of Fluid method: a fixed-grid Eulerian interface-capturing method. The volume fraction F is advected with the flow; the interface reconstructed geometrically. Surface tension via Continuum Surface Force. Topology changes (merging, splitting) are handled naturally — the F field just evolves, with no explicit interface tracking needed.

## On-Screen Text / Captions
- **0:00** — "Two droplets. They merge."
- **0:05** — "VOF: F = liquid volume fraction ∈ [0,1]"
- **0:12** — "Coalescence: F fields merge automatically"
- **0:20** — "Mode-2 oscillation: f ∝ √(σ/ρR³)"
- **0:28** — "Splitting: Plateau-Rayleigh at the neck"
- **0:35** — "VOF handles topology changes automatically"
- **0:43** — "Volume of Fluid — flexible interface tracking."

## End Card
Final 3 seconds: toroidal droplet collapsing. Text: "VOF is used in: inkjet printing, fuel injection, cloud microphysics." CodedLaws logo.

## Audio
Soft, liquid ambient. Satisfying wet "plop" sound at coalescence. Higher-pitched resonant tone at the post-merger oscillation. Voiceover at 0:00: "When droplets merge or split, the interface changes topology — VOF handles this automatically with just one scalar field." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: WebGL or Canvas 2D. Key algorithm: 2D VOF-PLIC (Piecewise Linear Interface Calculation). Advection: split geometric advection (Lagrangian-Eulerian) or CIAM (Calcul d'Interface Affine par Morceaux). Curvature: height function method from F values. CSF force: F_st = σκ∇F, smoothed across interface. Pressure solver: projection method for incompressible NS. Time step: CFL + capillary stability condition (Δt < √(ρΔx³/2πσ)). Gotcha: parasitic currents near interfaces (artificial velocities from CSF errors) — use height function curvature to reduce them. Runtime: pre-rendered for 3D; 2D real-time with WebGL.
