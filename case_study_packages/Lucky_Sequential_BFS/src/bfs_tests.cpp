// bfs_tests.cpp - correctness tests for sequential and parallel BFS.
//
// Part 1: hand-written graphs in tests/cases/*.graph with expected distances
//         (tests/cases/*.expected, written by hand, NOT produced by the program).
// Part 2: randomized cross-check: parallel BFS (several thread counts and
//         schedules) must equal sequential BFS, and both must pass the
//         independent validate_bfs() check, on path/grid/random/rmat graphs and
//         on a disconnected graph. Repeated runs catch non-deterministic races.
//
// Usage: bfs_tests <path-to-tests/cases>
#include <dirent.h>

#include <cstdio>
#include <fstream>

#include "bfs_par.hpp"
#include "bfs_seq.hpp"

static int g_pass = 0, g_fail = 0;
static void check(bool ok, const std::string& what) {
    if (ok) ++g_pass;
    else { ++g_fail; std::printf("  FAIL: %s\n", what.c_str()); }
}

// expected file: first line "source <s>", then one distance per line (-1 = unreachable)
static bool read_expected(const std::string& path, int& src, std::vector<int>& exp) {
    std::ifstream in(path);
    std::string key;
    if (!(in >> key >> src) || key != "source") return false;
    int d;
    while (in >> d) exp.push_back(d);
    return true;
}

static std::string show(const std::vector<int>& v) {
    std::string s;
    for (int x : v) s += std::to_string(x) + " ";
    return s;
}

static void part1(const std::string& dir) {
    std::vector<std::string> names;
    if (DIR* d = opendir(dir.c_str())) {
        while (dirent* e = readdir(d)) {
            std::string f = e->d_name;
            if (f.size() > 6 && f.substr(f.size() - 6) == ".graph") names.push_back(f.substr(0, f.size() - 6));
        }
        closedir(d);
    }
    std::sort(names.begin(), names.end());
    check(!names.empty(), "no .graph files found in " + dir);
    for (auto& nm : names) {
        CSRGraph g = load_graph_file(dir + "/" + nm + ".graph");
        int src = 0;
        std::vector<int> exp;
        if (!read_expected(dir + "/" + nm + ".expected", src, exp)) { check(false, nm + ": missing/bad .expected"); continue; }
        std::vector<int> s = bfs_seq(g, src);
        check(s == exp, nm + ": sequential != expected  got [" + show(s) + "] want [" + show(exp) + "]");
        check(validate_bfs(g, src, s).empty(), nm + ": validator rejects sequential result");
        for (int T : {1, 2, 3, 4, 8})
            for (Sched sc : {Sched::Static, Sched::Dynamic, Sched::Guided}) {
                std::vector<int> p = bfs_par(g, src, T, sc, 1, false);
                check(p == exp, nm + ": parallel T=" + std::to_string(T) + " " + sched_name(sc) + " != expected  got [" + show(p) + "]");
            }
        std::printf("  case %-14s n=%-3d source=%d ok\n", nm.c_str(), g.n, src);
    }
}

static void cross_check(const std::string& label, const CSRGraph& g, int src, int repeats) {
    std::vector<int> s = bfs_seq(g, src);
    std::string v = validate_bfs(g, src, s);
    check(v.empty(), label + ": sequential invalid: " + v);
    for (int T : {1, 2, 4, 7})
        for (Sched sc : {Sched::Static, Sched::Dynamic, Sched::Guided})
            for (int chunk : {1, 64})
                for (int r = 0; r < repeats; ++r) {
                    bool instr = (r % 2 == 1);
                    std::vector<int> p = bfs_par(g, src, T, sc, chunk, instr);
                    if (p != s) { check(false, label + ": parallel result differs (T=" + std::to_string(T) + ", " + sched_name(sc) + ")"); return; }
                    ++g_pass;
                }
    std::printf("  %-28s n=%-7d edges=%-8lld ok\n", label.c_str(), g.n, (long long)g.undirected_edges());
}

static void part2() {
    cross_check("path n=1000", gen_path(1000), 0, 3);
    cross_check("path n=1000 src=middle", gen_path(1000), 500, 3);
    cross_check("grid 40x40", gen_grid(40), 0, 3);
    cross_check("grid 40x40 src=center", gen_grid(40), 40 * 20 + 20, 3);
    for (uint64_t seed : {1ULL, 2ULL, 3ULL}) {
        CSRGraph r = gen_random(5000, 6.0, seed);
        cross_check("random d6 seed " + std::to_string(seed), r, default_source(r, "random"), 3);
        cross_check("random d6 src=0 (maybe tiny comp.)", r, 0, 2);
        CSRGraph m = gen_rmat(4096, 8, seed);
        cross_check("rmat ef8 seed " + std::to_string(seed), m, default_source(m, "rmat"), 3);
    }
    // sparse random graph with many components: unreachable vertices must stay -1
    CSRGraph sp = gen_random(4000, 0.8, 7);
    cross_check("random d0.8 (disconnected)", sp, 0, 3);
    std::vector<int> d = bfs_seq(sp, 0);
    int unreach = 0;
    for (int x : d) unreach += (x < 0);
    check(unreach > 0, "disconnected random graph should contain unreachable vertices");
    // stress: many repeats on one mid-size graph to expose rare races
    CSRGraph big = gen_random(60000, 10.0, 99);
    cross_check("stress random n=60000", big, default_source(big, "random"), 10);
    // generator determinism
    check(gen_random(2000, 5, 42).checksum() == gen_random(2000, 5, 42).checksum(), "random generator not deterministic");
    check(gen_rmat(1024, 8, 42).checksum() == gen_rmat(1024, 8, 42).checksum(), "rmat generator not deterministic");
    // error handling
    bool threw = false;
    try { bfs_seq(gen_path(5), 9); } catch (const std::exception&) { threw = true; }
    check(threw, "bfs_seq should throw on out-of-range source");
    threw = false;
    try { bfs_par(gen_path(5), -1, 2, Sched::Static, 1, false); } catch (const std::exception&) { threw = true; }
    check(threw, "bfs_par should throw on out-of-range source");
    threw = false;
    try { build_csr(3, {{0, 5}}); } catch (const std::exception&) { threw = true; }
    check(threw, "build_csr should throw on out-of-range edge");
}

int main(int argc, char** argv) {
    try {
        if (argc < 2) { std::fprintf(stderr, "Usage: bfs_tests <path-to-tests/cases>\n"); return 1; }
        std::printf("Part 1: hand-written cases with expected distances\n");
        part1(argv[1]);
        std::printf("Part 2: randomized sequential-vs-parallel cross-checks\n");
        part2();
        std::printf("\n%d checks passed, %d failed\n", g_pass, g_fail);
        return g_fail ? 1 : 0;
    } catch (const std::exception& e) {
        std::fprintf(stderr, "ERROR: %s\n", e.what());
        return 1;
    }
}
