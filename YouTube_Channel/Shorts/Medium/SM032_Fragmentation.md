---
title: "Fragmentation — Brittle Object Shattering"
id: SM032
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fracture-mechanics, fragmentation, rigid-body, shattering]
---

> **What it is:** A ~45-second simulation short shattering a brittle porcelain cup in slow motion and measuring how fragment sizes follow a power law that shifts with impact energy, with crack fronts racing at nearly the Rayleigh wave speed. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Fragmentation — Brittle Object Shattering

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A porcelain cup, ivory-white against a dark background, filmed in slow motion. A hard impact point appears on the side — glowing red. In 2 seconds the crack network fans out across the entire surface in a spectacular spider-web pattern, and the cup explodes into dozens of angular shards.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Slow-motion: the fracture front propagates at 1500 m/s (near the Rayleigh wave speed). Cracks branch when the stress intensity factor K_I exceeds K_Ic (fracture toughness). Annotation: "Crack velocity ≈ 0.5 × Rayleigh wave speed."

**0:10–0:18** — Fragment size distribution plotted as a histogram and log-log plot. For high-energy impacts: fragment sizes follow a power law P(m) ∝ m^(-α), α ≈ 1.5. For low-energy impacts: exponential distribution. Caption: "Impact energy → different fragment statistics."

**0:18–0:27** — Impact energy varied: low energy (2 large pieces + dust), medium energy (many fragments), high energy (powder). Each impact shown in rapid sequence. Caption: "Energy determines fragmentation regime."

**0:27–0:36** — Voronoi-based fragmentation model: the object is pre-fractured into Voronoi cells. On impact, cell bonds break based on local stress exceeding a threshold. Force-based stress field shown as a colour map (red = high stress). Cells detach and fly apart.

**0:36–0:45** — Freeze frame of maximum fragmentation: hundreds of angular shards mid-flight. Each shard has angular momentum shown as a spin vector. Text: "Fragment count ∝ impact energy^(2/3)." Bold: "Fragmentation — universal scaling." Fade to black.

## Physics Concept Teased
Fragmentation: brittle materials shatter along pre-existing micro-cracks. Fragment mass distributions follow power laws for high-energy impacts (scale-free) and exponential distributions for low-energy impacts. The crack velocity is limited by the Rayleigh wave speed — the same speed that governs earthquake surface waves.

## On-Screen Text / Captions
- **0:00** — "Impact. Fracture. Fragments."
- **0:05** — "Crack speed ≈ 0.5 × Rayleigh wave speed"
- **0:12** — "Power law: P(m) ∝ m^(-1.5)"
- **0:20** — "Energy → regime: 2 pieces vs. powder"
- **0:28** — "Voronoi fragmentation model"
- **0:35** — "Fragment count ∝ E^(2/3)"
- **0:43** — "Universal fragmentation scaling."

## End Card
Final 3 seconds: shards frozen mid-explosion on black background (3D perspective). Text: "Same power law appears in asteroid impacts and nuclear warhead fragments." CodedLaws logo.

## Audio
Deep, resonant impact sound at 0:02 (the hit). Then silence in slow motion except for soft ringing tones (each crack propagating = faint crystalline chime). Fragment scatter = building noise of clattering shards. Voiceover at 0:00: "Brittle fracture is governed by one rule: wherever stress exceeds toughness, a crack opens." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: three.js + custom physics or Blender for pre-rendered fragments. Key algorithm: Voronoi-based fracture — generate N Voronoi cells inside the object mesh; each internal Voronoi edge is a potential crack. On impact: propagate stress wave (spring-mass lattice), break bonds where stress > threshold. Fragment rigid bodies then fly under gravity. For the power-law demo: run many simulations with different impact energies, collect fragment sizes, plot distribution. Runtime: pre-rendered (real-time Voronoi fracture is achievable in Obi Softbody or Houdini FX).
