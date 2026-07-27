---
title: "Multimodal Audio-Language Models: LLMs That Can Hear and Speak"
aliases: [Audio LLMs, AudioPaLM, Qwen-Audio, WavLLM, Speech LLMs, Audio-Language Models]
tags: [audio, llm, multimodal, audiopalm, qwen-audio, gemini, speech-to-speech, instruction-following]
domain: Audio and Speech
difficulty: Advanced
created: 2026-07-27
related: ["[[Wav2Vec2_HuBERT]]", "[[AudioLM]]", "[[CLAP_and_Audio_Language]]", "[[_MOC_NLP_Master]]", "[[_MOC_Audio_Foundation_Models]]"]
status: complete
---

# Multimodal Audio-Language Models: LLMs That Can Hear and Speak

> [!tldr] TL;DR
> Audio-language models combine audio encoders (or codec tokenisers) with large language models to enable joint reasoning over speech, music, and sound alongside text — enabling ASR, translation, audio QA, music description, and speech-to-speech dialogue within a single model, without separate ASR/TTS pipelines.

---

## Intuition

Imagine a universal translator that doesn't just convert words — it understands context, tone, environment, and meaning all at once. Traditional pipelines chain ASR → NLP → TTS, where each stage discards information (prosody, speaker identity, background context). Audio-language models collapse this pipeline: the LLM directly "reads" audio tokens alongside text, reasons over both, and can output either text or audio. Think of it as giving a language model ears and, optionally, a voice — the same reasoning engine that handles text now handles the full richness of auditory experience.

---

## Mermaid Diagram

```mermaid
flowchart TD
    subgraph Approach1["Approach 1: Discrete Tokens"]
        AW1[Audio\nWaveform] --> CODEC[Audio Codec\nEnCodec / SoundStream\nRVQ tokens]
        CODEC --> MERGE1[Merged token sequence\ntext + audio tokens]
        MERGE1 --> LLM1[LLM\nsame vocabulary\nextended with audio tokens]
        LLM1 --> OUT1[Text or\naudio token output]
    end

    subgraph Approach2["Approach 2: Continuous Embeddings"]
        AW2[Audio\nWaveform] --> ENC[Audio Encoder\nWhisper / HuBERT\ncontinuous features]
        ENC --> PROJ[Projection Layer\nMLP or Q-Former\n→ LLM dimension]
        PROJ --> MERGE2[LLM context\ntext + audio embeddings]
        MERGE2 --> LLM2[LLM\ntext vocabulary only]
        LLM2 --> OUT2[Text output\n(or TTS post-hoc)]
    end

    subgraph Models["Example Models"]
        LLM1 -.->|Discrete| VALLE[VALL-E\nCodec LM TTS]
        LLM1 -.->|Discrete| APALM[AudioPaLM\nSpeech-to-speech]
        LLM2 -.->|Continuous| QWEN[Qwen-Audio\nMulti-task audio QA]
        LLM2 -.->|Continuous| GEMINI[Gemini 1.5\nNative audio input]
        LLM2 -.->|Continuous| WAVLLM[WavLLM\nSpeech understanding]
    end

    style Approach1 fill:#1a3a5c,color:#fff
    style Approach2 fill:#1a4a2a,color:#fff
    style Models fill:#3a1a00,color:#fff
```

---

## Key Concepts

### Two Architectural Paradigms

**Paradigm 1 — Discrete Tokens (codec-based):**

Audio is encoded via a neural codec (EnCodec/SoundStream) into discrete token IDs, which are appended to the LLM vocabulary. The LLM operates on a single unified token stream:

$$\text{Input: } [t_1, t_2, \ldots, t_\text{text}, a_1, a_2, \ldots, a_\text{audio}]$$

- Pro: End-to-end, can output audio tokens directly (no separate TTS)
- Con: Audio vocab size explosion; token sequence much longer

**Paradigm 2 — Continuous Embeddings (encoder-projection):**

A pretrained audio encoder produces continuous frame-level features, a projection layer aligns them to the LLM's embedding dimension, and they are concatenated with text token embeddings as the LLM's context:

$$\text{Input embeddings: } [\mathbf{e}_{t_1}, \ldots, \mathbf{e}_{t_n}, \mathbf{P}(\mathbf{h}_{a_1}), \ldots, \mathbf{P}(\mathbf{h}_{a_T})]$$

where $\mathbf{P}$ is the projection layer and $\mathbf{h}_{a_t}$ are audio encoder features.

- Pro: Leverages strong pretrained audio encoders; no vocab extension
- Con: Output is text only; speech output requires a separate TTS model

---

### AudioPaLM (Google, 2023)

AudioPaLM combines the AudioLM framework with PaLM-2 for **speech-to-speech translation** without explicit ASR or TTS stages.

