---
title: Chentsov's Uniqueness Theorem
aliases:
  - Chentsov Theorem
  - Cencov Theorem
  - Chentsov's Theorem
  - Uniqueness of the Fisher Metric
  - Chentsov-Campbell Theorem
  - Monotone Metric Uniqueness
tags:
  - information-geometry
  - chentsov-theorem
  - invariance
  - fisher-metric
  - sufficient-statistics
  - monotone-metrics
  - data-processing-inequality
created: 2026-08-02
domain: Information_Geometry
difficulty: [Secondary, Undergraduate, Graduate]
related:
  - The_Fisher_Information_Metric
  - Dual_Affine_Connections
  - Fisher_Information_and_the_Cramer_Rao_Bound
  - Information_Inequalities_and_the_Data_Processing_Inequality
  - Information_Bottleneck_and_Sufficient_Statistics
status: complete
---

# 🧭 Chentsov's Uniqueness Theorem

> [!abstract] TL;DR
> Of the infinitely many Riemannian metrics you could put on a manifold of probability distributions, **Chentsov's theorem (1972)** proves that exactly **one** — the **Fisher information metric**, up to an overall positive scalar — is **invariant (monotone) under Markov morphisms**: it never increases when you push data through a stochastic map, and it is preserved *exactly* by **sufficient statistics**. This is the theorem that turns the Fisher metric from "a convenient choice" into "*the* canonical geometry of statistics." The same invariance requirement singles out the **$\alpha$-family of connections** and the **Amari–Chentsov cubic tensor**; on the divergence side the parallel fact is that **$f$-divergences are the monotone divergences**. Chentsov's finite-sample result was extended to non-normalized measures by **Campbell (1986)** and to general (continuous) sample spaces by **Ay, Jost, Lê & Schwachhöfer (2015/2017)**. The moral: the geometry of inference is *forced by invariance*, not chosen by taste.

---

## Intuition

**Analogy — the one honest referee.** Imagine you want to measure "how different are these two theories?" and you have a hundred rival measuring sticks to choose from. You worry that a bad stick would give a different answer just because you *renamed* the outcomes ("heads/tails" vs "1/0"), or because you *summarized* your raw data through a lossless tally instead of keeping every coin flip. A trustworthy stick must be blind to such cosmetic changes: relabelling and lossless summarizing should not move the reading. Now suppose you also demand one more fair-play rule — **throwing information away can never make two theories look *further* apart**, only closer or equal. Astonishingly, these fairness rules are so strict that they leave **exactly one measuring stick standing** (up to what unit you print on it).

That surviving referee is the **Fisher information metric**. Each point of the "map" is a probability distribution; the metric measures how distinguishable two neighbouring distributions are *from data*. Chentsov proved that the single requirement — **invariance / monotonicity under statistical processing** (Markov maps and sufficient statistics) — pins down the Fisher metric **uniquely**, up to scale. Every other candidate metric secretly depends on how you happened to coordinatize or coarse-grain your data, and so is disqualified.

---

## How It Works

### What "invariance under statistical processing" means

A statistical model lives on a **sample space** $\mathcal{X}$; a family of distributions $\{p_\theta\}$ is a point cloud on the simplex over $\mathcal{X}$. The *natural transformations of statistics* are not arbitrary smooth maps — they are the operations you are allowed to do to data:

- A **Markov morphism** (stochastic map / channel / Markov kernel) $K$ sends each outcome $x$ to a random output $y$ with probability $K(y\mid x)$. It pushes a distribution forward: $(Kp)(y) = \sum_x K(y\mid x)\,p(x)$. This is *any* data processing — coarse-graining, adding noise, discarding, summarizing.
- A **sufficient statistic** $T$ is a special, *lossless* reduction: the conditional law of the raw data given $T$ carries no dependence on $\theta$ (Fisher–Neyman factorization $p_\theta(x) = h(x)\,g_\theta(T(x))$). Its Markov morphism is a **congruent embedding** — it has a stochastic inverse on the model, so no information about $\theta$ is lost.

