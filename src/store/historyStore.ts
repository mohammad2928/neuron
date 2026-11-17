import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createIdbStorage } from '../lib/idbStorage'

export interface HistoryEntry {
  topicId: string
  visitedAt: number
}

interface HistoryState {
  entries: HistoryEntry[]
  pushVisit: (topicId: string) => void
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      pushVisit: (topicId) => {
        const next = [
          { topicId, visitedAt: Date.now() },
          ...get().entries.filter((e) => e.topicId !== topicId),
        ].slice(0, 200)
        set({ entries: next })
      },
      clearHistory: () => set({ entries: [] }),
    }),
    {
      name: 'neuron-history-idb-v1',
      storage: createIdbStorage(),
    },
  ),
)
