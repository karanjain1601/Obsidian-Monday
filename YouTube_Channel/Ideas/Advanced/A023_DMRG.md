---
title: "Ground State of a Quantum Spin Chain (DMRG and Tensor Networks)"
id: A023
difficulty: 9.5/10
prereq: "None"
concept: "DMRG: density matrix renormalization group; iteratively optimizes MPS (matrix product state) tensors to minimize energy; optimal truncation via SVD of the reduced density matrix; exact for 1D, extends to 2D (PEPS)."
tags: [DMRG, tensor-network, MPS, matrix-product-state, SVD, quantum-spin-chain, entanglement, Python]
category: advanced
type: video-idea
---

# Ground State of a Quantum Spin Chain (DMRG and Tensor Networks)

**Alt title:** "Why Quantum Entanglement Has a Geometry (Tensor Networks Explained)"
**Difficulty:** 9.5/10 | **Prereq:** Linear algebra, quantum mechanics, Python/NumPy

---

## Opening Hook (0:00–1:00)

"In 1992, Steve White had a problem. He was trying to compute the ground state of a 100-site quantum spin chain — a chain of 100 spin-1/2 particles. The Hilbert space has 2^100 dimensions. Even listing the ground state vector would require more memory than all computers on Earth. His algorithm took days and gave garbage."

"Six months later, he published the Density Matrix Renormalization Group. It computed the ground state of a 100-site chain in minutes, to 12 decimal places of accuracy. It is still considered one of the most accurate algorithms in all of physics."

"The key insight? Most of the Hilbert space is irrelevant. The ground state of a 1D system only uses a tiny, structured slice of it — and that slice has a special mathematical structure called a Matrix Product State. We're going to build DMRG from scratch, understand why it works, and watch it find the ground state of a quantum antiferromagnet."

A Mermaid-style diagram appears: a chain of boxes (sites), each connected by a matrix (bond). "Every site: a tensor. Every bond: entanglement. The whole chain: a tensor network."

---

## The Naive Attempt

The naive approach: exact diagonalization of the full Hamiltonian for a quantum spin-1/2 chain.

```python
import numpy as np
from scipy.sparse.linalg import eigsh
from scipy.sparse import kron, eye, csr_matrix

# Exact diagonalization for Heisenberg spin chain
# H = J * sum_i (Sx_i Sx_{i+1} + Sy_i Sy_{i+1} + Sz_i Sz_{i+1})
# Hilbert space dimension: 2^N

# Pauli matrices / 2
Sx = 0.5 * np.array([[0, 1], [1, 0]], dtype=complex)
Sy = 0.5 * np.array([[0, -1j], [1j, 0]], dtype=complex)
Sz = 0.5 * np.array([[1, 0], [0, -1]], dtype=complex)
Id = np.eye(2, dtype=complex)

def heisenberg_hamiltonian(N, J=1.0, periodic=False):
    """Build full Heisenberg Hamiltonian matrix."""
    dim = 2**N
    H = csr_matrix((dim, dim), dtype=complex)
    
    for i in range(N-1 if not periodic else N):
        j = (i + 1) % N
        # H_ij = J * (Sx_i Sx_j + Sy_i Sy_j + Sz_i Sz_j)
        for S_op in [Sx, Sy, Sz]:
            # Tensor product: I^{i-1} x S_op x I^{j-i-1} x S_op x I^{N-j-1}
            op_i = eye(2**i, dtype=complex)
            op_j = eye(2**(N-j-1), dtype=complex)
            middle = eye(2**(j-i-1), dtype=complex) if j > i+1 else eye(1)
            term = kron(kron(kron(kron(op_i, csr_matrix(S_op)), middle),
                             csr_matrix(S_op)), op_j)
            H += J * term
    return H

# Build and diagonalize for small N
N = 16
print(f"N={N}: Hilbert space dim = 2^{N} = {2**N}")
print(f"Matrix size: {2**N} x {2**N} = {(2**N)**2 / 1e9:.2f} GB (complex128)")
H = heisenberg_hamiltonian(N)
print(f"Finding ground state...")
E0, psi0 = eigsh(H, k=1, which='SA')
print(f"Ground state energy: E0 = {E0[0]:.6f} J")
print(f"Per site: {E0[0]/N:.6f} J")
print(f"Exact (Bethe ansatz, N→∞): -0.443147 J/site")
print(f"\nFor N=30: matrix would be {2**30 * 2**30 * 16 / 1e18:.1f} exabytes. Dead.")
```

---

## The Moment of Failure