A metric $g$ on statistical manifolds is called **monotone / invariant** when *every* Markov morphism $K$ is a **contraction**:
$$g\big(K_*V,\, K_*V\big) \;\le\; g(V, V)\quad\text{for every tangent vector } V,$$
with **equality precisely for sufficient statistics (congruent embeddings)**. In words: processing data can only shrink statistical distances, and only a lossless summary preserves them.

### Chentsov's theorem

> **Theorem (Chentsov, 1972).** On the category of finite probability simplices with Markov morphisms as arrows, the **Fisher information metric is the unique Riemannian metric** (up to multiplication by a positive constant) that is invariant/monotone under Markov morphisms. Equivalently, it is the only metric preserved by all sufficient statistics and contracted by all other stochastic maps.

The proof exploits how tightly the Markov morphisms constrain a metric: relabelling outcomes (permutation morphisms) forces the metric to be symmetric in a rigid way; embedding a small simplex into a bigger one and averaging forces the pointwise form; putting these together the only surviving tensor at a distribution $p$ is (a constant times) $\sum_x \frac{dp(x)^2}{p(x)}$ — the Fisher form. There is **no freedom left except the scale**.

### Why "up to scale" and why monotonicity is the engine

Two facts drive everything:

1. **The data-processing inequality (DPI) is the source of monotonicity.** Every **$f$-divergence** $D_f(p\Vert q) = \sum_x q(x)\, f\!\big(p(x)/q(x)\big)$ obeys the DPI: $D_f(Kp \Vert Kq) \le D_f(p\Vert q)$, with equality iff the map is sufficient. Expanding *any* $f$-divergence to second order between neighbours, $D_f(p_\theta \Vert p_{\theta + d\theta}) \approx \tfrac12 f''(1)\, d\theta^\top G\, d\theta$, produces the **Fisher metric $G$** — differing between divergences only by the constant $f''(1)$. So the metric *inherits* its monotonicity from divergence monotonicity, and the constant $f''(1)$ is exactly the "up to scale" ambiguity. Fisher is what all monotone divergences agree on locally.
2. **Scale is a choice of units.** Doubling $g$ leaves geodesics, angles, and the *ratios* of distances unchanged. Invariance can never fix an absolute unit, so uniqueness is necessarily "up to a positive constant."

### The connection analog and the historical arc

Chentsov did not stop at the metric. He also characterized the **invariant affine connections**: the **$\alpha$-family** $\nabla^{(\alpha)}$ (with $e$ at $\alpha = +1$, $m$ at $\alpha = -1$, Levi-Civita at $\alpha = 0$) is the *unique one-parameter family of connections invariant under Markov morphisms*, generated by the **Amari–Chentsov cubic tensor** $T_{ijk} = \mathbb{E}[\partial_i \ell\,\partial_j \ell\,\partial_k \ell]$ — itself the unique (up to scale) invariant symmetric 3-tensor. So *both* the metric and the dual-connection structure of information geometry are forced by the same invariance principle.

The result matured in three stages:

| Stage | Author | What it added |
|-------|--------|---------------|
| 1972 | **N. N. Chentsov (Čencov)** | Finite sample spaces: Fisher metric unique invariant metric; $\alpha$-connections unique invariant connections |
| 1986 | **L. L. Campbell** | Extended to **non-normalized** measures / the positive cone, simplifying and generalizing the finite proof |
| 2015/2017 | **Ay, Jost, Lê & Schwachhöfer** | **General / continuous** sample spaces via congruent Markov kernels; on the cone the invariant 2-tensor is Fisher plus one extra term, recovering Chentsov on the simplex |

### Flow: how invariance forces the Fisher metric

```mermaid
graph TD
    REQ["Requirement<br/>put a metric on statistical manifolds"]
    RELABEL["Invariance under relabelling<br/>renaming outcomes must not move distances"]
    SUFF["Equality under sufficient statistics<br/>lossless summaries preserve the metric exactly"]
    MONO["Monotonicity under Markov morphisms<br/>any stochastic map can only shrink distances"]
    DPI["Data-processing inequality<br/>information cannot increase under processing"]
    CH["Chentsov uniqueness theorem<br/>only one invariant metric family survives"]
    FISH["Fisher information metric<br/>the canonical geometry of statistics"]
    SCALE["Unique up to a positive scalar<br/>invariance cannot fix absolute units"]
    ALPHA["Same principle fixes<br/>the alpha-connections and the cubic tensor"]
    REQ --> RELABEL
    REQ --> SUFF
    REQ --> MONO
    MONO --> DPI
    RELABEL --> CH
    SUFF --> CH
    DPI --> CH
    CH --> FISH
    FISH --> SCALE
    CH --> ALPHA
```

