// bfs_seq.hpp - sequential baseline BFS (Student 1) + independent validator.
#pragma once

#include <stdexcept>
#include <string>
#include <vector>

#include "graph.hpp"

// Classic queue-based BFS. Returns dist[v] = number of edges on a shortest path
// from src to v, or -1 if v is unreachable. Uses a flat array as the FIFO queue
// (each vertex is enqueued at most once, so n slots are enough).
inline std::vector<int> bfs_seq(const CSRGraph& g, int src) {
    if (src < 0 || src >= g.n) throw std::runtime_error("bfs_seq: source out of range");
    std::vector<int> dist(g.n, -1);
    std::vector<int> queue(g.n);
    int head = 0, tail = 0;
    dist[src] = 0;
    queue[tail++] = src;
    while (head < tail) {
        int u = queue[head++];
        int du = dist[u] + 1;
        for (int64_t e = g.off[u]; e < g.off[u + 1]; ++e) {
            int v = g.adj[e];
            if (dist[v] == -1) {
                dist[v] = du;
                queue[tail++] = v;
            }
        }
    }
    return dist;
}

// Independent correctness check that does NOT rely on any BFS implementation.
// A distance array is a valid BFS result iff
//   (1) dist[src] == 0
//   (2) for every edge {u,v}: either both unreachable, or both reachable with |d(u)-d(v)| <= 1
//   (3) every reachable v != src has a neighbour u with dist[u] == dist[v]-1
// Returns an empty string if valid, otherwise a description of the first violation.
inline std::string validate_bfs(const CSRGraph& g, int src, const std::vector<int>& dist) {
    if ((int)dist.size() != g.n) return "distance array has wrong length";
    if (dist[src] != 0) return "dist[source] is not 0";
    for (int u = 0; u < g.n; ++u) {
        bool has_parent = (u == src);
        for (int64_t e = g.off[u]; e < g.off[u + 1]; ++e) {
            int v = g.adj[e];
            if ((dist[u] < 0) != (dist[v] < 0))
                return "edge " + std::to_string(u) + "-" + std::to_string(v) + " joins reachable and unreachable vertex";
            if (dist[u] >= 0) {
                int diff = dist[u] - dist[v];
                if (diff > 1 || diff < -1)
                    return "edge " + std::to_string(u) + "-" + std::to_string(v) + " has distance gap > 1";
                if (dist[v] == dist[u] - 1) has_parent = true;
            }
        }
        if (dist[u] > 0 && !has_parent) return "vertex " + std::to_string(u) + " has no parent one level up";
        if (dist[u] < -1 || (dist[u] == 0 && u != src)) return "vertex " + std::to_string(u) + " has invalid distance";
    }
    return "";
}

// Statistics derived from a distance array (outside the timed region).
struct TraversalStats {
    int reached = 0;            // vertices reached (including source)
    int levels = 0;             // max distance + 1 = number of non-empty BFS levels
    int64_t edges_traversed = 0;  // undirected edges inside the reached component
                                  //   = (sum of degrees of reached vertices) / 2   [Graph500 convention]
};
inline TraversalStats traversal_stats(const CSRGraph& g, const std::vector<int>& dist) {
    TraversalStats s;
    int64_t deg_sum = 0;
    for (int u = 0; u < g.n; ++u)
        if (dist[u] >= 0) {
            ++s.reached;
            deg_sum += g.degree(u);
            if (dist[u] + 1 > s.levels) s.levels = dist[u] + 1;
        }
    s.edges_traversed = deg_sum / 2;
    return s;
}
