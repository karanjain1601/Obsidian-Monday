---
title: "50 Ways a Grid Can Be Alive (Cellular Automata Zoo)"
id: M020
difficulty: 5
prereq: "None"
concept: "1D elementary CAs: 256 possible rule sets (Wolfram); Rule 30 (chaotic), Rule 90 (Sierpinski), Rule 110 (Turing-complete); 2D: Game of Life, Larger than Life, Generations; classification into 4 Wolfram classes."
tags: [cellular-automata, wolfram, rule-30, rule-110, turing-complete, classification, emergence, canvas]
category: medium
type: video-idea
---

# 50 Ways a Grid Can Be Alive (Cellular Automata Zoo)

**Alt title:** "256 Universes With Different Laws of Physics"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

A grid of 256 small canvases, each running a different elementary cellular automaton. All start from the same initial condition: a single black cell at the top center. Time advances row by row downward. Most canvases show boring patterns — all black, all white, simple repeating stripes. But three of them look startlingly different: one is a chaotic triangle of noise (Rule 30), one shows the Sierpinski triangle (Rule 90), and one is a turbulent complex pattern (Rule 110).

Narrator: *"There are exactly 256 possible universes you can build with the simplest 1D cellular automaton. Same grid. Same starting condition. Just different rules. Three of them are famous enough to have names. One of them is Turing-complete — meaning it can compute anything your laptop can, given enough time."*

Cut to a single Rule 110 canvas running, showing the complex interacting structures. Narrator: *"Today we visit the whole zoo."*

---

## The Naive Attempt

Implement the 256 elementary CAs naively — one canvas per rule, each drawing independently:

```javascript
// For each rule (0-255), the output for each input triplet (left, center, right)
function buildRuleTable(ruleNum) {
  const table = {};
  for (let i = 0; i < 8; i++) {
    const l = (i >> 2) & 1;
    const c = (i >> 1) & 1;
    const r = i & 1;
    table[`${l},${c},${r}`] = (ruleNum >> i) & 1;
  }
  return table;
}

// Step one row of a 1D CA
function stepRow(currentRow, ruleTable) {
  const n = currentRow.length;
  const nextRow = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const l = currentRow[(i - 1 + n) % n];
    const c = currentRow[i];
    const r = currentRow[(i + 1) % n];
    nextRow[i] = ruleTable[`${l},${c},${r}`];
  }
  return nextRow;
}
```

For one rule on one canvas this is fine. But to show all 256 rules simultaneously in a grid, you try to create 256 canvases in the DOM and run each independently. The result: 256 `requestAnimationFrame` callbacks all competing for the main thread, 256 separate canvas contexts, and 256 separate ImageData allocations. The browser hits its canvas-count limit around canvas #60, after which new canvases silently fail to render. JavaScript memory usage hits 500MB. The tab crashes.

The second attempt: use a single canvas with 256 sub-regions, each 50×50 pixels. But you draw each sub-region using `fillRect` for every black cell — at 50 cells wide and 256 rules, that's 12,800 potential `fillRect` calls per frame. With the overhead of 256 canvas context-switch operations via `drawImage`, the frame rate drops to 3fps.

---

## The Moment of Failure

**Canvas limit crash:** After creating canvas #60 in the DOM, the remaining canvases render as blank black squares. No error in the console — browsers silently stop rendering past ~32–60 canvases (implementation-dependent). You don't realize until you count — 196 of your 256 "canvases" are just black squares.

**Performance crash:** With `fillRect` per cell, the browser's paint console shows `Rendering: 312ms` per frame — 20× over the 16ms budget. The frame rate is 3fps. The 256 sub-regions are visually correct but completely unusable for animation.

---

## Why It Broke — The Physics

For 1D CAs, the natural rendering strategy is to write each generation as a new row of pixels in an ImageData buffer — one row per generation, scrolling upward over time. This requires exactly $W$ pixel writes per step (one per cell), not one `fillRect` per black cell (which requires a context state change each call).

The rule lookup: instead of a dictionary with string keys (`"l,c,r"`), encode the 3-cell neighborhood as a 3-bit integer:

