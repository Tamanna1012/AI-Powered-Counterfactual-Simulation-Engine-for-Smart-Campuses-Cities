#!/usr/bin/env python3
"""Derive speedup / efficiency / TEPS from the RAW measurements.

Input : data/raw/bfs_raw.csv        (never modified)
Output: data/derived/bfs_derived.csv    one row per (dataset, size, algorithm, threads); manual's required
                                          columns populated + summary statistics
        data/derived/summary_table.csv  compact comparison table used in the report

Definitions (all computed here, never typed by hand):
  Execution_Time   = MEDIAN over the repeated runs (seconds). Mean/std/min/max also stored.
  Baseline         = sequential BFS (SEQ_BFS) median on the SAME graph (same Dataset & size, same checksum).
  Speedup          = baseline_median / parallel_median
  Efficiency       = Speedup / Threads
  TEPS             = Edges_Traversed / Execution_Time,  Edges_Traversed = undirected edges inside the component
                     reached from the source (Graph500 convention); reported as MTEPS (millions per second).
  Sync_Wait_Frac   = median Synchronization_Time / median Execution_Time  (approximate: Synchronization_Time is
                     measured in a separate instrumented run, see README)
"""
import argparse
import sys
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", default=str(ROOT / "data/raw/bfs_raw.csv"))
    ap.add_argument("--out-dir", default=str(ROOT / "data/derived"))
    a = ap.parse_args()

    raw = pd.read_csv(a.raw)
    problems = []
    if not (raw["Verified"] == 1).all():
        problems.append(f"{(raw['Verified'] != 1).sum()} rows have Verified != 1 (incorrect BFS result!)")
    # same graph used by sequential and parallel? (same dataset+size must have exactly one checksum)
    chk = raw.groupby(["Dataset", "Problem_Size"])["Graph_Checksum"].nunique()
    if (chk != 1).any():
        problems.append("sequential and parallel runs used different graphs for: " + str(chk[chk != 1].index.tolist()))
    if problems:
        sys.exit("DATA CHECK FAILED:\n  " + "\n  ".join(problems))

    key = ["Dataset", "Problem_Size", "Algorithm", "Threads"]
    g = raw.groupby(key)
    stat = g["Execution_Time"].agg(Runs="count", Mean="mean", Median="median", Std="std", Min="min", Max="max").reset_index()
    stat["CV_percent"] = 100 * stat["Std"] / stat["Mean"]
    first = g.first().reset_index()[key + ["Student_ID", "Batch_ID", "Workload", "Parallel_Model", "Hardware", "Resource_Count",
                                          "Memory_Use", "Graph_Family", "Vertices", "Edges_Undirected", "Avg_Degree",
                                          "Max_Degree", "Edges_Traversed", "Levels", "Reached_Vertices", "Schedule", "Chunk"]]
    sync = g["Synchronization_Time"].median().reset_index().rename(columns={"Synchronization_Time": "Sync_Wait_Median"})
    merge = g["Frontier_Merge_Time"].median().reset_index().rename(columns={"Frontier_Merge_Time": "Merge_Median"})
    d = stat.merge(first, on=key).merge(sync, on=key).merge(merge, on=key)

    base = d[d["Algorithm"] == "SEQ_BFS"][["Dataset", "Problem_Size", "Median", "Min", "Max"]].rename(
        columns={"Median": "Baseline_Median", "Min": "Baseline_Min", "Max": "Baseline_Max"})
    d = d.merge(base, on=["Dataset", "Problem_Size"], how="left")
    if d["Baseline_Median"].isna().any():
        sys.exit("DATA CHECK FAILED: some parallel rows have no sequential baseline.")

    d["Speedup"] = d["Baseline_Median"] / d["Median"]
    d["Speedup_Low"] = d["Baseline_Min"] / d["Max"]    # pessimistic: fastest baseline run vs slowest parallel run
    d["Speedup_High"] = d["Baseline_Max"] / d["Min"]
    d["Efficiency"] = d["Speedup"] / d["Threads"]
    d["MTEPS"] = d["Edges_Traversed"] / d["Median"] / 1e6
    d["Sync_Wait_Frac"] = d["Sync_Wait_Median"] / d["Median"]
    d["Merge_Frac"] = d["Merge_Median"] / d["Median"]
    # for the sequential baseline itself speedup is 1 by definition
    seq = d["Algorithm"] == "SEQ_BFS"
    d.loc[seq, ["Speedup", "Speedup_Low", "Speedup_High", "Efficiency"]] = 1.0

    d["Execution_Time"] = d["Median"]
    d["Communication_Time"] = "NA"   # shared memory: no inter-process communication
    d["Scheduling_Time"] = "NA"      # loop-scheduling cost is not separable from useful work (see README)
    d["Energy_if_available"] = "NA"
    d["Run_ID"] = "median_of_" + d["Runs"].astype(str)
    d["Synchronization_Time"] = d["Sync_Wait_Median"]
    d = d.sort_values(["Graph_Family", "Dataset", "Problem_Size", "Algorithm", "Threads"], ascending=[True, True, True, False, True])

    cols = ["Student_ID", "Batch_ID", "Workload", "Dataset", "Problem_Size", "Algorithm", "Parallel_Model", "Hardware",
            "Resource_Count", "Threads", "Execution_Time", "Speedup", "Efficiency", "Communication_Time",
            "Synchronization_Time", "Scheduling_Time", "Memory_Use", "Energy_if_available", "Run_ID",
            "Runs", "Mean", "Median", "Std", "Min", "Max", "CV_percent", "Speedup_Low", "Speedup_High", "MTEPS",
            "Sync_Wait_Frac", "Merge_Median", "Merge_Frac", "Baseline_Median", "Graph_Family", "Vertices",
            "Edges_Undirected", "Avg_Degree", "Max_Degree", "Edges_Traversed", "Levels", "Reached_Vertices", "Schedule", "Chunk"]
    out = Path(a.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    d[cols].to_csv(out / "bfs_derived.csv", index=False, float_format="%.6g")

    s = d.copy()
    s["Seq_ms"] = s["Baseline_Median"] * 1e3
    s["Time_ms"] = s["Median"] * 1e3
    s["Config"] = np.where(seq, "sequential", "OpenMP " + s["Threads"].astype(str) + "T")
    tbl = s[["Dataset", "Vertices", "Edges_Undirected", "Levels", "Config", "Time_ms", "CV_percent", "Speedup", "Efficiency", "MTEPS"]]
    tbl.to_csv(out / "summary_table.csv", index=False, float_format="%.4g")
    print(f"wrote {out/'bfs_derived.csv'} ({len(d)} rows) and {out/'summary_table.csv'}")
    print(f"raw rows: {len(raw)}; all Verified==1; graph checksums consistent between SEQ and PAR.")
    noisy = d[d["CV_percent"] > 15]
    if len(noisy):
        print("NOTE: configurations with CV > 15% (noisy, interpret with care):")
        print(noisy[["Dataset", "Problem_Size", "Algorithm", "Threads", "CV_percent"]].to_string(index=False))


if __name__ == "__main__":
    main()
