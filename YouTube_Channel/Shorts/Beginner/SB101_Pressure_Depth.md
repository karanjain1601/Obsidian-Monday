---
title: "Pressure Increases With Depth"
id: SB101
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, fluid-mechanics, pressure, depth]
---

> **What it is:** A ~45-second simulation short where a glowing sensor sinks through a water column while a red pressure gauge needle sweeps from 0 to 4 ATM, revealing that hydrostatic pressure increases linearly by +1 ATM for every 10 meters of depth. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Pressure Increases With Depth
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A bright red analog pressure gauge occupies the right side of the screen; its needle points hard left at 0.00 ATM. To the left, a 400px-tall glass cylinder filled with deep-blue water sits against a black background. A white horizontal dashed line sits at the very top of the water. No narration — just the gauge needle twitching at zero.

## Main Visual Sequence (0:03–0:50)
**0:03** — A glowing yellow dot labeled "sensor" appears at the water surface (depth = 0 m). The gauge reads 0.00 ATM in bold white digits.

**0:08** — The sensor begins sinking smoothly downward at ~40px/s. A cyan depth readout in the top-left corner ticks upward: "Depth: 0.0 m → 1.0 m → 2.0 m…"

**0:14** — At depth 10 m, the gauge needle sweeps clockwise to 1.00 ATM. A bright white annotation line connects the sensor to the gauge readout. The cylinder darkens slightly in hue to signal greater depth.

**0:20** — Sensor reaches 20 m; gauge needle jumps to 2.00 ATM. The formula "P = ρgh" fades in at the top-center in yellow text. Each variable briefly highlights (ρ = 1000 kg/m³ flashes blue, g = 9.8 m/s² flashes green, h flashes white).

**0:28** — Sensor reaches 30 m; gauge = 3.00 ATM. Small horizontal force arrows (pointing inward from all sides of the sensor dot) grow longer with each meter of depth, visualizing the compressive pressure.

**0:36** — The sensor hits the bottom of the cylinder at 40 m; gauge needle swings to 4.00 ATM and glows orange-red. The cylinder walls briefly pulse outward as if under stress, then snap back.

**0:42** — Cut to split screen: left panel shows depth 0 m / 0 ATM (sensor at surface); right panel shows depth 40 m / 4 ATM (sensor at bottom). A bold "4×" label appears between them.

**0:47** — Both panels freeze. White text overlay: "Every 10 m deeper = +1 ATM." Screen holds for end card.

## Physics Concept Teased
Hydrostatic pressure increases linearly with depth according to P = ρgh, where ρ is fluid density, g is gravitational acceleration, and h is depth below the surface. Divers and submarines must account for this compressive force at every meter they descend.

## On-Screen Text / Captions
- **0:00** — "0.00 ATM" (gauge digital readout, white, bottom-right of gauge)
- **0:08** — "Depth: 0.0 m" (cyan, top-left; updates live)
- **0:20** — "P = ρgh" (yellow, top-center, stays on screen through 0:36)
- **0:36** — "4.00 ATM" (gauge readout glows orange)
- **0:44** — "4×" (bold white, center of split screen)
- **0:47** — "Every 10 m deeper = +1 ATM" (white bold, lower-center, holds to end)

## End Card
**0:47–0:50** — Black background. Channel logo "CodedLaws" top-center in white sans-serif. Below it: "Follow for more physics simulations." Gauge icon shrinks into the logo animation. No voiceover.

## Audio
Music: Low electronic ambient pulse, 80 BPM, builds tension as sensor descends. No voiceover. Sound effect: a soft mechanical click each time the gauge needle lands on a whole-number ATM value (1.00, 2.00, 3.00, 4.00). Final hit at 4.00 ATM is a louder, resonant clunk.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: map sensor Y-position linearly to pressure value; rotate gauge needle with `ctx.rotate(angle)` where angle = (pressure/maxPressure) * 150° sweep. Runtime: real-time. Gotcha: ensure gauge needle pivot is at center of gauge circle, not top-left of bounding box — use `ctx.translate(cx, cy)` before rotating.
