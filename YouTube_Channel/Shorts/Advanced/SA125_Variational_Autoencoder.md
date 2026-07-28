---
title: "Variational Autoencoder: Latent Space Traversal"
id: SA125
type: youtube-short
duration: "~45 seconds"
feeds_video: "VAEs Explained: Learning the Geometry of Data"
difficulty: advanced
tags: [physics, simulation, short, advanced, vae, variational-autoencoder, latent-space, generative-model, machine-learning]
---

> **What it is:** A ~45-second simulation showing a VAE encoding images into a structured Gaussian latent space and decoding smooth interpolations between encoded points to generate new samples via the reparameterization trick. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** VAEs Explained: Learning the Geometry of Data

# Short: Variational Autoencoder — Latent Space Traversal

**Feeds full video:** VAEs Explained: Learning the Geometry of Data

## Visual Hook (First 3 Seconds)
A 2D latent space: a fuzzy colored scatter plot (each digit 0–9 in a different color, softly clustered). A white crosshair cursor moves smoothly across the latent space. As it passes between clusters, the reconstructed digit in the corner morphs smoothly: **"3 → 8 → 5"** in 3 seconds. Text: **"The geometry of numbers."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — VAE architecture: encoder E (deep orange network on left) takes 28×28 MNIST digit → outputs μ and σ² (two vectors of dimension 2). Decoder D (deep blue network, right) takes z ~ N(μ,σ²) → outputs reconstructed 28×28 image. Reparameterization: z = μ + σ·ε, ε ~ N(0,1) shown as dashed path.
- **0:10** — ELBO loss: L = −E_q[log p(x|z)] + KL(q(z|x) || p(z)). Two terms shown as two glowing bars: reconstruction loss (orange, pixels match) + KL divergence (cyan, latent stays near Gaussian). Total ELBO value: **"−82.4"** shown, decreasing during training.
- **0:18** — Latent space visualization (2D): 10,000 test points plotted, each colored by digit class (0=red, 1=orange, ..., 9=violet). Distinct clusters visible, but overlapping at boundaries — **"cluster separation = 2.3 σ"**. Gaussian N(0,I) contour (white circle) overlaid: most points within radius 3.
- **0:27** — Linear interpolation: two endpoint digits selected: "2" (red, z₁ = (−2.1, 1.3)) and "7" (yellow, z₂ = (1.8, −0.9)). Eight evenly spaced latent points z_t = (1−t)z₁ + t·z₂ decoded. Images shown: 2 → (morphing shape) → 7, with each intermediate a realistic in-between digit.
- **0:36** — Random sampling from prior: z ~ N(0,1), 16 samples drawn (white dots in latent space). Each decoded to a digit image (4×4 grid). All images look like plausible handwritten digits. Label: **"VAE: generative model — samples from any z."**
- **0:44** — Conditional traversal: hold one latent dimension fixed, sweep the other from −3 to +3. Decoded images shown as a 7-image horizontal strip. One direction: digit gets thicker/thinner. Other direction: roundness changes. Label: **"Each dimension encodes a feature."**

## Physics Concept Teased
The VAE ELBO objective forces the encoder to map data to a continuous, structured latent space by penalizing KL divergence from a Gaussian prior — this regularization creates smooth interpolable geometry where neighboring latent points decode to visually similar outputs, enabling controlled data generation through latent space arithmetic.

## On-Screen Text / Captions
- **0:00** — "Every digit lives somewhere in a 2D Gaussian cloud"
- **0:10** — "Encode: image → (mean, variance). Decode: z → image."
- **0:20** — "KL penalty keeps the space smooth and Gaussian"
- **0:30** — "Interpolate 2 to 7 — every in-between looks real"
- **0:38** — "Sample from N(0,1): always a valid digit"
- **0:45** — "VAE full derivation → link in bio"

## End Card
Final 3 seconds: 2D latent space scatter plot with cursor interpolation path highlighted. **"CodedLaws — Generative Models"** text.

## Audio
Smooth, morphing ambient pad at 60 BPM. Soft chime as cursor moves through latent space. No voiceover.

## Production Notes
Renderer: VAE (Python/PyTorch). Encoder: 2 conv layers + FC → (μ, log σ²), z_dim=2. Decoder: FC + 2 transposed-conv. ELBO: BCE reconstruction + KL = −½·Σ(1 + log σ² − μ² − σ²). Training: Adam, lr=3×10⁻⁴, 50 epochs, batch 128. MNIST: 60,000 training, 10,000 test. Interpolation: 8 evenly spaced steps. Output 1080×1920, 60 fps.
