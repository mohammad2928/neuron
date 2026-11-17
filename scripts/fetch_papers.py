"""Fetch newest ML/AI papers from arXiv: categories, keywords, journal/paper URLs, no duplicates."""
from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data/private/papers.json"
SRC_STUB = ROOT / "src/data/papers/papers.json"
NS = {"a": "http://www.w3.org/2005/Atom", "arxiv": "http://arxiv.org/schemas/atom"}

# Multi-category query → newest across ML/NLP/CV/AI
SEARCH = (
    "cat:cs.LG OR cat:cs.CL OR cat:cs.AI OR cat:cs.CV OR cat:cs.NE OR cat:stat.ML"
)
TARGET = 500
PAGE = 100

KEYWORD_RULES: list[tuple[str, list[str]]] = [
    ("machine-translation", ["machine translation", "nmt", "neural machine translation", "mt system"]),
    ("large-language-models", ["large language model", " llm", "llms", "foundation model"]),
    ("transformers", ["transformer", "self-attention", "multi-head attention"]),
    ("diffusion", ["diffusion model", "denoising diffusion", "score-based generative", "ddpm", "flow matching"]),
    ("reinforcement-learning", ["reinforcement learning", " rlhf", "policy gradient", "q-learning", "actor-critic"]),
    ("alignment", ["alignment", "rlhf", "constitutional ai", "preference optimization", "dpo", "reward model"]),
    ("safety", ["safety", "jailbreak", "adversarial", "robustness", "red team"]),
    ("retrieval-rag", ["retrieval-augmented", " rag", "dense retrieval", "vector database"]),
    ("multimodal", ["multimodal", "vision-language", "vlm", "image-text", "audio-language"]),
    ("computer-vision", ["object detection", "segmentation", "image classification", "vision transformer", "vit "]),
    ("optimization", ["optimizer", "gradient descent", "adamw", "learning rate", "second-order"]),
    ("federated-learning", ["federated learning", "federated averaging"]),
    ("graph-learning", ["graph neural", " gnn", "graph convolution"]),
    ("time-series", ["time series", "temporal forecasting", "sequential forecasting"]),
    ("speech", ["speech recognition", "asr", "text-to-speech", "tts", "whisper"]),
    ("coding-agents", ["code generation", "software engineering", "agentic", "tool use", "llm agent"]),
    ("efficient-training", ["lora", "qlora", "parameter-efficient", "quantization", "distillation", "moe", "mixture of experts"]),
    ("reasoning", ["chain-of-thought", "reasoning", "math word", "theorem proving"]),
    ("evaluation", ["benchmark", "evaluation", "leaderboard", "metric"]),
    ("theory", ["generalization bound", "pac-bayes", "sample complexity", "convergence rate"]),
]

TRACK_FROM_KEYWORD = {
    "machine-translation": "nlp",
    "large-language-models": "nlp",
    "transformers": "architecture",
    "diffusion": "generative",
    "reinforcement-learning": "rl",
    "alignment": "alignment",
    "safety": "safety",
    "retrieval-rag": "nlp",
    "multimodal": "vision",
    "computer-vision": "vision",
    "optimization": "optimization",
    "federated-learning": "training",
    "graph-learning": "ml-general",
    "time-series": "ml-general",
    "speech": "nlp",
    "coding-agents": "nlp",
    "efficient-training": "training",
    "reasoning": "nlp",
    "evaluation": "ml-general",
    "theory": "theory",
}

CAT_TO_TRACK = {
    "cs.LG": "ml-general",
    "cs.CL": "nlp",
    "cs.CV": "vision",
    "cs.AI": "ml-general",
    "cs.NE": "architecture",
    "stat.ML": "theory",
    "cs.RO": "rl",
    "eess.AS": "nlp",
}


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:72] or "paper"


def arxiv_id_base(url_or_id: str) -> str:
    m = re.search(r"(\d{4}\.\d{4,5})", url_or_id)
    return m.group(1) if m else url_or_id.rsplit("/", 1)[-1].split("v")[0]


def text_of(el: ET.Element | None) -> str:
    if el is None or el.text is None:
        return ""
    return re.sub(r"\s+", " ", el.text).strip()


def infer_keywords(title: str, abstract: str, categories: list[str]) -> list[str]:
    blob = f"{title} {abstract}".lower()
    found: list[str] = []
    for kw, needles in KEYWORD_RULES:
        if any(n in blob for n in needles):
            found.append(kw)
    for c in categories:
        short = c.split(".")[-1].lower() if "." in c else c.lower()
        if short and short not in found:
            found.append(c)  # keep arxiv category as keyword tag too
    # always include primary arxiv cats as keywords (deduped later)
    return list(dict.fromkeys(found))[:12]


