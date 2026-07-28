---
title: "Finding Features in Both Time and Frequency (Wavelet Transform)"
id: M053
difficulty: 6/10
prereq: "M051"
concept: "Wavelet transform: unlike Fourier (infinite basis functions), wavelets are localized in both time and frequency; continuous WT W(a,b) = ∫f(t)ψ*((t-b)/a)dt; discrete WT via filter banks; Heisenberg uncertainty principle sets limit."
tags: [wavelet, signal-processing, time-frequency, uncertainty-principle, filter-bank, DWT, canvas, mathematics]
category: medium
type: video-idea
---

# Finding Features in Both Time and Frequency (Wavelet Transform)

**Alt title:** "Why the Fourier Transform Goes Blind to Time (And What to Do About It)"
**Difficulty:** 6/10 | **Prereq:** M051 (Fourier Transform)

---

## Opening Hook (0:00–1:00)

Open on a split screen. On the left: a seismogram — a jagged, violent spike buried in 30 seconds of flat line. On the right: the Fourier transform of that same signal — a smooth, featureless blob of frequency content that reveals exactly nothing about *when* the earthquake arrived.

Narrator: "The Fourier transform sees everything but knows nothing about when. Every concert ever recorded is, to Fourier, just a pile of frequencies with no sense of melody, no sense of time. If a doctor wants to find a sudden arrhythmia in your heartbeat, the Fourier transform will average it away into silence."

Cut to code. You run an FFT on an ECG signal with a 200ms spike anomaly. The resulting frequency plot looks completely normal — no alarm raised. The bug is the tool itself.

"What if we could tune into a frequency *and* zoom into a time window at the same time? That's not a question. Mathematicians solved it in the 1980s. It's called the wavelet transform, and today we're building it from scratch."

---

## The Naive Attempt

The naive approach: "I'll just window the Fourier transform. Short-Time Fourier Transform (STFT). Chop the signal into 256-sample chunks, FFT each chunk, stack them as a spectrogram." Here's the code you write first:

```javascript
function naiveSTFT(signal, windowSize = 256, hopSize = 64) {
  const result = [];
  for (let start = 0; start + windowSize <= signal.length; start += hopSize) {
    const chunk = signal.slice(start, start + windowSize);
    // Apply Hann window to reduce spectral leakage
    const windowed = chunk.map((v, i) => v * 0.5 * (1 - Math.cos(2 * Math.PI * i / windowSize)));
    result.push(fft(windowed)); // returns magnitude spectrum
  }
  return result; // 2D array: time × frequency
}
```

You render this on canvas as a heatmap. For the seismogram, it kind of works — you see a vertical stripe of energy appear at the moment of the earthquake spike. You show it to your imaginary client.

"Great! But can you make it show high frequencies better? The P-wave arrival is at 50 Hz and the S-wave is at 5 Hz. They show up differently."

You increase `windowSize` to 1024 to get better frequency resolution for the low-frequency S-wave. Now the P-wave smears across 4 seconds of time because a 1024-sample window at 1 kHz sample rate is a full second. You decrease `windowSize` to 64 for better time resolution. Now the S-wave frequency is unresolvable because 64 samples only gives you 32 frequency bins at 1 kHz, so your lowest non-DC bin is 31 Hz. You can't see the 5 Hz S-wave at all.

You are trapped. You cannot win with a fixed window size.

---

## The Moment of Failure

Exact visual: you render a side-by-side spectrogram comparison on canvas. On the left, large window (good frequency, bad time): a beautiful frequency axis but the P-wave arrival is a blurry horizontal smear 1 second wide. On the right, small window (good time, bad frequency): a sharp vertical line at the exact arrival time, but the frequency axis only goes down to 31 Hz, and the low-frequency S-wave is invisible — just a flat grey baseline.

Both spectrograms are on screen at once. You draw a big red X over each one. Neither is adequate. The text "PICK ONE: time OR frequency" appears, then crosses itself out.

A graph overlays both: showing frequency resolution (Δf = f_s/N) and time resolution (Δt = N/f_s) for the STFT. You draw a rectangle in the time-frequency plane. For the large window, the rectangle is tall and narrow (good Δf, bad Δt). For the small window, it's short and wide. In both cases, the *area* of the rectangle is constant. This is not a coincidence.

---

## Why It Broke — The Physics

The STFT failure is not a coding bug — it is Heisenberg's uncertainty principle for signals.

**The Gabor Limit (time-frequency uncertainty):**
$$\Delta t \cdot \Delta \omega \geq \frac{1}{2}$$

