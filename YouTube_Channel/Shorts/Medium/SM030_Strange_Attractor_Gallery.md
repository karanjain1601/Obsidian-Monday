---
title: "Strange Attractor Gallery — 5 Attractors in 45 Seconds"
id: SM030
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, chaos, strange-attractors, dynamical-systems, gallery]
---

> **What it is:** A ~45-second simulation short touring five famous strange attractors — Lorenz, Rössler, Aizawa, Thomas, and Halvorsen — each rotating in 3D to reveal the unique geometry that deterministic chaos carves into phase space. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Strange Attractor Gallery — 5 Attractors

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black screen. White text: "5 Strange Attractors. 45 Seconds." Immediately dissolves to a blazing cyan Lorenz butterfly, already fully formed and rotating slowly in 3D — one of the most recognisable shapes in all of mathematics.

## Main Visual Sequence (0:03–0:50)
**0:03–0:12** — **Lorenz Attractor** (σ=10, ρ=28, β=8/3): electric cyan on black, rotating. Text overlay: "Lorenz — the original strange attractor. 1963." Lyapunov exponent: λ = 0.906.

**0:12–0:21** — Hard cut. **Rössler Attractor** (a=0.2, b=0.2, c=5.7): warm orange-red, a spiral earring shape. Text: "Rössler — stretch and fold. 1976." Rotating slowly.

**0:21–0:29** — Hard cut. **Aizawa Attractor**: gorgeous 3D torus-knot-like structure, deep purple and gold. Equations: ẋ=(z-b)x-dy; ẏ=dx+(z-b)y; ż=c+az-z³/3-(x²+y²)(1+ez)+fz*x³. Text: "Aizawa Attractor — unknown sculptor."

**0:29–0:37** — Hard cut. **Thomas' Cyclically Symmetric Attractor**: three-armed symmetric structure, teal on black. Equations: ẋ = sin(y) - bx; ẏ = sin(z) - by; ż = sin(x) - bz, b=0.19. Text: "Thomas Attractor — cyclic symmetry."

**0:37–0:45** — Hard cut. **Halvorsen Attractor**: complex three-dimensional swirl, magenta-yellow. Text: "Halvorsen Attractor — no two views look the same." Final 2 seconds: all five shown as small panels in a grid. Bold: "Chaos has infinite shapes." Fade to black.

## Physics Concept Teased
Strange attractors: in chaotic dynamical systems, trajectories are attracted to a bounded region of phase space — but never repeat (non-periodic) and have fractal structure. Each attractor has a characteristic Lyapunov spectrum, fractal dimension, and visual signature. All arise from deterministic equations.

## On-Screen Text / Captions
- **0:00** — "5 Strange Attractors. 45 Seconds."
- **0:03** — "Lorenz — 1963 | λ = 0.906"
- **0:12** — "Rössler — 1976 | stretch and fold"
- **0:21** — "Aizawa — intricate 3D torus"
- **0:29** — "Thomas — cyclic symmetry | b = 0.19"
- **0:37** — "Halvorsen — no fixed view"
- **0:43** — "Chaos has infinite shapes."

## End Card
Final 3 seconds: 5-panel grid of all attractors. Text: "Which is your favourite? Comment below." CodedLaws logo. CTA: "Full parameter list in description."

## Audio
Five distinct music segments, one per attractor, each 8-9 seconds long: (1) Lorenz: deep ambient drone; (2) Rössler: warm synth; (3) Aizawa: mysterious pads; (4) Thomas: rhythmic cyclic arpeggios; (5) Halvorsen: complex layered synth. Hard cut transitions. Voiceover at 0:00 only: "Deterministic chaos has infinite shapes."

## Production Notes
Code complexity: moderate. Renderer: three.js (WebGL). Key algorithm: RK4 integration for each attractor, dt=0.005–0.01. Render as vertex-coloured line trail (50,000 points each). Pre-render all 5 attractors before the short starts. Transitions: cross-dissolve between attractor renders. Camera: slowly orbiting around each attractor using THREE.OrbitControls or manual rotation. Colour scheme: one distinct palette per attractor. All rendered at 1080p, 60fps, exported as video segments. Gotcha: Aizawa and Halvorsen parameters sourced from Sprott's attractor library. Runtime: pre-rendered.
