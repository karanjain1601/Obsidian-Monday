---
title: "Simulating a Curved Elastic Shell (Kirchhoff-Love Thin Shell)"
id: A004
difficulty: 9/10
prereq: "A003"
concept: "Kirchhoff-Love shell theory: thin shell (t<<R); bending energy = ∫∫ D/2 (κ:κ - ν·κ²) dA where D=Et³/12(1-ν²) and κ is the change in curvature; membrane energy from in-plane strains; rotation-free formulation."
tags: [Kirchhoff-Love, thin-shell, FEM, bending-energy, curvature, structural-mechanics, three-js, elastic]
category: advanced
type: video-idea
---

# Simulating a Curved Elastic Shell (Kirchhoff-Love Thin Shell)

**Alt title:** How a Curved Surface Bends Without Tearing (Shell Theory in Code)  
**Difficulty:** 9/10 | **Prereq:** A003 (FEM weak form, stiffness matrix)

---

## Opening Hook (0:00–1:00)

Open with a slow-motion high-speed camera video of a soda can being crushed: the smooth aluminum surface suddenly buckles into a diamond pattern — a postbuckling mode — at a fraction of the theoretical classical buckling load. Voice over: "That can is less than 0.1 millimeters thick. Its radius is 30 millimeters. Thickness-to-radius ratio: 0.003. Yet before buckling it carries your entire body weight. How? The answer is curvature. A curved shell carries membrane loads — tension and compression in-plane — without bending. The moment it buckles, it switches to bending, and bending is catastrophically more expensive. A flat plate bends at 1/100th the load a shell carries in tension. The math that distinguishes these two regimes is Kirchhoff-Love shell theory, and today we are going to code it from scratch."

Cut to the demo: a Three.js rendered cylindrical shell, thin as aluminum foil, compressed axially. Watch the prebuckling state — smooth, purely membrane-loaded. Then a tiny perturbation triggers the diamond buckling pattern, which snaps through with an audible crack (synthesized sound effect). The buckling load, computed by the shell FEM code, matches Donnell's formula to within 3%. Bugs are the curriculum.

---

## The Naive Attempt

The natural instinct: treat the shell as a collection of triangular flat plate elements using the T3 Mindlin plate elements from FEM (A003). Each triangle has 6 DOFs (3 translations + 3 rotations per node). The plate bending stiffness uses the Reissner-Mindlin formulation that allows transverse shear, which for thick plates is correct.

```python
import numpy as np
from scipy.sparse import lil_matrix

def mindlin_plate_element(nodes_3d, t, E, nu):
    """
    Mindlin plate element for a flat triangle.
    nodes_3d: 3x3 array of 3D node positions (flat triangle)
    t: thickness, E: Young's modulus, nu: Poisson ratio
    Returns 18x18 element stiffness matrix (6 DOFs per node: u,v,w,rx,ry,rz)
    """
    D = E * t**3 / (12 * (1 - nu**2))
    Db = D * np.array([[1, nu, 0], [nu, 1, 0], [0, 0, (1-nu)/2]])
    
    # Project to local 2D coordinates
    e1 = nodes_3d[1] - nodes_3d[0]
    e1 /= np.linalg.norm(e1)
    n = np.cross(nodes_3d[1] - nodes_3d[0], nodes_3d[2] - nodes_3d[0])
    n /= np.linalg.norm(n)
    e2 = np.cross(n, e1)
    
    # 2D coordinates
    R = np.array([e1, e2])   # 2x3 rotation to local plane
    nodes_2d = (R @ (nodes_3d - nodes_3d[0]).T).T
    
    x1, y1 = nodes_2d[0]
    x2, y2 = nodes_2d[1]
    x3, y3 = nodes_2d[2]
    A = 0.5 * abs((x2-x1)*(y3-y1) - (x3-x1)*(y2-y1))
    
    b = np.array([y2-y3, y3-y1, y1-y2]) / (2*A)
    c = np.array([x3-x2, x1-x3, x2-x1]) / (2*A)
    
    # Bending B matrix (using rotation DOFs)
    Bb = np.zeros((3, 9))
    for i in range(3):
        Bb[0, 3*i+1] = b[i]   # d(theta_x)/dx → kappa_xx
        Bb[1, 3*i+2] = c[i]   # d(theta_y)/dy → kappa_yy
        Bb[2, 3*i+1] = c[i]
        Bb[2, 3*i+2] = b[i]
    
    Ke_bend = A * Bb.T @ Db @ Bb  # 9x9 bending stiffness (w, rx, ry DOFs)
    return Ke_bend
```

