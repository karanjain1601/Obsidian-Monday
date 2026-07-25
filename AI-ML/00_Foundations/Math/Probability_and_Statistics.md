---
title: Probability and Statistics for ML
aliases: [Probability for ML, Statistics for ML, Bayes Theorem, MLE, MAP]
tags: [math, probability, statistics, bayes, MLE, MAP, distributions, foundations]
domain: AI-ML
difficulty: Beginner
created: 2026-07-26
related: [Naive_Bayes, Information_Theory, Logistic_Regression]
status: complete
---

# 🎲 Probability and Statistics for ML

> [!abstract] TL;DR
> Probability gives ML models a principled language for uncertainty — distributions describe data, Bayes' theorem updates beliefs with evidence, and MLE/MAP give us principled ways to choose model parameters from data.

---

## Intuition

**Analogy:** Think of a weather forecaster. They do not *know* whether it will rain tomorrow — they assign a *probability*: "70% chance of rain." When new evidence arrives (a storm system moving in), they update their belief. That is Bayes' theorem. The forecaster uses all past weather data to fit a model — that is Maximum Likelihood Estimation. If they also bring in climate priors ("it rarely rains here in July"), that is Maximum A Posteriori estimation.

Probability is not just about randomness — it is a rigorous framework for representing and updating *degrees of belief* under uncertainty. Every ML model, at its core, is making probabilistic predictions.

---

## How It Works

### Core Mechanics

**Probability Distributions:**

A distribution describes all possible values of a random variable and their likelihoods.

| Distribution | Support | Use in ML |
|---|---|---|
| Bernoulli(p) | {0, 1} | Binary classification output |
| Categorical(p₁…pₖ) | {1,…,k} | Multi-class classification output |
| Normal/Gaussian(μ,σ²) | ℝ | Regression outputs, weight initialization, noise |
| Uniform(a,b) | [a,b] | Sampling, initialization |
| Dirichlet(α) | Simplex | Prior over categorical distributions (topic models) |

**Conditional Probability:**
```
P(A|B) = P(A ∩ B) / P(B)
```
"The probability of A, *given* that B has occurred." This is the foundation of almost every probabilistic model.

**Bayes' Theorem:**
Derived from the definition of conditional probability, it lets you reverse the conditioning:
```
P(hypothesis | data) = P(data | hypothesis) × P(hypothesis) / P(data)
```
- **Posterior:** P(hypothesis | data) — what we believe *after* seeing data
- **Likelihood:** P(data | hypothesis) — how probable the data is under this hypothesis
- **Prior:** P(hypothesis) — what we believed *before* seeing data
- **Evidence:** P(data) — normalizing constant (often ignored in practice)

**Maximum Likelihood Estimation (MLE):**
Find parameters θ that make the observed data most probable:
```
θ_MLE = argmax P(data | θ)
```
In practice, we maximize the *log-likelihood* (same maximizer, numerically more stable):
```
θ_MLE = argmax Σᵢ log P(xᵢ | θ)
```

**Maximum A Posteriori (MAP):**
MLE + a prior. Instead of just maximizing likelihood, also incorporate your prior beliefs about θ:
```
θ_MAP = argmax P(θ | data) = argmax [log P(data | θ) + log P(θ)]
```
The log prior `log P(θ)` acts as *regularization* — a Gaussian prior on weights = L2 regularization; a Laplace prior = L1 regularization.

**Key Statistics:**
- **Expected Value:** E[X] = Σ x·P(X=x) — the mean of a distribution.
- **Variance:** Var(X) = E[(X - μ)²] — spread around the mean.
- **Covariance:** Cov(X,Y) = E[(X-μₓ)(Y-μᵧ)] — how two variables move together.
- **Central Limit Theorem (CLT):** The mean of many independent samples converges to a Normal distribution, regardless of the original distribution. This is why we can use Gaussian assumptions in so many places.

### Visual Overview

```mermaid
graph TD
    P[Probability Theory] --> FREQ[Frequentist Approach]
    P --> BAYES[Bayesian Approach]

    FREQ --> MLE[MLE\nMaximize P(data or theta)]
    FREQ --> HYP[Hypothesis Testing\np-values, confidence intervals]

    BAYES --> PRIOR[Prior P(theta)\nDomain knowledge]
    BAYES --> LIKE[Likelihood P(data or theta)\nModel fit]
    PRIOR --> POST[Posterior P(theta or data)\nUpdated belief]
    LIKE --> POST
    POST --> MAP[MAP Estimate\nMode of posterior]
    POST --> FULL[Full Bayesian Inference\nIntegrate over theta]

    MLE --> REG[Regularization\nL1 and L2 penalties]
    MAP --> REG
```

