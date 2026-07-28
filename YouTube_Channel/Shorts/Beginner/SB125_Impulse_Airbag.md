---
title: "Why Airbags Save Lives: Impulse Physics"
id: SB125
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, impulse, momentum]
---

> **What it is:** A ~45-second simulation short showing a split-screen car crash where the no-airbag side produces a towering red force spike of 80,000 N lasting 0.003 s while the airbag side shows a low green plateau of 4,000 N over 0.06 s — both shaded areas equal 240 N·s, demonstrating that extending collision time slashes peak force and saves lives. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Why Airbags Save Lives: Impulse Physics
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Side-view silhouette of a car crashing into a wall at 60 km/h. Red "WITHOUT AIRBAG" label. Head-shaped circle (grey) smashes into the dashboard — bright red flash, skull-crack sound effect (stylized, not gory). Screen shakes. Hold 1 second.

## Main Visual Sequence (0:03–0:50)
**0:03** — Screen splits vertically. Left panel: dark grey, label **"No Airbag"** (red). Right panel: dark blue, label **"With Airbag"** (green). Both show a side-view car interior: steering wheel on left, seat on right, crash dummy head (circle, flesh-tone, radius 20 px) moving right at constant speed (arrow, red, labeled **"60 km/h"**).

**0:08** — Both panels play simultaneously. Left (No Airbag): head hits dashboard (grey rectangle). Force graph below left panel shows a single ultra-tall, ultra-narrow spike — peak **"~80,000 N"** in red — lasting only **"~0.003 s"** (labeled with brackets). Right (With Airbag): white balloon deploys from steering wheel (circle expanding from radius 0 to 100 px in 0.1 s, white fill with grey border). Head embeds into airbag.

**0:15** — Both force graphs are now visible side-by-side (white axes, x-axis = time in seconds, y-axis = Force in kN). Left graph: red spike reaching 80 kN, width ~0.003 s. Right graph: green plateau reaching ~4 kN, width ~0.06 s. Areas under both curves are shaded — both shaded areas labeled **"J = 240 N·s"** (same value, yellow). Arrow annotation: **"Same impulse, different force!"**

**0:22** — Equation panel slides in from the bottom (black card): large white text: **"Impulse J = F × Δt"**. Below: two columns — Left: **"J = 80,000 × 0.003 = 240 N·s"** (red); Right: **"J = 4,000 × 0.060 = 240 N·s"** (green). Third row: **"Same J — but force 20× lower!"** (bold yellow).

**0:28** — Animation resumes. Left dummy: bounces back from dashboard with a red X over it (dramatic but cartoon-styled). Right dummy: slowly decelerates into airbag, stops gently, airbag deflates (small holes visible), dummy fine. Smiley face emoji (green) appears above right dummy.

**0:33** — Diagram: timeline bar (0 to 0.1 s). Two colored bands: red narrow band (no-airbag contact time) and green wide band (airbag contact time). Below each, force arrow scaled proportionally. Text: **"Longer Δt → Smaller F → Survivable"**.

**0:39** — Pull-out fact box (white card on dark blue): **"Modern airbags inflate in 0.03 s — faster than a blink."** Below: **"They deflate in 0.1 s so you can escape."** Small airbag icon (white balloon, grey car outline).

**0:43** — Full-screen text (bold white on black): **"Impulse = F × Δt. Airbags buy time. Time saves lives."**

## Physics Concept Teased
Impulse (J = F·Δt) equals the change in momentum; since stopping a person requires a fixed impulse, extending the collision time (via an airbag) dramatically reduces the peak force on the body, preventing fatal injury.

## On-Screen Text / Captions
- **0:00** — "WITHOUT AIRBAG — 60 km/h crash" (red, top-left)
- **0:03** — "No Airbag" / "With Airbag" (panel labels, red/green)
- **0:08** — "Force: ~80,000 N" (red spike label, left panel)
- **0:08** — "Force: ~4,000 N" (green plateau label, right panel)
- **0:15** — "Same impulse J = 240 N·s" (yellow, both graphs)
- **0:22** — "J = F × Δt" (large equation, white)
- **0:22** — "20× lower force with airbag!" (bold yellow)
- **0:33** — "Longer Δt → Smaller F → Survivable" (center, green)
- **0:43** — "Impulse = F × Δt. Airbags buy time. Time saves lives." (center, white bold)

## End Card
Final 3 seconds: White airbag balloon on dark blue fades to CodedLaws logo. Text: **"Follow for physics that could save your life."**

## Audio
Music: Low tense ambient hum from 0:00–0:08; crash sound effect + hard percussion hit at 0:08 (no-airbag side); soft thud + whoosh (airbag deploy) on right side simultaneously; building snare drum roll from 0:15–0:22 under equation reveal; calm resolution piano chord at 0:43. No voiceover. Sound effects: tire screech before impact, hard crack (no-airbag), airbag pop + fabric rustle (airbag side).

## Production Notes
Code complexity: Low-Medium. Renderer: Canvas 2D. Key visual trick: force graphs drawn in real-time alongside the animation — map simulation time to x-axis, current contact force to y-axis, draw with ctx.lineTo each frame. No-airbag force: model as a spring (k=2,000,000 N/m) with very small compression distance. Airbag force: model as a soft spring (k=80,000 N/m) with larger compression. Both produce same total impulse (area under curve) by design. Shaded area: accumulate area with a running sum, display as text when simulation completes. Airbag balloon: expand radius from 0 to 100 in 9 frames (3 frames = 0.05 s at 60 fps), then shrink over 60 frames. Runtime: ~46 seconds. Gotcha: the force spike in no-airbag scenario may be too brief to see — slow down playback to 1/10 speed for the first 2 seconds of contact only, then resume normal speed.
