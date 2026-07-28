---
title: "Finding the Global Minimum With Fake Temperature (Simulated Annealing)"
id: M048
difficulty: 5.5/10
prereq: "None"
concept: "Simulated annealing: accept worse solutions with probability e^(-ΔE/T); temperature T decreases on schedule; escapes local minima; Metropolis criterion; convergence to global optimum as T→0 (in infinite time)."
tags: [simulated-annealing, optimization, metropolis, temperature-schedule, local-minima, combinatorial-optimization, canvas, stochastic]
category: medium
type: video-idea
---

# Finding the Global Minimum With Fake Temperature (Simulated Annealing)

**Alt title:** "Sometimes You Have to Get Worse to Get Better (Simulated Annealing)"
**Difficulty:** 5.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Show a jagged 2D energy landscape — a function with dozens of peaks and valleys, one very deep global minimum hidden among many shallower local minima. Drop a ball on the surface. It rolls downhill and gets stuck in the very first valley it finds — not the global minimum. "Greedy hill-climbing: always takes the downhill step. Always gets stuck." Reset. Drop the ball again. Same valley.

"Now imagine the ball is hot. So hot that it sometimes randomly bounces upward. At first, it bounces wildly — almost ignoring gravity. But as it cools, the bounces get smaller and smaller. By the time it's nearly cold, it can only go downhill — but it's already escaped all the local traps and settled near the global minimum."

The ball animation: chaotic jumping at first, gradually damping into a steady descent, landing precisely in the deepest valley. "That's simulated annealing. And we're going to build it tonight, find out what breaks it, and then use it to solve the Travelling Salesman Problem in real time."

---

## The Naive Attempt

Implement greedy local search (gradient descent with random restarts):

```javascript
function greedySearch(costFn, randomNeighbor, initialState) {
  let current = initialState;
  let currentCost = costFn(current);
  let bestEver = current;
  let bestCost = currentCost;

  for (let iter = 0; iter < MAX_ITER; iter++) {
    const neighbor = randomNeighbor(current);
    const neighborCost = costFn(neighbor);

    if (neighborCost < currentCost) {
      // Only accept improvements
      current = neighbor;
      currentCost = neighborCost;
      if (currentCost < bestCost) {
        bestEver = current;
        bestCost = currentCost;
      }
    }
    // Reject all uphill moves unconditionally
  }
  return bestEver;
}
```

Apply to the TSP (Travelling Salesman Problem): 20 cities, cost = total route length, neighbor = swap two random cities in the route. The greedy approach quickly converges to a "local optimum" route that looks visually terrible — many crossings, clearly suboptimal. The cost meter plateaus far above the true optimum.

Try random restarts: run the greedy search 100 times from random starting routes, take the best. Better, but still far from optimal because the local optima are dense in TSP space. And the 100× compute cost is brutal for larger instances.

---

## The Moment of Failure

Show the TSP tour after greedy search: a chaotic, crossing path, cost = 847 (arbitrary units). Show the optimal tour (computed for this small instance by brute force): cost = 512. Gap: 65% worse than optimal.

Run 100 random restarts. Best found: 598 — still 17% worse than optimal, and it took 100× as long. Show the convergence plot: cost drops quickly at first (easy improvements), then plateaus into a flat line. Every restart escapes to a different local minimum, but the plateau is the same height across all of them. "We're trapped in a basin of local minima, and random restarts can't escape because even the initial random routes are already near local optima after just a few greedy steps."

---

## Why It Broke — The Physics

The metaphor for simulated annealing comes from metallurgy. When a metal is annealed (slowly cooled from high temperature), the atoms have enough thermal energy to rearrange themselves into lower-energy configurations. If cooled too quickly (quenched), they freeze in a disordered, high-energy state. Slow cooling allows the atoms to find the true minimum-energy crystal structure.

