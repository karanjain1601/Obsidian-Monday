---
title: "FEM — Stress Field in a Bridge Under Load"
id: SM057
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, FEM, stress-analysis, structural-mechanics, bridge, engineering]
---

> **What it is:** A ~45-second simulation short where a truck load applied to a 2D truss bridge triggers a rainbow von Mises stress colour-map — exposing compression in the top chord, tension in the bottom, and a progressive failure cascade as load increases element by element toward yield. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: FEM — Stress Field in a Bridge Under Load

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 2D truss bridge — dark grey on black. A truck icon appears at the midpoint and its weight is applied. In 3 seconds the bridge deforms visibly (greatly exaggerated) and a rainbow stress colour-map lights up the bridge members — red at the most stressed locations, blue at the least.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — FEM concept: the bridge is divided into triangular elements. Each element has nodes (corners). The global stiffness matrix K assembled from element stiffness matrices k_e. Caption: "K·u = f — the FEM equation." The displacement vector u and load vector f shown. 2,000 elements, 1,000 nodes.

**0:10–0:18** — Element stress: within each element, stress σ = E·B·u_e where B is the strain-displacement matrix and E is Young's modulus. Colour-map shown: von Mises stress (σ_vm = √(σx²-σxσy+σy²+3τxy²)). Red = near yield stress; blue = low stress. Most stressed: midspan bottom chord and support joints.

**0:18–0:27** — Load path: force flow shown as thickness-of-lines overlay. The truck load flows through the bridge members — compression in the top chord, tension in the bottom chord, diagonals alternating tension/compression. Caption: "Tension (blue) vs. compression (red) members."

**0:27–0:36** — Material failure: incrementally increasing load until the first element fails (red to black when σ_vm > σ_yield). Progressive failure: one member yields → redistributes load → next member yields → collapse. Caption: "Progressive failure cascade." The collapse shown in slow motion.

**0:36–0:45** — Real engineering comparison: the Millau Viaduct or Golden Gate stress distribution rendered. Caption: "FEM used for every modern bridge, aircraft, building." Bold text: "FEM — the foundation of engineering simulation." Fade to black.

## Physics Concept Teased
Finite Element Method (FEM): the structure is divided into small elements; each element's stiffness is computed from material properties; the global stiffness matrix K is assembled; solved K·u = f for nodal displacements; element strains and stresses derived from displacements. FEM is the primary computational tool in structural, thermal, and fluid mechanics engineering.

## On-Screen Text / Captions
- **0:00** — "A bridge under load — where does it stress?"
- **0:05** — "K·u = f — 1000 nodes, 2000 elements"
- **0:12** — "Von Mises stress: σ_vm = √(σx²-σxσy+σy²+3τxy²)"
- **0:20** — "Compression (top chord) vs. tension (bottom chord)"
- **0:28** — "σ_vm > σ_yield → element fails → cascade"
- **0:35** — "FEM: every bridge, aircraft, building"
- **0:43** — "FEM — the foundation of engineering."

## End Card
Final 3 seconds: the fully loaded bridge stress map in rainbow colours. Text: "Every structure you trust was designed with FEM." CodedLaws logo. CTA: "Full FEM implementation from scratch in description."

## Audio
Structural, methodical electronic (80 BPM). Metallic groaning sounds as load increases. Crack sound at first failure. Voiceover at 0:00: "Every bridge you've crossed was stress-tested by the Finite Element Method — before it was ever built." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D or WebGL. Key algorithm: 2D plane-stress FEM. Mesh: triangular elements (linear or quadratic). Element stiffness: k_e = t·∫B^T·D·B dA (D = material stiffness matrix for plane stress). Assembly: scatter k_e into global K. BCs: fix support nodes (zero displacement rows). Solve K·u = f using conjugate gradient or direct solver. Post-process: compute element strains ε = B·u_e, stresses σ = D·ε, von Mises stress. Visualise: colour-fill each triangle by σ_vm. For collapse: at each load step, if σ_vm > σ_yield, set element Young's modulus to near-zero. Runtime: pre-rendered for full simulation; real-time for small meshes (<500 elements) in JavaScript.