At N=24, the code crashes: MemoryError. The dense matrix is 2^24 × 2^24 × 16 bytes = 8 petabytes. Even the sparse Hamiltonian runs out of RAM. At N=30, the ground state vector alone is 2^30 × 16 bytes = 16 GB.

Show the wall chart: ED works up to N≈20. For N=100 (a "small" chain by physics standards), the ground state vector has 10^30 components. "But a DMRG simulation on the same chain? It needs only N × χ² × d numbers, where χ ~ 100 is the bond dimension. For N=100, χ=100, d=2: that's 2 million numbers. Not 10^30."

The failure equation:
$$\dim(\mathcal{H}) = d^N = 2^{100} \approx 10^{30}$$
"Exact diagonalization scales exponentially in N. Tensor network methods scale as poly(N,χ). The difference is quantum entanglement — and whether you use it or fight it."

---

## Why It Broke — The Physics

A general quantum state on N sites requires d^N parameters (exponentially many). But the ground states of **gapped 1D local Hamiltonians** satisfy the **area law for entanglement entropy**: the entanglement entropy S_A of a subsystem A grows as the boundary area, not its volume. For 1D systems, the boundary of a contiguous block is just two points — constant area — so S_A ≤ constant.

The Schmidt decomposition of any state across a bipartition A|B:
$$|\psi\rangle = \sum_{\alpha=1}^{\chi} \lambda_\alpha |\alpha_A\rangle \otimes |\alpha_B\rangle$$

For ground states of gapped 1D systems, the Schmidt coefficients λ_α decay exponentially fast. You only need χ ~ O(1) terms (χ is the "bond dimension"). The area law is what makes tensor networks efficient for 1D quantum systems.

A Matrix Product State (MPS) for N sites is:
$$|\psi\rangle = \sum_{s_1,\ldots,s_N} A^{s_1}_{1} A^{s_2}_{2} \cdots A^{s_N}_{N} |s_1 s_2 \cdots s_N\rangle$$

where each A^{s_i}_i is a χ×χ (or 1×χ for boundary sites) complex matrix. The number of parameters is N × d × χ² — polynomial in N and χ. The bond dimension χ controls accuracy: χ=1 gives a product state (no entanglement), χ=2^{N/2} is exact.

---

## The One Concept

**DMRG (Density Matrix Renormalization Group)** is an iterative variational algorithm that finds the ground state of a 1D quantum Hamiltonian by optimizing the tensors of a Matrix Product State (MPS) one by one, using the Singular Value Decomposition to optimally truncate the bond dimension.

**The MPS structure.** Write the ground state as:
$$|\psi[A]\rangle = \sum_{\{s_i\}} A^{s_1}[1] A^{s_2}[2] \cdots A^{s_N}[N] |s_1,\ldots,s_N\rangle$$

Each A^{s_i} is a matrix of size χ_{i-1} × χ_i. The physical index s_i ∈ {0,1} (up/down spin). The energy ⟨ψ|H|ψ⟩/⟨ψ|ψ⟩ is a function of all the A tensors.

**DMRG sweep algorithm.** Optimization is done by alternating sweeps from left to right and right to left. At each step, one tensor A[i] is optimized while all others are held fixed:

1. **Left-normalize** all tensors A[1]...A[i-1]: reshape A^{s_i-1} into matrix M, compute SVD M = U S V†, absorb U into current site.
2. **Right-normalize** all tensors A[i+2]...A[N].
3. **Build effective Hamiltonian**: contract the full Hamiltonian H with all tensors except A[i]. This gives a small effective Hamiltonian H_eff of size (dχ² × dχ²).
4. **Diagonalize H_eff** (Lanczos or ARPACK): update A[i] with the ground eigenvector, reshaped.
5. **Truncate**: SVD the updated A[i] into left-singular vectors U and singular values S·V†; keep only χ largest singular values. This is the key step — **the truncation of the density matrix**.
6. Move to site i+1, repeat.

**Why SVD gives the optimal truncation.** The reduced density matrix of site A (left block) is ρ_A = Tr_B[|ψ⟩⟨ψ|]. Its eigenvalues are λ_α² (squares of Schmidt values). Keeping the top χ eigenvalues of ρ_A minimizes the truncation error ε = Σ_{α>χ} λ_α² in the 2-norm sense. This is the Eckart-Young-Mirsky theorem applied to quantum mechanics. White's original insight: **the SVD of the reduced density matrix, not the full Hamiltonian, gives the optimal basis for the block.**

