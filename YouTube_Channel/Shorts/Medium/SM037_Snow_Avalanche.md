---
title: "Snow Avalanche Flow"
id: SM037
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, granular-media, avalanche, snow, MPM, fluid-dynamics]
---

> **What it is:** A ~45-second simulation short releasing a snow mass down a steep slope and simulating its two-phase flow — dense granular basal layer and billowing powder cloud — using the Material Point Method with Drucker-Prager snow plasticity. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Snow Avalanche Flow

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A steep white mountain slope. A small region of snow at the top cracks and releases — a white plume erupts downhill, accelerating at terrifying speed. In 3 seconds the avalanche has swept half the slope, a billowing white cloud trailing behind the dense flowing mass.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The avalanche shown in two phases: dense flow layer (close to ground, blue-white particles) and dilute powder cloud above (translucent white puff). The Bagnold number Ba = ρ_grain d² γ̇ / μ distinguishes regime. Caption: "Dense flow below; powder cloud above."

**0:10–0:18** — MPM (material point method) simulation of the snow: 50,000 material points each carrying stress, velocity, and density. The Drucker-Prager elastoplastic constitutive model used for snow. Yield surface shown as a 2D diagram: "Snow yields when shear stress exceeds cohesion + friction."

**0:18–0:27** — Runout length: the avalanche decelerates on the flat valley bottom. A house (simple box) is hit — snow piles up against it, partially burying it. Force on the house shown as an arrow: F = ρ u² A (dynamic pressure). Caption: "Design pressure: 300 kPa at 30 m/s."

**0:27–0:36** — Speed profile: colour-map of velocity magnitude (black = stationary, cyan = fast, white = fastest). The fastest particles are in the avalanche front. Slow-motion shows the snout: a blunt, churning front with tumbling blocks.

**0:36–0:45** — Terrain effect: the simulation reruns with trees present. Trees act as obstacles — the avalanche splits around them, forming a wake region of reduced flow. Caption: "Trees provide modest protection." Bold text: "Avalanche dynamics — MPM simulation." Fade to black.

## Physics Concept Teased
Snow avalanche flow: a released snow mass behaves as a granular fluid with two phases — a dense basal flow obeying Drucker-Prager plasticity and a dilute powder cloud. The Material Point Method (MPM) handles large deformations and phase transitions naturally, capturing both flow and impact.

## On-Screen Text / Captions
- **0:00** — "Snow releases. Gravity takes over."
- **0:05** — "Dense flow + powder cloud — two phases"
- **0:12** — "Drucker-Prager plasticity for snow"
- **0:20** — "Design pressure: F = ρu²A ≈ 300 kPa"
- **0:28** — "Front: blunt, churning, fastest particles"
- **0:35** — "Trees split the flow — partial protection"
- **0:43** — "MPM avalanche simulation."

## End Card
Final 3 seconds: avalanche front in slow motion, white particles swirling. Text: "The 2017 Walt Disney Animation film 'Frozen 2' used MPM for realistic snow." CodedLaws logo.

## Audio
Dramatic orchestral hit at avalanche release (0:02). Deep rumbling as avalanche descends. Wind howl. Voiceover at 0:00: "An avalanche is neither liquid nor solid — it's a granular flow, and simulating it requires physics that spans both." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: WebGL or pre-rendered in Houdini. Key algorithm: Material Point Method (MPM) — hybrid Lagrangian-Eulerian. Particles carry material state; background Eulerian grid used for force computation. Snow: elastoplastic Drucker-Prager model (see Stomakhin et al. 2013, Disney's MPM snow paper). Grid size: 1 cm. ~50,000 particles for a 5m × 3m domain. Powder cloud: dilute phase modelled as SPH or separate continuum. Gotcha: MPM is compute-intensive — use GPU acceleration (CUDA or WebGPU). Runtime: pre-rendered GPU simulation.