The statistical mechanics foundation: at temperature T, a system in state with energy E₁ will spontaneously transition to a state with energy E₂ with probability:
> **P(E₁ → E₂) = min(1, e^(-(E₂-E₁)/kT))**

This is the **Boltzmann distribution** / **Metropolis criterion**. For E₂ < E₁ (downhill): probability = 1 (always accept). For E₂ > E₁ (uphill): probability = e^(-ΔE/kT) ∈ (0,1). At high T, almost all uphill moves are accepted (random walk). As T → 0, only downhill moves are accepted (greedy search).

The key insight: at high temperature, the system explores the energy landscape without bias. At low temperature, it exploits the best basin it found during exploration. The cooling schedule T(t) controls the exploration-exploitation tradeoff.

Convergence theorem (Hajek 1988): if the cooling schedule is:
> **T(t) ≥ Γ / log(1 + t)**

where Γ is the "depth" of the deepest local minimum (the maximum energy barrier between any local minimum and the global minimum), then the algorithm converges to the global minimum with probability 1 as t → ∞. In practice, logarithmic cooling is too slow — polynomial or exponential schedules are used with an accepted risk of missing the global optimum.

Common cooling schedules:
- **Exponential:** T(t) = T₀ · α^t, α ∈ [0.99, 0.9999]. Simple, effective.
- **Logarithmic:** T(t) = T₀ / log(1 + t). Theoretically optimal, practically too slow.
- **Linear:** T(t) = T₀ · (1 - t/t_max). Fast, often suboptimal.
- **Adaptive:** adjust cooling rate based on acceptance ratio — if accepting too many moves, cool faster; if accepting too few, reheat slightly.

---

## The One Concept

**Simulated Annealing: Probabilistic Uphill Moves for Global Optimization**

Simulated annealing (Kirkpatrick, Gelatt, Vecchi, 1983) is a metaheuristic for global optimization. It extends local search by allowing occasional uphill moves — transitions to worse solutions — with a probability that decreases over time. This controlled randomness allows the algorithm to escape local minima.

The algorithm is elegantly simple:

```
Initialize: state = random; T = T_start
For each step t:
  neighbor = perturb(state)         // small random change
  ΔE = cost(neighbor) - cost(state) // positive = worse
  if ΔE < 0: accept (always)        // downhill: always take it
  else: accept with probability e^(-ΔE/T)  // uphill: sometimes take it
  if accepted: state = neighbor
  T = coolingSchedule(T, t)
Return best state seen
```

The **Metropolis criterion** `P = e^(-ΔE/T)` is the heart of the algorithm. Note:
- When T is large: P ≈ 1 for small ΔE (almost always accept uphill moves) → random walk.
- When T is small: P ≈ 0 for even small ΔE → greedy descent only.
- The transition is continuous and smooth — no sharp boundary.

**TSP application in detail:**

State: a permutation of N cities representing the tour order.
Cost: total Euclidean distance of the tour.
Perturbation (neighbor generation): the "2-opt" move — pick two edges (i,j) and (k,l), remove them, reconnect differently. This reverses the subsequence between i and k, potentially uncrossing an edge crossing.

```javascript
function twoOptSwap(route, i, k) {
  // Reverse the segment from i to k
  const newRoute = [...route];
  while (i < k) {
    [newRoute[i], newRoute[k]] = [newRoute[k], newRoute[i]];
    i++; k--;
  }
  return newRoute;
}

function tspCost(route, cities) {
  let total = 0;
  for (let i = 0; i < route.length; i++) {
    const a = cities[route[i]];
    const b = cities[route[(i+1) % route.length]];
    total += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return total;
}
```

**The ΔE computation for 2-opt is O(1):** Only the two removed and two added edges change. So ΔE = (new edge 1 + new edge 2) - (old edge 1 + old edge 2). No need to recompute the full tour length.

