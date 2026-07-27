---
title: "Music Source Separation"
aliases: [Music Demixing, Stem Separation, Demucs, Open-Unmix, Spleeter]
tags: [source-separation, music-demixing, Demucs, UMX, MUSDB18, SDR, U-Net, NMF]
domain: Audio and Speech
difficulty: Advanced
created: 2026-07-27
related: ["[[Music_Classification_MIR]]", "[[_MOC_Audio_Signal_Processing]]", "[[_MOC_Audio_Classification]]"]
status: complete
---

# 🥁 Music Source Separation

> [!tldr] TL;DR
> Music source separation decomposes a mixed recording into isolated stems (vocals, drums, bass, other), measured by Signal-to-Distortion Ratio (SDR). Demucs v4 — a hybrid model operating simultaneously in the waveform and spectrogram domains with Transformers — achieves SDR ~8.7 dB on vocals, far above classical NMF baselines.

## Intuition

Think of a mixed music track as a photograph where multiple transparent overlays have been blended together — each overlay is one instrument. Separation is like deblending those overlays. In the spectrogram domain, each source tends to occupy different time-frequency (TF) bins — drums are broadband and transient, bass is concentrated at low frequencies, vocals are mid-frequency and have pitch-linked harmonics. A **mask** at each TF bin selects how much of the mixture energy to attribute to each source. The challenge is that when two sources share a TF bin (overlap), any mask will introduce distortion — a fundamental limit called the "ideal binary mask" ceiling.

## Mermaid Diagram

```mermaid
flowchart LR
    A[Mixture x\nwaveform] --> B[STFT\nX = |X|e^jφ]
    B --> C[Magnitude Spectrogram |X|]
    C --> D[U-Net Encoder\nDownsample × 4]
    D --> E[Bottleneck\nBLSTM / Transformer]
    E --> F[U-Net Decoder\nUpsample × 4\nSkip Connections]
    F --> G[Soft Mask M_s\n∈ 0,1 per TF bin]
    G --> H[Apply Mask\nŜ_s = M_s ⊙ X]
    H --> I[Wiener Filter\nrefinement]
    I --> J[iSTFT → Stem s]
    B --> H
    style D fill:#ffd3b6
    style F fill:#ffd3b6
    style G fill:#a8d8ea
```

## Key Concepts

### MUSDB18 Dataset & SDR Metric

MUSDB18: 150 professionally recorded tracks (100 train, 50 test), each with 4 separated stems.

$$\text{SDR} = 10 \log_{10} \frac{\|s_{\text{target}}\|^2}{\|e_{\text{interf}} + e_{\text{noise}} + e_{\text{artif}}\|^2} \quad \text{[dB]}$$

Higher SDR = better separation. Computed per stem, per track, then median across tracks.

| Stem | Role | Frequency Range |
|------|------|----------------|
| Vocals | Lead + backing vocals | 200 Hz – 5 kHz |
| Drums | Full kit | Broadband transient |
| Bass | Bass guitar / synth bass | 40 – 400 Hz |
| Other | Guitar, keys, misc | Mid/high band |

### Classical Approach: NMF

Non-negative Matrix Factorization approximates the magnitude spectrogram as a product of non-negative bases and activations:

$$|X| \approx WH, \quad W \in \mathbb{R}^{F \times K}_{\geq 0},\; H \in \mathbb{R}^{K \times T}_{\geq 0}$$

Multiplicative update rules:

$$W \leftarrow W \odot \frac{|X|H^\top}{WHH^\top}, \quad H \leftarrow H \odot \frac{W^\top|X|}{W^\top WH}$$

Each column of $W$ is a spectral template; columns of $H$ are the corresponding activations. Separate sources by clustering templates. NMF achieves SDR ~4–5 dB vocals.

### U-Net Mask Estimation

The U-Net encoder-decoder with skip connections from the STFT magnitude:

