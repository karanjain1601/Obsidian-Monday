---
title: "Nuclear Chain Reaction: Coding a Critical Mass"
id: B068
difficulty: 2.5/10
prereq: "None"
concept: "Each fission releases 2-3 neutrons; multiplication factor k = (neutrons produced)/(neutrons absorbed+leaked); k<1 subcritical (dies), k=1 critical (steady), k>1 supercritical (exponential growth)."
tags: [nuclear, fission, chain-reaction, criticality, neutron, exponential-growth, canvas, beginner]
category: beginner
type: video-idea
---

# Nuclear Chain Reaction: Coding a Critical Mass

**Alt title:** "One Neutron In. How Many Come Out?"
**Difficulty:** 2.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

A single neutron — a small white dot — enters a rectangular mass of grey material on screen. It collides with a nucleus in the centre. The nucleus flashes, splits, and releases two new neutrons. Each of those travels outward, hits another nucleus, releases two more. Four neutrons. Each splits another — eight. Then sixteen. The screen becomes a blizzard of white dots in under a second, nuclei flashing and splitting everywhere, a cascade of light. The host freezes it: "That's a chain reaction. One neutron in. In nine generations — about one microsecond — you have 512. In a real weapons-grade device, in about 80 generations, you've generated enough energy to flatten a city." Rewind to the beginning. "But watch what I do now." The host shrinks the grey rectangle slightly. Now when the first neutron enters and splits, the two daughter neutrons fly outward — and both exit the material boundary without hitting anything. The cascade dies immediately. "Same material. Slightly smaller. Zero chain reaction. That's critical mass."

## The Naive Attempt

The viewer writes a 2D canvas simulation. Nuclei are distributed as circles randomly across a rectangular canvas region. Neutrons are point particles that travel in straight lines. The host writes the update loop: each neutron moves at constant velocity `vx, vy`. When a neutron comes within a capture radius of any nucleus, a fission event occurs: the neutron disappears, the nucleus flashes and is removed, and two new neutrons are emitted at random angles. Neutrons that exit the canvas boundary are removed (they have "leaked" out). The viewer runs the simulation with 100 nuclei in a large area. They fire one neutron from the left edge. It flies across, maybe hits one nucleus, produces two neutrons that fly outward — and both exit the boundary immediately. No chain reaction. They increase nuclei density. At some point, one of the daughter neutrons hits a second nucleus before escaping. A secondary fission occurs. The host says: "We're getting closer. But how do we know quantitatively if it will sustain?" The viewer has no systematic way to predict whether the current configuration is sub- or super-critical — they're just trial and erroring.

## The Moment of Failure

The host runs the simulation with density set just below the critical threshold. The first generation produces 2 neutrons. Both escape. Zero second generation. The chain dies in one step. The host increases density by 1%. Now the first generation produces 2 neutrons, one escapes, one stays: 1 neutron in the second generation. Second generation also produces 1 neutron (on average). The chain seems to sustain. But over 200 simulation ticks, the neutron count randomly fluctuates — sometimes 0 (the chain dies due to random geometry), sometimes 3 or 4. The simulation cannot distinguish cleanly between k=0.99 (dies slowly) and k=1.01 (grows slowly) because the random geometry adds noise. Without computing k explicitly, the viewer cannot tell subcritical from critical. The failure is that the purely Monte Carlo approach gives no predictive power.

## Why It Broke — The Physics

The multiplication factor k is defined as the ratio of neutrons in one generation to neutrons in the previous generation. Formally: k = η × f × p × ε × P_NL (the four-factor formula times non-leakage probability), but for this video the host simplifies to:

**k = ν × P_fission × P_non-leak**

where ν ≈ 2.4 (average neutrons per fission for U-235), P_fission is the probability a neutron causes fission before being absorbed, and P_non-leak is the probability a neutron doesn't escape the boundary before being absorbed. When k < 1: the chain is subcritical — each generation is smaller, power decreases exponentially. When k = 1: the chain is critical — self-sustaining, steady-state reactor. When k > 1: the chain is supercritical — each generation is larger, power grows exponentially as k^n where n is the generation number. Critical mass is the minimum mass of fissile material for which k = 1 with no external reflector. For pure U-235 it is about 52 kg (a sphere of ~17 cm radius); for Pu-239 it is about 10 kg (due to higher ν and cross-section). Reflectors (beryllium, water) scatter escaping neutrons back inward, dramatically reducing critical mass.

## The One Concept

