---
title: "Spiking Neural Network: STDP Learning"
id: SA121
type: youtube-short
duration: "~45 seconds"
feeds_video: "STDP: How the Brain Learns from Timing"
difficulty: advanced
tags: [physics, simulation, short, advanced, snn, stdp, spike-timing, hebbian-learning, neuroscience]
---

> **What it is:** A ~45-second simulation showing a spiking neural network with STDP learning a temporal sequence -- synapses potentiating for pre-before-post timing and depressing for post-before-pre timing. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** STDP: How the Brain Learns from Timing

# Short: Spiking Neural Network — STDP Learning

**Feeds full video:** STDP: How the Brain Learns from Timing"

## Visual Hook (First 3 Seconds)
Two neurons connected by a glowing synapse. Neuron A fires (cyan flash). Then neuron B fires (orange flash), 5 ms later. The synapse thickens and brightens: **"ΔW = +0.08."** They fire again — same order — synapse brightens more. Text: **"Neurons that fire together, wire together."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — STDP learning rule window: x-axis = Δt = t_post − t_pre (−100 to +100 ms). y-axis = ΔW (−0.1 to +0.1). Curve: pre-before-post (Δt > 0) → LTP (positive, red); post-before-pre (Δt < 0) → LTD (negative, blue). Time constants: τ+ = 20 ms, τ− = 20 ms. A+ = 0.01, A− = 0.0105.
- **0:10** — Network: 100 pre-synaptic neurons (cyan) → 1 post-synaptic neuron (orange). Initial weights uniform: **"W = 0.05"** (dim cyan lines). Pre-neurons receive Poisson input at 10 Hz. Post-neuron fires occasionally.
- **0:18** — After 1000 spike pairs: weight distribution bimodal — 40% of synapses driven to W = 0 (silent, invisible), 60% driven to W = 0.12 (strong, bright). Label: **"Bimodal weight distribution emerges from symmetric STDP."** Histogram shown.
- **0:27** — Pattern learning: one subgroup of 20 pre-neurons (yellow) fires in synchrony (0–5 ms jitter). After 2000 pairs: their synapses all strengthen to **"W = 0.15"** while random inputs weaken. Post-neuron now reliably fires only when the synchronous group activates.
- **0:36** — Selectivity measurement: 5 different input patterns (A,B,C,D,E). Post-neuron response (spikes/sec) plotted as bar chart. Pattern A (the learned one): **"48 spikes/sec"**. Patterns B-E: **"3–8 spikes/sec"**. Selectivity index SI = 0.87. Label: **"Network learned pattern A without supervision."**
- **0:44** — Biological validation: STDP curve measured in hippocampal neurons (Bi & Poo 1998) overlaid on simulation curve. Orange circles (data) align with model curve (cyan). Label: **"Model matches biology within 15%."** Temperature: 32°C, species: rat.

## Physics Concept Teased
STDP is a Hebbian learning rule where synapse strength changes depend on the precise millisecond timing between pre- and post-synaptic spikes: this asymmetric plasticity window implements a temporal causality detector, driving networks to become selectively responsive to coincident pre-synaptic input patterns.

## On-Screen Text / Captions
- **0:00** — "Neurons learn from microsecond timing differences"
- **0:10** — "Pre fires before post: synapse strengthens (LTP)"
- **0:20** — "After 1000 pairs: weights split into strong and silent"
- **0:30** — "Synchronous group learned: 48 Hz response vs. 5 Hz noise"
- **0:38** — "Selectivity index 0.87 — unsupervised learning"
- **0:45** — "STDP full tutorial → link in bio"

## End Card
Final 3 seconds: weight histogram (bimodal, blue and red peaks) with synapse network overlay. **"CodedLaws — Synaptic Plasticity"** text.

## Audio
Sparse neuron clicks accelerating as learning progresses. 78 BPM ambient. Bright tone when pattern selectivity peaks.

## Production Notes
Renderer: SNN with STDP (Brian2, Python). Neuron model: LIF, τ_m = 20 ms, V_th = −55 mV. STDP: nearest-neighbor spike pairs. Weight bounds: [0, W_max = 0.2]. Poisson input: 100 neurons at 10 Hz. Simulation: 10,000 ms training, 1000 ms test. SI = 1 − (second_max/max_response). Output 1080×1920, 60 fps.
