---
title: "Predator-Prey — Lotka-Volterra Oscillations"
id: SM071
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, population-dynamics, lotka-volterra, predator-prey, nonlinear-dynamics]
---

> **What it is:** A ~45-second simulation short where rabbit and fox populations cycle through perpetual boom-and-bust oscillations on a 2D landscape, demonstrating the Lotka-Volterra predator-prey equations' conserved Hamiltonian-like quantity, closed phase-space orbits, and the quarter-period prey-before-predator time lag matched against real Canadian lynx-hare data. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Predator-Prey — Lotka-Volterra Oscillations

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A 2D landscape. Green rabbit dots scatter across a meadow — lots of them. A few red fox dots are visible. Then the foxes eat the rabbits, multiply — now the landscape fills with foxes. The rabbits nearly disappear. Then the foxes starve and collapse. The rabbits return. The cycle repeats forever.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Lotka-Volterra equations: dN/dt = αN - βNP; dP/dt = δNP - γP. N = prey, P = predator. α = prey growth rate, β = predation rate, δ = conversion efficiency, γ = predator death rate. Caption: "4 parameters. Eternal oscillation."

**0:10–0:18** — Phase portrait: N-P plane. The trajectory is a closed orbit — an exact ellipse in the linearised system. The actual LV system has closed orbits at every energy level (conserved quantity: H = δN - γln(N) + βP - αln(P)). The entire phase plane is filled with nested closed orbits. Caption: "Closed orbits — conservation law."

**0:18–0:27** — Time series: N(t) and P(t) shown as sine-like curves, P lagging N by a quarter period. When rabbits peak, foxes begin to peak 3 months later. When foxes peak, rabbits begin to fall. Captions: "Prey peaks before predators." Arrow shows the time lag.

**0:27–0:36** — Rosenzweig-MacArthur extension: adding prey carrying capacity K (logistic growth for prey). The system now has a stable spiral fixed point — spiralling into equilibrium. At high enough K → limit cycle (Hopf bifurcation). Caption: "With carrying capacity: spiral to equilibrium." Demonstrating the paradox of enrichment.

**0:36–0:45** — Real data: Canadian lynx-snowshoe hare population cycle, 1845–1930. Historical data shown as dots; Lotka-Volterra fit shown as a curve. Period ≈ 10 years. Caption: "Lynx-hare cycle — 10 year period, same as LV." Bold text: "Lotka-Volterra — predators and prey forever dancing." Fade to black.

## Physics Concept Teased
Lotka-Volterra model: two coupled nonlinear ODEs governing predator and prey populations. The system has a conserved quantity (a Hamiltonian-like first integral), so orbits are neutrally stable closed curves in phase space — eternal oscillations. Real ecologies add carrying capacity and stochasticity, but the LV skeleton underlies all predator-prey dynamics.

## On-Screen Text / Captions
- **0:00** — "Rabbits peak. Foxes follow. Both collapse. Repeat."
- **0:05** — "dN/dt = αN - βNP; dP/dt = δNP - γP"
- **0:12** — "Conserved: H = δN - γln(N) + βP - αln(P)"
- **0:20** — "Prey peaks before predators — quarter-period lag"
- **0:28** — "Carrying capacity: spiral to equilibrium"
- **0:35** — "Lynx-hare cycle: 10-year period, LV fit"
- **0:43** — "Lotka-Volterra — predators and prey dancing forever."

## End Card
Final 3 seconds: phase portrait of closed LV orbits in vivid colour. Text: "Alfred Lotka (1925) and Vito Volterra (1926) — independently discovered the same equations." CodedLaws logo.

## Audio
Gentle, cyclical acoustic music that rises and falls with the population cycles (~10-year period compressed to ~10 seconds). Voiceover at 0:00: "Predator and prey populations oscillate out of phase — a mathematical consequence of their coupling, not chance." No other voiceover.

## Production Notes
Code complexity: low. Renderer: Canvas 2D or p5.js. Key algorithm: integrate Lotka-Volterra ODEs with RK4. Plot N(t), P(t) as time series and the phase portrait (N vs P). Show 5+ closed orbits at different initial conditions simultaneously. Rosenzweig-MacArthur: dN/dt = αN(1-N/K) - βNP/(1+βhN); dP/dt = εβNP/(1+βhN) - γP. Hopf bifurcation: tune K to pass through bifurcation. Agent-based version: place rabbits and foxes on a 2D grid with reproduction and predation rules — reproduces LV dynamics stochastically. Runtime: real-time, trivially fast.
