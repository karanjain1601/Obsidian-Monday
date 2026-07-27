---
title: "Sequences and Limits in Analysis"
aliases: ["Convergent Sequences", "Cauchy Sequences", "Series Convergence"]
tags: [mathematics, real-analysis, sequences, convergence, advanced]
domain: Mathematics
difficulty: advanced
created: 2026-07-27
related: ["[[Real_Numbers_and_Completeness]]", "[[Continuity_and_Uniform_Continuity]]", "[[_MOC_Real_Analysis]]"]
status: complete
---

# ε Sequences and Limits in Analysis

> [!abstract] TL;DR
> Rigorous convergence of sequences is defined by the epsilon-N criterion: every neighborhood of the limit eventually traps the sequence. Cauchy sequences — those whose terms cluster together without reference to a limit — converge precisely in complete spaces. Bolzano-Weierstrass guarantees every bounded sequence has a convergent subsequence, the cornerstone result for compactness in analysis.

## Intuition — analogy FIRST

Imagine approaching a target on a number line: with each step you get closer, but you are only said to "converge" if you can guarantee being within any prescribed tolerance $\varepsilon$ after finitely many steps. The precise definition captures this: $a_n \to L$ means you can satisfy any accuracy demand. A **Cauchy sequence** relaxes this: the terms cluster among themselves, without knowing the limit. In a complete space (like $\mathbb{R}$), clustering implies a destination exists — the sequence does not fall into a gap. This is why $1, 1.4, 1.41, 1.414, \ldots$ converges in $\mathbb{R}$ but "fails" in $\mathbb{Q}$ (the destination $\sqrt{2}$ does not exist there).

---

## How It Works

```mermaid
graph TD
    A["Sequence (aₙ) in ℝ"] --> B{Is it bounded?}
    B -->|No| C["Cannot converge\n(unbounded sequences diverge)"]
    B -->|Yes| D["Bolzano-Weierstrass: ∃ convergent subsequence"]
    A --> E{Is it monotone and bounded?}
    E -->|Yes| F["Monotone Convergence Theorem:\nlimit exists = sup or inf"]
    A --> G{Is it Cauchy?\n|aₙ-aₘ|<ε for large n,m}
    G -->|Yes, and ℝ is complete| H["Converges to some L ∈ ℝ"]
    G -->|No| I["Diverges"]
    style A fill:#2563eb,color:#fff
    style H fill:#7c3aed,color:#fff
    style F fill:#7c3aed,color:#fff
```

---

## Key Concepts / Details

### Epsilon-N Definition of Convergence

A sequence $(a_n)$ **converges** to $L \in \mathbb{R}$, written $\lim_{n\to\infty} a_n = L$, if:

$$\forall \varepsilon > 0,\; \exists N \in \mathbb{N}:\; n > N \implies |a_n - L| < \varepsilon$$

The integer $N$ may depend on $\varepsilon$ but not on $n$.

**Uniqueness**: limits are unique. If $a_n \to L$ and $a_n \to M$, then $|L - M| \leq |L - a_n| + |a_n - M| < 2\varepsilon$ for all $\varepsilon > 0$, so $L = M$.

### Algebra of Limits

If $a_n \to L$ and $b_n \to M$:
- $a_n + b_n \to L + M$
- $a_n b_n \to LM$
- $a_n / b_n \to L/M$ provided $M \neq 0$ and $b_n \neq 0$ eventually
- $\sqrt{a_n} \to \sqrt{L}$ provided $L \geq 0$

The **Squeeze theorem**: if $a_n \leq c_n \leq b_n$ and $a_n, b_n \to L$, then $c_n \to L$.

### Monotone Convergence Theorem

Every **monotone increasing** sequence that is **bounded above** converges to $\sup\{a_n\}$; every **monotone decreasing** sequence bounded below converges to $\inf\{a_n\}$. This is a direct application of completeness — the supremum exists in $\mathbb{R}$ and is the limit.

**Example**: $a_n = (1 + 1/n)^n$ is increasing and bounded above by $3$; it converges to $e$.

### Bolzano-Weierstrass Theorem

Every **bounded** sequence in $\mathbb{R}$ has a **convergent subsequence**. 

*Proof sketch*: Repeatedly bisect the interval containing all terms; one half must contain infinitely many terms. The nested intervals yield a Cauchy sequence (then a convergent one by completeness).

This is the key compactness result in $\mathbb{R}$ — a bounded sequence cannot "escape to infinity" without leaving a convergent trace.

### Cauchy Sequences

$(a_n)$ is a **Cauchy sequence** if:

$$\forall \varepsilon > 0,\; \exists N:\; m, n > N \implies |a_n - a_m| < \varepsilon$$

**In $\mathbb{R}$**: $(a_n)$ converges $\iff$ $(a_n)$ is Cauchy. This is the **Cauchy criterion** for convergence — it lets you verify convergence without knowing the limit.

