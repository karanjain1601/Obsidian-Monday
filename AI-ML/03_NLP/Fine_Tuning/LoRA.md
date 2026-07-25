---
title: LoRA — Low-Rank Adaptation
aliases:
  - LoRA
  - Low-Rank Adaptation
  - Low Rank Adaptation
tags:
  - fine-tuning
  - lora
  - peft
  - nlp
  - llm
  - parameter-efficient
domain: AI-ML
difficulty: Advanced
created: 2026-07-26
related:
  - QLoRA
  - PEFT
  - Adapters
  - Full_Fine_Tuning
  - Instruction_Tuning
status: complete
---

# 🔧 LoRA — Low-Rank Adaptation

> [!abstract] TL;DR
> LoRA (Hu et al., 2021) exploits the insight that weight updates during fine-tuning have **low intrinsic rank**. Instead of updating the full weight matrix $W \in \mathbb{R}^{d \times k}$, LoRA injects a low-rank decomposition $\Delta W = BA$ where $B \in \mathbb{R}^{d \times r}$ and $A \in \mathbb{R}^{r \times k}$ with $r \ll d$. Only $A$ and $B$ are trained (~0.1-1% of total parameters). At inference, the adapter can be merged back into the base weights with zero overhead. LoRA enabled fine-tuning 65B LLMs on a single A100 GPU.

---

## Intuition — Analogy First

Imagine a **freshly painted wall** (the pretrained weights $W_0$). You want to change the colour, but repainting the entire wall is expensive (full fine-tuning). Instead, you add a **thin overlay** — a lightweight material that covers the wall without removing the original paint. The overlay captures the new colour with a fraction of the material.

The key insight: you don't need an overlay with the same thickness as the wall. A much thinner layer captures the change you want. That "thinness" is the **low rank** — the change in weights lives in a low-dimensional subspace.

Formally: the **change** in a weight matrix $\Delta W$ during fine-tuning is well-approximated by a product of two small matrices, even when $\Delta W$ itself is large.

---

## How It Works — Mechanics

### The Core Observation

When a pretrained language model is fine-tuned on a downstream task, the weight matrices don't need to change dramatically. The updates $\Delta W$ have **low intrinsic rank** — they live in a small subspace of the full weight space. This was empirically verified by measuring the rank of $\Delta W$ for various tasks: rank 1–4 often suffices.

### LoRA Injection

For a pretrained weight matrix $W_0 \in \mathbb{R}^{d \times k}$, LoRA adds a **bypass path**:

$$h = W_0 x + \Delta W x = W_0 x + B A x$$

Where:
- $W_0$ is **frozen** (no gradients computed)
- $A \in \mathbb{R}^{r \times k}$ is initialised with random Gaussian (random_normal)
- $B \in \mathbb{R}^{d \times r}$ is initialised to **zero** (so $\Delta W = 0$ at the start of training)
- $r$ is the **rank** — the key hyperparameter (typically 4, 8, 16, or 64)

The zero initialisation of $B$ ensures the adapted model starts **identical to the pretrained model** at step 0.

### Scaling Factor

LoRA scales the output by $\frac{\alpha}{r}$:

$$h = W_0 x + \frac{\alpha}{r} B A x$$

$\alpha$ is a scaling hyperparameter (often set to equal $r$, effectively scaling by 1). The purpose: decouple the learning rate from the rank choice.

### Which Layers to Apply LoRA To?

Applied to the **linear projection matrices** in the transformer attention mechanism:
- Query projection: $W_q$
- Key projection: $W_k$
- Value projection: $W_v$
- Output projection: $W_o$

Optionally also applied to FFN layers ($W_1$, $W_2$). The original LoRA paper applied only to $W_q$ and $W_v$; modern practice applies to all 4 attention projections and sometimes FFN.

### Merging for Zero-Overhead Inference

After training, the LoRA matrices can be merged back into the frozen weights:

$$W = W_0 + B A$$

The merged model is **identical to a fully fine-tuned model** in terms of inference compute — no adapter overhead. This is a critical advantage over adapter layers, which add extra computations at inference time.

### Parameter Efficiency Example

For LLaMA-2-7B attention layer ($d=4096, k=4096$):

| Method | Parameters per attention layer |
|---|---|
| Full fine-tuning | 4096 × 4096 = 16.8M |
| LoRA $r=8$ (all 4 projections) | 4 × (4096×8 + 8×4096) = 262K |
| Reduction | **64x fewer parameters** |

---

## The Math

### Modified Forward Pass

$$h = W_0 x + \frac{\alpha}{r} B A x$$

At initialisation: $B = 0$, so $h = W_0 x$ (identical to pretrained model). This is crucial — LoRA training starts from the pretrained model's equilibrium.

### Effective Weight After Merging

$$W_\text{merged} = W_0 + \frac{\alpha}{r} B A \in \mathbb{R}^{d \times k}$$

### Gradient Flow

Gradients only flow through $A$ and $B$:

$$\frac{\partial \mathcal{L}}{\partial A} = \frac{\alpha}{r} B^\top \frac{\partial \mathcal{L}}{\partial h} x^\top$$

