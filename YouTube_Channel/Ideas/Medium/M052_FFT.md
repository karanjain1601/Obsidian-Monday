---
title: "The Algorithm That Changed Computation (FFT From Scratch)"
id: M052
difficulty: 6/10
prereq: "M051"
concept: "Cooley-Tukey FFT: divide-and-conquer DFT from O(N²) to O(N log N); butterfly diagram; bit-reversal permutation; N must be a power of 2 (or use mixed-radix); FFT of FFT is the inverse (with normalization)."
tags: [FFT, Cooley-Tukey, algorithm, DFT, butterfly-diagram, signal-processing, divide-and-conquer, canvas]
category: medium
type: video-idea
---

# The Algorithm That Changed Computation (FFT From Scratch)

**Alt title:** "Dividing a Sum Into Two Halves Forever (That's the Whole FFT)"
**Difficulty:** 6/10 | **Prereq:** M051

---

## Opening Hook (0:00–1:00)

Timeline graphic: 1965. James Cooley and John Tukey publish an algorithm in Mathematics of Computation. At the time, computing the Fourier transform of N samples required O(N²) operations. For N = 1 million: 1 trillion multiplications. At 1960s computer speeds, that's years of compute time. After the paper: O(N log N). For N = 1 million: 20 million multiplications. The same computation: minutes.

Voice: *"The story goes that Tukey invented the core idea during a National Security Council meeting in 1965, scribbling the divide-and-conquer recurrence on the back of a notepad while President Kennedy was being briefed on Soviet missile positions. Whether that's true or not, the impact was immediate: the DFT, previously too slow for real-time audio and radar, was suddenly viable. Today every digital audio device, every radio receiver, every WiFi chip, every spectroscopy instrument runs FFT. And you're going to implement it from scratch, get it wrong in a specific and instructive way, and then fix it."*

Counter: "N=4096. DFT: 16,777,216 operations. FFT: 49,152 operations. 341× faster."

---

## The Naive Attempt

Implement the DFT directly — the definition, N² complexity:

```javascript
// The DFT definition: exactly what M051 computed
// O(N²) — the naive approach
function dft(signal) {
  const N = signal.length;
  const X = new Array(N).fill(null).map(() => ({ re: 0, im: 0 }));

  for (let k = 0; k < N; k++) {
    for (let n = 0; n < N; n++) {
      const angle = -2 * Math.PI * k * n / N;
      X[k].re += signal[n] * Math.cos(angle);
      X[k].im += signal[n] * Math.sin(angle);
    }
  }
  return X;
}

// Benchmark
const signal = new Float32Array(4096).map(() => Math.random());
console.time('DFT');
dft(Array.from(signal));
console.timeEnd('DFT');  // ~800ms in browser JS
```

Result: 4096-point DFT takes ~800ms in a modern browser. 44,100-point (1 second of audio at CD quality): would take ~400 seconds. Completely unusable for real-time audio.

Now attempt a naive "optimization": precompute the twiddle factors W_N^kn = e^(-2πikn/N):

```javascript
// "Optimized" DFT with precomputed twiddle factors
function dft_precomputed(signal) {
  const N = signal.length;
  // Precompute twiddle factors
  const twiddle = [];
  for (let k = 0; k < N; k++) {
    twiddle[k] = [];
    for (let n = 0; n < N; n++) {
      const angle = -2 * Math.PI * k * n / N;
      twiddle[k][n] = { c: Math.cos(angle), s: Math.sin(angle) };
    }
  }
  const X = new Array(N).fill(null).map(() => ({re:0, im:0}));
  for (let k=0; k<N; k++)
    for (let n=0; n<N; n++) {
      X[k].re += signal[n] * twiddle[k][n].c;
      X[k].im += signal[n] * twiddle[k][n].s;
    }
  return X;
}
```

Still O(N²) — the precomputed twiddle just removes redundant cos/sin calls. Speedup: ~2×. Still 400ms for N=4096. The O(N²) is the problem, not the constant factor.

---

## The Moment of Failure

Profile `dft()` and `dft_precomputed()` side by side with N = 4096, 8192, 16384. Plot time vs. N on a log-log graph. Both show a slope of 2 (i.e., doubling N quadruples time). The "4× faster by precomputing" doesn't change the slope — just shifts the line down slightly.

