---
title: "Transposable Elements and Genome Evolution"
aliases: [Transposons, Retrotransposons, Jumping Genes, Mobile Elements]
tags: [Genetics, EvolutionaryGenetics, TransposableElements, Genome, MobileElements]
domain: Genetics
section: Evolutionary and Systems Genetics
created: 2026-07-31
related: ["[[Genome_Organization_and_Structure]]", "[[Gene_Regulation_and_Epigenetics]]", "[[Chromatin_Structure_and_Nucleosomes]]", "[[Population_Genetics_and_Hardy_Weinberg]]", "[[Comparative_Genomics_and_Synteny]]", "[[DNA_Repair_and_Mutation]]"]
status: complete
---

# 🧬 Transposable Elements and Genome Evolution

> [!abstract] TL;DR
> Transposable elements (TEs) — mobile DNA sequences that copy or excise themselves and re-insert elsewhere in the genome — constitute nearly half of the human genome and are the dominant force behind genome size variation, novel regulatory elements, and protein innovation across all domains of life; understanding how cells silence them, tolerate them, and occasionally co-opt them is fundamental to evolutionary genetics, epigenomics, and cancer biology.

---

## Intuition — analogy FIRST

**Analogy:** Imagine your genome is a vast library. Most books were authored carefully by the organism's ancestors — genes encoding proteins, control regions, structural sequences. But scattered among the shelves are thousands of copies of a single short pamphlet titled *"How to Make More Copies of Yourself."* Each pamphlet contains its own printing press instructions, and whenever the library's copy-control system relaxes — during stress, early development, or library reconstruction — those pamphlets run the press, slip the new copies between random books on random shelves, and go quiet again. Over millions of years, the library accumulates so many pamphlet copies that they outnumber the original books. The head librarian (the cell) now faces a dilemma: burn every pamphlet and risk destroying the occasional useful annotation they happened to land on; or tolerate them, keep them locked in sealed cabinets, and occasionally discover that one has accidentally become a genuinely useful chapter.

Transposable elements are those pamphlets. The sealed cabinets are the epigenetic silencing systems. The useful chapters are domesticated TE-derived genes. And the sheer volume of pamphlets is why the human genome is 3.1 Gb while the tightly edited *E. coli* genome is only 4.6 Mb.

---

## How It Works

The defining property of a TE is that it encodes (or borrows) the enzymatic machinery to move its own sequence to a new genomic location. The two fundamental strategies — retrotransposition via an RNA intermediate ("copy and paste") versus DNA-level excision and reinsertion ("cut and paste") — differ in whether the source copy is preserved after the transaction. The dominant mechanism in the human genome is retrotransposition, which is why TE copy numbers can grow so large without depleting the source locus.

The most important single mechanism in the human genome is **target-primed reverse transcription (TPRT)**, used by LINE-1 (L1) elements and the SINEs they mobilise. TPRT leaves a diagnostic molecular fingerprint — short identical sequences flanking the new insert called **target site duplications (TSDs)** — because the staggered nick in the target DNA that primes synthesis is later filled in symmetrically.

```mermaid
sequenceDiagram
    participant SrcDNA as Source L1 Locus
    participant RNAPol as RNA Polymerase II
    participant L1mRNA as L1 mRNA / RNP complex
    participant ORF2p as ORF2p (APE domain + RT domain)
    participant TgtDNA as New Target Genomic Site

    SrcDNA->>RNAPol: Transcription from internal L1 promoter (if demethylated)
    RNAPol->>L1mRNA: Full-length L1 mRNA produced; exported to cytoplasm
    L1mRNA->>ORF2p: ORF1p (RNA chaperone) + ORF2p translated; assemble in cis on own mRNA
    Note over L1mRNA,ORF2p: Cis preference keeps ORF2p activity tied to its own mRNA
    ORF2p->>TgtDNA: APE domain nicks bottom strand at 5'-TT/AAAA-3' motif (first nick)
    TgtDNA-->>ORF2p: Exposed 3'-OH at nick primes first-strand cDNA synthesis
    ORF2p->>TgtDNA: RT domain copies L1 mRNA onto nicked site (target-primed RT)
    TgtDNA->>TgtDNA: Second strand nicked; cDNA becomes double-stranded
    TgtDNA->>TgtDNA: Repair seals nicks; new L1 copy flanked by TSDs (~7–20 bp)
```