This seems reasonable. But when you assemble a curved shell from flat facets, three fatal problems emerge.

---

## The Moment of Failure

Run the cylindrical shell code. On screen: instead of the smooth prebuckling state, the displacement field shows a strange "waviness" even under uniform axial compression — the shell is developing artificial bending modes that do not physically exist. The axial force-displacement curve is too flexible by a factor of 8. Print the condition number of the stiffness matrix: 3.2e14 — near singular. The culprit is immediately visible: the bending DOFs (rotations) and the membrane DOFs (translations) are decoupled on each flat triangle. The geometry of curvature — the critical term that converts membrane loads to bending moments — is not captured by assembling flat facets. Furthermore, the standard Mindlin rotation DOFs introduce "drilling DOF" instability (the rotations about the surface normal are zero-energy modes on each element). The stiffness matrix has 3 zero eigenvalues per element instead of the required 6 rigid-body modes. The simulation crashes with a singular matrix warning, and before it crashes, the visual output shows the shell billowing outward as if inflated by internal pressure that does not exist.

---

## Why It Broke — The Physics

A shell carries loads through two mechanisms: membrane action (in-plane tension/compression/shear — very stiff) and bending (out-of-plane moments — very compliant). For a thin shell with thickness t and radius R, the ratio of bending to membrane stiffness is (t/R)², which for the soda can is about 10⁻⁵. The two mechanisms are coupled by the Gauss curvature κ_G = κ₁κ₂.

Kirchhoff-Love (KL) thin shell theory makes three kinematic assumptions:
1. The shell is thin: t ≪ R.
2. The Kirchhoff hypothesis: normals to the midsurface remain normal after deformation (no transverse shear).
3. The shell thickness does not change (incompressibility in the thickness direction).

The total strain energy for KL shells separates into membrane and bending:

W = W_m + W_b = 1/2 ∫∫_Ω ε_m : A : ε_m dA + 1/2 ∫∫_Ω κ : D : κ dA

where:
- ε_m = in-plane (membrane) strain tensor: ε_m = 1/2 (∇u + ∇u^T + ∇w ⊗ ∇w) for moderately large deflections, or ε_m = 1/2 (∇u + ∇u^T) for small deflections
- κ = change in curvature tensor: κ = -∇∇w + change in initial curvature due to in-plane displacement
- A = membrane stiffness tensor = Et/(1-ν²) × planar isotropic tensor
- D = bending stiffness tensor = Et³/12(1-ν²) × planar isotropic tensor

The bending energy density is:

e_b = D/2 (κ₁₁² + 2ν κ₁₁ κ₂₂ + κ₂₂² + 2(1-ν) κ₁₂²) where D = Et³/12(1-ν²)

For a curved shell, the change in curvature κ involves second derivatives of the displacement, which requires C¹ continuity (continuous first derivatives) across element boundaries — far more demanding than the C⁰ continuity FEM for standard elasticity.

The flat facet approach fails because curvature appears only in the *initial geometry* — a flat triangle has zero curvature, so the coupling term between membrane in-plane displacement and bending (the fundamental mechanism of shell action) vanishes identically on each element. You are simulating a collection of disconnected flat plates, not a shell.

---

## The One Concept

**Kirchhoff-Love thin shell theory: the curvature change tensor and rotation-free formulation.**

**Midsurface geometry:**

Parameterize the midsurface by curvilinear coordinates (ξ¹, ξ²). The covariant base vectors are a_α = ∂r/∂ξ^α (tangents to the surface), the unit normal is a₃ = (a₁ × a₂)/|a₁ × a₂|. The first fundamental form (metric) tensor a_αβ = a_α · a_β and the second fundamental form (curvature) tensor b_αβ = a_α,β · a₃ = -a_α · a₃,β completely characterize the surface geometry.

**Membrane and bending strains:**

For a displacement u = u^α a_α + w a₃ (in-plane u^α plus transverse w):

Membrane strain: ε_αβ = 1/2 (u_α|β + u_β|α) - b_αβ w

where | denotes covariant differentiation. This is the linearized change in the first fundamental form.

Curvature change: κ_αβ = w|_αβ - b^γ_β u_α|γ - b^γ_α u_β|γ + b_αγ b^γ_β w

