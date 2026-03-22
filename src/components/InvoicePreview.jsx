import { useState } from 'react'
import { INVOICE_T } from '../utils/invoiceTranslations'
import styles from './InvoicePreview.module.css'

const LANGS = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'ka', label: '🇬🇪 Georgian' },
  { code: 'ru', label: '🇷🇺 Russian' }
]

export default function InvoicePreview({ invoice, onClose }) {
  const [lang, setLang] = useState(invoice.lang || 'en')
  const t = INVOICE_T[lang] || INVOICE_T.en
  const items = invoice.items || []
  const total = invoice.total || 0

  const handlePrint = () => {
    const printContent = document.getElementById('inv-print-content').innerHTML
    const win = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Invoice ${invoice.num || ''}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@300;400;500&family=Noto+Sans+Georgian:wght@300;400;500&display=swap" rel="stylesheet"/>
        <style>
          * { box-sizing:border-box; margin:0; padding:0; }
          body { font-family:'Outfit','Noto Sans Georgian',sans-serif; background:#F5F0E4; color:#1A1A10; padding:40px; }
          .inv-doc { max-width:740px; margin:0 auto; }
          .inv-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; }
          .idb-name { font-family:'Cormorant Garamond',serif; font-size:26px; color:#8B6B2E; letter-spacing:.06em; }
          .idb-im { font-size:12px; color:#888; margin-top:4px; }
          .idb-contact { margin-top:10px; font-size:13px; color:#555; line-height:1.8; }
          .idm-word { font-family:'Cormorant Garamond',serif; font-size:38px; color:#0C0C0A; font-style:italic; font-weight:300; }
          .idm-num { font-size:14px; color:#8B6B2E; margin-top:6px; letter-spacing:.08em; }
          .idm-date { font-size:13px; color:#888; margin-top:3px; }
          .inv-parties { display:grid; grid-template-columns:1fr 1fr; gap:32px; background:rgba(201,169,110,.08); border-radius:4px; padding:24px; margin-bottom:36px; }
          .ip-lbl { font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:#C9A96E; margin-bottom:6px; font-weight:500; }
          .ip-name { font-size:15px; font-weight:500; color:#1A1A10; margin-bottom:4px; }
          .ip-det { font-size:13px; color:#666; line-height:1.8; }
          .event-line { margin-bottom:18px; font-size:13px; color:#888; }
          .event-line strong { color:#555; }
          table { width:100%; border-collapse:collapse; margin-bottom:24px; font-size:13px; }
          thead tr { background:#1A1A10; }
          th { padding:11px 14px; text-align:left; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:#C9A96E; font-weight:400; }
          th:last-child { text-align:right; }
          td { padding:12px 14px; border-bottom:1px solid rgba(201,169,110,.14); color:#333; }
          td:last-child { text-align:right; font-weight:500; color:#1A1A10; }
          tbody tr:last-child td { border-bottom:none; }
          .tots-wrap { display:flex; justify-content:flex-end; margin-bottom:32px; }
          .tots-inner { min-width:240px; border-top:1px solid rgba(201,169,110,.28); }
          .tot-row { display:flex; justify-content:space-between; padding:9px 0; font-size:13px; color:#666; border-bottom:1px solid rgba(201,169,110,.1); }
          .tot-grand { border-bottom:none!important; padding-top:12px!important; color:#1A1A10!important; }
          .grand-amt { font-family:'Cormorant Garamond',serif; font-size:24px; color:#8B6B2E; }
          .inv-foot { border-top:1px solid rgba(201,169,110,.22); padding-top:22px; display:flex; justify-content:space-between; align-items:flex-end; }
          .foot-note { font-size:13px; color:#888; max-width:300px; line-height:1.7; }
          .foot-bank { text-align:right; font-size:12px; color:#999; line-height:1.9; }
          .foot-bank strong { color:#555; }
        </style>
      </head>
      <body>
        <div class="inv-doc">${printContent}</div>
      </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 500)
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.box}>
        <div className={styles.toolbar}>
          <div className={styles.tabs}>
            {LANGS.map(l => (
              <button key={l.code} className={`${styles.tab} ${lang === l.code ? styles.tabOn : ''}`}
                onClick={() => setLang(l.code)}>{l.label}</button>
            ))}
          </div>
          <div className={styles.acts}>
            <button className={styles.printBtn} onClick={handlePrint}>🖨 Print / PDF</button>
            <button className={styles.closeBtn} onClick={onClose}>✕ Close</button>
          </div>
        </div>

        <div className={styles.doc} lang={lang === 'ka' ? 'ka' : undefined}>
          <div id="inv-print-content">
            <div class="inv-top">
              <div>
                <div className={styles.brandName}>Glambot Georgia</div>
                <div className={styles.brandIm}>Tezo Tabidze · {t.im}</div>
                <div className={styles.brandContact}>
                  +995 557 07 20 00
                  {invoice.bank && <><br />{invoice.bank}{invoice.iban ? ` · ${invoice.iban}` : ''}</>}
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div className={styles.metaWord}>{t.word}</div>
                <div className={styles.metaNum}>{invoice.num || '—'}</div>
                <div className={styles.metaDate}>{t.issued}: {invoice.date || '—'}</div>
                <div className={styles.metaDate}>{t.due}: {invoice.due || '—'}</div>
              </div>
            </div>

            <div className={styles.parties}>
              <div>
                <div className={styles.partyLbl}>{t.from}</div>
                <div className={styles.partyName}>Tezo Tabidze</div>
                <div className={styles.partyDet}>Glambot Georgia<br />{t.im}<br />+995 557 07 20 00</div>
              </div>
              <div>
                <div className={styles.partyLbl}>{t.billTo}</div>
                <div className={styles.partyName}>{invoice.client || '—'}</div>
                <div className={styles.partyDet}>
                  {[invoice.cphone, invoice.cemail, invoice.caddr].filter(Boolean).map((x,i) => <span key={i}>{x}<br/></span>)}
                </div>
              </div>
            </div>

            {invoice.event && (
              <div className={styles.eventLine}>{t.event}: <strong>{invoice.event}</strong></div>
            )}

            <table className={styles.invTable}>
              <thead>
                <tr>
                  <th>{t.desc}</th><th>{t.qty}</th><th>{t.unit}</th>
                  <th style={{ textAlign:'right' }}>{t.total}</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign:'center', color:'#aaa', padding:20 }}>—</td></tr>
                ) : items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.desc || '—'}</td>
                    <td>{item.qty}</td>
                    <td>₾{parseFloat(item.price || 0).toFixed(2)}</td>
                    <td style={{ textAlign:'right', fontWeight:500 }}>₾{parseFloat(item.total || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.totsWrap}>
              <div className={styles.totsInner}>
                <div className={styles.totRow}><span>{t.subtotal}</span><span>₾{total.toFixed(2)}</span></div>
                <div className={styles.totRow}><span>{t.vat}</span><span>₾0.00</span></div>
                <div className={`${styles.totRow} ${styles.totGrand}`}>
                  <span>{t.totalDue}</span>
                  <span className={styles.grandAmt}>₾{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className={styles.docFoot}>
              <div className={styles.footNote}>{invoice.notes || t.thanks}</div>
              <div className={styles.footBank}>
                <strong>{invoice.bank || '—'}</strong><br />{invoice.iban || '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
