import { motion } from 'framer-motion'
import { VisualFrame } from './shared'

const BLOCKS = ['Multi-Head Self-Attention', 'Add & Norm', 'Feed-Forward', 'Add & Norm']

export function EncoderStack({ playing }: { playing: boolean }) {
  return (
    <VisualFrame caption="یک لایه Encoder — معمولاً N بار روی هم تکرار می‌شود">
      <div className="stack-viz">
        <motion.div
          className="stack-io"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ورودی لایه
        </motion.div>
        {BLOCKS.map((b, i) => (
          <motion.div
            key={b}
            className={`stack-block${i % 2 === 0 ? ' is-main' : ' is-norm'}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{
              opacity: 1,
              x: 0,
              borderColor: playing && i % 2 === 0 ? '#2dd4bf' : undefined,
            }}
            transition={{ delay: 0.15 * i }}
          >
            {b}
          </motion.div>
        ))}
        <motion.div
          className="stack-io"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          خروجی لایه → لایه بعد
        </motion.div>
      </div>
    </VisualFrame>
  )
}
