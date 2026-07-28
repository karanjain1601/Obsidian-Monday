---
title: "Chemotaxis — Bacteria Chasing a Nutrient Gradient"
id: SM156
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, biophysics, chemotaxis, bacteria, keller-segel, nutrient-gradient, self-organisation]
---

> **What it is:** A ~45-second simulation short where individual run-and-tumble bacteria stream toward a central nutrient source as its concentration gradient develops, collectively collapsing into a dense aggregate via Keller-Segel dynamics, demonstrating chemotaxis and the instability that drives bacterial density blowup and Dictyostelium aggregation. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Chemotaxis — Bacteria Chasing a Nutrient Gradient

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Individual bacteria — each a tiny swimmer — in a uniform medium. A nutrient source (glucose) is released at the centre. The gradient of nutrient concentration radiates outward. Within seconds, the bacteria begin streaming toward the source — the whole population aggregates at the centre. Chemotaxis: life following chemistry.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Bacterial run-and-tumble: E. coli alternates between "runs" (straight-line swimming, CCW flagella rotation) and "tumbles" (reorientation, CW rotation, ~0.1 s). In a uniform environment: random walk. In a gradient: longer runs up the gradient, shorter runs down → biased drift. Caption: "Run-and-tumble: longer runs up gradient → biased drift." Mean drift velocity: v_drift ≈ v_run · χ(c) · ∇c.

**0:10–0:18** — Keller-Segel model: ∂ρ/∂t = D∇²ρ - ∇·(ρ·χ(c)·∇c); ∂c/∂t = D_c∇²c - k·ρ·c. ρ = cell density, c = chemoattractant, χ = chemotactic sensitivity, k = consumption rate. Caption: "Keller-Segel (1971): cells follow chemoattractant, consume it." Show ρ(x,t) and c(x,t) evolving together.

**0:18–0:27** — Aggregation instability: in the Keller-Segel model, for χ above a threshold, the homogeneous state is unstable — cells aggregate into dense spots. This is a "chemotactic collapse" (finite-time blowup in 2D above a critical cell number). Caption: "Chemotactic collapse: cells aggregate into dense spots (blowup in 2D)." 8πD/χ is the critical mass threshold in 2D.

**0:27–0:36** — Slime mold (Dictyostelium): under starvation, D. discoideum cells secrete cAMP (chemoattractant), which attracts other cells → aggregation streams form (visible as spiral waves of cAMP) → mound → fruiting body. Caption: "Dictyostelium: spiral cAMP waves drive aggregation streams." Show the beautiful aggregation pattern.

**0:36–0:45** — Cancer metastasis: cancer cells follow chemical gradients (EGF, VEGF) to escape the primary tumour. Blocking these gradients (anti-chemotaxis drugs) is a cancer therapy strategy. Caption: "Cancer metastasis: tumour cells follow EGF gradient — chemotaxis." Bold text: "Chemotaxis — life navigating chemistry's map." Fade to black.

## Physics Concept Teased
Chemotaxis: directed cell migration along chemical gradients. E. coli uses run-and-tumble motility, modulating tumble frequency by a methylation-based memory of recent receptor occupancy. The Keller-Segel continuum model shows that above a critical chemotactic sensitivity χ, cells aggregate spontaneously. The model has finite-time blowup solutions in 2D that model the aggregation of Dictyostelium.

## On-Screen Text / Captions
- **0:00** — "Bacteria follow a sugar gradient — chemotaxis."
- **0:05** — "Run-and-tumble: bias runs up gradient → drift"
- **0:12** — "Keller-Segel: ∂ρ/∂t = D∇²ρ - ∇·(ρχ∇c)"
- **0:20** — "Chemotactic collapse: cells aggregate → 2D blowup"
- **0:28** — "Dictyostelium: cAMP spiral waves drive streams"
- **0:35** — "Cancer: cells follow EGF gradient — block chemotaxis"
- **0:43** — "Chemotaxis — bacteria navigate by chemistry."

## End Card
Final 3 seconds: E. coli aggregating around a central nutrient source — dense dark cluster emerging from a uniform background. Text: "E. coli can detect a concentration difference of just 0.1 nM across its 2 μm body — a 1 part in 10 million detection." CodedLaws logo.

## Audio
Biological ambient (water, microorganism sounds). Voiceover at 0:00: "A bacterium can detect a tiny chemical gradient and swim towards it — no brain, no eyes, just chemistry. And collectively, they create stunning aggregation patterns." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D (particle simulation + field overlay). Key algorithm: two-level simulation. (1) Continuum Keller-Segel PDE: finite-difference or spectral. (2) Individual bacteria (N=500): run-and-tumble. Run: x += v·dir·dt; tumble: randomly pick new dir. Tumble rate: λ(t) = λ₀·exp(-β·(∂c/∂t + d·∇c·v)) (Berg-Brown adaptation model). Interpolate c from grid to particle positions. Colour: bacteria as green dots; c-field as background heat-map. For Dictyostelium: use FitzHugh-Nagumo for cAMP (oscillatory) — spiral waves emerge naturally. Runtime: Canvas 2D, real-time for N=500 particles on 100×100 grid.
