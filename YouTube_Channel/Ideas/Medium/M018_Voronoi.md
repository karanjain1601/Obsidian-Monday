---
title: "Nature's Optimal Cell Packing (Voronoi Diagrams in Code)"
id: M018
difficulty: 5
prereq: "None"
concept: "Voronoi diagram: partition of space into regions closest to each seed point; dual of Delaunay triangulation; found in soap foams, giraffe patterns, crystal grain boundaries, cell tissue; Lloyd's algorithm generates centroidal Voronoi."
tags: [voronoi, delaunay, computational-geometry, lloyd-algorithm, tessellation, nature, canvas, spatial-partitioning]
category: medium
type: video-idea
---

# Nature's Optimal Cell Packing (Voronoi Diagrams in Code)

**Alt title:** "Every Region on Earth Has a Closest City — That's a Voronoi Diagram"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Side-by-side four-up layout: (1) A giraffe's neck with its irregular polygonal spots. (2) A cut geode showing crystal grain boundaries under UV light — irregular polygons of minerals. (3) Soap foam on water from above — irregular polygonal bubbles. (4) A satellite image of Tokyo with its 23 ward boundaries — irregular polygons.

All four images pulse simultaneously with a white glow overlay that traces their polygon boundaries. The boundaries are identical in structure — irregular, space-filling convex polygons.

Narrator: *"A giraffe, a crystal, soap foam, and a Japanese city all solved the exact same optimization problem independently. Find the partition of space such that each region contains exactly what's closest to its center. Mathematicians call this the Voronoi diagram. And it appears everywhere in nature because it's optimal."*

Zoom to a blank canvas. Five colored dots appear as seed points. The space between them fills in with colors — each pixel coloring itself with the color of its nearest seed. Irregular polygonal regions emerge, tile the canvas perfectly, and snap into sharp boundary lines.

Narrator: *"You just generated your first Voronoi diagram. Now let's make it fast."*

---

## The Naive Attempt

The most direct approach: for every pixel on the canvas, compute the distance to every seed point and color the pixel with the nearest seed's color.

```javascript
function drawVoronoiNaive(canvas, seeds) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minDist = Infinity;
      let nearest = 0;
      for (let i = 0; i < seeds.length; i++) {
        const dx = x - seeds[i].x;
        const dy = y - seeds[i].y;
        const dist = dx * dx + dy * dy; // skip sqrt — only comparing
        if (dist < minDist) {
          minDist = dist;
          nearest = i;
        }
      }
      const color = seeds[nearest].color; // {r, g, b}
      const idx = (y * width + x) * 4;
      data[idx]     = color.r;
      data[idx + 1] = color.g;
      data[idx + 2] = color.b;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
```

With 10 seeds on a 400×400 canvas: this renders in ~50ms. Totally fine. But scale to 1,000 seeds: now it's $400 \times 400 \times 1000 = 160,000,000$ distance calculations per frame. At 60fps, that's 9.6 billion operations per second — far beyond what the main thread can do. The render time jumps to ~8 seconds per frame. The browser freezes completely.

