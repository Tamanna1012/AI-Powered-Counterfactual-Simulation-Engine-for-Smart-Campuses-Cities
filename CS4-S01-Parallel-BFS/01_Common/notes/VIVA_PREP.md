# Viva preparation (both students should be able to answer all of these)

**Student 1 (baseline)**
1. What is BFS, what does dist[v] = -1 mean, and why is the complexity O(n + m)?
2. Why CSR instead of a vector<vector<int>>? (compact, cache friendly, one allocation)
3. How do you know your BFS is correct? (12 hand cases, `validate_bfs` rules, cross-checks) Which rule catches a missing level?
4. Why are generation and validation outside the timed region? Why median of 7 and one warm-up?
5. Why is sequential MTEPS lower on the 2^20 random graph than on 2^18? (likely cache/memory; we did NOT measure it)
6. What is the start-vertex rule and why does random/R-MAT use the max-degree vertex?

**Student 2 (parallel)**
1. Where can a data race happen in parallel BFS and how does compare_exchange remove it?
2. Why per-thread buffers + prefix sum instead of one shared queue with an atomic counter?
3. Which barriers exist per level and why is each needed? What would break if the second barrier were removed?
4. Why is the path graph ~466x slower with 4 threads? (one vertex per level; fixed per-level cost 0.8-3.7 us)
5. Why does the grid not beat sequential even at 2^20? (2047 levels, ~1000 edge checks per level)
6. Why efficiency ~1.0-1.1 for random graphs at 2 threads? (measured against sequential, not 1-thread parallel; CV 6-14%; not proven superlinear)
7. How is "Synchronization_Time" defined and why is it measured in a separate instrumented run?
8. What would you change next? (sequential fallback for small frontiers, direction-optimizing BFS)

**Both**
* Which hypotheses were supported (H1, H3) and which only partly (H2)?
* What are the threats to validity? (4 vCPU shared VM, synthetic graphs, <=4 threads, one baseline)
* Which results came from which machine? (a cloud VM, not a laptop - see environment.json)
