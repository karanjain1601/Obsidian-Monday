---
title: "Why the Moon Creates Two Ocean Bulges, Not One (Tidal Forces)"
id: B017
difficulty: 2.5/10
prereq: "None"
concept: "Tidal force as differential gravity — F_tidal ≈ −2GMm·dr/r³"
tags: [physics, tides, gravity, tidal-forces, differential-gravity, moon, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why the Moon Creates Two Ocean Bulges, Not One (Tidal Forces)

**Alt title:** "Why Is There High Tide on the OPPOSITE Side of the Moon?"
**Difficulty:** 2.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Show a time-lapse of an ocean beach over 24 hours — two high tides, two low tides. Ask: "If the Moon pulls the ocean on the side facing it, why is there ALSO a high tide on the side facing AWAY from the Moon?" Show a clock: as Earth rotates, you're in high tide when facing the Moon, low tide 6 hours later, high tide again 12 hours later when you're on the opposite side of Earth from the Moon, then low tide again. That second high tide — the one on the far side — is the counterintuitive one. Most people expect: one bulge toward the Moon, one low on the sides, no bulge at all away from the Moon. Reality: two bulges. Show tide gauges from opposite sides of Earth over the same 24-hour period — both show two peaks. Then say: "The explanation requires us to stop thinking about the total gravitational force and start thinking about differences in gravitational force. The key word is differential." Cut to a diagram showing the Moon's gravity vector field across the Earth — the near side has slightly longer vectors than the far side. Those differences are the tidal forces. This hook uniquely frames the "away-side bulge" as the central mystery, making the counterintuitive result the target.

## The Naive Attempt

Build the model: Earth as a circle, Moon off to the right. Place small "ocean test particles" all around Earth's circumference — 36 particles at 10° intervals. Compute the gravitational force of the Moon on each particle: `F = G * M_moon * m / r²` directed toward the Moon. This gives a clear pattern: particles on the near side feel stronger force (closer to Moon), particles on the far side feel weaker force (further from Moon), particles on the top and bottom feel intermediate force at an angle. Now sum all forces and average them — this average force is what accelerates Earth as a whole toward the Moon. Apply this average force to all particles: subtract the average from each particle's force. The residuals should be the tidal forces. But in the naive code, we just apply the full force to each particle individually, as if Earth were not accelerating as a whole. This is the mistake: we forgot to move into Earth's reference frame (the freely-falling frame).

Run the naive simulation: apply F = GMm/r² to each particle toward the Moon, then update positions. All particles accelerate toward the Moon at slightly different rates. The near-side particles rush toward the Moon fastest. The far-side particles lag behind. Over a simulated hour, the Earth-shaped arrangement stretches into an elongated oval toward the Moon — with the near side pulled ahead and the far side left behind. This actually looks correct! But for the wrong reason — we haven't separated "orbital acceleration of Earth" from the differential tidal acceleration. The result is ambiguous. We need to be more careful about the reference frame.

## The Moment of Failure

Apply the uniform-force model: compute the Moon's gravitational force at Earth's center and apply that exact same vector to every ocean particle. This models the approximation that "the Moon's gravity is the same everywhere on Earth." In this model: all ocean particles get the same force, all accelerate identically toward the Moon. The ocean surface remains perfectly spherical — no bulges anywhere. We might as well have no Moon. The ammeter shows zero tidal effect.

Display side-by-side: LEFT panel (uniform force applied to every point): perfect sphere. RIGHT panel (correct differential force): two tidal bulges clearly visible. The difference is subtle but real — the Moon is 384,000 km away and Earth's radius is 6,371 km, so the near and far sides of Earth differ in distance from the Moon by 12,742 km, making the gravity difference about 12,742 / 384,000 ≈ 3.3% from near to far side. That 3.3% difference across Earth's diameter is the entire source of tides. Show the force vectors on screen: the tidal force vectors (the residuals after subtracting the center-of-Earth force) are small — about 1/10,000,000 of surface gravity — but they act continuously, and over time they pile up ocean water into the two bulge pattern.

## Why It Broke — The Physics

To find the tidal force, go to the reference frame of Earth's center, which is in free fall toward the Moon. In this freely falling frame, the Moon's gravitational pull on Earth's center is exactly canceled (that's what free fall means). The residual force on a particle at displacement **r** from Earth's center is the Moon's force on that particle minus the Moon's force on Earth's center:

**F_tidal = F_Moon(Earth center + r) − F_Moon(Earth center)**

Expanding this using a Taylor series (for r << R_Moon where R_Moon is the Earth-Moon distance):

**F_tidal ≈ −(2GM_Moon / R_Moon³) · r_parallel + (GM_Moon / R_Moon³) · r_perpendicular**

(Where r_parallel is the component of r along the Earth-Moon axis and r_perpendicular is the component perpendicular to it.) This quadrupolar force field: stretches Earth along the Earth-Moon axis (both toward and away from the Moon) and compresses Earth in the perpendicular plane. This is why there are TWO bulges: one on the near side (stretched toward Moon) and one on the far side (stretched away from Moon because those particles are behind the free-falling reference frame). The far-side bulge is a pseudo-force effect of the orbital free fall.

**F_tidal ≈ 2GM_Moon · m · dr / R_Moon³** (along Earth-Moon axis, in magnitude)

## The One Concept

**Tidal force: the gradient of gravity — the difference in gravitational pull across an extended body**

**Formal definition:** Tidal forces arise when a gravitational field is non-uniform across an extended body. The tidal force on a particle at displacement **r** from the body's center (in the body's freely-falling reference frame) is F_tidal = (∂F/∂r) · r, where ∂F/∂r is the gradient of the gravitational force at the center. For a Moon of mass M at distance R, the tidal force along the Earth-Moon axis on a test mass m at Earth's surface is: F_tidal = 2GMm·r_E / R³, where r_E is Earth's radius.

**Physical intuition:** You're in an elevator with no windows, in free fall toward the Moon. You feel weightless (free fall). But a ball at your feet is slightly closer to the Moon and falls slightly faster. A ball at your head is slightly farther and falls slightly slower. The ball at your feet slowly drifts toward the floor of the elevator; the ball at your head slowly drifts toward the ceiling. The "gravity" inside the elevator stretches things vertically and squeezes them horizontally. You feel an apparent force that has nothing to do with how massive you are — just where you are relative to the source of the gravity gradient.

**Tidal vs gravitational force:** Total gravity falls as 1/r². Tidal force (the gradient) falls as 1/r³ — one extra power of r in the denominator. This means tidal forces are far more sensitive to distance. Double the Moon's distance, and surface gravity from the Moon drops to 1/4, but tidal force drops to 1/8. This is why the Sun, despite being far more massive than the Moon, produces smaller tides on Earth: F_tidal ∝ M/R³. For the Moon: M=7.35×10²² kg, R=3.84×10⁸ m → M/R³ = 1.31 × 10⁻²¹. For the Sun: M=2×10³⁰ kg, R=1.5×10¹¹ m → M/R³ = 5.93 × 10⁻²² — about 0.45× the Moon's tidal influence. Spring tides (Sun, Moon aligned) are about 20% higher than neap tides (Moon at right angles to Sun).

**Real-world examples:**
1. **Ocean tides:** The tidal bulges are locked to the Earth-Moon line. Earth rotates beneath them — a coastal point passes through two bulges (high tides) and two troughs (low tides) per day. The 24-hour cycle has two high tides separated by ~12 hours 25 minutes (the extra 25 minutes accounts for the Moon advancing ~12° per day in its orbit, so Earth must rotate slightly more than 360° to return to the same tidal phase).
2. **Tidal locking:** Earth's tides dissipate energy (water sloshing). The tidal bulges are dragged slightly ahead of the Earth-Moon line by Earth's rotation. This creates a gravitational torque that slows Earth's rotation over geological time and accelerates the Moon's orbit (moon spiraling outward ~3.8 cm/year). The Moon was already tidally locked this way billions of years ago — slowed until its rotation matched its orbital period: one face always toward Earth.
3. **Io's volcanic hellscape:** Jupiter's enormous tidal force on its moon Io (much stronger than Earth-Moon, because Jupiter is vastly more massive and Io is much closer relative to its size) continuously flexes and deforms Io. The internal heating from this tidal flexing powers over 400 active volcanoes — Io is the most volcanically active body in the solar system. The tidal heating rate is about 2 W/m² — comparable to Earth's internal heat flow.

