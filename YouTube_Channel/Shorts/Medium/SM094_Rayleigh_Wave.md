---
title: "Rayleigh Surface Wave — Particle Motion"
id: SM094
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, seismology, rayleigh-wave, surface-wave, retrograde-motion]
---

> **What it is:** A ~45-second simulation short where a Rayleigh wave rolls along Earth's surface while particles trace retrograde counter-clockwise ellipses that shrink exponentially with depth, demonstrating why these coupled P-SV surface waves travelling at ~0.92 Vs are the most destructive component of earthquake shaking. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Rayleigh Surface Wave — Particle Motion

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Side view of Earth's surface. A Rayleigh wave propagates from left to right. The particles on the surface trace perfect ellipses — but they orbit RETROGRADE (opposite to wave propagation direction). The ellipses shrink with depth. It looks like invisible gears rolling just below the surface.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Rayleigh wave: the combined P-SV surface wave that propagates along a free surface. Wave equation solution: amplitudes decay exponentially with depth: ux ∝ e^{-κz}, uz ∝ e^{-κz}. The particle motion is an ellipse in the vertical plane. Caption: "Rayleigh: P-SV coupled, decays with depth." Wave speed: cR ≈ 0.92Vs (slower than both P and S waves).

**0:10–0:18** — Retrograde motion: near the surface, horizontal motion (x) leads vertical motion (z) by π/2 phase — producing retrograde (counter-clockwise) ellipses. At a depth of ~0.2λ, motion becomes prograde (clockwise). Caption: "Retrograde above 0.2λ depth; prograde below."

**0:18–0:27** — Depth decay: ellipse size plotted vs depth. Amplitude decays as e^{-0.85kz} (approximation). At depth z=λ, amplitude is only 10% of surface. Caption: "Amplitude: exp(-0.85kz) — one wavelength deep: 10% remains."

**0:27–0:36** — Seismogram: a 3-component seismogram (North, East, Vertical). Rayleigh wave is on the Z (vertical) and N-S (radial) components. Love wave is on the E-W (transverse) component. Caption: "3-component seismogram separates Love and Rayleigh." Particle motion plot: Rayleigh → vertical ellipse; Love → horizontal line.

**0:36–0:45** — Application: Rayleigh waves are the most damaging surface waves in earthquakes — their elliptical particle motion creates both horizontal and vertical shaking. Seismic hazard maps are dominated by Rayleigh wave effects. Caption: "Earthquakes: Rayleigh waves = most damage to buildings." Bold text: "Rayleigh wave — the Earth's surface memory of earthquakes." Fade to black.

## Physics Concept Teased
Rayleigh surface wave: a coupled P-SV elastic wave propagating along a free surface with amplitude decaying exponentially with depth. Particle motion traces retrograde ellipses (counter-clockwise near the surface). Wave speed cR ≈ 0.92Vs, slower than both bulk waves. The most energetic and destructive seismic wave for surface structures.

## On-Screen Text / Captions
- **0:00** — "Retrograde ellipses — particles orbit backwards."
- **0:05** — "Rayleigh: P-SV coupled; cR ≈ 0.92Vs"
- **0:12** — "Retrograde above 0.2λ depth; prograde below"
- **0:20** — "Amplitude: exp(-0.85kz) — decays with depth"
- **0:28** — "3-component: Z+N-S = Rayleigh; E-W = Love"
- **0:35** — "Most damaging: both horizontal and vertical shaking"
- **0:43** — "Rayleigh wave — the Earth's slow roller."

## End Card
Final 3 seconds: side view of a Rayleigh wave with retrograde ellipses visible as particles orbit. Text: "Lord Rayleigh predicted this wave analytically in 1885 — before it was observed in earthquakes." CodedLaws logo.

## Audio
Slow, undulating bass (mimicking the rolling Rayleigh motion). Voiceover at 0:00: "Rayleigh waves roll along Earth's surface like ocean waves — but the particles orbit backwards against the wave direction." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D (2D P-SV elastic wave FD). Key algorithm: same staggered-grid FD as SM091 but in a 2D x-z cross-section. Add free-surface boundary condition at z=0 (normal stress = 0). Rayleigh wave forms naturally as the surface wave component. For particle motion visualisation: track individual particles near the surface and draw their displacement ellipses. Analytical Rayleigh wave: solve for the eigenvalue cR from the Rayleigh wave secular equation: (2-c²/Vs²)² = 4√(1-c²/Vp²)√(1-c²/Vs²). Numerical root finding. Display particle motion at multiple depths simultaneously. Runtime: FD simulation pre-rendered; analytical particle motion real-time.
