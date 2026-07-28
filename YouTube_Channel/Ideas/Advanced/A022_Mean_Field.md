---
title: "The Simplest Many-Body Approximation (Mean Field Theory)"
id: A022
difficulty: 8/10
prereq: "None"
concept: "Mean field theory: replace all interactions on one spin with an average field h_eff = Jz<m> (z = coordination number); self-consistency equation: <m> = tanh(β(h + Jz<m>)); captures phase transition but misses fluctuations; exact as d→∞."
tags: [mean-field-theory, Ising-model, phase-transition, self-consistency, statistical-mechanics, magnetism, canvas, many-body]
category: advanced
type: video-idea
---

# The Simplest Many-Body Approximation (Mean Field Theory)

**Alt title:** "How to Tame Infinite Interactions with a Single Number"
**Difficulty:** 8/10 | **Prereq:** Statistical mechanics, Python/NumPy, basic thermodynamics

---

## Opening Hook (0:00–1:00)

"Every physics problem with more than two particles is fundamentally unsolvable — at least exactly. Three particles under mutual gravity: no closed-form solution. Ten electrons in a molecule: intractable. A billion spins on a magnet: impossible. So what do physicists do? They lie — systematically and brilliantly."

A spinning magnet appears. Below it: a lattice of 1000 arrows pointing up or down — a ferromagnet. "When you try to explain why magnets exist, you need to know what every spin feels from every neighbor. But the neighbors are also fluctuating. Which depends on their neighbors. Which depends on their neighbors. It's an infinite regression. Mean field theory cuts through this by saying: forget about fluctuations. Replace every neighbor with its average. Take the average of averages. The self-consistency condition that results captures the essential physics of phase transitions — with a single equation."

The equation appears: m = tanh(β·J·z·m). "One equation. One unknown. Dozens of physical predictions."

---

## The Naive Attempt

The naive approach: try to compute the partition function of the full interacting Ising model on a 10×10 lattice by exact enumeration.

```python
import numpy as np
from itertools import product

# Exact enumeration of Ising model: 2^N states
# For N=10x10 = 100 spins: 2^100 ≈ 10^30 states. HOPELESS.
# Let's try N=16 (4x4) to see the pattern break

N = 16
L = 4  # 4x4 grid
J = 1.0
h = 0.0
kT = 2.0   # temperature
beta = 1.0 / kT

# Generate all 2^16 = 65536 spin configurations
# Spins: +1 or -1
all_configs = list(product([-1, 1], repeat=N))
print(f"Total configurations for N={N}: {len(all_configs)}")
# For N=100: 2^100 ~ 10^30. We can't even list them.

def energy(config, L, J, h):
    """Compute Ising energy for a 1D list of spins on LxL grid."""
    E = 0.0
    config = np.array(config).reshape(L, L)
    for i in range(L):
        for j in range(L):
            # Right neighbor
            E -= J * config[i, j] * config[i, (j+1)%L]
            # Down neighbor
            E -= J * config[i, j] * config[(i+1)%L, j]
            # External field
            E -= h * config[i, j]
    return E

# Compute partition function by brute force
Z = 0.0
for config in all_configs:
    E = energy(config, L, J, h)
    Z += np.exp(-beta * E)

# Magnetization per spin
M = 0.0
for config in all_configs:
    E = energy(config, L, J, h)
    m_config = np.sum(config)
    M += m_config * np.exp(-beta * E)
M /= (Z * N)

print(f"4x4 Ising exact: <m> = {M:.4f} at kT={kT}")
print(f"Runtime for N=100: ~10^30 operations. Universe is 4x10^17 seconds old.")
print(f"Even at 10^15 ops/sec: 10^15 seconds. Forget it.")
```

Running this: for N=16 it completes in a second. But the video makes clear: every extra spin doubles the problem. For N=100 (10×10) you would need more time than the age of the universe. Exact diagonalization is dead.

---

## The Moment of Failure

The code crashes — not with an error, but with time. Show the runtime scaling: a bar chart of N=4,8,12,16,20 exponential growth. At N=24: estimated runtime exceeds 1000 years. "This is the curse of dimensionality for many-body systems. Hilbert space grows exponentially. We need a completely different strategy."

