---
title: "Black Hole Evaporation — Page Curve"
id: SA063
type: youtube-short
duration: "~45 seconds"
feeds_video: "The Page Curve and the Black Hole Information Paradox"
difficulty: advanced
tags: [physics, simulation, short, advanced, black-holes, Page-curve, information-paradox, evaporation]
---

> **What it is:** A ~45-second simulation showing the Page curve traced as a black hole evaporates showing entanglement entropy of Hawking radiation rising then falling at the Page time due to island contributions. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** The Page Curve and the Black Hole Information Paradox

# Short: Black Hole Evaporation — Page Curve

**Feeds full video:** The Page Curve and the Black Hole Information Paradox

## Visual Hook (First 3 Seconds)
A black hole shrinks in real time from a large white-glowing sphere to a tiny pinpoint over 2 seconds (accelerated time). Surrounding it: an expanding orange glow of Hawking radiation. A plot in the corner shows entanglement entropy S_rad vs time t — a curve that rises, peaks, then falls back to zero. "This is the Page curve." Text flashes gold.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The information paradox setup: a pure state |ψ⟩_BH is formed by gravitational collapse (gold star → black sphere). If Hawking radiation is perfectly thermal, the radiation state is always maximally mixed — pure information is lost. S_rad climbs monotonically (red dashed curve labeled "Hawking's prediction"). This violates unitarity.

**0:10–0:18** — Don Page's 1993 calculation: for a random bipartite system of dimension d_BH × d_rad, after the Page time t_Page = M³/M_P² (when half the information has radiated), the entanglement entropy of the radiation must start decreasing. The gold Page curve is shown: rises linearly to S_max = S_BH at t_Page, then decreases back to 0 at complete evaporation.

**0:18–0:26** — The Penrose diagram of evaporation: a 2D spacetime diagram showing the collapsing star (gold region), the event horizon (black diagonal), and the endpoint of evaporation (a point). A horizontal "Page time" slice is marked in cyan. Islands of the island formula are shown as colored patches on the time slice inside the horizon.

**0:26–0:34** — The island formula: S_rad(R) = min_{I} [Area(∂I)/4G + S_matter(R∪I)]. The island I (a region inside the black hole) is shown as a red patch. At early times: no island (I = ∅), S grows. At late times: an island forms, and the formula gives the correct decreasing entropy. The transition is shown at t_Page.

**0:34–0:42** — Replica wormholes: in the gravitational path integral for Tr[ρ_rad^n], off-diagonal saddle points (Euclidean wormholes connecting n replicas) contribute at late times. A diagram of two replicas connected by a wormhole (shown as a handle/tube in gold) appears. These saddles reproduce the Page curve from the bulk gravity computation.

**0:42–0:50** — Final: the Page curve is plotted with three labeled phases — (1) 0 to t_Page: entanglement grows (radiation looks thermal); (2) t_Page: maximum entropy = ½ S_BH = ½·10⁷⁷ k_B; (3) t_Page to t_evap: entropy falls to 0 (pure state restored). "Unitarity preserved." Fade to CodedLaws logo.

## Physics Concept Teased
The Page curve describes how the entanglement entropy of Hawking radiation from an evaporating black hole must rise and then fall back to zero, as required by unitarity. The recent derivation using the island formula and replica wormholes shows that semiclassical gravity itself computes the correct Page curve.

## On-Screen Text / Captions
- **0:00** — "Page curve: entropy rises, then falls to zero"
- **0:06** — "Hawking's prediction: S_rad monotonically rises (wrong)"
- **0:12** — "Page time: t_P = M³/M_P² (half the information out)"
- **0:20** — "Island formula: S = min[Area(∂I)/4G + S_matter(R∪I)]"
- **0:28** — "Island I forms at Page time → entropy decreases"
- **0:36** — "Replica wormholes: off-diagonal saddles"
- **0:44** — "Unitarity preserved: pure state returns to S=0"

## End Card
Final 3 seconds: the Page curve plot with the three labeled phases, CodedLaws logo overlaid. CTA: "Full video → The Black Hole Information Paradox."

## Audio
Tense electronic ambient at 72 BPM. Building suspense as entropy rises; satisfying descending tone as it falls back to zero. Dramatic chord at Page time. No voiceover.

## Production Notes
Renderer: Matplotlib for Page curve animation (parametric curve, animated with FuncAnimation). Penrose diagram: custom SVG vector graphic with island patches. Replica wormhole: Three.js torus handle geometry. Island formula computed for JT gravity (analytically solvable). Black hole shrinking: Three.js sphere scale animation. 60 fps, 1080×1920.