Then you try to add animation: seeds move on each frame (to generate a dynamic Voronoi for Lloyd's algorithm). Now you need to regenerate the diagram every frame. At 1,000 seeds on a 400×400 canvas: completely unusable.

The second problem: the naive diagram has no edges drawn. You try to add edge detection (check if any of the 8 neighbors belongs to a different region and draw that pixel black), but iterating again through the imageData to check neighbors adds another 640,000 iterations per frame. The rendering pipeline becomes a multi-pass disaster.

---

## The Moment of Failure

Running the naive 1,000-seed version: the page hangs for 8 seconds before displaying a single frame. The browser's "Page Unresponsive" dialog appears. Reloading and running the animation version (seeds moving each frame): the frame rate counter reads 0.1fps — 10 seconds per frame. The progress bar for the Lloyd's algorithm convergence never visibly advances because each frame takes so long. Total fail.

Log: `Voronoi render time: 8214ms for 160M distance checks`. Compare to budget: `16ms target for 60fps`.

---

## Why It Broke — The Physics

The naive approach is $O(N \cdot W \cdot H)$ per frame where $N$ = number of seeds, $W$ and $H$ = canvas dimensions. For large $N$ or large canvases, this is completely intractable.

Three faster approaches exist:

**1. Fortune's sweep line algorithm** (1987): computes the exact Voronoi diagram as a set of polygon edges in $O(N \log N)$ time. Uses a beach line and event queue. Complex to implement but produces exact vector output. Output: edge list, vertex list.

**2. Jump Flooding Algorithm (JFA)** (2006): a GPU/GPGPU-friendly parallel algorithm. Initialize each seed pixel with its own seed ID. Then iterate: for pass $k$ (from $\log_2(\max(W,H))$ down to 1), each pixel looks at its 8 neighbors at distance $2^k$ and updates its nearest seed if the neighbor's seed is closer. After $\log_2(W)$ passes, every pixel holds its correct nearest seed. Time complexity: $O(W \cdot H \cdot \log(\max(W,H)))$, parallelizable. On a 512×512 canvas: 9 passes, ~2.3 million pixel updates — renders in < 1ms on a GPU via WebGL fragment shaders.

**3. Spatial hashing (approximate):** partition the canvas into a grid of cells. For each pixel, only check seeds within nearby grid cells. Reduces average comparisons from $N$ to $O(1)$ for uniformly distributed seeds.

The Voronoi diagram is the dual of the Delaunay triangulation: draw a line between every pair of seeds whose Voronoi regions share an edge. The Delaunay triangulation is the triangulation that maximizes the minimum angle of all triangles — it avoids "sliver" triangles. The key equation: point $P$ is in the Voronoi region of seed $S_i$ if and only if $|P - S_i| < |P - S_j|$ for all $j \neq i$.

Centroidal Voronoi Tessellation (CVT): a Voronoi diagram where each seed is the centroid of its own region. Lloyd's algorithm: iterate — move each seed to the centroid of its region, recompute Voronoi — until convergence. Converges to uniform, space-filling, near-regular hexagonal packing. This is why soap bubbles, which minimize surface energy, form hexagonal arrays (Kelvin's conjecture, 1887 — partially solved by Weaire-Phelan in 1994).

---

## The One Concept

**Voronoi Diagrams and Lloyd's Algorithm**

A Voronoi diagram, named after the Ukrainian mathematician Georgy Voronoi (1868–1908), partitions a plane into $N$ convex regions given $N$ seed points such that every point in region $i$ is closer to seed $i$ than to any other seed. Voronoi diagrams are one of the most fundamental structures in computational geometry — they encode proximity relationships, and proximity is relevant everywhere.

The diagram is found in nature because many natural processes minimize energy or resources. Crystal grain boundaries form at Voronoi boundaries because a material at a grain boundary is equidistant from two crystal nucleation centers — neither crystal can "claim" it without doing more work. Soap foam: bubbles minimize surface energy, which means each bubble wall lies at the equilibrium position between two air regions — the Voronoi boundary. Giraffe spots: melanin pigmentation is controlled by reaction-diffusion systems that produce Voronoi-like territorial boundaries between pigment-producing cells.

Fortune's algorithm (1987) is the most elegant exact Voronoi algorithm. It sweeps a horizontal line across the plane. Above the sweep line, the Voronoi diagram is fully computed. At the sweep line, a "beach line" of parabolic arcs tracks the equidistant boundary between each seed and the sweep line itself. Events occur when two arcs meet (a Voronoi vertex) or when a new seed is encountered. The algorithm runs in $O(N \log N)$ time and $O(N)$ space — optimal for exact computation.

For animated or interactive Voronoi (seeds moving every frame), the Jump Flooding Algorithm (JFA) is the practical choice. JFA runs on the GPU as a pair of framebuffer ping-pong operations. Each pixel is a fragment shader thread. In pass $k$, each thread reads 9 pixels (itself + 8 neighbors at step $2^k$) and outputs the seed ID with the smallest distance. After $\lceil \log_2 N \rceil$ passes, the output framebuffer is the Voronoi diagram. This runs at 60fps for 10,000 seeds on modern hardware — orders of magnitude faster than CPU brute force.

