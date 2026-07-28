---
title: "Faraday's Law: Moving Magnet, Free Electricity"
id: SB165
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, electromagnetism, faradays-law, induction]
---

> **What it is:** A ~45-second simulation short where a bar magnet thrust into a copper coil slams a galvanometer needle right and pulling it out slams it left, revealing that changing magnetic flux — not the magnet itself — generates EMF via Faraday's and Lenz's laws. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Faraday's Law: Moving Magnet, Free Electricity
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A bar magnet (red N pole, blue S pole) is thrust into a copper coil (8 turns, warm orange). The galvanometer needle at the right immediately slams to the right (deflection). The magnet is pulled out — the needle slams left. Stop moving the magnet — needle returns to zero. The connection is instant and dramatic.

## Main Visual Sequence (0:03–0:50)
**0:03** — Circuit: copper coil (8 turns, orange, front view) connected to galvanometer (circular dial, needle at center zero). Magnet held stationary 10cm from coil. Magnetic flux lines (blue arrows) penetrate the coil. Flux Φ = B·A·cosθ = constant. Galvanometer reads 0V.

**0:10** — Magnet pushed into coil at 5 cm/s. Flux through coil increases. EMF = −N·dΦ/dt (Faraday's law). Induced current flows counterclockwise (shown by orange current arrows in coil). Galvanometer needle deflects to +3 mA. Lenz's law: coil becomes a magnet opposing the incoming N pole (left face = N, repelling). Label: "Lenz's law: opposition."

**0:18** — Magnet pushed FASTER at 20 cm/s. Needle deflects to +12 mA — 4× larger EMF for 4× faster motion. Demonstrates EMF ∝ dΦ/dt ∝ speed. Label: "Faster magnet = more EMF."

**0:27** — Magnet stopped inside coil. Flux constant → dΦ/dt = 0 → EMF = 0. Needle returns to zero. Coil does nothing. Label: "Changing flux = EMF. Constant flux = nothing."

**0:35** — Magnet pulled out. Flux decreases → EMF reverses polarity. Current flows clockwise. Needle deflects to −4 mA. Coil now repels the departing magnet (right face = S, attracting back). "Lenz's law again — always opposing."

**0:43** — Scale up: generator diagram. Rotating magnet inside many-turn coil — output is AC sinusoidal voltage. "This is how every power plant makes electricity." CodedLaws logo.

## Physics Concept Teased
Faraday's law states that a changing magnetic flux through a conductor induces an EMF (EMF = −N·dΦ/dt). Lenz's law specifies that the induced current always opposes the change that caused it. Together these principles underlie every electrical generator, transformer, and inductive sensor.

## On-Screen Text / Captions
- 0:03 → "Magnet stationary — no current"
- 0:10 → "Moving magnet → EMF = −N·dΦ/dt"
- 0:18 → "4× faster → 4× more EMF"
- 0:27 → "Stopped magnet → zero EMF again"
- 0:35 → "Pull out → current reverses (Lenz's law)"
- 0:43 → "Every power plant runs on this"

## End Card
Final 3 seconds: Generator cross-section with rotating magnet and AC output waveform. Text: "Faraday's law: motion → electricity." CodedLaws subscribe.

## Audio
Building cinematic music that peaks at 0:43 with generator reveal. Each galvanometer deflection accompanied by a sharp "click" sound. Voiceover at 0:10: "Move a magnet through a wire, and you create electricity. That's all a generator does."

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: compute magnetic flux through the coil as Φ = B₀·A / (d² + r²)^(3/2) where d is magnet distance (dipole approximation); differentiate numerically to get dΦ/dt; use this to drive galvanometer needle angle and current arrow opacity. Runtime: real-time, mouse/time-driven magnet position. Gotcha: show flux lines curving around the magnet with field-line tracing algorithm; only the component perpendicular to the coil face contributes to Φ.
