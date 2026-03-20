import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { useToast } from '../../hooks/useToast'
import ConfirmModal from '../../components/ConfirmModal'
import InvoicePreview from '../../components/InvoicePreview'
import styles from './Invoices.module.css'

const BADGE = { paid: 'badge-paid', pending: 'badge-pending', draft: 'badge-draft' }
const LABEL = { paid: 'Paid', pending: 'Pending', draft: 'Draft' }
const LANG_FLAG = { en: '🇬🇧 EN', ka: '🇬🇪 KA', ru: '🇷🇺 RU' }

export default function Invoices() {
  const { canEdit, isAdmin } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [invoices, setInvoices] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [preview, setPreview]   = useState(null)

  const load = () => api.get('/invoices').then(r => setInvoices(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const filtered = invoices.filter(inv => {
    const matchFilter = filter === 'all' || inv.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || [inv.client, inv.event, inv.num].some(x => (x || '').toLowerCase().includes(q))
    return matchFilter && matchSearch
  })

  const handleDelete = async () => {
    try {
      await api.delete(`/invoices/${deleteId}`)
      toast('Invoice deleted', 'err')
      setDeleteId(null)
      load()
    } catch {
      toast('Failed to delete', 'err')
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>All <em>Invoices</em></h1>
        {canEdit && (
          <button className="btn btn-gold" onClick={() => navigate('/dashboard/invoices/new')}>
            + Create Invoice
          </button>
        )}
      </div>

      <div className={styles.filters}>
        {['all','paid','pending','draft'].map(f => (
          <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="tbl-wrap">
        <div className="tbl-head">
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{filtered.length} invoice{filtered.length !== 1 ? 's' : ''}</span>
          <div className={styles.searchBox}>
            <span style={{ color: 'var(--muted)' }}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search client, event, number…" />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Invoice #</th><th>Client</th><th>Event</th><th>Language</th>
              <th>Date</th><th>Amount</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>No invoices found.</td></tr>
            ) : filtered.map(inv => (
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
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => setPreview(inv)}>View</button>
                    {canEdit && <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => navigate(`/dashboard/invoices/${inv.id}/edit`)}>Edit</button>}
                    {isAdmin && <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => setDeleteId(inv.id)}>Delete</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <ConfirmModal
          title="Delete Invoice"
          message={`Delete invoice ${invoices.find(i => i.id === deleteId)?.num}? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {preview && <InvoicePreview invoice={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
