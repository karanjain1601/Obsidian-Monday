---
title: "Yarkovsky Effect — Thermal Recoil on Asteroids"
id: SM112
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Asteroid_Dynamics_Full]]"
difficulty: medium
tags: [physics, simulation, short, astrophysics, asteroids, thermal-physics, orbital-mechanics]
---

> **What it is:** A ~45-second simulation short of a slowly rotating asteroid whose thermal lag shifts the warmest spot to its afternoon side, producing an asymmetric infrared photon recoil that quietly expands or shrinks its orbit depending on rotation direction. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Asteroid_Dynamics_Full]]

# Short: Yarkovsky Effect — Thermal Recoil on Asteroids
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A slowly rotating asteroid — dark grey, potato-shaped — hangs in space. The sunlit side glows warm amber. Then, as it rotates, the warmest spot shifts to the afternoon side. And from that warm trailing face, a faint jet of infrared photons streams away — invisibly, imperceptibly pushing the asteroid forward in its orbit.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Side view of an asteroid orbiting the Sun (Sun off-screen left). The asteroid rotates counterclockwise (prograde). Temperature distribution shown as a color field: deep blue on the night side, yellow-white on the sub-solar point, warm orange-red on the lagging "afternoon" side due to thermal lag.
- **0:10–0:18:** The thermal re-emission pattern visualized: photons leave the surface isotropically, but since the warm afternoon side (slightly behind the sub-solar direction) emits more flux, the net photon momentum is directed slightly opposite to orbital motion — no wait. For prograde rotation: warm side is ahead of sub-solar → net emission in direction opposite to orbital velocity → recoil in direction of orbital motion → orbit expands. Animated photon streams (gold arrows) show this asymmetry.
- **0:18–0:28:** Orbital drift animation: the asteroid's orbital path (dotted) slowly spirals outward over thousands of years. A second asteroid with retrograde rotation shown spiraling inward. Text: "Direction depends on rotation sense." Toggle switch visual: prograde/retrograde, showing both cases.
- **0:28–0:38:** Scale of the effect: drift rate for a 1-km asteroid: ~15 km per orbit per year. Apophis shown as an example: Yarkovsky shift must be measured for accurate impact prediction. A radar measurement schematic shows the precise ranging needed to detect this tiny effect.
- **0:38–0:45:** The kinetic impactor / DART mission connection: we must know the Yarkovsky rate to predict where an asteroid will be in 100 years. DART spacecraft (public domain image) briefly shown. Text: "DART's mission depended on knowing this effect."

## Physics Concept Teased
The Yarkovsky effect is a non-gravitational force on rotating bodies from anisotropic thermal emission. Solar heating warms the sunlit side; thermal lag means the warmest point is offset from the sub-solar point in the rotation direction. This offset produces an asymmetric photon recoil force that accelerates or decelerates the orbit depending on rotation direction. Over millions of years it is a major driver of asteroid orbital evolution and critical for impact risk assessment.

## On-Screen Text / Captions
- **0:00:** "A warm rock in space is a rocket — powered by sunlight."
- **0:08:** "Thermal lag: afternoon side is warmest"
- **0:15:** "Infrared emission pushes prograde → orbit expands"
- **0:23:** "Retrograde rotation → orbit shrinks"
- **0:30:** "Drift: ~15 km per year for a 1-km asteroid"
- **0:38:** "We must measure this to predict impacts."
- **0:44:** "Yarkovsky, 1900. Confirmed for Golevka, 2003."

## End Card
Final 3 seconds: the slowly drifting asteroid against a star field, faint amber glow on trailing side. Text: "A quiet force reshaping the solar system." Channel logo.

## Audio
Quiet, contemplative ambient — slow string quartet, very sparse. Voiceover (thoughtful, deliberate): "Light has momentum. And when sunlight warms a rock unevenly, that rock quietly steers itself across the solar system." Faint infrared crackle sound effect when the asteroid emits (0:10).

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: Asteroid surface divided into N latitude×longitude patches. Each patch absorbs solar flux based on Sun angle and emits thermal radiation. Thermal inertia Γ = √(kρc) introduces a phase lag between absorption and emission. Steady-state surface temperature T(θ,φ) solved via 1D heat conduction ∂T/∂t = κ∂²T/∂z². Net force = -(2/3)·(1/c)·∑_i A_i·σT_i⁴·n̂_i (where n̂_i is outward surface normal). Orbital evolution: update semi-major axis each period using ΔE = F·v_orb·T_period. Gotcha: the thermal lag phase is key — for a rapidly rotating asteroid the effect averages out; for slow rotation the diurnal Yarkovsky is weaker. Show both limits.
