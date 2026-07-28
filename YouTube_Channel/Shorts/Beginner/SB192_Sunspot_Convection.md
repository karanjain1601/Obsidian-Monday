---
title: "Sunspots: Where Magnetic Fields Block Heat"
id: SB192
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, astrophysics, sunspot, magnetism]
---

> **What it is:** A ~45-second simulation short where a 3000-Gauss magnetic flux tube pierces the solar photosphere and bends aside all the rising convection arrows, starving the surface above of heat and creating a dark 15,000-km-wide umbra that glows at 3800 K — revealing how magnetic pressure suppresses convection to produce sunspots. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Sunspots: Where Magnetic Fields Block Heat

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
The Sun's surface — granulation cells boiling and roiling in orange-yellow. Suddenly a dark hole appears in the center, spreading like an ink drop: the umbra. The surrounding granulation wraps around it (penumbra filaments). Temperature labels flash: "5800 K" on bright surface, "4000 K" on the dark umbra. The sunspot is NOT cold — it just looks dark by comparison.

## Main Visual Sequence (0:03–0:50)
**0:03** — Side cross-section below the Sun's surface. Labeled layers: convection zone (orange turbulent region), photosphere (bright yellow-white top layer). Multiple rising convection columns shown (red arrows pointing upward from below — hot plasma rising). Falling cooler plasma (blue arrows, edges of granule cells). Label: "Solar granulation: convection cells ~1000 km wide, 8-min lifetime."

**0:08** — A strong vertical magnetic field tube (dark blue cylinder, labeled "B = 3000 Gauss = 0.3 Tesla") emerges from below and pierces the photosphere. Arrows inside the convection zone that previously pointed upward now BEND around the blue tube. Label: "Magnetic pressure = B²/2µ₀ = 360 kPa — suppresses convection".

**0:14** — The region above the magnetic tube in the photosphere: no hot plasma rising. The photosphere surface above the tube is dimmer — temperature bar drops from 5778 K (surrounding) to 3800 K (above tube). Label: "Less convective heating → cooler surface".

**0:20** — Zoom out to photosphere surface view (top-down). The suppressed region appears dark (dark brown-red, simulated blackbody color at 3800 K): the umbra. Surrounding it, elongated filamentary structures (radial, grey-brown) form the penumbra as magnetic field lines splay outward. Labels: "Umbra: ~3800 K, dark", "Penumbra: ~5000 K, filamentary". Size bar: "Umbra: 15,000 km diameter (larger than Earth)".

**0:28** — Simulation: 30-second time-lapse of granulation around the sunspot. Convection cells emerge, brighten, darken, and dissolve at the boundary of the penumbra — but the sunspot core stays persistently dark. White arrows show supergranulation flow (large-scale subsurface flow) pushing the sunspot sideways.

**0:34** — Energy comparison panel. Two equal-area circles: bright photosphere region (yellow, emitting σT⁴ = 6.3×10⁷ W/m² at 5778 K) vs sunspot umbra (dark, emitting σT⁴ = 1.2×10⁷ W/m² at 3800 K). Ratio = 5.3× less luminous. Label: "Not actually cold — just 1800 K cooler than surroundings."

**0:40** — Solar activity cycle panel: sunspot count graph (1700–2026) showing 11-year cycle. Solar cycle 25 peak labeled. Label: "Sunspot count peaks every ~11 years with solar activity."

**0:44** — Final: real-time Solar Dynamics Observatory (SDO) style image of the Sun with visible sunspot group. Label: "Galileo first drew sunspots in 1612."

## Physics Concept Teased
Sunspots form where strong vertical magnetic fields (up to 3000 Gauss) emerge through the solar photosphere and inhibit convective heat transport from below; the reduced energy delivery to the surface creates a region ~1800 K cooler than surroundings, appearing dark by contrast despite glowing at 3800 K.

## On-Screen Text / Captions
- **0:00** — "Sunspots look dark. But they glow at 3800 K. Here's why they seem cold."
- **0:03** — "Solar granulation: convection cells 1000 km wide"
- **0:08** — "B = 3000 Gauss — strong enough to block convection"
- **0:08** — "Magnetic pressure: 360 kPa"
- **0:14** — "No convection → less heat → cooler surface"
- **0:20** — "Umbra: 3800 K | Penumbra: 5000 K | Photosphere: 5778 K"
- **0:20** — "Sunspot umbra: 15,000 km wide (> Earth)"
- **0:34** — "Sunspot radiates 5× less power per m² than normal surface"
- **0:40** — "11-year solar cycle controls sunspot count"
- **0:44** — "Galileo observed sunspots in 1612"

## End Card
**0:47–0:50** — Orange solar surface with dark sunspot umbra. Bold text: "SUNSPOTS — Physics Series". "@CodedLaws". Subscribe button pulses orange.

## Audio
- **Music:** Slow, warm ambient — deep organ tone, subtle crackling (like a solar fire), 50 BPM.
- **Voiceover:** "A sunspot is actually glowing hot — 3800 Kelvin — but next to the 5800 Kelvin surrounding surface, it looks pitch black. The magnetic field is blocking the Sun's own heat engine from below." (0:14–0:34, warm, measured male voice).
- **SFX:** Bubbling granulation sound (low, organic, continuous) beneath voiceover; magnetic hum as flux tube appears (0:08); comparison "ping" at each temperature label.

## Production Notes
- **Renderer:** Python + Matplotlib with Voronoi tessellation for granulation pattern; animated using FuncAnimation. Sunspot overlaid as a dark ellipse with radial gradient for umbra/penumbra transition.
- **Code complexity:** Medium. Granulation simulation: generate 400 random Voronoi seed points; color each cell by a random brightness value (normal distribution, mean 5778 K, sigma 200 K); animate cell brightness fluctuating over 8-minute lifetimes. Sunspot: suppress brightness in a circular region, add penumbra filament texture using elongated Perlin noise radially oriented.
- **Key visual trick:** Show granulation in the Stefan-Boltzmann color scheme (blackbody color at each temperature) — granule centers are yellow-white (hot), edges are orange-red (cooler). Umbra is deep orange-red (3800 K) — NOT black, reinforcing that it IS emitting, just less.
- **Runtime:** Granulation time-lapse (0:28–0:34) — compress 8 minutes of solar real-time into 6 s of video (80× speedup).
- **Gotchas:** Show the full sunspot with both umbra AND penumbra clearly labeled — many viewers only know the dark center. The penumbra (filamentary, intermediate brightness) is where the inclined magnetic field partially allows convection.
