import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { VisualFrame } from './shared'

const POINTS = [
  { id: 'A', x: 70, y: 170 },
  { id: 'B', x: 95, y: 140 },
  { id: 'C', x: 320, y: 70 },
  { id: 'D', x: 350, y: 95 },
]

const PHASES = [
  {
    title: '۱) نقاط داده',
    formula: 'X = {A,B,C,D} ، K=2',
    explain: 'چهار نقطه داریم. هنوز گروهی نیست. K=2 یعنی دو خوشه می‌خواهیم.',
  },
  {
    title: '۲) مراکز اولیه',
    formula: 'μ1=A(1,1) ، μ2=C(5,5)',
    explain: 'دو مرکز می‌گذاریم: یکی روی A و یکی روی C. این فقط شروع است.',
  },
  {
    title: '۳) فاصله‌ها',
    formula: 'd²=(x−μx)²+(y−μy)²',
    explain: 'برای هر نقطه فاصله تا هر دو مرکز را حساب می‌کنیم. عدد کوچک‌تر = نزدیک‌تر.',
  },
  {
    title: '۴) تخصیص خوشه',
    formula: 'c_i = argmin_j d²',
    explain: 'A و B فیروزه‌ای؛ C و D کهربایی. هر نقطه نزدیک‌ترین مرکز را گرفت.',
  },
  {
    title: '۵) میانگین جدید',
    formula: 'μ_j = mean(points in j)',
    explain: 'هر مرکز می‌رود وسط اعضای خوشه‌اش: μ1≈(1,1.5) و μ2≈(5.5,5).',
  },
  {
    title: '۶) همگرایی',
    formula: 'تخصیص ثابت → توقف',
    explain: 'دوباره تخصیص می‌دهیم؛ چیزی عوض نمی‌شود → الگوریتم تمام.',
  },
]

