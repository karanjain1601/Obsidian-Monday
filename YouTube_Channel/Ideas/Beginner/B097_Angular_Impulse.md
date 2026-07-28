---
title: "Putting Spin on a Ball: Angular Impulse"
id: B097
difficulty: 2.5/10
prereq: "B004, B007"
concept: "Angular impulse ∫τ dt = ΔL; friction during contact creates torque about the ball's center; contact duration and friction coefficient set the spin imparted"
tags: [mechanics, angular-impulse, torque, spin, friction, angular-momentum, canvas, beginner]
category: beginner
type: video-idea
---

# Putting Spin on a Ball: Angular Impulse

**Alt title:** "Why a Tennis Ball With Topspin Dips — The Physics of Ball Spin"
**Difficulty:** 2.5/10 | **Prereq:** B004, B007

---

## Opening Hook (0:00–1:00)

Two tennis balls launch from the same position at the same speed and angle. On the left, a ball with no spin: it arcs in a gentle parabola and bounces straight. On the right, a ball with heavy topspin: it dips sharply mid-flight and kicks forward off the bounce with extra aggression, landing shorter but accelerating away from the opponent. In slow motion (achieved with a lower frame time-step), the host zooms in on the moment of contact between racket and ball — just 4 milliseconds of contact. During that tiny window, a friction force acts tangentially along the ball's surface, creating a torque about the ball's center. That torque, integrated over 4 milliseconds, equals a change in angular momentum. "This is angular impulse," the host says. "The same concept that explains why a billiard ball responds to 'english,' why a cricket bowler's seam position matters, why a curveball curves, and why a golf ball's dimples matter. And you can simulate all of it in under 50 lines of JavaScript."

## The Naive Attempt

The viewer creates a canvas with a ball represented as a circle that moves with 2D velocity components (vx, vy). Step one: apply gravity as vy += g * dt each frame. Step two: simulate the racket contact as an instantaneous velocity change — kick vx and vy by a calculated delta. Step three: let the ball fly through the air as a projectile. Step four: when the ball hits the ground, reflect vy to simulate a bounce. The ball follows a perfect parabola. It bounces and continues. The host says: "Now I want to add spin. I'll add an omega variable — angular velocity — and just initialize it to some value when the ball launches." The host sets `omega = 50 rad/s` (topspin). The ball flies and bounces the same as before. Absolutely nothing changes. The host stares at the screen: "The ball is spinning, but nothing is different. Why?"

## The Moment of Failure

The ball with `omega = 50 rad/s` follows an identical trajectory to the ball with `omega = 0`. The bounce is identical. The flight path is identical. The host checks the code: omega is stored and drawn (a rotating radius line on the ball does spin visually), but it never feeds into any force calculation. "We gave it a spin variable and never used it," the host says. "But even if we did, where does spin affect the motion? During flight? During bounce? Both?" The core confusion is that the viewer does not yet know that spin affects flight through the Magnus effect (a separate video) and affects the bounce through friction during ground contact. Without modeling the friction during contact — the angular impulse — the spin is stored but inert. The simulation is kinematically incomplete: it tracks rotation but not its physical consequences.

## Why It Broke — The Physics

During the contact between a spinning ball and a surface, the ball's contact point has a velocity relative to the surface given by:

**v_contact = v_cm − ω × r**

(where r is the contact-point vector from center to surface). If this relative velocity is nonzero, kinetic friction acts at the contact point opposing the slipping: **f = μₖ · N**. This friction force does two things simultaneously: it changes the linear velocity of the center of mass (linear impulse: Δv = f · Δt / m), and it creates a torque about the center of mass that changes the angular velocity (angular impulse):

**ΔL = τ · Δt = (r × f) · Δt = I · Δω**

For a solid sphere, I = 2mr²/5. Thus **Δω = (r · f · Δt) / I = (5 · f · Δt) / (2mr)**. The ball rolls without slipping when v_contact = 0, at which point friction vanishes. The critical insight is that angular impulse always acts to bring the spin into equilibrium with the translational velocity — a fast-spinning topspin ball will kick off the surface faster than a backspin ball, which will slow down or even reverse direction on bounce.

## The One Concept

Angular impulse is the rotational analogue of linear impulse. Just as a force applied for a duration changes linear momentum (J = FΔt = Δp), a torque applied for a duration changes angular momentum:

**∫τ dt = ΔL = I · Δω**

