---
title: "Reactive MD: ReaxFF Bond Breaking"
id: SA030
type: youtube-short
duration: "~45 seconds"
feeds_video: "Reactive Force Fields: ReaxFF and Bond Breaking in MD"
difficulty: advanced
tags: [physics, simulation, short, advanced, reaxff, reactive-md, bond-breaking, combustion, molecular-dynamics]
---

> **What it is:** A ~45-second simulation of ReaxFF reactive MD of a hydrocarbon undergoing pyrolysis -- covalent bonds breaking and forming without predefined topology as reaction pathways are sampled. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Reactive Force Fields: ReaxFF and Bond Breaking in MD

# Short: Reactive MD — ReaxFF Bond Breaking

**Feeds full video:** Reactive Force Fields: ReaxFF and Bond Breaking in MD

## Visual Hook (First 3 Seconds)
A methane molecule (black carbon, white hydrogens) and two oxygen molecules (red-red pairs) collide at 3,000 K. In 0.8 ps, bonds break and form: CH₄ + 2O₂ → CO₂ + 2H₂O. Each bond flash shown as bright white snap, new bonds glow green. "1 picosecond. Combustion." Text pulses.

## Main Visual Sequence (0:03–0:50)
- **0:03** — Bond order concept: in ReaxFF, bond order BO_ij = exp[−(r_ij/r_0)^p] shown as a curve. At r_ij = 1.1 Å: BO = 0.97 (strong bond, gold). At r_ij = 2.0 Å: BO = 0.05 (broken bond, red). "Bond order replaces discrete connectivity."
- **0:10** — Full ReaxFF energy expression: E_ReaxFF = E_bond + E_over + E_angle + E_torsion + E_vdW + E_Coulomb. Each term appears sequentially (colour-coded). "Charges update every step via EEM" label.
- **0:18** — Electronegativity equalisation (EEM): partial charges shown updating at each MD step. Carbon charge: +0.12 e initially; after O-attack: +0.62 e (CO₂ formation). Charge flow visualised as colour change on atoms.
- **0:27** — Reaction kinetics: 1,000-atom methane/oxygen system at T = 2,500 K. Species count vs time: CH₄ (gold, drops from 250 → 0 in 50 ps); O₂ (red, drops 500 → 0); CO₂ (cyan, rises 0 → 250); H₂O (blue, rises 0 → 500). "Full combustion in 50 ps."
- **0:35** — Transition state: a single C-H bond breaking event caught in extreme slow-motion. Bond order drops from 0.95 → 0.0 over 0.3 ps. Potential energy spike of 4.2 eV shown on energy trace (red peak). "No QM needed for transition state."
- **0:43** — vs DFT validation: ReaxFF activation energy E_a = 0.43 eV (gold bar) vs DFT (PBE) E_a = 0.41 eV (cyan bar). "Error 5% — at 1,000× lower cost."

## Physics Concept Teased
ReaxFF captures bond breaking and formation by making interatomic potential energy depend on continuously varying bond orders computed from interatomic distances, with charges updated self-consistently at every step via EEM — eliminating the need for fixed-connectivity topologies and enabling reactive MD at a fraction of the cost of ab initio methods.

## On-Screen Text / Captions
- **0:00** — "1 picosecond. CH₄ + 2O₂ → CO₂ + 2H₂O." (white, top)
- **0:03** — "Bond order: 0.97 = strong. 0.05 = broken." (gold/red, curve labels)
- **0:10** — "Charges update every step — EEM" (white, lower)
- **0:27** — "Full combustion in 50 ps — 1,000 atoms" (white, bottom bar)
- **0:35** — "Transition state: 4.2 eV spike" (red, energy annotation)
- **0:43** — "ReaxFF vs DFT: 5% error, 1,000× faster" (white, bar annotation)

## End Card
Final 3 seconds: CO₂ and H₂O molecules glow and drift apart. "CODED LAWS" in combustion orange. Subscribe. "Next: Joukowski Airfoil →" teaser.

## Audio
Crackling combustion sfx at 0:00; sharp "snap" for each bond break; satisfying resolution tone when products form. 110 BPM energetic electronic. No voiceover.

## Production Notes
ReaxFF code: AMS/ReaxFF (SCM). Force field: ReaxFF CHO (van Duin 2001, reparameterised). System: 250 CH₄ + 500 O₂ (1,000 C + 2,500 H + 1,000 O = 4,500 atoms) in 30 Å × 30 Å × 30 Å NVT box. T = 2,500 K, Berendsen thermostat. Δt = 0.25 fs. Bond order cutoff: BO < 0.01 = broken. Visualization: VMD + OVITO.
