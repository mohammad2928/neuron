import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createIdbStorage } from '../lib/idbStorage'

export interface NoteEntry {
  text: string
  updatedAt: number
}

interface NotesState {
  notes: Record<string, NoteEntry>
  setNote: (topicId: string, text: string) => void
  clearNote: (topicId: string) => void
  allNotes: () => Array<{ topicId: string; text: string; updatedAt: number }>
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: {},
      setNote: (topicId, text) =>
        set((state) => ({
          notes: {
            ...state.notes,
            [topicId]: { text, updatedAt: Date.now() },
          },
        })),
      clearNote: (topicId) =>
        set((state) => {
          const next = { ...state.notes }
          delete next[topicId]
          return { notes: next }
        }),
      allNotes: () =>
        Object.entries(get().notes)
          .filter(([, n]) => n.text.trim())
          .map(([topicId, n]) => ({ topicId, text: n.text, updatedAt: n.updatedAt }))
          .sort((a, b) => b.updatedAt - a.updatedAt),
    }),
    {
      name: 'neuron-notes-idb-v1',
      storage: createIdbStorage(),
    },
  ),
)
