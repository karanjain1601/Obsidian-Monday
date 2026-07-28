---
title: "Kepler's Three Laws: Derived From Newton's Gravity Alone"
id: B019
difficulty: 2.5/10
prereq: "B018 — Why Satellites Don't Fall: They're Actually Falling Sideways"
concept: "All three Kepler laws emerge from numerical integration of F = GMm/r²"
tags: [physics, kepler, orbital-mechanics, gravity, ellipse, period, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Kepler's Three Laws: Derived From Newton's Gravity Alone

**Alt title:** "Newton's Gravity Equation Secretly Contains All of Kepler's Laws"
**Difficulty:** 2.5/10 | **Prereq:** B018 — Why Satellites Don't Fall: They're Actually Falling Sideways

---

## Opening Hook (0:00–1:00)

Open on a dramatized shot of Johannes Kepler in 1609, surrounded by Tycho Brahe's observational tables — meticulously recorded planetary positions over decades, before telescopes. Kepler spent years fitting mathematical curves to the data. After trying oval after oval, he found it: an ellipse, with the Sun at one focus. Not centered, not symmetric — the Sun is off-center. That was Law 1. Then he noticed that Mars moves faster when close to the Sun and slower when far — but a line from Mars to the Sun sweeps equal areas in equal times. Law 2. Then he found T² ∝ a³ across all planets — period squared scales with semi-major axis cubed. Law 3. Kepler had no idea why. He thought the Sun emitted "motive souls" pushing the planets. He could describe the motion perfectly but not explain it. Then Newton (born the same year Galileo died, 1642, as legend has it) invented calculus and showed that all three of Kepler's laws follow inevitably from one equation: F = GMm/r². Today we'll skip the calculus and show it computationally: write Newton's gravity, integrate it numerically, and watch all three Kepler laws emerge without any additional assumptions.

## The Naive Attempt

The natural first mistake when coding planetary orbits: assume circular orbits. The teacher said "planets orbit in circles (approximately)" and this sticks. Set every planet at a fixed radius, compute the circular velocity v = √(GM/r), and step forward in time by rotating the position vector at constant angular velocity ω = v/r. This gives circular orbits by construction. Kepler's First Law (ellipses) never appears — you forced circles. Kepler's Second Law (equal areas in equal times) is trivially true for circles — equal arcs in equal times means equal areas always, uninteresting. Kepler's Third Law works exactly for circles: T = 2πr/v = 2π√(r³/GM) → T² = 4π²r³/GM → T² ∝ r³ = a³ (for circles, a = r). So you get K3 for free. But the simulation has zero physical insight — it's circular by assumption, not by emergence.

Now do slightly better: give each planet the correct initial position and velocity from a data table, but integrate using plain Euler forward integration: `pos += vel * dt; vel += accel * dt`. Apply Newton's gravity correctly. The orbit starts as a circle but drifts over time — the Euler integrator does not conserve energy exactly. After one simulated year: the planet's orbit is a slightly different circle. After 10 years: noticeably different. After 100 years: the "orbit" has precessed and drifted significantly. Kepler's Laws — which assume stable ellipses — cannot be verified because the integrator is slowly corrupting the trajectory. The laws appear approximately but not exactly, and the errors grow without bound.

## The Moment of Failure

Quantify the Euler integrator failure. Place a planet in a known elliptical orbit (eccentricity e = 0.5, semi-major axis a = 100 simulation units). Compute the theoretical period T = 2π√(a³/GM). Run the Euler simulation for one period. Compare: the planet has not returned to its starting position. Measure the period error: with dt = 0.1, the period is off by 2%. With dt = 0.01, off by 0.2%. It scales with dt — first-order accurate. But more damning: plot the total mechanical energy E = KE + PE over time. With Euler integration: energy increases steadily. The orbit is slowly gaining energy — spiraling outward. After 100 orbits, the orbit is 15% larger. After 1000 orbits, it's doubled. Real planetary orbits are stable for billions of years. Any integrator that gains energy, even slowly, is fundamentally broken for long-term simulation.

Show the difference concretely: on screen, the Euler orbit drifts into a slowly widening spiral instead of a closed ellipse. Kepler's First Law says the orbit is a closed ellipse — Euler integration gives a spiraling open curve. The bug is not in the physics equation (Newton's law is coded correctly) but in the numerical integration scheme. The integrator eats and doesn't conserve the energy. This is the physics bug the curriculum is built around: wrong integrator → wrong orbit shape → Kepler's Laws cannot emerge. Fix the integrator, and the laws emerge as emergent consequences of Newton's gravity alone.

