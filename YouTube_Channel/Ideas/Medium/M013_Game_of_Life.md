---
title: "Life From Three Rules: Conway's Game of Life at Scale"
id: M013
difficulty: 5/10
prereq: "None"
concept: "Conway's Game of Life: 2D cellular automaton with birth/survival/death rules; Turing complete; emergent patterns: still lifes, oscillators, gliders, glider guns; complexity from simplicity. Implement on GPU for 1M+ cells at 60fps."
tags: [game-of-life, cellular-automata, emergence, turing-complete, GPU, WebGL, complex-systems, glider]
category: medium
type: video-idea
---

# Life From Three Rules: Conway's Game of Life at Scale

**Alt title:** "Three Rules, Infinite Complexity: Conway's Game of Life on the GPU"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

A 4096×4096 grid, every cell randomly initialized. Press play. The chaos settles. By frame 50, scattered patterns have crystallized: still lifes (blocks, beehives, boats), oscillators blinking, and here and there — gliders, moving diagonally across the grid. By frame 200: a sparse population of gliders crossing each other. By frame 500: gliders collide, annihilate, produce new patterns.

Zoom in on one corner: a **Gosper Glider Gun** is spontaneously producing gliders at 30-frame intervals. Every 30 frames a new glider shoots out, travels across the grid, collides with something, and the collision produces two new guns — a chain reaction of reproduction. The whole screen is now alive with traveling gliders and collisions.

"Conway's Game of Life was designed in 1970 as the simplest possible cellular automaton that's interesting. Three rules. It turned out to be Turing complete — you can build a working computer inside it. We're going to run it on a billion cells. But first, our naive CPU implementation will run at 2 fps. We need the GPU."

---

## The Naive Attempt

The obvious JavaScript implementation: a 2D array, count neighbors, apply rules.

```javascript
const N = 1024; // 1024×1024 grid
const grid = new Uint8Array(N * N);
const next = new Uint8Array(N * N);

// Initialize randomly
for (let idx = 0; idx < N*N; idx++) {
  grid[idx] = Math.random() < 0.35 ? 1 : 0;
}

function step() {
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const idx = i + j * N;
      // Count live neighbors (Moore neighborhood, toroidal boundary)
      let count = 0;
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          if (di === 0 && dj === 0) continue;
          const ni = (i + di + N) % N;
          const nj = (j + dj + N) % N;
          count += grid[ni + nj * N];
        }
      }
      // Conway's rules:
      // Live cell survives with 2 or 3 neighbors
      // Dead cell is born with exactly 3 neighbors
      if (grid[idx] === 1) {
        next[idx] = (count === 2 || count === 3) ? 1 : 0;
      } else {
        next[idx] = (count === 3) ? 1 : 0;
      }
    }
  }
  grid.set(next);
}

// Draw grid to canvas: O(N²) canvas operations
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      if (grid[i + j * N]) {
        ctx.fillRect(i, j, 1, 1); // one fillRect per live cell!
      }
    }
  }
}
```

For N = 1024 (1M cells): the step function runs in ~150ms (about 6 fps). The draw function takes another ~200ms. Total: ~2-3 fps. For N = 4096 (16M cells): step = ~2.5 seconds per frame. The simulation is too slow to watch. Worse: the draw function with individual `fillRect` calls is catastrophically slow — even 1M individual fillRect calls on a 2D canvas takes several seconds.

---

## The Moment of Failure

The canvas renders jerkily at 2-3 fps for N = 1024. Every mouse drag is laggy. At N = 4096, the page freezes entirely — the JavaScript main thread is blocked by the step function, preventing any user interaction, and the browser's "Script is causing the page to be slow" warning appears. The grid is basically unrenderable.

Two separate bottlenecks: (1) the computation of 8-neighbor sums for 16M cells in JavaScript, and (2) the rendering of 16M pixels to canvas. Both are inherently parallelizable — every cell's next state depends only on its 8 neighbors and is independent of every other cell's next state. This is the definition of a problem suited for GPU parallelism.

A secondary issue: the draw function using individual `fillRect` calls is the worst possible approach for dense grids. Even if the step function were fast, the draw function would bottleneck at ~100,000 individual canvas operations per second — far too slow for 1M+ live cells.

---

## Why It Broke — The Physics

The Game of Life's rules are local (only the 8-cell Moore neighborhood) and synchronous (all cells update simultaneously based on the previous state). This means: every cell's computation is INDEPENDENT of every other cell's in a given step. The computation is **embarrassingly parallel** — no data dependencies between cells in a step (only between steps).

