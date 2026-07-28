---
title: "Solar Wind: Alfvén Wave Driving"
id: SA091
type: youtube-short
duration: "~45 seconds"
feeds_video: "Alfvén Waves and Solar Wind Acceleration Explained"
difficulty: advanced
tags: [physics, simulation, short, advanced, solar-wind, plasma, mhd, alfven-wave, heliosphere]
---

> **What it is:** A ~45-second simulation showing Alfven waves propagating outward along solar wind magnetic field lines in a WKB model carrying energy flux that accelerates the wind from sub-Alfvenic to super-Alfvenic speeds. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Alfven Waves and Solar Wind Acceleration Explained

# Short: Solar Wind — Alfvén Wave Driving

**Feeds full video:** Alfvén Waves and Solar Wind Acceleration Explained

## Visual Hook (First 3 Seconds)
Black void of space. A luminous amber-white corona pulses at center. Two sinuous blue-violet wave crests — wavelength ~400 px — ripple outward along a magnetic field line rendered in electric cyan (#00FFFF). A white velocity label reads **"v = 0 km/s"** at the base. Instant cut-to-motion.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Split view: left panel shows solar corona (orange-white glow, 1 solar radius = 200 px); right panel shows a 2D MHD grid colored by Alfvén speed (purple = 50 km/s, yellow = 600 km/s).
- **0:10** — Transverse Alfvén wave packet launched at the coronal base; field lines oscillate ±15° about the radial direction, colored cyan oscillating to magenta with each half-cycle.
- **0:18** — Wave energy flux (Poynting vector arrows, white, 20 px each) propagates outward; plasma parcels accelerated from 50 to 250 km/s in 8 solar radii. Velocity counter climbs: **"v = 127 km/s"**.
- **0:27** — Parametric decay instability: the primary Alfvén wave spawns a forward sound wave (green) and backward Alfvén wave (red). Energy redistribution shown as bar chart overlay — forward wave bar grows from 0 to 65%.
- **0:35** — At 20 solar radii, final solar wind speed plateau: velocity label locks at **"v = 400 km/s"**. Coronal plasma density (false-color teal-to-black gradient) falls by 4 orders of magnitude shown in log scale.
- **0:43** — Zoom out: full heliosphere to 1 AU. Earth's magnetosphere (blue bubble) intercepts the amber solar wind stream. White text fades in: **"Alfvén waves power the solar wind."**

## Physics Concept Teased
Alfvén waves — transverse oscillations of magnetized plasma — carry enough wave pressure to accelerate coronal plasma against gravity, sustaining the 400–750 km/s solar wind observed at Earth orbit.

## On-Screen Text / Captions
- **0:00** — "The Sun launches 1 million tonnes of plasma every second"
- **0:08** — "Alfvén waves: magnetic field + plasma co-oscillation"
- **0:20** — "Wave pressure does the work of acceleration"
- **0:30** — "Parametric decay transfers energy forward"
- **0:40** — "Result: 400 km/s solar wind — constantly"
- **0:45** — "Full video in bio → Alfvén Wave Deep Dive"

## End Card
Final 3 seconds: the heliosphere bubble glows amber; Earth's field lines deflect the stream. Static white text: **"CodedLaws — Solar Wind Series"** bottom-left; subscribe pulse animation top-right.

## Audio
Ambient synth drone at 60 BPM; deep sub-bass pulse synced to each wave cycle launch. Soft whoosh SFX as plasma stream expands. No voiceover — captions only.

## Production Notes
Renderer: custom WGPU compute shader (MHD 2.5D). Alfvén wave driven via boundary velocity perturbation ±10 km/s at 5 mHz. Parametric decay tracked via 3-wave resonance condition. Field-line advection with RK4 integration, dt = 0.01 Alfvén crossing time. Output at 1080×1920 vertical, 60 fps.
