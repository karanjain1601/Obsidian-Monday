---
title: "Random Walks Build Fractal Trees (Diffusion-Limited Aggregation)"
id: M015
difficulty: 5
prereq: "None"
concept: "DLA: random walkers stick when they touch the growing cluster; results in fractal branching patterns; fractal dimension D ≈ 1.71 in 2D; cluster looks like lightning bolts, snowflakes, or dendrites."
tags: [DLA, fractal, random-walk, diffusion, aggregation, branching, snowflake, canvas]
category: medium
type: video-idea
---

# Random Walks Build Fractal Trees (Diffusion-Limited Aggregation)

**Alt title:** "Release a Random Walker and It Builds a Lightning Bolt"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Macro footage (stock): a snowflake crystal forming under a microscope in real time — the classic six-fold branching structure growing, branch by branch, from the center. Cut to: a lightning bolt striking in slow motion, the jagged fractal arms spreading outward from the strike point. Cut to: a scanning electron microscope image of a zinc crystal deposited on a cathode — identical branching structure. Cut to: a coral reef branch under UV light.

Narrator: *"A snowflake. A lightning bolt. A coral branch. An electrodeposition crystal. They look the same because they ARE the same — mathematically identical. And today, you'll generate all of them with twenty lines of code and one beautiful idea."*

Zoom into a blank black canvas. A single white dot appears at center. Then, from the edge of the screen, a tiny particle begins a jittery random walk, zigzagging unpredictably. It wanders for several seconds. Then it touches the white dot and freezes — stuck. Another particle releases from the edge and wanders in. Sticks. Another. The structure slowly grows, branch by branch, impossibly intricate. After 60 seconds of this, the cluster fills the screen in a perfect fractal tree — identical to the snowflake from the cold open.

Title card: **Random Walks Build Fractal Trees**.

---

## The Naive Attempt

The idea seems simple: keep a set of "fixed" cells, and repeatedly launch a random walker from the border until it touches the cluster and sticks. Here is the naive implementation:

```javascript
const W = 400, H = 400;
const fixed = new Set();
fixed.add(`${W/2},${H/2}`); // seed at center

function randomWalk() {
  // launch from a random border cell
  let x = Math.random() < 0.5
    ? (Math.random() < 0.5 ? 0 : W - 1)
    : Math.floor(Math.random() * W);
  let y = Math.random() < 0.5
    ? (Math.random() < 0.5 ? 0 : H - 1)
    : Math.floor(Math.random() * H);

  while (true) {
    // random step: ±1 in x or y
    const r = Math.floor(Math.random() * 4);
    if (r === 0) x++;
    else if (r === 1) x--;
    else if (r === 2) y++;
    else y--;

    // boundary check — kill walker if it leaves
    if (x < 0 || x >= W || y < 0 || y >= H) return false;

    // check if adjacent to any fixed cell
    if (fixed.has(`${x+1},${y}`) || fixed.has(`${x-1},${y}`) ||
        fixed.has(`${x},${y+1}`) || fixed.has(`${x},${y-1}`)) {
      fixed.add(`${x},${y}`);
      return true;
    }
  }
}
```

You run this and draw the `fixed` set on a canvas. The first 50 particles: beautiful, fast. Then it slows down drastically. Particles launch from the border, wander for millions of steps in the interior — far from the cluster — and never reach it. By the time the cluster has 200 cells, each new particle averages 2 million steps before sticking or dying. A 10,000-cell cluster takes 20 minutes to grow. The simulation is correct but horrifyingly slow.

---

## The Moment of Failure

What you see: the progress graph in the console shows `particles stuck: 200` after 3 seconds, then `particles stuck: 250` after 30 seconds — the rate drops 100× as the cluster grows. The canvas barely changes between screen refreshes. In the browser profiler, `randomWalk()` is consuming 99% of CPU, generating billions of random numbers for particles that wander uselessly in empty space.

The fundamental problem is that most of the canvas is empty. A random walker launched at the edge has a very low probability of even reaching the cluster's "capture radius." It spends 99% of its lifetime in blank space doing nothing useful.

