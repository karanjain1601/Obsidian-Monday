---
title: "Fluid That Gets Smarter in Detail Regions (Adaptive SPH)"
id: M044
difficulty: 7/10
prereq: "M043"
concept: "Adaptive SPH: split particles where density gradients are large; merge particles in low-detail regions; variable smoothing length h_i proportional to inter-particle spacing; mass is conserved during splitting/merging."
tags: [SPH, adaptive, fluid-simulation, particle-splitting, variable-resolution, smoothing-length, WebGL, mass-conservation]
category: medium
type: video-idea
---

# Fluid That Gets Smarter in Detail Regions (Adaptive SPH)

**Alt title:** "Your Fluid Simulation Is Wasting 90% of Its Particles"
**Difficulty:** 7/10 | **Prereq:** M043

---

## Opening Hook (0:00–1:00)

Show a uniform-resolution SPH simulation of water pouring into a glass. 10,000 particles everywhere — the interior of the glass is packed with particles doing nothing interesting, while the thin splash at the surface (where all the interesting physics happens) has the exact same particle density. "This simulation is stupid," the voice says bluntly. "It's spending equal compute budget on water sitting still at the bottom and on the complex, dynamic splash at the surface. It's like using the same resolution everywhere in an image regardless of whether you're looking at a blank sky or a detailed face."

Cut to the adaptive version: the bulk of the fluid (interior, slow-moving) is represented with large, sparse particles. At the free surface, at impact zones, at jets and droplets — the particles automatically split into smaller ones, concentrating detail exactly where it matters. The total particle count stays at 10,000, but the visual quality is dramatically higher because the detail is concentrated.

"Today we're going to build a fluid simulation that is literally smarter about where it spends its compute budget. And the key challenge is keeping the physics correct when particles have different sizes."

---

## The Naive Attempt

Naively try to implement "split particles where there's high velocity gradient." Track particles, compute velocity gradient, and when the gradient exceeds a threshold, replace one particle with 4 smaller ones:

```javascript
function naiveSplit(particles, threshold) {
  const toAdd = [];
  const toRemove = new Set();
  
  for (const p of particles) {
    const grad = computeVelocityGradient(p, particles);
    if (grad > threshold && p.radius > MIN_RADIUS) {
      toRemove.add(p.id);
      // Split into 4 children arranged in a square
      const offsets = [[-1,-1],[1,-1],[-1,1],[1,1]];
      for (const [dx, dy] of offsets) {
        toAdd.push({
          x: p.x + dx * p.radius * 0.5,
          y: p.y + dy * p.radius * 0.5,
          vx: p.vx, vy: p.vy,
          mass: p.mass / 4,          // conserve mass
          radius: p.radius / 2,      // child radius
          h: p.h / 2                 // smoothing length halved
        });
      }
    }
  }
  particles = particles.filter(p => !toRemove.has(p.id)).concat(toAdd);
  return particles;
}
```

Run it. The first split looks fine. But two problems emerge immediately: (1) at the boundary between large and small particles, the density estimate is badly wrong because small particles sample density using h_small while their large neighbors use h_large — they barely see each other. (2) The 4 children are placed at offsets of radius/2 — but in 2D, this means the 4 children are extremely close together and their mutual repulsion immediately causes a violent "pop" explosion at every split site. Watch it: a small cluster of particles on the surface splits, and the 4 children immediately accelerate apart, sending a shockwave through the fluid.

---

## The Moment of Failure

On screen: the surface of the fluid, particles gently moving. The splitting criterion triggers on a few high-gradient particles. Slow motion: the 4 children appear, immediately detect each other as overly dense neighbors, generate massive pressure forces, and fly apart at 10× the ambient velocity. Each child hits other particles, triggering more splits, creating a cascade. Within 3 frames: a chain reaction of explosions spreading through the fluid surface. The simulation is destroyed.

Freeze frame. Text overlay: "Three bugs in one naive implementation:
1. The smoothing lengths are inconsistent between particle levels.
2. The child particle placement overlaps, causing instantaneous high-density artifacts.
3. We're splitting based on velocity gradient — but that's not what we really want."

---

## Why It Broke — The Physics

In SPH, every particle i has a smoothing length h_i. Density of particle i is:
> **ρ_i = Σ_j m_j W(|x_i - x_j|, h_i)**

For this to be accurate, h_i must be proportional to the local inter-particle spacing. In uniform SPH, all particles have the same mass m and the same h, so the inter-particle spacing is uniform and h is constant. In adaptive SPH, different mass particles coexist, and each must use a different h commensurate with its own scale.

The **variable smoothing length SPH** (Bauer & Springel 2012 for astrophysics; Adams et al. 2012 for fluids) requires: particle i's smoothing length h_i satisfies:
> **h_i = η · (m_i / ρ_i)^(1/d)**

where η ≈ 1.2 is a dimensionless factor and d is spatial dimension. This is implicit — ρ_i depends on h_i through the kernel sum, and h_i depends on ρ_i. It must be solved iteratively for each particle.

