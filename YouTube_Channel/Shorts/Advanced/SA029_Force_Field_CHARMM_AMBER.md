---
title: "Force Field Design: CHARMM vs AMBER Energy Landscape"
id: SA029
type: youtube-short
duration: "~45 seconds"
feeds_video: "Molecular Force Fields: How CHARMM and AMBER Model Molecules"
difficulty: advanced
tags: [physics, simulation, short, advanced, charmm, amber, force-field, molecular-mechanics, protein]
---

> **What it is:** A ~45-second simulation comparing CHARMM36 and AMBER99SB-ILDN torsion energy surfaces for a peptide backbone dihedral scan, highlighting how force field choice affects sampled conformations. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Molecular Force Fields: How CHARMM and AMBER Model Molecules

# Short: Force Field Design — CHARMM vs AMBER Energy Landscape

**Feeds full video:** Molecular Force Fields: How CHARMM and AMBER Model Molecules

## Visual Hook (First 3 Seconds)
The alanine dipeptide (shown in ball-and-stick, grey carbon, blue nitrogen, red oxygen, white hydrogen) rotates slowly. Below it, a 2D Ramachandran plot (φ vs ψ, −180° to +180°) fills with colour: CHARMM36 energy landscape (blue wells, red barriers) vs AMBER ff19SB (subtly different — shifted minima). "Same molecule. Different physics. 0.8 Å RMSD."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Force field potential: U = Σ_bonds k_b(r−r₀)² + Σ_angles k_θ(θ−θ₀)² + Σ_dihedrals V_n[1+cos(nφ−δ)] + Σ_LJ [ε((r_m/r)¹² − 2(r_m/r)⁶)] + Σ_electrostatics q_iq_j/εr. Each term colour-coded (bonds: gold, angles: cyan, dihedrals: magenta, LJ: green, elec: red).
- **0:10** — Alanine dipeptide Ramachandran map: CHARMM36 (left panel) shows α-helix basin at (−57°, −47°) and β-sheet basin at (−135°, 135°). Basin depth: α = −3.2 kcal/mol. AMBER ff19SB (right panel): α basin at (−62°, −43°), depth −2.9 kcal/mol. "Subtle but consequential."
- **0:18** — Dihedral term critical: V(φ) for C-N-Cα-C dihedral (backbone ψ) shown for CHARMM (blue curve, 3 Fourier terms) vs AMBER (gold curve, slightly different amplitude at 2ψ). This one term shifts the α-helix preference by 0.3 kcal/mol.
- **0:27** — Protein folding impact: alanine-10 helix (10 residues). CHARMM36: stable α-helix at 310 K (RMSD from NMR = 0.6 Å). AMBER ff14SB: partial unfolding at 310 K (RMSD = 1.4 Å). "Wrong dihedral → wrong fold."
- **0:35** — Electrostatics parameterisation: partial charges on backbone atoms shown as coloured spheres (blue = positive, red = negative). CHARMM36 N-H charge: +0.36 e. AMBER: +0.41 e. "5% difference → measurable Kd change."
- **0:43** — Benchmark table: protein-ligand binding ΔG for 20 small molecules. CHARMM36 MAE = 0.8 kcal/mol. AMBER ff19SB MAE = 0.7 kcal/mol. GAFF2 for ligands MAE = 1.1 kcal/mol. "No force field wins all benchmarks."

## Physics Concept Teased
Molecular mechanics force fields approximate the quantum mechanical potential energy surface with classical functional forms — bond, angle, dihedral, Lennard-Jones, and electrostatic terms — whose parameters are painstakingly fitted to QM data and experiment, with small differences in dihedral barriers causing measurable changes in protein secondary structure and binding affinity.

## On-Screen Text / Captions
- **0:00** — "Same molecule. Two force fields. Different worlds." (white, top)
- **0:10** — "α-helix basin: −3.2 vs −2.9 kcal/mol" (white, side labels)
- **0:18** — "One dihedral term — 0.3 kcal/mol shift" (magenta, annotation)
- **0:27** — "RMSD: 0.6 Å vs 1.4 Å — same simulation" (white, bottom bar)
- **0:35** — "Partial charges: +0.36 e vs +0.41 e" (blue/red, annotation)
- **0:43** — "No force field wins all benchmarks" (white, bottom)

## End Card
Final 3 seconds: the Ramachandran map glows in a full rainbow. "CODED LAWS" in white. Subscribe. "Next: ReaxFF Bond Breaking →" teaser.

## Audio
Soft molecular vibration hum; comparison "ping" when switching between force fields; error bar "whomp" on benchmark table. 80 BPM minimal. No voiceover.

## Production Notes
MD code: GROMACS 2023. System: alanine dipeptide (Ac-Ala-NMe) in explicit TIP3P water (1,000 waters). Simulation: 100 ns NVT at 300 K for each FF. Ramachandran maps: 2D histogram of (φ,ψ) with 2° bins. Dihedral energy: CMAP correction for CHARMM36. Binding benchmark: FEP (free energy perturbation) on Wang et al. 2017 dataset. Visualization: PyMOL + matplotlib.
