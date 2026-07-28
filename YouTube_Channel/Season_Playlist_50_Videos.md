# Season Playlist — 50 Videos (Full Detail)

> Full production bible for the [[_MOC_YouTube_Channel|CodedLaws]] channel.
> Each entry contains everything needed to script, code, and produce the video.

---

# SEASON 1 — The Integrator Sessions
**Season thesis:** Every simulation is secretly an integration problem, and the naive approach always breaks first — in ways that are physically meaningful, not random.

---

## S1·E01 — "I Coded a Cannon and Shot My Ball Into Infinity"

- **Alt title:** "The One Line of Code That Breaks Every Physics Beginner's First Simulation"
- **Difficulty:** 1/10 · **Prereq:** None
- **Hook:** A beautiful cannonball arc drawn at 30 FPS. Drop to 10 FPS with no other change — the ball overshoots by 3× the distance and flies off-screen.
- **The break (bug):** Writing `x += velocity` without multiplying by `dt` makes the simulation frame-rate dependent. At lower FPS, each update applies a giant velocity impulse and the ball accelerates toward infinity. The "fix" is a single multiplication: `x += velocity * dt`.
- **Concept introduced:** Euler's method — the simplest forward-integration scheme — and the critical role of `dt` (elapsed time per frame). Every physics update must be scaled by elapsed time, otherwise the simulation is not measuring real-world seconds.
- **Push it / wow moment:** Build a real-time ballistic trajectory predictor that computes and draws the full arc *before* firing. It is perfectly accurate — you can see the landing point before release. Then toggle the `dt` bug back on and watch the prediction shatter.
- **Demo (what viewer plays with):** Sliders for launch angle (0–90°) and muzzle velocity. A toggle labeled "correct dt / broken dt" that makes the ball instantly fly to infinity. Live FPS throttle slider so viewers feel the bug themselves. A second cannon for head-to-head comparison.
- **Tags:** `projectile-motion` `euler-method` `timestep` `physics-simulation` `javascript` `canvas` `game-physics` `beginner`
- **Thumbnail:** A cannon on the left. Two arcs diverge from the barrel — one curves perfectly to a target, the other shoots horizontally off the right edge of the frame. Caption: "SAME CODE. DIFFERENT FPS."

---

## S1·E02 — "My Bouncing Ball Gains Energy. That's Very Bad Physics."

- **Alt title:** "Why Your Ball Bounces Higher Every Time (And the Three-Character Fix)"
- **Difficulty:** 1.5/10 · **Prereq:** E01 (Euler + dt)
- **Hook:** A ball dropped from 100 px that bounces higher every frame. By second 5, it has escaped the screen. The code has no energy source — so where is the energy coming from?
- **The break (bug):** Applying the restitution coefficient to the speed magnitude but forgetting to negate `vy` means the ball bounces upward with the same speed it arrived — then the *next* Euler step adds another gravity impulse on top. The ball enters the floor with speed v, exits with speed e*v (smaller), but the direction flip is missing, so the floor effectively pushes it *faster* each frame. The fix is `vy = -e * vy`.
- **Concept introduced:** Coefficient of restitution `e` — the ratio of post-collision to pre-collision relative speed. `e=1` is perfectly elastic (energy conserved), `e=0` is perfectly inelastic (dead clay). Every real bounce is between 0 and 1. The code must negate the velocity component *perpendicular* to the surface, not just scale its magnitude.
- **Push it / wow moment:** Stack 5 balls with halving masses on top of each other (a "Superball tower"). Drop them together. The top ball launches at ~9× the drop height — an exact physics result derivable in 10 lines. The crowd goes wild every time.
- **Demo:** A ball you can drag to any height and angle. Restitution slider from 0 (thuds and stops) to 1 (bounces forever). Live kinetic energy chart. The 5-ball tower as a bonus scene. Toggle "broken" vs "fixed" code.
- **Tags:** `bouncing-ball` `coefficient-of-restitution` `elastic-collision` `inelastic-collision` `javascript` `canvas` `energy-conservation` `physics-code`
- **Thumbnail:** An energy bar graph showing the bar going UP with each bounce — bright red arrow pointing upward. "THAT'S WRONG" stamped in large text over it.

---

## S1·E03 — "Why My Spring Exploded (Hooke's Law vs. Your Timestep)"

- **Alt title:** "Simple Harmonic Motion Is Not Simple to Code — Here's Why"
- **Difficulty:** 2/10 · **Prereq:** E01 (Euler + dt)
- **Hook:** A spring-mass system that oscillates beautifully for 3 cycles... then the amplitude grows every cycle until the mass flies off screen. No energy was added. The code is correct Hooke's law. So what is happening?
- **The break (bug):** Standard Euler integration of SHM is *unconditionally unstable* — it injects a tiny amount of energy every single timestep because it updates `x` using the *old* velocity and updates `v` using the *old* position. These quantities are coupled; using stale values causes both to overshoot their true values simultaneously, compounding each step. The amplitude grows as `(1 + ω²dt²/2)^n` — slowly at first, then exponentially.
- **Concept introduced:** Symplectic Euler (also called semi-implicit Euler): update velocity *first* using the old position, *then* update position using the *new* velocity. This costs zero extra work but preserves the energy surface of the system. It is the correct integrator for oscillatory systems and is used in most game engines.
- **Push it / wow moment:** Build a 2D spring network — a 6×6 grid of masses connected by springs forming a jiggly square lattice. With standard Euler it explodes immediately. With symplectic Euler it bounces and deforms indefinitely without blowing up. Looks like jello physics.
- **Demo:** Drag the mass to any displacement and release. Live energy plot. A big "EULER" vs "SYMPLECTIC EULER" toggle button that makes the explosion happen or not. The jello square as the finale.
- **Tags:** `spring-simulation` `simple-harmonic-motion` `hookes-law` `symplectic-euler` `javascript` `energy-conservation` `oscillation` `numerical-stability`
- **Thumbnail:** Split screen — left panel shows a spring with oscillation amplitude growing each frame (red arrows getting bigger); right panel shows perfectly constant amplitude. Single label: "ONE CHANGE."

---

## S1·E04 — "My Pendulum Lies to Me at Large Angles (And So Did My Textbook)"

- **Alt title:** "sin(θ) ≠ θ: The Physics Approximation Hidden in Every Intro Course"
- **Difficulty:** 2.5/10 · **Prereq:** E03 (SHM + symplectic Euler)
- **Hook:** Two pendulums — one coded with the exact nonlinear equation, one with the standard textbook small-angle formula — swinging together from 5°. They match perfectly. Release them from 60°. They diverge more with every swing until they are completely out of phase.
- **The break (bug):** The textbook equation `θ'' = -(g/L)·θ` uses the linear approximation `sin(θ) ≈ θ`, valid only below ~15°. At 60°, `sin(60°) ≈ 0.866` while `60° in radians ≈ 1.047` — a 21% error per cycle that accumulates. The period of the exact pendulum is *longer* than the approximate one at large angles, so they slowly drift apart.
- **Concept introduced:** The exact nonlinear pendulum equation `θ'' = -(g/L)·sin(θ)` and the domain of validity of linearization. When you drop `sin`, you are assuming the restoring force is proportional to angle — this is only true for small displacements. The nonlinear term makes the period angle-dependent, which the linear approximation cannot capture.
- **Push it / wow moment:** Overlay 20 pendulums released from 5° increments (5°, 10°, ..., 100°). Watch them fan out into a beautiful diverging spread. The ones released from small angles cluster together tightly; the large-angle ones lag behind by seconds. This makes the angle-dependent period *viscerally visible*.
- **Demo:** Drag pendulum to any angle. Exact (blue) vs approximate (red) traces overlaid live. A period timer measuring both in real time. Zoom into the divergence when they're 180° out of phase.
- **Tags:** `pendulum-simulation` `nonlinear-pendulum` `small-angle-approximation` `javascript` `SHM` `period-of-pendulum` `physics-visualization` `taylor-series`
- **Thumbnail:** Two pendulums — one exact, one approximate — clearly pointing in opposite directions after several swings. Caption: "WHICH IS RIGHT?"

---

## S1·E05 — "I Shook This Spring Until It Tore Itself Apart (Resonance, Coded)"

- **Alt title:** "How to Destroy Any Structure With the Exact Right Frequency"
- **Difficulty:** 3/10 · **Prereq:** E03, E04 (oscillator physics)
- **Hook:** A spring being driven at low frequency — barely moves. Increase the driving frequency by 0.1 Hz toward the natural frequency — amplitude doubles every few seconds and within 30 seconds the spring is oscillating violently.
- **The break (bug):** Driving at resonance (ω_drive = ω_0) with zero damping causes amplitude to grow *without bound* — the simulation overflows a float. This is not a bug; it is the correct physical behavior. The "bug" version is what you build first: driving at the wrong frequency and wondering why nothing happens, then spending 10 minutes searching for the resonant frequency. The discovery is the hook.
- **Concept introduced:** Driven harmonic oscillator, the resonance condition (ω_drive = ω_0), damping coefficient b, quality factor Q = ω_0·m/b (how sharp the resonance peak is), and the Tacoma Narrows bridge collapse as a real-world consequence.
- **Push it / wow moment:** A "bridge mode" — a rectangular slab represented as a 2D spring network. Wind is modeled as a sinusoidal forcing. Sliders let you adjust wind frequency. Find the resonant frequency and watch the bridge oscillate with growing amplitude until springs break. Live frequency-response (Bode) plot shows the resonance peak sharpening as damping decreases.
- **Demo:** Drive frequency slider and damping coefficient slider. Real-time amplitude vs. time plot. Real-time frequency-response spectrum. The bridge destruction sequence.
- **Tags:** `resonance-simulation` `driven-harmonic-oscillator` `damping` `Tacoma-Narrows` `javascript` `frequency-response` `Q-factor` `mechanical-resonance`
- **Thumbnail:** An amplitude bar going vertical with "RESONANCE" label. A blurry bridge visible in the background.

---

## S1·E06 — "I Coded Gravity and My Planet Crashed Into the Sun" *(Flagship Thesis Video)*

- **Alt title:** "Why Every Beginner's Orbit Slowly Dies (Euler's Fatal Flaw)"
- **Difficulty:** 3.5/10 · **Prereq:** E01 (Euler), E05 (why energy conservation matters)
- **Hook:** A perfectly circular orbit that, over simulated months, slowly tightens into a spiral and smashes into the star. The code has no friction. No air resistance. No external forces. The planet is losing energy from nothing.
- **The break (bug):** Euler integration applied to orbital mechanics is *not energy-conserving*. Each Euler step slightly overshoots the true trajectory, injecting or removing a tiny amount of energy. Over many orbits these errors accumulate; the orbit either spirals inward (if energy is lost) or outward (if energy is gained), depending on the direction of the error. This is not a coding mistake — it is a fundamental property of non-symplectic integrators.
- **Concept introduced:** Numerical energy conservation. Symplectic integrators (leapfrog / Störmer-Verlet) operate differently: they advance position and velocity at *offset half-steps* so the errors cancel. While not perfectly energy-conserving, they conserve a *modified Hamiltonian* that stays bounded forever, giving orbits that never spiral. This is why all professional orbital mechanics codes use symplectic integrators.
- **Push it / wow moment:** Stable two-body orbit → add a third body (three-body problem) and watch deterministic chaos begin. Then swap to a mini solar system — Earth, Mars, Jupiter. The Verlet orbits are rock-stable; the Euler orbits slowly corrupt.
- **Demo:** Drag planet to set initial velocity; side-by-side Euler (red, decaying) vs Verlet (green, stable) orbits. Live energy plot — Euler drifts linearly downward; Verlet stays flat.
- **Tags:** `orbital-mechanics` `euler-method` `Verlet-integration` `gravity-simulation` `javascript` `energy-conservation` `symplectic-integrator` `orbit-simulation`
- **Thumbnail:** A glowing orbit spiraling into a star. Giant red "WHY?" overlaid. This is the thumbnail that defines the channel.

---

## S1·E07 — "Four Ways to Simulate Physics. Three of Them Are Secretly Wrong."

