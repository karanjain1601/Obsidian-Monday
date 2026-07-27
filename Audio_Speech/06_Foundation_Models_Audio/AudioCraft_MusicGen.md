---
title: "AudioCraft and MusicGen: Controlled Music and Audio Generation"
aliases: [MusicGen, AudioCraft, AudioGen, MAGNeT, Text-to-Music]
tags: [audio, music-generation, generative, audiocraft, musicgen, encodec, text-to-audio, transformer]
domain: Audio and Speech
difficulty: Advanced
created: 2026-07-27
related: ["[[AudioLM]]", "[[CLAP_and_Audio_Language]]", "[[Multimodal_Audio_Language_Models]]", "[[_MOC_Audio_Foundation_Models]]"]
status: complete
---

# AudioCraft and MusicGen: Controlled Music and Audio Generation

> [!tldr] TL;DR
> AudioCraft (Meta, 2023) is a unified framework containing MusicGen (text/melody-conditioned music), AudioGen (text-conditioned sound effects), and MAGNeT (non-autoregressive fast generation); MusicGen achieves state-of-the-art music generation through a single-stage autoregressive Transformer over EnCodec tokens using a novel **delay pattern** to handle multiple RVQ codebooks.

---

## Intuition

Generating music from text ("an upbeat jazz piano with walking bass line") seems magical, but it follows the same recipe as text generation: represent music as a sequence of discrete tokens and predict each token given context. The hard part is that audio codecs produce **multiple parallel token streams** (one per RVQ level), which an autoregressive model cannot naturally handle. MusicGen's **delay pattern** is a clever trick — stagger the codebook streams in time, then flatten them into a single sequence so one Transformer handles everything. Think of it as reading multiple musical staves simultaneously by skewing them like stairs, then reading diagonally.

---

## Mermaid Diagram

```mermaid
flowchart TD
    subgraph Input["Conditioning Inputs"]
        TXT[Text Description\n"upbeat bossa nova with guitar"] --> T5[T5 Text Encoder\n768-d embeddings]
        MEL[Melody Reference\noptional audio clip] --> CHR[Chroma Feature\nExtraction 12 bins]
        T5 --> COND[Conditioning\nembeddings C]
        CHR --> COND
    end

    subgraph Codec["EnCodec Tokenization"]
        AUD[Training Audio\n24kHz] --> ENC[EnCodec Encoder\n4 codebooks × 50Hz\n= 200 tokens/sec]
        ENC --> CB1[Codebook 1\ncoarse]
        ENC --> CB2[Codebook 2]
        ENC --> CB3[Codebook 3]
        ENC --> CB4[Codebook 4\nfine]
    end

    subgraph Delay["Delay Pattern (flattening)"]
        CB1 --> DP[Delay Pattern\nCBk delayed by k-1 steps\nflattened to 1D sequence]
        CB2 --> DP
        CB3 --> DP
        CB4 --> DP
    end

    subgraph Generation["Autoregressive Transformer"]
        DP --> TRF[Decoder-only Transformer\nK-step lookahead\ncross-attention on COND]
        COND --> TRF
        TRF --> OUT[Generated codec tokens]
    end

    OUT --> DEC[EnCodec Decoder]
    DEC --> WAV[Generated Audio\n24kHz waveform]

    style Input fill:#1a3a5c,color:#fff
    style Codec fill:#3a1a5c,color:#fff
    style Delay fill:#1a4a2a,color:#fff
    style Generation fill:#4a2a00,color:#fff
```

---

## Key Concepts

### EnCodec Token Structure

MusicGen uses EnCodec at 24kHz with 4 RVQ codebooks at 50 Hz frame rate:

$$\text{tokens per second} = K \times F_r = 4 \times 50 = 200 \text{ tokens/sec}$$

For a 30-second clip: $200 \times 30 = 6{,}000$ tokens — manageable for a Transformer.

Each codebook entry is from a vocabulary of size $V = 2048$.

---

### The Delay Pattern

Naive approach: model $K$ parallel sequences with $K$ separate heads or $K$ sequential models. Problem: inter-codebook dependencies are lost or require $K \times$ the compute.

**Delay pattern:** codebook $k$ is delayed by $k-1$ time steps:

