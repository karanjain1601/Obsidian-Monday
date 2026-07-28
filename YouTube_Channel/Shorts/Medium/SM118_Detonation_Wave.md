---
title: "Detonation Wave — Chapman-Jouguet Condition"
id: SM118
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Combustion_Physics_Full]]"
difficulty: medium
tags: [physics, simulation, short, combustion, shockwaves, thermodynamics, explosives]
---

> **What it is:** A ~45-second simulation short of a coupled shock-reaction detonation front propagating through explosive gas at the unique Chapman-Jouguet velocity, with the ZND internal structure of shock, induction zone, and exothermic reaction zone revealed at 10,000x magnification. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Combustion_Physics_Full]]

# Short: Detonation Wave — Chapman-Jouguet Condition
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A tube of explosive gas — glowing faintly blue-white under pressure — ignites at one end. A slow orange flame moves rightward. Then the flame suddenly accelerates, couples with its own shockwave, and the combined detonation front screams through the tube in a single brilliant flash, 50 times faster than the flame started.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** 1D tube cross-section (horizontal). Left end: igniter (spark). Fuel-oxidizer mixture (hydrogen-oxygen, shown as faint cyan background). The deflagration wave (orange, subsonic flame front) moves right at 10 m/s. Temperature profile behind: burnt gas shown in red, unburnt ahead in blue. Pressure spike: modest.
- **0:10–0:18:** The flame accelerates (Deflagration to Detonation Transition shown briefly, pointing to SM119). Now: a detonation wave — the shockwave (sharp white line) couples to the reaction zone (orange-red glow, ~1 mm thick). Together they move at CJ velocity: v_CJ = 2840 m/s for H₂-O₂. Label appears.
- **0:18–0:28:** Chapman-Jouguet diagram: pressure vs. specific volume Hugoniot curve drawn on a side graph. The Rayleigh line (straight line from initial state through the detonation state) shown in red. The CJ point is where this line is tangent to the Hugoniot — the unique solution where the detonation wave is self-sustaining. Labels: strong detonation (above CJ), weak detonation (below, non-physical).
- **0:28–0:38:** ZND structure zoom-in: the detonation front is not a thin discontinuity. Zoom to the detonation front (10,000× magnification). Structure: leading shockwave (white), induction zone (blue — heat and species diffuse, no reaction), exothermic reaction zone (orange glow, energy release). Labels: shock compression, induction length ~ λ_react.
- **0:38–0:45:** 3D cellular detonation structure: the front is not flat — it has regular diamond-shaped cells stamped on a soot foil (shown as a grey panel with soot track pattern). Real soot foil image (public domain) flashed for 1 second. Cell size λ = 10–40 mm for H₂-O₂ mixture.

## Physics Concept Teased
A detonation wave is a coupled shock-reaction system that propagates at the Chapman-Jouguet (CJ) velocity — the unique speed at which the Rayleigh line is tangent to the reactive Hugoniot. At this CJ point, the flow behind the detonation is exactly sonic relative to the wave front, making the wave self-sustaining and the fastest possible steady detonation. The internal ZND structure (Zel'dovich-von Neumann-Döring) reveals a finite induction zone between shock and reaction.

## On-Screen Text / Captions
- **0:00:** "The fastest chemical process on Earth — and physics controls exactly how fast."
- **0:08:** "Deflagration: 10 m/s. Detonation: 2840 m/s."
- **0:15:** "CJ velocity: the one speed that works"
- **0:22:** "Rayleigh line tangent to Hugoniot = CJ point"
- **0:30:** "ZND structure: shock → induction → reaction"
- **0:38:** "Detonation cells: the fingerprint of the explosion."
- **0:44:** "D. Chapman, E. Jouguet — 1899–1905."

## End Card
Final 3 seconds: the ZND structure diagram in cyan, orange, and white on black, with CJ point marked in gold. Text: "Physics sets the speed limit — even for explosions." Channel logo.

## Audio
Rising drone that peaks at detonation onset (0:10). Massive concussive blast effect at 0:10. Voiceover (urgent, clipped): "The shock needs the heat. The heat needs the shock. Together, they reach the one speed physics allows." Sustained rumble after detonation front passes.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D + p5.js. Key algorithm: 1D reactive Euler equations solved with operator splitting — advection (MUSCL-Hancock) then chemistry (stiff ODE: dcY/dt = ω_dot, where Y = fuel mass fraction, ω_dot = A·ρ·Y·exp(-E_a/RT)). CJ state computed analytically from thermodynamic relations: p_CJ = ρ₀·v_CJ²·(γ²-1)/(γ+1), T_CJ from energy balance. ZND induction length computed from reference: l_ind = v_CJ / max(ω_dot). Soot foil visualization: 2D simulation showing cellular structure from transverse instabilities (Markstein instability) — requires 2D reactive Euler on 512×128 grid. Gotcha: stiff chemistry requires implicit integration in the reaction zone; use CVODE or simple implicit Euler with subcycling.
