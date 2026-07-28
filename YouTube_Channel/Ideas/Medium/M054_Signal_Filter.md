---
title: "Building a Signal Filter in Code (Low-Pass, High-Pass, Band-Pass)"
id: M054
difficulty: 5.5/10
prereq: "M051"
concept: "IIR/FIR filters; frequency domain: filter = multiply by H(ω) = target response; time domain: convolution with impulse response h(t); Butterworth, Chebyshev, elliptic filter designs; bilinear transform for digital filters."
tags: [digital-filter, IIR, FIR, butterworth, signal-processing, convolution, frequency-response, canvas]
category: medium
type: video-idea
---

# Building a Signal Filter in Code (Low-Pass, High-Pass, Band-Pass)

**Alt title:** "Why Your Audio Filter Sounds Wrong (And How to Fix It)"
**Difficulty:** 5.5/10 | **Prereq:** M051 (Fourier Transform)

---

## Opening Hook (0:00–1:00)

The scene opens on a vintage oscilloscope. A noisy, crackling audio signal dances on the phosphor screen — a 440 Hz pure tone buried under hiss. You are restoring a historic recording.

Narrator: "Every audio engineer, every embedded systems programmer, every scientist processing sensor data has faced this problem: a signal you care about, drowned in noise you don't. The solution sounds obvious — just remove the frequencies you don't want. But when you sit down and code it, the devil is in the details."

Cut to a canvas with a frequency spectrum: a clean spike at 440 Hz, surrounded by broadband white noise. "I want that spike. I want nothing else." Mouse hovers over the spike. "Let's build a filter."

Then the naive attempt begins — and makes the signal *worse*, not better. "Before we're done, you'll understand exactly why the obvious approach failed, what makes a filter good, and how to design a professional-grade filter with nothing but a for loop and some math."

---

## The Naive Attempt

The obvious approach: "In the Fourier domain, I'll just zero out all frequencies I don't want. A perfect brickwall filter."

```javascript
function brickwallLowPass(signal, cutoffHz, sampleRate) {
  const N = signal.length;
  const spectrum = fft(signal);           // complex FFT
  const binFreq = sampleRate / N;         // Hz per bin

  for (let k = 0; k < N; k++) {
    const freq = (k <= N / 2) ? k * binFreq : (k - N) * binFreq;
    if (Math.abs(freq) > cutoffHz) {
      spectrum[k] = { re: 0, im: 0 };    // zero out the bin
    }
  }
  return ifft(spectrum).map(c => c.re);  // take real part
}
```

You run it. The output signal looks… wrong. There are visible ringing oscillations (Gibbs phenomenon) — high-amplitude ripples before and after any sharp transient in the input signal, like a bell ringing when you hit a drum. The noise is removed, yes, but now the 440 Hz tone has an eerie, reverb-like tail that wasn't there before.

Worse: you try to use this filter in real-time, one sample at a time, on a stream. And it simply can't work — the FFT filter requires the entire signal upfront. You can't filter a microphone stream with an FFT brickwall. "I need a filter that processes samples *one at a time*."

---

## The Moment of Failure

Exact visual: three waveforms stacked on a canvas. Top: original noisy signal (grey/white oscillation). Middle: the brickwall-filtered output — it has removed the noise, but large oscillatory ripples radiate outward from every transient like concentric pond ripples. The ripples are labelled "GIBBS RINGING" with a red arrow.

Bottom panel: a canvas split in two. Left: the frequency response of the brickwall filter — a perfect rectangle, vertical walls. Right: the impulse response (inverse FFT of that rectangle) — a `sinc(t) = sin(πt)/(πt)` function that extends infinitely in both directions, backwards in time. Text appears: "This filter is non-causal. It needs data from the future." A clock with an arrow pointing backwards appears next to the sinc function.

The critical insight is visualized: a perfectly sharp frequency response requires an infinitely long, non-causal impulse response. Perfect is the enemy of implementable.

---

## Why It Broke — The Physics

The brickwall filter's problems trace back to the **duality of time and frequency domains**.

**The Convolution Theorem:**
$$\mathcal{F}\{(f * h)(t)\} = \hat{f}(\omega) \cdot H(\omega)$$

Filtering in the frequency domain (multiplying by $H(\omega)$) is exactly equivalent to convolution in the time domain with the **impulse response** $h(t) = \mathcal{F}^{-1}\{H(\omega)\}$.

The brickwall filter has $H(\omega) = \text{rect}(\omega / 2\omega_c)$. Its inverse Fourier transform is:
$$h(t) = \frac{\omega_c}{\pi} \text{sinc}\!\left(\frac{\omega_c t}{\pi}\right)$$

