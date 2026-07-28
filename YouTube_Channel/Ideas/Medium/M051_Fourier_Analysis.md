---
title: "Any Signal Is Just Sines Added Together (Fourier Analysis)"
id: M051
difficulty: 5/10
prereq: "None"
concept: "Fourier series: any periodic function = Σ(a_n cos(nωt) + b_n sin(nωt)); Fourier transform for aperiodic signals: F(ω) = ∫f(t)e^(-iωt)dt; orthogonality of basis functions; Parseval's theorem (energy conservation)."
tags: [fourier-analysis, signal-processing, frequency-domain, fourier-series, orthogonality, parseval, canvas, mathematics]
category: medium
type: video-idea
---

# Any Signal Is Just Sines Added Together (Fourier Analysis)

**Alt title:** "The Most Important Equation in Engineering (Built From Scratch)"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Show an oscilloscope trace: a complex, jagged, irregular waveform — the sound of a trumpet. "What is this shape?" Let it play — the audience hears a trumpet note. Then watch as the waveform decomposes: one thin sinusoidal line appears (fundamental frequency), then another at double frequency (second harmonic) at half amplitude, then third harmonic, fourth... each sine appearing one by one and adding to the signal. As each is added, the summed signal looks more and more like the original trumpet. By the 10th harmonic: it's indistinguishable.

Voice: *"Joseph Fourier proved in 1822 that any periodic signal — no matter how complex — can be written as an infinite sum of sines and cosines. Any signal. This is one of the most powerful mathematical theorems ever proven, and it underpins every digital audio system, every image compression algorithm, every WiFi connection, every MRI scan. Tonight we're going to understand why it's true, what the formula means, and what happens when you naively apply it without understanding the one catch that breaks everything."*

---

## The Naive Attempt

Compute the Fourier coefficients of a square wave numerically, then reconstruct it by summing the found harmonics:

```javascript
// Numerical Fourier coefficient computation (DFT the naive way)
function fourierCoefficients(signal, N_harmonics) {
  const n = signal.length;
  const coeffs = [];
  
  for (let k = 0; k <= N_harmonics; k++) {
    let a = 0, b = 0;  // cosine and sine coefficients
    for (let i = 0; i < n; i++) {
      const t = i / n;  // normalized time [0, 1)
      a += signal[i] * Math.cos(2 * Math.PI * k * t);
      b += signal[i] * Math.sin(2 * Math.PI * k * t);
    }
    coeffs.push({ k, a: 2*a/n, b: 2*b/n });
  }
  coeffs[0].a /= 2;  // a_0 is the average, needs factor of 1/2
  return coeffs;
}

// Reconstruct signal from coefficients
function reconstruct(coeffs, N, t) {
  let sum = 0;
  for (const { k, a, b } of coeffs) {
    sum += a * Math.cos(2 * Math.PI * k * t) 
         + b * Math.sin(2 * Math.PI * k * t);
  }
  return sum;
}

// Generate a square wave
function squareWave(t) { return t < 0.5 ? 1 : -1; }

// Sample it
const N_SAMPLES = 256;
const signal = Array.from({length: N_SAMPLES}, (_, i) => squareWave(i / N_SAMPLES));

// Compute coefficients up to k=50
const coeffs = fourierCoefficients(signal, 50);
// Reconstruct and plot
```

Run it: the reconstruction looks almost like a square wave, but near the edges there are distinct overshoots — the signal spikes to about 1.09× the intended amplitude at the rising edge, then ripples before settling. Increase harmonics to k=200: the spikes get taller, not smaller. The overshoot converges to 9%... forever. It never goes away.

---

## The Moment of Failure

Show the reconstruction with 10, 50, 100, 500 harmonics. Graph the overshoot percentage vs. number of harmonics. Expected: it should decrease toward 0%. Actual: it hovers stubbornly at 8.9% regardless of how many harmonics you add. The ripples get narrower (and thus less visible in the bulk of the signal) but the peak overshoot remains constant.

