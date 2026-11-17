import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LOCALES, isRtl, type Locale } from '../i18n/types'
import { createIdbStorage } from '../lib/idbStorage'

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'fa',
      setLocale: (locale) => {
        const meta = LOCALES.find((l) => l.id === locale) ?? LOCALES[0]
        document.documentElement.lang = locale
        document.documentElement.dir = meta.dir
        set({ locale })
      },
    }),
    {
      name: 'neuron-locale-idb-v1',
      storage: createIdbStorage(),
      onRehydrateStorage: () => (state) => {
        const locale = state?.locale ?? 'fa'
        document.documentElement.lang = locale
        document.documentElement.dir = isRtl(locale) ? 'rtl' : 'ltr'
      },
    },
  ),
)
