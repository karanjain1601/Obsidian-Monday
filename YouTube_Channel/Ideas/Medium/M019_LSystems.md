---
title: "Growing a Plant From Three Rewriting Rules (L-Systems)"
id: M019
difficulty: 5
prereq: "None"
concept: "Lindenmayer systems: alphabet + production rules + turtle graphics interpretation; context-free grammars generating fractal plant forms; Koch curve, Sierpinski triangle, realistic tree branching all from simple rules."
tags: [L-systems, fractal, turtle-graphics, grammar, plant-growth, procedural-generation, canvas, algorithmic-botany]
category: medium
type: video-idea
---

# Growing a Plant From Three Rewriting Rules (L-Systems)

**Alt title:** "A Plant That Grows From a Single String of Characters"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Time-lapse of a fern unfurling from a coiled fiddlehead — the self-similar structure reveals itself: each sub-frond is a tiny copy of the whole frond. Freeze on the fern. Draw overlay lines tracing the self-similar branching — the sub-frond looks exactly like the parent frond, recursively.

Cut to: a screen. A text cursor. The string `"F"` appears. Text overlay: **Generation 0**.

Then, following an arrow, the string becomes `"F+F-F-F+F"`. **Generation 1**.

The string expands again: each `F` in the new string becomes `"F+F-F-F+F"`. The resulting string is 25 characters long. **Generation 2**.

Narrator: *"These aren't just strings. They're instructions for a turtle. Each F means 'draw a line forward.' Each + means 'turn right 90 degrees.' Watch what this string draws."*

The strings animate into a fractal square — the Koch curve analog. Then a new set of rules appears on screen and the pattern reshapes into a branching tree, unmistakably plant-like.

Narrator: *"Aristid Lindenmayer invented this in 1968 to model how cells grow. What he discovered was a universal grammar for all plant life."*

---

## The Naive Attempt

The L-system has two parts: the rewriting engine (string expansion) and the turtle graphics renderer. The naive student implements the string expansion first:

```javascript
function expand(axiom, rules, generations) {
  let current = axiom;
  for (let i = 0; i < generations; i++) {
    let next = '';
    for (const char of current) {
      next += rules[char] || char; // replace or keep
    }
    current = next;
  }
  return current;
}

// Koch curve rules
const rules = { F: 'F+F-F-F+F' };
const axiom = 'F';
const g5 = expand(axiom, rules, 5); // generation 5
console.log(`Length: ${g5.length}`); // 5^5 = 3125... wait
```

Running this at generation 6: the string length is $5^6 = 15,625$. At generation 7: $5^7 = 78,125$. At generation 8: $5^8 = 390,625$. At generation 9: $5^9 = 1.9$ million characters. Memory usage: each JavaScript string character is 2 bytes UTF-16, so generation 9 = 3.8MB of string. At generation 12: $5^{12} \approx 244$ million characters = 488MB of RAM. The browser crashes with an out-of-memory error before generation 12 for the Koch curve.

The turtle renderer:

```javascript
function drawLSystem(ctx, commands, angle, stepLen) {
  let x = canvas.width / 2, y = canvas.height;
  let dir = -Math.PI / 2; // start pointing up
  const stack = []; // for [ and ] bracket operators

  ctx.beginPath();
  ctx.moveTo(x, y);

  for (const cmd of commands) {
    if (cmd === 'F') {
      x += stepLen * Math.cos(dir);
      y += stepLen * Math.sin(dir);
      ctx.lineTo(x, y);
    } else if (cmd === '+') {
      dir += angle;
    } else if (cmd === '-') {
      dir -= angle;
    } else if (cmd === '[') {
      stack.push({ x, y, dir });
    } else if (cmd === ']') {
      const state = stack.pop();
      x = state.x; y = state.y; dir = state.dir;
      ctx.moveTo(x, y); // lift the pen
    }
  }
  ctx.stroke();
}
```

