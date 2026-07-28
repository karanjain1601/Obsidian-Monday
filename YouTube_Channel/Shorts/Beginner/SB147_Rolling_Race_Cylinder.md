---
title: "Hollow vs Solid Cylinder: The Rolling Race"
id: SB147
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, moment-of-inertia, rotational-motion]
---

> **What it is:** A ~45-second simulation short where a solid silver cylinder and a hollow gold cylinder of identical mass are released down an inclined ramp and the solid wins decisively — showing that moment of inertia, not mass, determines rolling speed by dictating how much energy goes into rotation versus translation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Hollow vs Solid Cylinder: The Rolling Race
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Two identical-looking cylinders sit side by side at the top of a red inclined ramp (angle 20°). They are released simultaneously. The solid silver cylinder accelerates quickly and reaches the bottom first by a wide margin, while the hollow gold cylinder lags noticeably behind — even though they have the same mass and radius.

## Main Visual Sequence (0:03–0:50)
**0:03** — Ramp shown full screen (20° incline, red surface, 600px long). Left cylinder: solid silver disc labeled "SOLID — I = ½MR²." Right cylinder: hollow gold ring labeled "HOLLOW — I = MR²." Both sit at top. Mass and radius labels: M = 1 kg, R = 5 cm (identical for both).

**0:10** — Release. Both cylinders begin rolling. Solid cylinder moves noticeably faster. After 0.5 seconds of simulation time, the solid is 30% further down the ramp. Rotation indicators (arrows curving around each cylinder) show the hollow spinning faster (must rotate faster to keep up).

**0:18** — Energy breakdown panel (two bars side by side, updating live):
- Solid: 66% translational KE (green) + 33% rotational KE (orange).
- Hollow: 50% translational KE (green) + 50% rotational KE (orange).
Label: "Solid stores less energy as spin — goes faster!"

**0:27** — Solid cylinder crosses the finish line at bottom. Time shown: 1.84 s. Hollow cylinder arrives at 2.00 s. Difference annotation: "+8.7% longer for hollow." Acceleration formulas:
- Solid: a = g·sinθ / (1 + I/MR²) = g·sinθ / 1.5
- Hollow: a = g·sinθ / 2.0

**0:35** — Twist: same experiment with a sphere (I = 2/5 MR²) added. Sphere wins over the solid cylinder! Order: sphere → solid cylinder → hollow cylinder. Ranking shown.

**0:43** — Text: "Mass doesn't matter. Shape matters." Visual shows two solid cylinders of different masses — tie! CodedLaws logo.

## Physics Concept Teased
When rolling without slipping, the total kinetic energy is split between translation and rotation. An object with more of its mass at the rim (higher moment of inertia) stores more energy as rotation, leaving less for downhill speed — so a hollow cylinder always rolls slower than a solid one of equal mass.

## On-Screen Text / Captions
- 0:03 → "Same mass. Same radius. Who wins?"
- 0:10 → "Solid cylinder pulls ahead!"
- 0:18 → "Solid: 33% rotational energy vs Hollow: 50%"
- 0:27 → "Solid: 1.84s — Hollow: 2.00s"
- 0:35 → "Sphere wins them all!"
- 0:43 → "Shape beats mass every time"

## End Card
Final 3 seconds: Three rolling shapes on ramp (sphere, cylinder, hollow cylinder) with ranking 1-2-3 badges. Text: "Moment of inertia decides." CodedLaws subscribe button.

## Audio
Competitive sports-style upbeat music, 110 BPM. Crowd cheer sound at 0:27 when solid crosses finish line. Voiceover: "Same mass, same size — but shape decides the winner." No other voiceover.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: animate each cylinder's x-position using a = g·sinθ/(1 + I/MR²) and integrate for position; draw rotation angle proportionally to arc length traveled. Live bar chart driven by computed KE values. Runtime: real-time. Gotcha: ensure rolling-without-slipping constraint is maintained; add static friction label so viewers know the ramp isn't frictionless.
