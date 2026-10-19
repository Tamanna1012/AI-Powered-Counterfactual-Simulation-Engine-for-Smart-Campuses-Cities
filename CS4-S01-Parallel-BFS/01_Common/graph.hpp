// graph.hpp - shared graph representation and reproducible graph generators.
//
// Used by BOTH the sequential (Student 1) and parallel (Student 2) programs so
// that the two implementations always see exactly the same graph.
//
// Representation: undirected graph in CSR (compressed sparse row) form, which
// is a compact adjacency list:
//     neighbours of vertex u  =  adj[ off[u] .. off[u+1]-1 ]
// Self-loops and duplicate edges are removed; each undirected edge {u,v} is
// stored twice (u->v and v->u). Neighbour lists are sorted.
#pragma once

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <string>
#include <utility>
#include <vector>

struct CSRGraph {
    int n = 0;                    // number of vertices
    std::vector<int64_t> off;     // size n+1
    std::vector<int> adj;         // size = number of directed entries (2 * undirected edges)

    int64_t directed_entries() const { return (int64_t)adj.size(); }
    int64_t undirected_edges() const { return (int64_t)adj.size() / 2; }
    int degree(int u) const { return (int)(off[u + 1] - off[u]); }
    double avg_degree() const { return n ? (double)adj.size() / n : 0.0; }
    int max_degree() const {
        int m = 0;
        for (int u = 0; u < n; ++u) m = std::max(m, degree(u));
        return m;
    }
    // Estimated memory (bytes) of the graph itself.
    size_t graph_bytes() const { return off.size() * sizeof(int64_t) + adj.size() * sizeof(int); }

    // FNV-1a hash of the whole structure. Printed by both programs so that we
    // can prove the sequential and parallel runs used an identical graph.
    uint64_t checksum() const {
        uint64_t h = 1469598103934665603ULL;
        auto mix = [&](uint64_t x) { h ^= x; h *= 1099511628211ULL; };
        mix((uint64_t)n);
        for (int64_t o : off) mix((uint64_t)o);
        for (int v : adj) mix((uint64_t)v);
        return h;
    }
};

// Small, portable, deterministic RNG (identical output on Windows/Linux/any
// compiler, unlike std::uniform_int_distribution).
struct SplitMix64 {
    uint64_t s;
    explicit SplitMix64(uint64_t seed) : s(seed) {}
    uint64_t next() {
        uint64_t z = (s += 0x9E3779B97F4A7C15ULL);
        z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9ULL;
        z = (z ^ (z >> 27)) * 0x94D049BB133111EBULL;
        return z ^ (z >> 31);
    }
    uint64_t below(uint64_t k) { return next() % k; }
    double unit() { return (next() >> 11) * (1.0 / 9007199254740992.0); }
};

// Build a CSR graph from an undirected edge list. Removes self loops and
// duplicates. Throws std::runtime_error on an out-of-range endpoint.
inline CSRGraph build_csr(int n, const std::vector<std::pair<int, int>>& edges) {
    if (n < 0) throw std::runtime_error("build_csr: negative vertex count");
    std::vector<int64_t> cnt(n + 1, 0);
    for (auto& e : edges) {
        if (e.first < 0 || e.first >= n || e.second < 0 || e.second >= n)
            throw std::runtime_error("edge endpoint out of range [0," + std::to_string(n) + "): " +
                                     std::to_string(e.first) + " " + std::to_string(e.second));
        if (e.first == e.second) continue;  // drop self-loop
        ++cnt[e.first];
        ++cnt[e.second];
    }
    std::vector<int64_t> pos(n + 1, 0);
    for (int u = 0; u < n; ++u) pos[u + 1] = pos[u] + cnt[u];
    std::vector<int> tmp(pos[n]);
    std::vector<int64_t> fill(pos.begin(), pos.end() - 1);
    for (auto& e : edges) {
        if (e.first == e.second) continue;
        tmp[fill[e.first]++] = e.second;
        tmp[fill[e.second]++] = e.first;
    }
    // sort + unique each neighbour list, compacting into the final arrays
    CSRGraph g;
    g.n = n;
    g.off.assign(n + 1, 0);
    g.adj.reserve(tmp.size());
    for (int u = 0; u < n; ++u) {
        auto b = tmp.begin() + pos[u], e = tmp.begin() + pos[u + 1];
        std::sort(b, e);
        e = std::unique(b, e);
        g.adj.insert(g.adj.end(), b, e);
        g.off[u + 1] = (int64_t)g.adj.size();
    }
    g.adj.shrink_to_fit();
    return g;
}

// ---- generators ------------------------------------------------------------

