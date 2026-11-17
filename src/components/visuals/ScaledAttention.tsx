import { motion } from 'framer-motion'
import { FormulaBadge, VisualFrame } from './shared'

const STEPS = [
  { label: 'Q Kᵀ', color: '#38bdf8' },
  { label: '÷ √dₖ', color: '#fbbf24' },
  { label: 'softmax', color: '#2dd4bf' },
  { label: '× V', color: '#fb7185' },
]

export function ScaledAttention({ playing }: { playing: boolean }) {
  return (
    <VisualFrame caption="خط لولهٔ Scaled Dot-Product Attention">
      <div className="pipeline">
        {STEPS.map((s, i) => (
          <div key={s.label} className="pipeline-item">
            <motion.div
              className="pipeline-node"
              style={{ borderColor: s.color, color: s.color }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: playing ? [1, 1.05, 1] : 1 }}
              transition={{
                opacity: { delay: i * 0.25 },
                scale: { delay: 0.8 + i * 0.35, duration: 0.9, repeat: playing ? Infinity : 0, repeatDelay: 2 },
              }}
            >
              {s.label}
            </motion.div>
            {i < STEPS.length - 1 && (
              <motion.div
                className="pipeline-arrow"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.25 }}
              >
                ←
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <FormulaBadge text="Attention(Q,K,V) = softmax(QKᵀ / √dₖ) V" />
    </VisualFrame>
  )
}
