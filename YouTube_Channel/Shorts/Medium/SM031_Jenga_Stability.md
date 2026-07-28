---
title: "Jenga Block Removal Stability"
id: SM031
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, rigid-body, stability, statics, jenga, physics-engine]
---

> **What it is:** A ~45-second simulation short tracking the centre of mass as blocks are removed from a 3D Jenga tower, showing exactly when the tower must topple — and which blocks are safe to pull — using the support-polygon stability criterion. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Jenga Block Removal Stability

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 3D Jenga tower, 18 levels tall, rendered with realistic wood texture. A single block near the middle is slowly extracted. The tower wobbles. Will it fall? In 3 seconds the block is removed and the tower somehow stays — then immediately another is extracted and the whole thing collapses.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Safe removal: centre of mass (COM) shown as a glowing red sphere tracked at each block removal. Rule shown: "Tower is stable if COM is within the base polygon." COM stays within the base. Tower teeters but stabilises.

**0:10–0:18** — Unsafe removal: COM is shown tracking to the edge of the base support. Critical moment: COM exits the base polygon. Tower begins to topple, contact forces (shown as green force arrows at the base) cannot restore balance. Spectacular block-by-block collapse cascade.

**0:18–0:27** — Stress analysis: force flow through the Jenga tower visualised. Contact forces between blocks shown as coloured lines (thick = high force, thin = low force). Removing a block reroutes the force paths — some blocks take much higher loads. Caption: "Force redistribution after removal."

**0:27–0:36** — The "optimal strategy": which blocks can be safely removed? A heat-map overlay on the tower shows safe blocks (green), borderline (yellow), and dangerous (red) based on COM calculation. Safe blocks are at the ends of each row. Caption: "Physics predicts the safe move."

**0:36–0:45** — Fast montage: 10 consecutive safe block removals. Tower grows increasingly precarious — 20 blocks remain supporting 36 stories. COM is right at the base edge. Bold text: "Stability limits: physics wins." Final collapse shown in slow motion. Fade to black.

## Physics Concept Teased
Rigid-body statics: a stack of blocks is stable if and only if the combined centre of mass of all blocks above any level lies within the support polygon at that level. Force flows through a network of contact forces. Removing blocks changes the force network — some blocks are critical, others carry near-zero load.

## On-Screen Text / Captions
- **0:00** — "Which block can you pull?"
- **0:05** — "COM within base polygon → stable"
- **0:12** — "COM exits base → collapse"
- **0:20** — "Force redistribution after each removal"
- **0:28** — "Green = safe | Yellow = risky | Red = game over"
- **0:35** — "10 safe removals — then collapse"
- **0:43** — "Physics predicts every move."

## End Card
Final 3 seconds: slow-motion Jenga collapse with blocks scattering in 3D. Text: "Real Jenga world record: 45 rows — 135 blocks removed." CodedLaws logo.

## Audio
Tense, minimal percussion (60 BPM). Dramatic wood-creak sounds as blocks slide. Each successful removal = satisfying "click." Collapse = loud cascade of wooden blocks clattering. Voiceover at 0:00: "Every Jenga move has a physics answer — stable or not." No other voiceover.

## Production Notes
Code complexity: moderate to complex. Renderer: three.js with Cannon.js or Rapier physics. Key algorithm: rigid body dynamics with box colliders; contact constraints (Gauss-Seidel solver). For stability analysis: static solver — sum torques about base edge. COM tracking: sum (mass × position) / total mass for all blocks above current level. COM visualisation: red sphere at COM position. Gotcha: numerical solver may allow physically impossible configurations — add small perturbations to trigger realistic toppling. Runtime: real-time with physics engine.