**Temperature calibration:** A practical rule — start T₀ such that e^(-ΔE_avg/T₀) ≈ 0.8 (accept ~80% of uphill moves initially). Measure the average uphill ΔE over 100 random moves to estimate ΔE_avg, then set T₀ = -ΔE_avg / ln(0.8).

End temperature T_f should be set so e^(-ΔE_min/T_f) ≈ 0.001 — almost no uphill moves accepted. For TSP, ΔE_min is approximately the shortest edge length in the graph.

**Acceptance rate monitoring:** Track the rolling acceptance ratio (accepted moves / total moves). Ideal: starts at ~80%, ends at ~1%. If it drops too fast, the cooling is too aggressive. If it stays above 10% for most of the run, cooling is too slow. An adaptive schedule adjusts the cooling rate to hit a target acceptance rate trajectory.

Real applications: circuit board layout (the original 1983 application), protein folding (finding minimum energy protein conformations), job shop scheduling, VLSI routing, image segmentation. In machine learning, simulated annealing was used for neural architecture search and hyperparameter optimization before Bayesian optimization became dominant. It remains competitive for problems with rugged, discontinuous energy landscapes where gradient methods fail.

---

## The Fix

Full simulated annealing implementation with adaptive cooling:

```javascript
function simulatedAnnealing(cities, config = {}) {
  const {
    T_start = 1000,
    T_end = 0.01,
    alpha = 0.9995,    // geometric cooling
    maxSteps = 1e6,
    adaptiveCooling = true
  } = config;

  let route = [...Array(cities.length).keys()].sort(() => Math.random() - 0.5);
  let cost = tspCost(route, cities);
  let bestRoute = [...route], bestCost = cost;
  let T = T_start;
  let acceptanceWindow = [];

  for (let step = 0; step < maxSteps && T > T_end; step++) {
    // Generate 2-opt neighbor
    const i = Math.floor(Math.random() * route.length);
    const k = Math.floor(Math.random() * route.length);
    if (i === k) continue;
    const [a, b] = i < k ? [i, k] : [k, i];

    // O(1) delta cost for 2-opt
    const ca = cities[route[a]], cb = cities[route[(a+1) % route.length]];
    const ck = cities[route[b]], cl = cities[route[(b+1) % route.length]];
    const oldCost = Math.hypot(cb.x-ca.x, cb.y-ca.y) + Math.hypot(cl.x-ck.x, cl.y-ck.y);
    const newCost = Math.hypot(ck.x-ca.x, ck.y-ca.y) + Math.hypot(cb.x-cl.x, cb.y-cl.y);
    const deltaE = newCost - oldCost;

    const accepted = deltaE < 0 || Math.random() < Math.exp(-deltaE / T);
    if (accepted) {
      // Apply 2-opt: reverse segment [a+1 .. b]
      let lo = a + 1, hi = b;
      while (lo < hi) { [route[lo], route[hi]] = [route[hi], route[lo]]; lo++; hi--; }
      cost += deltaE;
      if (cost < bestCost) { bestCost = cost; bestRoute = [...route]; }
    }

    // Adaptive cooling: track acceptance rate
    acceptanceWindow.push(accepted ? 1 : 0);
    if (acceptanceWindow.length > 1000) acceptanceWindow.shift();
    if (adaptiveCooling && step % 1000 === 0) {
      const rate = acceptanceWindow.reduce((s,v)=>s+v,0) / acceptanceWindow.length;
      if (rate < 0.1) T *= 1.02;    // too cold — reheat slightly
      if (rate > 0.4) alpha = 0.999; // too hot — cool faster
    }

    T *= alpha;
  }
  return { route: bestRoute, cost: bestCost };
}
```

Result on 20-city TSP: finds solutions within 2–5% of optimal consistently. On 100-city TSP: within 5–10% in under 1 second of browser compute.

---

## The Wow Moment — Push It

