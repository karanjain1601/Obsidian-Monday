---
title: "Taylor-Couette Flow — Rotating Cylinders"
id: SM008
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, taylor-couette, vortex, rotating-flow]
---

> **What it is:** A ~45-second simulation showing fluid between a fast-spinning inner cylinder and a stationary outer cylinder snapping into stacked toroidal Taylor vortex rings, then transitioning through wavy and turbulent regimes — demonstrating Taylor-Couette centrifugal instability and its route to turbulence. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Taylor-Couette Flow — Rotating Cylinders

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Side view of two concentric cylinders — inner cylinder (bright white) spinning fast, outer cylinder (dark grey) stationary. The fluid between them glows faint blue. At 2 seconds stacked toroidal vortex rings (Taylor vortices) suddenly snap into view, alternating red and blue bands.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The axial cross-section shows alternating toroidal rolls — upflow (red) and downflow (blue) banding the gap like a stack of doughnuts. The azimuthal velocity profile is shown as a graph: Couette flow parabola transforms into the vortex-laden profile.

**0:10–0:18** — Inner cylinder speed (Reynolds number Re_i) slider increases. At Re_i = Ta_c (Taylor number critical), the steady Couette flow transitions to Taylor vortex flow. Animation shows the perturbation growing from noise to organised stacks.

**0:18–0:27** — Re_i increased further: wavy vortex flow (WVF). The previously axisymmetric rolls develop sinusoidal azimuthal waviness — each vortex ring ripples like a wrinkled bangle. Annotation: "Wavy vortex flow."

**0:27–0:36** — Further increase: modulated wavy vortex flow, then turbulent Taylor vortex flow. Each transition labeled with Re_i value. The flow becomes increasingly complex but retains a memory of the underlying vortex structure. Caption: "Route to turbulence."

**0:36–0:45** — 3D perspective view of the cylinders, with the outer cylinder made transparent. Torus-shaped vortex rings visible in 3D, colour-coded red/blue. Text: "Taylor vortices — a textbook instability." Fade to black.

## Physics Concept Teased
Taylor-Couette instability: when the inner cylinder rotates fast enough (Ta > Ta_c), centrifugal instability overcomes viscosity and the flow organises into stacked toroidal vortices. The Taylor number Ta = 4Ω²R₁²d⁴/ν²(R₂-R₁)² governs onset. This system is a paradigm for studying the laminar-turbulent transition.

## On-Screen Text / Captions
- **0:00** — "Inner cylinder spinning. Outer stationary."
- **0:03** — "Taylor vortices — stacked toroidal rolls"
- **0:12** — "Critical Taylor number → instability onset"
- **0:20** — "Wavy vortex flow — azimuthal waviness"
- **0:30** — "Route to turbulence — four distinct regimes"
- **0:38** — "Taylor-Couette flow: the classic instability."
- **0:44** — "Every regime explored in one apparatus."

## End Card
Final 3 seconds: 3D render of coloured Taylor vortex rings in transparent outer cylinder. Text: "G.I. Taylor — 1923." CodedLaws logo. CTA: "Full simulation guide in bio."

## Audio
Mechanical rhythmic electronic (90 BPM), industrial synth. Voiceover at 0:00: "Spin one cylinder inside another and the fluid between them forms perfectly ordered rings — then chaos." Subtle mechanical rotation hum throughout.

## Production Notes
Code complexity: complex. Renderer: three.js (3D) or Canvas 2D (axisymmetric cross-section). Key algorithm: axisymmetric Navier-Stokes in cylindrical coordinates (r, z) with periodic z-boundary; spectral-Galerkin or finite-difference discretisation; inner BC: no-slip rotating, outer BC: no-slip stationary. For the 3D wavy vortex flow full 3D NS required. Gotcha: Taylor number depends on the radius ratio η = R₁/R₂ — adjust Ta_c accordingly. Runtime: axisymmetric pre-rendered; 3D real-time in WebGL.
