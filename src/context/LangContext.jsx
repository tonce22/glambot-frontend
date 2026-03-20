import { createContext, useContext, useState } from 'react'

const LangContext = createContext()

// ── TRANSLATIONS ──────────────────────────────────────────
// Georgian text is marked with [KA: ...] — replace with correct text
export const T = {
  en: {
    // Nav
    nav: { about: 'About', services: 'Services', gallery: 'Gallery', contact: 'Contact', login: 'Login' },
    // Hero
    hero: {
      tag: 'Wedding & Event Cinema',
      h1a: 'Capture Your',
      h1em: 'Glamour',
      h1b: 'in Motion',
      sub: 'Professional Glambot slow-motion video services for weddings and events across Georgia. Unforgettable moments, beautifully preserved forever.',
      btn1: 'View Services',
      btn2: 'Book Now',
    },
    // About
    about: {
      tag: 'About Us',
      h: 'The Art of',
      hem: 'Slow Motion',
      frame: 'Slow Motion Magic',
      p1: 'Glambot Georgia brings the Hollywood-style slow motion experience to your most precious celebrations. We specialise in capturing those fleeting, magical moments — a twirl of a dress, a burst of confetti, the first dance.',
      p2: 'As an Individual Entrepreneur, we offer a personal, dedicated service tailored to every client. Your celebration is unique, and your Glambot video should be too.',
      events: 'Events',
      slowmo: 'Slow Motion',
      res: 'Resolution',
    },
    // Services
    services: {
      tag: 'What We Offer',
      h: 'Our',
      hem: 'Services',
      price: 'Contact for pricing →',
      s1: { name: 'Wedding Glambot', desc: 'Full day coverage with our signature Glambot setup. Ceremony, reception, and all the beautiful moments in between.' },
      s2: { name: 'Event Coverage', desc: 'Corporate events, birthdays, and private parties. Bring the slow-motion magic to any celebration.' },
      s3: { name: 'Highlight Reel', desc: 'Professionally edited slow motion highlight video delivered within 48 hours. A keepsake for life.' },
    },
    // Gallery
    gallery: {
      tag: 'Our Work',
      h: 'Moments',
      hem: 'Frozen in Time',
      items: ['Wedding Reel 2024', 'First Dance', 'Bouquet Toss', 'Reception Magic', 'Celebrations'],
    },
    // Contact
    contact: {
      tag: 'Get in Touch',
      h: 'Book Your',
      hem: 'Glambot',
      p: 'Ready to add cinematic slow motion to your special day? Get in touch to check availability and discuss your event.',
      phone: 'Phone',
      owner: 'Owner',
      location: 'Location',
      loc: 'Georgia',
    },
    // Footer
    footer: {
      copy: '© 2025 Tezo Tabidze · Individual Entrepreneur',
      admin: 'Admin →',
    },
  },

  // ── GEORGIAN ─────────────────────────────────────────────
  // [KA: placeholder] = replace with correct Georgian text
ka: {
  nav: {
    about: 'ჩვენს შესახებ',
    services: 'სერვისები',
    gallery: 'გალერეა',
    contact: 'კონტაქტი',
    login: 'შესვლა',
  },
  hero: {
    tag: 'ქორწილები და ღონისძიებები',
    h1a: 'შეინახე შენი',
    h1em: 'სილამაზე',
    h1b: 'მოძრაობაში',
    sub: 'პროფესიონალური Glambot სლოუ-მოუშენ ვიდეო სერვისი ქორწილებისა და ღონისძიებებისთვის საქართველოში.',
    btn1: 'სერვისები',
    btn2: 'დაჯავშნე',
  },
  about: {
    tag: 'ჩვენს შესახებ',
    h: 'სლოუ მოუშენის',
    hem: 'ხელოვნება',
    frame: 'სლოუ მოუშენის მაგია',
    p1: 'Glambot Georgia გთავაზობთ ჰოლივუდური სტილის სლოუ-მოუშენ გამოცდილებას თქვენს ყველაზე განსაკუთრებულ ღონისძიებებზე.',
    p2: 'როგორც ინდივიდუალური მეწარმე, გთავაზობთ პერსონალიზებულ და მაღალი ხარისხის მომსახურებას.',
    events: 'ღონისძიებები',
    slowmo: 'სლოუ-მოუშენი',
    res: 'მაღალი გარჩევადობა',
  },
  services: {
    tag: 'ჩვენი შეთავაზება',
    h: 'ჩვენი',
    hem: 'სერვისები',
    price: 'ფასი გასარკვევია →',
    s1: { 
      name: 'საქორწილო Glambot', 
      desc: 'სრული დღის გადაღება პროფესიონალური Glambot ტექნოლოგიით.' 
    },
    s2: { 
      name: 'ღონისძიების გადაღება', 
      desc: 'კორპორატიული ღონისძიებები, დაბადების დღეები და კერძო წვეულებები.' 
    },
    s3: { 
      name: 'ჰაილაით ვიდეო', 
      desc: 'პროფესიონალურად დამონტაჟებული სლოუ-მოუშენ ვიდეო 48 საათში.' 
    },
  },
  gallery: {
    tag: 'ჩვენი ნამუშევრები',
    h: 'მომენტები',
    hem: 'გაყინული დროში',
    items: [
      'საქორწილო ვიდეო 2024',
      'პირველი ცეკვა',
      'თაიგულის სროლა',
      'ბანკეტის მომენტები',
      'დღესასწაულები'
    ],
  },
  contact: {
    tag: 'დაგვიკავშირდით',
    h: 'დაჯავშნე',
    hem: 'Glambot',
    p: 'გსურთ დაამატოთ კინემატოგრაფიული სლოუ-მოუშენი თქვენს განსაკუთრებულ დღეს?',
    phone: 'ტელეფონი',
    owner: 'მფლობელი',
    location: 'მდებარეობა',
    loc: 'საქართველო',
  },
  footer: {
    copy: '© 2025 თეზო ტაბიძე · ინდივიდუალური მეწარმე',
    admin: 'ადმინი →',
  },
},

  // ── RUSSIAN ───────────────────────────────────────────────
  ru: {
    nav: { about: 'О нас', services: 'Услуги', gallery: 'Галерея', contact: 'Контакты', login: 'Войти' },
    hero: {
      tag: 'Свадьбы и мероприятия',
      h1a: 'Запечатлей свой',
      h1em: 'Гламур',
      h1b: 'в движении',
      sub: 'Профессиональная съёмка Glambot в замедленной съёмке для свадеб и мероприятий по всей Грузии. Незабываемые моменты, сохранённые навсегда.',
      btn1: 'Наши услуги',
      btn2: 'Забронировать',
    },
    about: {
      tag: 'О нас',
      h: 'Искусство',
      hem: 'слоу-моушен',
      frame: 'Магия замедленной съёмки',
      p1: 'Glambot Georgia привносит опыт голливудской замедленной съёмки на ваши самые значимые торжества. Мы специализируемся на съёмке волшебных моментов — кружение платья, взрыв конфетти, первый танец.',
      p2: 'Как индивидуальный предприниматель, мы предлагаем персональный сервис, адаптированный под каждого клиента. Ваш праздник уникален, и ваше видео должно быть таким же.',
      events: 'Мероприятий',
      slowmo: 'Слоу-моушен',
      res: 'Разрешение',
    },
    services: {
      tag: 'Что мы предлагаем',
      h: 'Наши',
      hem: 'Услуги',
      price: 'Цена по запросу →',
      s1: { name: 'Свадебный Glambot', desc: 'Съёмка на весь день с нашим фирменным Glambot. Церемония, банкет и все красивые моменты.' },
      s2: { name: 'Съёмка мероприятий', desc: 'Корпоративы, дни рождения и частные вечеринки. Магия слоу-моушен на любом торжестве.' },
      s3: { name: 'Highlight-видео', desc: 'Профессионально смонтированное слоу-моушен видео, готовое в течение 48 часов.' },
    },
    gallery: {
      tag: 'Наши работы',
      h: 'Моменты',
      hem: 'застывшие во времени',
      items: ['Свадебное видео 2024', 'Первый танец', 'Бросок букета', 'Магия банкета', 'Торжества'],
    },
    contact: {
      tag: 'Связаться с нами',
      h: 'Забронируйте',
      hem: 'Glambot',
      p: 'Хотите добавить кинематографичный слоу-моушен в ваш особенный день? Свяжитесь с нами для проверки доступности.',
      phone: 'Телефон',
      owner: 'Владелец',
      location: 'Местоположение',
      loc: 'Грузия',
    },
    footer: {
      copy: '© 2025 Тезо Табидзе · Индивидуальный предприниматель',
      admin: 'Админ →',
    },
  },
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')
  return (
    <LangContext.Provider value={{ lang, setLang, t: T[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
