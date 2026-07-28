---
title: "Murmuration — Starling Flock Dynamics"
id: SM078
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, murmuration, flocking, starlings, topological-interaction, emergence]
---

> **What it is:** A ~45-second simulation short where 10,000 simulated starlings in a sunset sky morph between ribbons, balls, splits, and merges using nearest-7 topological interaction rules, demonstrating how near-critical flock dynamics produce scale-free velocity correlations and maximise information propagation speed for collective predator evasion. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Murmuration — Starling Flock Dynamics

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Sunset sky — warm orange. A massive murmuration of 10,000 starlings ripples and morphs like a single organism. The flock stretches into a ribbon, contracts into a ball, splits, and merges — all in fluid slow motion. It's one of nature's most stunning displays.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The key discovery (Ballerini et al. 2008): starlings interact with their 6-7 nearest topological neighbours — NOT neighbours within a fixed radius. This means density doesn't matter — at any density, each bird interacts with the same 6-7 birds. Caption: "Topological interaction: 7 nearest neighbours (not distance-based)."

**0:10–0:18** — Comparison: metric (distance-based) interaction vs. topological (nearest-N) interaction. With metric: flock splits as density drops. With topological: flock stays cohesive at any density. Shown in side-by-side simulation. Caption: "Topological: robust to density — explains murmuration cohesion."

**0:18–0:27** — Information propagation: a perturbation (one bird turns) propagates through the flock as a wave. Speed of information propagation measured from real STARFLAG data: ~20 m/s across a 400-bird flock. Caption: "Information wave: 20 m/s — faster than any individual bird reaction."

**0:27–0:36** — Near-critical dynamics: the flock operates at a near-critical point — the susceptibility (response to perturbation) is maximised. The flock is maximally responsive to predator attacks. Caption: "Near-criticality: maximum responsiveness to threats." A hawk enters the simulation — the flock evasion wave propagates in milliseconds.

**0:36–0:45** — Vicsek model comparison: the starling data closely matches the Vicsek model (alignment with topological neighbours, noise). Shown: Vicsek simulation with N=10,000 particles producing murmuration-like shapes. Caption: "Vicsek model: spin-glass phase transition in 2D." Bold text: "Murmuration — a living critical phenomenon." Fade to black.

## Physics Concept Teased
Murmuration: starling flocks use topological (nearest-7) rather than metric interaction rules. This produces scale-free correlation of velocity fluctuations — the flock operates near a critical point, analogous to a magnetic phase transition. Near-criticality maximises information propagation speed, enabling the flock to respond collectively to predator attacks.

## On-Screen Text / Captions
- **0:00** — "10,000 birds. One organism."
- **0:05** — "Topological interaction: 7 nearest birds, not by distance"
- **0:12** — "Topological: cohesive at any density"
- **0:20** — "Information wave: 20 m/s across the flock"
- **0:28** — "Near-criticality: maximum predator responsiveness"
- **0:35** — "Vicsek model: spin-glass phase transition"
- **0:43** — "Murmuration — a living critical phenomenon."

## End Card
Final 3 seconds: 10,000-boid murmuration in sunset colours, slowly morphing. Text: "STARFLAG project (2006–2010) filmed 3D starling flocks with 10 synchronized cameras." CodedLaws logo.

## Audio
Sweeping, cinematic orchestral ambient (slow, building). Sound of thousands of wings (collective rush of air). Voiceover at 0:00: "A starling flock talks to its nearest 7 neighbours — and that rule alone makes a murmuration." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: WebGL (for 10,000 boids). Key algorithm: Vicsek model with topological interaction. Each step: for each boid i, find 7 nearest neighbours (spatial hash query for efficiency, then sort by distance). Compute mean heading of those 7. New heading = mean heading + noise η (uniform in [-π,π]). Move forward at constant speed. N=10,000 requires GPU instancing and spatial hash. Order parameter: |⟨e^{iθ}⟩| across all boids. Predator avoidance: a special "predator" boid that moves toward the flock centroid; when predator is within r_fear, add a strong flee force. Runtime: real-time WebGL with GPU instancing for N=10,000.
