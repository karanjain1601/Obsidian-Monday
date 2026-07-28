---
title: "GRMHD: General Relativistic MHD Jet"
id: SA014
type: youtube-short
duration: "~45 seconds"
feeds_video: "Black Hole Jets: General Relativistic MHD Simulation"
difficulty: advanced
tags: [physics, simulation, short, advanced, grmhd, general-relativity, mhd, jet, black-hole, astrophysics]
---

> **What it is:** A ~45-second simulation of a magnetically dominated relativistic jet launching from a Kerr black hole magnetosphere via GRMHD and collimating to parsec-scale distances. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Black Hole Jets: General Relativistic MHD Simulation

# Short: GRMHD — General Relativistic MHD Jet

**Feeds full video:** Black Hole Jets: General Relativistic MHD Simulation

## Visual Hook (First 3 Seconds)
A Kerr black hole (spin a = 0.9M, shown as a jet-black sphere with gravitationally lensed accretion disk glowing in orange and gold) launches two relativistic jets (electric blue columns) to ±20 Schwarzschild radii. Text: "Lorentz factor Γ = 8.3". The jets pulse at 4 Hz with magnetic kink instabilities.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Accretion disk cross-section: colour shows plasma density (log scale, purple = 10⁻⁴ → gold = 10² g/cm³). Magnetic field lines (white spirals) thread through disk and funnel into polar regions forming the jet launching zone.
- **0:10** — Blandford-Znajek mechanism panel: ergosphere shown as translucent gold shell around black hole. Field lines dragged by frame-dragging (curved arrows in red). Poynting flux (energy extracted from spin) shown as cyan outward beam. Text: "Extracting rotational energy from spacetime".
- **0:18** — 3+1 GRMHD equation panel: ∂_t(√γ ρu^μ) + … = 0. Metric components g_μν visualised as a 4×4 blue matrix with off-diagonal frame-dragging terms highlighted in gold.
- **0:27** — Jet velocity profile: radial slice showing Lorentz factor Γ (x-axis 1–10) vs height above disk (y-axis 0–20 r_s). Γ peaks at 8.3 on jet axis (gold), drops to 1.1 at jet boundary. "Relativistic collimation" caption.
- **0:35** — Magnetic kink (m=1) instability: jet cross-section evolves from circular (blue disc) to kinked helix (cyan spiral). Polarisation angle map rotates 360° in 2 s. VLBI-like synthetic image shown at jet base.
- **0:43** — Energy budget pie chart: 68% magnetic Poynting flux (gold), 22% kinetic (blue), 10% thermal (red). "Magnetically dominated jet".

## Physics Concept Teased
GRMHD combines general relativity's curved spacetime (4-metric g_μν) with magnetohydrodynamics, allowing simulation of the Blandford-Znajek process where a rotating Kerr black hole extracts energy electromagnetically from its ergosphere, powering collimated relativistic jets.

## On-Screen Text / Captions
- **0:00** — "Spin a = 0.9M. Γ = 8.3. A real jet." (white, top)
- **0:10** — "Blandford-Znajek: extracting black hole spin" (cyan, lower)
- **0:18** — "4D spacetime. One set of equations." (white, bottom bar)
- **0:27** — "Γ = 8.3 on axis — relativistic" (gold, graph label)
- **0:35** — "Kink instability twists the jet" (white, bottom)
- **0:43** — "68% magnetic — Poynting-dominated" (gold, chart label)

## End Card
Final 3 seconds: both jets blaze outward into intergalactic space. "CODED LAWS" in cosmic gold. Subscribe. "Next: N-Body Dark Matter →" teaser.

## Audio
Deep cosmic drone with low-frequency oscillation at Alfvén frequency; synth sweep on jet launch; reverb-heavy impact on kink instability event. 55 BPM cosmic ambient. No voiceover.

## Production Notes
GRMHD code: HARM (High Accuracy Relativistic Magnetohydrodynamics). Metric: Kerr-Schild coordinates, spin a = 0.9M. Grid: 256 (r) × 128 (θ) × 64 (φ) logarithmic radial. Floors: density floor ρ_min = 10⁻⁵. Visualization: yt-project with custom GRMHD colormaps. Simulation time: M = 10⁴ (geometric units), run on 512 CPU cores × 24 hours.
