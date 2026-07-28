---
title: "30 Strange Attractors in 30 Minutes (Attractor Gallery)"
id: M030
difficulty: 5/10
prereq: "M023"
concept: "Visualize and compare: Thomas, Dadras, Aizawa, Chen, Halvorsen, Rabinovich-Fabrikant attractors; each has a different topology; compare fractal dimensions, Lyapunov exponents; the parameter space of chaos."
tags: [strange-attractor, chaos, lyapunov-exponent, fractal-dimension, thomas-attractor, chen-attractor, three-js, nonlinear-dynamics]
category: medium
type: video-idea
---

# 30 Strange Attractors in 30 Minutes (Attractor Gallery)

**Alt title:** "The Museum of Chaos: Every Strange Attractor You Need to Know"
**Difficulty:** 5/10 | **Prereq:** M023 (Lorenz system basics)

---

## Opening Hook (0:00–1:00)

Open on a rotating 3D orbit: the Lorenz butterfly. Everyone's seen it. Then — cut — a completely different shape fills the screen. Then another. Then another. Ten attractors flash in quick succession, each more alien and beautiful than the last. Toroidal spirals, figure-eight knots, four-winged butterflies, crystalline lattices of orbits.

Voiceover: *"The Lorenz attractor is famous. But it's just one of an infinite family of strange attractors — each the fingerprint of a different chaotic dynamical system. Each one has its own topology, its own fractal dimension, its own personality. Today we build a gallery. We'll code each one from scratch, understand what makes its chaos unique, and find the parameters that control the boundary between order and chaos."*

Display a gallery grid: 30 attractor thumbnails, each labeled with its name. The video will systematically visit the most interesting ones.

---

## The Naive Attempt

**What we code first:** A generic Lorenz-style integrator with Euler's method, then copy-paste parameter changes for each new attractor.

```javascript
// Naive: Euler integration, no adaptive step, single attractor type
let x = 0.1, y = 0, z = 0;
const dt = 0.01;

function lorenzStep(x, y, z, sigma=10, rho=28, beta=8/3) {
  const dx = sigma * (y - x);
  const dy = x * (rho - z) - y;
  const dz = x * y - beta * z;
  return [x + dx*dt, y + dy*dt, z + dz*dt];
}

// Works for Lorenz. Now try the Thomas attractor:
function thomasStep(x, y, z, b=0.208186) {
  const dx = Math.sin(y) - b*x;
  const dy = Math.sin(z) - b*y;
  const dz = Math.sin(x) - b*z;
  return [x + dx*dt, y + dy*dt, z + dz*dt];
}

// The problem: dt=0.01 is too large for many attractors.
// Thomas with dt=0.01 is *slightly* unstable.
// Rabinovich-Fabrikant with dt=0.01 DIVERGES.
```

Testing reveals that a single fixed `dt = 0.01` works for Lorenz but is too large for some attractors (Thomas with b near its bifurcation point) and catastrophically large for others (Rabinovich-Fabrikant, which can have very stiff terms). The orbit for Rabinovich-Fabrikant shoots to infinity immediately.

The fix is an **adaptive step-size integrator** (RK4 with step doubling) that automatically adjusts dt to maintain a specified error tolerance.

---

## The Moment of Failure

Run the Rabinovich-Fabrikant attractor with the naive Euler method. The `x`, `y`, `z` values print to console: 0.1, 0.1, 0.1 → 0.11, 0.09, 0.12 → 0.15, 0.08, 0.14 → ... then suddenly 4.2, -3.7, 11.2 → 88.1, -62.3, 9900 → NaN, NaN, NaN.

In the 3D viewport, the orbit trace starts normally, then shoots a line off to the edge of the screen, then disappears (NaN stops all rendering). The Three.js scene goes blank.

Add a divergence check: if `x² + y² + z² > 1e6`, declare divergence. The Euler integrator diverges at ~step 800. Adding a step-size halving (dt = 0.005) delays divergence to ~step 3000 but still fails. The attractor requires RK4 with adaptive dt ≈ 0.0001 to remain stable.

The visual cue: show a "stability monitor" — a line chart plotting max |orbit radius| vs step number. Euler: stable for 1000 steps, then exponential explosion. RK4 adaptive: flat, stable indefinitely.

---

## Why It Broke — The Physics

The Rabinovich-Fabrikant equations:

```
dx/dt = y(z - 1 + x²) + γx
dy/dt = x(3z + 1 - x²) + γy
dz/dt = -2z(α + xy)
```

