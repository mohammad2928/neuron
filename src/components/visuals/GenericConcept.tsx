import { motion } from 'framer-motion'
import { VisualFrame } from './shared'

export function GenericConcept({ playing }: { playing: boolean }) {
  const rings = [40, 70, 100]
  return (
    <VisualFrame>
      <svg viewBox="0 0 360 240" className="viz-svg" aria-hidden>
        <defs>
          <radialGradient id="gGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="180" cy="120" r="56" fill="url(#gGlow)" />
        {rings.map((r, i) => (
          <motion.circle
            key={r}
            cx="180"
            cy="120"
            r={r}
            fill="none"
            stroke="#2dd4bf"
            strokeWidth={1.5}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: playing ? [0.15, 0.55, 0.15] : 0.25, scale: 1 }}
            transition={{ delay: i * 0.15, duration: 2.4, repeat: Infinity }}
          />
        ))}
        {['A', 'B', 'C', 'D'].map((label, i) => {
          const ang = (i / 4) * Math.PI * 2 - Math.PI / 2
          const x = 180 + Math.cos(ang) * 88
          const y = 120 + Math.sin(ang) * 70
          return (
            <motion.g
              key={label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <circle cx={x} cy={y} r={14} fill="#0f172a" stroke="#38bdf8" strokeWidth={2} />
              <text x={x} y={y + 4} textAnchor="middle" fill="#e2e8f0" fontSize="11">
                {label}
              </text>
              <motion.line
                x1={180}
                y1={120}
                x2={x}
                y2={y}
                stroke="#fbbf24"
                strokeWidth={1.2}
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: playing ? 1 : 0.4 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
              />
            </motion.g>
          )
        })}
      </svg>
    </VisualFrame>
  )
}
