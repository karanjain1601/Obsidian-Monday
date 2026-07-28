---
title: "Motor Protein — Myosin Power Stroke"
id: SM162
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, biophysics, motor-protein, myosin, actin, power-stroke, brownian-ratchet]
---

> **What it is:** A ~45-second simulation short where a myosin II head cycles through the four Lymn-Taylor biochemical states, swinging its lever arm 70° in the power stroke to deliver a 5 pN force and 10 nm displacement per ATP molecule at 60% efficiency, demonstrating how an asymmetric Brownian ratchet converts chemical free energy into directed mechanical work in muscle contraction. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Motor Protein — Myosin Power Stroke

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A molecular animation: a myosin II head — a protein with a lever arm — bound to an actin filament. ATP binds, the head detaches, the lever arm "cocks" (prepower stroke). The head rebinds to actin. Pi is released — and the lever arm swings 70° in the power stroke, generating a 5 pN force and a ~10 nm displacement. Muscle contraction, one molecule at a time.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Lymn-Taylor cycle: 4 biochemical states. (1) Rigor (AM): myosin attached to actin, no nucleotide. (2) Detached (AM·ATP): ATP binds, myosin detaches. (3) Prepowerstroke (M·ADP·Pi): ATP hydrolysis, lever arm cocks, myosin rebinds actin weakly. (4) Postpowerstroke (AM·ADP): Pi release triggers power stroke — lever arm swings. Caption: "Lymn-Taylor cycle: ATP hydrolysis → 10 nm step, 5 pN force."

**0:10–0:18** — Thermodynamics: ATP hydrolysis provides ΔG ≈ 50 kJ/mol ≈ 20 kT at physiological conditions. Power stroke work: W = F·d = 5 pN × 10 nm = 50 pN·nm = 50·10⁻²¹ J = 12 kT. Efficiency: η = W/ΔG ≈ 12kT/20kT ≈ 60%. Caption: "Efficiency: W/ΔG ≈ 60% — myosin is highly efficient." Compare to car engine (25%) and electric motor (90%).

**0:18–0:27** — Brownian ratchet aspect: myosin also uses thermal fluctuations. The binding energy landscape is asymmetric — thermal noise drives forward motion at the correct moments. This is a Brownian ratchet (Huxley 1957 crossbridge model). Caption: "Brownian ratchet: asymmetric potential + thermal fluctuations → directed motion."

**0:27–0:36** — Single-molecule measurements: optical tweezers (Finer 1994) — a single myosin head pulls an actin filament bead. Measured: step size 5–25 nm (depending on myosin type), force 1–7 pN, stall force 5 pN. Caption: "Optical tweezers (1994): single myosin measured — 10 nm, 5 pN." Show force-displacement record with individual steps.

**0:36–0:45** — Collective muscle: a muscle fibre has ~600 myosin heads per thick filament. They are asynchronously stepping — some in power stroke, some detached. This asynchrony ensures smooth, continuous force generation. Caption: "600 heads per filament: asynchronous stepping → smooth force." Bold text: "Myosin power stroke — nature's molecular motor." Fade to black.

## Physics Concept Teased
Myosin motor: converts ATP free energy (ΔG≈50 kJ/mol) into mechanical work via a lever-arm power stroke (10 nm displacement, 5 pN force, 60% efficiency). The Lymn-Taylor cycle describes the four biochemical states. Brownian ratchet physics: the asymmetric binding energy landscape rectifies thermal fluctuations into directed motion. Measured by optical tweezers at single-molecule resolution.

## On-Screen Text / Captions
- **0:00** — "Myosin: one ATP molecule → one muscle contraction step."
- **0:05** — "Lymn-Taylor: 4 states — attach, detach, cock, power stroke"
- **0:12** — "W = 5 pN × 10 nm = 12 kT; η ≈ 60% efficient"
- **0:20** — "Brownian ratchet: asymmetric potential + thermal noise"
- **0:28** — "Optical tweezers (1994): 10 nm, 5 pN — single molecule"
- **0:35** — "600 heads: asynchronous → smooth muscle force"
- **0:43** — "Myosin — nature's molecular motor, 60% efficient."

## End Card
Final 3 seconds: the lever arm swinging through 70° — animated as a smooth arc. Text: "If you could scale myosin up to human size, its power stroke would be like a 2-meter lever swinging at 100 m/s." CodedLaws logo.

## Audio
Soft mechanical clicking at each power stroke. Voiceover at 0:00: "Your muscles contract because millions of myosin molecules each swing a tiny lever arm 10 nanometers — burning one ATP molecule per step." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D (schematic molecular animation) or three.js for 3D protein conformation. Key algorithm: stochastic simulation of the Lymn-Taylor cycle. 4-state Markov chain with transition rates: k_ATP_bind (ATP concentration-dependent), k_detach, k_hydrolysis, k_Pi_release (the rate-limiting step — triggered by actin rebinding). For each state transition: advance step counter by +1. Compute average velocity v = ⟨step_size⟩ × k_Pi_release. Force-velocity curve: apply opposing force F; reduce k_Pi_release by exp(-F·d_ps/kT). Plot v(F): should be nearly linear with stall at F_stall. Runtime: fast, Canvas 2D schematic + rate equations.
