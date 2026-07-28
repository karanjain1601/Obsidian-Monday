---
title: "Density Functional Theory: Electron Density Ground State"
id: SA020
type: youtube-short
duration: "~45 seconds"
feeds_video: "DFT Explained: From the Hohenberg-Kohn Theorem to Kohn-Sham Equations"
difficulty: advanced
tags: [physics, simulation, short, advanced, dft, density-functional-theory, quantum-chemistry, kohn-sham, electrons]
---

> **What it is:** A ~45-second simulation of a Kohn-Sham DFT self-consistent field loop converging the electron density of a water molecule toward its ground state via iterative diagonalization and exchange-correlation updates. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** DFT Explained: From the Hohenberg-Kohn Theorem to Kohn-Sham Equations

# Short: Density Functional Theory — Electron Density Ground State

**Feeds full video:** DFT Explained: From the Hohenberg-Kohn Theorem to Kohn-Sham Equations

## Visual Hook (First 3 Seconds)
A benzene molecule (6 gold carbon nuclei, 6 white hydrogen) sits on a dark background. Electron density ρ(r) materialises as a glowing cyan isosurface (ρ = 0.01 e/Å³) that wraps all 6 carbons in a unified delocalised ring. Text: "42 electrons. One density. Zero wavefunctions."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Hohenberg-Kohn theorem I: the external potential V_ext is uniquely determined by ρ(r). Shown as: density map (cyan) → uniquely maps to nuclear positions (gold spheres). "ρ determines everything" in white.
- **0:10** — Kohn-Sham equations: [−½∇² + V_eff[ρ]]φᵢ = εᵢφᵢ. Each term labelled: kinetic (white), Hartree potential V_H (blue), exchange-correlation V_xc (red, LDA/GGA). N = 21 occupied orbitals listed.
- **0:18** — SCF cycle animation: loop graphic (circular arrow). Step 1: guess ρ₀ (white blob). Step 2: compute V_eff (blue). Step 3: solve KS equations → get new φᵢ (green orbitals). Step 4: mix → new ρ. Convergence: |ρ_new − ρ_old| = 10⁻⁶ e/Å³ after 24 cycles.
- **0:27** — Orbital visualisation: 6 π-orbitals of benzene shown as isosurfaces (HOMO, LUMO etc.). HOMO (gold, ε = −5.1 eV), LUMO (blue, ε = −1.2 eV). HOMO-LUMO gap = 3.9 eV labelled in white.
- **0:35** — XC functional comparison: LDA (blue) vs PBE-GGA (gold) vs hybrid B3LYP (red). Bond length C-C: LDA 1.38 Å, PBE 1.397 Å, B3LYP 1.394 Å, experiment 1.396 Å. Table shown with error bars.
- **0:43** — Kohn-Sham energy components: E_kin (blue, 230 eV), E_Hartree (gold, 420 eV), E_xc (red, −87 eV), E_ion (purple, −580 eV), E_total (white, −983 eV). Stacked bar chart.

## Physics Concept Teased
Density Functional Theory replaces the intractable 3N-dimensional many-body wavefunction with the 3-dimensional electron density ρ(r) as the fundamental variable, solving N independent Kohn-Sham single-particle equations self-consistently to find the exact ground-state density and energy (in principle) with exchange-correlation as the only approximation.

## On-Screen Text / Captions
- **0:00** — "42 electrons. One density. One functional." (white, top)
- **0:10** — "V_xc[ρ] — the only approximation" (red, equation label)
- **0:18** — "SCF converges in 24 cycles" (white, loop counter)
- **0:27** — "HOMO-LUMO gap = 3.9 eV" (white, label)
- **0:35** — "B3LYP: 0.002 Å from experiment" (red, table annotation)
- **0:43** — "Total energy: −983 eV for benzene" (white, bottom)

## End Card
Final 3 seconds: the benzene electron density glows and rotates. "CODED LAWS" in gold. Subscribe. "Next: Lattice QCD →" teaser.

## Audio
Clean sine wave tones mapping to orbital energies; soft click for each SCF step; resolved major chord at convergence. 80 BPM minimal electronic. No voiceover.

## Production Notes
DFT code: GPAW (grid-based PAW). Basis: real-space grid, grid spacing 0.2 Å. XC functional: PBE-GGA. Geometry: benzene optimised at PBE level (C-C 1.397 Å, C-H 1.087 Å). SCF: 24 iterations, convergence 10⁻⁶ eV. Visualization: VESTA for density isosurfaces. System: 42 electrons, 21 occupied KS orbitals.
