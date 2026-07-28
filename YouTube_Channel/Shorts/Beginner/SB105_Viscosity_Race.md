---
title: "Honey vs Water: The Viscosity Race"
id: SB105
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, fluid-mechanics, viscosity, flow]
---

> **What it is:** A ~45-second simulation short where water and honey are released down identical 30° channels simultaneously, with the water blob surging to the finish line while honey has barely moved 10%, illustrating how molecular friction — viscosity — determines how fast a fluid can flow. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Honey vs Water: The Viscosity Race
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Two identical tilted channels (each 600px long, 60px wide, angled at 30°) fill the screen side by side against a black background. Left channel is labeled "WATER" in cyan; right channel is labeled "HONEY" in amber. Both channels are full of their respective fluids — water is bright blue, honey is deep amber-gold. A starting gate at the top of each channel is shown as a red horizontal bar. A "3… 2… 1…" countdown in white numerals flashes large in the center.

## Main Visual Sequence (0:03–0:50)
**0:03** — Both red starting gates drop simultaneously. Water immediately surges forward as a fast-moving blob with turbulent ripples. Honey oozes forward slowly, its leading edge thick and rounded.

**0:08** — The water blob has already traveled 60% of the channel. Honey has moved only 10%. Velocity arrows appear above each fluid: water arrow = 200px long (bright cyan), honey arrow = 20px long (amber). Ratio: "10× faster" label appears center-top.

**0:14** — Pause motion. Two annotation boxes appear:
  Left (water): "Viscosity: 0.001 Pa·s" in cyan
  Right (honey): "Viscosity: 10 Pa·s" in amber
  Below: "Honey is 10,000× more viscous than water."

**0:20** — Animation resumes. Water exits the bottom of the channel and splashes at the finish line (white burst effect). Honey is still 40% of the way down. A finish line flag appears at the bottom of the left channel; "WATER WINS" in bold white flashes.

**0:26** — A slow-motion replay plays for honey only (right channel). The internal flow profile appears: parabolic velocity arrows (Poiseuille profile) — fastest in the center of the channel, near-zero at the walls. Labels: "Wall friction slows edges."

**0:32** — Honey finally reaches the finish line at a crawl. "HONEY FINISHES" label appears, smaller, in amber. Timer shows: Water = 2.1 s, Honey = 22.4 s.

**0:38** — Split comparison screen: Left shows water atoms (blue circles) moving fast with long streamlines. Right shows honey molecules (amber hexagons) tangled with interlocking bonds, moving sluggishly. Label: "More molecular friction = higher viscosity."

**0:44** — Real-world icon row: motor oil (orange), glass (gray, "flows over 10,000 years!"), air (white), water (blue) — ranked on a viscosity scale bar from low to high.

**0:47** — Freeze. Bold white text: "Viscosity determines how fast fluids flow — and why honey is delicious slow."

## Physics Concept Teased
Viscosity is a fluid's resistance to flow, caused by internal friction between molecular layers moving at different speeds. High-viscosity fluids like honey (≈10 Pa·s) resist deformation strongly, while low-viscosity fluids like water (≈0.001 Pa·s) flow nearly freely. The flow rate through a channel is inversely proportional to viscosity (Hagen-Poiseuille law).

## On-Screen Text / Captions
- **0:00** — "3… 2… 1…" (white countdown, center, large)
- **0:08** — "10× faster" (white bold, center-top)
- **0:14** — "Viscosity: 0.001 Pa·s" (cyan, left box)
- **0:14** — "Viscosity: 10 Pa·s" (amber, right box)
- **0:14** — "Honey is 10,000× more viscous than water." (white, below boxes)
- **0:20** — "WATER WINS" (white bold flash, left channel finish)
- **0:26** — "Wall friction slows edges" (white italic, right channel replay)
- **0:32** — "Water: 2.1 s | Honey: 22.4 s" (white, split timer display)
- **0:38** — "More molecular friction = higher viscosity" (white, below split comparison)
- **0:47** — "Viscosity determines how fast fluids flow." (bold white, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo centered. Tagline: "Which fluid race should we do next? Comment below."

## Audio
Music: Energetic electronic race-style track, 120 BPM, drops in intensity after water wins. Sound effects: whoosh as water surges, slow viscous dripping sound for honey. A race-finish air horn plays when water exits. No voiceover.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: simulate each fluid as a particle blob moving at constant velocity proportional to 1/viscosity; draw the blob outline as a rounded convex hull of particles. Parabolic Poiseuille profile drawn as an array of horizontal velocity arrows, scaling as v(y) = v_max * (1 - (y/R)²). Runtime: real-time. Gotcha: honey blob leading edge needs a "sag" effect — apply a slight downward stretch to the blob shape each frame to mimic gravitational deformation of a viscous fluid.
