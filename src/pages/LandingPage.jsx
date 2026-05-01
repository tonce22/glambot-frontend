import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import LangSwitcher from '../components/LangSwitcher'
import s from './LandingPage.module.css'

const WHATSAPP_NUMBER = '995557072000'
const INSTAGRAM_URL   = 'https://www.instagram.com/glambot.georgia'
const YOUTUBE_URL     = 'https://www.youtube.com/@glambot.georgia'
const TIKTOK_URL      = 'https://www.tiktok.com/@glambot.georgia'

const SHOWCASE_VIDEOS = [
  { id: null, label: { en: 'Wedding Highlight 2024', ka: 'საქორწილო ჰაილაითი 2024', ru: 'Свадебный хайлайт 2024' } },
  { id: null, label: { en: 'First Dance Slow Motion', ka: 'პირველი ცეკვა სლოუ მოუშენი', ru: 'Первый танец слоу-моушен' } },
  { id: null, label: { en: 'Event Reel 2024', ka: 'ღონისძიების ვიდეო 2024', ru: 'Видео мероприятий 2024' } },
]

function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// SVG icons
const IcoWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)
const IcoInsta = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)
const IcoYT = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)
const IcoTikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

export default function LandingPage() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [scrolled,  setScrolled]  = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [form,      setForm]      = useState({ name: '', phone: '', eventType: '', date: '', message: '' })
  const [formSent,  setFormSent]  = useState(false)
  const [waVisible, setWaVisible] = useState(false)

  const [heroRef,    heroIn]    = useInView(0.05)
  const [aboutRef,   aboutIn]   = useInView()
  const [srvRef,     srvIn]     = useInView()
  const [galRef,     galIn]     = useInView()
  const [videoRef,   videoIn]   = useInView()
  const [contactRef, contactIn] = useInView()

  const onScroll = useCallback(() => {
    const el = document.documentElement
    const scrolled = el.scrollTop
    const max = el.scrollHeight - el.clientHeight
    setProgress(max > 0 ? (scrolled / max) * 100 : 0)
    setScrolled(scrolled > 40)
    setWaVisible(scrolled > 300)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handleFormChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const { name, phone, eventType, date } = form
    const msg = lang === 'ka'
      ? `გამარჯობა! მინდა დავჯავშნო Glambot Georgia.\n\nსახელი: ${name}\nტელეფონი: ${phone}\nღონისძიება: ${eventType}\nთარიღი: ${date}${form.message ? `\nშენიშვნა: ${form.message}` : ''}`
      : lang === 'ru'
      ? `Здравствуйте! Хочу забронировать Glambot Georgia.\n\nИмя: ${name}\nТелефон: ${phone}\nМероприятие: ${eventType}\nДата: ${date}${form.message ? `\nСообщение: ${form.message}` : ''}`
      : `Hello! I'd like to book Glambot Georgia.\n\nName: ${name}\nPhone: ${phone}\nEvent: ${eventType}\nDate: ${date}${form.message ? `\nMessage: ${form.message}` : ''}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
    setFormSent(true)
    setTimeout(() => setFormSent(false), 5000)
  }

  const L = { // localised labels without touching the full translation object
    name:    lang === 'ka' ? 'სახელი'                : lang === 'ru' ? 'Имя'             : 'Your Name',
    phone:   lang === 'ka' ? 'ტელეფონი / WhatsApp'   : lang === 'ru' ? 'Телефон'         : 'Phone / WhatsApp',
    etype:   lang === 'ka' ? 'ღონისძიების ტიპი'      : lang === 'ru' ? 'Тип мероприятия' : 'Event Type',
    date:    lang === 'ka' ? 'თარიღი'                : lang === 'ru' ? 'Дата'            : 'Event Date',
    msg:     lang === 'ka' ? 'შეტყობინება'           : lang === 'ru' ? 'Сообщение'       : 'Message',
    select:  lang === 'ka' ? '— აირჩიეთ —'          : lang === 'ru' ? '— Выберите —'    : '— Select —',
    wed:     lang === 'ka' ? 'ქორწილი'               : lang === 'ru' ? 'Свадьба'         : 'Wedding',
    bday:    lang === 'ka' ? 'დაბადების დღე'         : lang === 'ru' ? 'День рождения'   : 'Birthday',
    corp:    lang === 'ka' ? 'კორპორატიული'          : lang === 'ru' ? 'Корпоратив'      : 'Corporate',
    other:   lang === 'ka' ? 'სხვა'                  : lang === 'ru' ? 'Другое'          : 'Other',
    book:    lang === 'ka' ? 'WhatsApp-ით დაჯავშნე'  : lang === 'ru' ? 'Забронировать'   : 'Book via WhatsApp',
    sent:    lang === 'ka' ? '✓ WhatsApp გაიხსნა!'   : lang === 'ru' ? '✓ WhatsApp открыт!' : '✓ WhatsApp opened!',
    coming:  lang === 'ka' ? 'მალე'                  : lang === 'ru' ? 'Скоро'           : 'Coming Soon',
    follow:  lang === 'ka' ? 'გამოგვყევი'            : lang === 'ru' ? 'Подписывайтесь'  : 'Follow us',
  }

  return (
    <div className={s.page} lang={lang === 'ka' ? 'ka' : undefined}>

      {/* ── SCROLL PROGRESS BAR ── */}
      <div className={s.progressBar} style={{ width: `${progress}%` }} />

      {/* ── FLOATING WHATSAPP ── */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${s.waFloat} ${waVisible ? s.waVisible : ''}`}
        aria-label="Chat on WhatsApp"
      >
        <IcoWhatsApp />
        <span className={s.waPulse} />
      </a>

      {/* ── NAV ── */}
      <nav className={`${s.nav} ${scrolled ? s.navScrolled : ''}`}>
        <div className={s.logo}>Glambot<span> Georgia</span></div>

        {/* Desktop links */}
        <div className={s.navLinks}>
          <a onClick={() => scrollTo('sec-about')}>{t.nav.about}</a>
          <a onClick={() => scrollTo('sec-services')}>{t.nav.services}</a>
          <a onClick={() => scrollTo('sec-gallery')}>{t.nav.gallery}</a>
          <a onClick={() => scrollTo('sec-contact')}>{t.nav.contact}</a>
          <LangSwitcher />
          <button className={s.btnLogin} onClick={() => navigate('/login')}>{t.nav.login}</button>
        </div>

        {/* Mobile right side */}
        <div className={s.navRight}>
          <LangSwitcher />
          <button
            className={`${s.burger} ${menuOpen ? s.burgerOpen : ''}`}
            onClick={() => setMenuOpen(m => !m)}
            aria-label="menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU OVERLAY ── */}
      <div className={`${s.mobileMenu} ${menuOpen ? s.mobileMenuOpen : ''}`}>
        <div className={s.mobileMenuInner}>
          <nav className={s.mobileNav}>
            {[
              ['sec-about',   t.nav.about],
              ['sec-services',t.nav.services],
              ['sec-gallery', t.nav.gallery],
              ['sec-contact', t.nav.contact],
            ].map(([id, label], i) => (
              <a
                key={id}
                className={s.mobileNavLink}
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => scrollTo(id)}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className={s.mobileSocials}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><IcoInsta /></a>
            <a href={YOUTUBE_URL}   target="_blank" rel="noopener noreferrer"><IcoYT /></a>
            <a href={TIKTOK_URL}    target="_blank" rel="noopener noreferrer"><IcoTikTok /></a>
          </div>
          <button className={s.mobileWaBtn} onClick={() => { window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank'); setMenuOpen(false) }}>
            <IcoWhatsApp /> {L.book}
          </button>
        </div>
      </div>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section className={s.hero} ref={heroRef}>
        <div className={s.heroNoise} />
        <div className={`${s.heroOrb} ${s.heroOrb1}`} />
        <div className={`${s.heroOrb} ${s.heroOrb2}`} />
        <div className={`${s.heroOrb} ${s.heroOrb3}`} />
        <div className={s.heroLines}>
          {[...Array(8)].map((_,i) => <div key={i} className={s.heroLine} style={{ animationDelay: `${i * 0.4}s` }} />)}
        </div>

        <div className={`${s.heroContent} ${heroIn ? s.fadeUp : ''}`}>
          <div className={s.heroEyebrow}>
            <span className={s.heroEyebrowLine} />
            {t.hero.tag}
            <span className={s.heroEyebrowLine} />
          </div>
          <h1 className={s.heroH1}>
            <span className={s.heroH1Plain}>{t.hero.h1a}</span>
            <em className={s.heroH1Gold}>{t.hero.h1em}</em>
            <span className={s.heroH1Plain}>{t.hero.h1b}</span>
          </h1>
          <p className={s.heroSub}>{t.hero.sub}</p>
          <div className={s.heroBtns}>
            <button className={s.btnGold} onClick={() => scrollTo('sec-contact')}>
              {t.hero.btn2}
            </button>
            <button className={s.btnOutline} onClick={() => scrollTo('sec-services')}>
              {t.hero.btn1}
            </button>
          </div>
        </div>

        <div className={s.heroScroll} onClick={() => scrollTo('sec-about')}>
          <div className={s.heroScrollDot} />
        </div>

        <div className={s.heroBadge}>
          <div className={s.heroBadgeInner}>
            <div className={s.heroBadgeTxt}>Glambot ✦ Georgia ✦ Est.2024</div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          STATS RIBBON
      ════════════════════════════════ */}
      <div className={s.statsRibbon}>
        {[
          { n: '120+', l: t.about.events },
          { n: '240fps', l: t.about.slowmo },
          { n: '4K', l: t.about.res },
          { n: '100%', l: lang === 'ka' ? 'ხარისხი' : lang === 'ru' ? 'Качество' : 'Quality' },
        ].map((st, i) => (
          <div key={i} className={s.statItem}>
            <div className={s.statN}>{st.n}</div>
            <div className={s.statL}>{st.l}</div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════
          ABOUT
      ════════════════════════════════ */}
      <section className={s.sec} id="sec-about" ref={aboutRef}>
        <div className={`${s.aboutGrid} ${aboutIn ? s.fadeUp : ''}`}>
          <div className={s.aboutVisual}>
            <div className={s.aboutFilm}>
              <div className={s.filmHoles}>
                {[...Array(6)].map((_,i) => <div key={i} className={s.filmHole} />)}
              </div>
              <div className={s.filmCenter}>
                <div className={s.filmIcon}>🎬</div>
                <div className={s.filmLabel}>{t.about.frame}</div>
              </div>
              <div className={s.filmHoles}>
                {[...Array(6)].map((_,i) => <div key={i} className={s.filmHole} />)}
              </div>
            </div>
            <div className={s.aboutDeco1} />
            <div className={s.aboutDeco2} />
          </div>
          <div className={s.aboutText}>
            <div className={s.secLabel}>{t.about.tag}</div>
            <h2 className={s.secH}>{t.about.h}<br /><em>{t.about.hem}</em></h2>
            <p className={s.aboutP}>{t.about.p1}</p>
            <p className={s.aboutP}>{t.about.p2}</p>
            <div className={s.aboutBadge}>
              <div className={s.aboutBadgeDot} />
              {lang === 'ka' ? 'ინდივიდუალური მეწარმე · Tezo Tabidze'
               : lang === 'ru' ? 'Индивидуальный предприниматель · Tezo Tabidze'
               : 'Individual Entrepreneur · Tezo Tabidze'}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SERVICES
      ════════════════════════════════ */}
      <section className={`${s.sec} ${s.secDark}`} id="sec-services" ref={srvRef}>
        <div className={`${s.secHeader} ${srvIn ? s.fadeUp : ''}`}>
          <div className={s.secLabel}>{t.services.tag}</div>
          <h2 className={s.secH}>{t.services.h} <em>{t.services.hem}</em></h2>
        </div>
        <div className={`${s.srvGrid} ${srvIn ? s.srvVisible : ''}`}>
          {[
            { n: '01', ico: '💍', name: t.services.s1.name, desc: t.services.s1.desc },
            { n: '02', ico: '🎉', name: t.services.s2.name, desc: t.services.s2.desc },
            { n: '03', ico: '🎞️', name: t.services.s3.name, desc: t.services.s3.desc },
          ].map((srv, i) => (
            <div key={srv.n} className={s.srvCard} style={{ '--i': i }}>
              <div className={s.srvTopLine} />
              <div className={s.srvNum}>{srv.n}</div>
              <div className={s.srvIco}>{srv.ico}</div>
              <div className={s.srvName}>{srv.name}</div>
              <div className={s.srvDesc}>{srv.desc}</div>
              <a
                className={s.srvCta}
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.services.price}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          GALLERY
      ════════════════════════════════ */}
      <section className={s.sec} id="sec-gallery" ref={galRef}>
        <div className={`${s.secHeader} ${galIn ? s.fadeUp : ''}`}>
          <div className={s.secLabel}>{t.gallery.tag}</div>
          <h2 className={s.secH}>{t.gallery.h} <em>{t.gallery.hem}</em></h2>
        </div>
        <div className={`${s.galGrid} ${galIn ? s.galVisible : ''}`}>
          {[
            { ico: '🎬', gradient: 'linear-gradient(135deg,#1a1500 0%,#2d2210 60%,#1a1500 100%)', span: true },
            { ico: '💃', gradient: 'linear-gradient(135deg,#0e1a10 0%,#1a2d14 100%)' },
            { ico: '🌸', gradient: 'linear-gradient(135deg,#1a0e10 0%,#2d1418 100%)' },
            { ico: '✨', gradient: 'linear-gradient(135deg,#0e0e1a 0%,#141428 100%)' },
            { ico: '🎊', gradient: 'linear-gradient(135deg,#1a1200 0%,#2d2008 100%)' },
          ].map((g, i) => (
            <div
              key={i}
              className={`${s.galItem} ${g.span ? s.galSpan : ''}`}
              style={{ '--delay': `${i * 0.1}s`, background: g.gradient }}
            >
              <div className={s.galShimmer} />
              <div className={s.galContent}>
                <div className={s.galIco}>{g.ico}</div>
                <div className={s.galLbl}>{t.gallery.items[i]}</div>
              </div>
              <div className={s.galBorder} />
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          VIDEO SHOWCASE
      ════════════════════════════════ */}
      <section className={`${s.sec} ${s.secDark}`} id="sec-videos" ref={videoRef}>
        <div className={`${s.secHeader} ${videoIn ? s.fadeUp : ''}`}>
          <div className={s.secLabel}>Glambot Reels</div>
          <h2 className={s.secH}>
            {lang === 'ka' ? 'ნახე ჩვენი' : lang === 'ru' ? 'Посмотри' : 'Watch Us'}
            {' '}<em>{lang === 'ka' ? 'ნამუშევარი' : lang === 'ru' ? 'наши работы' : 'in Action'}</em>
          </h2>
        </div>
        <div className={`${s.videoGrid} ${videoIn ? s.fadeUp : ''}`}>
          {SHOWCASE_VIDEOS.map((v, i) => (
            <div key={i} className={s.videoCard} style={{ animationDelay: `${i * 0.15}s` }}>
              {v.id ? (
                <iframe
                  className={s.videoFrame}
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.label[lang] || v.label.en}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className={s.videoPlaceholder}>
                  <div className={s.videoPlayBtn}>
                    <span>▶</span>
                  </div>
                  <div className={s.videoComingSoon}>{L.coming}</div>
                </div>
              )}
              <div className={s.videoMeta}>
                <div className={s.videoLabel}>{v.label[lang] || v.label.en}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={s.socialRow}>
          <span className={s.socialRowLabel}>{L.follow}:</span>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={s.socialBtn}><IcoInsta /> Instagram</a>
          <a href={YOUTUBE_URL}   target="_blank" rel="noopener noreferrer" className={s.socialBtn}><IcoYT />    YouTube</a>
          <a href={TIKTOK_URL}    target="_blank" rel="noopener noreferrer" className={s.socialBtn}><IcoTikTok /> TikTok</a>
        </div>
      </section>

      {/* ════════════════════════════════
          CONTACT / BOOKING
      ════════════════════════════════ */}
      <section className={s.sec} id="sec-contact" ref={contactRef}>
        <div className={`${s.contactGrid} ${contactIn ? s.fadeUp : ''}`}>

          {/* Left — info */}
          <div className={s.contactInfo}>
            <div className={s.secLabel}>{t.contact.tag}</div>
            <h2 className={s.secH}>{t.contact.h} <em>{t.contact.hem}</em></h2>
            <p className={s.contactP}>{t.contact.p}</p>
            <div className={s.contactDetails}>
              <div className={s.contactDetail}>
                <div className={s.cdIcon}>📞</div>
                <div>
                  <div className={s.cdLabel}>{t.contact.phone}</div>
                  <a href="tel:+995557072000" className={s.cdVal}>+995 557 07 20 00</a>
                </div>
              </div>
              <div className={s.contactDetail}>
                <div className={s.cdIcon}>👤</div>
                <div>
                  <div className={s.cdLabel}>{t.contact.owner}</div>
                  <div className={s.cdVal}>Tezo Tabidze</div>
                </div>
              </div>
              <div className={s.contactDetail}>
                <div className={s.cdIcon}>📍</div>
                <div>
                  <div className={s.cdLabel}>{t.contact.location}</div>
                  <div className={s.cdVal}>{t.contact.loc}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className={s.contactFormWrap}>
            <form className={s.bookForm} onSubmit={handleFormSubmit}>
              <div className={s.bookRow}>
                <div className={s.bookField}>
                  <label>{L.name}</label>
                  <input name="name" value={form.name} onChange={handleFormChange} required
                    placeholder={lang === 'ka' ? 'თქვენი სახელი' : lang === 'ru' ? 'Ваше имя' : 'Full name'} />
                </div>
                <div className={s.bookField}>
                  <label>{L.phone}</label>
                  <input name="phone" value={form.phone} onChange={handleFormChange} required
                    placeholder="+995 5XX XX XX XX" type="tel" />
                </div>
              </div>
              <div className={s.bookRow}>
                <div className={s.bookField}>
                  <label>{L.etype}</label>
                  <select name="eventType" value={form.eventType} onChange={handleFormChange} required>
                    <option value="">{L.select}</option>
                    <option value="Wedding">{L.wed}</option>
                    <option value="Birthday">{L.bday}</option>
                    <option value="Corporate">{L.corp}</option>
                    <option value="Other">{L.other}</option>
                  </select>
                </div>
                <div className={s.bookField}>
                  <label>{L.date}</label>
                  <input name="date" type="date" value={form.date} onChange={handleFormChange} required />
                </div>
              </div>
              <div className={s.bookField}>
                <label>{L.msg}</label>
                <textarea name="message" value={form.message} onChange={handleFormChange} rows={3}
                  placeholder={lang === 'ka' ? 'დამატებითი ინფორმაცია...' : lang === 'ru' ? 'Дополнительная информация...' : 'Any details about your event...'} />
              </div>
              <button type="submit" className={s.btnWhatsapp}>
                <IcoWhatsApp />
                {L.book}
              </button>
              {formSent && <div className={s.formSent}>{L.sent}</div>}
            </form>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer className={s.footer}>
        <div className={s.footerTop}>
          <div className={s.footLogo}>Glambot<span> Georgia</span></div>
          <div className={s.footSocials}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IcoInsta /></a>
            <a href={YOUTUBE_URL}   target="_blank" rel="noopener noreferrer" aria-label="YouTube"><IcoYT /></a>
            <a href={TIKTOK_URL}    target="_blank" rel="noopener noreferrer" aria-label="TikTok"><IcoTikTok /></a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><IcoWhatsApp /></a>
          </div>
        </div>
        <div className={s.footerBottom}>
          <div className={s.footCopy}>{t.footer.copy}</div>
          <div className={s.footAdmin} onClick={() => navigate('/login')}>{t.footer.admin}</div>
        </div>
      </footer>

    </div>
  )
}
