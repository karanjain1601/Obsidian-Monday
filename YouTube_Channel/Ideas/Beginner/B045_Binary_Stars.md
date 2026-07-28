---
title: "Binary Star Systems: Two Stars, One Orbit"
id: B045
difficulty: 2.5/10
prereq: "B018 — Orbital Mechanics / Kepler's Laws"
concept: "The two-body problem: both bodies orbit the common center of mass (CoM), located at r₁/r₂ = m₂/m₁ along the separation vector. The CoM is stationary (no external force). Kepler's third law uses total mass: T² = (4π²/G(m₁+m₂))·a³."
tags: [physics, binary-stars, two-body-problem, center-of-mass, orbital-mechanics, kepler, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Binary Star Systems: Two Stars, One Orbit

**Alt title:** "More Than Half of All Stars Are in Relationships (And the Physics Is Beautiful)"
**Difficulty:** 2.5/10 | **Prereq:** B018 — Orbital Mechanics / Kepler's Laws

---

## Opening Hook (0:00–1:00)

Our Sun is a loner. Most stars aren't. More than 50% of Sun-like stars and up to 80% of massive O-type stars are in binary or multiple systems — two or more stars gravitationally bound and orbiting each other. Alpha Centauri, our nearest stellar neighbor, is actually a triple system: A and B orbit each other with an 80-year period, while Proxima Centauri loops around the pair on an orbital period of roughly 550,000 years. Sirius, the brightest star in the night sky, is a binary: Sirius A (the bright one) and Sirius B (a white dwarf, the remnant of a dead star, tiny and dense, pulling Sirius A in a tight dance that 19th-century astronomers detected from the wobble alone before they ever saw the companion).

Show a gorgeous canvas animation: two orange-white stars of similar size waltzing around a point in empty space between them. The center of mass — a fixed point — sits in the void, seemingly held in place by nothing. Both stars orbit it in opposite directions, like partners in a ballroom waltz. The point between them doesn't move. This is the fundamental correction that Newton made to Kepler: Kepler treated the Sun as fixed, but if the Sun and planet have comparable masses, both move. The center of mass doesn't.

This video is about understanding exactly why that point stays fixed — Newton's third law applied to gravity — and how to simulate it correctly.

---

## The Naive Attempt

Pull up the B018 orbital mechanics code. Extend it to two stars. The natural first instinct: fix one star at the center and orbit the second around it.

```javascript
const star1 = { x: 400, y: 300, mass: 2e30, vx: 0, vy: 0 };  // Fixed
const star2 = { x: 550, y: 300, mass: 1e30, vx: 0, vy: 20000, ... };

function update(dt) {
  // Only star2 moves
  const dx = star2.x - star1.x;
  const dy = star2.y - star1.y;
  const r2 = dx*dx + dy*dy;
  const r = Math.sqrt(r2);
  
  const F = G * star1.mass * star2.mass / r2;
  star2.ax = -F * dx / (r * star2.mass);
  star2.ay = -F * dy / (r * star2.mass);
  
  star2.vx += star2.ax * dt;
  star2.vy += star2.ay * dt;
  star2.x  += star2.vx * dt;
  star2.y  += star2.vy * dt;
  
  // star1 stays fixed — never moves
}
```

Run it: star2 traces a perfect ellipse around the fixed star1. Looks reasonable. Now increase star2's mass to equal star1's mass (2:1 → 1:1). The orbit looks identical — star2 still orbits star1, now of equal mass. But this can't be right: if both stars have the same mass, they should move the same amount in response to each other's gravity. Newton's third law says the force on star1 from star2 equals the force on star2 from star1 — in magnitude. So why does only star2 move?

The answer: because you hardcoded star1 to be stationary. You violated Newton's third law in the code.

---

## The Moment of Failure

Display the **center of mass** as a visible cross marker on the canvas, computed every frame:

```javascript
function computeCoM(s1, s2) {
  const totalMass = s1.mass + s2.mass;
  return {
    x: (s1.mass * s1.x + s2.mass * s2.x) / totalMass,
    y: (s1.mass * s1.y + s2.mass * s2.y) / totalMass
  };
}
```

In the fixed-star model, the CoM should be stationary. But since star1 is fixed and star2 orbits it, the CoM — which lies between them — is continuously orbiting along with star2. The CoM cross moves in an ellipse. An isolated two-body system with no external forces must have a stationary CoM. This is drifting — meaning the simulation is violating conservation of momentum.

Draw a trail behind the CoM marker. After one orbit, the trail shows a closed ellipse — the CoM has traced star2's orbit, rescaled by the mass ratio. This is not a small error. The simulation is unphysical: it implies external forces are acting on the system (holding star1 in place). For a mass ratio of 2:1, the CoM drifts by one-third of the orbital diameter each orbit. For a 1:1 ratio, it drifts by half the orbital diameter.

---

## Why It Broke — The Physics

Newton's second law for each star, with force from the other:

$$m_1 \ddot{\mathbf{r}}_1 = \frac{G m_1 m_2}{|\mathbf{r}_{12}|^2} \hat{\mathbf{r}}_{12}$$
$$m_2 \ddot{\mathbf{r}}_2 = -\frac{G m_1 m_2}{|\mathbf{r}_{12}|^2} \hat{\mathbf{r}}_{12}$$

Newton's third law: force on 1 from 2 equals minus force on 2 from 1. Therefore the total momentum of the system p = m₁v₁ + m₂v₂ is conserved: d(p)/dt = 0. The center of mass **R** = (m₁r₁ + m₂r₂)/(m₁+m₂) moves at constant velocity (in an isolated system, it stays fixed if the initial CoM momentum is zero).

The elegant trick: transform to center-of-mass frame and reduce to a **one-body problem**. Define the separation vector r = r₂ - r₁. The equation for r is:

$$\mu \ddot{\mathbf{r}} = -\frac{G m_1 m_2}{r^2} \hat{\mathbf{r}}$$

where **μ = m₁m₂/(m₁+m₂)** is the **reduced mass**. This is mathematically identical to a single particle of mass μ orbiting a fixed center with total mass M = m₁+m₂. Once you solve for r(t), recover individual positions:

$$\mathbf{r}_1 = \mathbf{R} - \frac{m_2}{m_1+m_2} \mathbf{r}, \quad \mathbf{r}_2 = \mathbf{R} + \frac{m_1}{m_1+m_2} \mathbf{r}$$

**Kepler's Third Law** with total mass:
$$T^2 = \frac{4\pi^2}{G(m_1 + m_2)} a^3$$

where a is the semi-major axis of the relative orbit (total separation, not individual orbit radii). This is the generalization needed for binary stars — the original Kepler's law assumed M_Sun >> m_planet.

---

## The One Concept

**The Two-Body Problem and Center of Mass** is the cornerstone of all multi-body gravitational dynamics. Every binary system — binary stars, Earth-Moon, double asteroids, neutron star pairs — is an instance of this problem.

**Center of mass:** The unique point that remains unaccelerated in an isolated gravitational system. Located at R = (Σ mᵢrᵢ)/(Σ mᵢ). It divides the separation between two bodies inversely by their masses: r₁/r₂ = m₂/m₁ (the heavier body is closer to the CoM, moving in a smaller orbit).

**Reduced mass trick:** The two-body problem reduces exactly to a one-body problem. You don't need to treat it as an approximation — the reduction is mathematically exact. The reduced mass μ is always less than either individual mass: μ < min(m₁, m₂). For equal masses, μ = m/2.

**Physical intuition:** Imagine standing on the CoM — an inertial frame. From this vantage point, both stars orbit the origin. Star 1 traces an ellipse; star 2 traces a geometrically similar ellipse on the opposite side, scaled by the mass ratio. They always move in opposite directions, always at diametrically opposite positions relative to the CoM. They orbit in lockstep because they must always stay balanced around the center.

**Key relationships:**
- Position ratio: r₁/r₂ = m₂/m₁
- Speed ratio: v₁/v₂ = m₂/m₁ (same, because they orbit CoM at the same period)
- Orbital period: T² = (4π²/GM_total) · a³ where a = a₁ + a₂ (total separation)

**Real-world examples:**
1. **Earth-Moon system** — the Earth-Moon CoM (the barycenter) is about 4,671 km from Earth's center — inside the Earth, but not at its center. Earth wobbles around this point monthly as the Moon orbits. Lunar laser ranging can measure this to centimeter precision.
2. **Exoplanet detection via radial velocity** — wobble of a star around the star-planet CoM causes Doppler shifts in stellar spectral lines. The amplitude reveals the planet's minimum mass; the period gives the orbital period. This is how 51 Pegasi b was discovered in 1995.
3. **Gravitational wave sources** — the loudest gravitational waves detectable by LIGO come from merging binary neutron stars and black holes. The waveform "chirp" — increasing frequency and amplitude — comes directly from the decreasing orbital period as energy is radiated away.

---

## The Fix

Apply force to both stars symmetrically, respecting Newton's third law:

```javascript
function updateBinary(s1, s2, dt) {
  const dx = s2.x - s1.x;
  const dy = s2.y - s1.y;
  const r2 = dx*dx + dy*dy;
  const r  = Math.sqrt(r2);
  
  // Gravitational force magnitude
  const F = G * s1.mass * s2.mass / r2;
  
  // Force direction unit vector (from s1 toward s2)
  const fx = F * dx / r;
  const fy = F * dy / r;
  
  // Newton's 3rd law: equal and opposite accelerations
  s1.vx += (fx / s1.mass) * dt;   // s1 pulled toward s2
  s1.vy += (fy / s1.mass) * dt;
  s2.vx -= (fx / s2.mass) * dt;   // s2 pulled toward s1
  s2.vy -= (fy / s2.mass) * dt;
  
  s1.x += s1.vx * dt;
  s1.y += s1.vy * dt;
  s2.x += s2.vx * dt;
  s2.y += s2.vy * dt;
}

// Initialize with correct velocities for circular CoM-frame orbit
function initBinaryCircular(m1, m2, separation) {
  const M = m1 + m2;
  const v_total = Math.sqrt(G * M / separation);  // relative velocity
  // Split by mass ratio: heavier star moves slower
  const v1 = v_total * m2 / M;
  const v2 = v_total * m1 / M;
  return {
    star1: { x: -separation * m2/M, y: 0, vx: 0, vy: -v1, mass: m1 },
    star2: { x:  separation * m1/M, y: 0, vx: 0, vy:  v2, mass: m2 }
  };
}
```

Now the CoM marker stays perfectly stationary. Both stars trace ellipses. Change the mass ratio with a slider and watch both orbits rescale in real time — the heavier star's orbit shrinks toward the CoM, the lighter star's orbit expands. At 1:1 mass ratio, both orbits are identical circles. At 10:1, the heavy star barely moves, and we recover the familiar planetary-orbit picture as a special case.

---

## The Wow Moment — Push It

**Scene 1 — The Alpha Centauri system:** Load a hierarchical triple: Alpha Centauri A (1.1 solar masses) and B (0.9 solar masses) in an 80-year mutual orbit, plus tiny Proxima Centauri at 15,000 AU in a 550,000-year outer orbit. Show all three bodies moving simultaneously in their correct proportions. The inner binary moves visibly in real time (80 years compressed to 10 seconds); Proxima barely moves at all. Zoom out: the inner binary appears as a single wobbling point at the scale of Proxima's orbit.

**Scene 2 — Kozai-Lidov mechanism in a triple:** Set up a hierarchical triple where the outer body's orbital plane is significantly inclined relative to the inner binary. Over many inner orbits, the outer star's gravitational torque causes the inner binary's eccentricity to oscillate dramatically — sometimes nearly circular, sometimes nearly parabolic. This Kozai-Lidov mechanism can drive binary stars to merge, potentially triggering Type Ia supernovae. Show the eccentricity oscillation plotted in real time as the simulation runs.

**Scene 3 — Contact binary (W UMa type):** Slowly reduce the separation between two equal-mass stars in the simulation until their "photospheres" overlap. In reality (and in the simulation), they share a common envelope — a peanut-shaped object rotating synchronously. Show mass transfer: the Roche lobe of the secondary overflows onto the primary. Render the Roche lobes (equipotential surfaces) as an overlay — the figure-eight-shaped boundary showing the tidal radius.

**Scene 4 — Pulsar timing discovery:** Show what a distant observer would see. The pulsar's spectral line (or pulse arrival time) varies as the neutron star orbits the CoM — a sinusoidal Doppler shift with the binary period. This is exactly what Hulse and Taylor measured for PSR 1913+16 — the wobble in pulse timing revealed the binary orbit, and the orbital decay matched gravitational wave emission theory to 0.1% precision. Nobel Prize 1993.

---

## The Interactive Demo

**Binary visualizer (main canvas):** Two stars of adjustable mass (drag mass sliders labeled "Star 1 mass" and "Star 2 mass" in solar masses, from 0.1 to 10 each). The CoM is shown as a bright white cross that should stay stationary — add a "CoM drift" warning in red if numerical integration accumulates error. Star orbit trails drawn for the last full period. Orbital period displayed in years using Kepler's Third Law, updated in real time.

**Phase space panel:** Plot the x-y positions of both stars on the same axes, referenced to the CoM. Both ellipses are visible simultaneously; the mass ratio determines their relative sizes. Toggle "CoM frame" vs "lab frame" — in lab frame, both stars drift if given a non-zero CoM velocity.

**Eccentricity control:** Drag an eccentricity slider from 0.0 (circular) to 0.95 (very elongated). The orbital shapes update in real time. The stars' speed variation along the orbit is visible — they speed up near periastron and slow down near apastron (Kepler's second law: equal areas in equal times).

