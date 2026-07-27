---
title: "MOC — Text-to-Speech Synthesis"
aliases: [TTS MOC, Text to Speech Hub, Speech Synthesis Map]
tags: [moc, tts, speech-synthesis, audio-speech]
domain: Audio and Speech
created: 2026-07-27
status: complete
---

# 🗺️ Text-to-Speech Synthesis — Section Hub

> From raw text to natural, expressive human-sounding speech — covering pipelines, neural architectures, voice cloning, and prosody control.

---

## Concept Map

```mermaid
graph TD
    TTS["🔊 Text-to-Speech Synthesis"]

    TTS --> FUND["TTS Fundamentals\nPipeline · G2P · Vocoder"]
    TTS --> TAC["Tacotron & Neural TTS\nEnd-to-End · Attention"]
    TTS --> FAST["FastSpeech & Vocoders\nNon-AR · HiFi-GAN"]
    TTS --> CLONE["Zero-Shot Voice Cloning\nVALL-E · VITS · SV2TTS"]
    TTS --> PROS["Prosody & Expressive TTS\nGST · Reference Encoder"]

    FUND --> G2P["Grapheme-to-Phoneme\nARPAbet · CMU Dict"]
    FUND --> NORM["Text Normalization\nNumbers · Abbrevs · Dates"]
    TAC --> ATTN["Attention Mechanism\nLocation-Sensitive"]
    FAST --> VAR["Variance Adaptor\nPitch · Energy · Duration"]
    CLONE --> LM["Audio LM (VALL-E)\nEnCodec Tokens"]
    PROS --> GST["Global Style Tokens\nStyle Interpolation"]

    classDef moc fill:#2d3748,stroke:#63b3ed,color:#e2e8f0
    classDef note fill:#1a365d,stroke:#4299e1,color:#bee3f8
    classDef concept fill:#1c4532,stroke:#68d391,color:#c6f6d5
    class TTS moc
    class FUND,TAC,FAST,CLONE,PROS note
    class G2P,NORM,ATTN,VAR,LM,GST concept
```

---

## Learning Path

| Step | Note | Difficulty | What You'll Learn |
|------|------|------------|-------------------|
| 1 | [[TTS_Fundamentals]] | Beginner → Intermediate | Pipeline overview, G2P, phonemes, vocoders, MOS |
| 2 | [[Tacotron_and_Neural_TTS]] | Intermediate | End-to-end neural TTS, attention alignment |
| 3 | [[FastSpeech_and_Vocoders]] | Advanced | Non-autoregressive TTS, HiFi-GAN, speed vs quality |
| 4 | [[Prosody_and_Expressive_TTS]] | Advanced | GST, reference encoder, emotional speech |
| 5 | [[Zero_Shot_Voice_Cloning]] | Advanced | VALL-E, VITS, SV2TTS, ethical considerations |

---

## All Notes in This Section

| Note | Topics | Key Models |
|------|--------|------------|
| [[TTS_Fundamentals]] | Pipeline, G2P, ARPAbet, MOS, concatenative vs neural | Festival, HTS, Griffin-Lim |
| [[Tacotron_and_Neural_TTS]] | CBHG encoder, location-sensitive attention, autoregressive mel decoder | Tacotron, Tacotron 2 |
| [[FastSpeech_and_Vocoders]] | Duration predictor, length regulator, MPD/MSD discriminators | FastSpeech 2, HiFi-GAN, WaveGlow |
| [[Zero_Shot_Voice_Cloning]] | Speaker embeddings, EnCodec, in-context learning | VALL-E, VITS, YourTTS, SV2TTS |
| [[Prosody_and_Expressive_TTS]] | F0 modeling, GST, VAE prosody, SSML, emotion TTS | GST-Tacotron, GMVAE-TTS |

---

## 5 Key Questions for This Section

1. What are the stages of a classical TTS pipeline, and which stage does each neural model replace?
2. How does the attention mechanism in Tacotron 2 replace hand-engineered alignment, and what can go wrong?
3. Why is FastSpeech 2 orders of magnitude faster than Tacotron 2, and what quality trade-off does it make?
4. How does VALL-E treat TTS as a language-modeling problem over discrete audio tokens?
5. What is the difference between implicit and explicit prosody modeling, and when does each approach fail?

---

## Related Sections

| Section | Why It Connects |
|---------|----------------|
| [[_MOC_Audio_Signal_Processing]] | Mel spectrograms, F0 extraction, STFT — the signal foundations TTS builds on |
| [[_MOC_ASR]] | ASR converts speech → text; TTS is the inverse. Shared phoneme representations |
| [[_MOC_Speaker_Recognition]] | Voice cloning borrows speaker embedding models from speaker verification |
| [[_MOC_Audio_Foundation_Models]] | VALL-E, Voicebox, and AudioLM are foundation models that include TTS capability |
| [[_MOC_NLP_Master]] | TTS takes NLP text output — dependency parsing, NER, and G2P all depend on language understanding |
| [[_MOC_Audio_Speech_Master]] | Parent vault MOC |

---

#audio-speech #tts #speech-synthesis #section-moc
