---
title: "Why Einstein's Nobel Prize Wasn't for Relativity (Photoelectric Effect)"
id: B014
difficulty: 2/10
prereq: "None"
concept: "Photon energy E = hf — light is quantized, electrons eject only if hf > φ"
tags: [physics, quantum, photoelectric-effect, photons, planck, einstein, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why Einstein's Nobel Prize Wasn't for Relativity (Photoelectric Effect)

**Alt title:** "Red Light Can't Eject Electrons No Matter How Bright. Here's Why."
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Show a physical setup: a zinc plate connected to an ammeter, sitting in a vacuum chamber. Shine a UV lamp at it — the ammeter needle swings. Electrons are flying off the metal. Now cover the lamp with a red filter — the needle drops to zero. Crank up the intensity of the red light with a huge bank of LEDs — the needle stays at zero. Not a blip. Not a trickle. Zero. Now swap back to dim UV — the needle swings again immediately, no delay, even with the UV source almost at minimum power. Show this real or simulated in a table: "Bright red = 0 electrons. Dim UV = electrons. What?" Classical wave physics predicts that more intensity should always mean more energy delivered to the metal — eventually any color should eject electrons if you wait long enough. The experiment says otherwise. Red light cannot eject electrons from zinc under any circumstances. UV light always can, even at minimum intensity. The universe is telling us something fundamental about the nature of light. Einstein's 1905 paper — his "miracle year" paper that won the Nobel, not Special Relativity — proposed the explanation. Light is not a continuous wave. It comes in packets, and each packet's energy depends only on its frequency.

## The Naive Attempt

Build the classical wave model. Represent light as a continuous electromagnetic wave with amplitude A and frequency f. The intensity (energy per unit area per unit time) is I ∝ A². The electron is sitting on the metal surface, absorbing energy from the wave continuously. When the absorbed energy exceeds the work function φ (the binding energy holding the electron to the metal), the electron ejects. In code: `electron.energy += intensity * absorptionRate * dt`. When `electron.energy > phi`: `ejectElectron()`. This model is clean and physically motivated from classical EM theory. Run it: increase intensity, electrons eject faster (higher ejection rate). Decrease intensity, electrons eject more slowly — but eventually still eject if you wait long enough. Change the frequency while keeping intensity constant: nothing changes — the model has no mechanism for frequency to affect ejection energy, because energy is delivered continuously by the wave regardless of its oscillation rate. This model predicts: (1) any color light ejects electrons given enough time/intensity, (2) higher intensity = higher energy of ejected electrons, (3) there should be a noticeable time delay for very dim light (electron slowly charging up). All three predictions are experimentally wrong.

## The Moment of Failure

Make the failure quantitative and visual. Set the simulation: zinc plate, φ = 6.9 × 10⁻¹⁹ J. Shine classical wave red light (λ = 700 nm) at maximum intensity — 1000 W/m². In the classical model, after just a few milliseconds the electron energy threshold is exceeded and electrons start ejecting. On screen, glowing red "electrons" fly off the plate, ammeter swings. This looks correct. Now switch to quantum-accurate mode (no cheat code yet — just display what actually happens experimentally): same 1000 W/m² of red light — ammeter stays at zero. Not a single electron. Not even after 10 seconds of simulated time. The classical model and the real result are diametrically opposite. Make a table on screen: "Classical model: ejection ✓ at high intensity regardless of color. Reality: ejection ✗ for red regardless of intensity." The mismatch is not quantitative — it's categorical. Then show the second failure: classical model predicts higher intensity → higher KE of ejected electrons. Reality: KE depends only on frequency, not intensity. This breaks the classical model at its core assumption.

## Why It Broke — The Physics

Einstein's 1905 insight: light is made of discrete quanta (later called photons). Each photon carries energy:

**E = h · f = h · c / λ**

Where h = 6.626 × 10⁻³⁴ J·s is Planck's constant, f is frequency, c is speed of light, λ is wavelength. For red light (λ = 700 nm): E_photon = hc/λ = (6.626 × 10⁻³⁴ × 3 × 10⁸) / (700 × 10⁻⁹) = 2.84 × 10⁻¹⁹ J. For zinc's work function φ = 6.9 × 10⁻¹⁹ J: E_red < φ. The photon simply does not have enough energy. No accumulation of red photons helps — each photon interacts with one electron in an instantaneous quantum interaction. Two photons cannot cooperate (at ordinary intensities). For UV light (λ = 254 nm): E_UV = 7.83 × 10⁻¹⁹ J > φ = 6.9 × 10⁻¹⁹ J. The photon has enough energy. The ejected electron carries the remainder as kinetic energy:

**KE = hf − φ = h(f − f₀)**

where f₀ = φ/h is the threshold frequency. The ammeter current (number of electrons per second) is proportional to the number of photons per second (intensity) — but the KE of each ejected electron depends only on frequency.

## The One Concept

**Photon energy: E = hf**

**Formal definition:** Light is composed of discrete quanta called photons. Each photon has energy E = hf, where h = 6.626 × 10⁻³⁴ J·s is Planck's constant and f is the electromagnetic frequency of the light. The photon energy is a property of one quantum of the field — it cannot be subdivided, and it cannot accumulate with other photons to eject a single electron (at normal intensities). The photoelectric effect occurs only if E_photon = hf > φ, the work function of the material.

**Physical intuition:** Imagine instead of a water wave, the ocean sends individual bullets (photons). Each bullet hits one person (electron) with fixed energy. A big wave (high intensity) just means more bullets — but each bullet has the same power. The frequency determines the bullet's punch (energy). Red light bullets don't punch hard enough to knock out zinc electrons. UV bullets do. You can send a billion red bullets and still not eject one electron. One UV bullet is enough.

**Threshold frequency and stopping potential:** The threshold frequency f₀ = φ/h is the minimum frequency at which ejection occurs. Above f₀, the maximum KE of ejected electrons = h(f − f₀). Millikan's stopping potential experiment measured this: apply a retarding voltage V₀ to stop the fastest electrons. At stopping potential: eV₀ = hf − φ. Plot stopping potential V₀ vs frequency f → straight line with slope h/e. This gave the first precision measurement of h from a photoelectric experiment, confirming E = hf quantitatively.

**Real-world examples:**
1. **Solar cells (photovoltaics):** Every solar panel works by the photoelectric effect. Photons from sunlight hit silicon atoms, ejecting electrons into an electric circuit. The threshold corresponds to the silicon band gap (~1.1 eV). Infrared photons below this energy are wasted as heat. This is why solar cell efficiency is fundamentally limited — the Shockley-Queisser limit (~33% for single-junction cells).
2. **Photomultiplier tubes (PMTs):** Used in particle physics detectors, medical PET scanners, and astronomy. A single photon hits a photocathode, ejects an electron, which is accelerated and hits a dynode, releasing more electrons — a cascade giving gain of 10⁶. PMTs can detect single photons.
3. **Photoelectron spectroscopy (XPS):** Shine X-rays at a material surface, measure the kinetic energy of ejected photoelectrons. Since KE = hf − φ_binding, measuring KE tells you the binding energy of electrons in the material — a chemical fingerprint. Used in materials science to identify surface composition.

## The Fix

Replace the continuous-wave energy accumulation model with a discrete photon model:

```javascript
function emitPhotons(light) {
  // Number of photons per second proportional to intensity
  const photonEnergy = PLANCK_H * light.frequency; // E = hf
  const photonsPerSecond = light.intensity / photonEnergy;
  
  return photonsPerSecond;
}

function tryEjectElectron(photonEnergy, workFunction) {
  if (photonEnergy > workFunction) {
    // Ejection occurs immediately — no delay
    const kineticEnergy = photonEnergy - workFunction;
    return {
      ejected: true,
      kineticEnergy: kineticEnergy,
      speed: Math.sqrt(2 * kineticEnergy / ELECTRON_MASS)
    };
  } else {
    // Not enough energy — no ejection regardless of how many photons
    return { ejected: false };
  }
}

// Main simulation loop:
const photonsThisFrame = emitPhotons(light) * dt;
for (let i = 0; i < photonsThisFrame; i++) {
  const result = tryEjectElectron(photonEnergy, material.workFunction);
  if (result.ejected) {
    spawnElectron(result.speed);
    current += ELECTRON_CHARGE;
  }
}
```

Now: red light → photonEnergy < workFunction → no ejections regardless of intensity. UV light → photonEnergy > workFunction → ejections proportional to photon count (intensity). KE of each electron = hf − φ, independent of intensity. The simulation now matches every experimental observation.

## The Wow Moment — Push It

Build **Millikan's stopping potential experiment** interactively. Draw the photoelectric setup with a collector plate connected to a variable voltage source. When V > 0, electrons are accelerated toward the collector (higher current). When V < 0 (stopping voltage), electrons are decelerated. At exactly V₀ = (hf − φ)/e, even the fastest electrons barely make it — current drops to zero. Let the viewer adjust the frequency and automatically find the stopping potential. Then plot V₀ vs frequency on a live graph — it's a straight line. The slope is h/e = 4.136 × 10⁻¹⁵ V·s. From this graph, derive Planck's constant h. Show the actual historical data point by point, as if doing the 1916 Millikan experiment in real time. Make the message clear: this video demo is how one of the most fundamental constants in quantum mechanics was first measured. Then pivot: show the solar panel. Plot the photovoltaic I-V curve. Show how only photons above the band gap contribute. Show why spectrum-matching (silicon is great for visible light) is the key challenge in photovoltaics. Make the quantum feel engineered and practical, not abstract.

## The Interactive Demo

Canvas simulation at 1000 × 600 px. Left panel: the physical setup. Right panel: graphs and controls.

**Light frequency slider** (300–800 nm wavelength, labeled in nm and also eV): Ray color changes with wavelength. Below threshold: ray is shown dimmed with a red border ("below threshold"). Above threshold: ray glows brightly with a checkmark. Threshold frequency for the selected material shown as a marker on the slider.

**Intensity slider** (0.1 to 100 W/m²): Controls photon emission rate. Below threshold: zero effect on ejection regardless of intensity. Above threshold: controls the ejection rate (more photons = more electrons = higher current).

**Material selector** (dropdown): Zinc (φ = 4.3 eV), Sodium (φ = 2.28 eV), Gold (φ = 5.1 eV), Silicon (φ = 4.05 eV), Cesium (φ = 2.1 eV). Work function and threshold frequency display updates.

**Model toggle** (Classical Wave / Quantum Photon): Switching to Classical shows the wrong behavior — continuous ejection at any frequency given enough intensity. Switching to Quantum shows correct behavior. Side by side comparison mode available.

**Stopping voltage slider** (−5 V to +5 V): Apply retarding or accelerating voltage. Current meter shows real-time electron collection. At stopping voltage, current → 0. "Find stopping voltage" button automatically sets it.

**KE histogram:** Live histogram of ejected electron kinetic energies. In quantum mode: sharp peak at KE = hf − φ. In classical mode: broad distribution. The sharp quantum peak vs the smeared classical distribution is visually striking.

**Planck's constant derivation panel:** Table of (frequency, stopping voltage) data points collected during the session. "Fit line" button draws best-fit line through points and displays derived h value with percentage error from the true value.

## Production Notes

**Runtime estimate:** ~13–15 minutes. Hook (1.5 min), Naive code (2.5 min), Failure (2 min), Physics/history (3 min), Fix (2 min), Wow/Millikan (2.5 min), Interactive demo (1.5 min).

**Screen layout:** For this episode, the canvas is more physics-simulation than code — use a 70/30 split favoring canvas, with code appearing as callout overlays when key lines are shown. The photoelectric setup (zinc plate, lamp, ammeter) should be rendered cleanly — not just schematic but visually appealing with glowing electrons and a swinging ammeter needle.

**Animations to prepare:** Historical timeline animation: Newton (wave theory fails here) → Maxwell (wave equations) → Hertz (discovers photoelectric effect, 1887) → Planck (quantization of blackbody radiation, 1900) → Einstein (photon explanation, 1905) → Millikan (confirms with precision experiment, 1916). The wave-vs-photon intuition animation: continuous wave approaching the plate vs discrete bullets. The solar cell diagram showing band gap and spectral efficiency.

**Key zoom moments:** (1) The ammeter needle swinging to zero when switching from UV to red — hold on this for 3 seconds with no narration. Let the silence make the point. (2) The moment in the quantum model code where `photonEnergy < workFunction` returns false — highlight this condition as the entire explanation. (3) The Planck's constant derivation — the moment the fitted slope resolves to a number close to 6.626 × 10⁻³⁴ on screen.

**B-roll:** Historical photos of Robert Millikan's lab setup. An actual solar panel in sunlight. A photomultiplier tube (PMT) — these look beautiful and alien. The aurora borealis (photoelectric effect in Earth's upper atmosphere — UV from the sun ejects electrons from atmospheric atoms, which then recombine and emit light).

**Historical note to script:** Einstein was offered the Nobel for Special or General Relativity by many commentators — but the committee specifically cited the photoelectric effect paper in the 1921 prize, awarded in 1922. Einstein was away on a trip when it was announced. The photoelectric effect was more directly verifiable by experiment, which the committee preferred.

## Tags
`physics` `quantum` `photoelectric-effect` `photons` `planck` `einstein` `javascript` `canvas` `beginner`

## Thumbnail

Split-screen with a deliberate visual contrast: LEFT side shows a massive array of red LEDs blazing at full power, pointing at a metal plate — ammeter flat at zero. RIGHT side shows a single dim UV lamp pointed at the same plate — ammeter needle pegged to maximum. Bold text across the center: "MORE LIGHT, FEWER ELECTRONS?" Subtext below: "Einstein's Nobel wasn't for Relativity." Red glow on left, purple/UV glow on right. The ammeter readings are clearly visible — zero on the left, maximum on the right. Emotion: "This shouldn't be possible." The Einstein name-drop in the subtext adds credibility and intrigue. The visual contradiction of "more light = fewer electrons" is immediately arresting and demands explanation.