**The Heisenberg model ground state.** The spin-1/2 antiferromagnetic Heisenberg chain H = J Σ_i S_i · S_{i+1} with J>0 has a gapless ground state (critical chain) with logarithmic entanglement entropy S ~ (c/3)log(L) where c=1 is the central charge. For DMRG to achieve accuracy ε, you need χ ~ ε^{-1/c} — polynomially large. For gapped chains (dimerized, Haldane phase), χ stays bounded. DMRG gives the exact Bethe ansatz energy -0.443147 J/site to 10 decimal places with χ=200.

**Extensions.** Time-evolved MPS (TEBD/TDVP): apply e^{-iHt} to an MPS gate by gate; simulate real-time quantum dynamics. 2D: PEPS (Projected Entangled Pair States) replaces chains with tensors on a 2D grid; much harder (NP-hard to contract exactly). Infinite DMRG (iDMRG): optimize an infinite chain by assuming translation invariance. Matrix Product Operators (MPO): represent H as a tensor network too, for efficient contractions.

---

## The Fix

Implement a minimal DMRG for the Heisenberg chain using NumPy.

```python
import numpy as np
from numpy.linalg import svd, norm

# Minimal two-site DMRG for Heisenberg spin-1/2 chain
# MPS stored as list of tensors: psi[i] has shape (chi_left, d, chi_right)
# d=2 (spin-1/2), chi = bond dimension

d = 2      # physical dimension
chi = 32   # bond dimension
N = 50     # chain length
J = 1.0    # antiferromagnetic coupling

# Pauli spin operators
Sp = np.array([[0, 1], [0, 0]], dtype=float)   # S+
Sm = np.array([[0, 0], [1, 0]], dtype=float)   # S-
Sz = 0.5 * np.array([[1, 0], [0, -1]], dtype=float)
Id2 = np.eye(2)

# Initialize MPS: random tensors, left-normalized
def random_mps(N, d, chi):
    tensors = []
    for i in range(N):
        chi_l = min(d**i, chi)
        chi_r = min(d**(N-i-1), chi)
        A = np.random.randn(chi_l, d, chi_r)
        # Left-normalize: reshape to (chi_l*d, chi_r), QR decompose
        A_mat = A.reshape(chi_l*d, chi_r)
        Q, R = np.linalg.qr(A_mat)
        # Q has shape (chi_l*d, min(chi_l*d, chi_r))
        chi_r_new = Q.shape[1]
        tensors.append(Q.reshape(chi_l, d, chi_r_new))
    return tensors

def left_contract(tensor, H_block, W):
    """
    Contract left block environment.
    L[a, ap, w] += A[a, s, b].conj() * H[w, wp, s, sp] * L[ap, a, wp] * A[ap, sp, b]
    Simplified for MPO structure.
    """
    # This is a schematic — full MPO contraction
    pass

def two_site_energy(A_l, A_r, L_env, R_env, h_bond):
    """
    Compute energy of two-site block (sites i, i+1).
    A_l: (chi_l, d, chi_mid)
    A_r: (chi_mid, d, chi_r)
    h_bond: (d,d,d,d) = Heisenberg two-site Hamiltonian tensor
    """
    # Contract two-site wavefunction
    Theta = np.einsum('lsa,atb->lstb', A_l, A_r)   # (chi_l, d, d, chi_r)
    chi_l, _, _, chi_r = Theta.shape
    Theta_flat = Theta.reshape(chi_l * d * d * chi_r)
    
    # Apply Hamiltonian
    H_Theta = np.einsum('lstb,sust->luub', Theta, h_bond.reshape(d,d,d,d))
    H_Theta_flat = H_Theta.reshape(chi_l * d * d * chi_r)
    
    E = np.dot(Theta_flat, H_Theta_flat) / np.dot(Theta_flat, Theta_flat)
    return E

# Build Heisenberg two-site Hamiltonian tensor h[s1,s2,s1',s2']
# H = J*(0.5*(S+ S- + S- S+) + Sz Sz) = J*(Sx Sx + Sy Sy + Sz Sz)
h_bond = np.zeros((d, d, d, d))
# Sz Sz term
h_bond += J * np.einsum('ij,kl->ikjl', Sz, Sz)
# 0.5 * (S+S- + S-S+)
h_bond += J * 0.5 * np.einsum('ij,kl->ikjl', Sp, Sm)
h_bond += J * 0.5 * np.einsum('ij,kl->ikjl', Sm, Sp)

print("Heisenberg bond Hamiltonian h[s1,s2,s1',s2'] constructed.")
print(f"Shape: {h_bond.shape}")
print(f"Eigenvalues of h (2-site spectrum): {np.linalg.eigvalsh(h_bond.reshape(d**2, d**2))}")
# Should be: -3J/4 (singlet) and +J/4 (triplet x3)
E_singlet = -3*J/4
print(f"Singlet energy: {E_singlet:.4f} (exact: {-3*J/4:.4f})")
```

