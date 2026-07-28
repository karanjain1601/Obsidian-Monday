---
title: "Why Bullets Fly Farther at High Altitude"
id: B078
difficulty: 2/10
prereq: "B002"
concept: "Air density ρ = ρ₀·e^(-h/H) decreases exponentially with altitude H ≈ 8.5 km; drag F_drag ∝ ρ decreases → less deceleration → longer range; explains why record shots are at altitude"
tags: [aerodynamics, drag, air-density, altitude, ballistics, exponential-decay, canvas, beginner]
category: beginner
type: video-idea
---

# Why Bullets Fly Farther at High Altitude

**Alt title:** "The Atmosphere Is Thinner Up There — And That Changes Everything"
**Difficulty:** 2/10 | **Prereq:** B002

---

## Opening Hook (0:00–1:00)

The video opens on a split-screen comparison: on the left, a long-range rifle shot on a flat sea-level range — the bullet arcs noticeably and drops significantly before reaching 1000 meters. On the right, the same rifle, same load, same shooter — but at 3,000 meters altitude in the Rockies. The bullet drops far less and travels noticeably farther before hitting the ground. The host opens with: "Professional snipers know this. Long-range competition shooters know this. The world record for the longest confirmed sniper kill was set at high altitude. Why? Because the atmosphere gets thinner exponentially as you rise — and thin air cannot slow a bullet as effectively as dense sea-level air." The host then poses the counterintuitive question that will drive the episode: "Gravity doesn't change with altitude by much. So what is doing the extra slowing at sea level?" A simple animation shows a bullet with two arrows: a small downward arrow (gravity, barely changes with altitude) and a large backward arrow (drag, which does change dramatically). The hook closes as the drag arrow shrinks to almost nothing at 5,000 m altitude.

## The Naive Attempt

The viewer builds a projectile simulation that ignores air entirely. Standard code: horizontal constant velocity, vertical velocity reduced by gravity each frame. The ball (representing a bullet) traces a clean parabola. Range is computed using the vacuum formula R = v₀²sin(2α)/g. The viewer then adds a constant drag force `F_drag = k × v²` where k is a fixed constant. The simulation now shows a shorter range with the bullet curving downward faster. The host says: "This is what most beginners do — constant drag. But we're going to fly this bullet from sea level to a high mountain, and the constant drag model is going to give us the wrong answer."

```javascript
const dragCoeff = 0.0001; // constant — WRONG for altitude changes

function update() {
  const speed = Math.sqrt(vx * vx + vy * vy);
  const F_drag = dragCoeff * speed * speed;
  const drag_x = -F_drag * (vx / speed);
  const drag_y = -F_drag * (vy / speed);
  vx += (drag_x / mass) * dt;
  vy += (drag_y / mass - g) * dt;
}
```

## The Moment of Failure

The host adds an altitude parameter and runs the simulation at three altitudes: 0 m, 2000 m, 5000 m. With the constant drag model, the bullet's range is identical at all three altitudes — the simulation shows no difference because `dragCoeff` never changes with altitude. But in reality, a bullet fired at 5,000 m altitude travels roughly 15–25% farther than the same bullet at sea level under otherwise identical conditions. The constant-drag simulation predicts 0% difference. When the host plots real-world ballistic data alongside the simulation's output on the same graph, the simulation's flat line across altitudes looks embarrassingly wrong compared to the clearly rising real-world range curve. The visual: a graph with x-axis = altitude (0–5000 m) and y-axis = range (m), showing real data climbing from 800 m to 1050 m while the simulation line sits flat at 800 m for all altitudes.

## Why It Broke — The Physics

The drag force on a projectile is given by:

**F_drag = ½ × C_D × ρ × A × v²**

where C_D is the drag coefficient (depends on projectile shape and Mach number), ρ is the air density at the current altitude, A is the cross-sectional area of the projectile, and v is the speed relative to the air. The critical term for altitude dependence is ρ — air density.

Air density decreases with altitude according to the barometric (exponential atmosphere) formula:

**ρ(h) = ρ₀ × e^(−h/H)**

where ρ₀ ≈ 1.225 kg/m³ is sea-level density, h is altitude in meters, and H ≈ 8,500 m is the scale height of the atmosphere (the altitude at which density has dropped to 1/e ≈ 36.8% of its sea-level value). This exponential decay is the key insight: at h = 8,500 m (approximately the height of base camp at Everest), air density is only 37% of sea level. At h = 4,000 m (many mountain ranges), density is about 62% of sea level. A 38% reduction in density means a 38% reduction in drag force at the same speed — which means less deceleration, longer time aloft, and greater range.

The exponential atmosphere model itself comes from hydrostatic equilibrium combined with the ideal gas law: the atmosphere is in a state where pressure at any altitude exactly supports the weight of air above it, and because pressure and density are proportional (at constant temperature), both fall off exponentially with altitude.

## The One Concept

The **exponential atmosphere** — also called the barometric formula or standard atmosphere (simplified isothermal case) — is one of the most important models in aerodynamics, aviation, and ballistics. The formula ρ(h) = ρ₀·e^(−h/H) has profound practical implications far beyond bullets.

