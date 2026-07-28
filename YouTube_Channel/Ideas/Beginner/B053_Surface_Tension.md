---
title: "Why Water Beads Up and Insects Walk on Water (Surface Tension)"
id: B053
difficulty: 2.5/10
prereq: "None"
concept: "Surface tension γ arises from cohesive forces between molecules at the surface; Young-Laplace equation ΔP = γ(1/R1 + 1/R2)"
tags: [fluids, surface-tension, young-laplace, cohesion, meniscus, water-strider, canvas, beginner]
category: beginner
type: video-idea
---

# Why Water Beads Up and Insects Walk on Water (Surface Tension)

**Alt title:** "The Invisible Skin on Every Water Surface"
**Difficulty:** 2.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The video opens with a slow-motion macro clip (or a high-quality Canvas animation) of a water strider insect skating across a still pond. Each of its six feet makes a small dimple in the water surface — the surface bends visibly but does not break. The insect weighs roughly 10 mg, and the water film it rests on has no solid surface beneath it, just more water. Then the host zooms in to a water droplet sitting on a leaf: perfectly spherical, gleaming, beading up rather than spreading flat. The same question applies to both: why does the water surface resist deformation? What is the mechanism that makes a liquid surface behave like a stretched elastic membrane? The host promises to simulate this from the molecular level up, code a water-strider weight-support calculation, and demonstrate the Young-Laplace pressure jump inside a bubble.

## The Naive Attempt

The viewer starts building a droplet simulator. Step one: represent a circular water droplet as a filled circle with radius r on a Canvas, drawn with `ctx.arc()`. Step two: write a function `internalPressure(r)` that uses the bubble formula `P = 2 * gamma / r` (for a soap film with two surfaces) or `P = gamma / r` for a water droplet's single interface. Step three: add a slider that changes the radius and displays the internal pressure. Step four: try to simulate the contact angle between the droplet and a surface by drawing the circular arc and manually setting the tangent angle. Step five: place a tiny rectangle (the "insect leg") on the water surface and try to compute the upward force by multiplying surface tension by the contact line perimeter. The naive code forgets that surface tension acts along the tangent to the surface at the contact line, so it misses the vertical component of the force.

## The Moment of Failure

When the viewer runs the insect-leg force calculation, the displayed upward force is far too large — the code is multiplying γ by the contact perimeter but using the full tension magnitude without projecting it vertically. The insect leg, modeled as a circle of radius 0.5 mm, shows an upward force of 75 µN, which would support an insect weighing 7.5 grams — a hundred times heavier than a real water strider. The contact line force must be multiplied by sin(θ) where θ is the contact angle the water surface makes with the horizontal at the line of contact. The visual on-screen shows the force arrows pointing straight up when they should be pointing diagonally inward and downward at the surface angle, with only their vertical components providing lift.

## Why It Broke — The Physics

Surface tension γ (units: N/m, or equivalently J/m²) is defined as the energy required to increase the surface area of a fluid by one square meter. It arises because molecules in the bulk of a liquid are surrounded on all sides by neighbors and have their intermolecular attractive forces satisfied. Molecules at the surface have fewer neighbors above them — they experience a net inward force. Creating more surface area means pulling more molecules to the surface, which costs energy. The Young-Laplace equation quantifies the pressure jump across a curved interface:

**ΔP = γ(1/R₁ + 1/R₂)**

where R₁ and R₂ are the two principal radii of curvature. For a sphere (like a droplet), R₁ = R₂ = R, so ΔP = 2γ/R. For a cylinder (like a jet of water), R₁ = R and R₂ = ∞, so ΔP = γ/R. The pressure inside a small droplet is higher than outside, which is why small droplets are spherical — the sphere minimizes surface area for a given volume, minimizing surface energy.

## The One Concept

Surface tension is a material property of a liquid-gas or liquid-liquid interface. For water at 20°C, γ = 0.0728 N/m. The physical picture is that the surface layer acts like a thin elastic membrane under tension, resisting any attempt to increase its area. This membrane-like behavior is not due to any actual solid membrane; it is a statistical mechanical consequence of molecular cohesion. The Young-Laplace equation is the central result: it relates the pressure difference across a curved interface to the surface tension and the interface curvature. In a soap bubble, there are two air-water interfaces (inner and outer), so the total pressure inside exceeds ambient by ΔP = 4γ/R. For a water strider, each leg dimples the water surface, and the surface tension acts along the contact perimeter. The upward force per leg is F = γ × L × sin(θ) where L is the contact line length and θ is the contact angle. With L ≈ 10 mm and θ ≈ 40°, the upward force is about 0.47 mN per leg — enough to support the 10 mg insect six times over, which explains why water striders skate so effortlessly. Surface tension also drives the formation of morning dew spheres on spider webs, the tear film on the human cornea, and the stability of emulsions in food science and pharmaceuticals.

## The Fix

Correct the force calculation by projecting the surface tension vector onto the vertical:

```javascript
const gamma = 0.0728;           // N/m (water at 20°C)
const contactLength = 2 * Math.PI * legRadius;  // m
const contactAngle = Math.PI / 4;  // 45° in radians
const F_up = gamma * contactLength * Math.sin(contactAngle);  // N
const weight = mass * 9.81;     // N
const canFloat = F_up >= weight;
```

Now reduce the contact angle to 0° (perfectly flat surface contact) and watch the upward force collapse to zero — confirming that a hydrophobic leg that makes a 90° contact angle would be fully supported, while a 0° angle provides none. The simulation is now physically accurate.

## The Wow Moment — Push It

Animate a soap bubble merger: two bubbles of different radii touch. Because the smaller bubble has higher internal pressure (ΔP = 2γ/R — larger for smaller R), it blows into the larger bubble, shrinking while the larger one grows. Render this with circles that update their radii in real time based on the pressure equilibrium equation, producing a visually striking size inversion. Then show a liquid bridge: two plates connected by a thin water cylinder, and animate the Rayleigh-Plateau instability where the cylinder breaks into droplets.

## The Interactive Demo

- **Droplet radius slider** (0.1–5 mm): shows ΔP = 2γ/R updating in real time.
- **Surface tension slider** (0.01–0.073 N/m): from soapy water to pure water.
- **Contact angle slider** (0°–180°): demonstrates hydrophilic vs hydrophobic surfaces.
- **Insect mass slider** (1–100 mg): shows whether the water strider sinks or floats.
- **Show curvature overlay toggle**: colors the droplet surface by local curvature magnitude.

## Production Notes

Use a dark background with bright blue fluid to make the surface tension effects visually pop. When deriving Young-Laplace, animate the surface curving and label the two radii R₁ and R₂ with spinning arcs. The soap bubble merger should run at 60 fps in the canvas animation. Include a 2-second slow-motion replay of the bubble merger at the end of the Wow Moment. Use a zoom-in animation to the molecular level when explaining cohesion — cartoon molecules with directional force arrows pointing inward for surface molecules.

## Tags
`fluids` `surface-tension` `young-laplace` `cohesion` `meniscus` `water-strider` `canvas` `beginner`

## Thumbnail

A photorealistic water strider (or detailed Canvas drawing) skating on water with visible dimples under each foot. The water surface is rendered with a slight blue-green shimmer. Large bold text: "WALKING ON WATER — THE PHYSICS." A small inset circle in the corner shows the Young-Laplace equation ΔP = 2γ/R in white on black. The contrast between the fragile insect and the seemingly solid water surface is the stop-scroll moment.
