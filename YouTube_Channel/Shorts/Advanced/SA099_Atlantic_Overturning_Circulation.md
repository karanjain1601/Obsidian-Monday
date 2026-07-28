---
title: "Atlantic Meridional Overturning: Thermohaline Instability"
id: SA099
type: youtube-short
duration: "~45 seconds"
feeds_video: "AMOC Collapse: The Thermohaline Tipping Point"
difficulty: advanced
tags: [physics, simulation, short, advanced, amoc, thermohaline, ocean-circulation, tipping-point, climate]
---

> **What it is:** A ~45-second simulation showing the Atlantic Meridional Overturning Circulation weakening in a climate model as freshwater input reduces the North Atlantic salinity gradient and slows thermohaline-driven overturning toward a tipping point. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** AMOC Collapse: The Thermohaline Tipping Point

# Short: Atlantic Meridional Overturning — Thermohaline Instability

**Feeds full video:** AMOC Collapse: The Thermohaline Tipping Point

## Visual Hook (First 3 Seconds)
Atlantic Ocean cross-section from pole to pole. A great river of warm red water flows north on the surface; a cold navy blue river flows south along the deep floor. Both streams pulse. Then the red stream slows, turns grey. A red alarm icon: **"AMOC weakening."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Meridional cross-section of Atlantic: 60°S to 80°N on x-axis, 0–5000 m depth on y-axis. AMOC rendered as two conveyor belts: surface current red (25°C, 1 Sv = 10⁶ m³/s arrows), North Atlantic Deep Water navy (2°C, 15 Sv). Transport label: **"17 Sv (baseline)."**
- **0:10** — Deep water formation: North Atlantic dense water sinking at 60°N shown as downward red→blue gradient waterfall. Density equation overlay: ρ = ρ₀(1 − α·T + β·S); temperature (−α·T) dominates, making water heavy.
- **0:18** — Freshwater hosing perturbation: Greenland melt (light blue waterfall at 70°N) adds 0.1 Sv of fresh low-density water. Surface salinity drops: **"S: 35 → 33.5 PSU"**. Density falls; sinking rate reduces.
- **0:27** — AMOC transport graph (line chart overlay): starts at 17 Sv, declines to 8 Sv over 50 simulated years. Tipping point threshold (dashed red line at 5 Sv) approaches. Label: **"Hosing = 0.3 Sv → collapse."**
- **0:36** — Collapsed state: surface current (now grey, 0.5 m/s) barely moves. North Atlantic SST drops 5°C (blue patch at 50°N). European temperature anomaly overlay: −3°C across UK, Norway. Cold signal propagates poleward.
- **0:44** — Bifurcation diagram: x-axis = freshwater forcing F (0–0.5 Sv), y-axis = AMOC strength (0–20 Sv). Two stable branches (on/off) with hysteresis loop shown. Red dot on upper branch moves left toward fold point. Label: **"Hysteresis: collapse is hard to reverse."**

## Physics Concept Teased
AMOC is maintained by thermohaline density contrasts; freshwater input from melting ice reduces North Atlantic surface density, potentially triggering a saddle-node bifurcation that flips circulation from a strong 17 Sv state to a near-zero collapsed state — a transition with centuries of hysteresis.

## On-Screen Text / Captions
- **0:00** — "AMOC carries heat equal to 1.3 petawatts north"
- **0:10** — "Cold salty water sinks; warm surface water fills its place"
- **0:20** — "Add freshwater → density drops → sinking stops"
- **0:30** — "Past a threshold, AMOC collapses permanently"
- **0:38** — "Europe cools 3°C; hysteresis means no easy return"
- **0:45** — "AMOC tipping point physics → full video"

## End Card
Final 3 seconds: bifurcation diagram with red dot on the fold. **"CodedLaws — Ocean Circulation"** text.

## Audio
Deep oceanic bass drone, 50 BPM. Slow pulse SFX for each Sv of transport lost. Alarm tone at tipping point.

## Production Notes
Renderer: 2-box thermohaline model (Stommel 1961 + extensions, Python). Buoyancy flux: B = α·Q/(ρ·Cp) − β·F·S₀. Bifurcation traced by quasi-static freshwater increase dF/dt = 0.001 Sv/yr. Full 3D GFDL-type geometry for teleconnection panel. Hysteresis loop confirmed numerically with sweep up and sweep down. Output 1080×1920, 60 fps.
