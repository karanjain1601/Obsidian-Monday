---
title: "Coarse-Grained MD: MARTINI Lipid Bilayer"
id: SA028
type: youtube-short
duration: "~45 seconds"
feeds_video: "Membrane Biophysics: MARTINI Force Field and Lipid Bilayers"
difficulty: advanced
tags: [physics, simulation, short, advanced, martini, coarse-grained, lipid, bilayer, membrane, molecular-dynamics]
---

> **What it is:** A ~45-second simulation of a MARTINI force-field coarse-grained lipid bilayer self-assembling from a random mixture and exhibiting lateral diffusion and membrane undulation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Membrane Biophysics: MARTINI Force Field and Lipid Bilayers

# Short: Coarse-Grained MD — MARTINI Lipid Bilayer

**Feeds full video:** Membrane Biophysics: MARTINI Force Field and Lipid Bilayers

## Visual Hook (First 3 Seconds)
A DPPC lipid bilayer (128 lipids per leaflet, 256 total) fills the frame. Phosphate head groups glow cyan, acyl tail beads glow gold. The membrane ripples like a sheet in a breeze, with thermal undulations of ±0.8 nm amplitude. Text: "4 atoms → 1 bead. 256 lipids. 1 μs."

## Main Visual Sequence (0:03–0:50)
- **0:03** — MARTINI mapping: all-atom DPPC shown (grey bonds, all hydrogens). Then beads materialise: 4 atoms per bead, 12 beads per lipid (4 head beads cyan, 8 tail beads gold). "4:1 mapping → 4× fewer particles, 1,000× longer timescales" caption.
- **0:10** — Bead type table: Q (charged, cyan), N (neutral, teal), C (nonpolar, gold), P (polar, white). Interaction matrix shown (4×4): C-C interactions are very attractive (−2 kcal/mol), Q-C very repulsive (+3 kcal/mol). "Amphiphilic character encoded in bead types."
- **0:18** — Bilayer self-assembly: start from random dispersion (256 lipids + 3,000 water beads). At t = 50 ns: bilayer patch forms. At t = 200 ns: complete planar bilayer with full phase separation. Snapshots in 3 panels.
- **0:27** — Area per lipid A_L: time series plot (y-axis 0.50–0.75 nm²). Average A_L = 0.64 nm² (gold dashed line) after 100 ns equilibration. Experimental value 0.63 nm² (red dashed line). Error 1.5%. "Structural agreement within 2%."
- **0:35** — Lateral diffusion: mean-squared displacement (MSD) of head group beads vs time (log-log plot). Slope = 1 (diffusive) at t > 10 ns. D = 5.2 × 10⁻¹² m²/s from slope (MARTINI, gold) vs D_exp = 4.8 × 10⁻¹² m²/s (experiment, white). "Diffusion matches to 8%."
- **0:43** — Protein insertion: a transmembrane alpha-helix (pink cylinder, 20 residues) inserted into the bilayer. Hydrophobic residues (gold) buried in tail region; hydrophilic residues (cyan) at surface. Tilt angle 18° from bilayer normal shown.

## Physics Concept Teased
The MARTINI coarse-grained force field maps 4 heavy atoms onto a single interaction bead, drastically reducing degrees of freedom while encoding amphiphilic chemistry through a bead-type interaction matrix — enabling microsecond-scale simulation of lipid bilayer self-assembly, lateral diffusion, and membrane protein embedding at near-experimental accuracy.

## On-Screen Text / Captions
- **0:00** — "4 atoms = 1 bead. 1,000× faster." (white, top)
- **0:10** — "Bead type sets chemistry — no atoms needed" (white, lower)
- **0:18** — "Self-assembly in 200 ns" (white, time panel label)
- **0:27** — "A_L = 0.64 nm² — experiment: 0.63 nm²" (gold/red, plot annotation)
- **0:35** — "Lateral diffusion D = 5.2 × 10⁻¹² m²/s" (gold, MSD label)
- **0:43** — "Transmembrane helix tilts 18°" (white, bottom)

## End Card
Final 3 seconds: the bilayer ripples and the protein slowly rotates. "CODED LAWS" in teal. Subscribe. "Next: Force Field Design →" teaser.

## Audio
Soft water ambience; gentle membrane fluctuation whoosh; warm synth chord on protein insertion. 70 BPM calm ambient. No voiceover.

## Production Notes
Simulation: GROMACS 2023. Force field: MARTINI 2.2. Lipid: DPPC (12 beads/lipid). System: 256 DPPC + 3,000 W beads (each W = 4 real waters). Box: 9.5 × 9.5 × 7.0 nm. Time step Δt = 20 fs. Pressure: 1 bar (semi-isotropic Parrinello-Rahman). Temperature: 323 K (above gel-to-liquid transition T_m = 314 K for DPPC). Visualization: VMD + Tachyon.
