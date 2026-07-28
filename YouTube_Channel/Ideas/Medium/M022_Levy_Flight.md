---
title: "Some Random Walks Jump Farther Than They Should (Lévy Flight)"
id: M022
difficulty: 5.5
prereq: "M021"
concept: "Lévy flight: jump lengths drawn from a power-law distribution P(l) ∝ l^(-α) with α<3; no finite variance → no central limit theorem; mean displacement grows faster than diffusion; seen in animal foraging, financial markets, seismic data."
tags: [levy-flight, power-law, heavy-tail, random-walk, anomalous-diffusion, foraging, financial-markets, stochastic]
category: medium
type: video-idea
---

# Some Random Walks Jump Farther Than They Should (Lévy Flight)

**Alt title:** "The Random Walk That Breaks the Central Limit Theorem"
**Difficulty:** 5.5/10 | **Prereq:** M021

---

## Opening Hook (0:00–1:00)

GPS tracking data for an albatross flying over the South Atlantic, overlaid on a satellite map — the white line traces its path. For long stretches it wanders in short, erratic local loops. Then suddenly it flies in a nearly straight line for 800 kilometers. Then local loops again. Then another 500-kilometer straight leg. The pattern of local search interspersed with occasional long jumps is unmistakable.

Cut to: a trading screen — stock price. 1000 small daily fluctuations, then a crash of 15% in one day. Then more small fluctuations.

Cut to: seismograph readings — small vibrations, then a magnitude-8 earthquake releases more energy than the previous month of small quakes combined.

Narrator: *"Standard probability theory assumes that randomness is gentle — that big jumps are exponentially rare, that the central limit theorem tames all fluctuations. But nature doesn't always play by those rules. Some systems have randomness that's fundamentally different — randomness that doesn't have a finite variance. And Benoît Mandelbrot understood why."*

---

## The Naive Attempt

Coming off the Brownian motion video (M021), the student knows that Gaussian steps produce MSD $\propto t$. They want to see what happens with a "bigger" distribution — long-tailed steps. They try using an exponential distribution:

```javascript
// Attempt: exponential step lengths (still light-tailed)
function exponentialSample(lambda) {
  return -Math.log(1 - Math.random()) / lambda;
}

function levyStep_WRONG(lambda) {
  const length = exponentialSample(lambda); // exponential tail
  const angle = Math.random() * 2 * Math.PI;
  return { dx: length * Math.cos(angle), dy: length * Math.sin(angle) };
}
```

Running this: the walk looks slightly more extreme than Gaussian but not qualitatively different. The MSD still grows as $t^1$ (because the exponential distribution has finite variance — all its moments exist). No qualitative difference from Brownian motion.

The student then reads about power-law distributions and tries the following "Lévy distribution" implementation:

```javascript
// Attempt: power-law using inverse CDF method, but gets the formula wrong
function levySample_WRONG(alpha) {
  // Student derives inverse CDF of P(l) ∝ l^(-alpha) incorrectly
  // Forgets the normalization factor and the stability index relationship
  return Math.pow(Math.random(), -1 / alpha); // WRONG exponent relationship
}
```

With `alpha = 2.0`: the resulting distribution has a finite variance (because $\alpha > 2$), so the walk still looks roughly Brownian. The student can't reproduce the qualitative difference they expected. The plot of step-length distribution on a log-log scale doesn't show a clean power-law — the tail wobbles because the exponent is wrong. The MSD grows linearly with time — exactly like Brownian motion. Total failure to reproduce the Lévy flight behavior.

---

## The Moment of Failure

The student plots the step-length histogram on a log-log scale. For genuine Lévy flights with $\alpha = 1.5$, the histogram should be a straight line on log-log with slope $-\alpha$. Instead, the histogram shows a line with slope ≈ $-2.0$ for the wrong implementation — indicating finite variance and Gaussian limiting behavior.

Running 1,000 steps of the "Lévy" walk and 1,000 steps of Brownian motion side by side: the two paths look nearly identical. There's no dramatic long jump in the "Lévy" path. The MSD plots overlay perfectly. The viewer can't distinguish the two walks visually or statistically.

Key log output: `Max step size (Lévy): 12.3 pixels. Max step size (Brownian): 9.8 pixels.` These are nearly the same — there's no "anomalous" jump. The implementation is wrong.

---

## Why It Broke — The Physics

