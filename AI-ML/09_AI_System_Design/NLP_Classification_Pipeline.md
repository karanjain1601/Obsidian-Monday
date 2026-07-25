---
title: NLP Classification Pipeline
aliases:
  - Text Classification Pipeline
  - BERT Classification
  - NLP Pipeline Design
tags:
  - ai-system-design
  - nlp
  - classification
  - bert
  - transformers
domain: AI-ML
difficulty: Intermediate
created: 2026-07-26
related:
  - "[[BERT]]"
  - "[[HuggingFace_Transformers]]"
  - "[[Classification_Metrics]]"
status: complete
---

# 📝 NLP Classification Pipeline

> [!abstract] TL;DR
> NLP classification assigns a category to text (spam/not-spam, ticket type, sentiment). Modern pipeline: text → tokenize → embed (BERT) or prompt (LLM) → classify. Fine-tuned BERT dominates for multi-class tasks with hundreds of labels; LLM zero/few-shot works for quick prototyping or when labeled data is scarce; traditional ML (TF-IDF + LogReg) is the unbeatable baseline. Per-class F1 is the right evaluation metric.

## Intuition — Analogy First

Think of an email inbox with categories: Work, Personal, Newsletters, Receipts, Spam.

A **keyword-based classifier** (old approach) looks for specific words: if "SALE" and "click here" appear → Newsletters. Simple, but misses context — an email about "SALE of a house" gets miscategorized.

A **BERT classifier** (modern approach) reads the entire email like a human would, understanding that "SALE of a house" in an email from your lawyer is about real estate, not a promotional newsletter. It learned this by reading millions of documents.

The practical question is always: **how much labeled data do you have?** 
- 100 examples per class → fine-tune BERT.
- 10 examples per class → LLM few-shot prompting.
- 0 examples → LLM zero-shot or rule-based baseline.
- 10,000 examples per class → any method works; TF-IDF + LR is the sanity-check baseline.

## How It Works — Mechanics

### Pipeline Stages

```mermaid
graph TD
    A[Raw_Text\nemail_ticket_post] --> B[Preprocessing\nclean_normalize]
    B --> C[Tokenization\nWordPiece_BPE]
    C --> D{Encoding_Strategy}
    D --> E[TF-IDF_Sparse\nbaseline]
    D --> F[BERT_Fine-tuned\nbest_for_enough_data]
    D --> G[LLM_Prompting\nbest_for_few_labels]
    E --> H1[Logistic_Regression]
    F --> H2[Classification_Head\n[CLS]_→_Linear_→_softmax]
    G --> H3[In-context_Learning\nor_parse_JSON_output]
    H1 & H2 & H3 --> I[Raw_Predictions\nclass_probabilities]
    I --> J[Threshold_Tuning\nper-class]
    J --> K[Final_Predictions]
    K --> L[Evaluation\nper-class_F1_confusion_matrix]
```

### Multi-Class vs Multi-Label

- **Multi-class**: each example has exactly one label (spam OR not-spam, not both).
  - Output: softmax over N classes.
  - Loss: cross-entropy.
- **Multi-label**: each example can have multiple labels (a ticket can be "billing" AND "technical" AND "urgent").
  - Output: sigmoid over N labels independently.
  - Loss: binary cross-entropy per label.
  - Threshold: tune per label separately.

### Serving Considerations

| Pattern | When to Use |
|---|---|
| **Real-time (FastAPI)** | Customer-facing: support ticket routing, content moderation |
| **Batch (Airflow)** | Nightly labeling of all new posts, overnight report generation |
| **Streaming (Kafka)** | Real-time content moderation at scale, live feed classification |

### Active Learning for Label Efficiency

Training BERT from scratch for a new classification task requires labeled data. Active learning reduces annotation cost:
1. Train BERT on 100 labeled examples.
2. Run on 10,000 unlabeled examples.
3. Find examples where model is most uncertain (entropy sampling).
4. Send 50 most uncertain to annotators.
5. Add to training set and retrain.
6. Repeat until F1 plateaus.

## Code Demo

### HuggingFace Text Classification Pipeline

