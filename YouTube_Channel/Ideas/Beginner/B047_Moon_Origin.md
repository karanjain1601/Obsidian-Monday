---
title: "The Moon's Violent Origin (Giant Impact Hypothesis Simulated)"
id: B047
difficulty: 3/10
prereq: "B045 — Binary Stars (Two-Body Problem)"
concept: "The giant impact hypothesis: a Mars-sized impactor (Theia) struck the proto-Earth, vaporizing rock and ejecting a debris disk. Material beyond the Roche limit r_Roche = R_primary·(2ρ_primary/ρ_satellite)^(1/3) re-accreted into the Moon; inside it was swept back to Earth."
tags: [physics, moon, giant-impact, roche-limit, accretion, tidal-forces, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# The Moon's Violent Origin (Giant Impact Hypothesis Simulated)

**Alt title:** "The Moon Is a Piece of Earth (And It Was Ripped Off Violently)"
**Difficulty:** 3/10 | **Prereq:** B045 — Binary Stars (Two-Body Problem)

---

## Opening Hook (0:00–1:00)

The Moon is bizarre. It is far too large to be a randomly captured asteroid — at 1/81 Earth's mass, it's the largest moon relative to its planet in the solar system (Pluto-Charon is technically a double dwarf planet). Its density is too low to contain a large iron core — the Moon is mostly rock, specifically rock that matches Earth's mantle in chemical composition. The oxygen isotope ratios in lunar samples returned by Apollo astronauts are indistinguishable from those of Earth rocks — they came from the same reservoir. Everything about the Moon says: it IS Earth. Or rather, it WAS Earth.

Show the SPH (Smoothed Particle Hydrodynamics) visualization of the canonical giant impact: a Mars-sized body, Theia, strikes the proto-Earth at 45° from a glancing angle. Molten rock erupts from the impact zone at speeds exceeding escape velocity. A rotating debris disk forms around the impact-damaged Earth within 24 hours. Over the next few thousand years, this disk coalesces into the Moon — outside the Roche limit where tidal forces no longer tear accreting bodies apart.

Today you simulate this impact step by step, from elastic-collision failure to light-touch SPH, and discover the Roche limit — one of the most important concepts in planetary science.

---

## The Naive Attempt

Model Earth and Theia as rigid spheres. Implement a perfectly elastic collision (billiard-ball physics).

```javascript
function elasticCollision(earth, theia) {
  const dx = theia.x - earth.x;
  const dy = theia.y - earth.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  
  if (dist > earth.r + theia.r) return;  // no collision yet
  
  // Collision normal
  const nx = dx/dist, ny = dy/dist;
  
  // Relative velocity along normal
  const vRel = (theia.vx - earth.vx)*nx + (theia.vy - earth.vy)*ny;
  if (vRel >= 0) return; // already separating
  
  // Elastic collision impulse (1D along normal, 2-body)
  const J = 2 * vRel / (1/earth.mass + 1/theia.mass);
  
  earth.vx += J*nx / earth.mass;
  earth.vy += J*ny / earth.mass;
  theia.vx -= J*nx / theia.mass;
  theia.vy -= J*ny / theia.mass;
  
  console.log("Collision! Theia bounced off Earth.");
}
```

Run the simulation: Theia approaches on a glancing trajectory. Contact. The two spheres bounce off each other elastically. Earth is kicked to the right; Theia ricochets to the upper left. Both continue on modified orbits around the Sun. No debris, no Moon formation, no vaporization. Just billiard balls in space.

Try a second version: perfectly inelastic collision (they stick together). This is better — Earth grows by Theia's mass. But it's still a single merged blob with no ejected material whatsoever. The new combined Earth-Theia object moves off on a new orbit. Still no Moon. Still no physics of the actual impact.

---

## The Moment of Failure

Both naive versions share the same fundamental failure: they treat planets as rigid, indivisible objects. In reality, the impact energy (roughly 10²⁹ joules — comparable to a few billion years of solar energy output) is deposited into the outer layers of both bodies. Rock vaporizes. The outer mantle of both Earth and Theia is converted into a superheated silicate vapor and plasma that expands outward faster than Earth's escape velocity. The resulting ejecta is not Theia bouncing off — it is both bodies' outer mantles mixed together and sprayed into orbit.

The elastic model says: total kinetic energy is conserved. The inelastic model says: all kinetic energy is converted to heat/deformation in a single point. Neither says: the energy deposition is spatially non-uniform, the outer layers reach escape velocity before the interior does, a rotationally supported debris disk forms at specific radii, and the Roche limit determines which parts of that disk can re-accrete.

There is a qualitative, beautiful physics concept hidden in this failure — the Roche limit — that the naive models completely miss.

---

## Why It Broke — The Physics

**The impact geometry:** Theia strikes the proto-Earth at roughly 4 km/s above mutual escape velocity (v_esc ≈ 11.5 km/s for Earth). The canonical simulation (Canup & Asphaug 2001) uses a glancing impact angle of ~45° and an impactor mass of ~10% of Earth's mass (Mars-sized, ~6.4×10²³ kg). The angular momentum delivered by the impact matches the current Earth-Moon system's angular momentum precisely — a key constraint.

**Material ejection:** In SPH simulations, the outer mantles of both bodies are modeled as collections of pressure-bearing fluid parcels. At the impact interface, pressure waves propagate outward at several km/s. Material at the outer edge of the ejecta plume reaches velocities exceeding escape velocity (11.5 km/s) and escapes into a bound disk. The iron cores of both bodies merge into the combined Earth's core (explaining why the Moon has almost no iron core).

**The Roche limit** is the distance from a primary body inside which tidal forces overcome the self-gravity of a satellite or a clump of material:

$$r_{Roche} = R_{primary} \cdot \left(\frac{2\rho_{primary}}{\rho_{satellite}}\right)^{1/3}$$

For Earth (ρ ≈ 5,514 kg/m³) and a silicate moonlet (ρ ≈ 3,000 kg/m³):

$$r_{Roche} = 6{,}371 \text{ km} \times \left(\frac{2 \times 5514}{3000}\right)^{1/3} \approx 9{,}500 \text{ km} \approx 1.5 R_\oplus$$

Inside this radius, a self-gravitating clump of debris is torn apart by tidal forces. The impact ejects material to a wide range of orbital radii. Material inside r_Roche is torn apart and rains back onto Earth. Material beyond r_Roche can clump into moonlets and eventually the Moon.

**Physical origin of the Roche limit:** Imagine a small clump of material in orbit at distance r from Earth's center. The near side of the clump (slightly closer to Earth) experiences stronger gravity; the far side experiences weaker gravity. The differential gravity across the clump stretches it — tidal force. This tidal stretching force must be compared to the self-gravity of the clump, which tries to hold it together. When the clump is small enough or far enough away, self-gravity wins. At the Roche radius, they balance exactly.

---

## The One Concept

**The Roche Limit** defines the boundary within which a gravitationally self-bound body disintegrates due to tidal forces from a more massive primary. It is one of the most consequential distances in planetary science, governing the structure of planetary rings, the fate of tidally disrupted comets, and the location where accretion disks can and cannot form moons.

**Derivation:** For a satellite of density ρ_s at distance r from a primary of mass M_p and radius R_p, the tidal acceleration across the satellite's diameter 2r_s is: a_tidal = 2G M_p r_s / r³. The self-gravity at the satellite's surface: a_self = G m_s / r_s² = (4/3)π G ρ_s r_s. Setting a_tidal = a_self and solving for r gives the Roche limit.

**Rigid vs. fluid bodies:** A rigid body (like a solid asteroid) has some tensile strength that supplements self-gravity — its Roche limit is smaller by a factor ~0.9. A fluid body (or rubble pile) has no tensile strength — the formula above applies directly. Saturn's rings sit almost entirely within the Roche limit (~2.44 R_Saturn for fluid bodies), confirming that the rings cannot coalesce into a moon.

**Key equation:**
$$r_{Roche} \approx 2.44 \cdot R_{primary} \cdot \left(\frac{\rho_{primary}}{\rho_{satellite}}\right)^{1/3}$$

(the 2.44 factor comes from the precise derivation for fluid satellites on circular orbits)

**Real-world examples:**
1. **Saturn's rings** — entirely within Saturn's Roche limit. The rings cannot accrete into moons; any clump that forms is immediately pulled apart. The innermost moons (Pan, Daphnis) orbit just outside the Roche limit and are actually sweeping up ring material slowly.
2. **Shoemaker-Levy 9 (1994)** — Comet SL9 passed within Jupiter's Roche limit and was tidally disrupted into a "string of pearls" — 21 fragments strung along the orbit, which then slammed into Jupiter over 6 days in July 1994.
3. **Tidal disruption events (TDEs)** — when a star passes within the Roche limit of a supermassive black hole, the star is disrupted into a stream of gas that spirals inward, producing a luminous flare detectable across billions of light-years.

---

## The Fix

Implement a simplified SPH-like particle model. Represent Earth and Theia as collections of particles with pressure forces, gravity, and viscosity. When two particles collide, they don't bounce — they exchange momentum and energy, with some energy going into heating (internal energy):

```javascript
// Simplified SPH particle system for impact simulation
const PARTICLES = [];
const EARTH_PARTICLES = 600;  // proto-Earth
const THEIA_PARTICLES = 120;  // Theia (10% Earth mass)

// Equation of state: P = K * rho^gamma (polytropic, for rock)
const K = 1e9, GAMMA = 1.4;

function pressure(density) {
  return K * Math.pow(density, GAMMA);
}

function computeForces(particles) {
  particles.forEach(p => { p.ax = 0; p.ay = 0; });
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const pi = particles[i], pj = particles[j];
      const dx = pj.x - pi.x;
      const dy = pj.y - pi.y;
      const r2 = dx*dx + dy*dy;
      const r  = Math.sqrt(r2);
      const h  = 0.5*(pi.smoothLen + pj.smoothLen); // SPH smoothing length
      
      if (r > 2*h) continue; // outside kernel support
      
      // SPH kernel gradient (simplified cubic spline)
      const dW = kernelGradient(r, h);
      
      // Pressure force: F = -m*(P_i/rho_i² + P_j/rho_j²) * grad W
      const pressureTerm = pi.pressure/pi.rho**2 + pj.pressure/pj.rho**2;
      const fMag = -pi.mass * pj.mass * pressureTerm * dW / r;
      
      pi.ax += fMag * dx / (r * pi.mass);
      pi.ay += fMag * dy / (r * pi.mass);
      pj.ax -= fMag * dx / (r * pj.mass);
      pj.ay -= fMag * dy / (r * pj.mass);
      
      // Gravity between all particles
      const gMag = G * pi.mass * pj.mass / Math.max(r2, (0.1*h)**2);
      pi.ax += gMag * dx / (r * pi.mass);
      pi.ay += gMag * dy / (r * pi.mass);
      pj.ax -= gMag * dx / (r * pj.mass);
      pj.ay -= gMag * dy / (r * pj.mass);
    }
  }
}

// After impact, check each ejected particle vs. Roche limit
function rocheCheck(particles, primaryMass, primaryRadius) {
  const rhoPrimary = primaryMass / ((4/3)*Math.PI*primaryRadius**3);
  particles.forEach(p => {
    const r = Math.sqrt(p.x**2 + p.y**2);
    const rRoche = primaryRadius * Math.cbrt(2*rhoPrimary/p.density);
    p.beyondRoche = r > rRoche;
    // Particles beyond Roche can clump; inside cannot
    p.color = p.beyondRoche ? '#88aaff' : '#ff6644';
  });
}
```

Now ejecta particles beyond the Roche limit glow blue (can accrete into Moon); those inside glow red (will rain back onto Earth). The visual immediately shows the Roche limit as the critical boundary that determines what becomes the Moon.

---

## The Wow Moment — Push It

**Scene 1 — Impact parameter sweep:** Run four impacts side by side with different impact angles: 0° (head-on), 30°, 45° (canonical), and 60° (very glancing). Head-on: both bodies shatter — no rotation, no disk, just a cooling blob. Very glancing: Theia barely grazes Earth, too little energy transferred — the bodies partially separate and re-collide. The 45° canonical impact produces the perfect balance: enough energy to vaporize the mantle, enough angular momentum to sustain a disk. Only one impact parameter is consistent with the Moon as we know it.

**Scene 2 — Moon receding over time:** Start the Moon at its post-formation position (~10 Earth radii) and run tidal evolution forward. Tidal friction between Earth's ocean tides and the Moon's gravity continuously transfers angular momentum from Earth's spin to the Moon's orbit. Earth slows down (days grow longer — Earth once had 6-hour days); the Moon moves outward. Plot: Moon distance vs. time over 4.5 billion years. The Moon started at ~10 R_Earth, currently sits at ~60 R_Earth, and is still moving outward at 3.8 cm/yr (measured by lunar laser ranging). Project forward: in ~50 billion years, the Moon would reach ~80 R_Earth and the system would be tidally locked (Earth rotation = Moon orbital period).

**Scene 3 — Alternative hypotheses fail:** Run three failed Moon-origin theories as simulations. (1) Fission: Earth spun so fast it flung off material — but the required spin rate gives too much angular momentum to the system. (2) Capture: a passing body was captured into lunar orbit — the probability is negligibly small and captured moons have very different chemical compositions. (3) Co-formation: Earth and Moon condensed from the same cloud — but then they should have similar iron content, and the Moon's iron-poor composition argues against it. The giant impact is the only hypothesis consistent with angular momentum, composition, and size simultaneously.

**Scene 4 — Roche limit gallery:** Apply the Roche limit calculation to four real systems as overlaid visualizations: (1) Saturn's rings entirely inside the Roche limit ring (beautiful visual). (2) Shoemaker-Levy 9 string-of-pearls (show the disruption as the comet crosses Jupiter's Roche limit). (3) The Earth-Moon system's historical close approach. (4) A neutron star tidally shredding a white dwarf companion (the LIGO source GW190425-type event).