The interaction between particles of different levels must use a **symmetrized kernel**: to interact particles i (big, large h) and j (small, small h), use h_ij = (h_i + h_j)/2 or h_ij = √(h_i · h_j). This ensures momentum and energy conservation across the level boundary.

Splitting and merging must conserve:
- **Mass:** Σ m_children = m_parent
- **Linear momentum:** Σ m_children v_children = m_parent v_parent
- **Angular momentum:** Σ m_children (x_children × v_children) = m_parent (x_parent × v_parent)
- **Energy** (approximately)

The correct child placement for a parent split into N children uses the **Vogel spiral** (for uniform disk coverage) or a 1D pattern (for simple 2-way splits). For a 2D split into 4 children: place at ±(0.5 h_parent/√2) in each direction — a square of side ≈ h_parent/√2, which equals the child smoothing length h_child = h_parent/2 scaled up by √2. No overlap.

The split criterion should not be velocity gradient (too noisy) but rather:
- **Resolution criterion:** h_i > h_max (particle is too coarse in a high-resolution region)
- **Surface proximity:** particle is within 2h of the free surface (where visual detail matters)
- **Curvature criterion:** surface curvature at particle exceeds threshold

---

## The One Concept

**Adaptive SPH: Variable Smoothing Lengths and Particle Refinement**

Standard SPH assigns every particle the same mass and smoothing length. Adaptive SPH breaks this constraint, allowing particles to represent fluid volumes of different sizes. Large particles cover bulk regions with coarse resolution; small particles cluster at surfaces, interfaces, and high-gradient regions where fine detail is needed.

The central challenge is **kernel consistency across levels**. In standard SPH, the density estimator is consistent to first order: as h→0, ρ_i → true density. In adaptive SPH with variable h, this consistency must be maintained at each particle level separately. The mechanism is the **self-consistent smoothing length** equation:

> **N_neigh = n_0 · (4π/3) · η³** (3D, or π·η² in 2D)

meaning each particle must have approximately n_0 neighbors (typically 30–60 in 3D, 15–20 in 2D) within its smoothing sphere. This requirement determines h_i given the local particle distribution. It's solved with a Newton-Raphson iteration per particle per step — expensive, but necessary for physical accuracy.

The **level hierarchy** is typically binary: level 0 particles have mass m₀, level 1 have mass m₀/4 (2D) or m₀/8 (3D), level 2 have m₀/16 (2D), etc. The smoothing length scales as h ∝ m^(1/d), so level 1 particles have h₁ = h₀/2 in 2D.

**Splitting algorithm (2D, parent → 4 children):**
1. Parent at position x_p, velocity v_p, mass m_p, smoothing h_p.
2. Child mass: m_c = m_p / 4.
3. Child smoothing length: h_c = h_p / 2.
4. Child positions: x_c^k = x_p + d_k where d_k are the 4 Vogel-spiral offsets at distance 0.5·h_c.
5. Child velocities: v_c^k = v_p + ∇v · (x_c^k - x_p) where ∇v is the local velocity gradient at x_p (linear extrapolation preserves momentum).

**Merging algorithm (4 → 1):** Find a cluster of 4 same-level particles with small relative velocity and density near ρ₀. Replace with one parent at mass-weighted centroid and mass-weighted velocity. Conserves mass and momentum exactly.

The **transition zone** between levels requires careful treatment. The pressure force between a level-0 particle i and a level-1 particle j uses:
> h_ij = (h_i + h_j) / 2

and the force is multiplied by m_j (not normalized by h_j) so that pressure from many small particles correctly represents the aggregate effect.

Refinement trigger conditions (order of priority):
1. **Interface criterion:** if particle distance to free surface < 1.5·h_i, refine.
2. **Velocity gradient criterion:** if |∂u/∂x|·h_i/v_typical > 0.3, refine.
3. **Curvature criterion:** if local surface curvature · h_i > 0.1, refine.
4. **Coarsening trigger:** if particle has been away from all three criteria for 50+ steps, merge candidates.

Real applications: adaptive SPH has been used in astrophysics simulations (galaxy formation with 10⁹ particles spanning 10 orders of magnitude in density) and in engineering (fuel injector simulations where the spray breakup region needs extreme resolution). In visual effects, Weta Digital and ILM use adaptive SPH variants for water simulations that would be computationally impossible with uniform resolution.

---

## The Fix

Corrected adaptive split with proper child placement and symmetrized interaction:

```javascript
const ETA = 1.2;          // smoothing length factor
const N0_NEIGHBORS = 20;  // target neighbor count in 2D

function computeAdaptiveH(particle, neighbors) {
  // Newton-Raphson iteration to find h such that N_neighbors ≈ N0
  let h = particle.h;
  for (let iter = 0; iter < 10; iter++) {
    let N = 0;
    for (const pj of neighbors) {
      const r = dist(particle, pj);
      N += poly6(r, h);  // counts weighted neighbors
    }
    const dN_dh = 3 * N / h;  // derivative (approximate)
    const dh = (N0_NEIGHBORS - N) / dN_dh;
    h += Math.max(-0.1*h, Math.min(0.1*h, dh));
    if (Math.abs(dh) < 0.001 * h) break;
  }
  return Math.max(MIN_H, Math.min(MAX_H, h));
}

function splitParticle(parent) {
  const hc = parent.h / 2;       // child smoothing length
  const mc = parent.mass / 4;    // child mass
  // Vogel spiral offsets at radius = 0.5 * h_child
  const r = 0.5 * hc;
  const angles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
  
  // Compute local velocity gradient for momentum-preserving split
  const gradVx = computeGradVx(parent);
  const gradVy = computeGradVy(parent);

  return angles.map(theta => {
    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta);
    return {
      x: parent.x + dx,
      y: parent.y + dy,
      vx: parent.vx + gradVx[0]*dx + gradVx[1]*dy,
      vy: parent.vy + gradVy[0]*dx + gradVy[1]*dy,
      mass: mc,
      h: hc,
      level: parent.level + 1
    };
  });
}

// Symmetrized pressure force between particles of different levels
function adaptivePressureForce(pi, pj) {
  const h_ij = 0.5 * (pi.h + pj.h);  // symmetrized kernel support
  const r = dist(pi, pj);
  if (r > h_ij || r === 0) return [0, 0];
  const [gx, gy] = gradSpiky_h(pi, pj, h_ij);
  const p_i = pressureEOS(pi.rho);
  const p_j = pressureEOS(pj.rho);
  const factor = pj.mass * (p_i / (pi.rho*pi.rho) + p_j / (pj.rho*pj.rho));
  return [-factor * gx, -factor * gy];
}
```

The key improvements: (1) child positions at r = 0.5·h_c so they don't overlap; (2) child velocities extrapolated from parent's velocity gradient — momentum conserved; (3) symmetrized h_ij for cross-level interactions.

---

## The Wow Moment — Push It

**Dam break with automatic refinement:** 2,000 level-0 particles initially. Release the dam — the advancing wavefront automatically spawns level-1 particles (8,000 virtual particles at the front), then level-2 at the most dynamic tip of the wave. Total "equivalent uniform" particle count: 50,000+, compute cost: 5,000 particles. The thin sheet at the wave tip is perfectly resolved; the deep water behind it is coarse but correct.

**Splashing droplet competition:** drop a sphere of fluid from height. Adaptive version: the impact zone generates a crown splash with clearly resolved individual droplets. Uniform-resolution version with same compute budget: the crown is a blocky, chunky approximation with no droplet detail.

**Conservation dashboard:** live display of total mass (should be constant), total momentum, particle count at each level. During complex interactions (splash, jet, droplet merging), mass is conserved to floating-point precision. This is the proof the physics is correct.

---

## The Interactive Demo

**Refinement threshold slider:** control how aggressively the simulation splits particles (fine = more particles at surface, expensive; coarse = fewer splits, cheaper).
**Max level:** 1–3 levels of refinement (3 = very detailed surface at high cost).
**Merge threshold slider:** how quickly coarse bulk regions are re-coarsened.
**Level color mode:** color particles by their level (level 0 = blue, level 1 = green, level 2 = yellow). See the refinement zones visually.
**Fixed total budget slider:** fix particle count at N (e.g. 5,000) — watch how the simulation re-allocates within this budget as fluid dynamics change.
**Comparison mode:** side-by-side with uniform SPH at same particle count — quality difference is stark.
**Obstacle drawing:** draw solid walls with mouse, see refinement concentrate at the fluid-wall boundary.
**Conservation meters:** live mass and momentum readouts.

---

## Production Notes

**Code to show on screen:** the `splitParticle()` function in full — annotated with arrows showing why each line matters (momentum-preserving velocity extrapolation, mass conservation, correct child spacing). Compare with naive version side by side.

**Visual overlay for key moment (6:30):** Show the particles colored by level. Drop a sphere into a pool. In slow motion, watch level-0 particles at the impact zone suddenly split → level-1 (color changes blue → green) → then level-2 at the most dynamic splash tip (green → yellow). The color change spreading outward from impact looks like a ripple of intelligence in the fluid.

**Key cinematic moment at 9:00:** freeze the simulation at peak splash complexity. Show a labeled diagram: "9,847 effective particles from 1,200 actual particles." Then un-freeze. The visual quality relative to particle count is the thesis made visual.

**Production tip:** Pre-record the naive explosion failure in isolation, then show it full-screen with dramatic sound before cutting to the fix. The contrast between catastrophic failure and elegant solution is the core emotional beat of the video.

---

## Tags

`SPH` `adaptive` `fluid-simulation` `particle-splitting` `variable-resolution` `smoothing-length` `WebGL` `mass-conservation`

---

## Thumbnail

**Three-panel comparison:** Left panel labeled "Uniform Low" — few coarse particles, jagged water surface. Center panel labeled "Adaptive" — few coarse particles in bulk, clouds of fine particles at the surface forming a perfect splash crown. Right panel labeled "Uniform High" — same quality as adaptive but particle count readout is "10× more expensive". Bold bold text: "SMARTER FLUID" at top. The center panel is clearly best, proving the point visually without words. Particle color gradient used: blue (coarse) → yellow (fine). Background: dark studio black.
