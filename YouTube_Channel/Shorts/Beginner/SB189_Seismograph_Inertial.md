---
title: "Seismograph: Why the Pen Stays Still"
id: SB189
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, geophysics, seismograph, inertia]
---

> **What it is:** A ~45-second simulation short where a seismograph shakes violently with the ground but its heavy spring-suspended mass stays nearly motionless in space — the relative motion scratching P-wave and S-wave arrivals onto a rotating drum that enable earthquake epicenter triangulation by inertia. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Seismograph: Why the Pen Stays Still

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
The ground shakes violently — cracks appear in orange floor tiles. A seismograph sits on the floor. The entire device shakes with the ground. But one part stays perfectly still: the suspended mass and pen. The pen scratches a wild trace onto the moving drum. Text appears: "Inertia does the work."

## Main Visual Sequence (0:03–0:50)
**0:03** — Clean side-view diagram of a horizontal-component seismograph. Frame (dark grey box, labeled "Frame — bolted to bedrock"). Inside: a heavy brass cylinder (the mass, 50 kg, gold color) suspended from the frame by a horizontal spring (red coil) and a vertical pivot. A thin pen arm extends from the mass downward to a rotating drum (white, paper covered).

**0:08** — Ground motion begins: a horizontal sinusoidal displacement waveform appears below the seismograph — green curve, amplitude 5 mm, period 1 s. The entire frame and drum shift left-right following the ground motion (exaggerated animation, ±1 cm visible movement).

**0:14** — Mass reaction: the heavy 50 kg mass on the spring does NOT follow the frame immediately. Inertia label: "F = ma — large mass resists acceleration". The mass stays nearly stationary in space while the drum moves under it. An arrow labeled "Relative motion = Ground motion" shows the displacement difference between mass and frame.

**0:20** — Pen trace appears in real time on the rotating drum — a sinusoidal waveform is drawn as the drum rotates and the paper passes under the stationary pen. Label: "Seismogram trace."

**0:26** — Earthquake signal introduced. A sudden large P-wave arrives (fast, small amplitude, vertical wiggles — labeled "P-wave: 6.2 km/s, compressional"). 8 seconds later an S-wave arrives (slower, larger amplitude, transverse wiggles — labeled "S-wave: 3.5 km/s, shear"). Waveform labels fade in on the seismogram trace.

**0:33** — Arrival time panel: ruler marks P-wave arrival at t=0, S-wave arrival at t=28 s. Label: "Δt = S−P = 28 s → Epicenter distance = 28 × 8 km = 224 km". Distance formula shown: d = Δt / (1/vS − 1/vP).

**0:40** — Global map shows three seismograph stations (red triangles). Three circles (radii 224 km, 310 km, 185 km) drawn around each station. Where all three circles intersect: a yellow star — the earthquake epicenter. Label: "Triangulation → Epicenter".

**0:45** — Final: the original seismograph in full with the complete seismogram scrolling past. Richter magnitude label: "M 6.4".

## Physics Concept Teased
A seismograph exploits Newton's first law: a large, spring-suspended mass resists ground acceleration due to inertia, remaining nearly stationary in space while the instrument frame moves with the earthquake; the relative motion between the mass and frame is the seismic signal.

## On-Screen Text / Captions
- **0:00** — "The ground shakes — but one thing doesn't. Here's why."
- **0:03** — "Frame follows bedrock | Mass resists by inertia"
- **0:08** — "Ground displacement: 5 mm, 1 Hz"
- **0:14** — "Mass (50 kg): F = ma — too much inertia to follow"
- **0:20** — "Relative motion → seismogram trace"
- **0:26** — "P-wave (6.2 km/s) arrives first — small & fast"
- **0:26** — "S-wave (3.5 km/s) arrives 28 s later — big & slow"
- **0:33** — "Δt = 28 s → Epicenter at 224 km"
- **0:40** — "3 stations → triangulate epicenter"
- **0:45** — "Magnitude: M 6.4"

## End Card
**0:47–0:50** — Dark background. Seismogram trace scrolling (white squiggly line on black). Bold text: "SEISMOGRAPH — Physics Series". "@CodedLaws". Subscribe button pulses.

## Audio
- **Music:** Deep, rumbling low-frequency ambient — bass drone that subtly shakes the speakers, 40 BPM. Tension builds through P/S wave arrival.
- **Voiceover:** "Newton's first law — an object at rest stays at rest — is what makes a seismograph work. The heavy mass simply refuses to move with the shaking ground." (0:14–0:26, deep calm male voice).
- **SFX:** Rumbling earthquake sound at 0:08 (low frequency, 10–20 Hz sine sweep); distinct sharp "thud" for P-wave arrival; larger "roar" for S-wave arrival at 0:26; pen scratching on paper (subtle, continuous).

## Production Notes
- **Renderer:** Manim or Python + Matplotlib. Seismograph cross-section as vector diagram with animated spring compression/extension. Ground displacement as separate animated waveform driving frame position.
- **Code complexity:** Medium. Key animation: show spring deformation in real-time as the ground oscillates — spring length changes slightly, but mass barely moves. Use scipy.signal to generate realistic P and S wave waveforms (different frequency content and amplitudes).
- **Key visual trick:** Draw the mass position (in absolute screen coordinates) as a faint white dot that stays nearly fixed, while a red dot tracks the frame. The growing gap between them — rendered as a vertical orange line — IS the seismogram signal, making the physics intuition visual.
- **Runtime:** P/S wave segment (0:26–0:33) must clearly label arrival times with timestamp marks on the seismogram trace. Allow 7 s for both arrivals to be fully visible.
- **Gotchas:** This design shows a horizontal seismograph — be explicit about component. A full seismograph station has 3 components (North-South, East-West, vertical). Vertical component would use a vertical spring; consider adding a note about this.