with α = 0.14, γ = 0.1. The nonlinear terms `y·z`, `x·z`, `x·y` create rapidly varying derivatives near certain orbit regions. The **local Lipschitz constant** (the rate at which nearby orbits diverge) is large near the attractor's folding points. Euler's method accumulates O(dt²) local error per step and O(dt) global error, with a stability condition dt < 2/L where L is the Lipschitz constant. Near highly nonlinear regions, L can be large, requiring dt ≪ 0.001.

The fix — **4th-order Runge-Kutta (RK4)** — has O(dt⁴) local error and O(dt⁴) global error, with a stability region that includes many stiff problems. Adaptive step-size control (using the difference between a full RK4 step and two half-steps to estimate error) automatically shrinks dt through stiff regions and grows it through smooth ones.

Key stability criterion for Euler on a linear system ẋ = λx: stable only when |1 + λ·dt| < 1, i.e., dt < 2/|Re(λ)|. For nonlinear systems, replace λ with the local eigenvalues of the Jacobian.

---

## The One Concept

**Strange Attractors, Lyapunov Exponents, and Fractal Dimension**

A **strange attractor** is the limit set of a dissipative dynamical system — the set of states that the system approaches asymptotically, but which has sensitive dependence on initial conditions (chaos). It's "strange" in two respects: its geometry is fractal (non-integer Hausdorff dimension), and its dynamics are chaotic (positive Lyapunov exponent).

