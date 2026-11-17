import { motion } from 'framer-motion'
import { VisualFrame } from './shared'

export function WhyScale({ playing }: { playing: boolean }) {
  const bars = [
    { label: 'داده', h: 55 },
    { label: 'پارامتر', h: 72 },
    { label: 'محاسبه', h: 88 },
    { label: 'کیفیت', h: 96 },
  ]

  return (
    <VisualFrame caption="مقیاس‌پذیری: موازی‌سازی Attention + قوانین Scaling">
      <div className="scale-bars">
        {bars.map((b, i) => (
          <div key={b.label} className="scale-col">
            <motion.div
              className="scale-fill"
              initial={{ height: 0 }}
              animate={{ height: playing ? `${b.h}%` : '12%' }}
              transition={{ delay: 0.15 * i, duration: 0.8, type: 'spring' }}
            />
            <span>{b.label}</span>
          </div>
        ))}
      </div>
      <motion.p
        className="scale-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        هزینه Attention ≈ O(n²) نسبت به طول توالی — موازی روی توکن‌ها، نه روی زمان RNN
      </motion.p>
    </VisualFrame>
  )
}
