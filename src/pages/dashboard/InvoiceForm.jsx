import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { useToast } from '../../hooks/useToast'
import InvoicePreview from '../../components/InvoicePreview'
import styles from './InvoiceForm.module.css'

const LANGS = [{ code: 'en', label: '🇬🇧 English' }, { code: 'ka', label: '🇬🇪 Georgian' }, { code: 'ru', label: '🇷🇺 Russian' }]
const today = () => new Date().toISOString().split('T')[0]
const inDays = (n) => new Date(Date.now() + n * 86400000).toISOString().split('T')[0]

const emptyForm = () => ({
  lang: 'en', date: today(), due: inDays(7), edate: '', status: 'pending',
  event: '', client: '', cphone: '', cemail: '', caddr: '',
  bank: '', iban: '', notes: '',
  items: [{ desc: '', qty: 1, price: '', total: 0 }]
})

export default function InvoiceForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()
  const { canEdit } = useAuth()

  const [form, setForm]         = useState(emptyForm())
  const [loading, setLoading]   = useState(isEdit)
  const [saving, setSaving]     = useState(false)
  const [previewOpen, setPreview] = useState(false)
  const [invNum, setInvNum]     = useState('')

  useEffect(() => {
    if (!canEdit) { navigate('/dashboard/invoices'); return }
    if (isEdit) {
      api.get(`/invoices/${id}`)
        .then(r => {
          const d = r.data
          setInvNum(d.num)
          setForm({
            lang: d.lang || 'en', date: d.date || today(), due: d.due || inDays(7),
            edate: d.edate || '', status: d.status || 'pending',
            event: d.event || '', client: d.client || '',
            cphone: d.cphone || '', cemail: d.cemail || '', caddr: d.caddr || '',
            bank: d.bank || '', iban: d.iban || '', notes: d.notes || '',
            items: d.items?.length ? d.items.map(i => ({ ...i, price: String(i.price) })) : [{ desc: '', qty: 1, price: '', total: 0 }]
          })
        })
        .catch(() => toast('Failed to load invoice', 'err'))
        .finally(() => setLoading(false))
    }
  }, [id])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const updateItem = (i, key, val) => {
    const items = [...form.items]
    items[i] = { ...items[i], [key]: val }
    if (key === 'qty' || key === 'price') {
      const q = parseFloat(key === 'qty' ? val : items[i].qty) || 0
      const p = parseFloat(key === 'price' ? val : items[i].price) || 0
      items[i].total = q * p
    }
    setForm(f => ({ ...f, items }))
  }

  const addItem    = () => setForm(f => ({ ...f, items: [...f.items, { desc: '', qty: 1, price: '', total: 0 }] }))
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))

  const subtotal = form.items.reduce((s, i) => s + (i.total || 0), 0)

  const buildPayload = (statusOverride) => ({
    ...form,
    status: statusOverride || form.status,
    items: form.items.map(i => ({ desc: i.desc, qty: parseFloat(i.qty)||0, price: parseFloat(i.price)||0, total: i.total||0 })),
    total: subtotal
  })

  const save = async (statusOverride) => {
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/invoices/${id}`, buildPayload(statusOverride))
      } else {
        await api.post('/invoices', buildPayload(statusOverride))
      }
      toast(statusOverride === 'draft' ? 'Saved as draft' : 'Invoice saved!', 'ok')
      navigate('/dashboard/invoices')
    } catch (e) {
      toast(e.response?.data?.detail || 'Failed to save', 'err')
    } finally {
      setSaving(false)
    }
  }

  const previewData = { ...buildPayload(), num: invNum || 'GBG-PREVIEW' }

  if (loading) return <div style={{ padding: 48, color: 'var(--muted)', textAlign: 'center' }}>Loading…</div>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>{isEdit ? 'Edit' : 'New'} <em>Invoice</em></h1>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard/invoices')}>← Back</button>
      </div>

      <div className="card">
        {/* LANGUAGE */}
        <div className={styles.sectionTitle}>Invoice Language</div>
        <div className={styles.langPicker}>
          {LANGS.map(l => (
            <button key={l.code} className={`${styles.langPill} ${form.lang === l.code ? styles.langActive : ''}`} onClick={() => set('lang', l.code)}>
              {l.label}
            </button>
          ))}
        </div>

        <hr className={styles.divider} />

        {/* DETAILS */}
        <div className={styles.sectionTitle}>Invoice Details</div>
        <div className={styles.grid3}>
          <div className="field"><label>Invoice Number</label><input value={invNum || (isEdit ? '…' : 'Auto-generated')} readOnly /></div>
          <div className="field"><label>Issue Date</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></div>
          <div className="field"><label>Due Date</label><input type="date" value={form.due} onChange={e => set('due', e.target.value)} /></div>
        </div>
        <div className={styles.grid3}>
          <div className="field"><label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="pending">Pending Payment</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div className="field"><label>Event Type</label><input value={form.event} onChange={e => set('event', e.target.value)} placeholder="e.g. Wedding, Birthday…" /></div>
          <div className="field"><label>Event Date</label><input type="date" value={form.edate} onChange={e => set('edate', e.target.value)} /></div>
        </div>

        <hr className={styles.divider} />

        {/* CLIENT */}
        <div className={styles.sectionTitle}>Client Information</div>
        <div className={styles.grid2}>
          <div className="field"><label>Client Name</label><input value={form.client} onChange={e => set('client', e.target.value)} placeholder="Full name or company" /></div>
          <div className="field"><label>Phone</label><input value={form.cphone} onChange={e => set('cphone', e.target.value)} placeholder="+995 …" /></div>
        </div>
        <div className={styles.grid2}>
          <div className="field"><label>Email</label><input type="email" value={form.cemail} onChange={e => set('cemail', e.target.value)} placeholder="email@example.com" /></div>
          <div className="field"><label>Address</label><input value={form.caddr} onChange={e => set('caddr', e.target.value)} placeholder="City, Address" /></div>
        </div>

        <hr className={styles.divider} />

        {/* LINE ITEMS */}
        <div className={styles.sectionTitle}>Services &amp; Line Items</div>
        <table className={styles.liTable}>
          <thead>
            <tr>
              <th style={{ width: '42%' }}>Description</th>
              <th style={{ width: '13%' }}>Qty</th>
              <th style={{ width: '20%' }}>Unit Price (₾)</th>
              <th style={{ width: '18%', textAlign: 'right' }}>Total</th>
              <th style={{ width: '7%' }} />
            </tr>
          </thead>
          <tbody>
            {form.items.map((item, i) => (
              <tr key={i}>
                <td><input value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} placeholder="Service description" /></td>
                <td><input type="number" value={item.qty} min={1} onChange={e => updateItem(i, 'qty', e.target.value)} style={{ textAlign: 'center' }} /></td>
                <td><input type="number" value={item.price} step="0.01" onChange={e => updateItem(i, 'price', e.target.value)} placeholder="0.00" /></td>
                <td><span className={styles.liTotal}>₾{(item.total || 0).toFixed(2)}</span></td>
                <td>{form.items.length > 1 && <button className={styles.rmBtn} onClick={() => removeItem(i)}>×</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={styles.addItemBtn} onClick={addItem}>+ Add Line Item</button>

        <div className={styles.totals}>
          <div className={styles.totalsInner}>
            <div className={styles.totRow}><span>Subtotal</span><span>₾{subtotal.toFixed(2)}</span></div>
            <div className={styles.totRow}><span>VAT (0%)</span><span>₾0.00</span></div>
            <div className={`${styles.totRow} ${styles.totGrand}`}><span>Total Due</span><span className={styles.totAmount}>₾{subtotal.toFixed(2)}</span></div>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* PAYMENT */}
        <div className={styles.sectionTitle}>Payment &amp; Notes</div>
        <div className={styles.grid2}>
          <div className="field"><label>Bank Name</label><input value={form.bank} onChange={e => set('bank', e.target.value)} placeholder="e.g. TBC Bank" /></div>
          <div className="field"><label>Account / IBAN</label><input value={form.iban} onChange={e => set('iban', e.target.value)} placeholder="GE… or account number" /></div>
        </div>
        <div className="field"><label>Notes / Payment Terms</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Thank you for booking Glambot Georgia! Payment due within 7 days." />
        </div>

        <div className={styles.actions}>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard/invoices')} disabled={saving}>Cancel</button>
          <button className="btn btn-ghost" onClick={() => save('draft')} disabled={saving}>Save Draft</button>
          <button className="btn btn-outline" onClick={() => setPreview(true)} disabled={saving}>👁 Preview</button>
          <button className="btn btn-gold" onClick={() => save()} disabled={saving}>{saving ? 'Saving…' : 'Save Invoice'}</button>
        </div>
      </div>

      {previewOpen && <InvoicePreview invoice={previewData} onClose={() => setPreview(false)} />}
    </div>
  )
}
