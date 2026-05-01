import { useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Overview   from './dashboard/Overview'
import Invoices   from './dashboard/Invoices'
import InvoiceForm from './dashboard/InvoiceForm'
import Users      from './dashboard/Users'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user, logout, can, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading])

  if (loading || !user) return null

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

  return (
    <div className={styles.layout}>
      {/* ── TOPBAR ── */}
      <header className={styles.topbar}>
        <div className={styles.tbLeft}>
          <div className={styles.tbLogo}>Glambot Georgia</div>
          <div className={styles.tbSep} />
          <nav className={styles.tbNav}>
            <NavLink to="/dashboard" end className={({isActive}) => isActive ? `${styles.tbItem} ${styles.tbActive}` : styles.tbItem}>
              Overview
            </NavLink>
            <NavLink to="/dashboard/invoices" className={({isActive}) => isActive ? `${styles.tbItem} ${styles.tbActive}` : styles.tbItem}>
              Invoices
            </NavLink>
            {can('admin') && (
              <NavLink to="/dashboard/users" className={({isActive}) => isActive ? `${styles.tbItem} ${styles.tbActive}` : styles.tbItem}>
                Users
              </NavLink>
            )}
          </nav>
        </div>
        <div className={styles.tbRight}>
          <button className={styles.tbSite} onClick={() => navigate('/')}>🌐 Website</button>
          <div className={styles.tbUser}>
            <div className={styles.tbAvatar}>{initials}</div>
            <div>
              <div className={styles.tbName}>{user.name}</div>
              <div className={styles.tbRole}>{user.role}</div>
            </div>
          </div>
          <button className={styles.tbLogout} onClick={async () => { await logout(); navigate('/') }}>
            Sign out
          </button>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className={styles.main}>
        <Routes>
          <Route index element={<Overview />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/new" element={<InvoiceForm />} />
          <Route path="invoices/:id/edit" element={<InvoiceForm />} />
          {can('admin') && <Route path="users" element={<Users />} />}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}
