---
title: "Converging and Diverging Lenses: Building an Optical Simulator"
id: B013
difficulty: 2/10
prereq: "B011 — Why a Straw Looks Broken in Water (Snell's Law)"
concept: "Thin lens equation — 1/f = 1/do + 1/di, magnification m = -di/do"
tags: [physics, optics, lens, thin-lens, magnification, image-formation, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Converging and Diverging Lenses: Building an Optical Simulator

**Alt title:** "One Lens, Two Superpowers: Burning Paper and Giant Text"
**Difficulty:** 2/10 | **Prereq:** B011 — Why a Straw Looks Broken in Water (Snell's Law)

---

## Opening Hook (0:00–1:00)

Hold a large magnifying glass up to a sunny window. Position it so the focused spot of sunlight burns a tiny glowing dot on a white piece of paper — a converging lens focusing parallel rays from the sun (nearly at infinity) to the focal point. Now flip the paper away and look through the magnifying glass at a printed page right beneath it, much closer than the focal length. The text appears enormous and right-side-up. The same lens: two completely different behaviors, depending only on how far the object is from the lens. No change to the lens, no twisting adjustment — just object distance. Cut to asking: "How does a hunk of glass know what to do with light?" Show the two configurations side by side on screen: object at infinity → focused point behind lens; object close → large virtual image. Then say: "There's one equation that predicts both, every configuration, every focal length. The thin lens equation. Let's code it." This hook has strong visual impact (the burning focal point is universally compelling) and directly poses the puzzle that the episode resolves.

## The Naive Attempt

Open the code editor. Define a thin lens as a vertical line at x = 400 pixels on the canvas. Place an object (an upward-pointing arrow) at x = 100. The first intuition: light from the object passes through the lens and bends to a single fixed focal point at x = 550 (focal length f = 150 pixels). Draw the three principal rays but map all three to the same focal point regardless of object position. This is the "fixed focal point" model — simple, visually appealing, and used in dozens of introductory diagrams. The code takes parallel rays (from the tip of the arrow) and bends them all toward the fixed point. Image appears at x = 550, always, regardless of where the object is. Now drag the object closer — to x = 300. The rays still converge at x = 550. Drag it even closer, past x = 250. Still x = 550. The image position never changes. This is already suspicious — in a real camera, you turn a focus ring to compensate for different object distances. The naive model suggests you would never need to refocus. Everything at any distance focuses identically. This feels wrong. The bug is not immediately obvious because the model does produce an image — it just produces the wrong image.

## The Moment of Failure

Reveal the failure concretely: add a "sharpness" metric. For an object at a given do, the true image distance is di = f·do/(do - f). If the naive model always places the image at x_naive = f + lens_x, the discrepancy |di_true - di_naive| in pixels is visible on screen. For an object at do = 600 px (far away), f = 150: di = 150 × 600 / (600 - 150) = 200 px — model says 150, error = 50 px. For do = 200 px: di = 150 × 200 / (200 - 150) = 600 px — model says 150, error = 450 px. Show this as a "blur radius" visualization — the rays that should converge at 600px are still being drawn through x = 550, so they cross at a slightly wrong point and form a blurry disk (the circle of confusion) on a "sensor" plane. The camera using this model is perpetually out of focus for nearby objects. Add a camera sensor plane that the viewer can move, and show how there is no position of the sensor where the image is sharp — because the model predicts the wrong di for the given do.

## Why It Broke — The Physics

The naive model commits the error of thinking the lens always bends light to the same physical point in space. In reality, the lens bends light so that rays from a given object point converge at the image point — and the image point moves as the object moves. The thin lens equation derives from the geometry of refraction at two spherical surfaces (front and back of the lens), combined with the small-angle approximation (sin θ ≈ θ — the "thin" in thin lens). The result:

**1/f = 1/do + 1/di**

Where do is the object distance (positive in front of the lens), di is the image distance (positive behind for a real image, negative in front for a virtual image), and f is the focal length (positive for a converging lens, negative for a diverging lens). Magnification is:

**m = -di / do**

Negative magnification means inverted image. |m| > 1 means enlarged. The sign conventions (the "real is positive" convention): object distance do > 0 always; di > 0 = real image (light actually converges there); di < 0 = virtual image (light appears to diverge from that point); f > 0 = converging lens; f < 0 = diverging lens.

## The One Concept

**Thin Lens Equation: 1/f = 1/do + 1/di**

**Formal definition:** For a thin lens (thickness negligible compared to focal length), the object distance do, image distance di, and focal length f are related by 1/f = 1/do + 1/di. The magnification is m = hi/ho = -di/do. This equation assumes paraxial rays (rays close to and nearly parallel to the optical axis) and a thin lens (both surfaces' refractions can be collapsed to a single plane).

**Physical intuition:** Think of the lens as a time-delay element. It imposes a phase delay on the wavefront proportional to thickness at each point — center (thickest) delays the most, edges (thinnest) delay the least. This engineered delay is exactly the right amount to curve a flat wavefront (from a distant object) into a spherical wavefront converging at the focal point, or to curve a spherical wavefront (from a nearby object) into one converging at the appropriate di.

**Three principal rays (trace these to construct the image graphically):**
1. Ray parallel to the optical axis → after lens, passes through the back focal point F₂.
2. Ray through the front focal point F₁ → after lens, exits parallel to the optical axis.
3. Ray through the center of the lens → passes straight through without deflection (the two lens surfaces are locally parallel at the center).

The image is where these three rays intersect. If they actually intersect (di > 0): real image, can be projected on a screen. If their extensions backward intersect (di < 0): virtual image, cannot be projected, only seen by looking through the lens.

**Key cases:**
- do > 2f: real, inverted, diminished image (camera taking a photo of distant scene)
- do = 2f: real, inverted, same-size image (1:1 macro photography)
- f < do < 2f: real, inverted, magnified image (projector showing slide)
- do = f: no image (rays exit parallel — collimated beam; used in flashlights and telescopes)
- do < f: virtual, upright, magnified image (magnifying glass)

**Real-world examples:**
1. **The human eye:** Cornea + lens system has an effective focal length of ~17 mm, projecting onto the retina ~17 mm behind. Accommodation (ciliary muscles changing lens shape) adjusts f to keep image on retina for different do — a biological zoom lens obeying the thin lens equation.
2. **Camera lenses:** "F/2.8" refers to the focal ratio f/D (focal length over aperture diameter). Telephoto lenses have large f (more magnification for distant objects). Wide-angle lenses have small f.
3. **Reading glasses:** People with presbyopia (age-related loss of accommodation) cannot focus on nearby text. Reading glasses (converging lenses) effectively reduce do as seen by the eye, allowing near focus. Prescription is measured in diopters = 1/f in meters.

## The Fix

Replace the fixed-focal-point model with the proper thin lens equation:

```javascript
function computeImageDistance(do_, f) {
  // Thin lens equation: 1/do + 1/di = 1/f  =>  di = f*do / (do - f)
  if (Math.abs(do_ - f) < 0.001) return Infinity; // object at focal point
  return (f * do_) / (do_ - f);
}

function tracePrincipalRays(obj, lens, f) {
  const do_ = lens.x - obj.x;
  const di = computeImageDistance(do_, f);
  const imageX = lens.x + di;
  const m = -di / do_;
  const imageHeight = obj.height * m;
  
  // Ray 1: parallel to axis -> through back focal point
  // Ray 2: through front focal point -> exits parallel
  // Ray 3: through lens center -> straight
  // (full implementation traces each ray segment)
  
  return { imageX, imageHeight, magnification: m, isReal: di > 0 };
}
```

Now drag the object: the image distance updates continuously. Push the object toward the focal point — watch di race toward infinity (the image goes to infinity, used in laser collimation). Push past the focal point (object now inside focal length) — di becomes negative: virtual image on the same side as the object, upright and magnified. The three principal rays now correctly reconstruct the image position at every object distance. The blur metric drops to zero for all positions.

## The Wow Moment — Push It

Build a **two-lens compound optical system** — the telescope. First: an objective lens with large f₁ (long focal length) forms a real, inverted, diminished image of a distant planet at its focal plane. This intermediate image then serves as the object for the eyepiece (short focal length f₂), which is positioned so the intermediate image is just inside f₂ — making the eyepiece act as a magnifying glass. The angular magnification is M = -f₁/f₂. Use f₁ = 800 px, f₂ = 50 px → 16× magnification. Draw the two lenses on screen with the full ray trace through both. The planet gets gigantic. Animate Saturn with its rings slowly rotating — the telescope simulation makes rings clearly visible.

Then introduce **aberrations**. Chromatic aberration: the lens equation gives a focal length that varies with wavelength (since n varies with λ). Show three wavelengths (red, green, blue) each focusing at slightly different distances — when you focus green correctly, red and blue are blurry. Real camera lenses use achromatic doublets (two lens elements, different glass types) to correct this. Show the improvement. Spherical aberration: paraxial rays focus at f, but rays near the lens edge focus slightly closer (for a converging lens). Show this as concentric rings of blur. The "sweet spot" of a camera lens is around f/8 — small enough aperture to exclude edge rays, large enough to diffract less.

## The Interactive Demo

Canvas simulation at 1100 × 500 px. The optical axis runs horizontally through the center. Lens is a vertical biconvex symbol at x = 550. Object is a draggable upward arrow.

**Object position drag:** Click and drag the object arrow to any position on the optical axis. The image updates in real time — three principal rays animate, image arrow appears at the computed position. If the image is virtual, render it with a dashed outline and different color (cyan vs yellow for real).

**Focal length slider** (−400 to +400 px, with 0 blocked — no flat plate): Positive = converging, negative = diverging. Focal points F₁ and F₂ appear on screen and move as f changes. Lens symbol changes: biconvex for f > 0, biconcave for f < 0.

**Wavelength mode:** Toggle "chromatic dispersion" — three ray fans (red, green, blue) trace separately with different effective focal lengths. Shows chromatic aberration as a colored halo around the image point.

**Aperture slider** (0.1 to 1.0 × lens diameter): Controls which rays are accepted. Narrow aperture: only paraxial rays, minimal spherical aberration but dimmer image. Wide aperture: more light but more spherical aberration visible.

**Two-lens mode:** Add a second lens to the canvas by clicking. The system automatically computes the combined image using sequential application of the thin lens equation. Labels: Objective / Eyepiece. Magnification display updates.

**Information panel:** Real-time readout of do, di, m, f, "Image type: Real/Virtual, Upright/Inverted, Enlarged/Diminished." Diopter display for the ophthalmology-minded.

**Ray count slider** (3 to 50): More rays give a better visualization of aberrations.

## Production Notes

**Runtime estimate:** ~14–16 minutes. Hook (1 min), Naive code (3 min), Failure (1.5 min), Physics (3 min), Fix (2 min), Wow (3 min), Interactive demo (2 min).

**Screen layout:** Same 60/40 code/canvas split. The optical axis should be visually prominent — a faint dashed horizontal line across the canvas. When aberrations are shown, the canvas should be dark with glowing rays to make the color separation visible.

**Animations to prepare:** The phase-delay physical intuition animation (lens thickness mapping to wavefront curvature). The Lensmaker's Equation diagram (1/f = (n-1)(1/R₁ - 1/R₂)). The accommodation diagram of the human eye. The achromatic doublet ray trace showing corrected vs uncorrected chromatic aberration.

**Key zoom moments:** (1) Object crossing the focal point — the moment where di flips from +∞ to −∞ and the image jumps from real (far right of screen) to virtual (left of lens). (2) The chromatic aberration moment — a tight zoom on the image point as it splits into three colored dots as wavelength mode is toggled. (3) The telescope assembly moment — second lens appears and the planet image jumps to full magnification.

**B-roll:** Macro photography through a real magnifying glass. Camera lens being disassembled showing multiple optical elements. Eye anatomy chart. A Cassegrain telescope.

**Props:** Several lenses of different focal lengths. A glass of water (acts as a crude lens). An overhead projector (if available) showing real-image projection.

## Tags
`physics` `optics` `lens` `thin-lens` `magnification` `image-formation` `javascript` `canvas` `beginner`

## Thumbnail

Split image: LEFT half shows sunlight converging through a magnifying glass to a burning dot on white paper — smoke rising, clear menace. RIGHT half shows the same lens held up to large text, making it enormous and readable. The lens is the visual pivot point between both halves, centered in the frame. Bold text overlay: "SAME LENS." Smaller subtext: "Two completely different things." The juxtaposition of "burning" and "magnifying" from a single object triggers immediate curiosity. Orange/red fire glow on the left, clean white reading light on the right. Emotion: "Wait — how does the lens know which one to do?" The equation "1/f = 1/do + 1/di" appears in small elegant text below, teasing that there is a satisfying mathematical answer.
