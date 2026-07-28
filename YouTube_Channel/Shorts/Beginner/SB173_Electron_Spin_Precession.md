---
title: "Electron Spin: A Tiny Magnetic Top"
id: SB173
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, quantum-physics, spin, magnetic-moment, precession]
---

> **What it is:** A ~45-second simulation short where a red magnetic moment arrow on a glowing blue electron traces a perfect precession cone around a vertical magnetic field, then a Stern-Gerlach setup shows only two discrete spots on a screen, revealing that electron spin is a quantized intrinsic quantum property with no classical analog. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Electron Spin: A Tiny Magnetic Top
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A glowing blue electron (tiny sphere) suddenly develops an intrinsic magnetic moment arrow (red, pointing up). A strong blue magnetic field B₀ is switched on vertically. The magnetic moment arrow doesn't align — instead it precesses like a gyroscope, tracing a perfect cone. The Larmor precession is hypnotic: a steady, perfectly circular spin around the field axis.

## Main Visual Sequence (0:03–0:50)
**0:03** — Electron shown at center (blue sphere, diameter 30px). Magnetic moment arrow (μ, red, 60px long) pointing at 45° from vertical. External magnetic field B₀ = 1 Tesla (blue vertical arrow, 100px tall, pointing upward). Label: "Electron spin quantum number: s = ½."

**0:10** — Precession begins: the magnetic moment traces a cone around B₀. Larmor precession frequency: ω_L = γ_e·B₀ where γ_e = 1.76×10¹¹ rad/(s·T). At B₀ = 1T: ω_L = 1.76×10¹¹ rad/s (28 GHz). "That's microwave frequency!" Label shown.

**0:18** — Zoom out: Stern-Gerlach experiment setup. Electron beam passes through inhomogeneous magnetic field (gradient). Screen at right shows only TWO spots — spin-up (top, green) and spin-down (bottom, red). "Not a smear — only two values! Spin is quantized: m_s = +½ or −½."

**0:27** — Energy diagram: in magnetic field, spin-up state (m_s = +½) has energy E = +½·g_e·μ_B·B₀ (higher) and spin-down (m_s = −½) has lower energy. Energy splitting ΔE = g_e·μ_B·B₀ = 9.27×10⁻²⁴ × 1 = 9.27×10⁻²⁴ J. This is Zeeman splitting. EPR/ESR measurement at this frequency detects spin.

**0:35** — Spin flip: a microwave photon at exactly the Larmor frequency (28 GHz) flips spin from down to up. Energy absorbed = ΔE. This is the basis of Electron Spin Resonance (ESR) spectroscopy — used in chemistry and material science.

**0:43** — Connection to MRI: proton spin (similar but at radiofrequencies) is used in MRI scanners. "Your doctor's MRI uses the same spin physics at different frequencies." CodedLaws logo.

## Physics Concept Teased
Electron spin is an intrinsic quantum property (s = ½) that acts like a tiny magnetic dipole. In a magnetic field, spin can only point "up" (m_s = +½) or "down" (m_s = −½) — never anything in between. The energy difference between these states causes Larmor precession at microwave frequencies, enabling electron spin resonance spectroscopy and underlying the physics of MRI.

## On-Screen Text / Captions
- 0:03 → "Spin s = ½ — intrinsic quantum property"
- 0:10 → "Larmor frequency ω_L = γ_e·B₀ = 28 GHz at 1T"
- 0:18 → "Stern-Gerlach: only TWO spots (spin quantized)"
- 0:27 → "Zeeman splitting: ΔE = g_e·μ_B·B₀"
- 0:35 → "28 GHz photon flips spin — ESR spectroscopy"
- 0:43 → "MRI uses proton spin — same physics"

## End Card
Final 3 seconds: Electron precessing in 3D with cone trace visible. Text: "Spin: the universe's smallest magnet." CodedLaws subscribe.

## Audio
Gentle, high-pitched electronic tone at 28 GHz mapped down to audible range (280 Hz, 100× slower). Precession animation accompanied by this steady tone. Voiceover: "The electron spins — but don't imagine a literal spinning sphere. Spin is purely quantum, with no classical analogy."

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D or WebGL. Key visual trick: draw electron as circle; draw magnetic moment vector as arrow rotating in a tilted plane around the vertical B₀ axis (3D projected to 2D using rotation matrix); trace the cone tip as a fading circle; animate at slowed-down precession rate (1 revolution per second, not 28 GHz). Runtime: real-time. Gotcha: do NOT animate the electron as a rotating ball (implies classical spin) — only show the magnetic moment vector precessing.
