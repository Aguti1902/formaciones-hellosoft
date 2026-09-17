import { Link, useParams } from 'react-router-dom'
import { Play, Users } from 'lucide-react'
import { tracks } from '../data'
import { QuestionCard } from '../QuestionBox.jsx'

export default function TrackHome() {
  const { trackId } = useParams()
  const track = tracks[trackId]
  if (!track) return null

  return (
    <>
      <div className="page-head">
        <div>
          <h1>
            <span className="icon-badge">
              <Users size={18} />
            </span>
            {track.title}
          </h1>
          <p>{track.subtitle}</p>
        </div>
        <div className="page-head-actions">
          <Link className="btn btn-ghost" to="/">
            Cambiar perfil
          </Link>
          <Link className="btn btn-primary" to={`/${track.id}/${track.modules[0].id}`}>
            <Play size={15} /> Empezar formación
          </Link>
        </div>
      </div>

      <div className="grid">
        {track.modules.map((module, index) => (
          <Link
            key={module.id}
            to={`/${track.id}/${module.id}`}
            className="card card-link"
          >
            <div className="card-top">
              <h3>
                {index + 1}. {module.title}
              </h3>
            </div>
            <p>{module.description}</p>
            <div className="card-actions">
              <span className="mini-btn">
                <Play size={13} /> Ver vídeo
              </span>
            </div>
          </Link>
        ))}
      </div>

      <QuestionCard />
    </>
  )
}
