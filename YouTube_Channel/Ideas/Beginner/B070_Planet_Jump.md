---
title: "How High Could You Jump on Every Planet?"
id: B070
difficulty: 1.5/10
prereq: "None"
concept: "Jump height h = v₀²/2g where v₀ is leg push-off speed (constant for a given person); h ∝ 1/g; on the Moon (g=1.62 m/s²) you jump ~6× higher than on Earth."
tags: [gravity, kinematics, jumping, planets, moon, acceleration, canvas, beginner]
category: beginner
type: video-idea
---

# How High Could You Jump on Every Planet?

**Alt title:** "If You Can Jump 60 cm on Earth, How High on Mars?"
**Difficulty:** 1.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Eight stick figures stand in a row on screen, each on a different planetary surface. Labels below each: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune — plus the Moon and Pluto at the ends. A countdown, and they all jump simultaneously. The Earth figure reaches 60 cm and comes back down in about 0.7 seconds — a normal human jump. The Moon figure is still rising. It climbs to 3.6 metres and hangs at the top for what feels like an eternity before drifting back. The Mars figure reaches 1.6 metres. The Jupiter figure barely clears 23 cm before gravity yanks it back. And Pluto — tiny Pluto at 0.62 m/s² surface gravity — the figure floats upward to 29 metres and disappears off the top of the screen, taking over 9 seconds to return. The host narrates: "Same person. Same legs. Same muscles. Different planets. The only thing that changed is g — and that one variable controls everything about your jump trajectory." A single elegant equation appears: h = v₀²/2g. "That's it. That's the whole video."

## The Naive Attempt

The viewer opens a canvas and draws a ground surface. A stick figure stands on it. The viewer writes the classic kinematic jump: `vy = jumpSpeed`, then each frame `vy -= g * dt`, `y += vy * dt`. When y returns to ground level, the jump is over. The host sets g = 9.8 (Earth), runs the simulation, and measures the peak height — approximately 0.46 m for a jumpSpeed of 3 m/s. "That looks about right for a modest jump." Now the viewer wants to make the figure jump on the Moon. They change g to 1.62 and run again. The figure floats up beautifully and reaches a much higher peak. "It works!" But then the host asks: "What if I want to see all eight planets at once, side by side?" The viewer tries to duplicate the code eight times, but immediately runs into a practical coding problem: the canvas is a fixed height, and on Pluto the jump height is ~29 m while on Jupiter it's only 0.23 m — a 125:1 ratio. With a fixed canvas and fixed pixel-per-metre scale, either the Pluto figure goes off screen or the Jupiter figure barely moves 2 pixels. The naive one-size-fits-all canvas fails completely.

## The Moment of Failure

With a canvas height set to display a 0.5-metre jump at a reasonable scale, the Pluto simulation runs: the stick figure launches off the ground and immediately vanishes off the top of the canvas, never returning. The Pluto jump height is approximately 29.5 metres — 59 times larger than the canvas's displayed range. Meanwhile, Jupiter's figure (0.23 m jump) moves so few pixels that the jump looks like a glitch or rounding error — 3 pixels of movement in a 600-pixel-tall canvas. The multi-planet comparison the viewer wanted is completely broken. Additionally, when the host tries to display the figure at both its lowest and highest points simultaneously across all planets, the y-axis scaling must be planet-specific — there is no single scale that works for all eight. The static canvas approach cannot adapt.

## Why It Broke — The Physics

At the moment of leaving the ground, a jumper has an initial upward velocity v₀ determined by the force and duration of the leg push. On any planet, the legs produce approximately the same v₀ (muscles work the same, the only difference is that the same muscular effort must accelerate the body against different gravitational weights during the crouch-and-push phase — this is a secondary correction; for this beginner video, v₀ is treated as constant). After leaving the ground, the jumper is a projectile with only gravity acting: the height over time is h(t) = v₀t − ½gt². The peak is when the velocity is zero: v₀ − gt = 0, giving t_peak = v₀/g. The maximum height is:

**h_max = v₀²/(2g)**

This is an inverse relationship: doubling g halves the jump height; halving g doubles it. The jump height is completely determined by v₀ and g. For a leg push-off speed of v₀ = 3 m/s: Earth (g=9.8) gives h = 0.46 m; Moon (g=1.62) gives h = 2.78 m; Mars (g=3.72) gives h = 1.21 m; Jupiter (g=24.8) gives h = 0.18 m; Pluto (g=0.62) gives h = 7.26 m.

## The One Concept

