---
title: "Love Wave — Surface Wave Dispersion"
id: SM093
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, seismology, love-wave, surface-wave, dispersion, seismic-wave]
---

> **What it is:** A ~45-second simulation short where an earthquake excites purely horizontal surface shear motion that disperses into a wave train because long-wavelength low frequencies sample fast deep crust while high frequencies are confined to the slow surface layer, illustrating how inverting the Love wave dispersion curve maps Earth's crustal velocity structure. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Love Wave — Surface Wave Dispersion

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 3D cross-section of the earth's surface. An earthquake strikes. At the surface, particles move sideways (horizontal shear) — the Love wave propagates along the surface, its amplitude decaying with depth. A dispersion diagram shows that different frequencies travel at different speeds.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Love wave characteristics: a surface wave with purely horizontal (SH) particle motion, perpendicular to the wave propagation direction. It only exists when there is a low-velocity layer over a high-velocity half-space. Caption: "Love wave: SH particle motion; needs velocity layering." Particle motion arrows in a side-view panel.

**0:10–0:18** — Dispersion: the Love wave phase velocity c(ω) varies with frequency. Low frequencies (long wavelengths) sample deep, fast layers — they travel faster. High frequencies (short wavelengths) sample only the shallow, slow layer — they travel slower. Caption: "Dispersion: c depends on frequency — different wavelengths feel different depths."

**0:18–0:27** — Dispersion curve: c vs ω (or period T) plotted. The curve falls from V₂ (deep velocity) at low ω to V₁ (surface velocity) at high ω. The boundary conditions (vanishing at depth, continuity at interface) give a transcendental equation: tan(γ₁h) = μ₂γ₂/(μ₁γ₁). Caption: "Dispersion relation: tan(γ₁h) = μ₂γ₂/(μ₁γ₁)."

**0:27–0:36** — Group velocity vs phase velocity: a seismogram at distance r shows the Love wave arrives as a dispersed wave train — high frequencies arrive first (lower group velocity = the wave packet travels slowly) or last depending on the dispersion type. The Airy phase (minimum in group velocity) arrives last as a strong narrow-band signal. Caption: "Airy phase: minimum group velocity → late, strong arrival."

**0:36–0:45** — Application: measuring the Love wave dispersion curve from seismograms allows inversion for the velocity structure of the crust. Caption: "Seismologists use Love wave dispersion to map Earth's crust." Bold text: "Love waves — earthquake surface waves that decode the crust." Fade to black.

## Physics Concept Teased
Love wave: a surface seismic wave with purely horizontal (SH) particle motion that propagates only when a slower surface layer overlies a faster half-space. It exhibits geometric dispersion — different frequencies travel at different speeds, sampling different depths. Inverting the dispersion curve gives the crustal shear-velocity structure.

## On-Screen Text / Captions
- **0:00** — "Love wave: sideways surface shaking."
- **0:05** — "Only exists with velocity layering"
- **0:12** — "Dispersion: low f travels at V₂ (deep); high f at V₁ (surface)"
- **0:20** — "tan(γ₁h) = μ₂γ₂/(μ₁γ₁) — the dispersion equation"
- **0:28** — "Airy phase: minimum group velocity — arrives last"
- **0:35** — "Invert dispersion → map the crust"
- **0:43** — "Love waves — decoding Earth's crust."

## End Card
Final 3 seconds: Love wave dispersion curve — phase and group velocity vs frequency. Text: "Love wave dispersion maps the continent-ocean boundary at depth — invisible any other way." CodedLaws logo.

## Audio
Low, rolling seismic rumble. Voiceover at 0:00: "Love waves are surface seismic waves that only exist because of Earth's layered crust — and their dispersion maps that layering." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D (2D SH elastic wave). Key algorithm: 2D SH elastic wave finite difference: ρ ü = ∂(μ ∂u/∂x)/∂x + ∂(μ ∂u/∂z)/∂z. Two layers: μ₁, ρ₁ (surface, depth z < h) and μ₂, ρ₂ (below). SH source at surface. Love wave naturally forms as the surface wave component. For dispersion analysis: run simulations for multiple frequencies, measure phase velocity at each. Dispersion curve: solve transcendental equation numerically for c(ω). Group velocity: dω/dk computed from c(ω) relationship. Display seismograms as wavetrains at multiple stations. Runtime: 2D SH wave FD pre-rendered; dispersion curve real-time analytical.
