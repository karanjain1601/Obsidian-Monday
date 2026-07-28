---
title: "Dark Matter: Galaxy Rotation Reveals Hidden Mass"
id: SB199
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, astrophysics, dark-matter, galaxy-rotation]
---

> **What it is:** A ~45-second simulation short where a rotation curve graph shows a yellow Keplerian prediction declining steeply while white observed data points stay stubbornly flat at 220 km/s out to 50 kpc — a discrepancy resolved only by adding a transparent purple dark matter halo six times more massive than all visible stars combined. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Dark Matter: Galaxy Rotation Reveals Hidden Mass

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Top-down galaxy (Milky Way analog) spinning. Stars near the edge moving — fast. Way too fast. A yellow "Expected" curve drops sharply at the galaxy edge. A white "Observed" curve stays flat. The gap between them glows purple — the invisible mass that must be there. Text: "Something is holding those stars in. We can't see it."

## Main Visual Sequence (0:03–0:50)
**0:03** — Top-down view of a spiral galaxy (white-blue stars, golden dust lanes, dark red center bulge). Radius scale bar: 0–50 kpc. Rotation arrows show: inner stars (near bulge) orbit quickly, outer stars orbit at same speed or faster — counterintuitive label: "Outer stars orbit as fast as inner stars?"

**0:08** — Split physics panel. Left: "What Newton predicts." A point-mass solar system analog: outer planets orbit SLOWER (Kepler's 3rd law). Orbital velocity formula: v(r) = √(GM/r) — a declining curve shown in yellow, labeled "Keplerian decline." For a galaxy with most mass in the central bulge: v should drop after ~5 kpc.

**0:14** — Right: "What we observe." Radio telescope dish (green) measures 21-cm hydrogen emission from neutral gas across the galaxy disk. Doppler shift of each gas cloud gives rotation speed at each radius. Data points plotted (white squares) on the same graph as the yellow prediction. The white squares stay flat at ~220 km/s from 5 kpc to 50 kpc. Label: "Flat rotation curve — Vera Rubin, 1970s."

**0:20** — Mass discrepancy calculation. At r = 30 kpc: observed v = 220 km/s. Predicted v (from visible mass only): 90 km/s. Visible mass alone would need to account for: M_visible(r < 30 kpc) = v²r/G = (90)²×30 kpc / G. But observed mass needed: M_total = (220)²×30 kpc / G — 6× larger! Label: "Visible mass accounts for only ~15% of total. 85% is missing → Dark Matter."

**0:27** — Dark matter halo visualization. The spiral galaxy (white-blue disk) shown in center. A large spherical halo (transparent purple, radius 200 kpc — 4× the visible disk) surrounds it. Halo density profile shown as NFW profile curve (ρ ∝ 1/(r/r_s)(1 + r/r_s)²). Label: "NFW Dark Matter Halo: r_s = 20 kpc." The halo mass enclosed grows as M(r) ∝ ln(r) — shown on mass profile graph inset.

**0:33** — Model reconciliation. With halo mass added: recalculate v(r) = √(G(M_visible + M_halo)/r). New theoretical curve (purple-white) now matches the observed flat curve exactly. Label: "Dark matter halo reconciles rotation curve." Graph shows: yellow (visible only, declining), purple (DM halo, rising), white combined (flat). Perfect match with data points.

**0:40** — Evidence for dark matter summary panel. Three independent evidence types listed with icons:
  1. Rotation curves (galaxy icon) — "Flat curves across 1000s of galaxies"
  2. Gravitational lensing (arc icon) — "Bullet Cluster: matter offset from gas"
  3. CMB power spectrum (wave icon) — "Acoustic peak positions require DM"
  Label: "Three independent lines of evidence."

**0:44** — Final: zoom out to large-scale structure. Cosmic web of filaments (dark matter skeleton, blue-purple) with bright galaxy clusters at nodes. Label: "Dark matter: 27% of universe. Ordinary matter: 5%. Still unknown what it is."

## Physics Concept Teased
Galaxy rotation curves reveal that orbital speeds remain flat far beyond where visible mass should cause Keplerian decline; the only explanation consistent with Newtonian gravity is a massive invisible dark matter halo (NFW profile) extending to 200 kpc — contributing 85% of the total galaxy mass.

## On-Screen Text / Captions
- **0:00** — "Outer stars orbit too fast. The missing mass is invisible. Here's the evidence."
- **0:03** — "Spiral galaxy: disk radius ~50 kpc"
- **0:08** — "Newton's prediction: v = √(GM/r) → speed drops with distance"
- **0:14** — "Observed: rotation curve stays flat at 220 km/s to 50 kpc"
- **0:14** — "Vera Rubin measured this in the 1970s"
- **0:20** — "Visible mass: 15% | Dark matter: 85% of total"
- **0:27** — "NFW dark matter halo: radius 200 kpc, transparent, undetectable"
- **0:33** — "Halo + visible mass → flat curve matches data"
- **0:40** — "3 independent proofs: rotation curves, lensing, CMB"
- **0:44** — "Dark matter: 27% of universe. Unknown particle."

## End Card
**0:47–0:50** — Black background. Spiral galaxy with faint purple dark matter halo. Rotation curve graph (flat white line over declining yellow). Bold text: "DARK MATTER — Physics Series". "@CodedLaws". Subscribe button pulses purple.

## Audio
- **Music:** Deep, mysterious electronic — low bass rumble, sparse high notes, 55 BPM. Feels like searching in the dark.
- **Voiceover:** "Vera Rubin measured hundreds of galaxies in the 1970s and found the same impossible result every time: stars at the edge orbit just as fast as stars near the center. The only explanation: invisible mass, everywhere." (0:14–0:32, clear, authoritative female voice).
- **SFX:** Radio telescope "static" sound during 21-cm observation (0:14); soft "pop" as each data point appears on the rotation curve graph; deep resonant hum as dark matter halo materializes (0:27).

## Production Notes
- **Renderer:** Python + Matplotlib for rotation curve graph (main visual focus); Matplotlib 3D or Blender for halo sphere visualization. Galaxy disk: procedural generation with logarithmic spiral arms.
- **Code complexity:** Medium. Rotation curve: compute v(r) = √(G[M_bulge(r) + M_disk(r) + M_halo(r)]/r) where each mass component is an analytic profile (Hernquist for bulge, exponential disk, NFW for halo). Plot all three components separately then combined.
- **Key visual trick:** The rotation curve graph is the star of this short — make it large, clear, and animated: yellow Keplerian curve draws first (drops off), then white data points appear (flat), then purple reconciliation curve overlays exactly. The moment the purple curve matches the white dots is the physical payoff.
- **Runtime:** Mass discrepancy calculation (0:20–0:27) — animate the numbers computing on-screen step by step (7 s). The math should be visible but not require reading — labels do the explaining.
- **Gotchas:** Do NOT say dark matter is "proven" — it is the leading hypothesis consistent with all observations. Briefly note MOND (Modified Newtonian Dynamics) as an alternative that also explains rotation curves but fails at larger scales (Bullet Cluster).
