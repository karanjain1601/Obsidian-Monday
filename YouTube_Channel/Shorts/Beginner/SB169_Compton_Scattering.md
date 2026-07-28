---
title: "Compton Scattering: Photons Have Momentum"
id: SB169
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, quantum-physics, compton-scattering, photons]
---

> **What it is:** A ~45-second simulation short where a blue X-ray zigzag strikes a stationary electron and bounces off as a redder, visibly longer-wavelength zigzag while the electron recoils at an angle, revealing that photons carry momentum and collide with matter exactly like billiard balls. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Compton Scattering: Photons Have Momentum
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
An X-ray photon (short blue zigzag line, wavelength λ = 0.071nm labeled) streaks in from the left and hits a stationary electron (white dot). The photon bounces off at an angle — now red (longer wavelength 0.073nm, visibly different). The electron recoils in the other direction. A billiard-ball collision between light and matter.

## Main Visual Sequence (0:03–0:50)
**0:03** — Setup: incoming X-ray photon (blue zigzag, λ₀ = 0.071 nm, traveling right). Stationary electron (white dot, m_e = 9.11×10⁻³¹ kg) at center of screen. Momentum vector of photon: p = h/λ = 9.34×10⁻²⁴ kg·m/s (blue arrow, pointing right).

**0:10** — Collision occurs. Photon deflects at angle θ = 60° (shown as protractor). Now travels as red zigzag. Electron recoils at complementary angle φ (blue arrow, downward-right). "Conservation of momentum — both x and y components."

**0:18** — Compton shift formula appears: Δλ = λ_C·(1 − cosθ). Compton wavelength λ_C = h/(m_e·c) = 0.00243 nm. At θ=60°: Δλ = 0.00243×(1−0.5) = 0.00122 nm. New wavelength: λ' = 0.071 + 0.001 = 0.072 nm. Calculated on screen step by step.

**0:27** — Energy transferred to electron: ΔE = hc/λ₀ − hc/λ'. The longer the scattered wavelength, the lower the photon energy — and the more energy the electron received. Angle slider: as θ increases from 0° to 180°, Δλ increases (more energy transferred at larger deflection angles).

**0:35** — Key proof: classical wave theory cannot explain this. If light were a wave, it would scatter identically regardless of direction (Thomson scattering). But Compton scattering depends on angle — only particles with momentum can do this. "Light has momentum: p = h/λ."

**0:43** — Application: Compton scattering used in gamma-ray astronomy (Compton Gamma Ray Observatory). CodedLaws logo.

## Physics Concept Teased
Compton scattering demonstrates that photons carry momentum (p = h/λ). When an X-ray photon collides with a free electron, it transfers both energy and momentum — causing the scattered photon to emerge with a longer wavelength (Δλ = λ_C(1−cosθ)), exactly as predicted by treating the photon as a particle in a billiard-ball collision.

## On-Screen Text / Captions
- 0:03 → "Photon momentum: p = h/λ = 9.34×10⁻²⁴ kg·m/s"
- 0:10 → "Photon deflects — electron recoils"
- 0:18 → "Δλ = λ_C(1−cosθ) = 0.00122 nm"
- 0:27 → "Larger angle → more energy to electron"
- 0:35 → "Classical waves can't explain this angle dependence"
- 0:43 → "Light behaves like a particle with momentum"

## End Card
Final 3 seconds: Before/after photon wavelength comparison (blue vs red zigzags, side by side). Text: "Light has momentum. Compton proved it." CodedLaws subscribe.

## Audio
Sharp, high-energy sound at collision moment. Electronic ambient music, 90 BPM. Voiceover: "Shine X-rays at electrons — and the light comes back with a longer wavelength. Billiard physics for photons." No other voiceover.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: animate incoming photon as a traveling sine wave with frequency-coded color (blue, short λ); at collision, freeze frame briefly, then launch scattered photon (red, longer λ) and recoiling electron; draw momentum vectors as arrows scaled to magnitude; show angle as animated arc. Runtime: real-time (single-event animation, then loop). Gotcha: wavelength difference is tiny (< 2%) — exaggerate the color shift for visual clarity; use color (wavelength → hue) rather than pixel-scale wavelength.
