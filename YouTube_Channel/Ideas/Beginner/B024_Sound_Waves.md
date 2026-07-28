---
title: "What a Sound Wave Actually Is (Compression and Rarefaction)"
id: B024
difficulty: 1.5/10
prereq: "None"
concept: "Sound is a longitudinal pressure wave — molecules oscillate parallel to propagation direction"
tags: [physics, sound, waves, pressure, longitudinal, acoustics, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# What a Sound Wave Actually Is (Compression and Rarefaction)

**Alt title:** Sound Doesn't Move Air — It Moves Through Air (Here's the Difference)
**Difficulty:** 1.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Open on a speaker cone in extreme slow motion — a subwoofer pumping a 40 Hz bass note. The cone extends forward and retracts backward rhythmically. Now zoom into the air immediately in front of the cone with an animated visualization: a grid of individual air molecules. As the cone pushes forward, the nearest molecules bunch together — compression, higher pressure. The cone retracts — the near molecules spread apart — rarefaction, lower pressure. The compression zone doesn't stay near the speaker. It propagates outward at 343 m/s, carrying the pressure pattern to your ear across the room. But every individual molecule, after receiving the push, barely moves. It collides with its neighbor, transfers the momentum, and returns almost exactly to where it started. The wave travels; the air does not.

Drop the killer number: for a loud conversation at 70 dB SPL, the displacement amplitude of an individual air molecule is about 70 nanometers — roughly half the wavelength of visible light. One nanometer is about 5 atomic diameters. The wave carrying a clear speaking voice produces molecular displacements smaller than the wavelength of blue light. Yet the pressure wave reaches 343 m/s and can carry information across kilometers. This number — 70 nm — is not intuitive, and it immediately demonstrates that sound is about pressure propagation, not air movement. The hook ends with a question: "If the air molecules barely move, how does sound travel so fast and so far?"

## The Naive Attempt

Model sound as a transverse wave — the most familiar type of wave, since it is what everyone pictures first (water waves, waves on a string, light). Set up a row of 100 particles on a horizontal axis. Define the wave as a transverse displacement: each particle oscillates vertically (perpendicular to the horizontal propagation direction). The wave propagates from left to right across the canvas:

```javascript
for (let i = 0; i < N; i++) {
  const x = i * dx;
  const y_offset = A * Math.sin(k * x - omega * t);
  drawParticle(x, baseline + y_offset);
}
```

Run the animation. The particles bounce up and down in a smooth sinusoidal pattern, and the wave visually travels from left to right. It looks like a classic wave — beautiful, familiar, and completely wrong for sound. Add labels: "Direction of particle motion: vertical." "Direction of wave propagation: horizontal." "These are perpendicular — this is a transverse wave." Note that in the simulation, particles on either side of a "crest" are at the same horizontal position but different heights — there is no compression, no variation in particle density, no pressure variation. Every particle is at the same horizontal spacing from its neighbors at all times.

Walk through the implications out loud: in a transverse wave, neighboring particles push each other sideways. But air molecules push each other in all directions equally — they are compressible gas particles, not beads on a string. There is no lateral restoring force in air to sustain transverse oscillation. The model is physically inapplicable to gas-phase sound.

## The Moment of Failure

Play the transverse wave simulation at full speed. Highlight the problem: turn on a "nearest neighbor distance" indicator that draws a line between each particle and its right neighbor, colored by relative distance (red = compressed, blue = stretched, white = normal). In the transverse model, all these distances remain exactly equal — the horizontal spacing between particles never changes, because all motion is vertical. There are no red regions and no blue regions. The indicator stays a flat white line regardless of wave amplitude. There is no pressure variation — and pressure variation is literally the definition of a sound wave.

Then demonstrate the second failure: the wave speed. In the transverse model, wave speed is determined by the tension and linear density of the medium (v = √(T/μ)). But air has no tension — it is an isotropic, compressible gas. The formula for wave speed in air is v = √(γP₀/ρ), which depends on compressibility (how much pressure changes with density), not tension. The transverse model gives the wrong formula for the wrong physics. Sound speed in the transverse model would be tunable by arbitrarily changing a parameter that doesn't exist in real air. The simulation is fundamentally wrong, not just parametrically wrong.

## Why It Broke — The Physics

Sound is a longitudinal wave. In a longitudinal wave, particle displacement is parallel to the direction of wave propagation, not perpendicular. Each air molecule oscillates back and forth along the direction the wave is traveling — forward during compression, backward during rarefaction, returning to its equilibrium position on average. The physical mechanism is straightforward: a compressed region has higher density and pressure. The pressure gradient pushes adjacent molecules outward, compressing the next region. That region in turn pushes the next, and so on — the compression zone propagates like a domino chain, even though each domino (molecule) barely moves.