## The Fix

Compute tidal forces correctly by subtracting the center-of-Earth force from each particle's force:

```javascript
function computeTidalForces(particles, moonPos, moonMass, earthCenter) {
  const G = 6.674e-11;
  
  // Force on Earth's center from Moon
  const dx0 = moonPos.x - earthCenter.x;
  const dy0 = moonPos.y - earthCenter.y;
  const r0 = Math.sqrt(dx0**2 + dy0**2);
  const F0_mag = G * moonMass / (r0 * r0);
  const F0 = { x: F0_mag * dx0 / r0, y: F0_mag * dy0 / r0 };
  
  // Tidal force on each particle
  for (const p of particles) {
    const dx = moonPos.x - p.x;
    const dy = moonPos.y - p.y;
    const r = Math.sqrt(dx**2 + dy**2);
    const Fp_mag = G * moonMass / (r * r);
    const Fp = { x: Fp_mag * dx / r, y: Fp_mag * dy / r };
    
    // Tidal force = Moon's force on particle - Moon's force on center
    // (i.e., subtract the common free-fall acceleration)
    p.tidalFx = Fp.x - F0.x;
    p.tidalFy = Fp.y - F0.y;
  }
}
```

Apply tidal forces to the ocean layer. Show the resulting displacement pattern: near-side particles pushed toward Moon, far-side particles pushed away, equatorial particles pushed toward Earth's center. The resulting shape is an oblate-prolate ellipsoid with the long axis pointing at the Moon. Two high-tide bulges visible. The simulation now shows the correct geometry: as Earth rotates, a point on the equator passes through both bulges — two high tides per rotation.

## The Wow Moment — Push It

