---
title: "Skyrmion Lattice — Magnetic Vortex Crystal"
id: SM133
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, condensed-matter, skyrmion, topology, magnetism, vortex-crystal]
---

> **What it is:** A ~45-second simulation short where a 2D ferromagnet with Dzyaloshinskii-Moriya interaction spontaneously assembles a hexagonal crystal of magnetic skyrmions — tiny topological spin vortices each carrying topological charge Q=-1 — through Landau-Lifshitz-Gilbert spin dynamics, shown annealing from a random spin state. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Skyrmion Lattice — Magnetic Vortex Crystal

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Top-down view of a 2D magnetic material. Initially all spins point up (blue arrows). Then, a hexagonal lattice of tiny magnetic vortices assembles — each a skyrmion, with spins rotating from down at its center, through all directions, to up at its edge. A perfect crystal of topological objects.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — What is a skyrmion: a magnetic soliton (topological defect) in a 2D ferromagnet with Dzyaloshinskii-Moriya interaction (DMI). The spin texture wraps around the sphere once: topological charge Q = -1/(4π) ∫ n·(∂n/∂x × ∂n/∂y) dA = -1. Caption: "Topological charge Q = -1 — impossible to unwind without breaking symmetry."

**0:10–0:18** — The Hamiltonian: H = -J Σᵢⱼ Sᵢ·Sⱼ - D Σᵢⱼ (Sᵢ×Sⱼ)·dᵢⱼ - K Σᵢ (Sᵢ·ẑ)² - μB·Σᵢ Sᵢ. Exchange J stabilises ferromagnetism; DMI D favours spin winding; anisotropy K pins spins to z; field B Zeeman. Caption: "DMI (Dzyaloshinskii-Moriya) is the key — it makes spins twist." Skyrmion lattice phase diagram vs B and T shown.

**0:18–0:27** — Simulation: Landau-Lifshitz-Gilbert (LLG) equation: dS/dt = -γS×H_eff + αS×(S×H_eff)/|S|. Anneal from random spin state at the right (B, T): the skyrmion lattice assembles. Each skyrmion is ~10 nm in size. Caption: "LLG: gyroscopic spin precession + Gilbert damping."

**0:27–0:36** — Topological protection: to destroy a skyrmion, you must pass through a configuration with infinite energy (the skyrmion can't unwind continuously). They can be moved but not created or destroyed by smooth perturbations. Caption: "Topology = protection — like a knot in space." Compare to a ferromagnetic domain wall (not topologically protected — destroyed by fields).

**0:36–0:45** — Applications: racetrack memory — skyrmions pushed along a magnetic nanowire by spin-transfer torque. Ultra-dense magnetic storage. Current drive required: j ≈ 10⁶ A/m². Caption: "Racetrack memory: skyrmions as data bits, 100× denser." Bold text: "Skyrmion — a topological knot in magnetism." Fade to black.

## Physics Concept Teased
Magnetic skyrmion: a topologically non-trivial spin texture with integer topological charge Q = ±1. Protected by topology from smooth deformation into a uniform ferromagnet. Exists in materials with Dzyaloshinskii-Moriya interaction (breaks inversion symmetry). The skyrmion lattice phase forms at specific (B, T) in materials like MnSi and FeGe.

## On-Screen Text / Captions
- **0:00** — "A crystal — made of magnetic knots."
- **0:05** — "Topological charge Q = -1 — impossible to unwind"
- **0:12** — "DMI interaction makes spins twist — skyrmion forms"
- **0:20** — "LLG equation: spin precesses + damps into skyrmion lattice"
- **0:28** — "Topology protects it — like an unknottable knot"
- **0:35** — "Racetrack memory: skyrmions as data bits"
- **0:43** — "Skyrmion — a topological knot in magnetism."

## End Card
Final 3 seconds: the beautiful hexagonal skyrmion lattice in false colour (skyrmion cores blue on a yellow background). Text: "First observed in MnSi by neutron scattering, 2009 — they fit on the head of a pin at 10 nm each." CodedLaws logo.

## Audio
Subtle crystalline chime at each skyrmion forming. Electronic ambient. Voiceover at 0:00: "You can't destroy this magnetic pattern with a magnet — topology makes it indestructible." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: WebGL. Key algorithm: LLG equation on a 2D square lattice with periodic BCs. H_eff = -∂H/∂S (effective field). Forward Euler or RK4. DMI term: D·(ẑ×Sᵢ)·(Sᵢ₊₁-Sᵢ) for Bloch-type skyrmion (D·(Sᵢ×Sᵢ₊₁)·dᵢⱼ for Neel-type). Topological charge: compute Q = -1/(4π) ∫ n·(∂n/∂x × ∂n/∂y) dA numerically on grid. Colour map: Sₓ=R, Sᵧ=G, S_z=B (or HSL from azimuthal angle + polar=brightness). Skyrmion lattice forms when D/J ≈ 0.5–0.8 and B ≈ 0.3–0.5J. Grid: 128×128 spins. Runtime: GPU compute shader, real-time.