**Preset systems:** Buttons for Alpha Centauri A/B (0.9 eccentricity, 80 yr period), Sirius A/B (50 yr period, white dwarf companion), Cygnus X-1 (black hole + supergiant — extreme mass ratio), and PSR 1913+16 (Hulse-Taylor pulsar binary, very tight 7.75-hour orbit).

**Radial velocity observer:** Place an observer at adjustable angle relative to the orbital plane. Show the velocity component toward/away from the observer for each star as a scrolling time-series plot — exactly what a spectroscopic binary observation gives. Show how the period, amplitude, and mass ratio can be read from this curve.

---

## Production Notes

**Runtime targets:** Hook 1:00 — Naive attempt 2:30 — Moment of failure 1:30 — Physics 3:00 — The one concept 2:30 — The fix 3:00 — Wow moments 3:30 — Demo 2:30 — Total ~20 minutes.

**Screen layout:** Canvas dominates the right half during the simulation segments. Left half alternates between code editor and physics slides. For the "moment of failure," show the drifting CoM cross prominently on the full canvas — the motion of a point that should be still is immediately compelling.

**Key zooms:** Zoom on the CoM marker the moment the correct two-body code starts — it snaps to stationary. This is the visual payoff for the whole "naive attempt" segment. Zoom on the mass ratio slider being dragged smoothly, with both orbital radii updating in real time — mesmerizing to watch.

