---
title: "When Springs Share Masses, Something Magical Happens"
season: 1
episode: 10
difficulty: 5/10
concept: "Normal modes and coupled oscillator eigenmodes"
prereq: "E03–E09 (full integrator toolkit + oscillator physics combined)"
tags: [coupled-oscillators, normal-modes, eigenfrequencies, standing-waves, javascript, phonon, lattice-vibration, physics-code]
type: playlist-video
---

## S1·E10 — "When Springs Share Masses, Something Magical Happens" *(Season 1 Finale)*

- **Alt title:** "Normal Modes: The Hidden Harmony Inside Every Vibrating System"
- **Difficulty:** 5/10 · **Prereq:** E03–E09 (full integrator toolkit + oscillator physics combined)
- **Hook:** Two pendulums connected by a weak spring — both released from the same side. They don't move together. One swings higher; the other dies down. Then the energy fully reverses — the second one goes higher, the first dies. Back and forth, perfectly, as if breathing. Nothing was programmed to do this.
- **The break (bug):** Using a simple Euler integrator for coupled oscillators without careful timestep control causes the two normal modes (symmetric and antisymmetric) to accumulate independent phase errors that create a spurious drift in the beat frequency. Swap to RK4 and the beat period matches the analytic formula exactly.
- **Concept introduced:** Normal modes — any coupled oscillator system has a set of *independent* oscillation patterns (eigenmodes) at specific frequencies (eigenfrequencies). Any motion of the system is a superposition of these modes. The energy-swapping behavior is *beating* between two close normal-mode frequencies.
- **Push it / wow moment:** A 12-body chain of coupled oscillators — pluck one mass in the middle. Watch the energy wave propagate as a discrete pulse, reflect at the ends, and interfere. Show the frequency spectrum of the chain evolving live — you can see individual phonon modes lighting up. Connect this to why crystals have band structures and why guitar strings have harmonics.
- **Demo:** Click any mass in the chain to displace it. A "pure mode" button that excites only the symmetric or only the antisymmetric mode. Live Fourier spectrum showing which modes are active.
- **Tags:** `coupled-oscillators` `normal-modes` `eigenfrequencies` `standing-waves` `javascript` `phonon` `lattice-vibration` `physics-code`
- **Thumbnail:** Two pendulums — one fully swinging while the other is still, then the image reversed — energy bars alternating. Like two lungs breathing.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_1/_Season_1_Overview|Season 1 Overview]]*
