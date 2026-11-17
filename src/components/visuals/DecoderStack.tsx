import { motion } from 'framer-motion'
import { VisualFrame } from './shared'

const BLOCKS = [
  { label: 'Masked Self-Attention', tip: 'بدون دیدن آینده' },
  { label: 'Add & Norm', tip: '' },
  { label: 'Cross-Attention', tip: 'Query از Decoder · K/V از Encoder' },
  { label: 'Add & Norm', tip: '' },
  { label: 'Feed-Forward', tip: '' },
  { label: 'Add & Norm', tip: '' },
]

export function DecoderStack({ playing }: { playing: boolean }) {
  return (
    <VisualFrame caption="Decoder: ماسک علیّت + پل Cross-Attention به Encoder">
      <div className="stack-viz decoder">
        {BLOCKS.map((b, i) => (
          <motion.div
            key={`${b.label}-${i}`}
            className={`stack-block${b.label.includes('Attention') ? ' is-main' : ' is-norm'}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              boxShadow:
                playing && b.label === 'Cross-Attention'
                  ? '0 0 28px rgba(56,189,248,0.35)'
                  : 'none',
            }}
            transition={{ delay: i * 0.1 }}
          >
            <span>{b.label}</span>
            {b.tip ? <small>{b.tip}</small> : null}
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  )
}