Zoom in to the jump discontinuity with a magnified view. The overshoot spike is clearly visible, doesn't shrink with more harmonics — only gets thinner. Text: "You've discovered the Gibbs phenomenon. This is what happens when you truncate a Fourier series at a discontinuity. And the 8.9% number is not an accident."

---

## Why It Broke — The Physics

The Gibbs phenomenon (Henry Wilbraham 1848, J. Willard Gibbs 1899) is a fundamental property of Fourier series approximation near jump discontinuities. When a periodic function has a jump discontinuity of size J, the partial Fourier sum S_N overshoots the jump by:

> **overshoot = J · (1/π) ∫₀^π sinc(x) dx - J/2 ≈ 0.0895 · J**

This 8.95% overshoot is the same regardless of N. It comes from the oscillatory nature of the Dirichlet kernel (the kernel that a truncated Fourier series implicitly convolves the function with). The Dirichlet kernel D_N(x) = sin((N+1/2)x) / sin(x/2) has large side lobes that don't diminish as N increases — they just narrow.

The Gibbs phenomenon is not a numerical bug. It is a theorem about the behavior of partial Fourier sums near discontinuities. The Fourier series DOES converge to the correct function (converges in L² norm), but pointwise convergence fails at discontinuities.

In practical signal processing, this manifests as:
- **Audio:** "ringing" artifacts near transients (drum hits, note onsets) in MP3 compression at low bitrates.
- **Image processing:** "ringing" artifacts near sharp edges in JPEG images at low quality settings.
- **Numerical PDE solvers:** Gibbs-like oscillations near shocks when using Fourier spectral methods.

The fix: use a **window function** (Hann, Hamming, Blackman) to taper the signal to zero at the boundaries, smoothing the effective discontinuity. Or use a different basis (wavelets, which are local in time-frequency space). Or apply **Gibbs damping** (Lanczos sigma factors): multiply the k-th coefficient by sinc(k/N) — this damps the high-frequency ringing while preserving most accuracy.

---

## The One Concept

**Fourier Analysis: Decomposing Signals into Sinusoidal Basis Functions**

The Fourier series says: any function f(t) periodic with period T can be written as:
> **f(t) = a₀/2 + Σₙ₌₁^∞ [aₙ cos(nω₀t) + bₙ sin(nω₀t)]**

where ω₀ = 2π/T is the fundamental frequency, and the coefficients are:
> **aₙ = (2/T) ∫₀ᵀ f(t) cos(nω₀t) dt**
> **bₙ = (2/T) ∫₀ᵀ f(t) sin(nω₀t) dt**

Why sines and cosines? Because they are **orthogonal** — the inner product of any two distinct basis functions is zero:
> **∫₀ᵀ cos(mω₀t) cos(nω₀t) dt = 0 for m ≠ n**

This orthogonality means each coefficient aₙ, bₙ can be computed independently by projecting f(t) onto the corresponding basis function. The integral formula for aₙ "measures how much of the nth cosine is in f(t)."

The **complex exponential form** is more compact and mathematically elegant:
> **f(t) = Σₙ₌₋∞^∞ cₙ e^(inω₀t)**
> **cₙ = (1/T) ∫₀ᵀ f(t) e^(-inω₀t) dt**

where cₙ = (aₙ - ibₙ)/2 for n > 0, c₋ₙ = c̄ₙ for real f. The complex form unifies cosines and sines and makes multiplication/convolution theorems cleaner.

The **Fourier Transform** extends to aperiodic signals (period T → ∞):
> **F(ω) = ∫₋∞^∞ f(t) e^(-iωt) dt**
> **f(t) = (1/2π) ∫₋∞^∞ F(ω) e^(iωt) dω**

F(ω) is the frequency-domain representation. Its magnitude |F(ω)| is the spectrum — how much of each frequency ω is present. Its phase arg(F(ω)) encodes timing information.

**Key theorems:**

