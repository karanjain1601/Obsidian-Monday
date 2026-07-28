---
title: "Flow Speed and Pressure Trade Off (The Venturi Effect)"
id: B093
difficulty: 2/10
prereq: "B009"
concept: "Continuity A₁v₁ = A₂v₂ combined with Bernoulli P + ½ρv² = const; constriction accelerates flow and drops pressure"
tags: [fluids, bernoulli, venturi, continuity, pressure, flow-speed, canvas, beginner]
category: beginner
type: video-idea
---

# Flow Speed and Pressure Trade Off (The Venturi Effect)

**Alt title:** "The Pipe That Steals Its Own Pressure to Go Faster"
**Difficulty:** 2/10 | **Prereq:** B009

---

## Opening Hook (0:00–1:00)

The screen shows a horizontal pipe with a smooth throat section — a wide section on the left, a narrow constriction in the middle, and a wide section again on the right. Blue fluid particles flow steadily from left to right. Above and below the pipe, three vertical manometer tubes rise from the top of the pipe wall, their liquid levels visible: the outer tubes are nearly equal, but the tube in the middle — right at the throat — is dramatically lower, maybe half the height of the others. "The water is flowing faster through the narrow section," the host says, "and yet the pressure there is lower — not higher. This is counterintuitive to most people. Faster flow should mean more force, right? Wrong. And this wrong intuition has caused engineers, pilots, and homeowners to make dangerous mistakes. The Venturi effect is one of the most exploited physical phenomena in engineering, and in this video you will build it from first principles and watch it drain a manometer in real time."

## The Naive Attempt

The viewer creates a canvas with a pipe whose cross-sectional area varies along the x-axis — wide at the ends, narrow at the middle. This is represented as a function `pipeWidth(x)` that returns the local half-height of the pipe. Step one: seed the pipe with blue particle tracers, each assigned an x-velocity initially equal to a base `flowSpeed`. Step two: update each particle's velocity each frame using conservation of mass: `v_new = v_base * (widePipeArea / localArea(x))`, so particles speed up as they enter the throat and slow down as they exit. The animation already looks beautiful — you can see the particles bunch together and accelerate through the narrow section. Step three: add vertical colored bars above each section representing pressure. The host initially codes the pressure bars as proportional to velocity — so higher velocity = taller pressure bar. At this point the middle bar shoots up to indicate "high pressure" at the throat.

## The Moment of Failure

The simulation runs. Particles rush through the throat, moving visibly faster. The pressure bar in the middle is the tallest — higher than the bars in the wide sections on either side. The host pipes in a simulated Venturi meter image from engineering literature, showing exactly the opposite: the manometer tube at the throat is the lowest. The host's simulation is showing the intuitive-but-wrong answer. "We told the pressure bar to track velocity," the host admits, "but that's not what pressure does. Bernoulli says pressure and velocity are in competition, not in concert. We've coded the opposite of reality." The bars need to anti-correlate with velocity, not co-correlate. But why? The code has no physics — it just assumes "more flow = more pressure" without any mathematical justification.

## Why It Broke — The Physics

The incompressible flow energy equation — Bernoulli's equation — states that along a streamline:

**P + ½ρv² + ρgh = constant**

For horizontal flow (h = constant), this simplifies to:

**P₁ + ½ρv₁² = P₂ + ½ρv₂²**

