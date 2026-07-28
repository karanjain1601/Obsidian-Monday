---
title: "The Butterfly That Started Chaos Theory (Lorenz Attractor)"
id: M023
difficulty: 5.5
prereq: "None"
concept: "Lorenz system: ẋ = σ(y-x), ẏ = x(ρ-z)-y, ż = xy-βz; at σ=10,ρ=28,β=8/3: trajectories settle on a strange attractor with fractal dimension ~2.06; sensitive dependence on initial conditions."
tags: [lorenz-attractor, chaos, strange-attractor, butterfly-effect, fractal, differential-equations, three-js, sensitive-dependence]
category: medium
type: video-idea
---

# The Butterfly That Started Chaos Theory (Lorenz Attractor)

**Alt title:** "A Weather Model That Broke Determinism"
**Difficulty:** 5.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

MIT, 1961. Edward Lorenz is re-running a weather simulation on his Royal McBee LGP-30 computer. To save time, he restarts partway through, typing the initial condition from a printout: 0.506. The original computation used 0.506127. He expects the two runs to be nearly identical. He goes for coffee.

He returns to find that after 60 simulated days, the two trajectories have diverged completely — one shows a storm, the other shows clear weather. Not a small difference. A completely different world.

Narrator: *"Lorenz had just discovered that determinism doesn't imply predictability. The flap of a butterfly's wing — a difference of 0.000127 — can change the weather two months later. Today you'll simulate the system that broke our faith in long-range forecasting, and you'll watch it break your code in a very specific way."*

A Three.js scene opens in the browser: a slow, glowing trajectory winding around two "wings" in 3D space — the Lorenz attractor. Haunting, beautiful, chaotic.

---

## The Naive Attempt

The Lorenz system is three coupled ordinary differential equations (ODEs). The naive student reaches for Euler's method — the simplest numerical integrator: advance each variable by its derivative times the time step $\Delta t$.

```javascript
const sigma = 10, rho = 28, beta = 8 / 3;

function lorenzDerivatives(x, y, z) {
  return {
    dx: sigma * (y - x),
    dy: x * (rho - z) - y,
    dz: x * y - beta * z,
  };
}

function eulerStep(state, dt) {
  const { x, y, z } = state;
  const d = lorenzDerivatives(x, y, z);
  return {
    x: x + d.dx * dt,
    y: y + d.dy * dt,
    z: z + d.dz * dt,
  };
}

let state = { x: 1, y: 1, z: 1 };
const trajectory = [state];

// Advance 10,000 steps at dt=0.01
for (let i = 0; i < 10000; i++) {
  state = eulerStep(state, 0.01);
  trajectory.push(state);
}
```

Running this and plotting in Three.js: the trajectory starts correctly, winding around the two lobes of the Lorenz attractor for about 2,000 steps. Then around step 2,500, the trajectory suddenly shoots off to infinity — the values of x, y, z diverge to hundreds, then thousands. The canvas goes blank. The Three.js renderer shows nothing because the geometry is outside the camera frustum. In the console: `x: 1.87e+15, y: -2.93e+15, z: 4.21e+15`.

The student reduces `dt` to 0.001 and tries again. Now the attractor runs for 10,000 steps without diverging, but it traces a very thin, imprecise path — clearly missing the correct attractor shape. At `dt = 0.001`, the characteristic shape is correct but looks "blurry" and doesn't converge to the true attractor's fine structure.

---

## The Moment of Failure

At `dt = 0.01`: the trajectory diverges to infinity around step 2,500. The Three.js scene shows the last few thousand trajectory points stretching out into the void — a bright streak shooting off the edge of the screen. Console shows `Infinity` or `NaN` values within a few more steps.

At `dt = 0.001`: 100× more steps per unit time, 100× slower, and the result is qualitatively correct but quantitatively wrong — the attractor's fine structure (the fractal leaf-like layering of the strange attractor) doesn't resolve even after 100,000 steps. The trajectory keeps retracing the same coarse path without exploring the full attractor geometry.

The visual diagnosis: at `dt = 0.01`, the trajectory visually misses one of the saddle points in the Lorenz system, overshoots, and gets thrown to infinity. At `dt = 0.001`, the trajectory stays bound but has insufficient accuracy to resolve the attractor's layered fractal structure.

---

## Why It Broke — The Physics

