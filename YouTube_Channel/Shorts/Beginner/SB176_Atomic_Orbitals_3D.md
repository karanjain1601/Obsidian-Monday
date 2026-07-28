---
title: "Atomic Orbitals: Where Electrons Actually Live"
id: SB176
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, quantum-physics, atomic-orbitals, electron-density]
---

> **What it is:** A ~45-second simulation short where a glowing white sphere morphs into a blue dumbbell and then explodes into a five-lobed orange 3d cloud as orbitals transition from 1s to 2p to 3d, revealing the quantum number shapes that define where electrons actually live and govern every chemical bond. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Atomic Orbitals: Where Electrons Actually Live
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A glowing white sphere (1s orbital) rotates slowly. Then it morphs — stretching into a dumbbell shape (2p orbital, glowing blue). Then explodes into a 4-lobed clover (3d orbital, glowing orange). Each shape is a probability cloud showing WHERE the electron spends its time. The morphing sequence is visually stunning.

## Main Visual Sequence (0:03–0:50)
**0:03** — Hydrogen nucleus (gold dot, center). 1s orbital: spherically symmetric cloud (white gradient, bright center, fading outward). Label: "1s orbital — n=1, l=0, m=0." Radial probability: peak at Bohr radius a₀ = 0.053 nm. "Electron is MOST LIKELY here — but could be anywhere in the cloud."

**0:10** — Transition to 2s: larger sphere (n=2), with one radial node (inner dark ring, zero probability). Label: "2s — n=2, l=0: one node." Then 2p orbital appears: dumbbell shape oriented along z-axis (blue lobes above and below nucleus). "2p — n=2, l=1, m=0: one angular node (xy-plane)."

**0:18** — All three 2p orbitals shown simultaneously: 2p_x (red, along x), 2p_y (green, along y), 2p_z (blue, along z). Together they form a complete spherical distribution. Each rotates slowly. Quantum numbers labeled for each.

**0:27** — 3d orbitals: five shapes shown, rotating slowly. d_z² (dumbbell + torus, orange), d_x²-y² (4 lobes in xy-plane, purple), d_xy, d_xz, d_yz (each 4-lobed, different orientations). Label: "n=3, l=2: five 3d orbitals."

**0:35** — Orbital energy diagram: energy levels shown as horizontal lines. 1s (lowest), 2s=2p, 3s=3p=3d (hydrogen, degeneracy). Electrons fill from lowest energy upward (Aufbau principle). Periodic table connection: "s-block: l=0, p-block: l=1, d-block: l=2."

**0:43** — Beautiful slow rotation of all shown orbitals simultaneously. Caption: "These shapes determine all chemistry — every bond, every reaction, every molecule." CodedLaws logo.

## Physics Concept Teased
Atomic orbitals are quantum mechanical probability distributions (|ψ|²) describing where an electron is likely to be found around a nucleus. Each orbital is defined by three quantum numbers: n (energy/size), l (shape/angular momentum), and m (orientation). The shapes emerge directly from solving the Schrödinger equation for a hydrogen atom.

## On-Screen Text / Captions
- 0:03 → "1s: n=1, l=0 — spherical, Bohr radius = 0.053nm"
- 0:10 → "2p: n=2, l=1 — dumbbell shape"
- 0:18 → "Three 2p orbitals: x, y, z directions"
- 0:27 → "Five 3d orbitals — complex shapes"
- 0:35 → "s-block, p-block, d-block in periodic table"
- 0:43 → "Shape determines every chemical bond"

## End Card
Final 3 seconds: Rotating 3d_z² orbital (orange dumbbell with torus), labeled. Text: "Quantum shapes of the universe." CodedLaws subscribe.

## Audio
Ethereal, harmonic ambient music — pure sine wave tones tuned to hydrogen spectral frequencies (mapped to audible range). Each orbital transition accompanied by a tone corresponding to its energy level. No voiceover. The visual beauty carries the short. Voiceover optional at 0:43: "These shapes. Every chemical bond you've ever seen comes from here."

## Production Notes
Code complexity: complex. Renderer: WebGL (3D volumetric rendering required for orbital shapes). Key visual trick: render orbitals as volumetric density clouds using a ray-marching shader; compute |ψ(r,θ,φ)|² = |R_nl(r)|² × |Y_lm(θ,φ)|² analytically (spherical harmonics × radial wavefunctions); use transfer function to map density to color+opacity. Alternatively for Canvas 2D: draw cross-sectional heatmaps of |ψ|² in the xz-plane, then rotate the image. Runtime: pre-rendered for WebGL; real-time for 2D cross-section approach. Gotcha: 3d orbitals have complex phases when combining m=±2 — use real linear combinations (d_z², d_x²-y², d_xy, d_xz, d_yz) which are what chemists use.
