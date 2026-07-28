---
title: "Rocket Science Is Just Newton's Third Law"
id: SB124
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, newtons-laws, rocket]
---

> **What it is:** A ~45-second simulation short where a slow-motion rocket fires a stream of orange exhaust particles downward while paired action and reaction arrows of equal length pulse on screen — the spacecraft accelerates through a star field, stage-separates, and reaches orbital velocity, proving Newton's Third Law works perfectly in vacuum. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Rocket Science Is Just Newton's Third Law
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Pitch-black screen. A white rocket silhouette (nose up) sits motionless at center. Without warning, a dense orange-yellow jet erupts downward from the nozzle — rocket instantly bolts upward off screen. Text flashes: **"Newton's 3rd Law."** Silence for 0.5 s.

## Main Visual Sequence (0:03–0:50)
**0:03** — Rocket reappears at center, now in slow-motion (10× reduced speed). Background: pure black with subtle star field (200 white dots, radius 1 px, stationary). Rocket body: white tapered cylinder (80×160 px). Nozzle bell: grey trapezoid at bottom.

**0:08** — A cluster of 12 orange exhaust particles per frame begins streaming downward from the nozzle. Each particle: radius 4–8 px, color from bright yellow (#FFD700) at nozzle mouth fading to dark orange (#FF4500) then transparent over 60 frames. A large **orange arrow** labeled **"Action: F_exhaust ↓"** appears pointing downward, magnitude bar = 100 px.

**0:14** — Simultaneously, a large **white arrow** appears pointing upward from the rocket body center, labeled **"Reaction: F_rocket ↑"**. Both arrows pulsate at 1 Hz. Both magnitude bars are identical length (100 px). Text panel slides in from right: **"F = −F  (Newton's 3rd Law)"**.

**0:20** — Slow-motion rocket begins ascending. Speed readout (top-left, green monospace): **"v = 0 m/s → 50 m/s"** ticking up in real time. Star field begins scrolling downward slowly to imply upward motion. Exhaust trail thickens.

**0:26** — Panel freeze: rocket held at center. Two labeled vector boxes appear side-by-side — left box: orange background, **"Exhaust momentum: p = m_e × v_e ↓"**; right box: white background, **"Rocket momentum: p = m_r × v_r ↑"**. Center: **"Total Δp = 0"** (green, bold).

**0:32** — Simulation resumes real-time. Rocket accelerates. Exhaust plume widens and brightens (more particles per frame). Speed counter climbs to **"v = 2,000 m/s"**. Altitude counter appears (top-right, cyan): **"Alt: 10 km → 50 km"**.

**0:38** — First-stage separation: rocket splits; upper stage (white) continues up, lower stage (grey) drifts down left. Exhaust from upper stage ignites (brighter orange). Speed readout: **"v = 7,800 m/s"** (orbital velocity highlight in gold).

**0:42** — Upper stage exits frame top. Full black. Earth's blue limb appears at the bottom edge curving into view. Text center: **"Newton wrote this in 1687. It still launches every rocket today."**

## Physics Concept Teased
Newton's Third Law states that every action force has an equal and opposite reaction force; a rocket accelerates upward by expelling exhaust mass downward at high velocity — no air to push against is needed, making it work perfectly in the vacuum of space.

## On-Screen Text / Captions
- **0:03** — "Slow motion — 10×" (top-left, small grey italic)
- **0:08** — "Action: exhaust pushed DOWN" (orange label on down-arrow)
- **0:14** — "Reaction: rocket pushed UP" (white label on up-arrow)
- **0:14** — "F = −F" (center bold, 2 s hold)
- **0:20** — "No air needed — works in vacuum!" (top-center, cyan, bold)
- **0:26** — "Total momentum = 0 the whole time" (panel, green)
- **0:38** — "Stage 2 ignition" (top-left, white flash)
- **0:42** — "Newton wrote this in 1687." (center, white italic)

## End Card
Final 3 seconds: Black space background, Earth limb glowing blue at bottom. White bold text: **"For every action… follow CodedLaws."** Logo bottom-right, pulse once.

## Audio
Music: Slow, tense cinematic strings from 0:00–0:07; dramatic percussion kick at 0:08 when exhaust ignites; builds with rising brass and percussion through 0:38; triumphant resolution chord at 0:42. No voiceover. Sound effects: crackling rocket ignition whoosh at 0:03; low rumble sustain through ascent (volume tied to speed counter); sharp "thunk" at stage separation 0:38; silence at 0:42 for text impact.

## Production Notes
Code complexity: Medium. Renderer: Canvas 2D. Key visual trick: particle system for exhaust — spawn N particles per frame at nozzle position, each with randomized velocity (spread ±15° from straight down, speed 3–8 px/frame), apply slight drag, fade alpha linearly with age, remove when alpha < 0.01. Rocket motion: F_net = F_thrust - m*g (use constant thrust 500 N, mass 1000 kg decreasing by 1 kg/s as fuel burns). Arrow length: proportional to thrust magnitude, recomputed each frame. Stage separation: at t=38 s replace single rocket sprite with two independent bodies. Runtime: ~46 seconds. Gotcha: particle count explodes near end — cap at 500 active particles and use object pooling to avoid GC stutters.
