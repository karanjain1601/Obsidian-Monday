---
title: "Why Euler Angles Made My Spaceship Do a Barrel Roll for No Reason"
season: 3
episode: 29
difficulty: 7.5/10
concept: "Quaternions and gimbal lock in 3D rigid body rotation"
prereq: "E06, E14, E15 (force and torque concepts in simpler contexts)"
tags: [quaternions, rigid-body-simulation, gimbal-lock, inertia-tensor, 3D-physics, three.js, javascript, angular-momentum, Euler-angles, Dzhanibekov-effect]
type: playlist-video
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
*Part of [[_MOC_YouTube_Channel|CodedLaws]] · [[Playlist/Season_3/_Season_3_Overview|Season 3 Overview]]*
