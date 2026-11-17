import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { BookOpen, Clock3, FileText, Home, Library, Menu, Moon, Search, Sparkles, Sun, X } from 'lucide-react'
import { LOCALES } from '../../i18n/types'
import { useI18n } from '../../hooks/useI18n'
import { topicCount } from '../../data/topics/catalog'
import { useThemeStore } from '../../store/themeStore'

export function AppShell() {
  const { t, locale, setLocale, dir } = useI18n()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  return (
    <div className="app-shell" dir={dir}>
      <header className="top-nav">
        <div className="top-nav-inner">
          <button
            type="button"
            className="icon-btn nav-burger"
            aria-label={t('menu')}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden>
              <Sparkles size={18} />
            </span>
            <span className="brand-text">
              <strong>{t('brand')}</strong>
              <em>{t('brandTag')}</em>
            </span>
          </Link>

          <nav className="nav-links desktop-only" aria-label="main">
            <NavLink to="/" end>
              <Home size={16} />
              {t('home')}
            </NavLink>
            <NavLink to="/topics">
              <BookOpen size={16} />
              {t('topics')}
              <span className="nav-count">{topicCount}</span>
            </NavLink>
            <NavLink to="/papers">
              <FileText size={16} />
              {t('papers')}
            </NavLink>
            <NavLink to="/journals">
              <Library size={16} />
              {t('journals')}
            </NavLink>
            <NavLink to="/search">
              <Search size={16} />
              {t('search')}
            </NavLink>
            <NavLink to="/history">
              <Clock3 size={16} />
              {t('history')}
            </NavLink>
          </nav>

          <button
            type="button"
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('themeDay') : t('themeNight')}
            title={theme === 'dark' ? t('themeDay') : t('themeNight')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <label className="lang-switch">
            <span className="sr-only">{t('language')}</span>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as typeof locale)}
              aria-label={t('language')}
            >
              {LOCALES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.native}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {open && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <nav className="mobile-nav">
            <NavLink to="/" end>
              <Home size={18} />
              {t('home')}
            </NavLink>
            <NavLink to="/topics">
              <BookOpen size={18} />
              {t('topics')}
            </NavLink>
            <NavLink to="/papers">
              <FileText size={18} />
              {t('papers')}
            </NavLink>
            <NavLink to="/journals">
              <Library size={18} />
              {t('journals')}
            </NavLink>
            <NavLink to="/search">
              <Search size={18} />
              {t('search')}
            </NavLink>
            <NavLink to="/history">
              <Clock3 size={18} />
              {t('history')}
            </NavLink>
          </nav>
        </div>
      )}

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>{t('footerNote')}</p>
      </footer>
    </div>
  )
}
