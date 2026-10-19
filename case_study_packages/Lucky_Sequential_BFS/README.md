# CS4-S01: Parallel Breadth-First Search (BFS) — BCSE412L Parallel Computing case study

Sequential vs level-synchronous OpenMP BFS on graphs of increasing size and different structure
(path, 2-D grid, uniform random, R-MAT skewed). Team of two:

| | Student 1 | Student 2 |
|---|---|---|
| Role | BFS theory, **sequential baseline**, graph preparation, correctness, baseline timing | **OpenMP parallel BFS**, thread configurations, speedup/efficiency/TEPS, synchronization & scalability |
| Code | `include/graph.hpp`, `include/bfs_seq.hpp`, `src/bfs_seq_main.cpp`, `tests/` | `include/bfs_par.hpp`, `src/bfs_par_main.cpp` |
| Note | `report/Technical_Note_Student1.docx` | `report/Technical_Note_Student2.docx` |

Both: literature review, experimental analysis, the integrated report `report/CS4-S01_Integrated_Report.docx`.

## Folder layout
```
include/   graph.hpp (CSR graph + generators)  bfs_seq.hpp  bfs_par.hpp  bench_common.hpp
src/       bfs_seq_main.cpp  bfs_par_main.cpp  bfs_tests.cpp
tests/cases/   *.graph (inputs) and *.expected (hand-computed distances)
scripts/   run_experiments.py  analyze.py  plot.py  build_docs.py
data/raw/      bfs_raw.csv            RAW per-run measurements (never edited by scripts)
data/derived/  bfs_derived.csv, summary_table.csv   speedup/efficiency/TEPS computed from raw
data/env/      environment.json       hardware + software + OpenMP configuration of the measured machine
figures/   fig1 ... fig7 (PNG; regenerate with scripts/plot.py)
report/    integrated report + two technical notes (.docx)
logs/      correctness_test_output.txt, run_experiments_stdout.txt
REFERENCES.md  verified reference list with verification status
CHECKLIST.md   final quality audit and items needing your action
```