```python
import torch, torch.nn as nn, torchaudio

class SeparationUNet(nn.Module):
    def __init__(self, n_sources=4, n_fft=4096):
        super().__init__()
        self.stft = torchaudio.transforms.Spectrogram(
            n_fft=n_fft, hop_length=n_fft//4, power=None)  # complex
        # Encoder
        self.enc1 = self._conv_block(2, 16)    # stereo input
        self.enc2 = self._conv_block(16, 32)
        self.enc3 = self._conv_block(32, 64)
        self.enc4 = self._conv_block(64, 128)
        # Bottleneck
        self.bottleneck = nn.LSTM(128, 256, batch_first=True, bidirectional=True)
        # Decoder + masks
        self.dec4 = self._conv_block(256 + 128, 64)
        self.dec3 = self._conv_block(64  + 64,  32)
        self.dec2 = self._conv_block(32  + 32,  16)
        self.mask_head = nn.Conv2d(16, n_sources * 2, 1)  # ×2 for stereo

    def _conv_block(self, in_c, out_c):
        return nn.Sequential(
            nn.Conv2d(in_c, out_c, 3, padding=1),
            nn.BatchNorm2d(out_c), nn.ReLU(),
            nn.Conv2d(out_c, out_c, 3, padding=1),
            nn.BatchNorm2d(out_c), nn.ReLU())

    def forward(self, mixture):       # (B, 2, T)
        X = self.stft(mixture)        # (B, 2, F, T) complex
        mag = X.abs()
        # ... encode/decode/mask
        masks = torch.sigmoid(self.mask_head(...))   # (B, 4×2, F, T)
        return masks * mag
```

**Mask types**:
- **IBM (Ideal Binary Mask)**: $M_s[f,t] = \mathbb{1}[\text{SNR}_s(f,t) > 0]$ — oracle upper bound, SDR ~12 dB
- **IRM (Ideal Ratio Mask)**: $M_s[f,t] = \frac{|S_s[f,t]|}{\sum_{s'} |S_{s'}[f,t]|}$ — soft version
- **cIRM (Complex IRM)**: operates on complex STFT, retains phase

### Open-Unmix (UMX)

Open-Unmix (2019) is a reference open-source baseline: BLSTM + dense layers in the spectrogram domain.

$$\hat{S}_s = \sigma\left( W_3 \cdot \text{BN}\left(\text{BLSTM}\left( W_1 \cdot \text{BN}(\text{STFT}(x)) + b_1 \right)\right) + b_3 \right) \odot |X|$$

- Architecture: FC(4096) → BN → BLSTM(1024) → BN → BLSTM(1024) → BN → FC(4096) → BN → mask
- Train one model per stem (4 models total)
- SDR: vocals ~5.7 dB, drums ~6.3 dB, bass ~6.3 dB

### Demucs v4 (Hybrid)

Demucs v4 (Meta/Facebook) operates simultaneously in two domains:

```
Hybrid Domain:
  Time-domain branch:  Waveform → Encoder → Decoder (skip connections)
  Spectral branch:     STFT → 2D U-Net → iSTFT
  Fusion: learned weighted combination of both branches
  + Transformer bottleneck (4-layer cross-attention)
```

Loss function combines time-domain $\ell_1$ and frequency-domain $\ell_1$:

$$\mathcal{L} = \underbrace{\|s - \hat{s}\|_1}_{\text{waveform}} + \lambda \sum_{\text{scales}} \underbrace{\||\text{STFT}(s)| - |\text{STFT}(\hat{s})|\|_1}_{\text{multi-scale spectral}}$$

```python
# Demucs v4 inference
import torch
from demucs.pretrained import get_model
from demucs.apply import apply_model

model = get_model('htdemucs')   # HTDemucs: Hybrid Transformer Demucs
model.eval()

wav, sr = torchaudio.load('song.mp3')
wav = wav.unsqueeze(0)          # (1, 2, T)

with torch.no_grad():
    sources = apply_model(model, wav, shifts=1, split=True)
# sources shape: (1, 4, 2, T) — [vocals, drums, bass, other]

drums  = sources[0, 1]   # (2, T)
vocals = sources[0, 0]   # (2, T)
torchaudio.save('vocals.wav', vocals, sr)
```

