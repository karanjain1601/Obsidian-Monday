---
title: "The Train, the Ball, and the Observer: Relative Motion"
id: B077
difficulty: 2/10
prereq: "None"
concept: "Galilean relativity: velocity adds vectorially for observers in relative motion; v_ball_to_ground = v_ball_to_train + v_train_to_ground; all inertial frames are equivalent for mechanics"
tags: [mechanics, relative-motion, galilean-relativity, reference-frames, velocity-addition, inertial-frames, canvas, beginner]
category: beginner
type: video-idea
---

# The Train, the Ball, and the Observer: Relative Motion

**Alt title:** "Why a Thrown Ball Looks Different to the Thrower and the Bystander"
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The video opens on a view from inside a moving train. A person sitting in the train tosses a ball straight up and catches it — to them, the ball goes straight up and comes straight down, a perfectly vertical path. Cut to an external camera tracking the same ball from the platform as the train passes. From the outside, the ball traces a perfect parabola — moving forward with the train while also rising and falling under gravity. Same ball, same throw, two completely different trajectories. The host speaks: "Who is right? Both of them. And this is the principle that Galileo understood 400 years before Einstein — all inertial reference frames are equally valid for describing mechanics. The ball's path is not absolute; it is always relative to the observer." Then a second scenario: a pilot drops a bomb from a moving aircraft. From the cockpit, it falls straight down. From the ground, it traces a long forward-curving parabola before hitting far ahead of the release point. "This is why WWII bombers had to account for their own speed when computing the release point. The physics of relativity, no Einstein required."

## The Naive Attempt

The viewer sets up a canvas with a ball being thrown vertically from a moving cart. The first version simulates both the cart and the ball in the ground frame, but draws everything relative to the cart (as if the camera was fixed to the cart):

```javascript
const cart = { x: 0, vx: 10 }; // cart moves at 10 m/s
const ball = { x: 0, y: 0, vx: 0, vy: 15 }; // thrown upward only

function update() {
  cart.x += cart.vx * dt;
  ball.x += ball.vx * dt; // ball has no horizontal velocity in cart frame
  ball.y += ball.vy * dt;
  ball.vy -= g * dt;

  // Draw ball relative to cart
  const ball_draw_x = ball.x - cart.x;
  drawBall(ball_draw_x, ball.y);
}
```

From the cart frame, the ball rises and falls vertically — a straight line. The viewer runs this and it looks correct from the cart's perspective. But when the host switches the drawing to the ground frame (remove the `- cart.x` offset), the ball still traces only a vertical line — because the ball was never given horizontal velocity equal to the cart's velocity.

## The Moment of Failure

The host asks: "What does an observer standing on the ground platform see?" He removes the relative-drawing offset and runs the simulation — the ball appears to rise and fall in place while the cart moves forward. From the ground, the ball goes straight up and down like a yo-yo even though the cart is moving. This is physically wrong: if the ball is thrown on the cart and the cart is moving forward at 10 m/s, the ball should also be moving forward at 10 m/s when released, because it was at rest relative to the cart before the throw and the cart is the launch platform. The visual glitch is immediate: the cart drives forward but the ball hovers in the same horizontal location, then rejoins the cart — impossible without a backward horizontal force on the ball, which doesn't exist. The ball and cart separate and never meet again.

## Why It Broke — The Physics

Galilean velocity addition: if an object moves with velocity **v_obj_in_A** relative to frame A, and frame A moves with velocity **v_A_in_ground** relative to the ground frame, then the object's velocity in the ground frame is:

**v_obj_in_ground = v_obj_in_A + v_A_in_ground**

This is a vector sum. In the train example: the ball's velocity relative to the train is (0, +15) m/s (purely vertical). The train's velocity relative to the ground is (+10, 0) m/s. Therefore, the ball's velocity relative to the ground is (+10, +15) m/s. In the ground frame, the ball has both horizontal and vertical components — and traces a parabola, not a vertical line. The ball automatically carries the train's horizontal velocity because it was at rest relative to the train immediately before the throw (they shared the same velocity). This is the principle of inertia: objects preserve their velocity unless a force acts on them. When the ball leaves the thrower's hand, no horizontal force acts, so it maintains its horizontal velocity of +10 m/s.

Galilean relativity — the statement that all inertial frames are physically equivalent for mechanics — means that the train passenger's physics experiments give the same results as the ground observer's physics experiments. Both apply the same Newton's laws; they just observe different numerical values of position and velocity. Neither frame is "more correct." The laws of mechanics are invariant under Galilean transformation.

## The One Concept

