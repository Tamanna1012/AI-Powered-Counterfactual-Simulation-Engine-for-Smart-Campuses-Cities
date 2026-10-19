# PACKAGE_NOTES - contents, checklist and honest status

## What is in this package (and what is deliberately the same in both packages)
Both packages contain the **complete shared project**, so that *everything compiles, tests, runs and re-analyses on its own*.
Only the individual technical note and CONTRIBUTION.md differ. Specifically identical in both packages (verified by SHA-256 when the archives were built):
the integrated report, all C++ sources and headers, tests, scripts, raw and derived CSV files, figures, logs, README.md, REFERENCES.md, CHECKLIST.md, Makefile.
No results were duplicated, edited or re-labelled to make the packages look different.

## Honest status of the evidence
* **Measured data:** `data/raw/bfs_raw.csv` (588 rows) was measured in this project's cloud container (Intel Xeon @ 2.10 GHz, 4 vCPUs, 15.7 GB RAM, Ubuntu, g++ 13.3) - **not on a Windows PC**. See `data/env/environment.json`. If your faculty expects results from your own machine, re-run (see README.md section 3) and rebuild the documents; then re-read the text, which was written from the original data.
* **Correctness evidence:** `logs/correctness_test_output.txt` shows 1402 checks passed, 0 failed (Linux, g++ 13.3). When this package was built, the tests and the analysis were re-run from an extracted copy of the ZIP on Linux (results are recorded in `PACKAGE_VERIFICATION.txt`).
* **Windows:** compilation on **native Windows (MSYS2/MinGW) was NOT tested** by the assistant (no Windows machine available). The tested route is Linux; on Windows the recommended route is **WSL2 (Ubuntu)**, which runs the identical commands. See "Windows quick start" in CONTRIBUTION.md.
* **References:** several DOIs/volumes are flagged "check" in REFERENCES.md - not yet verified against the publishers' pages.
* **Not done:** no GPU/CUDA implementation (no GPU available); no SNAP/SuiteSparse graphs; no energy measurements.
* **Missing files:** none of the files you listed are missing. The `bin/` folder (compiled programs) is intentionally NOT shipped - build it with `make`. PDF copies of the Word files are not included.

## Placeholders that still need YOUR details (left intact on purpose; nothing was invented)
| File | Placeholder text | Where |
|---|---|---|
| report/CS4-S01_Integrated_Report.docx | `[Name, Reg. No.]` (x2: Student 1 and Student 2) and `[Batch ID]` | title block, page 1 |
| report/Technical_Note_Student2.docx | `[Student 2 name, Reg. No.]` and `[ID]` (batch) | header line under the title |
| data/raw/bfs_raw.csv, data/derived/bfs_derived.csv | `Student_ID` = `STUDENT1` / `STUDENT2`, `Batch_ID` = `BATCH_TBD` | ID columns only (generic defaults used by the runner) |

To replace the IDs in the CSVs without touching any measurement (run from the package root in WSL / Git-Bash / MSYS2):
```
sed -i 's/^STUDENT1,BATCH_TBD/<YourRegNo>,<BatchID>/; s/^STUDENT2,BATCH_TBD/<PartnerRegNo>,<BatchID>/' data/raw/bfs_raw.csv data/derived/bfs_derived.csv
```
Edit the names in the .docx files directly in Word (or re-run `python scripts/build_docs.py` after editing the placeholder strings in that script - note it regenerates ALL three Word files, including the other student's note, into `report/`).

