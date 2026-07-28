---
title: "Chemical Bonds: The Energy Well"
id: SB177
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, quantum-physics, chemical-bond, potential-energy]
---

> **What it is:** A ~45-second simulation short where two hydrogen atom spheres approach each other and snap into the minimum of a live Morse potential curve at 0.74 Å, then vibrate around equilibrium, revealing that covalent bonding is simply atoms rolling into an energy well described by quantum electron sharing. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Chemical Bonds: The Energy Well
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Two hydrogen atoms (white spheres with electron clouds) approach each other from far apart. As they get close, a live potential energy curve plots in the corner — dipping down into a deep valley at 0.74Å separation. The atoms snap into the well like magnets finding their minimum. The "snap" to equilibrium is satisfying and physical.

## Main Visual Sequence (0:03–0:50)
**0:03** — Two hydrogen atoms (white spheres, electron clouds shown as blue halos) starting 5Å apart. Potential energy graph (x = interatomic distance, y = PE in eV) in top-right corner. Both atoms labeled "1s electrons." At 5Å: V ≈ 0 eV (no interaction). Cursor on graph at x=5.

**0:10** — Atoms move closer. As distance decreases below ~3Å: electron clouds overlap. PE curve dips downward (attractive region, blue-green). At x = 0.74Å: PE minimum = −4.52 eV (bond depth). Label: "Equilibrium bond length r₀ = 0.74 Å." Atoms settle at this distance, vibrating slightly around equilibrium.

**0:18** — Why the attractive well? Two contributions shown: (1) Electron sharing between nuclei lowers kinetic energy (quantum effect) — label: "KE contribution, blue." (2) Electron density between nuclei shields nuclear repulsion — label: "potential contribution, orange." Together: net attraction.

**0:27** — Force visualization: F = −dV/dr. On left slope of well (r > r₀): F is attractive (arrow points toward other atom). On right slope (r < r₀): F is repulsive (strong nuclear + electron repulsion). At bottom: F = 0 (equilibrium). The well shape directly gives the force law.

**0:35** — Dissociation energy D_e = 4.52 eV: energy needed to pull atoms apart. Vibrational energy levels shown (horizontal lines inside the well, equally spaced in harmonic approximation). Zero-point energy (ground state vibrational level) = 0.27 eV above bottom. "Even at 0K, atoms still vibrate — quantum effect."

**0:43** — Morse potential equation shown: V(r) = D_e[1 − e^(−α(r−r₀))]² − D_e. "This equation captures every covalent bond." CodedLaws logo.

## Physics Concept Teased
A covalent chemical bond forms when two atoms reach the equilibrium internuclear distance where the potential energy is minimized (r₀ = 0.74 Å for H₂). The bond energy well depth (D_e = 4.52 eV) represents the energy required to dissociate the molecule. The Morse potential accurately models this well, including anharmonicity at large separations.

## On-Screen Text / Captions
- 0:03 → "Two hydrogen atoms approaching each other"
- 0:10 → "Energy minimum at r₀ = 0.74 Å, V = −4.52 eV"
- 0:18 → "Electron sharing lowers energy → bond forms"
- 0:27 → "F = −dV/dr: attractive far, repulsive close"
- 0:35 → "Zero-point energy: atoms vibrate even at 0K"
- 0:43 → "Morse potential: V = D_e[1−e^(−α(r−r₀))]²"

## End Card
Final 3 seconds: Morse potential well with two H atoms sitting at minimum, vibrating. Text: "Every bond is just a potential energy well." CodedLaws subscribe.

## Audio
Clean, resonant ambient tone that shifts in pitch as the atoms approach (lower pitch = deeper in the well). At bond formation (0:10): satisfying soft "click" or "snap" sound. Voiceover: "Chemistry is just particles rolling into energy wells. That's it." Soft string instrument underneath.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: animate atom positions driven by Morse potential force F = −dV/dr (simple velocity-Verlet integration); simultaneously draw the Morse potential curve with a moving cursor showing current (r, V) position; show kinetic energy as speed of atoms. Runtime: real-time. Gotcha: add gentle damping to simulation so atoms settle at equilibrium rather than bouncing forever; make damping small enough that oscillations are visible (underdamped).
