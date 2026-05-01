import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './DashboardLayout.module.css'

export default function DashboardLayout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={styles.layout}>
      <header className={styles.topbar}>
        <div className={styles.left}>
          <div className={styles.logo}>Glambot Georgia</div>
          <div className={styles.sep} />
          <nav className={styles.nav}>
            <NavLink to="/dashboard" end className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
              Overview
            </NavLink>
            <NavLink to="/dashboard/invoices" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
              Invoices
            </NavLink>
            {isAdmin && (
              <NavLink to="/dashboard/expenses" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                Expenses
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/dashboard/users" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                Users
              </NavLink>
            )}
          </nav>
        </div>
        <div className={styles.right}>
          <button className={styles.siteBtn} onClick={() => navigate('/')}>🌐 Website</button>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{initials}</div>
            <div>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userRole}>{user?.role}</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