- **Alt title:** "The Integrator Showdown: RK4 vs. Verlet vs. Euler (Only One Wins Every Time)"
- **Difficulty:** 4/10 · **Prereq:** E06 (orbital energy drift as motivation)
- **Hook:** Four identical pendulums initialized to the same angle, using four different integrators. After 2 minutes, they are pointing in four different directions. Which one is right?
- **The break (bug):** Each integrator has a different failure mode: Euler (1st order) gains energy, making orbits expand; implicit Euler (1st order) loses energy, making orbits contract; symplectic Euler conserves energy perfectly but accumulates phase error; RK4 (4th order) is accurate to machine precision but requires 4 force evaluations per step — 4× the cost. None is "correct" in all situations; the right choice depends on the physics.
- **Concept introduced:** Order of accuracy (how fast error shrinks as dt decreases), convergence rate, and the key insight: for Hamiltonian systems (orbits, oscillators), *symplectic* structure matters more than order. For general systems (drag, dissipation), RK4 is usually best. This is why the choice of integrator is an architectural decision in any physics engine.
- **Push it / wow moment:** A "shootout" mode — all four integrators try to hit the same ballistic target 1000 m away. Plot error versus compute time on a log-log scale. RK4 is orders of magnitude more accurate per unit of compute for smooth trajectories; but for a long orbit, Verlet beats it because RK4 still drifts energy slowly.
- **Demo:** Timestep slider from coarse to fine. Live global error (vs. high-precision reference) for each integrator. Toggle each on/off. The orbital energy plot from E06 updated to show all four.
- **Tags:** `RK4` `Verlet` `euler-method` `numerical-integration` `integrator-comparison` `physics-engine` `javascript` `ODE-solver` `computational-physics`
- **Thumbnail:** Four identical pendulums at t=0 all together; at t=120s all pointing in different directions. "WHICH IS CORRECT?" with one highlighted in gold.

---

## S1·E08 — "I Added ONE More Pendulum Rod and It Became Impossible to Predict"

- **Alt title:** "The Double Pendulum: A Tutorial in Losing Control of Your Own Simulation"
- **Difficulty:** 4.5/10 · **Prereq:** E07 (RK4 — needed because you need a good integrator to trust the result)
- **Hook:** Two double pendulums initialized 0.0001 degrees apart — literally indistinguishable for 8 seconds — then suddenly forking into completely different trajectories with no shared pattern.
- **The break (bug):** This time there is no bug to fix. Any integration error, however tiny, gets amplified exponentially (Lyapunov exponent λ > 0). You cannot usefully predict the trajectory past the Lyapunov horizon regardless of integrator accuracy. Switching from RK4 with dt=0.01 to dt=0.001 doubles your prediction window — it doesn't save you. This is the lesson: sometimes physics itself limits predictability, not your code.
- **Concept introduced:** Deterministic chaos — a system with perfectly deterministic equations that is practically unpredictable due to exponential sensitivity to initial conditions. The Lyapunov exponent λ measures the rate of divergence. The Lyapunov time 1/λ is how long you can trust any simulation.
- **Push it / wow moment:** Fire 500 double pendulums simultaneously, each displaced from the last by 0.0001°. Color each trajectory by its divergence time from the first. The screen fills with chaotic art — hundreds of glowing colored trails weaving into abstract patterns. The viewer can save this as generative art.
- **Demo:** Click to spawn double pendulums with tiny angle offsets. Color mode: trace trajectories. Slow-motion button. Export the art as a PNG.
- **Tags:** `double-pendulum` `chaos-theory` `Lyapunov-exponent` `deterministic-chaos` `javascript` `physics-art` `sensitive-dependence` `nonlinear-dynamics`
- **Thumbnail:** Hundreds of glowing pendulum trails, different colors, weaving into fractal-like art against pure black. No text needed.

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

## S1·E10 — "When Springs Share Masses, Something Magical Happens" *(Season 1 Finale)*

- **Alt title:** "Normal Modes: The Hidden Harmony Inside Every Vibrating System"
- **Difficulty:** 5/10 · **Prereq:** E03–E09 (full integrator toolkit + oscillator physics combined)
- **Hook:** Two pendulums connected by a weak spring — both released from the same side. They don't move together. One swings higher; the other dies down. Then the energy fully reverses — the second one goes higher, the first dies. Back and forth, perfectly, as if breathing. Nothing was programmed to do this.
- **The break (bug):** Using a simple Euler integrator for coupled oscillators without careful timestep control causes the two normal modes (symmetric and antisymmetric) to accumulate independent phase errors that create a spurious drift in the beat frequency. Swap to RK4 and the beat period matches the analytic formula exactly.
- **Concept introduced:** Normal modes — any coupled oscillator system has a set of *independent* oscillation patterns (eigenmodes) at specific frequencies (eigenfrequencies). Any motion of the system is a superposition of these modes. The energy-swapping behavior is *beating* between two close normal-mode frequencies.
- **Push it / wow moment:** A 12-body chain of coupled oscillators — pluck one mass in the middle. Watch the energy wave propagate as a discrete pulse, reflect at the ends, and interfere. Show the frequency spectrum of the chain evolving live — you can see individual phonon modes lighting up. Connect this to why crystals have band structures and why guitar strings have harmonics.
- **Demo:** Click any mass in the chain to displace it. A "pure mode" button that excites only the symmetric or only the antisymmetric mode. Live Fourier spectrum showing which modes are active.
- **Tags:** `coupled-oscillators` `normal-modes` `eigenfrequencies` `standing-waves` `javascript` `phonon` `lattice-vibration` `physics-code`
- **Thumbnail:** Two pendulums — one fully swinging while the other is still, then the image reversed — energy bars alternating. Like two lungs breathing.

---

# SEASON 2 — The Many-Body Problem
**Season thesis:** Adding more particles doesn't just give you more physics — it gives you emergent behavior no single particle could predict, and computational costs that scale faster than intuition expects.

---

## S2·E11 — "I Built the Solar System in JavaScript. It Was Already Wrong."

- **Alt title:** "The Solar System Has 8 Planets and 8 Integration Errors"
- **Difficulty:** 4/10 · **Prereq:** E06 (two-body orbit + Verlet)
- **Hook:** A solar system that looks perfect for months of simulated time — until Jupiter's orbit slowly drifts outward, and eventually one of the inner planets gets gravitationally ejected. The code uses Verlet integration and correct gravitational constants.
- **The break (bug):** A single global timestep is correct for outer planets (slow, wide orbits) but far too coarse for inner planets (fast, tight orbits — Mercury completes an orbit every 88 days). Mercury's orbit accumulates integration error ~40× faster than Neptune's. This error slowly contaminates the entire system. The fix is per-body adaptive timesteps, or a hierarchical integrator.
- **Concept introduced:** Multi-timescale dynamics in N-body systems. When bodies orbit at vastly different speeds, a single global timestep forces you to choose between wasting computation on slow bodies or accumulating errors on fast ones. Professional solar system codes (e.g., REBOUND) use individual adaptive timesteps for each body.
- **Push it / wow moment:** Load real planetary data from NASA Horizons (actual masses, positions, velocities). Simulate 100 years of solar system evolution. Check the final positions against the known ephemeris. With naive global timestep, the error grows visible. With per-body timesteps, the simulation matches NASA's data.
- **Demo:** Click to add custom planets with adjustable mass and orbital radius. Real-time orbital period display. Toggle each planet's gravitational influence. Fast-forward 10 simulated years in 5 seconds.
- **Tags:** `N-body-simulation` `solar-system` `planetary-orbits` `javascript` `Verlet-integration` `orbital-mechanics` `adaptive-timestep` `NASA-ephemeris`
- **Thumbnail:** A beautiful solar system with glowing trail orbits — one orbit clearly spiraling away from its lane. "IT'S WRONG" in red.

---

## S2·E12 — "10,000 Stars, One Force: How Galaxies Grow From Code"

- **Alt title:** "I Simulated 10,000 Stars and Got a Galaxy I Didn't Expect"
- **Difficulty:** 5/10 · **Prereq:** E11 (all-pairs N-body)
- **Hook:** 10,000 random stars with random velocities and a small initial spin. Over 2 minutes of simulated time, they collapse, merge, and self-organize into a rotating, arm-bearing galaxy-like structure. Nothing was programmed to make this happen.
- **The break (bug):** Without a gravitational softening parameter ε in the denominator (`F = Gm₁m₂/(r²+ε²)`), two stars at close approach produce an enormous force spike that launches them at escape velocity — shattering the forming galaxy. Every N-body galaxy code in history has this parameter. Setting it too small destroys the simulation; setting it too large prevents real gravitational binding. Finding the right ε is part of the physics.
- **Concept introduced:** Gravitational softening — a regularization technique to handle the 1/r² singularity at small separations. Physically, it approximates treating each particle as an extended mass (Plummer sphere) rather than a point mass. The softening length ε sets the scale below which two bodies interact smoothly rather than singularly.
- **Push it / wow moment:** Simulate two galaxy clusters merging (inspired by the Bullet Cluster). Watch tidal streams stretch between them, the cores pass through each other, and a merged elliptical galaxy settle out. The tidal arms were never programmed — they emerge from 10,000 pairwise gravitational pulls.
- **Demo:** Set initial spin rate and density profile (Plummer, uniform, exponential disk). Control softening ε live. Toggle a second cluster to trigger a merger.
- **Tags:** `galaxy-simulation` `N-body-problem` `star-cluster` `gravitational-softening` `javascript` `WebGL` `self-organization` `emergent-structure` `computational-astrophysics`
- **Thumbnail:** Two glowing spiral galaxy clusters spiraling together, tidal streams forming between them, against pure black.

---

## S2·E13 — "How to Simulate a Galaxy Without Waiting a Million Years"

- **Alt title:** "The Clever Tree That Makes N-Body Simulations 1000× Faster"
- **Difficulty:** 6/10 · **Prereq:** E12 (why you need it — all-pairs is too slow)
- **Hook:** 10,000 particles crawling at 0.5 FPS with naive all-pairs gravity. Flip a switch — Barnes–Hut tree — and it runs at 60 FPS with nearly identical visual output.
- **The break (bug):** All-pairs N-body requires N² force evaluations per frame. At N=10,000, that's 100 million evaluations per frame — intractable in real-time. Every new particle *doubles* the compute time relative to the previous one. The simulation simply cannot scale to anything resembling a real galaxy (10¹¹ stars) with this approach.
- **Concept introduced:** Barnes–Hut quadtree (2D) / octree (3D) approximation. The insight: for a distant cluster of stars, you don't need the force from every individual star — you can approximate the entire cluster as a single "super-particle" at its center of mass. The opening angle θ (typically 0.5–1.0) controls the trade-off: small θ means more accurate (more particles treated individually), large θ means faster (more clusters treated as super-particles). Complexity drops from O(N²) to O(N log N).
- **Push it / wow moment:** 100,000 particles in real-time. Overlay the live quadtree decomposition as glowing grid lines on top of the galaxy — cells visible being subdivided around dense regions and merged in empty space. The viewer sees the algorithm's spatial reasoning as it works.
- **Demo:** Particle count slider up to 100,000. Opening angle θ slider — see quality degrade and FPS rise as θ increases. Toggle quadtree vs. brute force. Live cell count display.
- **Tags:** `Barnes-Hut` `quadtree` `N-body-optimization` `O(n-log-n)` `galaxy-simulation` `javascript` `spatial-data-structures` `computational-physics`
- **Thumbnail:** Quadtree grid cells visible over a glowing galaxy. "1000× FASTER" in bold white text.

---

## S2·E14 — "Why My Physics Engine Lets Fast Balls Phase Through Walls"

