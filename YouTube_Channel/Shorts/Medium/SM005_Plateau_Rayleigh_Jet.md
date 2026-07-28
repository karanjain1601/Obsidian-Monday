---
title: "Plateau-Rayleigh Jet Breakup"
id: SM005
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, surface-tension, jet, droplets]
---

> **What it is:** A ~45-second simulation showing a smooth falling water jet pinching apart in slow motion into a chain of perfect spherical droplets with tiny satellite droplets between them — demonstrating the Plateau-Rayleigh instability where surface tension breaks liquid jets. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Plateau-Rayleigh Jet Breakup

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A thin blue water jet falls vertically from the top of the screen in perfectly smooth laminar flow. At exactly 2 seconds the jet ripples — and in slow motion a chain of perfect spherical droplets pinches off from the thread, each one glinting with a white specular highlight.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The jet diameter is labeled (D₀). A sinusoidal surface perturbation of wavelength λ is superimposed with a glowing yellow line. Annotation: "λ > πD₀ → unstable." The perturbation amplitude grows visibly.

**0:10–0:18** — The jet narrows in the pinch zones. Surface tension pulls the necks inward, accelerating the pinch. Colour-map shows local curvature: red = high curvature (necks), blue = low curvature (bulges). Caption: "Curvature drives pressure."

**0:18–0:27** — Pinch-off events cascade down the jet. Each droplet detaches cleanly and accelerates due to surface tension contraction. Satellite droplets (tiny spheres between main drops) appear. Annotation arrow: "satellite droplet."

**0:27–0:36** — Droplet diameter vs. jet diameter ratio shown: D_drop ≈ 1.89 D₀. Graph appears bottom-right with measured points matching the Rayleigh prediction line.

**0:36–0:45** — Slow-motion replay of a single pinch-off event at 0.01× speed. A liquid bridge (ligament) stretches, thins, and snaps. Last frame shows a perfect sphere. Bold text: "Plateau-Rayleigh instability."

## Physics Concept Teased
Plateau-Rayleigh instability: a liquid jet minimizes surface energy by breaking into droplets. Any perturbation with wavelength λ > πD (circumference) is unstable because a sphere has less surface area than a cylinder of equal volume. This is why water faucets drip.

## On-Screen Text / Captions
- **0:00** — "A smooth water jet… won't stay smooth."
- **0:05** — "λ > πD₀ → unstable"
- **0:14** — "Curvature drives Laplace pressure"
- **0:22** — "Satellite droplets appear between main drops"
- **0:30** — "D_drop ≈ 1.89 × D_jet (Rayleigh 1878)"
- **0:40** — "Plateau-Rayleigh instability"
- **0:44** — "Why faucets drip."

## End Card
Final 3 seconds: freeze on a chain of 6 perfect droplets mid-fall. Text: "Surface energy minimisation — nature's optimization." CodedLaws logo. "Inkjet printers exploit this exact instability."

## Audio
Crisp, minimalist piano (70 BPM). Voiceover at 0:00: "Surface tension doesn't just hold droplets together — it rips jets apart." Water dripping sound effect synced to each droplet detachment (~0:10–0:30, every ~1.5 s). Silence from 0:35 during slow-motion replay.

## Production Notes
Code complexity: complex. Renderer: WebGL or p5.js with a level-set or Volume of Fluid method. Key algorithm: axisymmetric Navier-Stokes with surface tension (continuum surface force / CSF model); or use a 1D lubrication approximation (Eggers model) for the jet thinning — much cheaper and captures pinch-off accurately. Gotcha: satellite droplets require very fine mesh near the pinch point; adaptive mesh refinement strongly recommended. Runtime: pre-rendered, 60 fps. Export at 2× speed then slow to 0.5× in editor for visual effect.
