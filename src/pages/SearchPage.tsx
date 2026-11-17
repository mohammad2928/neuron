import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { searchTopics, topics } from '../data/topics/catalog'
import { TopicCard } from '../components/topic/TopicCard'
import { useI18n } from '../hooks/useI18n'

export function SearchPage() {
  const { t, locale, dir } = useI18n()
  const [q, setQ] = useState('')

  const results = useMemo(() => searchTopics(q, locale), [q, locale])

  return (
    <div className="search-page">
      <header className="page-header">
        <h1>{t('search')}</h1>
        <p>
          {topics.length}+ {t('topics')}
        </p>
      </header>

      <label className="search-box">
        <Search size={18} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('searchPlaceholder')}
          dir={dir}
          autoFocus
        />
      </label>

      {results.length === 0 ? (
        <p className="empty-state">{t('noResults')}</p>
      ) : (
        <>
          <p className="search-count">{results.length}</p>
          <div className="topic-grid">
            {results.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
