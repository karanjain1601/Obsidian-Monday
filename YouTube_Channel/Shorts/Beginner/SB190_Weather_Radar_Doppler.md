---
title: "Doppler Radar: How Meteorologists See Wind"
id: SB190
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, geophysics, doppler-radar, meteorology]
---

> **What it is:** A ~45-second simulation short where a radar dish sweeps 360° building a velocity map of blues (rain rushing toward the antenna) and reds (rain rushing away), with a tight red-blue couplet just 3 km wide marking the tornado vortex signature — revealing how the Doppler frequency shift measures wind before a tornado touches down. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Doppler Radar: How Meteorologists See Wind

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Top-down radar display fills the screen. Blues and greens on the left, reds and yellows on the right. In the center of the velocity image: a tight red-blue couplet — the signature of a tornado. A white "TORNADO WARNING" banner flashes at the bottom. Text: "This is what a tornado looks like on radar."

## Main Visual Sequence (0:03–0:50)
**0:03** — Schematic of a WSR-88D (NEXRAD) radar. A white dish antenna (parabolic, 8.5 m diameter) sits on a grey tower. Azimuth rotation arrow (360° sweep). Elevation: 0.5° tilt above horizon. Label: "Transmits 10 cm (S-band) microwave pulses".

**0:08** — Radar pulse (thin red line) propagates outward from the dish. It hits a raindrop cluster (blue dot cluster, 50 km away). Part of the pulse backscatters (red dashed return line) toward the dish. Raindrop motion arrow shows the cluster moving AWAY from the radar (right-pointing arrow, 25 m/s).

**0:13** — Doppler shift panel. Transmitted frequency: f₀ = 2.8 GHz. Received frequency: f₀ − Δf (lower, because target moves away). Δf = 2v·f₀/c = 2×25×2.8×10⁹ / 3×10⁸ = 467 Hz. Label: "Positive velocity = moving away = RED on display".

**0:20** — Radar sweep animation: the antenna beam rotates slowly (3 RPM). As it sweeps, a velocity map builds up on the circular display (right panel). Colors fill in: blue region (left side of storm — rain moving TOWARD radar, −20 m/s), red region (right side — moving AWAY, +25 m/s). Green/grey = near-zero velocity (cross-beam motion).

**0:28** — Arrow map overlay on the velocity image: wind field arrows drawn from the color field. Counterclockwise cyclone pattern becomes visible. Label: "Mesocyclone: rotating updraft".

**0:33** — Zoom into the right portion of the storm. A tight couplet appears: a deep blue pixel (−30 m/s, inbound) immediately adjacent to a deep red pixel (+35 m/s, outbound). Label: "Tornado vortex signature (TVS)". Scale bar shows the couplet is only 3 km wide.

**0:38** — Overlay: satellite image of actual supercell thunderstorm matches the radar display. Radar in false color (blue-green-yellow-red-purple reflectivity) shows the hook echo shape. Label: "Reflectivity + Velocity together = storm structure".

**0:44** — Final: split screen — radar velocity map (left) with tornado warning polygon drawn (red outline), real-time wind barb map (right) showing 70 mph surface winds inside polygon.

## Physics Concept Teased
Doppler radar measures wind velocity by detecting the frequency shift in returned microwave pulses: rain drops moving toward the radar return a slightly higher frequency (blue on display), and drops moving away return a slightly lower frequency (red); a red-blue couplet on the velocity image is the tornado signature.

## On-Screen Text / Captions
- **0:00** — "This is what a tornado looks like on radar — before it touches down."
- **0:03** — "WSR-88D: 10 cm S-band pulse radar"
- **0:08** — "Return signal shifted in frequency by raindrop motion"
- **0:13** — "Δf = 467 Hz → v = 25 m/s away → RED"
- **0:20** — "Radar sweep builds velocity map"
- **0:20** — "Blue = toward radar | Red = away from radar"
- **0:28** — "Counterclockwise rotation = mesocyclone"
- **0:33** — "Red-blue couplet in 3 km = Tornado Vortex Signature"
- **0:38** — "Hook echo = supercell thunderstorm"
- **0:44** — "Velocity field → tornado warning in minutes"

## End Card
**0:47–0:50** — Dark background. Radar velocity display (blue-red couplet pulsing). Bold text: "DOPPLER RADAR — Physics Series". "@CodedLaws". Subscribe button pulses.

## Audio
- **Music:** Urgent, building ambient electronic — low drone with rising tension, synced to radar sweep rotation. 80 BPM.
- **Voiceover:** "The Doppler effect lets radar measure whether rain drops are moving toward or away from the antenna — and that's how meteorologists spot a tornado's rotation before it hits the ground." (0:13–0:30, direct, urgent female voice).
- **SFX:** Radar sweep "ping" sound rotating with the antenna (metallic beep every ~2 seconds); low ominous bass tone during tornado couplet reveal; tornado warning siren sample briefly at 0:33.

## Production Notes
- **Renderer:** Python + Matplotlib. Simulate a 360-point velocity scan: assign Gaussian velocity fields to simulated storm features; apply Doppler formula to generate radial velocity at each azimuth/range gate. Display as polar-to-Cartesian projection.
- **Code complexity:** Medium. Main computation is the radial velocity projection: v_radial = v_x·cos(θ) + v_y·sin(θ) where θ is the beam azimuth. Wind field can be a simple Rankine vortex superimposed on a background translation.
- **Key visual trick:** Render the tornado vortex signature (TVS) with a pulsing animation — the red-blue couplet alternates brightness at 2 Hz — making it immediately visually pop against the smoother background velocity field.
- **Runtime:** Sweep animation (0:20–0:28) — rotate at 3× actual speed (3 RPM × 3 = 9 RPM simulated) to complete one full scan in ~7 s of video.
- **Gotchas:** Doppler aliasing: at S-band with typical PRF, maximum unambiguous velocity is ±32 m/s — show velocity folding (aliasing) appearing at the storm core edges to add realism. Do NOT show the TVS in reflectivity display — it only appears in the velocity product.
