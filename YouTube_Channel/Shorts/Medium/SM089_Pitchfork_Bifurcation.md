---
title: "Pitchfork Bifurcation — Symmetry Breaking"
id: SM089
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, pitchfork-bifurcation, symmetry-breaking, dynamical-systems, bifurcation-theory]
---

> **What it is:** A ~45-second simulation short where a ball balanced on an inverted parabola tips into a double-well W-shape and rolls randomly left or right, demonstrating spontaneous symmetry breaking through the pitchfork bifurcation — from an Euler buckling column to the Higgs mechanism. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Pitchfork Bifurcation — Symmetry Breaking

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A ball balanced on top of an upside-down parabola — perfectly symmetric. A parameter shifts — the parabola curves into a W-shape. The ball rolls off to one side — randomly left or right. The symmetry is spontaneously broken. This is the pitchfork bifurcation.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Supercritical pitchfork: ẋ = μx - x³. For μ < 0: one stable fixed point at x=0 (symmetric). For μ > 0: x=0 becomes unstable; two new stable fixed points at x=±√μ branch off ("fork"). The system breaks symmetry. Caption: "Pitchfork: x=0 loses stability; ±√μ are born."

**0:10–0:18** — Bifurcation diagram: x* vs μ. The single branch at x=0 splits into three at μ=0 — the pitchfork shape. Stable (solid) upper and lower branches. Unstable (dashed) middle branch. Caption: "The pitchfork: one → three fixed points at μ=0."

**0:18–0:27** — Physical analogy: a vertical elastic rod compressed from above. For small compression (F < F_c): rod stays straight (x=0 stable). At F = F_c (Euler buckling load): rod buckles left or right — symmetric pitchfork bifurcation. Caption: "Euler buckling: pitchfork in structural mechanics."

**0:27–0:36** — Subcritical pitchfork: ẋ = μx + x³. The unstable branches exist for μ<0. At μ=0 they collapse to the origin — an unstable transition. The subcritical pitchfork is the mathematical model for first-order (discontinuous) symmetry-breaking transitions. Caption: "Subcritical pitchfork: violent symmetry breaking."

**0:36–0:45** — Real examples: (1) Rayleigh-Bénard convection onset (supercritical pitchfork — rolls left or rolls right). (2) Higgs field symmetry breaking (Mexican hat potential — the quantum pitchfork). (3) Buckling of a ruler — subcritical pitchfork. Caption: "From rulers to the Higgs boson — same mathematics." Bold text: "Pitchfork bifurcation — symmetry breaking in one equation." Fade to black.

## Physics Concept Teased
Pitchfork bifurcation: a symmetric system (ẋ = f(x) with f(-x) = -f(x)) where the fixed point at x=0 loses stability and two new stable fixed points appear at ±√(μ). The bifurcating fixed points spontaneously break the x → -x symmetry. This is the mathematical template for all spontaneous symmetry breaking — from convection to the Higgs mechanism.

## On-Screen Text / Captions
- **0:00** — "Symmetric system — one stable state. Then: two."
- **0:05** — "ẋ = μx - x³: pitchfork at μ=0"
- **0:12** — "x=0 → unstable; ±√μ → new stable states"
- **0:20** — "Euler buckling: pitchfork in structural mechanics"
- **0:28** — "Subcritical: violent first-order transition"
- **0:35** — "Rulers, Rayleigh-Bénard, Higgs field — same math"
- **0:43** — "Pitchfork — the mathematics of symmetry breaking."

## End Card
Final 3 seconds: the pitchfork bifurcation diagram glowing on black. Text: "The Higgs mechanism: the universe's symmetry broke at a pitchfork bifurcation 10^(-12) seconds after the Big Bang." CodedLabs logo.

## Audio
Clean, symmetric music (palindromic phrase). At the bifurcation: it splits into two harmonic paths (left and right channels). Voiceover at 0:00: "From a ruler buckling to the Higgs boson giving mass — the pitchfork bifurcation models spontaneous symmetry breaking." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: integrate ẋ = μx - x³ with RK4 for multiple μ values. Bifurcation diagram: x* = 0 (for all μ, stability changes at μ=0) and x* = ±√μ (for μ>0). Potential: V(x) = -μx²/2 + x⁴/4 (double-well for μ>0, single-well for μ<0). Animate μ sweeping from -1 to +1 with the ball rolling in the potential. Show ball choosing left or right branch randomly (use symmetry-breaking perturbation noise). Euler buckling demo: draw a vertical rod as a bézier curve; deform it as F increases past F_c. Runtime: real-time Canvas 2D.
