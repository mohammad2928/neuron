import { motion } from 'framer-motion'
import { VisualFrame } from './shared'

const TAKEAWAYS = [
  'Attention = وزن‌دهی پویا روی context',
  'Q/K شباهت می‌سازند · V محتوا می‌آورد',
  'Multi-Head زیرفضاهای تخصصی می‌سازد',
  'Position ترتیب را به مدل بدون RNN می‌دهد',
  'Encoder می‌فهمد · Decoder تولید می‌کند',
]

export function WrapUp({ playing }: { playing: boolean }) {
  return (
    <VisualFrame caption="چکیدهٔ مسیر — آماده برای دورهٔ مدل‌های زبانی">
      <ul className="wrap-list">
        {TAKEAWAYS.map((t, i) => (
          <motion.li
            key={t}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: playing ? 1 : 0.5, x: 0 }}
            transition={{ delay: 0.12 * i }}
          >
            {t}
          </motion.li>
        ))}
      </ul>
    </VisualFrame>
  )
}
