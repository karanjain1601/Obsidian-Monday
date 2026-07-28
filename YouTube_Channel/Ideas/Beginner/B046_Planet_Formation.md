---
title: "How Planets Form From a Disk of Dust"
id: B046
difficulty: 2.5/10
prereq: "B018 — Orbital Mechanics / Kepler's Laws"
concept: "Accretion: dust particles collide and stick, growing via runaway growth where the largest bodies capture the most material due to gravitational focusing (σ_eff = πr²(1 + v_esc²/v_inf²)). N-body gravity plus collision-merger produces the observed planet architecture."
tags: [physics, planet-formation, accretion, n-body, protoplanetary-disk, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# How Planets Form From a Disk of Dust

**Alt title:** "Making Planets From Scratch (It Only Takes 10 Million Years)"
**Difficulty:** 2.5/10 | **Prereq:** B018 — Orbital Mechanics / Kepler's Laws

---

## Opening Hook (0:00–1:00)

Open with the ALMA radio telescope image of HL Tauri — a star only one million years old, surrounded by a protoplanetary disk that has already carved clear, concentric rings and gaps. The star is barely out of diapers in cosmic terms, and already the disk is being sculpted by forming planets. The gaps are not random — they are at resonance positions with the orbital periods of the growing planet embryos. In 4–5 billion years (the same span that Earth has existed) this disk will have condensed into a mature planetary system.

Now show the contrast: on the left, the HL Tau image — a real protoplanetary disk, concentric rings gleaming in radio. On the right, the simulation starting state — 1,000 small white particles distributed randomly in a flat ring around a central yellow star, each particle carrying a tiny fraction of the total disk mass. Ask: "How do you go from a trillion-particle disk of dust to 8 planets?" The answer is accretion — a process that is both simple in concept and wildly complex in detail. Today you code the key physics: collisions that stick, gravity that attracts, and a runaway growth process where bigger bodies grow even faster than smaller ones. You will watch planets form on your laptop in under a minute of simulation time.

---

## The Naive Attempt

Set up the orbital mechanics framework from B018. Place 200 particles in circular orbits around a central star with slightly randomized semi-major axes and small random velocity perturbations. Apply gravity between all pairs of particles plus gravity from the star.

```javascript
function updateAllParticles(particles, star, dt) {
  // Star gravity on each particle
  particles.forEach(p => {
    const dx = star.x - p.x;
    const dy = star.y - p.y;
    const r2 = dx*dx + dy*dy;
    const r  = Math.sqrt(r2);
    const a  = G * star.mass / r2;
    p.ax = a * dx/r;
    p.ay = a * dy/r;
  });
  
  // Particle-particle gravity (N² pairs)
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const pi = particles[i], pj = particles[j];
      const dx = pj.x - pi.x;
      const dy = pj.y - pi.y;
      const r2 = Math.max(dx*dx + dy*dy, SOFTENING**2);
      const r  = Math.sqrt(r2);
      const F  = G * pi.mass * pj.mass / r2;
      const fx = F * dx / r, fy = F * dy / r;
      pi.ax += fx / pi.mass;  pi.ay += fy / pi.mass;
      pj.ax -= fx / pj.mass;  pj.ay -= fy / pj.mass;
    }
  }
  
  // Integrate
  particles.forEach(p => {
    p.vx += p.ax * dt; p.vy += p.ay * dt;
    p.x  += p.vx * dt; p.y  += p.vy * dt;
  });
  
  // No collision detection: particles pass right through each other
}
```

Let this run for 1,000 simulated orbits. The particles orbit the star. They scatter off each other gravitationally, redistributing their orbits slightly. Some are kicked to higher or lower eccentricities. A few are ejected on hyperbolic orbits. But the total number of particles stays exactly 200. Nothing merges. Nothing grows. The disk remains 200 separate specks forever.

---

## The Moment of Failure

Display a histogram of particle masses over time. It's flat — all particles have exactly the initial mass throughout the simulation. Show the disk after 10,000 orbits: still 200 separate particles, perhaps with slightly different orbital distributions but no planet-sized bodies anywhere. The simulation captures orbital dynamics perfectly but misses the fundamental process: **collisions that stick**.

In reality, when two dust grains collide at the low velocities typical of co-orbiting material (a few meters per second relative velocity), van der Waals forces, surface adhesion, and momentum dissipation cause them to stick together. The collision is inelastic — kinetic energy is converted to heat and deformation — and the result is a single larger body. The code treats particles as ghosts that pass through each other. Nothing ever grows.

Point out the critical missing ingredient: in the real disk, particles collide roughly once per orbital period in the densest regions. At 1 AU, the orbital period is one year. After 1 million years, each grain has had a million collision opportunities. Even with 1% sticking efficiency per collision, a grain doubles its mass hundreds of thousands of times — enough to go from micron-sized dust to kilometer-sized planetesimals.

---

## Why It Broke — The Physics

Planet formation proceeds in distinct phases:

**Phase 1 — Dust to pebbles (sub-mm to cm):** Dust grains collide at ~1 cm/s relative velocity and stick via van der Waals (electrostatic) forces. Growth is orderly: all grains grow at roughly the same rate. After ~10,000 years at 1 AU, grains reach ~1 cm.

**Phase 2 — Pebbles to planetesimals (cm to km):** The "meter barrier" is notoriously difficult. Meter-sized objects have the worst luck: they spiral inward due to aerodynamic headwind (the gas disk rotates slightly slower than Keplerian velocity, so solid objects feel a persistent headwind). Some mechanism — streaming instability, gravitational concentration in vortices — allows pebbles to clump directly into 100-km planetesimals, bypassing fragile meter-sized objects.

**Phase 3 — Planetesimals to planetary embryos (km to 1000 km): Runaway growth.** This is where the physics becomes decisive. Two bodies of radius r₁, r₂ moving at relative velocity v_inf have a gravitational focusing factor:

$$\sigma_{eff} = \pi(r_1+r_2)^2 \left(1 + \frac{v_{esc}^2}{v_\infty^2}\right)$$

where v_esc = sqrt(2G(m₁+m₂)/(r₁+r₂)). The larger the body, the larger v_esc, the larger the effective capture cross-section. Bigger bodies capture more material per unit time, growing faster than smaller bodies. This is **runaway growth** — the largest body in a region sweeps up everything and becomes a planetary embryo.

**Phase 4 — Oligarchic growth and giant impacts:** After runaway growth, a few large embryos dominate. Their gravitational zones of influence (Hill spheres) don't overlap — they grow simultaneously. Then the gas disk dissipates, removing the damping that kept orbits circular. Orbits become eccentric; embryos begin crossing each other's paths. Giant impacts (including the Moon-forming impact, B047) merge embryos into final planets.

---

## The One Concept

**Gravitational focusing** is the key mechanism that makes large bodies grow faster than small ones, driving runaway growth. The physical idea: a passing body is gravitationally deflected by a target body and can be captured even if it would have missed purely geometrically.

**Formal definition:** The effective collision cross-section is enhanced above the geometric cross-section πr² by the focusing factor (1 + v_esc²/v_inf²):

$$\sigma_{eff} = \pi r^2 \left(1 + \frac{2G M_{body}}{r \cdot v_\infty^2}\right)$$

**Physical intuition:** Imagine a ball curving toward a target under gravity. A bullet fired from far away with high speed barely cares about the target's gravity — v_esc << v_inf, focusing factor ≈ 1. But a slowly drifting pebble in a protoplanetary disk (v_inf very small) is gravitationally captured from a huge distance — focusing factor can be 100 or 1000. The capture rate is proportional to σ_eff, which grows with M — so bigger bodies grow faster. Once the biggest body is even slightly more massive than its neighbors, it runs away.

**The growth timescale:** The growth rate of a planetesimal's mass due to sweeping up background material of surface density Σ is:

$$\frac{dM}{dt} = \Sigma \cdot \sigma_{eff} \cdot v_{rel}$$

For runaway growth: dM/dt ∝ M^(4/3) (growing mass increases both geometric and gravitational cross-section). This has a superlinear solution — runaway growth produces one dominant body per disk annulus.

**Real-world examples:**
1. **Asteroid belt** — Jupiter's gravitational influence prevented runaway growth in the belt region, keeping velocities too high for sticking. Today's asteroids are the leftover planetesimals that never merged into a planet — a fossil record of Phase 3.
2. **TRAPPIST-1 system** — seven roughly Earth-sized planets in tight orbits, in or near mean-motion resonances with each other. This architecture suggests compact migration in a gas disk, consistent with type I migration of multiple planetary embryos.
3. **Minimum mass solar nebula** — by working backward from the current planets, we estimate the original disk had at least 0.01 solar masses of solids. This matches the surface densities needed to explain the observed planetary masses at their orbital radii.

---

## The Fix

Add collision detection and inelastic merging:

```javascript
function handleCollisions(particles) {
  // Compare all pairs — O(N²), acceptable for N < 500
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const pi = particles[i], pj = particles[j];
      if (pi.merged || pj.merged) continue;
      
      const dx = pj.x - pi.x;
      const dy = pj.y - pi.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // Gravitational focusing: use enhanced capture radius
      const vRel = Math.sqrt((pj.vx-pi.vx)**2 + (pj.vy-pi.vy)**2);
      const vEsc = Math.sqrt(2*G*(pi.mass+pj.mass)/(pi.r+pj.r));
      const rCapture = (pi.r + pj.r) * Math.sqrt(1 + vEsc**2/Math.max(vRel**2, 1e-6));
      
      if (dist < rCapture) {
        // Merge: conserve mass and momentum
        const totalMass = pi.mass + pj.mass;
        const newVx = (pi.mass*pi.vx + pj.mass*pj.vx) / totalMass;
        const newVy = (pi.mass*pi.vy + pj.mass*pj.vy) / totalMass;
        const newR  = Math.cbrt(pi.r**3 + pj.r**3);  // volume conservation
        
        // Absorb j into i
        pi.mass = totalMass;
        pi.vx   = newVx;
        pi.vy   = newVy;
        pi.r    = newR;
        // Center at center-of-mass position
        pi.x = (pi.mass*pi.x + pj.mass*pj.x) / totalMass;
        pi.y = (pi.mass*pi.y + pj.mass*pj.y) / totalMass;
        
        pj.merged = true;  // mark for removal
      }
    }
  }
  // Remove merged particles
  return particles.filter(p => !p.merged);
}
```

Now run the simulation. Early: 200 small particles in circular orbits. After a few hundred orbits: particles begin merging. The largest body grows disproportionately fast — it has the biggest gravitational focusing factor. After 1000 simulated orbits: the initial 200 particles have become ~20 intermediate bodies. After 5000 orbits: 3-5 large "planetary" bodies dominate, with a few smaller survivors scattered between them.

---

## The Wow Moment — Push It

**Scene 1 — Complete accretion simulation:** Run 1,000 particles from disk to planets. Render in fast-forward with a particle count ticker running down: "1000 → 800 → 500 → 200 → 50 → 12 → 5." Each merger event flashes briefly — a small white spark at the collision site. When two large bodies collide (giant impact), a larger flash with debris particles briefly scattered before being swept up. The final frame: 4-5 large colored circles representing newborn planets, each glowing with residual heat from accretion. Show their orbital radii and masses compared to the solar system.

**Scene 2 — Late Heavy Bombardment:** After the gas disk dissipates and the large planets lock in, many smaller bodies remain on unstable orbits. Replay the final 100 Myr as a barrage of smaller bodies raining down on the inner planets — the Late Heavy Bombardment, which scarred the Moon's surface between 4.1–3.8 billion years ago. The impact cratering record is preserved in the lunar highlands and tells us directly about the bombardment history of the early solar system.

**Scene 3 — Jupiter's influence:** Place a Jupiter-analog (318 Earth masses) at 5.2 AU. Watch how it dominates the outer disk, clearing a wide swath, flinging asteroids into the inner system and ejecting planetesimals from the outer disk. Compare the final planet architecture with and without Jupiter: without Jupiter, an outer planet can form from the scattered material — the simulation grows a planet at ~1 AU that has no analogue in our solar system, which some call the "fifth rocky planet" that Jupiter prevented from forming.

**Scene 4 — HL Tau comparison:** Show the simulation's disk surface density at 1 million years. Draw contour circles of constant surface density — they naturally develop ring-like depletions at the orbital radii of the growing embryos, resembling the ALMA HL Tau image. The rings emerge from the gravity-driven clearing of the embryo's feeding zone — a beautiful connection between simulation and observation.

---

## The Interactive Demo

**Disk initialization controls:** Particle count (50 to 500 — performance limited). Star mass (0.5 to 3 solar masses). Disk inner and outer radius (in AU). Surface density profile exponent (Σ ∝ r^(-p), p from 0 to 2). Initial velocity dispersion (low = more circular orbits, faster accretion; high = higher eccentricities, more violent collisions).

**Simulation controls:** Play/pause. Time multiplier (1× to 1000×). Current simulated time display. Particle count display (decreases as mergers occur). Largest body mass display (in Earth masses). "Restart" with different random seed to produce a different architecture.

**Visualization layers:** Toggle particle size ∝ actual radius. Toggle particle color by mass (gradient from white for dust to yellow for embryos to orange for planets). Toggle orbit ellipses for each body. Toggle gravitational capture radius circles (shows the enhanced cross-section). Toggle density heatmap of the disk (false-color from blue at low density to red at high density).

**Gas drag toggle:** Enable a simple gas drag force `F_drag = -b * v` that damps eccentricities. With gas drag, accretion is faster and orbits stay more circular — resembling early solar system conditions. Without gas drag, orbits remain eccentric and collisions are more energetic, sometimes leading to disruption rather than merger.

**Jupiter analog placement:** Click anywhere in the outer disk to place a fixed Jupiter-mass body. Immediately the inner disk response is visible: particles are scattered, gap opens, resonance rings appear. Dramatic real-time effect of a gas giant on a forming rocky planet system.

**Final architecture panel:** After simulation completion, display a bar chart of planet masses in Earth masses at their final orbital radii. Compare to the actual solar system (horizontal comparison lines for Mercury, Venus, Earth, Mars). Show how different initial conditions lead to wildly different outcomes.

---

## Production Notes

**Runtime targets:** Hook 1:00 — Naive attempt 2:30 — Moment of failure 1:30 — Physics 3:00 — The one concept 2:30 — The fix 3:30 — Wow moments 3:30 — Demo 2:30 — Total ~20 minutes.

**Screen layout:** The simulation canvas takes center stage for this video — it is inherently visual. Use full-screen canvas during the "wow moment" accretion run. Split canvas/code during the fix segment. The particle count ticker running down is compelling enough to hold without narration.

**Key zooms:** Zoom on the first merger event — the visual flash when two particles touch and become one larger one. This "aha" moment is when the simulation becomes interesting. Zoom on the gravitational focusing radius circles — showing the enhanced capture sphere around a large embryo compared to small ones visually explains runaway growth.

**Performance note:** N-body with N = 500 and collision detection is O(N²) = 250,000 pair checks per frame. At 60 fps, this is 15 million pair evaluations per second — manageable in optimized JavaScript but will require a Web Worker for the physics loop to keep the UI responsive. Consider using a grid-based spatial hash to reduce collision detection to O(N) for large N.

**Animations to prepare:** (1) Phase diagram of disk evolution — annotated timeline from dust grain to planet with size scale on Y axis (1μm → 1m → 1km → 1000km → 10,000km) and time on X axis (1yr → 10,000yr → 1Myr → 100Myr). Mark the "meter barrier" problem with a dashed line. (2) The gravitational focusing diagram — a target body with both the geometric radius and the much-larger effective capture radius shown as concentric circles, with a few trajectories showing distant particles being curved in.

**B-roll:** ALMA HL Tau image (publicly released 2014, dramatic and beautiful). NASA animation of solar system formation. Asteroid belt visualizations from JPL Small Body Database.

---

## Tags

`physics` `planet-formation` `accretion` `n-body` `protoplanetary-disk` `javascript` `canvas` `beginner`

---

## Thumbnail

The simulation canvas at two moments in time, shown side by side. Left panel: the initial state — a ring of 1,000 tiny white dots around a central yellow star, labeled "t = 0 — 1,000 dust particles." Right panel: the final state — 4 large colored circles (planetary sizes, glowing orange and blue) orbiting the star in clear, spaced ellipses, labeled "t = 10 Myr — 4 planets." The dramatic visual transformation — from scattered chaos to ordered planets — communicates the entire episode arc instantly. Text overlay at top: "I Made a Solar System." The simplicity of the before/after and the relatability of the claim ("I made") create a strong click-through impulse. Background: deep black to make both the white dust dots and the glowing planet circles maximally vivid.
