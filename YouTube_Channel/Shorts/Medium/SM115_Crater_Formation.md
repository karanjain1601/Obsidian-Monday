---
title: "Crater Formation — Hypervelocity Impact"
id: SM115
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Impact_Cratering_Full]]"
difficulty: medium
tags: [physics, simulation, short, planetary-science, impacts, shockwaves, geology]
---

> **What it is:** A ~45-second simulation short of a 1-km iron asteroid striking at 20 km/s, driving a Mach 50 shockwave that vaporizes rock and excavates a 20-km complex crater complete with a rebounding central peak and an expanding ejecta curtain. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Impact_Cratering_Full]]

# Short: Crater Formation — Hypervelocity Impact
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 1-kilometer iron asteroid screams into the frame at 20 km/s. It hits the ground. The screen goes white. When the flash clears — 3 seconds later — a bowl-shaped cavity 20 km across is forming, and a curtain of molten rock and superheated steam is already climbing into the stratosphere.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Cross-section view of impact sequence. Impactor (orange sphere) contacts the target rock. A hemispherical shockwave (bright red) expands from the contact point faster than sound — Mach 50+. Impactor is obliterated in milliseconds. Peak pressure: 100 GPa — enough to vaporize rock. Pressure label flashes.
- **0:10–0:18:** Excavation flow: the crater grows. The Hugoniot equations govern the shock-compressed rock state. A red central hemisphere of vaporized/melted rock (the "melt zone") surrounded by a larger brown shell of shock-fractured rock ("fractured zone"). Flow field arrows show material moving outward and upward along the cavity walls.
- **0:18–0:28:** The transient crater cavity reaches maximum depth (~10 km) and diameter (~20 km). Cavity walls are unstable — they collapse inward. Central uplift: a column of rock at the center bounces upward due to elastic rebound, forming a central peak. Gravity controls this stage. Peak formation shown in bright white against dark crater walls.
- **0:28–0:38:** Ejecta curtain expands outward — an inverted cone of debris leaving the crater at ~1–2 km/s at the base, thinning with distance. Ejecta blanket laid down as continuous layer nearest crater, then discrete secondary craters from larger blocks landing further out.
- **0:38–0:45:** Final crater: a 20-km complex crater with central peak, flat floor, terraced walls. Overhead view. Scale bar: 20 km. Moon comparison: Tycho crater image (public domain) overlaid for 2 seconds.

## Physics Concept Teased
Hypervelocity impacts convert kinetic energy (½mv²) into shockwave energy almost instantaneously. The impact shockwave propagates at Mach 50+, pressures of 100 GPa. The Pi-scaling law relates crater diameter D to impactor size d and velocity: D ∝ d·(ρ_imp/ρ_targ)^{1/3}·g^{-0.22}·v^{0.44}. The three stages — contact, excavation, modification — each have distinct physics and timescales.

## On-Screen Text / Captions
- **0:00:** "1 km of iron. 20 km/s. This is what happens."
- **0:05:** "Peak pressure: 100 GPa — rock becomes vapor"
- **0:12:** "Shockwave expands at Mach 50"
- **0:20:** "Transient crater: 10 km deep"
- **0:28:** "Ejecta curtain at 1 km/s"
- **0:35:** "Central peak rebounds from elastic rebound"
- **0:42:** "Final crater: 20 km across, 2 km deep."

## End Card
Final 3 seconds: overhead view of final complex crater with central peak, side-by-side with Tycho crater on the Moon. Text: "The Moon's face is a history of impacts." Channel logo.

## Audio
Complete silence for the first 0.5 seconds of impact (in space, no sound). Then a massive boom and rumble as the shockwave emerges (atmospheric effects). Building low-frequency earthquake rumble throughout. Voiceover (stark, clipped): "Contact. Excavation. Modification. Three phases in three minutes." Crater rim collapse: thunderous slumping sound at 0:18.

## Production Notes
Code complexity: complex. Renderer: WebGL. Key algorithm: 2D axisymmetric SPH (Smoothed Particle Hydrodynamics) or hydrocode in (r,z) geometry. Equation of state: Tillotson EOS for granite and iron (accounts for melting/vaporization). Strength model: elastic-perfectly plastic with Drucker-Prager yield criterion for rock. Resolution: ~50,000 SPH particles. Impactor/target interface: soft-sphere contact at t=0. Crater scaling: use Pi-group scaling laws (Holsapple 1993) to verify final crater size. Gotcha: Tillotson EOS has a complex form with 9 material parameters — use tabulated values for granite and iron. Gravity must be included for the modification stage. Pre-render at 1000 fps, play back at 60 fps for slow-motion effect.
