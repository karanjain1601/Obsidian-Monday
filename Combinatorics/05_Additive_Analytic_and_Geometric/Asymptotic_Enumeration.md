---
title: "Asymptotic Enumeration"
tags: [combinatorics, asymptotic-enumeration, stirlings-formula, growth-rates, approximation, saddle-point, singularity-analysis]
aliases: ["Asymptotic Enumeration", "Asymptotic Combinatorics", "Growth Rates of Counting Sequences", "Stirling's Formula", "Saddle-Point Method", "Singularity Analysis"]
created: 2026-08-02
domain: Combinatorics
difficulty: [Secondary, Undergraduate, Graduate]
related: ["[[Combinatorics]]", "[[Generating_Functions_and_Recurrences]]", "[[Sequences_and_Series]]", "[[Residue_Theorem_and_Applications]]", "[[Laurent_Series_and_Singularities]]", "[[Big_O_Notation]]", "[[Master_Theorem]]", "[[Entropy_and_Information_Content]]", "[[Partition_Functions_and_Free_Energy_in_ML]]"]
status: complete
---

# 📈 Asymptotic Enumeration

> [!abstract] TL;DR
> **Asymptotic enumeration** estimates the *large-$n$ behavior* of a counting sequence instead of its exact value — you rarely need to know that $10! = 3{,}628{,}800$, but you very much want to know that arrangements grow like $n!$ and, more usefully, **how fast**: Stirling's formula gives $n! \sim \sqrt{2\pi n}\,(n/e)^n$. Almost every combinatorial sequence settles into the universal shape **"exponential growth $\times$ polynomial (or subexponential) correction"**, $a_n \sim C\,\rho^{-n} n^{\alpha}$, and the machinery — Stirling, Laplace's method, the saddle-point method, and singularity analysis — is exactly what turns a hopeless-looking exact formula into a clean, illuminating growth law.

---

## Intuition

**Analogy:** Imagine you run a warehouse and someone asks *"how many ways can we arrange the 40 pallets on this rack?"* The exact answer, $40!$, is an 48-digit monster nobody can hold in their head or use. But if instead you ask *"roughly how does that number grow as we add pallets, and how does it compare to arranging 41?"*, you get something genuinely usable: it grows like $\sqrt{2\pi n}\,(n/e)^n$, so adding one pallet multiplies the count by about $n$. **Zoom out to the large-$n$ horizon and the incomprehensible exact count collapses into a simple growth law.**

That is the whole spirit of asymptotic enumeration. Exact formulas are often unavailable (there is *no* elementary closed form for the partition count $p(n)$) or unwieldy ($n!$, Bell numbers, Catalan numbers). Yet their *growth* is beautifully regular. Just as calculus replaces a wiggly curve by its tangent line near a point, asymptotic analysis replaces a counting sequence by its **dominant growth term** near infinity — keeping only what matters and throwing away lower-order noise. It is why factorials grow like Stirling's $\sqrt{2\pi n}\,(n/e)^n$, why the number of partitions explodes *sub-exponentially* like $e^{\pi\sqrt{2n/3}}$, and why the central binomial coefficient $\binom{2n}{n}$ — a ratio of three factorials — simplifies to the astonishingly clean $4^n/\sqrt{\pi n}$.

This note is the analytic backbone under the enumerative combinatorics you already know: it is where **Generating_Functions** stop being just bookkeeping and start *predicting* growth, where **Integer_Partitions** reveal their sub-exponential blow-up, where **Stirling_and_Bell_Numbers** get their asymptotics, and where **Analytic_Combinatorics** and the study of **Random_Discrete_Structures** take root.

---

## How It Works

### Core Mechanics

1. **Fix the goal: a *tilde* relation, not an equation.** We write $a_n \sim b_n$ to mean $\lim_{n\to\infty} a_n/b_n = 1$ — the two sequences agree *in the limit of relative error*. This is strictly stronger information than the crude $a_n = \Theta(b_n)$ of algorithm analysis (which only pins down growth up to constant factors) yet weaker than an exact formula. The sweet spot: enough precision to compare and compute, little enough to stay simple.

