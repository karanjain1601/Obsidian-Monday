---
title: "FitzHugh-Nagumo — Neural Excitation Wave"
id: SM069
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, reaction-diffusion, fitzhugh-nagumo, action-potential, neural, excitable-medium]
---

> **What it is:** A ~45-second simulation short where a single stimulus in 2D neural tissue launches an expanding ring of excitation with a refractory wake behind it, which an obstacle converts into a self-sustaining rotating spiral wave, demonstrating the FitzHugh-Nagumo model of excitable media and its connection to cardiac arrhythmia. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: FitzHugh-Nagumo Neural Excitation Wave

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 2D grid of grey neural tissue. One point is stimulated — a bright white pulse of activity erupts from it and spreads outward as a growing ring. The ring's interior recovers (returns to grey) behind the wave front. An annular excitation wave — a model action potential broadcast across tissue.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — FHN model: ∂v/∂t = D∇²v + v - v³/3 - w + I; ∂w/∂t = ε(v + a - bw). v = membrane potential, w = recovery variable. Single-point dynamics shown: v spikes sharply (action potential), w recovers slowly. Caption: "v: fast excitation; w: slow recovery."

**0:10–0:18** — 2D wave propagation: the spatial FHN system supports travelling waves. The wave front (white) is the excitation; behind it a refractory period (dark blue) prevents re-excitation; after recovery (grey) re-excitation is possible. Caption: "Wave anatomy: front (excitable), wake (refractory), recovery."

**0:18–0:27** — Obstacle in the path: a small inexcitable region (grey square) blocks part of the wave ring. The ring breaks at the obstacle — the broken ends spiral inward, creating rotating spiral waves. Caption: "Broken wave → spiral wave — same as BZ reaction and heart tissue."

**0:27–0:36** — Spiral wave shown in full: a persistent rotating spiral of neural activation, spinning at period T ≈ 35 ms. Inside the spiral: chaotic activity (spiral defect chaos). Caption: "Spiral: model of cardiac arrhythmia." Connection: defibrillation works by simultaneously exciting all tissue — terminating the spiral's re-entry.

**0:36–0:45** — Network FHN: 100 neurons connected in a ring, each FHN oscillator. With coupling, synchronised oscillations. With noise, stochastic resonance. Caption: "Network FHN: synchrony and noise effects." Bold text: "FitzHugh-Nagumo — from neuron to heart." Fade to black.

## Physics Concept Teased
FitzHugh-Nagumo model: a simplified 2D analogue of the Hodgkin-Huxley equations. The fast variable v (membrane potential) generates the action potential spike; the slow variable w (recovery) governs the refractory period. In 2D, the spatial FHN supports travelling waves, spiral waves, and excitation spirals identical to those in cardiac tissue.

## On-Screen Text / Captions
- **0:00** — "Neural tissue — one point triggered."
- **0:05** — "v: action potential; w: slow recovery"
- **0:12** — "Wave anatomy: excitation, refractoriness, recovery"
- **0:20** — "Obstacle → broken wave → spiral"
- **0:28** — "Spiral: model cardiac arrhythmia at T≈35 ms"
- **0:35** — "Defibrillation: excite all tissue — stop the spiral"
- **0:43** — "FitzHugh-Nagumo — neuron to heart."

## End Card
Final 3 seconds: a rotating spiral wave in vivid red-blue on dark tissue background. Text: "AED defibrillators work by terminating re-entrant spiral waves — same physics." CodedLaws logo.

## Audio
Rhythmic, pulsing ambient (matched to wave period). Sharp click each time the action potential spikes. Voiceover at 0:00: "Every heartbeat is an excitation wave — model it with FitzHugh-Nagumo and you can see why arrhythmias are so dangerous." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: WebGL fragment shader or Canvas 2D. Key algorithm: FHN equations solved with forward Euler on 2D grid. Parameters: a=0.7, b=0.8, ε=0.08, D=1.0, I=0.5 (for sustained oscillations). Colour-map: v mapped to a red-white-blue scale. Spiral initiation: stimulate a half-plane, wait for annular wave to form, then block part of it. Spiral tip tracking: detect rotation frequency. For network FHN: N=100 FHN oscillators in a ring with coupling current I_c = γ(v_{i+1} + v_{i-1} - 2v_i). Runtime: real-time WebGL at 60fps for 256×256 grid.
