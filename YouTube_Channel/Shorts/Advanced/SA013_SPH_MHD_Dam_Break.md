---
title: "SPH Electromagnetics: MHD Dam Break"
id: SA013
type: youtube-short
duration: "~45 seconds"
feeds_video: "Magnetohydrodynamics: Simulating Conducting Fluids"
difficulty: advanced
tags: [physics, simulation, short, advanced, sph, mhd, magnetohydrodynamics, dam-break, plasma]
---

> **What it is:** A ~45-second simulation of an SPH dam-break in liquid metal under an applied magnetic field, with the Lorentz force decelerating the flood front and creating Hartmann-layer flow effects. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Magnetohydrodynamics: Simulating Conducting Fluids

# Short: SPH Electromagnetics — MHD Dam Break

**Feeds full video:** Magnetohydrodynamics: Simulating Conducting Fluids

## Visual Hook (First 3 Seconds)
A column of liquid metal (silver-blue, 100,000 SPH particles) collapses in a magnetic field (field lines shown as glowing red horizontal stripes). The fluid spreads sideways normally — then the magnet turns on and the fluid recoils, surging upward in a column. Text: "Magnetic pressure stops the flow".

## Main Visual Sequence (0:03–0:50)
- **0:03** — Particle colouring: velocity magnitude (blue = 0 m/s → red = 3.2 m/s). External B-field = 2 T shown as horizontal gold arrows pointing in x-direction. Column height H₀ = 0.4 m.
- **0:10** — MHD force panel: Lorentz force J×B shown at each particle as a tiny green arrow. Where current J (induced by motion) is large, force pushes back against flow. "Hartmann number Ha = BL√(σ/ρν) = 120" in white.
- **0:18** — Hartmann layer formation: side wall zoom shows thin boundary layer (thickness δ_Ha = L/Ha = 0.002 m) where fluid velocity drops steeply. Colour shows u-velocity: bulk 0.8 m/s → wall 0 m/s in 2 mm.
- **0:27** — Free-surface SPH: divergence-free projection step animated. Pressure (green contours) updates around each particle's neighbourhood (shown as grey circle radius 2h). Corrected velocity vectors (white arrows) point away from high-pressure zones.
- **0:35** — Alfvén wave: after dam collapses, a magnetic wave propagates through the fluid at v_A = B/√(μ₀ρ) = 1.6 m/s. Wave visible as oscillating density stripe (gold pulse travelling right). Text: "v_A = 1.6 m/s".
- **0:43** — Without B (left): dam break spreads to x = 1.2 m at t = 0.5 s. With B = 2 T (right): spread limited to x = 0.7 m. Measurement arrows shown in red/blue.

## Physics Concept Teased
SPH magnetohydrodynamics couples the Navier-Stokes equations with Maxwell's equations through the Lorentz body force J×B, where induced currents in the conducting fluid create a magnetic braking pressure that opposes flow, forming thin Hartmann boundary layers at solid walls.

## On-Screen Text / Captions
- **0:00** — "B = 2 Tesla. The fluid fights back." (white, top)
- **0:10** — "Lorentz force J×B — magnetic braking" (green, lower)
- **0:18** — "Hartmann layer: Ha = 120, δ = 2 mm" (white, bottom bar)
- **0:35** — "Alfvén wave: v_A = 1.6 m/s" (gold, annotation)
- **0:43** — "B = 0: spread 1.2 m" (blue) / "B = 2 T: spread 0.7 m" (red)

## End Card
Final 3 seconds: MHD fluid settles with magnetic field lines glowing. "CODED LAWS" in silver. Subscribe. "Next: GRMHD Jet →" teaser.

## Audio
Deep electromagnetic hum when B-field turns on; metallic liquid splash sfx; low-frequency pulse for Alfvén wave. 75 BPM industrial ambient. No voiceover.

## Production Notes
SPH-MHD solver: custom C++/CUDA (DualSPHysics extended). Kernel: Wendland C2, h = 0.01 m. Induction equation: constrained transport to maintain ∇·B = 0 to machine precision. Resistivity η = 10⁻⁶ Ω·m (liquid sodium properties). 100,000 particles on RTX 3080, 15 min simulation.
