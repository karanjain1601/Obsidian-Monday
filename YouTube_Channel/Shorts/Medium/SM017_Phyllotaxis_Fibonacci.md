---
title: "Phyllotaxis — Sunflower Fibonacci Spiral"
id: SM017
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, phyllotaxis, fibonacci, golden-ratio, pattern-formation, biology]
---

> **What it is:** A ~45-second simulation showing seeds placed successively at the golden angle (137.5°) self-organizing into a double-spiral sunflower pattern with Fibonacci-number spiral counts — demonstrating how the most irrational number in nature produces optimal packing. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Phyllotaxis — Sunflower Fibonacci Spiral

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black canvas. A single golden seed appears at the centre. Then another, rotating by exactly 137.5° (the golden angle). Then another. By 3 seconds, 50 seeds have appeared and a strikingly perfect sunflower spiral pattern fills the screen — 13 spirals going one way, 21 going the other.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Seeds continue appearing, one per frame. n-th seed placed at: r = √n, θ = n × 137.5°. Each seed is a small warm-gold circle. Counter shows n = 100. The double-spiral pattern (13 CCW, 21 CW) is clearly visible as faint white lines connecting seeds.

**0:10–0:18** — Spirals highlighted: 13 spirals (going clockwise) lit up in red, 21 spirals (going counter-clockwise) in blue. Annotation: "13 and 21 — consecutive Fibonacci numbers." Fibonacci sequence shown: 1, 1, 2, 3, 5, 8, 13, 21, 34…

**0:18–0:27** — What happens with a different angle? Slider shows angle changing from 137.5° to 138°. The spiral pattern immediately becomes messy — seeds clump into radial spokes. Back to 137.5°: perfect spirals. Caption: "Only the golden angle gives spirals — not radial lines."

**0:27–0:36** — Mathematical connection: 137.5° = 360°/φ² where φ = (1+√5)/2 (golden ratio). Show: φ = 1.618... appears as most irrational number. Text: "Most irrational → optimal packing." Side panel: n = 300 seeds, perfect packing density.

**0:36–0:45** — Full sunflower view: 500+ seeds, photorealistic texturing with brown outer seeds and yellow inner florets. Bold text: "34 CW, 55 CCW — always Fibonacci." Zoom out to reveal a perfect sunflower. Fade to black.

## Physics Concept Teased
Phyllotaxis: plants place seeds (or leaves) at successive angles of 137.5° — the golden angle — because the golden ratio is the most irrational number, ensuring no two seeds ever end up in the same radial direction. The result: maximum packing efficiency and Fibonacci spiral counts.

## On-Screen Text / Captions
- **0:00** — "137.5° between each seed."
- **0:05** — "n-th seed: r = √n, θ = n × 137.5°"
- **0:13** — "13 CW spirals. 21 CCW spirals. Both Fibonacci."
- **0:20** — "Change the angle — packing fails."
- **0:28** — "Golden angle = 360°/φ² — most irrational number"
- **0:38** — "34 CW, 55 CCW — always consecutive Fibonacci"
- **0:44** — "Phyllotaxis — nature's optimal packing."

## End Card
Final 3 seconds: photorealistic sunflower head with spiral guides overlaid. Text: "Every sunflower. Every pine cone. Same mathematics." CodedLaws logo. CTA: "What's your favourite Fibonacci number? Comment below."

## Audio
Warm, positive acoustic-electronic hybrid (90 BPM). Soft guitar pluck each time a seed appears (quickening). Voiceover at 0:00: "Plants don't know mathematics — but the golden angle forces Fibonacci spirals to appear." Brief musical chord when the sunflower is revealed at 0:36.

## Production Notes
Code complexity: low. Renderer: Canvas 2D or p5.js. Key algorithm: trivially simple — for(let n=0; n<N; n++) { r = sqrt(n)*scale; theta = n*goldenAngle; draw circle at polar (r, theta). } Golden angle = 2π(1 - 1/φ) = 2.399963 rad = 137.508°. For spiral highlighting: precompute which seeds belong to each Fibonacci spiral by checking modular arithmetic. Runtime: real-time, trivially fast.