// Path 0-1-2-...-(n-1): maximum depth, frontier size 1 (worst case for parallelism).
inline CSRGraph gen_path(int n) {
    std::vector<std::pair<int, int>> e;
    for (int i = 0; i + 1 < n; ++i) e.push_back({i, i + 1});
    return build_csr(n, e);
}

// side x side 4-neighbour grid (n = side*side): moderate depth (2*side-2), frontier ~ side.
inline CSRGraph gen_grid(int side) {
    std::vector<std::pair<int, int>> e;
    auto id = [&](int r, int c) { return r * side + c; };
    for (int r = 0; r < side; ++r)
        for (int c = 0; c < side; ++c) {
            if (c + 1 < side) e.push_back({id(r, c), id(r, c + 1)});
            if (r + 1 < side) e.push_back({id(r, c), id(r + 1, c)});
        }
    return build_csr(side * side, e);
}

// Uniform random sparse graph (Erdos-Renyi G(n,m) style): m = n*avg_deg/2 random
// endpoint pairs (a few are lost to self-loops/duplicates). Low diameter, wide frontiers.
inline CSRGraph gen_random(int n, double avg_deg, uint64_t seed) {
    SplitMix64 rng(seed);
    int64_t m = (int64_t)((double)n * avg_deg / 2.0);
    std::vector<std::pair<int, int>> e;
    e.reserve(m);
    for (int64_t i = 0; i < m; ++i) e.push_back({(int)rng.below(n), (int)rng.below(n)});
    return build_csr(n, e);
}

// R-MAT / Kronecker-style skewed graph (Graph500-like parameters a=.57,b=.19,c=.19,d=.05),
// n must be a power of two. Produces a heavy-tailed degree distribution (hubs).
// Vertex labels are randomly permuted so hubs are not artificially clustered at low ids.
inline CSRGraph gen_rmat(int n, int edge_factor, uint64_t seed) {
    int scale = 0;
    while ((1 << scale) < n) ++scale;
    if ((1 << scale) != n) throw std::runtime_error("rmat: n must be a power of two");
    SplitMix64 rng(seed);
    const double a = 0.57, b = 0.19, c = 0.19;
    int64_t m = (int64_t)n * edge_factor;
    std::vector<int> perm(n);
    for (int i = 0; i < n; ++i) perm[i] = i;
    for (int i = n - 1; i > 0; --i) std::swap(perm[i], perm[rng.below((uint64_t)i + 1)]);
    std::vector<std::pair<int, int>> e;
    e.reserve(m);
    for (int64_t i = 0; i < m; ++i) {
        int u = 0, v = 0;
        for (int bit = 0; bit < scale; ++bit) {
            double r = rng.unit();
            int ub = 0, vb = 0;
            if (r < a) { ub = 0; vb = 0; }
            else if (r < a + b) { ub = 0; vb = 1; }
            else if (r < a + b + c) { ub = 1; vb = 0; }
            else { ub = 1; vb = 1; }
            u = (u << 1) | ub;
            v = (v << 1) | vb;
        }
        e.push_back({perm[u], perm[v]});
    }
    return build_csr(n, e);
}

// Text file format (used by the correctness tests; vertices are 0-based):
//     # comment lines allowed
//     <n> <m>
//     u v        (m lines; undirected edge)
inline CSRGraph load_graph_file(const std::string& path) {
    std::ifstream in(path);
    if (!in) throw std::runtime_error("cannot open graph file: " + path);
    std::string line;
    int n = -1;
    int64_t m = -1;
    std::vector<std::pair<int, int>> e;
    while (std::getline(in, line)) {
        if (line.empty() || line[0] == '#') continue;
        std::istringstream ss(line);
        if (n < 0) {
            if (!(ss >> n >> m)) throw std::runtime_error("bad header (expected '<n> <m>') in " + path);
            continue;
        }
        int u, v;
        if (!(ss >> u >> v)) throw std::runtime_error("bad edge line '" + line + "' in " + path);
        e.push_back({u, v});
    }
    if (n < 0) throw std::runtime_error("empty graph file: " + path);
    if ((int64_t)e.size() != m)
        throw std::runtime_error("header says " + std::to_string(m) + " edges but file has " +
                                 std::to_string(e.size()) + ": " + path);
    return build_csr(n, e);
}

// Default start vertex rule shared by both programs (documented in README):
//   path / grid : vertex 0 (an end / corner, i.e. the worst case for depth)
//   random/rmat : lowest-index vertex of maximum degree (guaranteed to be in the
//                 giant component, so every run traverses a substantial graph)
inline int default_source(const CSRGraph& g, const std::string& family) {
    if (family == "path" || family == "grid" || family == "file") return 0;
    int best = 0;
    for (int u = 1; u < g.n; ++u)
        if (g.degree(u) > g.degree(best)) best = u;
    return best;
}
