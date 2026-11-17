import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { VisualFrame } from './shared'

const TOKENS = ['من', 'کتاب', 'خواندم']
const RAW = [
  [8, 2, 1],
  [3, 7, 2],
  [1, 2, 9],
]
const SCALE = 2
const SCALED = RAW.map((row) => row.map((v) => +(v / SCALE).toFixed(2)))
const SOFT = [
  [0.84, 0.11, 0.05],
  [0.12, 0.78, 0.1],
  [0.04, 0.08, 0.88],
]
const VALUES = [
  [1.0, 0.0],
  [0.0, 1.0],
  [1.0, 1.0],
]
const OUT = [
  [0.89, 0.16],
  [0.22, 0.88],
  [0.96, 0.96],
]

const PHASES = [
  {
    title: '۱) توکن و Embedding',
    formula: 'X = Embed(tokens)',
    explain: 'سه توکن وارد می‌شوند. هر کدام بردار embedding می‌گیرد. هنوز Attention نیست؛ فقط ورودی عددی.',
  },
  {
    title: '۲) ساخت Q, K, V',
    formula: 'Q=XW_Q  K=XW_K  V=XW_V',
    explain: 'از یک embedding سه نقش ساخته می‌شود: سؤال، برچسب، محتوا. این جداسازی قلب Attention است.',
  },
  {
    title: '۳) جدول امتیاز QKᵀ',
    formula: 'Score = Q Kᵀ',
    explain: 'هر سطر یک Query است. عدد بزرگ‌تر یعنی آن Key مهم‌تر است. این جدول خام است.',
  },
  {
    title: '۴) مقیاس ÷√dₖ',
    formula: `Score ← Score / ${SCALE}`,
    explain: 'اعداد را آرام می‌کنیم تا Softmax منفجر نشود و گرادیان پایدار بماند.',
  },
  {
    title: '۵) Softmax سطری',
    formula: 'α = softmax(Score)',
    explain: 'هر سطر به درصد توجه تبدیل می‌شود. جمع هر سطر ≈ ۱.',
  },
  {
    title: '۶) ترکیب با V و خروجی',
    formula: 'Out = α V',
    explain: 'وزن‌ها در Value ضرب می‌شوند. خروجی = مخلوط وزن‌دار محتواها. الگوریتم تمام است.',
  },
]

function Heat({
  data,
  x,
  y,
  label,
  mode,
}: {
  data: number[][]
  x: number
  y: number
  label: string
  mode: 'raw' | 'scaled' | 'soft'
}) {
  const max = Math.max(...data.flat().map(Math.abs), 0.01)
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={-8} fill="#94a3b8" fontSize="10" fontFamily="Vazirmatn">
        {label}
      </text>
      {data.map((row, r) =>
        row.map((v, c) => {
          const a = 0.12 + (Math.abs(v) / max) * 0.75
          const fill =
            mode === 'raw'
              ? `rgba(56,189,248,${a})`
              : mode === 'scaled'
                ? `rgba(251,191,36,${a})`
                : `rgba(45,212,191,${a})`
          return (
            <g key={`${r}-${c}`}>
              <motion.rect
                x={c * 46}
                y={r * 38}
                width={42}
                height={34}
                rx={7}
                fill={fill}
                stroke="#334155"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (r * row.length + c) * 0.03 }}
              />
              <text
                x={c * 46 + 21}
                y={r * 38 + 22}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="11"
                fontFamily="JetBrains Mono"
              >
                {v}
              </text>
            </g>
          )
        }),
      )}
    </g>
  )
}

