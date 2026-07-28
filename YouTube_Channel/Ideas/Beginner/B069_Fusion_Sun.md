---
title: "Fusion in the Sun: Why It's Surprisingly Slow"
id: B069
difficulty: 2.5/10
prereq: "None"
concept: "Proton-proton chain requires quantum tunneling through the Coulomb barrier; tunneling probability is extremely low at solar core temperatures (~15M K), giving the Sun a multi-billion-year lifetime."
tags: [nuclear, fusion, quantum-tunneling, coulomb-barrier, solar, proton-proton-chain, canvas, beginner]
category: beginner
type: video-idea
---

# Fusion in the Sun: Why It's Surprisingly Slow

**Alt title:** "The Sun Is Actually a Terrible Fusion Reactor"
**Difficulty:** 2.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The simulation opens on the solar core: a field of protons (red dots) bouncing around at high speed, representing the 15-million-Kelvin plasma. Every few seconds — simulation time — two protons approach each other, their electric repulsion shown as bright blue arcs pushing them apart. They bounce off each other and resume their random motion. For a long time, nothing happens. Then, very rarely, one pair of protons gets close enough for a quantum tunneling event: the screen flickers, the two protons merge into a deuteron with a green flash, and a positron and neutrino are emitted. The host narrates: "Each proton in the Sun's core will wait, on average, about five billion years before it fuses with another proton. Five. Billion. Years." The viewer sees the canvas run at 1000× real-time speed, and fusion events are still sparse. "Your microwave generates power more intensely than the Sun's core does per kilogram of fuel. And yet the Sun has been burning for 4.6 billion years and has enough fuel for another 5 billion. The secret is that it burns incredibly slowly — and that's by physics, not by design."

## The Naive Attempt

The viewer writes a classical collision simulation. Protons (charged particles) are placed on canvas with random velocities drawn from a Maxwell-Boltzmann distribution at T = 15 × 10⁶ K. The kinetic energy of each proton is (3/2)k_B T ≈ 3 × 10⁻¹⁶ J. The Coulomb potential energy at the edge of the strong-force range (r ≈ 1 fm = 10⁻¹⁵ m) is U = ke²/r ≈ 1.4 × 10⁻¹³ J. The viewer writes a classical fusion rule: if two protons come within 1 fm of each other, they fuse. They run the simulation. The result: essentially zero fusion events in any reasonable simulation time. The viewer correctly identifies that the average thermal proton has about 1/1000 of the kinetic energy needed to classically overcome the Coulomb barrier. "So shouldn't the Sun be dead? Classically, protons at solar core temperatures simply don't have enough energy to touch." The viewer tries cranking the temperature slider until fusion events become frequent — they need about T = 10¹⁰ K, about 700 times hotter than the actual solar core. At actual solar temperatures, the classical model predicts the Sun cannot fuse at all.

## The Moment of Failure

The classical simulation at T = 15 × 10⁶ K shows the protons bouncing around energetically but never fusing. The energy graph in the side panel shows the Coulomb barrier as a tall wall (E_barrier ≈ 1.4 × 10⁻¹³ J) and the average proton kinetic energy as a tiny bump far below it (E_thermal ≈ 3 × 10⁻¹⁶ J). The ratio is displayed: 0.002× — classical protons have only 0.2% of the energy needed. If the host waits the classical expectation time for a thermal fluctuation to provide enough energy, the calculation shows it would take many times the age of the universe for a single fusion event. But the Sun is 4.6 billion years old and fusing 600 million tonnes of hydrogen per second. The classical model is off by a factor of approximately 10²⁵. Something is catastrophically missing.

## Why It Broke — The Physics

The missing ingredient is quantum tunneling. In quantum mechanics, a particle is described by a wave function that does not abruptly end at the classical turning point (where kinetic energy would be negative classically). Instead, the wave function decays exponentially inside a potential barrier and has a non-zero probability of being found on the other side. The tunneling probability through the Coulomb barrier is approximately:

**P_tunnel ∝ exp(−2π²Z₁Z₂e²/ħv) = exp(−π√(E_G/E))**

where E_G is the Gamow energy (~500 keV for p-p fusion), E is the centre-of-mass collision energy, ħ is the reduced Planck constant, and v is the relative velocity. At solar core temperatures, the peak of the integrand (the Gamow window) is around E ≈ 5–15 keV — far below the barrier height of ~720 keV, but where the Maxwell-Boltzmann tail is not too vanishingly small and the tunneling probability is not too vanishingly small: the product of these two opposing functions peaks in a narrow energy window. The resulting fusion rate is extremely small but non-zero — small enough that the Sun burns for billions of years rather than exploding instantaneously.

## The One Concept

