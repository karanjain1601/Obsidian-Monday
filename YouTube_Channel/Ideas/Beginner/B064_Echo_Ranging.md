---
title: "The Echo That Tells You How Far Away a Wall Is"
id: B064
difficulty: 1.5/10
prereq: "B024"
concept: "Round-trip echo time t = 2d/c; sonar, bat echolocation, ultrasonic ranging all use this; reflection occurs at acoustic impedance boundaries Z = ρc."
tags: [acoustics, echo, sonar, echolocation, distance-measurement, reflection, canvas, beginner]
category: beginner
type: video-idea
---

# The Echo That Tells You How Far Away a Wall Is

**Alt title:** "How Bats Navigate in the Dark (It's Just Math)"
**Difficulty:** 1.5/10 | **Prereq:** B024

---

## Opening Hook (0:00–1:00)

The screen is completely black. A single bat icon hangs at the left edge. It emits a short chirp — visualised as a tight burst of concentric arcs radiating outward. The arcs hit an invisible wall on the right side of the screen. They bounce back. The bat receives the returning echo 8 milliseconds later. The host overlays a ruler: "8 ms at 343 m/s means the wall is 1.37 metres away. The bat knew that. Without eyes. Without light. Using only the delay between emission and reception." The wall fades into view, confirming the measurement. Then the host cuts to a submarine scenario: a sonar ping radiates in all directions underwater, and a faint return echo arrives 0.6 seconds later from a sea-floor ridge. "0.6 seconds times 1480 m/s, divided by two: 444 metres deep. That's how depth sounders work." The key word — divided by two — sets up the entire video. Most viewers forget that sound must travel there and back.

## The Naive Attempt

The viewer writes a canvas simulation with a source dot on the left and a wall on the right. A circular wave pulse is emitted from the source at time t=0. The viewer writes the position update: `waveRadius += c * dt` each frame, where c = 343 m/s and dt = 1/60 second. When the wavefront (drawn as a thin arc) hits the right boundary, they note the current time. The host asks the viewer to compute the wall distance: `d = c * tHit`. They run the simulation, record tHit ≈ 0.02 s (for a 7-metre wall in canvas units), and compute d = 343 × 0.02 = 6.86 metres. "Close to 7, but not quite — let's see." The issue is the viewer used the one-way travel time and got approximately the right answer because the source is on the left wall (distance ≈ 0). But now the host moves the source to the middle of the room and fires a ping. The same code measures the echo return time — but now uses `d = c * tReturn` (full round trip time) and gets double the actual distance. The measurement is catastrophically wrong.

## The Moment of Failure

With the source placed at x = 50 m from a wall at x = 100 m, the real distance is 50 m. The echo takes 50/343 s to reach the wall and another 50/343 s to return: total round-trip time t_rt ≈ 0.292 s. The naive code computes `d = c * t_rt = 343 × 0.292 ≈ 100 m`. The simulation confidently displays "Distance: 100 m" — exactly double the actual 50-metre distance. The host draws a big red "2×" on screen and lets it sit for a moment. "Your depth sounder just told you the sea floor is twice as far as it really is. That's the kind of error that grounds ships." The fix is trivially obvious once the error is named, but the video uses this moment to teach why the factor of two is the whole point.

## Why It Broke — The Physics

Sound travels from source to reflector (distance d) and then back again (another d). The total path length is 2d, so the round-trip time is t = 2d/c. Solving for d gives:

**d = c × t / 2**

The division by two is not optional — it is the entire measurement principle. This formula underlies every echolocation and ranging technology. Acoustic impedance Z = ρc determines how much of the wave reflects versus transmits at a boundary. At a boundary between two media with impedances Z₁ and Z₂, the reflection coefficient is r = (Z₂ − Z₁)/(Z₂ + Z₁). At an air-wall boundary, Z_wall >> Z_air, so r ≈ 1: almost total reflection. At a water-mud boundary, the impedance mismatch is smaller, so some energy penetrates (sub-bottom profilers exploit this to map sediment layers). The echo amplitude is proportional to the reflection coefficient, which determines how detectable the return signal is.

