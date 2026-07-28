---
title: "Why You Can Hear Around Corners but Not See Around Them (Diffraction)"
id: B067
difficulty: 2/10
prereq: "B024"
concept: "Diffraction intensity pattern depends on λ/d (wavelength/aperture); sound wavelengths (cm to m) are comparable to everyday obstacles; light wavelengths (nm) are far smaller → negligible diffraction."
tags: [waves, diffraction, wavelength, aperture, sound, light, canvas, beginner]
category: beginner
type: video-idea
---

# Why You Can Hear Around Corners but Not See Around Them (Diffraction)

**Alt title:** "The One Number That Explains Why Sound Bends and Light Doesn't"
**Difficulty:** 2/10 | **Prereq:** B024

---

## Opening Hook (0:00–1:00)

The screen shows a top-down floor plan of a room. A speaker is around the corner — completely out of line of sight. Sound waves radiate from it, and the viewer watches the wavefronts bend around the corner and fill the entire second hallway. Music is audible everywhere. Then the host switches to a laser: a beam of light travelling from the same source. The light travels in a perfectly straight line, hits the corner wall, and stops dead. The hallway on the other side is completely dark. Same geometry, same source position, completely different behaviour. "Why does sound bend around corners but light does not?" The host holds up a ruler next to both scenarios. "The speaker produces sound at about 1 kHz — wavelength roughly 34 centimetres." The ruler matches the wall thickness: also in the tens-of-centimetres range. "The laser produces light at 500 nanometres — that's 0.0000005 metres. The wall is a billion times bigger than the light's wavelength. That ratio is everything."

## The Naive Attempt

The viewer writes a Huygens-principle simulation on canvas. Each point on a wavefront emits a small circular wave (a Huygens wavelet). The superposition of all wavelets gives the next wavefront. The host writes a simplified version: a plane wave hits a gap (aperture) in a barrier. The aperture is represented as a row of N point sources spaced λ/2 apart, each emitting a circular wave. The viewer codes these as expanding circles drawn on canvas, with intensity fading as 1/r. The total intensity at each point on the far side is the sum of all point-source contributions. The viewer first tries N = 10 sources across an aperture of width d = 10λ (aperture much wider than wavelength). They see the wave propagate mostly straight ahead — a narrow forward lobe with faint side lobes. "Good," says the host. But then the viewer notices the code doesn't actually compute wave interference — it sums intensities, not amplitudes. Summing intensities gives always-positive values and never shows the dark bands that should appear between bright interference fringes.

## The Moment of Failure

Without interference, the simulation produces a uniform bright region behind the aperture — no fringes, no dark bands, no angle-dependent variation. When the viewer narrows the aperture to d = λ (wavelength-sized gap), the naive intensity-sum still shows a roughly uniform glow. But the correct result is that a λ-sized aperture should produce a broad, approximately uniform distribution of diffracted waves spreading in all directions — the hallmark of strong diffraction. More damagingly, when the viewer sets d = 0.1λ (aperture smaller than wavelength), the naive code shows almost no light getting through (because there are almost no point sources inside the tiny aperture). The real result is that a sub-wavelength aperture actually produces the most isotropic radiation — energy spreads in all directions equally. The intensity-sum model completely inverts the physical intuition for small apertures.

## Why It Broke — The Physics

Diffraction requires computing wave **amplitude** (including sign/phase), not just intensity. Each Huygens source emits a wave with amplitude A(r, t) = A₀ cos(kr − ωt)/r, where k = 2π/λ. The total amplitude at a far-field point P is the coherent sum over all N sources, taking into account the different distances rᵢ from each source to P. The intensity is then |total amplitude|². This sum produces constructive interference in some directions and destructive interference in others. The key parameter governing the angular spread of diffraction is:

**θ_min ≈ λ/d (in radians)**

where θ_min is the angle to the first dark minimum (for single-slit diffraction, the precise value is sin θ = λ/d). When λ ≪ d, θ_min is tiny — diffraction is negligible and the wave propagates straight. When λ ≈ d or λ > d, θ_min approaches 90° or more — the wave spreads in all directions. For sound at 500 Hz (λ = 0.69 m) passing through a 0.8 m doorway: θ ≈ 0.69/0.8 ≈ 50° — very strong spreading, sound fills the next room. For green light (λ = 550 nm) passing through the same doorway: θ ≈ 550 × 10⁻⁹ / 0.8 ≈ 0.00000069 radians — completely invisible spreading, light travels straight.

