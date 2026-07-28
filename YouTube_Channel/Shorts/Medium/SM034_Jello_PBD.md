---
title: "Jello Physics — PBD Soft Body"
id: SM034
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, soft-body, PBD, position-based-dynamics, jello, game-physics]
---

> **What it is:** A ~45-second simulation short dropping a translucent jello cube and watching it squash, bounce, and wobble as thousands of geometric distance constraints are iteratively satisfied each frame using Position-Based Dynamics. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Jello Physics — PBD Soft Body

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A translucent green jello cube, glistening with specular highlights, sits on a dark surface. A ball drops onto it — the jello squashes dramatically, bounces back, wobbles in slow oscillations, the cube's faces rippling like a gel. Every wobble is viscerally satisfying.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — PBD overview: the jello is a lattice of particles connected by distance constraints. Internal nodes shown as small cyan spheres, edges as white lines. When the ball impacts, distance constraints are violated and projected back toward their rest lengths. Caption: "PBD: satisfy constraints iteratively."

**0:10–0:18** — Constraint projection shown step by step: two particles connected by a spring — their positions corrected each iteration. More iterations → stiffer jello. Slider: Iterations = 1 (very soft, stretchy) → 10 (moderately stiff) → 100 (almost rigid). Caption: "Stiffness via solver iterations."

**0:18–0:27** — Jello hits the ground: contact constraints prevent ground penetration. The cube deforms on impact and bounces. Slow-motion: the bounce shows volumetric compression (the cube flattens) followed by rebound and violent wobbling. Volumetric constraints (shape-matching) preserve volume.

**0:27–0:36** — Shape matching extension: the original rest-shape shown as a ghost outline. After impact, the ghost is fitted to current positions (best-fit rotation), and particles are pulled back toward it. Caption: "Shape matching — restores rest shape." The cube wobbles but always recovers its cube form.

**0:36–0:45** — Montage: five different PBD objects — jello cube, rubber bunny, cloth flag, jello torus, soft octopus. Each squashed and released. Bold text: "PBD — real-time soft body physics in games." Fade to black.

## Physics Concept Teased
Position-Based Dynamics (PBD): instead of forces, PBD directly corrects particle positions to satisfy geometric constraints (distance, volume, shape). The method is unconditionally stable, easily parallelisable, and used in real-time game engines (NVIDIA PhysX, Unreal, Unity). Stiffness is controlled by the number of solver iterations per frame.

## On-Screen Text / Captions
- **0:00** — "Jello. Dropped."
- **0:05** — "PBD: particle positions corrected to satisfy constraints"
- **0:12** — "Iterations = 1 (soft) → 100 (rigid)"
- **0:20** — "Contact + volumetric constraints on impact"
- **0:28** — "Shape matching restores rest shape"
- **0:35** — "Games use PBD for all soft objects"
- **0:43** — "PBD — real-time soft body physics."

## End Card
Final 3 seconds: all five PBD objects bouncing simultaneously. Text: "Every AAA game runs some form of PBD." CodedLaws logo. CTA: "Code walkthrough in bio."

## Audio
Bouncy, playful electronic (100 BPM). Satisfying "squish" sound on impact. Gentle spring-back "boing" on each bounce. Voiceover at 0:00: "Instead of solving forces, PBD just moves particles until they satisfy geometric rules — unconditionally stable." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: three.js with custom PBD solver. Key algorithm: PBD loop: (1) apply gravity to velocities; (2) predict new positions; (3) project distance constraints (N iterations); (4) project volume/shape-matching constraints; (5) update velocities from position change. Jello lattice: 5×5×5 cube of particles, ~300 distance constraints. Shape matching: compute best-fit rotation via SVD or quaternion fitting. Ground contact: positional constraint h ≥ 0. Gotcha: high stiffness requires many iterations — tune for performance vs. visual quality. Runtime: real-time at 60fps with JavaScript, fast in WebAssembly/WebGL.