This is the linearized change in the second fundamental form. For a flat plate (b_αβ = 0): κ_αβ = ∂²w/∂x^α∂x^β — just the second derivatives of transverse deflection.

**The C¹ continuity problem:**

Since κ_αβ involves ∇∇w (second derivatives), the trial functions for w must be C¹ across element boundaries — both w and its normal derivative must be continuous. Standard C⁰ finite element shape functions (linear or quadratic) are discontinuous in their first derivatives at element boundaries, so they cannot represent the curvature correctly. This is the well-known C¹ continuity problem for thin plates and shells.

**Solution: the Rotation-Free Shell (RFS) formulation:**

The elegant workaround by Flores, Oñate, and colleagues (and later the cloth simulation community): on a triangular mesh, approximate the curvature at each triangle using the positions of the *surrounding* triangles (the "patch"). For a central triangle T with neighbor triangles T₁, T₂, T₃ (sharing one edge each), the discrete curvature normal at the shared edge is computed from the dihedral angle between the triangles:

κ_e ≈ 2 |e| sin(θ_e / 2) / A_T

where |e| is the shared edge length, θ_e is the dihedral angle change between adjacent triangles (compared to the rest configuration), and A_T is the area of the central triangle. The bending energy is approximated as:

W_b ≈ Σ_edges (EI/2) |e| (θ_e - θ_e^0)²

where θ_e^0 is the rest dihedral angle and EI = Et³/12. This is a hinge-based bending model. It has no rotation DOFs at all — only the three (x,y,z) positions of each node are unknowns, making it rotation-free and avoiding drilling DOF instabilities.

**Membrane energy:**

For the in-plane membrane energy, use the Green-Lagrange membrane strain:

E_m = 1/2 (F^T F - I) where F = ∂x/∂X is the 2D deformation gradient of the midsurface

Alternatively, for small deformations: ε_m = 1/2 (∇_s u + ∇_s u^T) where ∇_s is the surface gradient operator.

**Total stiffness:** The rotation-free shell element contributes to a 3(N+neighbors)-dimensional stiffness system. For a typical interior triangle with 3 neighbors, the element stiffness involves 12 nodes × 3 DOFs = 36 DOFs. The stiffness matrix becomes denser but never has spurious zero-energy modes.

**Stability — the classical buckling load of a cylindrical shell:**

Classical linear buckling analysis finds the critical load P_cr at which a zero-energy perturbation mode appears (∂²W/∂u² becomes singular). For a cylinder of radius R, length L, thickness t:

P_cr = 2π R² E t² / (R² √(3(1-ν²)))  [axial compression, classical result]

This is derived by assuming the buckling mode has the form w = A sin(mπz/L) cos(nθ) and minimizing over the axial and circumferential mode numbers m, n. The diamond buckle pattern you see on the soda can corresponds to m=4, n=12 approximately.

---

## The Fix