$$\frac{\partial \mathcal{L}}{\partial B} = \frac{\alpha}{r} \frac{\partial \mathcal{L}}{\partial h} (A x)^\top$$

No gradients through $W_0$ — it remains frozen.

### Memory Savings

| Component | Full FT | LoRA |
|---|---|---|
| Frozen model params | 0 bytes | 2 bytes/param (bf16, no grad) |
| Trainable params | 4 bytes/param (fp32 grad) | 4 bytes/param (small adapter) |
| Optimizer states | 8 bytes/param | 8 bytes/param (small adapter only) |
| **Total** | **~14 bytes/param** | **~2 bytes/param base + small adapters** |

For a 7B model: Full FT ≈ 98GB; LoRA ≈ 14GB + ~300MB adapters.

---

## Code Demo

### HuggingFace PEFT — LoRA Fine-Tuning

```python
from peft import LoraConfig, get_peft_model, TaskType, PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer
from datasets import load_dataset
import torch

# ── 1. Load base model ──
model_name = "meta-llama/Llama-3.2-3B"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map="auto",
)
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

# ── 2. Define LoRA config ──
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,                              # rank — higher = more capacity, more params
    lora_alpha=32,                     # scaling factor (alpha/r = 2.0)
    lora_dropout=0.05,                 # regularisation on adapter weights
    bias="none",                       # don't adapt bias terms
    target_modules=[                   # which linear layers to inject LoRA into
        "q_proj",
        "k_proj",
        "v_proj",
        "o_proj",
        # "gate_proj", "up_proj", "down_proj",  # FFN layers — uncomment for more capacity
    ],
    init_lora_weights=True,            # B=0 at init (standard)
)

# ── 3. Apply LoRA — wraps model with adapter ──
model = get_peft_model(model, lora_config)

# Inspect parameter counts
model.print_trainable_parameters()
# Output: trainable params: 13,631,488 || all params: 3,226,779,648 || trainable%: 0.4226

# ── 4. Verify architecture ──
print(model)
# Shows: Linear -> lora.Linear with frozen base weight + trainable A, B matrices

# ── 5. Dataset preparation ──
dataset = load_dataset("tatsu-lab/alpaca", split="train")

def format_instruction(example):
    if example["input"]:
        text = (f"### Instruction:\n{example['instruction']}\n\n"
                f"### Input:\n{example['input']}\n\n"
                f"### Response:\n{example['output']}{tokenizer.eos_token}")
    else:
        text = (f"### Instruction:\n{example['instruction']}\n\n"
                f"### Response:\n{example['output']}{tokenizer.eos_token}")

    encoded = tokenizer(text, truncation=True, max_length=512, padding="max_length")
    encoded["labels"] = encoded["input_ids"].copy()
    return encoded

tokenized = dataset.map(format_instruction, remove_columns=dataset.column_names)
split = tokenized.train_test_split(test_size=0.05, seed=42)

# ── 6. Training ──
training_args = TrainingArguments(
    output_dir="./lora_alpaca_checkpoints",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,               # higher than full FT — only adapters trained
    lr_scheduler_type="cosine",
    warmup_ratio=0.03,
    bf16=True,
    logging_steps=50,
    save_strategy="epoch",
    report_to="wandb",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=split["train"],
    eval_dataset=split["test"],
    tokenizer=tokenizer,
)

trainer.train()
model.save_pretrained("./lora_alpaca_adapter")  # saves only adapter weights (~26MB)

# ── 7. Load and use adapter ──
base_model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.bfloat16)
peft_model = PeftModel.from_pretrained(base_model, "./lora_alpaca_adapter")

# ── 8. Merge adapter into base weights (zero inference overhead) ──
merged_model = peft_model.merge_and_unload()
merged_model.save_pretrained("./lora_alpaca_merged")
# Merged model is identical in size and speed to base model

# ── 9. Compare parameter sizes ──
adapter_params = sum(p.numel() for p in peft_model.parameters() if p.requires_grad)
base_params = sum(p.numel() for p in base_model.parameters())
print(f"Adapter: {adapter_params / 1e6:.1f}M params")
print(f"Base model: {base_params / 1e9:.1f}B params")
print(f"Ratio: {adapter_params / base_params * 100:.2f}%")
```

### Rank Sensitivity Experiment

```python
import matplotlib.pyplot as plt

# Compare different LoRA ranks — training the same number of steps
def train_with_rank(r: int, alpha: int, dataset, base_model_name: str) -> float:
    """Train LoRA adapter with given rank, return validation loss."""
    config = LoraConfig(
        r=r,
        lora_alpha=alpha,
        target_modules=["q_proj", "v_proj"],
        task_type=TaskType.CAUSAL_LM,
    )
    # ... training code ...
    return val_loss  # placeholder

# Typical finding: r=8 or r=16 is a sweet spot for most tasks
# r=1 underfit; r=64 approaches full fine-tuning quality but costs more
ranks = [1, 2, 4, 8, 16, 32, 64]
# val_losses = [train_with_rank(r, r, dataset, model_name) for r in ranks]
```

