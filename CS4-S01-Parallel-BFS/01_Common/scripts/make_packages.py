#!/usr/bin/env python3
"""Builds the three submission ZIP archives from the project folder (read-only on the project).

  Lucky_Sequential_BFS.zip            Student 1's note + code + everything shared (incl. Student 2's code as the comparison reference)
  Girlfriend_OpenMP_Parallel_BFS.zip  Student 2's note + code + everything shared (incl. Student 1's baseline code)
  CS4-S01_Complete_Team_Project.zip   the whole organised project folder (both notes, all code/data/plots/scripts, both student ZIPs)

Output goes to <project>/04_Submission_Packages/. Run from anywhere:  python3 scripts/make_packages.py
"""
import shutil
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJECT = ROOT.parent
OUTDIR = PROJECT / "04_Submission_Packages"
SKIP_DIRS = {"bin", "__pycache__", "04_Submission_Packages", ".git"}
SKIP_SUFFIX = {".pyc", ".pdf"}

S1_ONLY = ["02_Lucky_Sequential_BFS/Technical_Note_Student1.docx", "02_Lucky_Sequential_BFS/Student1_Source_Code_Appendix.docx"]
S2_ONLY = ["03_Girlfriend_OpenMP_BFS/Technical_Note_Student2.docx", "03_Girlfriend_OpenMP_BFS/Student2_Source_Code_Appendix.docx"]

PLACEHOLDERS = """\
## Placeholders still to fill in (left intact on purpose - no personal detail was invented)
* Word documents: `[Name, Reg. No.]` and `[Batch ID]` (report title block), `[Student N name, Reg. No.]` and `[ID]` (technical note headers, appendix headers).
* CSV ID columns: `STUDENT1`, `STUDENT2`, `BATCH_TBD` (see 01_Common/CHECKLIST.md for a one-line `sed` command that changes only those columns).
"""

STATUS = """\
## Honest status (details in 01_Common/CHECKLIST.md)
* The measurements (`01_Common/data/raw/bfs_raw.csv`, 588 runs) were taken on a 4-vCPU Intel Xeon **cloud VM running Linux**, not on a Windows PC (`01_Common/data/env/environment.json`).
* Verified when this package was built, on an extracted copy of the ZIP (Linux, g++ 13.3): `make` without warnings; `make test` = 1402 checks passed, 0 failed; `analyze.py` reproduces the shipped derived CSV;
  `audit.py --docs` recomputes all metrics independently and finds the numbers in the Word tables consistent with the CSV (results in `01_Common/logs/audit_report.txt`).
* **Not verified:** compilation on native Windows or in WSL (no Windows machine available); the Word files were checked with python-docx and LibreOffice only (open them in Word before submitting);
  several reference DOIs/volumes are marked CHECK in `01_Common/REFERENCES.md`; no GPU version; no SNAP/SuiteSparse graphs.
"""

EXTRACT = """\
## Extracting on Windows 10 / 11
1. Download `{zip}` and save it somewhere with a short path, for example `C:\\Users\\<you>\\Documents\\`.
2. Right-click the ZIP -> **Extract All...** -> choose a destination -> **Extract** (do not run files from inside the ZIP preview).
3. Open the extracted `{top}` folder. Start with `{first}`, then `01_Common\\README.md`. To build and run the code use **WSL2/Ubuntu** (instructions in `01_Common/README.md`).
"""


def copy_project(dst: Path, drop):
    for src in sorted(PROJECT.rglob("*")):
        rel = src.relative_to(PROJECT)
        if any(part in SKIP_DIRS for part in rel.parts) or src.suffix in SKIP_SUFFIX or not src.is_file():
            continue
        if rel.as_posix() in drop:
            continue
        # temporary quick-run outputs are never shipped
        if "quick" in src.name.lower() and src.suffix in (".csv", ".json"):
            continue
        (dst / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst / rel)


def listing(top: Path):
    return "\n".join("    " + p.relative_to(top).as_posix() for p in sorted(top.rglob("*")) if p.is_file())


