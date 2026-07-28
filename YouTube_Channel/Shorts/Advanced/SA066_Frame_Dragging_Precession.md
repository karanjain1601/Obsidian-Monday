---
title: "Frame Dragging — Geodetic and Lense-Thirring Precession"
id: SA066
type: youtube-short
duration: "~45 seconds"
feeds_video: "Frame Dragging: How Rotating Mass Warps Spacetime"
difficulty: advanced
tags: [physics, simulation, short, advanced, general-relativity, frame-dragging, Lense-Thirring, precession]
---

> **What it is:** A ~45-second simulation showing a gyroscope in circular orbit around a spinning Kerr mass accumulating combined Lense-Thirring and geodetic precession angles over many orbits. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Frame Dragging: How Rotating Mass Warps Spacetime

# Short: Frame Dragging — Geodetic and Lense-Thirring Precession

**Feeds full video:** Frame Dragging: How Rotating Mass Warps Spacetime

## Visual Hook (First 3 Seconds)
A blue Earth rotates at center. Around it, a gold gyroscope (bright golden disc, 60 px diameter) orbits in a polar orbit. After one orbit, the gyroscope's spin axis (white arrow) has precessed by a visible angle — 6.6 arcseconds/year shown as a deflection arrow. Text: "Gravity Probe B confirmed: 6,601.8 ± 18.3 mas/yr."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Two types of precession displayed side by side: Left: Geodetic (de Sitter) precession — caused by motion through curved spacetime. Formula: Ω_geo = (3/2)(GM/rc²)·(v/r) = 6,606 mas/yr for a 642 km orbit. Right: Lense-Thirring (frame-dragging) — caused by Earth's rotation. Formula: Ω_LT = (GJ)/(c²r³) = 39.2 mas/yr. The geodetic effect is 168× larger.

**0:10–0:18** — The spacetime curvature visualization: the Kerr metric for slowly rotating Earth is shown as a warped grid. Far from Earth: flat grid lines. Near Earth: grid compressed radially (geodetic curvature). Around the polar regions: grid lines twist in the direction of Earth's spin (Lense-Thirring frame drag). The twist magnitude is color-coded: bright cyan at poles, fading toward equator.

**0:18–0:26** — Gravity Probe B timeline animation: the spacecraft launches in 2004, enters polar orbit at h = 642 km. Four quartz gyroscopes (shown as gold spheres arranged in a diamond) each measure their spin direction continuously. After 1 year: geodetic drift measured at 6,601.8 mas/yr (gold arrow, left), Lense-Thirring measured at 37.2 mas/yr (cyan arrow, pointing east). Results match GR to 0.28% and 19% respectively.

**0:26–0:34** — The Lense-Thirring effect for extreme rotation: a neutron star (shown as a compact white sphere, R = 10 km, M = 1.4 M_☉, J/Jmax = 0.3) surrounded by the twisted spacetime grid. A test particle orbiting at r = 20 km experiences Ω_LT = 1.2×10⁴ rad/s — the orbit itself precesses with that angular frequency. The entire orbital plane is dragged around the neutron star.

**0:34–0:42** — The LAGEOS satellite test: two LAGEOS satellites (gold dots) in circular orbits, with their orbital planes slowly precessing. The predicted Lense-Thirring precession for LAGEOS: 30.6 mas/yr. Measured: 31.5 ± 4 mas/yr. The orbital elements (right ascension of ascending node Ω) are plotted vs year — a gentle linear slope matching GR.

**0:42–0:50** — Final visual: a Kerr black hole (a = 0.998M, maximal spin) surrounded by a wildly twisted spacetime grid. Circular photon orbits (prograde at r = 1.08M, retrograde at r = 4.0M) traced in gold and cyan — vastly different radii due to extreme frame dragging. Text: "Kerr photon sphere: asymmetric by 3.7M." Fade to CodedLaws logo.

## Physics Concept Teased
Frame dragging is a prediction of general relativity in which a rotating mass drags the surrounding spacetime, causing gyroscopes and orbits to precess even without any force. The effect has two components: geodetic precession from spacetime curvature, and Lense-Thirring precession from the angular momentum of the source.

## On-Screen Text / Captions
- **0:00** — "Gravity Probe B: 6,601.8 ± 18.3 mas/yr confirmed"
- **0:06** — "Geodetic: 6,606 mas/yr | Lense-Thirring: 39.2 mas/yr"
- **0:12** — "Kerr metric: spacetime twists with Earth's spin"
- **0:20** — "GP-B: GR confirmed to 0.28% (geodetic)"
- **0:28** — "Neutron star: Ω_LT = 1.2×10⁴ rad/s at 20 km"
- **0:36** — "LAGEOS: 31.5 ± 4 mas/yr measured"
- **0:44** — "Kerr: prograde photon orbit at r=1.08M, retro at 4.0M"

## End Card
Final 3 seconds: the spinning Earth with gold gyroscope precession arrow and cyan Lense-Thirring arrow, CodedLaws logo overlaid. CTA: "Full video → Frame Dragging in GR."

## Audio
Smooth orchestral ambient at 80 BPM. Soft whoosh sound on each orbit. Satisfying ping when GP-B confirmation appears. No voiceover.

## Production Notes
Renderer: Three.js for Earth rotation and gyroscope orbit. Kerr metric grid distortion: custom GLSL vertex shader displacing grid plane vertices. Geodetic and LT precession rates computed analytically. Orbit integration: scipy Runge-Kutta for geodesic in Kerr metric. GP-B data comparison: Matplotlib time-series plot. 60 fps, 1080×1920.