- **Alt title:** "Tunneling Isn't Just Quantum: How Speed Breaks Collision Detection"
- **Difficulty:** 5.5/10 · **Prereq:** E02 (bouncing ball — collision response basics)
- **Hook:** A small, fast ball fired at a wall. It passes straight through. Slow the same ball down and it bounces perfectly. Same wall, same code. The collision detection works — but only for slow objects.
- **The break (bug):** Discrete collision detection checks whether two shapes *overlap* at each timestep. A fast ball moves more than its own diameter in a single timestep — it teleports from one side of the wall to the other between checks, and overlap is never detected. This is called "tunneling" and it is a fundamental limitation of discrete detection.
- **Concept introduced:** Broad-phase vs. narrow-phase collision detection, and continuous collision detection (CCD). CCD "sweeps" shapes along their velocity vectors and checks for intersection of the swept volume, catching tunneling. The broad phase (AABB grid or bounding volume hierarchy) quickly culls distant pairs; the narrow phase checks exact geometry. Without CCD, any game's fast-moving objects tunnel through walls.
- **Push it / wow moment:** A 500-ball billiard simulation with zero tunneling at any ball speed. Every ball can be fired as fast as desired. Toggle broad phase off to watch FPS crater as every pair is checked. Toggle CCD off and fire a ball at supersonic speed to watch it clip through the table.
- **Demo:** Click to fire a ball at a wall with adjustable speed. See exactly at which speed tunneling begins (threshold = diameter / dt). Toggle CCD on/off. The 500-ball billiard table as the showcase.
- **Tags:** `collision-detection` `tunneling` `continuous-collision` `AABB` `GJK` `javascript` `physics-engine` `broad-phase` `narrow-phase` `game-physics`
- **Thumbnail:** A ball mid-phase-through a concrete wall, clearly inside the solid material. "HOW?" in enormous text.

---

## S2·E15 — "Newton's Cradle: My Physics Engine Got the Count Wrong"

- **Alt title:** "Why Coding Newton's Cradle Is Harder Than It Looks"
- **Difficulty:** 5.5/10 · **Prereq:** E14 (collision framework) + E02 (restitution)
- **Hook:** A five-ball Newton's cradle. Pull back two balls and release. Three balls rise on the other side. Pull back one ball — wrong number rises again. Something is wrong with the collision math.
- **The break (bug):** Sequential pairwise collision resolution — resolve collision between ball 1 and ball 2, then 2 and 3, then 3 and 4, etc. — distributes momentum incorrectly. Each resolution changes the velocity of involved balls *before* the next collision is resolved, creating cumulative errors. Newton's cradle requires resolving all simultaneous contacts *as a system*, not sequentially. The correct tool is impulse-based constraint resolution (linear complementarity problem formulation).
- **Concept introduced:** Impulse-based rigid body contact resolution. Contacts are expressed as velocity constraints (`v_rel · n ≥ 0` after impulse application). Solving all constraints simultaneously via LCP or iterative projection gives physically correct multi-contact behavior. Sequential resolution is a common approximation that fails for chain contacts.
- **Push it / wow moment:** Cradle with balls of different masses — the output pattern (which balls rise, how many, with what velocity) is completely non-obvious and counterintuitive, but exactly correct. Viewers can predict outcomes and then verify with the simulation.
- **Demo:** Drag any number of balls to any height. Change individual ball masses via sliders. Slow-motion replay. Live energy and momentum meters. Export the collision event as a sequence of screenshots.
- **Tags:** `Newtons-cradle` `impulse-based-physics` `collision-response` `javascript` `constraint-resolution` `momentum-conservation` `rigid-body` `LCP`
- **Thumbnail:** Newton's cradle mid-swing — the wrong number of balls rising on the right side (e.g., 3 up when 2 were pulled). "THAT'S WRONG" label.

---

## S2·E16 — "I Coded Fireworks Physics. My First Attempt Was Confetti."

- **Alt title:** "Why Real Fireworks Are Surprisingly Hard to Simulate"
- **Difficulty:** 4/10 · **Prereq:** E01 (particle updates) + E09 (drag forces)
- **Hook:** A burst of particles that looks like flat, symmetric confetti. One drag coefficient change and one blending mode change later — it looks exactly like a real firework.
- **The break (bug):** Without quadratic drag, firework "star" trails follow symmetric parabolas — they travel just as far downward as upward after the burst. Real fireworks droop dramatically because drag dominates at the high initial velocity, killing horizontal momentum quickly. Also: without additive alpha blending (which makes overlapping particles brighter), the trails look flat instead of glowing.
- **Concept introduced:** Particle systems: emitter objects that spawn particles with randomized initial conditions, per-particle lifetime counters, velocity inheritance, color-over-lifetime gradients, and additive vs. normal canvas blending. The key data structure is a flat typed array (not an array of objects) for GPU-cache-friendly iteration.
- **Push it / wow moment:** 50,000 simultaneous particles. Multicolor cascading bursts (chrysanthemum, peony, willow), glitter effects (slow-falling bright particles), crackle (many tiny short-lived particles). All running at 60 FPS using a single flat Float32Array and canvas2D with careful culling.
- **Demo:** Click to fire a burst at the clicked location. Burst type selector (sphere, star, comet, ring). Color gradient picker. Particle count slider with live FPS display. Export as a GIF or video.
- **Tags:** `particle-system` `fireworks-simulation` `javascript` `canvas` `particle-effects` `additive-blending` `typed-arrays` `game-dev`
- **Thumbnail:** A gorgeous multi-color firework burst against a night sky. "50,000 PARTICLES" counter overlaid in the corner.

---

## S2·E17 — "I Simulated a Flag in the Wind and It Turned Into a Jellyfish"

