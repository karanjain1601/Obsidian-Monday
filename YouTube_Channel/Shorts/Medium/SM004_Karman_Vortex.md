---
title: "Kármán Vortex Street"
id: SM004
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, vortex, karman, flow-visualization]
---

> **What it is:** A ~45-second simulation showing laminar flow past a cylinder breaking into an alternating double row of clockwise and counter-clockwise shed vortices — demonstrating the Kármán vortex street and Strouhal shedding frequency. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Kármán Vortex Street

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A white cylinder sits in the centre of a black canvas. Blue streamlines flow horizontally from left to right — perfectly laminar, peaceful. At 2.5 seconds the cylinder begins shedding, and a zigzag pattern of alternating vortices trails behind it in a mesmerizing double row.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Alternating clockwise (red) and counter-clockwise (blue) vortices shed one by one from the top and bottom of the cylinder. They drift rightward in two offset rows. Annotation: "Re = 150."

**0:10–0:18** — A vorticity colour-map (blue-white-red) fills the canvas. Vortex cores are bright red and blue discs; the background flow is near-white. The Strouhal number (St = 0.197) is displayed: "St = f·D/U = 0.197."

**0:18–0:27** — Reynolds number slider on screen animates from Re=50 to Re=200. At Re=50 the wake is steady and symmetric. At Re=100 shedding begins. At Re=200 the street becomes wider, more energetic, vortices more closely spaced.

**0:27–0:36** — Particle tracer mode: thousands of white dots released upstream drift through the vortex street, spiraling into each vortex core. Visual looks like a river of fireflies being captured.

**0:36–0:45** — Close-up on two adjacent vortices. Arrows show opposite rotation. Text: "Opposite rotation — alternating shed vortices." Frame freezes. Fade to black with "Kármán Vortex Street" title card.

## Physics Concept Teased
Kármán vortex street: flow past a bluff body at moderate Reynolds numbers sheds vortices alternately from opposite sides. The shedding frequency obeys the Strouhal number St ≈ 0.2. These alternating vortices can resonate with structures, causing the famous Tacoma Narrows bridge collapse.

## On-Screen Text / Captions
- **0:00** — "Laminar flow past a cylinder."
- **0:03** — "Re = 150 — vortices shed."
- **0:12** — "Strouhal number St = f·D/U = 0.197"
- **0:20** — "Reynolds number controls the pattern"
- **0:30** — "White particles trace each vortex"
- **0:38** — "Opposite rotation — alternating shed"
- **0:44** — "This destroyed the Tacoma Narrows Bridge."

## End Card
Final 3 seconds: black background, white text "Kármán Vortex Street." Smaller text: "Tacoma Narrows collapsed at 42 Hz — its natural frequency." CodedLaws logo bottom right.

## Audio
Low, rhythmic electronic pulse matching the vortex shedding period (~0.5 Hz at Re=150 in simulation time). Voiceover at 0:00: "A simple cylinder in flow creates one of the most iconic patterns in fluid mechanics." No other voiceover. Subtle swoosh each time a vortex is shed.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D or WebGL. Key algorithm: 2D lattice Boltzmann method (D2Q9) with bounce-back boundary on the cylinder — extremely clean for vortex streets. Grid: 512×256 with cylinder radius ≈ 20 cells. Gotcha: cylinder must be slightly off-centre or have a tiny perturbation to break symmetry and trigger shedding. Reynolds number tuned via relaxation time τ in LBM. Runtime: real-time in browser using LBM WebGL compute shader.
