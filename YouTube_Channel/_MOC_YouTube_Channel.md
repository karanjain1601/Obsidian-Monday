# YouTube Channel — Physics Simulation

> **Channel concept:** Simulate the physical world in code, on camera. Every video builds a simulation from scratch. The bugs are the curriculum — naive code fails in ways that are always physical or numerical, not typos.
>
> **Channel arc:** "From a bouncing ball to a black hole, one simulation at a time."

---

## Channel Name Suggestions

| Rank | Name | Why |
|------|------|-----|
| ⭐ **#1** | **CodedLaws** | Elegant double meaning: laws of physics + lines of code. Punchy, memorable, domain-agnostic enough to grow. |
| **#2** | **PhysicsFromScratch** | Honest, searchable, instantly communicates the format. Best for SEO. |
| **#3** | **FromNewtonToNeurons** | Captures the entire channel arc in one phrase. Great for the Season 5 pivot. |
| **#4** | **BreakingPhysics** | Dual meaning: building physics AND breaking simulations. References the thesis. |
| **#5** | **PixelGravity** | Visual, playful, sticks in the mind. Works across thumbnails and merch. |
| **#6** | **EulerFailed** | Funny, instantly memeable, references the flagship thesis video. |
| **#7** | **OneMoreParticle** | Charming understatement for a channel that goes from one ball to a black hole. |
| **#8** | **SimPhysicist** | Persona-based; works if the creator becomes a known face. |
| **#9** | **ThePhysicsLoop** | References both the game loop and the simulation feedback cycle. |
| **#10** | **NullOrbit** | Evocative; references the orbital decay bug that is the channel's thesis moment. |

**Recommendation:** Use **CodedLaws** for the channel, **PhysicsFromScratch** as the YouTube handle/URL slug for discoverability.

---

## Core Identity

- **Episode DNA:** Hook → Naive attempt (let it break) → The physics (one concept) → The fix → Push it → Playground (demo + code)
- **The moat:** Every video ships a playable browser demo + open-source code
- **Tooling:** JS + Canvas/WebGL, p5.js (2D), three.js (3D) for Seasons 1–4; Python/JAX for Season 5
- **The thesis video:** [[Playlist/Season_1/S1E06_Orbital_Decay|S1E06 — I Coded Gravity and My Planet Crashed Into the Sun]]

---

## Vault Structure

```text
YouTube_Channel/
├── Playlist/
│   ├── Season_1/   S1E01–S1E10  (The Integrator Sessions)
│   ├── Season_2/   S2E11–S2E20  (The Many-Body Problem)
│   ├── Season_3/   S3E21–S3E30  (Fields & Fluids)
│   ├── Season_4/   S4E31–S4E40  (Spacetime & Quantum)
│   └── Season_5/   S5E41–S5E50  (Teaching Machines Physics)
├── Ideas/
│   ├── Beginner/   B001–B100    (100 beginner video ideas)
│   ├── Medium/     M001–M065    (65 medium video ideas)
│   └── Advanced/   A001–A035    (35 advanced video ideas)
└── Shorts/
    ├── Beginner/   SB001–SB200  (200 beginner shorts)
    ├── Medium/     SM001–SM165  (165 medium shorts)
    └── Advanced/   SA001–SA135  (135 advanced shorts)
```

**Total files:** 50 playlist + 200 idea notes + 500 shorts = **750 individual notes**

---

## Playlist — 50 Videos (5 Seasons)

### Season 1 — The Integrator Sessions (E01–E10)