This is mathematically identical in structure to the quantum mechanical $\Delta x \cdot \Delta p \geq \hbar/2$. In signal analysis, $\Delta t$ is the temporal spread of your analysis window and $\Delta \omega$ is the frequency spread (bandwidth) of your spectral estimate. Their product has a hard lower bound — you cannot shrink both simultaneously.

For a rectangular window of size $N$ samples at sample rate $f_s$:
- Time resolution: $\Delta t = N / f_s$ (the window duration)
- Frequency resolution: $\Delta f = f_s / N$ (one bin width)
- Product: $\Delta t \cdot \Delta f = 1$ (always)

The STFT chooses one fixed tile shape for the *entire* time-frequency plane. High frequency signals are short-duration (transients, clicks, consonants in speech); they need narrow time windows. Low frequency signals (hum, bass, vowels) need long windows to resolve even one cycle. The STFT cannot do both at once because it uses the same rectangular tile everywhere.

The wavelet transform's insight: **use a different window shape at each frequency**. Analyze high frequencies with a short, narrow window (good time resolution). Analyze low frequencies with a long, wide window (good frequency resolution). The tile shape changes, but the area (time-bandwidth product) stays at the Gabor limit everywhere. This is called **constant-Q analysis**.

---

## The One Concept

**The Wavelet Transform** is a decomposition of a signal into scaled and shifted versions of a single prototype function — the *mother wavelet* $\psi(t)$.

**Continuous Wavelet Transform (CWT):**
$$W(a, b) = \frac{1}{\sqrt{|a|}} \int_{-\infty}^{\infty} f(t) \, \psi^*\!\left(\frac{t - b}{a}\right) dt$$

Here $a$ is the **scale** parameter (analogous to inverse frequency: large $a$ = low frequency, dilated wavelet; small $a$ = high frequency, compressed wavelet) and $b$ is the **translation** (time shift). The $1/\sqrt{|a|}$ factor normalizes energy across scales. $\psi^*$ is the complex conjugate of the mother wavelet.

**Intuition:** You are sliding a small oscillating "blip" (the wavelet) along the signal, at many different sizes. When the blip matches a feature in the signal — a transient, an oscillation at a particular frequency — the inner product $W(a,b)$ is large. You get a 2D map of which scale (frequency) was active at which time. Unlike the Fourier sinusoid, which stretches from $-\infty$ to $+\infty$, the wavelet is **compactly supported** (near-zero outside a small region). It is localized in both time and frequency.

**The mother wavelet must satisfy the admissibility condition:**
$$C_\psi = \int_0^\infty \frac{|\hat{\psi}(\omega)|^2}{\omega} d\omega < \infty$$

This requires $\hat{\psi}(0) = 0$, meaning the wavelet has zero mean — it truly oscillates. Common mother wavelets include:
- **Morlet:** $\psi(t) = e^{i\omega_0 t} e^{-t^2/2}$ — a Gaussian-modulated complex sinusoid. Excellent frequency resolution, smooth, used in geophysics and neuroscience.
- **Haar:** $\psi(t) = +1$ for $t \in [0, 0.5)$, $-1$ for $t \in [0.5, 1)$, $0$ elsewhere — the simplest wavelet, identical to a 1-sample Sobel filter in 1D. Detects step discontinuities.
- **Daubechies (db4):** A family of compactly supported wavelets with vanishing moments; excellent for smooth signals and used in JPEG 2000.
- **Mexican Hat (Ricker):** $\psi(t) = (1 - t^2)e^{-t^2/2}$ — the second derivative of a Gaussian. Used in seismology and blob detection.

**Real-world examples:**
- **JPEG 2000:** Uses the discrete wavelet transform (DWT) with biorthogonal 9/7 wavelets. Better than JPEG for large smooth regions because wavelet coefficients concentrate energy into fewer terms.
- **EEG/ECG analysis:** Detect epileptic spikes (high-frequency, transient) simultaneously with alpha/beta rhythms (low-frequency, sustained). The CWT scalogram shows both at once.
- **Audio compression (MP3/AAC):** Modified DCT is a short-time transform; future codecs use wavelet-like filterbanks.
- **Seismology:** Distinguish P-waves from S-waves in a seismogram by their frequency content and arrival time simultaneously.

**Discrete Wavelet Transform (DWT) via filter banks:**
The DWT avoids computing the full CWT (which is highly redundant — it oversamples). Instead, at each level:
1. Convolve signal with **low-pass filter** $h[n]$ → approximation coefficients (catches low frequency)
2. Convolve signal with **high-pass filter** $g[n]$ → detail coefficients (catches high frequency)
3. **Downsample** both by 2 (Nyquist: you only need half the samples after halving the bandwidth)
4. Repeat on the approximation coefficients (this is the "cascade algorithm")

