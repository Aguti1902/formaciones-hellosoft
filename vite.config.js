import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const MEDIA_FOLDERS = ['Franquiciados', 'Tienda']

function resolveMedia(url = '') {
  const clean = decodeURIComponent(url.split('?')[0]).replace(/^\/+/, '')
  if (clean === 'hellonails-icon.png') {
    const file = path.join(root, 'hellonails-icon.png')
    return fs.existsSync(file) ? file : null
  }
  const top = clean.split('/')[0]
  if (!MEDIA_FOLDERS.includes(top)) return null
  const candidates = [
    path.join(root, clean),
    path.join(root, clean.normalize('NFC')),
    path.join(root, clean.normalize('NFD')),
  ]
  for (const file of candidates) {
    if (!file.startsWith(root)) continue
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return file
  }
  return null
}

function sendFile(req, res, filePath) {
  const stat = fs.statSync(filePath)
  const isVideo = filePath.toLowerCase().endsWith('.mp4')
  const type = isVideo ? 'video/mp4' : 'image/png'
  const range = req.headers.range

  res.setHeader('Content-Type', type)
  res.setHeader('Accept-Ranges', 'bytes')

  if (!isVideo || !range) {
    res.setHeader('Content-Length', stat.size)
    fs.createReadStream(filePath).pipe(res)
    return
  }

  const [startStr, endStr] = range.replace(/bytes=/, '').split('-')
  const start = Number(startStr)
  const end = endStr ? Number(endStr) : stat.size - 1
  res.statusCode = 206
  res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`)
  res.setHeader('Content-Length', end - start + 1)
  fs.createReadStream(filePath, { start, end }).pipe(res)
}

function hasRoleCookie(req, folder) {
  const role = folder === 'Tienda' ? 'tienda' : 'franquiciados'
  const cookie = req.headers.cookie || ''
  return cookie.split(';').some((part) => part.trim() === `hello_soft_${role}=1`)
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > 80_000) {
        reject(new Error('too large'))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function questionsApi() {
  const file = path.join(root, 'preguntas.json')

  async function handle(req, res, next) {
    const url = (req.url || '').split('?')[0]
    if (url !== '/api/preguntas') return next()

    res.setHeader('Content-Type', 'application/json')

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    if (req.method === 'POST') {
      try {
        const raw = await collectBody(req)
        const data = JSON.parse(raw)
        if (!data?.nombre || !data?.mensaje || !data?.email) {
          res.statusCode = 400
          res.end(JSON.stringify({ ok: false }))
          return
        }
        const list = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : []
        list.push({
          id: Date.now(),
          fecha: new Date().toISOString(),
          nombre: String(data.nombre).slice(0, 120),
          email: String(data.email || data.contacto || '').slice(0, 180),
          perfil: data.perfil === 'franquiciados' ? 'franquiciados' : 'tienda',
          mensaje: String(data.mensaje).slice(0, 4000),
          pagina: String(data.pagina || '').slice(0, 180),
        })
        fs.writeFileSync(file, JSON.stringify(list, null, 2))
        res.end(JSON.stringify({ ok: true }))
      } catch {
        res.statusCode = 400
        res.end(JSON.stringify({ ok: false }))
      }
      return
    }

    next()
  }

  return {
    name: 'hello-questions',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        handle(req, res, next)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        handle(req, res, next)
      })
    },
  }
}

function helloMedia() {
  return {
    name: 'hello-media',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = resolveMedia(req.url || '')
        if (!file) return next()
        const folder = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '').split('/')[0]
        if (MEDIA_FOLDERS.includes(folder) && !hasRoleCookie(req, folder)) {
          res.statusCode = 401
          res.setHeader('Content-Type', 'text/plain')
          res.end('Acceso no autorizado')
          return
        }
        sendFile(req, res, file)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = resolveMedia(req.url || '')
        if (!file) return next()
        const folder = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '').split('/')[0]
        if (MEDIA_FOLDERS.includes(folder) && !hasRoleCookie(req, folder)) {
          res.statusCode = 401
          res.setHeader('Content-Type', 'text/plain')
          res.end('Acceso no autorizado')
          return
        }
        sendFile(req, res, file)
      })
    },
    closeBundle() {
      const outDir = path.join(root, 'dist')
      if (!fs.existsSync(outDir)) return
      for (const folder of MEDIA_FOLDERS) {
        fs.cpSync(path.join(root, folder), path.join(outDir, folder), { recursive: true })
      }
      fs.copyFileSync(
        path.join(root, 'hellonails-icon.png'),
        path.join(outDir, 'hellonails-icon.png'),
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), questionsApi(), helloMedia()],
  server: {
    port: 5173,
    fs: { allow: [root] },
  },
})