LTR retrotransposons (HERVs, Ty elements) use a distinct mechanism: reverse transcriptase synthesises dsDNA in the cytoplasm from the RNA template, and the integrase enzyme then catalyses a concerted integration reaction into the host genome by cutting both DNA strands, leaving 4–6 bp TSDs. Class II DNA transposons bypass RNA entirely — the transposase protein binds the terminal inverted repeats (TIRs) flanking the element, excises the DNA as a hairpin intermediate, and pastes it at a staggered cut elsewhere.

---

## Key Concepts / Details

### Secondary Level

**Discovery: Barbara McClintock and maize.** The existence of mobile genetic elements was not accepted doctrine when Barbara McClintock published her studies on unstable maize kernel colour in the 1940s–1950s. She observed that certain mutations could revert at high frequency, and that the reversion rate changed depending on the position of a second locus she called **Activator (Ac)**. She concluded that Ac was a physical element that could move in the genome and activate or silence nearby genes (which she called **Dissociation, Ds**, elements). The community treated this with deep scepticism for two decades. The molecular demonstration that DNA sequences physically move — first in bacteria (insertion sequences, 1972; Tn3, 1974) and then in eukaryotes — vindicated McClintock completely, and she was awarded the Nobel Prize in Physiology or Medicine in 1983. Ac and Ds are Class II DNA transposons (hAT superfamily); Ac encodes a transposase, while Ds is a non-autonomous deletion derivative that relies on Ac transposase in *trans*.

**Classification: two classes, four groups.**

| Class | Mechanism | Intermediate | Copy fate | Key families |
|-------|-----------|--------------|-----------|--------------|
| I — Retrotransposons | RNA pol → RNA → RT → DNA → integration | RNA | Source copy retained (copy-and-paste) | LTR types: Ty1/copia, Ty3/gypsy, ERVs; Non-LTR: LINEs, SINEs |
| II — DNA Transposons | Transposase excises, then integrates | DNA | Source copy removed (cut-and-paste) | Tc1/mariner, hAT (Ac/Ds, hobo), piggyBac, P elements |

**Human genome TE content (approximately).**

| TE class | Fraction of human genome | Copies | Key representative |
|----------|--------------------------|--------|-------------------|
| LINEs (L1) | ~20% | ~500,000 loci | L1Hs (youngest, full-length) |
| SINEs (Alu) | ~11% | ~1,100,000 copies | AluSx, AluJb, AluYa5 |
| LTR retrotransposons (HERVs) | ~8% | ~450,000 | HERV-K(HML-2), HERV-H |
| DNA transposons | ~3% | ~300,000 | MER1, MER2, Charlie, Mariner |
| **Total** | **~45%** | | |

Nearly all of these copies are evolutionary dead fossils: the typical L1 copy is 5'-truncated and incapable of autonomous transposition. Only ~80–100 L1Hs copies in any individual human genome are estimated to be currently transpositionally active.

---

### Undergraduate Level

**Class I — LTR retrotransposons (endogenous retroviruses).**

Human endogenous retroviruses (HERVs) are the remnants of ancient germline infections by exogenous retroviruses. Like infectious retroviruses, they carry *gag* (capsid), *pol* (RT + integrase), and sometimes *env* (envelope) coding regions, flanked by long terminal repeats (LTRs) that contain promoter and polyadenylation signals. Upon transcription, the RNA is reverse-transcribed in the cytoplasm into dsDNA; the integrase cuts the target genome with a 4–6 bp stagger and ligates the ends, leaving TSDs.

Most HERV copies have been degraded by mutation over millions of years. The youngest and most intact family, **HERV-K(HML-2)**, entered the primate lineage ~30 Mya and retains near-complete ORFs in some copies; a small number may still be capable of transposition. Solo LTRs — the product of homologous recombination between the two flanking LTRs that deletes the internal sequence — are far more abundant (~250,000) than full-length HERV elements (~3,000) and are important regulatory elements.

**Class I — Non-LTR retrotransposons: L1 and TPRT in detail.**

