---
title: "Building Fractals From Contraction Mappings (IFS)"
id: M029
difficulty: 5/10
prereq: "None"
concept: "Iterated Function Systems: a set of contractive affine transformations; by Hutchinson theorem, there exists a unique attractor (fractal); Barnsley fern from 4 transformations; Sierpinski triangle from 3; randomized IFS algorithm."
tags: [IFS, fractal, affine-transform, barnsley-fern, sierpinski, attractor, canvas, contraction-mapping]
category: medium
type: video-idea
---

# Building Fractals From Contraction Mappings (IFS)

**Alt title:** "Four Lines of Math. One Perfect Fern. (Iterated Function Systems)"
**Difficulty:** 5/10 | **Prereq:** None (matrix multiplication is sufficient background)

---

## Opening Hook (0:00–1:00)

Start with a blank canvas. Four probability weights appear on screen: 0.01, 0.85, 0.07, 0.07. Then a single green dot blinks into existence near the bottom center. Another. Another. The algorithm places points at 60fps. Within 10 seconds, a perfect fern — identical to a real Pteridium fern photograph placed beside it — has assembled from apparently random dots.

Voiceover: *"No artist drew this. No image was stored. Only four tiny mathematical transformations, each applied randomly to the previous point. That's all it takes to generate one of nature's most recognizable patterns with perfect accuracy. Today we figure out why — and then we break it, fix it, and push it."*

Cut to: a single affine transformation matrix written on screen — a 2×2 matrix plus a translation vector. "This is one of the four. Here's what it does." Animate a cloud of points being squeezed and rotated into a smaller region of the plane. Then: "Four of these, stacked. Infinitely repeated. The Barnsley fern."

---

## The Naive Attempt

**What we code first:** The "deterministic" IFS — repeatedly apply all four transforms to a set of points, generating new sets. Start with a single pixel.

```javascript
// Naive attempt: deterministic IFS (apply all transforms, union the images)
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Barnsley Fern IFS transforms: [a, b, c, d, e, f, probability]
// Maps (x,y) → (ax+by+e, cx+dy+f)
const fern = [
  [0,    0,    0,    0.16, 0,    0,    0.01],  // stem
  [0.85, 0.04,-0.04, 0.85, 0,    1.60, 0.85],  // leaflets (main)
  [0.20,-0.26, 0.23, 0.22, 0,    1.60, 0.07],  // left leaflet
  [-0.15, 0.28, 0.26, 0.24, 0,  0.44, 0.07],  // right leaflet
];

function applyTransform(t, x, y) {
  return [t[0]*x + t[1]*y + t[4], t[2]*x + t[3]*y + t[5]];
}

// Naive: generate ALL points at each step
let points = [[0, 0]];
ctx.fillStyle = '#00AA00';

function deterministicStep() {
  const newPoints = [];
  for (const [x, y] of points) {
    for (const t of fern) {
      newPoints.push(applyTransform(t, x, y));
    }
  }
  points = newPoints;
  
  // Draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const [x, y] of points) {
    const px = Math.floor(canvas.width/2 + x * 40);
    const py = Math.floor(canvas.height - y * 40);
    ctx.fillRect(px, py, 1, 1);
  }
}

// Call deterministicStep() repeatedly — watch memory explode
let iter = 0;
const interval = setInterval(() => {
  deterministicStep();
  iter++;
  document.title = `Iter: ${iter}, Points: ${points.length}`;
  if (points.length > 1_000_000) clearInterval(interval); // memory bomb
}, 100);
```

At iteration 1: 4 points. Iter 2: 16. Iter 3: 64. Iter 4: 256. Iter 10: 4¹⁰ ≈ 1,000,000. The browser tab freezes. Memory usage spikes. After ~12 iterations the page crashes.

The shape is correct but completely unscalable. We need the randomized algorithm instead — but first, let's understand *why* deterministic works at all.

---

## The Moment of Failure

The failure is visceral: the browser tab shows "Aw, Snap!" or the JavaScript console reports "Out of Memory" after ~10–12 iterations. Before it crashes, the point count shown in the title bar doubles every 1–2 seconds: 4, 16, 64, 256, 1024, 4096... 262144... 1048576... then silence.

Show a graph in the corner: point count (Y-axis, log scale) vs iteration (X-axis). A straight line on a log scale — perfect exponential growth. The slope is log₂(4) = 2: each iteration multiplies point count by 4.

The rendered images at iterations 1–8 are visible on screen: they correctly show the fern forming, with each iteration adding more detail. "It works! It just explodes." Then: crash. "There has to be a smarter way."

