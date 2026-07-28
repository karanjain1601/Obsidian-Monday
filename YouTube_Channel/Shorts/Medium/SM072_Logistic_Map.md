---
title: "Logistic Map Bifurcation — Population Dynamics"
id: SM072
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, chaos, logistic-map, bifurcation, population-dynamics, feigenbaum]
---

> **What it is:** A ~45-second simulation short where a rabbit population driven by the logistic map transitions from a stable fixed point through period-doubling oscillations into full chaos as the growth rate r increases, demonstrating the universal period-doubling route to chaos with cobweb diagrams, the full bifurcation tree, and Feigenbaum's constant. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Logistic Map Bifurcation — Population Dynamics

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A rabbit population counter oscillates: 100 → 200 → 100 → 200... (period-2). Then the oscillation doubles: 100 → 150 → 200 → 120... (period-4). Then chaos — the population jumps unpredictably every year. Same equation, same species, different growth rate.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The logistic map: x_{n+1} = rx_n(1-x_n). Population x ∈ [0,1], growth rate r ∈ [0,4]. At r=1.5: fixed point (stable population). At r=3.2: period-2 (oscillating). At r=3.5: period-4. At r=3.8: chaos. Cobweb diagrams shown for each r value. Caption: "Cobweb converges (stable) or diverges (chaos)."

**0:10–0:18** — Bifurcation diagram (same as SM025 but with ecological framing): x* (population) vs r. Text frame: "This is not abstract math — r is the rabbit growth rate. x is population." Period doublings labeled with ecological language: "boom-bust cycle" → "4-year cycle" → "unpredictable" → "chaos."

**0:18–0:27** — Chaos in a real population: Canadian lynx data shown. Even without predators, a self-competing population can become chaotic. The logistic map x_{n+1} = rx_n(1-x_n) is equivalent to competition for resources (carrying capacity K). Caption: "Self-competition → chaos at high r."

**0:27–0:36** — Lyapunov exponent vs r: λ = lim_{N→∞} (1/N)Σln|f'(x_n)|. For periodic orbits: λ < 0. At period-doubling bifurcations: λ = 0. In chaos: λ > 0. Plot of λ vs r mirrors the bifurcation diagram. Caption: "λ > 0 → chaos; λ = 0 → bifurcation point."

**0:36–0:45** — Management implication: to keep a population stable, keep r < 3.0. Above r=3.56: chaos — population management becomes impossible. "Conservation lesson: even stable ecology can become chaotic if growth rate is too high." Bold text: "Logistic map — chaos in a fish tank." Fade to black.

## Physics Concept Teased
Logistic map: a discrete-time model of population growth with resource limitation. As the growth rate r increases, the stable fixed point undergoes a period-doubling cascade (at r=3.0, 3.449, 3.544...) before becoming chaotic above r≈3.57. This is the canonical example of the period-doubling route to chaos with Feigenbaum's universal constant δ = 4.669.

## On-Screen Text / Captions
- **0:00** — "A rabbit population. Same species. Different growth rate."
- **0:05** — "x_{n+1} = rx_n(1-x_n) — logistic map"
- **0:12** — "r = 3.2: 2-year cycle; r = 3.5: 4-year; r = 3.8: chaos"
- **0:20** — "Cobweb: converges (stable) → diverges (chaos)"
- **0:28** — "λ > 0 → chaos; λ < 0 → stable"
- **0:35** — "r > 3.56: chaos — impossible to manage"
- **0:43** — "Logistic map — chaos in a fish tank."

## End Card
Final 3 seconds: bifurcation diagram — the full tree from stability to chaos. Text: "The same bifurcation cascade appears in fluid turbulence, electronic circuits, and cardiac rhythms." CodedLaws logo.

## Audio
Rhythmic counting sounds (representing years). At the chaos transition: sounds become erratic, unpredictable. Voiceover at 0:00: "A population model with just one nonlinear term shows you why ecological populations can become chaotic — the growth rate is all that matters." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D. Key algorithm: logistic map iteration — trivially simple. Cobweb: draw parabola f(x) = rx(1-x) and diagonal y=x; iterate by drawing vertical to curve, horizontal to diagonal. Bifurcation diagram: same as SM025. Lyapunov exponent: λ = (1/N)Σlog|f'(x_n)| = (1/N)Σlog|r(1-2x_n)|. Plot λ vs r alongside the bifurcation diagram. Runtime: real-time, instant.