2. **Recognize the universal shape.** An overwhelming fraction of "nice" combinatorial sequences obey
   $$a_n \;\sim\; C\,\rho^{-n}\,n^{\alpha},$$
   an **exponential growth factor** $\rho^{-n}$ (the *growth rate*, set by the smallest singularity of the generating function) times a **polynomial correction** $n^{\alpha}$ (the *sub-exponential factor*, set by the *type* of that singularity), times a constant $C$. Read off $\rho$ and $\alpha$ and you know essentially everything.

3. **Stirling's formula — the atom of the whole subject.** Because factorials appear everywhere, the master estimate is
   $$n! \;\sim\; \sqrt{2\pi n}\,\Big(\frac{n}{e}\Big)^{n},\qquad\text{with refinement}\quad n! = \sqrt{2\pi n}\,\Big(\frac{n}{e}\Big)^{n}\!\left(1+\frac{1}{12n}+\frac{1}{288n^2}-\cdots\right).$$
   One clean derivation: $n! = \Gamma(n+1) = \int_0^\infty t^{n}e^{-t}\,dt$; the integrand $e^{n\ln t - t}$ peaks sharply at $t=n$, and expanding around that peak (a Gaussian bump of width $\sqrt{n}$) gives the $\sqrt{2\pi n}$ and $(n/e)^n$ directly. That "peak-and-Gaussian" trick *is* Laplace's method.

4. **Laplace's method — sums and integrals dominated by their largest term.** For an integral $\int e^{n\,\phi(t)}\,dt$ where $\phi$ has a unique interior maximum at $t_0$, only a $\sqrt{1/n}$-wide neighborhood of $t_0$ contributes; a quadratic (Gaussian) expansion yields
   $$\int e^{n\phi(t)}\,dt \;\sim\; e^{n\phi(t_0)}\sqrt{\frac{2\pi}{n\,|\phi''(t_0)|}}.$$
   The discrete analogue: a sum $\sum_k a_k$ whose terms rise then fall is $\sim$ (peak term) $\times$ (effective width). This alone cracks central binomial coefficients and many entropy-style counts.

5. **Saddle-point method (steepest descent) — for fast-growing sequences with no real peak.** When coefficients grow *very* fast (partitions $p(n)$, Bell numbers, involutions), extract them by Cauchy's integral $a_n = \frac{1}{2\pi i}\oint \frac{F(z)}{z^{n+1}}\,dz$ and deform the contour through a **saddle point** $z_0$ of the integrand (where the derivative of the exponent vanishes). Near $z_0$ the integrand is again a Gaussian bump — the same Laplace idea, now in the complex plane. This is what delivers the Hardy–Ramanujan $p(n)\sim \frac{1}{4n\sqrt3}\,e^{\pi\sqrt{2n/3}}$.

6. **Singularity analysis — read growth straight off the generating function.** From **Analytic_Combinatorics** (Flajolet–Sedgewick): the *location* of the dominant singularity $\rho$ of a generating function $F(z)=\sum a_n z^n$ fixes the exponential rate $a_n \approx \rho^{-n}$, and the *nature* of that singularity fixes the polynomial correction. The transfer theorem says if $F(z)\sim C\,(1-z/\rho)^{-\alpha}$ as $z\to\rho$, then
   $$a_n \;\sim\; \frac{C}{\Gamma(\alpha)}\,\rho^{-n}\,n^{\alpha-1}.$$
   A pole ($\alpha=1$) gives pure exponential growth; a square-root singularity ($\alpha=\tfrac12$, typical of trees) gives the ubiquitous $\rho^{-n} n^{-3/2}$; a logarithm gives a $1/n$ factor. **Geometry of the singularity $\Rightarrow$ shape of the growth.**

