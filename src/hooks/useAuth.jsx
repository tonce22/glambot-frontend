import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('gg_token')
    if (token) {
      api.get('/auth/me')
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('gg_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const r = await api.post('/auth/login', { username, password })
    localStorage.setItem('gg_token', r.data.token)
    setUser(r.data.user)
    return r.data.user
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch {}
    localStorage.removeItem('gg_token')
    setUser(null)
  }

  const can = (...roles) => user && roles.includes(user.role)

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
