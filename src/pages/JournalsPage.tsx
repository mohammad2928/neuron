import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Library, Search, Sparkles } from 'lucide-react'
import { loadVenueCounts, loadVenues } from '../data/venues/catalog'
import { matchVenuesApi } from '../lib/api'
import type { ResearchVenue, VenueMatch } from '../data/venues/types'
import { useI18n } from '../hooks/useI18n'

function VenueCard({
  v,
}: {
  v: ResearchVenue & { score?: number; matchedKeywords?: string[]; reason?: string }
}) {
  const { t } = useI18n()
  return (
    <article className={`venue-card rigor-${v.rigor}`}>
      <div className="venue-card-top">
        <span className={`venue-kind ${v.kind}`}>
          {v.kind === 'journal' ? t('journalsKindJournal') : t('journalsKindConf')}
        </span>
        <span className="venue-abbr">{v.abbr}</span>
      </div>
      <h3>{v.name}</h3>
      <p className="venue-specialty">{v.specialty}</p>
      <div className="venue-metrics">
        <span>
          {v.kind === 'journal' ? t('journalsIF') : t('journalsH5')}:{' '}
          <strong>
            {v.kind === 'journal'
              ? v.impactFactor > 0
                ? v.impactFactor.toFixed(1)
                : '—'
              : v.h5Index && v.h5Index > 0
                ? String(v.h5Index)
                : v.impactFactor > 0
                  ? String(Math.round(v.impactFactor))
                  : '—'}
          </strong>
          {v.metricYear ? ` (${v.metricYear})` : ''}
        </span>
        <span>
          {t('journalsRigor')}: <strong>{v.rigor}/5</strong> ({v.acceptanceHint})
        </span>
        <span>
          {t('journalsPublisher')}: {v.publisher}
        </span>
        {v.citationNote ? <span className="venue-cite-note">{v.citationNote}</span> : null}
      </div>
      <div className="paper-tags">
        {v.domains.slice(0, 4).map((d) => (
          <span key={`d-${d}`}>{d}</span>
        ))}
        {v.keywords.slice(0, 6).map((k) => (
          <span key={`k-${k}`}>{k}</span>
        ))}
      </div>
      {v.matchedKeywords && v.matchedKeywords.length > 0 ? (
        <p className="venue-match-reason">
          {t('journalsMatched')}: {v.matchedKeywords.join(', ')}
        </p>
      ) : null}
      {typeof v.score === 'number' ? (
        <p className="venue-score">
          {t('journalsScore')}: {v.score.toFixed(1)}
        </p>
      ) : null}
      <a className="paper-link" href={v.url} target="_blank" rel="noreferrer noopener">
        {t('journalsOpenSite')}
        <ExternalLink size={14} />
      </a>
    </article>
  )
}

