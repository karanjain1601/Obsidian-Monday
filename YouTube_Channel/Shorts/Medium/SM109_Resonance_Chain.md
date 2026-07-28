---
title: "Resonance Chain — Mean-Motion Resonance Locking"
id: SM109
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Orbital_Resonance_Full]]"
difficulty: medium
tags: [physics, simulation, short, astrophysics, orbital-mechanics, resonance, TRAPPIST]
---

> **What it is:** A ~45-second simulation short of seven planets orbiting a red dwarf in a TRAPPIST-1-style mean-motion resonance chain, with conjunction pulses, librating resonance angles, and a spirograph of orbital alignments demonstrating the cosmic clockwork of locked orbital periods. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Orbital_Resonance_Full]]

# Short: Resonance Chain — Mean-Motion Resonance Locking
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Seven planets orbit a small red star in perfect staggered lockstep — like gears meshing in a cosmic clockwork. Every time the innermost planet completes two laps, the second completes exactly one. Every resonance locks. The orbital pattern traces a hypnotic spirograph of planetary conjunctions.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Top-down view: a red dwarf star (M-dwarf, dim red) with 7 planets on nearly circular orbits. Scale: outermost at ~0.07 AU. Planets labeled b, c, d, e, f, g, h (TRAPPIST-1 style). Orbital periods shown as text: 1.51, 2.42, 4.05, 6.10, 9.21, 12.35, 18.77 days.
- **0:10–0:18:** Period ratios appear as fraction labels between adjacent planet pairs: 8:5, 5:3, 3:2, 3:2, 4:3, 3:2. Each ratio shown as a glowing fraction when the two planets reach conjunction. A conjunction pulse (brief bright line between planets) fires each time two planets align.
- **0:18–0:28:** Resonance angle visualization: for the b-c pair, the resonant argument φ = 2λ_c - λ_b - ω_b is plotted in a small inset oscillating about 0° (libration) — showing it's locked. Without resonance, it would circulate freely (drift through all angles). Color: locked = cyan, unlocked = orange.
- **0:28–0:38:** The Laplace resonance highlight: three planets (e, f, g) in 4:2:1 configuration produce a three-body resonance angle: φ_3 = 4λ_g - 2λ_f - 2λ_e that librates. This is the same resonance as Io-Europa-Ganymede in our own solar system. A miniature Galilean moon inset comparison appears.
- **0:38–0:45:** Zoom out. All conjunction lines draw simultaneously — a complex spirograph pattern of bright lines crisscrossing the system. The pattern repeats periodically. Final text: real TRAPPIST-1 data confirmed this resonance chain in 2017.

## Physics Concept Teased
Mean-motion resonance occurs when two orbital periods form a simple integer ratio. Planets in resonance experience periodic gravitational kicks at the same orbital phase — energy and angular momentum exchange keeps the resonance angle librating rather than circulating. Resonance chains form when multiple planets are linked sequentially. They are fossil records of smooth disk-driven migration and are destroyed by dynamical instability.

## On-Screen Text / Captions
- **0:00:** "Seven planets locked in perfect rhythm — the universe's most beautiful gearbox."
- **0:08:** "TRAPPIST-1: orbital periods in near-integer ratios"
- **0:15:** "Conjunction pulse every resonance pass"
- **0:22:** "Resonant angle librates — this is a lock"
- **0:30:** "Laplace resonance: same as Io-Europa-Ganymede"
- **0:38:** "Resonance = fossil record of gentle migration"
- **0:44:** "Discovered 2017. Still mind-bending."

## End Card
Final 3 seconds: the spirograph conjunction pattern glows gold on black, slowly fading. Text: "The cosmos keeps time better than any clock." Channel logo.

## Audio
Mechanical clockwork tick synchronized to each orbital conjunction flash. Voiceover (delighted, precise): "Seven planets. One rhythm. Locked by gravity since the disk disappeared." Crystalline glass harmonic tones for each resonance lock. Background: delicate minimalist piano.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: simple Keplerian N-body (test particles for now, back-reaction optional). Integrate planets with 4th-order Runge-Kutta. Use actual TRAPPIST-1 period ratios (publicly available). Plot resonant argument φ = j·λ₁ - (j-1)·λ₂ - ω₁ for each pair in small inset charts. Conjunction detection: check if angular separation < threshold each frame and draw a brief glowing line. Spirograph: accumulate all conjunction line endpoints in a canvas with low alpha, allow trails to persist. Gotcha: with 7 planets, N-body integration is cheap but resonance angle tracking requires careful bookkeeping of mean longitudes λ. Use unwrapped angles to avoid 2π discontinuities.
