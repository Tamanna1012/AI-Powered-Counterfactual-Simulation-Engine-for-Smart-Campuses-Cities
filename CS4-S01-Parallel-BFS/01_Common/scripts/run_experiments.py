#!/usr/bin/env python3
"""Experiment runner (works on Linux, macOS, Windows+MinGW/MSYS2).

Runs the sequential baseline and the OpenMP parallel BFS on the same graphs and
appends raw per-run rows to data/raw/bfs_raw.csv. It also records the hardware /
software environment to data/env/environment.json and environment.md.

The sizes, graph families, thread counts and repetitions below are EXPERIMENTAL
CHOICES (not requirements of the course manual). Edit the CONFIG section to change them.

Examples
  python3 scripts/run_experiments.py --quick          # ~1 minute smoke test, writes data/raw/bfs_raw_quick.csv
  python3 scripts/run_experiments.py                  # full experiment (about 10-20 minutes on 4 cores)
  python3 scripts/run_experiments.py --student1-id 21BCE0001 --student2-id 21BCE0002 --batch-id B7
"""
import argparse
import datetime
import json
import os
import platform
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXE = ".exe" if os.name == "nt" else ""

# ----------------------------- CONFIG (experimental choices) -----------------------------
SIZES = [2 ** 14, 2 ** 16, 2 ** 18, 2 ** 20]           # vertices (all perfect squares -> grid is exact)
FAMILIES = [("path", {}), ("grid", {}), ("random", {"deg": 16}), ("rmat", {"edge-factor": 8})]
DENSITY_N = 2 ** 18                                    # density sweep: random graph, varying average degree
DENSITY_DEGREES = [2, 4, 8, 32, 64]                    # (16 is already covered by the structure sweep)
REPS = 7                                               # timed repetitions per configuration
WARMUP = 1
SCHEDULE, CHUNK = "dynamic", 64
SEED = 12345
# -----------------------------------------------------------------------------------------


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def cpu_model():
    try:
        if sys.platform.startswith("linux"):
            for line in open("/proc/cpuinfo"):
                if line.lower().startswith("model name"):
                    return line.split(":", 1)[1].strip()
        if sys.platform == "win32":
            out = run(["powershell", "-NoProfile", "-Command", "(Get-CimInstance Win32_Processor).Name"]).stdout.strip()
            if out:
                return out.splitlines()[0]
        if sys.platform == "darwin":
            return run(["sysctl", "-n", "machdep.cpu.brand_string"]).stdout.strip()
    except Exception:
        pass
    return platform.processor() or "unknown"


def ram_gb():
    try:
        if sys.platform.startswith("linux"):
            for line in open("/proc/meminfo"):
                if line.startswith("MemTotal"):
                    return round(int(line.split()[1]) / 1048576, 1)
        if sys.platform == "win32":
            out = run(["powershell", "-NoProfile", "-Command",
                       "(Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory"]).stdout.strip()
            return round(int(out) / 2 ** 30, 1)
        if sys.platform == "darwin":
            return round(int(run(["sysctl", "-n", "hw.memsize"]).stdout) / 2 ** 30, 1)
    except Exception:
        pass
    return None


def physical_cores():
    try:
        if sys.platform.startswith("linux"):
            out = run(["lscpu", "-p=Core,Socket"]).stdout
            return len({l for l in out.splitlines() if not l.startswith("#")})
    except Exception:
        pass
    return None


