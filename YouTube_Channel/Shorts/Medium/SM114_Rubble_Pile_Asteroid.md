---
title: "Rubble Pile Asteroid — Aggregate Dynamics"
id: SM114
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Asteroid_Structure_Full]]"
difficulty: medium
tags: [physics, simulation, short, astrophysics, asteroids, granular-dynamics, N-body]
---

> **What it is:** A ~45-second simulation short of a 300-boulder gravity-bound aggregate that deforms rather than shatters under impact, loses ejecta at near-zero escape velocity, and tidally disrupts into a streaming debris train when a planetary Roche limit is crossed. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Asteroid_Structure_Full]]

# Short: Rubble Pile Asteroid — Aggregate Dynamics
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A boulder — grey, jagged — plunges into a pile of rubble in space. Instead of shattering, the rubble pile deforms like a slow fluid, rippling, reshaping, and then settling into a new lumpy equilibrium. The asteroid absorbed the impact without breaking. It is held together by nothing but gravity and friction.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Establishing shot: an irregularly shaped rubble pile (300 spheres of varying sizes, grey to beige) floating in space against a star field. Self-gravity holds it together. A slow rotation (period ~8 hours). The aggregate structure visible — no solid surface.
- **0:10–0:18:** Impactor introduced: a single 10m boulder (red sphere) incoming at 10 m/s — gentle by planetary standards. It contacts the surface. Instead of penetrating hard rock, it sinks into the aggregate. The rubble grains around impact site scatter in slow motion (no air resistance — each grain follows ballistic trajectories).
- **0:18–0:28:** Ejecta dynamics in low gravity: scattered grains fly outward, but most are moving below escape velocity (v_esc = √(2GM/R) ≈ 0.2 m/s for a 100m asteroid). They arc back and re-accrete. Only a few fast-moving grains escape. The crater slowly fills in as grains avalanche down the slope — no crater rim survives.
- **0:28–0:38:** Tidal disruption test: a massive planet approaches (shown as a gradient at screen edge). Roche limit radius: r_Roche = R_p·(2M_p/M_ast)^{1/3} label. When the asteroid crosses the Roche limit, tidal forces exceed self-gravity — the rubble pile stretches, develops a neck, and sheds its outer layers into a tidal stream of dispersed boulders.
- **0:38–0:45:** Reconsolidation: tidal stream slowly recollapses under gravity into a new, slightly smaller rubble pile. Text: "This is what Shoemaker-Levy 9 looked like before it hit Jupiter." A quick SL9 image (public domain) flashed.

## Physics Concept Teased
Rubble pile asteroids — like Bennu, Ryugu, and Itokawa — are aggregates of boulders held together by self-gravity alone, with negligible tensile strength. They respond to impacts by deforming rather than fracturing, and they are tidally disrupted inside planetary Roche limits. Their granular nature controls impact cratering, rotation stability, and survival in the inner solar system.

## On-Screen Text / Captions
- **0:00:** "No solid rock. Just a pile of rubble held together by gravity."
- **0:08:** "300 boulders. Self-gravity. No glue."
- **0:15:** "Impactor sinks in — no crater holds"
- **0:23:** "Escape velocity: 0.2 m/s — a gentle throw escapes"
- **0:30:** "Roche limit: tidal forces win → it comes apart"
- **0:38:** "This happened to Shoemaker-Levy 9."
- **0:44:** "Bennu and Ryugu are rubble piles. We landed on them."

## End Card
Final 3 seconds: slow-motion rubble pile gently spinning in space, individual boulders visible. Text: "A pile of rubble that has existed for 4.5 billion years." Channel logo.

## Audio
Very quiet, soft ambient — space silence broken only by very low sub-bass hum of self-gravity. Voiceover (understated, impressed): "This asteroid is essentially a bag of rocks. Floating in space. For four billion years." Subtle granular shuffling sound during impact and avalanche.

## Production Notes
Code complexity: complex. Renderer: three.js (3D) or Canvas 2D. Key algorithm: N-body with contact physics — use a soft-sphere Discrete Element Method (DEM). Each sphere has radius r_i, mass m_i. Forces: self-gravity (all pairs, O(N²) or with Barnes-Hut tree), contact normal force (Hertz contact: F_n = k_n·δ^{3/2}), tangential (Mindlin friction: F_t ≤ μ_s·F_n). Time integration: leapfrog with dt ~ 1s for a 100m asteroid. N=300 spheres, polydisperse radii. Gotcha: DEM timestep must resolve the highest contact frequency — use dt < T_contact = 2π√(m/k_n). Roche disruption: add an external tidal acceleration a_tidal = -2(GM_p/d³)·x·x̂ for each grain. Pre-render the full simulation, play back at real-time.
