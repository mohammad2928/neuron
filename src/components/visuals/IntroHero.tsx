import { motion } from 'framer-motion'
import { VisualFrame } from './shared'

export function IntroHero({ playing }: { playing: boolean }) {
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2
    return { x: 200 + Math.cos(angle) * 110, y: 160 + Math.sin(angle) * 90, i }
  })

  return (
    <VisualFrame caption="شبکهٔ توجه: هر توکن می‌تواند به همهٔ توکن‌ها وصل شود">
      <svg viewBox="0 0 400 320" className="viz-svg" aria-hidden>
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="160" r="70" fill="url(#coreGlow)" />
        {playing &&
          nodes.map((a) =>
            nodes.map((b) =>
              a.i < b.i ? (
                <motion.line
                  key={`${a.i}-${b.i}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#2dd4bf"
                  strokeWidth={1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.25 + ((a.i + b.i) % 3) * 0.1 }}
                  transition={{ duration: 1.2, delay: 0.05 * (a.i + b.i) }}
                />
              ) : null,
            ),
          )}
        {nodes.map((n, idx) => (
          <motion.g
            key={n.i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * idx, type: 'spring' }}
          >
            <circle cx={n.x} cy={n.y} r={16} fill="#0f172a" stroke="#2dd4bf" strokeWidth={2} />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize="11"
              fontFamily="Vazirmatn, sans-serif"
            >
              T{idx + 1}
            </text>
          </motion.g>
        ))}
        <motion.text
          x="200"
          y="300"
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="14"
          fontFamily="Syne, Vazirmatn, sans-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Attention Graph
        </motion.text>
      </svg>
    </VisualFrame>
  )
}
