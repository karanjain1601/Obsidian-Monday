---
title: "Why Bullets Don't Go As Far As Physics Class Says"
season: 1
episode: 9
difficulty: 3/10
concept: "Quadratic air drag and terminal velocity"
prereq: "E01 (projectile) + E07 (good integrator to trust results)"
tags: [air-drag, projectile-motion, quadratic-drag, terminal-velocity, ballistics, javascript, drag-coefficient, physics-code]
type: playlist-video
---

## S1·E09 — "Why Bullets Don't Go As Far As Physics Class Says"

- **Alt title:** "Air Is Not Nothing: The Hidden Force That Breaks Textbook Ballistics"
- **Difficulty:** 3/10 · **Prereq:** E01 (projectile) + E07 (good integrator to trust results)
- **Hook:** A cannon ball fired at 45° — the textbook-optimal angle for maximum range. Now enable realistic air drag. The ball falls 40% short. The actual optimal angle drops to ~30°. Textbooks lied.
- **The break (bug):** The textbook range formula `R = v²·sin(2θ)/g` assumes a vacuum. The drag force `F = ½·ρ·Cd·A·v²` grows with the *square* of velocity, meaning fast, small objects lose most of their range. At high velocities, quadratic drag dominates gravity entirely. The "optimal 45°" is wrong as soon as you leave a vacuum.
- **Concept introduced:** Quadratic air drag, drag coefficient Cd, cross-sectional area A, air density ρ, terminal velocity (where drag equals gravity), and why the range formula from physics class requires a vacuum.
- **Push it / wow moment:** A comparison table: golf ball (dimples reduce Cd dramatically) vs. cannonball vs. skydiver vs. ping-pong ball vs. feather. Each has a completely different terminal velocity and optimal launch angle. Visualize all their trajectories side by side. Then sweep the launch angle from 0–90° to find the true optimum for each projectile.
- **Demo:** Sliders for projectile mass, radius, drag coefficient. "Fire" button launches the trajectory. A sweep button that fires all angles simultaneously to show the range envelope. Toggle vacuum vs. air.
- **Tags:** `air-drag` `projectile-motion` `quadratic-drag` `terminal-velocity` `ballistics` `javascript` `drag-coefficient` `physics-code`
- **Thumbnail:** Two arcs from the same cannon — one textbook-perfect parabola reaching far, one dragged-down arc landing well short. Range labels showing the difference.

---
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_1/_Season_1_Overview|Season 1 Overview]]*