## The One Concept

Echo ranging (also called time-of-flight ranging) is the universal distance measurement technique used by bats, dolphins, sonar systems, automotive parking sensors, medical ultrasound, LiDAR (using light instead of sound), and radar (using radio waves instead of sound). The principle is always d = c × t_round_trip / 2. The key variables are the signal speed c (which depends on the medium as we learned in B063) and the round-trip time t. For bats, c ≈ 343 m/s and they detect echoes down to about 1 ms delay, meaning they can resolve objects as close as 17 cm. For naval sonar, c ≈ 1480 m/s and the system can detect echoes from several seconds of delay, probing depths of kilometres. For medical ultrasound, frequencies of 1–20 MHz are used (much higher than hearing range) to achieve millimetre resolution inside the body. For parking sensors, the same principle operates at 40 kHz. The reflection occurs because of acoustic impedance mismatch: the greater the mismatch, the stronger the echo. A soft tissue-to-bone boundary in the body has strong reflection (explaining why bones appear bright white on ultrasound). A water-to-bubble boundary has near-total reflection (explaining why gas bubbles in the body block ultrasound completely).

## The Fix

The host adds a simple division by two to the distance computation: `const d = c * tRoundTrip / 2`. With this change, the simulation now correctly measures 50 m when the source is 50 m from the wall, regardless of the source's position. The host then generalises the simulation to support multiple walls: reflections arrive at different times, and each time is processed with d = c*t/2 to build a distance map. A small 2D radar-style display appears in the corner, with detected echo distances plotted as dots around the source — building a rough map of the room from echoes alone, exactly as a bat's brain constructs a spatial picture in real time.

## The Wow Moment — Push It

The host constructs a 2D room with six walls placed at irregular angles. The source fires pulses in all 360 directions (like a sonar sweep). Each outgoing ray is tracked; when it hits a wall it reflects (angle of reflection = angle of incidence) and returns. The return times are recorded and plotted on a polar display: a radar sweep that builds up a point cloud. After one complete rotation, the rough room shape is visible from the echo-map alone. The host then adds a moving obstacle — a slowly drifting box — and shows how the echo map updates in real time, tracking the obstacle's position. Finally they demonstrate the effect of impedance: a "soft" wall (low impedance mismatch) barely reflects, appearing faint on the radar, while a "hard" wall (high mismatch) produces a bright return.

## The Interactive Demo

- **Sound speed c (m/s):** slider 300–6000 m/s (allows switching between air, water, steel)
- **Source position:** click anywhere on canvas to reposition source
- **Wall positions:** drag handles to move walls
- **Pulse frequency toggle:** Single ping vs continuous sweep (radar mode)
- **Reflection coefficient slider:** 0.0 (anechoic, no reflection) to 1.0 (perfect mirror wall)
- **Show ray paths toggle:** draws individual ray lines and their reflection paths
- **Radar display toggle:** shows polar echo-distance map building up in real time

## Production Notes

The canvas should be dark with a black background (sonar aesthetic). Outgoing pulses should appear as bright cyan arcs, reflected pulses as slightly dimmer orange arcs. The radar display in the corner uses a classic green phosphor colour with a rotating sweep line. During the explanation of acoustic impedance, animate a split-screen at a boundary: incoming wave on the left, reflected wave going left and transmitted wave going right, with their amplitudes proportional to the reflection and transmission coefficients. Film the bat scenario first with a completely dark background and only the sound-arc visible — high drama before any explanation.

## Tags
`acoustics` `echo` `sonar` `echolocation` `distance-measurement` `reflection` `canvas` `beginner`

## Thumbnail

A bat silhouette on a pure black background, with a tight cone of green sonar arcs radiating forward and a clear returning echo arc. A distance ruler overlay reads "1.37 m" next to a wall. Bold yellow text: "How Does It KNOW?" Minimal, high-contrast, mysterious night-vision aesthetic.
