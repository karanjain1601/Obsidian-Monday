---
title: "TTS Fundamentals: Pipeline, G2P, and Vocoders"
aliases: [TTS Pipeline, Text-to-Speech Basics, G2P Phonemes, Speech Synthesis Fundamentals]
tags: [tts, speech-synthesis, g2p, phonemes, vocoder, arpabet, mos]
domain: Audio and Speech
difficulty: Beginner
created: 2026-07-27
related: ["[[Tacotron_and_Neural_TTS]]", "[[FastSpeech_and_Vocoders]]", "[[_MOC_Audio_Signal_Processing]]", "[[_MOC_TTS]]"]
status: complete
---

# 🔤 TTS Fundamentals: Pipeline, G2P, and Vocoders

> [!tldr] TL;DR
> Text-to-speech converts written text into audio through a sequential pipeline of text normalization, phoneme conversion, acoustic modelling, and waveform synthesis. Understanding this pipeline is the foundation for every neural TTS system built on top of it.

---

## Intuition

Imagine a human reading aloud: you first understand what the words mean (text normalization — "Feb 14" is "February fourteenth"), then you recall how each word sounds (grapheme-to-phoneme), then your vocal tract shapes the air into specific frequencies (acoustic model), and finally the sound travels as physical waves (vocoder). Modern TTS mirrors this sequence — each stage was historically a separate engineered component, and neural TTS progressively collapsed these stages into end-to-end learned systems.

---

## Mermaid Diagram

```mermaid
flowchart LR
    A["📝 Raw Text\n'Call me at 5pm Feb 14'"]
    B["🔡 Text Normalization\n'Call me at five PM February fourteenth'"]
    C["🔤 G2P\nK AE1 L M IY0 AE1 T ..."]
    D["🎵 Acoustic Model\nMel Spectrogram"]
    E["🔊 Vocoder\nWaveform @ 22kHz"]
    F["🎧 Audio Output"]

    A --> B --> C --> D --> E --> F

    style A fill:#2d3748,color:#e2e8f0
    style D fill:#1a365d,color:#bee3f8
    style F fill:#1c4532,color:#c6f6d5
```

---

## Key Concepts

### Text Normalization
Raw text contains symbols, numbers, abbreviations, and dates that have context-dependent pronunciations.

| Input | Normalized Output |
|-------|------------------|
| `$4.99` | "four dollars and ninety-nine cents" |
| `Feb 14` | "February fourteenth" |
| `Dr. Smith` | "Doctor Smith" |
| `USB` | "U S B" (letter-by-letter) or "usb" |
| `10km` | "ten kilometers" |

Rule-based systems (regex + lookup tables) handle most cases. Ambiguity (e.g., "Dr." = Doctor or Drive?) requires context — modern systems use neural classifiers.

### Grapheme-to-Phoneme (G2P)

G2P maps written characters (graphemes) to pronunciation units (phonemes). English is notoriously irregular:

$$\text{"read"} \rightarrow \begin{cases} \text{R IY1 D} & \text{(present tense)} \\ \text{R EH1 D} & \text{(past tense)} \end{cases}$$

**CMU Pronouncing Dictionary** covers ~130,000 words. Unknown words require a learned G2P model (seq2seq or neural).

**ARPAbet** (US English, 39 phonemes):

| Category | Examples |
|----------|---------|
| Vowels | AE (cat), IY (feet), AO (bought) |
| Consonants | B, D, F, G, HH, JH, K, L, M, N, P, R, S, T, V, W, Y, Z |
| Fricatives | SH (shoe), ZH (vision), TH (thin), DH (the) |
| Affricates | CH (church), JH (judge) |

**IPA** is language-agnostic and preferred for multilingual systems.

### Prosody

Prosody encodes the *how* of speech, not just the *what*:

- **Fundamental frequency (F0):** perceived as pitch. Varies ~80–250 Hz for male, 150–350 Hz for female.
- **Duration:** how long each phoneme lasts — stressed syllables are longer.
- **Intensity/Energy:** perceived as loudness. Stressed words are louder.

$$\text{Prosody} = f(F_0, \text{duration}, \text{energy}) \implies \text{Emotion + Emphasis + Rhythm}$$

### Vocoder Types

A vocoder converts an acoustic intermediate representation (mel spectrogram, MGC) into a time-domain waveform.

| Vocoder | Type | Quality | Speed | Notes |
|---------|------|---------|-------|-------|
| Griffin-Lim | Phase estimation | Low | Fast | No learning, phase artifacts |
| WaveNet | Autoregressive | Very High | Slow (real-time×600) | Google, dilated causal conv |
| WaveGlow | Normalizing Flow | High | Fast | NVIDIA, parallel |
| HiFi-GAN | GAN | High | Real-time+ | Meta, MPD+MSD discriminators |
| WaveRNN | Autoregressive RNN | High | Moderate | Efficient dual softmax |

### Traditional TTS Approaches

**Concatenative TTS (Unit Selection):**
- Record large database of speech segments (diphones, triphones)
- At runtime: select and concatenate best-matching units
- Pros: natural within-unit quality. Cons: audible joins, large DB, fixed voice

**Parametric TTS (HTS, STRAIGHT):**
- Train statistical model (HMM or DNN) to predict acoustic parameters (MGC, F0, aperiodicity)
- Pros: compact, flexible. Cons: over-smoothed, buzzy quality
- **Mel-generalized cepstrum (MGC):** compact parameterization of spectral envelope

