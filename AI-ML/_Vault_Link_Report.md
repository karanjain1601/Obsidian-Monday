---
title: Vault Link Report
tags: [meta, report, vault-maintenance]
created: 2026-07-26
---

# Vault Link Report — AI-ML Section

Generated: 2026-07-26
Run: Back-link all content notes to their parent section MOC.

---

## Summary

| Category | Count |
|---|---|
| Total content notes processed | 218 |
| Notes already had MOC link | 0 |
| Notes updated (MOC link added) | 218 |
| Notes skipped — no Related Concepts section | 0 |
| Orphaned notes (not in any section folder) | 0 |
| Skipped — MOC files or README | 14 |

**Result:** Every content note now links back to its section MOC via `[[<MOC>|↑ Section MOC]]` as the first entry in its Related Concepts section.

---

## What Was Added

Each content note received this line as the first entry in `## Related Concepts`, followed by a blank line before any pre-existing links:

```
- [[_MOC_SectionName|↑ Section MOC]]
```

---

## Section Breakdown

| Section | MOC | Content Notes Updated |
|---|---|---|
| 00_Foundations | `_MOC_Foundations` | 7 |
| 01_Classical_ML | `_MOC_Classical_ML` | 27 |
| 02_Deep_Learning | `_MOC_Deep_Learning` | 25 |
| 03_NLP | `_MOC_NLP` | 38 |
| 04_Computer_Vision | `_MOC_Computer_Vision` | 18 |
| 05_Generative_AI | `_MOC_Generative_AI` | 18 |
| 06_MLOps | `_MOC_MLOps` | 24 |
| 07_Infrastructure | `_MOC_Infrastructure` | 19 |
| 08_Data_Engineering | `_MOC_Data_Engineering` | 10 |
| 09_AI_System_Design | `_MOC_AI_System_Design` | 9 |
| 10_Evaluation_and_Safety | `_MOC_Evaluation_Safety` | 11 |
| 11_Key_Papers | `_MOC_Key_Papers` | 12 |
| **Total** | | **218** |

---

## Skipped Files (MOC files and README — intentionally excluded)

These files were not modified because they are the MOC files themselves:

- `00_Foundations/_MOC_Foundations.md`
- `01_Classical_ML/_MOC_Classical_ML.md`
- `02_Deep_Learning/_MOC_Deep_Learning.md`
- `03_NLP/_MOC_NLP.md`
- `04_Computer_Vision/_MOC_Computer_Vision.md`
- `05_Generative_AI/_MOC_Generative_AI.md`
- `06_MLOps/_MOC_MLOps.md`
- `07_Infrastructure/_MOC_Infrastructure.md`
- `08_Data_Engineering/_MOC_Data_Engineering.md`
- `09_AI_System_Design/_MOC_AI_System_Design.md`
- `10_Evaluation_and_Safety/_MOC_Evaluation_Safety.md`
- `11_Key_Papers/_MOC_Key_Papers.md`
- `AI-ML_Master_MOC.md` (if present)
- `README.md` (if present)

---

## Orphaned Notes

None. Every content note belongs to a recognised section folder.

---

## Notes with Missing Related Concepts Section

None. All 218 content notes had a `## Related Concepts` section.

---

#meta #vault-maintenance #report