| Episode | File | Concept |
|---------|------|---------|
| S1E01 | [[Playlist/Season_1/S1E01_Cannon_Infinity]] | Euler integration instability |
| S1E02 | [[Playlist/Season_1/S1E02_Bouncing_Ball]] | Symplectic Euler / energy conservation |
| S1E03 | [[Playlist/Season_1/S1E03_Spring_Explosion]] | Verlet integration |
| S1E04 | [[Playlist/Season_1/S1E04_Pendulum_Lies]] | Drag forces / quadratic friction |
| S1E05 | [[Playlist/Season_1/S1E05_Resonance]] | Coefficient of restitution / impulse |
| S1E06 | [[Playlist/Season_1/S1E06_Orbital_Decay]] | Newton's gravitational law (inverse-square) |
| S1E07 | [[Playlist/Season_1/S1E07_Integrator_Showdown]] | Constraint solving / Jacobi iteration |
| S1E08 | [[Playlist/Season_1/S1E08_Double_Pendulum]] | Lagrangian mechanics / chaos |
| S1E09 | [[Playlist/Season_1/S1E09_Air_Drag]] | Rigid body rotation / moment of inertia |
| S1E10 | [[Playlist/Season_1/S1E10_Normal_Modes]] | Normal modes / eigenvalue decomposition |

### Season 2 — The Many-Body Problem (E11–E20)

| Episode | File | Concept |
|---------|------|---------|
| S2E11 | [[Playlist/Season_2/S2E11_Solar_System]] | N-body gravity / Barnes-Hut tree |
| S2E12 | [[Playlist/Season_2/S2E12_Galaxy_Sim]] | Galaxy collision / dark matter halo |
| S2E13 | [[Playlist/Season_2/S2E13_Barnes_Hut]] | Lennard-Jones potential / thermostat |
| S2E14 | [[Playlist/Season_2/S2E14_Tunneling_Collision]] | Smoothed particle hydrodynamics |
| S2E15 | [[Playlist/Season_2/S2E15_Newtons_Cradle]] | Neighbor lists / O(N) collision detection |
| S2E16 | [[Playlist/Season_2/S2E16_Fireworks]] | Inelastic collapse / granular temperature |
| S2E17 | [[Playlist/Season_2/S2E17_Cloth_Sim]] | Social force model / lane formation |
| S2E18 | [[Playlist/Season_2/S2E18_Rope_Chain]] | Boids / emergent flocking rules |
| S2E19 | [[Playlist/Season_2/S2E19_Boids_Flocking]] | Topological interaction / scale-free flocking |
| S2E20 | [[Playlist/Season_2/S2E20_Granular_Sand]] | MPM / continuum-particle hybrid |

### Season 3 — Fields & Fluids (E21–E30)

| Episode | File | Concept |
|---------|------|---------|
| S3E21 | [[Playlist/Season_3/S3E21_Wave_Equation]] | Wave equation / numerical dispersion |
| S3E22 | [[Playlist/Season_3/S3E22_Heat_Equation]] | Heat diffusion / implicit integration |
| S3E23 | [[Playlist/Season_3/S3E23_Stable_Fluids]] | Stable Fluids / Stam's method |
| S3E24 | [[Playlist/Season_3/S3E24_Fire_Sim]] | Lattice Boltzmann method |
| S3E25 | [[Playlist/Season_3/S3E25_SPH_Water]] | Maxwell's equations / finite differences |
| S3E26 | [[Playlist/Season_3/S3E26_Turing_Patterns]] | Reaction-diffusion / Turing instability |
| S3E27 | [[Playlist/Season_3/S3E27_Electric_Fields]] | Shallow water equations / tsunami |
| S3E28 | [[Playlist/Season_3/S3E28_FDTD_Light]] | Vorticity confinement / smoke sim |
| S3E29 | [[Playlist/Season_3/S3E29_Gimbal_Lock]] | Surface tracking / level set |
| S3E30 | [[Playlist/Season_3/S3E30_Gyroscope]] | Gyroscopic precession / Euler angles |

### Season 4 — Spacetime & Quantum (E31–E40)

