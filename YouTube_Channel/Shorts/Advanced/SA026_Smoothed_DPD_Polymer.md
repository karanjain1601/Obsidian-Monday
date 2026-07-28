---
title: "Smoothed DPD: Mesoscale Polymer Flow"
id: SA026
type: youtube-short
duration: "~45 seconds"
feeds_video: "Mesoscale Simulation: DPD and Coarse-Grained Polymer Dynamics"
difficulty: advanced
tags: [physics, simulation, short, advanced, dpd, mesoscale, polymer, fluid, coarse-grained]
---

> **What it is:** A ~45-second simulation of polymer chains in smoothed DPD mesoscale fluid showing chain coiling, stretching, and viscoelastic stress under shear flow. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Mesoscale Simulation: DPD and Coarse-Grained Polymer Dynamics

# Short: Smoothed DPD — Mesoscale Polymer Flow

**Feeds full video:** Mesoscale Simulation: DPD and Coarse-Grained Polymer Dynamics

## Visual Hook (First 3 Seconds)
A nanoscale channel (50 nm wide, shown in dark grey) is filled with a teal polymer solution. A pressure gradient drives flow from left to right. The polymer chains (gold beaded strings) stretch and align in the flow, causing shear-thinning — viscosity drops from 12 mPa·s to 3 mPa·s. Text: "Non-Newtonian fluid. DPD solves it."

## Main Visual Sequence (0:03–0:50)
- **0:03** — DPD bead model: each DPD particle represents ~100 real atoms. Solvent beads (cyan, N = 5,000) and polymer chain beads (gold, 20 chains × 30 beads = 600) shown in a periodic box 50 nm × 50 nm × 10 nm.
- **0:10** — DPD force law: F_ij = F^C_ij (conservative, soft repulsion, red) + F^D_ij (dissipative, friction, blue) + F^R_ij (random thermal force, white). All three arrows shown at one pair. "Fluctuation-Dissipation theorem: F^R linked to F^D".
- **0:18** — Velocity profile: Poiseuille flow in channel. Newtonian solvent (blue parabola). Polymer solution (gold, flatter — plug flow at centre from shear thinning). "Plug flow index: n = 0.65" label.
- **0:27** — Polymer conformation: at rest — coiled chain (radius of gyration Rg = 4.2 nm, circle shown). Under shear γ̇ = 10⁶ s⁻¹ — stretched chain (Rg = 9.8 nm, elongated ellipse). Rg vs γ̇ plot (blue→red transition).
- **0:35** — SDPD (Smoothed DPD) improvement: SPH kernel W(r,h) overlaid on particles. SDPD enforces Navier-Stokes viscous dissipation consistently, not ad hoc. "SDPD: thermodynamically consistent" vs "DPD: approximate" comparison panel.
- **0:43** — Microchannel mixing: two streams (cyan + orange) injected in parallel. DPD simulates Brownian diffusion and convective mixing over 20 ns. Mixed (green) region forms downstream. "Péclet number Pe = 8.4" label.

## Physics Concept Teased
Smoothed DPD (SDPD) combines the particle-based flexibility of DPD with an SPH kernel to derive dissipative and random forces consistently from the Navier-Stokes viscous stress tensor, maintaining thermodynamic consistency and correctly capturing mesoscale hydrodynamics in polymer and biological fluid systems.

## On-Screen Text / Captions
- **0:00** — "100 atoms per bead. Mesoscale unlocked." (white, top)
- **0:10** — "F^R and F^D linked by FDT" (white, bottom bar)
- **0:18** — "Shear thinning: n = 0.65 power law" (gold, profile label)
- **0:27** — "Rg doubles under shear: 4.2 → 9.8 nm" (white, annotation)
- **0:35** — "SDPD: thermodynamically consistent" (cyan, panel title)
- **0:43** — "Pe = 8.4 — convection dominates mixing" (white, bottom)

## End Card
Final 3 seconds: polymer chains recoil to random coils as flow stops. "CODED LAWS" in teal. Subscribe. "Next: DPD Polymer in Solution →" teaser.

## Audio
Fluid sloshing ambience; soft "stretch" sound when polymer elongates; clicking transitions between panels. 85 BPM calm electronic. No voiceover.

## Production Notes
SDPD solver: LAMMPS with user-sdpd package. Box: 50×50×10 nm, periodic. DPD parameters: a = 25 kT, γ = 4.5 (√m/τ), σ = 3.0. Polymer: FENE chains, Ks = 30, R₀ = 1.5. Time step Δt = 0.01 τ. Temperature: kT = 1.0 (reduced units). Visualization: OVITO with custom bond rendering.
