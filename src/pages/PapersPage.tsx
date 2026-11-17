import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Filter, GitCompare, Search, Tags } from 'lucide-react'
import {
  loadPapersMeta,
  loadPapersPage,
  paperCategoryStats,
  paperKeywordStats,
  paperTrackStats,
} from '../data/papers/catalog'
import type { PaperListItem, PapersMeta } from '../lib/api'
import { useI18n } from '../hooks/useI18n'

const MAX_COMPARE = 3
const PAGE_SIZE = 24

export function PapersPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [track, setTrack] = useState('all')
  const [keyword, setKeyword] = useState('all')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [meta, setMeta] = useState<PapersMeta | null>(null)
  const [items, setItems] = useState<PaperListItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tracks, setTracks] = useState<{ key: string; count: number }[]>([])
  const [keywords, setKeywords] = useState<{ key: string; count: number }[]>([])
  const [categories, setCategories] = useState<{ key: string; count: number }[]>([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [m, tr, kw, cat] = await Promise.all([
          loadPapersMeta(),
          paperTrackStats(),
          paperKeywordStats(),
          paperCategoryStats(),
        ])
        if (!alive) return
        setMeta(m)
        setTracks(tr)
        setKeywords(kw.slice(0, 24))
        setCategories(cat.slice(0, 16))
      } catch (e) {
        if (alive) setError(String(e))
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [q, track, keyword, category])

  useEffect(() => {
    let alive = true
    setLoading(true)
    ;(async () => {
      try {
        const res = await loadPapersPage({
          page,
          pageSize: PAGE_SIZE,
          q,
          track,
          keyword,
          category,
        })
        if (!alive) return
        setItems(res.items)
        setTotal(res.total)
        setError('')
      } catch (e) {
        if (alive) setError(String(e))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [page, q, track, keyword, category])

  const toggleCompare = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, id]
    })
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const count = meta?.paperCount ?? 0

  return (
    <div className="papers-page dense-copy">
      <header className="page-hero">
        <p className="eyebrow">{t('papersEyebrow')}</p>
        <h1>{t('papersTitle')}</h1>
        <p className="page-lede">{t('papersLede')}</p>
        <p className="hero-stats">
          {count} {t('papersCountLabel')} · {t('papersShowing')} {total} {t('papersOf')} {count} · API
        </p>
      </header>

      <div className="papers-toolbar">
        <label className="papers-search">
          <Search size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('papersSearchPh')}
            aria-label={t('search')}
          />
        </label>

        <div className="papers-tracks" role="listbox" aria-label={t('papersFilter')}>
          <Filter size={14} />
          <button type="button" className={`phase-chip${track === 'all' ? ' is-on' : ''}`} onClick={() => setTrack('all')}>
            {t('allCategories')} ({count})
          </button>
          <button type="button" className={`phase-chip${track === 'award' ? ' is-on' : ''}`} onClick={() => setTrack('award')}>
            {t('papersAward')}
          </button>
          {tracks.map(({ key, count: c }) => (
            <button key={key} type="button" className={`phase-chip${track === key ? ' is-on' : ''}`} onClick={() => setTrack(key)}>
              {key} ({c})
            </button>
          ))}
        </div>

        <div className="papers-tracks" role="listbox" aria-label={t('papersKeywords')}>
          <Tags size={14} />
          <button type="button" className={`phase-chip${keyword === 'all' ? ' is-on' : ''}`} onClick={() => setKeyword('all')}>
            {t('papersKeywords')}: all
          </button>
          {keywords.map(({ key, count: c }) => (
            <button key={key} type="button" className={`phase-chip${keyword === key ? ' is-on' : ''}`} onClick={() => setKeyword(key)}>
              {key} ({c})
            </button>
          ))}
        </div>

        <div className="papers-tracks" role="listbox" aria-label={t('papersCategories')}>
          <Filter size={14} />
          <button type="button" className={`phase-chip${category === 'all' ? ' is-on' : ''}`} onClick={() => setCategory('all')}>
            {t('papersCategories')}: all
          </button>
          {categories.map(({ key, count: c }) => (
            <button key={key} type="button" className={`phase-chip${category === key ? ' is-on' : ''}`} onClick={() => setCategory(key)}>
              {key} ({c})
            </button>
          ))}
        </div>
      </div>

      <p className="papers-note">{t('papersMethodNote')}</p>

      {selected.length > 0 ? (
        <div className="papers-compare-bar">
          <div>
            <GitCompare size={16} />
            <strong>
              {t('papersCompare')}: {selected.length}/{MAX_COMPARE}
            </strong>
            <span>{t('papersCompareHint')}</span>
          </div>
          <div className="papers-compare-actions">
            <button type="button" className="ghost-btn" onClick={() => setSelected([])}>
              {t('papersCompareClear')}
            </button>
            <button
              type="button"
              className="nav-btn primary"
              disabled={selected.length < 2}
              onClick={() => navigate(`/papers/compare?ids=${selected.join(',')}`)}
            >
              {t('papersCompareGo')}
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="empty-state">{error}</p> : null}
      {loading ? <p className="empty-state">…</p> : null}

      <div className="papers-list">
        {items.map((p, idx) => {
          const on = selected.includes(p.id)
          return (
            <article key={p.id} className={`paper-card${p.tier === 'award' ? ' is-award' : ''}${on ? ' is-compare' : ''}`}>
              <div className="paper-card-row">
                <Link to={`/papers/${p.id}`} className="paper-card-head">
                  <span className="paper-idx">{(page - 1) * PAGE_SIZE + idx + 1}</span>
                  <div>
                    <h2>{p.title}</h2>
                    <p>
                      {p.year} · {p.venue}
                      {p.tier === 'award' ? ` · ${t('papersAward')}` : ''}
                      {p.track ? ` · ${p.track}` : ''}
                    </p>
                    <p className="paper-authors">{p.authors.slice(0, 4).join(', ')}</p>
                    <p className="paper-snip">{p.abstract.slice(0, 160)}…</p>
                    <div className="paper-tags">
                      {(p.keywords?.length ? p.keywords : p.tags).slice(0, 6).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                      {(p.categories ?? []).slice(0, 3).map((c) => (
                        <span key={c}>{c}</span>
                      ))}
                    </div>
                  </div>
                </Link>
                <button
                  type="button"
                  className={`paper-compare-toggle${on ? ' is-on' : ''}`}
                  onClick={() => toggleCompare(p.id)}
                  aria-pressed={on}
                >
                  {on ? t('papersInCompare') : t('papersAddCompare')}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <div className="papers-compare-actions" style={{ justifyContent: 'center' }}>
        <button type="button" className="nav-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          {t('prev')}
        </button>
        <span className="hero-stats">
          {page} / {pages}
        </span>
        <button type="button" className="nav-btn" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
          {t('next')}
        </button>
      </div>

      {!loading && items.length === 0 ? <p className="empty-state">{t('noResults')}</p> : null}
    </div>
  )
}
