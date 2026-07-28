---
title: "Newton's Third Law: Why Every Action Has a Reaction"
id: B072
difficulty: 1.5/10
prereq: "None"
concept: "For every force on object A from object B, there is an equal and opposite force on B from A; these forces act on different objects; they never cancel; center of mass of an isolated system never accelerates"
tags: [mechanics, newtons-laws, action-reaction, force-pairs, momentum, center-of-mass, canvas, beginner]
category: beginner
type: video-idea
---

# Newton's Third Law: Why Every Action Has a Reaction

**Alt title:** "The Law That Explains Rockets, Recoil, and Why You Can't Push a Wall Without It Pushing Back"
**Difficulty:** 1.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

The video opens on two ice skaters facing each other, motionless on an ice rink. One skater pushes the other. Both skaters slide away in opposite directions — even the one who did the pushing. The host freezes the frame and asks: "The one on the right never pushed back. She was just standing there. So why did the pusher move?" Cut to a close-up of a rocket engine firing in slow motion: there is no air, no ground, nothing to push against — yet the rocket accelerates. Cut again to a person pressing their palm flat against a wall, then slowly lifting their feet off the ground: they remain pressed into the wall, held in place by the wall's return force. Each clip is one sentence of narration: "Every force you exert, you receive equally in return. No exceptions. This is Newton's Third Law, and it is the reason rockets work, guns recoil, and fish can swim." The hook ends on the two skaters still sliding apart on a clean white rink — simple, surprising, and clean.

## The Naive Attempt

The viewer creates a canvas simulation with two boxes side by side. Box A is colored blue (mass 10 kg), Box B is colored red (mass 10 kg). A spring-like impulse is applied between them at t=0. The first version only simulates the force on Box B:

```javascript
const massB = 10;
let vB = 0;
const force = 100; // N
const dt = 0.016;  // seconds per frame

function update() {
  vB += (force / massB) * dt;
  // Box A stays still — the beginner assumption
}
```

The host runs the animation: Box B shoots off to the right while Box A sits perfectly still. The viewer has intuitively coded what most beginners assume: you push something, it moves; you, the pusher, stay put. The simulation looks almost right — it matches everyday intuition when you push a heavy wall. The host says: "This is what most people think happens. But physics disagrees, and the ice rink proves it."

## The Moment of Failure

The host introduces a real-world comparison: a gun. He sets `massA = 0.5 kg` (gun) and `massB = 0.01 kg` (bullet), applies a large force, and runs the simulation. Box B (bullet) flies off at enormous speed — correct. Box A (gun) sits still — wrong. In real life, the gun recoils violently. More dramatically, he sets equal masses and applies the push: Box B moves away at 2 m/s; Box A sits at 0 m/s. In the real world the two ice skaters both slide away. The simulation violates conservation of momentum: total momentum before is 0; total momentum after should be 0; but the simulation produces 0 + 10×2 = 20 kg·m/s from nothing. The momentum violation is the clear, measurable failure — a number that should be zero is not zero.

## Why It Broke — The Physics

Newton's Third Law states: if object A exerts a force F on object B, then object B exerts a force −F on object A simultaneously. The forces are equal in magnitude, opposite in direction, and act on different objects. This is why they cannot cancel each other: cancellation requires two forces acting on the same object. Here, one force acts on B (pushing it right) and the reaction force acts on A (pushing it left). Both objects accelerate. The mathematical consequence is conservation of momentum: since the two forces are equal and opposite, the impulses they deliver are equal and opposite, and the total change in momentum of the system is zero. Key equations:

**F_AB = −F_BA**  
**Δp_A + Δp_B = 0**  
**m_A · Δv_A = −m_B · Δv_B**

The center of mass of an isolated system (no external forces) never accelerates. If both objects start at rest, the center of mass stays put even as the objects fly apart.

## The One Concept

Newton's Third Law is a statement about the nature of forces: they always come in pairs. There is no such thing as a lone, unpaired force in the universe. When you push a door, the door pushes back on your hand with the same force. When Earth pulls the Moon downward with gravity, the Moon pulls Earth upward with the exact same gravitational force — Earth actually accelerates slightly toward the Moon with every orbit. When a fish pushes water backward with its tail, the water pushes the fish forward. When exhaust gases are pushed out the back of a rocket nozzle, those gases push the rocket forward with the same force.

