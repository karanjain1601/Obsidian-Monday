---
title: "Shock Tube Simulation — Riemann Problem"
id: SM120
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Compressible_Flow_Full]]"
difficulty: medium
tags: [physics, simulation, short, fluid-dynamics, shockwaves, compressible-flow, Riemann]
---

> **What it is:** A ~45-second simulation short of a shock tube membrane bursting between high- and low-pressure gas, resolving into the exact Riemann solution of five self-similar regions — rarefaction fan, contact surface, and rightward shock — with an x-t characteristic diagram tracking every wave. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Compressible_Flow_Full]]

# Short: Shock Tube Simulation — Riemann Problem
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A long tube with a membrane in the middle: high pressure on the left (a glowing red-orange block), low pressure on the right (a pale blue void). The membrane bursts. Five distinct regions snap into existence: a shock wave races right, a rarefaction fan spreads left, and a contact surface drifts between them. All of this resolves from a single discontinuity.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** Initial condition shown as a step function: pressure p_L = 4 atm (red bar, left half), p_R = 1 atm (blue bar, right half). Density and velocity similarly shown. At t=0: membrane vanishes. A flash at the diaphragm location.
- **0:10–0:18:** The five-region solution emerges. Pressure profile at t=5ms shown as a curve: (1) undisturbed left gas → (2) rarefaction fan (smooth sloping region, pressure drops from p_L to p*) → (3) contact surface (CS, orange vertical line) → (4) shocked right gas (pressure p*) → (5) undisturbed right gas. All regions labeled with numbers.
- **0:18–0:28:** x-t (space-time) diagram appears on the right half of screen while the fluid simulation plays on the left. Characteristic lines drawn: left-going rarefaction fan (diverging red lines), contact surface trajectory (orange diagonal), shock wave trajectory (blue steep diagonal). The solution is self-similar — all features scale as x/t.
- **0:28–0:38:** Interactive parameter sweep: slider for pressure ratio p_L/p_R increases from 4 to 16. The shock becomes stronger (higher Mach number), the rarefaction fan broadens, the contact surface moves faster. Text label: "As p_ratio → ∞, M_shock → ∞." Then slider for density ratio ρ_L/ρ_R — affects contact surface speed but not shock strength.
- **0:38–0:45:** Application: laser-driven implosion, internal combustion engines, hypersonic test facilities. A real shock tube photograph (Schlieren image from a lab, public domain) shown beside the simulation.

## Physics Concept Teased
The Riemann problem is the 1D compressible Euler equations with a step-function initial condition. Its exact solution consists of three waves: a left-going rarefaction (smooth), a contact discontinuity (transported), and a right-going shock (discontinuous). The intermediate state pressure p* and velocity u* are found by solving a nonlinear algebraic system from the Rankine-Hugoniot conditions (shock) and isentropic relations (rarefaction). This exact solution is the backbone of all modern compressible flow codes.

## On-Screen Text / Captions
- **0:00:** "One membrane. One burst. Five perfectly predictable regions."
- **0:08:** "Initial: p_L = 4 atm | p_R = 1 atm"
- **0:15:** "Rarefaction | Contact Surface | Shock"
- **0:23:** "x-t diagram: the whole solution in one picture"
- **0:30:** "Self-similar: features scale as x/t"
- **0:38:** "This exact solution tests every CFD code ever written."
- **0:44:** "The Riemann problem. The foundation of compressible flow."

## End Card
Final 3 seconds: the x-t characteristic diagram in orange, red, blue on black — clean, geometric, satisfying. Text: "Exact solutions are rare. This is one." Channel logo.

## Audio
Sharp membrane-burst pop at t=0 (0:03). Clean, mathematical ambient — minimal electronic tones. Voiceover (methodical, clear): "One discontinuity. Three waves. Exact solution. No approximations needed." Subtle sweep tone as the rarefaction fan spreads.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: Exact Riemann solver — solve p* from the nonlinear equation: f_L(p*) + f_R(p*) + (u_R - u_L) = 0, where f = 2c/((γ-1))·[(p/p_0)^{(γ-1)/2γ} - 1] for rarefaction, f = (p-p_0)/√(ρ_0·(γp_0+p·(γ+1)/2)) for shock. Use Newton-Raphson iteration. Once p* and u* found, evaluate profiles at each x/t position using wave speeds. For visualization: plot 4 profiles (ρ, p, u, T) simultaneously. Also implement Godunov method using exact Riemann solver to show numerical solution converging to exact. Gotcha: the rarefaction is a smooth fan — sample it at all x/t values in the fan region, not just at the head/tail. Validate against the Sod shock tube problem (standard test case).
