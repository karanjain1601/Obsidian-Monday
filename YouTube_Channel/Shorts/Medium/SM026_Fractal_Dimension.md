---
title: "Fractal Dimension — Box Counting"
id: SM026
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fractal, dimension, box-counting, measurement]
---

> **What it is:** A ~45-second simulation short overlaying a shrinking grid on a Koch snowflake to count occupied boxes at each scale, deriving a non-integer fractal dimension that quantifies how rough a boundary is between a line and a plane. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Fractal Dimension — Box Counting

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A Koch snowflake glows white on black. A blue grid overlays it — the grid shrinks, revealing more and more detail of the fractal's infinitely jagged boundary. The number of grid boxes touching the snowflake counts up rapidly in the corner: 12 → 48 → 192 → 768…

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Box counting procedure explained visually: grid size ε = 1, 1/2, 1/4, 1/8… Each grid shown as a blue lattice overlaid on the Koch snowflake. Boxes that contain any part of the fractal highlighted in gold. Count N(ε) shown for each ε.

**0:10–0:18** — Log-log plot of N(ε) vs 1/ε appears. Points fall on a perfect straight line. Slope = Hausdorff dimension D_f. For Koch snowflake: slope = log(4)/log(3) = 1.2619. Caption: "D_f = log(N)/log(1/ε) = 1.26 — between a line and a plane."

**0:18–0:27** — Three fractals compared: Koch snowflake (D=1.26), Sierpinski triangle (D=1.585), Menger sponge cross-section (D=1.893). Each shown with its log-log plot and slope. Caption: "Different fractals → different dimensions."

**0:27–0:36** — The Mandelbrot set boundary shown. Box counting on the boundary of the Mandelbrot set. Dimension D_f ≈ 2.0 — it fills the 2D plane (in the limit). Caption: "Mandelbrot boundary: D ≈ 2.0 — space filling."

**0:36–0:45** — Real-world application: coastline of Britain. Box-counting on the outline gives D ≈ 1.25 (close to Mandelbrot's original measurement). Caption: "Britain's coastline: D ≈ 1.25." Bold text: "Fractal dimension — nature's measure of roughness." Fade to black.

## Physics Concept Teased
Fractal dimension: for self-similar objects, the number of boxes N(ε) needed to cover the object scales as N ∝ ε^(-D_f), where D_f is the Hausdorff dimension. D_f need not be an integer — it quantifies how a fractal fills space between integer dimensions.

## On-Screen Text / Captions
- **0:00** — "How rough is this boundary?"
- **0:05** — "Box counting: N(ε) ∝ ε^(-D_f)"
- **0:12** — "Koch snowflake: D_f = log(4)/log(3) = 1.26"
- **0:20** — "Sierpinski: 1.585 | Koch: 1.26 | Menger: 1.893"
- **0:28** — "Mandelbrot boundary: D ≈ 2.0"
- **0:35** — "Britain's coastline: D ≈ 1.25"
- **0:43** — "Fractal dimension — nature's measure of roughness."

## End Card
Final 3 seconds: Koch snowflake with the box-counting grid at finest resolution. Text: "Benoit Mandelbrot coined 'fractal' in 1975." CodedLaws logo.

## Audio
Precise, mathematical electronic (85 BPM). Counting clicks as boxes are tallied. Voiceover at 0:00: "How do you measure the length of a coastline? The answer depends on how small your ruler is — that's fractal dimension." No other voiceover.

## Production Notes
Code complexity: low to moderate. Renderer: Canvas 2D. Key algorithm: Koch snowflake via L-system (F → F+F--F+F, 60° angle, 5 iterations). Box counting: for each ε, create an ε-spaced grid, hash which grid cells are occupied by the fractal boundary, count. Plot N(ε) vs 1/ε on log-log scale, fit a line to get slope. For animated overlay: animate ε decreasing from 1/4 to 1/128 with grid drawn over fractal. Runtime: real-time Canvas 2D.
