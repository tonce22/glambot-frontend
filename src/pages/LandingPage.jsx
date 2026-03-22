import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import LangSwitcher from '../components/LangSwitcher'
import styles from './LandingPage.module.css'
import axios from 'axios'

const API = 'https://glambot-backend.onrender.com'

export default function LandingPage() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [content, setContent] = useState({})
  const [gallery, setGallery] = useState([])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    axios.get(`${API}/api/content`).then(r => setContent(r.data)).catch(() => {})
    axios.get(`${API}/api/gallery`).then(r => setGallery(r.data)).catch(() => {})
  }, [])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const p1 = content.about_p1 || t.about.p1
  const p2 = content.about_p2 || t.about.p2
  const statEvents = content.about_stat_events || '120+'
  const statSlowmo = content.about_stat_slowmo || '240fps'
  const statRes = content.about_stat_res || '4K'
  const logoUrl = content.logo_url || ''
  const phone = content.contact_phone || '+995 557 07 20 00'
  const email = content.contact_email || ''
  const address = content.contact_address || ''

  const srv = (n) => ({
    name: content[`srv${n}_name`] || t.services[`s${n}`]?.name || '',
    desc: content[`srv${n}_desc`] || t.services[`s${n}`]?.desc || '',
    price: content[`srv${n}_price`] || t.services.price,
  })

  return (
    <div className={styles.page} lang={lang === 'ka' ? 'ka' : undefined}>

      {/* NAV */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.logoWrap}>
          {logoUrl
            ? <img src={logoUrl} alt="Glambot Georgia" className={styles.logoImg} />
            : <div className={styles.logoText}>Glambot<span> Georgia</span></div>
          }
        </div>
        <div className={styles.navLinks}>
          <a onClick={() => scrollTo('sec-about')}>{t.nav.about}</a>
          <a onClick={() => scrollTo('sec-services')}>{t.nav.services}</a>
          <a onClick={() => scrollTo('sec-gallery')}>{t.nav.gallery}</a>
          <a onClick={() => scrollTo('sec-contact')}>{t.nav.contact}</a>
          <LangSwitcher />
          <button className={styles.btnLogin} onClick={() => navigate('/login')}>{t.nav.login}</button>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroOrb1} /><div className={styles.heroOrb2} /><div className={styles.heroGrid} />
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>{t.hero.tag}</div>
          <h1 className={styles.heroH1}>{t.hero.h1a}<br /><em>{t.hero.h1em}</em><br />{t.hero.h1b}</h1>
          <p className={styles.heroSub}>{t.hero.sub}</p>
          <div className={styles.heroBtns}>
            <button className={styles.btnPrimary} onClick={() => scrollTo('sec-services')}>{t.hero.btn1}</button>
            <button className={styles.btnSecondary} onClick={() => scrollTo('sec-contact')}>{t.hero.btn2}</button>
          </div>
        </div>
        <div className={styles.heroFloat}>Glambot ✦<br />Georgia ✦<br />Est.2026</div>
      </section>

      {/* ABOUT */}
      <section className={`${styles.sec} ${styles.secBorder}`} id="sec-about">
        <div className={styles.aboutGrid}>
          <div className={styles.aboutFrame}>
            <div className={styles.aboutFrameIcon}>🎬</div>
            <div className={styles.aboutFrameTxt}>{t.about.frame}</div>
          </div>
          <div>
            <div className={styles.secTag}>{t.about.tag}</div>
            <h2 className={styles.secH}>{t.about.h}<br /><em>{t.about.hem}</em></h2>
            <p className={styles.aboutP}>{p1}</p>
            <p className={styles.aboutP}>{p2}</p>
            <div className={styles.aboutStats}>
              <div className={styles.stat}><div className={styles.statN}>{statEvents}</div><div className={styles.statL}>{t.about.events}</div></div>
              <div className={styles.stat}><div className={styles.statN}>{statSlowmo}</div><div className={styles.statL}>{t.about.slowmo}</div></div>
              <div className={styles.stat}><div className={styles.statN}>{statRes}</div><div className={styles.statL}>{t.about.res}</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className={`${styles.sec} ${styles.secBorder} ${styles.secDark}`} id="sec-services">
        <div className={styles.secTag}>{t.services.tag}</div>
        <h2 className={styles.secH}>{t.services.h} <em>{t.services.hem}</em></h2>
        <div className={styles.srvGrid}>
          {[1,2,3].map((n,i) => {
            const s = srv(n)
            const icons = ['💍','🎉','🎞️']
            const nums = ['01','02','03']
            return (
              <div key={n} className={styles.srvCard}>
                <div className={styles.srvNum}>{nums[i]}</div>
                <div className={styles.srvIco}>{icons[i]}</div>
                <div className={styles.srvName}>{s.name}</div>
                <div className={styles.srvDesc}>{s.desc}</div>
                <button
                  className={styles.srvPriceBtn}
                  onClick={() => scrollTo('sec-contact')}
                >
                  {s.price}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* GALLERY */}
      <section className={`${styles.sec} ${styles.secBorder}`} id="sec-gallery">
        <div className={styles.secTag}>{t.gallery.tag}</div>
        <h2 className={styles.secH}>{t.gallery.h} <em>{t.gallery.hem}</em></h2>
        {gallery.length > 0 ? (
          <div className={styles.galDynGrid}>
            {gallery.map((item, i) => (
              <div key={item.id} className={`${styles.galDynItem} ${i===0 ? styles.galDynSpan : ''}`}>
                {item.media_type === 'youtube'
                  ? <iframe src={item.url} title={item.title||'video'} frameBorder="0" allowFullScreen style={{ width:'100%', height:'100%', minHeight:200, display:'block' }}/>
                  : item.media_type === 'video'
                  ? <video src={item.url} style={{ width:'100%', height:'100%', objectFit:'cover' }} controls/>
                  : <img src={item.url} alt={item.title||''} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                }
                {item.title && <div className={styles.galCaption}>{item.title}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.galGrid}>
            {[{ico:'🎬',span2:true},{ico:'💃'},{ico:'🌸'},{ico:'✨'},{ico:'🎊'}].map((g,i) => (
              <div key={i} className={`${styles.galItem} ${g.span2 ? styles.galSpan : ''}`}>
                <div className={styles.galInner}>
                  <div className={styles.galIco}>{g.ico}</div>
                  <div className={styles.galLbl}>{t.gallery.items[i]}</div>
                </div>
                <div className={styles.galHover} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CONTACT */}
      <section className={`${styles.sec} ${styles.secBorder} ${styles.secDark}`} id="sec-contact">
        <div className={styles.contactWrap}>
          <div className={`${styles.secTag} ${styles.centered}`}>{t.contact.tag}</div>
          <h2 className={`${styles.secH} ${styles.centered}`}>{t.contact.h} <em>{t.contact.hem}</em></h2>
          <p className={styles.contactP}>{t.contact.p}</p>
          <button className={styles.btnPrimary} onClick={() => window.location.href=`tel:${phone.replace(/\s/g,'')}`}>{phone}</button>
          <div className={styles.contactRow}>
            <div><div className={styles.ciLbl}>{t.contact.phone}</div><div className={styles.ciVal}>{phone}</div></div>
            <div><div className={styles.ciLbl}>{t.contact.owner}</div><div className={styles.ciVal}>Rezo Tabidze</div></div>
            <div><div className={styles.ciLbl}>{t.contact.location}</div><div className={styles.ciVal}>{address || t.contact.loc}</div></div>
            {email && <div><div className={styles.ciLbl}>Email</div><div className={styles.ciVal}>{email}</div></div>}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footLogo}>Glambot Georgia</div>
        <div className={styles.footCopy}>{t.footer.copy}</div>
        <div className={styles.footAdmin} onClick={() => navigate('/login')}>{t.footer.admin}</div>
      </footer>
    </div>
  )
}
