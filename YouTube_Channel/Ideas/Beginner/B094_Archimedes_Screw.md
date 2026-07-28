---
title: "Lifting Water With a Rotating Helix (Archimedes' Screw)"
id: B094
difficulty: 2/10
prereq: "B058_Simple_Machines"
concept: "Helical inclined plane; each rotation lifts one water pocket by pitch height p; flow rate Q = n·V_pocket per revolution"
tags: [fluids, archimedes-screw, helix, inclined-plane, irrigation, mechanical-advantage, canvas, beginner]
category: beginner
type: video-idea
---

# Lifting Water With a Rotating Helix (Archimedes' Screw)

**Alt title:** "A 2,200-Year-Old Machine That Still Irrigates Cities Today"
**Difficulty:** 2/10 | **Prereq:** B058_Simple_Machines

---

## Opening Hook (0:00–1:00)

The screen opens on a 45-degree tilted cylinder rendered in warm wood texture. Inside it, a silver helical screw turns slowly. At the bottom, blue water particles trickle in; as the screw rotates, the particles are trapped in the helical grooves and lifted steadily upward, pouring out the top into a raised channel. It looks almost magical — a machine with no pump, no motor visible, just a rotating corkscrew that effortlessly defies gravity. The host zooms in to show a single water pocket — a blue blob trapped between two turns of the helix — climbing steadily upward with each rotation. "This device is called the Archimedes' screw. According to ancient texts, Archimedes designed it around 250 BC to drain the bilges of a massive ship built for King Hiero II of Syracuse. Today, the exact same machine is used in the Netherlands to lift millions of cubic meters of water out of polders every year, in wastewater treatment plants across the world, and in fish ladders at hydroelectric dams. And it works by being nothing more than an inclined plane — wrapped into a helix."

## The Naive Attempt

The viewer starts with a canvas rendered with a diagonal rectangle representing the screw casing, tilted 30 degrees from horizontal. Step one: model the helix as a series of diagonal lines (seen from the side in 2D, the helix looks like a stack of diagonal parallelograms). Step two: seed the bottom of the screw with small blue circles representing water. Step three: when the screw "rotates" (triggered by a rotation angle variable incrementing each frame), move the water particles upward along the casing at a rate proportional to the rotation speed. The viewer attaches each particle to the nearest helix blade and advances it by `pitch × (dAngle / 2π)` pixels per frame, where pitch is the spacing between blades measured along the axis. This looks reasonable on screen — particles climb steadily. Step four: compute the flow rate as particles exiting the top per second, display it as a number. The host says: "Now let's check whether our flow rate formula is right — because there's a subtle geometry we've skipped."

## The Moment of Failure

At 30 RPM with a pitch of 50 pixels and three water pockets active, the simulation reports a flow rate of "450 particle-pixels per second," which sounds plausible. But the host switches the tilt angle from 30° to 10° — a much shallower angle — and the flow rate in the simulation stays exactly the same. The water still climbs the same amount per revolution. Physically, this cannot be right: at very shallow angles, the water pocket is nearly horizontal, and the water will simply slosh backward if the helix pitch is not steep enough. There is also no accounting for the fact that each water pocket has a fixed volume determined by the geometry of the helix, the pipe radius, and the tilt angle — and at steep tilts above a critical angle, the pockets drain backward under gravity and the screw fails entirely. The simulation is completely insensitive to tilt angle, which means its underlying model is wrong.

## Why It Broke — The Physics

The Archimedes' screw is an inclined plane wrapped into a helix. The key geometric relationship is that the lower water surface inside each helical trough must be tilted such that it remains horizontal (because gravity makes water find its own level). The effective lift per revolution is the **pitch** p — the axial distance between successive turns — multiplied by the cosine of the screw's inclination angle θ. The volume of water per pocket is:

**V_pocket = (π/4)(D² − d²) · p · sin(θ) · fill_fraction**

where D is the outer diameter, d is the inner shaft diameter, and fill_fraction is typically 0.3–0.5 for a well-designed screw. The flow rate for n pockets and N revolutions per second is:

**Q = n · V_pocket · N**

Critically, if the inclination angle θ exceeds the "self-draining angle" (typically around 26–30° for a standard pitch ratio), the pockets cannot form properly because water runs backward down the trough faster than the screw advances it. Ancient Egyptian screws were typically inclined at 20–25° for exactly this reason.

## The One Concept