7. **The entropy method — counting bounds via information.** For combinatorial families indexed by proportions, $\binom{n}{pn} \sim \frac{2^{\,n\,H(p)}}{\sqrt{2\pi n\,p(1-p)}}$ where $H(p) = -p\log_2 p - (1-p)\log_2(1-p)$ is the binary entropy. Growth *rates* of many structures equal an **entropy**, tying enumeration directly to **Entropy_and_Information_Content** and to statistical mechanics, where $\log a_n$ plays the role of an entropy and the generating function plays the role of a partition function.

### Flow / Architecture

```mermaid
flowchart TD
    A["Exact count a_n<br/>factorial, binomial, p of n, Bell, Catalan<br/>correct but unusable for large n"] --> B{"Is there a<br/>generating function<br/>F of z equals sum a_n z to the n?"}
    B -- "No, but there is<br/>an integral or a sum" --> C["LAPLACE method<br/>peak dominates<br/>expand as a Gaussian bump<br/>width proportional to root n"]
    B -- "Yes, coefficients grow fast" --> D["SADDLE-POINT method<br/>Cauchy contour integral<br/>deform through saddle z0<br/>partitions, Bell, involutions"]
    B -- "Yes, singularity structure known" --> E["SINGULARITY ANALYSIS<br/>dominant singularity rho<br/>plus its type alpha"]
    C --> F["STIRLING formula<br/>n factorial approx root of 2 pi n times n over e to the n"]
    F --> G["Growth law<br/>a_n approx C times rho to the minus n times n to the alpha"]
    D --> G
    E --> G
    G --> H["Add refinement terms<br/>1 over 12 n and beyond<br/>track RELATIVE error going to zero"]
    H --> I["Usable growth law<br/>compare, predict, analyze algorithms"]
    style A fill:#dc2626,color:#fff
    style F fill:#2563eb,color:#fff
    style G fill:#059669,color:#fff
    style I fill:#d97706,color:#fff
```

---

## Key Concepts

### Secondary (high-school level)
- **Asymptotic = "for large $n$, roughly."** Instead of an exact count, you describe how the count *grows*. Saying "arrangements grow like $n!$" already tells you adding one item multiplies the total by about $n$.
- **The tilde $\sim$.** $a_n \sim b_n$ means the two get *proportionally* closer and closer: their ratio heads to $1$. It is a statement about **relative** closeness, not the absolute gap.
- **Stirling's formula, in words.** The number of orderings of $n$ things, $n!$, is close to $\sqrt{2\pi n}\,(n/e)^n$. Even for $n=10$ this is within about $0.8\%$ of the true value, and the error keeps shrinking.
- **Why bother.** Exact factorials and partition counts are gigantic and often have no tidy formula; the *growth law* is short, memorable, and enough to reason about scaling.

### Undergraduate
- **The asymptotic hierarchy.** $a_n = o(b_n)$ (negligible: ratio $\to 0$), $a_n = O(b_n)$ (bounded above up to a constant), $a_n = \Theta(b_n)$ (same order both ways), and the sharpest, $a_n \sim b_n$ (ratio $\to 1$). Only $\sim$ pins down the *constant*; big-$O$ deliberately hides it (see **Big_O_Notation**).
- **Stirling with correction.** $n! = \sqrt{2\pi n}(n/e)^n\big(1 + \tfrac{1}{12n} + \tfrac{1}{288n^2} - \cdots\big)$. The one-term version has relative error $\approx \tfrac{1}{12n}$; keeping $\tfrac{1}{12n}$ shrinks it to $\approx \tfrac{1}{288n^2}$. This is an **asymptotic series** — it need not converge, but truncating it gives excellent estimates.
- **Laplace's method.** $\int_a^b e^{n\phi(t)}dt \sim e^{n\phi(t_0)}\sqrt{2\pi/(n|\phi''(t_0)|)}$ for an interior max $t_0$. Derives Stirling from $\Gamma(n+1)$ and evaluates many exponential-integral counts.
- **Central binomial.** $\binom{2n}{n} = \frac{(2n)!}{(n!)^2} \sim \frac{4^n}{\sqrt{\pi n}}$ — plug Stirling into all three factorials and watch everything cancel to a clean $4^n$ growth with a $n^{-1/2}$ correction. This is the model example of "exponential $\times$ polynomial."
- **The canonical shape.** $a_n \sim C\,\rho^{-n} n^{\alpha}$. Here $\rho^{-1}$ is the **growth rate** and $\alpha$ the **subexponential exponent**; Catalan numbers give $\rho^{-1}=4,\ \alpha=-3/2$, i.e. $C_n \sim 4^n/(\sqrt\pi\, n^{3/2})$.