The most common misconception is that third-law pairs "cancel." They do not cancel because cancellation applies to forces on the same object. The force Earth exerts on the Moon and the force the Moon exerts on Earth are equal and opposite, but they are on different objects — they produce accelerations in different directions, on different bodies. If you are standing on the ground, the two forces acting on you are: (1) Earth's gravity pulling you down, and (2) the ground's normal force pushing you up. Those two forces are on the same object (you) and they cancel, which is why you don't accelerate. But Earth's gravity on you and your gravity on Earth are a Newton's Third Law pair — they act on different bodies (you and Earth), and Earth accelerates imperceptibly upward toward you every time you jump.

Real-world examples: rocket propulsion (exhaust gases pushed out → rocket pushed forward), swimming (water pushed backward → swimmer pushed forward), car tires (tire pushes road backward → road pushes tire forward), walking (foot pushes floor back → floor pushes foot forward), jet engines, gun recoil, and the expansion of the universe on the scale of photon pressure. A key subtlety: the reaction force always acts on the agent of the original force, not on some third party.

## The Fix

Add an equal and opposite force on Box A:

```javascript
const massA = 10, massB = 10;
let vA = 0, vB = 0;
const force = 100; // N applied from A on B

function update() {
  const F_on_B = force;
  const F_on_A = -force; // Newton's Third Law

  vB += (F_on_B / massB) * dt;
  vA += (F_on_A / massA) * dt;

  // Verify momentum conservation
  const p_total = massA * vA + massB * vB;
  ctx.fillText(`Total momentum: ${p_total.toFixed(4)} kg·m/s`, 10, 30);
}
```

The total momentum display now reads 0.0000 kg·m/s throughout the entire simulation — a satisfying confirmation that the fix is correct.

## The Wow Moment — Push It

The host extends the demo to a rocket simulation with continuous thrust. A rocket shape fires downward-pointing exhaust particles. Each ejected particle has a small mass and high velocity downward; the rocket receives an equal upward impulse each frame. The host then switches to a space scene with multiple objects: a cluster of four boxes all connected by springs that release simultaneously. All four fly apart in different directions. The center of mass dot, drawn in gold, never moves — it stays exactly fixed in space while the four boxes scatter. The host cranks up the particle count to 50 mini-boxes, all released at once from the center, and the center-of-mass dot remains locked in place, visually proving the law even in chaos.

## The Interactive Demo

- **Mass A slider** — 1 to 100 kg (default 10 kg); changes how far Box A recoils
- **Mass B slider** — 1 to 100 kg (default 10 kg); changes how far Box B recoils
- **Force magnitude slider** — 10 to 1000 N; controls push strength
- **Show force arrows checkbox** — draws red arrow on A and blue arrow on B, equal length, opposite directions
- **Show center of mass checkbox** — draws gold dot that stays fixed throughout motion
- **Show momentum readout** — live display of pA, pB, and pA+pB as the simulation runs
- **Rocket mode button** — switches to continuous-thrust rocket with exhaust particle stream

## Production Notes

Open with the pre-recorded ice skater clip, then cut to code editor. When drawing the force arrows in the simulation, zoom in on each arrow label: "F_AB" on the arrow pointing at B, "F_BA" on the arrow pointing at A, both the same length. When the momentum readout is introduced, animate the numbers filling in — let the viewer watch pA decrease as pB increases, with pA+pB locked at zero. For the center-of-mass wow moment, use a slow zoom out so the viewer can see all 50 boxes simultaneously. Add a faint crosshair on the center-of-mass dot so it's clearly visible. Switch to a space background (black with stars) during the rocket demo for visual contrast.

## Tags
`mechanics` `newtons-laws` `action-reaction` `force-pairs` `momentum` `center-of-mass` `canvas` `beginner`

## Thumbnail

Two cartoon figures on a white ice rink: the left figure has an outstretched hand in a "push" pose; the right figure is flying away with motion lines. The surprising detail — the left figure is also flying away in the opposite direction, with identical motion lines. Bold white text in the middle: **"BOTH MOVE."** Red arrows pointing away from center on both sides. Subtext in yellow at the bottom: "Newton's Third Law." Clean, minimal background — pure white ice surface with the two figures as the only visual elements. The double-motion-lines are the stop-scroll hook.
