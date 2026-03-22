import { useState } from 'react'
import { INVOICE_T } from '../utils/invoiceTranslations'
import styles from './InvoicePreview.module.css'

// ─────────────────────────────────────────────────────────
// COMPANY DETAILS — edit these to update invoice info
// ─────────────────────────────────────────────────────────
const COMPANY = {
  name:    'Glambot Georgia',
  owner:   'Rezo Tabidze',          // ← Change name here
  phone:   '+995 557 07 20 00',     // ← Change phone here
  address: 'Tbilisi, Georgia',      // ← Change address here
  im_en:   'Individual Entrepreneur',
  im_ka:   'ინდივიდუალური მეწარმე',
  im_ru:   'Индивидуальный предприниматель',
}
// ─────────────────────────────────────────────────────────

const LANGS = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'ka', label: '🇬🇪 Georgian' },
  { code: 'ru', label: '🇷🇺 Russian' }
]

const PRINT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@300;400;500&family=Noto+Sans+Georgian:wght@300;400;500&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Outfit','Noto Sans Georgian',sans-serif; background:#F5F0E4; color:#1A1A10; padding:48px; }
  .wrap { max-width:700px; margin:0 auto; }
  .top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:48px; }
  .brand-name { font-family:'Cormorant Garamond',serif; font-size:28px; color:#8B6B2E; letter-spacing:.06em; }
  .brand-sub { font-size:12px; color:#888; margin-top:4px; letter-spacing:.04em; }
  .brand-contact { margin-top:12px; font-size:13px; color:#555; line-height:1.9; }
  .meta { text-align:right; }
  .meta-word { font-family:'Cormorant Garamond',serif; font-size:42px; color:#0C0C0A; font-style:italic; font-weight:300; }
  .meta-num { font-size:14px; color:#8B6B2E; margin-top:8px; letter-spacing:.08em; }
  .meta-date { font-size:13px; color:#888; margin-top:3px; }
  .parties { display:grid; grid-template-columns:1fr 1fr; gap:36px; background:rgba(201,169,110,.08); border-radius:4px; padding:26px; margin-bottom:40px; }
  .party-lbl { font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:#C9A96E; margin-bottom:8px; font-weight:500; }
  .party-name { font-size:16px; font-weight:500; color:#1A1A10; margin-bottom:4px; }
  .party-det { font-size:13px; color:#666; line-height:1.9; }
  .event-line { margin-bottom:20px; font-size:13px; color:#888; }
  .event-line strong { color:#555; }
  table { width:100%; border-collapse:collapse; margin-bottom:28px; font-size:14px; }
  thead tr { background:#1A1A10; }
  th { padding:12px 16px; text-align:left; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:#C9A96E; font-weight:400; }
  th:last-child { text-align:right; }
  td { padding:13px 16px; border-bottom:1px solid rgba(201,169,110,.14); color:#333; }
  td:last-child { text-align:right; font-weight:500; color:#1A1A10; }
  tbody tr:last-child td { border-bottom:none; }
  .tots-wrap { display:flex; justify-content:flex-end; margin-bottom:36px; }
  .tots-inner { min-width:250px; border-top:1px solid rgba(201,169,110,.28); }
  .tot-row { display:flex; justify-content:space-between; padding:10px 0; font-size:14px; color:#666; border-bottom:1px solid rgba(201,169,110,.1); }
  .tot-grand { border-bottom:none !important; padding-top:14px !important; color:#1A1A10 !important; }
  .grand-amt { font-family:'Cormorant Garamond',serif; font-size:26px; color:#8B6B2E; }
  .foot { border-top:1px solid rgba(201,169,110,.22); padding-top:24px; display:flex; justify-content:space-between; align-items:flex-end; }
  .foot-note { font-size:13px; color:#888; max-width:320px; line-height:1.75; }
  .foot-bank { text-align:right; font-size:12px; color:#999; line-height:2; }
  .foot-bank strong { color:#555; }
`

export default function InvoicePreview({ invoice, onClose }) {
  const [lang, setLang] = useState(invoice.lang || 'en')
  const t = INVOICE_T[lang] || INVOICE_T.en
  const items = invoice.items || []
  const total = invoice.total || 0
  const im = lang === 'ka' ? COMPANY.im_ka : lang === 'ru' ? COMPANY.im_ru : COMPANY.im_en

  const buildHTML = () => `
    <div class="top">
      <div>
        <div class="brand-name">${COMPANY.name}</div>
        <div class="brand-sub">${COMPANY.owner} · ${im}</div>
        <div class="brand-contact">
          ${COMPANY.phone}
          ${COMPANY.address ? `<br/>${COMPANY.address}` : ''}
          ${invoice.bank ? `<br/>${invoice.bank}${invoice.iban ? ' · ' + invoice.iban : ''}` : ''}
        </div>
      </div>
      <div class="meta">
        <div class="meta-word">${t.word}</div>
        <div class="meta-num">${invoice.num || '—'}</div>
        <div class="meta-date">${t.issued}: ${invoice.date || '—'}</div>
        <div class="meta-date">${t.due}: ${invoice.due || '—'}</div>
      </div>
    </div>
    <div class="parties">
      <div>
        <div class="party-lbl">${t.from}</div>
        <div class="party-name">${COMPANY.owner}</div>
        <div class="party-det">${COMPANY.name}<br/>${im}<br/>${COMPANY.phone}${COMPANY.address ? '<br/>' + COMPANY.address : ''}</div>
      </div>
      <div>
        <div class="party-lbl">${t.billTo}</div>
        <div class="party-name">${invoice.client || '—'}</div>
        <div class="party-det">${[invoice.cphone, invoice.cemail, invoice.caddr].filter(Boolean).join('<br/>')}</div>
      </div>
    </div>
    ${invoice.event ? `<div class="event-line">${t.event}: <strong>${invoice.event}</strong></div>` : ''}
    <table>
      <thead><tr>
        <th>${t.desc}</th><th>${t.qty}</th><th>${t.unit}</th><th style="text-align:right">${t.total}</th>
      </tr></thead>
      <tbody>
        ${items.length === 0
          ? `<tr><td colspan="4" style="text-align:center;color:#aaa;padding:20px">—</td></tr>`
          : items.map(item => `<tr>
              <td>${item.desc || '—'}</td>
              <td>${item.qty}</td>
              <td>₾${parseFloat(item.price || 0).toFixed(2)}</td>
              <td>₾${parseFloat(item.total || 0).toFixed(2)}</td>
            </tr>`).join('')
        }
      </tbody>
    </table>
    <div class="tots-wrap">
      <div class="tots-inner">
        <div class="tot-row"><span>${t.subtotal}</span><span>₾${total.toFixed(2)}</span></div>
        <div class="tot-row"><span>${t.vat}</span><span>₾0.00</span></div>
        <div class="tot-row tot-grand"><span>${t.totalDue}</span><span class="grand-amt">₾${total.toFixed(2)}</span></div>
      </div>
    </div>
    <div class="foot">
      <div class="foot-note">${invoice.notes || t.thanks}</div>
      <div class="foot-bank"><strong>${invoice.bank || '—'}</strong><br/>${invoice.iban || '—'}</div>
    </div>
  `

  const handlePrint = () => {
    const win = window.open('', '_blank')
    win.document.write(`<!DOCTYPE html>
      <html><head>
        <meta charset="UTF-8"/>
        <title>Invoice ${invoice.num || ''}</title>
        <style>${PRINT_STYLES}</style>
      </head><body>
        <div class="wrap">${buildHTML()}</div>
      </body></html>`)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 800)
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.box}>
        <div className={styles.toolbar}>
          <div className={styles.tabs}>
            {LANGS.map(l => (
              <button key={l.code}
                className={`${styles.tab} ${lang === l.code ? styles.tabOn : ''}`}
                onClick={() => setLang(l.code)}>{l.label}
              </button>
            ))}
          </div>
          <div className={styles.acts}>
            <button className={styles.printBtn} onClick={handlePrint}>🖨 Print / PDF</button>
            <button className={styles.closeBtn} onClick={onClose}>✕ Close</button>
          </div>
        </div>

        <div className={styles.doc} lang={lang === 'ka' ? 'ka' : undefined}>
          {/* TOP */}
          <div className={styles.invTop}>
            <div>
              <div className={styles.brandName}>{COMPANY.name}</div>
              <div className={styles.brandIm}>{COMPANY.owner} · {im}</div>
              <div className={styles.brandContact}>
                {COMPANY.phone}
                {COMPANY.address && <><br />{COMPANY.address}</>}
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

          {/* PARTIES */}
          <div className={styles.parties}>
            <div>
              <div className={styles.partyLbl}>{t.from}</div>
              <div className={styles.partyName}>{COMPANY.owner}</div>
              <div className={styles.partyDet}>
                {COMPANY.name}<br />{im}<br />{COMPANY.phone}
                {COMPANY.address && <><br />{COMPANY.address}</>}
              </div>
            </div>
            <div>
              <div className={styles.partyLbl}>{t.billTo}</div>
              <div className={styles.partyName}>{invoice.client || '—'}</div>
              <div className={styles.partyDet}>
                {[invoice.cphone, invoice.cemail, invoice.caddr].filter(Boolean).map((x,i) => (
                  <span key={i}>{x}<br /></span>
                ))}
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
                <th style={{ textAlign:'right' }}>{t.total}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0
                ? <tr><td colSpan={4} style={{ textAlign:'center', color:'#aaa', padding:20 }}>—</td></tr>
                : items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.desc || '—'}</td>
                    <td>{item.qty}</td>
                    <td>₾{parseFloat(item.price || 0).toFixed(2)}</td>
                    <td style={{ textAlign:'right', fontWeight:500 }}>₾{parseFloat(item.total || 0).toFixed(2)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          {/* TOTALS */}
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

          {/* FOOTER */}
          <div className={styles.docFoot}>
            <div className={styles.footNote}>{invoice.notes || t.thanks}</div>
            <div className={styles.footBank}>
              <strong>{invoice.bank || '—'}</strong><br />{invoice.iban || '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
