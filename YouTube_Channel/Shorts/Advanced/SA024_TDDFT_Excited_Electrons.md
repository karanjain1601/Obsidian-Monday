---
title: "TDDFT: Excited Electron Dynamics"
id: SA024
type: youtube-short
duration: "~45 seconds"
feeds_video: "Time-Dependent DFT: Electrons Under Laser Pulses"
difficulty: advanced
tags: [physics, simulation, short, advanced, tddft, time-dependent, dft, electron-dynamics, laser, absorption]
---

> **What it is:** A ~45-second simulation of TDDFT tracking real-time charge-density oscillations in a molecule driven by a short laser pulse, then computing the optical absorption spectrum from the Fourier transform. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Time-Dependent DFT: Electrons Under Laser Pulses

# Short: TDDFT — Excited Electron Dynamics

**Feeds full video:** Time-Dependent DFT: Electrons Under Laser Pulses

## Visual Hook (First 3 Seconds)
A hydrogen molecule (two gold spheres, bond length 0.74 Å) is hit by a laser pulse (depicted as a sinusoidal cyan wave at 400 nm, intensity 10¹³ W/cm²). The electron density (blue cloud) sloshes violently left-right, then ejects a small electron cloud that races away — ionisation at 0.8 fs. Text: "8 attoseconds per half-cycle. Electrons in real time."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Runge-Gross theorem statement: there is a one-to-one map from time-dependent density ρ(r,t) → external potential V_ext(r,t). "TDDFT: the Runge-Gross analogue of Hohenberg-Kohn" in white.
- **0:10** — TDKS equations: iℏ ∂φᵢ/∂t = [−½∇² + V_KS[ρ,t]]φᵢ. Laser field enters as V_laser = E(t)·r (gold). Adiabatic LDA: V_xc[ρ(t)] evaluated at instantaneous density. Shown as time-evolving cyan blob.
- **0:18** — Absorption spectrum: via Fourier transform of the dipole moment d(t). Spectrum shown: UV-vis plot (x-axis 5–25 eV, y-axis oscillator strength). Peaks at 11.2 eV (cyan spike, π→π*) and 14.8 eV (gold spike, σ→σ*) for benzene.
- **0:27** — High-harmonic generation: time-domain dipole acceleration a(t) (white oscillating curve). FFT reveals harmonics at 1ω, 3ω, 5ω, … 21ω (odd harmonics only, gold spikes on log-scale spectrum). "HHG: attosecond pulse generation" label.
- **0:35** — Electron density ρ(r,t) movie: at t = 0 (equilibrium, cyan symmetric blob); t = 0.4 fs (skewed rightward by laser, blue→red gradient); t = 0.8 fs (ionisation tail detaches as orange cloud). Three panels side by side.
- **0:43** — Memory effect: adiabatic LDA (red curve, poor ionisation threshold) vs exact XC with memory (gold curve, accurate threshold at I_p = 15.4 eV). "Memory matters for ionisation" caption.

## Physics Concept Teased
Time-Dependent DFT extends ground-state DFT to real-time electron dynamics by mapping the interacting many-electron problem onto time-dependent Kohn-Sham single-particle equations, where the exchange-correlation potential evaluated at the instantaneous density captures most quantum effects — enabling affordable simulation of laser-driven ionisation and optical spectra.

## On-Screen Text / Captions
- **0:00** — "8 attoseconds per half-cycle. Electrons live." (white, top)
- **0:10** — "Runge-Gross: ρ(t) determines everything" (white, lower)
- **0:18** — "Benzene absorbs at 11.2 eV and 14.8 eV" (cyan/gold, spectrum labels)
- **0:27** — "HHG: odd harmonics only" (gold, spectrum annotation)
- **0:35** — "Ionisation at 0.8 fs" (orange, time panel label)
- **0:43** — "Memory in XC: the unsolved problem" (gold, bottom)

## End Card
Final 3 seconds: the absorption spectrum glows as a rainbow of peaks. "CODED LAWS" in electric cyan. Subscribe. "Next: Ab Initio MD →" teaser.

## Audio
Laser pulse sfx (high-frequency chirp) at 0:00; oscillating tone for electron oscillation; harmonic overtone chord on HHG reveal. 95 BPM electronic. No voiceover.

## Production Notes
TDDFT code: OCTOPUS (real-space grid). Grid: 0.2 Å spacing, box radius 8 Å. Functional: adiabatic LDA (ALDA). Time propagation: enforced time-reversal symmetry (ETRS), Δt = 0.01 ℏ/eV. Benzene: 6C + 6H, DZP basis for initial gs, then TDDFT for dynamics. Laser: 400 nm, 10¹³ W/cm², 2-cycle sin² envelope.
