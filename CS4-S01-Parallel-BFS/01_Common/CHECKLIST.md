# Final quality audit and checklist  (rebuilt 2026-10-19)

Legend: [x] done and verified in this session, [~] done with a caveat, [ ] needs YOUR action.

## A. Official manual (BCSE412L Case Study Assessment) -> evidence
| Manual requirement | Status | Where |
|---|---|---|
| Report structure: Title, Abstract (150-200 words), Introduction + literature survey, Problem and research question, Methodology, Results and discussion, Limitations, Conclusion and future work, References | [x] Abstract = 193 words (checked by the build script). Sections use the manual's own headings and numbering: 2 Abstract, 3 Introduction (along with Literature Survey), 4 Problem and Research Question, 6 Methodology, 7 Results and Discussion, 8 Limitations, 9 Conclusion and Future Work, 10 References (the manual has no section 5, so none was invented) | CS4-S01_Integrated_Report.docx |
| Literature review: >= 5 scholarly papers, >= 3 recent | [~] 8 sources, 3 recent ([5] 2021, [6] 2022, [7] 2024). Several DOIs/volumes still marked CHECK | REFERENCES.md |
| Implement a clearly defined baseline before optimisation | [x] | 02_Lucky_Sequential_BFS/bfs_seq.hpp |
| >= 3 problem sizes | [x] 4 sizes (2^14 ... 2^20 vertices) + density sweep | data/raw/bfs_raw.csv |
| >= 3 thread/resource configurations | [x] 1, 2, 4 threads (machine has 4 logical CPUs) | same |
| Execution time, speedup, efficiency, scalability | [x] | data/derived/bfs_derived.csv, report section 4 |
| Separate computation / communication / synchronization / scheduling overhead where possible | [~] barrier wait and frontier-merge time measured (instrumented runs, approximate); scheduling time = NA (not separable); communication = NA (shared memory) | report 3.6, 4.3 |
| Repeat timings; mean/median + variation | [x] 7 runs per configuration; median, mean, std, CV, min, max stored | derived CSV |
| >= 3 graphs and one summary table | [x] 7 graphs, 3 summary tables in the report | plots/, report |
| Explain observed performance | [x] sections 4.1-4.4 | report |
| Limitations, threats to validity, >= 3 future directions | [x] 7 limitations, 5 directions | report 5, 6 |
| Individual technical note 2-3 pages | [x] Student 1 = 2 pages, Student 2 = 3 pages (LibreOffice count, A4; confirm in Word) | 02_/03_ folders |
| Batch report 8-12 pages | [x] 9 pages (LibreOffice count, A4; confirm in Word) | 01_Common |
| Source code with instructions | [x] | README.md, Makefile |
| Raw experimental data in CSV | [x] 588 rows; all required columns | data/raw/bfs_raw.csv |
| Plots in editable/source form | [x] scripts/plot.py + PNGs | scripts/plot.py, plots/ |
| Derived metrics computed from raw data, not typed | [x] | scripts/analyze.py |
| Record CPU/RAM/OS/compiler/flags/runtime config | [x] for the measured machine | data/env/environment.json, report Table 3 |
| No speedup without a stated baseline; no unlabeled cross-hardware comparison | [x] baseline = sequential BFS on the same graph; one machine only | report 3.4, 3.6 |
| Report unexpected results, do not delete outliers | [x] all 588 runs kept; 13 of 84 configurations have CV > 15 %, largest run 2.5x its median | report 4.1, 5; logs/audit_report.txt |
| Objective "compare CPU parallel and GPU if available" | [~] no GPU available -> not done; stated as limitation + future work | report 3.4, 5, 6 |
| Datasets "SNAP/SuiteSparse/Graph500-style" | [~] Graph500-style R-MAT + synthetic only | report 5 |

