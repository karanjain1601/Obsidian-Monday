---
title: "Crack Propagation in a Stressed Plate"
id: SM033
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fracture-mechanics, crack-propagation, stress-intensity, elasticity]
---

> **What it is:** A ~45-second simulation short pulling a cracked plate in tension and watching the stress singularity at the crack tip drive accelerating crack growth, branching, and ultimate fracture as the stress intensity factor exceeds material toughness. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Crack Propagation in a Stressed Plate

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A flat plate, grey with a rainbow stress colour-map, is pulled in tension from both sides. At the centre: a thin pre-existing crack, glowing white. At 2.5 seconds the crack lurches forward — a sharp snap — and the stress field around the crack tip blazes red-orange before the crack extends another centimetre.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Stress intensity factor shown: K_I = σ√(πa) where a = half-crack length. As the crack grows, a grows, K_I grows, driving faster crack extension. Graph: K_I vs. crack length — rising curve. Annotation: "Crack accelerates as it grows."

**0:10–0:18** — Near the crack tip: the stress field shown in polar coordinates — maximum at θ = 0°, zero at θ = ±90° (mode I symmetry). The r^(-1/2) singularity shown: stress → ∞ at crack tip. Caption: "Stress singularity at the crack tip — K_I captures its strength."

**0:18–0:27** — Crack path selection: if the plate has a grain structure (shown as Voronoi tessellation), the crack deflects around strong grains and through weak grain boundaries. Annotation: "Crack avoids strong zones — intergranular fracture." Alternative path with straight crack shown for comparison.

**0:27–0:36** — Crack branching: at high stress intensity the crack splits into two. The branching event shown in slow motion. Caption: "K_I > K_Ic (branching) → two cracks at ±70°." The branching angle matches the theory for maximum energy release.

**0:36–0:45** — Final frame: the plate has failed — two jagged fracture surfaces separated. The fracture surfaces show the characteristic river marks (hackle marks) of brittle fracture. Bold text: "Fracture mechanics — predicting where things break." Fade to black.

## Physics Concept Teased
Linear elastic fracture mechanics (LEFM): a crack in a plate under tension has a stress intensity factor K_I = σ√(πa). When K_I exceeds the material's fracture toughness K_Ic, the crack propagates unstably. The Griffith energy criterion: crack grows when ∂U_elastic/∂a > ∂U_surface/∂a.

## On-Screen Text / Captions
- **0:00** — "A crack under tension."
- **0:05** — "K_I = σ√(πa) — stress intensity factor"
- **0:12** — "Stress singularity: σ ∝ 1/√r at the tip"
- **0:20** — "Grain structure deflects the crack"
- **0:28** — "K_I > K_branch → crack splits at ±70°"
- **0:35** — "Hackle marks trace the fracture direction"
- **0:43** — "Fracture mechanics: K_Ic is the one number that matters."

## End Card
Final 3 seconds: the two fractured plate halves separated, fracture surfaces visible. Text: "Alan Griffith invented fracture mechanics in 1921 studying glass fibres." CodedLaws logo.

## Audio
Tension-building ambient drone. Sharp CRACK sound effect at each crack extension event. During slow-motion branching: high-pitched ringing tone of the elastic stress wave. Voiceover at 0:00: "Every crack has a singularity at its tip — and one number determines whether it grows: K_Ic." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D (2D simulation) or WebGL. Key algorithm: 2D LEFM with extended finite element method (XFEM) for crack propagation, or use a lattice spring model (LSM) — simpler to implement, naturally handles crack propagation. Stress field computed analytically near the crack tip (Williams expansion) and shown as colour-map. Crack growth criterion: K_I > K_Ic (computed from J-integral around crack tip). Crack path: maximum hoop stress criterion (σ_θθ maximum). Gotcha: crack tip singularity must be handled by enriched elements (XFEM) or removed by mesh refinement. Runtime: pre-rendered for XFEM; real-time possible with lattice spring model.
