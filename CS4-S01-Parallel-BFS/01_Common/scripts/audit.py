#!/usr/bin/env python3
"""Independent audit of the experimental results (does NOT reuse analyze.py code).

Uses only the Python standard library + python-docx. It
  1. checks the raw CSV (schema, run counts, verification flags, graph checksums, sanity of values),
  2. recomputes medians, speedup, efficiency and MTEPS from the RAW rows and compares with data/derived/bfs_derived.csv,
  3. lists noisy configurations / outliers (they are kept, never removed),
  4. (with --docs) compares the numbers printed in the Word tables with the CSV.
Exit code 1 if any check fails. Output is also written to logs/audit_report.txt.

  python3 scripts/audit.py            # data checks only
  python3 scripts/audit.py --docs     # data checks + Word table checks
"""
import argparse
import csv
import statistics as st
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED = ["Student_ID", "Batch_ID", "Workload", "Dataset", "Problem_Size", "Algorithm", "Parallel_Model", "Hardware", "Resource_Count",
            "Threads", "Execution_Time", "Speedup", "Efficiency", "Communication_Time", "Synchronization_Time", "Scheduling_Time",
            "Memory_Use", "Energy_if_available", "Run_ID"]          # the manual's required CSV columns
OUT = []
FAILS = []


def say(msg=""):
    print(msg)
    OUT.append(msg)


def check(ok, msg):
    say(("  [PASS] " if ok else "  [FAIL] ") + msg)
    if not ok:
        FAILS.append(msg)


def rel_close(a, b, tol=1e-5):
    return abs(a - b) <= tol * max(abs(a), abs(b), 1e-300)


def read_csv(p):
    with open(p, newline="") as f:
        return list(csv.DictReader(f))


def num_prec(s):
    """parse printed number; return (value, half-unit of last printed digit)"""
    s = s.replace(",", "").strip().split()[0]
    v = float(s)
    dec = len(s.split(".")[1]) if "." in s else 0
    return v, 0.5 * 10 ** (-dec) * 1.0001


