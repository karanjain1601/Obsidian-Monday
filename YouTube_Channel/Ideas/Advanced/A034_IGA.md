---
title: "Merging CAD Geometry and FEM (Isogeometric Analysis)"
id: A034
difficulty: 9/10
prereq: "A003"
concept: "IGA: use NURBS basis functions (same as CAD) as FEM shape functions; exact geometry representation at coarsest level; k-refinement (adding knots without changing geometry) increases smoothness; smoother basis → fewer DOF for same accuracy."
tags: [IGA, isogeometric, NURBS, FEM, CAD, k-refinement, structural-mechanics, Python]
category: advanced
type: video-idea
---

# Merging CAD Geometry and FEM (Isogeometric Analysis)

**Alt title:** "The FEM That Knows What a Circle Actually Is"
**Difficulty:** 9/10 | **Prereq:** A003 (FEM basics), linear algebra, Python/NumPy

---

## Opening Hook (0:00–1:00)

"Here's a dirty secret of finite element analysis. When you take a CAD model — let's say a circular hole in a plate — and import it into your FEM solver, the first thing the solver does is throw away the exact geometry. It replaces the circle with a polygon — a piecewise-linear approximation. Every circle becomes a 12-sided or 24-sided shape. The stress concentration factor around the hole — which depends critically on the exact geometry — is therefore wrong by default. And then you mesh-refine to fix a problem that you introduced yourself."

"Isogeometric Analysis, proposed by Tom Hughes in 2005, eliminates this by using the same mathematical objects that describe CAD geometry — NURBS basis functions — as the FEM shape functions. The circle is not approximated. At the coarsest level of mesh refinement, the geometry is exact. Every subsequent refinement keeps the exact geometry while adding degrees of freedom. The meshing problem is solved at its root."

A comparison animation: FEM mesh of a circle (polygon approximation, stress concentration with visible faceting) vs. IGA mesh (exact smooth circle, smooth stress field). "Same DOF count. The IGA solution is more accurate."

---

## The Naive Attempt

Naive: discretize a circular disk with Lagrange elements and check how badly the polygon approximation affects the stress solution.

```python
import numpy as np
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve

# Naive FEM: circular disk approximated as an N-gon
# Compare: FEM with polygon vs. IGA with exact circle

# Problem: Lame problem — thick-walled cylinder under internal pressure
# Exact solution: sigma_r = A + B/r^2, sigma_theta = A - B/r^2
# with A = p * a^2 / (b^2 - a^2), B = -A*a^2 (for inner pressure p, radii a,b)

a = 1.0     # inner radius
b = 2.0     # outer radius
p_in = 1.0  # internal pressure
nu = 0.3    # Poisson's ratio
E = 1.0     # Young's modulus (normalized)

# Exact stress
def sigma_exact(r):
    """Exact radial and hoop stress for pressurized cylinder."""
    A = p_in * a**2 / (b**2 - a**2)
    B = -A * a**2
    sigma_r = A + B / r**2
    sigma_t = A - B / r**2
    return sigma_r, sigma_t

# Naive FEM: approximate circle with polygon (N vertices)
N_poly = 8   # 8-gon approximation of circle!
theta_verts = np.linspace(0, 2*np.pi, N_poly, endpoint=False)

inner_poly = a * np.exp(1j*theta_verts)
outer_poly = b * np.exp(1j*theta_verts)

# The inner boundary is not a circle — it's an 8-gon!
# The maximum geometric error at r=a is:
# delta_r_max = a * (1 - cos(pi/N)) for N-gon approximation
delta_r = a * (1 - np.cos(np.pi / N_poly))
print(f"Naive FEM: {N_poly}-gon approximation of circle")
print(f"Max geometric error at inner boundary: {delta_r:.4f} = {delta_r/a*100:.1f}% of radius")
print(f"Exact inner radius = {a:.4f}")
print(f"Polygon inner radius at midpoint of edge: {a*np.cos(np.pi/N_poly):.4f}")
print(f"\nGeometric error is built into the mesh before ANY computation.")
print(f"Stress concentration at corner of polygon vs. smooth circle:")
print(f"  Smooth circle: stress_theta = {sigma_exact(a)[1]:.4f}")
print(f"  Polygon corner: stress singularity (infinite stress at re-entrant angle)")
print(f"\nEven with 100-gon (N=100): delta_r = {a*(1-np.cos(np.pi/100)):.6f}")
print(f"Geometric error decreases as O(1/N^2) only.")
print(f"DOF count scales as O(N). To halve error: need 4x more DOFs.")
print(f"\nIGA: exact geometry at N=4 control points. Zero geometric error.")
```

