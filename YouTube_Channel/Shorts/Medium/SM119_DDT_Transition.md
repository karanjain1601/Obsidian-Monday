---
title: "Deflagration to Detonation Transition"
id: SM119
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone or [[Combustion_Physics_Full]]"
difficulty: medium
tags: [physics, simulation, short, combustion, shockwaves, instability, explosives]
---

> **What it is:** A ~45-second simulation short of a slow subsonic flame turbulently accelerating through a confined tube via flame-acoustic coupling and Shchelkin spiral obstacles until a SWACER hot spot ignites a full detonation wave in under a millisecond. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Medium | **Feeds:** Standalone or [[Combustion_Physics_Full]]

# Short: Deflagration to Detonation Transition
**Feeds full video:** Standalone medium short

## Visual Hook (First 3 Seconds)
An orange flame crawls through a tube — slow, gentle, almost lazy. Then the screen erupts: a blinding white detonation front snaps into existence mid-tube, racing backward and forward simultaneously, and everything in the tube is consumed in a single violent flash. Deflagration → Detonation in under a millisecond.

## Main Visual Sequence (0:03–0:50)
- **0:03–0:10:** A long horizontal tube (echoing real detonation tube experiments). Left end ignited: slow orange deflagration flame at ~10 m/s. Pressure profile: flat, just slightly above ambient. The flame front wiggles slightly — a hint of instability. The tube has a series of obstacles (Shchelkin spiral, shown as dark rings on tube wall).
- **0:10–0:18:** Flame-acoustic interaction: the deflagration generates pressure waves that reflect off the closed end and return. These pressure waves precompress the unburnt gas ahead of the flame. The flame speeds up as it enters pre-compressed gas: now 100 m/s, 500 m/s. Cellular flame structure appears — the Landau-Darrieus instability wrinkling the flame surface, increasing surface area, increasing burn rate.
- **0:18–0:28:** Turbulent acceleration: the obstacles turbulize the flow. The wrinkled flame surface is now fractal-like. Flame speed: 1500 m/s. Leading shock detaches from flame — a precursor shock wave visible ahead of the flame. The shock and flame are still decoupled but narrowing the gap.
- **0:28–0:38:** DDT moment: at t=0.8 ms — a bright white explosion-within-an-explosion appears at one of the Shchelkin obstacles. An auto-ignition "hot spot" forms in the compressed gas between the shock and flame (SWACER mechanism: Shock Wave Amplification by Coherent Energy Release). From this hot spot, a detonation wave explodes outward in both directions — consuming the tube in microseconds.
- **0:38–0:45:** Post-DDT: the detonation wave propagates at full CJ speed (2840 m/s). The transition point marked with a gold marker on a distance-time diagram in the corner. The run-up distance to DDT shown: L_DDT ≈ 50 tube diameters for stoichiometric H₂-O₂.

## Physics Concept Teased
DDT (Deflagration to Detonation Transition) is the spontaneous transition from a subsonic flame to a supersonic detonation. It occurs through a sequence: flame-acoustic coupling → turbulence → precursor shock formation → auto-ignition hot spot between shock and flame → SWACER-amplified detonation kernel. The run-up distance depends on mixture sensitivity, tube confinement, and turbulence. It is the key safety concern in hydrogen combustion and explosives handling.

## On-Screen Text / Captions
- **0:00:** "A gentle flame. Then — detonation. In one millisecond."
- **0:08:** "Deflagration: slow, subsonic, manageable"
- **0:15:** "Flame-acoustic coupling → acceleration"
- **0:22:** "Turbulence wrinkles the flame → area → speed"
- **0:30:** "SWACER: hot spot ignites between shock and flame"
- **0:38:** "Detonation achieves CJ speed: 2840 m/s"
- **0:44:** "This is why hydrogen requires such careful handling."

## End Card
Final 3 seconds: the distance-time (x-t) diagram showing the kink where DDT occurs — the straight detonation line shooting from the transition point. Text: "One millisecond to change everything." Channel logo.

## Audio
Slow crackling fire sound for the deflagration phase. Building tension: low frequency rumble as shock pressure rises. CRACK of DDT (0:28) — the sharpest possible transient sound effect. Then a sustained, lower-pitched roar of the detonation wave. Voiceover (tense, building): "The flame doesn't know it's about to become a detonation. Until it does."

## Production Notes
Code complexity: complex. Renderer: WebGL. Key algorithm: 1D adaptive reactive Euler equations with dual-step chemistry (induction + exothermic reaction). Turbulence modeled via LES sub-grid diffusion increase near obstacles. Obstacles implemented as solid boundary conditions with slip walls at rings. SWACER hot spot: local temperature spike (1.1×T_induction) applied at one obstacle site at t=0.7 ms (or allow it to emerge naturally from instability). DDT detection: monitor local Mach number > 1.5 of flame speed. x-t diagram: record flame position and shock position each timestep, plot in an inset panel. Gotcha: DDT is notoriously sensitive to grid resolution — use adaptive mesh refinement (AMR) near the flame and shock. Without high resolution, DDT may not occur in simulation.
