---
title: "Bungee Cord: A Physics Energy Swap"
id: SB113
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, elasticity, energy]
---

> **What it is:** A ~45-second simulation short where a stick figure freefalls from a platform while three stacked bar charts — orange gravitational PE, green kinetic KE, and red elastic PE — continuously trade values, bottoming out at the cord's maximum stretch with KE at zero and elastic PE at 95%, demonstrating three-way energy conservation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Bungee Cord: A Physics Energy Swap
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A cartoon jumper (stick figure, white, 30px tall) stands on a platform 400px above the canvas floor. A thick red bungee cord (6px wide) connects the jumper's ankles to the platform. The cord is slack, coiled loosely. Below the platform, an abyss of dark blue-black. In the top-right corner, three energy bar charts are stacked:
  "PE" (orange, 100% full)
  "KE" (green, 0%)
  "Elastic PE" (red, 0%)
A bold "Ready…" text pulses white at the platform. The drop is imminent.

## Main Visual Sequence (0:03–0:50)
**0:03** — Jumper steps off the platform. Freefalls downward. The orange PE bar rapidly drains; the green KE bar rises fast. Elastic PE stays at 0%. The cord trails above, still slack.

**0:10** — Jumper falls 200px (half the platform height). PE = 50%, KE = 50%, Elastic PE = 0%. Speed label: "v = 14.1 m/s." The cord begins to stretch (it goes from coiled/slack to taut).

**0:16** — Cord becomes fully taut at 300px below platform (natural length reached). KE is at maximum (100%). PE is 25% (still some height left above ground). Elastic PE = 0. Label: "Cord engages — elastic stretching begins."

**0:22** — Cord begins stretching. Now energy splits three ways: as jumper continues descending, KE drops, Elastic PE rises sharply. PE continues to fall. The cord's color shifts from red → orange → yellow as tension increases (rubber under stress color shift). The cord's thickness visually doubles.

**0:28** — Jumper reaches lowest point — 380px below platform. KE = 0% (momentarily still). PE = 5%, Elastic PE = 95%. The cord is at maximum stretch. The jumper hangs for half a second. All three bars hold steady.

**0:34** — Cord recoils — jumper launched upward. KE rises; Elastic PE drops; PE rises. The energy sloshes back and forth. Jumper bounces back up 380px, nearly returning to starting height.

**0:38** — Slow-motion graph in bottom-right (100×80px): three colored lines (PE = orange, KE = green, Elastic PE = red) plotted vs. time. They form sinusoidal oscillations that interleave. Total (sum of all three) is a flat white horizontal line. Label: "Total = constant."

**0:44** — A "Damping ON" toggle activates. The jumper bounces with decreasing amplitude over 3 cycles. The white total-energy line slopes gently downward. A small "Heat" bar rises. Label: "Real cords lose energy to heat — that's why you stop bouncing."

**0:47** — Freeze at the lowest point. Bold white text: "Three types of energy. One swap. Total never changes."

## Physics Concept Teased
A bungee jump demonstrates a three-way energy conversion: gravitational potential energy (PE = mgh) converts to kinetic energy (KE = ½mv²) during the freefall, then to elastic potential energy (PE_elastic = ½kx²) as the cord stretches. At each turning point, one form is zero and the others are maximum, but their sum remains constant — a perfect demonstration of energy conservation.

## On-Screen Text / Captions
- **0:00** — "PE: 100% | KE: 0% | Elastic PE: 0%" (bar chart labels, right side)
- **0:10** — "v = 14.1 m/s" (white, beside jumper)
- **0:16** — "Cord engages — elastic stretching begins." (white italic, bottom-center)
- **0:28** — "Lowest point: KE = 0 | Elastic PE = max." (white annotation, right side)
- **0:34** — "Energy rebounds." (white, center)
- **0:38** — "Total = constant." (white, beside graph, on flat line)
- **0:44** — "Real cords lose energy to heat — that's why you stop bouncing." (white italic, bottom)
- **0:47** — "Three types of energy. One swap. Total never changes." (bold white, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — physics goes deep."

## Audio
Music: Dramatic orchestral build during freefall, drops to a tense low tone at the lowest point, then a relief swell as the jumper bounces back. Sound effects: rushing wind during descent; a deep elastic twang as the cord reaches maximum stretch. No voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: model the cord as a spring with rest length L₀ = 200px and spring constant k; above L₀, cord is slack (no force); below L₀, apply elastic restoring force F = -k(x - L₀). Animate cord as a series of 10 horizontal sine-wave oscillating line segments that increase in amplitude as tension grows. Runtime: real-time. Gotcha: the cord slack phase requires a conditional — only apply spring force when extension x > L₀; failing to check this causes the cord to push the jumper upward during the slack phase, which is physically wrong.
