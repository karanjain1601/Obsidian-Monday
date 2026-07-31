---
title: "Neurodegenerative Diseases"
aliases: [Neurodegeneration, Alzheimer's Disease, Parkinson's Disease, ALS, Huntington's Disease, Dementia]
tags: [Neuroscience, ClinicalNeuroscience, Neurodegeneration, Alzheimers, Parkinsons]
domain: Neuroscience
section: Clinical and Applied Neuroscience
created: 2026-07-31
---

# Neurodegenerative Diseases

> [!abstract] TL;DR
> Neurodegenerative diseases involve the progressive, irreversible loss of specific neuron populations in the brain and spinal cord, ultimately disrupting movement, cognition, or both. A common molecular thread runs through Alzheimer's, Parkinson's, ALS, and Huntington's disease: normally soluble proteins misfold, aggregate, and spread between cells in a prion-like fashion, seeding pathology in connected brain regions. Treatments remain largely symptomatic, but disease-modifying therapies — including anti-amyloid antibodies (lecanemab, donanemab) and antisense oligonucleotides (tofersen) — have recently received FDA approval, marking a turning point in the field.

---

## Intuition — analogy FIRST

Think of the healthy brain as a network of precision steel cables suspending a bridge. Now imagine a single corroded strand: rust does not stay put — it spreads along the metal, weakening adjacent strands through electrochemical contact, until entire sections of cable fail and the bridge deforms.

Neurodegeneration works the same way. A single protein — amyloid-beta, tau, alpha-synuclein, or mutant huntingtin — loses its proper shape, aggregates, and physically transfers its misfolded conformation to normal copies in neighbouring cells, travelling along the brain's own wiring (axonal projections). Different diseases attack different "cables": Alzheimer's corrodes memory circuits in the hippocampus; Parkinson's corrodes dopamine cables in the midbrain; ALS corrodes the motor highway from cortex to muscle; Huntington's corrodes the movement-control gating station in the striatum.

The tragedy is that by the time the bridge sways noticeably — by the time clinical symptoms appear — a substantial portion of irreplaceable neurons is already gone.

---

## How It Works

**The common mechanism: protein misfolding and prion-like propagation**

Every major neurodegenerative disease is characterised by a protein that normally serves a useful function but adopts a pathological conformation under certain conditions (mutations, oxidative stress, aging-related clearance failure, or combinations thereof):

1. A seed protein misfolds in a specific, topologically stable aberrant conformation.
2. The misfolded seed templates normal copies of the same protein into the same pathological shape — an autocatalytic reaction that amplifies the aggregate.
3. Aggregated species (oligomers, protofibrils, fibrils) are neurotoxic at the oligomeric stage; larger insoluble inclusions (plaques, Lewy bodies, NFTs) may be partially protective end-stage deposits or toxic in their own right.
4. Aggregates are released into the extracellular space or packaged into exosomes, taken up by adjacent and synaptically-connected cells, and seed new foci.
5. The spread pattern mirrors the brain's connectome — the anatomical wiring diagram — explaining why pathology follows stereotyped staging sequences.

**Alzheimer's Disease** seeds in entorhinal cortex and hippocampus (amyloid plaques from Abeta42 and neurofibrillary tangles from hyperphosphorylated tau); as Braak staging advances through six stages, pathology reaches association cortices and finally primary sensory/motor areas, explaining why memory fails long before patients lose motor control.

**Parkinson's Disease** seeds in the olfactory bulb and brainstem (Braak stages 1–2), ascends to the substantia nigra pars compacta (Braak stages 3–4), and ultimately reaches the neocortex (stages 5–6). The loss of dopaminergic neurons projecting from SNc to striatum (nigrostriatal pathway) drives the hallmark motor triad.

**ALS** (Amyotrophic Lateral Sclerosis) destroys both upper motor neurons in the motor cortex and lower motor neurons in the brainstem and spinal cord. TDP-43 cytoplasmic inclusions are the pathological hallmark in ~97% of cases regardless of genetic cause; SOD1 aggregates occur in SOD1-mutation carriers.

**Huntington's Disease** is a pure genetic disease — a CAG trinucleotide repeat expansion (≥40 repeats) in the HTT gene on chromosome 4 produces mutant huntingtin (mHTT) with an expanded polyglutamine tract. mHTT aggregates preferentially kill medium spiny neurons in the striatum (caudate nucleus + putamen), releasing the motor cortex from inhibition and producing involuntary choreiform movements.

```mermaid
graph TD
    subgraph AD["Alzheimer Disease"]
        AD_P["Protein: Abeta42 and Tau NFTs"]
        AD_R["Region: Entorhinal Ctx / Hippocampus / Neocortex"]
        AD_S["Symptom: Memory Loss / Dementia / Language"]
        AD_P --> AD_R --> AD_S
    end
    subgraph PD["Parkinson Disease"]
        PD_P["Protein: Alpha-Synuclein Lewy Bodies"]
        PD_R["Region: SNc Dopaminergic Neurons"]
        PD_S["Symptom: Tremor / Bradykinesia / Rigidity"]
        PD_P --> PD_R --> PD_S
    end
    subgraph ALS_box["ALS - Amyotrophic Lateral Sclerosis"]
        ALS_P["Protein: TDP-43 / SOD1 / FUS Aggregates"]
        ALS_R["Region: Upper and Lower Motor Neurons"]
        ALS_S["Symptom: Paralysis / Respiratory Failure"]
        ALS_P --> ALS_R --> ALS_S
    end
    subgraph HD["Huntington Disease"]
        HD_P["Protein: mHTT with Polyglutamine Tract"]
        HD_R["Region: Striatum - Caudate and Putamen"]
        HD_S["Symptom: Chorea / Cognitive Decline"]
        HD_P --> HD_R --> HD_S
    end
```

---

## Key Concepts

### Secondary Level

**The four major diseases at a glance**

| Disease | Key Protein | Vulnerable Neurons | Cardinal Symptoms | Genetic Risk |
|---------|------------|-------------------|-------------------|-------------|
| Alzheimer's | Amyloid-beta + Tau | Hippocampal and cortical pyramidal neurons | Episodic memory loss, language, executive dysfunction | APOE4, APP, PSEN1/2 |
| Parkinson's | Alpha-Synuclein | SNc dopaminergic neurons | Resting tremor, bradykinesia, rigidity, postural instability | LRRK2, GBA, SNCA |
| ALS | TDP-43, SOD1, FUS | Upper and lower motor neurons | Progressive paralysis, dysarthria, respiratory failure | SOD1, C9orf72, TARDBP, FUS |
| Huntington's | mHTT (polyQ) | Striatal medium spiny neurons | Chorea, personality change, dementia | HTT CAG repeat length (autosomal dominant, 100% penetrance) |

**Alzheimer's Disease — the basics**

Alzheimer's is the most common cause of dementia (~60–70% of cases), affecting ~55 million people worldwide. Two pathological hallmarks define it: extracellular amyloid plaques and intraneuronal neurofibrillary tangles (NFTs). Memory loss is the earliest clinical sign — specifically, episodic memory encoding (the hippocampus makes new memories; it is the first region destroyed). Confusion, language difficulties, and personality changes follow as the disease spreads. APOE4 is the strongest genetic risk factor for late-onset sporadic AD: one copy doubles the risk; two copies increase it 12-fold.

**Parkinson's Disease — the basics**

Parkinson's is the second most common neurodegenerative disease. The dopamine deficit in the nigrostriatal pathway underlies the motor triad: resting tremor (characteristically "pill-rolling"), bradykinesia (slowness of movement), and rigidity (cogwheel or lead-pipe resistance to passive movement). An early non-motor sign is loss of smell (hyposmia) — because the olfactory system is affected in Braak stages 1–2, years before motor symptoms emerge. REM sleep behaviour disorder (acting out dreams, with violent thrashing) is another early prodromal sign reflecting brainstem pathology.

**ALS — the basics**

ALS destroys both upper motor neurons (cortex → brainstem/cord) and lower motor neurons (cord/brainstem → muscle). Stephen Hawking had ALS for over 50 years, though he had an unusually slow-progressing variant; typical median survival is 2–5 years, most often from respiratory failure. ~90% of cases are sporadic; ~10% are familial. The TDP-43 protein — normally a nuclear RNA-binding protein — mislocalises to the cytoplasm and aggregates in almost all ALS cases.

**Huntington's Disease — the basics**

Unlike the others, HD has a single monogenic cause: CAG repeat length in the HTT gene. Normal alleles have <36 repeats; alleles with ≥40 repeats cause HD with 100% penetrance; 36–39 is a reduced-penetrance zone. Critically, repeat length inversely correlates with age of onset: ~40 repeats → onset in the 50s; ~60 repeats → juvenile onset (~20s). Choreiform movements — involuntary, dance-like jerking — are pathognomonic, alongside psychiatric symptoms (depression, impulsivity) that often predate motor signs.

---

### Undergraduate Level

**The amyloid cascade hypothesis (Hardy & Selkoe, 2002)**

Amyloid Precursor Protein (APP) is a transmembrane protein cleaved by secretases. Two pathways compete:
- **Non-amyloidogenic:** alpha-secretase cleaves APP within the Abeta sequence → releases soluble sAPPalpha; no Abeta produced.
- **Amyloidogenic:** beta-secretase (BACE1) cleaves at the N-terminal of the Abeta sequence → releases sAPPbeta; the residual C99 fragment is then cleaved by gamma-secretase complex (presenilin-1/2) → produces Abeta40 (benign, soluble) or **Abeta42** (longer, hydrophobic, aggregation-prone).

The amyloid cascade hypothesis states: excess Abeta42 → soluble oligomers (most neurotoxic species) → protofibrils → insoluble plaques → synapse dysfunction → tau hyperphosphorylation → NFT formation → neuronal death → dementia. Mutations in APP or PSEN1/2 (familial AD) all increase the Abeta42/Abeta40 ratio, providing strong causal evidence. However, the hypothesis has required modification: amyloid is *necessary but not sufficient* — tau pathology burden better predicts neurodegeneration and clinical severity.

**Tau hyperphosphorylation and NFT formation**

Tau is a microtubule-associated protein that stabilises axonal microtubule tracks. In AD, more than 30 serine/threonine residues are hyperphosphorylated (by GSK-3beta, CDK5, CaMKII), causing tau to detach from microtubules. Detached tau aggregates into paired helical filaments (PHFs), which bundle into neurofibrillary tangles (NFTs). Microtubule destabilisation disrupts axonal transport — the conveyor belt for organelles and vesicles — starving axon terminals. Tau spreads from neuron to neuron via synaptic transmission: tau released presynaptically is endocytosed postsynaptically and seeds aggregation.

**Braak staging (Alzheimer's)**

Braak and Braak (1991) defined six stages of tau pathology progression based on post-mortem brains:
- Stages I–II: Entorhinal cortex and transentorhinal region; patients are typically asymptomatic or have very subtle episodic memory impairment.
- Stages III–IV: Limbic system (hippocampus, amygdala); clinical mild cognitive impairment (MCI).
- Stages V–VI: Isocortex (temporal, parietal, frontal, primary areas); clinical dementia.

The staging sequence mirrors the anatomical connectivity of the entorhinal cortex, strongly supporting prion-like trans-neuronal spread.

**Cholinergic hypothesis (Alzheimer's cognitive symptoms)**

The basal forebrain contains cholinergic projection neurons (nucleus basalis of Meynert) that release acetylcholine widely across the neocortex and hippocampus — this ACh signal is critical for attention, arousal, and memory encoding. AD selectively destroys these cholinergic neurons early, resulting in a cortical ACh deficit. This is the basis of the first symptomatic treatment approved for AD: acetylcholinesterase inhibitors (donepezil, rivastigmine, galantamine), which increase synaptic ACh by blocking its breakdown. They improve symptoms modestly without altering disease course.

**Braak staging (Parkinson's) and Lewy body spread**

Braak staging for PD (2003) maps alpha-synuclein Lewy body pathology in six stages, but unlike AD, PD staging starts in the peripheral nervous system and lower brainstem:
- Stages 1–2: Olfactory bulb, dorsal motor nucleus of the vagus → explains hyposmia and GI symptoms.
- Stages 3–4: Substantia nigra pars compacta and basal ganglia → motor symptoms emerge.
- Stages 5–6: Mesocortex and neocortex → cognitive symptoms, Parkinson's dementia.

Lewy bodies are cytoplasmic inclusions containing misfolded alpha-synuclein fibrils, ubiquitin, and p62, surrounded by a halo of membrane remnants.

**L-DOPA: the dopamine replacement strategy**

Because SNc neurons are lost in Parkinson's, the striatum is dopamine-depleted. L-DOPA (levodopa) is the immediate precursor to dopamine; unlike dopamine itself, it crosses the blood-brain barrier via the large neutral amino acid transporter. Once inside the CNS, it is converted to dopamine by DOPA decarboxylase in remaining dopaminergic terminals (and in glia). Administered with carbidopa (a peripheral decarboxylase inhibitor that cannot cross the BBB), this prevents peripheral conversion, reducing nausea and allowing lower doses. L-DOPA is the most effective PD drug available — but as more dopaminergic neurons die, effectiveness wanes and motor fluctuations ("on-off" phenomena) and dyskinesias emerge.

**ALS: glutamate excitotoxicity and the mechanism of riluzole**

Upper motor neuron degeneration removes inhibitory control over lower motor neurons, which become hyperexcitable. Excess glutamate release → NMDA receptor overactivation → Ca2+ influx → mitochondrial dysfunction → oxidative stress → motor neuron death (excitotoxicity). Riluzole, the first FDA-approved ALS drug (1995), primarily blocks persistent Na+ channels on glutamatergic neurons, reducing glutamate release and extending survival by approximately 2–3 months (modest but real). TDP-43 normally regulates RNA processing of thousands of genes; cytoplasmic mislocalisation causes both loss of nuclear function (RNA mis-splicing) and toxic gain of function from cytoplasmic aggregates.

**Huntington's: mHTT aggregation and striatal degeneration**

mHTT with expanded polyglutamine tracts misfolds and forms intranuclear and cytoplasmic inclusions. Toxicity operates through multiple mechanisms simultaneously: direct sequestration of transcription factors (CBP, SP1) → gene expression failure; impaired mitochondrial function and ATP production; disrupted autophagy and proteasomal clearance; altered synaptic transmission in striatal MSNs. The striatum (caudate + putamen) contains the highest density of vulnerable MSNs expressing D2 receptors that project to the indirect pathway — their loss disinhibits thalamic output, manifesting clinically as involuntary movements. The CAG repeat length–age of onset relationship is approximately log-linear: for every additional CAG unit, onset shifts earlier by approximately 3–4 years.

---

### Graduate Level

**Prion-like propagation: the unifying framework**

The prion field (Stanley Prusiner, Nobel 1997) established that PrPsc propagates by templating the normal PrPc isoform. The same seeding-nucleation kinetics has been demonstrated for:
- **Tau:** injection of tau aggregates from AD brain into WT or hTau mice seeds spreading tau pathology along anatomically-connected pathways, not randomly. In vitro, seed-competent tau species from AD brain induce tau aggregation in cells expressing WT tau.
- **Alpha-synuclein:** injection of human alpha-syn preformed fibrils (PFFs) into mouse striatum seeds Lewy body formation in connected regions and produces motor and cognitive deficits resembling PD. Cases of PD patients who received fetal substantia nigra grafts showed Lewy bodies within the grafted neurons decades later — suggesting cell-to-cell transmission in vivo.
- **TDP-43:** TDP-43 aggregates show prion-like seeding in cell culture models.

The prion-like hypothesis does not imply infectivity (you cannot "catch" AD from an AD patient) — it refers only to the templating mechanism of conformational conversion.

**Tau PET imaging and Braak staging in living patients**

Flortaucipir (AV-1451, Tauvid) is an FDA-approved PET radiotracer that binds to NFTs. Tau PET imaging in living patients closely recapitulates Braak staging, enabling: (1) diagnosis of AD versus non-AD tauopathies (PSP, CBD), (2) staging of disease severity without lumbar puncture, (3) monitoring of treatment response. Combined amyloid PET (elevated) + tau PET (Braak III+) + clinical symptoms defines "biological Alzheimer's disease." Plasma p-tau217 assay (blood test) achieves >90% accuracy for predicting amyloid/tau PET positivity, enabling scalable population screening.

**Anti-amyloid immunotherapy: lecanemab and donanemab**

Two anti-Abeta antibodies have received traditional FDA approval:
- **Lecanemab (Leqembi, 2023):** Targets Abeta protofibrils. CLARITY AD trial (n=1,795) showed 27% slowing of cognitive decline on the CDR-SB scale over 18 months. Significant amyloid clearance on PET. ARIA (amyloid-related imaging abnormalities) — microhaemorrhages and oedema — are the main adverse effects, especially in APOE4 homozygotes.
- **Donanemab (Kisunla, 2024):** Targets pyroglutamate-modified Abeta (N3pG form). TRAILBLAZER-ALZ 2 trial showed ~35% slowing in early-stage (low-medium tau) AD patients. Notably, treatment was stopped after amyloid clearance was confirmed by PET — supporting the hypothesis that amyloid removal is the drug's mechanism.

These approvals validate the amyloid cascade hypothesis at the level of human therapeutic benefit, while also highlighting its limitation: the modest magnitude of cognitive benefit despite near-complete plaque removal indicates that downstream tau pathology and synaptic/neuronal loss are the proximate drivers of decline, and may require their own co-therapies.

**Neuroinflammation and microglia in neurodegeneration**

Genome-wide association studies (GWAS) identified microglial expressed genes (TREM2, CR1, CLU, BIN1) as the top AD genetic risk factors after APOE, establishing neuroinflammation as mechanistically central rather than merely reactive. TREM2 is a microglial phagocytic receptor: its R47H variant (risk allele) impairs amyloid plaque compaction and shifts microglia toward a dystrophic state. In normal brain, microglia engulf and clear Abeta and tau seeds; in AD, chronically activated (DAM — disease-associated microglia) states produce pro-inflammatory cytokines (IL-1beta, TNF-alpha, IL-6) that damage synapses and neurons, while complement-mediated synaptic pruning is dysregulated, stripping synapses inappropriately.

**Mitophagy failure in Parkinson's: PINK1/Parkin pathway**

PINK1 (PTEN-induced kinase 1) is a mitochondrial kinase that accumulates on the outer mitochondrial membrane of depolarised (damaged) mitochondria. PINK1 phosphorylates ubiquitin and Parkin (an E3 ubiquitin ligase), activating Parkin to ubiquitinate outer membrane proteins, flagging the damaged mitochondrion for autophagic degradation (mitophagy). Loss-of-function mutations in PINK1 or Parkin cause early-onset autosomal recessive PD — the clearest genetic evidence that mitochondrial quality control failure drives dopaminergic neuron death. Alpha-synuclein aggregates can directly impair mitophagy by blocking autophagosome formation, creating a vicious cycle.

**iPSC disease models**

Patient-derived induced pluripotent stem cells (iPSCs) carrying disease mutations (LRRK2 G2019S, APP duplication, SOD1 A4V, mHTT) can be differentiated into the disease-relevant neuron type in vitro, recapitulating cell-autonomous disease features: APOE4 iPSC-derived neurons show elevated Abeta and tau phosphorylation; HD iPSC-derived striatal MSNs show mHTT aggregation and reduced neuronal survival. These platforms enable drug screening without the need for post-mortem tissue and preserve the human genetic background that mouse models lack.

**Antisense oligonucleotide (ASO) therapy**

ASOs are synthetic single-stranded nucleic acids (~18–25 nt) that hybridise to complementary mRNA sequences, directing RNase H-mediated degradation or splicing modulation. Delivered intrathecally (bypassing BBB), they can lower target protein levels CNS-wide:
- **Tofersen (Qalsody, FDA 2023):** Targets SOD1 mRNA in SOD1-ALS; significantly reduces CSF SOD1 protein levels and neurofilament light chain (NfL, a neurodegeneration biomarker).
- **Tominersen:** Targets all HTT mRNA (both WT and mutant) for HD — failed Phase 3 (GENERATION HD1 trial halted 2021) due to dose-dependent harm at higher doses; selective allele-specific ASOs targeting only mutant HTT allele are in development (WVE-003).
- **ION373:** Allele-selective anti-SOD1 ASO for SOD1-ALS; preserves WT SOD1 while selectively silencing mutant allele.

The HD trial failure illustrates that complete loss of WT huntingtin (which has important cellular functions) is toxic — motivating allele-selective approaches using SNPs in cis with the mutant allele.

**Glymphatic system and sleep-dependent clearance**

The glymphatic system (Maiken Nedergaard, 2012) is a brain-wide waste clearance network: CSF enters the brain parenchyma along periarterial spaces, flows through the interstitium driven by AQP4 water channels in astrocyte endfeet, and exits along perivenous spaces carrying waste proteins (Abeta, tau) to peripheral lymphatics. Crucially, glymphatic flow is ~60% higher during NREM slow-wave sleep than wakefulness. A single night of sleep deprivation increases CSF Abeta levels by ~25% in healthy humans. Chronic poor sleep is associated with accelerated Abeta accumulation and is a risk factor for AD — suggesting a bidirectional relationship: AD disrupts sleep, and disrupted sleep accelerates AD pathology.

---

## Python Demo

Simulate prion-like spreading of tau pathology through a simplified brain network using a logistic diffusion model. The seed region is the entorhinal cortex, mirroring Braak stage I in Alzheimer's disease.

```python
import numpy as np
import matplotlib.pyplot as plt

# Eight representative brain regions, ordered by typical AD Braak vulnerability
REGIONS = [
    "Entorhinal Ctx",
    "Hippocampus",
    "Parahippocampal",
    "Temporal Ctx",
    "Parietal Ctx",
    "Frontal Ctx",
    "Occipital Ctx",
    "Brainstem",
]

# Structural connectivity matrix C[i,j] = connection weight from region i to region j
# Higher weight = stronger axonal projection = faster pathology spread
C = np.array([
    #  EC    Hip   Para  Temp  Par   Fro   Occ   Bstem
    [0.00, 0.80, 0.70, 0.50, 0.20, 0.10, 0.05, 0.10],  # Entorhinal Ctx
    [0.80, 0.00, 0.60, 0.50, 0.30, 0.20, 0.05, 0.20],  # Hippocampus
    [0.70, 0.60, 0.00, 0.70, 0.30, 0.20, 0.15, 0.10],  # Parahippocampal
    [0.50, 0.50, 0.70, 0.00, 0.60, 0.40, 0.25, 0.10],  # Temporal Ctx
    [0.20, 0.30, 0.30, 0.60, 0.00, 0.70, 0.45, 0.10],  # Parietal Ctx
    [0.10, 0.20, 0.20, 0.40, 0.70, 0.00, 0.30, 0.20],  # Frontal Ctx
    [0.05, 0.05, 0.15, 0.25, 0.45, 0.30, 0.00, 0.10],  # Occipital Ctx
    [0.10, 0.20, 0.10, 0.10, 0.10, 0.20, 0.10, 0.00],  # Brainstem
])


def simulate_pathology_spread(connectivity, seed_idx, n_steps=40, rate=0.10):
    """
    Logistic diffusion model of prion-like protein spreading.
    burden[i] = pathology burden in region i (0.0 = healthy, 1.0 = fully affected).
    At each step, pathology flows from every affected region to connected neighbours,
    with logistic saturation preventing burden from exceeding 1.0.
    """
    n = connectivity.shape[0]
    burden = np.zeros(n)
    burden[seed_idx] = 0.05  # small initial tau seed in entorhinal cortex

    history = [burden.copy()]
    for _ in range(n_steps):
        # Incoming pathology load: sum of (connectivity * source burden) over all sources
        incoming = connectivity.T @ burden          # shape (n,)
        # Logistic spread: rate * incoming * available capacity
        delta = rate * incoming * (1.0 - burden)
        burden = np.clip(burden + delta, 0.0, 1.0)
        history.append(burden.copy())

    return np.array(history)  # shape: (n_steps+1, n_regions)


# Run simulation seeded from Entorhinal Cortex (index 0) — Braak stage I
history = simulate_pathology_spread(C, seed_idx=0, n_steps=40, rate=0.10)

# --- Visualisation ---
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Panel 1: heatmap of pathology burden over time for each region
im = ax1.imshow(history.T, aspect="auto", cmap="YlOrRd", vmin=0, vmax=1)
ax1.set_xlabel("Time step (arbitrary units)")
ax1.set_ylabel("Brain region")
ax1.set_yticks(range(len(REGIONS)))
ax1.set_yticklabels(REGIONS, fontsize=9)
ax1.set_title("Alzheimer Tau-like Pathology Spread\n(seed: Entorhinal Cortex, Braak I)")
plt.colorbar(im, ax=ax1, label="Pathology burden (0=healthy, 1=maximal)")

# Panel 2: burden curves at three time-point snapshots
time_points = [5, 15, 40]
colors = ["#1a9850", "#f46d43", "#d73027"]
labels = ["Early (t=5)", "Mid (t=15)", "Late (t=40)"]
for t, col, lbl in zip(time_points, colors, labels):
    ax2.barh(range(len(REGIONS)), history[t], color=col, alpha=0.75, label=lbl)
ax2.set_yticks(range(len(REGIONS)))
ax2.set_yticklabels(REGIONS, fontsize=9)
ax2.set_xlim(0, 1.05)
ax2.set_xlabel("Pathology burden")
ax2.set_title("Region Burden at Three Disease Stages")
ax2.legend()
ax2.invert_yaxis()
ax2.axvline(x=0.5, color="gray", linestyle="--", alpha=0.6, label="50% threshold")

plt.tight_layout()
plt.savefig("alzheimer_pathology_spread.png", dpi=150, bbox_inches="tight")
plt.show()

# Print final Braak-like spreading order
print("Spreading order at t=40 (highest to lowest burden):")
final_burden = history[-1]
order = np.argsort(final_burden)[::-1]
for rank, idx in enumerate(order):
    print(f"  {rank + 1}. {REGIONS[idx]:<22s}  burden = {final_burden[idx]:.3f}")
```

**What to observe:** Pathology initiates exclusively in the entorhinal cortex, then rapidly reaches the hippocampus and parahippocampal cortex (Braak III–IV equivalent), then temporal and parietal cortex (Braak V), and finally frontal cortex and brainstem. Occipital cortex, the most weakly connected region, is the last to be affected — consistent with the clinical observation that primary vision is preserved until late-stage Alzheimer's.

---

## Real-World Applications

**Drug target identification**
Each disease has distinct but conceptually related druggable targets:
- **AD:** Reduce Abeta production (BACE1 inhibitors, gamma-secretase modulators); clear existing aggregates (lecanemab, donanemab); prevent tau spread (anti-tau antibodies in trials); reduce neuroinflammation (TREM2 agonists).
- **Parkinson's:** Replace dopamine (L-DOPA/carbidopa); alpha-synuclein clearance (prasinezumab, cinpanemab — anti-alpha-syn antibodies in Phase 2); LRRK2 kinase inhibitors (DNL201, BIIB094 — Phase 2).
- **ALS:** Glutamate excitotoxicity (riluzole); mitochondrial support (edaravone); SOD1 lowering (tofersen); C9orf72 repeat silencing (ASOs in trials).
- **HD:** HTT lowering via ASOs or RNAi; mHTT-selective CRISPR base editing (preclinical); HD-SPT4 targeting (SPT4 reduces mHTT aggregation, preclinical).

**Biomarker cascade for clinical trials and diagnosis**
The AT(N) framework classifies patients biologically:
- **A:** Amyloid biomarker — CSF Abeta42/40 ratio (low = positive), amyloid PET, or plasma Abeta42/40.
- **T:** Tau biomarker — CSF p-tau181/217 (elevated = positive), tau PET (flortaucipir), or plasma p-tau217.
- **N:** Neurodegeneration — CSF total tau, neurofilament light chain (NfL) in CSF or plasma, FDG-PET hypometabolism, MRI atrophy.

Plasma p-tau217 has emerged as the most accurate single blood biomarker for AD (~90–95% sensitivity/specificity for amyloid PET positivity), enabling population-scale screening and trial enrichment without lumbar puncture.

**Deep Brain Stimulation (DBS) for Parkinson's**
DBS of the subthalamic nucleus (STN) or globus pallidus internus (GPi) delivers high-frequency electrical stimulation that modulates pathological low-frequency oscillations (beta oscillations at 13–30 Hz) in the basal ganglia-thalamo-cortical circuit. It dramatically reduces tremor, rigidity, and ON-OFF fluctuations, and can reduce required L-DOPA dose by ~50%. Closed-loop adaptive DBS (aDBS), which reads bioelectrical signals and titrates stimulation automatically, is now entering clinical use and represents the state of the art.

**Genetic testing (APOE, LRRK2, mHTT)**
APOE4 status predicts AD risk but is not deterministic (analogous to BRCA for breast cancer — risk factor, not a guarantee). Direct-to-consumer tests (23andMe) can now report APOE status, creating clinical demand for genetic counselling. LRRK2 G2019S carriers have a 25–85% lifetime risk of PD (ethnic-dependent penetrance) — LRRK2 inhibitor trials actively enrol pre-symptomatic carriers. For HD, a genetic test for CAG repeat length is definitively diagnostic and predictive; pre-symptomatic testing with genetic counselling is standard of care for at-risk individuals.

---

## Common Pitfalls

- **Alzheimer's is not normal aging** — Normal aging involves some slowing of processing speed and occasional word-finding difficulty but preserves episodic memory and activities of daily living. Alzheimer's disease causes progressive, functional-impairing memory loss that worsens over months and represents a distinct pathological process, not merely accelerated aging.

- **Amyloid is necessary but not sufficient for Alzheimer's dementia** — Approximately 30% of cognitively normal elderly individuals have significant amyloid plaque burden on PET imaging. Tau pathology (specifically Braak stage) is a far better predictor of cognitive impairment and neurodegeneration than amyloid load alone. Anti-amyloid therapies work best early precisely because amyloid precedes tau and neuronal death by 10–20 years.

- **Parkinson's is not just a motor disease** — The clinical tetrad (tremor, rigidity, bradykinesia, postural instability) is taught first, but Parkinson's includes hyposmia (often the earliest sign, years before motor symptoms), constipation, REM sleep behaviour disorder, depression, anxiety, cognitive impairment, and — in up to 80% of patients with long disease duration — dementia (Parkinson's disease dementia / Lewy body dementia).

- **ALS always involves motor neurons, but FTD overlap is clinically critical** — TDP-43 pathology is the shared hallmark of both ALS (~97% of cases) and frontotemporal dementia (~50% of cases). ALS-FTD overlap syndrome occurs in ~15% of ALS patients and represents a spectrum, not two discrete diseases. A clinician who frames ALS as a purely motor disease may miss cognitive/behavioural changes that profoundly affect patient care decisions (including communication about ventilation and feeding tubes).

- **CAG repeat length in Huntington's does not equal clinical severity at a given time point** — Repeat length predicts age of onset, but progression rate after onset varies substantially and is influenced by modifier genes (MSH3, FAN1, others involved in somatic expansion). Somatic expansion of the CAG repeat in post-mitotic neurons — driven by DNA mismatch repair — may actually cause the cell-type-selective toxicity in striatum.

- **Confusing Lewy body dementia with Alzheimer's dementia** — Diffuse Lewy body disease (DLB) is the second most common dementia after AD. Key distinguishing features: fluctuating cognition (hour-to-hour or day-to-day variation), visual hallucinations (vivid, detailed), REM sleep behaviour disorder, and marked sensitivity to antipsychotic drugs (which can cause catastrophic reactions). Misdiagnosis leads to dangerous antipsychotic prescribing.

---

## Related Concepts

- [[Glial_Cells_and_Blood_Brain_Barrier]] — Microglia drive neuroinflammation in AD and PD; astrocytes manage glutamate clearance (failure → excitotoxicity in ALS); BBB breakdown is an early feature of Alzheimer's pathology and correlates with pericyte loss.
- [[Synaptic_Plasticity_and_LTP]] — Abeta oligomers specifically impair NMDA receptor function and LTP in the hippocampus, providing a direct mechanistic link between amyloid accumulation and the episodic memory failure that defines early Alzheimer's disease.
- [[Synaptic_Transmission_and_Neurotransmitters]] — Dopamine depletion in Parkinson's, acetylcholine loss in Alzheimer's (cholinergic hypothesis), and glutamate excitotoxicity in ALS are all rooted in disrupted neurotransmitter systems.
- [[Motor_System_and_Motor_Control]] — Parkinson's (nigrostriatal dopamine), ALS (corticospinal tract destruction), and Huntington's (indirect pathway disinhibition) each represent distinct failure modes of the motor control hierarchy from cortex to muscle.
- [[Limbic_System_and_Diencephalon]] — The hippocampus and entorhinal cortex — the first structures destroyed in Alzheimer's — are the core of the limbic memory system, explaining why memory failure is the cardinal early symptom.
- [[Cerebellum_and_Basal_Ganglia]] — Huntington's pathology is centred on the striatum (basal ganglia), and understanding basal ganglia direct/indirect pathway anatomy is essential for interpreting choreiform movements and the therapeutic logic of DBS.
- [[Sleep_and_Circadian_Rhythms]] — The glymphatic system clears Abeta and tau during NREM sleep; chronic sleep disruption accelerates amyloid accumulation and is an independent AD risk factor.
- [[Connectomics_and_Network_Neuroscience]] — The prion-like spread of pathological proteins follows structural connectome pathways, and network-based models of spreading (like the Python demo above) can predict individual patient staging trajectories from their MRI-derived connectivity.

---

## Review Questions

**Secondary level**
1. A 72-year-old patient is referred for memory problems. Their spouse reports they often repeat the same story within minutes and are getting lost driving familiar routes. A 68-year-old patient presents with a resting tremor in the right hand that disappears during purposeful movement. For each patient: name the most likely neurodegenerative diagnosis, identify the primary protein involved, and name one brain region that is preferentially damaged.

**Undergraduate level**
2. A researcher injects tau fibrils isolated from Alzheimer's brain tissue into the entorhinal cortex of a mouse expressing human tau (hTau mouse). Three months later, neurofibrillary tangles appear in the hippocampus but not the cerebellum. (a) What hypothesis does this result support? (b) The cerebellum is largely spared in human Alzheimer's disease despite expressing tau — propose a connectivity-based and a cell-biology-based explanation for its relative resistance. (c) Design a follow-up experiment to demonstrate that the spread is trans-synaptic rather than extracellular diffusion.

**Graduate level**
3. Lecanemab reduces amyloid plaque burden by ~80% on PET imaging but slows clinical decline by only ~27%. Donanemab achieves similar amyloid clearance and ~35% slowing in early-stage patients. (a) Why does near-complete amyloid removal produce only a partial clinical benefit according to the modified amyloid cascade hypothesis? (b) What downstream target would you combine with anti-amyloid therapy to potentially achieve larger clinical benefit, and what clinical trial design (patient population, primary endpoint, duration) would you propose to test the combination? (c) The APOE4 homozygote subgroup shows higher rates of ARIA (amyloid-related imaging abnormalities) with anti-amyloid antibodies — propose a mechanistic explanation based on the role of APOE4 in cerebrovascular amyloid deposition.

---

## Sources

- [Kandel ER et al. *Principles of Neural Science*, 6th edition, McGraw-Hill, 2021](https://www.mhprofessional.com/principles-of-neural-science-sixth-edition-9781259642234-usa)
- [Hardy J and Selkoe DJ. "The amyloid hypothesis of Alzheimer's disease: progress and problems on the road to therapeutics." *Science* 297(5580):353-356, 2002](https://doi.org/10.1126/science.1072994)
- [Braak H and Braak E. "Neuropathological stageing of Alzheimer-related changes." *Acta Neuropathologica* 82:239-259, 1991](https://doi.org/10.1007/BF00308809)
- [Braak H et al. "Staging of brain pathology related to sporadic Parkinson's disease." *Neurobiology of Aging* 24:197-211, 2003](https://doi.org/10.1016/S0197-4580(02)00065-9)
- [van Dyck CH et al. "Lecanemab in early Alzheimer's disease." *New England Journal of Medicine* 388:9-21, 2023](https://doi.org/10.1056/NEJMoa2212948)
- [Sims JR et al. "Donanemab in early symptomatic Alzheimer's disease (TRAILBLAZER-ALZ 2)." *JAMA* 330(6):512-527, 2023](https://doi.org/10.1001/jama.2023.13239)
- [Miller TM et al. "Phase 1–2 trial of antisense oligonucleotide tofersen for SOD1 ALS." *New England Journal of Medicine* 383:109-119, 2020](https://doi.org/10.1056/NEJMoa2003715)
- [Jessen NA et al. "The glymphatic system: a beginner's guide." *Neurochemical Research* 40:2583-2599, 2015](https://doi.org/10.1007/s11064-015-1581-6)

---

#Neuroscience #ClinicalNeuroscience #Neurodegeneration #Alzheimers #Parkinsons