Text: "Constant-factor optimizations can't save an O(N²) algorithm. The problem is structural. We need to change the algorithm, not tune it." Then: "The key insight Cooley and Tukey had in 1965 was this: the DFT of N points can be computed as two DFTs of N/2 points each. If that sounds trivial, hold on — applying it recursively takes O(N²) to O(N log N)."

---

## Why It Broke — The Physics

The DFT of N points is:
> **X[k] = Σₙ₌₀^(N-1) x[n] · W_N^(kn)**

where W_N = e^(-2πi/N) is the "twiddle factor." The key algebraic observation: split the sum into even-indexed and odd-indexed terms:

> **X[k] = Σₙ₌₀^(N/2-1) x[2n] · W_N^(k·2n) + Σₙ₌₀^(N/2-1) x[2n+1] · W_N^(k·(2n+1))**

> **= Σₙ₌₀^(N/2-1) x[2n] · (W_N²)^(kn) + W_N^k · Σₙ₌₀^(N/2-1) x[2n+1] · (W_N²)^(kn)**

Since W_N² = e^(-2πi·2/N) = e^(-2πi/(N/2)) = W_{N/2}:

> **X[k] = E[k] + W_N^k · O[k]**

where E[k] = DFT of even samples, O[k] = DFT of odd samples (both of length N/2). This is the **Cooley-Tukey butterfly**: one N-point DFT = two (N/2)-point DFTs + N "butterfly" operations (multiplications by twiddle factors and additions).

Furthermore: W_N^(k+N/2) = -W_N^k, so:
> **X[k + N/2] = E[k] - W_N^k · O[k]**

This means X[k] and X[k+N/2] share the same intermediate values E[k] and W_N^k·O[k]. Together they form one butterfly computation. Applied recursively to N = 2^m: T(N) = 2T(N/2) + O(N) → T(N) = O(N log N). QED.

The **bit-reversal permutation** arises naturally: to separate even/odd indices recursively, the final input ordering is the bit-reversal of the original indices. For N=8: index 0 (binary 000) → 0, 1 (001) → 4 (100), 2 (010) → 2 (010), 3 (011) → 6 (110), 4 (100) → 1, 5 (101) → 5, 6 (110) → 3, 7 (111) → 7. The FFT must either compute this permutation explicitly or use a recursive formulation that handles it implicitly.

---

## The One Concept

**The Cooley-Tukey FFT: Divide-and-Conquer DFT**

The FFT is not a different mathematical transform from the DFT — it computes the same result. It is a radically faster algorithm for computing the DFT by exploiting the redundancy in the DFT sum.

The key redundancy: many of the N² twiddle factor values W_N^(kn) are identical because W_N^N = 1 (periodicity). Specifically, W_N^(kn) depends only on (kn mod N). A naive DFT evaluates the same e^(iθ) multiple times. The FFT recognizes these redundancies and shares computations.

**The butterfly diagram:** The FFT computation can be drawn as a network (the butterfly diagram) where:
- Each row represents one "stage" of the recursion.
- Each "butterfly" takes two inputs and produces two outputs: (a, b) → (a + W·b, a - W·b).
- For N=8: 3 stages (log₂8), 4 butterflies per stage (N/2), total = 12 butterflies = 12 complex multiplications + 24 additions vs. DFT's 64 complex multiplications. This ratio grows: for N=2^20, FFT needs ~10 million operations vs DFT's 1 trillion.

**Iterative FFT (Cooley-Tukey, in-place, decimation-in-time):**

```javascript
function fft(re, im) {
  const N = re.length;
  // Assert N is power of 2
  
  // Bit-reversal permutation
  for (let i = 1, j = 0; i < N; i++) {
    let bit = N >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }

  // Butterfly stages
  for (let len = 2; len <= N; len <<= 1) {
    const halfLen = len >> 1;
    const ang = -2 * Math.PI / len;  // for inverse FFT, use +2π/len
    const wRe = Math.cos(ang), wIm = Math.sin(ang);  // primitive root of unity

    for (let i = 0; i < N; i += len) {
      let curRe = 1, curIm = 0;  // current twiddle factor
      for (let j = 0; j < halfLen; j++) {
        // Butterfly: (re[i+j], im[i+j]) and (re[i+j+halfLen], im[i+j+halfLen])
        const uRe = re[i+j], uIm = im[i+j];
        const vRe = re[i+j+halfLen]*curRe - im[i+j+halfLen]*curIm;
        const vIm = re[i+j+halfLen]*curIm + im[i+j+halfLen]*curRe;
        re[i+j]         = uRe + vRe;  im[i+j]         = uIm + vIm;
        re[i+j+halfLen] = uRe - vRe;  im[i+j+halfLen] = uIm - vIm;
        // Advance twiddle factor (rotation by wRe+i*wIm)
        const newCurRe = curRe*wRe - curIm*wIm;
        curIm           = curRe*wIm + curIm*wRe;
        curRe           = newCurRe;
      }
    }
  }
}
```

