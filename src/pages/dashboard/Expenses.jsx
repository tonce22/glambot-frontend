import { useEffect, useState } from 'react'
import api from '../../utils/api'
import { useToast } from '../../components/Toast'
import ConfirmModal from '../../components/ConfirmModal'
import styles from './Expenses.module.css'

const BUDGET = 30000
const CATEGORIES = ['rent', 'salary', 'equipment', 'marketing', 'utilities', 'other']
const CAT_LABELS = { rent: 'Rent', salary: 'Salary', equipment: 'Equipment', marketing: 'Marketing', utilities: 'Utilities', other: 'Other' }
const CAT_COLORS = { rent: '#6366f1', salary: '#f59e0b', equipment: '#10b981', marketing: '#3b82f6', utilities: '#8b5cf6', other: '#6b7280' }

const empty = { title: '', amount: '', category: 'other', date: '', notes: '' }

export default function Expenses() {
  const toast = useToast()
  const [expenses, setExpenses] = useState([])
  const [stats, setStats] = useState({ total_spent: 0, by_category: {} })
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const load = async () => {
    try {
      const [expRes, statRes] = await Promise.all([api.get('/expenses'), api.get('/expenses/stats')])
      setExpenses(expRes.data)
      setStats(statRes.data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (e) => { setEditing(e.id); setForm({ title: e.title, amount: e.amount, category: e.category, date: e.date || '', notes: e.notes || '' }); setModal(true) }

  const save = async () => {
    if (!form.title || !form.amount) { toast('Title and amount are required', 'err'); return }
    setSaving(true)
    try {
      if (editing) { await api.put(`/expenses/${editing}`, form); toast('Expense updated', 'ok') }
      else { await api.post('/expenses', form); toast('Expense added', 'ok') }
      setModal(false); load()
    } catch (e) { toast(e.response?.data?.detail || 'Failed to save', 'err') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/expenses/${deleteId}`); toast('Deleted', 'ok'); setDeleteId(null); load() }
    catch (e) { toast(e.response?.data?.detail || 'Failed to delete', 'err') }
  }

  const spent = stats.total_spent || 0
  const remaining = BUDGET - spent
  const pct = Math.min((spent / BUDGET) * 100, 100)

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Expenses <em>Tracker</em></h1>
        <button className="btn btn-gold" onClick={openAdd}>+ Add Expense</button>
      </div>

      {/* BUDGET CARD */}
      <div className={styles.budgetCard}>
        <div className={styles.budgetRow}>
          <div>
            <div className={styles.budgetLabel}>Annual Budget</div>
            <div className={styles.budgetTotal}>₾{BUDGET.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={styles.budgetLabel}>Remaining</div>
            <div className={styles.budgetRemaining} style={{ color: remaining < 5000 ? '#ef4444' : '#10b981' }}>
              ₾{remaining.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        <div className={styles.progressBg}>
          <div className={styles.progressFill} style={{ width: `${pct}%`, background: pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#c9a96e' }} />
        </div>
        <div className={styles.budgetSpent}>Spent: ₾{spent.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({pct.toFixed(1)}%)</div>

        {/* CATEGORY BREAKDOWN */}
        <div className={styles.catGrid}>
          {CATEGORIES.filter(c => stats.by_category?.[c]).map(c => (
            <div key={c} className={styles.catChip} style={{ borderColor: CAT_COLORS[c] }}>
              <span className={styles.catDot} style={{ background: CAT_COLORS[c] }} />
              <span className={styles.catName}>{CAT_LABELS[c]}</span>
              <span className={styles.catAmt}>₾{(stats.by_category[c] || 0).toLocaleString('en', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr><th>Title</th><th>Category</th><th>Date</th><th>Notes</th><th style={{ textAlign: 'right' }}>Amount</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>Loading…</td></tr>
            ) : expenses.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>No expenses yet</td></tr>
            ) : expenses.map(e => (
              <tr key={e.id}>
                <td style={{ fontWeight: 500 }}>{e.title}</td>
                <td><span className={styles.catBadge} style={{ background: CAT_COLORS[e.category] + '22', color: CAT_COLORS[e.category] }}>{CAT_LABELS[e.category]}</span></td>
                <td style={{ color: 'var(--muted)' }}>{e.date || '—'}</td>
                <td style={{ color: 'var(--muted)', fontSize: 13 }}>{e.notes || '—'}</td>
                <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--gold)' }}>₾{Number(e.amount).toLocaleString('en', { minimumFractionDigits: 2 })}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => openEdit(e)}>Edit</button>
                    <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => setDeleteId(e.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-box">
            <div className="modal-head">
              <div className="modal-title">{editing ? 'Edit Expense' : 'Add Expense'}</div>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="field"><label>Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Office rent" /></div>
                <div className="field"><label>Amount (₾)</label><input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="field"><label>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                  </select>
                </div>
                <div className="field"><label>Date</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              </div>
              <div className="field"><label>Notes</label><input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes" /></div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Expense"
          message={`Delete "${expenses.find(e => e.id === deleteId)?.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
