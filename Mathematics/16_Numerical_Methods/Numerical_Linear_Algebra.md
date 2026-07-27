---
title: "Numerical Linear Algebra"
aliases: ["LU decomposition", "QR decomposition", "Conjugate Gradient", "iterative linear solvers", "eigenvalue algorithms", "Gaussian elimination"]
tags: [mathematics, numerical-methods, numerical-linear-algebra, advanced]
domain: Mathematics
difficulty: advanced
created: 2026-07-27
related: ["[[Error_Analysis_and_Floating_Point]]", "[[Numerical_ODEs_and_PDEs]]", "[[_MOC_Numerical_Methods]]"]
status: complete
---

# 🔢 Numerical Linear Algebra

> [!abstract] TL;DR
> Numerical linear algebra solves $Ax = b$ and eigenvalue problems at scale. Direct methods (LU, QR) are exact in exact arithmetic but cost $O(n^3)$; iterative methods (Conjugate Gradient, GMRES) exploit sparsity to solve million-variable systems. The condition number $\kappa(A)$ governs how much input error amplifies into output error.

## Intuition — analogy FIRST

Solving $Ax = b$ is like finding a balance point in a high-dimensional seesaw. Direct methods systematically eliminate variables — Gaussian elimination — the way you'd solve simultaneous equations by hand, but with careful pivoting so rounding errors don't cascade. For huge sparse systems (like a finite-element mesh with millions of nodes), iterative methods are like repeatedly nudging a guess toward the answer, exploiting the fact that most entries of $A$ are zero. The condition number tells you how wobbly the seesaw is: a large $\kappa(A)$ means tiny perturbations in $b$ cause wild swings in $x$.

---

## How It Works

```mermaid
graph TD
    A["Solve Ax = b"] --> B{Matrix size & structure}
    B -->|Dense, small-medium| C["Direct Methods"]
    B -->|Sparse, large| D["Iterative Methods"]
    C --> E["LU (general)\nCholesky (SPD)"]
    C --> F["QR (least squares)"]
    D --> G["Jacobi / Gauss-Seidel\n(simple)"]
    D --> H["Conjugate Gradient\n(SPD, Krylov)"]
    D --> I["GMRES\n(non-symmetric)"]
    E --> J{κ(A) large?}
    J -->|Yes| K["Ill-conditioned!\nPivot or regularise"]
    J -->|No| L["Stable solution"]
    style A fill:#2563eb,color:#fff
    style C fill:#7c3aed,color:#fff
    style D fill:#7c3aed,color:#fff
    style H fill:#059669,color:#fff
```

---

## Key Concepts

### 1. LU Decomposition

**Goal**: factor $A = LU$ where $L$ is lower triangular (unit diagonal) and $U$ is upper triangular. Then:
1. Solve $Ly = b$ by forward substitution: $O(n^2)$
2. Solve $Ux = y$ by back substitution: $O(n^2)$

The factorisation itself costs $O(n^3)$. Once computed, different right-hand sides cost only $O(n^2)$ each.

**Partial pivoting**: at each step, swap the row with the largest pivot to the current position. This prevents division by nearly-zero and controls error growth:

$$PA = LU, \quad P \text{ is a permutation matrix}$$

**Cholesky decomposition**: for symmetric positive definite $A$, factor $A = LL^T$ where $L$ is lower triangular. Cost $\approx n^3/3$ (half of LU); guaranteed numerically stable without pivoting.

### 2. QR Decomposition

Factor $A = QR$ where $Q$ is orthogonal ($Q^TQ = I$) and $R$ is upper triangular.

**Applications**:
- **Least squares**: $\min \|Ax - b\|_2$ — compute $QR$, then solve $Rx = Q^Tb$
- **Eigenvalue algorithms**: the QR algorithm iterates $A \to QR \to RQ$

**Householder reflections**: reflect the current column to align with a coordinate axis, zeroing all below-diagonal entries. Numerically superior to Gram-Schmidt, which suffers from loss of orthogonality.

> [!tip] Why QR for Least Squares?
> The normal equations $(A^TA)\beta = A^Tb$ square the condition number: $\kappa(A^TA) = \kappa(A)^2$. QR avoids this, giving a much more stable solve when $\kappa(A)$ is moderate.

### 3. Conditioning and Stability

The **condition number** of $A$:

$$\kappa(A) = \|A\| \cdot \|A^{-1}\| = \frac{\sigma_{\max}(A)}{\sigma_{\min}(A)}$$

**Error amplification**: if $\hat{x}$ is the computed solution with residual $r = b - A\hat{x}$:

$$\frac{\|x - \hat{x}\|}{\|x\|} \leq \kappa(A) \cdot \frac{\|r\|}{\|b\|}$$

A small residual $\|r\|$ guarantees a good *backward* error but the *forward* error (how wrong $\hat{x}$ is) can be $\kappa(A)$ times larger.

### 4. Iterative Methods