After $J$ levels, you have detail coefficients at scales $2^1, 2^2, \ldots, 2^J$ and one approximation. This is the **multiresolution analysis** (MRA) framework of Mallat (1989). The filter pair $(h, g)$ is designed to be a **quadrature mirror filter** (QMF): $g[n] = (-1)^n h[L-1-n]$ where $L$ is the filter length. For Haar wavelets: $h = [1/\sqrt{2}, 1/\sqrt{2}]$, $g = [1/\sqrt{2}, -1/\sqrt{2}]$.

---

## The Fix

Stop using STFT. Implement the Continuous Wavelet Transform with a Morlet wavelet directly, using FFT convolution for speed:

```javascript
// Morlet wavelet in frequency domain: efficient CWT via FFT
function morletCWT(signal, scales, omega0 = 6.0) {
  const N = signal.length;
  const signalFFT = fft(signal); // complex FFT of the signal

  const W = []; // scalogram: W[scaleIdx][timeIdx] = complex coefficient

  for (let si = 0; si < scales.length; si++) {
    const a = scales[si];
    // Morlet wavelet in frequency domain at scale a:
    // ψ̂_a(ω) = (π^{-1/4}) * sqrt(2πa) * exp(-(aω - ω0)² / 2) for ω > 0
    const waveletFFT = new Array(N).fill(0).map((_, k) => {
      const omega = (k <= N / 2) ? (2 * Math.PI * k / N) : (2 * Math.PI * (k - N) / N);
      if (omega <= 0) return { re: 0, im: 0 };
      const norm = Math.pow(Math.PI, -0.25) * Math.sqrt(2 * Math.PI * a);
      const mag = norm * Math.exp(-Math.pow(a * omega - omega0, 2) / 2);
      return { re: mag, im: 0 };
    });

    // Multiply in frequency domain = convolution in time domain
    const productFFT = signalFFT.map((sf, k) => ({
      re: sf.re * waveletFFT[k].re - sf.im * waveletFFT[k].im,
      im: sf.re * waveletFFT[k].im + sf.im * waveletFFT[k].re
    }));

    W.push(ifft(productFFT)); // inverse FFT → wavelet coefficients at this scale
  }

  return W; // W[scaleIdx][timeIdx].re, .im give complex coefficient
}

// Generate logarithmically spaced scales (constant-Q)
function logScales(minFreq, maxFreq, numScales, sampleRate, omega0 = 6.0) {
  const minScale = omega0 / (2 * Math.PI * maxFreq / sampleRate);
  const maxScale = omega0 / (2 * Math.PI * minFreq / sampleRate);
  return Array.from({ length: numScales }, (_, i) =>
    minScale * Math.pow(maxScale / minScale, i / (numScales - 1))
  );
}

// Render scalogram: |W(a,b)|² as heatmap
function renderScalogram(ctx, W, scales, sampleRate, omega0 = 6.0) {
  const numScales = W.length;
  const numTime = W[0].length;
  const W_H = ctx.canvas.height;
  const W_W = ctx.canvas.width;

  // Find max power for normalization
  let maxPow = 0;
  for (let si = 0; si < numScales; si++)
    for (let ti = 0; ti < numTime; ti++) {
      const re = W[si][ti].re, im = W[si][ti].im;
      maxPow = Math.max(maxPow, re * re + im * im);
    }

  const imgData = ctx.createImageData(W_W, W_H);
  for (let px = 0; px < W_W; px++) {
    const ti = Math.floor(px * numTime / W_W);
    for (let py = 0; py < W_H; py++) {
      // Render low frequency at bottom (large scale = low freq)
      const si = numScales - 1 - Math.floor(py * numScales / W_H);
      const re = W[si][ti].re, im = W[si][ti].im;
      const power = (re * re + im * im) / maxPow;
      const [r, g, b] = inferno(Math.sqrt(power)); // perceptual colormap
      const idx = (py * W_W + px) * 4;
      imgData.data[idx] = r; imgData.data[idx+1] = g;
      imgData.data[idx+2] = b; imgData.data[idx+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}
```

The key fix: instead of one fixed window size, the Morlet wavelet at scale $a$ has effective time duration $\propto a$ and effective frequency bandwidth $\propto 1/a$. Small scales (high freq) are narrow in time, wide in frequency. Large scales (low freq) are wide in time, narrow in frequency. Each tile in the scalogram has different shape but the same time-bandwidth area.

---

## The Wow Moment — Push It

**Demo: Live audio wavelet analysis.** Pipe the microphone into the Web Audio API, compute the CWT in real-time on a worker thread, and render an animated scalogram on a canvas.

