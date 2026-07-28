---
title: "Solving Fluid Mechanics With Complex Analysis (Conformal Mapping)"
id: A031
difficulty: 8.5/10
prereq: "None"
concept: "Potential flow (irrotational, incompressible): ∇²φ=0; complex potential W(z) = φ+iψ; Joukowski transform maps circle to airfoil; Kutta condition enforces smooth trailing edge; lift = ρU·Γ (Kutta-Joukowski)."
tags: [conformal-mapping, potential-flow, complex-analysis, Joukowski, airfoil, Kutta-condition, lift, canvas]
category: advanced
type: video-idea
---

# Solving Fluid Mechanics With Complex Analysis (Conformal Mapping)

**Alt title:** "Why Airplanes Fly: Derived in 45 Minutes With Complex Numbers"
**Difficulty:** 8.5/10 | **Prereq:** Complex analysis, vector calculus, Python/NumPy

---

## Opening Hook (0:00–1:00)

"In 1910, Nikolai Joukowski published a paper showing that you could calculate the lift on any airfoil using a single complex-variable transformation. One line of math. No computational fluid dynamics. No Navier-Stokes. Just z → z + 1/z. That single transformation maps a circle — the simplest geometry in the world — to a shape that looks exactly like an airplane wing."

"Today, almost every introductory aerodynamics textbook derives lift using this method. And we're going to implement it in 50 lines of Python, visualize the streamlines around an airfoil, and derive the Kutta-Joukowski theorem: L = ρUΓ — lift equals density times velocity times circulation. Exactly."

A complex plane visualization appears: a circle in one window, a Joukowski airfoil in another. Streamlines flow past each shape. "The two flows are related by a conformal map. Every streamline around the circle maps to a streamline around the airfoil. One solution — infinite applications."

---

## The Naive Attempt

Naive: try to solve for flow around an airfoil by direct numerical solution of Laplace's equation on a Cartesian grid with the airfoil boundary — tedious, inaccurate near sharp edges.

```python
import numpy as np
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve

# Naive: finite difference Laplace solver on Cartesian grid with airfoil mask
# Problem: the airfoil has a sharp trailing edge, which requires very fine resolution
# and the irregular boundary makes finite difference messy

Nx, Ny = 100, 80
x_min, x_max = -3, 5
y_min, y_max = -3, 3
x = np.linspace(x_min, x_max, Nx)
y = np.linspace(y_min, y_max, Ny)
dx = x[1] - x[0]
dy = y[1] - y[0]
X, Y = np.meshgrid(x, y)

# Simple NACA0012 airfoil geometry (parametric)
def naca0012(t):
    """NACA 0012 half-thickness distribution."""
    # t = x/c, returns y_t/c (half-thickness)
    return 0.6 * (0.2969*np.sqrt(t) - 0.1260*t - 0.3516*t**2 + 0.2843*t**3 - 0.1015*t**4)

# Build mask: interior of airfoil = 0 (Dirichlet), exterior = solve
t_values = np.linspace(0, 1, 200)
x_upper = t_values
y_upper = naca0012(t_values)
x_lower = t_values
y_lower = -naca0012(t_values)

# Mark airfoil cells
mask = np.ones((Ny, Nx), dtype=bool)  # True = solve here
for i in range(Nx):
    for j in range(Ny):
        # Crude check: is point (X[j,i], Y[j,i]) inside airfoil?
        xi = X[j, i]
        yi = Y[j, i]
        if 0 <= xi <= 1:
            t_local = xi
            y_thick = naca0012(t_local)
            if abs(yi) < y_thick:
                mask[j, i] = False  # inside airfoil

# Build sparse Laplace system (only for exterior points)
N_pts = np.sum(mask)
print(f"Grid size: {Nx}x{Ny} = {Nx*Ny} points")
print(f"Exterior points: {N_pts}")
print(f"Problem: at trailing edge (x=1, y=0), grid cells are O(dx)={dx:.3f}")
print(f"Real trailing edge is infinitely sharp — Laplace solution is singular there!")
print(f"Finite difference near singularity: inaccurate, slow convergence")
print(f"\nConformal mapping bypasses this ENTIRELY.")
print(f"The circle has no corners. The mapping handles the singularity analytically.")
```

