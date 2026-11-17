import { motion } from 'framer-motion'
import { VisualFrame } from './shared'

export function FullTransformer({ playing }: { playing: boolean }) {
  return (
    <VisualFrame caption="نمای کلی Encoder–Decoder Transformer">
      <svg viewBox="0 0 480 300" className="viz-svg" aria-hidden>
        <motion.rect
          x="40"
          y="40"
          width="160"
          height="200"
          rx="16"
          fill="#0f172a"
          stroke="#2dd4bf"
          strokeWidth={2}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        />
        <text x="120" y="70" textAnchor="middle" fill="#2dd4bf" fontSize="15" fontFamily="Syne">
          Encoder
        </text>
        {['Self-Attn × N', 'FFN × N'].map((t, i) => (
          <motion.rect
            key={t}
            x="60"
            y={95 + i * 55}
            width="120"
            height="40"
            rx="8"
            fill="#134e4a"
            initial={{ opacity: 0 }}
            animate={{ opacity: playing ? 1 : 0.7 }}
            transition={{ delay: 0.3 + i * 0.15 }}
          />
        ))}
        <text x="120" y="120" textAnchor="middle" fill="#99f6e4" fontSize="12">
          Self-Attn × N
        </text>
        <text x="120" y="175" textAnchor="middle" fill="#99f6e4" fontSize="12">
          FFN × N
        </text>

        <motion.rect
          x="280"
          y="40"
          width="160"
          height="200"
          rx="16"
          fill="#0f172a"
          stroke="#38bdf8"
          strokeWidth={2}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        />
        <text x="360" y="70" textAnchor="middle" fill="#38bdf8" fontSize="15" fontFamily="Syne">
          Decoder
        </text>
        {['Masked Self', 'Cross-Attn', 'FFN'].map((t, i) => (
          <g key={t}>
            <motion.rect
              x="300"
              y={90 + i * 42}
              width="120"
              height="32"
              rx="8"
              fill="#0c4a6e"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.12 }}
            />
            <text x="360" y={110 + i * 42} textAnchor="middle" fill="#bae6fd" fontSize="11">
              {t}
            </text>
          </g>
        ))}

        {playing && (
          <motion.path
            d="M 200 140 C 230 140, 250 140, 280 140"
            stroke="#fbbf24"
            strokeWidth={3}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.6, repeat: Infinity, repeatDelay: 1.2 }}
          />
        )}
        <text x="240" y="128" textAnchor="middle" fill="#fbbf24" fontSize="11">
          memory
        </text>

        <text x="120" y="270" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="Vazirmatn">
          ورودی مبدأ
        </text>
        <text x="360" y="270" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="Vazirmatn">
          خروجی هدف
        </text>
      </svg>
    </VisualFrame>
  )
}