The L1 element (~6 kb when full-length) encodes two proteins from a single bicistronic mRNA:
- **ORF1p** (~40 kDa): RNA-binding protein with nucleic acid chaperone activity; forms trimers that coat L1 mRNA, protecting it from degradation and facilitating TPRT.
- **ORF2p** (~150 kDa): bifunctional enzyme with an N-terminal **apurinic/apyrimidinic endonuclease (APE)** domain that nicks the target DNA, and a C-terminal **reverse transcriptase (RT)** domain that synthesises the first-strand cDNA using the exposed 3'-OH as primer and L1 mRNA as template.

A critical property is **cis preference**: ORF2p preferentially acts on the mRNA molecule from which it was translated, rather than mobilising other sequences in *trans*. This limits the risk of uncontrolled mobilisation of cellular mRNAs. However, L1 ORF2p is "occasionally unfaithful" and can mobilise other RNAs in *trans*, which is how all human SINEs (Alu, SVA) are retrotransposed — they are non-autonomous and completely dependent on L1 ORF2p machinery.

**Target site duplications (TSDs) as diagnostic evidence.** After TPRT, the staggered cut at the target is filled in, generating short direct repeats (the TSDs) flanking the new insertion. For L1, TSDs are typically 7–20 bp. For Alu elements, they are also 7–20 bp. The presence of TSDs flanking a TE insertion — along with a poly-A tail in the case of non-LTR elements — is the primary molecular evidence that a specific copy arose by retrotransposition rather than by some other rearrangement.

**Class II — DNA transposons: cut-and-paste mechanism.**

All autonomous Class II elements encode a **transposase** enzyme that binds specifically to the **terminal inverted repeats (TIRs)** at both ends of the element. The transposase:
1. Synapses the two TIRs (bringing both ends together in a nucleoprotein complex).
2. Catalyses a double-strand cut at both ends (excision), releasing the element as a blunt or hairpin intermediate.
3. Makes a staggered cut at the target site and ligates the element ends.
4. The resulting gap is repaired, generating TSDs flanking the new insertion.

Because the source copy is removed, DNA transposons do not inherently increase in copy number during a single transposition event. Copy number increases occur when transposition happens from a replicated copy to an unreplicated region during S phase, or when the excision gap is repaired using the sister chromatid as template.

In humans, all known DNA transposon families are inactive fossils. The **Tc1/mariner** superfamily is the most abundant and is also the source of the most widely used synthetic transposons in research: **Sleeping Beauty** (reconstructed from multiple degenerate fish Tc3 sequences) and **piggyBac** (originally from the cabbage looper moth *Trichoplusia ni*).

**TE regulation I — the piRNA/PIWI pathway (germline).**

Uncontrolled TE activity in the germline would be catastrophic — new insertions in eggs and sperm are heritable mutations. The primary germline defence is the **PIWI-interacting RNA (piRNA) pathway**:

1. Genomic **piRNA clusters** — TE-dense heterochromatic loci — are transcribed to produce long single-stranded precursors.
2. Primary processing yields 24–32 nt piRNAs loaded into PIWI-family proteins (PIWI, MILI/MIWI2 in mice; Aub/Ago3 in flies).
3. The **ping-pong amplification cycle**: a sense-strand piRNA (antisense to the TE) guides MILI to cleave a TE mRNA; the cleavage product becomes the 5' end of a new piRNA that is loaded into MIWI2. MIWI2 then cleaves piRNA cluster transcripts to produce new primary piRNAs, amplifying the pool.
4. MIWI2 translocates to the nucleus where it recruits de novo DNA methyltransferase (**DNMT3A/3L**) to CpG dinucleotides in TE promoters, establishing permanent transcriptional silencing.

Failure of the piRNA pathway — seen in *Mili* or *Miwi2* knockout mice — causes massive TE de-repression in the male germline, meiotic failure, and male sterility. Females are less severely affected because maternal piRNAs are loaded into eggs before de novo methylation, providing an additional pre-loading layer of protection.

**TE regulation II — the KRAB-ZFP / KAP1 / SETDB1 system (soma and germline).**

In somatic cells (and also in the germline before piRNA establishment), TEs are silenced by a transcription-factor-based system:

1. ~350 **KRAB domain zinc-finger proteins (KRAB-ZFPs)** in humans each recognise specific TE sequences via their C2H2 zinc-finger array.
2. The KRAB domain recruits **KAP1** (TRIM28/TIF1β), a scaffolding protein.
3. KAP1 recruits the **NuRD** chromatin remodeling complex, the **SETDB1** histone H3K9me3 methyltransferase, and **HP1** proteins.
4. SETDB1 deposits H3K9me3 across the TE locus, creating a heterochromatic domain that is propagated through cell division by HP1-mediated read-write copying.

