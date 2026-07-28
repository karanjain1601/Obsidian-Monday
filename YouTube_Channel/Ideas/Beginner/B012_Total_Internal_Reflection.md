---
title: "How Fiber Optics Work: Total Internal Reflection in Code"
id: B012
difficulty: 2/10
prereq: "B011 — Why a Straw Looks Broken in Water (Snell's Law)"
concept: "Critical angle θc = arcsin(n2/n1) and total internal reflection"
tags: [physics, optics, total-internal-reflection, fiber-optics, critical-angle, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# How Fiber Optics Work: Total Internal Reflection in Code

**Alt title:** "The Physics Trick That Gave Us the Internet"
**Difficulty:** 2/10 | **Prereq:** B011 — Why a Straw Looks Broken in Water (Snell's Law)

---

## Opening Hook (0:00–1:00)

Open on a coiled fiber optic cable glowing from one end — the light visibly travels around the curve and exits the other end unchanged. This is a cable thinner than a human hair, guiding light for kilometers with almost no loss. Cut to a cross-section diagram: a glass core (n ≈ 1.52) surrounded by a glass cladding (n ≈ 1.48), surrounded by a plastic jacket. The difference in refractive index is just 0.04. That tiny difference is what holds a signal carrying your Netflix stream, your video call, your bank transaction. Zoom into the core-cladding interface. Draw a ray hitting it at a steep angle — some light escapes into the cladding. Now slowly increase the angle of incidence. At exactly 76.7°, something dramatic happens: the transmitted ray disappears entirely. All light bounces back. One hundred percent. No loss at that interface. The transition from partial reflection to total reflection is instantaneous — there is no "mostly total reflection." Ask the question: what is the critical angle, and why does total reflection happen at all? This video will derive it from Snell's Law, build it in code, and then exploit it to simulate a functional fiber optic cable.

## The Naive Attempt

Start with the Snell's Law refraction code from B011. Build a simplified fiber: a long rectangular strip on screen, 40 pixels wide and 600 pixels long. The interior represents the glass core with n_core = 1.52. Outside is the cladding with n_cladding = 1.48. Inject a ray from the left end at a slight upward angle — say 10° from the fiber axis. Trace the ray using Snell's Law at each reflection point. At each bounce off the core-cladding boundary, compute the refracted ray (which exits into the cladding) and the reflected ray (which stays in the core). Use the Fresnel equations to compute the fraction reflected: for typical angles, this is 96–99% per bounce. Render both the reflected ray (stays inside, continues propagating) and the transmitted ray (leaks sideways out of the fiber). Show an intensity counter on the propagating ray — it starts at 100% and drops with each bounce. The code is clean and physically reasonable. But watch the intensity display as the ray bounces down the fiber — it drops noticeably with each reflection. At 96% reflectance per bounce, after 50 bounces the signal has decayed to 0.96^50 ≈ 13% of its original strength. After 100 bounces: 1.7%. The fiber is utterly useless for data transmission.

## The Moment of Failure

Render a progress bar or intensity meter at the right end of the fiber — the "received signal strength." With partial reflections: after only 20 reflections, the signal is at 44%. The transmitted-ray leakage rays are visible as a faint spray of light escaping from both sides of the fiber cladding. For a real-world scale: a fiber optic cable across the Atlantic Ocean has reflections occurring roughly every millimeter along its length — that's millions of bounces. With partial reflection, the signal would be completely gone within the first meter. The simulation makes this devastatingly clear. Add a counter showing "km of fiber for signal to drop below 1%: 0.0001 km" — a tenth of a millimeter. The audience sees why the naive partial-reflection model makes fiber optics physically impossible. This failure reveals that real fiber optics must be doing something categorically different — not just "high reflectivity" but 100% reflectivity. The physics needs a qualitative change, not a quantitative improvement. That's the critical angle.

## Why It Broke — The Physics

Apply Snell's Law at the core-cladding interface. The ray is going from glass (n_core = 1.52) to cladding (n_cladding = 1.48). Since n_core > n_cladding, we're going from a denser to a less-dense medium — this means the refracted ray bends away from the normal (toward the interface). Snell's Law: n_core · sin(θ_i) = n_cladding · sin(θ_t). Solving for the transmitted angle: sin(θ_t) = (n_core/n_cladding) · sin(θ_i). The critical condition is when θ_t = 90°, meaning the transmitted ray travels exactly along the interface:

**sin(θ_c) = n_cladding / n_core**

**θ_c = arcsin(n_cladding / n_core) = arcsin(1.48 / 1.52) ≈ 76.7°**

For any angle of incidence θ_i > θ_c, the math would require sin(θ_t) > 1.0, which is impossible. There is no transmitted ray. Physics enforces this by making the reflection coefficient exactly 1.0 — the wave equation at the boundary has no propagating solution in the cladding, only an evanescent wave that decays exponentially within a few wavelengths. The evanescent wave carries no energy across the boundary. This is not an approximation or a limit — it is an exact, mathematically provable result of Maxwell's equations applied to a planar interface.

## The One Concept

**Total Internal Reflection (TIR): when light traveling in a denser medium hits an interface at angle θ_i > θ_c = arcsin(n₂/n₁), 100% of the light is reflected. No energy crosses the interface.**

**Formal definition:** TIR occurs when: (1) light is in the denser medium (n₁ > n₂), and (2) the angle of incidence exceeds the critical angle θ_c = arcsin(n₂/n₁). Below θ_c, the interface partially reflects and partially transmits (governed by the Fresnel equations). At θ_c, the transmitted ray grazes the interface. Above θ_c: no transmitted ray, reflection coefficient = 1.

**Physical intuition:** Think of Snell's Law as geometry: the refracted ray must "fit" on the other side of the interface. As you steepen the incident angle, the refracted ray gets shallower (closer to the interface plane). At the critical angle, the refracted ray lies exactly in the interface plane. Beyond that — there's no direction it could go. The wave literally has nowhere to go in the second medium. The boundary condition forces 100% reflection.

**Evanescent wave:** Even in TIR, the electromagnetic field doesn't abruptly stop at the boundary. It decays exponentially into the cladding with characteristic depth δ = λ/(4π√(sin²θ - sin²θ_c)). This matters in frustrated TIR (bring a second glass close enough to "tunnel" light across a gap) and in attenuated total reflectance spectroscopy (chemical sensing).

**Real-world examples:**
1. **Fiber optic cables:** The entire internet backbone relies on TIR to guide light through glass fibers for thousands of kilometers. Optical amplifiers (erbium-doped fiber amplifiers, EDFAs) restore signal strength every ~80 km, not every millimeter.
2. **Diamonds:** n_diamond = 2.42 gives θ_c = 24.4°. Diamond is cut with many facets precisely so that almost all internal rays hit the facets at angles exceeding 24.4° — the light bounces internally through many paths before exiting, creating the characteristic brilliance. Glass (n = 1.5, θ_c = 41.8°) traps far less light, which is why cubic zirconia doesn't sparkle like diamond even though it's optically clear.
3. **Medical endoscopes:** Flexible endoscopes use bundles of thousands of tiny glass fibers to transmit images from inside the body. Each fiber individually guides light from one pixel of the internal scene to a camera at the other end, via TIR. The fiber bundle can flex and bend without losing the image.

## The Fix

At each core-cladding interface, check whether TIR occurs before computing refraction:

```javascript
function traceRayInFiber(ray, n_core, n_cladding) {
  // Find intersection with fiber wall
  const intersection = findWallIntersection(ray);
  
  // Angle of incidence at the wall (from normal = perpendicular to fiber wall)
  const theta_i = angleFromNormal(ray.direction, intersection.normal);
  
  // Critical angle
  const theta_c = Math.asin(n_cladding / n_core);
  
  if (theta_i > theta_c) {
    // Total Internal Reflection — perfect mirror bounce, no loss
    ray.direction = reflect(ray.direction, intersection.normal);
    ray.intensity *= 1.0; // No loss!
    return ray;
  } else {
    // Partial reflection + partial transmission (Fresnel equations)
    const sin_t = (n_core / n_cladding) * Math.sin(theta_i);
    const theta_t = Math.asin(sin_t);
    // Fresnel reflectance (s-polarization):
    const rs = (n_core * Math.cos(theta_i) - n_cladding * Math.cos(theta_t))
             / (n_core * Math.cos(theta_i) + n_cladding * Math.cos(theta_t));
    const R = rs * rs;
    // Split ray: reflected portion stays in fiber, transmitted leaks out
    ray.intensity *= R;
    // (also spawn transmitted ray with intensity *= (1 - R))
    return ray;
  }
}
```

With TIR active: inject the ray at an angle inside the acceptance cone (θ from fiber axis < 90° - θ_c ≈ 13.3° for this fiber). The intensity meter now reads 100% at any fiber length. Add a fiber bend and watch the angle change — if the bend is tight enough, the local incidence angle drops below θ_c and light leaks at the bend point.

## The Wow Moment — Push It

Build three successively more complex demonstrations. First: **multimode fiber** — simultaneously inject 50 rays at slightly different angles (from near-axial to near-critical). The rays that stay within the acceptance cone (guided modes) bounce cleanly down the fiber. Rays outside the acceptance cone (radiation modes) lose energy at the first bounce and vanish. Color-code guided modes vs leaking modes. Show the "modal dispersion" — different guided angles travel different path lengths and arrive at the output at slightly different times, spreading a pulse.

Second: **graded-index fiber** — instead of a sharp core-cladding interface, make the refractive index a parabolic function of radial position: n(r) = n_core · √(1 - α·(r/a)²). Rays now follow smooth curves instead of straight zig-zags — they continuously bend back toward the axis. The parabolic profile makes all guided modes travel the same effective path length, eliminating modal dispersion. Show the contrast: step-index fiber (zig-zag, spread pulse) vs graded-index (smooth curves, sharp pulse).

Third: **fiber bend loss** — hold the fiber straight (all rays guided, 100% transmission). Then progressively bend the fiber using a curved spline. As the bend radius decreases, rays that were comfortably inside the critical angle now hit the outer boundary of the bend at reduced angles. Watch individual rays start leaking at the bend. A real optical fiber has a minimum bend radius specification — violate it and your signal degrades or breaks. The visual of rays escaping from the outside of the bend is striking and immediately understandable.

## The Interactive Demo

Full interactive simulation in a 1000 × 600 Canvas. The fiber is drawn as a curved tube across the canvas. Controls:

**n_core slider** (1.40–1.80): Sets the core refractive index. Labels: 1.44 = silica glass, 1.52 = borosilicate, 1.63 = dense flint.

**n_cladding slider** (1.38–1.78, must be < n_core — enforced with a locked upper bound): Sets cladding index. Critical angle display updates in real time: "θc = XX.X°"

**Acceptance angle display**: Shows the numerical aperture NA = √(n_core² - n_cladding²) and the corresponding acceptance cone half-angle.

**Ray injection angle slider** (-30° to +30° from fiber axis): Controls the launch angle. Color of the ray turns red when outside the acceptance cone (will not be guided). Turns green when inside.

**Number of simultaneous rays** (1–50): Inject multiple rays at slightly different angles to visualize modal dispersion.

**Fiber bend radius slider** (5 cm to ∞, logarithmic): Bends the simulated fiber. Critical bend radius indicator shown in red.

**Profile toggle**: Switch between step-index (sharp core-cladding boundary, rays zig-zag) and graded-index (parabolic profile, rays curve smoothly).

**Loss meter**: Real-time display of signal intensity at the fiber output as a percentage.

**Animation controls**: Play/pause the ray animation. Speed slider (0.1× to 10×).

## Production Notes

**Runtime estimate:** ~14–16 minutes. Hook (1 min), Naive code build (3 min), Failure reveal (1.5 min), Physics derivation (3 min), Fix (2 min), Wow demos (3 min), Interactive demo (2 min).

**Screen layout:** Same 60/40 split as B011. Code on the right, Canvas on the left. The fiber should run roughly horizontally across the canvas so the ray bouncing is clearly visible. Use a dark background (near-black) for the canvas so the glowing rays pop visually.

**Animations to prepare in advance:** The wavefront-at-the-interface animation showing evanescent decay (exponential field decay into cladding) — this is best as a pre-rendered vector animation overlaid in post. The cross-section diagram of core/cladding/jacket. The bend-loss diagram showing the geometry of why bending reduces incidence angle at the outer wall.

**Key zoom moments:** (1) The exact frame where the transmitted ray disappears at the critical angle — zoom into the interface region as θ_i crosses θ_c and the refracted ray vanishes. This is the visual climax. (2) The intensity counter at the fiber output changing from "~13% after 50 bounces" (naive) to "100.0%" (TIR) when the fix is applied. (3) The bend loss demo — zoom into the fiber bend point where light escapes.

**B-roll ideas:** Real fiber optic cable being bent under a bright light to show visible light escaping at bends. Fiber optic Christmas tree lights (visible TIR in consumer products). An endoscope image of the inside of a pipe or stomach (public domain footage). Diagram of undersea fiber optic cable routes on a world map.

**Props for talking-head:** A coil of illuminated fiber optic cable (inexpensive at any electronics store). A glass of water with a flashlight shining up through it at angles past/below the critical angle — showing TIR vs transmission in a real scenario.

## Tags
`physics` `optics` `total-internal-reflection` `fiber-optics` `critical-angle` `javascript` `canvas` `beginner`

## Thumbnail

A glowing fiber optic strand against pure black background, visibly bent in a smooth curve with light traveling around the bend without loss. Overlaid split-screen comparison: LEFT side shows a leaking fiber (the naive code — multiple rays escaping sideways, intensity meter at 14%) with a red X; RIGHT side shows a TIR fiber (clean ray bouncing perfectly, intensity at 100%) with a green checkmark. Bold white text across the top: "100% REFLECTION." Smaller text: "How the internet works." The contrast between the leaky left half and the perfect right half creates immediate curiosity about what changed. The glowing fiber against black gives a premium, futuristic feel. Emotion triggered: "I've plugged in a fiber optic cable and never wondered how it works — now I do."
