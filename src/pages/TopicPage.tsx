import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  NotebookPen,
  RotateCcw,
} from 'lucide-react'
import { categories, getTopic, topics } from '../data/topics/catalog'
import { enrichTopic } from '../data/topics/buildSteps'
import { resolveVisual } from '../data/topics/visualMap'
import { StepVisual } from '../components/visuals'
import { NotesPanel } from '../components/topic/NotesPanel'
import { TopicCard } from '../components/topic/TopicCard'
import { InteractivePad } from '../components/topic/InteractivePad'
import { AlgorithmWalkthrough } from '../components/topic/AlgorithmWalkthrough'
import { ExplainSection, Paragraphs } from '../components/topic/ExplainBlocks'
import { useI18n } from '../hooks/useI18n'
import { useNotesStore } from '../store/notesStore'
import { useProgressStore } from '../store/progressStore'
import { useHistoryStore } from '../store/historyStore'
import type { UiKey } from '../i18n/ui'
import { isNumericAlgoKind } from '../data/topics/topicKind'

type LearnStep = 'simple' | 'algo' | 'visual' | 'formula' | 'real' | 'play' | 'deep' | 'links'

export function TopicPage() {
  const { topicId = '' } = useParams()
  const raw = getTopic(topicId)
  const topic = useMemo(() => (raw ? enrichTopic(raw) : undefined), [raw])
  const { t, L, dir } = useI18n()
  const numeric = topic ? isNumericAlgoKind(topic.kind) : false
  const STEPS: { id: LearnStep; label: UiKey }[] = [
    { id: 'simple', label: 'stepSimple' },
    { id: 'algo', label: numeric ? 'sectionAlgo' : 'sectionConceptPath' },
    { id: 'visual', label: 'stepVisual' },
    { id: 'formula', label: 'stepFormula' },
    { id: 'real', label: 'stepReal' },
    { id: 'play', label: 'stepPlay' },
    { id: 'deep', label: 'stepDeep' },
    { id: 'links', label: 'stepLinks' },
  ]
  const [notesOpen, setNotesOpen] = useState(false)
  const [replay, setReplay] = useState(0)
  const [step, setStep] = useState<LearnStep>('simple')
  const markComplete = useProgressStore((s) => s.markComplete)
  const isComplete = useProgressStore((s) => s.isComplete(topicId))
  const pushVisit = useHistoryStore((s) => s.pushVisit)
  const hasNote = useNotesStore((s) => Boolean(s.notes[topicId]?.text?.trim()))

  useEffect(() => {
    if (topic) {
      markComplete(topic.id)
      pushVisit(topic.id)
    }
  }, [topic, markComplete, pushVisit])

  useEffect(() => {
    setStep('simple')
    setReplay(0)
  }, [topicId])

  const index = topics.findIndex((x) => x.id === topicId)
  const prev = index > 0 ? topics[index - 1] : undefined
  const next = index >= 0 && index < topics.length - 1 ? topics[index + 1] : undefined
  const cat = topic ? categories.find((c) => c.id === topic.category) : undefined
  const related = useMemo(() => {
    if (!topic) return []
    return topics.filter((x) => x.category === topic.category && x.id !== topic.id).slice(0, 3)
  }, [topic])

  const stepIndex = STEPS.findIndex((s) => s.id === step)
  const PrevIcon = dir === 'rtl' ? ArrowRight : ArrowLeft
  const NextIcon = dir === 'rtl' ? ArrowLeft : ArrowRight

  if (!topic) {
    return (
      <div className="empty-state">
        <h1>{t('noResults')}</h1>
        <Link to="/topics">{t('browseAll')}</Link>
      </div>
    )
  }

  const goStep = (delta: number) => {
    const nextIdx = Math.min(STEPS.length - 1, Math.max(0, stepIndex + delta))
    setStep(STEPS[nextIdx].id)
  }

  return (
    <div className="topic-page dense">
      <nav className="topic-breadcrumb">
        <Link to="/topics">{t('topics')}</Link>
        <span>/</span>
        {cat ? <Link to={`/topics?category=${cat.id}`}>{L(cat.title)}</Link> : null}
      </nav>

      <article className="topic-shell friendly">
        <header className="topic-header">
          <div>
            <p className="eyebrow">{cat ? L(cat.title) : ''}</p>
            <h1>{L(topic.title)}</h1>
            <p className="topic-one-liner">{L(topic.summary)}</p>
            <p className="step-meta">
              {t('stepOfLearning')} {stepIndex + 1} {t('of')} {STEPS.length}
              {isComplete ? (
                <span className="done-pill">
                  <CheckCircle2 size={14} />
                  {t('seen')}
                </span>
              ) : null}
            </p>
          </div>
          <div className="lesson-actions">
            <button
              type="button"
              className={`soft-btn${hasNote ? ' has-note' : ''}`}
              onClick={() => setNotesOpen(true)}
            >
              <NotebookPen size={16} />
              {t('notes')}
            </button>
            {step === 'visual' && (
              <button type="button" className="soft-btn" onClick={() => setReplay((n) => n + 1)}>
                <RotateCcw size={16} />
                {t('replay')}
              </button>
            )}
          </div>
        </header>

        <div className="learn-steps" role="tablist" aria-label={t('stepOfLearning')}>
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={step === s.id}
              className={`learn-step${step === s.id ? ' is-active' : ''}${i < stepIndex ? ' is-done' : ''}`}
              onClick={() => setStep(s.id)}
            >
              <span className="learn-step-num">{i + 1}</span>
              <span>{t(s.label)}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${topic.id}-${step}-${replay}`}
            className="learn-panel rich dense-copy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {step === 'simple' && (
              <div className="step-stack">
                <ExplainSection title={t('sectionWhat')} tone="simple">
                  <Paragraphs text={L(topic.whatIs)} />
                </ExplainSection>
                <ExplainSection title={t('easyLikeKid')} tone="simple">
                  <Paragraphs text={L(topic.simple)} />
                </ExplainSection>
              </div>
            )}

            {step === 'algo' && (
              <div className="step-stack">
                <AlgorithmWalkthrough
                  steps={topic.algoSteps}
                  goal={topic.algoGoal}
                  inputs={topic.algoInputs}
                  output={topic.algoOutput}
                  titleKey={numeric ? 'algoWalkTitle' : 'conceptWalkTitle'}
                />
              </div>
            )}

            {step === 'visual' && (
              <div className="step-stack">
                <p className="visual-lead">{L(topic.visualExplain)}</p>
                <div className="visual-stage is-alive">
                  <div className="visual-live-badge">Animation</div>
                  <StepVisual kind={resolveVisual(topic)} playing />
                </div>
              </div>
            )}

            {step === 'formula' && (
              <div className="step-stack">
                <ExplainSection title={t('mathBox')} tone="math">
                  <code className="formula-big">{L(topic.formula)}</code>
                </ExplainSection>
                <ExplainSection title={t('sectionMath')} tone="math">
                  <Paragraphs text={L(topic.mathExplain)} />
                </ExplainSection>
                <ExplainSection title={t('sectionExample')} tone="example">
                  <Paragraphs text={L(topic.example)} />
                </ExplainSection>
              </div>
            )}

            {step === 'real' && (
              <div className="step-stack">
                <ExplainSection title={t('sectionRealWorld')} tone="example">
                  <Paragraphs text={L(topic.realWorld)} />
                </ExplainSection>
              </div>
            )}

            {step === 'play' && (
              <div className="step-stack">
                <p className="visual-lead">{t('interactiveHint')}</p>
                <InteractivePad kind={topic.interactive} topic={topic} />
              </div>
            )}

            {step === 'deep' && (
              <div className="step-stack">
                <ExplainSection title={t('deepDive')} tone="default">
                  <Paragraphs text={L(topic.deepDive)} />
                </ExplainSection>
                <ExplainSection title={t('sectionWhy')} tone="why">
                  <Paragraphs text={L(topic.whyMatters)} />
                </ExplainSection>
              </div>
            )}

            {step === 'links' && (
              <div className="step-stack">
                <ExplainSection title={t('resources')} tone="default">
                  <p>{t('resourcesLead')}</p>
                </ExplainSection>
                <ul className="resource-list">
                  {topic.resources.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noreferrer noopener">
                        <span>{r.title}</span>
                        <ExternalLink size={14} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="step-controls">
          <button type="button" className="nav-btn" disabled={stepIndex === 0} onClick={() => goStep(-1)}>
            <PrevIcon size={18} />
            {t('prev')}
          </button>
          <button
            type="button"
            className="nav-btn primary"
            disabled={stepIndex === STEPS.length - 1}
            onClick={() => goStep(1)}
          >
            {t('next')}
            <NextIcon size={18} />
          </button>
        </div>

        <footer className="topic-nav">
          {prev ? (
            <Link to={`/topics/${prev.id}`} className="nav-btn">
              <PrevIcon size={18} />
              <span>
                <small>{t('prev')}</small>
                <strong>{L(prev.title)}</strong>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/topics/${next.id}`} className="nav-btn primary">
              <span>
                <small>{t('next')}</small>
                <strong>{L(next.title)}</strong>
              </span>
              <NextIcon size={18} />
            </Link>
          ) : null}
        </footer>
      </article>

      {related.length > 0 && (
        <section className="home-section">
          <div className="section-head">
            <h2>{t('related')}</h2>
          </div>
          <div className="topic-grid">
            {related.map((item) => (
              <TopicCard key={item.id} topic={item} />
            ))}
          </div>
        </section>
      )}

      <NotesPanel
        topicId={topic.id}
        topicTitle={L(topic.title)}
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
      />
    </div>
  )
}
