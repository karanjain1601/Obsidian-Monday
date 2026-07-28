---
title: "Electric Field Lines: Invisible Force Maps"
id: SB161
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, electromagnetism, electric-field, coulombs-law]
---

> **What it is:** A ~45-second simulation short where curved white field lines sprout from a glowing red positive charge and arc into a blue negative charge, revealing how line density maps electric field strength via Coulomb's law. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Electric Field Lines: Invisible Force Maps
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A glowing red positive charge (+) and a glowing blue negative charge (−) appear 200 pixels apart on a black background. Instantly, curved electric field lines sprout from the positive charge and arc gracefully into the negative charge — like a sculpture of invisible force made visible in white-yellow light. A small test charge (white arrow) placed anywhere follows the field line perfectly.

## Main Visual Sequence (0:03–0:50)
**0:03** — Single positive charge (red circle, +2μC) placed at center. 12 field lines radiate outward equally in all directions (white arrows on cyan lines). Lines grow more spread out at distance. Label: "E ∝ 1/r² — lines spread with distance." Field strength heatmap shown as background glow (bright near charge, fading outward).

**0:10** — Negative charge (blue, −2μC) placed 200px to the right. Field lines from positive charge bend and terminate on negative charge. Lines pack more densely between the charges (high field region, bright). Label: "Lines go from + to −, never crossing."

**0:18** — Test charge demo: small white arrow placed at 5 different positions. At each position, it points along the local field line direction. The arrow at midpoint between charges points directly from + to −. Label: "F = qE — force follows field lines."

**0:27** — Two positive charges scenario (+2μC and +2μC): lines now repel — they push away from each other, leaving a null point (zero field) exactly midway. The null point pulses red. "Charges repel — field lines never connect."

**0:35** — Capacitor plate scenario: two parallel plates (+ top, − bottom). Field lines are perfectly straight and parallel between the plates (uniform field). Fringe field at edges curves outward. E = σ/ε₀ shown. Label: "Uniform field between capacitor plates."

**0:43** — Coulomb's law shown: F = kq₁q₂/r². Numbers plugged in for the original setup. CodedLaws logo.

## Physics Concept Teased
Electric field lines are a visualization tool that map the direction and relative strength of an electric field. Lines originate on positive charges and terminate on negative charges; they never cross; and their density (spacing) represents field strength. A positive test charge placed in the field experiences force exactly along the field line direction.

## On-Screen Text / Captions
- 0:03 → "E ∝ 1/r² — density shows strength"
- 0:10 → "Lines: + to −, never crossing"
- 0:18 → "F = qE — force follows field lines"
- 0:27 → "Like charges repel — null point between them"
- 0:35 → "Capacitor: uniform field between plates"
- 0:43 → "F = kq₁q₂/r² (Coulomb's Law)"

## End Card
Final 3 seconds: Dipole field line pattern glowing on black. Text: "Invisible fields shape all matter." CodedLaws subscribe.

## Audio
Mysterious, electromagnetic-sounding ambient music (synthesizer tones, 70 BPM). Soft electrical hum when charges are placed. Voiceover: "You can't see electric fields — but you can feel exactly where they push." No other voiceover.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: trace field lines by starting at angle-spaced points near the source charge and stepping along the local E field vector (sum of all point charge contributions); use Runge-Kutta 4th order integration for smooth curves; color lines by local field magnitude. Runtime: computed once, then animated (lines draw over time). Gotcha: stop line integration when it comes within 5px of a charge to avoid infinite loops; limit max integration steps to 1000.