**In $\mathbb{Q}$**: Cauchy $\not\Rightarrow$ convergent (the sequence $1, 1.4, 1.41, \ldots$ of rational approximations to $\sqrt{2}$ is Cauchy in $\mathbb{Q}$ but has no rational limit).

### Limit Superior and Limit Inferior

For a bounded sequence:

$$\limsup_{n\to\infty} a_n = \lim_{n\to\infty}\sup_{k\geq n} a_k, \qquad \liminf_{n\to\infty} a_n = \lim_{n\to\infty}\inf_{k\geq n} a_k$$

These always exist (for bounded sequences). $\lim a_n$ exists $\iff$ $\limsup a_n = \liminf a_n$.

### Series

An infinite **series** $\sum_{n=1}^\infty a_n$ converges if and only if the sequence of **partial sums** $S_N = \sum_{n=1}^N a_n$ converges.

**Necessary condition**: if $\sum a_n$ converges, then $a_n \to 0$. The converse is **false** ($\sum 1/n$ diverges despite $1/n \to 0$).

**Absolute convergence**: $\sum |a_n| < \infty$ implies $\sum a_n$ converges (but not conversely — $\sum (-1)^n/n$ converges conditionally).

**Riemann Rearrangement Theorem**: A conditionally (but not absolutely) convergent series can be rearranged to converge to any value, or to diverge. Absolute convergence is immune to rearrangement.

---

## Real-World Notes

- **Iterative Algorithms**: Newton's method for root-finding generates a sequence; proving it converges requires showing it is Cauchy (or directly bounding the error). The Banach fixed-point theorem (see [[Metric_Spaces]]) formalizes this.
- **Decimal Expansions**: Every infinite decimal $0.d_1 d_2 d_3 \ldots$ is a limit of the sequence $0.d_1, 0.d_1d_2, \ldots$ of rational partial approximations. Completeness guarantees this limit exists in $\mathbb{R}$.
- **Numerical Series in Finance**: Present values involve sums $\sum_{t=1}^\infty C/(1+r)^t$; convergence requires $|r| > 0$. The perpetuity formula $C/r$ is the limit of the partial sums.
- **Machine Learning (Gradient Descent)**: Training is a sequence of parameter updates. Showing the loss decreases monotonically and is bounded below guarantees convergence to a stationary point by the monotone convergence theorem.

---

## Common Pitfalls

- **Confusing the necessary condition for convergence with a test**: $a_n \to 0$ is necessary but not sufficient for $\sum a_n$ to converge. The harmonic series $\sum 1/n$ is the canonical counterexample — memorize it.
- **Subsequence convergence $\neq$ sequence convergence**: A sequence can have a convergent subsequence without converging itself (e.g., $(-1)^n$ has subsequences $\to +1$ and $\to -1$). Convergence requires *every* subsequence to converge to the same limit.
- **$\limsup$ and $\liminf$ for unbounded sequences**: The definitions extend to $\pm\infty$. The limit exists (finitely) only when both are finite and equal.
- **Rearranging conditionally convergent series**: This is tempting but catastrophically wrong — the Riemann rearrangement theorem shows you can change the sum to anything. Only absolutely convergent series can be freely rearranged.

---

## Related Concepts

- [[_MOC_Real_Analysis|↑ Real Analysis MOC]]
- [[Real_Numbers_and_Completeness]] — completeness ↔ Cauchy criterion; LUB ↔ monotone convergence
- [[Continuity_and_Uniform_Continuity]] — sequential characterization of continuity uses these exact definitions
- [[Metric_Spaces]] — Cauchy sequences and completeness generalize to any metric space

---

## Review Questions

1. Prove from the $\varepsilon$-$N$ definition that $\lim_{n\to\infty} (3n+1)/(2n-5) = 3/2$. Find an explicit $N$ for $\varepsilon = 0.01$.
2. Let $a_1 = 1$ and $a_{n+1} = \tfrac{1}{2}(a_n + 2/a_n)$. Show $(a_n)$ is eventually decreasing and bounded below, and find its limit. (This is Newton's method for $\sqrt{2}$.)
3. Use the Cauchy criterion to prove $\sum_{n=1}^\infty 1/n^2$ converges, without computing the sum. (Hint: compare tails with a telescoping series.)
4. Show that $\limsup a_n = L$ if and only if (i) for all $\varepsilon > 0$, $a_n < L + \varepsilon$ for all sufficiently large $n$, and (ii) for all $\varepsilon > 0$, $a_n > L - \varepsilon$ for infinitely many $n$.

---

## Sources

- Rudin, *Principles of Mathematical Analysis*, Ch. 3
- Abbott, *Understanding Analysis*, Ch. 2
- Tao, *Analysis I*, Ch. 6

#real-analysis #sequences #convergence #mathematics
