export type Locale = 'fa' | 'ar' | 'en' | 'ku'

export type LocalizedString = Record<Locale, string>

export const LOCALES: { id: Locale; label: string; native: string; dir: 'rtl' | 'ltr' }[] = [
  { id: 'fa', label: 'Persian', native: 'فارسی', dir: 'rtl' },
  { id: 'ar', label: 'Arabic', native: 'العربية', dir: 'rtl' },
  { id: 'ku', label: 'Kurdish', native: 'کوردی', dir: 'rtl' },
  { id: 'en', label: 'English', native: 'English', dir: 'ltr' },
]

export function isRtl(locale: Locale) {
  return locale !== 'en'
}
