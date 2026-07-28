---
title: "Dry Active Matter — Polar Order Parameter"
id: SM159
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, active-matter, dry-active, polar-order, Vicsek, symmetry-breaking]
---

> **What it is:** A ~45-second simulation short where vibrated granular rods on a substrate organise from isotropic disorder into nematic lanes and then into a polar flock as packing fraction increases, demonstrating the symmetry-breaking phase transitions of dry active matter where momentum is dissipated by the substrate and Mermin-Wagner suppression of long-range order does not apply. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Dry Active Matter — Polar Order Parameter

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Vibrated granular rods on a tilted plate — each rod self-propels by vibration. They collide and nematically align (polar order: they all point the same way but can't distinguish head from tail for nematic, but for polar they do head alignment). Spontaneous polar order — a macroscopic arrow — emerges from microscopic collisions. No fluid, no chemical signal.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Dry vs wet active matter: "dry" = no fluid medium (granular, crawling cells on substrate). "Wet" = suspended in fluid (bacteria in water, spermatozoa). In dry active matter, momentum is not conserved — dissipated by the substrate. Caption: "Dry: momentum dissipated by substrate — no long-range hydrodynamics." This changes the universality class.

**0:10–0:18** — Polar order parameter: P = (1/N)Σᵢ ê_i (vector average of orientations). For polar active matter: P≠0 means all particles move the same direction (polar flock). For nematic: the order parameter is a tensor Q = (1/N)Σᵢ (ê_i⊗ê_i - I/2). Caption: "Polar order: P = ⟨ê⟩ ≠ 0 — flock. Nematic: Q-tensor ≠ 0 — lanes."

**0:18–0:27** — Dry polar active matter (Vicsek class): the hydrodynamics (Toner-Tu equations, SM158). Long-range polar order in 2D (anomalous fluctuations). Giant number fluctuations: σ_N ∝ N^α with α > 1/2. Caption: "2D dry polar: true long-range order + giant fluctuations." Compare to equilibrium ferromagnet (Mermin-Wagner: no long-range order in 2D).

**0:27–0:36** — Dry nematic active matter: vibrated granular rods. Nematic order: long parallel lanes. The symmetry is different from polar — flipping ê → -ê is a symmetry. Giant density fluctuations stronger than in the polar case. Caption: "Dry nematic: granular rods form lanes — stronger fluctuations." Show experimental photos of vibrated rod lanes.

**0:36–0:45** — Phase transition: sweeping packing fraction φ: from disordered (isotropic) → nematic (lanes) → polar (flock). Each transition is first-order in 2D. Show the φ-η phase diagram with isotropic, nematic, and polar phases. Caption: "Phase diagram: isotropic → nematic → polar as density increases." Bold text: "Dry active matter — symmetry classes of living motion." Fade to black.

## Physics Concept Teased
Dry active matter: self-propelled particles on a substrate (momentum not conserved, no fluid effects). Polar order parameter P = ⟨ê⟩ and nematic order Q-tensor distinguish polar flocks (birds, vibrated arrows) from nematic lanes (vibrated rods). Toner-Tu hydrodynamics governs dry polar active matter — long-range polar order exists in 2D, unlike equilibrium ferromagnets.

## On-Screen Text / Captions
- **0:00** — "Granular rods order — dry active matter."
- **0:05** — "Dry: no fluid — momentum not conserved"
- **0:12** — "P = ⟨ê⟩: polar order; Q-tensor: nematic order"
- **0:20** — "2D dry polar: true long-range order — not equilibrium"
- **0:28** — "Granular rods: lanes = nematic order — stronger fluctuations"
- **0:35** — "Phase diagram: isotropic → nematic → polar vs density"
- **0:43** — "Dry active matter — symmetry breaks into motion."

## End Card
Final 3 seconds: vibrated granular rods forming clear parallel lanes. Text: "In 2D equilibrium systems, Mermin-Wagner forbids long-range order — but dry active polar matter violates this because it breaks time-reversal symmetry." CodedLaws logo.

## Audio
Vibration noise of granular rods, collective ordering. Voiceover at 0:00: "Vibrate some rods on a plate, and they spontaneously align into lanes and flocks — dry active matter, where the only intelligence is Newton's laws." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: Vicsek model modified for polar (as in SM158) OR nematic active matter (replace alignment rule with nematic alignment: align ê_i with ±ê_j with same sign as cos(θ_ij) > 0, else flip). For nematic: particle can choose +ê or -ê based on neighbour orientations, preferring the closer angle. Nematic order parameter: Q = ⟨cos(2θ)⟩ (1D version). Simulate at varying density φ (fraction of box covered by particles). Phase diagram: compute P and Q as function of φ and noise η. Runtime: Canvas 2D, N=500 particles, real-time.
