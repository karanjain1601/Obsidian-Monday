---
title: "Belousov-Zhabotinsky Chemical Oscillation"
id: SM068
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, reaction-diffusion, BZ-reaction, chemical-oscillation, spiral-wave]
---

> **What it is:** A ~45-second simulation short where a tiny disturbance in a simulated chemical dish triggers rotating orange-and-blue spiral waves that expand outward, break into chemical turbulence, and annihilate on collision, demonstrating the Belousov-Zhabotinsky reaction's limit-cycle oscillations and the spiral wave mathematics shared with cardiac fibrillation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Belousov-Zhabotinsky Chemical Oscillation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Top-down view of a shallow petri dish. A uniform orange fluid. At 2 seconds a tiny blue dot appears — then blue spiral arms unfurl outward, rotating, expanding, filling the entire dish in a hypnotic pinwheel of orange and electric blue.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Oregonator model (simplified BZ): ∂u/∂t = D_u∇²u + u - u² - fw(u-q)/(u+q); ∂w/∂t = D_w∇²w + u - w. (u = activator concentration, w = inhibitor). The system undergoes limit-cycle oscillations at every spatial point. Caption: "Oregonator: limit cycle at every point."

**0:10–0:18** — Spiral wave formation: the spiral tip (the end of the wave) rotates with period T. The tip traces a circular path. The wave fronts propagate outward from the tip at the chemical wave speed c. Caption: "Spiral tip: rotates at period T. Waves propagate at speed c."

**0:18–0:27** — Breakup and turbulence: when the spiral rotation period is too short, the waves break up — spiral defect chaos. Shown as a turbulent-looking field of partial spirals forming, breaking, and re-forming. Caption: "Spiral breakup → chemical turbulence."

**0:27–0:36** — Multiple spirals interact: opposite chirality spirals (rotating clockwise and counter-clockwise) approach each other. Their waves annihilate when they collide. The two spiral tips are driven together and annihilate. Caption: "Opposite chirality annihilation."

**0:36–0:45** — Real-world analog: cardiac fibrillation is a BZ-like spiral wave in heart muscle. A healthy heart beats as a plane wave; a fibrillating heart has spiral waves of electrical activation. Caption: "Cardiac fibrillation — same spiral physics." Bold text: "BZ reaction — chemistry teaching physics its own patterns." Fade to black.

## Physics Concept Teased
Belousov-Zhabotinsky reaction: a chemical oscillating system that produces travelling wave patterns (concentric rings and spirals) in a thin layer. The Oregonator model describes it as an activator-inhibitor system undergoing limit-cycle oscillations. Spiral waves in the BZ reaction are mathematically identical to cardiac fibrillation waves.

## On-Screen Text / Captions
- **0:00** — "A dish of chemicals — suddenly it spirals."
- **0:05** — "Oregonator: limit cycle at every spatial point"
- **0:12** — "Spiral tip rotates. Waves propagate outward."
- **0:20** — "Spiral breakup → chemical turbulence"
- **0:28** — "Opposite chirality spirals annihilate"
- **0:35** — "Cardiac fibrillation: same spiral mathematics"
- **0:43** — "BZ reaction — chemistry becomes physics."

## End Card
Final 3 seconds: vibrant orange-and-blue spiral wave, rotating slowly. Text: "Boris Belousov discovered this in 1951 — rejected by journals for 'violating thermodynamics.'" CodedLaws logo.

## Audio
Dreamy, rotating ambient (75 BPM — matched to spiral rotation period). Voiceover at 0:00: "In a dish of chemicals, spiral waves appear and rotate — the same mathematics governs a fibrillating heart." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: WebGL fragment shader. Key algorithm: Oregonator model solved via explicit forward Euler on 2D grid (256×256). D_u = 0.5, D_w = 2.0. Parameters: f=1.4, q=0.002. Time step: Δt = 0.01 (stable). Colour-map: u-concentration mapped to orange-to-blue colour ramp. Spiral initiation: break wave front manually (set u=0 in a half-plane). Multiple spirals: multiple break points. Spiral tip tracking: detect the point where u_t changes sign. Runtime: real-time WebGL.