The KRAB-ZFP repertoire has expanded dramatically in placental mammals, co-evolving with the TE families that colonised their genomes — a classic **evolutionary arms race**. New TE insertions that escape existing KRAB-ZFP recognition provide a selective pressure to evolve new ZFP specificities; newly evolved ZFPs then suppress those TEs, relieving the pressure until the next successful TE variant emerges. The ~350 KRAB-ZFP genes in humans (compared to 0 in invertebrates and ~20 in non-mammalian vertebrates) directly reflect the scale of this arms race.

**TE regulation III — DNA methylation.**

CpG methylation at TE promoters is a primary transcriptional silencing mechanism, operating through the following logic: TE regulatory sequences are typically CpG-dense; methylation at these CpGs (established in the germline by DNMT3A/3L under piRNA guidance, and maintained through cell divisions by DNMT1/PCNA coupling at replication forks) prevents transcription factor binding and recruits methyl-binding repressors. The embryonic global demethylation wave — which erases parental imprints and resets the epigenome — is also a period of TE vulnerability, during which the piRNA pathway and KRAB-ZFP/KAP1 system must maintain silencing before DNMT3A/3B can re-methylate TE loci.

---

### Graduate Level

**TE exaptation — domesticated transposon genes.**

While most TE-derived sequences are neutral or deleterious, a remarkable number have been co-opted (**exapted**) for host functions. Approximately 100 human protein-coding genes are derived from TEs:

| Domesticated gene | TE donor | Human function | Reference |
|-------------------|----------|----------------|-----------|
| **ARC** (Arg3.1) | Ty3/gypsy retrotransposon Gag | Forms virus-like capsids that traffic mRNA between neurons; critical for synaptic plasticity and memory consolidation | Ashley et al. / Pastuzyn et al. 2018, *Cell* |
| **Syncytin-1** (ERVW-1) | ERV-W envelope gene | Fuses cytotrophoblasts into the syncytiotrophoblast layer of the human placenta | Blond et al. 2000, *J. Virol.* |
| **Syncytin-2** (ERVFRD-1) | ERV-FRD envelope gene | Immunosuppressive function at maternal-fetal interface; complementary fusogen | Blaise et al. 2003 |
| **CENP-B** | pogo DNA transposon (Tc1/mariner superfamily) transposase | Binds the CENP-B box in alpha-satellite repeats; essential for de novo centromere establishment | Casola et al. 2008 |
| **RAG1 / RAG2** | Transib superfamily DNA transposon | V(D)J recombinase; the entire adaptive immune recombination system is an exapted TE cut-and-paste mechanism | Kapitonov & Jurka 2005 |
| **THAP9** | Drosophila P-element family transposase | Retains transposase DNA-binding activity; function in human cells under investigation | Majumdar et al. 2013 |

The ARC case is especially striking: ARC protein self-assembles into retrovirus-like capsid particles that bud from neurons, are taken up by neighbouring cells, and deliver their mRNA cargo — a form of intercellular communication that has been independently derived from retroviral Gag in both arthropods (*Drosophila* Arc1/Arc2 from copia-like Gag) and mammals (mammalian ARC from a different Ty3/gypsy Gag), representing convergent exaptation.

The syncytin domestications are even more remarkable from a macro-evolutionary standpoint: every placental mammal lineage that evolved a haemochorial placenta (with direct maternal-fetal blood contact) independently co-opted a different ERV envelope gene as a fusogen. Mouse, human, rabbit, and carnivore syncytins are all ERV-derived but from different integration events — a natural experiment in convergent exaptation.

**TE-driven regulatory evolution.**

Beyond protein coding, TEs have seeded the genome with hundreds of thousands of potential regulatory elements:

- **Novel enhancers from TE insertions:** LTR solo elements retain their original enhancer activity but, inserted near a host gene, can activate it in a new tissue or condition. Survey studies (Bourque et al. 2008; Chuong et al. 2016) have shown that a substantial fraction of all tissue-specific enhancers in the human genome overlap TE-derived sequence. HERV-H elements contribute to pluripotency enhancers in human embryonic stem cells; HERV-K LTRs contribute interferon-stimulated response elements (ISREs) that were co-opted for antiviral gene regulation.