---

## Key Concepts

### Secondary (intuition-level)

- **One honest ruler.** Among all conceivable ways to measure distance between distributions, only the Fisher metric ignores cosmetic changes (relabelling, lossless summarizing) and never *inflates* distances when information is thrown away.
- **Sufficient = lossless.** A sufficient statistic is a summary that keeps every drop of information about the parameter; under the Fisher metric, distances survive it untouched. Any other (lossy) summary strictly shrinks them.
- **Canonical, not arbitrary.** "Canonical" means *forced by a principle*, not preferred by convention. Chentsov supplies the principle: invariance under statistical processing.

### Undergraduate (probability + a little geometry)

- **Markov morphism.** A column-stochastic matrix $K$; the pushforward $Kp$ is data processing. Invariance demands $g$ contracts under every such $K$.
- **Monotone metric.** $g(K_*V, K_*V) \le g(V,V)$, equality iff $K$ is sufficient. This is the metric-side data-processing inequality.
- **Local form of $f$-divergences.** $D_f(p_\theta \Vert p_{\theta+d\theta}) \approx \tfrac12 f''(1)\,d\theta^\top G\,d\theta$. Every monotone divergence expands to the *same* Fisher metric up to the constant $f''(1)$ — the origin of "up to scale."
- **Uniqueness statement.** On finite simplices, any invariant metric equals $c\sum_x dp(x)^2/p(x)$ for some $c>0$; that is the Fisher metric.
- **Contrast with a bad metric.** Plain Euclidean distance in parameters $\lVert\theta_A - \theta_B\rVert$ changes under reparameterization and is *not* monotone — it flunks Chentsov's test.

### Graduate (system-level)

- **Categorical framing.** Statistical models form a category whose morphisms are Markov kernels (a **Markov category**); Chentsov's theorem is a statement about invariant Riemannian structure on this category — the closest thing statistics has to a "functorial geometry."
- **Amari–Chentsov tensor & $\alpha$-connections.** $T_{ijk} = \mathbb{E}[\partial_i \ell\,\partial_j \ell\,\partial_k \ell]$ is the unique invariant symmetric 3-tensor; $\nabla^{(\alpha)} = \nabla^{(0)} - \tfrac{\alpha}{2} T$ is the unique invariant family of connections, with duality $(\nabla^{(\alpha)})^* = \nabla^{(-\alpha)}$.
- **Campbell's extension.** On the *cone* of positive measures (dropping normalization) the invariant 2-tensor is the Fisher metric *plus* a rank-one term along the total-mass direction; restricting to the simplex kills the extra term and recovers Chentsov.
- **General/continuous version (Ay–Jost–Lê–Schwachhöfer).** For infinite $\mathcal{X}$ the right morphisms are **congruent Markov kernels**; a Markov kernel is used to pull back tensor fields, and the Fisher metric (with the Amari–Chentsov tensor) is characterized as the unique invariant $2$- (and $3$-) tensor field, giving Chentsov its modern, coordinate-free form.
- **Quantum caveat (Petz classification).** The classical uniqueness *fails* quantumly: there is a **whole family** of monotone Riemannian metrics on density matrices (Petz, 1996), each generated by an operator-monotone function, with the Bures/SLD and Kubo–Mori metrics as special members. Classically the answer is unique; quantumly "canonical" splinters — a sharp reminder of what Chentsov's rigidity buys.
- **Divergence dual.** Csiszár's characterization is the divergence-side companion: essentially the $f$-divergences are the divergences obeying the DPI, just as Fisher is the metric obeying it — two faces of the same invariance.

---

## Python Demo