If v₂ > v₁ (the throat is faster), then P₂ < P₁. Pressure and kinetic energy are competitors for the same fixed "budget" of mechanical energy per unit volume. Combined with the continuity equation **A₁v₁ = A₂v₂**, which says mass flux is conserved (fluid doesn't disappear in the pipe), we get a fully determined system. For a pipe whose throat area is half the inlet area, the throat velocity doubles, and the pressure drops by ½ρ(v₂² − v₁²) = ½ρ(3v₁²). For water at v₁ = 1 m/s and a 2:1 area ratio, ΔP ≈ 1500 Pa — easily visible as a 15 cm height difference in a water manometer.

## The One Concept

The Venturi effect is the pressure reduction in a fluid that occurs when the fluid accelerates through a constriction, as a direct consequence of energy conservation. It was first described quantitatively by Giovanni Battista Venturi in 1797 and later formalized by Daniel Bernoulli. The key insight is that the total mechanical energy per unit volume in a flowing fluid — the sum of pressure energy, kinetic energy, and potential energy — remains constant along a streamline in steady, inviscid, incompressible flow. When the pipe narrows, continuity forces the fluid to speed up. The kinetic energy per unit volume rises, so the pressure energy per unit volume must fall to compensate. The Venturi effect is exploited everywhere in engineering. The Venturi meter uses the pressure difference between inlet and throat to infer flow rate: Q = A₁A₂ · sqrt(2ΔP / ρ(A₁²−A₂²)). Carburetors use the Venturi effect to atomize and draw fuel into the airstream without any pump — the low pressure at the throat pulls gasoline from the fuel bowl. Airplane pitot tubes use a modified Venturi geometry to measure airspeed. Aspirators in chemistry labs use a water jet Venturi to create a partial vacuum for filtration. The Venturi principle also explains why rooftop vents on mobile homes can blow out rather than in during high winds: fast wind over the vent opening creates a low-pressure zone that pulls air out of the building.

## The Fix

Replace the naive pressure calculation with the Bernoulli-derived formula. Compute the reference pressure as a constant `P_ref = 101325` Pa (atmospheric). At each x position, compute the local velocity from continuity, then apply Bernoulli to find local pressure.

```javascript
const P_ref = 101325; // Pa
const rho = 1000;     // kg/m³
const v1 = baseFlowSpeed; // m/s at inlet
const A1 = inletArea;

function localPressure(x) {
  const A = pipeArea(x);
  const v = v1 * A1 / A;          // continuity: A1*v1 = A*v
  return P_ref + 0.5 * rho * (v1 * v1 - v * v); // Bernoulli
}
```

Now redraw the pressure bars using `localPressure(x)` — they correctly show the throat bar at minimum. The manometer tubes drop at the constriction exactly as in a real Venturi meter. The host adds a color-coded pressure gradient along the pipe wall itself, transitioning from green (high pressure) at the inlet and outlet to blue (low pressure) at the throat.

## The Wow Moment — Push It

The host introduces a "suction tube" — a vertical branch at the throat that dips into a colored dye reservoir below the pipe. Because pressure at the throat drops below atmospheric, dye gets sucked upward into the flow and colors it, exactly replicating a perfume atomizer or garden sprayer. The host then builds an airfoil cross-section (an asymmetric Venturi) and demonstrates how the upper surface flow is faster than the lower surface flow, producing a net upward pressure difference — lift — using the same Bernoulli framework. Flow lines arc over the wing and the low-pressure zone above the wing is color-coded blue, making the lift mechanism visible and visceral.

## The Interactive Demo

- **Constriction ratio slider** (A₂/A₁ from 0.2 to 0.9): changes the narrowing severity, updating all velocities and pressures in real time; displays numerical values for v₁, v₂, P₁, P₂
- **Base flow speed slider** (0.5 to 5 m/s): scales the entire field proportionally, demonstrating that the pressure difference scales as v²
- **Fluid density dropdown** (water, mercury, oil, air): changes ρ and rescales the manometer column heights for dramatic comparisons
- **Manometer vs. color-map toggle**: switches between the tube-and-liquid visualization and a continuous pressure color gradient painted onto the pipe walls
- **Add tracer button**: drops a colored tracer particle into the stream so the viewer can watch it accelerate through the throat and decelerate as it exits

## Production Notes

Render the pipe as a smooth, curved SVG path to make the constriction visually elegant rather than blocky. The manometer tubes should be physically positioned above the corresponding pipe sections, connected by thin vertical lines. Use a blue-to-red heat-map for the pressure color map — blue at low pressure (throat), red at high pressure (inlet/outlet). During the Bernoulli equation derivation, display the equation prominently and cross out terms that cancel (the ρgh terms) with red strikethroughs as the host explains. Zoom in on the throat during the dye-suction demo to fill the screen.

## Tags

`fluids` `bernoulli` `venturi` `continuity` `pressure` `flow-speed` `canvas` `beginner`

## Thumbnail

A cross-section of a Venturi pipe from a slightly elevated angle, rendered in glowing neon blue on black. Three manometer tubes are visible — the outer two at the same level, the middle one dramatically short (maybe half the height). A bold white arrow points at the low manometer with the label "LOWER PRESSURE HERE — WHY?" in red. The pipe itself has a visible glow of blue-to-teal around the narrow throat to suggest the speed increase. This thumbnail works because it presents a visual paradox that demands resolution.