Architecture:
- Audio tokens: w2v-BERT semantic + SoundStream acoustic (AudioLM tokenisation)
- Text tokens: standard BPE tokens
- Joint LLM: PaLM-2 with shared embedding space

Training tasks (multitask fine-tuning):
| Task | Input | Output |
|------|-------|--------|
| ASR | Audio tokens | Text tokens |
| TTS | Text tokens | Audio tokens |
| S2ST | Source audio | Target audio |
| S2TT | Source audio | Translated text |
| T2ST | Source text | Target audio |

Key result: **S2ST without text pivot** — translates spoken English to spoken French while preserving the **original speaker's voice characteristics** in the translated output.

$$\mathcal{L}_\text{joint} = \sum_{\tau \in \text{tasks}} \lambda_\tau \cdot \mathcal{L}_\text{CE}^\tau$$

---

### Qwen-Audio (Alibaba, 2023)

Architecture: **Whisper encoder** + **Qwen-7B LLM** + MLP projection:

$$\mathbf{H}_\text{audio} = \text{WhisperEncoder}(X_\text{audio}) \in \mathbb{R}^{T \times 1280}$$
$$\mathbf{Z}_\text{audio} = \text{MLP}(\mathbf{H}_\text{audio}) \in \mathbb{R}^{T \times d_\text{LLM}}$$

Multi-task training on a curated mixture of 30+ datasets:

| Task Category | Example Datasets | Number |
|---------------|-----------------|--------|
| ASR | LibriSpeech, Aishell, Common Voice | 8 |
| S2T Translation | CoVoST2, FLEURS | 5 |
| Audio QA | ClothoQA, AudioCaps QA | 4 |
| Music | MusicCaps, Song Describer | 3 |
| Sound Classification | AudioSet, ESC-50 | 4 |
| Vocal Sound | VocalSound | 1 |

**Qwen-Audio-Chat:** fine-tuned with instruction following data for multi-turn dialogue. Can answer: "What instrument is playing in this clip, and what key is it in?"

---

### Gemini 1.5+ Native Audio

Gemini 1.5 Pro supports **native interleaved audio-text input**:
- Audio is sampled at 16kHz, tokenised internally at 25 tokens/second
- No separate audio encoder stack — the multimodal tokeniser is trained jointly
- Context window up to 1M tokens → can process ~10 hours of audio
- Tasks: long-form audio summarisation, multi-speaker diarisation + transcription, audio question answering

---

### Speech-to-Speech LLMs: Moshi (Kyutai, 2024)

Moshi is a real-time speech-to-speech model designed for **conversational AI**:

- Simultaneous listening and speaking (full-duplex, no turn-taking)
- Architecture: Mimi codec (RVQ) + Helium-7B LLM (derived from Mistral)
- **Inner monologue stream:** separate text token stream running in parallel to audio, enabling speech-aware reasoning
- Latency: 200ms (desktop GPU), enables real-time dialogue

$$p(\text{speech}_t, \text{thought}_t \mid \text{speech}_{<t}, \text{thought}_{<t}, \text{audio\_in}_{<t})$$

---

### Evaluation Benchmarks

| Task | Metric | Key Benchmarks |
|------|--------|----------------|
| ASR | WER | LibriSpeech, Common Voice, Fleurs |
| S2T Translation | BLEU, COMET | CoVoST2, FLEURS |
| Audio QA | Accuracy, BLEU | ClothoQA, AIR-Bench |
| Music Description | CIDEr, SPICE | MusicCaps |
| Speech QA | Accuracy | Dynamic-SUPERB, AudioBench |
| Overall | Average rank | AIR-Bench (14 tasks) |

---

### Inference Code: Qwen-Audio

```python
from transformers import AutoProcessor, Qwen2AudioForConditionalGeneration
import librosa
import torch

model_id = "Qwen/Qwen2-Audio-7B-Instruct"
processor = AutoProcessor.from_pretrained(model_id)
model = Qwen2AudioForConditionalGeneration.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)

# Load audio (16kHz)
audio, sr = librosa.load("sample.wav", sr=processor.feature_extractor.sampling_rate)

# Build multimodal conversation
conversation = [
    {
        "role": "user",
        "content": [
            {"type": "audio", "audio_url": "sample.wav"},
            {"type": "text", "text": "Describe the sounds you hear, identify any music, and transcribe any speech."}
        ]
    }
]

# Process inputs
text = processor.apply_chat_template(conversation, add_generation_prompt=True, tokenize=False)
inputs = processor(
    text=text,
    audios=[audio],
    return_tensors="pt",
    sampling_rate=processor.feature_extractor.sampling_rate
).to(model.device)

# Generate
with torch.no_grad():
    output_ids = model.generate(
        **inputs,
        max_new_tokens=512,
        do_sample=True,
        temperature=0.7,
        top_p=0.9,
    )

# Decode (skip input tokens)
n_input = inputs["input_ids"].shape[1]
response = processor.decode(output_ids[0, n_input:], skip_special_tokens=True)
print(response)
```

