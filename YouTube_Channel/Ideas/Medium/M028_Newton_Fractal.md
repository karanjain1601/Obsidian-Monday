---
title: "Why Newton's Root-Finding Has Fractal Basins"
id: M028
difficulty: 5.5/10
prereq: "None"
concept: "Newton's method applied to z³-1=0: three roots, three basins of attraction; the boundaries between basins are fractal — any boundary point is adjacent to all three basins (Wada property); beautiful colored fractal images."
tags: [newton-fractal, newton-method, basin-of-attraction, complex-dynamics, fractal, root-finding, WebGL, wada-property]
category: medium
type: video-idea
---

# Why Newton's Root-Finding Has Fractal Basins

**Alt title:** "Newton's Method Breaks Down at the Boundary — Here's Why It's Beautiful"
**Difficulty:** 5.5/10 | **Prereq:** None (complex numbers and derivatives help)

---

## Opening Hook (0:00–1:00)

Show a Newton's method animation over the real line: a function f(x) = x² - 1 with two roots at ±1. Drop several initial guesses — they all converge rapidly. Text overlay: "Newton's method: the most powerful root-finding algorithm in existence. Guaranteed to converge... right?"

Then switch to f(z) = z³ - 1 in the complex plane. Color the plane: green for the three cube roots of unity, blue/red/yellow for which root each starting point converges to. The image that appears is a swirling, intricate fractal — the Newton fractal. Zoom into a boundary between two colors: it does not simplify into a clean line. It just gets more complex. Zoom more: all three colors appear simultaneously in every neighborhood of the boundary.

Voiceover: *"You put in a number. Newton's method runs. It should converge to one of three roots. But for starting points near certain curves, it becomes genuinely impossible to predict which root you'll hit. There's a mathematical reason why. And when you code it and color the result — you get one of the most beautiful images in all of mathematics."*

---

## The Naive Attempt

**What we code first:** Naively apply Newton's method to f(z) = z³ - 1 over a grid of complex starting points and color by which root they reach.

```javascript
// Naive Newton fractal — pure JS, double precision
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

// The three cube roots of unity
const roots = [
  {re: 1, im: 0},
  {re: -0.5, im:  Math.sqrt(3)/2},
  {re: -0.5, im: -Math.sqrt(3)/2}
];
const colors = ['#FF4444', '#44FF44', '#4444FF'];

function complexMul(a, b) {
  return { re: a.re*b.re - a.im*b.im, im: a.re*b.im + a.im*b.re };
}
function complexDiv(a, b) {
  const d = b.re*b.re + b.im*b.im;
  return { re: (a.re*b.re + a.im*b.im)/d, im: (a.im*b.re - a.re*b.im)/d };
}

function newtonStep(z) {
  // f(z) = z³ - 1, f'(z) = 3z²
  // z_new = z - f(z)/f'(z) = z - (z³-1)/(3z²) = (2z³+1)/(3z²)
  const z2 = complexMul(z, z);        // z²
  const z3 = complexMul(z2, z);       // z³
  const num = { re: 2*z3.re + 1, im: 2*z3.im }; // 2z³+1
  const den = { re: 3*z2.re, im: 3*z2.im };      // 3z²
  return complexDiv(num, den);
}

function whichRoot(z, maxIter = 50) {
  for (let i = 0; i < maxIter; i++) {
    z = newtonStep(z);
    for (let r = 0; r < 3; r++) {
      const dr = z.re - roots[r].re;
      const di = z.im - roots[r].im;
      if (dr*dr + di*di < 1e-8) return { root: r, iter: i };
    }
  }
  return { root: -1, iter: maxIter }; // didn't converge
}

function render(zoom = 1.5) {
  const img = ctx.createImageData(W, H);
  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      const z = {
        re: (px - W/2) / (W/(2*zoom)),
        im: (py - H/2) / (H/(2*zoom))
      };
      const { root, iter } = whichRoot(z);
      const idx = (py * W + px) * 4;
      if (root === -1) {
        img.data[idx] = img.data[idx+1] = img.data[idx+2] = 0;
      } else {
        const brightness = 1 - iter/50; // darker = more iterations
        const hex = colors[root];
        img.data[idx]   = parseInt(hex.slice(1,3),16) * brightness;
        img.data[idx+1] = parseInt(hex.slice(3,5),16) * brightness;
        img.data[idx+2] = parseInt(hex.slice(5,7),16) * brightness;
      }
      img.data[idx+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

render();
```

