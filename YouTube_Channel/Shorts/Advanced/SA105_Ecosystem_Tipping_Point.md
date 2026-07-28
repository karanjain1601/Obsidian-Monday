---
title: "Ecosystem Tipping Point: Fold Bifurcation"
id: SA105
type: youtube-short
duration: "~45 seconds"
feeds_video: "Ecosystem Tipping Points: When Resilience Runs Out"
difficulty: advanced
tags: [physics, simulation, short, advanced, tipping-point, bifurcation, ecosystem, resilience, catastrophe-theory]
---

> **What it is:** A ~45-second simulation showing an ecosystem model crossing a fold bifurcation tipping point as a slow driver crosses a threshold, collapsing abruptly to a degraded stable state with hysteresis preventing recovery. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Ecosystem Tipping Points: When Resilience Runs Out

# Short: Ecosystem Tipping Point — Fold Bifurcation

**Feeds full video:** Ecosystem Tipping Points: When Resilience Runs Out

## Visual Hook (First 3 Seconds)
A shallow lake: vivid clear blue with rooted plants (green). A nutrient slider on the right inches rightward. At a threshold, the lake snaps to pea-green murky water (algae bloom) in one frame. No gradual transition — just a sudden flip. Red text: **"Catastrophic shift."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Phase space diagram: x-axis = nutrient loading P (0–3 mg/L/yr), y-axis = algae biomass A (0–500 µg/L). Two stable state curves: lower branch (clear water, A < 50) in blue, upper branch (turbid, A > 300) in green. Fold bifurcation point marked with red dots.
- **0:10** — Potential well visualization (landscape metaphor): smooth bowl = clear lake state (stable minimum, ball shown rolling). As nutrients increase, bowl tilts, potential wall shrinks. Label: **"Resilience = depth of potential well."**
- **0:18** — Lake simulation: 2D grid of algae density (blue=low, green=high). Nutrient loading increases from 1.0 to 2.2 mg/L/yr (slider visible). System remains in clear state. Critical slowing down indicator: **"Recovery time: 2 → 8 days"** (system perturbed and tracked).
- **0:27** — At P = 2.3 mg/L/yr (fold point): algae density jumps from **"45 µg/L → 410 µg/L"** in 12 simulation days. Lake color shifts from blue to opaque green. Fish oxygen indicator (blue bar) drops from 8 mg/L to 2 mg/L — below fish survival threshold.
- **0:36** — Hysteresis demonstration: nutrient reduced back to 1.0 mg/L — lake stays turbid (green) because alternative stable state has its own basin of attraction. Lower fold point = 0.8 mg/L. Label: **"Must reduce nutrients 3× more to recover."**
- **0:44** — Early warning signals panel: variance (increasing, blue line rising) and autocorrelation at lag-1 (increasing toward 1, orange line). Both rise before the tipping point. Label: **"EWS: system warns 20% of the way to the threshold."**

## Physics Concept Teased
Shallow lake ecosystems exhibit fold (saddle-node) bifurcations: two alternative stable states — clear and turbid — coexist over a range of nutrient loading, with hysteresis preventing easy recovery once the system tips, while critical slowing down provides statistical early-warning signals.

## On-Screen Text / Captions
- **0:00** — "A lake can flip states in days — with no warning"
- **0:10** — "Two stable states: clear and turbid. Both are 'normal'"
- **0:20** — "Nutrients creep up; resilience silently erodes"
- **0:30** — "Past the fold: catastrophic, irreversible shift"
- **0:38** — "Statistics warn you — if you know what to look for"
- **0:45** — "Bifurcation theory deep dive → link in bio"

## End Card
Final 3 seconds: fold bifurcation diagram with red dots at both folds and hysteresis loop highlighted. **"CodedLaws — Nonlinear Dynamics"** text.

## Audio
Serene water ambient (clear state) → sudden distortion → murky synthesizer drone (turbid state). 55 BPM. Sharp click at tipping point.

## Production Notes
Renderer: Scheffer lake model (Python). ODE: dA/dt = r·A·(1−A/K) − hA²/(A²+h²) + P. Bifurcation diagram via continuation (AUTO software wrapper). EWS computed from 1000 stochastic replicates. Critical slowing down: recovery rate λ estimated from perturbation experiments. Grid model: 100×100 cells with spatial diffusion. Output 1080×1920, 60 fps.
