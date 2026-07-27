---
title: "Summarization & Machine Translation"
aliases: [Text Summarization, Neural MT, BART, Pegasus, ROUGE, BLEU, Machine Translation, Abstractive Summarization]
tags: [nlp, nlp-tasks, intermediate]
domain: NLP
difficulty: intermediate
created: 2026-07-27
related: [Text_Classification, Question_Answering, Information_Extraction, _MOC_NLP_Tasks]
status: complete
---

# 📝 Summarization & Machine Translation

> [!abstract] TL;DR
> Summarization compresses a long document into a shorter one (extractive = select sentences; abstractive = generate new text). MT maps text in one language to another. Both are sequence-to-sequence tasks: encoder compresses the source, decoder generates the target. Key models: BART and Pegasus for summarization; Helsinki-NLP Opus-MT and NLLB for MT. Evaluation: ROUGE (summarization), BLEU / COMET (MT).

---

## Intuition — analogy FIRST

**Summarization**: A journalist reads a 5,000-word research paper and writes a 150-word abstract. Extractive summarization is like highlighting the three most important sentences. Abstractive summarization is like the journalist writing completely new sentences that capture the core ideas — often more fluent, but riskier (may hallucinate facts).

**Machine Translation**: A human interpreter listens to a speaker in French and produces equivalent sentences in English — preserving meaning, tone, and structure. Modern neural MT does the same, end-to-end, with a Transformer encoder-decoder.

---

## How It Works

```mermaid
graph TD
    subgraph BART_Pretraining["BART Denoising Pretraining"]
        Original["Original Document\n'The bank raised rates...'"]
        Corrupt["Corrupted Document\n(token masking + deletion\n+ sentence permutation)"]
        Encoder["BART Encoder"]
        Decoder["BART Decoder\n(autoregressive)"]
        Reconstruct["Reconstructed Original"]
        Original --> Corrupt --> Encoder --> Decoder --> Reconstruct
    end

    subgraph FineTune["Fine-tuning for Summarization"]
        Article["News Article (source)"] --> BARTFull["BART Encoder-Decoder"]
        BARTFull --> Summary["Generated Summary"]
    end
```

---

## Key Concepts / Details

### Summarization

#### Extractive vs. Abstractive

| Property | Extractive | Abstractive |
|---|---|---|
| Method | Select & copy sentences | Generate new text |
| Faithfulness | High (verbatim) | Risk of hallucination |
| Fluency | May be choppy | More natural |
| Models | TextRank, BertSum | BART, Pegasus, T5, GPT |

#### Extractive Methods
- **TextRank** — graph-based algorithm; sentences are nodes; edges weighted by TF-IDF similarity; PageRank-style importance scoring; unsupervised.
- **BertSum** — inserts `[CLS]` between each sentence; uses BERT representations to score sentence importance; supervised.

#### Abstractive Models
- **BART** (Lewis et al., 2019) — corrupts documents during pretraining (token masking, deletion, text infilling, sentence permutation, document rotation) then trains the decoder to reconstruct the original; fine-tuned on CNN/DailyMail → strong news summarization.
- **Pegasus** (Zhang et al., 2020) — pretraining objective is **Gap Sentence Generation (GSG)**: mask entire sentences most likely to be the summary; designed specifically for summarization; SOTA on most summarization benchmarks.
- **T5** — "summarize: {document}" as a text-to-text task; competitive and flexible.
- **LLM few-shot** — GPT-4 with 2–3 example summaries in the prompt; strong out-of-the-box; expensive at scale.

#### Evaluation Metrics
- **ROUGE-1** — unigram recall/precision/F1 between generated and reference summary.
- **ROUGE-2** — bigram overlap.
- **ROUGE-L** — longest common subsequence (captures fluency and order).
- **BERTScore** — embedding-level similarity; better correlates with human judgments than ROUGE.
- **FactCC / QAFactEval** — faithfulness metrics; detect hallucinated facts.
- **Human eval** — coherence, fluency, conciseness, faithfulness (gold standard).

