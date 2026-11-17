"""Sync papers.json → catalog helpers are imported from JSON; this only validates count."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
path = root / "src/data/papers/papers.json"
papers = json.loads(path.read_text(encoding="utf-8"))

seen_ids = set()
seen_titles = set()
uniq = []
for p in papers:
    pid = p.get("id")
    title = (p.get("title") or "").strip().lower()
    if pid in seen_ids or title in seen_titles:
        continue
    seen_ids.add(pid)
    seen_titles.add(title)
    # ensure required link/meta fields exist
    p.setdefault("keywords", p.get("tags") or [])
    p.setdefault("categories", [])
    p.setdefault("pdfUrl", "")
    p.setdefault("htmlUrl", "")
    p.setdefault("journalUrl", "")
    p.setdefault("doi", "")
    p.setdefault("journal", "")
    uniq.append(p)

path.write_text(json.dumps(uniq, ensure_ascii=False, indent=2), encoding="utf-8")
print("unique papers", len(uniq))