| Episode | File | Concept |
|---------|------|---------|
| S4E31 | [[Playlist/Season_4/S4E31_Time_Dilation]] | Special relativity / Lorentz factor |
| S4E32 | [[Playlist/Season_4/S4E32_Relativistic_View]] | General relativity / geodesics |
| S4E33 | [[Playlist/Season_4/S4E33_Twin_Paradox]] | Gravitational wave strain / quadrupole |
| S4E34 | [[Playlist/Season_4/S4E34_Black_Hole_Raytracer]] | Black hole ray tracing / Schwarzschild |
| S4E35 | [[Playlist/Season_4/S4E35_GR_Orbits]] | Schrödinger equation / split-step FFT |
| S4E36 | [[Playlist/Season_4/S4E36_Interstellar_Image]] | Wave-particle duality / interference |
| S4E37 | [[Playlist/Season_4/S4E37_Schrodinger]] | Quantum harmonic oscillator / ladder ops |
| S4E38 | [[Playlist/Season_4/S4E38_Quantum_Tunneling]] | Quantum tunneling / WKB approximation |
| S4E39 | [[Playlist/Season_4/S4E39_Double_Slit]] | Heisenberg model / Monte Carlo |
| S4E40 | [[Playlist/Season_4/S4E40_Ising_Model]] | Ising model / phase transition |

### Season 5 — Teaching Machines Physics (E41–E50)

| Episode | File | Concept |
|---------|------|---------|
| S5E41 | [[Playlist/Season_5/S5E41_Differentiable_Sim]] | Differentiable simulation / autodiff |
| S5E42 | [[Playlist/Season_5/S5E42_PINNs]] | Physics-informed neural networks |
| S5E43 | [[Playlist/Season_5/S5E43_Neural_ODE]] | Neural ODEs / adjoint method |
| S5E44 | [[Playlist/Season_5/S5E44_Symbolic_Regression]] | Hamiltonian neural networks |
| S5E45 | [[Playlist/Season_5/S5E45_RL_Robot]] | Lagrangian neural networks |
| S5E46 | [[Playlist/Season_5/S5E46_Neural_Surrogate]] | Graph neural networks for physics |
| S5E47 | [[Playlist/Season_5/S5E47_Evolution_Robot]] | Reinforcement learning / locomotion |
| S5E48 | [[Playlist/Season_5/S5E48_Self_Driving]] | Inverse design / topology optimization |
| S5E49 | [[Playlist/Season_5/S5E49_Hamiltonian_NN]] | Neural fluid simulation / FNO |
| S5E50 | [[Playlist/Season_5/S5E50_Full_Stack_Physics]] | Sim-to-real transfer / domain randomization |

---

## Video Ideas Bank (200 notes)

