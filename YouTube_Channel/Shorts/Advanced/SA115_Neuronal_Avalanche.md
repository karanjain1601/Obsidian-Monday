---
title: "Neuronal Avalanche: Critical Brain Dynamics"
id: SA115
type: youtube-short
duration: "~45 seconds"
feeds_video: "The Critical Brain: Neuronal Avalanches at the Edge of Chaos"
difficulty: advanced
tags: [physics, simulation, short, advanced, neuronal-avalanche, criticality, brain-dynamics, self-organized-criticality, neuroscience]
---

> **What it is:** A ~45-second simulation showing a cortical neural network at criticality generating scale-free avalanches with cascade size and duration following power-law distributions matching experimental MEG recordings. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** The Critical Brain: Neuronal Avalanches at the Edge of Chaos

# Short: Neuronal Avalanche — Critical Brain Dynamics

**Feeds full video:** The Critical Brain: Neuronal Avalanches at the Edge of Chaos

## Visual Hook (First 3 Seconds)
A 2D grid of 1000 neurons (dark circles). One neuron fires (white flash). A cascade spreads — 2, then 5, then 20, then 200 neurons light up in concentric waves. Counter: **"Avalanche size: 347 neurons."** Text: **"The brain operates at the edge of chaos."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Network: 32×32 grid of 1024 LIF (leaky integrate-and-fire) neurons. Connections: 4 nearest neighbors + 6 random long-range (white lines, thin). Membrane potential color: dark blue (−70 mV, rest) → yellow (−55 mV, threshold). Random drive: 0.001 spikes/neuron/ms.
- **0:10** — Subcritical regime (σ < 1): small avalanche initiated — spreads to only 5 neurons before dying. Size histogram (right panel): exponential decay P(s) ∝ e^(−s/s₀). Label: **"Subcritical: avalanches die fast."**
- **0:18** — Critical regime (σ = 1, branching ratio): same single-neuron trigger — avalanche propagates to 347 neurons across entire grid. Size histogram: power law P(s) ∝ s^(−1.5) shown (log-log plot, straight line). Label: **"Critical: power law distribution."**
- **0:27** — Supercritical regime (σ > 1): single trigger → whole network fires synchronously in 2 steps. Size = 1024 (all neurons). Label: **"Supercritical: epileptic-like seizure."** Grid flashes uniformly yellow-white.
- **0:36** — Why critical? Information transmission panel: mutual information (MI, bits) between input layer and output layer measured across 100 avalanche trials. Subcritical: **"MI = 0.3 bits"**. Critical: **"MI = 1.8 bits"** (6× more). Supercritical: **"MI = 0.4 bits"** (saturates).
- **0:44** — Real brain data: EEG/LFP power spectrum shown (right panel) — 1/f noise spectrum (pink noise). Simulation power spectrum at criticality: matches slope −1.0 in log-log plot. Label: **"Resting EEG: pink noise = signature of criticality."**

## Physics Concept Teased
The brain self-organizes to a critical point (branching ratio σ = 1) between subcritical silence and supercritical seizure: at this phase transition, avalanche sizes follow a power law, information transmission is maximized, and the network produces the 1/f noise characteristic of resting EEG.

## On-Screen Text / Captions
- **0:00** — "One neuron fires — an avalanche of 347 follows"
- **0:10** — "Subcritical: dies fast. Supercritical: seizure."
- **0:20** — "Critical point: power law avalanche sizes"
- **0:30** — "At criticality, information transfer is 6× higher"
- **0:38** — "Resting brain EEG shows this signature: pink noise"
- **0:45** — "Full critical brain dynamics → bio"

## End Card
Final 3 seconds: power law histogram (log-log) with −1.5 slope line. **"CodedLaws — Computational Neuroscience"** text.

## Audio
Sparse electronic clicks (neuron fires), growing density synchronized to avalanche size. 80 BPM ambient. Silence between avalanches.

## Production Notes
Renderer: LIF network (Brian2, Python). Membrane dynamics: τ dV/dt = −(V − V_rest) + RI(t); fire at −55 mV, reset to −70 mV, refractory 2 ms. Synaptic weight W scaled to achieve target branching ratio σ = Σ post-synaptic activations / pre-synaptic activations. Avalanche size: contiguous cascade with < 2 ms inter-event gap. Power law fit: MLE with KS test. Output 1080×1920, 60 fps.
