# CONTRIBUTION - Student 2 (girlfriend): OpenMP parallel BFS

Case study CS4-S01 Parallel Breadth-First Search - BCSE412L Parallel Computing, VIT Vellore. Student 2: `[Name, Reg. No.]` (placeholder - fill in).

## Responsibility (as planned for the case study)
* Parallel BFS in C++ with OpenMP (level-synchronous, parallel frontier processing).
* Thread-configuration and scaling experiments (1, 2, 4 threads).
* Speedup, efficiency and traversal throughput (MTEPS).
* Synchronization and parallel-overhead analysis (barrier wait, frontier-merge time) and scalability.

## Files that belong to Student 2
| File | Purpose |
|---|---|
| `bfs_par.hpp` | Level-synchronous OpenMP BFS: atomic compare-and-swap on `dist[v]`, per-thread frontier buffers, prefix-sum merge, barriers, optional instrumentation |
| `bfs_par_main.cpp` | Parallel benchmark program (thread list, schedule/chunk options, per-run verification against the sequential result, instrumented overhead run, raw-CSV rows) |
| `Technical_Note_Student2.docx` | Individual technical note (5 pages: parallel algorithm, shared-data table, experiment parameters, full speedup/efficiency/TEPS tables, synchronization analysis, Karp-Flatt serial fraction) |
| `Student2_Source_Code_Appendix.docx` | Supplementary: complete source of bfs_par.hpp and bfs_par_main.cpp |

## Reference baseline from Student 1 (needed for every speedup)
`../02_Lucky_Sequential_BFS/bfs_seq.hpp`, `bfs_seq_main.cpp`, `../01_Common/graph.hpp`, `../01_Common/tests/cases/`.

## Shared files (both students)
`../01_Common/`: `bench_common.hpp`, `bfs_tests.cpp`, `Makefile`, `scripts/`, `data/`, `plots/`, `logs/`, `README.md`, `REFERENCES.md`, `CHECKLIST.md`, and the integrated report `CS4-S01_Integrated_Report.docx`.

## Where the parallel results are
* Raw: `../01_Common/data/raw/bfs_raw.csv`, rows with `Algorithm = PAR_BFS_LEVELSYNC` (columns `Threads`, `Execution_Time`, `Synchronization_Time`, `Frontier_Merge_Time`, `Verified`).
* Derived speedup / efficiency / MTEPS / overhead shares: `../01_Common/data/derived/bfs_derived.csv`; Tables 4-6 of the report; Tables 3-6 of the technical note.
* Plots: `../01_Common/plots/fig2_speedup_vs_threads.png`, `fig5_efficiency_vs_threads.png`, `fig6_overhead_breakdown.png`, `fig7_work_per_level_vs_speedup.png` (and fig1, fig3, fig4).

## Reproduce
From `01_Common/`: `make`, `make test`, `bin/bfs_par --graph random --n 262144 --deg 16 --threads 1,2,4 --reps 7` (`--help` lists `--schedule static|dynamic|guided`, `--chunk`), then see `README.md` (steps 5-8).

## Authorship note
The materials were drafted with AI assistance (Claude Code) following the division of work above. Both students must read, run and be able to explain their parts
(`../01_Common/notes/VIVA_PREP.md`) and should follow VIT's rules on disclosing AI assistance.
