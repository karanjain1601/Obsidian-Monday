---
title: "Euler's Disk: Why It Speeds Up Before Stopping"
id: SB149
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, euler-disk, precession, dissipation]
---

> **What it is:** A ~45-second simulation short where a thick silver coin spins on a mirrored surface and its wobble rate paradoxically accelerates as it winds down, culminating in a high-pitched buzz before a sudden flat CLACK — revealing the finite-time singularity where decreasing tilt angle drives precession rate toward infinity. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Euler's Disk: Why It Speeds Up Before Stopping
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A thick silver coin (Euler's disk) spins on a flat mirrored surface. As it winds down, instead of slowing its wobble — the wobble speeds up dramatically, the rattle becomes a high-pitched buzz, and the coin seems to hover at a tiny angle before abruptly stopping with a final CLACK. The whole sequence is hypnotic.

## Main Visual Sequence (0:03–0:50)
**0:03** — Side view: flat mirror surface (white), thick silver coin (60px diameter, 10px thick) tilted at 30° and spinning. Spin rate: 3 rev/s. Precession rate (wobble): 1 wobble/s. Contact point traces a circle on the mirror (orange dotted path).

**0:10** — As time advances (3× speed), spin rate slowly decreases (energy lost to rolling friction). But the precession rate (wobble frequency) increases. Label: "Spin rate ↓ — Wobble rate ↑." Sound pitch rises with wobble rate.

**0:18** — Close-up on contact mechanics: the disk rolls on its rim along a shrinking contact circle. Air viscosity and rolling friction dissipate energy. But geometric constraint links tilt angle to precession rate — as tilt angle θ decreases (disk flattens), precession rate ∝ 1/√θ → diverges.

**0:27** — Physics graph in corner: two curves diverging — spin rate (blue, decreasing) and wobble rate (red, shooting upward toward infinity). At finite time T*, both meet their fate — the disk stops. "Finite-time singularity" label.

**0:35** — The final 2 seconds of the disk's life shown in slow motion: disk nearly flat (θ = 2°), rattle is a blur, contact circle has shrunk to nearly a point. Then — CLACK — disk lies flat.

**0:43** — Unsolved mystery flash: "Despite the math, why it truly terminates in finite time is still debated." Reference: Moffatt (2000), Nature. CodedLaws logo.

## Physics Concept Teased
Euler's disk loses spin energy to friction, causing its tilt angle to decrease. By geometric constraint, as the angle shrinks toward zero, the precession (wobble) rate diverges toward infinity — mathematically predicting it should wobble infinitely fast before stopping in finite time, a surprising singularity still studied in physics.

## On-Screen Text / Captions
- 0:03 → "Euler's Disk — spinning and wobbling"
- 0:10 → "Spin ↓ but wobble ↑ — why?"
- 0:18 → "Tilt angle θ → 0: wobble ∝ 1/√θ"
- 0:27 → "Finite-time singularity in the equations"
- 0:35 → "Final 2 seconds — rattle becomes a blur"
- 0:43 → "Still an open physics problem (2000)"

## End Card
Final 3 seconds: Coin lying flat on mirror, slow-motion ripple on mirror surface. Text: "Simple toy, unsolved physics." CodedLaws logo and subscribe button.

## Audio
Minimalist ambient music. Key audio: actual rattle sound that starts slow, gradually speeds up pitch and tempo, climaxes in a high buzz, then sudden CLACK of disk falling flat. No voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D with 3D projection (disk drawn as ellipse with minor axis proportional to cos(θ)). Key visual trick: animate θ(t) decreasing as θ(t) ≈ (T*−t)^(2/3) (Moffatt model); precession rate ψ̇ ∝ 1/√θ(t). Draw contact circle shrinking accordingly. Runtime: pre-rendered for smoothness. Gotcha: at very small θ, numerical precision requires small timestep; cap wobble rate visually at 30 Hz.