### Beginner Ideas — B001–B100
[[Ideas/Beginner/B001_Free_Fall|B001]] · [[Ideas/Beginner/B002_Terminal_Velocity|B002]] · [[Ideas/Beginner/B003_Circular_Motion|B003]] · [[Ideas/Beginner/B004_Angular_Momentum|B004]] · [[Ideas/Beginner/B005_Rocket_Equation|B005]] · [[Ideas/Beginner/B006_Friction|B006]] · [[Ideas/Beginner/B007_Torque|B007]] · [[Ideas/Beginner/B008_Buoyancy|B008]] · [[Ideas/Beginner/B009_Bernoulli|B009]] · [[Ideas/Beginner/B010_Doppler|B010]] · [[Ideas/Beginner/B011_Snells_Law|B011]] · [[Ideas/Beginner/B012_Total_Internal_Reflection|B012]] · [[Ideas/Beginner/B013_Thin_Lens|B013]] · [[Ideas/Beginner/B014_Photoelectric_Effect|B014]] · [[Ideas/Beginner/B015_Radioactive_Decay|B015]] · [[Ideas/Beginner/B016_Escape_Velocity|B016]] · [[Ideas/Beginner/B017_Tidal_Forces|B017]] · [[Ideas/Beginner/B018_Orbital_Velocity|B018]] · [[Ideas/Beginner/B019_Keplers_Laws|B019]] · [[Ideas/Beginner/B020_Multi_Stage_Rockets|B020]] · [[Ideas/Beginner/B021_Coriolis_Effect|B021]] · [[Ideas/Beginner/B022_Standing_Waves|B022]] · [[Ideas/Beginner/B023_Beat_Frequency|B023]] · [[Ideas/Beginner/B024_Sound_Waves|B024]] · [[Ideas/Beginner/B025_Chladni_Patterns|B025]] · [[Ideas/Beginner/B026_Blackbody_Radiation|B026]] · [[Ideas/Beginner/B027_Magnus_Effect|B027]] · [[Ideas/Beginner/B028_Center_of_Mass|B028]] · [[Ideas/Beginner/B029_Rolling_Motion|B029]] · [[Ideas/Beginner/B030_Bicycle_Stability|B030]] · [[Ideas/Beginner/B031_Boomerang|B031]] · [[Ideas/Beginner/B032_Trebuchet|B032]] · [[Ideas/Beginner/B033_CrumpleZones|B033]] · [[Ideas/Beginner/B034_Whip_Crack|B034]] · [[Ideas/Beginner/B035_Skipping_Stones|B035]] · [[Ideas/Beginner/B036_Paper_Airplanes|B036]] · [[Ideas/Beginner/B037_Kite_Physics|B037]] · [[Ideas/Beginner/B038_Helicopter_Rotor|B038]] · [[Ideas/Beginner/B039_Seismic_Waves|B039]] · [[Ideas/Beginner/B040_Tsunami|B040]] · [[Ideas/Beginner/B041_Lightning|B041]] · [[Ideas/Beginner/B042_Rainbows|B042]] · [[Ideas/Beginner/B043_Solar_Wind|B043]] · [[Ideas/Beginner/B044_Comet_Tails|B044]] · [[Ideas/Beginner/B045_Binary_Stars|B045]] · [[Ideas/Beginner/B046_Planet_Formation|B046]] · [[Ideas/Beginner/B047_Moon_Origin|B047]] · [[Ideas/Beginner/B048_Pulsars|B048]] · [[Ideas/Beginner/B049_Hubble_Law|B049]] · [[Ideas/Beginner/B050_Dark_Matter|B050]] · [[Ideas/Beginner/B051_Pressure_Fluids|B051]] · [[Ideas/Beginner/B052_Pascals_Law|B052]] · [[Ideas/Beginner/B053_Surface_Tension|B053]] · [[Ideas/Beginner/B054_Capillary_Action|B054]] · [[Ideas/Beginner/B055_Viscosity|B055]] · [[Ideas/Beginner/B056_Reynolds_Number|B056]] · [[Ideas/Beginner/B057_Inclined_Plane_Friction|B057]] · [[Ideas/Beginner/B058_Simple_Machines|B058]] · [[Ideas/Beginner/B059_Work_Energy|B059]] · [[Ideas/Beginner/B060_Pendulum_Clock|B060]] · [[Ideas/Beginner/B061_Bungee_Jumping|B061]] · [[Ideas/Beginner/B062_Stress_Strain|B062]] · [[Ideas/Beginner/B063_Sound_Speed_Water|B063]] · [[Ideas/Beginner/B064_Echo_Ranging|B064]] · [[Ideas/Beginner/B065_Polarization|B065]] · [[Ideas/Beginner/B066_Thin_Film|B066]] · [[Ideas/Beginner/B067_Diffraction|B067]] · [[Ideas/Beginner/B068_Chain_Reaction|B068]] · [[Ideas/Beginner/B069_Fusion_Sun|B069]] · [[Ideas/Beginner/B070_Planet_Jump|B070]] · [[Ideas/Beginner/B071_Mass_vs_Weight|B071]] · [[Ideas/Beginner/B072_Newtons_Third_Law|B072]] · [[Ideas/Beginner/B073_Impulse_Momentum|B073]] · [[Ideas/Beginner/B074_Collision_Types|B074]] · [[Ideas/Beginner/B075_Ballistic_Pendulum|B075]] · [[Ideas/Beginner/B076_Projectile_Slope|B076]] · [[Ideas/Beginner/B077_Relative_Motion|B077]] · [[Ideas/Beginner/B078_Altitude_Drag|B078]] · [[Ideas/Beginner/B079_Gravity_Assist|B079]] · [[Ideas/Beginner/B080_Lagrange_Points|B080]] · [[Ideas/Beginner/B081_Tidal_Locking|B081]] · [[Ideas/Beginner/B082_Radiation_Belts|B082]] · [[Ideas/Beginner/B083_Earths_Magnetic_Field|B083]] · [[Ideas/Beginner/B084_Northern_Lights|B084]] · [[Ideas/Beginner/B085_Road_Mirage|B085]] · [[Ideas/Beginner/B086_Huygens_Principle|B086]] · [[Ideas/Beginner/B087_Telescope_Lenses|B087]] · [[Ideas/Beginner/B088_Eye_Optics|B088]] · [[Ideas/Beginner/B089_Fiber_Optics|B089]] · [[Ideas/Beginner/B090_Sound_Barrier|B090]] · [[Ideas/Beginner/B091_Mach_Cone|B091]] · [[Ideas/Beginner/B092_Water_Hammer|B092]] · [[Ideas/Beginner/B093_Venturi_Effect|B093]] · [[Ideas/Beginner/B094_Archimedes_Screw|B094]] · [[Ideas/Beginner/B095_Gyrocompass|B095]] · [[Ideas/Beginner/B096_Rolling_Race|B096]] · [[Ideas/Beginner/B097_Angular_Impulse|B097]] · [[Ideas/Beginner/B098_Eulers_Disk|B098]] · [[Ideas/Beginner/B099_Ice_Skater|B099]] · [[Ideas/Beginner/B100_Foucault_Pendulum|B100]]

