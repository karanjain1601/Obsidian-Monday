---
title: "Audio Captioning & Retrieval"
aliases: [Audio Captioning, CLAP, Audio-Text Retrieval, WavCaps, AudioCaps, Zero-Shot Audio]
tags: [audio-captioning, CLAP, contrastive-learning, audio-text-retrieval, AudioCaps, zero-shot]
domain: Audio and Speech
difficulty: Advanced
created: 2026-07-27
related: ["[[Audio_Tagging_Weak_Supervision]]", "[[Environmental_Sound_Classification]]", "[[_MOC_Audio_Foundation_Models]]", "[[_MOC_Audio_Classification]]"]
status: complete
---

# 🔍 Audio Captioning & Retrieval

> [!tldr] TL;DR
> Audio captioning generates free-text descriptions of audio events ("A dog barks while rain falls"), while audio-text retrieval and CLAP (Contrastive Language-Audio Pretraining) train a dual-encoder that aligns audio and language in a shared embedding space — enabling zero-shot audio classification by comparing audio embeddings to text label embeddings.

## Intuition

CLAP is to audio what CLIP is to images: just as CLIP can classify a photo as "a cat" by measuring cosine similarity between the image embedding and the text embedding of "a cat," CLAP can classify an audio clip as "car horn" without ever having seen a car-horn training example — just by encoding the text "the sound of a car horn" and comparing it to the audio embedding. The key is training the encoders with InfoNCE loss on millions of aligned audio-caption pairs, pulling matching pairs together and pushing mismatches apart. This language grounding enables flexible zero-shot querying: any text description, however specific, becomes a valid classifier.

## Mermaid Diagram

```mermaid
flowchart TB
    subgraph Training: InfoNCE Contrastive
        A1[Audio Clip] --> B1[Audio Encoder\nHT-SAT / PANN-CNN]
        A2[Caption Text] --> B2[Text Encoder\nRoBERTa / BERT]
        B1 --> C1[Audio Embedding a\nd-dim L2 normalized]
        B2 --> C2[Text Embedding t\nd-dim L2 normalized]
        C1 & C2 --> D[Similarity Matrix\nS = a · t^T / τ]
        D --> E[InfoNCE Loss\nmax diagonal of S]
    end
    subgraph Inference: Zero-Shot Classification
        F[New Audio] --> G[Audio Encoder]
        G --> H[Audio Embedding]
        I["dog bark"\n"car horn"\n"thunder"] --> J[Text Encoder]
        J --> K[Label Embeddings]
        H & K --> L[argmax cosine sim\n→ Predicted Class]
    end
    style E fill:#ffd3b6
    style L fill:#a8d8ea
```

## Key Concepts

### Datasets for Audio Captioning

| Dataset | Clips | Captions per Clip | Source | Domain |
|---------|-------|-------------------|--------|--------|
| AudioCaps | 46k | 1 (train), 5 (test) | AudioSet clips | General sounds |
| Clotho | 4981 | 5 | Freesound | Environmental, nature |
| WavCaps | 400k+ | 1 (LLM-refined) | AudioSet, SoundBible, BBC, FreeSound | General (large scale) |
| Sound descriptions | ~830k | Auto-generated | LAION-CLAP | Varied |

AudioCaps is the standard captioning benchmark; Clotho has higher caption quality (crowdsourced with stricter guidelines). WavCaps is the large-scale pretraining set built by LLM-refining noisy captions.

### Audio Captioning: Encoder-Decoder

Standard architecture:

```
Audio → Encoder (CNN/Transformer) → Pooled embeddings
                                         ↓
                               Cross-attention (Transformer decoder)
                                         ↓
Text prompt → Text Embedding → Token-by-token generation
                                         ↓
                               "A dog barks while rain falls"
```

