#!/usr/bin/env python3
"""Editable plotting script. Reads data/derived/bfs_derived.csv, writes PNG figures to plots/.

Every number plotted comes from the derived CSV (which comes from the raw CSV).
Edit STYLE / the functions below to change colours, sizes or labels.
"""
import argparse
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
# colour-blind-safe palette (Okabe-Ito)
COLORS = {"path": "#D55E00", "grid": "#0072B2", "random_d16": "#009E73", "rmat_ef8": "#CC79A7"}
LABELS = {"path": "Path", "grid": "Grid (2-D)", "random_d16": "Random (avg deg 16)", "rmat_ef8": "R-MAT (skewed)"}
plt.rcParams.update({"font.size": 10, "axes.grid": True, "grid.alpha": 0.3, "axes.spines.top": False,
                     "axes.spines.right": False, "figure.dpi": 130, "savefig.bbox": "tight"})


def save(fig, name, out):
    fig.savefig(out / name, dpi=200)
    plt.close(fig)
    print("wrote", out / name)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--derived", default=str(ROOT / "data/derived/bfs_derived.csv"))
    ap.add_argument("--raw", default=str(ROOT / "data/raw/bfs_raw.csv"))
    ap.add_argument("--out-dir", default=str(ROOT / "plots"))
    a = ap.parse_args()
    d = pd.read_csv(a.derived)
    out = Path(a.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    seq = d[d.Algorithm == "SEQ_BFS"]
    par = d[d.Algorithm != "SEQ_BFS"]
    tmax = int(par.Threads.max())
    fams = [k for k in COLORS if k in set(d.Dataset)]
    nmax = int(d.Problem_Size.max())

    # ---- Fig 1: execution time vs graph size (sequential vs parallel at max threads)
    fig, ax = plt.subplots(figsize=(6.2, 4.2))
    for f in fams:
        s = seq[seq.Dataset == f].sort_values("Problem_Size")
        p = par[(par.Dataset == f) & (par.Threads == tmax)].sort_values("Problem_Size")
        ax.plot(s.Problem_Size, s.Median * 1e3, "-o", color=COLORS[f], label=f"{LABELS[f]} - sequential")
        ax.plot(p.Problem_Size, p.Median * 1e3, "--s", color=COLORS[f], mfc="white", label=f"{LABELS[f]} - OpenMP {tmax}T")
    ax.set_xscale("log", base=2); ax.set_yscale("log")
    ax.set_xlabel("Number of vertices"); ax.set_ylabel("Median BFS time (ms, log scale)")
    ax.set_title("Execution time vs graph size")
    ax.legend(fontsize=7, ncol=2)
    save(fig, "fig1_time_vs_size.png", out)

    # ---- Fig 2: speedup vs threads at the largest size
    fig, ax = plt.subplots(figsize=(6.2, 4.2))
    tvals = sorted(par.Threads.unique())
    for f in fams:
        p = par[(par.Dataset == f) & (par.Problem_Size == nmax)].sort_values("Threads")
        ax.errorbar(p.Threads, p.Speedup, yerr=[p.Speedup - p.Speedup_Low, p.Speedup_High - p.Speedup], fmt="-o",
                    color=COLORS[f], capsize=3, label=LABELS[f])
    ax.plot(tvals, tvals, ":", color="gray", label="Ideal (linear)")
    ax.axhline(1, color="black", lw=0.8)
    ax.set_xscale("log", base=2); ax.set_xticks(tvals); ax.set_xticklabels(tvals)
    ax.set_yscale("log")
    ax.set_xlabel("OpenMP threads"); ax.set_ylabel("Speedup over sequential BFS (log scale)")
    ax.set_title(f"Speedup vs threads (n = {nmax:,} vertices)")
    ax.legend(fontsize=8)
    save(fig, "fig2_speedup_vs_threads.png", out)

    # ---- Fig 3: throughput (MTEPS) vs density (random graphs, fixed n)
    r = d[d.Dataset.str.startswith("random_d")]
    nd = r.groupby("Problem_Size").Dataset.nunique()
    if len(nd) and nd.max() > 1:
        n_d = int(nd.idxmax())
        r = r[r.Problem_Size == n_d]
        fig, ax = plt.subplots(figsize=(6.2, 4.2))
        for (alg, th), grp in r.groupby(["Algorithm", "Threads"]):
            grp = grp.sort_values("Avg_Degree")
            lab = "Sequential" if alg == "SEQ_BFS" else f"OpenMP {th}T"
            ax.plot(grp.Avg_Degree, grp.MTEPS, "-o" if alg == "SEQ_BFS" else "-s", label=lab,
                    color="black" if alg == "SEQ_BFS" else None)
        ax.set_xscale("log", base=2)
        ax.set_xlabel("Average degree (graph density)"); ax.set_ylabel("Throughput (MTEPS)")
        ax.set_title(f"Traversal throughput vs density (random, n = {n_d:,})")
        ax.legend(fontsize=8)
        save(fig, "fig3_throughput_vs_density.png", out)

    # ---- Fig 4: speedup vs graph size at max threads (scalability across sizes)
    fig, ax = plt.subplots(figsize=(6.2, 4.2))
    for f in fams:
        p = par[(par.Dataset == f) & (par.Threads == tmax)].sort_values("Problem_Size")
        ax.plot(p.Problem_Size, p.Speedup, "-o", color=COLORS[f], label=LABELS[f])
    ax.axhline(1, color="black", lw=0.8); ax.axhline(tmax, color="gray", ls=":", label=f"Ideal ({tmax}x)")
    ax.set_xscale("log", base=2); ax.set_yscale("log")
    ax.set_xlabel("Number of vertices"); ax.set_ylabel(f"Speedup with {tmax} threads (log scale)")
    ax.set_title("Does speedup improve as the graph grows?")
    ax.legend(fontsize=8)
    save(fig, "fig4_speedup_vs_size.png", out)

    # ---- Fig 5: efficiency vs threads at the largest size
    fig, ax = plt.subplots(figsize=(6.2, 4.2))
    for f in fams:
        p = par[(par.Dataset == f) & (par.Problem_Size == nmax)].sort_values("Threads")
        ax.plot(p.Threads, p.Efficiency, "-o", color=COLORS[f], label=LABELS[f])
    ax.axhline(1, color="gray", ls=":")
    ax.set_xscale("log", base=2); ax.set_xticks(tvals); ax.set_xticklabels(tvals)
    ax.set_xlabel("OpenMP threads"); ax.set_ylabel("Parallel efficiency = speedup / threads")
    ax.set_title(f"Efficiency vs threads (n = {nmax:,})")
    ax.legend(fontsize=8)
    save(fig, "fig5_efficiency_vs_threads.png", out)

    # ---- Fig 6: where does the parallel time go? (largest size, max threads)
    p = par[(par.Threads == tmax) & (par.Problem_Size == nmax) & (par.Dataset.isin(fams))].set_index("Dataset").loc[fams]
    fig, ax = plt.subplots(figsize=(6.2, 4.2))
    x = np.arange(len(fams))
    w = 0.38
    ax.bar(x - w / 2, 100 * p.Sync_Wait_Frac, w, label="Barrier wait", color="#E69F00")
    ax.bar(x + w / 2, 100 * p.Merge_Frac, w, label="Frontier merge phase", color="#56B4E9")
    ax.set_xticks(x); ax.set_xticklabels([LABELS[f] for f in fams], rotation=12, fontsize=8)
    ax.set_ylabel("Share of parallel execution time (%)")
    ax.set_title(f"Synchronization overhead ({tmax} threads, n = {nmax:,})")
    ax.legend(fontsize=8, loc="upper right")
    save(fig, "fig6_overhead_breakdown.png", out)

    # ---- Fig 7: levels (BFS depth) vs speedup: the structural explanation
    fig, ax = plt.subplots(figsize=(6.2, 4.2))
    for f in fams:
        p = par[(par.Dataset == f) & (par.Threads == tmax)].sort_values("Problem_Size")
        ax.scatter(p.Edges_Traversed / p.Levels, p.Speedup, s=40, color=COLORS[f], label=LABELS[f])
    ax.set_xscale("log"); ax.set_yscale("log")
    ax.axhline(1, color="black", lw=0.8)
    ax.set_xlabel("Undirected edges in reached component per BFS level")
    ax.set_ylabel(f"Speedup with {tmax} threads")
    ax.set_title("Speedup versus work per level")
    ax.legend(fontsize=8)
    save(fig, "fig7_work_per_level_vs_speedup.png", out)

    extra_figures(d, Path(a.raw), out, fams, tmax)


def extra_figures(d, raw_path, out, fams, tmax):
    """figures used by the two technical notes: fig8/fig9 (Student 1 baseline), fig10 (Student 2 per-level cost)"""
    seq = d[d.Algorithm == "SEQ_BFS"]
    par = d[d.Algorithm != "SEQ_BFS"]
    # ---- Fig 8: sequential baseline - time and throughput vs size
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9.2, 3.8))
    for f in fams:
        s_ = seq[seq.Dataset == f].sort_values("Problem_Size")
        ax1.plot(s_.Problem_Size, s_.Median * 1e3, "-o", color=COLORS[f], label=LABELS[f])
        ax2.plot(s_.Problem_Size, s_.MTEPS, "-o", color=COLORS[f], label=LABELS[f])
    for ax in (ax1, ax2):
        ax.set_xscale("log", base=2)
        ax.set_xlabel("Number of vertices")
    ax1.set_yscale("log")
    ax1.set_ylabel("Median sequential BFS time (ms, log scale)")
    ax1.set_title("Sequential time vs graph size")
    ax2.set_ylabel("Sequential throughput (MTEPS)")
    ax2.set_title("Sequential throughput vs graph size")
    ax2.legend(fontsize=8)
    fig.tight_layout()
    save(fig, "fig8_baseline_scaling.png", out)

    # ---- Fig 9: run-to-run variation of the 7 sequential runs per configuration (raw data)
    raw = pd.read_csv(raw_path)
    rs = raw[raw.Algorithm == "SEQ_BFS"].copy()
    rs["rel"] = rs.Execution_Time / rs.groupby(["Dataset", "Problem_Size"]).Execution_Time.transform("median")
    fig, ax = plt.subplots(figsize=(9.2, 3.8))
    pos, ticks, labels = 0, [], []
    for f in fams:
        for n in sorted(rs.Problem_Size.unique()):
            g = rs[(rs.Dataset == f) & (rs.Problem_Size == n)]
            ax.scatter([pos] * len(g), g.rel, s=18, color=COLORS[f], alpha=0.85, label=LABELS[f] if n == rs.Problem_Size.min() else None)
            ticks.append(pos)
            labels.append(f"2^{int(round(__import__('math').log2(n)))}")
            pos += 1
        pos += 0.8
    ax.axhline(1, color="black", lw=0.8)
    ax.set_xticks(ticks)
    ax.set_xticklabels(labels, fontsize=7, rotation=45)
    ax.set_ylabel("Run time / median of the 7 runs")
    ax.set_xlabel("Graph structure and size (vertices) - each dot is one run")
    ax.set_title("Run-to-run variation of the sequential baseline")
    ax.legend(fontsize=8, ncol=4)
    save(fig, "fig9_baseline_run_variation.png", out)

    # ---- Fig 10: cost per BFS level (microseconds) at the largest size
    nmax = int(d.Problem_Size.max())
    fig, ax = plt.subplots(figsize=(6.2, 4.2))
    for f in fams:
        p_ = par[(par.Dataset == f) & (par.Problem_Size == nmax)].sort_values("Threads")
        ax.plot(p_.Threads, p_.Median / p_.Levels * 1e6, "-o", color=COLORS[f], label=f"{LABELS[f]} - OpenMP")
        s_ = seq[(seq.Dataset == f) & (seq.Problem_Size == nmax)].iloc[0]
        ax.axhline(s_.Median / s_.Levels * 1e6, color=COLORS[f], ls=":", lw=1)
    ax.set_xscale("log", base=2)
    ax.set_xticks(sorted(par.Threads.unique()))
    ax.set_xticklabels(sorted(par.Threads.unique()))
    ax.set_yscale("log")
    ax.set_xlabel("OpenMP threads")
    ax.set_ylabel("Median time per BFS level (microseconds, log scale)")
    ax.set_title(f"Cost per level (n = {nmax:,}); dotted = sequential")
    ax.legend(fontsize=7)
    save(fig, "fig10_per_level_cost.png", out)


if __name__ == "__main__":
    main()