### Medium Ideas — M001–M065
[[Ideas/Medium/M001_Rayleigh_Taylor|M001]] · [[Ideas/Medium/M002_Kelvin_Helmholtz|M002]] · [[Ideas/Medium/M003_Faraday_Waves|M003]] · [[Ideas/Medium/M004_Karman_Vortex|M004]] · [[Ideas/Medium/M005_Plateau_Rayleigh|M005]] · [[Ideas/Medium/M006_Leidenfrost|M006]] · [[Ideas/Medium/M007_Rayleigh_Benard|M007]] · [[Ideas/Medium/M008_Taylor_Couette|M008]] · [[Ideas/Medium/M009_Marangoni|M009]] · [[Ideas/Medium/M010_Cahn_Hilliard|M010]] · [[Ideas/Medium/M011_Percolation|M011]] · [[Ideas/Medium/M012_BTW_Sandpile|M012]] · [[Ideas/Medium/M013_Game_of_Life|M013]] · [[Ideas/Medium/M014_Langtons_Ant|M014]] · [[Ideas/Medium/M015_DLA|M015]] · [[Ideas/Medium/M016_Eden_Model|M016]] · [[Ideas/Medium/M017_Phyllotaxis|M017]] · [[Ideas/Medium/M018_Voronoi|M018]] · [[Ideas/Medium/M019_LSystems|M019]] · [[Ideas/Medium/M020_CA_Zoo|M020]] · [[Ideas/Medium/M021_Brownian_Motion|M021]] · [[Ideas/Medium/M022_Levy_Flight|M022]] · [[Ideas/Medium/M023_Lorenz_Attractor|M023]] · [[Ideas/Medium/M024_Rossler_Attractor|M024]] · [[Ideas/Medium/M025_Logistic_Map|M025]] · [[Ideas/Medium/M026_Fractal_Dimension|M026]] · [[Ideas/Medium/M027_Mandelbrot|M027]] · [[Ideas/Medium/M028_Newton_Fractal|M028]] · [[Ideas/Medium/M029_IFS|M029]] · [[Ideas/Medium/M030_Attractor_Gallery|M030]] · [[Ideas/Medium/M031_Jenga_Physics|M031]] · [[Ideas/Medium/M032_Glass_Shattering|M032]] · [[Ideas/Medium/M033_Griffith_Fracture|M033]] · [[Ideas/Medium/M034_Soft_Body_Verlet|M034]] · [[Ideas/Medium/M035_Hair_PBD|M035]] · [[Ideas/Medium/M036_Soil_Liquefaction|M036]] · [[Ideas/Medium/M037_Avalanche|M037]] · [[Ideas/Medium/M038_KdV_Soliton|M038]] · [[Ideas/Medium/M039_Rogue_Waves|M039]] · [[Ideas/Medium/M040_Kelvin_Wake|M040]] · [[Ideas/Medium/M041_LBM|M041]] · [[Ideas/Medium/M042_FLIP_Fluid|M042]] · [[Ideas/Medium/M043_PBF|M043]] · [[Ideas/Medium/M044_Adaptive_SPH|M044]] · [[Ideas/Medium/M045_Unified_Particles|M045]] · [[Ideas/Medium/M046_SDF|M046]] · [[Ideas/Medium/M047_Dynamic_BVH|M047]] · [[Ideas/Medium/M048_Simulated_Annealing|M048]] · [[Ideas/Medium/M049_Ant_Colony|M049]] · [[Ideas/Medium/M050_Traffic_CA|M050]] · [[Ideas/Medium/M051_Fourier_Analysis|M051]] · [[Ideas/Medium/M052_FFT|M052]] · [[Ideas/Medium/M053_Wavelet|M053]] · [[Ideas/Medium/M054_Signal_Filter|M054]] · [[Ideas/Medium/M055_PID_Controller|M055]] · [[Ideas/Medium/M056_Kalman_Filter|M056]] · [[Ideas/Medium/M057_FEM_Intro|M057]] · [[Ideas/Medium/M058_Topology_Optimization|M058]] · [[Ideas/Medium/M059_Homogenization|M059]] · [[Ideas/Medium/M060_Adjoint_Method|M060]] · [[Ideas/Medium/M061_Spectral_NS|M061]] · [[Ideas/Medium/M062_AMR|M062]] · [[Ideas/Medium/M063_VoF|M063]] · [[Ideas/Medium/M064_Level_Set|M064]] · [[Ideas/Medium/M065_Immersed_Boundary|M065]]