## The One Concept

Diffraction is the spreading of waves past obstacles and through apertures — it occurs for all wave types (sound, light, water, electrons) and its strength is governed entirely by the ratio λ/d. When this ratio is large (wavelength comparable to or larger than the obstacle), the wave bends strongly around the obstacle. When this ratio is tiny, the wave travels in essentially straight rays (geometric optics / geometric acoustics). This is why geometric optics works well for everyday light (λ ~ 500 nm; everyday objects ~ cm to m) but fails at the scale of a diffraction grating (d ~ 500 nm), a CD (track spacing ~1.6 μm), or a human hair (~70 μm, just barely shows diffraction rings with a laser pointer). Radio waves (λ = 1 m) diffract around buildings; X-rays (λ = 0.1 nm) diffract around atomic lattice planes (this is the basis of X-ray crystallography, which revealed the structure of DNA). The single-slit diffraction intensity pattern is I(θ) = I₀ [sin(πd sinθ/λ) / (πd sinθ/λ)]² — a sinc-squared function with a central maximum and progressively weaker side lobes. The double-slit pattern (Young's experiment) adds another cosine modulation on top of this envelope.

## The Fix

The host rewrites the point-source summation to use complex amplitudes: each source contributes `A * exp(i * k * r_i)` to the total field at point P, where r_i is the distance from source i to P. In JavaScript this is done with two accumulators, `re += cos(k * r_i)` and `im += sin(k * r_i)`, and the final intensity is `re*re + im*im`. With this fix, the simulation immediately produces the correct diffraction pattern: a bright central band flanked by alternating dark and bright fringes. The viewer watches the fringes appear on screen like magic. Setting d = λ gives a broad circular spread; setting d = 100λ gives a tight forward beam with fine fringes at the edges. The ratio λ/d is now displayed live as a large number on screen, and its value perfectly predicts the visual beam width.

## The Wow Moment — Push It

The host builds a 2D wave propagation map for the whole room-with-a-corner scenario. The room floor plan is drawn on canvas. A speaker emits circular waves at 500 Hz (λ shown to scale). The Huygens simulation propagates these waves frame by frame across the entire room, including diffraction around the corner. The sound pressure map fills in over about 5 seconds of simulation, showing that sound reaches everywhere — even the "shadow" region behind the corner. Then the host replaces the speaker with a laser (λ = 500 nm) at the same grid resolution: the diffraction angle is so small that the beam travels in a razor-thin line and the shadow is almost perfect. A zoomed panel shows the tiny diffraction fringes at the very edge of the light beam (the Poisson/Arago spot concept is mentioned). Side by side, the sound map vs the light map is one of the most visually striking comparisons in wave physics.

## The Interactive Demo

- **Wavelength λ (m):** logarithmic slider from 10⁻⁹ m (X-ray) to 10 m (radio wave); labelled with wave type
- **Aperture width d (m):** logarithmic slider from 10⁻⁷ m to 10 m
- **λ/d ratio display:** large live readout that updates as sliders move, with labels: ">1: strong diffraction", "~0.01: moderate", "<0.0001: geometric optics"
- **Number of slits toggle:** single slit / double slit / diffraction grating (5 slits, 10 slits, 100 slits)
- **Slit separation (for multi-slit):** slider controls the grating constant
- **Animation speed slider:** controls how fast Huygens wavelets propagate across the canvas
- **Room-corner demo toggle:** switches to the full room scenario with corner and shows sound vs light comparison

## Production Notes

The main view is a 2D top-down wave propagation map using a colour-coded pressure field (blue negative, red positive, white zero). The aperture slit is drawn as a thick grey barrier with a gap. During the explanation of λ/d, show a split-screen: left panel has sound waves with λ = 30 cm and d = 40 cm (λ/d ≈ 0.75); right panel has light with λ = 500 nm and d = 1 mm (λ/d = 0.0005). The visual contrast between the two diffraction patterns is the most powerful moment in the video. Include a real-world photograph of a CD in white light showing the diffraction colours for comparison to the simulation.

## Tags
`waves` `diffraction` `wavelength` `aperture` `sound` `light` `canvas` `beginner`

## Thumbnail

Split screen: left side shows sound waves bending dramatically around a brick wall corner (top-down view, blue wave-pressure map), right side shows a laser beam hitting the same wall corner and stopping dead (straight red beam). Bold white text across the middle: "SAME CORNER." Yellow text at the bottom: "Two completely different universes." High contrast, dramatic.