A Lévy-stable distribution with index $\alpha$ (where $0 < \alpha < 2$) has a probability density with tail behavior $P(l) \propto l^{-\alpha-1}$ for large $l$. The key property:
- For $\alpha \geq 2$: finite variance → central limit theorem applies → sum of steps converges to Gaussian → Brownian motion.
- For $\alpha < 2$: infinite variance → CLT does NOT apply → sum of steps converges to a Lévy-stable distribution (not Gaussian) → anomalous diffusion.
- For $1 < \alpha < 2$: finite mean, infinite variance. Mean displacement is well-defined but fluctuations are unbounded.
- For $0 < \alpha < 1$: even the mean diverges.

The correct inverse CDF for a symmetric Lévy-stable step uses the Chambers-Mallows-Stuck (CMS) algorithm (1976):

$$X = \frac{\sin(\alpha (\phi + \phi_0))}{\cos(\phi)^{1/\alpha}} \cdot \left(\frac{\cos(\phi - \alpha(\phi+\phi_0))}{W}\right)^{(1-\alpha)/\alpha}$$

where $\phi$ is uniform on $(-\pi/2, \pi/2)$, $W$ is Exp(1), and $\phi_0$ is a skewness parameter (0 for symmetric). For the special case of the Cauchy distribution ($\alpha = 1$):

$$X = \tan(\phi) \quad \text{where } \phi \sim \text{Uniform}(-\pi/2, \pi/2)$$

For the special case $\alpha = 0.5$ (Lévy distribution, one-sided):

$$X = 1/N^2 \quad \text{where } N \sim \mathcal{N}(0,1)$$

The mean-square displacement for a Lévy flight scales as:

$$\langle r^2(t) \rangle \propto t^{2/\alpha} \quad \text{for } 0 < \alpha < 2$$

Note: $2/\alpha > 1$ for $\alpha < 2$ — so the MSD grows faster than linear in time (superdiffusion). This is anomalous diffusion. The exponent $2/\alpha$ can be measured empirically to determine $\alpha$.

The student's implementation used `Math.pow(Math.random(), -1/alpha)` which generates a Pareto distribution with $P(l) \propto l^{-\alpha-1}$ but with the cutoff at $l=1$. If `alpha = 2.0`, this gives a distribution with finite variance because the cutoff changes the tail behavior in the region where most of the variance comes from. The correct implementation must use $\alpha < 2$ for genuine heavy-tail behavior, and must use the proper CMS algorithm or the Pareto inverse CDF with a tail exponent satisfying $\alpha_{\text{tail}} = \alpha_{\text{stability}}$.

---

## The One Concept

**Lévy Flights and Anomalous Diffusion**

Benoît Mandelbrot, in the early 1960s while studying cotton prices at IBM, noticed that the distribution of daily price changes had a much fatter tail than the Gaussian model assumed by standard financial theory. Large price swings occurred far more often than the Gaussian model predicted. He found that price changes followed a Lévy-stable distribution — a family of distributions parameterized by the index $\alpha \in (0, 2]$ that Paul Lévy had characterized mathematically in the 1920s.

The key property of Lévy-stable distributions: they are the fixed points of the central limit theorem for heavy-tailed processes. Just as the Gaussian distribution is the limiting distribution for sums of finite-variance random variables, a Lévy-stable distribution is the limiting distribution for sums of power-law-tailed random variables with $\alpha < 2$. The difference is that the Lévy-stable distribution itself has an infinite variance — sums of such variables don't "normalize" to a Gaussian no matter how many you add. The tail of the distribution always dominates.

A Lévy flight is a random walk where the step lengths are drawn from a Lévy-stable distribution: most steps are small (like Brownian motion), but occasionally there is a very long jump. These long jumps occur with probability proportional to $l^{-\alpha}$ — much more often than an exponential tail would allow. The result: the particle makes a cluster of small local steps, then jumps long-distance, makes another cluster, jumps again. The spatial pattern is self-similar at all scales — it's a fractal with dimension $\alpha$ (less than 2 in 2D).

The biological motivation comes from optimal foraging theory. If prey is randomly distributed in patchy clusters, what is the optimal search strategy? In 1999, Viswanathan et al. showed that for certain prey distributions, a Lévy flight with $\alpha \approx 2$ minimizes the expected search time per food find — it outperforms Brownian motion because the long jumps allow the forager to escape depleted local patches efficiently. GPS data from albatrosses, sharks, marine turtles, and bees showed Lévy-flight-like patterns. (Note: the 1999 result was partially revised in 2010 — the evidence for biological Lévy flights is real but more nuanced than originally claimed, with some species showing intermittent switching between Brownian and Lévy phases rather than pure Lévy statistics.)