This actually produces a beautiful image immediately. So where's the "failure"? It appears when you try to *predict* or *explain* what happens on the boundaries. Run the demo: zoom into a boundary point. The convergence map looks chaotic — touching points barely any distance apart converge to completely different roots. The "failure" here is not a broken image but a broken intuition: we assumed Newton's method was predictable and stable. It isn't, near the boundaries.

---

## The Moment of Failure

The failure of intuition is demonstrated with a **diagnostic tool**: click any point in the fractal, and show an arrow animation of its Newton orbit — the sequence of iterates z₀, z₁, z₂, z₃, ... plotted as dots with connecting arrows on the complex plane. For points well inside a basin (say, starting near z = 0.9 + 0i), the orbit makes 3–4 clean jumps and lands near root 1.

Now click a point on the boundary between two basins, such as z ≈ 0.0 + 0.1i. The orbit becomes erratic — it bounces between all three roots, visiting their neighborhoods in apparently random order, before finally settling on one. Click a pixel 1 unit away (in canvas pixels) — the orbit is completely different and may settle on a different root.

The visual "failure" moment: draw a 3×3 grid of tiny squares centered on a boundary point. Color each square by which root it converges to. Show the grid at 1× zoom (small squares), then 10× zoom (larger squares over same region). The pattern does not simplify — it stays equally chaotic at all scales. There is no "last" scale at which the boundary becomes a clean line.

Display a count: "Points that didn't converge in 200 iterations: N%" — on the boundary, this number is non-zero even with 1000 iterations. There exist starting points that are genuinely indeterminate.

---

## Why It Broke — The Physics

Newton's method in the real line is well-behaved for f(x) = x³ - 1 because the three real and complex roots separate the number line into clean intervals. But in the complex plane, the three cube roots of unity lie at angles 0°, 120°, and 240° from the origin, and the boundaries of their attraction basins pass through the origin — a **repelling fixed point** of the Newton map.

The Newton iteration for f(z) = z³ - 1 is the rational map:

```
N(z) = z - f(z)/f'(z) = z - (z³-1)/(3z²) = (2z³ + 1) / (3z²)
```

This is a degree-3 rational map on the Riemann sphere. By Fatou-Julia theory, the complex plane splits into:
- **Fatou set**: open regions where nearby orbits behave similarly (the three basins of attraction)
- **Julia set**: the boundary — a closed set where orbits are chaotic and sensitive to initial conditions

The **Wada property** (proved by Yoccoz) states: for Newton's method on a polynomial with 3 or more roots, the boundary of each basin of attraction is the same set — the Julia set. Any open neighborhood of any boundary point intersects all three basins simultaneously. This means the boundary is not a curve — it's a set of Hausdorff dimension 2 (it fills area), and no algorithm can stably decide which side of the boundary any given point is on.

Key equation — the Julia set of N(z) is the boundary of all three basins:

```
∂B₁ = ∂B₂ = ∂B₃ = J(N)   (the Wada property)
```

This is why Newton's method "breaks": near the Julia set, infinitesimally small perturbations to the initial guess lead to different roots. The algorithm is theoretically correct but practically unpredictable for those initial conditions.

---

## The One Concept

**Newton Fractals and Basin Boundaries**

Newton's method is built on a beautiful idea: to find a root of f(z) = 0, start at z₀, fit a linear approximation (tangent line), and follow it to where it crosses zero. That crossing becomes z₁. Repeat. For well-behaved functions in the reals, this converges super-quadratically — each iteration roughly doubles the number of correct decimal digits. It's the engine behind most numerical computation in science and engineering.

