---
title: "Water Hammer: The Pressure Spike in Pipes"
id: SB143
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, fluid-mechanics, pressure, water-hammer]
---

> **What it is:** A ~45-second simulation short where a valve slams shut on a flowing pipe and an orange pressure wave instantly spikes the gauge from 1 bar to 12 bar, then bounces back and forth with diminishing amplitude — revealing how sudden flow stoppage converts kinetic energy into a destructive pressure shock. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Water Hammer: The Pressure Spike in Pipes
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A horizontal pipe cross-section (dark grey walls, blue water filling the interior) shows blue water flowing smoothly right-to-left. A red valve at the left end SLAMS shut in one frame — the pipe walls instantly bulge outward in a violent orange flash and a loud BANG sound. The pipe returns to normal shape but visibly trembling.

## Main Visual Sequence (0:03–0:50)
**0:03** — Scene reset. Pipe viewed from side (400px wide × 80px tall, dark steel grey walls). Water shown as blue particles flowing right at 3 m/s, evenly spaced. Flow velocity label: "v = 3 m/s." Pressure gauge on left reads "1 bar."

**0:10** — Red valve on left slams shut (0.01s close time — too fast for water to adjust). A white pressure compression wave immediately forms at the valve and races rightward at 1200 m/s (speed of sound in water). Pressure gauge spikes to "12 bar." Pipe walls shown bulging slightly orange at the wave front.

**0:18** — Wave reaches the right end (open or reservoir). Wave reflects back as a rarefaction (blue, low-pressure) wave moving left. Gauge on right briefly reads "-0.5 bar" (sub-atmospheric — cavitation warning).

**0:27** — Rarefaction wave reflects off closed valve, becomes compression wave again, travels right. This bouncing continues 4 cycles shown at accelerated speed. Amplitude decays with each cycle (friction dampening). Pressure-vs-time graph in corner plots the oscillating spikes.

**0:35** — Comparison: slow valve closure (2 seconds) — pressure spike is only 1.5 bar (manageable). Annotation: "Slow closure = no hammer." vs "Fast closure = disaster."

**0:43** — Real pipe failure image placeholder (stylized crack in pipe wall). Text: "Water hammer can burst pipes, valves, and pumps." CodedLaws logo appears.

## Physics Concept Teased
When flowing liquid is suddenly stopped, its kinetic energy converts to a pressure wave (water hammer) that travels at the speed of sound in the fluid. The pressure spike — proportional to fluid velocity and wave speed — can be many times the normal operating pressure, destroying plumbing systems.

## On-Screen Text / Captions
- 0:03 → "Water flows at 3 m/s, 1 bar"
- 0:10 → "Valve slams shut — pressure spikes to 12 bar!"
- 0:18 → "Wave reflects — low pressure zone follows"
- 0:27 → "Pressure bounces back and forth"
- 0:35 → "Slow valve closure → no hammer"
- 0:43 → "ΔP = ρ·c·Δv"

## End Card
Final 3 seconds: Pressure-vs-time graph frozen, showing the spike at t=0 and decay. White text: "Joukowsky equation: ΔP = ρcΔv." CodedLaws subscribe button.

## Audio
Low drone ambient background. At 0:10: loud metallic BANG. Subsequent echoes diminish in volume matching each bounce cycle. Subtle pipe creaking sound throughout. No voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: model pressure wave as a moving color-coded column (orange = high pressure, blue = low) advancing through the pipe; walls flex by ±5px proportional to pressure. Plot pressure-vs-time graph simultaneously. Runtime: real-time. Gotcha: wave speed in water (≈1200–1500 m/s) is much faster than typical pipe pressure; scale time axis carefully for visual clarity.
