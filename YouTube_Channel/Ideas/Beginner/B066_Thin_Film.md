---
title: "Why Soap Bubbles Show Colors (Thin Film Interference)"
id: B066
difficulty: 2.5/10
prereq: "None"
concept: "Optical path difference 2nt·cosθ between reflections from top and bottom of thin film; constructive interference at 2nt·cosθ = mλ gives color; different thickness → different color."
tags: [optics, interference, thin-film, soap-bubble, iridescence, wavelength, canvas, beginner]
category: beginner
type: video-idea
---

# Why Soap Bubbles Show Colors (Thin Film Interference)

**Alt title:** "The Hidden Wave Physics Behind Every Soap Bubble"
**Difficulty:** 2.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

A soap bubble rendered in canvas floats slowly across a dark background. Its surface shimmers with shifting bands of colour — vivid greens and magentas cycling across the surface as it slowly rotates. The host narrates: "Soap film is transparent. It has no pigment, no dye, no chemical that absorbs light. The film itself is colourless." A close-up zoom shows the bubble wall is just a thin layer of water. "And yet there are colours. Vivid, shifting, iridescent colours. Where are they coming from?" The host then shows what happens as the bubble slowly thins over time (soap films drain due to gravity and evaporation): the colours don't fade uniformly — they cycle through a specific sequence from yellow to red to magenta to green to blue, and finally, at the very top where the film is thinnest, the surface goes perfectly black just before the bubble pops. "That black region? It's not shadow. The film is still there. And it tells us something profound about the wavelength of light." The black region and the colour sequence are the two hooks that drive the whole video.

## The Naive Attempt

The viewer writes a canvas simulation that draws a circle (the bubble) and assigns each pixel a colour based on the film thickness at that pixel. The host starts with the simplest possible model: `colour = hue(thickness)` — just map thickness directly to a rainbow gradient. This produces a circle that looks superficially colourful. The host adjusts the thickness slider and the colours shift around the gradient. "That kind of works, right? You can see colour variation." But two things are immediately wrong. First, the black-film region at near-zero thickness should be black — yet the naive hue mapping assigns it a colour (red, since 0 maps to the start of the rainbow). Second, a film of 300 nm should produce a very different colour from a film of 600 nm — constructive interference for one wavelength and destructive for another — but the naive code just linearly maps thickness to hue, which has no physical basis. The simulation doesn't know that 550 nm green light has a wavelength of 550 nanometres and that the film thickness must be compared against that specific physical scale.

## The Moment of Failure

The host sets the film thickness to approximately 150 nm in the naive model. The hue mapping produces a blue-ish colour. But the real physics: at 150 nm, the optical path difference 2nt·cosθ (with n ≈ 1.33 for water, θ ≈ 0°) gives 2 × 1.33 × 150 × 10⁻⁹ ≈ 400 nm, which is right at the violet edge of the visible spectrum — so only violet reflects constructively, and the film should look violet-ish. The naive code shows blue instead. More catastrophically: at thickness ~0 nm the naive code shows red but reality gives black (both reflections carry no phase information to interfere constructively with). At 550 nm thickness, the naive code shows yellow-green by arbitrary mapping, but physics says 2 × 1.33 × 550 nm ≈ 1465 nm optical path, which means green light (λ ≈ 488 nm at m=3) constructively interferes — giving an actual green, but for a completely different reason that the code cannot reproduce. The mapping is accidentally sometimes right and usually wrong.

## Why It Broke — The Physics

