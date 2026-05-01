import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import LangSwitcher from '../components/LangSwitcher'
import styles from './Landing.module.css'

export default function Landing() {
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
          <a onClick={() => scrollTo('sec-about')}>{t('nav_about')}</a>
          <a onClick={() => scrollTo('sec-services')}>{t('nav_services')}</a>
          <a onClick={() => scrollTo('sec-gallery')}>{t('nav_gallery')}</a>
          <a onClick={() => scrollTo('sec-contact')}>{t('nav_contact')}</a>
          <LangSwitcher />
          <button className={styles.btnLogin} onClick={() => navigate('/login')}>
            {t('nav_login')}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroOrb1} />
        <div className={styles.heroOrb2} />
        <div className={styles.heroGrid} />
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>{t('hero_tag')}</div>
          <h1 className={styles.heroH1}>
            {t('hero_h1_1')}<br />
            <em>{t('hero_h1_em')}</em><br />
            {t('hero_h1_2')}
          </h1>
          <p className={styles.heroSub}>{t('hero_sub')}</p>
          <div className={styles.heroBtns}>
            <button className={styles.btnPrimary} onClick={() => scrollTo('sec-services')}>
              {t('hero_btn1')}
            </button>
            <button className={styles.btnSecondary} onClick={() => scrollTo('sec-contact')}>
              {t('hero_btn2')}
            </button>
          </div>
        </div>
        <div className={styles.heroFloat}>Glambot ✦<br />Georgia ✦<br />Est.2024</div>
      </section>

      {/* ── ABOUT ── */}
      <section className={`${styles.sec} ${styles.secBorder}`} id="sec-about">
        <div className={styles.aboutGrid}>
          <div className={styles.aboutFrame}>
            <div className={styles.aboutFrameIcon}>🎬</div>
            <div className={styles.aboutFrameTxt}>Slow Motion Magic</div>
          </div>
          <div>
            <div className={styles.secTag}>{t('about_tag')}</div>
            <h2 className={styles.secH}>
              {t('about_h1')}<br /><em>{t('about_h1_em')}</em>
            </h2>
            <p className={styles.aboutP}>{t('about_p1')}</p>
            <p className={styles.aboutP}>{t('about_p2')}</p>
            <div className={styles.aboutStats}>
              <div className={styles.stat}><div className={styles.statN}>120+</div><div className={styles.statL}>{t('stat_events')}</div></div>
              <div className={styles.stat}><div className={styles.statN}>240fps</div><div className={styles.statL}>{t('stat_slow')}</div></div>
              <div className={styles.stat}><div className={styles.statN}>4K</div><div className={styles.statL}>{t('stat_res')}</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className={`${styles.sec} ${styles.secBorder} ${styles.secDark}`} id="sec-services">
        <div className={styles.secTag}>{t('srv_tag')}</div>
        <h2 className={styles.secH}>{t('srv_h')} <em>{t('srv_h_em')}</em></h2>
        <div className={styles.srvGrid}>
          {[
            { n:'01', ico:'💍', name: t('srv1_name'), desc: t('srv1_desc') },
            { n:'02', ico:'🎉', name: t('srv2_name'), desc: t('srv2_desc') },
            { n:'03', ico:'🎞️', name: t('srv3_name'), desc: t('srv3_desc') },
          ].map(s => (
            <div key={s.n} className={styles.srvCard}>
              <div className={styles.srvNum}>{s.n}</div>
              <div className={styles.srvIco}>{s.ico}</div>
              <div className={styles.srvName}>{s.name}</div>
              <div className={styles.srvDesc}>{s.desc}</div>
              <div className={styles.srvPrice}>{t('srv_price')}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className={`${styles.sec} ${styles.secBorder}`} id="sec-gallery">
        <div className={styles.secTag}>{t('gal_tag')}</div>
        <h2 className={styles.secH}>{t('gal_h')} <em>{t('gal_h_em')}</em></h2>
        <div className={styles.galGrid}>
          {[
            { ico:'🎬', lbl: t('gal_1'), span2: true },
            { ico:'💃', lbl: t('gal_2') },
            { ico:'🌸', lbl: t('gal_3') },
            { ico:'✨', lbl: t('gal_4') },
            { ico:'🎊', lbl: t('gal_5') },
          ].map((g, i) => (
            <div key={i} className={`${styles.galItem} ${g.span2 ? styles.galSpan : ''}`}>
              <div className={styles.galInner}>
                <div className={styles.galIco}>{g.ico}</div>
                <div className={styles.galLbl}>{g.lbl}</div>
              </div>
              <div className={styles.galHover} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className={`${styles.sec} ${styles.secBorder} ${styles.secDark}`} id="sec-contact">
        <div className={styles.contactWrap}>
          <div className={`${styles.secTag} ${styles.centered}`}>{t('con_tag')}</div>
          <h2 className={`${styles.secH} ${styles.centered}`}>{t('con_h')} <em>{t('con_h_em')}</em></h2>
          <p className={styles.contactP}>{t('con_p')}</p>
          <button className={styles.btnPrimary} onClick={() => window.location.href='tel:+995557072000'}>
            +995 557 07 20 00
          </button>
          <div className={styles.contactRow}>
            <div><div className={styles.ciLbl}>{t('con_phone')}</div><div className={styles.ciVal}>+995 557 07 20 00</div></div>
            <div><div className={styles.ciLbl}>{t('con_owner')}</div><div className={styles.ciVal}>Tezo Tabidze</div></div>
            <div><div className={styles.ciLbl}>{t('con_loc')}</div><div className={styles.ciVal}>{t('con_geo')}</div></div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footLogo}>Glambot Georgia</div>
        <div className={styles.footCopy}>{t('foot_copy')}</div>
        <div className={styles.footAdmin} onClick={() => navigate('/login')}>{t('foot_admin')}</div>
      </footer>

    </div>
  )
}
