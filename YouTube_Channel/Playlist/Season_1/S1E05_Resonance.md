---
title: "I Shook This Spring Until It Tore Itself Apart (Resonance, Coded)"
season: 1
episode: 5
difficulty: 3/10
concept: "Driven harmonic oscillator and resonance condition"
prereq: "E03, E04 (oscillator physics)"
tags: [resonance-simulation, driven-harmonic-oscillator, damping, Tacoma-Narrows, javascript, frequency-response, Q-factor, mechanical-resonance]
type: playlist-video
---

## S1·E05 — "I Shook This Spring Until It Tore Itself Apart (Resonance, Coded)"

- **Alt title:** "How to Destroy Any Structure With the Exact Right Frequency"
- **Difficulty:** 3/10 · **Prereq:** E03, E04 (oscillator physics)
- **Hook:** A spring being driven at low frequency — barely moves. Increase the driving frequency by 0.1 Hz toward the natural frequency — amplitude doubles every few seconds and within 30 seconds the spring is oscillating violently.
- **The break (bug):** Driving at resonance (ω_drive = ω_0) with zero damping causes amplitude to grow *without bound* — the simulation overflows a float. This is not a bug; it is the correct physical behavior. The "bug" version is what you build first: driving at the wrong frequency and wondering why nothing happens, then spending 10 minutes searching for the resonant frequency. The discovery is the hook.
- **Concept introduced:** Driven harmonic oscillator, the resonance condition (ω_drive = ω_0), damping coefficient b, quality factor Q = ω_0·m/b (how sharp the resonance peak is), and the Tacoma Narrows bridge collapse as a real-world consequence.
- **Push it / wow moment:** A "bridge mode" — a rectangular slab represented as a 2D spring network. Wind is modeled as a sinusoidal forcing. Sliders let you adjust wind frequency. Find the resonant frequency and watch the bridge oscillate with growing amplitude until springs break. Live frequency-response (Bode) plot shows the resonance peak sharpening as damping decreases.
- **Demo:** Drive frequency slider and damping coefficient slider. Real-time amplitude vs. time plot. Real-time frequency-response spectrum. The bridge destruction sequence.
- **Tags:** `resonance-simulation` `driven-harmonic-oscillator` `damping` `Tacoma-Narrows` `javascript` `frequency-response` `Q-factor` `mechanical-resonance`
- **Thumbnail:** An amplitude bar going vertical with "RESONANCE" label. A blurry bridge visible in the background.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_1/_Season_1_Overview|Season 1 Overview]]*