---

## The Math

**Bayes' Theorem:**
$$P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)}$$

**Law of Total Probability:**
$$P(B) = \sum_i P(B \mid A_i) \cdot P(A_i)$$

**MLE:**
$$\hat{\theta}_{MLE} = \arg\max_\theta \sum_{i=1}^n \log P(x_i \mid \theta)$$

**MAP:**
$$\hat{\theta}_{MAP} = \arg\max_\theta \left[ \sum_{i=1}^n \log P(x_i \mid \theta) + \log P(\theta) \right]$$

**Gaussian Distribution PDF:**
$$\mathcal{N}(x \mid \mu, \sigma^2) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$$

**Variance and Covariance:**
$$\text{Var}(X) = E[X^2] - (E[X])^2 \qquad \text{Cov}(X,Y) = E[XY] - E[X]E[Y]$$

---

## Code Demo

```python
import numpy as np
from scipy import stats

# ── 1. Working with distributions ────────────────────────────────────────────
# Normal distribution: sample, compute PDF, stats
mu, sigma = 5.0, 2.0
normal_dist = stats.norm(loc=mu, scale=sigma)

samples = normal_dist.rvs(size=1000, random_state=42)
print(f"Sample mean: {samples.mean():.2f}  (true: {mu})")
print(f"Sample std:  {samples.std():.2f}  (true: {sigma})")

# PDF at a specific point
print(f"P(X=5.0) = {normal_dist.pdf(5.0):.4f}")

# Bernoulli distribution (binary outcome)
bern = stats.bernoulli(p=0.3)
coin_flips = bern.rvs(size=20, random_state=0)
print(f"\nBernoulli(0.3) samples: {coin_flips}")
print(f"Empirical P(heads): {coin_flips.mean():.2f}")

# ── 2. Bayes' theorem — spam filter example ──────────────────────────────────
# P(spam) = 0.3, P(not spam) = 0.7
# P("free" | spam) = 0.9, P("free" | not spam) = 0.05
p_spam      = 0.3
p_not_spam  = 0.7
p_free_given_spam     = 0.9
p_free_given_not_spam = 0.05

p_free = p_free_given_spam * p_spam + p_free_given_not_spam * p_not_spam  # law of total prob
p_spam_given_free = (p_free_given_spam * p_spam) / p_free

print(f"\nBayes — P(spam | 'free'): {p_spam_given_free:.3f}")

# ── 3. MLE — estimate mean and std of a Gaussian from data ──────────────────
data = np.array([2.3, 3.1, 4.5, 3.8, 2.9, 4.1, 3.5, 3.2])

# MLE for Gaussian: mean = sample mean, var = biased sample variance (n, not n-1)
mu_mle    = data.mean()
sigma_mle = data.std(ddof=0)   # MLE uses ddof=0 (biased)
sigma_unbiased = data.std(ddof=1)  # unbiased estimator uses ddof=1

print(f"\nMLE estimates: μ={mu_mle:.3f}, σ={sigma_mle:.3f}")
print(f"Unbiased σ (ddof=1): {sigma_unbiased:.3f}")

# ── 4. Sampling and CLT illustration ────────────────────────────────────────
rng = np.random.default_rng(0)
# Skewed distribution: exponential
pop = rng.exponential(scale=2.0, size=100_000)

# Sample means of size n=30 should be approximately Normal (CLT)
sample_means = [rng.choice(pop, size=30).mean() for _ in range(5000)]
sample_means = np.array(sample_means)

print(f"\nCLT demo — population mean: {pop.mean():.3f}, std: {pop.std():.3f}")
print(f"Distribution of sample means: mean={sample_means.mean():.3f}, "
      f"std={sample_means.std():.3f} ≈ {pop.std()/np.sqrt(30):.3f} (= σ/√n)")

# ── 5. Covariance and correlation ─────────────────────────────────────────────
x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
y = 2 * x + rng.normal(0, 0.5, 5)

cov_matrix = np.cov(x, y)
correlation = np.corrcoef(x, y)[0, 1]
print(f"\nCov(X,Y) = {cov_matrix[0,1]:.4f}")
print(f"Corr(X,Y) = {correlation:.4f}  (should be close to 1.0)")
```

---

## Real-World Example

> **Example:** Gmail's spam filter is a direct application of Naive Bayes — a probabilistic classifier built on Bayes' theorem and the (naive) assumption that word occurrences are conditionally independent given the class. For every incoming email, it computes P(spam | words) ∝ P(words | spam) × P(spam). Parameters are estimated by MLE from millions of labeled emails. The "naive" independence assumption is empirically wrong (words co-occur), but the classifier works remarkably well in practice. A/B testing at Google uses hypothesis testing (frequentist statistics) to decide whether a new feature improves click-through rates — the p-value and confidence interval come directly from CLT and sampling theory.

