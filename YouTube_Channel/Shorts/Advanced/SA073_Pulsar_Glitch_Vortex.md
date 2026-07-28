---
title: "Pulsar Glitch — Vortex Unpinning in Superfluid"
id: SA073
type: youtube-short
duration: "~45 seconds"
feeds_video: "Pulsar Glitches: Quantum Superfluidity Inside Neutron Stars"
difficulty: advanced
tags: [physics, simulation, short, advanced, pulsar, superfluid, vortex, glitch]
---

> **What it is:** A ~45-second simulation showing superfluid vortex lines inside a neutron star unpinning en masse from nuclear lattice sites and suddenly transferring angular momentum to the crust to produce an abrupt pulsar spin-up glitch. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Pulsar Glitches: Quantum Superfluidity Inside Neutron Stars

# Short: Pulsar Glitch — Vortex Unpinning in Superfluid

**Feeds full video:** Pulsar Glitches: Quantum Superfluidity Inside Neutron Stars

## Visual Hook (First 3 Seconds)
A rotating star (white sphere, spinning at 716 Hz — PSR J1748-2446ad) is shown. Its spin frequency is plotted as a nearly flat red line. Then: a sudden jump — Δν/ν = 2×10⁻⁶ — the line leaps upward in a single step labeled "GLITCH." Inset shows a cross-section with cyan vortex filaments inside the crust. "Vortex avalanche — 10¹⁸ vortices unpin simultaneously."

## Main Visual Sequence (0:03–0:50)
**0:03–0:10** — The neutron star interior: the outer core contains a superfluid of neutron Cooper pairs (BCS-paired neutrons at T < T_c = 5×10⁹ K). The superfluid must rotate via quantized vortex lines — each carrying one quantum of circulation κ = h/2m_n = 2×10⁻⁷ m²/s. The vortex array is shown as a regular lattice of cyan filaments parallel to the spin axis.

**0:10–0:18** — The vortex pinning: as the pulsar spins down (due to magnetic braking, shown as a gradual frequency decrease: dν/dt = −10⁻¹⁵ Hz/s), the superfluid cannot reduce its angular momentum by annihilating vortices — they are "pinned" to the crystal lattice of the inner crust nuclei (shown as red anchoring pins at each lattice site). The spin lag builds: ΔΩ = Ω_crust − Ω_superfluid = 0.01 rad/s after years of spindown.

**0:18–0:26** — The unpinning event: when the Magnus force F_Magnus = ρ_sf·κ·ΔΩ per unit length exceeds the pinning force F_pin = V_pin·ρ_sf, vortices suddenly unpin in an avalanche. A cascade visualization: one vortex unpins (gold flash) → its neighbors experience increased force → chain reaction across the entire inner crust in ~10⁻³ seconds. 10¹⁸ vortices shown as a wave of gold flashes.

**0:26–0:34** — The glitch itself: the unpinned vortices migrate outward (from the superfluid to the crust), transferring angular momentum. The crust spins up: ΔΩ_crust = (I_sf/I_total)·ΔΩ_sf. For a glitch of Δν/ν = 10⁻⁶: I_sf/I_total = 1% of the star's moment of inertia participates. Plotted: the frequency jump on a millisecond timescale — a vertical step at t = 0, followed by slow recovery (exponential relaxation with τ = 30 days).

**0:34–0:42** — Vela pulsar glitch statistics: the Vela pulsar (ν = 11.19 Hz) glitches 1-2 times per year with Δν/ν ~ 10⁻⁶. A histogram of glitch sizes (log scale) shows a power-law distribution: N(Δν) ∝ (Δν)^(−1.2) — characteristic of self-organized criticality. The cumulative waiting time distribution (exponential) suggests a Poisson process at large scales.

**0:42–0:50** — Post-glitch recovery: after the Vela glitch, the frequency slowly decays back toward the pre-glitch extrapolation. This recovery is modeled as mutual friction between the superfluid vortices and the normal fluid (crust). Relaxation: Ω(t) = Ω_glitch·e^(−t/τ) + Ω_secular·t, with τ_1 = 3 days (fast), τ_2 = 30 days (slow). Fade to CodedLaws logo.

## Physics Concept Teased
Pulsar glitches are sudden spin-up events caused by the unpinning of quantized superfluid vortices in the inner crust of the neutron star, which transfer angular momentum to the rigidly rotating crust. The glitch size statistics follow a power law, suggesting self-organized criticality in the vortex pinning landscape.

## On-Screen Text / Captions
- **0:00** — "Glitch: Δν/ν = 2×10⁻⁶ in milliseconds"
- **0:06** — "Neutron superfluid: κ = h/2m_n = 2×10⁻⁷ m²/s"
- **0:12** — "Vortex pinning: spin-lag ΔΩ = 0.01 rad/s"
- **0:20** — "Magnus force > pinning force: vortex avalanche"
- **0:28** — "I_sf/I_total = 1% of star participates"
- **0:36** — "Vela glitch: N(ΔΩ) ∝ ΔΩ^(−1.2) power law"
- **0:44** — "Recovery: τ₁ = 3 days, τ₂ = 30 days"

## End Card
Final 3 seconds: the frequency glitch plot with the sharp step labeled, CodedLaws logo centered. CTA: "Full video → Pulsar Glitches and Superfluid Vortices."

## Audio
Ticking ambient at 716 Hz (matching pulsar spin) — a rapid mechanical tick. Sudden sharp crack sound on the glitch event. Deep bass swell during vortex avalanche visualization. No voiceover.

## Production Notes
Renderer: Vortex lattice simulation via point-particle Gross-Pitaevskii (2D slice). Vortex unpinning cascade: cellular automaton model on hexagonal lattice. Frequency glitch time series: Matplotlib with real Vela pulsar data. Glitch size histogram: power-law fit with scipy.stats. Interior cross-section: Three.js layered sphere with vortex line geometry. 60 fps, 1080×1920.
