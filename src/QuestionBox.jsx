import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { CircleCheck, MessageCircleQuestion, Send } from 'lucide-react'
import { tracks } from './data'
import { QUESTIONS_EMAIL } from './credentials'
import { useAuth } from './AuthContext.jsx'

function currentProfile(trackId, isAuthenticated) {
  if (trackId && tracks[trackId]) return trackId
  if (isAuthenticated('franquiciados')) return 'franquiciados'
  if (isAuthenticated('tienda')) return 'tienda'
  return 'tienda'
}

export function QuestionForm({ compact = false }) {
  const { trackId } = useParams()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [perfil, setPerfil] = useState(() => currentProfile(trackId, isAuthenticated))
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      setError('Necesitamos tu nombre, tu email y la duda para poder ayudarte.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Introduce un email válido para que podamos responderte.')
      return
    }

    setSending(true)
    setError('')
    const payload = {
      nombre: nombre.trim(),
      email: email.trim(),
      perfil,
      mensaje: mensaje.trim(),
      pagina: location.pathname,
    }

    try {
      const mailResponse = await fetch(
        `https://formsubmit.co/ajax/${QUESTIONS_EMAIL}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: payload.nombre,
            email: payload.email,
            _replyto: payload.email,
            _subject: `Duda formación Hello Soft (${perfil})`,
            perfil: payload.perfil,
            pagina: payload.pagina,
            mensaje: payload.mensaje,
          }),
        },
      )
      if (!mailResponse.ok) throw new Error('No se ha podido enviar el correo')
      fetch('/api/preguntas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})
      setSent(true)
    } catch {
      const subject = encodeURIComponent(`Duda formación Hello Soft (${perfil})`)
      const body = encodeURIComponent(
        `Nombre: ${payload.nombre}\nEmail: ${payload.email}\nPerfil: ${perfil}\nPágina: ${payload.pagina}\n\n${payload.mensaje}`,
      )
      window.location.href = `mailto:${QUESTIONS_EMAIL}?subject=${subject}&body=${body}`
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="question-success">
        <CircleCheck size={22} />
        <div>
          <strong>Duda enviada</strong>
          <p>El equipo de Hello Soft la recibirá y te responderá por email.</p>
        </div>
      </div>
    )
  }

  return (
    <form className={`question-form${compact ? ' compact' : ''}`} onSubmit={onSubmit}>
      <div className="question-grid">
        <label>
          Nombre
          <input
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            placeholder="Tu nombre"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@email.com"
          />
        </label>
      </div>
      <label>
        Perfil
        <select value={perfil} onChange={(event) => setPerfil(event.target.value)}>
          <option value="franquiciados">Franquiciados</option>
          <option value="tienda">Tienda</option>
        </select>
      </label>
      <label>
        Tu duda
        <textarea
          rows={compact ? 4 : 5}
          value={mensaje}
          onChange={(event) => setMensaje(event.target.value)}
          placeholder="Cuéntanos qué no ha quedado claro después del tutorial…"
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={sending}>
        <Send size={15} /> {sending ? 'Enviando…' : 'Enviar pregunta'}
      </button>
    </form>
  )
}

export function QuestionCard() {
  return (
    <section className="card question-card">
      <div className="kicker">Soporte</div>
      <h2>
        <MessageCircleQuestion size={20} />
        ¿Te ha quedado alguna duda?
      </h2>
      <p>
        Cuando termines el tutorial, escríbenos y te responderemos por email.
      </p>
      <QuestionForm />
    </section>
  )
}

export function QuestionDock() {
  const [open, setOpen] = useState(false)

  return (
    <div className="question-dock">
      {open ? (
        <>
          <button
            className="question-backdrop"
            type="button"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          />
          <div className="card question-panel">
            <div className="question-panel-head">
              <div>
                <div className="kicker">Soporte</div>
                <strong>Enviar una duda</strong>
              </div>
              <button className="chip" type="button" onClick={() => setOpen(false)}>
                Cerrar
              </button>
            </div>
            <QuestionForm compact />
          </div>
        </>
      ) : null}
      <button
        className="question-fab"
        type="button"
        aria-label="Enviar una duda"
        onClick={() => setOpen((value) => !value)}
      >
        <MessageCircleQuestion size={22} />
      </button>
    </div>
  )
}
