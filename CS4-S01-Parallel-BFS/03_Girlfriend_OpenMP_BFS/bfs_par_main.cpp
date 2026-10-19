// bfs_par_main.cpp - Student 2: OpenMP parallel BFS benchmark.
//
// For each thread count: runs 'reps' timed (uninstrumented) executions of bfs_par()
// and, after each, one additional INSTRUMENTED execution used only to estimate
// synchronization wait and frontier-merge time (the instrumentation adds timer
// calls, so those runs are never used for Execution_Time).
// Every parallel result is compared with the sequential distances (untimed).
#include <cstdio>
#include <sstream>

#include "bench_common.hpp"
#include "bfs_par.hpp"
#include "bfs_seq.hpp"

static void usage() {
    std::printf(
        "Usage: bfs_par --graph FAMILY [graph options] [run options]\n%s"
        "Run options:\n"
        "  --threads LIST   comma separated thread counts, e.g. 1,2,4 (default 1,2,4)\n"
        "  --schedule S     static|dynamic|guided (default dynamic)   --chunk C (default 64)\n"
        "  --reps R         timed repetitions per thread count (default 7)   --warmup W (default 1)\n"
        "  --out FILE.csv   append raw rows to this CSV (default: print only)\n"
        "  --student-id ID  (default STUDENT2)   --batch-id ID (default BATCH_TBD)\n"
        "  --hardware STR   free-text hardware label stored in the CSV\n",
        kGraphOptionsHelp);
}

int main(int argc, char** argv) {
    try {
        Args a(argc, argv);
        if (a.has("help") || argc == 1) { usage(); return 0; }
        double tg = now_sec();
        GraphSpec s = make_graph(a);
        tg = now_sec() - tg;
        const int reps = (int)a.num("reps", 7), warm = (int)a.num("warmup", 1);
        const int chunk = (int)a.num("chunk", 64);
        const Sched sched = parse_sched(a.str("schedule", "dynamic"));
        if (reps < 1) throw std::runtime_error("--reps must be >= 1");

        std::vector<int> tlist;
        {
            std::stringstream ss(a.str("threads", "1,2,4"));
            std::string tok;
            while (std::getline(ss, tok, ',')) {
                int t = std::stoi(tok);
                if (t < 1) throw std::runtime_error("thread counts must be >= 1");
                tlist.push_back(t);
            }
        }
        std::printf("[bfs_par] dataset=%s n=%d undirected_edges=%lld source=%d schedule=%s,%d (graph build %.3fs, not timed)\n",
                    s.dataset.c_str(), s.g.n, (long long)s.g.undirected_edges(), s.source, sched_name(sched), chunk, tg);

        const std::vector<int> ref = bfs_seq(s.g, s.source);  // untimed reference
        const std::string bad = validate_bfs(s.g, s.source, ref);
        if (!bad.empty()) { std::fprintf(stderr, "ERROR: reference BFS invalid: %s\n", bad.c_str()); return 2; }
        const TraversalStats st = traversal_stats(s.g, ref);
        int failures = 0;

        for (int T : tlist) {
            for (int i = 0; i < warm; ++i) bfs_par(s.g, s.source, T, sched, chunk, false);
            for (int r = 1; r <= reps; ++r) {
                ParStats ps;
                double t0 = now_sec();
                std::vector<int> d = bfs_par(s.g, s.source, T, sched, chunk, false, &ps);
                double t = now_sec() - t0;
                bool ok = (d == ref);
                ParStats ips;
                std::vector<int> d2 = bfs_par(s.g, s.source, T, sched, chunk, true, &ips);  // instrumented run
                ok = ok && (d2 == ref);
                if (!ok) {
                    ++failures;
                    std::fprintf(stderr, "ERROR: parallel BFS (T=%d, run %d) differs from sequential distances!\n", T, r);
                }
                if (ps.threads_used != T)
                    std::fprintf(stderr, "WARNING: requested %d threads but OpenMP provided %d\n", T, ps.threads_used);

                CsvRow row;
                row.student_id = a.str("student-id", "STUDENT2");
                row.batch_id = a.str("batch-id", "BATCH_TBD");
                row.dataset = s.dataset; row.family = s.family;
                row.algorithm = "PAR_BFS_LEVELSYNC"; row.parallel_model = "OpenMP";
                row.hardware = a.str("hardware", "unspecified");
                row.resource_count = ps.threads_used; row.threads = ps.threads_used; row.run_id = r;
                row.exec_time = t;
                row.sync_time = fmt_g(ips.sync_wait);
                row.merge_time = fmt_g(ips.merge_time);
                // graph + atomic dist + out copy + 2 frontiers + per-thread buffers (upper bound ~ n total)
                row.memory_mb = (s.g.graph_bytes() + (size_t)s.g.n * 5 * sizeof(int)) / 1048576.0;
                row.vertices = s.g.n; row.edges = s.g.undirected_edges();
                row.avg_deg = s.g.avg_degree(); row.max_deg = s.g.max_degree();
                row.edges_traversed = st.edges_traversed; row.reached = st.reached; row.levels = st.levels;
                row.source = s.source; row.seed = s.seed; row.checksum = s.g.checksum();
                row.schedule = sched_name(sched); row.chunk = chunk;
                row.verified = ok ? 1 : 0;
                std::printf("  T=%d run %d: %.6f s  sync_wait=%.6f s merge=%.6f s  MTEPS=%.2f  %s\n", T, r, t,
                            ips.sync_wait, ips.merge_time, st.edges_traversed / t / 1e6, ok ? "verified" : "MISMATCH");
                if (a.has("out")) append_csv(a.str("out", ""), row);
            }
        }
        return failures ? 3 : 0;
    } catch (const std::exception& e) {
        std::fprintf(stderr, "ERROR: %s\n(run with --help for usage)\n", e.what());
        return 1;
    }
}
