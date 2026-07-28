---
title: "The Road to Chaos in One Equation (Logistic Map Bifurcations)"
id: M025
difficulty: 5
prereq: "None"
concept: "Logistic map x_{n+1} = rx_n(1-x_n); stable fixed point → period-2 orbit → period-4 → chaos as r increases; Feigenbaum constant δ≈4.669 (universal across one-dimensional maps); self-similar bifurcation diagram."
tags: [logistic-map, chaos, bifurcation, feigenbaum, period-doubling, universality, fractal, nonlinear-dynamics]
category: medium
type: video-idea
---

# The Road to Chaos in One Equation (Logistic Map Bifurcations)

**Alt title:** "One Equation. The Road from Order to Chaos."
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

A single line on screen: `x = r * x * (1 - x)`

Narrator: *"This is the logistic map. A single equation. It was written in 1838 by Pierre Verhulst to model population growth. For a century, it was considered boring. Then Robert May, an ecologist at Princeton, rediscovered it in 1976 and published a paper in Nature with one of the greatest opening lines in scientific publishing: 'The Aim of This Paper Is to Draw Attention to the Existence of a Completely Deterministic Non-Linear Difference Equation Which Can Exhibit a Surprising Array of Dynamical Behavior.'"*

On screen: animate the iteration. $r = 2.5$: the sequence $x_0 = 0.5 \to 0.625 \to 0.586 \to 0.607 \to 0.596 \to \ldots$ converges to a fixed point. Show this as a cobweb diagram — the parabola $f(x) = rx(1-x)$ and the line $y=x$, with the iterates bouncing up and down between them to a single point.

Then slowly drag $r$ upward to 3.2: the cobweb now bounces between two points — period-2. Then to 3.5: period-4. Then to 3.57: chaos — the cobweb trace covers the entire parabola chaotically, never repeating.

Narrator: *"We went from a biology textbook equation to chaos with just one number. And the structure of this transition hides one of the deepest theorems in mathematics."*

---

## The Naive Attempt

The student's first implementation: iterate the logistic map and draw the cobweb diagram.

```javascript
function logisticMap(x, r) {
  return r * x * (1 - x);
}

function iterateMap(x0, r, steps) {
  const xs = [x0];
  let x = x0;
  for (let i = 0; i < steps; i++) {
    x = logisticMap(x, r);
    xs.push(x);
  }
  return xs;
}

function drawCobweb(ctx, r, x0, steps, xMin, xMax) {
  const toCanvas = (x, y) => ({
    px: ((x - xMin) / (xMax - xMin)) * canvas.width,
    py: ((1 - (y - xMin) / (xMax - xMin))) * canvas.height
  });

  // Draw the parabola
  ctx.beginPath();
  for (let x = xMin; x <= xMax; x += 0.001) {
    const y = logisticMap(x, r);
    const p = toCanvas(x, y);
    if (x === xMin) ctx.moveTo(p.px, p.py);
    else ctx.lineTo(p.px, p.py);
  }
  ctx.strokeStyle = 'blue'; ctx.stroke();

  // Draw y = x line
  ctx.beginPath();
  ctx.moveTo(toCanvas(xMin, xMin).px, toCanvas(xMin, xMin).py);
  ctx.lineTo(toCanvas(xMax, xMax).px, toCanvas(xMax, xMax).py);
  ctx.strokeStyle = 'gray'; ctx.stroke();

  // Draw cobweb path
  let x = x0;
  ctx.beginPath();
  ctx.moveTo(toCanvas(x, 0).px, toCanvas(x, 0).py);
  for (let i = 0; i < steps; i++) {
    const nextX = logisticMap(x, r);
    // Vertical line: (x, x) → (x, nextX)
    ctx.lineTo(toCanvas(x, nextX).px, toCanvas(x, nextX).py);
    // Horizontal line: (x, nextX) → (nextX, nextX)
    ctx.lineTo(toCanvas(nextX, nextX).px, toCanvas(nextX, nextX).py);
    x = nextX;
  }
  ctx.strokeStyle = 'red'; ctx.stroke();
}
```

