# Linux / macOS (GNU make) / MSYS2-MinGW. Windows users: see README.md.
CXX      ?= g++
CXXFLAGS ?= -O3 -std=c++17 -fopenmp -Wall -Wextra
BIN      := bin

all: $(BIN)/bfs_seq $(BIN)/bfs_par $(BIN)/bfs_tests $(BIN)/build_flags.txt

$(BIN):
	mkdir -p $(BIN)

# -fopenmp is kept for bfs_seq so that all programs are compiled with identical flags
$(BIN)/bfs_seq: src/bfs_seq_main.cpp include/*.hpp | $(BIN)
	$(CXX) $(CXXFLAGS) -Iinclude $< -o $@
$(BIN)/bfs_par: src/bfs_par_main.cpp include/*.hpp | $(BIN)
	$(CXX) $(CXXFLAGS) -Iinclude $< -o $@
$(BIN)/bfs_tests: src/bfs_tests.cpp include/*.hpp | $(BIN)
	$(CXX) $(CXXFLAGS) -Iinclude $< -o $@
$(BIN)/build_flags.txt: | $(BIN)
	@echo "$(CXX) $(CXXFLAGS)" > $@
	@$(CXX) --version | head -1 >> $@

test: all
	$(BIN)/bfs_tests tests/cases

clean:
	rm -rf $(BIN)
.PHONY: all test clean