---

## Trade-offs

| Aspect | Pro | Con |
|--------|-----|-----|
| MLE | Asymptotically unbiased, consistent, computationally simple | No regularization — overfits with small data; can assign zero probability to unseen events |
| MAP | Regularized, incorporates domain knowledge via prior | Requires specifying a prior; point estimate loses uncertainty information |
| Full Bayesian | Quantifies full posterior uncertainty, works well with small data | Analytically intractable for most models; MCMC/VI are expensive approximations |
| Frequentist (hypothesis testing) | Well-understood, interpretable p-values | p-values widely misinterpreted; cannot directly answer "what is P(hypothesis)" |
| Gaussian assumption | Mathematically tractable, justified by CLT | Real data is often skewed, heavy-tailed, or multimodal |

---

## When to Use vs Avoid

**Use when:**
- Building probabilistic classifiers (Naive Bayes, logistic regression, Bayesian networks).
- You need calibrated confidence scores, not just predictions (e.g., medical diagnosis).
- You have domain knowledge to encode as a prior (MAP/Bayesian approach).
- Running A/B tests or evaluating ML experiments (hypothesis testing, confidence intervals).
- Designing loss functions — MLE of a Gaussian noise model gives MSE loss; MLE of a Bernoulli model gives cross-entropy loss.

**Avoid when:**
- You need exact uncertainty quantification for high-stakes decisions and have limited compute — full Bayesian inference may be too slow; use conformal prediction as an alternative.
- Your data is clearly not IID (time series, graphs) — standard frequentist tests assume independence.

---

## Common Pitfalls

- **Confusing P(A|B) with P(B|A)** — the "prosecutor's fallacy." P(DNA match | innocent) ≠ P(innocent | DNA match). Always apply Bayes explicitly.
- **Ignoring the prior in MAP** — if you use a Gaussian prior N(0, σ²) but set σ very large, the prior has negligible effect. Make sure your regularization strength is meaningful.
- **Zero probability with MLE** — if a word never appeared in training spam emails, MLE assigns P("word" | spam) = 0, making the entire product zero. Fix: Laplace smoothing (add-one smoothing).
- **Treating p-value as P(null hypothesis is true)** — p-value is P(data this extreme | null is true), not the probability the null is true. A common and costly misinterpretation.
- **Assuming independence for covariance = 0** — zero covariance implies zero *linear* correlation, not independence. Two variables can have Cov = 0 but still be dependent (e.g., X and X²).

---

## Related Concepts

- [[_MOC_Foundations|↑ Section MOC]]

- [[Naive_Bayes]] — applies Bayes' theorem with a conditional independence assumption; one of the simplest and most effective probabilistic classifiers
- [[Information_Theory]] — entropy and KL divergence are direct extensions of probability theory; cross-entropy loss = negative log-likelihood
- [[Logistic_Regression]] — MLE of a Bernoulli model with a sigmoid-parameterized probability; the connection makes it a principled probabilistic classifier
- [[Linear_Algebra]] — covariance matrices are the bridge between statistics and linear algebra; multivariate Gaussians are parameterized by them
- [[Loss_Functions]] — MSE = MLE under Gaussian noise; cross-entropy = MLE under Bernoulli/categorical; every loss has a probabilistic interpretation

---

## Review Questions

1. **Conceptual:** Explain the difference between MLE and MAP estimation. Under what condition are they equivalent?
2. **Scenario-based:** You are building a text classifier. Your training set has 10,000 spam and 10,000 ham emails, but the word "bitcoin" appears in only 2 spam emails. What problem does MLE have here, and how would you fix it?
3. **Trade-off:** A doctor wants to know the probability that a patient has a rare disease given a positive test result. The test has 99% sensitivity and 99% specificity, but the disease occurs in 1 in 10,000 people. Compute the posterior probability using Bayes and interpret the result.

---

## Sources

- [Khan Academy — Statistics and Probability](https://www.khanacademy.org/math/statistics-probability)
- [Probability Theory: The Logic of Science — E.T. Jaynes (free PDF)](http://www.med.mcgill.ca/epidemiology/hanley/bios601/GaussianModel/JaynesProbabilityTheory.pdf)
- [Goodfellow et al. — Deep Learning, Chapter 3](https://www.deeplearningbook.org/contents/prob.html)
- [StatQuest — Probability (YouTube)](https://www.youtube.com/c/joshstarmer)
- [Bishop — Pattern Recognition and Machine Learning, Chapter 1-2](https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/)

---
#math #probability #statistics #bayes #MLE #MAP #distributions #foundations #ml-math
