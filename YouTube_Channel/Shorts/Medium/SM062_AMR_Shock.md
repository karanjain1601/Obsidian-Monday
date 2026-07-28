---
title: "Adaptive Mesh Refinement — Shock Wave Capturing"
id: SM062
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, AMR, adaptive-mesh-refinement, shock-wave, CFD, compressible-flow]
---

> **What it is:** A ~45-second simulation short where a supersonic jet simulation automatically refines its computational mesh along a sharp shock wave while leaving smooth regions coarse, demonstrating Adaptive Mesh Refinement that achieves uniform-mesh accuracy at 2000× fewer cells using a quadtree hierarchy. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Adaptive Mesh Refinement — Shock Wave Capturing

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A supersonic jet flow simulation. The mesh is visible: coarse everywhere, fine around the jet. The shock wave is a sharp red line. As the frame plays, the mesh auto-refines along the shock — cells shrink from large squares to tiny squares exactly where needed. No human adjusts anything.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — AMR motivation: a uniform fine mesh for this domain would need 10,000×10,000 = 100 million cells. With AMR: only 50,000 cells needed (same accuracy where it matters). Memory and compute reduced by 2000×. Caption: "AMR: 2000× fewer cells, same accuracy at the shock."

**0:10–0:18** — Refinement criterion: gradient of density |∇ρ| shown as a colour-map. High gradient = red (shock, contact discontinuity). Low gradient = blue (smooth flow). Cells with |∇ρ| > threshold are flagged for refinement; cells with |∇ρ| < threshold/4 are coarsened. Caption: "Refine where gradient is large."

**0:18–0:27** — Refinement tree structure: each cell is a leaf of an octree (2D: quadtree). Flagged cells split into 4 children (2D). The mesh is shown as a quadtree with cells at different levels. Caption: "Quadtree AMR: each cell splits into 4." Level 1: 1,000 cells. Level 2: 4,000. Level 3: 16,000. Total (with local refinement): 8,000.

**0:27–0:36** — Time evolution: the shock moves and the mesh follows it. As the shock crosses the domain, fine cells appear ahead of it and coarsen behind it — a moving wave of refinement. Caption: "Dynamic AMR: mesh tracks the physics."

**0:36–0:45** — Three-level refinement shown simultaneously: global coarse (white grid), level-2 intermediate (blue), level-3 fine around shock (red). Sharp shock resolved at level 3 width: 1 cell. Zoom shows the shock captured in 2 cells width. Bold text: "AMR — numerical resolution that goes where the physics is." Fade to black.

## Physics Concept Teased
Adaptive Mesh Refinement (AMR): cells are refined locally where flow gradients are large (shocks, contact surfaces) and coarsened in smooth regions. For compressible flows with shocks, AMR achieves the same accuracy as a uniformly fine mesh at a fraction of the computational cost. The refinement tree (quadtree/octree) manages the hierarchy.

## On-Screen Text / Captions
- **0:00** — "Shock wave. How do you resolve it cheaply?"
- **0:05** — "AMR: 2000× fewer cells, same shock resolution"
- **0:12** — "Refine criterion: |∇ρ| > threshold"
- **0:20** — "Quadtree: each cell → 4 children"
- **0:28** — "Dynamic: fine mesh follows the moving shock"
- **0:35** — "3 refinement levels: global → intermediate → shock"
- **0:43** — "AMR — resolution where physics demands it."

## End Card
Final 3 seconds: the shock wave fully resolved against a coarse background mesh. Text: "AMR is used in astrophysics (galaxy formation), weather models, and supersonic aerodynamics." CodedLaws logo.

## Audio
Supersonic whoosh as the shock wave passes. Sharp crack sound at the shock. Voiceover at 0:00: "Instead of making the whole mesh fine, AMR puts resolution only where you need it — at the shock." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D or WebGL. Key algorithm: 2D Euler equations (compressible, inviscid) with a finite-volume solver on an AMR quadtree. Riemann solver: HLLC or Roe flux. AMR implementation: maintain a quadtree data structure. Each step: solve Euler on current mesh, compute ∇ρ per cell, flag cells for refinement/coarsening, split/merge cells (conservatively), rebalance. Refinement: each flagged cell splits; initialize children from parent values. Coarsening: average 4 children into parent. Gotcha: flux consistency at level boundaries (coarse-fine interfaces) requires special treatment. Runtime: real-time for 2D Euler on quadtree with ~10,000 cells.
