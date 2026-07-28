---
title: "Wavelet Transform — Signal at Multiple Scales"
id: SM053
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, signal-processing, wavelet, multi-scale, time-frequency]
---

> **What it is:** A ~45-second simulation short where a seismic trace is peeled apart level by level into a multi-resolution pyramid of detail and approximation bands, revealing how wavelets capture both what frequencies are present and exactly when — unlike the Fourier transform — with applications from JPEG 2000 compression to ECG denoising. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Wavelet Transform — Signal at Multiple Scales

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A complex signal waveform — a seismic trace — fills the screen. Then it splits: the signal is decomposed level by level. By 3 seconds the screen shows a pyramid of decomposed signals, each row half the length and capturing a different frequency band, like a musical score decomposed by octave.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Fourier vs. wavelet: the Fourier spectrum of the seismic trace shown — it tells WHAT frequencies are present but not WHEN. The wavelet scalogram (time on x-axis, scale/frequency on y-axis, amplitude as colour) shows BOTH what and when. Annotation: "Wavelet: time AND frequency simultaneously."

**0:10–0:18** — The DWT (Discrete Wavelet Transform): low-pass filter → downsample by 2 → approximation coefficients. High-pass filter → downsample by 2 → detail coefficients. Then recurse on the approximation. Shown as a filter bank diagram with the signal at each level. Caption: "DWT: low-pass + high-pass filter banks."

**0:18–0:27** — The Haar wavelet shown (simplest wavelet): a step function that is +1 for t ∈ [0,0.5) and -1 for t ∈ [0.5,1). Its scaling function is the box function. Applied to a signal: detects edges (sharp transitions). The Daubechies D4 wavelet shown for comparison — smoother, better frequency localisation. Caption: "Haar (sharp) vs. Daubechies D4 (smooth)."

**0:27–0:36** — Image compression: a 512×512 photograph wavelet-decomposed. The 2D DWT shows: (1) approximation (blurry image, top-left), (2) horizontal details, (3) vertical details, (4) diagonal details. Setting 90% of small coefficients to zero: image reconstructed with 10% of data — still recognisable. Caption: "JPEG 2000 uses wavelets — 10:1 compression."

**0:36–0:45** — Signal denoising: noisy ECG signal on the left → wavelet-denoised clean ECG on the right. Noise removed by thresholding small wavelet coefficients. Caption: "Wavelet denoising — ECG analysis." Bold text: "Wavelets: time-frequency localisation." Fade to black.

## Physics Concept Teased
Wavelet transform: unlike the Fourier transform, wavelets are localised in both time and frequency. The Discrete Wavelet Transform uses a cascade of filter banks (low-pass for approximation, high-pass for detail) to decompose a signal into multi-resolution components. Applications: image compression (JPEG 2000), ECG denoising, seismology, turbulence analysis.

## On-Screen Text / Captions
- **0:00** — "A seismic signal — what's inside it?"
- **0:05** — "Fourier: WHAT frequencies. Wavelet: WHAT + WHEN."
- **0:12** — "DWT: low-pass + high-pass → recurse"
- **0:20** — "Haar: edge detector. Daubechies: smooth."
- **0:28** — "JPEG 2000: 10:1 compression via wavelets"
- **0:35** — "ECG denoising: threshold small coefficients"
- **0:43** — "Wavelets — time-frequency localisation."

## End Card
Final 3 seconds: 2D wavelet decomposition of a photo — quadrant pyramid. Text: "FBI uses wavelet compression for fingerprint databases." CodedLaws logo.

## Audio
Layered ambient (multiple musical octaves layered — mirroring multi-scale decomposition). Voiceover at 0:00: "The Fourier transform knows what frequencies are present — the wavelet transform also knows when." No other voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: 1D DWT with Haar or Daubechies D4 filter. Lifting scheme implementation: predict step (high-pass) + update step (low-pass) + scale. Recurse on approximation coefficients for 4 levels. Visualise each level as a horizontal strip. 2D DWT: apply 1D DWT along rows then columns. Scalogram (CWT): for each scale a and translation b, compute ⟨f, ψ_{a,b}⟩. Use Morlet wavelet ψ(t) = π^(-1/4)exp(iω₀t)exp(-t²/2). Display as colour-map. Runtime: real-time for DWT, pre-computed for CWT scalogram.
