---
title: "The Secret Behind Mechanical Clocks"
id: SB112
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, pendulum, escapement]
---

> **What it is:** A ~45-second simulation short where a swinging pendulum unlocks one tooth of a brass escape wheel per half-swing with a crisp tick, advancing a clock hand in discrete steps and revealing how the pendulum's length-tuned period T = 2π√(L/g) is the engine of mechanical timekeeping. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: The Secret Behind Mechanical Clocks
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A detailed mechanical clock escapement fills the screen: a brass-colored escape wheel (12-toothed, 150px diameter) sits center-left; an anchor-shaped pallet fork (silver, 100px tall) straddles the wheel from above. A pendulum rod (200px, dark brown) hangs below the pallet fork pivot, a brass bob at its tip. The wheel is frozen mid-tooth. The scene is dramatic, lit from the upper-right as if under a desk lamp. No motion — until it starts.

## Main Visual Sequence (0:03–0:50)
**0:03** — The pendulum swings left. A soft tick sound. The left pallet of the anchor lifts off one tooth of the escape wheel, releasing it to advance exactly one tooth (30° rotation). The wheel snaps forward in a crisp angular jump — the snap is clearly visible as a fast arc motion.

**0:08** — The pendulum reaches its leftmost point (peak of swing, momentarily still). The right pallet catches the next tooth, stopping the wheel dead. The clock hand at the top-right corner (outside the mechanism view) advances one second mark.

**0:12** — Pendulum swings back right. Tick. The right pallet lifts, releasing the wheel one more tooth. The wheel advances another 30° clockwise. The clock hand advances again.

**0:16** — A "TICK — TOCK — TICK — TOCK" text label appears in rhythm, flashing with each half-swing in white text. The mechanism runs at 1 Hz (one full swing per second). A period label appears: "T = 1.0 s."

**0:22** — Slow-motion replay (0.2× speed) of one complete tick-tock cycle. Each component is labeled:
  "Pendulum rod" (white arrow), "Pivot" (white dot), "Pallet fork (anchor)" (silver label), "Escape wheel" (gold label), "Impulse face" (tooth contact point, red dot), "Clock hand" (gray label, top-right).

**0:30** — The pendulum length annotation appears: "L = 0.25 m → T = 2π√(L/g) = 1.0 s." The formula "T = 2π√(L/g)" glows in gold. Below: "Longer pendulum → slower tick."

**0:36** — A side panel shows two alternative pendulum lengths:
  L = 0.25 m → "T = 1.0 s" (green, fast-ticking)
  L = 1.0 m → "T = 2.0 s" (orange, slow-ticking)
  Both pendulums animate simultaneously at their correct periods.

**0:42** — Full view of the clock: escapement + pendulum + gear train leading to clock face. Clock face shows hands advancing at the correct rate. Label: "The pendulum controls time."

**0:46** — Freeze. Bold white text: "Every tick is one pendulum half-swing. Perfect and repeating."

## Physics Concept Teased
The anchor escapement converts the periodic oscillation of a pendulum into discrete rotational steps of the gear train, advancing the clock hands one step per half-swing. The pendulum's period T = 2π√(L/g) is set by its length and gravity alone — making it a highly stable, gravity-tuned timekeeper that was the foundation of accurate mechanical clocks for 300 years.

## On-Screen Text / Captions
- **0:03** — "TICK" (white flash, left side, at each leftward swing release)
- **0:08** — "TOCK" (white flash, right side, at each rightward swing release)
- **0:16** — "TICK — TOCK" (rhythmic white text, centered, in sync)
- **0:16** — "T = 1.0 s" (white, below pendulum)
- **0:22** — Labels: "Pendulum rod", "Pallet fork", "Escape wheel", "Impulse face", "Clock hand" (white annotation arrows, slow-motion)
- **0:30** — "T = 2π√(L/g)" (gold, top-center)
- **0:30** — "L = 0.25 m → T = 1.0 s" (white, below formula)
- **0:36** — "L = 0.25 m → 1.0 s" (green), "L = 1.0 m → 2.0 s" (orange)
- **0:42** — "The pendulum controls time." (white italic, clock face label)
- **0:46** — "Every tick is one pendulum half-swing. Perfect and repeating." (bold white)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — time is physics."

## Audio
Music: Steady minimalist piano ticking rhythm, 60 BPM, each beat synchronized to the pendulum swing. Sound effects: crisp mechanical "tick" on each pallet release (metallic, high-pitched). Slow-motion replay has a deep, slowed-down tick sound. No voiceover.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D. Key visual trick: the escape wheel rotates in discrete angular increments (360°/N per tooth, where N = 12 teeth) at the moment of pallet release; interpolate the snap rotation over 80ms using an ease-out cubic. Pendulum angle follows θ(t) = A·cos(2πt/T) where A = 15° (small angle approximation valid). Pallet catch/release timing is determined by when pendulum crosses ±threshold angle. Runtime: real-time. Gotcha: the anchor pallet fork must have two distinct catch points (entry and exit pallets); compute each pallet's world-space position from the pivot angle to check tooth contact — a naive bounding-box check will miss angled tooth faces.