## B. Audit performed in this session (scripts/audit.py -> logs/audit_report.txt)
* [x] Raw CSV: required columns present; 84 configurations x exactly 7 runs; every run Verified = 1; sequential and parallel runs of each graph share one Graph_Checksum; one hardware label; 1-thread barrier wait = 0.
* [x] **Independent recomputation** (standard library only, no code shared with analyze.py) of median, speedup, efficiency, MTEPS and CV for all 84 configurations: identical to data/derived/bfs_derived.csv.
* [x] Formulas: speedup = sequential median / parallel median (same graph); efficiency = speedup / threads; TEPS = undirected edges in reached component / time.
* [x] **232 numbers printed in the Word tables** (report Tables 4-6, Note 1 Table 1, Note 2 Tables 1-2) match the CSV within printed rounding.
* [x] Source files in the three appendices are line-for-line identical to the real source files (checked programmatically).
* [x] `make` compiles without warnings and `make test` passes 1402/1402 checks from the new folder layout; the experiment runner `--quick` smoke test runs and verifies in the new layout.
* [x] The raw CSV is byte-identical (MD5) to the original measurement; no data or algorithm was changed in the rebuild (source files were only moved).

### Errors found in the earlier generated documents and corrected
1. Note 2 said random graphs have "tens of thousands of edge checks per level"; the data give about 1.2 million undirected edges per level (2^20 vertices) -> corrected, now computed from the CSV.
2. "Edge examinations per level" were really undirected edges (each scanned twice in a top-down BFS) -> relabelled "undirected edges per level" everywhere (text, Table, Figure 7 axis).
3. "1,400 randomized comparisons" was wrong: the 1,402 checks include the hand-case checks -> reworded in the report and both notes.
4. Figure 2 caption described the error bars wrongly -> now states the exact definition (fastest sequential / slowest parallel run ... slowest sequential / fastest parallel run).
5. Causal statements that were not measured were softened ("likely", "presumably"): barrier cost growth with threads, the unmeasured part of path-graph time, grid per-level overhead (now supported with measured per-level times 6.3 vs 10.8 microseconds).
6. Hypothesis H2: speedup is not strictly monotonic with size (random graph 2.79 at 2^16 vs 2.73 at 2^18) -> stated.
7. Measurement-noise statement now gives measured counts (13 of 84 configurations with CV > 15 %, worst run 2.5x median, noisy baseline CV 50 % at the smallest random graph).
8. Format: headings follow the manual's wording, native Word equations added, numbered Tables/Figures per document, A4 pages with identical margins, theme-font fix for headings, 200-dpi figures.

## C. What YOU must do (cannot be done for you)
1. [ ] **Names, registration numbers, batch ID are still placeholders** (`[Name, Reg. No.]`, `[Batch ID]`, `[Student N name, Reg. No.]`, `[ID]`) in the three main Word documents and the two code appendices. The CSV ID columns contain the defaults `STUDENT1`, `STUDENT2`, `BATCH_TBD`.
   To set the CSV IDs (does not touch any measurement), from `01_Common/` in WSL/Git-Bash:
   `sed -i 's/^STUDENT1,BATCH_TBD/<RegNo1>,<Batch>/; s/^STUDENT2,BATCH_TBD/<RegNo2>,<Batch>/' data/raw/bfs_raw.csv data/derived/bfs_derived.csv`
2. [ ] **The measurements come from a 4-vCPU Intel Xeon cloud VM (Linux), not from your PC.** The report says so. Either keep it (be ready to explain) or re-run on your own computer (README steps 5-8) and then **re-read every qualitative sentence** of the rebuilt documents.
3. [ ] Open each reference in REFERENCES.md and resolve the CHECK items (DOIs of [2], [3]; IEEE DOI of [4]; article numbers; year/volume of [6]; authors of [7]). Read the papers you cite, especially [2], [4], [7].
4. [ ] Open all Word files in Word: check pages (report 8-12, notes 2-3), equations (they are native Word equations; they were verified in LibreOffice, not in Word), figure placement.
5. [ ] Windows compile: not tested by the assistant (Linux only). Use WSL2 (README) or fix paths if MSYS2 behaves differently.
6. [ ] Learn the code and results (notes/VIVA_PREP.md). Check VIT's policy on AI-assisted work and add any required disclosure.
7. [ ] Confirm with your faculty what exactly must be uploaded on VTop (the manual only says "document (Word)", deadline **19 October 2026**) and whether each student uploads separately.
8. [ ] Optional: GPU/CUDA BFS (needs a GPU), SNAP/SuiteSparse graphs, more threads on a bigger machine.