When light hits a thin film, some reflects off the top surface and some penetrates, reflects off the bottom surface, and exits back through the top. These two reflected rays have travelled different distances — the bottom-reflected ray has travelled an extra path of 2nt·cosθ (where n is the film's refractive index, t is its thickness, and θ is the refraction angle). When this **optical path difference** equals a whole number of wavelengths, the two reflections add constructively (bright colour); when it equals a half-integer number of wavelengths, they cancel destructively. The condition for constructive interference is:

**2nt·cosθ = mλ**

where m is an integer (1, 2, 3, ...). There is also a phase shift of π (half-wavelength) when reflecting off a medium with higher refractive index (air→soap), which effectively means the zero-thickness film has both reflections phase-shifted by the same amount — they cancel, giving the observed black film. To compute the colour, the host must sum the constructive/destructive conditions over all visible wavelengths (380–700 nm) for each m, compute the reflected spectrum, and then convert that spectrum to RGB.

## The One Concept

Thin-film interference is a consequence of the wave nature of light. Light is an electromagnetic wave, and two coherent waves of the same frequency either add (constructive interference) or cancel (destructive interference) depending on their phase difference. In a thin film, the two interfering waves are the top-surface reflection and the bottom-surface reflection — they originate from the same incoming photon and are therefore perfectly coherent. The key insight is that constructive interference is wavelength-specific: a film of thickness 200 nm reflects green light constructively but red light destructively, and vice versa for a slightly different thickness. As the film thickness varies spatially across the bubble surface (it is thicker at the bottom due to gravity, thinner at the top), different parts of the surface satisfy the constructive condition for different wavelengths, producing the banded colour pattern. The same phenomenon colours the wings of morpho butterflies (which have nanoscale ridges instead of pigment), oil slicks on puddles (oil on water, two different refractive indices), and anti-reflection coatings on camera lenses (a film tuned to destructively interfere with reflected light at the target wavelength, making the reflected light dark so more is transmitted).

## The Fix

The host replaces the hue-map with a physical spectrum computation. For each pixel (with a known film thickness t), a loop runs over wavelengths λ from 380 to 700 nm in 5-nm steps. For each λ, the reflection intensity is computed as `I(λ) = 1 - cos(2π * 2*n*t / λ)` (normalised interference term, accounting for the phase shift). The resulting spectrum (a 1D array of intensities vs wavelength) is then converted to RGB using a standard spectrum-to-RGB lookup table. This produces physically correct colours: near-zero thickness gives black; ~100 nm gives silver-grey; ~200 nm gives yellow; ~300 nm gives vivid green-blue; thicker films cycle through more orders of colour. The host then maps film thickness to a gradient across the bubble and renders each pixel with its correct colour — the result is strikingly beautiful and matches real soap-bubble photographs.

## The Wow Moment — Push It

The host animates a draining soap film in real time. The bubble is modelled with a thickness profile that decreases toward the top: `t(y) = t_max - α*y`. Over time, t_max slowly decreases as the film drains. The colour bands sweep upward across the bubble's surface as the film thins, cycling through the interference orders in the correct sequence: thick film (white/silver with many overlapping orders) → yellow → red → blue-green → vivid green → the black film appearing at the top and spreading downward just before the bubble pops. The pop moment is dramatised with a radial shockwave animation. The host also shows an oil-slick mode: a thin oil layer on a water-puddle background, with the oil blob having a Gaussian thickness profile — producing the realistic iridescent oil-slick pattern seen in parking lots.

## The Interactive Demo

- **Film thickness (nm):** slider 0–1200 nm (one full colour cycle visible at ~550 nm)
- **Refractive index n:** slider 1.0–2.5 (affects the colour for a given thickness; try glass n=1.5 vs water n=1.33)
- **Incidence angle θ (°):** slider 0–80° (tilting changes the optical path difference — colours shift)
- **Drain animation toggle:** starts the real-time draining simulation with colour bands sweeping upward
- **Show spectrum panel:** opens a side graph of reflected intensity vs wavelength for the current thickness, with a moving dot showing where on the visible spectrum the peak lies
- **Mode selector:** Soap bubble / Oil slick / Anti-reflection coating (each shows the relevant geometry)

## Production Notes

This video benefits enormously from rich colour rendering. The canvas simulation should use full 24-bit colour with the spectrum-to-RGB lookup (not HSL hue shortcuts). Set the bubble background to pure black so the interference colours pop. During the explanation of optical path difference, show a cross-sectional diagram of the thin film with two ray paths drawn explicitly — one reflecting at the top surface, one at the bottom — with a yellow bracket labelling the extra path 2nt·cosθ. The phase-shift-at-reflection concept should be shown as a half-cycle flip in the wave diagram: the top-surface reflected wave is drawn upside down (inverted) relative to the incident wave. Camera zoom-in onto the black film region at the end of the drain animation for maximum impact.

## Tags
`optics` `interference` `thin-film` `soap-bubble` `iridescence` `wavelength` `canvas` `beginner`

## Thumbnail

A close-up of a soap bubble rendered in rich iridescent colour — green and magenta bands clearly visible — against a pure black background. A small inset diagram in the corner shows two reflected ray paths through a thin film. Bold white text: "No pigment. No dye." Bold yellow text below: "Pure wave physics." Visually lush and striking.