## Why It Broke — The Physics

The forward Euler integrator approximates continuous motion by finite steps. It has a systematic error: at each step, velocity is computed from the acceleration at the beginning of the step and then position is updated. This phase mismatch causes energy to leak into the system (forward Euler adds energy; backward Euler removes it; only symplectic methods exactly conserve a modified Hamiltonian). For Hamiltonian systems (conservative physics: gravity, springs, EM fields with no dissipation), a symplectic integrator is mandatory for long-term stable simulation.

The Störmer-Verlet (Leapfrog) integrator is the standard fix:

**x(t + dt) = 2x(t) − x(t − dt) + a(t) · dt²**

Or equivalently (velocity Verlet form):

**v(t + dt/2) = v(t) + a(t) · dt/2**
**x(t + dt) = x(t) + v(t + dt/2) · dt**
**a(t + dt) = −GM/r(t+dt)² · r_hat**
**v(t + dt) = v(t + dt/2) + a(t + dt) · dt/2**

Verlet is second-order accurate (vs Euler's first-order) and, crucially, is symplectic — it exactly conserves a slightly modified version of the total energy. Over any number of steps, the orbit neither spirals in nor out. It remains a perfect ellipse (within floating-point precision) indefinitely. All three Kepler laws can now be verified computationally with arbitrary precision.

## The One Concept

**Kepler's Three Laws emerge from Newton's gravity F = GMm/r²**

**Law 1 — Ellipses:** Any orbit under a 1/r² force law is a conic section (ellipse, parabola, or hyperbola depending on total energy). Bound orbits (E < 0) are ellipses with the force center at one focus. This is not assumed — it is a mathematical consequence of 1/r² gravity that Newton proved analytically and that emerges automatically from our Verlet integration for any bound initial conditions.

**Law 2 — Equal areas:** Conservation of angular momentum L = r × mv is equivalent to equal areas swept in equal times. Since gravity is a central force (always directed toward the focus), it exerts zero torque: τ = r × F = r × (−F_r r_hat) = 0. Angular momentum is conserved exactly (for any central force, not just 1/r²). The equal-areas law is a consequence of angular momentum conservation — more fundamental than Kepler's empirical observation.

**Law 3 — T² ∝ a³:** For a circular orbit: T = 2πr/v = 2π√(r³/GM) → T² = (4π²/GM) · r³. For elliptical orbits: the same relationship holds with r replaced by the semi-major axis a: T² = (4π²/GM) · a³. The constant of proportionality 4π²/GM depends only on the central mass M. All planets orbiting the same Sun have the same constant — which is why Kepler found the ratio T²/a³ constant across all planets.

**Real-world examples:**
1. **Discovery of Neptune (1846):** Uranus's observed position deviated from Kepler's predictions. Adams and Le Verrier used the deviations to predict the position of a perturbing planet. Astronomers pointed a telescope at the predicted position and found Neptune on the first night. Kepler's Laws used as a calculational tool to discover a planet before it was observed.
2. **Halley's Comet:** T² ∝ a³ predicts the period from the semi-major axis. Halley's Comet has a highly elliptical orbit with a ≈ 17.8 AU → T ≈ 75.3 years. Halley showed the 1682 comet was the same object as comets observed in 1531 and 1607 — 76-year period — and predicted its return in 1758. He was right.
3. **Exoplanet detection (transit timing):** If a transiting exoplanet has a companion, the companion perturbs the orbit slightly, causing transit times to vary by seconds or minutes from K3 predictions. Transit timing variations (TTVs) have been used to discover dozens of additional exoplanets in systems found by the Kepler space telescope.

## The Fix

Replace Euler integration with velocity Verlet:

```javascript
class Planet {
  constructor(x, y, vx, vy, mass) {
    this.pos = { x, y };
    this.vel = { x: vx, y: vy };
    this.mass = mass;
    this.acc = { x: 0, y: 0 };
  }
  
  computeAcceleration(sun) {
    const dx = sun.x - this.pos.x;
    const dy = sun.y - this.pos.y;
    const r2 = dx**2 + dy**2;
    const r = Math.sqrt(r2);
    const a = sun.GM / r2; // GM_sun / r^2
    return { x: a * dx / r, y: a * dy / r };
  }
  
  verletStep(sun, dt) {
    // Velocity Verlet / Leapfrog integration
    const halfDt = dt / 2;
    
    // Half-step velocity update
    this.vel.x += this.acc.x * halfDt;
    this.vel.y += this.acc.y * halfDt;
    
    // Full-step position update
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    
    // Recompute acceleration at new position
    this.acc = this.computeAcceleration(sun);
    
    // Second half-step velocity update
    this.vel.x += this.acc.x * halfDt;
    this.vel.y += this.acc.y * halfDt;
    
    // Record swept area for Kepler Law 2 verification
    this.sweptArea += 0.5 * Math.abs(
      this.pos.x * this.vel.y - this.pos.y * this.vel.x
    ) * dt;
  }
}
```

With Verlet integration: the orbit stays closed indefinitely. Measure swept area each second — it's constant (Kepler 2). Measure period and semi-major axis for 8 different orbits — plot T² vs a³ — perfect straight line (Kepler 3). All three laws emerge from the single equation F = GMm/r². Newton was right.

## The Wow Moment — Push It

Build the **full solar system simulation**. Include all 8 planets with correct relative orbital radii (Mercury through Neptune scaled for visibility), initial velocities from NASA ephemeris data (scaled), and correct mass ratios. Run at 1000× speed. Watch all 8 planets orbit simultaneously. Mercury is visibly faster than Neptune, exactly as predicted. Draw the orbital period ratios: Mercury:Earth ≈ 0.24:1; Neptune:Earth ≈ 165:1. Verify T²/a³ = constant for all 8 planets — display the table live as the simulation runs. Then show the **Jupiter-Saturn 5:2 near-resonance**: after 5 Jupiter orbits and 2 Saturn orbits (about 59 years), they nearly realign. Show the alignment pattern repeating — not exact resonance (which would be destabilizing) but near-resonance that nevertheless patterns the outer solar system.

Then demonstrate **orbital chaos**: add a massive rogue planet on a hyperbolic flyby trajectory through the inner solar system. Watch Earth's orbit perturb — a few orbits later Earth's eccentricity has increased slightly. Remove the rogue planet: Earth's orbit is permanently changed. The three-body problem has no closed-form solution — but numerically we can simulate it, and it shows the sensitivity to initial conditions that defines chaos. Butterfly effect in orbital mechanics: the rogue planet's starting position shifted by 1 km leads to completely different long-term Earth orbital histories.

Finally: **binary star + circumbinary planet** (Tatooine-style). Two stars orbiting their common center of mass. A planet orbits both. Watch the planet's orbit weave in a figure-eight pattern (if in a near-resonance) or a stable but irregular loop. This is the system from Star Wars — and it's physically real. Several circumbinary planets have been confirmed by Kepler Space Telescope.

## The Interactive Demo

Canvas at 1200 × 700 px. Solar system view with zoom controls from Mercury-scale (tight orbits) to Neptune-scale (full solar system).

**Initial velocity vector:** Click and drag to place a planet with a custom velocity. The resulting orbit trace draws immediately. Eccentricity, period, and semi-major axis displayed.

**Integrator selector:** Dropdown — Euler, Symplectic Euler, Velocity Verlet, RK4. Energy conservation plot shows drift for each integrator over 100 orbits. Euler: obviously drifts. Verlet: flat line. RK4: flat line but more expensive per step. The comparison makes the integrator choice concrete and educational.

**Preset orbits:** Earth, Mars, Halley's Comet (highly elliptical, shows Law 2 dramatically — fast at perihelion, slow at aphelion), Oumuamua (hyperbolic — E > 0, one-way pass through the solar system).

**Kepler verification panels:** Three side panels (collapsible):
- K1 Panel: Best-fit ellipse overlaid on orbit trace. Shows focus positions and eccentricity.
- K2 Panel: Live area-sweep visualization — triangle from Sun to planet position drawn each second. All triangles should have equal area. Area meter shows constancy.
- K3 Panel: Table of (a, T) for all active planets. "Verify K3" button fits a line to log(T) vs log(a) — slope should be 3/2 = 1.5. Slope readout displayed with precision.

**Perturbation mode:** Introduce a rogue mass via click-and-drag. Watch orbital parameters change. Undo button to remove perturbation.

**Multi-star mode:** Place two stars to create a binary star system. Planet orbit around both. Toggle Lagrange points visualization (the five equilibrium points in the three-body problem where a small mass can maintain a stable or semi-stable position).

**Time warp:** 1× to 10,000×. At 10,000×, Neptune completes an orbit in about 6 minutes real time.

## Production Notes

**Runtime estimate:** ~16–18 minutes. Hook/Kepler history (2 min), Naive circular code (2 min), Euler failure demo (2.5 min), Physics explanation of Verlet (3 min), Fix + Kepler law verification (3 min), Wow moments (3.5 min), Interactive demo (2 min).

**Screen layout:** Astronomy-heavy, canvas dominant. Use 75/25 canvas/code. During the integrator comparison section, show both the orbit traces (canvas) and the energy-over-time plot (second canvas panel) simultaneously.

**Animations to prepare:** Kepler's pencil-and-ellipse construction (pre-animated, showing the focus-to-orbit-to-focus property). The equal-area sweep visualization (pre-animated slowly to make it clear). The T²/a³ log-log plot building point by point as each planet completes an orbit.

**Key zoom moments:** (1) The Euler orbit spiraling outward vs the Verlet orbit staying closed — hold on this side-by-side for 5 seconds without narration. (2) The K2 area sweep — slow motion, showing the fat triangle at perihelion and the skinny triangle at aphelion having equal area. (3) The K3 table populating and the slope fitting to exactly 1.500 on the log-log plot.

**B-roll:** Archival images or artist's depictions of Kepler and Brahe. The Kepler space telescope (NASA public domain). A binary star system image (Albireo — a visually distinct double star). Halley's comet photographs from 1986 apparition.

**Historical accuracy note:** In the hook, mention that Kepler's ellipse insight was hard-won — his Mars data fit an oval, and he initially tried an oval equation before trying the simpler ellipse. The ellipse fit better. This small detail humanizes the process of scientific discovery and sets up the channel's theme: the bug (oval doesn't fit) revealed the truth (ellipse does fit).

## Tags
`physics` `kepler` `orbital-mechanics` `gravity` `ellipse` `period` `javascript` `canvas` `beginner`

## Thumbnail

A glowing elliptical orbit on a dark star-field background, with a bright yellow star (slightly off-center, at the focus). A planet is at two positions on the orbit: one near the star (labeled "FAST"), one far from the star (labeled "SLOW"). Between each position and the star, a shaded triangle shows the equal area swept in equal time — the two triangles are visibly different shapes (one fat and wide near perihelion, one thin and elongated near aphelion) but labeled "SAME AREA." Bold text at top: "KEPLER NEVER KNEW WHY." Subtext: "Newton's equation explains everything." The equal-areas visualization in the thumbnail directly illustrates Law 2 — the most visually non-obvious of the three laws — making viewers want to understand it. The "Kepler never knew why" hook triggers historical curiosity. Clean black background with electric blue orbit trail and golden star glow. Emotion: "This is deeper than I thought."
