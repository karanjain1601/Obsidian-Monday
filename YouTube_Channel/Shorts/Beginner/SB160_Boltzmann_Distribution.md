---
title: "Boltzmann Distribution: Why Fast Particles Are Rare"
id: SB160
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, thermodynamics, boltzmann, statistical-mechanics, kinetic-theory]
---

> **What it is:** A ~45-second simulation short where hundreds of bouncing molecules build a live speed histogram that forms the Maxwell-Boltzmann curve, then the histogram peak shifts right and broadens when temperature is raised fourfold — revealing why higher temperatures dramatically increase the rare fast particles that drive chemical reactions. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Boltzmann Distribution: Why Fast Particles Are Rare
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Hundreds of blue particles bounce chaotically in a box. A live speed histogram builds up on the right side of the screen — showing a peak at 400 m/s (for N₂ at 300K) and a long tail toward high speeds. Then the temperature doubles: particles visibly move faster, the histogram peak shifts right and flattens — a new, broader distribution.

## Main Visual Sequence (0:03–0:50)
**0:03** — Box (400×400px, black) contains 500 blue molecules (nitrogen, m = 4.65×10⁻²⁶ kg). All moving with initial random speeds. Histogram at right: X-axis = speed (0–2000 m/s), Y-axis = number of particles. Histogram bars begin populating each frame.

**0:10** — After 5 seconds of simulation: Maxwell-Boltzmann curve emerges. Peak labeled: "Most probable speed v_p = √(2k_BT/m) = 422 m/s." Mean speed labeled: "v_avg = 476 m/s." RMS speed: "v_rms = 517 m/s." All three arrows on histogram.

**0:18** — Temperature slider: 300K. Pause. Color code: slow particles (blue, <200 m/s), medium (green, 200–800 m/s), fast (red, >800 m/s). Count shown: "Slow: 28 | Medium: 441 | Fast: 31." "High speed particles are rare!"

**0:27** — Temperature raised to 1200K (4× increase). All particles visibly accelerate. Histogram peak shifts right to 844 m/s (v_p ∝ √T). Curve broadens dramatically. More red (fast) particles visible. "4× temperature → peak shifts by 2× (√4)."

**0:35** — Physical consequence: chemical reactions need particles above activation energy threshold (vertical red line at 800 m/s). At 300K: 6% of particles clear the threshold. At 1200K: 42% clear it. Reaction rate multiplied by 7×! Arrhenius equation shown: k ∝ e^(−Ea/k_BT).

**0:43** — Biological application: "This is why fever speeds up chemical reactions and why cold slows bacteria." Temperature bar: body temp 37°C vs fever 39°C. CodedLaws logo.

## Physics Concept Teased
The Maxwell-Boltzmann distribution describes how gas molecule speeds are distributed at a given temperature. The distribution is skewed: most particles cluster near the most probable speed, but a long high-speed tail exists. Raising temperature shifts the entire distribution rightward (∝ √T), dramatically increasing the fraction of particles with enough energy to drive chemical reactions.

## On-Screen Text / Captions
- 0:03 → "500 nitrogen molecules — what are their speeds?"
- 0:10 → "v_p = 422 m/s, v_avg = 476 m/s, v_rms = 517 m/s"
- 0:18 → "Fast particles are rare — only 6%"
- 0:27 → "4× hotter → peak speed doubles"
- 0:35 → "More fast particles → reactions go 7× faster"
- 0:43 → "Fever: +2°C speeds up every reaction"

## End Card
Final 3 seconds: Maxwell-Boltzmann curve at 300K (blue) and 1200K (orange) overlaid. Text: "Temperature unlocks faster particles." CodedLaws subscribe.

## Audio
Cool, mathematical ambient electronic music, 80 BPM. Histogram bar sounds: each bar increment triggers a soft click. Speed up the click frequency as temperature rises. Voiceover at 0:35: "The rare fast ones drive every chemical reaction in your body."

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: initialize 500 particles with speeds drawn from the Maxwell-Boltzmann distribution: sample using the transformation method (or Box-Muller for velocity components); bin speeds into histogram; when T changes, rescale all speeds by √(T_new/T_old); overlay analytical MB curve for comparison. Runtime: real-time. Gotcha: 2D simulation gives a different distribution from 3D — either use 3D velocity components (v_x, v_y, v_z each Gaussian) and compute |v|, or directly draw from the MB distribution analytically.
