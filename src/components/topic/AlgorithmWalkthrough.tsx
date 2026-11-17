import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Lightbulb, Calculator, Flag, LogIn, LogOut } from 'lucide-react'
import type { AlgoStep } from '../../data/topics/guides'
import type { LocalizedString } from '../../i18n/types'
import { useI18n } from '../../hooks/useI18n'
import type { UiKey } from '../../i18n/ui'

type Meta = {
  goal?: LocalizedString
  inputs?: LocalizedString
  output?: LocalizedString
  titleKey?: UiKey
}

export function AlgorithmWalkthrough({
  steps,
  goal,
  inputs,
  output,
  titleKey = 'algoWalkTitle',
}: {
  steps: AlgoStep[]
} & Meta) {
  const { t, L } = useI18n()
  const [i, setI] = useState(0)
  const step = steps[i]

  if (!steps.length) return null

  return (
    <div className="algo-walk">
      <div className="algo-head">
        <h3>{t(titleKey)}</h3>
        <p>
          {t('stepOfLearning')} {i + 1} / {steps.length}
        </p>
      </div>

      {(goal || inputs || output) && (
        <div className="algo-meta-grid">
          {goal ? (
            <div className="algo-meta-card">
              <Flag size={16} />
              <div>
                <strong>{t('algoGoal')}</strong>
                <p>{L(goal)}</p>
              </div>
            </div>
          ) : null}
          {inputs ? (
            <div className="algo-meta-card">
              <LogIn size={16} />
              <div>
                <strong>{t('algoInputs')}</strong>
                <pre>{L(inputs)}</pre>
              </div>
            </div>
          ) : null}
          {output ? (
            <div className="algo-meta-card">
              <LogOut size={16} />
              <div>
                <strong>{t('algoOutput')}</strong>
                <pre>{L(output)}</pre>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <ol className="algo-rail">
        {steps.map((s, idx) => (
          <li key={idx}>
            <button
              type="button"
              className={`algo-rail-btn${idx === i ? ' is-active' : ''}${idx < i ? ' is-done' : ''}`}
              onClick={() => setI(idx)}
            >
              <span>{idx + 1}</span>
              <em>{L(s.title)}</em>
              {idx < i ? <CheckCircle2 size={14} /> : null}
            </button>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          className="algo-card algo-board"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <p className="algo-board-kicker">
            {t(titleKey)} — {i + 1}/{steps.length}
          </p>
          <h4>
            {i + 1}. {L(step.title)}
          </h4>
          <div className="algo-text">
            {L(step.text)
              .split(/\n+/)
              .filter(Boolean)
              .map((p, idx) => (
                <p key={`${idx}-${p.slice(0, 24)}`}>{p}</p>
              ))}
          </div>

          {step.tip ? (
            <div className="algo-tip">
              <Lightbulb size={16} />
              <div>
                <strong>{t('stepTip')}</strong>
                <p>{L(step.tip)}</p>
              </div>
            </div>
          ) : null}

          {step.calc ? (
            <div className="algo-calc">
              <Calculator size={16} />
              <div>
                <strong>{t('algoCalcBoard')}</strong>
                <pre>{L(step.calc)}</pre>
              </div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="algo-controls">
        <button type="button" className="nav-btn" disabled={i === 0} onClick={() => setI((x) => x - 1)}>
          {t('prev')}
        </button>
        <button
          type="button"
          className="nav-btn primary"
          disabled={i === steps.length - 1}
          onClick={() => setI((x) => x + 1)}
        >
          {i === steps.length - 1 ? t('seen') : t('next')}
        </button>
      </div>
    </div>
  )
}
