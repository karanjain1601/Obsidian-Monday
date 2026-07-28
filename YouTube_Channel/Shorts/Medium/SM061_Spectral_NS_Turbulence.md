---
title: "Spectral Navier-Stokes — Turbulence Energy Cascade"
id: SM061
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, turbulence, navier-stokes, spectral-method, energy-cascade, kolmogorov]
---

> **What it is:** A ~45-second simulation short where a 512×512 pseudospectral solver renders a living 2D turbulence field of swirling eddies at all scales, demonstrating the Kolmogorov energy cascade and the E(k) ∝ k^(-5/3) power law from the largest vortices down to the Kolmogorov microscale. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Spectral Navier-Stokes — Turbulence Energy Cascade

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 2D turbulence simulation in full glory — swirling eddies of all sizes, from huge domain-filling vortices to tiny wisps. The vorticity field is shown in a vivid red-blue colour-map. It looks alive, constantly churning.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Kolmogorov energy cascade: energy is injected at large scales (L = domain size). It cascades down through successively smaller eddies — each large eddy breaking into smaller ones. The Kolmogorov −5/3 power law: E(k) ∝ k^(-5/3). Log-log plot of energy spectrum shown with the −5/3 slope line. Caption: "E(k) ∝ k^(-5/3) — Kolmogorov 1941."

**0:10–0:18** — Spectral method: the velocity field is represented in Fourier space. The Navier-Stokes equations are solved in k-space — the pressure is trivially computed by projecting out the incompressible component. Pseudospectral dealias (2/3 rule) shown. Caption: "FFT → solve in k-space → IFFT." Grid: 512×512 modes.

**0:18–0:27** — 2D vs. 3D turbulence: in 2D, energy flows UPWARD (inverse cascade) from small to large eddies — forming coherent large vortices. In 3D, energy flows downward (direct cascade). Side-by-side: 2D shows growing large-scale vortex; 3D shows fine-scale structure forming. Caption: "2D: inverse cascade. 3D: direct cascade."

**0:27–0:36** — Intermittency: zoom into the turbulent field — regions of intense vorticity (red/blue) are sparse, surrounded by calm regions. This non-Gaussian distribution of velocity gradients is called intermittency. Caption: "Intermittency: vorticity is not uniformly distributed."

**0:36–0:45** — Scale separation bar: the inertial subrange (k^(-5/3)) between the large scale L and the Kolmogorov microscale η = (ν³/ε)^(1/4). As Reynolds number increases, this range widens. Bold text: "Turbulence — the greatest unsolved problem in classical physics." Fade to black.

## Physics Concept Teased
Turbulence energy cascade: turbulent kinetic energy is injected at the largest scales, cascades through successively smaller eddies in the inertial subrange (where the E(k) ∝ k^(-5/3) spectrum holds), and dissipates at the Kolmogorov microscale η. The spectral Navier-Stokes solver efficiently resolves all these scales simultaneously.

## On-Screen Text / Captions
- **0:00** — "512×512 turbulence — every scale resolved."
- **0:05** — "E(k) ∝ k^(-5/3) — Kolmogorov 1941"
- **0:12** — "Pseudospectral: solve NS in Fourier space"
- **0:20** — "2D: inverse cascade (large vortex grows)"
- **0:28** — "Intermittency: intense vorticity is sparse"
- **0:35** — "η = (ν³/ε)^(1/4) — Kolmogorov microscale"
- **0:43** — "Turbulence — unsolved for 150 years."

## End Card
Final 3 seconds: 512×512 turbulence vorticity field in vivid colour. Text: "The Navier-Stokes existence and smoothness problem is a Millennium Prize Problem — $1M unsolved." CodedLaws logo.

## Audio
Dynamic, swirling ambient (70 BPM). Sound of wind/turbulence that varies in intensity. Voiceover at 0:00: "Turbulence follows a universal energy spectrum — from the largest eddies down to the Kolmogorov microscale, the same power law appears everywhere." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: WebGL (2D turbulence). Key algorithm: 2D pseudospectral NS solver on periodic domain. Velocity stored in Fourier space. Each step: (1) compute nonlinear term u·∇u in physical space (IFFT, multiply, FFT); (2) dealias (2/3 rule: zero out top 1/3 of modes); (3) subtract pressure gradient (project to incompressible subspace in k-space); (4) integrate in time (4th-order Runge-Kutta). Energy injection: force the low-k modes. Dissipation: viscous term -νk²û. Vorticity: ω = ∇×u = ik×û in Fourier space → IFFT. Display vorticity as colour-map. Runtime: real-time in WebGL with WebGPU compute for 512×512.
