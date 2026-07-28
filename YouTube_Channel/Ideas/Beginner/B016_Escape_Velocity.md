---
title: "How Fast Do You Need to Go to Leave a Planet? (Escape Velocity)"
id: B016
difficulty: 2/10
prereq: "None"
concept: "Escape velocity v_esc = √(2GM/R) from energy conservation"
tags: [physics, gravity, escape-velocity, energy-conservation, orbital-mechanics, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# How Fast Do You Need to Go to Leave a Planet? (Escape Velocity)

**Alt title:** "Fire a Cannonball Fast Enough and It Never Comes Back"
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Open on Newton's famous thought experiment: a cannon atop an impossibly tall mountain, above the atmosphere. Fire it horizontally at 100 m/s — it curves down and lands a few kilometers away. At 1,000 m/s — lands further. At 7,910 m/s — the Earth's surface curves away at exactly the rate the cannonball falls: it orbits. At 11,200 m/s — the cannonball escapes. Never comes back. Show the four trajectories simultaneously on screen: parabola, longer parabola, circle, open curve. The transition from the closed circle to the open escape trajectory happens at a specific, calculable speed. Increase the speed one meter per second at a time near that transition — the orbit goes from a barely-closed ellipse to an open hyperbola in an instant. The threshold is escape velocity. Ask: why does increasing speed by 1 m/s (out of 11,200) suddenly change the qualitative outcome from "trapped forever" to "escapes forever"? It's not gradual — it's a sharp threshold. The answer is total mechanical energy. When KE + PE = 0, you've exactly escaped. This episode derives that number from energy conservation and codes it up.

## The Naive Attempt

Build the simplest gravity model: constant downward acceleration `g = 9.81 m/s²`, independent of altitude. Set up a 2D canvas. The planet is at the bottom. Fire a projectile at angle θ with initial speed v. Equations of motion: `x = v₀_x * t`, `y = v₀_y * t - 0.5 * g * t²`. This is perfect for a ballistic trajectory near Earth's surface — a football, an artillery shell. It produces beautiful parabolas. Now increase the initial speed: the projectile goes higher, comes down further away. Keep increasing — the projectile goes so high the simulation barely shows it. But it always comes back. Always. No matter what speed you give it in this model, the projectile returns. Because constant gravity never weakens — the force is always 9.81 m/s² downward. At 1,000,000 m/s the projectile goes incredibly far up before returning. The concept of "escape velocity" cannot exist in a constant-gravity model, because constant gravity always has enough time to bring the projectile back no matter how fast. The model is internally consistent — but it has the wrong physics for anything beyond a few kilometers altitude. Set up the demo to show the projectile fired at 11,200 m/s: it goes off-screen at the top, then comes back after a long pause. No escape.

## The Moment of Failure

Make the failure visceral. Show two side-by-side simulations: LEFT is the constant-gravity model. RIGHT is the real r²-model (we'll code it next). Fire both with identical initial conditions. In the LEFT panel: the projectile goes very high, pauses, returns. Always. Even at 100,000 m/s — just a longer wait. There is literally no speed at which escape occurs. The simulation hangs if you go high enough because the projectile takes arbitrarily long to return. Add a label showing the "time of flight" — at 11,200 m/s in the constant-gravity model the return time is 11,200/9.81 × 2 ≈ 38 minutes. It comes back. In the RIGHT panel: at 11,200 m/s, the projectile escapes. Show this as the trajectory curving away from the planet and the distance counter increasing without bound. The qualitative difference — "trapped" vs "escaping" — is dramatic. Explain: the constant-g model assumes you're near the surface. But escape velocity means going far from the surface. At 1 Earth radius above the surface, g has already dropped to g/4. At 2 radii above, g/9. The constant-g assumption becomes catastrophically wrong at exactly the altitudes where escape velocity matters.

## Why It Broke — The Physics

Newton's Law of Universal Gravitation: the gravitational force between two masses M and m separated by distance r is:

**F = G·M·m / r²**

This force weakens as the inverse square of distance. As the projectile climbs, gravity gets weaker. The question is: does gravity weaken fast enough that the projectile's kinetic energy is never fully consumed before r → ∞? The answer comes from energy conservation. Total mechanical energy:

**E = KE + PE = ½mv² − G·M·m/r**

The gravitational potential energy is −GMm/r, which approaches zero as r → ∞. For the projectile to escape, it must reach r = ∞ with at least zero total energy (KE ≥ 0 at r = ∞). Setting E = 0 at the surface r = R:

**½mv_esc² − G·M·m/R = 0**

**v_esc = √(2GM/R)**

For Earth: M = 5.97 × 10²⁴ kg, R = 6.371 × 10⁶ m, G = 6.674 × 10⁻¹¹ N·m²/kg²:
v_esc = √(2 × 6.674 × 10⁻¹¹ × 5.97 × 10²⁴ / 6.371 × 10⁶) = √(1.254 × 10⁸) = **11,186 m/s ≈ 11.2 km/s**.

Note: mass m of the projectile cancels. Escape velocity is independent of the escaping object's mass.

## The One Concept

**Escape velocity: v_esc = √(2GM/R)**

**Formal definition:** The minimum speed at which an object at the surface of a body of mass M and radius R must be launched (in any direction, assuming no atmosphere) such that it can escape to infinity without any additional thrust. It is derived by setting total mechanical energy (KE + gravitational PE) equal to zero at the surface, then solving for speed.

**Physical intuition:** Gravitational potential energy is a well — you're at the bottom, and infinity is the rim. To escape, you must have exactly enough kinetic energy to climb out of the well. If KE < |PE|, the total energy is negative — you're bound, and you'll fall back eventually. If KE ≥ |PE|, total energy is zero or positive — you can reach infinity. The "zero energy" boundary is the escape velocity. You don't need engines after launch — just that initial burst. If you have it, gravity can never stop you (though it will slow you continuously).

**Connection to orbital velocity:** The circular orbital velocity at radius r is v_orb = √(GM/r) (where centripetal acceleration equals gravitational acceleration). The escape velocity is exactly v_esc = √2 · v_orb at the same radius. This factor of √2 comes from the extra PE that needs to be overcome. For Earth's surface: v_orb ≈ 7.9 km/s, v_esc ≈ 11.2 km/s. For the ISS orbit (408 km altitude): v_orb ≈ 7.66 km/s, v_esc from that altitude ≈ 10.83 km/s.

**Real-world examples:**
1. **Rocket launches:** A rocket to orbit needs ~9.5 km/s of delta-v (including atmosphere and gravity losses). Escape from Earth needs another ~3.2 km/s beyond orbital. The New Horizons probe (en route to Pluto) launched at roughly escape velocity from Earth, then got additional speed from a Jupiter gravity assist.
2. **Black holes:** The escape velocity from a black hole's event horizon equals c (the speed of light). This is the Schwarzschild radius: r_s = 2GM/c². For a solar-mass black hole: r_s ≈ 3 km. Light itself cannot escape — hence "black."
3. **The Moon's low escape velocity:** v_esc_moon = 2.38 km/s. The Moon cannot retain an atmosphere because thermal speeds of gas molecules exceed this escape velocity — molecules fly away. Earth's atmosphere is retained because v_esc_earth = 11.2 km/s far exceeds typical molecular thermal speeds (500 m/s for N₂ at 300K).

## The Fix

Replace constant g with Newton's r² gravity:

```javascript
function updateProjectile(proj, planet, dt) {
  // Vector from projectile to planet center
  const dx = planet.x - proj.x;
  const dy = planet.y - proj.y;
  const r = Math.sqrt(dx * dx + dy * dy);
  
  // Newton's gravity: F = G*M*m / r^2
  // Acceleration magnitude: a = G*M / r^2
  const G = 6.674e-11; // N*m^2/kg^2
  const accelMagnitude = G * planet.mass / (r * r);
  
  // Acceleration components (directed toward planet)
  const ax = accelMagnitude * dx / r;
  const ay = accelMagnitude * dy / r;
  
  // Euler integration (update velocity and position)
  proj.vx += ax * dt;
  proj.vy += ay * dt;
  proj.x += proj.vx * dt;
  proj.y += proj.vy * dt;
  
  // Check escape: total energy
  const KE = 0.5 * proj.mass * (proj.vx**2 + proj.vy**2);
  const PE = -G * planet.mass * proj.mass / r;
  proj.totalEnergy = KE + PE;
  // If totalEnergy >= 0: projectile will escape
  // If totalEnergy < 0: projectile is bound
}
```

Now the simulation correctly shows: at v < v_esc, total energy is negative (bound) and the orbit is a closed ellipse. At v = v_esc, total energy is exactly zero (marginally bound) — the trajectory is a parabola opening to infinity. At v > v_esc, total energy is positive (unbound) — the trajectory is a hyperbola, and the projectile escapes. Show the energy display (KE bar + PE bar + total energy bar) updating in real time. The moment total energy crosses zero from negative to positive is the exact escape velocity.

## The Wow Moment — Push It

Build three escalating demos. First: **planetary comparison bar chart**. Show escape velocities for all solar system bodies: Moon (2.38 km/s), Mars (5.03 km/s), Earth (11.2 km/s), Saturn (35.5 km/s), Jupiter (59.5 km/s), Sun (617.5 km/s), neutron star (150,000 km/s), black hole event horizon (300,000 km/s = c). Make each bar clickable — switch the main simulation to that body and fire the cannonball.

Second: **gravity assist / slingshot maneuver**. Add Jupiter to the simulation. Fire a small probe from Earth on a trajectory that approaches Jupiter at a chosen angle and speed. As the probe swings around Jupiter, it gains speed from Jupiter's orbital velocity (effectively stealing momentum from Jupiter, which loses an immeasurably small amount). Show the hyperbolic trajectory around Jupiter and the exit velocity significantly higher than the entry velocity in the heliocentric frame. This is how Voyager 1 gained enough speed to escape the solar system. The physics: in Jupiter's frame, speed is conserved (elastic slingshot). In the Sun's frame, Jupiter's orbital velocity adds to the probe's speed.

Third: **atmospheric drag escape window**. A real rocket must fight atmospheric drag. Show energy loss from drag in the atmosphere (0–100 km altitude). The effective "escape velocity at sea level accounting for drag" is much higher than 11.2 km/s — which is why you always launch vertically first (minimize time in thick atmosphere) then pitch over for horizontal orbital velocity. Show the optimal ascent trajectory.

## The Interactive Demo

Canvas simulation at 1100 × 700 px. Planet at center. Camera can zoom out as the projectile moves away.

**Launch speed slider** (0 to 15 km/s): Initial speed of the cannonball. Color-coded: red (suborbital crash), orange (elliptical orbit), green (circular orbit at vesc/√2), blue (escape trajectory). Escape velocity marker shown in red. Speed shown in km/s and Mach number.

**Launch angle slider** (0° to 90° from horizontal): Adjusts trajectory. At any speed ≥ v_esc, any angle escapes. Show how this changes the shape of the escape hyperbola.

**Planet selector:** Dropdown — Moon, Earth, Mars, Jupiter, neutron star (scaled). Planet mass and radius update. v_esc recalculates and redraws the marker on the speed slider.

**Energy display:** Three horizontal bars — KE (green), PE (negative, red), Total (sum). When total crosses zero, a "ESCAPE!" banner appears.

**Trajectory trace:** The path of the projectile traced in real time, fading over time. Sub-escape trajectories draw closed ellipses. Escape trajectories show open curves.

**Newton's cannon mode:** Show the full set of Newton's cannonball trajectories at increasing speeds on the same screen: sub-orbital, orbital, escape — all simultaneously.

**Gravity assist mode:** Add a second massive body (Jupiter) at an adjustable position. The probe's trajectory curves around it. Energy display shows the gain during the flyby.

**Zoom controls:** Auto-zoom follows the projectile. Manual zoom slider for overview vs detail.

## Production Notes

**Runtime estimate:** ~13–15 minutes. Hook/Newton thought experiment (1.5 min), Naive code (2.5 min), Failure reveal (1.5 min), Physics/energy conservation (3 min), Fix (2 min), Wow moments (3 min), Interactive demo (1.5 min).

**Screen layout:** For this episode, the canvas dominates — planetary orbital mechanics is inherently visual. Use 70/30 canvas/code split. The planet should be rendered beautifully — Earth with blue/green/white texture or at minimum a convincing solid circle. Stars in the background add depth. Trajectory lines should glow.

**Animations to prepare:** Newton's mountain thought experiment (historical engraving style, animated). The energy well diagram — a 3D gravitational potential surface visualized as a funnel, with the escape condition shown as a marble reaching the rim. The escape velocity vs planet size comparison chart (prepare as an animated bar chart that builds column by column).

**Key zoom moments:** (1) The one-m/s transition from closed orbit to open escape trajectory — zoom into the speed slider at the exact moment. Play it several times in slow motion. This is the visual thesis of the whole episode. (2) The energy display — zoom into the bars as total energy ticks from negative to zero. (3) The gravity assist — zoom into the Jupiter flyby showing the speed change in the velocity vector.

**B-roll:** Real rocket launch footage (SpaceX, NASA — public domain available). Voyager trajectory animation (NASA JPL has public domain versions). Footage of the Moon's low gravity (Apollo astronauts bouncing). A black hole visualization (NASA simulations publicly available).

**Sound design note:** The transition from "bound orbit" to "escape" deserves a satisfying audio cue — a sustained ascending tone as total energy approaches zero, then a distinct sound when it crosses. This reinforces the threshold nature of escape velocity.

## Tags
`physics` `gravity` `escape-velocity` `energy-conservation` `orbital-mechanics` `javascript` `canvas` `beginner`

## Thumbnail

Full-planet view showing four trajectories emanating from the same launch point on the surface, fanning outward: a short arc hitting the surface (red), a wider arc (orange), a perfect circle (yellow), and an open hyperbolic escape curve (bright white/cyan) with an arrow pointing off-screen into the stars. Bold text overlay: "11,200 m/s" with a smaller label "add 1 m/s and it escapes forever." The star-field background and glowing trajectory lines give it a space-simulation aesthetic. The visual contrast between the closed arcs (three of them) and the single open escape trajectory makes the threshold concept immediately visual. Emotion: "There's a magic number, and I want to know what it is." The "add 1 m/s" subtext creates a strong hook — viewers want to understand why a tiny speed change has an infinite consequence.
