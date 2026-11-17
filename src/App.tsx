import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { TopicsPage } from './pages/TopicsPage'
import { SearchPage } from './pages/SearchPage'
import { TopicPage } from './pages/TopicPage'
import { HistoryPage } from './pages/HistoryPage'
import { PapersPage } from './pages/PapersPage'
import { PaperDetailPage } from './pages/PaperDetailPage'
import { PapersComparePage } from './pages/PapersComparePage'
import { JournalsPage } from './pages/JournalsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="topics" element={<TopicsPage />} />
          <Route path="topics/:topicId" element={<TopicPage />} />
          <Route path="papers" element={<PapersPage />} />
          <Route path="papers/compare" element={<PapersComparePage />} />
          <Route path="papers/:paperId" element={<PaperDetailPage />} />
          <Route path="journals" element={<JournalsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