Lloyd's algorithm (1982) generates Centroidal Voronoi Tessellations (CVT). Starting from random seeds, it alternates: (1) compute Voronoi diagram; (2) move each seed to the centroid of its Voronoi cell. Each iteration reduces the total quantization error $\sum_i \int_{\Omega_i} |x - s_i|^2 dx$ (the sum of mean squared distances from each point in region $i$ to its seed). The algorithm converges to a configuration where seeds are maximally evenly spread — the CVT is the optimal quantization of the plane. In the limit, CVT approaches a hexagonal lattice (for uniformly distributed seeds in a rectangular domain), which is known to be the globally optimal quantization lattice.

Applications of Voronoi diagrams in software engineering: nearest-neighbor lookups in spatial databases, network coverage area computation (assign each cell tower a Voronoi region), game map territory generation, mesh generation for finite element analysis (Delaunay), facility location optimization (CVT), image segmentation (superpixel algorithms), and robot path planning (navigation between seeds = avoiding the nearest obstacle).

---

## The Fix

Implement the Jump Flooding Algorithm in WebGL. The GPU processes all pixels in parallel, making the diagram update in milliseconds even for large seed counts.

```javascript
// JFA in WebGL using framebuffer ping-pong
// Simplified version — full code with shader strings

const vertexShaderSrc = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const initShaderSrc = `
  precision highp float;
  uniform vec2 seeds[1000]; // seed positions in [0,1]x[0,1]
  uniform vec3 colors[1000];
  uniform int numSeeds;
  uniform vec2 resolution;
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float minDist = 1e9;
    int nearest = 0;
    for (int i = 0; i < 1000; i++) {
      if (i >= numSeeds) break;
      float d = distance(uv, seeds[i]);
      if (d < minDist) { minDist = d; nearest = i; }
    }
    // Encode seed index and distance in RGBA
    gl_FragColor = vec4(seeds[nearest], float(nearest) / 1000.0, minDist);
  }
`;

const jfaShaderSrc = `
  precision highp float;
  uniform sampler2D tex;
  uniform vec2 resolution;
  uniform float stepSize;
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 best = texture2D(tex, uv);
    float bestDist = best.a;
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        vec2 neighborUV = uv + vec2(float(dx), float(dy)) * stepSize / resolution;
        vec4 sample = texture2D(tex, neighborUV);
        float d = distance(uv, sample.xy);
        if (d < bestDist) { best = sample; bestDist = d; }
      }
    }
    gl_FragColor = vec4(best.xy, best.z, bestDist);
  }
`;
// After log2(max(W,H)) JFA passes, read back the seed index per pixel
// and color using seeds[index].color
```

The CPU-side Lloyd's iteration:

```javascript
function lloydIteration(seeds, voronoiRegions, width, height) {
  // voronoiRegions: Uint16Array of seed indices per pixel (from GPU readback)
  const sums = seeds.map(() => ({ x: 0, y: 0, count: 0 }));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = voronoiRegions[y * width + x];
      sums[idx].x += x;
      sums[idx].y += y;
      sums[idx].count++;
    }
  }
  return sums.map((s, i) => s.count > 0
    ? { x: s.x / s.count, y: s.y / s.count, color: seeds[i].color }
    : seeds[i]
  );
}
```

With JFA on the GPU: 500-seed Voronoi on 512×512 canvas renders in < 2ms. Lloyd's algorithm converges in 20–50 iterations, visually in real time.

---

## The Wow Moment — Push It

**Live Lloyd's relaxation:** start with 200 randomly placed seeds. Run Lloyd's algorithm in real time, one iteration per animation frame. Watch the regions morph from jagged random polygons to smooth near-hexagonal cells. The transition takes ~30 seconds at 60fps. Overlay a counter: "Iteration: 0 → 50." At convergence, the pattern looks exactly like the giraffe spots from the cold open. Play the cold open footage again, side by side.

**Dynamic seeds (follow the mouse cursor):** add an extra seed at the cursor position. All Voronoi regions deform in real time as the cursor moves — every region reshapes to reflect the new nearest-seed boundaries. The cursor seed's region starts large in empty space and shrinks as it approaches other seeds. Smooth, beautiful, responsive.

**Weighted Voronoi:** give each seed a weight $w_i$. The distance metric becomes $|P - S_i| / w_i$. Larger weights produce larger regions — simulating different resource catchment areas (city populations, cell sizes, crystal growth rates). Animate the weights from equal to random: the regions morph dramatically. This is used in cartogram generation and in weighted Delaunay meshes for FEM.

