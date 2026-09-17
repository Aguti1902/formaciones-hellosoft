import { Navigate, useLocation, useParams } from 'react-router-dom'
import { tracks } from './data'
import { useAuth } from './AuthContext.jsx'
import { Shell } from './Layout.jsx'

export default function ProtectedTrack() {
  const { trackId } = useParams()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  if (!tracks[trackId]) return <Navigate to="/" replace />
  if (!isAuthenticated(trackId)) {
    return <Navigate to={`/${trackId}/acceso`} replace state={{ from: location.pathname }} />
  }

  return <Shell trackId={trackId} />
}