```python
# numpy + matplotlib only.  Two experiments that operationalize Chentsov:
#
# PART A  MONOTONICITY / DATA-PROCESSING.  A 4-outcome family with scalar
#   parameter theta in (0,1) whose theta-dependence lives entirely in the
#   split between group {0,1} and group {2,3}:
#       p(theta) = [ theta*0.7 , theta*0.3 , (1-theta)*0.4 , (1-theta)*0.6 ]
#   Push it through two stochastic (Markov) maps and compare Fisher information:
#       T_suff : merge {0,1}->A , {2,3}->B    -> SUFFICIENT  (keeps ALL theta info)
#       T_lossy: merge {0,2}->C , {1,3}->D    -> LOSSY       (scrambles theta info)
#   Discrete Fisher information:  I(theta) = sum_x (dp_x/dtheta)^2 / p_x .
#   Expect:  I_suff == I_full  (equality for sufficient stats),
#            I_lossy  < I_full  (strict drop: processing cannot create info).
#
# PART B  REPARAMETERIZATION INVARIANCE.  Bernoulli(p), Fisher metric
#   G_p = 1/(p(1-p)).  Compare, for several distribution pairs:
#     * Euclidean distance in p-coords vs in logit-coords  -> COORDINATE DEPENDENT,
#     * Fisher-Rao length integrated in p-coords vs logit-coords -> SAME NUMBER,
#   matching the closed form  2*(arcsin sqrt(pB) - arcsin sqrt(pA)).
import numpy as np
import matplotlib.pyplot as plt

# ============================ PART A ============================
a0, a1 = 0.7, 0.3          # within-group-A split (constant in theta)
b0, b1 = 0.4, 0.6          # within-group-B split (constant in theta)

def p_full(th):
    return np.array([th*a0, th*a1, (1-th)*b0, (1-th)*b1])

# Markov morphisms as (out x in) 0/1 stochastic matrices
T_suff  = np.array([[1, 1, 0, 0],
                    [0, 0, 1, 1]], float)   # {0,1}->A , {2,3}->B   (sufficient)
T_lossy = np.array([[1, 0, 1, 0],
                    [0, 1, 0, 1]], float)   # {0,2}->C , {1,3}->D   (lossy)

def fisher_info(prob_fn, th, eps=1e-6):
    p  = prob_fn(th)
    dp = (prob_fn(th + eps) - prob_fn(th - eps)) / (2*eps)
    return np.sum(dp**2 / p)

thetas  = np.linspace(0.08, 0.92, 200)
I_full  = np.array([fisher_info(p_full, t) for t in thetas])
I_suff  = np.array([fisher_info(lambda t: T_suff  @ p_full(t), t) for t in thetas])
I_lossy = np.array([fisher_info(lambda t: T_lossy @ p_full(t), t) for t in thetas])

print("PART A -- data-processing inequality for Fisher information")
print(f"  max |I_suff  - I_full| = {np.max(np.abs(I_suff - I_full)):.2e}   (sufficient => EQUALITY)")
print(f"  min ( I_full - I_lossy) = {np.min(I_full - I_lossy):.4f}          (lossy => STRICT drop)")

# ============================ PART B ============================
def fr_closed(pa, pb):                       # Fisher-Rao closed form for Bernoulli
    return 2*abs(np.arcsin(np.sqrt(pb)) - np.arcsin(np.sqrt(pa)))

def fr_integral_p(pa, pb, n=20000):          # integrate sqrt(G_p) dp,  G_p = 1/(p(1-p))
    grid = np.linspace(pa, pb, n)
    return np.trapz(np.sqrt(1.0/(grid*(1-grid))), grid)

def fr_integral_logit(pa, pb, n=20000):      # same length, computed in phi = logit(p)
    phi = np.linspace(np.log(pa/(1-pa)), np.log(pb/(1-pb)), n)
    p   = 1.0/(1.0 + np.exp(-phi))
    dpdphi = p*(1-p)                          # Jacobian of the reparameterization
    G_phi  = (1.0/(p*(1-p))) * dpdphi**2      # tensor transform  => equals p(1-p)
    return np.trapz(np.sqrt(G_phi), phi)

pairs = [(0.50, 0.60), (0.05, 0.15), (0.85, 0.95), (0.10, 0.90)]
print("\nPART B -- Euclidean distance is coordinate-dependent; Fisher-Rao is invariant")
header = f"{'pair':>13} | {'Eucl p':>7} | {'Eucl logit':>10} | {'FR p':>7} | {'FR logit':>8} | {'FR exact':>8}"
print(header)
rows = []
for pa, pb in pairs:
    e_p   = abs(pb - pa)
    e_lg  = abs(np.log(pb/(1-pb)) - np.log(pa/(1-pa)))
    fr_p  = fr_integral_p(pa, pb)
    fr_lg = fr_integral_logit(pa, pb)
    fr_ex = fr_closed(pa, pb)
    rows.append((pa, pb, e_p, e_lg, fr_p, fr_lg, fr_ex))
    print(f"({pa:.2f},{pb:.2f})".rjust(13) +
          f" | {e_p:7.4f} | {e_lg:10.4f} | {fr_p:7.4f} | {fr_lg:8.4f} | {fr_ex:8.4f}")

# ============================ PLOTS ============================
fig, (axA, axB) = plt.subplots(1, 2, figsize=(12, 4.8))

axA.plot(thetas, I_full,  lw=3,   color='k',          label='I  full data')
axA.plot(thetas, I_suff, '--', lw=2, color='tab:green',
         label='I  after SUFFICIENT map  (equal)')
axA.plot(thetas, I_lossy, lw=2.5, color='tab:red',
         label='I  after LOSSY map  (strictly less)')
axA.fill_between(thetas, I_lossy, I_full, color='tab:red', alpha=0.12)
axA.set_xlabel('parameter theta'); axA.set_ylabel('Fisher information  I(theta)')
axA.set_title('Data-processing: Fisher info can only drop\nequality iff the statistic is sufficient')
axA.legend(fontsize=8); axA.set_ylim(0, float(np.max(I_full))*1.05)

lbls = [f"({r[0]:.2f},{r[1]:.2f})" for r in rows]
x = np.arange(len(rows)); w = 0.2
axB.bar(x - 1.5*w, [r[2] for r in rows], w, label='Euclidean in p',        color='tab:orange')
axB.bar(x - 0.5*w, [r[3] for r in rows], w, label='Euclidean in logit',    color='tab:purple')
axB.bar(x + 0.5*w, [r[4] for r in rows], w, label='Fisher-Rao (p coords)', color='tab:blue')
axB.bar(x + 1.5*w, [r[5] for r in rows], w, label='Fisher-Rao (logit coords)', color='tab:cyan')
axB.set_xticks(x); axB.set_xticklabels(lbls, fontsize=8)
axB.set_ylabel('distance')
axB.set_title('Euclidean distance is coordinate-dependent;\nFisher-Rao length is invariant')
axB.legend(fontsize=8)

plt.tight_layout()
plt.savefig('chentsov_invariance.png', dpi=120)
plt.show()
```

