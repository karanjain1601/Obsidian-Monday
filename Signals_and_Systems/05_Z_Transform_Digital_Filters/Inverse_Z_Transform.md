---
title: "Inverse Z-Transform"
aliases: ["IZT", "Inverse Z Transform", "Partial Fractions Z-transform"]
tags: [signals-and-systems, z-transform, intermediate]
domain: Signals and Systems
difficulty: intermediate
created: 2026-07-27
related: ["[[Z_Transform]]", "[[Z_Transform_Properties]]", "[[Partial_Fraction_Expansion]]", "[[Inverse_Laplace_Transform]]"]
status: complete
---

# 🔄 Inverse Z-Transform

> [!abstract] TL;DR
> The inverse Z-transform recovers x[n] from X(z). Three methods exist: partial fraction expansion (PFE) for rational X(z), long division for causal power-series expansion, and contour integration (the formal inverse). PFE is the dominant technique: factor X(z)/z into known pairs from the Z-transform table. Critically, the ROC determines whether each pole contributes a causal (aⁿu[n]) or anti-causal (−aⁿu[−n−1]) term — the algebra is the same, but the ROC chooses the physics.

---

## Intuition — Analogy First

PFE for the inverse Z-transform is just like partial fractions in calculus, except the "atoms" are not 1/(s+a) but z/(z−a). The trick is to work with X(z)/z (not X(z) itself), expand into simple fractions of 1/(z−pₖ), then multiply back through by z to get terms of the form Aₖ·z/(z−pₖ), which directly match the table entry aⁿu[n] ↔ z/(z−a). Long division is like polynomial division — you find x[0], x[1], x[2], ... one term at a time by dividing the numerator polynomial by the denominator in powers of z^(−1).

---

## How It Works — Method Selection Flowchart

```mermaid
flowchart TD
    A["Given X(z) and ROC"] --> B{Is X(z) rational\nN(z)/D(z)?}
    B -->|Yes| C{Need closed-form\nformula for x[n]?}
    B -->|No| F["Contour integration\n(advanced)"]
    C -->|Yes| D["Partial Fraction\nExpansion (PFE)\n→ sum of known pairs"]
    C -->|No, just first\nfew samples| E["Long Division\n(Power Series)\n→ x[0], x[1], x[2], ..."]
    D --> G["Apply ROC:\ncausal pole → aⁿu[n]\nanti-causal → −aⁿu[−n−1]"]
    E --> H["Read off coefficients\nof z^0, z^-1, z^-2, ..."]

    style D fill:#d4edda,stroke:#28a745
    style E fill:#d1ecf1,stroke:#17a2b8
    style F fill:#fff3cd,stroke:#ffc107
```

---

## Key Concepts / Details

### Method 1: Partial Fraction Expansion (PFE)

**Setup**: Write X(z) as a ratio of polynomials in z (not z^(−1)) first. Then form X(z)/z and expand into first-order fractions:

$$\frac{X(z)}{z} = \sum_{k=1}^{N} \frac{A_k}{z - p_k} + \text{(repeated pole terms)}$$

**Residue formula for distinct poles**:
$$A_k = (z - p_k) \frac{X(z)}{z}\bigg|_{z = p_k}$$

Multiply through by z:
$$X(z) = \sum_{k=1}^{N} \frac{A_k z}{z - p_k}$$

Each term $A_k z/(z-p_k)$ maps to $A_k p_k^n u[n]$ (causal, if |z|>|pₖ| is in ROC) or $-A_k p_k^n u[-n-1]$ (anti-causal, if |z|<|pₖ| is in ROC).

---

#### Worked Example — Distinct Poles

$$X(z) = \frac{z}{z^2 - \frac{3}{2}z + \frac{1}{2}}, \quad |z|>1$$

**Step 1**: Factor the denominator.
$$z^2 - \tfrac{3}{2}z + \tfrac{1}{2} = 0 \implies z = \frac{\frac{3}{2} \pm \sqrt{\frac{9}{4} - 2}}{2} = \frac{\frac{3}{2} \pm \frac{1}{2}}{2}$$
$$\therefore \quad z_1 = 1, \quad z_2 = \frac{1}{2}$$
$$X(z) = \frac{z}{(z-1)(z-\tfrac{1}{2})}$$

**Step 2**: Form X(z)/z and apply PFE.
$$\frac{X(z)}{z} = \frac{1}{(z-1)(z-\tfrac{1}{2})} = \frac{A_1}{z-1} + \frac{A_2}{z-\tfrac{1}{2}}$$