```python
import torch
from transformers import AutoProcessor, AutoModelForCausalLM

# Example: DCASE-style captioning with pretrained model
# (Illustrative — uses a hypothetical audio-LM pipeline)
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import librosa

# Audio captioning with encoder-decoder (e.g., Whisper-style for sounds)
class AudioCaptioner(torch.nn.Module):
    def __init__(self, audio_encoder, text_decoder, d_model=768):
        super().__init__()
        self.audio_enc = audio_encoder    # e.g., CNN14 or HTSAT
        self.proj = torch.nn.Linear(d_model, d_model)
        self.decoder = text_decoder       # e.g., GPT-2 / T5
    
    def forward(self, waveform, input_ids=None):
        audio_feats = self.audio_enc(waveform)        # (B, T, d)
        audio_feats = self.proj(audio_feats)           # project to decoder dim
        # Teacher-forcing: condition decoder on audio_feats
        return self.decoder(
            encoder_hidden_states=audio_feats,
            input_ids=input_ids
        )
```

### Captioning Metrics

| Metric | Full Name | What It Measures |
|--------|-----------|-----------------|
| CIDEr | Consensus-based Image Description Evaluation | TF-IDF weighted n-gram consensus |
| METEOR | Metric for Evaluation of Translation with Explicit ORdering | Unigram F-measure + alignment |
| SPICE | Semantic Propositional Image Caption Evaluation | Scene graph similarity |
| FENSE | — | BERTScore + fluency penalty |
| SPIDEr | SPICE + CIDEr | Combines semantic + lexical |

### CLAP: Contrastive Language-Audio Pretraining

CLAP aligns audio and text embeddings via InfoNCE loss:

$$\mathcal{L}_{\text{InfoNCE}} = -\frac{1}{N} \sum_{i=1}^{N} \log \frac{\exp(\mathbf{a}_i \cdot \mathbf{t}_i / \tau)}{\sum_{j=1}^{N} \exp(\mathbf{a}_i \cdot \mathbf{t}_j / \tau)}$$

where $\tau$ is a learnable temperature parameter, $\mathbf{a}_i$ and $\mathbf{t}_i$ are L2-normalised audio and text embeddings for matching pair $i$.

```python
# CLAP zero-shot audio classification using LAION CLAP
from transformers import ClapModel, ClapProcessor
import librosa, torch, numpy as np

model = ClapModel.from_pretrained("laion/clap-htsat-unfused")
processor = ClapProcessor.from_pretrained("laion/clap-htsat-unfused")
model.eval()

# Load audio
y, sr = librosa.load("event.wav", sr=48000, mono=True)

# Define candidate labels
labels = ["dog barking", "car horn", "thunder and rain",
          "crowd cheering", "baby crying"]

# Encode audio
audio_inputs = processor(audios=y, sampling_rate=48000, return_tensors="pt")
text_inputs  = processor(text=labels, return_tensors="pt", padding=True)

with torch.no_grad():
    audio_emb = model.get_audio_features(**audio_inputs)  # (1, 512)
    text_emb  = model.get_text_features(**text_inputs)     # (5, 512)

# Normalise and compute cosine similarities
audio_emb = audio_emb / audio_emb.norm(dim=-1, keepdim=True)
text_emb  = text_emb  / text_emb.norm(dim=-1, keepdim=True)
similarities = (audio_emb @ text_emb.T).squeeze(0)        # (5,)

probs = similarities.softmax(dim=-1).numpy()
for label, prob in zip(labels, probs):
    print(f"{label:30s}: {prob:.3f}")
```

### CLAP Architecture Variants

| Variant | Audio Encoder | Text Encoder | mAP (AudioSet) | ZS-ESC50 |
|---------|--------------|-------------|---------------|---------|
| LAION-CLAP (PANN) | CNN14 | RoBERTa | — | ~83% |
| LAION-CLAP (HTSAT) | HTSAT Swin-T | RoBERTa | ~0.26 | ~91% |
| MS-CLAP | HTSAT | BERT | ~0.29 | ~93% |
| CLAP (DCASE 2023) | CNN14 | BERT | — | ~89% |

### Audio-Text Retrieval

The same CLAP model supports bidirectional retrieval:

- **Audio → Text**: given an audio clip, retrieve the most relevant caption
- **Text → Audio**: given a text query, retrieve the most relevant audio clip

Metric: **Recall@K** — fraction of queries for which the correct match appears in the top-K results.

$$R@K = \frac{1}{N} \sum_{i=1}^N \mathbb{1}[\text{rank}_i \leq K]$$

Typical results on AudioCaps test set for CLAP (HTSAT):

