---
title: "Hydraulic Jump — Standing Wave in Fast Flow"
id: SM096
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, hydraulic-jump, shallow-water, froude-number]
---

> **What it is:** A ~45-second simulation short where fast shallow supercritical water (Fr > 1) abruptly leaps upward into slow deep subcritical flow at a standing turbulent jump, demonstrating how the Froude number controls the conjugate depth ratio and energy dissipation — a phenomenon visible every day in a kitchen sink. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Hydraulic Jump — Standing Wave in Fast Flow

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Side view of a fast, shallow stream flowing over a flat surface. The water is thin and turbulent. Suddenly it hits a region of deeper water — and in a dramatic standing jump, the water surface leaps upward by a factor of 5, transitioning from supercritical (fast, shallow, Fr>1) to subcritical (slow, deep, Fr<1) flow. White turbulent foam at the jump.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Froude number: Fr = U/√(gh). Fr > 1: supercritical (fast, shallow — information can't travel upstream). Fr < 1: subcritical (slow, deep — waves can propagate both ways). A hydraulic jump is the transition between Fr > 1 and Fr < 1. Caption: "Fr: 3.0 (supercritical) → 0.4 (subcritical) — jumps."

**0:10–0:18** — Rankine-Hugoniot conditions for the hydraulic jump: continuity (h₁U₁ = h₂U₂) and momentum (h₁²/2 + h₁U₁² = h₂²/2 + h₂U₂²). Solution: h₂/h₁ = (√(1+8Fr₁²)-1)/2. Caption: "h₂/h₁ = (√(1+8Fr₁²)-1)/2 — conjugate depth." For Fr₁=3: h₂/h₁ = 3.77.

**0:18–0:27** — Energy dissipation: head loss across the jump ΔE = (h₂-h₁)³/(4h₁h₂). Dissipation shown as a turbulent mixing zone (white foam). The jump acts as a natural energy dissipator. Caption: "Jump dissipates: ΔE = (h₂-h₁)³/(4h₁h₂)." Hydraulic jump at a dam spillway shown.

**0:27–0:36** — Kitchen sink demo: your kitchen tap creates a circular hydraulic jump when water hits the sink floor. Thin fast ring outward (Fr > 1), thick slow ring inward (Fr < 1), and the standing jump at the transition. Caption: "Kitchen sink: Fr > 1 inside; Fr < 1 outside the jump." Show circular jump geometry.

**0:36–0:45** — Applications: dam spillway energy dissipation (to prevent erosion), fish ladders (stepped pools use hydraulic jumps to slow water for salmon). Caption: "Fish ladders: hydraulic jumps make salmon passable rivers." Bold text: "Hydraulic jump — nature's energy dissipator." Fade to black.

## Physics Concept Teased
Hydraulic jump: an abrupt transition from supercritical (Fr > 1) to subcritical (Fr < 1) shallow-water flow. The jump depth ratio h₂/h₁ = (√(1+8Fr₁²)-1)/2 follows from conservation of mass and momentum, with significant energy dissipated in turbulence. The Froude number is the shallow-water analogue of the Mach number for compressible flows.

## On-Screen Text / Captions
- **0:00** — "Fast shallow water hits slow deep water — it jumps."
- **0:05** — "Fr = U/√(gh): > 1 supercritical; < 1 subcritical"
- **0:12** — "h₂/h₁ = (√(1+8Fr₁²)-1)/2 — conjugate depth"
- **0:20** — "ΔE = (h₂-h₁)³/(4h₁h₂) — energy dissipated"
- **0:28** — "Kitchen sink: you see this every day"
- **0:35** — "Fish ladders: hydraulic jumps for salmon"
- **0:43** — "Hydraulic jump — nature's energy dissipator."

## End Card
Final 3 seconds: the circular kitchen sink hydraulic jump (top-down view, crisp white ring). Text: "The hydraulic jump is identical mathematically to a normal shock wave in gas dynamics." CodedLaws logo.

## Audio
Sound of rushing water, then the deeper, slower sound of subcritical flow after the jump. Voiceover at 0:00: "When shallow fast water meets deep slow water, the surface jumps — and energy is violently dissipated in the turbulence." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: 1D shallow-water equations (SWE): ∂h/∂t + ∂(hU)/∂x = 0; ∂(hU)/∂t + ∂(hU²+gh²/2)/∂x = -ghS (S=bed slope). Solved with Roe solver or Lax-Friedrichs scheme. Hydraulic jump forms naturally when upstream BC sets Fr₁ > 1 and downstream BC sets depth h₂. Conjugate depth shown analytically. Kitchen sink: axisymmetric SWE in polar coordinates. Foam: add a turbulence marker where Fr changes sign. Runtime: real-time Canvas 2D for 1D SWE; 2D SWE for circular jump.
