---
title: "Unified Particle System — Sand to Water Transition"
id: SM045
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, particles, unified-physics, granular, fluid, phase-change]
---

> **What it is:** A ~45-second simulation short where a golden sand pile visibly melts through a wet-sand phase into freely flowing blue water — then refreezes — demonstrating how a unified particle system switches between Drucker-Prager granular and PBF fluid constraints on the same particle type. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Unified Particle System — Sand to Water Transition

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A pile of golden sand particles. A heatwave animation runs over it — the sand begins to flow, changing from granular behaviour (distinct grains) to smooth fluid behaviour (continuous flow). The colour shifts from gold to blue as the sand "melts" into water. The transition is mesmerising.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Unified particle framework (NVIDIA FleX or Macklin et al. 2014): all materials — sand, water, cloth, rigid bodies — represented as particles. Each particle has: position, velocity, phase (fluid/granular/rigid). The phase determines which constraint is applied. Caption: "One particle type. Many materials."

**0:10–0:18** — Sand regime: Drucker-Prager plasticity constraints keep particles rigid under small loads and allow them to yield under large shear. Particles cascade and pile at the angle of repose (~30°). Annotation: "Angle of repose: 30°."

**0:18–0:27** — Transition: phase value smoothly interpolated from granular (0) to fluid (1). At intermediate phase: particles behave like wet sand — cohesive but flowable. The pile spreads outward, slower than dry water but faster than dry sand. Caption: "Phase blend: wet sand regime."

**0:27–0:36** — Full fluid: particles now obey PBF constraints (incompressibility). They flow smoothly around obstacles, splash, and settle into the hydrostatic pressure profile. The gold colour fades to transparent blue. Caption: "PBF fluid constraints: incompressible liquid."

**0:36–0:45** — Reverse transition: temperature cools (animation: blue glow fades, gold returns). The fluid re-freezes into granular sand — particles lock back into contact, stop flowing, rebuild the pile at angle of repose. Bold text: "Unified physics: one framework, all materials." Fade to black.

## Physics Concept Teased
Unified particle systems (Macklin et al. 2014, NVIDIA FleX): a single position-based dynamics framework handles fluids, granulars, rigid bodies, and deformables through different constraint types on the same particle type. Material behaviour emerges from the active constraint set — enabling smooth material phase transitions.

## On-Screen Text / Captions
- **0:00** — "Sand… becoming water."
- **0:05** — "One particle. Phase determines behaviour."
- **0:12** — "Sand: Drucker-Prager constraints → angle of repose 30°"
- **0:20** — "Blend: wet sand — cohesive flow"
- **0:28** — "Water: PBF incompressibility constraint"
- **0:35** — "Cool → re-solidify → sand again"
- **0:43** — "Unified physics — one framework for everything."

## End Card
Final 3 seconds: side-by-side panels — sand pile (granular) and water pool (fluid). Text: "NVIDIA FleX ships in games — real-time unified materials." CodedLaws logo.

## Audio
Warm, evolving ambient (70 BPM). Dry sandy sound during granular phase; smooth water sounds during fluid phase; transition: blended sound. Voiceover at 0:00: "Sand and water seem completely different — but one unified particle framework simulates both, and everything in between." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: WebGL or three.js. Key algorithm: unified PBD framework — particles have a phase parameter. Granular constraints: apply Drucker-Prager plastic yield constraint between particle pairs (resist inter-particle penetration + cohesion). Fluid constraints: apply PBF density constraint. Blend: linear interpolation of constraint forces by phase. Transition: animate phase parameter from 0 to 1 over 5 seconds. Gotcha: mixing granular and fluid constraints on the same particle requires careful weighting to avoid artifacts. Runtime: GPU-accelerated; reference implementation: NVIDIA FleX SDK.