The naive finite difference solver: singular near the sharp trailing edge, inaccurate, requires 10,000+ grid points for reasonable accuracy, and gives no physical insight. "Every grid point near the trailing edge is wrong. The grid can't resolve a geometric singularity. Conformal mapping maps this singularity analytically to the back of the circle."

---

## The Moment of Failure

Run the FD solver. Plot the velocity near the trailing edge. The velocity diverges — numerically, to the machine precision cutoff, then oscillates. The lift computed from integrating the pressure is wrong by 30% even on a 200×200 grid. "The finite difference method doesn't know about the Kutta condition — the physical requirement that the flow leaves the trailing edge smoothly. We have to impose it manually, and with a sharp corner, the singularity in the velocity field makes this nearly impossible numerically."

The theoretical issue: near the trailing edge of an airfoil with wedge angle 2π (sharp), the velocity scales as V ~ r^{-1/2} (square-root singularity in 1/r). A finite difference grid cannot resolve this. Conformal mapping transfers the problem to a circle where the geometry is smooth and the Kutta condition is imposed by choosing the correct circulation.

---

## Why It Broke — The Physics

Potential flow: assume the fluid is inviscid, incompressible, and irrotational. Then ∇·v = 0 (incompressibility) and ∇×v = 0 (irrotationality). These together imply ∇²φ = 0 (Laplace equation for the velocity potential φ, where v = ∇φ). In 2D: φ + iψ = W(z) is the **complex potential**, where z = x + iy, and W(z) is an analytic function.

Key flows and their complex potentials:
- Uniform flow at angle α: W = Ue^{-iα} z
- Doublet at origin (strength κ): W = κ/(2πz)
- Vortex at origin (circulation Γ): W = -iΓ/(2π) ln(z)
- Flow past a cylinder of radius a: W = U(z + a²/z)

The velocity components: v_x - iv_y = dW/dz. The pressure follows from Bernoulli: p = p_∞ + ½ρ(U² - |v|²).

**Conformal mapping.** A conformal map f: z-plane → ζ-plane is a complex analytic function that preserves angles locally. If W(z) is the complex potential in the z-plane, then W(f^{-1}(ζ)) is the complex potential in the ζ-plane. If z-plane flow satisfies the boundary conditions on some geometry in z, then ζ-plane flow satisfies the boundary conditions on the mapped geometry.

The Joukowski transformation: ζ = z + c²/z (c real). This maps a circle to an airfoil-like shape. For a circle of radius a centered at (-ε, δ) in the z-plane (ε small for thickness, δ small for camber), the mapped shape has a sharp trailing edge (cusp if δ=0) and a smooth leading edge.

The Kutta condition: the flow must leave the trailing edge smoothly (finite velocity). This requires the stagnation point to be at the trailing edge, which fixes the circulation Γ = 4πUa sin(α + β) where α is the angle of attack and β is related to the offset. The lift:
$$L = \rho U \Gamma = 4\pi\rho U^2 a \sin(\alpha + \beta)$$

---

## The One Concept

**Conformal mapping for potential flow** exploits the fact that Laplace's equation is preserved under conformal (analytic) maps. By mapping a complex geometry (airfoil) to a simple one (circle), solving the simple problem in closed form, and mapping back, one obtains the exact solution to the original problem — without any discretization.

**Flow past a circle: exact solution.** For a circle of radius a centered at the origin, with uniform flow U at angle α and circulation Γ (counterclockwise):
$$W(z) = U\left(e^{-i\alpha}z + \frac{a^2 e^{i\alpha}}{z}\right) + \frac{i\Gamma}{2\pi}\ln z$$

The streamlines ψ = constant are the imaginary part of W. The velocity magnitude |dW/dz|: on the cylinder surface (z = ae^{iθ}):
$$v_\theta = -2U\sin(\theta - \alpha) + \frac{\Gamma}{2\pi a}$$

