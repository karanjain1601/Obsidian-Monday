---
title: "Why Galaxies Rotate Wrong (Dark Matter Evidence)"
id: B050
difficulty: 2.5/10
prereq: "B018 — Orbital Mechanics / Kepler's Laws, B049 — Hubble's Law"
concept: "Observed galaxy rotation curves are flat (v ≈ const) rather than Keplerian (v ∝ 1/√r). A spherical dark matter halo with M_DM(r) ∝ r provides extra enclosed mass that exactly compensates, producing flat rotation curves as a natural consequence."
tags: [physics, dark-matter, rotation-curves, galaxy, gravity, cosmology, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why Galaxies Rotate Wrong (Dark Matter Evidence)

**Alt title:** "Something Invisible Holds the Galaxy Together (And It's Not Dark Energy)"
**Difficulty:** 2.5/10 | **Prereq:** B018 — Orbital Mechanics / Kepler's Laws | B049 — Hubble's Law

---

## Opening Hook (0:00–1:00)

Open with a beautiful top-down image of the Andromeda galaxy: a sweeping spiral, glowing core, spiral arms extending to the edge of the image. Ask: how fast do the stars on the edge rotate compared to the stars near the center? For the solar system, the answer from Kepler's third law is clear: Mercury orbits at 48 km/s; Neptune at 5 km/s. Outer planets are slow. This makes sense — they're further from the gravitational source.

Now show the Milky Way rotation curve from actual stellar and gas measurements: plot the measured orbital speed of objects at increasing distances from the galactic center, from the inner bulge at 1 kpc out to 50 kpc in the outer halo. The speed rises initially (expected, as you're moving through more enclosed mass), peaks around 5 kpc at ~220 km/s — and then stays flat all the way out to the edge of the visible disk and beyond. Outer stars orbit at the same speed as inner stars. This is the opposite of what happens in the solar system.

Pull up the slide from Vera Rubin's 1970 paper — the woman who made this observation irrefutable and was famously not given the Nobel Prize for it (though she should have been). Her data on spiral galaxies showed flat rotation curves across dozens of different galaxies. The flatness was not a measurement error. It was a systematic feature of all spiral galaxies. Something invisible was providing extra gravitational mass — and that mass grew with radius in exactly the right way to keep rotation speeds flat.

---

## The Naive Attempt

Build a galaxy rotation curve calculator using only visible mass — the stars and gas that are observed.

```javascript
// Galaxy mass model: visible components only
const GALAXY = {
  // Central bulge: Hernquist profile
  M_bulge: 1e10 * SOLAR_MASS,   // 10 billion solar masses
  a_bulge: 1e3 * PARSEC_IN_M,   // scale radius 1 kpc
  
  // Disk: exponential profile
  M_disk:  5e10 * SOLAR_MASS,   // 50 billion solar masses
  h_disk:  3e3  * PARSEC_IN_M,  // scale length 3 kpc
};

// Enclosed mass from Hernquist bulge: M(r) = M * r² / (r+a)²
function bulgeMass(r) {
  const a = GALAXY.a_bulge;
  return GALAXY.M_bulge * r*r / ((r+a)*(r+a));
}

// Enclosed mass from exponential disk (Bessel function approximation)
function diskMass(r) {
  // For a thin exponential disk, M_enc(r) ≈ M_disk * (1 - exp(-r/h)(1 + r/h))
  const h = GALAXY.h_disk;
  const x = r / h;
  return GALAXY.M_disk * (1 - Math.exp(-x) * (1 + x));
}

// Circular velocity: v(r) = sqrt(G * M_total(r) / r)
function rotationVelocity(r) {
  const M_total = bulgeMass(r) + diskMass(r);
  return Math.sqrt(G * M_total / r);
}

// Plot rotation curve: evaluate at r = 0.5 to 50 kpc
const radii = [];
const velocities = [];
for (let r_kpc = 0.5; r_kpc <= 50; r_kpc += 0.5) {
  const r = r_kpc * PARSEC_IN_M * 1e3;
  radii.push(r_kpc);
  velocities.push(rotationVelocity(r) / 1e3);  // convert to km/s
}
```

Plot this curve. It rises from near zero, peaks at about 5 kpc with a maximum of ~150 km/s, then falls as a smooth Keplerian 1/√r descent. By 30 kpc, the predicted velocity is about 60 km/s. Textbook Newtonian gravity applied to measured visible mass.

---

## The Moment of Failure

Overlay the actual observed data on the predicted curve. The simulated curve peaks at ~150 km/s and falls to ~60 km/s at 30 kpc. The observed data points sit at ~220 km/s for almost the entire range from 5 kpc to 50 kpc — virtually flat. The discrepancy at 30 kpc: predicted 60 km/s, observed 220 km/s. The observed speed is 3.7 times faster than predicted. Since kinetic energy goes as v², the stars in the outer galaxy have ~14 times more orbital kinetic energy than visible mass can account for.

This is not a small correction. The galaxy's outer disk contains stars orbiting faster than Newtonian gravity from visible mass can explain. By conservation of energy and force balance, either:
1. There is far more mass than what is visible, or
2. Newtonian gravity works differently at galactic scales.

Both options are seriously considered. Option 1 requires about 5 times more mass than visible — the dark matter hypothesis. Option 2 has produced MOND (Modified Newtonian Dynamics), which modifies the gravitational force law below a critical acceleration a₀ ≈ 1.2×10⁻¹⁰ m/s². Both fit rotation curves. Dark matter is favored because it also explains: galaxy cluster dynamics, gravitational lensing, and the large-scale structure of the universe.

Display the discrepancy prominently: show predicted curve in red, observed data points in white, and the gap between them shaded in bright blue — labeled "MISSING MASS." The visual message is unambiguous: there is something enormous and invisible that the simulation is missing.

---

## Why It Broke — The Physics

**What dark matter is:**  An unknown form of matter that interacts gravitationally but does not emit, absorb, or reflect electromagnetic radiation — hence "dark." It is not antimatter (antimatter photons), not black holes (too massive and concentrated), not ordinary atoms (constrained by Big Bang nucleosynthesis to be <5% of critical density). The leading particle physics candidate is the WIMP (Weakly Interacting Massive Particle) — a stable particle with mass 10–1000 times the proton mass that interacts only through gravity and the weak force. No WIMP has ever been detected directly.

**The distribution of dark matter:** In galaxies, dark matter forms a roughly spherical **halo** extending far beyond the visible disk. The density profile of the halo is described by the **NFW profile** (Navarro, Frenk & White, 1996), derived from N-body simulations of structure formation:

$$\rho_{NFW}(r) = \frac{\rho_s}{(r/r_s)(1+r/r_s)^2}$$

where ρ_s is a characteristic density and r_s is the scale radius (typically 20–30 kpc for a Milky Way-sized galaxy). At small r: ρ ∝ 1/r (central cusp). At large r: ρ ∝ 1/r³.

**Enclosed mass grows with radius:**

$$M_{NFW}(r) = 4\pi\rho_s r_s^3 \left[\ln\left(\frac{r_s+r}{r_s}\right) - \frac{r}{r_s+r}\right]$$

At large r (r >> r_s), this grows approximately as ln(r), which is slower than linear. But at intermediate r (r ~ r_s, where most of the disk lies), M_NFW(r) grows approximately linearly: M ∝ r. This means M(r)/r ≈ const → v = sqrt(GM/r) = const: the flat rotation curve.

**The isothermal sphere** is a simpler model that gives exactly flat rotation curves analytically: ρ(r) = ρ_0/(1+(r/r_c)²). The enclosed mass M(r) = 4πρ_0 r_c² · r (exactly linear in r for r >> r_c), giving exactly v = const = sqrt(4πGρ_0)·r_c.

**Why dark matter halos are spherical:** Unlike visible matter (which cools, dissipates energy, and collapses into a rotating disk), dark matter is collisionless — it doesn't interact except gravitationally. Without a way to dissipate angular momentum, it never collapses into a disk. It remains in a roughly spherical pressure-supported configuration — more like a stellar cluster than a rotating disk.

---

## The One Concept

**Dark matter halo** is the invisible, extended, roughly spherical mass distribution surrounding galaxies and galaxy clusters. It constitutes approximately 85% of the matter in the universe, yet has never been directly observed as a particle.

**Evidence for dark matter:**
1. **Galaxy rotation curves** — the flat rotation curves of spiral galaxies, demonstrated for hundreds of galaxies, are the most direct local evidence.
2. **Gravitational lensing** — dark matter bends light just as visible matter does. The Bullet Cluster (two galaxy clusters that collided) shows the X-ray-emitting hot gas (the dominant visible mass) displaced from the gravitational lensing mass center — because dark matter, unlike gas, passed through the collision without interacting.
3. **Large-scale structure** — the web of cosmic filaments, voids, and clusters seen in galaxy surveys matches N-body simulations only when dark matter is included. Without dark matter, galaxies would not cluster in the observed pattern.
4. **Cosmic Microwave Background** — the acoustic peaks in the CMB power spectrum measure the ratio of baryonic to dark matter. The heights of the second and third peaks are sensitive to this ratio; the observed heights give Ω_DM ≈ 0.27.

**Why no alternative gravity fully works:** MOND (Modified Newtonian Dynamics) fits many rotation curves beautifully — but fails for galaxy clusters (requires dark matter anyway), fails for the Bullet Cluster (the lensing mass doesn't follow the gas), and fails to reproduce the CMB acoustic peaks. Dark matter, despite its unknown particle nature, has no such failures.

**Key equations — rotation velocity with dark matter:**
$$v(r) = \sqrt{\frac{G[M_{bulge}(r) + M_{disk}(r) + M_{DM}(r)]}{r}}$$

For isothermal DM halo: M_DM(r) = 4πρ₀r_c²·r → v_DM = sqrt(4πGρ₀)·r_c = const.

**Real-world examples:**
1. **Vera Rubin and the Andromeda Galaxy (1970)** — Rubin and Ford measured the rotation of M31 (Andromeda) at various radii using spectrography. The flat curve at large radii was the conclusive observational case, building on Zwicky's 1933 galaxy cluster observations and Babcock's 1939 preliminary M31 curve.
2. **The Bullet Cluster (1E 0657-558)** — two clusters that collided. X-ray imaging shows the hot gas (80% of visible mass) displaced from center. Weak gravitational lensing maps show the mass concentration (the dark matter halos) passing through each other undisturbed, confirming collisionless dark matter.
3. **Direct detection experiments** — XENON1T, LUX, PandaX, and LZ at underground laboratories search for WIMPs scattering off xenon nuclei. Despite reaching sensitivity of 10⁻⁴⁷ cm² per nucleon, no signal. The null results have ruled out large portions of WIMP parameter space, pushing theorists toward lighter or more weakly interacting dark matter candidates.

---

## The Fix

Add the dark matter halo to the mass model:

```javascript
// Dark matter: NFW halo profile
const DM = {
  rho_s: 0.3 * SOLAR_MASS / PARSEC_IN_M**3,  // characteristic density
  r_s:   20e3 * PARSEC_IN_M,                  // scale radius 20 kpc
};

// NFW enclosed mass
function dmMass(r) {
  const x = r / DM.r_s;
  return 4 * Math.PI * DM.rho_s * DM.r_s**3 *
    (Math.log(1 + x) - x / (1 + x));
}

// Updated rotation velocity including dark matter
function rotationVelocityWithDM(r) {
  const M_visible = bulgeMass(r) + diskMass(r);
  const M_dm      = dmMass(r);
  const M_total   = M_visible + M_dm;
  return Math.sqrt(G * M_total / r);
}

// Plot all three curves
function plotRotationCurves(canvas) {
  const ctx = canvas.getContext('2d');
  
  for (let r_kpc = 0.5; r_kpc <= 50; r_kpc += 0.2) {
    const r = r_kpc * 3.086e19;  // kpc to meters
    
    // Visible only (red — the naive model)
    const v_vis = rotationVelocity(r) / 1e3;
    plotPoint(ctx, r_kpc, v_vis, '#ff4444');
    
    // Dark matter contribution only (blue)
    const v_dm = Math.sqrt(G * dmMass(r) / r) / 1e3;
    plotPoint(ctx, r_kpc, v_dm, '#4466ff');
    
    // Total — flat rotation curve (white)
    const v_total = rotationVelocityWithDM(r) / 1e3;
    plotPoint(ctx, r_kpc, v_total, '#ffffff');
  }
  
  // Observed data points (green circles with error bars)
  OBSERVED_DATA.forEach(({r, v, err}) => {
    drawDataPoint(ctx, r, v, err, '#44ff88');
  });
}
```

The result: three curves on the same plot. Red: the Keplerian fall-off from visible mass alone. Blue: the dark matter contribution rising slowly. White: the combined total — a flat curve that matches the green observed data points. The decomposition shows exactly where dark matter's contribution takes over (beyond ~8 kpc) and how it grows with radius to compensate for the falling visible mass.

---

## The Wow Moment — Push It

**Scene 1 — Vera Rubin's original data:** Reproduce the exact scatter plot from Rubin & Ford (1970), paper on the Andromeda Galaxy. Use the original data points (digitized from the paper). Show the predicted Keplerian curve in red and the data points in white — the data stubbornly refusing to fall. Then show the same analysis for 5 more galaxies from Rubin's later papers (1978–1985): M31, M81, M101, NGC 2403, NGC 7331. Every single galaxy shows the same flat curve. Rubin's message to her colleagues: "Whatever the observational errors, the velocities do not fall." The consistency across different masses, sizes, and morphologies of galaxies is overwhelming.

**Scene 2 — The dark matter "missing" mass distribution:** Show the galaxy with a density map overlay. The visible mass (stars, gas, dust) is concentrated in the disk — a flat, thin disk. The dark matter halo is shown as a diffuse blue glow extending in all directions, largest in the plane but extending spherically above and below the disk to distances of 100+ kpc. The halo is roughly 10 times the diameter of the visible galaxy and contains 5 times its mass. Rotate the 3D view: the halo is enormous and featureless — a cosmic "cloud" of unknown stuff.

**Scene 3 — What happens without dark matter:** Run the N-body galaxy stability simulation without dark matter. Place 1,000 star particles in a rotating disk with only the visible mass gravity. Within a few hundred million years (simulated), the disk develops instabilities — bar formation, spiral arm fragmentation, and eventually stars flying off the outer edge. The galaxy tears itself apart. Now add the dark matter halo: the disk remains stable, the spiral arms persist. Dark matter is not just an accounting fix for rotation curves — it is structurally necessary for galaxy disks to be gravitationally stable at all. Without it, we would not exist.

**Scene 4 — The Bullet Cluster visual:** Simulate two galaxy clusters (each 1,000 galaxy particles plus 3,000 gas particles) colliding head-on. The gas particles have a cross-section for interaction (drag, pressure) — they slow down and pile up in the center. The dark matter particles are collisionless — they pass through each other. After the collision: the gas (X-ray-bright, rendered in orange) is in the center; the dark matter (gravitational lensing mass, rendered in blue transparent overlay) is in two separate clumps on either side, centered on the galaxy populations. This is the Bullet Cluster — one image that showed the skeptics that dark matter is real.

---

## The Interactive Demo

**Galaxy rotation curve builder (main panel):** Three component mass sliders: Bulge mass (0 to 30×10⁹ M_sun), Disk mass (0 to 100×10⁹ M_sun), DM halo parameters (ρ_s from 0.01 to 1 M_sun/pc³, r_s from 5 to 50 kpc). Live rotation curve updates as sliders are dragged: visible contribution (red), DM contribution (blue), total (white). Real galaxy data overlay toggle: shows observed rotation curve data for the selected galaxy preset.

**Real galaxy presets:** Dropdown with 5 real galaxies: Milky Way, Andromeda (M31), NGC 3198 (the "textbook" example — a beautiful flat curve with extensive HI 21-cm data), Triangulum Galaxy (M33, intermediate spiral), and Large Magellanic Cloud (irregular, lower mass). Each preset loads the best-fit visible mass parameters and observed data. User adjusts DM halo to try to fit the observed data by hand — this gives intuition for how degenerate the fitting is.

**Profile shape toggle:** Switch between DM halo profiles: NFW (most physically motivated, from simulations), Isothermal sphere (analytic, gives exactly flat curves), Burkert profile (core rather than cusp — better fits some dwarf galaxies, the "core-cusp problem"). Show how the rotation curve changes subtly between profiles, especially at small r.

**Dark matter fraction display:** Show the fraction of total enclosed mass that is dark matter at each radius, as a function of r. At r = 1 kpc: maybe 30% DM. At r = 10 kpc: maybe 60%. At r = 50 kpc: 90%+. Plot this on a secondary Y-axis.

**MOND comparison toggle:** Switch from dark matter halo to MOND gravity modification: at accelerations below a₀ = 1.2×10⁻¹⁰ m/s², replace Newtonian F = ma with F = m·μ(a/a₀)·a where μ(x) → 1 for x >> 1 and μ(x) → x for x << 1. Show the MOND rotation curve alongside the DM model — for isolated spiral galaxies, they fit equally well. Then switch to a galaxy cluster: MOND curve falls short, dark matter model matches.

**Galaxy stability simulator (secondary panel):** 200-particle N-body disk with toggleable dark matter halo. Time controls. With DM: stable spiral structure persists. Without DM: disk destabilizes and fragments within ~10 orbital periods. The comparison is immediate and visceral.

---

## Production Notes

**Runtime targets:** Hook 1:30 — Naive attempt 2:30 — Moment of failure 2:00 — Physics 3:30 — The one concept 3:00 — The fix 3:00 — Wow moments 4:00 — Demo 2:30 — Total ~22 minutes.

**Screen layout:** The rotation curve plot (velocity vs. radius, with three color-coded curves and data points) is the visual centerpiece of the entire video — keep it prominent. During "the fix," show the curve in the right half updating in real time as dark matter is added. During the Wow Moment galaxy stability segment, use a full-screen canvas with the two simulations side by side.

**Key zooms:** The single most important zoom: the moment you add the dark matter halo and the predicted rotation curve (white) rises from the Keplerian red fall-off to match the flat observed data (green). Hold on this frame for 5 seconds with no narration — just the visual. The data fits. The model works. It is viscerally satisfying. Zoom on the MOND vs. dark matter comparison: for the spiral galaxy, nearly identical. For the galaxy cluster, dramatically different. This is the key discriminating test.

**Historical vignette:** Vera Rubin's story deserves extended treatment. Show her photograph. Note that she fought to be admitted to Princeton (they didn't admit women to their graduate program in astronomy in 1948 — she went to Cornell instead). Note that her work on galaxy rotation curves was systematically dismissed for years before being accepted. Note that she died in 2016, five years before the Nobel Committee might have recognized her (the Nobel Prize is not awarded posthumously). She is one of the most important astronomers of the 20th century, and her non-recognition is a profound failure of the scientific community that should be named clearly.

**Animations to prepare:** (1) The Bullet Cluster composite image — X-ray (Chandra, orange), optical (Hubble, white), gravitational lensing mass (blue contours). This is one of the most powerful images in modern cosmology and is publicly released by NASA/ESA. (2) The P-P diagram equivalent for dark matter: the "detection exclusion" plot showing WIMPs ruled out at different cross-sections and masses by XENON, LUX, PandaX. A slowly shrinking allowed region with each new experiment. (3) N-body simulation of galaxy formation with dark matter (publicly available from Illustris TNG project) — a gorgeous timelapse of the cosmic web forming.

**B-roll:** Vera Rubin at Lowell Observatory, 1965 (historical photograph). The Bullet Cluster composite image. Illustris TNG large-scale structure simulation (publicly available, stunning). Underground laboratory photograph (XENON detector in Gran Sasso, Italy).

---

## Tags

`physics` `dark-matter` `rotation-curves` `galaxy` `gravity` `cosmology` `javascript` `canvas` `beginner`

---

## Thumbnail

A two-panel image showing the galaxy rotation curve. Left panel: a schematic of the Milky Way (top-down view, beautiful spiral) with concentric rings at increasing radii. Below it, the rotation curve: a red line that rises and falls in the classic Keplerian shape — labeled "Prediction." Right panel: the same galaxy schematic but now overlaid with a diffuse blue glow extending well beyond the visible disk (the dark matter halo). Below it, the rotation curve: a flat white line that stays at constant height, with green data points clustering exactly on it — labeled "Reality." Text overlay at top: "Something Invisible Holds the Galaxy Together." The color contrast (red prediction vs. white reality) and the visual of the invisible blue halo surrounding the visible galaxy are immediately striking. Vera Rubin's name appears in small text at the bottom right: "Data: Vera Rubin, 1970 — Nobel Prize: none." This attribution honors her work and creates an additional emotional hook.
