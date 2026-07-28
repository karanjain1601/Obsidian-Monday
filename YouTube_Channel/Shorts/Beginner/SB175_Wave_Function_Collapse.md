---
title: "Wave Function Collapse: The Measurement Problem"
id: SB175
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, quantum-physics, wave-function, measurement]
---

> **What it is:** A ~45-second simulation short where a smooth blue probability cloud spread across five detector positions collapses in a single frame to a sharp spike the moment one detector clicks, then repeated runs build a histogram matching the original wave function, revealing the Born rule and the unsolved mystery of quantum measurement. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Wave Function Collapse: The Measurement Problem
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
An electron's wave function (a beautiful multicolored probability cloud spreading across 5 detector positions simultaneously) is shown spreading outward. A detector clicks at position #3. Instantly — in a single frame — the probability cloud collapses to a sharp spike at position #3 only. All other probability vanishes. The collapse is instantaneous and total.

## Main Visual Sequence (0:03–0:50)
**0:03** — 1D setup: 10 detector positions (gray squares, equally spaced). Electron wave function |ψ|² shown as a smooth blue Gaussian curve spread over detectors 3 through 7 (probability ~50% in this region). Detector LEDs all dark. Total probability = 1.0 (shown as integral under curve).

**0:10** — Measurement event: detector #5 activates (click sound, LED lights up green). Wave function instantaneously collapses: ALL probability density snaps to detector #5 (spike height = 1.0 at position 5, zero everywhere else). The beautiful smooth curve is gone. Label: "Before: spread over 5m. After: localized to 1 point."

**0:18** — What "collapse" means mathematically: before measurement, ψ = Σᵢ cᵢ|xᵢ⟩. Probability of detecting at xᵢ = |cᵢ|². After detection at x₅: ψ → |x₅⟩ (pure eigenstate). The non-detected possibilities don't "go somewhere" — they cease to exist. Label: "Born rule: P(xᵢ) = |cᵢ|²."

**0:27** — Many runs shown: same initial wave function, 10 measurements. Each time, a different detector fires — but the distribution of outcomes matches |cᵢ|² exactly (Born rule verified). Histogram builds up matching the original wave function shape. "Quantum mechanics is inherently probabilistic."

**0:35** — The measurement problem: what physically causes collapse? Copenhagen interpretation: "observation causes it." Many Worlds: "no collapse — universe branches." Pilot wave theory: "hidden variables guide it." Three icons shown. "Still debated after 100 years."

**0:43** — Schrödinger equation is perfectly smooth and deterministic — it never collapses. Collapse is added as a postulate. "The most mysterious unsolved problem in physics." CodedLaws logo.

## Physics Concept Teased
Wave function collapse is the sudden transition of a quantum system from a superposition of all possible states to a single definite state upon measurement. The probability of each outcome is given by the Born rule (P = |ψ|²). What physically causes collapse — and whether it's instantaneous or gradual — remains an unsolved foundational problem in quantum mechanics.

## On-Screen Text / Captions
- 0:03 → "Wave function spread across positions 3-7"
- 0:10 → "Detector clicks → collapse to single point"
- 0:18 → "Born rule: P(xᵢ) = |⟨xᵢ|ψ⟩|²"
- 0:27 → "10 measurements → distribution = |ψ|²"
- 0:35 → "What causes collapse? Still debated."
- 0:43 → "Schrödinger equation never collapses on its own"

## End Card
Final 3 seconds: Smooth wave function → instantaneous spike. Text: "Measurement changes everything. Always." CodedLaws subscribe.

## Audio
Deeply contemplative ambient drone music, 55 BPM. Detector click at 0:10: sharp metallic "tic." At 0:35 (three interpretations): three distinct tones played successively (Copenhagen = clear bell, Many Worlds = echo-heavy reverb, Pilot Wave = low bass). Voiceover: "Before you look, it's everywhere. The instant you look — it's one place. No one knows why."

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: pre-compute |ψ|² distribution; animate wave function as smooth curve; on measurement, trigger instant tween from smooth curve to Dirac delta (sharp spike) at sampled position (use Born rule sampling); for histogram mode, accumulate outcomes as vertical bars. Runtime: real-time. Gotcha: the collapse must be visually instantaneous (1 frame) to convey its non-classical instantaneous character; any gradual collapse animation misrepresents the physics.