This is the sinc function — it is symmetric around $t=0$ and decays as $1/t$ for $|t| \to \infty$. It never reaches zero. To compute the output at time $t = 0$, you must multiply the input by $h(-\tau)$ for all $\tau$, which includes $h$ evaluated at large *negative* values of $\tau$, meaning input samples from the *future*. **The filter is non-causal.** You cannot implement it in real-time.

Even if you truncate and time-shift the sinc to make it causal, the truncation introduces **Gibbs phenomenon**: the Fourier series of a discontinuous function (the rectangular $H(\omega)$) overshoots near the discontinuity by 9%, regardless of how many terms you use. This is the ringing you see.

The **design challenge:** build a filter $H(\omega)$ that is (1) causal, (2) stable, (3) achieves the desired frequency response as closely as possible, (4) can be implemented as a short recurrence relation for real-time use.

**IIR filter (recursive):** Described by the difference equation:
$$y[n] = \sum_{k=0}^{M} b_k x[n-k] - \sum_{k=1}^{N} a_k y[n-k]$$

Output depends on past *outputs* — this is the feedback/recursive part. Equivalent to a rational transfer function $H(z) = B(z)/A(z)$ in the Z-domain. Compact (few coefficients), but can be unstable if poles are outside the unit circle.

**FIR filter (non-recursive):** $y[n] = \sum_{k=0}^{M} b_k x[n-k]$. Output depends only on past *inputs*. Always stable (all poles at origin). Linear phase (no phase distortion) when coefficients are symmetric. Requires more coefficients for sharp roll-off.

---

## The One Concept

**Digital Filter Design** is the art of finding coefficients $(b_k, a_k)$ such that the filter's frequency response $|H(e^{j\omega})|$ matches your target as closely as possible under practical constraints.

**FIR Design — Windowed Sinc Method:**
Start with the ideal impulse response $h_{ideal}[n] = \frac{\omega_c}{\pi} \text{sinc}(\omega_c n / \pi)$, truncate to $M+1$ taps, and multiply by a **window function** $w[n]$ to taper the truncation smoothly:
$$h[n] = h_{ideal}[n] \cdot w[n], \quad n = 0, 1, \ldots, M$$

Window choices and their trade-offs:
- **Rectangular:** No tapering. Best main-lobe width (steepest roll-off), worst side-lobe suppression (−13 dB), maximum Gibbs ringing.
- **Hann:** $w[n] = 0.5(1 - \cos(2\pi n/M))$. Side-lobe suppression −44 dB. Wider transition band. Good for audio.
- **Blackman:** $w[n] = 0.42 - 0.5\cos(2\pi n/M) + 0.08\cos(4\pi n/M)$. −74 dB side-lobe suppression. Used for demanding applications.
- **Kaiser:** Parameterized by $\beta$; allows continuous trade-off between main-lobe width and side-lobe level. The gold standard for FIR design.

For a 101-tap Hann-windowed low-pass FIR at cutoff $f_c$:
```javascript
function designFIR_LowPass(numTaps, cutoffHz, sampleRate) {
  const M = numTaps - 1;
  const wc = 2 * Math.PI * cutoffHz / sampleRate; // normalized cutoff
  const h = new Array(numTaps);
  for (let n = 0; n <= M; n++) {
    const mid = M / 2;
    const sinc = (n === mid) ? wc / Math.PI
                             : Math.sin(wc * (n - mid)) / (Math.PI * (n - mid));
    const hann = 0.5 * (1 - Math.cos(2 * Math.PI * n / M));
    h[n] = sinc * hann;
  }
  return h;
}
```

**IIR Design — The Butterworth Filter:**
The Butterworth filter has a maximally flat magnitude response in the passband (no ripple). Its frequency response is:
$$|H_a(j\Omega)|^2 = \frac{1}{1 + (\Omega/\Omega_c)^{2N}}$$

where $N$ is the filter order and $\Omega_c$ is the analog cutoff frequency. At $\Omega = \Omega_c$: magnitude = $1/\sqrt{2}$ = −3 dB always. Higher $N$ = steeper roll-off but more ringing (group delay variation).