**Voronoi art mode:** use a supplied photograph as input. Extract 500 feature points from the image using edge detection (Sobel filter on the CPU). Use these as seeds. Color each Voronoi region with the average color of the pixels within it. The result is a beautiful low-poly mosaic of the original image — the "low-poly art" effect beloved on design blogs, generated mathematically. Compare a portrait before and after.

---

## The Interactive Demo

- **Seed count slider**: 5–2,000 seeds. Default 50. Real-time update.
- **Add seeds by clicking**: click anywhere on canvas to add a seed point.
- **Delete seed by right-clicking**: right-click a seed to remove it.
- **Drag seeds**: click and drag existing seeds to move them in real time.
- **"Randomize seeds" button**: scatter N seeds uniformly at random.
- **"Run Lloyd's" button**: runs one iteration of Lloyd's algorithm per click; "Auto" toggle runs continuously.
- **Color mode picker**: Random color per seed / Gradient by index / Grayscale / Distance-shaded (each region shaded by distance to its seed — darker at edges, brighter at center) / "Natural" (earth tones).
- **"Show edges" toggle**: draws black 1px edges at Voronoi cell boundaries.
- **"Show seeds" toggle**: draws a colored dot at each seed position.
- **"Show centroids" toggle**: after Lloyd iteration, shows both the seed (dot) and its cell's centroid (cross) — useful for teaching the algorithm.
- **"Delaunay dual" toggle**: draws the Delaunay triangulation as gray lines over the Voronoi diagram.
- **"Weighted Voronoi" toggle**: enables per-seed weight sliders (or random weights).
- **"Low-poly photo" button**: uploads a local image file and generates the Voronoi mosaic.
- **Distance metric picker**: Euclidean / Manhattan / Chebyshev. Manhattan distance produces diamond-shaped regions; Chebyshev produces square regions.

---

## Production Notes

**Code structure:** `voronoi.js` handles Fortune's algorithm (for the exact edge list), `jfa.js` handles WebGL JFA rendering, `lloyd.js` handles the centroid computation from GPU readback, `delaunay.js` draws the dual triangulation. Use a library like `d3-delaunay` (which wraps Bowyer-Watson) for the Fortune's algorithm reference implementation, and show the hand-rolled JFA as the performance upgrade.

**Visual layout:** full-screen canvas. A thin slide-out control panel on the right (toggleable with a tab button) to maximize canvas space. The Delaunay dual overlay in gray with 0.5 opacity is always available — showing both simultaneously is very educational.

**Key cinematic moments:**
1. **0:00–0:45** — Four-up nature montage with pulsing polygon boundary overlays.
2. **1:00–1:30** — Slow 5-seed demo: each pixel "deciding" its region with a growing-wave animation.
3. **2:30–3:00** — The naive failure: browser freeze with 1,000 seeds. Show `console.time` output: "8214ms."
4. **4:00–4:30** — GPU JFA explanation: show the 9-pass ping-pong animation. Each pass halves the step size. The diagram converges to correct in 9 steps.
5. **5:30–6:30** — Lloyd's relaxation in real time: random seeds → hexagonal packing. Overlay giraffe spots at 40% opacity at convergence.
6. **7:00–7:30** — Low-poly photo demo. A recognizable portrait (use a free-license photo) converted to a 500-seed Voronoi mosaic. Beautiful.

**Performance targets:** JFA on GPU: < 2ms for 512×512 canvas, any seed count up to 5,000. Lloyd centroid computation (CPU, from GPU readback): < 5ms per iteration. Total pipeline: 60fps for animated Lloyd's with 500 seeds.

---

## Tags
`voronoi` `delaunay` `computational-geometry` `lloyd-algorithm` `tessellation` `nature` `canvas` `spatial-partitioning`

---

## Thumbnail

Full-width Voronoi diagram with 80 seeds, each region a slightly different earth-tone color (warm browns, tans, greens, blues). A 2px black edge between all cells. In the top third: three micro-images at 25% opacity overlaid on the Voronoi — a giraffe neck, soap foam, and crystal grain boundary, each blending into the corresponding Voronoi region color. Bold white text in center: **"NATURE'S FAVORITE PARTITION"**. In smaller text below: **"Voronoi Diagrams"** in a clean sans-serif. One seed (near center) is highlighted with a bright white dot and a glowing ring, suggesting the "closest point" concept.
