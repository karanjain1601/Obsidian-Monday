---
title: "Random Growth Makes Rough Surfaces (Eden Model)"
id: M016
difficulty: 5
prereq: "None"
concept: "Eden model: cells grow by randomly activating any boundary cell; results in a compact cluster with a rough surface; surface width grows as W ∝ t^β (β≈1/3 in 2D); Kardar-Parisi-Zhang universality class."
tags: [eden-model, KPZ, surface-growth, random-growth, roughness, universality-class, cellular-automata, statistical-mechanics]
category: medium
type: video-idea
---

# Random Growth Makes Rough Surfaces (Eden Model)

**Alt title:** "Why Your Rust Spreads in That Exact Jagged Pattern"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Time-lapse: a slice of bread molding over five days — the mold colony spreading outward from an initial spore, perfectly circular at first, then growing a rough, jagged perimeter. Cut to: rust spreading across a steel plate — the same rough circular expansion. Cut to: a bacterial colony on a petri dish, lit from below, growing outward with the same rough halo. Cut to: a satellite image of a wildfire spreading across a California hillside.

Narrator: *"All of these look different, but they're all obeying the exact same equation. An equation discovered in 1985 that governs every rough surface in the universe — from quantum noise to tumor growth."*

Zoom into an empty canvas. A single green cell appears at center. Then, one by one, random cells on its perimeter light up green. The cluster grows — fast, but with a jagged, rough edge that clearly isn't a smooth circle. The roughness seems to grow over time. Narrator: *"This is the Eden model. Murray Eden invented it in 1961 to model tumor growth. But what he discovered — accidentally — was one of the most universal laws in all of physics."*

---

## The Naive Attempt

The most straightforward Eden model: maintain a set of "filled" cells and a separate set of "border candidates" — cells adjacent to any filled cell but not yet filled. On each tick, pick one candidate uniformly at random, fill it, and update the candidate set.

```javascript
const filled = new Set();
const candidates = new Set();

function initEden(cx, cy) {
  filled.add(`${cx},${cy}`);
  addNeighborsToCandidates(cx, cy);
}

function addNeighborsToCandidates(x, y) {
  const nbrs = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
  for (const [nx, ny] of nbrs) {
    const key = `${nx},${ny}`;
    if (!filled.has(key)) candidates.add(key);
  }
}

function step() {
  // Pick a random candidate
  const arr = Array.from(candidates);
  const chosen = arr[Math.floor(Math.random() * arr.length)];
  const [cx, cy] = chosen.split(',').map(Number);
  filled.add(chosen);
  candidates.delete(chosen);
  addNeighborsToCandidates(cx, cy);
  return [cx, cy];
}
```

This is correct. You run it and it works beautifully up to about 1,000 cells. Then performance craters. The line `Array.from(candidates)` converts the entire candidate set to an array on every single step, just to pick one random element. At 10,000 cells, the candidate set has ~300 entries, so each step allocates a 300-element array — 10,000 allocations per render frame, causing garbage collection storms. The frame rate drops from 60fps to 4fps. At 100,000 cells the simulation becomes completely unusable.

Second problem: the surface roughness measurement. You try to compute the width $W$ by finding the maximum and minimum radius of filled cells:

```javascript
function surfaceWidth() {
  let rMin = Infinity, rMax = 0;
  for (const key of candidates) {
    const [x, y] = key.split(',').map(Number);
    const r = Math.hypot(x - cx, y - cy);
    rMin = Math.min(rMin, r);
    rMax = Math.max(rMax, r);
  }
  return rMax - rMin;
}
```

This gives wildly oscillating values because you're measuring $r_{\text{max}} - r_{\text{min}}$ which is dominated by single outlier cells at the tips and bays of the rough surface. The log-log plot of $W$ vs. $t$ is pure noise — you can't see the $\beta = 1/3$ power law at all.

---

## The Moment of Failure