**Parseval's theorem** (energy conservation): the total energy in the signal is the same whether computed in time or frequency domain:
> **∫|f(t)|² dt = (1/2π) ∫|F(ω)|² dω**

This is crucial for signal processing: filtering in the frequency domain (zeroing out |F(ω)|² for some frequencies) removes that portion of the signal's energy exactly.

**Convolution theorem:** convolution in time = multiplication in frequency:
> **f(t) * g(t) ↔ F(ω) · G(ω)**

This is why audio equalizers, image blurs, and FIR filters are applied by multiplying spectra in the frequency domain — it's equivalent to convolution in the time domain but much faster (O(N log N) via FFT rather than O(N²) direct convolution).

**Shift theorem:** a time shift becomes a phase shift in frequency:
> **f(t - t₀) ↔ e^(-iωt₀) F(ω)**

This explains why delay pedals work: shift the signal in time, add it back to the original.

**Uncertainty principle:** time-limited signals have broad spectra; frequency-limited signals have long time durations. Precisely: Δt · Δω ≥ 1/2, which is the signal processing version of the Heisenberg uncertainty principle.

Practical applications: MP3 uses the Modified DCT (related to DFT) to transform 576 audio samples into the frequency domain, then quantize/compress the spectrum. JPEG uses the 2D DCT on 8×8 pixel blocks. WiFi (OFDM) encodes data on hundreds of orthogonal frequency carriers simultaneously — each carrier is a Fourier basis function. MRI scanners measure the Fourier transform of proton spin density directly (k-space imaging) and reconstruct the image via inverse FFT.

---

## The Fix

Correct reconstruction with Gibbs-damping (Lanczos sigma factors):

```javascript
// Lanczos sigma factor: damps high-frequency coefficients smoothly
function sigma(k, N) {
  if (k === 0) return 1;
  const x = Math.PI * k / N;
  return Math.sin(x) / x;  // sinc(k/N)
}

// Reconstruct with damping to suppress Gibbs phenomenon
function reconstructDamped(coeffs, t, N_max) {
  let sum = 0;
  for (const { k, a, b } of coeffs) {
    const s = sigma(k, N_max);  // apply Lanczos damping
    sum += s * (a * Math.cos(2 * Math.PI * k * t)
              + b * Math.sin(2 * Math.PI * k * t));
  }
  return sum;
}

// Alternatively: apply a window before computing coefficients
function hannWindow(n, N) { return 0.5 * (1 - Math.cos(2*Math.PI*n/N)); }

function fourierCoefficientsWindowed(signal) {
  const n = signal.length;
  const windowed = signal.map((v, i) => v * hannWindow(i, n));
  return fourierCoefficients(windowed, n / 2);
}
```

Show before (Gibbs overshoot: 8.9%) vs. after (Lanczos damping: overshoot < 1%). The tradeoff: the edges are slightly smoother (not perfectly sharp), but the ringing is gone.

Then show the correct framing: the undamped series IS the correct mathematical answer — the Gibbs phenomenon is a property of Fourier series, not a bug. The sigma factor is an approximation that trades sharpness for smoothness. The lesson: choose the right tool for the application.

---

## The Wow Moment — Push It

**Live Fourier synthesis:** An interactive canvas where the user draws a waveform with their mouse. In real time, the DFT is computed and the spectrum is shown (bar chart of |cₙ|). The user can edit the spectrum (drag bars up/down) and watch the waveform change. Remove all high frequencies → smooth low-pass filtered waveform. Remove all but one frequency → pure sine wave. Add back harmonics one by one.

**Rotating phasors visualization:** The Fourier series interpreted as rotating circles (Ptolemy epicycles). Each harmonic is a circle rotating at nω₀, its radius proportional to |cₙ|, its starting angle set by arg(cₙ). Stack them: the tip of the last circle traces the signal. Add harmonics one by one and watch the phasor chain gradually trace a square wave, a triangle wave, a sawtooth, or the viewer's drawn waveform. This is the classic "Fourier series as epicycles" animation — mathematically exact and visually spectacular.