This works perfectly. The student then wants to generate the classic bifurcation diagram: for each $r$ in [2.5, 4.0], run 1,000 iterations to discard transients, then record the next 200 iterates as dots at that $r$-value on the canvas.

```javascript
function drawBifurcationDiagram(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const rMin = 2.5, rMax = 4.0;
  const W = canvas.width, H = canvas.height;

  for (let px = 0; px < W; px++) {
    const r = rMin + (px / W) * (rMax - rMin);
    let x = 0.5;
    // Transient
    for (let i = 0; i < 1000; i++) x = logisticMap(x, r);
    // Record
    for (let i = 0; i < 200; i++) {
      x = logisticMap(x, r);
      const py = Math.floor((1 - x) * H);
      ctx.fillRect(px, py, 1, 1); // single pixel
    }
  }
}
```

This is correct! For a 600-pixel-wide canvas: 600 r-values × 1,200 iterations = 720,000 logistic map evaluations. Each is one multiply, one subtract, one multiply. At 600MHz effective JavaScript throughput: ~1.2 ms. The bifurcation diagram renders in under 2ms — no performance problem.

But there is a visual problem: `ctx.fillRect(px, py, 1, 1)` in a loop is called 600 × 200 = 120,000 times per render. Each call involves the canvas API overhead. The solution is to use `ImageData` directly — fill a `Uint8ClampedArray` and call `putImageData` once. That's a 20× speedup in canvas API calls.

More importantly, the diagram looks beautiful — but the student can't **measure** the Feigenbaum constant from it. They can see the first few bifurcations visually, but can't compute the bifurcation values $r_n$ automatically. They need to detect the bifurcation points programmatically.

---

## The Moment of Failure

**Visual bifurcation detection:** the student tries to find bifurcation points by scanning columns where the number of distinct orbit points doubles. Their detection code:

```javascript
function countOrbitPeriod(r, accuracy = 1e-4, maxIter = 10000) {
  let x = 0.5;
  for (let i = 0; i < 1000; i++) x = logisticMap(x, r); // transient
  const x0 = x;
  for (let period = 1; period <= 512; period++) {
    x = logisticMap(x, r);
    if (Math.abs(x - x0) < accuracy) return period;
  }
  return -1; // chaos (no period found within 512)
}
```

This fails near bifurcation points because the convergence to a periodic orbit is very slow (critical slowing down) — the first 1,000 transient iterations are insufficient, and the tolerance `1e-4` is too coarse to distinguish period-64 from period-128 orbit points that are $10^{-5}$ apart. The function incorrectly reports "chaos" for period-32 and period-64 orbits because it can't detect them within the maximum 512 iterations.

As a result, the measured bifurcation sequence $r_1, r_2, r_3$ has large errors, and the computed Feigenbaum ratio $(r_2-r_1)/(r_3-r_2)$ comes out as 3.1 instead of 4.669. The student concludes the constant isn't universal — because their period detection is broken.

---

## Why It Broke — The Physics

Critical slowing down: near a bifurcation point at $r = r_n^*$, the eigenvalue of the period-$2^{n-1}$ orbit approaches $-1$ (the stability condition for period-doubling). The convergence to the orbit slows: $|x(t) - x_{\text{orbit}}| \sim |r - r_n^*|^{1/2} \cdot e^{-\gamma t}$ where $\gamma \propto |r - r_n^*|$. Very close to $r_n^*$, $\gamma \to 0$ — convergence takes infinitely long. The standard 1,000-iteration transient is insufficient. Near the 4th bifurcation point, you need ~50,000 transient iterations for the orbit to fully converge.

The correct approach for detecting bifurcation points: use the slope of the first-return map. A period-$p$ orbit is a fixed point of $f^p(x, r) = f(f(\ldots f(x,r)\ldots),r)$ (the map composed with itself $p$ times). At a period-doubling bifurcation, the derivative $(f^p)'(x^*, r^*) = -1$. Numerically compute this derivative and track when it crosses $-1$.