The scale height H ≈ 8,500 m (for an isothermal atmosphere at ~250 K) tells you how fast density falls: for every 8.5 km you rise, density drops to 37% of its previous value. This is a fast drop: at 17 km (about twice the scale height), density is only 14% of sea-level. At 25 km (the ozone layer), it is roughly 4%. At 100 km (the Karman line, the "edge of space"), air pressure is effectively zero.

In ballistics specifically, the effect is dramatic for long-range shots. A .50 BMG bullet fired at sea level with a muzzle velocity of 900 m/s at 1,500 m range loses about 200 m/s to drag. The same bullet at 3,000 m altitude loses only about 130 m/s — a 35% reduction in speed loss, directly proportional to the reduced air density at that altitude. This is why world record long-range sniper engagements and precision shooting competitions, when conducted at altitude, require drastically different firing solutions (holdover, bullet drop compensation) than the same shot at sea level.

Beyond ballistics: pilots must adjust fuel mixtures because thin air carries less oxygen per cubic meter. Aircraft engines lose power at altitude in proportion to density (piston engines) or must use turbochargers/turbofans to compensate. Parachutists deploy higher at altitude because the drag force is less at the same speed, and they fall faster. Tennis balls behave differently at the altitude of cities like Mexico City (2,250 m), which is why professional tournaments use pressurized "altitude balls" — special balls with different felt properties to simulate sea-level drag in thinner air. The same principle applies to baseball, where pitches curve less at Coors Field in Denver (1,609 m) than at sea-level stadiums.

## The Fix

Replace the constant drag coefficient with altitude-dependent air density:

```javascript
const rho0 = 1.225;   // kg/m³, sea-level density
const H = 8500;       // m, scale height

function airDensity(altitude_m) {
  return rho0 * Math.exp(-altitude_m / H);
}

const Cd = 0.30;      // drag coefficient (streamlined bullet)
const A = 0.0000507;  // m², cross-section of .50 cal bullet

function update() {
  const altitude = launchAltitude + y; // y = height above launch point
  const rho = airDensity(altitude);
  const speed = Math.sqrt(vx * vx + vy * vy);
  const F_drag = 0.5 * Cd * rho * A * speed * speed;
  const drag_x = -(F_drag * vx / speed) / mass;
  const drag_y = -(F_drag * vy / speed) / mass;
  vx += drag_x * dt;
  vy += (drag_y - g) * dt;
}
```

Running the corrected simulation at 0 m, 2000 m, and 5000 m altitude now shows clearly increasing ranges — matching real-world ballistic data.

## The Wow Moment — Push It

The host builds a complete long-range ballistics tool that plots range vs. altitude as a continuous curve. The viewer sets the bullet parameters (mass, drag coefficient, cross-section, muzzle velocity) and launch angle. The simulation fires the bullet at altitudes from 0 to 6,000 m in 100 m steps, plots the range at each altitude on a graph, and overlays the exponential density curve for comparison. The shapes are strikingly parallel — range scales almost linearly with 1/ρ for the same initial conditions. Then the host adds a temperature layer: the real atmosphere is not isothermal, and temperature also affects speed of sound (which affects the Mach-dependent drag coefficient C_D). The viewer watches the Mach 1 transition at various altitudes shift, creating small kinks in the range curve where the bullet crosses the sound barrier at different moments during flight depending on altitude.

## The Interactive Demo

- **Launch altitude slider** — 0 to 6000 m; updates density in real time and reruns the simulation
- **Muzzle velocity slider** — 200 to 1000 m/s; sets initial bullet speed
- **Launch angle slider** — 0° to 45° (default optimal angle for given conditions)
- **Bullet mass slider** — 5 g to 50 g; changes momentum retention at higher speeds
- **Drag coefficient slider** — 0.1 to 0.5; models different bullet shapes
- **Show density curve overlay** — plots ρ(h) on the range graph for visual comparison
- **Multi-altitude comparison mode** — fires the bullet simultaneously at 5 preset altitudes and overlays all trajectories on screen
- **Real-world bullet selector** — dropdown: .308 / .50 BMG / 9mm; presets mass, area, Cd

## Production Notes

Open with the split-screen rifle footage or a clear animation. When introducing the exponential formula, write it on a dark chalkboard-style panel and animate the curve: start with ρ₀ at h=0, then draw the exponential decay rightward as h increases, marking h = H (one scale height) with a horizontal dashed line at ρ₀/e ≈ 0.45 kg/m³. For the fix, show the `airDensity()` function call highlighted in the code, then zoom in on the plot panel where range clearly increases with altitude. The multi-altitude trajectory overlay in the wow moment should use a color gradient from dark blue (sea level) to bright yellow (6,000 m altitude) so the fan of trajectories is visually legible.

## Tags
`aerodynamics` `drag` `air-density` `altitude` `ballistics` `exponential-decay` `canvas` `beginner`

## Thumbnail

A mountain landscape silhouette at the bottom; a bullet trajectory arc at sea level (short, red) and a bullet trajectory arc at high altitude (long, gold). The gold arc towers over the red one. Bold text: **"FARTHER AT ALTITUDE."** Subtext: "The exponential atmosphere." A small inset of the density formula ρ = ρ₀e^(−h/H) in the corner. The dramatic length difference between the two arcs is the stop-scroll element.