The particle displacement for a sound wave is:

**s(x, t) = s₀ · cos(kx − ωt)**

where s₀ is the displacement amplitude (in the direction of propagation). The pressure variation is related to the displacement by:

**ΔP(x, t) = −ρ₀ · c · ω · s₀ · sin(kx − ωt) = ΔP_max · cos(kx − ωt + π/2)**

Note that pressure variation is 90° out of phase with displacement — when displacement is maximum (particles displaced forward), pressure is at equilibrium; when pressure is maximum (particles at their rest position but in a compressed zone), displacement is zero. The pressure wave leads the displacement wave by a quarter cycle.

The speed of sound in an ideal gas:

**c = √(γP₀/ρ₀)**

where γ is the adiabatic index (γ = 1.4 for diatomic air), P₀ is ambient pressure (101,325 Pa), and ρ₀ is ambient density (1.225 kg/m³). Plugging in: c = √(1.4 × 101,325 / 1.225) = 343 m/s at 20°C. Temperature dependence: c ≈ 331 + 0.6·T m/s where T is in °C.

## The One Concept

Sound is a longitudinal pressure wave propagating through a compressible medium. The oscillating quantity is pressure (or equivalently, particle displacement along the propagation direction), not transverse displacement. Compressions (high pressure, high density) and rarefactions (low pressure, low density) alternate along the wave's path. The wave transports energy and information at 343 m/s in air, while individual molecules undergo sub-micrometer displacements.

**Physical intuition:** Think of a long line of people shoulder to shoulder. If the person at one end is pushed forward, they push the next person, who pushes the next, and so on. The "disturbance" (the push) travels down the line much faster than any individual person moves. In fact, if the person at the end received no push, they would barely know anything was happening. Air molecules in a sound wave are exactly these people — they transmit the disturbance at the speed of sound while individually oscillating by tiny amounts.

**Key equation:** Speed of sound c = √(γP₀/ρ₀) = 343 m/s in air at 20°C. Displacement amplitude: s₀ = ΔP_max / (ρ₀·c·ω). At 70 dB SPL and 1 kHz: ΔP_max ≈ 0.063 Pa, s₀ ≈ 47 nm.

**Real-world examples:**
1. **Speaker drivers:** The speaker cone moves longitudinally (in and out), directly creating longitudinal pressure waves. The cone displacement amplitude for a bass note is millimeters; the molecular displacement amplitude is nanometers.
2. **Ultrasound imaging:** Medical ultrasound uses longitudinal pressure waves at 1–20 MHz. The waves reflect off density interfaces between tissues, and the echo timing maps internal anatomy.
3. **Earthquake P-waves:** Primary seismic waves are longitudinal (compressional) waves that travel through the Earth's solid/liquid layers and arrive first at seismographs. S-waves (shear, transverse) travel slower and cannot propagate through the liquid outer core. This difference proved Earth has a liquid core.
4. **Thunder:** Lightning heats air to 30,000 K, explosively expanding it into a compression wave (sonic boom). The longitudinal pressure wave propagates at 340 m/s — dividing distance in km by 3 gives seconds to thunder.

## The Fix

Correct the particle motion to longitudinal. Each particle oscillates horizontally (along the propagation direction):

```javascript
for (let i = 0; i < N; i++) {
  const x_rest = i * dx;           // equilibrium position
  const displacement = A * Math.sin(k * x_rest - omega * t);
  const x_actual = x_rest + displacement;  // displaced position
  drawParticle(x_actual, baseline); // all particles on same horizontal line
}
```

Now particles move back and forth horizontally. Regions where `x_actual` values are closely bunched together are compressions (high pressure, high density). Regions where they are far apart are rarefactions (low pressure, low density). Render the compression/rarefaction visually: color the canvas background using the local particle density. Where particles are dense, shade the background red (high pressure). Where sparse, shade blue (low pressure). This produces the canonical pressure wave visualization — alternating red and blue vertical bands moving steadily to the right.

Add the pressure graph overlay: plot `ΔP(x, t) = −ρ₀·c·ω·A·sin(kx − ωt)` as a curve below the particle visualization. Show that the pressure peaks (red regions) align with the particle displacement zero crossings — the quarter-cycle phase offset is visible and labeled. Add a single highlighted particle and draw its displacement vs. time graph in a third panel — a simple cosine curve oscillating ±70 nm.

## The Wow Moment — Push It

Expand to a 2D circular wave propagating from a point source (a speaker). At the center, a pulsating point alternately pushes out (compression) and pulls in (rarefaction), creating expanding rings. Render the canvas as a pressure field using a 2D color map (red = compression, blue = rarefaction). At 60 fps the expanding rings are smooth and beautiful. Add a second source at a different position — watch the interference pattern emerge. Where two compressions meet: bright red, doubly loud. Where compression meets rarefaction: destructive interference, white (ambient pressure). The resulting interference fringes are the sound equivalent of double-slit diffraction.

