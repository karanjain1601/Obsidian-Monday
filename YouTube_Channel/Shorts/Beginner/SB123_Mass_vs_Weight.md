---
title: "Same Mass, Different Weight on the Moon"
id: SB123
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, gravity, weight]
---

> **What it is:** A ~45-second simulation short where the same orange sphere lands on an Earth scale (686 N) then glides to the Moon where it reads only 114 N, and a side-by-side bounce shows it soaring 5× higher on the Moon — revealing that mass never changes but weight depends on the local gravitational field strength. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Same Mass, Different Weight on the Moon
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Side-by-side: on the left, a cartoon astronaut standing on a blue bathroom scale with the dial spinning rapidly to **"686 N"** in red. On the right, the same astronaut on a grey lunar scale — dial spins to **"114 N"** in green. Both needles stop simultaneously. Astronaut waves.

## Main Visual Sequence (0:03–0:50)
**0:03** — Scene clears to a split black background. Left half: deep blue Earth gradient with white cloud wisps. Right half: grey Moon surface with craters. Both halves have a platform scale (white rectangle, gauge on top) in the center.

**0:08** — A single 3D-styled orange sphere (radius 40 px, labeled **"Mass = 70 kg"** in white) descends from the top of the left (Earth) side. It lands on the scale with a satisfying squish animation. Scale gauge needle sweeps from 0 to **686 N** (red). Below the scale: equation appears letter by letter — **"W = m × g"**.

**0:14** — Variables fill in below the equation: **"W = 70 × 9.81 = 686 N"** (white text, yellow highlight on 9.81 and result). A small Earth icon annotates **"g = 9.81 m/s²"** (green label).

**0:20** — The same orange sphere (still labeled **"Mass = 70 kg"**) glides across the split-screen from Earth side to Moon side in a gentle parabolic arc. A dotted white trail follows it. It lands on the right scale with a softer squish.

**0:26** — Moon scale needle sweeps from 0 to **114 N** (green). Equation reappears: **"W = 70 × 1.62 = 114 N"**. Yellow highlight on **1.62** and result. Moon icon annotates **"g = 1.62 m/s²"** (green label).

**0:32** — A comparison panel slides up from the bottom (white card on dark background): two rows — "Earth: g = 9.81 m/s², Weight = 686 N" and "Moon: g = 1.62 m/s², Weight = 114 N". Third row: **"Mass: 70 kg (unchanged)"** in bold green.

**0:38** — The orange sphere bounces: on Earth side it barely rises (low bounce, 30 px). On Moon side it rises 5× higher (150 px) from the same applied force. Dashed horizontal line marks equal height reference. Text: **"Same force, 5× higher jump on Moon"**.

**0:43** — Zoom to center: large bold white text — **"Mass = amount of matter. Weight = gravitational force."** Two-line definition remains for 4 seconds.

## Physics Concept Teased
Mass is an intrinsic property of matter (measured in kg) and never changes; weight is the gravitational force acting on that mass (W = mg) and varies with the local gravitational field strength — the Moon's g is only 1.62 m/s², about 1/6 of Earth's.

## On-Screen Text / Captions
- **0:00** — "Earth: 686 N  |  Moon: 114 N" (simultaneous scale readings, large red/green)
- **0:08** — "Mass = 70 kg" (sphere label, white)
- **0:14** — "W = m × g = 70 × 9.81 = 686 N" (equation panel, Earth side)
- **0:20** — "Same ball, same mass — let's go to the Moon" (top-center, white italic)
- **0:26** — "W = 70 × 1.62 = 114 N" (equation panel, Moon side)
- **0:32** — "Mass stays the same. Weight changes." (center-top, bold yellow)
- **0:43** — "Mass = matter. Weight = force." (center, large white)

## End Card
Final 3 seconds: The two scales side by side freeze. White text overlay: **"Follow for more physics that surprises you."** CodedLaws logo fades in bottom-right.

## Audio
Music: Light, curious acoustic guitar pluck loop at 60 BPM from 0:00–0:37; brief dramatic sting when sphere crosses to Moon (0:20); calm resolution chord at 0:43. No voiceover. Sound effects: scale-needle tick sound as gauge rises; soft "thud" on landing; light whoosh during the parabolic transfer.

## Production Notes
Code complexity: Low. Renderer: Canvas 2D. Key visual trick: draw two independent canvas contexts side-by-side (two <canvas> elements in a flex row); animate scale needle with requestAnimationFrame using easeOut — sweep from 0 to target over 1 second. The sphere parabolic transfer: parametric x = lerp(leftCenter, rightCenter, t), y = leftCenter.y - 120*sin(π*t) for t in [0,1] over 1.5 seconds. Bounce on Moon: apply higher gravity constant (g=1.62) in the physics update so same initial velocity produces higher apex. Runtime: ~48 seconds. Gotcha: units — show N (Newtons) for weight on scale, not kg; beginners conflate them; the comparison panel must make this visually obvious.
