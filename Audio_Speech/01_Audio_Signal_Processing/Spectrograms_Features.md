---
title: "Spectrograms and Audio Features"
aliases: [Spectrogram, Mel Spectrogram, MFCC, STFT Features, Audio Feature Extraction]
tags: [spectrogram, mel-spectrogram, MFCC, STFT, audio-features, librosa, feature-extraction]
domain: Audio and Speech
difficulty: Intermediate
created: 2026-07-27
related: ["[[Digital_Audio_Fundamentals]]", "[[STFT_and_Windowing]]", "[[Mel_Filterbank_MFCCs]]"]
status: complete
---

# 📊 Spectrograms and Audio Features

> [!tldr] TL;DR
> The Short-Time Fourier Transform (STFT) converts a 1-D waveform into a 2-D time-frequency matrix; applying a mel filterbank and log-compression yields a mel spectrogram, and decorrelating that with a DCT yields MFCCs. This pipeline transforms raw audio into compact perceptual features that power most classical and modern speech/audio systems.

## Intuition

A waveform tells you *how loud* the signal is at each moment but says nothing about *which pitches* are present. A spectrogram is like taking a photo of a piano keyboard at every instant — each column shows which keys are being pressed (frequencies) and how hard (amplitudes) at that moment. The trick is that real audio is not stationary, so we compute a short Fourier transform on overlapping short windows (frames), stacking the results into a 2-D image.

Human ears are not linear: we hear pitch differences more easily at low frequencies. Compressing the frequency axis onto a mel scale mimics the cochlea, giving the model a signal that matches human perception. Applying a log further compresses the dynamic range, mimicking the ear's approximately logarithmic loudness sensitivity. The DCT decorrelates the resulting energies, producing MFCCs — compact coefficients widely used in classical ASR.

## Mermaid Diagram

```mermaid
graph LR
    A["x[n] PCM Waveform"] -->|Frame + Window| B["Overlapping\nFrames"]
    B -->|FFT per Frame| C["Complex STFT\nX[m,k]"]
    C -->|Magnitude| D["|X[m,k]|\nMagnitude Spectrogram"]
    D -->|Square| E["|X[m,k]|²\nPower Spectrogram"]
    E -->|Mel Filterbank\n(40–128 filters)| F["Mel Filterbank\nEnergies"]
    F -->|log| G["Log Mel\nSpectrogram"]
    G -->|DCT| H["MFCCs\n(13–40 coeffs)"]
    H -->|Δ and ΔΔ| I["MFCCs + Delta\n+ Delta-Delta"]
```

## Key Concepts

### Short-Time Fourier Transform (STFT)

The STFT slides a window $w[n]$ of length $N$ over the signal with hop length $H$, computing an FFT at each frame $m$:

$$X[m, k] = \sum_{n=0}^{N-1} x[n + mH]\, w[n]\, e^{-j 2\pi k n / N}$$

- $m$ — frame index (time axis)
- $k$ — frequency bin index, $k \in \{0, 1, \ldots, N/2\}$
- Frequency resolution: $\Delta f = f_s / N$
- Time resolution per frame: $\Delta t = H / f_s$

### Magnitude, Power, and Log Spectrograms

| Name | Formula | Units | Typical Use |
|------|---------|-------|-------------|
| Complex STFT | $X[m,k]$ | complex | Phase reconstruction |
| Magnitude | $\|X[m,k]\|$ | linear amplitude | Griffin-Lim |
| Power | $\|X[m,k]\|^2$ | power | Mel filterbank input |
| Log Power | $10 \log_{10}(\|X\|^2 + \epsilon)$ | dB | Visualisation |
| Log Mel | $\log(M \cdot \|X\|^2)$ | log-power | Deep learning input |

### Mel Scale

The mel scale maps linear frequency to a perceptual scale matching the ear's critical bands:

$$m = 2595 \log_{10}\!\left(1 + \frac{f}{700}\right)$$

Inverse: $f = 700\left(10^{m/2595} - 1\right)$

At 1 kHz, 1 Hz is roughly 1 mel; at 10 kHz, 1 Hz is only ~0.2 mel — the scale dramatically compresses high frequencies.

### Mel Filterbank

A bank of $M$ triangular filters (typically 40–128) spaced equally on the mel scale is applied to the power spectrogram:

$$S_\text{mel}[m, i] = \sum_{k} H_i[k]\, |X[m, k]|^2 \quad i = 1, \ldots, M$$

where $H_i[k]$ is the $i$-th triangular filter response.

### MFCCs

MFCCs are computed by applying the Discrete Cosine Transform (DCT-II) to the log mel spectrogram:

$$c_j = \sum_{i=1}^{M} \log S_\text{mel}[i] \cos\!\left[\frac{\pi j (i - 0.5)}{M}\right] \quad j = 1, \ldots, C$$

Typically $C = 13$ to $C = 40$ coefficients are kept. Coefficient $c_0$ encodes overall energy and is often discarded or kept separately.

### Feature Comparison

| Feature | Dims | Invertible | Perceptual | Typical ML Task |
|---------|------|-----------|-----------|-----------------|
| Raw waveform | 1-D | Yes | No | End-to-end models (wav2vec) |
| Magnitude spectrogram | 2-D (F × T) | Approx. | No | Vocoders, source separation |
| Log mel spectrogram | 2-D (80 × T) | No | Yes | ASR, TTS, classification |
| MFCC | 2-D (13–40 × T) | No | Yes | Classical ASR, speaker ID |

### Complete Python Pipeline

