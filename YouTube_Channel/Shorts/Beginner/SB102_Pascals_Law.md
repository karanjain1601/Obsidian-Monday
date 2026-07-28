---
title: "Pascal's Law: Small Force, Big Lift"
id: SB102
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, fluid-mechanics, pascal, hydraulics]
---

> **What it is:** A ~45-second simulation short where a hand pressing a narrow piston with just 10 N lifts a 100 N steel block via a wider piston connected by glowing cyan hydraulic fluid, revealing how Pascal's Law multiplies force in proportion to piston area ratio. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Pascal's Law: Small Force, Big Lift
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A compact hydraulic system sits center-screen against a dark charcoal background. On the left: a narrow gray piston (30px wide) with a glowing green "10 N" arrow pressing down on it. On the right: a wide red piston (120px wide) with a massive steel block labeled "100 N" sitting on top, motionless. The fluid channel connecting them glows cyan. Everything is frozen — the viewer sees the imbalance and wonders why the block isn't crushing everything.

## Main Visual Sequence (0:03–0:50)
**0:03** — An animated hand icon presses the left (narrow) piston downward 30px. The piston compresses smoothly over 1 second. The cyan hydraulic fluid in the connecting tube brightens and ripples.

**0:10** — The right (wide) piston begins rising. Speed is slow but steady. The 100 N steel block lifts off its platform — a small shadow appears beneath it. Yellow lift arrows appear under the right piston.

**0:16** — Pause in motion. Two annotation boxes appear:
  Left piston: "Area = 1 cm²  |  Force = 10 N  →  Pressure = 10 N/cm²"
  Right piston: "Area = 10 cm²  |  Pressure = 10 N/cm²  →  Force = 100 N"
  Both boxes connected to their respective pistons with dashed white lines.

**0:24** — The formula "F₁/A₁ = F₂/A₂" appears center-top in bold yellow. Each term briefly highlights matching its annotation box — F₁ blue, A₁ green, F₂ orange, A₂ red.

**0:30** — Animation resumes. The small piston pushes down another 30px (total 60px travel). The large piston has risen only 6px. A two-headed arrow appears showing: "Left piston: 60 mm down ↕ Right piston: 6 mm up." The ratio "10:1" appears between the arrows.

**0:38** — Split-panel appear side by side. Left: "Force applied = 10 N (you)". Right: "Force delivered = 100 N (load lifted)". A glowing "10× Amplification" badge slides in from the right edge.

**0:44** — Both pistons animate one more full cycle. Screen freezes on the block fully elevated.

**0:47** — White text overlay on black: "Same pressure, bigger area = bigger force." Freeze frame to end card.

## Physics Concept Teased
Pascal's Law states that pressure applied to a confined fluid is transmitted equally in all directions throughout the fluid. A small force on a small area creates the same pressure as a large force on a large area, enabling hydraulic machines to multiply force by the ratio of piston areas.

## On-Screen Text / Captions
- **0:03** — "10 N" (green arrow label, left piston)
- **0:10** — "100 N" (orange label, steel block on right piston)
- **0:16** — Left box: "A₁ = 1 cm² | F₁ = 10 N | P = 10 N/cm²" (white text, left side)
- **0:16** — Right box: "A₂ = 10 cm² | P = 10 N/cm² | F₂ = 100 N" (white text, right side)
- **0:24** — "F₁/A₁ = F₂/A₂" (yellow bold, top-center)
- **0:30** — "10:1" (white, center, between displacement arrows)
- **0:38** — "10× Amplification" (gold badge, right edge)
- **0:47** — "Same pressure, bigger area = bigger force." (white bold, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo center. Below: "Follow for physics that clicks." Small hydraulic piston icon pulses once.

## Audio
Music: Upbeat mechanical groove, 95 BPM, light percussion. Sound effects: a hydraulic hiss when the left piston is pressed; a heavy metallic thud when the 100 N block lifts clear of the platform. No voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: connect left and right pistons with a trapezoidal U-shaped fluid channel; animate fluid color brightness (cyan → bright white) when pressure is applied using alpha pulse. Use inverse area ratio to compute right-piston displacement: dy_right = dy_left * (A1/A2). Runtime: real-time. Gotcha: ensure the U-channel fluid volume appears conserved (left piston area × left displacement = right piston area × right displacement) for physical accuracy.