The naive bug: the student forgets to call `ctx.moveTo(x, y)` after a `]` bracket (restoring the turtle position). Without the `moveTo`, the path continues drawing from the restored position back to the old position — every `]` produces a phantom line connecting the branch tip back to the trunk. The plant looks like it has weird crossing lines everywhere. The tree is covered in diagonal artifacts.

---

## The Moment of Failure

**Memory crash:** running generation 12 of the Koch curve in the console outputs `JavaScript heap out of memory` after 8 seconds. The tab crashes. Reload. Lesson: exponential string growth requires either limiting generations or using a lazy evaluation strategy (generate turtle commands directly from the grammar without materializing the full string).

**Phantom branch lines:** with the missing `moveTo`, the canvas shows a fractal tree with dozens of spurious diagonal lines crossing from branch tips back to the trunk. It still roughly looks like a tree but has a chaotic web of wrong lines underneath. Zooming in reveals that every single `]` event produces a line from the branch tip to whatever the canvas path's current position was — a catastrophic off-by-one in the turtle state management.

---

## Why It Broke — The Physics

**Exponential growth:** an L-system with a rule of the form $F \to F_1 F_2 \ldots F_k$ expands exponentially. After $n$ generations, the string has length $\Theta(k^n)$ for a rule that produces $k$ symbols from each symbol. For the Koch curve ($k=5$), generation $n$ produces $5^n$ characters. This is a fundamental property of context-free grammars: they are generative, not lazy. The fix is to never materialize the full string — instead, recursively apply the turtle drawing directly.

**Turtle state and the stack:** the `[` and `]` symbols implement a push-down automaton for branching. The `[` pushes the current turtle state (position, direction, and optionally line thickness, color) onto a stack. The `]` pops and restores the state, then repositions the pen — essential. Without the `moveTo`, the path continues from the branch tip to the next drawing position, creating phantom lines. This is a pure implementation bug, not a physics issue, but it perfectly illustrates the "bugs are the curriculum" thesis.

**The grammar formalism:** an L-system is formally a parallel rewriting system $(V, \omega, P)$ where:
- $V$ is the alphabet (variables + constants)
- $\omega \in V^*$ is the axiom (starting string)
- $P: V \to V^*$ is the production rule set (each variable maps to a replacement string)

At each generation, every symbol in the current string is simultaneously replaced by its production. This parallel replacement distinguishes L-systems from sequential grammars. The turtle interpretation assigns geometric meaning to symbols: $F$ = draw forward $d$ units; $f$ = move forward without drawing; $+$ = turn left by $\delta$; $-$ = turn right by $\delta$; $[$ = push state; $]$ = pop state; $|$ = turn 180°; additional symbols for color, width, etc.

Key geometric fact: the fractal dimension of a plant-like L-system is related to the branching factor. For the Koch curve with segment scaling factor $1/3$ and $N=4$ copies: $D = \log(4)/\log(3) \approx 1.26$. For Sierpinski triangle: $D = \log(3)/\log(2) \approx 1.58$.

---

## The One Concept

**Lindenmayer Systems**

Aristid Lindenmayer was a Hungarian biologist studying the growth of algae in 1968. He wanted to model how cells divide and differentiate: a single cell (the axiom) divides according to rules (the productions), and the resulting colony (the expanded string) can be read back as a sequence of cellular states. The mathematical formalism — parallel string rewriting — was borrowed from Noam Chomsky's formal language theory, which Lindenmayer was reading at the time.

What Lindenmayer discovered — and what nobody expected — was that his grammar could generate arbitrarily complex plant-like structures from extremely simple rules. Three or four production rules can generate a realistic fern, a branching tree, a coral, or a seaweed frond. The self-similarity of the output (each branch is a smaller copy of the whole) is not put in by hand — it emerges automatically from the recursive nature of the rewriting process. This is because plants actually grow this way: each growing tip applies the same developmental rules independently of all other tips. The L-system models this "parallelism" of biological growth exactly.

