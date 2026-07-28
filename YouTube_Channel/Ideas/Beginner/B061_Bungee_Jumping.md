---
title: "Bungee Jumping Physics: How Far Does It Stretch?"
id: B061
difficulty: 2.5/10
prereq: "B059_Work_Energy"
concept: "Energy conservation: gravitational PE lost = elastic PE stored at maximum stretch; ½k(x-L₀)² = mg(L₀+x); solving gives maximum extension, which is well below the ground (hopefully)."
tags: [mechanics, energy-conservation, elastic-potential, spring, bungee, gravity, canvas, beginner]
category: beginner
type: video-idea
---

# Bungee Jumping Physics: How Far Does It Stretch?

**Alt title:** "How Close Do You Actually Get to the Ground?"
**Difficulty:** 2.5/10 | **Prereq:** B059_Work_Energy

---

## Opening Hook (0:00–1:00)

The screen opens on a first-person view from the edge of a tall bridge, 60 metres above a river. A stick figure jumper stands at the precipice. The host asks: "They've attached a 20-metre bungee cord rated for your body weight. Are you going to hit the water?" The viewer sees the figure leap, free-fall for 20 metres in complete silence, then the cord goes taut and the figure slows — but keeps moving downward. The simulation shows the figure stopping with exactly 2 centimetres to spare above the water surface. The host lets that number sink in. "Two centimetres. That's the margin. And it's not luck — it's energy conservation. We can calculate it exactly before anyone jumps." The counterintuitive reveal is that the jumper travels significantly farther than the natural length of the cord: the cord starts at 20 m, yet the person descends a total of nearly 50 m. Most viewers assume the person stops when the cord is fully stretched — they don't account for the cord continuing to stretch elastically well past its natural length.

## The Naive Attempt

The viewer opens a blank HTML Canvas file. The host walks through drawing the bridge as a brown rectangle at the top of the canvas and attaching a small circle (the jumper) to it with a vertical line representing the cord. The first pass at physics is purely kinematic: the host writes a simple update loop that applies `vy += g * dt` every frame and moves the jumper downward. The code uses `jumperY += vy * dt`, with gravity set to 9.8 m/s². The host also draws a dashed green line at the canvas height minus a safety margin, labelled "ground / water surface." The viewer watches the figure fall smoothly. Then the host adds a conditional: once the jumper's position exceeds the cord's natural length below the bridge (`jumperY > L0`), apply a spring force upward: `Fy = -k * (jumperY - L0)`. The total acceleration becomes `a = g - k*(jumperY-L0)/m`. This looks reasonable. The viewer runs it and sees the jumper fall, slow down, and eventually oscillate. The host declares victory — prematurely.

## The Moment of Failure

The host plugs in numbers that make the setup dangerous: a very long natural cord relative to the bridge height, or a very low spring constant. With these values, the analytic result says the jumper should hit the ground — but the simulation shows them stopping safely well above water. The bug is that the energy in the simulation is not quite conserved due to naive Euler integration: at each step, gravity keeps accelerating the jumper while the spring is only applied after the threshold is crossed, creating a small but cumulative energy injection. Over time, the jumper bounces higher and higher instead of settling, and the maximum extension on the first bounce is slightly underestimated. On screen the viewer can actually see the jumper's peak position creeping upward with each bounce, which is physically wrong — a real bungee cord loses energy to heat. The host zooms in on an energy-versus-time plot drawn in the bottom panel of the canvas: the total mechanical energy visibly increases each frame instead of remaining constant.

## Why It Broke — The Physics

The issue is twofold. First, Euler integration does not conserve energy in oscillatory systems — it always adds a tiny sliver of energy each step, so the amplitude grows without bound. Second, and more importantly for this video, the host reveals that the first-bounce maximum extension can be found exactly from energy conservation without integrating anything. The key equation is:

**½k(x)² = mg(L₀ + x)**

where x is the extension of the cord beyond its natural length L₀, m is the jumper's mass, g is gravitational acceleration, and k is the spring constant. The left side is the elastic potential energy stored in the cord; the right side is the gravitational potential energy lost as the jumper falls from the bridge to the lowest point (a total distance of L₀ + x). This is a quadratic in x: kx² − 2mgx − 2mgL₀ = 0, which has an analytic solution.

