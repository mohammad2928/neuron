import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ExternalLink, FileText, Globe2 } from 'lucide-react'
import { getPaperById } from '../data/papers/catalog'
import type { ResearchPaper } from '../data/papers/types'
import { useI18n } from '../hooks/useI18n'
import { ExplainSection, Paragraphs } from '../components/topic/ExplainBlocks'
import { PaperMethodVisual } from '../components/papers/PaperMethodVisual'

export function PaperDetailPage() {
  const { paperId = '' } = useParams()
  const { t, L } = useI18n()
  const [paper, setPaper] = useState<ResearchPaper | null | undefined>(undefined)

  useEffect(() => {
    let alive = true
    setPaper(undefined)
    getPaperById(paperId).then((p) => {
      if (alive) setPaper(p ?? null)
    })
    return () => {
      alive = false
    }
  }, [paperId])

  if (paper === undefined) {
    return <div className="empty-state">…</div>
  }

  if (!paper) {
    return (
      <div className="empty-state">
        <h1>{t('noResults')}</h1>
        <Link to="/papers">{t('papers')}</Link>
      </div>
    )
  }

  return (
    <div className="paper-detail dense-copy">
      <nav className="topic-breadcrumb">
        <Link to="/papers">{t('papers')}</Link>
        <span>/</span>
        <span>{paper.year}</span>
      </nav>

      <header className="page-hero">
        {paper.tier === 'award' ? <p className="eyebrow">{t('papersAward')}</p> : null}
        <h1 className="paper-detail-title">{paper.title}</h1>
        <p className="page-lede">
          {paper.year} · {paper.venue}
          {paper.journal ? (
            <>
              <br />
              {paper.journal}
            </>
          ) : null}
          <br />
          {paper.authors.join(', ')}
        </p>

        <div className="paper-link-row">
          {paper.url ? (
            <a className="paper-link" href={paper.url} target="_blank" rel="noreferrer noopener">
              {t('papersOpen')}
              <ExternalLink size={14} />
            </a>
          ) : null}
          {paper.pdfUrl ? (
            <a className="paper-link" href={paper.pdfUrl} target="_blank" rel="noreferrer noopener">
              <FileText size={14} />
              {t('papersOpenPdf')}
            </a>
          ) : null}
          {paper.htmlUrl ? (
            <a className="paper-link" href={paper.htmlUrl} target="_blank" rel="noreferrer noopener">
              {t('papersOpenHtml')}
              <ExternalLink size={14} />
            </a>
          ) : null}
          {paper.journalUrl ? (
            <a className="paper-link" href={paper.journalUrl} target="_blank" rel="noreferrer noopener">
              <Globe2 size={14} />
              {t('papersOpenJournal')}
            </a>
          ) : null}
        </div>
      </header>

      <section className="step-stack">
        <ExplainSection title={t('papersAbstract')} tone="default">
          <p>{paper.abstract}</p>
        </ExplainSection>

        <ExplainSection title={t('papersAlgoVisual')} tone="why">
          <div className="visual-stage is-alive">
            <div className="visual-live-badge">Method Animation</div>
            <PaperMethodVisual track={String(paper.track)} title={paper.title} playing />
          </div>
        </ExplainSection>

        <ExplainSection title={t('papersAlgorithm')} tone="math">
          <Paragraphs text={L(paper.algorithm)} />
        </ExplainSection>

        <div className="paper-tags">
          <span>{paper.track}</span>
          {(paper.keywords ?? []).map((tag) => (
            <span key={`k-${tag}`}>{tag}</span>
          ))}
          {(paper.categories ?? []).map((c) => (
            <span key={`c-${c}`}>{c}</span>
          ))}
        </div>
      </section>
    </div>
  )
}