| Metric | Text→Audio | Audio→Text |
|--------|-----------|-----------|
| R@1 | ~36% | ~42% |
| R@5 | ~72% | ~76% |
| R@10 | ~83% | ~87% |

### Audio Question Answering (AQA)

Extends VQA (Visual Question Answering) to audio:

- **Input**: audio clip + natural language question
- **Output**: free-form or multiple-choice answer
- **Datasets**: ClothoAQA, AudioQA, AIR-Bench
- **Models**: combine CLAP-style audio encoder with an LLM decoder (GPT-4, LLaMA)

```python
# Conceptual AudioQA pipeline
audio_emb = clap_audio_encoder(waveform)     # (1, 512)
query_emb  = llm_text_encoder(question)       # (1, 512)
# Cross-attention or concatenate → LLM decoder
answer = llm_decoder(
    context=audio_emb,
    question=query_emb
)
```

### Captioning vs Tagging vs Zero-Shot: CLAP's Role

| Task | Input | Output | CLAP Usage |
|------|-------|--------|-----------|
| Audio tagging | Audio | Fixed 527-class labels | Pretrained audio encoder (frozen) |
| Audio captioning | Audio | Free-form text | Audio encoder + text decoder |
| Zero-shot classification | Audio + text labels | Closest label | Full CLAP similarity |
| Audio retrieval | Query (audio/text) | Ranked list | Embedding cosine similarity |
| AQA | Audio + question | Answer text | CLAP encoder + LLM |

## Real-World Notes

- **WavCaps quality**: LLM-refined captions from BBC/SoundBible are more descriptive than raw AudioSet labels — this is a key reason why large-scale weak-caption pretraining works.
- **Temperature $\tau$**: CLAP trains $\tau$ as a learnable parameter (initialized ~0.07, similar to CLIP). Lower $\tau$ = sharper distribution = harder negatives.
- **Language bias**: CLAP text encoders (BERT/RoBERTa) encode semantic meaning, so label text like "the sound of a dog barking" outperforms just "dog" as a zero-shot prompt.

## Common Pitfalls

- **Zero-shot prompt engineering**: "dog" vs "dog barking" vs "sound of a dog bark" give different similarity scores — the choice of label text matters significantly for zero-shot performance.
- **Audio-side normalisation**: CLAP audio features must be L2-normalised before cosine similarity; the raw model outputs are not normalised by default.
- **Retrieval vs classification**: retrieval R@K is not the same as classification accuracy — a model can have high R@1 retrieval but low accuracy on a 527-way classification.
- **Caption length**: CIDEr rewards n-gram overlap with reference captions — very short or very long generated captions are penalised even if semantically correct.

## Related Concepts

- [[Audio_Tagging_Weak_Supervision]] — PANN / BEATs used as CLAP audio encoders
- [[Environmental_Sound_Classification]] — CLAP enables zero-shot ESC without AudioSet fine-tuning
- [[_MOC_Audio_Foundation_Models]] — CLAP, AudioPaLM, and audio LLMs

## Review Questions

1. Formulate the InfoNCE loss for a batch of $N$ audio-caption pairs. Explain why maximising the diagonal of the similarity matrix is equivalent to learning a joint embedding space.
2. CLAP achieves zero-shot ESC-50 accuracy of ~91% without ever training on ESC-50 labels. Trace the exact inference steps from raw audio to a class prediction.
3. Explain the difference between audio-text retrieval R@1 and zero-shot classification accuracy. Give a scenario where a model has high R@1 but low classification accuracy, and vice versa.

## Sources

- Elizalde, B. et al. (2022). CLAP: Learning Audio Concepts from Natural Language Supervision. *ICASSP 2023*.
- Kim, M. et al. (2023). Large-Scale Contrastive Language-Audio Pretraining with Feature Fusion and Keyword-to-Caption Augmentation. *ICASSP 2023*.
- Mei, X. et al. (2023). WavCaps: A ChatGPT-Assisted Weakly-Labelled Audio Captioning Dataset. *arXiv:2303.17395*.
- Kim, C. et al. (2023). Prefix Tuning for Automated Audio Captioning. *ICASSP*.

#audio-captioning #CLAP #contrastive-learning #audio-text-retrieval #AudioCaps #zero-shot #WavCaps #InfoNCE
