---
title: "Diffusion Model: Score Function Denoising"
id: SA123
type: youtube-short
duration: "~45 seconds"
feeds_video: "Diffusion Models Explained: Score Matching and Denoising"
difficulty: advanced
tags: [physics, simulation, short, advanced, diffusion-model, score-matching, denoising, generative-ai, machine-learning]
---

> **What it is:** A ~45-second simulation showing an image progressively corrupted to Gaussian noise via the forward diffusion SDE then denoised step-by-step by a learned score function to generate a new sample from the training distribution. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Diffusion Models Explained: Score Matching and Denoising

# Short: Diffusion Model — Score Function Denoising

**Feeds full video:** Diffusion Models Explained: Score Matching and Denoising

## Visual Hook (First 3 Seconds)
A beautiful face image (left panel) dissolves into pure white noise (right panel) over 3 seconds in 1000 steps. Then the process reverses — from white noise, a new face crystallizes out. White text: **"T=1000 steps: physics of creation."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Forward process: Markov chain q(x_t | x_{t-1}) = N(√(1−β_t)·x_{t-1}, β_t·I). Starting image (vivid, 256×256 px) displayed left. Noise schedule β_t: small (0.0001) at t=1 → large (0.02) at t=1000. Image shown at t=0, 200, 500, 800, 1000: progressively grainier.
- **0:10** — Signal-to-noise ratio (SNR) plot: x-axis = t (0 to 1000), y-axis = SNR = ᾱ_t/(1−ᾱ_t) where ᾱ_t = Π(1−β). At t=0: **"SNR = ∞"** (pure image). At t=1000: **"SNR = 0.001"** (pure noise). Exponential decay curve in cyan on black.
- **0:18** — Score function: ∇_x log p(x) shown as vector field on 2D toy example (2D Gaussian mixture, 3 clusters, orange, cyan, green). Score vectors (white arrows) point from low to high density. Neural network ε_θ(x_t, t) learns to predict added noise = predict score direction.
- **0:27** — Reverse process: starting from x_1000 (white noise blob, 256×256). At each step t = 1000 → 0: x_{t-1} = (x_t − β_t/√(1−ᾱ_t)·ε_θ(x_t,t)) / √(1−β_t) + σ_t·z. Image shown at t=800, 500, 200, 50, 0. Coherent structure emerges at t=500.
- **0:36** — Classifier-free guidance: unconditional score (dim image, generic) vs. guided score (ω = 7.5, sharp, detailed). Guidance formula: ε̃ = (1+ω)ε_cond − ω·ε_uncond. Two images side-by-side: ω=0 (blurry), ω=7.5 (sharp and specific). Label: **"Guidance weight = 7.5: 2× FID improvement."**
- **0:44** — DDPM vs. DDIM sampling: DDPM requires 1000 steps (slow, 30 seconds). DDIM skips to 50 steps (deterministic, fast, 1.5 seconds). Both produce same image quality. Label: **"DDIM: 20× speed-up, same quality."** Side-by-side outputs shown.

## Physics Concept Teased
Diffusion models are stochastic differential equations: the forward process gradually adds Gaussian noise according to a variance schedule until the image becomes pure noise, and the reverse process learns the score function — the gradient of the log probability density — to denoise step by step, regenerating sharp images from noise.

## On-Screen Text / Captions
- **0:00** — "Pure noise → a face in 1000 denoising steps"
- **0:10** — "Forward: add noise at each step by exact math"
- **0:20** — "Score function: which direction is 'more image'?"
- **0:30** — "Reverse: follow the score from noise to data"
- **0:38** — "Guidance ω=7.5: steer toward the text description"
- **0:45** — "Full diffusion model math → video link"

## End Card
Final 3 seconds: noise→face denoising sequence compressed to 1 second. **"CodedLaws — Generative AI Physics"** text.

## Audio
Static (noise) gradually resolving to clear melody as denoising progresses. 80 BPM. Bell tone at T=0 completion.

## Production Notes
Renderer: DDPM/DDIM from scratch (Python/PyTorch). U-Net ε_θ: 4-scale, attention at 16×16 and 8×8. Noise schedule: linear β from 10⁻⁴ to 0.02. Training: 200k steps on CelebA-64. FID evaluation: 50k samples. DDIM: η=0 (deterministic). Guidance: CFG with ω=7.5. Output 1080×1920, 60 fps.
