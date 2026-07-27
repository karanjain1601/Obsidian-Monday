---
title: "Deep Learning for ASR: DNN-HMM and LAS"
aliases: [DNN-HMM ASR, Listen Attend and Spell, LAS ASR, Deep Acoustic Model]
tags: [asr, dnn-hmm, las, encoder-decoder, attention, speech-recognition, deep-learning]
domain: Audio and Speech
difficulty: Intermediate
created: 2026-07-27
related: ["[[HMM_GMM_ASR]]", "[[CTC_and_Attention_ASR]]", "[[Whisper_Architecture]]", "[[_MOC_ASR]]"]
status: complete
---

# 🧠 Deep Learning for ASR: DNN-HMM and LAS

> [!tldr] TL;DR
> DNN-HMM hybrids replace GMM emission probabilities with a deep neural network while keeping HMM topology, cutting WER by ~30% relative over GMM baselines. LAS (Listen, Attend and Spell) goes further — a fully sequence-to-sequence architecture with attention that eliminates HMMs, pronunciation dictionaries, and forced alignment entirely.

## Intuition

Think of DNN-HMM like renovating a house: you keep the original floor plan (HMM graph and WFST) but rip out the old kitchen appliances (GMM) and install modern ones (DNN). The house still works the same way, just much better. LAS is more like demolishing the house and building a sleek open-plan loft from scratch — no walls, no blueprint, just one big neural network that learns where everything belongs.

Technically, DNN-HMM feeds log-mel filterbank features in a context window into a deep network that predicts posterior probabilities over HMM states. LAS uses a bidirectional LSTM encoder with pyramidal downsampling to compress the audio, then an attention-based LSTM decoder spells out subword tokens one by one.

## Mermaid Diagram

```mermaid
graph TD
    subgraph LAS Architecture
        A[Log-Mel Spectrogram\n80 dims × T frames] --> B[pBiLSTM Encoder\nPyramidal reduction ρ=2]
        B --> C[Encoded States\nT/4 frames]
        C --> D[Location-Sensitive\nAttention]
        D --> E[Context Vector c_t]
        E --> F[LSTM Decoder]
        F --> G[Softmax\nSubword Vocab]
        G --> H[Predicted Token]
        H -->|autoregressive| F
    end

    subgraph DNN-HMM Hybrid
        I[Log-Mel Features\n±5 frame context] --> J[Deep Neural Network\n6-8 hidden layers]
        J --> K[Softmax over\n~7000 CD-phone states]
        K --> L[Scaled Posteriors\n÷ P_prior]
        L --> M[WFST Decoder]
        M --> N[Transcript]
    end
```

## Key Concepts

### DNN-HMM Hybrid Architecture

The DNN replaces the GMM as the emission probability estimator. The network outputs **posterior probabilities** $P(s \mid \mathbf{o}_t)$; to obtain likelihoods for HMM use, they are scaled by the prior:

$$\tilde{b}_s(\mathbf{o}_t) = \frac{P(s \mid \mathbf{o}_t)}{P(s)}$$

**Input features**: 40-dim log-mel filterbanks, concatenated over a context window of $\pm 5$ frames → 40 × 11 = 440-dim input vector.

**Context-Dependent (CD) phones**: ~7,000–9,000 triphone states after decision-tree clustering (Kaldi recipe). The DNN is trained to predict one of these senone labels.

### Cross-Entropy Training (DNN-HMM)

Training requires **forced alignment**: run the existing HMM-GMM system to label each frame with a senone ID, then train the DNN with:

$$\mathcal{L}_{\text{CE}} = -\sum_{t=1}^{T} \log P(\hat{s}_t \mid \mathbf{o}_t; \theta)$$

### Sequence Discriminative Training (sMBR / MPE)

Cross-entropy trains per-frame; sequence training optimises directly for WER:

- **MPE** (Minimum Phone Error): $\mathcal{L}_{\text{MPE}} = -\sum_r A(\hat{W}, W^*) \log P(\hat{W} \mid X)$
- **sMBR** (state-level Minimum Bayes Risk): similar but at the HMM state level
- Requires numerator lattices (correct path) and denominator lattices (all paths)
- Typically yields ~5–10% relative WER reduction over CE training

### LAS: Listen, Attend and Spell

**Encoder — Pyramidal BiLSTM (pBiLSTM)**

Standard BiLSTM outputs at every timestep. Pyramidal reduction concatenates adjacent time steps to halve the sequence length at each layer, making attention tractable over long audio:

$$\mathbf{h}_i^j = \text{BiLSTM}^j\bigl([\mathbf{h}_{2i}^{j-1}; \mathbf{h}_{2i+1}^{j-1}]\bigr)$$

With 3 pBiLSTM layers ($\rho = 2$ each), a 1000-frame utterance becomes 125 encoder states.

**Location-Sensitive Attention**

Extends additive attention to also look at previous attention weights, preventing the decoder from attending to the same region repeatedly:

$$e_{t,u} = \mathbf{w}^\top \tanh\!\left(W_q \mathbf{s}_t + W_k \mathbf{h}_u + W_f * \alpha_{t-1} + b\right)$$

$$\alpha_{t,u} = \frac{\exp(e_{t,u})}{\sum_{u'} \exp(e_{t,u'})}$$

$$\mathbf{c}_t = \sum_u \alpha_{t,u} \mathbf{h}_u$$

**Decoder**

Two-layer LSTM that generates one character/subword token per step:

$$\mathbf{s}_t = \text{LSTM}([\mathbf{y}_{t-1}; \mathbf{c}_{t-1}], \mathbf{s}_{t-1})$$
$$P(y_t \mid y_{<t}, X) = \text{softmax}(W_o [\mathbf{s}_t; \mathbf{c}_t])$$

### Beam Search Decoding

LAS uses beam search at inference. At each step keep the top-$B$ partial hypotheses (typically $B = 8$–$32$). Score: $\log P(y_{1:t} \mid X)$ normalised by length to prevent short-sequence bias.

```python
import torch
import torch.nn as nn

class PyramidalBiLSTM(nn.Module):
    """Pyramidal BiLSTM encoder with stride-2 time reduction."""
    def __init__(self, input_dim=80, hidden_dim=256, num_layers=3):
        super().__init__()
        self.layers = nn.ModuleList()
        in_dim = input_dim
        for i in range(num_layers):
            self.layers.append(
                nn.LSTM(in_dim * (2 if i > 0 else 1),
                        hidden_dim,
                        batch_first=True,
                        bidirectional=True)
            )
            in_dim = hidden_dim * 2  # bidirectional

    def forward(self, x):
        # x: (B, T, F)
        out = x
        for i, lstm in enumerate(self.layers):
            out, _ = lstm(out)          # (B, T, 2*H)
            if i < len(self.layers) - 1:
                # Pyramid: concat adjacent frames, halve time
                T = out.size(1)
                T = T - (T % 2)
                out = out[:, :T, :].view(out.size(0), T // 2, -1)
        return out  # (B, T//(2^(L-1)), 2*H)

class LASDecoder(nn.Module):
    """Simple autoregressive LSTM decoder with additive attention."""
    def __init__(self, vocab_size=1000, embed_dim=256,
                 hidden_dim=512, enc_dim=512):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTMCell(embed_dim + enc_dim, hidden_dim)
        self.attn = nn.Linear(hidden_dim + enc_dim, 1)
        self.out_proj = nn.Linear(hidden_dim + enc_dim, vocab_size)

    def forward(self, enc_out, targets, teacher_forcing=True):
        B, T_enc, _ = enc_out.shape
        T_dec = targets.size(1)
        h = torch.zeros(B, self.lstm.hidden_size).to(enc_out.device)
        c = torch.zeros_like(h)
        logits = []
        for t in range(T_dec):
            # Compute attention
            h_exp = h.unsqueeze(1).expand(-1, T_enc, -1)
            energy = self.attn(torch.cat([h_exp, enc_out], dim=-1)).squeeze(-1)
            alpha = torch.softmax(energy, dim=-1)          # (B, T_enc)
            ctx = (alpha.unsqueeze(-1) * enc_out).sum(1)   # (B, enc_dim)
            # Input: prev token embedding + context
            if teacher_forcing:
                inp = self.embed(targets[:, t])
            h, c = self.lstm(torch.cat([inp, ctx], dim=-1), (h, c))
            logit = self.out_proj(torch.cat([h, ctx], dim=-1))
            logits.append(logit)
        return torch.stack(logits, dim=1)   # (B, T_dec, vocab)
```

