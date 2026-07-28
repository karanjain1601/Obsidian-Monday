---
title: "QCD Phase Transition — Quark-Gluon Plasma"
id: SA083
type: youtube-short
duration: "~45 seconds"
feeds_video: "Quark-Gluon Plasma: The Primordial Fireball of the Early Universe"
difficulty: advanced
tags: [physics, simulation, short, advanced, QCD, quark-gluon-plasma, phase-transition, RHIC, LHC]
---

> **What it is:** A ~45-second simulation showing a heavy-ion collision fireball thermalizing into a quark-gluon plasma then expanding, cooling through the QCD crossover, and hadronizing into pions and kaons. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Quark-Gluon Plasma: The Primordial Fireball of the Early Universe

# Short: QCD Phase Transition — Quark-Gluon Plasma

**Feeds full video:** Quark-Gluon Plasma: The Primordial Fireball of the Early Universe

## Visual Hook (First 3 Seconds)
Two gold nuclei (Pb-Pb ions, each ~7 fm diameter) approach each other at 0.9999c in the ATLAS detector cross-section. They collide head-on — an explosion of thousands of colored particles (red, green, blue quarks and cyan gluons). A fireball temperature label: "T = 5.5×10¹² K (5500 times hotter than the sun's core)." Then cooling: hadrons (white blobs) condense from the fireball.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The QCD phase diagram: axes = temperature T (0–600 MeV) and baryon chemical potential μ_B (0–1200 MeV). Three phases shown: hadronic matter (orange region, low T), quark-gluon plasma (red region, high T), and color superconductor (purple, high μ_B, dense). The crossover at T_c = 155 MeV (shown as a gold dashed line) separates hadrons from QGP for μ_B = 0.

**0:10–0:18** — The lattice QCD calculation: the QCD crossover at μ_B = 0 is computed on a 4D spacetime lattice. The Polyakov loop ⟨L⟩ (order parameter for deconfinement) is shown: ⟨L⟩ = 0 below T_c (confined), ⟨L⟩ > 0 above T_c (deconfined). The chiral condensate ⟨ψ̄ψ⟩ similarly drops from its vacuum value to near zero at T_c. Both plotted vs T/T_c (dimensionless).

**0:18–0:26** — The RHIC heavy-ion experiment (Au+Au at √s = 200 GeV): a simulated event shown as a circle (azimuthal view) with thousands of tracks radiating outward. The elliptic flow v₂ = ⟨cos(2φ)⟩ = 0.20 (large flow indicating nearly perfect fluid behavior, η/s ≈ ℏ/4πk_B, the KSS bound). The QGP behaves as the "most perfect liquid ever created."

**0:26–0:34** — Jet quenching: a high-pT parton (quark, green arrow) traveling through the QGP loses energy via gluon bremsstrahlung (red gluon branches off). The nuclear modification factor R_AA = N_AA/(T_AA × N_pp) < 1 at p_T > 5 GeV — indicating suppression. Shown as a bar chart: R_AA = 0.2 in central Pb-Pb vs R_AA = 1.0 in p-p collisions.

**0:34–0:42** — Charmonium suppression: J/ψ mesons (cc̄ bound states, shown as gold dots) are dissolved in the QGP because the Debye screening length λ_D = 1/gT < r_{J/ψ} = 0.5 fm. The J/ψ survival fraction vs centrality (impact parameter): drops from 1.0 in peripheral collisions to 0.2 in central collisions. This is the "quarkonia thermometer" — melting temperature T_diss(J/ψ) = 1.1 T_c.

**0:42–0:50** — Freeze-out and hadronization: at T_cf = 160 MeV (chemical freeze-out), quarks and gluons combine into hadrons (π, K, p, Λ...). The yields follow a statistical thermal model: N_i ∝ g_i e^(−m_i/T) for T_cf = 160 MeV. The predicted π:K:p ratio (5.4:1.0:0.3) matches ALICE data to 10%. Fade to CodedLaws logo.

## Physics Concept Teased
At temperatures above T_c ≈ 155 MeV, nuclear matter undergoes a crossover phase transition from confined hadronic matter to a quark-gluon plasma — a nearly perfect fluid of deconfined quarks and gluons with extremely low shear viscosity. This QGP state existed in the universe during the first microsecond after the Big Bang.

## On-Screen Text / Captions
- **0:00** — "Pb-Pb: fireball at 5.5×10¹² K"
- **0:06** — "QCD crossover at T_c = 155 MeV (1.8×10¹² K)"
- **0:12** — "Lattice QCD: ⟨L⟩ and ⟨ψ̄ψ⟩ both jump at T_c"
- **0:20** — "RHIC: η/s ≈ 1/4π — most perfect fluid"
- **0:28** — "Jet quenching: R_AA = 0.2 (80% energy loss)"
- **0:36** — "J/ψ melts at T = 1.1 T_c (Debye screening)"
- **0:44** — "Freeze-out at T = 160 MeV: π:K:p = 5.4:1:0.3"

## End Card
Final 3 seconds: the heavy-ion collision fireball with colored quark streams, CodedLaws logo overlaid. CTA: "Full video → Quark-Gluon Plasma."

## Audio
Explosive electronic at 95 BPM. Collision impact sound: massive thud + crack. Cooling hiss as fireball expands. Final hadronization: musical chord resolution. No voiceover.

## Production Notes
Renderer: Heavy-ion event visualization: Three.js instanced tracks from PYTHIA simulation. QCD phase diagram: Matplotlib filled regions. Lattice QCD data: published HotQCD collaboration results. Elliptic flow: azimuthal distribution from STAR data. Jet quenching visualization: parton shower tree (custom WebGL). 60 fps, 1080×1920.