Frame rate counter visible in the corner of the canvas drops: 60fps at 500 cells → 22fps at 2,000 cells → 8fps at 5,000 cells → 2fps at 10,000 cells. The browser's task manager shows memory usage climbing as GC thrashes arrays. The surface width graph, shown in an inset, is a jagged noise signal — no visible trend. The log-log plot looks like a shotgun blast. You have a correct simulation that's too slow to be useful and a measurement method too noisy to reveal the science.

---

## Why It Broke — The Physics

**Performance problem:** random selection from an unordered set requires $O(N)$ time if you must convert it to an array first, because sets don't support O(1) random access by index. The fix is an explicit array that acts as an alias list for the candidate set, maintained in sync. Alternatively: use a Fisher-Yates shuffle maintained as a dynamic array with O(1) random removal.

**Measurement problem:** The correct definition of surface width in the KPZ universality class is not $r_{\text{max}} - r_{\text{min}}$. It is the **RMS fluctuation** of the surface height around its mean:

$$W(t) = \sqrt{\frac{1}{L} \sum_{i=1}^{L} [h_i(t) - \bar{h}(t)]^2}$$

where $h_i(t)$ is the height (radius) of the surface at angular position $i$, $\bar{h}(t) = \frac{1}{L}\sum_i h_i$ is the mean radius at time $t$, and $L$ is the number of angular bins. This is the standard deviation of the surface height profile, averaged over all angles. For the Eden model in 2D:

$$W(t) \propto t^{1/3} \quad \text{(KPZ scaling, } \beta = 1/3\text{)}$$

The Kardar-Parisi-Zhang (KPZ) equation (1986) describes how a rough surface evolves:

$$\frac{\partial h}{\partial t} = \nu \nabla^2 h + \frac{\lambda}{2} (\nabla h)^2 + \eta(\mathbf{x}, t)$$

where $\nu$ is a surface tension term (smoothing), $\lambda$ is the nonlinear growth term (the source of universality), and $\eta$ is white noise (the randomness). The KPZ equation is universal: any local, random, interface-growth model with a nonlinear growth term belongs to the KPZ universality class, including Eden, ballistic deposition, ASEP (asymmetric exclusion process), and even some quantum systems. The exponent $\beta = 1/3$ is exact in 1+1 dimensions, derived analytically by Kardar, Parisi, and Zhang.

---

## The One Concept

**The KPZ Universality Class**

Murray Eden proposed his model in 1961 as a simple model of tumor growth: a tumor grows by randomly converting a healthy cell adjacent to the tumor into a tumor cell. The result is a compact, roughly circular blob — but the edge is not smooth. It fluctuates. Eden noticed the fluctuations but didn't characterize them mathematically.

In 1985, Kardar, Parisi, and Zhang wrote down a partial differential equation describing the universal behavior of growing interfaces subject to local random noise. The KPZ equation has three terms: a diffusion term that smooths the surface (like surface tension), a nonlinear term proportional to $(\nabla h)^2$ that captures the fact that growth is perpendicular to the surface rather than vertical, and a noise term representing the randomness of the growth process. The remarkable result was that the scaling exponents — $\beta = 1/3$ for the roughness growth and $\alpha = 1/2$ for the correlation length — are exactly calculable and universal across a huge class of physical systems.

Universality is the key idea: it doesn't matter whether you're modeling tumor cells, falling sand, crystal deposition, or directed polymers in a random medium — if the model has local random growth and a nonlinear driving term, it belongs to the KPZ class and shows $\beta = 1/3$. This is deep physics: the microscopic details are irrelevant. Only the symmetries and the dimension matter.

To see $\beta = 1/3$ in your Eden simulation, you need three things: (1) the cluster must be large enough (~50,000 cells minimum) for the power law to emerge above finite-size effects; (2) the surface width must be measured as the RMS radius fluctuation in angular bins, not as max-minus-min; (3) the log-log plot must span at least 2 decades of time. When all three are satisfied, the data lies on a straight line with slope $1/3$ — a slope that matches quantum spin chains, traffic flow models, and growing bacterial colonies on three continents.

