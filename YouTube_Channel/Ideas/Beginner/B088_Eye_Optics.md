---
title: "The Eye as an Optical System (Why Glasses Work)"
id: B088
difficulty: 2/10
prereq: "B013_Thin_Lens"
concept: "Eye focuses by varying lens curvature (accommodation); refractive power P = 1/f (diopters); myopia (too much power, image in front of retina) corrected by diverging lens; hyperopia by converging."
tags: [optics, eye, accommodation, diopters, myopia, hyperopia, canvas, beginner]
category: beginner
type: video-idea
---

# The Eye as an Optical System (Why Glasses Work)

**Alt title:** "Your Eyes Are a Zoom Lens — And Sometimes a Broken One"
**Difficulty:** 2/10 | **Prereq:** B013_Thin_Lens

---

## Opening Hook (0:00–1:00)

The video opens on a simulation showing a pair of eyes looking at a book. On the left, the canvas shows a cross-section of the eye with converging rays — blue lines bending through the cornea and lens, converging perfectly on the retina at the back. On the right, the book text is crisp. Then the host zooms the book to a far-away distance. The lens shape in the cross-section changes — it flattens slightly — and the rays still converge on the retina. "Your eye just changed focal length in real time. No motor, no autofocus chip. Just a flexible biological lens controlled by muscle tension. It's called accommodation. And when it stops working well — or when the eyeball is the wrong size — you get myopia or hyperopia. Glasses are just lenses that pre-correct the light before it reaches your broken autofocus system. Let's simulate the whole thing."

## The Naive Attempt

The viewer models the eye as a single thin lens (the "equivalent lens" of combined cornea + crystalline lens) with a fixed focal length f = 17 mm (the distance from the lens to the retina in a standard eye). They trace a few rays from a near object through this lens and check where they converge. The code looks like:

```js
let f = 17; // mm, fixed focal length
let dObj = 250; // object distance, mm
let dImg = 1 / (1/f - 1/dObj); // thin lens formula
// dImg should equal 17 mm for sharp focus
if (Math.abs(dImg - retinaDistance) < 0.5)
  console.log("Sharp focus");
else
  console.log("Blur — image at " + dImg);
```

For a 250 mm object, they get d_i = 18.1 mm — image behind the retina. The eye cannot focus on near objects with a fixed lens. The model is incomplete.

## The Moment of Failure

When the viewer moves the object from 6 m (infinity for optics purposes) to 25 cm (reading distance), the fixed-focal-length model produces d_i ranging from 17 mm to 18.1 mm. For the near object, the image falls 1.1 mm behind the retina — the picture on screen shows rays continuing past the retina and converging at a point in blank tissue. The simulation says the eye is always blurry for near objects. But real eyes can read fine at 25 cm — because they can change their focal length, something the naive model lacks entirely.

## Why It Broke — The Physics

The total optical power of the eye is: **P_total = P_cornea + P_lens − d · P_cornea · P_lens**, where d is the separation of the two elements. The cornea contributes ~43 diopters (fixed), and the crystalline lens adds ~20–33 diopters depending on the contraction of the **ciliary muscles**. When the muscles contract, they relax tension on the zonular fibers, allowing the elastic lens to become more curved — increasing its focal power. This is **accommodation**. The near point of a young eye is about 7–10 cm (maximum accommodation); the far point is infinity. The total accommodation range is roughly 13–16 diopters for a young adult, decreasing with age (**presbyopia**). The system is elegant: the cornea handles ~70% of the total refraction and cannot change, while the lens provides the variable fine-tuning. The image must land precisely on the fovea — the central ~1.5 mm patch of the retina with the highest cone density — for sharp central vision.

## The One Concept

