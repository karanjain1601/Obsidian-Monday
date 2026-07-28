---
title: "A Simpler Chaotic System (Rössler Attractor)"
id: M024
difficulty: 5.5
prereq: "M023"
concept: "Rössler system: ẋ = -y-z, ẏ = x+ay, ż = b+z(x-c); single-band attractor at a=0.2,b=0.2,c=5.7; simpler than Lorenz but still chaotic; Poincaré section reveals period-doubling route to chaos."
tags: [rossler-attractor, chaos, poincare-section, period-doubling, strange-attractor, differential-equations, three-js, bifurcation]
category: medium
type: video-idea
---

# A Simpler Chaotic System (Rössler Attractor)

**Alt title:** "The Simplest Equation That Nobody Can Predict"
**Difficulty:** 5.5/10 | **Prereq:** M023

---

## Opening Hook (0:00–1:00)

Recap: "In the last video, we watched the Lorenz attractor emerge from a convection model — three coupled equations, six nonlinear terms, strange and beautiful. But Lorenz's system was motivated by meteorology. What if you stripped everything away and asked: what's the absolute minimum for chaos?"

Show the Lorenz equations on screen — six terms, three nonlinear. Then show the Rössler equations next to them: three equations, only one nonlinear term ($z \cdot x$ in the $\dot{z}$ equation). Highlight the contrast: Lorenz has two quadratic terms; Rössler has one. Yet:

Narrator: *"Otto Rössler, a biochemist in Tübingen, wrote these three equations in 1976 — not from any physical model, but by asking 'what's the minimum I need for chaos?' And the result was just as wild as Lorenz."*

A Three.js render opens: a single spiral ribbon, looping around in a stretched, tilted disk, occasionally shooting up and looping back around. Simpler than Lorenz — one band instead of two wings — but undeniably strange.

---

## The Naive Attempt

Having learned RK4 from M023, the student correctly implements RK4 for the Rössler system. But they want to do something extra: generate a bifurcation diagram — plot the attractor's behavior as parameter $c$ changes from 2 to 10. They plan to do this by: for each $c$ value, run the simulation for 1,000 time units, record the Poincaré section crossings (intersections of the trajectory with the plane $y = 0$ with $\dot{y} > 0$), and plot the $z$-values of those crossings as dots.

```javascript
// Rössler system
const a = 0.2, b = 0.2;
let c = 5.7; // will vary

function rosslerDerivatives(x, y, z) {
  return {
    dx: -y - z,
    dy: x + a * y,
    dz: b + z * (x - c),
  };
}

// Generate bifurcation diagram
function bifurcationDiagram() {
  const results = []; // {c, zValues: [...]}
  for (let ci = 2.0; ci <= 10.0; ci += 0.05) {
    c = ci;
    let state = { x: 1, y: 0, z: 0 };
    // Transient: run 500 time units to reach attractor
    for (let t = 0; t < 50000; t++) state = rk4Step(state, 0.01);
    // Record: next 500 time units
    const zCrossings = [];
    let prevY = state.y;
    for (let t = 0; t < 50000; t++) {
      state = rk4Step(state, 0.01);
      if (prevY < 0 && state.y >= 0) {
        zCrossings.push(state.z); // Poincaré crossing
      }
      prevY = state.y;
    }
    results.push({ c: ci, zValues: zCrossings });
  }
  return results;
}
```

Running this: 160 values of $c$ × 100,000 RK4 steps each = 16 million RK4 evaluations = 64 million function calls. This takes 45 seconds to complete on a modern laptop with single-threaded JavaScript. The browser freezes completely for 45 seconds. Users think the tab crashed.

Second problem: at some values of $c$, the trajectory doesn't stabilize within 500 time units — it's in a very long transient. The Poincaré section for those $c$ values has too few crossings, making the bifurcation diagram patchy with missing data at exactly the most interesting parameter values.

---

## The Moment of Failure

