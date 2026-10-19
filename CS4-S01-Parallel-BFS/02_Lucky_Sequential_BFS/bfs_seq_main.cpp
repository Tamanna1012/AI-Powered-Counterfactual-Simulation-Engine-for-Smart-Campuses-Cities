// bfs_seq_main.cpp - Student 1: sequential BFS baseline benchmark.
//
// Builds a graph (NOT timed), then times bfs_seq() several times and appends one
// raw-CSV row per repetition. Timed region = one call to bfs_seq(), which includes
// allocating/initialising its own dist[] and queue[] arrays but excludes graph
// generation, CSR construction, validation and statistics.
#include <cstdio>
#include <iostream>

#include "bench_common.hpp"
#include "bfs_seq.hpp"

static void usage() {
    std::printf(
        "Usage: bfs_seq --graph FAMILY [graph options] [run options]\n%s"
        "Run options:\n"
        "  --reps R         timed repetitions (default 7)\n"
        "  --warmup W       untimed warm-up runs (default 1)\n"
        "  --out FILE.csv   append raw rows to this CSV (default: print only)\n"
        "  --student-id ID  (default STUDENT1)   --batch-id ID (default BATCH_TBD)\n"
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
        if (reps < 1) throw std::runtime_error("--reps must be >= 1");

        std::printf("[bfs_seq] dataset=%s n=%d undirected_edges=%lld source=%d (graph build %.3fs, not timed)\n",
                    s.dataset.c_str(), s.g.n, (long long)s.g.undirected_edges(), s.source, tg);

        std::vector<int> dist;
        for (int i = 0; i < warm; ++i) dist = bfs_seq(s.g, s.source);

        std::string bad = validate_bfs(s.g, s.source, bfs_seq(s.g, s.source));
        if (!bad.empty()) { std::fprintf(stderr, "ERROR: sequential BFS failed validation: %s\n", bad.c_str()); return 2; }

        for (int r = 1; r <= reps; ++r) {
            double t0 = now_sec();
            dist = bfs_seq(s.g, s.source);
            double t = now_sec() - t0;
            TraversalStats st = traversal_stats(s.g, dist);

            CsvRow row;
            row.student_id = a.str("student-id", "STUDENT1");
            row.batch_id = a.str("batch-id", "BATCH_TBD");
            row.dataset = s.dataset; row.family = s.family;
            row.algorithm = "SEQ_BFS"; row.parallel_model = "None";
            row.hardware = a.str("hardware", "unspecified");
            row.resource_count = 1; row.threads = 1; row.run_id = r;
            row.exec_time = t;
            row.memory_mb = (s.g.graph_bytes() + (size_t)s.g.n * 2 * sizeof(int)) / 1048576.0;  // graph + dist + queue
            row.vertices = s.g.n; row.edges = s.g.undirected_edges();
            row.avg_deg = s.g.avg_degree(); row.max_deg = s.g.max_degree();
            row.edges_traversed = st.edges_traversed; row.reached = st.reached; row.levels = st.levels;
            row.source = s.source; row.seed = s.seed; row.checksum = s.g.checksum();
            row.verified = 1;  // validate_bfs passed above
            std::printf("  run %d: %.6f s  levels=%d reached=%d  MTEPS=%.2f\n", r, t, st.levels, st.reached,
                        st.edges_traversed / t / 1e6);
            if (a.has("out")) append_csv(a.str("out", ""), row);
        }
        return 0;
    } catch (const std::exception& e) {
        std::fprintf(stderr, "ERROR: %s\n(run with --help for usage)\n", e.what());
        return 1;
    }
}
