export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: 36, maxWidth: 380, width: '100%' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 300, marginBottom: 12 }}>{title}</h3>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 28 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn" style={{ background: 'var(--red)', color: '#fff' }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}