def environment(bin_dir: Path, note: str):
    flags_file = bin_dir / "build_flags.txt"
    build = flags_file.read_text().strip().splitlines() if flags_file.exists() else []
    cxx = shutil.which(os.environ.get("CXX", "g++"))
    cxx_ver = run([cxx, "--version"]).stdout.splitlines()[0] if cxx else "unknown"
    env = {
        "date_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        "cpu_model": cpu_model(),
        "logical_cpus": os.cpu_count(),
        "physical_cores": physical_cores(),
        "ram_gb": ram_gb(),
        "os": platform.platform(),
        "compiler": cxx_ver,
        "compile_command_and_flags": build[0] if build else "see Makefile (g++ -O3 -std=c++17 -fopenmp)",
        "python": platform.python_version(),
        "OMP_PROC_BIND": os.environ.get("OMP_PROC_BIND"),
        "OMP_PLACES": os.environ.get("OMP_PLACES"),
        "OMP_WAIT_POLICY": os.environ.get("OMP_WAIT_POLICY"),
        "OMP_SCHEDULE_used": f"{SCHEDULE},{CHUNK} (set inside the program with omp_set_schedule)",
        "gpu": "none used (no CUDA device/toolchain in this environment)",
        "note": note,
        "config": {"sizes": SIZES, "families": FAMILIES, "density_n": DENSITY_N, "density_degrees": DENSITY_DEGREES,
                   "reps": REPS, "warmup": WARMUP, "seed": SEED},
    }
    return env


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--bin-dir", default=str(ROOT / "bin"))
    ap.add_argument("--out", default=None, help="raw CSV path (default data/raw/bfs_raw.csv)")
    ap.add_argument("--threads", default=None, help="comma list; default: 1,2,4,... up to logical CPUs")
    ap.add_argument("--reps", type=int, default=REPS)
    ap.add_argument("--quick", action="store_true", help="tiny smoke-test configuration")
    ap.add_argument("--student1-id", default="STUDENT1")
    ap.add_argument("--student2-id", default="STUDENT2")
    ap.add_argument("--batch-id", default="BATCH_TBD")
    ap.add_argument("--note", default="", help="free text stored in environment.json (e.g. 'laptop on mains power, plugged in')")
    ap.add_argument("--fresh", action="store_true", help="delete an existing output CSV first")
    a = ap.parse_args()

    bin_dir = Path(a.bin_dir)
    seq, par = bin_dir / ("bfs_seq" + EXE), bin_dir / ("bfs_par" + EXE)
    for p in (seq, par):
        if not p.exists():
            sys.exit(f"ERROR: {p} not found. Build first (see README.md: 'make' or the g++ commands).")

    # pin threads to cores to reduce noise (can be overridden by the caller's environment)
    os.environ.setdefault("OMP_PROC_BIND", "true")
    os.environ.setdefault("OMP_PLACES", "cores")

    ncpu = os.cpu_count() or 1
    if a.threads:
        threads = [int(x) for x in a.threads.split(",")]
    else:
        threads, t = [], 1
        while t <= ncpu:
            threads.append(t)
            t *= 2
        if ncpu not in threads:
            threads.append(ncpu)
    if max(threads) > ncpu:
        print(f"WARNING: thread counts above the {ncpu} logical CPUs are over-subscribed; results will be labelled accordingly in the report.")

    sizes, density_degrees, reps = SIZES, DENSITY_DEGREES, a.reps
    out = Path(a.out) if a.out else ROOT / "data" / "raw" / ("bfs_raw_quick.csv" if a.quick else "bfs_raw.csv")
    if a.quick:
        sizes, density_degrees, reps = [2 ** 12, 2 ** 14], [], min(a.reps, 3)
    out.parent.mkdir(parents=True, exist_ok=True)
    if a.fresh and out.exists():
        out.unlink()
    elif out.exists() and out.stat().st_size > 0:
        sys.exit(f"ERROR: {out} already exists. Use --fresh to overwrite it or --out to write elsewhere "
                 "(raw measurements are never silently overwritten).")

    env = environment(bin_dir, a.note)
    hw = f"{env['cpu_model']}; {env['logical_cpus']} logical CPUs; {env['ram_gb']} GB RAM; {env['os']}"
    envdir = ROOT / "data" / "env"
    envdir.mkdir(parents=True, exist_ok=True)
    (envdir / ("environment_quick.json" if a.quick else "environment.json")).write_text(json.dumps(env, indent=2))
    print("Environment:", json.dumps({k: env[k] for k in ("cpu_model", "logical_cpus", "ram_gb", "os", "compiler")}, indent=1))

    jobs = []  # (family, n, extra)
    for n in sizes:
        for fam, extra in FAMILIES:
            jobs.append((fam, n, extra))
    for d in density_degrees:
        jobs.append(("random", DENSITY_N, {"deg": d}))

    common = ["--seed", str(SEED), "--reps", str(reps), "--warmup", str(WARMUP), "--out", str(out), "--batch-id", a.batch_id,
              "--hardware", hw]
    for i, (fam, n, extra) in enumerate(jobs, 1):
        gargs = ["--graph", fam, "--n", str(n)]
        for k, v in extra.items():
            gargs += [f"--{k}", str(v)]
        label = f"[{i}/{len(jobs)}] {fam} n={n} {extra}"
        print(label, flush=True)
        r = run([str(seq)] + gargs + common + ["--student-id", a.student1_id])
        if r.returncode != 0:
            sys.exit(f"sequential run failed:\n{r.stdout}\n{r.stderr}")
        r = run([str(par)] + gargs + common + ["--student-id", a.student2_id, "--threads", ",".join(map(str, threads)),
                                               "--schedule", SCHEDULE, "--chunk", str(CHUNK)])
        if r.returncode != 0:
            sys.exit(f"parallel run failed (code {r.returncode}):\n{r.stdout}\n{r.stderr}")
        if r.stderr.strip():
            print("  stderr:", r.stderr.strip())
    print("Done. Raw CSV:", out)


if __name__ == "__main__":
    main()