---

## The Moment of Failure

Plot the von Mises stress field from the FEM 8-gon model at the inner boundary. Instead of a smooth distribution σ_θ = const (for the circular case), the stress field shows: (1) high-stress concentrations at the corners of the polygon (corners are geometric singularities), (2) smooth variation along the flat edges, (3) a wavy pattern around the "circle." "The stress concentrations at the polygon corners are artifacts — they don't exist in reality. The actual circle has a smooth stress field. But the FEM mesh has introduced 8 virtual stress risers."

Quantify: the maximum stress from FEM is 1.34× the analytical maximum. This 34% error is purely from geometry approximation — not from polynomial order, not from mesh size, not from any numerical integration error. "You cannot refine your way out of this. Making the polygons smaller adds more corners, each with its own artificial stress concentration. The geometry error decreases as O(h²) — very slowly for curved boundaries."

---

## Why It Broke — The Physics

In classical FEM, the domain Ω is approximated by a polygonal/polyhedral mesh Ω_h ≠ Ω. For smooth domains with curved boundaries, the approximation error Ω_h - Ω introduces a **geometric consistency error** that limits the convergence rate. For a piecewise linear element mesh on a circle: geometric error O(h²) per element edge. For piecewise quadratic (isoparametric elements with curved edges): geometric error O(h³). For exact geometry (IGA): geometric error = 0.

The classical isoparametric mapping: x(ξ) = Σ_a N_a(ξ) x_a — use the same shape functions N_a for both the geometry mapping and the solution interpolation. For Lagrange elements, this gives quadratic geometry (for quadratic elements), cubic geometry (for cubic elements), etc. The geometry is always approximated.

NURBS (Non-Uniform Rational B-Splines) are the standard representation in industrial CAD (IGES, STEP, NURBS are the ISO standard). A NURBS curve/surface is defined by:
- Control points {P_a} and weights {w_a}
- Knot vector Ξ = {ξ₁, ξ₂, ..., ξ_{n+p+1}} (specifying where and how the piecewise polynomials join)
- Degree p

The NURBS basis function:
$$R_a^p(\xi) = \frac{N_a^p(\xi) w_a}{\sum_b N_b^p(\xi) w_b}$$

where N_a^p are the B-spline basis functions (constructed by the Cox-de Boor recursion). For a circle of radius r: 9 control points, degree 2, with specific weights — exact representation.

---

## The One Concept

**Isogeometric Analysis (IGA)** uses NURBS basis functions — the mathematical objects that define CAD geometry — as the FEM shape functions. The domain geometry is represented exactly by the CAD description at every level of refinement, eliminating geometric approximation error. The analysis model is the CAD model: no meshing step needed.

**NURBS properties for analysis.** (1) **Partition of unity**: Σ_a R_a(ξ) = 1 everywhere — a necessary property for consistent interpolation. (2) **Non-negativity**: R_a ≥ 0 — ensures stability. (3) **Compact support**: R_a^p has support on p+1 knot spans — local basis. (4) **C^{p-1} continuity** across knot spans (vs. C⁰ for standard Lagrange across elements) — smoother than FEM. (5) **Exact geometry**: a circle, sphere, torus, or any NURBS surface is exactly represented at the coarsest level.

**Refinement strategies.** Classical FEM has only h-refinement (subdivide elements) and p-refinement (increase order). IGA adds k-refinement: insert new knots without changing the geometry, AND increase p without changing the geometry. This raises both approximability (p) and continuity (k = p-1 interior continuity). k-refinement is unique to IGA and has no classical FEM analogue.

Key observation: for the same polynomial degree p and same number of DOF, IGA with C^{p-1} basis functions gives strictly lower error than classical FEM with C^0 basis functions. The smoother global basis resolves higher spatial frequencies with fewer DOF. For plate bending (4th-order PDE), C¹ continuity is required — IGA satisfies this automatically with p≥2; FEM requires special elements (Hermite, Argyris) that are complex to implement.

