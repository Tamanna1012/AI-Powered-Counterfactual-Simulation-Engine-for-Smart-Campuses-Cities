# CONTRIBUTION - Student 1 (Lucky): Sequential BFS baseline

Case study CS4-S01 Parallel Breadth-First Search - BCSE412L Parallel Computing, VIT Vellore. Student 1: `[Name, Reg. No.]` (placeholder - fill in).

## Responsibility (as planned for the case study)
* Explain the BFS algorithm and its O(n + m) complexity.
* Sequential BFS implementation in C++.
* Graph preparation: CSR representation, reproducible generators (path, grid, random, R-MAT), start-vertex rule, graph checksum.
* Correctness testing: 12 hand-computed cases, independent validator, cross-checks.
* Baseline performance measurements and methodology (median of 7 runs, warm-up, timed region).

## Files that belong to Student 1
| File | Purpose |
|---|---|
| `bfs_seq.hpp` | Sequential queue-based BFS, `validate_bfs()` independent correctness check, traversal statistics |
| `bfs_seq_main.cpp` | Baseline benchmark program (builds graph, warm-up, timed repetitions, raw-CSV rows) |
| `../01_Common/graph.hpp` | CSR graph, generators, graph-file loader, start-vertex rule, checksum |
| `../01_Common/tests/cases/` | 12 test graphs and hand-computed expected distances |
| `Technical_Note_Student1.docx` | Individual technical note (5 pages: algorithm, worked example, graph statistics, test-case table, baseline results, run-to-run variation, baseline sensitivity) |
| `Student1_Source_Code_Appendix.docx` | Supplementary: complete source of bfs_seq.hpp and bfs_seq_main.cpp |

## Shared files (both students)
`../01_Common/`: `bench_common.hpp`, `bfs_tests.cpp`, `Makefile`, `scripts/`, `data/`, `plots/`, `logs/`, `README.md`, `REFERENCES.md`, `CHECKLIST.md`, and the integrated report `CS4-S01_Integrated_Report.docx`.

## Where the baseline results are
* Raw: `../01_Common/data/raw/bfs_raw.csv`, rows with `Algorithm = SEQ_BFS` (the file also holds the parallel rows; it is not split so the raw data stays untouched).
* Derived baseline statistics: `../01_Common/data/derived/bfs_derived.csv` (`SEQ_BFS` rows) and Table 1 of the technical note.
* Baseline vs parallel plots: `../01_Common/plots/fig1_time_vs_size.png`, `fig3_throughput_vs_density.png`, `fig4_speedup_vs_size.png`.

## Reproduce
From `01_Common/`: `make`, `make test`, `bin/bfs_seq --graph random --n 262144 --deg 16 --reps 7`, then see `README.md` (steps 5-8).

## Authorship note
The materials were drafted with AI assistance (Claude Code) following the division of work above. Both students must read, run and be able to explain their parts
(`../01_Common/notes/VIVA_PREP.md`) and should follow VIT's rules on disclosing AI assistance.
