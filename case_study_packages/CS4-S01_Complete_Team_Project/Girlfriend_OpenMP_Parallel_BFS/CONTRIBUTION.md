# CONTRIBUTION - Student 2: OpenMP parallel BFS

**Course:** BCSE412L Parallel Computing, VIT Vellore - **Case study CS4-S01: Parallel Breadth-First Search**
**Team:** 2 students. **This package belongs to Student 2 (girlfriend): `[Name, Reg. No.]` (placeholder - fill in).**

## Student 2 responsibility (as planned for the case study)
* Parallel BFS in C++ with OpenMP (level-synchronous, parallel frontier processing).
* Thread-configuration and scaling experiments (1, 2, 4 threads).
* Synchronization and parallel-overhead analysis (barrier wait, frontier-merge time).
* Speedup, efficiency and traversal throughput (MTEPS).

Student 1 (sequential BFS baseline) is covered in the other package; his code is included here because every speedup is measured against it.

## Files that are Student 2's own work
| File | Purpose |
|---|---|
| `include/bfs_par.hpp` | Level-synchronous OpenMP BFS: atomic compare-and-swap on `dist[v]`, per-thread frontier buffers, prefix-sum merge, barriers, optional instrumentation |
| `src/bfs_par_main.cpp` | Parallel benchmark program (thread list, schedule/chunk options, per-run verification against sequential result, instrumented overhead run, raw-CSV rows) |
| `report/Technical_Note_Student2.docx` | Individual technical note (3 pages) |

## Reference baseline from Student 1 (needed for direct comparison)
`include/bfs_seq.hpp`, `src/bfs_seq_main.cpp`, `include/graph.hpp` (graph + generators + checksum), `tests/cases/*` (hand-computed cases).

## Shared files (both students)
| File | Purpose |
|---|---|
| `include/bench_common.hpp` | Argument parsing, graph construction from options, raw-CSV schema/writer |
| `src/bfs_tests.cpp` | Correctness tests incl. parallel BFS for threads 1,2,3,4,7,8 and static/dynamic/guided schedules |
| `report/CS4-S01_Integrated_Report.docx` | The single integrated batch report (identical in both packages) |
| `scripts/run_experiments.py`, `analyze.py`, `plot.py`, `build_docs.py` | Experiment runner, raw->derived analysis (speedup, efficiency, TEPS), plotting, document builder |
| `data/raw/bfs_raw.csv`, `data/derived/*.csv`, `data/env/environment.json` | Raw measurements, derived metrics, environment record |
| `figures/fig1..fig7*.png`, `logs/*`, `Makefile`, `README.md`, `REFERENCES.md`, `CHECKLIST.md`, `notes/VIVA_PREP.md` | Plots, logs, build file, documentation |

## Where your parallel results are
* Raw parallel rows: `data/raw/bfs_raw.csv`, rows with `Algorithm = PAR_BFS_LEVELSYNC` (columns `Threads`, `Execution_Time`, `Synchronization_Time`, `Frontier_Merge_Time`, `Verified`).
* Derived speedup / efficiency / MTEPS / overhead shares: `data/derived/bfs_derived.csv`; summary tables 4-6 in the report; tables N2-N3 in the technical note.
* Plots: `figures/fig2_speedup_vs_threads.png`, `fig5_efficiency_vs_threads.png`, `fig6_overhead_breakdown.png`, `fig7_work_per_level_vs_speedup.png`, plus fig1, fig3, fig4.

## Reproduce your part
From the package root, after `make`:
```
make test                                                      # correctness (expect: 1402 checks passed, 0 failed)
bin/bfs_par --graph random --n 262144 --deg 16 --threads 1,2,4 --schedule dynamic --chunk 64 --reps 7
python3 scripts/run_experiments.py --fresh --student1-id <PartnerRegNo> --student2-id <YourRegNo> --batch-id <Batch>
python3 scripts/analyze.py && python3 scripts/plot.py
```
(`bin/bfs_par --help` lists all options, including `--schedule static|dynamic|guided` and `--chunk`.)

## Windows quick start
**Recommended (matches the tested Linux environment): WSL2 + Ubuntu**
1. Open PowerShell as administrator and run `wsl --install` (restart if asked), then open "Ubuntu" from the Start menu.
2. In Ubuntu: `sudo apt update && sudo apt install -y g++ make python3 python3-pip` and `pip3 install --break-system-packages -r requirements.txt` (or use a venv).
3. Your Windows files are visible under `/mnt/c/...`. Example: `cd /mnt/c/Users/<you>/Downloads/Girlfriend_OpenMP_Parallel_BFS` (after extracting the ZIP, see below).
4. `make` then `make test` (expect `1402 checks passed, 0 failed`) then `python3 scripts/run_experiments.py --quick --out data/raw/quick_test.csv` for a 1-minute smoke test.

**Native Windows (MSYS2/MinGW-w64) - untested by the assistant:** install MSYS2, open the *UCRT64* shell, `pacman -S mingw-w64-ucrt-x86_64-gcc make python python-pip`, then the same commands. If `run_experiments.py` reports that `bin/bfs_seq` is missing, the program was built as `bin/bfs_seq.exe`; run the script with the regular Windows Python instead (`py scripts\run_experiments.py ...` from a terminal where MinGW `g++` is on PATH), which looks for the `.exe` names. Visual Studio / MSVC is not supported.

## Extracting the ZIP on Windows 10 / 11
1. Save `Girlfriend_OpenMP_Parallel_BFS.zip` somewhere simple, e.g. `C:\Users\<you>\Documents\` (avoid very long folder paths).
2. Right-click the ZIP -> **Extract All...** -> choose a destination -> **Extract**. (Do not run files from inside the ZIP preview.)
3. Open the extracted `Girlfriend_OpenMP_Parallel_BFS` folder; start with `CONTRIBUTION.md` and `README.md`. Word documents are in `report/`.

## Notes on authorship
The materials in this repository were drafted with AI assistance (Claude Code) following the division of work above. Both students must read, run and be able to explain their parts (see `notes/VIVA_PREP.md`) and should follow VIT's rules on disclosing AI assistance.