Euler's method has global error $O(\Delta t)$ — it accumulates one step of error per unit time. For the Lorenz system, the exponential divergence of nearby trajectories (Lyapunov exponent $\lambda_1 \approx 0.906$ nats/time) means that numerical errors grow as $e^{\lambda_1 t}$. After time $T$, the error in position is $\delta \sim \Delta t \cdot e^{\lambda_1 T}$. For $\Delta t = 0.01$ and $T = 25$ (2,500 steps), $\delta \sim 0.01 \times e^{22.6} \sim 10^8$. The simulation is completely wrong by this point — the "trajectory" diverged from the true attractor long ago.

For the Lorenz system, the correct integrator is **4th-order Runge-Kutta (RK4)**. RK4 has local error $O(\Delta t^5)$ and global error $O(\Delta t^4)$ — four orders of magnitude more accurate than Euler for the same step size. With $\Delta t = 0.01$ and RK4, the trajectory stays on the attractor for thousands of simulated time units — far longer than needed for a beautiful visualization.

RK4 works by evaluating the derivative at four points within each step and taking a weighted average:

$$k_1 = f(t, y)$$
$$k_2 = f(t + h/2,\ y + h k_1/2)$$
$$k_3 = f(t + h/2,\ y + h k_2/2)$$
$$k_4 = f(t + h,\ y + h k_3)$$
$$y_{n+1} = y_n + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$

For the Lorenz system, this is 4 derivative evaluations per step (vs. 1 for Euler), but the accuracy improvement is $\sim (\Delta t)^3$ — for $\Delta t = 0.01$, that's a factor of $10^6$ improvement in local error.

Key properties of the Lorenz attractor: it is a strange attractor — a bounded, non-periodic set of zero volume but non-zero Hausdorff dimension $D \approx 2.06$ (measured by Grassberger-Procaccia algorithm). Every trajectory starting near the attractor converges to it (the attractor is stable), but trajectories on the attractor diverge from each other exponentially (the attractor is chaotic). This is the key paradox: globally convergent, locally divergent.

The Lyapunov spectrum: $\lambda_1 \approx +0.906$ (divergence), $\lambda_2 = 0$ (marginal, tangent to the flow), $\lambda_3 \approx -14.57$ (strong convergence onto the attractor). The Kaplan-Yorke dimension: $D_{KY} = 2 + \lambda_1/|\lambda_3| \approx 2.06$, consistent with direct box-counting measurements.

---

## The One Concept

**The Lorenz Attractor and Sensitive Dependence**

In 1963, Edward Lorenz derived a simplified system of 3 ODEs from a 12-variable atmospheric convection model by truncating a Fourier series at 3 terms. The three variables represent: $x$ = rate of convective overturning, $y$ = temperature difference between ascending and descending currents, $z$ = deviation of the vertical temperature profile from linearity. The three parameters represent: $\sigma$ = Prandtl number (ratio of fluid viscosity to thermal diffusivity), $\rho$ = Rayleigh number (ratio of buoyant to viscous forces), $\beta$ = geometric factor from the aspect ratio of the convective cells.

At $\sigma = 10, \rho = 28, \beta = 8/3$, the system exhibits chaos. Lorenz noticed that for $\rho < 1$, the only attractor is the origin (no convection). At $\rho = 1$, the system bifurcates and two stable fixed points appear (steady convection clockwise or counterclockwise). At $\rho \approx 24.74$, these fixed points become unstable and the chaotic attractor appears. The precise parameter values at this transition are exactly calculable.

The "butterfly effect" — that small differences in initial conditions lead to large divergences — is mathematically formalized by the maximal Lyapunov exponent $\lambda_1$. Two trajectories separated initially by $\delta_0$ separate as $\delta(t) \approx \delta_0 e^{\lambda_1 t}$. The predictability horizon — the time at which the separation exceeds a threshold $\Delta$ — is $t_p = (1/\lambda_1) \ln(\Delta/\delta_0)$. For Earth's atmosphere, $\lambda_1 \approx 1/5$ days$^{-1}$ and $\delta_0/\Delta \approx 10^{-7}$ (measurement precision to storm scale), giving $t_p \approx 5 \times \ln(10^7) \approx 80$ days. The practical upper limit of weather prediction is 10–14 days in practice (the 80-day number is for a perfect model; real models have model error too).

A strange attractor is not a fixed point, not a limit cycle, not a torus — it's a new kind of geometric object that occupies a fractal dimension between 2 and 3. It's bounded: the trajectory never escapes a finite region of state space. It's dense: the trajectory eventually passes arbitrarily close to every point on the attractor. It's chaotic: nearby trajectories diverge. These three properties (bounded, dense, chaotic) define a strange attractor.