**What the output shows.** *Part A:* `I_suff` tracks `I_full` to machine precision (max deviation ~$10^{-7}$) — the sufficient merge $\{0,1\},\{2,3\}$ throws away *no* information about $\theta$, the equality case of the data-processing inequality. `I_lossy` sits strictly below (a gap of at least ~$3.6$ at $\theta=\tfrac12$, where $I_\text{full}=4$ but $I_\text{lossy}\approx0.36$): the merge $\{0,2\},\{1,3\}$ scrambles the informative split, and processing can only destroy information, never create it. That single graph *is* the property Chentsov elevates to a defining axiom. *Part B:* for each distribution pair the two "Euclidean" bars disagree wildly — the same pair is a very different Euclidean distance apart in $p$-coordinates versus logit-coordinates, so plain parameter distance is a coordinate artefact. The two Fisher-Rao bars are **identical** (and match the closed form), because the metric transforms as a tensor and its integrated arc length is coordinate-free. Only the invariant quantity is a legitimate measuring stick — exactly what Chentsov's theorem certifies is unique.

---

## Real-World Applications

> **Why the natural gradient is *the* natural gradient.** Amari's natural gradient preconditions the raw gradient by the inverse Fisher matrix, $G^{-1}\nabla\mathcal{L}$. Chentsov's theorem is the licence for the name: because Fisher is the unique invariant metric, natural-gradient steps are the unique reparameterization-invariant notion of steepest descent. K-FAC (deep nets) and TRPO / natural policy gradients (RL) approximate exactly this $G$, and their invariance guarantees trace directly back to Chentsov.

