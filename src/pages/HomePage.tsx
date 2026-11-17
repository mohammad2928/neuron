import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Clock3, NotebookPen, Search, Sparkles } from 'lucide-react'
import { categories, topics, topicCount } from '../data/topics/catalog'
import { TopicCard } from '../components/topic/TopicCard'
import { useI18n } from '../hooks/useI18n'
import { useProgressStore } from '../store/progressStore'

export function HomePage() {
  const { t, L, dir } = useI18n()
  const completedCount = useProgressStore((s) => s.completedCount())
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  const modern = topics.filter((x) => x.category === 'modern-llms').slice(0, 6)
  const history = topics.filter((x) => x.category === 'dl-history').slice(0, 6)
  const classic = topics.filter((x) => x.category === 'classic-ml').slice(0, 6)

  return (
    <div className="home-page">
      <section className="landing-hero">
        <div className="landing-atmosphere" aria-hidden>
          <span className="landing-beam landing-beam-a" />
          <span className="landing-beam landing-beam-b" />
          <span className="landing-noise" />
        </div>

        <motion.div
          className="landing-brand-block"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="landing-brand">{t('brand')}</p>
          <p className="landing-tag">{t('brandTag')}</p>
          <h1 className="landing-title">{t('heroTitle')}</h1>
          <p className="landing-lede">{t('heroLede')}</p>

          <div className="hero-cta">
            <Link to="/topics/full-transformer" className="cta-primary">
              {t('landingPathTransformer')}
              <Arrow size={18} />
            </Link>
            <Link to="/papers" className="cta-secondary">
              <Search size={16} />
              {t('papers')}
            </Link>
          </div>

          <div className="landing-paths">
            <Link to="/topics?category=attention" className="landing-path-card">
              <Sparkles size={16} />
              <span>{t('landingPathTransformer')}</span>
            </Link>
            <Link to="/topics?category=classic-ml" className="landing-path-card">
              <Sparkles size={16} />
              <span>{t('landingPathMl')}</span>
            </Link>
            <Link to="/topics?category=modern-llms" className="landing-path-card">
              <Clock3 size={16} />
              <span>{t('landingPathLlm')}</span>
            </Link>
            <Link to="/history" className="landing-path-card">
              <NotebookPen size={16} />
              <span>{t('history')}</span>
            </Link>
          </div>

          <p className="hero-stats">
            {topicCount} {t('topics')} · {categories.length} {t('courses')} · {completedCount}{' '}
            {t('progress')}
          </p>
        </motion.div>

        <motion.div
          className="landing-stage"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.7 }}
          aria-hidden
        >
          <svg viewBox="0 0 520 420" className="landing-svg">
            <defs>
              <radialGradient id="landGlow" cx="50%" cy="45%" r="50%">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="260" cy="190" r="120" fill="url(#landGlow)" />
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2 - Math.PI / 2
              const x = 260 + Math.cos(a) * 120
              const y = 190 + Math.sin(a) * 95
              return (
                <motion.g key={i}>
                  <motion.line
                    x1="260"
                    y1="190"
                    x2={x}
                    y2={y}
                    stroke="#2dd4bf"
                    strokeWidth="1.4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.35 }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.9 }}
                  />
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill="#0b1524"
                    stroke={i % 3 === 0 ? '#fbbf24' : '#38bdf8'}
                    strokeWidth="2"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.2, delay: i * 0.1, repeat: Infinity }}
                  />
                </motion.g>
              )
            })}
            <motion.circle
              cx="260"
              cy="190"
              r="28"
              fill="#0b1524"
              stroke="#2dd4bf"
              strokeWidth="3"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
            <text
              x="260"
              y="196"
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize="13"
              fontFamily="Syne, Vazirmatn, sans-serif"
            >
              LLM
            </text>
            <text
              x="260"
              y="360"
              textAnchor="middle"
              fill="#93a4bd"
              fontSize="14"
              fontFamily="IBM Plex Sans Arabic, Vazirmatn, sans-serif"
            >
              Attention · History · Models
            </text>
          </svg>
        </motion.div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>{t('courses')}</h2>
        </div>
        <div className="category-scroll">
          {categories.map((c) => {
            const count = topics.filter((x) => x.category === c.id).length
            return (
              <Link key={c.id} to={`/topics?category=${c.id}`} className="category-chip">
                <strong>{L(c.title)}</strong>
                <span>{count}</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>{t('landingPathLlm')}</h2>
        </div>
        <div className="topic-grid">
          {modern.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>{t('landingPathHist')}</h2>
        </div>
        <div className="topic-grid">
          {history.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>{t('landingPathMl')}</h2>
        </div>
        <div className="topic-grid">
          {classic.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
    </div>
  )
}