## Comparison Table

| Aspect | DNN-HMM Hybrid | CTC | LAS / Seq2Seq | Transformer E2E |
|--------|---------------|-----|---------------|-----------------|
| HMM backbone | Yes | No | No | No |
| Forced alignment | Yes (training) | No | No | No |
| Pronunciation dict | Yes | No | No | No |
| Output unit | Senone | Char / BPE | Char / BPE | Subword |
| Long-range LM | WFST + n-gram | Fusion needed | Built-in attention | Built-in attention |
| Streaming | Yes | Yes | Difficult | With chunking |
| LibriSpeech WER | ~3.5% | ~2.5% | ~2.8% | <2% |

## Real-World Notes

- **ESPnet** and **SpeechBrain** are the main open-source LAS/attention frameworks; **Kaldi** for DNN-HMM.
- LAS struggles with very long utterances (>10 s) due to attention coverage; chunked attention or Transformer encoder mitigates this.
- DNN-HMM is still preferred in low-latency telephony applications because of predictable streaming behaviour.
- Subword BPE units (e.g., SentencePiece 1000-piece vocab) outperform character-level LAS, especially for rare words.

## Common Pitfalls

- **Forgetting to scale DNN posteriors by the prior** in DNN-HMM: raw softmax outputs are posteriors, not likelihoods; divide by $P(s)$ before feeding to WFST.
- **No length normalisation in LAS beam search**: model heavily prefers short hypotheses without length penalty.
- **Attention collapse**: LAS attention sometimes fixates on a single encoder frame; location-sensitive attention and monotonic attention variants reduce this.
- **Insufficient augmentation**: SpecAugment (time masking + frequency masking) is essential for LAS to not overfit on <1000 h of data.

## Related Concepts

- [[HMM_GMM_ASR]] — predecessor architecture; provides forced alignments for DNN-HMM training
- [[CTC_and_Attention_ASR]] — alignment-free alternative to LAS attention
- [[Whisper_Architecture]] — Transformer-based E2E, scales LAS concepts to 680k hours
- [[_MOC_Audio_Signal_Processing]] — log-mel spectrogram, SpecAugment

## Review Questions

1. Why does the DNN-HMM hybrid divide softmax posteriors by the prior $P(s)$, and what goes wrong if you skip this step during WFST decoding?
2. What is the purpose of pyramidal reduction in the LAS encoder, and how many timesteps does a 1000-frame input become after 3 pyramidal layers with $\rho = 2$?
3. Compare cross-entropy training and sMBR sequence discriminative training — what objective does each optimise and why does sMBR generally produce lower WER?

## Sources

- Hinton, G. et al. (2012). "Deep Neural Networks for Acoustic Modeling in Speech Recognition." *IEEE Signal Processing Magazine*.
- Chan, W., Jaitly, N., Le, Q., & Vinyals, O. (2016). "Listen, Attend and Spell." *ICASSP*.
- Chorowski, J. et al. (2015). "Attention-Based Models for Speech Recognition." *NeurIPS*.
- Park, D. S. et al. (2019). "SpecAugment: A Simple Data Augmentation Method for Automatic Speech Recognition." *Interspeech*.

#asr #dnn-hmm #las #encoder-decoder #attention #sequence-to-sequence #speech-recognition
