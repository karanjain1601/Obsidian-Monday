---
title: "Routing Light Around Bends (Fiber Optic Bundle in Code)"
id: B089
difficulty: 2/10
prereq: "B012_Total_Internal_Reflection"
concept: "TIR at each bend keeps light confined inside the fiber core; numerical aperture NA = √(n_core² - n_clad²) = n_air·sin(θ_max) defines the acceptance cone for input light."
tags: [optics, fiber-optics, total-internal-reflection, numerical-aperture, waveguide, refraction, canvas, beginner]
category: beginner
type: video-idea
---

# Routing Light Around Bends (Fiber Optic Bundle in Code)

**Alt title:** "How Light Gets Trapped Inside Glass — And Travels Around the World"
**Difficulty:** 2/10 | **Prereq:** B012_Total_Internal_Reflection

---

## Opening Hook (0:00–1:00)

The video opens on a Canvas showing a thin glass fiber drawn as a curved white tube snaking across the screen. A bright ray of light enters the left end, and the viewer watches it bounce — left wall, right wall, left wall — making its way through the curves and bends without ever leaking out. The host says: "Right now, the internet runs on this. Your Netflix stream, this video, bank transactions — they all travel as pulses of light bouncing inside glass fibers thinner than a human hair. The light never escapes, not because the glass is opaque, but because of a beautiful geometric property of refraction: total internal reflection. Once you understand the critical angle, you understand the entire global communications infrastructure. Let's trace every bounce."

## The Naive Attempt

The viewer draws a curved fiber as a thick horizontal band, then tries to make light travel through it by tracing a ray with constant speed across the canvas. When the ray hits the fiber wall, they try to implement refraction using Snell's law:

```js
function refract(angle_i, n1, n2) {
  let sinT = (n1 / n2) * Math.sin(angle_i);
  return Math.asin(sinT); // transmitted angle
}
// At the wall:
let refractedAngle = refract(incidenceAngle, n_core, n_cladding);
ray.angle = refractedAngle; // ray exits the fiber
```

The ray hits the wall and refracts out into the cladding — it escapes. The fiber doesn't work at all. Every bounce leaks light and the ray fades to nothing within a few reflections.

## The Moment of Failure

The viewer watches the light ray punch through the fiber wall at every bounce, scattering into the cladding glass and never making it to the other end. Trying to simply not compute refraction and force reflection makes the fiber look like a metal mirror tube, not a glass fiber — and doesn't explain why total internal reflection happens for some angles but not others. The fiber leaks at every turn.

## Why It Broke — The Physics

Snell's law at the core-cladding interface: **n_core · sin(θ_i) = n_cladding · sin(θ_t)**. As θ_i increases, sin(θ_t) increases proportionally. When sin(θ_t) would need to exceed 1.0, no transmitted ray is possible — the light is completely reflected back into the core. The **critical angle** is: **θ_c = arcsin(n_cladding / n_core)**. For any angle of incidence at the core-cladding interface greater than θ_c, total internal reflection (TIR) occurs — 100% of the light is reflected, with no energy lost to the cladding. A typical glass fiber has n_core ≈ 1.48, n_cladding ≈ 1.46, giving θ_c = arcsin(1.46/1.48) ≈ 80°. Any ray hitting the wall at an angle greater than 80° from the normal (i.e., nearly parallel to the fiber axis) undergoes TIR and stays trapped. The **numerical aperture** defines the maximum acceptance angle from outside: **NA = √(n_core² − n_cladding²)**, and the acceptance half-angle in air is **θ_max = arcsin(NA)**.

## The One Concept

