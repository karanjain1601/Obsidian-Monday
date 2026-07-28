---
title: "Measuring the Roughness of a Coastline (Fractal Dimension)"
id: M026
difficulty: 5
prereq: "None"
concept: "Fractal dimension D = log(N)/log(1/s) (box-counting); for a fractal, D is non-integer; UK coastline D≈1.25; Mandelbrot set boundary D=2; higher D means more rough or space-filling."
tags: [fractal-dimension, box-counting, coastline, mandelbrot, self-similarity, measurement, canvas, nonlinear-dynamics]
category: medium
type: video-idea
---

# Measuring the Roughness of a Coastline (Fractal Dimension)

**Alt title:** "The UK Coastline Is Infinitely Long (And Here's How to Measure It)"
**Difficulty:** 5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

A map of the UK coastline appears. A ruler is dragged along the coastline, measuring it: "Using a 100km ruler: coastline length ≈ 2,800 km." Then a 50km ruler: "Using a 50km ruler: 3,400 km." Then 10km: "5,200 km." Then 1km: "17,800 km." The coastline keeps getting longer as the ruler gets smaller.

Narrator: *"The coastline of the UK has no definite length. It depends entirely on the size of your ruler. Use a smaller ruler, measure more of the jagged details, and the total gets longer — without limit. This is the coastline paradox, and Benoît Mandelbrot realized in 1967 that the solution wasn't a number. It was a dimension."*

Plot of log(length) vs. log(ruler size): a straight line with negative slope. Label the slope: "This slope is -0.25." Narrator: *"And that slope encodes something that a length cannot: how rough the coastline is. It's a number between 1 and 2, and it's called the fractal dimension. Today you're going to measure it — from actual map data — and then watch a naive implementation give you completely wrong answers."*

---

## The Naive Attempt

The student downloads a GeoJSON file of the UK coastline (from Natural Earth data, free to use). They convert it to a series of $(x,y)$ points in pixel coordinates on a canvas. They implement box-counting: overlay a grid of boxes of size $\varepsilon$, count how many boxes contain at least one coastline point, repeat for different $\varepsilon$ values.

```javascript
function boxCount(points, epsilon, width, height) {
  const cols = Math.ceil(width / epsilon);
  const rows = Math.ceil(height / epsilon);
  const occupied = new Set();

  for (const [x, y] of points) {
    const col = Math.floor(x / epsilon);
    const row = Math.floor(y / epsilon);
    occupied.add(`${col},${row}`);
  }
  return occupied.size;
}

// Measure at multiple scales
const epsilons = [200, 100, 50, 25, 10, 5, 2, 1]; // pixels
const counts = epsilons.map(eps => boxCount(points, eps, W, H));

// Compute fractal dimension: slope of log(N) vs. log(1/eps)
const logEps = epsilons.map(e => Math.log(1 / e));
const logN = counts.map(n => Math.log(n));

// Linear regression: D = slope
function linearRegression(xs, ys) {
  const n = xs.length;
  const meanX = xs.reduce((a,b)=>a+b,0)/n;
  const meanY = ys.reduce((a,b)=>a+b,0)/n;
  const slope = xs.reduce((s,x,i) => s + (x-meanX)*(ys[i]-meanY), 0) /
                xs.reduce((s,x) => s + (x-meanX)**2, 0);
  return slope;
}

const D = linearRegression(logEps, logN);
console.log(`Fractal dimension: ${D.toFixed(3)}`); // Expected: ~1.25 for UK
```

Running this: the GeoJSON file has the UK coastline at moderate resolution (about 5,000 points). The computed $D$ comes out as 1.47 — much too high. The expected value for the UK coastline is $D \approx 1.25$.

The second problem: at `epsilon = 1` (1-pixel boxes), the number of occupied boxes equals the number of points (5,000) — but the canvas is 800×600 = 480,000 pixels. With only 5,000 points, most of the coastline detail is simply not in the dataset. The 1-pixel box count is dominated by the data's sampling density, not the coast's true geometry.

The third problem: at `epsilon = 200` (200-pixel boxes), the canvas has only $4 \times 3 = 12$ boxes. The coast crosses all 12 of them — so $N = 12$. This is a fixed property of the box grid, not the fractal's geometry. These large-scale measurements are dominated by the overall shape of the UK, not its fractal roughness.

Both extremes — too fine (sampling-limited) and too coarse (topology-limited) — are uninformative. Only the middle range (called the "scaling region") gives the true fractal dimension.

---

## The Moment of Failure

Output: `Fractal dimension: 1.47`. Expected for UK: ~1.25. The student suspects the code is wrong. But when they check: the code is correct! The log-log plot shows: at the two finest scales, the slope suddenly changes to ~2.0 (the data runs out of points — each box contains 0 or 1 point, so $N$ approaches the point count, not the coastline geometry). At the two coarsest scales, the slope is ~0.5 (topology-dominated). In the middle: a region with slope ~1.25.

