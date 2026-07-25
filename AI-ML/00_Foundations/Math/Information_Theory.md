---
title: Information Theory for ML
aliases: [Information Theory, Entropy, Cross-Entropy, KL Divergence, Mutual Information]
tags: [math, information-theory, entropy, cross-entropy, KL-divergence, loss-functions, foundations]
domain: AI-ML
difficulty: Intermediate
created: 2026-07-26
related: [Loss_Functions, Language_Model_Basics, Probability_and_Statistics]
status: complete
---

# 📡 Information Theory for ML

> [!abstract] TL;DR
> Information theory quantifies uncertainty and the cost of encoding data — entropy measures how surprising a distribution is, cross-entropy is the natural loss for classification, and KL divergence measures how far a learned distribution is from the true one.

---

## Intuition

**Analogy:** Imagine flipping a fair coin versus rolling a loaded die that always lands on 6. The coin flip is maximally uncertain — you learn a lot from each outcome (1 bit of information). The die outcome tells you nothing new because you already knew it. The loaded die has *lower entropy* — less surprise, less information per observation. Now imagine you are trying to encode a weather forecast: if you encode it using a code optimized for sunny-day probabilities, but it actually rains constantly, your encoding is inefficient. That extra cost of using the wrong code is the *KL divergence* — and the total encoding cost is the *cross-entropy*.

In ML: the model's predicted distribution is the "wrong code," the true label distribution is the "right code," and minimizing cross-entropy loss means minimizing the inefficiency of your model's predictions.

---

## How It Works

### Core Mechanics

**Entropy — Measure of Uncertainty:**
Entropy H(p) measures the average surprise (information content) of a distribution p. High entropy = highly uncertain. Low entropy = predictable.

- Coin flip (p=0.5): H = 1 bit — maximum uncertainty for a binary event.
- Biased coin (p=0.99 heads): H ≈ 0.08 bits — nearly certain, low entropy.
- Uniform distribution over k classes: H = log(k) — maximum entropy.

Information content of a single event with probability p: `I(x) = -log₂ p(x)` (in bits) or `-log_e p(x)` (in nats). Rare events carry more information.

**Cross-Entropy — Mismatch Cost:**
Cross-entropy H(p, q) measures the expected code length when you use distribution q to encode data actually drawn from distribution p:
```
H(p, q) = -Σ p(x) log q(x)
```
- p = true distribution (the labels)
- q = model's predicted distribution (the softmax output)
- H(p, q) = H(p) + D_KL(p || q)

When p is a one-hot distribution (hard labels), this simplifies to `-log q(correct_class)` — exactly the cross-entropy loss used in classification!

