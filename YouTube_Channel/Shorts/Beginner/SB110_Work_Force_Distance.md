---
title: "Work = Force × Distance (Visualized)"
id: SB110
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, work, energy]
---

> **What it is:** A ~45-second simulation short where an orange block slides across a floor pushed by a force arrow while a lime-green energy meter fills proportionally, then replays with doubled force and doubled distance to show each produces the same total work, visualizing W = F × d. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Work = Force × Distance (Visualized)
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A bright orange rectangular block (80×60px) sits on a flat gray floor. A cyan arrow labeled "F = 20 N →" stretches from the block's right face. The block is motionless. Below it: a thin glowing green energy meter bar (400px wide, 20px tall) completely empty, showing "W = 0 J" in white text. The viewer sees the potential — nothing is happening yet.

## Main Visual Sequence (0:03–0:50)
**0:03** — The block begins sliding right, pushed by the 20 N force arrow. The energy meter starts filling from left to right with a bright lime-green glow. A distance counter "d = 0.0 m" appears above the floor and ticks upward.

**0:08** — Block has traveled 1 meter. Energy meter is 25% full. Readout: "W = 20 J." A trailing path of small yellow footprint markers appears on the floor every 10px showing the block's path.

**0:14** — Block has traveled 2 meters. Energy meter is 50% full. Readout: "W = 40 J." A ghost image of the block at d = 0 m remains at the starting position to compare distances visually.

**0:20** — Pause mid-motion. The formula "W = F × d" appears in large gold letters at the top-center. Below: "W = 20 N × 2 m = 40 J." Each part of the equation pulses in matching colors: F (cyan), d (white), W (lime-green).

**0:26** — Animation continues. At d = 4 m, meter is 100% full, reading "W = 80 J." The meter flashes bright white and then glows steady green.

**0:30** — The force arrow doubles in size: "F = 40 N →" (orange). Block is reset to start. Text: "Same distance (2 m), double the force."

**0:34** — Block pushed 2 meters with F = 40 N. Energy meter fills twice as fast, reaching 80 J at d = 2 m. Label: "Double force → double work." The meter glows orange instead of green.

**0:38** — Counter-demonstration: force reduced to F = 20 N, distance doubled to 4 m. Meter reaches same 80 J. Label: "Half force, double distance → same work." Both scenarios freeze side-by-side in split screen.

**0:42** — Zero-work demonstration: a block pushed sideways (horizontal) while gravity (downward) acts on it. "F · d · cos90° = 0 J" appears. Label: "Work = 0 when force ⊥ displacement."

**0:47** — Freeze. White bold text: "W = F × d. Move something. That's work."

## Physics Concept Teased
Work in physics is the product of the force applied to an object and the displacement of that object in the direction of the force: W = F × d × cosθ. Double the force or double the distance and you do double the work. When force is perpendicular to displacement (θ = 90°), no work is done — even if the object moves.

## On-Screen Text / Captions
- **0:03** — "F = 20 N →" (cyan, on force arrow), "d = 0.0 m" (white, above floor, live counter), "W = 0 J" (white, energy meter)
- **0:08** — "W = 20 J" (lime-green, energy meter)
- **0:14** — "W = 40 J" (lime-green, energy meter)
- **0:20** — "W = F × d" (gold, top-center), "W = 20 N × 2 m = 40 J" (white, below formula)
- **0:26** — "W = 80 J" (lime-green flash, energy meter full)
- **0:30** — "F = 40 N →" (orange), "Same distance, double force." (white, top)
- **0:34** — "Double force → double work." (orange bold, center)
- **0:38** — "Half force, double distance → same work." (white, split-screen label)
- **0:42** — "W = F·d·cos90° = 0 J" (white, bottom), "Force ⊥ displacement → no work done" (white italic)
- **0:47** — "W = F × d. Move something. That's work." (white bold, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — every short explains one idea, clearly."

## Audio
Music: Steady electronic groove, 95 BPM, with a satisfying tonal rise as the energy meter fills. Sound effects: a mechanical sliding sound as block moves; a bright chime when the energy meter reaches 100%. No voiceover.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: the energy meter is a rounded rectangle filled proportional to W / W_max; add a shimmer animation (a white diagonal highlight sweeping left-to-right every 1.5 s) to make the fill look energized. Track block X position; work = force × (x - x_start) / pixels_per_meter. Runtime: real-time. Gotcha: the "same work, different F and d" comparison requires resetting the block and re-running the simulation with new parameters — use a state machine (IDLE → RUNNING → DONE → RESET) to manage the two demonstrations cleanly.
