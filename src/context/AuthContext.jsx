import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('gg_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('gg_token')
    if (token) {
      axios.get('/api/auth/me')
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('gg_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const { data } = await axios.post('/api/auth/login', { username, password })
    localStorage.setItem('gg_token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('gg_token')
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'
  const isViewer = user?.role === 'viewer'
  const canEdit = user?.role === 'admin' || user?.role === 'manager'

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isViewer, canEdit }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
