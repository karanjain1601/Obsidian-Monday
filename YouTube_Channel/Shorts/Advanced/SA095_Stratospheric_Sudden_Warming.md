---
title: "Stratospheric Sudden Warming: Polar Vortex Breakdown"
id: SA095
type: youtube-short
duration: "~45 seconds"
feeds_video: "Stratospheric Sudden Warming and Winter Weather Extremes"
difficulty: advanced
tags: [physics, simulation, short, advanced, stratospheric-warming, polar-vortex, atmospheric-dynamics, winter-weather]
---

> **What it is:** A ~45-second simulation showing a sudden stratospheric warming event with the polar vortex splitting, the stratosphere warming by 40 K in days, and the temperature anomaly descending to disrupt tropospheric weather. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Stratospheric Sudden Warming and Winter Weather Extremes

# Short: Stratospheric Sudden Warming — Polar Vortex Breakdown

**Feeds full video:** Stratospheric Sudden Warming and Winter Weather Extremes

## Visual Hook (First 3 Seconds)
Top-down North Pole view: a tight blue vortex spins clockwise at 30 km altitude. Then a wave-2 planetary wave (two red spiral arms) punches in from the south. The blue vortex elongates, splits, and the temperature label jumps from **"−80°C"** to **"−20°C"** in one second.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Polar stereographic projection, 90°N to 30°N, at 30 hPa (≈24 km). Background: zonal wind in color (blue = westerly, 60 m/s; orange = easterly). Polar vortex edge: white contour at 30 m/s.
- **0:10** — Planetary wave-2 forcing from troposphere: two red Rossby wave crests (wavenumber 2) propagate upward from 500 hPa. Eliassen-Palm flux vectors (yellow arrows) show upward and equatorward propagation.
- **0:18** — EP flux convergence in the stratosphere: deceleration of zonal wind begins. Zonal-mean wind bar drops from 60 → 40 → 20 m/s in animation. Vortex edge (white contour) begins to distort into a kidney shape.
- **0:27** — Vortex split event: the single polar vortex (blue) divides into two daughter vortices, each 1500 km diameter, rotating separately. Central temperature surges: **"ΔT = +60°C in 5 days"** counter visible.
- **0:36** — Downward coupling: a tropospheric pressure anomaly develops 2 weeks later. Arctic Oscillation index drops from **"AO = +1.2"** to **"AO = −2.1"** shown as oscillation dial. Cold air outbreaks (purple patches) spread to 40°N.
- **0:44** — Timeline bar: Day 0 (wave forcing) → Day 5 (SSW peak) → Day 20 (tropospheric impact). Label: **"Cold snap 3000 km away, 2 weeks later."**

## Physics Concept Teased
Stratospheric sudden warmings occur when planetary Rossby waves break in the stratosphere, decelerating the polar vortex and driving 60°C temperature rises in days — a teleconnection that produces cold outbreaks weeks later at the surface.

## On-Screen Text / Captions
- **0:00** — "A storm 24 km up causes cold snaps on the ground"
- **0:10** — "Rossby waves climb into the stratosphere"
- **0:20** — "They decelerate the polar vortex — winds flip"
- **0:30** — "Vortex splits: temperature surges 60°C in days"
- **0:38** — "2 weeks later: Arctic air floods mid-latitudes"
- **0:45** — "Full SSW physics → bio link"

## End Card
Final 3 seconds: polar stereographic map with cold (blue) outbreak patches at 40°N, vortex in red. **"CodedLaws — Climate Dynamics"** text.

## Audio
Cold wind howl fading to low electronic pulse. 68 BPM ambient. Sharp crack SFX at vortex split moment.

## Production Notes
Renderer: Held-Suarez simplified GCM (Python/Dedalus). Wave forcing: wavenumber-2 topographic perturbation at lower boundary. EP flux computed: F = (−u'v'·cosφ, f·v'θ'/θ̄_z − u'w'). SSW criterion: 10 hPa zonal-mean wind < 0 at 60°N. Simulation domain: T42 spectral, 40 vertical levels. Output 1080×1920, 60 fps.
