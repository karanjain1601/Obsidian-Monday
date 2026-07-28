---
title: "de Broglie: Every Particle Is a Wave"
id: SB170
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, quantum-physics, de-broglie, wave-particle-duality]
---

> **What it is:** A ~45-second simulation short where single electrons fired one at a time through a double slit slowly build a glowing interference pattern dot by dot on a detector screen, revealing that every particle has a matter wavelength (λ = h/mv) even when traveling alone. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: de Broglie: Every Particle Is a Wave
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
An electron is fired at a double slit. Instead of landing in two strips (like a particle), it builds up an interference pattern dot by dot on a detector screen — an unmistakable wave phenomenon from a single particle fired one at a time. The pattern is beautiful: dark and bright alternating bands built from individual electron impacts.

## Main Visual Sequence (0:03–0:50)
**0:03** — Electron gun (left, dark grey) fires single electrons (blue dots, one at a time). Double slit barrier (center, black with two narrow slits 200nm apart). Detector screen (right, dark). First electron hits: a single white dot. Second: another dot. No pattern yet.

**0:10** — After 100 electrons: dots scattered but starting to cluster. After 500 electrons: distinct bright and dark bands forming (interference pattern). The pattern has 5 visible fringes. "Each electron 'knows' both slits are there." Slit separation: d = 200nm. de Broglie wavelength: λ = h/mv.

**0:18** — Numbers panel: electron velocity v = 1.5×10⁶ m/s (0.5% of c, non-relativistic OK). Mass m = 9.11×10⁻³¹ kg. Momentum p = mv = 1.37×10⁻²⁴ kg·m/s. de Broglie wavelength: λ = h/p = 6.626×10⁻³⁴ / 1.37×10⁻²⁴ = 0.48 nm. Label: "λ = 0.48 nm — similar to atomic spacing!"

**0:27** — Fringe spacing: Δy = λL/d (where L = slit-to-screen distance). With L = 1m, d = 200nm: Δy = 0.48nm × 1m / 200nm = 2.4mm. Shows fringe spacing on diagram. "This is measurable!"

**0:35** — Scaling demonstration: wavelength vs mass graph (log-log scale). Electron: λ = 0.48nm. Baseball (150g, 40m/s): λ = 1.1×10⁻³⁴ m (unmeasurably tiny). "Heavy objects have too-small wavelength — they look classical."

**0:43** — Applications: electron microscope achieves 50pm resolution (better than light microscopes by 10,000×). Crystal structure analysis using electron diffraction. CodedLaws logo.

## Physics Concept Teased
de Broglie's hypothesis (λ = h/mv) states that every particle has an associated matter wavelength inversely proportional to its momentum. For electrons, this wavelength is comparable to atomic spacings, producing measurable interference effects. For everyday objects, the wavelength is so small (10⁻³⁴ m) as to be completely undetectable — which is why quantum wave behavior is only observed for subatomic particles.

## On-Screen Text / Captions
- 0:03 → "One electron at a time — yet interference forms"
- 0:10 → "500 electrons → wave interference pattern"
- 0:18 → "λ = h/p = h/mv = 0.48 nm"
- 0:27 → "Fringe spacing Δy = λL/d = 2.4 mm"
- 0:35 → "Baseball: λ = 10⁻³⁴ m — completely classical"
- 0:43 → "Electron microscope: 50pm resolution"

## End Card
Final 3 seconds: Full interference pattern on detector (glowing white bands on black). Text: "You are also a wave. λ = h/mv." CodedLaws subscribe.

## Audio
Mysterious, contemplative ambient music, 65 BPM. Each electron impact: quiet "tick" sound. As the pattern builds, the ticks gradually form a recognizable rhythm (mimicking the building interference pattern). Voiceover: "Fire electrons one by one — they build an interference pattern. Each particle interferes with itself."

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: don't simulate wave mechanics — instead, pre-compute the expected probability distribution P(y) = |ψ|² = cos²(πdy/λL) and use it as a probability density function to place each electron impact dot using rejection sampling. Add dots one at a time with slow reveal. Runtime: real-time, stochastic. Gotcha: the pattern must emerge gradually and realistically — don't cheat by showing the full pattern immediately; the slow build is the entire point of the visual.
