---
title: "Ab Initio MD: Born-Oppenheimer Surface"
id: SA025
type: youtube-short
duration: "~45 seconds"
feeds_video: "Ab Initio Molecular Dynamics: Atoms on a Quantum Potential Surface"
difficulty: advanced
tags: [physics, simulation, short, advanced, aimd, born-oppenheimer, molecular-dynamics, dft, quantum-chemistry]
---

> **What it is:** A ~45-second simulation of Born-Oppenheimer AIMD where DFT forces are computed on-the-fly at each timestep, propagating atoms along the quantum potential energy surface in real time. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Ab Initio Molecular Dynamics: Atoms on a Quantum Potential Surface

# Short: Ab Initio Molecular Dynamics — Born-Oppenheimer Surface

**Feeds full video:** Ab Initio Molecular Dynamics: Atoms on a Quantum Potential Surface

## Visual Hook (First 3 Seconds)
A water molecule (red oxygen, white hydrogens) vibrates violently at 600 K on a glowing cyan potential energy surface (PES) — a 2D bowl with anharmonic shoulders shown as a 3D surface plot (gold ridges, blue valleys). Text: "DFT forces. Classical nuclei. Quantum electrons."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Born-Oppenheimer approximation: electrons (fast, cyan cloud) adjust instantaneously to nuclear positions (slow, gold spheres). "m_e/m_H = 1/1836 — electrons follow nuclei adiabatically" in white.
- **0:10** — AIMD loop: (1) Solve KS-DFT → get ρ(r) and E_KS (blue step); (2) compute forces F_I = −∂E_KS/∂R_I (gold arrows on nuclei); (3) integrate Newton: M_I Ṙ_I = F_I (white Verlet step); (4) update positions → back to step 1. Cycle shown as circular flow diagram.
- **0:18** — Water dimer proton transfer: H₂O-HOH cluster shown. At 400 K: proton stays on donor (left molecule). As simulation heats to 1000 K: proton hops from O-H bond to adjacent oxygen in 12 fs — O-H distance snaps from 1.0 Å to 1.8 Å (red → blue colour transition on bond).
- **0:27** — Force accuracy: AIMD forces (gold arrows) vs fitted force-field forces (blue arrows) shown on the same 10-atom cluster. AIMD captures charge transfer and polarisation; FF misses them (visibly wrong direction on 3 atoms).
- **0:35** — Velocity autocorrelation: C_vv(t) = 〈v(0)·v(t)〉 plotted (blue oscillating curve, 0–1 ps). Fourier transform gives vibrational spectrum: O-H stretch peak at 3400 cm⁻¹ (gold), H-O-H bend at 1600 cm⁻¹ (cyan). "IR spectrum from MD trajectories."
- **0:43** — Cost vs accuracy: AIMD (gold, error 0.3 kcal/mol, cost 10,000 DFT/ns) vs classical MD (blue, error 2.1 kcal/mol, cost 1 ns in seconds). "Accuracy costs — but it's exact quantum forces."

## Physics Concept Teased
Ab initio molecular dynamics places classical nuclei on a Born-Oppenheimer potential energy surface computed on-the-fly from Kohn-Sham DFT, so every nuclear step requires a full electronic structure calculation — giving quantum-accurate interatomic forces without any fitted parameters, at the cost of extreme computational expense.

## On-Screen Text / Captions
- **0:00** — "Quantum electrons. Classical nuclei. No fit." (white, top)
- **0:10** — "m_e/m_H = 1/1836 — Born-Oppenheimer holds" (white, lower)
- **0:18** — "Proton hops in 12 fs at 1000 K" (red, bond label)
- **0:27** — "Force fields get it wrong on 3 atoms" (white, annotation)
- **0:35** — "O-H stretch: 3400 cm⁻¹ from AIMD" (gold, spectrum label)
- **0:43** — "Exact forces. 10,000× more expensive." (white, bottom)

## End Card
Final 3 seconds: the potential energy surface glows and the water molecule settles. "CODED LAWS" in white. Subscribe. "Next: Smoothed DPD Polymer →" teaser.

## Audio
Water molecule vibrational tone (O-H stretch mapped to audible frequency); clicking of DFT cycles; resolved chord when proton hops. 80 BPM ambient. No voiceover.

## Production Notes
AIMD code: CP2K. Functional: BLYP + D3 dispersion. Basis: DZVP-MOLOPT for O/H. Pseudopotential: Goedecker-Teter-Hutter. Timestep: 0.5 fs. Thermostat: CSVR (canonical velocity rescaling) at 600 K. System: 64 water molecules in 12.4 Å box. Total MD: 50 ps (100,000 DFT evaluations). Force: 4 SCF cycles per step (energy tolerance 10⁻⁶ Ha).