```python
from transformers import pipeline

# Zero-shot (no training data needed)
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli",
    device=0,  # GPU
)

text = "I can't log into my account, I've tried 3 times and it keeps saying wrong password"
candidate_labels = ["login_issue", "billing_problem", "product_question", "shipping_delay", "other"]

result = classifier(text, candidate_labels)
print(f"Predicted: {result['labels'][0]} ({result['scores'][0]:.3f})")
# Output: Predicted: login_issue (0.912)
```

### BERT Fine-Tuning for Customer Ticket Classification

```python
from transformers import (AutoTokenizer, AutoModelForSequenceClassification,
                           TrainingArguments, Trainer, DataCollatorWithPadding)
from datasets import Dataset
import pandas as pd
import numpy as np
from sklearn.metrics import f1_score, classification_report
import torch

# Load labeled data
df = pd.read_csv("data/support_tickets_labeled.csv")
# Columns: text, label (0–5)
label2id = {"billing": 0, "login": 1, "shipping": 2, "product": 3, "refund": 4, "other": 5}
id2label = {v: k for k, v in label2id.items()}
n_classes = len(label2id)

# Time-based split
df = df.sort_values("created_at")
split = int(0.8 * len(df))
train_df, val_df = df[:split], df[split:]

# Tokenize
model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)

def tokenize(examples):
    return tokenizer(
        examples["text"],
        max_length=128,
        truncation=True,
        padding=False,  # DataCollator handles padding
    )

train_dataset = Dataset.from_pandas(train_df[["text", "label"]]).map(tokenize, batched=True)
val_dataset = Dataset.from_pandas(val_df[["text", "label"]]).map(tokenize, batched=True)
train_dataset = train_dataset.rename_column("label", "labels")
val_dataset = val_dataset.rename_column("label", "labels")

# Model with classification head
model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    num_labels=n_classes,
    id2label=id2label,
    label2id=label2id,
)

# Metrics
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return {
        "f1_weighted": f1_score(labels, predictions, average="weighted"),
        "f1_macro": f1_score(labels, predictions, average="macro"),
    }

# Training
training_args = TrainingArguments(
    output_dir="checkpoints/ticket_classifier",
    num_train_epochs=5,
    per_device_train_batch_size=32,
    per_device_eval_batch_size=64,
    learning_rate=2e-5,
    weight_decay=0.01,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="f1_weighted",
    fp16=torch.cuda.is_available(),
    warmup_ratio=0.1,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics,
    data_collator=DataCollatorWithPadding(tokenizer),
)

trainer.train()

# Evaluate per-class
preds = trainer.predict(val_dataset)
y_pred = np.argmax(preds.predictions, axis=1)
print(classification_report(val_df["label"], y_pred, target_names=list(label2id.keys())))

# Save
model.save_pretrained("models/ticket_classifier_v1")
tokenizer.save_pretrained("models/ticket_classifier_v1")
```

### LLM-Based Classification for Low-Data Regimes

```python
from anthropic import Anthropic
import json

client = Anthropic()

SYSTEM_PROMPT = """You are a customer support ticket classifier. 
Classify the ticket into exactly one of these categories:
- billing: payment, invoice, subscription, charge, refund
- login: password, account access, authentication, locked out
- shipping: delivery, tracking, late package, address
- product: features, bugs, how-to questions
- other: anything that doesn't fit above

Respond with valid JSON only: {"category": "<category>", "confidence": <0-1>}"""

def classify_ticket(text: str) -> dict:
    """Classify a support ticket using LLM."""
    response = client.messages.create(
        model="claude-haiku-4-5",   # cheapest model for simple classification
        max_tokens=50,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": text}],
    )
    try:
        return json.loads(response.content[0].text)
    except json.JSONDecodeError:
        return {"category": "other", "confidence": 0.0}

# Batch classification
def classify_batch(texts: list[str], batch_size: int = 10) -> list[dict]:
    results = []
    for text in texts:
        results.append(classify_ticket(text))
    return results

# Example
text = "My subscription renewed but I was charged twice this month, please help"
result = classify_ticket(text)
print(f"Category: {result['category']}, Confidence: {result['confidence']}")
# Category: billing, Confidence: 0.97
```

## Real-World Example