**Live TSP visualization:** 50 cities on screen, the current tour drawn as connecting lines, updating in real time as the algorithm runs. Color-code the tour lines: red for edges being considered for removal, green for edges being added. Watch the algorithm make what look like mistakes (temporarily lengthening the tour) — and then watch it recover to a globally better solution.

**Temperature visualization:** Show a heat map of the screen where "hot" regions (near the current tour) glow orange/red, cooling to blue as the algorithm progresses. The visual metaphor of cooling is literal.

**Energy landscape:** For a simpler 1D optimization problem, show the energy landscape as a curve, and the current point as a ball. Animate the ball making uphill jumps (rejected with probability P) vs. accepted uphill jumps (rare but crucial for escaping local minima). Show the jump height distribution changing as T decreases.

**Cooling schedule comparison:** Run the same problem with three schedules simultaneously — fast cooling (α=0.99), medium (α=0.9999), slow (α=0.999999). Show all three cost curves. The fast one gets stuck immediately; the slow one finds the global optimum but takes forever; the medium one is the sweet spot.

---

## The Interactive Demo

**City count slider:** 5–200 cities (TSP).
**Initial temperature slider:** 10–100,000.
**Cooling rate (alpha) slider:** 0.99–0.999999.
**Step size per frame:** 100–100,000 SA steps per animation frame.
**Adaptive cooling toggle:** auto-adjust cooling based on acceptance rate.
**"Show acceptance probability" overlay:** color each potential move on screen by its acceptance probability (green = high, red = near-zero).
**Live charts:** cost vs. iteration, temperature vs. iteration, acceptance rate vs. iteration.
**Energy landscape mode:** switch to 1D/2D function optimization to see the landscape directly.
**"Quench" button:** slam T to 0 immediately — watch the algorithm freeze in its current local minimum, showing why gradual cooling is essential.
**"Reheat" button:** spike T back up — watch the algorithm start exploring again, possibly escaping the current minimum.

---

## Production Notes

**Code to show on screen:** The Metropolis criterion: `Math.exp(-deltaE / T)` — just one line. This one expression is the entire algorithm. Everything else is scaffolding. Make this single line the visual center of the code explanation.

**Key visual at 3:00:** Energy landscape animation. Show a 2D energy surface (3D rendered), drop multiple balls. Some fall into local minima. One ball, representing SA, makes uphill jumps and eventually reaches the global minimum. This 30-second animation is the core intuition and earns all the math that follows.

**Key cinematic moment at 5:30:** The 50-city TSP solution converging in real time. The tour starts as a chaotic mess of crossings. Over 10 seconds of real time (millions of SA steps), the crossings gradually disappear as the algorithm un-crosses edges. By the end, the tour is a clean convex hull approximation. The viewer physically wants to watch this — it's satisfying in the same way as watching a tangle unravel.

**Key moment at 8:00:** Cooling schedule comparison — three cost curves, three final tour visualizations. The medium schedule result is dramatically better than the fast-cooling result. This is the "tuning matters" lesson.

**Music:** Start with chaotic, atonal notes (high temperature phase) that gradually resolve into a melodic theme (low temperature convergence). Subtle but effective.

---

## Tags

`simulated-annealing` `optimization` `metropolis` `temperature-schedule` `local-minima` `combinatorial-optimization` `canvas` `stochastic`

---

## Thumbnail

**Split visual:** Left side — a tangled, crossing TSP tour path over a scatter of city dots, bright red crossings highlighted, label "GREEDY: COST 847". Right side — a clean, near-optimal TSP tour, smoothly connecting the same cities, label "ANNEALING: COST 512". Dividing center: a thermometer icon going from red (hot) at the top to blue (cold) at the bottom, with the formula `e^(-ΔE/T)` in gold beside it. Bold white title: "SOMETIMES YOU NEED TO GET WORSE". Subtitle: "SIMULATED ANNEALING". The emotional hook: the idea of deliberately making things worse to ultimately make them better is counterintuitive enough to stop the scroll.
