---
title: "Normalizing Flow: Exact Density Estimation"
id: SA124
type: youtube-short
duration: "~45 seconds"
feeds_video: "Normalizing Flows: Exact Likelihoods from Neural Networks"
difficulty: advanced
tags: [physics, simulation, short, advanced, normalizing-flow, density-estimation, generative-model, machine-learning, bijection]
---

> **What it is:** A ~45-second simulation showing a normalizing flow transforming a standard Gaussian through a chain of invertible affine coupling layers to map it to a complex multi-modal data distribution with exact log-likelihood evaluation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Normalizing Flows: Exact Likelihoods from Neural Networks

# Short: Normalizing Flow — Exact Density Estimation

**Feeds full video:** Normalizing Flows: Exact Likelihoods from Neural Networks

## Visual Hook (First 3 Seconds)
A complex 2D density (two interleaved half-moon crescent shapes, orange and cyan) on the left. On the right: a perfect Gaussian circle (white). A flow of blue arrows (the bijection) warps the crescent into the circle. White text: **"log p(x) = exact."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Problem setup: samples from complex distribution p_X (orange crescents, 2D). Target: Gaussian base distribution p_Z (white circle). Goal: learn invertible map f: X → Z such that z = f(x) follows N(0,I). Shown as side-by-side scatter plots.
- **0:10** — Change of variables formula: p_X(x) = p_Z(f(x)) · |det J_f(x)|. Jacobian determinant |det J| (absolute deformation factor) shown as a color heatmap overlay on the x-space: red = compressed (high det), blue = expanded (low det). Values range: **"det J: 0.3 – 4.8."**
- **0:18** — RealNVP coupling layer: input split into (x₁, x₂). x₂' = x₂ · exp(s(x₁)) + t(x₁). s and t = small neural nets. Shown schematically: x₁ feeds two tiny networks (s in orange, t in cyan) that scale and shift x₂. Jacobian: triangular → **"det J = Π exp(s_i)"** (exact, cheap).
- **0:27** — Layer composition: 8 coupling layers stacked, alternating which half is transformed. Flow animation: orange crescent samples (1000 dots) warped through each layer. At layer 2: partially curved. At layer 5: nearly circular. At layer 8: **"Gaussian distribution: KS test p-value = 0.42"** (passes normality test).
- **0:36** — Exact log-likelihood: for a new data point (star marker at x = (1.5, 0.5)), exact log p(x) computed: **"log p(x) = −2.34"**. Comparison to KDE estimate: **"KDE: −2.31 ± 0.18"** — flow gives exact value without uncertainty.
- **0:44** — Sampling: z ~ N(0,I) (white dots sampled from Gaussian). Inverse flow f⁻¹(z) applied: dots transformed back to crescent distribution (orange/cyan). **"1000 new samples in 2 ms."** Compare: MCMC for same density takes 500 ms.

## Physics Concept Teased
Normalizing flows learn an invertible neural network f that maps a complex data distribution to a simple Gaussian base; because the Jacobian of each coupling layer is triangular, its determinant is computed exactly in O(d) time — enabling exact log-likelihood evaluation and efficient sampling in a single forward pass.

## On-Screen Text / Captions
- **0:00** — "Learn any probability distribution — with exact likelihoods"
- **0:10** — "Change of variables: warp the space, track the Jacobian"
- **0:20** — "Coupling layers: triangular Jacobian = exact det"
- **0:30** — "8 layers: crescents become a perfect Gaussian"
- **0:38** — "Exact log p(x) = −2.34, no sampling error"
- **0:45** — "Normalizing flow full math → bio"

## End Card
Final 3 seconds: crescent-to-Gaussian flow animation frozen at midpoint, arrows visible. **"CodedLaws — Probabilistic ML"** text.

## Audio
Smooth, morphing synth pad at 65 BPM. Liquid pour SFX at each coupling layer transformation. No voiceover.

## Production Notes
Renderer: RealNVP flow (Python/PyTorch). Architecture: 8 coupling layers, alternating mask. s and t networks: 2-hidden-layer MLP, 64 units, ReLU. Training: 50,000 steps, Adam, lr=3×10⁻⁴. Dataset: 2D two-moons (scikit-learn), 10,000 samples. Jacobian determinant: log det = Σ s_i(x₁). Visualization: 1000 sample trajectory through 8 layers. Output 1080×1920, 60 fps.
