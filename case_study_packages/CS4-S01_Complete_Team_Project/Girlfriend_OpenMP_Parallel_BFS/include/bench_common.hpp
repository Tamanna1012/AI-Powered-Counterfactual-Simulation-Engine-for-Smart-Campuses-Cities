// bench_common.hpp - argument parsing, graph construction and CSV output shared by
// bfs_seq_main.cpp and bfs_par_main.cpp so both write the same raw-CSV schema.
#pragma once

#include <chrono>
#include <cstdio>
#include <cstdlib>
#include <fstream>
#include <map>
#include <sstream>
#include <string>
#include <vector>

#include "graph.hpp"

inline double now_sec() {
    using clk = std::chrono::steady_clock;
    return std::chrono::duration<double>(clk::now().time_since_epoch()).count();
}

struct Args {
    std::map<std::string, std::string> kv;
    Args(int argc, char** argv) {
        for (int i = 1; i < argc; ++i) {
            std::string a = argv[i];
            if (a.rfind("--", 0) != 0) throw std::runtime_error("unexpected argument '" + a + "' (options start with --)");
            if (a == "--help") { kv["help"] = "1"; continue; }
            if (i + 1 >= argc) throw std::runtime_error("option " + a + " needs a value");
            kv[a.substr(2)] = argv[++i];
        }
    }
    bool has(const std::string& k) const { return kv.count(k) > 0; }
    std::string str(const std::string& k, const std::string& d) const { auto it = kv.find(k); return it == kv.end() ? d : it->second; }
    long long num(const std::string& k, long long d) const {
        auto it = kv.find(k);
        if (it == kv.end()) return d;
        try { return std::stoll(it->second); } catch (...) { throw std::runtime_error("option --" + k + " expects an integer, got '" + it->second + "'"); }
    }
    double real(const std::string& k, double d) const {
        auto it = kv.find(k);
        if (it == kv.end()) return d;
        try { return std::stod(it->second); } catch (...) { throw std::runtime_error("option --" + k + " expects a number, got '" + it->second + "'"); }
    }
};

struct GraphSpec {
    std::string family;   // path | grid | random | rmat | file
    std::string dataset;  // name written to CSV, e.g. random_d16
    int n = 0;
    uint64_t seed = 12345;
    CSRGraph g;
    int source = 0;
};

inline const char* kGraphOptionsHelp =
    "  --graph path|grid|random|rmat|file   graph family (required)\n"
    "  --n N            number of vertices (grid: rounded to a perfect square; rmat: power of two)\n"
    "  --deg D          random: average degree (default 16)\n"
    "  --edge-factor F  rmat: generated edges per vertex (default 8)\n"
    "  --seed S         RNG seed (default 12345)\n"
    "  --file PATH      graph file when --graph file\n"
    "  --source auto|K  start vertex (default auto: see README)\n";

inline GraphSpec make_graph(const Args& a) {
    GraphSpec s;
    s.family = a.str("graph", "");
    if (s.family.empty()) throw std::runtime_error("missing --graph (path|grid|random|rmat|file)");
    s.seed = (uint64_t)a.num("seed", 12345);
    long long n = a.num("n", 0);
    if (s.family == "file") {
        std::string f = a.str("file", "");
        if (f.empty()) throw std::runtime_error("--graph file needs --file PATH");
        s.g = load_graph_file(f);
        s.dataset = "file";
    } else {
        if (n < 2 || n > 200000000) throw std::runtime_error("--n must be between 2 and 200000000");
        if (s.family == "path") {
            s.g = gen_path((int)n);
            s.dataset = "path";
        } else if (s.family == "grid") {
            int side = (int)std::llround(std::sqrt((double)n));
            s.g = gen_grid(side);
            s.dataset = "grid";
        } else if (s.family == "random") {
            double d = a.real("deg", 16);
            s.g = gen_random((int)n, d, s.seed);
            std::ostringstream os;
            os << "random_d" << (long long)d;
            s.dataset = os.str();
        } else if (s.family == "rmat") {
            int ef = (int)a.num("edge-factor", 8);
            s.g = gen_rmat((int)n, ef, s.seed);
            s.dataset = "rmat_ef" + std::to_string(ef);
        } else {
            throw std::runtime_error("unknown --graph '" + s.family + "' (path|grid|random|rmat|file)");
        }
    }
    s.n = s.g.n;
    std::string src = a.str("source", "auto");
    s.source = (src == "auto") ? default_source(s.g, s.family) : (int)std::stoll(src);
    if (s.source < 0 || s.source >= s.g.n) throw std::runtime_error("--source out of range");
    return s;
}