Stagnation points where v_θ = 0: sin(θ - α) = Γ/(4πUa). Lift per unit span: L = ρUΓ (Kutta-Joukowski theorem, derived from Blasius integral).

**Joukowski transform.** ζ(z) = z + c²/z, with c = a - ε (slightly inside the cylinder radius). For a cylinder centered at (-ε, δ):
- Trailing edge: z → c maps to ζ = 2c (cusp, sharp)
- Leading edge: z → -c maps to ζ = -2c (rounded)
- Profile: parameterize z = R·e^{iθ} + center; apply ζ(z) for all θ

The profile chord: approximately 4c. For a circle at (-ε, 0): symmetric airfoil (NACA00XX analogue). For δ≠0: cambered airfoil. The zero-lift angle: α₀ = -arctan(δ/ε) approximately.

**The Kutta condition: fixing the circulation.** For a given airfoil in a flow at angle α, the circulation Γ is determined by requiring that the flow leaves the trailing edge smoothly. Mathematically: the derivative dW/dz must have a finite limit as z approaches the preimage of the trailing edge (z = c). Since the Joukowski map has dζ/dz = 1 - c²/z², which vanishes at z = ±c, the point z = c maps to a cusp in ζ — the velocity in ζ can remain finite only if the velocity in z also vanishes at z = c. The condition dW/dz = 0 at z = c determines Γ uniquely:
$$\Gamma = 4\pi U a \sin\alpha$$

for the symmetric airfoil (δ=0, ε→0, a≈c). This gives the lift slope dCL/dα = 2π — the famous thin-airfoil result, exact for potential flow.

**Streamlines and pressure.** Given W(ζ) = W(z(ζ)) in the physical plane (by inverting the Joukowski map), compute dW/dζ at any point. The pressure coefficient Cp = 1 - |v/U|². The surface Cp distribution gives the lift by integration. The result: Cp(upper) < Cp(lower) — lower pressure on top (Bernoulli suction). The lift comes from the pressure difference.

**Limitations of potential flow.** Perfect fluid: no viscosity, no separation. Drag = 0 in potential flow (d'Alembert's paradox). Real wings stall at high α when the flow separates from the upper surface — separation is a viscous effect that conformal mapping cannot capture. For thin airfoils at small α (<10°) at high Reynolds number: potential flow is remarkably accurate for lift. The drag comes from a thin viscous boundary layer (Prandtl theory) that can be computed as a small correction.

---

## The Fix

Implement the Joukowski flow solution with streamline visualization.

