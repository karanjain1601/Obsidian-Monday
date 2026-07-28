---
title: "Heisenberg: The More You Know Position…"
id: SB171
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, quantum-physics, heisenberg-uncertainty, quantum-mechanics]
---

> **What it is:** A ~45-second simulation short where a Gaussian electron wave packet is squeezed into a sharp position spike on one panel while its momentum distribution simultaneously explodes into a broad smear on the other, revealing that Δx·Δp ≥ ħ/2 is a fundamental wave property, not a measurement flaw. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Heisenberg: The More You Know Position…
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Two side-by-side boxes. Left: an electron's position shown as a very narrow bright spike (Δx tiny, precise). Its momentum is a wild, broad, noisy spread across all values (Δp huge). Right: the opposite — position is a broad fuzzy blob, but momentum is a sharp spike. As one sharpens, the other blurs. The trade-off is immediate and visual.

## Main Visual Sequence (0:03–0:50)
**0:03** — Single box shown: electron wave packet (yellow-green Gaussian envelope) in position space (X-axis). Width Δx = 1.0 nm. Corresponding momentum distribution shown below (Fourier transform, same Gaussian shape). Width Δp = ħ/2Δx = 5.27×10⁻²⁶ kg·m/s. Both labeled. Product: Δx·Δp = ħ/2 (minimum uncertainty state shown in green — coherent state).

**0:10** — Slider: Δx compressed to 0.1nm (position more certain). Watch: Δp explodes to 5.27×10⁻²⁵ kg·m/s (10× larger). Heisenberg relation: Δx·Δp ≥ ħ/2. Product stays at ħ/2. "Squeeze position → momentum spreads."

**0:18** — Visual analogy: short burst of sound (precise in time) vs long pure tone (precise in frequency). Neither can be both precisely timed AND precisely pitched simultaneously — this is wave mathematics, not observer clumsiness. Label: "Not about measurement disturbing the particle — it's fundamental."

**0:27** — Energy-time uncertainty: ΔE·Δt ≥ ħ/2. Application: excited atomic state lifetime Δt = 1ns → energy uncertainty ΔE = ħ/(2Δt) = 3.3×10⁻²⁶ J → spectral line has a natural linewidth of 5.3 MHz. Spectral line shown with measured width.

**0:35** — Nuclear implication: electron confined to nucleus (Δx = 10⁻¹⁵ m). Required Δp = ħ/2Δx = 5.27×10⁻²⁰ kg·m/s. KE = Δp²/2m_e = 150 MeV — far exceeding nuclear binding energy. "Electrons CANNOT exist inside nuclei — Heisenberg proves it."

**0:43** — Caption: "Uncertainty is not ignorance — it's the fabric of quantum reality." Δx·Δp ≥ ħ/2 displayed. CodedLaws logo.

## Physics Concept Teased
The Heisenberg uncertainty principle (Δx·Δp ≥ ħ/2) is not a statement about measurement limitations — it reflects the fundamental wave nature of matter. A particle with a well-defined position has a wave packet narrow in space but broad in momentum space (many Fourier components). Position and momentum cannot simultaneously be sharply defined, regardless of how carefully we measure.

## On-Screen Text / Captions
- 0:03 → "Δx·Δp ≥ ħ/2 — minimum uncertainty"
- 0:10 → "Narrow position → wide momentum spread"
- 0:18 → "Wave math — not a measurement problem"
- 0:27 → "ΔE·Δt ≥ ħ/2 — spectral line width"
- 0:35 → "Electrons can't fit inside nuclei — Heisenberg says no"
- 0:43 → "Uncertainty is the fabric of reality"

## End Card
Final 3 seconds: Position-momentum trade-off animation looping (narrow↔broad, broad↔narrow). Text: "Δx·Δp ≥ ħ/2. Always." CodedLaws subscribe.

## Audio
Thoughtful, philosophical ambient music, 60 BPM. The wave packet compression accompanied by a rising pitch (higher frequency = narrower packet). Voiceover: "You can know where it is, or how fast it's going. Never both. That's not a limitation — it's physics."

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: represent the electron as a Gaussian wave packet ψ(x) = exp(−x²/4σ²); its Fourier transform is also Gaussian with width ∝ 1/σ; display both in real time as σ is controlled by a slider; compute and display Δx and Δp; show their product staying at ħ/2. Runtime: real-time, FFT-based or analytical. Gotcha: use analytical Gaussian formulas rather than numerical FFT for clean real-time behavior; label the relationship between σ (standard deviation of wave packet) and Δx (quantum uncertainty = σ in position space).