```python
import numpy as np

def mel_filterbank(n_fft=1024, n_mels=80, sr=22050):
    """Construct mel filterbank matrix."""
    mel_min = 0
    mel_max = 2595 * np.log10(1 + (sr / 2) / 700)
    mel_points = np.linspace(mel_min, mel_max, n_mels + 2)
    hz_points = 700 * (10 ** (mel_points / 2595) - 1)
    bin_points = np.floor((n_fft + 1) * hz_points / sr).astype(int)

    filters = np.zeros((n_mels, n_fft // 2 + 1))
    for m in range(1, n_mels + 1):
        f_m_minus = bin_points[m - 1]
        f_m       = bin_points[m]
        f_m_plus  = bin_points[m + 1]
        for k in range(f_m_minus, f_m):
            filters[m-1, k] = (k - f_m_minus) / (f_m - f_m_minus)
        for k in range(f_m, f_m_plus):
            filters[m-1, k] = (f_m_plus - k) / (f_m_plus - f_m)
    return filters
```

### Text Normalization + G2P in Python

```python
# pip install nltk phonemizer

import re
from num2words import num2words
from phonemizer import phonemize

def normalize_text(text: str) -> str:
    """Basic text normalization: numbers, simple abbreviations."""
    # Expand cardinal numbers
    text = re.sub(
        r'\b(\d+)\b',
        lambda m: num2words(int(m.group(1))),
        text
    )
    # Expand common abbreviations
    abbrevs = {"Dr.": "Doctor", "St.": "Street", "Feb": "February",
               "pm": "P M", "am": "A M", "vs.": "versus"}
    for abbr, expansion in abbrevs.items():
        text = text.replace(abbr, expansion)
    return text

def text_to_phonemes(text: str, lang: str = "en-us") -> str:
    """Convert text to IPA phonemes using espeak backend."""
    normalized = normalize_text(text)
    phonemes = phonemize(
        normalized,
        backend="espeak",
        language=lang,
        with_stress=True
    )
    return phonemes

# Example
raw = "Dr. Smith called at 5pm on Feb 14"
print(normalize_text(raw))
# → "Doctor Smith called at five P M on February fourteen"
print(text_to_phonemes(raw))
# → "dˈɒktə smˈɪθ kˈɔːld æt fˈaɪv pˈiː ˈɛm ɒn fˈɛbɹuˌɛɹi fˈɔːtiːn"
```

### MOS Evaluation

**Mean Opinion Score (MOS):** human raters score audio naturalness on a 1–5 Likert scale.

| Score | Label | Meaning |
|-------|-------|---------|
| 5 | Excellent | Indistinguishable from natural speech |
| 4 | Good | Slight imperfection, barely noticeable |
| 3 | Fair | Slightly annoying imperfection |
| 2 | Poor | Annoying, but not objectionable |
| 1 | Bad | Very annoying, objectionable |

Human speech MOS ≈ 4.5. Modern neural TTS (e.g., VALL-E) can reach ~4.0–4.3.

### TTS Approach Comparison

| Approach | Naturalness | Flexibility | Data Needed | Speed |
|----------|-------------|-------------|-------------|-------|
| Concatenative | High (per-unit) | Low (fixed voice) | Large (hours) | Fast |
| Parametric (HMM/DNN) | Medium | Medium | Moderate | Fast |
| Neural End-to-End (Tacotron) | Very High | High | Moderate | Moderate |
| Non-AR Neural (FastSpeech) | High | High | Moderate | Very Fast |
| Zero-Shot (VALL-E) | Very High | Very High | Massive pretrain | Moderate |

---

## Real-World Notes

- **Production systems** (Google, Amazon Polly, Azure) use neural TTS internally but expose SSML for prosody control.
- **Edge TTS** (mobile/embedded) requires compact vocoders — WaveRNN and lightweight HiFi-GAN variants are common.
- **Multilingual G2P** is solved with language-specific phonemizers or unified IPA models like Epitran.
- Festival TTS (open-source concatenative) is still used in research baselines despite its age.

---

## Common Pitfalls

- **Text normalization failures** cause embarrassing mispronunciations in production ("$0.5B" → "zero point five B dollars" instead of "five hundred million dollars").
- **Out-of-vocabulary words** (proper nouns, new technical terms) break G2P lookup — always fall back to a learned seq2seq G2P.
- **Ignoring prosody** produces flat, robotic output even with a perfect acoustic model — MOS suffers significantly.
- **Griffin-Lim artifacts** are obvious in demos; always use a neural vocoder for any evaluation or demo.

---

## Related Concepts

- [[Tacotron_and_Neural_TTS]] — replaces acoustic model + vocoder with end-to-end neural network
- [[FastSpeech_and_Vocoders]] — deep dive on HiFi-GAN and non-autoregressive acoustic models
- [[_MOC_Audio_Signal_Processing]] — STFT, mel spectrograms, F0 extraction (CREPE, WORLD)
- [[Prosody_and_Expressive_TTS]] — modelling pitch, duration, and emotion explicitly

---

## Review Questions

1. A user says "My TTS reads '3.5km' as 'three point five km'." Which pipeline stage failed, and how would you fix it?
2. Explain why English G2P cannot be solved with a simple lookup table alone.
3. Compare Griffin-Lim and HiFi-GAN vocoders: what fundamental problem does each try to solve, and why does the GAN approach win on perceptual quality?

---

## Sources

- Taylor, P. (2009). *Text-to-Speech Synthesis*. Cambridge University Press.
- Black, A. W., & Lenzo, K. A. (2001). Festival speech synthesis system. CMU.
- Zen, H., Tokuda, K., & Black, A. W. (2009). Statistical parametric speech synthesis. *Speech Communication*.
- Kong, J. et al. (2020). HiFi-GAN. NeurIPS.

#tts #g2p #phonemes #arpabet #vocoder #mos #speech-synthesis