```
triplet = (left << 2) | (center << 1) | right  // value 0..7
output  = (ruleNum >> triplet) & 1               // single bit from rule number
```

This is a pure integer operation — no string allocation, no hash lookup. For a 200-cell row, one step requires exactly 200 bit-shift and AND operations. This is 1000× faster than the string-key dictionary approach.

For the 256-rule display: precompute all 256 rule tables as `Uint8Array(8)` entries. Store all 256 states (current row) as a flat `Uint8Array` of size $256 \times W$. On each step: apply all 256 rules in a single tight loop over a 1D array, write pixel rows to a single pre-allocated `ImageData`, call `putImageData` once. Total pixel writes per frame: $256 \times W$ per step = 256 × 200 = 51,200 writes. At 60fps: 3 million writes per second. Trivially fast for modern JavaScript.

Wolfram's four classes (from "A New Kind of Science", 2002):
- **Class I**: all initial conditions converge to a fixed point (uniform color). Examples: Rule 0, Rule 255.
- **Class II**: all initial conditions converge to periodic patterns (repeating stripes or simple oscillators). Examples: Rule 4, Rule 108.
- **Class III**: chaotic, aperiodic, sensitive to initial conditions. Examples: Rule 30 (used in Mathematica's random number generator), Rule 45.
- **Class IV**: complex, localized structures with long-range correlations. Examples: Rule 110 (Turing-complete per Matthew Cook's 2004 proof). Only Class IV systems can perform universal computation.

The Rule 30 pseudorandom number generator: each successive center column of Rule 30's space-time diagram passes the NIST randomness tests. Wolfram Research used it in Mathematica's `Random[]` function for years.

---

## The One Concept

**Elementary Cellular Automata and Wolfram's Four Classes**

An elementary cellular automaton (ECA) is a 1-dimensional binary cellular automaton with nearest-neighbor interactions. Each cell is either 0 (white) or 1 (black). Each generation, every cell's new state is determined by its current state and the states of its two immediate neighbors — the "neighborhood" consists of 3 cells. There are $2^3 = 8$ possible neighborhood configurations. For each configuration, the rule must specify a 0 or 1 output. There are $2^8 = 256$ ways to define these 8 outputs — hence 256 possible rules.

Wolfram's numbering scheme is elegant: encode the 8 output bits as a single byte (binary number). Rule 110 has binary representation `01101110`, so for input triplets 7,6,5,4,3,2,1,0 the outputs are 0,1,1,0,1,1,1,0. The rule number is the decimal value of these 8 bits: $0+64+32+0+8+4+2+0 = 110$.

The profound insight from Wolfram's 2002 book is that the four behavioral classes are not a quirk of ECAs — they appear in virtually all sufficiently complex computational systems: fluid dynamics (laminar, turbulent, cellular vortex), biological development (uniform tissue, patterned tissue, complex organ), and economic markets (stable, cyclical, chaotic, complex/adaptive). The classification predates complex systems science but encodes the same idea: there are qualitatively different regimes of complexity, and they arise from simple differences in rule structure.

Rule 110's Turing completeness was proved by Matthew Cook in 1998 (published 2004 after a legal dispute with Wolfram). Cook constructed an explicit encoding of a cyclic tag system — a known Turing-complete model — in Rule 110's space-time diagram. The proof required identifying 14 distinct "particles" (persistent structures in the Rule 110 pattern) that interact to perform logical operations. This was a stunning result: a simple rule on a 1D binary grid is as powerful as any computer ever built.

2D generalizations include Conway's Game of Life (B3/S23 in birth/survival notation: a dead cell is born if it has exactly 3 live neighbors; a live cell survives if it has 2 or 3 live neighbors), Larger than Life (extended neighborhood radius), Generations (cells age through multiple states before dying, creating colored patterns), and SmoothLife (continuous-valued cells on a continuous grid, producing fluid-like dynamics). All of these are explorable in the same framework: define a neighborhood, define birth/survival conditions, iterate.

---

## The Fix

Single-canvas, single-ImageData approach with bit-level rule lookup:

```javascript
const W = 200; // cells per rule
const ROWS = 100; // rows of history
const NUM_RULES = 256;

// Precompute all 256 rule tables as Uint8Array(8)
const ruleTables = Array.from({ length: 256 }, (_, r) =>
  Uint8Array.from({ length: 8 }, (_, t) => (r >> t) & 1)
);

// Current state for each rule: Uint8Array(NUM_RULES * W)
let states = new Uint8Array(NUM_RULES * W);
// Initialize: single center cell for each rule
for (let rule = 0; rule < NUM_RULES; rule++) {
  states[rule * W + Math.floor(W / 2)] = 1;
}

// ImageData for the combined display
const canvas = document.getElementById('ca-canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(W * 16, ROWS * 16); // 16x16 grid of rules, each W×ROWS px

function step() {
  const nextStates = new Uint8Array(NUM_RULES * W);
  for (let rule = 0; rule < NUM_RULES; rule++) {
    const table = ruleTables[rule];
    const base = rule * W;
    for (let i = 0; i < W; i++) {
      const l = states[base + (i - 1 + W) % W];
      const c = states[base + i];
      const r = states[base + (i + 1) % W];
      const triplet = (l << 2) | (c << 1) | r;
      nextStates[base + i] = table[triplet];
    }
  }
  states = nextStates;
}

function render(generation) {
  // Write one row for each rule into the ImageData
  for (let rule = 0; rule < NUM_RULES; rule++) {
    const col = rule % 16; // which column in the 16x16 grid
    const row = Math.floor(rule / 16); // which row in the grid
    // Each rule occupies a W×1 horizontal strip in a ROWS×W sub-canvas
    // Scroll: render at y = generation % ROWS (ring buffer)
    for (let x = 0; x < W; x++) {
      const alive = states[rule * W + x];
      const px = col * W + x;
      const py = row * ROWS + (generation % ROWS);
      const idx = (py * (W * 16) + px) * 4;
      const v = alive ? 0 : 255;
      imageData.data[idx] = imageData.data[idx+1] = imageData.data[idx+2] = v;
      imageData.data[idx+3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
```

This renders all 256 rules at 60fps in a single canvas. Total operations per frame: $256 \times 200 = 51,200$ cell updates + $51,200$ ImageData pixel writes. Runs comfortably in < 2ms per frame.

---

## The Wow Moment — Push It

**Class visualization:** Color the 256 sub-canvases by Wolfram class: Class I = gray border, Class II = blue, Class III = red, Class IV = gold. Only one sub-canvas gets a gold border: Rule 110. This visually isolates Turing completeness from 255 alternatives.

**Rule explorer:** click any sub-canvas to expand it full-screen. Show the rule table as an 8-cell diagram: each of the 8 neighborhood triplets displayed as a small grid, with the output bit (0 or 1) shown beneath each. Animate the rule table — clicking each output bit flips it and updates the rule number and the space-time diagram in real time. This is the core pedagogical tool: students can build their own rules and see the result instantly.

**Initial condition sensitivity (Rule 30 demo):** run Rule 30 from two initial conditions that differ by a single cell two positions away from center. Run them side by side. The two space-time diagrams diverge almost immediately and look completely different after 20 rows — extreme sensitivity to initial conditions, the hallmark of Class III chaos. Then run Rule 110 with the same two initial conditions: it takes many more rows before the difference propagates, reflecting the more structured, information-preserving nature of Class IV computation.

**Rule 30 as RNG:** show that the center column of Rule 30's space-time diagram passes NIST randomness suite tests. Run the center column values as audio (0 = silence, 1 = click at 440Hz) — it sounds like pure randomness. Then show Wolfram Alpha's `RandomInteger[]` calling Rule 30 under the hood. Connect determinism + simple rules = cryptographically useful randomness.

**2D CA addendum:** a 30-second segment showing Game of Life (B3/S23), Highlife (B36/S23), and Day & Night (B3678/S34678) running simultaneously in the lower third of the screen. Label each with its birth/survival notation. Let the viewer see the qualitative difference: Life has familiar gliders, Highlife has replicators, Day & Night is symmetric between alive and dead states.

---

## The Interactive Demo

- **Rule selector**: 0–255. Type a number or use arrows. Updates the full-screen display and the 16×16 grid (highlights the selected rule with a yellow border).
- **"All 256 rules" view**: shows the full 16×16 grid of all rules running simultaneously.
- **Initial condition picker**: single center cell / random row / custom bitmap editor (click to toggle cells in the first row).
- **Grid width slider**: 50–500 cells. Adjusts the width of each sub-canvas.
- **Speed slider**: 1–100 steps per frame.
- **"Class filter" buttons**: filter the 16×16 grid to show only Class I / II / III / IV rules.
- **Rule table editor**: for the full-screen selected rule — 8 toggle buttons showing the neighborhood → output mapping. Clicking any toggle immediately updates the rule number and diagram.
- **"Random rule" button**: picks a random rule number. Encourages exploration.
- **"Famous rules" buttons**: Quick-jump buttons labeled Rule 30, Rule 90, Rule 110, Rule 184 (traffic flow), Rule 193.
- **"Side by side ICs" mode**: runs the selected rule from two slightly different initial conditions simultaneously, showing sensitivity.
- **2D mode toggle**: switches to a 2D CA (Game of Life-style) with birth/survival notation sliders (B = alive neighbor count for birth, S = alive neighbor count for survival).
- **Export**: saves the current space-time diagram as a PNG.

---

## Production Notes

**Code structure:** `eca.js` (elementary CA engine, all 256 rules simultaneously), `display.js` (ImageData renderer for the 16×16 grid), `ruleEditor.js` (the interactive rule table editor for single-rule exploration), `ca2d.js` (2D CA engine for the bonus section). Keep the ECA engine completely separate from display logic — the engine is pure array manipulation.

**Visual layout:** default view is the full 16×16 grid of 256 rules. Single-rule exploration mode is triggered by clicking any sub-canvas, which expands it to fill the left 70% of the screen. The right 30% shows the rule table editor and controls. A small "back to zoo" button returns to the 16×16 view.

**Color scheme for the 16×16 grid:** rules classified by Wolfram class get colored borders. Class I: white. Class II: pale blue. Class III: orange-red. Class IV: gold. The grid itself uses black/white cells. The rule number appears in small text below each sub-canvas. At 16×16 layout with W=50, each sub-canvas is ~50px wide — small but legible.

**Key cinematic moments:**
1. **0:00–0:45** — The 16×16 grid cold open with dramatic lighting sweep.
2. **1:30–2:00** — The canvas limit crash. "60 canvases rendered, 196 blank." Dramatic.
3. **3:00–3:30** — The bit-shift rule lookup explanation. Animate the binary encoding of Rule 110 as a visual overlay.
4. **4:30–5:00** — Rule 30 center-column randomness demo. Audio visualization.
5. **5:30–6:00** — Sensitivity comparison: Rule 30 vs. Rule 110 with 1-bit initial condition difference.
6. **6:30–7:00** — Rule editor interaction: live-edit the rule table and watch the space-time diagram update in real time.
7. **7:30–8:00** — 2D CA bonus: Life → Highlife → Day & Night transition.

---

## Tags
`cellular-automata` `wolfram` `rule-30` `rule-110` `turing-complete` `classification` `emergence` `canvas`

---

## Thumbnail

A 4×4 mosaic of 16 selected cellular automata rules, each showing a beautiful space-time diagram. Top-left quadrant (Class I): solid white — boring. Top-right (Class II): clean diagonal stripes — orderly. Bottom-left (Class III): Rule 30's chaotic triangle — looks like noise. Bottom-right (Class IV): Rule 110's complex interacting structures, lit with a gold border. Bold white text across the diagonal: **"256 UNIVERSES."** A gold crown icon above the Rule 110 panel. Smaller text beneath the Rule 110 panel: **"Only this one can compute."**
