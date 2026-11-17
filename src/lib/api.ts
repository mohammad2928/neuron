import type { ResearchPaper } from '../data/papers/types'
import type { ResearchVenue, VenueMatch } from '../data/venues/types'

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') || ''

function authHeaders(): HeadersInit {
  const token = import.meta.env.VITE_API_READ_TOKEN as string | undefined
  return token ? { authorization: `Bearer ${token}` } : {}
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...authHeaders(),
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as { error?: string }).error || `API ${res.status}`)
  }
  return res.json() as Promise<T>
}

export type PapersMeta = {
  paperCount: number
  venueCount: number
  journalCount: number
  conferenceCount: number
  keywords: { key: string; count: number }[]
  tracks: { key: string; count: number }[]
  categories: { key: string; count: number }[]
}

export type PaperListItem = Omit<ResearchPaper, 'algorithm'> & { abstract: string }

export function fetchMeta() {
  return api<PapersMeta>('/api/meta')
}

export function fetchPapers(params: {
  page?: number
  pageSize?: number
  q?: string
  track?: string
  keyword?: string
  category?: string
}) {
  const sp = new URLSearchParams()
  if (params.page) sp.set('page', String(params.page))
  if (params.pageSize) sp.set('pageSize', String(params.pageSize))
  if (params.q) sp.set('q', params.q)
  if (params.track) sp.set('track', params.track)
  if (params.keyword) sp.set('keyword', params.keyword)
  if (params.category) sp.set('category', params.category)
  return api<{ total: number; page: number; pageSize: number; items: PaperListItem[] }>(
    `/api/papers?${sp}`,
  )
}

export function fetchPaper(id: string) {
  return api<ResearchPaper>(`/api/papers/${encodeURIComponent(id)}`)
}

export function fetchPapersCompare(ids: string[]) {
  return api<{ items: ResearchPaper[] }>('/api/papers/compare', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  })
}

export function fetchVenues(params?: { kind?: string; q?: string }) {
  const sp = new URLSearchParams()
  if (params?.kind) sp.set('kind', params.kind)
  if (params?.q) sp.set('q', params.q)
  const qs = sp.toString()
  return api<{ total: number; items: ResearchVenue[] }>(`/api/venues${qs ? `?${qs}` : ''}`)
}

export function matchVenuesApi(body: {
  title: string
  abstract: string
  kind?: 'all' | 'journal' | 'conference'
}) {
  return api<{ keywords: string[]; matches: VenueMatch[] }>('/api/venues/match', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
