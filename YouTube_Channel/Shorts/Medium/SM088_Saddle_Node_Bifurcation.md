---
title: "Saddle-Node Bifurcation — Sudden Collapse"
id: SM088
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, saddle-node-bifurcation, tipping-point, dynamical-systems, bifurcation-theory]
---

> **What it is:** A ~45-second simulation short where a ball's potential valley gradually flattens and vanishes at a critical parameter value, sending the system irreversibly to a new state and illustrating the saddle-node fold bifurcation — the mathematics underlying ecological collapse, AMOC tipping, and power grid failure. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Saddle-Node Bifurcation — Sudden Collapse

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A ball resting in a shallow curved valley (stable equilibrium). A parameter slowly changes — the valley slowly flattens. At a critical moment, the valley vanishes — the ball is suddenly on a slope and falls off the edge to a completely different state. This is the saddle-node bifurcation — a tipping point.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Normal form: ẋ = μ + x². For μ < 0: two fixed points: x* = ±√(-μ). The lower one (x=-√(-μ)) is stable (saddle), upper (x=+√(-μ)) unstable (node). As μ→0: both approach x=0. At μ=0: collision and annihilation. For μ>0: no fixed points — the state escapes to ±∞. Caption: "μ = 0: fixed points annihilate — tipping point."

**0:10–0:18** — Bifurcation diagram: x* vs μ. Below μ=0: two branches (solid stable, dashed unstable). At μ=0: they meet (fold). Above μ=0: no equilibrium — the system transitions abruptly to a new state. Caption: "Bifurcation diagram: fold = catastrophe."

**0:18–0:27** — Hysteresis: the system with two co-existing stable states (bistable region of a related system). If we are on the upper stable branch and decrease the parameter, we stay on the upper branch until the saddle-node bifurcation — then we jump to the lower branch. Increasing back: we don't return until a different saddle-node is reached. Caption: "Hysteresis: path-dependent — catastrophe theory."

**0:27–0:36** — Real examples cascade: (1) Ecosystems tipping from healthy to degraded state (soil salinization). (2) Ocean circulation: the Atlantic Meridional Overturning Circulation (AMOC) could undergo a saddle-node collapse. (3) Power grid: voltage collapse when load exceeds transmission capacity. Caption: "Tipping points: ecology, climate, power grids."

**0:36–0:45** — Critical slowing down: near the bifurcation, recovery time from perturbations diverges (τ ∝ 1/|μ|^(1/2) for SN). This is an early warning signal. Caption: "Early warning: recovery time → ∞ near tipping point." Bold text: "Saddle-node bifurcation — the mathematics of tipping points." Fade to black.

## Physics Concept Teased
Saddle-node (fold) bifurcation: a stable and an unstable fixed point approach each other as a parameter changes, collide, and mutually annihilate. Beyond the bifurcation, the system has no equilibrium and transitions abruptly to a different attractor. This is the mathematical model for tipping points in ecology, climate, and infrastructure.

## On-Screen Text / Captions
- **0:00** — "The valley disappears — and so does the equilibrium."
- **0:05** — "ẋ = μ + x² — stable (x=-√(-μ)), unstable (x=+√(-μ))"
- **0:12** — "μ=0: annihilation — tipping point"
- **0:20** — "Hysteresis: can't return — catastrophe"
- **0:28** — "AMOC, ecosystems, power grids — all saddle-node"
- **0:35** — "Early warning: τ ∝ |μ|^(-1/2) → ∞"
- **0:43** — "Saddle-node — the maths of tipping points."

## End Card
Final 3 seconds: the bifurcation diagram with fold point highlighted in red. Text: "AMOC: climate scientists are monitoring for saddle-node collapse signs — now." CodedLaws logo.

## Audio
Slow, ominous build (70 BPM). Ball rolling sound as the stable state approaches the bifurcation. At the tipping point: abrupt cliff-edge drop sound effect. Voiceover at 0:00: "Tipping points are saddle-node bifurcations — the stable state vanishes and the system falls to a completely different regime." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: saddle-node normal form: ẋ = μ + x². Draw as a 1D ODE — potential V(x) = -μx - x³/3, shown as a curve. Stable: local minimum. Unstable: local maximum. At μ=0: inflection point. Animate μ sweeping from -1 to +0.1. Bifurcation diagram: x* = ±√(-μ) for μ<0, plotted as solid (stable) and dashed (unstable) branches. Hysteresis: show on a related 2D system with two saddle-node bifurcations (fold bifurcation pair). Critical slowing down: compute recovery time τ = 1/|λ| where λ = 2x* + 0 = 2·(-√(-μ)) for the stable branch; show τ vs μ diverging. Runtime: real-time Canvas 2D.
