import { motion } from 'framer-motion'
import { VisualFrame } from './shared'

export function RnnLimits({ playing }: { playing: boolean }) {
  const cells = [0, 1, 2, 3, 4]

  return (
    <VisualFrame caption="RNN: اطلاعات باید زنجیره‌وار عبور کند — کند و شکننده برای فاصله‌های طولانی">
      <svg viewBox="0 0 440 220" className="viz-svg" aria-hidden>
        {cells.map((i) => {
          const x = 40 + i * 75
          return (
            <g key={i}>
              <motion.rect
                x={x}
                y={80}
                width={54}
                height={54}
                rx={10}
                fill="#0f172a"
                stroke="#64748b"
                strokeWidth={2}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              />
              <text
                x={x + 27}
                y={112}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="13"
                fontFamily="JetBrains Mono, monospace"
              >
                h{i}
              </text>
              {i < cells.length - 1 && playing && (
                <motion.path
                  d={`M ${x + 54} 107 L ${x + 75} 107`}
                  stroke="#fbbf24"
                  strokeWidth={3}
                  markerEnd="url(#arrow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0.4, 1, 0.4] }}
                  transition={{
                    pathLength: { delay: 0.2 + i * 0.25, duration: 0.4 },
                    opacity: { delay: 0.5 + i * 0.25, duration: 1.5, repeat: Infinity },
                  }}
                />
              )}
            </g>
          )
        })}
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#fbbf24" />
          </marker>
        </defs>
        <motion.text
          x="220"
          y="190"
          textAnchor="middle"
          fill="#fbbf24"
          fontSize="13"
          fontFamily="Vazirmatn, sans-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: playing ? 1 : 0.4 }}
        >
          گلوگاه ترتیبی · محو شدن سیگنال در مسیر طولانی
        </motion.text>
      </svg>
    </VisualFrame>
  )
}
