---
title: "The Lever: Archimedes' Simple Machine"
id: SB109
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, lever, torque]
---

> **What it is:** A ~45-second simulation short where a 10 N weight on a long lever arm effortlessly lifts a 50 N weight on a short arm, with torque arcs at the fulcrum confirming balance, then the fulcrum slides to show how mechanical advantage scales with arm length ratio. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: The Lever: Archimedes' Simple Machine
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A single long gray lever (700px × 12px) rests on a triangular yellow fulcrum at its center. On the right end sits a heavy red weight labeled "50 N," pressing the right side down to the floor. On the left end: a small blue weight labeled "10 N" suspended in the air. A bold question mark "?" floats above the left end. The viewer knows instantly the weights don't balance — but why is the small one winning?

## Main Visual Sequence (0:03–0:50)
**0:03** — The scene title fades in: "Fulcrum at 1/6 from left." A dimension annotation appears: lever total length = 600px; left arm = 100px, right arm = 500px. The 10 N weight sits 100px from the fulcrum; the 50 N weight sits 500px from the fulcrum.

**0:08** — Rotation animation: the left side pushes down slowly; the right side rises, lifting the 50 N weight. A curved blue torque arc appears around the fulcrum for each side.

**0:12** — Pause. Two torque calculations appear as annotation boxes:
  Left torque: "τ₁ = 10 N × 0.5 m = 5 N·m" (blue)
  Right torque: "τ₂ = 50 N × 0.1 m = 5 N·m" (red)
  Between them: "τ₁ = τ₂ → Balance!" in gold.

**0:18** — The lever pivots back to horizontal (balanced). The formula "F₁·d₁ = F₂·d₂" appears in gold at the top-center. Each term highlights its matching annotation.

**0:24** — The fulcrum slides left along the lever in real time (taking 3 seconds to travel from center to 1/6 position). As it moves, the left arm lengthens and the numbers update: 10 N × d₁ = 50 N × d₂. The right weight rises higher and higher as the mechanical advantage grows.

**0:30** — The fulcrum reaches the 1/5 position (left arm = 1/5 of total). The right side (50 N) is fully raised. MA label: "MA = d₁/d₂ = 5." The 10 N weight is shown effortlessly holding up the 50 N load.

**0:36** — Archimedes quote appears in italic white text at the top: "Give me a lever long enough… and I shall move the world." A cartoon Earth icon appears at the right end of the lever; a tiny stick figure presses the left end.

**0:40** — Quick demo: three positions of the fulcrum shown in rapid succession (1/2, 1/3, 1/5 from left) with their MA values: MA = 1, MA = 2, MA = 5.

**0:44** — Freeze on MA = 5 configuration. Bold white text: "Move the fulcrum — change the mechanical advantage."

**0:47** — "Torque = Force × Distance. Balance the torques and you move anything."

## Physics Concept Teased
A lever multiplies force by trading distance: the mechanical advantage equals the ratio of the effort arm to the load arm (MA = d₁/d₂). By adjusting the fulcrum position, any weight can be balanced or lifted with a fraction of the actual force — provided the input force acts over a proportionally greater distance. Torque balance (F₁·d₁ = F₂·d₂) is the governing principle.

## On-Screen Text / Captions
- **0:03** — "50 N" (red, right end), "10 N" (blue, left end)
- **0:03** — "Left arm: 100px | Right arm: 500px" (white dimension annotation)
- **0:12** — "τ₁ = 10 N × 0.5 m = 5 N·m" (blue box), "τ₂ = 50 N × 0.1 m = 5 N·m" (red box)
- **0:12** — "τ₁ = τ₂ → Balance!" (gold, center)
- **0:18** — "F₁·d₁ = F₂·d₂" (gold, top-center)
- **0:30** — "MA = d₁/d₂ = 5" (white bold, center-top)
- **0:36** — "Give me a lever long enough… and I shall move the world." (white italic, top)
- **0:40** — "MA = 1", "MA = 2", "MA = 5" (white, below each fulcrum position)
- **0:47** — "Torque = Force × Distance." (white bold, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — Archimedes was onto something."

## Audio
Music: Classical/electronic fusion, 85 BPM, elegant and measured. Sound effect: a soft wooden creak as the lever rotates; a satisfying click when it reaches balance. No voiceover.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: the lever is a single rotated rectangle; compute rotation angle from net torque imbalance (if τ_left > τ_right, rotate counterclockwise). Clamp rotation to ±30° to stay on screen. Fulcrum triangle drawn with `ctx.beginPath(); ctx.moveTo(x, base); ctx.lineTo(x-20, base+30); ctx.lineTo(x+20, base+30); ctx.closePath()`. Runtime: real-time. Gotcha: the lever pivot point must be exactly at the fulcrum tip; translate the canvas to the fulcrum point before applying the rotation transform.