The extension to the complex plane is immediate and mathematically natural. f(z) = z³ - 1 = 0 has three roots: z = 1, z = e^(2πi/3), and z = e^(4πi/3). The Newton map N(z) = (2z³+1)/(3z²) is a rational function on ℂ. For almost every starting point z₀, the orbit z₀, N(z₀), N(N(z₀)), ... converges to one of these three roots. The question is: which root?

The answer partitions the complex plane into three **basins of attraction**: B₁, B₂, B₃. If you start in B₁, you converge to root 1. This is guaranteed by the contraction mapping theorem applied locally near each root. Far from the roots, however, the map is not locally contracting — it's expanding near the Julia set.

The Julia set J(N) is the frontier between these basins. By a theorem of Yoccoz (building on work of Böttcher and Fatou), when there are three or more roots, this frontier has the **Wada property**: every point in J(N) is simultaneously a boundary point of all three basins. This seems paradoxical — how can three regions share the same boundary curve? It's possible because the boundary is not a curve. It's a fractal set of Hausdorff dimension 2 that "fills" the space between the basins like an infinitely fine filigree.

Visualizing this: color B₁ red, B₂ green, B₃ blue. The resulting image has three solid-colored "petals" meeting at a central point (the origin), with fractal tendrils and miniature replicas of the whole pattern embedded along every boundary. The iteration count modulates the brightness: points that converge in 2 iterations are bright; points that take 50 iterations are near-black. The dark halos around boundaries correspond to orbits that spend many iterations "deciding" which basin to settle in.

**Generalizing beyond z³ - 1:** Change the polynomial to z⁴ - 1 (four roots, four basins, more complex boundary), z⁵ - z - 1 (irrational positions), or even transcendental functions like sin(z). Each produces a distinct and beautiful fractal. The general principle: n roots → n basins → shared fractal boundary. The parameter c can also be introduced: consider N(z) = z - z³/(3z²) + c·z for a "relaxed" Newton iteration, and the c-parameter space itself has Mandelbrot-like structure. Add a "relaxation parameter" a to the Newton update: z_new = z - a·f(z)/f'(z). For a=1, classic Newton. For a≠1, the basins reshape dramatically and new cycles appear.

**Real-world significance:** Newton's method is used in GPS receivers to solve satellite equations, in power flow analysis in electrical grids (finding voltage solutions), and in every compiler that evaluates transcendental functions. The fractal basins mean that near the boundaries of convergence — which correspond to near-singular conditions in the original problem — the algorithm is numerically unstable. Engineers who use Newton's method for, say, aircraft trajectory optimization must ensure their initial guesses are well inside a basin, not near the fractal boundary.

---

## The Fix

The conceptual fix is not to "fix" Newton's method (it works as designed) but to **visualize the complexity honestly** and add tools to understand it. The key enhancement is a **smooth coloring formula** analogous to the Mandelbrot smooth escape time, plus the ability to explore arbitrary polynomials.

```javascript
// Fix 1: smooth iteration count using potential function
function newtonSmoothColor(z0, maxIter = 200) {
  let z = { ...z0 };
  for (let i = 0; i < maxIter; i++) {
    z = newtonStep(z);
    for (let r = 0; r < 3; r++) {
      const dr = z.re - roots[r].re;
      const di = z.im - roots[r].im;
      const dist2 = dr*dr + di*di;
      if (dist2 < 1e-10) {
        // Smooth: blend iteration count with distance to root
        const smooth = i - Math.log2(Math.log(dist2) / Math.log(1e-10));
        return { root: r, smooth: smooth / maxIter };
      }
    }
  }
  return { root: -1, smooth: 1.0 };
}

// Fix 2: generalized Newton for arbitrary polynomial coefficients
// Represent polynomial as coefficient array [a0, a1, a2, ...]
function polyEval(coeffs, z) {
  // Horner's method in complex arithmetic
  let val = { re: coeffs[coeffs.length-1], im: 0 };
  for (let i = coeffs.length-2; i >= 0; i--) {
    val = complexAdd(complexMul(val, z), { re: coeffs[i], im: 0 });
  }
  return val;
}

function polyDeriv(coeffs) {
  // d/dz: multiply each coefficient by its power, drop constant
  return coeffs.slice(1).map((c, i) => c * (i+1));
}

function generalNewtonStep(z, coeffs, derivCoeffs, relaxation = 1.0) {
  const fz = polyEval(coeffs, z);
  const dfz = polyEval(derivCoeffs, z);
  const step = complexDiv(fz, dfz); // f(z)/f'(z)
  return {
    re: z.re - relaxation * step.re,
    im: z.im - relaxation * step.im
  };
}
```