Voiceover during the crash: *"We're doing unnecessary work. After enough iterations, the image is the attractor — a fixed point. And fixed points don't change when you apply the transforms again. We're computing redundant information by keeping all intermediate points."*

---

## Why It Broke — The Physics

The deterministic IFS generates the sequence of sets S₀, S₁ = ∪ᵢ fᵢ(S₀), S₂ = ∪ᵢ fᵢ(S₁), ... The attractor A satisfies A = ∪ᵢ fᵢ(A). By the Hutchinson theorem, because each fᵢ is a contraction (Lipschitz constant < 1), this sequence converges to a unique fixed-point set A in the Hausdorff metric.

The problem is that |Sₙ| = 4ⁿ for 4 transforms. After n=20 iterations, that's 10¹² points. The attractor has infinite "points" (it's a fractal of Hausdorff dimension ~1.2 for the fern) but a finite area — so we're generating redundant information by tracking all intermediate sets.

The key insight: because the transforms are contractions, we don't need to visit every point. The **Chaos Game** (Barnsley's randomized algorithm) samples the attractor without generating all intermediate sets:

```
Algorithm: Chaos Game
1. Start at any point x₀ (e.g., origin)
2. At each step, randomly choose transform fᵢ with probability pᵢ
3. Apply: x_{n+1} = fᵢ(xₙ)
4. Plot xₙ (after first ~20 warmup steps to reach attractor)
```

