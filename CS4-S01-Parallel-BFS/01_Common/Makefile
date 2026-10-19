# Build file for CS4-S01 Parallel BFS.  Run `make` from THIS folder (01_Common).
# Linux / WSL / macOS (GNU make) / MSYS2-MinGW.  Windows users: see README.md.
#
# Source layout:  01_Common/            graph.hpp, bench_common.hpp, bfs_tests.cpp   (shared)
#                 ../02_Lucky_Sequential_BFS/   bfs_seq.hpp, bfs_seq_main.cpp        (Student 1)
#                 ../03_Girlfriend_OpenMP_BFS/  bfs_par.hpp, bfs_par_main.cpp        (Student 2)
CXX      ?= g++
CXXFLAGS ?= -O3 -std=c++17 -fopenmp -Wall -Wextra
SEQDIR   := ../02_Lucky_Sequential_BFS
PARDIR   := ../03_Girlfriend_OpenMP_BFS
INC      := -I. -I$(SEQDIR) -I$(PARDIR)
HDRS     := graph.hpp bench_common.hpp $(SEQDIR)/bfs_seq.hpp $(PARDIR)/bfs_par.hpp
BIN      := bin

all: $(BIN)/bfs_seq $(BIN)/bfs_par $(BIN)/bfs_tests $(BIN)/build_flags.txt

$(BIN):
	mkdir -p $(BIN)

# -fopenmp is kept for bfs_seq so that all programs are compiled with identical flags
$(BIN)/bfs_seq: $(SEQDIR)/bfs_seq_main.cpp $(HDRS) | $(BIN)
	$(CXX) $(CXXFLAGS) $(INC) $< -o $@
$(BIN)/bfs_par: $(PARDIR)/bfs_par_main.cpp $(HDRS) | $(BIN)
	$(CXX) $(CXXFLAGS) $(INC) $< -o $@
$(BIN)/bfs_tests: bfs_tests.cpp $(HDRS) | $(BIN)
	$(CXX) $(CXXFLAGS) $(INC) $< -o $@
$(BIN)/build_flags.txt: | $(BIN)
	@echo "$(CXX) $(CXXFLAGS)" > $@
	@$(CXX) --version | head -1 >> $@

test: all
	$(BIN)/bfs_tests tests/cases

clean:
	rm -rf $(BIN)
.PHONY: all test clean
