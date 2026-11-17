import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NotebookPen, Trash2, X } from 'lucide-react'
import { useNotesStore } from '../../store/notesStore'
import { useI18n } from '../../hooks/useI18n'

interface NotesPanelProps {
  topicId: string
  topicTitle: string
  open: boolean
  onClose: () => void
}

export function NotesPanel({ topicId, topicTitle, open, onClose }: NotesPanelProps) {
  const { t, dir } = useI18n()
  const stored = useNotesStore((s) => s.notes[topicId]?.text ?? '')
  const setNote = useNotesStore((s) => s.setNote)
  const clearNote = useNotesStore((s) => s.clearNote)
  const [draft, setDraft] = useState(stored)

  useEffect(() => {
    setDraft(stored)
  }, [topicId, stored])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (draft !== stored) setNote(topicId, draft)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [draft, topicId, setNote, stored])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="notes-backdrop"
            aria-label={t('close')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="notes-panel"
            dir={dir}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <header className="notes-header">
              <div>
                <div className="notes-kicker">
                  <NotebookPen size={16} />
                  {t('notesTitle')}
                </div>
                <h3>{topicTitle}</h3>
              </div>
              <button type="button" className="icon-btn" onClick={onClose} aria-label={t('close')}>
                <X size={18} />
              </button>
            </header>
            <textarea
              className="notes-textarea"
              placeholder={t('notesPlaceholder')}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              dir={dir}
            />
            <footer className="notes-footer">
              <span className="notes-hint">{t('notesHint')}</span>
              <button
                type="button"
                className="ghost-btn danger"
                disabled={!draft}
                onClick={() => {
                  clearNote(topicId)
                  setDraft('')
                }}
              >
                <Trash2 size={14} />
                {t('clear')}
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