> **Choosing a prior with no arbitrary units — the Jeffreys prior.** The Jeffreys prior $\pi(\theta)\propto\sqrt{\det G(\theta)}$ is the invariant volume element of the Fisher metric. Its reparameterization invariance — the property Bayesians want in an "objective" prior — is precisely Chentsov's uniqueness cashed out: the volume form of any *other* metric would depend on how you coordinatized the model.

> **Model selection and MDL.** The stochastic-complexity / minimum-description-length penalty $\tfrac{d}{2}\log n + \log\int\sqrt{\det G}\,d\theta$ uses the Fisher volume of the model as its "number of distinguishable distributions." That count is meaningful only because the metric is the canonical, processing-invariant one — otherwise the model's complexity would change under a harmless relabelling.

> **Sufficiency and data reduction in practice.** Every time a pipeline replaces raw samples with a sufficient statistic (the sample mean and variance for a Gaussian, counts for a multinomial) it is invoking the equality case of Chentsov's monotonicity: no Fisher information — hence no attainable estimation precision — is lost. Lossy compression or quantization, by contrast, provably erodes it, which is why sensor and telemetry designers budget the loss explicitly.

> **Quantum metrology's missing uniqueness.** Because Petz showed the quantum case has a *family* of monotone metrics, experimentalists must *choose* one (usually the SLD / quantum Fisher information) and justify it operationally. The very fact that they must argue for it highlights, by contrast, how much the classical Chentsov theorem hands us for free.

---

## Common Pitfalls

- **"Invariant under any smooth reparameterization" is too weak.** The theorem's invariance is under **Markov morphisms and sufficient statistics**, not merely smooth coordinate changes. Many metrics are diffeomorphism-covariant; almost none survive *contraction under every stochastic map*. Quoting the weaker property understates — and misstates — what makes Fisher unique.
- **Forgetting "up to a positive scalar."** Uniqueness is only up to overall scale. Different $f$-divergences generate the Fisher metric with different constants $f''(1)$ (KL gives $1$, $\chi^2$ gives $2$, etc.). Two textbooks can print "the" Fisher metric differing by a factor and both be right; only ratios, angles, and geodesics are canonical.
- **Conflating the finite and continuous statements.** Chentsov (1972) proves it for **finite** sample spaces; the clean continuous/general theorem is the later **Ay–Jost–Lê–Schwachhöfer** result via congruent Markov kernels. On the non-normalized *cone* (Campbell) an extra mass-direction term appears — Fisher-alone uniqueness is a *simplex* statement.
- **Assuming "canonical" implies "unique everywhere."** Classically, yes; **quantumly, no** — Petz's classification gives infinitely many monotone metrics on density operators. "Canonical" is a theorem about a specific category (classical Markov morphisms), not a universal law of information.
- **Reading monotonicity as "always strict."** Processing does not *always* lose information — sufficient statistics hit **equality**. The inequality is strict only for genuinely lossy maps. The equality case is the whole point of sufficiency, and mislabelling every reduction as lossy misdiagnoses well-designed pipelines.
- **Believing invariance dictates the divergence too.** Chentsov fixes the *metric* (local, second-order) uniquely; globally there are still many monotone divergences — the entire $f$-divergence family. They agree only in the infinitesimal limit, which is exactly where Fisher lives.

---

## Related Concepts

*Cross-vault connections (Glob-verified):*