```python
import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt

# ── Load audio ────────────────────────────────────────────────────────────────
y, sr = librosa.load("speech.wav", sr=16000, mono=True)

# ── STFT parameters ───────────────────────────────────────────────────────────
n_fft      = 1024        # FFT size → freq resolution = 16000/1024 ≈ 15.6 Hz
hop_length = 256         # hop size  → time step      = 256/16000  = 16 ms
win_length = n_fft       # window length equals FFT size
n_mels     = 80          # mel filterbank filters
n_mfcc     = 13          # MFCC coefficients

# ── Magnitude & power spectrogram ────────────────────────────────────────────
D          = librosa.stft(y, n_fft=n_fft, hop_length=hop_length,
                          win_length=win_length, window="hann")
mag_spec   = np.abs(D)                            # (n_fft//2+1, T)
power_spec = mag_spec ** 2                        # (n_fft//2+1, T)

# ── Mel spectrogram ───────────────────────────────────────────────────────────
mel_spec   = librosa.feature.melspectrogram(
    y=y, sr=sr,
    n_fft=n_fft, hop_length=hop_length,
    n_mels=n_mels,
    fmin=0.0, fmax=8000.0,
    power=2.0           # power spectrogram before filterbank
)
log_mel    = librosa.power_to_db(mel_spec, ref=np.max)  # (n_mels, T) in dB

# ── MFCCs ─────────────────────────────────────────────────────────────────────
mfccs      = librosa.feature.mfcc(
    y=y, sr=sr,
    n_mfcc=n_mfcc,
    n_fft=n_fft, hop_length=hop_length,
    n_mels=n_mels
)                                                  # (n_mfcc, T)

delta_mfcc  = librosa.feature.delta(mfccs)        # velocity
delta2_mfcc = librosa.feature.delta(mfccs, order=2)  # acceleration
mfcc_full   = np.vstack([mfccs, delta_mfcc, delta2_mfcc])  # (39, T)

# ── Visualise ─────────────────────────────────────────────────────────────────
fig, axes = plt.subplots(3, 1, figsize=(12, 10))

librosa.display.specshow(
    librosa.amplitude_to_db(mag_spec, ref=np.max),
    sr=sr, hop_length=hop_length, x_axis="time", y_axis="hz",
    ax=axes[0], cmap="magma"
)
axes[0].set_title("Magnitude Spectrogram (dB)")

librosa.display.specshow(
    log_mel, sr=sr, hop_length=hop_length,
    x_axis="time", y_axis="mel",
    ax=axes[1], cmap="magma"
)
axes[1].set_title("Log Mel Spectrogram (dB)")

librosa.display.specshow(
    mfccs, sr=sr, hop_length=hop_length,
    x_axis="time", ax=axes[2], cmap="coolwarm"
)
axes[2].set_title("MFCCs (13 coefficients)")

plt.tight_layout()
plt.savefig("features.png", dpi=150)
plt.show()
```

## Real-World Notes

- **n_fft=1024, hop_length=256 at 16 kHz** is the standard speech configuration — 64 ms window, 16 ms hop, 99% overlap.
- **80 mel bins** is the standard for modern deep learning models (Whisper, conformer-based ASR). Classical HMM-GMM systems used 40 bins with 13 MFCCs + deltas.
- Log mel spectrograms should be **mean-variance normalised per utterance** when training neural networks (subtract mean, divide by std across time).
- `librosa.power_to_db` clips the dynamic range to 80 dB by default; for training, use the raw `log(mel + 1e-8)` instead to avoid clipping.
- Whisper uses an 80-bin log mel spectrogram computed with n_fft=400, hop_length=160 at 16 kHz (25 ms window, 10 ms hop).

## Common Pitfalls

- Confusing `n_fft` and `win_length` — `n_fft` determines frequency resolution via zero-padding; `win_length` ≤ `n_fft` is the actual analysis window.
- Using `librosa.feature.melspectrogram` without setting `fmax` — defaults to `sr/2`, which includes ultrasonic bins irrelevant for speech; set `fmax=8000` for 16 kHz speech.
- Treating MFCCs as invertible — the mel filterbank and log are many-to-one; you cannot reconstruct the original waveform from MFCCs.
- Forgetting to add a small epsilon before log: `log(0)` = -∞ causes NaN in training.
- Normalising log-mel with `librosa.power_to_db(ref=np.max)` during training — `np.max` varies per utterance, making batches inconsistent; use a fixed reference instead.

## Related Concepts

- [[Digital_Audio_Fundamentals]] — PCM waveform and sampling theory are prerequisites
- [[STFT_and_Windowing]] — detailed treatment of window functions and spectral leakage
- [[Mel_Filterbank_MFCCs]] — deep-dive into the mel filterbank construction and CMVN

## Review Questions

1. A 1-second audio clip at 16 kHz is processed with n_fft=1024 and hop_length=256. How many frames does the spectrogram have, and what is the frequency resolution?
2. Why does the mel filterbank have wider filters at high frequencies? What perceptual phenomenon does this model?
3. At what point in the MFCC pipeline does information become irretrievably lost, making reconstruction impossible?

## Sources

- Davis, S. & Mermelstein, P. (1980). *Comparison of Parametric Representations for Monosyllabic Word Recognition.* IEEE TASLP.
- McFee, B. et al. (2015). *librosa: Audio and Music Signal Analysis in Python.* SciPy.
- Huang, X., Acero, A., & Hon, H.-W. (2001). *Spoken Language Processing.* Prentice Hall.
- librosa documentation — https://librosa.org/doc/latest/feature.html

#spectrogram #mel-spectrogram #MFCC #STFT #audio-features #librosa #feature-extraction
