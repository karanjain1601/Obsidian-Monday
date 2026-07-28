---
title: "Radioactive Decay: Why Half-Life Is Exactly Half"
id: B015
difficulty: 1.5/10
prereq: "None"
concept: "Exponential decay N(t) = N₀·e^(−λt) from memoryless per-atom decay probability"
tags: [physics, nuclear, radioactive-decay, half-life, exponential, statistics, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Radioactive Decay: Why Half-Life Is Exactly Half

**Alt title:** "1000 Atoms Walk Into a Bar. After One Half-Life, 500 Leave."
**Difficulty:** 1.5/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Display a grid of 1024 glowing circles — atoms — arranged in a 32 × 32 array on screen. Each circle pulses gently, unstable. Hit "Start" — every second, roughly half of the remaining atoms flash and go dark. After second 1: ~512 remain. After second 2: ~256. After second 3: ~128. After second 4: ~64. The decay curve traces itself in real time in a panel below. It's geometric, halving each period, smooth and inevitable. Then make it strange: hover over one surviving atom after 5 half-lives. Ask: "Does this atom know it's old? Does it know 31 out of 32 of its neighbors have already decayed? Is it 'due' to decay?" Cut to a graph: the probability of this atom decaying in the next second is exactly the same as it was at t=0. It has no memory. It is ageless. The half-life works not because atoms "choose" when to die based on age — it works because statistics over millions of memoryless random events produces an exponential curve. The half-life is constant because each atom's probability is constant. This is one of the most philosophically striking facts in physics: radioactive atoms do not age. Let's code this from scratch and watch the math emerge.

## The Naive Attempt

Build the simplest possible decay model: a fixed-rate subtraction. If we start with N₀ = 1000 atoms and the half-life should be 10 seconds, then we need 500 atoms to decay in the first 10 seconds — so decay rate = 50 atoms per second. In code: `N -= 50 * dt`. This is the linear model. Plot it. It looks plausible for the first half-life — indeed 500 atoms remain after 10 seconds. But it's structurally wrong in a way that will become obvious. Continue running: 500 atoms at t=10, 250 at t=20, 0 atoms at t=30. Wait — at t=30, the linear model reaches exactly zero. Real radioactive materials never reach zero (mathematically — they approach zero asymptotically). More critically, between t=20 and t=30 the model predicts 250 atoms decaying from a pool of 250 — the "half-life" for this interval is 10 seconds, same as before. That actually sounds right! But look more carefully: between t=0 and t=5, the model predicts 250 atoms have decayed from 1000. The "half count" is reached in 5 seconds, not 10. The half-life is not constant — it appears to be 10 seconds only at exactly the right intervals. This linear model does not have a constant half-life in the meaningful sense. Time it: ask "at what time do we first hit N = 250?" Linear model says t=15. Real exponential decay says t = 2 × T½ = 20. The linear model is off by 25%, and the error worsens for smaller fractions.

## The Moment of Failure

Present the definitive failure case: run two simulations from the same N₀ = 1000, same linear decay rate. They are identical — deterministic. In real radioactive decay, two samples of equal size show statistical fluctuations around the same curve — they're not identical. Real radioactive atoms choose randomly whether to decay each second — this randomness is fundamental, not a measurement limitation. The linear model has no randomness at all. This matters enormously: at small N, the fluctuations are huge. A sample of 10 atoms might have 3, 4, or 5 decay in the first half-life — not always exactly 5. The linear model always gives 5. At large N, the fluctuations average out and the smooth curve emerges — but the mechanism is different. Also show: the linear model has a definite "death time" — all atoms are gone at t = N₀/rate. Real samples are never completely gone. Show a plot with 4 zoom levels: N=1000 (smooth exponential), N=100 (slightly bumpy), N=10 (clearly random), N=1 (this single atom either decays immediately or lives forever — the concept of "half-life" only applies statistically to large populations). The linear model fails all of these.

## Why It Broke — The Physics

Nuclear decay is a quantum mechanical tunneling process. A nucleus in an unstable energy state spontaneously transitions to a lower-energy state by emitting a particle (alpha, beta) or photon (gamma). The rate of this process is governed by quantum mechanics and depends on the nuclear structure — specifically the height and width of the energy barrier the particle must tunnel through. Crucially: the nucleus has no internal clock. The quantum state of an undecayed nucleus at t=100 seconds is identical to its quantum state at t=0. The nucleus is in the same metastable state. It has the same tunneling probability per unit time. This is the **memoryless property** of exponential distributions. Mathematically: for each atom, the probability of decaying in a small time dt is λ·dt, where λ (the decay constant) is fixed. This gives:

**dN/dt = −λN**

**Solution: N(t) = N₀ · e^(−λt)**

**Half-life: T½ = ln(2) / λ ≈ 0.693 / λ**

After one half-life, N = N₀ · e^(−λ · ln(2)/λ) = N₀ · e^(−ln 2) = N₀/2. Exactly half remain, always, regardless of how many have already decayed. The relationship between the decay constant and half-life: λ = ln(2)/T½. For C-14: T½ = 5730 years, λ = 1.21 × 10⁻⁴ per year. For U-238: T½ = 4.47 × 10⁹ years, λ = 1.55 × 10⁻¹⁰ per year. For Polonium-214: T½ = 164 microseconds, λ = 4,230 per second.

## The One Concept

**Radioactive decay: N(t) = N₀ · e^(−λt), with T½ = ln(2)/λ**

**Formal definition:** Each radioactive nucleus has a fixed probability λ (per unit time) of decaying, independent of how long it has already existed (memoryless property). The expected number of decays per unit time is proportional to the current population N. This produces the differential equation dN/dt = −λN, whose solution is the exponential decay law N(t) = N₀e^(−λt). The half-life T½ = ln(2)/λ is the time for exactly half the current population to decay, regardless of the current population size.

**The memoryless property:** If you observe an atom that has not yet decayed for time t₀, the probability that it survives another time t is the same as if it had just been created. Formally: P(T > t₀ + t | T > t₀) = P(T > t). This is unique to the exponential distribution — it's the only memoryless continuous distribution. This means radioactive atoms are truly "ageless" — a 10-million-year-old undecayed nucleus has exactly the same decay probability per second as a freshly formed one.

**Statistical vs individual behavior:** The exponential curve describes the expected behavior of a large ensemble. Individual atoms are random — each has a probability λ·dt of decaying in any small interval dt. For N ≫ 1, the fluctuations are proportional to √N (shot noise), which is a small fraction of N. As N decreases, the fluctuations become more prominent relative to the total. The smooth exponential emerges from randomness — it's a law of large numbers result.

**Real-world examples:**
1. **Radiocarbon dating (C-14):** Cosmic rays produce C-14 in the atmosphere at a roughly constant rate. All living things absorb C-14 through the carbon cycle. When an organism dies, it stops absorbing C-14 and the C-14 decays with T½ = 5730 years. Measuring the ratio of C-14 to C-12 in a sample gives its age. Range: 0–50,000 years (beyond that, C-14 concentration is too low to measure accurately).
2. **Nuclear medicine:** Technetium-99m (T½ = 6.01 hours) is used in medical imaging (PET/SPECT scans). The short half-life means it delivers enough radiation to image in a few hours, then decays quickly to a safe level. Longer-lived isotopes would continue irradiating the patient.
3. **Geological dating (U-Pb):** Uranium-238 decays through a chain of 14 steps to Lead-206 with an effective half-life of 4.47 billion years. Measuring U-238/Pb-206 ratios in zircon crystals (which incorporate U but not Pb when they crystallize) gives the age of the rock. This is how we know Earth is 4.54 billion years old.

## The Fix

Replace the linear constant-rate model with per-atom stochastic decay:

```javascript
function simulateDecay(atoms, lambda, dt) {
  // lambda: decay constant (probability per unit time per atom)
  // dt: time step in the simulation
  const decayProbability = lambda * dt; // P(decay in this timestep)
  
  let survivors = [];
  let decayed = 0;
  
  for (const atom of atoms) {
    if (Math.random() < decayProbability) {
      // This atom decays this timestep
      decayed++;
      // Optionally: emit a decay particle, update energy, etc.
    } else {
      survivors.push(atom);
    }
  }
  
  return { survivors, decayed };
}

// Usage: each frame:
const result = simulateDecay(atoms, LAMBDA, dt);
atoms = result.survivors;
// Note: average decays per timestep ≈ lambda * N * dt (correct for large N)
// Individual timesteps are random — fluctuations emerge naturally
```

For large N (1000 atoms): the curve is smooth, barely distinguishable from the deterministic exponential. For small N (10 atoms): visibly noisy, jagged. Same lambda, same physics, different statistical regime. The half-life measured from either is the same on average. Show this by running 100 simulations of N=10 atoms, overlaying all curves — they scatter wildly individually but average to the perfect exponential.

## The Wow Moment — Push It

Build two extended demos. First: **Carbon-14 dating simulation**. Start with an organism that just died — C-14/C-12 ratio = atmospheric ratio (1.2 × 10⁻¹²). Run the decay clock. At 5730 years: ratio is 0.6 × 10⁻¹². At 11,460 years: 0.3 × 10⁻¹². Now work backward: show an archaeologist finding a bone. Measure (simulated) C-14 ratio. Solve for age: t = −T½ / ln(2) × ln(ratio/ratio₀). The simulation adds realistic measurement noise — show how the uncertainty in age grows with age (older samples are harder to date precisely because the remaining C-14 is so tiny). Draw the uncertainty bands. At 50,000 years, the error bars are ±2000 years.

Second: **nuclear chain reaction**. Change the physics: each decay now releases 2.5 neutrons (the average for U-235 fission). Each neutron has a probability of triggering another fission. If the fission probability per neutron is high enough (supercritical), the population grows exponentially — explosive. If too low (subcritical), it fizzles. At exactly critical: constant power. Show the three regimes. Watch the simulation go exponential and "explode" (the counter races to millions in milliseconds). Then show how adding a moderator or control rods adjusts the fission probability, controlling whether the system is super/sub/critical. This is a nuclear reactor vs a bomb — same physics, different engineering constraints around the branching ratio.

## The Interactive Demo

Canvas simulation at 1000 × 650 px. Upper panel: atom grid visualization. Lower panel: decay curve and controls.

**N₀ slider** (10 to 10,000, logarithmic): Initial number of atoms. At N=10: individual atom behavior visible, noisy curve. At N=10,000: smooth exponential. Grid automatically adjusts layout to show all atoms.

**λ (decay constant) slider** (0.01 to 2.0 per second): Controls decay rate. Half-life T½ = ln(2)/λ displayed in real time. Presets: C-14 (slow, scaled for visualization), I-131 (medium), Po-214 (fast).

**Log/linear toggle:** Y-axis of the decay curve. Exponential decay → straight line on log scale. Linear decay (the wrong model) → curve on log scale. A visual proof of which model is correct.

**Half-life marker:** Dashed horizontal line at N₀/2 and vertical lines at T½, 2T½, 3T½. Shows how N halves exactly at each marker, regardless of current N.

**Multiple runs overlay:** "Run 10 simulations" button. Overlays 10 decay curves from the same initial conditions. For large N: curves cluster tightly. For small N: curves scatter wildly. Shows the statistical nature clearly.

**Model comparison mode:** Run linear model (wrong) and exponential model (correct) simultaneously in different colors. The divergence after 2–3 half-lives is dramatic.

**Chain reaction mode:** Toggle to increase branching factor above 1.0. Watch exponential growth. Critical slider: adjust branching right at 1.0 and watch the population hold steady. Above 1: runaway. Below 1: decay. At 1.0: criticality (steady state).

**C-14 dating sub-mode:** Set initial ratio, run decay, present measured "sample" with noise, ask user to estimate age. Score based on accuracy.

## Production Notes

**Runtime estimate:** ~13–15 minutes. Hook (1.5 min), Naive code (2.5 min), Failure (1.5 min), Physics (3 min), Fix (2 min), Wow demos (3 min), Interactive (1.5 min).

**Screen layout:** This episode benefits from a larger canvas panel — the atom grid is visually central. Use 65/35 canvas/code split. The atom grid should use a dark background with small glowing circles that flash and go dark when they decay. The decay curve panel below is essential — it should update in real time during the main simulation.

**Animations to prepare:** The quantum tunneling diagram explaining why decay is random (wave function penetrating a potential barrier). The carbon-14 atmospheric production cycle (cosmic rays → C-14 → absorbed by organisms → fossilizes → decays). Timeline showing famous radiocarbon dates: Turin Shroud, Otzi the Iceman, Chauvet cave paintings.

**Key zoom moments:** (1) Zoom into a single surviving atom after 5 half-lives, with the probability readout showing the same λ·dt as t=0. This is the philosophical punch of the episode. (2) The chain reaction going exponential — zoom out as the counter races past 1 million. (3) The N=10 vs N=1000 comparison — the jagged noise of small-N next to the smooth large-N curve.

**B-roll:** Geiger counter audio over footage of mineral samples. Carbon-14 dating laboratory (AMS facility if possible). A nuclear plant control room. X-ray or PET scan imagery. Time-lapse of a glow-in-the-dark watch dial (radioluminescence, historically from radium).

**Physical props for talking-head:** A Geiger counter with a radioactive source (uranium glass if legal locally, or a smoke detector americium source at safe distance). Show the random clicking — emphasize that each click is an individual random decay event, not a steady rhythm.

## Tags
`physics` `nuclear` `radioactive-decay` `half-life` `exponential` `statistics` `javascript` `canvas` `beginner`

## Thumbnail

A 10 × 10 grid of glowing atoms, split diagonally: upper-left half shows 50 bright glowing circles (alive), lower-right half shows 50 dimmed gray circles (decayed). Bold text overlay: "HALF-LIFE: WHY ALWAYS EXACTLY HALF?" Smaller text: "The atoms don't know. Statistics does." A decay curve traces the bottom of the image from top-left to bottom-right — the classic exponential shape. The grid visual is immediately recognizable as a simulation and triggers the "wait, why does it always halve?" question. Color palette: deep black background, cyan/green glowing atoms, gray decayed atoms. The mathematical precision of "exactly half" combined with the randomness implied by the grid scatter creates productive tension in the viewer. Emotion: "I thought I understood this. I was wrong."
