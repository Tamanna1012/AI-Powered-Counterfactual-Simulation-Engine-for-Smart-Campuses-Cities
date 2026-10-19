# References (numbered as in the report) and verification status

**How they were checked (2026-10-19).** Each entry was checked through web-search results that quote publisher, repository, conference-programme or author-hosted records
(MIT DSpace, eScholarship, NSF-PAR, arXiv, SC conference programmes, author PDFs, a Wiley URL). Direct access to Crossref, ACM DL, IEEE Xplore and Wiley pages was **not possible** from the
working environment, so a DOI is only written where a source showed it, and every item that is not fully confirmed is marked **CHECK**. Please open each link once before submission.

| # | Reference (as printed in the report) | Stable identifier | What was confirmed | Still to check |
|---|---|---|---|---|
| [1] | C. E. Leiserson and T. B. Schardl, "A work-efficient parallel breadth-first search algorithm (or how to cope with the nondeterminism of reducers)," in *Proc. 22nd ACM Symp. Parallelism in Algorithms and Architectures (SPAA '10)*, 2010, pp. 303-314. | doi:10.1145/1810479.1810534 | Title, authors, venue, year, pages, DOI (MIT DSpace record) | - |
| [2] | S. Beamer, K. Asanovic, and D. Patterson, "Direction-optimizing breadth-first search," in *Proc. Int. Conf. High Performance Computing, Networking, Storage and Analysis (SC '12)*, 2012. | http://dl.acm.org/citation.cfm?id=2388996.2389013 ; author copy https://people.eecs.berkeley.edu/~krste/papers/beamer-sc2012.pdf | Title, authors, venue, year (SC12 programme page, author PDF) | **CHECK DOI** (not found; do not guess one) |
| [3] | A. Buluç and K. Madduri, "Parallel breadth-first search on distributed memory systems," in *Proc. SC '11*, 2011. | arXiv:1104.4518 | Title, authors, venue, year (SC11 programme, Penn State record, arXiv); 40,000-core, 17.8 G edge visits/s and 3.5x communication claims as stated in the abstract | **CHECK DOI** (not found) |
| [4] | V. Agarwal, F. Petrini, D. Pasetto, and D. A. Bader, "Scalable graph exploration on multicore processors," in *Proc. SC '10*, 2010, pp. 46:1-46:11, doi:10.1109/SC.2010.46. | https://davidbader.net/publication/2010-appb/ | Title, authors, venue, year, pages (author-hosted PDF); abstract claims (up to 64 threads; 4-socket Nehalem EX 2.4x faster than a 128-processor Cray XMT on a 64M-vertex random graph) | DOI seen only in a secondary reference list (matched); **CHECK on IEEE Xplore** |
| [5] | L. Dhulipala, G. E. Blelloch, and J. Shun, "Theoretically efficient parallel graph algorithms can be fast and scalable," *ACM Trans. Parallel Comput.*, vol. 8, no. 1, 2021, doi:10.1145/3434393. | doi:10.1145/3434393 ; conference version SPAA 2018, arXiv:1805.05208 | Title, authors, journal, vol. 8(1), DOI (MIT DSpace record); 20 problems, 3.5 B-vertex graph, GBBS | **CHECK article number** (not printed in the report) |
| [6] | C. Yang, A. Buluç, and J. D. Owens, "GraphBLAST: A high-performance linear algebra-based graph framework on the GPU," *ACM Trans. Math. Softw.*, 2022, doi:10.1145/3466795. | doi:10.1145/3466795 ; arXiv:1908.01407 | Title, authors, journal, DOI (eScholarship, NSF-PAR) | **CHECK year/volume/issue**: arXiv versions disagree (2021 vs 2022) |
| [7] | S. L. Gonzaga de Oliveira, M. I. Santana, D. N. Brandao, and C. Osthoff, "An OpenMP-based breadth-first search implementation using the bag data structure," *Concurrency Comput.: Pract. Exper.*, vol. 36, no. 16, 2024, doi:10.1002/cpe.8119. | doi:10.1002/cpe.8119 | Title, journal, vol/issue, year; DOI appears in the Wiley URL found by search; abstract (C++/OpenMP reimplementation of the Cilk++ bag BFS) | **CHECK author list** (taken from a third-party listing) and article number; speedups quoted in the report ("tens of times on 28-48 core machines") come from the abstract as read in a search summary - **read the paper** |
| [8] | S. Beamer, K. Asanovic, and D. Patterson, "The GAP benchmark suite," arXiv:1508.03619, 2015 (rev. 2017). | arXiv:1508.03619 | Title, authors, arXiv id, revision dates | preprint, not a peer-reviewed venue |

(The printed report uses the proper accented names, e.g. Asanović, Buluç, Brandão.)

**Recent sources (>= 2021):** [5], [6], [7]. Seminal sources: [1]-[4] (BFS parallelisation foundations are from 2010-2012; the manual allows seminal work).

## How each source is used
* [1] concurrent frontier updates / work efficiency; [2] why large frontiers matter, future work; [3] level-synchronous BFS and TEPS; [4] multicore BFS on random graphs;
  [5] graph size and scalability in shared memory; [6] GPU branch (not implemented); [7] closest OpenMP comparison; [8] benchmark methodology.

> Statements about findings in the report paraphrase what the abstracts/records say. Read the papers before the viva; do not rely on this table alone.