Build three advanced demonstrations. First: **tidal locking animation**. Show Earth-Moon system from above. Draw the tidal bulge as slightly ahead of the Earth-Moon line (because Earth's rotation drags the bulge forward). The Moon's gravity pulls on the near bulge (ahead of the line) and pulls the far bulge (behind the line) less. The net torque slows Earth's spin. Run for many simulated orbits — watch Earth's rotation rate slowly decrease while the Moon's orbital radius increases slightly. Show the end state: tidal lock. For bonus: show how the Moon's own rotation has already been locked to its orbital period — hence we always see the same face.

Second: **Roche limit simulation**. Bring a small moon of radius r_m and density ρ_m toward a large planet. The tidal force stretches the moon; self-gravity holds it together. The Roche limit is the orbital radius at which tidal forces overcome self-gravity:

**d_Roche ≈ 2.44 · R_planet · (ρ_planet / ρ_moon)^(1/3)**

As the simulated moon crosses the Roche limit, tidal forces exceed self-gravity — the moon begins to deform, elongate, and eventually break apart into individual particles that then spread into a ring. Run this in slow motion and watch the moon disintegrate into Saturn's rings in real time. The moment of breakup is visually stunning — show it from multiple angles.

Third: **Jupiter-Io tidal heating**. Show Io in its elliptical orbit around Jupiter. Because Io's orbit is slightly elliptical (forced by resonance with Europa and Ganymede), the tidal force varies as Io gets closer and further from Jupiter. This variable tidal squeeze and release continuously flexes the moon's interior, generating enormous heat. Show a heat map of Io's surface — volcanic hotspots concentrated where tidal flexing is greatest. Compare to Europa (slightly further, less tidal heating) and Ganymede (even further, minimal).

## The Interactive Demo

Canvas simulation at 1000 × 700 px. Earth at center, Moon in orbit around it.

**Moon mass slider** (0.1 to 10× real Moon mass): Scales the tidal force. At 10×, the tidal deformation of the ocean is dramatically visible. Real Moon: subtle but present.

**Moon distance slider** (2 to 20 Earth radii): Closer Moon → much stronger tidal forces (1/r³ dependence). Show the Moon's Roche limit at ~2.9 Earth radii — a red warning zone. Moving below Roche limit: ocean simulation starts showing shearing.

**Tidal vector field display:** Toggle showing the tidal force vectors at every point on Earth's surface. The quadrupolar pattern (stretch along Earth-Moon axis, compress perpendicular) should be visually clear.

**Earth rotation rate slider** (0 to 100× real rotation rate): Speed up Earth's rotation. At high speeds, the tidal bulge lag (ahead of the Earth-Moon line) becomes visible.

**Ocean surface deformation:** Toggle shows the actual deformed ocean surface shape (an ellipsoid). The height of the tidal bulge in meters is displayed.

**Multi-body mode:** Add the Sun. Toggle between Spring tide (Sun, Earth, Moon aligned — tides add) and Neap tide (Moon at 90° to Sun-Earth line — tides partially cancel). Percentage difference shown.

**Roche limit mode:** Switch to a moon-destruction simulation. Bring a small rubble-pile moon inward. Watch it deform and shatter. Play in slow motion.

**Historical tide data overlay:** Load real tide data from a coastal city and overlay it on the simulated tide curve. The match is good for a qualitative demonstration (a full quantitative match requires ocean basin resonances that are much more complex).

## Production Notes

**Runtime estimate:** ~15–17 minutes. Hook with counterintuitive reveal (2 min), Naive code (2.5 min), Failure reveal (1.5 min), Physics explanation (4 min — this is the conceptually hardest episode so far), Fix (2 min), Wow demos (3 min), Interactive (2 min).

**Screen layout:** This episode benefits from more whiteboard/diagram time than previous ones. Use a 50/50 split: canvas on left, alternating between code editor and pre-drawn diagrams on right. The tidal force vector field visualization is the hero diagram — prepare it as an animated vector field.

**Animations to prepare:** Free-fall reference frame animation (the elevator thought experiment). The gradient-of-gravity diagram. Tidal locking over geological time (time-lapse style). Roche limit breakdown animation (pre-render at high quality — this should be genuinely beautiful). Io volcanic map overlay.

**Key zoom moments:** (1) The tidal force vector field appearing — zoom into the far-side vectors pointing AWAY from the Moon. This is the moment the counterintuitive far-side bulge becomes geometrically obvious. (2) The Roche limit crossing — the moon begins to elongate along the tidal axis. Hold on this moment. (3) The tidal locking torque diagram — zoom into the misaligned bulge and the resulting torque arrow.

**B-roll:** Real tide gauge time-series data plotted as a live animation. Satellite imagery of tidal flows through narrow channels (Bay of Fundy — 16 m tides). Io's volcanic surface (NASA public domain images). Saturn's rings (Cassini images, NASA).

**Script note:** The free-fall reference frame is the conceptual crux. Spend extra time here. Use the International Space Station as an accessible example: astronauts feel weightless aboard ISS not because there's no gravity (there is — it's ~88% of surface value at ISS altitude) but because they're in the same free fall as the station. A tidal force in the ISS would appear if a body much larger than Earth were nearby creating a gravity gradient across the station's length.

## Tags
`physics` `tides` `gravity` `tidal-forces` `differential-gravity` `moon` `javascript` `canvas` `beginner`

## Thumbnail

Earth seen from space, heavily exaggerated tidal bulges visible as two protrusions on opposite sides — one facing the Moon (shown partially in frame, upper right) and one on the directly opposite side. The Moon's side bulge is expected; viewers naturally see the far-side bulge and feel confused. Bold text: "WHY TWO BULGES?" Smaller subtext: "The Moon pulls on that side too?" The Earth's ocean regions show deep blue, tidal bulges appear lighter blue. The Moon visible in the corner with a faint gravitational lensing glow. The visual puzzle — two bumps when intuition says there should be one — is immediately arresting. Emotion: "I've heard about tides my whole life and just realized I had no idea how they actually work." Clean space-dark background, high contrast.
