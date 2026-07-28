---
title: "The Tipping Point: Why Tables Fall Over (Center of Mass)"
id: B028
difficulty: 1.5/10
prereq: "B007"
concept: "Stability: CoM projection must fall within support polygon (convex hull of contact points)"
tags: [physics, center-of-mass, stability, torque, statics, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# The Tipping Point: Why Tables Fall Over (Center of Mass)

**Alt title:** One Dot Determines Whether Anything Falls Over — The Center of Mass
**Difficulty:** 1.5/10 | **Prereq:** B007

---

## Opening Hook (0:00–1:00)

Open on the Leaning Tower of Pisa: its dramatic lean is immediately recognizable. It has been leaning since the 12th century and the question is always: why hasn't it fallen? The answer is a single geometric fact — the center of mass of the tower, projected vertically downward, still lands inside the base footprint. Show an overlay diagram: the tower's CoM is about 2.4 meters offset from center due to the lean; the base is about 15 meters wide; the CoM projection falls safely inside the base area. As long as this condition holds, the tower stands. Calculate: it would need to lean approximately 5.44° more before the CoM exits the base — engineers in the 1990s corrected the lean slightly to ensure many more centuries of safety.

Now show the opposite: a table with a bowling ball sitting at one end. Show the table tipping dramatically — the far legs lifting, the table toppling. Show a waiter carrying a large tray of glasses stacked asymmetrically: the tray balances perfectly because the waiter has positioned the loaded side over the support. Then show a tightrope walker with a long, heavy pole — the pole's downward droop moves the combined CoM lower, and the wide sweep of the pole ends means the CoM moves more slowly sideways when the walker sways. All from the same concept: the relationship between the CoM's vertical projection and the support polygon. Say: "We are going to simulate this from scratch, and the bug in the naive code is going to teach us exactly why this rule matters."

## The Naive Attempt

Build a simulation of a rectangular block sitting on a surface, with multiple mass elements that can be placed interactively. To determine stability, compute the location of the center of mass. The naive approach: use the geometric centroid — the average of the corner positions:

```javascript
function computeNaiveCOM(object) {
  // Assume uniform density — use geometric center
  const centerX = (object.x + object.width / 2);
  const centerY = (object.y + object.height / 2);
  return { x: centerX, y: centerY };
}
```

Then check stability by seeing if the CoM's x-coordinate (the projection onto the ground plane) falls between the leftmost and rightmost support points:

```javascript
function isStable(com, leftSupport, rightSupport) {
  return com.x >= leftSupport && com.x <= rightSupport;
}
```

This works correctly for a uniform rectangular block — the geometric centroid and the actual CoM are the same. Build the simulation and show it working: a tall block, uniformly colored, leans until the geometric center is outside the base → it falls. So far so good.

Now add an interactive feature: allow the user to place additional "mass objects" on the block — representing heavy loads. The naive code uses only the block's geometric centroid and ignores the added masses entirely. The stability check is not updated. An extra 10 kg weight placed at one end does not affect the computed CoM.

## The Moment of Failure

Place the block with one very heavy mass object at the right end. The naive simulation displays the CoM at the block's geometric center — right in the middle, nowhere near the loaded end. The stability display says "STABLE." But watch: the physical simulation (separate from the stability check) has the object immediately topple toward the weighted side. The stability indicator stays green while the object falls. The mismatch is jarring and immediate — the stability check is completely disconnected from physical reality.

Make the failure clearer: construct a case where the naive model predicts the opposite of reality. A T-shaped object (a block with a heavy extension on one side): the geometric centroid of the T-shape falls over the main block's base, so the naive model says stable. But the extension is made of lead (very high density) while the main block is foam (very low density). The actual CoM is way out on the lead extension — outside the base. The naive model says "stable"; the physical simulation shows immediate toppling. Show the two outcomes side by side: stability indicator says green, simulation shows the object on the floor. Perfect bug illustration.

## Why It Broke — The Physics

The center of mass of a system of particles or mass elements is defined as the density-weighted average position:

**r_cm = Σ(m_i · r_i) / Σ(m_i)**

For a continuous object: **r_cm = (1/M) · ∫ r · dm = (1/M) · ∫ r · ρ(r) · dV**

The geometric centroid (used in the naive model) equals the CoM only when the density is uniform. For any object with non-uniform density or added point masses, the geometric centroid gives the wrong answer. The geometric centroid is a purely geometric property; the CoM is a mechanical property that depends on how mass is distributed.

**Stability criterion:** An object is in static equilibrium when the net force and net torque about any point are both zero. For an object sitting on a support surface, the gravitational force (acting downward at the CoM) and the normal force (acting upward from the support region) must cancel. The normal force can only act within the support polygon — the convex hull of all contact points between the object and the ground. If the CoM projects (vertically) inside the support polygon, the normal force can be distributed to produce zero net torque. If the CoM projects outside the support polygon, no distribution of normal forces within the support polygon can create zero net torque — gravity creates a net torque about the tipping edge that accelerates toppling.

**Torque at the tipping point:** When the CoM projection is at horizontal distance d outside the support edge, the tipping torque about the edge is:

**τ = M · g · d**

This torque is unopposed (the normal force acts at or inward from the edge) and causes angular acceleration α = τ/I where I is the moment of inertia about the tipping edge.

## The One Concept

The center of mass of a body is the mass-weighted average position of all its mass elements. It is the point at which the total mass can be considered concentrated for calculating gravitational effects and translational motion. The stability of a resting object depends entirely on whether the vertical projection of the CoM falls within the support polygon — the convex hull of contact points with the ground. Objects with CoM projection inside the polygon are stable; outside the polygon, they topple under gravitational torque.

**Physical intuition:** Gravity acts on every mass element simultaneously, but for calculating the net gravitational force, it is equivalent to a single force M·g acting downward at the CoM. For an object to not tip over, the support surface must provide an equal and opposite upward force. The support can only push upward (not pull down) and only acts where the object touches the ground. If the gravity force (at the CoM projection) is outside the support region, the support forces cannot create a balancing torque — tipping is inevitable.

**Key equation:** r_cm = Σ(m_i · r_i) / Σ(m_i). Stability condition: vertical projection of r_cm lies within the convex hull of support contact points. Tipping torque: τ = M·g·d, where d is horizontal distance from CoM projection to nearest support edge (positive = outside = toppling).

**Real-world examples:**
1. **Leaning Tower of Pisa:** 5.5° lean, CoM offset ~2.4 m, base radius ~7.7 m. Critical angle ≈ arctan(7.7/24) ≈ 17.8° lean from vertical before toppling. Current lean is safely inside.
2. **Double-decker bus:** Stability tests involve tilting the bus to verify CoM stays within the wheel base. Modern buses have CoM deliberately lowered by placing heavy components (batteries, engines) in the floor.
3. **Tightrope walking:** The support polygon is a single point (one foot contact). The walker's CoM must stay directly above that point. The long pole increases the moment of inertia, slowing lateral sway so the walker has more time to correct. The pole also visually indicates CoM position.
4. **Shipping containers and cargo:** Maritime regulations specify maximum stacking heights and load distributions to keep ship CoM within the hull's metacentric limits. A ship with CoM too high rolls uncontrollably (capsizes); too low and it rights violently, also dangerous.

## The Fix

Replace the geometric centroid with the proper mass-weighted CoM, incorporating all mass elements:

```javascript
function computeCoM(baseObject, additionalMasses) {
  let totalMass = baseObject.mass;
  let sumX = baseObject.mass * baseObject.cx; // cx = center x of base object
  let sumY = baseObject.mass * baseObject.cy;

  for (const mass of additionalMasses) {
    totalMass += mass.value;
    sumX += mass.value * mass.x;
    sumY += mass.value * mass.y;
  }

  return { x: sumX / totalMass, y: sumY / totalMass };
}

function computeSupportPolygon(contactPoints) {
  // Convex hull of all ground contact points
  return convexHull(contactPoints);
}

function isStable(com, supportPolygon) {
  // Check if com.x projection falls inside the 1D support interval (2D case)
  // For general 3D: use point-in-polygon test
  return com.x >= supportPolygon.minX && com.x <= supportPolygon.maxX;
}
```

Draw the CoM as a prominent dot on the simulation canvas — filled red when unstable, filled green when stable. Draw the support polygon as a highlighted region. Draw a vertical dotted line from the CoM to the ground to show the projection. As the user adds masses interactively, the CoM dot moves in real time. Drag the CoM dot toward the edge of the support polygon — the dot turns yellow, then red, and the object begins to slowly lean and then topple when the line exits the support zone.

## The Wow Moment — Push It

The cantilevered books puzzle: can you stack n books on a table edge so the topmost book overhangs entirely past the table edge — with no part of the top book over the table? The answer is yes, and the maximum overhang follows a beautiful mathematical series. Place n books in a staircase pattern; the maximum overhang of the top book beyond the table edge is:

**H_n = (L/2) · Σ(1/(2k)) = (L/4) · H_n_harmonic**

For the full harmonic series: H_n = (L/2) · (1 + 1/2 + 1/3 + ... + 1/n) / 2. With 4 books: max overhang ≈ 0.77L. With 10 books: ≈ 1.47L — the top book can be more than one full book-length past the table edge.

Simulate this: show each book's CoM, the support polygon for each book (the surface area of the book below it), and verify that each book's CoM is inside its support polygon. The key constraint: book k must have its CoM (including all books above it) within the support polygon provided by the books below it. Build the staircase incrementally, computing maximum overhang at each step. As more books are added, the overhang grows logarithmically — slow but unbounded. Watch the simulation as the top book cantilevers further and further past the table edge, the stack becoming increasingly precarious-looking but always technically stable.

Show the critical moment: add one book too many at the wrong position — the CoM exits the support polygon, and the entire cascade topples in slow motion. The dominoes effect of one instability propagating through the stack is visually spectacular.

## The Interactive Demo

Interactive click-and-drag browser simulation with real-time CoM tracking and stability display.

**Controls:**
- **Click to add mass:** Click anywhere on the simulated object to add a point mass. Default mass = 1 unit. Shift-click to add a 5-unit mass (visually larger).
- **Drag masses:** Drag existing mass elements to new positions. CoM dot updates instantly. Watch stability change as mass moves.
- **CoM indicator:** Prominent colored dot showing current CoM position. Red = unstable (CoM outside support polygon), green = stable. Vertical projection line shown as a dashed line to the ground.
- **Support polygon overlay:** Highlighted base region showing the support polygon. Changes shape when the object leans or when only some feet are in contact.
- **Tipping simulation:** Click "Release" to let physics run. The object falls according to computed torque if unstable. Slow-motion toggle available.
- **Preset scenarios:** (1) Leaning Tower of Pisa — adjustable lean angle, real-time stability readout. (2) Table + bowling ball — place the ball at different positions. (3) Tightrope walker — a stick figure with an adjustable pole. (4) Cantilevered books — stack books and watch CoM track.
- **Snap to tipping point:** Button that automatically calculates and moves the mass distribution to exactly the critical angle (CoM on the support edge). The object is in unstable equilibrium — any perturbation topples it.
- **3D mode:** Optional 3D view (three.js) with a full 2D support polygon (rectangle). Masses can be placed anywhere on the top surface. CoM projection shown as a dot on the ground plane.

## Production Notes

**Runtime target:** ~11 minutes. Hook: 1.5 min. Naive code: 1.5 min. Failure: 1 min. Physics: 2.5 min. Fix: 1.5 min. Wow moment: 2.5 min. Demo: 1 min.

**Screen layout:** Side-view 2D canvas for the main simulation. The CoM dot should be prominently visible — large, colored, with a clear vertical projection line. Support polygon should be highlighted in a distinct translucent color. Code editor can be in a narrow side panel and collapses for the demo.

**Animations to pre-render:** (1) Leaning Tower of Pisa with CoM overlay and support polygon shown, (2) 3D CoM animation for a compound object showing mass-weighted averaging, (3) cantilevered books series showing harmonic series buildup, (4) ship stability diagram (metacenter) for extension context.

**Key moments to zoom:** The instant the CoM dot crosses the support polygon edge and the stability indicator flips from green to red, the cascade toppling of the books when one book exceeds its support, and the Leaning Tower critical angle calculation.

**B-roll:** Leaning Tower of Pisa footage, tightrope walker with balancing pole, waiter with tray, double-decker bus tilt test (common road safety test footage).

**Mathematical note:** The cantilevered books problem uses the harmonic series divergence — with enough books, any finite overhang is achievable. This is a famous puzzle in mathematical physics. Give it a full 30 seconds of explanation — it is genuinely surprising to most viewers that the overhang is unbounded.

## Tags

`physics` `center-of-mass` `stability` `torque` `statics` `javascript` `canvas` `beginner`

## Thumbnail

A simulation canvas: a rectangular block drawn in 3D-ish perspective is clearly leaning at a dangerous angle. A bright red dot labeled "CoM" sits near the top of the leaning object, with a bold red vertical dashed line dropping to the ground. The dashed line lands just outside the highlighted base support polygon (a translucent green rectangle on the ground). The stability indicator shows "UNSTABLE" in large red letters. In the corner, a small inset shows a photograph of the Leaning Tower of Pisa with a green dot and line that land safely inside the base — "STABLE." Top text overlay: "THE TIPPING POINT" in large bold yellow. Bottom text: "Why anything falls over — coded in JavaScript." The emotion triggered is "I never thought about why things tip over" combined with the visual clarity of a single dot determining stability — the simplicity of the rule is the hook.
