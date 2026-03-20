import { useState } from 'react'
import { INVOICE_T } from '../utils/invoiceTranslations'
import styles from './InvoicePreview.module.css'

const LANGS = [{ code: 'en', label: '🇬🇧 English' }, { code: 'ka', label: '🇬🇪 Georgian' }, { code: 'ru', label: '🇷🇺 Russian' }]

export default function InvoicePreview({ invoice, onClose }) {
  const [lang, setLang] = useState(invoice.lang || 'en')
  const t = INVOICE_T[lang] || INVOICE_T.en
  const items = invoice.items || []
  const total = invoice.total || 0

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.box}>
        {/* TOOLBAR */}
        <div className={styles.toolbar}>
          <div className={styles.tabs}>
            {LANGS.map(l => (
              <button key={l.code} className={`${styles.tab} ${lang === l.code ? styles.tabActive : ''}`} onClick={() => setLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
          <div className={styles.actions}>
            <button className={styles.printBtn} onClick={() => window.print()}>🖨 Print / PDF</button>
            <button className={styles.closeBtn} onClick={onClose}>✕ Close</button>
          </div>
        </div>

        {/* INVOICE DOCUMENT */}
        <div className={`${styles.doc} inv-print-area`} lang={lang === 'ka' ? 'ka' : undefined}>
          {/* HEADER */}
          <div className={styles.docTop}>
            <div>
              <div className={styles.brandName}>Glambot Georgia</div>
              <div className={styles.brandIm}>Tezo Tabidze · {t.im}</div>
              <div className={styles.brandContact}>
                +995 557 07 20 00
                {invoice.bank && <><br />{invoice.bank}{invoice.iban ? ` · ${invoice.iban}` : ''}</>}
              </div>
            </div>
            <div className={styles.metaBlock}>
              <div className={styles.metaWord}>{t.word}</div>
              <div className={styles.metaNum}>{invoice.num || '—'}</div>
              <div className={styles.metaDate}>{t.issued}: {invoice.date || '—'}</div>
              <div className={styles.metaDate}>{t.due}: {invoice.due || '—'}</div>
            </div>
          </div>

          {/* PARTIES */}
          <div className={styles.parties}>
            <div>
              <div className={styles.partyLabel}>{t.from}</div>
              <div className={styles.partyName}>Tezo Tabidze</div>
              <div className={styles.partyDetails}>Glambot Georgia<br />{t.im}<br />+995 557 07 20 00</div>
            </div>
            <div>
              <div className={styles.partyLabel}>{t.billTo}</div>
              <div className={styles.partyName}>{invoice.client || '—'}</div>
              <div className={styles.partyDetails}>
                {[invoice.cphone, invoice.cemail, invoice.caddr].filter(Boolean).join('\n').split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
              </div>
            </div>
          </div>

          {invoice.event && (
            <div className={styles.eventLine}>{t.event}: <strong>{invoice.event}</strong></div>
          )}

          {/* TABLE */}
          <table className={styles.invTable}>
            <thead>
              <tr>
                <th>{t.desc}</th><th>{t.qty}</th><th>{t.unit}</th>
                <th style={{ textAlign: 'right' }}>{t.total}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#aaa', padding: 24 }}>—</td></tr>
              ) : items.map((item, i) => (
                <tr key={i}>
                  <td>{item.desc || '—'}</td>
                  <td>{item.qty}</td>
                  <td>₾{parseFloat(item.price || 0).toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>₾{parseFloat(item.total || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTALS */}
          <div className={styles.totalsWrap}>
            <div className={styles.totalsInner}>
              <div className={styles.totRow}><span>{t.subtotal}</span><span>₾{total.toFixed(2)}</span></div>
              <div className={styles.totRow}><span>{t.vat}</span><span>₾0.00</span></div>
              <div className={`${styles.totRow} ${styles.totGrand}`}>
                <span>{t.totalDue}</span>
                <span className={styles.grandAmount}>₾{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className={styles.docFooter}>
            <div className={styles.footNote}>{invoice.notes || t.thanks}</div>
            <div className={styles.footBank}>
              <strong>{invoice.bank || '—'}</strong><br />
              {invoice.iban || '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