def make_zip(folder: Path, zip_path: Path):
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for p in sorted(folder.rglob("*")):
            if p.is_file():
                zf.write(p, (Path(folder.name) / p.relative_to(folder)).as_posix())
    return zip_path


def main():
    OUTDIR.mkdir(exist_ok=True)
    for old in OUTDIR.glob("*.zip"):
        old.unlink()
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        specs = [
            ("Lucky_Sequential_BFS", S2_ONLY, "02_Lucky_Sequential_BFS/CONTRIBUTION.md", "Student 1 (Lucky): sequential BFS baseline",
             "Student 2's note and appendix are deliberately not included; her source code (`03_Girlfriend_OpenMP_BFS/bfs_par*`) is included only because the shared tests, experiment runner and speedup analysis need it."),
            ("Girlfriend_OpenMP_Parallel_BFS", S1_ONLY, "03_Girlfriend_OpenMP_BFS/CONTRIBUTION.md", "Student 2 (girlfriend): OpenMP parallel BFS",
             "Student 1's note and appendix are deliberately not included; his sequential baseline code (`02_Lucky_Sequential_BFS/bfs_seq*`) and graph code are included because every speedup is measured against them."),
        ]
        for name, drop, first, who, note in specs:
            top = tmp / name
            copy_project(top, drop)
            info = (f"# {name} - package information\n\n**Owner:** {who}\n\n{note}\n\n"
                    "Both standalone packages contain the same integrated report (`01_Common/CS4-S01_Integrated_Report.docx`, identical byte for byte), "
                    "the same data, plots, scripts and shared code. Only the individual technical note, appendix and the contribution description differ.\n\n"
                    f"{STATUS}\n{PLACEHOLDERS}\n{EXTRACT.format(zip=name + '.zip', top=name, first=first.replace('/', chr(92)))}\n"
                    f"## Files in this package\n```\n{listing(top)}\n```\n")
            (top / "PACKAGE_INFO.md").write_text(info, encoding="utf-8")
            z = make_zip(top, OUTDIR / f"{name}.zip")
            print(f"{z.name}: {z.stat().st_size / 1024:.0f} KB, {sum(1 for _ in top.rglob('*') if _.is_file())} files")
        # master: the whole organised project folder (including both student ZIPs just built)
        master = tmp / "CS4-S01-Parallel-BFS"
        copy_project(master, [])
        (master / "04_Submission_Packages").mkdir(exist_ok=True)
        for z in OUTDIR.glob("*.zip"):
            shutil.copy2(z, master / "04_Submission_Packages" / z.name)
        (master / "04_Submission_Packages" / "README.txt").write_text(
            "Lucky_Sequential_BFS.zip and Girlfriend_OpenMP_Parallel_BFS.zip are the two standalone submission packages.\n"
            "This folder (04_Submission_Packages) holds them; the master archive CS4-S01_Complete_Team_Project.zip is the whole project folder you are looking at.\n", encoding="utf-8")
        (master / "START_HERE.md").write_text(
            "# CS4-S01 Parallel BFS - complete team project\n\nStart with `01_Common/README.md` (build, test, run, reproduce), `01_Common/CHECKLIST.md` (audit + what you must still do)\n"
            "and each student's `CONTRIBUTION.md` in `02_Lucky_Sequential_BFS/` and `03_Girlfriend_OpenMP_BFS/`.\n\n"
            f"{STATUS}\n{PLACEHOLDERS}\n{EXTRACT.format(zip='CS4-S01_Complete_Team_Project.zip', top='CS4-S01-Parallel-BFS', first='START_HERE.md')}", encoding="utf-8")
        z = make_zip(master, OUTDIR / "CS4-S01_Complete_Team_Project.zip")
        print(f"{z.name}: {z.stat().st_size / 1024:.0f} KB, {sum(1 for _ in master.rglob('*') if _.is_file())} files")


if __name__ == "__main__":
    main()
