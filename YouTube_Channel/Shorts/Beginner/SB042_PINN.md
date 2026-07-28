---
title: "Neural Net Solves Heat Equation"
id: SB042
type: youtube-short
duration: "~45 seconds"
feeds_video: "I Trained a Neural Net to Solve the Heat Equation"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short showing a split-screen where a mesh-based FEM solver and a smooth neural network produce nearly identical heat diffusion patterns, then toggling the physics loss off causes the neural solution to collapse into impossible temperature arrangements — revealing how PINNs bake the governing PDE directly into the training loss. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** I Trained a Neural Net to Solve the Heat Equation

# Short: Neural Net Solves Heat Equation

**Feeds full video:** I Trained a Neural Net to Solve the Heat Equation
**Duration:** ~45 seconds

---

## Visual Hook (First 3 Seconds)
Split-screen. Left: "FEM SOLVER." Right: "NEURAL NETWORK (PINN)." Both showing the same heat diffusion problem — a beautiful thermal gradient spreading across a 2D domain. They look identical.

## Main Visual Sequence (0:03–0:45)
**Beat 1 (0:03–0:10):** Both solutions shown side by side. Temperature fields nearly identical. The PINN output has no mesh, no timestep. "NO MESH. NO TIMESTEP. JUST A NEURAL NETWORK."
**Beat 2 (0:10–0:18):** Physics loss term toggled OFF on the PINN. The right solution immediately collapses — the temperature field morphs into a smooth but physically wrong pattern. Hot and cold regions in impossible positions.
**Beat 3 (0:18–0:26):** Physics loss turned back ON. The PINN solution snaps back toward the correct solution — converging visibly over 2 seconds of training. "THE LOSS IS THE PHYSICS."
**Beat 4 (0:26–0:32):** Show the two loss components: data loss (matching boundary conditions) and physics loss (satisfying the heat equation PDE at interior points). Together they force the solution to be both accurate and physical.
**Beat 5 (0:32–0:38):** Query the PINN at an arbitrary point: click anywhere on the domain, instantly get the temperature value. No grid needed. Continuous everywhere.
**Beat 6 (0:38–0:45):** "A neural network that solves differential equations. No grid. No timestep. Just calculus and weights." Final: "PHYSICS-INFORMED NEURAL NETWORKS."

## Physics Concept Teased
A PINN embeds the governing PDE directly into the loss function — so the neural network isn't just fitting data, it's required by its own training to satisfy the physics at every point, whether or not training data exists there.

## On-Screen Text / Captions
- "FEM SOLVER" / "NEURAL NETWORK (PINN)" (split-screen labels)
- "NO MESH. NO TIMESTEP. JUST A NEURAL NETWORK." (Beat 1)
- "PHYSICS LOSS: OFF" → "ON" (toggle, Beat 2–3)
- "THE LOSS IS THE PHYSICS." (Beat 3)
- "PHYSICS-INFORMED NEURAL NETWORKS." (final definition)

## End Card
Full video: "I Trained a Neural Net to Solve the Heat Equation" — link in bio. PINNs from scratch.

## Audio
When physics loss is OFF: a discordant, wrong-sounding tone. When physics loss is ON: the sound snaps to a clean, correct harmonic. The audio directly maps the physical correctness of the solution.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps. Left: finite element mesh visible, solution shown as colored triangular elements. Right: smooth neural network output, no mesh visible, continuous color gradient. The contrast in visual style (jagged FEM vs smooth PINN) is part of the story. Physics loss toggle is a prominent button. Temperature color: same thermal colormap on both sides for fair comparison.
