---
title: "Huygens' Principle: Every Point on a Wave Is a New Source"
id: B086
difficulty: 2/10
prereq: "B024_Wave_Basics"
concept: "Each point on a wavefront acts as a secondary spherical source; the envelope of these secondary wavelets gives the new wavefront; correctly predicts diffraction, reflection, and refraction."
tags: [waves, huygens-principle, wavefront, diffraction, reflection, refraction, canvas, beginner]
category: beginner
type: video-idea
---

# Huygens' Principle: Every Point on a Wave Is a New Source

**Alt title:** "Huygens Said Every Point Is a Source — He Was Right About Everything"
**Difficulty:** 2/10 | **Prereq:** B024_Wave_Basics

---

## Opening Hook (0:00–1:00)

The video opens on a Canvas showing a flat plane wave — a row of parallel wavefronts moving to the right — approaching a wall with a small hole in it. The viewer expects the wave to pass through the hole and continue as a narrow beam. Instead, when it reaches the hole, the wave fans out in a perfect semicircle on the other side, flooding the entire shadow region. The host says: "This is diffraction. And in 1678, Christiaan Huygens explained it with a single rule so simple it sounds obvious: every point on a wave is itself a new wave source. With that one sentence, he predicted reflection, refraction, and diffraction — and he was right about all three. Let's build it."

## The Naive Attempt

The viewer starts with the obvious model: a wave is a moving line. They advance a flat wavefront across the canvas by moving a horizontal line to the right each frame. When it hits a barrier with a gap, they clip the line to pass only through the gap and continue the straight segment forward. The wave "beam" continues as a rectangle of the same width as the gap — no spreading, no bending into the shadow region.

```js
// Naive: advance wavefront as a straight line
wavefrontX += waveSpeed * dt;
// At barrier: clip to gap only
if (wavefrontX >= barrierX) {
  drawLine(gapStart, gapEnd); // flat front through gap only
}
```

The wave travels through the gap and continues in a column. Nothing bends. Objects in the shadow behind the barrier are not reached by any wave energy.

## The Moment of Failure

The simulation shows a sharp-edged rectangular wave beam passing through the gap with perfectly straight edges. But in real life — and in a ripple tank — a wave passing through a narrow gap fans out dramatically. Sound bends around corners (you can hear around a wall). Radio waves reach you inside buildings despite there being no direct line of sight to the tower. Light diffracts through a single slit and produces a spread-out pattern, not a beam of the slit's exact width. The ray-optics / straight-wavefront model fails completely for any wave phenomenon involving apertures smaller than several wavelengths.

## Why It Broke — The Physics

The wave equation is a linear partial differential equation: **∂²u/∂t² = c² ∇²u**. Its solutions obey superposition. Huygens' principle emerges naturally from the Green's function solution of the wave equation: the field at any future point and time is a superposition of contributions from all points on any earlier wavefront. Each such contribution is a spherical (or in 2D, circular) wavelet. Mathematically:

**u(P, t) = ∫∫_Σ G(P, Q, t − τ) · u(Q, τ) dΣ**

where G is the Green's function (the field at P due to a point source at Q). In practice: pick any wavefront Σ, place a circular secondary source at every point on it, let each emit a wavelet of radius c·Δt, and the envelope of all those wavelets is the new wavefront. The envelope is where all the wavelets constructively interfere. In shadow regions, the wavelets from different points partially cancel — but not perfectly, which is why some wave energy leaks into the geometric shadow (diffraction fringes).

## The One Concept

**Huygens' Principle** is the statement that every point on a propagating wavefront acts as the source of secondary spherical wavelets. The new wavefront at time t+dt is the common tangent surface (envelope) of all these secondary wavelets. This principle, proposed by Huygens in 1678 and made mathematically rigorous by Fresnel in 1818 (Huygens-Fresnel principle), correctly predicts the following phenomena without any additional assumptions. For **reflection**: draw wavelets from a flat wavefront hitting a mirror at an angle; their envelope is a new flat wavefront leaving at the same angle — law of reflection. For **refraction**: in the slower medium, wavelets expand at speed c₂ < c₁, so the envelope tilts — Snell's law follows automatically. For **diffraction**: at a narrow aperture, only the wavelets from points within the aperture are emitted; their envelope fans out in all directions behind the aperture, reaching the geometric shadow. The narrower the aperture relative to the wavelength, the more the wavefront fans out — a gap of width a produces a central diffraction lobe of angular half-width θ ≈ λ/a. Huygens' principle is not just a mnemonic — it is a computational algorithm for wave propagation, still used in medical ultrasound imaging (synthetic aperture techniques) and in seismic imaging today.

## The Fix

Replace the advancing-line model with a proper Huygens wavelet simulation:

```js
function propagateHuygens(wavefront, dt) {
  let newWavelets = [];
  for (let point of wavefront) {
    newWavelets.push({
      cx: point.x, cy: point.y,
      radius: 0, maxRadius: waveSpeed * dt
    });
  }
  // Draw all wavelets as circles, then find their envelope
  for (let w of newWavelets) {
    ctx.beginPath();
    ctx.arc(w.cx, w.cy, w.maxRadius, 0, 2*Math.PI);
    ctx.stroke();
  }
  // New wavefront = tangent line to leading edge of all circles
  return findEnvelope(newWavelets);
}
```

With this approach, passing a flat wavefront through a narrow gap now fans out into a semicircle. Passing through a wider gap gives a flat central region with curved edges — a visual match to real ripple tank photographs.

## The Wow Moment — Push It

Show all three phenomena in sequence in a split-screen: (1) reflection off a tilted wall — the secondary wavelets build up a wavefront bouncing at the correct angle; (2) refraction at a medium boundary — the wavelets in the slow medium are smaller, tilting the new front by exactly Snell's law; (3) diffraction through a slit that the viewer can narrow in real time — watch the fan angle grow as the slit narrows. Finally, show two slits and watch the wavelet envelopes from each slit interfere, producing the famous double-slit bright and dark fringes — Young's experiment derived directly from Huygens' principle.

## The Interactive Demo

- **Number of Huygens sources per wavefront** — slider 2 to 100, shows granularity of the construction
- **Aperture width** — slider 0.5λ to 10λ, controls diffraction angle
- **Number of slits** — toggle 1 / 2 / 5 slits
- **Wavefront shape** — toggle flat / circular / angled incoming wavefront
- **Show wavelets** — toggle individual secondary circles on/off
- **Show envelope only** — toggle to hide wavelets and show only the resulting new wavefront

## Production Notes

Use a dark blue canvas background with bright white circles for the wavelets and a glowing cyan line for the envelope/new wavefront. The wall/barrier is a solid gray rectangle. Animate the wavelet expansion in slow motion so each secondary circle grows visibly from its source point. Use a time slider to scrub the animation backward and forward. When showing the envelope, briefly highlight the leading tangent line before drawing it. For the two-slit demo, shade constructive interference regions green and destructive interference regions dark red.

## Tags
`waves` `huygens-principle` `wavefront` `diffraction` `reflection` `refraction` `canvas` `beginner`

## Thumbnail

A clean dark canvas showing a flat wave on the left, then dozens of expanding semicircles bursting through a narrow slit on the right. The semicircles are glowing cyan on black. Bold white text: "Every Point Is a Wave Source" with "Huygens (1678)" in smaller text below. The image looks almost like a physics textbook diagram brought to life — clear, striking, and visually self-explanatory.