def printed_ok(printed, true):
    v, hu = num_prec(printed)
    return abs(v - true) <= hu + 1e-12


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--docs", action="store_true")
    ap.add_argument("--raw", default=str(ROOT / "data/raw/bfs_raw.csv"))
    ap.add_argument("--derived", default=str(ROOT / "data/derived/bfs_derived.csv"))
    a = ap.parse_args()

    raw = read_csv(a.raw)
    der = read_csv(a.derived)
    say(f"AUDIT of {a.raw}  ({len(raw)} raw rows) and {a.derived} ({len(der)} derived rows)")

    say("\n1. Raw data checks")
    check(all(c in raw[0] for c in REQUIRED), "all columns required by the manual are present in the raw CSV")
    check(all(r["Speedup"] == "" and r["Efficiency"] == "" for r in raw), "raw CSV leaves Speedup/Efficiency empty (derived metrics are not typed into raw data)")
    check(all(r["Verified"] == "1" for r in raw), "every run has Verified = 1 (BFS result checked against the sequential distances)")
    groups = defaultdict(list)
    for r in raw:
        groups[(r["Dataset"], int(r["Problem_Size"]), r["Algorithm"], int(r["Threads"]))].append(r)
    check(all(len(v) == 7 for v in groups.values()), f"every one of the {len(groups)} configurations has exactly 7 repetitions (Run_ID 1..7)")
    check(all(sorted(int(x["Run_ID"]) for x in v) == list(range(1, 8)) for v in groups.values()), "Run_IDs are 1..7 in every configuration")
    chk = defaultdict(set)
    for r in raw:
        chk[(r["Dataset"], r["Problem_Size"])].add(r["Graph_Checksum"])
    check(all(len(v) == 1 for v in chk.values()), "sequential and parallel runs of each graph have the same Graph_Checksum (identical graph)")
    check(all(float(r["Execution_Time"]) > 0 for r in raw), "all execution times are positive")
    check(len({r["Hardware"] for r in raw}) == 1, "a single hardware label is used for all rows (no mixed-machine comparison)")
    seq_rows = [r for r in raw if r["Algorithm"] == "SEQ_BFS"]
    par_rows = [r for r in raw if r["Algorithm"] != "SEQ_BFS"]
    check(all(r["Synchronization_Time"] == "" for r in seq_rows), "sequential rows have no synchronization measurement")
    check(all(r["Synchronization_Time"] != "" and float(r["Synchronization_Time"]) >= 0 for r in par_rows), "parallel rows have a non-negative synchronization measurement")
    check(all(float(r["Synchronization_Time"]) == 0 for r in par_rows if int(r["Threads"]) == 1), "with 1 thread the barrier wait is exactly 0 (sanity)")
    check(all(r["Verified"] == "1" and r["Reached_Vertices"] == groups[(r["Dataset"], int(r["Problem_Size"]), "SEQ_BFS", 1)][0]["Reached_Vertices"] for r in par_rows),
          "parallel and sequential runs reached the same number of vertices")
    threads = sorted({int(r["Threads"]) for r in par_rows})
    sizes = sorted({int(r["Problem_Size"]) for r in raw})
    check(len(sizes) >= 3, f"at least 3 problem sizes: {sizes}")
    check(len(threads) >= 3, f"at least 3 thread/resource configurations: {threads}")

    say("\n2. Independent recomputation of derived metrics")
    med = {k: st.median(float(x["Execution_Time"]) for x in v) for k, v in groups.items()}
    dmap = {(r["Dataset"], int(r["Problem_Size"]), r["Algorithm"], int(r["Threads"])): r for r in der}
    check(set(dmap) == set(groups), "derived CSV has exactly one row per raw configuration")
    bad = []
    for k, v in groups.items():
        ds, n, alg, t = k
        d = dmap[k]
        base = med[(ds, n, "SEQ_BFS", 1)]
        speed = 1.0 if alg == "SEQ_BFS" else base / med[k]
        eff = speed / t
        edges = float(v[0]["Edges_Traversed"])
        mteps = edges / med[k] / 1e6
        cv = 100 * st.stdev([float(x["Execution_Time"]) for x in v]) / st.mean([float(x["Execution_Time"]) for x in v])
        for name, mine, theirs in (("median", med[k], float(d["Median"])), ("speedup", speed, float(d["Speedup"])), ("efficiency", eff, float(d["Efficiency"])),
                                   ("MTEPS", mteps, float(d["MTEPS"])), ("CV%", cv, float(d["CV_percent"]))):
            if not rel_close(mine, theirs, 2e-5):
                bad.append((k, name, mine, theirs))
    check(not bad, f"median, speedup (=seq median / parallel median), efficiency (=speedup/threads), MTEPS (=edges/median time/1e6) and CV match the derived CSV for all {len(groups)} configurations" + (f"  mismatches: {bad[:3]}" if bad else ""))
    check(all(rel_close(float(d["Efficiency"]) * int(d["Threads"]), float(d["Speedup"])) for d in der), "Efficiency x Threads = Speedup in every derived row")
    check(all(d["Speedup"] == "1" or d["Algorithm"] != "SEQ_BFS" for d in der), "the sequential baseline has speedup 1 by definition")
    check(all(float(d["Speedup_Low"]) <= float(d["Speedup"]) * 1.0000001 and float(d["Speedup"]) <= float(d["Speedup_High"]) * 1.0000001 for d in der), "speedup lies inside its [Speedup_Low, Speedup_High] range")

    say("\n3. Variation and outliers (all runs are kept; nothing is removed)")
    cvs = []
    worst = []
    for k, v in groups.items():
        t = [float(x["Execution_Time"]) for x in v]
        m = st.median(t)
        cvs.append((100 * st.stdev(t) / st.mean(t), k))
        worst.append((max(t) / m, min(t) / m, k))
    noisy = [c for c in cvs if c[0] > 15]
    say(f"  configurations with CV > 15 %: {len(noisy)} of {len(cvs)}; maximum CV = {max(cvs)[0]:.1f} % at {max(cvs)[1]}")
    wmax = max(worst)
    say(f"  largest single-run excursion above the median: x{wmax[0]:.2f} at {wmax[2]}; largest below: x{min(w[1] for w in worst):.2f}")
    sub_ms = [c for c in cvs if med[c[1]] < 1e-3]
    say(f"  of the {len(sub_ms)} configurations with median < 1 ms, the mean CV is {st.mean(c[0] for c in sub_ms):.1f} %; for the others it is {st.mean(c[0] for c in cvs if med[c[1]] >= 1e-3):.1f} %")
    outl = [(w[0], w[2]) for w in worst if w[0] > 1.5]
    say(f"  configurations with a run > 1.5 x median: {len(outl)}")

    if a.docs:
        import docx
        say("\n4. Word tables versus CSV")
        sz = lambda n: f"2^{n.bit_length() - 1}"
        fam = {"Path": "path", "Grid": "grid", "Random (deg 16)": "random_d16", "R-MAT (ef 8)": "rmat_ef8"}
        nmax = max(sizes)

        def D(ds, n, alg_par, t):
            return dmap[(ds, n, "SEQ_BFS", 1)] if not alg_par else dmap[(ds, n, "PAR_BFS_LEVELSYNC", t)]
        covered = []
        def tables(path):
            if not Path(path).exists():                      # standalone packages contain only their own note
                say(f"  (skipped: {Path(path).name} is not in this package)")
                return []
            covered.append(Path(path).name)
            return docx.Document(path).tables
        def find(tbls, first_header):
            for t in tbls:
                if t.rows[0].cells[0].text.strip().startswith(first_header):
                    yield t
        rep = ROOT / "CS4-S01_Integrated_Report.docx"
        n1 = ROOT.parent / "02_Lucky_Sequential_BFS" / "Technical_Note_Student1.docx"
        n2 = ROOT.parent / "03_Girlfriend_OpenMP_BFS" / "Technical_Note_Student2.docx"
        cnt = 0
        bad = []
        def cmp(where, printed, true):
            nonlocal cnt
            cnt += 1
            if not printed_ok(printed, true):
                bad.append((where, printed, true))
        # report Table 4 (summary at largest size)
        for t in find(tables(rep), "Graph"):
            hdr = [c.text.replace("\n", " ") for c in t.rows[0].cells]
            if "Seq. ms" in hdr:
                for row in t.rows[1:]:
                    c = [x.text for x in row.cells]
                    ds = fam[c[0]]
                    s = D(ds, nmax, False, 1)
                    cmp(("T4", c[0], "vertices"), c[1], float(s["Vertices"])); cmp(("T4", c[0], "edges"), c[2], float(s["Edges_Undirected"]))
                    cmp(("T4", c[0], "levels"), c[3], float(s["Levels"])); cmp(("T4", c[0], "seq ms"), c[4], float(s["Median"]) * 1e3)
                    cmp(("T4", c[0], "seq MTEPS"), c[5], float(s["MTEPS"]))
                    for j, th in zip((6, 7, 8), (1, 2, 4)):
                        cmp(("T4", c[0], f"speedup {th}T"), c[j], float(D(ds, nmax, True, th)["Speedup"]))
                    cmp(("T4", c[0], "eff 4T"), c[9], float(D(ds, nmax, True, 4)["Efficiency"])); cmp(("T4", c[0], "MTEPS 4T"), c[10], float(D(ds, nmax, True, 4)["MTEPS"]))
            if any(h.startswith("n = 2^") for h in hdr):      # Table 5
                ns = [int(h.split("^")[1]) for h in hdr[1:]]
                for row in t.rows[1:]:
                    c = [x.text for x in row.cells]
                    ds = fam[c[0]]
                    for j, e in enumerate(ns, 1):
                        d = D(ds, 2 ** e, True, 4)
                        sp_s, ms_s = c[j].split(" (")
                        cmp(("T5", c[0], f"speedup 2^{e}"), sp_s, float(d["Speedup"])); cmp(("T5", c[0], f"ms 2^{e}"), ms_s.replace(" ms)", ""), float(d["Median"]) * 1e3)
            if hdr[0] == "Avg. degree":                      # Table 6
                for row in t.rows[1:]:
                    c = [x.text for x in row.cells]
                    deg = round(float(c[0]))
                    cands = [d for d in der if d["Dataset"].startswith("random_d") and int(d["Problem_Size"]) == 2 ** 18 and round(float(d["Avg_Degree"])) == deg]
                    sq = [d for d in cands if d["Algorithm"] == "SEQ_BFS"][0]
                    cmp(("T6", deg, "levels"), c[1], float(sq["Levels"])); cmp(("T6", deg, "seq ms"), c[2], float(sq["Median"]) * 1e3); cmp(("T6", deg, "seq MTEPS"), c[3], float(sq["MTEPS"]))
                    for j, th in zip((4, 5, 6), (1, 2, 4)):
                        p = [d for d in cands if d["Algorithm"] != "SEQ_BFS" and int(d["Threads"]) == th][0]
                        a1, a2 = c[j].split(" / ")
                        cmp(("T6", deg, f"speedup {th}T"), a1, float(p["Speedup"])); cmp(("T6", deg, f"MTEPS {th}T"), a2, float(p["MTEPS"]))
        # Note 1 table (sequential baseline)
        for t in find(tables(n1), "Graph"):
            for row in t.rows[1:]:
                c = [x.text for x in row.cells]
                s = D(fam[c[0]], 2 ** int(c[1].split("^")[1]), False, 1)
                cmp(("N1", c[0], c[1], "edges"), c[2], float(s["Edges_Undirected"])); cmp(("N1", c[0], c[1], "levels"), c[3], float(s["Levels"]))
                cmp(("N1", c[0], c[1], "median ms"), c[4], float(s["Median"]) * 1e3); cmp(("N1", c[0], c[1], "CV"), c[5], float(s["CV_percent"])); cmp(("N1", c[0], c[1], "MTEPS"), c[6], float(s["MTEPS"]))
        # Note 2 tables
        for t in tables(n2):
            h0 = t.rows[0].cells[0].text.strip()
            hdr = [c.text.replace("\n", " ") for c in t.rows[0].cells]
            if h0 == "Graph" and "1 thread speedup / eff." in hdr:
                for row in t.rows[1:]:
                    c = [x.text for x in row.cells]
                    ds, n = fam[c[0]], 2 ** int(c[1].split("^")[1])
                    for j, th in zip((2, 3, 4), (1, 2, 4)):
                        a1, a2 = c[j].split(" / ")
                        d = D(ds, n, True, th)
                        cmp(("N2", c[0], c[1], f"speedup {th}T"), a1, float(d["Speedup"])); cmp(("N2", c[0], c[1], f"eff {th}T"), a2, float(d["Efficiency"]))
                    cmp(("N2", c[0], c[1], "MTEPS 4T"), c[5], float(D(ds, n, True, 4)["MTEPS"]))
                    cmp(("N2", c[0], c[1], "MTEPS seq"), c[6], float(D(ds, n, False, 1)["MTEPS"]))
            if h0.startswith("Graph (n = 2^20)"):
                for row in t.rows[1:]:
                    c = [x.text for x in row.cells]
                    d = D(fam[c[0]], nmax, True, 4)
                    cmp(("N3", c[0], "levels"), c[1], float(d["Levels"])); cmp(("N3", c[0], "barrier %"), c[3], 100 * float(d["Sync_Wait_Frac"])); cmp(("N3", c[0], "merge %"), c[4], 100 * float(d["Merge_Frac"]))
                    work = float(d["Edges_Traversed"]) / float(d["Levels"])
                    cmp(("N3", c[0], "edges/level"), c[2], work)
        check(not bad, f"{cnt} numbers printed in the Word tables agree with the CSV (within printed rounding)" + (f"; MISMATCHES: {bad[:5]}" if bad else ""))
        check(cnt > 0 and "CS4-S01_Integrated_Report.docx" in covered, f"table audit covered {cnt} numbers in: {', '.join(covered)}")

    say("\nRESULT: " + ("ALL CHECKS PASSED" if not FAILS else f"{len(FAILS)} CHECK(S) FAILED"))
    log = ROOT / "logs" / "audit_report.txt"
    log.parent.mkdir(exist_ok=True)
    log.write_text("\n".join(OUT) + "\n", encoding="utf-8")
    sys.exit(1 if FAILS else 0)


if __name__ == "__main__":
    main()