Then show what happens when you try a Monte Carlo (Metropolis) simulation on the full 100×100 grid without understanding the physics: the simulation gets stuck at low temperature because single-spin flips cannot escape the ferromagnetic phase. The system freezes. The energy drops to a metastable state and never escapes. "Even Metropolis fails without knowing what to look for. We need to understand the physics first. That's where mean field theory comes in."

---

## Why It Broke — The Physics

The Ising model Hamiltonian:
$$H = -J \sum_{\langle i,j \rangle} s_i s_j - h \sum_i s_i$$

The partition function Z = Σ_{all configs} e^{-βH} is a sum over 2^N terms. The mean magnetization requires summing m·e^{-βH} over all configs. Computationally intractable.

The physical insight: each spin s_i sees a local field from its z nearest neighbors. In 2D square lattice z=4. The exact local field on spin i is:
$$h_i^{local} = J \sum_{j \in \text{neighbors of } i} s_j$$

The problem: the s_j themselves fluctuate. They are correlated with s_i (they feel s_i's field too). This correlation is what makes the exact problem hard — you need the joint distribution P(s_i, s_j, s_k, ...).

Mean field theory replaces the fluctuating neighbors with their thermal average:
$$h_i^{local} \approx h_{eff} = J z \langle s \rangle = J z m$$

This is a variational approximation: it ignores fluctuations (⟨s_i s_j⟩ ≠ ⟨s_i⟩⟨s_j⟩ in reality) but becomes exact as z→∞ (infinite dimensions) because each spin has infinitely many weakly-coupled neighbors and the law of large numbers applies.

---

## The One Concept

**Mean field theory (MFT)** is an approximation that replaces the many-body problem with a single-body problem in a self-consistently determined effective field. It trades an exact treatment of correlations for tractability, capturing the qualitative physics of phase transitions at the cost of quantitative accuracy near the critical point.

**Derivation from the variational principle.** The Gibbs free energy F[q] = -kT ln Z is minimized by the true equilibrium distribution p(config) ∝ e^{-βH}. Mean field theory approximates p by the best factorizable distribution q(s_1,...,s_N) = ∏_i q_i(s_i) — each spin independent. The variational free energy is:
$$F_{MF} = \langle H \rangle_q + kT \sum_i \langle \ln q_i \rangle_{q_i}$$

Minimizing over q_i gives q_i(s_i) = exp(β h_{eff} s_i) / Z_i, with h_{eff} = h + Jz⟨s⟩. This is exactly a single spin in an effective field h_{eff}. The self-consistency equation follows from ⟨s_i⟩ = ⟨s⟩ = m:
$$m = \tanh(\beta(h + Jzm))$$

This is the central result. One equation in one unknown m.

**Solving the self-consistency equation.** Graphically: plot f(m) = tanh(β(h+Jzm)) and g(m) = m. For h=0 and β < β_c = 1/(Jz), only m=0 solution (paramagnetic). For β > β_c, three solutions emerge: m=0 (unstable) and ±m* (stable ferromagnetic). The transition is second-order: m grows continuously from zero at T_c = Jz/k_B.

Near T_c, expand tanh(x) ≈ x - x³/3:
$$m \approx \beta_c Jz m - \frac{(\beta_c Jz)^3 m^3}{3} \quad \Rightarrow \quad m \propto (T_c - T)^{1/2}$$

The mean field critical exponent β = 1/2. The exact 2D Ising critical exponent is β = 1/8 (Onsager solution). Mean field overestimates β by a factor of 4. The Ginzburg criterion tells us when MFT fails: when fluctuations are comparable to the order parameter itself — this happens in dimension d < d_c = 4 (upper critical dimension for Ising).

**Thermodynamic properties.** From the mean field free energy per spin:
$$f_{MF} = -\frac{Jzm^2}{2} - \frac{1}{\beta}\ln[2\cosh(\beta(h+Jzm))]$$

Specific heat: C = -T ∂²f/∂T² shows a jump discontinuity at T_c (exact Ising: logarithmic divergence). Susceptibility χ = ∂m/∂h|_{h=0} ~ (T-T_c)^{-1} (MFT exponent γ=1, exact 2D: γ=7/4).

**When does MFT work?** (1) Exactly in d→∞ (each spin has ∞ neighbors, fluctuations ∝ 1/√z → 0). (2) Exactly at d ≥ d_c (Ising d_c=4). (3) Qualitatively correct in 3D (captures transition, wrong exponents). (4) Qualitatively wrong in 2D (transition exists, exponents very wrong). (5) Wrong in 1D — 1D Ising has no phase transition at T>0, but MFT predicts one. (6) Exact for all-to-all coupling (Curie-Weiss model), used for neural networks (Hopfield model). Mean field theory is the starting point for more sophisticated approximations: Bethe lattice, fluctuation corrections (Ginzburg-Landau), renormalization group.

**Real-world applications.** Landau theory of phase transitions (superconductivity, liquid crystals, superfluidity) is generalized mean field theory. Hartree-Fock in quantum mechanics is mean field theory for electrons. The Weiss molecular field model of ferromagnetism is the original mean field theory (1907). The Hopfield neural network uses mean field equations for memory retrieval. BCS theory of superconductivity is a mean field theory for Cooper pairs. Everywhere many-body physics is intractable, mean field theory provides the first foothold.

---

## The Fix

Implement the mean field self-consistency solution — a simple root-finding problem.

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import brentq

# Mean field Ising model
J = 1.0   # coupling constant
z = 4     # coordination number (2D square lattice)
h = 0.0   # external field

def mft_equation(m, beta, J, z, h):
    """Self-consistency equation: f(m) = tanh(beta*(h + J*z*m)) - m"""
    return np.tanh(beta * (h + J * z * m)) - m

def solve_mft(T, J, z, h):
    """Find all solutions to mean field self-consistency equation."""
    beta = 1.0 / T
    # f(m) = tanh(beta*(h+J*z*m)) - m
    # Search for roots on [-1, 1]
    m_vals = np.linspace(-0.9999, 0.9999, 1000)
    f_vals = mft_equation(m_vals, beta, J, z, h)
    
    # Find sign changes
    roots = []
    for i in range(len(m_vals)-1):
        if f_vals[i] * f_vals[i+1] < 0:
            root = brentq(mft_equation, m_vals[i], m_vals[i+1],
                          args=(beta, J, z, h))
            roots.append(root)
    return roots

T_c = J * z  # = 4J, critical temperature
print(f"Mean field T_c = {T_c:.3f} J/k_B")
print(f"Exact 2D Ising T_c = {2*J/np.log(1+np.sqrt(2)):.3f} J/k_B")

# Compute m(T) curve
T_vals = np.linspace(0.1, 6.0, 500)
m_vals = []
for T in T_vals:
    roots = solve_mft(T, J, z, h)
    positive_roots = [r for r in roots if r > 0.01]
    m_vals.append(max(positive_roots) if positive_roots else 0.0)

# Free energy and specific heat
def free_energy_mft(m, T, J, z, h):
    beta = 1.0 / T
    return -J*z*m**2/2 - T*np.log(2*np.cosh(beta*(h + J*z*m)))

def specific_heat_mft(T_vals, J, z, h):
    """Compute specific heat from energy: C = dE/dT"""
    E_vals = []
    for T in T_vals:
        m = max([r for r in solve_mft(T,J,z,h) if r >= 0], default=0)
        # Energy per spin: E = -J*z*m^2/2 - h*m (from free energy derivative)
        E_vals.append(-J*z*m**2/2 - h*m)
    E_vals = np.array(E_vals)
    C = -T_vals * np.gradient(np.gradient(E_vals, T_vals), T_vals)
    return C

C_vals = specific_heat_mft(T_vals, J, z, h)

print(f"\nMFT critical exponents:")
# m ~ (T_c - T)^beta
T_near = T_vals[T_vals < T_c][-50:]
m_near = np.array(m_vals)[T_vals < T_c][-50:]
valid = m_near > 0.01
if valid.sum() > 5:
    log_m = np.log(m_near[valid])
    log_dt = np.log(T_c - T_near[valid])
    beta_exp = np.polyfit(log_dt, log_m, 1)[0]
    print(f"  Order parameter exponent β ≈ {beta_exp:.3f} (exact MFT: 0.5)")

print(f"\nSpecific heat jump at T_c: ΔC ≈ {max(C_vals):.3f}")
print(f"(Exact 2D Ising: logarithmic divergence, not a jump)")
```

The key output: T_c_MFT = 4J vs. T_c_exact = 2.269J (Onsager). Mean field overestimates by 76% in 2D. Critical exponent β = 0.5 vs. exact 0.125. These discrepancies are not bugs — they are the physics of fluctuations that mean field ignores.

---

## The Wow Moment — Push It

Build a comparison visualization: run exact Metropolis Monte Carlo on a 50×50 Ising lattice alongside the mean field prediction. Plot m(T) from both. Show them agreeing far from T_c and diverging near T_c. The Metropolis simulation shows the actual critical fluctuations: large correlated domains of up and down spins — patterns that mean field cannot capture.

Then: vary dimension d from 1D to 5D by changing the coordination number z: z=2 (1D chain), z=4 (2D square), z=6 (3D simple cubic), z=8 (4D hypercubic), z=12 (5D). Plot T_c_MFT and the known exact T_c for each. Show convergence: by d=4, MFT is accurate. "Mean field theory becomes exact in its own limit — infinite dimension — and gets better the higher the dimension."

Grand finale: the Curie-Weiss susceptibility χ = C/(T-T_c). Plot on a log-log scale. Show the divergence at T_c. "This is a phase transition — a singular point where a bulk property becomes infinite. And mean field theory predicts it with one transcendental equation."

---

## The Interactive Demo

- **Temperature T**: slider 0.1–8.0 J/k_B (vertical line shows T_c)
- **External field h**: slider -2.0 to 2.0 — show hysteresis loop at T < T_c
- **Dimension (coordination number z)**: slider 2–12 (1D to 6D)
- **View**: Graphical intersection plot (f(m) = tanh and g(m) = m, intersection shown as glowing dot)
- **Observable**: m(T) curve, E(T), C(T), χ(T) — tabbed view
- **Phase diagram**: 2D plot (h vs. T) showing ferromagnetic/paramagnetic region and first-order line
- **Compare with Monte Carlo**: run MC on 50×50 lattice at same T, show both m values
- **Show Landau expansion**: toggle to replace full tanh with polynomial approximation a(T-T_c)m + bm³ = 0
- **Number of solutions display**: highlight how the cubic equation has 1 or 3 roots depending on T

---

## Production Notes

**Code structure**: `mft_ising.py` — self-consistency solver, free energy computation, critical exponents. `mft_viz.py` — graphical intersection visualization, phase diagram, hysteresis loop. `mft_vs_mc.py` — side-by-side comparison of MFT and Metropolis results.

**Visual layout**: Main panel: the graphical self-consistency plot — a sine-like curve (tanh) and a straight line (m). As T decreases below T_c, the tanh curve tips steeply and two new intersection points appear (bifurcation). Animate this transition slowly. Secondary panel: m(T) curve updating in real time as user moves the temperature slider.

**Key cinematic moments**: (1) The bifurcation: at T = T_c, the graphical intersection at m=0 becomes unstable — split into three intersections. Freeze-frame this moment. Label "THIS IS THE PHASE TRANSITION." (2) The hysteresis loop: sweep h from +2 to -2 and back. The magnetization jumps discontinuously at h=0 below T_c — first-order transition. Animate the jumping dot on the intersection plot. (3) Dimension comparison: side by side, the self-consistency curves for z=2, 4, 6, 8. Show how z=2 (1D) never crosses below 1 (no transition), z=4 (2D) crosses at T_c=4J (too high), z→∞ approaches exact behavior. (4) The Ginzburg criterion failure zone: shade the region near T_c where MFT fails (red zone of high fluctuations).

**Equations on screen**: H = -J Σ s_i s_j, h_eff = h + Jzm, m = tanh(β h_eff), F_MF, critical exponent definitions.

---

## Tags
`mean-field-theory` `Ising-model` `phase-transition` `self-consistency` `statistical-mechanics` `magnetism` `canvas` `many-body`

---

## Thumbnail

Split image. Left: a chaotic lattice of red (up) and blue (down) spins — the full many-body problem. A diagonal red slash: "IMPOSSIBLE." Right: a single glowing equation m = tanh(βJzm) on a dark background, with a graphical intersection plot showing two curves crossing at a bright point. Bold text: "ONE EQUATION. ONE PHASE TRANSITION." Bottom: "Mean Field Theory — Exact Derivation."