#### Hallucination in Summarization
- Abstractive models frequently generate facts not in the source (intrinsic hallucination) or contradict the source.
- Mitigation: constrained decoding, faithfulness reward training (RL with FactCC), retrieval-augmented generation.
- Always evaluate faithfulness separately from ROUGE.

#### Long Document Summarization
- Standard BERT/BART: 512–1024 token limit.
- **Longformer Encoder-Decoder (LED)** — sparse + global attention; handles 16k tokens.
- **BigBird** — random + window + global attention; extends to 4k+ tokens.
- Hierarchical approaches: summarize paragraphs → summarize summaries.

#### Key Datasets
| Dataset | Domain | Avg Source | Avg Target |
|---|---|---|---|
| CNN/DailyMail | News | ~800 tokens | ~55 tokens |
| XSum | News (extreme) | ~430 tokens | ~23 tokens |
| arXiv, PubMed | Scientific | ~5,000 tokens | ~220 tokens |
| SAMSum, DialogSum | Dialogue | ~90 utterances | ~20 tokens |

---

### Machine Translation

#### Evolution
1. **Rule-based MT** — hand-crafted grammar rules; brittle.
2. **Phrase-based SMT** (Moses) — statistical alignment; competitive for years.
3. **Neural MT** (seq2seq + attention, 2014) — learned representations; end-to-end.
4. **Transformer MT** — current standard; scales well.

#### Key Models
- **Helsinki-NLP Opus-MT** — 1,000+ language-pair Transformer models on HuggingFace; practical, free.
- **mBART / mT5** — multilingual pretrained seq2seq; fine-tuned for translation.
- **NLLB (No Language Left Behind, Meta, 2022)** — 200 languages; MoE Transformer; huge gains on low-resource languages.
- **M2M-100** — many-to-many MT without English pivot.

#### Evaluation Metrics
- **BLEU** — modified n-gram precision (1–4-grams) + brevity penalty.  
  `BLEU = BP · exp(Σ wₙ · log pₙ)` where `BP = exp(1 − r/c)` if `c < r`.  
  Pros: fast, standard. Cons: insensitive to paraphrase; doesn't capture meaning.
- **chrF** — character n-gram F-score; better for morphologically rich languages.
- **COMET** — neural MT evaluation trained on human quality judgments; correlates best with humans.
- **BERTScore** — cross-lingual semantic similarity.

#### Low-Resource MT Strategies
1. **Multilingual pretraining** (mBART) — transfer from high-resource languages.
2. **Pivoting** — translate via a third language (e.g., Zulu → English → French).
3. **Back-translation** — translate target monolingual data into source; augment training.
4. **Data augmentation** — paraphrase, token substitution.

---

## Real-World Notes

- **ROUGE is gameable** — a model that always outputs the first 3 sentences (lead bias in news) achieves surprisingly high ROUGE-L on CNN/DailyMail; XSum was designed to reduce this bias.
- **BLEU saturation** — modern MT systems score 35–45 BLEU on WMT; improvements are subtle but impactful; use COMET for nuanced evaluation.
- **Faithfulness vs. fluency trade-off** — GPT-4 summaries are fluent but hallucinate details; extractive summaries are faithful but choppy.
- **Low-resource translation**: NLLB dramatically improves quality for African and indigenous languages.

---

## Code Demo

