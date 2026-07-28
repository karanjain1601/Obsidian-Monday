---
title: "The Expanding Universe: Visualizing Hubble's Law"
id: B049
difficulty: 2/10
prereq: "None"
concept: "Hubble's law v = H₀·d describes metric expansion: the scale factor a(t) stretches all co-moving separations, so every observer sees every other galaxy receding with velocity proportional to distance. Space itself expands — not galaxies moving through space."
tags: [physics, cosmology, hubble-law, expansion, redshift, dark-energy, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# The Expanding Universe: Visualizing Hubble's Law

**Alt title:** "There Is No Center of the Universe (And the Balloon Proves It)"
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Show Edwin Hubble's original 1929 data in its historical form: a scatter plot on graph paper, hand-drawn, with galaxy distances on the X axis (in units of parsecs, the technology of 1929) and recession velocities on the Y axis (in km/s, measured from Doppler-shifted spectral lines). There is a clear upward trend. The further a galaxy, the faster it recedes. Hubble drew a line through the data; the slope of that line is now called the Hubble constant, H₀.

Now show the most commonly misunderstood implication: ask the audience — "What does this mean? Are galaxies flying away from us? Are we at the center of an explosion?" Show a simple misconception model: galaxies moving outward from a central point labeled "Us." This is WRONG. If it were true, we would be the center of the universe — which is contradicted by every cosmological observation and would be a remarkable coincidence.

Show the balloon demonstration: a balloon with ten dots drawn on its surface, being inflated. As the balloon expands, each dot recedes from every other dot simultaneously. An observer on any dot would see exactly the same thing: all other dots receding, with recession speed proportional to distance. There is no special dot. There is no center on the surface of the balloon. The expansion is a property of the 2D surface itself, not a motion of the dots through the surface.

This is the actual physics: space itself expands. Galaxies are carried apart like dots on a balloon. Hubble's law is not about motion through space — it is about the expansion of space.

---

## The Naive Attempt

Code a universe simulation: place galaxies at random positions in a 2D canvas centered on "us" at the center. Assign each galaxy a random outward velocity — random direction, random speed.

```javascript
const galaxies = [];
for (let i = 0; i < 100; i++) {
  const angle  = Math.random() * 2 * Math.PI;
  const dist   = 100 + Math.random() * 300;  // pixels from center
  const speed  = Math.random() * 5;           // random speed
  galaxies.push({
    x: CENTER_X + Math.cos(angle) * dist,
    y: CENTER_Y + Math.sin(angle) * dist,
    vx: Math.random() > 0.5 ? speed : -speed,  // random direction!
    vy: Math.random() > 0.5 ? speed : -speed,
  });
}

function update(dt) {
  galaxies.forEach(g => {
    g.x += g.vx * dt;
    g.y += g.vy * dt;
  });
}
```

Run the simulation and plot recession velocity vs. distance. The result: a scatter plot with no trend whatsoever. Some nearby galaxies approach, some far galaxies approach. Some nearby ones recede, some far ones approach. The correlation between distance and recession speed is essentially zero — just the random scatter of random velocities.

Now try the "explosion" model — all galaxies move radially outward from the center at speeds proportional to their initial position. This gives a Hubble-like linear relation! But it implies Earth is at the center of the explosion (we see the same relation in all directions only if we are at the origin). If you switch to a galaxy at a different position and compute the recession velocities of all other galaxies as seen from there, the pattern is no longer linear — galaxies on one side approach, galaxies on the other side recede even faster. The Hubble law breaks down for non-central observers.

---

## The Moment of Failure

Show the "explosion" simulation from two different reference points. From Earth (the center): a perfect Hubble law — all galaxies recede, velocity proportional to distance. From Galaxy A (500 Mpc away): the velocity-distance relation is badly non-linear. Nearby galaxies approach; distant galaxies recede but at speeds that don't follow v = H₀·d.

But in the real universe, every galaxy observes a perfect Hubble law in all directions. Astronomer Slipher measured this from our galaxy. Hubble confirmed it. The Sloan Digital Sky Survey has measured 3 million galaxy redshifts — the Hubble law holds everywhere, in all directions, from every galaxy. The explosion model with a special center is falsified by the isotropy of the observed Hubble law.

The failure reveals the need for a completely different conceptual model: not galaxies moving through a static space, but space itself expanding, carrying all galaxies with it. In this model, Hubble's law is not a consequence of initial conditions (like an explosion) but a geometric identity — a direct consequence of the definition of a uniformly expanding space.

---

## Why It Broke — The Physics

**Metric expansion:** In general relativity and observational cosmology, the universe is described by the Friedmann-Lemaître-Robertson-Walker (FLRW) metric:

$$ds^2 = -c^2 dt^2 + a(t)^2 \left[dr^2 + r^2 d\Omega^2\right]$$

Here, r is the **co-moving coordinate** of a galaxy — it does not change as the universe expands (in the absence of peculiar velocities). The physical distance between two points with co-moving separation Δr is:

$$d_{phys}(t) = a(t) \cdot \Delta r$$

The recession velocity is the time derivative of physical distance:

$$v_{rec} = \dot{d}_{phys} = \dot{a}(t) \cdot \Delta r = \frac{\dot{a}}{a} \cdot d_{phys} = H(t) \cdot d_{phys}$$

where H(t) = ȧ/a is the **Hubble parameter** (time-dependent). Today, H₀ ≈ 70 km/s/Mpc is the Hubble constant (the current value). This is Hubble's law: v = H₀·d. It is not a statement about motion of galaxies — it is a purely geometric identity, a consequence of uniform expansion.

**Why every observer sees the same law:** In co-moving coordinates, all positions r are fixed. The scale factor a(t) multiplies all separations equally. If observer O sees galaxy A receding at v_A and galaxy B at v_B, then observer at galaxy A sees galaxy B receding at v_B - v_A = H₀·(d_B - d_A) = H₀·d_{AB}. The same Hubble law holds, with the same H₀, from every galaxy. This is only true for metric expansion — not for the explosion model.

**The Hubble sphere:** Galaxies at distance c/H₀ ≈ 14 billion light-years recede at exactly c. Galaxies beyond this distance recede faster than light — but this does not violate special relativity because they are not moving through space; space itself is expanding. These distant galaxies are still observable (their light left when the universe was smaller and the light-travel distance was less than c/H₀), but new light from them will never reach us.

---

## The One Concept

**Hubble's Law and Metric Expansion** describe a universe in which the fabric of space itself grows larger over time, carrying galaxies apart like raisins in rising bread. The expansion has no center, no edge, and no "speed limit" — it is not motion, it is geometry.

**The scale factor a(t):** The single function that describes cosmic expansion. At the Big Bang: a = 0. Today: a = 1 (by convention). In 50 billion years: a >> 1. The expansion history is governed by the Friedmann equation:

$$H^2 = \left(\frac{\dot{a}}{a}\right)^2 = \frac{8\pi G}{3}\rho - \frac{kc^2}{a^2} + \frac{\Lambda c^2}{3}$$

where ρ is total energy density (matter + radiation + dark energy), k is the spatial curvature, and Λ is the cosmological constant (dark energy). Current measurements: k = 0 (flat universe), Λ > 0 (dark energy causing acceleration).

**The Hubble tension:** The value of H₀ measured from the CMB (early universe, Planck satellite): 67.4 ± 0.5 km/s/Mpc. The value measured from supernovae and Cepheid variable distance ladders (late universe): 73 ± 1 km/s/Mpc. The 5-sigma tension between these measurements is one of the biggest open problems in cosmology — it may indicate new physics beyond the standard cosmological model.

**Physical intuition — the balloon surface:** A 2D analogy: galaxies are dots on the surface of an inflating balloon. The surface is 2D space, and inflation represents cosmic expansion. Every dot sees every other dot receding, and the recession velocity is proportional to the distance on the balloon surface. There is no center on the surface. The center of the balloon is not in the 2D space — it's in an unobservable 3rd dimension, analogous to how the Big Bang happened in a higher-dimensional sense.

**Real-world examples:**
1. **Cosmic Microwave Background (CMB)** — the afterglow of the Big Bang, redshifted by the factor a(t_emission)/a(t_now) = 1/1100 from the visible range to microwave frequencies. Measuring the CMB temperature anisotropies gives the most precise measurement of H₀ from the early universe.
2. **Type Ia supernovae distance ladder** — standard candles whose peak luminosity is known. Saul Perlmutter, Brian Schmidt, and Adam Riess used them to show in 1998 that the expansion is accelerating (Λ > 0, dark energy). Nobel Prize in Physics 2011.
3. **Baryon Acoustic Oscillations (BAO)** — sound waves in the early universe left a characteristic scale (147 Mpc) imprinted in the galaxy distribution. Measuring this scale at different redshifts directly maps a(t) and H(t) across cosmic time.

---

## The Fix

Replace random velocities with proper metric expansion. Assign co-moving coordinates to each galaxy — these never change. Physical coordinates are co-moving coordinates scaled by the scale factor:

```javascript
// Assign co-moving coordinates at initialization (never change)
const galaxies = [];
for (let i = 0; i < 200; i++) {
  galaxies.push({
    coMovX: (Math.random() - 0.5) * 1000,  // Mpc co-moving
    coMovY: (Math.random() - 0.5) * 1000,
    // Physical position computed each frame from scale factor
  });
}

// Scale factor: simplified Lambda-CDM model
let t = 0;  // cosmic time in Gyr
const H0 = 70; // km/s/Mpc
const t0 = 13.8; // current age of universe in Gyr

function scaleFactorApprox(t_Gyr) {
  // Approximate a(t) for matter+Lambda dominated universe
  // a(t) ~ (sinh(t / t_Lambda))^(2/3) where t_Lambda ≈ 17.3 Gyr
  const tLambda = 17.3;
  return Math.pow(Math.sinh(t_Gyr / tLambda), 2/3);
}

function updateUniverse(dt) {
  t += dt;
  const a = scaleFactorApprox(t) / scaleFactorApprox(t0); // normalized so a=1 today
  
  galaxies.forEach(g => {
    // Physical position = co-moving * scale factor
    g.x = CENTER_X + g.coMovX * a * PX_PER_MPC;
    g.y = CENTER_Y + g.coMovY * a * PX_PER_MPC;
    // No velocity integration needed — position directly from a(t)
  });
}

// Plot Hubble law: recession velocity vs. physical distance
function plotHubbleLaw(observer, galaxies, a, adot) {
  const H = adot / a;  // Hubble parameter at time t
  galaxies.forEach(g => {
    const dx = g.coMovX - observer.coMovX;
    const dy = g.coMovY - observer.coMovY;
    const coMovDist = Math.sqrt(dx*dx + dy*dy);
    const physDist  = a * coMovDist;
    const recVel    = H * physDist;  // Hubble law emerges automatically
    plotPoint(physDist, recVel, '#44ff88');
  });
}
```

Now switch the observer to any galaxy — the Hubble law plot looks identical. The recession velocity is always proportional to physical distance, with the same slope H, regardless of which galaxy is the "observer." The universality of Hubble's law is not assumed — it emerges automatically from metric expansion.

---

## The Wow Moment — Push It

**Scene 1 — The observable universe:** Run the simulation forward to today (t = 13.8 Gyr). Draw a circle of radius 46 billion light-years (the particle horizon — the farthest object whose light has ever reached us) around the observer. Show that even though the universe is only 13.8 Gyr old, the particle horizon is 46 Gly because the universe was expanding during the light travel. Fill the observable sphere with 10,000 simulated galaxy points. Rotate the 3D view slowly — a sphere of light, the entire observable universe rendered in JavaScript.

**Scene 2 — The cosmic fate under dark energy:** Play the simulation forward 150 billion years. All galaxies beyond the Local Group (everything more than ~5 Mpc away) cross the Hubble sphere and become forever unreachable. The observable universe steadily depopulates: the 2,000 galaxies visible today shrink to just the ~50 galaxies in the Local Group. In the far future, any civilization that exists will see only its local cluster — the rest of the universe hidden beyond an expanding horizon. If they try to infer Hubble's law, they will see no recession velocities from nearby galaxies. They will conclude the universe is static.

**Scene 3 — The Hubble tension visualization:** Show two separate measurements of H₀ as histograms on the same plot. The CMB measurement: a narrow Gaussian centered on 67.4. The supernova distance ladder: a narrow Gaussian centered on 73.0. The two Gaussians don't overlap — a 5-sigma tension. Show simulated new physics scenarios (e.g., early dark energy, additional neutrino species) that could shift one measurement. The tension is unsolved and represents one of the most exciting open questions in cosmology.

**Scene 4 — Recession at v > c:** Highlight all galaxies with recession velocities > c in red. These exist today — roughly half of all observable galaxies recede faster than light. Yet we can still see them because their light started its journey when the universe was smaller. Show a photon fired toward us from a galaxy currently receding at 2c: the photon first moves away from us (because space is expanding faster than it can travel), then eventually catches up as the universe's expansion rate decreases. The photon trajectory in co-moving coordinates is a complex curve, not a straight line.

---

## The Interactive Demo

**Galaxy distribution canvas:** 500 galaxy dots on a 2D canvas. The "observer" (labeled "You") is at a position that can be clicked and dragged to any galaxy's location. The Hubble recession velocity arrows emanate from each galaxy, pointing away from the observer. When you move the observer to a different galaxy, all arrows update instantly — and the Hubble law relationship (velocity ∝ distance) remains perfectly intact from the new position. This demonstrates, viscerally, that there is no special observer.

**Hubble constant slider:** H₀ from 60 to 80 km/s/Mpc. As you drag, the arrows change length and the universe's physical scale changes. Show the "Hubble tension" range: a band between 67 (CMB measurement) and 73 (distance ladder measurement), with the current selected value highlighted.

**Scale factor animation:** A timeline control showing cosmic history: t = 0 (Big Bang, a = 0) to t = 100 Gyr (far future, a >> 1). Drag the time slider and watch all galaxy positions update in real time — expanding outward slowly in the matter-dominated era, then accelerating apart in the dark energy era. The observable universe boundary is drawn as a circle that grows, peaks, then becomes effectively fixed (event horizon).

**Dark energy toggle:** Switch between three cosmological models: (1) Matter only (Ω_M = 1, no dark energy) — expansion decelerates and eventually reverses in some models. (2) Standard Lambda-CDM (Ω_M = 0.3, Ω_Λ = 0.7) — accelerating expansion. (3) Phantom dark energy (w < -1) — expansion so aggressive galaxies eventually tear apart (Big Rip). Show the scale factor a(t) curves for all three on an overlay plot.

**Redshift calculator:** Click any galaxy to see its current distance, recession velocity, redshift z = (λ_observed/λ_emitted) - 1, and the light-travel time from that galaxy. For distant galaxies, distinguish between "co-moving distance" (47 Gly to the edge), "light-travel distance" (13.8 Gly max), and "proper distance today" (also up to 46 Gly) — the most confusing aspect of cosmological distances.

**Hubble law plot:** A live scatter plot of recession velocity (km/s) vs. physical distance (Mpc) for all galaxies visible from the current observer position. Always shows a perfect linear relationship. Update in real time as the observer moves and as the time slider is dragged. Add real data overlay: 200 actual galaxy measurements from the Sloan Digital Sky Survey.

---

## Production Notes

**Runtime targets:** Hook 1:30 — Naive attempt 2:30 — Moment of failure 1:30 — Physics 3:00 — The one concept 2:30 — The fix 3:00 — Wow moments 3:30 — Demo 2:30 — Total ~20 minutes.

**Screen layout:** The balloon analogy deserves a dedicated animation segment — not just a brief mention. Build an actual canvas animation of a 2D "balloon surface" (a circle growing outward) with dots on its circumference, demonstrating recession from any dot's perspective. This is one of the clearest visual explanations in cosmology and earns its screen time. Code editor right, galaxy canvas left for the fix segment.

**Key zooms:** Zoom on the observer-drag interaction in the demo — drag from one galaxy to another and show the Hubble law scatter plot updating in real time, remaining linear throughout. This interactive demonstration of observer-independence is the conceptual core. Zoom on the recession-faster-than-light galaxies (Scene 4 of Wow Moment) — the counterintuitive fact that we can see galaxies receding at 2c is a guaranteed audience hook.

**Animations to prepare:** (1) Hubble's 1929 data reproduced exactly as a hand-drawn scatter plot, then updated with modern SDSS data (3 million galaxies, same trend, same slope). The contrast in precision is dramatic. (2) The scale factor curves a(t) for different cosmological models — matter-only, Lambda-CDM, Big Rip — as smooth curves on a single graph with cosmic time on X axis. (3) Animation of a photon traveling through expanding space — showing the photon's position in both physical and co-moving coordinates simultaneously.

**B-roll:** Hubble Space Telescope Ultra Deep Field image (10,000 galaxies in a patch of sky the size of a grain of sand held at arm's length). Planck satellite CMB map. Edwin Hubble at the 100-inch Hooker Telescope at Mount Wilson Observatory (historical photograph, public domain).

---

## Tags

`physics` `cosmology` `hubble-law` `expansion` `redshift` `dark-energy` `javascript` `canvas` `beginner`

---

## Thumbnail

A dark canvas showing the "balloon" analogy made explicit: a large circle (the balloon surface, drawn as a glowing white ring) centered slightly off-center from the canvas. On the ring are ~20 bright dots (galaxies). Arrows emanate from one bright yellow dot (labeled "You" with a small arrow pointing to it) toward every other galaxy — arrows of varying lengths, with longer arrows pointing to more distant galaxies. A few arrows are bright red (recession > c) and labeled with a lightning bolt. Text overlay at the top: "Galaxies Move at 2× Light Speed (And That's Legal)." The subtitle below: "No, you're not at the center." The visual communicates the key ideas in one glance: the arrows show recession, the balloon ring shows there's no special center, and the "faster than light" hook grabs anyone who knows special relativity. High visual contrast with deep black background, glowing white balloon ring, yellow observer dot, gradient arrows from white to red by velocity.