By including all 8 scales in the linear regression, the student is averaging over three different scaling regimes — two of which are artifacts. The regression slope of 1.47 is an artifact of incorrectly including the non-scaling regions.

Also: the Set key format `"${col},${row}"` creates a new string object for every coastline point (5,000 strings per `boxCount` call, × 8 epsilon values = 40,000 string allocations). For high-resolution coastlines with 100,000 points, this becomes 800,000 string allocations per measurement — slow and GC-heavy.

---

## Why It Broke — The Physics

The box-counting dimension is defined as:

$$D = \lim_{\varepsilon \to 0} \frac{\log N(\varepsilon)}{\log(1/\varepsilon)}$$

where $N(\varepsilon)$ is the number of boxes of size $\varepsilon$ needed to cover the set. For a fractal, this limit gives a non-integer value. But the limit requires arbitrarily fine resolution — in practice, we can only estimate $D$ in the "scaling region" where the log-log plot is linear.

The scaling region is bounded by two cutoffs:
- **Upper cutoff** (coarse limit): when the box size $\varepsilon$ is comparable to the total size of the object, $N(\varepsilon)$ reflects the topological extent (how many boxes the bounding box covers), not the fractal geometry. Typically: $\varepsilon_{\text{max}} \approx L/10$ where $L$ is the object's linear extent.
- **Lower cutoff** (fine limit): when $\varepsilon$ is smaller than the resolution of the data (sampling interval), the measured $N(\varepsilon)$ reflects the data density, not the geometry. Typically: $\varepsilon_{\text{min}} \approx 3 \times$ (average point spacing).

For the UK coastline in a GeoJSON with 5,000 points on an 800px canvas: average point spacing ≈ $800/5000 \approx 0.16$ px. Lower cutoff: $\varepsilon_{\text{min}} \approx 0.5$ px. Upper cutoff: $\varepsilon_{\text{max}} \approx 80$ px. The scaling region: $0.5 < \varepsilon < 80$ px.

The student used `epsilons = [200, 100, 50, 25, 10, 5, 2, 1]`. Correct range: `[50, 25, 10, 5, 2]` (5 values within the scaling region). With this range, $D \approx 1.25$. Correct.

Key formula for the box-counting dimension of well-known fractals:
- Koch snowflake: $D = \log 4 / \log 3 \approx 1.26$
- Sierpinski triangle: $D = \log 3 / \log 2 \approx 1.585$
- Mandelbrot set boundary: $D = 2$ (exactly, proven by Shishikura in 1998)
- UK coastline: $D \approx 1.25$ (Mandelbrot 1967)
- Norway coastline: $D \approx 1.52$
- Brownian motion path: $D = 2$ (in 2D, it fills the plane in the limit)

---

## The One Concept

**Fractal Dimension and the Coastline Paradox**

Benoît Mandelbrot published "How Long Is the Coast of Britain?" in Science in 1967. The paper's key insight: the length of a coastline is not a fixed number but scales with the measurement resolution. If you measure with a $\varepsilon$-length ruler and the coastline has fractal dimension $D$, the measured length scales as $L(\varepsilon) \sim \varepsilon^{1-D}$. For $D = 1$ (a smooth curve), $L$ is independent of $\varepsilon$ — you get the same length regardless of ruler size. For $D > 1$, $L \to \infty$ as $\varepsilon \to 0$ — the coastline is infinitely long at infinite resolution.

The dimension $D$ encodes the roughness: $D = 1$ means a smooth curve (no extra roughness), $D = 2$ means a space-filling curve (so rough it visits every point in a 2D region). The UK coastline at $D \approx 1.25$ is significantly rougher than a smooth curve but much less than space-filling. Norway's fjord-dominated coastline at $D \approx 1.52$ is much rougher — the fjords add complexity at every scale, similar to a Sierpinski triangle.

The box-counting method works for any set: paint the set on a grid, count non-empty boxes at many resolutions, fit a line to the log-log plot. This is why fractal dimension is such a powerful tool: it doesn't require the set to be self-similar (having exact copies of itself at all scales) — it only requires the log-log plot to be linear over some range. Real-world fractals are "statistical fractals" — self-similar in a statistical sense, not an exact geometric sense.

The Mandelbrot set boundary has fractal dimension $D = 2$ — the boundary is so intricate that it is space-filling. This was conjectured for decades and finally proved by Mitsuhiro Shishikura in 1998 using complex analysis. A space-filling boundary means that zooming into any point on the Mandelbrot set boundary reveals infinitely more detail — the classic observation that makes Mandelbrot set videos endlessly fascinating.

