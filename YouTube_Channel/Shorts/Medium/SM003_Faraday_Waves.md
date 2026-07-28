---
title: "Faraday Wave Patterns"
id: SM003
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, waves, faraday, pattern-formation]
---

> **What it is:** A ~45-second simulation showing a vertically-shaken fluid layer spontaneously organizing into shifting geometric standing-wave patterns — hexagons, then squares, then stripes — as the driving frequency changes, demonstrating parametric resonance and Faraday instability. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Faraday Wave Patterns

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Top-down view of a flat dark-blue fluid surface. The screen shakes imperceptibly — then in 2 seconds a perfect hexagonal lattice of bright standing waves erupts across the entire surface, as if the fluid suddenly remembered a hidden geometry.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Hexagonal wave crests glow cyan at their peaks; troughs are near-black. The pattern oscillates up and down at exactly half the driving frequency (subharmonic response). A small sine-wave icon bottom-left pulses to show the forcing frequency.

**0:10–0:18** — Driving frequency is slowly increased. The hexagonal lattice breaks apart — a transition zone of disordered standing ripples. Text: "f_drive ↑." Crests scatter chaotically.

**0:18–0:27** — A new stable pattern emerges: square lattice. Crests form a perfect grid, glowing gold. Annotation: "Square pattern — different forcing frequency." The fluid appears almost solid.

**0:27–0:36** — Frequency swept further — pattern transitions to parallel stripes (1D rolls). Stripes undulate gently with a breathing motion. Annotation: "Stripes."

**0:36–0:45** — All three patterns shown side-by-side in equal panels: Hexagons | Squares | Stripes. Bold text: "Same fluid, different frequency." Fade to CodedLaws logo.

## Physics Concept Teased
Faraday instability: a fluid layer driven vertically at frequency f_d develops standing wave patterns at frequency f_d/2 (parametric resonance). The geometry (hexagons, squares, stripes) depends on the driving frequency and amplitude — a classic example of spontaneous symmetry breaking.

## On-Screen Text / Captions
- **0:00** — "Shake a fluid vertically…"
- **0:03** — "Hexagons appear."
- **0:12** — "Change the frequency…"
- **0:20** — "Squares."
- **0:30** — "Stripes."
- **0:38** — "Same fluid. Different frequency."
- **0:44** — "Faraday instability."

## End Card
Final 3 seconds: top-down freeze-frame of the hexagonal pattern with a superimposed honeycomb grid outline. Text: "Which pattern is your favourite? Comment below." CodedLaws logo fades in.

## Audio
Soft electronic music, 80 BPM, slightly hypnotic. Voiceover at 0:00: "Shake a fluid tray at just the right frequency and perfect geometric patterns appear — spontaneously." Subtle high-pitched chime sound effect each time a new pattern locks in (~0:04, 0:20, 0:30).

## Production Notes
Code complexity: complex. Renderer: WebGL fragment shader (height-field simulation). Key algorithm: shallow-water equations with parametric vertical forcing; Mathieu equation governs onset; use a pseudo-spectral solver on a 256×256 grid. Height field rendered with normal-mapped lighting for the 3D wave appearance. Gotcha: pattern selection (hexagon vs square) is extremely sensitive to viscosity and forcing amplitude — sweep parameter space carefully and record stable regions. Runtime: real-time in WebGL at 60 fps.
