---
title: "Daisyworld: Biological Albedo Regulation"
id: SA106
type: youtube-short
duration: "~45 seconds"
feeds_video: "Daisyworld: How Life Regulates a Planet's Temperature"
difficulty: advanced
tags: [physics, simulation, short, advanced, daisyworld, albedo, gaia, self-regulation, climate-feedback]
---

> **What it is:** A ~45-second simulation showing Watson-Lovelock Daisyworld with black and white daisy populations competing, their differential albedos self-regulating planetary temperature against increasing solar luminosity. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Daisyworld: How Life Regulates a Planet's Temperature

# Short: Daisyworld — Biological Albedo Regulation

**Feeds full video:** Daisyworld: How Life Regulates a Planet's Temperature

## Visual Hook (First 3 Seconds)
A planet surface divided between white daisies (gleaming, high albedo) and black daisies (dark, low albedo). The sun brightens above. As luminosity increases, white daisies expand, planet stays cool. Text: **"Life regulates climate — automatically."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Planet surface map (2D grid, 200×200): initial state = 50% bare ground (grey), 25% white daisies, 25% black daisies. Albedo: white daisy αw = 0.75 (bright), black daisy αb = 0.25 (dark), bare αg = 0.5. Solar luminosity L = 0.7 L☉.
- **0:10** — Black daisies warm local environment: heat island simulation shows +5°C around each black patch. They thrive and spread when planet T < 22°C (optimal). White daisies cool local areas: −5°C. Both populations follow logistic growth with temperature-dependent fitness.
- **0:18** — Luminosity ramp: L increases from 0.7 to 1.4 L☉ over animation. Without daisies: planet temperature (grey line) rises linearly from 5°C to 50°C. With daisies (color line): temperature stays locked at **"22.5°C ± 2°C"** from L = 0.8 to L = 1.2.
- **0:27** — Mechanism shown: at L = 0.9, black daisies dominate (70%, shown as dark surface) → low albedo → slight warming → white daisies get competitive advantage → white daisies grow (surface brightens) → temperature drops → equilibrium restored.
- **0:36** — Population dynamics: dual line graph: black daisy fraction (red) and white daisy fraction (white) vs. luminosity. As L increases, black fraction drops from 70% → 5% and white fraction rises from 30% → 75%. Crossover at L = 1.0 labeled.
- **0:44** — Limits of regulation: at L = 1.25 L☉, planet too hot for both daisy species. Both die → bare planet → temperature spikes to 45°C (red flash). Label: **"Regulatory collapse: catastrophic warming."**

## Physics Concept Teased
Daisyworld demonstrates emergent planetary thermostat: two daisy populations with different albedos shift their relative proportions in response to solar forcing, collectively adjusting planetary albedo to buffer temperature — a purely physical-biological feedback requiring no "intent."

## On-Screen Text / Captions
- **0:00** — "Two species of daisies accidentally regulate a planet"
- **0:10** — "Black daisies: warm themselves. White: cool themselves."
- **0:20** — "As the sun brightens, white daisies gain advantage"
- **0:30** — "Together they keep the planet at 22°C for decades"
- **0:38** — "Both die? Temperature spikes 20°C instantly"
- **0:45** — "Gaia hypothesis simulation → full video"

## End Card
Final 3 seconds: planet surface at regulation peak (50% white daisies glowing) with temperature gauge locked at 22°C. **"CodedLaws — Planetary Systems"** text.

## Audio
Warm, pastoral synth melody at 70 BPM. Bright ping when white daisies gain dominance. Alarm chord at regulatory collapse.

## Production Notes
Renderer: Watson-Lovelock Daisyworld model (Python). ODE system: d(αw)/dt = αw·(βw − γ), d(αb)/dt = αb·(βb − γ). Growth rate: β = 1 − 0.003265·(T_opt − T_local)². Albedo-temperature coupling: T_local = T_global + q·(α_global − α_local). Luminosity sweep: L = 0.7 to 1.4 L☉ in 1000 steps. Output 1080×1920, 60 fps.
