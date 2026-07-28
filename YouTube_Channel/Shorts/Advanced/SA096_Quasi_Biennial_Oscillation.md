---
title: "Quasi-Biennial Oscillation: Zonal Wind Reversal"
id: SA096
type: youtube-short
duration: "~45 seconds"
feeds_video: "The Quasi-Biennial Oscillation: A 28-Month Stratospheric Metronome"
difficulty: advanced
tags: [physics, simulation, short, advanced, qbo, stratosphere, zonal-wind, wave-mean-flow, tropical-dynamics]
---

> **What it is:** A ~45-second simulation showing the quasi-biennial oscillation self-generated in a 2D stratospheric model as upward-propagating gravity and Kelvin waves deposit alternating momentum and reverse the equatorial jet on a ~28-month period. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** The Quasi-Biennial Oscillation: A 28-Month Stratospheric Metronome

# Short: Quasi-Biennial Oscillation — Zonal Wind Reversal

**Feeds full video:** The Quasi-Biennial Oscillation: A 28-Month Stratospheric Metronome

## Visual Hook (First 3 Seconds)
An equatorial altitude-time Hovmöller plot fills the screen: alternating bands of cobalt blue (westerly, +30 m/s) and vivid orange-red (easterly, −30 m/s) descend slowly downward over years. Label appears: **"Same altitude. Wind reverses every 14 months."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Equatorial cross-section, 16–50 km altitude. Zonal wind profile shown as horizontal bar chart: upper stratosphere = blue (westerly, +28 m/s), lower stratosphere = orange (easterly, −24 m/s). Equator highlighted gold.
- **0:10** — Gravity wave spectrum launched from tropical convection (grey storm clouds at bottom). Eastward-propagating waves (blue arrows) and westward-propagating waves (orange arrows) rise with equal amplitude: **"Each carries 0.3 N/m² momentum flux."**
- **0:18** — Wave filtering by critical layers: eastward waves absorbed at the easterly jet (orange region), depositing westerly momentum. Western waves absorbed at the westerly jet (blue region), depositing easterly momentum. Color bars shift 2 km downward.
- **0:27** — Net effect: each jet descends at **"~1 km/month"** — clock counter on right showing months. At 20 km, current phase = westerly (blue). At 30 km, current phase = easterly (orange). Phase boundary = white dashed line.
- **0:36** — Full cycle time-lapse: 28 months compressed to 4 seconds. Hovmöller diagram builds in real-time — 3 complete blue/orange cycle pairs visible. QBO period label: **"Period = 28 ± 3 months"**.
- **0:44** — Teleconnection panel: QBO phase aligns with Northern Hemisphere winter weather index. Label: **"QBO west phase → stronger polar vortex."** Globe with polar vortex (blue tight ring) shown.

## Physics Concept Teased
The QBO self-organizes from wave-mean flow interactions: convective gravity waves selectively deposit momentum at their critical layers, causing each stratospheric jet to erode and re-form 1 km lower each month, reversing the entire equatorial wind column every ~28 months.

## On-Screen Text / Captions
- **0:00** — "The stratosphere reverses wind direction every 28 months"
- **0:10** — "Tropical storms launch equal waves east and west"
- **0:20** — "Each wave is absorbed at its own critical layer"
- **0:30** — "The jets eat themselves and descend"
- **0:38** — "Period = 28 months — precisely self-timed"
- **0:45** — "QBO full physics → link in bio"

## End Card
Final 3 seconds: Hovmöller diagram with 3 blue/orange cycles, **"CodedLaws — Stratospheric Dynamics"** text centered.

## Audio
Slow pendulum-like electronic beat, 40 BPM. Bass note reverses polarity each wind phase. Subtle whoosh on each km of descent.

## Production Notes
Renderer: 1D wave-mean flow model (Python). Wave spectrum: 20 gravity waves, cₓ = −40 to +40 m/s, each with Fᵤ = 0.015 N/m². Critical layer absorption: full Eliassen-Palm flux divergence formulation. Descent rate reproduced by model: 0.8 km/month. QBO period self-emerges from wave spectrum without tuning. Output 1080×1920, 60 fps.
