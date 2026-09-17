import { NavLink, Navigate, Outlet, useNavigate, useParams } from 'react-router-dom'
import {
  CalendarDays,
  Clock3,
  LayoutGrid,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
  UserRoundCog,
} from 'lucide-react'
import { tracks } from './data'
import { useAuth } from './AuthContext.jsx'
import { useProgress } from './ProgressContext.jsx'

const ICONS = {
  introduccion: Sparkles,
  perfiles: UserRoundCog,
  clientes: Users,
  empleados: Users,
  fichajes: Clock3,
  agenda: CalendarDays,
  pos: ShoppingBag,
}

function Header({ track }) {
  const { logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const loggedIn = track ? isAuthenticated(track.id) : false

  return (
    <header className="topbar">
      <NavLink to="/" className="brand">
        <img src="/hellonails-icon.png" alt="Hello Nails" />
        <div className="brand-copy">
          <strong>Hello Nails</strong>
          <span>Hello Soft</span>
        </div>
      </NavLink>
      <div className="center-name">
        {track ? track.title : 'Academia Hello Soft'}
      </div>
      <div className="top-actions">
        <span className="chip chip-gold hide-mobile">Formación</span>
        {loggedIn ? (
          <button
            className="chip"
            type="button"
            onClick={() => {
              logout(track.id)
              navigate('/')
            }}
          >
            <span className="hide-mobile">Cerrar sesión</span>
            <span className="show-mobile">Salir</span>
          </button>
        ) : null}
      </div>
    </header>
  )
}

export function Shell({ trackId }) {
  const track = tracks[trackId]
  const { isCompleted } = useProgress()

  function navClass({ isActive }) {
    return `nav-item${isActive ? ' active' : ''}`
  }

  return (
    <div className="app shell">
      <div className="shell-top">
        <Header track={track} />
        <nav className="sidebar">
          <NavLink to={`/${track.id}`} end className={navClass}>
            <LayoutGrid />
            <span className="nav-label">
              <span>Módulos</span>
            </span>
          </NavLink>
          {track.modules.map((module) => {
            const Icon = ICONS[module.id] || Store
            return (
              <NavLink
                key={module.id}
                to={`/${track.id}/${module.id}`}
                className={navClass}
              >
                <Icon />
                <span className="nav-label">
                  <span>{module.navTitle || module.title}</span>
                </span>
                <span className={`dot${isCompleted(track.id, module.id) ? ' done' : ''}`} />
              </NavLink>
            )
          })}
        </nav>
      </div>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export function HomeShell() {
  return (
    <div className="app">
      <Header />
      <main className="content content-home">
        <Outlet />
      </main>
    </div>
  )
}

export function AccessShell() {
  const { trackId } = useParams()
  const track = tracks[trackId]
  if (!track) return <Navigate to="/" replace />
  return (
    <div className="app">
      <Header track={track} />
      <main className="content content-home">
        <Outlet />
      </main>
    </div>
  )
}
