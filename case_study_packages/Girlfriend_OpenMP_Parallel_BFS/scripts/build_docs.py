#!/usr/bin/env python3
"""Builds report/*.docx (integrated report + two technical notes) from the derived CSV, environment.json and figures.

All numbers quoted in the prose come from data/derived/bfs_derived.csv through the helper functions below, so
re-running analyze.py + plot.py + build_docs.py after a new experiment refreshes every number and table.
NOTE: the *qualitative* statements (e.g. 'the path graph does not scale') were written after looking at OUR data. If you
re-run on a different machine, re-read the text and edit it wherever your results differ.
Placeholders in [square brackets] (names, registration numbers) must be filled in by the students.
"""
import json
from pathlib import Path

import pandas as pd
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

ROOT = Path(__file__).resolve().parent.parent
D = pd.read_csv(ROOT / "data/derived/bfs_derived.csv")
ENV = json.loads((ROOT / "data/env/environment.json").read_text())
FIG = ROOT / "figures"
OUT = ROOT / "report"
OUT.mkdir(exist_ok=True)
NMAX = int(D.Problem_Size.max())
NMIN = int(D.Problem_Size.min())
TMAX = int(D[D.Algorithm != "SEQ_BFS"].Threads.max())
NDENS = 2 ** 18
RAW = pd.read_csv(ROOT / "data/raw/bfs_raw.csv")
FAM = [("path", "Path"), ("grid", "Grid"), ("random_d16", "Random (deg 16)"), ("rmat_ef8", "R-MAT (ef 8)")]


def r(ds, n, t):
    """row of derived table; t=0 -> sequential baseline"""
    q = D[(D.Dataset == ds) & (D.Problem_Size == n)]
    q = q[q.Algorithm == "SEQ_BFS"] if t == 0 else q[(q.Algorithm != "SEQ_BFS") & (q.Threads == t)]
    return q.iloc[0]


def sp(ds, n, t=TMAX): return r(ds, n, t).Speedup
def ef(ds, n, t=TMAX): return r(ds, n, t).Efficiency
def mt(ds, n, t=0): return r(ds, n, t).MTEPS
def ms(ds, n, t=0): return r(ds, n, t).Median * 1e3
def f2(x): return f"{x:.2f}"
def f1(x): return f"{x:.1f}"
def sig(x):
    return f"{x:.4f}" if x < 0.01 else (f"{x:.3f}" if x < 0.1 else (f"{x:.2f}" if x < 10 else f"{x:.1f}"))


# ---------------------------------------------------------------- docx helpers
def new_doc(font="Times New Roman", size=11, margins=1.0):
    doc = Document()
    for s in doc.sections:
        s.left_margin = s.right_margin = Inches(margins)
        s.top_margin = s.bottom_margin = Inches(0.9)
    st = doc.styles["Normal"]
    st.font.name = font
    st.font.size = Pt(size)
    st.element.rPr.rFonts.set(qn("w:eastAsia"), font)
    st.paragraph_format.space_after = Pt(5)
    st.paragraph_format.line_spacing = 1.08
    for name, sz in (("Heading 1", 13), ("Heading 2", 11.5), ("Heading 3", 11)):
        h = doc.styles[name]
        h.font.name = font
        h.font.size = Pt(sz)
        h.font.bold = True
        h.font.color.rgb = RGBColor(0, 0, 0)
        h.element.rPr.rFonts.set(qn("w:eastAsia"), font)
        h.paragraph_format.space_before = Pt(10 if name == "Heading 1" else 7)
        h.paragraph_format.space_after = Pt(3)
        h.paragraph_format.keep_with_next = True
    add_page_number(doc)
    return doc


def add_page_number(doc):
    p = doc.sections[0].footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    for t, txt in (("begin", None), (None, "PAGE"), ("end", None)):
        if t:
            e = OxmlElement("w:fldChar")
            e.set(qn("w:fldCharType"), t)
        else:
            e = OxmlElement("w:instrText")
            e.set(qn("xml:space"), "preserve")
            e.text = txt
        run._r.append(e)
    run.font.size = Pt(9)


def para(doc, text, bold=False, italic=False, align=None, size=None, after=None):
    p = doc.add_paragraph()
    parts = text.split("**")  # **bold** inline markup
    for i, part in enumerate(parts):
        if not part:
            continue
        run = p.add_run(part)
        run.bold = bold or (i % 2 == 1)
        run.italic = italic
        if size:
            run.font.size = Pt(size)
    if align == "center":
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    elif align == "justify":
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if after is not None:
        p.paragraph_format.space_after = Pt(after)
    return p


def bullets(doc, items, style="List Bullet"):
    for it in items:
        p = doc.add_paragraph(style=style)
        parts = it.split("**")
        for i, part in enumerate(parts):
            if part:
                run = p.add_run(part)
                run.bold = i % 2 == 1
        p.paragraph_format.space_after = Pt(2)


def set_cell_bg(cell, color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), color)
    tcPr.append(shd)


