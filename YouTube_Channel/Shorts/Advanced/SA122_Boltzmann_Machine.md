---
title: "Boltzmann Machine: Thermal Sampling"
id: SA122
type: youtube-short
duration: "~45 seconds"
feeds_video: "Boltzmann Machines: Learning with Thermodynamics"
difficulty: advanced
tags: [physics, simulation, short, advanced, boltzmann-machine, thermal-sampling, energy-based-model, deep-learning, statistical-physics]
---

> **What it is:** A ~45-second simulation showing a restricted Boltzmann machine sampling from its energy landscape via Gibbs block sampling with hidden units learning to represent statistical patterns as thermal equilibrium configurations. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Boltzmann Machines: Learning with Thermodynamics

# Short: Boltzmann Machine — Thermal Sampling

**Feeds full video:** Boltzmann Machines: Learning with Thermodynamics

## Visual Hook (First 3 Seconds)
A 6×6 grid of binary neurons (black=0, white=1) randomly flickering. Then they self-organize: a clear digit "7" appears in white on black — the network has sampled a learned pattern from its energy landscape. Text: **"Physics of a thought: minimum energy state."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Energy function displayed: E(v,h) = −Σᵢ aᵢvᵢ − Σⱼ bⱼhⱼ − Σᵢⱼ vᵢWᵢⱼhⱼ. Visible units v (6×6 pixel grid, cyan), hidden units h (4 nodes, orange), weight matrix W (color-coded heatmap). Boltzmann distribution: P(v,h) = exp(−E/T)/Z.
- **0:10** — Energy landscape: 3D surface (state space on x/y, energy on z). Multiple deep wells (blue basins) corresponding to learned patterns. Temperature T slider visible. At T = high (10): random walk on landscape, all states equally probable.
- **0:18** — Annealing: T decreases from 10 → 1 → 0.1 over 200 MCMC steps. System trajectory (red dot) on energy landscape descends from flat plateau into a deep well. Visible unit configuration transforms from noise → partial digit → clean digit "3" (white pattern on 6×6 grid).
- **0:27** — Training (contrastive divergence): data distribution (left panel, 10 sample digit images, blue frames). Model distribution (right panel, 10 Gibbs samples). KL divergence between them: **"KL = 2.1 → 0.3"** after 500 training steps. Weights update visible as W heatmap shifts.
- **0:36** — Restricted Boltzmann Machine (RBM): no hidden-hidden connections — bipartite graph shown. Exact block Gibbs sampling: v→h→v alternates. Each step: h|v = sigmoid(Wᵀv + b), v|h = sigmoid(Wh + a). Two alternating-color frames show the v and h updates.
- **0:44** — Feature visualization: 16 hidden unit receptive fields (16 small 6×6 patches) shown as W_j columns. Each learned a distinct feature: edge detector (vertical/horizontal), curve detector, stroke endpoint. Label: **"Hidden units = feature detectors — like V1 cortex."**

## Physics Concept Teased
A Boltzmann machine defines a Gibbs distribution over binary patterns via an energy function E(v,h): training minimizes the KL divergence between data and model distributions by adjusting weights to lower energy for observed patterns, and the network generates new samples by running MCMC thermal sampling at T = 1.

## On-Screen Text / Captions
- **0:00** — "A neural network with a temperature — and a physics"
- **0:10** — "Energy landscape: learned patterns are deep wells"
- **0:20** — "Cool the system: it falls into a memorized pattern"
- **0:30** — "Training minimizes the distance between data and model"
- **0:38** — "Hidden units learn features — like a visual cortex"
- **0:45** — "Boltzmann machine deep dive → bio link"

## End Card
Final 3 seconds: energy landscape with red ball in a deep well, digit "3" glowing in visible layer. **"CodedLaws — Energy-Based Models"** text.

## Audio
Thermal static (temperature-coded noise) fading to clean tone as system cools. 55 BPM ambient. Crystallization sound at low-T convergence.

## Production Notes
Renderer: RBM + full BM (Python/NumPy). Visible: 36 units (6×6), hidden: 16 units. Training: contrastive divergence k=1 (CD-1). Learning rate: 0.01. Annealing: simulated annealing with T schedule T(t) = T₀·exp(−t/τ_cool). Gibbs sampling: block update. Feature visualization: weight columns reshaped to 6×6. Data: MNIST digits subsampled to 6×6. Output 1080×1920, 60 fps.
