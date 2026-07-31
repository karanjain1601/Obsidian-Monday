---
title: "Limbic System and Diencephalon"
aliases: [Limbic System, Diencephalon, Hypothalamus, Thalamus, Amygdala, Hippocampus Anatomy]
tags: [Neuroscience, Neuroanatomy, LimbicSystem, Emotion, Memory]
domain: Neuroscience
section: Neuroanatomy and Brain Structure
created: 2026-07-31
related: ["[[Gross_Anatomy_of_the_Brain]]", "[[Learning_and_Memory_Systems]]", "[[Decision_Making_and_Reward_Circuits]]", "[[Sleep_and_Circadian_Rhythms]]", "[[Psychiatric_Disorders_and_Neurobiology]]"]
status: complete
---

# Limbic System and Diencephalon

> [!abstract] TL;DR
> The limbic system is a set of interconnected cortical and subcortical structures — including the hippocampus, amygdala, and cingulate cortex — that collectively govern emotion, memory encoding, and motivated behavior; it is a functional circuit, not a single anatomical unit. The diencephalon sits at the brain's core and contains the thalamus, which relays nearly all sensory and motor signals to the cortex, and the hypothalamus, which maintains homeostasis by coordinating the endocrine and autonomic nervous systems. Together, these regions form the interface between the visceral body, the emotional brain, and conscious cognition.

---

## Intuition — analogy FIRST

Picture a large metropolitan transit hub (the thalamus) at the center of a city. Every subway line from every neighborhood (sensory and motor cortices) passes through this hub: nothing reaches the city's executive district (prefrontal cortex) without stopping here first. Adjacent to the hub, a building-sized thermostat and life-support panel (the hypothalamus) monitors temperature, blood sugar, hydration, and hormonal levels around the clock, silently issuing commands to the body's mechanical systems.

Deeper in the same district, a hair-trigger alarm system (the amygdala) watches every incoming signal for threats, tagging experiences as dangerous or safe before consciousness has time to deliberate. A few blocks away, a GPS navigation and filing cabinet hybrid (the hippocampus) converts short-term experiences into permanent records and tracks your position in space.

The Papez circuit is the internal mail loop that connects these buildings: memory-tagged information cycles continuously through hippocampus, fornix, mammillary bodies, thalamus, and cingulate cortex before being filed or discarded. The diencephalon (thalamus + hypothalamus) is the relay-and-regulation core; the limbic system is the emotional-memory wrapper around it.

---

## How It Works

The diencephalon occupies the central portion of the brain between the midbrain (below) and the telencephalon (above). It contains four divisions: thalamus, hypothalamus, epithalamus (pineal gland, habenula), and subthalamus. The limbic system is not a formal anatomical division but a functional circuit that includes allocortical and paleocortical regions along with several subcortical nuclei.

### Papez Circuit

James Papez proposed in 1937 that emotion was not a cortical function but arose from a circuit connecting hippocampal, diencephalic, and cingulate structures. Modern work has confirmed and refined this loop as the backbone of declarative memory consolidation:

