---
title: "Bore — Tidal Wave in a Channel"
id: SM097
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, tidal-bore, shallow-water, surfers, wave-propagation]
---

> **What it is:** A ~45-second simulation short where a wall of churning white water races upstream through a calm river as a moving hydraulic jump, demonstrating how tidal resonance in a funnel-shaped estuary generates bores ranging from undular ripples to the 9-metre Qiantang River surge. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Bore — Tidal Wave in a Channel

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A river channel viewed from the side. The water is calm, flowing gently downstream. At 2 seconds, around the corner comes a wall of water — the tidal bore. A nearly vertical front of churning white water advances upstream against the river's current, pushing the river back.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Bore dynamics: a bore is a moving hydraulic jump. In the bore's frame of reference, it's identical to a stationary hydraulic jump — with upstream conditions Fr₁ > 1. The bore speed: C = U₁ ± √(g·h₂·(h₁+h₂)/(2h₁)) — from the Rankine-Hugoniot condition. Caption: "Bore = moving hydraulic jump. Speed C from RH conditions."

**0:10–0:18** — Bore types: (1) Weak bore (Fr < 1.7): undular bore — a series of undular waves, no white water. (2) Strong bore (Fr > 2.5): turbulent bore — nearly vertical front with violent turbulence. Both shown in simulation. Caption: "Fr < 1.7: undular (smooth waves). Fr > 2.5: turbulent (white wall)."

**0:18–0:27** — Famous bores: (1) Severn Bore (UK) — twice-daily tidal bore, up to 2m high. (2) Qiantang River Bore (China) — up to 9m high, fastest bore on Earth at 40 km/h. (3) Amazon Pororoca — 800 km inland. Caption: "Qiantang: 9 m high, 40 km/h — surfable bore." Show surfers riding it.

**0:27–0:36** — Simulation of the Severn Bore: 1D shallow-water simulation showing the bore propagating upstream. As it passes, water level rises from h₁=2m to h₂=4m. The bore carries energy extracted from tidal forcing. Shown with tide gauge data comparison. Caption: "Severn: h rises from 2m to 4m as bore passes."

**0:36–0:45** — Tidal resonance: the Severn estuary is ~500 km long — its natural resonance period ≈ 12 hours, matching the tidal forcing period. This resonance amplifies the tidal range (14.5m — largest in UK) and creates the bore. Caption: "Resonance: estuary length = quarter tidal wavelength." Bold text: "Tidal bore — tides becoming a river wave." Fade to black.

## Physics Concept Teased
A bore is a moving hydraulic jump — a sharp water-surface discontinuity propagating upstream (or in the same direction as the tidal surge) through a channel. It forms when tidal forcing has high tidal range and a funnel-shaped estuary. The bore speed and height ratio follow from Rankine-Hugoniot conditions applied to the shallow-water equations.

## On-Screen Text / Captions
- **0:00** — "A wall of water advancing upstream."
- **0:05** — "Bore = moving hydraulic jump — RH conditions"
- **0:12** — "Undular bore (Fr<1.7) vs. turbulent bore (Fr>2.5)"
- **0:20** — "Qiantang River: 9 m, 40 km/h — surfers ride it"
- **0:28** — "Severn: h₁=2m → h₂=4m as bore passes"
- **0:35** — "Resonance: estuary = quarter tidal wavelength"
- **0:43** — "Tidal bore — tides becoming a river wave."

## End Card
Final 3 seconds: the Severn Bore — a wall of white water advancing up the river with spectators watching from the banks. Text: "The Amazon Pororoca bore is surfed for up to 37 minutes — a world record." CodedLaws logo.

## Audio
River ambient (calm), then growing rumble of the bore approach, then roaring white water. Voiceover at 0:00: "A tidal bore is a hydraulic jump that moves — and the same Rankine-Hugoniot equations describe both." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: 1D shallow-water equations with tidal forcing at the open (estuary) boundary. Bore naturally forms when the tidal amplitude is sufficiently large relative to mean water depth. RH conditions: C·(h₂-h₁) = h₂U₂ - h₁U₁; C(h₂U₂-h₁U₁) = h₂U₂²+gh₂²/2 - (h₁U₁²+gh₁²/2). Bore type: check Fr₁ = (C-U₁)/√(gh₁). Undular vs turbulent: add energy dissipation for strong bores. Real data overlay (Severn tide gauge): downloadable from NERC/BODC. Runtime: real-time Canvas 2D.
