import { STORAGE_KEY, tracks } from './data'

function read() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function write(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function isCompleted(trackId, moduleId) {
  return Boolean(read()?.[trackId]?.[moduleId])
}

export function markCompleted(trackId, moduleId) {
  const data = read()
  data[trackId] = { ...(data[trackId] || {}), [moduleId]: true }
  write(data)
}

export function completedCount(trackId) {
  const track = tracks[trackId]
  if (!track) return 0
  return track.modules.filter((module) => isCompleted(trackId, module.id)).length
}
