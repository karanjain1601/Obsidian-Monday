---
title: "CT Scan: 360° X-Rays Build a 3D Image"
id: SB186
type: youtube-short
duration: "~45 seconds"
feeds_video: "Standalone beginner short"
difficulty: beginner
tags: [physics, simulation, short, medical-physics, CT-scan, X-ray]
---

> **What it is:** A ~45-second simulation short where an X-ray fan beam sweeps 360° around a body cross-section filling a sinogram row by row, then filtered back-projection unscrambles all 360 projections into a crisp axial CT slice with bone, soft tissue, and lung distinguished by Hounsfield Units. Part of the **CodedLaws** YouTube Shorts library.
> **Difficulty:** Beginner | **Feeds:** Standalone

# Short: CT Scan: 360° X-Rays Build a 3D Image

**Feeds full video:** Standalone beginner short

## Visual Hook (First 3 Seconds)
Looking straight into a CT scanner bore. The ring of detectors (white arc) rotates around a grey circular object (cross-section of a human torso). Thin white X-ray fan beams sweep around 360 degrees at high speed — blurring into a full white ring. The rotation stops — and a sharp, detailed axial CT slice appears in the center.

## Main Visual Sequence (0:03–0:50)
**0:03** — Schematic top-down cross-section. Patient slice (grey oval, 35 cm diameter) in center. X-ray tube (yellow icon, "120 kVp") and detector arc (white curved bar, "900 detectors") on opposite sides, both mounted on a rotating gantry. Gantry rotation arrow shown: 0.5 s per revolution.

**0:08** — Simulation begins. X-ray fan beam (thin yellow fan shape) sweeps from 0° to 360°. At each of 360 angles (shown as step counter: 1°, 2°, 3°…), the detector records an attenuation profile — a horizontal strip appears on a sinogram display (right panel). Sinogram fills up row by row, bright lines tracing bone (white), soft tissue (grey), air (black).

**0:18** — Rotation complete. Sinogram (360 rows × 900 columns) fully assembled. Label: "Sinogram = 360 projections". Pause 1 s on the sinogram — viewers can see the sinusoidal paths of bone and soft tissue structures.

**0:22** — Title card: "BACK-PROJECTION" (white text, 1 s).

**0:23** — Back-projection animation. A blank grey disc (the reconstructed slice plane) starts empty. Each of the 360 projection strips is "smeared" back across the disc at its original angle — grey streaks build up, bright where bone absorbs heavily. After all 360 smears, a blurry but recognizable cross-section appears (ribs, spine, lungs visible as dark regions).

**0:33** — Ram-Lak filter applied (ramp filter in frequency domain): the blurry smear sharpens instantly into a crisp axial CT slice. Lung tissue (black, HU = −900), soft tissue (grey, HU = 0–80), bone (bright white, HU = 700). Hounsfield Unit scale bar appears on right edge.

**0:40** — Stack of 50 axial slices appears and animates into a 3D volume rendering (bone white, lung transparent dark, soft tissue semi-transparent). Rotate 90 degrees — coronal view shows lungs and mediastinum. Label: "3D CT reconstruction".

**0:45** — Final: one clean axial slice with labeled anatomy. Caption: "360 X-ray snapshots → full cross-section in 0.5 s".

## Physics Concept Teased
CT scanning collects X-ray attenuation measurements from 360 angles around the patient; a mathematical technique called filtered back-projection (using the Radon transform and its inverse) converts these projections into a 2D cross-sectional image where each pixel's value reflects local tissue density in Hounsfield Units.

## On-Screen Text / Captions
- **0:00** — "360 X-ray snapshots. One cross-section. 0.5 seconds."
- **0:03** — "X-ray Tube: 120 kVp | 900 Detectors"
- **0:08** — "Each angle = one attenuation profile"
- **0:18** — "Sinogram: 360 projections assembled"
- **0:22** — "BACK-PROJECTION"
- **0:23** — "Each projection smeared back across image plane"
- **0:33** — "Ramp filter sharpens → CT slice"
- **0:33** — "Bone: HU=700 | Tissue: HU=0–80 | Lung: HU=−900"
- **0:40** — "50 slices → 3D volume in seconds"
- **0:45** — "CT = Computed Tomography = Radon Transform in reverse"

## End Card
**0:47–0:50** — Dark background. Rotating 3D CT volume of human thorax (bone white on black). Bold text: "CT SCAN — Physics Series". "@CodedLaws". Subscribe button pulses.

## Audio
- **Music:** Precise, rhythmic electronic — mechanical, slightly clinical, 100 BPM. Gantry rotation rhythm synced to beat.
- **Voiceover:** "Each row of the sinogram is one X-ray snapshot — and filtered back-projection is the math that unscrambles all 360 of them into a single crisp image." (0:18–0:35, calm male voice).
- **SFX:** Whirring gantry rotation sound (0:03–0:18); digital "ping" for each projection added to sinogram (fast, rhythmic, 4/s); sharp "click" when ramp filter sharpens the image (0:33).

## Production Notes
- **Renderer:** Python + NumPy + Matplotlib. Use scipy.ndimage's Radon transform to generate a real sinogram from a Shepp-Logan phantom or simple ellipse geometry. Apply ramp filter via FFT, then back-project.
- **Code complexity:** Medium-high. Radon transform and filtered back-projection are well-documented in scipy.transform.radon — the challenge is animating the sinogram filling and the back-projection smear step-by-step.
- **Key visual trick:** Animate each back-projection "smear" as a faint grey line sweeping across the disc at the correct angle — as they accumulate, bright regions emerge where multiple smears overlap (constructive summation = high attenuation = bone).
- **Runtime:** Sinogram fill sequence (0:08–0:18) can be sped up 10× so all 360 rows draw in 10 s on screen. Back-projection (0:23–0:33) show 12 selected angles with pauses, then fast-forward the rest.
- **Gotchas:** Without the ramp filter, back-projection produces a heavily blurred image — show this intermediate "unfiltered" result before applying the filter to make the filter's role visually obvious.