**Gmail categories** (Primary, Social, Promotions, Updates, Forums) classify hundreds of billions of emails per day. Their pipeline:
- Feature extraction from email headers, sender reputation, content TF-IDF.
- Gradient boosted model at massive scale.
- User feedback (moving emails to different tabs) retrains the model per-user.

**Zendesk ticket routing** uses BERT fine-tuned on customer-specific ticket data to automatically route tickets to the right support team. Each customer fine-tunes on their own ticket history → domain-specific model.

**Twitter/X content moderation** uses a multi-label classifier (harmful, abusive, spam, adult, political manipulation — all simultaneously) because a single tweet can violate multiple policies. Fine-tuned large language models with human review at the decision boundary.

## Trade-offs

| Approach | Labeled Data Needed | Latency | Cost | Accuracy |
|---|---|---|---|---|
| **Rules + regex** | 0 | <1ms | Low | Low |
| **TF-IDF + LR** | 500+ | <1ms | Low | Moderate |
| **BERT fine-tuned** | 200+ per class | 10–50ms | Medium | High |
| **GPT-4 zero-shot** | 0 | 200–1000ms | High | High |
| **LLM few-shot** | 3–10 per class | 200–1000ms | High | High |
| **LLM fine-tuned** | 50+ | 50–200ms | Medium | Highest |

## When to Use vs Avoid

**Fine-tune BERT when:**
- You have 200+ labeled examples per class.
- Latency requirement is <100ms (BERT >> LLM API calls).
- Cost efficiency at scale matters (LLM APIs are expensive for high volume).
- Proprietary/confidential data can't be sent to LLM API.

**Use LLM prompting when:**
- <50 examples per class (zero/few-shot is better than overfitting BERT).
- Requirements change quickly (update the prompt, not retrain a model).
- Exploratory phase: validating if classification is feasible before investing in labeling.

## Common Pitfalls

1. **Reporting only accuracy**: if 90% of tickets are "billing", a model that predicts "billing" for everything gets 90% accuracy. Always report per-class F1; use macro-F1 for balanced comparison.
2. **Data leakage through text**: if the ticket text contains the label (e.g., "ROUTING: billing — please help") → model learns to look for routing tags. Strip routing metadata before training.
3. **Class imbalance**: 70% "other" and 5% "refund" → model doesn't learn "refund" well. Use class weights or oversample minority classes.
4. **Shuffling time-based data**: if the product was launched in Q3 and tickets change over time, use time-based splits to avoid training on future data.
5. **Not per-class threshold tuning**: for multi-label classification, the default threshold of 0.5 is rarely optimal per class. Tune each class threshold on the validation set.

## Related Concepts

- [[_MOC_AI_System_Design|↑ Section MOC]]

- [[BERT]] — the backbone encoder for fine-tuned classifiers
- [[HuggingFace_Transformers]] — the library that makes BERT fine-tuning practical
- [[Classification_Metrics]] — F1, precision, recall, confusion matrix in detail
- [[Data_Annotation_Strategies]] — labeling strategies for training data
- [[Active_Learning]] — reduce annotation cost for NLP classification

## Review Questions

1. You're tasked with classifying customer support tickets into 8 categories. You have 50 labeled examples per category. Compare fine-tuning BERT vs LLM zero-shot vs TF-IDF+LR on cost, accuracy, and latency. Which would you recommend for a prototype? For production at 1M tickets/day?
2. Your multi-class ticket classifier achieves 91% accuracy, but your operations team says the "refund" category is frequently misclassified. How do you investigate this, and what changes to model training would help?
3. Explain the difference between multi-class and multi-label classification in the context of content moderation. Give an example of why the same piece of content might require multi-label treatment.

## Sources

- "BERT: Pre-training of Deep Bidirectional Transformers" — Devlin et al. (NAACL 2019)
- HuggingFace Transformers Documentation — https://huggingface.co/docs/transformers
- Google AI Blog: "Gmail Categorization with Machine Learning"
- "A Fine-Tuned BERT Model for Text Classification" — Benchmark studies (2023)
- Zendesk Engineering Blog: "How We Built AI-Powered Ticket Routing"

#ai-system-design #nlp #classification #bert #transformers #text-classification #fine-tuning
