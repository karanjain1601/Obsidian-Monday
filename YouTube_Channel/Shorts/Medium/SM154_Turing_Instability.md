---
title: "Turing Instability — Linear Stability Analysis Visualization"
id: SM154
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, reaction-diffusion, turing-instability, pattern-formation, linear-stability]
---

> **What it is:** A ~45-second simulation short where a single spatial mode grows in real time from a flat chemical concentration while the dispersion relation σ(k) curve identifies the fastest-growing wavenumber that predicts the final Turing pattern wavelength, demonstrating how a faster-diffusing inhibitor counterintuitively destabilises a homogeneous state to produce biological patterns. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Turing Instability — Linear Stability Analysis Visualization

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A uniform chemical concentration — perfectly flat. Then one spatial mode (a single sinusoidal ripple) grows, visualised in real time. The growth rate is shown as a curve on a dispersion relation plot: the wavenumber k that grows fastest determines the wavelength of the final Turing pattern. Pure linear analysis reveals the birth of pattern.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Turing 1952: Alan Turing showed that a stable homogeneous state can be destabilised by diffusion (diffusion-driven instability). Counterintuitive: diffusion usually stabilises. The key: the inhibitor diffuses faster than the activator. Caption: "Turing instability: D_inhibitor >> D_activator → pattern forms." Without diffusion: stable. With diffusion: unstable at specific wavenumbers.

**0:10–0:18** — Dispersion relation: linearise the reaction-diffusion equations around the homogeneous steady state. Perturbation ~ e^(σt + ikx). The growth rate σ(k) is a function of wavenumber k. The Turing instability: σ(k) > 0 for some band of k values (not k=0). Caption: "σ(k): growth rate vs wavenumber — Turing band where σ > 0." Show σ(k) curve with positive dome.

**0:18–0:27** — The fastest-growing mode k* (where σ is maximum) determines the pattern wavelength λ* = 2π/k*. Caption: "k*: fastest-growing mode → pattern wavelength λ* = 2π/k*." Show multiple runs with different parameters: wider σ(k) dome → coarser pattern; narrow dome → regular stripes. Direct link between parameters and pattern wavelength.

**0:27–0:36** — Parameter space: (a, b) parameter plane (activator production rate, inhibitor production rate). Show the Turing instability region (where σ(k*)>0) vs the non-Turing region. Inside the Turing region: patterns form. Outside: uniform. The boundary is a curve in parameter space. Caption: "Parameter space: Turing region boundary — enter it for patterns."

**0:36–0:45** — Real patterns: the dispersion relation analysis predicts (1) stripe vs spot vs labyrinth depending on nonlinear saturation. (2) Pattern wavelength matches prediction. (3) Application to animal coat patterns (jaguar, zebrafish stripes). Caption: "Zebrafish stripes: match Turing predictions — verified 2012." Bold text: "Turing instability — linear analysis predicts nature's patterns." Fade to black.

## Physics Concept Teased
Turing instability (diffusion-driven instability): a reaction-diffusion system with a fast-diffusing inhibitor and a slow-diffusing activator has a homogeneous steady state that is stable in the absence of diffusion but unstable to spatial perturbations when diffusion is added. The growth rate σ(k) is positive for a band of wavenumbers — the fastest-growing mode k* determines the pattern wavelength.

## On-Screen Text / Captions
- **0:00** — "Diffusion causes patterns — Turing's paradox."
- **0:05** — "D_inhibitor >> D_activator → diffusion-driven instability"
- **0:12** — "σ(k) = growth rate vs wavenumber — Turing band"
- **0:20** — "k*: fastest mode → λ* = 2π/k* — pattern wavelength"
- **0:28** — "Turing region: boundary in (a,b) parameter space"
- **0:35** — "Zebrafish stripes: match Turing prediction — 2012"
- **0:43** — "Turing instability — linear analysis explains patterns."

## End Card
Final 3 seconds: side-by-side: the σ(k) dispersion curve (left) and the resulting Turing pattern (right). Text: "Alan Turing published his pattern-formation paper in 1952, two years before his death — it was his last major scientific contribution." CodedLaws logo.

## Audio
Scientific-sounding music (mathematical). Voiceover at 0:00: "Alan Turing showed in 1952 that diffusion — which normally erases differences — can in the right circumstances create spatial patterns from nothing." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D (dispersion relation plot + 1D/2D simulation). Key algorithm: Gierer-Meinhardt or Gray-Scott. Linearise: compute Jacobian J at (u₀, v₀) steady state. Dispersion relation: σ(k) = (1/2)[(J₁₁-D_u·k² + J₂₂-D_v·k²) ± √((J₁₁-D_u·k² - J₂₂+D_v·k²)² + 4J₁₂J₂₁)]. Plot σ_max(k) vs k. Find k* (argmax) and λ* = 2π/k*. Validate with direct PDE simulation: start from homogeneous state + tiny noise; measure dominant wavenumber in FFT — should match k*. Runtime: real-time Canvas 2D for 1D; Canvas 2D WebGL for 2D.