- **Alu elements as regulatory modifiers:** The ~1.1 million Alu copies in the human genome are GC-rich (~56%) and frequently contain CpG dinucleotides and binding motifs for SP1, NF-κB, and hormone receptor TFs. Alu insertions in introns can create new alternative splice sites (via the pre-existing polyadenylation signals or splice-donor sequences they carry), contributing to transcript diversity. SINE-containing 3' UTRs can act as competing endogenous RNA (ceRNA) sponges for miRNAs.

- **Promoter capture:** When a TE carrying a strong promoter inserts upstream of or within a gene, it can drive expression of that gene from the TE promoter in a novel tissue or developmental window — the **TE promoter capture** model. This has been documented for the amylase gene in humans (driven by an Alu-derived element conferring salivary expression) and for many cancer-associated chimeric transcripts (TE-gene fusions where an ERV LTR drives an oncogene).

**Chromosomal rearrangements via ectopic recombination.**

Because the same TE family is present at thousands of genomic locations in the same orientation, homologous recombination between non-allelic copies (non-allelic homologous recombination, NAHR) causes chromosomal rearrangements:

- **Intrachromosomal deletions:** Alu-Alu recombination between two copies on the same chromosome deletes the intervening sequence. This mechanism underlies deletions at the LDL receptor locus (familial hypercholesterolaemia), BRCA1, and hundreds of other disease loci.
- **Inversions:** Recombination between two Alu elements in opposite orientations causes the segment between them to invert.
- **Translocations:** Inter-chromosomal L1-L1 or Alu-Alu recombination can generate translocations, though these are rarer because they require simultaneous double-strand breaks on two chromosomes.

NAHR between TE copies is estimated to account for ~0.3% of all de novo pathogenic mutations in humans, and for a disproportionate fraction of structural variants in cancer genomes.

**TE accumulation, genome size, and effective population size.**

Michael Lynch and John Conery's **mutational hazard hypothesis** (2003) provides the most coherent quantitative framework for why TE content (and hence genome size) varies across species: in large populations (high effective population size $N_e$), natural selection is efficient enough to purge even mildly deleterious TE insertions; in small populations (low $N_e$), genetic drift overwhelms weak selection and TEs accumulate. Across a broad survey of eukaryotes:

- Yeast ($N_e \sim 10^7$): genome ~12 Mb, ~3% TEs, vigorous TE purging
- Invertebrates ($N_e \sim 10^5$–$10^7$): genomes 100–500 Mb, ~10–30% TEs
- Vertebrates ($N_e \sim 10^3$–$10^6$): genomes 1–3 Gb, ~30–70% TEs
- Plants with small $N_e$ (polyploids, selfers): genomes up to 150 Gb (Paris japonica), dominated by LTR retrotransposons

The conclusion is not that TEs are uniformly harmful — many are neutral — but that the accumulation rate is primarily set by drift, not adaptive value.

---

## Python Demo

