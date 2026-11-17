import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createIdbStorage } from '../lib/idbStorage'

interface ProgressState {
  completed: Record<string, boolean>
  markComplete: (topicId: string) => void
  isComplete: (topicId: string) => boolean
  completedCount: () => number
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: {},
      markComplete: (topicId) =>
        set((state) => ({
          completed: { ...state.completed, [topicId]: true },
        })),
      isComplete: (topicId) => Boolean(get().completed[topicId]),
      completedCount: () => Object.values(get().completed).filter(Boolean).length,
    }),
    {
      name: 'neuron-progress-idb-v1',
      storage: createIdbStorage(),
    },
  ),
)
