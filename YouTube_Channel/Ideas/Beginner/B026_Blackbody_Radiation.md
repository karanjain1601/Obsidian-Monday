---
title: "Why Hot Metal Glows Red, Then White, Then Blue (Blackbody Radiation)"
id: B026
difficulty: 2/10
prereq: "None"
concept: "Planck's law and Wien's displacement law: λ_max·T = 2.898×10⁻³ m·K"
tags: [physics, quantum, blackbody, planck, wien, temperature, javascript, canvas, beginner]
category: beginner
type: video-idea
---

# Why Hot Metal Glows Red, Then White, Then Blue (Blackbody Radiation)

**Alt title:** Every Hot Object Has the Same Glow Curve — Coded in JavaScript
**Difficulty:** 2/10 | **Prereq:** None

---

## Opening Hook (0:00–1:00)

Open on a blacksmith's forge in close-up. A piece of steel is being heated. At first it is room temperature — dull, gray, cold. As heat is applied, the steel begins to emit a deep, dark red glow — barely visible, almost infrared. More heat: a clear red, like an ember. More: bright orange. More: yellow-orange. More: brilliant yellow-white. If the equipment allowed: blue-white, like a welding arc. Stop the footage and say: "This progression is not specific to steel. It is not specific to any material. Every heated object in the universe, if it is a good absorber of light (what physicists call a blackbody), follows exactly this same color sequence at exactly the same temperatures. The color is a direct measurement of temperature — you are looking at a thermometer that works without contact."

Now show three stars. The red dwarf Proxima Centauri: deep red-orange, surface temperature 3,042 K. Our Sun: yellow-white, 5,778 K. A blue supergiant like Rigel: intense blue-white, 12,000 K. Different masses, different ages, different distances — but the color is purely a temperature readout. Then show the cosmic microwave background: the entire universe is a blackbody at T = 2.725 K, peaking in millimeter microwaves — invisible to human eyes but detectable by radio telescopes, the thermal afterglow of the Big Bang. All of this from a single equation: Planck's law. "Let's code it."

## The Naive Attempt

Before coding Planck's law, code the classical alternative: the Rayleigh-Jeans law, derived from classical thermodynamics and electromagnetism by Rayleigh in 1900 and corrected by Jeans in 1905. The classical prediction treats each electromagnetic mode of the cavity as having average energy k_B·T (equipartition theorem). This gives spectral radiance:

**B_RJ(λ, T) = 2ck_BT / λ⁴**

Code this as:

```javascript
const c = 3e8;   // speed of light
const kB = 1.38e-23; // Boltzmann constant

function rayleighJeans(lambda, T) {
  return (2 * c * kB * T) / Math.pow(lambda, 4);
}
```