export function JournalsPage() {
  const { t } = useI18n()
  const [tab, setTab] = useState<'journals' | 'conferences' | 'finder'>('journals')
  const [q, setQ] = useState('')
  const [domain, setDomain] = useState('all')
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [finderKind, setFinderKind] = useState<'all' | 'journal' | 'conference'>('all')
  const [finderResult, setFinderResult] = useState<{
    keywords: string[]
    matches: VenueMatch[]
  } | null>(null)
  const [journalCount, setJournalCount] = useState(0)
  const [conferenceCount, setConferenceCount] = useState(0)
  const [items, setItems] = useState<ResearchVenue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVenueCounts().then((c) => {
      setJournalCount(c.journalCount)
      setConferenceCount(c.conferenceCount)
    })
  }, [])

  useEffect(() => {
    if (tab === 'finder') return
    let alive = true
    setLoading(true)
    loadVenues(tab === 'journals' ? 'journal' : 'conference', q)
      .then((res) => {
        if (!alive) return
        let list = res.items
        if (domain !== 'all') {
          list = list.filter((v) => v.domains.includes(domain) || v.keywords.includes(domain))
        }
        setItems(list)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [tab, q, domain])

  const domains = useMemo(() => {
    const s = new Set<string>()
    for (const v of items) v.domains.forEach((d) => s.add(d))
    return ['all', ...[...s].sort()]
  }, [items])

  const runFinder = async () => {
    const res = await matchVenuesApi({ title, abstract, kind: finderKind })
    setFinderResult(res)
  }

  return (
    <div className="journals-page dense-copy">
      <header className="page-hero">
        <p className="eyebrow">{t('journalsEyebrow')}</p>
        <h1>{t('journalsTitle')}</h1>
        <p className="page-lede">{t('journalsLede')}</p>
        <p className="hero-stats">
          {journalCount} {t('journalsKindJournal')} · {conferenceCount} {t('journalsKindConf')} · API
        </p>
      </header>

      <div className="papers-tracks" role="tablist">
        <button type="button" className={`phase-chip${tab === 'journals' ? ' is-on' : ''}`} onClick={() => setTab('journals')}>
          <Library size={14} /> {t('journalsTabJournals')} ({journalCount})
        </button>
        <button type="button" className={`phase-chip${tab === 'conferences' ? ' is-on' : ''}`} onClick={() => setTab('conferences')}>
          {t('journalsTabConfs')} ({conferenceCount})
        </button>
        <button type="button" className={`phase-chip${tab === 'finder' ? ' is-on' : ''}`} onClick={() => setTab('finder')}>
          <Sparkles size={14} /> {t('journalsTabFinder')}
        </button>
      </div>

      {tab !== 'finder' ? (
        <>
          <div className="papers-toolbar">
            <label className="papers-search">
              <Search size={16} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('journalsSearchPh')} aria-label={t('search')} />
            </label>
            <div className="papers-tracks">
              {domains.slice(0, 20).map((d) => (
                <button key={d} type="button" className={`phase-chip${domain === d ? ' is-on' : ''}`} onClick={() => setDomain(d)}>
                  {d === 'all' ? t('allCategories') : d}
                </button>
              ))}
            </div>
          </div>
          <p className="papers-note">{t('journalsNote')}</p>
          {loading ? <p className="empty-state">…</p> : null}
          <div className="venue-grid">
            {items.map((v) => (
              <VenueCard key={v.id} v={v} />
            ))}
          </div>
          {!loading && items.length === 0 ? <p className="empty-state">{t('noResults')}</p> : null}
        </>
      ) : (
        <section className="venue-finder">
          <p className="papers-note">{t('journalsFinderHint')}</p>
          <label className="field-block">
            <span>{t('journalsManuscriptTitle')}</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Attention Is All You Need" />
          </label>
          <label className="field-block">
            <span>{t('journalsManuscriptAbstract')}</span>
            <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} rows={7} placeholder={t('journalsAbstractPh')} />
          </label>
          <div className="papers-tracks">
            {(['all', 'journal', 'conference'] as const).map((k) => (
              <button key={k} type="button" className={`phase-chip${finderKind === k ? ' is-on' : ''}`} onClick={() => setFinderKind(k)}>
                {k === 'all' ? t('allCategories') : k === 'journal' ? t('journalsKindJournal') : t('journalsKindConf')}
              </button>
            ))}
          </div>
          <button type="button" className="nav-btn primary" onClick={runFinder} disabled={!title.trim() && !abstract.trim()}>
            {t('journalsFindSuitable')}
          </button>

          {finderResult ? (
            <div className="finder-results">
              <h2>{t('journalsExtractedKw')}</h2>
              <div className="paper-tags">
                {finderResult.keywords.length ? finderResult.keywords.map((k) => <span key={k}>{k}</span>) : <span>{t('journalsNoKw')}</span>}
              </div>
              <h2>{t('journalsSuggested')}</h2>
              <div className="venue-grid">
                {finderResult.matches.map((v) => (
                  <VenueCard key={v.id} v={v} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      )}
    </div>
  )
}
