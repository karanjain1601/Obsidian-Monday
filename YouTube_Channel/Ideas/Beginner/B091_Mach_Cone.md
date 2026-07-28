---
title: "The Perfect Geometry of a Sonic Boom (Mach Cone)"
id: B091
difficulty: 2/10
prereq: "B090_Sound_Barrier"
concept: "Mach cone half-angle μ = arcsin(1/M); the cone is the envelope of all past spherical wavefronts emitted by the source; for M=1.5, μ=41.8°"
tags: [aerodynamics, mach-cone, sonic-boom, shock-wave, wave-envelope, geometry, canvas, beginner]
category: beginner
type: video-idea
---

# The Perfect Geometry of a Sonic Boom (Mach Cone)

**Alt title:** "Why Supersonic Jets Leave a Perfect Triangle in the Sky"
**Difficulty:** 2/10 | **Prereq:** B090_Sound_Barrier

---

## Opening Hook (0:00–1:00)

The screen opens on a single black canvas. A small aircraft icon moves steadily from left to right — not fast at first, just crawling. Around it, circular ripples expand outward like rings in a pond, each one born at the moment the plane emitted a sound wave. The circles pile up neatly in front of the plane, crowding, compressing. Then the host drags a slider: Mach 1.5. The plane leaps ahead of all its own sound. And there, left behind in the wake of the aircraft, is a perfect, unmistakable triangle — two crisp diagonal lines drawn by the outermost edge of every circular wavefront the plane ever produced. The host draws a protractor on screen. The half-angle reads exactly 41.8 degrees. "This triangle," the host says, "is not an approximation. It is a geometric certainty. Every supersonic aircraft in the history of aviation produces this exact shape, and today you are going to derive it from scratch in twenty lines of JavaScript."

## The Naive Attempt

The viewer opens a blank HTML file with a `<canvas>` element set to 900×500 pixels. The host walks through the first attempt together, live. Step one: draw the aircraft as a filled circle that moves at a constant velocity set by a `machNumber` variable multiplied by a base sound speed of 340 m/s scaled to pixels per frame. Step two: every 20 frames, push the current position of the aircraft into an array called `wavefronts`, and each entry stores both the birth position `{x, y}` and the age in frames. Step three: in the render loop, iterate over `wavefronts` and for each entry, draw a circle whose radius equals `age * soundSpeedPx` — the distance sound has traveled since that wavefront was born. The viewer draws about 30 of these circles, all centered at different past positions of the aircraft, all expanding at the same rate. At Mach 0.8 this looks beautiful: a gentle compression pattern ahead of the plane, all circles nearly touching at the front. The host says: "Now crank it up."

## The Moment of Failure

The host sets `machNumber = 1.5` and hits refresh. The canvas explodes into chaos. Circles everywhere — behind the aircraft, overlapping randomly, some still expanding in front where the plane has long since left. There is no cone visible anywhere. The wavefronts look like the aftermath of a dropped bag of marbles. The viewer expects a clean triangular envelope and sees only a mess of concentric rings that reveal nothing about the shock geometry. The problem is immediately obvious once pointed out: the circles are drawn with full stroke opacity, so dozens of overlapping arcs look like noise rather than a coherent pattern. More critically, there is no code to identify or draw the envelope — the straight tangent lines that graze all those circles simultaneously. The simulation is physically correct in every individual wavefront, but the emergent structure is invisible.

## Why It Broke — The Physics

The Mach cone is not one of those circles. It is the envelope of all of them — the single line that is tangent to every expanding sphere simultaneously. Because every wavefront was emitted at a different position along the flight path, and because the plane is moving faster than each wavefront can travel, the leading edge of each circle is always behind the aircraft. The tangent line to all these circles makes a specific angle with the flight path. That angle is μ, the Mach angle, defined by:

**sin(μ) = c / v = 1 / M**

For M = 1.5: μ = arcsin(1/1.5) = 41.8°. The cone's full apex angle is 2μ = 83.6°. This is pure geometry — the ratio of how far sound travels while the aircraft travels one unit of distance. No fluid dynamics, no turbulence — just the ratio of two speeds locked into a triangle.

## The One Concept

