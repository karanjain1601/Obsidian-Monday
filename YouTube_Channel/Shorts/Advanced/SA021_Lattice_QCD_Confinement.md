---
title: "Lattice QCD: Quark Confinement"
id: SA021
type: youtube-short
duration: "~45 seconds"
feeds_video: "Lattice QCD: Simulating the Strong Force on a Grid"
difficulty: advanced
tags: [physics, simulation, short, advanced, lattice-qcd, qcd, quark, confinement, gauge-theory]
---

> **What it is:** A ~45-second simulation on a 4D Euclidean Lattice QCD grid showing chromoelectric flux tubes forming a confining string between a static quark-antiquark pair. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Lattice QCD: Simulating the Strong Force on a Grid

# Short: Lattice QCD — Quark Confinement

**Feeds full video:** Lattice QCD: Simulating the Strong Force on a Grid

## Visual Hook (First 3 Seconds)
A 4D hypercubic lattice (shown as a 3D projection, glowing gold links, dark background) with two bright red quarks at opposite corners connected by a gluon flux tube — a blazing orange/red string of energy density. As the quarks are pulled apart, the string stretches like a rubber band until it snaps and new quarks pop out. Text: "Quark separation: 1.0 fm. Energy: 0.9 GeV".

## Main Visual Sequence (0:03–0:50)
- **0:03** — Lattice structure: 4D grid, lattice spacing a = 0.1 fm, size 32⁴. Links shown as SU(3) gauge links U_μ(x) (gold arrows on each link). Plaquette (1×1 square of links) highlighted in cyan — the fundamental building block.
- **0:10** — Wilson loop: a rectangular loop W(r,T) drawn on the lattice (r = 0.5 fm, T = 1 fm), glowing green. "〈W〉 = e^(−VT)" shown. Static quark potential V(r) extracted: linear confining string σr + Coulomb −α/r shown on plot.
- **0:18** — Flux tube visualisation: action density field between two quarks (red = high, blue = low). String tension σ = 0.18 GeV/fm shown as slope of linear potential. At r = 1.2 fm: flux tube breaking — pair production flash (white burst, two new quarks emerge).
- **0:27** — QCD vacuum: 3D slice showing instantons (gold blobs of topological charge Q = ±1) embedded in the vacuum. "Topological susceptibility χ_t = 0.0026 GeV⁴" in white. Vacuum not empty — it seethes.
- **0:35** — Running coupling α_s(μ): plotted vs energy scale μ (1–100 GeV). At μ = 1 GeV: α_s = 0.5 (strong). At μ = 100 GeV: α_s = 0.12 (weak). "Asymptotic freedom" label at high μ; "confinement" at low μ.
- **0:43** — Hadron spectrum: predicted masses for π (139 MeV), K (494 MeV), p (938 MeV), Δ (1232 MeV) shown as gold bars vs experimental values (white error bars). "Lattice QCD predicts hadron masses from first principles."

## Physics Concept Teased
Lattice QCD replaces continuous spacetime with a discrete 4D grid, representing gluon fields as SU(3) matrices on links between sites — enabling numerical evaluation of path integrals that prove quark confinement through the area law of Wilson loops and the linear rise of the static quark potential.

## On-Screen Text / Captions
- **0:00** — "1.0 fm. 0.9 GeV. The string snaps." (white, top)
- **0:10** — "〈W〉 = e^(−VT) — the Wilson loop" (green, equation)
- **0:18** — "σ = 0.18 GeV/fm — string tension" (red, slope annotation)
- **0:27** — "The vacuum teems with instantons" (gold, lower)
- **0:35** — "Asymptotic freedom: α_s shrinks at high energy" (white, bottom bar)
- **0:43** — "Proton mass from first principles: 938 MeV" (gold, bar label)

## End Card
Final 3 seconds: the flux tube glows and snaps in slow motion. "CODED LAWS" in deep red. Subscribe. "Next: Mean Field Ising →" teaser.

## Audio
Low rumbling string tension drone; sharp "snap" when flux tube breaks; triumphant chord on hadron spectrum reveal. 65 BPM epic ambient. No voiceover.

## Production Notes
LQCD code: openQCD. Lattice: 32⁴, a = 0.1 fm, β = 6.0. Action: Wilson plaquette (gauge) + Wilson fermion (clover improvement). Quenched approximation for speed. Wilson loops measured with APE smearing (ε = 0.4, 20 steps). Visualization: custom OpenGL 4D→3D projection. Simulation: 8,192 GPU hours (A100).
