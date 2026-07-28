---
title: "Barkhausen Noise — Domain Switching Avalanche"
id: SM128
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Magnetism_Materials_Full]]"
difficulty: medium
tags: [physics, simulation, short, magnetism, condensed-matter, noise, criticality]
---

> **What it is:** A ~45-second simulation short where domain walls in a disordered iron lattice snap past pinning defects in sudden cascading avalanches as an applied field slowly ramps, generating crackling Barkhausen noise whose power-law size distribution reveals self-organized criticality. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Magnetism_Materials_Full]]

# Short: Barkhausen Noise — Domain Switching Avalanche
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A coil of wire sits around an iron rod. As a slowly increasing magnetic field sweeps through the iron, a speaker connected to the coil crackles and pops — a sound like frying bacon or distant static. Each pop is the sudden flip of a magnetic domain. The noise is random, jerky, unstoppable. This is Barkhausen noise.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** 2D grid of magnetic domains (irregular, natural-looking domain pattern — not the neat grid of SM127 but a realistic pinned domain texture). Applied field H slowly increasing leftward. Domain wall positions pinned at defects (shown as small dark dots in the lattice — grain boundaries, dislocations). Each pinning site has a critical field above which the wall "jumps."
- **0:10–0:18:** As H increases, domain walls try to move but are pinned. Tension builds (shown as wall curvature bowing under magnetic pressure). At one pinning site, the local threshold is exceeded — the wall suddenly jumps to the next pinning site, releasing stored magnetostatic energy. This jump is the elementary Barkhausen event. A single bright flash at that site, a brief voltage spike in the induction coil.
- **0:18–0:28:** Avalanche: the first jump releases stress, which pushes a neighboring wall over its threshold, which pushes another — a cascade of domain switches spreading across the lattice. Size of each avalanche shown by the number of domains that flip (color: blue flipping to red). Avalanche size distribution plotted in real time: a power-law histogram P(S) ∝ S^{-τ} with τ≈1.5 — the signature of self-organized criticality (SOC).
- **0:28–0:38:** Audio waveform display: the induced EMF signal (dM/dt) shown as a noisy voltage trace. Individual Barkhausen jumps appear as sharp spikes of varying amplitude — the larger the domain avalanche, the larger the spike. Power spectrum of the noise shown: 1/f^α character. This is the physical origin of pink noise.
- **0:38–0:45:** Applications: Barkhausen noise is used for non-destructive testing (NDT) — the noise level and statistics reveal grain size, residual stress, and material fatigue in steel structures. A bridge cross-section schematic shows a Barkhausen sensor probe scanning the steel. Text: "Used to inspect bridges, pipelines, rail lines."

## Physics Concept Teased
Barkhausen noise is the series of sudden, discrete jumps in magnetization as a ferromagnet is slowly magnetized. Each jump corresponds to a domain wall depinning from a crystal defect and jumping (avalanche) to the next pinning site. The avalanche size statistics follow a power law P(S) ∝ S^{-τ}, a signature of self-organized criticality — the system naturally tunes itself to a critical state without external tuning. The noise is intrinsically non-stationary and non-Gaussian.

## On-Screen Text / Captions
- **0:00:** "This noise is the sound of magnetism — one domain at a time."
- **0:08:** "Domain walls pinned at defects"
- **0:15:** "Threshold exceeded → sudden jump → Barkhausen event"
- **0:22:** "Avalanche: P(S) ∝ S^{−1.5} — power law"
- **0:30:** "Self-organized criticality at work"
- **0:38:** "Barkhausen noise inspects bridges for hidden cracks."
- **0:44:** "Heinrich Barkhausen discovered this in 1919."

## End Card
Final 3 seconds: the power-law histogram — a straight line on a log-log scale — glowing orange on black. Text: "Random events. Perfect statistics. Nature at a critical point." Channel logo.

## Audio
The actual Barkhausen noise sound: crackling, popping, frying — played as the magnetic field sweeps (0:08–0:30). This should be a real synthesized audio sample of Barkhausen noise (or actual recording). Voiceover (contemplative): "Every pop you hear is a thousand atoms flipping direction in unison — spontaneously, irreversibly, together." Soft music fades in under the noise at 0:35.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: Random field Ising model (RFIM) — each spin s_i = ±1, local field h_i = h_ext + J·Σ_neighbors s_j + η_i where η_i ~ N(0, σ_disorder). Sweep h_ext upward slowly. A spin flips when h_i changes sign (threshold crossing). Check for cascade: after each flip, recheck neighbors and flip any that now have h_i changed sign (avalanche propagation). Record avalanche size S (number of spins that flip per cascade) and time. Histogram of S: bin and plot on log-log axes to see power law. Induction signal: V ∝ dM/dt = (1/N)·d(Σs_i)/dt. Synthesize audio from V signal using Web Audio API (sample rate 44.1 kHz, each simulation step = 1 audio sample). Gotcha: RFIM is a mean-field approximation; for 2D, exact critical exponents differ. Use σ_disorder ≈ J for SOC-like behavior.
