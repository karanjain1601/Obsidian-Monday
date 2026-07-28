---
title: "Heat That Explodes"
id: SB022
type: youtube-short
duration: "~45 seconds"
feeds_video: "Why Heat Spreads in Code Exactly Like Ink in Water"
difficulty: beginner
---

> **What it is:** A ~45-second simulation short where a glowing thermal hot spot spreads outward in smooth concentric color rings until a single timestep slider pushes past the stability threshold, instantly erupting the grid into a violent checkerboard of boiling red and freezing blue cells, exposing the hidden stability condition of the explicit heat diffusion equation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Why Heat Spreads in Code Exactly Like Ink in Water

# Short: Heat That Explodes

**Feeds full video:** Why Heat Spreads in Code Exactly Like Ink in Water
**Duration:** ~45 seconds

---

## Visual Hook (First 3 Seconds)
A thermal camera view of a 2D grid. A bright hot spot in the center — vivid red/orange — surrounded by cool blue. Heat spreading smoothly, like ink diffusing in water. Correct and beautiful.

## Main Visual Sequence (0:03–0:45)
**Beat 1 (0:03–0:10):** Stable heat diffusion. "dt = 0.01." Hot center spreading outward in smooth concentric rings of color. "STABLE." Text: "HEAT MOVES FROM HOT TO COLD."
**Beat 2 (0:10–0:18):** Timestep slider shown. dt doubles: "dt = 0.02." Faster, still stable. dt = 0.04. Still smooth. "STILL STABLE."
**Beat 3 (0:18–0:24):** dt pushed to 0.06 — past stability threshold. The smooth gradient ERUPTS into a violent checkerboard of alternating boiling red and freezing blue pixels. "dt TOO LARGE."
**Beat 4 (0:24–0:30):** Freeze on checkerboard. "THIS CELL: 1000°C. NEIGHBOR CELL: -500°C." Heat went the wrong direction. Physics violated. Grid cells highlighted: odd/even alternating impossibly.
**Beat 5 (0:30–0:38):** dt pulled back to stable. Checkerboard disappears. Smooth diffusion returns. "THE SAME EQUATION. A SLIGHTLY DIFFERENT dt. TWO DIFFERENT UNIVERSES."
**Beat 6 (0:38–0:45):** "Why does making the timestep bigger sometimes make everything wrong?" Stability condition shown: "dt ≤ Δx² / (2D)."

## Physics Concept Teased
The explicit finite-difference heat equation has a strict stability condition — if dt exceeds Δx²/(2D), the solution oscillates wildly with neighboring cells bouncing between extreme temperatures.

## On-Screen Text / Captions
- "dt = 0.01 → 0.02 → 0.04 → 0.06" (slider counter)
- "STABLE." (green, Beats 1–2)
- "dt TOO LARGE." (red, Beat 3)
- "THIS CELL: 1000°C. NEIGHBOR: -500°C." (Beat 4)
- "dt ≤ Δx² / (2D)" (stability condition)

## End Card
Full video: "Why Heat Spreads in Code Exactly Like Ink in Water" — link in bio. The diffusion equation has a secret.

## Audio
Gentle warm ambient during stable diffusion. Building tone as dt increases. At explosion: harsh crackling/static. Silence after freeze. Warmth returns with stability. Audio temperature matches visual temperature.

## Production Notes
Aspect ratio: 9:16. Frame rate: 60fps. Heat map: thermal colormap (blue→green→yellow→orange→red). Grid: 64×64 cells, each clearly visible. dt slider on right. Explosion: perfectly alternating red/blue hard edges — not smooth gradients. Grid lines visible throughout. The contrast between smooth gradients and the checkerboard is the entire story.
