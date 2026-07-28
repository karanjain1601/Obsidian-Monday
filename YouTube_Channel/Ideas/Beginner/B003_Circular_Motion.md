---
title: "Why Things Fly Off a Spinning Wheel (Circular Motion)"
id: B003
difficulty: 1.5/10
prereq: "None"
concept: "Centripetal acceleration a = v²/r must be directed inward continuously. Remove the inward force and objects fly off tangentially — not radially outward."
tags: [physics, circular-motion, centripetal, centrifugal, spinning, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why Things Fly Off a Spinning Wheel (Circular Motion)

**Alt title:** "Centrifugal Force Is Fake. Here's What's Actually Happening."
**Difficulty:** 1.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Start with a slow-motion video of a spinning vinyl record with a drop of water on its surface. As the turntable spins up, the droplet holds — then suddenly releases. Frame-by-frame, show the exact moment of departure. Freeze on the frame just before the drop releases: draw the velocity vector arrow — it points tangentially to the circle, not straight outward. Then show the frame after: the droplet travels in that exact tangential direction, not straight out like a stone from a catapult.

Now cut to a street interview style: "Which direction does a ball fly off a spinning wheel?" Show five different people pointing straight outward — the classic misconception. "Centrifugal force throws it out, right?" Then reveal the slow-motion footage. The ball goes tangentially. It does not shoot straight out.

This is the central tension of the episode: "centrifugal force" is the most commonly misunderstood concept in introductory physics, and it lives in every game engine, every animation, every simulation that tries to fake circular motion. The bug it causes in code is subtle but unmistakable — and the visual artifact of a wrong simulation makes it obvious the moment you compare trajectories.

Then the teaser: "The centrifugal force is real — but only in the rotating frame. From the outside, looking in, it doesn't exist at all. And coding it wrong makes your simulation fail in a very specific, very visible way." Hook the viewer with the promise of understanding something most physics courses confuse.

---

## The Naive Attempt

Open the code editor and simulate a "ball on a string" by applying an outward force each frame — this is the intuitive but wrong "centrifugal force" implementation:

```javascript
// B003 — Naive attempt: apply centrifugal force outward
const omega = 2.0;    // rad/s — angular velocity
let angle = 0;
let r = 150;          // current radius in pixels
const mass = 1.0;     // kg

let ballX = centerX + r * Math.cos(angle);
let ballY = centerY + r * Math.sin(angle);

function update(dt) {
  angle += omega * dt;  // rotate the angular position

  // WRONG: Apply outward centrifugal force
  const centrifugalForce = mass * omega * omega * r;  // magnitude: mω²r
  const dirX = Math.cos(angle);   // outward direction
  const dirY = Math.sin(angle);

  // Apply outward acceleration
  const ax = centrifugalForce / mass * dirX;
  const ay = centrifugalForce / mass * dirY;

  // Update velocity with outward acceleration
  vx += ax * dt;
  vy += ay * dt;

  ballX += vx * dt;
  ballY += vy * dt;
}
```

Walk through this carefully: the intent is clear — "centrifugal force pushes outward, so apply a force in the radial direction outward." The angular position updates correctly. But the velocity integration is accumulating an outward force that is NOT balanced by any inward force. The ball will spiral outward, tracing a logarithmic spiral as it drifts away from the center.

Run it. The ball starts tracing a circular path — looks reasonable for the first second. Then it starts drifting outward, slowly at first, then accelerating. Within 5 seconds, the ball has spiraled all the way to the edge of the canvas and beyond. The spiral shape is actually kind of beautiful, but it's completely wrong for a ball on a string.

---

## The Moment of Failure

The naive simulation is running. The ball orbits in an outward spiral — galaxy-arm shaped. Now overlay the trajectory of what should happen: a perfect circle of fixed radius. The circle is drawn as a faint white ring. The simulated ball is outside that ring within 3 seconds and off the canvas within 8.

Add a "release at this moment" button. Click it at any point in the orbit. In the naive simulation, the ball flies off roughly radially outward — because the velocity it's accumulated is a mix of tangential motion and the outward drift. The trajectory looks like a smeared tangent — off by 20–45 degrees from what it should be.

Now run the correct simulation alongside it (preview — code comes later) and click release at the same angular position. The correct ball flies off perfectly tangentially — in a ruler-straight line that follows the direction of the velocity vector at the moment of release. The angle difference between the two release trajectories is stark and visually obvious.

Text overlay: "The wrong model makes balls spiral out before release and shoot off in the wrong direction after. Both failures come from the same misunderstanding: there is no outward force in the inertial frame." The failure is not subtle — it's a completely wrong trajectory shape.

---

## Why It Broke — The Physics

The confusion between centripetal and centrifugal force is one of the most persistent mistakes in physics. Here is the precise distinction:

**In the inertial (non-rotating) frame:**
There is no centrifugal force. An object moving in a circle is being continuously deflected inward by a real force — the string tension, gravity, friction, or whatever provides it. Without this inward force, the object would travel in a straight line (Newton's First Law). The inward acceleration required to maintain circular motion is:

$$a_{centripetal} = \frac{v^2}{r} = \omega^2 r$$

directed toward the center. The force providing this is:

$$F_{centripetal} = m \cdot \frac{v^2}{r} = m \omega^2 r$$

This force is always perpendicular to the velocity. It changes the direction of motion without changing the speed. It does zero work.

**In the rotating frame:**
If you are sitting on the spinning wheel, you feel pushed outward. From your perspective, there IS an outward force — but this is a fictional (pseudo) force that exists only because your reference frame is accelerating. It is completely valid to use it for calculations in the rotating frame, but it has no physical source — no object is exerting it.

When the string breaks: at the instant of release, the centripetal force disappears. The object has velocity tangential to the circle at that moment. Newton's First Law: it continues in a straight line in that tangential direction. It does not shoot outward. The outward drift you observe when watching from the center is because you are in the rotating frame — and the object is going straight while you're spinning.

**Key equation:**

$$\boxed{F_{centripetal} = \frac{mv^2}{r}}$$  pointing inward

The correct simulation applies this inward force each frame, or better, constrains the object to circular motion via the constraint directly.

---

## The One Concept

**Centripetal Acceleration** is the inward-directed acceleration required to keep an object moving in a circle. Without it, the object moves in a straight line.

**Formal definition:** For an object moving with speed v in a circle of radius r:
$$a_c = \frac{v^2}{r} = \omega^2 r$$

directed toward the center at all times.

**The vector nature is critical:** The acceleration vector rotates continuously as the object goes around the circle. At every point, it points from the object toward the center. This is why you need to recompute it every simulation frame — the direction changes even if the magnitude is constant.

**Physical intuition:** Think about why a car going around a corner needs the road's sideways friction. The friction force is what pushes the car inward — toward the center of the turn. Without it (ice on the road), the car goes straight: tangentially off the curve. The needed force grows as v² — double your speed around the corner, you need 4× the friction. This is why high-speed cornering is so demanding.

**Real-world examples:**
1. **Moon orbiting Earth:** Gravity provides the centripetal force — it pulls the Moon inward constantly, curving its trajectory from what would be a straight line into an orbit.
2. **Washing machine spin cycle:** Water is flung to the outer drum not because centrifugal force pushes it — the drum has holes, so there's nothing to push it in. Water simply goes straight (tangentially) through the holes while clothes are forced inward by the drum walls.
3. **Velodrome banking:** Bike tracks are steeply banked so that the normal force from the track has an inward horizontal component — this provides centripetal force at high speeds without relying solely on friction.
4. **Centrifuge in biology:** Blood is separated into components by spinning — the heavier red blood cells need more centripetal force to maintain circular motion than they can get from the fluid pressure, so they drift outward. This is still not "centrifugal force" — it's differential centripetal requirements.

---

## The Fix

```javascript
// B003 — Correct circular motion: centripetal force inward
const omega = 2.0;  // rad/s
let angle = 0;
const radius = 150; // fixed radius for constrained circular motion

let vx = 0;
let vy = 0;
let ballX, ballY;

// Initialize at top of circle
ballX = centerX;
ballY = centerY - radius;
vx = omega * radius;  // initial tangential velocity (rightward at top)
vy = 0;

let stringBroken = false;

function update(dt) {
  if (stringBroken) {
    // String is broken: no force — straight-line motion (Newton 1)
    ballX += vx * dt;
    ballY += vy * dt;
    return;
  }

  // Method: constrain to circle via centripetal acceleration
  // Direction from ball to center:
  const dx = centerX - ballX;
  const dy = centerY - ballY;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const ux = dx / dist;  // unit vector toward center
  const uy = dy / dist;

  // Centripetal acceleration magnitude: a = v²/r = ω²r
  const speed = Math.sqrt(vx*vx + vy*vy);
  const aCentripetal = speed * speed / radius;  // or omega*omega*radius

  // Apply centripetal acceleration (inward)
  vx += ux * aCentripetal * dt;
  vy += uy * aCentripetal * dt;

  // Renormalize radius (numerical drift correction)
  ballX = centerX + (ballX - centerX) / dist * radius;
  ballY = centerY + (ballY - centerY) / dist * radius;

  ballX += vx * dt;
  ballY += vy * dt;
}

function breakString() {
  stringBroken = true;
  // No force applied → ball continues with current velocity tangentially
}
```

Crucially, when `breakString()` is called, the velocity at that instant is tangential to the circle. No correction needed — just stop applying the centripetal force. The ball continues in a perfectly straight line in exactly the direction it was moving. This is Newton's First Law in its purest form.

Show this visually: draw the velocity arrow at the moment of release, then let the ball fly. The velocity arrow and the flight path are perfectly aligned.

---

## The Wow Moment — Push It

Spin up a carousel with 20 objects placed at different radii (5 objects per ring, 4 rings at r = 50, 100, 150, 200 pixels). All objects start with the same angular velocity ω. The canvas is beautiful — a spinning wheel with glowing particles.

Now assign each "string" a breaking tension threshold. Objects at larger radii need more centripetal force (F = mω²r grows with r), so at the same ω they are under more string tension. Define a breaking tension of, say, 100 N. As ω ramps up from 0, the outermost ring reaches the breaking tension first — those 5 objects snap off and fly away tangentially in 5 different directions, exactly tangent to their circle. 

Then the next ring, as ω continues to rise. Then the next. Then the last. Each ring's release creates a beautiful starburst of tangent lines radiating outward. And the directions are unmistakably tangential — none of them go radially outward.

Finally, overlay the original circle positions faintly in grey, and draw the tangent lines from each release point. The pattern is exact: every single trajectory is perpendicular to the radius at the point of release. The geometry is perfect. The title of this visual moment: "This is why particles in a centrifuge don't just shoot straight out — they take paths that depend on exactly when and where they are released."

Run the same demo but switch to the centrifugal (wrong) model — the particles shoot roughly outward, not tangentially, creating a very different, clearly wrong pattern. The visual contrast is immediate.

---

## The Interactive Demo

**Canvas layout:** A circle in the center (the wheel/orbit). Objects placed around the perimeter or at multiple radii. Controls below.

**Controls:**
- `Angular Velocity (ω)` — slider from 0 to 10 rad/s. Objects at each radius show their required centripetal force in a tooltip.
- `Radius` — slider for placing a new object at a specific orbital radius (50–400 px)
- `String Breaking Tension` — slider (10 N to 1000 N). The string turns red as you approach its limit.
- `[Add Object]` — click on canvas to place a new object on the nearest ring
- `[Release All]` — instantly breaks all strings; watch all objects fly tangentially
- `[Slow Motion]` — 0.1× speed — see each release trajectory clearly
- `Mode toggle: [Inertial Frame] / [Rotating Frame]` — in rotating frame, velocity vectors appear to rotate. In rotating frame, an apparent outward "centrifugal" force is shown as a dashed red arrow. Toggle makes the frame-dependence of centrifugal force viscerally clear.
- `[Centrifugal (wrong)] / [Centripetal (correct)]` toggle — compare trajectory shapes

**Visual elements on canvas:**
- Velocity arrow drawn on each object (tangential direction, magnitude = v)
- String drawn from object to center (color shifts red as tension approaches limit)
- After release, straight-line trajectory traced in the object's color
- Angle and speed readout near each object

**Click interaction:** Click any object to "pluck" its string manually and watch the independent release trajectory.

---

## Production Notes

**Runtime target:** 13–16 minutes

**Segment breakdown:**
- 0:00–1:00 — Hook: slow-motion water drop, tangential departure reveal — 1 min
- 1:00–3:30 — Naive attempt: outward force code, spiral trajectory shown — 2.5 min
- 3:30–5:30 — Failure: compare spiral vs circular, wrong vs right release direction — 2 min
- 5:30–8:00 — Physics: inertial vs rotating frame, centripetal formula, Newton 1 — 2.5 min
- 8:00–10:00 — The concept: Cd explanation, car cornering, Moon orbit — 2 min
- 10:00–12:00 — The fix: correct code, velocity vector at release, straight-line proof — 2 min
- 12:00–14:00 — Wow: carousel multi-ring snap, tangent starburst pattern — 2 min
- 14:00–15:30 — Interactive demo walkthrough — 1.5 min

**Screen layout:** Full canvas for the spinning demos. Code editor on right for code sections. Always show the velocity arrow on the ball during coding demonstrations.

**Zoom moments:**
- ZOOM on the water drop frame where the tangential velocity vector is drawn (0:45)
- ZOOM on the naive spiral trajectory vs circular expected — the deviation after 3 seconds
- ZOOM on the carousel release: slow motion, show each tangent line form

**Pre-render animations:**
- Slow-motion water drop on record with velocity vector overlay (composite in After Effects or DaVinci Resolve)
- Clean diagram: rotating frame vs inertial frame showing the same object, different force arrows
- Tangent geometry illustration: circle + radius + perpendicular tangent labeled

**Key diagrams to show on screen:**
- At 5:30: Full free-body diagram — object moving in circle, centripetal arrow inward, no outward arrow (in inertial frame)
- At 7:00: Rotating frame diagram — centripetal inward + centrifugal outward, net zero (object stationary in rotating frame)
- Text: "CENTRIFUGAL FORCE: REAL IN THE ROTATING FRAME, FICTIONAL IN THE INERTIAL FRAME"

---

## Tags

`physics` `circular-motion` `centripetal` `centrifugal` `spinning` `javascript` `canvas` `beginner`

---

## Thumbnail

A vinyl record viewed from above, clearly spinning. A water droplet has just been released — it's shown mid-flight, and a bright yellow arrow labeled "TANGENTIAL (not radial!)" traces its path. Behind it, a red arrow labeled "CENTRIFUGAL (WRONG)" points straight outward from the center. The yellow arrow is clearly winning — it's pointing in the actual direction of the droplet's motion. Large white text at the bottom: "IT DOESN'T FLY STRAIGHT OUT." The record has visible grooves and the classic label in the center. Emotion: the satisfying exposure of a widely believed myth. The arrow directions create visual tension — the red arrow is wrong, the yellow arrow is right, and the droplet proves which is which. This thumbnail will stop anyone who has ever heard "centrifugal force" and believed it.