The **Lyapunov exponent** λ measures the average rate of divergence of nearby orbits. For a 3D system, there are three Lyapunov exponents λ₁ ≥ λ₂ ≥ λ₃:
- Chaotic attractor: λ₁ > 0 (sensitive dependence), λ₂ = 0 (along the flow), λ₃ < 0 (contraction, so it's an attractor)
- Lorenz: λ₁ ≈ 0.906, λ₂ = 0, λ₃ ≈ -14.57. Sum < 0 (dissipative), λ₁ > 0 (chaotic)
- Thomas: λ₁ ≈ 0.035, λ₂ ≈ 0, λ₃ ≈ -0.27. Much smaller positive exponent → slower chaos

The **Kaplan-Yorke (Lyapunov) dimension** estimates fractal dimension from exponents: D_KY = j + (λ₁ + ... + λⱼ)/|λⱼ₊₁| where j is the largest index for which the sum of the first j exponents is non-negative. For Lorenz: D_KY ≈ 2 + 0.906/14.57 ≈ 2.062. The attractor is fractally between a surface (dim 2) and a volume (dim 3).

Comparing the gallery of attractors by these numbers reveals their personalities: the Thomas attractor (b=0.208186) has D_KY ≈ 2.08, the Halvorsen attractor ≈ 2.11, the Chen attractor ≈ 2.09, the Dadras attractor ≈ 2.08. They cluster near 2.06–2.15 — all thin, surface-like fractals. Higher-dimensional attractors exist in 4D systems.

**The parameter space of chaos** is itself fractal. For the Thomas attractor, parameter b controls the amount of dissipation: at b = 0 (no dissipation), the system is Hamiltonian and the attractor becomes a fractal torus. As b increases, the chaotic region shrinks and there are windows of periodic orbits. At b ≈ 0.329, the system becomes a limit cycle (period-1). This b-vs-λ₁ plot is the **bifurcation diagram** and is itself self-similar.

**Each attractor's personality:**
- **Lorenz**: Two-lobe butterfly. Strongly chaotic (λ₁ ≈ 0.9). The canonical example.
- **Thomas**: Cubic symmetry. Slow chaos. At b=0, orbits persist forever — it's the least dissipative common attractor.
- **Halvorsen**: Three-fold symmetry. Elegant spirals. Parameter a controls dissipation.
- **Dadras**: Five-scroll structure. Rich parameter space with sub-attractors.
- **Chen**: Double scroll, qualitatively Lorenz-like but topologically different (not topologically conjugate to Lorenz).
- **Aizawa**: Toroidal shape — the orbit winds around a torus in a chaotic yet structured way. Looks like a spinning top.
- **Rabinovich-Fabrikant**: Highly nonlinear, sharp folding. Requires careful numerics. Appears in plasma physics.
- **Sprott A–S**: Julien Sprott's catalog of minimal chaotic 3D flows, systematically found by computer search. Many have only 5–7 terms in the ODE.

---

## The Fix

```javascript
// Fix: RK4 with adaptive step size
class AdaptiveRK4 {
  constructor(f, state, tol = 1e-6) {
    this.f = f;           // derivative function: (x,y,z) → [dx,dy,dz]
    this.state = state;   // [x, y, z]
    this.dt = 0.01;       // initial step
    this.tol = tol;       // error tolerance
    this.minDt = 1e-6;
    this.maxDt = 0.05;
  }

  rk4Step(state, dt) {
    const k1 = this.f(...state);
    const k2 = this.f(...state.map((v, i) => v + 0.5*dt*k1[i]));
    const k3 = this.f(...state.map((v, i) => v + 0.5*dt*k2[i]));
    const k4 = this.f(...state.map((v, i) => v + dt*k3[i]));
    return state.map((v, i) => v + (dt/6)*(k1[i] + 2*k2[i] + 2*k3[i] + k4[i]));
  }

  adaptiveStep() {
    const full = this.rk4Step(this.state, this.dt);
    const half1 = this.rk4Step(this.state, this.dt/2);
    const half2 = this.rk4Step(half1, this.dt/2);

    // Error estimate: difference between full step and two half-steps
    const err = Math.sqrt(half2.reduce((sum, v, i) => sum + (v - full[i])**2, 0));

    if (err > this.tol && this.dt > this.minDt) {
      this.dt = Math.max(this.dt * 0.5, this.minDt);
      return this.adaptiveStep(); // retry with smaller step
    }

    this.state = half2; // two-half is more accurate
    if (err < this.tol / 10) this.dt = Math.min(this.dt * 1.5, this.maxDt);
    return this.state;
  }
}

// Attractor library — each returns [dx, dy, dz]
const attractors = {
  lorenz: (x, y, z, s=10, r=28, b=8/3) =>
    [s*(y-x), x*(r-z)-y, x*y-b*z],

  thomas: (x, y, z, b=0.208186) =>
    [Math.sin(y)-b*x, Math.sin(z)-b*y, Math.sin(x)-b*z],

  halvorsen: (x, y, z, a=1.4) =>
    [-a*x - 4*y - 4*z - y*y, -a*y - 4*z - 4*x - z*z, -a*z - 4*x - 4*y - x*x],

  dadras: (x, y, z, a=3, b=2.7, c=1.7, d=2, e=9) =>
    [y - a*x + b*y*z, c*y - x*z + z, d*x*y - e*z],

  chen: (x, y, z, a=5, b=-10, c=-0.38) =>
    [a*x - y*z, b*y + x*z, c*z + x*y/3],

  aizawa: (x, y, z, a=0.95, b=0.7, c=0.6, d=3.5, e=0.25, f=0.1) =>
    [(z-b)*x - d*y, d*x + (z-b)*y, c + a*z - z*z*z/3 - (x*x+y*y)*(1+e*z) + f*z*x*x*x],

  rabfab: (x, y, z, alpha=0.14, gamma=0.1) =>
    [y*(z-1+x*x)+gamma*x, x*(3*z+1-x*x)+gamma*y, -2*z*(alpha+x*y)],

  sprott_b: (x, y, z) =>
    [y*z, x - y, 1 - x*y],
};
```

Usage:

```javascript
const integrator = new AdaptiveRK4(
  (x,y,z) => attractors.rabfab(x,y,z),
  [0.1, -0.1, 0.1]
);

// Warmup 10,000 steps
for (let i = 0; i < 10000; i++) integrator.adaptiveStep();

// Render 1,000,000 orbit points
const points = new Float32Array(1_000_000 * 3);
for (let i = 0; i < 1_000_000; i++) {
  const [x,y,z] = integrator.adaptiveStep();
  points[i*3] = x; points[i*3+1] = y; points[i*3+2] = z;
}
```

---

## The Wow Moment — Push It

**The gallery wall:** Render all 30 attractors simultaneously in a 5×6 grid of WebGL canvases, each running its own RK4 integrator in a Web Worker. The orbits accumulate in real time — thin lines thicken as more points are added. Click any cell to expand it to full screen with parameter controls.

**Parameter space scan:** For the Thomas attractor, smoothly animate b from 0.10 to 0.40. Show the attractor morphing from a chaotic three-dimensional tangle (b small) through various bifurcations to a simple limit cycle (b large). Simultaneously plot λ₁ vs b — the classic bifurcation diagram. Watch λ₁ drop to zero at bifurcation points and dip below zero at stable cycles.

**Attractor transition animation:** Morph between two attractors by linearly interpolating their parameters. Lorenz (σ=10, ρ=28, β=8/3) → (σ=10, ρ=1, β=8/3): watch the two-lobe butterfly collapse to a stable fixed point as ρ drops below the Hopf bifurcation threshold ρ = 24.74.

**Lyapunov spectrum visualizer:** Real-time computation of all three Lyapunov exponents using the QR factorization method (evolve a set of orthogonal perturbation vectors alongside the orbit, renormalize periodically). Display as a running bar chart: red bar for λ₁ > 0, gray for λ₂ ≈ 0, blue for λ₃ < 0. Shows which attractors are more chaotic.

---

## The Interactive Demo

- **Attractor selector**: dropdown of 30 named attractors; switching instantly starts a new simulation with default parameters
- **Parameter sliders**: up to 6 per attractor; each labeled with its physical meaning (e.g., "b = dissipation" for Thomas); ranges set to include interesting bifurcations
- **Integration method selector** (Euler / RK4 / Adaptive RK4): let viewer see the Euler failure for stiff attractors and appreciate why RK4 matters
- **Orbit length** (1,000 to 10,000,000 points): control how many orbit points are rendered; longer = denser attractor fill
- **Color mode** (Speed / Time / Distance from origin / Lyapunov estimate): four coloring schemes; speed-coloring highlights where the orbit moves fast vs slow
- **Camera controls**: click-drag to orbit, scroll to zoom, double-click to auto-fit the current attractor in view
- **Lyapunov exponent display**: live estimate of λ₁ using finite-difference method; updates every 10,000 steps
- **Kaplan-Yorke dimension display**: computed from estimated Lyapunov spectrum
- **Projection selector** (XY / XZ / YZ / 3D): render 2D projections for comparison or full 3D orbit
- **Trail mode**: toggle between persistent dots (density) and a fixed-length trail (shows local trajectory direction)
- **Initial conditions**: XYZ sliders for starting point; clicking "random" picks a new IC and demonstrates sensitive dependence by showing two orbits (original IC in blue, perturbed by 1e-10 in red) diverging over time
- **Record button**: capture the current animation as a 10-second WebM video (uses MediaRecorder API)
- **Split-screen compare**: select two attractors and render them side-by-side; compare their Lyapunov spectra and fractal dimensions numerically

---

## Production Notes

**Code structure:**
- `index.html`: main gallery grid (5×6 canvas elements) + expandable detail panel
- `attractors.js`: all 30 attractor derivative functions, default parameters, parameter metadata (labels, ranges, descriptions)
- `integrator.js`: Euler, RK4, AdaptiveRK4 classes; Lyapunov exponent computation via QR method
- `webgl-points.js`: WebGL2 point-cloud renderer; shader uses velocity magnitude for color; handles 1M+ points efficiently via typed array streaming
- `worker.js`: Web Worker that runs integration + accumulates points; posts batches to main thread via transferable ArrayBuffers
- `gallery.js`: orchestrates the 5×6 grid, manages per-cell workers, handles click-to-expand
- `lyapunov.js`: QR-based Lyapunov spectrum computation; runs in a separate worker

**Key cinematic moments:**
1. *The gallery reveal* (0:00–1:00): 30 pre-rendered attractor thumbnails fill the screen. Each is uniquely beautiful. Dramatic music.
2. *The Euler failure* (3:00): switch to Rabinovich-Fabrikant with Euler. Show the orbit shoot to infinity. Console spews NaN. Laugh. "This one is spicy."
3. *RK4 fix* (4:30): same attractor, adaptive RK4. Perfect orbit immediately. "Better."
4. *Parameter sweep live* (8:00): Thomas attractor, slowly drag b slider from 0.1 to 0.4. Watch chaos to order transition with live λ₁ dropping below zero.
5. *Two-orbit divergence demo* (11:00): start two orbits at positions differing by 10⁻¹⁰. For 50 steps they're identical. Then they diverge. By step 200, they're on completely different parts of the attractor. "This is sensitive dependence on initial conditions. This is chaos."
6. *The gallery wall finale* (14:00): all 30 attractors running simultaneously, color-coded by chaos level (red = high λ₁, blue = low). Slow zoom back to show the full gallery wall. "Every one of these is a universe of chaos hiding in three equations."

**Rendering note:** Use WebGL instanced point rendering with `gl.POINTS` primitive. A 1-million-point orbit renders at 60fps on any modern GPU. For the 5×6 gallery, each cell runs 100,000 points at 60fps — 3 million total points at 60fps is achievable on mid-range hardware.

---

## Tags
`strange-attractor` `chaos` `lyapunov-exponent` `fractal-dimension` `thomas-attractor` `chen-attractor` `three-js` `nonlinear-dynamics`

---

## Thumbnail

A 3×3 grid of nine glowing attractor orbits on a black background, each in a different color (orange, cyan, magenta, green, gold, red, purple, white, teal). Each is distinctly shaped: butterfly, torus, figure-eight, crystalline, flower. The center cell is empty — replaced with large bold text: "30 STRANGE ATTRACTORS." Subtitle in smaller text: "coded from scratch." The overall impression is of a museum catalog page for impossible alien art.
