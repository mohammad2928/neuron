import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Clock3, NotebookPen, Trash2 } from 'lucide-react'
import { getTopic } from '../data/topics/catalog'
import { useI18n } from '../hooks/useI18n'
import { useHistoryStore } from '../store/historyStore'
import { useNotesStore } from '../store/notesStore'

export function HistoryPage() {
  const { t, L, locale } = useI18n()
  const entries = useHistoryStore((s) => s.entries)
  const clearHistory = useHistoryStore((s) => s.clearHistory)
  const notesMap = useNotesStore((s) => s.notes)
  const notes = useMemo(
    () =>
      Object.entries(notesMap)
        .filter(([, n]) => n.text.trim())
        .map(([topicId, n]) => ({ topicId, text: n.text, updatedAt: n.updatedAt }))
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [notesMap],
  )

  const fmt = (ts: number) =>
    new Intl.DateTimeFormat(locale === 'en' ? 'en' : locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(ts)

  return (
    <div className="history-page">
      <header className="page-header">
        <div>
          <h1>{t('history')}</h1>
          <p>{t('indexedDbHint')}</p>
        </div>
        {entries.length > 0 && (
          <button type="button" className="ghost-btn danger" onClick={clearHistory}>
            <Trash2 size={14} />
            {t('clearHistory')}
          </button>
        )}
      </header>

      <section className="history-section">
        <h2>
          <Clock3 size={18} />
          {t('history')}
        </h2>
        {entries.length === 0 ? (
          <p className="empty-state">{t('emptyHistory')}</p>
        ) : (
          <ul className="history-list">
            {entries.map((e) => {
              const topic = getTopic(e.topicId)
              if (!topic) return null
              return (
                <li key={`${e.topicId}-${e.visitedAt}`}>
                  <Link to={`/topics/${topic.id}`} className="history-item">
                    <div>
                      <strong>{L(topic.title)}</strong>
                      <span>{L(topic.summary)}</span>
                    </div>
                    <time>{fmt(e.visitedAt)}</time>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="history-section">
        <h2>
          <NotebookPen size={18} />
          {t('myNotes')}
        </h2>
        {notes.length === 0 ? (
          <p className="empty-state">{t('emptyNotes')}</p>
        ) : (
          <ul className="history-list">
            {notes.map((n) => {
              const topic = getTopic(n.topicId)
              return (
                <li key={n.topicId}>
                  <Link to={`/topics/${n.topicId}`} className="history-item note-item">
                    <div>
                      <strong>{topic ? L(topic.title) : n.topicId}</strong>
                      <span>{n.text.slice(0, 160)}{n.text.length > 160 ? '…' : ''}</span>
                    </div>
                    <time>{fmt(n.updatedAt)}</time>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