The torque here comes from friction at the contact point. The magnitude is τ = r × f = r · μₖ · N (for the slip phase), and the direction is such as to spin the ball toward rolling-without-slipping equilibrium. The duration Δt of the contact determines how much angular impulse is delivered. For a tennis ball on a hard court, Δt ≈ 4 ms; on clay, Δt ≈ 8 ms — clay's longer contact time allows more spin to be transferred and also gives more friction time to decelerate the ball, which is why clay courts favor heavy-spinning baseliners. The concept explains: why a cue ball with "draw" (backspin) stops or reverses after striking the object ball (the contact transfers forward angular impulse, canceling and reversing the backspin before the ball reaches the object ball); why a bowling ball with sidespin "hooks" toward the pocket (the oil-free portion of the lane delivers angular impulse that tilts the ball's angular momentum vector, inducing a precession toward the head pin); and why a baseball pitcher's fingertip pressure during release creates the spin that deflects the pitch over 60 feet.

## The Fix

Add a friction-based angular impulse calculation triggered each time the ball contacts the ground.

```javascript
function applyBounce(ball) {
  const mu_k = 0.5;     // kinetic friction coefficient
  const e = 0.8;        // coefficient of restitution
  const r = ball.radius;
  const I = 0.4 * ball.mass * r * r; // solid sphere: 2/5 mr²

  // Normal impulse (restitution)
  const N_impulse = -(1 + e) * ball.vy * ball.mass;
  ball.vy = -e * ball.vy;

  // Contact velocity at surface: positive = surface slipping forward
  const v_contact = ball.vx - ball.omega * r;

  // Friction impulse (limited by slip → rolling transition)
  const J_friction_max = mu_k * Math.abs(N_impulse);
  const J_friction_needed = (2 / 7) * ball.mass * v_contact; // roll condition
  const J_friction = Math.sign(v_contact) *
                     Math.min(Math.abs(J_friction_needed), J_friction_max);

  ball.vx   -= J_friction / ball.mass;
  ball.omega += J_friction * r / I;
}
```

Now a topspin ball kicks forward off the bounce; a backspin ball slows dramatically or reverses. The difference is visually dramatic and immediately intuitive.

## The Wow Moment — Push It

The host sets up a billiards table simulation with three balls. The cue ball is given "english" (sidespin) by clicking and dragging across its surface before the shot. The cue ball strikes the first ball, transferring linear momentum but retaining its angular momentum — after the collision it curves sideways due to the sidespin gradually transferring to forward spin through floor friction, demonstrating exactly the "running english" shot used by snooker and pool players. The host then simulates a cricket seam bowler: a ball launched at batting-crease distance with backspin oriented at an angle, showing the differential Magnus-plus-angular-impulse interaction on bounce that creates a "cutter" delivery.

## The Interactive Demo

- **Spin slider** (−500 to +500 rad/s): sets initial angular velocity; negative is backspin, positive is topspin; see bounce behavior change immediately
- **Friction coefficient slider** (0.1 to 0.9): changes how rapidly angular impulse is transferred during contact
- **Restitution coefficient slider** (0.4 to 1.0): controls energy loss in the normal direction at bounce
- **Launch angle slider** (5° to 70°): changes the incident angle at bounce, showing how the ratio of normal to friction impulse changes with angle
- **Contact time display**: shows the effective contact duration Δt and the total angular impulse delivered, updated each bounce

## Production Notes

Draw the ball with a visible high-contrast stripe so the rotation is immediately visible to the viewer. On each bounce, briefly flash the friction force arrow at the contact point — a short horizontal red arrow that either points forward (topspin → friction kicks ball forward) or backward (backspin → friction slows ball). Display ω in rad/s numerically near the ball throughout flight. Use slow-motion mode (dt × 0.1) during the contact phase so the viewer can see the spin-to-translation coupling happen over several frames. Show the angular impulse equation rendered on screen during the bounce.

## Tags

`mechanics` `angular-impulse` `torque` `spin` `friction` `angular-momentum` `canvas` `beginner`

## Thumbnail

Two identical tennis balls side-by-side launching from a racket. The left one (no spin) arcs in a gentle flat parabola shown as a dotted line. The right one (topspin) dips dramatically below the left, shown as a curved dotted line dipping well below. At the bounce point, a bright orange arrow shows the "kick" of the topspin bounce. Text overlay: "WHY TOPSPIN DIPS AND BACKSPIN FLOATS." The physics is made visually obvious at a glance.
