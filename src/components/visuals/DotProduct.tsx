import { motion } from 'framer-motion'
import { COLORS, FormulaBadge, TOKENS, VisualFrame } from './shared'

const SCORES = [0.92, 0.31, 0.18, 0.55]

export function DotProduct({ playing }: { playing: boolean }) {
  return (
    <VisualFrame caption="ضرب داخلی Query با هر Key → ماتریس امتیاز">
      <div className="matrix-wrap">
        <div className="matrix-query">
          <span className="label-pill" style={{ color: COLORS.query }}>
            Query: می‌خوانم
          </span>
        </div>
        <div className="score-grid">
          {TOKENS.map((t, i) => (
            <motion.div
              key={t}
              className="score-cell"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                backgroundColor: playing
                  ? `rgba(45, 212, 191, ${0.15 + SCORES[i] * 0.55})`
                  : 'rgba(15,23,42,0.6)',
              }}
              transition={{ delay: 0.15 * i }}
            >
              <span className="score-token">{t}</span>
              <span className="score-val">{SCORES[i].toFixed(2)}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <FormulaBadge text="score(qᵢ, kⱼ) = qᵢ · kⱼ" />
    </VisualFrame>
  )
}
