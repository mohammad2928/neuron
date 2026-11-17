import { motion } from 'framer-motion'
import { TokenChip, TOKENS, VisualFrame } from './shared'

export function SeqProblem({ playing }: { playing: boolean }) {
  return (
    <VisualFrame caption="وابستگی دور: فعل ممکن است به فاعل ابتدای جمله وابسته باشد">
      <div className="seq-row">
        {TOKENS.map((t, i) => (
          <TokenChip key={t} label={t} delay={i * 0.12} active={playing && (i === 0 || i === 3)} />
        ))}
      </div>
      <svg viewBox="0 0 420 120" className="viz-svg seq-arc" aria-hidden>
        {playing && (
          <motion.path
            d="M 55 90 C 120 10, 300 10, 365 90"
            fill="none"
            stroke="#fb7185"
            strokeWidth={2.5}
            strokeDasharray="6 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />
        )}
        <motion.text
          x="210"
          y="40"
          textAnchor="middle"
          fill="#fb7185"
          fontSize="13"
          fontFamily="Vazirmatn, sans-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: playing ? 1 : 0 }}
          transition={{ delay: 0.9 }}
        >
          وابستگی دور‌برد
        </motion.text>
      </svg>
    </VisualFrame>
  )
}
