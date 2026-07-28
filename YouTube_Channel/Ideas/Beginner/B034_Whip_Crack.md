---
title: "How a Whip Goes Supersonic (Wave Speed Amplification)"
id: B034
difficulty: 2.5/10
prereq: "B022 — Wave Propagation"
concept: "Tapered string: wave speed c = √(T/μ) increases as linear mass density μ decreases toward the tip; energy conservation forces amplitude and tip speed to rise until v_tip > Mach 1"
tags: [physics, whip, wave-speed, sonic-boom, mach, energy-conservation, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# How a Whip Goes Supersonic (Wave Speed Amplification)

**Alt title:** "That Whip Crack Sound Is Literally a Sonic Boom — Here's the Math"
**Difficulty:** 2.5/10 | **Prereq:** B022 — Wave Propagation

---

## Opening Hook (0:00–1:00)

Play the audio: a single, sharp crack — the most percussive sound a human hand can generate without a weapon. Then show the footage: a bullwhip unfurling in slow motion at 10,000 fps. At this frame rate, you can see the individual phases. First: the handle barely moves, a few centimeters. Then a loop propagates from the handle end toward the tip — a transverse wave on a flexible rod. The loop shrinks as it travels. At the last frame before the crack, a Doppler-shifted bow wave becomes visible around the whip tip — a tiny supersonic shockwave in air. The tip speed display in the corner reads: 380 m/s.

The speed of sound at sea level is 343 m/s. A leather strap, starting from a hand movement of about 30 cm/s, has somehow accelerated its tip to above Mach 1. No engine. No explosion. Just geometry and physics. The question is: how does the same wave that was moving at 10 m/s at the handle reach 380 m/s at the tip?

The answer involves one of the most elegant wave physics relationships: the wave speed on a string depends on how massive the string is per unit length. As the whip tapers toward the tip, that mass per length drops — and the wave speed rises proportionally. Energy conservation does the rest.

---

## The Naive Attempt

Model the whip as a uniform string — same mass per unit length μ everywhere, same diameter from handle to tip. Simulate it as a chain of N = 50 point masses connected by stiff springs (Hooke springs with spring constant k = T/dl where T is string tension). Give the handle end a sharp transverse impulse — a displacement pulse.

```javascript
const N = 50;
const masses = Array.from({length: N}, () => ({
  x: 0,
  y: 0,
  vy: 0
}));

// Initialize: point masses evenly spaced along x-axis
masses.forEach((m, i) => { m.x = i * 0.01; });  // 1 cm spacing

const mu = 0.05;       // kg/m — UNIFORM mass per length
const T = 10;          // N, string tension
const dl = 0.01;       // m, rest length of each segment
const waveSpeed = Math.sqrt(T / mu);   // c = sqrt(T/mu) — same everywhere

function update(dt) {
  masses[0].y = 0.05 * Math.sin(2 * Math.PI * time / 0.02);  // handle impulse
  for (let i = 1; i < N - 1; i++) {
    const F = T * (masses[i-1].y - 2*masses[i].y + masses[i+1].y) / dl;
    masses[i].vy += (F / (mu * dl)) * dt;
    masses[i].y  += masses[i].vy * dt;
  }
}
```

Run the simulation. The pulse propagates along the uniform string at constant speed — it arrives at the tip with the same amplitude and same velocity as it started. No acceleration, no sonic boom. It just bounces off the tip (reflection) and comes back.

---

## The Moment of Failure

The simulation shows the pulse traveling smoothly from left (handle) to right (tip). The amplitude remains constant. The speed remains constant — you can time it: if N=50 segments of 1 cm each gives a 50 cm whip, and the wave speed is √(T/μ) = √(10/0.05) = 14.1 m/s, then the pulse takes 50/1400 ≈ 0.036 seconds to travel the full length. Every single mass element reaches the same peak displacement. The tip speed (dz/dt of the last mass) reaches perhaps 3 m/s at the tip — far from supersonic.

No crack sound. No tip speed amplification. No supersonic behavior. The simulation correctly models the physics of a uniform string, and that physics is boring: uniform medium means uniform wave speed and amplitude. The whole mystery of the whip crack is absent. To get anything like a real whip, you need the one thing that a real whip has that this simulation doesn't: taper.

Color-code the uniform masses all one color. Then show a real whip cross-section diagram: the handle is thick leather, the fall is narrow braided cord, the cracker at the tip is a single strand of thin nylon. Mass per unit length drops by a factor of ~100 from handle to tip. That variation in μ is the entire secret.

---

## Why It Broke — The Physics

Wave speed on a string or rope: `c = √(T / μ)` where T is tension (N) and μ is linear mass density (kg/m). For a uniform string, μ is constant → c is constant. For a tapered whip, μ(x) decreases from handle to tip → c(x) increases from handle to tip.

A typical whip taper: μ_handle = 0.1 kg/m, μ_tip = 0.001 kg/m. Wave speed ratio: `c_tip / c_handle = √(μ_handle / μ_tip) = √(100) = 10`. The wave that starts moving at c_handle propagates faster and faster as it travels into the lighter part of the whip.

Energy conservation connects wave speed to amplitude. The energy of a sinusoidal wave per unit length: `E_wave = ½ · μ · A² · ω²` where A is amplitude and ω is angular frequency. For a wave packet of fixed total energy E_total propagating at local group velocity c_g:

```
E_total = E_wave_density * c_g = ½ · μ · A² · ω² · c
```

If E_total is conserved (no dissipation) and c = √(T/μ), then:
```
A ∝ (μ · c)^(-1/2) = μ^(-1/4)
```

As μ decreases toward the tip, A increases. For a 100× reduction in μ: amplitude increases by 100^(1/4) = 3.16×. More importantly, the local wave propagation speed c_local → ∞, but the physical constraint is that the mass elements can't move faster than the wave crest — and as the crest speed approaches and exceeds c_sound (343 m/s), the shockwave (the crack) forms.

---

## The One Concept

**Wave Speed Amplification on a Tapered Medium** is the principle that a wave traveling from a dense, slow medium into a less dense, faster medium will both accelerate (wave crest speed increases) and amplify (amplitude increases), with the increases governed by energy conservation and the local dispersion relation.

**Formal Statement:**
- Wave speed: `c(x) = √(T / μ(x))`
- For a tapered whip: `μ(x) = μ_0 * (1 - x/L)^n` (power-law taper, n > 0)
- Wave amplitude: `A(x) ∝ μ(x)^(-1/4) ∝ (1 - x/L)^(-n/4)`
- Tip velocity: `v_tip = A_tip * ω → ∞` as `x → L` (singular — regularized by string mass going to zero)
- Sonic boom condition: local tip velocity exceeds c_sound = 343 m/s at sea level

**Analogy — the Tsunami:** The same equation (wave speed = √(g·d) for tsunami, analogous to √(T/μ) for whip) explains why tsunamis amplify at shore. Deep ocean: fast, low amplitude. Shallow water: slow, high amplitude. The same math describes both.

**Real-World Examples:**
1. **Sonic crack in Indiana Jones' whip:** The sound design team initially just used a gunshot — the actual crack of a whip IS a sonic boom and naturally sounds like it. Real-world whip crackers have cracker strands that reach 750+ km/h (Mach 0.6) fairly easily; competition performers have measured tips above 1,400 km/h.
2. **Solar corona heating puzzle:** Alfvén waves (magnetohydrodynamic waves on solar magnetic field lines) propagate from the dense photosphere into the increasingly rarified corona. The analogy to whip physics is direct: decreasing plasma density → increasing wave speed → amplitude amplification. This is a leading candidate mechanism for why the sun's corona (2 million K) is hotter than the surface (5,800 K).
3. **Tsunami shoaling:** As covered in B040 — the same wave amplification principle that makes a bullwhip crack makes tsunamis lethal at shore.

---

## The Fix

Replace uniform mass per unit length with a tapered profile. The key code change: give each mass segment a different mass based on its position along the whip.

```javascript
const N = 100;
const L_total = 1.5;     // total whip length, meters
const mu_handle = 0.1;   // kg/m at handle
const mu_tip = 0.001;    // kg/m at tip (100x lighter)
const T = 15;            // N, string tension (approximately constant)
const taper_exp = 2;     // power-law exponent

// Each segment has its own mass
const segments = Array.from({length: N}, (_, i) => {
  const x = (i / N) * L_total;
  const fraction = 1 - (x / L_total);          // 1 at handle, ~0 at tip
  const mu_x = mu_tip + (mu_handle - mu_tip) * fraction**taper_exp;
  const dl = L_total / N;
  return {
    mass: mu_x * dl,
    x: x,
    y: 0,
    vy: 0,
    mu: mu_x,
    c_local: Math.sqrt(T / mu_x)               // local wave speed
  };
});

function update(dt) {
  // Handle impulse (sharp sinusoidal pulse)
  segments[0].y = 0.1 * Math.sin(2 * Math.PI * time / 0.03) * Math.exp(-50*time);

  for (let i = 1; i < N - 1; i++) {
    // Spring forces from neighbors
    const dl = L_total / N;
    const F = T * (segments[i-1].y - 2*segments[i].y + segments[i+1].y) / dl;
    const accel = F / segments[i].mass;
    segments[i].vy += accel * dt;
    segments[i].y  += segments[i].vy * dt;
  }

  // Track tip velocity
  const tipSpeed = Math.abs(segments[N-1].vy);
  if (tipSpeed > 343) triggerSonicBoom();
}
```

Color-code each segment by its local wave speed c_local: blue (slow, handle) → yellow → red (fast, tip). Watch the wave pulse appear to accelerate as it moves from blue to red segments. The tip mass oscillation amplitude grows dramatically. When the tip speed display crosses 343 m/s, play a crack sound.

---

## The Wow Moment — Push It

Compare three taper profiles side by side on a single canvas, each with the same initial handle impulse:

1. **No taper (uniform string):** Pulse travels at constant speed, constant amplitude. Tip speed: ~3 m/s. Definitely subsonic.
2. **Linear taper (n=1):** Moderate amplification. Tip speed: ~120 m/s. Subsonic.
3. **Power-law taper (n=2, realistic bullwhip):** Strong amplification. Tip speed: ~380 m/s. Supersonic — crack sound triggers.
4. **Exponential taper:** Extreme amplification, but the tip becomes physically fragile. Tip speed: ~600 m/s. Loud double crack.

Then do the analogy deep-dive. Switch the canvas to a side-profile of the sun: a magnetic flux tube is a "whip" for Alfvén waves. Animate an Alfvén wave propagating from the photosphere into the corona along a magnetic field line, amplifying as plasma density decreases by 10^10 from surface to corona. Annotate: same equation, same physics, different medium, scales from 1.5 meters to 700,000 kilometers. The universe is one physics.

Finally: play a contest. Give the user five different taper profiles and ask which one "cracks." Reveal the answer with the simulation — only the profiles where tip speed exceeds Mach 1. The answer can be counterintuitive (a very abruptly tapered whip can actually be suboptimal because the taper creates a strong impedance mismatch that reflects energy back).

---

## The Interactive Demo

Horizontal canvas showing the whip from handle (left) to tip (right), 800×400 px, with a dark background and the whip rendered as a sequence of colored dots and connecting lines:

**Whip Design:**
- **Handle Diameter** (mm): sets μ at x=0.
- **Tip Diameter** (mm): sets μ at x=L.
- **Taper Exponent** (0.5–4): controls whether taper is gradual (concave) or rapid (convex).
- **Taper Profile Preview:** shows a side-profile silhouette of the whip shape.
- **Number of Segments** (20–200): controls simulation resolution.

**Impulse Controls:**
- **Handle Amplitude** (cm): how far the hand moves.
- **Handle Frequency** (Hz): how quickly the hand snaps. Higher frequency → shorter wavelength → more energy density at tip.
- **Pulse Shape:** Sinusoidal single pulse / Sharp impulse / Figure-8 (double crack).

**Visualization:**
- Segments colored by **local wave speed** (blue → red gradient).
- **Tip Speed Readout** in m/s and Mach number, updating every frame.
- **Amplitude Envelope** overlay — a light gray curve showing the wave amplitude at each x position.
- **Wave Speed Profile** mini-graph below main canvas.
- Sonic boom flash and audio when tip speed > 343 m/s.
- **Energy Conservation Check:** bar graph of total wave energy at handle vs. tip (should be approximately equal minus damping losses).

---

## Production Notes

**Structure and timing:**
- Hook: 0:00–1:00 (60 s). The slow-motion footage is the hook — this is a visually stunning phenomenon. Source 10,000 fps footage (Phantom camera; Smarter Every Day has done this and may license). If unavailable, render in Blender 3D at high frame rate.
- Naive attempt: 1:00–3:00 (120 s). The uniform string simulation is fast to code. Deliberately show the boring result and let it sit for a few seconds — the anticlimactic flatness is the point.
- Physics explanation: 3:00–5:30 (150 s). The c = √(T/μ) derivation can be shown in 60 seconds (tension pulling restoring force, F=ma, wave equation). Then spend 90 seconds on the energy conservation argument — A ∝ μ^(-1/4). Have these equations pre-typeset and animate them onto screen.
- The fix: 5:30–7:30 (120 s). Show the taper profile code change clearly — it's a one-function change. Run the tapered simulation immediately. The tip speed climbing is the "aha" moment — add a rising sound (pitch increases with tip speed) culminating in the crack.
- Wow moment: 7:30–10:00 (150 s). The four-profile comparison runs automatically. The solar corona analogy with the annotated sun image is visually compelling — prepare the image with labeled scale bars.
- Interactive demo: 10:00–11:00 (60 s).

**Key filming decisions:** The color-coded wave speed gradient on the segments is the key visual — make sure blue-to-red is clearly legible. Record the crack sound with a directional microphone pointed directly at the tip of a real whip (set microphone on a stand, place whip tip nearby, roll at 192 kHz sample rate — the sonic boom shape is visible in the waveform).

**Approximate runtime:** 11 minutes.

---

## Tags
`physics` `whip` `wave-speed` `sonic-boom` `mach` `energy-conservation` `javascript` `canvas`

---

## Thumbnail

Close-up still from a 10,000 fps camera: a whip tip surrounded by a clearly visible Mach cone shockwave in air (made visible by schlieren photography or high-speed shadowgraph). The tip is blurred by motion. A speed gauge overlay reads "Mach 1.1" in red digits. The word "CRACK" in large white letters with a star burst visual behind it. Bottom: CodedLaws watermark. The image stops the scroll because the Mach cone around a leather strap is counterintuitively dramatic — it looks like a bullet, not a whip. The cognitive dissonance ("that's a whip?") triggers curiosity and a click.
