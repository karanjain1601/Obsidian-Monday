---
title: "Bifurcation Diagram — Period Doubling Route to Chaos"
id: SM025
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, chaos, bifurcation, period-doubling, logistic-map, feigenbaum]
---

> **What it is:** A ~45-second simulation short building the logistic map's bifurcation diagram from scratch, showing how a simple parabola spawns period-doubling cascades governed by the universal Feigenbaum constant before collapsing into chaos. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Bifurcation Diagram — Period Doubling to Chaos

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Black canvas. A horizontal axis labelled r (0 to 4), vertical axis labelled x (0 to 1). As the camera watches, a glowing white curve appears from the left — steady, then splits in two, splits again, splits again faster and faster, until the right side of the canvas explodes into a dense cloud. The "butterfly of chaos."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The logistic map: x_{n+1} = rx_n(1-x_n). Shown as a parabola intersected by the diagonal. At r=2.5: one stable fixed point (single branch). Shown as a cobweb diagram in cyan on the left panel, bifurcation diagram on the right.

**0:10–0:18** — r increases: at r=3.0 the fixed point becomes unstable → period-2 oscillation (two branches). At r=3.449 → period-4. At r=3.544 → period-8. Each bifurcation point labeled. Caption: "Feigenbaum constant: δ = lim(r_{n+1}-r_n)/(r_{n+2}-r_{n+1}) = 4.669…"

**0:18–0:27** — r = 3.57: onset of chaos — the branches explode into a dense band. White vertical dashed line at r_∞ = 3.569946. Caption: "Chaos onset: r_∞ = 3.5699…" The band has windows of order (bright gaps) — Period-3 window visible at r ≈ 3.83.

**0:27–0:36** — Zoom into the period-3 window: inside, the diagram shows another complete bifurcation sequence (period 3 → 6 → 12 → chaos). Caption: "Self-similar — universality." Feigenbaum's number δ = 4.6692 appears for each sub-sequence.

**0:36–0:45** — Final full bifurcation diagram, slowly fading in the Feigenbaum constant. Text: "δ = 4.6692… appears in water dripping, heart rhythms, and fluid turbulence." Bold: "Universal constant of chaos." Fade to black.

## Physics Concept Teased
Bifurcation diagram: the logistic map undergoes period doubling at increasingly rapid r increments (ratio → 4.669, the Feigenbaum constant). This constant is universal — it appears in any system undergoing period doubling, from fluid experiments to cardiac rhythms.

## On-Screen Text / Captions
- **0:00** — "x → rx(1-x) — the logistic map."
- **0:05** — "r < 3: stable fixed point"
- **0:12** — "r = 3.449: period-4; r = 3.544: period-8"
- **0:18** — "Feigenbaum constant δ = 4.6692…"
- **0:25** — "r > 3.5699: chaos"
- **0:30** — "Period-3 window — self-similar"
- **0:40** — "Universal constant of chaos — everywhere."
- **0:44** — "Feigenbaum, 1975."

## End Card
Final 3 seconds: full bifurcation diagram. Text: "Mitchell Feigenbaum computed δ on a pocket calculator in 1975." CodedLaws logo. CTA: "What's the period-5 window location? Comment your guess."

## Audio
Electronic pulse that doubles in tempo each bifurcation (~75 BPM → 150 → 300, then noise burst at chaos onset). Voiceover at 0:00: "Double the period, then double again — the same universal number appears every time, in every system." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: for each r value (sweep 2.5 to 4.0 in 1000 steps): iterate logistic map 500 times to discard transient, then plot next 200 x-values as dots at (r, x). Draw each (r, x) as a 1-pixel white dot. Feigenbaum constant: precompute bifurcation points r_1=3.0, r_2=3.449, r_3=3.544… and display the ratios. Cobweb diagram: draw x vs f(x) parabola, then cobweb trajectory for given r. Runtime: nearly instant precomputation, real-time animation by revealing r columns progressively.
