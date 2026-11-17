"""Build private API payloads: index (no digests) + full papers map for R2/local API."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRIV = ROOT / "data" / "private"
SRC_PAPERS = ROOT / "src" / "data" / "papers" / "papers.json"
SRC_VENUES = ROOT / "src" / "data" / "venues" / "venues.json"


def slim_paper(p: dict) -> dict:
    return {
        "id": p["id"],
        "title": p["title"],
        "year": p.get("year"),
        "venue": p.get("venue"),
        "url": p.get("url"),
        "pdfUrl": p.get("pdfUrl") or "",
        "htmlUrl": p.get("htmlUrl") or "",
        "journalUrl": p.get("journalUrl") or "",
        "doi": p.get("doi") or "",
        "journal": p.get("journal") or "",
        "authors": p.get("authors") or [],
        "abstract": (p.get("abstract") or "")[:500],
        "tags": p.get("tags") or [],
        "keywords": p.get("keywords") or [],
        "categories": p.get("categories") or [],
        "track": p.get("track") or "ml-general",
        "tier": p.get("tier") or "recent",
    }


def main() -> None:
    PRIV.mkdir(parents=True, exist_ok=True)

    def pick_src(preferred: Path, fallback: Path) -> Path:
        if preferred.exists():
            try:
                raw = json.loads(preferred.read_text(encoding="utf-8"))
                if isinstance(raw, list) and raw:
                    return preferred
                if isinstance(raw, dict) and raw.get("_moved"):
                    return fallback
            except Exception:
                pass
        return fallback

    papers_src = pick_src(SRC_PAPERS, PRIV / "papers.json")
    venues_src = pick_src(SRC_VENUES, PRIV / "venues.json")
    if not papers_src.exists() or not venues_src.exists():
        raise SystemExit(f"missing data: papers={papers_src} venues={venues_src}")

    papers = json.loads(papers_src.read_text(encoding="utf-8"))
    venues = json.loads(venues_src.read_text(encoding="utf-8"))
    if not isinstance(papers, list) or not isinstance(venues, list):
        raise SystemExit("papers/venues must be JSON arrays in data/private")

    # canonical private copies
    (PRIV / "papers.json").write_text(json.dumps(papers, ensure_ascii=False), encoding="utf-8")
    (PRIV / "venues.json").write_text(json.dumps(venues, ensure_ascii=False), encoding="utf-8")

    index = [slim_paper(p) for p in papers]
    (PRIV / "papers.index.json").write_text(json.dumps(index, ensure_ascii=False), encoding="utf-8")

    by_id = {p["id"]: p for p in papers}
    (PRIV / "papers.byid.json").write_text(json.dumps(by_id, ensure_ascii=False), encoding="utf-8")

    # stats
    kw: dict[str, int] = {}
    tracks: dict[str, int] = {}
    cats: dict[str, int] = {}
    for p in papers:
        tracks[str(p.get("track") or "ml-general")] = tracks.get(str(p.get("track") or "ml-general"), 0) + 1
        for k in p.get("keywords") or p.get("tags") or []:
            kw[k] = kw.get(k, 0) + 1
        for c in p.get("categories") or []:
            cats[c] = cats.get(c, 0) + 1

    meta = {
        "paperCount": len(papers),
        "venueCount": len(venues),
        "journalCount": sum(1 for v in venues if v.get("kind") == "journal"),
        "conferenceCount": sum(1 for v in venues if v.get("kind") == "conference"),
        "keywords": sorted(({"key": k, "count": c} for k, c in kw.items()), key=lambda x: -x["count"])[:40],
        "tracks": sorted(({"key": k, "count": c} for k, c in tracks.items()), key=lambda x: -x["count"]),
        "categories": sorted(({"key": k, "count": c} for k, c in cats.items()), key=lambda x: -x["count"])[:30],
    }
    (PRIV / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

    # remove bulky public copies from src so Vite cannot serve them
    for path in (SRC_PAPERS, SRC_VENUES):
        if path.exists():
            path.write_text(
                json.dumps(
                    {
                        "_moved": True,
                        "message": "Private data lives in data/private and is served only via /api (Cloudflare Worker / local API). Direct JSON access is disabled.",
                    },
                    indent=2,
                ),
                encoding="utf-8",
            )

    print("papers", len(papers), "venues", len(venues))
    print("wrote", PRIV)


if __name__ == "__main__":
    main()