A **reference frame** is the coordinate system (and associated clock) of a particular observer. An **inertial reference frame** is one that is not accelerating — it moves at constant velocity. Galileo's principle states that all inertial frames are equivalent for mechanical experiments: no mechanical experiment performed inside a smoothly moving train can detect that the train is moving. This is why you can toss a ball on a plane at 900 km/h and have it behave exactly as if the plane were stationary.

**Galilean velocity addition** is the mathematical tool for converting velocities between frames: v_total = v₁ + v₂ (for collinear motion) or, vectorially, **v_total = v₁ + v₂**. This is valid for speeds far below the speed of light. At relativistic speeds, the Galilean formula breaks down and must be replaced by the Einstein velocity addition formula, but for everyday mechanics, Galilean addition is exact.

Practical real-world examples where relative motion matters enormously: aircraft navigation (airspeed vs. ground speed vs. wind speed; a pilot must add the wind velocity vector to the aircraft velocity to find true ground track), river crossing problems (a boat aimed perpendicular to a river current is swept downstream; to cross straight, the pilot must aim upstream by an angle), spacecraft rendezvous (approaching the International Space Station requires matching its orbital velocity almost exactly before docking — the astronauts are "stationary" relative to the ISS even though both are moving at 7,700 m/s relative to Earth), and the famous Michelson-Morley experiment, which measured whether Earth's motion through space produced a detectable velocity difference for light — and found it did not, leading directly to special relativity.

## The Fix

Add the frame velocity to the ball's initial velocity at launch:

```javascript
const cart = { x: 0, vx: 10 }; // m/s in ground frame
let ball = null;

function throwBall() {
  ball = {
    x: cart.x,      // ball starts at cart's position
    y: 0,
    vx: cart.vx,    // CRITICAL: ball inherits cart's horizontal velocity
    vy: 15           // vertical throw component in cart frame
  };
}

function update() {
  cart.x += cart.vx * dt;
  if (ball) {
    ball.vx += 0;    // no horizontal force in ground frame
    ball.vy -= g * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
  }
}
```

Now a ground-frame observer sees the ball trace a clean parabola. The cart-frame observer sees a vertical line (computed as `ball.x - cart.x`). Both are correct. Both are drawn on screen simultaneously in two side-by-side panels.

## The Wow Moment — Push It

The host builds a two-panel relative-motion explorer. The left panel shows the ground frame; the right shows the cart/train frame. The viewer can throw the ball from different cart speeds, at different angles, and watch how both observers perceive the trajectory. For v_cart = 0, both panels agree: the ball traces the same parabola. As cart speed increases, the ground observer's parabola widens while the cart observer's trajectory stays purely vertical. The host then introduces a cannon on the cart: the viewer sets both the cannon angle relative to the cart and the cart speed. The ground frame shows the projectile's actual trajectory including the cart's motion. A targeting mode lets the viewer click a target on the ground and the simulation computes: what angle must the cart-mounted cannon fire at (in the cart frame) to hit the ground-frame target? This makes the bomber problem concrete and interactive.

## The Interactive Demo

- **Cart speed slider** — 0 to 50 m/s (default 10 m/s); changes cart's ground-frame velocity
- **Throw angle slider** — 0° to 180° relative to cart frame (default 90° = straight up)
- **Throw speed slider** — 0 to 30 m/s in cart frame (default 15 m/s)
- **Show ground frame / cart frame toggle** — switches which panel is drawn; or side-by-side mode
- **Trace path checkbox** — leaves a dotted trail showing the full parabola for each frame
- **Add wind** — adds a constant horizontal wind in the ground frame; shows how it affects both frames differently
- **Bomber mode** — click a ground target; cannon fires from moving cart; compute required firing angle

## Production Notes

Open with the train footage (or animate it carefully). Use a split-screen layout from the very start — left labeled "GROUND FRAME" and right labeled "TRAIN FRAME." The key animation moment: the ball being thrown on the train while both frames update simultaneously. Both parabola/vertical traces draw in real time. Use distinct colors: blue for ground frame trajectory, red for train frame trajectory. When writing the Galilean addition equation on screen, show it as a vector diagram: two arrows (v_ball_in_train and v_train_in_ground) added tip-to-tail to give v_ball_in_ground. For the bomber demo, add a top-down view (birds-eye) for the navigation problem — rivers and aircraft make more visual sense from above.

## Tags
`mechanics` `relative-motion` `galilean-relativity` `reference-frames` `velocity-addition` `inertial-frames` `canvas` `beginner`

## Thumbnail

Split frame: LEFT — a ball inside a moving train rising and falling in a straight vertical line (label: "Train sees..."); RIGHT — same ball from the platform tracing a wide parabola (label: "Ground sees..."). Both panels simultaneously visible. Bold text: **"SAME BALL. DIFFERENT PATH."** Subtext: "Relative motion explained." The visual contrast of straight vs. curved is the instant stop-scroll hook.
