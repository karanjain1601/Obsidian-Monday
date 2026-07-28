---
title: "PV = nRT: The Ideal Gas Law Animated"
id: SB156
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, thermodynamics, ideal-gas, kinetic-theory]
---

> **What it is:** A ~45-second simulation short where 50 bouncing blue molecules in a piston-cylinder are compressed, heated at constant pressure, and heated at constant volume in three sequential demos — showing that Boyle's, Charles's, and Gay-Lussac's laws are all special cases of the single equation PV = nRT. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: PV = nRT: The Ideal Gas Law Animated
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A piston-cylinder (grey metal, glass walls) contains 50 bouncing blue gas molecules at room temperature. The piston is pushed down — instantly the molecules are compressed into half the volume, colliding with the walls twice as often, and the pressure gauge doubles from 1 atm to 2 atm. The physics is instantaneous and visual.

## Main Visual Sequence (0:03–0:50)
**0:03** — Cylinder shown (300px tall × 200px wide). Piston at mid-height. 50 blue spheres (molecules) bouncing elastically in lower half. Readouts at top: P = 1.0 atm, V = 1.0 L, T = 300K, n = 0.04 mol. PV=nRT shown: (1.0)(1.0) = (0.04)(0.0821)(300) = 0.985 ✓.

**0:10** — Demo 1 — Isothermal compression (T fixed): piston pushed down slowly to half volume. V = 0.5 L. Molecules compress — collision rate with walls doubles. P = 2.0 atm. Graph: P vs V hyperbola plots (PV = constant, Boyle's Law). Text: "Isothermal: PV = constant."

**0:18** — Demo 2 — Isobaric heating (P fixed, piston free to move): temperature slider moved from 300K → 600K. Molecules speed up (blue → orange color). Piston rises: V doubles to 1.0 L. Pressure stays at 1.0 atm. Text: "Isobaric: V/T = constant (Charles's Law)."

**0:27** — Demo 3 — Isochoric heating (V fixed, piston locked): T from 300K → 600K with piston locked. Molecules hit walls harder and more often. P rises from 1.0 → 2.0 atm. Text: "Isochoric: P/T = constant (Gay-Lussac's Law)."

**0:35** — All three laws unified: PV = nRT equation glows in center. Each variable lights up: P (red), V (blue), n (green), R (gold constant), T (orange). "Three laws — one equation."

**0:43** — Real-world application: car tire heating on hot road. T rises → P rises (isochoric inside tire). "Check tire pressure in summer!" CodedLaws logo.

## Physics Concept Teased
The ideal gas law (PV = nRT) unifies Boyle's, Charles's, and Gay-Lussac's laws into one relationship between pressure, volume, temperature, and moles of gas. Each of the classical gas laws is a special case where one variable is held constant while the others vary.

## On-Screen Text / Captions
- 0:03 → "PV = nRT — the universal gas law"
- 0:10 → "Compress volume → pressure doubles (Boyle)"
- 0:18 → "Heat gas → volume doubles (Charles)"
- 0:27 → "Lock volume, heat gas → pressure doubles (Gay-Lussac)"
- 0:35 → "Three laws. One equation: PV = nRT"
- 0:43 → "Car tire: heat → pressure rises!"

## End Card
Final 3 seconds: PV = nRT glowing in orange on dark background. Text: "Every gas obeys this law." CodedLaws subscribe button.

## Audio
Clean, minimal electronic music, 85 BPM. Each demo (0:10, 0:18, 0:27) has a distinct pitched chime for the variable that changes. Voiceover at 0:35: "Pressure, volume, temperature — change one, and the others follow." Soft molecule bouncing sounds throughout.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: simulate 50 molecules as elastic spheres in a 2D box; make piston height and temperature interactive sliders; compute pressure as force per unit wall area from collision rate; display PV and nRT and show they match. Runtime: real-time. Gotcha: the 2D simulation doesn't exactly reproduce 3D ideal gas — scale collision frequency to match PV=nRT numerically by calibration.
