---
title: "I Built a Wall That Particles Go Through (Quantum Tunneling, Coded)"
season: 4
episode: 38
difficulty: 7.5/10
concept: "Quantum tunneling, transmission coefficient, and WKB approximation"
prereq: "E37 (Schrödinger + wavepacket propagation)"
tags: [quantum-tunneling, Schrödinger-equation, transmission-coefficient, WKB-approximation, javascript, quantum-mechanics, potential-barrier, resonant-tunneling, flash-memory]
type: playlist-video
---

## S4·E38 — "I Built a Wall That Particles Go Through (Quantum Tunneling, Coded)"

- **Alt title:** "How Quantum Tunneling Powers Your Phone's Flash Memory — Simulated"
- **Difficulty:** 7.5/10 · **Prereq:** E37 (Schrödinger + wavepacket propagation)
- **Hook:** A wavepacket with total energy *below* the barrier height — and yet a fraction clearly appears on the other side. The probability of tunneling decreases exponentially with barrier thickness — the exact formula is derivable in 5 minutes.
- **The break (bug):** Without enforcing continuity of both ψ and dψ/dx at both barrier interfaces, the transmission coefficient is wrong by orders of magnitude. The exponential decay inside the barrier `ψ ∝ e^(-κx)` where `κ = √(2m(V-E))/ℏ` connects to the wave solution outside only if both the function and its derivative match — miss either condition and you get nonsense transmission rates.
- **Concept introduced:** Quantum tunneling, transmission and reflection coefficients `T = |transmitted amplitude|²/|incident amplitude|²`, exponential decay in classically-forbidden regions, WKB (Wentzel-Kramers-Brillouin) approximation `T ≈ exp(-2∫κ(x)dx)` for arbitrary barrier shapes, and applications: alpha decay, scanning tunneling microscopy, flash memory (Fowler-Nordheim tunneling).
- **Push it / wow moment:** Multiple barriers showing *resonant tunneling* — at specific energies, T = 1.0 exactly (perfect transmission through multiple barriers). A scanning tunneling microscope simulation showing atomic-resolution imaging as a consequence: the tunneling current depends exponentially on tip-sample distance, so even a single-atom bump causes a measurable signal change.
- **Demo:** Draw barriers of any height and width. See T update live. Compare WKB approximation vs. exact numerical result. The STM demo showing "atomic" surface features.
- **Tags:** `quantum-tunneling` `Schrödinger-equation` `transmission-coefficient` `WKB-approximation` `javascript` `quantum-mechanics` `potential-barrier` `resonant-tunneling` `flash-memory`
- **Thumbnail:** Wavefunction approaching a thick barrier — a clear transmitted lobe visible on the far side. "IT WENT THROUGH THE WALL."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_4/_Season_4_Overview|Season 4 Overview]]*