For the Feigenbaum constant, the correct approach: find $r_1$ (first bifurcation, period 1→2), $r_2$ (period 2→4), $r_3$ (period 4→8) by binary search using the derivative condition. Then $\delta = (r_2-r_1)/(r_3-r_2)$. For the logistic map: $r_1 = 3.0, r_2 = 3.4495, r_3 = 3.5441$. $\delta = (3.4495-3.0)/(3.5441-3.4495) = 0.4495/0.0946 = 4.751$ — close to 4.669 but the third bifurcation gives a rough estimate. Higher-order ratios converge: $(r_3-r_2)/(r_4-r_3) = 4.655$, approaching 4.669 from above.

The Feigenbaum constant $\delta = 4.66920160\ldots$ is computed from renormalization group theory applied to 1D maps. Feigenbaum proved (1978) that all one-dimensional maps with a quadratic maximum (unimodal maps) have the same $\delta$ — the constant is universal, independent of the specific functional form. This was verified: the logistic map, $\sin(\pi x)$, $x e^{r(1-x)}$, $x^2 e^{-x}$ — all have the same $\delta$ and the same second constant $\alpha = 2.5029\ldots$ (scaling of the attractor width).

---

## The One Concept

**The Logistic Map and Feigenbaum Universality**

Pierre Verhulst wrote the logistic equation $\dot{N} = rN(1 - N/K)$ in 1838 to model population growth with a carrying capacity. In discrete time, with $x = N/K$, this becomes $x_{n+1} = rx_n(1-x_n)$ — the logistic map. For $0 < r \leq 4$, the map keeps $x \in [0,1]$ if $x_0 \in [0,1]$ — it's a valid probability model for population fraction.

The map's behavior as $r$ increases from 0 to 4 passes through a remarkable sequence of regimes. For $r < 1$: extinction (fixed point at 0). For $1 < r < 3$: convergence to a nonzero fixed point $x^* = 1 - 1/r$ (stable population). At $r = 3$: the fixed point loses stability and a period-2 cycle emerges — the population oscillates between two values. At $r \approx 3.449$: period-4. At $r \approx 3.544$: period-8. The period-doubling cascade accelerates, and at $r_\infty \approx 3.5699$, the cascade is complete and chaos begins. Beyond $r_\infty$: alternating windows of order (periodic orbits) and chaos.

The bifurcation diagram — the plot of attractor value vs. $r$ — is one of the most famous images in mathematics. It reveals the self-similar structure: zoom into any bifurcation point of the diagram, and you see a smaller copy of the entire diagram. The diagram is a fractal. The Hausdorff dimension of the Cantor set of $r$ values in the chaotic regime is exactly $D = \log 2 / \log \delta \approx 0.538$.

