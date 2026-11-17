import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { InteractiveKind, Topic } from '../../types/course'
import { useI18n } from '../../hooks/useI18n'

function softmax(xs: number[]) {
  const m = Math.max(...xs)
  const ex = xs.map((x) => Math.exp(x - m))
  const s = ex.reduce((a, b) => a + b, 0)
  return ex.map((e) => e / s)
}

export function InteractivePad({
  kind,
  topic,
}: {
  kind?: InteractiveKind
  topic: Topic
}) {
  const { t, L } = useI18n()
  const mode = kind && kind !== 'none' ? kind : 'quiz'
  const [temp, setTemp] = useState(0.8)
  const [lr, setLr] = useState(0.3)
  const [focus, setFocus] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)

  const scores = [2.1, 0.4, 0.8, 1.3]
  const soft = useMemo(() => {
    const scaled = scores.map((s) => s / Math.max(temp, 0.05))
    return softmax(scaled)
  }, [temp])

  const loss = useMemo(() => Math.exp(-lr * 4) * 1.8 + 0.15, [lr])

  const quiz = [
    { q: L(topic.title), ok: 1 },
  ]
  const options = [
    L({
      fa: 'یک حدس تصادفی بی‌ربط',
      ar: 'تخمين عشوائي',
      en: 'A random unrelated guess',
      ku: 'خەمڵاندنێکی هەڕەمەکی',
    }),
    L(topic.summary),
    L({
      fa: 'فقط حفظ کردن متن بدون فهم',
      ar: 'حفظ بلا فهم',
      en: 'Memorize without understanding',
      ku: 'لەبەرکردن بەبێ تێگەیشتن',
    }),
  ]

  return (
    <div className="interactive-pad">
      <p className="interactive-lead">{t('interactiveHint')}</p>

      {mode === 'temperature' || mode === 'softmax' ? (
        <div className="play-block">
          <label className="play-label">
            Temperature / Softmax
            <input
              type="range"
              min={0.2}
              max={2}
              step={0.05}
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
            />
            <strong>{temp.toFixed(2)}</strong>
          </label>
          <div className="play-bars">
            {soft.map((v, i) => (
              <div key={i} className="play-bar-row">
                <span>#{i + 1}</span>
                <div className="play-bar-track">
                  <motion.div className="play-bar-fill" animate={{ width: `${v * 100}%` }} />
                </div>
                <span>{(v * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
          <p className="play-note">{t('interactiveTempNote')}</p>
        </div>
      ) : null}

      {mode === 'learning-rate' ? (
        <div className="play-block">
          <label className="play-label">
            Learning rate
            <input
              type="range"
              min={0.05}
              max={1}
              step={0.01}
              value={lr}
              onChange={(e) => setLr(Number(e.target.value))}
            />
            <strong>{lr.toFixed(2)}</strong>
          </label>
          <div className="play-meter">
            <motion.div className="play-meter-fill" animate={{ width: `${Math.min(100, (1.1 - loss) * 70)}%` }} />
          </div>
          <p className="play-note">
            Loss ≈ {loss.toFixed(2)} — {t('interactiveLrNote')}
          </p>
        </div>
      ) : null}

      {mode === 'attention-focus' ? (
        <div className="play-block">
          <p className="play-note">{t('interactiveFocusNote')}</p>
          <div className="focus-tokens">
            {['من', 'کتاب', 'را', 'دوست', 'دارم'].map((tok, i) => (
              <button
                key={tok}
                type="button"
                className={`focus-token${focus === i ? ' is-on' : ''}`}
                onClick={() => setFocus(i)}
              >
                {tok}
              </button>
            ))}
          </div>
          <div className="play-bars">
            {[0.55, 0.15, 0.1, 0.12, 0.08].map((base, i) => {
              const norm = focus === i ? 0.62 : base * 0.7
              return (
                <div key={i} className="play-bar-row">
                  <span>{i + 1}</span>
                  <div className="play-bar-track">
                    <motion.div className="play-bar-fill" animate={{ width: `${norm * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {mode === 'quiz' || mode === 'temperature' || mode === 'softmax' || mode === 'learning-rate' || mode === 'attention-focus' ? (
        <div className="play-block quiz-block">
          <h4>{t('miniQuiz')}</h4>
          <p>{t('quizPrompt')} «{L(topic.title)}»؟</p>
          <div className="quiz-options">
            {options.map((opt, i) => {
              const correct = i === quiz[0].ok
              const show = picked !== null
              return (
                <button
                  key={opt}
                  type="button"
                  className={`quiz-option${show && correct ? ' is-correct' : ''}${show && picked === i && !correct ? ' is-wrong' : ''}`}
                  onClick={() => setPicked(i)}
                >
                  {opt}
                </button>
              )
            })}
          </div>
          {picked !== null && (
            <p className="play-note">
              {picked === quiz[0].ok ? t('quizGood') : t('quizBad')}
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