```python
# ── Summarization and Translation with HuggingFace ───────────────────────
from transformers import pipeline

# 1) Abstractive Summarization with BART
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
article = """
OpenAI released GPT-4 in March 2023, a large multimodal model that accepts image and text 
inputs and produces text outputs. Evaluated on a variety of professional and academic benchmarks, 
GPT-4 exhibits human-level performance on various professional exams, including passing a simulated 
bar exam with a score around the top 10% of test takers.
"""
summary = summarizer(article, max_length=60, min_length=20, do_sample=False)
print(summary[0]["summary_text"])

# 2) Summarization with Pegasus
pegasus = pipeline("summarization", model="google/pegasus-xsum")
print(pegasus(article, max_length=50)[0]["summary_text"])

# 3) Machine Translation (English → French)
translator = pipeline("translation_en_to_fr", model="Helsinki-NLP/opus-mt-en-fr")
result = translator("Attention is all you need.")
print(result[0]["translation_text"])  # → "L'attention est tout ce dont vous avez besoin."

# 4) Computing ROUGE score
from rouge_score import rouge_scorer
scorer = rouge_scorer.RougeScorer(["rouge1", "rouge2", "rougeL"], use_stemmer=True)
reference = "GPT-4 is a multimodal model that achieves human-level performance on professional exams."
prediction = summary[0]["summary_text"]
scores = scorer.score(reference, prediction)
for key, val in scores.items():
    print(f"{key}: F={val.fmeasure:.3f}  P={val.precision:.3f}  R={val.recall:.3f}")
```

---

## Benchmark Comparison (CNN/DailyMail ROUGE Scores)

| Model | ROUGE-1 | ROUGE-2 | ROUGE-L | Notes |
|---|---|---|---|---|
| Lead-3 (baseline) | 40.3 | 17.7 | 36.6 | Copy first 3 sentences |
| TextRank | 40.2 | 17.0 | 36.1 | Unsupervised extractive |
| BertSum | 43.3 | 20.0 | 39.6 | Extractive with BERT |
| BART-large | 44.2 | 21.3 | 40.9 | Abstractive; fine-tuned |
| Pegasus-large | 44.2 | 21.5 | 41.1 | Best single model |
| GPT-4 (few-shot) | ~41–43 | ~18–20 | ~38–40 | No fine-tuning; hallucination risk |

---

## Common Pitfalls

- **ROUGE as the only metric** — ROUGE does not measure faithfulness; a summary can score well while hallucinating facts.
- **Ignoring the lead-3 baseline** — many papers beat it only marginally; always include this baseline.
- **BLEU alone for MT** — for low-resource or morphologically rich languages, chrF or COMET give more reliable signals.
- **Using BART without fine-tuning on domain** — a news-pretrained BART summarizes scientific text poorly; always fine-tune on in-domain data.
- **Truncating long documents without thought** — some documents front-load information; others bury the key point mid-document; use hierarchical approaches for long-doc tasks.

---

## Related Concepts

- [[Question_Answering]] — RAG shares the abstractive generation component
- [[Information_Extraction]] — IE outputs can seed abstractive summaries
- [[../04_Transformers/Encoder_Decoder_Architecture]] — backbone for BART, T5, Pegasus
- [[Text_Classification]] — NLI evaluation of faithfulness (entailment of summary by source)

---

## Review Questions

1. What are the four corruption strategies BART uses during pretraining, and how do they prepare it for summarization?
2. Why does Pegasus's GSG objective align better with summarization than BERT's MLM objective?
3. Compute BLEU by hand for: hypothesis "the cat sat on the mat", reference "the cat is on the mat".
4. What is the lead-3 bias in news summarization, and which dataset was designed to mitigate it?
5. Why does ROUGE-L complement ROUGE-1/2 in summarization evaluation?
6. Describe two strategies to improve translation quality for a very low-resource language pair.

---

## Sources

- Lewis et al. (2020). *BART: Denoising Sequence-to-Sequence Pre-training for NLG*. ACL.
- Zhang et al. (2020). *PEGASUS: Pre-training with Extracted Gap-sentences for Abstractive Summarization*. ICML.
- Lin, C.-Y. (2004). *ROUGE: A Package for Automatic Evaluation of Summaries*. ACL.
- Costa-jussà et al. (2022). *No Language Left Behind: Scaling Human-Centered MT*. Meta AI.
- Rei et al. (2020). *COMET: A Neural Framework for MT Evaluation*. EMNLP.

---

#nlp #nlp-tasks #intermediate