### SDR Comparison Table

| Model | Vocals | Drums | Bass | Other | Avg |
|-------|--------|-------|------|-------|-----|
| NMF baseline | 4.1 | 3.8 | 3.1 | 2.9 | 3.5 |
| Open-Unmix (UMX) | 5.7 | 6.3 | 6.3 | 4.7 | 5.7 |
| Demucs v3 | 7.3 | 7.6 | 7.4 | 5.7 | 7.0 |
| Demucs v4 (HTDemucs) | **8.7** | **9.0** | **8.8** | **7.2** | **8.4** |

### Wiener Filter Post-Processing

After mask estimation, Wiener filtering sharpens the separation:

$$\hat{S}_s[f,t] = \frac{|\hat{S}_s[f,t]|^2}{\sum_{s'} |\hat{S}_{s'}[f,t]|^2} \cdot X[f,t]$$

This optimal linear filter is equivalent to MMSE estimation under Gaussian priors, and reduces musical noise artifacts introduced by hard masking.

## Real-World Notes

- **Spleeter (Spotify)**: fast U-Net with 2/4/5-stem models, designed for CPU inference — SDR ~6.4 dB vocals but 100× faster than Demucs.
- **MDX Challenge (Music Demixing)**: annual competition with hidden test sets and leaderboard.
- **Karaoke applications**: vocal removal has been a commercial application since the 1990s; modern models are consumer-grade.
- **Stem remixing**: separated stems from legacy mono/stereo masters (before multitrack was preserved) enable remastering classic recordings.

## Common Pitfalls

- **Phase reconstruction**: U-Nets that only output magnitude masks must reuse the mixture phase (`iSTFT(mask * |X| * e^{j∠X})`) — this introduces phase errors. Complex-domain models or overlap-add avoid this.
- **SDR saturation**: very high SDR (>12 dB) on clean test tracks doesn't reflect performance on live or compressed audio.
- **Leakage in MUSDB18**: some MUSDB18 tracks have deliberate reverb/bleeding between stems — the "ideal" ceiling is below 20 dB SDR.
- **Stereo vs mono**: separation is significantly easier in stereo due to panning cues (ILD/ITD) — ensure your evaluation matches your deployment scenario.

## Related Concepts

- [[Music_Classification_MIR]] — per-stem analysis enables better MIR
- [[_MOC_Audio_Signal_Processing]] — STFT, masking, Wiener filter fundamentals
- [[Audio_Tagging_Weak_Supervision]] — source-separated stems can be tagged individually

## Review Questions

1. Explain the "ideal binary mask" (IBM). Why does it represent an oracle upper bound rather than an achievable system? What is the SDR ceiling for IBM on MUSDB18?
2. Demucs v4 uses both a waveform branch and a spectral branch in parallel. What complementary information does each branch capture that motivates combining them?
3. Wiener filtering is applied *after* deep mask estimation. Formulate the Wiener filter for a two-source mixture and explain why it outperforms the raw deep mask.

## Sources

- Défossez, A. et al. (2019). Music Source Separation in the Waveform Domain. *arXiv:1911.13254*.
- Défossez, A. (2021). Hybrid Spectrogram and Waveform Source Separation. *ISMIR Workshop*.
- Rouard, S. et al. (2023). Hybrid Transformers for Music Source Separation. *ICASSP*.
- Stoter, F.-R. et al. (2019). Open-Unmix — A Reference Implementation for Music Source Separation. *JOSS*.

#source-separation #music-demixing #Demucs #UMX #MUSDB18 #SDR #U-Net #NMF #Spleeter
