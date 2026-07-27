---
title: "Complex Analysis — Map of Content"
aliases: ["Complex Analysis MOC", "complex analysis overview"]
tags: [mathematics, complex-analysis, moc]
domain: Mathematics
difficulty: intermediate
created: 2026-07-27
related: ["[[Complex_Numbers_and_Functions]]", "[[Holomorphic_Functions]]", "[[Cauchy_Theorem_and_Integral_Formula]]", "[[Laurent_Series_and_Singularities]]", "[[Residue_Theorem_and_Applications]]"]
status: complete
---

# ℂ Complex Analysis — Map of Content

> [!abstract] Overview
> Complex analysis is the study of functions of a complex variable. It is one of the most elegant areas of mathematics: a single assumption (holomorphicity) unlocks infinite differentiability, power series representations, and the Residue Theorem — a formula that evaluates real integrals via imaginary residues. The key insight is that complex differentiability is far more rigid than real differentiability, and this rigidity produces remarkable theorems.

---

## Learning Path

```mermaid
graph LR
    A["🔢 Complex Numbers<br/>& Functions"] --> B["🔬 Holomorphic<br/>Functions"]
    B --> C["🔄 Cauchy Theorem<br/>& Integral Formula"]
    C --> D["📐 Laurent Series<br/>& Singularities"]
    D --> E["🎯 Residue Theorem<br/>& Applications"]
    style A fill:#2563eb,color:#fff
    style B fill:#7c3aed,color:#fff
    style C fill:#059669,color:#fff
    style D fill:#dc2626,color:#fff
    style E fill:#d97706,color:#fff
```

---

## Notes in This Section

| Note | Difficulty | Key Concepts |
|------|-----------|--------------|
| [[Complex_Numbers_and_Functions]] | Intermediate | $z=a+bi$, polar form, Euler's formula, branch cuts |
| [[Holomorphic_Functions]] | Advanced | Cauchy-Riemann equations, harmonic functions, power series |
| [[Cauchy_Theorem_and_Integral_Formula]] | Advanced | $\oint f\,dz=0$, integral formula, Liouville, fund. theorem of algebra |
| [[Laurent_Series_and_Singularities]] | Advanced | Poles, essential singularities, residues, Casorati-Weierstrass |
| [[Residue_Theorem_and_Applications]] | Advanced | Residue theorem, real integrals, argument principle, Rouché |

---

## Conceptual Architecture

### The Central Chain of Logic
1. **Holomorphic** = complex differentiable in a neighborhood (Cauchy-Riemann equations)
2. **Cauchy's theorem**: holomorphic on simply connected domain $\Rightarrow$ $\oint f\,dz = 0$
3. **Cauchy Integral Formula**: value anywhere = boundary integral ÷ $2\pi i$
4. **Consequence**: holomorphic $\Rightarrow$ infinitely differentiable $\Rightarrow$ = power series
5. **Singularities**: classified via Laurent series (removable / pole / essential)
6. **Residue Theorem**: generalizes Cauchy to domains with singularities

### Key Theorems at a Glance

| Theorem | Statement |
|---------|-----------|
| Cauchy's Theorem | $\oint_\gamma f\,dz = 0$ (simply connected, no singularities) |
| Cauchy Integral Formula | $f(z_0) = \frac{1}{2\pi i}\oint \frac{f(z)}{z-z_0}\,dz$ |
| Liouville's Theorem | Bounded entire $\Rightarrow$ constant |
| Fundamental Theorem of Algebra | Every polynomial over $\mathbb{C}$ has a root |
| Maximum Modulus Principle | $|f|$ has no interior maximum |
| Residue Theorem | $\oint f\,dz = 2\pi i \sum \text{Res}(f, z_k)$ |
| Casorati-Weierstrass | Near essential singularity, image is dense in $\mathbb{C}$ |

---

## Prerequisites
- Real analysis (limits, continuity, differentiation, integration)
- Multivariable calculus (partial derivatives, line integrals)
- Basic topology (open/closed sets, connectedness)

## What Comes Next
- **Riemann mapping theorem** — every simply connected proper domain is biholomorphic to the unit disk
- **Several complex variables** — $\mathbb{C}^n$ analysis, dramatically different behavior
- **Riemann surfaces** — making multi-valued functions single-valued by building the right domain
- **Analytic number theory** — the Riemann zeta function, prime number theorem via complex analysis

---

## Quick Reference: Residue Formulas

$$\text{Simple pole: } \text{Res}(f, z_0) = \lim_{z \to z_0}(z-z_0)f(z)$$

$$\text{Pole of order }m\text{: } \text{Res}(f,z_0) = \frac{1}{(m-1)!}\lim_{z\to z_0}\frac{d^{m-1}}{dz^{m-1}}\left[(z-z_0)^m f(z)\right]$$

$$\frac{p(z)}{q(z)}\text{ simple pole: } \text{Res} = \frac{p(z_0)}{q'(z_0)}$$

---

#complex-analysis #moc #mathematics