```python
# pip install numpy matplotlib
# Simulates TE copy number evolution under a copy-and-paste birth-death model.
# Each generation, every existing TE copy:
#   - produces a new insertion with probability r (transposition)
#   - is removed with probability s_del (purifying selection / ectopic deletion)
# The net growth rate is (r - s_del); if r > s_del, mean copy number grows
# exponentially, matching what is observed in species with low N_e.

import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Model parameters ---
N_GENOMES   = 2000    # independent genome lineages (population)
N_GEN       = 150     # generations to simulate
R_COPY      = 0.05    # transposition rate: new insertions per TE copy per generation
S_DEL       = 0.03    # purifying selection rate: copies removed per TE copy per generation
INITIAL_N   = 2       # starting TE copy number per genome

# --- Simulate ---
copies = np.full(N_GENOMES, float(INITIAL_N))
mean_per_gen = np.zeros(N_GEN + 1)
mean_per_gen[0] = INITIAL_N

snapshot_gens = [0, 30, 60, 100, 150]
snapshots = {0: copies.copy()}

for t in range(1, N_GEN + 1):
    # Copy-and-paste: each existing copy spawns new insertions ~ Poisson(r)
    new_ins = np.random.poisson(R_COPY * copies)
    # Purifying selection: each copy removed with prob ~ Poisson(s_del) (approx)
    removed = np.random.poisson(S_DEL * copies)
    copies = np.maximum(copies + new_ins - removed, 0)
    mean_per_gen[t] = copies.mean()
    if t in snapshot_gens:
        snapshots[t] = copies.copy()

# Analytical mean: E[n(t)] = n0 * exp((r - s) * t)  [birth-death process]
gen_axis   = np.arange(N_GEN + 1)
analytical = INITIAL_N * np.exp((R_COPY - S_DEL) * gen_axis)

# --- Plot ---
fig, axes = plt.subplots(1, 2, figsize=(13, 5))

axes[0].semilogy(gen_axis, mean_per_gen,  lw=2.5, color='steelblue', label='Simulated mean')
axes[0].semilogy(gen_axis, analytical,    lw=2.0, color='tomato', ls='--',
                 label=f'Theory: n0 * e^(r-s)t   (r-s = {R_COPY - S_DEL:.2f})')
axes[0].set_xlabel('Generation', fontsize=12)
axes[0].set_ylabel('Mean TE copies per genome (log scale)', fontsize=11)
axes[0].set_title(f'TE Expansion  (r = {R_COPY}, s_del = {S_DEL})', fontsize=12)
axes[0].legend(fontsize=10)
axes[0].grid(True, which='both', alpha=0.3)

palette = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336']
for (t_s, arr), col in zip(sorted(snapshots.items()), palette):
    axes[1].hist(arr, bins=40, alpha=0.55, color=col, density=True,
                 label=f'Gen {t_s}  (mean = {arr.mean():.1f})')
axes[1].set_xlabel('TE copies per genome', fontsize=12)
axes[1].set_ylabel('Probability density', fontsize=12)
axes[1].set_title('Copy-Number Distribution Over Generations', fontsize=12)
axes[1].legend(fontsize=9)
axes[1].grid(axis='y', alpha=0.3)

plt.tight_layout()
plt.savefig('te_expansion.png', dpi=150)
plt.show()

print(f"Net growth rate (r - s_del) : {R_COPY - S_DEL:.3f} per generation")
print(f"Theoretical mean at gen {N_GEN}: {INITIAL_N * np.exp((R_COPY - S_DEL) * N_GEN):.1f}")
print(f"Simulated   mean at gen {N_GEN}: {copies.mean():.1f}")
```

**Sample output:**

```
Net growth rate (r - s_del) : 0.020 per generation
Theoretical mean at gen 150: 40.2
Simulated   mean at gen 150: 39.8
```

The right panel shows the copy number distribution broadening and shifting right over generations, reflecting the variance intrinsic to the Poisson transposition process. When `r` is set equal to `s_del` (neutral evolution), mean copy number stays flat but variance grows — mimicking the drift-dominated TE dynamics seen in small-$N_e$ populations where selection is too weak to constrain stochastic transposition events.

---

## Real-World Applications

> **Cancer genome instability via L1 retrotransposition.** L1 elements are reactivated in many cancers by global DNA hypomethylation. In colorectal cancer, somatic L1 insertions into tumour suppressor genes (including *APC* and *TP53*) have been documented as driver mutations. Pan-cancer surveys (Rodic et al. 2015; Tubio et al. 2014, *Science*) identified thousands of somatic L1 insertions in epithelial cancers, with a small number at recurrently disrupted genes. High-throughput detection uses L1-capture sequencing — targeted enrichment of L1 junction reads — to map new insertions at single-nucleotide resolution.

> **Sleeping Beauty transposon in gene therapy and forward genetics.** The *Sleeping Beauty* (SB) synthetic transposon was reconstructed from degenerate Tc3 sequences in salmonid fish genomes by Ivics et al. (1997), restoring a functional transposase. SB has a relatively random integration profile (compared to lentiviral vectors that prefer promoters), making it less likely to activate proto-oncogenes. SB is in clinical trials for adoptive T-cell therapy (CAR-T manufacturing), where it inserts the chimeric antigen receptor transgene into T cells *ex vivo*. In mice, transposon-based insertional mutagenesis screens (using SB or piggyBac as mutagens) have identified hundreds of cancer driver genes by showing which integrations accelerate tumour formation.