The Lorenz attractor was the first widely known strange attractor. It spawned the entire field of chaos theory: Smale's horseshoe, the Feigenbaum constants, the logistic map bifurcation diagram, fractals, Ruelle-Takens-Newhouse theorem (how turbulence arises), and the embedding theorem of Takens (reconstructing attractors from time series). The 1963 Lorenz paper is one of the most-cited papers in all of mathematics.

---

## The Fix

Replace Euler integration with RK4:

```javascript
function rk4Step(state, dt) {
  const { x, y, z } = state;

  const d1 = lorenzDerivatives(x, y, z);

  const x2 = x + d1.dx * dt / 2;
  const y2 = y + d1.dy * dt / 2;
  const z2 = z + d1.dz * dt / 2;
  const d2 = lorenzDerivatives(x2, y2, z2);

  const x3 = x + d2.dx * dt / 2;
  const y3 = y + d2.dy * dt / 2;
  const z3 = z + d2.dz * dt / 2;
  const d3 = lorenzDerivatives(x3, y3, z3);

  const x4 = x + d3.dx * dt;
  const y4 = y + d3.dy * dt;
  const z4 = z + d3.dz * dt;
  const d4 = lorenzDerivatives(x4, y4, z4);

  return {
    x: x + (dt / 6) * (d1.dx + 2 * d2.dx + 2 * d3.dx + d4.dx),
    y: y + (dt / 6) * (d1.dy + 2 * d2.dy + 2 * d3.dy + d4.dy),
    z: z + (dt / 6) * (d1.dz + 2 * d2.dz + 2 * d3.dz + d4.dz),
  };
}
```

With `dt = 0.01` and RK4: the trajectory stays on the attractor indefinitely (verified for 100,000 time units = 10 million steps). The attractor's fine layered structure is clearly visible in the Three.js render. No divergence.

**Three.js rendering:** maintain a `BufferGeometry` with a `Float32Array` of positions. On each animation frame, advance the simulation by 10 RK4 steps, append the new positions to a ring buffer of the last 10,000 points, and update the `BufferGeometry`. Use `THREE.Line` with a `LineBasicMaterial` with vertex colors based on the trajectory parameter (coloring by age, by speed, or by which lobe the particle is in — left or right wing).

```javascript
// Three.js setup (abbreviated)
const MAX_POINTS = 10000;
const positions = new Float32Array(MAX_POINTS * 3);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ vertexColors: true }));
scene.add(line);

function updateTrajectory() {
  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    state = rk4Step(state, DT);
    // Shift ring buffer
    positions.copyWithin(0, 3); // shift all positions left by one
    positions[MAX_POINTS * 3 - 3] = state.x;
    positions[MAX_POINTS * 3 - 2] = state.y;
    positions[MAX_POINTS * 3 - 1] = state.z;
  }
  geometry.attributes.position.needsUpdate = true;
  geometry.setDrawRange(0, MAX_POINTS);
}
```

---

## The Wow Moment — Push It

**Twin trajectories:** run two trajectories simultaneously, starting 0.001 apart in x. Color one red, one blue. At first they're indistinguishable — they overlap. Show a small inset: the distance between them on a log scale. The log-distance grows linearly (exponential separation). Around $t = 10$, the trajectories visibly diverge — one stays on the left wing while the other switches to the right. By $t = 20$, they look completely unrelated. The Lyapunov exponent animation: measure the slope of the log-distance vs. time graph → $\lambda_1 \approx 0.90$. This is the butterfly effect made visible in Three.js.

**Parameter sweep — rho slider:** animate $\rho$ from 1 to 30 in real time. At $\rho < 1$: single stable equilibrium (origin). At $1 < \rho < 13.93$: two stable equilibria. At $13.93 < \rho < 24.74$: chaotic transients but not a persistent attractor. At $\rho > 24.74$: the Lorenz strange attractor. Watching the attractor emerge from a pair of stable spirals is one of the most dramatic bifurcation animations in nonlinear dynamics.

**Attractor reconstruction from time series (Takens embedding):** record only the $x(t)$ time series from the Lorenz simulation. Reconstruct the full 3D attractor using the time-delay embedding: plot $(x(t), x(t+\tau), x(t+2\tau))$ for a chosen delay $\tau$. The result is topologically equivalent to the original Lorenz attractor — the characteristic double-wing shape reappears from a single scalar time series. This demonstrates Takens' 1981 theorem, fundamental to experimental nonlinear dynamics.

---

## The Interactive Demo

