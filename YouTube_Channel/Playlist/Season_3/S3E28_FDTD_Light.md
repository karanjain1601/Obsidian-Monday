---
title: "I Made Light in a Computer Using Maxwell's Equations"
season: 3
episode: 28
difficulty: 8/10
concept: "FDTD method and the Yee staggered grid for Maxwell's equations"
prereq: "E21, E22, E27 (grids + fields)"
tags: [FDTD, Maxwells-equations, electromagnetic-simulation, light-simulation, Yee-grid, javascript, computational-electrodynamics, photonic-crystal]
type: playlist-video
---

## S3·E28 — "I Made Light in a Computer Using Maxwell's Equations"

- **Alt title:** "FDTD: How to Simulate Light Without Knowing Any Quantum Mechanics"
- **Difficulty:** 8/10 · **Prereq:** E21, E22, E27 (grids + fields)
- **Hook:** A pulse of light bouncing between two perfect mirrors, pixel by pixel, computed from Maxwell's four equations on a grid. Then a metamaterial cloak bends the light around an obstacle, and you watch it happen in real time.
- **The break (bug):** Without the Yee staggered grid (E and H fields offset by half a cell in both space and time), the discrete curl operators couple incorrectly, causing the simulation to fill with numerical "ghost modes" — artificial oscillations at grid wavelength that look like the simulation has a ghost image layered over the real one.
- **Concept introduced:** Finite-Difference Time-Domain (FDTD) method. The Yee lattice staggers Ex, Ey, Ez and Hx, Hy, Hz components in space by half a cell and in time by half a step, so that Maxwell's curl equations become exact on the discrete grid. The Courant condition for EM waves: `c·dt ≤ dx/√d` (where d is dimension). FDTD is used in antenna design, photonic chip simulation, and optical fiber engineering.
- **Push it / wow moment:** Simulate a photonic crystal — a periodic array of dielectric cylinders with a bandgap where certain wavelengths cannot propagate. Show the band structure visually. A waveguide that bends light 90° with zero loss. A diffraction grating producing rainbow-like color separation.
- **Demo:** Click to place a point EM source. Draw metal or dielectric regions with a paintbrush. Watch EM waves bounce, refract, and diffract in real time. Source frequency slider.
- **Tags:** `FDTD` `Maxwell's-equations` `electromagnetic-simulation` `light-simulation` `Yee-grid` `javascript` `computational-electrodynamics` `photonic-crystal`
- **Thumbnail:** Colorized EM wave pulse diffracting around a circular obstacle, beautiful fringe pattern visible in the shadow region. "MAXWELL'S EQUATIONS IN CODE."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_3/_Season_3_Overview|Season 3 Overview]]*
