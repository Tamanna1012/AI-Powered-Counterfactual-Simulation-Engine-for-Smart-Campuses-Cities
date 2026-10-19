// bfs_par.hpp - level-synchronous parallel BFS with OpenMP (Student 2).
//
// Algorithm (top-down, one persistent parallel region for the whole traversal):
//   per level:
//     1. EXPAND   : the threads share the current frontier with an OpenMP
//                   worksharing loop. For each neighbour v of a frontier vertex,
//                   the thread tries to "claim" v with an atomic compare-and-swap
//                   dist[v]: -1 -> level+1. Exactly one thread wins per vertex, so
//                   no vertex is ever added to the next frontier twice and no
//                   data race on dist exists. Winners append v to a PRIVATE
//                   per-thread buffer (no locking on the hot path).
//     2. barrier  : all expansions finish before the next frontier is assembled.
//     3. MERGE    : one thread computes prefix sums of the buffer sizes; then
//                   every thread copies its buffer into its own disjoint slice
//                   of the next-frontier array (no atomics needed).
//     4. barrier, swap frontiers, level++ (one thread), barrier.
//   The loop ends when the next frontier is empty.
//
// Correctness argument: level L+1 vertices are discovered only while expanding
// level L, and the barrier guarantees level L is fully expanded before level
// L+1 starts. The CAS makes the "visited" test-and-set atomic, so each vertex
// gets the distance of the first (= shortest) level that reaches it.
#pragma once

#include <omp.h>

#include <atomic>
#include <memory>
#include <stdexcept>
#include <string>
#include <vector>

#include "graph.hpp"

enum class Sched { Static, Dynamic, Guided };

inline Sched parse_sched(const std::string& s) {
    if (s == "static") return Sched::Static;
    if (s == "dynamic") return Sched::Dynamic;
    if (s == "guided") return Sched::Guided;
    throw std::runtime_error("unknown schedule '" + s + "' (use static|dynamic|guided)");
}
inline const char* sched_name(Sched s) {
    return s == Sched::Static ? "static" : s == Sched::Dynamic ? "dynamic" : "guided";
}

struct ParStats {
    int threads_used = 0;
    // Only filled when instrument == true (separate, untimed-for-speedup runs):
    double sync_wait = 0;    // sum over levels of (slowest thread's expand time - mean expand time):
                             //   average time a thread sits idle at the end-of-level barrier
    double merge_time = 0;   // wall time spent in the frontier-merge phase (prefix sum + copy + swap)
    int64_t level_count = 0; // number of levels expanded
};

namespace detail {
struct alignas(64) Slot {  // one per thread; alignment avoids false sharing
    std::vector<int> buf;  // private next-frontier buffer
    int64_t cnt = 0;
    double work = 0;       // expand-phase time of the current level (instrumented runs)
    double merge = 0;      // accumulated merge-phase time (thread 0 only)
};
}  // namespace detail

inline std::vector<int> bfs_par(const CSRGraph& g, int src, int threads, Sched sched, int chunk,
                                bool instrument, ParStats* stats = nullptr) {
    if (src < 0 || src >= g.n) throw std::runtime_error("bfs_par: source out of range");
    if (threads < 1) throw std::runtime_error("bfs_par: threads must be >= 1");
    if (chunk < 1) chunk = 1;

    const int n = g.n;
    std::unique_ptr<std::atomic<int>[]> dist(new std::atomic<int>[n]);
    std::vector<int> out(n);
    std::vector<int> fa(n), fb(n);
    int* cur = fa.data();
    int* nxt = fb.data();
    std::vector<detail::Slot> slots(threads);
    std::vector<int64_t> offs(threads + 1, 0);

    int64_t fsize = 1;     // size of the current frontier (written only inside 'single')
    int64_t next_size = 0;
    int level = 0;         // distance of the current frontier
    double sync_acc = 0;   // written only inside 'single'
    int used = 0;

    omp_set_dynamic(0);
    omp_set_schedule(sched == Sched::Static ? omp_sched_static
                     : sched == Sched::Dynamic ? omp_sched_dynamic : omp_sched_guided,
                     chunk);

    const int64_t* off = g.off.data();
    const int* adj = g.adj.data();

#pragma omp parallel num_threads(threads)
    {
        const int tid = omp_get_thread_num();
        const int nt = omp_get_num_threads();
        detail::Slot& S = slots[tid];
        S.buf.clear();
        S.buf.reserve(1024);
        S.merge = 0;
#pragma omp single
        used = nt;  // implicit barrier

#pragma omp for schedule(static)
        for (int v = 0; v < n; ++v) dist[v].store(-1, std::memory_order_relaxed);

#pragma omp single
        {
            dist[src].store(0, std::memory_order_relaxed);
            cur[0] = src;
        }

        while (true) {
            S.buf.clear();
            const int64_t fs = fsize;
            const int nextlevel = level + 1;
            const double t0 = instrument ? omp_get_wtime() : 0.0;

            // 1. EXPAND (nowait: we want to time each thread's own work before the barrier)
#pragma omp for schedule(runtime) nowait
            for (int64_t i = 0; i < fs; ++i) {
                const int u = cur[i];
                for (int64_t e = off[u]; e < off[u + 1]; ++e) {
                    const int v = adj[e];
                    if (dist[v].load(std::memory_order_relaxed) == -1) {  // cheap pre-check
                        int expected = -1;
                        if (dist[v].compare_exchange_strong(expected, nextlevel, std::memory_order_relaxed))
                            S.buf.push_back(v);  // we won the race for v
                    }
                }
            }
            S.cnt = (int64_t)S.buf.size();
            if (instrument) S.work = omp_get_wtime() - t0;

            // 2. barrier: whole level expanded
#pragma omp barrier
            const double tm0 = (instrument && tid == 0) ? omp_get_wtime() : 0.0;

            // 3. MERGE: prefix sums (one thread) ...
#pragma omp single
            {
                offs[0] = 0;
                for (int t = 0; t < nt; ++t) offs[t + 1] = offs[t] + slots[t].cnt;
                next_size = offs[nt];
                if (instrument) {
                    double mx = 0, sum = 0;
                    for (int t = 0; t < nt; ++t) {
                        mx = std::max(mx, slots[t].work);
                        sum += slots[t].work;
                    }
                    sync_acc += mx - sum / nt;
                }
            }  // implicit barrier
            // ... then every thread copies into its own disjoint slice
            std::copy(S.buf.begin(), S.buf.end(), nxt + offs[tid]);
#pragma omp barrier
#pragma omp single
            {
                std::swap(cur, nxt);
                fsize = next_size;
                level = nextlevel;
            }  // implicit barrier: everyone sees the new fsize/level
            if (instrument && tid == 0) S.merge += omp_get_wtime() - tm0;
            if (fsize == 0) break;
        }

#pragma omp for schedule(static)
        for (int v = 0; v < n; ++v) out[v] = dist[v].load(std::memory_order_relaxed);
    }

    if (stats) {
        stats->threads_used = used;
        stats->level_count = level;
        if (instrument) {
            stats->sync_wait = sync_acc;
            stats->merge_time = slots[0].merge;
        }
    }
    return out;
}