### Graduate
- **Saddle-point / steepest descent.** For $a_n = \frac{1}{2\pi i}\oint F(z)z^{-n-1}dz$, choose the radius through the saddle $z_0$ solving $z F'(z)/F(z) = n$, then Gaussian-expand along the steepest-descent direction. **Hayman admissibility** is a checkable sufficient condition automating this for "nice" entire $F$, yielding $a_n \sim \frac{F(z_0)}{z_0^{\,n}\sqrt{2\pi B(z_0)}}$.
- **Marquee saddle-point results.** Partitions $p(n)\sim \frac{1}{4n\sqrt3}e^{\pi\sqrt{2n/3}}$ (Hardy–Ramanujan; sub-exponential $e^{c\sqrt n}$ from an *essential* singularity at $z=1$); Bell numbers $B_n$ via $\exp(e^z-1)$; involutions via $\exp(z+z^2/2)$. Sub-exponential growth $e^{c\sqrt n}$ is the fingerprint of essential singularities, distinct from the $\rho^{-n}$ of poles/branch points.
- **Singularity analysis (Flajolet–Odlyzko transfer theorems).** On a $\Delta$-domain, $(1-z/\rho)^{-\alpha} \Rightarrow \frac{\rho^{-n}n^{\alpha-1}}{\Gamma(\alpha)}$, with logarithmic and iterated-log refinements. Square-root singularities from the smooth implicit-function schema give the universal **$n^{-3/2}$ tree law** shared by rooted trees, Catalan structures, and simple families of maps.
- **Limit laws / quasi-powers.** When a bivariate generating function has a singularity that moves *smoothly* with a secondary variable, Hwang's **quasi-powers theorem** yields a **Gaussian limit law** for the associated combinatorial parameter (number of parts, cycles, nodes) — the enumerative route to central limit theorems for **Random_Discrete_Structures**. Coalescing saddles produce **Airy**-type laws (e.g., map connectivity, path area).
- **Entropy and probabilistic bounds.** $\log_2\binom{n}{pn} = nH(p) - \tfrac12\log_2 n + O(1)$; more generally the exponential growth rate of a constrained family equals a maximum-entropy rate, the combinatorial shadow of the thermodynamic $S=\log W$ and of transfer-matrix / **Partition_Functions_and_Free_Energy_in_ML** computations.

---

## Python Demo

