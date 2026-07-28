---
title: "Osmosis: Water Moves by Itself Through a Membrane"
id: SB159
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, thermodynamics, osmosis, membrane, biology-physics]
---

> **What it is:** A ~45-second simulation short where blue water visibly climbs higher on the salty side of a U-tube as water molecules slip freely through a semipermeable membrane while ions cannot — showing how the resulting 4.89 atm osmotic pressure can be reversed with applied force to desalinate water. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Osmosis: Water Moves by Itself Through a Membrane
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A U-tube with a semipermeable membrane at its base. Left side: pure blue water. Right side: amber salt solution (labeled "10% NaCl"). Over 3 seconds, blue water visibly climbs up the right side — 5 centimeters higher than the left — driven by an invisible force. The water level difference is striking and counterintuitive.

## Main Visual Sequence (0:03–0:50)
**0:03** — Split rectangular box (600×400px) with a vertical dotted grey membrane in the center (labeled "Semipermeable membrane — water passes, ions do not"). Left side: pure water (bright blue). Right side: 10% NaCl solution (amber). Water levels equal at start.

**0:10** — Molecular animation: blue water molecules (small, fast, random motion) on both sides. Red Na⁺ and Cl⁻ ions (larger dots) on right side only. Membrane shown with tiny pores — water molecules (small) slip through easily; ions (large) cannot.

**0:18** — Net flow animation: more blue water molecules shown crossing from left (pure) to right (salty) per second than from right to left. Reason: concentration of water is higher on pure side (fewer dissolved particles "dilute" the water concentration on the right). Net flux arrow points RIGHT. Water level on right begins rising.

**0:27** — Water level rises 8 cm on right, drops 8 cm on left. Osmotic pressure labeled: "Π = iMRT = (2)(0.1 mol/L)(0.0821)(298K) = 4.89 atm." Van 't Hoff equation shown. The osmotic pressure exactly equals the hydrostatic pressure at equilibrium (water column height).

**0:35** — What if we apply pressure to the right side? Arrow pushes down on right water column. At Π = 4.89 atm applied: net flow reverses — water goes from salty to pure side. "This is Reverse Osmosis — how water is desalinated!"

**0:43** — Real-world examples: red blood cells in salt solution (swell in hypotonic → burst; shrink in hypertonic → crenate). Plant root water uptake. Kidney function. CodedLaws logo.

## Physics Concept Teased
Osmosis is the diffusion of water molecules through a semipermeable membrane from a region of high water concentration (pure water) to low water concentration (salt solution). The osmotic pressure (Π = iMRT) quantifies the pressure required to halt this flow — and reversing it (reverse osmosis) is the basis of water desalination.

## On-Screen Text / Captions
- 0:03 → "Semipermeable membrane: water passes, ions don't"
- 0:10 → "Ions reduce water concentration on right"
- 0:18 → "Net water flow: left → right"
- 0:27 → "Osmotic pressure Π = iMRT = 4.89 atm"
- 0:35 → "Apply pressure → reverse osmosis!"
- 0:43 → "How we purify seawater"

## End Card
Final 3 seconds: U-tube with water level difference labeled "Π = 4.89 atm." Text: "Water always seeks balance." CodedLaws subscribe.

## Audio
Gentle flowing water sounds throughout. Soft "drip" sound each time a water molecule crosses the membrane. At 0:35 (reverse osmosis): mechanical pump humming. No voiceover. Music: calm ambient, 65 BPM.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D. Key visual trick: model water molecules as fast small white dots and ions as larger colored dots; implement membrane crossing probability proportional to local water concentration (fewer crossings from salty side); update water levels based on net flow each frame; display osmotic pressure derived from level difference. Runtime: real-time, time-accelerated. Gotcha: equilibrium is reached when osmotic pressure equals hydrostatic pressure — build in a stopping condition to avoid indefinite flow.
