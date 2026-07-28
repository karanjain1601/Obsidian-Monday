---
title: "Why Raindrops Make Rainbows (Snell's Law Inside a Drop)"
id: B042
difficulty: 2.5/10
prereq: "B011 — Refraction, B012 — Total Internal Reflection"
concept: "Snell's law applied at entry and exit plus one internal reflection inside a spherical droplet; the minimum deviation angle (rainbow angle) concentrates light at ~42° from the anti-solar point, separating colors by wavelength."
tags: [physics, rainbow, snells-law, refraction, optics, dispersion, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why Raindrops Make Rainbows (Snell's Law Inside a Drop)

**Alt title:** "One Raindrop to Rule Them All (Tracing Light Through a Sphere)"
**Difficulty:** 2.5/10 | **Prereq:** B011 — Refraction | B012 — Total Internal Reflection

---

## Opening Hook (0:00–1:00)

Stand in front of the camera, hand the audience a single transparent glass marble, and ask: "This marble can make a rainbow. Everything you need to understand a full sky rainbow is inside this one sphere of glass." Then cut to a canvas visualization of a single raindrop — a gray circle on a dark background — with a yellow ray of light entering from the left. The ray refracts inward at the surface, bounces off the inside-back of the droplet, then exits through the front at a very specific angle. 

Now render the same experiment with 500 parallel rays hitting the droplet at different heights (different impact parameters). Every ray exits at a different angle — except there is a remarkable clustering near one angle: 138° from the incoming direction (equivalently, 42° from the direction back toward the Sun). That clustering angle is the rainbow angle, and it exists not because someone designed it into the rules of optics, but because it is the angle of minimum deviation — the turning point in the deflection function where `dD/db = 0`. Light piles up at that angle like traffic at a bottleneck, making the direction bright. And since the refractive index of water varies slightly with wavelength, red light piles up at 42.0° and violet at 40.6°, separating the colors by 1.4° — a tiny angle that the human eye resolves as a full color arc across the sky.

---

## The Naive Attempt

Open VS Code with a canvas element. First attempt: model each raindrop as a perfect mirror, reflecting light back at an angle equal to the incident angle (like a mirror ball or chrome sphere).

```javascript
function mirrorDroplet(ctx, rayY, dropCenterX, dropCenterY, dropRadius) {
  // Entry point on sphere surface
  const dx = 0; // horizontal component (ray going right)
  const dy = rayY - dropCenterY;
  if (Math.abs(dy) > dropRadius) return; // ray misses
  const entryX = dropCenterX - Math.sqrt(dropRadius**2 - dy**2);
  
  // Normal at entry point (points radially outward)
  const nx = (entryX - dropCenterX) / dropRadius;
  const ny = dy / dropRadius;
  
  // Reflect: r = d - 2(d·n)n
  const dot = nx; // incident direction is (1,0), so d·n = nx
  const reflectX = 1 - 2*dot*nx;
  const reflectY = 0 - 2*dot*ny;
  
  // Draw reflected ray
  ctx.beginPath();
  ctx.moveTo(entryX, rayY);
  ctx.lineTo(entryX + reflectX * 200, rayY + reflectY * 200);
  ctx.stroke();
}
```

Run this for 20 parallel rays. All reflected rays cluster vaguely backward, and the rainbow position comes out near 180° (directly back toward the Sun). There is no color separation — all wavelengths reflect at identical angles because there was no refraction and no wavelength-dependent refractive index.

---

## The Moment of Failure

With the mirror model running, the canvas shows a white blob of reflected light at roughly 180° — directly backward toward the Sun. That's no rainbow. It is the sun's glory (the bright halo you sometimes see around a shadow on fog or clouds), but it is not a rainbow. The mirror drops produce no arc structure, no color separation. They just throw light back at you. The simulation says: a field of mirror spheres would look like a giant mirror reflecting the Sun back at you.

Now try adding a naive "wavelength slider" where you manually assign different reflection angles to different colors — just to see what the shape of a rainbow *should* look like. This confirms the arc shape is correct (it's a geometric consequence of the Sun being at a point source behind you) but the colors are completely fabricated — you're just making up the numbers. There is no physics explaining *why* colors separate or *why* the primary rainbow is at 42° specifically. That requires solving the actual geometry.

---

## Why It Broke — The Physics

A raindrop is not a mirror — it is a transparent sphere. Light entering a sphere is refracted (bent) at the entry surface, travels through the water, reflects off the interior back surface (partial internal reflection — the rest exits), then refracts again at the exit surface. The total deviation of the ray from its original direction is:

$$D(\theta_i) = 180° + 2\theta_i - 4\theta_r(\theta_i)$$

where θᵢ is the angle of incidence and θᵣ is the refraction angle given by **Snell's law**:

$$n_1 \sin\theta_i = n_2 \sin\theta_r \implies \theta_r = \arcsin\!\left(\frac{\sin\theta_i}{n(\lambda)}\right)$$

Here `n(λ)` is the wavelength-dependent refractive index of water: approximately 1.331 for red light (700 nm) and 1.343 for violet light (400 nm). This is **dispersion** — the key that separates colors.

The deviation function D(θᵢ) has a minimum — the **rainbow angle** — found by setting dD/dθᵢ = 0:

$$\frac{dD}{d\theta_i} = 0 \implies \cos^2\!\theta_i = \frac{n^2 - 1}{3}$$

Solving for n = 1.331 (red): θᵢ ≈ 59.5°, θᵣ ≈ 40.3°, D_min ≈ 137.8°. So red light clusters at 180° − 137.8° = 42.2° from the anti-solar direction. For violet (n = 1.343): D_min ≈ 139.4°, rainbow angle ≈ 40.6°. The rainbow spans the 1.6° between them.

The minimum in D(θᵢ) means light from all nearby impact parameters piles up at the same output angle — a **caustic** — creating a bright concentration of light there.

---

## The One Concept

**Snell's Law and dispersion inside a sphere** constitute the complete optical mechanism of the rainbow. There is no approximation here — this is the exact geometric optics solution, first derived by Descartes in 1637 and later refined with wave-optics corrections by Airy.

**Formal statement of Snell's Law:**
$$n_1 \sin\theta_1 = n_2 \sin\theta_2$$

The ratio n₁/n₂ determines how much a ray bends at the interface between two media. When n₂ > n₁ (entering a denser medium), the ray bends toward the normal.

**Dispersion:** The refractive index of any transparent material varies with wavelength. For water, this variation follows the Cauchy equation: `n(λ) = A + B/λ² + C/λ⁴`. Shorter wavelengths (violet) have higher n, bend more, and emerge at a smaller angle from the anti-solar direction. This is why violet is on the inside of the primary rainbow arc (lower angle) and red is on the outside.

**The minimum deviation angle:** The fact that D(θᵢ) has a minimum means there is a *caustic* — a direction where many rays converge. This is why the rainbow is bright. If D were monotone, rays would spread evenly and no arc would be visible.

**Key equation — Impact parameter b and rainbow angle:**
$$b = \sin\theta_i = R\cdot p \quad \text{(where p ∈ [0,1] is normalized impact parameter)}$$

**Real-world examples:**
1. **Secondary rainbow** — two internal reflections (not one) produce a second arc at ~51°, reversed in color order (red inside, violet outside), and dimmer because each reflection loses some light to transmission.
2. **Alexander's dark band** — the region between 42° and 51° appears darker than the rest of the sky because no singly-reflected or doubly-reflected rays emerge between those angles. The sky is bright both inside the primary bow and outside the secondary bow, but genuinely dark in between.
3. **Ice halos** — when ice crystals (hexagonal plates and columns) replace water droplets, refraction through 60° prism angles produces the 22° halo and 46° halo — same physics (Snell's law), different geometry.

---

## The Fix

Implement geometrically correct ray tracing through a sphere for each wavelength:

```javascript
function rayThroughDrop(b, n, R = 1.0) {
  // b = impact parameter (0 to 1), n = refractive index
  // Returns total deviation angle in degrees
  
  const thetaI = Math.asin(b);           // angle of incidence
  const thetaR = Math.asin(b / n);       // angle of refraction (Snell's law)
  
  // Total deviation: entry refraction + internal reflection + exit refraction
  const D = Math.PI + 2*thetaI - 4*thetaR;
  return D * 180 / Math.PI;
}

function findRainbowAngle(n) {
  // Find minimum deviation by sampling
  let minD = 999, minB = 0;
  for (let b = 0.01; b < 0.99; b += 0.001) {
    const D = rayThroughDrop(b, n);
    if (D < minD) { minD = D; minB = b; }
  }
  return { angle: 180 - minD, impactParam: minB };
}

// Trace a colored rainbow
function renderRainbow(ctx, width, height) {
  const wavelengths = [
    { lambda: 700, n: 1.331, color: 'rgba(255,0,0,0.6)' },
    { lambda: 620, n: 1.333, color: 'rgba(255,165,0,0.6)' },
    { lambda: 570, n: 1.336, color: 'rgba(255,255,0,0.6)' },
    { lambda: 530, n: 1.338, color: 'rgba(0,200,0,0.6)' },
    { lambda: 470, n: 1.340, color: 'rgba(0,50,255,0.6)' },
    { lambda: 420, n: 1.343, color: 'rgba(130,0,200,0.6)' },
  ];
  
  // For each wavelength, trace 500 rays through the drop
  wavelengths.forEach(({ n, color }) => {
    for (let b = 0.05; b < 0.99; b += 0.002) {
      const D = rayThroughDrop(b, n);
      const exitAngle = D * Math.PI / 180;
      // Convert angle to canvas position (observer geometry)
      const x = width/2 + Math.cos(exitAngle) * 300;
      const y = height/2 - Math.sin(exitAngle) * 300;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 2, 2);
    }
  });
}
```

The clustering of dots near the minimum deviation angle produces visually bright arcs at the correct colors and correct radii — red outermost, violet innermost.

---

## The Wow Moment — Push It

**Scene 1 — Full rainbow render:** Simulate 10,000 raindrops arranged in a vertical curtain in 3D space. The camera (observer) faces the curtain with the Sun directly behind. For each raindrop, trace rays at 50 impact parameters across 6 wavelengths. Accumulate the outgoing ray directions into an angular histogram. The result: a luminous colored arc at exactly the right angle, emerging naturally from pure geometry and Snell's law. No artistic choices were made about arc radius or color position — physics computed them.

**Scene 2 — Secondary rainbow:** Extend the simulation to two internal reflections. The second rainbow appears at 51°, with reversed color order (red on the inside, violet outside, matching photos). Both bows are visible simultaneously, with Alexander's dark band between them genuinely darker. Show the explanation: in the dark band, neither singly-reflected nor doubly-reflected rays emerge — the geometry forbids it.

**Scene 3 — Supernumerary bows:** Shrink the raindrop size to 0.1 mm. Now wave optics matters: rays from slightly different impact parameters that arrive at the same angle interfere — producing alternating bright and dark fringes just inside the primary bow. These are **supernumerary arcs**, the pastel bands visible inside a brilliant rainbow after a rainstorm. The simulation must use wave-optics phase calculations: accumulate amplitude (not intensity) and square at the end.

**Scene 4 — Solar elevation dependence:** Sweep the Sun's elevation angle from 0° (sunrise) to 42° (rainbow just touching the horizon) to 90° (Sun overhead — no rainbow visible, the 42° cone points entirely underground). The rainbow arc shrinks and disappears as the Sun climbs — explaining why you only see rainbows in the morning and evening.

---

## The Interactive Demo

**Drop cross-section panel (left 40%):** A large circle representing a single raindrop's cross-section. A horizontal ray enters from the left at an adjustable height (impact parameter slider). The ray is drawn: refracted entry, internal path, reflected at back, refracted exit. The exit ray's angle is displayed numerically. The impact parameter position is marked on the front of the circle. A "trace all rays" button floods the drop with 100 parallel rays at once, showing how they fan out — with clear bunching at the rainbow angle.

**Deviation curve panel (middle 20%):** A live plot of D(θᵢ) — deviation angle on Y axis, impact parameter on X axis. The minimum is marked with a vertical line and labeled "Rainbow angle." As the wavelength changes, the curve shifts and the minimum moves, illustrating color separation.

**Full rainbow panel (right 40%):** Circular sky view from the observer's perspective. Sun dot behind the observer. Rainbow arc rendered with correct colors. Sliders for: Sun elevation (0° to 90°). Drop radius (0.05 mm to 2 mm — affects supernumerary fringe spacing). Observer height above rain curtain. Secondary rainbow toggle. Wave optics (supernumerary bows) toggle. Wavelength range selector (what colors are present — useful for simulating monochromatic rainbows seen through colored filters).

**Data readouts:** Primary rainbow angle for selected wavelength. Secondary rainbow angle. Alexander's dark band angular width. Drop size vs. rainbow vividness.

---

## Production Notes

**Runtime targets:** Hook 1:00 — Naive attempt 2:00 — Moment of failure 1:00 — Physics 3:30 — The one concept 2:30 — The fix (live code) 3:30 — Wow moments 4:00 — Demo 2:30 — Total ~20 minutes.

**Screen layout:** Left panel shows the geometric raindrop cross-section with animated ray paths (thick colored lines with arrows). Right panel shows the full rainbow visualization. Code editor visible below with syntax highlighting. Toggle between "geometry view" and "full rainbow" as needed.

**Key zooms:** Zoom on the deviation vs. impact parameter curve at the moment the minimum appears — this is the mathematical heart of the video. Zoom on the exit angle display as the impact parameter slider moves through the minimum: watch the angle change direction (from decreasing to increasing) exactly at the rainbow angle. Zoom on the transition from geometrical to wave-optics mode: supernumerary fringes appear suddenly inside the primary bow.

**Animations to prepare:** (1) Animated Descartes diagram — historical drawing of ray through sphere with labeled angles, animated as the narration explains each interface. (2) Side-by-side photo of real rainbow with secondary bow and Alexander's dark band visible, annotated with correct angle values. (3) Dispersion diagram — plot of refractive index vs. wavelength for water (the Cauchy curve) with the red and violet values highlighted.

**B-roll:** Real rainbow photograph with clear primary and secondary bows. Macro photograph of a single water droplet on a leaf acting as a lens, with a tiny rainbow projected inside. Newton's prism dispersion experiment recreation using canvas animation.

---

## Tags

`physics` `rainbow` `snells-law` `refraction` `optics` `dispersion` `javascript` `canvas` `beginner`

---

## Thumbnail

A photorealistic simulation of a single large raindrop — perfect sphere, rendered with depth and translucency — with a white light ray entering from the left. Inside the sphere, the ray splits into a spectrum: red to violet, bending and reflecting off the interior back wall. The exiting ray fans out into a small but distinct rainbow arc. Behind the drop: pitch black. Text overlay at the bottom: "One Drop. The Whole Rainbow." The visual communicates everything: one droplet contains the full physics, and seeing the color separation happen *inside* the sphere is the revelation. The sphere should have a slight blue tint (water), a bright specular highlight at the top, and enough transparency to show the internal ray paths clearly. Extremely clean and elegant — it will stand out against the usual "rainbow over landscape" imagery by being purely mechanical and satisfying.
