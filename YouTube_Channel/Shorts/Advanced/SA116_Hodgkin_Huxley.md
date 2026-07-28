---
title: "Hodgkin-Huxley: Action Potential Propagation"
id: SA116
type: youtube-short
duration: "~45 seconds"
feeds_video: "The Hodgkin-Huxley Model: The Math of a Nerve Impulse"
difficulty: advanced
tags: [physics, simulation, short, advanced, hodgkin-huxley, action-potential, neuroscience, ion-channels, biophysics]
---

> **What it is:** A ~45-second simulation showing the Hodgkin-Huxley model simulating voltage-gated Na+ and K+ conductance dynamics generating an all-or-nothing action potential that propagates along a myelinated axon. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** The Hodgkin-Huxley Model: The Math of a Nerve Impulse

# Short: Hodgkin-Huxley — Action Potential Propagation

**Feeds full video:** The Hodgkin-Huxley Model: The Math of a Nerve Impulse

## Visual Hook (First 3 Seconds)
A long axon (grey tube, 1 mm × 10 µm). A brief current injection at the left end. A bright white wave of voltage sweeps right at 28 m/s. The wavefront flares electric blue (+40 mV), followed by a deep purple undershoot (−80 mV). Text: **"28 m/s — powered by ion channels."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Axon cross-section (left panel): lipid bilayer (grey), Na⁺ channels (cyan cylinders), K⁺ channels (orange cylinders), Na/K-ATPase pumps (blue squares). Resting state: Na⁺ channels closed, K⁺ channels partly open. Resting potential: **"V = −65 mV"** shown on dial.
- **0:10** — Current injection: 10 µA/cm² injected at node 0. Membrane depolarizes. V crosses −55 mV threshold. Na⁺ channel activation variable m: **"m: 0.05 → 0.99"** in 0.3 ms. Na⁺ influx (cyan arrows flood in). Voltage spikes: **"V = +40 mV"**.
- **0:18** — Channel gating variables plotted live: m (activation, cyan), h (inactivation, orange), n (K⁺ activation, purple). m peaks first, then h drops to 0 (Na⁺ channels inactivate). n rises, K⁺ channels open → repolarization and undershoot. Timeline shows all four HH variables.
- **0:27** — Propagation: voltage vs. position plot (spatiotemporal map, x-axis = axon length 0–5 mm, y-axis = time 0–10 ms). Action potential wave (yellow-to-blue gradient) sweeps from left to right. Conduction velocity readout: **"v = 28.4 m/s"** calculated.
- **0:36** — Refractory period: a second stimulus applied 1 ms after first AP. Response = nothing (grey flat line). After 3 ms: partial spike. After 5 ms: full spike. Refractory period labeled: **"ARP = 2 ms, RRP = 3 ms."** This prevents backward propagation.
- **0:44** — Myelinated vs. unmyelinated comparison: unmyelinated (continuous conduction, v = 1 m/s, dim white wave). Myelinated (saltatory conduction between nodes of Ranvier, v = 100 m/s, bright blue discrete jumps). Speed ratio label: **"100× faster."**

## Physics Concept Teased
The Hodgkin-Huxley model describes action potential propagation as an active electrical wave governed by voltage-gated ion channel kinetics: three gating variables (m, h, n) control Na⁺ and K⁺ conductances, and the cable equation couples adjacent membrane patches to propagate the spike at a characteristic conduction velocity.

## On-Screen Text / Captions
- **0:00** — "A nerve impulse is a wave of ion channel openings"
- **0:10** — "Threshold crossed: Na+ floods in, voltage spikes +105 mV"
- **0:20** — "m, h, n gating variables: the channel's state machine"
- **0:30** — "Spike travels 28 m/s — at the cost of 3 Na+ per impulse"
- **0:38** — "Myelin: saltatory conduction = 100× the speed"
- **0:45** — "Full HH model derivation → link in bio"

## End Card
Final 3 seconds: spatiotemporal voltage map (colorful diagonal wave band on dark grid). **"CodedLaws — Biophysics"** text.

## Audio
Sharp electrical crackle at spike onset. Synth sweep following voltage trace. 85 BPM electronic beat. No voiceover.

## Production Notes
Renderer: Hodgkin-Huxley cable equation (Python/SciPy). HH parameters: C_m = 1 µF/cm², g_Na = 120 mS/cm², g_K = 36 mS/cm², g_L = 0.3 mS/cm². Cable: 500 compartments × 10 µm, R_a = 35.4 Ω·cm. Integration: Euler method dt = 0.01 ms. Myelination: every 20th compartment active, rest passive. Output 1080×1920, 60 fps.