For large sparse $A$ (millions of variables, most entries zero), direct methods are prohibitively slow.

**Jacobi iteration**: update each component using the last full iterate:

$$x_i^{(k+1)} = \frac{1}{a_{ii}}\left(b_i - \sum_{j \neq i} a_{ij} x_j^{(k)}\right)$$

Converges if $A$ is strictly diagonally dominant.

**Gauss-Seidel**: use the most recently updated components immediately. Typically converges about twice as fast as Jacobi.

**Conjugate Gradient (CG)**: the premier method for large sparse symmetric positive definite systems.
- Iterates in Krylov subspace $\mathcal{K}_k = \text{span}\{r_0, Ar_0, A^2r_0, \ldots\}$
- Converges in at most $n$ steps (exact arithmetic); in practice converges in far fewer
- Cost per iteration: one matrix-vector multiply + $O(n)$ work
- Total iterations needed: $O(\sqrt{\kappa(A)})$, so with good preconditioning, fast

**Preconditioning**: multiply by $M^{-1}$ (an approximate inverse) to reduce $\kappa(M^{-1}A)$. Incomplete LU (ILU) and multigrid are popular preconditioners.

### 5. Eigenvalue Algorithms

**Power iteration**: to find the dominant eigenvalue $\lambda_1$:

$$x^{(k+1)} = \frac{Ax^{(k)}}{\|Ax^{(k)}\|}$$

The Rayleigh quotient $\mu^{(k)} = (x^{(k)})^T A x^{(k)}$ converges to $\lambda_1$. Rate: $|\lambda_2/\lambda_1|^k$.

**QR algorithm**: applies QR decomposition iteratively. The off-diagonal entries of $A^{(k)}$ converge to zero, revealing the Schur form. This is the standard algorithm for computing all eigenvalues of a dense matrix, $O(n^3)$.

**Lanczos algorithm**: Krylov method for large sparse symmetric matrices. Builds a tridiagonal matrix whose eigenvalues approximate those of $A$. Used in Google's early PageRank calculations.

---

## Real-World Notes

- **Finite element analysis**: structural simulations assemble stiffness matrices with $10^6$–$10^9$ rows; CG with multigrid preconditioning solves them in minutes.
- **PageRank**: the ranking vector is the dominant eigenvector of a $n \times n$ web graph matrix ($n \approx 10^{10}$); power iteration with sparse matrix-vector products is the only tractable approach.
- **PCA / machine learning**: dimensionality reduction requires the top-$k$ eigenvectors of the covariance matrix; the Lanczos/ARPACK method extracts them without computing all $n$ eigenvalues.

---

## Common Pitfalls

- **Never form $A^{-1}$ explicitly**: solving $Ax = b$ via $x = A^{-1}b$ costs $O(n^3)$ *and* is less stable than LU. Always use a factorisation.
- **Small residual $\neq$ small error**: a residual of $10^{-10}$ with $\kappa(A) = 10^8$ gives forward error potentially as large as $10^{-2}$.
- **Gram-Schmidt is unstable**: classical Gram-Schmidt loses orthogonality due to rounding. Use Householder QR or modified Gram-Schmidt instead.
- **Iterative method divergence**: if $A$ is not diagonally dominant (Jacobi) or not SPD (CG), the method may diverge or stagnate. GMRES is the safer choice for general systems.

---

## Related Concepts

- [[_MOC_Numerical_Methods|↑ Section MOC]]
- [[Error_Analysis_and_Floating_Point]] — condition number ties directly to floating-point error analysis
- [[Numerical_ODEs_and_PDEs]] — implicit PDE solvers require large linear solves at each time step
- [[Interpolation_and_Approximation]] — least squares normal equations solved by QR

---

## Review Questions

1. Show that LU decomposition of a $3 \times 3$ matrix via Gaussian elimination requires exactly $2 + 1 = 3$ multiplications and subtractions at each of the two elimination steps. Count total flops and verify $O(n^3)$.
2. The matrix $A = \begin{pmatrix} 1 & 1 \\ 1 & 1.0001 \end{pmatrix}$ has $\kappa(A) \approx 40004$. If $b$ is perturbed by $10^{-4}$, what is the worst-case perturbation in $x$?
3. Conjugate Gradient is guaranteed to converge in at most $n$ steps. Explain why the practical convergence depends on the eigenvalue distribution of $A$ rather than just $n$.
4. Why does the QR algorithm (iteratively replacing $A^{(k)}$ with $R^{(k)}Q^{(k)}$) converge to upper-triangular (Schur) form? What does convergence require about eigenvalues?

---

## Sources

- Trefethen & Bau, *Numerical Linear Algebra*, Lectures 20–32
- Golub & Van Loan, *Matrix Computations*, Ch. 3–5
- Saad, *Iterative Methods for Sparse Linear Systems*, Ch. 6–7

#numerical-methods #numerical-linear-algebra #mathematics
