import { useEffect, useState, useRef } from 'react'
import api from '../../utils/api'
import { useToast } from '../../components/Toast'
import ConfirmModal from '../../components/ConfirmModal'
import styles from './Expenses.module.css'

const BUDGET = 30000
const CATEGORIES = ['rent', 'salary', 'equipment', 'marketing', 'utilities', 'other']
const CAT_LABELS = { rent: 'Rent', salary: 'Salary', equipment: 'Equipment', marketing: 'Marketing', utilities: 'Utilities', other: 'Other' }
const CAT_COLORS = { rent: '#6366f1', salary: '#f59e0b', equipment: '#10b981', marketing: '#3b82f6', utilities: '#8b5cf6', other: '#6b7280' }

const empty = { title: '', amount: '', category: 'other', date: '', notes: '', file_data: null, file_name: null, file_type: null }

export default function Expenses() {
  const toast = useToast()
  const fileRef = useRef()
  const [expenses, setExpenses] = useState([])
  const [stats, setStats] = useState({ total_spent: 0, by_category: {} })
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [previewExp, setPreviewExp] = useState(null)

  const load = async () => {
    try {
      const [expRes, statRes] = await Promise.all([api.get('/expenses'), api.get('/expenses/stats')])
      setExpenses(expRes.data)
      setStats(statRes.data)
    } catch(e) {
      toast('Failed to load expenses', 'err')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (e) => {
    setEditing(e.id)
    setForm({ title: e.title, amount: e.amount, category: e.category, date: e.date || '', notes: e.notes || '', file_data: e.file_data || null, file_name: e.file_name || null, file_type: e.file_type || null })
    setModal(true)
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast('File too large (max 5MB)', 'err'); return }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm(f => ({ ...f, file_data: ev.target.result, file_name: file.name, file_type: file.type }))
    }
    reader.readAsDataURL(file)
  }

  const removeFile = () => {
    setForm(f => ({ ...f, file_data: null, file_name: null, file_type: null }))
    if (fileRef.current) fileRef.current.value = ''
  }

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
            <tr><th>Title</th><th>Category</th><th>Date</th><th>Notes</th><th>Document</th><th style={{ textAlign: 'right' }}>Amount</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>Loading…</td></tr>
            ) : expenses.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>No expenses yet</td></tr>
            ) : expenses.map(e => (
              <tr key={e.id}>
                <td style={{ fontWeight: 500 }}>{e.title}</td>
                <td><span className={styles.catBadge} style={{ background: CAT_COLORS[e.category] + '22', color: CAT_COLORS[e.category] }}>{CAT_LABELS[e.category]}</span></td>
                <td style={{ color: 'var(--muted)' }}>{e.date || '—'}</td>
                <td style={{ color: 'var(--muted)', fontSize: 13 }}>{e.notes || '—'}</td>
                <td>
                  {e.file_data ? (
                    <button className="btn btn-ghost" style={{ padding: '3px 10px', fontSize: 11 }} onClick={() => setPreviewExp(e)}>
                      📎 {e.file_name?.length > 16 ? e.file_name.slice(0, 16) + '…' : e.file_name}
                    </button>
                  ) : <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>}
                </td>
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
              <div className="field" style={{ marginBottom: 16 }}><label>Notes</label><input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes" /></div>

              {/* FILE UPLOAD */}
              <div className="field">
                <label>Bill / Receipt (photo or PDF, max 5MB)</label>
                {form.file_name ? (
                  <div className={styles.filePreview}>
                    <span>📎 {form.file_name}</span>
                    <button type="button" onClick={removeFile} className={styles.fileRemove}>✕ Remove</button>
                  </div>
                ) : (
                  <div className={styles.fileDropZone} onClick={() => fileRef.current?.click()}>
                    <div>📂 Click to upload photo or PDF</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>JPG, PNG, PDF — max 5MB</div>
                    <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFile} />
                  </div>
                )}
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {/* FILE PREVIEW MODAL */}
      {previewExp && (
        <div className="modal-overlay" onClick={() => setPreviewExp(null)}>
          <div className="modal-box" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">📎 {previewExp.file_name}</div>
              <button className="modal-close" onClick={() => setPreviewExp(null)}>×</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              {previewExp.file_type?.startsWith('image/') ? (
                <img src={previewExp.file_data} alt={previewExp.file_name} style={{ maxWidth: '100%', maxHeight: 500, borderRadius: 8 }} />
              ) : (
                <iframe src={previewExp.file_data} title={previewExp.file_name} style={{ width: '100%', height: 500, border: 'none', borderRadius: 8 }} />
              )}
            </div>
            <div className="modal-foot">
              <a href={previewExp.file_data} download={previewExp.file_name} className="btn btn-gold">⬇ Download</a>
              <button className="btn btn-ghost" onClick={() => setPreviewExp(null)}>Close</button>
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
