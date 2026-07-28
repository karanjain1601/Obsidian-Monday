---
title: "Echo: Sound Bouncing Off a Wall"
id: SB117
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, waves, sound, reflection]
---

> **What it is:** A ~45-second simulation short where blue arc waves expand from a clapping figure, strike a distant stone wall with a white flash, then return as yellow arc waves that reach the figure's ears seconds later with a bold "ECHO" label, demonstrating the d = v·t/2 formula used by bats and SONAR. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Echo: Sound Bouncing Off a Wall
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A flat top-down view of a scene: a stick figure (white, 30px) stands on the left side of the screen. On the far right, a solid gray stone wall (20px thick, full canvas height). The distance between figure and wall: 600px. Everything is silent. A text label appears above the figure: "You clap." The figure's hands come together — and then concentric arc waves explode outward.

## Main Visual Sequence (0:03–0:50)
**0:03** — The clap triggers a burst of 4 concentric pale-blue arc waves (semicircles, opening rightward) expanding from the figure's position. They are clearly labeled with their expanding radius in white: "r = 50px," "r = 100px," etc.

**0:08** — The wavefronts travel rightward at 343 m/s (displayed as: "v = 343 m/s" at the bottom). The leading wavefront reaches the wall (600px away). A "Wall hit!" flash occurs — the wall briefly glows white.

**0:12** — The wave reflects off the wall: new concentric arc waves now expand leftward (pale yellow, distinct from the incoming blue waves). The angle of reflection equals the angle of incidence — labeled at the wall contact point: "θ_in = θ_out = 0° (normal incidence)."

**0:18** — The reflected yellow wavefronts travel back toward the figure at the same speed. A timer appears center-screen: "t = 0.00 s" ticking upward. The figure waits.

**0:24** — The reflected wave reaches the figure. A yellow "ECHO" text flashes at the figure. Timer reads "t = 3.50 s" (for 600m distance: t = 2×600/343 ≈ 3.50 s). Note: for visual clarity in the animation, use a shorter scale — 600px represents 600 m; the actual simulation timer is scaled proportionally to show the physics.

**0:28** — Pause. The formula "d = v × t / 2" appears in gold at the top-center. Below: "d = 343 × 3.50 / 2 = 600 m." Each variable highlighted: d (white), v (blue), t (cyan).

**0:32** — Practical example: SONAR. A submarine icon appears at the left; a seabed line at the bottom. Sound waves radiate downward, hit the seabed, reflect up. Timer. Label: "SONAR: sound navigation and ranging." Formula reused: "d = v × t / 2."

**0:36** — Second practical example: BAT. A cartoon bat icon hangs at the left. An ultrasonic pulse (dotted wave, higher frequency shown as tighter ripples) fires, hits a fly icon, reflects back. Label: "Echolocation: bats ping at 20–100 kHz."

**0:40** — Return to original scene. Two echo scenarios compared:
  Case A: Wall at 100 m → "Echo arrives in 0.58 s" (too fast — merges with original clap, perceived as reverb)
  Case B: Wall at 600 m → "Echo arrives in 3.50 s" (clearly distinct echo)
  Label: "Echo needs >17 m distance to sound separate from original."

**0:44** — Animated replay at normal speed: the entire blue-wave-out / yellow-wave-back cycle completes once smoothly. Clean and satisfying.

**0:47** — Freeze. Bold white text: "Echo = reflection. Distance = speed × time / 2."

## Physics Concept Teased
An echo is the reflection of a sound wave off a surface back to the source. Since the sound must travel to the wall and back, the total time delay t = 2d/v, where d is the distance to the wall and v is the speed of sound. Echolocation (bats, dolphins, SONAR) uses this principle to measure distance: d = v × t / 2.

## On-Screen Text / Captions
- **0:00** — "You clap." (white italic, above figure)
- **0:08** — "v = 343 m/s" (white, bottom-left)
- **0:08** — "Wall hit!" (white flash, at wall)
- **0:12** — "θ_in = θ_out = 0°" (white, at wall contact)
- **0:18** — "t = 0.00 s" (cyan, live timer, center)
- **0:24** — "ECHO" (yellow bold flash, at figure), "t = 3.50 s" (cyan timer)
- **0:28** — "d = v × t / 2" (gold, top-center), "d = 600 m" (white, below formula)
- **0:32** — "SONAR: sound navigation and ranging." (white, submarine scene)
- **0:36** — "Echolocation: 20–100 kHz" (white, bat scene)
- **0:40** — "Echo needs >17 m to sound distinct from original clap." (white, comparison label)
- **0:47** — "Echo = reflection. Distance = speed × time / 2." (bold white, lower-center)

## End Card
**0:47–0:50** — Black background. "CodedLaws" logo. Tagline: "Follow — sound bounces everywhere."

## Audio
Music: Minimalist ambient with a distinct reverb effect — the music itself echoes with a delay matching the animation's wave travel time. Sound effects: a sharp hand-clap at 0:03; the same clap played back softer and slightly distorted at 0:24 (the echo). No voiceover.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: store wave emission time and source position; each frame, draw each wave's arc at radius = speed × (currentTime - emissionTime) × pixels_per_meter. For reflected waves, store the wall-hit position and time, then emit leftward-expanding arcs from the wall at the reflected timestamp. Use different colors (blue outgoing, yellow reflected) and stroke styles. Runtime: real-time. Gotcha: reflected waves are arcs expanding from the wall position, not re-emitting from the original source — a common mistake is to re-emit from the figure, which produces the wrong geometry.
