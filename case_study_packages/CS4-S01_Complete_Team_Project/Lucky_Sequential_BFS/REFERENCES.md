# Verified references (IEEE-style numbering used in the report)

**How these were verified.** In this session, each entry was checked against search results that quote the publisher / author-hosted / repository record
(MIT DSpace, eScholarship, NSF-PAR, arXiv listings, conference programme pages, researcher profiles). Direct access to Crossref/ACM/IEEE/Wiley pages was
blocked from this environment, so **DOIs were only written down where a source explicitly showed them**. Status column says exactly what was confirmed.
**Please open each link once yourselves before submission** (30 minutes) and fix any detail marked "check".

| # | Reference | Stable identifier | Verification status | Recent? |
|---|---|---|---|---|
| [1] | C. E. Leiserson and T. B. Schardl, "A work-efficient parallel breadth-first search algorithm (or how to cope with the nondeterminism of reducers)," in *Proc. 22nd ACM Symp. Parallelism in Algorithms and Architectures (SPAA '10)*, 2010, pp. 303–314. | doi:10.1145/1810479.1810534 | Title, authors, venue, year, pages, DOI confirmed (MIT DSpace record). | no (seminal) |
| [2] | S. Beamer, K. Asanović, and D. Patterson, "Direction-optimizing breadth-first search," in *Proc. Int. Conf. High Performance Computing, Networking, Storage and Analysis (SC '12)*, 2012. | http://dl.acm.org/citation.cfm?id=2388996.2389013 | Authors, title, venue, year confirmed (SC12 programme + later citation by same authors). DOI not confirmed — **check on ACM/IEEE and add**. | no (seminal) |
| [3] | A. Buluç and K. Madduri, "Parallel breadth-first search on distributed memory systems," in *Proc. Int. Conf. High Performance Computing, Networking, Storage and Analysis (SC '11)*, 2011. | arXiv:1104.4518 | Authors, title, venue, year confirmed (SC11 programme, Penn State record, arXiv). DOI not confirmed — **check**. | no |
| [4] | V. Agarwal, F. Petrini, D. Pasetto, and D. A. Bader, "Scalable graph exploration on multicore processors," in *Proc. ACM/IEEE Int. Conf. High Performance Computing, Networking, Storage and Analysis (SC '10)*, 2010, pp. 46:1–46:11. | https://davidbader.net/publication/2010-appb/ | Authors, title, venue, year, pages confirmed (author-hosted PDF, IBM record). DOI not confirmed — **check**. | no |
| [5] | L. Dhulipala, G. E. Blelloch, and J. Shun, "Theoretically efficient parallel graph algorithms can be fast and scalable," *ACM Trans. Parallel Computing*, vol. 8, no. 1, 2021. | doi:10.1145/3434393 | Title, authors, journal, vol. 8(1), DOI confirmed (MIT DSpace record). Article number not confirmed. Journal version covers 20 graph problems; conference version SPAA 2018 (arXiv:1805.05208). | **yes (2021)** |
| [6] | C. Yang, A. Buluç, and J. D. Owens, "GraphBLAST: A high-performance linear algebra-based graph framework on the GPU," *ACM Trans. Mathematical Software*, 2022. | doi:10.1145/3466795 (arXiv:1908.01407) | Title, authors, journal, DOI confirmed (eScholarship, NSF-PAR). **Year/volume ambiguous in sources (2021 vs 2022) — check volume/issue/article number.** | **yes (2021/22)** |
| [7] | S. L. Gonzaga de Oliveira, M. I. Santana, D. N. Brandão, and C. Osthoff, "An OpenMP-based breadth-first search implementation using the bag data structure," *Concurrency and Computation: Practice and Experience*, vol. 36, no. 16, 2024. | doi:10.1002/cpe.8119 | Title, journal, vol/issue, year, DOI seen in search result; author list only from a secondary researcher listing — **check the author list and article number on the Wiley page**. | **yes (2024)** |
| [8] | S. Beamer, K. Asanović, and D. Patterson, "The GAP benchmark suite," arXiv:1508.03619, 2015 (rev. 2017). | arXiv:1508.03619 | Title, authors, arXiv id, revision dates confirmed (arXiv listing). Preprint, not a peer-reviewed venue. | no |

Recent (≥ 2021) peer-reviewed sources: **[5], [6], [7]** — satisfies "at least 3 recent" in the manual. Seminal sources [1]–[4] are used because BFS parallelisation
foundations date from 2010–2012 (the manual allows seminal work).

## What each source contributes to our argument
* [1] Level-synchronous parallel BFS needs care with races on the visited flag; shows work-efficiency and the cost of coordinating a frontier (bag data structure).
* [2] Top-down BFS wastes edge checks on large frontiers of low-diameter graphs; bottom-up switch gives large speedups. Motivates our "future work: direction-optimizing".
* [3] Level-synchronous BFS in distributed memory; communication dominates; hybrid MPI+threads. Reports performance in edge visits per second (TEPS) on scale-free graphs.
* [4] Shared-memory multicore BFS: atomic-free / low-synchronization visited tests, batching of frontier insertions, scaling with threads on random graphs.
* [5] Modern shared-memory graph-processing suite (GBBS); shows that graph size and structure drive scalability and that parallel BFS can be fast on very large graphs.
* [6] Shows frontier sparsity/density drives algorithm choice (push vs pull) on GPUs; a reference for the "GPU" direction we did not implement.
* [7] OpenMP BFS with bag structure on both connected and disconnected graphs; reports speedups that depend on the graph (up to ~20× on 28 cores per the abstract summary we saw) — the closest comparison to our OpenMP implementation.
* [8] Defines a benchmark methodology (Kronecker/uniform/road graphs, trials, edges-per-second) that we imitate in miniature.

> Statements about findings in this table paraphrase what the abstracts/records said; read the papers before the viva.
