---
title: "Gravity Current — Dense Fluid Underflow"
id: SM099
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, gravity-current, density-driven-flow, turbidity-current]
---

> **What it is:** A ~45-second simulation short where cold dense saline water races along the bottom of a lighter fresh-water tank with a characteristic blunt head and Kelvin-Helmholtz billows along its upper boundary, demonstrating Benjamin's universal gravity-current Froude number of 0.707 and how turbidity currents sculpt the ocean floor. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Gravity Current — Dense Fluid Underflow

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Side-view: a dark dense fluid (cold saline water) is released at the left side. It races along the bottom of a tank filled with lighter fresh water, forming a distinct head with raised lobes. The dense fluid undercuts everything above it — a gravity current charging across the ocean floor.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Gravity current head: the front has a characteristic shape — a blunt "head" (deeper than the body), then an elevated "nose" at the leading edge where the dense fluid wedges under the ambient. Caption: "Head: deeper than body; Nose: raised — stable stratification."

**0:10–0:18** — Benjamin's theory: the head height h_head ≈ 2/3 × body height h_body (for deep ambient). Froude number at the head: Fr_head = U_head/√(g'h_body) ≈ 1/√2 ≈ 0.707, where g' = g·Δρ/ρ (reduced gravity). Caption: "Fr = U/√(g'h) ≈ 0.707 — Benjamin's theorem." Head speed: U = 0.707·√(g'·H).

**0:18–0:27** — Kelvin-Helmholtz billows at the upper boundary: the density interface above the current shows KH instability — billows of ambient fluid being entrained. Caption: "Entrainment: KH billows above the head mix ambient into the current." The current head dilutes as it advances.

**0:27–0:36** — Real-world: (1) Cold Arctic water plunging below warmer Atlantic water in the North Atlantic. (2) Turbidity currents: dense, sediment-laden flows on the ocean floor — deposit submarine fans (the world's largest sedimentary deposits). (3) Powder snow avalanche (cold dense air + snow). Caption: "Turbidity currents: sculpt the ocean floor."

**0:36–0:45** — Lab experiment comparison: the real laboratory saltwater gravity current filmed at the same scale as the simulation. The head shape, speed, and KH billow pattern match the simulation. Caption: "Simulation vs lab: excellent agreement." Bold text: "Gravity currents — density-driven rivers beneath the sea." Fade to black.

## Physics Concept Teased
Gravity current: a buoyancy-driven flow where dense fluid slides under lighter ambient fluid (or light fluid rises over dense). The head Froude number Fr ≈ 0.707 (for deep ambient) is a universal result from Benjamin (1968). Entrainment via Kelvin-Helmholtz instability dilutes the current. Turbidity currents on the ocean floor are the largest sediment-transport mechanism on Earth.

## On-Screen Text / Captions
- **0:00** — "Dense fluid undercuts lighter fluid — gravity current."
- **0:05** — "g' = g·Δρ/ρ — reduced gravity"
- **0:12** — "Fr_head = U/√(g'h) ≈ 0.707 — Benjamin's theorem"
- **0:20** — "KH billows: ambient entrained into the head"
- **0:28** — "Turbidity currents: sculpt the ocean floor"
- **0:35** — "Simulation matches lab — Benjamin's theory confirmed"
- **0:43** — "Gravity currents — density-driven rivers under the sea."

## End Card
Final 3 seconds: the gravity current head advancing with KH billows above it. Text: "1929 Grand Banks earthquake triggered a turbidity current that snapped telegraph cables across 1000 km." CodedLaws logo.

## Audio
Oceanic deep-water ambient. Low, rolling turbid sound as the gravity current advances. Voiceover at 0:00: "When cold dense water plunges beneath lighter water, it forms a gravity current — and these carry sediment across the entire ocean floor." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: WebGL or Canvas 2D. Key algorithm: 2D incompressible NS with Boussinesq buoyancy (same as SM001 but with a horizontal lock-release initial condition). Dense fluid occupies the left half of the domain, light fluid the right. Lock is released at t=0. Gravity acts downward. DNS at Re~1000: 1024×256 grid. KH billows form at the top of the dense fluid. Colour: density field (dense=blue, light=yellow). Head tracking: find the rightmost extent of the dense fluid front. Plot head position vs time: should grow as t^(1/2) for diffusive spreading or linearly for Benjamin's regime. Runtime: pre-rendered WebGL DNS; approximate gravity current from shallow-water model real-time.
