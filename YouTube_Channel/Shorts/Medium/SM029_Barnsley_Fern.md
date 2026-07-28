---
title: "Barnsley Fern — Iterated Function System"
id: SM029
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fractal, ifs, barnsley-fern, affine-transform]
---

> **What it is:** A ~45-second simulation short building a botanically accurate fern from thousands of randomly placed dots by applying just four affine matrix transformations, showing how an iterated function system encodes infinite fractal detail in four numbers. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Barnsley Fern — Iterated Function System

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black canvas. A single green dot appears at the origin. Then another. And another. In 3 seconds, 500 dots have appeared and they form the unmistakable outline of a fern leaf — emerald green against black, perfect in its botanical detail, built entirely from random dot placement.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The four affine transformations shown as equations in a table: f1 (stem, prob 1%), f2 (leaflets, prob 85%), f3 (left leaflet, 7%), f4 (right leaflet, 7%). Each one shown as a 2×2 matrix acting on (x,y). Counter: 1,000 dots placed. The fern outline sharpens.

**0:10–0:18** — At 5,000 dots: the fern is fully recognisable. Each transformation's contribution highlighted separately: green = f2, red = f1, yellow = f3, blue = f4. The stem (red) is a thin vertical line. Each leaflet colour coded.

**0:18–0:27** — Zoom into the tip of the fern: the same fern shape appears, scaled. Zoom into that fern tip: same fern again. Caption: "Self-similar at all scales — IFS attractor."

**0:27–0:36** — Compare with a real fern photograph. The match is striking — real fern venation pattern, leaflet shape, and overall silhouette match the IFS output. Caption: "Four numbers capture nature's geometry." Overlay the IFS fern on the photo at 50% opacity: they align nearly perfectly.

**0:36–0:45** — Show other IFS attractors: a tree (6 transforms), a maple leaf (5 transforms), the Sierpinski triangle (3 transforms). Each grows from dots in a few seconds. Bold text: "IFS — infinite complexity from finite data." Fade to black.

## Physics Concept Teased
Iterated Function System (IFS): a set of affine contractions (scaling + rotation + translation). The attractor — the unique set invariant under all contractions — is a fractal. For the Barnsley fern, 4 affine maps with specific coefficients produce a perfect fern shape. The fractal dimension of the fern is D ≈ 1.9.

## On-Screen Text / Captions
- **0:00** — "4 affine transforms. Applied randomly."
- **0:05** — "f1: stem (1%); f2: leaflets (85%)"
- **0:12** — "5,000 dots — a perfect fern"
- **0:20** — "Self-similar: zoom in → fern reappears"
- **0:28** — "Four numbers capture a real fern's geometry"
- **0:35** — "Tree, maple, Sierpinski — all IFS attractors"
- **0:43** — "Infinite detail from 4 matrices."

## End Card
Final 3 seconds: 50,000-dot Barnsley fern, deep emerald on black. Text: "Michael Barnsley, 1988 — image compression via IFS." CodedLaws logo. CTA: "The coefficients are in the description — try your own IFS."

## Audio
Warm, organic acoustic-electronic (75 BPM). Rustling leaves sound effect as dots accumulate. Voiceover at 0:00: "Apply four random matrix transforms to a dot over and over — it draws a fern." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: chaos game — start at (0,0); at each step, pick one of 4 affine maps with given probabilities; apply it; plot the dot. Barnsley coefficients (from the book): f1=[0,0,0,0.16,0,0], f2=[0.85,0.04,-0.04,0.85,0,1.60], f3=[0.20,-0.26,0.23,0.22,0,1.60], f4=[-0.15,0.28,0.26,0.24,0,0.44]. Map (x,y) to canvas coordinates: scale by 50, offset to centre. Plot each point as a 1-pixel green dot (or 2×2 for visibility). At 50,000 dots/second the fern renders in < 1 second. Runtime: real-time, trivially fast.
