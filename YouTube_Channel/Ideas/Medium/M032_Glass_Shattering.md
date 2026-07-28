---
title: "How Glass Shatters Under Impact (Explosive Fragmentation)"
id: M032
difficulty: 6/10
prereq: "None"
concept: "Crack propagation under stress: stress intensity factor K_I = σ√(πa) where a is crack length; fracture toughness K_IC is material property; branching when K_I exceeds K_IC·√2; fragment size distribution follows power law."
tags: [fracture, crack-propagation, stress-intensity, fragmentation, power-law, Voronoi, canvas, structural-mechanics]
category: medium
type: video-idea
---

# How Glass Shatters Under Impact (Explosive Fragmentation)

**Alt title:** "The Math Behind a Smashed Screen (Crack Propagation Physics)"
**Difficulty:** 6/10 | **Prereq:** None (basic stress concepts helpful)

---

## Opening Hook (0:00–1:00)

High-speed footage (1000fps, real video, licensed or CC) of a glass pane being struck by a stone in slow motion. The impact point blossoms into a spider-web of cracks radiating outward. Some cracks branch; some terminate; the pattern crystallizes into hundreds of fragments of wildly varying sizes, from large triangular shards to tiny slivers near the impact.

Freeze on the crack pattern. Voiceover: *"This pattern is not random. Every crack follows the path of maximum stress. The branching, the spacing, the fragment sizes — all governed by physics we can code. And when you look at the fragment size distribution, something surprising appears: it follows a power law. The same mathematical structure as earthquake magnitudes, neural firing rates, and city population distributions. Let's build it."*

Cut to a blank canvas. Drop a "rock" on a simulated glass pane. Cracks appear — but only in a crude ring. No branching, no realistic pattern. "Let's figure out what's missing."

---

## The Naive Attempt

**What we code first:** Pre-compute a Voronoi tessellation of the glass pane. When impact occurs, simply reveal the Voronoi cells as fragments. Apply impulses to each fragment. It looks vaguely like broken glass but the pattern is wrong: no radial crack structure, no branching pattern consistent with an impact point.

```javascript
// Naive: random Voronoi fragmentation (not physically motivated)
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

// Generate N random Voronoi seed points
function generateVoronoi(N = 150) {
  const seeds = Array.from({length: N}, () => ({
    x: Math.random() * W,
    y: Math.random() * H
  }));
  return seeds;
}

// Brute-force: for each pixel, find nearest seed (O(W*H*N), slow but simple)
function renderVoronoi(seeds, impactX, impactY) {
  const img = ctx.createImageData(W, H);
  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      let minDist = Infinity, minIdx = -1;
      for (let i = 0; i < seeds.length; i++) {
        const dx = px - seeds[i].x, dy = py - seeds[i].y;
        const d = dx*dx + dy*dy;
        if (d < minDist) { minDist = d; minIdx = i; }
      }
      // Color by seed index (each fragment a different color)
      const hue = (minIdx * 137.5) % 360;
      const [r, g, b] = hslToRgb(hue, 0.6, 0.7);
      const idx = (py * W + px) * 4;
      img.data[idx] = r; img.data[idx+1] = g; img.data[idx+2] = b;
      img.data[idx+3] = 255;
    }
  }
  // Draw Voronoi edges in black
  for (let py = 1; py < H-1; py++) {
    for (let px = 1; px < W-1; px++) {
      // If neighboring pixel has different seed, draw edge
      // (simplified — actual Voronoi edge detection is more robust)
    }
  }
  ctx.putImageData(img, 0, 0);
}

// On click: reveal Voronoi pattern
canvas.addEventListener('click', (e) => {
  const seeds = generateVoronoi(150);
  renderVoronoi(seeds, e.offsetX, e.offsetY);
  // Problem: fragments are uniformly sized, no radial pattern, unrealistic
});
```

The result looks like a stained-glass window: equal-sized polygonal cells with no relation to the impact point. No radial crack arms. No spider-web pattern. No large central fragments with tiny fragments near the impact. It fails the basic visual test of resembling real glass fracture.

---

## The Moment of Failure

The Voronoi fragmentation looks obviously wrong on screen. Freeze-frame the real footage beside the simulation:

**Real glass:** Radial cracks extend outward from impact point like spokes. Between the radial cracks, concentric "ring" cracks or arcs appear (Hertzian cone cracks). Fragment sizes vary enormously — near the impact, tiny slivers; far away, large triangular shards. The crack pattern is strongly anisotropic (aligned with the impact geometry).

**Naive simulation:** Uniformly distributed fragments of roughly equal size (~1/N of total area). No radial alignment. No size gradient. No relationship to the impact point position.

