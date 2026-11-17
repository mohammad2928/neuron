import { motion } from 'framer-motion'
import { FormulaBadge, VisualFrame } from './shared'

const HEADS = [
  { name: 'Head 1', focus: 'نحو', color: '#2dd4bf' },
  { name: 'Head 2', focus: 'مرجع', color: '#38bdf8' },
  { name: 'Head 3', focus: 'معنا', color: '#fbbf24' },
  { name: 'Head 4', focus: 'موضع', color: '#fb7185' },
]

export function MultiHead({ playing }: { playing: boolean }) {
  return (
    <VisualFrame caption="چند سر موازی در زیرفضاهای مختلف؛ سپس Concat و W_O">
      <div className="heads-grid">
        {HEADS.map((h, i) => (
          <motion.div
            key={h.name}
            className="head-card"
            style={{ borderColor: h.color }}
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: 1,
              y: 0,
              boxShadow: playing ? `0 0 24px ${h.color}33` : 'none',
            }}
            transition={{ delay: i * 0.12 }}
          >
            <strong style={{ color: h.color }}>{h.name}</strong>
            <span>{h.focus}</span>
            <svg viewBox="0 0 80 40" className="mini-attn">
              {[0, 1, 2].map((r) =>
                [0, 1, 2].map((c) => (
                  <motion.rect
                    key={`${r}-${c}`}
                    x={8 + c * 22}
                    y={4 + r * 12}
                    width={18}
                    height={10}
                    rx={2}
                    fill={h.color}
                    initial={{ opacity: 0.15 }}
                    animate={{ opacity: 0.2 + ((r + c + i) % 3) * 0.25 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 1.2, repeat: Infinity, repeatType: 'mirror' }}
                  />
                )),
              )}
            </svg>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="concat-bar"
        initial={{ opacity: 0, scaleX: 0.6 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.7 }}
      >
        Concat → W<sub>O</sub> → خروجی
      </motion.div>
      <FormulaBadge text="MultiHead(Q,K,V) = Concat(head₁…headₕ) W_O" />
    </VisualFrame>
  )
}
