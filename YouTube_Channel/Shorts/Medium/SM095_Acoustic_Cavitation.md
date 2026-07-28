---
title: "Acoustic Cavitation — Bubble Collapse"
id: SM095
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, cavitation, bubble-dynamics, rayleigh-plesset, ultrasonics]
---

> **What it is:** A ~45-second simulation short where an ultrasound-driven bubble expands to ten times its size then collapses in nanoseconds generating temperatures exceeding 10⁵ K and a brief flash of sonoluminescence, governed by the Rayleigh-Plesset equation and demonstrating the violent extremes of acoustic cavitation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Acoustic Cavitation — Bubble Collapse

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A microscopic view: a small bubble in water, pulsing. A powerful acoustic wave arrives — the bubble expands enormously (10× its original size), then collapses violently in a fraction of a microsecond. The collapse generates a shockwave visible as expanding rings — and a brief flash of light (sonoluminescence).

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Rayleigh-Plesset equation: ρ(RR̈ + (3/2)Ṙ²) = P_g(t) - P∞(t) - 4μṘ/R - 2σ/R. R = bubble radius. P_g = gas pressure inside bubble (polytropic: P_g = P₀(R₀/R)^(3γ)). P∞ = ambient pressure (with acoustic forcing). Caption: "Rayleigh-Plesset: the ODE of a bubble."

**0:10–0:18** — R(t) simulation: graph of bubble radius vs time. Acoustic forcing at frequency f: R expands on the tensile half-cycle, then collapses violently on the compressive half-cycle. The collapse is nearly instantaneous (R → 0 in nanoseconds). Caption: "Expansion slow; collapse violent — millisecond vs nanosecond."

**0:18–0:27** — Collapse consequences: (1) Extreme pressure at collapse: P_max ≈ 10³ GPa (more than Earth's core pressure, briefly). (2) Temperature spike: T_max ≈ 10⁵ K (briefly hotter than the sun's surface). (3) Sonoluminescence: the hot plasma emits a brief light flash (nanosecond duration). Caption: "Collapse: T > 10⁵ K, P > 1000 GPa — briefly."

**0:27–0:36** — Cavitation damage: a curved metal surface (ship propeller or hydraulic pump) surrounded by collapsing bubbles. Each collapse sends a microjet (a thin liquid jet pointed at the surface) that punches into the material. Over millions of collapses: pitting damage. Caption: "Microjet: ~500 m/s — the cause of propeller pitting."

**0:36–0:45** — Beneficial uses: (1) Ultrasonic cleaning: bubbles in a bath collapse near dirt particles, dislodging them. (2) Kidney stone lithotripsy: focused shock waves collapse bubbles adjacent to stones, fragmenting them. Caption: "Cavitation: cleaner tech and kidney stone treatment." Bold text: "Cavitation — the most violent collapse in everyday physics." Fade to black.

## Physics Concept Teased
Acoustic cavitation: a bubble driven by an acoustic pressure wave expands on the rarefaction phase, then collapses near-symmetrically on the compression phase. The Rayleigh-Plesset equation governs the collapse. The collapse generates extreme pressures (~TPa) and temperatures (~10⁵ K) for nanoseconds — hot enough for sonoluminescence and violent enough to pit steel.

## On-Screen Text / Captions
- **0:00** — "A bubble. An acoustic wave. Collapse in nanoseconds."
- **0:05** — "Rayleigh-Plesset: ρ(RR̈ + 3Ṙ²/2) = P_g - P∞ - 4μṘ/R - 2σ/R"
- **0:12** — "Expansion: slow. Collapse: near-instantaneous."
- **0:20** — "Collapse: T > 10⁵ K — briefly hotter than the sun"
- **0:28** — "Microjet: 500 m/s — punches into metal surface"
- **0:35** — "Benefit: ultrasonic cleaning, lithotripsy"
- **0:43** — "Cavitation — the universe's most violent water event."

## End Card
Final 3 seconds: the sonoluminescence flash — a brief pinprick of light against a dark background. Text: "Single-bubble sonoluminescence: a pinpoint of plasma at 25,000 K, repeating 25,000 times per second." CodedLaws logo.

## Audio
High-frequency ultrasonic whine in the background. Huge BOOM sound at bubble collapse. Brief "pop" for the light flash. Voiceover at 0:00: "A bubble collapses so fast the water inside becomes briefly hotter than the sun's surface — and it emits a flash of light." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D (R(t) graph) + animation of expanding/collapsing sphere. Key algorithm: integrate Rayleigh-Plesset ODE with an adaptive step-size RK45 (collapse is stiff — requires very small dt). P_g = P₀(R₀/R)^(3γ), γ=1.4 for adiabatic. P∞ = P₀ - P_ac·sin(2πft). For sonoluminescence: when R < R_min, set T = T₀·(R₀/R)^(3(γ-1)) and flag a light flash event. Animation: draw a circle of radius R(t)·scale on canvas. Microjet animation: schematic only (not a full NS solve). Runtime: ODE integration is fast; animation is real-time.
