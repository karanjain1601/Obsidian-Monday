---
title: "Lattice Boltzmann MHD: Electromagnetic Fluid"
id: SA036
type: youtube-short
duration: "~45 seconds"
feeds_video: "Lattice Boltzmann Methods: From Kinetics to Magnetohydrodynamics"
difficulty: advanced
tags: [physics, simulation, short, advanced, lbm, mhd, lattice-boltzmann, electromagnetics, fluid]
---

> **What it is:** A ~45-second simulation of a conducting fluid in a duct under a transverse magnetic field using Lattice Boltzmann MHD, with the Lorentz force flattening the velocity profile into Hartmann flow. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Lattice Boltzmann Methods: From Kinetics to Magnetohydrodynamics

# Short: Lattice Boltzmann MHD — Electromagnetic Fluid

**Feeds full video:** Lattice Boltzmann Methods: From Kinetics to Magnetohydrodynamics

## Visual Hook (First 3 Seconds)
A conducting fluid channel (silver-blue, 256×128 lattice) carries current in a strong magnetic field (field lines shown as glowing red horizontal stripes, B = 1.5 T). Hartmann layers (dark-border thin bands at top and bottom walls) are visible. The fluid in the centre is nearly stagnant. "Ha = 50. Magnetic braking in action."

## Main Visual Sequence (0:03–0:50)
- **0:03** — LBM basics: D2Q9 lattice shown (9 velocity directions, c_i arrows at each node). Distribution functions f_i (coloured bars at each node) stream to neighbours. "Each node: 9 values — that's it."
- **0:10** — LBM-MHD scheme: two sets of distribution functions: f_i for fluid (cyan) and g_i for magnetic field (gold). Fluid: collide with BGK; magnetic: collide with a separate relaxation. Coupled via Lorentz body force F = J×B.
- **0:18** — Hartmann flow: velocity profile shown at y-axis. Hartmann number Ha = BL√(σ/ρν) = 50. Profile: flat in bulk (u_bulk = 0.15 m/s, white), steep gradient at walls (Hartmann layer thickness δ = L/Ha = 0.002 m, highlighted in red). "Ha = 50: 50× thinner boundary layer than without B."
- **0:27** — Magnetic field distortion: initially uniform horizontal B (gold arrows, →). As fluid flows, magnetic field lines bend (cyan arrows show new B direction — curved by fluid velocity). "Field lines are frozen into ideal MHD flow."
- **0:35** — Alfvén velocity: v_A = B/√(μ₀ρ) = 1.5/√(4π×10⁻⁷ × 6,000) = 5.5 m/s. Alfvén wave propagation shown as oscillating stripe moving at 5.5 m/s through the domain. Wavefront lit in pulsing cyan.
- **0:43** — Comparison: LBM-MHD (cyan velocity profile) vs analytical Hartmann solution (gold dashed). Error: 0.4% at Ha = 50. "LBM recovers analytical MHD to sub-percent accuracy."

## Physics Concept Teased
The Lattice Boltzmann Method for MHD uses two sets of kinetic distribution functions — one for the velocity field and one for the magnetic field — evolving each through a BGK collision step and streaming, with the Lorentz force coupling them, recovering the full resistive MHD equations in the hydrodynamic limit while remaining fully local and parallelisable.

## On-Screen Text / Captions
- **0:00** — "Ha = 50. The magnet wins." (white, top)
- **0:03** — "D2Q9: 9 velocities per node — fully local" (white, lower)
- **0:18** — "Hartmann layer: δ = L/Ha = 2 mm" (red, annotation)
- **0:27** — "Field lines freeze into the flow — ideal MHD" (gold, lower)
- **0:35** — "Alfvén wave: 5.5 m/s" (cyan, wave annotation)
- **0:43** — "LBM vs analytic: 0.4% error" (white, bottom)

## End Card
Final 3 seconds: the Hartmann flow profile settles and glows. "CODED LAWS" in silver-blue. Subscribe. "Next: Adaptive Wavelet Collocation →" teaser.

## Audio
Electromagnetic hum matching B-field frequency; digital lattice "click" for streaming step; Alfvén wave tone (5.5 Hz mapped up). 80 BPM electronic. No voiceover.

## Production Notes
LBM-MHD code: custom Python/CuPy on GPU. Scheme: Dellar (2002) two-distribution LBM-MHD. Grid: D2Q9 for velocity, D2Q5 for magnetic. Lattice: 256×128, periodic left-right, no-slip top-bottom. Fluid: ρ = 6,000 kg/m³ (mercury), σ = 10⁶ S/m, ν = 10⁻⁷ m²/s. B₀ = 1.5 T. Ha = 50. τ_f = 0.508, τ_B = 0.502. GPU: RTX 4090, 10⁶ steps in 45 s.