For a 4096×4096 grid: 16,777,216 cell updates per step. A modern JavaScript engine can do about 100-300M simple integer operations per second in a tight loop. For 16M cells with 8 neighbor lookups each: ~128M memory accesses per step → about 0.5-1 second per step on a single CPU core.

A modern GPU has thousands of shader cores running in parallel. Each core can handle one or more cells. A WebGL shader can update all 16M cells in approximately 1-2 ms — a 500× speedup. This is the GPU's home turf: massively parallel simple operations on a 2D texture (the grid IS a texture; each pixel is a cell).

Conway's rules for a cell with value v (0 or 1) and neighbor sum n:
- next = (n == 3) || (v == 1 && n == 2) ? 1 : 0

This fits in 3 lines of GLSL. The neighbor sum can be computed by sampling the 8 surrounding pixels from the grid texture. Total shader complexity: 8 texture reads + 1 integer comparison + 1 write. This is exactly the kind of compute that GPUs excel at.

Conway's Game of Life rules:
- **Survival**: a live cell with 2 or 3 live neighbors survives to the next generation
- **Birth**: a dead cell with exactly 3 live neighbors becomes alive
- **Death**: all other cases (live cell with 0, 1, or 4+ neighbors dies; dead cell with 0, 1, 2, 4+ stays dead)

These three rules, applied to all cells simultaneously, produce: still lifes (patterns that don't change), oscillators (patterns that repeat with period > 1), spaceships (patterns that translate across the grid), and guns (patterns that periodically emit spaceships). The existence of guns (which Gosper discovered in 1970, winning Conway's prize of $50) implies the population can grow without bound from finite initial conditions. Guns also enable the construction of logical gates (AND, OR, NOT) from glider collisions — making the whole system Turing complete.

---

## The One Concept

**Conway's Game of Life** is a 2D cellular automaton devised by the British mathematician John Horton Conway in 1970. It is played on an infinite grid of square cells, each alive or dead. The state of each cell at the next generation is determined by exactly three rules applied to the eight surrounding cells. Despite this extreme simplicity, the resulting dynamics exhibit extraordinary richness and complexity.

The Life universe is **Turing complete**: it is possible to construct a universal Turing machine within the Game of Life using patterns of cells. This was proved by constructing working logic gates (AND, OR, NOT) from glider collisions, then wires (streams of gliders), and finally memory (guns emitting gliders at controlled rates). More recently, a working Game of Life cellular automaton has been implemented WITHIN the Game of Life — a self-referential computation running at a different scale. These constructions typically require grids of tens of thousands of cells, running for millions of generations.

