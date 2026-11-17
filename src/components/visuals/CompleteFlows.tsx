import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { VisualFrame } from './shared'

type Phase = { title: string; formula: string; explain: string }

function PhaseStrip({
  phases,
  phase,
  setPhase,
}: {
  phases: Phase[]
  phase: number
  setPhase: (n: number) => void
}) {
  return (
    <div className="complete-attn-phases">
      {phases.map((p, i) => (
        <button
          key={p.title}
          type="button"
          className={`phase-chip${i === phase ? ' is-on' : ''}${i < phase ? ' is-done' : ''}`}
          onClick={() => setPhase(i)}
        >
          {p.title}
        </button>
      ))}
    </div>
  )
}

function useAutoPhase(playing: boolean, count: number, ms = 2000) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    if (!playing) return
    const t = window.setInterval(() => setPhase((p) => (p + 1) % count), ms)
    return () => window.clearInterval(t)
  }, [playing, count, ms])
  return [phase, setPhase] as const
}

function Story({ phase }: { phase: Phase }) {
  return (
    <div className="complete-attn-story">
      <strong>{phase.title}</strong>
      <p>{phase.explain}</p>
      <div className="complete-attn-formula">{phase.formula}</div>
    </div>
  )
}

const QKV_PHASES: Phase[] = [
  {
    title: '۱) Embedding',
    formula: 'x = embedding(token)',
    explain: 'هر کلمه یک بردار عددی دارد. این نقطهٔ شروع است.',
  },
  {
    title: '۲) سه ضرب',
    formula: 'Q=xW_Q  K=xW_K  V=xW_V',
    explain: 'همان بردار را در سه ماتریس مختلف ضرب می‌کنیم تا سه نقش بسازد.',
  },
  {
    title: '۳) معنی نقش‌ها',
    formula: 'Q=سؤال  K=برچسب  V=محتوا',
    explain: 'جست‌وجو از محتوا جدا می‌شود. این جداسازی قلب Attention است.',
  },
  {
    title: '۴) آمادهٔ Attention',
    formula: 'Attention(Q,K,V)',
    explain: 'حالا این سه تا می‌روند داخل فرمول Attention تا وزن و خروجی ساخته شود.',
  },
]

export function CompleteQkv({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useAutoPhase(playing, QKV_PHASES.length)
  const p = QKV_PHASES[phase]
  const roles = [
    { lab: 'Q', color: '#2dd4bf', y: 50, sub: 'چی می‌خواهم؟' },
    { lab: 'K', color: '#38bdf8', y: 120, sub: 'چی برای پیدا شدن دارم؟' },
    { lab: 'V', color: '#fbbf24', y: 190, sub: 'چه محتوایی می‌دهم؟' },
  ]

  return (
    <VisualFrame caption={p.explain}>
      <div className="complete-attn">
        <PhaseStrip phases={QKV_PHASES} phase={phase} setPhase={setPhase} />
        <svg viewBox="0 0 480 280" className="viz-svg">
          <rect x={20} y={110} width={90} height={55} rx={12} fill="#0b1524" stroke="#94a3b8" strokeWidth={2} />
          <text x={65} y={143} textAnchor="middle" fill="#e2e8f0" fontSize="14" fontFamily="JetBrains Mono">
            xᵢ
          </text>

          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.text
                key="a0"
                x={200}
                y={140}
                fill="#94a3b8"
                fontSize="14"
                fontFamily="Vazirmatn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                فقط یک بردار ورودی
              </motion.text>
            )}
            {phase >= 1 && (
              <motion.g key="split" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {roles.map((r, i) => (
                  <g key={r.lab}>
                    <motion.line
                      x1={110}
                      y1={138}
                      x2={200}
                      y2={r.y + 22}
                      stroke={r.color}
                      strokeWidth={2}
                      strokeDasharray="5 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: phase >= 1 ? 1 : 0 }}
                      transition={{ delay: i * 0.12, duration: 0.5 }}
                    />
                    <motion.rect
                      x={205}
                      y={r.y}
                      width={200}
                      height={48}
                      rx={12}
                      fill="#0b1524"
                      stroke={r.color}
                      strokeWidth={phase >= 2 ? 2.5 : 1.5}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.12 }}
                    />
                    <text x={240} y={r.y + 20} fill={r.color} fontSize="16" fontWeight="700" fontFamily="Syne">
                      {r.lab}
                    </text>
                    <text x={240} y={r.y + 38} fill="#94a3b8" fontSize="11" fontFamily="Vazirmatn">
                      {phase >= 2 ? r.sub : `× W_${r.lab}`}
                    </text>
                  </g>
                ))}
              </motion.g>
            )}
            {phase === 3 && (
              <motion.rect
                key="box"
                x={420}
                y={100}
                width={50}
                height={80}
                rx={10}
                fill="#134e4a"
                stroke="#2dd4bf"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </AnimatePresence>
        </svg>
        <Story phase={p} />
      </div>
    </VisualFrame>
  )
}

