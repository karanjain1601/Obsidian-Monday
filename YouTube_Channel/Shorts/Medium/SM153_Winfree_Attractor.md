---
title: "Winfree Attractor — Toroidal Phase Dynamics"
id: SM153
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, dynamical-systems, winfree, phase-oscillator, torus, biological-rhythms]
---

> **What it is:** A ~45-second simulation short where a trajectory winds endlessly over the surface of a 3D torus at an irrational frequency ratio and never closes, while the phase response curve reveals a singular point at which a perturbation can quench an oscillator entirely, demonstrating Winfree's toroidal phase dynamics and its consequences for biological clocks and cardiac arrhythmias. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Winfree Attractor — Toroidal Phase Dynamics

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A torus (donut shape) in 3D. A trajectory winds around its surface — around the donut one way (θ, slow oscillation) and around the hole the other way (φ, fast oscillation). The ratio of frequencies is irrational — the trajectory never closes, filling the entire torus surface. A quasiperiodic orbit on a 2-torus — the Winfree attractor.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Two coupled oscillators: ω₁ and ω₂. If ω₁/ω₂ is rational (p/q): periodic orbit — closes after p/q cycles. If irrational: quasiperiodic — fills the torus ergodically. Caption: "Irrational frequency ratio → quasiperiodic orbit fills the torus." Winfree (1967) showed biological rhythms can be organised on a torus.

**0:10–0:18** — Phase resetting: when an external perturbation is applied to a phase oscillator, the oscillator's phase shifts. The Phase Response Curve (PRC) maps the old phase φ to the new phase φ' after a perturbation. Caption: "PRC: φ → φ' — phase response curve quantifies resetting." Type-I PRC (only advances) vs Type-II (both advances and delays).

**0:18–0:27** — Winfree's singular point: if the perturbation strength is just right at just the right phase, the oscillator is "reset to oblivion" — its amplitude goes to zero and it stops oscillating entirely. The singular point is a fixed point of the map φ → φ'. Caption: "Singular point: oscillator stops — amplitude = 0." Winfree 1970.

**0:27–0:36** — Biological clocks: Winfree applied this to circadian rhythms. A bright light pulse at the singular phase resets the clock (used in jet-lag treatment). A pulse at other phases shifts the clock by a predictable amount from the PRC. Caption: "Jet-lag treatment: light pulse at singular phase resets circadian clock." Show PRC of human circadian rhythm.

**0:36–0:45** — Connection to cardiac: the Winfree singular point explains cardiac sudden cardiac death from R-on-T phenomenon — a premature ventricular contraction that falls precisely at the vulnerable phase (T-wave) can trigger fibrillation. Caption: "R-on-T: premature beat at singular phase → fibrillation." Bold text: "Winfree attractor — when biological rhythms meet topology." Fade to black.

## Physics Concept Teased
Winfree's phase dynamics: a limit-cycle oscillator's response to perturbations is captured by the Phase Response Curve (PRC). A singular point exists where the oscillator has zero phase — all initial conditions near it produce the same final state (quenching the oscillation). The topology of the torus and the PRC determine whether resetting, quenching, or fibrillation occurs.

## On-Screen Text / Captions
- **0:00** — "Phase winds around a torus — Winfree's biological clock."
- **0:05** — "Irrational ω₁/ω₂ → quasiperiodic orbit fills torus"
- **0:12** — "PRC: phase response curve — how a clock resets"
- **0:20** — "Singular point: oscillator stops oscillating entirely"
- **0:28** — "Circadian rhythm: light at singular phase → jet-lag reset"
- **0:35** — "R-on-T: beat at singular phase → fibrillation"
- **0:43** — "Winfree — topology of biological rhythms."

## End Card
Final 3 seconds: the quasiperiodic orbit sweeping over the torus surface, slowly filling it. Text: "Winfree's book 'The Geometry of Biological Time' (1980) founded the field of mathematical biology's chronobiology." CodedLaws logo.

## Audio
Two interlocking musical tones at irrational frequency ratio — never quite repeating. Voiceover at 0:00: "Two oscillators at incommensurable frequencies trace a trajectory that winds forever over a torus, never repeating — and biology is full of such coupled rhythms." No other voiceover.

## Production Notes
Code complexity: low-moderate. Renderer: three.js (3D torus). Key algorithm: parametric torus surface (R=2, r=1): x = (R+r·cos(φ))·cos(θ), y = (R+r·cos(φ))·sin(θ), z = r·sin(φ). Trajectory: θ(t) = ω₁·t, φ(t) = ω₂·t. Use ω₁=1, ω₂=√2 (irrational). Trace trajectory as a curve on the torus surface. PRC visualisation: 1D circle, mark phase shift as a function of phase — create a sinusoidal or sawtooth PRC typical of a biological oscillator. Singular point: solve φ'(φ, Δ) = φ_0 for a given Δ — where all phase maps to same output. Runtime: three.js WebGL, real-time.