The KPZ universality class was experimentally confirmed in 2010 by Takeuchi and Sano, who measured the growing interface of a liquid crystal phase transition and found perfect agreement with $\beta = 1/3$ and even the exact scaling function (the Tracy-Widom distribution, which originally appeared in random matrix theory). This was a spectacular convergence: a physics experiment, a bacterial growth model, and a mathematical result about eigenvalues of random matrices — all the same equation.

In practice, the Eden model is used to model: tumor invasion (cancer research), bacterial colony growth, electrochemical deposition roughness, and corrosion front propagation. The roughness exponent $\beta$ tells engineers how quickly a surface degrades over time — critical for designing everything from medical implants to semiconductor thin films.

---

## The Fix

Replace the `Array.from(candidates)` approach with an explicit array that supports O(1) random access and O(1) removal:

```javascript
// Maintain candidates as an array with an index map for O(1) removal
const candidateArr = [];
const candidateMap = new Map(); // key → index in candidateArr

function addCandidate(key) {
  if (candidateMap.has(key) || filled.has(key)) return;
  candidateMap.set(key, candidateArr.length);
  candidateArr.push(key);
}

function removeCandidate(key) {
  const idx = candidateMap.get(key);
  if (idx === undefined) return;
  const last = candidateArr[candidateArr.length - 1];
  candidateArr[idx] = last; // swap with last
  candidateMap.set(last, idx);
  candidateArr.pop();
  candidateMap.delete(key);
}

function step() {
  if (candidateArr.length === 0) return;
  const idx = Math.floor(Math.random() * candidateArr.length);
  const chosen = candidateArr[idx];
  const [cx, cy] = chosen.split(',').map(Number);

  filled.add(chosen);
  removeCandidate(chosen);

  const nbrs = [[cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]];
  for (const [nx, ny] of nbrs) {
    addCandidate(`${nx},${ny}`);
  }
}
```

This gives O(1) step time regardless of cluster size. Performance is now 60fps up to 1,000,000 cells.

For the surface width measurement, bin the candidates by angle into $L = 360$ angular bins (1° each) and compute the RMS radius:

```javascript
function surfaceWidth(cx, cy, candidates) {
  const bins = new Array(360).fill(0);
  const counts = new Array(360).fill(0);
  for (const key of candidates) {
    const [x, y] = key.split(',').map(Number);
    const r = Math.hypot(x - cx, y - cy);
    const angle = Math.floor(
      ((Math.atan2(y - cy, x - cx) + 2 * Math.PI) % (2 * Math.PI)) * 180 / Math.PI
    );
    bins[angle] += r;
    counts[angle]++;
  }
  const heights = bins.map((s, i) => counts[i] > 0 ? s / counts[i] : 0)
                      .filter((_, i) => counts[i] > 0);
  const mean = heights.reduce((a, b) => a + b, 0) / heights.length;
  const variance = heights.reduce((a, b) => a + (b - mean) ** 2, 0) / heights.length;
  return Math.sqrt(variance);
}
```

Now the log-log plot of $W$ vs. $t$ shows the clear $1/3$ slope for clusters larger than ~5,000 cells.

---

## The Wow Moment — Push It

**Comparison of universality classes:** run three models side by side on the same canvas:
1. **Eden model** (random candidate selection): KPZ universality class, $\beta = 1/3$
2. **Random deposition** (column-by-column independent random heights): no correlation, $\beta = 1/2$ (EW universality class)
3. **Ballistic deposition** (particles fall vertically and stick to the first surface or neighbor they touch): also KPZ, $\beta = 1/3$, but different prefactor

All three start from a flat line. After 100,000 time steps, measure $W$ for each. The Eden and ballistic deposition lines lie on top of each other in the log-log plot — same universality class! The random deposition line has a steeper slope ($\beta = 1/2$). This is universality made visual: two completely different microscopic rules, identical macroscopic scaling.

**Tracy-Widom distribution:** after running the Eden model to a very large size (500,000 cells), record the distribution of the radius fluctuations at a fixed time. Show the histogram and overlay the Tracy-Widom GUE distribution (from random matrix theory). They match — this is the deepest result in KPZ universality, confirmed experimentally only in 2010.

