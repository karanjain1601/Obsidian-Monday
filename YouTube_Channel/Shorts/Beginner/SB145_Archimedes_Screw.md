---
title: "Archimedes Screw: 2,000-Year-Old Water Pump"
id: SB145
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, fluid-mechanics, archimedes, simple-machines]
---

> **What it is:** A ~45-second simulation short where a helical screw tilted at 30° begins rotating and water visibly climbs upward through its coiled pockets, pouring out two meters above the waterline — demonstrating how rotational energy converts into gravitational potential energy with no valves or seals required. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Archimedes Screw: 2,000-Year-Old Water Pump
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A large helical metal screw (silver coils on a gold central shaft) is shown tilted at 30° in a trough of blue water. As it begins rotating, water visibly climbs upward inside the helical channel — defying gravity — and pours out the top end 2 meters above the water line. The motion is mesmerizing.

## Main Visual Sequence (0:03–0:50)
**0:03** — Cross-section view (side angle). Trough is transparent grey; screw shown as a green helix (3 turns visible). Water level at bottom sits at the lowest edge of the first helical pocket. Inclination angle labeled: "θ = 30°."

**0:10** — Screw begins rotating clockwise (from the top perspective). Water is scooped into the first pocket at the bottom. As the screw turns, the pocket of water (blue blob) moves upward along the helix. Second pocket fills at bottom simultaneously.

**0:18** — Time-lapse: 3 complete rotations shown. Three separate water pockets visible climbing in sequence. The lowest pocket reaches the exit at the top and pours out (white splash). Flow rate annotation: "3 liters/revolution."

**0:27** — Physics panel: the inclined screw converts rotational energy to lifting potential energy. PE = mgh = (3kg)(9.8)(2m) = 58.8 J per revolution. Torque and angular velocity labels.

**0:35** — Historical context flash: Ancient Egyptian irrigation image (stylized). Text: "Used since 250 BCE — still used today." Modern application: sewage treatment plant photo (stylized).

**0:43** — Interactivity demo: rotation speed slider animates screw faster; water output rate increases proportionally. Final label: "Simple, reliable, no seals needed." CodedLaws logo.

## Physics Concept Teased
An Archimedes screw converts rotational mechanical energy into gravitational potential energy of water by trapping fluid in helical pockets that travel upward as the screw turns. Because the screw has no valves or seals, it is nearly frictionless and can run for centuries.

## On-Screen Text / Captions
- 0:03 → "Water going UP a spinning screw?"
- 0:10 → "Each pocket carries water upward"
- 0:18 → "3 liters lifted per revolution"
- 0:27 → "PE = mgh — rotational to gravitational energy"
- 0:35 → "Invented 250 BCE. Still in use."
- 0:43 → "No valves. No seals. 2,000 years."

## End Card
Final 3 seconds: Water cascading out of the top of the screw in slow motion (particle shower). Text: "Ancient physics, modern engineering." CodedLaws subscribe button.

## Audio
Light, upbeat Mediterranean folk-inspired instrumental, 100 BPM. No voiceover. Water gurgling sound that becomes more prominent as speed increases. Satisfying "splash" when water exits at top.

## Production Notes
Code complexity: moderate. Renderer: Canvas 2D or WebGL for helix 3D effect. Key visual trick: render the screw as a series of ellipses (top-view of coil cross-sections); animate water packets by incrementing their angular position along the helix each frame. Use sinusoidal y-position from the helix equation to position each water blob. Runtime: real-time. Gotcha: ensure water pockets don't merge — enforce minimum gap between adjacent blobs.