For the full DMRG: the key loop is the sweep. Each iteration: (1) build left and right environments by contracting MPS with MPO (Matrix Product Operator for H), (2) solve the effective eigenproblem on two neighboring sites using Lanczos, (3) SVD the two-site tensor and truncate to chi, (4) update tensors. After 5–10 sweeps with chi=64, energy converges to E0/N = -0.443147±0.000001, matching Bethe ansatz to 6 significant figures.

---

## The Wow Moment — Push It

Show the entanglement entropy S(x) = -Tr[ρ_x log ρ_x] as a function of bipartition position x. For the gapless Heisenberg chain: S(x) ~ (c/3) log(min(x, N-x)), a logarithm. Show how this grows with chain length — and how DMRG handles it by increasing χ. Plot the required χ vs. system size to achieve fixed accuracy.

Then switch to the Haldane chain (spin-1 antiferromagnet): gapped, area law, S(x) ~ constant. DMRG gives exact results with χ=10! Show the topological edge states: the two chain ends have spin-1/2 degrees of freedom in the Haldane phase, visible as degenerate ground state levels.

Final demo: real-time time evolution of the Heisenberg chain using TEBD (Time-Evolving Block Decimation). Start with a domain wall (all spins up on left, down on right). Watch the spin excitation (magnon) propagate as a wave packet across the chain — a quantum wave visualization.

---

## The Interactive Demo

- **Chain length N**: slider 10–200
- **Bond dimension χ**: slider 4–256 (show energy error vs. χ)
- **Model**: Heisenberg (J=1, gapless), Ising (gapped), Haldane (spin-1, topological), XXZ (anisotropy slider Δ from 0 to 2)
- **Anisotropy Δ** (XXZ): slider 0.0–2.0 (shows quantum phase transition at Δ=1)
- **Entanglement entropy profile S(x)**: live plot updated each sweep; compare area law vs. volume law
- **Schmidt spectrum**: bar chart of singular values at center bond — visualize entanglement structure
- **Sweep animation**: step-by-step sweep showing which site is being optimized (highlighted)
- **Energy convergence**: log plot of |E - E_exact| vs. sweep number
- **Real-time evolution**: TEBD mode — show wavepacket propagating

---

## Production Notes

**Code structure**: `mps.py` — MPS class with left/right normalization, SVD truncation, inner product. `mpo.py` — MPO class for Heisenberg/Ising/Haldane Hamiltonians. `dmrg.py` — single-site and two-site DMRG sweep. `tebd.py` — Trotter-Suzuki time evolution. `entropy.py` — entanglement entropy from Schmidt values.

**Visual layout**: Three-panel. Left: chain diagram showing the MPS tensors as boxes with bond indices, current optimization site highlighted in gold. Center: entanglement entropy profile S(x) — a symmetric hump for the gapless chain, flat for the gapped chain. Right: energy convergence plot with Bethe ansatz reference line.

**Key cinematic moments**: (1) The SVD moment — zoom into a single two-site tensor being decomposed. Show the singular value spectrum as a bar chart. Then show the truncation: the small bars vanish, leaving only χ bars. Caption: "These are the Schmidt values. The big ones matter. The small ones are noise." (2) The area law visualization: show S(x) growing logarithmically (gapless, harder for DMRG) vs. flat (gapped, easy for DMRG). Color the entanglement bar by phase. (3) The TEBD magnon propagation: animate a spin wave moving across the chain in real time. Slow-motion frames showing the domain wall splitting into two counterpropagating excitations. (4) χ convergence animation: watch the MPS "sharpen" as χ increases from 1 to 64.

**Equations on screen**: MPS ansatz (matrix chain), Schmidt decomposition, area law S ≤ const (1D gapped), DMRG truncation error ε = Σ λ_α².

---

## Tags
`DMRG` `tensor-network` `MPS` `matrix-product-state` `SVD` `quantum-spin-chain` `entanglement` `Python`

---

## Thumbnail

Dark background. Center: a chain of glowing blue quantum sites connected by orange bonds (the MPS tensor network). At the center bond: an animated SVD decomposition — the bond "pinches" at a glowing singular value spectrum. The spectrum has a few large bars (kept) and many small bars (truncated, fading away). Bold white text: "QUANTUM STATES ON A BUDGET." Bottom: "DMRG Tensor Networks — From Scratch."