def table(doc, header, rows, widths=None, size=8.5, caption=None, bold_first_col=False):
    if caption:
        c = para(doc, caption, bold=True, size=9.5, after=2)
        c.paragraph_format.keep_with_next = True
    t = doc.add_table(rows=1, cols=len(header))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(header):
        c = t.rows[0].cells[i]
        c.text = ""
        run = c.paragraphs[0].add_run(h)
        run.bold = True
        run.font.size = Pt(size)
        set_cell_bg(c, "D9E2F3")
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = ""
            run = cells[i].paragraphs[0].add_run(str(v))
            run.font.size = Pt(size)
            run.bold = bold_first_col and i == 0
    for row in t.rows:
        for c in row.cells:
            for p in c.paragraphs:
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.0
    if widths:
        t.autofit = False
        for i, w in enumerate(widths):
            t.columns[i].width = Inches(w)
        for row in t.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Inches(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


def figure_row(doc, items, width=3.15):
    """items: list of (png filename, caption); placed side by side in a borderless table."""
    t = doc.add_table(rows=2, cols=len(items))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, (fn, cap) in enumerate(items):
        c = t.rows[0].cells[i]
        c.text = ""
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        c.paragraphs[0].add_run().add_picture(str(FIG / fn), width=Inches(width))
        c2 = t.rows[1].cells[i]
        c2.text = ""
        run = c2.paragraphs[0].add_run(cap)
        run.font.size = Pt(8.5)
        run.italic = True
        c2.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


def env_rows():
    cc = ENV["compile_command_and_flags"]
    return [
        ("CPU", ENV["cpu_model"]),
        ("Cores / threads available", f"{ENV['logical_cpus']} logical CPUs reported by the OS (virtual machine; physical core mapping unknown)"),
        ("RAM", f"{ENV['ram_gb']} GB"),
        ("GPU", ENV["gpu"]),
        ("Operating system", ENV["os"]),
        ("Compiler", ENV["compiler"]),
        ("Compile command", cc),
        ("OpenMP configuration", f"OMP_PROC_BIND={ENV['OMP_PROC_BIND']}, OMP_PLACES={ENV['OMP_PLACES']}; schedule {ENV['OMP_SCHEDULE_used']}; "
                                 "threads = 1, 2, 4"),
        ("Measurement date (UTC)", ENV["date_utc"]),
        ("Condition note", ENV["note"]),
    ]


REFS = [
    "C. E. Leiserson and T. B. Schardl, “A work-efficient parallel breadth-first search algorithm (or how to cope with the nondeterminism of reducers),” in Proc. 22nd ACM Symp. Parallelism in Algorithms and Architectures (SPAA ’10), 2010, pp. 303–314, doi: 10.1145/1810479.1810534.",
    "S. Beamer, K. Asanović, and D. Patterson, “Direction-optimizing breadth-first search,” in Proc. Int. Conf. High Performance Computing, Networking, Storage and Analysis (SC ’12), 2012. [Online]. Available: http://dl.acm.org/citation.cfm?id=2388996.2389013",
    "A. Buluç and K. Madduri, “Parallel breadth-first search on distributed memory systems,” in Proc. Int. Conf. High Performance Computing, Networking, Storage and Analysis (SC ’11), 2011. arXiv:1104.4518.",
    "V. Agarwal, F. Petrini, D. Pasetto, and D. A. Bader, “Scalable graph exploration on multicore processors,” in Proc. ACM/IEEE Int. Conf. High Performance Computing, Networking, Storage and Analysis (SC ’10), 2010, pp. 46:1–46:11.",
    "L. Dhulipala, G. E. Blelloch, and J. Shun, “Theoretically efficient parallel graph algorithms can be fast and scalable,” ACM Trans. Parallel Comput., vol. 8, no. 1, 2021, doi: 10.1145/3434393.",
    "C. Yang, A. Buluç, and J. D. Owens, “GraphBLAST: A high-performance linear algebra-based graph framework on the GPU,” ACM Trans. Math. Softw., 2022, doi: 10.1145/3466795.",
    "S. L. Gonzaga de Oliveira, M. I. Santana, D. N. Brandão, and C. Osthoff, “An OpenMP-based breadth-first search implementation using the bag data structure,” Concurrency Comput.: Pract. Exper., vol. 36, no. 16, 2024, doi: 10.1002/cpe.8119.",
    "S. Beamer, K. Asanović, and D. Patterson, “The GAP benchmark suite,” arXiv:1508.03619, 2015 (rev. 2017).",
]


def references(doc):
    doc.add_heading("References", level=1)
    for i, t in enumerate(REFS, 1):
        p = doc.add_paragraph()
        run = p.add_run(f"[{i}] {t}")
        run.font.size = Pt(9.5)
        p.paragraph_format.left_indent = Inches(0.3)
        p.paragraph_format.first_line_indent = Inches(-0.3)
        p.paragraph_format.space_after = Pt(2)


# ---------------------------------------------------------------- numbers used in text
p_lev_us = {t: r("path", NMAX, t).Median / r("path", NMAX, t).Levels * 1e6 for t in (1, 2, 4)}
seq_level_ns = r("path", NMAX, 0).Median / r("path", NMAX, 0).Levels * 1e9
dens = D[D.Dataset.str.startswith("random_d") & (D.Problem_Size == NDENS)]
dmt = lambda deg, t: dens[(dens.Avg_Degree.round() >= deg - 1) & (dens.Avg_Degree.round() <= deg + 1) & ((dens.Algorithm == "SEQ_BFS") if t == 0 else (dens.Threads == t) & (dens.Algorithm != "SEQ_BFS"))].MTEPS.iloc[0]
cv_max = D.CV_percent.max()
n_runs = len(RAW)
work_per_level = {ds: r(ds, NMAX, 0).Edges_Traversed / r(ds, NMAX, 0).Levels for ds, _ in FAM}
work_small = {ds: r(ds, NMIN, 0).Edges_Traversed / r(ds, NMIN, 0).Levels for ds, _ in FAM}
SYNC4 = {ds: (r(ds, NMAX, TMAX).Sync_Wait_Frac, r(ds, NMAX, TMAX).Merge_Frac) for ds, _ in FAM}

ABSTRACT = (
    "Breadth-first search (BFS) is a basic graph kernel, but its parallel performance depends strongly on the shape of the graph. "
    "We compare a sequential queue-based BFS with a level-synchronous OpenMP BFS that claims vertices with an atomic compare-and-swap. "
    "Both programs share one graph format, start-vertex rule, timing "
    f"convention and correctness check. We measured path, 2-D grid, uniform random and R-MAT graphs with {NMIN:,} to {NMAX:,} vertices, "
    f"one to {TMAX} threads and seven repetitions per setting on a {ENV['logical_cpus']}-vCPU cloud virtual machine. All {n_runs} timed runs "
    f"produced valid BFS distances. With {TMAX} threads on {NMAX:,} vertices, the speedup over the sequential baseline was {f2(sp('random_d16', NMAX))} for the random graph "
    f"and {f2(sp('rmat_ef8', NMAX))} for the R-MAT graph, but only {f2(sp('grid', NMAX))} for the grid and {sig(sp('path', NMAX))} for the path. "
    f"On random graphs with {NDENS:,} vertices, throughput with {TMAX} threads rose from {f1(dmt(2, TMAX))} to {f1(dmt(64, TMAX))} MTEPS as the average degree grew from 2 to 64. "
    "The results show that a plain level-synchronous BFS is limited by the amount of work in each level: graphs with many levels and small frontiers "
    "pay the barrier cost without enough work to share. We discuss limitations and outline hybrid, direction-optimizing and GPU follow-ups."
)


# =============================================================== INTEGRATED REPORT
def build_report():
    wc = len(ABSTRACT.split())
    assert 150 <= wc <= 200, f"abstract has {wc} words (manual: 150-200)"
    doc = new_doc()
    para(doc, "How Graph Size and Structure Affect the Scalability of Parallel Breadth-First Search: A Sequential versus OpenMP Study", bold=True, align="center", size=15, after=4)
    para(doc, "BCSE412L Parallel Computing — Case Study CS4-S01 (Parallel Graph Processing: Parallel Breadth-First Search)", align="center", size=10.5, after=2)
    para(doc, "Student 1: [Name, Reg. No.] (sequential baseline)    |    Student 2: [Name, Reg. No.] (OpenMP parallel BFS)    |    Batch: [Batch ID]", align="center", size=10, after=2)
    para(doc, "School of Computer Science and Engineering, VIT Vellore — Fall Semester 2026-27", align="center", size=10, after=8)

    doc.add_heading("Abstract", level=1)
    para(doc, ABSTRACT, align="justify")
    para(doc, "**Keywords:** breadth-first search, OpenMP, level-synchronous BFS, speedup, efficiency, TEPS, graph structure, scalability.", size=10)

    # ---------------- 1 Introduction
    doc.add_heading("1  Introduction and Literature Survey", level=1)
    para(doc,
         "Breadth-first search (BFS) explores a graph level by level from a start vertex and returns, for every vertex, the smallest number of edges needed to reach it. "
         "It is the building block of shortest-path queries in unweighted graphs, connected components, social-network analysis and many other algorithms, and it is the main kernel of the Graph500 "
         "list and of the GAP benchmark suite [8]. Graphs in practice have millions or billions of edges, so even a linear-time BFS takes noticeable time, and modern multicore processors offer a natural way to speed it up. "
         "BFS is, however, not an easy kernel to parallelize: the work per vertex is tiny, memory accesses are irregular, and the amount of parallel work depends on how many vertices sit on the same level, which is decided by the graph’s shape.", align="justify")
    para(doc, "**Sequential and parallel BFS.** Sequential BFS keeps a first-in-first-out queue. It removes a vertex, looks at its neighbours, and gives every unvisited neighbour the distance of the current vertex plus one. "
              "Every vertex enters the queue once and every edge is examined a constant number of times, so the running time is O(n + m) for n vertices and m edges. "
              "Parallel BFS in shared memory is usually level-synchronous: all vertices of the current level (the frontier) are expanded at the same time by different threads, and a barrier separates one level from the next. "
              "Two problems must be solved. First, two threads may find the same unvisited vertex at the same moment, so the “visited” update must be atomic or the vertex may be added twice. "
              "Second, the next frontier is built by many threads, so their contributions must be combined without data races.", align="justify")
    para(doc, "**Literature survey.** Table 1 summarizes the eight sources we used; the discussion below compares them.", align="justify")
    table(doc, ["Ref.", "Topic", "Main idea or finding (as far as we verified from the paper records)", "Relevance to this study"], [
        ["[1] 2010", "Shared-memory BFS", "A work-efficient parallel BFS that handles the nondeterminism of concurrent frontier updates.", "Frontier construction and race handling"],
        ["[4] 2010", "Multicore BFS", "BFS on Intel Nehalem multicore systems with up to 64 threads; a 4-socket machine beat a 128-processor Cray XMT by 2.4× on a random-graph benchmark.", "Shared-memory scaling on random graphs"],
        ["[3] 2011", "Distributed BFS", "Level-synchronous BFS with 1-D and 2-D partitioning; the hybrid 2-D version cut communication time by up to 3.5×; 17.8 billion edge visits per second on 40,000 cores.", "Level-synchronous model, TEPS metric"],
        ["[2] 2012", "Direction-optimizing BFS", "Switches between top-down and bottom-up traversal to avoid examining many edges when the frontier is large.", "Why large frontiers matter; future work"],
        ["[8] 2015", "Benchmark", "GAP benchmark suite: reference kernels, input graphs and an evaluation method for shared-memory graph processing.", "Methodology: trials, graph families"],
        ["[5] 2021", "Graph-processing suite", "GBBS: theoretically efficient parallel algorithms for 20 graph problems that scale to a graph of 3.5 billion vertices on one 1 TB machine.", "Graph size and scalability"],
        ["[6] 2022", "GPU graph framework", "GraphBLAST, a linear-algebra-based graph framework on the GPU.", "GPU branch (not implemented here)"],
        ["[7] 2024", "OpenMP BFS", "OpenMP/C++ BFS with the bag data structure, evaluated on many graphs on two multicore machines.", "Closest comparison to our OpenMP BFS"],
    ], widths=[0.55, 1.1, 3.4, 1.6], size=8, caption="Table 1. Sources used in the literature survey.")
    para(doc,
         "**Comparison.** Early shared-memory work addressed the problem of concurrent frontier updates [1] and reported strong results on multicore processors with random-graph benchmarks [4]; "
         "random graphs have few levels and wide frontiers, which suits parallel execution. Distributed-memory work [3] uses the same level-synchronous pattern, reports speed in traversed edges per second (TEPS) and treats communication cost as a main concern. "
         "Direction-optimizing BFS [2] observes that when the frontier is a large part of the graph, top-down BFS wastes effort on edges that lead to already visited vertices, and it fixes this by searching bottom-up. "
         "Later systems are broader in scope: GBBS [5] shows that careful shared-memory algorithms can handle graphs with billions of vertices, GraphBLAST [6] moves graph traversal to the GPU, "
         "and the 2024 OpenMP study [7] returns to the plain CPU setting and reports that speedup depends on the input graph. The GAP suite [8] standardises how such comparisons should be made.", align="justify")
    para(doc,
         "**Gap addressed here.** The sources above concentrate on large machines, very large graphs or low-diameter scale-free graphs. A student or practitioner with a small multicore machine often asks a simpler question: "
         "“Is it worth parallelizing a plain level-synchronous BFS, and for which graphs?” Each level costs at least a few barriers, so graphs with many levels and small frontiers (long paths, road-like grids) "
         "should lose, while graphs with few, wide levels should win. To our knowledge of the sources listed here, this contrast is rarely shown side by side with the synchronization cost measured. "
         "We therefore compare one sequential and one OpenMP implementation on four graph structures, four sizes and three thread counts, and we relate the speedup to the amount of work per level.", align="justify")

    # ---------------- 2 Problem
    doc.add_heading("2  Problem Definition and Research Question", level=1)
    para(doc, "**Problem.** Given an undirected, unweighted graph G = (V, E) in adjacency-list form and a start vertex s, compute dist[v] for every vertex v (−1 if v cannot be reached from s). "
              "We compare a sequential BFS with a level-synchronous OpenMP BFS on graphs of increasing size and different structure and measure traversal time, speedup, efficiency and traversal throughput.", align="justify")
    para(doc, "**Research question (from the manual).** How does graph size and structure affect BFS scalability?", align="justify")
    para(doc, "**Hypotheses.**", after=1)
    bullets(doc, [
        "**H1 (structure):** Speedup is governed by the work available per BFS level. Random and R-MAT graphs (few, wide levels) will speed up with more threads; the path and the grid (many, narrow levels) will not.",
        "**H2 (size):** For a fixed structure, speedup and efficiency improve as the graph grows, because fixed costs (thread start-up, barriers) are shared over more work.",
        "**H3 (density):** Traversal throughput (TEPS) increases with average degree, because each vertex brings more edge work to share.",
    ])

    # ---------------- 3 Methodology
    doc.add_heading("3  Methodology", level=1)
    doc.add_heading("3.1  Division of work and common conventions", level=2)
    table(doc, ["", "Student 1", "Student 2", "Both"], [
        ["Main task", "BFS theory; sequential baseline; graph generators and input format; correctness tests; baseline timing", "OpenMP parallel BFS; thread configurations; speedup, efficiency, TEPS; synchronization and overhead analysis", "Literature survey; experiment design; analysis; this report"],
        ["Files", "graph.hpp, bfs_seq.hpp, bfs_seq_main.cpp, tests/", "bfs_par.hpp, bfs_par_main.cpp", "run_experiments.py, analyze.py, plot.py"],
    ], widths=[0.8, 2.1, 2.1, 1.7], size=8.5, caption="Table 2. Individual contributions (see also the two technical notes).")
    para(doc, "To make the two parts comparable, both programs use the same graph code and the same conventions. **Graph:** undirected, simple (self-loops and duplicate edges removed), stored in compressed sparse row (CSR) form, which is a compact adjacency list. "
              "**Start vertex:** vertex 0 for path and grid; the lowest-numbered vertex of maximum degree for random and R-MAT graphs, so that the traversal always covers a large component. "
              "**Timed region:** one call of the BFS function, including the allocation and initialization of its own arrays and, for the parallel code, thread start-up; graph generation, validation and statistics are excluded. "
              "**Correctness:** every parallel result is compared with the sequential distances, and an independent validator checks that the distances form a valid BFS. "
              "**Clock:** std::chrono::steady_clock, in seconds.", align="justify")
    doc.add_heading("3.2  Sequential baseline (Student 1)", level=2)
    para(doc, "The baseline is the classic queue-based BFS described in Section 1, with an array used as the queue and an integer distance array initialised to −1. "
              "It was implemented and validated before any parallel code was written, as required by the manual.", align="justify")
    doc.add_heading("3.3  Level-synchronous OpenMP BFS (Student 2)", level=2)
    para(doc, "The whole traversal runs inside one OpenMP parallel region. For each level the following steps are executed:", after=2)
    bullets(doc, [
        "**Expand.** The frontier is divided among threads with an OpenMP loop (schedule dynamic, chunk 64). For every neighbour v of a frontier vertex, a thread first reads dist[v]; if it is −1 the thread tries an atomic compare-and-swap from −1 to the new level number. "
        "Exactly one thread can win, so a vertex is added to the next frontier once and no data race occurs on dist. The winner appends v to its own private buffer, so no lock is needed.",
        "**Barrier.** All threads wait until the level is fully expanded.",
        "**Merge.** One thread computes prefix sums of the buffer sizes; then each thread copies its buffer into its own disjoint slice of the next-frontier array (no atomics needed). After a second barrier one thread swaps the two frontier arrays and increases the level. The traversal stops when the new frontier is empty.",
    ])
    para(doc, "Correctness follows from two facts: vertices of level L+1 are only discovered while level L is expanded, and the barrier ensures that level L is complete before level L+1 starts. The compare-and-swap makes the visited test-and-set indivisible.", align="justify")
    doc.add_heading("3.4  Experimental environment", level=2)
    table(doc, ["Item", "Value"], env_rows(), widths=[1.6, 4.9], size=8.5, caption="Table 3. Hardware and software of the measurement machine (from data/env/environment.json).")
    para(doc, "All results in this report come from this one machine. Speedups are therefore comparisons between implementations on the same hardware; no results from different hardware are compared. "
              "No GPU was available, so the manual’s optional GPU comparison was not performed.", align="justify")
    doc.add_heading("3.5  Experiment design (experimental choices, not manual requirements)", level=2)
    bullets(doc, [
        f"**Graph structures:** path (maximum depth, one vertex per level), 2-D grid (depth about 2√n), uniform random graph with average degree 16, and R-MAT graph (Graph500-like skew, edge factor 8, labels randomly permuted).",
        "**Sizes:** 2^14, 2^16, 2^18 and 2^20 vertices (four sizes; the manual requires at least three). A separate density sweep uses random graphs with 2^18 vertices and average degree 2, 4, 8, 16, 32 and 64.",
        "**Threads:** 1, 2 and 4 (the machine has four logical CPUs; threads are pinned to cores).",
        "**Repetitions:** one warm-up and seven timed runs per setting; the median is the main summary, and standard deviation, coefficient of variation (CV), minimum and maximum are stored. All graphs use seed 12345, and a checksum of each graph is stored to prove that the sequential and parallel runs used the identical graph.",
        f"**Total:** {n_runs} timed runs in the raw CSV (data/raw/bfs_raw.csv).",
    ])
    doc.add_heading("3.6  Metrics", level=2)
    para(doc, "**Execution time** is the median over the repeated runs. **Speedup** = sequential median time / parallel median time on the same graph (baseline = our sequential BFS). **Efficiency** = speedup / number of threads. "
              "**Throughput (TEPS)** = number of undirected edges inside the component reached from the start vertex / execution time (Graph500 convention); we report millions of TEPS (MTEPS). "
              "**Synchronization wait** is, summed over all levels, the time of the slowest thread’s expand phase minus the average expand time, i.e. the average time a thread waits at the end-of-level barrier. "
              "**Frontier-merge time** is the wall time of the merge phase. Both are measured in an extra instrumented run after each timed run, so the timers never disturb the timed run; "
              "they are shown as a share of the timed execution time and are therefore approximate. Loop-scheduling cost cannot be separated from useful work and communication time does not exist in shared memory, so both are recorded as NA.", align="justify")

    doc.add_heading("3.7  Correctness testing and reproducibility", level=2)
    para(doc, "Correctness was tested before any timing. The test program checks 12 small graphs whose distances were worked out by hand (path from two start vertices, star, cycle, 3×3 grid, complete graph, binary tree, a disconnected graph, an isolated start vertex, a single vertex, duplicate edges with a self-loop, and a graph with a long and a short route). "
              "It then compares parallel and sequential results on generated path, grid, random, R-MAT and disconnected graphs for 1, 2, 4 and 7 threads and for static, dynamic and guided schedules, repeated many times to expose rare races, "
              "and it checks error handling for bad inputs. In total 1,402 checks passed and none failed (logs/correctness_test_output.txt).", align="justify")
    para(doc, "Everything can be rebuilt with a few commands (see README.md): make; make test; python3 scripts/run_experiments.py --fresh; python3 scripts/analyze.py; python3 scripts/plot.py; python3 scripts/build_docs.py. "
              "The raw CSV follows the manual’s column list (Speedup and Efficiency are left empty in the raw file and are computed by analyze.py from the raw times), and the runner refuses to overwrite existing raw data.", align="justify")

    # ---------------- 4 Results
    doc.add_heading("4  Results and Discussion", level=1)
    para(doc, f"All {n_runs} runs produced distances identical to the sequential result, and the correctness tests (12 hand-checked graphs and more than 1,400 randomized comparisons) passed. "
              "Raw runs, derived statistics and plotting scripts are provided in the project folder; no measurement was removed or edited.", align="justify")
    rows = []
    for ds, lab in FAM:
        s = r(ds, NMAX, 0)
        rows.append([lab, f"{int(s.Vertices):,}", f"{int(s.Edges_Undirected):,}", int(s.Levels), f1(ms(ds, NMAX, 0)), f"{mt(ds, NMAX, 0):.0f}",
                     sig(sp(ds, NMAX, 1)), sig(sp(ds, NMAX, 2)), sig(sp(ds, NMAX, 4)), sig(ef(ds, NMAX, 4)), f"{mt(ds, NMAX, 4):.0f}"])
    table(doc, ["Graph", "Vertices", "Edges", "Levels", "Seq. ms", "Seq. MTEPS", "Speedup\n1T", "Speedup\n2T", "Speedup\n4T", "Effic.\n4T", "MTEPS\n4T"], rows,
          widths=[0.85, 0.68, 0.68, 0.55, 0.45, 0.62, 0.55, 0.55, 0.55, 0.5, 0.6], size=7.5, caption=f"Table 4. Summary comparison at the largest size ({NMAX:,} vertices). Speedup is relative to the sequential median on the same graph.")
    rows = []
    for ds, lab in FAM:
        rows.append([lab] + [f"{sig(sp(ds, n))} ({sig(r(ds, n, TMAX).Median * 1e3)} ms)" for n in sorted(D.Problem_Size.unique())])
    table(doc, ["Graph"] + [f"n = 2^{int(round(__import__('math').log2(n)))}" for n in sorted(D.Problem_Size.unique())], rows, widths=[1.3, 1.3, 1.3, 1.3, 1.3], size=8.5,
          caption=f"Table 5. Speedup with {TMAX} threads (and median parallel time) for all sizes. Values below 1 mean the parallel version was slower.")

    figure_row(doc, [("fig1_time_vs_size.png", "Figure 1. Median execution time versus number of vertices (log–log). Solid: sequential; dashed: OpenMP with 4 threads."),
                     ("fig2_speedup_vs_threads.png", f"Figure 2. Speedup over the sequential baseline versus threads for {NMAX:,} vertices. Bars show the range from the fastest/slowest runs.")])
    doc.add_heading("4.1  Execution time and speedup", level=2)
    grow = {ds: ms(ds, NMAX, 0) / ms(ds, 2 ** 18, 0) for ds, _ in FAM}
    para(doc, f"Figure 1 shows how the sequential time grows. Each step of 4× in vertices costs about 4× in time for the path, but going from 2^18 to 2^20 vertices multiplies the sequential time by "
              f"{grow['path']:.1f} (path), {grow['grid']:.1f} (grid), {grow['random_d16']:.1f} (random) and {grow['rmat_ef8']:.1f} (R-MAT); "
              f"the throughput of the random graph falls from {mt('random_d16', 2**18, 0):.0f} MTEPS to {mt('random_d16', NMAX, 0):.0f} MTEPS. "
              "We did not measure cache events, so we can only suggest that the larger graph, which no longer fits comfortably in the fast caches, causes many more memory stalls. "
              f"The parallel version behaves very differently by structure (Figure 2, Table 4; efficiency in Figure 5). On the random and R-MAT graphs with {NMAX:,} vertices and {TMAX} threads, the speedup is {f2(sp('random_d16', NMAX))} and {f2(sp('rmat_ef8', NMAX))}, "
              f"which is close to the ideal value of {TMAX} (efficiency {f2(ef('random_d16', NMAX))} and {f2(ef('rmat_ef8', NMAX))}). "
              f"On the grid the parallel code was slower than the baseline at every size and thread count (speedup {f2(sp('grid', NMAX, 1))}, {f2(sp('grid', NMAX, 2))} and {f2(sp('grid', NMAX, 4))} for 1, 2 and 4 threads); more threads did not help. "
              f"On the path it was {1/sp('path', NMAX):.0f} times slower with four threads, and adding threads made it slower still.", align="justify")
    para(doc, f"Two details deserve a comment. First, with two threads the efficiency of the random and R-MAT graphs at the largest size is slightly above 1 ({f2(ef('random_d16', NMAX, 2))} and {f2(ef('rmat_ef8', NMAX, 2))}), and one-thread parallel BFS is already a little faster than the sequential baseline "
              f"({f2(sp('random_d16', NMAX, 1))} and {f2(sp('rmat_ef8', NMAX, 1))}). Efficiency here is measured against the sequential program, not against the one-thread parallel program, and the CV of these runs is 6–14%, "
              "so we treat these values as “about 1”, not as true superlinear scaling. Second, the very small runs (below a millisecond) have a CV of up to "
              f"{cv_max:.0f}%, so their speedups are uncertain; the error bars in Figure 2 and the Speedup_Low/Speedup_High columns of the derived CSV show this.", align="justify")

    figure_row(doc, [("fig3_throughput_vs_density.png", f"Figure 3. Traversal throughput (MTEPS) versus average degree for random graphs with {NDENS:,} vertices."),
                     ("fig4_speedup_vs_size.png", f"Figure 4. Speedup with {TMAX} threads versus graph size for the four structures.")])
    doc.add_heading("4.2  Effect of graph size and density", level=2)
    para(doc, f"Figure 4 and Table 5 show the effect of size. On the random graph the {TMAX}-thread speedup grows from {f2(sp('random_d16', NMIN))} at 2^14 vertices to {f2(sp('random_d16', NMAX))} at 2^20, and on the R-MAT graph from {f2(sp('rmat_ef8', NMIN))} to {f2(sp('rmat_ef8', NMAX))}. "
              f"On the grid it rises from {f2(sp('grid', NMIN))} to {f2(sp('grid', NMAX))} but never reaches 1. On the path it stays between {sig(min(sp('path', n) for n in D.Problem_Size.unique()))} and {sig(max(sp('path', n) for n in D.Problem_Size.unique()))}: more vertices only mean more levels, so the problem does not improve with size. "
              f"Figure 3 shows the effect of density. With {TMAX} threads the throughput increases from {f1(dmt(2, TMAX))} MTEPS (average degree 2) to {f1(dmt(64, TMAX))} MTEPS (degree 64), while the sequential program stays between {f1(dmt(2, 0))} and {f1(max(dmt(d, 0) for d in (2, 4, 8, 16, 32, 64)))} MTEPS. "
              "A denser graph gives each frontier vertex more edges to scan, so there is more work between barriers and the fixed synchronization cost matters less.", align="justify")

    rows = []
    for deg in (2, 4, 8, 16, 32, 64):
        e = dens[(dens.Avg_Degree.round() >= deg - 1) & (dens.Avg_Degree.round() <= deg + 1)]
        sq = e[e.Algorithm == "SEQ_BFS"].iloc[0]
        rows.append([f"{sq.Avg_Degree:.1f}", int(sq.Levels), f1(sq.Median * 1e3), f"{sq.MTEPS:.0f}"] + [f"{sig(e[(e.Threads==t)&(e.Algorithm!='SEQ_BFS')].iloc[0].Speedup)} / {e[(e.Threads==t)&(e.Algorithm!='SEQ_BFS')].iloc[0].MTEPS:.0f}" for t in (1, 2, 4)])
    table(doc, ["Avg. degree", "Levels", "Seq. time (ms)", "Seq. MTEPS", "1T speedup / MTEPS", "2T speedup / MTEPS", "4T speedup / MTEPS"], rows,
          widths=[0.8, 0.6, 0.9, 0.8, 1.2, 1.2, 1.2], size=8.5, caption=f"Table 6. Density sweep on random graphs with {NDENS:,} vertices (medians of 7 runs).")
    figure_row(doc, [("fig5_efficiency_vs_threads.png", f"Figure 5. Parallel efficiency versus threads for {NMAX:,} vertices (efficiency = speedup / threads)."),
                     ("fig6_overhead_breakdown.png", f"Figure 6. Share of parallel time spent waiting at the barrier and in the frontier-merge phase ({TMAX} threads, {NMAX:,} vertices).")])
    figure_row(doc, [("fig7_work_per_level_vs_speedup.png", f"Figure 7. Speedup with {TMAX} threads versus the average number of edges examined per BFS level (all four sizes of every structure).")], width=3.4)
    doc.add_heading("4.3  Why the structures behave differently: synchronization and work per level", level=2)
    para(doc, f"The path has one vertex per level, so there is nothing to share, yet every level still executes the full set of steps of Section 3.3. We divide the median time of the largest path by its number of levels: "
              f"the cost per level is {p_lev_us[1]:.2f} µs with one thread, {p_lev_us[2]:.2f} µs with two and {p_lev_us[4]:.2f} µs with four, compared with {seq_level_ns:.1f} ns per vertex in the sequential program. "
              f"Even with one thread the parallel code pays the loop set-up and barrier steps, and the cost per level grows with the number of threads because more threads have to meet at each barrier. "
              f"In the instrumented runs (Figure 6) the merge phase takes {100*SYNC4['path'][1]:.0f}% and the barrier wait {100*SYNC4['path'][0]:.0f}% of the 4-thread time on the path; the remainder lies in the expand phase and in loop start-up, which we could not time separately.", align="justify")
    para(doc, f"The grid has {int(r('grid', NMAX, 0).Levels):,} levels and an average of about {work_per_level['grid']:,.0f} edge examinations per level at the largest size, which is a few microseconds of work: not enough to pay for the per-level overhead, and the grid’s parallel time barely changes between one and four threads. "
              f"The random and R-MAT graphs have only {int(r('random_d16', NMAX, 0).Levels)} and {int(r('rmat_ef8', NMAX, 0).Levels)} levels with about {work_per_level['random_d16']:,.0f} and {work_per_level['rmat_ef8']:,.0f} edge examinations per level, "
              f"so the barrier wait is only {100*SYNC4['random_d16'][0]:.1f}% and {100*SYNC4['rmat_ef8'][0]:.1f}% and the merge phase {100*SYNC4['random_d16'][1]:.1f}% and {100*SYNC4['rmat_ef8'][1]:.1f}% of the time. "
              "Figure 7 summarises the pattern: speedup rises with the work available per level. Because structure, size and work per level change together in our data, this figure shows an association, not a controlled proof; "
              "a cleaner test would vary the number of levels while keeping the number of edges fixed.", align="justify")
    doc.add_heading("4.4  Hypotheses and comparison with the literature", level=2)
    bullets(doc, [
        f"**H1 supported.** Random and R-MAT graphs reached speedups of {f2(sp('random_d16', NMAX))} and {f2(sp('rmat_ef8', NMAX))} with {TMAX} threads, whereas the grid ({f2(sp('grid', NMAX))}) and the path ({sig(sp('path', NMAX))}) were slower than sequential.",
        "**H2 partly supported.** Speedup grows with size for random, R-MAT and grid graphs but not for the path, and the grid still does not beat the baseline at 2^20 vertices.",
        f"**H3 supported for the parallel code.** Throughput with {TMAX} threads rose from {f1(dmt(2, TMAX))} to {f1(dmt(64, TMAX))} MTEPS; the sequential code rose less and fell slightly at degree 64.",
    ])
    para(doc, "These trends are consistent with the literature. Our random-graph results resemble the strong multicore results reported for random-graph benchmarks [4], and the observation of Beamer et al. [2] that the frontier of low-diameter graphs becomes very large "
              "matches our graphs with 5–7 levels. The 2024 OpenMP study [7] reports speedups of tens of times on 28–48 core machines (according to its abstract as we read it), and that speedup depends on the input graph. "
              "Our four-thread speedups of about 4 are in line with that picture, but the numbers cannot be compared directly because the hardware, thread counts and graphs are different. "
              "Our contribution is a small, reproducible, side-by-side measurement that makes the cost of barriers visible for graphs with many levels.", align="justify")

    # ---------------- 5 Limitations
    doc.add_heading("5  Limitations and Threats to Validity", level=1)
    bullets(doc, [
        f"**Hardware.** Only one machine was used: a shared cloud virtual machine with {ENV['logical_cpus']} logical CPUs. We cannot tell whether these are physical cores or hyper-threads, and neighbouring workloads may disturb timings. We could test only 1, 2 and 4 threads, so saturation, NUMA effects and many-core behaviour are not visible.",
        f"**Measurement noise.** The CV of some configurations is large (up to {cv_max:.0f}%, mostly for runs shorter than a millisecond). We kept all runs and report the median and the range; small differences (for example between two thread counts on the grid) should not be over-interpreted.",
        "**Datasets.** Only synthetic graphs were used. Real graphs (SNAP, SuiteSparse) have community structure, hubs and locality that may change the results. The largest graph has about one million vertices, small compared with the literature.",
        "**Implementation constraints.** The parallel code is a plain top-down level-synchronous BFS with one fixed schedule (dynamic, chunk 64) and one start vertex per graph. We did not tune the chunk size, use bitmaps or direction-optimization, or test many start vertices.",
        "**Overhead measurement.** Synchronization and merge times come from separate instrumented runs and are shown as a share of the timed run, so they are approximate; loop-scheduling cost was not separable. Memory use is an analytic estimate, not measured.",
        "**Baseline choice.** All speedups are relative to our own sequential BFS. A faster baseline (for example direction-optimizing BFS) would lower the speedups of the random and R-MAT graphs.",
        "**Scope.** No GPU, MPI or energy measurements were made.",
    ])

    # ---------------- 6 Conclusion
    doc.add_heading("6  Conclusion and Future Research Directions", level=1)
    para(doc, f"**Answer to the research question.** Graph structure matters more than graph size. A level-synchronous OpenMP BFS scaled almost linearly on random and R-MAT graphs with {NMAX:,} vertices (speedup {f2(sp('random_d16', NMAX))} and {f2(sp('rmat_ef8', NMAX))} on {TMAX} threads), "
              f"because they have few levels with large frontiers. It was slower than the sequential baseline on the grid and about {1/sp('path', NMAX):.0f} times slower on the path, because every level costs a fixed synchronization overhead that is not covered by the small amount of work in each level. "
              "Growing the graph helps only when the extra vertices widen the frontiers, and denser graphs give higher throughput. In practice, a parallel BFS should only be used when the expected work per level is large.", align="justify")
    para(doc, "**Future research directions.**", after=1)
    bullets(doc, [
        "**Hybrid and adaptive traversal:** switch to a sequential loop when the frontier is small and to parallel expansion when it is large, and add bottom-up steps as in direction-optimizing BFS [2]; find the frontier-size threshold on our machine.",
        "**Real graphs and more hardware:** repeat the study on SNAP/SuiteSparse road and social graphs, use more cores and NUMA machines, and test many start vertices.",
        "**GPU implementation:** compare with a CUDA or linear-algebra-based GPU BFS [6], including data-transfer cost.",
        "**Controlled structure experiment:** generate graphs with the same number of edges but different numbers of levels to separate the effect of depth from the effect of size.",
        "**Tuning and energy:** study schedule and chunk size, bitmap visited sets and the energy-delay trade-off of using more threads.",
    ])
    references(doc)
    doc.save(OUT / "CS4-S01_Integrated_Report.docx")
    print("report built; abstract words:", wc)


# =============================================================== NOTE 1
def build_note1():
    doc = new_doc(size=10.5, margins=0.9)
    para(doc, "Individual Technical Note — Student 1", bold=True, align="center", size=14, after=2)
    para(doc, "Sequential BFS, graph preparation, correctness and baseline", align="center", size=11, after=2)
    para(doc, "CS4-S01 Parallel Breadth-First Search — BCSE412L Parallel Computing | [Student 1 name, Reg. No.] | Batch [ID]", align="center", size=9.5, after=6)
    doc.add_heading("1  My contribution", level=1)
    para(doc, "I was responsible for the baseline of the case study: explaining the BFS algorithm, implementing the sequential BFS in C++, preparing reproducible graph inputs, verifying correctness, "
              "measuring the sequential baseline and documenting the baseline methodology. My partner built the OpenMP version on top of the same graph code and conventions, so that speedups are measured against my baseline. "
              "Both of us wrote the literature survey and the integrated report.", align="justify")
    doc.add_heading("2  The BFS algorithm and its cost", level=1)
    para(doc, "BFS starts at a source vertex s with distance 0. A queue holds the vertices that have been discovered but not yet expanded. The algorithm removes the vertex u at the head of the queue and, "
              "for every neighbour v of u that has not been discovered (dist[v] = −1), sets dist[v] = dist[u] + 1 and appends v. Because the queue is first-in-first-out, vertices are expanded in order of distance, "
              "so the first time a vertex is reached is along a shortest path. Vertices that are never reached keep the value −1.", align="justify")
    para(doc, "Pseudocode:  dist[*] = −1; dist[s] = 0; push(s);  while queue not empty: u = pop(); for each neighbour v of u: if dist[v] == −1: dist[v] = dist[u] + 1; push(v).", italic=True, size=9.5)
    para(doc, "Each vertex is pushed and popped once and each adjacency entry is read once, giving a running time O(n + m) and extra memory O(n) for the distance array and the queue. "
              "In the code (include/bfs_seq.hpp) the queue is a plain integer array of length n, which is enough because no vertex is pushed twice.", align="justify")
    doc.add_heading("3  Graph preparation", level=1)
    para(doc, "All graphs are undirected, simple and stored in compressed sparse row (CSR) form: an offset array off[0..n] and a neighbour array adj, so that the neighbours of u are adj[off[u]..off[u+1]−1]. "
              "Building the CSR removes self-loops and duplicate edges and sorts each neighbour list. I wrote four generators in include/graph.hpp:", align="justify")
    bullets(doc, [
        "**Path** (n vertices in a line): n levels, one vertex per level; the worst case for parallelism.",
        "**Grid** (√n × √n, four neighbours): about 2√n levels; frontier width up to √n.",
        "**Random** (uniform random pairs, average degree 16 or other values): few levels, very wide frontiers.",
        "**R-MAT** (Graph500-like parameters 0.57/0.19/0.19/0.05, vertex labels permuted): skewed degrees with hubs.",
    ])
    para(doc, "Generators use our own SplitMix64 random generator with a fixed seed (12345), so the same graph is produced on every compiler and operating system. "
              "Each CSV row stores a checksum of the graph; the analysis script stops if the sequential and parallel rows of one graph have different checksums. "
              "The start vertex rule is vertex 0 for path and grid, and the lowest-numbered vertex of highest degree for random and R-MAT graphs. "
              "Graph construction is never part of the timed region.", align="justify")
    doc.add_heading("4  Correctness verification", level=1)
    para(doc, "I verified the sequential BFS in three ways (log: logs/correctness_test_output.txt):", after=1)
    bullets(doc, [
        "**Hand-computed cases.** Twelve small graphs in tests/cases with expected distances worked out by hand: path (two start vertices), star, cycle, 3×3 grid, complete graph, binary tree, a disconnected graph, an isolated source, a single vertex, a graph with duplicate edges and a self-loop, and a graph with a long and a short route (distance must be 2, not 4).",
        "**Independent validator.** validate_bfs() checks that dist[s] = 0, that neighbouring vertices differ by at most one level, that reachable and unreachable vertices are never adjacent, and that every reached vertex has a neighbour one level closer. It does not reuse the BFS code.",
        "**Cross-checks.** More than 1,400 comparisons of sequential and parallel results on path, grid, random, R-MAT and disconnected graphs; error handling (bad source, bad edge) is also tested. All checks passed.",
    ])
    doc.add_heading("5  Baseline measurement methodology", level=1)
    para(doc, "The timed region is a single call of bfs_seq(), which includes allocating and initialising its dist and queue arrays. One warm-up run is discarded, then seven timed runs are recorded as separate rows of the raw CSV with the manual’s required columns. "
              "Execution time is summarised by the median, with standard deviation, CV, minimum and maximum kept. The machine and compiler are described in the integrated report (Table 3). "
              "The sequential time of each graph is the baseline in the definition speedup = sequential median / parallel median.", align="justify")
    doc.add_heading("6  Baseline results", level=1)
    rows = []
    for ds, lab in FAM:
        for n in sorted(D.Problem_Size.unique()):
            s = r(ds, n, 0)
            rows.append([lab, f"2^{int(round(__import__('math').log2(n)))}", f"{int(s.Edges_Undirected):,}", int(s.Levels), f"{s.Median*1e3:.3f}", f"{s.CV_percent:.0f}", f"{s.MTEPS:.0f}"])
    table(doc, ["Graph", "n", "Edges", "Levels", "Median time (ms)", "CV (%)", "MTEPS"], rows, widths=[1.4, 0.6, 1.0, 0.8, 1.2, 0.6, 0.7], size=8, caption="Table N1. Sequential BFS baseline (7 runs per row; data/derived/bfs_derived.csv).")
    para(doc, f"The time per edge is not constant. The largest random graph needs {ms('random_d16', NMAX):.0f} ms, but its throughput ({mt('random_d16', NMAX):.0f} MTEPS) is much lower than for the same family at 2^18 vertices ({mt('random_d16', 2**18):.0f} MTEPS). "
              "The path and the grid keep high and stable throughput (about 125–350 MTEPS) probably because their neighbours are close in memory, whereas the random and R-MAT graphs jump to random positions of the distance array. "
              "I did not measure cache events, so the link to cache misses is a likely explanation, not a proven one. Runs shorter than about a millisecond are noisy "
              f"(CV up to {D[D.Algorithm=='SEQ_BFS'].CV_percent.max():.0f}% on this shared virtual machine), so I use the medians and keep all runs.", align="justify")
    doc.add_heading("7  Limitations", level=1)
    para(doc, "The baseline was measured on one shared cloud machine; the graphs are synthetic; one start vertex per graph is used; and the queue-based algorithm is not the fastest possible sequential BFS (for example, a direction-optimizing sequential version could be faster on random graphs). "
              "All speedups in the report are relative to this specific baseline.", align="justify")
    doc.save(OUT / "Technical_Note_Student1.docx")


# =============================================================== NOTE 2
def build_note2():
    doc = new_doc(size=10.5, margins=0.9)
    para(doc, "Individual Technical Note — Student 2", bold=True, align="center", size=14, after=2)
    para(doc, "OpenMP parallel BFS, thread scaling and synchronization", align="center", size=11, after=2)
    para(doc, "CS4-S01 Parallel Breadth-First Search — BCSE412L Parallel Computing | [Student 2 name, Reg. No.] | Batch [ID]", align="center", size=9.5, after=6)
    doc.add_heading("1  My contribution", level=1)
    para(doc, "I implemented the level-synchronous parallel BFS in C++ with OpenMP (include/bfs_par.hpp, src/bfs_par_main.cpp), ran it with several thread counts, measured execution time, speedup, efficiency and traversal throughput, "
              "and analysed synchronization, parallel overhead and scalability. I used the graph code, start-vertex rule, timing convention and correctness checks prepared by Student 1 so that the two programs are directly comparable.", align="justify")
    doc.add_heading("2  Parallel design and synchronization", level=1)
    para(doc, "BFS is parallelized level by level. The frontier (the vertices at distance L) is shared among threads; the next frontier (distance L+1) is built while this happens. The whole traversal is inside one parallel region, so threads are created once, not once per level.", align="justify")
    bullets(doc, [
        "**Race on the visited flag.** Two threads may reach the same unvisited vertex v in the same level. The distance array is an array of std::atomic<int>. A thread first reads dist[v] (cheap); if it is −1, it executes compare_exchange from −1 to L+1. Exactly one thread succeeds and only that thread appends v to the next frontier, so there are no duplicates and no lost updates. No lock is needed.",
        "**Building the next frontier without contention.** Each thread appends to its own private buffer (aligned to cache lines to avoid false sharing). After a barrier one thread computes prefix sums of the buffer sizes; every thread then copies its buffer to its own disjoint slice of the next-frontier array, so these writes need no atomics.",
        "**Level separation.** OpenMP barriers (the implicit barrier of single constructs and an explicit barrier) guarantee that level L is completely expanded before level L+1 starts. This is what makes the distances equal to the true BFS distances. One thread swaps the frontier arrays and increments the level; the others read the new values after the barrier.",
        "**Scheduling.** The expand loop uses schedule(runtime), set to dynamic with chunk 64, because the work per frontier vertex depends on its degree (R-MAT hubs). The schedule can be changed with --schedule and --chunk; the tests cover static, dynamic and guided.",
    ])
    para(doc, "Correctness evidence: parallel distances equal sequential distances in all 588 timed runs, in the 12 hand-checked cases for thread counts 1, 2, 3, 4 and 8 and all three schedules, and in randomized cross-checks (more than 1,400 checks in total).", align="justify")
    doc.add_heading("3  Experiments and metrics", level=1)
    para(doc, f"I ran 1, 2 and 4 threads (the machine has {ENV['logical_cpus']} logical CPUs; threads were pinned with OMP_PROC_BIND=true, OMP_PLACES=cores) on four structures and four sizes plus a density sweep, with one warm-up and seven timed runs for each setting. "
              "Execution time is the median. Speedup = sequential median / parallel median (same graph, Student 1’s baseline); efficiency = speedup / threads; throughput = edges in the reached component / time (MTEPS). "
              "After each timed run I made one extra instrumented run that records, for every level, the expand time of each thread, giving the barrier wait (slowest thread minus average thread) and the time of the merge phase. These runs never contribute to Execution_Time.", align="justify")
    doc.add_heading("4  Results", level=1)
    rows = []
    for ds, lab in FAM:
        for n in (2 ** 16, NMAX):
            rows.append([lab, f"2^{int(round(__import__('math').log2(n)))}"] + [f"{sig(sp(ds, n, t))} / {sig(ef(ds, n, t))}" for t in (1, 2, 4)] + [f"{mt(ds, n, 4):.0f}"])
    table(doc, ["Graph", "n", "1 thread\nspeedup / eff.", "2 threads\nspeedup / eff.", "4 threads\nspeedup / eff.", "MTEPS (4T)"], rows, widths=[1.4, 0.6, 1.2, 1.2, 1.2, 0.9], size=8.5, caption="Table N2. Speedup and efficiency (medians of 7 runs; full table in data/derived/bfs_derived.csv).")
    figure_row(doc, [("fig2_speedup_vs_threads.png", f"Figure N1. Speedup versus threads for {NMAX:,} vertices."),
                     ("fig5_efficiency_vs_threads.png", f"Figure N2. Efficiency versus threads for {NMAX:,} vertices.")], width=3.0)
    para(doc, f"**Scalability across thread counts.** On random and R-MAT graphs, speedup grows with threads (to {f2(sp('random_d16', NMAX))} and {f2(sp('rmat_ef8', NMAX))} on four threads at 2^20 vertices) and efficiency stays near {f2(ef('random_d16', NMAX))}–{f2(ef('rmat_ef8', NMAX))}. "
              f"At 2^14 vertices the same graphs reach only {f2(sp('random_d16', NMIN))} and {f2(sp('rmat_ef8', NMIN))} (efficiency {f2(ef('random_d16', NMIN))} and {f2(ef('rmat_ef8', NMIN))}): the whole run lasts less than a millisecond, so thread start-up and barriers take a larger share. "
              f"On the grid the speedup stays below 1 ({f2(sp('grid', NMAX, 1))}, {f2(sp('grid', NMAX, 2))}, {f2(sp('grid', NMAX, 4))}), and on the path it falls with every added thread ({sig(sp('path', NMAX, 1))}, {sig(sp('path', NMAX, 2))}, {sig(sp('path', NMAX, 4))}).", align="justify")
    para(doc, f"**Throughput.** With four threads the random graph of 2^18 vertices reaches {f1(dmt(2, TMAX))} MTEPS at average degree 2 and {f1(dmt(64, TMAX))} MTEPS at degree 64 (Figure 3 of the report), so denser graphs make better use of the threads.", align="justify")
    doc.add_heading("5  Synchronization and overhead analysis", level=1)
    para(doc, f"Every level costs a fixed amount of synchronization, which does not depend on how much work the level contains. On the path (one vertex per level) the median time per level is {p_lev_us[1]:.2f} µs with one thread, {p_lev_us[2]:.2f} µs with two and {p_lev_us[4]:.2f} µs with four, "
              f"against {seq_level_ns:.1f} ns for the sequential program, so the parallel code is {1/sp('path', NMAX):.0f} times slower with four threads. "
              "The same fixed cost is small compared with the work of a level on random graphs, which contain tens of thousands of edge checks per level.", align="justify")
    rows = []
    for ds, lab in FAM:
        s = r(ds, NMAX, TMAX)
        rows.append([lab, int(s.Levels), f"{work_per_level[ds]:,.0f}", f"{100*s.Sync_Wait_Frac:.1f}", f"{100*s.Merge_Frac:.1f}"])
    table(doc, ["Graph (n = 2^20)", "Levels", "Edge checks per level", "Barrier wait (% of 4T time)", "Merge phase (% of 4T time)"], rows, widths=[1.5, 0.8, 1.4, 1.5, 1.5], size=8.5,
          caption="Table N3. Synchronization measurements with 4 threads (from instrumented runs; approximate).")
    para(doc, f"The barrier wait is largest, as a share of the run, on the grid ({100*SYNC4['grid'][0]:.0f}%) and the path ({100*SYNC4['path'][0]:.0f}%), and below {100*max(SYNC4['random_d16'][0], SYNC4['rmat_ef8'][0]):.1f}% on the random and R-MAT graphs at this size. "
              "A plausible reason (not tested separately) is that with schedule dynamic,64 a frontier of fewer than 64 vertices is taken by a single thread while the others wait; the path and grid have many such small frontiers. "
              "The merge phase is the dominant measured overhead on the path and grid because it runs once per level. These numbers explain part but not all of the lost time; loop start-up and the barrier’s own cost inside the expand phase were not separable.", align="justify")
    doc.add_heading("6  Limitations and what I would do next", level=1)
    para(doc, "Only up to four threads on a shared virtual machine could be tested, so saturation and NUMA effects are not visible; the CV of short runs is high; the schedule was fixed to dynamic,64; and there is no direction-optimizing or hybrid (sequential for small frontiers) variant. "
              "The next step I would try is to run small frontiers sequentially, which should remove most of the penalty on the path and grid, and to add a bottom-up step for the large frontiers of random and R-MAT graphs.", align="justify")
    doc.save(OUT / "Technical_Note_Student2.docx")


if __name__ == "__main__":
    build_report()
    build_note1()
    build_note2()
    print("done ->", OUT)
