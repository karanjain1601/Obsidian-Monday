---
title: "AudioLM: Language Modelling for Coherent Audio Generation"
aliases: [AudioLM, Audio Language Modelling, Hierarchical Audio LM, SoundStream]
tags: [audio, generative, language-model, tokenization, rvq, codec, speech, music]
domain: Audio and Speech
difficulty: Advanced
created: 2026-07-27
related: ["[[Wav2Vec2_HuBERT]]", "[[AudioCraft_MusicGen]]", "[[Multimodal_Audio_Language_Models]]", "[[_MOC_TTS]]", "[[_MOC_Audio_Foundation_Models]]"]
status: complete
---

# AudioLM: Language Modelling for Coherent Long-Form Audio

> [!tldr] TL;DR
> AudioLM (Google, 2022) generates coherent long-form audio — speech or music — by **language modelling over hierarchical discrete tokens** without any text conditioning: semantic tokens from w2v-BERT capture high-level structure, while acoustic tokens from SoundStream capture perceptual fidelity, bridged by a three-stage hierarchical LM.

---

## Intuition

Imagine describing a piece of music to someone blind: first you describe the **genre, chord progression, and melodic contour** (high-level structure), then you fill in **instrument timbre, reverb, and dynamics** (perceptual detail). If you tried to describe every audio sample directly, the sequence would be billions of tokens long and lose all coherent structure. AudioLM does exactly this two-level decomposition — but automatically, using two different neural codecs trained for different purposes, then stacking language models to generate them hierarchically.

---

## Mermaid Diagram

```mermaid
flowchart TD
    subgraph Tokenization["Stage 0: Tokenization (offline)"]
        WAV[Input Waveform\n24kHz] --> W2B[w2v-BERT Encoder\n25 Hz semantic tokens\nk=500 cluster IDs]
        WAV --> SS[SoundStream Codec\nRVQ 3 levels × 150 Hz\nacoustic tokens]
        W2B --> ST[Semantic tokens\nz_s ∈ ℤ^T_s]
        SS --> AT[Acoustic tokens\nz_a ∈ ℤ^{3×T_a}]
    end

    subgraph LM["Hierarchical Language Models"]
        ST --> LM1[Stage 1 LM\nModels p(z_s)\nTransformer, k=500 vocab]
        LM1 --> GS[Generated semantic\ntokens ẑ_s]
        GS --> LM2[Stage 2 LM\nModels p(z_a^{1:3,coarse} | ẑ_s)\ncoarse acoustic]
        LM2 --> LM3[Stage 3 LM\nModels p(z_a^{fine} | z_a^{coarse})\nfine acoustic]
    end

    subgraph Decode["Decoding"]
        LM3 --> DEC[SoundStream Decoder\nDetokenize → waveform]
        DEC --> OUT[Generated Audio]
    end

    style Tokenization fill:#1a3a5c,color:#fff
    style LM fill:#1a4a2a,color:#fff
    style Decode fill:#4a2a00,color:#fff
```

---

## Key Concepts

### Why Two Tokenisers?

Audio has two distinct requirements that conflict when using a single tokeniser:

| Requirement | Semantic Tokens | Acoustic Tokens |
|-------------|-----------------|-----------------|
| Purpose | Capture content/structure | Capture perceptual quality |
| Source | w2v-BERT (SSL pretrained) | SoundStream (audio codec) |
| Rate | ~25–50 Hz | 150–600 Hz |
| Vocabulary | 500 cluster IDs | ~1024 per RVQ level |
| Temporal range | Long-range dependencies | Short-range fidelity |

Using only acoustic tokens: LM struggles with long-range coherence (sequences are too long and tokens too local).
Using only semantic tokens: reconstructed audio has poor perceptual quality (too compressed).

---

### SoundStream and Residual Vector Quantization

SoundStream is a neural audio codec using **Residual Vector Quantization (RVQ)**:

Given an audio embedding $e$, RVQ applies $N$ quantization levels iteratively:

$$r_0 = e, \quad q_n = \text{VQ}(r_{n-1}), \quad r_n = r_{n-1} - q_n$$

The final reconstruction uses all levels: $\hat{e} = \sum_{n=1}^{N} q_n$.

$$\mathcal{L}_{\text{RVQ}} = \sum_{n=1}^{N} \left( \|r_{n-1} - \text{sg}(q_n)\|^2 + \beta \| \text{sg}(r_{n-1}) - q_n \|^2 \right)$$

where $\text{sg}(\cdot)$ is the stop-gradient operator and $\beta$ is the commitment loss weight.

**SoundStream specs:**
- 24 kHz input, 3 RVQ levels, 150 Hz frame rate → **1350 tokens/second**
- Bitrate: ~3 kbps (comparable to Opus at same bitrate with better quality)
- Training: adversarial (GAN) + spectral reconstruction + feature matching losses

---

### EnCodec (Meta, 2022): Open-Source Alternative

EnCodec is Meta's open-source RVQ codec, widely used in downstream models (MusicGen, VALL-E):

| Property | SoundStream | EnCodec |
|-----------|-------------|---------|
| Sample rate | 24 kHz | 24 kHz (music), 48 kHz (HQ) |
| RVQ levels | 3 | 4–32 configurable |
| Bitrate range | 3 kbps | 1.5–24 kbps |
| License | Proprietary | MIT open source |
| Usage | AudioLM | MusicGen, VALL-E, Moshi |

---

### Three-Stage Hierarchical Language Model

**Stage 1 — Semantic LM:**
$$p(z_s^{1:T}) = \prod_{t=1}^T p(z_s^t \mid z_s^{<t})$$

Transformer with vocabulary size 500, trained on semantic tokens only.

