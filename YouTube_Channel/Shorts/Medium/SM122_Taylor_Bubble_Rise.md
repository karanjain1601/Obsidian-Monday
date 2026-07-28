---
title: "Taylor Bubble Rise in a Tube"
id: SM122
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Two_Phase_Flow_Full]]"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, two-phase-flow, bubbles, gravity]
---

> **What it is:** A ~45-second simulation short where a bullet-shaped Taylor bubble rises serenely through a water-filled vertical tube at its universal Froude-scaled velocity while liquid falls in a thin annular film around it and a churning toroidal wake oscillates below. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Two_Phase_Flow_Full]]

# Short: Taylor Bubble Rise in a Tube
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A vertical tube filled with water. A large elongated bubble — bullet-shaped, silver-white — rises serenely through the tube, occupying almost the entire diameter. Below it, liquid falls in a thin annular film. The bubble's nose is a perfect hemisphere. Its base oscillates in a churning wake. It is simultaneously elegant and chaotic.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** 2D axisymmetric cross-section of a vertical tube (diameter D = 50 mm). A large gas bubble (grey) occupies 80% of the tube diameter. Liquid (blue) flows in an annular film around the bubble periphery, falling downward. The bubble nose: hemispherical, smooth. Rise velocity: U_T = 0.35·√(gD) ≈ 0.24 m/s label shown.
- **0:10–0:18:** Flow field visualization: velocity arrows in the liquid. Thin film falls at high speed (~1 m/s) downward. Recirculating wake below the bubble base — toroidal vortex shown in orange. Streamlines drawn in the liquid phase, curving around the bubble.
- **0:18–0:28:** Dimensionless parameter analysis: Eötvös number Eo = ρgD²/σ = 340 (large, gravity dominated). Froude number Fr = U_T/√(gD) = 0.35 (universal constant for large Eo). Morton number Mo = gμ⁴/ρσ³ = 2.5×10⁻¹¹ (water). These three numbers fully characterize the bubble. A regime map (Eo vs. Mo) shows where Taylor bubbles exist vs. spherical vs. ellipsoidal bubbles.
- **0:28–0:38:** Series of bubbles: a train of Taylor bubbles with shorter slugs of liquid between them (slug flow regime). The leading bubble accelerates as the one ahead sheds a wake — bubble coalescence: two bubbles merge when the trailing bubble enters the wake of the leading one. Coalescence in slow motion shows the neck thinning and pinching off.
- **0:38–0:45:** Industrial relevance: slug flow in oil and gas pipelines (schematic cross-section of a horizontal subsea pipe with alternating gas and liquid slugs). Text: "Slug flow causes structural damage in offshore pipelines." Pipeline vibration animation: the pipe walls pulsate with slug arrival.

## Physics Concept Teased
A Taylor bubble is a large elongated gas bubble that rises in a tube with a diameter comparable to the capillary length. Its rise velocity follows a universal Froude scaling: U_T = 0.35√(gD), independent of bubble length. The liquid falls in a thin annular film; the base is dynamic and oscillatory. Bubble trains form slug flow, a two-phase flow regime critical to subsea pipeline design and nuclear reactor cooling.

## On-Screen Text / Captions
- **0:00:** "A bullet of gas rising through water — with its own universal speed law."
- **0:08:** "Rise velocity: U_T = 0.35 · √(gD)"
- **0:15:** "Liquid falls in a thin film at the walls"
- **0:22:** "Three numbers fully describe the bubble: Eo, Mo, Fr"
- **0:30:** "Bubble trains → slug flow regime"
- **0:38:** "This destroys offshore oil pipelines."
- **0:44:** "Froude scaling works from mm to meter tubes."

## End Card
Final 3 seconds: slow-motion view of the smooth hemispherical bubble nose rising upward, the film shimmering around it. Text: "Universal physics — from lab tube to oil pipeline." Channel logo.

## Audio
Gentle gurgling and bubbling sounds synced to the bubble motion. Voiceover (calm, precise): "The speed depends only on the tube diameter and gravity. Nothing else. That's remarkable." Coalescence event: a satisfying liquid 'thwop' sound. Soft ambient water ambience throughout.

## Production Notes
Code complexity: complex. Renderer: Canvas 2D with WebGL phase-field shader. Key algorithm: 2D axisymmetric Navier-Stokes with volume-of-fluid (VOF) interface tracking. Surface tension via Continuum Surface Force (CSF) method. Parameters: ρ_liquid = 1000 kg/m³, μ_liquid = 1e-3 Pa·s, σ = 0.072 N/m, D = 50 mm, g = 9.81 m/s². Grid: 64 (r) × 512 (z) cells in axisymmetric coordinates. Initial condition: elongated ellipsoid bubble, 0.5D radius × 3D length. Rise velocity validated against U_T = 0.35√(gD). Gotcha: axisymmetric VOF requires careful treatment of the r=0 axis boundary condition (reflecting BC for velocity, Neumann for VOF fraction). Annular film may become very thin — use adaptive grid or limit resolution.
