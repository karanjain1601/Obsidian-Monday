---
title: "Why a Siren's Pitch Changes as It Passes (Doppler Effect)"
id: B010
difficulty: 2/10
prereq: "None"
concept: "Doppler shift f_obs = f_source · (v_sound ± v_observer)/(v_sound ∓ v_source). Approaching source compresses wavefronts → higher frequency. Receding source stretches them → lower frequency."
tags: [physics, doppler, sound, waves, frequency, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why a Siren's Pitch Changes as It Passes (Doppler Effect)

**Alt title:** "I Simulated Sound Waves. Then I Made a Sonic Boom."
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Play an audio recording made with a phone on a sidewalk as an ambulance approaches at full speed, passes, and recedes. The audio waveform is shown on screen. You can see and hear the classic "EEEEE-yowwww" pitch drop at the moment of closest approach. Freeze the waveform and zoom in on the moment of passing. Show two sections of the waveform: before passing (higher frequency — compressed cycles) and after passing (lower frequency — stretched cycles). The wave literally changes shape in the recording.

Now show a visual intuition. Imagine the ambulance as a point source emitting sound waves as concentric expanding circles, one circle per cycle. If the ambulance is stationary, these circles are perfectly concentric — centered on the same point. Every observer in every direction hears the same frequency.

Now set the ambulance moving to the right at half the speed of sound. The center of each new wavefront is displaced to the right of the previous one. In front of the ambulance: the circles pile up — they are compressed. Behind: they are stretched. An observer in front hears more wavefronts per second (higher frequency). An observer behind hears fewer per second (lower frequency). An observer to the side hears an intermediate frequency.

The simulation where wavefronts are concentric circles regardless of source motion — the naive mistake — will be immediately obvious. The wavefronts should bunch up in front and stretch behind. Get this wrong and your siren makes no sound change as it passes. The physics is in the geometry of the wavefronts.

---

## The Naive Attempt

Build the naive simulation: emit wave circles at regular time intervals, centered at the current source position, all expanding at the speed of sound. But assign all observers a fixed frequency regardless of their position relative to the source:

```javascript
// B010 — Naive: fixed frequency, no Doppler computation
const v_sound  = 343;   // m/s speed of sound
const f_source = 440;   // Hz — siren frequency (A4 note)
const v_source = 50;    // m/s — ambulance speed (about 180 km/h)

let sourceX = 0;   // source starts at left, moves right
let time    = 0;

// Wave fronts: circles expanding from emission point
const wavefronts = [];

function update(dt) {
  time += dt;
  sourceX += v_source * dt;

  // Emit a new wavefront every 1/f_source seconds
  if (time % (1/f_source) < dt) {
    wavefronts.push({
      x: sourceX,        // emission point — correctly at current source position
      y: centerY,
      radius: 0,
      age: 0
    });
  }

  // Expand all wavefronts at speed of sound
  for (const wf of wavefronts) {
    wf.radius += v_sound * dt;
    wf.age    += dt;
  }

  // WRONG: Observer simply uses the source frequency regardless of motion
  const f_observed = f_source;  // No Doppler correction at all!
  // Play a tone at f_observed — always 440 Hz, no matter the geometry
}
```

Walk through why the wavefront drawing is partially correct: each ring IS drawn from the current source position, so the visual pattern of compressed rings in front and stretched rings behind will actually be correct. But the critical failure is the audio: the observer hears `f_source = 440 Hz` regardless of the source's position relative to them. There is no pitch change as the ambulance passes.

This is the most common naive mistake: drawing the wavefronts correctly (because it's just geometry) but computing the observed frequency wrong (because computing the arrival rate of wavefronts at the observer requires an extra calculation). The visual looks fine. The audio is completely wrong. The simulation looks like it's working — until you listen to it or display the frequency at the observer.

---

## The Moment of Failure

Display the simulation with the wavefront visualization and a live frequency meter at the observer position. The ambulance drives past the observer. The wavefronts are visually correct — clearly compressed in front, stretched behind. The rings pass through the observer at an obviously different rate when the ambulance is approaching vs. receding.

But the frequency meter shows: 440.0 Hz the entire time. Before passing: 440 Hz. At closest approach: 440 Hz. After passing: 440 Hz. The frequency never changes.

Now add a "wavefront crossing rate" counter that literally counts how many wavefront circles pass through the observer position per second. During approach: 521 crossings per second (the correct Doppler-shifted frequency). At passing: rapid transition. During recession: 376 crossings per second. The counter clearly shows the frequency is changing. The simulation is drawing the information correctly — it's just not using it.

Display side by side: the geometric "true frequency" (from counting wavefront crossings) and the "computed frequency" (naively set to 440 Hz). They diverge widely during approach and recession and only agree instantaneously at the moment of passing (when the source is moving perpendicular to the observer direction, so there is no radial velocity — zero Doppler shift). 

Text overlay: "The wave geometry knows the answer. The code just isn't listening. The fix is to compute the rate at which wavefronts arrive at the observer — which depends on the angle between the source velocity and the observer direction."

---

## Why It Broke — The Physics

The Doppler effect arises from the relative motion between a wave source and an observer. The key physical insight is that the observed frequency is determined by the rate at which wavefronts arrive at the observer — and this rate depends on the geometry of the situation.

**The Doppler formula (source moving, observer stationary):**

$$\boxed{f_{obs} = f_s \cdot \frac{v_{sound}}{v_{sound} - v_s \cos\theta}}$$

Where:
- f_s = source frequency
- v_sound = speed of sound in the medium (343 m/s in air at 20°C)
- v_s = source speed
- θ = angle between the source velocity vector and the direction from source to observer

When θ = 0° (source approaching directly): f_obs = f_s × v/(v - v_s) — maximum Doppler shift upward
When θ = 180° (source receding directly): f_obs = f_s × v/(v + v_s) — maximum Doppler shift downward
When θ = 90° (source passing exactly): f_obs = f_s — no Doppler shift at the instant of passing

**General form (observer also moving):**
$$f_{obs} = f_s \cdot \frac{v_{sound} \pm v_{obs}}{v_{sound} \mp v_s}$$

Sign convention: use + for top when observer moves toward source, - when moving away. Use - for bottom when source moves toward observer, + when moving away.

**Physical derivation:** When the source moves toward the observer at speed v_s, each successive wavefront is emitted from a position closer to the observer than the previous one. The spatial wavelength λ_front is compressed: λ_front = (v_sound - v_s)/f_s. The observer intercepts these compressed wavefronts at rate v_sound/λ_front = f_s × v_sound/(v_sound - v_s). The formula falls directly from geometry.

**The Mach number M = v_s/v_sound:** When M → 1 (source approaching sound speed), the denominator (v_sound - v_s) → 0. The observed frequency approaches infinity — all the wavefronts are piling up at the same location, constructing a cone of compressed pressure: the Mach cone. When M > 1, the source outruns its wavefronts and the Mach cone trails behind as a conical shock wave. At M = 1 exactly, the wavefronts pile up in a plane — a flat shock.

---

## The One Concept

**The Doppler Effect** is the change in observed frequency of a wave when the source and observer are in relative motion. It applies to all waves: sound, light, water waves, seismic waves.

**The central insight:** The observed frequency is not the source frequency. It is the rate at which wavefronts arrive at the observer — and this depends on how quickly the source is moving toward or away from the observer along the line connecting them.

**Key formula:**
$$f_{obs} = f_s \cdot \frac{v_{wave}}{v_{wave} - v_s \cos\theta}$$

For a 440 Hz siren in a car doing 50 m/s (θ = 0° approaching, then 180° receding):
- Approaching: f_obs = 440 × 343/(343-50) = 440 × 343/293 = 515 Hz
- Receding: f_obs = 440 × 343/(343+50) = 440 × 343/393 = 384 Hz
- Pitch drop ratio: 515/384 = 1.34 — a ratio of a musical major third. Very audible.

**Light Doppler (redshift/blueshift):** The same principle applies to light, but the formula must be modified for special relativity because v_light = c is constant in all frames. The relativistic Doppler formula is:
$$f_{obs} = f_s \sqrt{\frac{c - v}{c + v}}$$

For recession (v > 0): f_obs < f_s — light is redshifted (lower frequency = longer wavelength = red)
For approach: f_obs > f_s — light is blueshifted

**Real-world examples:**
1. **Radar speed guns:** Police radar emits microwave at a fixed frequency, reflects off your car. The reflected wave is Doppler-shifted. Measuring the shift gives your speed directly. The formula is the same — just microwave frequency instead of sound.
2. **Expanding universe / Hubble's Law:** Distant galaxies are receding, and their light is redshifted. The amount of redshift reveals the recession speed. Edwin Hubble (1929) measured redshifts of galaxies and found they increase with distance — the universe is expanding.
3. **Echolocation in bats:** Bats emit ultrasonic pulses and listen for the Doppler-shifted echo from moving insects. The frequency shift tells the bat whether the insect is flying toward or away from it, and at what speed — a biological Doppler radar.
4. **Medical ultrasound:** Doppler ultrasound measures blood flow velocity in real time. The reflected ultrasound from moving red blood cells is frequency-shifted in proportion to the blood's velocity. Color Doppler imaging shows blood flowing toward the probe in red, away in blue — the Doppler shift converted to color.

---

## The Fix

```javascript
// B010 — Correct Doppler: compute wavefront arrival rate at observer
const v_sound  = 343;  // m/s
const f_source = 440;  // Hz
const v_source = 50;   // m/s

let sourceX  = 0;
let sourceVX = v_source;  // moving right

const observerX = canvas.width / 2;
const observerY = canvas.height / 2;

function computeDopplerFrequency(srcX, srcY, srcVX, srcVY, obsX, obsY) {
  // Vector from source to observer
  const dx = obsX - srcX;
  const dy = obsY - srcY;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist < 1) return f_source;  // avoid division by zero when on top of source

  // Unit vector from source toward observer
  const ux = dx / dist;
  const uy = dy / dist;

  // Component of source velocity toward the observer (radial velocity)
  // Positive = source moving toward observer
  const v_radial = srcVX * ux + srcVY * uy;

  // Doppler formula: f_obs = f_s * v_sound / (v_sound - v_radial)
  // When v_radial > 0 (source approaching): denominator < v_sound → f_obs > f_s
  // When v_radial < 0 (source receding): denominator > v_sound → f_obs < f_s
  const denominator = v_sound - v_radial;
  if (Math.abs(denominator) < 1) return f_source * 1000;  // near Mach 1 — huge shift

  return f_source * v_sound / denominator;
}

// Emit wavefronts at source frequency
const wavefronts = [];
let emitTimer = 0;

function update(dt) {
  sourceX += sourceVX * dt;
  emitTimer += dt;

  if (emitTimer >= 1/f_source) {
    emitTimer -= 1/f_source;
    wavefronts.push({ x: sourceX, y: centerY, r: 0 });
  }

  for (const wf of wavefronts) wf.r += v_sound * dt;
  wavefronts = wavefronts.filter(wf => wf.r < 2000);

  // Compute and display observed frequency
  const f_obs = computeDopplerFrequency(sourceX, centerY, sourceVX, 0, observerX, observerY);
  displayFrequency(f_obs);  // update audio oscillator to f_obs
  plotFrequencyVsTime(f_obs);
}
```

The key change is the `computeDopplerFrequency` function, which calculates the dot product of the source velocity with the unit vector toward the observer. This gives the radial velocity — how fast the source is moving toward or away from the observer. The Doppler formula then directly gives the observed frequency.

Connect `f_obs` to an audio oscillator (using the Web Audio API): `oscillator.frequency.value = f_obs`. As the source moves, the tone shifts in real time. During approach: the pitch rises noticeably above 440 Hz. At the moment of passing: exactly 440 Hz. During recession: pitch drops. Play this with the audio on — the effect is immediately recognizable as the ambulance sound.

Show the frequency-time graph updating live: it shows a curve that starts high (515 Hz), falls steeply through 440 Hz at the passing moment, then levels out at 384 Hz. This is the characteristic Doppler curve.

---

## The Wow Moment — Push It

Accelerate the source toward Mach 1. The speed of sound is 343 m/s. Move the source slider from 0 toward 343 m/s. Watch the wavefronts in real time.

At v_source = 0 (stationary): perfect concentric circles, evenly spaced in all directions.
At v_source = 100 m/s (M = 0.29): circles noticeably compressed in front, stretched behind.
At v_source = 200 m/s (M = 0.58): front circles very tightly packed.
At v_source = 300 m/s (M = 0.87): the front circles are extremely close together. The observed frequency ahead is enormous.
At v_source = 343 m/s (M = 1.0): all wavefronts pile up on a flat plane perpendicular to the motion. The frequency ahead approaches infinity. The Mach cone opens to 90° (a flat plane). This is the moment a sonic boom is produced.
At v_source = 514 m/s (M = 1.5): the Mach cone is clearly V-shaped, trailing at sin(θ) = 1/M = 0.67, θ = 42°. The source outruns all its wavefronts. Observers on the ground hear nothing until the shock wave passes — then the "boom."

Show the Mach cone angle formula: sin(θ_cone) = v_sound/v_source = 1/M. At M = 2: θ = 30°. At M = 3: θ = 19.5°. The SR-71 Blackbird (M = 3.3): θ = 17.7°.

Then switch to "light mode" — substitute c = 3×10⁸ m/s for v_sound. The scale is different but the geometry is the same. Show a galaxy receding at 0.5c: its light is redshifted by factor √((1+0.5)/(1-0.5)) = √3 ≈ 1.73. What was blue light (450 nm) becomes orange (778 nm). Show a spectrum bar shifting toward red as recession speed increases. At v = 0.9c, the redshift factor is 4.36 — visible light becomes near-infrared. This is what cosmologists measure to determine galaxy recession speeds.

---

## The Interactive Demo

**Canvas layout:** A horizontal scrolling view. The source (ambulance icon or glowing dot) moves across the canvas. Concentric circles expand from each emission point. The observer is a fixed ear icon (or can be dragged).

**Controls:**
- `Source Speed` — slider 0 to 750 m/s. Labels: [Stationary] [Highway] [Supersonic] [Mach 2] [Mach 3+]. Mach number displayed in real time. Above M=1, the Mach cone is drawn.
- `Source Frequency` — slider 200 Hz to 2000 Hz. Audio plays the Doppler-shifted tone at the observer.
- `Speed of Sound` — slider (artistic: can set to slow values to make the Mach cone visible at low source speeds, or to explore other media: water: 1480 m/s, steel: 5960 m/s)
- `Observer position` — drag the ear icon anywhere on the canvas

**Display modes (toggle buttons):**
- [Wavefronts] — show expanding circle rings
- [Pressure Map] — color the canvas by pressure (wave density); shows the compression ahead and rarefaction behind
- [Frequency Graph] — show real-time f_obs vs time at the observer
- [Mach Cone] — highlight the Mach cone angle when source is supersonic

**Audio panel:**
- Live tone at f_obs playing through the speaker (toggle on/off)
- Frequency readout: f_source (static) and f_obs (changing) shown side by side
- Pitch display: show the musical note corresponding to f_obs (e.g., "A4 → C5 → G#3")
- Recording mode: record 5 seconds of the Doppler shift as audio, download as WAV

**Light mode toggle:**
- Switches units to c, source speeds to fractions of c
- Shows spectrum bar shifting red/blue as source recedes/approaches
- Relativistic Doppler formula used instead of classical

---

## Production Notes

**Runtime target:** 15–18 minutes

**Segment breakdown:**
- 0:00–1:00 — Hook: real ambulance recording, waveform shown, visual wave intuition — 1 min
- 1:00–4:00 — Naive code: wavefronts drawn correctly but frequency computed wrong — 3 min
- 4:00–6:00 — Failure: frequency meter shows constant 440 Hz despite correct wavefront geometry — 2 min
- 6:00–9:00 — Physics: wavefront arrival rate derivation, Doppler formula, θ dependence — 3 min
- 9:00–11:00 — The concept: formula for all cases, real-world examples (radar, redshift, bat sonar) — 2 min
- 11:00–13:00 — The fix: radial velocity computation, Web Audio API connection, live audio demo — 2 min
- 13:00–15:30 — Wow: Mach 1 barrier, sonic boom, Mach cone angle formula, redshift demo — 2.5 min
- 15:30–17:00 — Interactive demo walkthrough — 1.5 min

**Screen layout:** The wavefront visualization is the central visual — make it dominant. For code sections, use right-side panel. Use a dark background throughout — the white wavefront circles pop dramatically against dark.

**Zoom moments:**
- ZOOM on the waveform comparison: compressed cycles (approach) vs stretched cycles (recession)
- ZOOM on the frequency meter reading 440 Hz throughout even as wavefronts clearly bunch up — the failure moment
- ZOOM on M = 1.0: the flat-plane wavefront pile-up — visually striking
- ZOOM on the Mach cone forming at M = 1.5 — draw the angle and the formula

**Pre-render animations:**
- Real ambulance waveform with annotated high-frequency and low-frequency sections
- The wavefront diagram: stationary vs moving source, concentric circles vs offset circles
- The sonic boom aircraft diagram showing Mach cone and shock wave

**Key audio moments:**
- At the fix reveal: play the Doppler-shifted tone live. This is the most viscerally satisfying demo in the episode — hearing the pitch drop in real time from code is striking.
- During Mach 1 demo: as source speed approaches 343 m/s, the tone in front would theoretically approach infinite frequency — show this approaching infinity while explaining it practically as a "wall of sound" (the shock wave).

**Web Audio API note for implementation:**
```javascript
const audioCtx   = new AudioContext();
const oscillator = audioCtx.createOscillator();
const gainNode   = audioCtx.createGain();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = 'sine';
oscillator.start();
// Each frame: oscillator.frequency.setValueAtTime(f_obs, audioCtx.currentTime);
```

---

## Tags

`physics` `doppler` `sound` `waves` `frequency` `javascript` `canvas` `beginner`

---

## Thumbnail

A dark background with concentric wavefront rings clearly offset — compressed and tightly packed on the left (front of motion) and widely spaced on the right (rear). In the center: a glowing dot (the source) moving to the right with a motion blur streak. An ear icon is on the right side, with a frequency bar showing the high pitch (front) vs low pitch (rear) split. Large text: "EEEEE-YOWWWW" in a font that starts large (high pitch) and shrinks to smaller (low pitch) — an audio-visual pun. The Mach cone hint is visible in the wavefront pattern for a near-supersonic source. Emotion: instant recognition — everyone knows the ambulance sound, and the wavefront image is a satisfying visual explanation of that sound in one frame. The "EEEEE-YOWWWW" text is the scroll-stopper — it is immediately recognizable, immediately evocative, and immediately raises the question: "But WHY?"
