import { Link } from 'react-router-dom'
import { Clock3, CheckCircle2 } from 'lucide-react'
import type { Topic } from '../../types/course'
import { useI18n } from '../../hooks/useI18n'
import { useProgressStore } from '../../store/progressStore'
import { categories } from '../../data/topics/catalog'

export function TopicCard({ topic }: { topic: Topic }) {
  const { t, L } = useI18n()
  const done = useProgressStore((s) => s.isComplete(topic.id))
  const cat = categories.find((c) => c.id === topic.category)

  return (
    <Link to={`/topics/${topic.id}`} className="topic-card">
      <div className="topic-card-top">
        <span className="topic-cat">{cat ? L(cat.title) : topic.category}</span>
        {done ? (
          <span className="topic-done">
            <CheckCircle2 size={14} />
            {t('seen')}
          </span>
        ) : null}
      </div>
      <h3>{L(topic.title)}</h3>
      <p>{L(topic.summary)}</p>
      <div className="topic-card-meta">
        <span>
          <Clock3 size={14} />
          {topic.minutes} {t('minutes')}
        </span>
        <div className="tag-row">
          {topic.tags.slice(0, 2).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}
