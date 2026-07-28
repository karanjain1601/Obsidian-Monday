---
title: "Pseudo-Spectral Turbulence: Energy Spectrum"
id: SA011
type: youtube-short
duration: "~45 seconds"
feeds_video: "Spectral Methods: Fourier Transforms in Fluid Simulation"
difficulty: advanced
tags: [physics, simulation, short, advanced, pseudo-spectral, turbulence, fourier, energy-spectrum, cfd]
---

> **What it is:** A ~45-second simulation of 2D turbulence on a pseudo-spectral solver showing the inverse energy cascade and the kinetic energy spectrum converging to E(k) ~ k^(-5/3) Kolmogorov scaling. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Spectral Methods: Fourier Transforms in Fluid Simulation

# Short: Pseudo-Spectral Turbulence — Energy Spectrum

**Feeds full video:** Spectral Methods: Fourier Transforms in Fluid Simulation

## Visual Hook (First 3 Seconds)
A turbulent velocity field (rainbow colour map, 256² grid slice) fills the screen. Suddenly it transforms — a 2D FFT sweeps across in a blue-white wave and the field becomes a glowing Fourier spectrum, bright at the centre (low k) dimming outward (high k). Text: "Fourier space turbulence".

## Main Visual Sequence (0:03–0:50)
- **0:03** — Physical space (u-velocity, blue=−2 → red=+2 m/s) shown at left; wavenumber space (|û_k|², log scale, white=10⁻² → gold=10³) at right. Arrow connecting them labelled "FFT".
- **0:10** — Energy spectrum E(k) plot: log-log axes. Wavenumbers k = 1 to 512. Dashed purple line: k^(−5/3). White circles: measured E(k) from simulation. "Inertial range k = 10–100" annotated in green.
- **0:18** — Aliasing error demo: dealiased (2/3 rule, smooth spectrum, blue) vs aliased (red spikes at high k). "3/2 dealiasing removes aliasing" caption.
- **0:27** — Time-stepping in spectral space: each wavenumber evolves independently. A single k-mode (gold sine wave) rotates in complex plane at its own frequency ω_k. Integrating factor exp(νk²t) shown removing diffusion implicitly.
- **0:35** — Accuracy comparison: Finite Difference 6th-order (red, dispersion error at k > 200) vs Pseudo-Spectral (blue, exact to machine precision across all k). Table: FD6 error 0.8%, PS error 10⁻¹⁴%.
- **0:43** — Scaling: plot of FLOPS vs N for FD (N log N quadratic band) and PS (N log N line, 100× faster per point). "Exponential convergence" text in gold.

## Physics Concept Teased
Pseudo-spectral methods solve the Navier-Stokes equations in Fourier wavenumber space, where spatial derivatives become simple multiplications by ik, achieving spectral (exponential) accuracy per degree of freedom — then transform back to physical space for nonlinear terms, dealiased by the 3/2-rule to remove Fourier mode coupling errors.

## On-Screen Text / Captions
- **0:00** — "Turbulence lives in Fourier space." (white, top)
- **0:10** — "k^(−5/3) inertial range: k = 10–100" (green, graph label)
- **0:18** — "Aliasing breaks the spectrum" (red, annotation) / "3/2 rule fixes it" (blue)
- **0:27** — "Each mode evolves independently in k-space" (white, bottom bar)
- **0:35** — "Pseudo-spectral error: 10⁻¹⁴%" (blue, table cell)
- **0:43** — "Spectral accuracy at FFT cost" (gold, bottom)

## End Card
Final 3 seconds: the turbulent spectrum fades into concentric rings. "CODED LAWS" in spectral rainbow. Subscribe button. "Next: Vortex Filament →" teaser.

## Audio
Electronic synth arpeggio matching k-mode frequencies (higher k = higher pitch); FFT whoosh at 0:00; soft harmonic chord when spectrum forms. 90 BPM. No voiceover.

## Production Notes
Pseudo-spectral Navier-Stokes solver in Python/NumPy using numpy.fft.fftn. Grid: 512² periodic domain. Time integration: 4th-order Runge-Kutta with integrating factor. Dealiasing: 2/3 zero-padding. Visualization: matplotlib with log-log axes. Simulation time: 10 s physical, 2 min wallclock.
