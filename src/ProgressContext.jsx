import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  completedCount as readCount,
  isCompleted as readCompleted,
  markCompleted as writeCompleted,
} from './progress'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [version, setVersion] = useState(0)
  const refresh = useCallback(() => setVersion((n) => n + 1), [])

  const value = useMemo(
    () => ({
      version,
      isCompleted: readCompleted,
      completedCount: readCount,
      markCompleted: (trackId, moduleId) => {
        writeCompleted(trackId, moduleId)
        refresh()
      },
    }),
    [version, refresh],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress debe usarse dentro de ProgressProvider')
  return ctx
}
