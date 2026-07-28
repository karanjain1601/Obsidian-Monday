---
title: "Polarizers: Blocking Half the Light"
id: SB118
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, optics, polarization, light]
---

> **What it is:** A ~45-second simulation short where a multi-colored light bundle is progressively sliced by polarizer grids at 0°, 45°, and 90° — the screen going pitch black when only crossed 0° and 90° filters remain — then counterintuitively re-lit by inserting the 45° filter between them, demonstrating Malus's Law and the wave nature of polarization. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Polarizers: Blocking Half the Light
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
An electromagnetic wave travels rightward from the left edge: a bright white sinusoidal wave oscillating in all planes simultaneously, shown as multiple colored sine curves (red = vertical, blue = horizontal, yellow = diagonal, green = anti-diagonal) all layered on top of each other — a messy, vibrant bundle of light. To the right: a gray vertical-slatted polarizer grid (like prison bars), and beyond it an empty white screen. The wave approaches the grid with full intensity.

## Main Visual Sequence (0:03–0:50)
**0:03** — The unpolarized wave enters the first polarizer grid (vertical slats, 0°). A filter animation: the red (vertical) component passes through; the blue, yellow, green components are blocked — shown as the wave being sliced. Only the pure red vertical sinusoidal wave emerges from the right side of the first grid. Label: "Polarizer 1: 0° (vertical) — passes vertical oscillation only."

**0:10** — An intensity meter on the far right shows: "Before filter: 100% | After filter 1: 50%." A bright white → medium white gradient shows the light dimming by half. Label: "50% blocked. 50% passes."

**0:16** — A second polarizer grid appears to the right of the first, this one angled at 45° (its slats are diagonal). The vertical red wave hits the 45° grid. Malus's Law animation: the wave component along the 45° direction is projected — its amplitude is A·cos(45°) = A/√2. Intensity = cos²(45°) = 50%. The transmitted wave is now smaller and rotated to 45°. Label: "Malus's Law: I = I₀·cos²θ."

**0:24** — Intensity meter updates: "After filter 2 (45°): 25% of original." The wave is now orange (mix of the dimmer signal). The screen behind the two filters is dim but not dark.

**0:30** — A third polarizer appears at 90° (horizontal slats). The 45° polarized wave hits it. The component along horizontal: A·cos(45°) = A/√2. Intensity = I₂·cos²(45°) = 12.5% of original. Label: "After filter 3 (90°): 12.5%."

**0:34** — Dramatic moment: the third filter is removed, leaving just filters 1 (0°) and 3 (90°). The vertical wave (0°) hits the 90° horizontal filter. Projection of vertical onto horizontal = cos(90°) = 0. The wave is completely blocked. The screen goes pitch black. Label: "0° and 90° polarizers = complete darkness!"

**0:38** — White flash of disbelief effect: "But wait — " text appears. The 45° filter is reinserted between the 0° and 90° filters. Light reappears on the screen (12.5%). Label: "Adding a filter at 45° actually LETS LIGHT THROUGH again!" The screen goes from black to a dim glow — counterintuitive result highlighted with an orange "!" badge.

**0:44** — Malus's Law graph: x-axis (angle 0°–180°), y-axis (intensity 0–100%). A smooth cos² curve is drawn. Key points labeled: "0° → 100%, 45° → 50%, 90° → 0%." Curve is gold.

**0:47** — Freeze. Bold white text: "Rotate a polarizer 90° → zero light. Add one in between → some light returns."

## Physics Concept Teased
A polarizer transmits only the component of an electromagnetic wave oscillating along its transmission axis. When two polarizers are crossed at 90°, no light passes. Malus's Law (I = I₀·cos²θ) governs how much intensity survives each filter based on the angle between the wave's polarization and the filter axis. Counterintuitively, inserting a third filter between crossed polarizers at 45° allows some light through by rotating the polarization plane stepwise.

## On-Screen Text / Captions
- **0:03** — "Polarizer 1: 0° (vertical)" (white label, on first grid)
- **0:10** — "Before: 100% | After filter 1: 50%" (white, intensity meter)
- **0:10** — "50% blocked. 50% passes." (white italic, below meter)
- **0:16** — "Malus's Law: I = I₀·cos²θ" (gold, top-center)
- **0:16** — "Polarizer 2: 45°" (white, second grid label)
- **0:24** — "After filter 2: 25% of original" (white, meter)
- **0:30** — "After filter 3 (90°): 12.5%" (white, meter)
- **0:34** — "0° + 90° = complete darkness!" (bold red, center)
- **0:38** — "Adding a 45° filter lets light through again!" (orange bold, center)
- **0:44** — Curve labels: "0° → 100%", "45° → 50%", "90° → 0%" (white on gold curve)
- **0:47** — "Rotate 90° → zero light. Add one in between → light returns." (bold white)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — light does weird things."

## Audio
Music: Smooth electronic ambient with a spacious, optical feel, 75 BPM. Sound effects: a soft dimming tone when each filter is added (frequency decreases); a dramatic silence when the screen goes black at 0:34; a surprised ascending tone when light returns at 0:38. No voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: represent unpolarized light as 6 overlapping sine waves at different angles (0°, 30°, 60°, 90°, 120°, 150°), each drawn with ctx.save()/rotate()/restore(). After each polarizer, reduce to one sine wave at the polarizer angle with amplitude = A·cos(angle_between_wave_and_filter). Intensity meter is a simple filled rectangle, width proportional to intensity. Runtime: real-time. Gotcha: accurately demonstrating Malus's Law requires chaining the cos² computation correctly through each filter: I₃ = I₀ · cos²(θ₁→θ₂) · cos²(θ₂→θ₃), not computing each angle from the original source independently.
