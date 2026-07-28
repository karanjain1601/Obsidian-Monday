---
title: "MHD Plasma Pinch — Z-Pinch Instability"
id: SM101
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Magnetohydrodynamics_Full]]"
difficulty: medium
tags: [physics, simulation, short, plasma, MHD, instability, fusion]
---

> **What it is:** A ~45-second simulation short where a current-carrying plasma column self-pinches under its own magnetic field and violently ruptures through growing sausage and kink MHD instabilities on the Alfvén timescale. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Magnetohydrodynamics_Full]]

# Short: MHD Plasma Pinch — Z-Pinch Instability
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A glowing white plasma column — tall, cylindrical, electric — stands against a jet-black background. Current arrows in gold rush upward along it. Then the column suddenly pinches inward at its midsection like a waist being squeezed, and the whole structure writhes and kinks violently in less than a second.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Side-view cross-section of a cylindrical plasma column (radius r₀). Axial current J_z shown as upward-pointing gold arrows. Induced azimuthal magnetic field B_φ shown as blue circles around the column. Magnetic pressure label appears.
- **0:10–0:18:** The plasma column compresses slightly. A pinch pressure balance graphic appears: J × B force (inward) vs. thermal pressure (outward). Equation bar: p + B²/2μ₀ = const scrolls in.
- **0:18–0:28:** A small perturbation seeds a sausage instability (m=0 mode). The column starts to neck: alternating thick and thin sections ripple downward at growing amplitude. Each neck glows hotter (orange → white) as compression spikes.
- **0:28–0:38:** The sausage mode saturates; a kink instability (m=1 mode) takes over — the entire column bends like a snake. The kink grows exponentially; bright orange nodes appear at the maximum bends. Alfvén speed label shown in corner.
- **0:38–0:45:** The column ruptures at the narrowest point in a bright flash. Energy released marker appears. Zoom to the rupture point showing current sheet formation in magenta.

## Physics Concept Teased
A current-carrying plasma is self-pinched by its own magnetic field (the z-pinch). This Bennett equilibrium is unstable: sausage (m=0) and kink (m=1) MHD instabilities grow on the Alfvén timescale τ_A = r₀/v_A, ultimately disrupting the plasma — the central challenge in z-pinch fusion devices.

## On-Screen Text / Captions
- **0:00:** "A plasma squeezes itself — then explodes."
- **0:08:** "J × B pinch force compresses the plasma"
- **0:18:** "Sausage instability (m = 0)"
- **0:28:** "Kink instability (m = 1)"
- **0:35:** "Growth rate ~ 1 / τ_Alfvén"
- **0:42:** "This is why fusion is hard."
- **0:45:** "#plasma #fusion #physics"

## End Card
Final 3 seconds: slow-motion replay of the kink rupture in deep red and orange on black. Text: "Why does plasma always fight back? Full video soon." Channel logo bottom-right.

## Audio
Heavy, pulsing electronic bass drone. Voiceover (robotic, calm): "Every current creates its own destroyer." Sharp electric crack sound effect at the rupture moment at 0:42. Rising synth tension from 0:18 to 0:42.

## Production Notes
Code complexity: moderate-complex. Renderer: WebGL with custom GLSL fragment shaders for the plasma glow (additive blending, bloom post-process). Key algorithm: 2D resistive MHD solver (finite volume, HLL Riemann solver) on a 256×512 cylindrical (r,z) grid. Instability seeded by white-noise perturbation on velocity field (amplitude 1e-3). Alfvén speed v_A = B/√(μ₀ρ) computed each frame. Gotcha: ensure CFL condition uses v_A not just fluid velocity. Color map: temperature → blackbody palette (black → red → orange → white).
