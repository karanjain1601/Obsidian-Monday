---
title: "Dielectrophoresis — Particle Trapping in Field Gradient"
id: SM125
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Microfluidics_Full]]"
difficulty: medium
tags: [physics, simulation, short, electrokinetics, microfluidics, biophysics, electrostatics]
---

> **What it is:** A ~45-second simulation short where live (green) and dead (red) cells flowing through a microfluidic channel sort themselves to opposite electrode regions in seconds as a non-uniform AC electric field exerts opposite dielectrophoretic forces on particles of different polarizability. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Microfluidics_Full]]

# Short: Dielectrophoresis — Particle Trapping in Field Gradient
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A microfluidic channel carries a mix of live cells (green) and dead cells (red) in a flowing stream. Electrode fingers below the channel glow with a non-uniform electric field. The live cells veer toward the electrode tips. The dead cells flee to the troughs. In seconds, the mixture is sorted — no label, no antibody, no force other than an oscillating voltage.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** 2D overhead view of a microfluidic channel (width 200 μm). Eight interdigitated electrode fingers (gold stripes) below the glass floor. Applied: 1 MHz AC voltage, 10 Vpp. Electric field lines shown in white — curving from electrode tips (high field, bright) to gaps (low field, dark). Field non-uniformity ∇|E|² mapped as a background heatmap (red=high, blue=low).
- **0:10–0:18:** Particles entering from the left. DEP force: F_DEP = 2πr³ε_m·Re[K(ω)]·∇|E|². Clausius-Mossotti factor K(ω) = (ε_p* - ε_m*)/(ε_p* + 2ε_m*) where ε* = ε - jσ/ω. Live cells (high σ_p): K > 0 → positive DEP → attracted to field maxima (electrode tips). Dead cells (low σ_p, membrane disrupted): K < 0 → negative DEP → repelled from field maxima → driven to field minima.
- **0:18–0:28:** Sorting in action: green live cells (50 particles) drift toward the electrode edges — clustering near the tips in bright green islands. Red dead cells drift to the center of the gaps — forming rows between the electrodes. The two populations separate spatially within 5 seconds of flowing. Separation efficiency label: >95%.
- **0:28–0:38:** Frequency sweep: a slider changes frequency from 100 kHz to 10 MHz. At low frequency: live cells show positive DEP. At crossover frequency f_c (where K=0): no DEP force on live cells — they flow straight. Above f_c: live cells show negative DEP (both cell types flee the tips). Crossover frequency label: f_c = (1/2π)·√((σ_p² - σ_m²)/(ε_p² - ε_m²)).
- **0:38–0:45:** Application: circulating tumor cell (CTC) capture — cancer cells in blood have different DEP signature than red blood cells. A blood flow schematic shows CTCs (orange) trapped on electrodes while red blood cells pass through. Text: "Early cancer detection without a biopsy."

## Physics Concept Teased
Dielectrophoresis (DEP) is the motion of polarizable particles in a non-uniform electric field. Unlike electrophoresis (which requires net charge), DEP works on neutral but polarizable particles. The force is proportional to ∇|E|² and the Clausius-Mossotti factor K(ω), which depends on the frequency-dependent complex permittivity of the particle and medium. Positive DEP (K>0) attracts to field maxima; negative DEP (K<0) repels to field minima. Critically, K crosses zero at the crossover frequency — allowing selective manipulation of biological cells.

## On-Screen Text / Captions
- **0:00:** "No label. No touch. Just a voltage — and cells sort themselves."
- **0:08:** "DEP force ∝ Re[K(ω)] · ∇|E|²"
- **0:15:** "Live cells: positive DEP → tips. Dead cells: negative DEP → gaps."
- **0:23:** "Separation in 5 seconds. >95% efficiency."
- **0:30:** "Crossover frequency: K flips sign"
- **0:38:** "Circulating tumor cells captured without a biopsy."
- **0:44:** "AC field. No net charge needed. Just polarizability."

## End Card
Final 3 seconds: overhead view — green cell clusters at electrode tips, red clusters in gaps, perfectly sorted. Text: "A voltage gradient is a cell sorter." Channel logo.

## Audio
Clean electronic tone at the AC frequency (1 MHz, pitched down 6 octaves to audible range — ~15.6 Hz subharmonic for ambience). Clinical ambient with subtle digital percussion. Voiceover (focused, clipped): "Different cells. Different polarizability. Same electric field. Physics does the sorting." Soft chime when the cells separate at 0:18.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D + p5.js. Key algorithm: Compute E-field from electrode geometry using conformal mapping or finite element method (FEM). ∇|E|² computed from E field at each point. Particle motion: overdamped Langevin equation dx/dt = (F_DEP + F_drag + F_Brownian)/γ, where γ = 6πμr (Stokes drag). For biological cells (r ~ 5 μm): F_DEP / γ ~ 1–100 μm/s (tractable). Clausius-Mossotti: compute ε*_p and ε*_m at each frequency from lookup tables for cell and medium. Frequency slider: recompute K(ω) in real time. Particle count: 100 live + 100 dead. Gotcha: at 1 MHz the wavelength in water is ~1.5 mm — much larger than the channel, so quasi-static field assumption is valid. Above 100 MHz this breaks down.
