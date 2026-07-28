---
title: "Sand Jumps to Specific Patterns on a Vibrating Plate (Chladni Patterns)"
id: B025
difficulty: 2.5/10
prereq: "B022 — Why Guitar Strings Have Harmonics (Standing Waves in Code)"
concept: "2D plate resonant modes — sand accumulates at nodal lines of standing wave solutions"
tags: [physics, resonance, chladni, standing-waves, modes, plate-vibration, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Sand Jumps to Specific Patterns on a Vibrating Plate (Chladni Patterns)

**Alt title:** The Geometric Secrets Hidden in Sound (Sand Patterns at Resonance)
**Difficulty:** 2.5/10 | **Prereq:** B022 — Standing Waves

---

## Opening Hook (0:00–1:00)

Take a thin square metal plate, about 30 cm × 30 cm. Cover it evenly with fine sand or salt. Hold a violin bow to one edge and begin to draw it slowly — nothing happens. Speed up, sweep through a range of pitches — still nothing significant, just random jiggling. Then the bow hits a resonant frequency: the sand suddenly, decisively, almost violently reorganizes itself into a perfect four-pointed star pattern with clean straight diagonals. The movement is rapid — within half a second, the sand has evacuated from the vibrating regions and accumulated in precise lines. Lift the bow — the pattern freezes. Resume the same frequency — the pattern reconstructs exactly. Move slightly off frequency — chaos. Return — the star.

Then hit a second resonant frequency: the sand forms a completely different pattern — concentric rings, or a grid, or a pattern of nested squares. A third frequency: a complex mandala of curved lines. Each resonant frequency has a unique, reproducible geometric fingerprint. Show 6–8 different patterns in rapid succession: star, grid, rings, diagonals, complex nested shapes. The patterns grow more intricate as frequency increases. This was first documented by Ernst Chladni in 1787 using a violin bow — Napoleon Bonaparte watched a demonstration and was so impressed he funded Chladni's research tour.

Cut to the simulation: "We are going to code this from scratch in JavaScript." Show the 2D standing wave on a square plate — the colored surface of the plate where red means maximum positive displacement, blue means maximum negative, and white marks the nodal lines where displacement is always zero. Sand particles spawn randomly on the plate and drift toward the white regions over time — exactly replicating the real experiment.

## The Naive Attempt

Set up a 2D grid of oscillating particles, all vibrating uniformly in the z-direction (perpendicular to the plate). Model the vibration as a single spatially uniform sinusoid: every grid point oscillates at amplitude A regardless of position.

```javascript
// Naive model: uniform amplitude everywhere
for (let i = 0; i < W; i++) {
  for (let j = 0; j < H; j++) {
    const z = A * Math.cos(omega * t);  // same for every point
    grid[i][j].z = z;
  }
}
```

Simulate sand particles: at each time step, kick every particle with a random force proportional to the local vertical acceleration `z̈ = −ω²·z`. Since z is the same everywhere, every particle receives the same amplitude of random kick regardless of position. After many time steps, the sand distributes uniformly by a random walk. No pattern forms. If anything, the random kicks are stronger at high amplitude, so sand tends to drift slightly toward the less-kicked regions near the edges where it is more rigid, but the effect is diffuse and produces no geometric pattern.

Add a visual: color the plate surface red/blue based on z. Since every point has the same displacement at the same time, the plate flashes uniformly red, then uniformly blue, then uniformly red — no spatial structure. There is no horizontal variation in amplitude. There are no nodal lines — every point vibrates identically. Sand has no reason to prefer any location over any other.

## The Moment of Failure

Run the simulation for 30 seconds of simulated time with 500 sand particles. The result: sand distributed roughly uniformly across the plate surface, with perhaps slight accumulation near edges due to boundary effects, but nothing resembling a geometric pattern. The plate color display shows monotonic uniform flashing — a single color covering the entire plate at each moment.

Try the other extreme: make the amplitude very high to see if any pattern emerges. Result: sand bounces violently and evenly in all directions, ending up even more uniformly distributed. There are no attractors, no preferred positions, no geometry. The simulation is physically wrong in a fundamental way — it treats the plate as if every point vibrates the same amount, which is true for a rigid piston but not for a flexible plate. A real metal plate vibrates in a complex spatial pattern (a "mode shape") where some regions move a lot (antinodes) and some don't move at all (nodes). The model completely omits the spatial structure of plate vibration.

Show side by side: real Chladni plate photo (beautiful star) vs naive simulation result (uniform gray distribution). The contrast makes the failure unmistakable and motivates the need for proper plate mode equations.

## Why It Broke — The Physics

A flexible plate can vibrate in many different "modes" — spatial patterns of oscillation. Each mode is a solution to the 2D wave equation (biharmonic equation for a plate):

**∂²z/∂t² = −D/ρh · ∇⁴z**

where D is the plate flexural rigidity, ρ is density, and h is thickness. For a simply-supported (clamped-edge) square plate of side L, the solutions are separable:

**z_mn(x, y, t) = A · sin(mπx/L) · sin(nπy/L) · cos(ω_mn · t)**

where m and n are positive integers (mode numbers) and the resonant frequencies are:

**ω_mn = (π²/L²) · √(D/ρh) · (m² + n²)**, so **f_mn = (π/(2L²)) · √(D/ρh) · √(m² + n²)**

The nodal lines — where z_mn = 0 for all t — occur where sin(mπx/L) = 0 or sin(nπy/L) = 0. For a square plate, these are grids of straight lines at x = L/m, 2L/m, ..., (m−1)L/m and y = L/n, ..., (n−1)L/n. Modes with m = n produce diagonal patterns; modes where m ≠ n produce rectangular grid patterns with different horizontal and vertical spacings.

The key physical insight: sand grains on the plate receive random kicks proportional to the local acceleration amplitude |ω²·z_mn(x,y)|. At nodal lines, the amplitude is zero — no kicks. Sand grains undergo a biased random walk, drifting over time toward regions of lower excitation. At equilibrium, sand accumulates at the nodal lines, exactly painting the geometric mode pattern. The brighter (higher acceleration) the region, the more energetically sand is expelled from it.

## The One Concept

Chladni patterns are the visual fingerprint of 2D standing wave modes on a vibrating plate. They directly reveal the nodal lines — the set of points where vibration amplitude is permanently zero. Sand grains are expelled from high-amplitude regions and accumulate at nodal lines through a random walk with drift toward zero-amplitude zones. Each resonant frequency of the plate has a unique mode shape and therefore a unique sand pattern.

**Physical intuition:** Think of the plate as having hills and valleys of vibration amplitude. Sand is like water — it flows downhill toward the calm areas (nodes) and cannot stay on the vibrating peaks (antinodes). The geometry of the hills and valleys is determined by the mode numbers (m, n), which are constrained by the plate's boundary conditions and dimensions.

**Key equations:** Mode shapes: z_mn = A·sin(mπx/L)·sin(nπy/L)·cos(ω_mn·t). Resonant frequencies: f_mn ∝ √(m² + n²)/L². For a circular plate (Chladni's original experiment used circular plates too), the modes involve Bessel functions — the nodal patterns are concentric rings and diameters, producing the classic circular Chladni figures.

**Real-world examples:**
1. **Luthier acoustics:** Violin makers (luthiers) use Chladni patterns to test violin plates during construction. The nodal pattern of the top plate at its resonant frequencies affects the instrument's tone — famous luthiers like Antonio Stradivari empirically optimized these patterns to achieve the famous Stradivarius sound. Modern acoustic engineers replicate this using laser Doppler vibrometry.
2. **Architectural acoustics:** Resonant modes of flat surfaces (walls, ceilings, floors) determine which frequencies a room amplifies or attenuates. A flat, rectangular room has simple Chladni-like resonances that create boomy bass buildup at specific frequencies. Diffusers and curved surfaces are designed to break up these modes.
3. **Noise vibration engineering:** Car panels, aircraft fuselages, and machine housings are tested for resonant modes using sand or laser scanning. Modes at frequencies matching engine rotation rates can cause fatigue failure. Engineers add damping or change geometry to shift modes away from operating frequencies.
4. **Quantum mechanics:** The Schrödinger equation for a particle in a 2D box is mathematically identical to the wave equation for a plate. The standing wave modes ψ_mn(x,y) have the same form as z_mn(x,y). Nodal lines of quantum wavefunctions correspond to zero probability density — regions where the particle cannot be found. Chladni patterns are a visual, macroscopic demonstration of quantum mechanical mode structure.

## The Fix

Implement the correct plate mode shape for mode (m, n). Pre-compute the amplitude map:

```javascript
const m = 2, n = 3; // mode numbers (adjustable via UI)
const amplitudeMap = new Float32Array(W * H);

for (let i = 0; i < W; i++) {
  for (let j = 0; j < H; j++) {
    const x = i / W; // normalized 0 to 1
    const y = j / H;
    amplitudeMap[i + j*W] = Math.sin(m * Math.PI * x) * Math.sin(n * Math.PI * y);
  }
}
```

For the plate visualization, color each pixel by `amplitudeMap[i+j*W] * Math.cos(omega * t)`: red for positive, blue for negative, white for zero. The nodal lines (white) are instantly visible as the geometric pattern.

For sand particles, apply drift toward low-amplitude regions on each frame:

```javascript
for (let p of sandParticles) {
  const localAmp = Math.abs(sampleAmplitude(p.x, p.y));
  // Random kick proportional to local amplitude
  p.vx += (Math.random() - 0.5) * localAmp * kickStrength;
  p.vy += (Math.random() - 0.5) * localAmp * kickStrength;
  // Friction (models air resistance and plate surface)
  p.vx *= 0.95; p.vy *= 0.95;
  p.x += p.vx; p.y += p.vy;
  // Bounce off plate edges
  if (p.x < 0 || p.x > W) p.vx *= -1;
  if (p.y < 0 || p.y > H) p.vy *= -1;
}
```

Over 5–10 seconds of simulation time, the sand particles drift into the nodal line regions and accumulate there, gradually revealing the geometric pattern. Run at full speed (60 fps) with a "time lapse" button to jump to the converged state instantly. The result matches the real Chladni plate experiment exactly. Switch to mode (1,2) and watch the sand reorganize into a different pattern — two vertical regions separated by a horizontal nodal line.

## The Wow Moment — Push It

Display a gallery of 20 Chladni modes for the square plate, arranged in a grid ordered by mode number. Mode (1,1) shows a single antinode region with four edge nodes — the simplest pattern. Mode (2,2) shows a grid of four squares. Mode (3,3) shows nine squares. Mode (2,3) shows an asymmetric grid. Higher modes produce increasingly intricate patterns with 5, 6, 7 nodal lines. Show all 20 simultaneously — it looks like a gallery of abstract art, each piece a mathematically exact construction. The increasing complexity as mode numbers rise is visually compelling and demonstrates that complexity in nature arises from simple quantization rules applied at larger scales.

Then animate a continuous frequency sweep from f(1,1) to f(5,5). Watch the sand reorganize from one mode to the next as the frequency hits each resonant value. Between resonant frequencies, the sand pattern is chaotic — no stable pattern forms. At each resonant frequency, the sand locks into its characteristic geometry within 2–3 seconds. The sweep creates a sense of musical progression through geometric forms — a visual symphony.

Finally, switch to the circular plate. For a circular plate with fixed edges, the mode shapes involve Bessel functions: z_mn(r, θ) = J_m(k_mn·r)·cos(mθ). The patterns include concentric rings (m=0), diameters (n=0), and combinations. These are the true Chladni patterns from his 1787 experiments. Show these side by side with real historical Chladni plate photographs and laser vibrometry measurements — the match is exact.

## The Interactive Demo

Real-time JavaScript simulation with sand particle physics and mode shape visualization.

**Controls:**
- **Frequency slider:** Drag through the frequency spectrum. Automatically highlights resonant frequencies with a snap behavior. Off-resonance positions show chaotic sand motion; on-resonance shows pattern formation.
- **Mode selector (m, n):** Directly select any mode combination from (1,1) to (6,6). Instantly switches the amplitude map and shows the mode shape color visualization. Sand takes a few seconds to reorganize.
- **Sand particle count:** 50 to 2,000 particles. Higher count shows the pattern more clearly but is slower to compute.
- **Plate shape selector:** Square (sin functions), circular (Bessel functions), triangular (more complex). Each has its own family of patterns.
- **Frequency sweep animation:** Automatically sweeps from f_min to f_max, pausing at each resonant frequency for 3 seconds. Watch the full gallery in sequence.
- **Slow-motion view:** Pause and step frame by frame through the sand particle dynamics. See individual grains being kicked by amplitude gradient and drift toward nodes.
- **Node line overlay:** Toggle the exact mathematical nodal line positions (white lines) overlaid on the sand pattern for comparison.
- **3D displacement view:** Switch from top-down sand visualization to a 3D isometric view of the plate surface z(x,y,t), showing the actual physical displacement amplitudes.
- **Real vs simulated:** Show a real Chladni plate photo in one corner for comparison with the simulation output.
- **Time lapse button:** Fast-forward 60 seconds of sand dynamics to immediately show the converged pattern.

## Production Notes

**Runtime target:** ~13 minutes. Hook: 1.5 min. Naive code: 2 min. Failure: 1 min. Physics: 3 min. Fix: 2.5 min. Wow moment: 2 min. Demo: 1 min.

**Screen layout:** Full-canvas view for most of the episode, with code editor in a side panel during the coding segments. The sand simulation is visually the star — give it at least 70% of screen real estate. When showing the gallery of 20 modes, split the canvas into a 4×5 grid.

**Animations to pre-render:** (1) Real Chladni plate experiment footage (freely available on YouTube — multiple channels have high-quality demonstrations), (2) 3D animated plate cross-section showing z(x,y,t) surface with mode shape, (3) comparison table of plate mode shapes vs quantum particle-in-a-box wavefunctions, (4) historical Chladni 1787 illustration from his book "Entdeckungen über die Theorie des Klanges."

**Key moments to zoom:** The instant the sand first starts to organize at a resonant frequency (add a subtle flash effect at t=0 of each resonant frequency hit), the gallery reveal of all 20 modes, and the match with real Chladni plate photographs.

**B-roll:** Real Chladni plate demonstration with violin bow, laser Doppler vibrometry of a violin plate, modern guitar top plate tap-tuning footage.

**Gotcha to address:** The "free edge" vs "clamped edge" boundary condition changes the mode shapes slightly. For a free-edge plate (like a real Chladni plate held at a point, not along edges), the modes are more complex — but the qualitative behavior (nodal line patterns, sand accumulation at nodes) is identical. Acknowledge this simplification and note that the simulation uses the simpler clamped-edge modes for clarity.

## Tags

`physics` `resonance` `chladni` `standing-waves` `modes` `plate-vibration` `javascript` `canvas`

## Thumbnail

A square metal plate covered with fine white salt/sand, photographed from directly above in crisp natural light. The sand has formed a perfect 4-pointed star pattern — clean diagonal nodal lines meeting at the center with precise geometric symmetry — against a dark plate surface. The contrast between bright white sand and dark metal is striking. Superimposed on the lower right corner, a small inset canvas shows the corresponding simulation: a blue/red color map of the plate with white nodal lines matching the sand pattern exactly. Text overlay at the top: "WHY SAND MAKES PERFECT PATTERNS" in bold white. The star pattern is immediately eye-catching — it looks artistic and geometric, triggering the "that can't be natural" reaction that makes people stop scrolling. The inset simulation preview establishes the video's coding angle without overcomplicating the thumbnail. The emotion is wonder: this looks too precise to happen spontaneously, but it does.
