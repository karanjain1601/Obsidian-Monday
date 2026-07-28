---
title: "Kinesin Walk — Two-Headed Processive Motion"
id: SM163
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, biophysics, kinesin, motor-protein, microtubule, hand-over-hand, processive]
---

> **What it is:** A ~45-second simulation short where a two-headed kinesin molecule walks along a microtubule by alternating 16 nm steps for a net 8 nm advance per ATP, with the force-velocity curve showing a stall at 5–7 pN and a FIONA trace confirming the hand-over-hand gait, demonstrating how a processive molecular motor delivers cargo across neuron axons up to a metre long. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Kinesin Walk — Two-Headed Processive Motion

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A kinesin molecule — two "feet" (heads) — walking along a microtubule track. Each step: the rear foot swings forward 16 nm past the front foot, landing on the next tubulin dimer 8 nm ahead. The entire molecule advances 8 nm per step, consuming one ATP. Hand-over-hand walking, in a perfect nanoscale gait.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Kinesin-1 structure: two heavy chains, each with a motor domain (head), a coiled-coil stalk, and a cargo-binding tail. The two heads alternate — one always bound to microtubule (processive, no detachment). Step size: 8 nm per ATP (one tubulin dimer). Caption: "Kinesin: 8 nm step per ATP — hand-over-hand gait." Yanagida (1991) first measured single kinesin steps.

**0:10–0:18** — Mechanochemistry: the "hand-over-hand" mechanism (not inchworm). Proven by FIONA (Fluorescence Imaging with One Nanometer Accuracy, Yildiz 2003). One head fluorescently labelled: observed to take 16 nm steps alternating with the unlabelled head taking 0 nm steps → net 8 nm. Caption: "FIONA (2003): 16 nm alternating steps → 8 nm net per ATP." The two heads are not equivalent — they alternate.

**0:18–0:27** — Force-velocity curve: at zero load, kinesin velocity = 800 nm/s (100 steps/s). At stall force (5–7 pN): velocity → 0. Stall force from optical tweezers (Visscher 1999). Caption: "Stall force: 5-7 pN (optical tweezers, 1999)." Force-velocity: v(F) ≈ v₀·(1 - F/F_stall). Power output: P = F·v ≈ 3.5 pN × 400 nm/s = 1.4 × 10⁻¹⁸ W.

**0:27–0:36** — Random walks: kinesin's detachment rate is small (~0.01/step) but non-zero. Mean run length: ⟨L⟩ ≈ 1 μm (125 steps). After detachment, it diffuses and rebinds. Caption: "Mean run length: ⟨L⟩ ≈ 1 μm — ~125 steps before detachment." Compare to myosin (non-processive, 1 step then detach) — kinesin is the processive one.

**0:36–0:45** — Cargo transport: kinesin carries vesicles from the cell body to the axon tip in neurons. Axon length up to 1 m in giraffe neurons — kinesin must walk continuously. Without kinesin (motor neuron disease): axon cargo fails → neurodegeneration. Caption: "Giraffe neurons: kinesin walks 1 m to deliver synaptic vesicles." Bold text: "Kinesin — the molecular postal service of the cell." Fade to black.

## Physics Concept Teased
Kinesin-1: a processive two-headed motor that walks along microtubules by a hand-over-hand mechanism. Each step is 8 nm (one tubulin dimer), consuming one ATP (ΔG≈50 kJ/mol). Stall force 5–7 pN (optical tweezers). The FIONA technique (2003) resolved individual 16 nm alternating steps. Mean run length ~1 μm; cargo transport in neurons up to 1 m.

## On-Screen Text / Captions
- **0:00** — "Kinesin walks — one ATP per 8 nm step."
- **0:05** — "Hand-over-hand: 16 nm alternating steps → 8 nm net"
- **0:12** — "FIONA (2003): alternating steps directly observed"
- **0:20** — "Stall force: 5-7 pN — v→0 (optical tweezers 1999)"
- **0:28** — "Mean run: ⟨L⟩ ≈ 1 μm = 125 steps before detachment"
- **0:35** — "Giraffe neurons: kinesin delivers cargo over 1 m"
- **0:43** — "Kinesin — the nanoscale walker of the cell."

## End Card
Final 3 seconds: the kinesin molecule mid-stride — one foot forward, one bound — stepping along the microtubule lattice. Text: "100 kinesin molecules can carry a vesicle — cooperating like a team of molecular porters along a nanoscale railway." CodedLaws logo.

## Audio
Gentle stepping sound (click every ~10 ms for one step at 100 steps/s). Voiceover at 0:00: "Kinesin walks on two protein feet, each step exactly 8 nanometers, fueled by one ATP molecule per step — for up to 125 steps before letting go." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D (schematic) or three.js. Key algorithm: stochastic simulation of kinesin mechanochemistry. 6-state kinetic model (two heads, each with 3 states: empty, ADP, ATP). Transition rates from literature. Two key moments: (1) ATP binding to trailing head triggers forward step; (2) Pi release from leading head triggers unbinding. Net position X(t) advances 8 nm per complete cycle. Force effect: reduce forward rate by exp(-F·8nm/2kT). Compute v(F) and detachment probability per step. Plot force-velocity curve. FIONA trace: plot X_trailing(t) showing 16 nm steps. Runtime: fast, Canvas 2D.
