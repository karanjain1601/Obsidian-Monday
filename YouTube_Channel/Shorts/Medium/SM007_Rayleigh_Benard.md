---
title: "Rayleigh-Bénard Convection Rolls"
id: SM007
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, convection, thermodynamics, pattern-formation]
---

> **What it is:** A ~45-second simulation showing a fluid layer heated from below spontaneously organizing into orderly convection rolls that grow more energetic and eventually turbulent as the Rayleigh number rises — demonstrating buoyancy-driven Rayleigh-Bénard convection. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Rayleigh-Bénard Convection Rolls

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Side view: a thin horizontal layer of fluid, bright orange at the bottom (hot plate), deep blue at the top (cold plate). At 2 seconds perfect cylindrical rolls appear — warm fluid rising in red columns, cool fluid sinking in blue columns — arranged like a perfectly striped candy.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Temperature field shown with a rainbow colour-map (blue=cold, red=hot). Three convection rolls fill the domain. Velocity arrows show the circulation: up in the warm plumes, over, down in the cool plumes, under. Annotation: "Ra = 5000."

**0:10–0:18** — Rayleigh number slider animates from Ra=1708 (onset) to Ra=50000. At onset a single roll appears hesitantly. As Ra increases, rolls become tighter, more energetic, and a wavy secondary instability (oscillatory convection) appears. Caption: "Ra_c = 1708."

**0:18–0:27** — Nusselt number (Nu = convective / conductive heat flux) plotted live on a growing graph bottom-right. As Ra increases Nu rises steeply: "Heat transfer × 10 vs. conduction alone."

**0:27–0:36** — At Ra = 10⁶ the flow becomes chaotic: plumes detach, merge, and reform. The top view shows a disordered polygonal cell pattern (Bénard cells). Annotation: "Turbulent convection."

**0:36–0:45** — Slow-motion replay of a single thermal plume rising from the hot plate: a bright mushroom-head of hot fluid, reminiscent of SM001 but driven purely by buoyancy. Text: "Thermal plume." Fade to black.

## Physics Concept Teased
Rayleigh-Bénard convection: a fluid layer heated from below becomes unstable above Ra_c = 1708. Buoyancy drives organised rolls whose aspect ratio and pattern are set by the Rayleigh number Ra = gαΔTd³/(νκ). This is the mechanism for weather, ocean mixing, and Earth's mantle flow.

## On-Screen Text / Captions
- **0:00** — "Hot bottom. Cold top."
- **0:03** — "Ra = 5000 — convection rolls appear"
- **0:12** — "Critical Rayleigh number: Ra_c = 1708"
- **0:20** — "Nu rises — convection beats conduction"
- **0:30** — "Ra = 1,000,000 — turbulent convection"
- **0:38** — "This drives weather, oceans, Earth's mantle."
- **0:44** — "Rayleigh-Bénard convection."

## End Card
Final 3 seconds: top-down view of hexagonal Bénard cells overlaid with the real Bénard cell photo from 1900. Text: "Henri Bénard first observed this in 1900." CodedLaws logo.

## Audio
Flowing ambient electronic (80 BPM), warm synth pads. Voiceover at 0:00: "Heat a fluid from below and it spontaneously organises into perfect rolling patterns." Subtle rising whoosh sound each time a thermal plume rises (~0:38).

## Production Notes
Code complexity: moderate to complex. Renderer: Canvas 2D or WebGL. Key algorithm: 2D Boussinesq Navier-Stokes with temperature as active scalar, Boussinesq buoyancy term (f = gα(T-T_ref)), pseudo-spectral solver or finite-difference with pressure projection. Grid: 256×64 (Lx:Lz = 4:1 to fit multiple rolls). Onset at Ra_c = 1708 for stress-free BCs (no-slip Ra_c = 1708 too). Gotcha: aspect ratio of domain determines number of rolls — choose Lx = n × (2d) for n rolls. Runtime: real-time at moderate Ra, pre-rendered for turbulent regime.
