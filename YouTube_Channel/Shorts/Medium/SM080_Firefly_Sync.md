---
title: "Firefly Synchronisation — Coupled Oscillators"
id: SM080
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, synchronisation, coupled-oscillators, fireflies, pulse-coupled, emergence]
---

> **What it is:** A ~45-second simulation short where hundreds of asynchronously blinking fireflies self-synchronise into a single unified flash purely through phase-advance coupling, demonstrating the Mirollo-Strogatz theorem's guarantee of finite-time synchrony for any initial conditions and its applications from cardiac pacemakers to power grids. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Firefly Synchronisation — Coupled Oscillators

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Dark forest scene. Hundreds of firefly dots blink randomly — a chaotic disco of asynchronous flashes. At 2.5 seconds the flashing starts to synchronise — clusters of fireflies begin blinking together — and by 3 seconds the entire canvas flashes in perfect unison: all fireflies blink simultaneously.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Mirollo-Strogatz pulse-coupled oscillator model: each firefly i has a phase φ_i ∈ [0,1]. Phase increases at rate 1/T. At φ_i = 1: flash + reset to φ_i = 0. Coupling: when firefly j flashes, all nearby fireflies advance their phase by ε (if φ_i < 1 - ε, they advance; if φ_i > 1 - ε, they fire immediately and reset). Caption: "Phase coupling: see a flash → advance your clock."

**0:10–0:18** — Phase distribution animation: a histogram of all firefly phases shown initially as uniform (desynchronised). Over time the histogram clusters toward one value — all fireflies approach the same phase. The histogram goes from flat → multi-peaked → single sharp spike (synchrony). Caption: "Phases cluster → synchrony."

**0:18–0:27** — The Mirollo-Strogatz theorem: for N globally coupled identical oscillators with concave phase response curves, the system reaches perfect synchrony in finite time — guaranteed, for any initial conditions. Caption: "Proven: synchrony in finite time — any N, any initial conditions." The mathematical proof (1990) referenced.

**0:27–0:36** — Spatial effects: fireflies only interact with neighbours within radius r. In this case, synchrony propagates as a wave — locally synchronised patches grow and merge, sweeping across the forest. Caption: "Spatial sync wave — patches merge."

**0:36–0:45** — Real-world: Photinus carolinus fireflies in Smoky Mountains, Tennessee synchronise in exactly this way — thousands of fireflies blinking in unison for seconds at a time. Caption: "Photinus carolinus — only species known to synchronise in the US." Bold text: "Synchrony — from fireflies to power grids." Fade to black.

## Physics Concept Teased
Mirollo-Strogatz model: N pulse-coupled integrate-and-fire oscillators synchronise in finite time for any initial conditions, when coupling is positive (advance-type) and the phase response function is concave. This explains firefly synchrony, cardiac pacemaker cell coordination, and provides a framework for understanding power grid frequency synchrony.

## On-Screen Text / Captions
- **0:00** — "Random flashes → perfect synchrony."
- **0:05** — "Phase coupling: see a flash → advance your clock by ε"
- **0:12** — "Histogram: uniform → sharp spike = synchrony"
- **0:20** — "Mirollo-Strogatz theorem: synchrony in finite time"
- **0:28** — "Spatial: synchrony wave propagates outward"
- **0:35** — "Photinus carolinus: real synchronous fireflies"
- **0:43** — "Fireflies → pacemakers → power grids."

## End Card
Final 3 seconds: the full dark forest flashing in perfect unison — one bright pulse every second. Text: "Smoky Mountains, Tennessee — see it in person every summer." CodedLaws logo.

## Audio
Crickets, forest sounds. Each firefly flash = brief light twinkle sound. Synchrony: the twinkle sounds merge into one bright chime per second. Voiceover at 0:00: "Fireflies with no conductor synchronise perfectly — the mathematics guarantees it." No other voiceover.

## Production Notes
Code complexity: low to moderate. Renderer: Canvas 2D. Key algorithm: Mirollo-Strogatz pulse-coupled oscillators. N=200 fireflies on a 2D canvas. Each firefly: position (random, fixed), phase φ ∈ [0,1], natural period T. Each step: advance all φ by dt/T. If any φ ≥ 1: reset φ=0, broadcast to all within radius r. For each receiver: φ → φ + ε·(1-φ) (excitatory coupling, saturating). If any receiver φ ≥ 1 after coupling: fire immediately. Draw: firefly as a white dot, brightness proportional to sin²(π·φ)^5 (bright only near flash). Phase histogram: right panel. Runtime: real-time Canvas 2D.