Now add a wall with a small opening (slit) in it. The plane wave incident on the wall passes only through the slit and diffracts — spreading into a semicircular pattern on the other side. The narrower the slit relative to the wavelength, the wider the diffraction pattern. This is why you can hear someone talking around a corner — sound's long wavelength (34 cm at 1 kHz) diffracts readily around obstacles. Contrast with light's tiny wavelength (500 nm): light barely diffracts around everyday obstacles, which is why you can't see around corners.

Place four sources in a line (a speaker array) and show beam steering — by adding phase delays between sources, the interference pattern concentrates into a directed beam that can be steered by adjusting delays. This is how directional microphones, sonar arrays, and noise-cancelling headphones work. The 2D pressure field simulation makes this intuitively clear.

## The Interactive Demo

Full 2D browser canvas simulation of longitudinal pressure waves with real-time rendering.

**Controls:**
- **1D / 2D mode toggle:** Switch between the molecular visualization (1D row of particles with longitudinal motion) and the 2D pressure field view (color-mapped pressure with circular wave expansion).
- **Frequency slider** (20 Hz to 10,000 Hz): Changes wavelength. At low frequencies, compression bands are wide and slow. At high frequencies, they are narrow and fast.
- **Amplitude slider:** Controls wave intensity. High amplitude = deeper red/blue; visually shows that louder sound = larger pressure swing.
- **Wave speed slider:** Can be set to air (343 m/s), water (1,480 m/s), or steel (5,100 m/s). The wavelength changes accordingly with fixed frequency.
- **Source count:** Add 1, 2, or 4 point sources. Immediately shows superposition and interference.
- **Slit width slider:** In diffraction mode, adjust slit width relative to wavelength. Show how λ/slit_width determines diffraction angle.
- **Transverse/longitudinal toggle:** Switch between the wrong (transverse) and correct (longitudinal) models — the classic "compare to the failure" interaction.
- **Particle trajectory display:** Click any particle to highlight it and show its position vs. time graph.
- **Pressure graph:** Toggle the ΔP(x, t) overlay on the 1D view.
- **Room simulation:** Draw walls, corners, and openings. Watch reflections and diffraction occur in real time.
- **dB meter:** Display of current amplitude in decibels SPL.

## Production Notes

**Runtime target:** ~12 minutes. Hook: 1.5 min. Naive code: 2 min. Failure: 1 min. Physics: 3 min. Fix: 2 min. Wow moment: 2 min. Demo: 0.5 min.

**Screen layout:** The 1D molecular visualization is best shown in the top two-thirds of the canvas with the pressure graph below. Use a wide canvas (1200+ px) so individual particles are large enough to see their motion clearly. For the 2D pressure field, go full screen.

**Animations to pre-render:** (1) Speaker cone cross-section in slow motion with molecule visualization, (2) side-by-side transverse vs. longitudinal wave animation with arrows showing particle motion direction, (3) 3D molecule-level animation showing compression and rarefaction, (4) 70 nm scale comparison (human hair, red blood cell, light wavelength, molecular displacement).

**Key moments to zoom:** The moment when compression/rarefaction coloring first appears and makes the pressure variation visible, the interference pattern forming between two sources, and the diffraction around a corner.

**B-roll:** Speaker in slow motion (available from various YouTube channels), medical ultrasound machine, earthquake seismograph trace.

**Gotcha to address:** Explicitly state that the speed of sound is NOT about how fast molecules move (molecular speed at room temperature is ~500 m/s, faster than sound). Sound speed is about the rate of pressure disturbance propagation — two different things. This misconception is common.

## Tags

`physics` `sound` `waves` `pressure` `longitudinal` `acoustics` `javascript` `canvas`

## Thumbnail

The canvas is split vertically: left half shows the "wrong" transverse wave — particles bouncing up and down in a smooth sine wave, clearly labeled "WRONG" in red. Right half shows the "correct" longitudinal visualization — particles bunching and spreading horizontally with vivid red (compression) and blue (rarefaction) band coloring, labeled "REALITY" in green. A bold diagonal white dividing line separates them. Top text: "WHAT SOUND ACTUALLY IS" in large white sans-serif. The red compression bands on the right half are visually striking and immediately suggest something interesting is being shown — the conventional wave picture on the left is deliberately boring and familiar, making the contrast visceral. The emotion triggered is "wait, I've always thought of it wrong" — the thumbnail promises a mental model correction, which is highly clickable for science-curious developers and students.
