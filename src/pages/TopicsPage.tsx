import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories, topics } from '../data/topics/catalog'
import { categoryMeta } from '../data/topics/categoryMeta'
import { TopicCard } from '../components/topic/TopicCard'
import { useI18n } from '../hooks/useI18n'

export function TopicsPage() {
  const { t, L, locale } = useI18n()
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? ''

  const filtered = useMemo(() => {
    if (!category) return []
    return topics.filter((x) => x.category === category)
  }, [category])

  const active = categories.find((c) => c.id === category)

  if (!category) {
    return (
      <div className="topics-page">
        <header className="page-header">
          <h1>{t('pickCategory')}</h1>
          <p>
            {topics.length} {t('topics')}
          </p>
        </header>
        <div className="category-gallery">
          {categories.map((c) => {
            const meta = categoryMeta[c.id]
            const count = topics.filter((x) => x.category === c.id).length
            return (
              <button
                key={c.id}
                type="button"
                className="category-card"
                style={{ ['--cat' as string]: meta?.color ?? '#2dd4bf' }}
                onClick={() => setParams({ category: c.id })}
              >
                <span className="category-card-icon" aria-hidden>
                  {meta?.icon ?? '📚'}
                </span>
                <strong>{L(c.title)}</strong>
                <em>{meta?.blurb[locale] ?? ''}</em>
                <span className="category-card-count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="topics-page">
      <header className="page-header">
        <div>
          <button type="button" className="ghost-btn" onClick={() => setParams({})}>
            {t('backToCats')}
          </button>
          <h1>{active ? L(active.title) : t('topics')}</h1>
          <p>
            {filtered.length} {t('topics')}
          </p>
        </div>
        <Link to="/search" className="cta-secondary">
          {t('search')}
        </Link>
      </header>

      <div className="topic-grid">
        {filtered.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  )
}