---

## The Interactive Demo

**Impact simulator (main canvas):** Two deformable bodies represented as particle collections. Left body (proto-Earth, blue-gray) and right body (Theia, orange-gray) approaching each other. Controls: impact parameter (0 = head-on to 1 = very glancing, shown as an offset slider). Impactor mass fraction (0.05 to 0.20 of Earth mass). Impact velocity (1× to 3× escape velocity). Particle count (50 fast to 300 beautiful).

**Roche limit visualizer:** A dashed red circle drawn at the Roche limit distance from the center of the largest body. Particles inside the circle are colored red (cannot accrete); particles outside are blue (can accrete). The Moon forms from the blue particles. As the simulation runs post-impact, the Roche limit ring is visible and you can watch particles sort themselves by color.

**Post-impact disk view:** After the main impact settles (~24 simulated hours), switch to "disk mode": view from above the orbital plane, plot all ejecta particles as colored dots at their current orbital radius. Show the surface density histogram vs. radius — the peak beyond the Roche limit becomes the Moon. Show the Roche limit as a vertical line on this histogram.

**Tidal evolution timeline:** A separate panel showing Moon distance (in Earth radii) vs. time (in billions of years). An animated dot shows the current position as time fast-forwards. Sliders for: Earth's tidal dissipation factor Q (affects evolution speed), Moon initial orbit eccentricity. Current Moon distance is locked to observed value (384,400 km = 60.3 R_Earth); the simulation runs forward and backward from this anchor.