## The One Concept

Energy conservation is the principle that in a closed system with no dissipation, the total mechanical energy — kinetic plus all forms of potential — remains constant. At the moment of the jump, the system has zero kinetic energy and we set gravitational potential energy to zero at the bridge level. At the lowest point, the jumper momentarily has zero velocity again (zero kinetic energy), so all the energy must be in the cord's elastic potential energy, offset by the gravitational potential energy released. Gravitational PE lost equals mg times the total distance fallen, which is L₀ plus the cord's extension x. Elastic PE gained is ½kx² (Hooke's law for a spring). Setting these equal and solving the resulting quadratic gives: x = (mg + √(m²g² + 2kmgL₀)) / k. Only the positive root is physical. Real-world examples of this energy balance appear everywhere: a pole vaulter converts kinetic energy into elastic energy in the pole and then into gravitational potential energy at height; a bouncing rubber ball converts gravitational PE to elastic deformation energy and back. The crucial insight is that you never need to know the velocity at any intermediate point — you only need to know the energies at the two still moments.

## The Fix

The host replaces the live simulation's role for finding maximum extension with the closed-form analytic solution. A function `maxExtension(m, g, k, L0)` computes the discriminant, takes the positive root, and returns x. The canvas now draws two markers: the natural cord-end position (bridge + L0 from the top) and the maximum extension position (bridge + L0 + x from the top), coloured green and red respectively. The live simulation still runs for animation, but the host switches it to Verlet integration — `yNew = y + (y - yOld) + a*dt*dt` — which conserves energy far better than Euler. With Verlet, the maximum extension in the simulation now matches the analytic value to within one pixel, and the energy-versus-time plot is flat.

## The Wow Moment — Push It

The host builds a full interactive bungee setup with a 200-metre canyon. The jumper can be given any mass (50–150 kg), and the cord properties (natural length 10–80 m, spring constant 20–200 N/m) are all sliders. A large red warning banner appears on screen whenever the computed maximum extension exceeds the canyon depth: "DANGER — CORD TOO LONG OR TOO SOFT." The host cranks the mass to 150 kg, sets a very soft cord, and watches the warning flash. Then they find the exact boundary — adjusting k until the jumper stops precisely at the canyon floor — and zoom in at 0.1× speed as the figure grazes the surface. The host also shows multiple jumpers side by side with different masses: because the analytic solution depends on mass, heavier jumpers extend farther, so a single cord is safe for some weights but lethal for others.

## The Interactive Demo

- **Jumper mass (kg):** slider 40–200 kg
- **Cord natural length L₀ (m):** slider 5–60 m
- **Spring constant k (N/m):** slider 10–300 N/m
- **Bridge/platform height (m):** slider 30–200 m
- **Show energy panel toggle:** displays KE, gravitational PE, elastic PE, and total E in real time as stacked bars
- **Pause at lowest point button:** freezes the simulation at maximum extension and annotates the extension distance
- **Danger zone toggle:** overlays a red region from the ground up representing "certain death" zone

## Production Notes

The canvas is split into two panels: left two-thirds shows the bungee animation in a vertical cross-section view, right third shows a real-time energy bar chart. The code editor is visible in a lower-third overlay during the naive attempt section, with the host typing live. Key zoom-in moments: the cord going taut at L₀ (highlighted in orange as tension begins), and the lowest point where the frame freezes and a yellow bracket annotates the extension x alongside the computed safe margin. An animated equation overlay appears during the Physics section: the terms mg(L₀+x) and ½kx² are shown growing and shrinking on opposite sides of an equals sign as the slider values change. Film the Euler-drift bug by running the simulation for 30 seconds and fast-forwarding — the drift is dramatic at 10× speed.

## Tags
`mechanics` `energy-conservation` `elastic-potential` `spring` `bungee` `gravity` `canvas` `beginner`

## Thumbnail

A panicked stick figure frozen at the lowest point of a bungee drop, with a ruler graphic measuring the gap between their feet and a bright blue water surface — the gap reads "7 cm." Bold yellow text at the top: "HOW CLOSE?" and bright red text at the bottom: "We calculated it EXACTLY." Background is a dark canyon with rope visible, slightly motion-blurred from the fall. High contrast, minimal clutter.
