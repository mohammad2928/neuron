import { motion } from 'framer-motion'
import { COLORS, FormulaBadge, VisualFrame } from './shared'

export function QkvFlow({ playing }: { playing: boolean }) {
  const roles = [
    { label: 'Query', sub: 'چی می‌خواهم؟', color: COLORS.query, y: 55 },
    { label: 'Key', sub: 'چی دارم؟', color: COLORS.key, y: 125 },
    { label: 'Value', sub: 'چه می‌دهم؟', color: COLORS.value, y: 195 },
  ]

  return (
    <VisualFrame caption="از یک embedding سه نقش جدا ساخته می‌شود">
      <svg viewBox="0 0 440 260" className="viz-svg" aria-hidden>
        <motion.rect
          x="30"
          y="100"
          width="90"
          height="60"
          rx="12"
          fill="#0f172a"
          stroke="#94a3b8"
          strokeWidth={2}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        />
        <text x="75" y="135" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="JetBrains Mono">
          xᵢ
        </text>

        {roles.map((r, i) => (
          <g key={r.label}>
            {playing && (
              <motion.line
                x1="120"
                y1="130"
                x2="210"
                y2={r.y + 20}
                stroke={r.color}
                strokeWidth={2}
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.85 }}
                transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
              />
            )}
            <motion.rect
              x="210"
              y={r.y}
              width="170"
              height="42"
              rx="12"
              fill="#0f172a"
              stroke={r.color}
              strokeWidth={2}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.15 }}
            />
            <text
              x="295"
              y={r.y + 18}
              textAnchor="middle"
              fill={r.color}
              fontSize="14"
              fontWeight="700"
              fontFamily="Syne, sans-serif"
            >
              {r.label}
            </text>
            <text
              x="295"
              y={r.y + 34}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="11"
              fontFamily="Vazirmatn, sans-serif"
            >
              {r.sub}
            </text>
          </g>
        ))}
      </svg>
      <FormulaBadge text="Q = XW_Q   K = XW_K   V = XW_V" />
    </VisualFrame>
  )
}
