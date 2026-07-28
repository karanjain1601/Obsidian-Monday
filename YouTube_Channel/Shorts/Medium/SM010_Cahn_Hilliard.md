---
title: "Cahn-Hilliard Phase Separation"
id: SM010
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, phase-transition, spinodal-decomposition, pattern-formation, statistical-mechanics]
---

> **What it is:** A ~45-second simulation showing a uniformly mixed binary fluid spontaneously separating into interlocking bicontinuous domains that coarsen over time following a t^(1/3) power law — demonstrating spinodal decomposition described by the Cahn-Hilliard equation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Cahn-Hilliard Phase Separation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A uniform grey canvas — two components perfectly mixed. At 2 seconds random noise is applied and the canvas instantly erupts into an intricate network of blue and gold bicontinuous channels, like a 3D sponge structure in 2D.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The bicontinuous pattern (spinodal decomposition). One phase (blue = component A) forms a connected network; the other (gold = component B) fills the complementary network. Colours saturate as separation progresses. Annotation: "Spinodal decomposition — spontaneous separation."

**0:10–0:18** — Coarsening: the pattern scale grows over time. Smaller domains dissolve into larger ones (Ostwald ripening). A length-scale bar at the bottom extends as the characteristic domain size L(t) grows. Graph inset: L(t) ∝ t^(1/3) — Lifshitz-Slyozov law.

**0:18–0:27** — The blue phase becomes droplets (off-critical quench). The gold phase is continuous. Droplets slowly diffuse and merge. Caption: "Off-critical quench → droplet morphology."

**0:27–0:36** — Free energy functional ℱ[φ] shown as an equation: ℱ = ∫[f(φ) + κ|∇φ|²] dV. The double-well potential f(φ) plotted: two minima at φ = ±1. Annotation: "Gradient term penalises sharp interfaces."

**0:36–0:45** — Split screen: left = early time (fine bicontinuous network), right = late time (large separated domains). Bold text: "Separation is irreversible." Fade to black with "Cahn-Hilliard equation" title card.

## Physics Concept Teased
Cahn-Hilliard equation: describes phase separation in a binary mixture. After a quench into the unstable (spinodal) region, composition fluctuations spontaneously grow, forming interconnected domains that coarsen as t^(1/3). The interface width and energy are encoded in the gradient term κ|∇φ|².

## On-Screen Text / Captions
- **0:00** — "A perfectly mixed binary fluid."
- **0:03** — "Spinodal decomposition — spontaneous phase separation"
- **0:12** — "Coarsening: L(t) ∝ t^(1/3)"
- **0:20** — "Off-critical quench → droplets"
- **0:28** — "Free energy drives it: ℱ[φ] = ∫[f(φ) + κ|∇φ|²]dV"
- **0:38** — "Separation is irreversible."
- **0:44** — "Cahn-Hilliard equation."

## End Card
Final 3 seconds: late-time separated morphology (large blue and gold domains). Text: "Same math governs alloy solidification, polymer blending, and cell membranes." CodedLaws logo.

## Audio
Slow, meditative electronic ambient (60 BPM). Voiceover at 0:00: "Mix two fluids that don't want to be together, and they will spontaneously unmix — into beautiful patterns." No sound effects other than a soft 'pop' at each domain merger event.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D or WebGL. Key algorithm: Cahn-Hilliard equation ∂φ/∂t = M∇²(f'(φ) - κ∇²φ) solved with a semi-implicit spectral scheme (FFT-based). Double-well f(φ) = (φ²-1)²/4. Grid: 256×256. Gotcha: explicit time-stepping is unstable for the ∇⁴ term — must use implicit or semi-implicit scheme. Mobility M and κ must be tuned to control interface width. Runtime: real-time with WebGL compute shader.