- [[Fisher_Information_and_the_Cramer_Rao_Bound]] — the object Chentsov crowns: this theorem is *why* the Fisher information deserves to be called the canonical metric rather than one estimator-theoretic quantity among many.
- [[Information_Inequalities_and_the_Data_Processing_Inequality]] — the DPI is the engine of the theorem; monotonicity of the Fisher metric is the metric-side shadow of the same "information cannot increase under processing" principle.
- [[Information_Bottleneck_and_Sufficient_Statistics]] — sufficiency is the *equality* case of Chentsov's monotonicity; this note develops the sufficient-statistic / lossless-reduction machinery the theorem hinges on.
- [[Relative_Entropy_and_Cross_Entropy]] — KL is the $f$-divergence whose local second-order expansion *is* the Fisher metric; its own monotonicity is the divergence-side companion to the theorem.
- [[Joint_Conditional_Entropy_and_Mutual_Information]] — mutual information and its data-processing inequality are the information-theoretic siblings of the metric contraction Chentsov demands.
- [[Statistical_Inference]] — the Fisher–Neyman factorization, sufficiency, and asymptotic efficiency are the inferential facts the theorem geometrizes.
- [[Common_Probability_Distributions]] — the Bernoulli, categorical, and Gaussian families on which the invariant metric is computed and the demo runs.
- [[Markov_Chains]] — Markov kernels (stochastic matrices) *are* the morphisms of the theorem; a single transition step is the prototypical data-processing map.
- [[Statistical_Manifolds]] — the spaces the theorem equips with their one canonical Riemannian structure.
- [[The_Alpha_Family_of_Connections]] — the connection analog: the $\alpha$-connections are the unique invariant family, singled out by the very same Markov-morphism principle via the Amari–Chentsov cubic tensor.
- [[Monoids_and_Monoidal_Categories]] — Markov categories (the categorical-probability home of stochastic maps) are symmetric monoidal; this is the modern language in which "invariant under Markov morphisms" becomes functorial.

*Section siblings in this vault (referenced in prose):* the theorem certifies the metric built in **The Fisher Information Metric**, extends to the connection structure of **Dual Affine Connections**, underwrites the integrated **The Fisher-Rao Distance**, matches the monotone-divergence story of **f-Divergences**, and grounds the program of reading **Divergences as Geometric Structure**.

---

## Review Questions

1. **(Secondary)** Using the "one honest referee" analogy, explain why a good distance between distributions must be blind to (a) renaming the outcomes and (b) summarizing data through a lossless tally, and why it must never make two distributions look *further* apart after you discard information. Which everyday metric — Euclidean distance in the parameters — fails these rules, and why?
2. **(Undergraduate)** In the demo's 4-outcome family, the merge $\{0,1\},\{2,3\}$ preserves the Fisher information while $\{0,2\},\{1,3\}$ strictly reduces it. Explain, via the Fisher–Neyman factorization, why the first grouping is a *sufficient* statistic for $\theta$ and the second is not — and connect this to the equality-vs-strict-inequality cases of the data-processing inequality.
3. **(Graduate)** State Chentsov's theorem precisely, including the meaning of "monotone under Markov morphisms" and the "up to a positive scalar" clause. Then contrast the classical result with Petz's quantum classification: why does uniqueness survive classically but shatter into a family of monotone metrics for density matrices, and what does that say about the word "canonical"? Finally, describe how the same invariance principle selects the $\alpha$-connections through the Amari–Chentsov tensor.

---

## Sources

- Chentsov (Čencov), N. N. (1972/1982). *Statistical Decision Rules and Optimal Inference.* Nauka (Russian, 1972); English translation, Translations of Mathematical Monographs 53, American Mathematical Society, 1982. — the original finite-sample uniqueness theorem.
- Campbell, L. L. (1986). *An extended Čencov characterization of the information metric.* Proceedings of the American Mathematical Society, 98(1), 135–141. — extension to non-normalized measures / the positive cone.
- Ay, N., Jost, J., Lê, H. V. & Schwachhöfer, L. (2017). *Information Geometry.* Springer. [DOI](https://doi.org/10.1007/978-3-319-56478-4) — modern general/continuous proof via congruent Markov kernels (see also their 2015 *Ann. Statist.* paper on the Fisher metric and Amari–Chentsov tensor).
- Amari, S. & Nagaoka, H. (2000). *Methods of Information Geometry.* AMS / Oxford University Press. — Chentsov's theorem, the $\alpha$-connections, and the cubic tensor in the information-geometry framework.
- Petz, D. (1996). *Monotone metrics on matrix spaces.* Linear Algebra and its Applications, 244, 81–96. — the quantum classification showing uniqueness fails for density operators.

---

#information-geometry #chentsov-theorem #invariance #fisher-metric #sufficient-statistics