The multiplication factor k is the single number that controls whether a nuclear system will explode, sustain, or fizzle. It is a pure ratio with no units. Understanding it requires three ingredients: how many neutrons each fission produces (ν, a nuclear property, fixed at ~2.4 for U-235), how likely each neutron is to cause a fission before being absorbed (depends on material enrichment and density — more enriched and denser → higher P_fission), and how likely each neutron is to stay inside the material (depends on geometry — a larger, more compact mass means fewer neutrons reach the surface before being absorbed → higher P_non-leak). Critical mass emerges from the geometry: as mass increases, the surface-to-volume ratio decreases (a sphere scales as r² / r³ = 1/r), so P_non-leak increases. At some critical radius, k reaches exactly 1. This is why the shape matters: a sphere has the smallest surface-to-volume ratio and therefore the lowest critical mass for a given material. A thin flat plate of the same mass might have k = 0.3 even though a sphere of the same mass has k = 1.1. Reactor control rods absorb neutrons (reducing P_fission per neutron), allowing operators to tune k to exactly 1 during normal operation.

## The Fix

The host adds explicit k computation to the simulation. After each generation, the code counts neutrons produced and neutrons in the previous generation: `k = neutronsThisGen / neutronsPrevGen`. This value is displayed in real time as a large number on screen. The host also adds a "mean free path" slider: rather than placing nuclei randomly, the simulation now uses a Poisson process where each neutron has a probability `p = dx/lambda` of causing fission in each step dx, where lambda is the mean free path (inversely proportional to nuclear density). A second leakage probability is computed geometrically: `P_leak = surfaceArea / (volume * sigma)`. With these two numbers, the displayed k-value matches the simulation behaviour: when the displayed k > 1, the neutron count visibly explodes; when k < 1, it visibly dies; when k is tuned to 1.00 the population is steady (within statistical noise).

## The Wow Moment — Push It

The host builds a reactor control simulator. A large canvas shows a cross-section of a reactor core: a circular fuel region surrounded by a water moderator (which both reflects neutrons back and slows them to thermal energies where fission cross-section is highest). Control rods are drawn as dark rectangles insertable from the top. The simulation runs a real-time neutron population with hundreds of particles visible at once. The host fully withdraws the control rods: k climbs to 1.05, the neutron population doubles every second, power ramps up. They re-insert the rods: k drops below 1, the population decays. They find the exact insertion depth for k = 1.000: steady glow, stable power. Then — the dramatic finale — they remove all rods and disable the moderator cooling (simulating a loss-of-coolant accident where the moderator heats up and becomes less effective). k climbs to 1.2. The neutron cascade goes supercritical. The simulation canvas fills with white-flash explosions.

## The Interactive Demo

- **Fissile material mass (kg):** slider 1–100 kg — updates computed critical radius and displays k
- **Geometry selector:** Sphere, Cube, Flat plate — shows how shape at same mass affects k
- **Enrichment level (%):** slider 20–100% U-235 — affects P_fission and therefore k
- **Reflector toggle:** None, Water, Beryllium — dramatically reduces critical mass when enabled
- **Control rod insertion depth (%):** slider 0–100% — tunes k in real time
- **Neutron population display:** real-time graph of neutron count over time (linear and log scale)
- **Single neutron injection button:** fires exactly one neutron and traces all its descendants in distinct colours by generation

## Production Notes

The simulation canvas uses a dark background with nuclei as small glowing yellow circles and neutrons as fast white dashes. Fission events should produce a brief bright flash with a small radial shockwave animation. The neutron population graph at the bottom should show both the raw count and a fitted exponential with the measured k value annotated. When going supercritical, gradually increase the canvas background brightness from black to orange to white, with a sound effect building in pitch — making the viewer feel the runaway. During the Concept section, show a large animated graphic of the k < 1 / k = 1 / k > 1 tree diagrams: each neutron as a node, branching into daughters, clearly showing the dying, steady, and exploding trees.

## Tags
`nuclear` `fission` `chain-reaction` `criticality` `neutron` `exponential-growth` `canvas` `beginner`

## Thumbnail

A 2D canvas view of a chain reaction mid-explosion: dozens of white neutron streaks radiating outward from a central flash, with nuclei (yellow circles) exploding in sequence. The centre has an intense white glow fading to orange at the edges. Bold red text at the top: "ONE NEUTRON IN." Bold yellow text at the bottom: "CRITICAL MASS." Dark background with a slight orange vignette for drama.