```python
import numpy as np
import matplotlib.pyplot as plt

# Conformal mapping: Joukowski airfoil flow
# z-plane: circle + vortex + uniform flow
# ζ-plane: Joukowski airfoil

# Parameters
U = 1.0          # freestream velocity
alpha_deg = 5.0  # angle of attack in degrees
alpha = alpha_deg * np.pi / 180

# Circle parameters
epsilon = 0.1    # half-thickness control (moves center left)
delta = 0.05     # camber control (moves center up)
c = 1.0          # Joukowski parameter

# Circle radius: passes through z = c exactly
center = complex(-epsilon, delta)
R = abs(center - c)  # radius so that z=c lies on the circle

print(f"Circle center: {center}")
print(f"Circle radius: {R:.4f}")
print(f"Trailing edge at z = {c} → ζ = {c + c**2/c:.4f}")
print(f"Leading edge at z = {-R + center.real:.4f}")

# Circulation from Kutta condition: stagnation point at z = c
# dW/dz = 0 at z = c: U(1 - R^2/c^2) + Gamma/(2*pi*i*c) = 0
# Actually: Gamma = 4*pi*U*R*sin(alpha + arcsin(delta/R))
beta = np.arcsin(delta / R)  # correction for camber
Gamma = 4 * np.pi * U * R * np.sin(alpha + beta)
print(f"\nCirculation Γ = {Gamma:.4f} (Kutta condition)")
print(f"Lift per span L = ρUΓ = {1.0 * U * Gamma:.4f} ρ")
print(f"Lift coefficient CL = L/(½ρU²·2c) = {Gamma/(U*2*c):.4f}")
print(f"Theoretical CL = 2π sin(α) = {2*np.pi*np.sin(alpha):.4f}")

def W_circle(z):
    """Complex potential: uniform flow + doublet + vortex for flow past circle."""
    z_rel = z - center  # relative to circle center
    return U * (np.exp(-1j*alpha)*z + R**2 * np.exp(1j*alpha) / z_rel) + \
           (1j*Gamma/(2*np.pi)) * np.log(z_rel)

def joukowski(z, c=1.0):
    """Joukowski mapping: ζ = z + c^2/z"""
    return z + c**2 / z

def inv_joukowski(zeta, c=1.0, n_iter=20):
    """Inverse Joukowski map: find z given ζ (Newton's method)."""
    z = zeta.copy() if hasattr(zeta, 'copy') else np.array(zeta)
    for _ in range(n_iter):
        f = z + c**2 / z - zeta
        fp = 1 - c**2 / z**2
        z -= f / fp
    return z

# Generate streamlines in ζ-plane (physical airfoil plane)
# Method: trace ψ = constant lines in z-plane, map to ζ-plane

theta = np.linspace(0, 2*np.pi, 500)
circle_z = center + R * np.exp(1j*theta)
airfoil_zeta = joukowski(circle_z)

# Streamlines: equally spaced ψ values
n_stream = 20
psi_values = np.linspace(-3, 3, n_stream)

streamlines_zeta = []
for psi_target in psi_values:
    # Find points on streamline psi = psi_target in z-plane
    # Parameterize by x, find y such that Im[W(x+iy)] = psi_target
    x_line = np.linspace(-4, 4, 300)
    stream_z = []
    for xi in x_line:
        # Newton's method for Im[W(xi + i*yi)] = psi_target
        yi = 0.0
        for _ in range(20):
            z_try = complex(xi, yi)
            if abs(z_try - center) < R * 0.95:
                break  # inside circle: skip
            W_val = W_circle(z_try)
            residual = W_val.imag - psi_target
            # dW/dy = i * dW/dz (Cauchy-Riemann)
            dW = U*(-1j*alpha.real*0 + 1) - U*R**2*np.exp(1j*alpha)/(z_try-center)**2 + \
                 1j*Gamma/(2*np.pi*(z_try-center))
            if abs(dW.imag) < 1e-10:
                break
            yi -= residual / dW.imag
        else:
            z_found = complex(xi, yi)
            if abs(z_found - center) > R * 1.01:
                stream_z.append(z_found)
    
    if stream_z:
        stream_z = np.array(stream_z)
        stream_zeta = joukowski(stream_z)
        streamlines_zeta.append(stream_zeta)

print(f"\nGenerated {len(streamlines_zeta)} streamlines in airfoil plane.")
print("Plotting...")

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

# Left: circle (z-plane) with streamlines
ax1.set_title("z-plane: Circle")
theta_plot = np.linspace(0, 2*np.pi, 300)
circle = center + R*np.exp(1j*theta_plot)
ax1.plot(circle.real, circle.imag, 'k-', lw=2, label='Circle')
ax1.set_xlim(-3, 3); ax1.set_ylim(-2.5, 2.5)
ax1.set_aspect('equal'); ax1.grid(True, alpha=0.3)
ax1.axhline(0, color='k', lw=0.5)

# Right: airfoil (ζ-plane) with streamlines
ax2.set_title(f"ζ-plane: Joukowski Airfoil (α={alpha_deg}°)")
ax2.plot(airfoil_zeta.real, airfoil_zeta.imag, 'k-', lw=2, label='Airfoil')
for sl in streamlines_zeta:
    if len(sl) > 5:
        ax2.plot(sl.real, sl.imag, 'b-', alpha=0.4, lw=0.8)
ax2.set_xlim(-3, 5); ax2.set_ylim(-2.5, 2.5)
ax2.set_aspect('equal'); ax2.grid(True, alpha=0.3)
ax2.axhline(0, color='k', lw=0.5)

plt.tight_layout()
print("Figure saved.")
```

