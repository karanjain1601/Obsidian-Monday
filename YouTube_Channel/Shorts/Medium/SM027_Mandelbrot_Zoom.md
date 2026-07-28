---
title: "Mandelbrot Zoom — Seahorse Valley"
id: SM027
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fractal, mandelbrot, complex-numbers, zoom]
---

> **What it is:** A ~45-second simulation short zooming from the full Mandelbrot set into Seahorse Valley to a magnification of 10^12, where spiraling arms and embedded mini-Mandelbrot copies reveal infinite self-similarity from the single rule z → z² + c. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Mandelbrot Zoom — Seahorse Valley

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
The iconic Mandelbrot set — black heart-shaped cardioid and bulbs — fills the screen. Ultra-high-contrast colouring: black interior, electric blue-gold exterior. The camera begins zooming into the narrow valley between the main cardioid and the period-2 bulb. In 3 seconds it's already deep inside a spiral valley.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Zoom continues into Seahorse Valley (coordinates near c = -0.745 + 0.113i). Swirling spiral arms appear — each arm bordered by tiny Mandelbrot copies. The colour gradient (smooth iteration count colouring) creates iridescent bands of blue, gold, magenta.

**0:10–0:18** — At magnification 10⁶ the spiral arms reveal embedded mini-Mandelbrot sets — perfect copies of the original. One mini-brot highlighted with a white circle. Caption: "Mini-Mandelbrot — infinite self-similarity."

**0:18–0:27** — Zoom into one mini-Mandelbrot. It has its own seahorse valleys, its own bulbs, its own embedded copies. The surrounding colour pattern is different but the topology is identical. Caption: "Magnification: 10⁹."

**0:27–0:36** — The zoom slows. A caption shows the iteration formula: z → z² + c. "Simple quadratic — infinite complexity." The escape time N for a pixel is its colour: smooth colouring via N + 1 - log₂(log|z|) for continuity. Caption: "Smooth colouring — no discrete bands."

**0:36–0:45** — Final zoom destination: a spiral of seahorse-tail spirals, each glowing in its own hue. Text shows total magnification: 10^12. Bold text: "The Mandelbrot set — infinite in every zoom." Fade to black.

## Physics Concept Teased
The Mandelbrot set: the set of complex numbers c for which z → z² + c does not diverge from z=0. Its boundary is infinitely complex — every zoom reveals new structure, mini-copies of the whole, and elaborate spiral ornaments. Fractal dimension of the boundary: D ≈ 2.0.

## On-Screen Text / Captions
- **0:00** — "z → z² + c — one rule."
- **0:03** — "Seahorse Valley — c ≈ -0.745 + 0.113i"
- **0:12** — "Mini-Mandelbrot — self-similar copy"
- **0:20** — "Magnification: 10⁹ — new detail appears"
- **0:28** — "Smooth colouring: N + 1 - log₂(log|z|)"
- **0:38** — "Magnification: 10^12"
- **0:44** — "Infinite complexity from z² + c."

## End Card
Final 3 seconds: the final zoom frame — a spectacular spiral. Text: "Computed with WebGL — real-time 60fps in your browser." CodedLaws logo. CTA: "Link to the interactive viewer in bio."

## Audio
Slowly building ambient electronic — starts sparse, gains layers as the zoom deepens (mirroring increasing complexity). Voiceover at 0:00: "One line of math. Zoom in forever. It never runs out of detail." Soft whoosh each time a new mini-Mandelbrot is spotted (~0:14, 0:22).

## Production Notes
Code complexity: moderate. Renderer: WebGL fragment shader. Key algorithm: for each pixel (px, py): c = (px-cx)/zoom + i*(py-cy)/zoom; z=0; iterate z=z²+c up to max_iter=1000; colour by smooth iteration count. Use double-precision emulation (vec2 arithmetic) for zoom levels below 10^8; beyond that use perturbation theory + series approximation for 64-bit-equivalent precision at any depth. Smooth colouring formula: iter + 1 - log2(log(|z|)). Seahorse Valley target: (-0.7453954, 0.1125668). Runtime: real-time WebGL at 60fps for zoom < 10^8; pre-rendered beyond.