**Animations to prepare:** (1) Diagram of the CoM position for different mass ratios (1:1, 2:1, 10:1) — a simple number line with two masses and a fulcrum point labeled "CoM." (2) The Hulse-Taylor pulse-timing data — the famous parabolic decay curve plotted over decades of observation, compared to the general relativity prediction. Label the Nobel Prize annotation. (3) Historical note: in the early 19th century, Friedrich Wilhelm Bessel noticed Sirius and Procyon were moving in wavy lines against background stars — the first detection of an unseen companion, a full decade before Uranus was searched for based on Neptune perturbations.

**B-roll:** Hubble Space Telescope images of famous binary systems. Gravitational wave LIGO chirp audio and waveform visualization (publicly released by LIGO). Animation of the Earth-Moon barycenter (inside the Earth but not at the center).

---

## Tags

`physics` `binary-stars` `two-body-problem` `center-of-mass` `orbital-mechanics` `kepler` `javascript` `canvas` `beginner`

---

## Thumbnail

The canvas simulation showing two glowing stars — one slightly larger and orange-white, one slightly smaller and yellow-white — circling a bright cross in the empty space between them. The cross is labeled "Center of Mass" in clean white text. Star orbit trails in faint blue and orange create the double-ellipse pattern. Background is deep black with faint grid lines. Bold text at top: "Both Stars Move." Subtitle below in smaller font: "Most star simulations get this wrong." The cross at the center of empty space — a labeled point of nothingness that controls two massive stellar bodies — is the visual hook. It contradicts the instinct that stars orbit stars; the truth is they orbit a shared invisible point. The two different colors of the stars and their trails make it immediately clear both are moving.
