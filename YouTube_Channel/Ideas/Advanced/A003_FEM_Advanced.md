---
title: "Finite Element Method: From Weak Form to Stiffness Matrix"
id: A003
difficulty: 8.5/10
prereq: "M057"
concept: "Variational formulation: ∫∫Ω ε:C:ε dΩ = ∫∂Ω t·u dΓ; discretize with shape functions N_i; assemble element stiffness K_e = ∫B^T C B dΩ; global assembly; boundary conditions; Gauss quadrature for numerical integration."
tags: [FEM, weak-form, stiffness-matrix, shape-functions, Gauss-quadrature, structural-mechanics, variational, canvas]
category: advanced
type: video-idea
---

# Finite Element Method: From Weak Form to Stiffness Matrix

**Alt title:** Why Solving PDEs With Triangles Actually Works (The Math Behind FEM)  
**Difficulty:** 8.5/10 | **Prereq:** M057 (linear algebra and calculus of variations)

---

## Opening Hook (0:00–1:00)

Open on a stunning slow-motion video of a suspension bridge cable vibrating in the wind — the San Francisco Bay Bridge, each cable strand shimmering in the early-morning light. Voice over: "Every single one of those cables was designed using a technique invented in the 1950s for analyzing aircraft wings. A technique so powerful that it became the numerical backbone of all structural engineering, all crash simulation, all biomechanical modeling, all semiconductor stress analysis. Finite Element Method. And here is the secret: at its core, FEM is not about triangles and meshes. It is about finding the function that minimizes potential energy. The mesh is just how you search that infinite-dimensional function space with a finite computer."

Cut to a 2D canvas simulation: a wrench-shaped domain with a fixed left edge and a downward force on the right. As the FEM solver runs, you see the stiffness matrix assemble in real time, entry by entry, each element lighting up as it contributes. Then the solve completes and the wrench deforms visibly — displacement shown as a rainbow color map. "Every pixel of that color map came from one linear system: K u = f. Let's build K from scratch."

---

## The Naive Attempt

The instinct: use finite differences. Place a regular grid over the domain, replace derivatives with centered differences, solve the resulting sparse linear system.

```python
import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla
import matplotlib.pyplot as plt

# Naive FD Poisson solve: -∇²u = f on a square domain
n = 50
h = 1.0 / (n - 1)
N = n * n

def idx(i, j): return i * n + j

A = sp.lil_matrix((N, N))
b = np.zeros(N)

for i in range(n):
    for j in range(n):
        k = idx(i, j)
        if i == 0 or i == n-1 or j == 0 or j == n-1:
            # Dirichlet BC: u = 0 on boundary
            A[k, k] = 1.0
            b[k] = 0.0
        else:
            # 5-point Laplacian
            A[k, k] = 4.0 / h**2
            A[k, idx(i-1, j)] = -1.0 / h**2
            A[k, idx(i+1, j)] = -1.0 / h**2
            A[k, idx(i, j-1)] = -1.0 / h**2
            A[k, idx(i, j+1)] = -1.0 / h**2
            # Source: unit load
            b[k] = 1.0

A = A.tocsr()
u = spla.spsolve(A, b)
u_grid = u.reshape(n, n)
```

This works fine on a square domain. But try an L-shaped domain, a wrench, a crankshaft, an irregular geological formation — the regular grid cannot conform to the boundary. You have to approximate curved boundaries with staircase steps, introducing first-order errors at every boundary cell. The error near the boundary does not converge to zero as fast as the interior. For stress analysis, that boundary region is *exactly* where the highest stresses are — at re-entrant corners, holes, notches. The finite difference approach gives you first-order accuracy precisely where you need the most accuracy.

---

## The Moment of Failure

