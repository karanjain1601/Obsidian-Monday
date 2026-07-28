---
title: "Planet Migration — Type I Disk Interaction"
id: SM108
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Planet_Formation_Full]]"
difficulty: medium
tags: [physics, simulation, short, astrophysics, orbital-mechanics, planet-formation, disk-dynamics]
---

> **What it is:** A ~45-second simulation short where a young planet embedded in a gas disk generates an asymmetric two-armed density wake at Lindblad resonances, producing a net inward torque that spirals the planet toward its star until a planet trap halts it. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Planet_Formation_Full]]

# Short: Planet Migration — Type I Disk Interaction
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A young planet — a glowing blue-green marble embedded in a swirling golden disk — sits at 3 AU from its star. It barely moves. Then the disk wakes up: waves of density ripple outward from the planet, and within seconds the planet is spiraling inward toward the star, dragged by its own gravitational wake.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Top-down disk view. A planet (blue circle, ~10 Earth masses) orbits at r=3 AU in a smooth gas disk. Its Hill radius r_H = r(M_p/3M★)^{1/3} shown as a dashed circle. The planet is too small to open a gap — Type I regime.
- **0:10–0:18:** Lindblad resonance visualization: concentric rings at resonant radii where the disk material interacts with the planet's orbital frequency. Inner Lindblad resonances (inside the planet's orbit) colored warm orange — they push the planet outward. Outer Lindblad resonances (outside) colored cool blue — they push the planet inward. Net torque imbalance → inward.
- **0:18–0:28:** Density wake pattern emerges: a two-armed density spiral winds through the disk — leading arm (underdense, blue-tinted) just inside the planet's orbit, trailing arm (overdense, orange) just outside. This asymmetric wake exerts a net negative torque on the planet.
- **0:28–0:38:** The planet migrates inward. An orbital spiral path traces the planet's trajectory — slowly tightening inward over 10,000 years (compressed to 5 seconds). Migration rate: da/dt ≈ -4.4·h^{-2}·(M_p/M★)·(Σr²/M★)·v_K label shown.
- **0:38–0:45:** The planet reaches the inner disk edge and stops — a planet trap. Relief moment. Context: "Hot Jupiters may have migrated from beyond 5 AU to 0.05 AU." Scale comparison shown.

## Physics Concept Teased
Type I migration occurs for planets too small to open a gap in their disk. Gravitational torques at Lindblad resonances create an asymmetric density wake: the outer wake is stronger, giving a net inward (negative) torque. Migration can be arrested at disk features like the dead zone inner edge or ice line where the torque reverses — called planet traps. This process shaped the architecture of every planetary system.

## On-Screen Text / Captions
- **0:00:** "The planet is falling — and the disk is dragging it in."
- **0:08:** "Type I migration: no gap, maximum drag"
- **0:15:** "Outer resonances win → net inward torque"
- **0:22:** "The density wake pulls the planet backward"
- **0:30:** "10,000 years of migration → 5 seconds"
- **0:38:** "Planet trap saves it at the inner edge."
- **0:44:** "This happened to every planet in our solar system."

## End Card
Final 3 seconds: the planet halts at the inner edge, glowing blue against the star's orange light. Text: "Where your planet stops depends on where the disk ends." Channel logo.

## Audio
Slow ambient electronic pad — subtle urgency. Voiceover (measured, slightly ominous): "The planet's own gravity is writing a check it can't cash. The disk is collecting." Gravitational wave-like bass thrum synced to migration onset at 0:18.

## Production Notes
Code complexity: complex. Renderer: WebGL. Key algorithm: 2D isothermal disk simulation (FARGO-like algorithm) — azimuthal advection treated with FARGO's sub-stepping to avoid CFL limit on fast Keplerian motion. Planet treated as a softened gravitational potential Φ = -GM_p/√(r²+ε²). Disk resolution: 256 (radial) × 512 (azimuthal) in polar coordinates. Planet orbit updated via N-body with disk torque back-reaction. Gotcha: indirect potential term (disk center-of-mass shift) must be included for accurate torque measurement. Resonance ring visualization: compute epicyclic frequency κ(r) and overlay resonant radii m(Ω_p - κ/m) = Ω_disk.