**Audio spectrum analyzer:** Feed microphone input through the browser Web Audio API, compute the DFT in real time, display the spectrum as a live bar chart. Whistle into the microphone — see the pure tone spike appear. Play music — see the harmonic structure of each instrument. Hum a note and trace how the harmonics change as you change vowels (formants of human speech).

---

## The Interactive Demo

**Waveform selector:** Sine, Square, Triangle, Sawtooth, Pulse (with adjustable duty cycle), Random, Draw-your-own.
**Number of harmonics slider:** 1–500. Watch the reconstruction converge (or Gibbs-diverge at edges).
**Gibbs damping toggle:** before/after sigma factors.
**Window function selector:** None, Hann, Hamming, Blackman — see effect on spectrum leakage.
**Spectrum display mode:** magnitude only, phase only, magnitude+phase, real/imaginary parts.
**Time domain / Frequency domain split:** live update of both panels.
**Parseval energy meters:** show total energy in time domain and frequency domain — they should match. Toggle harmonics off and watch the frequency energy decrease while time domain shows the missing detail.
**Phasor animation mode:** show rotating circles for each harmonic, stacked.
**Convolution demo:** select two signals, see their convolution computed via FFT (multiply spectra, inverse FFT) vs. direct O(N²) convolution — compare accuracy and speed.

---

## Production Notes

**Code to show on screen:** The three-line Fourier coefficient formula:
```javascript
for (let i=0; i<n; i++) {
  a += signal[i] * Math.cos(2*Math.PI*k*i/n);
  b += signal[i] * Math.sin(2*Math.PI*k*i/n);
}
```
Annotate: `2πk*i/n` = "how many full rotations does harmonic k make in n samples." The integral is just a discrete sum. Every mysterious-looking Fourier integral becomes this 3-line loop.

**Key visual at 3:30:** The orthogonality visualization. Show two sinusoids of different frequencies. Show their pointwise product. The product oscillates, and when you sum all its values: zero. "They're perpendicular in function space." This earns the entire Fourier coefficient formula.

**Key cinematic moment at 6:00:** The Gibbs phenomenon reveal. Show the partial sum overshoot at 8.9%, draw a horizontal line at 8.9%, watch more harmonics pile up — the line never crosses down. "It's stuck. That number is a theorem, not a bug." The humor of a mathematical theorem masquerading as a programming error is the thesis.

**Key moment at 8:30:** The phasor animation. Start with 1 rotating circle (fundamental frequency). The tip traces a sine. Add 2nd harmonic: tip now traces something more complex. Add 10th: recognizable square wave shape. Add 100th: nearly perfect square wave with the phasor chain whipping in complex spirals. This animation should be filmed at slow motion (1/4 speed) to let the viewer appreciate the geometry.

**Key moment at 10:00:** Microphone spectrum. Hold a tuning fork to the mic. A single sharp spike at 440 Hz. Hum "ah" — show formants F1 and F2 of the vowel. Play a piano chord — show the three fundamental frequencies and their harmonics. The Fourier transform has just revealed the "DNA" of sound.

---

## Tags

`fourier-analysis` `signal-processing` `frequency-domain` `fourier-series` `orthogonality` `parseval` `canvas` `mathematics`

---

## Thumbnail

**Center:** the iconic Fourier epicycles animation — a chain of rotating circles (teal, gold, purple, progressively smaller) with the tip tracing a square wave in bright white. Left side inset: the "messy" original signal drawn by hand. Right side inset: the clean bar-chart spectrum with a few bright spikes (harmonics). Bold white title at top: "ANY SIGNAL IS JUST SINES ADDED TOGETHER". The subtitle in gold: "Fourier Analysis from Scratch". The thumbnail should feel mathematically beautiful — the circles are elegant, the wave they trace is a familiar shape (square wave), the connection between the two is the insight. Dark background, glowing colors.
