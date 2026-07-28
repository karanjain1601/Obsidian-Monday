---
title: "Kirchhoff Shell Buckling Under Compression"
id: SA003
type: youtube-short
duration: "~45 seconds"
feeds_video: "Thin Shell Mechanics: From Kirchhoff Theory to Buckling"
difficulty: advanced
tags: [physics, simulation, short, advanced, kirchhoff, shells, buckling, fem, structural]
---

> **What it is:** A ~45-second simulation loading a thin circular plate to its Kirchhoff critical load N_cr and watching it snap into a 4-lobed buckling eigenmode with 18 mm out-of-plane displacement. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Thin Shell Mechanics: From Kirchhoff Theory to Buckling

# Short: Kirchhoff Shell Buckling Under Compression

**Feeds full video:** Thin Shell Mechanics: From Kirchhoff Theory to Buckling

## Visual Hook (First 3 Seconds)
A perfectly flat steel-grey circular plate (radius 0.5 m, thickness 2 mm, shown with metallic shader) sits under zero load. Two red arrows labeled "−850 kN/m" appear at opposite edges and begin pushing inward. The plate shudders — then snaps into a 4-lobed buckling mode (bright crimson displacements, max 18 mm out-of-plane).

## Main Visual Sequence (0:03–0:50)
- **0:03** — Side-view: plate perfectly flat (grey). Text overlay "Pre-buckling: linear response". A load-displacement graph in the bottom-right corner traces a straight line (blue).
- **0:10** — Load ramps from 0 → 750 kN/m. Plate shows barely visible bow (exaggerated 20×). Graph line still linear. Color shows von Mises stress 0–400 MPa (blue → green).
- **0:18** — Critical load N_cr = 812 kN/m reached: graph line bifurcates (branch point glows gold). Plate snaps into first buckling eigenmode — a checkerboard dimple pattern (4 × 4 lobes), max displacement 14.3 mm shown in red.
- **0:27** — Eigenmode panel: first 6 buckling eigenmodes side by side in a 3×2 grid. Each labelled (Mode 1: n=4, m=1; Mode 2: n=2, m=2 etc.) in white sans-serif. Critical loads listed: 812, 860, 901, 944, 978, 1012 kN/m.
- **0:35** — Post-buckling: load continues to 1100 kN/m. Large-displacement nonlinear path (arc-length Riks method). Plate wrinkles deeply; texture shows plastic strain (red zones at fold ridges).
- **0:43** — Energy diagram: bending energy (blue curve) vs membrane energy (orange curve) vs total (white). Bending energy spikes at snap-through. Text: "Kirchhoff: no transverse shear".

## Physics Concept Teased
Kirchhoff shell theory assumes normals remain perpendicular to the mid-surface (no shear strain through thickness), allowing thin plates to bifurcate abruptly into buckling modes governed by the shell's bending stiffness D = Et³/12(1−ν²).

## On-Screen Text / Captions
- **0:00** — "850 kN/m. One thin plate." (white, top)
- **0:10** — "N_cr — critical buckling load" (white, lower-left)
- **0:18** — "Snap-through at 812 kN/m" (gold, center flash)
- **0:27** — "Six eigenmodes — one critical load" (white, bottom bar)
- **0:35** — "Riks arc-length traces post-buckling path" (white, bottom)
- **0:43** — "Full derivation → long video ↑" (white, bottom)

## End Card
Final 3 seconds: the buckled plate slowly relaxes back to flat in reverse slow-motion. "CODED LAWS" in silver. Subscribe button pulses. "Next: Featherstone Robot →" teaser.

## Audio
Deep resonant "thud" at snap-through (0:18); rising tension drone 0:00–0:18; post-snap — lower resolved chord. 85 BPM ambient electronic. No voiceover.

## Production Notes
FEM solver: FEniCS with Kirchhoff-Love shell element (DKT triangle). Mesh: 5,120 triangular elements on circular domain radius 0.5 m. Material: E = 200 GPa, ν = 0.3, t = 2 mm. Buckling analysis via SLEPc eigenvalue solver. Post-buckling via Riks arc-length method (step size Δs = 0.01). Rendered in ParaView with metallic PBR shader.