**Refractive error** occurs when the total optical power of the eye does not match the axial length of the eyeball. In **myopia** (nearsightedness), the eye is either too long axially or has too much refractive power — parallel rays from infinity converge in front of the retina, producing a blurry image of distant objects. The far point of a myopic eye is at a finite distance (e.g., 2 m for −0.5 D myopia). Correction requires a **diverging lens** (negative diopters) that moves the virtual image of infinity to the eye's far point: P_correction = 1/f_correction = −1/far_point_distance. In **hyperopia** (farsightedness), the eye is too short or has too little power — parallel rays would converge behind the retina. Young hyperopic eyes can accommodate to compensate, but they must work constantly, causing eye strain. Correction requires a **converging lens** (positive diopters). Glasses or contact lenses are prescribed in diopters: a −2.0 D lens means f = −0.5 m = −50 cm, placing the virtual image of infinity at 50 cm — the far point of a moderately myopic eye. The beauty of the diopter system is that optical powers add directly when elements are in contact: P_glasses + P_eye = P_corrected_eye, which should equal 1/17 mm ≈ 59 D.

## The Fix

Add an accommodation variable — the lens power P_lens — that adjusts to bring the image onto the retina:

```js
let P_cornea = 43; // diopters, fixed
let axialLength = 24; // mm, eyeball length
let retinaD = axialLength / 1000; // in meters
// Solve for needed P_lens:
// 1/dObj + 1/retinaD = P_total = P_cornea + P_lens (ignoring thickness)
let P_total_needed = 1/dObj_m + 1/retinaD;
let P_lens_needed = P_total_needed - P_cornea;
P_lens = Math.min(Math.max(P_lens_needed, 20), 33); // clamp to physical range
let actualTotal = P_cornea + P_lens;
let dImg_m = 1 / (actualTotal - 1/dObj_m);
// Is image on retina?
let blur = Math.abs(dImg_m - retinaD);
```

For myopia, increase axialLength to 26 mm and show that even maximum accommodation cannot bring the image onto the retina for distant objects. Add a −2 D correction lens and show it working.

## The Wow Moment — Push It

Build an aging eye simulation: start at age 10 with full 14 D of accommodation, and scrub an age slider up to 70. Watch the near point retreat from 7 cm to beyond arm's length — presbyopia visualized. At each age, show the range of clear vision as a colored band on a distance ruler. Then simulate LASIK: the viewer "reshapes" the cornea by adjusting P_cornea, eliminating the refractive error. Watch the image snap perfectly onto the retina without glasses.

## The Interactive Demo

- **Object distance** — slider 10 cm to 10 m
- **Axial length (eyeball size)** — slider 20 mm (hyperopic) to 30 mm (highly myopic)
- **Correction lens power** — slider −10 D to +10 D (glasses prescription)
- **Age** — slider 10 to 70, reduces accommodation range
- **Show blur circle** — toggle that renders the retinal image as a sharp point or a diffuse blur circle
- **Show ray paths** — toggle to show individual ray traces through cornea, lens, and onto retina

## Production Notes

The main canvas shows a large anatomical cross-section of the eye: the cornea as a curved line, the crystalline lens as a biconvex shape that changes curvature as the accommodation slider moves, the vitreous chamber as a clear space, and the retina as a curved red line at the back. Rays trace from the object at the left edge through the optical elements. A red circle on the retina marks the fovea. When the image falls on the fovea, display "SHARP" in green; when it misses, display "BLURRY" in red with an arrow showing the blur offset. Below the main canvas, show a distance ruler with a colored "clear vision zone" bracket.

## Tags
`optics` `eye` `accommodation` `diopters` `myopia` `hyperopia` `canvas` `beginner`

## Thumbnail

A close-up of an eye with a lens graphic overlaid, rays visibly converging inside the pupil. Half the image shows "MYOPIA" label with rays converging in front of a red line (retina), and a red X mark. The other half shows the corrected version with a lens icon and rays hitting the retina perfectly. Bold text: "Why Glasses Work" at the bottom. Clean, clinical, immediately relatable to the majority of viewers who wear glasses.
