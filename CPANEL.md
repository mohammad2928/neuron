# Neuron — معماری سرویس، API، لوکال و cPanel

دامنهٔ فعلی: `https://neuron.monyar.ir`

این سند مرجع کامل است: سرویس چیست، API چه می‌کند، لوکال چطور بالا می‌آید، و روی cPanel چه آپلود/آپدیتی لازم است.

---

## ۱) تصویر کلی سرویس

Neuron دو لایه دارد:

| لایه | تکنولوژی | نقش |
|------|----------|-----|
| فرانت | React + TypeScript + Vite | UI، درس‌ها، تم، یادداشت/پیشرفت کاربر |
| بکند | PHP + MySQL (cPanel) | مقالات، ژورنال‌ها، جستجو، match |

```text
مرورگر
  │
  ├─ صفحات UI / درس‌ها  ← فایل‌های استاتیک (dist)
  │
  └─ /api/*  ← PHP می‌خواند از MySQL
```

### چه چیزی کجا ذخیره می‌شود؟

| داده | کجا | نکته |
|------|-----|------|
| مقالات / ژورنال‌ها | **MySQL** | منبع حقیقت برای UI مقالات |
| درس‌ها / topics | باندل فرانت (`dist`) | با `npm run build` می‌آید |
| پیشرفت / یادداشت کاربر | IndexedDB مرورگر | روی سرور نیست |
| JSON خام (`papers.json`) | فقط برای ایمپورت موقت | سرویس عادی از JSON نمی‌خواند |

### چه چیزی عمداً حذف شده؟

- Cloudflare Worker / R2
- بکند Python برای runtime
- سرو کردن `papers.json` از `/src` یا باندل فرانت (حجم و امنیت)

---

## ۲) API — قرارداد و فایل‌ها

### پوشهٔ `api/` روی هاست

```text
public_html/api/
  index.php          ← همهٔ endpointهای خواندنی
  import.php         ← ایمپورت/آپدیت DB (با token)
  router.php         ← فقط برای PHP built-in لوکال
  .htaccess
  schema.sql         ← ساخت جداول (یک‌بار در phpMyAdmin)
  config.php         ← اختیاری؛ لوکال / یا کپی روی سرور
  config.cpanel.php  ← کانفیگ پروداکشن (ترجیح روی هاست)
  config.example.php ← قالب خالی
  lib/
    bootstrap.php    ← PDO، CORS، auth، لود کانفیگ
    papers.php       ← نرمال‌سازی ردیف‌ها
```

### انتخاب کانفیگ (`bootstrap.php`)

| محیط | اولویت |
|------|--------|
| لوکال (`cli` / `cli-server` / `localhost`) | `config.php` |
| هاست (مثلاً `neuron.monyar.ir`) | `config.cpanel.php` اگر باشد، وگرنه `config.php` |

### Endpointهای خواندنی (بدون admin token مگر `read_token` پر باشد)

| متد | مسیر | خروجی |
|-----|------|--------|
| GET | `/api/health` | وضعیت سرویس |
| GET | `/api/meta` | تعداد مقالات/ژورنال + آمار keyword/track |
| GET | `/api/papers?page=&pageSize=&q=&track=&keyword=&category=` | لیست صفحه‌بندی‌شده |
| GET | `/api/papers/{id}` | یک مقاله کامل (با algorithm) |
| POST | `/api/papers/compare` | body: `{ "ids": [...] }` |
| GET | `/api/venues?kind=&q=` | لیست ژورنال/کنفرانس |
| POST | `/api/venues/match` | پیشنهاد venue از title/abstract |

فرانت از `src/lib/api.ts` همین مسیرها را صدا می‌زند (`fetch('/api/...')`).

### ایمپورت (`import.php`) — فقط با `admin_token`

```text
/api/import.php?token=ADMIN_TOKEN&mode=append
/api/import.php?token=ADMIN_TOKEN&mode=replace
```

| `mode` | رفتار | فایل لازم |
|--------|--------|-----------|
| `append` | اضافه/به‌روز؛ **TRUNCATE نمی‌کند** | فقط `papers.append.json.gz` |
| `replace` | پاک کردن جداول papers/venues و بارگذاری کامل | `papers.part*.json.gz` + `venues.json.gz` |

مسیر جستجوی فایل داده (به ترتیب):

- append: `data/private/` سپس `deploy/db-update-append/`
- replace: `data/private/` سپس `deploy/db-update-full/`

**قانون مهم:** در `mode=append` دیگر به `papers.json` کامل fallback نمی‌شود (جلوگیری از ایمپورت اشتباه ۳۰۰۰تایی).

دور توکن در URL هرگز `"` یا `%22` نگذار.

---

## ۳) لوکال — چطور کار می‌کند

### حالت پیشنهادی (بدون PHP روی ویندوز)

