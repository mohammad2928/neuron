import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createIdbStorage } from '../lib/idbStorage'

export type ThemeMode = 'dark' | 'light'

interface ThemeState {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        set({ theme: next })
      },
    }),
    {
      name: 'neuron-theme-idb-v1',
      storage: createIdbStorage(),
      onRehydrateStorage: () => (state) => {
        applyTheme(state?.theme ?? 'dark')
      },
    },
  ),
)