$$A_1 = (z-1) \cdot \frac{1}{(z-1)(z-\tfrac{1}{2})}\bigg|_{z=1} = \frac{1}{1 - \tfrac{1}{2}} = 2$$

$$A_2 = (z-\tfrac{1}{2}) \cdot \frac{1}{(z-1)(z-\tfrac{1}{2})}\bigg|_{z=1/2} = \frac{1}{\tfrac{1}{2}-1} = -2$$

**Step 3**: Reconstruct X(z).
$$X(z) = \frac{2z}{z-1} - \frac{2z}{z-\tfrac{1}{2}}$$

**Step 4**: Apply the ROC |z|>1 (causal, both poles inside ROC boundary).
$$x[n] = 2 \cdot (1)^n u[n] - 2 \cdot \left(\tfrac{1}{2}\right)^n u[n] = 2\left[1 - \left(\tfrac{1}{2}\right)^n\right] u[n]$$

**Verification** (initial value): lim_{z→∞} X(z) = lim_{z→∞} z/(z²−...) = 0. And x[0] = 2(1−1)=0. ✓  
**Verification** (final value): lim_{z→1}(z−1)·z/((z−1)(z−1/2)) = lim_{z→1} z/(z−1/2) = 1/(1/2) = 2. And x[∞] = 2(1−0) = 2. ✓

---

#### Repeated Poles

For a pole pₖ of order r:
$$\frac{X(z)}{z} = \frac{B_r}{(z-p_k)^r} + \frac{B_{r-1}}{(z-p_k)^{r-1}} + \cdots + \frac{B_1}{z-p_k} + \cdots$$

The coefficients are found by:
$$B_m = \frac{1}{(r-m)!} \frac{d^{r-m}}{dz^{r-m}}\left[(z-p_k)^r \frac{X(z)}{z}\right]_{z=p_k}$$

The inverse of $z^r/(z-p)^r$ gives terms like $\binom{n}{r-1} p^{n-r+1} u[n]$ for the causal case.

---

#### Complex Conjugate Poles

For real x[n], complex poles come in conjugate pairs p = re^(jθ) and p* = re^(−jθ). Rather than using complex A_k coefficients, combine the pair:
$$\frac{A \cdot z}{z - re^{j\theta}} + \frac{A^* \cdot z}{z - re^{-j\theta}} \longleftrightarrow 2|A| r^n \cos(\theta n + \angle A) u[n]$$

---

### Method 2: Long Division (Power Series)

Divide numerator by denominator in ascending powers of z^(−1) to obtain:
$$X(z) = x[0] + x[1]z^{-1} + x[2]z^{-2} + \cdots$$

**Example**: X(z) = 1/(1 − 0.5z^(−1)) for |z|>0.5

Perform polynomial long division:

```
1 ÷ (1 - 0.5z^{-1}) = 1 + 0.5z^{-1} + 0.25z^{-2} + 0.125z^{-3} + ...

Step 1: 1 / 1 = 1. Remainder: 1 - (1 - 0.5z^{-1}) = 0.5z^{-1}
Step 2: 0.5z^{-1} / 1 = 0.5z^{-1}. Remainder: 0.5z^{-1} - (0.5z^{-1} - 0.25z^{-2}) = 0.25z^{-2}
Step 3: 0.25z^{-2} / 1 = 0.25z^{-2}. Remainder: 0.25z^{-3}...
```

Reading off: x[0]=1, x[1]=0.5, x[2]=0.25, ... → x[n] = (0.5)ⁿ u[n]. ✓

**Left-sided (anti-causal) signals**: divide in ascending powers of z (not z^(−1)) to get ..., x[−2]z², x[−1]z, x[0].

---

### Method 3: Contour Integration

The formal inverse is given by:
$$x[n] = \frac{1}{2\pi j} \oint_C X(z) z^{n-1} dz$$

where C is a counterclockwise closed contour in the ROC enclosing the origin. By the residue theorem:
$$x[n] = \sum_k \text{Res}\left[X(z) z^{n-1}\right]_{z=p_k}$$

This is the most general method but is rarely needed in practice — PFE gives the same result more efficiently.

---

## Python: Symbolic PFE with SymPy