---

## Real-World Example

**LLaMA Fine-Tuning (Alpaca, Vicuna, WizardLM):** The entire wave of open-source LLM fine-tuning in 2023 was enabled by LoRA. Fine-tuning LLaMA-65B with LoRA (r=16) required only a single A100 80GB GPU and ~8 hours, compared to 128 GPUs for full fine-tuning.

**Stable Diffusion LoRA:** The image generation community popularised "LoRA files" for fine-tuning diffusion models on custom styles, subjects, or concepts. A 4MB LoRA adapter can teach Stable Diffusion XL to generate a specific art style or person's face.

**Multi-task serving with LoRA:** Companies like Predibase serve dozens of fine-tuned models by keeping one shared base model and swapping LoRA adapters on the fly — massive cost savings vs hosting separate fine-tuned models.

---

## Trade-offs

| Factor | LoRA | Full Fine-Tuning |
|---|---|---|
| Trainable params | 0.1-1% | 100% |
| GPU memory | 2-3x less | Full requirement |
| Training speed | 3-5x faster | Baseline |
| Task performance | 90-95% of FFT | 100% baseline |
| Inference overhead | Zero (after merge) | Zero |
| Adapter storage | ~10-100MB | Full model copy |
| Multi-task serving | One base + swap adapters | Separate model per task |
| Risk of forgetting | Low (base frozen) | Higher |

---

## When to Use vs Avoid

**Use LoRA when:**
- Limited GPU memory (single A100 or consumer GPU)
- Serving multiple fine-tuned variants of the same base model
- Rapid iteration on fine-tuning tasks
- Dataset size: 1K–500K examples
- Quick experiments where full FT is too expensive

**Consider full fine-tuning when:**
- Maximum quality required and compute budget exists
- Dataset is very large (>1M examples) with deep domain shift
- Task requires fundamental representation changes across all layers

**Avoid LoRA when:**
- $r$ is too small for the complexity of the fine-tuning task — experiment with rank
- Applying to models < 100M parameters (gains diminish; overhead becomes significant)

---

## Common Pitfalls

1. **Setting rank too low** — r=1 often underperforms. For most tasks, r=8 is the minimum. For complex domain adaptation, use r=32 or r=64.
2. **Not applying LoRA to enough modules** — applying only to `q_proj` and `v_proj` (as in the original paper) often leaves performance on the table. For LLMs, apply to all 4 attention projections and optionally FFN layers.
3. **Forgetting `merge_and_unload()` before deployment** — serving with unmerged adapters adds a small but non-zero per-layer computational overhead.
4. **Incompatible adapters** — a LoRA adapter trained on LLaMA-3.2-3B cannot be loaded onto LLaMA-3.2-1B. The adapter architecture is model-specific.
5. **lora_alpha / r scaling confusion** — setting `lora_alpha = r` means effective scale = 1.0. Setting `lora_alpha = 2r` means effective scale = 2.0. Most practitioners set `lora_alpha = 2 * r` for slightly better initial gradient magnitude.

---

## Related Concepts

- [[_MOC_NLP|↑ Section MOC]]

- [[QLoRA]] — LoRA on a 4-bit quantized model; enables fine-tuning 70B+ models on consumer hardware
- [[PEFT]] — the HuggingFace library and broader family of parameter-efficient methods; LoRA is the most popular PEFT method
- [[Adapters]] — an older PEFT approach (bottleneck FFN layers); different architecture from LoRA but same goal
- [[Full_Fine_Tuning]] — updates all parameters; highest quality but 10-50x more memory than LoRA
- [[Instruction_Tuning]] — the SFT fine-tuning task most commonly paired with LoRA in practice

---

## Review Questions

1. LoRA initialises matrix $B$ to zeros and $A$ with random Gaussian values. Why is this initialisation important? What would happen if both were initialised randomly?

2. Explain why LoRA is described as exploiting "low intrinsic rank." If the weight updates $\Delta W$ during fine-tuning truly have rank $r^*$, what is the minimum rank needed for LoRA to perfectly replicate full fine-tuning?

3. You're fine-tuning a 7B LLM on a customer-service dataset. You need to serve 50 different company-specific versions of the model. Compare the storage and inference infrastructure cost of: (a) 50 separately full fine-tuned models, and (b) 1 base model + 50 LoRA adapters with r=16.

---

## Sources

- Hu et al. (2021). *LoRA: Low-Rank Adaptation of Large Language Models*. [arXiv:2106.09685](https://arxiv.org/abs/2106.09685)
- Dettmers et al. (2023). *QLoRA: Efficient Finetuning of Quantized LLMs*. [arXiv:2305.14314](https://arxiv.org/abs/2305.14314)
- HuggingFace PEFT Documentation: [huggingface.co/docs/peft](https://huggingface.co/docs/peft)
- Biderman et al. (2024). *LoRA Learns Less and Forgets Less*. [arXiv:2405.09673](https://arxiv.org/abs/2405.09673)

#lora #peft #fine-tuning #parameter-efficient #llm #adapters #huggingface
