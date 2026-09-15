import { createContext, useContext, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../lib/storage'

const AuthContext = createContext(null)

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage('user', null))

  useEffect(() => {
    writeStorage('user', user)
  }, [user])

  function login(role, { name, email }) {
    const displayName = name?.trim() || email.split('@')[0]
    const nextUser = {
      role,
      name: displayName,
      email,
      initials: initials(displayName),
      joinedAt: user?.email === email ? user.joinedAt : new Date().toISOString(),
    }
    setUser(nextUser)
    return nextUser
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
