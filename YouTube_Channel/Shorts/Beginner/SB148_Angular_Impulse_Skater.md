---
title: "Figure Skater Spin: Angular Impulse"
id: SB148
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, mechanics, angular-momentum, spin]
---

> **What it is:** A ~45-second simulation short where a top-down figure skater spins slowly with arms extended then pulls them in and instantly quadruples her rotation rate — demonstrating conservation of angular momentum as a reduced moment of inertia demands a proportionally higher angular velocity. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: Figure Skater Spin: Angular Impulse
**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
A top-down view of a figure skater (white figure on dark blue ice). The skater performs one slow push-off with an extended leg — and immediately begins rotating. Arms fully extended, she spins at 1 revolution per second. Then, in one smooth motion, she pulls her arms in — and the spin doubles instantly to 3 rev/s. The acceleration is visually shocking.

## Main Visual Sequence (0:03–0:50)
**0:03** — Side view of skater standing still on ice. Arms extended horizontally (wingspan 1.5 m). Rotational inertia label: "I = 4.0 kg·m²." Angular velocity: ω = 0. Angular momentum L = 0.

**0:10** — Skater pushes off with right foot (angular impulse arrow shown: J = 8 N·m·s applied for 0.2s). Rotation begins at ω₀ = 2.0 rad/s (≈ 0.32 rev/s). Arms still extended. L = I·ω = 4.0 × 2.0 = 8.0 kg·m²/s shown in green.

**0:18** — Top-down view. Skater rotates slowly. Moment of inertia diagram: mass distributed far from axis (arms out = large I). Red circles show arm mass contribution.

**0:27** — Skater pulls arms tight against body (wingspan shrinks from 1.5m to 0.3m). I drops to 1.0 kg·m². Angular momentum L is conserved (no external torque on frictionless ice). New ω = L/I = 8.0/1.0 = 8.0 rad/s (≈ 1.27 rev/s). Live readout shows the spin-up.

**0:35** — Comparison: bar chart updates live. I bar (orange) drops by 75%; ω bar (blue) shoots up 4×; L bar (green) stays constant. Equation: L = I·ω = constant.

**0:43** — Skater extends arms again — instant slow-down. Back to original spin rate. Caption: "Conservation of Angular Momentum." CodedLaws logo.

## Physics Concept Teased
In the absence of external torques, a spinning object conserves angular momentum (L = Iω). When a figure skater pulls her arms in, her moment of inertia decreases and her angular velocity increases proportionally — the same total angular momentum split differently between I and ω.

## On-Screen Text / Captions
- 0:03 → "Arms out: I = 4.0 kg·m², ω = 0"
- 0:10 → "Push gives angular impulse: L = 8.0 kg·m²/s"
- 0:18 → "Mass far from axis = slow spin"
- 0:27 → "Arms in: I → 1.0 kg·m², ω → 8.0 rad/s!"
- 0:35 → "L stays constant. I × ω = same."
- 0:43 → "L = Iω = constant"

## End Card
Final 3 seconds: Split screen — arms out (slow) vs arms in (fast). Text: "Pull in = spin faster. Physics is beautiful." CodedLaws subscribe button.

## Audio
Dramatic orchestral swell that peaks when arms are pulled in at 0:27. Subtle "whoosh" at the moment of spin-up. Voiceover: "She didn't push harder. She just pulled her arms in." Ice skating ambience underneath.

## Production Notes
Code complexity: simple. Renderer: Canvas 2D. Key visual trick: draw skater as a central circle with two arm-lines; animate arm length from max to min over 0.5s; compute ω each frame as L/I where I = I_body + 2·m_arm·r²; rotate the entire figure by integrated angle. Live numeric readouts for I, ω, L. Runtime: real-time. Gotcha: use realistic values (arm mass ≈ 3.5 kg each, r from 0.75m to 0.15m) to get a genuine 4× speed-up.