Financial applications: Mandelbrot's observation that price changes have heavy tails (later quantified as $\alpha \approx 1.5$–$1.7$ for equity markets) implies that extreme events (Black Monday, market crashes) are much more probable than Gaussian models predict. The Black-Scholes model assumes Gaussian returns — and systematically underprices far-out-of-the-money options (tail risk). Models using Lévy-stable processes or Student-t distributions provide better tail risk estimates, and have been adopted in risk management practice (Value-at-Risk models post-2008).

---

## The Fix

Use the Chambers-Mallows-Stuck algorithm for symmetric Lévy-stable sampling, and implement correctly for a given stability index $\alpha$:

```javascript
// CMS algorithm for symmetric Lévy-stable distribution
// Returns a sample from stable(alpha, 0, 1, 0)
function levyStableSample(alpha) {
  if (alpha === 2) {
    // Special case: Gaussian
    const [g] = gaussianPair();
    return g * Math.SQRT2;
  }
  if (alpha === 1) {
    // Special case: Cauchy
    const phi = (Math.random() - 0.5) * Math.PI;
    return Math.tan(phi);
  }

  // General CMS algorithm
  const phi = (Math.random() - 0.5) * Math.PI;
  const W = -Math.log(Math.random()); // Exp(1)
  const zeta = 0; // symmetric case: skewness = 0, so zeta = 0

  const term1 = Math.sin(alpha * (phi + zeta)) / Math.pow(Math.cos(phi), 1 / alpha);
  const term2 = Math.pow(
    Math.cos(phi - alpha * (phi + zeta)) / W,
    (1 - alpha) / alpha
  );
  return term1 * term2;
}

// A Lévy flight step: random direction, Lévy-stable magnitude
function levyFlightStep(alpha, scale) {
  const magnitude = Math.abs(levyStableSample(alpha)) * scale;
  const angle = Math.random() * 2 * Math.PI;
  return { dx: magnitude * Math.cos(angle), dy: magnitude * Math.sin(angle) };
}
```

With $\alpha = 1.5$ and `scale = 2`: the walk now shows visually dramatic long jumps. Log output: `Max step size: 2847 pixels` — compared to `Max step size: 12 pixels` for Brownian motion. The paths look completely different. The MSD plot shows clear superdiffusion: slope ≈ $2/\alpha = 1.33$ on the log-log plot, vs. slope = 1.0 for Brownian motion.

Verify: plot the step-length histogram on log-log scale. Fit a regression line to the tail. The slope should be $-\alpha - 1 = -2.5$ for $\alpha = 1.5$. Measure from the simulation: slope ≈ $-2.47 \pm 0.05$. ✓

---

## The Wow Moment — Push It

**Lévy vs. Brownian foraging simulation:** set up a 2D plane with 500 "food sources" scattered in 20 random clusters (not uniformly distributed). Release one Brownian forager and one Lévy forager ($\alpha = 1.5$) from the same starting point. Count how many food sources each collects in 10,000 steps. Run this 100 times. Box plot the results: Lévy forager typically collects 2–3× more food than the Brownian forager for clustered prey distributions. Change to uniformly distributed prey: the advantage disappears. This directly demonstrates the Viswanathan optimal foraging result.

**Financial market simulation:** generate 1,000 "days" of asset returns using (1) Gaussian returns (Black-Scholes), (2) Student-t returns ($\nu = 3$ degrees of freedom), and (3) Lévy-stable returns ($\alpha = 1.7$). Plot the three return series and their histograms. Count the "3-sigma" events (daily returns > 3 standard deviations): theory says ~0.3% for Gaussian, but the Lévy series generates ~2% — 7× more extreme events. Overlay the 2008 financial crisis return series. The Lévy model visually matches the real data; Gaussian does not. This is Mandelbrot's insight made concrete.

**Self-similar zoom:** record a Lévy flight path with $\alpha = 1.0$ (Cauchy). Zoom in by 10×, 100×, 1000× on a segment of the path. Each zoom reveals the same self-similar cluster-and-jump structure — the path is a fractal. Overlay a scale bar to make the self-similarity explicit. The fractal dimension of a Lévy flight path is $\min(\alpha, 2)$.

---

## The Interactive Demo

