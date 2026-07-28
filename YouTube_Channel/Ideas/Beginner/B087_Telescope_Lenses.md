---
title: "Building a Telescope From the Lens Maker's Equation"
id: B087
difficulty: 2.5/10
prereq: "B013_Thin_Lens"
concept: "Lensmaker's equation 1/f = (n-1)(1/R₁ - 1/R₂); telescope: objective (large f) forms real image → eyepiece (small f) magnifies it; magnification M = f_obj/f_eye."
tags: [optics, lenses, lensmakers-equation, telescope, focal-length, magnification, canvas, beginner]
category: beginner
type: video-idea
---

# Building a Telescope From the Lens Maker's Equation

**Alt title:** "One Equation That Built Every Telescope in History"
**Difficulty:** 2.5/10 | **Prereq:** B013_Thin_Lens

---

## Opening Hook (0:00–1:00)

The video opens on a schematic of Galileo's telescope — two lenses, a tube, a few centimeters long — then pans to the Hubble Space Telescope. The host says: "Both of these are the same device. One lens collects light and forms an image. A second lens magnifies it. And the magnification — the power of the whole system — is just the ratio of two numbers: the focal length of the first lens divided by the focal length of the second. That's it. No dark matter, no quantum mechanics. Just the lensmaker's equation, written down in 1621 by Willebrord Snellius, rederived by Descartes, and still used by every optician alive today. Let's build a working telescope simulator from scratch."

## The Naive Attempt

The viewer draws two vertical lines on the canvas to represent lenses, and tries to trace a ray by simply deflecting it at each line by a fixed angle — the same angle for every ray, regardless of where it hits the lens. They set the deflection for the first lens to aim rays toward a point 300 px to the right (the focal point), and for the second lens to aim rays toward the eye. The resulting picture shows rays converging and then diverging again, which looks vaguely telescope-like, but the magnification is always the same no matter what the "lens radii" are — because the simulation doesn't actually compute focal lengths from lens geometry. Changing the virtual lens curvature does nothing.

```js
// Naive: fixed deflection angle regardless of lens shape
function deflectRay(ray, lensX) {
  ray.angle = fixedDeflection; // wrong — ignores lens geometry
}
```

## The Moment of Failure

The viewer tries to change the eyepiece shape — making it "flatter" or "more curved" — but the magnification never changes. The simulation is disconnected from the physical lensmaker's equation. Any real optician could tell you that a more curved eyepiece lens has a shorter focal length and gives more magnification, but the naive code knows nothing about that relationship. The viewer also notices the simulated image is not inverted the way a real astronomical telescope's image is.

## Why It Broke — The Physics

The focal length of a lens in air is given by the **Lensmaker's Equation**:

**1/f = (n − 1) · (1/R₁ − 1/R₂)**

where n is the glass refractive index, R₁ is the radius of curvature of the first surface (positive if center of curvature is to the right), and R₂ is the radius of curvature of the second surface. Once f is known, the **thin lens equation** gives the image distance: **1/d_o + 1/d_i = 1/f**. For a telescope, an infinitely distant object (d_o → ∞) produces a real image at the objective's focal plane (d_i = f_obj). The eyepiece is placed so this image falls at its front focal point — making the rays from the eyepiece parallel for a relaxed eye. The angular magnification is then **M = −f_obj / f_eye**, with the negative sign indicating image inversion.

## The One Concept

The **Lensmaker's Equation** connects glass geometry (curvature radii R₁, R₂) and material (refractive index n) to optical power (1/f). Optical power P = 1/f is measured in diopters (m⁻¹). A strongly curved lens (small R₁, R₂) has a short focal length and high power; a gently curved lens has a long focal length and low power. This is precisely what allows an optician to grind a specific curvature into glass to achieve a prescribed correction. For a telescope, the design goal is to have f_obj >> f_eye. The objective collects light from a wide area (large diameter and f_obj) and concentrates it into a real, inverted, diminished image at the focal plane. The eyepiece then acts as a magnifying glass — it refracts the diverging rays from this real image back into parallel (or near-parallel) rays, which the eye then focuses onto the retina as a magnified, virtual image at infinity. The total angular magnification experienced by the observer is M = θ_eye / θ_naked, and for a two-lens afocal system this simplifies to the ratio of focal lengths. A 1000 mm objective with a 10 mm eyepiece gives 100× magnification — the Moon fills 100× more of your visual field than with the naked eye.

## The Fix

Compute f from the lensmaker's equation and use the thin lens ray-deflection formula that depends on height y above the optical axis:

```js
function computeFocalLength(n, R1, R2) {
  return 1 / ((n - 1) * (1/R1 - 1/R2));
}
function deflectRay(ray, lensX, f) {
  let y = ray.y; // height where ray hits lens
  // Thin lens: ray slope changes by -y/f
  ray.slope += -y / f;
}
// Telescope setup:
let fObj = computeFocalLength(nGlass, R1obj, R2obj); // e.g. 600 px
let fEye = computeFocalLength(nGlass, R1eye, R2eye); // e.g. 30 px
// Place eyepiece at fObj + fEye from objective
let eyepieceX = objectiveX + fObj + fEye;
```

Now the magnification automatically equals `fObj / fEye`, and the viewer can independently control R₁ and R₂ of each lens to see exactly how curvature determines power.

## The Wow Moment — Push It

Build a full multi-lens raytracing sim showing five parallel rays entering the objective, converging to a focal point, then re-expanding until they hit the eyepiece, then exiting as parallel rays again. Show the inverted intermediate image at the focal plane as a small labeled marker. Then let the viewer slide the eyepiece position — when moved too far or too close, the exiting rays are not parallel and the image appears blurry in the eye. Demonstrate a Galilean telescope (diverging eyepiece): the exiting rays are parallel and the image is upright — show the geometry of how a concave eyepiece placed before the focal plane achieves this, and why opera glasses use it.

## The Interactive Demo

- **Objective R₁, R₂** — sliders −500 to +500 px radius, compute f_obj live
- **Eyepiece R₁, R₂** — sliders −200 to +200 px radius, compute f_eye live
- **Glass refractive index n** — slider 1.4 to 2.0 for both lenses
- **Eyepiece position** — slider to slide eyepiece along optical axis, shows focus quality
- **Number of traced rays** — slider 1 to 10 parallel input rays
- **Galilean / Keplerian toggle** — switch eyepiece from convex to concave, flipping image orientation

## Production Notes

Draw the canvas with a horizontal optical axis. Lenses are rendered as the actual lens profile shape — a biconvex, plano-convex, or concavo-convex shape determined by R₁ and R₂. Show a live readout box: "f_obj = X px, f_eye = Y px, Magnification = Z×". Rays are colored by their entry height — red for the outermost ray, yellow for mid, white for the axial ray. When rays converge to the focal point, add a bright white glow dot there labeled "Real Image." The eye symbol at the end shows where the observer's eye sits, and a dotted line shows the virtual image location.

## Tags
`optics` `lenses` `lensmakers-equation` `telescope` `focal-length` `magnification` `canvas` `beginner`

## Thumbnail

Side-by-side: left shows the night sky with a small moon, right shows the same moon filling the entire frame. Between them, a stylized orange lens diagram. Bold text: "f_obj / f_eye — One Equation, 100× Magnification." The dramatic before/after size contrast of the Moon is immediately eye-catching and the equation text signals the physics content clearly.
