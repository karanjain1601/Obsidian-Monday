---
title: "Why Sound Goes 5× Faster Underwater"
id: B063
difficulty: 2/10
prereq: "B024"
concept: "Sound speed c = √(B/ρ) where B is bulk modulus; water has ~15,000× higher bulk modulus than air despite being 800× denser → net 5× faster; also faster in solids."
tags: [acoustics, sound-speed, bulk-modulus, density, underwater, wave-propagation, canvas, beginner]
category: beginner
type: video-idea
---

# Why Sound Goes 5× Faster Underwater

**Alt title:** "Water Is Denser — So Why Does Sound Travel Faster Through It?"
**Difficulty:** 2/10 | **Prereq:** B024

---

## Opening Hook (0:00–1:00)

The screen shows an underwater scene: a submarine pings sonar, and the circular pressure wave expands visibly across the canvas at a certain speed. Then the canvas pans to show the same pulse propagating through open air — and the air pulse is crawling by comparison, moving at barely one-fifth the speed. The host narrates: "Water is 800 times denser than air. If you think denser means slower — because more mass resists being pushed — you'd predict sound should be slower underwater. That's the intuition most people have. And it's spectacularly wrong." The numbers appear on screen: 343 m/s in air, 1480 m/s in water. A quick mental calculation: 1480/343 ≈ 4.3× faster. "So what's going on? The answer is not about density at all — it's about stiffness. And understanding it will also tell you why you can hear a train through the rails long before you hear it through the air." The simulation then shows a pressure pulse simultaneously fired from the same source through air, water, and steel — and the steel pulse arrives almost ten times before the air one.

## The Naive Attempt

The viewer writes a simple 1D wave simulation on canvas. A row of dots represents particles in a medium. The host writes an update loop: each particle is connected to its neighbours by springs, and `F = -k_spring * (x - x_eq)` drives each particle's acceleration. The viewer can set the spring constant and the particle mass. For air they pick k_spring = 100 and mass = 1 (arbitrary units); the wave propagates at a certain speed they measure by timing how many frames the wavefront takes to cross the canvas. Then they switch to "water" by making mass = 800 (denser) and keeping k_spring = 100. The wave crawls — it's now 28× slower. The host says: "See? Denser = slower. Seems logical." But the real-world observation is the opposite. The naive model is wrong because it treats both materials as having the same stiffness (same spring constant), when in fact water is enormously stiffer than air.

## The Moment of Failure

The naive model gives water a wave speed of approximately 343 / √800 ≈ 12 m/s relative to the air's 343 m/s. The host runs both simulations side by side on screen: the air-wave pulse crosses the canvas in 2 seconds (simulation time); the water-wave pulse barely moves, covering only a fraction of the distance in the same period. The text overlay shows the predicted speeds: air 343 m/s, water ~12 m/s. Then the host overlays the real measured values next to the predictions — the gap is enormous, off by a factor of ~120. A question mark appears in red next to the water speed. "The density argument alone can't explain this. We're missing something huge."

## Why It Broke — The Physics

The missing ingredient is the **bulk modulus** B, which measures how much pressure you need to apply to compress a given material by a given fraction of its volume. Formally, B = −V(dP/dV), with units of Pascals. A high bulk modulus means the material strongly resists compression — it snaps back very forcefully when disturbed. This is exactly the "spring stiffness" of the medium for longitudinal waves. The wave speed formula for any fluid is:

**c = √(B/ρ)**

For air: B_air ≈ 142,000 Pa, ρ_air = 1.2 kg/m³ → c = √(142,000/1.2) ≈ 344 m/s. For water: B_water ≈ 2.2 × 10⁹ Pa, ρ_water = 1000 kg/m³ → c = √(2.2×10⁹/1000) ≈ 1483 m/s. Water's bulk modulus is about 15,500 times larger than air's, while its density is only 833 times larger. The stiffness wins: √(15500/833) ≈ 4.3. That's exactly the observed 5× factor. Water is so much harder to compress than air that this utterly overwhelms the density penalty.