The turtle graphics interpretation (added by Prusinkiewicz and Hanan in 1988) gives geometric meaning to the symbolic output. Prusinkiewicz and Lindenmayer's 1990 book "The Algorithmic Beauty of Plants" showed that virtually every plant form found in nature — grasses, flowers, trees, seaweeds, fungi — could be reproduced with an L-system of fewer than 10 rules. The book remains a landmark of computational biology.

Context-free vs. context-sensitive L-systems: the basic L-system is context-free: each symbol is replaced independently of its neighbors. Context-sensitive L-systems (IL-systems) can condition replacement on the neighboring symbols — modeling hormone signals and nutrient transport in real plants. Stochastic L-systems introduce random variation in rule application, producing natural-looking variety rather than the perfect symmetry of deterministic L-systems.

Practical use in computer graphics: procedural tree generation in video games (Horizon Zero Dawn, Red Dead Redemption) uses L-system-like grammars. The SpeedTree middleware generates game trees procedurally. Houdini (the VFX tool) has an L-system node. In architecture, fractal L-systems are used to generate facade patterns. In music, L-systems have been used to generate melodic sequences (David Cope, Iannis Xenakis).

---

## The Fix

**Fix 1 — Lazy evaluation (no string materialization):**

```javascript
// Instead of expanding to a string and then rendering,
// interpret the grammar recursively up to depth n
function drawRecursive(ctx, symbol, rules, depth, state) {
  if (depth === 0) {
    // Base case: draw the symbol as a primitive
    if (symbol === 'F') {
      const nx = state.x + state.len * Math.cos(state.dir);
      const ny = state.y + state.len * Math.sin(state.dir);
      ctx.moveTo(state.x, state.y);
      ctx.lineTo(nx, ny);
      state.x = nx; state.y = ny;
    }
    return;
  }
  // Expand the symbol and recurse
  const expansion = rules[symbol] || symbol;
  for (const char of expansion) {
    drawRecursive(ctx, char, rules, depth - 1, state);
  }
}
```

This uses $O(\text{depth} \times \text{max\_branch\_length})$ stack space — polynomial, not exponential. No string is ever materialized beyond a single level.

**Fix 2 — The moveTo after `]`:**

```javascript
} else if (cmd === ']') {
  const state = stack.pop();
  x = state.x; y = state.y; dir = state.dir;
  ctx.moveTo(x, y);  // ← THIS LINE was missing. Lifts the pen before next draw.
}
```

One line. Eliminates all phantom branch lines immediately.

---

## The Wow Moment — Push It

**Animated growth:** start from generation 0 (single segment) and animate through generations 1, 2, 3, 4, 5. At each generation, the previous generation's segments stay in place (locked) and the new branches grow out from the tips — exactly like real plant growth. Use a tweened animation where each new line segment "draws itself" over 0.5 seconds. The result is a hypnotic plant-growth animation that makes the recursive structure viscerally clear.

**Stochastic L-systems:** instead of fixed rules, make the branching angle and branch length slightly random each application. Replace `+` (fixed angle $\delta$) with a random angle drawn from a Gaussian with mean $\delta$ and standard deviation $5°$. The resulting tree is no longer perfectly symmetric — it looks genuinely natural, like a real tree photographed outside. Two trees grown from the same rules with different random seeds look like two different trees of the same species.

**Fractal gallery mode:** show 8 famous L-systems side by side in a 2×4 grid, each evolving from generation 0 to generation 5 simultaneously. Include: Koch curve, Sierpinski triangle, Dragon curve, Hilbert curve, fern (Barnsley), branching tree, hexagonal snowflake, and Penrose tiling approximant. The grid is a beautiful visual catalog of how much variety comes from the grammar framework.

**Real plant matching:** load a photograph of a real fern leaf. Tune the L-system rules interactively (using sliders for angle, branching factor, segment length ratio) until the generated plant visually matches the photograph. This is a live demonstration of the inverse problem in L-systems — finding the grammar that generated a given plant shape. A very hard open problem in computational biology.

---

## The Interactive Demo

