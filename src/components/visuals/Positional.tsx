import { motion } from 'framer-motion'
import { FormulaBadge, VisualFrame } from './shared'

export function Positional({ playing }: { playing: boolean }) {
  const waves = [0, 1, 2, 3]

  return (
    <VisualFrame caption="سیگنال‌های سینوسی با فرکانس‌های متفاوت موقعیت را کد می‌کنند">
      <svg viewBox="0 0 440 220" className="viz-svg" aria-hidden>
        {waves.map((w) => {
          const freq = 1 + w * 0.7
          const color = ['#2dd4bf', '#38bdf8', '#fbbf24', '#fb7185'][w]
          const yBase = 40 + w * 42
          const d = Array.from({ length: 40 }, (_, i) => {
            const x = 30 + i * 10
            const y = yBase + Math.sin((i / 40) * Math.PI * 2 * freq) * 14
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
          }).join(' ')
          return (
            <motion.path
              key={w}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={2.2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: playing ? 1 : 0.3, opacity: 1 }}
              transition={{ duration: 1.4, delay: w * 0.15 }}
            />
          )
        })}
        {[0, 1, 2, 3, 4, 5].map((p) => (
          <text
            key={p}
            x={50 + p * 60}
            y="210"
            textAnchor="middle"
            fill="#64748b"
            fontSize="11"
            fontFamily="JetBrains Mono"
          >
            pos {p}
          </text>
        ))}
      </svg>
      <FormulaBadge text="PE(pos, 2i) = sin(pos / 10000^(2i/d))" />
    </VisualFrame>
  )
}