**Comparison panel:** Four hypothesis comparison cards — Giant Impact, Fission, Capture, Co-formation — each with a brief simulation and a checklist of whether it matches observed Moon properties (size, composition, angular momentum, isotopic ratios). Giant Impact checks all boxes; others fail one or more.

---

## Production Notes

**Runtime targets:** Hook 1:00 — Naive attempt 2:30 — Moment of failure 1:30 — Physics 3:30 — The one concept 2:30 — The fix 4:00 — Wow moments 3:30 — Demo 2:30 — Total ~21 minutes.

**Screen layout:** The SPH impact simulation deserves full-screen treatment during the impact itself. The visual of molten rock fountaining into space is the emotional centerpiece of the video. Use canvas full-screen with the Roche limit ring clearly visible. Code editor appears for the fix segment (split 60/40 canvas/code). For the "alternative hypotheses" segment, use a 2×2 grid of smaller simulations simultaneously.

**Key zooms:** Zoom on the exact moment of first contact between Earth and Theia in the SPH simulation — the moment the two particle systems interpenetrate and begin deforming. Zoom on the Roche limit ring as ejecta particles scatter around it — the red/blue color division is visually clear and physically meaningful. Zoom on the tidal evolution chart: the slow outward drift of the Moon annotated with "3.8 cm per year — confirmed by laser ranging."

