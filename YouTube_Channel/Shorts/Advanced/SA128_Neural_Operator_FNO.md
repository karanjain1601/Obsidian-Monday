---
title: "Neural Operator: FNO Fourier Layer"
id: SA128
type: youtube-short
duration: "~45 seconds"
feeds_video: "Fourier Neural Operator: Learning PDE Solutions at Any Resolution"
difficulty: advanced
tags: [physics, simulation, short, advanced, fno, neural-operator, fourier, scientific-ml, pde]
---

> **What it is:** A ~45-second simulation showing a Fourier Neural Operator learning to map initial conditions to PDE solution fields via global convolutions in Fourier space and generalizing to resolutions unseen during training. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Fourier Neural Operator: Learning PDE Solutions at Any Resolution

# Short: Neural Operator — FNO Fourier Layer

**Feeds full video:** Fourier Neural Operator: Learning PDE Solutions at Any Resolution

## Visual Hook (First 3 Seconds)
A turbulent 2D Navier-Stokes velocity field (orange vorticity, complex swirling pattern) on the left. The same initial condition fed into an FNO network (blue icon). In **"0.012 seconds"** the output vorticity field (cyan) appears on the right — matching perfectly 20 time steps later. Text: **"2000× faster than CFD."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — FNO architecture: input u(x,t₀) on 64×64 grid (orange field). FNO layer: (1) FFT → frequency modes R^(12×12) in complex space (shown as amplitude heat map, teal) → (2) Fourier weights R multiplied (12×12 complex matrix, cyan) → (3) IFFT back to physical space → (4) added to local linear transform W·u. 4 FNO layers stacked.
- **0:10** — Fourier truncation: full FFT has 64×64 = 4096 modes. FNO keeps only top 12×12 = 144 modes (cyan rectangle in frequency space, surrounded by grey zero-padded modes). Label: **"144/4096 = 3.5% of modes — captures all important physics."**
- **0:18** — Why Fourier? Global convolution in physical space = pointwise multiplication in frequency space. FNO kernel shown: w(x−y) is a learnable function. In frequency space: W_k learned as 144 independent 20×20 complex matrices. Convolution theorem: **"O(N log N) instead of O(N²)."**
- **0:27** — Resolution invariance: FNO trained on 64×64 fields. At test time: fed 128×128 input (same physics, finer grid). Zero-pad frequency representation to 128×128 (grey padding visible) → IFFT → 128×128 output. Error: **"5.8% at 64×64; 6.1% at 128×128"** — barely degraded.
- **0:36** — Navier-Stokes benchmark: FNO trained on 1000 trajectories (viscosity ν = 0.001). Test: predict 10 future time steps. FNO error: **"MSE = 0.0018"**. CFD (ground truth): 45 seconds/trajectory. FNO: **"0.012 s/trajectory"** — speedup factor labeled: **"3750×."**
- **0:44** — PDE family: same FNO architecture, zero-shot adaptation. Trained on Navier-Stokes (ν = 0.001) → tested on ν = 0.01 (10× more viscous). Error: **"0.0043"** vs. 0.0018 (2.4× degradation). Suggests operator is learning the PDE solution operator, not just pattern matching.

## Physics Concept Teased
The Fourier Neural Operator learns a mapping between function spaces (initial conditions → solutions) rather than between vectors: its Fourier layers perform global convolution via low-rank frequency-domain multiplication, enabling resolution-independent operation and orders-of-magnitude speedup over traditional numerical PDE solvers.

## On-Screen Text / Captions
- **0:00** — "Predicting Navier-Stokes: 2000x faster than simulation"
- **0:10** — "FNO: FFT → learn in frequency space → IFFT"
- **0:20** — "Only 3.5% of Fourier modes needed — global physics"
- **0:30** — "Trained at 64×64, tested at 128×128 — same accuracy"
- **0:38** — "3750× speedup: milliseconds, not hours"
- **0:45** — "FNO full derivation → bio link"

## End Card
Final 3 seconds: frequency-space weight matrix (teal heatmap) with IFFT arrow back to vorticity field. **"CodedLaws — Neural Operators"** text.

## Audio
Electronic FFT whine resolved into clean melody. 85 BPM. Chime at each Fourier layer. No voiceover.

## Production Notes
Renderer: FNO (Python/PyTorch, neuraloperator library). Architecture: 4 FNO layers, modes = 12, width = 20. Activation: GELU. NS dataset: 1000 train, 200 test, ν=10⁻³, dt=0.01. Training: Adam + OneCycleLR, 500 epochs, batch 20. Resolution tests: 64, 128, 256 grids. Output 1080×1920, 60 fps.