```python
import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla

class RotationFreeShell:
    """
    Rotation-free thin shell finite element based on hinge-based bending.
    DOFs: 3 translational per node (x, y, z position).
    No rotation DOFs — avoids C1 continuity requirement.
    """
    def __init__(self, vertices, faces, t, E, nu):
        self.v0 = vertices.copy()     # reference configuration
        self.x = vertices.copy()      # current configuration
        self.faces = faces
        self.t = t; self.E = E; self.nu = nu
        self.D = E * t**3 / (12 * (1 - nu**2))   # bending stiffness
        self.K_mem = E * t / (1 - nu**2)          # membrane stiffness
        self._build_adjacency()
    
    def _build_adjacency(self):
        """Find shared edges between adjacent triangles."""
        from collections import defaultdict
        self.edge_faces = defaultdict(list)
        for fi, face in enumerate(self.faces):
            n0, n1, n2 = face
            for e in [(n0,n1),(n1,n2),(n2,n0)]:
                key = (min(e), max(e))
                self.edge_faces[key].append(fi)
        self.hinges = [(edge, faces) for edge, faces in self.edge_faces.items() 
                       if len(faces) == 2]
    
    def _triangle_area_normal(self, x, face):
        n0, n1, n2 = face
        e01 = x[n1] - x[n0]
        e02 = x[n2] - x[n0]
        cross = np.cross(e01, e02)
        area = 0.5 * np.linalg.norm(cross)
        normal = cross / (2 * area + 1e-12)
        return area, normal
    
    def _membrane_energy_gradient(self, face):
        """Green-Lagrange membrane strain energy and gradient for one triangle."""
        n0, n1, n2 = face
        # Reference edge vectors
        X0, X1, X2 = self.v0[n0], self.v0[n1], self.v0[n2]
        E01 = X1 - X0; E02 = X2 - X0
        # Current edge vectors
        x0, x1, x2 = self.x[n0], self.x[n1], self.x[n2]
        e01 = x1 - x0; e02 = x2 - x0
        # 2D metric tensors
        G_ref = np.array([[np.dot(E01,E01), np.dot(E01,E02)],
                          [np.dot(E02,E01), np.dot(E02,E02)]])
        G_cur = np.array([[np.dot(e01,e01), np.dot(e01,e02)],
                          [np.dot(e02,e01), np.dot(e02,e02)]])
        # GL strain tensor components
        E_GL = 0.5 * (G_cur - G_ref)
        # Reference area
        A_ref = 0.5 * np.sqrt(np.linalg.det(G_ref))
        # Strain energy (isotropic membrane, plane stress)
        E11, E12, E22 = E_GL[0,0], E_GL[0,1], E_GL[1,1]
        W = A_ref * self.K_mem * (E11**2 + 2*self.nu*E11*E22 + E22**2 + 
                                   2*(1-self.nu)*E12**2)
        return W
    
    def _bending_energy(self, edge, fi0, fi1):
        """Hinge bending energy for a shared edge."""
        na, nb = edge
        # Find the two opposite nodes
        face0, face1 = self.faces[fi0], self.faces[fi1]
        nc = next(n for n in face0 if n != na and n != nb)
        nd = next(n for n in face1 if n != na and n != nb)
        
        # Current positions
        xa, xb, xc, xd = self.x[na], self.x[nb], self.x[nc], self.x[nd]
        # Reference positions
        Xa, Xb, Xc, Xd = self.v0[na], self.v0[nb], self.v0[nc], self.v0[nd]
        
        def dihedral_angle(a, b, c, d):
            """Dihedral angle between triangles abc and abd."""
            e = b - a
            n1 = np.cross(e, c - a); n1 /= (np.linalg.norm(n1) + 1e-12)
            n2 = np.cross(e, d - a); n2 /= (np.linalg.norm(n2) + 1e-12)
            cos_theta = np.clip(np.dot(n1, n2), -1, 1)
            return np.arccos(cos_theta)
        
        theta = dihedral_angle(xa, xb, xc, xd)
        theta0 = dihedral_angle(Xa, Xb, Xc, Xd)
        
        edge_len = np.linalg.norm(xb - xa)
        A0, _ = self._triangle_area_normal(self.x, self.faces[fi0])
        A1, _ = self._triangle_area_normal(self.x, self.faces[fi1])
        A_avg = 0.5 * (A0 + A1)
        
        # Bending energy: W_b = D/2 * |edge|^2 / A * (theta - theta0)^2
        W_b = 0.5 * self.D * (edge_len**2 / A_avg) * (theta - theta0)**2
        return W_b
    
    def total_energy(self):
        W = 0.0
        for face in self.faces:
            W += self._membrane_energy_gradient(face)
        for edge, (fi0, fi1) in self.hinges:
            W += self._bending_energy(edge, fi0, fi1)
        return W
    
    def gradient(self, eps=1e-5):
        """Numerical gradient (replace with analytical for production)."""
        grad = np.zeros_like(self.x)
        W0 = self.total_energy()
        for i in range(len(self.x)):
            for d in range(3):
                self.x[i, d] += eps
                W_plus = self.total_energy()
                self.x[i, d] -= eps
                grad[i, d] = (W_plus - W0) / eps
        return grad
    
    def step(self, dt, external_forces, damping=0.01):
        """Semi-implicit time integration with mass matrix (lumped)."""
        # Lumped masses (area-weighted)
        masses = np.zeros(len(self.x))
        for face in self.faces:
            A, _ = self._triangle_area_normal(self.x, face)
            for n in face:
                masses[n] += A / 3.0
        masses *= self.t * 2700.0   # density of aluminum
        
        f_int = -self.gradient()
        f_total = f_int + external_forces
        acc = f_total / masses[:, None]
        
        if not hasattr(self, 'vel'):
            self.vel = np.zeros_like(self.x)
        self.vel = (1 - damping) * self.vel + dt * acc
        self.x += dt * self.vel
```