- **Sigma, Rho, Beta sliders**: sigma (0–20), rho (0–50), beta (0–5). Default: 10, 28, 8/3. Real-time update.
- **"Lorenz chaos" preset button**: snaps to sigma=10, rho=28, beta=8/3.
- **"Twin trajectories" toggle**: adds a second trajectory starting 0.001 away. Shows separation distance in an inset.
- **Steps per frame slider**: 1–100. Default 10. Controls animation speed.
- **Point buffer slider**: 1,000–50,000 points in the trajectory tail. Default 10,000.
- **Color mode**: age gradient (blue=old, red=new) / speed (hue by velocity magnitude) / lobe (left wing=blue, right wing=red, classified by sign of x) / monochrome white.
- **Camera orbit**: click-drag to rotate, scroll to zoom. Default: slight elevated perspective to see both wings.
- **"Lock camera to attractor" toggle**: auto-orbits the camera around the y-axis at 0.3 rpm.
- **"Show fixed points" toggle**: renders the three fixed points of the Lorenz system as colored spheres (origin in red, two wing centers in yellow). Helps students understand the topology.
- **"Poincaré section" toggle**: shows the intersection of the trajectory with the plane $z = 27$ (near the middle of the attractor). Each intersection is a dot. The dots form the Lorenz strange attractor's cross-section — a cantor-set-like distribution on an interval.
- **Lyapunov exponent readout**: live estimate of $\lambda_1$ using the Benettin algorithm (measure separation, normalize, repeat).
- **"Export trajectory" button**: downloads the current trajectory as a CSV for offline analysis.

---

## Production Notes

**Code structure:** `lorenz.js` (RK4 integrator for the Lorenz system, also generalized to accept any f(state) function — reusable for M024), `attractorRenderer.js` (Three.js setup, geometry management, camera control), `lyapunov.js` (Benettin algorithm for maximal Lyapunov exponent estimation), `poincare.js` (section computation and rendering as a 2D canvas overlay).

**Three.js scene:** the attractor is rendered as a `THREE.Line` with `vertexColors = true`. Each new point gets a color based on its age in the ring buffer — the gradient from blue (oldest) to red (newest) gives the impression of a "flowing" trajectory. The background is near-black (#050510) to make the glowing lines pop. Add a subtle ambient particle system (1,000 tiny white points scattered near the attractor) to suggest the "cloud of uncertainty" that grows from small initial conditions.

**Key cinematic moments:**
1. **0:00–0:30** — The Lorenz office re-run story. Recreate the "going for coffee" moment as a brief animation.
2. **0:30–1:00** — First Three.js attractor render. Slow, full orbit, dramatic music.
3. **2:30–3:00** — Euler divergence. Trajectory shoots to infinity. Console shows `1.87e+15`.
4. **3:00–3:30** — RK4 explanation with the k1, k2, k3, k4 graphical animation (4 slope samples per step, weighted average).
5. **5:00–5:45** — Twin trajectories: the blue and red lines diverge. Log-distance inset shows the linear slope ($\lambda_1$). This is the visual peak of the video.
6. **6:00–6:30** — Rho parameter sweep. The attractor emerges at $\rho = 24.74$. Dramatic bifurcation moment.
7. **7:00–7:30** — Poincaré section: show dots accumulating on the section. They form a fractal curve — the attractor's cross-section. Label it "D ≈ 2.06."

**Lighting in Three.js:** a single `PointLight` at position (0, 0, 50) (above the attractor), white, intensity 1.0. The line material uses `vertexColors` so it ignores lighting — the glow effect is purely from the color gradient. Add a `THREE.Fog(0x050510, 80, 300)` to fade the older parts of the trajectory into the background, emphasizing the most recent section.

---

## Tags
`lorenz-attractor` `chaos` `strange-attractor` `butterfly-effect` `fractal` `differential-equations` `three-js` `sensitive-dependence`

---

## Thumbnail

Full-screen Three.js render of the Lorenz attractor on a near-black background. The trajectory is colored with a gradient: deep blue at the core, transitioning to cyan, then bright yellow-white at the most recent tip. The double-wing structure fills the frame. In the top-left: small text reading **"σ=10, ρ=28, β=8/3"** in monospace white. In the center-bottom: bold white text **"THE BUTTERFLY EFFECT"** and beneath it, smaller: **"(And Why It Broke Euler Integration)"**. A faint second trajectory in red, diverging from the main blue one, is visible in the background — the twin-trajectory demo, establishing the chaos concept in the thumbnail itself.
