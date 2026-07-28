---
title: "Energy Is Never Lost — Just Transformed"
id: SB111
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, energy-conservation, kinetic-energy]
---

> **What it is:** A ~45-second simulation short where a glowing ball rolls along a roller-coaster track while green KE and orange PE bar charts swap values in perfect sync, their sum locked at 100 J by a white dotted line — then a friction toggle shows energy quietly draining into a heat bar, demonstrating conservation of energy. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Energy Is Never Lost — Just Transformed
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A glowing yellow ball (20px radius) sits motionless at the very top of a roller-coaster track — a dramatic hill 300px high above the canvas floor. The track is a dark gray curved line with a smooth hill, valley, and second smaller hill. On the right side of the screen: two vertical bar charts side by side:
  Left bar (green, labeled "KE"): empty (0 J)
  Right bar (orange, labeled "PE"): fully filled to top (100 J)
Below both bars: "Total = 100 J" in bold white. Everything is frozen at maximum potential.

## Main Visual Sequence (0:03–0:50)
**0:03** — The ball begins rolling down the track. As it descends, the orange PE bar drops and the green KE bar rises simultaneously. The total stays locked at 100 J — a white dotted horizontal line shows the conserved total.

**0:08** — Ball is at the bottom of the valley (height = 0). PE bar is at 0 J (empty, gray). KE bar is fully filled green (100 J). Ball visually glows brighter — it is moving fastest. Speed label appears: "v = 14.1 m/s."

**0:14** — Ball climbs the second hill (height = 150px, half the original). PE refills to 50 J (orange bar halfway). KE drops to 50 J. Speed label: "v = 9.97 m/s." The conservation line stays fixed.

**0:20** — Pause at the crest of the second hill. Annotation: "PE = mgh = 50 J | KE = ½mv² = 50 J | Total = 100 J." The formula "KE + PE = constant" appears in gold at the top-center.

**0:26** — A second demonstration: the ball rolls back down from the second hill, through the valley, and back up toward the starting position. It climbs exactly back to 300px height — same as start. Label: "Frictionless → ball returns to exact starting height."

**0:32** — Friction version: a toggle labeled "Friction ON" appears top-left. The ball re-runs the track. Now, each cycle the ball climbs slightly less — after 2 full passes, it reaches only 240px height. A small red "Heat" bar appears in the corner, filling slightly. Label: "Friction converts KE and PE → heat."

**0:38** — Comparison freeze: left shows frictionless bar chart (KE + PE = 100 J always); right shows friction bar chart (KE + PE = 80 J, Heat = 20 J). Combined total still 100 J. Label: "Total energy is still 100 J — just different forms."

**0:44** — The heat bar in the friction scenario glows red-orange. Label: "Energy is never destroyed — only transferred."

**0:47** — Freeze. Bold white text: "KE + PE = constant. Always. Everywhere."

## Physics Concept Teased
The law of conservation of energy states that the total mechanical energy (KE + PE) of a system is constant in the absence of non-conservative forces like friction. When friction is present, mechanical energy decreases but the total energy (including heat) remains conserved. Energy is never created or destroyed — only transformed between forms.

## On-Screen Text / Captions
- **0:00** — "KE = 0 J" (green bar, right), "PE = 100 J" (orange bar, full), "Total = 100 J" (white, below)
- **0:08** — "KE = 100 J | PE = 0 J | v = 14.1 m/s" (white, live readout below bars)
- **0:14** — "KE = 50 J | PE = 50 J | v = 9.97 m/s" (white, live readout)
- **0:20** — "KE + PE = constant" (gold, top-center)
- **0:20** — "PE = mgh = 50 J | KE = ½mv² = 50 J | Total = 100 J" (white annotation)
- **0:26** — "Frictionless → returns to exact start height." (white italic, top-left)
- **0:32** — "Friction ON" (yellow toggle label)
- **0:32** — "Friction converts energy → heat." (red italic, top-right)
- **0:38** — "Total energy is still 100 J — just different forms." (white bold, center)
- **0:44** — "Energy is never destroyed — only transferred." (white, lower)
- **0:47** — "KE + PE = constant. Always. Everywhere." (bold white, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — and never lose energy."

## Audio
Music: Smooth electronic ambient, rises in energy as ball descends, softens as it climbs. 80 BPM base tempo. Sound effects: a soft whoosh as the ball reaches peak speed at the valley; a subtle scraping sound during the friction-on segment. No voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D (track path as a bezier spline). Key visual trick: precompute the track height h(x) as a lookup table; at each frame, compute ball height from its x-position, then PE = mgh and KE = E_total - PE, then v = sqrt(2*KE/m). Animate bar charts by setting their fill height proportional to energy fraction. Friction version: reduce E_total by 0.5% per frame. Runtime: real-time. Gotcha: ensure the ball stays on the track by constraining its y-position to h(x) each frame — do not use free physics for y; only integrate x velocity.
