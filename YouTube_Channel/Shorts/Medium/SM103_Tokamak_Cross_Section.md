---
title: "Tokamak Cross-Section — Plasma Confinement"
id: SM103
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Fusion_Energy_Full]]"
difficulty: medium
tags: [physics, simulation, short, plasma, fusion, tokamak, magnetic-confinement]
---

> **What it is:** A ~45-second simulation short of a D-shaped tokamak plasma cross-section confined in nested magnetic flux surfaces, showing the divertor X-point, sawtooth oscillations, and ELM bursts erupting at the plasma edge. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Fusion_Energy_Full]]

# Short: Tokamak Cross-Section — Plasma Confinement
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A D-shaped glowing plasma cross-section — burning in brilliant amber and white at the core, fading to red at the edges — floats on a black background inside a cage of curved magnetic field lines. The plasma pulses gently, alive, contained but barely.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Poloidal cross-section of a tokamak (D-shape, like ITER). Plasma pressure contours shown as nested color shells — white core (100 million K), yellow, orange, red toward edge. Magnetic axis (O-point) marked with a white dot.
- **0:10–0:18:** Magnetic field line topology revealed: helical field lines wind around nested toroidal surfaces. In 2D cross-section these appear as closed loops. Safety factor q profile shown on right: q < 1 at core, q > 1 at edge. Color scale for q from blue to red.
- **0:18–0:28:** Zoom to edge: the X-point divertor configuration appears — two field lines form an X-shaped separatrix at the bottom of the D. Particles that cross the separatrix are guided along open field lines to the divertor plates (shown as grey targets at bottom). Particle trajectory in yellow follows an open field line to the divertor.
- **0:28–0:38:** Instability triggered: a sawtooth oscillation — core pressure crashes periodically. Color of core flickers white → dim → white. Then an ELM (Edge Localized Mode) burst flashes at the plasma edge — bright orange spike erupting outward from the separatrix.
- **0:38–0:45:** Zoom out to full machine cross-section schematic: first wall (grey), blanket module (teal), vacuum vessel (dark), outer coils (gold rings). Label arrows point to each. Core still glows white at center.

## Physics Concept Teased
A tokamak confines plasma using a combination of a toroidal field (from external coils) and a poloidal field (from plasma current). Helical field lines form nested toroidal flux surfaces. The divertor X-point handles exhaust and impurity removal. MHD instabilities like sawteeth and ELMs remain the key challenge for steady-state operation.

## On-Screen Text / Captions
- **0:00:** "100 million degrees. Contained by nothing but magnetic fields."
- **0:08:** "Pressure: 10× hotter than the Sun's core"
- **0:15:** "Nested flux surfaces keep plasma from touching walls"
- **0:22:** "X-point: where exhaust exits"
- **0:30:** "ELM burst — plasma edge explosion"
- **0:38:** "ITER will do this at 500 MW"
- **0:44:** "Fusion is 30 years away. It always has been."

## End Card
Final 3 seconds: wide shot of the D-shaped plasma glowing on black, ELM burst in slow motion. Text: "The hardest engineering problem in history." Channel logo.

## Audio
Deep resonant hum (toroidal field coil electromagnetic sound). Voiceover (measured, serious): "The plasma is 10 times hotter than the Sun's core. The wall is one meter away." Crack sound effect for ELM burst at 0:30. Ambient low-frequency electromagnetic drone throughout.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D + p5.js. Key algorithm: MHD equilibrium solved via Grad-Shafranov equation (ΔΨ = -μ₀R²dp/dΨ - F·dF/dΨ) on a 256×256 poloidal grid using SOR (successive over-relaxation). Flux surface contours plotted as isocontours of Ψ. Safety factor q = (1/2π)∮dℓ/R·B_p for each surface. ELM modeled as sudden pressure reduction at edge with radial velocity spike. Gotcha: D-shape geometry requires non-rectangular grid or conformal mapping. Pre-render the equilibrium, then animate pressure oscillations in real-time on top.
