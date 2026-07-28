---
title: "Penrose Diagram — Causal Structure of Kerr Black Hole"
id: SA065
type: youtube-short
duration: "~45 seconds"
feeds_video: "Penrose Diagrams: Mapping Infinity for Black Holes"
difficulty: advanced
tags: [physics, simulation, short, advanced, black-holes, Penrose-diagram, Kerr, causal-structure]
---

> **What it is:** A ~45-second simulation showing the Penrose conformal diagram of a Kerr black hole with timelike geodesics traced through the outer horizon, inner horizon, ergosphere, and ring singularity. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Penrose Diagrams: Mapping Infinity for Black Holes

# Short: Penrose Diagram — Causal Structure of Kerr Black Hole

**Feeds full video:** Penrose Diagrams: Mapping Infinity for Black Holes

## Visual Hook (First 3 Seconds)
A Penrose diagram for the Kerr black hole fills the screen: a complex tiling of diamond-shaped blocks in black, dark blue, and deep purple, with glowing gold lines marking event horizons (r = r₊) and inner Cauchy horizons (r = r₋). A ring singularity is shown as a zigzag red line. Text: "Kerr BH: a=0.9M, r₊=1.44M, r₋=0.44M."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — First, the simpler Schwarzschild diagram is shown for reference: a large diamond with four regions — I (our universe), II (interior), III (other universe), IV (white hole). Horizons are the diagonal lines. Singularity is the wavy red line at top. Scale: r = 2M = 6 km for a 2 M_☉ BH.

**0:10–0:18** — Transition to Kerr: the diagram becomes an infinite tower of repeating blocks (the maximal Kerr extension). The outer horizon r₊ and inner horizon r₋ are shown as distinct diagonal lines, creating a "neck" region between them. The ring singularity (r = 0, θ = π/2) is shown as a zigzag red line — but note it is timelike (vertical), not spacelike. An infalling observer (gold arrow) can avoid the singularity.

**0:18–0:26** — The ergosphere region: outside the outer horizon but inside the static limit r = M + √(M²−a²cos²θ), shown as a shaded oval region in orange. An infalling particle (gold) enters the ergosphere — it can still escape. But it cannot remain stationary: a dashed white "stationary limit" labeled r_sls = 2M (on equatorial plane). The frame-dragging makes ∂_t spacelike in this region.

**0:26–0:34** — Light cones near the horizons: a series of light cones drawn at 5 different radii (r = 4M, 2M=r₊, 1M, r₋=0.5M, 0.1M). As r decreases from 4M to r₊, the future light cone tilts toward the center. At r = r₊, the cone points purely inward (horizon crossing). Between the horizons (r₋ < r < r₊), both inward and outward are possible — the singularity is avoidable.

**0:34–0:42** — Cauchy horizon instability: at r = r₋, the inner horizon is shown as a surface of infinite blueshift. An infalling light ray accumulates infinite energy as it approaches r₋ — shown as a frequency-shifted wave (red → violet → white → burst). Text: "Blue-shift singularity at Cauchy horizon." The "Strong Cosmic Censorship conjecture" is labeled.

**0:42–0:50** — Final full Kerr Penrose diagram: the repeating tower of 6 diamond blocks, each labeled with region (I through VI), horizons in gold, and singularity in red. An arrow traces the trajectory of a geodesic passing through: I → II → III (new universe) → IV (emerging white hole). "Penrose diagrams reveal the full causal structure." Fade to CodedLaws logo.

## Physics Concept Teased
The Penrose diagram for the Kerr black hole reveals a rich causal structure: an outer event horizon, an inner Cauchy horizon, an ergosphere, and a ring singularity — all with distinct causal relationships. Unlike Schwarzschild, the Kerr singularity is timelike and avoidable, enabling geodesics to pass through to new universes.

## On-Screen Text / Captions
- **0:00** — "Kerr: a=0.9M, r₊=1.44M, r₋=0.44M"
- **0:06** — "Schwarzschild reference: 4 regions, spacelike singularity"
- **0:12** — "Kerr: infinite tower — timelike singularity, avoidable"
- **0:20** — "Ergosphere: dragged, but can escape"
- **0:28** — "Light cones tilt at horizons"
- **0:36** — "Cauchy horizon: infinite blue-shift, unstable"
- **0:44** — "Trajectory: I → II → III → new universe"

## End Card
Final 3 seconds: the full Kerr Penrose diagram tower with the geodesic trajectory traced in gold, CodedLaws logo centered. CTA: "Full video → Penrose Diagrams for Black Holes."

## Audio
Slow, ominous ambient at 58 BPM, deep bass. Ascending pitch as infaller approaches each horizon. Sharp electronic pulse at Cauchy horizon blueshift. No voiceover.

## Production Notes
Renderer: Custom Python/Matplotlib Penrose diagram builder. Kerr metric parameters: a=0.9M, with r₊ = M+√(M²−a²), r₋ = M−√(M²−a²). Conformal compactification computed analytically (Penrose-Carter coordinates). Light cone tilings drawn procedurally. Geodesic paths integrated with scipy.integrate.solve_ivp. 60 fps, 1080×1920.