Quantum tunneling is the phenomenon by which a quantum particle has a finite probability of passing through an energy barrier that it classically could not surmount. It arises from the wave nature of matter described by quantum mechanics: the wave function leaks into classically forbidden regions and emerges on the other side. The tunneling probability is exponentially sensitive to both the barrier height and the particle mass: heavier particles tunnel far less readily, which is why tunneling is most important for electrons and protons (light particles) and negligible for macroscopic objects. In the solar context, quantum tunneling is literally what allows the Sun to shine: without it, the Sun would be dark (classical barrier too high at actual solar temperatures). With it, each proton waits billions of years on average, but there are 10⁵⁷ protons in the Sun, so the total fusion rate is 600 million tonnes per second. The proton-proton chain proceeds in three steps: (1) p + p → d + e⁺ + ν (the bottleneck, requiring a weak-force interaction as well as tunneling); (2) d + p → He-3 + γ; (3) He-3 + He-3 → He-4 + 2p. Each chain converts about 0.7% of the mass into energy (E = mc²). The reason fusion reactors on Earth need temperatures of 100–200 million K (6–12 times hotter than the solar core) is precisely to compensate for the absence of the 10⁵⁷-proton statistical army: with far fewer particles, you need a higher per-particle tunneling probability.

## The Fix

The host adds a tunneling probability function to the simulation. When two protons approach each other, the code computes their relative kinetic energy E_kin. Instead of requiring E_kin > E_barrier for fusion, the code rolls a random number against the tunneling probability: `if (Math.random() < tunnelProb(E_kin, E_G)) { fuse(); }`. The function `tunnelProb` returns `Math.exp(-Math.PI * Math.sqrt(E_G / E_kin))` (Gamow factor). With this, fusion events begin appearing at realistic solar temperatures — rare, but non-zero. The host also adds a Gamow window visualisation: a plot showing the Maxwell-Boltzmann energy distribution (falling exponentially at high E) multiplied by the tunneling probability (rising exponentially with E) — the product is a narrow peak called the Gamow window, visible as a small bump on screen. Most fusion events happen at this peak energy.

## The Wow Moment — Push It

The host builds a stellar lifetime calculator. The canvas shows three star models side by side: a red dwarf (M = 0.2 M_sun, T_core = 8 × 10⁶ K), the Sun (M = M_sun, T_core = 1.5 × 10⁷ K), and a massive blue star (M = 20 M_sun, T_core = 4 × 10⁷ K). The tunneling probability at each core temperature is computed and displayed. The red dwarf has an extremely low tunneling rate but enormous hydrogen supply relative to power output: computed lifetime > 10 trillion years (longer than the current age of the universe). The Sun: ~10 billion years. The blue star: higher tunneling rate, enormous luminosity, burns through its fuel in only 10 million years — it is 10 million times more luminous and lives 1000 times shorter. The host shows that lifetime ∝ 1/L ∝ 1/M^2.5 approximately, and the blue star will die before the universe is 1% of its current age.

## The Interactive Demo

- **Core temperature (K):** logarithmic slider from 10⁶ to 10⁹ K — updates fusion rate and Gamow window live
- **Gamow energy slider:** lets the viewer explore hypothetical particles (varying E_G shows how sensitive fusion rate is)
- **Mass slider (solar masses):** 0.1–50 M_sun — updates computed core temperature, luminosity, and remaining lifetime
- **Tunneling vs Classical toggle:** switches between classical (zero fusion below barrier) and quantum (tunneling) mode — the contrast is stark
- **Simulation speed multiplier:** 1× to 10¹⁰× real time — needed to see fusion events at realistic temperatures
- **Gamow window plot:** live graph showing Maxwell-Boltzmann distribution, tunneling factor, and their product as the temperature changes

## Production Notes

The proton-proton canvas should use a heat-map background colour (white-hot at high temperature) with protons as small red circles trailing motion-blur streaks. The Coulomb repulsion force lines should be visible as pulsing blue arcs around each proton. When a tunneling fusion event occurs (rare at real solar temperatures), play a distinctive chime sound and show a large "TUNNEL!" overlay with the resulting deuteron in green. The Gamow window plot deserves a full-screen moment: label the Maxwell-Boltzmann curve, the tunneling factor curve, and the product curve in three distinct colours with clear annotations. During the Star Comparison Wow Moment, use a three-column layout with each star's simulation running simultaneously at the same visual scale — the blue star should be dramatically brighter and its fuel meter visibly depleting faster.

## Tags
`nuclear` `fusion` `quantum-tunneling` `coulomb-barrier` `solar` `proton-proton-chain` `canvas` `beginner`

## Thumbnail

A glowing proton (red sphere) approaching a bright Coulomb barrier wall (electric-blue gradient), with a faint ghost of the proton on the other side of the wall — illustrating tunneling. The Sun visible in the background. Bold white text: "The Sun Fuses HOW Slowly?" Yellow text at the bottom: "Quantum physics is the reason it's still here." High-drama, space aesthetic.