```python
# Asymptotic enumeration in action:
#   (a) Stirling's formula  n! ~ sqrt(2*pi*n) * (n/e)**n, plus the 1/(12n) refinement
#   (b) Central binomial    C(2n,n) ~ 4**n / sqrt(pi*n)
# We plot exact-vs-asymptotic values and the RELATIVE error shrinking to 0.
# Trick: work with LOG values (lgamma) so nothing overflows; relative error of the
# value is then  rel = 1 - exp(log_approx - log_exact), stable for all n.

import numpy as np
import matplotlib.pyplot as plt
from math import lgamma, log, pi

# ----- (a) Stirling ---------------------------------------------------------
n = np.arange(1, 121)

log_exact_fact = np.array([lgamma(k + 1) for k in n])          # log(n!) exactly
log_stirling   = 0.5*np.log(2*pi*n) + n*(np.log(n) - 1.0)      # log of leading term
log_stirling_r = log_stirling + np.log1p(1.0/(12.0*n))         # + 1/(12n) refinement

rel_err_lead = 1.0 - np.exp(log_stirling   - log_exact_fact)   # leading-term rel. error
rel_err_ref  = 1.0 - np.exp(log_stirling_r - log_exact_fact)   # refined rel. error

# ----- (b) Central binomial  C(2n,n) ~ 4^n / sqrt(pi n) ---------------------
m = np.arange(1, 81)
log_exact_cb = np.array([lgamma(2*k + 1) - 2*lgamma(k + 1) for k in m])  # log C(2m,m)
log_asym_cb  = m*np.log(4.0) - 0.5*np.log(pi*m)                          # log of asymptotic
rel_err_cb   = 1.0 - np.exp(log_asym_cb - log_exact_cb)

# ----- plot -----------------------------------------------------------------
fig, ax = plt.subplots(2, 2, figsize=(12, 8))

# top-left: log10(n!) exact vs Stirling  (curves overlap -> asymptotic is excellent)
ax[0, 0].plot(n, log_exact_fact/np.log(10), lw=6, alpha=0.35, label="log10(n!) exact")
ax[0, 0].plot(n, log_stirling /np.log(10), "--", lw=1.8, label="Stirling leading term")
ax[0, 0].set_title("(a) Stirling: n! vs sqrt(2 pi n)(n/e)^n")
ax[0, 0].set_xlabel("n"); ax[0, 0].set_ylabel("log10 of value"); ax[0, 0].legend()

# top-right: Stirling relative error, leading vs refined  (log-log, both -> 0)
ax[0, 1].loglog(n, rel_err_lead, "o-", ms=3, label="leading term  (~ 1/(12n))")
ax[0, 1].loglog(n, np.abs(rel_err_ref), "s-", ms=3, label="with 1/(12n)  (~ 1/(288 n^2))")
ax[0, 1].loglog(n, 1.0/(12.0*n), "k:", label="reference 1/(12n)")
ax[0, 1].set_title("(a) Stirling relative error -> 0")
ax[0, 1].set_xlabel("n"); ax[0, 1].set_ylabel("relative error"); ax[0, 1].legend()

# bottom-left: central binomial exact vs asymptotic (log10, overlapping)
ax[1, 0].plot(m, log_exact_cb/np.log(10), lw=6, alpha=0.35, label="log10 C(2n,n) exact")
ax[1, 0].plot(m, log_asym_cb /np.log(10), "--", lw=1.8, label="4^n / sqrt(pi n)")
ax[1, 0].set_title("(b) Central binomial: exact vs asymptotic")
ax[1, 0].set_xlabel("n"); ax[1, 0].set_ylabel("log10 of value"); ax[1, 0].legend()

# bottom-right: central binomial relative error -> 0  (matches the -1/(8n) prediction)
ax[1, 1].loglog(m, np.abs(rel_err_cb), "o-", ms=3, label="C(2n,n) relative error")
ax[1, 1].loglog(m, 1.0/(8.0*m), "k:", label="reference 1/(8n)")
ax[1, 1].set_title("(b) Central binomial relative error -> 0")
ax[1, 1].set_xlabel("n"); ax[1, 1].set_ylabel("relative error"); ax[1, 1].legend()

plt.tight_layout()
plt.savefig("asymptotic_enumeration.png", dpi=110)
print(f"Stirling  rel. error at n=10 : {rel_err_lead[9]:.3e}  (approx 1/120 = {1/120:.3e})")
print(f"Stirling  rel. error at n=120: {rel_err_lead[-1]:.3e}")
print(f"C(2n,n)   rel. error at n=10 : {rel_err_cb[9]:.3e}  (approx 1/80  = {1/80:.3e})")
```

**What you see.** In both left panels the exact and asymptotic curves are visually indistinguishable — the "growth-rate $\times$ polynomial-correction" law captures the sequence almost perfectly. In both right panels the relative error decays as a clean power of $n$ on the log-log axes: Stirling's leading term tracks the $1/(12n)$ reference line, the refined version drops to $\sim 1/(288n^2)$ (a steeper slope), and the central binomial error hugs the $1/(8n)$ prediction. The printout confirms Stirling is already within $\sim 0.8\%$ at $n=10$ and shrinks from there.