```python
import sympy as sp
import numpy as np

z = sp.Symbol('z')

# X(z) = z / (z^2 - 3z/2 + 1/2)
X = z / (z**2 - sp.Rational(3, 2)*z + sp.Rational(1, 2))

# Partial fraction decomposition (w.r.t. z)
Xpf = sp.apart(X, z)
print("Partial fractions:")
print(Xpf)
# Output: 2*z/(z - 1) - 2*z/(z - 1/2)

# Verify by recombining
print("\nVerification (recombine):")
print(sp.simplify(Xpf - X))  # Should be 0

# Numerical long division approach for first 6 samples
from numpy.polynomial import polynomial as P

b = np.array([0, 1.0])        # numerator: z = 0*z^0 + 1*z^1 → coeffs [0, 1] in ascending z powers
# Actually let's use z^{-1} form:
# X(z) = z^{-1} / (1 - 3/2*z^{-1} + 1/2*z^{-2})
b_zinv = np.array([0.0, 1.0])         # numerator in z^{-1}: 0 + z^{-1}
a_zinv = np.array([1.0, -1.5, 0.5])   # denominator: 1 - 1.5z^{-1} + 0.5z^{-2}

# Compute impulse response (= x[n] since input is delta)
from scipy import signal as sig
impulse = np.zeros(8); impulse[0] = 1.0
x_n = sig.lfilter(b_zinv, a_zinv, impulse)
print("\nx[n] from long division (first 8 samples):")
print(np.round(x_n, 4))
# Verify against closed form: 2*(1)^n - 2*(0.5)^n
n_vals = np.arange(8)
x_closed = 2*(1.0)**n_vals - 2*(0.5)**n_vals
print("Closed form x[n]:")
print(np.round(x_closed, 4))
print("Match:", np.allclose(x_n, x_closed))  # True
```

---

## Real-World Notes

- PFE is used internally by `scipy.signal.residuez` to convert a transfer function H(z) into partial fractions for analysis.
- Long division gives the impulse response samples directly — this is how `scipy.signal.lfilter` effectively computes the output sample-by-sample.
- Symbolic CAS tools (SymPy, Mathematica) automate PFE but may return results in z^(+n) convention — always verify the convention before reading off x[n].
- In digital audio, all-pole IIR filters (reverb, formant synthesis) are inverted via PFE to find their time-domain impulse responses for convolution-based auralisation.
- The ROC choice becomes critical in two-sided sequence design (e.g., non-causal audio effects requiring look-ahead buffering).

---

## Common Pitfalls

- **Forgetting to form X(z)/z**: A common error is applying PFE directly to X(z), yielding terms A_k/(z−pₖ) whose inverse is not a standard table entry. Always divide by z first, then multiply back.
- **ROC determines the signal, not just the algebra**: The same PFE algebra with a different ROC region selects anti-causal (u[−n−1]) instead of causal (u[n]) inverse. Confusing these gives a completely different x[n].
- **Improper fraction**: If degree(numerator) ≥ degree(denominator), do polynomial division first to isolate the proper part, then apply PFE to the remainder. Forgetting this introduces phantom terms.
- **Long division convergence direction**: For right-sided sequences, divide in z^(−1); for left-sided, divide in z. Using the wrong direction gives a series that diverges in the ROC.
- **Complex conjugate arithmetic errors**: When poles are complex, compute Aₖ in complex form first, then take 2·Re to combine the pair.

---

## Related Concepts

- [[Z_Transform]] — Transform pairs used as PFE "atoms"
- [[Z_Transform_Properties]] — The shift and scaling properties used in PFE reconstruction
- [[Inverse_Laplace_Transform]] — Identical PFE procedure in continuous time
- [[Digital_Filter_Design]] — H(z) inversion to find h[n] and check filter stability

---

## Review Questions

1. Find the inverse Z-transform of $X(z) = \dfrac{z^2}{(z-0.5)(z-2)}$ for each of the three possible ROCs: |z|>2, |z|<0.5, and 0.5<|z|<2. In which case is x[n] two-sided?
2. Use long division to find the first four samples x[0], x[1], x[2], x[3] of the inverse Z-transform of $X(z) = \dfrac{1+z^{-1}}{1 - 0.9z^{-1}}$ for |z|>0.9.
3. X(z) = (z² + 2z)/((z−1)²(z+0.5)) has a repeated pole at z=1. Set up the partial fraction expansion (but do not solve) and explain how the coefficient B₂ for the squared term is computed via differentiation.

---

## Sources

- Oppenheim & Schafer, *Discrete-Time Signal Processing*, 3rd ed., Sections 3.3–3.4
- Proakis & Manolakis, *Digital Signal Processing*, 4th ed., Sections 3.3–3.5
- Phillips, Parr & Riskin, *Signals, Systems, and Transforms*, 4th ed., Chapter 10

#signals-and-systems #z-transform #inverse-z-transform #partial-fractions #long-division