```javascript
// Fix 3: WebGL shader for real-time rendering
// (Pass coefficients as uniforms, compute Newton step in GLSL)
const fragShader = `
precision highp float;
uniform vec2 u_root0, u_root1, u_root2;
uniform float u_relaxation;
uniform vec2 u_center;
uniform float u_zoom;
varying vec2 v_uv;

vec2 cmul(vec2 a, vec2 b) { return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x); }
vec2 cdiv(vec2 a, vec2 b) { float d=dot(b,b); return vec2(dot(a,b),a.y*b.x-a.x*b.y)/d; }

vec2 newtonStep(vec2 z) {
  // z³-1: N(z) = (2z³+1)/(3z²)
  vec2 z2 = cmul(z,z);
  vec2 z3 = cmul(z2,z);
  return cdiv(vec2(2.0*z3.x+1.0, 2.0*z3.y), 3.0*z2);
  // With relaxation: z - relax*(z - N(z))
}

void main() {
  vec2 z = u_center + (v_uv - 0.5) * u_zoom;
  int whichRoot = -1;
  float smooth = 0.0;
  for (int i = 0; i < 200; i++) {
    z = newtonStep(z);
    vec2 d0 = z - u_root0, d1 = z - u_root1, d2 = z - u_root2;
    if (dot(d0,d0) < 1e-10) { whichRoot = 0; smooth = float(i)/200.0; break; }
    if (dot(d1,d1) < 1e-10) { whichRoot = 1; smooth = float(i)/200.0; break; }
    if (dot(d2,d2) < 1e-10) { whichRoot = 2; smooth = float(i)/200.0; break; }
  }
  vec3 col = whichRoot==0 ? mix(vec3(1,0.1,0.1), vec3(1,0.5,0.5), smooth)
           : whichRoot==1 ? mix(vec3(0.1,1,0.1), vec3(0.5,1,0.5), smooth)
           : whichRoot==2 ? mix(vec3(0.1,0.1,1), vec3(0.5,0.5,1), smooth)
           : vec3(0);
  gl_FragColor = vec4(col, 1.0);
}`;
```

Why this works: smooth coloring eliminates harsh bands at basin boundaries by interpolating the iteration count with the convergence distance, producing a continuous color field that reveals the fine structure of the fractal without discrete bands.

---

## The Wow Moment — Push It

**Polynomial slider:** Add real-time sliders for a degree-4 polynomial z⁴ - 1 and a degree-5 polynomial z⁵ - z - 1. The transition from 3 basins to 4 basins to 5 basins each create qualitatively different fractals. Show all three side by side with labels.

**Relaxation parameter animation:** Slowly animate the Newton relaxation parameter `a` from 0.5 to 2.0. Watch the fractal morph: at a=1 it's the classic Newton fractal; at a=2, entirely new "Nova fractal" patterns emerge (the Nova/Möbius fractal family). These are some of the most alien-looking mathematical images ever produced.

**3D height map:** Use the iteration count as a height field, render with Three.js as a 3D surface. The Julia set boundary rises as a dramatic mountain range; the deep basins are flat plateaus. Rotate and light the 3D surface — it looks like an alien landscape.

**Wada property proof by picture:** Split the screen into four. At each level of zoom (1×, 10×, 100×, 1000×), show a tiny region near a boundary point. At every scale, all three colors are present within every pixel-sized neighborhood. Animate the four panels updating simultaneously — a visceral demonstration that the boundary has no "last" scale.