To make it digital, use the **bilinear transform** (Tustin's method):
$$s = \frac{2}{\Delta t} \cdot \frac{z - 1}{z + 1}$$

This maps the entire left half of the s-plane (analog stability region) onto the interior of the unit circle in the z-plane (digital stability region). The mapping warps the frequency axis: digital frequency $\omega$ corresponds to analog frequency $\Omega = (2/\Delta t)\tan(\omega/2)$. You **pre-warp** the desired cutoff before applying the bilinear transform: $\Omega_c = (2/\Delta t)\tan(\omega_c/2)$, so the cutoff ends up at the right place after warping.

**Other IIR designs:**
- **Chebyshev Type I:** Equiripple in passband (ripple $\delta_1$), monotone in stopband. Steeper roll-off than Butterworth for same order.
- **Chebyshev Type II:** Monotone in passband, equiripple in stopband. Better passband flatness.
- **Elliptic (Cauer):** Equiripple in *both* passband and stopband. Minimum order for given specification. Phase response is nonlinear.

**Real-world examples:**
- **Anti-aliasing filter:** Before sampling an analog signal at $f_s$, a hardware low-pass filter at $f_s/2$ removes aliasing. Your phone's microphone has one. Typically 4th-order Butterworth.
- **Equalizer (EQ):** A chain of second-order IIR filters (biquads). Each biquad implements a peaking filter, shelf filter, or notch. Audio DAWs chain 8–32 of them.
- **ECG noise removal:** A 50 Hz notch filter (band-stop) removes power-line interference from ECG signals. Implemented as a 2nd-order IIR notch biquad.
- **Crossover in a speaker system:** A 3rd-order Butterworth low-pass sends bass to the woofer, the complementary high-pass sends treble to the tweeter.

---

## The Fix

Use a proper windowed-FIR for offline use, or a biquad IIR for real-time use. Here is a causal, real-time Butterworth low-pass as cascaded second-order sections (SOS / biquad):

```javascript
// Second-order section (biquad) filter — Direct Form II Transposed
class BiquadFilter {
  constructor(b0, b1, b2, a1, a2) {
    this.b0 = b0; this.b1 = b1; this.b2 = b2;
    this.a1 = a1; this.a2 = a2;
    this.s1 = 0; this.s2 = 0; // state variables
  }
  process(x) {
    const y = this.b0 * x + this.s1;
    this.s1 = this.b1 * x - this.a1 * y + this.s2;
    this.s2 = this.b2 * x - this.a2 * y;
    return y;
  }
  reset() { this.s1 = 0; this.s2 = 0; }
}

// Design 4th-order Butterworth low-pass via two cascaded biquads
// cutoffHz: desired -3dB frequency; sampleRate: samples per second
function butterworth4LowPass(cutoffHz, sampleRate) {
  const wc = 2 * Math.PI * cutoffHz / sampleRate;
  // Pre-warped analog cutoff (bilinear transform)
  const Wc = 2 * sampleRate * Math.tan(wc / 2);

  // 4th-order Butterworth: two 2nd-order sections
  // Analog pole angles for N=4: π/8, 3π/8 (complex conjugate pairs)
  const angles = [Math.PI / 8, 3 * Math.PI / 8];
  return angles.map(theta => {
    // Analog prototype poles at ±j·e^{jθ}: s = Wc·e^{j(π/2 + θ)}
    const sigma = -Wc * Math.sin(theta); // real part of analog pole
    const omegaD = Wc * Math.cos(theta);  // imag part
    // Bilinear transform: map analog 2nd-order section to digital biquad
    const k = 2 * sampleRate;
    const D = k * k - 2 * sigma * k + sigma * sigma + omegaD * omegaD;
    const b0 = Wc * Wc / D;
    const b1 = 2 * b0;
    const b2 = b0;
    const a1 = (2 * (sigma * sigma + omegaD * omegaD - k * k)) / D;
    const a2 = (k * k + 2 * sigma * k + sigma * sigma + omegaD * omegaD) / D;
    return new BiquadFilter(b0, b1, b2, a1, a2);
  });
}

// Usage: filter signal sample by sample
const stages = butterworth4LowPass(1000, 44100);
function filterSample(x) {
  return stages.reduce((sig, bq) => bq.process(sig), x);
}
```

No ringing, no non-causality. The filter processes samples one at a time in O(1) per sample — suitable for audio plugins, embedded DSPs, and Web Audio processing nodes.

---

## The Wow Moment — Push It

**Demo: Real-time graphic equalizer with live frequency response display.**

The canvas shows four panels simultaneously:
1. **Raw noisy signal** (top): white noise + 440 Hz tone + a 60 Hz hum
2. **Filtered signal** (second): the filter output, updating in real time
3. **Frequency response plot** (third): magnitude $|H(e^{j\omega})|$ in dB vs. frequency, updating as you move the sliders
4. **Spectrogram** (bottom): running waterfall plot showing frequency content over time

Add four band-pass filters in parallel (100 Hz, 500 Hz, 2 kHz, 8 kHz), each with an adjustable gain slider — a 4-band parametric EQ. As you drag gain sliders, the frequency response plot reshapes in real time. Boost 440 Hz, mute everything else. The single pure tone emerges from the noise like a whistle through wind. Crank all four bands: raw chaos. Cut all bands: silence.

Then switch to a *guitar riff* audio file and apply the EQ live. Boost 100 Hz: thumping, muddy bass. Cut 100 Hz, boost 2 kHz: sharp, cutting, telephone-quality. This makes the math tangible — you are sculpting sound with difference equations.

---

## The Interactive Demo

The viewer gets a full-screen canvas split into four quadrants with these controls:

- **Filter type** (dropdown): Low-Pass | High-Pass | Band-Pass | Band-Stop (Notch) | Parametric EQ
- **Filter family** (dropdown): FIR Windowed-Sinc | Butterworth IIR | Chebyshev I IIR | Chebyshev II IIR | Elliptic IIR
- **Filter order** (slider, 1–12): Updates frequency response plot live. Shows increasing steepness and increasing group-delay nonlinearity.
- **Cutoff frequency** (slider, 20 Hz–20 kHz, logarithmic): Moves the filter knee left/right on the frequency response plot.
- **Ripple (for Chebyshev/Elliptic)** (slider, 0.1–3 dB): Shows the passband ripple grow as ripple tolerance increases, with corresponding steeper stopband roll-off.
- **FIR tap count** (slider, 11–511, odd numbers): Shows latency (group delay = M/2 samples) and transition width both scaling inversely.
- **Window function** (dropdown, visible when FIR selected): Rectangular | Hann | Blackman | Kaiser. Updates frequency response side-lobe level live.
- **Input signal** (dropdown): White noise | 440 Hz + hum | Chirp | Microphone | Guitar riff audio file
- **Show impulse response** (toggle): Renders $h[n]$ in a side panel. Click to send an impulse into the filter and watch the tail decay.
- **Show pole-zero plot** (toggle): Renders unit circle with poles (×) and zeros (○) of the Z-transform. Poles near unit circle → high gain at that frequency. Zeros on unit circle → exact null.

---

## Production Notes

**Code structure:**
- `fft.js`: FFT/IFFT for the brickwall naive demo and frequency response computation
- `filters.js`: `BiquadFilter` class, `designFIR_LowPass/HighPass/BandPass()`, `butterworth4LowPass()`, `chebyshevIIR()`, cascaded SOS framework
- `frequencyResponse.js`: Computes $H(e^{j\omega})$ by evaluating the transfer function at 1024 points on the unit circle
- `main.js`: Canvas layout, animation loop, Web Audio API for real-time audio

**Visual layout:**
- Dark charcoal background (#1a1a2e)
- Frequency response plot: x-axis log scale 20 Hz–20 kHz (matches human hearing), y-axis −80 dB to +10 dB; passband region shaded green, stopband shaded red, transition band yellow
- Pole-zero plot: unit circle in white, poles as red ×, zeros as blue ○; stability circle clearly labelled
- Real-time signal: scrolling waveform, 2 seconds of history

**Key cinematic moments:**
1. (0:50) Brickwall filter output with Gibbs ringing — freeze-frame, zoom in on the oscillations, label "RINGING: The ghost of sinc(t)"
2. (3:40) Reveal the sinc impulse response extending backwards in time: "This filter is a time machine. It needs future data."
3. (5:10) Swap from rectangular window to Blackman window on the FIR: side lobes instantly drop from −13 dB to −74 dB on the frequency response plot — dramatic visual transformation
4. (6:50) Butterworth frequency response as order increases from 1 to 10: the curve sharpens from a gentle slope to a near-vertical wall. "Order 1: barely a suggestion of a filter. Order 10: surgical."
5. (9:00) Pole-zero plot: move a pole close to the unit circle and watch the frequency response spike at that frequency — intuitive connection between Z-plane geometry and frequency shaping

**Equations to render on canvas:**
- $y[n] = \sum b_k x[n-k] - \sum a_k y[n-k]$ (difference equation)
- $H(z) = \frac{B(z)}{A(z)} = \frac{b_0 + b_1 z^{-1} + b_2 z^{-2}}{1 + a_1 z^{-1} + a_2 z^{-2}}$ (transfer function)
- $|H_a(j\Omega)|^2 = \frac{1}{1 + (\Omega/\Omega_c)^{2N}}$ (Butterworth magnitude)

---

## Tags
`digital-filter` `IIR` `FIR` `butterworth` `signal-processing` `convolution` `frequency-response` `canvas`

---

## Thumbnail

Dark background. Left side: a noisy jagged waveform in white, chaotic and ugly. Center: a large funnel shape rendered in bright orange, labelled "FILTER" — wide end receiving the noise, narrow end outputting. Right side: a clean smooth sine wave in electric blue. Below the funnel: "LOW-PASS | HIGH-PASS | BAND-PASS" in small white text. Title at top in large bold font: "BUILDING A SIGNAL FILTER" with subtitle "from scratch in JavaScript" in yellow.
