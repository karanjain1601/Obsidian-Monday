---
title: "Stellar Evolution — Hertzsprung-Russell Track"
id: SA085
type: youtube-short
duration: "~45 seconds"
feeds_video: "Stellar Evolution: How Stars Live and Die on the HR Diagram"
difficulty: advanced
tags: [physics, simulation, short, advanced, stellar-evolution, HR-diagram, main-sequence, stellar-physics]
---

> **What it is:** A ~45-second simulation showing a 1 solar-mass stellar evolution track plotted on the Hertzsprung-Russell diagram from the zero-age main sequence through the subgiant, red giant, and white dwarf stages. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Stellar Evolution: How Stars Live and Die on the HR Diagram

# Short: Stellar Evolution — Hertzsprung-Russell Track

**Feeds full video:** Stellar Evolution: How Stars Live and Die on the HR Diagram

## Visual Hook (First 3 Seconds)
The classic Hertzsprung-Russell diagram fills the screen: x-axis = Temperature T_eff (from 30,000 K on left to 3000 K on right, labeled in white), y-axis = Luminosity L/L_☉ (0.001 to 10⁶, logarithmic, white). Main sequence (diagonal band, blue-to-red from upper-left to lower-right) glows. A gold dot labeled "1 M_☉ star" sits on the main sequence. It starts moving — the evolutionary track begins.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Pre-main-sequence: the solar-mass star begins as a protostar (top-right of the diagram, red, low temperature 3000 K, luminosity 10 L_☉). It contracts along the Hayashi track (vertical red path, nearly constant T_eff = 4000 K, dropping in luminosity). Then the Henyey track (nearly horizontal, T rising, L nearly constant). Time: 50 million years total to reach ZAMS.

**0:10–0:18** — Main sequence (ZAMS): the star stabilizes at (T_eff = 5778 K, L = 1 L_☉) — shown as a gold dot. Hydrogen burning in the core: 4¹H → ⁴He + energy. Core hydrogen mass fraction X_c drops from 0.70 to 0.00 over 10 Gyr. As X_c decreases, the star gradually moves up and to the right: after 10 Gyr the track shows L = 1.25 L_☉, T = 5600 K (current Sun's position labeled "☉ now").

**0:18–0:26** — Subgiant branch: after core H exhaustion at t = 10 Gyr, the inert He core contracts (gravity wins). The hydrogen-burning shell expands and the outer layers puff up. The star moves right and up: T_eff falls to 4000 K, L rises to 5 L_☉ — the subgiant branch. This phase lasts ~1 Gyr. The evolutionary track arrow points right and up on the HR diagram.

**0:26–0:34** — Red giant branch (RGB): the star expands enormously — radius reaches 50 R_☉, L = 1000 L_☉, T_eff = 3500 K. The RGB is shown as a nearly vertical red line on the right side of the HR diagram. At the tip of the RGB: the helium flash — core He ignition in a degenerate core, releasing 10⁴⁵ J in ~seconds (not visible externally). The star then moves left to the horizontal branch.

**0:34–0:42** — Horizontal branch and AGB: after He-flash, the star burns He in its core at L = 50 L_☉ — the horizontal branch (shown as a horizontal cyan band). When core He is exhausted, the star ascends the asymptotic giant branch (AGB): L = 5000 L_☉, R = 200 R_☉. Thermal pulses on the AGB are shown as small oscillations in the luminosity track.

**0:42–0:50** — Planetary nebula and white dwarf: the AGB star ejects its outer envelope (shown as an expanding cyan ring — a planetary nebula). The remnant core (carbon-oxygen white dwarf, M = 0.6 M_☉, R = 0.01 R_☉) plots in the lower-left of the HR diagram — a faint, hot point that cools along the white dwarf cooling track over billions of years. Final state: "Black dwarf in 10¹⁴ yr." Fade to CodedLaws logo.

## Physics Concept Teased
Stellar evolution traces a complex path on the Hertzsprung-Russell diagram driven by changes in the core nuclear fuel source. A solar-mass star spends 90% of its life on the main sequence, then expands into a red giant, undergoes helium burning, and ultimately ejects its envelope as a planetary nebula, leaving a white dwarf.

## On-Screen Text / Captions
- **0:00** — "1 M_☉ evolutionary track begins"
- **0:06** — "Hayashi track: contraction, 50 Myr to ZAMS"
- **0:12** — "Main sequence: 10 Gyr, X_c: 0.70 → 0.00"
- **0:20** — "Subgiant: He core contracts, L = 5 L_☉"
- **0:28** — "RGB tip: He flash, L = 1000 L_☉, R = 50 R_☉"
- **0:36** — "AGB: L = 5000 L_☉, R = 200 R_☉, thermal pulses"
- **0:44** — "Planetary nebula → white dwarf, 0.6 M_☉"

## End Card
Final 3 seconds: the complete evolutionary track on the HR diagram from ZAMS to white dwarf, CodedLaws logo centered. CTA: "Full video → Stellar Evolution on the HR Diagram."

## Audio
Warm, life-like ambient at 75 BPM — a sense of a long journey. Gentle ticking for each billion years elapsed. Dramatic burst for the helium flash. Soft, fading tone as the white dwarf cools. No voiceover.

## Production Notes
Renderer: Stellar evolution track from MESA stellar evolution code (Modules for Experiments in Stellar Astrophysics). HR diagram: Matplotlib scatter + line plot. Evolutionary track animated with FuncAnimation at variable speed (slow on MS, fast on RGB). Planetary nebula: Three.js expanding torus ring. White dwarf cooling: Mestel's cooling law. 60 fps, 1080×1920.
