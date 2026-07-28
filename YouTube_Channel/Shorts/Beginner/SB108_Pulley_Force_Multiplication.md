---
title: "Pulleys: How to Lift Heavy Things Easily"
id: SB108
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, pulley, mechanical-advantage]
---

> **What it is:** A ~45-second simulation short comparing a single pulley needing 100 N to a 4-pulley block-and-tackle lifting the same 100 kg load with just 25 N, with tension arrows on each rope segment adding up to show how more rope segments share the load and multiply mechanical advantage. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Pulleys: How to Lift Heavy Things Easily
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Two side-by-side systems fill the screen on a steel-gray background. Left: a single pulley at the top with a gray rope and a hanging 100 kg concrete block. Right: a block-and-tackle with 4 pulleys, the same 100 kg block hanging from it. Both blocks hover 20px above the ground, motionless. A hand icon at the bottom of each rope holds it taut. The visual size difference between the two systems — simple vs. compound — is immediately striking.

## Main Visual Sequence (0:03–0:50)
**0:03** — Effort force labels appear on each rope end:
  Left hand (single pulley): "100 N ↓" in red
  Right hand (block-and-tackle): "25 N ↓" in green
  Both labels pulse once to draw attention.

**0:08** — Left system animates: the hand pulls the rope down 2 meters (rope shortens 2 m). The 100 kg block rises 2 meters. Arrow labels: "Rope pulled: 2 m ↓ | Load rises: 2 m ↑." A red energy meter on the left shows "Work = 200 J."

**0:14** — Right system animates: the hand pulls the rope down 2 meters (rope shortens 2 m). The 100 kg block rises only 0.5 meters. Arrow labels: "Rope pulled: 2 m ↓ | Load rises: 0.5 m ↑." A green energy meter on the right shows "Work = 200 J."

**0:20** — Both energy meters show "200 J" — highlighted and flashing with the text "Same work, less effort." A horizontal equals sign glows between the two meters.

**0:26** — Pause. Annotation: Left system: "MA = 1 | Effort = 100 N." Right system: "MA = 4 | Effort = 25 N." The formula "MA = Load / Effort" appears in gold at the top-center.

**0:32** — Zoom into the right block-and-tackle. Tension arrows (labeled "T = 25 N") appear on each of the 4 rope segments supporting the lower pulley block. They add up to 4 × 25 N = 100 N, which equals the block weight. Label: "4 rope segments share the load."

**0:38** — A speed comparison appears: left block arrow (large, fast, "2 m/s"); right block arrow (small, slow, "0.5 m/s"). Label: "Trade-off: less force, less speed."

**0:42** — Real-world montage: crane hook (block-and-tackle), sailing mast (rope and pulley), gym cable machine. Each is labeled with its approximate mechanical advantage.

**0:44** — Freeze. Bold white text: "4 pulleys → 4× less force. Work stays the same."

## Physics Concept Teased
A pulley system multiplies force by increasing mechanical advantage (MA = number of rope segments supporting the load), but at the cost of distance — you must pull more rope to lift the load the same height. Total work is conserved: W = F × d remains constant regardless of pulley count.

## On-Screen Text / Captions
- **0:03** — "100 N" (red, left rope), "25 N" (green, right rope)
- **0:08** — "Rope: 2 m | Load: 2 m" (white, left system)
- **0:08** — "Work = 200 J" (red energy meter, left)
- **0:14** — "Rope: 2 m | Load: 0.5 m" (white, right system)
- **0:14** — "Work = 200 J" (green energy meter, right)
- **0:20** — "Same work, less effort." (white bold, center)
- **0:26** — "MA = Load / Effort" (gold, top-center)
- **0:26** — "MA = 1 | Effort = 100 N" (left), "MA = 4 | Effort = 25 N" (right)
- **0:32** — "T = 25 N" (white, on each rope segment), "4 × 25 = 100 N" (white, below)
- **0:38** — "Trade-off: less force, less speed." (white italic, center)
- **0:44** — "4 pulleys → 4× less force. Work stays the same." (bold white, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — simple machines, deep physics."

## Audio
Music: Industrious mechanical groove, 90 BPM, with metallic percussion. Sound effects: rope tension creak when each system starts; block impact on ground when it is lowered. No voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: draw each pulley as a circle with a groove line (two concentric circles, 20px and 14px radius); route rope as a series of straight segments through the pulley centers using precomputed anchor points. Animate rope shortening by adjusting segment endpoints. MA = number of rope segments under lower pulley block; compute effort = load_weight / MA. Runtime: real-time. Gotcha: in a 4-pulley block-and-tackle, carefully trace which pulley is fixed (ceiling) and which is moving (load) — routing errors cause ropes to visually cross incorrectly.
