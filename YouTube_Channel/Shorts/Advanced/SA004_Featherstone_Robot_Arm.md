---
title: "Featherstone Articulated Body: Robot Arm O(N) Dynamics"
id: SA004
type: youtube-short
duration: "~45 seconds"
feeds_video: "Rigid Body Trees: Featherstone's O(N) Algorithm Explained"
difficulty: advanced
tags: [physics, simulation, short, advanced, featherstone, articulated-body, robotics, multibody]
---

> **What it is:** A ~45-second simulation of a 7-DOF robot arm computing full forward dynamics in O(N) time using Featherstone's articulated-body spatial algebra. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Rigid Body Trees: Featherstone's O(N) Algorithm Explained

# Short: Featherstone Articulated Body — Robot Arm O(N) Dynamics

**Feeds full video:** Rigid Body Trees: Featherstone's O(N) Algorithm Explained

## Visual Hook (First 3 Seconds)
A 7-DOF robot arm (dark gunmetal links, cyan joint rings glowing) swings through a full 270° sweep in 0.4 seconds. Speed lines trail each link. Counter in top-right: "7 joints — 7 equations — O(N) time".

## Main Visual Sequence (0:03–0:50)
- **0:03** — Robot arm freezes. Each link highlighted in sequence (1→7) with gold outline. Mass and inertia tensor values pop up next to each: "m₁ = 2.4 kg, I₁ = diag(0.08, 0.09, 0.04) kg·m²".
- **0:10** — "Step 1: Outward sweep" caption. Velocity propagation: joint 1 rotates; a gold arrow (spatial velocity vector in 6D) passes down the kinematic chain link by link, each adding its contribution. Spatial velocity screw axis shown as helix.
- **0:18** — "Step 2: Inward sweep" caption (red arrows travel back up the chain). Articulated-body inertia matrices H_i accumulate (shown as 6×6 blue matrices stacking at each link). Force bias term shown as red vector.
- **0:27** — Side panel: naive O(N³) mass-matrix inversion (red bar) vs Featherstone O(N) (blue bar, 7× shorter). Benchmark table: N=7 → 0.012 ms; N=100 → 0.18 ms; N=1000 → 1.9 ms.
- **0:35** — Real-time control demo: robot arm tracks a moving red target sphere. Joint angles update at 1 kHz shown in rolling numbers. Arm smoothly follows the sphere in 3D, no lag.
- **0:43** — Equation panel: **q̈ = H⁻¹(τ − C(q,q̇))** vs ABA pass equations. Text: "No matrix inversion needed".

## Physics Concept Teased
The Articulated Body Algorithm (ABA) propagates spatial forces and inertias along the kinematic tree in two passes — outward for velocities, inward for force accumulation — computing joint accelerations in O(N) operations without ever forming or inverting the full N×N mass matrix.

## On-Screen Text / Captions
- **0:00** — "7 joints. No matrix inversion." (white, top)
- **0:10** — "Outward pass: velocity propagation" (gold, upper-left)
- **0:18** — "Inward pass: force accumulation" (red, upper-left)
- **0:27** — "O(N) beats O(N³) at any chain length" (white, bottom bar)
- **0:35** — "1 kHz real-time control" (cyan, upper-right)
- **0:43** — "ABA derivation → full video ↑" (white, bottom)

## End Card
Final 3 seconds: robot arm waves at camera (scripted motion). "CODED LAWS" in cyan. Subscribe button. "SA005: Lagrangian Mechanics →" teaser.

## Audio
Mechanical servo whir sfx synced to joint motion; 100 BPM industrial electronic backing; no voiceover.

## Production Notes
Simulator: custom Python/Pinocchio implementation of Featherstone ABA. Robot model: 7-DOF Franka Panda URDF. Rendered in MuJoCo viewer with metallic material shader. Benchmark timing on Intel i9-13900K, single thread. Spatial vector algebra in se(3).
