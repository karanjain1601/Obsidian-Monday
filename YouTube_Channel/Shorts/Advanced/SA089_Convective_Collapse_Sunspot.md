---
title: "Convective Collapse — Sunspot Magnetic Concentration"
id: SA089
type: youtube-short
duration: "~45 seconds"
feeds_video: "Sunspot Formation: Convective Collapse and Magnetoconvection"
difficulty: advanced
tags: [physics, simulation, short, advanced, solar-physics, sunspot, convective-collapse, magnetoconvection]
---

> **What it is:** A ~45-second simulation showing convective collapse compressing a weak horizontal magnetic flux concentration via convective instability into a dark kilogauss sunspot umbra in the solar photosphere. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Sunspot Formation: Convective Collapse and Magnetoconvection

# Short: Convective Collapse — Sunspot Magnetic Concentration

**Feeds full video:** Sunspot Formation: Convective Collapse and Magnetoconvection

## Visual Hook (First 3 Seconds)
A time-lapse of sunspot formation: a small magnetic concentration (B = 200 G, diameter 500 km, shown as a faint blue blob) on the solar surface. Over 30 minutes of real time (condensed to 2 seconds), it collapses: the diameter shrinks to 3000 km as the field strength shoots up to 2800 G. The region darkens: "T drops from 5778 K → 3700 K." A beautiful dark sunspot pore forms.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The photospheric flux concentration: the solar photosphere (granulation visible — bright cells 1000 km wide with dark lanes) with a small magnetic flux tube (vertical blue field lines, B = 200 G) embedded in an intergranular lane. The tube is in pressure equilibrium: B²/8π + P_internal = P_external. Internal gas pressure: P_int = P_ext − B²/8π → P_int < P_ext → T_int < T_ext (Wilson depression).

**0:10–0:18** — The convective collapse mechanism: the weak field tube (B = 200 G) reduces convective efficiency. The gas inside the tube cools faster than outside (less energy transported vertically). Cooler gas → denser → falls → evacuates the tube → B concentrates. This positive feedback loop is shown as a flow diagram with arrows: "↓T → ↑ρ → downflow → ↓P_gas → ↑B → ↓T (repeat)." Each step amplifies the previous.

**0:18–0:26** — The instability analysis: the convective collapse threshold is B > B_crit = (8π ρ g H_p / (γ_1 − 1))^(1/2) ≈ 500 G (below: equilibrium, above: runaway collapse). A graph of B_crit vs depth shows it increasing with density. The initial 200 G tube is subcritical — it requires a perturbation (downflow) to initiate collapse. The perturbation trigger: a neighboring granule's sinking lane compresses the tube momentarily.

**0:26–0:34** — The collapse dynamics: the MHD simulation shows the downflow in the flux tube. Velocity field: downflow speed increases from 0 to 6 km/s as the collapse proceeds. The tube contracts from 500 km to 50 km width. Field strength amplifies from 200 G to 2000 G over 10 minutes. The simulation uses the anelastic MHD equations: ∇·(ρv) = 0, ρ Dv/Dt = −∇P + J×B + ρg.

**0:34–0:42** — Sunspot pore formation: after collapse (B = 2000 G), convection is suppressed — the magnetic pressure prevents convective overturning. The surface darkens (Wilson depression: the optical depth unity surface is 400 km deeper inside the spot, so we see hotter deeper gas... wait, no: we see cooler gas because the opacity is reached at a region with suppressed convection). Temperature map: center 3700 K (dark purple) → penumbra 4500 K (red) → quiet sun 5778 K (yellow/white).

**0:42–0:50** — Oscillations and waves: the sunspot shows a 3-minute oscillation (umbral flashes — shown as periodic brightening of the umbra with period 170 s). These are upward-propagating slow magnetoacoustic waves. The wave amplitude is plotted: A_v = 15 km/s in the chromosphere. "Waves carry energy from photosphere to chromosphere — potential coronal heating mechanism." Fade to CodedLaws logo.

## Physics Concept Teased
Convective collapse is the positive-feedback mechanism by which a weak photospheric magnetic concentration amplifies to kilogauss field strengths. Magnetic inhibition of convection causes cooling and downflows, which further evacuate the tube, concentrate the field, and ultimately suppress convection entirely — forming a dark sunspot umbra.

## On-Screen Text / Captions
- **0:00** — "200 G → 2800 G in 30 min: convective collapse"
- **0:06** — "Wilson depression: B suppresses convection"
- **0:12** — "Feedback: ↓T → ↑ρ → downflow → ↑B"
- **0:20** — "B_crit = 500 G: instability threshold"
- **0:28** — "Collapse: 500 km → 50 km width, v = 6 km/s"
- **0:36** — "Umbra: T = 3700 K, Wilson depression = 400 km"
- **0:44** — "3-min oscillations: slow MHD waves, A = 15 km/s"

## End Card
Final 3 seconds: a beautiful sunspot with umbra/penumbra structure, temperature colormap visible, CodedLaws logo centered. CTA: "Full video → Sunspot Formation and Magnetoconvection."

## Audio
Mysterious, deep ambient at 70 BPM. Collapsing sound effect (deepening tone) as field concentrates. Periodic ping every 170 seconds (the 3-min oscillation, sped up). No voiceover.

## Production Notes
Renderer: Magnetoconvection simulation using custom 2D MHD solver (finite-difference, anelastic). Convective collapse instability: linear stability analysis. Surface temperature map: Matplotlib imshow with sunspot temperature profile (analytical Schlichenmaier model). 3-minute oscillation: SDO/AIA 1600 Å real movie data. Three.js for 3D granulation background. 60 fps, 1080×1920.