روی خیلی از سیستم‌ها PHP در PATH نیست. برای همین Vite به‌صورت پیش‌فرض `/api` را به سرور واقعی پروکسی می‌کند.

```text
npm run dev
  → http://localhost:5173   (UI)
  → /api/*  proxy  →  https://neuron.monyar.ir/api/*
```

فایل: `.env.development`

```env
API_PROXY_TARGET=https://neuron.monyar.ir
```

یعنی UI لوکال است، دادهٔ مقالات از MySQL هاست می‌آید.

```bash
npm install
npm run dev
```

مرورگر: `http://localhost:5173`

اگر `vite` از قبل روشن بود، بعد از تغییر env/proxy یک‌بار Restart کن.

### حالت API کاملاً لوکال (PHP + MySQL روی سیستم خودت)

1. PHP و MySQL را نصب کن و در PATH باشد.
2. دیتابیس بساز و `api/schema.sql` را import کن.
3. `api/config.php` را از روی `config.example.php` بساز (host/user/pass لوکال).
4. فایل محیطی لوکال:

`.env.development.local` (gitignore می‌شود):

```env
API_PROXY_TARGET=http://127.0.0.1:8080
```

5. دو ترمینال:

```bash
npm run api:serve
# php -S 127.0.0.1:8080 -t api api/router.php

npm run dev
```

6. ایمپورت لوکال (اختیاری):

```bash
# داده را در data/private یا deploy/... بگذار
set NEURON_IMPORT_MODE=replace
npm run api:import
# یا: php api/import.php
```

برای append لوکال:

```bash
# در مرورگر یا با query:
# http://127.0.0.1:8080/import.php?token=local-admin-change-me&mode=append
```

توکن پیش‌فرض لوکال در `config.php`: `local-admin-change-me`

### اسکریپت‌های npm مرتبط

| دستور | کار |
|-------|-----|
| `npm run dev` | فرانت + پروکسی API |
| `npm run build` | ساخت `dist/` برای هاست |
| `npm run api:serve` | PHP روی `:8080` |
| `npm run api:import` | ایمپورت CLI |
| `npm run pack:db` | ساخت بسته‌های `deploy/db-update-*` |

---

## ۴) cPanel / پروداکشن — نصب و آپلود

### ساختار نهایی روی هاست

```text
public_html/
  index.html                 ← از dist/
  assets/                    ← از dist/assets/
  .htaccess                  ← از public_html.htaccess.example
  api/
    index.php
    import.php
    .htaccess
    config.cpanel.php        ← DB + admin_token پروداکشن
    lib/...
  deploy/                    ← فقط موقع آپدیت داده؛ بعداً قابل حذف
    db-update-append/
      papers.append.json.gz
    db-update-full/
      papers.part001.json.gz
      ...
      venues.json.gz
```

`data/private/` هم اگر بسازی اوکی است؛ ایمپورت هر دو مسیر را می‌بیند.

### الف) بار اول

1. **بیلد فرانت**

```bash
npm install
npm run build
```

2. **MySQL در cPanel**
   - Database + User + ALL PRIVILEGES
   - phpMyAdmin → Import → `api/schema.sql`

3. **کانفیگ**
   - `api/config.cpanel.php` را با DB واقعی و `admin_token` قوی پر کن
   - `allowed_origins` شامل `https://neuron.monyar.ir` و در صورت نیاز `http://localhost:5173`

4. **آپلود**
   - محتویات `dist/` → ریشهٔ `public_html/`
   - پوشهٔ `api/` → `public_html/api/`
   - `.htaccess` ریشه از `public_html.htaccess.example`

5. **بستهٔ دادهٔ کامل**

```bash
python scripts/pack_db_update.py
```

آپلود `deploy/db-update-full/` به `public_html/deploy/db-update-full/`  
سپس:

```text
https://neuron.monyar.ir/api/import.php?token=ADMIN_TOKEN&mode=replace
```

موفق ≈ `paperCountInDb` برابر تعداد مقالات، `mode: replace`.

6. **امنیت بعد از ایمپورت**
   - `public_html/data/` را حذف کن (اگر ساختی)
   - در صورت تمایل `deploy/` موقت را هم بردار
   - `admin_token` را عمومی نکن؛ `import.php` را می‌توانی موقتاً حذف کنی

### ب) آپدیت فقط UI (درس / استایل)

```bash
npm run build
```

فقط `index.html` + `assets/` را Overwrite کن.  
`api/` و MySQL دست نخورند.

### ج) آپدیت مقالات (سبک — پیشنهادی)

`papers.json` خام (~۳۲MB) را آپلود نکن.

```bash
python scripts/pack_db_update.py --append-last 500
```

1. آپلود `deploy/db-update-append/` به  
   `public_html/deploy/db-update-append/`  
   (یا فقط `papers.append.json.gz` داخل `data/private/`)