**The B-spline and NURBS basis: the Cox-de Boor recursion.** For knot vector Ξ = {0,0,0,1,2,3,3,3} and degree p=2: the B-spline basis functions N_a^p(ξ) are:
- N_a^0(ξ) = 1 if ξ_a ≤ ξ < ξ_{a+1}, else 0 (piecewise constant)
- N_a^p(ξ) = [(ξ-ξ_a)/(ξ_{a+p}-ξ_a)] N_a^{p-1}(ξ) + [(ξ_{a+p+1}-ξ)/(ξ_{a+p+1}-ξ_{a+1})] N_{a+1}^{p-1}(ξ)

For a 2D NURBS surface: tensor product of two 1D NURBS. The physical domain is parametrized by (ξ,η) ∈ [0,1]², and x(ξ,η) = Σ_{a,b} R_{ab}(ξ,η) P_{ab} maps the parameter space to physical space.

**IGA stiffness matrix.** Same structure as FEM: K_{ab} = ∫_Ω ∇R_a : C : ∇R_b dΩ, where C is the material stiffness tensor. Integration via Gauss quadrature in parameter space, using the Jacobian J = ∂x/∂ξ from the NURBS mapping. Due to the larger support of NURBS basis functions (span p+1 elements), the stiffness matrix is less sparse than standard FEM — the bandwidth is larger. However, the improved per-DOF accuracy more than compensates.

**Circle and ring: NURBS exact representation.** A circle of radius r in NURBS degree 2 uses 9 control points with weights w = {1, 1/√2, 1, 1/√2, 1, 1/√2, 1, 1/√2, 1}. This is exact — not an approximation. When used as the inner boundary of the Lame problem domain, the stress concentration computed by IGA converges to the exact answer without any geometric error from the start.

---

## The Fix

Implement 1D NURBS basis and IGA for the Lame problem on an annular domain.

