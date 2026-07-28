---
title: "Level Set — Interface Tracking Through Topology Change"
id: SM064
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, level-set, interface-tracking, topology-change, multiphase-flow]
---

> **What it is:** A ~45-second simulation short where a figure-8 bubble smoothly pinches and splits into two separate bubbles with no special handling, demonstrating how the level set method tracks fluid interfaces through topological changes using a signed distance function whose zero contour defines the interface. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Level Set — Interface Tracking Through Topology Change

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A figure-8 shaped bubble — one smooth closed curve — in a flow field. At 2 seconds the bubble pinches at the neck, and in a stunning smooth transition it splits into two separate bubbles — with no sharp discontinuity, no special handling. The curve just passes through the topological change naturally.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Level set function φ(x,t): a signed distance function. φ < 0 inside bubble, φ > 0 outside. The interface is the zero level set: Γ = {x: φ=0}. Shown as a 2D colour-map (blue inside, red outside) with the white contour (φ=0) as the interface. Caption: "Level set: φ=0 is the interface."

**0:10–0:18** — Evolution: φ satisfies ∂φ/∂t + u·∇φ = 0 (advection with flow velocity u). For a moving bubble, u is the fluid velocity. The interface moves automatically as φ evolves. Reinitialization: periodically solve ∂φ/∂τ + sgn(φ)(|∇φ|-1) = 0 to restore signed distance property. Caption: "Reinitialise: keep |∇φ| = 1."

**0:18–0:27** — Topology change: the figure-8 bubble evolves. The neck thins. When φ becomes positive inside the neck (the zero-set splits), two separate bubbles form automatically. No special code for the topological change. Caption: "Topology change: φ just evolves — no special handling."

**0:27–0:36** — Level set vs. VOF comparison: left = level set (smooth interface, easy curvature, but non-conservative — loses mass). Right = VOF (sharp interface, conservative, hard curvature). Caption: "Level set: smooth but non-conservative. VOF: conservative but coarser interface." Many codes use the hybrid CLSVOF (Combined Level Set and VOF).

**0:36–0:45** — Application: water impact — a solid sphere splashing into a water surface. The splash crown and air dome are captured by the level set automatically. Then a bubble trapped underwater rises and merges with the surface. Bold text: "Level set — the geometry of fluid interfaces." Fade to black.

## Physics Concept Teased
Level set method: the interface is the zero level set of a smooth signed distance function φ. Topology changes (splitting, merging) occur naturally when φ changes sign. The interface normal n = ∇φ/|∇φ| and curvature κ = ∇·(∇φ/|∇φ|) are trivially computed from φ. Periodically reinitialised to maintain the signed distance property.

## On-Screen Text / Captions
- **0:00** — "A bubble splits — how?"
- **0:05** — "Level set: φ < 0 inside; φ = 0 is the interface"
- **0:12** — "Evolution: ∂φ/∂t + u·∇φ = 0"
- **0:20** — "Topology change: automatic when φ changes sign"
- **0:28** — "Level set: smooth. VOF: conservative. CLSVOF: both."
- **0:35** — "Water splash: crown + trapped bubble"
- **0:43** — "Level set — geometry of fluid interfaces."

## End Card
Final 3 seconds: the zero level set of a complex 3D water surface — a wavy, dynamic surface contour. Text: "Level sets power: Pixar's water sims, medical image segmentation, and computer vision." CodedLaws logo.

## Audio
Smooth, flowing ambient (70 BPM). Subtle "split" sound when the bubble divides (~0:22). Water sounds for the splash demo. Voiceover at 0:00: "A bubble splitting is a topological change — the level set method handles it with zero special code." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D (2D level set) or WebGL. Key algorithm: 2D level set method. φ stored on a MAC grid. Advection: 5th-order WENO scheme for ∂φ/∂t = -u·∇φ. Reinitialization: Sussman et al. (1994) PDE-based scheme. Curvature: κ = div(∇φ/|∇φ|) computed with second-order central differences. Narrow-band approximation: only update cells near the interface (|φ| < 5Δx) for efficiency. Gotcha: mass loss from level set advection — reinitialisation can move the interface — use conservative level set (Olsson-Kreiss) instead. Runtime: real-time Canvas 2D for 2D simulations.