Practical applications of fractal dimension: measuring roughness of fracture surfaces (higher D = more irregular fracture, weaker material?), characterizing texture in medical images (tumor boundaries have higher D than normal tissue boundaries), measuring network topology (internet routing graph D ≈ 1.7), characterizing mountain terrain from satellite DEM data (D ≈ 2.2 for rough mountain terrain, ≈ 2.05 for flat plains — embedding in 3D means D ranges from 2 to 3 for surfaces). In financial markets, price series have $D \approx 1.45$–$1.65$ (between Brownian D=1.5 and Lévy D=1.0–1.5 depending on $\alpha$).

---

## The Fix

**Fix 1 — Use a flat 2D Boolean array instead of a string-keyed Set:**

```javascript
function boxCount(points, epsilon, width, height) {
  const cols = Math.ceil(width / epsilon);
  const rows = Math.ceil(height / epsilon);
  // Use a flat Uint8Array instead of a Set of strings — 100× faster
  const grid = new Uint8Array(cols * rows);
  let count = 0;

  for (const [x, y] of points) {
    const col = Math.min(Math.floor(x / epsilon), cols - 1);
    const row = Math.min(Math.floor(y / epsilon), rows - 1);
    const idx = row * cols + col;
    if (grid[idx] === 0) {
      grid[idx] = 1;
      count++;
    }
  }
  return count;
}
```

This eliminates all string allocations. For 100,000 coastline points and 10 epsilon values: 1 million array accesses vs. 1 million string allocations + hash lookups. Speed improvement: ~50×.

**Fix 2 — Automatic scaling region detection:**

```javascript
function computeFractalDimension(points, width, height) {
  // Generate epsilon values spanning 3 decades
  const epsilons = [];
  for (let e = width / 2; e >= 1; e /= Math.sqrt(2)) epsilons.push(e);

  const logInvEps = [], logN = [];
  for (const eps of epsilons) {
    const n = boxCount(points, eps, width, height);
    if (n < 5) continue; // too coarse
    logInvEps.push(Math.log(1 / eps));
    logN.push(Math.log(n));
  }

  // Find scaling region: where log-log plot is most linear
  // Simple heuristic: exclude lowest 20% (topology-limited) and
  // highest 20% (sampling-limited) of the log scale range
  const skip = Math.floor(logInvEps.length * 0.2);
  const trimmedEps = logInvEps.slice(skip, -skip || undefined);
  const trimmedN = logN.slice(skip, -skip || undefined);

  return {
    D: linearRegression(trimmedEps, trimmedN),
    logInvEps: trimmedEps,
    logN: trimmedN,
    allLogInvEps: logInvEps,
    allLogN: logN,
  };
}
```

With this fix: UK coastline from GeoJSON → $D = 1.24 \pm 0.03$. Matches Mandelbrot's 1967 result. ✓

---

## The Wow Moment — Push It

**Live box-count animation:** for a chosen epsilon, animate the box-counting process on the canvas. Overlay the grid and highlight each box as it's counted. Color occupied boxes red, empty boxes transparent. Show the count incrementing. Then step through 6 different epsilon values — the grid gets finer and finer, and the count grows as $N \propto \varepsilon^{-D}$. The log-log plot builds itself live.

**Compare three fractals:** run box-counting on three shapes simultaneously: (1) the Koch snowflake (deterministic fractal, theoretical $D = 1.26$), (2) the UK coastline (natural fractal, $D \approx 1.25$), (3) a simple circle ($D = 1.0$ exactly). All three log-log plots appear on the same axes, with the slopes labeled. Koch and UK coastline overlap perfectly — confirming that the natural coastline has the same roughness as the mathematical fractal.

**Mandelbrot set boundary:** render the Mandelbrot set at high resolution and apply box-counting to its boundary. The expected $D = 2$. The log-log plot should show a slope approaching 2 at fine scales. This is the hardest to verify numerically (requires very high resolution rendering to see $D$ = 2 vs. $D$ = 1.9), but even demonstrating that the slope is noticeably greater than the Koch snowflake's 1.26 makes the point.

**Multifractal analysis teaser:** for more complex objects (DLA cluster from M015, or Rule 30 pattern from M020), the box-counting dimension is not constant across scales — different "neighborhoods" of the fractal have different local dimensions. Show the generalized Rényi dimensions $D_q$ for $q = 0, 1, 2$ (box-counting, information dimension, correlation dimension). The spread $D_0 > D_1 > D_2 > 0$ indicates multifractal structure. This is a natural tease for a future "Hard" video on multifractals.

---

## The Interactive Demo

