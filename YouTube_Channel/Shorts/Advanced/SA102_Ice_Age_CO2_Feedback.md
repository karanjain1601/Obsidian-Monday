---
title: "Ice Age CO2 Feedback: Carbon Cycle Amplification"
id: SA102
type: youtube-short
duration: "~45 seconds"
feeds_video: "Why CO2 Lags Temperature in Ice Cores — And Why It Still Matters"
difficulty: advanced
tags: [physics, simulation, short, advanced, co2, carbon-cycle, ice-age, feedback, paleoclimate]
---

> **What it is:** A ~45-second simulation showing ice-core CO2 and temperature records synchronized to show the orbital forcing, CO2 lag, and carbon cycle amplification that together drive a 4-8 degree glacial-interglacial temperature swing. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Advanced | **Feeds:** Why CO2 Lags Temperature in Ice Cores -- And Why It Still Matters

# Short: Ice Age CO2 Feedback — Carbon Cycle Amplification

**Feeds full video:** Why CO2 Lags Temperature in Ice Cores — And Why It Still Matters

## Visual Hook (First 3 Seconds)
Two vertical ice core records side by side on black: left = temperature anomaly (orange curve, −8°C to 0°C), right = CO₂ (yellow curve, 180 to 280 ppm). Both swing up and down together over 800,000 years. White annotation: **"CO₂ lags temperature by 600–1000 years — but still amplifies it."**

## Main Visual Sequence (0:03–0:50)
- **0:03** — Antarctic ice core composite: 800 kyr record. Temperature (orange, δD proxy) and CO₂ (yellow) plotted on same time axis. 8 glacial-interglacial cycles visible. Peak-to-trough: T = 8°C, CO₂ = 100 ppm (180 → 280 ppm).
- **0:10** — Mechanism 1 (solubility pump): cold glacial ocean (2°C, blue tint) dissolves more CO₂ → ocean absorbs CO₂. Warm interglacial ocean (10°C, orange tint) releases CO₂. Henry's Law slider: **"ΔT = +4°C → ΔCO₂ = +12 ppm"**.
- **0:18** — Mechanism 2 (biological pump): glacial increased upwelling brings nutrients → algae bloom (green patch). Iron fertilization from Patagonian dust (brown arrow) enhances biological drawdown. Label: **"Bio pump: −30 ppm contribution."**
- **0:27** — Mechanism 3 (carbonate compensation): deep ocean pH rises during glaciation (more carbonate, raised lysocline depth from 4000→3400 m). CaCO₃ dissolution reduced → net ocean alkalinity changes. Alkalinity change bar: **"Δalk = +15 μmol/kg"**.
- **0:36** — Feedback loop: initial warming (Milankovitch) → CO₂ rises → more warming → more CO₂. Diagram: 4-node amplification cycle. Gain calculation: without CO₂, ΔT = 5°C; with CO₂, ΔT = 8°C. **"CO₂ amplification: +3°C."**
- **0:44** — Modern comparison: current CO₂ = **"421 ppm"** (dashed red line) vs. ice age range 180–280 ppm (yellow band). Label: **"We've added 140 ppm in 200 years vs. 10 ppm/1000 yrs naturally."**

## Physics Concept Teased
CO₂ amplifies ice age temperature swings by 60%: the primary mechanism is temperature-dependent ocean solubility and iron-fertilized biological pumping, together contributing ~80 ppm of the 100 ppm glacial-interglacial CO₂ swing.

## On-Screen Text / Captions
- **0:00** — "CO2 and ice age temperature: inseparable partners"
- **0:10** — "Cold ocean absorbs more CO2 — Henry's Law"
- **0:20** — "Iron-rich dust fertilizes algae — biological pump"
- **0:30** — "CO2 amplifies the original warming by 60%"
- **0:38** — "Today: 421 ppm — 140 above any ice age peak"
- **0:45** — "Full carbon cycle physics → link in bio"

## End Card
Final 3 seconds: ice core dual record with modern 421 ppm red line far above natural range. **"CodedLaws — Carbon & Climate"** text.

## Audio
Glacial wind ambient, 45 BPM. Deep bass resonance at each interglacial peak. No voiceover.

## Production Notes
Renderer: box model ocean carbon cycle (Python, 3 reservoirs: atmosphere, surface ocean, deep ocean). Henry's Law: KH(T) = K₀·exp(−ΔH/R·(1/T − 1/T₀)). Biological pump as function of nutrient supply and iron availability. Carbonate chemistry: DIC, alkalinity, pH solved via iterative Newton-Raphson. Ice core data: EPICA composite. Output 1080×1920, 60 fps.
