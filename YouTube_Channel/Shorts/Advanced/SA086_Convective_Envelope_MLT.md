---
title: "Convective Envelope — Mixing Length Theory"
id: SA086
type: youtube-short
duration: "~45 seconds"
feeds_video: "Solar Convection: Mixing Length Theory and Helioseismology"
difficulty: advanced
tags: [physics, simulation, short, advanced, stellar-physics, convection, mixing-length, solar-physics]
---

> **What it is:** A ~45-second simulation showing a stellar convection zone modeled with mixing-length theory showing convective blobs rising and sinking with the mixing length calibrated against solar helioseismology. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Solar Convection: Mixing Length Theory and Helioseismology

# Short: Convective Envelope — Mixing Length Theory

**Feeds full video:** Solar Convection: Mixing Length Theory and Helioseismology

## Visual Hook (First 3 Seconds)
A cross-section of the solar interior (right half of the Sun shown): radiative zone (deep blue, 0–0.71 R_☉) transitions to a convective envelope (red/orange turbulent plumes, 0.71–1.0 R_☉). Hot rising plumes (bright yellow, T = 2×10⁶ K) and cool sinking lanes (dark red) create a churning pattern. Text: "α_MLT = 1.78, l_mix = 150,000 km."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The Schwarzschild criterion: convection starts when ∇_rad > ∇_ad, where ∇_rad = dlnT/dlnP|_radiation and ∇_ad = (γ−1)/γ = 0.4 (for ideal gas). The ratio ∇_rad/∇_ad is plotted vs solar radius: below 0.71 R_☉ it is less than 1 (blue, stable), above 0.71 R_☉ it exceeds 1 (red, unstable). The transition at r = 0.71 R_☉ (tachocline) is marked with a vertical gold line.

**0:10–0:18** — The mixing length model: a convective bubble (yellow circle, radius l_mix = α·H_p where H_p is the pressure scale height, α = 1.78) is displaced upward by δr from its equilibrium position. It rises while in pressure equilibrium, but retains its entropy. Temperature excess: δT = (∇_actual − ∇_ad)·δr/H_p. The buoyancy force: F = ρgδT/T drives the ascent. The bubble travels one mixing length l_mix before dissolving.

**0:18–0:26** — Convective flux: the energy carried by convection: F_conv = ρ c_p ⟨v_c·δT⟩. The convective velocity: v_c = l_mix/(2t_cross) = (gδ·l_mix²/8H_p)^(1/2). For the solar convective envelope: v_c ~ 300 m/s (subsonic). The total flux F = F_conv + F_rad = L_☉/4πr² = 6.3×10⁷ W/m². The fraction carried by convection: F_conv/F_total = 0.97 in the outer envelope (plotted vs radius).

**0:26–0:34** — Granulation: at the solar surface, convective cells appear as granules (bright centers, dark intergranular lanes). Granule size ~ 1000 km (shown at scale on the solar surface). Lifetime ~ 10 minutes. The contrast δT/T = 0.02 (2% temperature difference). A simulated granulation pattern (top-down view) from a 3D radiation-MHD simulation is shown — bright pentagons with dark lane network.

**0:34–0:42** — Supergranulation: larger-scale convective cells, size ~ 30,000 km, lifetime ~ 1 day. Shown as a velocity vector field on the solar disk: horizontal diverging flows from cell centers (outward arrows) converge to cell boundaries. The supergranular pattern is detected by helioseismology (time-distance analysis) — shown as a coherence map on the solar surface.

**0:42–0:50** — The tachocline: the thin shear layer (0.7 R_☉) between the radiative interior (uniform rotation at 432 nHz) and the convective envelope (differential rotation: 460 nHz equator, 385 nHz pole). The angular velocity Ω(r,θ) is shown as a colormap: blue = slow, red = fast. This shear layer is the seat of the solar dynamo. Fade to CodedLaws logo.

## Physics Concept Teased
Mixing length theory models turbulent convection in stellar envelopes by assuming convective blobs travel one mixing length l_mix = α·H_P before dissolving, with α ≈ 1.78 calibrated to the solar radius. Despite its simplicity, MLT successfully captures the solar structure and convective flux, though it fails to predict granulation details.

## On-Screen Text / Captions
- **0:00** — "Solar convective envelope: α_MLT = 1.78"
- **0:06** — "Schwarzschild: convection at ∇_rad > ∇_ad = 0.4"
- **0:12** — "Bubble rises l_mix = 150,000 km, then dissolves"
- **0:20** — "v_c = 300 m/s, F_conv/F = 97% in outer envelope"
- **0:28** — "Granulation: 1000 km, δT/T = 2%, 10-min lifetime"
- **0:36** — "Supergranulation: 30,000 km, detected by helioseism."
- **0:44** — "Tachocline: 432→460 nHz — dynamo birthplace"

## End Card
Final 3 seconds: the convective solar envelope cross-section with rising plumes, CodedLaws logo overlaid. CTA: "Full video → Solar Convection and Mixing Length Theory."

## Audio
Warm, bubbling ambient at 78 BPM — like a boiling liquid. Soft burbling sounds as convective cells rise and dissolve. Sharp transition tone at the tachocline. No voiceover.

## Production Notes
Renderer: Solar structure from MESA model (r, T, P, ρ profiles). Convective flux ratio plotted with Matplotlib. Granulation pattern: Solar Dynamics Observatory (SDO) real data image, or MURaM 3D convection simulation snapshot. Supergranulation velocity field: helioseismic far-side imaging data. Tachocline Ω(r,θ): GONG helioseismic inversion data (2D colormap). 60 fps, 1080×1920.