The Archimedes' screw lifts fluid by trapping it in sealed helical "pockets" between adjacent blade turns and rotating those pockets upward along the inclined axis. Each pocket acts like a small bucket on a conveyor belt — the water is physically moved rather than pushed by pressure. This is why the screw is so robust: it works equally well with debris-laden water, sand, gravel, grain, or even fish (which is why fish ladders sometimes use Archimedes' screws — the fish simply ride the pocket up without being harmed). The mechanical advantage comes from the helix acting as an inclined plane: the torque applied to the screw shaft (work input) equals the weight of water times the vertical lift (work output), minus friction losses in the bearing and water-wall contact. Efficiency in real screws ranges from 60% to 80%. The screw's self-priming nature — it needs no external pump to start — made it invaluable in the ancient world. The Romans used bronze Archimedes' screws in silver mines in Spain (confirmed by archaeological excavations at Rio Tinto). Modern uses include the Archimedes screw turbine (run in reverse: water flows down, shaft generates electricity), used in low-head hydroelectric sites in Europe. A 3-meter-diameter screw in the Netherlands can lift 20 cubic meters of water per second.

## The Fix

Add tilt-angle awareness to the pocket model. Compute the critical angle and warn the user when exceeded. Scale pocket volume with the correct geometric formula.

```javascript
const theta = tiltAngle * Math.PI / 180; // degrees to radians
const D = outerDiameter; // pixels
const d = innerDiameter;
const p = pitch;        // axial pitch in pixels

// Pocket volume (scaled to simulation units)
const V_pocket = (Math.PI / 4) * (D * D - d * d) * p * Math.sin(theta) * 0.35;

// Critical angle check
const criticalAngle = Math.atan(pitch / (Math.PI * D)); // for standard screw
if (theta > criticalAngle) {
  displayWarning("Angle too steep — pockets will drain!");
}

// Flow rate
const Q = numPockets * V_pocket * (rpm / 60); // volume per second
```

Particles are now pinned to pocket positions that shift upward by `p × cos(theta) / (2π)` of axial distance per radian of rotation. The simulation now correctly shows faster flow at optimal tilt (~22°) and total failure at steep angles above 30°.

## The Wow Moment — Push It

The host extends the simulation to a "reverse Archimedes turbine" mode: water is poured in from the top, flows down through the screw, and the shaft is connected to a generator icon that lights up a bulb. The torque on the shaft is computed from the weight of water in the active pockets. The host then builds a three-screws-in-series setup — three consecutive Archimedes' screws on the same incline — and demonstrates how total lift height multiplies linearly while flow rate is maintained. Finally, the host enables a "fish counter" mode where cartoon fish enter the bottom with the water and safely exit at the top, illustrating why fish-friendly pumping in ecological contexts relies on this ancient design.

## The Interactive Demo

- **Tilt angle slider** (5° to 40°): shows the flow rate peak around 22° and a sharp dropoff above the critical angle, with a red warning indicator
- **RPM slider** (5 to 120 RPM): linearly scales flow rate, with a power consumption display updated in real time using P = τ × ω
- **Number of blade turns slider** (1 to 5): changes how many pockets are active simultaneously
- **Outer/inner diameter ratio slider** (1.2 to 3.0): changes the pocket cross-sectional area and thus volume per pocket
- **Fluid density dropdown** (water, olive oil, grain, sand): changes the effective density and thus the torque required, with grain and sand having fill fractions displayed

## Production Notes

Render the screw in a pleasing 2D side-view isometric style — the helix visible as alternating dark and light diagonal bands in the cylinder. Use a smooth sinusoidal animation for the rotating helix blades. Water pockets should be clearly bounded blue regions that you can track individually. Display numerical readouts for: current flow rate (L/s), lift height (m), theoretical power input (W), and efficiency (%). Show the inclined-plane analogy explicitly — pause the animation and draw a dotted straight inclined plane alongside the helix, labeling the pitch as the "rise per revolution."

## Tags

`fluids` `archimedes-screw` `helix` `inclined-plane` `irrigation` `mechanical-advantage` `canvas` `beginner`

## Thumbnail

An isometric-style view of a tilted Archimedes' screw rendered with a transparent casing, showing the blue water pockets climbing upward inside the silver helix. At the top, a satisfying stream of water pours out into a raised channel. Text overlay: "2,200 YEARS OLD. STILL THE BEST PUMP." in large white letters. The spiral geometry is the visual hook — it looks like a mechanical spring lifting water against gravity, which is inherently fascinating and slightly surreal.
