---
title: "El Niño: Ocean-Atmosphere Coupling"
id: SA098
type: youtube-short
duration: "~45 seconds"
feeds_video: "El Niño and La Niña: The Coupled Ocean-Atmosphere System"
difficulty: advanced
tags: [physics, simulation, short, advanced, el-nino, enso, ocean-atmosphere, bjerknes-feedback, tropical-pacific]
---

> **What it is:** A ~45-second simulation showing El Nino coupled ocean-atmosphere dynamics in the tropical Pacific with warm SST anomalies weakening trade winds, deepening the thermocline, and amplifying via Bjerknes feedback. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** El Nino and La Nina: The Coupled Ocean-Atmosphere System

# Short: El Niño — Ocean-Atmosphere Coupling

**Feeds full video:** El Niño and La Niña: The Coupled Ocean-Atmosphere System

## Visual Hook (First 3 Seconds)
Tropical Pacific from 120°E to 80°W. Sea surface temperature (SST) false color: vivid crimson (30°C) in the west, cool blue (22°C) in the east. Then: the red blob expands eastward, swallowing the blue. White number climbs: **"+2.4°C."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — La Niña baseline state: SST map — red (30°C) west, blue (22°C) east. Trade winds (white arrows, left-pointing, 8 m/s) pile warm water 0.5 m higher in the west. Thermocline depth: west = 150 m deep (blue band), east = 50 m shallow (orange band).
- **0:10** — Bjerknes feedback trigger: trade winds weaken to 4 m/s. Warm water sloshes east (Kelvin wave: orange wave front propagating at 2.5 m/s, labeled). Eastern thermocline deepens from 50 → 90 m.
- **0:18** — Eastern Pacific warms: SST anomaly NINO3.4 index: **"+1.0°C"** → **"+2.4°C"**. Convective clusters (orange puffs) shift from Maritime Continent to central Pacific (180°). Walker circulation cell (blue circular arrow) weakens and reverses.
- **0:27** — Positive feedback loop diagram overlaid: SST rise → reduced trade winds → more SST rise → arrow cycle shown in white on black background, 4 nodes. Label: **"Bjerknes feedback: self-amplifying."**
- **0:36** — Global teleconnections panel: map with colored precipitation anomalies. Australia (brown = drought), Peru (green = flood), California (yellow = warm & dry), East Africa (green = wet). Each anomaly box labeled.
- **0:44** — ENSO cycle time-lapse: 1990–2020 ONI index plotted (red = El Niño, blue = La Niña). Major events labeled: 1997/98 (+2.3), 2015/16 (+2.6). Period: **"3–7 years, irregular."**

## Physics Concept Teased
El Niño is sustained by the Bjerknes positive feedback: weakening trade winds allow warm water to spread east, reducing Walker circulation, further weakening trades — a coupled ocean-atmosphere instability that reverses within 1–2 years via oceanic Rossby wave reflection.

## On-Screen Text / Captions
- **0:00** — "The Pacific Ocean switches modes every 3–7 years"
- **0:10** — "Trade winds weaken — warm water floods east"
- **0:20** — "Ocean warms atmosphere; atmosphere weakens trades"
- **0:30** — "A self-amplifying feedback loop — Bjerknes"
- **0:38** — "Droughts and floods on 4 continents, simultaneously"
- **0:45** — "Full ENSO dynamics → bio link"

## End Card
Final 3 seconds: global SST anomaly map with El Niño pattern, red Pacific stripe. **"CodedLaws — Climate Systems"** text.

## Audio
Warm oceanic ambient drone, 60 BPM. Wave slosh SFX with each Kelvin wave pulse. No voiceover.

## Production Notes
Renderer: intermediate-complexity ENSO model (Zebiak-Cane type, Python). Coupled SST + thermocline + wind equations. Kelvin wave speed: c = 2.5 m/s. Rossby wave speed: c_R = c/3. Bjerknes feedback coefficient β = 0.8. Teleconnection patterns from ENSO composite regressions (ERA5 data). Output 1080×1920, 60 fps.