// Raw CSV: required columns from the course manual first (Speedup/Efficiency are
// left EMPTY here on purpose: they are derived from raw times by scripts/analyze.py),
// followed by extra columns that make the data self-describing.
inline const char* kCsvHeader =
    "Student_ID,Batch_ID,Workload,Dataset,Problem_Size,Algorithm,Parallel_Model,Hardware,"
    "Resource_Count,Threads,Execution_Time,Speedup,Efficiency,Communication_Time,"
    "Synchronization_Time,Scheduling_Time,Memory_Use,Energy_if_available,Run_ID,"
    "Execution_Time_Unit,Memory_Use_Unit,Graph_Family,Vertices,Edges_Undirected,Avg_Degree,Max_Degree,"
    "Edges_Traversed,Levels,Reached_Vertices,Source,Seed,Schedule,Chunk,Graph_Checksum,Verified,Frontier_Merge_Time";

struct CsvRow {
    std::string student_id, batch_id, dataset, algorithm, parallel_model, hardware;
    int resource_count = 1, threads = 1, run_id = 0;
    double exec_time = 0;
    std::string sync_time = "", merge_time = "";  // empty = not measured
    double memory_mb = 0;
    std::string family;
    int64_t vertices = 0, edges = 0, edges_traversed = 0, reached = 0;
    double avg_deg = 0;
    int max_deg = 0, levels = 0, source = 0;
    uint64_t seed = 0, checksum = 0;
    std::string schedule = "NA";
    int chunk = 0;
    int verified = 0;
};

inline std::string fmt_g(double x) {
    char b[64];
    std::snprintf(b, sizeof b, "%.9g", x);
    return b;
}

inline std::string csv_escape(const std::string& s) {
    if (s.find_first_of(",\"\n") == std::string::npos) return s;
    std::string o = "\"";
    for (char c : s) { if (c == '"') o += '"'; o += c; }
    return o + "\"";
}

inline void append_csv(const std::string& path, const CsvRow& r) {
    bool need_header = false;
    {
        std::ifstream t(path, std::ios::binary);
        need_header = !t || t.peek() == std::ifstream::traits_type::eof();
    }
    std::ofstream out(path, std::ios::app);
    if (!out) throw std::runtime_error("cannot open output CSV for writing: " + path);
    if (need_header) out << kCsvHeader << "\n";
    char chk[32];
    std::snprintf(chk, sizeof chk, "%016llx", (unsigned long long)r.checksum);
    out << csv_escape(r.student_id) << ',' << csv_escape(r.batch_id) << ",BFS," << csv_escape(r.dataset) << ','
        << r.vertices << ',' << r.algorithm << ',' << r.parallel_model << ',' << csv_escape(r.hardware) << ','
        << r.resource_count << ',' << r.threads << ',' << fmt_g(r.exec_time) << ",,,"  // Speedup, Efficiency left empty
        << "NA," << r.sync_time << ",NA," << fmt_g(r.memory_mb) << ",NA," << r.run_id << ",seconds,MB,"
        << r.family << ',' << r.vertices << ',' << r.edges << ',' << fmt_g(r.avg_deg) << ',' << r.max_deg << ','
        << r.edges_traversed << ',' << r.levels << ',' << r.reached << ',' << r.source << ',' << r.seed << ','
        << r.schedule << ',' << r.chunk << ',' << chk << ',' << r.verified << ',' << r.merge_time << "\n";
}
