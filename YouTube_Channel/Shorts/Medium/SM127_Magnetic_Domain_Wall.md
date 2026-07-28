---
title: "Magnetic Domain Wall Motion"
id: SM127
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Magnetism_Materials_Full]]"
difficulty: medium
tags: [physics, simulation, short, magnetism, condensed-matter, materials-science, micromagnetics]
---

> **What it is:** A ~45-second simulation short where a thin domain wall separating blue (spin-up) and red (spin-down) regions slides through a ferromagnetic spin lattice under an applied field, then abruptly oscillates and slows at the Walker breakdown field — with a racetrack memory application shown at the end. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Magnetism_Materials_Full]]

# Short: Magnetic Domain Wall Motion
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
A slice of ferromagnetic material — grid of tiny arrows, each representing a magnetic moment. On the left, all arrows point up (blue domain). On the right, all arrows point down (red domain). Between them: a thin region where the arrows smoothly rotate from up to down. That thin region is the domain wall — and then a magnetic field is applied and it slides.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** 2D lattice of magnetization vectors (50×50 grid). Color-coded: blue for m_z = +1 (up), red for m_z = -1 (down), white/yellow for the transition zone. The Bloch wall structure visible: within the wall (width ~ 10–50 nm in real iron), the magnetization rotates continuously in the plane. Exchange energy density: A(∂m/∂x)² shown spiking at the wall.
- **0:10–0:18:** No applied field: the wall is stationary, pinned at an energy minimum. Zoom into the wall profile: m_z(x) = tanh((x-x₀)/δ), where δ = π√(A/K) is the wall width. A = exchange stiffness (energy/m), K = anisotropy constant (energy/m³). For iron: δ ≈ 40 nm. Wall width bar shown to scale vs. an atom.
- **0:18–0:28:** Magnetic field H applied parallel to the blue domain (upward). Zeeman energy gradient: the wall moves rightward to reduce energy. Wall velocity: v_wall = μ_wall·H, where μ_wall = γ·δ/α is the wall mobility (γ = gyromagnetic ratio, α = Gilbert damping). Field label: H = 10 Oe. Wall slides smoothly to the right — the blue (up) domain expands, red shrinks.
- **0:28–0:38:** Walker breakdown: above a critical field H_W = α·M_s/2, the wall starts to oscillate — its magnetization structure internally precesses. The wall velocity no longer increases linearly with H but oscillates. Velocity vs. field plot appears in corner: linear regime, then sudden drop and oscillation at H_W. This is the Walker breakdown.
- **0:38–0:45:** Racetrack memory concept: a magnetic nanowire with a series of domains (alternating up/down, representing bits 0 and 1). A current pulse shifts all domain walls simultaneously — the bit string moves along the wire. "IBM's Racetrack Memory concept" label. A schematic of the nanowire with reading/writing heads shown.

## Physics Concept Teased
A magnetic domain wall is the thin transition region between two magnetic domains with opposite magnetization. Its structure (Bloch or Néel type) is set by the balance of exchange energy (favoring smooth rotation over a wide distance) and anisotropy energy (favoring alignment with the easy axis over a short distance), giving wall width δ = π√(A/K). An applied field moves the wall at velocity v = μ_wall·H until the Walker breakdown field H_W, above which the wall oscillates and slows. Domain wall motion is the fundamental mechanism of magnetic switching and is exploited in racetrack memory.

## On-Screen Text / Captions
- **0:00:** "The boundary between magnetic opposites — and it can move."
- **0:08:** "Wall width: δ = π√(A/K) — exchange vs. anisotropy"
- **0:15:** "Applied field → wall moves → domain grows"
- **0:22:** "v_wall = μ · H  (below Walker field)"
- **0:30:** "Walker breakdown: above H_W, wall oscillates"
- **0:38:** "Racetrack memory: bits moved by wall motion."
- **0:44:** "Stuart Parkin's 2008 proposal — still being built."

## End Card
Final 3 seconds: the racetrack nanowire animation — alternating blue/red domains shifting along the wire under current pulses. Text: "The hard drive of the future may have no moving parts except domain walls." Channel logo.

## Audio
Subtle electromagnetic hum. Voiceover (precise, slightly academic): "The wall doesn't erase. It moves. Every bit, together, like beads on a string." When Walker breakdown hits (0:28): a discordant chord. Before breakdown: clean sine wave tone. Metallic click for each domain shift in racetrack.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key algorithm: 1D Landau-Lifshitz-Gilbert (LLG) equation: dm/dt = -γ(m × H_eff) + α(m × dm/dt), where H_eff = (2A/μ₀M_s²)·∂²m/∂x² + (2K/μ₀M_s)·m_z·ẑ + H_app. Discretize on 512 spins (grid spacing 1 nm). Initial condition: Bloch wall profile. Applied field H_app increased slowly to sweep through Walker breakdown. Walker field: H_W = α·M_s/2 ≈ 25 Oe for iron. Velocity measured as dX_wall/dt where X_wall is center of wall profile. Plot v vs. H in real time as a subplot. Color encoding: m_z → hue (blue=+1, red=-1, white=0). Gotcha: LLG has implicit damping term — use Cayley transform or Heun method to maintain |m|=1 constraint. Don't use naive Euler.