## The One Concept

The bulk modulus is the material's resistance to volumetric compression. Imagine squeezing a sponge versus squeezing a steel ball: both are "dense-ish" objects, but the steel ball resists compression enormously more. Sound is fundamentally a propagating compression wave — it needs the medium to compress and then spring back. The stiffer the spring (higher B), the faster the wave; the heavier the mass (higher ρ), the slower the wave. The formula c = √(B/ρ) is the wave-on-a-spring formula in disguise: wave speed = √(restoring force constant / inertia). For gases, the bulk modulus equals γP (the ratio of specific heats times the ambient pressure), which is why temperature affects sound speed in air (hotter air → higher P → higher c). For liquids and solids, B is determined by the inter-molecular bond strength — which for water's hydrogen-bond network is extremely high despite the low molecular mass. For solids, the formula becomes more complex (longitudinal modulus replaces bulk modulus) but the principle is identical: steel at E ≈ 200 GPa gives c_steel ≈ √(200×10⁹/7800) ≈ 5060 m/s — about 15× faster than air.

## The Fix

The host updates the simulation to have two independent parameters: `springConstant` (representing bulk modulus) and `particleMass` (representing density), both exposed as sliders. For air: springConstant = 142000, mass = 1.2. For water: springConstant = 2,200,000,000, mass = 1000. Because the canvas simulation uses scaled units, the host normalises both by the air value and just tracks the ratio. The wave speed display now reads `v = Math.sqrt(springConstant / particleMass) * scaleFactor` and the measured simulation speed matches the theoretical prediction. Water's wave now screams across the canvas 4.3× faster than air's, matching reality.

## The Wow Moment — Push It

The host builds a medium comparison race: four vertical channels on screen — air, water, oak wood, and steel — each with an identical pressure pulse fired simultaneously from the left edge. A timer counts frames. The steel pulse arrives first (5060 m/s equivalent), then oak (~3800 m/s), then water (~1480 m/s), then air (343 m/s) — arriving so late that the others have already reflected off the right wall and are heading back. The host then adds temperature control for the air channel, showing that at 0°C air slows to 331 m/s and at 100°C it reaches 387 m/s. Finally, the host zooms into the particle level in each medium, showing how rapidly (high B, high c) or sluggishly (low B) the disturbance passes from particle to particle.

## The Interactive Demo

- **Medium selector:** Air, Water, Steel, Oak, Hydrogen gas — presets B and ρ
- **Temperature slider (°C):** −50 to 200°C — only affects gas channels (modifies B = γP via ideal gas law)
- **Custom B (Pa) slider:** 10⁴ to 10¹¹ Pa (logarithmic)
- **Custom ρ (kg/m³) slider:** 0.1 to 10,000 kg/m³ (logarithmic)
- **Race mode toggle:** fires simultaneous pulses through all four preset media and races them across the canvas
- **Particle view toggle:** switches between continuous wave view and discrete particle-spring view

## Production Notes

Use a wide horizontal canvas for the race mode so all four media are clearly visible simultaneously. During the explanation of bulk modulus, animate a small cube being squeezed by two arrows: the cube barely dents for water/steel, but visibly collapses for air, with a stiffness label appearing dynamically. Include an audio demonstration: play an actual underwater recording with strong low-frequency content to contrast with the thin quality of sound in air. The particle-spring view should colour-code each spring by compression level (blue = stretched, red = compressed) to make the wave front vivid and intuitive.

## Tags
`acoustics` `sound-speed` `bulk-modulus` `density` `underwater` `wave-propagation` `canvas` `beginner`

## Thumbnail

A diver underwater with a large "1480 m/s" badge on the left, and above the water line a smaller "343 m/s" badge on the right. A dramatic lightning-bolt arrow points from the underwater label showing it shooting past. Bold white text at the top: "5× FASTER — but WHY?" Deep blue water gradient, high contrast, no clutter.
