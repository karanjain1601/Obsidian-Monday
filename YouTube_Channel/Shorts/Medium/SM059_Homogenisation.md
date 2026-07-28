---
title: "Homogenisation — Bulk Properties from Microstructure"
id: SM059
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, homogenisation, multiscale, composite-materials, FEM, microstructure]
---

> **What it is:** A ~45-second simulation short where a zoom into carbon-fibre composite reveals stiff dark fibres in soft epoxy, and an FEM solve on the periodic Representative Volume Element yields the effective stiffness tensor — bridging microstructure to macro-scale engineering properties with Voigt and Reuss bounds as analytical guardrails. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Homogenisation — Bulk Properties from Microstructure

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Zoom in on a composite material — carbon fibre reinforced polymer. At the macro scale: a smooth grey solid. Zoom in: a regular array of stiff carbon fibres (dark) embedded in a soft epoxy matrix (light). The question appears: "What are the effective stiffness properties of this composite?"

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The Representative Volume Element (RVE): a small, periodic unit cell containing one fibre and surrounding matrix. Apply periodic boundary conditions. Solve for the microscale displacement field under a unit macroscopic strain. The resulting stress field averaged over the RVE gives the effective stiffness tensor C_eff. Caption: "RVE + periodic BCs → effective properties."

**0:10–0:18** — Voigt and Reuss bounds: Voigt (parallel loading): E_v = φ·E_f + (1-φ)·E_m. Reuss (series loading): 1/E_r = φ/E_f + (1-φ)/E_m. The true effective modulus lies between these bounds. Caption: "Voigt upper bound; Reuss lower bound." Bar chart shows E_f (carbon fibre: 250 GPa), E_m (epoxy: 3.5 GPa), E_Voigt, E_Reuss, E_FEM_RVE.

**0:18–0:27** — FEM RVE solution: the microstructure shows a localised stress concentration near the fibre-matrix interface. Hot spots (red) where interfacial stress is maximum — a debonding risk. Caption: "Interfacial stress concentration — failure origin." Volume fraction φ swept from 0% to 60%: effective modulus increases.

**0:27–0:36** — Multi-scale: the homogenised effective properties are used in the macro-scale bridge FEM from SM057. The composite bridge is lighter and stiffer. Caption: "Micro informs macro — two-scale modelling."

**0:36–0:45** — Other microstructures: foam (open-cell), brick wall, woven fabric. Each has a different effective stiffness anisotropy. Shown as 2D polar plots of directional stiffness. Bold text: "Homogenisation: the bridge from microstructure to engineering." Fade to black.

## Physics Concept Teased
Homogenisation: given a periodic microstructure, solve the cell problem on the RVE to compute effective (homogenised) material properties. The effective stiffness tensor relates macroscopic stress to macroscopic strain. The Voigt and Reuss bounds provide analytical upper and lower bounds; FEM of the RVE gives the exact answer.

## On-Screen Text / Captions
- **0:00** — "What are this composite's bulk properties?"
- **0:05** — "RVE: solve on unit cell, average the result"
- **0:12** — "Voigt: E = φE_f+(1-φ)E_m (upper bound)"
- **0:20** — "Interfacial stress — where failure begins"
- **0:28** — "Micro informs macro: two-scale modelling"
- **0:35** — "Foam, fabric, brickwork — each anisotropic"
- **0:43** — "Homogenisation — microstructure to engineering."

## End Card
Final 3 seconds: carbon fibre composite cross-section with FEM stress colour-map overlay. Text: "Used in aerospace composites, battery electrodes, and bone biomechanics." CodedLaws logo.

## Audio
Precise, methodical electronic (80 BPM). Zoom-in sound effect as the microscale is revealed. Voiceover at 0:00: "Material properties come from microstructure — homogenisation makes the connection rigorous." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D (2D FEM) or WebGL. Key algorithm: 2D FEM homogenisation. RVE mesh: unit cell with fibre as a circular inclusion. Apply 6 macroscopic strain states (ε_xx=1, ε_yy=1, γ_xy=1, etc.) with periodic BCs. Solve for micro-displacement, compute micro-stress. Average stress over RVE → one row of C_eff. Repeat for all 3 strain states → full C_eff tensor. Voigt/Reuss: analytic formulas. Anisotropy polar plot: solve for E(θ) from C_eff rotated by θ. Gotcha: periodic BCs require special handling in the FEM assembly — master-slave node coupling. Runtime: pre-rendered; each RVE solve takes seconds for a 100×100 mesh.