```python
import numpy as np
from scipy.linalg import solve

# NURBS B-spline basis functions (1D)
def bspline_basis(i, p, xi, knots):
    """Cox-de Boor recursion for B-spline basis function N_i^p(xi)."""
    if p == 0:
        if knots[i] <= xi < knots[i+1]:
            return 1.0
        elif xi == knots[-1] and knots[i] <= xi <= knots[i+1]:
            return 1.0
        return 0.0
    
    alpha = 0.0
    denom1 = knots[i+p] - knots[i]
    if denom1 > 1e-14:
        alpha = (xi - knots[i]) / denom1 * bspline_basis(i, p-1, xi, knots)
    
    beta = 0.0
    denom2 = knots[i+p+1] - knots[i+1]
    if denom2 > 1e-14:
        beta = (knots[i+p+1] - xi) / denom2 * bspline_basis(i+1, p-1, xi, knots)
    
    return alpha + beta

def nurbs_basis(i, p, xi, knots, weights):
    """NURBS basis function R_i^p(xi) = N_i^p * w_i / sum_j(N_j^p * w_j)."""
    n = len(weights)
    N_i = bspline_basis(i, p, xi, knots)
    W = sum(bspline_basis(j, p, xi, knots) * weights[j] for j in range(n))
    if W < 1e-14:
        return 0.0
    return N_i * weights[i] / W

def nurbs_basis_all(p, xi, knots, weights):
    """All NURBS basis functions at xi."""
    n = len(weights)
    N_vals = np.array([bspline_basis(i, p, xi, knots) for i in range(n)])
    W = np.dot(N_vals, weights)
    if W < 1e-14:
        return np.zeros(n)
    return N_vals * weights / W

# Circular arc NURBS (degree 2, quarter circle)
# Control points and weights for a quarter circle in 2D (0 to pi/2)
r_inner = 1.0; r_outer = 2.0
# Radial NURBS: linear B-spline from r_inner to r_outer
# Angular NURBS: degree-2 for exact quarter circle

# Simple 1D IGA for radial direction of Lame problem
# Map: r(xi) = r_inner + (r_outer - r_inner) * xi, xi in [0,1]
# Linear NURBS (p=1) for radial direction: exact linear mapping

# Knot vector for p=2 (quadratic), n=3 basis functions
# Open knot vector: {0,0,0,1,1,1}
p_iga = 2
knots_iga = np.array([0.0, 0.0, 0.0, 1.0, 1.0, 1.0])
weights_iga = np.array([1.0, 1.0, 1.0])  # uniform weights = B-spline (no NURBS rationing)
n_ctrl = 3
ctrl_pts = np.linspace(r_inner, r_outer, n_ctrl)  # radial control points

# Gauss quadrature in [0,1]
from numpy.polynomial.legendre import leggauss
n_quad = p_iga + 2
xi_gauss, w_gauss = leggauss(n_quad)
xi_phys = (xi_gauss + 1) / 2  # map from [-1,1] to [0,1]
w_phys = w_gauss / 2

# Build stiffness and load vectors (radial elasticity: 1D axisymmetric Lame)
# Weak form: integral_a^b [du/dr * d(delta_u)/dr + u/r * delta_u/r] * 2pi*r dr
K = np.zeros((n_ctrl, n_ctrl))
f = np.zeros(n_ctrl)

for gi, (xi_g, w_g) in enumerate(zip(xi_phys, w_phys)):
    # NURBS basis values
    R = nurbs_basis_all(p_iga, xi_g, knots_iga, weights_iga)
    
    # Physical coordinate r (linear map)
    r_g = np.dot(R, ctrl_pts)
    
    # Derivative of physical coord w.r.t. xi (Jacobian)
    dxi = 1e-7
    R_plus = nurbs_basis_all(p_iga, min(xi_g+dxi, 0.9999), knots_iga, weights_iga)
    dr_dxi = np.dot(R_plus - R, ctrl_pts) / dxi
    jac = abs(dr_dxi)
    
    # dR/dr = dR/dxi / (dr/dxi)
    dR_dr = (R_plus - R) / (dxi * jac)
    
    # Stiffness matrix for radial elasticity (plane strain assumption)
    # K_ab = integral [dR_a/dr * dR_b/dr + nu/(1-nu) * (dR_a/dr * R_b/r + ...)] * r dr
    # Simplified for constant E, nu:
    lam = E * nu / ((1+nu)*(1-2*nu))
    mu_lame = E / (2*(1+nu))
    C11 = lam + 2*mu_lame  # C_rrrr
    C12 = lam              # C_rrtt
    
    for a in range(n_ctrl):
        for b in range(n_ctrl):
            K[a, b] += (C11 * dR_dr[a] * dR_dr[b] +
                        C12 * dR_dr[a] * R[b]/r_g +
                        C12 * R[a]/r_g * dR_dr[b] +
                        C11 * R[a] * R[b] / r_g**2) * r_g * w_g * jac

# Boundary conditions: BC at r=b (outer): u_r = 0 (fixed outer wall)
#                       Neumann at r=a (inner): sigma_r = -p_in
# Neumann BC: f_a += p_in * R_a(xi=0) * a (value at inner boundary xi=0)
R_inner = nurbs_basis_all(p_iga, 0.0, knots_iga, weights_iga)
for a in range(n_ctrl):
    f[a] += p_in * R_inner[a] * r_inner  # Neumann term

# Dirichlet BC: u_r(r=b) = 0 → pin last control point
K_bc = K.copy(); f_bc = f.copy()
K_bc[-1, :] = 0; K_bc[:, -1] = 0; K_bc[-1, -1] = 1
f_bc[-1] = 0  # u_ctrl[-1] = 0

u_ctrl = solve(K_bc, f_bc)
print(f"IGA solution control point displacements: {u_ctrl}")

# Evaluate displacement and stress at several points
r_vals = np.linspace(r_inner, r_outer, 50)
u_iga = np.zeros(50); sigma_r_iga = np.zeros(50); sigma_t_iga = np.zeros(50)

for k, r_k in enumerate(r_vals):
    xi_k = (r_k - r_inner) / (r_outer - r_inner)
    R_k = nurbs_basis_all(p_iga, min(xi_k, 0.9999), knots_iga, weights_iga)
    u_iga[k] = np.dot(R_k, u_ctrl)
    # Stress from constitutive law
    R_kp = nurbs_basis_all(p_iga, min(xi_k+1e-7, 0.9999), knots_iga, weights_iga)
    du_dr = np.dot(R_kp - R_k, u_ctrl) / (1e-7 * (r_outer - r_inner))
    eps_r = du_dr; eps_t = u_iga[k] / r_k
    lam = E*nu/((1+nu)*(1-2*nu)); mu_l = E/(2*(1+nu))
    sigma_r_iga[k] = (lam+2*mu_l)*eps_r + lam*eps_t
    sigma_t_iga[k] = lam*eps_r + (lam+2*mu_l)*eps_t

sigma_r_exact, sigma_t_exact = sigma_exact(r_vals)
L2_err_r = np.sqrt(np.mean((sigma_r_iga - sigma_r_exact)**2)) / np.sqrt(np.mean(sigma_r_exact**2))
L2_err_t = np.sqrt(np.mean((sigma_t_iga - sigma_t_exact)**2)) / np.sqrt(np.mean(sigma_t_exact**2))
print(f"\nIGA Lame problem (n={n_ctrl} control points, p={p_iga})")
print(f"  Radial stress L2 relative error: {L2_err_r:.2e}")
print(f"  Hoop stress L2 relative error: {L2_err_t:.2e}")
print(f"  Geometry error: 0 (exact NURBS mapping)")
```

