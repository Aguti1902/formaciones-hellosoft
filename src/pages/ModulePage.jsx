import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react'
import { tracks, videoUrl } from '../data'
import { useProgress } from '../ProgressContext.jsx'
import { QuestionCard } from '../QuestionBox.jsx'

export default function ModulePage() {
  const { trackId, moduleId } = useParams()
  const { isCompleted, markCompleted } = useProgress()
  const track = tracks[trackId]
  const index = track?.modules.findIndex((item) => item.id === moduleId) ?? -1
  const module = track?.modules[index]
  const src = useMemo(
    () => (track && module ? videoUrl(track.id, module.file) : ''),
    [track, module],
  )

  if (!track || !module) {
    return <p className="empty">No hemos encontrado este módulo.</p>
  }

  const prev = index > 0 ? track.modules[index - 1] : null
  const next = index < track.modules.length - 1 ? track.modules[index + 1] : null
  const done = isCompleted(track.id, module.id)

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{module.title}</h1>
          <p>
            {track.title} · Módulo {index + 1} de {track.modules.length}
          </p>
        </div>
        {done ? (
          <span className="chip">
            <CircleCheck size={14} /> Completado
          </span>
        ) : (
          <button
            className="btn btn-ghost"
            onClick={() => markCompleted(track.id, module.id)}
          >
            <CircleCheck size={15} /> Marcar como visto
          </button>
        )}
      </div>

      <div className="player-wrap">
        <section className="card player-card">
          <video
            key={src}
            controls
            preload="metadata"
            src={src}
            onEnded={() => markCompleted(track.id, module.id)}
          />
          <div className="player-meta">
            <h2>{module.title}</h2>
            <p>{module.description}</p>
            <div className="nav-row">
              {prev ? (
                <Link className="btn btn-ghost nav-btn" to={`/${track.id}/${prev.id}`}>
                  <ChevronLeft size={16} />
                  <span className="hide-mobile">{prev.title}</span>
                  <span className="show-mobile">Anterior</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link className="btn btn-primary nav-btn" to={`/${track.id}/${next.id}`}>
                  <span className="hide-mobile">Siguiente: {next.title}</span>
                  <span className="show-mobile">Siguiente</span>
                  <ChevronRight size={16} />
                </Link>
              ) : (
                <Link className="btn btn-primary nav-btn" to={`/${track.id}`}>
                  Volver al listado
                </Link>
              )}
            </div>
          </div>
        </section>

        <aside className="next-list hide-mobile">
          {track.modules.map((item, itemIndex) => (
            <Link
              key={item.id}
              to={`/${track.id}/${item.id}`}
              className={`card next-item${item.id === module.id ? ' active' : ''}`}
            >
              <div className="card-top">
                <h3>
                  {itemIndex + 1}. {item.title}
                </h3>
                <span
                  className={`status ${
                    isCompleted(track.id, item.id) ? 'status-active' : 'status-pending'
                  }`}
                >
                  {isCompleted(track.id, item.id) ? 'Hecho' : 'Pendiente'}
                </span>
              </div>
              <p>{item.durationHint}</p>
            </Link>
          ))}
        </aside>
      </div>

      <QuestionCard />
    </>
  )
}