**Emergent complexity** is the central theme: none of the rich behaviors (gliders, guns, self-replication) are programmed into the rules. They emerge from the interaction of simple rules at a local scale. A glider is not "in" the rules — a glider is a stable pattern of cell states that propagates. A gun is a stable pattern that periodically destabilizes, producing gliders. Self-replicating patterns exist (Langton's loop, for example) — patterns that produce identical copies of themselves and can potentially be thought of as computational life.

The taxonomy of Life patterns:
- **Still lifes**: patterns that don't change. Simplest: the 2×2 block (4 cells, each has exactly 3 live neighbors). Over 600 known still lifes with ≤ 24 cells.
- **Oscillators**: patterns that repeat with period T > 1. Period 2: the blinker (3 cells in a row oscillates to 3 cells in a column). Period 3: the pulsar (48 cells). The highest known period oscillator has period 1,000,000+ (constructed deliberately). The problem of whether every period is achievable is open.
- **Spaceships**: patterns that translate. Glider: 5 cells, moves diagonally, period 4 (travels 1 diagonal cell every 4 generations). The Lightweight Spaceship (LWSS): moves horizontally. Others move at various rational fractions of the speed of light (c = 1 cell/generation is the maximum).
- **Guns**: patterns that periodically emit spaceships. Gosper Glider Gun: 36 cells, emits a glider every 30 generations. When discovered in 1970, it proved the population of a Life universe can grow unboundedly from finite initial conditions.
- **Methuselahs**: small patterns with very long transient lifetimes before stabilizing. The R-pentomino (5 cells) takes 1,103 generations to stabilize. The Acorn (7 cells) takes 5,206 generations, filling a large region with 633 live cells.

The GPU implementation makes it possible to run Life on the scale where emergent structures become visually overwhelming: a 4096×4096 grid with millions of simultaneous gliders, oscillators, and collisions. At 60 fps, the GPU updates 1 billion cells per second — beyond the capability of any single-threaded CPU by a factor of 1000.

A profound philosophical observation: the Game of Life demonstrates that **computational universality** — the ability to simulate any computation — can arise from the simplest possible local interactions. If the universe itself can be modeled as a cellular automaton (a conjecture of Zuse, Wolfram, and others), then the complexity of physics could emerge from rules as simple as Conway's three. This is speculative, but the Game of Life makes the speculation vivid and concrete.

---

## The Fix

Implement the Game of Life as a WebGL fragment shader using two textures (ping-pong rendering): one texture holds the current state, the shader reads it and writes the next state to a second texture, then the two are swapped.

```javascript
// WebGL Game of Life — full implementation

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2');

const N = 4096; // 4096×4096 = 16M cells

// Vertex shader: draw a fullscreen quad
const vertSrc = `#version 300 es
  in vec2 a_pos;
  out vec2 v_uv;
  void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0, 1);
  }`;

// Fragment shader: Conway's Game of Life rules
const fragSrc = `#version 300 es
  precision highp float;
  uniform sampler2D u_grid;
  uniform vec2 u_resolution;
  in vec2 v_uv;
  out vec4 outColor;

  void main() {
    vec2 texel = 1.0 / u_resolution;
    float self = texture(u_grid, v_uv).r;

    // Count live neighbors (8-connected Moore neighborhood, toroidal wrap)
    float n = 0.0;
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        if (dx == 0 && dy == 0) continue;
        vec2 offset = vec2(float(dx), float(dy)) * texel;
        // Toroidal wrap handled by GL_REPEAT texture wrapping
        n += texture(u_grid, v_uv + offset).r;
      }
    }

    // Conway's rules
    float next = 0.0;
    if (self > 0.5) {
      // Live cell survives with 2 or 3 neighbors
      next = (n > 1.5 && n < 3.5) ? 1.0 : 0.0;
    } else {
      // Dead cell born with exactly 3 neighbors
      next = (n > 2.5 && n < 3.5) ? 1.0 : 0.0;
    }
    outColor = vec4(next, next, next, 1.0);
  }`;

// Initialize textures
function initTexture(data) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, N, N, 0, gl.RED, gl.UNSIGNED_BYTE, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); // toroidal
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return tex;
}

// Initialize: random grid
const initData = new Uint8Array(N * N);
for (let i = 0; i < N * N; i++) initData[i] = Math.random() < 0.35 ? 255 : 0;

let texA = initTexture(initData);
let texB = initTexture(null); // empty texture for output

// Framebuffer for rendering to texB
const fbo = gl.createFramebuffer();

function step() {
  // Render: texA (current) → texB (next) via GoL shader
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texB, 0);
  gl.viewport(0, 0, N, N);
  gl.useProgram(golProgram);
  gl.uniform1i(gl.getUniformLocation(golProgram, 'u_grid'), 0);
  gl.uniform2f(gl.getUniformLocation(golProgram, 'u_resolution'), N, N);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texA);
  gl.drawArrays(gl.TRIANGLES, 0, 6); // fullscreen quad

  // Swap textures
  [texA, texB] = [texB, texA];
}

function draw() {
  // Draw texA directly to canvas using a display shader (can add colors, zoom)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.useProgram(displayProgram);
  gl.bindTexture(gl.TEXTURE_2D, texA);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Main loop
function animate() {
  step();  // ~1-2ms for 16M cells
  draw();  // ~1-2ms (GPU blit)
  requestAnimationFrame(animate);
}
animate(); // → 60 fps on a modern GPU
```

Performance: for N = 4096 (16M cells), each `step()` call takes approximately 1-2ms on a modern GPU (GTX 1060 or equivalent). Drawing takes another 1-2ms. Total: 60fps easily. For N = 1024: practically free — 60fps on any WebGL-capable device including mobile.

---

## The Wow Moment — Push It

**Gosper Glider Gun farm:** Pre-load a 4096×4096 grid with a 10×10 array of Gosper Glider Guns (100 guns total). Each gun emits a glider every 30 frames. Gliders from different guns collide, producing eaters, block layers, and occasionally new guns. The whole grid becomes a living machine. Run at 60fps — 3,600 generations per minute. At generation 10,000: the grid has reached a quasi-stable state with complex persistent structures.

**Rule B3/S23 → B3/S12345 → B3/S2 sweep:** Life runs on "B3/S23" (Birth with 3 neighbors, Survive with 2 or 3). The WebGL shader makes it trivial to swap rules. B3/S12345 produces "2×2": explosive growth, fills the grid. B3/S2 produces "Seeds": every live cell dies next generation, but some create live cells around them — chaotic flashing. Show a live rule-switcher: drag sliders for B-set and S-set, watch the grid's behavior transform.