def infer_track(keywords: list[str], categories: list[str]) -> str:
    for kw in keywords:
        if kw in TRACK_FROM_KEYWORD:
            return TRACK_FROM_KEYWORD[kw]
    for c in categories:
        if c in CAT_TO_TRACK:
            return CAT_TO_TRACK[c]
    return "ml-general"


def expand_digest(p: dict) -> dict:
    title = p["title"]
    abstract = p.get("abstract") or ""
    track = p.get("track") or "ml-general"
    venue = p.get("venue") or ""
    year = p.get("year")
    cats = ", ".join(p.get("categories") or [])
    kws = ", ".join(p.get("keywords") or [])
    parts = re.split(r"(?<=[.!?])\s+", abstract.strip())
    parts = [x.strip() for x in parts if len(x.strip()) > 20]
    claim = parts[0] if parts else abstract[:220]
    details = " ".join(parts[1:4]) if len(parts) > 1 else abstract[:500]
    more = " ".join(parts[4:7]) if len(parts) > 4 else ""

    base_fa = (p.get("algorithm") or {}).get("fa") or ""
    if p.get("tier") == "award" and len(base_fa) > 80:
        method_fa = base_fa
        method_en = (p.get("algorithm") or {}).get("en") or base_fa
    else:
        method_fa = f"ایدهٔ مرکزی از چکیده: {claim}\nجزئیات: {details}"
        method_en = f"Core claim: {claim}\nDetail: {details}"

    fa = f"""عنوان: {title}
محل نشر: {venue} ({year})
دسته‌ها: {cats}
کلمات کلیدی: {kws}

۱) ورودی مسئله
داده‌ها / مفروضات / قیودی که مقاله از آن‌ها شروع می‌کند (از چکیده استنباط‌شده).

۲) خروجی مطلوب
مدل، پیش‌بینی، نمونه، یا تحلیل تجربی که مقاله ادعا می‌کند تحویل می‌دهد.

۳) قاعدهٔ تبدیل (روش)
{method_fa}

۴) مسیر اجرایی آموزشی
A) ورودی را مشخص کنید
B) تبدیل/امتیازدهی کلیدی را اعمال کنید
C) هدف / قید / قانون به‌روزرسانی را اعمال کنید
D) خروجی را ثبت کنید
E) با خط پایه و متریک گزارش‌شده مقایسه کنید

۵) محدودیت
{more if more else "Limitations و Ablation متن اصلی را بخوانید."}
این کارت آموزشی است؛ جایگزین مقالهٔ کامل نیست."""

    en = f"""Title: {title}
Venue: {venue} ({year})
Categories: {cats}
Keywords: {kws}

1) Problem inputs — data/assumptions/constraints.
2) Desired outputs — model/prediction/sample/analysis.
3) Transform / method
{method_en}
4) Teaching path A→E: inputs → transform → objective → output → metrics vs baseline.
5) Limitations
{more if more else "Read Limitations/Ablations in the full paper."}
Teaching digest only."""

    p["algorithm"] = {"fa": fa, "en": en, "ar": en, "ku": en}
    p["abstract"] = abstract[:1600]
    return p


