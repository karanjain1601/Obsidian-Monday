---
title: "Cortical Column: Minicolumn Firing Patterns"
id: SA118
type: youtube-short
duration: "~45 seconds"
feeds_video: "The Cortical Column: How Neocortex Processes Information"
difficulty: advanced
tags: [physics, simulation, short, advanced, cortical-column, neocortex, minicolumn, neural-dynamics, neuroscience]
---

> **What it is:** A ~45-second simulation showing a neocortical minicolumn of ~100 Hodgkin-Huxley neurons firing in synchronized bursts with up-states and down-states emerging from local recurrent excitation-inhibition balance. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** The Cortical Column: How Neocortex Processes Information

# Short: Cortical Column — Minicolumn Firing Patterns

**Feeds full video:** The Cortical Column: How Neocortex Processes Information

## Visual Hook (First 3 Seconds)
A cross-section of neocortex (6 horizontal layers, each a different blue shade from pale to dark). In the middle column, neurons suddenly fire in a cascade — white flashes ripple up and down through all 6 layers. Text: **"6 layers. 110,000 neurons per mm². 1 computation."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Cortical column anatomy: vertical slice 500 µm wide × 2 mm deep. Six layers labeled: L1 (pale blue, few neurons), L2/3 (cyan, pyramidal neurons), L4 (teal, stellate, input layer), L5 (dark blue, thick pyramidal, output), L6 (navy, corticothalamic). Each layer shows cell-type icons.
- **0:10** — Thalamic input: glutamatergic axon (yellow) arrives at L4. L4 stellate neurons (50 neurons, teal) fire a burst: **"45 Hz, 3 spikes"**. Feedforward excitation projects to L2/3 pyramidals (cyan). Raster plot (right panel) shows firing: L4 leads by 2 ms.
- **0:18** — L2/3 recurrent amplification: once L4 drives L2/3 above threshold, recurrent excitatory connections (white arrows between L2/3 cells) sustain activity without further thalamic input. Sustained firing at **"20 Hz for 150 ms"** shown as persistent orange glow.
- **0:27** — L5 output: thick apical dendrites (bright white vertical lines) of L5 pyramidals integrate L2/3 signals. L5 fires strong bursts (**"80 Hz, burst of 5 spikes"**) that drive subcortical targets. L6 simultaneously sends corticothalamic feedback (dashed purple arrow down).
- **0:36** — Inhibitory interneurons: fast-spiking PV+ interneurons (red circles) activated after 10 ms. They strongly inhibit pyramidals, terminating sustained activity — sharp OFF transient visible. Label: **"PV+ basket cells: the cortex's brakes."** Inhibitory postsynaptic current = −12 nS.
- **0:44** — Gamma oscillation emergence: L2/3 excitatory-inhibitory (E-I) loop produces 40 Hz oscillation (gamma). Spectrogram (right) shows gamma band power peak: **"40 Hz, 8 dB above noise."** Input strength modulates gamma amplitude continuously.

## Physics Concept Teased
The cortical minicolumn is a canonical E-I circuit: thalamic input drives L4 stellates, which excite L2/3 pyramidals into recurrent attractor states, while PV+ interneurons close the E-I loop producing gamma-band oscillations — the fundamental computation of sensory cortex.

## On-Screen Text / Captions
- **0:00** — "6 layers, 110,000 neurons per mm² — one processing unit"
- **0:10** — "Thalamus triggers L4; L4 ignites L2/3"
- **0:20** — "Recurrent excitation holds the activity alive"
- **0:30** — "L5 broadcasts the result to the whole brain"
- **0:38** — "PV+ interneurons generate 40 Hz gamma — the brain's beat"
- **0:45** — "Full cortical column model → bio"

## End Card
Final 3 seconds: cortical layer diagram with gamma oscillation spectrogram below it. **"CodedLaws — Neural Circuits"** text.

## Audio
40 Hz gamma tone embedded in ambient drone. 80 BPM background. Sharp inhibitory "snap" SFX at PV+ firing.

## Production Notes
Renderer: multicompartment conductance-based model (NEURON simulator, Python interface). L2/3 pyramidal: 5-compartment (soma + 4 dendrite). L4 stellate: 2-compartment. PV+ interneuron: 1-compartment fast-spiking. Synaptic weights calibrated to Markram et al. (2015) Blue Brain data. Network: 1000 neurons, 10,000 synapses, EI ratio 4:1. Gamma oscillation: Wilson-Cowan analysis confirms 38–42 Hz resonance. Output 1080×1920, 60 fps.
