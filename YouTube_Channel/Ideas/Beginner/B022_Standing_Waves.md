---
title: "Why Guitar Strings Have Harmonics (Standing Waves in Code)"
id: B022
difficulty: 2/10
prereq: "None"
concept: "Standing waves on a fixed-fixed string: f_n = nv/2L"
tags: [physics, waves, standing-waves, harmonics, guitar, resonance, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why Guitar Strings Have Harmonics (Standing Waves in Code)

**Alt title:** The Secret Geometry Inside Every Musical Note
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Open on a macro slow-motion shot of a guitar string being plucked — shot at 10,000 fps so the motion is clearly visible. The string does not oscillate in a simple sine wave. It wrinkles, kinks, and flexes in a complex snake-like pattern that defies easy description. This is NOT what most people picture when they think of a vibrating guitar string. The motion is a superposition of many frequencies all vibrating simultaneously — the fundamental plus the 2nd, 3rd, 4th, and higher harmonics. That composite motion is what gives a guitar its distinctive timbre as opposed to a flute or a piano playing the same pitch.

Now show a guitarist pressing lightly on the string exactly at the 12th fret — the midpoint — and plucking. The resulting note is one octave higher, clear and bell-like, called a "harmonic." The guitarist didn't stop the string; they eliminated the fundamental and lower harmonics by touching a node, leaving only the harmonics that have a node at that exact point. Touch at the 7th fret (1/3 of the string): the note jumps to a fifth above the octave. Touch at the 5th fret (1/4): two octaves up. This is standing wave physics expressing itself as music.

Cut to the simulation: first show the string in its fundamental mode — a single gentle arch. Then switch to second harmonic — two arches. Third harmonic — three arches. The arches are "antinodes" and the still points are "nodes." Now blend all harmonics together and the complex snake-like motion of the slow-motion footage reappears. The whole video is about understanding that superposition.

## The Naive Attempt

Start with the simplest possible wave model: a single traveling sinusoidal wave moving along the string. Define the string as 400 pixels wide with 200 discrete points. The wave is described as: `y(x, t) = A * Math.sin(k * x - omega * t)`. Choose k (wavenumber) and omega (angular frequency) to give a visually clear wave. Render each point at its y-displacement. Run the animation. The wave propagates from left to right across the canvas. Visually this looks like a wave — it's a correct traveling wave.

Now add fixed endpoints: clamp y(0) = 0 and y(L) = 0 at every frame. After clamping, run the simulation again. The endpoints are forced to zero, but the wave still travels — it simply vanishes off the right edge and reappears from the left edge. There is no reflection happening. The boundary condition is satisfied at the endpoints in appearance only, but not in physics. The string looks like it's "flowing" rather than oscillating in place. No standing wave forms because there is only one traveling wave component — there is no reflected wave to interfere with.

Walk through the code explicitly, highlighting the single `sin(kx - ωt)` term. Say: "This is a wave moving in one direction. A guitar string is bounded at both ends. When the wave hits an endpoint, it must reflect. I forgot to add the reflected wave." This sets up the fix cleanly.

## The Moment of Failure

The simulation runs with the boundary-clamped traveling wave. What the viewer sees: a sinusoidal wave that appears to flow smoothly from left to right, with both endpoints visually held at zero. It looks plausible at first glance — the endpoints don't move, the wave has the right shape. But watching it for two seconds reveals the problem: the wave is traveling, not standing. The individual "points" on the string are not oscillating up and down in place — they are tracking the wave as it moves. A real guitar string's midpoint oscillates up and down with maximum amplitude; the midpoint in this simulation barely wobbles as the wave passes through.

Switch to a different visualization: color each string segment red when it is above the rest position and blue when below. In the traveling wave model, the color pattern moves steadily from left to right — like a conveyor belt. In a real standing wave, the coloring would alternate — all segments above, then all segments below, then all above — in synchrony, with permanent nodes showing as always-white. The traveling wave failure is obvious when visualized this way. There are no nodes, no antinodes, no standing structure. The "guitar string" looks like a river flowing sideways.

## Why It Broke — The Physics

A guitar string has two fixed endpoints. When a traveling wave reaches a fixed endpoint, it must reflect with an inversion (phase flip of 180°) because the endpoint cannot move — any displacement at the endpoint must be immediately countered. This produces a second wave traveling in the opposite direction with the same amplitude and frequency. The total displacement is the superposition of both waves.

The mathematical superposition of two equal-amplitude waves traveling in opposite directions is:

**y(x, t) = A·sin(kx − ωt) + A·sin(kx + ωt)**

Using the sum-to-product identity: sin(P) + sin(Q) = 2·sin((P+Q)/2)·cos((P−Q)/2), this becomes:

**y(x, t) = 2A · sin(kx) · cos(ωt)**

This is the standing wave equation. The spatial factor sin(kx) is fixed in space — it describes the shape. The temporal factor cos(ωt) oscillates uniformly in time — every point moves in phase (or perfectly anti-phase) with every other point. Nodes occur where sin(kx) = 0, i.e., at x = 0, π/k, 2π/k, ... These are permanently stationary points. Antinodes occur at maxima of |sin(kx)|.

Applying the fixed-end boundary conditions y(0, t) = 0 and y(L, t) = 0 gives the quantization condition: k_n = nπ/L, so the allowed wavelengths are λ_n = 2L/n. The corresponding frequencies are:

**f_n = nv/(2L)** for n = 1, 2, 3, ...

where v = √(T/μ) is the wave speed (T = string tension, μ = linear mass density). Only integer multiples of the fundamental f₁ = v/(2L) are allowed. This is the harmonic series.

## The One Concept

A standing wave is the superposition of two identical traveling waves moving in opposite directions. Unlike a traveling wave, which transports energy from place to place, a standing wave stores energy in fixed spatial patterns — energy sloshes back and forth between kinetic (maximum velocity at the node) and potential (maximum displacement at the antinode), but does not propagate net energy anywhere.

**Physical intuition:** On a fixed-fixed string, the boundary conditions are like two mirrors for the wave. The wave bounces back and forth between the endpoints, and the round-trip must form a whole number of wavelengths — otherwise, successive reflections add destructively and the oscillation dies out. Only the resonant frequencies (where the length is an integer multiple of half-wavelengths) survive and build up amplitude through constructive interference.

**Key equation:** f_n = nv/(2L). The fundamental (n=1) gives the pitch. The harmonics (n=2, 3, 4, ...) give timbre — they are always present in a plucked string, with amplitudes that depend on how and where the string was plucked. Plucking at position x₀ excites harmonics with amplitude proportional to sin(nπx₀/L) — plucking at the midpoint gives maximum fundamental and zero 2nd harmonic; plucking near the bridge gives bright, thin tone with many harmonics.

**Real-world examples:**
1. **Guitar/violin:** The string vibrates in a superposition of all harmonics simultaneously. A Fourier transform of the recorded sound reveals discrete peaks at f₁, 2f₁, 3f₁, etc.
2. **Wind instruments:** Standing pressure waves in air columns inside a flute, trumpet, or organ pipe. Open pipe: f_n = nv/2L (same as string). Closed pipe: f_n = (2n−1)v/4L — only odd harmonics, giving a different timbre.
3. **Microwave ovens:** Standing electromagnetic waves inside the cavity create hot spots and cold spots (nodes and antinodes). The rotating turntable exists specifically to average out these standing wave nodes.

## The Fix

Replace the single-direction traveling wave with a full wave equation simulation using finite differences. Model the string as 400 discrete segments with positions `y[i]`. The 1D wave equation in finite-difference form:

```javascript
const c2 = tension / density; // wave speed squared
for (let i = 1; i < N - 1; i++) {
  // Second derivative in space (Laplacian)
  const d2y_dx2 = (y[i+1] - 2*y[i] + y[i-1]) / (dx * dx);
  // Wave equation: d²y/dt² = c²·d²y/dx²
  vy[i] += c2 * d2y_dx2 * dt;
}
for (let i = 1; i < N - 1; i++) {
  y[i] += vy[i] * dt;
}
// Fixed boundary conditions
y[0] = 0; y[N-1] = 0;
vy[0] = 0; vy[N-1] = 0;
```

Initialize the string in a plucked shape (e.g., a triangular displacement peaking at x₀). Set all velocities to zero. Release and run. The wave equation propagates the displacement, reflects at both endpoints, and the superposition of forward and backward waves naturally produces standing wave patterns. The fundamental mode emerges cleanly. Add a harmonic analyzer: decompose the current displacement into Fourier modes and display bar heights in real time.

## The Wow Moment — Push It

Strum all harmonics simultaneously with physically correct amplitudes. For a string plucked at position x₀ = L/4 (near the endpoint, like a guitar near the bridge), the nth harmonic amplitude is A_n = (2A/n²π²) · sin(nπx₀/L). The 1/n² falloff means the fundamental dominates but harmonics are clearly present. Synthesize the audio output using WebAudio API: sum all harmonics with correct amplitudes and phases — it sounds exactly like a guitar pluck, with the bright attack fading into a warmer tone as higher harmonics decay faster.

Show the Fourier decomposition in real time: on the lower half of the canvas, display a frequency-domain graph updating at 60 fps. At the moment of the pluck, the FFT shows a burst of energy across many harmonics. As the string "vibrates" (simulated decay), the high harmonics fade first, leaving the fundamental. This is exactly how a real guitar note evolves over time.

Zoom in on the initial moment of plucking: the sharp triangular deformation propagates outward as two pulses — one moving left, one moving right. They reflect off the ends with inversion and pass through each other. After several reflections, the standing wave pattern stabilizes. Show this in slow motion with a time-step counter. The moment where the two reflected pulses first constructively interfere at the center is visually stunning — two waves becoming a standing wave in real time.

## The Interactive Demo

Full browser demo, canvas-rendered at 60 fps with WebAudio synthesis.

**Controls:**
- **Tension slider:** Changes wave speed v = √(T/μ). Higher tension → higher pitch → faster oscillation. The string visibly changes color (tighter = cooler blue, looser = warmer red).
- **Length slider:** Stretch or compress the string. Frequency scales inversely — doubling length drops pitch one octave.
- **Pluck position selector:** Click anywhere on the string to pluck there. The harmonic spectrum changes instantly — pluck at center to suppress even harmonics, pluck near end for maximum harmonic richness.
- **Mode selector:** Force the string into a specific harmonic mode (n=1 through n=8). Shows a clean single-mode oscillation.
- **Composite mode:** Mix multiple harmonics with adjustable amplitudes per mode. Drag sliders for each harmonic's amplitude in the FFT display.
- **FFT display:** Real-time frequency spectrum shown below the string. Click on a bar to add or remove that harmonic.
- **Sound output toggle:** Synthesize and play the string's audio using WebAudio. The timbre changes as harmonics are added/removed.
- **Speed control:** Slow down the simulation to 0.1× real time to see wave reflections clearly.
- **Damping slider:** Add exponential decay to simulate real string losses.
- **String type presets:** Guitar, violin, piano, bass — preset tension, density, and length for realistic parameters.

## Production Notes

**Runtime target:** ~12 minutes. Hook: 1 min. Naive code: 2 min. Failure: 1 min. Physics: 3 min. Fix: 2.5 min. Wow moment: 1.5 min. Demo: 1 min.

**Screen layout:** Code editor left 50%, canvas right 50% for the main development sequence. Transition to full-screen canvas for the Fourier visualization and wow moment.

**Animations to pre-render:** (1) Slow-motion guitar string pluck at 10,000 fps (or use existing CC-licensed footage), (2) animated diagram of two traveling waves summing to a standing wave, (3) node/antinode diagram for modes 1–5 side by side, (4) color-coded traveling vs standing wave visualization.

**Key moments to zoom:** When the standing wave first appears from the wave equation simulation (add a subtle "STANDING WAVE ACHIEVED" badge), the FFT bloom at the moment of pluck, the slow-motion two-pulse reflection sequence.

**B-roll:** Guitar closeups, Chladni plate footage (teaser for B025), wind instrument cross-sections showing air column length.

**Audio design:** The WebAudio synthesis should actually sound good — tune the harmonic amplitudes carefully. A perfect pluck sound will make the demo segment memorable and shareable. Mix in some reverb.

## Tags

`physics` `waves` `standing-waves` `harmonics` `guitar` `resonance` `javascript` `canvas`

## Thumbnail

Close-up of a guitar string occupying the full left half of the frame, in crisp focus with the fretboard visible. On the right half, a clean simulation canvas shows the string in its third harmonic mode — three perfect arches in bright cyan on a black background — with vertical node lines marked in white. The string in the simulation and the real guitar string are aligned horizontally, forming a visual bridge between reality and model. Top text: "WHY STRINGS HAVE HARMONICS" in white. Bottom text: "Simulated in JavaScript" in smaller cyan text. The contrast between the warm wood tones of the guitar and the cool digital cyan of the simulation creates an instantly appealing aesthetic. The emotion triggered is curiosity plus recognition — "I've played guitar but never thought about this" — which pulls in both musicians and developers.