### Advanced Ideas — A001–A035
[[Ideas/Advanced/A001_MPM|A001]] · [[Ideas/Advanced/A002_DEC|A002]] · [[Ideas/Advanced/A003_FEM_Advanced|A003]] · [[Ideas/Advanced/A004_Kirchhoff_Shell|A004]] · [[Ideas/Advanced/A005_Featherstone|A005]] · [[Ideas/Advanced/A006_Reduced_Coordinates|A006]] · [[Ideas/Advanced/A007_LCP_Contact|A007]] · [[Ideas/Advanced/A008_GJK|A008]] · [[Ideas/Advanced/A009_Turbulence_LES_RANS|A009]] · [[Ideas/Advanced/A010_DNS|A010]] · [[Ideas/Advanced/A011_Pseudo_Spectral_NS|A011]] · [[Ideas/Advanced/A012_Vortex_Filament|A012]] · [[Ideas/Advanced/A013_SPH_Maxwell|A013]] · [[Ideas/Advanced/A014_GRMHD|A014]] · [[Ideas/Advanced/A015_Nbody_Cosmology|A015]] · [[Ideas/Advanced/A016_CMB|A016]] · [[Ideas/Advanced/A017_Boltzmann|A017]] · [[Ideas/Advanced/A018_Fokker_Planck|A018]] · [[Ideas/Advanced/A019_PIMC|A019]] · [[Ideas/Advanced/A020_DFT|A020]] · [[Ideas/Advanced/A021_Lattice_QCD|A021]] · [[Ideas/Advanced/A022_Mean_Field|A022]] · [[Ideas/Advanced/A023_DMRG|A023]] · [[Ideas/Advanced/A024_TDDFT|A024]] · [[Ideas/Advanced/A025_AIMD|A025]] · [[Ideas/Advanced/A026_SDPD|A026]] · [[Ideas/Advanced/A027_DPD|A027]] · [[Ideas/Advanced/A028_CG_MD|A028]] · [[Ideas/Advanced/A029_Force_Field|A029]] · [[Ideas/Advanced/A030_Reactive_MD|A030]] · [[Ideas/Advanced/A031_Conformal_Mapping|A031]] · [[Ideas/Advanced/A032_Godunov_Riemann|A032]] · [[Ideas/Advanced/A033_DG|A033]] · [[Ideas/Advanced/A034_IGA|A034]] · [[Ideas/Advanced/A035_Peridynamics|A035]]

