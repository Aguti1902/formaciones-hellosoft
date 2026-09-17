import { Navigate, Route, Routes } from 'react-router-dom'
import { HomeShell, AccessShell } from './Layout.jsx'
import Home from './pages/Home.jsx'
import TrackHome from './pages/TrackHome.jsx'
import ModulePage from './pages/ModulePage.jsx'
import Login from './pages/Login.jsx'
import { AuthProvider } from './AuthContext.jsx'
import { ProgressProvider } from './ProgressContext.jsx'
import ProtectedTrack from './ProtectedTrack.jsx'
import { QuestionDock } from './QuestionBox.jsx'

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Routes>
          <Route element={<HomeShell />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<AccessShell />}>
            <Route path="/:trackId/acceso" element={<Login />} />
          </Route>
          <Route path="/:trackId" element={<ProtectedTrack />}>
            <Route index element={<TrackHome />} />
            <Route path=":moduleId" element={<ModulePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <QuestionDock />
      </ProgressProvider>
    </AuthProvider>
  )
}