**Stage 2 — Coarse Acoustic LM:**
$$p(z_a^{\text{coarse},1:T} \mid z_s^{1:T}) = \prod_{t} p(z_a^{\text{coarse},t} \mid z_a^{\text{coarse},<t},\, z_s^{1:T})$$

Cross-attention over the semantic sequence. "Coarse" = first 1–2 RVQ levels.

**Stage 3 — Fine Acoustic LM:**
$$p(z_a^{\text{fine}} \mid z_a^{\text{coarse}}) = \prod_{t} p(z_a^{\text{fine},t} \mid z_a^{\text{fine},<t},\, z_a^{\text{coarse},t})$$

Smaller Transformer; models residual fine-grained detail.

---

### Audio Continuation

Given a 3-second prompt, AudioLM:
1. Tokenises the prompt to both semantic and acoustic tokens
2. Feeds them as prefix to each stage LM
3. Autoregressively generates continuations
4. Decodes acoustic tokens back to waveform via SoundStream

For speech: the continuation preserves the speaker's voice, speaking style, and language/prosody. For piano music: it continues the harmonic and rhythmic structure.

---

### EnCodec Tokenization Code Demo

```python
from encodec import EncodecModel
from encodec.utils import convert_audio
import torchaudio
import torch

# Load EnCodec (24kHz, bandwidth 6kbps → 8 codebooks × 75Hz)
model = EncodecModel.encodec_model_24khz()
model.set_target_bandwidth(6.0)
model.eval()

# Load audio
wav, sr = torchaudio.load("audio.wav")
wav = convert_audio(wav, sr, model.sample_rate, model.channels)
wav = wav.unsqueeze(0)  # (1, C, T)

with torch.no_grad():
    # Encode → list of EncodedFrame (codes shape: (1, n_q, T'))
    encoded_frames = model.encode(wav)
    codes = torch.cat([frame.codes for frame, _ in encoded_frames], dim=-1)
    print(f"Codec codes shape: {codes.shape}")  # e.g., (1, 8, 750) for 10s audio

    # Decode back to waveform
    decoded = model.decode(encoded_frames)
    print(f"Reconstructed shape: {decoded.shape}")  # (1, 1, T)
```

---

### Model Comparison

| Model | Year | Conditioning | Semantic Tokens | Acoustic Codec | Key Output |
|-------|------|-------------|-----------------|----------------|------------|
| AudioLM | 2022 | Prompt audio only | w2v-BERT (500 clusters) | SoundStream | Speech/piano continuation |
| VALL-E | 2023 | Text + speaker 3s | — | EnCodec (8 levels) | TTS with voice cloning |
| AudioGen | 2023 | Text description | — | EnCodec (4 levels) | Sound effects |
| MusicLM | 2023 | Text/melody | MuLan embedding | SoundStream | Music generation |

---

## Real-World Notes

- **AudioLM for TTS:** The key insight from AudioLM inspired VALL-E — use an acoustic codec LM conditioned on speaker prompt for zero-shot TTS.
- **w2v-BERT clusters** approximate phoneme/syllable-level units in speech. In music, they capture approximate chord/harmonic regions.
- **Evaluation:** Audio continuation quality is evaluated with MUSHRA (MUltiple Stimuli with Hidden Reference and Anchor) for music and MOS (Mean Opinion Score) for speech. AudioLM achieves naturalness comparable to ground truth continuations in blind tests.

---

## Common Pitfalls

- **Token rate explosion:** With 3 RVQ levels at 150 Hz, 30 seconds of audio = 13,500 acoustic tokens. Naive LMs cannot handle this; the hierarchical decomposition is essential.
- **Stage misalignment:** If semantic and acoustic token rates differ significantly, cross-attention in Stage 2 must handle different time scales — alignment is handled by upsampling/downsampling.
- **Codec reconstruction ceiling:** Maximum quality is bounded by codec reconstruction quality. At 1kbps, some perceptual detail is irreversibly lost.
- **No text control:** AudioLM cannot be directed ("generate a sad piano piece"). VALL-E and MusicGen address this by adding text/speaker conditioning.

---

## Related Concepts

- [[Wav2Vec2_HuBERT]] — w2v-BERT (used as semantic tokeniser) is a close relative of HuBERT
- [[AudioCraft_MusicGen]] — directly extends AudioLM paradigm with text conditioning + EnCodec
- [[Multimodal_Audio_Language_Models]] — AudioPaLM stacks PaLM over AudioLM-style tokens
- [[_MOC_TTS]] — VALL-E applies codec LM idea specifically to TTS with zero-shot voice cloning

---

## Review Questions

1. Why does AudioLM generate **semantic tokens first** and then acoustic tokens, rather than generating acoustic tokens directly? What failure mode does this hierarchical approach prevent?
2. In the RVQ codec, why are higher-indexed quantization levels called "fine" and lower-indexed levels "coarse"? How does this map to the information hierarchy in audio?
3. AudioLM has no text conditioning. Propose a minimal extension that would allow it to do **speaker-prompted speech continuation** (given a 3-second voice sample, continue in that voice). What changes would be needed?

---

## Sources

- Borsos et al., "AudioLM: A Language Modeling Approach to Audio Generation," TASLP 2023. arXiv:2209.03143
- Zeghidour et al., "SoundStream: An End-to-End Neural Audio Codec," TASLP 2022. arXiv:2107.03312
- Défossez et al., "High Fidelity Neural Audio Compression," TMLR 2023. arXiv:2210.13438 (EnCodec)
- Wang et al., "Neural Codec Language Models are Zero-Shot Text to Speech Synthesizers" (VALL-E). arXiv:2301.02111

#audio #language-model #generative #audio-codec #rvq #soundstream #encodec #semantic-tokens #audiolm