The key equation h = v₀²/(2g) encapsulates everything. It is derived directly from energy conservation: the kinetic energy ½mv₀² at takeoff is completely converted to gravitational potential energy mgh at the peak, giving h = v₀²/(2g) — independent of mass. This means a 50-kg child and a 100-kg adult with the same takeoff speed reach exactly the same height on the same planet (a subtle and important result). The proportionality h ∝ 1/g means the jump height scales as the inverse of surface gravity. Surface gravity values: Moon 1.62 m/s² (1/6 Earth), Mars 3.72 m/s² (2/5 Earth), Venus 8.87 m/s² (0.9 Earth), Mercury 3.70 m/s² (0.38 Earth), Jupiter 24.8 m/s² (2.5 Earth), Saturn 10.4 m/s² (1.06 Earth — surprisingly close to Earth!), Uranus 8.87 m/s² (same as Venus), Neptune 11.2 m/s² (1.14 Earth), Pluto 0.62 m/s² (0.063 Earth). The total time in the air is also proportional to 1/g: t_flight = 2v₀/g, which is why jumps on the Moon appear to happen in slow motion — you're in the air 6 times longer. The hang-time (the subjective sensation of floating at the top) is longest on low-gravity bodies because the deceleration rate is slow and the velocity near the peak is small for a longer absolute time.

## The Fix

The host implements a dynamic auto-scaling canvas. Each planet's simulation runs in its own vertical lane. The y-axis for each lane is independently scaled so the maximum jump height fills the lane: `scale_i = laneHeight / h_max_i`. A thin horizontal label at the top of each lane shows the actual peak height in metres. Now all eight figures jump simultaneously and all reach the top of their respective lanes at the same time (because the auto-scale makes them visually identical height, but the labels show the real numbers). The host adds a synchronised time display so viewers can see that the Pluto figure is still rising when the Jupiter figure has already been back on the ground for several real-time seconds.

## The Wow Moment — Push It

The host extends the simulation to all named solar system bodies: the eight planets plus their major moons (Titan, Ganymede, Io, Europa, Callisto, Triton, Charon), the dwarf planets (Ceres, Eris, Makemake, Haumea), and for fun, an asteroid like Bennu (g ≈ 0.00006 m/s² — jump height ~75,000 m, would escape the surface entirely). On Bennu, the stick figure launches upward and never returns — the simulation tracks it drifting away into space with a speed > escape velocity. The host adds an escape velocity check: if v₀ > √(2gR) then the jumper escapes into orbit. For Bennu (R ≈ 250 m), escape velocity is about 0.2 m/s — far below the 3 m/s leg speed. The viewer can explore any body in a dropdown and see the jump unfold with its correct orbital-scale height, including a zoom-out that follows the figure if it escapes.

## The Interactive Demo

- **Takeoff speed v₀ (m/s):** slider 1–10 m/s (represents different athletes or effort levels)
- **Planet/body selector:** dropdown with all 8 planets, Moon, Pluto, Titan, Bennu, Ceres, and "Custom"
- **Custom g (m/s²):** slider 0.01–30 m/s² when Custom is selected
- **Show all planets simultaneously toggle:** opens the multi-lane racing view
- **Real-time mode toggle:** when on, the simulation runs at 1 real second per second (you can see how long the Pluto jump takes); when off, normalised so all jumps fit in 3 seconds
- **Escape velocity indicator:** red warning icon when v₀ > v_escape for the selected body
- **Jump height table:** sortable table of all bodies with their g, h_max, and t_flight values

## Production Notes

The multi-lane racing view is the visual centrepiece of the video: eight (or more) lanes side by side, each with a stick figure bouncing in slow or fast motion, lane labels at top. Use consistent stick-figure character design across all lanes. During the Physics section, freeze one figure at its peak and draw the v=0 point, the KE→PE energy conversion diagram, and the equation h = v₀²/(2g) as a large overlay. For the Bennu demo, the camera should dramatically zoom out as the figure ascends — the planet shrinks to a dot and the figure keeps going. Include a fun fact overlay: "On Bennu, a gentle push from your legs would put you into orbit." Film the all-planets simultaneous jump with a countdown for maximum dramatic effect.

## Tags
`gravity` `kinematics` `jumping` `planets` `moon` `acceleration` `canvas` `beginner`

## Thumbnail

Eight stick figures mid-jump against a space background, each over a small planetary disk (Earth, Moon, Mars, Jupiter, Pluto visible and labelled). The Moon figure is dramatically highest — a large red arrow pointing up to its peak with "3.6 m!" labelled. The Jupiter figure is barely off the ground with "23 cm" labelled. Bold white text at the top: "HOW HIGH CAN YOU JUMP?" Bold yellow text at the bottom: "On every planet." Vivid space backdrop, playful and visually clear.
