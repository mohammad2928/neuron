import { motion } from 'framer-motion'
import { VisualFrame } from './shared'

export function SelfVsCross({ playing }: { playing: boolean }) {
  return (
    <VisualFrame caption="Self داخل یک توالی · Cross بین دو توالی">
      <div className="compare-grid">
        <motion.div
          className="compare-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4>Self-Attention</h4>
          <p>Q، K، V همگی از یک توالی</p>
          <svg viewBox="0 0 160 100">
            {[0, 1, 2].map((i) =>
              [0, 1, 2].map((j) =>
                i !== j ? (
                  <motion.line
                    key={`${i}-${j}`}
                    x1={30 + i * 50}
                    y1="50"
                    x2={30 + j * 50}
                    y2="50"
                    stroke="#2dd4bf"
                    strokeWidth={1.5}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: playing ? 0.5 : 0.2 }}
                  />
                ) : null,
              ),
            )}
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={30 + i * 50} cy="50" r="12" fill="#134e4a" stroke="#2dd4bf" />
            ))}
          </svg>
        </motion.div>
        <motion.div
          className="compare-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h4>Cross-Attention</h4>
          <p>Q از Decoder · K/V از Encoder</p>
          <svg viewBox="0 0 160 120">
            {[0, 1, 2].map((i) => (
              <circle key={`e${i}`} cx={30 + i * 50} cy="30" r="10" fill="#0c4a6e" stroke="#38bdf8" />
            ))}
            {[0, 1].map((i) => (
              <circle key={`d${i}`} cx={55 + i * 50} cy="95" r="10" fill="#134e4a" stroke="#2dd4bf" />
            ))}
            {playing &&
              [0, 1].map((d) =>
                [0, 1, 2].map((e) => (
                  <motion.line
                    key={`${d}-${e}`}
                    x1={55 + d * 50}
                    y1="85"
                    x2={30 + e * 50}
                    y2="40"
                    stroke="#fbbf24"
                    strokeWidth={1.2}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.55 }}
                    transition={{ delay: 0.2 + d * 0.1 + e * 0.05 }}
                  />
                )),
              )}
          </svg>
        </motion.div>
      </div>
    </VisualFrame>
  )
}