1. **Hippocampus (subiculum)** — encodes episodic and spatial information; output travels via the fornix.
2. **Fornix** — the major white matter tract of the limbic system; postcommissural fibers project to the mammillary bodies.
3. **Mammillary bodies** — small nuclei at the floor of the hypothalamus; relay station linking hippocampus to thalamus.
4. **Mammillothalamic tract (of Vicq d'Azyr)** — fiber bundle projecting from mammillary bodies to the anterior nucleus of the thalamus.
5. **Anterior nucleus of the thalamus** — reciprocally connected to cingulate cortex; participates in both memory and spatial orientation.
6. **Cingulate cortex (areas 24/25/31)** — integrates emotional salience with conscious awareness; output travels via the cingulum bundle toward entorhinal cortex.
7. **Entorhinal cortex** — the gateway to the hippocampus; receives convergent inputs from across association cortex and projects back via the perforant path, completing the loop.

### Hypothalamic Control Circuits

The hypothalamus integrates the limbic system with the body's visceral machinery through three axes:
- **HPA axis (stress):** PVN → CRH → anterior pituitary → ACTH → adrenal cortex → cortisol (feeds back to inhibit PVN and hippocampus).
- **HPG axis (reproduction):** arcuate/preoptic → GnRH → anterior pituitary → LH/FSH → gonads → sex steroids.
- **HPT axis (metabolism):** PVN → TRH → anterior pituitary → TSH → thyroid → T3/T4.

### Circuit Diagram

```mermaid
graph LR
    HIPP["Hippocampus (CA1/Subiculum)"]
    FORNIX["Fornix"]
    MAMM["Mammillary Bodies"]
    ANT_TH["Anterior Nucleus of Thalamus"]
    CING["Cingulate Cortex"]
    ENTORH["Entorhinal Cortex"]
    AMYG["Amygdala (BLA/CeA)"]
    PVN["Hypothalamus (PVN)"]
    PITUITARY["Anterior Pituitary"]
    ADRENAL["Adrenal Cortex"]
    CORTISOL["Cortisol (feedback)"]

    HIPP -->|"postcommissural fornix"| FORNIX
    FORNIX --> MAMM
    MAMM -->|"mammillothalamic tract"| ANT_TH
    ANT_TH -->|"anterior thalamic radiations"| CING
    CING -->|"cingulum bundle"| ENTORH
    ENTORH -->|"perforant path"| HIPP
    AMYG -->|"fear/salience signal"| HIPP
    AMYG -->|"autonomic drive"| PVN
    PVN -->|"CRH"| PITUITARY
    PITUITARY -->|"ACTH"| ADRENAL
    ADRENAL -->|"cortisol"| CORTISOL
    CORTISOL -->|"negative feedback"| PVN
    CORTISOL -->|"negative feedback"| HIPP
```

---

## Key Concepts

### Secondary Level

**Thalamus as relay hub.** Almost all sensory signals (except olfaction, which projects directly to piriform cortex) synapse in the thalamus before reaching the cortex. The thalamus also regulates the level of cortical arousal — during sleep it "gates" incoming signals, preventing environmental stimuli from reaching awareness.

**Hypothalamus as survival center.** The hypothalamus regulates hunger, thirst, body temperature, circadian rhythm, sexual behavior, and the stress response. It exerts control via direct autonomic pathways (sympathetic and parasympathetic) and via hormonal release into the hypothalamo-hypophyseal portal circulation reaching the anterior pituitary.

**Amygdala as emotional alarm system.** The amygdala rapidly evaluates stimuli for emotional significance — particularly threat — and triggers fear and anxiety responses. It receives input from thalamus (fast, low-resolution "quick-and-dirty" route) and from cortex (slow, high-resolution route). This dual-route architecture (LeDoux) allows an immediate defensive response before full perceptual analysis.

**Hippocampus as memory and navigation.** The hippocampus is essential for encoding new declarative (explicit) memories — facts and events. It is not a permanent store; memories are gradually transferred to neocortex during sleep through hippocampal replay. It also contains place cells that encode spatial position.

**Cingulate cortex.** The anterior cingulate cortex (ACC) monitors conflict, allocates attention, and integrates affective and cognitive information. The posterior cingulate cortex (PCC) is a hub for self-referential processing and spatial memory retrieval.

---

### Undergraduate Level

**Specific thalamic nuclei and their roles:**

| Nucleus | Input | Output | Function |
|---------|-------|--------|----------|
| VPL (ventral posterolateral) | Spinothalamic tract, medial lemniscus | Primary somatosensory cortex (S1) | Touch, pain, temperature from body |
| VPM (ventral posteromedial) | Trigeminal pathways | Primary somatosensory cortex (S1) | Touch, pain from face |
| LGN (lateral geniculate nucleus) | Optic tract | Primary visual cortex (V1) | Vision |
| MGN (medial geniculate nucleus) | Inferior colliculus | Primary auditory cortex (A1) | Hearing |
| Pulvinar | Superior colliculus, association cortex | Association cortices (parietal, temporal) | Attentional modulation, multisensory integration |
| Anterior nucleus | Mammillary bodies | Cingulate cortex | Memory, Papez circuit |
| MD (mediodorsal) | Amygdala, prefrontal cortex | Prefrontal cortex | Emotion, decision-making |

**Hypothalamic nuclei and functions:**

| Nucleus | Function |
|---------|----------|
| Suprachiasmatic nucleus (SCN) | Master circadian clock; receives direct retinal input (retinohypothalamic tract) |
| Paraventricular nucleus (PVN) | CRH and TRH release; osmotic regulation (vasopressin); autonomic control |
| Arcuate nucleus | Appetite regulation (NPY/AgRP vs. POMC neurons); GnRH-associated peptide; dopamine to pituitary |
| Lateral hypothalamic area (LHA) | Hunger drive; orexin/hypocretin neurons (also regulate sleep and arousal) |
| Ventromedial hypothalamus (VMH) | Satiety; sexual behavior; glucose sensing |
| Preoptic area (POA) | Thermoregulation; sleep induction (VLPO); sexual differentiation |
| Supraoptic nucleus (SON) | Vasopressin and oxytocin synthesis; released from posterior pituitary |

**HPA axis in detail.** Under stress, the PVN releases CRH into the portal system. CRH binds to CRH-R1 receptors on pituitary corticotrophs, stimulating ACTH release. ACTH travels in blood to the adrenal cortex, stimulating cortisol synthesis and secretion. Cortisol exerts negative feedback at three levels: the hypothalamus (suppresses CRH), the anterior pituitary (suppresses ACTH), and the hippocampus (which has high GR density and signals further inhibition). Glucocorticoid excess (as in Cushing's disease) damages the hippocampus, impairing memory and contributing to depression.

**Amygdala: basolateral complex vs. central nucleus.**
- **Basolateral amygdala (BLA):** receives sensory inputs from thalamus and cortex; performs emotional valuation and associative fear learning (CS-US pairing). Contains pyramidal-like principal neurons and GABAergic interneurons.
- **Central nucleus (CeA):** the output hub; projects to hypothalamus (endocrine stress response), brainstem (autonomic fear responses), and PAG (freezing behavior). The CeA is the "output amplifier" of fear.

**Hippocampal subfields.** The hippocampus is organized along a tri-synaptic circuit:
1. **Entorhinal cortex → dentate gyrus (DG)** via perforant path (pattern separation).
2. **DG → CA3** via mossy fiber pathway (sparse, high-fidelity encoding; CA3 is the site of pattern completion via recurrent collaterals).
3. **CA3 → CA1** via Schaffer collateral pathway (the classic site for LTP induction; CA1 is the output module projecting to subiculum and entorhinal cortex).

The DG receives input from layer II of entorhinal cortex; CA1 receives direct input from layer III (the temporoammonic pathway), allowing CA3 and entorhinal predictions to be compared.

---

### Graduate Level

**Thalamocortical loops and sleep spindles.** During NREM sleep, thalamocortical circuits switch from tonic to burst firing mode. The reticular nucleus of the thalamus (TRN) — a GABAergic shell around the thalamus — inhibits thalamic relay neurons rhythmically, generating 12–15 Hz sleep spindles. These spindles are mechanistically coupled to hippocampal sharp-wave ripples (SWRs) and cortical slow oscillations to orchestrate memory consolidation: hippocampal SWRs replay recent experiences during the trough of cortical slow oscillations, and the coupling to spindles allows this information to be transferred to neocortex.

**The full hypothalamic-pituitary axes.**
- **HPA (stress):** see above. Dysregulation underlies melancholic depression (hypercortisolemia), PTSD (hypocortisolemia + enhanced GR sensitivity), and Cushing's syndrome.
- **HPG (reproduction):** GnRH is released in pulses from the arcuate nucleus; pulse frequency determines whether LH or FSH predominates. Kisspeptin neurons in the arcuate and anteroventral periventricular nucleus (AVPV) are the primary regulators of pulsatile GnRH. Continuous GnRH agonism paradoxically suppresses the axis (pharmaceutical exploitation for prostate cancer/endometriosis).
- **HPT (metabolism):** TRH → TSH → T3/T4. T3 is the active form; it exerts short-loop feedback at the pituitary and long-loop feedback at the hypothalamus. Hypothyroidism is the most common cause of acquired hypothalamic-pituitary dysfunction.

**Klüver-Bucy syndrome.** Bilateral amygdala lesions (originally described after temporal lobectomy in rhesus monkeys) produce: psychic blindness (visual agnosia — seeing but not recognizing the emotional significance of stimuli), hyperorality, hypersexuality, placidity (loss of fear), and dietary changes. In humans it is seen after herpes simplex encephalitis or severe bilateral temporal lobe damage. The syndrome demonstrates that the amygdala is not required for perception but is essential for attaching emotional significance to perceived objects.

**Hippocampal place cells and grid cells.** John O'Keefe (Nobel 2014) discovered that CA1 pyramidal neurons fire selectively when a rat occupies a specific location in space — these are "place cells," and their ensemble activity constitutes a cognitive map. Grid cells (Moser & Moser, Nobel 2014) are in the medial entorhinal cortex (MEC) and fire at the vertices of a triangular lattice, providing a coordinate metric. Head direction cells (in subiculum, presubiculum, and thalamus) provide directional orientation. Together these cells form the brain's GPS system.

**Fornix disconnection.** The fornix is a C-shaped white matter tract carrying 1.2–1.5 million axons from hippocampus to mammillary bodies (postcommissural) and to the septal nuclei (precommissural). Surgical transection (as in colloid cyst removal), compression (by a third ventricle tumor), or Wallerian degeneration (in Alzheimer's disease) causes dense anterograde amnesia. Diffusion tensor imaging (DTI) tractography of the fornix is now used as a biomarker of early Alzheimer's.

**Entorhinal cortex as gateway.** The entorhinal cortex (EC; Brodmann area 28/34) receives convergent projections from all major association cortices (temporal, parietal, prefrontal), making it the primary funnel for cortical information into the hippocampus. Layer II EC neurons project to DG and CA3 (perforant path); layer III neurons project directly to CA1 (temporoammonic path). Interestingly, EC is the first cortical region showing tau pathology in Alzheimer's disease (Braak stages I-II), explaining why episodic memory fails first.

**Optogenetic dissection of amygdala fear circuits.** Karl Deisseroth's group (2010–) has used channelrhodopsin-2 (ChR2) and halorhodopsin to selectively activate or silence BLA→CeA or BLA→mPFC projections with millisecond precision. Key findings: activating BLA pyramidal neurons is sufficient to drive fear conditioning; silencing BLA→mPFC but not BLA→CeA projections impairs fear extinction. This projection-specific manipulation is impossible pharmacologically, demonstrating that the amygdala's fear and extinction circuits run in parallel streams, not in series.

---

## Python Demo

```python
# HPA axis negative feedback model
# Based on Vinther et al. (2011) minimal 3-ODE model
# Variables: C = CRH, A = ACTH, F = cortisol
# Demonstrates how acute stress elevates cortisol, then negative feedback restores basal levels

import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp

def hpa_axis(t, y, s_c, d_c, k_fc, s_a, d_a, k_fa, s_f, d_f, stress_fn):
    """Minimal HPA axis ODE system."""
    C, A, F = y
    sigma = stress_fn(t)         # external stressor boosts CRH production
    dC = s_c * (1.0 + sigma) / (1.0 + k_fc * F) - d_c * C
    dA = s_a * C / (1.0 + k_fa * F) - d_a * A
    dF = s_f * A - d_f * F
    return [dC, dA, dF]

# Parameters (dimensionless, illustrative of real-scale ratios)
params = dict(
    s_c=0.5,   # basal CRH synthesis rate
    d_c=0.10,  # CRH degradation
    k_fc=2.0,  # cortisol inhibition strength on CRH
    s_a=1.0,   # ACTH synthesis per unit CRH
    d_a=0.20,  # ACTH degradation
    k_fa=1.5,  # cortisol inhibition strength on ACTH
    s_f=2.0,   # cortisol synthesis per unit ACTH
    d_f=0.15,  # cortisol degradation
)

# Stress function: brief acute stressor at t=20 to t=25
def stress_pulse(t):
    return 3.0 if 20.0 <= t <= 25.0 else 0.0

y0 = [1.0, 1.0, 1.0]   # basal concentrations
t_span = (0.0, 120.0)
t_eval = np.linspace(0.0, 120.0, 1200)

sol = solve_ivp(
    hpa_axis, t_span, y0, t_eval=t_eval, method="RK45",
    rtol=1e-7, atol=1e-9,
    args=(*params.values(), stress_pulse),
)

fig, axes = plt.subplots(2, 1, figsize=(10, 7), sharex=True)

# Panel 1: CRH and ACTH
axes[0].axvspan(20, 25, alpha=0.15, color="red", label="Acute stress")
axes[0].plot(sol.t, sol.y[0], color="#2196F3", lw=2, label="CRH (hypothalamus)")
axes[0].plot(sol.t, sol.y[1], color="#FF9800", lw=2, label="ACTH (pituitary)")
axes[0].set_ylabel("Concentration (a.u.)")
axes[0].set_title("HPA Axis: Negative Feedback Restores Homeostasis After Stress")
axes[0].legend(loc="upper right")
axes[0].set_ylim(0, None)

# Panel 2: cortisol
axes[1].axvspan(20, 25, alpha=0.15, color="red", label="Acute stress")
axes[1].plot(sol.t, sol.y[2], color="#4CAF50", lw=2, label="Cortisol (adrenal)")
axes[1].set_xlabel("Time (arbitrary units)")
axes[1].set_ylabel("Cortisol (a.u.)")
axes[1].legend(loc="upper right")
axes[1].set_ylim(0, None)

plt.tight_layout()
plt.savefig("hpa_axis_simulation.png", dpi=150)
plt.show()

peak_t = sol.t[np.argmax(sol.y[2])]
print(f"Peak cortisol: {sol.y[2].max():.2f} at t = {peak_t:.1f}")
print(f"Return to near-basal (<110% of y0): t = {sol.t[np.where(sol.y[2] > 1.1)[0][-1]]:.1f}")
```

The model shows three phases: (1) rapid CRH and ACTH elevation during the stressor, (2) cortisol peak ~5 time units after ACTH peak due to synthesis delay, and (3) full recovery to basal via glucocorticoid receptor-mediated suppression of PVN and pituitary. Chronic stress that prevents recovery causes hippocampal atrophy via excessive glucocorticoid receptor activation (Sapolsky, 1996).

---

## Real-World Applications

**Post-traumatic stress disorder (PTSD).** Neuroimaging of PTSD patients consistently shows amygdala hyperreactivity to threat cues, reduced hippocampal volume, and diminished medial prefrontal cortex (mPFC) activation. The mPFC normally suppresses amygdala responses once a threat is appraised as safe (extinction); its hypoactivity in PTSD means the amygdala remains chronically over-active. Paradoxically, PTSD is associated with low cortisol (not high), reflecting enhanced negative feedback sensitivity — the HPA axis is over-suppressed, not under-controlled.

**Alzheimer's disease.** The disease follows a stereotyped anatomical progression: entorhinal cortex → CA1 → neocortex (Braak staging). Hippocampal atrophy is detectable by MRI 10+ years before clinical diagnosis. The fornix degenerates early, disconnecting the Papez circuit. Deep brain stimulation (DBS) of the fornix is under investigation to restore memory network activity.

**Temporal lobe epilepsy (TLE).** Hippocampal sclerosis (CA1 and CA3 neuronal loss with DG mossy fiber sprouting) is the most common finding in drug-resistant TLE. Seizures originate in the hippocampal-entorhinal circuit and propagate along the Papez loop. Anterior temporal lobectomy (ATL), removing the hippocampus and amygdala on the seizure-generating side, controls seizures in ~70% of cases but risks verbal memory impairment if performed on the dominant (usually left) side.

**Hypothalamic disorders.** *Diabetes insipidus* results from vasopressin deficiency (central DI) or renal insensitivity (nephrogenic DI); the posterior pituitary/supraoptic nucleus is the anatomical locus. *Cushing's disease* is caused by a pituitary ACTH-secreting adenoma driving chronic cortisol excess; it produces hippocampal atrophy, immune suppression, hypertension, and centripetal obesity. *Hypothalamic obesity* from damage to the VMH (classically by craniopharyngioma surgery) eliminates satiety signaling and causes refractory weight gain.

**Deep brain stimulation (DBS) of the thalamus.** The ventral intermediate nucleus (VIM) of the thalamus is the standard DBS target for essential tremor and Parkinson's tremor. High-frequency stimulation (130 Hz) suppresses thalamic burst firing that drives motor tremor. The CM-Pf complex is a target for Tourette syndrome. The anterior nucleus is in clinical trials for refractory epilepsy (SANTE trial showed 69% seizure reduction at 5 years).

---

## Common Pitfalls

- **The limbic system is not one structure.** MacLean's "triune brain" model (reptilian/limbic/neocortex) is outdated and neurobiologically inaccurate. The limbic system is a loosely defined functional grouping; different authors include different structures. Treat it as shorthand for the hippocampal-amygdalar-cingulate-hypothalamic network, not as a discrete anatomical entity.
- **The hippocampus is for declarative, not emotional, memory.** The amygdala modulates the *strength* of memory encoding (fear makes memories vivid), but the hippocampus stores the *content*. H.M.'s bilateral hippocampectomy abolished new episodic memory formation while leaving his emotional responses intact, because his amygdalae were partially spared. Do not conflate the two.
- **The hypothalamus is not the pituitary — but it controls it.** The hypothalamus synthesizes releasing hormones and neurohypophyseal hormones (ADH, oxytocin); the anterior pituitary responds to releasing hormones arriving via the portal circulation; the posterior pituitary is an axonal extension of hypothalamic nuclei (SON, PVN). Lesions at each level produce distinct clinical syndromes.
- **The thalamus is not just a relay.** Thalamocortical circuits perform active computations: gain control, attention filtering, and sleep state regulation. The pulvinar, mediodorsal, and intralaminar nuclei are associative and have no simple relay function.
- **Fornix lesions cause anterograde, not retrograde, amnesia.** The fornix is primarily an output pathway from hippocampus to mammillary bodies; its disruption prevents new memory encoding. Remote memories encoded before the lesion are largely intact because they are stored in neocortex.

---

## Related Concepts

- [[_MOC_Neuroanatomy_and_Brain_Structure|↑ Neuroanatomy and Brain Structure MOC]] — section map and recommended learning path for this topic cluster
- [[Gross_Anatomy_of_the_Brain]] — provides the macro-level context (lobes, sulci, ventricular system) within which the limbic system and diencephalon are situated
- [[Learning_and_Memory_Systems]] — expands on LTP, memory consolidation, hippocampal replay, and systems-level memory theory
- [[Decision_Making_and_Reward_Circuits]] — the basal ganglia and dopaminergic reward circuitry overlaps with limbic output, especially via amygdala-striatal and hippocampal-PFC projections
- [[Sleep_and_Circadian_Rhythms]] — the SCN (hypothalamus) drives circadian rhythms; VLPO neurons (hypothalamus) gate sleep onset; thalamocortical spindles consolidate hippocampal memories during NREM
- [[Psychiatric_Disorders_and_Neurobiology]] — PTSD, depression, and schizophrenia each involve pathological alterations in limbic-diencephalic circuits described here

---

## Review Questions

1. **(Secondary)** Trace the Papez circuit from hippocampus back to hippocampus, naming each node and the white matter tract connecting it to the next. What clinical syndrome results from a lesion in the mammillary bodies, and why does it impair memory?
2. **(Undergraduate)** A patient sustains a lesion to the central nucleus of the amygdala (CeA) while the basolateral amygdala (BLA) is spared. Predict which fear behaviors would be lost and which would be preserved, and justify your prediction by referencing BLA→CeA vs. BLA→mPFC projection functions.
3. **(Graduate)** In the HPA axis ODE model above, if you increase the cortisol inhibition constant `k_fc` (representing a person with high-density glucocorticoid receptors in the hypothalamus), how does the peak cortisol response to an acute stressor change, and what does this predict about basal cortisol levels? Relate this to the neuroendocrine profile observed in PTSD compared to major depressive disorder.

---

## Sources

- [Purves et al., *Neuroscience*, 6th ed. — Chapter 28 (Limbic System) and Chapter 16 (Hypothalamus)](https://www.sinauer.com/neuroscience-sixth-edition.html)
- [LeDoux, J. *The Emotional Brain* (1996) — amygdala dual-route fear circuit](https://www.simonandschuster.com/books/The-Emotional-Brain/Joseph-LeDoux/9780684836591)
- [O'Keefe, J. & Nadel, L. *The Hippocampus as a Cognitive Map* (1978)](https://www.cognitivemap.net/)
- [Vinther, F. et al. "The Minimal Model of the HPA Axis," *Journal of Mathematical Biology* (2011)](https://link.springer.com/article/10.1007/s00285-010-0384-2)
- [Aggleton, J.P. & Christiansen, K. "Hippocampal-diencephalic-cingulate networks for memory," *Neuroscience & Biobehavioral Reviews* (2015)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5608081/)
- [Papez, J.W. "A proposed mechanism of emotion," *Archives of Neurology and Psychiatry* (1937)](https://jamanetwork.com/journals/archneurpsyc/article-abstract/646168)
- [Quirk, G.J. & Mueller, D. "Neural mechanisms of extinction learning," *Neuropsychopharmacology* (2008) — BLA-mPFC extinction circuit](https://www.nature.com/articles/1301555)
- [SANTE Trial — DBS of Anterior Nucleus of Thalamus for Epilepsy, *Epilepsia* (2021)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11079300/)

---

#Neuroscience #Neuroanatomy #LimbicSystem #Emotion #Memory
