---
title: "Two Close Notes Create a Beating Pulse (Beat Frequency)"
id: B023
difficulty: 1.5/10
prereq: "B022 — Why Guitar Strings Have Harmonics (Standing Waves in Code)"
concept: "Beat frequency f_beat = |f1 − f2| from superposition of near-equal sinusoids"
tags: [physics, waves, superposition, beat-frequency, sound, interference, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Two Close Notes Create a Beating Pulse (Beat Frequency)

**Alt title:** The Math Behind the "Wah-Wah" Sound When Two Notes Almost Match
**Difficulty:** 1.5/10 | **Prereq:** B022 — Standing Waves

---

## Opening Hook (0:00–1:00)

Open with audio: two guitar strings playing simultaneously, slightly out of tune. The viewer hears a clear, rhythmic pulsing — a "wah-wah-wah" envelope that rides on top of the musical pitch. As the tuning of one string is slowly corrected — tightening the peg, raising the frequency incrementally — the pulsing slows down, becomes lazy, almost imperceptible, and then disappears entirely into a clean, pure tone the moment the strings are in perfect unison. Then loosening the string again: the beat returns, this time accelerating as the detuning grows. This is how every professional musician and piano technician tunes by ear. The beat frequency is the tuning error made audible.

Now show the waveform: two nearly identical sine waves drawn on a canvas — f₁ = 440 Hz (concert A) and f₂ = 443 Hz. Both are fast oscillations. Their sum, drawn below, looks like a single sine wave but with an amplitude that slowly swells and fades — the beat envelope oscillating at exactly 3 Hz. Three pulses per second, exactly |443 − 440| = 3 Hz. Freeze the frame. Circle the envelope. Say: "This is not a new frequency that was added. This is a mathematical consequence of adding two sine waves. The physics is pure trigonometry." Then show the equation: cos(A) + cos(B) = 2·cos((A−B)/2)·cos((A+B)/2). The right side is a product of a slow envelope (the beat) and a fast carrier (the average pitch). Everything in the video follows from this one trig identity.

## The Naive Attempt

Code the simplest possible version of the experiment: play two sine waves together and visualize the result. Set f₁ = 440 Hz and f₂ = 480 Hz — a 40 Hz difference, which seems close enough. In code:

```javascript
const f1 = 440, f2 = 480;
const signal = (t) => Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t);
```

Render this signal on a canvas timeline covering 0.1 seconds (100 milliseconds). The sample rate is 44,100 Hz — draw a point for every millisecond. The resulting waveform looks like a dense, complex pattern with no obvious structure. At 40 Hz beat frequency, the amplitude envelope pulses 40 times per second — far too fast to see on a short timeline and too fast to perceive as a "beating" effect when heard. It is instead perceived as a low-pitched buzzy tone (40 Hz is itself audible as a very low note). The effect the viewer is trying to demonstrate — the "wah-wah" tuning effect — requires a beat frequency of about 1–5 Hz, not 40 Hz.

Now try the other extreme: f₁ = 440 and f₂ = 440.1 Hz — a 0.1 Hz beat frequency. The two signals look identical on screen. The beat period is 10 seconds — so a 100-millisecond canvas window shows no beat at all. Played as audio, the effect takes 10 seconds to complete one pulse — boring and hard to demonstrate live. Neither choice of frequency separation works for the intended demonstration.

## The Moment of Failure

With f₂ = 480 Hz: render 100 ms of the combined signal. The waveform is visually indistinguishable from noise — a dense, rapidly oscillating tangle with no visible envelope. Play it as audio: it sounds like a low buzzy tone, not a "wah-wah" effect. The beat is happening but at 40 pulses per second — which is itself a low musical frequency, not a perceptual amplitude modulation. The viewer hears a new note, not a pulsing effect.

Highlight the problem on screen: zoom into a 5-millisecond window of the waveform. At this scale, the two individual sine waves are clearly visible, slightly offset from each other. The constructive/destructive pattern cycles every 1/40 = 25 ms — too fast to perceive as an envelope modulation, fast enough to perceive as a tone. The "beat" has become a note of its own. The simulation is correct mathematically, but the parameter choice fails the demonstration. Label it clearly: "Beat frequency 40 Hz — this is a new audible pitch, not a slow pulse." This motivates the correct frequency choice, and also introduces the concept that beat frequency has its own frequency range with its own perceptual character.

## Why It Broke — The Physics

The superposition of two sinusoids is governed by the trigonometric identity:

**cos(2πf₁t) + cos(2πf₂t) = 2·cos(2π·(f₁−f₂)/2·t) · cos(2π·(f₁+f₂)/2·t)**

The right-hand side is the product of two cosines: a slow one oscillating at (f₁−f₂)/2 and a fast one oscillating at (f₁+f₂)/2. The fast factor is the carrier — the perceived pitch, close to the average of f₁ and f₂. The slow factor is the envelope — the beat. The amplitude of the combined signal (perceived loudness) rises and falls at the beat frequency f_beat = |f₁ − f₂|, not at (f₁−f₂)/2, because the envelope completes a full loud-soft-loud cycle in 1/f_beat seconds (the amplitude goes from +2A to 0 to −2A to 0 to +2A in one beat period; the loudness, being proportional to absolute amplitude, pulses twice as fast as the envelope cosine, but the beats are separated by the envelope zero crossings at spacing 1/f_beat).

The key insight that the naive attempt missed: for the beat effect to be perceptually clear as a slow amplitude modulation (the "wah-wah" effect), f_beat must be in the range of roughly 0.5–8 Hz. Below 0.5 Hz: the pulse is too slow to feel rhythmic. Above 8–10 Hz: the beats become individually indistinct and are perceived instead as roughness or as a new low-frequency tone. At 40 Hz: f_beat is an audible musical pitch (a very low E), so the combined signal sounds like three notes (f₁, f₂, and the beat tone), not like two notes with a rhythmic pulse.

**Critical parameter:** Choose f₁ = 440 Hz and f₂ = 443 Hz. Beat frequency = 3 Hz. Three pulses per second — clearly perceptible as a slow rhythmic throbbing. The carrier frequency is (440 + 443)/2 = 441.5 Hz — indistinguishable from 440 Hz to the human ear. The beat is obvious on the waveform over a 2-second window and immediately audible.

## The One Concept

A beat frequency is the slow amplitude modulation produced when two sinusoids of nearly equal frequency are superposed. The mathematical source is the product-to-sum identity for cosines: the sum of two cosines becomes a product of a fast carrier and a slow envelope. The slow envelope oscillates at half the frequency difference, but because each period of the envelope contains two moments of loud sound (one positive peak, one negative peak), the perceived beat rate equals the full frequency difference: **f_beat = |f₁ − f₂|**.

**Physical intuition:** Imagine two runners completing laps around a track at slightly different speeds. At the start, they are side by side — maximum constructive interference. As time passes, the faster runner pulls ahead. Halfway through the faster runner's lead (when they are on opposite sides of the track), they are exactly opposite — maximum destructive interference, producing silence or minimum amplitude. When the faster runner has lapped the slower runner by exactly one full lap, they are side by side again — constructive interference returns. The rate of "lapping" is f_beat.

**Key equation:** f_beat = |f₁ − f₂|. Full waveform: y(t) = 2A·cos(2π·f_beat/2·t)·cos(2π·f_avg·t), where f_avg = (f₁+f₂)/2. Envelope: E(t) = 2A·|cos(π·f_beat·t)|, which pulses at f_beat.

**Real-world examples:**
1. **Instrument tuning:** Piano tuners listen for beats between a reference pitch and the piano string. Zero beats = perfect unison. Beat rate directly measures detuning in Hz.
2. **AM radio:** Amplitude modulation is mathematically identical to beats. A carrier wave (radio frequency, ~MHz) is multiplied by an audio signal (envelope, ~kHz). Demodulation recovers the envelope — this is the audio you hear.
3. **Musical consonance:** Intervals with simple integer frequency ratios (perfect fifth: 3:2, major third: 5:4) produce very slow or zero beats between their harmonics, sounding stable and consonant. Complex ratios (minor second: 16:15) produce fast, rough beating — perceptually dissonant. Beats are the physical basis of musical harmony and tuning systems.
4. **Stroboscope effect:** Rotating machinery at 59 Hz appears stationary under 60 Hz fluorescent lighting — the 1 Hz beat between machine speed and light flicker is perceived as slow rotation.

## The Fix

Use the correct frequency parameters: f₁ = 440 Hz and f₂ = 443 Hz. Render 2 full seconds of the waveform on the canvas (enough for 6 beat cycles to be visible). Scale the time axis to show the envelope clearly:

```javascript
const f1 = 440, f2 = 443;
const f_beat = Math.abs(f1 - f2); // 3 Hz
const f_carrier = (f1 + f2) / 2;  // 441.5 Hz

// Combined signal
function signal(t) {
  return Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t);
}

// Analytical envelope (for overlay)
function envelope(t) {
  return 2 * Math.abs(Math.cos(Math.PI * f_beat * t));
}
```

Draw the combined signal in cyan. Draw the envelope E(t) = 2|cos(π·f_beat·t)| in yellow as an overlay — showing where the amplitude peaks and troughs. The viewer can see the rapid carrier oscillation within the slowly swelling envelope. Label the beat period (1/f_beat = 333 ms) with a bracket on the time axis. Play the audio using WebAudio API with the correct synthesis. The "wah-wah" effect is immediately audible at 3 Hz — one pulse roughly every third of a second, clearly rhythmic and clearly related to the waveform pattern on screen.

## The Wow Moment — Push It

Use beats to explain musical consonance and dissonance — the physical basis of why some chord combinations sound pleasant and others sound harsh. Synthesize a major chord (C = 261.6 Hz, E = 329.6 Hz, G = 392 Hz) and display all pairwise beat frequencies between the fundamental and first several harmonics. The frequency ratios in a major chord (4:5:6) are simple integers, which means harmonics of C and E coincide at very low beat frequencies or zero — the overtone series interlocks cleanly. Result: nearly beat-free, perceived as consonant.

Now detune the chord slightly — shift E down to 327 Hz (a minor third instead of major third). New beat frequencies between harmonics: several in the 2–8 Hz range, fast enough to be perceived as roughness. Play it — unmistakably harsher. Then play a diminished chord (high-complexity ratios): multiple fast beating overtone pairs create a dense, aggressive dissonance. This is the physics of music theory. Pythagoras knew about simple ratios producing good consonance — now we can see exactly why in terms of harmonic beat frequencies.

Final flourish: show AM radio demodulation. Start with a "radio carrier" at f_carrier = 10,000 Hz modulated by a 3 Hz beat envelope (audio signal). Display the high-frequency carrier on the screen — it looks like a throbbing fast oscillation. Show the envelope detector circuit in code (rectify + low-pass filter): the 10 kHz carrier disappears and the 3 Hz audio signal emerges. The physics of radio demodulation is literally the same as tuning a guitar — recovering the slow envelope from a fast modulated carrier.

## The Interactive Demo

Real-time browser demo with WebAudio synthesis and live waveform rendering.

**Controls:**
- **f₁ frequency slider** (220–880 Hz, default 440): Changes the pitch of the first tone. Displayed as note name (A4, A5, etc.).
- **f₂ frequency slider** (220–880 Hz, default 443): Changes the pitch of the second tone.
- **Beat frequency display:** Shows |f₁ − f₂| in real time, labeled "Beats per second." Updates live as sliders move.
- **Waveform display:** 2-second scrolling waveform showing combined signal (cyan) and envelope (yellow).
- **Spectrogram:** Frequency-domain display showing two discrete peaks at f₁ and f₂. As they move apart, the peaks separate visibly.
- **Play sound toggle:** Synthesizes and plays the combined tone using WebAudio. Volume slider.
- **Envelope toggle:** Show/hide the analytical envelope overlay on the waveform.
- **Musical interval presets:** Buttons for Unison (0 Hz beat), Perfect Fifth (beat between 3rd harmonic of lower and 2nd harmonic of upper ≈ 0 Hz for just tuning), Minor Second (fast beats, dissonant), and custom.
- **Tuner mode:** Shows how to use beats to tune — a fixed reference tone plays at 440 Hz and the user slides f₂ toward it; beat frequency display counts down toward zero.
- **AM radio mode:** Switches to high carrier frequency (8,000 Hz) with the beat acting as the modulating signal. Shows carrier waveform and demodulated output.
- **Slow-motion display:** Render beats at 1/100 speed for pedagogical clarity.

## Production Notes

**Runtime target:** ~10 minutes. Hook: 1 min. Naive code: 1.5 min. Failure: 1 min. Physics explanation: 2.5 min. Fix: 1.5 min. Wow moment: 2 min. Demo: 0.5 min.

**Screen layout:** This episode benefits from a 3-panel layout for the demo portions: code editor (top left), waveform canvas (right), and spectrogram (bottom left). Keep the waveform large and readable — the whole episode lives or dies on the viewer being able to see the beat envelope clearly.

**Animations to pre-render:** (1) Animated derivation of the trig identity cos(A)+cos(B) with each step shown clearly, (2) runner analogy for beats (two runners on a track, constructive interference when side by side, destructive when opposite), (3) harmonic series diagram showing how harmonic beats determine consonance, (4) AM radio demodulation flowchart.

**Key moments to zoom:** The instant the correct f₁=440/f₂=443 choice is made and the envelope appears clearly on the waveform, the live audio moment (have real speakers audible in the recording), the consonance/dissonance comparison in the wow segment.

**Audio design:** Critically important for this episode — the viewer must actually hear the beats through their headphones/speakers. Mix audio carefully. Consider adding a low-frequency rumble to the fully constructive interference moments to make the beat physically felt, not just heard.

**B-roll:** Piano tuner at work, oscilloscope showing beats, guitar headstock tuning peg being adjusted.

## Tags

`physics` `waves` `superposition` `beat-frequency` `sound` `interference` `javascript` `canvas`

## Thumbnail

A canvas showing two slightly offset sine waves in blue and orange, both visually nearly identical, running along the top third of the frame. Below them, their sum drawn in bright white — a clear sine wave with a slowly varying amplitude, the beat envelope visible as a gentle swelling and fading over three cycles. The bottom quarter of the frame has the text "WHY NOTES 'WAH-WAH'" in bold yellow, followed by smaller white text "The maths behind tuning." The waveform is large enough to clearly show the envelope structure. The emotion triggered is "I've heard this, now I'll understand it" — the familiar "wah-wah" sound is something every musician and music listener has experienced, and the visual of the waveform reveals the hidden geometry behind it. The thumbnail works because the envelope on the sum wave is instantly recognizable as the beating sound.
