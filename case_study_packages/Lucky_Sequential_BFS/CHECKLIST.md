# Final quality audit and checklist

Legend: [x] done and checked in this session, [ ] needs YOUR action, [~] done with a caveat.

## A. Manual requirements (BCSE412L Case Study Assessment) -> evidence
| Manual requirement | Status | Where |
|---|---|---|
| Literature review, >=5 scholarly papers, >=3 recent | [~] 8 sources, 3 recent ([5],[6],[7]); several DOIs unconfirmed | REFERENCES.md, report section 1 |
| Implement a clearly defined baseline before optimisation | [x] | include/bfs_seq.hpp |
| >=3 problem sizes | [x] 4 sizes (2^14..2^20) + density sweep | data/raw/bfs_raw.csv |
| >=3 thread/resource configurations | [x] 1, 2, 4 threads | same |
| Execution time, speedup, efficiency, scalability | [x] | data/derived/bfs_derived.csv, report section 4 |
| Separate computation / synchronization / overhead where possible | [~] barrier wait + frontier-merge measured (instrumented runs, approximate); scheduling time = NA; communication = NA (shared memory) | report 3.6, 4.3 |
| Repeat timings; mean/median + variation | [x] 7 runs; median, std, CV, min, max | derived CSV |
| >=3 graphs and one summary table | [x] 7 graphs, tables 4-6 | figures/, report |
| Explain observed performance | [x] sections 4.1-4.4 | report |
| Limitations, threats to validity, >=3 future directions | [x] 7 limitations, 5 directions | report 5, 6 |
| Individual technical note 2-3 pages each | [x] 2 pages / 3 pages (LibreOffice count; check in Word) | report/Technical_Note_*.docx |
| Batch report 8-12 pages | [x] 9 pages (LibreOffice count; check in Word) | report/CS4-S01_Integrated_Report.docx |
| Source code with instructions | [x] | README.md, Makefile |
| Raw experimental data in CSV | [x] 588 rows, manual's required columns + extras | data/raw/bfs_raw.csv |
| Plots in editable/source form | [x] | scripts/plot.py (PNG in figures/) |
| Required CSV columns (Student_ID ... Run_ID) | [x] | raw + derived CSV |
| Derived metrics computed from raw data, not typed | [x] | scripts/analyze.py |
| Record CPU/RAM/OS/compiler/flags/OpenMP config | [x] for the measured machine | data/env/environment.json, report Table 3 |
| Do not report speedup without identifying baseline | [x] baseline = sequential BFS on same graph | report 3.6 |
| Do not compare different hardware without labelling | [x] only one machine | report 3.4 |
| Report unexpected results; do not delete outliers | [x] nothing removed; CV up to 50% reported | report 4.1, 5 |
| CPU parallel **and GPU if available** (CS4-S01 objective) | [~] no GPU available -> not done, stated as limitation / future work | report 3.4, 5, 6 |
| SNAP/SuiteSparse/Graph500-style graphs | [~] Graph500-style R-MAT + synthetic only; no SNAP/SuiteSparse download | report 5 |

## B. Technical audit performed
* [x] Code compiles with `g++ -O3 -std=c++17 -fopenmp -Wall -Wextra` with no warnings (g++ 13.3).
* [x] `make test`: 12 hand-checked cases + randomized cross-checks, **1402 passed, 0 failed** (logs/correctness_test_output.txt).
* [x] All 588 timed runs verified against sequential distances (column Verified = 1); analyze.py aborts otherwise.
* [x] Sequential and parallel runs used identical graphs (Graph_Checksum equal; analyze.py aborts otherwise).
* [x] Speedup = median seq / median par (same graph); Efficiency = speedup / threads; TEPS = edges in reached component / time.
* [x] Numbers in report/notes are generated from the derived CSV by scripts/build_docs.py (no hand-typed results). Abstract length 193 words.
* [~] Qualitative conclusions were written from OUR data; if you re-run on another machine, re-read them.
* [~] Page counts measured with LibreOffice; Word may differ by a fraction of a page.

## C. WHAT YOU MUST DO (items I cannot do for you)
1. [ ] **The measurements come from a 4-vCPU Intel Xeon cloud VM (this environment), not from your laptop.** The report says so honestly (Table 3). Two options:
   (a) submit as is, clearly stating the machine (acceptable if the faculty allows; be ready to explain in the viva), or
   (b) **recommended:** re-run on your own computer: `make && python3 scripts/run_experiments.py --fresh --student1-id <Reg1> --student2-id <Reg2> --batch-id <Batch> --note "..."`, then `python3 scripts/analyze.py && python3 scripts/plot.py && python3 scripts/build_docs.py`, and **re-read every qualitative sentence** in the rebuilt docs (a different machine may show different crossovers). Expect 10-30 minutes.
2. [ ] Replace placeholders `[Name, Reg. No.]`, `[Batch ID]` in the three .docx files (title lines). If you do not re-run, also replace IDs in the raw CSV ID columns, e.g. `sed -i 's/^STUDENT1,BATCH_TBD/<Reg1>,<Batch>/; s/^STUDENT2,BATCH_TBD/<Reg2>,<Batch>/' data/raw/bfs_raw.csv data/derived/bfs_derived.csv` (only the ID columns change; no measurement is touched).
3. [ ] Open each link in REFERENCES.md and complete the items marked "check" (DOIs for [2],[3],[4]; volume/article numbers for [5],[6],[7]; author list of [7]). Read at least the abstracts and the sections you cite. I could not reach Crossref/ACM/IEEE/Wiley from this environment.
4. [ ] Read the code and the report until you can explain them (see notes/VIVA_PREP.md). The individual-contribution split follows your instruction; make sure each of you can defend your own part.
5. [ ] Check VIT's policy on AI-assisted work and add any required disclosure/acknowledgement.
6. [ ] Submit the Word document(s) on VTop by **19 October 2026** (deadline in the manual). Open the .docx in Word first and check figures/tables and page count.
7. [ ] Optional if you want the manual's GPU objective: a CUDA BFS needs a CUDA-capable GPU (none here).
8. [ ] Optional: add a SNAP/SuiteSparse graph (download an edge list, convert to the simple format in include/graph.hpp, run with `--graph file --file ...`).