| Time step | Stream for CB 1 | Stream for CB 2 | Stream for CB 3 | Stream for CB 4 |
|-----------|-----------------|-----------------|-----------------|-----------------|
| $t=0$ | $c_1^0$ | $\varnothing$ | $\varnothing$ | $\varnothing$ |
| $t=1$ | $c_1^1$ | $c_2^0$ | $\varnothing$ | $\varnothing$ |
| $t=2$ | $c_1^2$ | $c_2^1$ | $c_3^0$ | $\varnothing$ |
| $t=3$ | $c_1^3$ | $c_2^2$ | $c_3^1$ | $c_4^0$ |

All $K$ streams are interleaved into a single flat sequence. One Transformer predicts all codebooks. At inference, $K$ tokens are produced per "real" timestep.

**Objective (cross-entropy summed over codebooks):**

$$\mathcal{L} = -\sum_{k=1}^{K} \sum_{t} \log p_\theta(c_k^t \mid c_{<(k,t)},\, \mathbf{C})$$

where $\mathbf{C}$ is the conditioning embedding and $c_{<(k,t)}$ are all prior tokens in the delay-pattern ordering.

---

### Text Conditioning with T5

Text descriptions are encoded with a frozen **T5-large encoder** (770M parameters):

$$\mathbf{E}_\text{text} = \text{T5Encoder}(\text{tokens})  \in \mathbb{R}^{L \times 768}$$

These embeddings are fed as cross-attention keys/values into every Transformer layer:

$$\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d}}\right)V, \quad K = V = \text{Linear}(\mathbf{E}_\text{text})$$

Classifier-Free Guidance (CFG) with guidance scale $\gamma$:

$$\hat{p}_\theta = (1 + \gamma) \cdot p_\theta(c \mid \mathbf{E}_\text{text}) - \gamma \cdot p_\theta(c \mid \varnothing)$$

---

### Melody Conditioning

A melody reference (any audio clip) is mapped to 12-bin chroma features:

$$\text{Chroma}_t = \sum_{n} |X(n, t)|^2 \cdot \mathbf{1}[n \bmod 12 = \text{pitch class}]$$

Chroma is passed through a small projector and added to the conditioning signal via cross-attention. The model learns to match harmonic content while ignoring timbre of the reference.

---

### MAGNeT: Non-Autoregressive Fast Generation

MAGNeT (Masked Audio Generation via Non-autoregressive Transformers) uses a **masked diffusion-like** approach:

1. All tokens start masked
2. $T$ refinement steps: predict all masked positions, keep top-$p$ confident predictions, re-mask the rest
3. Repeat until all positions filled

$$p(c_k^t) = \text{Transformer}(c_{\text{unmasked}},\, \mathbf{C})$$

**Speed advantage:** ~10x faster than autoregressive MusicGen (parallel decoding). Slight quality trade-off but acceptable for real-time use.

---

### Training Data

| Dataset | Hours | Source | License |
|---------|-------|--------|---------|
| ShutterStock | ~10K h | Licensed music library | Proprietary (licensed) |
| Pond5 | ~10K h | Licensed music library | Proprietary (licensed) |
| Internal eval | 400 | In-house | Proprietary |
| **Total** | **~20K h** | — | All licensed, no copyrighted material |

Training note: audio is segmented to 30-second clips; text descriptions are from metadata tags.

---

### Generation Code Example

```python
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write
import torch

# Load pretrained MusicGen (melody-conditioned, 1.5B parameters)
model = MusicGen.get_pretrained("facebook/musicgen-melody")
model.set_generation_params(duration=10)  # seconds

# Text-conditioned generation
descriptions = [
    "An upbeat bossa nova with nylon guitar and light percussion",
    "Dark ambient electronic with slow-evolving pads",
]
wav = model.generate(descriptions)  # (B, 1, T)

for i, audio in enumerate(wav):
    audio_write(f"output_{i}", audio.cpu(), model.sample_rate,
                strategy="loudness", loudness_compressor=True)

# Melody-conditioned generation
import torchaudio
melody, sr = torchaudio.load("reference_melody.wav")
# Stereo → mono, resample to model's rate
melody = melody.mean(0, keepdim=True)
melody = torchaudio.functional.resample(melody, sr, model.sample_rate)
melody = melody.unsqueeze(0)  # (1, 1, T)

wav_melody = model.generate_with_chroma(
    descriptions=["Orchestral version of this melody"],
    melody_wavs=melody,
    melody_sample_rate=model.sample_rate,
)
audio_write("melody_output", wav_melody[0].cpu(), model.sample_rate)
```

