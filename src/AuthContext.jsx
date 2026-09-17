import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AUTH_STORAGE_KEY, PASSWORDS, cookieName } from './credentials'

function readAuth() {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeAuth(data) {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
}

function setRoleCookie(trackId, on) {
  const name = cookieName(trackId)
  if (on) {
    document.cookie = `${name}=1; path=/; SameSite=Lax`
  } else {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readAuth)

  useEffect(() => {
    Object.keys(readAuth()).forEach((trackId) => {
      if (PASSWORDS[trackId]) setRoleCookie(trackId, true)
    })
  }, [])

  const isAuthenticated = useCallback((trackId) => Boolean(auth[trackId]), [auth])

  const login = useCallback((trackId, password) => {
    const expected = PASSWORDS[trackId]
    if (!expected || password !== expected) return false
    const next = { ...readAuth(), [trackId]: true }
    writeAuth(next)
    setRoleCookie(trackId, true)
    setAuth(next)
    return true
  }, [])

  const logout = useCallback((trackId) => {
    const next = { ...readAuth() }
    delete next[trackId]
    writeAuth(next)
    setRoleCookie(trackId, false)
    setAuth(next)
  }, [])

  const value = useMemo(
    () => ({ auth, isAuthenticated, login, logout }),
    [auth, isAuthenticated, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
