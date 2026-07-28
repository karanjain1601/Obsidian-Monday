---
title: "LCP Contact Solver with Friction Cone"
id: SA006
type: youtube-short
duration: "~45 seconds"
feeds_video: "Rigid Body Contact: LCP Solvers and Coulomb Friction"
difficulty: advanced
tags: [physics, simulation, short, advanced, lcp, contact, friction, rigid-body, complementarity]
---

> **What it is:** A ~45-second simulation of stacked rigid blocks settling under gravity while an LCP solver enforces Coulomb friction cones at every contact point to prevent interpenetration and sliding. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Rigid Body Contact: LCP Solvers and Coulomb Friction

# Short: LCP Contact Solver with Friction Cone

**Feeds full video:** Rigid Body Contact: LCP Solvers and Coulomb Friction

## Visual Hook (First 3 Seconds)
Twenty rigid white cubes tumble down a dark ramp (#111122) and pile up against a wall. Each contact point flashes an orange dot. Counter: "247 contact points — solved in 0.8 ms". One cube teeters on an edge, held by friction.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Single contact pair isolated: a red cube resting on a blue floor. Normal force vector (white, upward) and friction force vectors (orange, tangential) drawn at the contact point.
- **0:10** — Friction cone visualization: a green cone appears at the contact point, apex down. Half-angle = arctan(μ) = arctan(0.4) = 21.8°. Text: "Coulomb cone: ‖fₜ‖ ≤ μ fₙ".
- **0:18** — LCP problem written out: **Mẋ + q ≥ 0, x ≥ 0, xᵀ(Mẋ + q) = 0**. Each term colour-coded: M (blue), x (gold), q (red). "Complementarity condition" in white below.
- **0:27** — Lemke's algorithm pivot table animates: rows and columns of a 6×6 matrix highlight as pivots execute. Counter: "Step 1 of 4… Step 2… done". Solution vector x (normal + friction forces) fills in green.
- **0:35** — Multi-contact simulation: 64 cubes in a pile. Solver iterations visualized as a convergence bar (Gauss-Seidel LCP): residual drops from 10⁻¹ → 10⁻⁶ in 12 iterations shown as a log-scale plot (blue).
- **0:43** — Stacking demo: 10 cubes stacked in a tower. μ = 0.3. Tower stable. μ drops to 0.1 — tower collapses dramatically (slow-mo, 0.1× speed). Text: "μ = 0.1 — friction fails".

## Physics Concept Teased
The Linear Complementarity Problem (LCP) encodes Coulomb friction contact as a non-negative, mutually exclusive complementarity between contact impulse and gap velocity, enabling exact rigid-body non-penetration with bounded friction in a single linear system.

## On-Screen Text / Captions
- **0:00** — "247 contacts. 0.8 milliseconds." (white, top)
- **0:10** — "Coulomb cone: ‖fₜ‖ ≤ μ fₙ" (green, at cone)
- **0:18** — "Complementarity: either gap closes OR force acts" (white, bottom bar)
- **0:27** — "Lemke's algorithm — pivoting to the solution" (gold, upper)
- **0:35** — "Gauss-Seidel LCP: 12 iterations" (cyan, graph label)
- **0:43** — "Friction coefficient controls everything" (white, bottom)

## End Card
Final 3 seconds: collapsed cube tower rubble glows orange at each contact. "CODED LAWS" in white. Subscribe ring. "Next: GJK Collision →" teaser.

## Audio
Satisfying "clunk" sfx on each cube contact; percussive 95 BPM rhythm; low bass drop when tower collapses at 0:43. No voiceover.

## Production Notes
Solver: custom Python LCP (Lemke + Gauss-Seidel fallback). Renderer: Blender 3.6 Cycles with cube rigid bodies driven by simulation data. Contact detection: AABB broadphase + GJK narrowphase. μ = 0.4 default. Time step Δt = 1/120 s.
