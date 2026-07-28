---
title: "Neural Field Theory: EEG Wave Propagation"
id: SA119
type: youtube-short
duration: "~45 seconds"
feeds_video: "Neural Field Theory: The Mathematics of Brain Waves"
difficulty: advanced
tags: [physics, simulation, short, advanced, neural-field-theory, eeg, brain-waves, cortex, continuum-model]
---

> **What it is:** A ~45-second simulation showing a Wilson-Cowan neural field equation propagating alpha-rhythm brain waves across a cortical sheet with resonance arising from the thalamo-cortical feedback delay. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Neural Field Theory: The Mathematics of Brain Waves

# Short: Neural Field Theory — EEG Wave Propagation

**Feeds full video:** Neural Field Theory: The Mathematics of Brain Waves

## Visual Hook (First 3 Seconds)
A 2D disc (cortex, top-down view, dark grey). A ripple of cyan activity expands from the occipital pole (lower) like a wave on a pond, reaches 15 cm diameter. Simultaneously, an EEG trace builds in the corner: clean 10 Hz alpha wave. Text: **"Alpha rhythm: a cortical standing wave."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Cortex plane: 20 cm diameter disc (grey). Activity field u(x,t): color scale dark blue (−2 mV) → bright cyan (+2 mV). Initial perturbation: Gaussian pulse at occipital pole (x=0, amplitude = 0.5 mV, σ = 1 cm).
- **0:10** — Neural field equation displayed: τ ∂u/∂t = −u + w ∗ S(u) + I(x,t). Where w = Mexican hat kernel (cyan positive center, orange negative surround, peak +0.8, width 3 cm). S = sigmoid firing rate function. Wave equation character: propagation at 10 m/s.
- **0:18** — Alpha rhythm generation: thalamocortical loop (thalamus shown as orange dot below cortex, connected by bidirectional arrows). Corticothalamic delay τ = 50 ms creates 10 Hz oscillation. Activity field oscillates: **"f = 9.8 Hz"** visible in spectrum panel.
- **0:27** — Wave propagation: alpha wave crest (cyan band, 2 cm wide) sweeps from occipital to frontal (back to front) in 20 ms. Propagation velocity: **"v = 8.5 m/s"**. Standing wave pattern forms as forward and reflected waves superimpose — nodal lines visible as dark stripes.
- **0:36** — Dispersion relation: ω-k plot shown (angular frequency vs. wavenumber). Two branches: slow (ω ≈ 2 rad/s at k=1 cm⁻¹) and fast (ω ≈ 65 rad/s). Alpha wave lives at **"k = 0.8 cm⁻¹, ω = 63 rad/s"** (marked with white dot on dispersion curve).
- **0:44** — EEG electrode array (10-20 system, 19 electrodes shown as white circles on head). Alpha power map: occipital electrodes (O1, O2, Oz) show **"+12 µV²/Hz"** in alpha band (eyes closed). Frontal (Fz, Cz): 2 µV²/Hz. Topographic map colored blue-to-red.

## Physics Concept Teased
Neural field theory treats the cortex as a continuous active medium: the integrodifferential field equation produces traveling wave solutions with a dispersion relation determined by the connectivity kernel width and axonal propagation speed, explaining why alpha rhythm propagates at 8–10 m/s from occipital to frontal cortex.

## On-Screen Text / Captions
- **0:00** — "Your 10 Hz alpha rhythm is a wave crossing your cortex"
- **0:10** — "Neural field equation: activity spreads like a wave"
- **0:20** — "Thalamocortical loop + 50ms delay = 10 Hz oscillation"
- **0:30** — "Propagation: 8.5 m/s, occipital to frontal"
- **0:38** — "EEG sees the topographic power map of the wave"
- **0:45** — "Neural field theory full derivation → bio"

## End Card
Final 3 seconds: cortex disc with alpha wave ripple + EEG trace overlay. **"CodedLaws — Computational Neuroscience"** text.

## Audio
Clean 10 Hz sine tone (alpha) faintly audible under ambient pad. 60 BPM background. Wave surface sound at each crest.

## Production Notes
Renderer: 2D neural field PDE (Python/NumPy). Connectivity kernel: Mexican hat w(r) = A₁·exp(−r²/σ₁²) − A₂·exp(−r²/σ₂²). Thalamocortical delay: implemented via ring buffer. Firing rate: S(u) = 1/(1+exp(−β(u−θ))). Cortex disc: 200×200 grid, dx = 1 mm, dt = 0.5 ms. EEG: forward model via boundary element method. Output 1080×1920, 60 fps.