Browser tab shows "Page Unresponsive" after 5 seconds (the script has been running for much longer but Chrome's detection triggers late). User force-closes the tab. Reload. Run with fewer $c$ values: 50 instead of 160. Still 20 seconds — still freezes. The bifurcation diagram that finally renders (after 3 minutes of waiting, using `setTimeout` tricks to prevent browser freezing) has large gaps at $c = 4.2$ and $c = 6.0$ — exactly where the period-doubling cascade is most interesting.

---

## Why It Broke — The Physics

**Performance:** the bifurcation diagram requires running many independent simulations at different parameter values. These are perfectly parallelizable — each $c$ value's simulation is independent of all others. JavaScript's main thread is single-threaded, but Web Workers provide true parallelism across CPU cores. The fix: spawn N workers (one per CPU core, typically 4–8), distribute the $c$ values across workers, and merge the results when all workers finish. Wall-clock time reduces from 45 seconds (1 core) to ~8 seconds (6 cores).

**Transient length:** the Rössler attractor's transient (time to reach the attractor from a random initial condition) depends strongly on parameter $c$. Near bifurcation points (where the period-doubling cascade is occurring), the attractor changes character rapidly — the system is "critical" and transients diverge. A fixed 500-time-unit transient is too short near bifurcation points. The fix: use an adaptive transient — run until the Poincaré section crossings stabilize (when the standard deviation of the last 10 $z$-crossings stops changing by more than $\epsilon = 0.01$ per step).

**Poincaré section definition:** the student uses $y = 0, \dot{y} > 0$, but at some $c$ values the trajectory crosses $y = 0$ many times without the specific crossing condition — the section misses crossings or double-counts them. The robust definition: check the sign change of $y(t_i)$ between two consecutive steps AND verify that $x > 0$ at the crossing (to select the correct hemisphere), then linearly interpolate to find the exact crossing time $t^*$.

The Rössler attractor physics: the $\dot{z} = b + z(x-c)$ equation is the only nonlinear term. For $x < c$: $\dot{z}$ is small (negative feedback, $z$ stays small). For $x > c$: $\dot{z}$ grows exponentially (positive feedback, $z$ shoots up). The trajectory spirals outward in the $xy$-plane until $x > c$, then $z$ spikes upward, which through the coupling $\dot{y} = x + ay$ and $\dot{x} = -y-z$ resets $x$ and $y$ to small values, and the spiral starts again. This is the mechanism of a "spiral-type" strange attractor.

Period-doubling route to chaos (Feigenbaum cascade): as $c$ increases from 2 to 10, the Poincaré section transitions: one point ($c \approx 2$–$3$, period-1); two points ($c \approx 3$–$3.7$, period-2); four points ($c \approx 3.7$–$3.9$, period-4); eight points; chaos. The bifurcation values $c_n$ at which the $n$-th doubling occurs satisfy $\lim_{n\to\infty} (c_n - c_{n-1})/(c_{n+1} - c_n) = \delta \approx 4.669$ — the Feigenbaum constant. This is the same constant as in the logistic map (M025), confirming universality.

---

## The One Concept

**The Rössler Attractor and Period-Doubling**

Otto Rössler introduced his system in 1976 as a "prototype" chaotic system — deliberately simplified to have only one nonlinear term, unlike the Lorenz system's two. Rössler was influenced by Arthur Winfree's work on chemical oscillators and by the abstract mathematics of folded manifolds. He was searching for the minimum ingredients for chaos: a nonlinear feedback term that occasionally "kicks" the trajectory, combined with a slow oscillation that organizes the global structure.

The Rössler system has a beautifully simple geometric mechanism. In the $xy$-plane, the trajectory spirals outward from the origin (governed by $\dot{x} = -y$, $\dot{y} = x + ay$ — an unstable spiral for $a > 0$). As the spiral expands, eventually $x$ becomes large enough that $z$ starts growing rapidly ($\dot{z} = b + z(x-c)$). The growing $z$ feeds back through $\dot{x} = -y-z$ and pulls the trajectory back toward small $x,y$. This "folding and stretching" is the fundamental mechanism of chaos in continuous-time systems: the trajectory is stretched (divergence of nearby points) and folded (trajectories stay bounded) — the baker's map in 3D.

The Poincaré section is the key tool for analyzing the Rössler attractor's dynamics. By taking a 2D cross-section through the 3D attractor (like cutting a pretzel with a knife), we reduce the continuous-time ODE to a discrete-time map. For the Rössler system with the standard section $y = 0, \dot{y} > 0$, each intersection is a point $(x, z)$. For period-1 behavior: exactly one point. For period-2: two points, visited alternately. For chaos: infinitely many points arranged in a fractal curve.

Period-doubling is the Rössler system's route to chaos as $c$ increases. Each doubling is a pitchfork bifurcation of the Poincaré map: the period-1 fixed point becomes unstable and two period-2 points are born. Then each period-2 point bifurcates to produce period-4, and so on. The cascade accelerates geometrically — the spacing between successive bifurcation values converges with the Feigenbaum ratio $\delta \approx 4.669$. This universal ratio was discovered by Mitchell Feigenbaum at Los Alamos in 1975 while studying the logistic map, and proved to be the same for all "unimodal maps" — a remarkable universality result verified experimentally in liquid helium experiments, nonlinear optical systems, and acoustic turbulence.

Why is the Rössler system pedagogically valuable alongside Lorenz? It is simpler (one nonlinear term vs. two), which makes the mechanism clearer. Its Poincaré section is 1D (a single curve of points), while Lorenz's section is 2D, making the period-doubling route to chaos visible as a bifurcation diagram of a single variable. And it models real chemical and biological oscillators: Rössler showed that modified glycolytic oscillator models have the same qualitative behavior.

---

## The Fix

Use Web Workers for parallel bifurcation diagram computation:

```javascript
// main.js: spawn workers
const NUM_WORKERS = navigator.hardwareConcurrency || 4;
const cValues = [];
for (let c = 2.0; c <= 10.0; c += 0.05) cValues.push(c);
const chunkSize = Math.ceil(cValues.length / NUM_WORKERS);

let completed = 0;
const allResults = [];

for (let w = 0; w < NUM_WORKERS; w++) {
  const worker = new Worker('rosslerWorker.js');
  const chunk = cValues.slice(w * chunkSize, (w + 1) * chunkSize);
  worker.postMessage({ cValues: chunk, a: 0.2, b: 0.2 });
  worker.onmessage = (e) => {
    allResults.push(...e.data.results);
    completed++;
    if (completed === NUM_WORKERS) drawBifurcationDiagram(allResults);
  };
}

// rosslerWorker.js: runs in a separate thread
self.onmessage = function({ data: { cValues, a, b } }) {
  const results = cValues.map(c => {
    let state = { x: 1, y: 0, z: 0 };
    const dt = 0.01;

    // Adaptive transient: run until last 10 crossings are stable
    let prevZ = null;
    let stableCount = 0;
    for (let t = 0; t < 100000 && stableCount < 10; t++) {
      const prevY = state.y;
      state = rk4Step(state, dt, a, b, c);
      if (prevY < 0 && state.y >= 0 && state.x > 0) {
        if (prevZ !== null && Math.abs(state.z - prevZ) < 0.01) stableCount++;
        else stableCount = 0;
        prevZ = state.z;
      }
    }

    // Record 100 crossings
    const zCrossings = [];
    let prevY = state.y;
    for (let t = 0; t < 500000 && zCrossings.length < 100; t++) {
      prevY = state.y;
      state = rk4Step(state, dt, a, b, c);
      if (prevY < 0 && state.y >= 0 && state.x > 0) {
        // Linear interpolation to exact crossing time
        const frac = -prevY / (state.y - prevY);
        const zInterp = prevZ + frac * (state.z - prevZ); // approximate
        zCrossings.push(state.z);
      }
    }
    return { c, zCrossings };
  });
  self.postMessage({ results });
};
```

With 6 workers: wall-clock time drops from 45s to ~8s. The adaptive transient ensures the bifurcation points are resolved correctly.

---

## The Wow Moment — Push It

**Full bifurcation diagram with Feigenbaum measurement:** after computing the diagram with high resolution (500 $c$ values from 2 to 10, 200 Poincaré section points each), zoom into the bifurcation cascade region ($c = 2$ to $c = 4.5$). Mark the bifurcation points $c_1, c_2, c_3, c_4$ (period 1→2, 2→4, 4→8, 8→16). Compute $(c_2 - c_1)/(c_3 - c_2)$ and $(c_3 - c_2)/(c_4 - c_3)$. Both should be close to 4.669. Display the computation on screen. Teaser for M025: "We'll see this exact same number in a much simpler system."

**Live Poincaré section animation:** run the 3D attractor simulation and simultaneously project each trajectory point onto the Poincaré section ($y = 0$ plane). The 3D view (Three.js) and the 2D Poincaré section (Canvas 2D overlay) update simultaneously. As the trajectory accumulates crossings, the 2D view shows the fractal curve of the strange attractor's section emerging, point by point.

**Compare with Lorenz:** show both attractors side by side in Two Three.js canvases. Lorenz on the left (two wings, more symmetric), Rössler on the right (one band, spiraling disk). Animate both simultaneously. The qualitative difference — despite both being chaotic — is immediately visible. Label each attractor's topological structure: Lorenz is a "folded band" with genus 1 topology; Rössler is a "once-folded band" with a different topology.

---

## The Interactive Demo

- **a, b, c sliders**: a (0–0.5), b (0.1–0.5), c (2.0–15.0). Defaults: 0.2, 0.2, 5.7. Real-time update of 3D render.
- **"Standard Rössler" button**: snaps to a=0.2, b=0.2, c=5.7.
- **Steps per frame**: 1–200. Default 20.
- **Point buffer**: 5,000–100,000 points. Default 20,000.
- **"Show Poincaré section" toggle**: displays the 2D cross-section as a Canvas overlay in the top-right corner.
- **"Run bifurcation diagram" button**: spawns workers and generates the full bifurcation diagram (c from 2 to 10). Shows a loading progress bar. Result displayed in a new panel.
- **"Mark Feigenbaum points" button**: after the bifurcation diagram is computed, marks the first 4 period-doubling points and computes the Feigenbaum ratio.
- **"Compare with Lorenz" mode**: splits the screen and shows both attractors simultaneously.
- **Trajectory color modes**: age gradient / velocity magnitude / $z$-value (height) / lobe classification (above/below $z = c$ plane).
- **"Export Poincaré section" button**: downloads the current Poincaré section points as a CSV.
- **Camera controls**: orbit (left drag), zoom (scroll), reset (double-click).
- **"Show fixed point" toggle**: marks the fixed point of the Rössler system (for the current $c$) as a colored sphere.
- **Time step slider**: 0.001–0.05. Default 0.01. Warning: dt > 0.025 may lose accuracy.

---

## Production Notes

**Code structure:** `rossler.js` (RK4 integrator, shared lorenz.js pattern from M023 — demonstrate code reuse), `rosslerWorker.js` (bifurcation diagram worker, self-contained), `poincare.js` (section detection and rendering, shared with M023), `bifurcationPlot.js` (2D Canvas rendering of the bifurcation diagram). The explicit code reuse of `lorenz.js`'s RK4 function (generalized to accept any ODE) is a teaching moment about abstraction.

**The generalized RK4 function** (highlight this in the video as the abstraction payoff from M023):

```javascript
// Generalized RK4: works for any system defined by f(state) -> derivatives
function rk4Step(state, dt, f) {
  const k1 = f(state);
  const k2 = f(addScaled(state, k1, dt / 2));
  const k3 = f(addScaled(state, k2, dt / 2));
  const k4 = f(addScaled(state, k3, dt));
  return {
    x: state.x + (dt / 6) * (k1.dx + 2*k2.dx + 2*k3.dx + k4.dx),
    y: state.y + (dt / 6) * (k1.dy + 2*k2.dy + 2*k3.dy + k4.dy),
    z: state.z + (dt / 6) * (k1.dz + 2*k2.dz + 2*k3.dz + k4.dz),
  };
}
// M024 calls: rk4Step(state, dt, (s) => rosslerDerivatives(s, a, b, c))
// M023 called: rk4Step(state, dt, (s) => lorenzDerivatives(s, sigma, rho, beta))
```

**Key cinematic moments:**
1. **0:00–0:45** — Rössler's biochemist origin story. Show the one nonlinear term highlighted in the equations.
2. **1:30–2:00** — The attractor renders beautifully in Three.js using M023's RK4. "We already have the tools."
3. **2:30–3:30** — The bifurcation diagram failure: browser freeze. Worker fix. Wall-clock timer showing 45s → 8s.
4. **4:00–5:00** — The bifurcation diagram appears. Zoom into the period-doubling cascade. Label each doubling. Count: 1, 2, 4, 8, chaos.
5. **5:30–6:00** — Feigenbaum constant computation on screen. "4.67. We'll see this again."
6. **6:30–7:00** — Live Poincaré section accumulating in real time alongside the 3D trajectory.
7. **7:00–7:30** — Lorenz vs. Rössler side by side. Topological comparison.

**Three.js color scheme:** Rössler attractor uses a warm palette to contrast with Lorenz's cool blue — orange to yellow gradient, black background. The single-band structure of the Rössler attractor is more visually readable than Lorenz's two-wing structure, which makes close-up shots more informative.

---

## Tags
`rossler-attractor` `chaos` `poincare-section` `period-doubling` `strange-attractor` `differential-equations` `three-js` `bifurcation`

---

## Thumbnail

Three.js render of the Rössler attractor on a black background — a glowing orange-yellow spiral ribbon stretching from a tight center coil to a loose outer loop, with the characteristic "flip" visible where the orbit rises out of the plane. The color gradient runs from deep orange at the center to bright yellow at the tip. In the bottom-left corner: a small 2D Poincaré section plot showing dots arranged on a single fractal curve. Bold white text at top: **"SIMPLER THAN LORENZ."** Below it: **"Still completely chaotic."** A small Lorenz attractor render (blue, tiny) appears in the top-right corner as a contrast silhouette.
