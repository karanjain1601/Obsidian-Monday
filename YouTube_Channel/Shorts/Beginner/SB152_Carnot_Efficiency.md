---
title: "Carnot Limit: No Heat Engine Is Perfect"
id: SB152
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, thermodynamics, carnot, heat-engine, efficiency]
---

> **What it is:** A ~45-second simulation short where animated energy-flow arrows between a glowing orange hot reservoir and a blue cold reservoir show 62.5% of heat converted to work and the rest discarded — revealing that Carnot efficiency η = 1 − T_C/T_H is the absolute ceiling no real engine can exceed. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Carnot Limit: No Heat Engine Is Perfect
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A glowing orange "hot reservoir" block (800K, blazing) sits at the top of the screen. A deep blue "cold reservoir" block (300K, icy) sits at the bottom. Between them, a piston-cylinder engine glows green. Numbers appear: efficiency = 62.5%. Then a red X appears through a "100% efficient" label — no engine can ever reach it.

## Main Visual Sequence (0:03–0:50)
**0:03** — Heat engine diagram: hot reservoir (orange rectangle, T_H = 800K) at top, cold reservoir (blue rectangle, T_C = 300K) at bottom. Engine block (silver piston-cylinder) in center. Three arrows: Q_H flows down (red, from hot), W work exits right (green), Q_C flows down (blue, to cold).

**0:10** — Numbers fill in: Q_H = 100 J entering engine (red bar fills). W = 62.5 J useful work (green bar). Q_C = 37.5 J dumped to cold reservoir (blue bar). Efficiency η = W/Q_H = 62.5%. Carnot formula: η = 1 − T_C/T_H = 1 − 300/800 = 62.5%.

**0:18** — Real engine comparison: same setup but engine glows dull grey. Work output = 35 J (real internal combustion engine). Efficiency = 35%. Gap between 35% and 62.5% highlighted in yellow: "Irreversible losses — friction, heat leakage."

**0:27** — Interactive temperature slider: T_C changes from 300K → 600K. Carnot efficiency drops from 62.5% → 25%. Visualization: green work bar shrinks. Message: "Cold reservoir must be cold — that's why we need cooling systems."

**0:35** — Why can't we reach 100%? T_C must equal 0K (absolute zero). Impossible by Third Law. Text: "Third Law of Thermodynamics: can't reach 0K." Blue absolute zero indicator appears.

**0:43** — Summary bar chart: Carnot 62.5% (gold), Real engine 35% (grey), Steam turbine 45% (silver), Fuel cell 60% (green). Caption: "Carnot is the ceiling." CodedLaws logo.

## Physics Concept Teased
The Carnot efficiency (η = 1 − T_C/T_H) is the theoretical maximum for any heat engine operating between two temperatures. All real engines fall below this limit due to irreversible processes. Reaching 100% would require the cold reservoir to be at absolute zero — physically impossible.

## On-Screen Text / Captions
- 0:03 → "T_H = 800K, T_C = 300K — what's the max efficiency?"
- 0:10 → "η_Carnot = 1 − T_C/T_H = 62.5%"
- 0:18 → "Real engine: only 35%"
- 0:27 → "Warmer cold reservoir = less work possible"
- 0:35 → "100% needs T_C = 0K — impossible"
- 0:43 → "Carnot efficiency is the ceiling"

## End Card
Final 3 seconds: Carnot efficiency formula glowing on dark background: η = 1 − T_C/T_H. Text: "The Second Law won't let you cheat." CodedLaws subscribe button.

## Audio
Warm, mechanical ambient sound (steam engine rhythm, 80 BPM). Voiceover at 0:18: "Every real engine wastes heat. Carnot tells you the least you can waste." No other voiceover.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: three animated flow arrows (Q_H, W, Q_C) with widths proportional to their energy values; update widths when temperature sliders change; show Carnot formula updating numerically in real time. Runtime: real-time. Gotcha: ensure Q_H = W + Q_C at all times for energy conservation display; avoid showing efficiency above Carnot limit even accidentally.
