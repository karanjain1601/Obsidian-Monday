---
title: "Symplectic Integrators: Hamiltonian Energy Conservation"
id: SA038
type: youtube-short
duration: "~45 seconds"
feeds_video: "Geometric Numerical Integration: Symplectic Methods and Energy Conservation"
difficulty: advanced
tags: [physics, simulation, short, advanced, symplectic, hamiltonian, energy-conservation, leapfrog, geometric-integration]
---

> **What it is:** A ~45-second simulation comparing a symplectic Stormer-Verlet integrator versus standard RK4 on a three-body system, showing the symplectic method conserving the Hamiltonian over millions of steps while RK4 drifts. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Geometric Numerical Integration: Symplectic Methods and Energy Conservation

# Short: Symplectic Integrators — Hamiltonian Energy Conservation

**Feeds full video:** Geometric Numerical Integration: Symplectic Methods and Energy Conservation

## Visual Hook (First 3 Seconds)
A pendulum (gold bob, black rod) traces its phase-space trajectory (q vs p) on a split screen. Left: Euler integrator — the ellipse spirals outward over 50 orbits (red spiral, energy drifting from 1.0 → 2.3 J). Right: Leapfrog/Störmer-Verlet — the ellipse stays perfectly closed (gold ellipse, E = 1.000 ± 0.001 J). "10,000 orbits. Energy never drifts."

## Main Visual Sequence (0:03–0:50)
- **0:03** — Hamiltonian system: H(q,p) = p²/2m + V(q) for a harmonic oscillator. Phase space shown as 2D plane (q horizontal, p vertical). True solution: closed ellipses. Symplectic condition: the integrator preserves the 2-form dq ∧ dp (phase-space area). "Liouville: area is conserved exactly."
- **0:10** — Leapfrog algorithm: half-step p_{n+1/2} = p_n − (Δt/2)∂H/∂q; full-step q_{n+1} = q_n + Δt ∂H/∂p_{n+1/2}; half-step p_{n+1} = p_{n+1/2} − (Δt/2)∂H/∂q. Three steps shown as gold arrows in phase space.
- **0:18** — Energy error comparison: log-scale plot of |H − H₀|/H₀ vs time (10,000 steps). Euler (red): linear drift 10⁻² per orbit → total error 100% at t=10,000. Leapfrog (gold): bounded oscillation at 10⁻⁶, no drift. RK4 (blue): initially better 10⁻⁸ but slowly drifts 10⁻⁴ after 10,000 steps.
- **0:27** — Backward error analysis: leapfrog exactly solves a modified Hamiltonian H̃ = H + Δt² H₂ + Δt⁴ H₄ + … . "The integrator is exact for a slightly different H — hence bounded energy error." Shown as dashed gold perturbed ellipse barely wider than true (white) ellipse.
- **0:35** — Higher order: Yoshida 4th-order symplectic (3 leapfrog steps with special coefficients c₁ = 1/(2−2^(1/3)), c₂ = -c₁/(2−2^(1/3))). Energy error: 10⁻¹² vs leapfrog 10⁻⁶. "Compose leapfrogs to get higher order."
- **0:43** — N-body astronomy: 1,000-year solar system integration. Yoshida 4th-order: planetary orbits stay stable (gold ellipses). Euler: Mercury ejected after 120 years (red spiralling out of frame). "Symplectic or wrong."

## Physics Concept Teased
Symplectic integrators preserve the symplectic 2-form dq ∧ dp of Hamiltonian mechanics exactly, which by Liouville's theorem means they conserve phase-space volume — this geometric property prevents secular energy drift over arbitrarily long simulations, unlike standard Runge-Kutta methods which eventually violate energy conservation.

## On-Screen Text / Captions
- **0:00** — "10,000 orbits. Energy never drifts." (white, top)
- **0:03** — "dq ∧ dp preserved — Liouville's theorem" (gold, phase-space annotation)
- **0:10** — "Leapfrog: three lines of code, infinite precision" (white, lower)
- **0:18** — "Euler: 100% error. Leapfrog: 0.0001%." (red/gold, comparison labels)
- **0:27** — "Backward error: integrator solves H̃, not H" (white, bottom bar)
- **0:43** — "Euler ejects Mercury. Yoshida doesn't." (white, bottom)

## End Card
Final 3 seconds: the solar system orbits glow in perfect golden ellipses. "CODED LAWS" in gold. Subscribe. "Next: Berry Phase →" teaser.

## Audio
Celestial orbital harmonic tone cycling at orbital frequency; contrast "crash" when Euler ejects Mercury; clean resolution chord on Yoshida reveal. 75 BPM ambient. No voiceover.

## Production Notes
Integrators: custom Python. Harmonic oscillator m = 1, k = 1, Δt = 0.1. Leapfrog: standard Störmer-Verlet. Yoshida 4th-order: 3-stage composition. RK4: classical 4-stage. N-body: Rebound code (Python), 8 planets + Sun. Initial conditions: DE440 ephemeris. Yoshida 4th-order Δt = 1 day. 1,000-year integration: 365,000 steps, 2 min wallclock.
