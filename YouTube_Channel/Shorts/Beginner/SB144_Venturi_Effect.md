---
title: "Venturi Effect: Faster Flow, Lower Pressure"
id: SB144
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, fluid-mechanics, bernoulli, venturi]
---

> **What it is:** A ~45-second simulation short where blue fluid accelerates through a narrow pipe throat and the pressure gauge above it plunges from 3 bar to 0.6 bar in real time — showing that faster flow through a constriction must produce lower pressure, as required by Bernoulli's principle. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Venturi Effect: Faster Flow, Lower Pressure
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A wide blue pipe suddenly narrows to one-third its width at the center (a venturi throat). As the fluid accelerates through the narrow section, pressure gauges mounted above the pipe show the needle plunging from 3 bar to 1 bar — while the flow visibly brightens and speeds up. The pressure drop looks counterintuitive and arresting.

## Main Visual Sequence (0:03–0:50)
**0:03** — Full venturi tube shown (wide-narrow-wide profile, dark grey walls). Blue water flows left-to-right. Three vertical pressure gauge columns above: gauge 1 (wide, left), gauge 2 (throat), gauge 3 (wide, right). All read 3 bar initially.

**0:10** — Flow activated. Wide section: blue particles move at 1 m/s (slow, spread out). Throat: same particles accelerate to 9 m/s (fast, bunched together, color brightens to cyan). Continuity equation annotated: "A₁v₁ = A₂v₂."

**0:18** — Pressure gauges update: Gauge 1 = 3.0 bar (green), Gauge 2 = 0.6 bar (red — low!), Gauge 3 = 3.0 bar (green). The throat gauge needle points almost to zero. Arrow from gauge 2 with label "Low pressure here."

**0:27** — Bernoulli equation appears as a banner: "P + ½ρv² = constant." Terms light up: when v↑ (throat), P↓ to compensate. Animation shows the kinetic energy term (½ρv²) glowing bright yellow in the throat.

**0:35** — Application: carburetor side-by-side. Air flows through venturi in carburetor; low throat pressure sucks fuel droplets from a fuel jet. Fuel mist shown as orange dots entering the airstream.

**0:43** — Application 2: Venturi flowmeter — measuring flow rate from pressure difference. Formula: Q = A·√(2ΔP/ρ). CodedLaws logo.

## Physics Concept Teased
By conservation of energy (Bernoulli's principle), when fluid speeds up through a constriction, its pressure must drop. The narrower the throat, the faster the flow and the lower the pressure — a counterintuitive but universal result that underlies carburetors, atomizers, and flow meters.

## On-Screen Text / Captions
- 0:03 → "Same fluid, same pipe — pressure changes?"
- 0:10 → "A₁v₁ = A₂v₂ (continuity)"
- 0:18 → "Throat pressure: 3.0 → 0.6 bar"
- 0:27 → "P + ½ρv² = constant (Bernoulli)"
- 0:35 → "Application: carburetor fuel mixing"
- 0:43 → "Application: flow measurement"

## End Card
Final 3 seconds: Venturi tube with glowing throat section. Text: "Bernoulli's principle at work." CodedLaws subscribe prompt on right.

## Audio
Smooth, flowing ambient electronic music, 80 BPM. Voiceover at 0:27: "Speed up the flow — and pressure drops. That's Bernoulli." Rushing water sound effect that intensifies at the throat section.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: draw particles as color-coded dots; particle speed inversely proportional to cross-sectional area; pressure gauge needle driven by P = P₀ − ½ρ(v²−v₀²). Runtime: real-time. Gotcha: maintain mass continuity exactly — number of particles entering must equal number leaving per unit time.