**Animations to prepare:** (1) Canup & Asphaug 2001 SPH simulation frames — these are publicly available and gorgeous. License: cite the paper and NASA. (2) Diagram of the Roche limit derivation — side by side: self-gravity arrow (inward) vs. tidal force arrow (outward) on a small clump, with the equilibrium condition labeled. (3) Apollo lunar sample photographs alongside Earth mantle rock samples — visually very similar (same oxygen isotopes, same mineral types, different iron content).

**B-roll:** Apollo 11 landing footage. Lunar surface photographs from various Apollo missions. Animation of the Shoemaker-Levy 9 impact with Jupiter (July 1994) — dramatic real footage.

---

## Tags

`physics` `moon` `giant-impact` `roche-limit` `accretion` `tidal-forces` `javascript` `canvas` `beginner`

---

## Thumbnail

A dramatic frame from the SPH simulation showing the moment of giant impact: the proto-Earth (large blue-gray sphere) seen from above, with a diagonal spray of red-orange molten rock fountaining up from the impact zone (upper right quadrant) where Theia's remnant is visible as a smaller, partially disintegrated body. The ejecta spray arcs in a brilliant orange-white curve away from Earth. The Roche limit ring is drawn as a glowing white dashed circle around Earth — some ejecta is inside it (red), some outside it (blue). Text overlay at the top in bold white: "The Moon Was Ripped from the Earth." The lower third has the subtitle "4.5 Billion Years Ago." The combination of scientific precision (Roche limit ring, two-color ejecta) and visceral violence (molten rock spraying through space) creates a thumbnail that is both beautiful and alarming — perfect stop-the-scroll energy.
