import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import styles from './Overview.module.css'

const BADGE = { paid: 'badge-paid', pending: 'badge-pending', draft: 'badge-draft' }
const LABEL = { paid: 'Paid', pending: 'Pending', draft: 'Draft' }
const LANG_FLAG = { en: '🇬🇧', ka: '🇬🇪', ru: '🇷🇺' }

export default function Overview() {
  const { user, canEdit } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats]       = useState(null)
  const [recent, setRecent]     = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([api.get('/stats'), api.get('/invoices')])
      .then(([s, inv]) => {
        setStats(s.data)
        setRecent(inv.data.slice(0, 6))
      })
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Good day, <em>{user?.name?.split(' ')[0]}</em></h1>
          <div className={styles.date}>{today}</div>
        </div>
        {canEdit && (
          <button className="btn btn-gold" onClick={() => navigate('/dashboard/invoices/new')}>
            + Create Invoice
          </button>
        )}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading…</div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Invoices</div>
              <div className={styles.statValue}>{stats?.total ?? 0}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Revenue (Paid)</div>
              <div className={`${styles.statValue} ${styles.gold}`}>₾{(stats?.revenue ?? 0).toFixed(2)}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Paid</div>
              <div className={`${styles.statValue} ${styles.green}`}>{stats?.paid ?? 0}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Pending</div>
              <div className={`${styles.statValue} ${styles.amber}`}>{stats?.pending ?? 0}</div>
            </div>
          </div>

          <div className={styles.sectionLabel}>Recent Invoices</div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th><th>Client</th><th>Event</th>
                  <th>Lang</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>No invoices yet. Create your first one!</td></tr>
                ) : recent.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ color: 'var(--gold)', fontSize: 12, letterSpacing: '.05em' }}>{inv.num}</td>
                    <td>{inv.client || '—'}</td>
                    <td style={{ color: 'var(--muted)' }}>{inv.event || '—'}</td>
                    <td>{LANG_FLAG[inv.lang] || inv.lang}</td>
                    <td style={{ color: 'var(--muted)' }}>{inv.date || '—'}</td>
                    <td style={{ fontWeight: 500 }}>₾{(inv.total || 0).toFixed(2)}</td>
                    <td><span className={`badge ${BADGE[inv.status]}`}>{LABEL[inv.status]}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => navigate(`/dashboard/invoices/${inv.id}/edit`)}>
                          {canEdit ? 'Edit' : 'View'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