This implementation is in-place: only two Float64Arrays of length N are needed. No recursion, no allocation inside the loop. The twiddle factors are computed on the fly by incremental rotation (multiply by wRe+i·wIm each step) — more numerically stable than independent cos/sin calls.

**Inverse FFT:** Change the sign of the angle (`+2π/len`) and divide by N at the end:
> **x[n] = (1/N) Σ X[k] W_N^(-kn)**

The "FFT of FFT = inverse (with normalization)" works because: applying FFT twice reverses the bit-reversal permutation AND conjugates the exponents, giving you the original signal multiplied by N.

**Mixed-radix FFT:** When N is not a power of 2, use the mixed-radix approach: factor N = N₁ × N₂ × ... and apply the Cooley-Tukey decomposition with different radices at each level. Common radices: 2, 3, 4, 5. The FFTW library ("Fastest Fourier Transform in the West") finds the optimal factorization at runtime. For audio: pad signals to the next power of 2 (zero-padding) to use radix-2.

**Accuracy:** The FFT accumulates O(log N) rounding errors (one per stage), giving an error of O(ε_machine · log N) where ε_machine ≈ 10⁻¹⁶ for double precision. For N=10⁶: error ≈ 2×10⁻¹⁵, completely negligible.

Real-world: the original Cooley-Tukey paper has over 3,000 citations. The algorithm appears in: GNU Radio, FFTW (C library), NumPy (Python), every digital oscilloscope, every software-defined radio, every audio DAW. The FFTW library's auto-tuning approach to finding the optimal radix decomposition is itself a landmark in algorithm engineering.

---

## The Fix

Benchmark the corrected FFT vs the naive DFT:

```javascript
// The fix: use the butterfly FFT above

const N = 4096;
const signal_re = new Float64Array(N).map(() => Math.random());
const signal_im = new Float64Array(N).fill(0);

// Naive DFT: ~800ms
console.time('DFT');
const spec_dft = dft(signal_re);
console.timeEnd('DFT');

// FFT: ~0.8ms
const fft_re = signal_re.slice();
const fft_im = signal_im.slice();
console.time('FFT');
fft(fft_re, fft_im);
console.timeEnd('FFT');

// Verify they produce the same result
let maxErr = 0;
for (let k = 0; k < N; k++) {
  const err = Math.hypot(fft_re[k] - spec_dft[k].re, fft_im[k] - spec_dft[k].im);
  maxErr = Math.max(maxErr, err);
}
console.log('Max error:', maxErr);  // < 1e-10
```

Output: DFT: 800ms. FFT: 0.8ms. 1000× speedup. Max error: 3×10⁻¹¹. Same result, 1000× faster, numerical error in the 11th decimal place.

---

## The Wow Moment — Push It

**Real-time audio FFT:** Use the Web Audio API's `AnalyserNode` (which runs a hardware-optimized FFT), but also run your own JavaScript FFT on the same data and compare results. Show both spectrums overlaid — they match identically. The viewer's handwritten FFT is producing the same result as the browser's C++ implementation.

**Image convolution via FFT:** Take a 512×512 grayscale image, compute its 2D FFT (row-major: FFT each row, then each column). Apply a Gaussian blur in the frequency domain (multiply spectrum by a Gaussian envelope). Inverse 2D FFT. The result is a perfectly blurred image, computed in O(N² log N) instead of O(N² · k²) direct convolution. With a 100×100 blur kernel: FFT approach is ~2,000× faster.

**FFT-based multiplication of huge integers:** Represent two large integers as polynomials (digits as coefficients), multiply polynomials via FFT-based convolution (O(N log N)), read off the product. Multiply two 100,000-digit numbers in under 1 second. This is how Python's built-in large-integer multiplication works internally.

**Waterfall spectrogram:** Take the microphone input, compute a running FFT every 10ms, plot each spectrum as a horizontal strip, scrolling upward. The result is a scrolling spectrogram — a time-frequency view of sound. Sing a glissando (sliding pitch) — watch the bright line of the fundamental frequency arc upward. This visualization is used in radio monitoring and acoustic analysis.

