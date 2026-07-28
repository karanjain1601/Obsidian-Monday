---
title: "Madden-Julian Oscillation: Tropical Convective Envelope"
id: SA097
type: youtube-short
duration: "~45 seconds"
feeds_video: "The MJO: Earth's 30-Day Weather Heartbeat"
difficulty: advanced
tags: [physics, simulation, short, advanced, mjo, madden-julian, tropical-convection, atmospheric-dynamics, weather]
---

> **What it is:** A ~45-second simulation showing the Madden-Julian Oscillation simulated as a convective envelope propagating eastward across the Indian and Pacific Oceans on a 30-60 day timescale modulating global tropical rainfall. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** The MJO: Earth's 30-Day Weather Heartbeat

# Short: Madden-Julian Oscillation — Tropical Convective Envelope

**Feeds full video:** The MJO: Earth's 30-Day Weather Heartbeat

## Visual Hook (First 3 Seconds)
Equatorial belt of Earth, flattened to a 360°×30° latitude strip. A massive pulsing orange-red convective cloud cluster (2000 km wide) glows over the Indian Ocean and crawls slowly eastward. White text: **"The atmosphere has a heartbeat."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Mercator strip: 60°S–60°N, full 360° longitude. OLR (outgoing longwave radiation) false color: warm = grey (clear sky), cold = bright orange (deep convection). MJO envelope = orange blob centered at 75°E, width 40° of longitude.
- **0:10** — Zonal-vertical cross-section overlay: ascending motion (red vectors, up to 5 cm/s) in convective region, descending (blue vectors) 180° away in the suppressed zone. Low-level wind convergence arrows feed into the convective core.
- **0:18** — Wave structure: Kelvin wave component (purple) races ahead of the convective envelope at 50 m/s; Rossby wave gyres (cyan spirals) lag behind, propagating westward at 8 m/s. Envelope itself moves east at **"5 m/s"**.
- **0:27** — MJO phase wheel diagram (8 sectors, color-coded): current position = phase 3 (Indian Ocean). Phase labels: Maritime Continent (phase 4–5), Western Pacific (phase 5–6). Probability bars for US precipitation anomaly shown below.
- **0:36** — Envelope crosses Maritime Continent (Indonesia), weakens (grey patch forms), then re-amplifies over Western Pacific — characteristic barrier effect. Amplitude: **"OLR anomaly: −35 W/m²"** to −20 to −40 W/m².
- **0:44** — Full 45-day cycle time-lapse: orange blob traverses Indian → Pacific → weakens, reforms. Counter: **"Phase speed: 5 m/s | Period: 45 days."** Global impacts panel: Hurricane boxes flash blue (reduced) and red (enhanced) across regions.

## Physics Concept Teased
The MJO is a coupled convective-dynamic mode that propagates eastward at 5 m/s around the equatorial belt — the leading Kelvin wave modulates surface winds 2–3 weeks ahead, making the MJO the premier source of extended-range weather predictability.

## On-Screen Text / Captions
- **0:00** — "One weather pattern controls global chaos"
- **0:10** — "MJO: a 2000 km convective envelope drifts east"
- **0:20** — "Kelvin wave leads; Rossby gyres trail"
- **0:30** — "Phase 3 or 6? Check the week's forecast"
- **0:38** — "45-day cycle — the longest predictable signal"
- **0:45** — "Full MJO simulation → bio"

## End Card
Final 3 seconds: equatorial phase wheel spinning, all 8 sectors lighting up in sequence. **"CodedLaws — Tropical Climate"** text.

## Audio
Warm tropical synth pulse, 72 BPM. Distant thunder rumble synchronized to convective peak. No voiceover.

## Production Notes
Renderer: linearized Matsuno-Gill model (Python/SciPy). Kelvin and Rossby components separated via meridional projection. MJO envelope: super-imposed convective feedback Qc = α·q (moisture anomaly). Maritime Continent barrier: surface flux reduction 40%. OLR computed via Stefan-Boltzmann with cloud-top temperature offset. Output 1080×1920, 60 fps.