**Total Internal Reflection (TIR)** in fiber optics is the mechanism that traps light inside the glass core indefinitely. The key insight is that TIR is not absorption and not reflection off a coating — it is a fundamental consequence of Snell's law when light attempts to go from a denser medium (higher n) to a less dense medium (lower n). When the incidence angle exceeds the critical angle, the math of Snell's law demands sin(θ_t) > 1, which is impossible for real angles — the light simply has no valid refracted direction and all energy returns into the core. The **Numerical Aperture (NA)** is the most important single specification of an optical fiber. It equals the sine of the maximum half-angle of the input cone that will be accepted and guided by the fiber. Light launched outside this cone enters the core but hits the walls at angles below θ_c, refracts out, and is lost. Light inside the cone is trapped. In telecommunications single-mode fiber (SMF-28), NA ≈ 0.14 and core diameter ≈ 9 μm — so small that only one propagation mode fits. In multi-mode fiber (used in data centers), NA ≈ 0.20 and core diameter ≈ 50 μm. Different modes travel at slightly different speeds (modal dispersion), which is why long-distance telecom uses single-mode fiber — to avoid pulse broadening over thousands of kilometers.

## The Fix

Add a TIR check: compute the angle of incidence at the wall, compare to the critical angle, and only allow refraction if below it:

```js
let n_core = 1.48;
let n_clad = 1.46;
let theta_c = Math.asin(n_clad / n_core); // critical angle
function handleWallCollision(ray) {
  let theta_i = Math.abs(ray.angle - Math.PI/2); // angle from normal
  if (theta_i > theta_c) {
    // Total internal reflection: reflect angle
    ray.angle = Math.PI - ray.angle;
  } else {
    // Partial refraction: ray escapes
    let sinT = (n_core / n_clad) * Math.sin(theta_i);
    ray.angle = Math.asin(sinT);
    ray.inFiber = false;
  }
}
```

Now rays inside the acceptance cone bounce perfectly through the fiber, including around curves, while rays launched at too steep an angle from outside escape immediately. The viewer adjusts the launch angle and watches the threshold exactly at θ_max = arcsin(NA).

## The Wow Moment — Push It

Draw a fiber bundle — 20 parallel fibers arranged in a row — and pass an image (a smiley face) through them, with each fiber carrying one pixel's worth of brightness. Bend the bundle into a U-shape and show the image reconstructed at the other end. Then demonstrate **fiber bending loss**: bend one fiber in the bundle into a tight curve with radius below the minimum bend radius — watch the evanescent field leak out at the curve and that fiber go dark. Finally, show a wavelength division multiplexing (WDM) demo: multiple colors of light enter the same fiber simultaneously, each traveling independently, and can be separated at the far end by a prism — this is how a single fiber carries 80+ phone calls simultaneously.

## The Interactive Demo

- **Launch angle** — slider 0° to 30°, controls whether light stays in fiber or leaks out
- **Core refractive index n_core** — slider 1.40 to 1.80
- **Cladding refractive index n_clad** — slider 1.38 to 1.78 (must be < n_core)
- **Fiber bend radius** — slider 0.5 cm to 10 cm, shows bending loss
- **Number of fibers in bundle** — slider 1 to 50 for the image-transfer demo
- **Show critical angle indicator** — toggle that draws the acceptance cone as a shaded wedge at the fiber input end

## Production Notes

Draw the fiber as a curved thick white band with a dark gray cladding outline. Rays inside are bright yellow-white lines that bounce at sharp angles. Rays that escape at the boundary are shown in faded orange, quickly fading to nothing. A live readout displays: n_core, n_clad, θ_c in degrees, NA, and θ_max in degrees. At the left end of the fiber, draw a cone showing the acceptance angle. Color the interior of the cone green (accepted rays) and the exterior red (rejected rays). For the image-transmission demo, use a 5×4 grid of fibers and animate a pixel-art image flowing from one end to the other along the bundle.

## Tags
`optics` `fiber-optics` `total-internal-reflection` `numerical-aperture` `waveguide` `refraction` `canvas` `beginner`

## Thumbnail

A close-up of a glowing fiber optic bundle — dozens of thin lines of light bending in a curve, all staying lit around the bend. The background is pitch black. Bold text overlay: "Light CAN Turn Corners" in cyan, with a smaller "How Fiber Optics Work" below. The glowing fiber image is visually spectacular on its own, and the bold claim in the text makes it irresistible to click.