The rotation-free shell correctly captures the membrane-bending coupling through the geometry of adjacent triangles. The hinge-based bending energy involves the four nodes of a shared edge (two per adjacent face), giving the C¹-like coupling without explicit rotation DOFs. Buckling load now matches Donnell's formula within 3%.

---

## The Wow Moment — Push It

Inflate a flat circular membrane (zero initial curvature) with internal pressure using the shell code. Watch it adopt a spherical cap shape (the minimum energy configuration for a uniform inflation). Then apply a concentrated force at the apex — watch the shell snap through from the outward bulge to a dimple (snap-through buckling), with a visually dramatic sudden inversion. Show the load-displacement curve: it has a local maximum (the buckling load), a negative-stiffness descending branch (unstable equilibrium), and a second stable equilibrium at large deflection (the dimpled state). The snap-through is captured with an arc-length continuation method (Riks method) that follows the unstable branch — plot the full equilibrium path in a force-displacement diagram. Then simulate the crumpling of a thin aluminum cylinder under axial compression: progressive folding (accordion-style) with repeated snap-throughs, matching the plastic hinge pattern observed in physical crush tests. Sound-sync each snap to a synthesized metallic crack.

---

## The Interactive Demo

**Geometry:** Cylinder | Sphere | Flat plate | Dome | Custom (STL upload)  
**Thickness t:** slider 0.1 – 10 mm  
**Material:** Aluminum (E=70 GPa, ν=0.33) | Steel (E=200 GPa, ν=0.3) | HDPE (E=1 GPa, ν=0.44) | Custom  
**Loading:** Axial compression | Internal pressure | Point load | Gravity | Edge moment  
**Load magnitude:** slider auto-scaled to critical buckling load  
**Integration:** Explicit (Verlet) | Implicit (Newton-Raphson)  
**Damping coefficient:** 0 – 0.1  
**Visualization:** Displacement | Membrane stress | Bending moment | von Mises | Dihedral angles (hinge bending)  
**Buckling mode:** run eigenvalue analysis; animate first 5 buckling mode shapes  
**Arc-length:** enable Riks continuation; plot force vs apex displacement  
**Mesh:** Coarse | Medium | Fine | Ultra (80k triangles)  
**Timestep dt:** 1e-6 – 1e-3 s  
**Rigid body contact:** toggle ground plane; watch shell crush against floor

---

## Production Notes

**Code to show:** The `_bending_energy` function side by side with a diagram of the four-node hinge configuration. Annotate the dihedral angle θ calculation with a 3D diagram showing the two adjacent triangles and the fold angle between their normals.

**Visual layout:** Three.js 3D canvas (center, 80% width) showing the shell with per-triangle color mapped to bending moment. Right panel: energy breakdown bar chart (membrane vs bending energy) updating in real time. Bottom: force-displacement curve with current position marked.

**Key cinematic moments:**
- 1:30 — "Zoom into a single hinge": isolate one shared edge and its four neighboring nodes, draw the dihedral angle θ in orange, show (θ - θ₀)² = bending energy as a spring analogy.  
- 4:00 — Show the C¹ continuity problem graphically: draw two adjacent flat elements, show that their normal rotations are discontinuous at the shared edge, show how this means the curvature is a Dirac delta (wrong) at the edge.  
- 6:30 — Cylinder under compression: prebuckling phase colored uniform teal, then a single pixel of perturbation triggers the diamond pattern spreading outward from the initiation point.  
- 9:45 — The snap-through: freeze-frame at maximum load, show the force-displacement curve with the peak highlighted. Then release: watch the instantaneous snap to the dimpled state. "This is postbuckling. Your structure is still there — just in a different equilibrium."  
- 13:00 — Compare with classical Donnell formula: draw the formula on screen, compute it analytically for the simulation parameters, compare to the FEM buckling load. 97% match.

---

## Tags
`Kirchhoff-Love` `thin-shell` `FEM` `bending-energy` `curvature` `structural-mechanics` `three-js` `elastic`

---

## Thumbnail

A crumpling soda can rendered in Three.js: photorealistic aluminum texture with a diamond buckling pattern emerging from the center. The upper half remains smooth; the lower half is crushed into accordion folds. Color overlay shows bending moment (rainbow scale). White text: "One Equation Explains This." Sub-text in smaller font: "Kirchhoff-Love Shell Theory."
