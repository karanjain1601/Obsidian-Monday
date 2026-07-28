---
title: "Phase Diagram: The Map of Matter"
id: SB154
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, thermodynamics, phase-transitions, states-of-matter]
---

> **What it is:** A ~45-second simulation short where a cursor moves across a vivid three-region pressure-temperature diagram and a small vial transforms between ice, liquid water, and steam as the cursor crosses each boundary — showing how pressure and temperature together determine the stable state of matter, including the triple point where all three coexist. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Phase Diagram: The Map of Matter
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A crisp phase diagram for water appears on a dark background — three boldly colored regions (blue = solid, green = liquid, orange = gas) separated by glowing white boundary curves. A bright white cursor dot moves across the diagram, and as it crosses each boundary, the substance in a small vial at the bottom-right transforms visually: ice melts, water boils, vapor condenses.

## Main Visual Sequence (0:03–0:50)
**0:03** — Phase diagram drawn on axes: X-axis = Temperature (0K → 1000K), Y-axis = Pressure (0.001 atm → 1000 atm, log scale). Three regions filled: solid (blue, top-left), liquid (green, center), gas (orange, right and bottom). Boundary lines: melting curve, boiling curve, sublimation curve. All labeled in white.

**0:10** — Triple point highlighted with a pulsing white dot at T=273.16K, P=0.00604 atm. Label: "Triple point — all three phases coexist." Three-arrow annotation shows solid, liquid, gas meeting at one point.

**0:18** — Critical point highlighted (red dot) at T=647K, P=218 atm. Label: "Critical point — liquid and gas become identical (supercritical fluid)." Supercritical region shown in pale purple beyond critical point.

**0:27** — Animated cursor traces a path: starts at solid region (0°C, 0.1 atm) → melting curve (ice melts at 0°C at 1 atm, vial shows ice→water) → boiling curve (water boils at 100°C, vial shows water→steam). Temperatures shown numerically as cursor moves.

**0:35** — Cursor drops below triple point (0.001 atm): now the solid→gas boundary is crossed directly. Sublimation shown: ice cube in vial disappears without liquid phase (like dry ice, like freeze-drying). Label: "Sublimation — solid to gas directly."

**0:43** — Compare with CO₂ phase diagram (triple point at −56.6°C, 5.1 atm) — at room pressure, CO₂ can only be solid or gas (dry ice!). CodedLaws logo.

## Physics Concept Teased
A phase diagram maps which state of matter (solid, liquid, or gas) is thermodynamically stable at each combination of temperature and pressure. The triple point is the unique P-T where all three phases coexist; above the critical point, the liquid-gas distinction disappears entirely.

## On-Screen Text / Captions
- 0:03 → "Pressure vs Temperature — matter's map"
- 0:10 → "Triple point: 273.16K, 0.006 atm"
- 0:18 → "Critical point: 647K, 218 atm"
- 0:27 → "Cross the line = phase change"
- 0:35 → "Low pressure → ice skips liquid phase"
- 0:43 → "CO₂ sublimates at room pressure"

## End Card
Final 3 seconds: Phase diagram with animated cursor slowly circling the triple point. Text: "One dot. Three phases. Perfect balance." CodedLaws subscribe.

## Audio
Calm, scientific ambient music, 65 BPM. Gentle phase-transition sound effects: cracking ice at 0:27 (melting), soft hiss at 0:27 (boiling), whisper of sublimation at 0:35. Voiceover: "Same substance — three different faces depending on pressure and temperature."

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: draw phase boundaries as Bezier curves fitted to real water data points; fill regions with color gradients; animate cursor position and update vial substance type based on which region the cursor is in; use particle animation (slow lattice for solid, flowing for liquid, fast random for gas) in the vial. Runtime: real-time. Gotcha: use a log-scale for pressure axis — linear scale compresses the interesting low-pressure region.
