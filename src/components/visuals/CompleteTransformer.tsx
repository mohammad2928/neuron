import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { VisualFrame } from './shared'

const PHASES = [
  {
    title: '۱) توکن‌سازی',
    formula: 'text → token ids',
    explain: 'متن مبدأ به شناسهٔ توکن تبدیل می‌شود. معماری از اینجا شروع می‌کند.',
  },
  {
    title: '۲) Embedding + Position',
    formula: 'X₀ = E + P',
    explain: 'بردار معنی + سیگنال ترتیب. بدون Position، Attention ترتیب را نمی‌فهمد.',
  },
  {
    title: '۳) Encoder × N',
    formula: 'Self-Attn + FFN (+Res/LN)',
    explain: 'هر لایه: مشورت با همهٔ توکن‌های ورودی، سپس FFN. خروجی H بافت‌دار است.',
  },
  {
    title: '۴) Decoder Masked',
    formula: 'Masked Self-Attn',
    explain: 'Decoder فقط گذشته را می‌بیند. Mask جلوی نشت آینده را می‌گیرد.',
  },
  {
    title: '۵) Cross-Attention',
    formula: 'Q=dec  K/V=H_enc',
    explain: 'پل ترجمه/شرطی‌سازی: Decoder از Encoder محتوا می‌گیرد.',
  },
  {
    title: '۶) FFN + Softmax واژگان',
    formula: 'p=softmax(W h_t)',
    explain: 'احتمال توکن بعدی؛ انتخاب؛ چسباندن؛ تکرار تا توقف.',
  },
]

export function CompleteTransformer({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useState(0)
  const p = PHASES[phase]

  useEffect(() => {
    if (!playing) return
    const t = window.setInterval(() => setPhase((x) => (x + 1) % PHASES.length), 2300)
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

        <svg viewBox="0 0 580 300" className="viz-svg">
          <rect x="6" y="6" width="568" height="288" rx="16" fill="#070f1a" stroke="#1e293b" />

          {['من', 'کتاب', 'خواندم'].map((tok, i) => (
            <g key={tok}>
              <rect
                x={18}
                y={40 + i * 48}
                width={66}
                height={34}
                rx={9}
                fill="#0b1524"
                stroke={phase === 0 ? '#2dd4bf' : '#475569'}
                strokeWidth={phase === 0 ? 2.4 : 1.3}
              />
              <text x={51} y={62 + i * 48} textAnchor="middle" fill="#e2e8f0" fontSize="12" fontFamily="Vazirmatn">
                {tok}
              </text>
            </g>
          ))}

          <motion.rect
            x={100}
            y={70}
            width={70}
            height={120}
            rx={12}
            fill="#0b1524"
            stroke={phase >= 1 ? '#38bdf8' : '#334155'}
            strokeWidth={phase === 1 ? 2.4 : 1.3}
            animate={{ opacity: phase >= 1 ? 1 : 0.35 }}
          />
          <text x={135} y={125} textAnchor="middle" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">
            E+P
          </text>
          <text x={135} y={145} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="Vazirmatn">
            ترتیب+معنا
          </text>

          {/* encoder layers as stacked cards */}
          <motion.g animate={{ opacity: phase >= 2 ? 1 : 0.28 }}>
            {[0, 1, 2].map((i) => (
              <rect
                key={i}
                x={190 + i * 6}
                y={45 + i * 6}
                width={110}
                height={150}
                rx={12}
                fill="#0b1524"
                stroke={phase === 2 ? '#2dd4bf' : '#334155'}
                strokeWidth={phase === 2 && i === 2 ? 2.4 : 1.2}
              />
            ))}
            <text x={251} y={95} textAnchor="middle" fill="#99f6e4" fontSize="12" fontFamily="Vazirmatn">
              Encoder ×N
            </text>
            <text x={251} y={120} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
              Self-Attn
            </text>
            <text x={251} y={140} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
              FFN
            </text>
            <text x={251} y={170} textAnchor="middle" fill="#2dd4bf" fontSize="13" fontFamily="JetBrains Mono">
              H
            </text>
          </motion.g>

          {/* decoder */}
          <motion.g animate={{ opacity: phase >= 3 ? 1 : 0.28 }}>
            {[0, 1, 2].map((i) => (
              <rect
                key={i}
                x={330 + i * 6}
                y={35 + i * 6}
                width={120}
                height={170}
                rx={12}
                fill="#0b1524"
                stroke={phase >= 3 && phase <= 5 ? '#fbbf24' : '#334155'}
                strokeWidth={phase >= 3 && i === 2 ? 2.4 : 1.2}
              />
            ))}
            <text x={396} y={70} textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily="Vazirmatn">
              Decoder ×N
            </text>
            <text
              x={396}
              y={100}
              textAnchor="middle"
              fill={phase === 3 ? '#fbbf24' : '#64748b'}
              fontSize="10"
              fontFamily="JetBrains Mono"
            >
              Masked Attn
            </text>
            <text
              x={396}
              y={125}
              textAnchor="middle"
              fill={phase === 4 ? '#fbbf24' : '#64748b'}
              fontSize="10"
              fontFamily="JetBrains Mono"
            >
              Cross-Attn
            </text>
            <text
              x={396}
              y={150}
              textAnchor="middle"
              fill={phase === 5 ? '#fbbf24' : '#64748b'}
              fontSize="10"
              fontFamily="JetBrains Mono"
            >
              FFN
            </text>
          </motion.g>

          <AnimatePresence>
            {phase >= 4 && (
              <motion.path
                key="cross"
                d="M300,140 C312,140 318,128 330,128"
                stroke="#2dd4bf"
                strokeWidth={2.5}
                fill="none"
                strokeDasharray="5 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
              />
            )}
          </AnimatePresence>

          <motion.g animate={{ opacity: phase >= 5 ? 1 : 0.2 }}>
            <rect x={480} y={95} width={70} height={80} rx={12} fill="#134e4a" stroke="#2dd4bf" />
            <text x={515} y={130} textAnchor="middle" fill="#99f6e4" fontSize="11" fontFamily="JetBrains Mono">
              Softmax
            </text>
            <text x={515} y={150} textAnchor="middle" fill="#5eead4" fontSize="10" fontFamily="Vazirmatn">
              next tok
            </text>
          </motion.g>

          {/* mask triangle hint */}
          {phase === 3 && (
            <g>
              <text x={396} y={210} textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono">
                ▓░░
              </text>
              <text x={396} y={224} textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono">
                ▓▓░
              </text>
              <text x={396} y={238} textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono">
                ▓▓▓
              </text>
            </g>
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
