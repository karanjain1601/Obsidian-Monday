---
title: "YORP Spin-Up — Asteroid Rotation from Radiation"
id: SM113
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Asteroid_Dynamics_Full]]"
difficulty: medium
tags: [physics, simulation, short, astrophysics, asteroids, thermal-physics, rotation]
---

> **What it is:** A ~45-second simulation short of an irregular asteroid torqued by asymmetric solar thermal re-emission, spinning up from a 12-hour to a 2.2-hour period until equatorial boulders become weightless and stream off into a debris ring that may form a binary asteroid. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Asteroid_Dynamics_Full]]

# Short: YORP Spin-Up — Asteroid Rotation from Radiation
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
An irregular, lumpy asteroid — more like a badly shaped potato than a sphere — slowly rotates in sunlight. Then it visibly speeds up. Faster. Faster. The day-night cycle blurs. In a geological blink, it is spinning so fast that boulders lift off the equator and stream into space.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** 3D-rendered irregular asteroid shape (inspired by Itokawa or Bennu — lumpy, concave, bifurcated). Sunlight from the left. Surface temperature field shown as HSL gradient. The key visual: surface facets at different angles re-emit photons in directions that don't cancel — asymmetric torque.
- **0:10–0:18:** Torque visualization: each lit surface facet shown with a small force arrow (photon recoil). Arrows on facets angled away from the rotation axis contribute to spin-up (green arrows); those working against spin are in red. Net torque ≠ 0 due to shape asymmetry — red/green don't balance. Torque equation: dω/dt = τ_YORP/I shown.
- **0:18–0:28:** Time-lapse of spin-up over 10,000 years (compressed). Rotation period decreases: starts at 12 hours, passes through 6, 3, 1.5 hours. A clock graphic in the corner unwinds. At critical period ~2.2 hours for a 500m asteroid, the centrifugal force equals surface gravity at the equator — shown as a balance scale tipping.
- **0:28–0:38:** Mass shedding begins: small boulders (simulated as grey spheres, 20 particles) lift off the equatorial ridge, streaming off in all directions. The equatorial ring of ejecta forms a temporary dust torus around the asteroid. Some material re-accrete; some escapes. This may form asteroid binaries.
- **0:38–0:45:** Binary formation: two lobes of the now-disrupted asteroid slowly separate and begin co-orbiting. Text: "~15% of near-Earth asteroids are binaries — YORP may explain many of them." Real Didymos-Dimorphos binary system image (DART mission, public domain) flashed.

## Physics Concept Teased
YORP (Yarkovsky-O'Keefe-Radzievskii-Paddack) is a torque on a rotating irregular body from anisotropic thermal re-emission. Unlike the Yarkovsky effect (which changes orbital energy), YORP changes spin rate and obliquity. Over millions of years it can spin up an asteroid to the breakup limit (~2.2 hours for rubble piles), causing mass shedding, binary formation, and reshaping of the asteroid population.

## On-Screen Text / Captions
- **0:00:** "Sunlight is spinning this asteroid to destruction."
- **0:08:** "Asymmetric shape → asymmetric torque"
- **0:15:** "dω/dt = τ_YORP / I"
- **0:23:** "Period: 12 hrs → 2.2 hrs over 10,000 years"
- **0:30:** "At 2.2 hrs: equatorial boulders become weightless"
- **0:38:** "Mass shedding may create asteroid binaries."
- **0:44:** "Dimorphos — Didymos's moon — formed this way."

## End Card
Final 3 seconds: the binary asteroid pair slowly co-orbiting in silhouette against a star field. Text: "One asteroid becomes two — no collision required." Channel logo.

## Audio
Rhythmic spinning sound that accelerates in pitch as the rotation speeds up. Voiceover (energetic, building): "Sunlight, reshaping the solar system one rock at a time." Explosive crackle when mass shedding begins at 0:28. Triumphant minor-key electronic cue when the binary forms.

## Production Notes
Code complexity: complex. Renderer: three.js (3D). Key algorithm: Discrete YORP torque calculation — import a mesh (OBJ file of Itokawa shape model, publicly available from ISAS). For each triangle face: compute outward normal n̂, solar illumination condition, equilibrium temperature T = [F_sun·cos(θ)/σ]^{1/4}. Torque dτ = (2/3c)·σT⁴·A·(n̂ × r̂_cm) summed over all lit faces. Integrate ω(t) with Euler method. Gotcha: concave surfaces can shadow each other — implement ray-shadow check for each face (expensive; precompute for each solar angle). For mass shedding: add test particles on equatorial surface, check if ω²r > g_surface each timestep, release if true.