2. اگر `import.php` قدیمی است، نسخهٔ جدید را هم آپلود کن
3. لینک:

```text
https://neuron.monyar.ir/api/import.php?token=ADMIN_TOKEN&mode=append
```

خروجی درست:

```json
{
  "ok": true,
  "mode": "append",
  "rowsInFile": 500,
  "newPapers": 500,
  "paperCountInDb": 3500,
  "papersSource": ".../papers.append.json.gz"
}
```

اگر `importedPapers: 3000` و `newPapers: 0` دیدی، فایل append پیدا نشده بود (نسخهٔ قدیمی import یا مسیر اشتباه).

### د) جایگزینی کامل DB

محتوای `deploy/db-update-full/` را آپلود کن و `mode=replace` بزن.  
جداول papers/venues از نو نوشته می‌شوند (پیشرفت کاربر در IndexedDB می‌ماند).

### هـ) آپدیت فقط PHP

فایل‌های `api/*.php` و `api/lib/*` را Overwrite کن.  
`config.cpanel.php` سرور را با نسخهٔ خالی لوکال عوض نکن.

---

## ۵) بسته‌های `deploy/` (آپلود سبک)

| پوشه | کی استفاده شود | حجم تقریبی | mode |
|------|----------------|------------|------|
| `deploy/db-update-append/` | مقالات جدید | ~۰٫۴MB | `append` |
| `deploy/db-update-full/` | نصب اول / فول ریست | ~۳MB تکه‌تکه | `replace` |

بازسازی:

```bash
npm run pack:db
# یا
python scripts/pack_db_update.py --append-last 500
```

جزئیات بیشتر: `deploy/README.md`

---

## ۶) جریان داده از توسعه تا هاست

```text
scripts/fetch_papers.py / expand_papers.py
        ↓
data/private/papers.json  (+ venues.json)
        ↓
scripts/prepare_private_data.py   → meta/index
scripts/pack_db_update.py         → deploy/db-update-*
        ↓
آپلود به cPanel (append یا full)
        ↓
import.php → MySQL
        ↓
UI از /api/meta و /api/papers می‌خواند
```

---

## ۷) سرعت و امنیت (خلاصه عملی)

### سرعت

- لیست مقالات صفحه‌بندی است؛ کل DB یک‌جا به مرورگر نمی‌آید.
- ایندکس‌های MySQL روی track/year و FULLTEXT روی `search_blob` هستند.
- بعد از ایمپورت، JSON از وب حذف می‌شود؛ خواندن از DB است.

### امنیت

- JSON مقالات داخل باندل فرانت نیست.
- ایمپورت فقط با `admin_token`.
- پسورد DB فقط در `config.cpanel.php` / `config.php` روی سرور.
- CORS با `allowed_origins`.
- پیشرفت کاربر فقط سمت کلاینت (IndexedDB).

---

## ۸) عیب‌یابی

| مشکل | علت رایج | کار |
|------|----------|-----|
| لوکال مقالات خالی / خطای API | پروکسی یا vite قدیمی | Restart `npm run dev`؛ چک `.env.development` |
| لوکال به `:8080` می‌رود و fail | PHP نیست/بالا نیست | یا `API_PROXY_TARGET` را به هاست برگردان، یا `api:serve` |
| هاست `unauthorized` | توکن اشتباه / کوتیشن در URL | توکن دقیق بدون `"` |
| append ولی تعداد DB عوض نشد | `papers.append` پیدا نشد؛ فایل قدیمی ۳۰۰۰تایی | مسیر `deploy/db-update-append`؛ `import.php` جدید؛ ببین `papersSource` |
| `Access denied` MySQL | یوزر/پسورد/Privilege | cPanel MySQL + `config.cpanel.php` |
| UI اوکی، رفرش مسیر 404 | `.htaccess` ریشه | SPA rewrite به `index.html` |
| CORS | origin در کانفیگ نیست | دامنه را به `allowed_origins` اضافه کن |

تست سریع هاست:

```text
https://neuron.monyar.ir/api/health
https://neuron.monyar.ir/api/meta
https://neuron.monyar.ir/api/papers?page=1&pageSize=5
```

---

## ۹) چک‌لیست خیلی کوتاه

### لوکال روزمره
1. `npm run dev`
2. باز کردن `localhost:5173` (API از هاست پروکسی می‌شود)

### بار اول هاست
1. `npm run build` + MySQL + schema  
2. آپلود `dist` + `api` + `.htaccess`  
3. `pack:db` → آپلود `db-update-full` → `mode=replace`  
4. پاکسازی پوشهٔ دادهٔ موقت

### آپدیت مقاله
1. `pack:db --append-last N`  
2. آپلود `db-update-append`  
3. `mode=append`  
4. پاکسازی

### آپدیت UI
1. `npm run build`  
2. فقط `dist` روی `public_html`