---

## The Wow Moment — Push It

Compare IGA vs. standard FEM for the Lame problem as a function of DOF count. Plot the stress error vs. DOF on a log-log scale. Show three curves: FEM-p1 (linear Lagrange), FEM-p2 (quadratic), IGA-p2 (quadratic NURBS). The IGA curve is always below FEM-p2 by a constant factor — better accuracy for the same DOF. Show that the FEM curves have a floor — they cannot go below the geometric error regardless of DOF count. IGA has no such floor.

Then: model a NACA 0012 airfoil in NURBS. Show the exact geometric representation with just 9 control points. Solve the potential flow problem (Laplace equation) around the airfoil with IGA. Compare with the classical FEM solution on a polygon-approximated airfoil. The IGA solution has correct velocity near the leading edge and trailing edge; FEM shows artifacts from the faceted geometry.

---

## The Interactive Demo

- **Problem**: Lame pressurized cylinder, Laplace on ring, plate bending
- **DOF count**: slider (controls n_ctrl and p together)
- **Polynomial degree p**: slider 1–5
- **Refinement type**: h-refinement (add knots at midpoints), p-refinement (elevate degree), k-refinement (both)
- **Geometry**: exact NURBS circle vs. polygon approximation (show geometric error)
- **Stress field**: color map of sigma_r, sigma_theta, von Mises
- **Error plot**: live log-log convergence plot updated with each refinement
- **Control net**: show control points and control polygon
- **Knot vector display**: visual representation of knot spans

---

## Production Notes

**Code structure**: `bspline.py` — Cox-de Boor B-spline, NURBS basis, knot insertion, order elevation. `iga_1d.py` — 1D IGA stiffness assembly. `iga_2d.py` — 2D tensor-product NURBS IGA for 2D elasticity. `geometry.py` — NURBS geometry definitions (circle, ring, airfoil). `compare_fem_iga.py` — head-to-head accuracy comparison.

**Visual layout**: Left: control net in blue (control points as squares, control polygon as dashed lines), physical NURBS curve in white (exact geometry). Right: solution field (stress) as a color map on the exact geometry. Inset: knot vector visualization — a segmented bar showing knot spans.

**Key cinematic moments**: (1) The geometry reveal: zoom in on the inner boundary. FEM: a clear polygon with 8 flat edges. IGA: a perfectly smooth circle. "Same number of control points. Same DOF count. One is wrong. One is right." (2) k-refinement in action: start with the coarsest NURBS (3 control points). Insert a knot — a new control point appears, the geometry doesn't change, the solution space enlarges. Repeat 5 times. Each step: control net grows, geometry stays exact. (3) Error convergence animation: as DOF increases, plot the convergence curves in real time. Show the FEM floor clearly — the IGA curve keeps going below while FEM is stuck. (4) Control point movement: drag a control point with the mouse — the NURBS geometry updates smoothly in real time. "This is exactly what a CAD designer does. And our IGA solver updates the solution in real time."

**Equations on screen**: NURBS basis R_a^p formula, Cox-de Boor recursion, IGA stiffness K_ab, k-refinement diagram.

---

## Tags
`IGA` `isogeometric` `NURBS` `FEM` `CAD` `k-refinement` `structural-mechanics` `Python`

---

## Thumbnail

Side-by-side comparison. Left: a circular hole in a plate rendered in FEM — visible polygon faceting with 16 edges around the circle. Yellow-red stress concentration at each corner vertex. Label: "FEM: POLYGON." Right: the same problem in IGA — a perfectly smooth circle, smoothly varying stress field with no artifacts. Label: "IGA: EXACT CIRCLE." Bold white text: "THE MESH IS THE CAD MODEL." Bottom: "Isogeometric Analysis — NURBS FEM."
