---
title: "Ocean Acidification: pH Chemistry Dynamics"
id: SA103
type: youtube-short
duration: "~45 seconds"
feeds_video: "Ocean Acidification: The Chemistry Dissolving Coral Reefs"
difficulty: advanced
tags: [physics, simulation, short, advanced, ocean-acidification, ph, carbonate-chemistry, coral, climate]
---

> **What it is:** A ~45-second simulation showing ocean surface carbonate chemistry as atmospheric CO2 rises showing pH dropping, aragonite saturation state decreasing, and the rate of coral skeleton dissolution increasing. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Ocean Acidification: The Chemistry Dissolving Coral Reefs

# Short: Ocean Acidification — pH Chemistry Dynamics

**Feeds full video:** Ocean Acidification: The Chemistry Dissolving Coral Reefs

## Visual Hook (First 3 Seconds)
A pH gauge on screen: bright teal at 8.2 (baseline). Slowly, the needle crawls left toward red. The ocean behind it shifts from teal to amber. At 7.9, a tiny coral skeleton (white wireframe) begins crumbling. Text: **"−0.3 pH units since 1850."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Molecular diagram: CO₂ molecule (red-grey-grey) drops into blue water. Reaction chain shown with glowing arrows: CO₂ + H₂O → H₂CO₃ → HCO₃⁻ + H⁺ → CO₃²⁻ + 2H⁺. Each intermediate appears labeled in white on dark background.
- **0:10** — Bjerrum plot: carbonate species concentration vs pH (x: 6.0–9.0). Blue = CO₂(aq), green = HCO₃⁻, orange = CO₃²⁻. Dashed vertical lines at pH 8.2 (1850) and 8.05 (2025). Arrow shows current ocean moving left; CO₃²⁻ fraction drops from 9% to 5%.
- **0:18** — Aragonite saturation state Ω_arag: shown as color-fill world ocean map. Ω > 3.5 (coral comfort, blue); Ω = 1 (dissolution threshold, orange); Ω < 1 (corrosive, red). At 2025 conditions: Arctic and Southern Ocean patches turn orange.
- **0:27** — RCP 8.5 projection: time-lapse 2025→2100. pH surface map shifts from blue (8.1) to amber (7.8). Southern Ocean and Arctic turn fully red (Ω < 1). Coral reef zones (white outlines) shrink from 100% to **"38% of reefs in hospitable conditions."**
- **0:36** — Coral shell growth experiment panel: at pH 8.2, coral polyp (animated, pink) deposits CaCO₃ at **"10 mg/cm²/day"**. At pH 7.8: **"4 mg/cm²/day"** — 60% reduction. Shell appears visibly thinner and porous (wireframe degradation).
- **0:44** — Buffer capacity graph: as pH drops, ocean's ability to resist further acidification (Revelle factor) decreases. Revelle factor climbs from **"9.7 → 14.3"** — the ocean becomes a less effective carbon sink. Label: **"Less buffering = faster future acidification."**

## Physics Concept Teased
Ocean acidification follows the carbonate equilibrium system: rising CO₂ shifts the Bjerrum speciation toward bicarbonate, reducing free carbonate ions and dropping the aragonite saturation state below 1 — the chemical threshold at which coral skeletons dissolve rather than grow.

## On-Screen Text / Captions
- **0:00** — "The ocean is 30% more acidic than in 1850"
- **0:10** — "CO2 + seawater forms carbonic acid — more H+"
- **0:20** — "Less CO3²⁻ means coral shells dissolve"
- **0:30** — "By 2100 on RCP 8.5: most reefs in corrosive water"
- **0:38** — "Ocean's buffer weakens — spiral accelerates"
- **0:45** — "Full carbonate chemistry → bio link"

## End Card
Final 3 seconds: world ocean map at 2100 RCP 8.5 — mostly orange/red pH map. **"CodedLaws — Ocean Chemistry"** text.

## Audio
Gentle ocean ambience corrupted by acid hiss. 58 BPM ambient. Crumbling stone SFX at shell dissolution.

## Production Notes
Renderer: carbonate system speciation solver (Python/CO2SYS). Bjerrum plot computed from equilibrium constants K₁, K₂ (Mehrbach refitted). Aragonite Ω = [Ca²⁺][CO₃²⁻]/Ksp_arag. RCP scenarios from IPCC AR6 ocean pH projections. Coral calcification: Ries et al. (2009) empirical fit. Output 1080×1920, 60 fps.
