---
title: "Why Sunglasses Block Glare (Polarization of Light)"
id: B065
difficulty: 2/10
prereq: "None"
concept: "Transverse wave polarization states; Brewster's angle θ_B = arctan(n2/n1) reflects only s-polarized light (glare from horizontal surfaces); Malus's law I = I₀cos²θ."
tags: [optics, polarization, brewsters-angle, malus-law, glare, sunglasses, canvas, beginner]
category: beginner
type: video-idea
---

# Why Sunglasses Block Glare (Polarization of Light)

**Alt title:** "The Hidden Trick Inside Every Pair of Polarized Sunglasses"
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The screen shows a simulation of sunlight hitting a lake. The reflected light off the water surface is dramatically bright — a glare effect that fills the right half of the screen. A pair of virtual sunglasses slides in from the top. The moment the glasses are positioned over the scene, the glare vanishes almost completely, revealing clear blue water beneath. The host narrates: "Those glasses didn't just dim the light. They selectively blocked light that was vibrating in one direction while letting through light that was vibrating in the perpendicular direction. This is polarization — and the fact that reflected glare just happens to vibrate horizontally while your lenses block horizontal light is not an accident. It's physics." The camera then zooms into the surface of the water, showing a wave oscillation diagram: randomly oriented oscillating arrows (unpolarized sunlight) hitting the surface, and only horizontally-oriented oscillation arrows coming off it in the reflection. The selective nature of the reflection is the entire mystery the video will unpack.

## The Naive Attempt

The viewer writes a canvas animation that shows a sinusoidal transverse wave travelling to the right. An oscillation direction (the electric field direction) is drawn as a vertical arrow at each crest. The viewer adds a "polarizing filter" — a rectangle with vertical slits drawn on it. When the wave hits the filter, it passes through unchanged because the wave oscillation is aligned with the slits. The viewer then rotates the filter 90° (horizontal slits) and the wave is completely blocked. "Perfect — I've built polarization." But then the host asks: "Now add a second filter at 45° after the first vertical filter." The viewer adds it, expecting the wave to be partially blocked. Their code currently models polarization as a binary on/off based on alignment angle — so a 45° filter, which is neither perfectly aligned nor perpendicular, gives an undefined or arbitrary result. The code either fully blocks or fully transmits, with no intermediate case. That's wrong.

## The Moment of Failure

With the binary filter model, the host places two filters: the first is vertical (0°), the second is at 45°. The output should be 50% intensity (cos²45° = 0.5). But the naive code treats the 45° filter as "not aligned → fully blocked," so the output intensity is zero. Then the host adds a third filter at 90° after the 45° one. The output should be 25% intensity (cos²45° × cos²45° = 0.25). But the binary model gives zero. The spectacular failure: the host places three filters at 0°, 45°, and 90°. In the real world, three filters produce dimmer but non-zero output. In the naive binary code, three filters produce zero — and so does two filters. The model cannot distinguish between 2 and 3 filters in series, which is nonsensical. The real phenomenon (light making it through three filters) is one of the most counterintuitive results in optics.

## Why It Broke — The Physics

The binary model missed **Malus's Law**: when polarized light of intensity I₀ passes through a polarizing filter whose transmission axis makes an angle θ with the light's polarization direction, the transmitted intensity is:

**I = I₀ cos²θ**

For θ = 0°: I = I₀ (full transmission). For θ = 90°: I = 0 (full block). For θ = 45°: I = 0.5 I₀. The three-filter paradox (0°, 45°, 90°) resolves because the 45° filter re-polarizes the light at 45°, so the final 90° filter makes an angle of only 45° with the now-45°-polarized light, giving another 50% transmission: total output = 0.5 × 0.5 = 25%. Without the intermediate filter, the 0°→90° pair gives cos²90° = 0, which is why adding a filter increases transmitted intensity — genuinely counterintuitive. Brewster's angle θ_B = arctan(n₂/n₁) is the specific angle of incidence at which reflected light becomes completely s-polarized (electric field perpendicular to the plane of incidence). For the water-air interface (n_water ≈ 1.33): θ_B = arctan(1.33) ≈ 53°. The sun is often near this elevation, which is why glare off water surfaces is so strongly polarized.

