---
title: "When Flow Goes Chaotic: Reynolds Number"
id: SB106
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, fluid-mechanics, reynolds-number, turbulence]
---

> **What it is:** A ~45-second simulation short where a perfectly straight red dye streak inside a pipe develops sinusoidal wiggles, then explodes into swirling multicolored chaos as a flow speed slider pushes the Reynolds number past 4000, revealing the critical threshold between smooth laminar and turbulent flow. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: When Flow Goes Chaotic: Reynolds Number
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A horizontal pipe cross-section (700px wide, 80px tall) is shown against a deep navy background. A single bright red dye streak runs perfectly straight through the exact center of the pipe from left to right — ruler-straight, not a single wobble. The pipe walls are gray. Everything is calm and orderly. In the top-right corner: "Re = 500" in green digits. The contrast of perfect order is the hook.

## Main Visual Sequence (0:03–0:50)
**0:03** — A flow speed slider on the left side of the screen begins moving upward, labeled "Flow Speed ↑." The Re counter in the top-right starts ticking upward from 500.

**0:08** — Re = 1200. The red dye streak develops tiny sinusoidal wiggles, ±3px amplitude. Label appears: "Re < 2300 → Laminar Flow." The word "Laminar" is written in calm green text below the pipe.

**0:14** — Re = 2300. The dye streak wiggles become more pronounced (±8px). The green "Laminar" label begins to flicker yellow. A dashed yellow boundary line appears: "Transition Zone (2300–4000)."

**0:20** — Re = 3000. The streak breaks into short sinusoidal waves that begin to smear outward. The boundary line flashes. Flow is clearly unstable — the streak bends, forks briefly, returns.

**0:26** — Re = 4000. The pipe explodes into color. Multiple dye streaks (red, orange, magenta) shoot out in every direction inside the pipe, mixing chaotically. Swirling vortex structures (small eddies, 15–30px) appear and disappear. Label: "Re > 4000 → Turbulent Flow." The word "Turbulent" in bold red flashes.

**0:32** — Slow-motion replay of the laminar-to-turbulent transition at Re = 2300–4000. The transition is shown as a single crisp wave that suddenly explodes. A horizontal arrow labeled "Critical Point" marks the exact location along the pipe where instability first appears.

**0:38** — The Re formula appears: "Re = ρvL/μ" in gold text. Each variable labels:
  ρ = fluid density (blue), v = velocity (cyan), L = pipe diameter (white), μ = dynamic viscosity (orange).

**0:44** — Side-by-side final comparison: Left half shows laminar dye streak (straight, red, "Re = 500"); right half shows full turbulent chaos ("Re = 8000"). A bold vertical line divides them.

**0:47** — Freeze. White bold text: "Re > 4000 = chaos. Engineers live in the laminar zone."

## Physics Concept Teased
The Reynolds number (Re = ρvL/μ) is a dimensionless ratio of inertial to viscous forces in a fluid. Below Re ≈ 2300 in a pipe, flow is laminar — smooth and predictable. Above Re ≈ 4000, flow becomes turbulent — chaotic and energy-wasting. The transition zone between 2300 and 4000 is unstable and highly sensitive to disturbances.

## On-Screen Text / Captions
- **0:03** — "Re = 500" (green digits, top-right; updates live)
- **0:08** — "Re < 2300 → Laminar Flow" (green, below pipe)
- **0:14** — "Transition Zone (2300–4000)" (yellow dashed label)
- **0:26** — "Re > 4000 → Turbulent Flow" (bold red, below pipe)
- **0:32** — "Critical Point →" (white arrow, along pipe wall)
- **0:38** — "Re = ρvL/μ" (gold, center-top)
- **0:44** — "Re = 500 | Laminar" (left panel, white), "Re = 8000 | Turbulent" (right panel, red)
- **0:47** — "Re > 4000 = chaos. Engineers live in the laminar zone." (white bold, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — and watch fluids go wild."

## Audio
Music: Starts with clean, minimal electronic melody (laminar phase), then distorts and adds chaotic percussion layers as Re increases past 4000 (turbulent phase). No voiceover. Sound effect: white noise burst when turbulence erupts at Re = 4000.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: model dye streak as a series of particles emitted from the left wall center; at low Re, particles move straight right; at high Re, apply a Perlin noise offset to each particle's Y velocity scaled by (Re - 2300). At Re > 4000, multiply noise amplitude by 3 and randomize particle color. Runtime: real-time. Gotcha: cap the number of active particles at 300 to maintain 60fps; use an object pool for particle recycling.
