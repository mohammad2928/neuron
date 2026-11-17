# نورون / Neuron

اپ یادگیری تعاملی هوش مصنوعی (React + TypeScript) با بکند PHP + MySQL مخصوص cPanel.

سایت: [https://neuron.monyar.ir](https://neuron.monyar.ir)

## معماری خلاصه

| لایه | چیست |
|------|------|
| فرانت | Vite + React — UI، درس‌ها، تم، پیشرفت محلی |
| API | `api/` — PHP روی cPanel |
| دادهٔ مقالات/ژورنال | MySQL (نه JSON داخل باندل) |
| پیشرفت کاربر | IndexedDB مرورگر |

جزئیات کامل لوکال، API، آپلود و آپدیت: **[CPANEL.md](./CPANEL.md)**

## زبان‌ها

- فارسی (fa)
- العربية (ar)
- English (en)
- کوردی (ku)

## امکانات

- ده‌ها موضوع در چند دسته + توضیحات عمیق
- انیمیشن/گام‌های الگوریتم برای مفاهیم اصلی
- مقالات و ژورنال‌ها از API (صفحه‌بندی، فیلتر، مقایسه، پیشنهاد venue)
- جستجو، یادداشت، پیشرفت محلی
- UI راست‌به‌چپ و واکنش‌گرا

## لوکال (پیشنهادی)

بدون نیاز به PHP روی ویندوز؛ `/api` به هاست پروکسی می‌شود:

```bash
npm install
npm run dev
```

باز کن: `http://localhost:5173`  
تنظیم پروکسی: `.env.development` → `API_PROXY_TARGET=https://neuron.monyar.ir`

اگر PHP+MySQL لوکال داری، در `.env.development.local` بنویس:

```env
API_PROXY_TARGET=http://127.0.0.1:8080
```

و جداگانه: `npm run api:serve`

## اسکریپت‌ها

```bash
npm run dev          # فرانت + پروکسی API
npm run build        # خروجی dist برای cPanel
npm run api:serve    # PHP لوکال روی :8080
npm run api:import   # ایمپورت CLI
npm run pack:db      # بسته‌های سبک deploy/db-update-*
```

## آپلود / آپدیت روی cPanel

همه‌چیز به‌صورت جدا مستند شده:

- نصب اول، ساختار هاست، import
- آپدیت فقط UI
- آپدیت مقالات سبک (`mode=append`) و فول (`mode=replace`)
- عیب‌یابی

→ **[CPANEL.md](./CPANEL.md)**  
→ بسته‌های داده: **[deploy/README.md](./deploy/README.md)**