def fetch_page(start: int) -> list[dict]:
    q = urllib.parse.urlencode(
        {
            "search_query": SEARCH,
            "start": start,
            "max_results": PAGE,
            "sortBy": "submittedDate",
            "sortOrder": "descending",
        }
    )
    url = f"http://export.arxiv.org/api/query?{q}"
    req = urllib.request.Request(url, headers={"User-Agent": "NeuronLearningApp/1.0 (edu)"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        raw = resp.read()
    root = ET.fromstring(raw)
    entries = []
    for entry in root.findall("a:entry", NS):
        abs_url = text_of(entry.find("a:id", NS))
        aid = arxiv_id_base(abs_url)
        title = text_of(entry.find("a:title", NS))
        abstract = text_of(entry.find("a:summary", NS))
        published = text_of(entry.find("a:published", NS))
        year = int(published[:4]) if published[:4].isdigit() else 2025
        authors = [text_of(a.find("a:name", NS)) for a in entry.findall("a:author", NS)]
        categories = [c.attrib.get("term", "") for c in entry.findall("arxiv:primary_category", NS)]
        categories += [
            c.attrib.get("term", "")
            for c in entry.findall("a:category", NS)
            if c.attrib.get("term")
        ]
        categories = list(dict.fromkeys([c for c in categories if c]))
        doi = text_of(entry.find("arxiv:doi", NS))
        journal_ref = text_of(entry.find("arxiv:journal_ref", NS))
        comment = text_of(entry.find("arxiv:comment", NS))

        pdf_url = ""
        for link in entry.findall("a:link", NS):
            if link.attrib.get("title") == "pdf" or link.attrib.get("type") == "application/pdf":
                pdf_url = link.attrib.get("href", "")
                break
        if not pdf_url:
            pdf_url = f"https://arxiv.org/pdf/{aid}.pdf"

        paper_url = f"https://arxiv.org/abs/{aid}"
        html_url = f"https://arxiv.org/html/{aid}"
        journal_url = f"https://doi.org/{doi}" if doi else ""

        venue = journal_ref or (f"arXiv:{aid}" + (f" · {comment}" if comment else ""))
        all_kw = infer_keywords(title, abstract, categories)
        semantic = [k for k in all_kw if not re.match(r"^[a-z]+\.[A-Za-z0-9-]+$", k)]
        if not semantic:
            semantic = [c.replace(".", "-") for c in categories[:3]] or ["ml-general"]
        track = infer_track(semantic, categories)
        tags = list(dict.fromkeys(semantic + categories[:3]))[:10]
        keywords = list(dict.fromkeys(semantic))[:10]

        entries.append(
            {
                "id": f"arxiv-{aid}",
                "title": title,
                "year": year,
                "venue": venue[:180],
                "url": paper_url,
                "pdfUrl": pdf_url.replace("http://", "https://"),
                "htmlUrl": html_url,
                "journalUrl": journal_url,
                "doi": doi,
                "journal": journal_ref,
                "authors": authors[:12] or ["Unknown"],
                "abstract": abstract,
                "tags": tags,
                "keywords": keywords,
                "categories": categories[:8],
                "track": track,
                "tier": "recent",
                "source": "arxiv",
            }
        )
    return entries


def load_existing_awards() -> list[dict]:
    if not OUT.exists():
        return []
    old = json.loads(OUT.read_text(encoding="utf-8"))
    awards = []
    for p in old:
        if p.get("tier") != "award":
            continue
        # normalize links
        url = p.get("url") or ""
        aid = arxiv_id_base(url) if "arxiv" in url else ""
        p = {
            **p,
            "pdfUrl": p.get("pdfUrl") or (f"https://arxiv.org/pdf/{aid}.pdf" if aid else ""),
            "htmlUrl": p.get("htmlUrl") or (f"https://arxiv.org/html/{aid}" if aid else ""),
            "journalUrl": p.get("journalUrl") or (f"https://doi.org/{p['doi']}" if p.get("doi") else ""),
            "doi": p.get("doi") or "",
            "journal": p.get("journal") or "",
            "categories": p.get("categories") or ([p.get("track")] if p.get("track") else []),
            "keywords": p.get("keywords")
            or [t for t in (p.get("tags") or []) if t not in ("NeurIPS", "ICML", "ICLR")],
            "source": p.get("source") or "curated",
        }
        awards.append(p)
    return awards


def main() -> None:
    seen_ids: set[str] = set()
    seen_titles: set[str] = set()
    collected: list[dict] = []

    # 1) Keep curated awards first (not duplicates of each other)
    for p in load_existing_awards():
        key_id = arxiv_id_base(p.get("url") or p["id"])
        key_title = re.sub(r"\s+", " ", p["title"].lower())
        if key_id in seen_ids or key_title in seen_titles:
            continue
        seen_ids.add(key_id)
        seen_titles.add(key_title)
        collected.append(p)

    print(f"kept awards: {len(collected)}")

    # 2) Fetch newest arXiv pages until TARGET unique papers
    start = 0
    while len(collected) < TARGET:
        print(f"fetch start={start} have={len(collected)}")
        try:
            batch = fetch_page(start)
        except Exception as e:
            print("fetch error", e)
            time.sleep(5)
            continue
        if not batch:
            break
        for p in batch:
            key_id = arxiv_id_base(p["url"])
            key_title = re.sub(r"\s+", " ", p["title"].lower())
            if key_id in seen_ids or key_title in seen_titles:
                continue  # skip duplicates
            seen_ids.add(key_id)
            seen_titles.add(key_title)
            collected.append(p)
            if len(collected) >= TARGET:
                break
        start += PAGE
        time.sleep(3.1)  # arXiv courtesy

    papers = [expand_digest(p) for p in collected[:TARGET]]
    OUT.write_text(json.dumps(papers, ensure_ascii=False, indent=2), encoding="utf-8")

    tracks = Counter(p["track"] for p in papers)
    kws = Counter(k for p in papers for k in p.get("keywords") or [])
    print("wrote", len(papers), "→", OUT)
    print("tracks", dict(tracks.most_common()))
    print("top keywords", kws.most_common(15))


if __name__ == "__main__":
    main()