## Prerequisites
* A C++17 compiler with OpenMP: **g++ ≥ 9** (tested with g++ 13.3). 
* Python 3.9+ with `pandas numpy matplotlib python-docx` (`pip install pandas numpy matplotlib python-docx`).
* **Linux / WSL (recommended):** `sudo apt install g++ make python3-pip`.
* **Windows:** install MSYS2 (https://www.msys2.org), open the *UCRT64* shell and run
  `pacman -S mingw-w64-ucrt-x86_64-gcc make`, or simply use WSL. MSVC is **not** supported
  (its OpenMP is 2.0 and the tests use `dirent.h`).
* macOS: Apple clang has no OpenMP by default; `brew install gcc` and use `CXX=g++-14 make`.

## Build
```bash
make                      # builds bin/bfs_seq, bin/bfs_par, bin/bfs_tests with: g++ -O3 -std=c++17 -fopenmp -Wall -Wextra
```
Without make (e.g. plain Windows shell with MinGW g++ on PATH):
```bash
mkdir bin
g++ -O3 -std=c++17 -fopenmp -Iinclude src/bfs_seq_main.cpp -o bin/bfs_seq
g++ -O3 -std=c++17 -fopenmp -Iinclude src/bfs_par_main.cpp -o bin/bfs_par
g++ -O3 -std=c++17 -fopenmp -Iinclude src/bfs_tests.cpp    -o bin/bfs_tests
```

## 1. Correctness tests
```bash
make test            # or: bin/bfs_tests tests/cases
```
Part 1 checks 12 hand-made graphs (path, star, cycle, grid, complete, tree, disconnected, isolated source, single vertex,
duplicate edges/self-loop, two routes of different length) against distances computed by hand.
Part 2 compares parallel and sequential BFS on generated path/grid/random/R-MAT/disconnected graphs for thread counts
1,2,4,7 and static/dynamic/guided schedules (with and without instrumentation), repeated to expose races, and also
runs an independent validator (`validate_bfs`). Expected last line: `... checks passed, 0 failed`.
Our captured output: `logs/correctness_test_output.txt`.

## 2. Run single benchmarks by hand
```bash
bin/bfs_seq --graph random --n 262144 --deg 16 --reps 7
bin/bfs_par --graph random --n 262144 --deg 16 --threads 1,2,4 --schedule dynamic --chunk 64 --reps 7
bin/bfs_par --help
```
Errors give a message and a non-zero exit code (bad option, unknown graph, out-of-range source, ...).

## 3. Reproduce the full experiment
```bash
python3 scripts/run_experiments.py --fresh --student1-id <RegNo1> --student2-id <RegNo2> --batch-id <BatchID> \
        --note "laptop, plugged in, nothing else running"
python3 scripts/analyze.py          # raw -> derived CSVs (speedup, efficiency, MTEPS)
python3 scripts/plot.py             # derived -> figures/*.png
python3 scripts/build_docs.py       # (optional) rebuild the .docx tables from the CSVs
```
`run_experiments.py --quick` is a one-minute smoke test. The runner refuses to overwrite an existing raw CSV unless `--fresh`.
For clean timings close other programs, plug in the laptop, and (Linux) set the CPU governor to `performance` if you can.
The runner pins threads with `OMP_PROC_BIND=true OMP_PLACES=cores` (override by exporting your own values first).
Thread counts default to 1,2,4,… up to the number of logical CPUs of the machine running it.

### Experimental choices (not manual requirements)
* Sizes: 2^14, 2^16, 2^18, 2^20 vertices (4 sizes; manual needs ≥3).
* Structures: path, grid, random (average degree 16), R-MAT (edge factor 8, a/b/c/d = .57/.19/.19/.05, labels randomly permuted);
  plus a density sweep on random n = 2^18 with average degree 2, 4, 8, 16, 32, 64.
* 7 timed repetitions + 1 warm-up per configuration; median is the primary summary, std/CV/min/max are kept.
* Fixed seed 12345. Both programs build the graph with the same code; the CSV column `Graph_Checksum` proves it is identical.
* Start vertex: vertex 0 for path/grid; lowest-index maximum-degree vertex for random/R-MAT.

## Conventions shared by both implementations
* Graph: undirected, simple, CSR adjacency list, 32-bit vertex ids.
* **Timed region** = one call to `bfs_seq()` / `bfs_par()` (includes initialising its own distance/frontier arrays, and for the parallel
  version the thread-team start-up and the final copy of the result). Graph generation, validation and statistics are **not** timed.
* Clock: `std::chrono::steady_clock`; times in **seconds**.
* **Speedup** = median sequential time / median parallel time (same graph). **Efficiency** = speedup / threads.
* **TEPS** = (undirected edges inside the component reached from the source) / time (Graph500 convention); reported as MTEPS.
* `Synchronization_Time` (parallel only) = sum over BFS levels of (slowest thread's expand time − mean expand time) =
  average time a thread idles at the end-of-level barrier. It is measured in an **extra instrumented run** after each timed run,
  never inside the timed run. `Frontier_Merge_Time` = wall time of the prefix-sum/copy/swap phase (same instrumented run).
  `Scheduling_Time` and `Communication_Time` are `NA` (loop-scheduling cost cannot be separated reliably; shared memory has no communication).
* `Memory_Use` = estimated bytes of graph + per-run arrays, in MB (analytic estimate, not measured RSS).
* Raw CSV has the manual's required columns (Speedup/Efficiency empty on purpose) plus extra descriptive columns.

## How the parallel BFS is synchronized
See the header comment of `include/bfs_par.hpp`: atomic compare-and-swap on `dist[v]` claims each vertex exactly once (no lock, no race);
per-thread private next-frontier buffers; barrier; prefix-sum of buffer sizes; each thread copies into a disjoint slice; barrier; swap.

## Limitations of this repository
* No GPU/CUDA implementation (the manual says "CPU parallel and GPU if available"; no GPU was available).
* Only synthetic graphs (SNAP/SuiteSparse graphs need a download; `--graph file` accepts a simple edge-list format, see `include/graph.hpp`).
* No direction-optimizing (bottom-up) BFS: it is listed as future work.
