---
title: "What Actually Happens at the Sound Barrier"
id: B090
difficulty: 2.5/10
prereq: "B024_Wave_Basics"
concept: "Mach number M = v/c_sound; at M=1, the aircraft catches up to its own sound waves → pressure waves pile up into a shock (abrupt pressure discontinuity); wave drag spikes at transonic speeds."
tags: [aerodynamics, mach-number, shock-wave, transonic, wave-drag, sound-barrier, canvas, beginner]
category: beginner
type: video-idea
---

# What Actually Happens at the Sound Barrier

**Alt title:** "Why Breaking the Sound Barrier Took 30 Years (And One Equation)"
**Difficulty:** 2.5/10 | **Prereq:** B024_Wave_Basics

---

## Opening Hook (0:00–1:00)

The video opens on a slow-motion still frame of the famous 1947 photo: Chuck Yeager's Bell X-1, a bright orange bullet-shaped aircraft, with a perfectly conical white vapor cloud forming around it — the condensation cloud caused by the pressure drop behind the shock wave. Then audio: the thunderclap of a sonic boom. The host says: "For fifteen years, aeronautical engineers thought the sound barrier was a genuine physical wall — that drag would become infinite at Mach 1 and no aircraft could ever punch through. They were wrong, but barely. The drag doesn't go infinite. It just spikes — brutally and suddenly — and for a decade no engine was powerful enough to push through the spike. Today we simulate where that spike comes from, using nothing but a point source and the wave equation."

## The Naive Attempt

The viewer builds a simple 2D wave-source simulation. A point source emits circular pressure waves at fixed time intervals. The source is stationary at first — concentric rings expand outward uniformly, like ripples from a stone in a pond. The viewer then moves the source to the right at half the wave speed. The rings are no longer concentric — they crowd together in front of the source and spread out behind, producing the classic Doppler-shifted pattern. The code:

```js
// Emit a new ring every T seconds
let waves = [];
function update() {
  source.x += sourceSpeed * dt;
  // Emit new wave at source position
  if (frameCount % emitInterval === 0)
    waves.push({ x: source.x, y: source.y, r: 0 });
  // Expand all waves
  for (let w of waves) w.r += soundSpeed * dt;
  // Draw
  for (let w of waves) drawCircle(w.x, w.y, w.r);
}
```

This works beautifully for subsonic motion. The front of the wave pattern is compressed; the back is expanded. This is Doppler.

## The Moment of Failure

The viewer cranks `sourceSpeed` up to match `soundSpeed` (Mach 1). All the wavefronts now pile up at the exact same point — directly in front of the source. The simulation shows every ring touching the source simultaneously, building up into a vertical wall of overlapping wavefronts. The viewer sets `sourceSpeed` slightly above `soundSpeed` (supersonic) and all the wave rings are now entirely behind the source — the source has outrun its own sound. Something strange has happened to the wave pattern, but it's not clear from the circle-drawing simulation why this causes a huge drag spike or a "barrier."

## Why It Broke — The Physics

When a source moves at the speed of sound, every wavefront it has ever emitted arrives at the leading edge simultaneously. The pressure from all these overlapping waves adds up coherently — the pressure at that point approaches infinity in the ideal point-source model. In a real fluid with viscosity and thermodynamics, it doesn't go to infinity but instead forms a **shock wave**: an abrupt, near-discontinuous jump in pressure, density, and temperature across a surface only a few mean-free-paths thick (~10⁻⁷ m in air). The Mach angle of the resulting **Mach cone** at supersonic speed is:

**sin(μ) = c_sound / v_source = 1/M**

where M = v/c is the Mach number. Inside the Mach cone is the "zone of action" — downstream regions that have received pressure information from the aircraft. Outside the cone is the undisturbed air. The shock wave itself is the boundary. The **wave drag** — drag due solely to the energy carried away by the shock — scales roughly as **(M² − 1)^(−1/2)** near M=1, spiking sharply at the transonic regime and requiring enormous engine thrust to overcome.

## The One Concept