const SOFT_PHASES: Phase[] = [
  {
    title: '۱) امتیاز خام',
    formula: 'z = [2, 0, 0]',
    explain: 'سه عدد خام از مقایسهٔ Query با Keyها. هنوز درصد نیستند.',
  },
  {
    title: '۲) e به توان z',
    formula: 'eᶻ ≈ [7.39, 1, 1]',
    explain: 'نما همه را مثبت می‌کند و فاصله‌ها را بزرگ‌تر نشان می‌دهد.',
  },
  {
    title: '۳) تقسیم بر جمع',
    formula: 'αᵢ = eᶻⁱ / Σ eᶻʲ',
    explain: 'هر کدام را بر جمع کل تقسیم می‌کنیم تا مجموع ۱ شود.',
  },
  {
    title: '۴) وزن Attention',
    formula: 'α ≈ [0.79, 0.11, 0.11]',
    explain: 'حالا می‌دانیم حدود ۷۹٪ توجه به کلمهٔ اول برود.',
  },
]

export function CompleteSoftmax({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useAutoPhase(playing, SOFT_PHASES.length, 1800)
  const p = SOFT_PHASES[phase]
  const bars =
    phase === 0
      ? [2, 0, 0]
      : phase === 1
        ? [7.39, 1, 1]
        : phase >= 2
          ? [0.79, 0.11, 0.11]
          : [0, 0, 0]
  const max = Math.max(...bars, 0.01)

  return (
    <VisualFrame caption={p.explain}>
      <div className="complete-attn">
        <PhaseStrip phases={SOFT_PHASES} phase={phase} setPhase={setPhase} />
        <svg viewBox="0 0 420 220" className="viz-svg">
          {bars.map((v, i) => {
            const h = 20 + (v / max) * 140
            return (
              <g key={i}>
                <motion.rect
                  x={60 + i * 110}
                  y={180 - h}
                  width={70}
                  height={h}
                  rx={10}
                  fill={i === 0 ? '#2dd4bf' : '#38bdf8'}
                  initial={{ height: 20, y: 160 }}
                  animate={{ height: h, y: 180 - h }}
                  transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                />
                <text
                  x={95 + i * 110}
                  y={200}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="12"
                  fontFamily="JetBrains Mono"
                >
                  {v}
                </text>
                <text
                  x={95 + i * 110}
                  y={30}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="13"
                  fontFamily="Vazirmatn"
                >
                  کلمه {i + 1}
                </text>
              </g>
            )
          })}
          {phase >= 3 && (
            <text x={210} y={18} textAnchor="middle" fill="#99f6e4" fontSize="13" fontFamily="Vazirmatn">
              جمع وزن‌ها = ۱
            </text>
          )}
        </svg>
        <Story phase={p} />
      </div>
    </VisualFrame>
  )
}

const MH_PHASES: Phase[] = [
  {
    title: '۱) چند سر',
    formula: 'h سر موازی',
    explain: 'به‌جای یک Attention، چند Attention هم‌زمان روی تکه‌های مختلف فضا کار می‌کنند.',
  },
  {
    title: '۲) هر سر جدا',
    formula: 'headᵢ = Attention(QWᵢQ, KWᵢK, VWᵢV)',
    explain: 'هر سر ممکن است روی چیز دیگری تمرکز کند: نحو، مرجع ضمیر، معنا…',
  },
  {
    title: '۳) Concat',
    formula: 'Concat(head₁…headₕ)',
    explain: 'خروجی سرها را کنار هم می‌چسبانیم تا یک بردار بلند شود.',
  },
  {
    title: '۴) W_O',
    formula: 'MultiHead = Concat · W_O',
    explain: 'با یک ماتریس مخلوط‌کننده به بعد اصلی مدل برمی‌گردیم. تمام.',
  },
]

export function CompleteMultiHead({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useAutoPhase(playing, MH_PHASES.length)
  const p = MH_PHASES[phase]
  const heads = [
    { name: 'Head1', focus: 'نحو', color: '#2dd4bf' },
    { name: 'Head2', focus: 'مرجع', color: '#38bdf8' },
    { name: 'Head3', focus: 'معنا', color: '#fbbf24' },
    { name: 'Head4', focus: 'موضع', color: '#fb7185' },
  ]

  return (
    <VisualFrame caption={p.explain}>
      <div className="complete-attn">
        <PhaseStrip phases={MH_PHASES} phase={phase} setPhase={setPhase} />
        <div className="heads-grid">
          {heads.map((h, i) => (
            <motion.div
              key={h.name}
              className="head-card"
              style={{ borderColor: h.color }}
              animate={{
                opacity: phase === 0 || phase === 1 ? 1 : phase >= 2 ? 0.55 : 1,
                scale: phase === 1 ? 1.03 : 1,
                boxShadow: playing && phase <= 1 ? `0 0 20px ${h.color}33` : 'none',
              }}
              transition={{ delay: i * 0.08 }}
            >
              <strong style={{ color: h.color }}>{h.name}</strong>
              <span>{h.focus}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="concat-bar"
          animate={{
            opacity: phase >= 2 ? 1 : 0.25,
            scale: phase >= 2 ? 1 : 0.96,
          }}
        >
          {phase >= 3 ? 'Concat → W_O → خروجی نهایی' : 'Concat(head₁…headₕ)'}
        </motion.div>
        <Story phase={p} />
      </div>
    </VisualFrame>
  )
}

const GD_PHASES: Phase[] = [
  {
    title: '۱) شروع',
    formula: 'θ₀ = حدس اولیه',
    explain: 'یک مقدار تصادفی برای پارامتر می‌گذاریم. هنوز خوب نیست.',
  },
  {
    title: '۲) زیان',
    formula: 'L(θ) = خطا',
    explain: 'مدل را اجرا می‌کنیم و می‌بینیم چقدر اشتباه کرده (ارتفاع روی تپه).',
  },
  {
    title: '۳) گرادیان',
    formula: 'g = ∇L(θ)',
    explain: 'شیب را حساب می‌کنیم: اگر θ را زیاد کنیم، خطا کدام طرف می‌رود؟',
  },
  {
    title: '۴) قدم',
    formula: 'θ ← θ − η g',
    explain: 'خلاف شیب یک قدم برمی‌داریم. η = اندازهٔ قدم (learning rate).',
  },
  {
    title: '۵) تکرار',
    formula: 'تا وقتی L کوچک شود',
    explain: 'همین حلقه را بارها تکرار می‌کنیم تا نزدیک کف دره (کمینه) برسیم.',
  },
]

export function CompleteGradient({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useAutoPhase(playing, GD_PHASES.length, 1700)
  const p = GD_PHASES[phase]
  const xs = [40, 100, 160, 230, 300, 360]
  const ballX = [80, 140, 200, 260, 310][Math.min(phase, 4)]
  const ballY = [70, 110, 145, 175, 195][Math.min(phase, 4)]

  return (
    <VisualFrame caption={p.explain}>
      <div className="complete-attn">
        <PhaseStrip phases={GD_PHASES} phase={phase} setPhase={setPhase} />
        <svg viewBox="0 0 420 250" className="viz-svg">
          <path
            d="M30,40 C90,40 110,200 210,200 S330,60 390,50"
            fill="none"
            stroke="#475569"
            strokeWidth={3}
          />
          <text x={30} y={30} fill="#94a3b8" fontSize="12" fontFamily="Vazirmatn">
            زیان L
          </text>
          <text x={360} y={240} fill="#94a3b8" fontSize="12" fontFamily="Vazirmatn">
            پارامتر θ
          </text>
          {xs.map((x, i) => (
            <circle key={i} cx={x + 20} cy={40 + i * 28} r={2} fill="#334155" />
          ))}
          <motion.circle
            cx={ballX}
            cy={ballY}
            r={12}
            fill="#2dd4bf"
            animate={{ cx: ballX, cy: ballY }}
            transition={{ type: 'spring', stiffness: 90, damping: 14 }}
          />
          {phase >= 3 && (
            <motion.path
              d={`M${ballX},${ballY} l25,18`}
              stroke="#fbbf24"
              strokeWidth={3}
              markerEnd="url(#arrow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24" />
            </marker>
          </defs>
        </svg>
        <Story phase={p} />
      </div>
    </VisualFrame>
  )
}

const GPT_PHASES: Phase[] = [
  {
    title: '۱) توکن کن',
    formula: 'text → token ids',
    explain: 'جمله را به تکه‌های عددی تبدیل می‌کنیم.',
  },
  {
    title: '۲) Embedding',
    formula: 'id → بردار + موضع',
    explain: 'هر توکن معنی و جای خودش را در جمله می‌گیرد.',
  },
  {
    title: '۳) لایه‌های Decoder',
    formula: 'Masked Attn + FFN × N',
    explain: 'چند لایه Transformer فقط به گذشته نگاه می‌کنند و بافت می‌سازند.',
  },
  {
    title: '۴) احتمال بعدی',
    formula: 'softmax(W h_t)',
    explain: 'برای همهٔ واژه‌نامه یک احتمال می‌سازیم: کلمهٔ بعدی چیست؟',
  },
  {
    title: '۵) بچسبان و تکرار',
    formula: 'append → loop',
    explain: 'یک توکن انتخاب می‌کنیم، به متن اضافه می‌کنیم، دوباره از اول… تا توقف.',
  },
]

export function CompleteGpt({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useAutoPhase(playing, GPT_PHASES.length, 1900)
  const p = GPT_PHASES[phase]
  const tokens = ['امروز', 'هوا', '؟']
  const shown = phase === 0 ? tokens.slice(0, 2) : phase >= 4 ? [...tokens.slice(0, 2), 'خوب'] : tokens.slice(0, 2)

  return (
    <VisualFrame caption={p.explain}>
      <div className="complete-attn">
        <PhaseStrip phases={GPT_PHASES} phase={phase} setPhase={setPhase} />
        <svg viewBox="0 0 460 240" className="viz-svg">
          {shown.map((tok, i) => (
            <motion.g key={`${tok}-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <rect
                x={30 + i * 100}
                y={40}
                width={88}
                height={44}
                rx={12}
                fill="#0b1524"
                stroke={i === shown.length - 1 && phase >= 4 ? '#2dd4bf' : '#64748b'}
                strokeWidth={2}
              />
              <text
                x={74 + i * 100}
                y={68}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="14"
                fontFamily="Vazirmatn"
              >
                {tok}
              </text>
            </motion.g>
          ))}

          {phase >= 1 && phase < 4 && (
            <motion.rect
              x={30}
              y={110}
              width={280}
              height={50}
              rx={12}
              fill="#0b1524"
              stroke="#38bdf8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
          {phase >= 1 && phase < 4 && (
            <text x={170} y={140} textAnchor="middle" fill="#7dd3fc" fontSize="13" fontFamily="Vazirmatn">
              {phase === 1 ? 'Embedding + Position' : phase === 2 ? 'N × Decoder Block' : 'Logits → Softmax'}
            </text>
          )}

          {phase === 3 && (
            <g>
              {[
                { w: 'خوب', p: '0.45' },
                { w: 'بد', p: '0.20' },
                { w: '؟', p: '0.15' },
              ].map((row, i) => (
                <text
                  key={row.w}
                  x={340}
                  y={50 + i * 28}
                  fill="#94a3b8"
                  fontSize="13"
                  fontFamily="JetBrains Mono"
                >
                  {row.w} {row.p}
                </text>
              ))}
            </g>
          )}
        </svg>
        <Story phase={p} />
      </div>
    </VisualFrame>
  )
}
