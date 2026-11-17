import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export const TOKENS = ['من', 'کتاب', 'را', 'می‌خوانم'] as const

export const COLORS = {
  query: '#2dd4bf',
  key: '#38bdf8',
  value: '#fbbf24',
  accent: '#fb7185',
  muted: '#64748b',
  ink: '#e2e8f0',
  panel: 'rgba(15, 23, 42, 0.55)',
}

export function VisualFrame({
  children,
  caption,
}: {
  children: ReactNode
  caption?: string
}) {
  return (
    <div className="visual-frame">
      <div className="visual-canvas">{children}</div>
      {caption ? <p className="visual-caption">{caption}</p> : null}
    </div>
  )
}

export function TokenChip({
  label,
  delay = 0,
  color = COLORS.ink,
  active = false,
}: {
  label: string
  delay?: number
  color?: string
  active?: boolean
}) {
  return (
    <motion.span
      className={`token-chip${active ? ' is-active' : ''}`}
      style={{ borderColor: color, color }}
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: active ? 1.06 : 1 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 18 }}
    >
      {label}
    </motion.span>
  )
}

export function FormulaBadge({ text }: { text: string }) {
  return (
    <motion.code
      className="formula-badge"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      {text}
    </motion.code>
  )
}

export function PulseDot({
  x,
  y,
  color,
  delay = 0,
}: {
  x: number
  y: number
  color: string
  delay?: number
}) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={5}
      fill={color}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
      transition={{ delay, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
