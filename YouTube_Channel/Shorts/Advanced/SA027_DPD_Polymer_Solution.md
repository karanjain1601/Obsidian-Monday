---
title: "Dissipative Particle Dynamics: Polymer in Solution"
id: SA027
type: youtube-short
duration: "~45 seconds"
feeds_video: "Mesoscale Simulation: DPD and Coarse-Grained Polymer Dynamics"
difficulty: advanced
tags: [physics, simulation, short, advanced, dpd, polymer, solution, self-assembly, mesoscale]
---

> **What it is:** A ~45-second simulation of amphiphilic diblock copolymers in a DPD solvent self-assembling from a disordered melt into lamellar and micellar phases. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Mesoscale Simulation: DPD and Coarse-Grained Polymer Dynamics

# Short: Dissipative Particle Dynamics — Polymer in Solution

**Feeds full video:** Mesoscale Simulation: DPD and Coarse-Grained Polymer Dynamics

## Visual Hook (First 3 Seconds)
A diblock copolymer (half-chain gold = hydrophilic A-block, half-chain red = hydrophobic B-block) in a cyan water DPD solvent. Within 2 seconds of simulation time, 50 chains spontaneously self-assemble into a vesicle — a hollow spherical bilayer membrane, glowing gold outside and red inside. Text: "Self-assembly in 10 nanoseconds."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Initial state: 50 diblock chains (A₁₀B₁₀, 20 beads each) randomly dispersed in 4,000 solvent beads. Box 30 nm. All chains shown as gold-red sticks, solvent as transparent cyan dots.
- **0:10** — DPD conservative forces: A-A repulsion a_AA = 25; B-B repulsion a_BB = 25; A-B repulsion a_AB = 40 (larger = less compatible). "Soft repulsion drives phase separation" caption. Parameter matrix shown as 3×3 table.
- **0:18** — Time t = 5 ns: clusters form (5–10 chains each), B-blocks hiding inside (core red), A-blocks exposed to solvent (shell gold). "Micelle nucleation" label.
- **0:27** — Time t = 10 ns: vesicle fully formed. Cross-section slice shows bilayer: outer A-shell (gold, 3 nm thick), B-core (red, 2 nm), inner A-shell (gold, 3 nm), water-filled lumen (cyan, hollow). Diameter: 22 nm.
- **0:35** — Membrane properties: bending rigidity κ = 20 kT measured by fluctuation spectrum. Tension γ = 0 (tensionless vesicle). Permeability P = 10⁻⁷ cm/s for water. Table in white on dark background.
- **0:43** — Drug loading demo: 10 red "drug" beads (cyan) trapped inside vesicle lumen. Vesicle intact under osmotic pressure Δp = 1.2 kPa. "Controlled release: 40 ns half-life" label.

## Physics Concept Teased
DPD captures the hydrophobic effect through differential soft repulsion parameters between amphiphilic polymer blocks — the incompatibility between A and B blocks (a_AB >> a_AA) drives spontaneous self-assembly into morphologies (micelles, vesicles, cylinders) set purely by block ratio and concentration.

## On-Screen Text / Captions
- **0:00** — "10 nanoseconds. Spontaneous vesicle." (white, top)
- **0:10** — "a_AB = 40 — blocks are incompatible" (red, table cell)
- **0:18** — "t = 5 ns: micelle nucleation" (white, time label)
- **0:27** — "Vesicle: bilayer 8 nm thick, 22 nm diameter" (white, annotation)
- **0:35** — "Bending rigidity κ = 20 kT" (gold, lower)
- **0:43** — "Drug release half-life: 40 ns" (cyan, bottom)

## End Card
Final 3 seconds: the vesicle cross-section glows as it slowly rotates. "CODED LAWS" in gold and red. Subscribe. "Next: MARTINI Lipid Bilayer →" teaser.

## Audio
Soft water ambience; satisfying "pop" when vesicle closes; gentle synth swell at self-assembly. 75 BPM calm. No voiceover.

## Production Notes
DPD code: LAMMPS. Box: 30 nm periodic. 4,000 solvent beads + 50 chains × 20 beads. DPD cut-off r_c = 1 nm. γ = 4.5, σ = 3.0, kT = 1.0. Bonds: harmonic k = 4.0, r₀ = 0.7 nm. Time step Δt = 0.01 τ. Total: 10⁶ steps = 10 ns. Visualization: VMD with Tachyon renderer.
