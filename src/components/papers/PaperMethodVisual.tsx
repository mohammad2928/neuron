import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Props = { track: string; title: string; playing?: boolean }

function phasesFor(track: string) {
  const t = track.toLowerCase()
  if (t.includes('attention') || t.includes('architecture')) {
    return [
      { title: '۱) ورودی توکن/ویژگی', detail: 'داده به نمایش عددی تبدیل می‌شود.' },
      { title: '۲) ساخت Q,K,V یا بلوک', detail: 'نقش‌ها یا لایه‌های معماری ساخته می‌شوند.' },
      { title: '۳) تعامل / توجه', detail: 'امتیازدهی، gating یا مسیردهی اطلاعات.' },
      { title: '۴) به‌روزرسانی حالت', detail: 'Residual/FFN یا دروازه خروجی اعمال می‌شود.' },
      { title: '۵) خروجی و ارزیابی', detail: 'logits/نمونه و معیار کیفیت ثبت می‌شود.' },
    ]
  }
  if (t.includes('generat') || t.includes('vision')) {
    return [
      { title: '۱) شرط / نویز', detail: 'متن، تصویر، یا نویز اولیه آماده می‌شود.' },
      { title: '۲) میدان/گام مولد', detail: 'flow، diffusion step یا next-token/scale.' },
      { title: '۳) نمونه‌برداری', detail: 'از توزیع یا مسیر جریان نمونه گرفته می‌شود.' },
      { title: '۴) پالایش', detail: 'مقیاس ریزتر یا decoders بعدی اعمال می‌شود.' },
      { title: '۵) خروجی نهایی', detail: 'تصویر/ویدئو/متن تولیدشده ارزیابی می‌شود.' },
    ]
  }
  if (t.includes('align') || t.includes('safety')) {
    return [
      { title: '۱) رفتار پایه', detail: 'خروجی مدل قبل از مداخله ثبت می‌شود.' },
      { title: '۲) سیگنال ترجیح/ایمنی', detail: 'پاداش، ترجیح، یا قید ایمنی تعریف می‌شود.' },
      { title: '۳) بهینه‌سازی سیاست', detail: 'RLHF/DPO/قید یا ویرایش وزن اعمال می‌شود.' },
      { title: '۴) آزمون حمله/داوری', detail: 'سناریوهای سخت و داوری ضعیف/قوی.' },
      { title: '۵) رفتار هم‌تراز', detail: 'کاهش آسیب یا افزایش صحت گزارش می‌شود.' },
    ]
  }
  if (t.includes('train') || t.includes('optim')) {
    return [
      { title: '۱) دستهٔ داده', detail: 'mini-batch و پیش‌پردازش.' },
      { title: '۲) Forward + Loss', detail: 'زیان روی توکن‌ها/نمونه‌ها.' },
      { title: '۳) گرادیان', detail: 'پس‌انتشار یا تخمین گرادیان.' },
      { title: '۴) به‌روزرسانی', detail: 'Adam/SGD و زمان‌بندی نرخ یادگیری.' },
      { title: '۵) پایش تعمیم', detail: 'اعتبارسنجی و مقیاس‌دهی.' },
    ]
  }
  return [
    { title: '۱) صورت‌بندی مسئله', detail: 'ورودی/خروجی مقاله مشخص می‌شود.' },
    { title: '۲) بلوک روش', detail: 'عملیات مرکزی روش اجرا می‌شود.' },
    { title: '۳) هدف/قید', detail: 'زیان یا قید بهینه‌سازی اعمال می‌شود.' },
    { title: '۴) استنتاج', detail: 'خروجی مدل یا تحلیل تولید می‌شود.' },
    { title: '۵) مقایسه', detail: 'با خط پایه و معیارها سنجیده می‌شود.' },
  ]
}

export function PaperMethodVisual({ track, title, playing = true }: Props) {
  const phases = useMemo(() => phasesFor(track), [track])
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setPhase((p) => (p + 1) % phases.length), 1700)
    return () => window.clearInterval(id)
  }, [playing, phases.length])

  const p = phases[phase]

  return (
    <div className="paper-visual">
      <div className="complete-attn-phases">
        {phases.map((item, i) => (
          <button
            key={item.title}
            type="button"
            className={`phase-chip${i === phase ? ' is-on' : ''}${i < phase ? ' is-done' : ''}`}
            onClick={() => setPhase(i)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 560 260" className="viz-svg paper-visual-svg">
        <defs>
          <linearGradient id="pvGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="544" height="244" rx="18" fill="#0b1524" stroke="#1e293b" />
        <rect x="24" y="24" width="200" height="54" rx="12" fill="url(#pvGlow)" stroke="#2dd4bf" />
        <text x="124" y="48" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="Vazirmatn">
          {title.slice(0, 34)}
          {title.length > 34 ? '…' : ''}
        </text>
        <text x="124" y="66" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
          track: {track}
        </text>

        {[0, 1, 2, 3, 4].map((i) => {
          const x = 40 + i * 100
          const on = i <= phase
          return (
            <g key={i}>
              {i < 4 && (
                <motion.line
                  x1={x + 56}
                  y1={140}
                  x2={x + 100}
                  y2={140}
                  stroke={i < phase ? '#2dd4bf' : '#334155'}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: on ? 1 : 0.15 }}
                />
              )}
              <motion.circle
                cx={x + 28}
                cy={140}
                r={i === phase ? 22 : 16}
                fill={on ? '#134e4a' : '#0f172a'}
                stroke={i === phase ? '#2dd4bf' : on ? '#14b8a6' : '#475569'}
                strokeWidth={i === phase ? 3 : 1.5}
                animate={{ scale: i === phase ? [1, 1.06, 1] : 1 }}
                transition={{ repeat: i === phase ? Infinity : 0, duration: 1.2 }}
              />
              <text x={x + 28} y={145} textAnchor="middle" fill="#e2e8f0" fontSize="12" fontFamily="JetBrains Mono">
                {i + 1}
              </text>
              <text x={x + 28} y={190} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="Vazirmatn">
                {phases[i]?.title.replace(/^\d+\)\s*/, '').slice(0, 12)}
              </text>
            </g>
          )
        })}

        <AnimatePresence mode="wait">
          <motion.rect
            key={phase}
            x="250"
            y="30"
            width="280"
            height="70"
            rx="12"
            fill="#111827"
            stroke="#334155"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          />
        </AnimatePresence>
        <text x="390" y="58" textAnchor="middle" fill="#99f6e4" fontSize="12" fontFamily="Vazirmatn">
          {p.title}
        </text>
        <text x="390" y="78" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Vazirmatn">
          {p.detail.slice(0, 48)}
        </text>
      </svg>

      <div className="complete-attn-story">
        <strong>{p.title}</strong>
        <p>{p.detail}</p>
      </div>
    </div>
  )
}