- **Preset selector**: dropdown with 8 presets (Koch curve, Sierpinski, Dragon curve, Hilbert curve, Fern, Branching tree, Snowflake, Custom). Selecting a preset fills the rule editor and sets angle/axiom.
- **Custom rule editor**: editable text fields for axiom and up to 5 production rules (symbol → replacement). Live updates the canvas on each keypress.
- **Generation slider**: 0–8. Default 4. Each step = one rewrite. The canvas shows the result of that generation.
- **Angle slider**: 1°–90°, step 0.5°. Default depends on preset. Changing angle morphs the shape dramatically.
- **Step length slider**: 1–20 pixels. Default auto-scales based on generation (halves each generation to keep total size constant).
- **"Animate growth" button**: animates from generation 0 to current generation with 1 second per generation.
- **"Stochastic" toggle**: adds Gaussian noise to angle (±sigma slider, 0–20°) and step length (±sigma, 0–30%).
- **"Random seed" input**: integer. Changing this changes the stochastic variation without changing the rules.
- **Color mode**: Monochrome / Gradient by depth (older branches = darker) / Hue by direction / Branch width by depth (trunk thick, tips thin).
- **"Export SVG" button**: exports the current L-system as a vector SVG file (using the exact turtle path as SVG path commands).
- **Canvas rotation slider**: 0°–360°. Rotates the entire coordinate system. Some L-systems look better at 30° or 45° rotation.
- **"Count symbols" readout**: shows the count of each symbol type in the current generation string, helping students understand exponential growth.

---

## Production Notes

**Code structure:** `lsystem.js` (grammar rewriting and recursive turtle interpretation), `presets.js` (8 built-in systems with axiom, rules, angle, and display settings), `render.js` (Canvas 2D with path batching — accumulate all line segments in one path before calling `stroke()`). Path batching is crucial: 100,000 individual `moveTo/lineTo/stroke` calls are 10× slower than one `beginPath`, 100,000 `moveTo/lineTo` calls, then one `stroke()`.

**Color by depth:** the recursive approach makes depth coloring trivial — pass `depth` as a parameter and use `hsl(depth * 30, 70%, 50%)` for the stroke color. Younger branches (lower recursion depth) are green; older branches (higher depth) are brown. This correctly models real tree coloration.

**Visual layout:** 70% canvas, 30% right panel. The right panel has the rule editor at top (most important interactive element), generation slider, angle slider, then preset selector and toggles. The rule editor uses a monospace font and highlights valid symbols in green, invalid in red.

**Key cinematic moments:**
1. **0:00–0:45** — Fern fiddlehead time-lapse with self-similarity overlay. Slow, beautiful.
2. **1:00–1:30** — String expansion animation: "F" → "F+F-F-F+F" → 25 chars → ... The string appears character by character, then the full string sweeps into the turtle renderer.
3. **3:00–3:30** — The memory crash. Console shows heap out of memory error. Dramatic.
4. **3:30–4:00** — The recursive fix. Show the call stack as a tree with depth annotations. The recursive approach naturally draws the tree level by level.
5. **5:00–5:30** — The phantom lines bug → the fix. Side-by-side before/after: with and without the `moveTo` line.
6. **6:00–7:00** — Animated growth: generation 0 → 5 for the fern. Each generation animates its new branches growing from the tips. Mesmerizing 60 seconds.
7. **7:30–8:00** — Fractal gallery: 8 L-systems side by side, all animating simultaneously.

---

## Tags
`L-systems` `fractal` `turtle-graphics` `grammar` `plant-growth` `procedural-generation` `canvas` `algorithmic-botany`

---

## Thumbnail

Dark forest-green background. Center: a dense L-system branching tree, generation 6, rendered in a warm amber/brown-to-green gradient (trunk = dark brown, branch tips = bright lime green). The tree fills the frame organically. Overlaid in the top-left: the compact rule text in a code monospace font, white on translucent black: `F → FF-[-F+F+F]+[+F-F-F]`. A bright arrow leads from this text down to the tree. Bold text at bottom in white: **"3 RULES. INFINITE NATURE."** The fern frond structure is clearly self-similar — a branch is visibly a smaller copy of the whole tree.