export function CompleteKMeans({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useState(0)
  const p = PHASES[phase]

  useEffect(() => {
    if (!playing) return
    const t = window.setInterval(() => setPhase((x) => (x + 1) % PHASES.length), 2100)
    return () => window.clearInterval(t)
  }, [playing])

  const centroids = useMemo(() => {
    if (phase < 1) return [] as { id: string; x: number; y: number; color: string }[]
    if (phase < 4) {
      return [
        { id: 'μ1', x: 70, y: 170, color: '#2dd4bf' },
        { id: 'μ2', x: 320, y: 70, color: '#fbbf24' },
      ]
    }
    return [
      { id: 'μ1', x: 82, y: 155, color: '#2dd4bf' },
      { id: 'μ2', x: 335, y: 82, color: '#fbbf24' },
    ]
  }, [phase])

  return (
    <VisualFrame caption={p.explain}>
      <div className="complete-attn">
        <div className="complete-attn-phases">
          {PHASES.map((item, i) => (
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
        <div className="complete-attn-formula">{p.formula}</div>

        <svg viewBox="0 0 420 240" className="viz-svg">
          <rect x={10} y={10} width={400} height={220} rx={16} fill="#0b1524" stroke="#1e293b" />

          {phase >= 2 && (
            <text x={20} y={28} fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">
              B→μ1:1 &nbsp; B→μ2:25 &nbsp;|&nbsp; D→μ1:41 &nbsp; D→μ2:1
            </text>
          )}

          {phase >= 2 &&
            phase <= 3 &&
            POINTS.flatMap((pt) =>
              centroids.map((c) => (
                <line
                  key={`${pt.id}-${c.id}`}
                  x1={pt.x}
                  y1={pt.y}
                  x2={c.x}
                  y2={c.y}
                  stroke={c.color}
                  strokeOpacity={0.28}
                  strokeDasharray="4 4"
                />
              )),
            )}

          {centroids.map((c) => (
            <g key={c.id}>
              <motion.circle
                cx={c.x}
                cy={c.y}
                r={14}
                fill={c.color}
                stroke="#0f172a"
                strokeWidth={3}
                animate={{ cx: c.x, cy: c.y }}
                transition={{ type: 'spring', stiffness: 90, damping: 14 }}
              />
              <text
                x={c.x}
                y={c.y - 20}
                textAnchor="middle"
                fill={c.color}
                fontSize="12"
                fontFamily="JetBrains Mono"
              >
                {c.id}
              </text>
            </g>
          ))}

          {POINTS.map((pt) => {
            const cluster = phase >= 3 ? (pt.id === 'A' || pt.id === 'B' ? 0 : 1) : -1
            const fill = cluster === 0 ? '#2dd4bf' : cluster === 1 ? '#fbbf24' : '#94a3b8'
            return (
              <g key={pt.id}>
                <motion.circle
                  cx={pt.x}
                  cy={pt.y}
                  r={11}
                  fill={fill}
                  stroke="#e2e8f0"
                  strokeWidth={1.5}
                  animate={{ scale: phase === 0 ? [1, 1.08, 1] : 1 }}
                  transition={{ repeat: phase === 0 ? Infinity : 0, duration: 1.4 }}
                />
                <text
                  x={pt.x}
                  y={pt.y + 28}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="12"
                  fontFamily="Vazirmatn"
                >
                  {pt.id}
                </text>
              </g>
            )
          })}

          <AnimatePresence>
            {phase >= 5 && (
              <motion.text
                key="done"
                x={210}
                y={222}
                textAnchor="middle"
                fill="#99f6e4"
                fontSize="13"
                fontFamily="Vazirmatn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                همگرا شد: ۲ خوشهٔ نهایی
              </motion.text>
            )}
          </AnimatePresence>
        </svg>

        <div className="complete-attn-story">
          <strong>{p.title}</strong>
          <p>{p.explain}</p>
        </div>
      </div>
    </VisualFrame>
  )
}

const KNN_PHASES = [
  {
    title: '۱) دادهٔ آموزش',
    formula: 'نقاط برچسب‌دار',
    explain: 'چند نقطهٔ قرمز و آبی داریم که برچسب‌شان معلوم است.',
  },
  {
    title: '۲) نقطهٔ پرسش',
    formula: 'q = نقطهٔ جدید',
    explain: 'نقطهٔ سفید همان نمونه‌ای است که باید طبقه‌بندی شود.',
  },
  {
    title: '۳) فاصله‌ها',
    formula: 'مرتب‌سازی d(q, x_i)',
    explain: 'فاصله تا همه را حساب می‌کنیم و نزدیک‌ترین‌ها را پیدا می‌کنیم.',
  },
  {
    title: '۴) K همسایه',
    formula: 'K = 3',
    explain: 'سه همسایهٔ نزدیک داخل دایره می‌آیند.',
  },
  {
    title: '۵) رأی اکثریت',
    formula: 'ŷ = majority',
    explain: '۲ قرمز و ۱ آبی → خروجی قرمز. الگوریتم KNN تمام.',
  },
]

export function CompleteKnn({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useState(0)
  const p = KNN_PHASES[phase]

  useEffect(() => {
    if (!playing) return
    const t = window.setInterval(() => setPhase((x) => (x + 1) % KNN_PHASES.length), 1900)
    return () => window.clearInterval(t)
  }, [playing])

  const train = [
    { x: 80, y: 150, c: '#fb7185' },
    { x: 110, y: 120, c: '#fb7185' },
    { x: 300, y: 80, c: '#38bdf8' },
    { x: 330, y: 110, c: '#38bdf8' },
  ]
  const q = { x: 100, y: 145 }

  return (
    <VisualFrame caption={p.explain}>
      <div className="complete-attn">
        <div className="complete-attn-phases">
          {KNN_PHASES.map((item, i) => (
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
        <div className="complete-attn-formula">{p.formula}</div>
        <svg viewBox="0 0 420 240" className="viz-svg">
          <rect x={10} y={10} width={400} height={220} rx={16} fill="#0b1524" stroke="#1e293b" />
          {train.map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r={10} fill={pt.c} stroke="#e2e8f0" />
          ))}
          {phase >= 1 && (
            <motion.circle
              cx={q.x}
              cy={q.y}
              r={12}
              fill="#e2e8f0"
              stroke="#2dd4bf"
              strokeWidth={3}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}
          {phase >= 3 && (
            <motion.circle
              cx={q.x}
              cy={q.y}
              r={phase >= 4 ? 55 : 35}
              fill="none"
              stroke="#2dd4bf"
              strokeDasharray="5 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
            />
          )}
          {phase >= 4 && (
            <text x={210} y={220} textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="JetBrains Mono">
              neighbors: R, R, B
            </text>
          )}
          {phase >= 5 && (
            <text x={210} y={40} textAnchor="middle" fill="#fb7185" fontSize="14" fontFamily="Vazirmatn">
              رأی = قرمز
            </text>
          )}
        </svg>
        <div className="complete-attn-story">
          <strong>{p.title}</strong>
          <p>{p.explain}</p>
        </div>
      </div>
    </VisualFrame>
  )
}