---

## The Wow Moment — Push It

Build an interactive angle-of-attack sweep: vary α from -10° to +20°. At each angle: (1) recompute Γ from the Kutta condition, (2) draw all streamlines, (3) compute the surface pressure Cp, (4) integrate to get CL. Plot CL vs. α — a perfect straight line up to ~15° (potential flow doesn't know about stall, but flag it). Show at α=0: symmetric airfoil, symmetric flow, zero lift. At α=5°: clear upper-surface acceleration (colored by speed), lower pressure above wing. At α=15°: the streamlines would separate in reality (add a label: "REAL FLOW STALLS HERE").

Then: change the airfoil shape parameters (ε for thickness, δ for camber). Show a cambered airfoil has non-zero lift at α=0. Show a thicker airfoil is more symmetric. Build a UI that lets you design your airfoil and immediately see the pressure distribution and lift.

---

## The Interactive Demo

- **Angle of attack α**: slider -15° to 25°
- **Thickness parameter ε**: slider 0.0–0.3 (controls airfoil thickness)
- **Camber parameter δ**: slider 0.0–0.2 (controls airfoil camber — zero-lift angle)
- **Freestream speed U**: slider 0.1–5.0 (for pressure visualization)
- **Show circle/airfoil**: toggle between z-plane and ζ-plane view
- **Streamline density**: slider (number of streamlines)
- **Pressure coefficient Cp**: color map on airfoil surface — blue=suction, red=pressure
- **Show Kutta condition**: highlight stagnation point; show how it moves to trailing edge when Γ is set correctly
- **CL vs. α plot**: live updating as α changes; theoretical line 2π sin(α) shown as dashed

---

## Production Notes

**Code structure**: `joukowski.py` — map, inverse map, W_circle, Kutta Γ computation. `streamlines.py` — psi-level tracing in z-plane, map to ζ. `pressure.py` — surface velocity, Cp distribution, lift integration. `interactive.py` — Matplotlib widget with sliders.

**Visual layout**: Dual-panel. Left: z-plane circle with uniform flow streamlines (straight at infinity, curving around the circle). Right: ζ-plane airfoil with the same streamlines mapped — they smoothly depart the trailing edge (Kutta condition satisfied). Color map: velocity magnitude (blue=slow, red=fast). Upper surface is fast (red) — that's the low-pressure region — that's lift.

**Key cinematic moments**: (1) The mapping animation: watch the circle continuously deform into the airfoil as the Joukowski parameter c changes. Streamlines deform simultaneously. (2) Kutta condition demonstration: first show flow without circulation (α=5°, Γ=0): stagnation point is NOT at the trailing edge — flow wraps around the sharp edge, velocity diverges. Then add the correct Γ: stagnation point snaps to the trailing edge, flow smoothly departs. The visual difference is dramatic. (3) Pressure suction visualization: fill the upper surface with blue (low pressure) and lower surface with red (high pressure). Draw arrows pointing up = lift force. (4) The CL vs. α plot: draw the theoretical line 2π sin(α) and show the computed points landing on it exactly — validation that the code is correct.

**Equations on screen**: ∇²φ=0, W(z)=φ+iψ, Joukowski map ζ=z+c²/z, Kutta-Joukowski L=ρUΓ, velocity v=dW/dz*.

---

## Tags
`conformal-mapping` `potential-flow` `complex-analysis` `Joukowski` `airfoil` `Kutta-condition` `lift` `canvas`

---

## Thumbnail

Dark background. Left: a blue circle with white streamlines curling around it (z-plane). A glowing arrow labeled "z → z + c²/z." Right: a white Joukowski airfoil with streamlines flowing past it — upper surface compressed (lines closer together, colored orange-red = fast flow), lower surface relaxed (lines wider apart, colored blue = slow flow). Bold white text: "LIFT = ρUΓ." Bottom: "Joukowski Transform — Exact Aerodynamics."
