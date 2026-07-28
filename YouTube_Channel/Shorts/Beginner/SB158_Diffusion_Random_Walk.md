---
title: "Diffusion: Why Perfume Spreads Slowly"
id: SB158
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, thermodynamics, diffusion, random-walk]
---

> **What it is:** A ~45-second simulation short where a single orange dot traces a jagged random walk and 100 such particles spread into a growing Gaussian cloud whose radius expands only as the square root of time — revealing why diffusion is inherently slow over macroscopic distances despite molecules traveling at 500 m/s. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Diffusion: Why Perfume Spreads Slowly
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A single bright orange dot sits at the center of a dark square. It takes one random step — left, right, up, or down. Then another. Then another. In 3 seconds, it has traced a jagged, chaotic orange path that wanders unpredictably. The path is beautiful and random, going nowhere fast.

## Main Visual Sequence (0:03–0:50)
**0:03** — Single orange particle at center (300×300px black box). Step size = 5px. Path traced in orange (fading trail). After 200 steps: particle has wandered only ~70px from center despite taking 200 steps. Mean displacement shown: "RMS = √(N)·step = √200 × 5px = 70.7px." Formula glows below.

**0:10** — 100 particles released simultaneously from center (all orange, different shades). Each takes its own random walk. After 500 steps: they form a circular Gaussian distribution (bright center, fading edges). The spreading radius grows as √t — animated ring shows the 1-sigma boundary expanding.

**0:18** — Gaussian bell curve shown in cross-section below the simulation: density vs distance from center. Curve width σ = √(2Dt) where D = diffusion coefficient. T label: "D = 10⁻⁹ m²/s for perfume in air."

**0:27** — Why does it take so long? Single molecule shown with collision arrows: air molecules (grey dots, 10¹⁰ collisions/second) constantly redirect it. Mean free path annotation: "λ = 70 nm — changes direction every 0.1 ns." Despite moving at 500 m/s, net displacement is tiny.

**0:35** — Practical scale: perfume bottle opened at left side of room. Molecular diffusion only reaches 1 meter in 10,000 seconds (2.8 hours!) Label: "Convection (air currents) spreads it much faster." Air current arrows shown carrying perfume to nose in seconds.

**0:43** — Summary: "Random motion spreads matter — slowly. σ ∝ √t, not t. That's why diffusion takes time." CodedLaws logo.

## Physics Concept Teased
Diffusion is the net movement of particles from high to low concentration via random thermal motion. Because each particle undergoes billions of collisions per second that randomize its direction, the mean displacement grows only as the square root of time (σ = √(2Dt)) — making diffusion an inherently slow spreading process over macroscopic distances.

## On-Screen Text / Captions
- 0:03 → "RMS displacement = √N × step size"
- 0:10 → "100 walkers → Gaussian blob"
- 0:18 → "σ = √(2Dt) — width grows as √time"
- 0:27 → "10¹⁰ collisions/second redirect the molecule"
- 0:35 → "Diffusion: 1 meter in 2.8 hours!"
- 0:43 → "σ ∝ √t — not t"

## End Card
Final 3 seconds: Beautiful Gaussian cloud of orange particles on black. Text: "Random walks build the laws of nature." CodedLaws subscribe.

## Audio
Gentle ambient electronic music with random-sounding percussion (marbles dropping, irregular rhythm). No voiceover. Quiet "tap" sound for each random step in the single-particle phase. Overall mood: contemplative curiosity.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: generate N random walkers; each frame, add a random unit vector step scaled by step_size; draw each particle's position as a fading dot (trail using alpha decay); compute σ as standard deviation of all x-positions; draw expanding ring at σ radius. Runtime: real-time. Gotcha: use Float32Array for particle positions to handle 1000+ particles at 60fps; avoid drawing individual trail segments (use single pixel dots with alpha instead).
