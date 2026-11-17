import { useMemo } from 'react'
import { tr, type UiKey } from '../i18n/ui'
import type { LocalizedString } from '../i18n/types'
import { useLocaleStore } from '../store/localeStore'

export function useI18n() {
  const locale = useLocaleStore((s) => s.locale)
  const setLocale = useLocaleStore((s) => s.setLocale)

  return useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: UiKey) => tr(key, locale),
      L: (value: LocalizedString | undefined, fallback = '') => value?.[locale] ?? fallback,
      dir: locale === 'en' ? ('ltr' as const) : ('rtl' as const),
    }),
    [locale, setLocale],
  )
}