---

## Real-World Applications

- **Average-case analysis of algorithms and data structures.** The expected cost of Quicksort, hashing with chaining, the height of random binary search tries, and the running time of union-find all reduce to extracting the large-$n$ asymptotics of a counting sequence or generating function — Knuth's *Art of Computer Programming* and the Flajolet–Sedgewick program are built on exactly this. It is the rigorous layer *beneath* the worst-case reasoning of **Big_O_Notation** and the divide-and-conquer recurrences solved by the **Master_Theorem**.
- **Statistical mechanics and the partition function.** The number of microstates $W$ of a system grows like $e^{nS}$; computing an entropy $S$ *is* an asymptotic enumeration, and the transfer-matrix method for lattice models is singularity analysis in disguise (dominant eigenvalue = growth rate). This is the shared spine with **Partition_Functions_and_Free_Energy_in_ML**.
- **Probabilistic limit laws.** Quasi-powers and saddle-point analysis prove that the number of cycles of a random permutation, parts of a random partition, or nodes at a given depth in a random tree are asymptotically Gaussian — the enumerative origin of central limit theorems for **Random_Discrete_Structures**.
- **Coding, compression, and capacity.** The count of length-$n$ strings satisfying a constraint grows like $2^{nR}$ where $R$ is a channel/entropy rate; asymptotic enumeration computes these rates directly, linking to **Entropy_and_Information_Content**.
- **Computational number theory and physics simulation.** Estimating $p(n)$, counting lattice paths, self-avoiding walks, or Feynman diagrams — all rely on saddle-point and singularity methods to predict growth that would be impossible to tabulate exactly.

---

## Common Pitfalls

- **Asymptotic $\ne$ exact — and never will be.** $a_n \sim b_n$ guarantees the *ratio* $\to 1$, not that the difference $\to 0$. The absolute gap $n! - \sqrt{2\pi n}(n/e)^n$ actually *grows* without bound; it is the *relative* gap that vanishes. Confusing the two leads to badly wrong error claims.
- **Relative vs absolute error.** Always state which you mean. A method can have shrinking relative error while its absolute error explodes (Stirling), or vice versa. In enumeration, relative error is almost always the meaningful quantity because the numbers are astronomically large.
- **Keeping the wrong term.** In $C\rho^{-n}n^{\alpha}$ the exponential $\rho^{-n}$ dominates *everything*; a polynomial or even sub-exponential $e^{c\sqrt n}$ factor is negligible against it. Beginners often chase a lower-order correction while getting the growth rate $\rho$ wrong — a fatal error, since a wrong $\rho$ swamps any correction.
- **Trusting asymptotics at small $n$.** These formulas are guarantees *in the limit*. Stirling is superb by $n=10$, but many singularity-analysis estimates only kick in for $n$ in the hundreds; the $\Gamma$-function and $\Delta$-domain machinery can even give the wrong sign of a correction at tiny $n$. Always sanity-check against exact values in the accessible range.
- **Big-$O$ vs tilde $\sim$.** $a_n = O(n!)$ says almost nothing (a constant sequence is $O(n!)$); $a_n \sim n!$ is a precise, constant-pinning statement. Do not report a $\sim$ result when you have only proved an $O$ bound, and never drop the constant $C$ when the whole point was to find it.
- **Assuming a real maximum exists.** Laplace's method needs a genuine interior peak. Fast-growing coefficient sequences have *no* real peak on the natural interval — you must go to the complex plane and use the **saddle-point** method, or you will get nonsense.

---

## Related Concepts

