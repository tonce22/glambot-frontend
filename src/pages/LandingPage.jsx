import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import LangSwitcher from '../components/LangSwitcher'
import styles from './LandingPage.module.css'

export default function LandingPage() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className={styles.page} lang={lang === 'ka' ? 'ka' : undefined}>

      {/* ── NAV ── */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.logo}>Glambot<span> Georgia</span></div>
        <div className={styles.navLinks}>
          <a onClick={() => scrollTo('sec-about')}>{t.nav.about}</a>
          <a onClick={() => scrollTo('sec-services')}>{t.nav.services}</a>
          <a onClick={() => scrollTo('sec-gallery')}>{t.nav.gallery}</a>
          <a onClick={() => scrollTo('sec-contact')}>{t.nav.contact}</a>
          <LangSwitcher />
          <button className={styles.btnLogin} onClick={() => navigate('/login')}>
            {t.nav.login}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroOrb1} />
        <div className={styles.heroOrb2} />
        <div className={styles.heroGrid} />
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>{t.hero.tag}</div>
          <h1 className={styles.heroH1}>
            {t.hero.h1a}<br />
            <em>{t.hero.h1em}</em><br />
            {t.hero.h1b}
          </h1>
          <p className={styles.heroSub}>{t.hero.sub}</p>
          <div className={styles.heroBtns}>
            <button className={styles.btnPrimary} onClick={() => scrollTo('sec-services')}>
              {t.hero.btn1}
            </button>
            <button className={styles.btnSecondary} onClick={() => scrollTo('sec-contact')}>
              {t.hero.btn2}
            </button>
          </div>
        </div>
        <div className={styles.heroFloat}>Glambot ✦<br />Georgia ✦<br />Est.2024</div>
      </section>

      {/* ── ABOUT ── */}
      <section className={`${styles.sec} ${styles.secBorder}`} id="sec-about">
        <div className={styles.aboutGrid}>
          <div className={styles.aboutFrame} style={{ padding: 0, overflow: 'hidden' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/9PtZSgiDSso"
              title="Glambot Georgia"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block', width: '100%', height: '100%', minHeight: '400px' }}
            />
          </div>
          <div>
            <div className={styles.secTag}>{t.about.tag}</div>
            <h2 className={styles.secH}>
              {t.about.h}<br /><em>{t.about.hem}</em>
            </h2>
            <p className={styles.aboutP}>{t.about.p1}</p>
            <p className={styles.aboutP}>{t.about.p2}</p>
            <div className={styles.aboutStats}>
              <div className={styles.stat}>
                <div className={styles.statN}>120+</div>
                <div className={styles.statL}>{t.about.events}</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statN}>240fps</div>
                <div className={styles.statL}>{t.about.slowmo}</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statN}>4K</div>
                <div className={styles.statL}>{t.about.res}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className={`${styles.sec} ${styles.secBorder} ${styles.secDark}`} id="sec-services">
        <div className={styles.secTag}>{t.services.tag}</div>
        <h2 className={styles.secH}>{t.services.h} <em>{t.services.hem}</em></h2>
        <div className={styles.srvGrid}>
          {[
            { n: '01', ico: '💍', name: t.services.s1.name, desc: t.services.s1.desc },
            { n: '02', ico: '🎉', name: t.services.s2.name, desc: t.services.s2.desc },
            { n: '03', ico: '🎞️', name: t.services.s3.name, desc: t.services.s3.desc },
          ].map(s => (
            <div key={s.n} className={styles.srvCard}>
              <div className={styles.srvNum}>{s.n}</div>
              <div className={styles.srvIco}>{s.ico}</div>
              <div className={styles.srvName}>{s.name}</div>
              <div className={styles.srvDesc}>{s.desc}</div>
              <div className={styles.srvPrice}>{t.services.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className={`${styles.sec} ${styles.secBorder}`} id="sec-gallery">
        <div className={styles.secTag}>{t.gallery.tag}</div>
        <h2 className={styles.secH}>{t.gallery.h} <em>{t.gallery.hem}</em></h2>
        <div className={styles.galGrid}>
          {[
            { ico: '🎬', span2: true },
            { ico: '💃' },
            { ico: '🌸' },
            { ico: '✨' },
            { ico: '🎊' },
          ].map((g, i) => (
            <div key={i} className={`${styles.galItem} ${g.span2 ? styles.galSpan : ''}`}>
              <div className={styles.galInner}>
                <div className={styles.galIco}>{g.ico}</div>
                <div className={styles.galLbl}>{t.gallery.items[i]}</div>
              </div>
              <div className={styles.galHover} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className={`${styles.sec} ${styles.secBorder} ${styles.secDark}`} id="sec-contact">
        <div className={styles.contactWrap}>
          <div className={`${styles.secTag} ${styles.centered}`}>{t.contact.tag}</div>
          <h2 className={`${styles.secH} ${styles.centered}`}>
            {t.contact.h} <em>{t.contact.hem}</em>
          </h2>
          <p className={styles.contactP}>{t.contact.p}</p>
          <button className={styles.btnPrimary} onClick={() => window.location.href = 'tel:+995557072000'}>
            +995 557 07 20 00
          </button>
          <div className={styles.contactRow}>
            <div>
              <div className={styles.ciLbl}>{t.contact.phone}</div>
              <div className={styles.ciVal}>+995 557 07 20 00</div>
            </div>
            <div>
              <div className={styles.ciLbl}>{t.contact.owner}</div>
              <div className={styles.ciVal}>Rezo Tabidze</div>
            </div>
            <div>
              <div className={styles.ciLbl}>{t.contact.location}</div>
              <div className={styles.ciVal}>{t.contact.loc}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footLogo}>Glambot Georgia</div>
        <div className={styles.footCopy}>{t.footer.copy}</div>
        <div className={styles.footAdmin} onClick={() => navigate('/login')}>
          {t.footer.admin}
        </div>
      </footer>

    </div>
  )
}
