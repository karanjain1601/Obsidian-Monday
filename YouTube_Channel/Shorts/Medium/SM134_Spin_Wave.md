---
title: "Spin Wave — Magnon Propagation"
id: SM134
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, condensed-matter, spin-wave, magnon, magnonics, ferromagnet]
---

> **What it is:** A ~45-second simulation short where a tipped spin precesses and nudges its neighbours along a ferromagnetically aligned chain, launching a magnon — a quantized spin wave with quadratic dispersion — that radiates as a 2D ripple pattern from a point source without any charge transport. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Spin Wave — Magnon Propagation

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A row of atomic spins, all aligned upward. One spin is tipped — it precesses around its equilibrium, nudging its neighbour, which nudges the next. A sinusoidal wave of precessing spins propagates down the chain — a spin wave, the collective excitation of magnetic order.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Ferromagnetic exchange: neighbouring spins prefer to align (exchange interaction J). A tipped spin at site i exerts a torque on spin i+1. The resulting coupled precession is a spin wave. Dispersion relation: ω(k) = ω₀ + Dk² where ω₀ = γμ₀H (Larmor frequency) and D = 2JSa²/ℏ (spin stiffness). Caption: "Spin wave: ω(k) = ω₀ + Dk² — quadratic dispersion."

**0:10–0:18** — Quantisation: spin waves are quantised as magnons. One magnon = one spin flip delocalized over the lattice. Magnon energy: E = ℏω(k). At low temperature, magnon density n(T) ∝ T^(3/2) — the Bloch T^(3/2) law for magnetisation decrease. Caption: "Magnons (quasiparticles) carry ℏ of spin — Bloch T^(3/2) law." Show M(T) data.

**0:18–0:27** — Magnonic waveguide: spin waves propagate in a magnetic nanowire. They carry information (like photons in fiber optics) but without charge — no Joule heating. A magnonic logic gate: two spin-wave pulses interfere (constructive = 1, destructive = 0). Caption: "Magnonics: information on spin waves — zero Joule heat."

**0:27–0:36** — Simulation: 2D spin-wave propagation from a point source in a ferromagnetic sheet. The spin wave radiates in a pattern determined by the dispersion relation (anisotropic for thin films). Show the group velocity vs phase velocity. Caption: "Phase velocity vs group velocity — spin wave packet."

**0:36–0:45** — Spin Seebeck effect: a temperature gradient in a magnet drives a spin-wave current — magnons flow from hot to cold — generating a voltage via the inverse spin Hall effect. Caption: "Spin Seebeck: heat → spin wave → voltage." Bold text: "Spin wave — the magnon's journey through a magnet." Fade to black.

## Physics Concept Teased
Spin wave: a collective excitation of magnetic order in a ferromagnet. The phase of each spin precesses relative to its neighbours, creating a travelling wave. The dispersion is quadratic at low k: ω ∝ k² (unlike acoustic phonons: ω ∝ k). Quantised as magnons, spin waves carry spin angular momentum and can be used for information processing without charge transport.

## On-Screen Text / Captions
- **0:00** — "A ripple through magnetism — the spin wave."
- **0:05** — "ω(k) = ω₀ + Dk² — quadratic dispersion"
- **0:12** — "Magnon: quantum of spin wave — Bloch T^(3/2) law"
- **0:20** — "Magnonics: spin waves carry bits — zero heating"
- **0:28** — "Phase velocity vs group velocity — wave packet spreading"
- **0:35** — "Spin Seebeck: heat → magnon flow → voltage"
- **0:43** — "Spin wave — the magnon's journey."

## End Card
Final 3 seconds: the 2D spin-wave radiation pattern from a point source — beautiful concentric ripples in spin angle. Text: "Magnons can travel millimeters in yttrium iron garnet — farther than electrons travel without scattering in copper." CodedLaws logo.

## Audio
Soft chime at each spin flip. Wave-like musical tone following the wave propagation. Voiceover at 0:00: "In a magnet, a disturbance travels not as a sound wave or light wave — but as a wave of precessing spins, carried by particles called magnons." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D or WebGL. Key algorithm: LLG equation on a 1D or 2D lattice (same as SM133 but without DMI). For clarity, linearise around the equilibrium: δS satisfies ∂²(δS)/∂t² ≈ -ω₀²(δS) + D·∇²(δS). This is a Klein-Gordon equation — solvable with spectral methods. Show dispersion: ω(k)² = ω₀² + D²k⁴ (or linear approximation). For magnonic logic gate: superpose two Gaussian spin-wave pulses with phase difference 0 (add) or π (cancel). Runtime: real-time Canvas for 1D chain; WebGL for 2D.
