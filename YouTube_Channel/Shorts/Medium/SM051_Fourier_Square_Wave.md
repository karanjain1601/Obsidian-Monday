---
title: "Fourier Series — Building a Square Wave"
id: SM051
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, signal-processing, fourier-series, harmonics, mathematics]
---

> **What it is:** A ~45-second simulation short where a square wave dissolves into a single sine wave then rebuilds harmonic by harmonic — showing how odd-frequency sine waves sum toward a perfect square wave while a permanent 9% Gibbs overshoot clings to every sharp corner regardless of how many terms are added. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Fourier Series — Building a Square Wave

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black background. A perfect square wave pulses on screen — crisp, sharp corners. Then it dissolves, replaced by a single smooth sine wave. A second harmonic adds, then a third, fourth — each added frequency sharpens the corners. By 3 seconds, 20 harmonics have been added and the square wave re-emerges, nearly perfect.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Formula shown: f(x) = (4/π) Σ_{n=1,3,5,...} sin(nπx/L)/n. Each term is a sine wave of frequency n/(2L) and amplitude 4/(nπ). The first term: a single sine wave (shown in red). Adding the 3rd harmonic: the wave gets shoulders. Adding the 5th: the corners sharpen. Caption: "Only odd harmonics contribute."

**0:10–0:18** — Phasor (epicycle) representation: a set of rotating circles (one per harmonic). The tip of the outermost circle traces the waveform as time progresses. The n=1 circle is large, n=3 is 1/3 the radius, n=5 is 1/5, etc. All rotating at their respective frequencies. Caption: "Epicycles — Fourier's rotating circles."

**0:18–0:27** — Gibbs phenomenon: even with 100 harmonics, the overshooting at the discontinuity remains at ~9% of the jump height. Zoom in on the edge of the square wave: the ringing overshoot is visible and doesn't diminish with more harmonics — only becomes narrower. Caption: "Gibbs phenomenon: 9% overshoot — forever."

**0:27–0:36** — Other waveforms: sawtooth wave built from sin(nx)/n (all harmonics). Triangle wave from cos((2n-1)x)/(2n-1)². Each shown with 1, 3, 10, and 50 harmonics. Caption: "Sawtooth, triangle — all built from sine waves."

**0:36–0:45** — Decompose a real instrument sound (piano note A440) into its Fourier components shown as a frequency spectrum bar chart. "Any sound = sum of sine waves." Bold text: "Fourier: every signal is a sum of sine waves." Fade to black.

## Physics Concept Teased
Fourier series: any periodic function can be expressed as a sum of sine and cosine waves (harmonics). For a square wave, only odd harmonics appear with amplitudes decaying as 1/n. The Gibbs phenomenon (9% overshoot near discontinuities) is an irreducible feature of truncated Fourier series — it doesn't vanish with more terms.

## On-Screen Text / Captions
- **0:00** — "A square wave — sum of sine waves."
- **0:05** — "f(x) = (4/π)Σ sin(nπx/L)/n (odd n)"
- **0:12** — "Epicycles: rotating circles trace the waveform"
- **0:20** — "Gibbs phenomenon: 9% overshoot — always"
- **0:28** — "Sawtooth: sin(nx)/n; Triangle: cos((2n-1)x)/(2n-1)²"
- **0:35** — "Piano A440: Fourier spectrum"
- **0:43** — "Every signal = sum of sine waves."

## End Card
Final 3 seconds: all harmonics shown simultaneously as superposed waves building the square wave. Text: "Jean-Baptiste Joseph Fourier, 1822 — the heat equation." CodedLabs logo.

## Audio
Musical — actual sine wave tones added one by one (frequency 440 Hz, 1320 Hz, 2200 Hz…). The combination sounds increasingly like a square wave buzzer. Voiceover at 0:00: "Take a sine wave, add its odd harmonics at decreasing amplitudes — and you get a square wave." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D or p5.js. Key algorithm: compute Fourier partial sum at each x position: sum over n = 1, 3, 5, ..., N of sin(nπx/L)/n × (4/π). Animate by increasing N from 1 to 50. Epicycle representation: draw N rotating circles, update angles each frame by their respective frequencies, draw lines between circle tips, and trace the y-component of the outermost tip on the right panel as the waveform. Gibbs: compute sum at fine resolution near the discontinuity to show overshoot. Runtime: real-time, trivially fast.