Speak into the mic. You see vowels light up as broad horizontal bands at their formant frequencies (low scales, large area). Consonants appear as brief vertical flashes of energy scattered across many scales. A handclap produces a full-column flash — all frequencies, instant time. A whistle produces a thin, clean horizontal line at exactly the whistle frequency.

Then switch to music: play a piano chord. Watch as individual note frequencies appear as horizontal stripes, and the note onsets appear as simultaneous vertical brightening across all three stripes at the exact same moment. The scalogram is a musical score.

**Final reveal:** Load the seismogram from the opening. In the STFT view: blurry. In the wavelet scalogram: a crisp, angled feature — the P-wave arrival at 40 Hz at t=3.1s, the S-wave arrival at 8 Hz at t=7.4s. Two distinct features in time and frequency, both visible simultaneously. The opening problem is solved.

---

## The Interactive Demo

The viewer gets a full-screen canvas with two panels (signal on top, scalogram below) and these controls:

- **Signal selector** (dropdown): Seismogram | ECG with arrhythmia | Chirp sweep (freq increases over time) | Microphone live | Two-tone chord | Custom drawn
- **Mother wavelet** (dropdown): Morlet | Haar | Mexican Hat — changes the scalogram texture instantly
- **ω₀ (Morlet parameter)** (slider, 3–12, default 6): Trade frequency resolution for time resolution. Low ω₀ = more time-localized but frequency-smeared. High ω₀ = more frequency-precise but time-smeared.
- **Scale range min/max** (two sliders, 1 Hz–8 kHz): Zoom into a particular frequency band
- **Number of scales** (slider, 32–512): Controls vertical resolution of scalogram
- **Colormap** (dropdown): Inferno | Viridis | Grayscale | Phase (shows complex angle as hue)
- **Show FFT comparison** (toggle): Splits canvas to show STFT vs CWT side by side
- **Window size for STFT** (slider, 32–2048 samples): Demonstrates the STFT resolution trade-off in real time
- **Draw on signal** panel: Click to add impulses, drag to add sinusoidal bursts — see the scalogram update live

---

## Production Notes

**Code structure:**
- `fft.js`: Cooley-Tukey FFT, supports power-of-2 sizes, returns complex arrays
- `wavelet.js`: `morletCWT()`, `haarDWT()`, `mexicanHatCWT()`, `logScales()`
- `colormap.js`: Inferno, Viridis colormaps as lookup tables
- `main.js`: Canvas setup, UI controls, animation loop, Web Audio API microphone capture

**Visual layout:**
- Black background, full width canvas
- Top 25%: raw signal waveform (white line on dark grey)
- Bottom 75%: scalogram heatmap — y-axis labeled with Hz (log scale), x-axis labeled with seconds
- Thin horizontal dashed lines at musically meaningful frequencies (110 Hz, 220 Hz, 440 Hz, 880 Hz) or seismologically meaningful (P-wave band, S-wave band)
- Vertical red line that follows the mouse cursor across both panels simultaneously (cross-hair)

**Key cinematic moments:**
1. (0:30) Side-by-side STFT spectrograms with large/small window both failing → zoom into the "you cannot win" moment
2. (3:00) First scalogram appears — the chirp sweep shows a perfect diagonal line from bottom-left to top-right: "The frequency is written across the time axis. *This* is what Fourier can't see."
3. (5:30) Live microphone mode — narrator snaps fingers, a brief full-spectrum flash appears at the exact snap moment
4. (8:00) Seismogram resolution: P-wave and S-wave appear as separate, clean features
5. (9:30) Change ω₀ slider slowly — watch the scalogram tiles morph from vertically-sharp/frequency-smeared to horizontally-sharp/frequency-precise. The Heisenberg principle made interactive.

**Equations to flash on screen:**
- $W(a,b) = \frac{1}{\sqrt{a}} \int f(t) \psi^*\!\left(\frac{t-b}{a}\right) dt$
- $\Delta t \cdot \Delta \omega \geq \frac{1}{2}$ (Heisenberg limit — red highlight)
- $\hat{\psi}_{Morlet}(\omega) \propto e^{-(\omega - \omega_0)^2/2}$ (Gaussian in frequency domain)

---

## Tags
`wavelet` `signal-processing` `time-frequency` `uncertainty-principle` `filter-bank` `DWT` `canvas` `mathematics`

---

## Thumbnail

Split image: left half is a classic FFT frequency plot — flat, featureless, boring, labelled "FOURIER" in cold blue text. Right half is a vivid scalogram of a seismogram — electric greens and oranges on a black background, with two bright diagonal features labelled "P-WAVE" and "S-WAVE" in white. A large vs sign (⟨ vs ⟩) separates them. Main title text: "TIME + FREQUENCY" in bold white. Subtitle: "The Wavelet Transform" in smaller yellow text below.