export function CompleteAttention({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useState(0)
  const p = PHASES[phase]

  useEffect(() => {
    if (!playing) return
    const t = window.setInterval(() => setPhase((x) => (x + 1) % PHASES.length), 2400)
    return () => window.clearInterval(t)
  }, [playing])

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

        <svg viewBox="0 0 560 320" className="viz-svg">
          <rect x="6" y="6" width="548" height="308" rx="16" fill="#070f1a" stroke="#1e293b" />

          {TOKENS.map((tok, i) => (
            <g key={tok}>
              <motion.rect
                x={18}
                y={48 + i * 70}
                width={72}
                height={44}
                rx={11}
                fill="#0b1524"
                stroke={phase === 0 ? '#2dd4bf' : '#475569'}
                strokeWidth={phase === 0 ? 2.5 : 1.4}
                animate={{ y: 48 + i * 70 }}
              />
              <text x={54} y={75 + i * 70} textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="Vazirmatn">
                {tok}
              </text>
            </g>
          ))}

          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.g key="p0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {[0, 1, 2].map((i) => (
                  <g key={i}>
                    <motion.line
                      x1={90}
                      y1={70 + i * 70}
                      x2={150}
                      y2={70 + i * 70}
                      stroke="#38bdf8"
                      strokeDasharray="5 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                    />
                    <rect x={150} y={52 + i * 70} width={130} height={40} rx={10} fill="#0b1524" stroke="#38bdf8" />
                    <text x={215} y={77 + i * 70} textAnchor="middle" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono">
                      emb[{i}] = x{i}
                    </text>
                  </g>
                ))}
                <text x={360} y={140} fill="#94a3b8" fontSize="12" fontFamily="Vazirmatn">
                  هنوز فقط ورودی عددی
                </text>
              </motion.g>
            )}

            {phase === 1 && (
              <motion.g key="p1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {[
                  { lab: 'Q', c: '#2dd4bf', x: 140, s: 'سؤال' },
                  { lab: 'K', c: '#38bdf8', x: 250, s: 'برچسب' },
                  { lab: 'V', c: '#fbbf24', x: 360, s: 'محتوا' },
                ].map((b, i) => (
                  <g key={b.lab}>
                    <motion.rect
                      x={b.x}
                      y={60}
                      width={90}
                      height={170}
                      rx={14}
                      fill="#0b1524"
                      stroke={b.c}
                      strokeWidth={2.5}
                      initial={{ y: 80, opacity: 0 }}
                      animate={{ y: 60, opacity: 1 }}
                      transition={{ delay: i * 0.12 }}
                    />
                    <text x={b.x + 45} y={110} textAnchor="middle" fill={b.c} fontSize="26" fontFamily="Syne" fontWeight="700">
                      {b.lab}
                    </text>
                    <text x={b.x + 45} y={145} textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="Vazirmatn">
                      {b.s}
                    </text>
                    <text x={b.x + 45} y={185} textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="JetBrains Mono">
                      3 × d
                    </text>
                  </g>
                ))}
              </motion.g>
            )}

            {phase === 2 && <Heat key="p2" data={RAW} x={160} y={55} label="امتیاز خام QKᵀ" mode="raw" />}
            {phase === 3 && <Heat key="p3" data={SCALED} x={160} y={55} label={`پس از ÷ ${SCALE}`} mode="scaled" />}
            {phase === 4 && <Heat key="p4" data={SOFT} x={160} y={55} label="وزن Softmax (Σ≈1)" mode="soft" />}

            {phase === 5 && (
              <motion.g key="p5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Heat data={SOFT} x={110} y={40} label="α" mode="soft" />
                <text x={275} y={110} fill="#94a3b8" fontSize="22" fontFamily="Syne">
                  ×
                </text>
                <Heat data={VALUES} x={310} y={55} label="V" mode="scaled" />
                <rect x={110} y={230} width={360} height={55} rx={12} fill="#134e4a" stroke="#2dd4bf" />
                <text x={290} y={255} textAnchor="middle" fill="#99f6e4" fontSize="12" fontFamily="JetBrains Mono">
                  out ≈ [{OUT[0].join(', ')}] , [{OUT[1].join(', ')}] , [{OUT[2].join(', ')}]
                </text>
                <text x={290} y={275} textAnchor="middle" fill="#5eead4" fontSize="11" fontFamily="Vazirmatn">
                  هر سطر = جمع وزن‌دار Valueها
                </text>
              </motion.g>
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