---

## The Interactive Demo

- **Polynomial selector** (z³-1 / z⁴-1 / z⁵-1 / z⁶-1 / custom): changes number of basins; roots automatically computed and rendered in different colors
- **Custom polynomial input**: text field for entering coefficients as JSON array (e.g., `[-1, 0, 0, 1]` for z³-1); roots found numerically via companion matrix eigenvalues
- **Relaxation parameter a** (0.1 to 2.5 slider): real-time morphs the fractal from compressed (a<1) to classic Newton (a=1) to Nova-type patterns (a>1)
- **Max iterations** (10 to 500): demonstrates how more iterations resolve finer detail near boundaries
- **Zoom and pan**: scroll to zoom, drag to pan; deep zoom limited by float64 precision (no perturbation method here)
- **Smooth coloring toggle**: on/off comparison of banded vs. smooth iteration-count coloring
- **Orbit tracer**: click any point, watch its Newton orbit plotted as arrows on the fractal; shows erratic behavior near the Julia set vs. rapid convergence in basin interiors
- **Julia set mode**: for the Newton map N(z), display the Julia set as a separate overlay (points that never converge, colored black)
- **Color theme selector** (Classic RGB / Pastel / Neon / Monochrome / Spectral): 5 built-in themes, each maps the three roots to different color triples
- **Root position drag**: drag each root to a different position in the complex plane; fractal updates live showing how basin geometry depends on root placement
- **Animation mode**: rotate all roots by 1°/frame around origin; watch fractal spin and morph in real time

---

## Production Notes

**Code structure:**
- `index.html`: single canvas (800×800) + control panel (collapsible right sidebar)
- `newton.js`: complex arithmetic, polynomial evaluation, Newton step, root-finding (companion matrix method for arbitrary polynomials)
- `webgl-renderer.js`: WebGL2 setup, shader compile, uniform updates on parameter change
- `controls.js`: all UI bindings, root drag interaction, orbit tracing canvas overlay
- `shaders/newton.frag`: main GLSL fragment shader with smooth coloring
- `shaders/orbit.vert` / `orbit.frag`: simple line shader for orbit visualization overlay

**Key cinematic moments:**
1. *Newton on the real line first* (0:00–1:30): animate a simple 1D Newton demo, showing rapid convergence. Set expectations of "this always works."
2. *First render* (2:00): the complex plane appears, colored. "Oh." Pause. Let the image speak.
3. *Zooming into the boundary* (3:30): slow, continuous zoom into the three-way boundary point. Music builds. As the zoom reveals fractal structure at every scale, voiceover explains the Wada property.
4. *Orbit tracer demo* (5:00): click a boundary point. Watch the orbit careen between roots — literally show the indecision. Compare immediately with a clean interior orbit.
5. *Relaxation animation* (10:00): slowly sweep a from 1.0 to 2.0. The fractal morphs into the Nova pattern. "This is what happens when you make Newton's method a little too eager."
6. *Root drag live demo* (12:00): drag one root toward another. Watch the two basins merge. When the roots coincide, their shared basin disappears.

**Animation tips:** Pre-render the relaxation sweep as a 30-second video clip (WebGL renders at 60fps in browser). For the orbit tracer, use a canvas overlay with global alpha to leave fading trails.

---

## Tags
`newton-fractal` `newton-method` `basin-of-attraction` `complex-dynamics` `fractal` `root-finding` `WebGL` `wada-property`

---

## Thumbnail

Three brilliantly colored petals (red, green, blue) meet at a central point in a swirling Newton fractal. Zoomed into the boundary junction, all three colors interweave in fractal detail. Large white text in the upper third: "NEWTON'S METHOD HAS A DARK SIDE." Smaller text below: "fractal basins of attraction." In the lower-right corner, a small inset shows a traditional root-finding plot on a 1D number line — simple, clean — with a red X through it. Contrast between the orderly 1D world and the fractal chaos of the complex plane.
