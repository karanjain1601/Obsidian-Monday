---
title: "Why Steeper Ramps Accelerate Faster"
id: SB107
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, inclined-plane, acceleration]
---

> **What it is:** A ~45-second simulation short where a red block slides down ramps at 10°, 45°, and 80° in succession, each time with a visibly larger acceleration arrow and a faster descent, revealing how the component of gravity along the slope (mg·sinθ) grows with angle until 90° becomes pure free fall. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Why Steeper Ramps Accelerate Faster
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A bright red square block (50×50px) sits motionless at the top of a gray inclined ramp angled at 10°. The ramp is 600px long against a clean white background. Below the block, a small green acceleration arrow points down the slope — barely visible, just 10px long. The number "a = 1.70 m/s²" floats beside it in dark text. The block looks like it could sit there forever. Then it starts to slide.

## Main Visual Sequence (0:03–0:50)
**0:03** — The block begins sliding down the 10° ramp slowly. A velocity trail (fading red ghost images every 10 frames) shows the gradual acceleration. The block reaches the bottom in about 3 seconds.

**0:08** — The ramp angle sweeps up to 45°. The block is reset to the top. This time the green acceleration arrow is 5× longer (now 50px). Label: "a = 6.93 m/s²." The block rockets down and hits the bottom quickly with a bounce effect.

**0:14** — Angle sweeps to 80°. Block resets. Arrow is enormous — nearly vertical. Label: "a = 9.66 m/s²." The block practically free-falls, hitting the bottom in under a second. Impact spark flash at base of ramp.

**0:20** — Pause. Force decomposition diagram appears overlaid on the current ramp:
  A long blue "mg" arrow points straight down from the block's center of mass.
  A green arrow "mg·sinθ" runs parallel to and down the slope (driving force).
  An orange arrow "mg·cosθ" runs perpendicular into the slope (normal force).
  Labels appear for each with their numerical values at 45°: "mg·sin45° = 6.93 N/kg", "mg·cos45° = 6.93 N/kg."

**0:28** — The formula "a = g·sinθ" appears in gold at the top-center. Below it, three cases appear stacked:
  "θ = 10° → a = 1.70 m/s²" (gray)
  "θ = 45° → a = 6.93 m/s²" (yellow)
  "θ = 80° → a = 9.66 m/s²" (orange)

**0:34** — A sine curve graph draws from left to right (x-axis: angle 0–90°, y-axis: acceleration 0–9.8 m/s²). A moving dot traces along the curve as the angle increases from 0° to 90°. At 90° the curve peaks at g = 9.8 m/s². Label: "At 90°, it's just free fall."

**0:40** — Full animation replay: three blocks on three ramps (10°, 45°, 80°) released simultaneously. The 80° block hits the bottom first, then 45°, then 10°. Three finish flags appear staggered.

**0:44** — Freeze on three ramps. Bold white text below: "Steeper angle → bigger sin(θ) → more acceleration."

**0:47** — Text overlay: "At 90°, the ramp becomes free fall: a = 9.8 m/s²."

## Physics Concept Teased
On a frictionless inclined plane, only the component of gravity parallel to the surface — mg·sinθ — drives acceleration. As the angle θ increases from 0° to 90°, sinθ increases from 0 to 1, so acceleration increases from zero to full gravitational acceleration g = 9.8 m/s². The steeper the ramp, the faster the slide.

## On-Screen Text / Captions
- **0:03** — "θ = 10° | a = 1.70 m/s²" (dark text, beside acceleration arrow)
- **0:08** — "θ = 45° | a = 6.93 m/s²" (yellow, beside longer arrow)
- **0:14** — "θ = 80° | a = 9.66 m/s²" (orange, beside huge arrow)
- **0:20** — "mg" (blue), "mg·sinθ" (green), "mg·cosθ" (orange) — force diagram labels
- **0:28** — "a = g·sinθ" (gold, top-center)
- **0:34** — "At 90°, it's just free fall." (white, graph endpoint)
- **0:44** — "Steeper angle → bigger sin(θ) → more acceleration." (white bold, lower-center)
- **0:47** — "At 90°, the ramp becomes free fall: a = 9.8 m/s²." (white, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — physics, visualized."

## Audio
Music: Upbeat electronic with accelerating tempo feel, 100–120 BPM ramp-up. Sound effects: a sliding friction whoosh as block descends; a sharp impact thud when it hits the base. No voiceover.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: rotate the entire canvas coordinate system by the ramp angle θ using `ctx.rotate(θ)` so the block always slides along the local x-axis; transform back to draw world-space labels. Compute block position along slope using kinematic equation x = 0.5 * g * sin(θ) * t². Runtime: real-time. Gotcha: after rotating canvas, text labels will also be rotated — save/restore the canvas state before drawing labels and draw them in world-space coordinates.
