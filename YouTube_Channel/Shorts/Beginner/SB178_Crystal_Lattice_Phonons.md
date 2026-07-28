---
title: "Phonons: Vibrations in a Crystal Lattice"
id: SB178
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, condensed-matter, phonons, crystal-lattice]
---

> **What it is:** A ~45-second simulation short where displacing one atom in an 8×8 grid of gold spheres connected by green springs sends a ripple of compression across the entire lattice, revealing that heat and sound in solids are quantized collective vibrations called phonons with a measurable wave speed. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Phonons: Vibrations in a Crystal Lattice
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
An 8×8 grid of gold spheres (crystal lattice atoms) connected by green springs sits on a dark background. One atom is displaced upward — and a ripple of vibration propagates across the entire lattice like a wave across a pond. The collective motion is beautiful: a sound wave in solid matter.

## Main Visual Sequence (0:03–0:50)
**0:03** — 8×8 lattice (gold spheres, 30px each, separated by 50px) connected by green spring lines. All atoms at rest. Label: "Crystal lattice — sodium chloride structure." Spring constant k = 20 N/m (labeled). Lattice spacing a = 0.28 nm.

**0:10** — A longitudinal phonon excited at left edge: atoms in leftmost column shift right, compress neighbors, wave propagates right. Displacement shown as color-coded (red = compressed/right, blue = stretched/left). Sound wave propagates at v = √(k/m)·a. With Na mass m = 3.8×10⁻²⁶ kg: v ≈ 3600 m/s. Label: "Sound speed in crystal."

**0:18** — Transverse phonon shown separately: atoms oscillate perpendicular to wave direction (vertical ripple traveling right). Both longitudinal (compression) and transverse (shear) modes labeled side by side. "Solids support both — liquids only support longitudinal."

**0:27** — Quantization: "phonons are quanta of lattice vibrations — like photons are quanta of light." Single phonon energy: E = ħω. At room temperature, many phonons excited (kT ≈ 25 meV; typical phonon energy ≈ 5–50 meV). Phonon dispersion curve (ω vs k) shown: linear at small k, flattens at zone boundary k = π/a.

**0:35** — Heat conduction: phonons carry thermal energy through the crystal (hot end, red atoms → vibration propagates → cool end, blue atoms equilibrate). Label: "Thermal conductivity κ ∝ phonon mean free path." Diamond has highest κ (2200 W/m·K) due to long phonon mean free path.

**0:43** — Connection to specific heat: at low T, phonon number drops (Debye model). Einstein and Debye shown on timeline. "Specific heat goes to zero at 0K — no phonons." CodedLaws logo.

## Physics Concept Teased
Phonons are quantized collective vibrations of atoms in a crystal lattice — the solid-state equivalent of sound waves, but quantized like photons. They carry heat through materials, determine thermal conductivity, contribute to specific heat, and scatter electrons (limiting electrical conductivity). The phonon dispersion relation (ω vs k) encodes all vibrational properties of a crystal.

## On-Screen Text / Captions
- 0:03 → "Crystal lattice: atoms connected by springs"
- 0:10 → "Longitudinal phonon: compression wave, v = 3600 m/s"
- 0:18 → "Transverse phonon: shear wave — only in solids"
- 0:27 → "Phonon energy E = ħω — quantized vibration"
- 0:35 → "Phonons conduct heat through crystals"
- 0:43 → "Zero phonons at 0K → specific heat → 0"

## End Card
Final 3 seconds: Lattice with standing wave pattern (all atoms in phase) — a beautiful normal mode. Text: "Heat is phonons. Sound is phonons. Cold is silence." CodedLaws subscribe.

## Audio
Chime-like tones that match the lattice vibration frequency (slowed to audible range). Different phonon modes produce different pitches. The entire lattice "singing" creates a harmonic chord. Voiceover: "Shake one atom — the entire crystal vibrates. Heat is just all those shakes." Ambient crystal bowl music underneath.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: simulate 1D chain of atoms (N=20) connected by springs; use velocity-Verlet integration; extend to 2D grid by adding springs in both directions; excite specific normal modes (longitudinal or transverse) by initializing displacements as sin(k·na) pattern; color each atom by displacement magnitude. Runtime: real-time. Gotcha: 2D lattice simulation can become unstable — use small timestep (dt = 0.001 in normalized units) and check energy conservation.