---

### Audio-Language Model Comparison

| Model | Org | Year | Audio Input | Audio Output | Key Tasks | Scale |
|-------|-----|------|------------|--------------|-----------|-------|
| AudioPaLM | Google | 2023 | Discrete (w2v-BERT + SoundStream) | Audio + text | S2ST, ASR, TTS | PaLM-2 (540B) |
| LTU | MITU | 2023 | Continuous (AST features) | Text only | Audio QA, classification | LLaMA-7B |
| WavLLM | MSRA | 2024 | Continuous (Whisper+HuBERT) | Text only | ASR, QA, translation | LLaMA-7B |
| **Qwen-Audio** | Alibaba | 2023 | Continuous (Whisper-large) | Text only | Multi-task | Qwen-7B |
| Qwen2-Audio | Alibaba | 2024 | Continuous (Whisper-large-v2) | Text only | Multi-task + chat | Qwen2-7B |
| Gemini 1.5 Pro | Google | 2024 | Native (internal) | Text only | Long-form, multi-speaker | Gemini (undisclosed) |
| Moshi | Kyutai | 2024 | Discrete (Mimi codec) | Audio + text | Real-time dialogue | Helium-7B |
| dGSLM | Meta | 2022 | Continuous + acoustic | Audio | Spoken dialogue | 2× GPT-2 |

---

## Real-World Notes

- **Continuous embeddings dominate current open models** because they can reuse high-quality pretrained audio encoders (Whisper) without extending the LLM vocabulary.
- **Hallucination risk is amplified** in audio-LLMs: the LLM may confabulate transcriptions or sound descriptions when audio quality is low — always validate with a specialised model for critical applications.
- **Multi-turn audio chat** (Qwen-Audio-Chat, Gemini) requires careful handling of audio context: the model cannot re-listen to prior audio, so important audio details must be carried in text summaries across turns.

---

## Common Pitfalls

- **Audio encoder freeze vs fine-tune:** Freezing the Whisper encoder speeds training but limits adaptation to non-speech audio. Fine-tuning with a lower LR ($10^{-5}$) for the encoder and higher ($10^{-4}$) for the LLM typically works best.
- **Sequence length explosion:** At 25 tokens/sec, 60 seconds of audio = 1500 tokens. Combined with a system prompt + instruction, this quickly approaches context limits. Use Q-Former (as in BLIP-2) to compress audio features to a fixed number of query tokens.
- **Task interference:** Multitask training can cause negative transfer between very different tasks (e.g., music description vs ASR). Task-specific prefixes and careful data mixing ratios are essential.
- **Output audio quality:** Discrete-token models (AudioPaLM) depend on codec quality for output audio. Codec artifacts at low bitrates are clearly perceptible.

---

## Related Concepts

- [[Wav2Vec2_HuBERT]] — HuBERT/Whisper provide the audio encoders in most continuous-embedding LLMs
- [[AudioLM]] — AudioPaLM directly extends AudioLM tokenisation to a joint LLM
- [[CLAP_and_Audio_Language]] — CLAP embeddings used in some models (LTU) as audio features
- [[AudioCraft_MusicGen]] — MusicGen-style codec LMs share discrete-token paradigm with AudioPaLM
- [[_MOC_NLP_Master]] — Transformer LLM architectures, instruction fine-tuning, RLHF

---

## Review Questions

1. Compare the **discrete-token** and **continuous-embedding** approaches for audio-LLMs. For each, describe one task where it has a clear advantage over the other and explain why.
2. AudioPaLM can translate speech while preserving the speaker's voice without an explicit speaker encoder. What property of the codec tokenisation makes this possible?
3. Moshi supports **full-duplex** (simultaneous listen+speak) dialogue. Why is this fundamentally different from turn-based speech LLMs, and what architectural choice enables it? What challenges does full-duplex introduce compared to turn-based approaches?

---

## Sources

- Rubenstein et al., "AudioPaLM: A Large Language Model That Can Speak and Listen," arXiv:2306.12925 (2023)
- Chu et al., "Qwen-Audio: Advancing Universal Audio Understanding via Unified Large-Scale Audio-Language Models," arXiv:2311.07919 (2023)
- Défossez et al., "Moshi: a speech-text foundation model for real-time dialogue," arXiv:2410.00037 (2024)
- Team et al., "Gemini 1.5: Unlocking multimodal understanding across millions of tokens of context," arXiv:2403.05530 (2024)
- Ma et al., "WavLLM: Towards Robust and Adaptive Speech Large Language Model," arXiv:2404.00656 (2024)
- AIR-Bench: https://huggingface.co/spaces/AIR-Bench/leaderboard

#audio #llm #multimodal #audiopalm #qwen-audio #gemini #moshi #speech-to-speech #instruction-following #foundation-models