The Mach cone is the constructive interference envelope of all spherical wavefronts emitted by a supersonic source. Imagine the aircraft has been flying supersonically for ten seconds. Every millisecond during that flight, it emitted a tiny pulse of compressed air. Each pulse has been expanding as a sphere ever since. Because the aircraft moves faster than sound, all these spheres are clustered behind and around the current aircraft position — none of them have caught up to the plane in the forward direction. The outer edge of the most recently emitted sphere defines the current shock front, but only at that instant. The envelope — the surface tangent to all past spheres — is what an observer on the ground actually experiences as the boom. The boom does not arrive all at once; it sweeps the ground continuously as the aircraft passes overhead, like a giant invisible broom. The angle μ = arcsin(1/M) encodes everything: at M=1 (exactly sonic), μ=90° and the cone is a flat wall perpendicular to the flight path; at M=2, μ=30°, a sharper, narrower cone; at M=5 (hypersonic), μ=11.5°, nearly a needle. Real aircraft like the Concorde flew at M=2.02, giving μ≈29.7°. Military jets at M=1.6 produce μ≈38.7°. The crack of a rifle bullet (M≈2.5, μ≈23.6°) and the snap of a bullwhip (tip exceeds M=1) are both Mach cones in miniature.

## The Fix

Reduce wavefront circle opacity to 0.15 so overlapping rings become a soft haze. Then add the envelope lines explicitly. After the wavefronts array is populated, compute the cone angle as `mu = Math.asin(1 / machNumber)` and draw two lines from the aircraft's current position backward along the flight path, angled ±μ from the direction opposite to motion.

```javascript
const mu = Math.asin(1 / machNumber); // Mach half-angle in radians
const coneLength = 600; // pixels
ctx.beginPath();
ctx.moveTo(planeX, planeY);
ctx.lineTo(planeX - coneLength * Math.cos(mu), planeY - coneLength * Math.sin(mu));
ctx.moveTo(planeX, planeY);
ctx.lineTo(planeX - coneLength * Math.cos(mu), planeY + coneLength * Math.sin(mu));
ctx.strokeStyle = 'rgba(255, 80, 80, 0.9)';
ctx.lineWidth = 3;
ctx.stroke();
```

Instantly, the red lines slice through the haze of circles and land precisely on the outer tangent of every ring. The geometry becomes undeniable.

## The Wow Moment — Push It

The host introduces a "multi-vehicle" demo where three aircraft fly in formation at different Mach numbers — M=1.2, M=1.8, and M=3.0 — simultaneously. Each aircraft gets its own wavefront array and its own colored cone (blue, yellow, red respectively). As all three traverse the canvas, their cones have visibly different apertures. The M=3.0 cone is nearly a sliver; the M=1.2 cone is wide and blunt. The host then switches to a vertical-flight mode where the aircraft flies straight up, and the cone expands downward like a trumpet bell. Finally, the host enables "ground intersection" mode — a horizontal green line representing the ground — and marks the points where the Mach cone intersects the ground in real time, showing how the boom trace sweeps across the ground at a speed determined by both M and altitude.

## The Interactive Demo

- **Mach Number slider** (range 1.01 to 5.0, step 0.01): updates cone angle in real time and displays the computed μ in degrees next to the plane
- **Show wavefronts toggle**: shows or hides the translucent expanding circles so the viewer can see the envelope alone or the full picture
- **Wave emission interval slider** (range 5 to 60 frames): controls how densely packed the circles are, demonstrating that cone angle is independent of emission rate
- **Aircraft speed vs canvas speed toggle**: pauses the background and lets the aircraft drift, illustrating that only the ratio v/c matters, not absolute speed
- **Ground line toggle**: adds a horizontal ground plane and highlights the boom footprint sweeping across it in real time

## Production Notes

The canvas should be split into two halves during the "naive attempt" phase — left side shows the code being typed in a dark editor, right side shows the canvas rendering live. When the Mach cone appears correctly for the first time, zoom in with a smooth canvas scale transform to fill the screen with the apex of the cone. Animate a slow-motion frame-by-frame replay of the wavefronts being emitted so the viewer can watch individual circles freeze and fall behind. Display the live equation μ = arcsin(1/M) in the upper-right corner of the canvas, updating numerically as the slider moves. Use a slow cinematic pan from left to right behind the aircraft for the multi-vehicle wow moment, tracking the M=1.8 aircraft.

## Tags

`aerodynamics` `mach-cone` `sonic-boom` `shock-wave` `wave-envelope` `geometry` `canvas` `beginner`

## Thumbnail

Split-screen frame: left half is a dark blue canvas with a glowing white aircraft icon at the apex of a bright red V-shaped cone, dozens of faint translucent circles visible beneath it. Right half shows the equation "sin(μ) = 1/M" in large white text on black. Text overlay at the top reads "THE MATH BEHIND SONIC BOOMS" in bold yellow. The cone lines are thick and electric-red, making the triangle impossible to miss. The overall frame is dramatic and geometric — the kind of image that makes a viewer think "I want to understand that shape."
