import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: 22 }}>Loading…</div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}