The **Mach number** M = v/c_sound is the single most important parameter in compressible aerodynamics. At M < 1 (subsonic), pressure disturbances from the aircraft propagate ahead of it and the flow has time to "warn" itself, smoothly parting for the aircraft. At M = 1 (sonic), no information can propagate ahead and the flow has zero warning time — all disturbances pile up at the nose. At M > 1 (supersonic), the aircraft moves faster than information can travel through the air, forming the Mach cone. The shock wave at the cone boundary is not just a sound boom — it is a thermodynamic event. Air crossing the shock wave is compressed and heated almost instantaneously. The Rankine-Hugoniot conditions (conservation of mass, momentum, energy across the shock) give exact relations between pre-shock and post-shock conditions. The temperature jump at a Mach 2 shock is about 1.4×; the pressure jump is about 4.5×. This rapid compression heats the air, which means the aircraft must supply energy not just to overcome viscous skin friction (as in subsonic flight) but to continuously create and sustain the shock — this is **wave drag**. It does not disappear above Mach 1: it only falls off slowly as `1/√(M²−1)`. The sonic boom heard on the ground is the Mach cone sweeping past — not a one-time event at the moment of breaking the sound barrier, but a continuous boom for the entire supersonic flight path.

## The Fix

To visualize the shock properly, compute the Mach cone boundary analytically and overlay it on the wave-ring simulation:

```js
let M = sourceSpeed / soundSpeed;
if (M >= 1) {
  let mu = Math.asin(1 / M); // Mach angle
  // Draw the Mach cone as two lines from source position
  let dx = Math.cos(mu), dy = Math.sin(mu);
  // Forward vertex at source, cone opens backward
  drawLine(source.x, source.y,
           source.x - 300*dx, source.y - 300*dy);
  drawLine(source.x, source.y,
           source.x - 300*dx, source.y + 300*dy);
  // Color inside cone differently (zone of silence)
  fillConeRegion(source.x, source.y, mu, 'rgba(255,100,0,0.1)');
}
```

Now the simulation clearly shows the conical wavefront envelope, the zone of silence outside it, and how the cone narrows (mu decreases) as M increases beyond 1. Add a live wave drag coefficient plot that spikes near M=1 and falls off at higher M.

## The Wow Moment — Push It

Animate the sound barrier being broken in real time: start at M=0.5 and slowly accelerate the source to M=1.5. Show the wave pattern transition from Doppler rings to piled-up wall to full Mach cone. At the moment M crosses 1.0, flash a boom animation and show the cone snapping into existence. Then show a real aircraft shape (a simplified F-86 Sabre profile) and let the viewer see oblique shocks forming at the nose and tail separately — a bow shock and a tail shock — at Mach 1.2. Add a drag-vs-Mach curve with the transonic drag rise annotated, showing where the Yeager X-1's engine power was just barely enough.

## The Interactive Demo

- **Source speed (Mach number)** — slider 0 to 2.5 M, covering subsonic through supersonic
- **Sound speed** — slider 300 to 400 m/s (temperature effects on c)
- **Wave emission rate** — slider 1 to 20 waves per second
- **Show Mach cone** — toggle to overlay the analytical Mach angle lines
- **Show drag curve** — toggle to show a live drag coefficient vs. Mach plot in the corner
- **Aircraft shape** — toggle between point source, blunt body, and streamlined (sharp nose) to compare shock shapes

## Production Notes

The main canvas is a 2D side view. Circular wave rings are drawn with thin cyan strokes, fading over time. The source is a bright white dot with a directional velocity arrow. At supersonic speeds, the Mach cone is drawn as a solid orange triangle behind the source with a glowing boundary line. A label inside the cone reads "Zone of Silence." The drag coefficient chart in the lower right updates in real time with a moving cursor dot at the current Mach number. When M crosses 1.0, briefly flash the canvas background orange to represent the sonic boom event. Label the wave rings with age (newest bright, oldest faint) to help the viewer intuitively understand why they pile up at M=1.

## Tags
`aerodynamics` `mach-number` `shock-wave` `transonic` `wave-drag` `sound-barrier` `canvas` `beginner`

## Thumbnail

The iconic vapor cone of a supersonic aircraft — a white conical cloud forming around a jet — against a blue sky. Overlaid in bold orange text: "MACH 1" with a speedometer needle slammed to the right. Below: "Why This Was Impossible for 15 Years." The real aircraft photo with the dramatic vapor cone is immediately iconic; the "impossible" framing creates curiosity. Sharp contrast of white vapor against blue sky makes it pop at thumbnail scale.
