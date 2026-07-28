---
title: "Ferrofluid Spike Formation in Magnetic Field"
id: SM126
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Ferrohydrodynamics_Full]]"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, magnetism, ferrofluid, instability]
---

> **What it is:** A ~45-second simulation short where a mirror-flat pool of black ferrofluid erupts into a self-organized hexagonal forest of glistening spikes as a magnet approaches from below, demonstrating the Rosensweig normal-field instability threshold and the minimum-energy hexagonal pattern it produces. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Ferrohydrodynamics_Full]]

# Short: Ferrofluid Spike Formation in Magnetic Field
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A flat pool of black ferrofluid — mirror-smooth, jet dark — sits in a dish. A magnet approaches from below. The surface erupts: a forest of perfect hexagonally-arranged spikes rises from the fluid, each one sharp, glistening, alive. The spikes pulse slightly as the field strength holds. It looks like a sea urchin made of liquid.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Top-down view of the flat ferrofluid surface (perfect black mirror). Side view establishes the geometry: ferrofluid layer (5 mm thick) in a dish, magnet below. Background magnetic field B₀ shown as vertical field lines (white, uniform upward). Surface perfectly flat — stable at B < B_c.
- **0:10–0:18:** Field increases slowly. B approaches critical value B_c = √(2μ₀σ/M²) (Rosensweig critical field). Surface develops small undulations — random thermal fluctuations at 1–2 mm amplitude. Slight perturbations at the characteristic wavenumber k* = (ρg/σ)^{1/2} (capillary wavenumber). The surface tension and gravity compete against magnetic destabilization.
- **0:18–0:28:** B crosses B_c: the normal-field (Rosensweig) instability triggers. The most unstable mode grows exponentially. Spikes form with characteristic spacing λ* = 2π/k* ≈ 10–15 mm. The spikes grow rapidly — from 1 mm to 15 mm amplitude in 0.5 seconds (shown). Colors: spike tips appear lighter (near-surface field concentration), troughs darker.
- **0:28–0:38:** Hexagonal ordering: the spikes self-arrange into a nearly perfect hexagonal lattice (viewed from above — overhead drone-view shot). Each spike is a ferrofluid column — the magnetic field concentrates at the tip, creating a self-focusing effect. The hexagonal pattern has the same symmetry as a honeycomb. A fast Fourier transform of the top-down image shows the hexagonal reciprocal lattice as bright spots.
- **0:38–0:45:** Dynamic response: magnet suddenly removed (B → 0). The spikes collapse in 0.3 seconds — surface returns to flat. Re-apply magnet: spikes re-form immediately. Toggle several times. Then: tilt the magnet — spikes lean in the field direction. Ferrofluid follows the field lines everywhere.

## Physics Concept Teased
The Rosensweig (normal-field) instability occurs when the magnetic body force on a ferrofluid layer exceeds the stabilizing effects of surface tension and gravity. Above a critical field B_c, a flat surface becomes unstable to surface height perturbations at the capillary wavenumber. The hexagonal spike arrangement is the minimum-energy configuration of the resulting pattern. The spike height and spacing are controlled by the balance of magnetic stress, surface tension, and hydrostatic pressure.

## On-Screen Text / Captions
- **0:00:** "A magnetic field is asking the fluid a question. The spikes are the answer."
- **0:08:** "Below critical field: flat surface stable"
- **0:15:** "B > B_c: Rosensweig instability"
- **0:22:** "Most unstable wavelength: λ* = 2π/k_cap"
- **0:30:** "Hexagonal lattice — minimum energy arrangement"
- **0:38:** "Remove field: spikes vanish. Apply field: spikes return."
- **0:44:** "Ferrofluid was invented by NASA in 1963."

## End Card
Final 3 seconds: overhead view of the perfect hexagonal spike lattice — jet black with silvery tips — slowly pulsing. Text: "Physics makes the pattern. Every time. No instructions." Channel logo.

## Audio
Deep magnetic hum when the magnet approaches. Rising tone as the field increases past B_c. "Pop" sounds as each spike rapidly emerges (0:18 — staggered cluster of soft pops). Dramatic orchestral swell at full spike formation. Voiceover (awed whisper): "It always makes hexagons. The physics has no choice." Collapse at 0:38: reverse whoosh.

## Production Notes
Code complexity: complex. Renderer: three.js (3D surface mesh). Key algorithm: Thin-film ferrohydrodynamic model — surface height h(x,y,t) evolved via: ∂h/∂t = -∇·(h³/3μ · ∇p_mag + γ∇²h - ρg) where p_mag = μ₀M²h/2. Magnetic pressure perturbation computed in Fourier space: p̂_mag(k) = μ₀M²k/(2(k_c² + k²)^{1/2})·ĥ(k). Linear stability: growth rate σ(k) = √(ρg/σ)·k·[k²/k_c² - 1 - (B/B_c)²] — unstable when B > B_c and k < k_c. Nonlinear evolution: use pseudo-spectral method on 128×128 grid (dealiased). Spike rendering in three.js: generate mesh from h(x,y) field each frame. Hexagonal spontaneous ordering emerges naturally from the nonlinear competition. Gotcha: the thin-film model breaks down at large spike amplitudes — use a full 3D free-surface simulation for high-amplitude accuracy.