The diagnostic: plot a **fragment size histogram** for both. Real glass: power-law distribution (many small, few large). Naive Voronoi: roughly uniform (Poisson distribution of areas). The shapes of these histograms are fundamentally different.

Also: in the naive simulation, if you move the impact point by 100px, the fragment pattern is completely different (it's re-randomized). In reality, the crack pattern is deterministically controlled by the stress field, which does depend on the impact location.

---

## Why It Broke — The Physics

Glass fracture is governed by **linear elastic fracture mechanics (LEFM)**. The key quantity is the **stress intensity factor** K_I:

```
K_I = σ √(πa)
```

where σ is the applied stress at the crack tip and a is the crack half-length. The material has a critical fracture toughness K_IC (a material property; for glass, K_IC ≈ 0.7 MPa·√m). A crack propagates when K_I ≥ K_IC.

**Crack direction:** A crack propagates in the direction that maximizes the energy release rate G = K_I²/E (where E is Young's modulus). In mode-I fracture (opening mode), this means the crack follows the direction perpendicular to the maximum principal stress — i.e., it runs *away* from compressive stress and *into* tensile stress.

**Crack branching:** A crack accelerates as it grows (K_I increases with crack length a). When the crack velocity v exceeds about 0.38 × c_R (Rayleigh wave speed, ~1500 m/s for glass), the crack tip becomes unstable and branches into two cracks. Each daughter crack is slightly slower than the parent. This is why glass fractures show a characteristic branching tree structure.

**Fragment size distribution:** When branching happens repeatedly in a stress field that decays with distance from the impact (stress ∝ 1/r), the fragment sizes follow a power law: N(A > a) ∝ a^(-α) where α ≈ 0.5 for glass fragmentation. This is a scale-free distribution — the same mathematical form as earthquakes (Gutenberg-Richter law) because the underlying physics (crack cascades) is the same.

**The correct model:** Seeds for Voronoi tessellation should not be uniformly random. They should be weighted by the stress field: high density near the impact (more cracks, smaller fragments), lower density far away.

---

## The One Concept

**Stress Intensity Factor and Crack Propagation Criteria**

When you strike a brittle material like glass, the impact creates a stress field — a spatial distribution of internal forces per unit area. Near a crack tip, the stress field has a universal singularity: σ ∝ K_I / √r, where r is the distance from the tip. No matter how small you zoom in, the stress at the tip grows without bound — a mathematical singularity that LEFM resolves by saying "the crack propagates before the stress becomes infinite."

K_I is the amplitude of this singularity. It depends on the applied load σ, the crack geometry, and the square root of crack size a. The √a dependence is non-intuitive: a crack twice as long is only √2 times more dangerous by itself, but it reduces the effective cross-section, which increases σ, which increases K_I further — a feedback loop that makes crack growth self-accelerating once started.

The **Griffith criterion** (1921) provides the energy perspective: a crack of length 2a in a plate of unit thickness stores elastic energy U = πa²σ²/E per unit area. Creating new crack surface requires surface energy 2γ (factor 2 for two surfaces) per unit crack extension. The crack grows when ∂U/∂a ≥ ∂(Surface energy)/∂a: d(πa²σ²/E)/da = 2πaσ²/E ≥ 2γ → σ ≥ √(2Eγ/πa). This is equivalent to K_I ≥ K_IC with K_IC = √(2Eγ).

**Crack velocity and branching:** As a crack accelerates, the energy stored ahead of the tip increases. At the branching threshold v ≈ 0.38 c_R, the energy is sufficient to drive two cracks simultaneously. The branching angles are approximately ±15° from the original direction for symmetric branching (in a uniform stress field). In the non-uniform stress field near an impact, branching angles are biased toward maximum energy release direction.

**Simulation approach — weighted Voronoi:** The stress field from a point impact on a plate, approximated by Hertz contact theory, gives:

```
σ(r) ≈ P / (2πr²)  (stress decays as 1/r²)
```

The crack density (number of cracks per unit length) scales with local stress, so fragment size a ∝ 1/σ ∝ r². The number of Voronoi seeds in an annulus of radius r and width dr should be proportional to 1/a(r)² × 2πr·dr ∝ σ(r)² × r·dr ∝ r⁻⁴ × r = r⁻³. So weight seed density as r⁻³: many seeds near impact, few far away.

**Fragment size distribution as power law:** Given this seed distribution, the area of a fragment at radius r is proportional to a(r)² ∝ r⁴. The number of fragments with area > A is N(>A) ∝ A^(-1/2), a power law with exponent -0.5. This is characteristic of glass fracture experiments — validating that the stress-weighted Voronoi is a physically motivated approximation.

**Why glass is brittle:** Glass is an amorphous solid with no grain structure to deflect or blunt cracks. In crystalline metals, crack tips are blunted by dislocation formation (plastic deformation), which dissipates energy without propagating the crack. Glass has no dislocations, so cracks propagate essentially at the Rayleigh wave speed with no energy dissipation. This is why glass shatters rather than dents.

**Real-world applications:** Phone screen protectors are designed using fracture mechanics to absorb impact energy (via compressive pre-stress from tempering) before K_I can reach K_IC. Tempered glass, used in car side windows, has surface compressive stress ~100 MPa from rapid cooling; an external crack must first overcome this before K_I can drive propagation. When tempered glass does fail (at the edges where compressive pre-stress is less), it shatters into tiny, less-dangerous fragments — the same physics, engineered to fail safely.

---

## The Fix

```javascript
// Fix: stress-weighted Voronoi fragmentation
function generateStressWeightedSeeds(impactX, impactY, N = 300) {
  const seeds = [];
  // Sample seeds with density ∝ 1/r^3 using rejection sampling
  // (Or use inverse CDF: r = r_min * (1 - u)^(-1/2) for density ∝ r^(-3))
  const r_min = 5; // minimum radius from impact (avoid singularity)
  const r_max = Math.sqrt(W*W + H*H) / 2;

  for (let i = 0; i < N; i++) {
    let r, angle, x, y;
    do {
      // Inverse CDF for density ∝ r^(-2) (simpler: radial distribution)
      const u = Math.random();
      // CDF of r^(-2) density: F(r) = 1 - r_min/r → r = r_min/(1-u)
      r = r_min / (1 - u * (1 - r_min/r_max));
      angle = Math.random() * 2 * Math.PI;
      x = impactX + r * Math.cos(angle);
      y = impactY + r * Math.sin(angle);
    } while (x < 0 || x > W || y < 0 || y > H || r > r_max);
    seeds.push({ x, y, r });
  }
  return seeds;
}

// Radial crack arms: add extra seeds along N_arms radial directions
function addRadialCracks(impactX, impactY, seeds, N_arms = 8) {
  const armAngles = Array.from({length: N_arms}, (_, i) => i * Math.PI * 2 / N_arms);
  const r_max = Math.sqrt(W*W + H*H) / 2;
  for (const angle of armAngles) {
    for (let r = 10; r < r_max; r += 15 + r * 0.05) {
      const jitter = (Math.random() - 0.5) * 5;
      seeds.push({
        x: impactX + r * Math.cos(angle + jitter * 0.02),
        y: impactY + r * Math.sin(angle + jitter * 0.02),
        r
      });
    }
  }
}

// Build Voronoi using Fortune's algorithm (or simpler: brute-force for demo)
// Then compute fragment areas and velocities

function computeFragmentVelocity(fragment, impactX, impactY, impactEnergy) {
  const dx = fragment.cx - impactX;
  const dy = fragment.cy - impactY;
  const r = Math.sqrt(dx*dx + dy*dy);
  // Velocity decays with distance: v ∝ 1/r, directed radially outward
  const speed = impactEnergy / (r + 10);
  return { vx: dx/r * speed, vy: dy/r * speed, omega: (Math.random()-0.5) * speed / 50 };
}

// Fragment physics update (each fragment as a 2D rigid body)
function updateFragments(fragments, dt) {
  for (const f of fragments) {
    f.x += f.vx * dt;
    f.y += f.vy * dt;
    f.angle += f.omega * dt;
    f.vy += 200 * dt; // gravity (200 px/s² for screen-space)
    // Simple floor bounce
    if (f.y > H + 100) f.alive = false;
  }
}
```

The stress-weighted seeds produce more, smaller fragments near the impact and fewer, larger fragments far away. The added radial lines ensure the characteristic spoke pattern of impact fracture. The result visually matches real glass shattering far better than uniform Voronoi.

---

## The Wow Moment — Push It

**Multi-impact:** Click multiple times to add secondary impacts. Each new impact initiates its own crack system. Where crack systems from two impacts meet, the fragments are even smaller (double stress). The resulting pattern shows the superposition of multiple crack networks — characteristic of a rock hitting a car windshield near the edge (where existing frame cracks interact with the new impact cracks).

**Fragment size power law plot:** After shattering, compute the area of each fragment, plot as a histogram on a log-log scale. Show the power-law slope (approximately -0.5 for glass). Compare with the naive uniform Voronoi (flat histogram). Discuss the Gutenberg-Richter law for earthquakes — same slope, same physics (crack cascades).

**Slow-motion crack propagation:** Instead of revealing all fragments at once, animate the crack growth in real time — crack tips advance at the Rayleigh wave speed (simulated as ~500 px/s on screen), branching when they reach the branching threshold. Watch the crack pattern emerge crack-by-crack. This requires a fracture simulation algorithm rather than just Voronoi.

**Tempered vs. annealed glass:** Two panels side by side. Click both with the same impact. Left panel (annealed): large, dangerous, sharp fragments. Right panel (tempered): tiny, square fragments as mandated by safety glass standards. Demonstrate by showing the fragment size distributions — tempered has a much tighter distribution peaked at small sizes.

---

## The Interactive Demo

- **Impact energy slider** (0.1 to 10 J equivalent): higher energy → more cracks, smaller fragments; lower energy → few cracks, may not shatter at all (below fracture threshold)
- **Material selector** (Glass / Tempered Glass / Ceramic / Ice): each preset changes K_IC, branching threshold, fragmentation pattern; glass is uniform, tempered has pre-stress, ceramic is coarser, ice has lower fracture toughness
- **Fragment count** (50 to 500): coarser or finer Voronoi tessellation; affects performance and visual detail
- **Gravity toggle**: enable/disable gravity so fragments fly outward without falling (useful for seeing the crack pattern)
- **Crack speed** (0.1× to 5×): slows down the crack propagation animation for educational viewing
- **Multi-impact mode**: each click adds a new impact; up to 5 simultaneous impacts
- **Fragment size histogram**: live log-log histogram of fragment areas; power-law slope is estimated and displayed; toggle between naive (uniform) and physical (stress-weighted) to compare
- **Stress field overlay**: toggle a heat-map showing the Hertz stress field (red = high stress, blue = low); helps visualize why seeds are denser near impact
- **Slow-motion replay**: after shattering, replay the crack growth animation at 0.1× speed
- **Reset (R key)**: restore intact glass pane instantly
- **Pre-crack mode**: add a user-drawn initial crack (click and drag to draw); when impact occurs, the pre-crack modifies the stress field and the shattering pattern changes accordingly (demonstrates how scratches cause phones to shatter from falls)

---

## Production Notes

**Code structure:**
- `index.html`: full-screen canvas, minimal HUD (material label, fragment count)
- `voronoi.js`: Fortune's sweep-line algorithm for Voronoi tessellation (or use the `d3-delaunay` library); produces polygon list
- `fracture.js`: stress field computation, stress-weighted seed generation, radial crack addition
- `fragment.js`: Fragment class (polygon + rigid body state); update loop; floor/wall collision
- `renderer.js`: canvas 2D rendering; draw glass (semi-transparent blue-gray tint), fragment polygons (glass color + edge highlight), impact point flash
- `histogram.js`: real-time log-log histogram using Chart.js; fragment area computation
- `animation.js`: crack propagation animation (sequential reveal of Voronoi cells in stress-wave order)

**Key cinematic moments:**
1. *Real footage comparison* (0:30): freeze the slow-motion real shatter, then show the naive Voronoi. "See the difference? No? Let me be more specific." Zoom into the fragment sizes near vs. far from impact.
2. *Power law reveal* (4:00): plot the fragment size histogram on log-log paper. Straight line. "This is a power law. The same as earthquakes. The same as forest fires. Why?"
3. *Stress field visualization* (5:00): show the Hertzian stress field as a heat map. Overlay the Voronoi seeds. "We're not dropping seeds randomly — we're dropping them where the stress field says cracks will form."
4. *The fix in action* (7:00): new shattering with stress-weighted Voronoi. Side-by-side with real footage. Much closer match.
5. *Multi-impact demo* (11:00): three clicks in rapid succession. Three overlapping crack networks. "Like a rock and two pebbles hitting a windshield simultaneously."
6. *Power law comparison* (13:00): toggle between naive and physical Voronoi. Watch histogram go from flat to power-law. "This is the shape of broken things."

**Visual style:** Glass should have a subtle blue-gray tint and a white edge highlight (1px inner border on each fragment). The intact glass pane has a faint texture (CSS `backdrop-filter: blur` or a subtle image texture). When shattered, fragment edges get a brighter white highlight to show the fresh fracture surface. Impact point flashes white for 3 frames. Consider using Three.js with custom ShaderMaterial for the glass transparency effect.

---

## Tags
`fracture` `crack-propagation` `stress-intensity` `fragmentation` `power-law` `Voronoi` `canvas` `structural-mechanics`

---

## Thumbnail

A pane of glass mid-shatter: the impact point (lower-left) blazes white. Radial cracks extend outward like spokes of a wheel, with concentric ring cracks between them. Fragments of dramatically varying sizes are visible — tiny slivers near the impact, large triangular shards far away. The overall color palette is cool blue-white glass against a dark background. In the upper-right, a small log-log graph shows the power-law fragment size distribution with a red line and the label "Power Law." Large text across the top: "WHY GLASS BREAKS THIS WAY."