---

## Shorts Bank (500 notes)

### Beginner Shorts — SB001–SB200
SB001–SB100: [[Shorts/Beginner/]] (companion shorts for the main playlist, numerical integration bugs, orbital mechanics, fluids, quantum, ML×physics)
SB101–SB200: [[Shorts/Beginner/]] (fluid mechanics, classical mechanics, waves/optics, nuclear, thermodynamics, E&M, quantum, space)

### Medium Shorts — SM001–SM165
[[Shorts/Medium/]] — Fluid instabilities, cellular automata, chaos, fractals, soft matter, signal processing, active matter, networks, social dynamics

### Advanced Shorts — SA001–SA135
[[Shorts/Advanced/]] — MPM, DEC, turbulence, GRMHD, cosmology, quantum many-body, QFT, black holes, GW physics, solar/stellar physics, neuro/ML×physics

---

## Season Overview

| Season | Theme | Thesis | Episodes |
|--------|-------|--------|----------|
| **1** | The Integrator Sessions | Every sim is secretly an integration problem | E01–E10 |
| **2** | The Many-Body Problem | More particles → emergent behavior, not just more physics | E11–E20 |
| **3** | Fields & Fluids | Simulating fields means discretizing space itself | E21–E30 |
| **4** | Spacetime & Quantum | At extremes, space and time become the simulation domain | E31–E40 |
| **5** | Teaching Machines Physics | Make physics differentiable; machines learn the laws | E41–E50 |

---

## Companion Shorts (Top 10)

1. **Double Pendulum Art** → [[Playlist/Season_1/S1E08_Double_Pendulum]]
2. **Black Hole Einstein Ring** → [[Playlist/Season_4/S4E34_Black_Hole_Raytracer]]
3. **Boids Murmuration** → [[Playlist/Season_2/S2E19_Boids_Flocking]]
4. **Turing Patterns Parameter Sweep** → [[Playlist/Season_3/S3E26_Turing_Patterns]]
5. **Stable Fluids Swirl** → [[Playlist/Season_3/S3E23_Stable_Fluids]]
6. **Gyroscope vs Gravity** → [[Playlist/Season_3/S3E30_Gyroscope]]
7. **Quantum Tunneling** → [[Playlist/Season_4/S4E38_Quantum_Tunneling]]
8. **Galaxy Merger** → [[Playlist/Season_2/S2E12_Galaxy_Sim]]
9. **Evolved Creature Gallop** → [[Playlist/Season_5/S5E47_Evolution_Robot]]
10. **Ising Phase Transition** → [[Playlist/Season_4/S4E40_Ising_Model]]

---

*Tags:* #youtube #physics #simulation #javascript #curriculum