- **Shape selector**: UK coastline / Norway coastline / Koch snowflake (5th generation) / Sierpinski triangle / Mandelbrot set boundary / Circle / Custom image upload.
- **Epsilon range slider**: sets the minimum and maximum epsilon values for the measurement. Default: auto-range (1/2 to 1/200 of canvas size).
- **"Measure D" button**: runs the box-counting at all epsilon values and shows the log-log plot. Reports $D$ with a confidence interval (from regression R²).
- **"Animate box counting" toggle**: for the currently selected epsilon, shows the box-grid overlay and animates the counting. Checkbox.
- **"Show all scales" toggle**: shows the full log-log plot including the non-scaling regions, with the scaling region highlighted in green and the non-scaling regions in gray. Teaches students to identify the correct regression range.
- **Resolution slider**: for the Koch snowflake, controls the number of iteration levels (3–7). Higher levels provide finer data for the lower cutoff.
- **"Compare" mode**: run two shapes simultaneously and overlay their log-log plots for visual comparison.
- **Epsilon slider**: when "Animate box counting" is on, this slider manually controls the current epsilon. Moving it shows the changing grid overlay.
- **"Export data" button**: downloads the full log-log table as CSV for offline analysis.
- **"Ruler method" toggle**: switches from box-counting to the compass/ruler method — draw the shape by stepping along it with a ruler of length $\varepsilon$ and count steps. Shows the complementary measurement method.
- **Grid color picker**: change the color of the box-count grid overlay (default: semi-transparent red).

---

## Production Notes

**Code structure:** `boxCount.js` (core box-counting algorithm with Uint8Array grid), `fractalDimension.js` (multi-scale measurement, regression, scaling region detection), `shapes.js` (Koch snowflake generator, circle, Sierpinski triangle as point sets), `coastline.js` (GeoJSON loader and coordinate projection to canvas), `mandelbrotBoundary.js` (render Mandelbrot and extract boundary pixels), `render.js` (Canvas 2D: shape, grid overlay, log-log plot).

**GeoJSON coastline data:** use Natural Earth's `ne_10m_coastline.shp` converted to GeoJSON (~85MB full resolution). Project to screen coordinates using a Mercator or equirectangular projection centered on the UK. Only load the UK extent (crop to lat [49, 61], lon [-8, 2]).

**Visual layout:** main canvas (70% width) shows the coastline or fractal with the box-grid overlay. Right panel (30%): the log-log plot (primary output), the scaling region controls, and the $D$ readout in large text. The log-log plot should have: x-axis = $\log(1/\varepsilon)$, y-axis = $\log N(\varepsilon)$, with the regression line drawn and its slope labeled prominently.

**Key cinematic moments:**
1. **0:00–0:45** — Ruler paradox animation. UK coastline measurement grows with finer ruler. The length numbers are dramatic.
2. **0:45–1:00** — Log-log plot appears. The slope is labeled "D = 1.25". This is the punchline of the intro.
3. **2:30–3:00** — The broken measurement: D = 1.47. "The code is correct. The answer is wrong. Why?"
4. **3:00–3:30** — The three-regime explanation. Show the log-log plot with the two non-scaling regimes highlighted. The student looks at the full curve, not just the regression.
5. **4:30–5:00** — The Uint8Array fix: profiler shows string allocation hot spot eliminated. 50× speedup.
6. **5:00–5:30** — The animated box-counting for three scales: 50px, 10px, 2px. The count triples each time the epsilon halves (approximately) — confirmed by the slope.
7. **6:00–6:30** — Koch snowflake vs. UK coastline overlay on log-log. Slopes match. "The coastline is as rough as a mathematical fractal."
8. **7:00–7:30** — Mandelbrot set boundary: D approaching 2. "The most complex boundary in mathematics is space-filling." Zoom into the Mandelbrot set to end the video with a beautiful visual.

**The "wow" visual:** render the UK coastline in high resolution (Natural Earth 1:10m scale). Overlay a 20×20 pixel box grid with semi-transparent red squares over all occupied boxes. Then step through epsilon = 200, 100, 50, 20, 10, 5, 2 pixels — the grid becomes finer, the red squares multiply, and the log-log plot builds its line in real time. The animation takes about 20 seconds and is the visual centerpiece of the video.

---

## Tags
`fractal-dimension` `box-counting` `coastline` `mandelbrot` `self-similarity` `measurement` `canvas` `nonlinear-dynamics`

---

## Thumbnail

The UK coastline rendered at high detail against a black background, white line. Over the coastline, a red grid of boxes at moderate resolution (~30×30 boxes) is overlaid, with each box containing coastline segments lit in bright red. In the top-left: a small ruler icon with the label "How long is this?" In the bottom-left: the log-log plot mini-graph showing the linear scaling region and the labeled slope "D = 1.25". Bold white text across the top: **"THE UK COASTLINE IS INFINITELY LONG."** Smaller white text below: **"(And how to measure its roughness)"**. The high-contrast white coastline against black makes the jagged fractal detail immediately apparent.
