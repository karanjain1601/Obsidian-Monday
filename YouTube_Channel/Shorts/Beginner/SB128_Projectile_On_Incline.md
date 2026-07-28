---
title: "Projectile on a Slope: Tricky Physics"
id: SB128
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, projectile-motion, incline]
---

> **What it is:** A ~45-second simulation short where three cannonballs fired from a 30° grassy hill at different angles plant colored flags at different distances, and a live range-vs-angle graph peaks sharply at 30° above the slope — revealing that the optimal launch angle on an incline is 45° minus half the slope angle, not 45° from horizontal. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Projectile on a Slope: Tricky Physics
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Green grassy hill inclined at 30° fills the lower-left of a pale-blue sky background. A bright orange cannonball launches from the hilltop. Three trajectories arc outward in rapid succession — yellow, orange, red — landing at different distances on flat ground below. A bold question: **"Which angle goes farthest? (It's NOT 45°)"**

## Main Visual Sequence (0:03–0:50)
**0:03** — Scene establishes: dark green inclined plane (angle labeled **"β = 30°"**, yellow arc at base) on a light blue background with tan flat ground at the bottom-right. Cannon at top-left of slope (grey rectangle). Launch angle selector (white arc with handle) visible at the cannon. Initial speed label: **"v₀ = 20 m/s"** (white).

**0:08** — First shot: angle α = 15° above the slope (total angle from horizontal = 45°). Yellow trajectory arc drawn in real time — ball (orange, radius 8 px) follows parabola, lands on flat ground. Landing point marked with a yellow flag and distance label: **"R₁ = 28.3 m"**.

**0:14** — Second shot: angle α = 30° above the slope (total = 60°). Orange trajectory arc, wider and higher parabola. Lands farther. Orange flag: **"R₂ = 32.1 m"**.

**0:20** — Third shot: angle α = 45° above the slope (total = 75°). Red trajectory arc, very steep. Lands shorter than second shot. Red flag: **"R₃ = 28.7 m"**. Pause. Audience expectation subverted — 30° above slope won, not 45° above slope.

**0:26** — Comparison callout: all three flags visible with colored range labels. Arrow highlights the orange flag as the winner. Bold text box: **"Optimal angle = 45° − β/2 = 45° − 15° = 30° above slope"**. Formula shown: **"α_opt = π/4 − β/2"** (white on dark overlay).

**0:31** — Slider animation: the launch angle slider sweeps continuously from 0° to 90° above slope, plotting range R on a live graph (white axes bottom-left, range R on y-axis, angle α on x-axis). The curve peaks at exactly 30° above slope — green dot marks the peak.

**0:36** — Zoom into the graph. The peak is highlighted with a gold starburst. Text: **"Maximum range on β=30° slope: 30° above slope."** The flat-ground case (β=0°) is overlaid as a dotted white curve, peaking at 45° — for contrast.

**0:40** — Side-by-side comparison (two cannonballs firing simultaneously): left on flat ground with 45° launch (long horizontal range), right on 30° slope with 30°-above-slope launch (comparable range but different trajectory shape). Both land at same time. Labels: **"Flat: α=45°"** and **"Slope: α=30° above slope"**.

**0:44** — Final text frame: **"On a slope, the optimal angle shifts. Formula: α = 45° − β/2."**

## Physics Concept Teased
When a projectile is launched from an inclined surface, the optimal launch angle (measured from the slope) for maximum range is not 45° from horizontal but 45° minus half the slope angle — derived by rotating the coordinate frame to align with the incline.

## On-Screen Text / Captions
- **0:00** — "Which angle goes farthest? (It's NOT 45°)" (bold white on sky)
- **0:03** — "β = 30°, v₀ = 20 m/s" (labels, yellow/white)
- **0:08** — "α = 15° above slope → R = 28.3 m" (yellow flag)
- **0:14** — "α = 30° above slope → R = 32.1 m ← WINNER" (orange flag, bold)
- **0:20** — "α = 45° above slope → R = 28.7 m" (red flag)
- **0:26** — "α_opt = 45° − β/2 = 30° above slope" (white formula, dark overlay)
- **0:36** — "Maximum range peaks at 30° above slope, not 45°" (graph annotation)
- **0:44** — "Slope changes everything. α = 45° − β/2." (center, bold white)

## End Card
Final 3 seconds: Slow-motion optimal trajectory arc (orange) replays on the slope. White text: **"Follow CodedLaws for more physics surprises."** Logo pulse.

## Audio
Music: Playful, curious ukulele loop at 0:00–0:25; brief suspense pause at 0:20 (flags all visible); triumphant guitar strum at 0:26 (formula reveal); upbeat resolution from 0:36 to end. No voiceover. Sound effects: cannon boom for each shot (slight reverb), swoosh of ball in flight, flag-plant thud on landing.

## Production Notes
Code complexity: Medium. Renderer: Canvas 2D. Key visual trick: rotate the entire coordinate system by β when computing projectile motion (decompose v₀ into x'=v₀cosα, y'=v₀sinα in the tilted frame, then apply g in tilted y direction). Alternatively, compute in standard x-y and determine landing by finding where trajectory intersects the incline line y = x*tan(β). Range formula: R = (2v₀²/g) * sin(α)*cos(α+β)/cos²(β). Slider animation: iterate α from 0° to 90° in 1° steps, compute R, draw smooth Bezier curve through points. Mark peak with a gold circle radius 6 px. Simultaneously fire two cannonballs at 0:40 by maintaining two independent (x,y,vx,vy) state vectors. Runtime: ~47 seconds. Gotcha: define "angle above slope" clearly in the code — α is measured from the slope surface, not the horizontal; total angle from horizontal is α+β.
