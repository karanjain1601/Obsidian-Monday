---
title: "Newton's Fractal — Root Finding Basins"
id: SM028
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fractal, newton-method, complex-numbers, numerical-methods]
---

> **What it is:** A ~45-second simulation short colouring the complex plane by which cube root of unity Newton's root-finding method converges to from each starting point, producing a stunning three-coloured fractal mosaic with infinitely intricate boundaries. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Newton's Fractal — Root Finding Basins

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black canvas erupts into a three-coloured fractal mosaic — electric blue, vivid red, bright green — with intricate swirling boundaries between regions. In 3 seconds the image is fully rendered: a stunning stained-glass fractal symmetric under 120° rotation.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Newton's method explained: z_{n+1} = z_n - f(z_n)/f'(z_n). Used to find roots of f(z) = z³ - 1 in the complex plane. The three cube roots of unity (1, e^{2πi/3}, e^{4πi/3}) shown as white dots on the unit circle. Each starting point converges to one of the three roots — coloured accordingly.

**0:10–0:18** — Boundaries between the basins of attraction shown as black lines. Zoom in: the boundaries are fractal — no matter how close you zoom, the three colours continue to intersperse with infinite complexity. Caption: "Fractal boundary — three-colour Wada property."

**0:18–0:27** — Colour intensity encodes convergence speed: bright = fast convergence (few Newton steps), dark = slow (many steps). The slowest-converging points (darkest) cluster near the fractal boundary. Graph: histogram of iteration counts.

**0:27–0:36** — Change to a degree-4 polynomial: z⁴ - 1. Four roots. Four basins of attraction. The fractal now has fourfold symmetry. Then z⁵ - 1 → five-fold. Each polynomial produces a different symmetric fractal. Caption: "Degree n polynomial → n basins."

**0:36–0:45** — Non-symmetric polynomial: f(z) = z³ - 2z + 2. Roots at different positions. The fractal is not symmetric — chaotic distribution of colours. Bold text: "Newton's fractal — where numerical methods become art." Fade to black.

## Physics Concept Teased
Newton fractal: for polynomials in the complex plane, Newton's root-finding method partitions the plane into basins of attraction — one per root. The boundaries between basins are fractal (the Julia set of the Newton iteration map). Near the boundaries, the method is chaotic — a small change in starting position changes which root is found.

## On-Screen Text / Captions
- **0:00** — "Newton's method — find the root of z³ - 1."
- **0:05** — "z → z - f(z)/f'(z) — iterated in the complex plane"
- **0:12** — "Fractal boundary — three-colour Wada property"
- **0:20** — "Dark = slow convergence near the boundary"
- **0:28** — "z⁴ - 1: four basins, fourfold symmetry"
- **0:35** — "Asymmetric polynomial → asymmetric fractal"
- **0:43** — "Newton's fractal — where maths becomes art."

## End Card
Final 3 seconds: zoom into Newton fractal boundary showing infinite three-colour interspersing. Text: "Same algorithm used in real root-finding software — but usually converges fast away from boundaries." CodedLaws logo.

## Audio
Shimmering, crystalline ambient (70 BPM, vibraphone-like tones). Voiceover at 0:00: "Apply Newton's root-finding method to complex numbers and the result is a fractal of infinite detail." Transition sound when changing polynomials (~0:28, 0:35).

## Production Notes
Code complexity: low to moderate. Renderer: Canvas 2D or WebGL fragment shader. Key algorithm: for each pixel: map to complex c; iterate z = z - f(z)/f'(z) up to 50 iterations; colour by which root was reached (within tolerance 1e-6). Colour shading by convergence speed. For z³-1: f'(z) = 3z². Three roots: 1, (-1+i√3)/2, (-1-i√3)/2. WebGL fragment shader processes all pixels simultaneously for real-time rendering. Runtime: near-instant in WebGL, ~5 seconds in pure JavaScript for 1000×1000 grid.
