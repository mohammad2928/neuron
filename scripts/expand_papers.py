"""Add 500+ more unique newest papers on top of existing catalog (no duplicates)."""
from __future__ import annotations

import json
import re
import time
from pathlib import Path

from fetch_papers import (
    OUT,
    PAGE,
    arxiv_id_base,
    expand_digest,
    fetch_page,
)

EXTRA = 500


def main() -> None:
    existing = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else []
    seen_ids = {arxiv_id_base(p.get("url") or p["id"]) for p in existing}
    seen_titles = {re.sub(r"\s+", " ", p["title"].lower()) for p in existing}
    collected = list(existing)
    print(f"existing {len(collected)}")

    start = 0
    added = 0
    # Start from newest (offset 0); duplicates are skipped by id/title.
    while added < EXTRA:
        print(f"fetch start={start} added={added} total={len(collected)}")
        try:
            batch = fetch_page(start)
        except Exception as e:
            print("error", e)
            time.sleep(5)
            continue
        if not batch:
            break
        for p in batch:
            key_id = arxiv_id_base(p["url"])
            key_title = re.sub(r"\s+", " ", p["title"].lower())
            if key_id in seen_ids or key_title in seen_titles:
                continue
            seen_ids.add(key_id)
            seen_titles.add(key_title)
            collected.append(expand_digest(p))
            added += 1
            if added >= EXTRA:
                break
        start += PAGE
        time.sleep(3.1)

    OUT.write_text(json.dumps(collected, ensure_ascii=False, indent=2), encoding="utf-8")
    print("final", len(collected), "new", added)


if __name__ == "__main__":
    main()
