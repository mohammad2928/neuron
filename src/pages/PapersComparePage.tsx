import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import type { ResearchPaper } from '../data/papers/types'
import { fetchPapersCompare } from '../lib/api'
import { useI18n } from '../hooks/useI18n'

function clip(text: string, n = 280) {
  const s = (text || '').trim()
  return s.length <= n ? s : `${s.slice(0, n)}…`
}

export function PapersComparePage() {
  const { t, L } = useI18n()
  const [params] = useSearchParams()
  const ids = (params.get('ids') || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 3)

  const [papers, setPapers] = useState<ResearchPaper[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    if (ids.length < 2) {
      setPapers([])
      setLoading(false)
      return
    }
    setLoading(true)
    fetchPapersCompare(ids)
      .then((res) => {
        if (alive) setPapers(res.items)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [ids.join(',')])

  if (loading) return <div className="empty-state">…</div>

  if (papers.length < 2) {
    return (
      <div className="empty-state">
        <h1>{t('papersCompareTitle')}</h1>
        <p>{t('papersCompareHint')}</p>
        <Link to="/papers">{t('papers')}</Link>
      </div>
    )
  }

  const rows: { label: string; render: (p: ResearchPaper) => ReactNode }[] = [
    { label: t('papersFieldYear'), render: (p) => p.year },
    { label: t('papersFieldVenue'), render: (p) => p.venue },
    { label: t('papersFieldTrack'), render: (p) => p.track },
    {
      label: t('papersCategories'),
      render: (p) => (p.categories?.length ? p.categories.join(', ') : '—'),
    },
    {
      label: t('papersKeywords'),
      render: (p) => (p.keywords?.length ? p.keywords.join(', ') : (p.tags || []).join(', ')),
    },
    {
      label: t('papersFieldAuthors'),
      render: (p) => p.authors.slice(0, 6).join(', '),
    },
    { label: t('papersAbstract'), render: (p) => clip(p.abstract, 320) },
    { label: t('papersAlgorithm'), render: (p) => clip(L(p.algorithm), 420) },
    {
      label: t('papersFieldLinks'),
      render: (p) => (
        <div className="compare-links">
          {p.url ? (
            <a href={p.url} target="_blank" rel="noreferrer noopener">
              {t('papersOpen')} <ExternalLink size={12} />
            </a>
          ) : null}
          {p.pdfUrl ? (
            <a href={p.pdfUrl} target="_blank" rel="noreferrer noopener">
              {t('papersOpenPdf')}
            </a>
          ) : null}
          {p.journalUrl ? (
            <a href={p.journalUrl} target="_blank" rel="noreferrer noopener">
              {t('papersOpenJournal')}
            </a>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <div className="papers-compare-page dense-copy">
      <nav className="topic-breadcrumb">
        <Link to="/papers">{t('papers')}</Link>
        <span>/</span>
        <span>{t('papersCompare')}</span>
      </nav>

      <header className="page-hero">
        <p className="eyebrow">{t('papersCompare')}</p>
        <h1>{t('papersCompareTitle')}</h1>
        <p className="page-lede">{t('papersCompareHint')}</p>
      </header>

      <div className="papers-compare-table-wrap">
        <table className="papers-compare-table">
          <thead>
            <tr>
              <th scope="col">{t('papersCompare')}</th>
              {papers.map((p) => (
                <th key={p.id} scope="col">
                  <Link to={`/papers/${p.id}`}>{p.title}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {papers.map((p) => (
                  <td key={`${row.label}-${p.id}`}>{row.render(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
