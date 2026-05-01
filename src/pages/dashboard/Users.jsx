import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { useToast } from '../../components/Toast'
import ConfirmModal from '../../components/ConfirmModal'
import styles from './Users.module.css'

const ROLE_BADGE = { admin: 'badge-admin', manager: 'badge-manager', viewer: 'badge-viewer' }

const emptyUser = { name: '', username: '', password: '', role: 'manager' }

export default function Users() {
  const { isAdmin, user: me } = useAuth()
  const toast = useToast()
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(emptyUser)
  const [saving, setSaving]   = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const load = () => api.get('/users').then(r => setUsers(r.data)).finally(() => setLoading(false))
  useEffect(() => { if (isAdmin) load() }, [isAdmin])

  const openAdd = () => { setEditing(null); setForm(emptyUser); setModal(true) }
  const openEdit = (u) => { setEditing(u.id); setForm({ name: u.name, username: u.username, password: '', role: u.role }); setModal(true) }

  const saveUser = async () => {
    if (!form.name || !form.username) { toast('Name and username are required', 'err'); return }
    if (!editing && !form.password) { toast('Password is required', 'err'); return }
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/users/${editing}`, form)
        toast('User updated', 'ok')
      } else {
        await api.post('/users', form)
        toast('User created', 'ok')
      }
      setModal(false)
      load()
    } catch (e) {
      toast(e.response?.data?.detail || 'Failed to save user', 'err')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteId}`)
      toast('User deleted', 'err')
      setDeleteId(null)
      load()
    } catch (e) {
      toast(e.response?.data?.detail || 'Failed to delete', 'err')
    }
  }

  if (!isAdmin) return (
    <div style={{ textAlign: 'center', padding: '80px 40px', color: 'var(--muted)' }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: .3 }}>🔒</div>
      <p>Access restricted to Admins only.</p>
    </div>
  )

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>User <em>Management</em></h1>
        <button className="btn btn-gold" onClick={openAdd}>+ Add User</button>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Username</th><th>Role</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>Loading…</td></tr>
            ) : users.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 500 }}>{u.name} {u.id === me?.id && <span style={{ fontSize: 11, color: 'var(--gold)', marginLeft: 6 }}>(you)</span>}</td>
                <td style={{ color: 'var(--muted)', fontSize: 12, letterSpacing: '.04em' }}>{u.username}</td>
                <td><span className={`badge ${ROLE_BADGE[u.role]}`}>{u.role}</span></td>
                <td style={{ color: 'var(--muted)' }}>{u.created}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => openEdit(u)}>Edit</button>
                    {u.id !== 'user-admin' ? (
                      <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => setDeleteId(u.id)}>Delete</button>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--muted)', padding: '4px 8px' }}>Owner</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PERMISSIONS REFERENCE */}
      <div className={styles.permBox}>
        <div className={styles.permTitle}>Role Permissions</div>
        <div className={styles.permGrid}>
          {[
            { role: 'Admin', color: '#93C5FD', perms: ['Full platform access', 'Create/edit/delete invoices', 'Manage users & permissions', 'View all data'] },
            { role: 'Manager', color: 'var(--gold)', perms: ['Create & edit invoices', 'View all invoices', 'Preview & print', 'No user management'] },
            { role: 'Viewer', color: 'var(--muted)', perms: ['View invoices only', 'Preview & print', 'Cannot create invoices', 'No user management'] },
          ].map(p => (
            <div key={p.role} className={styles.permCard}>
              <div className={styles.permRole} style={{ color: p.color }}>{p.role}</div>
              <ul className={styles.permList}>{p.perms.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>

      {/* USER MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-box">
            <div className="modal-head">
              <div className="modal-title">{editing ? 'Edit User' : 'Add User'}</div>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="field"><label>Full Name</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" /></div>
                <div className="field"><label>Username</label><input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="login username" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="field"><label>Password {editing && <span style={{ color: 'var(--muted)', textTransform: 'none', letterSpacing: 0 }}>(leave blank to keep)</span>}</label><input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder={editing ? 'New password…' : 'Password'} /></div>
                <div className="field"><label>Role</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={saveUser} disabled={saving}>{saving ? 'Saving…' : 'Save User'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete User"
          message={`Delete user "${users.find(u => u.id === deleteId)?.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