**Self-replicating patterns:** Pre-load a Langton's self-replicating loop (a pattern that creates a copy of itself). Run it. After ~100 generations: two copies. After ~500: four copies. After ~2000: a cellular colony of identical copies spreading outward. The boundary between the self-replicating colony and the empty space has a fractal structure.

**Hashlife visualization:** Implement HashLife algorithm (a quadtree-based algorithm that memoizes patterns) and show it computing Life at generation 2^128 (a number larger than the age of the universe in nanoseconds) instantly. The hashlife speedup is super-exponential for periodic patterns. Show the generation counter jumping by 2^n each step.

**Music:** Map live cell density in a 16-column grid to musical notes. The oscillating patterns create rhythms — the blinker is a 2-beat pattern, the pulsar is a 3-beat pattern. Real-time sonification of Conway's Life sounds like a minimalist Philip Glass piece.

---

## The Interactive Demo

- **Grid size** selector: 512×512 / 1024×1024 / 2048×2048 / 4096×4096 / 8192×8192
- **Initialization** selector: Random (% alive) | Blank | Gosper Gun | R-pentomino | Acorn | Custom pattern (paste RLE code)
- **B/S rule sliders**: two multi-select toggles (0-8) for Birth set and Survival set — try any of 2^18 possible rules
- **Speed** slider: 1 fps (one-at-a-time) to max fps (unlimited)
- **Generations counter**: live display with elapsed simulation time
- **Zoom and pan**: smooth zooming into/out of the grid (display shader handles the zoom)
- **Pattern dropper**: click to paste a pattern from the built-in library (all classic patterns included: glider, LWSS, guns, methuselahs)
- **Population plot**: live graph of alive cells vs generation (shows stabilization, oscillation, or growth)
- **Statistics panel**: live count of still lifes, oscillators (estimated via comparison with 2 generations ago), and spaceships (tracked via centroid motion)
- **Color mode**: Binary (black/white) | Age (older cells brighter) | Activity (cells that changed recently are bright, stable cells dim) | Heat map (rolling average of cell births)

---

## Production Notes

**Code to show on screen:**
- The broken naive code — step() runs in 150ms, timing it explicitly with `performance.now()`
- The GPU version: vertSrc and fragSrc — emphasize the GLSL fragment shader is just 8 texture reads + one comparison: "the entire Game of Life in 15 lines of GLSL"
- The ping-pong texture swap — [texA, texB] = [texB, texA] — this is the key data flow insight
- The GL_REPEAT texture parameter — one line that implements toroidal boundary conditions for free

**Visual layout:**
- Full canvas, black cells on white (or white on black — user-selectable) for maximum clarity
- Overlay: generation counter in the top-left, fps in the top-right, alive cell count bottom-left
- Right panel (collapsible): the population plot and rule selector
- Zoom: allow up to 32× zoom into the grid with smooth bilinear interpolation

**Key cinematic moments:**
- 00:30 — 4096×4096 grid at 60fps from cold start — 500 generations in 8 seconds
- 01:30 — Naive code: time it: "frame 1 took 150ms. Frame 2: 148ms. We're doing 6 fps."
- 03:00 — WebGL shader: paste the 15-line GLSL — run it: instant 60fps for 16M cells
- 04:00 — Zoom into a glider in motion — slow to 1fps, watch it move one step at a time
- 05:00 — Gosper Gun: pre-load, run at full speed — 100 guns simultaneously producing gliders
- 06:00 — Rule switcher: B3/S23 → B36/S23 (HighLife, also has replicators) → B3/S12345 (explosive)
- 07:00 — Langton's self-replicating loop: the colony spreading outward
- 08:00 — "In 1982, a mathematician proved you can compute pi, simulate a Turing machine, and run any algorithm you want — inside this simple grid of cells"
- 08:30 — Sonification: Life as music — the oscillators create a rhythm, gliders add melody
- 09:00 — End with Hashlife: "Golly (an open-source Life simulator using Hashlife) computed the state of a Life pattern at generation 2^128 in one second. We're at generation 10,000. Think about that."

---

## Tags
`game-of-life` `cellular-automata` `emergence` `turing-complete` `GPU` `WebGL` `complex-systems` `glider`

---

## Thumbnail

A 4096×4096 Game of Life grid at a zoomed-out view — thousands of patterns visible as a dense pixel-art texture (white on black). In the center, a region is zoomed into at 4× showing a clearly recognizable Gosper Glider Gun in action — a stream of gliders visible leaving the gun. Bold white text overlaid: "16 MILLION CELLS" in the top half, "60 FPS" below it in bright green. Bottom strip: "3 RULES. TURING COMPLETE." in yellow. The word "GPU" appears as a badge in the bottom-right corner.
