---
title: "Low-Pass Filter — Smoothing a Noisy Signal"
id: SM054
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, signal-processing, filter, low-pass, noise, frequency-domain]
---

> **What it is:** A ~45-second simulation short where a wildly spike-filled signal transforms in real time as a cutoff-frequency slider sweeps through Butterworth filter settings, showing how convolution with a sinc impulse response separates low-frequency signal from high-frequency noise and how too low a cutoff introduces lag. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Low-Pass Filter — Smoothing a Noisy Signal

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A wildly noisy red signal — spike-filled, chaotic — on the top half of screen. On the bottom: the same signal after low-pass filtering — smooth, clean, beautiful. A slider adjusts the cutoff frequency and in 3 seconds the viewer watches the signal transform from chaos to clarity in real time.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Frequency domain view (FFT): the noisy signal's spectrum shown. Low frequencies (signal of interest): large peaks on the left. High frequencies (noise): many small peaks on the right. Low-pass filter shown as a box window: passes frequencies below f_c, blocks above. Caption: "Low-pass: allow low f, block high f."

**0:10–0:18** — The brick-wall filter in frequency domain vs. the Butterworth filter (smooth roll-off at 3 dB/octave per order). Shown as Bode plots. The Butterworth N=4 filter has a very flat passband and sharp roll-off. Caption: "Butterworth N=4: flat passband, sharp roll-off."

**0:18–0:27** — Time-domain convolution: the filter is equivalent to convolving the signal with the filter's impulse response (a sinc function for ideal LPF). Animation shows the sinc kernel sliding along the signal, computing the weighted average. Caption: "Convolution: weighted local average = filtering."

**0:27–0:36** — Cutoff frequency slider: f_c decreasing from 50 Hz to 5 Hz on the same noisy signal. At f_c=50 Hz: slight smoothing. At f_c=10 Hz: smooth signal. At f_c=5 Hz: over-smoothed (lag introduced, signal delayed). Caption: "Too low f_c: over-smoothed and laggy."

**0:36–0:45** — Application: GPS signal (raw = noisy position) vs. Kalman-filtered (smooth trajectory). Caption: "GPS uses this — and Kalman filters too." Bold text: "Low-pass filter — noise out, signal in." Fade to black.

## Physics Concept Teased
Low-pass filter: a system that attenuates frequencies above a cutoff f_c and passes those below. In the frequency domain: multiplication by H(f) = 1 for f < f_c, 0 for f > f_c. In the time domain: convolution with the inverse Fourier transform of H(f) — a sinc function. Trade-off: sharper cutoff → longer impulse response → more lag.

## On-Screen Text / Captions
- **0:00** — "Noisy signal — apply a low-pass filter."
- **0:05** — "FFT: noise is high-frequency; signal is low-frequency"
- **0:12** — "Butterworth N=4: flat passband, steep roll-off"
- **0:20** — "Time domain: convolution with sinc impulse response"
- **0:28** — "f_c too low → over-smooth, introduce lag"
- **0:35** — "GPS uses low-pass filtering for clean position"
- **0:43** — "Low-pass filter: noise out, signal in."

## End Card
Final 3 seconds: noisy vs. filtered signal side by side, clean sine wave visible through noise. Text: "Your phone's microphone, heart monitor, and Wi-Fi all use low-pass filters." CodedLaws logo.

## Audio
Electronic music starting noisy/grainy, then audibly filtered (treble rolled off) to demonstrate sonic filtering. Voiceover at 0:00: "A low-pass filter removes high-frequency noise — it's a weighted local average in disguise." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: generate signal: x[n] = sin(2πf₀n/fs) + A·noise. Apply low-pass filter via: (1) FFT the signal; (2) multiply by H[k] (box or Butterworth); (3) IFFT. Alternatively: IIR Butterworth filter via bilinear transform (implemented as difference equation). Bode plot: compute |H(f)| vs f analytically for Butterworth: |H(f)|² = 1/(1+(f/f_c)^(2N)). Animate: real-time slider for f_c, recompute filtered output each frame. Runtime: real-time in JavaScript.
