import { motion } from 'framer-motion'
import { TokenChip, TOKENS, VisualFrame } from './shared'

const WEIGHTS = [0.55, 0.15, 0.1, 0.2]

export function AttentionIntuition({ playing }: { playing: boolean }) {
  return (
    <VisualFrame caption="برای ساختن معنای «می‌خوانم»، مدل به «من» بیشتر از بقیه وزن می‌دهد">
      <div className="attn-focus">
        <div className="attn-focus-query">
          <span className="label-pill">در حال ساختن</span>
          <TokenChip label="می‌خوانم" color="#2dd4bf" active />
        </div>
        <div className="attn-weights-row">
          {TOKENS.map((t, i) => (
            <div key={t} className="attn-weight-col">
              <TokenChip label={t} delay={0.1 * i} color="#94a3b8" />
              <div className="weight-bar-track">
                <motion.div
                  className="weight-bar-fill"
                  initial={{ height: 0 }}
                  animate={{ height: playing ? `${WEIGHTS[i] * 100}%` : '8%' }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.7 }}
                />
              </div>
              <motion.span
                className="weight-pct"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                {(WEIGHTS[i] * 100).toFixed(0)}%
              </motion.span>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  )
}