## The One Concept

Light is a transverse electromagnetic wave — the electric field oscillates perpendicular to the direction of propagation. Unpolarized light has oscillations in all orientations simultaneously (or randomly, in a rapidly rotating sense). A linear polarizer transmits only the component of the electric field aligned with its transmission axis. If the field is at angle θ to the axis, the transmitted amplitude is E₀cosθ, and since intensity goes as the square of amplitude, I = I₀cos²θ — Malus's Law. Circular polarization is when the field direction rotates at the wave frequency (like a corkscrew); elliptical polarization is the general case. Glare from horizontal surfaces is almost entirely s-polarized (horizontally oscillating) because at Brewster's angle only this component reflects strongly; the p-polarized component is almost entirely transmitted into the water. Polarized sunglasses have their transmission axis oriented vertically, which is perpendicular to the s-polarized glare, so the glare is strongly attenuated while non-polarized sky and scene light is only dimmed by 50%. LCD screens also use polarization: the display sandwiches liquid crystal between two polarizing films to control pixel brightness.

## The Fix

The host replaces the binary filter model with Malus's Law: `intensity *= Math.cos(theta) ** 2` at each filter, where `theta` is the angle in radians between the incoming polarization direction and the filter's transmission axis. After passing through a filter, the polarization direction is updated to match the filter's axis: `polarizationAngle = filterAngle`. With this fix, the three-filter paradox produces 25% output as expected. The Brewster's angle glare is modelled by assigning the reflected ray 100% s-polarization when the incidence angle equals arctan(n₂/n₁): `if (Math.abs(incidenceAngle - BrewsterAngle) < 0.05) { sPolarFraction = 1.0; }`. A vertical-axis polarizing filter then attenuates this by cos²90° = 0, completely killing the glare.

## The Wow Moment — Push It

The host builds a full glare-removal demo: a wide lake scene with the sun at Brewster's angle (adjustable via slider). Reflected glare shimmers on the water surface. A pair of sunglasses with rotatable polarization angle (shown as a dial overlay) can be spun from 0° to 180°. At 90° to the glare polarization, the lake surface becomes completely clear — fish and rocks visible below the surface. At 0°, the glare is maximum. The host then rotates past 90° and the glare comes back. A secondary panel shows the three-filter paradox demo: two fixed filters at 0° and 90° (output = 0), then a draggable middle filter whose angle can be swept — as it sweeps from 0° to 45° to 90°, the output intensity traces a sin²(2θ)/4 curve with a maximum at 45°, live on screen.

## The Interactive Demo

- **Filter 1 angle (°):** slider 0–180°
- **Filter 2 angle (°):** slider 0–180° (add/remove button)
- **Filter 3 angle (°):** slider 0–180° (add/remove button)
- **Incident light type:** Unpolarized, Horizontal, Vertical, Circular (toggle)
- **Brewster's angle demo toggle:** switches to the lake-glare scene with a rotatable sunglass filter
- **n₁ / n₂ material selector:** Air/Water, Air/Glass, Water/Glass — updates computed Brewster angle and displays it
- **Output intensity meter:** large numerical readout and circular gauge showing 0–100% transmission

## Production Notes

The main animation is a top-down view of a laser beam (narrow line) passing through filter rectangles drawn with hatching lines indicating transmission axis. Intensity is shown by the brightness of the beam colour. During Malus's Law explanation, show the electric field vector decomposed into parallel and perpendicular components at the filter, with the perpendicular component dimming and disappearing. The glare demo should use actual photo-style rendering of a lake to be visually striking. Insert a real-world B-roll style: draw a fishing scene where the angler with polarized glasses can see the fish underwater, while without them the glare blocks the view.

## Tags
`optics` `polarization` `brewsters-angle` `malus-law` `glare` `sunglasses` `canvas` `beginner`

## Thumbnail

Two side-by-side lake photos: left shows blinding white glare off water; right shows crystal-clear water with fish visible below the surface. A large sunglasses icon overlays the dividing line. Bold text at the top: "PHYSICS OF POLARIZED LENSES" and bottom text in yellow: "The glare just... disappears." Dramatic, clean, high contrast.