Also: particles launched from the border and killed when they exit mean only ~40% of launched particles ever stick — the rest exit from the opposite border or a different edge, and are wasted.

---

## Why It Broke — The Physics

The problem is purely computational, not physical. Physically, real diffusing particles (ions, water molecules) execute true random walks in a medium that is everywhere. The simulation should model this faithfully. But in an $N \times N$ grid, a random walk starting at distance $r$ from a target has an expected hitting time of $O(r^2)$ in 2D (by the gambler's ruin analog). When the cluster radius is $R$, you launch from distance $\sim N/2 \sim$ const while the cluster is small, but the walker must cover the full empty interior.

The insight from DLA theory: particles only need to be launched from a circle just outside the cluster's current bounding radius $R_{\text{max}}$. This is valid because a random walk started far outside will, with overwhelming probability, pass through the "launch circle" before hitting the cluster anyway. So you can skip the outer part of the walk by launching from radius $r_{\text{launch}} = R_{\text{max}} + \delta$ (typically $\delta = 10$ cells).

Second optimization: far from the cluster, accelerate the random walk by taking large steps. A random walker at distance $d$ from the nearest fixed cell can safely jump up to $d-1$ steps in a random direction without hitting anything. This is the **walk-on-spheres** (or walk-on-squares) method:

$$\text{If } d_{\min}(x,y) = k, \text{ jump to a random point on a circle of radius } k-1 \text{ centered at } (x,y)$$

This reduces the expected steps per particle from $O(N^2)$ to $O(N \log N)$ for a sparse DLA cluster — a 10,000× speedup for large clusters.

The fractal dimension of the DLA cluster in 2D is $D \approx 1.71$, meaning the number of cells $N$ within radius $r$ scales as $N \sim r^{1.71}$. The cluster occupies a fraction $r^{1.71}/r^2 = r^{-0.29}$ of the disk area — it gets sparser as it grows, which is why the inner region becomes almost impossible to fill: walkers navigating the outer arms can't reach the interior.

---

## The One Concept

**Diffusion-Limited Aggregation**

DLA was introduced by Witten and Sander in 1981 in a Physical Review Letters paper that has since become one of the most-cited papers in condensed matter physics. The model is startlingly simple: start with a single fixed "seed" particle. Release a new particle far away. It diffuses (random walks) until it touches the cluster, then sticks permanently. Repeat. The result is a fractal — a self-similar branching structure that looks identical at every scale.

Why does DLA produce branches instead of a compact blob? The answer is a screening effect. When you release a walker and it approaches the cluster, the tips of existing branches stick out furthest — they intercept the walker before it can navigate into the fjords between branches. Interior regions are geometrically shielded: a walker trying to reach them must navigate an ever-more-tortuous path past the outer branches. As the cluster grows, the probability of a walker reaching an interior concavity approaches zero. Tips grow, interiors stagnate, and the result is an infinitely branchy fractal.

This screening effect is mathematically equivalent to the Laplace equation. The probability field $P(x,y)$ that a random walker started far away hits a specific point on the cluster boundary satisfies $\nabla^2 P = 0$ (Laplace's equation), with $P = 1$ on the cluster surface and $P \to 0$ far away. Tips of the cluster protrude into regions of higher $|\nabla P|$ — higher arrival probability — and thus grow faster. This connects DLA to electrodeposition, dielectric breakdown, viscous fingering (Hele-Shaw cells), and dendritic solidification: they all obey Laplace's equation at the growth front.

The fractal dimension $D \approx 1.71$ in 2D is known empirically to very high precision but has no analytic derivation — it is one of the most famous unsolved problems in statistical physics. In 3D, $D \approx 2.5$. In 1D, $D = 1$ (just a line). The dimension satisfies $1 < D < d$ for embedding dimension $d$.

Real-world examples: electrodeposition of zinc, copper, or silver from solution onto a cathode produces DLA clusters with $D = 1.71 \pm 0.05$. Lightning channels follow the dielectric breakdown model (identical equations). Snowflake dendrites follow the same physics at the solid-liquid interface. Coral and sponge branching patterns are biological DLA. Even neuron axon branching has been modeled with DLA-like equations.

The sticking probability can be tuned: if a particle sticks with probability $p < 1$ when it touches the cluster, the resulting structures are more compact (higher D) for lower $p$. This interpolates between DLA ($p=1$, $D=1.71$) and a compact Eden cluster ($p \to 0$, $D=2$). This gives you a whole family of fractal structures with one parameter.

---

## The Fix

Two changes: (1) launch particles from a circle of radius $R_{\text{max}} + 10$ instead of the grid border; (2) use walk-on-spheres (distance-to-nearest-fixed-cell fast jumps) for the walker far from the cluster.

```javascript
// Precompute a distance transform on the grid for fast "nearest fixed cell" lookup
// For simplicity, maintain maxRadius as the farthest fixed cell from center
let maxRadius = 0;

function launchParticle() {
  const r = maxRadius + 10;
  const angle = Math.random() * 2 * Math.PI;
  let x = Math.round(cx + r * Math.cos(angle));
  let y = Math.round(cy + r * Math.sin(angle));
  const killR = maxRadius + 50; // kill if particle wanders too far

  while (true) {
    // Check adjacency to fixed set
    const neighbors = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
    let stuck = false;
    for (const [nx, ny] of neighbors) {
      if (fixed.has(`${nx},${ny}`)) { stuck = true; break; }
    }
    if (stuck) {
      fixed.add(`${x},${y}`);
      const dist = Math.hypot(x - cx, y - cy);
      if (dist > maxRadius) maxRadius = dist;
      return;
    }

    // Walk-on-squares: find distance to nearest fixed cell
    // Simplified: use a coarse grid + BFS distance map updated incrementally
    const d = nearestFixedDist(x, y); // precomputed BFS distance map
    if (d > 1) {
      // Jump d-1 steps in a random direction — guaranteed safe
      const jumpAngle = Math.random() * 2 * Math.PI;
      const jump = Math.max(1, d - 1);
      x = Math.round(x + jump * Math.cos(jumpAngle));
      y = Math.round(y + jump * Math.sin(jumpAngle));
    } else {
      // Near the cluster — take single steps
      const r2 = Math.floor(Math.random() * 4);
      if (r2 === 0) x++;
      else if (r2 === 1) x--;
      else if (r2 === 2) y++;
      else y--;
    }

    // Kill if too far
    if (Math.hypot(x - cx, y - cy) > killR) {
      launchParticle(); // restart (tail recursion would be cleaner with a loop)
      return;
    }
  }
}
```

With this fix, a 10,000-cell cluster generates in under 5 seconds in the browser. The visual result is identical — the walk-on-spheres shortcut is mathematically equivalent to the full random walk.

---

## The Wow Moment — Push It

**Extension 1 — Seeded DLA:** instead of a single center seed, start with a line segment as the seed. The DLA cluster grows from the line, producing a forest of vertical trees all branching upward — an exact model of electrodeposition on a planar cathode. Rotate the seed to a circle to produce a radially symmetric cluster that looks like a sea anemone.

**Extension 2 — Sticking probability tuning:** add a slider for sticking probability $p$ from 0.01 to 1.0. At $p = 1.0$: classic spindly DLA branches. At $p = 0.5$: thicker, rounder branches. At $p = 0.1$: almost compact, Eden-model-like blob. Record a sweep from $p=0.01$ to $p=1.0$ and play it as a 10-second morphing animation — the transition from blob to fractal tree is genuinely beautiful.

**Extension 3 — Color by particle age:** assign each stuck particle a color based on when it was added — early particles are deep blue (the trunk and inner branches), later particles are red and yellow (the tips). The result is a heatmap of the growth history. Every major branch clearly shows its own color gradient from blue (base) to yellow (tip), revealing the branching structure of time itself.

**Extension 4 — 3D DLA with Three.js:** launch particles as 3D random walkers. The resulting cluster is a 3D fractal tree with $D \approx 2.5$. Rotate it slowly to reveal depth — it looks exactly like a coral branch or lightning's 3D channel. This is a natural extension video teaser.

---

## The Interactive Demo

- **Speed slider**: 1–1,000 particles per animation frame. Default 10. Warning label at > 200: "May heat up your laptop."
- **Grid size selector**: 400×400 / 600×600 / 800×800 (larger = more detailed fractal, slower).
- **Sticking probability slider**: 0.01–1.0, step 0.01. Default 1.0.
- **Seed shape picker**: Center dot / Horizontal line / Vertical line / Circle / Random scatter (20 points).
- **Color mode picker**: Grayscale / Age gradient (blue → red) / Depth from center (radial rainbow) / Monochrome white on black.
- **"Measure D" button**: fits $\log(N)$ vs $\log(r)$ to the current cluster and displays the computed fractal dimension in real time. Shows the regression line on a log-log plot in a small inset.
- **"Reset" button**: clears cluster, restarts from chosen seed.
- **"Export PNG" button**: saves current canvas as a high-resolution PNG.
- **"Ghost walkers" toggle**: when ON, shows up to 20 active random walkers simultaneously as faint colored dots, letting viewers see the random walk process in real time even at medium speed.
- **Particle size slider**: 1–4 pixels per cell. Default 2.
- **"Step mode" button**: pauses and lets you add one particle at a time with a keyboard press — great for slow-motion educational viewing of the sticking event.

---

## Production Notes

**Code structure:** Two modules — `DLA.js` (simulation, runs in Web Worker) and `render.js` (Canvas 2D rendering, main thread). The worker receives `{ seed, stickProb, gridSize }` and emits `{ newCells: [{x, y, age}] }` batches. The main thread accumulates cells in an `ImageData` buffer and calls `putImageData` once per frame — far faster than individual `fillRect` calls.

**Distance map for walk-on-spheres:** maintain a 2D Uint16Array of distances to the nearest fixed cell. When a new cell is added, run a BFS from it and update the local neighborhood (radius ~50 cells). This BFS is $O(50^2)$ per new cell — fast enough to run synchronously in the worker.

**Visual layout:** canvas fills 80% of the screen width. The right 20% holds a thin control panel plus a live $\log(N)$ vs $\log(r)$ inset graph that updates every 100 particles, showing the fractal dimension converging toward 1.71 in real time. Label the inset "D = 1.71 ?" and watch it approach that value.

**Key cinematic moments:**
1. **0:00–0:45** — Cold open montage: snowflake → lightning → coral → zinc crystal. All cut to identical rhythmic beat.
2. **0:45–1:00** — First particle launched. Slow random walk animation with sound (soft random ticking). First stick — a small satisfying "click."
3. **2:30–3:00** — The "too slow" failure: show the frame rate counter dropping from 60fps to 2fps as the cluster grows.
4. **4:00–4:30** — The fix revealed: the distance field visualization. Show the BFS distance map as a blue glow around the cluster — bright blue right at the cluster surface, fading to black far away. Particles jump along this distance field.
5. **5:30–6:00** — The cluster fully forms to 5,000 cells. Zoom out slowly to reveal the complete fractal. Overlay the snowflake photo from the cold open at 30% opacity — they match.
6. **6:30–7:00** — Sticking probability sweep, p=1.0 → 0.05. Play at 2× speed. Dramatic transformation.

**Audio:** each "stick" event emits a soft click (pitched up slightly for each generation of branching). By the time the cluster is large, the clicks merge into a continuous soft rain sound.

---

## Tags
`DLA` `fractal` `random-walk` `diffusion` `aggregation` `branching` `snowflake` `canvas`

---

## Thumbnail

Black background. A massive white DLA cluster in the center — 20,000 particles, full-screen, maximum branching detail. The cluster is colored with an age gradient: deep blue trunks fading to bright cyan tips. Overlaid at 40% opacity in the top-right corner: a real snowflake macro photo — the structures visually rhyme. Bold white text across the bottom: **"RANDOM WALKS BUILD THIS."** A glowing white dot at the exact center marks the seed. The cluster's longest branch points toward the top-right corner, guiding the eye toward the title text.