> **Syncytin knockouts reveal ERV domestication in placentation.** Mice homozygous for a deletion of syncytin-A or syncytin-B (the murine ERV-derived fusogens, distinct from human syncytins) die in utero due to failure of syncytiotrophoblast layer formation. This demonstrates that what was once a viral gene, integrated into the germline ~20 Mya, has become so integral to mammalian reproductive biology that it is now an essential host gene — not a parasite but an organ component.

> **HERV-K reactivation in ALS and cancer.** Human endogenous retrovirus K (HERV-K HML-2) elements, normally silenced by KRAB-ZFP/KAP1 and DNA methylation, are de-repressed in neurons of amyotrophic lateral sclerosis (ALS) patients. The HERV-K Env protein has been shown to be neurotoxic in mouse models (Li et al. 2015, *Science Translational Medicine*). Whether HERV-K reactivation is a driver or consequence of neurodegeneration is under active investigation, but it illustrates that TEs are not merely evolutionary relics — they remain conditionally active participants in human disease.

---

## Common Pitfalls

- **Confusing "cut-and-paste" with "copy-and-paste."** DNA transposons (Class II) excise the source copy and reinsert it — the net copy number does not increase unless transposition occurs from a post-replication chromosome to a pre-replication region. Retrotransposons (Class I) always produce a new copy while the source is retained. This distinction is critical for understanding why retrotransposons dominate eukaryotic genomes while DNA transposons do not.

- **Assuming TE silencing and TE function are mutually exclusive.** Many HERV LTRs that are retained in the genome under purifying selection (i.e., functional) are also partially methylated. Epigenetic silencing suppresses runaway expression, not all expression. Low-level or cell-type-specific transcription from a TE-derived regulatory element can be adaptive even while bulk methylation of the locus is maintained.

- **Treating all TEs as harmful mutations.** The majority of TE insertions in any genome are tolerated neutrally — they fall in large intergenic deserts or introns where disruption of function is unlikely. The fraction that is actively deleterious (inactivating exons, disrupting splice sites, causing ectopic recombination) is small relative to total copy number. Purifying selection keeps this fraction low, not zero.

- **Equating "non-autonomous" with "non-dangerous."** SINEs (Alu, SVA, B1, B2) cannot mobilise themselves, but they hijack L1 ORF2p machinery in *trans* and are actively transposing in the human germline. Alu elements cause the majority of TE-mediated human disease mutations simply by virtue of their enormous copy number (~1.1 million) and continued low-level retrotransposition rate.

- **Misidentifying TSDs as the TE itself.** TSDs are short direct repeats of target-site sequence flanking the insert — they are copied from the host genome at the insertion site, not from the TE. When identifying a new TE insertion, the TSDs should be subtracted from the TE sequence. Failure to do this leads to inflated estimates of TE length and incorrect subfamily assignment by RepeatMasker.

- **Overgeneralising piRNA/KRAB-ZFP to all cell types.** The piRNA pathway is restricted to the germline and (in some species) early embryo. KRAB-ZFP/KAP1 is the primary somatic silencer. In the early embryo between zygotic genome activation and re-establishment of methylation, neither system is fully active, creating a documented window of TE vulnerability (the "epigenetic crisis" window) that is especially relevant to *in vitro* fertilisation and early embryonic reprogramming.

---

## Related Concepts

- [[Genome_Organization_and_Structure]] — TEs constitute ~45% of the human genome; the C-value paradox is largely explained by differential TE accumulation across species
- [[Gene_Regulation_and_Epigenetics]] — piRNA/PIWI and KRAB-ZFP/KAP1/SETDB1 are two of the most evolutionarily important instances of epigenetic transcriptional silencing described in that note; DNA methylation at TE promoters uses the same DNMT machinery discussed there
- [[Chromatin_Structure_and_Nucleosomes]] — SETDB1-mediated H3K9me3 deposition over TE loci creates constitutive heterochromatin using the same HP1-based spreading mechanism described in the context of pericentric heterochromatin
- [[Population_Genetics_and_Hardy_Weinberg]] — effective population size ($N_e$) is the central determinant of TE accumulation rate; genetic drift in small populations allows weakly deleterious TE insertions to fix, directly linking evolutionary genetics to genome architecture
- [[Comparative_Genomics_and_Synteny]] — TE insertions are lineage-specific and can be used as phylogenetic markers (SINE insertions are especially useful because they are essentially irreversible homoplasy-free characters); cross-species alignments expose TE-derived regulatory elements under purifying selection
- [[DNA_Repair_and_Mutation]] — TE insertions are a mechanistically distinct class of mutation; ectopic recombination between non-allelic TE copies (NAHR) is a major cause of structural variants and chromosomal rearrangements, described in that note under double-strand break repair pathways
- [[_MOC_Evolutionary_and_Systems_Genetics|↑ Evolutionary and Systems Genetics MOC]]

