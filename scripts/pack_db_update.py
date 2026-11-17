"""
Build easy-to-upload DB update folders under deploy/.

  python scripts/pack_db_update.py
  python scripts/pack_db_update.py --append-last 500

Outputs:
  deploy/db-update-append/   ← only new papers (small)  mode=append
  deploy/db-update-full/     ← chunked full replace     mode=replace
"""
from __future__ import annotations

import argparse
import gzip
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRIV = ROOT / "data" / "private"
OUT_APPEND = ROOT / "deploy" / "db-update-append"
OUT_FULL = ROOT / "deploy" / "db-update-full"
CHUNK = 250  # ~2–3 MB each — easy for cPanel File Manager


def write_json(path: Path, data: object, compress: bool = False) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    raw = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    if compress:
        gz = path.with_suffix(path.suffix + ".gz") if path.suffix else Path(str(path) + ".gz")
        with gzip.open(gz, "wb", compresslevel=9) as f:
            f.write(raw)
        return gz
    path.write_bytes(raw)
    return path


def mb(path: Path) -> float:
    return round(path.stat().st_size / (1024 * 1024), 2)


def pack_append(papers: list, last: int) -> None:
    if OUT_APPEND.exists():
        shutil.rmtree(OUT_APPEND)
    OUT_APPEND.mkdir(parents=True)

    chunk = papers[-last:] if last > 0 else papers
    p = write_json(OUT_APPEND / "papers.append.json", chunk, compress=True)
    # also plain small gz companion note
    (OUT_APPEND / "README.txt").write_text(
        "\n".join(
            [
                "آپدیت سبک مقالات (append) — فقط فایل‌های جدید",
                "",
                "1) این پوشه را روی هاست بریز به:",
                "   public_html/data/private/",
                "   (یعنی papers.append.json.gz داخل public_html/data/private/ باشد)",
                "",
                "2) لینک ایمپورت (mode=append):",
                "   https://neuron.monyar.ir/api/import.php?token=TOKEN&mode=append",
                "",
                f"3) این بسته {len(chunk)} مقاله دارد؛ حجم فشرده ≈ {mb(p)} MB",
                "",
                "4) بعد از ok، پوشه public_html/data/ را حذف کن.",
                "",
            ]
        ),
        encoding="utf-8",
    )
    (OUT_APPEND / "manifest.json").write_text(
        json.dumps(
            {"mode": "append", "papers": len(chunk), "file": p.name, "sizeMB": mb(p)},
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"append → {OUT_APPEND}  papers={len(chunk)}  {p.name}={mb(p)}MB")


def pack_full(papers: list, venues: list) -> None:
    if OUT_FULL.exists():
        shutil.rmtree(OUT_FULL)
    OUT_FULL.mkdir(parents=True)

    parts = []
    for i in range(0, len(papers), CHUNK):
        n = i // CHUNK + 1
        part = papers[i : i + CHUNK]
        path = write_json(OUT_FULL / f"papers.part{n:03d}.json", part, compress=True)
        parts.append({"file": path.name, "count": len(part), "sizeMB": mb(path)})

    vpath = write_json(OUT_FULL / "venues.json", venues, compress=True)
    (OUT_FULL / "README.txt").write_text(
        "\n".join(
            [
                "ایمپورت کامل (replace) — جایگزین کل جداول papers/venues",
                "",
                "1) همه فایل‌های این پوشه را بریز داخل:",
                "   public_html/data/private/",
                "",
                "2) لینک:",
                "   https://neuron.monyar.ir/api/import.php?token=TOKEN&mode=replace",
                "",
                f"3) {len(parts)} تکه مقاله + venues؛ هر تکه حدود {CHUNK} مقاله",
                "",
                "4) بعد از ok، public_html/data/ را حذف کن.",
                "",
            ]
        ),
        encoding="utf-8",
    )
    (OUT_FULL / "manifest.json").write_text(
        json.dumps(
            {
                "mode": "replace",
                "papers": len(papers),
                "venues": len(venues),
                "parts": parts,
                "venuesFile": vpath.name,
                "venuesSizeMB": mb(vpath),
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    total = sum(p["sizeMB"] for p in parts) + mb(vpath)
    print(f"full   → {OUT_FULL}  papers={len(papers)} parts={len(parts)} total≈{round(total,2)}MB")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--append-last", type=int, default=500, help="how many newest papers for append pack")
    args = ap.parse_args()

    papers = json.loads((PRIV / "papers.json").read_text(encoding="utf-8"))
    venues = json.loads((PRIV / "venues.json").read_text(encoding="utf-8"))
    if not isinstance(papers, list) or not isinstance(venues, list):
        raise SystemExit("bad papers/venues")

    pack_append(papers, args.append_last)
    pack_full(papers, venues)


if __name__ == "__main__":
    main()
