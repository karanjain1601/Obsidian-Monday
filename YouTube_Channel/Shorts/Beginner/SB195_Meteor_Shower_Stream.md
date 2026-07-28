---
title: "Meteor Showers: Earth Crossing a Debris Stream"
id: SB195
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, astrophysics, meteor-shower, orbital-mechanics]
---

> **What it is:** A ~45-second simulation short where Earth plows through a golden ribbon of Comet Swift-Tuttle debris at 59 km/s, and because all particles travel parallel paths, the resulting meteors appear to radiate from a single point in Perseus — a perspective effect identical to parallel railroad tracks converging at the horizon. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Meteor Showers: Earth Crossing a Debris Stream

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Night sky, first-person view looking up. Meteors (bright white streaks with glowing tails) shoot out from a single point — the radiant — like fireworks. Counter in corner: "120 per hour". Text: "All from the same direction. Here's why."

## Main Visual Sequence (0:03–0:50)
**0:03** — Top-down solar system diagram. Sun (yellow, center). Earth's circular orbit (blue ring, 1 AU). A comet's elongated elliptical orbit shown (grey ellipse, e = 0.97, labeled "Comet 109P/Swift-Tuttle"). The comet passed perihelion in 1992 — label on diagram. The comet itself shown as a grey dot far from the Sun at aphelion, ~51 AU out.

**0:08** — Debris trail visualization. Along the comet's orbit near perihelion, a dense band of golden dots (dust and rocky debris, 0.1–10 cm particles) trails behind and ahead of the comet's 1992 position. The stream has a slight width (~0.01 AU, shown as a narrow golden ribbon). Label: "Debris stream deposited over centuries of comet passes."

**0:14** — Earth's orbit intersects the debris stream at one specific point on the orbital path. At the intersection, a calendar label appears: "Mid-August every year (Aug 11–13 peak)". Earth icon travels along its orbit. As it hits the debris stream: golden particles appear ahead of Earth.

**0:20** — Switch to perspective view. Earth (blue sphere) plows through the debris stream. Particles enter the atmosphere at 59 km/s (labeled) — much faster than a rifle bullet. Ablation trail: each particle (1 cm rock) heats from friction at 80 km altitude, glows white-yellow, leaves a glowing plasma trail 50 km long, then burns completely. Label: "Ablation height: 80 km | Speed: 59 km/s".

**0:28** — Radiant point geometry. Looking up from the night sky: all meteor tracks traced backward converge on one constellation point. Label: "Radiant: Perseus constellation → shower name: Perseids". Geometry explanation: parallel incoming particle paths appear to converge at a vanishing point — exactly like parallel railroad tracks converging at horizon.

**0:34** — ZHR (Zenithal Hourly Rate) graph: x-axis = date (Aug 8–16), y-axis = ZHR meteors/hour. Peak spike at Aug 12-13: ZHR = 100–150. Label: "Perseids peak: ~100–150 meteors/hour at radiant zenith."

**0:40** — Global Earth view with debris stream shown as a glowing golden band. Earth crosses it annually at the same point. Fast-forward: 12 Earth positions around the Sun, and at the same angular position every year, the debris band appears. Label: "Same spot every year — same shower every August."

**0:44** — Final: clear night sky photograph overlaid with animated Perseid streaks. Label: "Next Perseid peak: Aug 12, 2027."

## Physics Concept Teased
Meteor showers occur when Earth's orbit intersects a stream of debris left along a comet's orbit; all particles in the stream travel on nearly parallel paths, so they appear to radiate from a single sky point (the radiant) due to the perspective effect — and the shower recurs every year when Earth returns to that orbital crossing point.

## On-Screen Text / Captions
- **0:00** — "120 meteors per hour — all from one point. Here's the orbital reason."
- **0:03** — "Comet 109P/Swift-Tuttle: orbit e = 0.97"
- **0:08** — "Debris trail: centuries of comet passes"
- **0:14** — "Earth crosses the stream every mid-August"
- **0:20** — "Entry speed: 59 km/s | Ablation height: 80 km"
- **0:28** — "Radiant: Perseus — parallel paths → single vanishing point"
- **0:34** — "Perseids ZHR peak: 100–150 meteors/hour"
- **0:40** — "Same orbital crossing = same shower, every year"
- **0:44** — "Next Perseid peak: August 12, 2027"

## End Card
**0:47–0:50** — Dark starfield. Multiple white meteor streaks diverging from a single radiant point. Bold text: "METEOR SHOWERS — Physics Series". "@CodedLaws". Subscribe button pulses.

## Audio
- **Music:** Soft, wonder-filled ambient — gentle piano melody, sparse, 65 BPM. Each major meteor streak timed to a piano note.
- **Voiceover:** "Every particle in the stream travels on a nearly parallel path — so the perspective effect makes them all appear to come from one point in the sky, exactly the way railroad tracks seem to meet at the horizon." (0:28–0:40, warm, curious female voice).
- **SFX:** Soft whooshing sound for each simulated meteor in hook (0:00–0:03); crackling "fizzle" as particles ablate in atmosphere (0:20); silent, eerie deep space tone during orbital diagram.

## Production Notes
- **Renderer:** Python + Matplotlib for orbital diagram and ZHR graph; Blender or Pygame for the perspective meteor shower sky view.
- **Code complexity:** Medium. Orbital diagram: Keplerian ellipse for both comet and Earth. Debris stream: scatter 2000 golden dots near the orbit intersection with a Gaussian spread (σ = 0.005 AU cross-stream). Sky view: project parallel incoming vectors onto a hemisphere — converging radiant point emerges naturally from the 3D→2D projection.
- **Key visual trick:** In the sky view (0:28), draw all meteor tracks as white lines and then trace each one backward (dashed grey extension) until they all meet at the radiant dot. The visual convergence is the "aha" moment for the radiant concept.
- **Runtime:** ZHR graph (0:34–0:40) — animate the curve drawing from left to right in 6 s, with the peak spike appearing last and labeled.
- **Gotchas:** Distinguish between ZHR (theoretical, radiant at zenith, perfect conditions) and actual observed rate (typically 50–60% of ZHR). Note that a waxing gibbous Moon during peak can reduce visible rate substantially.