---

## The Interactive Demo

**Signal type:** Sine, multi-sine, square, sawtooth, random noise, user-drawn, live microphone.
**N selector:** 64, 128, 256, 512, 1024, 2048, 4096, 8192 (must be power of 2; mixed-radix unlock for others).
**Display mode:** magnitude spectrum (dB scale), phase spectrum, real/imaginary parts, polar plot.
**Algorithm selector:** Naive DFT vs. FFT — show timing comparison, error comparison, result overlay.
**"Run benchmark" button:** sweep N from 64 to 65536, plot time vs. N on log-log axes, draw best-fit lines (slope 2 for DFT, slope ~1 for FFT). The lines diverge dramatically at large N.
**Butterfly diagram view:** for small N (≤ 64), render the butterfly diagram as a graph: nodes are complex values, edges are butterfly connections, twiddle factors labeled on edges.
**Bit-reversal visualizer:** show the bit-reversal permutation as an animated reordering of array elements.
**Inverse FFT toggle:** apply FFT then inverse FFT, verify round-trip accuracy.
**Zero-padding slider:** pad signal with N_zeros zeros before FFT — watch spectral interpolation (finer frequency resolution in the output).

---

## Production Notes

**The butterfly diagram animation** is the key visual for this video. At 5:00, draw it for N=8:
- Left column: 8 input samples (after bit-reversal).
- 3 columns of butterfly stages, each connecting pairs of nodes.
- Right column: 8 output frequency bins.
- Animate: light up each butterfly in sequence, showing values flowing from left to right.
- Color-code: red lines = multiplication by twiddle factor, blue lines = addition.

**Code on screen:** The inner butterfly loop (10 lines). Annotate each line:
- `const uRe = re[i+j]` → "save top input"
- `re[i+j] = uRe + vRe` → "top output = sum"
- `re[i+j+halfLen] = uRe - vRe` → "bottom output = difference"
- The +/- symmetry is the structural heart of the FFT.

**Key cinematic moment at 3:00:** The complexity comparison chart. Draw DFT time curve (steep quadratic) and FFT time curve (gentle N log N) on the same axes. Animate the lines growing from left (small N) to right (large N). At N=10⁶, the DFT line hits the top of the chart while the FFT line is barely off the floor. The gap is viscerally dramatic.

**Key moment at 7:30:** Live benchmark in the browser. Console open, visible on screen. Run DFT(4096): 800ms. Run FFT(4096): 0.8ms. The numbers appear live. 1000× speedup in 50 lines of code. Let the numbers sit on screen for 5 seconds. "That's what an algorithm change can do. Not caching, not parallelism, not hardware — a mathematical insight about structure."

**Key moment at 9:00:** Image convolution demo. Take a high-resolution photo (famous photo or stock image). Apply progressively larger blur radii (5×5, 20×20, 100×100). Show the DFT approach time: constant 15ms regardless of blur radius (because it's spectrum multiplication, not convolution kernel size). Show naive convolution time growing with kernel size. At 100×100 kernel: naive takes 2 seconds, FFT takes 15ms. The comparison proves the point without any narration needed.

**Key moment at 11:00:** Closing thought. Show the history: 1965 Cooley-Tukey paper. Show the impact: every digital audio device, radio, WiFi, 5G, MRI, radar, sonar. "This is what applied mathematics looks like. Not a theorem in a journal — an algorithm in every device in your pocket." End card with the butterfly diagram as abstract art.

---

## Tags

`FFT` `Cooley-Tukey` `algorithm` `DFT` `butterfly-diagram` `signal-processing` `divide-and-conquer` `canvas`

---

## Thumbnail

**Dark background. Center:** the butterfly diagram for N=8, rendered in neon — 8 input nodes on the left (white dots), 3 stages of butterfly connections (glowing blue/teal lines crossing in the characteristic X-patterns), 8 output nodes on the right (bright gold dots). Each butterfly X glows where operations happen. Bold title at top: "THE ALGORITHM THAT CHANGED COMPUTATION". Bottom strip: two timing bars — left labeled "DFT" with a massive red bar labeled "800ms"; right labeled "FFT" with a tiny green bar labeled "0.8ms". The contrast is extreme and immediately communicates the video's core thesis. The butterfly diagram is recognizable to anyone who's seen signal processing before — it's the visual symbol of the FFT.
