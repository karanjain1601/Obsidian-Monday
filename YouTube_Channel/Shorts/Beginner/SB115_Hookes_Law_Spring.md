---
title: "Hooke's Law: Springs Always Push Back"
id: SB115
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, hookes-law, spring]
---

> **What it is:** A ~45-second simulation short where weights are added one by one to a hanging coil spring, each addition stretching it further while a live F-vs-x graph plots data points that fall perfectly on a straight line through the origin, confirming the linear restoring force F = kx that defines Hooke's Law. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Hooke's Law: Springs Always Push Back
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A bright steel-blue coil spring (10 coils, 40px wide, 200px tall at natural length) hangs vertically from a ceiling anchor on a black background. A gray mass block (60×40px) labeled "0.5 kg" hangs from its bottom. The spring is at its natural length — no stretch. A red downward arrow labeled "F = 0 N" and an upward green arrow labeled "Spring force = 0 N" both appear at the mass. Both are tiny. Then a hand adds weight.

## Main Visual Sequence (0:03–0:50)
**0:03** — An additional weight is placed on the mass: now 1.0 kg total. The spring stretches downward 50px. The red "Weight" arrow grows to match the new force (W = 9.8 N). The green "Spring force" arrow grows upward to 9.8 N. Label: "x = 50px = 0.1 m stretch."

**0:08** — A live F vs. x graph appears in the bottom-right quadrant (200×150px). As the spring is stretched, a blue dot plots on the graph. The dot is at (0.1 m, 9.8 N). Label: "F = kx → k = 98 N/m."

**0:14** — More weight added: 2.0 kg. Spring stretches to 100px (0.2 m). Graph plots a second point (0.2 m, 19.6 N). A straight blue line connects both points through the origin. Label: "Linear relationship — Hooke's Law."

**0:20** — Even more weight: 3.0 kg. Spring stretches 150px (0.3 m). Graph plots third point (0.3 m, 29.4 N). The line continues through origin. The formula "F = kx" appears in gold at the top-center. "k = 98 N/m (spring constant)" appears below in white.

**0:26** — The weight is released (mass set to 0 kg instantly). The spring shoots back to natural length — the mass bounces upward, overshoots, comes back, oscillates. The spring is shown compressed (coils close together, spring height = 120px) and stretched alternately.

**0:32** — Animation of simple harmonic oscillation: the mass bobs up and down. A position vs. time plot appears at the bottom: a clean sine wave. Labels: "T = 2π√(m/k)" and "T = 0.45 s" for m = 1 kg, k = 98 N/m.

**0:38** — The spring constant k is changed to 200 N/m (stiffer spring, shown as tighter coils). Same mass, same stretch: frequency increases. Side-by-side: soft spring (slow oscillation) vs. stiff spring (fast oscillation). Labels: "Soft spring: slow | Stiff spring: fast."

**0:44** — Zoom out to show the original F vs. x graph complete with all three data points and the straight line. Bold annotation: "slope = k = 98 N/m." The graph title: "Hooke's Law: every spring has a k."

**0:47** — Freeze. Bold white text: "F = kx. The bigger the stretch, the bigger the pushback."

## Physics Concept Teased
Hooke's Law states that the restoring force of an ideal spring is directly proportional to its extension or compression from its natural length: F = kx, where k is the spring constant (stiffness, in N/m). This linear relationship holds within the elastic limit of the spring. Beyond this limit, the spring deforms permanently and Hooke's Law no longer applies.

## On-Screen Text / Captions
- **0:03** — "x = 0.1 m" (white, displacement arrow), "W = 9.8 N ↓" (red), "Spring = 9.8 N ↑" (green)
- **0:08** — "k = 98 N/m" (blue, graph label)
- **0:14** — "Linear relationship — Hooke's Law." (white, below graph)
- **0:20** — "F = kx" (gold, top-center), "k = 98 N/m (spring constant)" (white, below formula)
- **0:26** — "Spring released — oscillation begins." (white italic, top-left)
- **0:32** — "T = 2π√(m/k)" (gold, below time plot), "T = 0.45 s" (white)
- **0:38** — "Soft spring: slow | Stiff spring: fast" (white, split comparison labels)
- **0:44** — "slope = k = 98 N/m" (white, graph annotation)
- **0:47** — "F = kx. The bigger the stretch, the bigger the pushback." (bold white, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — springs are everywhere."

## Audio
Music: Light bouncy electronic melody, 90 BPM, synced loosely to the spring oscillation rhythm. Sound effects: a boing when mass is released; a metallic twang for each weight addition. No voiceover.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: draw the spring as a series of diagonal line segments alternating left-right (zigzag coil pattern); compute segment endpoints from (cx, top) to (cx, top + current_length) by dividing into N = 10 coils with alternating ±offset_x. Scale the number of pixels per coil to current_length / N. For SHM: update mass Y with y(t) = A·cos(ωt + φ) where ω = sqrt(k/m). Runtime: real-time. Gotcha: when the spring is compressed, coils will overlap if spacing is not clamped — set a minimum coil height of 5px to prevent the spring drawing from degenerating.
