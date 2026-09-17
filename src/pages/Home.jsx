import { Link } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Play, Store, Building2 } from 'lucide-react'
import { tracks } from '../data'
import { useAuth } from '../AuthContext.jsx'
import { QuestionCard } from '../QuestionBox.jsx'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const franq = tracks.franquiciados
  const tienda = tracks.tienda

  function hrefFor(track) {
    return isAuthenticated(track.id) ? `/${track.id}` : `/${track.id}/acceso`
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>
            <span className="icon-badge">
              <Store size={18} />
            </span>
            Formación Hello Soft
          </h1>
          <p>Elige tu perfil. Cada formación tiene su propia contraseña de acceso.</p>
        </div>
      </div>

      <div className="hero-grid">
        <Link to={hrefFor(franq)} className="card card-link hero-card">
          <div>
            <div className="card-top">
              <div className="kicker">{franq.badge}</div>
              <span className="status status-pending">
                <LockKeyhole size={12} /> Acceso privado
              </span>
            </div>
            <h2>
              <Building2 size={18} />
              {franq.title}
            </h2>
            <p>{franq.subtitle}</p>
          </div>
          <div className="card-actions">
            <span className="mini-btn">
              <Play size={14} /> {isAuthenticated(franq.id) ? 'Continuar' : 'Acceder'}
            </span>
            <span className="mini-btn">
              {franq.modules.length} módulos <ArrowRight size={14} />
            </span>
          </div>
        </Link>

        <Link to={hrefFor(tienda)} className="card card-link hero-card">
          <div>
            <div className="card-top">
              <div className="kicker">{tienda.badge}</div>
              <span className="status status-pending">
                <LockKeyhole size={12} /> Acceso privado
              </span>
            </div>
            <h2>
              <Store size={18} />
              {tienda.title}
            </h2>
            <p>{tienda.subtitle}</p>
          </div>
          <div className="card-actions">
            <span className="mini-btn">
              <Play size={14} /> {isAuthenticated(tienda.id) ? 'Continuar' : 'Acceder'}
            </span>
            <span className="mini-btn">
              {tienda.modules.length} módulos <ArrowRight size={14} />
            </span>
          </div>
        </Link>
      </div>

      <QuestionCard />
    </>
  )
}