Plot B_RJ vs. wavelength from λ = 100 nm (deep UV) to λ = 2000 nm (near-IR), with the visible spectrum (380–700 nm) highlighted. Choose T = 5,778 K (Sun's surface temperature) to make it directly relevant. Evaluate and plot. The classical formula gives values that increase monotonically as wavelength decreases. The curve has no peak — it keeps rising into the ultraviolet and beyond. At short wavelengths (100 nm), the predicted radiance is enormous. Extrapolate to even shorter wavelengths: the curve diverges. "The classical prediction says the Sun radiates infinite energy in the ultraviolet and X-ray. In 1900, physicists called this the 'ultraviolet catastrophe.' It was the most embarrassing failure of classical physics."

## The Moment of Failure

Show the Rayleigh-Jeans curve on the canvas with a logarithmic y-axis — even with log scale, the curve shoots off the top of the screen at short wavelengths. Compute the total integrated radiated power by summing over all wavelengths: even with a finite wavelength range starting at 10 nm, the classical total power is millions of times larger than the actual solar luminosity. At wavelengths below 300 nm, the classical formula predicts the Sun should be radiating more energy in the UV per unit wavelength than a nuclear weapon detonating per second. The numbers are not slightly wrong — they are catastrophically, infinitely wrong.

Show on screen: at λ = 200 nm, Rayleigh-Jeans predicts B = 2 × 10⁴⁰ W/(m²·sr·m). The actual solar UV spectral radiance at 200 nm is about 2 × 10⁸ W/(m²·sr·m) — a factor of 10³² different. Then show the experimental data curve: the actual spectral radiance peaks around 500 nm (green light), then falls steeply on both sides. The real curve is a smooth hump, not a monotonically rising divergence. Classical physics is not just quantitatively wrong — it predicts the wrong shape, the wrong behavior, and a physically impossible (infinite energy) result. This was not a minor correction needed — it required abandoning a fundamental assumption of classical physics.

## Why It Broke — The Physics

The Rayleigh-Jeans law fails because it applies the equipartition theorem equally to all electromagnetic modes. Classical physics says each mode gets k_BT of energy regardless of frequency. There are infinitely many modes at short wavelengths (high frequencies), and each gets k_BT — hence infinite total energy. This is the ultraviolet catastrophe.

In 1900, Max Planck resolved this by making a radical assumption: electromagnetic energy comes in discrete packets (quanta) of size E = hν = hc/λ, where h = 6.626 × 10⁻³⁴ J·s is Planck's constant. At short wavelengths (high frequencies), the quantum energy hc/λ becomes much larger than k_BT. The probability of exciting even one quantum of such high energy is exponentially suppressed by the Boltzmann factor e^(−hc/λkT). This kills the high-frequency modes, eliminating the ultraviolet catastrophe.

Planck's law for spectral radiance:

**B(λ, T) = (2hc²/λ⁵) / (exp(hc/λkT) − 1)**

The denominator's "−1" is a quantum statistical effect (Bose-Einstein distribution). At long wavelengths (hc/λkT << 1), the exponential can be approximated as 1 + hc/λkT, and the Planck formula reduces to the Rayleigh-Jeans law — classical physics is recovered in the low-frequency (long wavelength) limit.

The peak of B(λ, T) occurs where dB/dλ = 0. Solving this transcendental equation yields Wien's displacement law:

**λ_max · T = b = 2.898 × 10⁻³ m·K**

As temperature rises, λ_max decreases — the peak shifts to shorter (bluer) wavelengths. At 1,000 K: λ_max = 2,898 nm (far infrared — objects glow red because the lower-wavelength tail of the peak enters the visible spectrum). At 5,778 K: λ_max = 501 nm (green — the visible peak, explaining why the Sun's light appears yellow-white overall). At 30,000 K: λ_max = 97 nm (UV — the object appears blue-white in the visible range because the Planck curve's red side covers the entire visible spectrum uniformly with a slight blue bias).

## The One Concept

Blackbody radiation describes the electromagnetic spectrum emitted by a perfect absorber (blackbody) in thermal equilibrium at temperature T. The spectrum is given by Planck's law — the first quantum mechanical formula in history. The peak wavelength follows Wien's displacement law (λ_max = b/T), shifting to shorter wavelengths at higher temperatures. The total power radiated grows as T⁴ (Stefan-Boltzmann law: P = σAT⁴, σ = 5.67 × 10⁻⁸ W/(m²·K⁴)).

**Physical intuition:** At higher temperatures, thermal energy (k_BT) is larger. More high-frequency photons can be excited because k_BT is large enough to pay the quantum energy price hν. The distribution shifts toward higher frequencies (shorter wavelengths). At low temperatures, most thermal energy is too small to excite visible photons — the object emits only infrared, appearing cold and dark to our eyes despite emitting thermal radiation.

**Key equations:** Planck's law: B(λ,T) = (2hc²/λ⁵)/(e^(hc/λkT) − 1). Wien's law: λ_max = b/T. Stefan-Boltzmann: P/A = σT⁴. For T = 5,778 K: λ_max = 501 nm, P/A = 6.3 × 10⁷ W/m².

**Real-world examples:**
1. **Stellar classification:** Stars are classified by their spectral type (O, B, A, F, G, K, M) which directly corresponds to surface temperature from hottest (O: 30,000+ K, blue) to coolest (M: 2,500–3,500 K, red). Our Sun is a G-type star (5,778 K).
2. **Thermal cameras:** Infrared cameras detect blackbody radiation at body temperature (310 K, peak at 9.4 μm — mid-infrared). A person glows brightly in IR even in a dark room because of their thermal emission.
3. **CMB cosmology:** The cosmic microwave background is a near-perfect blackbody at T = 2.725 K, peaking at 1.06 mm wavelength. It is the most perfect blackbody spectrum ever measured, confirmed by COBE satellite to better than one part in 10,000. This proves the early universe was in thermal equilibrium.
4. **Incandescent bulbs:** A tungsten filament at 3,000 K has λ_max = 966 nm (near-IR). Most energy is wasted as infrared heat; only 5% of power becomes visible light. LED bulbs replace thermal emission with electroluminescence, allowing far greater efficiency.

## The Fix

Replace the Rayleigh-Jeans formula with Planck's law. Constants in SI units:

```javascript
const h = 6.626e-34;  // Planck's constant (J·s)
const c = 3e8;        // speed of light (m/s)
const kB = 1.38e-23;  // Boltzmann constant (J/K)

function planck(lambda, T) {
  const exponent = (h * c) / (lambda * kB * T);
  if (exponent > 709) return 0; // prevent overflow for very short wavelengths
  return (2 * h * c * c) / (Math.pow(lambda, 5) * (Math.exp(exponent) - 1));
}
```

Plot over λ = 100 nm to 3,000 nm. The curve now shows a clear peak at λ_max = 2.898e-3 / T nanometers. Both the Planck and Rayleigh-Jeans curves on the same plot — they agree at long wavelengths (right side of peak) and diverge dramatically at short wavelengths (left side). Draw the visible spectrum (380–700 nm) as a rainbow-colored band on the horizontal axis.

To compute the color of the blackbody at temperature T, integrate B(λ, T) weighted by the CIE color matching functions x̄(λ), ȳ(λ), z̄(λ) to get XYZ color space coordinates, then convert to sRGB. Display the resulting color as a glowing rectangle labeled with the temperature. This produces the correct red → orange → yellow → white → blue-white progression as T increases.

## The Wow Moment — Push It

Render a 3D scene using three.js with objects at different temperatures, each glowing with the physically correct blackbody color computed in real time. Place a dim red star (3,000 K), a Sun-like star (5,778 K), and a blue supergiant (15,000 K) — each a sphere with a glow material whose color is computed from Planck's law. Vary T with a slider and watch the color smoothly transition. At T = 1,000 K, the sphere is deep red, barely glowing. At 3,000 K, clearly red-orange. At 5,778 K, warm white. At 10,000 K, bright blue-white.

Then show the Hertzsprung-Russell diagram: plot luminosity vs. temperature for real stars, color-coded by their blackbody color. The main sequence runs from bottom-right (dim, cool, red) to top-left (luminous, hot, blue). Stars are points on a graph, but the coloring from Wien's law makes the HR diagram visually intuitive and correct.

Finally, show the CMB. Set T = 2.725 K. The Planck curve peaks at λ = 1.06 mm — radio waves, completely outside the visible spectrum. The universe is uniformly glowing — but in microwaves, not light. Show the temperature anisotropy map of the CMB (WMAP/Planck satellite data) — the tiny temperature variations (ΔT/T ≈ 10⁻⁵) that seeded all cosmic structure. The peaks and valleys of this map are the seeds of galaxies and galaxy clusters — all from blackbody physics applied at cosmological scales.

## The Interactive Demo

Browser-based interactive spectral curve plotter and object color calculator.

**Controls:**
- **Temperature slider** (300 K to 50,000 K, logarithmic scale): Changes T in real time. The spectral curve updates instantaneously. The color preview rectangle updates to show the correct blackbody color for that temperature.
- **Classical vs quantum toggle:** Switch between Rayleigh-Jeans and Planck curves. At short wavelengths, the classical curve shoots off screen; the quantum curve has a clean peak. The visual contrast makes the "catastrophe" immediately obvious.
- **Wavelength range selector:** Zoom into the visible spectrum, the UV, or the infrared region of the Planck curve.
- **Multiple temperatures overlay:** Add up to 5 temperature curves on the same plot. Compare the Sun, a red dwarf, and a blue supergiant simultaneously. Each curve is labeled and color-coded.
- **Star classification panel:** Click on star type buttons (O, B, A, F, G, K, M) to automatically set the temperature to the midpoint of each class. Show the corresponding color and peak wavelength.
- **Color display:** A rectangle showing the actual color of the glowing blackbody at the selected temperature. Includes the hex color code.
- **Peak wavelength indicator:** Dashed vertical line on the spectral curve at λ_max = b/T, labeled with the wavelength.
- **Stefan-Boltzmann display:** Real-time calculation and display of σT⁴ (power per unit area) as temperature changes. Show how T⁴ scaling means doubling temperature increases power 16×.
- **CMB mode:** Set to T = 2.725 K. The peak moves to millimeter wavelengths. Show the CMB temperature map as a background image.
- **Infrared camera mode:** Set to T = 310 K (body temperature). Show the peak in the mid-infrared. Display a simulated thermal camera image with a human figure glowing in IR.

## Production Notes

**Runtime target:** ~13 minutes. Hook: 1.5 min. Naive code: 2 min. Failure: 1.5 min. Physics: 3 min. Fix: 2 min. Wow moment: 2 min. Demo: 1 min.

**Screen layout:** The spectral curve plot is central — give it the full width of the canvas. Code editor appears in a side panel during development, then collapses for the demo. The color preview rectangle should be large and prominent — it is the most visually compelling element.

**Animations to pre-render:** (1) Steel being heated in a forge — color progression from dark red to white-hot, (2) star color gallery (red dwarf, Sun, blue supergiant) side by side, (3) animated comparison of Rayleigh-Jeans vs Planck curves showing the catastrophe, (4) CMB temperature map from WMAP or Planck satellite (ESA/NASA public domain).

**Key moments to zoom:** When the classical Rayleigh-Jeans curve shoots off the screen (add a dramatic "INFINITY" label at the top with a broken axis mark), the first time the Planck curve produces a peak, and the star color gallery in the wow segment.

**B-roll:** Blacksmith footage, starfield with clearly different stellar colors, Planck satellite CMB map.

**Historical note to include:** Planck did not initially believe his own formula implied real quantization — he thought it was a mathematical trick. Einstein's 1905 photoelectric effect paper established that the quantization was real. Tell this story briefly; it adds the human element and historical drama.

## Tags

`physics` `quantum` `blackbody` `planck` `wien` `temperature` `javascript` `canvas`

## Thumbnail

Left half of the frame: a dramatically lit piece of steel glowing brilliant orange-white in a dark forge, close-up shot with shallow depth of field so the glow has a rich halo. Right half: a clean JavaScript canvas showing the Planck spectral curve as a smooth bell-shaped arc, with a vertical rainbow band representing the visible spectrum overlaid on the x-axis. The curve peak sits squarely in the yellow-green region. The steel's glow color and the position of the peak visually correspond — making the connection immediate. Top text: "WHY METAL GLOWS RED THEN BLUE" in bold white. Small bottom text: "Planck's Quantum Formula, Coded." The steel glow image is emotionally arresting — it is hot, powerful, dramatic — and the adjacent formula visualization makes the thumbnail educational without being dry. The viewer sees both the phenomenon and the hint of the explanation, triggering curiosity.
