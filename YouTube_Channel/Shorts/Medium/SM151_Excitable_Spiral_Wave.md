---
title: "Excitable Medium — Spiral Wave in Cardiac Tissue"
id: SM151
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, excitable-medium, spiral-wave, cardiac, reaction-diffusion, FitzHugh-Nagumo]
---

> **What it is:** A ~45-second simulation short where a plane wave of activation in a 2D cardiac tissue grid is blocked by an obstacle and its free end curls into a self-sustaining rotating spiral wave spinning at 5 Hz, demonstrating how re-entrant arrhythmias arise in excitable media governed by FitzHugh-Nagumo reaction-diffusion equations. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Excitable Medium — Spiral Wave in Cardiac Tissue

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 2D grid — representing cardiac muscle. A plane wave of activation propagates from left to right. A small obstacle blocks the wave. The blocked end curls around the obstacle and wraps into a rotating spiral wave — a re-entrant arrhythmia. The spiral spins at 5 Hz, replacing the normal 1 Hz heartbeat rhythm.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Excitable medium: three states. (1) Resting: ready to fire. (2) Excited: firing (action potential). (3) Refractory: recovering (cannot fire). A wave of excitation propagates and leaves refractory tissue behind — the wave cannot go backward. Caption: "Excitable: resting → excited → refractory → resting." FitzHugh-Nagumo model (SM069).

**0:10–0:18** — Spiral wave creation: a plane wave is broken by an obstacle (scar tissue). The free end curls into a spiral (since refractoriness prevents backward propagation but the free end has no refractory tissue ahead). The spiral rotates and self-sustains. Caption: "Free end + refractoriness → rotating spiral = re-entrant wave." Spiral tip traces a circle.

**0:18–0:27** — Cardiac context: ventricular tachycardia (VT): one spiral in the ventricle → fast, regular 150-250 bpm rhythm. Ventricular fibrillation (VF): multiple spirals → chaotic, fibrillatory pattern (no effective contraction). Caption: "VT: 1 spiral (150-250 bpm). VF: many spirals → fibrillation." VF is fatal within minutes without defibrillation.

**0:27–0:36** — Spiral wave properties: rotation period T = 2πr_tip/v_tip. Core (spiral tip): region of unexcited tissue. Tip trajectory: meander (not a perfect circle for most parameter values). Caption: "Spiral tip: meanders — epitrochoid or linear paths." Show different meander patterns (inward, outward petals).

**0:36–0:45** — Termination: (1) Defibrillation — high-voltage shock resets all cells simultaneously, breaking the spiral. (2) Low-energy antifibrillation pacing (LEAP) — multiple low-energy pulses iteratively unpinning the spiral. Caption: "Defibrillation: shock breaks spiral — normal rhythm restored." Bold text: "Spiral wave — cardiac tissue's deadly re-entrant rhythm." Fade to black.

## Physics Concept Teased
Spiral waves in excitable media: a self-sustaining rotating wave formed when a plane wave is broken near an obstacle in excitable (resting-excited-refractory) tissue. In cardiac tissue, spiral waves cause re-entrant arrhythmias: a single spiral produces ventricular tachycardia, multiple interacting spirals produce ventricular fibrillation. Governed by reaction-diffusion (FitzHugh-Nagumo) equations.

## On-Screen Text / Captions
- **0:00** — "Cardiac tissue spins — a deadly spiral wave."
- **0:05** — "Excitable: resting → excited → refractory → resting"
- **0:12** — "Free end + refractoriness → self-sustaining spiral"
- **0:20** — "VT: 1 spiral (150 bpm). VF: many spirals → fibrillation"
- **0:28** — "Spiral tip: meanders — epitrochoid trajectory"
- **0:35** — "Defibrillation: shock breaks spiral — sinus rhythm restored"
- **0:43** — "Spiral wave — re-entrant arrhythmia visualised."

## End Card
Final 3 seconds: the spiral wave rotating, viewed from above — blue (resting), red (excited), grey (refractory) regions pinwheeling. Text: "Every year, 300,000 people in the US die from ventricular fibrillation — an AED could have saved most of them." CodedLaws logo.

## Audio
Steady heartbeat (1 Hz), then transition to rapid 5 Hz beating, then chaotic fibrillation sound. Voiceover at 0:00: "A spiral wave of electrical activation rotating in the heart drives it to beat so fast it can't pump blood — this is a ventricular arrhythmia." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D or WebGL. Key algorithm: FitzHugh-Nagumo reaction-diffusion on a 200×200 grid. ∂u/∂t = D_u∇²u + u(1-u)(u-a) - v; ∂v/∂t = ε(u - γv). Parameters: a=0.1, ε=0.01, γ=0.5, D_u=0.2. Spiral initiation: start with plane wave, create a refractory block on one side. Alternatively: S1-S2 protocol — apply S1 stimulus (full-width plane wave), wait for partial recovery, apply S2 stimulus (half-width) — spiral forms naturally. Colour: u field (activated=red, resting=blue, refractory=grey). Mark spiral tip: find phase singularity (point where u=0.5, v=0.5 simultaneously). Runtime: WebGL fragment shader, real-time 200×200.
