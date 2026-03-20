import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toast'
import styles from './Login.module.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()
  const toast     = useToast()

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!username || !password) { setError('Please enter username and password.'); return }
    setLoading(true); setError('')
    try {
      await login(username, password)
      toast('Welcome back!', 'ok')
      navigate('/dashboard')
    } catch {
      setError('Incorrect username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.orb} />
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandName}>Glambot Georgia</div>
          <div className={styles.brandSub}>Admin Platform</div>
        </div>
        <h2 className={styles.heading}>Welcome back</h2>
        <p className={styles.sub}>Sign in to access the platform</p>

        <form onSubmit={handleSubmit}>
          <div className={`field ${styles.field}`}>
            <label>Username</label>
            <input
              type="text" value={username} autoComplete="username"
              onChange={e => setUsername(e.target.value)} placeholder="Enter username"
            />
          </div>
          <div className={`field ${styles.field}`}>
            <label>Password</label>
            <input
              type="password" value={password} autoComplete="current-password"
              onChange={e => setPassword(e.target.value)} placeholder="Enter password"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.btnLogin} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className={styles.back}>
          <a onClick={() => navigate('/')}>← Back to website</a>
        </div>
        <div className={styles.hint}>
          Admin: <strong>admin</strong> / <strong>glambot2024</strong>
        </div>
      </div>
    </div>
  )
}