**KL Divergence — Distribution Distance:**
KL divergence D_KL(P || Q) measures how much extra information is needed to encode samples from P using a code designed for Q:
```
D_KL(P || Q) = Σ P(x) log(P(x) / Q(x))
```
- Always ≥ 0 (Gibbs' inequality).
- D_KL(P || Q) = 0 iff P = Q everywhere.
- **Asymmetric**: D_KL(P || Q) ≠ D_KL(Q || P) in general.
- Forward KL (P||Q) = "mass-covering" — Q tries to cover all of P, may spread too wide.
- Reverse KL (Q||P) = "mode-seeking" — Q concentrates on one mode of P.

**Mutual Information:**
I(X;Y) measures how much knowing X reduces uncertainty about Y:
```
I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X) = D_KL(P(X,Y) || P(X)P(Y))
```
- I(X;Y) = 0 iff X and Y are independent.
- Used in: feature selection, causal inference, representation learning (InfoNCE loss in contrastive learning).

**Why Cross-Entropy is the Right Classification Loss:**
Minimizing cross-entropy H(p, q) w.r.t. q:
1. Is equivalent to maximizing the log-likelihood of the data (MLE).
2. When p is one-hot, simplifies to `-log(q_true)` — penalizes low confidence on the correct class.
3. Has well-behaved gradients (unlike MSE on softmax outputs, which suffers from saturated gradients).

### Visual Overview

```mermaid
graph TD
    SURPRISE[Surprise: I(x) = -log p(x)\nRare events = more information] --> ENTROPY
    ENTROPY[Entropy H(p)\nAverage surprise of a distribution] --> CROSS_ENT
    ENTROPY --> MI[Mutual Information I(X;Y)\nShared information between variables]
    CROSS_ENT[Cross-Entropy H(p,q)\nCost of encoding p using code for q] --> KL
    KL[KL Divergence D_KL(P||Q)\nExtra cost vs optimal code] --> LOSS
    CROSS_ENT --> LOSS[Classification Loss\n-log q(correct class)]
    KL --> VAE[VAE Regularization\nKL(posterior || prior)]
    MI --> CONTRASTIVE[Contrastive Learning\nInfoNCE / SimCLR]
```

---

## The Math

**Entropy:**
$$H(p) = -\sum_{x} p(x) \log p(x) = \mathbb{E}_{x \sim p}[-\log p(x)]$$

For continuous distributions: $H(p) = -\int p(x) \log p(x)\, dx$ (differential entropy)

**Cross-Entropy:**
$$H(p, q) = -\sum_{x} p(x) \log q(x)$$

**Relationship: Cross-Entropy = Entropy + KL:**
$$H(p, q) = H(p) + D_{KL}(p \,\|\, q)$$

Since $H(p)$ is fixed (depends only on true labels), minimizing $H(p, q)$ is equivalent to minimizing $D_{KL}(p \| q)$.

**KL Divergence:**
$$D_{KL}(P \,\|\, Q) = \sum_{x} P(x) \log \frac{P(x)}{Q(x)} \geq 0$$

**Mutual Information:**
$$I(X;Y) = \sum_{x,y} P(x,y) \log \frac{P(x,y)}{P(x)P(y)} = D_{KL}(P(X,Y) \,\|\, P(X)P(Y))$$

**Perplexity (language models):**
$$\text{PPL}(p, q) = 2^{H(p, q)} = \exp(H(p,q))$$

A perplexity of k means the model is as confused as if choosing uniformly among k options at each token.

---

## Code Demo

```python
import numpy as np
import torch
import torch.nn.functional as F

# ── 1. Entropy of different distributions ────────────────────────────────────
def entropy(p, base=np.e):
    """Shannon entropy in nats (base=e) or bits (base=2)."""
    p = np.asarray(p, dtype=float)
    p = p[p > 0]   # avoid log(0)
    return -np.sum(p * np.log(p) / np.log(base))

fair_coin     = [0.5, 0.5]
biased_coin   = [0.99, 0.01]
fair_die      = [1/6] * 6
loaded_die    = [0.0, 0.0, 0.0, 0.0, 0.0, 1.0]  # always lands on 6

print("Entropy (bits):")
print(f"  Fair coin:   {entropy(fair_coin, base=2):.4f}")     # 1.0 bit
print(f"  Biased coin: {entropy(biased_coin, base=2):.4f}")   # ~0.08 bits
print(f"  Fair die:    {entropy(fair_die, base=2):.4f}")      # ~2.58 bits
print(f"  Loaded die:  {entropy(loaded_die, base=2):.4f}")    # 0.0 bits

# ── 2. Cross-entropy between true and predicted distributions ─────────────────
def cross_entropy(p_true, q_pred, eps=1e-12):
    p = np.asarray(p_true, dtype=float)
    q = np.asarray(q_pred, dtype=float) + eps
    return -np.sum(p * np.log(q))

# Perfect prediction
p_true    = [0, 1, 0, 0]    # one-hot: class 1 is correct
q_perfect = [0.001, 0.997, 0.001, 0.001]
q_wrong   = [0.001, 0.001, 0.997, 0.001]
q_uniform = [0.25, 0.25, 0.25, 0.25]

print(f"\nCross-entropy (nats):")
print(f"  Perfect prediction: {cross_entropy(p_true, q_perfect):.4f}")  # ~0.003
print(f"  Wrong prediction:   {cross_entropy(p_true, q_wrong):.4f}")    # ~6.9
print(f"  Uniform prediction: {cross_entropy(p_true, q_uniform):.4f}")  # ~1.39 = log(4)

# ── 3. KL Divergence ─────────────────────────────────────────────────────────
def kl_divergence(p, q, eps=1e-12):
    p = np.asarray(p, dtype=float)
    q = np.asarray(q, dtype=float) + eps
    return np.sum(p * np.log(p / q))

p = [0.3, 0.5, 0.2]
q = [0.4, 0.4, 0.2]

print(f"\nKL(P||Q) = {kl_divergence(p, q):.6f}")
print(f"KL(Q||P) = {kl_divergence(q, p):.6f}")  # asymmetric: different value
print(f"Verify: H(p,q) = H(p) + KL(p||q)")
print(f"  H(p)      = {entropy(p):.6f}")
print(f"  KL(p||q)  = {kl_divergence(p, q):.6f}")
print(f"  H(p,q)    = {cross_entropy(p, q):.6f}")
print(f"  H(p)+KL   = {entropy(p) + kl_divergence(p, q):.6f}")

# ── 4. PyTorch CrossEntropyLoss ───────────────────────────────────────────────
# nn.CrossEntropyLoss expects raw logits (not softmax'd) and integer class labels
logits   = torch.tensor([[2.0, 1.0, 0.1],    # sample 1 → class 0
                          [0.5, 2.5, 0.3]])   # sample 2 → class 1
targets  = torch.tensor([0, 1])

loss = F.cross_entropy(logits, targets)
print(f"\nPyTorch CrossEntropyLoss: {loss.item():.4f}")

# Manual verification: softmax then -log(correct class)
probs = F.softmax(logits, dim=-1)
manual = -torch.log(probs[0, 0]) - torch.log(probs[1, 1])
print(f"Manual:                    {(manual / 2).item():.4f}")  # mean over batch

# ── 5. Perplexity (language model evaluation) ─────────────────────────────────
# Simulated: average cross-entropy per token
avg_cross_entropy_per_token = 3.5   # nats (typical for a decent LM)
perplexity = np.exp(avg_cross_entropy_per_token)
print(f"\nPerplexity at H_avg={avg_cross_entropy_per_token} nats: {perplexity:.1f}")
```

---

## Real-World Example

> **Example:** Large language models like GPT-4 are trained by minimizing cross-entropy loss — specifically, `-log P(next_token | context)` summed over all tokens in the training corpus. The evaluation metric is **perplexity**: GPT-2 achieved ~29 on Penn Treebank; GPT-3 achieved ~20; modern models approach ~10. A perplexity of 10 means the model is about as surprised as if it had to choose uniformly among 10 equally likely options at every token position. **Variational Autoencoders (VAEs)** use KL divergence directly in their loss: the total loss = reconstruction loss (cross-entropy or MSE) + β × KL(q(z|x) || p(z)), where the KL term forces the learned posterior to stay close to a standard Gaussian prior, enabling smooth latent space interpolation.

---

## Trade-offs

| Aspect | Pro | Con |
|--------|-----|-----|
| Cross-entropy loss | Convex in logits for linear models; natural MLE objective; numerically stable with log-sum-exp trick | Can be dominated by hard/noisy samples; use label smoothing to mitigate |
| KL divergence (forward) | D_KL(P\|\|Q) = 0 iff P=Q; well-defined measure | Asymmetric; D_KL(P\|\|Q) = ∞ if Q=0 anywhere P>0 |
| MSE loss (instead of cross-entropy for classification) | Simple | Saturated gradients when sigmoid/softmax output is near 0 or 1; slower training |
| Entropy for feature selection | Model-free; captures non-linear dependencies | Estimating entropy in continuous high-dim space is hard |
| Perplexity for LM eval | Widely reported, comparable across models | Only valid at same tokenization; not interpretable to end users |

---

## When to Use vs Avoid

**Use when:**
- Classification — cross-entropy is the standard loss; it is the MLE objective for Bernoulli (binary) and Categorical (multi-class) distributions.
- Training generative models — VAEs use KL to regularize the latent space; diffusion models optimize a variational lower bound.
- Evaluating language models — perplexity is the standard metric.
- Feature selection or mutual information neural estimation — I(X;Y) identifies informative features.
- Knowledge distillation — the student minimizes KL divergence from the teacher's soft predictions.

**Avoid when:**
- Regression tasks with continuous outputs — use MSE or MAE, not cross-entropy.
- You have very imbalanced classes — raw cross-entropy is dominated by the majority class; use focal loss or class-weighted cross-entropy.
- Estimating KL or MI in continuous high-dimensional spaces directly — use neural estimators (MINE, InfoNCE) instead of histogram methods.

---

## Common Pitfalls

- **Passing probabilities to `nn.CrossEntropyLoss`** — PyTorch's `nn.CrossEntropyLoss` expects raw logits (before softmax), not probabilities. If you pass probabilities, you get silently incorrect results. Use `nn.NLLLoss` if you provide log-probabilities.
- **Numerical instability: log(0)** — if the model assigns zero probability to the correct class, the loss is infinite. In practice: use log-sum-exp for stable softmax + log, or use `eps` clipping. PyTorch handles this internally.
- **Ignoring that KL is not a metric** — it is asymmetric and does not satisfy the triangle inequality. "Distance" between two distributions may need Jensen-Shannon divergence (symmetric, bounded) instead.
- **Confusing entropy with cross-entropy** — entropy H(p) is a property of the *true* distribution (fixed during training). Cross-entropy H(p,q) depends on the *model* q and is what you actually optimize.
- **Label smoothing side effects** — label smoothing (replacing one-hot with soft labels like [0.05, 0.9, 0.05]) reduces overconfidence but also makes the learned representations less discriminative. Do not use it if you need sharp probability calibration.

---

## Related Concepts

- [[_MOC_Foundations|↑ Section MOC]]

- [[Loss_Functions]] — cross-entropy IS the classification loss; MSE = MLE under Gaussian noise; understanding the information-theoretic derivation explains *why* each loss is used
- [[Language_Model_Basics]] — perplexity = exp(cross-entropy); all LM training is entropy minimization over the token distribution
- [[Probability_and_Statistics]] — entropy and KL divergence are built on probability distributions; MLE minimizes cross-entropy
- [[Variational_Autoencoders]] — the ELBO = reconstruction term (cross-entropy/MSE) - KL(posterior || prior); KL is the regularization term
- [[Contrastive_Learning]] — InfoNCE loss is a lower bound on mutual information; maximizing it learns representations that preserve shared information

---

## Review Questions

1. **Conceptual:** Explain why minimizing cross-entropy H(p, q) between the true label distribution p and model predictions q is mathematically equivalent to Maximum Likelihood Estimation. Show the connection explicitly.
2. **Scenario-based:** Your language model achieves a test cross-entropy of 2.3 nats/token. What is the perplexity? If a competing model achieves perplexity 8.5, which is better and by how much in terms of nats?
3. **Trade-off:** In knowledge distillation, you can either use hard labels (one-hot, cross-entropy) or soft labels (teacher's logits, KL divergence). Why do soft labels typically produce better-performing students? What information do hard labels lose?

---

## Sources

- [Chris Olah — Visual Information Theory](https://colah.github.io/posts/2015-09-Visual-Information/)
- [Shannon — A Mathematical Theory of Communication (1948)](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf)
- [Goodfellow et al. — Deep Learning, Section 3.13](https://www.deeplearningbook.org/contents/prob.html)
- [PyTorch CrossEntropyLoss Docs](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)
- [Lilian Weng — From Autoencoder to Beta-VAE](https://lilianweng.github.io/posts/2018-08-12-vae/)

---
#math #information-theory #entropy #cross-entropy #KL-divergence #loss-functions #foundations #ml-math
