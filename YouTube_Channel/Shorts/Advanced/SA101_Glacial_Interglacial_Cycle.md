---
title: "Glacial-Interglacial Cycle: Milankovitch Forcing"
id: SA101
type: youtube-short
duration: "~45 seconds"
feeds_video: "Ice Ages and Milankovitch Cycles: Earth's Orbital Pacemaker"
difficulty: advanced
tags: [physics, simulation, short, advanced, milankovitch, ice-age, orbital-forcing, paleoclimate, glacial-cycle]
---

> **What it is:** A ~45-second simulation showing glacial-interglacial cycles over 800,000 years driven by Milankovitch orbital forcing (eccentricity, obliquity, precession) amplified by CO2 and ice-sheet albedo feedbacks. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Ice Ages and Milankovitch Cycles: Earth's Orbital Pacemaker

# Short: Glacial-Interglacial Cycle — Milankovitch Forcing

**Feeds full video:** Ice Ages and Milankovitch Cycles: Earth's Orbital Pacemaker

## Visual Hook (First 3 Seconds)
Time-lapse globe: ice sheets (white) advance from the poles, swallowing Canada and northern Europe in seconds. Then retreat. Cycle repeats. Counter: **"100,000 years = 3 seconds."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Three orbital parameter panels side by side: (1) eccentricity (0→0.06, 100 kyr cycle, orange sine wave), (2) axial tilt/obliquity (22°–24.5°, 41 kyr cycle, cyan sine wave), (3) precession index (23 kyr cycle, magenta sine wave).
- **0:10** — Insolation at 65°N in summer computed from orbital parameters: white curve showing ±60 W/m² variations over 500,000 years. Insolation minima (blue shading) align with ice sheet advances. Label: **"65°N summer: 440→500 W/m²"**.
- **0:18** — Ice sheet simulation: Laurentide (North America) and Fennoscandian (Europe) ice sheets colored white-to-blue. At insolation minimum: sheets expand to 50°N. At maximum: retreat to 65°N. Ice volume counter: **"ice vol: 52×10⁶ km³"** at glacial max.
- **0:27** — 100 kyr problem visualization: eccentricity forcing is weak (±2 W/m²) but ice age cycles lock to 100 kyr. Nonlinear amplification diagram: small forcing → large response due to ice-albedo feedback. Feedback factor shown: **"α = 3.2"**.
- **0:36** — Benthic δ¹⁸O proxy record plot (800,000 years): jagged curve with slow glaciations (gradual line slope, ~90 kyr) and rapid deglaciations (vertical line drops, ~10 kyr). Label: **"Asymmetric: slow in, fast out."**
- **0:44** — Animation of last glaciation (26 ka LGM): ice covers New York City (orange marker), sea level drops **"−120 m"** (coastline shifts 200 km east on map). Britain connected to Europe — land bridge visible.

## Physics Concept Teased
Milankovitch cycles modulate Northern Hemisphere summer insolation at 65°N; when this falls below a threshold, snow survives summer and ice sheets grow via ice-albedo feedback — a nonlinear amplifier that produces 100 kyr glacial cycles from orbital forcing of only 2 W/m².

## On-Screen Text / Captions
- **0:00** — "Ice sheets a kilometer thick buried New York City"
- **0:10** — "Three orbital wobbles drive every ice age"
- **0:20** — "Summer sun at 65°N is the pacemaker"
- **0:30** — "Small forcing, big response: nonlinear feedback"
- **0:38** — "Glaciation takes 90,000 years; melting: 10,000"
- **0:45** — "Full Milankovitch physics → bio"

## End Card
Final 3 seconds: globe with Laurentide ice sheet at LGM extent. **"CodedLaws — Paleoclimate"** text.

## Audio
Slow, ponderous orchestral drone at 40 BPM. Wind/ice creak SFX at glacial maximum. No voiceover.

## Production Notes
Renderer: 1D energy balance model with ice sheet parameterization (Python). Orbital parameters from Laskar (2004) solution. Insolation computed via Berger (1978). Ice-albedo feedback: α_ice = 0.6, α_ocean = 0.1. Ice sheet volume from isostasy model: τ_isostasy = 3000 years. δ¹⁸O proxy converted from ice volume. Output 1080×1920, 60 fps.