Try to use the FD Poisson solver for a 2D elasticity problem on an L-shaped domain. The domain is a square with the top-right quadrant removed — a standard benchmark for stress concentration. Fix the left edge, apply a downward traction on the bottom edge. The FD scheme gives a jagged, clearly incorrect displacement field: the re-entrant corner at the center of the L shows a displacement that is 40% too high compared to the analytical solution. The color map shows a bullseye artifact — a ring of abnormally high stress centered on the staircase-approximated corner. Print the error at the re-entrant corner: u_numerical = 0.0342, u_exact = 0.0241, relative error = 41.9%. With FEM on a conforming mesh that correctly represents the corner geometry, the same calculation gives u_FEM = 0.0243, relative error = 0.8%. The domain geometry matters and staircase boundaries destroy accuracy in the one place you care most about.

---

## Why It Broke — The Physics

Structural mechanics is governed by the equilibrium equations (Cauchy's equation of motion in the static case):

∇ · σ + b = 0  in Ω

where σ is the Cauchy stress tensor and b is the body force per unit volume (gravity, etc.). With the constitutive law (Hooke's law for linear elasticity):

σ = C : ε = C : (1/2)(∇u + (∇u)^T)

where C is the fourth-order elasticity tensor and ε is the small-strain tensor. This is a second-order PDE in u (displacement field). Strong form: find u such that ∇ · C : ∇u + b = 0 pointwise.

The FD approach solves the strong form. This requires second derivatives of u, which must be approximated discretely at every interior point. Near a geometric singularity (like the re-entrant corner of an L domain), u has a known mathematical singularity: u ∝ r^α sin(αθ) where α ≈ 0.544 for a 270° re-entrant corner — a fractional power. Finite differences applied to a non-smooth function converge at a rate limited by the smoothness of the solution, not the order of the scheme. First-order accuracy near the corner, regardless of mesh refinement, because the singularity dominates.

FEM circumvents this by working with the *weak form*, which integrates against test functions and reduces by one the differentiability requirement on u. Near the singularity, u does not need to be twice differentiable — only once (in the H¹ Sobolev sense).

---

## The One Concept

**The Finite Element Method: variational formulation, shape function discretization, and global stiffness assembly.**

**Step 1 — Weak (variational) formulation:**

Multiply the equilibrium equation by a test function v (virtual displacement), integrate over the domain Ω, and integrate by parts (Green's identity):

∫_Ω ε(v) : C : ε(u) dΩ = ∫_Ω v · b dΩ + ∫_{∂Ω_N} v · t̄ dΓ

This is the Principle of Virtual Work. The left side is the internal virtual work (strain energy); the right side is the external virtual work (body forces + surface tractions t̄ on the Neumann boundary). This is the weak form. Its solution u ∈ H¹(Ω) exists and is unique (Lax-Milgram theorem) under mild regularity assumptions.

**Step 2 — Discretization with shape functions:**

Partition Ω into elements (triangles in 2D, tetrahedra in 3D). On each element e, approximate the displacement:

u^h(x) = Σ_{i ∈ nodes(e)} N_i^e(x) u_i

where N_i^e(x) are the shape functions (basis functions) associated with node i of element e, and u_i is the unknown displacement at node i. For linear triangular elements, N_i is the barycentric coordinate associated with vertex i — it is 1 at vertex i and linearly decays to 0 at the other vertices.

The strain is then:

ε(u^h) = B u_e

where B is the strain-displacement matrix (3×6 for a 2D triangle with 2 DOFs per node):

B = [[∂N₁/∂x, 0, ∂N₂/∂x, 0, ∂N₃/∂x, 0],
     [0, ∂N₁/∂y, 0, ∂N₂/∂y, 0, ∂N₃/∂y],
     [∂N₁/∂y, ∂N₁/∂x, ∂N₂/∂y, ∂N₂/∂x, ∂N₃/∂y, ∂N₃/∂x]]

For linear triangles, the derivatives of N_i are constant within the element — so B is constant per element, and the strain is piecewise constant.

**Step 3 — Element stiffness matrix:**

Substituting into the weak form and restricting to a single element e:

K^e = ∫_{Ω_e} B^T C B dΩ

For linear triangles with constant B, this simplifies to:

K^e = B^T C B · A_e

where A_e is the area of triangle e. C for plane stress isotropic material (E, ν):

C = E/(1-ν²) [[1, ν, 0], [ν, 1, 0], [0, 0, (1-ν)/2]]

K^e is a 6×6 symmetric positive semi-definite matrix (for a triangle with 3 nodes × 2 DOFs each).

**Step 4 — Global assembly:**

The global stiffness matrix K (size 2N_nodes × 2N_nodes) is assembled by adding element contributions at the appropriate global DOF positions:

K[I(i,α), I(j,β)] += K^e[2(i-1)+α, 2(j-1)+β]

where I(i, α) is the global DOF index of local node i, direction α. This is a scatter operation. In code: for each element, loop over local DOF pairs (i,α) and (j,β), add K^e to the global K at the corresponding global indices.

**Step 5 — Gauss quadrature for higher-order elements:**

For quadratic or cubic elements, B is no longer constant — it varies within the element. The element integral ∫ B^T C B dΩ must be computed numerically. Gauss quadrature over the reference element (a standard triangle with vertices at (0,0), (1,0), (0,1)):

K^e ≈ Σ_q w_q B(ξ_q)^T C B(ξ_q) |J(ξ_q)|

where (ξ_q, η_q) are Gauss points, w_q are weights, and |J| is the Jacobian determinant of the mapping from reference to physical element. For linear triangles: 1 Gauss point suffices. For quadratic (T6 elements): 3 Gauss points (degree-3 rule). For cubic: 4 points.

**Step 6 — Boundary conditions and solve:**

Dirichlet BCs (fixed nodes): eliminate those DOFs from K and f using the penalty or elimination method. Solve K_free u_free = f_free using a sparse direct solver (CHOLMOD, PARDISO) or preconditioned conjugate gradient.

**Why FEM wins:** The shape functions conform to the mesh boundary exactly. Stress concentrations can be resolved by local refinement (h-refinement) or by increasing the polynomial order (p-refinement) or both (hp-FEM). The method is variationally consistent — it minimizes the potential energy, giving an error bound in the energy norm: ||u - u^h||_E ≤ C h^min(p,s-1) ||u||_{H^s} where p is the polynomial order.

---

## The Fix

```python
import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla

def fem_linear_triangle_2d(nodes, elements, E, nu, 
                             dirichlet_nodes, dirichlet_vals,
                             neumann_edges, neumann_tractions,
                             body_force=None):
    """
    2D linear FEM solver for plane-stress elasticity.
    
    nodes: (N, 2) float — node coordinates
    elements: (M, 3) int — triangle connectivity
    E, nu: float — Young's modulus, Poisson ratio
    dirichlet_nodes: list of (node_idx, dof, value) tuples
    neumann_edges: list of (n0, n1) edge node pairs
    neumann_tractions: list of (tx, ty) traction vectors
    """
    N = len(nodes)
    ndof = 2 * N
    
    # Plane stress constitutive matrix C (3x3)
    C = (E / (1 - nu**2)) * np.array([
        [1,   nu,       0],
        [nu,  1,        0],
        [0,   0,  (1-nu)/2]
    ])
    
    K = sp.lil_matrix((ndof, ndof))
    f = np.zeros(ndof)
    
    for elem_idx, (n0, n1, n2) in enumerate(elements):
        # Node coordinates
        x0, y0 = nodes[n0]
        x1, y1 = nodes[n1]
        x2, y2 = nodes[n2]
        
        # Area of triangle
        A = 0.5 * abs((x1-x0)*(y2-y0) - (x2-x0)*(y1-y0))
        
        # Shape function gradients (constant for linear triangle)
        # N_i = (a_i + b_i*x + c_i*y) / (2A)
        b = np.array([y1 - y2, y2 - y0, y0 - y1])  # dN/dx * 2A
        c = np.array([x2 - x1, x0 - x2, x1 - x0])  # dN/dy * 2A
        
        # Strain-displacement matrix B (3x6)
        B = np.zeros((3, 6))
        for i in range(3):
            B[0, 2*i  ] = b[i] / (2*A)   # epsilon_xx
            B[1, 2*i+1] = c[i] / (2*A)   # epsilon_yy
            B[2, 2*i  ] = c[i] / (2*A)   # gamma_xy
            B[2, 2*i+1] = b[i] / (2*A)
        
        # Element stiffness matrix (6x6)
        Ke = A * (B.T @ C @ B)
        
        # Global DOF indices for this element
        dofs = np.array([2*n0, 2*n0+1, 2*n1, 2*n1+1, 2*n2, 2*n2+1])
        
        # Assemble into global K
        for i in range(6):
            for j in range(6):
                K[dofs[i], dofs[j]] += Ke[i, j]
        
        # Body force (constant per element)
        if body_force is not None:
            bx, by = body_force
            fe = A / 3.0 * np.array([bx, by, bx, by, bx, by])
            f[dofs] += fe
    
    # Neumann boundary conditions (surface tractions)
    for (na, nb), (tx, ty) in zip(neumann_edges, neumann_tractions):
        xa, ya = nodes[na]
        xb, yb = nodes[nb]
        L = np.sqrt((xb-xa)**2 + (yb-ya)**2)
        # Consistent load vector for linear edge
        f[2*na]   += L/2 * tx
        f[2*na+1] += L/2 * ty
        f[2*nb]   += L/2 * tx
        f[2*nb+1] += L/2 * ty
    
    K = K.tocsr()
    
    # Apply Dirichlet BCs by elimination
    K = K.tolil()
    for node_idx, dof, value in dirichlet_nodes:
        global_dof = 2 * node_idx + dof
        # Zero out row and column, put 1 on diagonal
        f -= K[:, global_dof].toarray().flatten() * value
        K[global_dof, :] = 0
        K[:, global_dof] = 0
        K[global_dof, global_dof] = 1.0
        f[global_dof] = value
    
    K = K.tocsr()
    u = spla.spsolve(K, f)
    return u.reshape(N, 2)

# Compute stress at element centroids
def compute_stress(nodes, elements, u, E, nu):
    C = (E / (1 - nu**2)) * np.array([[1,nu,0],[nu,1,0],[0,0,(1-nu)/2]])
    stresses = []
    for n0, n1, n2 in elements:
        x0,y0 = nodes[n0]; x1,y1 = nodes[n1]; x2,y2 = nodes[n2]
        A = 0.5*abs((x1-x0)*(y2-y0)-(x2-x0)*(y1-y0))
        b = np.array([y1-y2, y2-y0, y0-y1])
        c = np.array([x2-x1, x0-x2, x1-x0])
        B = np.zeros((3,6))
        for i in range(3):
            B[0,2*i]=b[i]/(2*A); B[1,2*i+1]=c[i]/(2*A)
            B[2,2*i]=c[i]/(2*A); B[2,2*i+1]=b[i]/(2*A)
        ue = np.array([u[n0,0],u[n0,1],u[n1,0],u[n1,1],u[n2,0],u[n2,1]])
        stresses.append(C @ B @ ue)   # [sigma_xx, sigma_yy, tau_xy]
    return np.array(stresses)
```

The corrected solver produces displacement error below 2% even on the L-domain re-entrant corner, using a conforming Delaunay triangulation that places nodes precisely on the geometric boundary.

---

## The Wow Moment — Push It

Switch to quadratic T6 elements (6-node triangles with mid-edge nodes). On the same L-domain mesh, the error drops from 1.8% to 0.04% — 45× better accuracy with only 2× more DOFs. Add contact mechanics: two wrenches meshed separately, with a contact interface detected by a gap function. Implement a penalty contact: add spring-like forces at penetrating node pairs. Watch the wrenches grip each other and deform realistically when a torque is applied. The stress concentration at the handle-head junction (the exact place wrenches break in real life) lights up bright red in the von Mises stress map. Then implement p-refinement live: increase the element polynomial order from 1 to 2 to 3 to 4 while keeping the same mesh — watch the von Mises stress field sharpen from coarse blobs to crisp rings. Show the convergence curve: error vs polynomial order on a log-log plot — spectral convergence for smooth regions, algebraic convergence near the corner.

---

## The Interactive Demo

**Domain:** L-shape | Wrench | Disk with hole | Custom (draw boundary with mouse)  
**Material:** Steel (E=200 GPa, ν=0.3) | Rubber (E=0.01 GPa, ν=0.49) | Bone (E=20 GPa, ν=0.3) | Custom  
**Element type:** T3 (linear) | T6 (quadratic) | Q4 (bilinear quad) | Q8 (serendipity)  
**Gauss points:** 1 | 3 | 4 | 7 per element  
**Loading:** Fixed left + right traction | Gravity | Point load (click to place) | Pressure on edge  
**Mesh density:** slider 50 – 5000 elements  
**Visualization:** Displacement magnitude | σ_xx | σ_yy | τ_xy | von Mises | Principal stresses (crosses)  
**Assembly animation:** toggle "watch K assemble" mode — each element contribution flashes on the matrix spy plot  
**Refinement:** click element to split it (h-refinement) or increase order (p-refinement)  
**Solver:** Direct (CHOLMOD) | PCG | MINRES  
**Export:** .vtk for ParaView, stiffness matrix as .npz

---

## Production Notes

**Code to show:** The element stiffness loop (`for elem_idx, (n0,n1,n2) in enumerate(elements)`) zoomed in, running one element at a time with the B matrix and K^e computed visually. Show the 6×6 matrix K^e appear, then show the scatter operation into the global K as colored matrix cells.

**Visual layout:** Left: 2D mesh canvas (HTML Canvas 2D) showing the deforming domain with color-mapped von Mises stress. Right: sparse matrix spy plot of K, with the current element's DOF block highlighted. Bottom: convergence curve and error statistics.

**Key cinematic moments:**
- 1:45 — Animate the virtual work integral: draw a tiny test displacement δu at one node, show the arrows propagating through the mesh as if straining an elastic grid. Voice: "This is what the integral ∫ ε(v) : C : ε(u) dΩ means physically."  
- 4:30 — Build the B matrix from scratch on screen for one triangle: draw the triangle, label the nodes, write the shape functions as barycentric coordinates, differentiate symbolically, show the B matrix entry by entry.  
- 7:00 — The assembly animation: each element K^e scatter-adds to K, lighting up 6×6 cells in the global spy plot. After all elements, the banded structure of K is clearly visible.  
- 10:15 — Convergence comparison: FD vs T3 FEM vs T6 FEM on the L-domain corner, log-log error plot. FD line has slope 1, T3 has slope 2, T6 has slope 4, p-refinement shows exponential.

**Equations on screen (rendered with MathJax or KaTeX):** The weak form, the B matrix definition, K^e = ∫ B^T C B dΩ, and the Gauss quadrature formula.

---

## Tags
`FEM` `weak-form` `stiffness-matrix` `shape-functions` `Gauss-quadrature` `structural-mechanics` `variational` `canvas`

---

## Thumbnail

A deformed wrench rendered with a vivid rainbow von Mises stress color map (purple=low, red=high). The stress concentration at the handle-head junction glows bright crimson. Overlaid in the top-right corner: the 6×6 element stiffness matrix K^e with colored entries. Bold text: "K u = f — Where It Comes From."
