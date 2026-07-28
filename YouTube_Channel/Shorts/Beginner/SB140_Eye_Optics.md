---
title: "How Your Eye Focuses: Accommodation"
id: SB140
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, optics, eye, accommodation]
---

> **What it is:** A ~45-second simulation short where an eye cross-section shows parallel rays from a distant house focusing cleanly on the retina, then as the object moves close the dark-red ciliary muscles contract, the amber lens visibly thickens, and the focal length shrinks from 60 mm to 40 mm to snap the near image back onto the retina — showing how the eye changes optical power by 8.3 diopters in milliseconds. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: How Your Eye Focuses: Accommodation
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Close-up of a human eye (stylized, white sclera, green iris, dark pupil) looking at a book. The book moves from arm's length toward the eye. The pupil constricts. The lens visibly thickens. Focus remains crisp on the book's text. Bold text: **"Your lens changes shape 100,000 times a day."**

## Main Visual Sequence (0:03–0:50)
**0:03** — Anatomical cross-section of the human eye builds (side view, right half of the eyeball, black background): white sclera (outer shell, white arc), cornea (clear dome, light blue, front-left), aqueous humor (pale blue fill, anterior chamber), crystalline lens (amber biconvex shape, center-left, **"Lens"** label), vitreous humor (pale grey fill, main body), retina (pink arc, back of eye, **"Retina"** label), optic nerve (pink stalk at back, **"Optic nerve"** label), ciliary muscles (dark red curved strips along the sides, **"Ciliary muscles"** label with arrows).

**0:08** — Distant object scenario: A small white house (pixel icon, 15 px) appears far to the left of the eye (at x=0, eye at x=300 px). Three parallel light rays (white lines) from the house enter the cornea, refract (bend inward at the curved cornea surface — most refraction happens here, not the lens). They continue to the lens (amber shape). Lens is flat (focal length **f = 60 mm**, labeled). Rays converge exactly at the retina. Text: **"Distant object → parallel rays → flat lens → sharp image on retina."**

**0:13** — Focal point gold dot appears exactly on the retina line. Text annotation: **"Image on retina ✓"** (green checkmark). Focal length label: **"f = 60 mm (flat lens)"** (white, small). The image formed is small and inverted — a tiny inverted house icon (5 px) appears on the retina in gold.

**0:18** — Transition: the house icon moves rapidly from far-left to close range (30 px from the eye at x=270 px). Rays from the nearby house diverge strongly. Without lens change: the same flat lens would converge the rays behind the retina (shown with dotted white lines missing the retina and converging to a blur circle 15 px behind). Text: **"Near object → diverging rays → flat lens → focus BEHIND retina (blur)."** Blur circle shown as a diffuse white disc on retina.

**0:24** — Accommodation begins: ciliary muscles (dark red arcs) animate — they contract (move inward, arcs get smaller/shorter). The suspensory ligaments (thin white radial lines connecting ciliary muscle to lens edge) go slack. The lens (amber biconvex) thickens visibly — x-radius increases from 15 px to 22 px over 1.5 seconds of animation. Focal length readout changes: **"f = 60 mm → f = 40 mm"** (red counter ticking down).

**0:30** — With the thicker lens (shorter focal length): the same diverging rays from the nearby house now converge exactly on the retina. Gold focal point dot snaps onto the retina. Text: **"Thicker lens → shorter f → near object in focus!"** (green bold). Inverted tiny house image appears on retina in gold.

**0:35** — Power calculation panel (white card): **"Lens power P = 1/f (in diopters)"**. Values: **"Far vision: P = 1/0.06 = 16.7 D"** and **"Near vision: P = 1/0.04 = 25 D"**. Total eye power change: **"ΔP = 8.3 diopters"** (yellow, bold). Text: **"Your eye can change its optical power by ~8 diopters in milliseconds."**

**0:39** — Presbyopia callout (orange card): **"After age 40, the lens stiffens — accommodation weakens. You need reading glasses."** Reading-glasses icon (wire-frame bifocals). Text: **"Reading glasses add extra converging power to replace the lost accommodation."** Diagram: glasses lens (blue-tinted convex shape) placed in front of the eye, bending rays so the stiff old lens can still focus.

**0:43** — Final comparison: two frames side by side — young eye (full accommodation range labeled: **"Near point: 10 cm, Far point: ∞"**) vs. older eye with presbyopia (**"Near point: 50 cm (blurry close up)"**). Reading glasses restore the effective near point to 25 cm.

**0:46** — Final text: **"Accommodation: your eye's auto-focus. Physics of sight."**

## Physics Concept Teased
The eye maintains focus on objects at varying distances through accommodation — the ciliary muscles contract, releasing tension in the suspensory ligaments and allowing the crystalline lens to become more curved (shorter focal length), increasing the eye's optical power to converge the more divergent rays from near objects onto the retina.

## On-Screen Text / Captions
- **0:00** — "Your lens changes shape 100,000 times a day." (bold white)
- **0:08** — "Distant object → parallel rays → flat lens → sharp retinal image" (white caption)
- **0:13** — "f = 60 mm (flat lens) — Image on retina ✓" (green checkmark)
- **0:18** — "Near object → flat lens → focus behind retina (BLUR)" (red caption)
- **0:24** — "Ciliary muscles contract → lens thickens" (label, dark red arrows)
- **0:24** — "f: 60 mm → 40 mm" (red countdown, lens label)
- **0:30** — "Thicker lens → near object in focus!" (bold green)
- **0:35** — "ΔP = 8.3 diopters — your eye's zoom range" (yellow card)
- **0:39** — "Presbyopia: stiff lens = reading glasses needed" (orange card)
- **0:46** — "Accommodation: eye's auto-focus. Physics of sight." (center bold white)

## End Card
Final 3 seconds: Eye cross-section with lens smoothly cycling between thin and thick forms (loop). White text: **"Follow CodedLaws — the physics of you."** Logo pulse bottom-right.

## Audio
Music: Warm, gentle piano melody from 0:00–0:35; slight emotional lift at accommodation animation (0:24) — strings enter; brief playful sting at presbyopia card (0:39); warm resolution chord at 0:46. No voiceover. Sound effects: soft "whoosh" as object moves close (0:18); subtle "click" as ciliary muscle contracts (0:24); satisfying "ping" as focus snaps to retina (0:30).

## Production Notes
Code complexity: Medium. Renderer: Canvas 2D. Key visual trick: draw the crystalline lens as a biconvex shape using ctx.beginPath() with two opposing arcs; animate lens thickness by changing the arc x-radius from 15 to 22 px over 90 frames (at 60 fps) using linear interpolation. Cornea: draw as a partial arc of a circle (the curved front face) using ctx.arc with a smaller radius than the sclera. Light rays: for distant object, draw horizontal lines. For near object, compute divergence angle based on distance (tan(θ) = h/d where h=lens height, d=object distance); draw converging lines after each optical element using thin lens refraction formula (1/v = 1/f − 1/u). Blur circle: when image falls behind retina, draw a diffuse white circle at the retina x-position with radius proportional to the miss distance (radius = miss_mm * scale). Ciliary muscles animate: use ctx.arc to draw 6 small dark-red arcs along the inner sclera; interpolate their angular extent from wide (relaxed) to narrow (contracted). Runtime: ~48 seconds. Gotcha: the cornea provides about 43 D of the eye's total ~60 D power and does NOT change during accommodation — only the lens changes; make sure the cornea refraction is drawn as constant across all scenarios to avoid misleading the viewer.
