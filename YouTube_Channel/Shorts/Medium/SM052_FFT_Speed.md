---
title: "FFT — O(n log n) vs O(n²) Speed Comparison"
id: SM052
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, signal-processing, FFT, algorithms, complexity, DFT]
---

> **What it is:** A ~45-second simulation short where two live progress bars race head-to-head — the brute-force DFT crawling through 16 million multiply-adds while the Cooley-Tukey FFT butterfly finishes the same N=4096 transform 1,000× faster — making the O(N log N) advantage impossible to miss. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: FFT — O(n log n) vs O(n²) Speed Comparison

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Two progress bars on screen: "DFT (O(n²))" and "FFT (O(n log n))." N = 4096. The FFT bar fills in under 1 second. The DFT bar... barely moves. A timer shows the DFT taking 1,000× longer for the same result.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — DFT brute force: X[k] = Σ_{n=0}^{N-1} x[n] exp(-2πink/N). For N = 4096: 4096 × 4096 = 16,777,216 multiply-add operations. Each multiplication shown as a matrix cell lighting up — 16 million cells fill the screen. Caption: "DFT: N² = 16,777,216 ops."

**0:10–0:18** — FFT (Cooley-Tukey divide and conquer): the DFT of N points is split into two DFTs of N/2 points. Shown as a butterfly diagram — the signature branching structure of FFT. For N=8: 3 stages of 4 butterflies = 24 ops vs 64 for DFT. Caption: "FFT butterfly: divide and conquer."

**0:18–0:27** — Scaling comparison: N on x-axis (8 to 1,048,576). Two curves: O(N²) (rapid parabola) and O(N log N) (gentle curve). At N=1,048,576 (1M), FFT needs 20M ops vs DFT's 10^12 ops. That's 50,000× fewer. Caption: "N=1M: FFT is 50,000× fewer operations."

**0:27–0:36** — Real-world FFT applications cascade: audio spectrogram appears (FFT of microphone data in real time — bars bouncing to music). Then signal processing, radar, MRI image reconstruction, fluid mechanics solvers (pseudo-spectral). Caption: "FFT powers: audio, radar, MRI, physics simulations."

**0:36–0:45** — Historical note: Cooley and Tukey 1965 — "arguably the most important algorithm of the 20th century" (Gilbert Strang). The algorithm was actually secretly used by the NSA in the 1940s. Bold text: "FFT — the algorithm that changed the world." Fade to black.

## Physics Concept Teased
Fast Fourier Transform (FFT): the Cooley-Tukey algorithm recursively decomposes an N-point DFT into two N/2-point DFTs, reducing complexity from O(N²) to O(N log N). For N=10⁶ this is a 50,000-fold speedup. FFT enables real-time spectral analysis and pseudo-spectral PDE solvers used throughout computational physics.

## On-Screen Text / Captions
- **0:00** — "DFT: 16 million ops. FFT: 49,152 ops. Same answer."
- **0:05** — "DFT: X[k] = Σ x[n]·exp(-2πink/N) — N² ops"
- **0:12** — "FFT butterfly: split N → two N/2 problems"
- **0:20** — "N=1M: FFT is 50,000× fewer operations"
- **0:28** — "FFT powers: audio, radar, MRI, physics solvers"
- **0:35** — "Cooley-Tukey, 1965"
- **0:43** — "The most important algorithm of the 20th century."

## End Card
Final 3 seconds: real-time audio FFT spectrogram pulsing to music. Text: "Your music app, GPS, and Wi-Fi router all run FFT — right now." CodedLaws logo.

## Audio
Electronic music with visible real-time FFT bars on screen responding to the music. Voiceover at 0:00: "The DFT and the FFT compute the exact same thing — but one is fifty thousand times faster for a million points." No other voiceover.

## Production Notes
Code complexity: low to moderate. Renderer: Canvas 2D. Key algorithm: implement both naive DFT and Cooley-Tukey radix-2 FFT in JavaScript. Time both on N = 256, 512, 1024, 4096 and plot execution time. Butterfly diagram: visualise the 8-point FFT as a signal flow graph (3 stages of 4 butterfly operations). Real-time spectrogram: Web Audio API → AnalyserNode.getFloatFrequencyData() → draw bars. For the DFT vs FFT race: animate a counter for both simultaneously and show the speedup ratio. Runtime: real-time demo of FFT, pre-computed DFT timing comparison.
