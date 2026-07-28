---
title: "Lattice Boltzmann Fluid Flow Visualisation"
id: SM041
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, lattice-boltzmann, CFD, flow-visualization]
---

> **What it is:** A ~45-second simulation short where electric-blue streamlines spiral around obstacles on a GPU lattice, generating a real-time Kármán vortex street via the Lattice Boltzmann Method's stream-and-collide rules. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Lattice Boltzmann Fluid Flow Visualisation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Striking visualisation: a black canvas with flowing streamlines in electric blue, moving through a complex domain with obstacles. The streamlines spiral around a cylinder, creating a Kármán vortex street in real time. Every pixel is computing fluid dynamics simultaneously.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — LBM explained: instead of solving Navier-Stokes directly, LBM tracks the distribution function f_i(x,t) — the probability of finding a fluid particle moving in direction i at position x. Nine directions (D2Q9 model) shown as arrows from a grid node. Caption: "D2Q9: 9 velocity directions per cell."

**0:10–0:18** — Two steps shown: (1) Streaming: particles move to adjacent cells in their direction. (2) Collision: f_i relaxes toward the local equilibrium f_i^{eq} (BGK approximation: f_i → f_i + (f_i^{eq} - f_i)/τ). Caption: "Stream → Collide → Repeat." The macroscopic density and velocity recovered: ρ = Σf_i, u = Σf_i e_i / ρ.

**0:18–0:27** — The visualisation: vorticity field shown with curl-based colour-map (blue = counter-clockwise, red = clockwise). The Kármán vortex street behind the cylinder pulses rhythmically. Reynolds number shown: Re = 100. The street shedding is perfect and periodic.

**0:27–0:36** — Different obstacle geometries: rectangle (creates blunt wake), airfoil at angle of attack (creates asymmetric wake, lift visible as upward deflection of streamlines), letter "C" cut-out. Each substituted in real-time — the simulation updates immediately. Caption: "Any obstacle geometry — just change the boundary cells."

**0:36–0:45** — Speed comparison: LBM vs. traditional CFD (SIMPLE algorithm) solving the same flow. LBM updates are local (only neighbour communication) → ideal for GPU parallelism. Text: "LBM: GPU massively parallel — 10× faster than traditional CFD." Fade to black.

## Physics Concept Teased
Lattice Boltzmann Method (LBM): a mesoscopic fluid simulation where the distribution function of particle velocities is evolved on a lattice. Streaming (advection) and collision (BGK relaxation to equilibrium) alternate. Macroscopic Navier-Stokes behaviour emerges from the local collision rules — with viscosity set by the relaxation time τ.

## On-Screen Text / Captions
- **0:00** — "Every cell computing fluid physics simultaneously."
- **0:05** — "D2Q9: 9 velocity directions per lattice site"
- **0:12** — "Stream → Collide → Navier-Stokes emerges"
- **0:20** — "Vorticity: Re = 100 Kármán street"
- **0:28** — "Any obstacle — just mark cells as solid"
- **0:35** — "LBM: massively GPU parallel"
- **0:43** — "Lattice Boltzmann — CFD reimagined."

## End Card
Final 3 seconds: the full vorticity field, vivid blue-red swirls, slowly rotating. Text: "LBM runs in real-time in your browser via WebGL." CodedLaws logo. CTA: "Interactive demo — link in bio."

## Audio
Rhythmic, machine-like electronic (90 BPM). Each stream-collide cycle = faint tick (very fast, becomes white noise). Voiceover at 0:00: "Forget solving differential equations — LBM bounces particles on a grid and Navier-Stokes emerges automatically." No other voiceover.

## Production Notes
Code complexity: moderate (well-documented algorithm). Renderer: WebGL compute shader (fragment shader for LBM). Key algorithm: D2Q9 BGK-LBM. f_i arrays stored as WebGL textures (9 textures or packed into RGB). Stream: texture lookup from neighbour cells. Collide: compute ρ, u from f_i; compute f_i^eq = w_i ρ(1 + 3(e_i·u) + 4.5(e_i·u)² - 1.5u²); f_i → f_i + (f_i^eq - f_i)/τ. Bounce-back for solid cells. Visualise: compute ρ and u from f_i, display vorticity (curl of u) as colour. Grid: 512×256 runs at 60fps on modern GPU. Runtime: real-time WebGL.
