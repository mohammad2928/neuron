import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FormulaBadge, VisualFrame } from './shared'

const RAW = [2.1, 0.4, 0.1, 1.2]
const SOFT = (() => {
  const exps = RAW.map((x) => Math.exp(x))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
})()

export function SoftmaxWeights({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useState<'raw' | 'soft'>('raw')

  useEffect(() => {
    if (!playing) {
      setPhase('raw')
      return
    }
    const t = window.setTimeout(() => setPhase('soft'), 1400)
    return () => window.clearTimeout(t)
  }, [playing])

  const values = phase === 'raw' ? RAW : SOFT

  return (
    <VisualFrame caption="Softmax امتیازها را به توزیع احتمال تبدیل می‌کند">
      <div className="softmax-demo">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            className="phase-label"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {phase === 'raw' ? 'امتیاز خام' : 'وزن Attention (جمع = ۱)'}
          </motion.div>
        </AnimatePresence>
        <div className="softmax-bars">
          {values.map((v, i) => (
            <div key={i} className="softmax-bar-item">
              <motion.div
                className="softmax-bar"
                initial={{ width: 0 }}
                animate={{
                  width: phase === 'raw' ? `${(v / 2.5) * 100}%` : `${v * 100}%`,
                }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
              />
              <span>{phase === 'raw' ? v.toFixed(1) : `${(v * 100).toFixed(0)}%`}</span>
            </div>
          ))}
        </div>
      </div>
      <FormulaBadge text="α = softmax(scores)" />
    </VisualFrame>
  )
}
