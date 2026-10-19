# CONTRIBUTION - Student 1: Sequential BFS baseline

**Course:** BCSE412L Parallel Computing, VIT Vellore - **Case study CS4-S01: Parallel Breadth-First Search**
**Team:** 2 students. **This package belongs to Student 1 (Lucky): `[Name, Reg. No.]` (placeholder - fill in).**

## Student 1 responsibility (as planned for the case study)
* Explain the BFS algorithm.
* Sequential BFS implementation in C++.
* Graph preparation and reproducible graph generation.
* Correctness validation.
* Baseline timing methodology and baseline results with explanation.

Student 2 (OpenMP parallel BFS) is covered in the other package; her code is included here only because the shared tests, experiment runner and comparison plots need it.

## Files that are Student 1's own work
| File | Purpose |
|---|---|
| `include/bfs_seq.hpp` | Sequential queue-based BFS; `validate_bfs()` independent correctness check; traversal statistics (levels, edges traversed) |
| `src/bfs_seq_main.cpp` | Baseline benchmark program (builds graph, warm-up, timed repetitions, raw-CSV rows) |
| `include/graph.hpp` | CSR graph, path/grid/random/R-MAT generators, graph-file loader, start-vertex rule, graph checksum |
| `tests/cases/*.graph`, `*.expected` | 12 hand-computed correctness cases (inputs and expected distances) |
| `report/Technical_Note_Student1.docx` | Individual technical note (2 pages) |

## Shared files (both students)
| File | Purpose |
|---|---|
| `include/bench_common.hpp` | Argument parsing, graph construction from options, raw-CSV schema/writer - used by both programs |
| `src/bfs_tests.cpp` | Correctness tests: hand cases + randomized sequential-vs-parallel cross-checks |
| `report/CS4-S01_Integrated_Report.docx` | The single integrated batch report (identical in both packages) |
| `scripts/run_experiments.py`, `analyze.py`, `plot.py`, `build_docs.py` | Experiment runner, raw->derived analysis, plotting, document builder |
| `data/raw/bfs_raw.csv`, `data/derived/*.csv`, `data/env/environment.json` | Raw measurements (sequential + parallel rows), derived metrics, environment record |
| `figures/fig1..fig7*.png`, `logs/*`, `Makefile`, `README.md`, `REFERENCES.md`, `CHECKLIST.md`, `notes/VIVA_PREP.md` | Plots, logs, build file, documentation |

## Student 2's files (included only as shared dependencies / for the comparison)
`include/bfs_par.hpp`, `src/bfs_par_main.cpp` (needed by `bfs_tests.cpp`, the experiment runner and the speedup analysis).

## Where your baseline results are
* Raw sequential rows: `data/raw/bfs_raw.csv`, rows with `Algorithm = SEQ_BFS` (the file also contains the parallel rows; it was not split, to keep raw data unmodified).
* Derived baseline statistics (median, CV, MTEPS per graph/size): `data/derived/bfs_derived.csv` (rows `SEQ_BFS`), table N1 in the technical note.
* Plots that show the baseline vs parallel comparison: `figures/fig1_time_vs_size.png` (time vs size), `fig3_throughput_vs_density.png`, `fig4_speedup_vs_size.png`.

## Reproduce your part
From the package root, after `make`:
```
make test                                            # correctness (expect: 1402 checks passed, 0 failed)
bin/bfs_seq --graph random --n 262144 --deg 16 --reps 7
python3 scripts/run_experiments.py --fresh --student1-id <RegNo> --student2-id <PartnerRegNo> --batch-id <Batch>
python3 scripts/analyze.py && python3 scripts/plot.py
```

## Windows quick start
**Recommended (matches the tested Linux environment): WSL2 + Ubuntu**
1. Open PowerShell as administrator and run `wsl --install` (restart if asked), then open "Ubuntu" from the Start menu.
2. In Ubuntu: `sudo apt update && sudo apt install -y g++ make python3 python3-pip` and `pip3 install --break-system-packages -r requirements.txt` (or use a venv).
3. Your Windows files are visible under `/mnt/c/...`. Example: `cd /mnt/c/Users/<you>/Downloads/Lucky_Sequential_BFS` (after extracting the ZIP, see below).
4. `make` then `make test` (expect `1402 checks passed, 0 failed`) then `python3 scripts/run_experiments.py --quick --out data/raw/quick_test.csv` for a 1-minute smoke test.

**Native Windows (MSYS2/MinGW-w64) - untested by the assistant:** install MSYS2, open the *UCRT64* shell, `pacman -S mingw-w64-ucrt-x86_64-gcc make python python-pip`, then the same commands. If `run_experiments.py` reports that `bin/bfs_seq` is missing, the program was built as `bin/bfs_seq.exe`; run the script with the regular Windows Python instead (`py scripts\run_experiments.py ...` from a terminal where MinGW `g++` is on PATH), which looks for the `.exe` names. Visual Studio / MSVC is not supported.

## Extracting the ZIP on Windows 10 / 11
1. Save `Lucky_Sequential_BFS.zip` somewhere simple, e.g. `C:\Users\<you>\Documents\` (avoid very long folder paths).
2. Right-click the ZIP -> **Extract All...** -> choose a destination -> **Extract**. (Do not run files from inside the ZIP preview.)
3. Open the extracted `Lucky_Sequential_BFS` folder; start with `CONTRIBUTION.md` and `README.md`. Word documents are in `report/`.

## Notes on authorship
The materials in this repository were drafted with AI assistance (Claude Code) following the division of work above. Both students must read, run and be able to explain their parts (see `notes/VIVA_PREP.md`) and should follow VIT's rules on disclosing AI assistance.
