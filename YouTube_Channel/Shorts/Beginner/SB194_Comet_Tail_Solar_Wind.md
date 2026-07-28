---
title: "Comet Tails: Always Point Away From the Sun"
id: SB194
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, astrophysics, comet, solar-wind]
---

> **What it is:** A ~45-second simulation short where a comet swings around the Sun trailing a curved yellow dust tail pushed by radiation pressure and a straight blue ion tail driven by solar wind — and even after perihelion when the comet moves away from the Sun, both tails still point anti-sunward, revealing two distinct tail-forming forces. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Comet Tails: Always Point Away From the Sun

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A comet (grey rocky nucleus) swings around the Sun (yellow sphere, center). Zoom to the comet: two distinct tails trailing behind and pointing to the right — one yellow curved trail, one straight blue spike. As the comet swings PAST the Sun and moves away, the tails STILL point toward the right (away from Sun) — even though the comet is now moving right-to-left. Text: "The tails don't follow the motion."

## Main Visual Sequence (0:03–0:50)
**0:03** — Top-down orbital diagram. Sun (yellow, center). Comet nucleus (grey rocky ellipsoid, 5 km diameter) on a highly eccentric orbit (labeled "e = 0.99"). Orbital path shown: long thin ellipse. At perihelion (closest to Sun), the comet is 0.5 AU from the Sun. Label: "Perihelion: 0.5 AU — comet heats up rapidly."

**0:08** — Close-up on the comet nucleus. As it nears the Sun, surface ices (water, CO₂, methane) sublimate. Venting jets (blue wisps) spray gas and dust outward in a teardrop coma (diffuse white envelope, 100,000 km wide). Label: "Coma: ~100,000 km | Nucleus: 5 km".

**0:14** — Two tail formation animations side by side:
  - Left: "Dust Tail (yellow)". Dust particles ejected from coma. Radiation pressure (yellow sunlight arrows) pushes dust backward along the orbit. Dust tail curves gently following the comet's orbital path. Label: "Dust tail: follows orbit, yellow/white, curved."
  - Right: "Ion Tail (blue)". Gas molecules ionized by solar UV. Solar wind (thin white arrows radiating from Sun) sweeps ions directly ANTI-SUNWARD at 400–800 km/s. Ion tail is perfectly straight, pointing directly away from Sun. Label: "Ion tail: straight, blue, anti-solar direction."

**0:22** — Animation: comet moves along the full orbit. At 4 positions (approaching, perihelion, receding, aphelion), pause and show both tail directions. Key moment: when the comet is moving AWAY from the Sun (right to left), BOTH tails still point away from the Sun (leftward) — not behind the comet. The comet is moving tail-first. Label: "Comet moves TAIL-FIRST after perihelion."

**0:32** — Solar wind vector field overlay: white arrows radiating outward from the Sun in all directions uniformly. The ion tail vector at each comet position is parallel to the local solar wind arrow. Label: "Ion tail direction = instantaneous solar wind direction." A brief solar flare event causes a tail disconnection event — ion tail kinks and detaches, then reforms (2 s animation).

**0:38** — Scale comparison: nucleus (5 km, white dot) — too small to see. Coma (100,000 km, white haze) — visible in small telescope. Ion tail (100 million km = 0.67 AU, blue line extending across diagram). Dust tail (50 million km, yellow arc). Label: "Tail: 100 million km long — yet nucleous is only 5 km."

**0:44** — Final: the comet's full orbit with dual-tail animation at every point. "Ion tail always points from Sun → comet → away." Arrow convention confirmed.

## Physics Concept Teased
A comet has two distinct tails: a yellowish curved dust tail pushed by radiation pressure following the orbital path, and a straight blue ion tail driven directly anti-sunward by the solar wind at hundreds of km/s — so both tails always point away from the Sun regardless of the comet's motion direction.

## On-Screen Text / Captions
- **0:00** — "Comet tails don't trail behind — they flee from the Sun."
- **0:03** — "Orbit: e = 0.99 | Perihelion: 0.5 AU"
- **0:08** — "Sublimating ices → coma (100,000 km wide)"
- **0:14** — "Dust tail: radiation pressure, curved, yellow"
- **0:14** — "Ion tail: solar wind, straight, blue"
- **0:22** — "After perihelion: comet moves TAIL-FIRST"
- **0:32** — "Ion tail = solar wind direction indicator"
- **0:38** — "Ion tail length: 100 million km"
- **0:44** — "Ion tail always: Sun → nucleus → away"

## End Card
**0:47–0:50** — Black space. Comet with dual tails (yellow dust curved, blue ion straight) against starfield. Bold text: "COMET TAILS — Physics Series". "@CodedLaws". Subscribe button pulses.

## Audio
- **Music:** Sweeping, cosmic orchestral — strings and synth, slow and majestic, 55 BPM. Tail formation sections highlighted with harp glissando.
- **Voiceover:** "Radiation pressure and solar wind are two completely different forces — that's why comets have two different tails, each telling us something different about the interplanetary environment." (0:14–0:30, clear, curious female voice).
- **SFX:** Hissing sublimation sound as comet nears Sun (0:08); wind-like whoosh for solar wind arrows (0:14); deep crack for tail disconnection event (0:32).

## Production Notes
- **Renderer:** Python + Matplotlib. Orbit drawn as a Keplerian ellipse. Dust tail computed by integrating ejected dust positions under gravity + radiation pressure (β = radiation-to-gravity force ratio ≈ 0.5 for typical dust). Ion tail: simply draw anti-solar vector from nucleus.
- **Code complexity:** Medium. Dust tail syndyname/synchrone calculation for accuracy: compute β-plane at each ejection time. Simpler approach: use a curved polynomial fit pointing sunward offset from the orbital tangent.
- **Key visual trick:** At the "comet moves tail-first" moment (0:22), draw a large white velocity vector arrow showing the comet's direction of motion — then show BOTH tails pointing the opposite way. This juxtaposition is the "aha" moment.
- **Runtime:** Four-position orbit tour (0:22–0:32) at each position hold 2 s — total 8 s.
- **Gotchas:** The dust tail is NOT simply the orbit path — dust with different β values forms a fan of synchrones. Show at least two dust grain types (β = 0.2 and β = 0.8) to convey that the dust tail has width. Ion tail should not be drawn curved.
