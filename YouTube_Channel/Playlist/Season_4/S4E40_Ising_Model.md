---
title: "How Magnetism Switches On: A Phase Transition Built From Simple Rules"
season: 4
episode: 40
difficulty: 7/10
concept: "Ising model, Metropolis Monte Carlo, and phase transitions"
prereq: "E37–E39 (statistical quantum concepts) + E16 (grid evolution patterns)"
tags: [Ising-model, Monte-Carlo, phase-transition, Metropolis-algorithm, magnetism, javascript, statistical-mechanics, critical-phenomena, symmetry-breaking]
type: playlist-video
---

## S4·E40 — "How Magnetism Switches On: A Phase Transition Built From Simple Rules" *(Season 4 Finale)*

- **Alt title:** "The Ising Model: When Randomness Suddenly Snaps Into Order"
- **Difficulty:** 7/10 · **Prereq:** E37–E39 (statistical quantum concepts) + E16 (grid evolution patterns)
- **Hook:** A grid of random magnetic spins — up or down, equally likely. Above a critical temperature, it stays random. Drop the temperature one degree past the Curie point and, almost instantly, large coherent domains of aligned spins snap into existence. The same rules, one parameter change, completely different universe.
- **The break (bug):** Using systematic sequential updates (sweep row by row, left to right) instead of random Metropolis sampling violates detailed balance. The update order creates artificial spatial correlations that bias the equilibrium — the phase transition appears at the wrong temperature and the domain structure looks wrong. Fix: randomize the update order using the Metropolis-Hastings algorithm.
- **Concept introduced:** Ising model: each spin s_i = ±1 interacts with neighbors via Hamiltonian `H = -J Σ s_i s_j - B Σ s_i`. Monte Carlo simulation: randomly flip spins using Metropolis acceptance `P = min(1, e^(-ΔE/kT))`. Detailed balance: accept probabilities must satisfy `P(state A → B)/P(B → A) = e^(-(E_B - E_A)/kT)` to reach the correct Boltzmann distribution.
- **Push it / wow moment:** Near-critical behavior — the correlation length ξ diverges as T→Tc, spin patterns become fractal, and power-law scaling appears. Add the Wolff cluster algorithm (flip entire correlated clusters at once instead of single spins) to see 100× speedup near criticality. Plot magnetization vs. temperature — the sharp phase transition appears at exactly `Tc = 2J/k·ln(1+√2)` ≈ 2.27J/k (the Onsager solution).
- **Demo:** Temperature slider from 0 → 4Tc. Watch the phase transition. Live magnetization vs. temperature curve being traced in real time. Wolff vs. Metropolis toggle showing the critical slowing-down effect.
- **Tags:** `Ising-model` `Monte-Carlo` `phase-transition` `Metropolis-algorithm` `magnetism` `javascript` `statistical-mechanics` `critical-phenomena` `symmetry-breaking`
- **Thumbnail:** Split screen — chaotic disordered spins above the Curie temperature vs. large ordered domains below. "THE EXACT MOMENT ORDER APPEARS."

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_4/_Season_4_Overview|Season 4 Overview]]*