- [[Combinatorics]] — the exact-counting foundation (factorials, binomials, permutations) whose sequences asymptotic enumeration then estimates for large $n$.
- [[Generating_Functions_and_Recurrences]] — the object whose *singularities* encode the growth rate; asymptotic enumeration is largely "read the coefficients off the generating function."
- [[Sequences_and_Series]] — supplies the limit definitions ($\sim$, $o$, Taylor/asymptotic series) that make "large-$n$ behavior" rigorous.
- [[Residue_Theorem_and_Applications]] — Cauchy's coefficient integral $\frac{1}{2\pi i}\oint F(z)z^{-n-1}dz$ is the entry point for the saddle-point method and contour deformation.
- [[Laurent_Series_and_Singularities]] — classifies the poles, branch points, and essential singularities whose *type* fixes the polynomial correction $n^{\alpha}$.
- [[Big_O_Notation]] — the coarser $O/\Theta$ growth language of algorithm analysis; asymptotic enumeration sharpens it to constant-precise $\sim$ estimates.
- [[Master_Theorem]] — solves divide-and-conquer recurrences; asymptotic enumeration handles the more general average-case counting recurrences underneath.
- [[Entropy_and_Information_Content]] — growth *rates* of constrained families equal entropies ($\binom{n}{pn}\sim 2^{nH(p)}$), tying counting to information.
- [[Partition_Functions_and_Free_Energy_in_ML]] — $\log$ of a count behaves like an entropy and the generating function like a partition function; the same saddle-point math governs both.

---

## Review Questions

1. **(Secondary)** Explain in words what $n! \sim \sqrt{2\pi n}(n/e)^n$ promises and what it does *not* promise. Why is knowing this growth law more useful in practice than knowing that $20! = 2{,}432{,}902{,}008{,}176{,}640{,}000$?
2. **(Undergraduate)** Starting from $\binom{2n}{n} = \frac{(2n)!}{(n!)^2}$, substitute Stirling's formula for all three factorials and show every factor cancels down to $\binom{2n}{n} \sim 4^n/\sqrt{\pi n}$. Which factor is the *growth rate* and which is the *polynomial correction*? What is the exponent $\alpha$ in the shape $C\rho^{-n}n^\alpha$?
3. **(Undergraduate/Graduate)** You are told sequence $a_n$ has generating function with a simple pole at $z=\tfrac13$, and sequence $b_n$ has a square-root branch point at $z=\tfrac13$. Both have the *same* growth rate $\rho^{-1}=3$. How do their sub-exponential corrections differ, and how would that difference show up in a log-log plot of $a_n/3^n$ versus $b_n/3^n$?
4. **(Graduate)** The partition count grows like $p(n)\sim \frac{1}{4n\sqrt3}e^{\pi\sqrt{2n/3}}$ — a sub-exponential $e^{c\sqrt n}$ rather than $\rho^{-n}$. Why does Laplace's method on the real axis fail here, what feature of the generating function $\prod_k (1-z^k)^{-1}$ forces the saddle-point method, and what does "the singularity at $z=1$ is essential" have to do with the $\sqrt n$ in the exponent?

---

## Sources

- [Flajolet & Sedgewick, *Analytic Combinatorics* (Cambridge, 2009) — full PDF](https://algo.inria.fr/flajolet/Publications/book.pdf) — the definitive treatment of singularity analysis, saddle-point method, and quasi-powers limit laws.
- [Odlyzko, *Asymptotic Enumeration Methods* (Handbook of Combinatorics, ch. 22)](https://www-users.cse.umn.edu/~odlyzko/doc/asymptotic.enum.pdf) — the standard survey of the whole toolkit, from elementary estimates to steepest descent.
- de Bruijn, *Asymptotic Methods in Analysis* (Dover, 1981) — the classic, exceptionally readable introduction to Laplace's method and saddle points.
- Graham, Knuth & Patashnik, *Concrete Mathematics* (2nd ed., 1994), ch. 9 "Asymptotics" — Stirling's formula, the $O$/$o$/$\sim$ hierarchy, and asymptotic series with worked problems.
- [Wikipedia: Stirling's approximation](https://en.wikipedia.org/wiki/Stirling%27s_approximation) — multiple derivations (Laplace, Euler–Maclaurin) and the refinement series with error bounds.

---

#combinatorics #asymptotic-enumeration #stirlings-formula #growth-rates #approximation