Mitchell Feigenbaum made the key observation in 1975 at Los Alamos: the ratio of consecutive period-doubling intervals converges to a universal constant $\delta = 4.669\ldots$ — the same for the logistic map, for $x_{n+1} = r\sin(\pi x_n)$, and for all unimodal maps. He computed the constant to many decimal places and submitted it for publication. The paper was rejected twice (the referees didn't believe the universality claim) before being published in 1979. Within a year, the constant was measured in physical experiments (Libchaber and Maurer, 1980: convection in liquid mercury). The match between computation and experiment was exact to the measurement precision.

The mathematical explanation of Feigenbaum universality uses renormalization group theory from statistical mechanics — the same conceptual framework used to explain the universality of critical exponents near phase transitions (Ising model, liquid-gas critical point). The "doubling operator" $T[f](x) = \alpha f(f(x/\alpha))$ has $\delta$ as its unique expanding eigenvalue at the period-doubling fixed point. This connects chaos theory to quantum field theory through shared mathematical structures — a profound and surprising unification.

---

## The Fix

Use the derivative-based period detection and binary search for bifurcation points:

```javascript
// Compute (f^p)'(x, r) using automatic differentiation (forward mode)
// where f(x,r) = r*x*(1-x) and f'(x,r) = r*(1-2x)
function chainRuleDerivative(x0, r, period, transient = 10000) {
  let x = x0;
  for (let i = 0; i < transient; i++) x = r * x * (1 - x); // longer transient

  // Compute derivative of f^period at x using chain rule
  let xp = x;
  let deriv = 1.0;
  for (let i = 0; i < period; i++) {
    deriv *= r * (1 - 2 * xp); // (df/dx) at each point
    xp = r * xp * (1 - xp);
  }
  return { xFixed: x, deriv };
}

// Binary search for bifurcation point r_n (period 2^(n-1) → 2^n)
function findBifurcation(period, rLow, rHigh, tol = 1e-8) {
  // At bifurcation, the derivative of f^period equals -1
  while (rHigh - rLow > tol) {
    const rMid = (rLow + rHigh) / 2;
    const { deriv } = chainRuleDerivative(0.5, rMid, period);
    if (deriv > -1) rLow = rMid; // not yet bifurcated
    else rHigh = rMid; // already bifurcated
  }
  return (rLow + rHigh) / 2;
}

// Find first four bifurcation points
const r1 = findBifurcation(1, 2.0, 3.0); // period 1→2 at r1=3.0
const r2 = findBifurcation(2, 3.0, 3.5); // period 2→4 at r2=3.449
const r3 = findBifurcation(4, 3.4, 3.6); // period 4→8 at r3=3.544
const r4 = findBifurcation(8, 3.5, 3.57);// period 8→16 at r4=3.5644

const delta_est = (r2 - r1) / (r3 - r2);
console.log(`Feigenbaum δ estimate: ${delta_est.toFixed(4)}`); // → 4.7514
const delta_est2 = (r3 - r2) / (r4 - r3);
console.log(`Better estimate: ${delta_est2.toFixed(4)}`); // → 4.6562
// Both converging toward 4.66920...
```

Render the bifurcation diagram using ImageData for maximum performance:

```javascript
function renderBifurcationDiagram(canvas, rMin = 2.5, rMax = 4.0, transient = 500, record = 200) {
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(W, H);
  const data = imageData.data;
  // Initialize to white
  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i+1] = data[i+2] = 255; data[i+3] = 255;
  }

  for (let px = 0; px < W; px++) {
    const r = rMin + (px / W) * (rMax - rMin);
    let x = 0.5;
    for (let i = 0; i < transient; i++) x = r * x * (1 - x);
    for (let i = 0; i < record; i++) {
      x = r * x * (1 - x);
      const py = Math.floor((1 - x) * (H - 1));
      const idx = (py * W + px) * 4;
      data[idx] = data[idx+1] = data[idx+2] = 0; // black pixel
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
```

This renders the full bifurcation diagram in < 5ms for a 600×400 canvas.

---

## The Wow Moment — Push It

**Self-similar zoom:** implement smooth pan-and-zoom into the bifurcation diagram. Click near a bifurcation point (say, the period-4 → period-8 bifurcation at $r \approx 3.544$) and animate a zoom in. The diagram reveals a smaller copy of itself — the self-similarity is visually stunning. Zoom in 1000× and the pattern still looks like the original bifurcation diagram, just shifted in $r$ and scaled in $x$.

**Lyapunov exponent overlay:** for each $r$ value in the bifurcation diagram, compute the Lyapunov exponent:

$$\lambda(r) = \lim_{N\to\infty} \frac{1}{N} \sum_{n=0}^{N-1} \ln |f'(x_n)| = \lim_{N\to\infty} \frac{1}{N} \sum_{n=0}^{N-1} \ln |r(1 - 2x_n)|$$

Plot $\lambda(r)$ vs. $r$ below the bifurcation diagram. The Lyapunov exponent is negative (stable) in periodic windows, zero at bifurcation points, and positive (chaotic) in the chaotic regime. The zero-crossings of $\lambda$ exactly mark the bifurcation points. The two plots together (bifurcation diagram above, Lyapunov exponent below) give a complete picture of the map's dynamics.

**Universal function:** show that the logistic map and $r\sin(\pi x)$ have the same bifurcation diagram shape (after rescaling). Overlay both on the same canvas with different colors. Their bifurcation points occur at different $r$ values, but the spacing ratios converge to the same $\delta = 4.669$. This is Feigenbaum universality made visual — two completely different maps, identical scaling.

---

## The Interactive Demo

- **r slider**: 0–4.0, step 0.001. Default 3.7. Cobweb diagram updates in real time.
- **"Show bifurcation diagram" toggle**: shows the full diagram in a 600×400px panel below the cobweb. Marks the current $r$ with a vertical red line.
- **"Animate r" button**: slowly sweeps $r$ from 2.5 to 4.0 over 30 seconds. The cobweb diagram morphs continuously.
- **Initial condition slider**: $x_0$ from 0.01 to 0.99. Default 0.5. Shows sensitivity to ICs in the chaotic regime.
- **Transient iterations slider**: 100–10,000. Default 1,000. Shows how more transient iterations clean up the bifurcation diagram near bifurcation points.
- **Record iterations slider**: 50–500. Default 200.
- **"Show Lyapunov" toggle**: adds the Lyapunov exponent plot below the bifurcation diagram.
- **"Show Feigenbaum points" toggle**: marks $r_1, r_2, r_3, r_4$ with labeled vertical lines and computes the Feigenbaum ratios on screen.
- **"Zoom mode" toggle**: enables click-to-zoom on the bifurcation diagram. Click sets the center, scroll controls zoom level.
- **Map selector**: Logistic ($rx(1-x)$) / Sine ($r\sin(\pi x)$) / Quadratic ($r - x^2$, Mandelbrot parameterization) / Custom (input a JavaScript function string). All share the same bifurcation diagram computation.
- **Cobweb step count**: 1–500. Default 50 visible cobweb steps.
- **"Export diagram" button**: high-resolution PNG of the bifurcation diagram.

---

## Production Notes

**Code structure:** `logisticMap.js` (map iteration, Lyapunov exponent, derivative computation), `cobweb.js` (cobweb diagram Canvas 2D renderer), `bifurcation.js` (bifurcation diagram renderer using ImageData), `feigenbaum.js` (binary search for bifurcation points, Feigenbaum ratio computation). Each module is < 100 lines — demonstrate good code organization.

**Visual layout:** the main cobweb diagram occupies the upper 60% of the canvas (blue parabola, gray diagonal, red cobweb path). The bifurcation diagram occupies the lower 40%. The $r$ slider sits between them, connecting the current $r$ position to both visualizations with a vertical red line. The Lyapunov plot, when enabled, slides in below the bifurcation diagram.

**Key cinematic moments:**
1. **0:00–0:45** — Robert May's quote from Nature. The opening line typed out on screen.
2. **1:00–1:45** — Cobweb animation: $r = 2.5$ (single point), $r = 3.2$ (period-2 bouncing), $r = 3.5$ (period-4), $r = 3.7$ (chaotic, cobweb fills the whole parabola).
3. **3:00–3:30** — The broken period-detection code. Wrong Feigenbaum estimate: 3.1.
4. **3:30–4:00** — The derivative-based fix. Correct estimate: 4.65, 4.67 — converging to 4.669.
5. **4:30–5:00** — Full bifurcation diagram appears. Sweeping $r$ in real time.
6. **5:30–6:30** — The zoom: zoom into the period-4 bifurcation point until the diagram looks just like the full diagram. Self-similarity revealed. Dramatic.
7. **6:30–7:00** — Lyapunov exponent overlay. Zero at bifurcation points. Positive in chaos.
8. **7:00–7:30** — Feigenbaum connection to M024 (Rössler): "That number again. 4.669. It's universal." Teaser for the universality theme.

**Performance:** the bifurcation diagram with 600 r-values × 1,200 iterations runs in ~2ms on the main thread — fast enough to re-render on every slider move. The Lyapunov computation (600 r-values × 10,000 iterations) takes ~10ms — acceptable if done asynchronously.

---

## Tags
`logistic-map` `chaos` `bifurcation` `feigenbaum` `period-doubling` `universality` `fractal` `nonlinear-dynamics`

---

## Thumbnail

The classic logistic map bifurcation diagram, rendered at very high resolution — the full structure from $r = 2.5$ to $r = 4.0$, black dots on white background. In the bottom-right quadrant of the diagram, a bright gold rectangle marks a zoom region, with a gold arrow pointing to a zoom inset showing the self-similar sub-diagram. The inset is identical in structure to the full diagram. Bold black text at the top (contrasting with the white diagram background): **"ONE EQUATION."** Below: **"THE ROUTE TO CHAOS."** In the bottom corner: the Feigenbaum constant in gold: **"δ = 4.669..."** — circled dramatically.