---

## The Interactive Demo

- **Speed slider**: 1–10,000 growth events per frame. Default 100.
- **Grid size selector**: 400×400 / 800×800 / 1200×1200.
- **Growth model picker**: Eden (random candidate) / Ballistic deposition / Random deposition. Switches the active model while keeping the cluster.
- **"Show surface" toggle**: highlights the candidate (border) cells in a bright color distinct from filled cells.
- **"Show W(t) plot" toggle**: shows a live log-log plot of surface width vs. time in a 200×150px inset. Draws a reference line with slope 1/3.
- **Angular bins slider**: 36 / 90 / 180 / 360 bins for surface width calculation. Shows how measurement resolution affects the result.
- **Color mode picker**: Solid green / Age gradient (older cells are darker) / Radial depth (hue by distance from center) / Random (each cell assigned a random hue — reveals the branching structure of growth history).
- **"Reset" button**: clears and restarts.
- **"Pause / Resume" button**: freezes the simulation for analysis.
- **"Measure D" button**: fits the current $\log W$ vs. $\log t$ data to a line and displays $\hat{\beta}$ alongside the theoretical $1/3$.
- **Obstacle toggle**: places a circular obstacle in the growth path. The Eden cluster grows around it and re-closes behind it — beautiful fingering. The surface width spikes when the cluster hits the obstacle, then recovers.

---

## Production Notes

**Code structure:** `eden.js` (simulation, Web Worker) + `render.js` (ImageData-based rendering) + `measure.js` (surface width calculation, runs in worker every 100 steps). The worker sends both a diff (new cells added this frame) and the current surface width measurement. The main thread renders the diff to an off-screen ImageData and composites it onto the visible canvas.

**Visual layout:** canvas occupies the full 70% left panel. Right panel: log-log plot (top half) + control sliders (bottom half). The log-log plot has a clearly labeled $\beta = 1/3$ reference line in dashed red. The live data points are small blue circles. When the slope visually matches the reference line, a green checkmark appears with the label "KPZ confirmed."

**Key cinematic moments:**
1. **0:00–0:45** — Cold open montage with punchy cuts synced to a bass hit: mold, rust, bacteria, fire. Same beat pattern as the DLA video intro.
2. **1:30–2:00** — Showing the broken version: the frame rate counter ticks down dramatically. Freeze frame on "2fps" with a red X overlay.
3. **3:30–4:00** — The $W(t)$ measurement fixing. Show the wrong measurement (noisy) vs. the correct RMS angular measurement (clean). Dramatic before/after.
4. **4:30–5:00** — The $\beta = 1/3$ line emerging on the log-log plot as the cluster grows. The slope converges to the reference line over ~30 seconds of video. Satisfying click sound when it converges.
5. **6:00–6:30** — The three-model comparison. Eden and ballistic deposition overlay — the audience gasps. Random deposition diverges. This is the universality demo.
6. **7:00–7:30** — Real photo: the 2010 Takeuchi-Sano liquid crystal experiment image. Overlay the Tracy-Widom curve on the experimental histogram.

**Performance target:** 60fps at 10,000 new cells per frame on a mid-range laptop. This requires the O(1) candidate selection and ImageData-based rendering (not fillRect).

---

## Tags
`eden-model` `KPZ` `surface-growth` `random-growth` `roughness` `universality-class` `cellular-automata` `statistical-mechanics`

---

## Thumbnail

Split canvas: left half shows a rough Eden cluster at 50,000 cells — compact round shape with a clearly jagged, fractal-looking perimeter, colored with an age gradient (dark center → bright green edge). Right half shows the log-log plot: blue data points lying almost perfectly on a red dashed reference line labeled "slope = 1/3." Connecting the two halves: a curved yellow arrow from the rough cluster edge pointing to the plot. Top text in white: **"RANDOM GROWTH"**. Bottom text in white: **"→ UNIVERSAL LAW"**. The slope line on the right is thick and bold — it should be the sharpest visual element in the thumbnail.