- **Alt title:** "Cloth Simulation: Why Stiff Springs Are the Enemy of Stable Physics"
- **Difficulty:** 6/10 · **Prereq:** E03 (springs) + E07 (integrators) + E14 (collision)
- **Hook:** A cloth square that waves beautifully in the wind for 3 seconds — then collapses into a vibrating, tangled mess that eventually explodes off-screen.
- **The break (bug):** The cloth is represented as a mass-spring grid. High structural spring constants (needed for cloth that doesn't stretch like rubber) make the system *numerically stiff* — the natural frequency of the springs is so high that any integrator with a practical timestep will overshoot and go unstable. Reducing the spring constant fixes the explosion but makes the cloth stretchy. The real fix: position-based dynamics (PBD), where instead of applying forces you directly project positions to satisfy length constraints.
- **Concept introduced:** Mass-spring cloth, numerical stiffness, and Verlet-based Position-Based Dynamics (PBD). PBD replaces spring forces with direct positional corrections: after each integration step, move particles to satisfy `|p_i - p_j| = rest_length`. This decouples stiffness from timestep and is far more stable. It is the method used in Unreal Engine, Unity, and every AAA game's cloth system.
- **Push it / wow moment:** A 3D flag waving in wind with realistic crease folds and billowing. Tear-able cloth — click to make a hole; it propagates with a satisfying rip. Drop a cloth onto a sphere and watch it drape realistically.
- **Demo:** Toggle wind direction and strength. Stiffness slider. Click to tear cloth. Pin/unpin any corner. Toggle PBD vs. spring force to see the stability difference.
- **Tags:** `cloth-simulation` `mass-spring` `soft-body` `position-based-dynamics` `javascript` `WebGL` `game-physics` `tear-simulation` `numerical-stiffness`
- **Thumbnail:** A beautiful cloth flag mid-tear, a jagged hole appearing through the fabric, trailing threads visible.

---

## S2·E18 — "My Chain Phased Through the Floor (And Taught Me About Constraints)"

- **Alt title:** "The Physics of Rope: Why Strings Are Surprisingly Hard to Get Right"
- **Difficulty:** 6/10 · **Prereq:** E17 (cloth + PBD concept)
- **Hook:** A chain dropped onto the floor that clips through it, coils wrong, and then springs into the air — three separate physics violations in five seconds.
- **The break (bug):** Modeling rope as a series of spring-connected point masses fails because: (1) springs need a very high stiffness constant to resist stretching, making the system numerically stiff; (2) with any practical stiffness, the rope stretches non-physically; (3) the collision with the floor happens between timesteps (tunneling from E14). The fix is Extended Position-Based Dynamics (XPBD): positional constraints applied directly to enforce inextensibility, with a separate collision constraint for the floor.
- **Concept introduced:** XPBD (Extended Position-Based Dynamics) — a generalization of PBD where each constraint has its own compliance (inverse stiffness), allowing stiff constraints (rope inextensibility) and soft constraints (spring) to coexist in the same system with the same timestep. The compliance parameter decouples physical stiffness from numerical timestep.
- **Push it / wow moment:** A grappling hook that swings the camera around procedurally-generated obstacles. A suspension bridge made of chain links that sags correctly under its own weight and bounces when you jump on it. A whip that, if swung correctly, cracks (tip exceeds speed of sound).
- **Demo:** Drag the rope endpoints. Fix one or both ends. Drop heavy objects onto the rope. A "whip mode" where you swing one end.
- **Tags:** `rope-simulation` `chain-physics` `Verlet-constraints` `XPBD` `javascript` `position-based-dynamics` `inextensibility` `game-physics`
- **Thumbnail:** A golden chain falling in a perfect S-curve, beautifully lit against black. Pure visual, no text needed.

---

## S2·E19 — "3 Rules. 10,000 Birds. Nobody Told Them What to Do."

- **Alt title:** "How Emergent Flocking Behavior Breaks Your Intuition About Programming"
- **Difficulty:** 5/10 · **Prereq:** E16 (particle systems) + E13 (spatial hashing)
- **Hook:** 10,000 boids that coalesce into a murmuration-like flock — splitting around a predator, swirling in connected sheets, and reforming — with no global coordinator, no choreography, and only three local rules per agent.
- **The break (bug):** Without spatial hashing, 10,000 boids doing pairwise neighbor searches require N² = 100 million comparisons per frame. FPS drops to zero. The simulation works perfectly with 100 boids, completely breaks with 10,000. Adding a spatial hash grid (divides space into cells; each boid only checks its cell and adjacent cells) reduces neighbor lookup to O(1) average case.
- **Concept introduced:** Emergence — complex collective behavior arising from simple local rules without any global coordination. Craig Reynolds' three boid rules: (1) Separation: steer away from too-close neighbors; (2) Alignment: steer toward the average heading of neighbors; (3) Cohesion: steer toward the average position of neighbors. Spatial hashing as an O(1) neighbor-lookup data structure for uniform grids.
- **Push it / wow moment:** Add a predator boid (larger, chases boids). Watch the flock split and reform around it — an emergent escape behavior nobody programmed. Add a wind field (spatially varying velocity added to each boid's update). Watch the flock flow around wind obstacles.
- **Demo:** Sliders for separation, alignment, and cohesion weights. Click to add/remove predators. Slow-motion mode that shows a single boid's decision: its three force vectors and their weighted sum. Boid count up to 50,000.
- **Tags:** `boids-simulation` `flocking-algorithm` `emergence` `spatial-hashing` `javascript` `murmuration` `Craig-Reynolds` `agent-based-modeling`
- **Thumbnail:** A spectacular murmuration silhouette shaped like a swooping bird, formed by 10,000 glowing dots, against a dusk-orange sky.

---

## S2·E20 — "Sand Is Not a Liquid and Not a Solid. Simulating It Is a Nightmare." *(Season 2 Finale)*

- **Alt title:** "The Physics of a Sandpile: Why Granular Matter Breaks Every Model You Have"
- **Difficulty:** 7/10 · **Prereq:** E14, E15, E17, E18 (combines collision, impulse, constraints from all Season 2)
- **Hook:** A pile of sand that flows like a liquid on a steep slope, compacts like a solid at the base, and maintains an angle of repose — a stable slope angle — that no fluid can hold. What phase of matter is this?
- **The break (bug):** Treating sand grains as elastic spheres (as in E14's collision system) gives fluid-like behavior with no angle of repose. The grains keep rolling. Real sand grains are rough, angularly irregular objects that lock via Coulomb friction — they resist tangential sliding forces up to μ × normal force. Adding inter-grain friction (tangential impulse limited by friction cone) creates the angle of repose.
- **Concept introduced:** Granular matter — a state of matter distinct from solid, liquid, and gas. Coulomb friction between grains (tangential force ≤ μ × normal force), the angle of repose (arctan(μ) ≈ 30–45° for most sands), and why granular flows exhibit both solid-like (stable piles) and fluid-like (avalanching) behavior depending on shear rate.
- **Push it / wow moment:** An hourglass with realistic granular flow — you can hear the physics in how the grains pack at the bottom, how the flow rate depends on aperture size, how the top pile collapses inward as the grains drain. Dig a tunnel and watch it collapse. Build a sandcastle. Rotate the hourglass.
- **Demo:** Pour or scoop sand with the cursor. Rotate the container. Change grain size and friction coefficient. Watch avalanche statistics — plot avalanche size vs. frequency (should follow a power law — self-organized criticality!).
- **Tags:** `granular-simulation` `sand-physics` `angle-of-repose` `Coulomb-friction` `DEM` `discrete-element-method` `javascript` `soft-matter-physics`
- **Thumbnail:** An hourglass with realistic granular sand flowing through the aperture, individual grains visible.

---

# SEASON 3 — Fields & Fluids
**Season thesis:** The physical world isn't just particles — it's fields, and simulating fields means discretizing space itself, which brings a whole new class of instabilities with different physics.

---

## S3·E21 — "I Made Ripples on a Virtual Drum. My First Attempt Was Pure Glitch."

- **Alt title:** "The Wave Equation: Why Your First Grid Simulation Explodes Into Checkerboard Noise"
- **Difficulty:** 5/10 · **Prereq:** E10 (wave/mode concepts) + E07 (integrators)
- **Hook:** A tap on a 2D membrane sends circular ripples out, reflects at the edges, and creates beautiful interference patterns. Then increase the wave speed by 50% — the entire grid explodes into high-frequency checkerboard noise. The physics is correct. The numerics are not.
- **The break (bug):** Violating the Courant-Friedrichs-Lewy (CFL) condition: `c · dt / dx ≤ 1`. When wave speed c is too fast relative to grid spacing dx and timestep dt, information propagates faster than the grid can carry it. The explicit finite-difference update `u(t+dt) = 2u(t) - u(t-dt) + c²dt²/dx² * ∇²u` becomes unconditionally unstable.
- **Concept introduced:** The 2D wave equation `∂²u/∂t² = c²∇²u`, finite differences on a grid (replacing continuous derivatives with discrete differences on a regular mesh), and the CFL stability condition as a universal speed-limit law for explicit grid simulations.
- **Push it / wow moment:** Rendered as a 3D WebGL height field with dynamic lighting — ripples become visually spectacular. Add damping to simulate a realistic drum membrane. Find the eigenfrequencies of the rectangular membrane and play a "melody" by tapping at specific points that excite individual modes.
- **Demo:** Click anywhere to create ripples. Multiple simultaneous sources create live interference patterns. Wave speed slider that lets you hit and violate the CFL condition. Damping slider.
- **Tags:** `wave-equation` `finite-differences` `CFL-condition` `WebGL` `javascript` `2D-wave-simulation` `interference` `drum-simulation` `PDE`
- **Thumbnail:** Beautiful circular ripples interfering on a glowing 3D grid — one half perfect, one half checkerboard noise from CFL violation. "CFL VIOLATION" label.

---

## S3·E22 — "Why Heat Spreads in Code Exactly Like Ink in Water"

- **Alt title:** "The Heat Equation: The Simplest PDE That Still Wants to Ruin Your Timestep"
- **Difficulty:** 5.5/10 · **Prereq:** E21 (finite difference grids + CFL concept)
- **Hook:** A hot spot spreading perfectly across a cold plate — until you double the simulation speed and it explodes into alternating hot/cold pixels. The artifact has a specific name, a specific cause, and a specific cure.
- **The break (bug):** The explicit heat equation requires `dt ≤ dx²/(2α)` — the *diffusion stability condition*, which scales as dx² rather than dx (much more restrictive than CFL). Double the timestep past this threshold and the solution oscillates between neighboring cells, creating the checkerboard artifact. The cure: Crank-Nicolson implicit scheme, which is unconditionally stable for any timestep.
- **Concept introduced:** Heat equation `∂u/∂t = α∇²u`, Fourier's law of heat conduction, the diffusion stability condition (stricter than wave CFL because diffusion has no wave speed), and the key insight that *implicit* integration (solving a linear system at each step) trades compute cost for unconditional stability.
- **Push it / wow moment:** Multiple materials with different thermal conductivities drawn by the user. Realistic thermal camera colormap (purple-blue-green-yellow-red). CPU heat sink geometry showing heat flowing through fins. Thermal equilibrium found automatically.
- **Demo:** Draw heat sources (click and drag). Paint material regions with different conductivity values. Toggle explicit (fast, unstable) vs Crank-Nicolson (slightly slower, always stable). Watch thermal equilibration in real time.
- **Tags:** `heat-equation` `diffusion` `finite-differences` `Crank-Nicolson` `implicit-methods` `javascript` `thermal-simulation` `PDE` `Fouriers-law`
- **Thumbnail:** Thermal camera colormap — left half showing correct heat spreading; right half showing checkerboard explosion. "dt TOO LARGE" label.

---

## S3·E23 — "How to Simulate Smoke in Real Time (The Paper That Changed Game Dev)"

- **Alt title:** "Stam's Stable Fluids: The Brilliant Cheat That Runs at 60 FPS"
- **Difficulty:** 7/10 · **Prereq:** E21, E22 (finite difference grids + PDE methods)
- **Hook:** Incompressible smoke that curls, twists, never explodes, and runs at 60 FPS in a browser. The "correct" explicit Navier-Stokes would blow up in milliseconds. What is this, and is it cheating?
- **The break (bug):** Explicit Navier-Stokes advection is unstable for any practical timestep. Stam's method (Jos Stam, SIGGRAPH 1999) is unconditionally stable because its semi-Lagrangian back-trace step implicitly dissipates kinetic energy. The stability comes at a physical cost: artificial viscosity smooths out fine-scale vortices. This is a deliberate trade of physical accuracy for numerical stability — and understanding this trade-off is the lesson.
- **Concept introduced:** Incompressible fluid simulation pipeline: (1) Add forces to velocity field. (2) Advect velocity field using semi-Lagrangian (trace particle backward along velocity, interpolate). (3) Project velocity field to be divergence-free (enforce incompressibility) via Helmholtz decomposition + Poisson pressure solve. Each step is physically motivated.
- **Push it / wow moment:** Inject multiple colored dye streams. Add vorticity confinement (an additional force that re-sharpens the vortices that semi-Lagrangian smooths out). The result looks like high-resolution CFD on consumer hardware — swirling, tendriling smoke plumes that feel physically real.
- **Demo:** Draw velocity sources with the mouse. Toggle vorticity confinement on/off (see the detail loss and recovery). Inject colored dye streams. FPS counter always visible. Resolution slider.
- **Tags:** `stable-fluids` `Stam` `Navier-Stokes` `javascript` `real-time-fluid-simulation` `smoke-simulation` `vorticity-confinement` `game-physics` `incompressible-flow`
- **Thumbnail:** Gorgeous swirling blue-orange colored smoke on pure black. "60 FPS. STABLE. FROM SCRATCH."

---

## S3·E24 — "Fire Is Just Hot Fluid. Building It Is Pure Programming Horror."

- **Alt title:** "Why Simulating Fire Requires Lying About Thermodynamics"
- **Difficulty:** 7.5/10 · **Prereq:** E23 (stable fluids — extends it directly)
- **Hook:** Add temperature to last week's fluid solver — and suddenly smoke rises, hot gas billows upward, and for the first time it looks exactly like fire. The only addition is 10 lines of code and one physical concept.
- **The break (bug):** Without temperature-buoyancy coupling (Boussinesq approximation: add an upward body force proportional to temperature deviation from ambient), "fire" spreads horizontally as colored dye, not upward. Real hot gas rises because it is less dense than cool air — this is convection, and it must be explicitly coded as a body force.
- **Concept introduced:** Buoyancy-driven convection via the Boussinesq approximation: `f_buoyancy = α(T - T_ambient) * ĝ` where α is the thermal expansion coefficient. Temperature is advected as a *passive scalar* (transported by the velocity field without affecting it except through the buoyancy coupling). This extends the fluid solver by two fields: temperature and fuel density.
- **Push it / wow moment:** 3D volumetric fire rendered in WebGL using ray-marching. Realistic blackbody emission color gradient: blue base → orange body → red/dark smoke crown. Multiple fire sources. Wind direction control. The result is photorealistic enough to be mistaken for real footage in a thumbnail.
- **Demo:** Click to place ignition sources. Wind direction slider. Fuel density slider (how hot / how large the flame). Toggle Boussinesq force off to watch fire become flat dye.
- **Tags:** `fire-simulation` `smoke-simulation` `buoyancy` `Navier-Stokes` `WebGL` `javascript` `volumetric-rendering` `Boussinesq` `convection`
- **Thumbnail:** Dramatic 3D volumetric fire — orange/white core, red fading to dark smoke — against pure black. "CODED FROM SCRATCH. NO TEXTURES."

---

## S3·E25 — "I Simulated Water With 10,000 Particles. It Leaked Out of Its Container."

- **Alt title:** "Smoothed Particle Hydrodynamics: The Particle-Based Way to Be a Fluid"
- **Difficulty:** 7/10 · **Prereq:** E13 (spatial hashing for neighbor search) + E23 (fluid concepts)
- **Hook:** A dam-break simulation — a wall of water rushing forward, splashing with beautiful surface detail — that slowly leaks particles through the container floor until the simulation is empty.
- **The break (bug):** SPH particles near the boundary walls have fewer neighbors than bulk particles. Fewer neighbors → underestimated density from the kernel sum → underestimated pressure → net outward force pushing particles through walls. Fix: "mirror" ghost particles reflected across each boundary face, giving boundary particles a full neighborhood that prevents escape.
- **Concept introduced:** Smoothed Particle Hydrodynamics (SPH). Each particle carries mass, velocity, and density. Density is estimated from neighbors within radius h using a kernel function W(r, h) that weights nearby particles more. Pressure is computed from density via the Tait equation of state. Forces come from the pressure gradient and viscosity terms in the Navier-Stokes equation, both approximated via weighted neighbor sums.
- **Push it / wow moment:** Water sloshing in a tilting container (gyroscope-style rotation). Floating rigid body coupling — a boat bobbing on SPH water. 3D SPH with marching-cubes surface extraction for specular water rendering.
- **Demo:** Break the dam. Tilt the container with a slider. Add floating rigid objects. Adjust particle count vs. quality. Toggle ghost particles off to reproduce the leak.
- **Tags:** `SPH` `smoothed-particle-hydrodynamics` `water-simulation` `dam-break` `javascript` `particle-fluid` `WebGL` `Lagrangian-fluid`
- **Thumbnail:** Dramatic dam-break wave crashing against a wall, water spray visible against black. "10,000 PARTICLES. NO MESH."

---

## S3·E26 — "Two Chemicals, No Intelligence, Infinite Complexity: Turing's Last Secret"

- **Alt title:** "Alan Turing's Hidden Discovery: How Patterns Grow From Nothing"
- **Difficulty:** 5.5/10 · **Prereq:** E22 (diffusion on a grid) + E21 (finite differences)
- **Hook:** A uniform gray canvas. From a single pixel perturbation, spots appear, grow, split, and rearrange into coral-like patterns, stripes, labyrinths, and spirals — all from two coupled equations. Same equations, slightly different parameters, completely different pattern.
- **The break (bug):** Without the right ratio between the two diffusion rates (Du must be significantly greater than Dv), the activator-inhibitor spatial separation doesn't occur and you get uniform mixing. The Turing instability requires that the *inhibitor* diffuses faster than the *activator* — so the inhibitor "chases" the activator across space, creating the pattern. Most beginners set equal diffusion rates and wonder why nothing happens.
- **Concept introduced:** Reaction-diffusion systems, specifically the Gray-Scott model `∂u/∂t = Du∇²u - uv² + f(1-u)`, `∂v/∂t = Dv∇²v + uv² - (f+k)v`. Turing instability: a homogeneous steady state that is stable without diffusion becomes unstable when diffusion is added, because the inhibitor diffuses faster and creates long-range suppression around local activator peaks. This is Alan Turing's 1952 morphogenesis paper — his last major scientific contribution before his death.
- **Push it / wow moment:** A GPU-computed 512×512 parameter space map — the (F, k) plane. Every point shows which pattern type emerges: coral (top-left), labyrinths (center), spots (bottom-right), spirals, worms, "mitosis" (self-replicating spots). Sweeping the parameter sliders in real-time morphs patterns between these regimes. The visual output is wallpaper-quality.
- **Demo:** F (feed rate) and k (kill rate) sliders with real-time pattern evolution. Click to seed the reaction at a specific point. Freeze-frame for wallpaper export. "Explore" button that random-walks through (F, k) space.
- **Tags:** `reaction-diffusion` `Gray-Scott` `Turing-patterns` `morphogenesis` `javascript` `WebGL` `computational-biology` `pattern-formation` `Turing-instability`
- **Thumbnail:** A stunning coral-like Turing pattern in electric blue-yellow. Caption: "2 EQUATIONS. ∞ PATTERNS."

---

## S3·E27 — "I Drew Electric Fields by Hand, Then in Code. One of Them Was Wrong."

- **Alt title:** "Why Electric Field Lines Are Almost Impossible to Draw Correctly in Code"
- **Difficulty:** 4.5/10 · **Prereq:** E06 (gravity as Coulomb analogue) + E07 (adaptive integration)
- **Hook:** A textbook-perfect electric field line diagram with beautiful curved lines terminating at charges — except two field lines merge into each other instead of terminating, violating Gauss's law numerically.
- **The break (bug):** Naive field line integration (follow the normalized electric field at fixed step size) overshoots near charges because the field varies rapidly in magnitude. Lines that should pass on opposite sides of a small charge merge due to insufficient step resolution. Fix: adaptive step size (RK4 with error control), and angular flux-tube method for distributing starting angles proportional to charge magnitude.
- **Concept introduced:** Coulomb's law `E = kq/r²`, the superposition principle (total field = vector sum of individual contributions), Gauss's law (field lines begin and end on charges, conserving flux), and the angular-flux method for correctly spacing field lines to represent equal flux tubes.
- **Push it / wow moment:** Drag charges around in real time — all field lines update instantly. Add a grounded conductor (Faraday cage) using the image charge method: field inside is zero, field outside is distorted. Show both electric field lines and equipotential contours simultaneously (they are always perpendicular).
- **Demo:** Click to place positive and negative charges. Drag to move. Adjust charge magnitude. Toggle equipotentials on/off. The Faraday cage demo.
- **Tags:** `electric-field-simulation` `Coulombs-law` `field-lines` `Gausss-law` `javascript` `electrostatics` `physics-visualization` `superposition` `Faraday-cage`
- **Thumbnail:** A beautiful electric dipole field line diagram with a Faraday cage in the center, field lines curving around it, zero lines penetrating the interior.

---

## S3·E28 — "I Made Light in a Computer Using Maxwell's Equations"

- **Alt title:** "FDTD: How to Simulate Light Without Knowing Any Quantum Mechanics"
- **Difficulty:** 8/10 · **Prereq:** E21, E22, E27 (grids + fields)
- **Hook:** A pulse of light bouncing between two perfect mirrors, pixel by pixel, computed from Maxwell's four equations on a grid. Then a metamaterial cloak bends the light around an obstacle, and you watch it happen in real time.
- **The break (bug):** Without the Yee staggered grid (E and H fields offset by half a cell in both space and time), the discrete curl operators couple incorrectly, causing the simulation to fill with numerical "ghost modes" — artificial oscillations at grid wavelength that look like the simulation has a ghost image layered over the real one.
- **Concept introduced:** Finite-Difference Time-Domain (FDTD) method. The Yee lattice staggers Ex, Ey, Ez and Hx, Hy, Hz components in space by half a cell and in time by half a step, so that Maxwell's curl equations become exact on the discrete grid. The Courant condition for EM waves: `c·dt ≤ dx/√d` (where d is dimension). FDTD is used in antenna design, photonic chip simulation, and optical fiber engineering.
- **Push it / wow moment:** Simulate a photonic crystal — a periodic array of dielectric cylinders with a bandgap where certain wavelengths cannot propagate. Show the band structure visually. A waveguide that bends light 90° with zero loss. A diffraction grating producing rainbow-like color separation.
- **Demo:** Click to place a point EM source. Draw metal or dielectric regions with a paintbrush. Watch EM waves bounce, refract, and diffract in real time. Source frequency slider.
- **Tags:** `FDTD` `Maxwell's-equations` `electromagnetic-simulation` `light-simulation` `Yee-grid` `javascript` `computational-electrodynamics` `photonic-crystal`
- **Thumbnail:** Colorized EM wave pulse diffracting around a circular obstacle, beautiful fringe pattern visible in the shadow region. "MAXWELL'S EQUATIONS IN CODE."

---

## S3·E29 — "Why Euler Angles Made My Spaceship Do a Barrel Roll for No Reason"

- **Alt title:** "Gimbal Lock Is Real, and It Will Ruin Your 3D Physics Engine"
- **Difficulty:** 7.5/10 · **Prereq:** E06, E14, E15 (force and torque concepts in simpler contexts)
- **Hook:** A spinning cube that behaves normally at all orientations — until it is tilted exactly 90°. At that point, two of its rotation axes merge into one. You can no longer roll it. Gimbal lock. Live on camera.
- **The break (bug):** Euler angle representation has geometric singularities. When the pitch angle reaches ±90°, the yaw and roll axes become parallel — one degree of freedom is lost. Integrating Euler's rotation equations using Euler angles causes NaN values and discontinuous 360° flips at these singularities. The fix: represent orientation as a unit quaternion (4D unit vector), which has no singularities.
- **Concept introduced:** Quaternions as a singularity-free orientation representation. A quaternion q = (w, xi, yj, zk) represents a rotation of angle 2θ around axis (x,y,z) where w=cos(θ). Quaternion multiplication composes rotations. The inertia tensor I relates angular velocity ω to angular momentum L = I·ω, and determines how different rotation axes resist angular acceleration differently.
- **Push it / wow moment:** A free-floating asymmetric 3D rigid body (think a thick book) given an initial spin. Demonstrates the *tennis racket theorem* (Dzhanibekov effect): rotation around the intermediate principal axis is unstable. The book spontaneously flips 180° periodically, in a stunning and counterintuitive display.
- **Demo:** Click to apply torque impulses to the rigid body. Euler angles vs quaternion comparison side by side — observe gimbal lock on the left, smooth rotation on the right. Adjust inertia tensor via shape controls.
- **Tags:** `quaternions` `rigid-body-simulation` `gimbal-lock` `inertia-tensor` `3D-physics` `three.js` `javascript` `angular-momentum` `Euler-angles` `Dzhanibekov-effect`
- **Thumbnail:** A cube with one axis grayed out and a big "X" through it mid-rotation. "GIMBAL LOCK. ONE DOF GONE."

---

## S3·E30 — "A Spinning Top Defies Gravity. Here's the Code That Proves It." *(Season 3 Finale)*

- **Alt title:** "Gyroscopic Precession: The Physics That Looks Exactly Like a Magic Trick"
- **Difficulty:** 8/10 · **Prereq:** E29 (full 3D rigid body + quaternions — this is the natural next challenge)
- **Hook:** A gyroscope whose spin axis should fall under gravity — but instead the axis orbits slowly around vertical, apparently defying gravity entirely. Then the spin winds down and it falls exactly like a non-spinning top. The code running both behaviors is identical.
- **The break (bug):** Without the gyroscopic torque term `τ = dL/dt = ω_precession × L` in the angular momentum update, the simulated gyroscope just topples under gravity. Adding this term (which comes naturally from the correct angular momentum equation `dL/dt = τ_external`) produces precession without any special-casing. The entire counterintuitive behavior is in a single cross-product.
- **Concept introduced:** Angular momentum `L = I·ω`, Euler's equations of motion `dL/dt = τ`, and why a torque applied to a large angular momentum vector causes the *direction* of L to change (precession) rather than its magnitude. Precession rate `Ω = τ/L = Mgr/(Iω)` — faster spin means slower precession.
- **Push it / wow moment:** Add nutation (the wobble on top of precession — the gyroscope traces a cycloid path rather than a perfect circle). Show a Foucault pendulum — the oscillation plane rotates due to Earth's angular momentum being a gyroscope. Show a satellite with reaction wheels — applying torque to the wheels transfers momentum to orient the satellite.
- **Demo:** Set spin rate with a slider. Watch precession rate decrease as spin decays from friction. "Stop spin" button immediately causes it to fall, making the gyroscopic effect viscerally clear.
- **Tags:** `gyroscope-simulation` `precession` `angular-momentum` `rigid-body` `three.js` `javascript` `physics-counterintuition` `nutation` `Foucault-pendulum`
- **Thumbnail:** A glowing gyroscope precessing in a slow circle while a plain non-spinning top falls over beside it. The contrast is the entire story.

---

# SEASON 4 — Spacetime & Quantum
**Season thesis:** At extremes — light speed and the Planck scale — space and time become the simulation domain, and classical intuitions about "where things are" completely break down.

---

## S4·E31 — "I Simulated Traveling Near Light Speed. My Clock Actually Slowed Down."

- **Alt title:** "Special Relativity Is Not Abstract: Here's What It Looks Like in Running Code"
- **Difficulty:** 5/10 · **Prereq:** E01 (basic kinematics baseline)
- **Hook:** Two clocks on screen — one stationary, one moving at 0.99c — and you watch them tick at measurably different rates in real time. The math is shown numerically. This isn't a textbook — it's running physics.
- **The break (bug):** Using Newtonian velocity addition `v_total = v1 + v2` gives superluminal results for two objects each moving at 0.6c relative to each other: v_total = 1.2c. The simulation crashes with an undefined Lorentz factor. Fix: relativistic velocity addition `v_total = (v1 + v2)/(1 + v1·v2/c²)`.
- **Concept introduced:** Lorentz factor `γ = 1/√(1-v²/c²)`, time dilation `Δt' = γΔt` (moving clock ticks slower by factor γ), length contraction `L' = L/γ` (moving objects are shorter), relativistic velocity addition (velocities never add to exceed c), and why c is the simulation's hard ceiling.
- **Push it / wow moment:** A Minkowski spacetime diagram — the user draws worldlines (position vs. time curves) and the simulation shows the light cones automatically. Two observers with worldlines shown simultaneously — their simultaneity slices are visibly different (relativity of simultaneity). Set up the twin paradox: two worldlines, one stationary, one going and returning.
- **Demo:** Drag a spaceship's velocity slider from 0 to 0.9999c. Watch the clock tick rate change in real time. Draw worldlines on the Minkowski diagram. Compare proper times between any two events.
- **Tags:** `special-relativity` `time-dilation` `Lorentz-factor` `Minkowski-diagram` `javascript` `relativistic-simulation` `spacetime-visualization` `length-contraction`
- **Thumbnail:** Two clocks — one ticking fast, one barely moving — with Minkowski diagram in background. "TIME IS NOT CONSTANT."

---

## S4·E32 — "What Does 99% Light Speed Actually Look Like? I Coded It."

- **Alt title:** "Relativistic Aberration: Why Stars Bunch Up in Front of a Fast-Moving Ship"
- **Difficulty:** 6/10 · **Prereq:** E31 (SR basics)
- **Hook:** A starfield that, as the ship accelerates toward 0.99c, compresses all stars into a blazing point ahead — while everything behind redshifts to darkness — a physically accurate rendering that looks completely alien.
- **The break (bug):** Applying only relativistic Doppler shift (color change) without aberration (position change) gives a wrong image — stars appear redshifted/blueshifted but at their original positions. In reality, the star positions themselves shift forward due to relativistic aberration. Both effects must be applied to each star's angle θ using: `cos(θ') = (cos(θ) + β)/(1 + β·cos(θ))`.
- **Concept introduced:** Relativistic aberration (stars appear to bunch forward — the "headlight effect" — as velocity increases), relativistic Doppler shift (approaching stars blueshift; receding redshift beyond visible into infrared), Penrose-Terrell rotation (a moving sphere appears rotated, not squished, due to light-travel time differences across its face).
- **Push it / wow moment:** A relativistic ray-tracer for a city street moving at 0.99c. The buildings in front are compressed and blueshifted; the ones behind are stretched and dark. Add Terrell rotation to a cube — it appears rotated by an angle instead of Lorentz-contracted.
- **Demo:** Velocity slider 0 → 0.9999c. Toggle each effect (aberration, Doppler, Terrell) independently to understand the contribution of each. Starfield with constellation lines visible.
- **Tags:** `relativistic-aberration` `Doppler-effect` `Penrose-Terrell` `javascript` `special-relativity` `starfield` `headlight-effect` `relativistic-ray-tracing`
- **Thumbnail:** All stars smeared into a blazing point at the center front of the view. A spaceship silhouette visible. "THIS IS WHAT 0.99c LOOKS LIKE."

---

## S4·E33 — "The Twin Paradox Has a Definite Answer. I Coded It to Find Out."

- **Alt title:** "Why the Traveling Twin Ages Slower (And It's Not What You Think)"
- **Difficulty:** 6/10 · **Prereq:** E31, E32 (SR framework established)
- **Hook:** Twin A stays on Earth; Twin B flies to Alpha Centauri at 0.9c and returns. At reunion, B is measurably, unambiguously younger — their proper-time odometers shown numerically throughout the trip. But if motion is relative, why isn't A younger?
- **The break (bug):** Treating both twins symmetrically — "A sees B's clock tick slow, B sees A's clock tick slow, so who is younger?" — leads to a logical paradox. The resolution: Twin B *changes inertial reference frames* at the turnaround point; Twin A never does. This asymmetry breaks the symmetry of the argument. The simulation shows the Doppler-signal analysis: B receives fewer signals from A during outbound, many signals during return (due to Doppler), and the totals add up correctly.
- **Concept introduced:** Proper time (time measured by a clock along a worldline), the asymmetry of the twin paradox (the traveler changes frames; the stay-at-home doesn't), and the Doppler resolution (no acceleration needed — just track signal exchange rates between inertial frames and the asymmetry is clear).
- **Push it / wow moment:** Multiple travelers at different speeds and turnaround distances — show their proper-time odometers at reunion versus Earth time. The relationship `Δτ = Δt/γ` shown working for all simultaneously. Minkowski diagram showing all worldlines with their proper times labeled.
- **Demo:** Set travel speed, distance, and turnaround type. Watch both odometers live. Doppler signal display showing when each twin receives signals from the other.
- **Tags:** `twin-paradox` `special-relativity` `proper-time` `Minkowski-diagram` `javascript` `time-dilation` `spacetime` `relativity-simulation`
- **Thumbnail:** Two identical faces side by side — one older, one younger — with spacetime diagram behind them. "WHO IS OLDER?"

---

## S4·E34 — "I Ray-Traced a Black Hole and Saw Why Interstellar Got It Right"

- **Alt title:** "How to Render a Black Hole Using General Relativity (No Shortcuts)"
- **Difficulty:** 8.5/10 · **Prereq:** E07 (RK4 adaptive integration), E31–E33 (SR context for GR)
- **Hook:** A photon sphere ring, an Einstein ring from a perfectly-aligned background star, and multiple ghost images of an accretion disk — all rendered pixel-by-pixel by integrating photon trajectories under the Schwarzschild metric.
- **The break (bug):** Integrating photon geodesics with a fixed step size causes photons near the photon sphere (r = 3GM/c²) to either incorrectly escape when they should orbit, or incorrectly fall in. An adaptive step size (shrink dt near the singularity) is mandatory — and even then, the photon sphere is numerically chaotic (an unstable equilibrium, analogous to a ball balanced on a hilltop).
- **Concept introduced:** Schwarzschild metric `ds² = -(1-rs/r)c²dt² + (1-rs/r)⁻¹dr² + r²dΩ²` (rs = 2GM/c² is the Schwarzschild radius), null geodesic equations for massless particles (photons follow paths where ds² = 0), gravitational lensing (light bends around mass), and the photon sphere (r = 3rs/2, where photons can orbit — unstably).
- **Push it / wow moment:** Full Einstein ring + multiple ghost images. The accretion disk appears *both above and below* the black hole simultaneously — the light from the underside is lensed around and becomes visible above. This is the visual that made Interstellar famous, and it emerges naturally from the geodesic integration.
- **Demo:** Adjust the impact parameter (closest approach distance of the photon) and watch the deflection angle update. Add a background starfield. Export the rendering as a 4K image.
- **Tags:** `black-hole-simulation` `gravitational-lensing` `Schwarzschild` `photon-geodesic` `ray-tracing` `javascript` `WebGL` `general-relativity` `Einstein-ring` `photon-sphere`
- **Thumbnail:** Stunning Interstellar-style black hole with accretion disk and Einstein ring. "CODED WITH GENERAL RELATIVITY."

---

## S4·E35 — "Planets Near a Black Hole Don't Follow Newton. Here's the Difference."

- **Alt title:** "Relativistic Orbits: Why Mercury's Perihelion Confused Astronomers for 60 Years"
- **Difficulty:** 8/10 · **Prereq:** E34 (Schwarzschild metric — extends it to massive particles)
- **Hook:** A planetary orbit near a black hole that precesses — the ellipse's major axis slowly rotates — an effect that baffled astronomers for six decades before Einstein explained it with one equation.
- **The break (bug):** Using Newtonian gravity gives a closed, non-precessing ellipse (Bertrand's theorem: only 1/r² and harmonic forces give closed orbits). The Schwarzschild correction adds a GR term to the effective potential: `V_eff = -GM/r + L²/2mr² - GML²/mc²r³`. This extra term breaks the closure condition, causing perihelion advance at rate `Δφ = 6πGM/ac²(1-e²)` per orbit.
- **Concept introduced:** Schwarzschild geodesic equation for massive test particles (timelike geodesics), the GR effective potential, and perihelion precession as a uniquely GR effect. For Mercury, this gives 43 arcseconds per century — precisely the anomalous precession that classical mechanics couldn't explain and GR predicts exactly.
- **Push it / wow moment:** Compare GR orbit vs. Newtonian orbit for extreme mass ratios — near a stellar black hole, the precession is dramatic and visible within one orbit. Show the innermost stable circular orbit (ISCO) at r = 6GM/c² — inside this radius, no stable circular orbits exist and anything falling in spirals down.
- **Demo:** Set orbital parameters (semi-major axis, eccentricity, inclination). Toggle GR vs. Newtonian. Watch the ellipse precess over many orbits. Drag the orbit closer to the ISCO and watch stability fail.
- **Tags:** `Schwarzschild-geodesics` `perihelion-precession` `general-relativity` `orbit-simulation` `javascript` `Mercury-anomaly` `ISCO` `GR-orbits` `curved-spacetime`
- **Thumbnail:** A precessing ellipse near a black hole — the major axis clearly rotating over successive orbits. "43 ARCSECONDS. NEWTON COULDN'T EXPLAIN IT."

---

## S4·E36 — "I Rendered the Most Beautiful Thing in the Universe From Scratch"

- **Alt title:** "Why the Interstellar Black Hole Looks the Way It Does"
- **Difficulty:** 9/10 · **Prereq:** E34, E35 (full Schwarzschild ray-tracing pipeline)
- **Hook:** The complete Interstellar image: a glowing accretion disk that appears to curve upward *over* the black hole — an apparent impossibility that is entirely a lensing artifact, emerging from the photon geodesics in E34.
- **The break (bug):** Rendering only the direct image of the disk (light that travels from the disk to the camera without going around the hole) gives a flat ring. The full image requires also tracing photons that travel *around* the black hole (secondary image) and even around twice (tertiary image) — these produce the top and bottom "reflections" of the disk. Miss these and the image looks flat and wrong.
- **Concept introduced:** Accretion disk emission spectrum (blackbody `T(r) ∝ r^(-3/4)` giving a color gradient from hot blue-white inner edge to cool red outer edge), Doppler beaming (approaching side of disk is dramatically brighter — `I ∝ γ⁴(1+β·cos φ)⁴`), and multiple lensed images of the same disk.
- **Push it / wow moment:** Add relativistic spin (Kerr metric in the equatorial plane approximation) so the approaching side of the disk blueshifts and the receding side redshifts — the Doppler brightness asymmetry matches the Interstellar/KGEO frame exactly.
- **Demo:** Control black hole mass, disk temperature, inclination angle, and spin parameter. Export as 8K image. Toggle secondary and tertiary images on/off to build up the full picture.
- **Tags:** `accretion-disk` `black-hole-rendering` `Interstellar` `gravitational-lensing` `ray-tracing` `WebGL` `Doppler-beaming` `Kerr-metric` `astrophysics`
- **Thumbnail:** Photorealistic Interstellar-style black hole with glowing asymmetric accretion disk. "I CODED THIS."

---

## S4·E37 — "I Simulated a Quantum Particle. It Was Everywhere at Once."

- **Alt title:** "The Schrödinger Equation in Code: Probability Clouds, Not Billiard Balls"
- **Difficulty:** 7.5/10 · **Prereq:** E21, E22 (PDE + implicit methods)
- **Hook:** A Gaussian wavepacket bouncing around a potential well — spreading, reflecting, interfering with itself. You are watching the probability *density* evolve in time, not the position of a particle.
- **The break (bug):** Explicit (FTCS — Forward Time, Centered Space) integration of the Schrödinger equation is unconditionally unstable: the norm of ψ grows without bound because the explicit scheme is not unitary. Total probability increases past 1.0 and eventually overflows. Fix: Crank-Nicolson implicit scheme, which is guaranteed unitary (norm-preserving) for all timesteps because it is time-reversal symmetric.
- **Concept introduced:** Schrödinger equation `iℏ∂ψ/∂t = Ĥψ = [-ℏ²/2m · ∂²/∂x² + V(x)]ψ`, complex wavefunction ψ(x,t), probability density |ψ|² (Born rule), wavepacket as a superposition of energy eigenstates, and why quantum evolution must be unitary (probability must be conserved).
- **Push it / wow moment:** Double potential well — two wells separated by a barrier. Watch the wavepacket tunnel between wells and beat between the symmetric and antisymmetric eigenstates. The "collapse" at measurement: sample a random position from |ψ|² and show the wavefunction instantly concentrating there.
- **Demo:** Click to place a wavepacket with adjustable position and initial momentum. Draw potential barriers and wells. Watch the norm display stay at 1.0. Toggle explicit vs. Crank-Nicolson to see the norm explode.
- **Tags:** `Schrödinger-equation` `wavepacket-simulation` `quantum-mechanics` `Crank-Nicolson` `javascript` `probability-density` `quantum-simulation` `Born-rule`
- **Thumbnail:** A glowing Gaussian wavepacket splitting at a barrier — transmitted fraction on the right, reflected fraction on the left.

---

## S4·E38 — "I Built a Wall That Particles Go Through (Quantum Tunneling, Coded)"

- **Alt title:** "How Quantum Tunneling Powers Your Phone's Flash Memory — Simulated"
- **Difficulty:** 7.5/10 · **Prereq:** E37 (Schrödinger + wavepacket propagation)
- **Hook:** A wavepacket with total energy *below* the barrier height — and yet a fraction clearly appears on the other side. The probability of tunneling decreases exponentially with barrier thickness — the exact formula is derivable in 5 minutes.
- **The break (bug):** Without enforcing continuity of both ψ and dψ/dx at both barrier interfaces, the transmission coefficient is wrong by orders of magnitude. The exponential decay inside the barrier `ψ ∝ e^(-κx)` where `κ = √(2m(V-E))/ℏ` connects to the wave solution outside only if both the function and its derivative match — miss either condition and you get nonsense transmission rates.
- **Concept introduced:** Quantum tunneling, transmission and reflection coefficients `T = |transmitted amplitude|²/|incident amplitude|²`, exponential decay in classically-forbidden regions, WKB (Wentzel-Kramers-Brillouin) approximation `T ≈ exp(-2∫κ(x)dx)` for arbitrary barrier shapes, and applications: alpha decay, scanning tunneling microscopy, flash memory (Fowler-Nordheim tunneling).
- **Push it / wow moment:** Multiple barriers showing *resonant tunneling* — at specific energies, T = 1.0 exactly (perfect transmission through multiple barriers). A scanning tunneling microscope simulation showing atomic-resolution imaging as a consequence: the tunneling current depends exponentially on tip-sample distance, so even a single-atom bump causes a measurable signal change.
- **Demo:** Draw barriers of any height and width. See T update live. Compare WKB approximation vs. exact numerical result. The STM demo showing "atomic" surface features.
- **Tags:** `quantum-tunneling` `Schrödinger-equation` `transmission-coefficient` `WKB-approximation` `javascript` `quantum-mechanics` `potential-barrier` `resonant-tunneling` `flash-memory`
- **Thumbnail:** Wavefunction approaching a thick barrier — a clear transmitted lobe visible on the far side. "IT WENT THROUGH THE WALL."

---

## S4·E39 — "Light Is a Wave and a Particle. I Simulated Both. They're the Same Thing."

- **Alt title:** "The Double Slit: The Most Terrifying Experiment in Physics, Built in Code"
- **Difficulty:** 6.5/10 · **Prereq:** E37, E38 (QM framework + probability amplitude)
- **Hook:** A single photon fired at a double slit — no pattern visible. After 10,000 photons, an interference pattern emerges from apparently random individual dots. Nobody told the photons to make an interference pattern.
- **The break (bug):** Simulating photons as classical balls that land randomly in one slit or the other produces a two-lump distribution — one lump per slit — with no interference. Only computing the full wave amplitude ψ at the screen (summing contributions from both slits, respecting phase) and *then* sampling from |ψ|² produces the correct interference pattern.
- **Concept introduced:** Wave-particle duality, probability amplitudes (complex numbers whose squared magnitude gives probability), Young's double-slit experiment, Born's rule, and the measurement problem: why adding a detector at one slit (which-path information) destroys the interference pattern.
- **Push it / wow moment:** "Which-path" measurement — add a detector at one slit. The interference pattern immediately vanishes, leaving the two-lump classical distribution. Remove the detector — pattern returns. The simulation makes Feynman's "most mysterious experiment" *playable*.
- **Demo:** Toggle wave mode (see the full wave amplitude) vs. particle mode (individual dots accumulate). Click to add/remove the which-path detector. Adjust slit width and separation. Watch the fringe spacing change as predicted by `λL/d`.
- **Tags:** `double-slit` `quantum-mechanics` `wave-particle-duality` `Borns-rule` `javascript` `interference` `photon-simulation` `which-path` `measurement-problem`
- **Thumbnail:** A screen showing an interference pattern gradually emerging from individual random dots. "ONE PHOTON AT A TIME."

---

## S4·E40 — "How Magnetism Switches On: A Phase Transition Built From Simple Rules" *(Season 4 Finale)*

- **Alt title:** "The Ising Model: When Randomness Suddenly Snaps Into Order"
- **Difficulty:** 7/10 · **Prereq:** E37–E39 (statistical quantum concepts) + E16 (grid evolution patterns)
- **Hook:** A grid of random magnetic spins — up or down, equally likely. Above a critical temperature, it stays random. Drop the temperature one degree past the Curie point and, almost instantly, large coherent domains of aligned spins snap into existence. The same rules, one parameter change, completely different universe.
- **The break (bug):** Using systematic sequential updates (sweep row by row, left to right) instead of random Metropolis sampling violates detailed balance. The update order creates artificial spatial correlations that bias the equilibrium — the phase transition appears at the wrong temperature and the domain structure looks wrong. Fix: randomize the update order using the Metropolis-Hastings algorithm.
- **Concept introduced:** Ising model: each spin s_i = ±1 interacts with neighbors via Hamiltonian `H = -J Σ s_i s_j - B Σ s_i`. Monte Carlo simulation: randomly flip spins using Metropolis acceptance `P = min(1, e^(-ΔE/kT))`. Detailed balance: accept probabilities must satisfy `P(state A → B)/P(B → A) = e^(-(E_B - E_A)/kT)` to reach the correct Boltzmann distribution.
- **Push it / wow moment:** Near-critical behavior — the correlation length ξ diverges as T→Tc, spin patterns become fractal, and power-law scaling appears. Add the Wolff cluster algorithm (flip entire correlated clusters at once instead of single spins) to see 100× speedup near criticality. Plot magnetization vs. temperature — the sharp phase transition appears at exactly `Tc = 2J/k·ln(1+√2)` ≈ 2.27J/k (the Onsager solution).
- **Demo:** Temperature slider from 0 → 4Tc. Watch the phase transition. Live magnetization vs. temperature curve being traced in real time. Wolff vs. Metropolis toggle showing the critical slowing-down effect.
- **Tags:** `Ising-model` `Monte-Carlo` `phase-transition` `Metropolis-algorithm` `magnetism` `javascript` `statistical-mechanics` `critical-phenomena` `symmetry-breaking`
- **Thumbnail:** Split screen — chaotic disordered spins above the Curie temperature vs. large ordered domains below. "THE EXACT MOMENT ORDER APPEARS."

---

# SEASON 5 — Teaching Machines Physics
**Season thesis:** When you make a physics simulation differentiable, machines can learn the laws of nature from raw data — and their failures are as instructive as the simulations they learned from.

---

## S5·E41 — "I Aimed a Cannon With Gradient Descent. The Math Is Insane."

- **Alt title:** "What If Your Physics Engine Could Calculate Its Own Derivatives?"
- **Difficulty:** 7/10 · **Prereq:** E01–E10 (sim fundamentals) + basic ML familiarity
- **Hook:** A cannon that, given an arbitrary target position, automatically finds the exact launch angle and velocity to hit it — by flowing gradients *backward* through every timestep of the simulation.
- **The break (bug):** Non-differentiable operations in the simulation cause gradient flow to break. If-else collision branches produce zero gradients (no signal) or NaN (undefined). `floor()` for grid indices has zero derivative everywhere. Fix: smooth approximations — sigmoid for collision onset, bilinear interpolation for grid sampling. Every non-differentiable operation is a place where the gradient optimizer is flying blind.
- **Concept introduced:** Differentiable programming — treating a simulation as a computation graph and computing `∂Loss/∂parameters` via reverse-mode automatic differentiation (autograd / JAX's `jax.grad`). The simulation is just a function: `output = simulate(params)`. Loss = distance from target. `dLoss/dparams` tells you how to adjust the launch parameters to reduce the loss.
- **Push it / wow moment:** Trajectory optimization with 3 obstacles — gradient descent finds the arc that grazes past all obstacles to reach the target, a solution no human would intuit. Show the gradient flow: arrows on the trajectory showing which direction to perturb each point to reduce the loss.
- **Demo:** Place target and obstacles with clicks. Watch gradient descent tune launch angle and speed in real time. Overlay gradient magnitude as a heat map on the trajectory. Compare gradient descent vs. random search to show why gradients are magic.
- **Tags:** `differentiable-simulation` `automatic-differentiation` `gradient-descent` `physics-optimization` `javascript` `JAX` `inverse-problems` `trajectory-optimization`
- **Thumbnail:** A glowing ballistic arc threading around three obstacles to hit a target. "GRADIENT DESCENT FOUND THIS."

---

## S5·E42 — "I Trained a Neural Net to Solve the Heat Equation. It Cheated."

- **Alt title:** "PINNs: When Your Neural Net Knows Physics Before It Sees Any Data"
- **Difficulty:** 8/10 · **Prereq:** E41 (differentiable sim) + E22 (heat equation to understand what's being solved)
- **Hook:** A neural net that solves the heat equation without any mesh, any grid, any timestep — just sampled points in space-time — and its solution generalizes to boundary conditions the training data never contained.
- **The break (bug):** Without the physics residual loss term (enforcing `∂u/∂t - α∇²u = 0` at collocation points), the network fits only the sampled training points and completely fails at interpolation, producing non-physical temperature distributions that don't satisfy the heat equation anywhere except at the training data.
- **Concept introduced:** Physics-Informed Neural Networks (PINNs). A PINN approximates the solution `u(x,t)` as a neural network. Total loss = data loss (match boundary and initial conditions at sampled points) + physics loss (residual of the PDE at collocation points). The network is simultaneously trained to fit data and satisfy the physics equation everywhere.
- **Push it / wow moment:** PINN solving 2D steady Navier-Stokes around a cylinder. Compare to finite-difference ground truth — nearly identical for laminar flow. Drag the cylinder to a new position — the PINN re-solves in milliseconds. Show where it fails at high Reynolds number.
- **Demo:** Draw arbitrary Dirichlet boundary conditions. Watch PINN solve in real time (gradient steps visible). Toggle the physics loss term on/off to see the non-physical collapse without it.
- **Tags:** `PINNs` `physics-informed-neural-networks` `heat-equation` `deep-learning` `JAX` `PyTorch` `scientific-ML` `meshless-PDE` `neural-PDE`
- **Thumbnail:** Two solution fields side by side — neural net output vs. FEM reference — nearly identical color maps. "NO MESH. NO TIMESTEP. JUST MATH."

---

## S5·E43 — "This Neural Net Watched a Pendulum and Learned Newton's Second Law"

- **Alt title:** "Neural ODEs: What If the Differential Equation's Right-Hand Side Is a Network?"
- **Difficulty:** 8.5/10 · **Prereq:** E41 (differentiable sim) + E08 (double pendulum / chaos)
- **Hook:** A neural network trained only on recorded pendulum position-velocity trajectories — no labels, no physics equations given. When its learned vector field is plotted, it matches `F = ma` exactly. The machine discovered Newton's law.
- **The break (bug):** Without the adjoint method for backpropagating through the ODE solver, gradients of the loss with respect to network parameters must be computed by storing the entire integration history — memory grows linearly with number of ODE steps. For a long simulation, this crashes. The adjoint method solves a backward ODE to compute gradients, using O(1) memory regardless of integration length.
- **Concept introduced:** Neural ODEs — replace the right-hand side `f(x, t)` of an ODE `dx/dt = f(x,t)` with a neural network `f_θ(x,t)`. Train by running the ODE forward, computing a loss, and backpropagating through the solver using the adjoint sensitivity method. The resulting model is a *continuous-depth* network where depth corresponds to integration time.
- **Push it / wow moment:** Neural ODE trained on chaotic double-pendulum trajectories. Visualize the learned vector field in phase space — it matches the true dynamics perfectly. Show which initial conditions it predicts correctly vs. where it fails and why (Lyapunov horizon from E08).
- **Demo:** Train live on incoming pendulum data. Draw initial conditions on the phase plane and watch the neural ODE extrapolate them forward. Compare neural ODE prediction vs. ground truth.
- **Tags:** `neural-ODE` `ODE-Net` `machine-learning-physics` `adjoint-method` `pendulum` `JAX` `trajectory-learning` `scientific-ML`
- **Thumbnail:** A perfect pendulum phase portrait — closed ellipses and the separatrix — labeled "LEARNED FROM DATA."

---

## S5·E44 — "I Fed a Neural Net Raw Planet Data. It Derived Newton's Law of Gravity."

- **Alt title:** "AI-Feynman: Can a Machine Rediscover Physics From Scratch?"
- **Difficulty:** 8.5/10 · **Prereq:** E43 (neural physics learning as motivation for interpretability)
- **Hook:** A system shown nothing but planet position and velocity data over time. Its symbolic regression output: `F = G·m₁·m₂/r²`. Newton's exact formula, in human-readable form, discovered without being told it existed.
- **The break (bug):** A pure neural network learns a non-interpretable black-box function. Symbolic regression with genetic programming explores expression trees (math formulas as trees: `sin(+(*,x),y)`) but gets stuck in local optima for complex formulas. Dimensional analysis as a physics-guided prior — requiring every candidate formula to be dimensionally consistent — shrinks the search space by orders of magnitude and avoids physically impossible formulas.
- **Concept introduced:** Symbolic regression — finding the mathematical formula that fits data — using genetic programming (evolving expression trees under selection pressure). Dimensional analysis: physical equations must be dimensionally consistent, so we can use units as a filter. The AI-Feynman approach (Tegmark et al.) uses neural networks to identify functional dependencies before applying symbolic regression.
- **Push it / wow moment:** Try to rediscover the Lagrangian of a coupled oscillator. Show which laws are easy for SR (inverse-square laws — short, clean) and which are hard (coupled angular momentum with constraints — require many operations). The process of watching evolution find `1/r²` is mesmerizing.
- **Demo:** Input any dataset (planet data, pendulum, spring). Select allowed mathematical operators. Watch expression trees evolve and simplify. Fitness vs. generation plot.
- **Tags:** `symbolic-regression` `AI-Feynman` `Newtons-law` `machine-learning-physics` `genetic-programming` `interpretable-ML` `physics-discovery` `dimensional-analysis`
- **Thumbnail:** A terminal output window showing `F = G * m1 * m2 / r^2` emerging from raw data columns. "THE AI WROTE THIS."

---

## S5·E45 — "I Gave a Robot One Rule: Don't Fall. It Learned Everything Else."

- **Alt title:** "Deep RL From Scratch: Training a Physics Agent in Your Own Simulation"
- **Difficulty:** 8/10 · **Prereq:** E41 (differentiable sim + gradient thinking) + Season 2 physics engine
- **Hook:** A pole balanced on a cart — random jittering at episode 1, perfect balance by episode 200. The learning happens live on screen; you watch the reward curve grow in real time.
- **The break (bug):** Sparse reward (±1 only for fall/survival) gives almost no gradient signal in early training — episodes last 2 frames before falling and the policy learns nothing. Reward shaping (add a continuous penalty for pole angle and cart position) accelerates learning enormously but, taken too far, teaches the agent to game the shaped reward rather than actually balance (e.g., oscillating violently in a way that keeps the shaped reward high but loses the sparse reward).
- **Concept introduced:** Reinforcement learning: state, action, reward, policy, value function. Policy gradient methods (REINFORCE, then PPO — Proximal Policy Optimization): compute the gradient of expected reward with respect to policy parameters and ascend it. Reward shaping — adding auxiliary reward terms — and the risks of unintended behavior it introduces (reward hacking).
- **Push it / wow moment:** The bipedal walker — a two-legged rigid body simulated with the Season 2 engine, trained to walk via PPO. Episode 1: immediate collapse. Episode 50: crawling. Episode 200: shuffling. Episode 500: upright, stable walking gait that emerges with no motion capture, no reference trajectory — just reward.
- **Demo:** Watch RL training live. Adjust reward shaping weights. Pause training and manually test the current policy. Resume. Inject noise into the simulation to test robustness.
- **Tags:** `reinforcement-learning` `CartPole` `PPO` `physics-simulation` `javascript` `deep-RL` `reward-shaping` `policy-gradient` `bipedal-locomotion`
- **Thumbnail:** Left: pole falling at episode 1. Right: perfectly balanced at episode 200. "200 EPISODES. ONE REWARD SIGNAL."

---

## S5·E46 — "I Made a Neural Net That Simulates Fluids 100× Faster Than Physics"

- **Alt title:** "Neural Surrogates: When the AI Runs Faster Than the Laws It Learned"
- **Difficulty:** 9/10 · **Prereq:** E23 (stable fluids baseline) + E42 (PINNs / neural physics)
- **Hook:** A fluid simulation that takes 10 seconds per frame in Stam's solver. A neural network trained on that solver's output runs at 60 FPS — looking nearly identical until you push it outside the training distribution.
- **The break (bug):** A surrogate trained on a narrow range of Reynolds numbers extrapolates poorly outside that regime. At Re=200, the flow around a cylinder shows a beautiful Karman vortex street. At Re=2000 (not in training data), the neural surrogate produces smooth — but completely wrong — laminar flow. The surrogate doesn't know it doesn't know. Distribution shift is silent failure.
- **Concept introduced:** Neural surrogate models — neural networks trained to emulate a slow simulator. Training distribution and distribution shift — why a model accurate within its training domain can fail spectacularly outside it, and why this failure is *silent* (no error is raised; the output looks plausible). Uncertainty quantification for surrogates.
- **Push it / wow moment:** Hybrid simulation — use the neural surrogate where prediction uncertainty is low (estimated via ensemble disagreement or dropout), and fall back to the physics solver where uncertainty is high. The uncertainty estimate is a live heatmap overlay. In practice, the surrogate handles 95% of the domain and the solver handles 5% — but that 5% is exactly where it matters.
- **Demo:** Toggle neural vs. physics fluid. Reynolds number slider from 10 to 10,000. Watch the surrogate fail past its training boundary. The uncertainty heatmap overlay.
- **Tags:** `neural-surrogate` `fluid-simulation` `deep-learning` `scientific-ML` `JAX` `Reynolds-number` `distribution-shift` `fast-fluid` `uncertainty-quantification`
- **Thumbnail:** Neural fluid at 60fps vs. physics fluid at 1fps side-by-side. "100× FASTER. UNTIL IT ISN'T."

---

## S5·E47 — "I Let Evolution Design a Walking Robot. The Results Were Alien."

- **Alt title:** "Karl Sims Revisited: Evolving Creatures in Your Own Physics Engine"
- **Difficulty:** 8/10 · **Prereq:** E45 (RL as adjacent optimization) + E29 (rigid body engine)
- **Hook:** A population of randomly morphed rigid-body creatures evaluated purely on walking speed. Over 500 generations, the winning designs look like nothing in nature — multi-limbed alien forms that exploit physics loopholes no human designer would try.
- **The break (bug):** Without maintaining genetic diversity (a diverse initial population + mutation that preserves morphological variety), the genetic algorithm converges prematurely. All individuals become slight variants of whatever first-generation lucky individual happened to fall forward effectively — a local optimum of "plank that falls forward." Never discovers the good local optima (oscillating limbs, rotating appendages) that are objectively better.
- **Concept introduced:** Genetic algorithms — a population of candidate solutions, evaluated by a fitness function, with selection, crossover (recombination), and mutation. Fitness landscape — the function that maps genotype (genome) to phenotype (fitness). Premature convergence — the GA getting stuck in local optima due to insufficient genetic diversity.
- **Push it / wow moment:** Evolve separately for three environments: walking on flat ground, swimming in SPH fluid, jumping on a trampoline. Watch the winning morphologies change completely — flat bodies for swimming, springy legs for jumping, rolling masses for walking. The same evolutionary loop produces completely different solutions.
- **Demo:** Watch evolution live (all creatures simulated simultaneously in small panels). Click any creature to inspect its genome (joint angles, limb lengths, masses). Adjust mutation rate. Export the best creature as a GIF or a standalone simulation.
- **Tags:** `evolutionary-simulation` `genetic-algorithm` `Karl-Sims` `virtual-creatures` `rigid-body` `javascript` `physics-evolution` `artificial-life` `morphological-evolution`
- **Thumbnail:** An alien-looking multi-limbed creature mid-gallop. "EVOLUTION FOUND THIS IN 500 GENERATIONS."

---

## S5·E48 — "I Trained a Car to Drive a Track It Had Never Seen Before"

- **Alt title:** "Self-Driving Physics: Teaching a Simulated Car to Generalize From Scratch"
- **Difficulty:** 8.5/10 · **Prereq:** E45 (RL framework) + E14 (collision + vehicle physics)
- **Hook:** A simulated car with LIDAR-style ray sensors, trained only on simple oval tracks, driving a novel procedurally-generated track it has never seen — correctly navigating every turn.
- **The break (bug):** Training on a single fixed track causes the policy to overfit — it memorizes "always turn left at 3 seconds, always brake at the chicane" rather than reading sensor inputs. Evaluation on a new track fails immediately. Procedural variation during training (different track shape, curvature, friction each episode) forces the policy to generalize from sensor readings rather than memorizing track features.
- **Concept introduced:** Procedural environment generation as a regularization technique (domain randomization), curriculum learning (start with easy tracks, add complexity as the agent improves), and the generalization-specialization tradeoff in RL.
- **Push it / wow moment:** 100 cars training simultaneously on different procedurally-generated tracks in a single browser tab. Tournament selection: cars that complete the track fastest in the current generation are parents for the next. Watch the strategy evolve from random to careful.
- **Demo:** Draw your own track. Watch the trained car navigate it. Adjust car physics (mass, friction, engine power). The 100-car tournament training mode.
- **Tags:** `self-driving-simulation` `reinforcement-learning` `procedural-generation` `LIDAR` `curriculum-learning` `javascript` `domain-randomization` `RL-car` `generalization`
- **Thumbnail:** A glowing neon car navigating a complex hand-drawn track. "TRAINED FOR 30 SECONDS. DRIVES FOREVER."

---

## S5·E49 — "A Neural Net Drew the Soul of a Pendulum Without Being Told It Was a Pendulum"

- **Alt title:** "Hamiltonian Neural Networks: Teaching a Machine That Energy Is Conserved"
- **Difficulty:** 9/10 · **Prereq:** E43 (neural ODEs) + E04 (pendulum phase space)
- **Hook:** A network trained on random pendulum trajectories that — when probed — outputs a perfect phase portrait: closed ellipses inside the separatrix, open curves outside, the separatrix itself visible as a boundary. The network found the soul of the pendulum.
- **The break (bug):** A standard neural ODE trained on pendulum data learns only short-term dynamics. When extrapolated to 10× the training duration, trajectories slowly spiral inward or outward rather than closing. The network doesn't know energy is conserved — it just doesn't violate it much over short windows. Hamiltonian NN imposes energy conservation structurally: the network predicts the Hamiltonian H(q,p) directly, then derives dynamics via Hamilton's equations `q̇ = ∂H/∂p, ṗ = -∂H/∂q`. This guarantees conserved energy forever.
- **Concept introduced:** Hamiltonian Neural Networks (HNNs) — parameterize the Hamiltonian H(q, p) rather than the dynamics directly, then derive q̇ and ṗ from Hamilton's equations. The HNN is a physics-constrained architecture with energy conservation as an inductive bias. Compare to the standard neural ODE which uses no such structure.
- **Push it / wow moment:** HNN vs. standard neural ODE on long-time pendulum extrapolation. HNN's trajectories close perfectly (or nearly so) over thousands of cycles; ODE trajectories drift visibly within hundreds. Show the learned energy contours H(q,p) = const as a landscape — it looks exactly like the true pendulum Hamiltonian.
- **Demo:** Draw any starting point on the phase plane. Watch HNN-predicted trajectory. Visualize learned energy contours. Toggle HNN vs. neural ODE for the long-time extrapolation comparison.
- **Tags:** `Hamiltonian-neural-network` `phase-space` `symplectic` `energy-conservation` `JAX` `machine-learning-physics` `pendulum` `scientific-ML` `inductive-bias`
- **Thumbnail:** A perfect pendulum phase portrait with ellipses and separatrix. Caption: "LEARNED BY A NEURAL NET."

---

## S5·E50 — "A Creature Built From Scratch, Learning to Walk in a World Built From Scratch" *(Channel Finale)*

- **Alt title:** "Full-Stack Physics: From a Falling Ball to a Walking Robot in One Arc"
- **Difficulty:** 10/10 · **Prereq:** The entire channel.
- **Hook:** A bipedal creature — rigid-body engine from Season 2, contact forces from Season 3, trained with PPO from Season 5 — learning to walk through pure reward signal. No motion capture. No handcrafted gait. Just physics and reward.
- **The break (bug):** Compounding errors from every season's simulation approximation (integration error from S1, collision softening from S2, friction model from S3, surrogate inaccuracy from S5) make the sim-to-real gap *visible*: a gait learned in the simulator fails immediately when physics parameters shift even 10%. This is the honest final lesson: every approximation we made matters, and in the real world, the bill eventually comes due.
- **Concept introduced:** Full simulation pipeline integration — how each layer of approximation (integrator order, collision softening, friction model) contributes independently to total error. Sim-to-real transfer gap — why robots trained in simulation behave differently on real hardware, and current techniques to bridge the gap (domain randomization, system identification).
- **Push it / wow moment:** The final 2 minutes show the full channel arc: bouncing ball → spring → orbit → galaxy collision → turbulent fluid → black hole → quantum tunneling → walking robot. Every simulation built from the same three ideas — discrete integration, physical laws as constraints, numerical stability. One unbroken arc from Episode 1 to Episode 50.
- **Demo:** Control the creature in real time with keyboard. Shift ground friction, gravity, and limb masses — watch the policy adapt or fail. Export the final trained creature as a standalone browser game with its own HTML page.
- **Tags:** `bipedal-locomotion` `reinforcement-learning` `physics-simulation` `javascript` `deep-RL` `sim-to-real` `full-stack-physics` `physics-engine` `scientific-ML`
- **Thumbnail:** A glowing bipedal figure mid-confident stride on an infinite grid. In the background, tiny: a bouncing ball, a planet, a galaxy. "THE WHOLE CHANNEL BUILT THIS."

---

*Next:* [[Additional_Video_Ideas]] · [[Shorts_Ideas]] · [[_MOC_YouTube_Channel]]
