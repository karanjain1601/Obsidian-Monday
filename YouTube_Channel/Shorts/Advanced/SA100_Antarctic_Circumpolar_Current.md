---
title: "Antarctic Circumpolar Current: Wind-Driven Dynamics"
id: SA100
type: youtube-short
duration: "~45 seconds"
feeds_video: "The Antarctic Circumpolar Current: Ocean's Mightiest River"
difficulty: advanced
tags: [physics, simulation, short, advanced, acc, antarctic, ocean-current, wind-driven, eddies, southern-ocean]
---

> **What it is:** A ~45-second simulation showing the Antarctic Circumpolar Current driven by Southern Ocean westerlies with mesoscale eddies forming and transporting heat and carbon northward across the ACC fronts. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** The Antarctic Circumpolar Current: Ocean's Mightiest River

# Short: Antarctic Circumpolar Current — Wind-Driven Dynamics

**Feeds full video:** The Antarctic Circumpolar Current: Ocean's Mightiest River

## Visual Hook (First 3 Seconds)
Southern Ocean from above: Antarctica (white ice cap) at center, surrounded by a swirling electric-teal current belt streaming eastward. Hundreds of white mesoscale eddies (spirals, 50–300 km diameter) pepper the flow. Counter: **"150 Sv — world's largest ocean current."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Southern Ocean polar view, 30°S–90°S. ACC colored by velocity: 0 cm/s (dark navy) → 100 cm/s (bright teal). Westerly wind stress vectors (white arrows, 0.2 N/m²) drive the flow eastward around the 24,000 km circumpolar belt.
- **0:10** — Ekman layer (top 50 m): wind stress drives northward surface drift (orange arrows, 10 cm/s), creating a sea surface height (SSH) slope — north high, south low — by **"0.8 m over 10°"** of latitude. Geostrophic balance maintains the current.
- **0:18** — Mesoscale eddy generation: the ACC becomes baroclinically unstable at Drake Passage. Two Agulhas retroflection rings (anticyclones, red, 200 km diameter) and two cyclonic eddies (blue, 150 km) pinch off. Label: **"EKE = 0.04 m²/s²"**.
- **0:27** — Eddy saturation: wind stress increases 20% (arrow thickness doubles), but ACC transport barely increases — only from 150 → 152 Sv. Eddy kinetic energy absorbs the extra wind work. Eddy count grows from 12 to 20 on screen.
- **0:36** — Standing meanders: three stationary wave crests (white bands) pinned at submarine ridges (grey bumps at ocean floor). Form stress transfers momentum downward to the solid Earth rather than accelerating the current.
- **0:44** — Carbon flux overlay: ACC upwells (upward blue arrows) old deep water rich in CO₂ (red shading). Label: **"Upwelling: 50% of deep-ocean CO₂ escapes here."** Southern Ocean as a global carbon valve.

## Physics Concept Teased
The ACC is sustained by westerly wind stress but regulated by mesoscale eddies that saturate transport — form stress at topographic ridges and eddy fluxes transfer momentum vertically to the sea floor, creating a self-limiting system impervious to simple wind intensification.

## On-Screen Text / Captions
- **0:00** — "150 Sverdrup — 150 times the Amazon River"
- **0:10** — "Wind pushes water north; Earth's spin bends it east"
- **0:20** — "Baroclinic instability spins off mesoscale eddies"
- **0:30** — "More wind → more eddies, not more current speed"
- **0:38** — "Submarine ridges transfer momentum to the solid Earth"
- **0:45** — "Full ACC simulation → link in bio"

## End Card
Final 3 seconds: polar view with eddies spinning, teal current belt. **"CodedLaws — Southern Ocean"** text.

## Audio
Deep wind-swept drone, 55 BPM. Swirling eddy SFX at each vortex formation. No voiceover.

## Production Notes
Renderer: quasi-geostrophic 2-layer model (Python/PyQG). Wind stress τ = 0.2 N/m² at peak westerlies. Eddy saturation reproduced from Straub (1993) mechanism. Form stress: p_bot · ∂h/∂x integrated over ridges. Baroclinic instability growth rate σ ≈ 0.1 day⁻¹. Domain: circumpolar 360° × 60° latitude, resolution 0.1°. Output 1080×1920, 60 fps.
