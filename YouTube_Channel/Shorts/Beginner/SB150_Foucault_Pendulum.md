---
title: "Foucault Pendulum: Earth Rotates Beneath It"
id: SB150
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, foucault-pendulum, earth-rotation]
---

> **What it is:** A ~45-second simulation short where an overhead pendulum traces a slow clockwise rotation of its swing plane over sand, building a glowing orange star-burst rosette across a compressed 24-hour day — proving that Earth rotates beneath the pendulum at a precession rate proportional to the sine of the observer's latitude. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Foucault Pendulum: Earth Rotates Beneath It
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
An overhead (top-down) view of a pendulum swinging back and forth over a sand floor. As time speeds up, the pendulum's swing plane slowly rotates clockwise, drawing a beautiful star-burst pattern in the sand. The pattern is traced in orange on a black background — gorgeous and mysterious.

## Main Visual Sequence (0:03–0:50)
**0:03** — Setup shown: pendulum bob (gold, 20px dot) suspended from the center of the screen. Swing plane initially oriented north-south (vertical, white line). Sand floor shown as textured grey background. Location label: "Paris, France — 48.8° N latitude."

**0:10** — Pendulum begins swinging (left-right in its own plane). The swing plane appears fixed, but Earth rotates beneath it (subtle Earth rotation animation at screen edge: globe rotating slowly). After 2 hours of compressed time (5 seconds animation), swing plane has rotated 15° clockwise.

**0:18** — Time-lapse: 24 hours compressed to 10 seconds. Sand traces fan out into a full 360° rosette pattern. At this latitude, one full rotation takes 360° ÷ (360°/24h × sin 48.8°) = 31.8 hours. Label: "Full rotation: 31.8 hours at this latitude."

**0:27** — Physics explanation overlay: Coriolis effect diagram. In the Northern Hemisphere, the Coriolis force deflects the pendulum to the right each swing, causing clockwise precession. Equation: Ω_precession = −Ω_Earth × sin(φ) = −11.33°/hour.

**0:35** — Latitude comparison: side-by-side panels. At the North Pole (φ=90°): swing plane rotates 15°/hour, full rotation in 24 hours. At the Equator (φ=0°): sin(0)=0, no rotation at all — pendulum never precesses. At Paris (48.8°N): 11.33°/hour.

**0:43** — Caption: "Léon Foucault proved Earth spins — in 1851." CodedLaws logo appears.

## Physics Concept Teased
A Foucault pendulum swings in a fixed plane relative to the distant stars. As Earth rotates beneath it, the swing plane appears to rotate at a rate proportional to the sine of the observer's latitude. At the poles, full precession takes 24 hours; at the equator, no precession occurs.

## On-Screen Text / Captions
- 0:03 → "Paris, 48.8°N — pendulum swings north-south"
- 0:10 → "Swing plane rotates — Earth moves beneath it"
- 0:18 → "Full rosette: 31.8 hours"
- 0:27 → "Ω_prec = −Ω_Earth × sin(φ) = −11.3°/h"
- 0:35 → "North Pole: 24h full turn. Equator: never."
- 0:43 → "Léon Foucault, 1851 — Earth spins."

## End Card
Final 3 seconds: Full sand rosette pattern glowing orange. Text: "The simplest proof Earth rotates." CodedLaws subscribe button.

## Audio
Slow, contemplative piano piece, 60 BPM. Voiceover at 0:27: "The pendulum doesn't move — Earth does." Subtle pendulum swish sound each swing throughout.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: simulate pendulum in an inertial frame; rotate the coordinate system each frame by Ω_prec × dt; draw the sand trace as an accumulating path in the rotated frame. Use trail persistence (fade old traces slowly). Runtime: real-time, time-compressed. Gotcha: true Foucault behavior requires long pendulum (67m in Panthéon) — for simulation, simply apply precession rate directly without simulating full 3D dynamics.
