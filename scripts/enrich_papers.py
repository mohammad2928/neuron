"""Expand each paper into a much fuller teaching digest (FA/EN)."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
path = root / "src/data/papers/papers.json"
papers = json.loads(path.read_text(encoding="utf-8"))


def sentences(text: str, n: int = 6):
    parts = re.split(r"(?<=[.!?])\s+", (text or "").strip())
    parts = [p.strip() for p in parts if len(p.strip()) > 20]
    return parts[:n]


def expand(p: dict) -> dict:
    title = p["title"]
    abstract = p.get("abstract") or ""
    track = p.get("track") or "ml-general"
    venue = p.get("venue") or ""
    year = p.get("year")
    sents = sentences(abstract, 8)
    claim = sents[0] if sents else abstract[:220]
    details = " ".join(sents[1:4]) if len(sents) > 1 else abstract[:500]
    more = " ".join(sents[4:7]) if len(sents) > 4 else ""

    # Keep curated award algorithms but still wrap with structure
    base_fa = (p.get("algorithm") or {}).get("fa") or ""
    base_en = (p.get("algorithm") or {}).get("en") or ""
    if p.get("tier") == "award" and len(base_fa) > 80:
        method_core_fa = base_fa
        method_core_en = base_en
    else:
        method_core_fa = (
            f"بر اساس چکیده، ایدهٔ مرکزی چنین صورت‌بندی می‌شود: {claim}\n"
            f"جزئیات بیشتر روش: {details}"
        )
        method_core_en = f"Core claim: {claim}\nMethod detail: {details}"

    fa = f"""عنوان: {title}
محل نشر / منبع: {venue} ({year})
مسیر موضوعی: {track}

۱) مسئله
مقاله چه شکافی را هدف می‌گیرد؟ از متن چکیده برمی‌آید که مسئله حول بهبود یا تحلیل در حوزهٔ {track} است.
صورت‌بندی کوتاه مسئله: {claim}

۲) ایدهٔ اصلی روش
{method_core_fa}

۳) الگوریتم اجرایی (قالب آموزشی)
گام A — ورودی را مشخص کنید: داده، مدل پایه، یا سیگنال شرطی که مقاله استفاده می‌کند.
گام B — تبدیل/امتیازدهی: عملیات کلیدی مقاله (توجه، نمونه‌برداری، فیلتر توکن، جریان، ویرایش وزن، …) را روی ورودی اعمال کنید.
گام C — تابع هدف / قاعدهٔ به‌روزرسانی: زیان، قید، یا معیار انتخاب را اعمال کنید.
گام D — خروجی: مدل، توزیع، نمونهٔ تولیدشده، یا تحلیل تجربی را ثبت کنید.
گام E — ارزیابی: معیارهای گزارش‌شده در چکیده را با خط پایه مقایسه کنید.

۴) نکات پیاده‌سازی
- ابتدا فرض‌ها و دادهٔ آموزش/ارزیابی را از بخش Experimental Setup مقاله بخوانید.
- ابرپارامترها (نرخ یادگیری، مقیاس مدل، طول context) معمولاً حساس‌اند.
- اگر مقاله کد منتشر کرده، همان پیکربندی را مبنا بگیرید نه بازتولید حدسی.

۵) محدودیت و خوانش انتقادی
{more if more else "چکیده محدودیت‌ها را کامل نمی‌گوید؛ بخش Limitations و Ablation متن اصلی را حتماً ببینید."}
این کارت آموزشی است و جایگزین اثبات‌ها، شبهکد رسمی و جداول مقاله نیست.

۶) برای عمیق‌شدن
متن اصلی را با تمرکز روی Method → Algorithm/Equation → Experiments بخوانید، سپس همین گام‌های A–E را روی یک مثال کوچک خودتان بازنویسی کنید."""

    en = f"""Title: {title}
Venue/source: {venue} ({year})
Track: {track}

1) Problem
Short problem statement from the abstract: {claim}

2) Method core
{method_core_en}

3) Executable teaching template
A) Identify inputs (data/base model/conditioning).
B) Apply the paper’s key transform/scoring step.
C) Apply objective / update / selection rule.
D) Record outputs (model/sample/analysis).
E) Compare reported metrics vs baselines.

4) Implementation notes
Read Experimental Setup; match hyperparameters; prefer official code when available.

5) Limitations
{more if more else "Check Limitations/Ablations in the full paper."}
This card is a teaching digest, not a substitute for proofs or official pseudocode.

6) Next step
Rewrite steps A–E on a tiny toy example after reading Method + equations."""

    p["algorithm"] = {"fa": fa, "en": en, "ar": en, "ku": en}
    p["abstract"] = abstract[:1600]
    return p


papers = [expand(p) for p in papers]
path.write_text(json.dumps(papers, ensure_ascii=False, indent=2), encoding="utf-8")

body = json.dumps(papers, ensure_ascii=False, indent=2)
ts = f"""import type {{ ResearchPaper }} from './types'

export const researchPapers: ResearchPaper[] = {body} as ResearchPaper[]

export const researchPaperCount = researchPapers.length
"""
(root / "src/data/papers/catalog.ts").write_text(ts, encoding="utf-8")
print("enriched", len(papers))