---

## Review Questions

1. **(Secondary)** Barbara McClintock showed that Ds elements in maize could not move on their own but required the presence of Ac elements elsewhere in the genome. Using modern TE terminology, explain what Ds and Ac are, what molecular property of Ds elements makes them non-autonomous, and why this host-parasite relationship between autonomous and non-autonomous elements is so common in eukaryotic genomes. How does this analogy extend to the relationship between L1 elements and Alu SINEs in the human genome?

2. **(Undergraduate)** You are analysing whole-genome sequencing data from a patient with a rare genetic disease and discover a novel insertion in the coding sequence of a disease gene. The insertion is 1,247 bp long, has a 14 bp poly-A tail at its 3' end, and is flanked by two identical 12 bp direct repeats (AGGCTTACGCTA) that do not appear in either parent. Using your knowledge of retrotransposon mechanism and target-site duplications, determine the likely TE class responsible, describe the molecular steps that created this insertion, and state what additional sequence features you would examine in the insertion to determine which specific TE family it belongs to.

3. **(Graduate)** The KRAB-ZFP / KAP1 system and the piRNA / PIWI pathway are the two main TE silencing mechanisms in mammals. Compare their cell-type specificity, the chromatin state they establish, the mechanism of recognition (sequence-specific versus small RNA-guided), and their evolutionary origin. A new synthetic retrotransposon is introduced into a mouse zygote carrying a deletion of both *Miwi2* and the relevant KRAB-ZFP for that element. Predict the consequences for TE copy number, germline integrity, and offspring phenotype, and describe which aspects of the Lynch-Conery mutational hazard hypothesis are illustrated by your predicted outcome.

---

## Sources

- Lewin, B. et al. — *Lewin's Genes XII* (2018), Ch. 16 (Transposable elements)
- Bourque, G. et al. — "Ten things you should know about transposable elements," *Genome Biology* 19, 199 (2018). https://doi.org/10.1186/s13059-018-1577-z
- Lander, E.S. et al. — "Initial sequencing and analysis of the human genome," *Nature* 409, 860–921 (2001). https://doi.org/10.1038/35057062
- Pastuzyn, E.D. et al. — "The neuronal gene Arc encodes a repurposed retrotransposon Gag protein that mediates intercellular RNA transfer," *Cell* 172, 275–288 (2018). https://doi.org/10.1016/j.cell.2017.12.024
- Ashley, J. et al. — "Retrovirus-like Gag protein Arc1 binds RNA and traffics across synaptic boutons," *Cell* 172, 262–274 (2018). https://doi.org/10.1016/j.cell.2017.12.029
- Kapitonov, V.V. & Jurka, J. — "RAG1 core and V(D)J recombination signal sequences were derived from Transib transposons," *PLOS Biology* 3, e181 (2005). https://doi.org/10.1371/journal.pbio.0030181
- Chuong, E.B. et al. — "Regulatory evolution of innate immunity through co-option of endogenous retroviruses," *Science* 351, 1083–1087 (2016). https://doi.org/10.1126/science.aad5497
- Lynch, M. & Conery, J.S. — "The origins of genome complexity," *Science* 302, 1401–1404 (2003). https://doi.org/10.1126/science.1089370
- Tubio, J.M.C. et al. — "Extensive transduction of nonrepetitive DNA mediated by L1 retrotransposition in cancer genomes," *Science* 345, 1251343 (2014). https://doi.org/10.1126/science.1251343
- Feschotte, C. — "Transposable elements and the evolution of regulatory networks," *Nature Reviews Genetics* 9, 397–405 (2008). https://doi.org/10.1038/nrg2337

---

#Genetics #EvolutionaryGenetics #TransposableElements #GenomeEvolution