- **Alpha slider (stability index)**: 0.5–2.0, step 0.05. Default 1.5. This is the main control. Labels at key values: 0.5 (Lévy distribution), 1.0 (Cauchy), 2.0 (Gaussian/Brownian).
- **Scale slider**: 0.1–20. Controls the typical small-step size.
- **Number of particles**: 1–1,000. Default 10.
- **"Compare with Brownian" toggle**: shows a Brownian motion particle (alpha=2) alongside the Lévy particles, in a contrasting color.
- **"Show MSD plot" toggle**: live log-log MSD plot comparing Lévy vs. Brownian. Annotates the measured slope and the theoretical value $2/\alpha$.
- **"Show step histogram" toggle**: plots the distribution of step lengths on a log-log scale. Shows the power-law tail as a straight line. Fits a regression and displays the measured slope ($-\alpha - 1$).
- **"Foraging mode" button**: switches to the foraging simulation with clustered food sources. Shows food collection count per forager type.
- **"Financial mode" button**: generates 1,000-day return series for Gaussian, Student-t ($\nu$=3), and Lévy (current $\alpha$). Shows the return series and extreme-event count.
- **Truncation slider (upper cutoff)**: 0 = no truncation, 1–1000 = maximum allowed step size. Shows how truncation causes crossover from Lévy to Brownian at long times (physical systems often have a maximum scale).
- **Trail length slider**: 50–2,000 steps of visible path. Large alpha steps: long trail needed to show structure. Small alpha: short trail is sufficient.
- **Color mode**: monochrome / alpha-by-age (fading trail) / color-by-step-length (short steps = blue, long steps = red — makes the heavy-tail jumps visually obvious).

---

## Production Notes

**Code structure:** `levyStable.js` (CMS sampler for arbitrary alpha, includes special cases for alpha=1 and alpha=2), `levyWalk.js` (particle simulation), `brownian.js` (Gaussian particle for comparison, imported from M021), `msdAnalysis.js` (slope fitting on log-log MSD, shared with M021 codebase). The M022 code base should literally import and reuse M021's Brownian motion code as a comparison — modeling good software practice.

**Numerical stability:** the CMS algorithm can produce very large values for $\alpha$ near 0 and for extreme $\phi$ values near $\pm\pi/2$. Add a clamp: `Math.min(result, MAX_STEP)` where `MAX_STEP = canvas.width * 50`. This is equivalent to physical truncation of the Lévy distribution and is honest about what real systems do (they can't actually jump infinitely far).

**Key cinematic moments:**
1. **0:00–0:45** — Albatross GPS track + stock price crash + seismograph. Three domains, same pattern.
2. **1:30–2:00** — Side-by-side Brownian vs. Lévy (wrong implementation): "They look the same... something is wrong."
3. **3:30–4:00** — The log-log step histogram: wrong exponent → straight line with wrong slope. Then the correct CMS implementation → slope changes to match theory.
4. **4:30–5:00** — The dramatic first Lévy walk with $\alpha = 1.0$ (Cauchy): one particle, single step = 2,847 pixels (off-screen). Zoom out to reveal the jump. Dramatic pause.
5. **5:30–6:00** — The alpha slider from 2.0 (Brownian) to 0.5 (extreme Lévy): watch the walk transform from gentle to chaotic. Real-time MSD slope annotation changes from 1.0 to 4.0.
6. **6:30–7:00** — Foraging simulation: Lévy vs. Brownian, 100 trials. Box plot shows median food collection. "Evolution independently discovered this."
7. **7:30–8:00** — Financial mode: Gaussian vs. Lévy returns, with the 2008 return series overlaid.

**Screen layout during coding:** VSCode left (55%), split canvas right showing both Lévy walk (top) and log-log MSD plot (bottom, 40% height). The alpha slider is prominently displayed between them. Changing alpha in real time simultaneously updates both panels.

---

## Tags
`levy-flight` `power-law` `heavy-tail` `random-walk` `anomalous-diffusion` `foraging` `financial-markets` `stochastic`

---

## Thumbnail

Black background. Left half: a dense, tangled Brownian motion path in blue — compact, no outliers. Right half: a Lévy flight path ($\alpha = 1.2$) in bright orange — with several dramatically long jumps visible as straight lines cutting across the canvas, plus clusters of local wandering. Both paths start from the same center point (white dot). Bold white text across the center: **"SOME RANDOM WALKS CHEAT."** Below, in smaller text: **"Lévy Flight vs. Brownian Motion"**. A red arrow points to one of the long Lévy jumps, labeled **"THIS SHOULDN'T HAPPEN"** in a speech-bubble style.
