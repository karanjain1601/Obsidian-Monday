---
title: "Ejecta Curtain — Impact Debris Cone"
id: SM116
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Impact_Cratering_Full]]"
difficulty: medium
tags: [physics, simulation, short, planetary-science, impacts, fluid-dynamics, ballistics]
---

> **What it is:** A ~45-second simulation short of a post-impact ejecta curtain expanding as a shimmering 45-degree cone of ballistic debris, with particles sorted by ejection speed and a graded ejecta blanket deposited outward to fields of secondary craters. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Impact_Cratering_Full]]

# Short: Ejecta Curtain — Impact Debris Cone
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
The moment after a crater impact: a perfect inverted cone of debris — particles streaming outward and upward like a frozen fountain — expands from the impact point. The cone's surface shimmers as millions of particles catch sunlight, all following identical ballistic arcs that form the curtain's geometry.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Side-view of the growing ejecta curtain at t=5 seconds after impact. The curtain surface is a thin cone of particles moving outward along the "Z-model" excavation flow: velocity v_ej ≈ C·(r/R)^{-m} where r is crater radius and m≈2. Near the crater rim: fast, low-angle ejecta (velocity ~2 km/s, angle ~45°). Further out: slower, steeper ejecta.
- **0:10–0:18:** Particle color-coded by ejection velocity — fast = white, slow = red-orange. The curtain wall angle is ~45° from horizontal, steepening with time. The curtain "eye" (inner void) grows as material excavates outward. Debris size sorting shown: large boulders at the top of the curtain (ejected last at lower velocities), fine dust at the base (ejected first at higher velocities).
- **0:18–0:28:** Ejecta overturn: curtain continues to expand. Material at each radius hits the ground at a predictable distance: landing range x = v²·sin(2θ)/g. A parabolic landing zone is marked with dashed arcs. The ejecta blanket accumulates — thick near the rim, thin further out. Secondary crater fields appear as boulders land at 5–20 crater radii.
- **0:28–0:38:** Zoom to secondary craters forming: a large ejecta block (~50m across) hits the surface at ~500 m/s and carves a secondary crater ~200m across. Multiple secondary impacts in sequence. Herringbone ridges (ray patterns) pointing back toward the primary crater appear between secondary fields.
- **0:38–0:45:** Scale context: for Chicxulub (K-Pg impactor, ~180 km crater), ejecta reached global coverage within hours. A globe slowly covered with ejecta layer shown in 3 seconds, darkening the sky.

## Physics Concept Teased
The ejecta curtain is a thin shell of material excavated from the growing crater and launched at nearly constant angle (~45°). The Maxwell Z-model describes the excavation flow field below the crater. Each ejecta fragment follows a ballistic trajectory under gravity. Size sorting within the curtain places the largest blocks at the top (lowest ejection velocity), landing furthest from the crater to form secondary craters and ray systems.

## On-Screen Text / Captions
- **0:00:** "Every impact is also a perfect physics demonstration."
- **0:08:** "Ejecta curtain: 45° cone, sorting by speed"
- **0:15:** "Fast ejecta → lands far. Slow ejecta → lands close."
- **0:22:** "Landing range: x = v²·sin(2θ)/g"
- **0:30:** "Secondary craters from falling boulders"
- **0:38:** "Chicxulub covered Earth in ejecta in hours."
- **0:44:** "Still visible as shocked quartz in the K-Pg layer."

## End Card
Final 3 seconds: the ejecta curtain at peak expansion — a shimmering gold cone against black space, secondary craters peppering the surface below. Text: "Every crater tells its own story." Channel logo.

## Audio
Rushing wind and debris sounds during curtain expansion. Voiceover (rapid-fire, energetic): "The ejecta knows exactly where to land — ballistics is ballistics." Staccato impacts for secondary craters at 0:28. Low bass rumble underneath throughout. Final: sudden silence when the motion stops.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D with WebGL particle system. Key algorithm: Maxwell Z-model excavation flow: stream function ψ = A·r^{-z} where z=3 (empirical). Each SPH or Monte Carlo particle's initial velocity drawn from v_ej(r) distribution with angular spread ±5°. Integrate ballistic trajectories: simple Euler under constant g. Particle count: 5000 for smooth curtain appearance. Color by speed (velocity → HSL hue: white=fast, red=slow). Landing detection: when y < y_terrain, mark secondary crater (store list, draw as crater marks). Gotcha: the Z-model only applies within the transient crater radius; material outside this zone is uplifted but not excavated. Show only the excavated zone for accuracy.
