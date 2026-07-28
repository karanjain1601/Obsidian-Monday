---
title: "Quantum Hall Edge State — Chiral Current"
id: SM131
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Topological_Physics_Full]]"
difficulty: medium
tags: [physics, simulation, short, condensed-matter, quantum-mechanics, topology, Hall-effect]
---

> **What it is:** A ~45-second simulation short where a 2D electron gas under a strong perpendicular magnetic field shows a completely dark insulating bulk while chiral edge currents zip around the boundary in one direction, bending perfectly around an impurity without any backscattering and yielding a quantized Hall resistance precise to one part in ten billion. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Topological_Physics_Full]]

# Short: Quantum Hall Edge State — Chiral Current
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 2D electron gas — a glowing blue rectangle — sits in a powerful magnetic field (field lines piercing it from above). Electrons try to flow through it from left to right. But instead of flowing through the bulk — which is completely insulating — they zip along the edges only, in one direction, never backscattering, never stopping. The bulk is dead. The edge is alive.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** 2D electron gas (rectangle, 200×100 pixels, deep blue). Magnetic field B perpendicular to the plane (shown as dots/circles — field pointing out of screen). Temperature: T << ℏω_c/k_B (quantum regime). Filling factor ν = nh/(eB) shown in corner — integer value ν = 1 displayed.
- **0:10–0:18:** Bulk states: in the bulk, electrons undergo cyclotron orbits — circular trajectories shown as white closed loops spiraling. At integer filling ν, the Fermi energy sits in a Landau level gap. Bulk conductivity σ_xx → 0 (insulating). Hall conductivity σ_xy = νe²/h — exact, universal. Both values shown in a conductivity matrix display.
- **0:18–0:28:** Edge states emerge: at the physical edge of the sample, the confinement potential lifts the Landau levels upward. The bands cross the Fermi level at the edge. Single chiral edge mode visualized: an electron current (bright gold arrows) runs counterclockwise along the top edge (rightward) and clockwise along the bottom edge (leftward) — one direction each. Electrons skip along the boundary completing skipping orbits (semicircles at the edges).
- **0:28–0:38:** Backscattering immunity: introduce a defect (impurity — dark red dot) on the edge. The electron wave function hits the defect and... does not scatter backward. It must go forward — there are no backward-propagating edge states to scatter into (chirality protects it). The current bends around the defect perfectly. Contrast: in a normal metal, the defect would cause resistance. Here: resistance = 0 along the edge.
- **0:38–0:45:** Precision of the Hall resistance: R_H = h/(νe²) — one of the most precisely measured constants in physics. Used to define the ohm since 1990 and now underpins the SI definition of the kilogram. Text: "R_H = 25,812.807 Ω exactly. The most precise resistance measurement ever." Metrological reference shown.

## Physics Concept Teased
The Integer Quantum Hall Effect (IQHE) occurs in a 2D electron gas at low T and high B. Landau level quantization creates an insulating bulk. At the edges, Landau levels cross the Fermi level, giving rise to chiral (one-directional) edge modes — one per filled Landau level ν. These modes are topologically protected: they cannot backscatter because there are no counterpropagating modes to scatter into. The Hall conductivity is quantized to σ_xy = νe²/h with extraordinary precision — a manifestation of the Berry phase and the TKNN topological invariant (Chern number = ν).

## On-Screen Text / Captions
- **0:00:** "The inside does nothing. The edge carries everything — in one direction, perfectly."
- **0:08:** "Filling factor ν = 1. Landau level gap."
- **0:15:** "Bulk insulating. σ_xx → 0."
- **0:22:** "Chiral edge state — no backward channel exists"
- **0:30:** "Defect? The current goes around. Resistance = 0."
- **0:38:** "σ_xy = νe²/h — exact to 1 part in 10¹⁰"
- **0:44:** "von Klitzing, Nobel Prize 1985."

## End Card
Final 3 seconds: a clean topological band diagram — Landau levels in the bulk, edge state crossing the gap — drawn in gold on black. Text: "Topology makes this measurement perfect. No physics can break it." Channel logo.

## Audio
Deep quantum hum — clean sine tone at the cyclotron frequency (pitched to audible range). Clinical, precise ambient. Voiceover (quiet, awestruck): "The edge current is perfect. Not because nothing disturbs it — but because topology forbids it from failing." No sound effects. The precision of the physics should feel like silence.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D + WebGL. Key algorithm: Tight-binding model on a square lattice in a magnetic field — Hofstadter butterfly. Hamiltonian: H = -t·Σ_{<i,j>}(e^{iφ_{ij}}·c†_i·c_j + h.c.) where φ_ij is the Peierls phase. Diagonalize H numerically (matrix size N²×N², N=20–30 for visual demonstration). Energy spectrum shows Landau levels with flat bulk bands and dispersive edge bands. Visualize: scatter plot of eigenstates in (k, E) space showing edge mode crossing the gap. Real-space current density: J_ij = (2et/ℏ)·Im[e^{iφ_{ij}}·ρ_{ij}] computed for filled states. Skipping orbit visualization: classical cyclotron orbit with reflective boundary (analytic). Gotcha: to see a clean ν=1 edge state, tune the filling and field carefully. Use a finite ribbon geometry (periodic in x, open in y) to get clear 1D edge band dispersion.
