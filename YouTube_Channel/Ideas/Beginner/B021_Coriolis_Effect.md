---
title: "Why Storms Spiral Differently in Each Hemisphere (Coriolis Effect)"
id: B021
difficulty: 2.5/10
prereq: "None"
concept: "Coriolis acceleration a_c = -2Ω×v in a rotating reference frame"
tags: [physics, coriolis, rotating-frame, meteorology, cyclones, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why Storms Spiral Differently in Each Hemisphere (Coriolis Effect)

**Alt title:** The Invisible Force That Spins Every Hurricane on Earth
**Difficulty:** 2.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Open on a split-screen: a satellite loop of Hurricane Isabel in the North Atlantic, spiraling counterclockwise with its iconic tight eye and sweeping bands. On the right, Tropical Cyclone Yasi off the coast of Queensland, Australia — identical intensity, identical structure, but spiraling clockwise. Same ocean, same atmosphere, same thermodynamics — mirrored rotation. Let the images run silently for a beat while the contrast lands. Then cut to a Foucault pendulum in the Panthéon in Paris: a heavy iron sphere on a 67-meter wire, swinging back and forth while a ring of sand pegs slowly falls one by one over the course of hours. The pendulum isn't changing direction — the Earth is rotating beneath it. At the North Pole, the Earth would complete a full rotation under it in exactly 24 hours, and the pendulum's swing plane would appear to rotate 360°. At the equator, zero rotation — the pendulum swings in a fixed plane forever. At 48° N (Paris), it rotates at sin(48°) ≈ 0.74 of a full circle per day — about 11 hours for a 360° apparent rotation. Then deliver the line: "All of this — hurricanes, pendulums, the jet stream, artillery shells curving on a battlefield — comes from a single equation that adds one term to Newton's second law."

## The Naive Attempt

Start with a 2D canvas simulation of air parcels flowing from a high-pressure region toward a low-pressure center — the naive picture most people have of a storm. Code it step by step on screen. First, define a pressure field: `P(x, y) = P_low + k * ((x - cx)^2 + (y - cy)^2)` with a low-pressure center at `(cx, cy)`. This gives a radially symmetric bowl. Next, compute the pressure gradient force on each air parcel: `F_x = -dP/dx = -2k*(x - cx)` and `F_y = -dP/dy = -2k*(y - cy)`. Every parcel feels a force pointing straight toward the center of low pressure, exactly like gravity pointing toward the center of a gravitational well. Initialize 200 air parcels distributed uniformly around the low-pressure center at various distances and random starting velocities. Apply Euler integration: `vx += F_x * dt; vy += F_y * dt; x += vx * dt; y += vy * dt`. Run the simulation and let it play at full speed. This is the direct, intuitive model — no rotation, no Coriolis, no friction. The code is clean, sensible, and completely wrong.

## The Moment of Failure

The simulation runs. Every single air parcel accelerates directly toward the low-pressure center in a straight radial line. The 200 parcels converge symmetrically from all directions, producing a perfect "bullseye" pattern — a radial starburst of inflow with no rotation whatsoever. The pressure center shows a symmetric ring of converging arrows, tightening as the parcels approach. There is no spiral, no eye, no rotating bands — just straight lines converging to a point like water draining in a perfectly cylindrical tank. Zoom in: the center region fills with parcels all moving inward simultaneously, piling up symmetrically. Then show a real radar image of a hurricane side by side: the reality is dominated by rotation. The inflow is almost tangential, not radial. The eye wall rotates at 120 mph before any inward motion is visible. The model isn't even approximately right — it captures the wrong physics entirely. The pressure gradient alone cannot explain the structure of any rotating storm on Earth.

## Why It Broke — The Physics

Earth rotates. This seems obvious, but its consequences are non-trivial. When we write Newton's second law in an inertial (non-rotating) frame, `F = ma` is exact. But the surface of the Earth is not an inertial frame — it rotates once every 24 hours (angular velocity Ω = 7.27 × 10⁻⁵ rad/s). In a rotating frame, two fictitious forces appear when you transform Newton's laws: the centrifugal force (already absorbed into our definition of "gravity") and the Coriolis force.

The Coriolis acceleration is:

**a_c = −2Ω × v**

where Ω is Earth's rotation vector (pointing toward geographic North Pole) and v is the velocity of the air parcel in the rotating frame. The key insight: the Coriolis force acts perpendicular to the velocity. It never does work (it changes direction, not speed), but it continuously deflects trajectories. In the Northern Hemisphere, Ω has a positive vertical component (sin(latitude)), so the cross product deflects motion to the right. In the Southern Hemisphere, the vertical component is negative, and motion is deflected to the left.

For a 2D horizontal simulation at latitude φ, the Coriolis acceleration becomes:

**a_cx = f · vy** and **a_cy = −f · vx**

where f = 2Ω·sin(φ) is the Coriolis parameter (the "Coriolis frequency"). At 45° N, f ≈ 1.03 × 10⁻⁴ s⁻¹. This small number is why we don't feel Coriolis in daily life — it only matters at large scales (hundreds of kilometers) where trajectories are long enough for the deflection to accumulate. For a storm system spanning 500 km with wind speeds of 30 m/s, the Coriolis acceleration is about 3 × 10⁻³ m/s² — the same order as the pressure gradient force. They balance in geostrophic flow.

## The One Concept

The Coriolis effect is a fictitious (or pseudo) force that arises in any rotating reference frame. It was first rigorously analyzed by Gaspard-Gustave de Coriolis in 1835, who was studying the efficiency of water wheels — a mechanical engineering problem far removed from meteorology.

**Formal definition:** In a frame rotating with angular velocity Ω, any object moving with velocity v experiences an acceleration a_c = −2Ω × v. This is a kinematic consequence of the frame transformation — it is not caused by any physical interaction between objects, but it is real and measurable within the rotating frame.

**Physical intuition:** Imagine standing at the North Pole and throwing a ball toward your friend at the equator. The ball travels in a straight line in space (inertial frame). But while it is in flight, the Earth rotates eastward beneath it. By the time the ball reaches the equator, your friend has moved east — but the ball has not. From your rotating-Earth perspective, the ball appears to curve westward. The "force" doing the curving is Coriolis.

**Key equation:** a_c = −2Ω × v. In component form at latitude φ, for horizontal motion: a_cx = 2Ω·sin(φ)·vy, a_cy = −2Ω·sin(φ)·vx. The factor sin(φ) explains why the effect is zero at the equator (φ = 0) and maximum at the poles (φ = ±90°).

**Real-world examples:**
1. **Cyclones:** Air flowing toward a low-pressure center is deflected rightward in the NH, forcing counterclockwise circulation (cyclonic flow). In the SH, the deflection is leftward, forcing clockwise rotation.
2. **Foucault pendulum:** The pendulum's swing plane rotates at a rate of Ω·sin(φ) — one full rotation in 24/sin(φ) hours. This is the most direct classroom demonstration of Earth's rotation.
3. **Artillery and long-range ballistics:** A shell fired northward from the equator drifts eastward because Earth rotates under its trajectory. In World War I, German long-range artillery shelling Paris had to include Coriolis corrections of tens of meters.
4. **Ocean gyres:** The major ocean circulation gyres (Gulf Stream, Kuroshio) are driven by trade winds, but their circular structure and direction are maintained by Coriolis deflection over basin-scale distances.

## The Fix

Add the Coriolis term to the force calculation for each air parcel. First, choose a latitude (default 45° N). Compute the Coriolis parameter: `const f = 2 * 7.27e-5 * Math.sin(lat * Math.PI / 180)`. In the update loop, after computing the pressure gradient force, add:

```javascript
// Coriolis acceleration (2D horizontal, Northern Hemisphere)
const a_cx = f * parcel.vy;
const a_cy = -f * parcel.vx;

// Total acceleration = pressure gradient + Coriolis + friction
parcel.vx += (F_pressure_x + a_cx - friction * parcel.vx) * dt;
parcel.vy += (F_pressure_y + a_cy - friction * parcel.vy) * dt;
```

The friction term (proportional to -v) prevents parcels from spiraling infinitely inward — it models atmospheric boundary layer drag. Without it, parcels orbit indefinitely. With friction at the right balance, they spiral gradually inward along a logarithmic spiral — exactly the shape of real hurricane bands. Run the simulation: the 200 parcels no longer rush radially inward. Instead, they curve rightward, orbit the low-pressure center, and slowly spiral inward. The result looks like a hurricane. At Southern Hemisphere latitude (-45°), the sign of f flips, and the spiral reverses to clockwise — matching the Yasi satellite image from the opening hook.

## The Wow Moment — Push It

Scale up to a full 2D atmospheric simulation with 500 labeled air parcels and a continuous temperature field. Establish a temperature gradient from equator (warm) to poles (cold). Let the differential heating drive pressure gradients. Activate Coriolis. Watch the jet stream emerge spontaneously — a fast-moving ribbon of air at mid-latitudes (around 45°) flowing west-to-east in the NH, formed by the balance between the poleward temperature gradient and Coriolis deflection. The jet stream is not a smooth tube; it meanders in the Rossby wave pattern with 3–5 large undulations around the globe.

Then inject a localized low-pressure perturbation in the North Atlantic. Over the next simulated hours, watch a cyclone spin up: first scattered inflow, then a rotating circulation, then a tight vortex with spiral bands. At the moment when the eye is clearly visible, toggle Coriolis off. The hurricane collapses instantly — the rotating structure dissolves into radial inflow within seconds, imploding into the center. Toggle Coriolis back on: the rotation reconstitutes, spiral bands reform, the eye re-establishes. This toggle is the single most viscerally powerful demonstration of the effect. Run it twice, slowly. Let it breathe.

Final flourish: show a Southern Hemisphere low forming with identical parameters but opposite latitude sign — the mirror-image clockwise rotation. Split screen with the NH cyclone. Same physics, mirrored geometry.

## The Interactive Demo

Build a full browser-based simulation at a playable frame rate (targeting 60 fps with up to 1000 parcels using typed arrays for performance).

**Controls:**
- **Latitude slider** (−90° to +90°): Changes f = 2Ω·sin(φ) in real time. Crossing the equator flips the rotation direction of any existing cyclone. Watch it happen live.
- **Coriolis on/off toggle**: Instantly adds or removes the Coriolis term. The most dramatic control in the demo.
- **Earth rotation speed multiplier** (1× to 100,000×): Run Earth's rotation 10,000× faster to see Coriolis effects in seconds instead of days. Makes teaching much clearer.
- **Wind speed slider**: Scale all initial velocities up or down.
- **Pressure field**: Click anywhere to add a high- or low-pressure center. Multiple centers create complex interacting vortices.
- **Display modes**: (a) particle trajectories, (b) pressure contour map with isobars, (c) velocity field arrows, (d) vorticity heatmap.
- **NH/SH comparison mode**: Split the canvas at the equator; same pressure perturbation placed symmetrically in each hemisphere. Real-time comparison of clockwise vs counterclockwise rotation.
- **Foucault pendulum mode**: Switch to a single-pendulum simulation. Latitude slider controls the precession rate. Shows the pendulum trace over 24 simulated hours.
- **Reset button**: Restores initial conditions.
- **Info overlay**: Displays current f value, parcel count, and the Coriolis equation.

## Production Notes

**Runtime target:** ~14 minutes total. Hook: 1 min. Naive code walkthrough: 2.5 min. Failure moment: 1 min. Physics explanation: 3.5 min. Fix + live coding: 2.5 min. Wow moment: 2 min. Demo tour: 1.5 min.

**Screen layout:** 60% canvas on right, 40% code editor (VS Code, dark theme, font size 20+) on left. When explaining physics equations, switch to a full-width slide with clean typeset math (use MathJax or pre-rendered PNGs).

**Animations to pre-render:** (1) Satellite loop of real NH hurricane, (2) SH cyclone loop, (3) Foucault pendulum in Panthéon with pendulum plane rotation marked, (4) 3D Earth globe with Ω vector arrow pointing to North Pole, (5) air parcel trajectory in inertial frame vs. rotating frame side-by-side animation.

**Key moments to zoom/highlight:** The instant the rotating simulation produces its first visible spiral (add a "spiral detected!" indicator), the toggle moment when Coriolis is switched off and the hurricane collapses, and the equator-crossing moment when rotation direction flips.

**B-roll suggestions:** Real hurricane satellite imagery (NOAA public domain), Foucault pendulum footage, global wind visualization (earth.nullschool.net).

**Gotcha to address:** Explicitly debunk the toilet/sink drain myth — Coriolis is 10 million times too weak to determine drain rotation in a sink. The myth is popular and needs direct, respectful debunking with numbers.

## Tags

`physics` `coriolis` `rotating-frame` `meteorology` `cyclones` `javascript` `canvas` `beginner`

## Thumbnail

Wide-angle satellite view of a perfect hurricane spiral fills the left half of the frame, counterclockwise rotation made obvious by the curved bands. On the right, an identical cyclone spirals clockwise. A thick white dividing line between them labeled "EQUATOR" in bold sans-serif. Centered at the top: "SAME PHYSICS" in large yellow text. Bottom center: "OPPOSITE ROTATION" in slightly smaller white text with a red underline. The two storms are color-graded slightly differently — the NH storm cooler blue-white, the SH storm warmer orange-tinged — making the visual immediately interesting even at thumbnail size. The emotion triggered is "wait, what?" — the viewer knows hurricanes spiral but has probably never thought about why the two hemispheres differ. The split-screen symmetry makes it look like something fundamental is being revealed, not just shown.
