---
title: "Reservoir Computing: Echo State Network"
id: SA120
type: youtube-short
duration: "~45 seconds"
feeds_video: "Reservoir Computing: Computation at the Edge of Chaos"
difficulty: advanced
tags: [physics, simulation, short, advanced, reservoir-computing, echo-state-network, recurrent-neural-network, computation, chaos]
---

> **What it is:** A ~45-second simulation showing a fixed random recurrent reservoir driven by a time-series input with only the linear readout weights trained to reproduce a nonlinear chaotic target signal via echo-state computing. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Reservoir Computing: Computation at the Edge of Chaos

# Short: Reservoir Computing — Echo State Network

**Feeds full video:** Reservoir Computing: Computation at the Edge of Chaos

## Visual Hook (First 3 Seconds)
A dense recurrent neural network (100 nodes, cyan circles, thousands of random white connection lines). An input signal (chaotic Lorenz wave, orange) enters at left. After just 1 second of training a linear output layer — the network reproduces the Lorenz signal from memory. Text: **"Trained in 1 second. No backprop."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Echo state network architecture: Input layer (1 orange node) → Reservoir (100 cyan nodes, randomly connected, sparse W_res with spectral radius ρ = 0.9) → Output layer (1 blue node, W_out trained by linear regression). Input and reservoir connections shown in different colors.
- **0:10** — Reservoir dynamics: input signal u(t) = sin(t) drives reservoir. Each of 100 nodes responds differently (time series overlay: 8 representative node traces, each a different color). High-dimensional state vector x(t) shown as a 100-element color bar sweeping through time.
- **0:18** — Spectral radius effect: ρ < 1 (stable, left panel) — reservoir activity fades after input stops (echo dies in 50 ms). ρ > 1 (unstable, right panel) — reservoir diverges exponentially. ρ = 0.9 (center panel, cyan) — echoes persist just long enough. Label: **"Edge of stability = optimal computation."**
- **0:27** — Training: 1000 time-step washout, then 5000 steps of recording x(t). Output weights W_out = (Y·X^T)·(X·X^T + λI)^(−1) — ridge regression. One-shot solution, no gradient descent. Label: **"Training = one matrix inversion."** Computation time: **"< 0.01 seconds."**
- **0:36** — Chaotic prediction task: Lorenz attractor (orange butterfly, x-component time series). Reservoir prediction (cyan) overlaid. For the first 100 ms: **"MSE = 0.003"** (nearly perfect). After 500 ms: prediction diverges (Lyapunov divergence). Label: **"Valid prediction horizon: 3 Lyapunov times."**
- **0:44** — Capacity vs. reservoir size: bar chart showing memory capacity (squares) and nonlinear computation capacity (triangles) vs. N (50, 100, 200, 500 nodes). Both scale as O(N). At N=100: memory capacity = **"87 timesteps"** lag stored.

## Physics Concept Teased
An echo state network exploits the rich dynamics of a fixed random recurrent network: the high-dimensional reservoir state x(t) contains an echo of recent inputs, and because this echo space is already nonlinearly mixed, training only the linear readout W_out is sufficient to approximate arbitrary dynamical systems.

## On-Screen Text / Captions
- **0:00** — "100 random neurons. No training. Just listen."
- **0:10** — "Input drives 100 nodes: all respond differently"
- **0:20** — "Spectral radius 0.9: echoes at the edge of dying"
- **0:30** — "Output trained in one matrix inversion — 0.01 seconds"
- **0:38** — "Predicts Lorenz chaos for 3 Lyapunov times"
- **0:45** — "Echo state networks full tutorial → bio"

## End Card
Final 3 seconds: Lorenz attractor in orange with cyan prediction overlay diverging at 500 ms. **"CodedLaws — Reservoir Computing"** text.

## Audio
Chaotic electronic texture morphing smoothly (reflects reservoir dynamics). 70 BPM. Clean chime when prediction locks on.

## Production Notes
Renderer: Echo State Network (Python/NumPy). Reservoir: N=100, sparse W_res (density 10%), spectral radius ρ=0.9 (scaled). Input weights W_in: uniform random [-1,1]. State equation: x(t+1) = tanh(W_res·x(t) + W_in·u(t)). Readout: ridge regression λ=10⁻⁶. Lorenz: dt=0.01, σ=10, ρ=28, β=8/3. MSE and capacity computed over 100 test trajectories. Output 1080×1920, 60 fps.