The probability weights pᵢ are not arbitrary — they are chosen proportional to the area scaling factor |det(Aᵢ)| so that each region of the attractor is sampled uniformly. For the Barnsley fern:
- f₁ (stem): p = 0.01 (contracts to near-zero area)
- f₂ (main body): p = 0.85 (covers 85% of the fern's area)
- f₃, f₄ (leaflets): p = 0.07 each

This generates one new point per iteration — O(1) memory — and converges to the correct attractor with probability 1.

---

## The One Concept

**Iterated Function Systems and the Hutchinson Attractor**

An Iterated Function System (IFS) is a finite collection of contractive maps {f₁, f₂, ..., fₙ} on a metric space (X, d). Each fᵢ is a contraction: there exists 0 ≤ cᵢ < 1 such that d(fᵢ(x), fᵢ(y)) ≤ cᵢ · d(x, y) for all x, y ∈ X. In the case of affine IFS (the most common), each map is of the form fᵢ(x) = Aᵢx + bᵢ where Aᵢ is a matrix with all singular values < 1 and bᵢ is a translation vector.

The **Hutchinson operator** F maps sets to sets: F(S) = f₁(S) ∪ f₂(S) ∪ ... ∪ fₙ(S). The fundamental theorem (Hutchinson, 1981) states: in the complete metric space of nonempty compact subsets of ℝⁿ equipped with the Hausdorff metric d_H, the Hutchinson operator F is itself a contraction. Therefore, by Banach's fixed-point theorem, F has a unique fixed point A — called the **attractor** — satisfying A = f₁(A) ∪ f₂(A) ∪ ... ∪ fₙ(A). This attractor is the fractal.

The contraction ratio c = max cᵢ determines convergence speed: d_H(Fⁿ(S), A) ≤ cⁿ · d_H(S, A). For the Barnsley fern, the dominant contraction ratio is 0.85 (from f₂), so the Hausdorff distance to the attractor decays as 0.85ⁿ. After n=100 chaos-game iterations, the distance is 0.85¹⁰⁰ ≈ 10⁻⁷ — machine precision. The first 20 warmup steps (typically discarded) let the orbit escape the initial position and reach the neighborhood of the attractor.

**Why the fern looks like a real fern:** Barnsley's insight was that natural branching structures are approximately self-similar at multiple scales. A fern frond looks like a smaller fern. The tip of a leaflet looks like a smaller leaflet. This self-similarity is captured by affine maps: the main f₂ maps the entire fern to the main body of the next-smaller fern. f₃ and f₄ produce the individual leaflets. f₁ produces the stem. This is **self-affine** (not exactly self-similar, since the maps include shear and rotation, but the attractor looks the same under the appropriate affine rescaling). The four parameters of each transform encode the specific tilt, scale, and offset of each branch.

**The Collage Theorem:** Inversion — given a target image (like a photograph of a real fern), find the IFS whose attractor best matches it. The Collage Theorem (Barnsley) provides the key: to approximate a target set T, choose transforms {fᵢ} such that T ≈ F(T) — i.e., the union of the transformed copies of T covers T well. The better the collage, the closer the attractor to T. This was the basis of **fractal image compression** (a 1990s technology): encode an image as a small set of affine transforms rather than as raw pixels. A 640×480 image might be compressed to a few hundred transforms (a few kilobytes), then decoded by running the chaos game. The compression ratio is exceptional but the encoding is computationally expensive — which is why JPEG won in practice.

**Sierpinski triangle from 3 transforms:** Three contractions each mapping the unit triangle to one of its half-sized corners. fᵢ scale by 0.5 and translate to each of the three corners. The attractor is the Sierpinski triangle, Hausdorff dimension log(3)/log(2) ≈ 1.585. Change the scale from 0.5 to 0.4 → the three copies no longer meet, producing a "gasket with gaps." Change to 0.6 → the copies overlap, attractor fills to a solid triangle. Exactly at 0.5 → the fractal.

---

## The Fix

Replace the deterministic explosion with the Chaos Game:

```javascript
// Fix: Chaos Game (randomized IFS)
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

// Barnsley Fern transforms [a, b, c, d, e, f]
const transforms = [
  [0,     0,     0,    0.16, 0,    0   ],
  [0.85,  0.04, -0.04, 0.85, 0,    1.60],
  [0.20, -0.26,  0.23, 0.22, 0,    1.60],
  [-0.15, 0.28,  0.26, 0.24, 0,    0.44],
];
const probs = [0.01, 0.85, 0.07, 0.07];

// Build cumulative probability array for efficient selection
const cumProbs = probs.reduce((acc, p, i) => {
  acc.push((acc[i-1] || 0) + p);
  return acc;
}, []);

function chooseTransform() {
  const r = Math.random();
  return cumProbs.findIndex(p => r < p);
}

function applyTransform(t, x, y) {
  return [t[0]*x + t[1]*y + t[4], t[2]*x + t[3]*y + t[5]];
}

// Scale fern coordinates to canvas
function toCanvas(x, y) {
  return [
    Math.round(W/2 + x * (W/11)),
    Math.round(H - 20 - y * (H/12))
  ];
}

// Run chaos game in batches (non-blocking via requestAnimationFrame)
let x = 0, y = 0;
const POINTS_PER_FRAME = 5000;
let frameCount = 0;

// Use Uint8ClampedArray for direct pixel manipulation (fast)
const imageData = ctx.createImageData(W, H);
imageData.data.fill(255); // white background

function paintPoint(px, py, r, g, b) {
  if (px < 0 || px >= W || py < 0 || py >= H) return;
  const idx = (py * W + px) * 4;
  imageData.data[idx]   = r;
  imageData.data[idx+1] = g;
  imageData.data[idx+2] = b;
  imageData.data[idx+3] = 255;
}

function chaosGameFrame() {
  for (let i = 0; i < POINTS_PER_FRAME; i++) {
    const ti = chooseTransform();
    [x, y] = applyTransform(transforms[ti], x, y);
    if (frameCount === 0 && i < 20) continue; // warmup
    const [px, py] = toCanvas(x, y);
    // Shade green by transform index for visual interest
    const greens = [60, 120, 100, 80];
    paintPoint(px, py, 20, greens[ti], 20);
  }
  ctx.putImageData(imageData, 0, 0);
  frameCount++;
  requestAnimationFrame(chaosGameFrame);
}

chaosGameFrame();
```

Why this works: each iteration costs O(1) memory and O(1) time, regardless of how many total points have been plotted. After 100,000 points the fern is visually complete. After 1,000,000 points every pixel in the attractor's region is filled. The chaos game is backed by the **ergodic theorem** for IFS: under the probability weighting, the empirical distribution of orbit points converges to the unique ergodic measure supported on the attractor.

---

## The Wow Moment — Push It

**Morphing IFS:** Add 6 sliders — one per parameter of one transform. Let the viewer drag them and watch the fern morph in real time as the chaos game updates. Drag the main-body transform's rotation angle: the fern tilts. Change the scale factor: it elongates or compresses. Move the translation: the fern's base shifts. The viewer directly experiences that every aspect of the fractal is encoded in the transform coefficients.

**IFS designer tool:** Upload any simple silhouette image (black-on-white). The tool identifies self-similar sub-regions (manual selection mode: user draws 3–5 bounding rectangles over self-similar parts), extracts the affine transforms between them, and runs the chaos game to reconstruct an approximation of the original. Watch a hand-drawn tree silhouette approximately regenerate from 5 affine transforms.

**Fractal menagerie:** Buttons to switch instantly between 6 built-in IFS: Barnsley Fern, Sierpinski Triangle, Dragon Curve, Lévy Curve, Black Spleenwort Fern (Barnsley's second fern), Heighway Dragon. Each appears letter-by-letter as the chaos game runs. Compare Hausdorff dimensions labeled on each.

**3D IFS:** Use Three.js with 6 3D affine transforms to generate the Menger Sponge attractor — the 3D analog of the Sierpinski carpet. Rotate it slowly. Label its dimension: log(20)/log(3) ≈ 2.727.

---

## The Interactive Demo

- **IFS preset selector** (Barnsley Fern / Sierpinski Triangle / Dragon Curve / Lévy Curve / Koch Snowflake / Custom): each preset loads its transform array and probabilities; renders instantly
- **Transform matrix editor**: a grid of input fields for each transform's [a, b, c, d, e, f, p] values; any change triggers a chaos game restart; bad values (non-contractive) show a warning
- **Contraction ratio display**: live computation of Lipschitz constant for each transform (max singular value of the Aᵢ matrix); red warning if any exceeds 1.0
- **Points counter**: live display of total points plotted, with a gauge showing "coverage" (% of attractor area estimated filled)
- **Warmup steps control** (0–100): see what happens when warmup is too short (orbit starts from wrong initial position, spurious points appear far from attractor)
- **Color mode**: Uniform Green / By Transform Index (each transform colors differently) / Iteration Depth (color by iteration count when the point was first plotted in that pixel, darker = older)
- **Probability weighting display**: pie chart showing the probability distribution across transforms; drag slices to re-weight; attractor density shifts accordingly
- **Deterministic mode** (checkbox): switch to the deterministic algorithm with a hard cap at 10,000 points; watch exponential blowup in the point counter; toggle back to chaos game for relief
- **Speed control** (100–50,000 points/frame): demonstrate that more points/frame fills the attractor faster but blocks the UI longer
- **Export SVG**: save the current fractal as an SVG path (connects 10,000 chaos-game points in order, producing a space-filling polyline that approximates the attractor)
- **Hausdorff dimension display**: live estimation using box-counting at two scales, displayed as "dim ≈ X.XX"; updates when transforms change

---

## Production Notes

**Code structure:**
- `index.html`: single canvas + control panel (tabbed: Presets | Edit Transforms | Settings)
- `ifs.js`: IFS definition, chaos game, transform application, cumulative probability sampler
- `renderer.js`: ImageData-based pixel painter (no ctx.fillRect per point — too slow); requestAnimationFrame loop
- `hausdorff.js`: box-counting dimension estimator (covers canvas with grids of sizes 4px, 8px, 16px, counts occupied boxes, fits log-log line)
- `controls.js`: transform matrix editor (auto-updates on input), preset loader, color mode switcher
- `svg-export.js`: polyline SVG writer

**Key cinematic moments:**
1. *The birth of the fern* (0:30–1:00): chaos game starts, first 10 points placed. Then 100. Then 1000. A fern emerges from noise. Time-lapse if needed, but real-time is better.
2. *Side-by-side comparison* (2:00): photo of a real fern placed next to the IFS fern. Zoom both. The match is eerie.
3. *The crash* (3:30): deterministic algorithm is demonstrated. Watch the point counter rocket up. Browser struggles. Crash or close-call. "There has to be a better way."
4. *The insight* (4:30): diagram showing a set S → F(S) → F²(S) → ... converging to A. Then show the chaos game as "sampling from A" without generating all sets.
5. *The morphing fern* (10:00): live slider manipulation. The fern distorts, stretches, tilts. "Every parameter has a geometric meaning. This one is the tilt of the branches."
6. *Fractal image compression callback* (13:00): brief demo of loading an image and manually selecting self-similar pieces. Note that this was a real technology in the 1990s.

**Timing note:** The chaos game can render 100,000 points in under 2 seconds at 5000 pts/frame in modern browsers. Demo the live speed — no need for pre-rendering.

---

## Tags
`IFS` `fractal` `affine-transform` `barnsley-fern` `sierpinski` `attractor` `canvas` `contraction-mapping`

---

## Thumbnail

A vibrant green Barnsley fern on a black background, assembled from visible green dots. To the left: a photo of a real fern. A thin white line connects the two with a label: "Same structure." In the upper-left corner, a 4×4 matrix of numbers (the IFS transforms) glows in white. Large bold text across the bottom: "4 EQUATIONS = 1 PERFECT FERN." The fern appears to be actively appearing — some dots are still sparse near the top, fully dense near the bottom.
