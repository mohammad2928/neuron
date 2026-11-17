import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Scene({
  children,
  caption,
}: {
  children: ReactNode
  caption?: string
}) {
  return (
    <div className="visual-frame">
      <div className="visual-canvas scene-stage">{children}</div>
      {caption ? <p className="visual-caption">{caption}</p> : null}
    </div>
  )
}

export function Svg({
  children,
  viewBox = '0 0 480 280',
}: {
  children: ReactNode
  viewBox?: string
}) {
  return (
    <svg viewBox={viewBox} className="viz-svg scene-svg" aria-hidden>
      <defs>
        <marker id="arrowHead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill="#2dd4bf" />
        </marker>
        <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill="#fbbf24" />
        </marker>
        <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
        <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
      {children}
    </svg>
  )
}

export function Box({
  x,
  y,
  w,
  h,
  label,
  color = '#2dd4bf',
  delay = 0,
  playing = true,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  color?: string
  delay?: number
  playing?: boolean
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: playing ? [1, 1.03, 1] : 1 }}
      transition={{
        opacity: { delay },
        scale: { delay: delay + 0.4, duration: 1.8, repeat: Infinity, repeatDelay: 1.2 },
      }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill="#0b1524"
        stroke={color}
        strokeWidth={2}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fill="#e2e8f0"
        fontSize={12}
        fontFamily="Vazirmatn, Syne, sans-serif"
      >
        {label}
      </text>
    </motion.g>
  )
}

export function Flow({
  x1,
  y1,
  x2,
  y2,
  delay = 0,
  color = '#2dd4bf',
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  delay?: number
  color?: string
}) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={2.5}
      markerEnd="url(#arrowHead)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay, duration: 0.7 }}
    />
  )
}

export function Dot({
  x,
  y,
  color = '#fbbf24',
  delay = 0,
}: {
  x: number
  y: number
  color?: string
  delay?: number
}) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={6}
      fill={color}
      initial={{ scale: 0 }}
      animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.6, 1, 0.6] }}
      transition={{ delay, duration: 1.6, repeat: Infinity }}
    />
  )
}

export function MovingParticle({
  path,
  color = '#38bdf8',
  delay = 0,
}: {
  path: string
  color?: string
  delay?: number
}) {
  return (
    <motion.circle
      r={5}
      fill={color}
      initial={{ offsetDistance: '0%', opacity: 0 }}
      animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
      transition={{ delay, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ offsetPath: `path('${path}')` }}
    />
  )
}
