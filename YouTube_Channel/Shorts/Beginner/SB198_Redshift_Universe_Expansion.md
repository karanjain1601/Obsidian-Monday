---
title: "Redshift: The Universe Is Still Expanding"
id: SB198
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, astrophysics, redshift, cosmology]
---

> **What it is:** A ~45-second simulation short where a galaxy's spectral lines visibly slide from green to red as an expanding space grid stretches the light traveling through it, confirmed by a Hubble diagram of galaxy data points lining up on v = H₀d — and the CMB represents light redshifted by a factor of 1090 over 13.8 billion years. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Redshift: The Universe Is Still Expanding

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A galaxy (blue-white spiral) emits a narrow green spectral line (550 nm) on a black spectrum strip. The galaxy moves rightward (away from camera). The green line visibly slides — slowly, then faster — toward red. It arrives at 620 nm: now orange-red. Text: "The universe stretched that light. Here's how we know it's expanding."

## Main Visual Sequence (0:03–0:50)
**0:03** — Diagram: observer (telescope icon, left) and a spiral galaxy (blue, right, labeled "NGC 4889, v = 6,500 km/s"). A wavy green light ray travels from the galaxy leftward to the telescope. Below the ray: a wavelength ruler showing the emitted wavelength (λ_emit = 550 nm, green marker) and received wavelength (λ_obs = 562 nm, slightly right of green). Label: "Cosmological redshift z = Δλ/λ = 0.022."

**0:08** — Emission spectrum panel. Left side: "In galaxy's rest frame" — H-alpha line (red, 656 nm), H-beta (blue-green, 486 nm), Ca II K (violet, 393 nm) labeled with standard positions. Right side: "Observed from Earth" — same lines shifted rightward by z = 0.022. Arrow: "Redshift z = (λ_obs − λ_emit) / λ_emit."

**0:14** — Hubble diagram animation. X-axis: "Distance (Mpc)", Y-axis: "Recession velocity (km/s)". Dots appear one by one (20 galaxy data points, white). A straight line fits through them. Label appears: "v = H₀ × d". H₀ label fades in: "H₀ = 70 km/s/Mpc (Hubble constant)". At d = 100 Mpc: v = 7,000 km/s. At d = 1000 Mpc: v = 70,000 km/s.

**0:22** — Physical interpretation. Grid of squares (representing space, grey lines). Animation: grid stretches uniformly — every square gets larger. Two galaxies (blue dots) at grid intersections move APART as the grid expands. A light wave between them: its wavelength stretches proportionally with space. Label: "Space itself is expanding — not galaxies moving through space."

**0:29** — Recession speed limit question. A graph shows v vs d extended to large distances. At d = c/H₀ ≈ 4285 Mpc: v = c (speed of light). Beyond this — the Hubble sphere — galaxies recede faster than light. Label: "Hubble sphere radius: ~4.4 Gpc. Galaxies beyond it are undetectable to us." Note: "This does NOT violate relativity — space itself stretches."

**0:35** — CMB as ultimate redshift evidence. A smooth heat map (orange-red microwave glow, all-sky projection). Label: "Cosmic Microwave Background: light emitted at z = 1089 (380,000 years after Big Bang). Originally ~3000 K visible light — now redshifted to 2.725 K microwaves." Wavelength scale: 500 nm → 1.9 mm (factor of 1090).

**0:41** — Final: time-lapse of Hubble diagram from Hubble's 1929 data (24 galaxies) to modern survey (10,000 galaxies). Line gets tighter and steeper. Label: "Same law. Same expansion. Confirmed over 97 years."

## Physics Concept Teased
Cosmological redshift arises because the universe is expanding — the space through which light travels stretches, elongating the photon's wavelength proportionally; the Hubble law (v = H₀d) quantifies this, and the Cosmic Microwave Background represents photons stretched by a factor of 1090 over 13.8 billion years.

## On-Screen Text / Captions
- **0:00** — "A green line shifted red. That's how we know the universe is expanding."
- **0:03** — "NGC 4889: v = 6,500 km/s | z = 0.022"
- **0:08** — "z = (λ_obs − λ_emit) / λ_emit"
- **0:08** — "Every spectral line shifts by the same factor (1 + z)"
- **0:14** — "Hubble Law: v = H₀ × d | H₀ = 70 km/s/Mpc"
- **0:22** — "Space itself expands — light wavelength stretches with it"
- **0:29** — "Hubble sphere: galaxies beyond recede faster than c"
- **0:35** — "CMB: z = 1089 | 3000 K light → 2.725 K microwaves"
- **0:41** — "Confirmed from 1929 to today — expansion is real"

## End Card
**0:47–0:50** — Black background. Hubble diagram dots with best-fit line. Bold text: "REDSHIFT — Physics Series". "@CodedLaws". Subscribe button pulses red.

## Audio
- **Music:** Expansive, slow ambient — low synth drone that slowly slides down in pitch (auditory redshift), 40 BPM. Feels like the universe breathing outward.
- **Voiceover:** "Every galaxy's spectral lines are shifted to longer wavelengths by the same factor — the redshift z — which tells us how much space has stretched since that light was emitted." (0:08–0:24, calm, measured male voice).
- **SFX:** Subtle Doppler pitch-shift sound on wavelength sliding (0:03–0:08); gentle "whoosh" as Hubble diagram dots appear; deep cosmic hum during CMB panel (0:35).

## Production Notes
- **Renderer:** Python + Matplotlib for Hubble diagram (animated scatter + line fit) and spectrum visualization (wavelength-to-color mapping via CIE color matching functions). Grid expansion animation via FuncAnimation.
- **Code complexity:** Medium. Spectrum panel: render as a 1D colormap (400–700 nm range) with vertical line markers for spectral lines. Animate marker positions shifting rightward by factor (1+z). Hubble diagram: use real Hubble (1929) data for first frame, then transition to simulated modern survey data.
- **Key visual trick:** The expanding grid animation (0:22) — use a color-coded grid where cell size is labeled in kiloparsecs. As grid expands, the label updates in real time (e.g., "500 kpc → 505 kpc over 70 Myr") — making the expansion rate tangible.
- **Runtime:** Hubble diagram dot-by-dot animation (0:14–0:22) — each dot appears at 0.4 s intervals (20 dots × 0.4 s = 8 s).
- **Gotchas:** Distinguish cosmological redshift (space expansion) from Doppler redshift (peculiar velocity through space) — they are physically different mechanisms but produce observationally similar spectral shifts at low z. The Hubble flow dominates at distances > 10 Mpc.
