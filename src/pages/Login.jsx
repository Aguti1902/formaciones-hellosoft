import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'
import { tracks } from '../data'
import { useAuth } from '../AuthContext.jsx'

export default function Login() {
  const { trackId } = useParams()
  const track = tracks[trackId]
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const from = location.state?.from || `/${trackId}`

  if (!track) return <Navigate to="/" replace />
  if (isAuthenticated(track.id)) return <Navigate to={from} replace />

  function onSubmit(event) {
    event.preventDefault()
    if (login(track.id, password.trim())) {
      navigate(from, { replace: true })
      return
    }
    setError('La contraseña no es correcta para este perfil.')
  }

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={onSubmit}>
        <div className="kicker">{track.badge}</div>
        <h1>
          <LockKeyhole size={22} />
          {track.title}
        </h1>
        <p>Introduce la contraseña de este perfil para ver los tutoriales.</p>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setError('')
          }}
          placeholder="Contraseña de acceso"
          autoFocus
        />
        {error ? <p className="form-error">{error}</p> : null}
        <button className="btn btn-primary" type="submit">
          Entrar a la formación
        </button>
        <Link className="login-back" to="/">
          Elegir otro perfil
        </Link>
      </form>
    </div>
  )
}
