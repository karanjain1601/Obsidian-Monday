---
title: "Chimera State — Synchronized and Chaotic Coexistence"
id: SM082
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, chimera-state, synchronisation, chaos, coupled-oscillators, nonlinear-dynamics]
---

> **What it is:** A ~45-second simulation short where a ring of identical, symmetrically coupled oscillators spontaneously splits into a steady cyan synchronised half and a chaotic colour-jumping incoherent half with no asymmetry imposed, demonstrating the chimera state as a counterintuitive example of spontaneous symmetry breaking. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Chimera State — Synchronised and Chaotic Coexistence

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A ring of 200 oscillators — the left half glowing steadily in cyan (synchronised, all at the same phase). The right half: a chaotic jumble of all colours, phases jumping randomly. Half synchronised, half chaotic — in the same system, with the same coupling. Impossible? No.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Chimera state definition: a spontaneously symmetry-broken state in a network of identical, symmetrically coupled oscillators where a subset synchronises and the rest remain incoherent. Discovered by Kuramoto and Battogtokh (2002). Caption: "Chimera: half sync, half chaos — in an identical, symmetric system."

**0:10–0:18** — Space-time plot: x-axis = oscillator index (0–200), y-axis = time. Colour = phase. The synchronised region shows a single flat colour (same phase). The incoherent region shows wild colour fluctuations. The boundary between them is sharp. Caption: "Space-time diagram: sync (flat) vs. incoherent (chaotic)."

**0:18–0:27** — Motion of the chimera: the incoherent domain slowly drifts around the ring. The synchronised domain follows. The chimera is dynamically stable — it drifts but doesn't heal or collapse. Caption: "Chimera drifts — stable for thousands of cycles."

**0:27–0:36** — Multi-headed chimeras: with different coupling functions, 2, 3, or 4 incoherent domains appear on the ring — alternating with synchronised domains. Caption: "Multi-chimera: 2, 3, 4 incoherent regions." Each multi-chimera shown.

**0:36–0:45** — Application: chimera states found in (1) chemical oscillators (BZ reaction rings), (2) power grids (some generators desynchronise while others remain in sync), (3) brain states (the sleeping hemisphere in unihemispheric sleep of dolphins). Caption: "Dolphin brain: one hemisphere sleeps, one stays awake — chimera state." Bold text: "Chimera states — symmetry breaking in symmetrical systems." Fade to black.

## Physics Concept Teased
Chimera state: a surprising symmetry-breaking phenomenon in symmetric networks of identical coupled oscillators. Without any heterogeneity or asymmetry, the system spontaneously breaks into a synchronised and an incoherent domain coexisting simultaneously. Discovered in 2002, it challenges the intuition that identical oscillators must synchronise uniformly.

## On-Screen Text / Captions
- **0:00** — "Identical oscillators. Symmetric coupling. Half sync — half chaos."
- **0:05** — "Chimera state: spontaneous symmetry breaking"
- **0:12** — "Space-time: sync (flat) vs. incoherent (chaotic)"
- **0:20** — "Chimera drifts — stable for thousands of cycles"
- **0:28** — "Multi-chimera: 2, 3, 4 incoherent domains"
- **0:35** — "Dolphin unihemispheric sleep: chimera state"
- **0:43** — "Chimera — symmetry breaks its own symmetry."

## End Card
Final 3 seconds: the ring chimera — half glowing steady cyan, half chaotic rainbow. Text: "Discovered in 2002 — the physics community was baffled." CodedLaws logo.

## Audio
Half the ambient music is steady, rhythmic (sync region), half is erratic and arrhythmic (chimera region). They blend in the centre. Voiceover at 0:00: "Take identical oscillators, couple them symmetrically — and half synchronise while the other half remain in chaos." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: Kuramoto ring with non-local coupling. N=200 oscillators on a ring. Coupling: K_ij = G(|i-j|) — Gaussian or exponential in index distance (non-local). Each step: dφ_i/dt = ω + Σ_j K_ij sin(φ_j - φ_i - α), where α=π/2 - 0.1 (phase lag). Chimera requires α slightly less than π/2. Initial condition: φ_i = random in [0,2π] except a synchronised seed region. Space-time plot: store φ_i at each time step; display as a 2D colour-map (phase angle as colour). Runtime: real-time Canvas 2D, fast.