---

### Model Comparison

| System | Year | Conditioning | Architecture | Quality (FAD↓) | Speed |
|--------|------|-------------|--------------|----------------|-------|
| MusicLM | 2023 | Text | 3-stage hierarchical | ~4.0 | Slow |
| Riffusion | 2023 | Text | Stable Diffusion on spectrograms | ~6.5 | Fast |
| **MusicGen (1.5B)** | **2023** | **Text/melody** | **Single-stage AR Transformer** | **~3.8** | **Medium** |
| MAGNeT | 2024 | Text | Non-AR masked Transformer | ~4.5 | Fast (10x) |
| Stable Audio | 2023 | Text+timing | LDM continuous latent | ~3.5 | Fast (GPU) |
| Suno v3 | 2024 | Text | Undisclosed | SOTA (subjective) | Fast |

*FAD = Fréchet Audio Distance on MusicCaps benchmark; lower is better.*

---

## Real-World Notes

- **MusicGen is open source** (weights + code on HuggingFace/GitHub), making it the go-to open music generation model.
- **AudioGen** uses the same architecture but trained on sound effects (Freesound + AudioSet); generates rain, explosions, crowd noise, etc. from text descriptions.
- **Inference memory:** MusicGen-large (3.3B) requires ~16GB VRAM; medium (1.5B) fits in 8GB. Use `musicgen-small` (300M) for CPU inference.

---

## Common Pitfalls

- **Duration limit:** The 24kHz 4-codebook setup generates ~200 tokens/sec. At 2048 context length, max generation is ~10 seconds. Use `model.generate_continuation` for longer pieces.
- **Prompt sensitivity:** MusicGen is sensitive to text prompt phrasing. "jazz with saxophone" vs "saxophone jazz improvisation" can give very different results. Iterative prompting helps.
- **Chroma alignment is approximate:** Melody conditioning matches harmonic content but not melody notes exactly — it's chord/key guidance, not note-for-note transcription.
- **CFG scale tuning:** High CFG ($\gamma > 5$) causes repetitive/over-conditioned output; low ($\gamma < 2$) produces music that ignores the text. $\gamma = 3$ is typically optimal.

---

## Related Concepts

- [[AudioLM]] — architectural ancestor; AudioCraft extends the codec LM paradigm with conditioning
- [[CLAP_and_Audio_Language]] — MusicLM (related) uses MuLan (a CLAP-like embedding) for conditioning
- [[Multimodal_Audio_Language_Models]] — AudioPaLM and music-LLMs integrate MusicGen-style generation
- [[_MOC_TTS]] — EnCodec used in VALL-E for voice cloning TTS

---

## Review Questions

1. Explain why the **delay pattern** enables a single autoregressive Transformer to handle $K$ RVQ codebook streams. What ordering does the Transformer see, and how does this preserve inter-codebook dependencies?
2. Classifier-Free Guidance (CFG) doubles inference cost (two forward passes). Why is it still commonly used in music generation, and at what guidance scale does quality typically peak?
3. Compare MusicGen (autoregressive) vs MAGNeT (masked non-autoregressive) on the axes of: generation speed, quality, controllability mid-generation. When would you prefer each?

---

## Sources

- Copet et al., "Simple and Controllable Music Generation" (MusicGen), NeurIPS 2023. arXiv:2306.05284
- Kreuk et al., "AudioGen: Textually Guided Audio Generation," ICLR 2023. arXiv:2209.15352
- Ziv et al., "MAGNeT: Masked Audio Generation using Non-Autoregressive Transformers," ICML 2024. arXiv:2401.04577
- AudioCraft GitHub: https://github.com/facebookresearch/audiocraft
- Stability AI, "Stable Audio: Fast Timing-Conditioned Latent Audio Diffusion," arXiv:2402.04825

#audio #music-generation #musicgen #audiocraft #encodec #delay-pattern #text-to-music #generative-models #autoregressive
