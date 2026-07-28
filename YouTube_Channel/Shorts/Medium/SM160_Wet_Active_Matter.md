---
title: "Wet Active Matter — Pusher vs Puller Swimmers"
id: SM160
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone"
difficulty: medium
tags: [physics, simulation, short, active-matter, wet-active, pusher, puller, squirmer, hydrodynamics, microswimmer]
---

> **What it is:** A ~45-second simulation short where the Stokes flow fields around E. coli-like pusher and Chlamydomonas-like puller microswimmers are visualised side by side, revealing opposite 1/r² dipole patterns, and collective simulations show pushers generating bacterial turbulence while pullers form stable clusters, demonstrating how hydrodynamic interactions determine the fate of wet active matter suspensions. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone

# Short: Wet Active Matter — Pusher vs Puller Swimmers

**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
Microswimmers in water — E. coli-like bacteria swimming with their flagella. The flow field around each bacterium is shown: a pusher (E. coli) pushes fluid outward at the sides and draws it in from the front and back — an extensile dipole. A puller (Chlamydomonas algae) does the opposite — draws fluid in from sides, pushes from front/back. The flow patterns are dramatically different.

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — Stokes flow at low Re: at the microscale, Re = ρvL/μ << 1. Inertia is negligible (Stokes flow). The flow field far from a microswimmer decays as 1/r² (force dipole). Force dipole: two opposing Stokeslets separated by distance d. Pusher (extensile): 2 forces pointing away from the swimmer along the swimming axis. Puller (contractile): forces pointing inward. Caption: "Stokes dipole: force ∝ 1/r² — pusher (E. coli) vs puller (algae)."

**0:10–0:18** — Squirmer model: a spherical swimmer (radius a) with surface velocity prescribed. Squirmer parameters: B₁ (self-propulsion), B₂ (stresslet). β = B₂/B₁: β>0 pusher; β<0 puller; β=0 neutral. Exact Stokes flow solution outside the sphere. Caption: "Squirmer model: β = B₂/B₁ — pusher β>0, puller β<0."

**0:18–0:27** — Collective effects: a collection of pushers (β>0) shows enhanced diffusivity — they generate random flows that speed up their own diffusion D_eff > D_0. A collection of pullers (β<0) shows reduced diffusivity — they form stable clusters. Caption: "Pushers: enhanced mixing D_eff > D_0. Pullers: cluster formation." Show D_eff/D₀ vs packing fraction for pushers vs pullers.

**0:27–0:36** — Bacterial turbulence: a dense suspension of pushers (E. coli) at large concentrations (>1% volume) shows collective chaotic motion — "bacterial turbulence" — with power spectrum E(k) ∝ k^(-3) at length scales > 10 μm. Caption: "E. coli dense suspension: bacterial turbulence — E(k) ∝ k^(-3)." Qualitatively different from inertial turbulence.

**0:36–0:45** — Hydrodynamic coupling: pusher-pusher interaction is repulsive (they align and avoid); puller-puller is attractive (they can cluster). This explains why E. coli stays dispersed but algae aggregate. Caption: "Pushers: repulsive HI → stay dispersed. Pullers: attractive HI → aggregate." Bold text: "Wet active matter — microswimmers sculpt their own fluid." Fade to black.

## Physics Concept Teased
Wet active matter: microswimmers (bacteria, algae) in a viscous fluid at low Reynolds number. The swimming generates a Stokes force dipole: pushers (extensile, E. coli) and pullers (contractile, Chlamydomonas) produce opposite flow fields (1/r² decay). Collective effects: pusher suspensions show enhanced diffusivity and bacterial turbulence; puller suspensions cluster. The squirmer model provides exact Stokes solutions.

## On-Screen Text / Captions
- **0:00** — "Bacteria push, algae pull — opposite microswimmer flows."
- **0:05** — "Stokes flow: force dipole 1/r² — pusher vs puller"
- **0:12** — "Squirmer: β = B₂/B₁ — β>0 pusher, β<0 puller"
- **0:20** — "Pushers: enhanced mixing. Pullers: cluster formation"
- **0:28** — "E. coli turbulence: E(k) ∝ k^(-3) at dense suspensions"
- **0:35** — "HI: pushers repel, pullers attract — opposite fates"
- **0:43** — "Wet active matter — microswimmers shape their fluid."

## End Card
Final 3 seconds: the flow field of a pusher (streamlines diverging at the sides) vs a puller (streamlines converging at the sides). Text: "E. coli swims at 30 μm/s — 15 body lengths per second — faster than a cheetah relative to body length." CodedLaws logo.

## Audio
Quiet, microscopic ambient (underwater feel). Voiceover at 0:00: "At microscales where viscosity dominates, a swimming bacterium generates a very specific flow pattern — and pushers and pullers live in completely different hydrodynamic worlds." No other voiceover.

## Production Notes
Code complexity: complex. Renderer: WebGL or Canvas 2D. Key algorithm: squirmer model. Flow field: exact Stokes solution for a squirmer. u_r = (1-a³/r³)·U·cos(θ) + B₁(a/r)²·cos(θ)·(series); u_θ = exact. For N squirmers: compute hydrodynamic interactions via point-force (Oseen tensor): v_i += Σⱼ T_ij·F_j where T_ij = (1/8πμ)(I/r + r̂r̂/r) (Oseen tensor). Stresslet: second-order Stokeslet (adds 1/r² term). Simulation: N=100 squirmers in a periodic box. Compute D_eff = ⟨|x(t)-x(0)|²⟩/(2t) for each β. Runtime: CPU for N=100 with Oseen; Canvas 2D flowfield.
